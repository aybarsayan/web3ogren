# Fiyat Otoritesi

Bir `priceAuthority`, sözleşmelerde (genellikle bir sözleşmenin şartlarında belirtilmiştir) fiyat akışını sağlamak, talep üzerine fiyat teklifleri ve çeşitli zaman ve fiyat koşulları için uyan çağrılar yapmak üzere kullanılabilir.

## Örnekler

Bir `priceAuthority` kullanımı görmek için  ve  inceleyebilirsiniz.

## Teklif Alma

Bir `priceAuthority`, resmi `priceQuotes` döndüren birçok farklı metoda sahiptir. Bir `priceQuote`, bir miktar ve bir ödeme içeren bir kayıttır; burada miktar, ödemenin mevcut bakiyesi ile aynıdır:

```js
const { quoteAmount, quotePayment } = priceQuote;
```

Bunlar ERTP miktarları ve ödemeleri olduğu için, her birinin bir émetre (issuer) vardır. Ödemeler, bir ERTP minti tarafından basılmaktadır. Bir teklif émetresi ve mint, birkaç `priceAuthorities` tarafından paylaşılabilir ve bir `priceAuthority`, birden fazla teklif émetresi kullanabilir.

Önemli olarak, bir teklifin markasını doğrulayabilir ve bunun, teklif émetresiyle ilişkili mint tarafından basıldığını belirlemek için `quoteIssuer` kullanarak `quotePayment`'in `quoteAmount`'ını elde edebilirsiniz:

```js
const verifiedQuoteAmount = await E(quoteIssuer).getAmountOf(quotePayment);
```

Artık bir `quoteAmount` (veya bir `verifiedQuoteAmount`) elde ettiğinizde, teklif edilen miktarları çıkartabilirsiniz:

```js
const [{ value: { amountIn, amountOut, timestamp, timer }] = quoteAmount;
```

Bu, `priceAuthority`'nin, `timer`'a göre `timestamp` gerçekleştiğinde, `amountIn` kadar satabileceğinizi ve bunun karşılığında `amountOut` alabileceğinizi beyan ettiği anlamına gelir. `amountIn` ve `amountOut`, talep ettiğiniz `brandIn` ve `brandOut` için ERTP miktarlarıdır.

## Değişken Fiyat Teklifleri

`MutableQuote`'un `getPromise()` metodu, `PriceQuote` için bir `Promise` döndürmektedir; bu, `quoteWhenLTE()` API metoduyla ve varyantlarıyla döndürülenle aynıdır. Etkili olarak, değişken olmayan fiyat teklifi metodları tek bir `PriceQuote` döndürürken, değişken fiyat teklifi metodları, tetikleme seviyelerini değiştirerek veya iptal ederek manipüle edilebilen yeniden kullanılabilir bir nesne döndürür.

## API Referansı

 sayfasına göz atın.