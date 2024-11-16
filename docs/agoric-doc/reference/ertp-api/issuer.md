# İhraççı Nesnesi

Bir **İhraççı**, kendi türünde dijital varlıkları elinde bulunduran yetkili bir otoritedir. **** gibi yeni değer yaratamaz, ancak gerçek değere sahip **** ve **** tanımlayıp tanıyabilir. Boş **Cüzdanlar** oluşturabilir ve **Ödemeleri** dönüştürebilir (bölme, birleştirme, yok etme veya özel talep etme yoluyla).

Bir **İhraççı**, onunla birlikte oluşturulan **Mint** ve **** ile değiştirilemez bir bire-bir ilişkisine sahiptir. **Ödemeleri** kabul edeceğiniz her **Marka** için, güvenilir bir kaynaktan **İhraççı**sını almanız önemlidir. Böylece, bu **İhraççı**yı, o **Marka**ya ait bir **Ödeme**'nin doğrulanması için yetkili otorite olarak kullanabilirsiniz.

**Not**: Bir **İhraççı**yı dağıtım betiğinde oluşturmamalısınız. Dağıtım betikleri geçicidir, bu nedenle burada oluşturulan herhangi bir nesne, betik sona erdiğinde yok olur.

## makeIssuerKit(allegedName, assetKind?, displayInfo?, optShutdownWithFailure?, elementShape?)

- **allegedName**: **String**
- **assetKind**: **** - Opsiyonel, varsayılan değeri **AssetKind.NAT**.
- **displayInfo**: **** - Opsiyonel, varsayılan değeri **undefined**.
- **optShutdownWithFailure** - Opsiyonel, varsayılan değeri **undefined**.
- **elementShape** - Opsiyonel, varsayılan değeri **undefined**.
- **IssuerKit** döndürür. Bu, üç özellik içeren bir nesnedir:
  - **issuer**: **İhraççı**
  - **mint**: ****
  - **brand**: ****

Yeni bir **İhraççı** ve ilgili **Mint** ve **Marka** oluşturur ve döndürür. Üçü de birbirleriyle değiştirilemez bire-bir ilişkisi içinde bulunmaktadır.

_allegedName_, varlık tanımlarında **Marka**nın bir parçası haline gelir. Bu **String** olmak zorunda değildir, ancak yalnızca değeri için kullanılacaktır. Hata ayıklama ve varsayımları iki kez kontrol etmek için yararlıdır, ancak güvenilmemelidir.

İsteğe bağlı _assetKind_ parametresi, oluşturulacak **İhraççı** ile ilişkili varlık türünü belirtir. Eğer metoda hiç **AssetKind** argümanı verilmezse, **İhraççı**'nın varlık türü varsayılan olarak **AssetKind.NAT** olur. **** yöntemleri tüm varlık türleriyle çalışır, ancak ne tür matematik veya işlem uygulanacağında, **AssetKind** değişkenlik gösterir.

İsteğe bağlı _displayInfo_ parametresi, arayüze bu **Marka**nın ****'larını nasıl görüntüleyeceğini söyler.

İsteğe bağlı _optShutdownWithFailure_ parametresi, kritik öneme sahip **İhraççılar** için kullanılmalıdır. Bu parametre, **İhraççı**'nın invariatları ihlal edilirse, **İhraççı**'yı barındıran vatı durduracak bir işlevdir.

İsteğe bağlı _elementShape_ parametresi, onunla ilişkili bir değiştirilemez varlık oluşturan **İhraççı** oluşturulurken yalnızca kullanılır. Kullanıldığında, _elementShape_ parametresi, varlığı tanımlamak için gereken kadar özelliği içeren bir nesnedir. Bu nesne, varlığın ****'inin _valueShape_ özelliklerini belirler.

```js
import { AssetKind, makeIssuerKit } from '@agoric/ertp';
makeIssuerKit('quatloos'); // Varsayılan olarak AssetKind.NAT
makeIssuerKit('title', AssetKind.COPY_SET);
```

