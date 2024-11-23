---
title: ZoeHelper Fonksiyonları
---

# ZoeHelper Fonksiyonları

ZoeHelper fonksiyonları, kontratlardan Zoe işlevselliğine erişim için pratik soyutlamalar sağlar. Çoğu durumda, bir zcf referansı veya bir veya daha fazla koltuk geçirirsiniz.

Aşağıda tüm ZoeHelper fonksiyonları açıklanmıştır. Herhangi birini kullanmak için, doğrudan **@agoric/zoe/src/contractSupport/index.js** dosyasından içe aktarın. Örneğin, aşağıdaki kod iki ZoeHelper fonksiyonunu **** ve **** içe aktarır:

```js
import {
  assertIssuerKeywords,
  assertProposalShape
} from '@agoric/zoe/src/contractSupport/index.js';
```

## atomicRearrange(zcf, transfers)

- **zcf**: ****
- **transfers**: **Array&lt;>**
- Dönüş: Yok.

Zoe'den, _transfers_ içinde belirtilen koltuklar arasında ****’ları yeniden düzenlemesini ister. _transfers_, bir dizi kısıtı karşılaması gereken **Allocations** üzerinde bir dizi değişikliktir. Bu kısıtların hepsi karşılanırsa, yeniden tahsis atomik olarak gerçekleştirilir. Aksi takdirde bir hata fırlatılır ve önerilen değişikliklerin hiçbiri etkili olmaz. Kısıtlar şu şekildedir:

- Belirtilen tüm koltuklar hâlâ aktiftir.
- Belirtilen hiçbir koltuk için bekleyen herhangi bir aşama yoktur.

  Aşamalar, bu **atomicRearrange()** fonksiyonu lehine terkedilmiş bir yeniden tahsis mekanizmasıdır. Karışıklığı önlemek için, her yeniden tahsis ya eski yöntemle ya da yeni yöntemle ifade edilebilir, karışık şekilde değil.

- Genel korunma sağlanmalıdır. Başka bir deyişle, yeniden tahsis edilen **** dengelenmelidir.
- Teklif Güvenliği her koltuk için korunur. Bu, yeniden tahsislerin bir koltuktan yalnızca, ya önerisinde belirtilen isteklere uygun varlıkları alması ya da önerisinde belirtilen tüm varlıkları tutması durumunda gerçekleştirebileceği anlamına gelir. Bu kısıtlama, tüm atomikYenidenDüzenleme boyunca her koltuk için geçerlidir, bireysel **TransferParts** için değil.

_unuttuk_, _transfers_ dizisini manuel olarak oluşturabilir veya yatay olarak sadece bir koltuk içeren transferler için, **** ve **** yardımcı fonksiyonlarını kullanarak yalnızca birkaç alan kullanan **TransferParts** oluşturabilirsiniz.

## fromOnly(fromSeat, fromAmounts)

- **fromSeat**: ****
- **fromAmounts**: ****
- Dönüş: ****

_**TransferPart**_ nesnesi yalnızca **fromAmounts**'ı _fromSeat_'ten alır. **TransferParts**, **** fonksiyonunun _transfer_ argümanının bir parçası olarak kullanılır.

## toOnly(toSeat, toAmounts)

- **toSeat**: ****
- **toAmounts**: ****
- Dönüş: ****

_**TransferPart**_ nesnesi yalnızca _toSeat_’e **toAmount** verir. **TransferParts**, **** fonksiyonunun _transfer_ argümanının bir parçası olarak kullanılır.

## atomicTransfer(zcf, fromSeat, toSeat, fromAmounts, toAmounts?)

- **zcf**: ****
- **fromSeat**: **** - Opsiyonel.
- **toSeat**: **ZCFSeat** - Opsiyonel.
- **fromAmounts**: **** - Opsiyonel.
- **toAmounts**: **AmountKeywordRecord** - Opsiyonel, varsayılan olarak **fromAmounts**.
- Dönüş: Yok.

