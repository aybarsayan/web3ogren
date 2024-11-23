# Orca Sözleşmesi Kod Geçişi

Bu bölüm, Orca sözleşmesi koduna genel bir bakış sunarak yapısını, ana bileşenlerini ve işlevselliğini açıklamaktadır. Orca sözleşmesi, Orkestrasyon hesaplarını yönetmek ve bunları fonlamak için tasarlanmıştır. Birden fazla zincirle etkileşimde bulunur ve hesap oluşturma ile fonlama işlemleri için işlevsellik sağlar. Sözleşme mantığının kodu iki dosyada bulunmaktadır:

## `orca.contract.js`

`orca.contract.js` dosyası, çeşitli Agoric paketlerinden gerekli bağımlılıkları ve türleri içe aktarır. `flows` içe aktarması, Orca sözleşmesi teklif işleme işlemleri için belirli mantığı içerir.

```js
import { AmountShape } from '@agoric/ertp';
import { makeTracer } from '@agoric/internal';
import { withOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';
import { ChainInfoShape } from '@agoric/orchestration/src/typeGuards.js';
import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { M } from '@endo/patterns';
import * as flows from './orca.flows.js';
```

### Tür Tanımları ve Şekilleri

Aşağıdaki tanımlar, `amount` ve Orkestrasyon güçlerinin yapılarını doğrulamak için şekiller oluşturur.

```js
const SingleAmountRecord = M.and(
  M.recordOf(M.string(), AmountShape, { numPropertiesLimit: 1 }),
  M.not(harden({}))
);

const OrchestrationPowersShape = M.splitRecord({
  localchain: M.remotable('localchain'),
  orchestrationService: M.remotable('orchestrationService'),
  storageNode: M.remotable('storageNode'),
  timerService: M.remotable('timerService'),
  agoricNames: M.remotable('agoricNames')
});
```

### Ana Sözleşme İşlevi

Bu, sözleşmenin işlevselliğini başlatan ve ayarlayan ana `contract` fonksiyonudur.

```js
const contract = async (
  zcf,
  privateArgs,
  zone,
  { orchestrateAll, zoeTools, chainHub }
) => {
  // ... (sözleşme mantığı)
};
```

`contract` fonksiyonu içinde aşağıdaki işlemler gerçekleştirilir:

- **Zincir Kaydı**: Aşağıdaki kod bloğu, zincirleri ve bunların bağlantılarını `chainHub` ile kaydeder.

```js
const { chainDetails } = zcf.getTerms();
for (const [name, info] of entries(chainDetails)) {
  const { connections = {} } = info;
  trace('register', name, {
    chainId: info.chainId,
    connections: keys(connections)
  });
  chainHub.registerChain(name, info);
  for (const [chainId, connInfo] of entries(connections)) {
    chainHub.registerConnection(info.chainId, chainId, connInfo);
  }
}
```

- **Hesap Oluşturma ve Fonlama Fonksiyonları**: Bu işlevler, hesap oluşturma ve fonlama için gerekli akış mantığını kuran `orchestrateAll` yardımcı fonksiyonu kullanılarak oluşturulmaktadır; ancak mantık `orca.flows.js` dosyasında uygulanmıştır ().

```js
const { makeAccount, makeCreateAndFund } = orchestrateAll(flows, {
  localTransfer: zoeTools.localTransfer
});
```

- **Halka Açık Yüz**: Halka açık yüz, `makeAccountInvitation` adlı bir davetiye oluşturarak Orkestrasyon hesabı oluşturmak için bir davetiye oluşturur ve `makeCreateAndFundInvitation` methodu ile bir hesabın oluşturulmasını ve fonlanmasını önerir.

```js
const publicFacet = zone.exo(
  'Orca Public Facet',
  M.interface('Orca PF', {
    makeAccountInvitation: M.callWhen().returns(InvitationShape),
    makeCreateAndFundInvitation: M.callWhen().returns(InvitationShape)
  }),
  {
    makeAccountInvitation() {
      return zcf.makeInvitation(makeAccount, 'Bir Orkestrasyon Hesabı Oluştur');
    },
    makeCreateAndFundInvitation() {
      return zcf.makeInvitation(
        makeCreateAndFund,
        'Bir Orkestrasyon Hesabı Oluştur ve Fonla',
        undefined,
        M.splitRecord({ give: SingleAmountRecord })
      );
    }
  }
);
```

### `start` Fonksiyonu

Start fonksiyonu, sözleşmeye ek Orkestrasyon kurulumunu ve araçlarını sağlayan `withOrchestration` ile sarılmıştır.

```js
export const start = withOrchestration(contract);
harden(start);
```

## `orca.flows.js`

