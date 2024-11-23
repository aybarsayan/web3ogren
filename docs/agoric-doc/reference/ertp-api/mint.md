# Mint Nesnesi

Sadece bir **Mint**, yeni dijital varlıklar çıkarabilir.

Bir **Mint**, hem bir **** hem de bir **** ile bire bir ilişkiye sahiptir. Dolayısıyla, yalnızca o **Brand**'in yeni varlıklarını çıkarabilir ve o **Brand**'in yeni varlıklarını çıkarabilecek tek **Mint**'tir.

**Mints**, **** fonksiyonu çağrılarak oluşturulur. Bu fonksiyonun kullanımı hakkında detaylı bilgi için **** dokümantasyonuna bakın.

## aMint.getIssuer()

- Döndürür: ****

Bu **Mint** ile benzersiz olarak ilişkilendirilmiş olan **Issuer**'ı döndürür. Bir **Mint** oluşturulduğundan itibaren, belirli bir **Issuer** ile her zaman değiştirilemez bir bire bir ilişkiye sahiptir.

```js
const { issuer: quatloosIssuer, mint: quatloosMint } =
  makeIssuerKit('quatloos');
const quatloosMintIssuer = quatloosMint.getIssuer();

// Returns true
issuer === quatloosMintIssuer;
```

## aMint.mintPayment(newAmount)

- **newAmount**: ****
- Döndürür: ****

**Mint**'in ilişkili ****'inin yeni dijital varlıklarını oluşturur ve döndürür. Oluşturulduğundan itibaren, bir **Mint** her zaman değiştirilemez bir bire bir ilişkiye sahip olduğu bir **Brand** ile ilişkilidir.

```js
const {
  issuer: quatloosIssuer,
  mint: quatloosMint,
  brand: quatloosBrand
} = makeIssuerKit('quatloos');

const quatloos1000 = amountMath.make(quatloosBrand, 1000n);
// newPayment 1000 Quatloos bakiyesine sahip olacak
const newPayment = quatloosMint.mintPayment(quatloos1000);
```

::: tip Önemli
**aMint.mintPayment()** yeni dijital varlıklar oluşturmanın tek yoludur. Başka bir yolu yoktur.
:::