---
title: Zoe Service
---



Zoe, akıllı sözleşmelerin dağıtımı ve yönetimi için bir çerçeve sağlar. Bu, uzun süreli ve iyi bir şekilde güvenilen bir hizmet olarak erişilir ve kullanılan sözleşmeler için teklif güvenliğini sağlar. Zoe, tüm ömrü boyunca tek bir ****'a sahiptir. Zoe’ye referans veren bir kullanıcı, **InvitationIssuer**’ı alabilir ve dolayısıyla kendisine gelen herhangi bir ****'nun geçerliliğini doğrulayabilir.

::: tip Zoe'ye asenkron erişim
Zoe hizmeti, JavaScript'e uzaktan referans olarak kullanılan standart bir kütüphane uzantısı aracılığıyla asenkron olarak erişilir. Kodda, Zoe hizmet örneği **Zoe** üzerinden referans gösterilir ve bu yalnızca asenkron çağrıları destekler. İşlemler,  kullanılarak asenkron olarak tetiklenir. Tüm bu işlemler, sonuçları için hemen bir `Promise` döner. Bu, sonunda yerel bir değere veya başka bir uzak nesneye (örneğin, başka bir sözleşme veya hizmette, başka bir zincirde çalışıyor olabilir) ait bir **Presence**'a karşılık gelebilir. Asenkron mesajlar, **E** kullanılarak ya `Promise`ler ya da presenslerle gönderilebilir.

**E** kullanımı hakkında daha fazla bilgi için 'ne bakın.
:::

## E(Zoe).getBrands(instance)

- **instance**: ****
- Dönüş: **Promise&lt;BrandKeywordRecord>**

**instance** argümanında tanımlı tüm ****'u içeren bir **BrandKeywordRecord** için bir **Promise** döner.

Bir **BrandKeywordRecord**, anahtarların **** olduğu ve değerlerin belirli **** için **Brands** olduğu bir nesnedir.

```js
// Kayıt örneği
const brandKeywordRecord = {
  FirstCurrency: quatloosBrand,
  SecondCurrency: moolaBrand
  // vb.
};
```

```js
// Çağrı örneği
const brandKeywordRecord = await E(Zoe).getBrands(instance);
```

## E(Zoe).getIssuers(instance)

- **instance**: ****
- Dönüş: **Promise&lt;IssuerKeywordRecord>**

**instance** argümanında tanımlı tüm ****'ı içeren bir **IssuerKeywordRecord** için bir **Promise** döner.

Bir **IssuerKeywordRecord**, anahtarların **** olduğu ve değerlerin **Issuers** olduğu bir nesnedir.

```js
// Kayıt örneği
const issuerKeywordRecord = {
  FirstCurrency: quatloosIssuer,
  SecondCurrency: moolaIssuer
};
```

```js
// Çağrı örneği
const issuerKeywordRecord = await E(Zoe).getIssuers(instance);
```

## E(Zoe).getTerms(instance)

- **instance**: ****
- Dönüş: **Promise&lt;Object>**

**instance** argümanına ait şartları, içindeki ****, **** ve herhangi bir özel şart dâhil olmak üzere döndürmek için bir **Promise** sağlar. Dönen değerler şöyle görünür:

```js
{
  // Brands ve issuers anahtar kayıtlarıdır
  brands: { A: moolaKit.brand, B: simoleanKit.brand },
  issuers: { A: moolaKit.issuer, B: simoleanKit.issuer },
  customTermA: 'bir şey',
  customTermB: 'başka bir şey',
  // Diğer tüm customTerms
};
```

```js
const terms = await E(Zoe).getTerms(instance);
```

## E(Zoe).getPublicFacet(instance)

- **instance**: ****
- Dönüş: **Promise&lt;PublicFacet>**

**instance** argümanı için tanımlı **PublicFacet** için bir **Promise** döner.

Bir sözleşme örneğinin **PublicFacet**'i, Zoe aracılığıyla bilgilere erişimi olan bir nesnedir. Bu, genel sorgular ve eylemler yapmak için kullanılır; örneğin, güncel bir fiyat almak veya genel **** oluşturmak için. Bir facet, herhangi bir başka nesne gibi tanımlandığı için, sözleşme, **PublicFacet** üzerine yöntemler ekler.