Zoe'den, _fromSeat_ ve _toSeat_ arasında ****'ları yeniden düzenlemesini ister. Yeniden tahsislerin bir dizi kısıtı karşılaması gerekir. Bu kısıtların hepsi karşılanırsa, yeniden tahsis atomik olarak gerçekleştirilir. Aksi takdirde bir hata fırlatılır ve önerilen değişikliklerin hiçbiri etkili olmaz. Kısıtlar şunlardır:

- Belirtilen tüm koltuklar hâlâ aktiftir.
- Belirtilen hiçbir koltuk için bekleyen aşama yoktur.

  Aşamalar, bu **atomicRearrange()** fonksiyonu lehine terkedilmiş bir yeniden tahsis mekanizmasıdır. Karışıklığı önlemek için, her yeniden tahsis ya eski yöntemle ya da yeni yöntemle ifade edilebilir, karışık şekilde değil.

- Genel korunma sağlanmalıdır. Başka bir deyişle, yeniden tahsis edilen **** dengelenmelidir.
- Teklif Güvenliği her koltuk için korunur. Bu, yeniden tahsislerin bir koltuktan yalnızca, ya önerisinde belirtilen isteklere uygun varlıkları alması ya da önerisinde belirtilen tüm varlıkları tutması durumunda gerçekleştirileceği anlamına gelir. Bu kısıtlama, tüm atomikYenidenDüzenleme boyunca her koltuk için geçerlidir, bireysel **TransferParts** için değil.

_toAmounts_’ı belirtmediğinizde, _fromAmount_ dışarıdan alınıp _toSeat_’e verilecektir.

## assertIssuerKeywords(zcf, expected)

- **zcf**: ****
- **expected**: **Array&lt;String>**
- Dönüş: Yok.

**_expected_** argümanındaki ****'lerin beklentilere uygun olup olmadığını kontrol eder. Eğer yanlış veya fazla **Keywords** verilirse veya eksik **Keywords** varsa, fonksiyon bir hata fırlatır. **Keyword** sırası önemsizdir.

```js
import { assertIssuerKeywords } from '@agoric/zoe/src/contractSupport/index.js';

// Bu kontrat örneği 'Asset' ve 'Price' anahtar kelimelerini kullanır
assertIssuerKeywords(zcf, harden(['Asset', 'Price']));
```

## satisfies(zcf, seat, update)

- **zcf**: ****
- **seat**: ****
- **update**: ****
- Dönüş: **Boolean**

Bir **seat**'in **currentAllocation**'ına yapılan bir güncellemenin, **proposal.want**'ını karşılayıp karşılamadığını kontrol eder. Bu, teklif güvenliği kontrolünün yarısını temsil eder; ****'ın bir geri ödeme oluşturup oluşturmadığını kontrol etmez. Güncelleme, **currentAllocation** ile birleştirilir, böylece _update_'in değerleri aynı **** ise öncelik kazanır. Eğer aynı değillerse, **Keyword** ve **value** yalnızca **currentAllocation**'a eklenir.

Aşağıdaki örnek kod, iki **seats** arasında bir **satisfiedBy()** karşılaştırma fonksiyonu tanımlar. İkinci **seat** argümanının _currentAllocation_’ının, ilk **seat** argümanının **proposal.want**'ını karşılayıp karşılamadığını kontrol eder.

Ardından, her iki koltuğun iki işleminde **satisfiedBy()** çağrılır. Eğer her ikisi de birbirini karşılıyorsa, takas gerçekleştirir.

```js
import { satisfies } from '@agoric/zoe/src/contractSupport/index.js';

const satisfiedBy = (xSeat, ySeat) =>
  satisfies(zcf, xSeat, ySeat.getCurrentAllocation());

if (satisfiedBy(offer, seat) && satisfiedBy(seat, offer)) {
  swap(zcf, seat, offer);
}
```

## swap(zcf, leftSeat, rightSeat)

- **zcf**: ****
- **leftSeat**: ****
- **rightSeat**: **ZCFSeat**
- Dönüş: **defaultAcceptanceMsg**

Her iki koltuk için, bir koltuğun istediği her şey, diğer koltuktan alınarak ona verilir. **swap()** fonksiyonu her iki koltuğun işlemini sonlandırır. Aşağıdaki koşullar sağlandığında **swap()** kullanılmalıdır:

- Her iki koltuk da aynı ****'ü kullanır.
- Her iki koltuğun istekleri diğer koltuktan karşılanabilir.
- Daha fazla koltuk etkileşimi istenmiyor.

Eğer iki koltuk da ticaret yapabiliyorsa, uyumlu varlıklarını takas ederler ve her iki koltuktan çıkarlar. Mesaj olarak **Teklif kabul edildi. Kontrat tamamlandıktan sonra lütfen ödemelerinizi kontrol edin** döner.

Herhangi bir fazlalık, fazlalığı elinde tutan koltukta kalır. Örneğin, **seat** A 5 Quatloos verirse ve **seat** B sadece 3 Quatloos isterse, **seat** A 2 Quatloos tutar.

Takas başarısız olursa, varlık transfer edilmez ve hem _leftSeat_ hem de _rightSeat_ çıkılır.

```js
import { swap } from '@agoric/zoe/src/contractSupport.js';

swap(zcf, firstSeat, secondSeat);
```

## swapExact(zcf, leftSeat, rightSeat)

- **zcf**: ****
- **leftSeat**: ****
- **rightSeat**: **ZCFSeat**
- Dönüş: **defaultAcceptanceMsg**

Her iki koltuk için, bir koltuğun istediği her şey, diğer koltuktan alınarak ona verilir. **swapExact()** her iki koltuğu çıkarır. Aşağıdaki koşullar sağlandığında **swapExact()** kullanılmalıdır:

- Her iki koltuğun istekleri diğer koltuktan karşılanabilir.
- Daha fazla koltuk etkileşimi istenmiyor.

**swap()** fonksiyonundan farklı olarak, _leftSeat_ ve _rightSeat_ aynı ****'ü kullanmak zorunda değildir.

**swapExact()**, her iki koltuğun, her şeyi kazanması ve vermek istedikleri her şeyi kaybetmesi durumunda başarılı olan **swap()**'in özel bir durumudur. Bu, yalnızca her koltuğun diğer koltuktan istediği her şeyi istediği ve kaybettiği durumlar için uygundur. Bu yöntemin avantajı, her koltuğun **Keywords**'ünün önemli olmamasıdır.

Eğer iki koltuk ticaret yapabiliyorsa, uyumlu varlıklarını takas ederler ve her iki koltuktan çıkarlar. Mesaj olarak **Teklif kabul edildi. Konrat tamamlandıktan sonra lütfen ödemelerinizi kontrol edin** döner.

Takas başarısız olursa, varlık transfer edilmez ve hem _leftSeat_ hem de _rightSeat_ çıkar.

```js
import { swapExact } from '@agoric/zoe/src/contractSupport/index.js';

const swapMsg = swapExact(zcf, zcfSeatA, zcfSeatB);
```

## fitProposalShape(seat, proposalShape)

- **seat**: ****
- **proposalShape**: ****
- Dönüş: Yok.

Koltuk teklifinin _proposalShape_ argümanına göre kontrol eder. Öneri _proposalShape_ ile eşleşmiyorsa, koltuk çıkarılacak ve tüm **** iade edilecektir.

## assertProposalShape(seat, expected)

- **seat**: ****
- **expected**: **ExpectedRecord**
- Dönüş: Yok.

**Not: `assertProposalShape`'in çoğu kullanımı, `zcf.makeInvitation()` içinde `proposalShape` argümanı kullanılarak daha iyi ifade edilir.** 

Koltuk teklifinin, hangi tür bir teklifin kabul edilebilir olduğunu söyleyen bir _expected_ kaydına göre kontrol eder.

"şekil" ile, teklifin **give**, **want** ve **exit** kuralı ****'lerinin _expected_ içindekilere eşit olması gerekmektedir. **exit** kuralı **Keywords**'leri _expected_ içinde isteğe bağlıdır. Ayrıca, bu **Keywords**'lerin hiçbirine karşı değer kontrol edilmez.

