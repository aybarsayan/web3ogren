# Metadata Parsing

Metadata standardı, NFT'ler, NFT Koleksiyonları ve Jetton'ları kapsayan, TON Geliştirme Teklifi 64 [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) belgelerinde belirtilmiştir.

TON'da, varlıkların üç tür metadata içerebilir: on-chain, semi-chain ve off-chain.

- **On-chain metadata:** blok zincirinin içinde depolanan, isim, özellikler ve resim gibi verileri içerir.
- **Off-chain metadata:** zincir dışındaki bir metadata dosyasına bağlantı kullanılarak depolanır.
- **Semi-chain metadata:** isimler veya özellikler gibi küçük alanların blok zincirinde depolanmasına olanak tanırken, resmi zincir dışında barındıran ve sadece onun için bir bağlantı depolayan, ikisi arasında bir hibrittir.

## Snake Data Encoding

Snake kodlama formatı, verilerin bir kısmının standartlaştırılmış bir hücrede depolanmasına, geri kalan kısmının ise bir çocuk hücrede (yeniden çağırma şeklinde) depolanmasına olanak tanır. Snake kodlama formatının önüne `0x00` baytı eklenmelidir. TL-B şeması:

```
tail#_ {bn:#} b:(bits bn) = SnakeData ~0;
cons#_ {bn:#} {n:#} b:(bits bn) next:^(SnakeData ~n) = SnakeData ~(n + 1);
```

:::info
Snake formatı, verilerin maksimum boyutu aştığında, hücrede ek veri depolamak için kullanılır. Bu, verilerin bir kısmının kök hücrede, geri kalan kısmının ise ilk çocuk hücrede depolanması ve tüm verilerin depolanana kadar bunun geri çağrılarak yapılmasıyla gerçekleştirilir.
:::

Aşağıda TypeScript'te Snake formatı kodlama ve kod çözme örneği verilmiştir:

```typescript
export function makeSnakeCell(data: Buffer): Cell {
  const chunks = bufferToChunks(data, 127)

  if (chunks.length === 0) {
    return beginCell().endCell()
  }

  if (chunks.length === 1) {
    return beginCell().storeBuffer(chunks[0]).endCell()
  }

  let curCell = beginCell()

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i]

    curCell.storeBuffer(chunk)

    if (i - 1 >= 0) {
      const nextCell = beginCell()
      nextCell.storeRef(curCell)
      curCell = nextCell
    }
  }

  return curCell.endCell()
}

export function flattenSnakeCell(cell: Cell): Buffer {
  let c: Cell | null = cell;

  const bitResult = new BitBuilder();
  while (c) {
    const cs = c.beginParse();
    if (cs.remainingBits === 0) {
      break;
    }

    const data = cs.loadBits(cs.remainingBits);
    bitResult.writeBits(data);
    c = c.refs && c.refs[0];
  }

  const endBits = bitResult.build();
  const reader = new BitReader(endBits);

  return reader.loadBuffer(reader.remaining / 8);
}
```

:::warning
Snake formatını kullanırken, `0x00` bayt ön ekinin kök hücrede her zaman gerekli olmadığını belirtmek gerekir; bu, off-chain NFT içeriği için geçerlidir. Ayrıca, hücreler parseling işlemini basitleştirmek için bitler yerine baytlarla doldurulur. Referansın ebeveyn hücresine yazıldıktan sonra eklenmesini önlemek için, snake hücresi ters sırayla inşa edilir.
:::

## Chunked Encoding

Chunked kodlama formatı, verileri chunk_index'ten chunk'a kadar bir sözlük veri yapısı kullanarak depolamak için kullanılır. Chunked kodlama `0x01` baytıyla başlamalıdır. TL-B şeması:

```
chunked_data#_ data:(HashMapE 32 ^(SnakeData ~0)) = ChunkedData;
```

Aşağıda TypeScript'te chunked veri kod çözme örneği verilmiştir:

```typescript
interface ChunkDictValue {
  content: Buffer;
}
export const ChunkDictValueSerializer = {
  serialize(src: ChunkDictValue, builder: Builder) {},
  parse(src: Slice): ChunkDictValue {
    const snake = flattenSnakeCell(src.loadRef());
    return { content: snake };
  },
};

export function ParseChunkDict(cell: Slice): Buffer {
  const dict = cell.loadDict(
    Dictionary.Keys.Uint(32),
    ChunkDictValueSerializer
  );

  let buf = Buffer.alloc(0);
  for (const [_, v] of dict) {
    buf = Buffer.concat([buf, v.content]);
  }
  return buf;
}
```

