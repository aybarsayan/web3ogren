---
title: Solana Pay
objectives:
  - Solana Pay spesifikasyonunu kullanarak QR kodları olarak kodlanmış URL'ler aracılığıyla ödeme talepleri oluşturmak ve işlemleri başlatmak
  - Solana Pay işlem talepleri oluşturmak için `@solana/pay` kütüphanesini kullanmak
  - İşlemleri kısmi imzalamak ve belirli koşullara göre işlem kısıtlaması uygulamak
description:
  "Bağlantılar ve QR kodları kullanarak Solana Pay ödeme talepleri nasıl oluşturulur."
---

## Özet

- **Solana Pay**, farklı Solana uygulamaları ve cüzdanları arasında standartlaştırılmış işlem talepleri sağlamak için URLs'ler içinde Solana işlem taleplerini kodlamak için bir spesifikasyondur.
- **Kısmi imzalama**, işlemlerin ağa sunulmadan önce birden fazla imza gerektiren işlemlerin oluşturulmasına olanak tanır.
- **İşlem kısıtlaması**, belirli koşullara veya işlemde belirli verilerin varlığına dayanarak bazı işlemlerin işlenip işlenmeyeceğini belirleyen kuralların uygulanmasını içerir.

---

## Ders

Solana topluluğu sürekli olarak ağın işlevselliğini geliştiriyor ve genişletiyor. Fakat bu her zaman tamamen yeni teknolojiler geliştirmek anlamına gelmiyor. Bazen, ağın mevcut özelliklerini yeni ve yenilikçi şekillerde kullanmak anlamına geliyor.

:::note
Solana Pay, ağa yeni işlevsellik eklemek yerine mevcut özellikleri benzersiz bir şekilde kullanarak tüccarların ve uygulamaların işlem talepleri talep etmelerine ve belirli işlem türleri için kısıtlama mekanizmaları oluşturmasına olanak tanır.
:::

Bu derste, Solana Pay'i kullanarak transfer ve işlem talepleri oluşturmayı, bu talepleri QR kodu olarak kodlamayı, işlemleri kısmi olarak imzalamayı ve seçtiğiniz koşullara göre işlemleri kısıtlamayı öğreneceksiniz. Bununla yetinmeyip, mevcut özellikleri yeni ve yenilikçi yollarla kullanmanın bir örneği olarak göreceksiniz ve bunu kendi benzersiz istemci tarafı ağ etkileşimleriniz için bir sıçrama tahtası olarak kullanmayı umuyoruz.

### Solana Pay