Bu bölüm, Orca sözleşmesi için akış fonksiyonlarını içeren `orca.flows.js` dosyasını incelemektedir. `orca.flows.js` dosyası iki ana fonksiyon tanımlar:

1. `makeAccount`: Bir Cosmos zincirinde hesap oluşturur.
2. `makeCreateAndFund`: Bir Cosmos zincirinde hesap oluşturur ve fonlar.

Bu fonksiyonlar, bir kullanıcı uygun bir orca sözleşmesi davetiyesi kullanarak teklif yaptığında Zoe vatı tarafından çağrılır.

### `makeAccount` Fonksiyonu

Bu fonksiyon belirli bir Cosmos zincirinde bir hesap oluşturur. Bu fonksiyon yalnızca hesabı oluşturmakla kalmaz, aynı zamanda kullanıcıya delegasyon, ödül çekimi ve transfer gibi ek işlemler yapma hakkı veren devam eden bir teklif döner. İşte bu fonksiyonun parametreleri:

- `orch`: Orkestratör örneği parametresi, `Orchestrator` örneğini temsil eder. Bu, blok zinciri ile etkileşimleri yöneten güçlü bir soyutlamadır. Farklı zincirlerle etkileşim kurmak, hesaplar oluşturmak ve zincir bilgilerini almak için yöntemler sağlar.

- `_ctx`: Kullanılmayan bağlam nesnesi
- `seat`: Mevcut teklife karşılık gelen bir öneri nesnesi tutan bir `ZCFSeat` örneği.
- `offerArgs`: `chainName` içeren bir nesne (Orkestrasyon hesabının oluşturulacağı zinciri tanımlar) ve `denom`.

Fonksiyon, `offerArgs`'ın bir `chainName` içerdiğini doğrular, belirli zinciri `orch` kullanarak alır, `chain.makeAccount()` kullanarak zincirde bir hesap oluşturur ve hesabı devam eden bir teklif olarak döner. Aşağıda, bazı hata ayıklama bilgileri günlüğü kaldırıldıktan sonra `makeAccount` fonksiyonunun kodu verilmiştir.

```js
mustMatch(offerArgs, M.splitRecord({ chainName: M.string() }));
const { chainName } = offerArgs;
seat.exit();
const chain = await orch.getChain(chainName);
const chainAccount = await chain.makeAccount();
return chainAccount.asContinuingOffer();
```

Hesap oluşturulduğunda, fonksiyon bir devam eden teklifi `chainAccount.asContinuingOffer()` çağrısıyla döner. Bu, kullanıcının hesap üzerinde delegasyon gibi daha fazla işlem yapmasına olanak tanır.

### `makeCreateAndFund` Fonksiyonu

Bu fonksiyon, belirli bir Cosmos zincirinde bir hesap oluşturur ve fonlar. `makeAccount` ile aynı parametre kümesini alır. Fonksiyon:

- Şu anda teklife geçirilen miktarı seat'ın önerisinden alır ve hem Agoric zincirini hem de belirtilen hedef zinciri alır.
- Zincir bilgilerini ve varlık bilgilerini alır.
- Hem Agoric zincirinde (yerel) hem de hedef zincirinde (uzak) hesaplar oluşturur.
- Koltuktan alınan fonları yerel hesaba aktarır.
- Yerel hesaptan uzak hesaba alınan fonların yarısını aktarır.
- Uzak hesabın bakiyesini kontrol eder ve uzak hesabı devam eden bir teklif olarak döner.

Aşağıda, bazı hata ayıklama bilgilerinin günlüğü kaldırıldıktan sonra `makeCreateAndFund` fonksiyonunun kodu verilmiştir.

```js
const { give } = seat.getProposal();
const [[_kw, amt]] = Object.entries(give);
const [agoric, chain] = await Promise.all([
  orch.getChain('agoric'),
  orch.getChain(chainName)
]);
const localAccount = await agoric.makeAccount();
const remoteAccount = await chain.makeAccount();
const remoteAddress = await remoteAccount.getAddress();
await localTransfer(seat, localAccount, give);
await localAccount.transfer(
  {
    denom: 'ubld',
    value: amt.value / 2n
  },
  remoteAddress
);
seat.exit();
return remoteAccount.asContinuingOffer();
```

Önceki durumda olduğu gibi, fonksiyon hesap üzerinde daha fazla işlem yapmak için `remoteAccount.asContinuingOffer()` çağrısını yaparak devam eden bir teklifi döner.

Ayrıca bahsedilen mantığın dışında, fonksiyonun mevcut durumunu günlüğe kaydetmek için birkaç izleme çağrısı yapılmaktadır. Bu, hata ayıklama için faydalı olup işlemin girdilerini ve ara durumlarını doğrulamayı sağlar.