---
title: Vstorage Sorgulama
---

# Vstorage Sorgulama

Dapp UI oluşturmanın temel bir parçası, akıllı sözleşmelerle etkileşimde bulunmaktır. UI, Agoric blok zincirindeki bir akıllı sözleşmeden verileri nasıl okuyabilir? Bu bölümde, kullanımınıza sunulan araçlar ve kütüphanelerle bunu nasıl yapacağınızı göstereceğiz.

## ChainStorageWatcher

Önceki bölümden `useAgoric` kancasını hatırlayın. Bu kancanın sağladığı diğer bir yarar, `chainStorageWatcher`'dır. Bu yardımcı,  paketi aracılığıyla kendi başına da kullanıma sunulmuştur, ancak biz `useAgoric` tarafından sağlananı kullanacağız çünkü o zaten oluşturulmuş ve daha önce eklediğimiz RPC uç noktalarını kullanacak şekilde yapılandırılmıştır.

Örnek:

```ts
const { chainStorageWatcher } = useAgoric();
```

## Vstorage Sorgulama

Bir sözleşmeye teklif göndermek için önce onu zincir üzerinde bulmamız gerekecek. Bunu `published.agoricNames.instance` altında vstorage'da bulacağız (bkz: ). Öncelikle, sözleşmeyi sorgulayacak yeni bir bileşen oluşturacağız (sonunda ona teklif imzalayıp göndereceğiz).

Yeni bir dosya oluşturun, `src/Trade.tsx`:

```tsx
const Trade = () => {
  return (
    TODO - Teklif göndermek için girişleri oluşturun.
  );
};

export default Trade;
```

Ve işimizi hızlandırmak için `App.css` dosyasında stil ekleyelim:

```css
... .trade {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #171717;
  border-radius: 24px;
  margin-bottom: 16px;
  padding: 16px;
}
```

Bileşeni `App.tsx` dosyasına ekleyelim:

```tsx
...
  Agoric UI Eğitimi
  
  
  
...
```

Uygulamayı yeniden oluşturduktan sonra, verdiğimiz yer tutucu metinle bileşenin render edildiğini görmelisiniz. Şimdi `chainStorageWatcher`'ı ekleyelim ve sözleşmeyi zincir üzerinde sorgulayalım. Öncelikle `@agoric/rpc`'yi bir bağımlılık olarak ekleyin:

```
yarn add -D @agoric/rpc@0.10.0
```

Sonra, `src/hooks.ts` dosyamıza gidelim ve zincir verilerini okumak için başka bir kanca oluşturalım:

```ts
import { AgoricChainStoragePathKind as Kind } from '@agoric/rpc';
import { useEffect, useState } from 'react';

...

export const useContract = () => {
  const [brands, setBrands] = useState(null);
  const [instance, setInstance] = useState(null);
  const { chainStorageWatcher } = useAgoric();

  useEffect(() => {
    const stopWatchingInstance = chainStorageWatcher?.watchLatest
    >([Kind.Data, 'published.agoricNames.instance'], instances => {
      console.log('Örnekleri aldık', instances);
      setInstance(instances.find(([name]) => name === 'offerUp')!.at(1));
    });

    const stopWatchingBrands = chainStorageWatcher?.watchLatest
    >([Kind.Data, 'published.agoricNames.brand'], brands => {
      console.log('Markaları aldık', brands);
      setBrands(Object.fromEntries(brands));
    });

    return () => {
      stopWatchingInstance?.();
      stopWatchingBrands?.();
    };
  }, [chainStorageWatcher]);

  return { instance, brands };
};

```

Gördüğünüz gibi, bu kanca `chainStorageWatcher`'ı kullanarak iki vstorage yolunu izliyor ve sonuçları konsola yazdırıyor:

- `published.agoricNames.instance` - Zincir üzerinde mevcut sözleşme örneklerinin adıyla anahtarlanan listesi.
- `published.agoricNames.brand` - Zincir üzerinde mevcut markaların adıyla anahtarlanan listesi.

`chainStorageWatcher`, tüm vstorage sorgularını ve marshalling işlemlerini sizin için yönetir, böylece uygulamanızdan veriye kolayca erişebilirsiniz. Veriler zincir üzerinde değiştiğinde otomatik olarak anket yapar ve güncellemeleri iletir. Vstorage ile ilgili daha fazla bilgi için  ve  sayfalarına bakabilirsiniz.

Sonraki adımda, daha önce oluşturduğunuz `Trade` bileşenine bu kancayı ekleyin:

```tsx
import { useContract } from './hooks';

const Trade = () => {
  // Şu anda markalar veya örneklerle herhangi bir şey yapmayın.
  useContract();

  return (
    TODO - Teklif göndermek için girişleri oluşturun.
  );
};

export default Trade;
```

Artık `brands` ve `instances` değerlerinin konsola yazdırıldığını görmelisiniz. "offerUp" örneğini ve "Item" markasını tespit etmeye çalışın. Bunlar, sözleşmeyi zincire dağıttığınızda eklenmişti ve bunları bir sonraki bölümde teklifimizi belirtmek için kullanacağız.