[Solana Pay spesifikasyonu](https://docs.solanapay.com/spec), kullanıcıların URL'leri aracılığıyla ödemeler talep etmesine ve işlemleri başlatmasına olanak tanıyan standartlar grubudur.

Talepler URL'leri `solana:` ile başlar, böylece platformlar bağlantıyı uygun uygulamaya yönlendirebilir. Örneğin, mobilde `solana:` ile başlayan bir URL, Solana Pay spesifikasyonunu destekleyen cüzdan uygulamalarına yönlendirilir. Buradan sonra cüzdan, URL'nin geri kalanını uygun şekilde işlemek için kullanabilir.

Solana Pay spesifikasyonu tarafından tanımlanan iki tür talep vardır:

1. **Transfer Talebi**: basit SOL veya SPL Token transferleri için kullanılır.
2. **İşlem Talebi**: herhangi bir türde Solana işlemi talep etmek için kullanılır.

#### Transfer talepleri

Transfer talep spesifikasyonu, SOL veya SPL token transferi için etkileşimsiz bir talep tarif eder. Transfer talep URL'leri aşağıdaki formatta alınır: `solana:?`.

`alıcı` değeri zorunludur ve bir transfer talep edilecek hesabın base58 kodlu genel anahtarı olmalıdır. Ek olarak, aşağıdaki isteğe bağlı sorgu parametreleri desteklenmektedir:

- `miktar` - transfer edilecek token miktarını belirten pozitif bir tam sayı veya ondalık değer
- `spl-token` - SPL token transferi yapılıyorsa, bunun için bir SPL Token mint hesabının base58 kodlu genel anahtarı
- `referans` - istemci tarafından onchain işlem tanımlamak için kullanılabilecek base58 kodlu 32 byte dizileri olarak isteğe bağlı referans değerleri. İstemcinin bir işlemin imzasına sahip olmayacağından kullanılabilir.
- `etiket` - transfer talebinin kaynağını tanımlayan URL kodlu UTF-8 dizgesi
- `mesaj` - transfer talebinin doğasını tanımlayan URL kodlu UTF-8 dizgesi
- `memo` - ödeme işleminin SPL memo talimatında dahil edilmesi gereken URL kodlu UTF-8 dizgesi

:::tip
Bir örnek olarak, 1 SOL için bir transfer talebini tanımlayan bir URL şöyle olabilir:
:::
```text
solana:mvines9iiHiQTysrwkJjGf2gb9Ex9jXJX8ns3qwf2kN?miktar=1&etiket=Michael&mesaj=Thanks%20for%20all%20the%20fish&memo=OrderId12345
```

Ve işte 0.1 USDC için bir transfer talebini tanımlayan bir URL:

```text
solana:mvines9iiHiQTysrwkJjGf2gb9Ex9jXJX8ns3qwf2kN?miktar=0.01&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

#### İşlem talepleri

Solana Pay işlem talebi, destekleyen bir cüzdan tarafından tüketilebilen bir URL olan transfer taleplerine benzer. Ancak bu talep etkileşimli ve formatı daha açık uçludur:

```text
solana:<bağlantı>
```

`bağlantı` değeri, tüketen cüzdanın HTTP isteği yapabileceği bir URL olmalıdır. Bir işlemin gerekli tüm bilgilerini içermek yerine, bir işlem talebi bu URL'yi kullanarak kullanıcıya sunulması gereken işlemi almak için kullanır.

Bir cüzdan, işlem Talep URL'sini aldığında dört şey olur:

1. Cüzdan, kullanıcıya gösterilecek bir etiket ve simge resmini almak için sağlanan `bağlantı` URL'sine GET isteği gönderir.
2. Cüzdan, ardından nihai kullanıcının genel anahtarını içeren bir POST isteği gönderir.
3. Nihai kullanıcının genel anahtarı (ve `bağlantı` içinde sağlanan ek bilgiler kullanılarak), uygulama daha sonra işlemi oluşturur ve base64 kodlu serialize edilmiş işlemi geri gönderir.
4. Cüzdan, işlemi çözer ve ayrıştırır; ardından kullanıcının işlemi imzalamasına ve göndermesine izin verir.

:::info
İşlem taleplerinin transfer taleplerinden daha karmaşık olması nedeniyle, dersin geri kalan kısmı işlem talepleri oluşturmaya odaklanacaktır.
:::

### İşlem talebi oluşturma

#### API uç noktasını tanımlayın

Geliştirici olarak, işlem talebi akışının çalışmasını sağlamak için yapmanız gereken temel şey, işlem talebinde dahil etmeyi planladığınız URL’de bir REST API uç noktası kurmaktır. Bu derste, uç noktalarımız için [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) kullanacağız, ancak en rahat olduğunuz yığın ve araçları kullanmakta özgürsünüz.

Next.js'de bunu, `pages/api` klasörüne bir dosya ekleyerek ve isteği ve yanıtı işleyen bir fonksiyonu dışa aktararak yaparsınız.

```typescript
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // İsteği işleyin
}
```

#### GET isteğini işleyin

Cüzdanınız, işlem talep URL'sini tüketirken ilk olarak bu uç noktaya GET isteği gönderir. Uç noktanızın, iki alan içeren bir JSON nesnesi döndürmesi gerekir:

1. `etiket` - işlem talebinin kaynağını tanımlayan bir dizge
2. `ikon` - kullanıcıya gösterilebilecek bir resmin URL'si

Önceki boş uç noktanızdan çıkarsak, bu şöyle görünebilir:

```typescript
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === "GET") {
    return get(response);
  }
  return response.status(405).json({ hata: "Yöntem izin verilmedi" });
}

function get(response: NextApiResponse) {
  response.status(200).json({
    etiket: "Mağaza Adı",
    ikon: "https://solana.com/src/img/branding/solanaLogoMark.svg",
  });
}
```

Cüzdan API uç noktasına GET isteği yaptığında, `get` fonksiyonu çağrılır ve `etiket` ve `ikon` içeren bir JSON nesnesi ile 200 durum kodu ile bir yanıt döner.

#### POST isteğini işleyin ve işlemi oluşturun

GET isteğinden sonra, cüzdan aynı URL'ye bir POST isteği yapar. Uç noktanız, POST isteğinin `body` bölümünde, istek yapan cüzdan tarafından sağlanan bir JSON nesnesinde `hesap` alanı olmasını beklemelidir. `hesap` değeri, nihai kullanıcının genel anahtarını temsil eden bir dizge olacaktır.

Bu bilgi ile ve ek parametreler sağlandığında, işlemi oluşturabilir ve imzalanması için cüzdana dönebilirsiniz:

1. Solana ağına bağlanarak en son `blockhash`'i almak.
2. Yeni bir işlem oluşturmak için `blockhash`'i kullanmak.
3. İşleme talimatlar eklemek.
4. İşlemi serialize ederek bir `PostResponse` nesnesi içinde kullanıcıya bir mesaj ile döndürmek.

```typescript
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === "GET") {
    return get(response);
  }
  if (request.method === "POST") {
    return post(request, response);
  }
  return response.status(405).json({ hata: "Yöntem izin verilmedi" });
}