Bu **ExpectedRecord**, bir **Proposal**'a benzer, ancak **want** ve **give** içindeki miktarlar **null** olmalıdır; **exit** maddesi, **null** içeriğe sahip bir kuralla belirtilmelidir. Eğer istemci, bu beklentilere uymayan bir **Proposal** sunuyorsa, o **proposal** reddedilir (ve iade edilir).

```js
import { assertProposalShape } from '@agoric/zoe/src/contractSupport/index.js';

const sellAssetForPrice = harden({
  give: { Asset: null },
  want: { Price: null }
});
const sell = seat => {
  assertProposalShape(seat, sellAssetForPrice);
  buySeats = swapIfCanTradeAndUpdateBook(buySeats, sellSeats, seat);
  return 'Ticaret Başarılı';
};
```

## assertNatAssetKind(zcf, brand)

- **zcf**: ****
- **brand**: ****
- Dönüş: **Boolean**

_Brand_’in  olduğunu doğrular. Bu, ilgili ****'in fungible varlıklar oluşturduğu anlamına gelir.

Eğer **false** dönerse, **brand must be AssetKind.NAT** mesajı ile hata verir.

```js
import { assertNatAssetKind } from '@agoric/zoe/src/contractSupport/index.js';

assertNatAssetKind(zcf, quatloosBrand);
```

## depositToSeat(zcf, recipientSeat, amounts, payments)

- **zcf**: ****
- **recipientSeat**: ****
- **amounts**: ****
- **payments**: **PaymentPKeywordRecord**
- Dönüş: **Promise&lt;String>**

Ödemeleri yatırarak, bunların miktarlarının bir koltuğa yeniden tahsis edilmesini sağlar. **amounts** ve **payments** kayıtları, karşılık gelen ****'lere sahip olmalıdır.

Eğer koltuk çıkmışsa, **The recipientSeat cannot have exited.** mesajı ile işlem durdurulur.

Başarı durumunda, varsayılan olarak **Deposit and reallocation successful.** olan çıkarılabilir **depositToSeatSuccessMsg** döner.

```js
import { depositToSeat } from '@agoric/zoe/src/contractSupport/index.js';

await depositToSeat(
  zcf,
  zcfSeat,
  { Dep: quatloos(2n) },
  { Dep: quatloosPayment }
);
```

## withdrawFromSeat(zcf, seat, amounts)

- **zcf**: ****
- **seat**: ****
- **amounts**: ****
- Dönüş: **Promise&lt;PaymentPKeywordRecord>**

Bir koltuktan ödemeleri çeker. Not: Ödemeleri çekmek için miktarların, koltuğun teklif güvenliğini ihlal etmemesi gerektiği ve ihlal edemeyeceği durumdur. **amounts** ve **payments** kayıtları, karşılık gelen ****'lere sahip olmalıdır.

Eğer koltuk çıkmışsa, **The seat cannot have exited.** mesajı ile işlem durdurulur.

**depositToSeat()**’ten farklı olarak, bir **PaymentPKeywordRecord** döner, başarı mesajı değil.

```js
import { withdrawFromSeat } from '@agoric/zoe/src/contractSupport/index.js';

const paymentKeywordRecord = await withdrawFromSeat(zcf, zcfSeat, {
  With: quatloos(2n)
});
```

## saveAllIssuers(zcf, issuerKeywordRecord)

- **zcf**: ****
- **issuerKeywordRecord**: **IssuerKeywordRecord**
- Dönüş: **Promise&lt;PaymentPKeywordRecord>**

Tüm vericileri, **IssuersKeywordRecord** içinde ZCF'ye kaydeder;  yöntemini kullanır.

Eğer herhangi bir **** zaten mevcutsa hata vermez. Eğer **Keyword** zaten mevcutsa, yoksayılır.

```js
import { saveAllIssuers } from '@agoric/zoe/src/contractSupport/index.js';

await saveAllIssuers(zcf, { G: gIssuer, D: dIssuer, P: pIssuer });
```

## offerTo(zcf, invitation, keywordMapping, proposal, fromSeat, toSeat, offerArgs)

- **zcf**: ****
- **invitation**: **ERef&lt;>**
- **keywordMapping**: **KeywordRecord**
- **proposal**: **Proposal**
- **fromSeat**: ****
- **toSeat**: **ZCFSeat**
- **offerArgs**: **Object**
- Dönüş: **OfferToReturns**

