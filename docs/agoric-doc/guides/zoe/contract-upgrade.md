---
title: Sözleşme Yükseltme
---

# Sözleşme Yükseltme

Bir sözleşmeyi başlatmanın sonucu, sözleşme örneğini yükseltme hakkını içerir.  çağrısı, farklı erişim seviyelerini temsil eden birkaç nesnenin kaydını döndürür. `publicFacet` ve `creatorFacet`, sözleşme tarafından tanımlanmıştır. `adminFacet` ise Zoe tarafından tanımlanır ve sözleşmeyi yükseltmeye olanak tanıyan yöntemleri içerir.

::: tip Yükseltme Yönetimi

Yükseltme hakkının yönetimi, burada yalnızca kısaca ele aldığımız karmaşık bir konudur.

-  bir sözleşme başlatma kararı aldığında  kullanarak, mevcut durumda `adminFacet`, başlangıç  nde saklanır; bu durum, BLD staker'larının daha sonraki bir `swingset.CoreEval`'de böyle bir sözleşmeyi yükseltmesine olanak tanır.
- `adminFacet` referansı atılabilir, böylece hiç kimse sözleşmeyi JavaScript VM içinden yükseltemez. (Teorik olarak, BLD staker yönetimi VM'in kendisini değiştirebilir.)
- `adminFacet`,  çerçevesi kullanılarak yönetilebilir; örneğin, `committee.js` sözleşmesini kullanarak.

:::

## Sözleşmeyi Yükseltme

Bir sözleşme örneğini yükseltmek, sözleşmeyi farklı bir  kullanarak yeniden başlatmak anlamına gelir. Varsayalım ki, daha önce zincire göndermiş olduğumuz bir paketinin ID'sini kullanarak sözleşmeyi her zamanki gibi başlatıyoruz:

```js
const bundleID = 'b1-1234abcd...';
const installation = await E(zoe).installBundleID(bundleID);
const { instance, ... facets } = await E(zoe).startInstance(installation, ...);

// ... facets.publicFacet, instance vb. gibi kullanın
```

Eğer `adminFacet`'e ve yeni bir versiyonun paket ID'sine sahipsek, `upgradeContract` yöntemini kullanarak sözleşme örneğini yükseltebiliriz:

```js
const v2BundleId = 'b1-feed1234...'; // yeni özellik içeren paket hash'ı
const { incarnationNumber } = await E(facets.adminFacet).upgradeContract(v2BundleId);
```

`incarnationNumber`, 1. yükseltmeden sonra 1, 2. yükseltmeden sonra 2 ve böyle devam eder.

::: details aynı paketi yeniden kullanma

Orijinal paketi yeniden kullanan "null yükseltme" geçerli bir işlemdir ve biriken yığın durumunu silmek için makul bir yaklaşımdır.

Ayrıca `E(adminFacet).restartContract()`'u da inceleyin.

:::

## Yükseltilebilir Sözleşmeler

Yükseltilebilir sözleşmelerin, yükseltilemeyen sözleşmelerden farklı olan birkaç gereksinimi vardır:

1. 
2. 
3. 
4. 

### Yükseltilebilir Beyan

Yeni kod paketi, `start` yerine bir `prepare` fonksiyonu ihraç ederek yükseltmeyi desteklediğini beyan eder.


  makeScalarBigMapStore('rooms', { durable: true })
);
```

`zone` API'si, dayanıklılığı yönetmek için kullanışlı bir yoldur. Depolama yöntemleri, `provide` desenini entegre eder:

::: details import { makeDurableZone } ...

 ({ id, value: 0 }), {
  // ...
  clear(delta) {
    this.state.value = 0;
  }
});
```

Arayüz koruyucusu da güncellenmelidir.
_Arayüz koruyucuları hakkında daha fazla bilgi için  inceleyin._

```js
const RoomI = M.interface('Room', {
  // ...
  clear: M.call().returns()
});
```

::: tip Notlar

- Durum `init` fonksiyonu (3. argüman) tarafından tanımlandıktan sonra, özellikler eklenemez veya kaldırılamaz.
- Durum özelliklerinin değerleri serileştirilebilir olmalıdır.
- Durum özelliklerinin değerleri atama sırasında sertleştirilir.
- Bir durum özelliğinin değerini değiştirebilirsiniz (örneğin `state.zot = [...state.zot, 'last']`), ve depoları güncelleyebilirsiniz (`state.players.set(1, player1)`), ancak `state.zot.push('last')` gibi işlemler yapamazsınız. Eğer jot, durumun bir parçasıysa (`state.jot = { x: 1 };`), `state.jot.x = 2;` gibi bir işlem de yapamazsınız.
- Etiket (1. argüman), `baggage`'de bir anahtar oluşturmak için kullanılır, bu nedenle çakışmalardan kaçınmak önemlidir. `zone.subZone()` ad alanlarını bölmek için kullanılabilir.
- Daha fazla ayrıntı için  ve `zone.exoClass`'a göz atın.
- Durumu paylaşan birden fazla nesne tanımlamak için `zone.exoClassKit` kullanın.
  -  inceleyin.