function get(response: NextApiResponse) {
  response.status(200).json({
    etiket: "Mağaza Adı",
    ikon: "https://solana.com/src/img/branding/solanaLogoMark.svg",
  });
}
async function post(request: NextApiRequest, response: NextApiResponse) {
  const { hesap, referans } = request.body;

  const connection = new Connection(clusterApiUrl("devnet"));

  const { blockhash } = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: hesap,
  });

  const instruction = SystemProgram.transfer({
    fromPubkey: new PublicKey(hesap),
    toPubkey: Keypair.generate().publicKey,
    lamports: 0.001 * LAMPORTS_PER_SOL,
  });

  instruction.keys.push({
    pubkey: referans,
    isSigner: false,
    isWritable: false,
  });

  transaction.add(instruction);

  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
  });
  const base64 = serializedTransaction.toString("base64");

  const message = "0.001 SOL için basit transfer";

  response.status(200).json({
    işlem: base64,
    mesaj,
  });
}
```

Burada alışılmadık bir şey yok. Bu, standart bir istemci tarafı uygulamasında kullanacağınız aynı işlem yapısını olmaktadır. Tek fark, ağa imzalamak ve göndermek yerine işlemi bir base64 kodlu dize olarak HTTP yanıtında geri göndermektir. İsteği yapan cüzdan, ardından işlemi kullanıcıya imzalatmak için gösterebilir.

#### İşlemi Onaylama

Önceki örnekte bir `referans` sağlandığını varsaydığınızı fark etmişsinizdir. Bu, istekte bulunan cüzdan tarafından sağlanan bir değer _değildir_, ancak işlem talebinizin başlangıç URL'sinin bu sorgu parametresini içermesini sağlamak için _yararlıdır_.

Uygulamanız, ağa bir işlem gönderen kişi olmadığından, kodunuz bir işlem imzasına erişemez. Bu, uygulamanızın ağa bir işlemi bulabilmesi ve durumunu görmesi için genellikle böyle olur.

Bunu aşmak için, her işlem talebi için bir sorgu parametresi olarak bir `referans` değeri ekleyebilirsiniz. Bu değer, işleme dahil edilebilecek bir non-signer anahtarı olarak, base58 kodlu 32 byte dizisi olmalıdır. Bu, uygulamanızın `getSignaturesForAddress` RPC yöntemini kullanarak işlemi bulmasına olanak tanır. Uygulamanız, bir işlemin durumuna göre kullanıcı arayüzünü uyarlayabilir.

`@solana/pay` kütüphanesini kullanıyorsanız, doğrudan `getSignaturesForAddress` kullanmak yerine `findReference` yardımcı işlevini kullanabilirsiniz.

### Kısıtlı işlemler

Solana Pay'in, mevcut işlevselliklerini kullanarak ağ üzerinde yeni şeyler yapabilme örneği olarak bahsettiğimiz konuyla ilgili olarak, belirli koşullar sağlandığında yalnızca belirli işlemlerin mevcut olmasını sağlamak da buna küçük bir örnektir.

İşlemi oluşturan uç noktayı kontrol ettiğiniz için, bir işlem oluşturulmadan önce hangi kriterlerin sağlanması gerektiğini belirleyebilirsiniz. Örneğin, POST isteğinde sağlanan `hesap` alanını kullanarak nihai kullanıcının belirli bir koleksiyondan bir NFT tutup tutmadığını veya bu genel anahtarın bu belirli işlemi gerçekleştirebilecek önceden belirlenmiş bir hesaplar listesinde olup olmadığını kontrol edebilirsiniz.

```typescript
// belirtilen cüzdan tarafından sahip olunan nfncç'lerin dizisini al
const nfts = await metaplex.nfts().findAllByOwner({ owner: hesap }).run();

