---
title: PriceAuthority Nesnesi
---

# PriceAuthority Nesnesi

**PriceAuthority** oracle'larına dayanıyoruz. **PriceAuthority**, fiyatlar için güvenilir alıntılar sağlar. Bu alıntılar, ekosistem genelinde fiyatların geniş anketlerine dayanabilir veya doğrudan bir AMM (Otomatik Piyasa Yapıcı) tarafından sağlanabilir. **PriceAuthority**, bildiği herhangi bir para birimi çifti için mevcut fiyatı gösteren bir alıntı verebilir veya bir koşul doğru olduğunda çözülen bir **Promise** dönebilir. Örneğin, bir fiyatın belli bir eşiği aşması veya belirli bir zamanda. Ayrıca, her fiyat değişiminde güncellenen bir fiyat akışı sağlayabilir.

## E(PriceAuthority).getQuoteIssuer(brandIn, brandOut)

- **brandIn**: ****
- **brandOut**: **Brand**
- Return: ** | Promise&lt;Issuer>**

Verilen _brandIn_/_brandOut_ çifti için ERTP **Issuer**'ını alır.

```js
const quoteIssuer = await E(PriceAuthority).getQuoteIssuer(
  collateralKit.brand,
  loanKit.brand
);
```

## E(PriceAuthority).getTimerService(brandIn, brandOut)

- **brandIn**: ****
- **brandOut**: **Brand**
- Return: **TimerService | Promise&lt;TimerService>**

Verilen _brandIn_/_brandOut_ çifti için **** içinde kullanılan zamanlayıcıyı alır.

```js
const myTimer = E(PriceAuthority).getTimerService(
  collateral.brand,
  loanKit.brand
);
```

## E(PriceAuthority).makeQuoteNotifier(amountIn, brandOut)

- **amountIn**: ****
- **brandOut**: ****
- Return: **ERef&lt;Notifier&lt;>>**

Verilen _amountIn_ için en son **PriceQuotes** bildirimini almanızı sağlar. Abone olduğunuz oran **PriceAuthorities** arasında çok farklı olabilir.

```js
const myNotifier = E(PriceAuthority).makeQuoteNotifier(quatloos100, usdBrand);
```

## E(PriceAuthority).quoteGiven(amountIn, brandOut)

- **amountIn**: ****
- **brandOut**: ****
- Return: **Promise&lt;>**

_Talep üzerine_ _amountIn_ için bir alıntı alır.

```js
const quote = await E(PriceAuthority).quoteGiven(moola500, quatloosBrand);
```

## E(PriceAuthority).quoteWanted(brandIn, amountOut)

- **brandIn**: ****
- **amountOut**: ****
- Return: **Promise&lt;>**

_Talep üzerine_ _amountOut_ için bir alıntı alır.

```js
const quote = await E(PriceAuthority).quoteWanted(quatloosBrand, moola500);
```

## E(PriceAuthority).quoteAtTime(deadline, amountIn, brandOut)

- **deadline**: **Timestamp**
- **amountIn**: ****
- **brandOut**: ****
- Return: **Promise&lt;>**

_Deadline_ geçtiğinde **PriceAuthority**’nin **timerService**'i ile _amountIn_ için **PriceQuote**'u döner. Not: _deadline_'ın değeri bir **BigInt** olmalıdır.

```js
const priceQuoteOnThisAtTime = E(PriceAuthority).quoteAtTime(
  7n,
  quatloosAmount34,
  usdBrand
);
```

## E(PriceAuthority).quoteWhenGT(amountIn, amountOutLimit)

- **amountIn**: ****
- **amountOutLimit**: **Amount**
- Return: **Promise&lt;>**

_AmountIn_ için bir **PriceQuote** _amountOutLimit_ değerini aştığında çözülür.

