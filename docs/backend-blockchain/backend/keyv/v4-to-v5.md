---
title: v4ten v5e Geçiş
description: Keyv v5, önemli kırıcı değişiklikler ve yeni özelliklerle birlikte gelir. Bu belge, Keyv v5'e geçiş sırasında yapılması gereken değişiklikleri ve yeni özellikleri özetler.
keywords: [Keyv, v4, v5, geçiş, özellikler, Nodejs]
---

# v4\'ten v5\'e Geçiş

Keyv v5, kırıcı değişikliklerle birlikte büyük bir sürümdür. En büyük kırıcı değişiklik, URI'nin kaldırılmasıdır. Kodunuzu Keyv v5 ile çalışacak şekilde nasıl değiştirebileceğinizi aşağıda bulabilirsiniz.

## v4 ile Önce
```js
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
const keyv = new Keyv('redis://user:pass@localhost:6379');
```

Geçmişte bu çalışıyordu ancak şimdi depoyu ya aşağıdaki gibi doğrudan yapıcıya geçmeniz ya da `store` adlı seçenek nesne parametresi aracılığıyla geçirmeniz gerekiyor. Yapıcı, depolama adaptörünü veya seçenekleri ilk parametre olarak alacaktır.

:::tip
**Not:** Depoyu geçerken, yeni yapıcı kullanımı bazı uyumluluk sorunlarını çözecektir.
:::

## v5 ile Şimdi
```js
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
const keyv = new Keyv(new KeyvRedis({ uri: 'redis://user:pass@localhost:6379' }));
```

## Seçenekler ile Bir Örnek
Seçenekleri geçirirken `store` parametresini kullanarak aşağıdakileri yapabilirsiniz:
```js
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
const keyv = new Keyv({ store: new KeyvRedis({ uri: 'redis://user:pass@localhost:6379' }), namespace: 'my-namespace' });
```

:::info
Bu kullanım, depolamanızı belirli bir isim alanına (namespace) göre organize etmenize olanak tanır.
:::

## Nodejs 18 ve Öncesinin Desteğini Kaldırma

Nodejs 18 ve öncesi üzerinde test yapmayı durdurduk ve Nodejs 20+ kullanmanızı zorunlu kılmasak da bunu öneriyoruz.

:::warning
**Dikkat:** Nodejs 20+ kullanılmadığı takdirde, gelecekteki güncellemeler ile uyumluluk sorunları yaşanabilir.
:::

# Yeni Özellikler
Keyv v5\'teki yeni özelliklerin listesi:

- **Typescript Desteği**: Keyv v5, TypeScript ile yazılmıştır ve tam TypeScript desteğine sahiptir.
- **ESM Desteği**: Keyv v5, ESM ile yazılmıştır ve tam ESM desteğine sahiptir.
- **Olay Yayımcısı**: Keyv v5 artık bir olay yayımcısıdır ve üçüncü parti kütüphanelere bağımlılık olmaksızın `set`, `delete`, `clear` ve `error` için olaylar yayar.
- **Yerleşik İstatistikler**: Keyv v5, `hits`, `misses`, `sets`, `deletes` ve `errors` için yerleşik istatistiklere sahiptir.
- **Kancalar**: Keyv v5, `set()`, `get()`, `getMany()` ve `delete()` işlemleri için ön ve sonrası işleme kancalarına sahiptir.

:::note
Daha fazla bilgi için lütfen Keyv API belgelerine göz atın. Bu belgeler, bu özelliklerin nasıl kullanılacağı hakkında derinlemesine bilgi sunmaktadır.
:::

Bu özelliklerden herhangi biri hakkında Keyv API belgelerinde bilgi alabilirsiniz.