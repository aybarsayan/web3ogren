---
id: atomic-swap-contract
title: Atomic Swap Sözleşmesi
---



#####  (Son güncelleme: 12 Eyl 2020)

##### 

Bir tür varlığı diğer bir türle takas etmek istediğimde, sana varlığı gönderebilir ve diğer türü geri göndermeni isteyebilirim. Ancak, sen fırsatçı davranarak benim varlığımı alıp hiçbir şey geri vermeyebilirsin.

Bu sorunu çözmek için, Zoe tabanlı takas sözleşmeleri kullanıcıların bir tür dijital varlığı başka bir türle güvenli bir şekilde takas etmelerine olanak tanır. Zoe escrow (emanet) ve teklif güvenliği sağladığından, hiçbir kullanıcı fırsatçı davranamaz.

`atomicSwap` sözleşmemizde, herkes bir karşı tarafla güvenli bir şekilde takas yapabilir. Takas edilecek dijital varlıkları Zoe ile emanet eder ve ardından olası bir karşı tarafa davetiye gönderir. Bu belirli takas sözleşmesi örneği için bir davetiye olmadan, karşı taraf olamazsınız.

Diyelim ki Alice, Bob ile karşı taraf olarak takas yapmak istiyor. Zaten sözleşmenin kurulumuna erişimi olduğu için, bu belirli işlem için bir takas örneği oluşturabilir.

```js
const issuerKeywordRecord = harden({
  Asset: moolaIssuer,
  Price: simoleanIssuer
});
const { creatorInvitation } = await E(zoe).startInstance(
  atomicSwapInstallation,
  issuerKeywordRecord
);
```

Ardından Alice, teklifini Zoe ile emanet eder. İki şeyi birden gönderir; teklifinin gerçek ERTP ödemeleri ve bir `proposal` (öneri). Zoe, öneriyi kullanarak Alice'i akıllı sözleşmeden (başkası tarafından yazılmış olabilir) ve diğer katılımcılardan korur.

Bir öneri üç bölümden oluşur:

- `give`: Bu tarafın takasta vermeyi taahhüt ettiği şey. Zoe tarafından teklif güvenliğini sağlamak için kullanılır (Alice, verdiği veya istediği şeyi geri alır).
- `want`: Bu tarafın takastan almak istediği şey. Zoe tarafından teklif güvenliğini sağlamak için kullanılır (Alice, verdiği veya istediği şeyi geri alır).
- `exit`: Bu tarafın sözleşme örneğinden çıkma şekli. Zoe tarafından ödeme sürekliliğini sağlamak için kullanılır (Alice, belirtilen çıkış kuralına göre bir ödeme alabilecektir).

Bu durumda, Alice’in çıkış kuralı `onDemand`, yani sözleşme örneğinden herhangi bir zamanda çıkabilir.

```js
const threeMoola = AmountMath.make(moolaBrand, 3);
const aliceProposal = harden({
  give: { Asset: threeMoola },
  want: { Price: AmountMath.make(simoleanBrand, 7) },
  exit: { onDemand: null }
});

const alicePayment = await E(aliceMoolaPurse).withdraw(threeMoola);
```

Alice'in Zoe ile emanet yapabilmesi için davetiyesini kullanması gerekir. Ardından teklifini yapar ve bir `seat` (koltuk) alır. `seat`, ona teklifin sonucuna ve ödemelerine erişim sağlar.

```js
const aliceSeat = await E(zoe).offer(
  creatorInvitation,
  aliceProposal,
  harden({ Asset: alicePayment })
);
```

Bu ilk teklifin sonucu, Alice’in istediği herhangi birine gönderebileceği bir davetiyedir. Bu örnekte, davetiyeyi Bob'a gönderir.

```js
const invitationP = aliceSeat.getOfferResult();
```

Bob, davetiyenin ayrıntılarını inceleyerek Alice'in iddialarıyla eşleşip eşleşmediğini kontrol eder.

```js secondary style2
const { installation: bobInstallation, instance } =
  E(zoe).getInvitationDetails(invitationP);
const bobIssuers = E(zoe).getIssuers(instance);

const bobExclusiveInvitation = await invitationIssuer.claim(invitationP);
const bobInvitationValue = await E(zoe).getInvitationDetails(
  bobExclusiveInvitation
);

// Bob davetiyeyi doğrular.
assert(bobInstallation === atomicSwapInstallation, details`yanlış sözleşme`);
assert(bobIssuers.Asset === moolaIssuer, details`beklenmeyen Varlık vereni`);
assert(bobIssuers.Price === simoleanIssuer, details`beklenmeyen Fiyat vereni`);
assert(
  AmountMath.isEqual(bobInvitationValue.asset, moola(3)),
  details`yanlış varlık`
);
assert(
  AmountMath.isEqual(bobInvitationValue.price, simoleans(7)),
  details`yanlış fiyat`
);
```

Bob, davetiyeyi kullanmaya ve ödemelerini emanet etmeye karar verir. Ardından, Alice'in yaptığı gibi teklifini yapmak için davetiyesini kullanır. Ancak Bob, teklifini Alice’in teklifine uyacak şekilde yazmıştır (dikkat edin ki `give` ve `want` maddeleri, Alice'in önerisindeki gibi ters çevrilmiştir):

```js secondary style2
const sevenSimoleans = AmountMath.make(simoleanBrand, 7n);
const bobProposal = harden({
  want: { Asset: AmountMath.make(moolaBrand, 3n) },
  give: { Price: sevenSimoleans },
  exit: { onDemand: null }
});

const bobPayment = await E(bobSimoleansPurse).withdraw(sevenSimoleans);
// Bob, Zoe ile emanet yapar ve bir teklif yapar
const bobSeat = await E(zoe).offer(
  bobExclusiveInvitation,
  bobProposal,
  harden({ Price: bobPayment })
);
```

Bob, teklifini yaptı ve sözleşme yürütülmeye başladı. Alice ve Bob'un teklifleri eşleştiğinden, Alice'in ödemeleri çözülür. Alice, `seat`'ini kullanarak ödemelerini geri alır. Sonra, Zoe'nin geri döndüreceği bir miktarı öğrenmek için moola ödeme alımını yatırır.

```js
const aliceAssetPayout = await aliceSeat.getPayout('Asset');
const alicePricePayout = await aliceSeat.getPayout('Price');
const moolaRefundAmount = aliceMoolaPurse.deposit(aliceAssetPayout);
const simoleanGainAmount = aliceSimoleansPurse.deposit(alicePricePayout);
```

Bob'un ödemesi de mevcuttur. Alice'in teklifini zaten bildiğinden, bir simolean iadesi aramasına gerek yoktur.

```js secondary style2
const bobAssetPayout = await bobSeat.getPayout('Asset');
const bobMoolaGainAmount = bobMoolaPurse.deposit(bobAssetPayout);