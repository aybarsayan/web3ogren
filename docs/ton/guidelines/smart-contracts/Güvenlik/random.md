# Blok Rastgele Tohum Üretimi

:::caution
Bu bilgiler yazıldığı anda günceldir. Ağ yükseltmelerinde değişiklik gösterebilir.
:::

Zaman zaman, TON üzerinde bir piyango sözleşmesi oluşturulur. Genellikle rastgeleliği yönetmek için güvenli olmayan bir yöntem kullanır, bu nedenle üretilen değerler kullanıcı tarafından tahmin edilebilir ve piyango tükettirilebilir.

Ancak rastgele sayı üretimindeki zayıflıkları kullanmak genellikle doğru rastgele değer iletilirse mesajı iletecek bir proxy sözleşme kullanmayı içerir. Kullanıcının belirttiği ve imzaladığı rastgele kodu zincir üzerinde çalıştırabilecek cüzdan sözleşmeleri için öneriler bulunmaktadır, fakat en popüler cüzdan sürümleri bunu desteklememektedir. Yani, piyango bir oyuncunun bir cüzdan sözleşmesi aracılığıyla katıldığını kontrol ediyorsa, bu güvenli midir? 

:::info
Bu noktada **güvenlik** çok önemli bir konudur.
:::

Ya da bu soru şöyle yazılabilir: Göndericinin ihtiyaç duyduğu rastgele değer tam olarak gerektiği gibi bir blokta dış bir mesaj yer alabilir mi?

Elbette, gönderici rastgelelik üzerinde herhangi bir etki yapmaz. Ancak blokları oluşturan ve önerilen dış mesajları dahil eden doğrulayıcılar etkide bulunur.

## Doğrulayıcılar Tohumu Nasıl Etkiler?

