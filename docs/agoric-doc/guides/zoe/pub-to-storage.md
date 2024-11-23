---
title: "chainStorage'e Yayınlama"
---

# chainStorage'e Yayınlama

Sözleşmeler,  kullanarak istemcilere veri yayınlayabilir. Sözleşmelerin  ile görünür veri yayınlayabilmesi için, bir abonelik oluşturulup `chainStorage` düğümüne bağlanması gerekmektedir.

## chainStorage'e Yayınlama için Dağıtım Yetkinlikleri

 bölümünde, `storageNode` ve `marshaller` sözleşmeye `privateArgs` içerisinde geçilir, bu sayede `chainStorage`'e veri yayınlayabilir.

 örneğinde, `startSwapContract` iki  kullanarak `chainStorage` ve `board` yetkinliklerini elde eder ve bunları `privateArgs` oluşturmak için kullanır:

```js
const marshaller = await E(board).getPublishingMarshaller();
const storageNode = await E(chainStorage).makeChildNode(contractName);
```

`Marshaller`, sahte olmayan nesne kimliklerini düz veri slot referanslarına eşlemek ve tersine işlem yapmak için fonksiyonlarla parametreleştirilmiştir.  ad hizmetinin kullanılması, sözleşmeler arasında tutarlı slot referansları sağlar.  makalesinde de açıklandığı gibi, bu, off-chain istemcilerin aynı `@endo/marshal` API'sini kullanmasına olanak tanır.

`chainStorage` düğümü,  `published` anahtarına karşılık gelir. `E(chainStorage).makeChildNode(contractName)` komutunu kullanarak sözleşme, `published.swaparoo` anahtarına ve onun altındaki tüm anahtarlara yazma erişimi elde eder.

`swaparoo` sözleşmesi, yayınlama yönetim parametrelerinin kalanını `@agoric/governance` paketine devretmektedir.

## chainStorage'e Yapılandırılmış Veri Yayınlama

Detayları daha iyi anlamak için Inter Protocol  sözleşmesine bakalım. Bu sözleşme,  verisini şu biçimde yayınlar:

```js
/**
 * @typedef {object} MetricsNotification
 * @property {AmountKeywordRecord} allocations
 * @property {Amount} shortfallBalance tasfiye nedeniyle henüz tazmin edilmemiş açık.
 * @property {Amount} totalFeeMinted bugüne kadar basılan toplam Ücret jetonları
 * @property {Amount} totalFeeBurned bugüne kadar yakılan toplam Ücret jetonları
 */
```

Örneğin:

```js
    {
      allocations: {
        Fee: {
          brand: Object @Alleged: IST brand {},
          value: 64561373455n,
        },
        ATOM: {
          brand: Object @Alleged: ATOM brand {},
          value: 6587020n
        },
      },
      shortfallBalance: {
        brand: Object @Alleged: IST brand {},
        value: 5747205025n,
      },
      totalFeeBurned: {
        brand: Object @Alleged: IST brand {},
        value: n,
      },
      totalFeeMinted: {
        brand: Object @Alleged: IST brand {},
        value: 0n,
      },
    },
```

Bu verileri yazan yöntem:

```js
        writeMetrics() {
          const { state } = this;
          const metrics = harden({
            allocations: state.collateralSeat.getCurrentAllocation(),
            shortfallBalance: state.shortfallBalance,
            totalFeeMinted: state.totalFeeMinted,
            totalFeeBurned: state.totalFeeBurned,
          });
          void state.metricsKit.recorder.write(metrics);
        },
```

`metricsKit`, `makeRecorderKit` fonksiyonu ile oluşturulur:

```js
        metricsKit: makeRecorderKit(
          metricsNode,
          /** @type {import('@agoric/zoe/src/contractSupport/recorder.js').TypedMatcher} */ (
            M.any()
          ),
        ),
```

Bu fonksiyonu, bir `RecorderKit` oluşturmak için  kullanarak "hazırlıyoruz" (exo anlamında).

```js
const { makeRecorderKit } = prepareRecorderKitMakers(
  baggage,
  privateArgs.marshaller
);
```

Sözleşme,  başladığında `baggage` ile birlikte `privateArgs` alır:

```js
/**
 * Varlık Rezervi, Inter Protocol için varlıkları tutar ve ...
 *
 * @param {{
 *   ...
 *   marshaller: ERef,
 *   storageNode: ERef,
 * }} privateArgs
 * @param {Baggage} baggage
 */
export const prepare = async (zcf, privateArgs, baggage) => {
  // ...
};
```

Rezerv, `StorageNode`'unu kullanarak `metricsNode` oluşturmak için bir çocuk node yapar:

```js
const metricsNode = await E(storageNode).makeChildNode('metrics');
```

`marshaller`, yukarıdaki gibi veri yapılarını seri hale getirmek için kullanılır.

### Rezerv için Dağıtım Yetkinlikleri

`assetReserve`'i başlatmak için,  fonksiyonu yine iki ilgili `privateArgs`, `marshaller` ve `storageNode` sağlar:

```js
const STORAGE_PATH = 'reserve';
const storageNode = await E(storageNode).makeChildNode(STORAGE_PATH);
const marshaller = await E(board).getReadonlyMarshaller();
```

`setupReserve` fonksiyonu `chainStorage` ve `board` dağıtım yetkinliklerini geçmektedir:

```js
export const setupReserve = async ({
  consume: {
    board,
    chainStorage,
    // ...
  },
  // ...
}) => { ... };