```js
const ticketSalesPublicFacet = await E(Zoe).getPublicFacet(sellItemsInstance);
```

## E(Zoe).getInvitationIssuer()

- Dönüş: **Promise&lt;>**

Zoe örneği için **InvitationIssuer** için bir **Promise** döner.

```js
const invitationIssuer = await E(Zoe).getInvitationIssuer();
// Burada Bob, Alice'den güvenilmeyen bir davet almıştır.
// Bob, güvenilen **InvitationIssuer**'ı kullanarak
// güvenilmeyen daveti güvenilir bir davete dönüştürür
const trustedInvitation = await invitationIssuer.claim(untrustedInvitation);
const { value: invitationValue } =
  await E(invitationIssuer).getAmountOf(trustedInvitation);
```

## E(Zoe).getInvitationDetails(invitation)

- **invitation**: ****
- Dönüş: **Promise&lt;Object>**

Bir **Invitation** alır ve bu davetle ilgili aşağıdaki detayları içeren bir nesne için bir **Promise** döner:

- **installation**: **Installation**: Sözleşmenin Zoe kurulumu.
- **instance**: ****: Bu davetin ait olduğu sözleşme örneği.
- **invitationHandle**: ****: Bu **Invitation**'a atıfta bulunmak için kullanılan bir **Handle**.
- **description**: **String**: Bu **Invitation**'ın amacını tanımlar. Sözleşmedeki rolüyle eşleşmesi için kullanılır.

```js
const invitation = await invitationIssuer.claim(untrustedInvitation);
const invitationValue = await E(Zoe).getInvitationDetails(invitation);
```

## E(Zoe).install(bundle)

- **bundle**: **SourceBundle**
- Dönüş: **Promise&lt;Installation>**

Bir Zoe sözleşmesi için paketlenmiş kaynak kodunu argüman olarak alır ve bu kodu Zoe'ye kurar.
Bir **Installation** nesnesi için bir **Promise** döner.

```js
// bundleSource, kaynak kodu dosyalarını alır ve
// bunları kurulumun beklediği formatta bir araya getirir.
import bundleSource from '@endto/bundle-source';
const bundle = await bundleSource(pathResolve(`./src/contract.js`));
const installationP = await E(Zoe).install(bundle);
```

## E(Zoe).getConfiguration()

- Dönüş: **Promise&lt;Object>**

Ücret vericisi hakkında bilgi döndürmek için bir **Promise** sağlar.
(IST basabilen **** ile ilişkili **Issuer**.)
Bu, vericinin adı, varlık türü ve gösterim bilgilerini içerir.

## E(Zoe).getFeeIssuer()

- Dönüş: **Promise&lt;>**

IST basabilen **** ile ilişkili **Issuer** için bir **Promise** döner.

## E(Zoe).getOfferFilter(instance)

- **instance**: ****
- Dönüş: **Array&lt;String>**

Varsa, devre dışı bırakılmış tüm teklif ****'ları döner. Teklif **Keywords**'ları, bazı şekillerde problem yaratmaları durumunda devre dışı bırakılabilir veya istenmeyen davranışları debug etmek için kullanılabilir.

## E(Zoe).getInstance(invitation)

- **invitation**: ****
- Dönüş: **Promise&lt;>**

**Invitation**'ın ait olduğu sözleşme **instance**'ı için bir **Promise** döner.

**Instances** opak nesneler olsa da, bunlar hakkında bilgi edinmek için aşağıdaki yöntemler kullanılabilir:

- **getBrands()**
- **getTerms()**
- **getIssuers()**
- **getPublicFacet()**

```js
const instance = await E(Zoe).getInstance(invitation);
```

## E(Zoe).getProposalShapeForInvitation(invitation)

- **invitation**: ****
- Dönüş: **Promise&lt;>**

**Invitation**'ın **Teklif**'ine göre şekil döndüren bir **Promise** sağlar.
Ayrıca  bölümüne de bakabilirsiniz.

## E(Zoe).getInstallation(invitation)

- **invitation**: ****
- Dönüş: **Promise&lt;Installation>**

Davetin sözleşme örneğinin kullandığı sözleşme **kurulumunu** döndüren bir **Promise** sağlar.

```js
const installation = await E(Zoe).getInstallation(invitation);
```

