---
title: Kapalı Çağrı Sözleşmesi
---



#####  (Son güncelleme: 12 Eyl 2020)

##### 

Bir varlık sahibinin bir kapalı çağrı kullanarak başkasına o varlığı belirli bir fiyattan, yani "satış fiyatı" olarak adlandırılan bir fiyattan alma hakkı vermesi mümkündür. Bu hak, kendi başına bir varlık olarak değerlendirilebilir. Bu sözleşme, bu tür türev hakları oluşturur ve başka birinin o hakkı başarılı bir şekilde kullanması durumunda ne elde edeceğini bilmesine olanak tanır. Çağrı opsiyonu bir sona erme tarihine sahiptir ve bu tarihte sözleşme iptal edilir. "Kapalı" olarak adlandırılma sebebi, tanımladığı varlıkların satıcının mülkiyetinde olmasıdır ve değişim gerçekleştiğinde gerçek varlık transfer edilecektir.

Bu sözleşmede, sona erme tarihi dijital varlığın sahibinin teklifinin iptal edildiği son tarihi temsil eder. Bu nedenle, dijital varlık sahibinin teklifi, "başkaDahaSonra" olan bir `çıkış` koşuluna sahip olmalıdır.

`startInstance()` yöntemini çağıran taraf, varlıkları yatırmak için kullanabilecekleri bir davet alır. Bunu yaptıklarında, teklif sonucu, çağrı opsiyonu olarak işlev gören başka bir davettir. Davet, karşı tarafın yararına işlemin ayrıntılarını içerir. Davetteki güvence altındaki varlıkların doğrulanmasına olanak tanır: `{ expirationDate, timerAuthority, underlyingAsset, strikePrice }`.

## Sözleşmenin API'si

Bir çağrı opsiyonu, önceden belirlenmiş bir fiyattan dijital varlıkları satın alma hakkıdır (ama zorunluluğu değildir) ve bu fiyata "satış fiyatı" denir. Bu çağrı opsiyonu "kapalı"dır; yani, varlıklar teminat altına alınmadan teklifi kabul etmek için davet çıkartılmayacaktır. Bu, dijital varlıkların sahibinin gelecekte sözlerine sadık kalmalarını beklemeden varlıkların transfer edilebileceğini garanti eder.

Çağrı opsiyonu bir sona erme tarihine sahiptir; bu tarihte fırsat iptal edilir. Dijital varlıkların sahibi, varlıkları sona erme tarihinden önce teminat altından çıkaramaz.

Bu sözleşmenin `creatorInvitation`'ı, temel varlıkları teminat altına almak için yapılan bir davettir. Varlıkları teminat altına alma teklifi, herhangi bir `verme` ve `isteme` ile birlikte herhangi bir anahtar kelime içerebilir. Farklı markalardaki herhangi bir sayıda varlık, farklı anahtar kelimelerle teminat altına alınabilir. Teklif, "başkaDahaSonra" anahtarıyla bir çıkış koşuluna sahip olmalıdır:

```js
{
  give: { ... },
  want: { ... },
  exit: {
    afterDeadline: { deadline: time, timer: chainTimer },
  },
}
```

Son tarih, kapalı çağrı opsiyonunun sona erme tarihi olarak işlev görür. Bu son tarihten sonra, eğer opsiyon kullanılmamışsa, temel varlıklar otomatik olarak sözleşmenin yaratıcısına geri döner.

Dijital varlık sahibinin, ilk teklife teminat altına aldıktan sonra bir koltuk alır. Bu koltuğun ödemesi ya yukarıda bahsedilen temel varlıkların geri ödenmesi ya da satış fiyatı miktarı kadar ödeme olacaktır. Zoe'nin teklif güvenliğine ilişkin hükümleri, sözleşmesel hatalardan bağımsız olarak, ödemenin ya geri ödeme ya da satış fiyatı kadar bir ödeme olmasını garanti eder.

İlk koltuktan alınan teklifSonucu, çağrı opsiyonunun kendisi olan incelemeye tabi bir davettir: temel varlıkları satın alma teklifi. Çağrı opsiyonu davetinin içinde ek olarak şu bilgiler bulunur: `{ expirationDate, timeAuthority, underlyingAssets, strikePrice }`.

Davet, değerli bir dijital varlık olarak alınıp satılabilir: kapalı bir çağrı opsiyonu.

Kapalı çağrı opsiyonunun alıcısı (hediye olarak alınmış olsun, bir borsa üzerinden satın alınmış olsun veya bir sözleşme aracılığıyla alınmış olsun) bu daveti, çağrıda belirtilen satış fiyatını ödeyerek ve temel varlıkları alarak bu sözleşmeye davet olarak kullanarak, son tarih öncesinde kullanabilir. Kapalı çağrı opsiyonu alıcısı, davette belirtilen satış fiyatını `ver` ve temel varlıkları tam olarak `iste` belirttikleri müddetçe istedikleri anahtar kelimeleri kullanabilir.

## Bir Çağrı Opsiyonu Oluşturma

Diyelim ki Alice, kapalı bir çağrı oluşturmak istiyor. İlk teklifi, atomik değişimde oluşturduğu gibi oluşturur. Her anahtar kelime ile kullanılacak ihraççıları belirtmek için bir issuerKeywordRecord oluşturur.