```js
const {
  issuer: quatloosIssuer,
  mint: quatloosMint,
  brand: quatloosBrand
} = makeIssuerKit('quatloos');
// Bu sadece bir miktardır, varlıkları tanımlar, varlıkları basmaz
const quatloos2 = AmountMath.make(quatloosBrand, 2n);

const {
  issuer: titleIssuer,
  mint: titleMint,
  brand: titleBrand
} = makeIssuerKit('propertyTitle');
// Bunlar sadece dijital varlıkları tanımlayan miktarlardır, varlıkları basmaz.
const cornerProperty = AmountMath.make(propertyTitleBrand, ['1292826']);
const adjacentProperty = AmountMath.make(propertyTitleBrand, ['1028393']);
const combinedProperty = AmountMath.make(propertyTitleBrand, [
  '1292826',
  '1028393'
]);
```

## anIssuer.getAllegedName()

- Döndürür: **allegedName**

**İhraççı** için **allegedName**'i döndürür.

Bir alleged name, bir tür dijital varlığın insan tarafından okunabilir isimidir. Bir alleged name, doğru olarak güvenilir olmamalıdır çünkü kamuya açık bir kayıt veya benzersizlik beklentisi yoktur. Bu, aynı alleged name'e sahip birden fazla **İhraççı**, **** veya **** olabileceği anlamına gelir ve bu nedenle isim, tek başına bir **İhraççı**'yı benzersiz şekilde tanımlamaz. Bunun yerine, bu işlevi **Marka** üstlenir.

Başka bir deyişle, kimsenin _Quatloos_ (veya _BTC_, veya başka bir şey) adlı bir **İhraççı** oluşturmasını engelleyen hiçbir şey yoktur; bu ismin zaten kullanılıp kullanılmadığına bakılmaksızın. Alleged name, hata ayıklama için faydalı olan bir insan tarafından okunabilir string'dir.

```js
const { issuer: quatloosIssuer } = makeIssuerKit('quatloos');
const quatloosIssuerAllegedName = quatloosIssuer.getAllegedName();
// quatloosIssuerAllegedName === 'quatloos'
```

## anIssuer.getAssetKind()

- Döndürür: ****

**İhraççı**'nın varlık türünü döndürür.

**AssetKind**, bu **İhraççı** için **** içinde kullanılan değer türlerini belirtir.

```js
const { issuer: quatloosIssuer } = makeIssuerKit('quatloos');
quatloosIssuer.getAssetKind(); // 'nat' döndürür, diğer adıyla AssetKind.NAT, varsayılan değer.
const { issuer: moolaIssuer } = makeIssuerKit('moola', AssetKind.COPY_SET);
moolaIssuer.getAssetKind(); // 'copy_set' döndürür, diğer adıyla 'AssetKind.COPY_SET'
```

## anIssuer.getAmountOf(payment)

- **payment**: ****
- Döndürür: ****

**Payment**'in bakiyesini **Amount** olarak tanımlar. Güvenilmeyen bir kaynaktan gelen bir **Payment** kendi gerçek değerini sağlama yetisine güvenilemez, bu nedenle **İhraççı**'nın ****'sını doğrulamak ve döndürülen **Amount**'un ne kadar içerdiğini raporlamak için kullanılması gerekir.

```js
const {
  issuer: quatloosIssuer,
  mint: quatloosMint,
  brand: quatloosBrand
} = makeIssuerKit('quatloos');
const quatloosPayment = quatloosMint.mintPayment(
  AmountMath.make(quatloosBrand, 100n)
);
quatloosIssuer.getAmountOf(quatloosPayment); // 100 Quatloos miktarını döndürür
```

## anIssuer.getBrand()

- Döndürür: ****

**İhraççı** için **Marka**yı döndürür. **Marka**, dijital varlığın türünü belirtir ve **İhraççı**'nın ilişkili ****, ve bu türden herhangi bir **** ve **** ile aynıdır. **Marka**, sıkı tutulmayan bir varlıktır, bu nedenle bu yöntem tek başına bir **İhraççı**'yı tanımlamak için güvenilmemelidir. Sahte dijital varlıklar ve miktarlar başka bir **İhraççı**'nın **Marka**sını kullanabilir.