// nfts dizisi üzerinde yineleme
for (let i = 0; i < nfts.length; i++) {
  // mevcut nft'nin koleksiyon alanının istenen değeriyle olup olmadığını kontrol et
  if (nfts[i].collection?.address.toString() == koleksiyon.toString()) {
    // işlemi oluştur
  } else {
    // bir hata döndür
  }
}
```

#### Kısmi İmzalama

Belirli kısıtlamalara sahip işlemleri isterseniz, bu işlevselliğin de zincir üzerinde uygulanması gerekecektir. Solana Pay uç noktanızdan bir hata döndürmek, nihai kullanıcıların işlemi gerçekleştirmesini zorlaştırır, ancak yine de bunu manuel olarak oluşturabilirler.

Bu, çağrılan işlem (ler) in, yalnızca sizin uygulamanızın sağlayabileceği bir tür "admin" imzasını gerektireceği anlamına gelir. Ancak bunu yaparken, önceki örneklerimizin çalışmamasına neden olursunuz. İşlem, nihai kullanıcının imzası için istek yapan cüzdana gönderilir, ancak sunulan işlem, admin imzası olmadan başarısız olacaktır.

Neyse ki, Solana kısmi imzalamayla imza bileşenliğini mümkün kılar.

Kısmi olarak çoklu imzalı bir işlemi imzalamak, imzacılara işlemin ağa yayınlanmadan önce imzalarını ekleyebilme olanağı sağlar. Bu, aşağıdakiler de dahil olmak üzere birkaç durumda yararlı olabilir:

- Tüccar ve bir alıcı gibi birden fazla tarafın imzasını gerektiren işlemleri onaylama.
- Hem bir kullanıcı hem de bir yöneticinin imzalarını gerektiren özel programları etkinleştirme. Bu, program talimatlarına erişimi sınırlama ve yalnızca yetkili tarafların bunları çalıştırmasını sağlama konusunda yardımcı olabilir.

```typescript
const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

const transaction = new Transaction({
  feePayer: hesap,
  blockhash,
  lastValidBlockHeight,
})

...

