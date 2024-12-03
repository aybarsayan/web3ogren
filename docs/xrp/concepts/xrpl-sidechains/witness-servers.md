---
title: Tanık Sunucuları
seoTitle: Tanık Sunucuları ve XRP Ledger
sidebar_position: 4
description: Tanık sunucuları, XRP Ledger ile başka bir zincir arasındaki işlemleri tanıklık eden ve imzalayan hafif sunuculardır. Bu kılavuzda tanık sunucularının rolü ve konfigürasyonu ele alınmaktadır.
tags: 
  - Tanık Sunucusu
  - XRP Ledger
  - Blockchain
  - Uyumluluk
  - Çapraz Zincir
  - DeFi
keywords: 
  - Tanık Sunucusu
  - XRP Ledger
  - Blockchain
  - Uyumluluk
  - Çapraz Zincir
  - DeFi
---

## Tanık Sunucular
[[Kaynak]](https://github.com/seelabs/xbridge_witness "Kaynak")

_(Bu, [XChainBridge ammendi][] not-enabled /%})_

Bir _tanık sunucusu_, bir kilitleme zinciri ile bir ihraç zinciri arasındaki işlemler için tarafsız bir tanık olarak hareket eder. **Bir köprünün her iki tarafındaki kapı hesaplarını dinler ve bir işlemin gerçekleştiğini doğrulayan onayları imzalar.** Temelde, bir kaynağı hesap üzerindeki değerlerin kilitlendiğini veya yakıldığını **"kanıtlama" amacıyla bir oracle gibi hareket ederler**, bu da alıcının karşılık gelen fonları varış hesabında talep etmesine (madencilik veya kilidi açarak) olanak tanır.

Kilitleme zinciri ile ihraç zinciri arasındaki köprü, aşağıdaki bilgileri konfigürasyonunda içerir:

- Köprü üzerindeki işlemleri izleyen tanık sunucuları. Bir veya daha fazla tanık sunucusu seçebilirsiniz.
- Tanık sunucularının hizmetleri için ücretleri.

:::info
Herkes bir tanık sunucusu çalıştırabilir. Ancak, ihraç zincirinin katılımcılarının tanık sunucularının güvenilirliğini değerlendirme yükümlülüğü vardır.
:::

Bir tanık sunucusu çalıştırıyorsanız, ayrıca bir `rippled` düğümünü çalıştırmalı ve bunun tanık sunucusunun erişime ihtiyaç duyduğu zincir ile senkronize olmalısınız.

:::note
İhraç zincirleri, başlangıçta yalnızca bir tanık sunucusu ile bir köprü yapılandırmayı ve tanık sunucuyu kendileri çalıştırmayı tercih edebilirler. Bu strateji, ihraç zincirinin henüz pazarda kendini kurmadığı ilk dönemde faydalıdır.
:::

---

## Tanık Sunucusu Konfigürasyonu

Tanık sunucusu, `--conf` komut satırı argümanı kullanılarak belirtilen bir JSON konfigürasyon dosyası alır.

### Örnek Konfigürasyon JSON'u

```json
{
  "KilitlemeZinciri": {
    "Son Nokta": {
      "Host": "127.0.0.1",
      "Port": 6005
    },
    "TxnGönder": {
      "GöndermeliMi": true,
      "İmzaAnahtarTohumu": "shUe3eSgGK4e6xMFuCakZnxsMN1uk",
      "İmzaAnahtarTürü": "ed25519",
      "GönderenHesap": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
    },
    "ÖdülHesabı": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
  },
  "İhraçZinciri": {
    "Son Nokta": {
      "Host": "127.0.0.1",
      "Port": 6007
    },
    "TxnGönder": {
      "GöndermeliMi": true,
      "İmzaAnahtarTohumu": "shUe3eSgGK4e6xMFuCakZnxsMN1uk",
      "İmzaAnahtarTürü": "ed25519",
      "GönderenHesap": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
    },
    "ÖdülHesabı": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
  },
  "RPCEndpoint": {
    "Host": "127.0.0.1",
    "Port": 6010
  },
  "DBDir": "/var/lib/witness/witness01/db",
  "LogFile": "/var/log/witness/witness01.log",
  "İmzaAnahtarTohumu": "spkHEwDKeChm8PAFApLkF1E2sDs6t",
  "İmzaAnahtarTürü": "ed25519",
  "XChainBridge": {
    "KilitlemeZinciriKapısı": "r3nCVTbZGGYoWvZ58BcxDmiMUU7ChMa1eC",
    "KilitlemeZinciriİhraç": {
      "paraBirimi": "XRP"
    },
    "İhraçZinciriKapısı": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "İhraçZinciriİhraç": {
      "paraBirimi": "XRP"
    }
  },
  "Yönetici": {
    "KullanıcıAdı": "username01",
    "Şifre": "password01"
  }
}
```