```js
const { issuer: quatloosIssuer, brand: quatloosBrand } =
  makeIssuerKit('quatloos');
const quatloosBrand = quatloosIssuer.getBrand();
// brand === quatloosBrand
```

## anIssuer.makeEmptyPurse()

- Döndürür: ****

**İhraççı** ile ilişkili **** varlıklarını tutan boş bir **Cüzdan** oluşturur ve döndürür.

```js
const { issuer: quatloosIssuer } = makeIssuerKit('quatloos');
const quatloosPurse = quatloosIssuer.makeEmptyPurse();
```

## **anIssuer.burn(payment, optAmount?)**

- **payment**: ****
- **optAmount**: **** - Opsiyonel.

- Döndürür: **Amount**

**Ödeme**'deki tüm dijital varlıkları yok eder, bu da daha sonra kullanım için kullanılamaz hale getirir ve neyin yakıldığını belirten bir **Amount** döngerir.

Eğer bir _optAmount_ argümanı verildiyse, _payment_'in bakiyesi _optAmount_ ile eşit olmalıdır, aksi takdirde yanlış **Ödeme** talep edilmesini engellemek için. Eğer _optAmount_, orijinal **Ödeme**'nin bakiyesi ile eşit değilse, bir hata oluşur ve orijinal **Ödeme** değiştirilmeden kalır.

Eğer _payment_ bir promise ise, işlem; **Ödeme**'ye çözüldükten sonra devam eder.

```js
const {
  issuer: quatloosIssuer,
  mint: quatloosMint,
  brand: quatloosBrand
} = makeIssuerKit('quatloos');
const amountToBurn = AmountMath.make(quatloosBrand, 10n);
const paymentToBurn = quatloosMint.mintPayment(amountToBurn);

// burntAmount 10 Quatloos olmalıdır
const burntAmount = quatloosIssuer.burn(paymentToBurn, amountToBurn);
```

## anIssuer.isLive(payment)

- **payment**: ****
- Döndürür: **Boolean**

_eğer_ **payment** **İhraççı** tarafından oluşturulmuşsa ve kullanılabilir durumdaysa (yani, henüz tüketilmemişse) **true** döndürür.

Eğer _payment_ bir promise ise, işlem; çözüldükten sonra **Payment** döndürülecektir.

::: uyarı KULLANIMDIŞI

## anIssuer.claim(payment, optAmount?)

- **payment**: ****
- **optAmount**: **** - Opsiyonel.
- Döndürür: **Payment**

Tüm dijital varlıkları _payment_'den yeni bir **Payment**'e transfer eder ve orijinal **Payment**'i tüketir; bu da daha sonra kullanım için kullanılamaz hale getirir.

Eğer _optAmount_ argümanı verildiyse, _payment_'in bakiyesi _optAmount_ ile eşit olmalıdır; aksi takdirde yanlış **Ödeme** talep edilmesini önlemek için. Eğer _optAmount_, orijinal **Ödeme**'nin bakiyesi ile eşit değilse, bir hata oluşur ve orijinal **Ödeme** değiştirilmeden kalır.

Eğer _payment_ bir promise ise, işlem; çözüldükten sonra **Payment**'e devam eder.

```js
const {
  issuer: quatloosIssuer,
  mint: quatloosMint,
  brand: quatloosBrand
} = makeIssuerKit('quatloos');
const amountExpectedToTransfer = AmountMath.make(quatloosBrand, 2n);
const originalPayment = quatloosMint.mintPayment(amountExpectedToTransfer);

const newPayment = quatloosIssuer.claim(originalPayment, amountToTransfer);
```

## anIssuer.combine(paymentsArray, optTotalAmount?)

- **paymentsArray**: **Array&lt;>**
- **optTotalAmount**: **** - Opsiyonel.
- Döndürür: **Payment**

Birden fazla **Ödeme**'yi yeni bir **Ödeme** haline getirir. Eğer _paymentsArray_ içerisindeki herhangi bir öğe bir promise ise, işlem; her bir promise **Ödeme**'ye çözüldükten sonra devam eder. **Ödemelerin** tamamı _paymentsArray_ içerisine tüketilir ve daha sonra kullanım için kullanılamaz hale gelir.

