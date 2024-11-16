# AmountMath Nesnesi

**** ile çalışmak ve analiz etmek için bir kütüphane.

## AmountMath Kullanımı ve İçe Aktarma

**AmountMath**'i ERTP'den içe aktarmak için:

- `import { AmountMath } from '@agoric/ertp';`

## Brand Parametreleri

Birçok **AmountMath** yönteminin isteğe bağlı bir **** parametresi bulunduğunu unutmayın. Bu yöntemler için, ihtiyacınız olduğunda **** parametresi içindeki **Brand** üzerinde "mutlak" bir kontrol yapmak için aldığınız bir **Brand** argümanını geçmelisiniz. Bu durumda, **Issuer**'dan (ya da Zoe'den) aldığınız **Brand**'i, **Amount** **Brand**(leri) ile karşılaştırmak için isteğe bağlı parametre olarak kullanmalısınız. Eğer eşit değillerse, bir hata oluşur ve değişiklik yapılmaz.

## AmountMath.make(brand, allegedValue)

- **brand**: ****
- **allegedValue**: ****
- Döndürür: ****

Verilen bir **Brand** ve **AmountValue** ile bir **Amount** oluşturur.

```js
const bid = AmountMath.make(quatloosBrand, 300n);
```

## AmountMath.coerce(brand, allegedAmount)

- **brand**: ****
- **allegedAmount**: ****
- Döndürür: **Amount**

Belirtilen _brand_ için bir **Amount**'ın geçerliliğini kontrol eder ve eşdeğer bir **Amount** döndürür. Eğer **Amount** belirtilen **Brand** için değilse, bir hata fırlatılır.

```js
const verifiedAmount = AmountMath.coerce(quatloosBrand, bid);
```

## AmountMath.getValue(brand, amount)

- **brand**: ****
- **amount**: ****
- Döndürür: ****

Verilen **Amount**'dan **AmountValue** döndürür.

```js
const quatloos123 = AmountMath.make(quatloosBrand, 123n);

// 123n döndürür
AmountMath.getValue(quatloosBrand, quatloos123);
```

## AmountMath.makeEmpty(brand, assetKind)

- **brand**: ****
- **assetKind**: ****
- Döndürür: ****

_**brand**_ parametresinin **Brand**'i için boş bir **Amount**'ı temsil eden **Amount**'ı döndürür. Bu, **AmountMath.add()** ve **AmountMath.subtract()** için kimlik elemanıdır. Boş **AmountValue**, _assetKind_ türüne bağlıdır: **AssetKind.NAT** (`0n`), **AssetKind.COPY_SET** (`[]`) veya **AssetKind.COPY_BAG** (`[]`).

```js
// 0n değeri ile bir miktar döndürür
const empty = AmountMath.makeEmpty(quatloosBrand, AssetKind.NAT);
```

## AmountMath.makeEmptyFromAmount(amount)

- **amount**: ****
- Döndürür: **Amount**

_**amount**_ parametresinin **Brand**'i için boş bir **Amount** döndürür.

```js
// bid = { brand: quatloosBrand, value: 300n }
const bid = AmountMath.make(quatloosBrand, 300n);
// { brand: quatloosBrand, value: 0n } döndürür
const zeroQuatloos = AmountMath.makeEmptyFromAmount(bid);
```

## AmountMath.isEmpty(amount, brand?)

- **amount**: ****
- **brand**: **** - İsteğe bağlı, varsayılan değeri **undefined**.
- Döndürür: **Boolean**

**Amount**'ın boş olması durumunda **true** döndürür. Aksi takdirde **false** döner.

Eğer isteğe bağlı _brand_ argümanı **Amount**'ın **Brand**'i ile eşleşmiyorsa, bir hata fırlatılır.

```js
const empty = AmountMath.makeEmpty(quatloosBrand, AssetKind.NAT);
const quatloos1 = AmountMath.make(quatloosBrand, 1n);

// true döndürür
const result = AmountMath.isEmpty(empty);

// false döndürür
const result = AmountMath.isEmpty(quatloos1);
```

## AmountMath.isGTE(leftAmount, rightAmount, brand?)

- **leftAmount**: ****
- **rightAmount**: **Amount**
- **brand**: **** - İsteğe bağlı, varsayılan değeri **undefined**.
- Döndürür: **Boolean**

