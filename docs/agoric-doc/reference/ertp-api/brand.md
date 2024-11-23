---
title: Marka Objesi
---

# Marka Objesi

**Marka**, **** ve **** ile ilişkili varlık türünü tanımlar. Belirli bir **Marka**, bir **Issuer** ve bir **Mint** ile birebir ilişkiye sahiptir ve **** ile **** ile birden çok ilişkiye sahiptir.

Örneğin, _Quatloos_ kullanan bir **Marka** yaratmayı düşünürseniz:

- Tam olarak bir _Quatloos_ **Issuer** olacaktır.
- Tam olarak bir _Quatloos_ **Mint** olacaktır.
- _Quatloos_ tutan her türlü **Purse** olabilir.
- _Quatloos_ tutan her türlü **Payment** olabilir.

Tüm bu ilişkiler değiştirilemez. Örneğin, yeni _Quatloos_ üreten bir **Mint** oluşturulursa, bu asla non-_Quatloos_ varlıklar yaratamaz. Benzer şekilde, _Quatloos_ **Markası** her zaman _Quatloos_ **Mint** ve _Quatloos_ **Issuer** ile ilişkili olacaktır.

## aBrand.isMyIssuer(allegedIssuer)

- **allegedIssuer**: ****
- Returns: **Boolean**

_allegedIssuer_ **Marka**'nın **Issuer**'ı ise **true**, değilse **false** döner.

Unutmayın ki, güvenilmeyen bir kaynaktan gelen bir **Marka**, **Issuer** ile olan ilişkisini yanlış temsil edebilir. İddia, karşılıklı anlaşma için **Issuer**'ın **** metodu kullanılarak doğrulanmalıdır.

```js
const isIssuer = brand.isMyIssuer(issuer);
```

## aBrand.getAllegedName()

- Returns: **String**

**Marka**'nın iddia edilen adını döner.

İddia edilen ad, dijital bir varlık türünün insan tarafından okunabilir bir string adıdır. Bu ad güvenilir bir şekilde doğru olarak kabul edilmemelidir çünkü kamuya açık bir kayıt veya eşsizlik beklentisi yoktur. Bu, aynı iddia edilen adla birden fazla ****, **** veya **Marka** olabileceği anlamına gelir ve bu nedenle ad tek başına bir **Issuer**'ı benzersiz olarak tanımlamaz. Bunun yerine, **Marka** nesnesi bunu yapar.

Başka bir deyişle, farklı kişilerin iddia edilen adla birden fazla **Issuer** oluşturmasını engelleyen hiçbir şey yoktur - _Quatloos_ adını kullanan birçok **Issuer** olabilir, ancak bunların hiçbiri _Quatloos_ **Issuer**'ı değildir. İddia edilen ad, hata ayıklama için yararlı olan yalnızca insan tarafından okunabilir bir stringdir.

```js
const name = brand.getAllegedName();
```

## aBrand.getDisplayInfo()

- Returns: ****

**Marka** ile ilişkili **DisplayInfo**'yu döner.

Bir **DisplayInfo** nesnesini dapp ve UI seviyelerinde **** doğru bir şekilde görüntülemek için kullanırsınız. Fungible token'lar için, en küçük mali muhasebe birimi (örneğin, cent yerine dolar olarak görüntüleme) yerine, bunların değerini yaygın olarak kullanılan biriminde görüntülemek için **decimalPlaces** özelliğini kullanın.

```js
const quatloosDisplay = quatloosBrand.getDisplayInfo();
```

## aBrand.getAmountShape()

- Returns: ****

Benzersiz bir varlıkla ilişkili bir **Marka** için **AmountShape**'ı döner.

## İlgili Yöntemler

Diğer ERTP bileşenlerinde bulunan aşağıdaki yöntemler de **Marka** objesiyle ilişkilidir.

- : **Issuer** için **Marka**'yı döner.
- : **Payment**'in iddia edilen **Marka**'sını döner.