transaction.partialSign(adminKeypair)
```

:::warning
`partialSign` fonksiyonu, herhangi bir önceki imzayı geçersiz kılmadan bir işleme imza eklemek için kullanılır. Birden fazla imzaya sahip bir işlem oluşturuyorsanız, bir işlemin `feePayer` değerini belirtmezseniz, ilk imzalayıcı işlem için ücret ödeyen kişi olarak kullanılacağını hatırlamak önemlidir. Herhangi bir karışıklığı veya beklenmedik davranışları önlemek için, gerektiğinde ücret ödeyeni açıkça ayarladığınızdan emin olun.
:::

Sadece nihai kullanıcının belirli bir NFT'ye sahip olduğu durumda bir işlem talebinin geçmesine izin verme örneğimizde, işlemi bir base64 kodlu dize olarak kodlamadan önce, işlemi ekleyerek yanıt vermeniz yeterli olacaktır.

### Solana Pay QR kodları

Solana Pay'in dikkate değer özelliklerinden biri, QR kodlarıyla kolay entegrasyondur. Transfer ve işlem talepleri basit URL'ler olduğundan, bunları uygulamanızda veya başka bir yerde kullanılabilir QR kodlarına gömebilirsiniz.

`@solana/pay` kütüphanesi, sağlanan `createQR` yardımcı işlevi ile bunu basitleştirir. Bu işlev, şu bilgileri sağlamanızı gerektirir:

- `url` - işlem talebinin URL'si.
- `boyut` (isteğe bağlı) - QR kodunun genişliği ve yüksekliği piksel olarak. Varsayılan 512'dir.
- `arka plan` (isteğe bağlı) - arka plan rengi. Varsayılan beyazdır.
- `renk` (isteğe bağlı) - ön plan rengi. Varsayılan siyahtır.

```typescript
const qr = createQR(url, 400, "transparent");
```

## Laboratuvar

Artık Solana Pay hakkında kavramsal bir anlayışa sahip olduğunuza göre, onu pratiğe dökelim. Solana Pay'i bir grup avı için bir dizi QR kodu oluşturmak üzere kullanacağız. Katılımcılar, her bir grup avı konumuna sırayla gitmelidir. Her konumda, sağlanan QR kodunu kullanarak grup avının akıllı sözleşmesine uygun işlemi göndereceklerdir.

#### 1. Başlangıç

Başlamak için, bu [depo](https://github.com/Unboxed-Software/solana-scavenger-hunt-app/tree/starter) içinde `starter` dalında başlangıç kodunu indirin. Başlangıç kodu, Solana Pay QR kodunu görüntüleyen bir Next.js uygulamasıdır. Menü çubuğunun farklı QR kodları arasında geçiş yapmanıza olanak tanıdığını göreceksiniz. Varsayılan seçenek, gösterim amaçlı basit bir SOL transferidir. Bu laboratuvar boyunca, menü çubuğundaki konum seçeneklerine işlevsellik ekleyeceğiz.

![grup avı uygulaması](../../../images/solana/public/assets/courses/unboxed/scavenger-hunt-screenshot.png)

Bunu yapmak için, Devnet'te bir Anchor programını çağırmak için bir işlem oluşturacak yeni bir uç noktasını oluşturacağız. Bu program, bu "grup avı" uygulaması özel olarak tasarlanmış olup iki talimata sahiptir: `initialize` ve `check_in`. `initialize` talimatı, kullanıcının durumunu kurmak için kullanılırken, `check_in` talimatı grup avındaki bir konumda check-in kaydetmek için kullanılır. 

:::note
Bu laboratuvar boyunca programda herhangi bir değişiklik yapmayacağız, ancak program hakkında daha aşina olmak isterseniz, [kaynak kodunu](https://github.com/Unboxed-Software/anchor-scavenger-hunt) kontrol edebilirsiniz.
:::

Devam etmeden önce, grup avı uygulamasının başlangıç kodunu tanıdığınızdan emin olun. `pages/index.tsx`, `utils/createQrCode/simpleTransfer`, ve `/utils/checkTransaction`'a bakmak, SOL göndermek için işlem talebinin nasıl ayarlandığını görmenizi sağlayacaktır. İşlem talebi ile konumda check-in yapma işlemi için benzer bir model izleyeceğiz.

#### 2. Kurulum

İlerlemeye başlamadan önce, uygulamayı yerel olarak çalıştırabildiğinizden emin olalım. Öncelikle, ön uç dizinindeki `.env.example` dosyasını `.env` olarak yeniden adlandırın. Bu dosya, bu laboratuvar boyunca işlemleri kısmi imzalamak için kullanılacak bir anahtar çiftini içerir.

Sonrasında, `yarn` ile bağımlılıkları kurun, ardından `yarn dev` kullanarak tarayıcınızı açın `localhost:3000` (veya 3000 zaten kullanılıyorsa konsolda belirtilen port).

Artık QR kodunu sayfada mobil cihazınızdan taramayı denerken bir hata alacaksınız. Bunun nedeni, QR kodunun bilgisayarınızdaki `localhost:3000` adresine yönlendirilmiş olmasıdır; bu, telefonunuzun erişebileceği bir adres değildir. Daha da önemlisi, Solana Pay'in çalışması için HTTPS URL'si kullanması gerekir.

Bunu aşmak için [ngrok](https://ngrok.com/) kullanabilirsiniz. Daha önce kullanmadıysanız, yüklemeniz gerekecek. Yükledikten sonra, terminalde aşağıdaki komutu çalıştırın, `3000`'i bu proje için kullandığınız herhangi bir portla değiştirin:

```bash
ngrok http 3000
```

Bu, yerel sunucunuza uzaktan erişmek için kullanabileceğiniz benzersiz bir URL sağlayacaktır. Çıktı şöyle bir şey olacaktır:

```bash
Session Status                online
Account                       your_email@gmail.com (Plan: Free)
Update                        update available (version 3.1.0, Ctrl-U to update)
Version                       3.0.6
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://7761-24-28-107-82.ngrok.io -> http://localhost:3000
```

Artık, konsolunuzda gösterilen HTTPS ngrok URL'sini tarayıcınızda açın (örneğin, https://7761-24-28-107-82.ngrok.io). Bu, yerel olarak test ederken mobil cihazınızdan QR kodlarını taramanızı sağlayacaktır.

:::warning
Yazım anında, bu laboratuvar Solflare ile en iyi şekilde çalışmaktadır. Bazı cüzdanlar, bir Solana Pay QR kodunu tararken yanlış bir uyarı mesajı gösterebilir. Hangi cüzdanı kullanırsanız kullanın, cüzdanda devnet seçtiğinizden emin olun. Ardından, "SOL Transfer" etiketli ana sayfadaki QR kodunu tarayın. Bu QR kodu, basit bir SOL transferi gerçekleştiren bir işlem talebi için bir referans uygulamasıdır. Ayrıca, çoğu insanın test için Devnet SOL'u bulunmadığından mobil cüzdanınızı Devnet SOL ile finanse etmek için `requestAirdrop` fonksiyonunu çağırır.
:::

Eğer QR kodu kullanarak işlemi başarıyla gerçekleştirebildiyseniz, devam edebilirsiniz!

#### 3. Bir check-in işlem talep uç noktası oluşturun

Artık çalışmaya başladığınıza göre, Scavenger Hunt programını kullanarak konum check-in’ini destekleyen bir uç nokta oluşturma zamanı geldi.

:::tip
Aşağıdaki adımları izleyerek etkin bir uç nokta oluşturabilirsiniz.
:::

`pages/api/checkIn.ts` dosyasını açarak başlayın. Gizli anahtar ortam değişkeninden `eventOrganizer`'ı başlatmak için bir yardımcı işlevi bulabilirsiniz. Bu dosyadaki ilk yapacağımız şey şudur:

1. Rastgele bir HTTP isteğini işlemek için bir `handler` işlevi dışa aktarmak
2. Bu HTTP yöntemlerini işlemek için `get` ve `post` fonksiyonları eklemek
3. `handler` işlevinin gövdesine, HTTP isteği yöntemine göre `get`, `post` çağıracak veya 405 hatası döndürecek mantık eklemek

```typescript
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === "GET") {
    return get(response);
  }
  if (request.method === "POST") {
    return await post(request, response);
  }
  return response.status(405).json({ error: "Method not allowed" });
}

