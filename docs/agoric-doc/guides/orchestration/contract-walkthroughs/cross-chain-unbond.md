---
title: Cross-Chain Unbond Contract
---

# Cross-Chain Unbond Sözleşmesi

Bu kılavuz, IBC (Inter-Blockchain Communication) kullanarak Cosmos tabanlı bir zincirden varlıkların unbond edilmesini ve başka bir zincire aktarılmasını sağlayan Unbond Sözleşmesi'nin işlevselliğini içermektedir.

## Genel Bakış

Unbond Sözleşmesi, Osmosis ve Stride gibi dış zincirlerle etkileşim kurmak için Agoric Orchestration API'sini kullanarak, varlıkların bir zincirden diğerine unbond edilmesi ve aktarılmasını kolaylaştırır.

Sözleşme iki ana bölümden oluşmaktadır:

- **Sözleşme Dosyası (`unbond.contract.js`)**: Sözleşme yapısını ve kamuya açık API'leri tanımlar.
- **Akış Dosyası (`unbond.flows.js`)**: Unbond etme ve aktarma işlemleri için mantığı uygular.

## Sözleşme: `unbond.contract.js`

Bu dosya, `withOrchestration` yardımcı fonksiyonu kullanılarak sarmalanmış ana Orkestrasyon sözleşmesini içermektedir. Kullanıcıların unbond etme sürecini başlatmalarını ve varlıkları başka bir zincire aktarmalarını sağlayan bir kamusal faceti açığa çıkarır.

### İthalatlar

Anahtar ithalatlar arasında `withOrchestration` yardımcı fonksiyonu, desen eşleşme aracı `M` ve `unbond.flows.js` dosyasındaki akışlar yer alır.

```js
import { M } from '@endo/patterns';
import { withOrchestration } from '../utils/start-helper.js';
import * as flows from './unbond.flows.js';
```

### `contract` Fonksiyonu

`contract` fonksiyonu, `withOrchestration` içerisinde sarılmış olarak, sözleşmenin giriş noktası olan  tanımlar. Sözleşme, aşağıdaki  ile bir `start` fonksiyonu ihraç eder. Burada daha soyut bir `contract` fonksiyonu tanımlayıp bunu `withOrchestration`'a göndermemiz sadece bir gelenek/kolaylık meselesidir. `contract` fonksiyonunun parametreleri şunları içerir:

- `zcf`: Zoe Sözleşme Faceti.
- `privateArgs`: Çeşitli hizmetlere uzak referanslar içeren nesne.
- `zone`: Kalıcı veriler için depolama erişimi sağlayan bir `Zone` nesnesi.
- `OrchestrationTools`: Sözleşme için gereken Orkestrasyon ile ilgili araçlar.

```js
const contract = async (
  zcf,
  privateArgs,
  zone,
  { orchestrateAll, zcfTools }
) => {
  const { unbondAndTransfer } = orchestrateAll(flows, { zcfTools });

  const publicFacet = zone.exo('publicFacet', undefined, {
    makeUnbondAndTransferInvitation() {
      return zcf.makeInvitation(
        unbondAndTransfer,
        'Unbond et ve aktar',
        undefined,
        harden({
          give: {},
          want: {},
          exit: M.any()
        })
      );
    }
  });

  return harden({ publicFacet });
};
```

`orchestrateAll` fonksiyonu, akış dosyasındaki akışları sözleşme mantığına bağlar. Bu durumda, `unbondAndTransfer` akışını bağlar. `publicFacet`, kullanıcıların unbond etme ve aktarma süreci için teklif vermesine olanak tanıyan `makeUnbondAndTransferInvitation` yöntemini açığa çıkarır.

### `start` fonksiyonu

Aşağıdaki kod, `withOrchestration` çağrısından döndürülen sözleşmenin `start` fonksiyonunu tanımlar ve bunu  ile parametre olarak geçirir. Temelde `contract` fonksiyonu, bu sözleşmenin giriş noktası veya `start` fonksiyonu olup, bazı Orkestrasyon ayarlarını içerir.

```js
export const start = withOrchestration(contract);
```

## Akışlar: `unbond.flows.js`

Bu dosya, varlıkların zincirler arasında unbond edilmesi ve aktarılması işlemini gerçekleştiren Orkestrasyon akışını içermektedir.

### Akış Fonksiyonu: `unbondAndTransfer`

`unbondAndTransfer` akışı, bir kaynak zincirden (örneğin, Osmosis) varlıkların unbond edilmesini ve bir hedef zincire (örneğin, Stride) aktarılmasını yönetir.

```js
export const unbondAndTransfer = async (orch, { zcfTools }) => {
  const osmosis = await orch.getChain('osmosis');
  const osmoDenom = (await osmosis.getChainInfo()).stakingTokens[0].denom;

  const osmoAccount = await osmosis.makeAccount();
  const delegations = await osmoAccount.getDelegations();
  const osmoDelegations = delegations.filter(d => d.amount.denom === osmoDenom);

  await osmoAccount.undelegate(osmoDelegations);

  const stride = await orch.getChain('stride');
  const strideAccount = await stride.makeAccount();

  const balance = await osmoAccount.getBalance(osmoDenom);
  await osmoAccount.transfer(strideAccount.getAddress(), balance);
};
```

Yukarıdaki kod, şu birkaç şeyi başarmaktadır:

- `osmosis` zincir nesnesini ve zincir bilgisinden `osmo` denominasyonunu alır.
- `osmosis` üzerinde bir `osmoAccount` oluşturur. _Gerçek yaşam senaryosunda bu adımın gerekli olmayacağını belirtmek gerekir; çünkü daha önce bazı `osmo` varlıkları tahsis eden bir hesap kullanılıyor olacaktık._
- `osmoAccount` üzerindeki `osmo` tahsislerinin üzerine `undelegate` işlemi gerçekleştirir.
- `stride` zincirinde bir hesap oluşturur.
- `osmoAccount` üzerindeki tüm `osmo` bakiyesini `strideAccount`'a aktarır.

Başarılı bir aktarım sonrasında, varlıklar Osmosis zincirinden Stride zincirine taşınır ve kullanıcı'nın talep etmesi için hazır hale gelir.