## E(Zoe).getInstallationForInstance(instance)

- **instance**: ****
- Dönüş: **Promise&lt;Installation>**

**instance** tarafından kullanılan sözleşme **kurulumunu** döndürmek için bir **Promise** sağlar. Bir **instance**, çalışan, yürütülen sözleşmenin benzersiz tanımlayıcısıdır. **Kurulum**, temel kodun benzersiz tanımlayıcısıdır. Bu yöntem, çalışan bir sözleşme **instance**'ının temel kodunu incelemek için bir süreçte kullanılabilir.

```js
const installation = await E(Zoe).getInstallationForInstance(instance);
```

## E(Zoe).startInstance(installation, issuerKeywordRecord?, terms?, privateArgs?)

- **installation**: **ERef&lt;Installation>**
- **issuerKeywordRecord**: **IssuerKeywordRecord** - Opsiyonel.
- **terms**: **Object** - Opsiyonel.
- **privateArgs**: **Object** - Opsiyonel.
- Dönüş: **Promise&lt;StartInstanceResult>**

**installation** argümanı tarafından belirtilen yüklü akıllı sözleşmenin bir örneğini oluşturur. Tüm sözleşmeler, kendi versiyonu ile yeni bir vat içinde çalıştırılır. Zoe Sözleşme Özelliğini içeren bir vat vardır.

**issuerKeywordRecord**, ****'ları ****'lara eşleyen isteğe bağlı bir nesnedir; örneğin **FirstCurrency: quatlooIssuer**. Sözleşmedeki taraflar, tekliflerini ve ödemelerini dizinlemek için **Keywords**'ı kullanacaktır.

**terms**, bu sözleşme örneği tarafından kullanılan değerlerdir; örneğin, bir açık artırmanın kapanmadan önce bekleyeceği teklif sayısı. Bu değerler, aynı sözleşmenin farklı örnekleri için farklı olabilir, ancak sözleşme hangi değişkenlerin **terms** olarak geçirilmesi gerektiğini tanımlar.

**privateArgs**, isteğe bağlıdır. Buraya, sözleşme koduna erişilebilir olması gereken ancak genel şartlarda olmaması gereken herhangi bir değeri içeren bir nesne kaydı geçirin. Örneğin, minting yetkisini birden fazla sözleşme arasında paylaşmak için aşağıdakini **privateArgs** olarak geçirin:

```js
const privateArgs = { externalMint: myExternalMint };
```

Bir **StartInstanceResult** nesnesi için bir **Promise** döner. Nesne şunları içerir:

- **adminFacet**: **AdminFacet**
- **creatorFacet**: **herhangi bir**
- **publicFacet**: **herhangi bir**
- **instance**: **Instance**
- **creatorInvitation**: **Payment | undefined**

**adminFacet**, bir yönteme sahiptir:

- **getVatShutdownPromise()**
  - Bu yeni başlatılan örnek sona erdiğinde, nedeni (değer **fail(reason)** olarak geçildi) veya tamamlanması (değer **exit(completion)** olarak geçildi) ile çözülmesi için bir `Promise` döner.

Bir **publicFacet**, bir Zoe örneği ile bilgilere erişimi olan bir nesnedir. **publicFacet**, genel sorgular ve eylemler için kullanılır; örneğin güncel bir fiyat almak veya genel **** oluşturmak için. Bir facet, herhangi bir başka nesne gibi tanımlandığı için, sözleşme geliştiricisi bunlara, herhangi bir nesne gibi yöntemler ekleyebilir.

**creatorFacet**, yalnızca bu döndürme değerinde (yani yalnızca bir sözleşme örneği oluşturma sırasında) kullanılabilir. Sözleşme tasarımcısı, sözleşme yürütücüsünün paylaşmak istemeyebileceği veya dağılımını kontrol etmek isteyebileceği şeyleri kapsüllemek için bunu kullanmalıdır. Sözleşmeyi başlatan taraf, **creatorFacet**'e erişimi paylaşmanın etkisini dikkatlice düşünmelidir.

**creatorInvitation**, sözleşme örneği yaratıcısının kullanabileceği bir **Invitation**'dır. Genellikle yaratıcının hemen bir şeyi (açık artırmalar, takaslar, vb.) satması gerektiği sözleşmelerde kullanılır, bu nedenle yaratıcının bir malı güvence altına alıp satması için bir **Invitation**'a sahip olması yararlıdır. Unutmayın ki Zoe **Invitations** bir **Payment** olarak temsil edilir.