```js
const quote = E(PriceAuthority).quoteWhenGT(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

## E(PriceAuthority).quoteWhenGTE(amountIn, amountOutLimit)

- **amountIn**: ****
- **amountOutLimit**: **Amount**
- Return: **Promise&lt;>**

_AmountIn_ için bir **PriceQuote** _amountOutLimit_ değerine ulaştığında veya aştığında çözülür.

```js
const quote = E(PriceAuthority).quoteWhenGTE(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

## E(PriceAuthority).quoteWhenLT(amountIn, amountOutLimit)

- **amountIn**: ****
- **amountOutLimit**: **Amount**
- Return: **Promise&lt;>**

_AmountIn_ için bir **PriceQuote** _amountOutLimit_ değerinin altına düştüğünde çözülür.

```js
const quote = E(PriceAuthority).quoteWhenLT(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

## E(PriceAuthority).quoteWhenLTE(amountIn, amountOutLimit)

- **amountIn**: ****
- **amountOutLimit**: **Amount**
- Return: **Promise&lt;>**

_AmountIn_ için bir **PriceQuote** _amountOutLimit_ değerine ulaştığında veya altına düştüğünde çözülür.

```js
const quote = E(PriceAuthority).quoteWhenLTE(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

## E(PriceAuthority).mutableQuoteWhenGT(amountIn, amountOutLimit)

- **amountIn**: ****
- **amountOutLimit**: **Amount**
- Return: **Promise&lt;>**

_AmountIn_ için bir **MutableQuote** _amountOutLimit_ değerini aştığında çözülür.

```js
const quote = E(PriceAuthority).mutableQuoteWhenGT(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

## E(PriceAuthority).mutableQuoteWhenGTE(amountIn, amountOutLimit)

- **amountIn**: ****
- **amountOutLimit**: **Amount**
- Return: **Promise&lt;>**

_AmountIn_ için bir **MutableQuote** _amountOutLimit_ değerine ulaştığında veya aştığında çözülür.

```js
const quote = E(PriceAuthority).mutableQuoteWhenGTE(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

## E(PriceAuthority).mutableQuoteWhenLT(amountIn, amountOutLimit)

- **amountIn**: ****
- **amountOutLimit**: **Amount**
- Return: **Promise&lt;>**

_AmountIn_ için bir **MutableQuote** _amountOutLimit_ değerinin altına düştüğünde çözülür.

```js
const quote = E(PriceAuthority).mutableQuoteWhenLT(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

## E(PriceAuthority).mutableQuoteWhenLTE(amountIn, amountOutLimit)

- **amountIn**: ****
- **amountOutLimit**: **Amount**
- Return: **Promise&lt;>**

_AmountIn_ için bir **MutableQuote** _amountOutLimit_ değerine ulaştığında veya altına düştüğünde çözülür.

```js
const quote = E(PriceAuthority).mutableQuoteWhenLTE(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

## MutableQuote

**MutableQuote**, **PriceAuthority**'nden belirli bir zamanda mevcut fiyat düzeyi konusunda bir beyanı temsil eder. Önemli içerik (fiyatlar ve zaman) **** içinde paketlenmiştir ve doğruluk açısından **** içinde tekrar etmiştir.

**MutableQuotes**, birden fazla çağrı yapmayı beklediğinizde kullanılmalıdır; tetikleyici değerini değiştirebilirsiniz. Eğer sadece tek bir alıntıya ihtiyacınız varsa ve tetikleme seviyesini değiştirmeyecekseniz, **PriceQuotes** kullanmalısınız.

**MutableQuote**, bir **Amount**-**Payment** çiftidir; burada **Amount** aynı zamanda **Payment**'ın mevcut bakiyesidir.

## PriceQuote

**PriceQuote**, **PriceAuthority**'nden belirli bir zamanda mevcut fiyat düzeyi hakkında bir beyanı temsil eder. Önemli içerik (fiyatlar ve zaman), **** içinde paketlenir ve doğruluk açısından **** içinde tekrar edilir. 
**PriceQuote**, bir **Amount**-**Payment** çiftidir; burada **Amount** aynı zamanda **Payment**'ın mevcut bakiyesidir.

```js
const { quoteAmount, quotePayment } = priceQuote;
```

**PriceQuotes** iki biçimde döner:

- **PriceDescription**
  - Her zaman **amountIn**, **amountOut**, alıntının **Timestamp**'ını ve **Timestamp**'ın göreli olduğu **TimerService**'ı içerir.
- **PriceDescription** şeklinde sarılmış bir **QuoteAuthority** tarafından çıkarılmış ödeme.
  - Bu, alıntıların zaman ve değerleri doğrulamak amacıyla başkalarıyla paylaşılmasını sağlar.