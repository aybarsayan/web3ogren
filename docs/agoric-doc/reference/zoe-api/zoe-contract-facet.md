---
title: Zoe Kontrat Yüzeyi (ZCF)
---



Zoe Kontrat Yüzeyi (ZCF), bir çalışan kontrat örneğinin Zoe durumuna erişmek için kullanılan bir API nesnesidir. ZCF, genellikle kontrat içinden senkronize olarak erişilir ve kodda **zcf** olarak adlandırılır.

Kontrat örneği, **E(Zoe).startInstance()** ile başlatılır ve bu başlatma sırasında **zcf** nesnesine erişim sağlanır (bkz. ). Aşağıdaki işlemlerde, **instance** çalışan kontrat örneği için bir referans olmaktadır.

## zcf.atomicRearrange(transfers)

- **transfers**: **Array&lt;>**
- Dönüş: Yok.

Zoe'den, _transfers_ içinde belirtilen koltuklar arasındaki ****ı yeniden düzenlemesini ister. _transfers_, **Dağılımları** değiştirmek için bir dizi değişikliktir ve birkaç kısıtı karşılaması gerekir. Eğer bu kısıtların hepsi karşılanıyorsa, yeniden tahsis işlemi atomik olarak gerçekleşir. Aksi takdirde bir hata fırlatılır ve önerilen değişikliklerin hiçbiri etkili olmaz. Kısıtlar şunlardır:

- Belirtilen tüm koltuklar hala aktiftir.
- Belirtilen koltuklar için bekleyen herhangi bir sahneleme yoktur.

  Sahnelemeler, bu **atomicRearrange()** fonksiyonunun yerine geçmiş bir yeniden tahsis mekanizmasıdır. Karışıklığı önlemek için, her bir yeniden tahsis ya eski yöntemle ya da yeni yöntemle ifade edilebilir, karışık bir şekilde değil.

- Genel korunma sağlanmalıdır. Diğer bir deyişle, yeniden tahsis edilen **** dengelenmelidir.
- Teklif Güvenliği, her koltuk için korunur. Yani, yeniden tahsisler, yalnızca teklifin istediği bölümünde belirtilen varlıkları alması veya teklifin verilme bölümünde belirtilen tüm varlıkları koruması durumunda bir koltuktan varlık alabilir. Bu kısıt, tüm atomik yeniden düzenleme boyunca her koltuktan uygulanır, bireysel **TransferParts** için geçerli değildir.

_Lütfen dikkat edin_ ki, _transfers_ dizisini elle oluşturabilir veya yalnızca bir koltuk içeren transferler için, yalnızca belirli alanların bir alt kümesini kullanan **** ve **** yardımcı işlevlerini kullanarak **TransferParts** oluşturabilirsiniz.

## zcf.makeZCFMint(keyword, assetKind?, displayInfo?)

- **keyword**: ****
- **assetKind**: **** - Opsiyonel, varsayılan **AssetKind.NAT**.
- **displayInfo**: **** - Opsiyonel, varsayılan **undefined**.
- Dönüş: **Promise&lt;>**

Senkronize bir Zoe minti oluşturur, böylece kullanıcılar dijital varlıkları senkronize olarak mintleyebilir ve yeniden tahsis edebilir, bu da asenkron ERTP **** kullanmak yerine tercih edilir. Opsiyonel _displayInfo_ parametresi, oluşturulan mintin markasıyla ilişkilendirilmiş değerlerin nasıl görüntüleneceğini belirten **decimalPlaces: 16** gibi değerleri alır. Varsayılan değer **undefined**'dır.

**Önemli**: **ZCFMints**, ERTP **Mint** ile aynı yöntemlere sahip değildir. Bir **ZCFMint** üzerinde ERTP yöntemlerini kullanmaya çalışmayın veya bunun tersini yapmayın.