### Konfigürasyon Alanları

| Alan Adı          | JSON Türü      | Zorunlu? | Açıklama |
|-------------------|----------------|----------|----------|
| `Yönetici`        | Nesne          | Hayır    | Tanık sunucusuna ayrıcalıklı istekler için `KullanıcıAdı` ve `Şifre` alanları (string olarak). **Not:** Hem yönetici alanları ayarlanmalı ya da hiçbiri. |
| `İhraçZinciri`    | Nesne          | Evet     | İhraç zinciri ile etkileşim için parametreler. |
| `KilitlemeZinciri`| Nesne          | Evet     | Kilitleme zinciri ile etkileşim için parametreler. |
| `RPCEndpoint`     | Nesne          | Evet     | Tanık sunucusuna RPC istekleri için son nokta. |
| `LogFile`         | String         | Evet     | Günlük dosyasının konumu. | 
| `LogSeviyesi`     | String         | Evet     | Günlük dosyasında saklanacak günlük seviyeleri. Seçenekler `Tümü`, `İz`, `Hata Ayıklama`, `Bilgi`, `Uyarı`, `Hata`, `Ağır`, `Devre Dışı` ve `Hiçbiri`dir. |
| `DBDir`           | String         | Evet     | Veritabanlarının saklandığı dizinin konumu. |
| `İmzaAnahtarTohumu`| String        | Evet     | Tanık sunucusunun onaylarını imzalamak için kullanması gereken tohum. |
| `İmzaAnahtarTürü` | String         | Evet     | `İmzaAnahtarTohumu`’nu kodlamak için kullanılan algoritmadır. Seçenekler `secp256k1` ve `ed25519`dir. |
| `XChainBridge`    | XChainBridge   | Evet     | Tanık sunucusunun izlediği köprü. |

#### İhraçZinciri ve KilitlemeZinciri Alanları

| Alan Adı         | JSON Türü | Zorunlu? | Açıklama |
|------------------|-----------|----------|----------|
| `Son Nokta`      | Nesne     | Evet     | Zincir ile senkronize olan bir `rippled` düğümünün websocket son noktası. **Not:** Aynı kişinin `rippled` düğümünü ve tanık sunucusunu kontrol etmesi gerekir. |
| `TxnGönder`      | Nesne     | Evet     | Zincir üzerindeki işlem gönderimi için parametreler. |
| `ÖdülHesabı`     | String    | Evet     | Tanığın `İmzaÖdülü`nün zincir üzerindeki payını alacak hesap. |

#### Son Nokta Alanları

| Alan Adı | JSON Türü | Zorunlu? | Açıklama |
|----------|-----------|----------|----------|
| `Host`   | String    | Evet     | `rippled` düğümünün IP adresi. **Not:** Bu, bir IPv4 adresi veya URL kabul eder. |
| `Port`   | String    | Evet     | Websocket son noktası için kullanılan port. |

#### RPCEndpoint Alanları

| Alan Adı | JSON Türü | Zorunlu? | Açıklama |
|----------|-----------|----------|----------|
| `Host`   | String    | Evet     | RPC istekleri için tanık sunucusunun IP adresi. **Not:** Bu, bir IPv4 adresi veya URL kabul eder. |
| `Port`   | String    | Evet     | Websocket son noktası için kullanılan port. |

#### TxnGönder Alanları

| Alan Adı          | JSON Türü | Zorunlu? | Açıklama |
|-------------------|-----------|----------|----------|
| `GöndermeliMi`     | Boolean   | Evet     | Tanık sunucusunun kilitleme zincirinde işlemleri gönderip göndermeyeceğini belirten bir boolean. |
| `İmzaAnahtarTohumu`| String    | Hayır    | Tanık sunucusunun kilitleme zincirindeki işlemlerini imzalamak için kullanacağı tohum. Bu, `GöndermeliMi` `true` ise zorunludur. |
| `İmzaAnahtarTürü` | String    | Hayır    | `İmzaAnahtarTohumu`'nu kodlamak için kullanılan algoritma. Seçenekler `secp256k1` ve `ed25519`dir. Bu, `GöndermeliMi` `true` ise zorunludur. |
| `GönderenHesap`    | String    | Hayır    | `XChainAddClaimAttestation` ve `XChainAddAccountCreateAttestation` işlemlerinin gönderileceği hesap. Bu, `GöndermeliMi` `true` ise zorunludur. |

