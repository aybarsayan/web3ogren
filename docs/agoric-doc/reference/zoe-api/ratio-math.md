---
title: Oran Matematik Fonksiyonları
---

# Oran Matematik Fonksiyonları

Bu fonksiyonlar, bir miktara bir **** (bir kesir) uygulamanıza imkan tanır; bir miktarı iki doğal sayının oranı ile çarpar veya böler.

Oran matematik fonksiyonlarının içe aktarılması gereklidir.

## assertIsRatio(ratio)

- **ratio**: ****
- Dönüş: Yok.

Geçersiz bir **Oran** argümanı verildiğinde bir hata fırlatır.

Hata mesajları:

- **Oran ${ratio} 2 alandan oluşan bir kayıt olmalıdır.**
- **Parametre bir Oran kaydı olmalıdır, ancak ${ratio} ${q(name)} içeriyor.**

```js
assertIsRatio(aRatio);
```

## makeRatio(numerator, numeratorBrand, denominator?, denominatorBrand?)

- **numerator**: **BigInt**
- **numeratorBrand**: ****
- **denominator**: **BigInt** - İsteğe bağlı, varsayılan 100n.
- **denominatorBrand**: **Marka** - İsteğe bağlı, varsayılan _numeratorBrand_ değeridir.
- Dönüş: ****

Fonksiyona geçilen argümanlara dayanan bir **Oran** döner.

Varsayılan olarak, _denominator_ 100n'dir (yani, **Oran** bir yüzdedir).

```js
// Varsayılan değerleri kullanarak 50 / 100 Quatloos oranı oluştur
const ratio = makeRatio(50n, quatloosBrand);
// Tüm değerleri belirterek 75 Quatloos / 4 Moolas oranı oluştur (geçerli döviz kuru)
const ratio = makeRatio(75n, quatloosBrand, 4n, moolasBrand);
```

## makeRatioFromAmounts(numeratorAmount, denominatorAmount)

- **numeratorAmount**: ****
- **denominatorAmount**: **Miktar**
- Dönüş: ****

Değişmez iki **Miktar**'dan oluşan bir kesiri temsil eden bir **Oran** döner. _numeratorAmount_ **Oran**'ın payı, _denominatorAmount_ ise **Oran**'ın paydasıdır.

```js
const fiftyCents = AmountMath.make(centsBrand, 50n);
const dollar = AmountMath.make(centsBrand, 100n);
const halfADollar = makeRatioFromAmounts(fiftyCents, dollar);
```

## floorMultiplyBy(amount, ratio)

- **amount**: ****
- **ratio**: ****
- Dönüş: **Miktar**

Değişmez bir **Miktar** döner. **** _oran_'ın paydası olan **Marka**'dır. Not: Paydanın **Marka**'sı, _amount_ **Marka**'sı ile aynı olmalıdır.

Sonuç **Miktar**'ı şu şekilde belirlenir:

1. _amount_ değerini _oran_'ın payının değeriyle çarpma.
2. Adım 1'den elde edilen sonucu _oran_'ın paydasının değeriyle bölme.
3. Eğer bu bir tam sayı ise, bu değer döner. Aksi halde değer bir alt tam sayıya yuvarlanır.

Örneğin, eğer _amount_ değeri 47 ve _oran_ 3 / 5 ise, hesaplama şöyle olacaktır:

1. 47 \* 3 = 141
2. 141 / 5 = 28.2
3. Floor(28.2) = 28

Hata mesajlarıyla hatalar fırlatır:

- **Bir miktar bekleniyor: ${amount}**: İlk argüman bir **Miktar** değil.
- **_amount_'ın markası ${q(amount.brand)} oranının paydası ${q(ratio.denominator.brand)} ile eşleşmelidir**: Miktar ve oran paydasının aynı markaya sahip olması gerekir.

```js
const exchangeRatio = makeRatio(3n, swissFrancBrand, 5n, dollarBrand);
const dollars47 = AmountMath.make(dollarBrand, 47n);
// 28 İsviçre frangı miktarını döner
const exchange = floorMultiplyBy(dollars47, exchangeRatio);
```

## ceilMultiplyBy(amount, ratio)

- **amount**: ****
- **ratio**: ****
- Dönüş: **Miktar**

Değişmez bir **Miktar** döner. **** _oran_'ın payının **Marka**'sıdır. Not: Paydanın **Marka**'sı, _amount_ **Marka**'sı ile aynı olmalıdır.