function get(response: NextApiResponse) {}

async function post(request: NextApiRequest, response: NextApiResponse) {}
```

#### 4. `get` fonksiyonunu güncelleyin

Unutmayın, bir cüzdanın ilk isteği, uç noktanın bir etiket ve simge döndürmesini bekleyen bir GET isteği olacaktır. `get` fonksiyonunu "Scavenger Hunt!" etiketi ve bir Solana logosu simgesi ile bir yanıt gönderecek şekilde güncelleyin.

```jsx
function get(response: NextApiResponse) {
    response.status(200).json({
        label: "Scavenger Hunt!",
        icon: "https://solana.com/src/img/branding/solanaLogoMark.svg",
    });
}
```

#### 5. `post` fonksiyonunu güncelleyin

GET isteğinden sonra, bir cüzdan uç noktaya bir POST isteği gönderir. İsteğin `body`'sinde son kullanıcıyı temsil eden bir `account` alanına sahip bir JSON nesnesi bulunacaktır.

Ayrıca, sorgu parametreleri, QR koduna kodladığınız her şeyi içerecektir. `utils/createQrCode/checkIn.ts` dosyasına göz atarsanız, bu uygulamanın `reference` ve `id` için parametreler içerdiğini göreceksiniz. Bunlar:

1. `reference` - işlemi tanımlamak için kullanılan rastgele üretilmiş bir genel anahtar
2. `id` - bir tamsayı olarak konum id'si

:::info
`post` fonksiyonunu, istekten `account`, `reference` ve `id` çıkarmak için güncelleyin. Bu alanlardan herhangi biri eksikse bir hata ile yanıt vermelisiniz.
:::

Sonra, `try catch` ifadesi ekleyin; `catch` bloğu bir hatayla yanıt versin ve `try` bloğu yeni bir `buildTransaction` fonksiyonuna çağrı yapsın. `buildTransaction` başarılı olursa, 200 ile yanıt verin ve işlem ile kullanıcının belirtilen konumu bulduğuna dair bir mesaj içeren bir JSON nesnesi ile yanıt verin. Şu anda `buildTransaction` fonksiyonunun mantığını düşünmeyin - bunu bir sonraki aşamada yapacağız.

Burada ayrıca `PublicKey` ve `Transaction`'ı `@solana/web3.js`'den içe aktarmanız gerekecek.

```typescript
import { NextApiRequest, NextApiResponse } from "next"
import { PublicKey, Transaction } from "@solana/web3.js"
...

async function post(request: NextApiRequest, response: NextApiResponse) {
  const { account } = request.body;
  const { reference, id } = request.query;

  if (!account || !reference || !id) {
    response.status(400).json({ error: "Missing required parameter(s)" });
    return;
  }

  try {
    const transaction = await buildTransaction(
      new PublicKey(account),
      new PublicKey(reference),
      id.toString(),
    );

    response.status(200).json({
      transaction: transaction,
      message: `You've found location ${id}!`,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ transaction: "", message: error.message });
    return;
  }
}