## NFT metadata attributes

| Attribute     | Type         | Requirement | Description                                                                                                                                                        |
|---------------|--------------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `uri`         | ASCII string | optional    | "Semi-chain content layout." ile kullanılan metadata içeren JSON belgesine işaret eden bir URI.                                                                   |
| `name`        | UTF8 string  | optional    | varlığı tanımlar.                                                                                                                                                 |
| `description` | UTF8 string  | optional    | varlığı açıklar.                                                                                                                                                  |
| `image`       | ASCII string | optional    | bir mime türü görüntü ile kaynağa işaret eden bir URI.                                                                                                           |
| `image_data`  | binary*      | optional    | on-chain düzeni için görüntünün ikili temsilini veya off-chain düzen için base64'ü temsil eder.                                                                  |

## Jetton metadata attributes

1. `uri` - İsteğe bağlı. "Semi-chain content layout." kullanan. ASCII string. Metadata içeren JSON belgesine işaret eden bir URI.
2. `name` - İsteğe bağlı. UTF8 string. Varlığı tanımlar.
3. `description` - İsteğe bağlı. UTF8 string. Varlığı açıklar.
4. `image` - İsteğe bağlı. ASCII string. bir mime türü görüntü ile kaynağa işaret eden bir URI.
5. `image_data` - İsteğe bağlı. On-chain düzen için görüntünün ikili temsili veya off-chain düzen için base64.
6. `symbol` - İsteğe bağlı. UTF8 string. Token'ın sembolü - örneğin "XMPL". "99 XMPL aldınız." biçiminde kullanılır.
7. `decimals` - İsteğe bağlı. Belirtilmezse, varsayılan olarak 9 kullanılır. 0'dan 255'e kadar bir sayıyla UTF8 kodlu bir dizedir. Token'ın kullandığı ondalık sayısı - örneğin, 8, token miktarını 100000000'e bölmek anlamına gelir.
8. `amount_style` - İsteğe bağlı. Jetton sayısını görüntüleme için hangi formatın gerekeni anlamak için dış uygulamalar tarafından gereklidir.
   - "n" - jetton sayısı (varsayılan değer). Eğer kullanıcı 0 ondalık ile 100 token'a sahipse, o zaman kullanıcı 100 tokens olarak görüntülenmelidir.
   - "n-of-total" - ihraç edilen jettonların toplamından jetton sayısı. Örneğin, totalSupply Jetton = 1000. Kullanıcının jetton cüzdanında 100 jetton var. Örneğin, bu kullanıcı cüzdanında 100'den 1000'e veya başka bir metin veya grafiksel şekilde oran olarak gösterilecektir.
   - "%" - ihraç edilen jettonların toplamından jettonların yüzdesi. Örneğin, totalSupply Jetton = 1000. Kullanıcı 100 jetton tutarsa, bu kullanıcı cüzdanında 10% olarak görüntülenmelidir.
9. `render_type` - İsteğe bağlı. Dış uygulamalar tarafından jettonun hangi gruba ait olduğunu ve nasıl görüntüleneceğini anlamak için gereklidir.
   - "currency" - para birimi olarak görüntülenir (varsayılan değer).
   - "game" - oyunlar için görüntülenir. NFT olarak görünmelidir, ancak aynı zamanda `amount_style` değerini dikkate alarak jetton sayısını da göstermelidir.

> `amount_style` parametreleri:
> 
> - _n_ - jetton sayısı (varsayılan değer). Kullanıcının 0 ondalık ile 100 token'a sahip olması halinde, kullanıcı 100 token'a sahip olarak görüntülenir.
> - _n-of-total_ - ihraç edilen jettonların toplam sayısı içindeki jetton sayısı. Örneğin, eğer totalSupply Jetton 1000 ise ve bir kullanıcının cüzdanında 100 jetton varsa, bu, cüzdanında 100'den 1000'e oran olarak veya başka bir metin veya Grafiksel yolla gösterilmesi gerekir.
> - _%_ - ihraç edilen jettonların toplamından jettonların yüzdesi. Örneğin, eğer totalSupply Jetton 1000 ise, ve kullanıcı 100 jetton tutuyorsa, bu yüzdesi kullanıcının cüzdanında 10% olarak görüntülenmelidir (100 ÷ 1000 = 0.1 veya 10%).