```js
const issuerKeywordRecord = {
  Asset: moolaIssuer,
  Price: quatlooIssuer
};
const terms = { numBids: 3 };
const { creatorFacet, publicFacet, creatorInvitation } = await E(
  Zoe
).startInstance(installation, issuerKeywordRecord, terms);
```



## E(Zoe).offer(invitation, proposal?, paymentPKeywordRecord?, offerArgs?)

- **invitation**: ** | Promise&lt;>**
- **proposal**: **** - Opsiyonel.
- **paymentPKeywordRecord**: **** - Opsiyonel.
- **offerArgs**: **** - Opsiyonel.
- Dönüş: **Promise&lt;>**

**invitation**'ı yaratan sözleşmeye teklif vermek için kullanılır.



### Teklifler

**proposal**, ya `undefined` ya da **give**, **want** ve/veya **exit** özelliklerini içeren bir kayıt olmalıdır; bu özellikler, verilen, istenen ve teklifin iptal edilme zamanı hakkında koşulları ifade eder. Sözleşmenin teklifi kabul etme zorunluluğu olmadığını unutmayın; teklifi inceleyebilir ve herhangi bir nedenle reddedebilir (bu durumda tüm ödemeler zamanında iade edilir).

```js
const myProposal = harden({
  give: { Asset: AmountMath.make(quatloosBrand, 4n) },
  want: { Price: AmountMath.make(moolaBrand, 15n) },
  exit: { onDemand: null }
});
```

**give** ve **want**, sözleşme tarafından tanımlanan **** kullanır. Yukarıdaki örnekte, "Asset" ve "Price" anahtar kelimeleridir. Ancak, bir açık artırma sözleşmesinde, anahtar kelimeler "Asset" ve "Bid" olabilir.

**exit**, teklifin nasıl iptal edilebileceğini belirtir. Üç şekilden birine uymalıdır:

- `{ onDemand: null }`: (Varsayılan) Teklif veren taraf, talep üzerine iptal edebilir.
- `{ waived: null }`: Teklif veren taraf iptal edemez ve teklifini bitirmek (tamamlamak veya başarısız olmak) için tamamen akıllı sözleşmeye güvenir.
- `{ afterDeadline: deadlineDetails }`: Teklif, bir zamanlayıcının **timer** ve **deadline** özelliklerine göre belirlenen bir zaman aşıldığında otomatik olarak iptal edilir. Teklif veren, son tarihten önce koltuğundan çıkamaz (koltuk **waived** durumundadır), ancak sözleşme, teklif verenin koltuğundan erken çıkabilir. **timer**, bir zamanlayıcı olmalıdır ve **deadline**, onun tarafından anlaşılan bir zaman damgası olmalıdır. (Bazı zamanlayıcılar Unix epoch zamanını kullanırken, diğerleri blok yüksekliğini sayar.) Daha fazla bilgi için 'ne bakın.

Bir sözleşme geçersiz teklifleri önleyebilir;  kısmına bakabilirsiniz.

### Ödemeler

**paymentPKeywordRecord**, ya `undefined` ya da Zoe tarafından güvence altına alınacak gerçek **ödemeleri** içeren bir **** olmalıdır.
Her **Keyword** için **give**, karşılık gelen bir **ödemeye** sahip olmalıdır.

```js
const paymentKeywordRecord = harden({ Asset: quatloosPayment });
```



### Teklif Argümanları

**offerArgs**, davetle ilişkili **offerHandler** sözleşme koduna ek argümanlar iletmek için kullanılabilecek isteğe bağlı bir CopyRecord'dur. Her sözleşme, desteklediği ve zorunlu olan nitelikleri tanımlayabilir.

## E(Zoe).installBundleID(bundleId)

- **bundleId**: **BundleId**
- Dönüş: **Promise&lt;Installation>**

Gelecekteki kullanım için ayrılmıştır.

## E(Zoe).getBundleIDFromInstallation(installation)

- **installation**: **Installation**
- Dönüş: **Promise&lt;BundleId>**

Gelecekteki kullanım için ayrılmıştır.