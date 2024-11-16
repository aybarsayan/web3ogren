---
title: İkinci Fiyatlı Açık Artırma Sözleşmesi
---



#####  (Son güncelleme: 14 Eylül 2020)

##### 

İkinci fiyatlı bir açık artırmada kazanan, en yüksek teklifi veren katılımcıdır; ancak kazanan, yalnızca ikinci en yüksek teklifin karşılığını öder. **İkinci fiyatlı açık artırmalarda, öne çıkan ekonomik teşvikler için, tekliflerin gizli (yani özel) olması gerekir; bu nedenle tamamen kamuya açık olan bu sürüm, gerçek değerli mülkler için üretimde kullanılmamalıdır.** Bu, Zoe altında düzenlenen açık artırmaların fiyatların nasıl hesaplandığına veya nasıl kazananların belirlendiğine dair farklı kurallar uygulayabileceğini gösteren bir demosyon örneğidir.

Açık artırma sözleşmesi, satıcının bir Varlığı satışa sunduğu ve bir minimum fiyat belirttiği bir sözleşmedir. Açık artırma, sözleşme örneğini oluşturan kişi tarafından sağlanan timeAuthority ve closesAfter parametrelerinde belirtilen son tarihte kapanır. İkinci fiyat kuralı takip edilir; dolayısıyla, en yüksek teklifi veren, ikinci en yüksek teklif verenin teklif ettiği miktarı öder.

`startInstance()` vericileri ve şartları belirtir. Satıcı için bir davetiyenin creatorInvitation olarak döndüğü bir durum vardır. Satıcının teklifi şu şekilde görünmelidir:

```js
{ give: { Asset: asset }, want: { Ask: minimumBidAmount}}
```

Varlık, fungible (fungible) olmayan bir varlık olabilir, ancak Ask miktarı bir fungible marka ait olmalıdır. Teklif sahipleri davetleri oluşturmak için satıcının teklifinden dönen nesnede `makeBidInvitation()` çağrısını yapmalıdır. Her teklif sahibi şu teklifi sunabilir: `js { give: { Bid: null } want: { Asset: null } }.`

## Kamuya Açık İkinci Fiyatlı Açık Artırma

Bu özel "kamuya açık" ikinci fiyatlı açık artırmada, açık artırma örneğine erişimi olan herkes teklif verebilir.

Alice mevcut bir ikinci fiyatlı açık artırma kurulumundan bir açık artırma oluşturabilir. (`installation` kurulum için benzersiz, sahteciliğe karşı dayanıklı bir tanımlayıcıdır.)

```js
const issuerKeywordRecord = harden({
  Asset: moolaIssuer,
  Bid: simoleanIssuer
});

const terms = harden({ numBidsAllowed: 3 });
const { creatorInvitation } = await E(zoe).startInstance(
  installation,
  issuerKeywordRecord,
  terms
);
```

Satılacak bir şeyi Zoe ile güvence altına alarak açık artırmaya koyabilir. Satmak istediği şey için bir ödeme sunar ve bir `proposal` hazırlar. Teklifin şartları Zoe tarafından uygulanacak ve Alice'i akıllı sözleşmenin ve diğer katılımcıların kötü davranışlarından koruyacaktır. Eğer herhangi bir `exit` kuralı belirtilmemişse, bu örnekte olduğu gibi varsayılan (`{ onDemand: null }`) kullanılır.

```js
const aliceProposal = harden({
  give: { Asset: AmountMath.make(moolaBrand, 1n) },
  want: { Bid: AmountMath.make(simoleanBrand, 3n) },
  exit: { waived: null }
});

const alicePayments = { Asset: aliceMoolaPayment };

const aliceSeat = await E(zoe).offer(
  creatorInvitation,
  aliceProposal,
  alicePayments
);
const invitationMaker = await E(aliceSeat).getOfferResult();
const bobInvitation = E(invitationMaker).makeBidInvitation();
```

Artık Alice, karşı taraf davetini arkadaşlarıyla paylaşabilir ve herhangi bir teklif veren olup olmadığını görebilir. Diyelim ki Bob bir davetiye aldı ve bunun kendisi için ilginç bir teklif olup olmadığını doğrulamak istiyor. Kurulumun beklediği standart açık artırma olup olmadığını kontrol edebilir. Satışta olan öğenin kendisi için ne kadar değerli olduğunu kontrol etmek için vericilerle karşılaştırabilir.

```js
const invitationIssuer = await E(zoe).getInvitationIssuer();
const bobExclusiveInvitation = await invitationIssuer.claim(bobInvitation);

const { installation: bobInstallation, instance } = await E(
  zoe
).getInvitationDetails(bobExclusiveInvitation);
const bobIssuers = await E(zoe).getIssuers(instance);

assert(
  bobInstallation === secondPriceAuctionInstallation,
  details`yanlış kurulum`
);
assert(bobIssuers.Asset === moolaIssuer, details`yanlış verici`);
```

Bob sözleşmeye katılmaya karar verir ve bir teklif yapar:

```js
const bobProposal = harden({
  give: { Bid: AmountMath.make(simoleanBrand, 11n) },
  want: { Asset: AmountMath.make(moolaBrand, 1n) }
});

const bobPayments = { Bid: bobSimoleanPayment };

const bobSeat = await E(zoe).offer(
  bobExclusiveInvitation,
  bobProposal,
  bobPayments
);
```

Birden fazla tarafın açık artırmaya katılmak istediğini varsayalım. Diyelim ki Carol ve Dave de Bob gibi teklif vermeye karar verdi—Carol 7 simolean ve Dave 5 simolean teklif etti.

Bob, 11 simolean teklif verdiği için kazanır, ancak ikinci en yüksek fiyat olan Carol'ın 7 simolean teklif ettiği rakamı öder. Böylece, Alice kazançlarını talep ettiğinde 7 simolean alır. Bob ise açık artırmaya koyulan 1 moola'nın yanı sıra 4 simolean (11-7) geri alır ve Carol ile Dave tamamen geri ödeme alır.

```js
const aliceAssetPayout = await aliceSeat.getPayout('Asset');
const moolaRefundAmount = aliceMoolaPurse.deposit(aliceAssetPayout);

const alicePricePayout = await aliceSeat.getPayout('Price');
const simoleanGainAmount = aliceSimPurse.deposit(alicePricePayout);
```

Bob'un ödemeleri de mevcuttur.

```js
const bobAssetPayout = await bobSeat.getPayout('Asset');
const bobMoolaGainAmount = bobMoolaPurse.deposit(bobAssetPayout);

const bobPricePayout = await bobSeat.getPayout('Price');
const bobSimoleanRefundAmount = bobSimoleanPurse.deposit(bobPricePayout);
```