Eğer _optTotalAmount_ argümanı metoda verilirse, _paymentsArray_ içindeki tüm **Ödemelerin** toplam değeri _optTotalAmount_ ile eşit olmalıdır. Eğer eşit olmazsa, işlem bir hata fırlatır ve orijinal **Ödeme** değiştirilmeksizin kalır.

_paymentsArray_'deki her bir **Ödeme**, **İhraççı** ile aynı **** ile ilişkili olmak zorundadır.

```js
const {
  issuer: quatloosIssuer,
  mint: quatloosMint,
  brand: quatloosBrand
} = makeIssuerKit('quatloos');
// Her biri 1 quatloo olan 100 ödemenin bir dizisini oluştur
const payments = [];
for (let i = 0; i **

Tek bir **Ödeme**'yi iki yeni **Ödeme**'ye, A ve B, _paymentAmountA_'ya göre böler. Örneğin, eğer **Ödeme** 10 _Quatloos_ içinse ve _paymentAmountA_ 3 _Quatloos_ ise, bu yöntem 3 _Quatloos_ ve 7 _Quatloos_ bakiyelerine sahip iki **Ödeme** döndürür.

Orijinal **Ödeme** tüketilir ve daha sonra kullanım için kullanılamaz hale gelir.

Eğer _payment_ bir promise ise, işlem; çözüldükten sonra **Payment**'e devam eder.

_payment_ ve _paymentAmountA_ her ikisi de **İhraççı** ile aynı **** ile ilişkili olmalıdır.

```js
const {
  issuer: quatloosIssuer,
  mint: quatloosMint,
  brand: quatloosBrand
} = makeIssuerKit('quatloos');
const oldPayment = quatloosMint.mintPayment(
  AmountMath.make(quatloosBrand, 20n)
);
// Bölme sonrası paymentA 5 quatloos alır, paymentB ise 15 alır.
const [paymentA, paymentB] = quatloosIssuer.split(
  oldPayment,
  AmountMath.make(quatloosBrand, 5n)
);
```

## anIssuer.splitMany(payment, amountArray)

- **payment**: ****
- **amountArray**: **Array&lt;>**
- Döndürür: **Array&lt;Payment>**

Tek bir **Ödeme**'yi birden fazla **Ödeme**'ye böler. Döndürülen dizi, _amountArray_ parametresindeki her bir **Amount** için bir **Ödeme** öğesi içerir, sıralı olarak.

Orijinal **Ödeme** tüketilir ve daha sonra kullanım için kullanılamaz hale gelir.

Eğer _payment_ bir promise ise, işlem; çözüldükten sonra **Payment**'e devam eder.

_eğer _amountArray_ içerisindeki **Miktarlar** _payment_ değerine eşit değilse, işlem başarısız olur. _payment_ ve _amountArray_'deki her **Amount**, **İhraççı** ile aynı **** ile ilişkili olmalıdır.

```js
const {
  issuer: quatloosIssuer,
  mint: quatloosMint,
  brand: quatloosBrand
} = makeIssuerKit('quatloos');
const oldPayment = quatloosMint.mintPayment(
  AmountMath.make(quatloosBrand, 100n)
);
const goodAmounts = Array(10).fill(AmountMath.make(quatloosBrand, 10n));

const arrayOfNewPayments = quatloosIssuer.splitMany(oldPayment, goodAmounts);

// amountArray'daki toplam miktar, orijinal ödeme miktarına eşit olmalıdır
// Orijinal miktarı 1000n olarak ayarlayın
const payment = quatloosMint.mintPayment(AmountMath.make(quatloosBrand, 1000n));

// badAmounts'daki toplam miktarlar 20n'dir, oysa bu 1000n olmalıdır
const badAmounts = Array(2).fill(AmountMath.make(quatloosBrand, 10n));

// 20n, 1000n'e eşit olmadığı için hata fırlatacak
quatloosIssuer.splitMany(payment, badAmounts);
```

:::
