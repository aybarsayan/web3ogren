---
sidebarSortOrder: 2
title: İşlemleri Yeniden Deneme
altRoutes:
  - /docs/core/transactions/retry
description:
  Kaybolan işlemleri nasıl yöneteceğinizi ve Solana'da özel yeniden deneme mantığı
  uygulamayı öğrenin. Bu kılavuz, işlem tekrar yayınlama, ön uç kontrolleri ve
  Solana blok zincirinde güvenilir işlem işleme sağlamak için işlem yeniden denemeleri
  yönetimi için en iyi uygulamaları kapsar.
---

# İşlemleri Yeniden Deneme

Bazen, görünüşte geçerli bir işlem, bir blokta dahil edilmeden önce kaybolabilir. Bu, en
sıklıkla, bir RPC düğümünün işlemi yeniden liderine yaymakta başarısız olduğu ağ
yoğunluğu dönemlerinde meydana gelir. Nihai kullanıcı açısından, işlemin tamamen
kaybolmuş gibi görünmesi olasıdır. RPC düğümleri, genel bir yeniden yayınlama
algoritması ile donatılmış olsa da, uygulama geliştiricileri de kendi özel yeniden
yayınlama mantıklarını geliştirme yeteneğine sahiptir.

## TLDR;

- RPC düğümleri, işlemleri genel bir algoritma kullanarak yeniden yayınlamaya
  çalışacaktır.
- Uygulama geliştiricileri, kendi özel yeniden yayınlama mantıklarını
  uygulayabilirler.
- Geliştiriciler, `sendTransaction` JSON-RPC yöntemindeki `maxRetries`
  parametresinden yararlanmalıdır.
- Geliştiriciler, işlemler gönderilmeden önce hataları artırmak için ön uç
  kontrollerini etkinleştirmelidir.
- **Çok önemlidir**: Herhangi bir işlemi tekrar imzalamadan önce, 
  başlangıç işleminin blockhash'inin süresinin dolduğundan emin olunması.

## Bir İşlemin Yolculuğu

### Müşterilerin İşlemleri Göndermesi

Solana'da bir **mempool** kavramı yoktur. Tüm işlemler, ister programatik olarak
başlatılsın ister nihai kullanıcı tarafından, etkin bir şekilde liderlere yönlendirilir
ve böylelikle blok içine işlenebilir. İşlemleri liderlere göndermenin iki ana yolu
vardır:

1. Bir RPC sunucusu aracılığıyla ve
   `sendTransaction` JSON-RPC yöntemi.