async function buildTransaction(
    account: PublicKey,
    reference: PublicKey,
    id: string
): Promise<string> {
    return new Transaction()
}
```

#### 6. `buildTransaction` fonksiyonunu implement edin

Sonraki adımda, `buildTransaction` fonksiyonunu uygulayalım. Bu fonksiyon, check-in işlemini oluşturmalı, kısmi imzalamalı ve geri döndürmelidir. Gerçekleştirmesi gereken işlemler şunlardır:

1. Kullanıcı durumunu al
2. `locationAtIndex` yardımcı fonksiyonunu ve konum id'sini kullanarak bir Konum nesnesi al
3. Kullanıcının doğru konumda olup olmadığını doğrula
4. Bağlantıdan mevcut blokhash ve son geçerli blok yüksekliğini al
5. Yeni bir işlem nesnesi oluştur
6. Kullanıcı durumu mevcut değilse işleme başlatma talimatı ekle
7. İşleme check-in talimatı ekle
8. Check-in talimatına `reference` genel anahtarını ekle
9. İşlemi etkinlik organizatörünün anahtarı ile kısmi imzala
10. İşlemi base64 kodlaması ile seri hale getir ve işlemi geri döndür

:::note
Bu adımların her biri basit olsa da çok sayıda adım var. Fonksiyonu basitleştirmek için, boş yardımcı fonksiyonlar oluşturacağız ve bunları daha sonra adımlar 1, 3, 6, ve 7-8 için dolduracağız. Bunları sırasıyla `fetchUserState`, `verifyCorrectLocation`, `createInitUserInstruction` ve `createCheckInInstruction` olarak adlandıracağız.
:::

Aşağıdaki ithalatları da ekleyeceğiz:

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { locationAtIndex, Location, locations } from "../../utils/locations";
import { connection, gameId, program } from "../../utils/programSetup";
```

Boş yardımcı fonksiyonları ve yeni ithalatları kullanarak `buildTransaction` fonksiyonunu dolduralım:

```typescript
async function buildTransaction(
  account: PublicKey,
  reference: PublicKey,
  id: string,
): Promise<string> {
  const userState = await fetchUserState(account);

  const currentLocation = locationAtIndex(new Number(id).valueOf());

  if (!currentLocation) {
    throw { message: "Invalid location id" };
  }

  if (!verifyCorrectLocation(userState, currentLocation)) {
    throw { message: "You must visit each location in order!" };
  }

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: account,
    blockhash,
    lastValidBlockHeight,
  });

  if (!userState) {
    transaction.add(await createInitUserInstruction(account));
  }

  transaction.add(
    await createCheckInInstruction(account, reference, currentLocation),
  );

  transaction.partialSign(eventOrganizer);

  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
  });

  const base64 = serializedTransaction.toString("base64");

  return base64;
}

interface UserState {
  user: PublicKey;
  gameId: PublicKey;
  lastLocation: PublicKey;
}

async function fetchUserState(account: PublicKey): Promise<UserState | null> {
  return null;
}

function verifyCorrectLocation(
  userState: UserState | null,
  currentLocation: Location,
): boolean {
  return false;
}

async function createInitUserInstruction(
  account: PublicKey,
): Promise<TransactionInstruction> {
  throw "";
}

async function createCheckInInstruction(
  account: PublicKey,
  reference: PublicKey,
  location: Location,
): Promise<TransactionInstruction> {
  throw "";
}
```

#### 7. `fetchUserState` fonksiyonunu implement edin

`buildTransaction` fonksiyonu tamamlandığında, oluşturduğumuz boş yardımcı fonksiyonları uygulamaya başlayabiliriz; önce `fetchUserState` ile başlayalım. Bu fonksiyon, `gameId` ve kullanıcının `account`'ından kullanıcı durumu PDA'sını türetir ve ardından bu hesabı alıp varsa onu döndürür.

```typescript
async function fetchUserState(account: PublicKey): Promise<UserState | null> {
  const userStatePDA = PublicKey.findProgramAddressSync(
    [gameId.toBuffer(), account.toBuffer()],
    program.programId,
  )[0];

  try {
    return await program.account.userState.fetch(userStatePDA);
  } catch {
    return null;
  }
}
```

#### 8. `verifyCorrectLocation` fonksiyonunu implement edin