_eAmountValue_ 'nın leftAmount_ **AmountValue**'sinin, _rightAmount_ **AmountValue**'sinden büyük veya ona eşit olması durumunda **true** döndürür. Her iki **Amount** argümanı da aynı **Brand**'e sahip olmalıdır.

Eğer isteğe bağlı _brand_ argümanı **Amount**'ların **Brand**'i ile eşleşmiyorsa, bir hata fırlatılır.

Fungible olmayan **AmountValues** için "büyük veya eşit" olması durumu, **AmountMath** türüne bağlıdır. Örneğin, { 'seat 1', 'seat 2' } { 'seat 2' }'den büyük olarak kabul edilir çünkü ilki ikincisinin katı bir üst kümesidir.

```js
const empty = AmountMath.makeEmpty(quatloosBrand, AssetKind.NAT);
const quatloos5 = AmountMath.make(quatloosBrand, 5n);
const quatloos10 = AmountMath.make(quatloosBrand, 10n);

// true döndürür
AmountMath.isGTE(quatloos5, empty);
// false döndürür
AmountMath.isGTE(empty, quatloos5, quatloosBrand);
// true döndürür
AmountMath.isGTE(quatloos10, quatloos5);
// false döndürür
AmountMath.isGTE(quatloos5, quatloos10);
// true döndürür
AmountMath.isGTE(quatloos5, quatloos5);
```

## AmountMath.isEqual(leftAmount, rightAmount, brand?)

- **leftAmount**: ****
- **rightAmount**: **Amount**
- **brand**: **** - İsteğe bağlı, varsayılan değeri **undefined**.
- Döndürür: **Boolean**

_leftAmount_ **AmountValue**'sinin, _rightAmount_ **AmountValue**'sine eşit olması durumunda **true** döndürür. Her iki **Amount** argümanı da aynı **Brand**'e sahip olmalıdır.

Eğer isteğe bağlı _brand_ argümanı **Amount**'ların **Brand**'i ile eşleşmiyorsa, bir hata fırlatılır.

Fungible olmayan **AmountValues** için "eşit" olmak, **Brand**'in **** değerine bağlıdır.

Örneğin, { 'seat 1', 'seat 2' } { 'seat 2' }'den farklı olarak kabul edilir, çünkü eleman sayısı farklıdır. { 'seat 1' } { 'seat 2' }'ye eşit olarak kabul edilmez çünkü elemanlar uyuşmuyor.

```js
const empty = AmountMath.makeEmpty(quatloosBrand, AssetKind.NAT);
const quatloos5 = AmountMath.make(quatloosBrand, 5n);
const quatloos5b = AmountMath.make(quatloosBrand, 5n);
const quatloos10 = AmountMath.make(quatloosBrand, 10n);

// true döndürür
AmountMath.isEqual(quatloos10, quatloos10);
// true döndürür
AmountMath.isEqual(quatloos5, quatloos5b);
// false döndürür
AmountMath.isEqual(quatloos10, quatloos5);
// false döndürür
AmountMath.isEqual(empty, quatloos10);
```

## AmountMath.add(leftAmount, rightAmount, brand?)

- **leftAmount**: ****
- **rightAmount**: **Amount**
- **brand**: **** - İsteğe bağlı, varsayılan değeri **undefined**.
- Döndürür: **Amount**

_new **Amount**_ döndürür, bu _leftAmount_ ve _rightAmount_ 'ın birleşimidir. Her iki **Amount** argümanı da aynı **Brand**'e sahip olmalıdır.

Eğer isteğe bağlı _brand_ argümanı **Amount**'ların **Brand**'i ile eşleşmiyorsa, bir hata fırlatılır.

Fungible **Amounts** için bu, ****'lerini eklemektir. Fungible olmayan **Amounts** için bu genellikle _leftAmount_ ve _rightAmount_'dan tüm elemanları dahil etmek anlamına gelir.

Eğer _leftAmount_ veya _rightAmount_ 'dan biri boşsa, bu yöntem diğerine eşdeğer bir **Amount** döndürür. Eğer her ikisi de boşsa, bu yöntem boş bir **Amount** döndürür.