**Önemli**: Öte yandan, **** ve ****, bir **zcfMint** ile ilişkili olarak ERTP kökenli karşıtlarıyla aynı yöntemlere sahiptir. Bir **zcfMint** tarafından oluşturulan varlıklar, ERTP **Mint** yöntemleri tarafından oluşturulan varlıklarla aynı şekilde işlenir.

Aşağıda **zcf.makeZCFMint** örneği gösterilmektedir:

**Not**: **ZCFMint** oluşturma çağrısı asenkron iken, elde edilen **ZCFMint** üzerindeki çağrılar senkronizedir.

```js
const mySynchronousMint = await zcf.makeZCFMint('MyToken', AssetKind.COPY_SET);
const { brand, issuer } = mySynchronousMint.getIssuerRecord();
mySynchronousMint.mintGains({ myKeyword: amount }, seat);
```

## zcf.getInvitationIssuer()

- Dönüş: **Promise&lt;>**

Zoe örneği için **InvitationIssuer**'ı döner.

```js
const invitationIssuer = await zcf.getInvitationIssuer();
```

## zcf.saveIssuer(issuer, keyword)

- **issuer**: ****
- **keyword**: ****
- Dönüş: **Promise&lt;IssuerRecord>**

Zoe'ye bir **Verici** hakkında bilgi verir ve **Verici** eklendiğinde ve hazır olduğunda onay için bir vaatte bulunur. _keyword_, yeni **Verici** ile ilişkili olanıdır. Bu yöntem, yeni **Verici**nin bir **IssuerRecord**'ını döndürmek için bir vaatte bulunur.

Bu, Zoe'nin bu kontrat **örneği** için kayıtlarını korumak üzere bir **Verici** kaydetmesini sağlar. Ayrıca, **Verici**nin bilgileri böylece Zoe, bu **Verici** ile ilgili teklifleri işleyebilir ve ZCF gerektiğinde **VericiRecord**'u senkronize olarak sağlayabilir.

Bir **IssuerRecord**, her biri kaydın **Verici** değerine karşılık gelen nesneyi tutan iki alandan oluşur: **IssuerRecord.brand** ve **IssuerRecord.issuer**.

```js
await zcf.saveIssuer(secondaryIssuer, keyword);
```



## zcf.makeInvitation(offerHandler, description, customDetails?, proposalShape?)

- **offerHandler**: **(seat: ZCFSeat, offerArgs?: CopyRecord) => any**
- **description**: **Dize**
- **customDetails**: **Nesne** - Opsiyonel.
- **proposalShape**: **** - Opsiyonel.
- Dönüş: **Promise&lt;>**

Zoe **** kullanarak bir akıllı kontrat için geçerli bir **Davet** oluşturur. Dönen **Davet**'in **miktarı** aşağıdakileri belirtir:

- Belirli kontrat **örneği**.
- Zoe **kurulumu**.
- Benzersiz bir ****.

**offerHandler**, bir **ZCFSeat** ve (sadece mevcutsa) **offerArgs** kabul eden gerekli bir işlevdir; bu, yalnızca  çağrıldığında sağlanır ve keyfi teklif sonuçları döndürür.

**description**, **Davet**'i tanımlayan gerekli bir dize olup, **Davet**'in alıcı tarafından ayırt edilebilmesi için gereken tüm bilgileri içermelidir. Her açıklama, kaynak metin içinde benzersiz bir dize olmalı ve belirli bir türde davet oluşturmada yalnızca argüman olarak kullanılmalıdır.

Opsiyonel **customDetails** argümanı **Davet**'in **miktarı** içinde yer alır ve başka şekilde Zoe tarafından kullanılmaz.

Opsiyonel **proposalShape** argümanı, her teklifin gerekli ve izin verilen bileşenlerini tanımlamak için kullanılabilir.

### Teklif Biçimleri

Desene uymayan teklifler, Zoe tarafından kontrata bile gönderilmeden reddedilir.

Desenler genellikle **** ('''M''' eşleşmesi) nesnesi kullanarak oluşturulur. **proposalShape** genellikle  ile oluşturulur. Örneğin bir kapalı çağrı yaparken, teklif eden tarafın iptal edemeyeceğini ifade etmek için:

```js
import { M } from '@endo/patterns';

const waivedExitProposalShape = M.splitRecord(
  // gerekli özellikler
  { exit: { waived: null } },
  // opsiyonel özellikler
  { give: M.record(), want: M.record() },
  // bilinmeyen özellikler
  M.record()
);
const creatorInvitation = zcf.makeInvitation(
  makeCallOption,
  'makeCallOption',
  undefined,
  waivedExitProposalShape
);
```

Tam detaylar,  paketindedir. İşte kullanışlı bir referans:

```js
interface PatternMatchers {
    and: ((...subPatts) => Matcher);
    any: (() => Matcher);
    array: ((limits?) => Matcher);
    arrayOf: ((subPatt?, limits?) => Matcher);
    bag: ((limits?) => Matcher);
    bagOf: ((keyPatt?, countPatt?, limits?) => Matcher);
    bigint: ((limits?) => Matcher);
    boolean: (() => Matcher);
    eq: ((key) => Matcher);
    eref: ((subPatt) => any);
    error: (() => Matcher);
    gt: ((rightOperand) => Matcher);
    gte: ((rightOperand) => Matcher);
    key: (() => Matcher);
    kind: ((kind) => Matcher);
    lt: ((rightOperand) => Matcher);
    lte: ((rightOperand) => Matcher);
    map: ((limits?) => Matcher);
    mapOf: ((keyPatt?, valuePatt?, limits?) => Matcher);
    nat: ((limits?) => Matcher);
    neq: ((key) => Matcher);
    not: ((subPatt) => Matcher);
    null: (() => null);
    number: (() => Matcher);
    opt: ((subPatt) => any);
    or: ((...subPatts) => Matcher);
    partial: ((basePatt, rest?) => Matcher);
    pattern: (() => Matcher);
    promise: (() => Matcher);
    record: ((limits?) => Matcher);
    recordOf: ((keyPatt?, valuePatt?, limits?) => Matcher);
    remotable: ((label?) => Matcher);
    scalar: (() => Matcher);
    set: ((limits?) => Matcher);
    setOf: ((keyPatt?, limits?) => Matcher);
    split: ((basePatt, rest?) => Matcher);
    splitArray: ((required, optional?, rest?) => Matcher);
    splitRecord: ((required, optional?, rest?) => Matcher);
    string: ((limits?) => Matcher);
    symbol: ((limits?) => Matcher);
    tagged: ((tagPatt?, payloadPatt?) => Matcher);
    undefined: (() => Matcher);
}
```

## zcf.makeEmptySeatKit()

- Dönüş: **, Promise&lt;>**

Boş bir **ZCFSeat** ve bir **UserSeat** için bir **Promise** döner.