Sonuç **Miktar**'ı şu şekilde belirlenir:

1. _amount_ değerini _oran_'ın payının değeriyle çarpma.
2. Adım 1'den elde edilen sonucu _oran_'ın paydasının değeriyle bölme.
3. Eğer bu bir tam sayı ise, bu değer döner. Aksi halde değer bir üst tam sayıya yuvarlanır.

Örneğin, eğer _amount_ değeri 47 ve _oran_ 3 / 5 ise, hesaplama şöyle olacaktır:

1. 47 \* 3 = 141
2. 141 / 5 = 28.2
3. Ceiling(28.2) = 29

Hata mesajlarıyla hatalar fırlatır:

- **Bir miktar bekleniyor: ${amount}**: İlk argüman bir **Miktar** değil.
- **_amount_'ın markası ${q(amount.brand)} oranının payı ${q(ratio.denominator.brand)} ile eşleşmelidir**: Miktar ve oran paydasının aynı markaya sahip olması gerekir.

```js
const exchangeRatio = makeRatio(3n, swissFrancBrand, 5n, dollarBrand);
const dollars47 = AmountMath.make(dollarBrand, 47n);
// 29 İsviçre frangı miktarını döner
const exchange = ceilMultiplyBy(dollars47, exchangeRatio);
```

## multiplyBy(amount, ratio)

- **amount**: ****
- **ratio**: ****
- Dönüş: **Miktar**

Değişmez bir **Miktar** döner. **** _oran_'ın payının **Marka**'sıdır. Not: Paydanın **Marka**'sı, _amount_ **Marka**'sı ile aynı olmalıdır.

Sonuç **Miktar**'ı şu şekilde belirlenir:

1. _amount_ değerini _oran_'ın payının değeriyle çarpma.
2. Adım 1'den elde edilen sonucu _oran_'ın paydasının değeriyle bölme.
3. Eğer bu bir tam sayı ise, bu değer döner. Aksi halde değer,  göre en yakına yuvarlanır.

Örneğin, eğer _amount_ değeri 47 ve _oran_ 3 / 5 ise, hesaplama şöyle olacaktır:

1. 47 \* 3 = 141
2. 141 / 5 = 28.2
3. BankersRounding(28.2) = 28

Hata mesajlarıyla hatalar fırlatır:

- **Bir miktar bekleniyor: ${amount}**: İlk argüman bir **Miktar** değil.
- **_amount_'ın markası ${q(amount.brand)} oranının payı ${q(ratio.denominator.brand)} ile eşleşmelidir**: Miktar ve oran paydasının aynı markaya sahip olması gerekir.

```js
const exchangeRatio = makeRatio(3n, swissFrancBrand, 5n, dollarBrand);
const dollars47 = AmountMath.make(dollarBrand, 47n);
// 28 İsviçre frangı miktarını döner
const exchange = multiplyBy(dollars47, exchangeRatio);
```

## floorDivideBy(amount, ratio)

- **amount**: ****
- **ratio**: ****
- Dönüş: **Miktar**

Değişmez bir **Miktar** döner. **** _oran_'ın paydasının **Marka**'sıdır.

Sonuç değerinin belirlenmesi şu şekildedir:

1. _amount_ değerini _oran_'ın paydasının değeriyle çarpma.
2. Adım 1'den elde edilen sonucu _oran_'ın payının değeriyle bölme.
3. Eğer bu bir tam sayı ise, bu değer döner. Aksi halde değer bir alt tam sayıya yuvarlanır.

Örneğin, eğer _amount_ değeri 47 ve _oran_ 3 / 5 ise, hesaplama şöyle olacaktır:

1. 47 \* 5 = 235
2. 235 / 3 = 78.33333...
3. Floor(78.3333...) = 78

Hata mesajlarıyla hatalar fırlatır:

- **Bir miktar bekleniyor: ${amount}**: İlk argüman bir **Miktar** değil.
- **_amount_'ın markası ${q(amount.brand)} oranının payı ${q(ratio.numerator.brand)} ile eşleşmelidir**: Miktar ve oran payının aynı markaya sahip olması gerekir.

```js
const exchangeRatio = makeRatio(3n, swissFrancBrand, 5n, dollarBrand);
const dollars47 = AmountMath.make(dollarBrand, 47n);
// 78 dolarlık bir miktar döner
const exchange = floorDivideBy(dollars47, exchangeRatio);
```

## ceilDivideBy(amount, ratio)