2. Doğrudan liderlere bir
   [TPU İstemcisi](https://docs.rs/solana-client/latest/solana_client/tpu_client/index.html) aracılığıyla.

Nihai kullanıcıların büyük çoğunluğu işlemleri bir RPC sunucusu aracılığıyla
gönderecektir. Bir istemci bir işlem gönderdiğinde, alıcı RPC düğümü bu işlemi hem
mevcut hem de gelecek liderlere yayma girişiminde bulunacaktır. İşlem, bir lider
tarafından işlenene kadar, işlem ile ilgili olarak istemcinin ve iletimdeki RPC
düğümlerinin bilmediği bir kayıt yoktur. TPU istemcisi durumunda, yeniden yayınlama
ve lider yönlendirmesi tamamen istemci yazılımı tarafından yönetilmektedir.

![Müşteriden lidere işlemlerin yolculuğuna genel bakış](../../images/solana/public/assets/docs/rt-tx-journey.png)

### RPC Düğümlerinin İşlemleri Yayması

Bir RPC düğümü `sendTransaction` aracılığıyla bir işlem aldığında, işlemi,
ilgili liderlere iletmeden önce bir
[UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol) paketi haline
dönüştürecektir. UDP, doğrulayıcıların hızlı bir şekilde birbirleriyle iletişim
kurmasına olanak tanırken, işlem teslimatıyla ilgili herhangi bir garanti
vermez.

Solana'nın lider programı, her `dönem` (~2 gün)
öncesinden bilinmektedir, bu nedenle bir RPC düğümü, işlemi doğrudan mevcut ve gelecek
liderlere yayınlayacaktır. Bu, Ethereum gibi diğer dedikodu protokollerinin
işlemleri rastgele ve geniş bir şekilde tüm ağ boyunca yaydığına kıyasla farklılık
gösterir. Varsayılan olarak, RPC düğümleri, işlemi nihai hale getirilene veya
işlemin blockhash'i süresinin dolana kadar her iki saniyede bir liderlere iletmeye
çalışır (150 blok veya bu yazının yazıldığı zamandan itibaren ~1 dakika 19
saniye). Bekleyen yeniden yayın kuyruk boyutu
[10.000 işlem](https://github.com/solana-labs/solana/blob/bfbbc53dac93b3a5c6be9b4b65f679fdb13e41d9/send-transaction-service/src/send_transaction_service.rs#L20)
boyutunu aşarsa, yeni gönderilen işlemler düşürülür. RPC operatörlerinin bu
yeniden deneme mantığının varsayılan davranışını değiştirmek için ayarlayabileceği
komut satırı
[argümanları](https://github.com/solana-labs/solana/blob/bfbbc53dac93b3a5c6be9b4b65f679fdb13e41d9/validator/src/main.rs#L1172) bulunmaktadır.

Bir RPC düğümü bir işlemi yayınladığında, işlemi bir liderin
[İşlem İşlem Birimine (TPU)](https://github.com/solana-labs/solana/blob/cd6f931223181d5a1d47cba64e857785a175a760/core/src/validator.rs#L867) iletmeye çalışacaktır. TPU, işlemleri beş ayrı aşamada işlemektedir:

- [Fetch Aşaması](https://github.com/solana-labs/solana/blob/cd6f931223181d5a1d47cba64e857785a175a760/core/src/fetch_stage.rs#L21)
- [SigVerify Aşaması](https://github.com/solana-labs/solana/blob/cd6f931223181d5a1d47cba64e857785a175a760/core/src/tpu.rs#L91)
- [Bankacılık Aşaması](https://github.com/solana-labs/solana/blob/cd6f931223181d5a1d47cba64e857785a175a760/core/src/banking_stage.rs#L249)
- [Tarih Kanıtı Servisi](https://github.com/solana-labs/solana/blob/cd6f931223181d5a1d47cba64e857785a175a760/poh/src/poh_service.rs)
- [Yayın Aşaması](https://github.com/solana-labs/solana/blob/cd6f931223181d5a1d47cba64e857785a175a760/core/src/tpu.rs#L136)

![İşlem İşlem Birimi (TPU) genel bakış](../../images/solana/public/assets/docs/rt-tpu-jito-labs.png)

Bu beş aşamadan Fetch Aşaması, işlemleri alma sorumluluğuna sahiptir. Fetch Aşaması
içerisinde, doğrulayıcılar gelen işlemleri üç porta göre kategorize edecektir:

- [tpu](https://github.com/solana-labs/solana/blob/cd6f931223181d5a1d47cba64e857785a175a760/gossip/src/contact_info.rs#L27)
  token transferleri, NFT mintleri ve program talimatları gibi normal işlemleri
  yönetir.
- [tpu_vote](https://github.com/solana-labs/solana/blob/cd6f931223181d5a1d47cba64e857785a175a760/gossip/src/contact_info.rs#L31)
  sadece oy verme işlemlerine odaklanır.
- [tpu_forwards](https://github.com/solana-labs/solana/blob/cd6f931223181d5a1d47cba64e857785a175a760/gossip/src/contact_info.rs#L29)
  mevcut liderin tüm işlemleri işleyememesi durumunda, işlenmemiş paketleri bir
  sonraki lidere iletecektir.

:::tip
TPU hakkında daha fazla bilgi için, [Jito Labs’ın bu harika yazısına](https://jito-labs.medium.com/solana-validator-101-transaction-processing-90bcdc271143) başvurabilirsiniz.
:::

## İşlemler Nasıl Kaybolur

Bir işlemin yolculuğu boyunca, işlemin ağdan kazara kaybolabileceği birkaç senaryo
vardır.

### Bir işlem işlenmeden önce

Eğer ağ bir işlemi kaybederse, bu işlemin, bir lider tarafından işlenmeden önce
kaybolması en muhtemel durumdur. UDP
[paket kaybı](https://en.wikipedia.org/wiki/Packet_loss), bunun nedeninin en
basitidir. Yoğun ağ yükü dönemlerinde, doğrulayıcıların işlem işleme gereksinimiyle
oluşan yüksek yükten bunalmaları da mümkündür. Doğrulayıcılar, fazla işlemleri
`tpu_forwards` aracılığıyla iletmeye hazır olsa da, iletilebilecek veri miktarında
[bir sınır](https://github.com/solana-labs/solana/blob/master/core/src/banking_stage.rs#L389) bulunmaktadır.
Ayrıca, her bir iletim, doğrulayıcılar arasında tek bir sıçrama ile sınırlıdır. Yani,
`tpu_forwards` portundan alınan işlemler diğer doğrulayıcılara iletilmez.

Bir işlemin, işlenmeden önce kaybolmasına neden olabilecek iki daha az bilinen durum
da vardır. İlk senaryo, RPC havuzundan gönderilen işlemleri içerir. Ara sıra, RPC
havuzunun bir kısmı, havuzun geri kalanından yeterince ileride olabilir. Bu, havuz
içindeki düğümlerin birlikte çalışması gerektiğinde sorunlara neden olabilir. Bu örnekte,
işlemin
`recentBlockhash` havuzun gelişmiş kısmından
(Sunucu A) sorgulanmıştır. İşlem, havuzun geride kalan kısmına (Sunucu B) gönderildiğinde,
düğüm mevcut blockhash'i tanımayacak ve işlemi kaybedecektir. Geliştiriciler, `sendTransaction` üzerindeki
`ön uç kontrolleri` etkinleştirirse, işlem göndermede bu durum
algılanabilir.

![RPC Havuzu aracılığıyla kaybedilen işlem](../../images/solana/public/assets/docs/rt-dropped-via-rpc-pool.png)

Geçici ağ çatallanmaları da kaybolan işlemlere neden olabilir. Eğer bir doğrulayıcı
Bankacılık Aşaması içinde bloklarını tekrar oynamakta yavaşsa, azınlık bir çatalla
sonuçlanabilir. Bir istemci işlem oluşturduğunda, işlemin sadece azınlık çatallasında
mevcut olan bir `recentBlockhash` referans alması mümkündür. İşlem gönderildikten
sonra, küme, işlem işlenmeden önce azınlık çatallarından kopabilir. Bu durumda,
işlem, blockhash bulunamadığı için kaybolmuştur.

![İşlem kaynağı azınlık çatallanınca (işlenmeden önce)](../../images/solana/public/assets/docs/rt-dropped-minority-fork-pre-process.png)

### Bir işlem işlendiğinde ve nihayete erdirilmeden önce

Eğer bir işlem azınlık çatallasından bir `recentBlockhash` referansı alıyorsa,
yine de işlemin işlenmesi mümkündür. Ancak, bu durumda, işlem azınlık çatalladaki
lider tarafından işlenecektir. Bu lider, işlenmiş işlemlerini ağın geri kalanıyla
paylaşmaya çalıştığında, azınlık çatallayı tanımayan çoğunluk doğrulayıcıları ile
uzlaşma sağlamakta başarısız olacaktır. Bu noktada, işlem nihayete erdirmeden
kaybolacaktır.

![İşlem kaynağı azınlık çatallanınca (işlendikten sonra)](../../images/solana/public/assets/docs/rt-dropped-minority-fork-post-process.png)

## Kaybolan İşlemleri Yönetmek

RPC düğümleri işlemleri yeniden yayınlama girişiminde bulunacak olsa da, kullandıkları
algoritma genel olup, belirli uygulamaların ihtiyaçlarına genellikle uygun değildir.
Ağ yoğunluğu zamanları için hazırlıklı olmak amacıyla, uygulama geliştiricileri,
özgün yeniden yayınlama mantıklarını özelleştirmelidir.

### sendTransaction'a Derinlemesine Bakış

İşlemleri göndermede, `sendTransaction` RPC yöntemi geliştiricilere mevcut olan
ana araçtır. `sendTransaction`, bir işlemi bir istemciden bir RPC düğümüne
iletmekten sorumludur. Düğüm işlemi alırsa, `sendTransaction`, işlemi takip etmek için
kullanılabilecek işlem kimliğini döndürecektir. Başarılı bir yanıt, işlemin küme tarafından
işlenip işlenmeyeceğini veya nihayete evirilip evrilmeyeceğini göstermez.

### İstek Parametreleri

- `transaction`: `string` - tam imzalı işlem, kodlanmış string olarak.
- (isteğe bağlı) `configuration object`: `object`
  - `skipPreflight`: `boolean` - eğer true ise, işlemi ön uç kontrollerini atla
    (varsayılan: false).
  - (isteğe bağlı) `preflightCommitment`: `string` -
    `Taahhüt` düzeyini kullanma
    ön uç simülasyonları için bank slotsu (varsayılan: "finalized").
  - (isteğe bağlı) `encoding`: `string` - İşlem verileri için kullanılan Kodlama.
    Ya "base58" (yavaş) ya da "base64" (varsayılan: "base58").
  - (isteğe bağlı) `maxRetries`: `usize` - RPC düğümünün liderlere
    işlemi göndermeyi yeniden denemek için maksimum
    sayısı. Bu parametre verilmezse, RPC düğümü işlem nihayete erene veya
    blockhash süresi dolana kadar işlemi yeniden deneyecektir.

**Yanıt:**

- `işlem kimliği`: `string` - İşlem içine gömülü ilk işlem imzası, base-58
  kodlama stringi olarak. Bu işlem kimliği, `getSignatureStatuses` ile
  durum güncellemeleri için sorgulanabilir.

---

## Yeniden Yayınlama Mantığını Özelleştirmek

Özgün yeniden yayınlama mantıklarını geliştirmek amacıyla, geliştiricilerin
`sendTransaction`'ın `maxRetries` parametresinden yararlanmaları gerekir. Eğer
verilirse, `maxRetries`, bir RPC düğümünün varsayılan yeniden deneme mantığını
geçersiz kılarak, geliştiricilerin yeniden deneme sürecini
[makul sınırlar içinde](https://github.com/solana-labs/solana/blob/98707baec2385a4f7114d2167ef6dfb1406f954f/validator/src/main.rs#L1258-L1274) manuel olarak kontrol etmelerine
olanağı sağlar.

İşlemleri manuel olarak yeniden denemek için yaygın bir şablon, `getLatestBlockhash`'dan
gelen `lastValidBlockHeight` değerini geçici olarak depolamayı içerir. Depolandıktan sonra,
bir uygulama, kümenin blok yüksekliğini
`sorgulayabilir` ve uygun bir aralıkta işlemi
manuel olarak yeniden deneyebilir. Ağ yoğunluğu zamanlarında, `maxRetries`'i 0
olarak ayarlamak ve özel bir algoritma aracılığıyla manuel olarak yeniden yayınlamak
avantajlıdır. Bazı uygulamalar bir
[üstel geri dönüş](https://en.wikipedia.org/wiki/Exponential_backoff) algoritması
kullanırken, [Mango](https://www.mango.markets/) gibi diğerleri,
belirli bir zaman aşımına kadar işlemleri sabit bir aralıkta
[devamlı olarak yeniden gönderme](https://github.com/blockworks-foundation/mango-ui/blob/b6abfc6c13b71fc17ebbe766f50b8215fa1ec54f/src/utils/send.tsx#L713) yolunu tercih eder.

```ts
import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import * as nacl from "tweetnacl";

const sleep = async (ms: number) => {
  return new Promise(r => setTimeout(r, ms));
};

(async () => {
  const payer = Keypair.generate();
  const toAccount = Keypair.generate().publicKey;

  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL,
  );

  await connection.confirmTransaction({ signature: airdropSignature });

  const blockhashResponse = await connection.getLatestBlockhash();
  const lastValidBlockHeight = blockhashResponse.lastValidBlockHeight - 150;

  const transaction = new Transaction({
    feePayer: payer.publicKey,
    blockhash: blockhashResponse.blockhash,
    lastValidBlockHeight: lastValidBlockHeight,
  }).add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount,
      lamports: 1000000,
    }),
  );
  const message = transaction.serializeMessage();
  const signature = nacl.sign.detached(message, payer.secretKey);
  transaction.addSignature(payer.publicKey, Buffer.from(signature));
  const rawTransaction = transaction.serialize();
  let blockheight = await connection.getBlockHeight();

  while (blockheight < lastValidBlockHeight) {
    connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
    });
    await sleep(500);
    blockheight = await connection.getBlockHeight();
  }
})();
```

`getLatestBlockhash` aracılığıyla sorgulama yaparken, uygulamalar niyet ettikleri
`taahhüt` düzeyini belirtmelidir.
Taahhütlerini `confirmed` (oylanmış) veya `finalized` (~30 blok
sonra `confirmed`) ayarlayarak, uygulamalar azınlık bir çataldan blockhash
almaktan kaçınabilirler.

Eğer bir uygulama bir yük dengeleyicinin arkasındaki RPC düğümlerine erişimi varsa, belirli
düğümler arasında iş yükünü bölmeyi de seçebilir. Veri yoğun isteklere hizmet eden RPC
düğümleri, az kalma eğiliminde olabilir ve işlemleri iletmek için uygun olmayabilir.
Zaman duyarlı işlemleri yöneten uygulamalar için, yalnızca `sendTransaction` işlemlerini
yönetmek üzere özel düğümlere sahip olmak ihtiyatlı olabilir.

### Ön Uç Atmanın Bedeli

Varsayılan olarak, `sendTransaction` bir işlemi göndermeden önce üç ön uç kontrolü
gerçekleştirir. Özellikle, `sendTransaction`:

- Tüm imzaların geçerli olduğunu doğrular.
- Referans verilen blockhash'in son 150 blok içinde olduğunu kontrol eder.
- İşlemi belirtilen bank slotu üzerindeki `preflightCommitment` ile simüle eder.

Eğer bu üç ön uç kontrolünden herhangi biri başarısız olursa, `sendTransaction`
işlemi göndermeden önce bir hata çıkaracaktır. Ön uç kontrolleri genellikle bir
işlemi kaybetmek ve bir istemcinin hatayı kibarca yönetmesini sağlamak arasında
fark oluşturabilir. Bu yaygın hataların dikkate alındığından emin olmak için,
geliştiricilerin `skipPreflight` ayarını `false` olarak tutmaları
tavsiye edilir.

### İşlemleri Yeniden İmzalama Zamanı

Yeniden yayınlama girişimlerine rağmen, bazen bir istemcinin işlemi yeniden imzalaması
gerekebilir. Herhangi bir işlemi yeniden imzalamadan önce, başlangıç işleminin
blockhash'inin süresinin dolmuş olduğundan **çok önemlidir**. Eğer başlangıç
blockhash'i hala geçerliyse, her iki işlemin de ağ tarafından kabul edilmesi mümkündür.
Bir nihai kullanıcı için, bu durum, istemcinin istemeden aynı işlemi iki kez
gönderdiği izlenimini verebilir.

> **Not:** Solana'da, bir işlem, referans aldığı blockhash'i `getLatestBlockhash`'dan alınan
> `lastValidBlockHeight` değerinden daha eski olduğunda güvenli bir şekilde
> iptal edilebilir. Geliştiriciler, bu `lastValidBlockHeight` değerini 
> `getEpochInfo` sorgulayarak
> takip etmeli ve yanıt içindeki `blockHeight` ile karşılaştırmalıdır. Bir blockhash
> geçersiz hale geldikten sonra, istemciler yeni sorgulanan bir blockhash ile
> yeniden imzalayabilirler.