Zoe, teklifleri temsil etmek için **koltukları** kullanır ve iki koltuk yüzeyi vardır (bir nesnenin belirli bir görünümü veya API'si; bir nesne için birden fazla yüzey olabilir): **ZCFSeat** ve **UserSeat**.

```js
const { zcfSeat: mySeat } = zcf.makeEmptySeatKit();
```

## zcf.getInstance()

- Dönüş: ****

Kontrat kodu, kendi mevcut örneğini isteyebilir, böylece başka bir yere gönderilebilir.

## zcf.getBrandForIssuer(issuer)

- **issuer**: ****
- Dönüş: ****

_Gönderen_ ile ilişkili **Marka**yı döner.

## zcf.getIssuerForBrand(brand)

- **brand**: ****
- Dönüş: ****

_Brand_ argümanının **Verici**sini döner.

## zcf.getAssetKind(brand)

- **brand**: ****
- Dönüş: ****

_Brand_ argümanıyla ilişkili **Varlık Türü**nü döner.

```js
const quatloosAssetKind = zcf.getAssetKind(quatloosBrand);
```

## zcf.stopAcceptingOffers()

- Dönüş: Yok.

Kontrat, bu kontrat örneği için teklifler almaması için Zoe'den talepte bulunur. Bu, kontrat dışından çağrılamaz, yalnızca kontrat tarafından erişilebilir şekilde açıkça yapılmadıkça.

## zcf.shutdown(completion)

- **completion**: **Genellikle (ama her zaman değil) bir Dize**
- Dönüş: Yok.

Tüm vat ve kontrat örneğini kapatır ve ödeme sağlar. Mevcut **instance** ile ilişkili tüm açık **koltuklara** **fail()** çağrılır.

Şu durumlarda çağrılır:

- Kontratta başka bir şey olmasını istemediğinizde ve
- Artık teklif almak istemediğinizde.

_Completion_ argümanı genellikle bir **Dize**dir, ancak bu zorunlu değildir. Bu, kontrat örneğinin **done()** fonksiyonuna gönderilen bildirimde kullanılır. Henüz açık olan koltuklar veya diğer bekleyen vaatler, 'vat sonlandırıldı' mesajıyla kapatılır.

```js
zcf.shutdown();
```

## zcf.shutdownWithFailure(reason)

- **reason**: **Hata**
- Dönüş: Yok.

Bir hata nedeniyle tüm vat ve kontrat örneğini kapatır. Mevcut **instance** ile ilişkili tüm açık **koltuklara** **fail()** çağrılır.

_Reason_ argümanı bir JavaScript hata nesnesidir. Bu, kontrat örneğinin **done()** fonksiyonuna gönderilen bildirimde kullanılır. Henüz açık olan koltuklar veya diğer bekleyen vaatler, ilgili hata mesajıyla kapatılır.

```js
zcf.shutdownWithFailure();
```

## zcf.getTerms()

- Dönüş: **Nesne**

Mevcut kontrat **örneği** ile başlatılan ****, **** ve özel **terimleri** döner.

Döndürülen değerler şöyle görünür:

```js
{ brands, issuers, customTermA, customTermB ... }
// burada markalar ve vericiler anahtar kayıtlarıdır, yani:

{
  brands: { A: moolaKit.brand, B: simoleanKit.brand },
  issuers: { A: moolaKit.issuer, B: simoleanKit.issuer },
  customTermA: 'bir şey',
  customTermB: 'başka bir şey'
};
```

Ayrıca bir **E(zoe).getTerms(instance)** olduğunu unutmayın. Hangi yöntemi kullanacağınız genellikle ne olduğu değil, hangi servise veya ZCF'ye erişiminiz olduğudur. Kontrat tarafında, **zcf**'ye erişiminiz daha kolaydır ve **zcf** zaten hangi örneğin çalıştığını bilir. Bu nedenle kontrat kodunda, **zcf.getTerms()** kullanırsınız. Kullanıcı tarafında, Zoe Servisi'ne erişimle, **E(zoe).getTerms()** kullanırsınız.

```js
const { brands, issuers, maths, terms } = zcf.getTerms();
```

## zcf.getZoeService()

- Dönüş: 

Bu, kullanıcıya yönelik 'ni kontrat koduna erişmenin tek yoludur.

```js
// Kontratta başka bir kontrat örneğine teklif yapmak.
const zoeService = zcf.getZoeService();
E(zoeService).offer(creatorInvitation, proposal, paymentKeywordRecord);
```

## zcf.assertUniqueKeyword(keyword)

- **keyword**: ****
- Dönüş: **Undefined**

Bir **Anahtar Kelime**'nin geçerli olup olmadığını ve bu **Örnek** içinde zaten kullanılmadığını (yani benzersiz olup olmadığını) kontrol eder. Geçerli bir **Anahtar Kelime** değilse veya benzersiz değilse uygun bir hata fırlatır.

```js
zcf.assertUniqueKeyword(keyword);
```

## zcf.setOfferFilter(strings)

- **strings**: **Array&lt;Dize>**
- Dönüş: Yok.

Davet açıklamasında herhangi birini içeren davetler için çağrılmasını yasaklar. Sonu iki nokta üst üste (`:`) ile biten her dize bir önek olarak işlenir ve açıklama dizesi bu dize ile (iki nokta üst üste dahil) başlaması durumunda **E(Zoe).offer()** geçerli olmayacak ve bir istisna fırlatılacaktır.

Birçok kontrat özel olarak bu işlevi doğrudan çağırmayacaktır. Bu, kontratın yönetim sürecinin acil eylemler alarak gerektiğinde geçerli bir şekilde işlem durdurabilmesi için tasarlanmıştır.

Engellenen dizeler, bu yöntemi yeniden çağırarak tekrar etkinleştirilebilir; yalnızca _strings_ argümanında bu dizeyi dahil etmemek gerekir.

## zcf.getOfferFilter()

- Dönüş: **Array&lt;Dize>**

Davetlerde kullanım için devre dışı bırakılan tüm dizeleri döner, eğer varsa. Bir kontratın davetleri, yönetimin bir güvenlik açığı sağladığı belirlemesi durumunda **** yöntemi ile devre dışı bırakılabilir.

::: uyarı KULLANIMDAN KALDIRILDI

## zcf.reallocate(seats)

- **seats**: **[]** (en az iki)
- Dönüş: Yok.

**zcf.reallocate()**, her bir koltuk argümanı için sahnelenmiş tahsisatları taahhüt eder ve sahnelenmiş tahsisatları mevcut tahsisatları haline getirir. **zcf.reallocate()**, Zoe'de bir koltuktan diğerine tahsis edilen varlıkları transfer eder. Önemli olan, varlıkların Zoe'de kilitlenmesi ve yalnızca her koltuk için içsel Zoe muhasebesinin tahsisatının değiştirilmesidir.

Dizi argümanında en az iki **ZCFSeats** olmalıdır. Her **ZCFSeat**'in sahnelenmiş bir tahsisi varsa, bu argüman dizisine dahil edilmelidir; aksi takdirde bir hata fırlatılır. Argüman dizisindeki herhangi bir koltukta sahnelenmiş bir tahsis yoksa, bir hata fırlatılır.

Taahhüt esnasında, sahnelenmiş tahsisatlar koltukların mevcut tahsisatları haline gelir ve sahnelenmiş tahsisatlar silinir.

Not: **reallocate()** bir _atomik işlem_’dir. Teklif güvenliğini sağlamak için, asla yarım bırakmaz. Tamamen başarısız olur veya herhangi bir koltuğun mevcut tahsisi değiştirilmeden önce başarısız olur.

Yeniden tahsis işlemi, aşağıdaki koşullar sağlanırsa başarılı olur:

1. Hakları korur (belirtilen **** mevcut toplam miktarla aynı toplam değere sahiptir).
2. Tüm taraflar için 'teklif güvenli' olmasıdır.

Yeniden tahsis, yalnızca argüman dizisindeki **koltuklar** için geçerlidir. İndüksiyonla, hak koruma ve teklif güvenliği öncesinde mevcutsa, güvenli bir yeniden tahisatta devam edecektir.

Bu, yalnızca tahsisatları değişen **koltuklar** için yeniden doğrulama yapmamız gerektiği için doğrudur. Yeniden tahsis yalnızca bu **koltuklar** için teklif güvenliğini etkiler ve değişim için haklar korunduğundan, genel haklar değişmez. 

**zcf.reallocate()** bu hatayı fırlatır:

- **yeniden tahsis en az iki koltuk üzerinde yapılmalıdır**

```js
sellerSeat.incrementBy(buyerSeat.decrementBy({ Money: providedMoney }));
buyerSeat.incrementBy(sellerSeat.decrementBy({ Items: wantedItems }));
zcf.reallocate(buyerSeat, sellerSeat);
```

**Not**: Bu yöntem kullanılmaktan kaldırılmıştır. Bunun yerine **** kullanın.
:::