- **amount**: ****
- **ratio**: ****
- Dönüş: **Miktar**

Değişmez bir **Miktar** döner. **** _oran_'ın paydasının **Marka**'sıdır.

Sonuç değerinin belirlenmesi şu şekildedir:

1. _amount_ değerini _oran_'ın paydasının değeriyle çarpma.
2. Adım 1'den elde edilen sonucu _oran_'ın payının değeriyle bölme.
3. Eğer bu bir tam sayı ise, bu değer döner. Aksi halde değer bir üst tam sayıya yuvarlanır.

Örneğin, eğer _amount_ değeri 47 ve _oran_ 3 / 5 ise, hesaplama şöyle olacaktır:

1. 47 \* 5 = 235
2. 235 / 3 = 78.33333...
3. Ceiling(78.3333...) = 79

Hata mesajlarıyla hatalar fırlatır:

- **Bir miktar bekleniyor: ${amount}**: İlk argüman bir **Miktar** değil.
- **_amount_'ın markası ${q(amount.brand)} oranının payı ${q(ratio.numerator.brand)} ile eşleşmelidir**: Miktar ve oran payının aynı markaya sahip olması gerekir.

```js
const exchangeRatio = makeRatio(3n, swissFrancBrand, 5n, dollarBrand);
const dollars47 = AmountMath.make(dollarBrand, 47n);
// 79 dolarlık bir miktar döner
const exchange = ceilDivideBy(dollars47, exchangeRatio);
```

## divideBy(amount, ratio)

- **amount**: ****
- **ratio**: ****
- Dönüş: **Miktar**

Değişmez bir **Miktar** döner. **** _oran_'ın paydasının **Marka**'sıdır.

Sonuç değerinin belirlenmesi şu şekildedir:

1. _amount_ değerini _oran_'ın paydasının değeriyle çarpma.
2. Adım 1'den elde edilen sonucu _oran_'ın payının değeriyle bölme.
3. Eğer bu bir tam sayı ise, bu değer döner. Aksi halde değer,  göre en yakına yuvarlanır.

Örneğin, eğer _amount_ değeri 47 ve _oran_ 3 / 5 ise, hesaplama şöyle olacaktır:

1. 47 \* 5 = 235
2. 235 / 3 = 78.33333...
3. BankersRounding(78.3333...) = 78

Hata mesajlarıyla hatalar fırlatır:

- **Bir miktar bekleniyor: ${amount}**: İlk argüman bir **Miktar** değil.
- **_amount_'ın markası ${q(amount.brand)} oranının payı ${q(ratio.numerator.brand)} ile eşleşmelidir**: Miktar ve oran payının aynı markaya sahip olması gerekir.

```js
const exchangeRatio = makeRatio(3n, swissFrancBrand, 5n, dollarBrand);
const dollars47 = AmountMath.make(dollarBrand, 47n);
// 78 dolarlık bir miktar döner
const exchange = divideBy(dollars47, exchangeRatio);
```

## invertRatio(ratio)

- **ratio**: ****
- Dönüş: **Oran**

_Girdi_ oranının payı dönen değerin paydası ve _girdi_ oranının paydası dönen değerin payı olur.

```js
const exchangeRatio = makeRatio(3n, swissFrancBrand, 5n, usDollarBrand);
// 5 ABD Doları / 3 İsviçre Frangı oranı döner
const invertedRatio = invertRatio(exchangeRatio);
```

## addRatios(left, right)

- **left**: ****
- **right**: **Oran**
- Dönüş: **Oran**

_左_ ve _ sağ_ parametrelerinin toplamının olduğu bir **Oran** döner.

_左_ ve _ sağ_ parametrelerinin paylarının ****'ları birbirine eşit olmalıdır. Aynı şekilde, _左_ ve _ sağ_ parametrelerinin paydalarının **Marka**'ları da birbirine eşit olmalıdır. Eğer bu koşullardan biri sağlanmazsa, hiçbir **Oran** döner ve hata fırlatılır.

Eğer _payda_ değerleri eşleşmiyorsa, her iki **Oran** en küçük ortak paydaya çarpılır ve ardından **Oranlar** toplanır.

Örneğin:

1. _left_ = { pay: `44n` kilometre, payda: `3n` saat } ve _right_ = { pay: `25n` kilometre, payda: `2n` saat } varsayalım.
2. _left_ 2/2 ile çarpılır ve _right_ 3/3 ile çarpılır; sonuçta _left_ = { pay: `88n` kilometre, payda: `6n` saat } ve _right_ = { pay: `75n` kilometre, payda: `6n` saat } olur.
3. _left_ ve _right_ toplanır ve { pay: `163n` kilometre, payda: `6n` saat } olarak döner.
   Bu **Oran** döner.

## subtractRatios(left, right)

- **left**: ****
- **right**: **Oran**
- Dönüş: **Oran**

_Hakkında_ parametresinin _sol_ parametresinden çıkarılması ile elde edilen **Oran** döner.

_左_ ve _ sağ_ parametrelerinin paylarının ****'ları birbirine eşit olmalıdır. Aynı şekilde, _左_ ve _ sağ_ parametrelerinin paydalarının **Marka**'ları da birbirine eşit olmalıdır. Eğer bu koşullardan biri sağlanmazsa, hiçbir **Oran** döner ve hata fırlatılır.

Eğer _payda_ değerleri eşleşmiyorsa, her iki **Oran** en küçük ortak paydaya çarpılır ve ardından _ sağ_ değeri _left_'den çıkarılır.

Örneğin:

1. _left_ = { pay: `44n` kilometre, payda: `3n` saat } ve _right_ = { pay: `25n` kilometre, payda: `2n` saat } varsayalım.
2. _left_ 2/2 ile çarpılır ve _right_ 3/3 ile çarpılır; sonuçta _left_ = { pay: `88n` kilometre, payda: `6n` saat } ve _right_ = { pay: `75n` kilometre, payda: `6n` saat } olur.
3. _ sağ_ _sol_'dan çıkarıldığında { pay: `13n` kilometre, payda: `6n` saat } olarak döner.
   Bu **Oran** döner.

## multiplyRatios(left, right)

- **left**: ****
- **right**: **Oran**
- Dönüş: **Oran**

_左_ ve _ sağ_ parametrelerinin çarpımı olan **Oran** döner.

_左_ ve _ sağ_ parametrelerinin paylarının ****'ları birbirine eşit olmalıdır. Aynı şekilde, _左_ ve _ sağ_ parametrelerinin paydalarının **Marka**'ları da birbirine eşit olmalıdır. Eğer bu koşullardan biri sağlanmazsa, hiçbir **Oran** döner ve hata fırlatılır.

## oneMinus(ratio)

- **ratio**: ****
- Dönüş: **Oran**

_Oran_ argümanını 1'den çıkartır ve sonuç olarak elde edilen **Oran**'ı döner.

Bu işlevin _oran_ argümanının 0 ile 1 arasında olması gerekmektedir. Ayrıca pay ve payda ****'larının aynı olması gerekmektedir. Eğer bu koşullardan biri sağlanmazsa, hata fırlatılır ve hiçbir **Oran** döner.

## ratioGTE(left, right)

- **left**: ****
- **right**: **Oran**
- Dönüş: **Boolean**

_Eğer_ **true** dönerse, _left_ _right_'dan büyüktür veya eşittir, aksi takdirde **false** döner.

_左_ ve _ sağ_ parametrelerinin ****'larının birbirine eşit olmaması durumunda hata fırlatılır.

## ratiosSame(left, right)

- **left**: ****
- **right**: **Oran**
- Dönüş: **Boolean**

_Eğer_ sağ ve sol **Oranlar** aynıysa **true** döner, aksi takdirde **false** döner. İki **Oran**'ın aynı sayılması için, bir **Oran**'ın payı ve paydasının **Miktar Değeri** ve **Marka** değerinin, diğer **Oran**'ın payı ve paydasının **Miktar Değeri** ve **Marka** değerleriyle aynı olması gerekir.

## quantize(ratio, newDen)

- **ratio**: ****
- **newDen**: **BigInt**
- Dönüş: **Oran**

_YeniDen_ argümanı ile belirtilen yeni bir paydası olan **Oran** döner.

## parseRatio(numeric, numeratorBrand, denominatorBrand?)

- **numeric**: ****
- **numeratorBrand**: ****
- **denominatorBrand**: **Marka** - İsteğe bağlı, varsayılan _numeratorBrand_.
- Dönüş: ****

_numeric_ argümanından bir **Oran** oluşturur ve bu **Oran**'ı döner.

## assertParsableNumber(specimen)

- **specimen**: **Nesne**
- Dönüş: Yok.

_argüman geçersiz **** olmadığı durumlarda hata fırlatır.