Sonra, `verifyCorrectLocation` yardımcı fonksiyonunu uygulayalım. Bu fonksiyon, bir kullanıcının bir scavenger hunt oyununda doğru konumda olup olmadığını doğrulamak için kullanılır.

Eğer `userState` `null` ise, bu, kullanıcının ilk lokasyonu ziyaret etmesi gerektiği anlamına gelir. Aksi takdirde, kullanıcı en son ziyaret ettikleri konumlarının indeksine 1 eklenmiş konumu ziyaret etmelidir.

Eğer bu koşullar sağlanıyorsa, fonksiyon true döndürür. Aksi takdirde, false döner.

```typescript
function verifyCorrectLocation(
  userState: UserState | null,
  currentLocation: Location,
): boolean {
  if (!userState) {
    return currentLocation.index === 1;
  }

  const lastLocation = locations.find(
    location => location.key.toString() === userState.lastLocation.toString(),
  );

  if (!lastLocation || currentLocation.index !== lastLocation.index + 1) {
    return false;
  }
  return true;
}
```

#### 9. Talimat oluşturma fonksiyonlarını implement edin

Son olarak, `createInitUserInstruction` ve `createCheckInInstruction` fonksiyonlarını uygulayalım. Bu fonksiyonlar, karşılık gelen talimatları oluşturmak ve döndürmek için Anchor kullanabilir. Tek ihtiyacımız olan, `createCheckInInstruction`'ın anahtarlar listesine `reference`'ı eklemesidir.

```typescript
async function createInitUserInstruction(
  account: PublicKey,
): Promise<TransactionInstruction> {
  const initializeInstruction = await program.methods
    .initialize(gameId)
    .accounts({ user: account })
    .instruction();

  return initializeInstruction;
}

async function createCheckInInstruction(
  account: PublicKey,
  reference: PublicKey,
  location: Location,
): Promise<TransactionInstruction> {
  const checkInInstruction = await program.methods
    .checkIn(gameId, location.key)
    .accounts({
      user: account,
      eventOrganizer: eventOrganizer.publicKey,
    })
    .instruction();

  checkInInstruction.keys.push({
    pubkey: reference,
    isSigner: false,
    isWritable: false,
  });

  return checkInInstruction;
}
```

#### 10. Uygulamayı test edin

Bu aşamada uygulamanız çalışıyor olmalı! Mobil cüzdanınızı kullanarak test edin. `Location 1` için QR kodunu tarayarak başlayın. Öncelikle, ön yüzünüzün `localhost` yerine ngrok URL'sini kullandığından emin olun.

:::warning
QR kodunu taradıktan sonra, konum 1'de olduğunuzu belirten bir mesaj görmelisiniz. Ardından, `Location 2` sayfasındaki QR kodunu tarayın. Önceki işlemin nihai hale gelmesi için birkaç saniye beklemeniz gerekebilir.
:::

Tebrikler, Solana Pay kullanarak scavenger hunt demo'sunu başarılı bir şekilde tamamladınız! Geçmişiniz nedeniyle, bu başlangıçta sezgisel veya basit olmayabilir. Eğer öyleyse, mutlaka laboratuvarı tekrar gözden geçirin veya kendi projenizi oluşturun. Solana Pay, gerçek yaşam ve zincir üstü etkileşim arasında köprü kuran pek çok kapıyı açıyor.

Son çözüm koduna göz atmak isterseniz, bunu [aynı depoda](https://github.com/Unboxed-Software/solana-scavenger-hunt-app/tree/solution) bulabilirsiniz.

## Görev

Artık bunu kendi başınıza deneme zamanı. Solana Pay kullanarak kendi fikirlerinizi geliştirmekten çekinmeyin. Ya da, biraz ilham almak istiyorsanız, aşağıdaki öneriyi kullanabilirsiniz.

Solana Pay kullanarak (ya da laboratuvardakini değiştirerek) kullanıcılara NFT mint etmek için bir uygulama oluşturun. Bir adım daha ileri giderek, işlemin yalnızca kullanıcı bir veya daha fazla koşulu yerine getirirse (örn. belirli bir koleksiyondan bir NFT tutuyorsa, önceden belirlenmiş bir listede yer alıyorsa vb.) gerçekleştirilmesini sağlayın.

Bununla yaratıcı olun! Solana Pay spesifikasyonu, birçok benzersiz kullanım durumu için pek çok kapı açar.


Kodunuzu GitHub'a yükleyin ve [bize bu ders hakkında ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=3c7e5796-c433-4575-93e1-1429f718aa10)!