> `render_type` parametreleri:
> 
> - _currency_ - para birimi olarak görüntülenir (varsayılan değer).
> - _game_ - NFT olarak görüntülenmesi gereken oyunlar için kullanılır, ancak aynı zamanda jetton sayısının görüntülenmesinde `amount_style` değerini dikkate alır.

## Parsing Metadata

Metadata ayrıştırmak için, NFT verileri öncelikle blok zincirinden elde edilmelidir. Bu süreci daha iyi anlamak için, TON varlık işleme dökümantasyonumuzdaki `NFT Verisi Alma` bölümüne göz atmayı düşünebilirsiniz.

On-chain NFT verileri alındıktan sonra, ayrıştırılması gerekir. Bu süreci gerçekleştirmek için, NFT içerik türü, NFT'nin iç işleyişini oluşturan ilk bayt okunarak belirlenmelidir.

### Off-chain

Eğer metadata bayt dizesi `0x01` ile başlıyorsa, bu, off-chain NFT içerik türünü belirtir. NFT içeriğinin kalan kısmı, ASCII dizesi olarak bir Snake kodlama formatında çözümlenir. Doğru NFT URL'si belirlendikten ve NFT tanımlama verisi alındıktan sonra, süreç tamamlanır. Aşağıda off-chain NFT içerik metadata ayrıştırması kullanan bir URL örneği verilmiştir:

`https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/95/meta.json`

URL içeriği (doğrudan yukarıda):

```json
{
   "name": "TON Smart Challenge #2 Winners Trophy",
   "description": "TON Smart Challenge #2 Winners Trophy 1 place out of 181",
   "image": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/images/943e994f91227c3fdbccbc6d8635bfaab256fbb4",
   "content_url": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/content/84f7f698b337de3bfd1bc4a8118cdfd8226bbadf",
   "attributes": []
}
```

### On-chain ve Semi-chain

Eğer metadata bayt dizesi `0x00` ile başlıyorsa, bu NFT'nin ya on-chain ya da semi-chain formatını kullandığını belirtir.

NFT'mizin metadata'sı, anahtarın özellik adının SHA256 karma değeri olduğu ve değerin ya Snake ya da Chunked formatında depolandığı bir sözlükte saklanır.

Hangi tür NFT'nin kullanıldığını belirlemek için geliştiricinin `uri`, `name`, `image`, `description` ve `image_data` gibi bilinen NFT özelliklerini okuması gereklidir. Metadata içinde `uri` alanı mevcutsa, bu bir semi-chain düzeni olduğunu gösterir. Böyle durumlarda, `uri` alanında belirtilen off-chain içerik indirilmelidir ve sözlük değerleri ile birleştirilmelidir.

On-chain NFT örneği: [EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0](https://getgems.io/collection/EQAVGhk_3rUA3ypZAZ1SkVGZIaDt7UdvwA4jsSGRKRo-MRDN/EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0)

Semi-chain NFT örneği: [EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW](https://getgems.io/nft/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW)

On-chain Jetton Master örneği: [EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi](https://tonscan.org/jetton/EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi)

On-chain NFT ayrıştırıcı örneği: [stackblitz/ton-onchain-nft-parser](https://stackblitz.com/edit/ton-onchain-nft-parser?file=src%2Fmain.ts)

## Important NFT Metadata Notes

1. NFT metadata'sı için, `name`, `description` ve `image` (veya `image_data`) alanları NFT'yi görüntülemek için gereklidir.
2. Jetton metadata'sı için, `name`, `symbol`, `decimals` ve `image` (veya `image_data`) anahtarlardır.
3. Herkesin her türlü `name`, `description` veya `image` kullanarak NFT veya Jetton oluşturabileceğini bilmek önemlidir. Karışıklığı ve olası dolandırıcılıkları önlemek için, kullanıcılar her zaman NFT'lerini, uygulamalarının diğer kısımlarından açıkça ayırt edilen bir şekilde görüntülemelidir. Kötü niyetli NFT'ler ve Jetton'lar, yanıltıcı veya yanlış bilgilerle bir kullanıcının cüzdanına gönderilebilir.
4. Bazı öğelerde, NFT veya Jetton ile ilişkili video içeriğine bağlanan bir `video` alanı olabilir.

## References
* [TON Enhancement Proposal 64 (TEP-64)](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)

## See Also
* `TON NFT işleme`
* `TON Jetton işleme`
* `İlk Jettonunuzu Mıntıkalamak`