```js
import { AssetKind, makeIssuerKit, AmountMath } from '@agoric/ertp';
const { brand: myItemsBrand } = makeIssuerKit('myItems', AssetKind.COPY_SET);
const listAmountA = AmountMath.make(myItemsBrand, ['1', '2', '4']);
const listAmountB = AmountMath.make(myItemsBrand, ['3']);

// ['1', '2', '4', '3'] değerine sahip bir miktar döndürür
const combinedList = AmountMath.add(listAmountA, listAmountB);
```

## AmountMath.subtract(leftAmount, rightAmount, brand?)

- **leftAmount**: ****
- **rightAmount**: **Amount**
- **brand**: **** - İsteğe bağlı, varsayılan değeri **undefined**.
- Döndürür: **Amount**

_new **Amount**_ döndürür ki bu, _leftAmount_ eksi _rightAmount_ 'dır (yani, _leftAmount_ içindeki her şey _rightAmount_ içinde değilse). Eğer _leftAmount_ _rightAmount_ 'ı içermiyorsa (örneğin çıkarma negatif bir sonuç veriyorsa), bir hata fırlatılır. Çünkü _leftAmount_ _rightAmount_ 'ı içermelidir, bu set çıkarımına **eşit değildir**.

Her iki **Amount** argümanı da aynı **Brand**'e sahip olmalıdır.

Eğer isteğe bağlı _brand_ argümanı **Amount**'ların **Brand**'i ile eşleşmiyorsa, bir hata fırlatılır.

Eğer _rightAmount_ boşsa, bu yöntem _leftAmount_ döndürür. Eğer her iki argüman da boşsa, bu yöntem boş bir **Amount** döndürür.

```js
import { AssetKind, makeIssuerKit, AmountMath } from '@agoric/ertp';
const { brand: myItemsBrand } = makeIssuerKit('myItems', AssetKind.COPY_SET);
const listAmountA = AmountMath.make(myItemsBrand, ['1', '2', '4']);
const listAmountB = AmountMath.make(myItemsBrand, ['3']);
const listAmountC = AmountMath.make(myItemsBrand, ['2']);

// ['1', '4'] döndürür
const subtractedList = AmountMath.subtract(listAmountA, listAmountC);

// Bir hata fırlatır
const badList = AmountMath.subtract(listAmountA, listAmountB);
```

## AmountMath.min(x, y, brand?)

- **x**: ****
- **y**: **Amount**
- **brand**: **** - İsteğe bağlı, varsayılan değeri **undefined**.
- Döndürür: **Amount**

_x_ ve _y_ arasında minimum değeri döndürür.

Her iki **Amount** argümanı da aynı **Brand**'e sahip olmalıdır.

Eğer isteğe bağlı _brand_ argümanı **Amount**'ların **Brand**'i ile eşleşmiyorsa, bir hata fırlatılır.

```js
const smallerAmount = AmountMath.make(quatloosBrand, 5n);
const largerAmount = AmountMath.make(quatloosBrand, 10n);

// smallerAmount'a eşdeğer bir miktar döndürür
const comparisonResult = AmountMath.min(smallerAmount, largerAmount);
```

## AmountMath.max(x, y, brand?)

- **x**: ****
- **y**: **Amount**
- **brand**: **** - İsteğe bağlı, varsayılan değeri **undefined**.
- Döndürür: **Amount**

_x_ ve _y_ arasında maksimum değeri döndürür.

Her iki **Amount** argümanı da aynı **Brand**'e sahip olmalıdır.

Eğer isteğe bağlı _brand_ argümanı **Amount**'ların **Brand**'i ile eşleşmiyorsa, bir hata fırlatılır.

```js
const smallerAmount = AmountMath.make(quatloosBrand, 5n);
const largerAmount = AmountMath.make(quatloosBrand, 10n);

// largerAmount'a eşdeğer bir miktar döndürür
const comparisonResult = AmountMath.max(smallerAmount, largerAmount);
```

## İlgili Yöntemler

Diğer ERTP bileşenleri ve nesneleri üzerindeki aşağıdaki yöntemler de ya bir **Amount** veya **AssetKind** üzerinde çalışmakta ya da onları döndürmektedir.

- 
  - Bir **Payment**'ın **Amount**'ını döndürür.
- 
  - **Issuer**'ın ilişkilendirilmiş matematik yardımcılarının **AssetKind**'ını döndürür.
- 
  - Bir **Brand** ile ilişkilendirilmiş **AssetKind**'ı döndürür.