```js
const issuerKeywordRecord = harden({
  UnderlyingAsset: moolaIssuer,
  StrikePrice: simoleanIssuer
});

const { creatorInvitation } = await E(zoe).startInstance(
  coveredCallInstallation,
  issuerKeywordRecord
);
```

Daha sonra Alice bir teklif oluşturur ve yatırdığı fonları teminat altına alır.

```js
const threeMoola = AmountMath.make(moolaBrand, 3n);
const aliceProposal = harden({
  give: { UnderlyingAsset: threeMoola },
  want: { StrikePrice: AmountMath.make(simoleanBrand, 7n) },
  exit: { afterDeadline: { deadline: 1599856578n, timer: chainTimer } }
});

const alicePayment = { UnderlyingAsset: aliceMoolaPurse.withdraw(threeMoola) };
```

Alice bir teklif yapar ve bir koltuk alır.

```js
const aliceSeat = await E(zoe).offer(
  creatorInvitation,
  aliceProposal,
  alicePayment
);

const coveredCall = aliceSeat.getOfferResult();
```

Koltuktan elde edilen teklifSonucu, istediği kapalı çağrı olarak işlev gören bir zoe davetidir. Bu davet tam bir ERTP ödemesidir ve teminat altına alınabilir ve diğer sözleşmelerde kullanılabilir. Örneğin, Alice bunu Bob'a gönderebilir; Bob ya çağrı opsiyonunu kullanabilir ya da onu başka bir sözleşmede, örneğin bir atomik değişimde satabilir:

```js
const invitationIssuer = E(zoe).getInvitationIssuer();
const bobExclOption = await invitationIssuer.claim(coveredCall);
```

Diyelim ki Bob, daveti satmak istiyor. Bu daveti bir dolara takas etmek için bir değişim örneği başlatabilir.

```js
const swapIssuerKeywordRecord = harden({
  Asset: invitationIssuer,
  Price: bucksR.issuer
});
const bobSwapSeat = await E(zoe).startInstance(
  swapInstallation,
  swapIssuerKeywordRecord
);
```

Bob, daveti 1 dolar karşılığında takas etmek istediğini belirtir ve kapalı çağrı davetini teminat altına alır. Karşılığında paylaşabileceği bir değişim daveti alır.

```js
const bobProposalSwap = harden({
  give: { Asset: invitationIssuer.getAmountOf(bobExclOption) },
  want: { Price: bucks(1) }
});

const bobPayments = harden({ Asset: bobExclOption });
const bobSwapSeat = await E(zoe).offer(
  bobSwapInvitation,
  bobProposalSwap,
  bobPayments
);

const daveSwapInvitation = bobSwapSeat.getOfferResult();
```

## Bir Opsiyon Satın Alma

Başka bir kullanıcı, adını Dave koyduğumuz, 7 simoleanı 3 moola ile değiştirme opsiyonunu almak istiyor ve bu opsiyon için 1 dolar ödemeye istekli. Dave, Bob'un değişim davetinde ilgilidir, bu nedenle bu örneğin onun istediği ile eşleşip eşleşmediğini kontrol eder. Davetin miktarını kontrol ederek bunun hangi sözleşme için olduğunu ve davetin ne için kullanılabileceğine dair herhangi bir sözleşme sağlanan bilgiyi görebilir.

```js
const { installation: daveSwapInstall, instance } =
  await E(zoe).getInvitationDetails(daveSwapInvitation);
const daveSwapIssuers = await E(zoe).getIssuers(instance);

// Dave bazı kontroller yapıyor
assert(daveSwapInstall === swapInstallation, details`yanlış kurulum`);
assert(daveSwapIssuers.Asset === moolaIssuer, details`beklenmeyen Varlık ihraççısı`);
assert(daveSwapIssuers.Price === simoleanIssuer, details`beklenmeyen Fiyat ihraççısı`);
```

Bob, takas hakkında yalan söylediyse Dave'nin teklifi reddedilecek ve geri ödeneceği için Dave güvenle takasa geçebilir. Dave, 1 doları Zoe’ye teminat altına alır ve teklifini oluşturur.

```js
const daveSwapProposal = harden({
  want: { Asset: optionAmount },
  give: { Price: bucks(1) }
});

const daveSwapPayments = harden({ Price: daveBucksPayment });

const daveSwapSeat = await E(zoe).offer(
  daveSwapInvitation,
  daveSwapProposal,
  daveSwapPayments
);
```

## Opsiyonu Kullanma

Artık Dave kapalı çağrıya sahip olduğuna göre bunu kullanabilir. Gerekli kullanım fiyatını ödeyerek temel varlığı almak için bir teklif yollayarak opsiyonu kullanır:

```js
const daveOption = await daveSwapSeat.getPayout('Asset');

const daveCoveredCallProposal = harden({
  want: { UnderlyingAsset: AmountMath.make(moolaBrand, 3n) },
  give: { StrikePrice: AmountMath.make(simoleanBrand, 7n) }
});

const daveCoveredCallPayments = harden({
  StrikePrice: daveSimoleanPayment
});

const daveCallSeat = await E(zoe).offer(
  daveOption,
  daveCoveredCallProposal,
  daveCoveredCallPayments
);

const daveMoolaPayout = await daveCallSeat.getPayout('UnderlyingAsset');
await daveMoolaPurse.deposit(daveMoolaPayout);
```