#### XChainBridge Alanları

| Alan               | JSON Türü | [Dahili Tür][] | Zorunlu? | Açıklama     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `İhraçZinciriKapısı`| String    | Hesap             | Evet       | İhraç zincirindeki kapı hesabı. XRP-XRP köprüsü için, bu, genesis hesabı olmalıdır (ağın ilk başlatıldığında oluşturulan hesap, tüm XRP'yi içerir). |
| `İhraçZinciriİhraç`| İhraç     | İhraç             | Evet       | İhraç zincirinde basılan ve yakılan varlık. Bir IOU-IOU köprüsü için, varlığın ihraççısı, ihraç zincirindeki kapı hesabı olmalıdır, arz sorunlarını önlemek için. |
| `KilitlemeZinciriKapısı`| String| Hesap             | Evet       | Kilitleme zincirindeki kapı hesabı. |
| `KilitlemeZinciriİhraç`| İhraç   | İhraç             | Evet       | Kilitleme zincirinde kilitlenen ve açılan varlık. |

---

## Tanık Sunucusu SSS

### Tanık Sunucusu çalıştırmanın riskleri var mı?

Bir Kenar Zinciri için Tanık Sunucusu işletmenin belirli riskleri vardır, bunlar arasında:

**Düzenleyici Hususlar**: Bir Tanık Sunucusu işletmek bazı düzenleyici riskler taşır. Aşağıda bazıları belirtilmiştir, bunların bazıları yalnızca ABD'de bulunan projelere uygulanan düzenleyici rejimlere ilişkindir. ABD rejimleri, dünyanın en katı düzenleyici rejimleri olarak yaygın olarak kabul edildiğinden burada belirtilmiştir.

ABD'deki “para iletme işletmesi” işlemleri ile ilgili düzenleyici rejimi, Tanık Sunucularını işletme açısından net değildir. **Tanık Sunucuları**, bir dizi merkeziyetsiz varlık ve kişi tarafından işletilmesi amaçlanmaktadır. Bu niyete rağmen, bir düzenleyici, belirli bir kuruluş veya koordineli bir grup tarafından Tanık Sunucularının “merkezi” kontrol edildiğini belirlerse, bu tür bir faaliyeti para iletimi olarak değerlendirebilir. ABD Hazine Bakanlığı yakın zamanda belirli projelerin “merkeziyetsiz” olup olmadığını belirlerken göz önünde bulunduracağı bir dizi faktör tanımlayan bir rapor yayımladı. [2023 DeFi Kaçak Finansman Riski Değerlendirmesi](https://home.treasury.gov/news/press-releases/jy1391) için bakınız. Bu son düzenleyici kılavuz önemlidir çünkü ABD Hazine Bakanlığı belirli projelerin “merkeziyetsiz” olabileceğini tanımaktadır ve Tanık Sunucularının işletilmesi “merkeziyetsiz” ise, “para iletme işletmesi” olarak kabul edilmeyebilir.

- **ABD kripto düzenlemeleri** sürekli olarak en katı ve agresif şekilde uygulanmakta kalmış olsa da, diğer yargı bölgelerinde de “para” ve diğer değerlerin transferi ile ilgili düzenlemeler ve yasalar bulunmaktadır. Örneğin, **Mart 2022'de**, Birleşik Krallık düzenleyici otoriteleri, kripto ve merkeziyetsiz finans ile ilgili bir dizi belge rehberi yayınladı. [Finansal İstikrar Odaklı: Kripto Varlıklar ve Merkeziyetsiz Finans](https://www.bankofengland.co.uk/financial-stability-in-focus/2022/march-2022) için bakınız. Daha yakın zamanda, **Haziran 2023'te**, AB resmi olarak merkeziyetsiz kripto platformlarına ilişkin yazılı kurallar ve düzenlemeleri kısmen uygulayan bir düzenleyici çerçeve benimsemiştir. [Kripto Varlıkları Pazar Düzenlemesi](https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica) için bakınız.

Bir Tanık Sunucusu çalıştırmayı düşünüyorsanız, ilgili her yargı bölgesinin özel gereksinimlerine uyum sağlamanız, ilişkilendirilen riskleri etkili bir şekilde yönetmeniz açısından kritik önem taşımaktadır.

---

**Teknoloji ve Ağ Güvenliği**: Bir Tanık Sunucusu çalıştırmayı planlayanlar, bunu yapmanın teknik ve güvenlik yönleri hakkında bilgi sahibi olmalıdır. **Bir Tanık Sunucusu işletmeyi kabul etmeden önce**, işlevselliği, potansiyel zayıflıkları ve gerekli teknoloji ve güvenlik önlemleri hakkında tam bir anlayışa sahip olmalısınız.

**Sivil Sorumluluk**: Bir Tanık Sunucusu çalıştırmak, herhangi bir blok zinciri projesine katılmak gibi belirsiz bir sivil sorumluluk riski taşır. ABD'de ve diğer yargı bölgelerinde bir dizi davacı davası patlak vermiştir ve herhangi bir davacının avukatının sivil davada hangi teorileri uygulayacağını değerlendirmek zordur. **Herhangi bir gerçek veya algılanan sivil sorumluluk riski ne olursa olsun**, dikkate alınması gereken bir diğer nokta, bir asılsız davanın bile yanıt vermek için zaman ve para gerektirebileceğidir.

### Bir Tanık Sunucusu çalıştırmayı kabul etmeden önce bağımsız danışmanlık almalı mıyım?

Evet. Bir Tanık Sunucusu çalıştırmayı düşünen herhangi bir taraf, deneyimli profesyonellerden bağımsız hukuki ve vergi danışmanlığı almalıdır. Lütfen unutmayın ki, **Tanık Sunucuları** karşılıklı olarak çapraz zincir transferlerini onayladıkları için, ABD düzenleyicileri tarafından tanımlandığı şekliyle ortak bir girişim olarak faaliyet gösterdikleri anlaşılabilir. Ortak bir girişimde, **müteselsil sorumluluk uygulanabilir**, yani her Tanık Sunucusu tüm yükümlülük veya zararlar için ayrı ayrı sorumlu tutulabilir.

Gelişen düzenleyici ortam göz önüne alındığında, bir Tanık Sunucusu işletmenin beklentileri ve yükümlülükleriyle ilgili karmaşık ve değişen küresel düzenleyici ortamda yönlendirme yapabilecek bir hukuk profesyoneli ile görüşmek kritik öneme sahiptir. **Herhangi bir blok zinciri projesinde olduğu gibi**, kendi araştırmanızı yapmanız önemlidir. Bu SSS'ler yalnızca genel rehberliktir ve hukuki veya vergi danışmanlığı olarak değerlendirilemez.

### Kimler bir Tanık Sunucusu çalıştırmamalıdır?

**Blockchain, MSB ve MTL düzenlemeleri** ve diğer ilgili düzenlemeler ile yasalara dair deneyiminiz yoksa (veya deneyimli destek erişiminiz yoksa) bir Tanık Sunucusu çalıştırmamalısınız. Ayrıca, teknik ve uygunluk uzmanlığına sahip deneyimli bir kişi veya kuruluş değilseniz Tanık Sunucusu çalıştırmamalısınız. **Tek başına Tanık Sunucuları çalıştıracak kadar nitelikli ve deneyimli çok az kişi vardır.** Ayrıca, bağımsız hukuki ve vergi danışmanlığı almadıysanız Tanık Sunucusu çalıştırmamalısınız.

### Bu SSS'ler kapsamlı ve belirleyici tavsiyeler midir?

Hayır. Bu SSS'ler genel rehberlik sağlamak amacıyla hazırlanmıştır ve teknik, finansal veya hukuki danışmanlık teşkil etmez. **Bu SSS'ler**, bir kişinin özel koşullarına yönelik profesyonel tavsiyenin yerine kullanılmamalıdır. **Blok zinciri ve dijital varlık alanı karmaşık ve sürekli değişen bir yapıda olduğundan**, güncel kalmak ve uzman tavsiyesi almak gereklidir.

Bir Kenar Zinciri ile ilgilenenlere, resmi kaynakları düzenli olarak kontrol etmeleri önerilir, örneğin hükümet ve düzenleyici organların web siteleri. Bununla birlikte, **blok zinciri ve kripto para birimlerinde uzmanlaşmış hukuk profesyonelleriyle görüşmek**, doğru ve kişiselleştirilmiş tavsiye almanın en güvenilir yoludur.