Bu konuda çok fazla bilgi yok, hatta beyaz kağıtlarda bile, bu nedenle çoğu geliştirici kafası karışır. Blok rastgeleliği üzerine [TON Beyaz Kitabı](https://docs.ton.org/ton.pdf)ndaki tek referans:

> Her shard için doğrulayıcı görev gruplarını seçmek için kullanılan algoritma (w, s) deterministik pseudo-rastgeledir. **Bu, her masterchain bloğuna doğrulayıcılar tarafından gömülü olan psevdorastgele sayıları (eşik imzaları kullanarak konsensüs ile üretilmiştir) kullanarak rastgele tohum oluşturmak için kullanılır** ve ardından her doğrulayıcı için örneğin Hash(code(w). code(s).validator_id.rand_seed) hesaplanır.  
> — *TON Beyaz Kitabı*

:::note
Doğrulayıcılar toplamak için kullanılan algoritmaları anlamak, bu sistemin nasıl çalıştığını öğrenmek açısından önemlidir.
:::

Ancak garanti edilen tek şey doğru ve güncel olan koddur. Şimdi [collator.cpp](https://github.com/ton-blockchain/ton/blob/f59c363ab942a5ddcacd670c97c6fbd023007799/validator/impl/collator.cpp#L1590) dosyasına bakalım:

```cpp
  {
    // rastgele tohum üret
    prng::rand_gen().strong_rand_bytes(rand_seed->data(), 32);
    LOG(DEBUG) << "blok rastgele tohumu ayarlandı " << rand_seed->to_hex();
  }
```

Bu, blok için rastgele tohumu üreten koddur. Bu, blokları oluşturan tarafın ihtiyaç duyduğu için collator kodunda bulunmaktadır (lite doğrulayıcılar için gerekli değildir).

Gördüğümüz gibi, tohum bir blok ile tek bir doğrulayıcı veya collator tarafından üretilmektedir. Bir sonraki soru ise:

## Dış mesajın dahil edilmesine ilişkin karar, tohum bilindikten sonra alınabilir mi?

Evet, alınabilir. Kanıtı şöyledir: Eğer dış mesaj getirilirse, yürütülmesi başarılı olmalıdır. Yürütme rastgele değerlere bağlı olabilir, bu nedenle blok tohumu önceden bilinmek zorundadır.

Bu nedenle, gönderici doğrulayıcı ile işbirliği yapabilirse "güvensiz" (bunu tek-blok olarak adlandıralım, çünkü mesaj gönderme işleminden sonraki bloklardan herhangi bir bilgi kullanmaz) rastgeleliği hacklemek **mümkündür**. `randomize_lt()` kullanılsa bile doğrulayıcı, gönderici için uygun bir tohum üretebilir veya blokta uygun dış mesajı dahil edebilir. Böyle yapan bir doğrulayıcı yine de adil olarak kabul edilecektir. Bu, merkeziyetsizliğin özüdür.

Ve bu makalenin rastgeleliği tam olarak kapsaması için, işte bir soru daha.

## Blok tohumu sözleşmelerdeki rastgeleliği nasıl etkiler?

Doğrulayıcı tarafından üretilen tohum, tüm sözleşmelerde doğrudan kullanılmaz. Bunun yerine, [hesap adresi ile hash'lenir](https://github.com/ton-blockchain/ton/blob/f59c363ab942a5ddcacd670c97c6fbd023007799/crypto/block/transaction.cpp#L876).

```cpp
bool Transaction::prepare_rand_seed(td::BitArray<256>& rand_seed, const ComputePhaseConfig& cfg) const {
  // SHA256(block_rand_seed . addr . trans_lt) kullanabiliriz
  // bunun yerine, SHA256(block_rand_seed . addr) kullanırız
  // eğer akıllı sözleşme daha fazla rastgelelik istiyorsa RANDOMIZE talimatını kullanabilir
  td::BitArray<256 + 256> data;
  data.bits().copy_from(cfg.block_rand_seed.cbits(), 256);
  (data.bits() + 256).copy_from(account.addr_rewrite.cbits(), 256);
  rand_seed.clear();
  data.compute_sha256(rand_seed);
  return true;
}
```

Sonra, [TVM talimatlarında](https://github.com/ton-blockchain/ton/blob/master/crypto/block/transaction.cpp#L903) tanımlandığı gibi, psevdorastgele sayılar üretilir:

> **x\{F810} RANDU256**  
> Yeni bir psevdorastgele 256-bit Tam Sayı x üretir. Algoritma şöyle: eğer r eski rastgele tohumu 32 baytlık bir dizi olarak (bir unsigned 256-bit tam sayının büyük-endian temsilini oluşturarak) kabul ediliyorsa, sha512(r) hesaplanır; bu hash'in ilk 32 baytı yeni değer r' rastgele tohumu olarak depolanır ve kalan 32 bayt bir sonraki rastgele değer x olarak döner.  
> — *TVM Talimatları*

Bunu [sözleşmenin c7'sinin hazırlanışı](https://github.com/ton-blockchain/ton/blob/master/crypto/block/transaction.cpp#L903) ve [rastgele değerlerin kendilerinin üretimi](https://github.com/ton-blockchain/ton/blob/master/crypto/vm/tonops.cpp#L217-L268) kodlarına bakarak doğrulayabiliriz.

## Sonuç

TON'daki rastgelelik tamamen tahmin edilemez anlamında güvenli değildir. Bu, **burada mükemmel bir piyango olamayacağı**, ya da herhangi bir piyangonun adil olduğu inancının bulunamayacağı anlamına gelir.

:::warning
PRNG'nin tipik kullanımı `randomize_lt()` içerebilir, ancak böyle bir sözleşmeyi aldatmak, mesajların gönderileceği doğru blokları seçmekle mümkündür.
:::

Bunun önerilen çözümü, diğer çalışma zincirine mesaj göndermek, cevap almak ve böylece blokları atlamaktır, ancak bu sadece tehdidi erteler. Aslında, herhangi bir doğrulayıcı (yani, TON Blockchain'inin 1/250'i), piyango sözleşmesine bir istek göndermek için doğru zamanlamayı seçebilir ve diğer çalışma zincirinden gelen cevabın kendisi tarafından oluşturulan blokta ulaşmasını sağlar; o zaman istediği herhangi bir blok tohumunu seçmekte serbesttir. Tehlike, ana ağda collator'lar ortaya çıktıkça artacaktır, çünkü standart şikayetler nedeniyle ceza almazlar çünkü Elector sözleşmesine herhangi bir pay yatırmazlar.



