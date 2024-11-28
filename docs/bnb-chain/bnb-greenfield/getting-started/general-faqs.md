---
title: Genel SSS - BNB Greenfield
description: BNB Greenfield sıkça sorulan sorular listesi. Bu metin, BNB Greenfield kullanımına dair sıkça karşılaşılan sorunlar ve çözümleri kapsamlı bir şekilde ele almaktadır.
keywords: [BNB Greenfield token, BNB Greenfield kullanımı, BNB transfer, Greenfield akıllı sözleşmeleri, veri depolama, ücret hesaplama]
---

### Neden cüzdanım üzerinden BNB tokenlerini BNB Greenfield'e gönderemiyorum?
Cüzdan, BNB Greenfield üzerinde transferleri desteklememektedir çünkü BNB Greenfield, diğer EVM zincirlerinden farklı bir işlem formatı kullanır. Tokeninizi cüzdanınızla transfer etmeye çalıştığınızda şu hatayla karşılaşabilirsiniz. **BNB tokenlerini BNB Greenfield'e gönderebilmek için `dCellar Transfer fonksiyonunu` kullanmanız gerekir.**

![](../../images/bnb-chain/bnb-greenfield/static/img/transfer_error.png){:style="width:50%"}

### BNB Greenfield kullanırken imza mesajındaki miktar alanını nasıl anlamalıyım?
Kullanıcılar BNB Greenfield'de bucket'lar oluşturmak veya dosyalar yüklemek gibi işlemler gerçekleştirdiklerinde, harcayacakları BNB miktarını içeren bir mesajı imzalamaları gerekmektedir. Ancak, bu miktar BNB birimlerinde değil, çok daha küçük olan WEI birimlerinde hesaplanmaktadır. Bir WEI, 10^-18 BNB'ye eşittir. Bu nedenle, imza mesajındaki miktar alanı çok büyük görünebilir, ancak aslında bir BNB'nin çok küçük bir kesiridir.

![](../../images/bnb-chain/bnb-greenfield/static/img/signature.png){:style="width:50%"}

### Greenfield'de bir token var mı? Bunu nasıl alabilirim?
BNB, Greenfield'deki ana yardımcı token olarak kalır, Greenfield'de başka bir token yoktur. BNB'yi birkaç şekilde edinebilirsiniz:

1. [BNB satın alın](https://www.binance.com/en/how-to-buy/bnb) eğer daha önce sahip değilseniz.
2. Eğer zaten BNB'niz varsa, BSC ağından Greenfield'e [DCellar](https://dcellar.io/) kullanarak çapraz zincir transferi yapın. Ayrıntılı adımları [buradan](https://docs.nodereal.io/docs/dcellar-get-started) okuyabilirsiniz. Çapraz zincir token transferi gerçekten hızlıdır, BNB'nizi bir dakika içinde almanız beklenmektedir.
3. Diğer Greenfield kullanıcılarından `içiçe işlemler` ile BNB alabilirsiniz.

### BNB'nin Greenfield'deki kullanımı nedir?
BNB, **staking token, gaz token, depolama hizmet ücreti tokenı ve yönetişim tokenı** olarak kullanılır. Daha fazla ayrıntı için `token ekonomisi` bölümüne bakın.

### Greenfield akıllı sözleşmeleri destekliyor mu?
Greenfield blok zinciri akıllı sözleşmeleri desteklememektedir, ancak BSC ve Greenfield arasındaki yerel çapraz zincir, ekosisteme programlanabilirlik getirir. Daha fazla teknik detay `burada` açıklanmıştır, akıllı sözleşmelerle Greenfield'e entegre olmaya başlamak için `eğitimi` takip edebilirsiniz.

### Greenfield hangi konsensüs algoritmasını kullanıyor?
Greenfield BPoS'u destekleyen [Tendermint konsensüs motorudur](https://blog.cosmos.network/tendermint-explained-bringing-bft-based-pos-to-the-public-blockchain-domain-f22e274a0fdb).

### Dosya Greenfield'de kalıcı olarak mı saklanıyor?
Hayır. Şu anda, Greenfield depolama ücretlerini akış biçiminde tahsil etmektedir, bu nedenle bir kullanıcının hesap bakiyesi yetersiz ve borçlu olduğunda, verilerinin kaybolması ve geri alınamaması mümkündür.

Gelecekte Greenfield kalıcı depolamayı destekleyebilir.

### Yükledikten sonra dosyaları güncelleyebilir miyim?
Güncelleme henüz desteklenmiyor, ancak **silme ve yükleme yoluyla gerçekleştirilebilir.**

### Daha önce depoladığım veriler için depolama fiyatı düşerse daha düşük fiyat alabilir miyim?
Elbette, ancak bunun tetiklenmesi için dosya yükleme veya silme gibi ödeme akışını değiştiren bir işlem gereklidir.

### Daha önce depoladığım veriler için depolama fiyatı artarsa daha fazla mı ödemek zorunda kalacağım?
Teorik olarak, evet. Ancak, Greenfield, kullanıcılar üzerindeki etkiyi en aza indirmek için depolama sağlayıcılarının fiyat ayarlama sıklığını ve büyüklüğünü sıkı bir şekilde sınırlayacaktır.

### Depolama sağlayıcım verilerimi kaybederse veya hizmet vermeyi reddederse ne yapabilirim?
Bu durum genellikle yaşanmaz çünkü Greenfield, verilerinizi birden fazla depolama sağlayıcısı arasında güvenli bir şekilde saklamak için yedek hata düzeltme kodlaması kullanır.

Böyle bir senaryo gerçekleşirse, bir **veri kullanılabilirlik meydan okuması** başlatabilirsiniz ve doğrulayıcılar, verilerinizin bütünlüğünü, kullanılabilirliğini ve hizmet kalitesini doğrularken ilgili depolama sağlayıcısını cezalandıracaktır.

Depolama sağlayıcısı verilerinizi tamamen geri yükleyene veya hizmeti sunana kadar ödüller almaya devam edebilirsiniz.

### Değerli verilerimi nasıl dolaşımda tutabilirim?
Verilerinizi ve erişim izinlerinizi BNB Akıllı Zincir ağına yansıtabilir ve verilerinizi çeşitli DApp'ler ve veri ticaret platformları üzerinden ticaret yapabilirsiniz.

### Testnet'e yüklenen veriler ne kadar süreyle saklanabilir?
Testnet test amaçlıdır, bu yüzden kullanıcıların verilerini uzun süre tutmayacaktır. **7 gün sonra kaldırılması beklenmektedir.**

### Greenfield'i zamanında güncelleyemezseniz ne yapmalısınız?
Bu bir hardfork olduğundan, eğer zamanında güncellenmezse `gnfd` ikiliniz çalışmaya devam edemez. `app.toml` dosyasına aşağıdaki satırı ekleyin:
```
# operasyon bnb hedef zinciri için zincir kimliği
`dest-op-chain-id = 204`
```
İkilinizi durdurun, ardından geri alma komutunu çalıştırın:
`gnfd rollback --hard`
Son olarak, ikilinizi yeniden başlatın.

### Greenfield'de dosyaları saklamak ne kadar maliyetli?
Eğer Greenfield'deki depolama ve sorgulama için gerçek zamanlı fiyatlandırmayı öğrenmekle ilgileniyorsanız, [Fiyat Hesaplayıcısına](https://dcellar.io/pricing-calculator) davet ediyoruz.

### Faturam nasıl hesaplanıyor?
Greenfield'de, işlem ücreti dışında, kullanıcıların iki tür depolama hizmet ücreti ödemesi gerekmektedir: `depolama ücreti` ve `indirme kotası ücreti`. Bu depolama hizmet ücretleri, Depolama Sağlayıcıları (SP'ler) tarafından [akış ödeme](https://github.com/bnb-chain/greenfield/blob/master/docs/modules/billing-and-payment.md) şeklinde tahsil edilir. Kullanıcıların hizmeti kullanmaya başladığında belirli bir miktar BNB'yi kilitlemeleri gerekir.

```math
Depolama Ücreti = sum(ChargedSize) * (PrimaryStorePrice + SecondaryStorePrice*SecondarySPNumber) * (1+Validator Tax Rate) * ReserveTime
```

```math
İndirme Kotası Ücreti = ChargedReadQuota * ReadPrice * (1 + Validator Tax Rate) * ReserveTime
```

Şu anda, `ReserveTime` 180 gündür ve `Validator Tax Rate` %1'dir.

### Charged Size nedir?
ChargedSize, nesnenin yük boyutuna göre hesaplanır, eğer yük boyutu 128k'dan azsa, ChargedSize 128k'dır, aksi takdirde ChargedSize yük boyutuna eşit olur.

Eğer Veri Boyutu < 128K ise, ChargedSize = 128K; aksi takdirde, ChargedSize = Veri Boyutu

Eğer nesne boş bir klasörse, ChargedSize = 128K

Değerini [bu API'den](https://greenfield-chain.bnbchain.org/openapi#/Query/StorageParams) sorgulayabilirsiniz.

### Ana/İkincil Depolama Fiyatı nedir?
Her SP, zincir üzerindeki işlemlerle kendi önerilen depolama fiyatını ve okuma fiyatını belirleyebilir. Her ayın ilk blokunda, tüm SP'lerin depolama fiyatlarının medyanı Ana SP Depolama Fiyatı olarak hesaplanır, İkincil SP Depolama Fiyatı, [SecondaryPriceRatio](https://greenfield-chain.bnbchain.org/openapi#/Query/SpParams) (örneğin %12, yönetime tabi) ile Ana SP Depolama Fiyatı çarpılarak hesaplanır ve tüm SP'lerin okuma fiyatlarının medyanı, Ana SP Okuma Fiyatı olarak hesaplanır. Daha fazla bilgi için [bu](https://github.com/bnb-chain/greenfield/blob/master/docs/modules/billing-and-payment.md#storage-fee-price-and-adjustment) kaynağına başvurabilirsiniz.

### Validator Vergi Oranı nedir?
Greenfield'deki her veri ile ilgili işlem için, doğrulayıcılar, verinin güvenliğini ve bütünlüğünü korumak için ödül alabilir (yani meydan okuma). Doğrulayıcı vergisi tahsil edilerek, kullanıcının maliyetinin bir kısmı doğrulayıcı vergi havuzuna gidecek ve ardından doğrulayıcıların ödülleri olacaktır.

Değerini [bu API'den](https://greenfield-chain.bnbchain.org/openapi#/Query/PaymentParams) sorgulayabilirsiniz.

### Okuma Fiyatı nedir?
Bir depolama sağlayıcısı, ücretsiz okuma kotasını ve aylık ücretsiz okuma kotasını güncelleyebilir, önerilen ana depolama fiyatını ve okuma fiyatını değiştirebilir. Tüm SP'lerin önerilen ana depolama ve okuma fiyatları, küresel ana/ikincil depolama fiyatı ve okuma fiyatı oluşturmak için kullanılacaktır.

### Rezerv Süresi nedir?
Depolama ücreti, Greenfield üzerinde akış ödeme tarzında tahsil edilecektir. Ücretler, kullanıcılar ile alıcı hesapları arasında sabit bir hızda bir "Akış" tarzında ödenmektedir. Belirli bir bakiyeyi rezerve ederek, kullanıcılar çok yüksek bir sıklıkta ücret ödemek zorunda kalmazlar. Şu anda, rezerv süresi 6 ay olup yönetime tabi olabilir.

Değerini [bu API'den](https://greenfield-chain.bnbchain.org/openapi#/Query/PaymentParams) sorgulayabilirsiniz.

### Greenfield'de küçük dosyaları saklamanın en iyi uygulaması nedir?
* Verileri birleştirerek daha fazla $BNB tasarruf edin.

Eğer tek bir işlem yalnızca küçük boyutlu bir dosya depoluyorsa, bu, aynı hedefe giden ayrı paketlerin postayla gönderilmesine benziyor. **`Charged Size`'a ulaşmak için tüm dosyaları bir araya getirip tek bir işlemle ağa göndermek önerilmektedir.**

* Silme işlemlerine dikkat edin.
  Şu anda, Greenfield üzerinde ücretlendirilecek rezerv süresi 6 aydır. Bu, silinen öğeler için bile altı aylık bir depolama ücretinin tahsil edileceği anlamına gelir.