**offerTo()**, mevcut kontrat örneğinizden ("contractA" olarak adlandırabiliriz) başka bir kontrat örneğine ("contractB" olarak adlandırabiliriz) bir teklif yapar. ContractA'daki _fromSeat_’ten teklif ödemelerini çeker ve herhangi bir ödemeyi _toSeat_’e aktarır; bu da bir ContractA koltuğudur. Not: _fromSeat_ ve _toSeat_ aynı koltuk olabilir, varsayılan durumdur (yani _toSeat_’in değeri varsayılan olarak _fromSeat_’dir). **offerTo()**, bir kontrat örneğinden diğerine teklif yapmak için kullanılabilir; bu, _fromSeat_’in teklif güvenliğini ihlal etmeden para çekmesine izin verdiği sürece geçerlidir. Açık olmak gerekirse, bu, contractA ve contractB'nin aynı kontratın örneği olmasına gerek olmadığı anlamına gelir.

_zcf_, contractA'nın Zoe kontrat boyutudur. _invitation_ parametresi, contractB'ye bir **Invitation**'dır. _proposal_ parametresi, contractB’ye yapılan teklifin teklif kısmıdır.

_keywordMapping_ parametresi, contractA'daki ****’lerin, contractB'deki **Keywords**'lere eşlendiği bir kayıttır. Not: contractA'ya ödemelerin yatırılacağı yol, bu eşlemeyi ters çevirir. **Keywords**'ler, **Keyword** adındaki "A" veya "B" ile belirtilen kontratlara aittir.

```js
// contractA'daki anahtar kelimeleri contractB'deki anahtar kelimelere eşleştir
const keywordMapping = harden({
  TokenA1: 'TokenB1',
  TokenA2: 'TokenB2'
});
```

_offerArgs_ ise, contractB’nin kontrat kodunun **offerHandler**'ına ek argümanlar geçirmek için kullanılacak bir nesnedir. Hangi argümanların _offerArgs_ içinde yer alması gerektiği, söz konusu kontrata bağlıdır; her kontrat, gerektiği takdirde ek argümanlar tanımlayabilir. Belirli bir kontrat için ek argümanlar tanımlanmadıysa, _offerArgs_ argümanı tamamen atlanabilir. Kontrat kodunun _offerArgs_ içindeki beklenmedik veya eksik argümanlara nasıl yanıt vereceği kendine bağlıdır.

Kontrat kodu, _offerArgs_ ile etkileşime girerken dikkatli olmalıdır. Bu değerler doğrudan kullanıcıdan geldiği için, kullanılmadan önce girdi doğrulaması gereklidir ve kötü niyetli davranış göstermeleri mümkündür.

**OfferToReturns** dönüş değeri, diğer kontrata olan teklif için **userSeat** içeren bir nesne ve **deposited** adında, ödemenin **toSeat**'e yatırıldığı zaman çözülecek bir vaadi içermektedir. İki özelliği vardır:

- **userSeatPromise**: **Promise&lt;UserSeat>**
- **deposited**: **Promise&lt;AmountKeywordRecord>**

```js
const { userSeatPromise: AMMUserSeat, deposited } = zcf.offerTo(
  swapInvitation,
  keywordMapping, // {}
  proposal,
  fromSeat,
  lenderSeat
);
```

## prepareRecorderKitMakers(baggage, marshaller)

Dayanıklı PublishKit ve Recorder türleri için kolaylık sağlayan bir sarmalayıcıdır.

::: tip

Bu iki dayanıklı türü tanımlar. Her bir kayıt için en fazla bir kez çağrılmalıdır.

:::

- `makeRecorderKit`, bir Exo durumunda tutulabilecek dayanıklı bir `RecorderKit` oluşturmak için uygundur.
- `makeERecorderKit`, senkronize bir şekilde döndürmesi gereken ama kaydediciyi erteleyebilen kapanışlar için tasarlanmıştır.

```js
@param {import('@agoric/vat-data').Baggage} baggage
@param {ERef} marshaller
```

Kaynak: 