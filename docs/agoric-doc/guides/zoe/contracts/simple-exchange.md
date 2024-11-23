---
title: Basit Değişim Sözleşmesi
---



#####  (Son güncelleme: 12 Eylül 2020)

##### 

"Basit değişim", son derece temel ve optimize edilmemiş bir değişimdir. Bir varlık için bir emir defteri vardır; bu defter, ikinci bir varlık cinsinden fiyatlandırılmıştır. Emir defteri, yeni bir sipariş geldiğinde sözleşmenin eşleşmeler için yinelediği basit bir dizi olarak tutulmaktadır.

## Sözleşme API'si

SimpleExchange, basit bir eşleştirme algoritmasına sahip bir değişimdir. Bu, sınırsız sayıda tarafın yeni siparişler oluşturmasına veya mevcut siparişleri kabul etmesine olanak tanır. Bir bildirimci, arayanların mevcut sipariş listesini bulmasına yardımcı olur.

SimpleExchange anahtar kelimeleri `Asset` ve `Price`dir. Sözleşme, iki anahtar kelimeyi simetrik olarak ele alır. Yeni tekliflerin oluşturulması ve mevcut tekliflerin her iki yönde kabul edilmesi sağlanır.

```js
{ give: { Asset: simoleans(5) }, want: { Price: quatloos(3) } }
{ give: { Price: quatloos(8) }, want: { Asset: simoleans(3) } }
```

Not: Burada 5 simoleon, 3 quatloos, 8 quatloos ve 3 simoleon değerine sahip varlıklar için bir kısayol kullandık. Başka yerlerde, bu `amounts` in-line olarak oluşturularak yapılabilirdi (yani `AmountMath.make(quatloosBrand, 8n)`). Veya teklifin dışındaki `amounts` değişkenlerle atanarak oluşturulabilirdi. Örneğin, `const quatloos8 = AmountMath.make(quatloosBrand, 8n);` şeklinde tanımlandıktan sonra yukarıdaki ikinci kısımda `Price` için `quatloos8` değeri kullanılabilirdi.

`want` terimi değiştirilecek kesin bir tutarı ifade ederken, `give` terimi geliştirilebilecek bir sınırı belirtir. Bu basit değişim, siparişleri kısmi olarak doldurmamaktadır.

Sözleşme başlatıldığında `publicFacet` döndürülür.

## SimpleExchange'i Oluşturma

```js
const { publicFacet } = await E(zoe).startInstance(installation, {
  Asset: moolaIssuer,
  Price: simoleanIssuer
});
const simpleExchangeInvitation = await E(publicFacet).makeInvitation();
const { instance } = await E(zoe).getInvitationDetails(
  simpleExchangeInvitation
);
const aliceInvitation = await E(publicFacet).makeInvitation();
```

## Bir Sipariş Ekleme

Alice adında bir kullanıcı, Zoe ile bir satım emri oluşturmak için teminat verir. 3 moola satmak ve karşılığında en az 4 simoleon almak istemektedir:

```js
const aliceSellOrderProposal = harden({
  give: { Asset: AmountMath.make(moolaBrand, 3n) },
  want: { Price: AmountMath.make(simoleanBrand, 4n) },
  exit: { onDemand: null }
});

const alicePayment = { Asset: aliceMoolaPayment };
```

Alice, satış emrini değişime eklemek için Zoe ile ödemesini teminat olarak verir.

```js
const aliceSeat = await E(zoe).offer(
  aliceInvitation,
  aliceSellOrderProposal,
  alicePayment
);
```

## Bir Siparişi Alma

Bob, basit değişim hakkında bilgi sahibidir ve Alice’in teklifini duyar. Bu ona iyi bir anlaşma gibi görünmektedir, bu yüzden Zoe ile kurulum kontrolü yapar ve değişimin beklediği gibi işlem yaptığını görür:

```js
const bobInvitation = E(publicFacet).makeInvitation();
const invitationIssuer = E(zoe).getInvitationIssuer();
const bobExclusiveInvitation = E(invitationIssuer).claim(bobInvitation);
const { instance, installation } = await E(zoe).getInvitationDetails(
  bobExclusiveInvitation
);
const bobIssuers = await E(zoe).getIssuers(instance);
```

Bob, bilgilerin beklediği gibi olduğunu doğrular. Davetiyeden aldığı kurulum bilgilerini güvendiği bir kamu dizininde bulduğu kanonik bir bağlantı ile karşılaştırır.

```js
assert(
  installation === simpleExchangeInstallation,
  details`yanlış kurulum`
);
assert(bobIssuers.Asset === moolaIssuer, details`yanlış Varlık ihraççısı`);
assert(bobIssuers.Price === simoleanIssuer, details`yanlış Fiyat ihraççısı`);
```

Bob, her şeyin düzgün olduğunu kontrol ettikten sonra, satın alma emrini yerine getirir:

```js
const bobBuyOrderProposal = harden({
  give: { Price: AmountMath.make(simoleanBrand, 7n) },
  want: { Asset: AmountMath.make(moolaBrand, 3n) },
  exit: { onDemand: null }
});

const bobSimPayment = await E(bobSimoleanPurse).withdraw(
  AmountMath(simoleanBrand, 7n)
);
const bobPayments = { Price: bobSimPayment };

const bobSeat = await E(zoe).offer(
  bobExclusiveInvitation,
  bobBuyOrderProposal,
  bobPayments
);
```

## Ödeme

Bir eşleşme yapıldığında, bir kullanıcının yerinden alınan ödeme vaadi, ödeme vaadine dönüşür. Bob için:

```js
const { Asset: bobAssetPayoutP, Price: bobPricePayoutP } =
  await bobSeat.getPayouts();
const bobAssetPayout = await bobAssetPayoutP;
const bobMoolaGainAmount = await E(bobMoolaPurse).deposit(bobAssetPayout);
const bobPricePayout = await bobPricePayoutP;
const bobSimGainAmount = await E(bobSimPurse).deposit(bobPricePayout);
```

Alice de ödemelerini aynı şekilde alır. (`getPayouts()` ve `getPayout(keyword)` arasında seçim, her durumda hangisinin daha uygun olduğuna dayanır).

```js
const aliceAssetPayout = await aliceSeat.getPayout('Asset');
const aliceMoolaGainAmount = aliceMoolaPurse.deposit(aliceAssetPayout);
const alicePricePayout = await aliceSeat.getPayout('Price');
const aliceSimGainAmount = aliceSimPurse.deposit(alicePricePayout);