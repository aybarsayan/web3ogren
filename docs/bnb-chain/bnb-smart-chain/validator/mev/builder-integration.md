---
title: Builder için Entegrasyon Kılavuzu - BSC MEV
description: Bu kılavuz, Builder'ın BNB Chain üzerindeki MEV entegrasyonu için gerekli bilgileri ve temel standartları özetlemektedir. Kullanıcılar için stratejik öneriler içermekte ve işlem sürecine dair detaylar sunmaktadır.
keywords: [Builder, MEV, BNB Chain, entegrasyon, API, doğrulayıcı, gasFee]
---

# Builder için Entegrasyon Kılavuzu

[Builder API Spesifikasyonu](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP322.md), yapıcıların uygulaması gereken standart arayüzü tanımlar, ancak özel uygulama MEV API sağlayıcılarına bırakılmıştır. BNB Chain topluluğu, referans olarak basit bir [uygulama örneği](https://github.com/bnb-chain/bsc-builder) sunmaktadır.

## Builder'ı Özelleştir

Builder, büyük esneklik sunmasına rağmen, hala bazı temel standartların izlenmesi gerekmektedir:

1.  Builder'ın **yapıcı hesabı** oluşturması gerekmektedir; bu hesap block teklifini imzalamak ve ücretleri almak için kullanılır. Builder, gönderdiği blok için bir bahşiş (builder ücreti) talep edebilir. Eğer blok sonunda seçilirse, **yapıcı hesabı** bahşişi alacaktır.

2.  Builder, doğrulayıcılardan hata raporlarını almak için **mev_reportIssue** API'sini uygulamak zorundadır.

3.  İşlem sızıntısını önlemek için, builder yalnızca dönüş yapan doğrulayıcıya blok teklifleri gönderebilir.

4.  Aynı yükseklikte aynı builder'dan en fazla 3 blok teklifi gönderilebilir.

:::tip
**Öneri:** Builder'ı uygularken bu temel standartlara dikkat edilmesi, işlem sürekliliği ve güvenliği için önemlidir.
:::

Builder'ı ilgilendirebilecek bazı gönderici API'leri şunlardır:

1.  **mev_bestBidGasFee**. Bu API, bütün builder'lardan alınan bloklar arasında doğrulayıcının aldığı en kârlı ödülü döndürecektir. Ödül, şu şekilde hesaplanır: **gasFee\*(1 - commissionRate) - tipToBuilder**. Bir builder, **bestBidGasFee**'yi yerel biriyle karşılaştırarak blok teklifini gönderip göndermeyeceğine karar verebilir.

2.  **mev_params.** Bu API, doğrulayıcı üzerindeki **BidSimulationLeftOver**, **ValidatorCommission**, **GasCeil** ve **BidFeeCeil** ayarlarını döndürecektir. Eğer mevcut zaman **(blok zamanı - BidSimulationLeftOver)**'den sonra ise, blok teklifleri göndermeye gerek yoktur; **ValidatorCommission** ve **BidFeeCeil**, builder'ın ücret stratejisini oluşturmasına yardımcı olur. **GasCeil**, bir builder'ın daha fazla işlem eklemeyi ne zaman bırakması gerektiğini anlamasına yardımcı olur.

:::info
Builder'lar, kullanıcılar için fiyatlandırma modelleri tanımlama, sezgisel API'ler oluşturma ve paket doğrulama kurallarını belirleme özgürlüğüne sahiptir.
:::

## Örnek Builder ile Kurulum

**Adım 1: Doğrulayıcı Bilgilerini Bul**

MEV entegrasyonunu açan doğrulayıcılar için kamuya açık bilgiler [bsc-mev-info](https://github.com/bnb-chain/bsc-mev-info) adresinde gösterilmektedir. Builder'lar burada doğrulayıcıya bilgi verebilir.

**Adım 2: Builder'ı Kurun.**

Builder, config.toml dosyasında belirtilen etherbase hesabı gibi bir hesap kullanarak teklifi imzalamalıdır.

```toml
[Eth.Miner.Mev]
BuilderEnabled = true # teklif göndermeyi aç
BuilderAccount = "0x..." # teklifi imzalayan builder adresi, genellikle etherbase adresi ile aynıdır
```

Doğrulayıcı düğüm listesini yapılandırın; buna doğrulayıcının adresi ve kamuya açık URL dahildir. Kamuya açık URL, gönderici hizmetini ifade eder.

```toml
[[Eth.Miner.Mev.Validators]]
Address = "0x23707D3D...6455B52B3"
URL = "https://bsc-fuji.io"

[[Eth.Miner.Mev.Validators]]
Address = "0x52825922...3A1A7A422"
URL = "http://bsc-mathwallet.io"
```

**Adım 3: Bilgileri Yayınlayın**

:::note
Informasyonun [bsc-mev-info](https://github.com/bnb-chain/bsc-mev-info) adresinde yayımlanması şiddetle önerilir.
::: 