- Geniş bir test/örnek için  inceleyin.

:::

### Crank

Diğer vatlerden gelen tüm çağrılar başlamadan önce tüm exo sınıfları/kiti tanımlanmalıdır -- ilk "crank" içinde.

::: tip Not

- Crank kısıtlamaları hakkında daha fazla bilgi için  bölümüne ve  bakabilirsiniz.

:::

### Baggage

baggage, nesnelerin durumunu ve davranışını  arasında koruyarak, diğer  görüldüğü şekilde nesnelerin kimliğini korumanın bir yolunu sağlayan bir MapStore'dur. Sağlanan sözleşmede, günlük işlevelerinin durumunun, sözleşmenin yükseltilmesinden sonra bile korunduğundan emin olmak için baggage kullanılmaktadır.

```js
export const start = async (zcf, privateArgs, baggage) => {
  // ...
  const { accountsStorageNode } = await provideAll(baggage, {
    accountsStorageNode: () => E(storageNode).makeChildNode('accounts')
  });
  // ...
};
```

### Exo

Bir Exo nesnesi, yöntemleri olan bir Remotable nesnedir (diğer bir deyişle  nesnesi) ve genellikle koruyucu bir dış katman olarak bir `InterfaceGuard` ile tanımlanır; bu, ilk savunma katmanını sağlar.

Bu  paketi, Exo nesneleri oluşturmak ve Exo Sınıfları ve Exo Sınıf Kitleri tanımlamak için API'leri tanımlar.

```js
const publicFacet = zone.exo(
  'StakeAtom',
  M.interface('StakeAtomI', {
    makeAccount: M.callWhen().returns(M.remotable('ChainAccount')),
    makeAccountInvitationMaker: M.callWhen().returns(InvitationShape)
  }),
  {
    async makeAccount() {
      trace('makeAccount');
      const holder = await makeAccountKit();
      return holder;
    },
    makeAccountInvitationMaker() {
      trace('makeCreateAccountInvitation');
      return zcf.makeInvitation(async seat => {
        seat.exit();
        const holder = await makeAccountKit();
        return holder.asContinuingOffer();
      }, 'wantStakingAccount');
    }
  }
);
```

### Zone'lar

Her ,  ve Depoları  tahsis etme olanağı sunan bir API sağlar; bu, aynı temel kalıcılık mekanizmasını kullanır. Bu, kütüphane kodunun nesnelerinin yalnızca JS yığınının (geçici), diske sayfalama (sanal) veya bir vat yükseltmesi sonrasında geri yüklenebilecek (dayanıklı) olup olmadığına duyarsız olmasını sağlar.

Zone API'sının daha fazla örnek kullanımı için  inceleyin.

```js
const zone = makeDurableZone(baggage);
// ...
zone.subZone('vows');
```

### Dayanıklı Zone

Dayanıklılık için özel olarak tasarlanmış bir zone, sözleşmenin durumunu yükseltmeler arasında korumasını sağlar. Bu, sözleşmenin işlemlerinin sürekliliğini ve güvenilirliğini sağlamak için kritik öneme sahiptir.

```js
const zone = makeDurableZone(baggage);
```

### Vow Araçları

 inceleyin; bu araçlar, sözleşme içinde sözleri ve asenkron işlemleri yönetir. `prepareVowTools`, bu asenkron görevleri yönetmek için gerekli yardımcı programları hazırlayarak sözleşmenin, diğer zincirlerden olay veya yanıt beklemekle ilgili karmaşık iş akışlarını yönetebilmesini sağlar.

```js
const vowTools = prepareVowTools(zone.subZone('vows'));
// ...
const makeLocalOrchestrationAccountKit = prepareLocalChainAccountKit(
  zone,
  makeRecorderKit,
  zcf,
  privateArgs.timerService,
  vowTools,
  makeChainHub(privateArgs.agoricNames)
);
// ...
const makeCosmosOrchestrationAccount = prepareCosmosOrchestrationAccount(
  zone,
  makeRecorderKit,
  vowTools,
  zcf
);
```