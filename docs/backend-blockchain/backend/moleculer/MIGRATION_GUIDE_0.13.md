---
title: v0.13.x için Taşıma Kılavuzu
description: Bu belgeler, projenizi Moleculer v0.13.x sürümleri ile uyumlu hale nasıl getirebileceğinizi anlatmaktadır. Bu kılavuz, önemli değişiklikleri ve yeni özellikleri vurgulamaktadır.
keywords: [Moleculer, v0.13.x, taşıma kılavuzu, güncellemeler, değişiklikler]
---

# v0.13.x için Taşıma Kılavuzu
Bu belgeler, projenizi Moleculer v0.13.x sürümleri ile uyumlu hale nasıl getirebileceğinizi anlatmaktadır.

> Lütfen dikkat edin! `moleculer-web`'in önceki sürümü Moleculer 0.13 ile çalışmamaktadır. Bunu da 0.8.x sürümüne yükseltmeniz gerekiyor.

---

## 1. Daima Broker'ı Hizmetleri Çağırmadan Önce Başlatın
> `moleculer.config.js` ile [Moleculer Runner](http://moleculer.services/docs/0.12/runner.html) kullanıyorsanız, bu kısmı atlayabilirsiniz.

ServiceBroker & Service yaşam döngüsü işleyici mantığı değiştirilmiştir.

**Önceki sürümde çalışıyordu**
```js
const { ServiceBroker } = require("moleculer");

const broker = new ServiceBroker();

broker.loadService("./math.service.js");

broker.call("math.add", { a: 5, b: 3 }).then(res => console.log);
// Yazdırır: 8
```
v0.13 itibarıyla, yalnızca yüklenen ama henüz başlatılmamış bir hizmet olduğundan `ServiceNotFoundError` istisnası atılacaktır.

**Doğru mantık**
```js
const { ServiceBroker } = require("moleculer");

const broker = new ServiceBroker();

broker.loadService("./math.service.js");

broker.start().then(() => {
    broker.call("math.add", { a: 5, b: 3 }).then(res => console.log);
    // Yazdırır: 8
});
```

:::tip
Bu, testlerinizde de sorunlara yol açabilir. Tüm test vakalarında `broker.start()` ve `broker.stop()` kullandığınızdan emin olun.
:::

**İyi bir test vakası**
```js
describe("Test 'posts.find' eylemi", () => {
    let broker = new ServiceBroker({ logger: false });
    let actionHandler = jest.fn(ctx => ctx);
    broker.createService({
        name: "posts",
        actions: {
            find: actionHandler
        }
    });

    /* Önemli kısım! */
    beforeAll(() => broker.start());
    afterAll(() => broker.stop());

    it("eylem işleyicisini çağırmalıdır", () => {
        return broker.call("posts.find", { id: 5 }).then(ctx => {
            expect(ctx.params).toEqual({ id: 5 });

            expect(actionHandler).toHaveBeenCalledTimes(1);
            expect(actionHandler).toHaveBeenCalledWith(ctx);
        });
    });
});
```

---

## 2. `console` yeni varsayılan günlüğü
Artık broker seçeneklerinde `logger: console` ayarlamanıza gerek yoktur çünkü ServiceBroker varsayılan günlükleyici olarak `console` kullanır.

**Yan etki:** testlerinizde broker örnekleri günlük mesajları yazdıracaktır.

Günlüklemeyi devre dışı bırakmak için (önceki sürümdeki varsayılan davranış) broker seçeneklerinde `logger: false` ayarlayın.

**Günlüklemeyi devre dışı bırakma**
```js
const broker = new ServiceBroker({ logger: false });
```

---

## 3. İç olay gönderme mantığı değişti
Projenizde `$` ile başlayan özel olaylar kullanıyorsanız, dikkatli olun çünkü artık bu olaylar `broker.emit` veya `broker.broadcast` yöntemleriyle yayıldığında uzak düğümlere de gönderilecektir. Önceki davranış için `broker.broadcastLocal` yöntemi ile yayabilirsiniz.

> **İpuçları**
>
> Bu arada, `$` özel olayları kullanmanızı önermiyoruz çünkü bu ön ek, temel modüller ve özellikler için ayrılmıştır.
> :::info
> Öncelikli olarak, özellikle bu olayları kullanmak durumundaysanız dikkatli olun.
> :::info

---

## 4. Devre Kesici mantığı ve seçenekleri değişti

**Eski seçenekler**
```js
const broker = new ServiceBroker({
    circuitBreaker: {
        enabled: true,
        maxFailures: 5,
        halfOpenTime: 10 * 1000,
        failureOnTimeout: true,
        failureOnReject: true
    }
});
```

**Yeni seçenekler**
```js
const broker = new ServiceBroker({
    nodeID: "node-1",
    circuitBreaker: {
        enabled: true,
        threshold: 0.5,
        minRequestCount: 20,
        windowTime: 60, // saniye cinsinden
        halfOpenTime: 5 * 1000,
        check: err => err && err.code >= 500
    }
});
```

**Adımlar:**
1. `maxFailures` (sayı) değerini `threshold` (0.0 ile 1.0 arasında yüzde) olarak değiştirin.
2. `failureOnTimeout` ve `failureOnReject` değerlerini `check` fonksiyonu olarak değiştirin.

> **İpuçları**
>
> Tüm seçenekler eylemde geçirilebilir:
> ```js
> module.export = {
>     name: "users",
>     actions: {
>         create: {
>             circuitBreaker: {
>                 threshold: 0.3,
>                 windowTime: 30
>             },
>             handler(ctx) {}
>         }
>     }
> };
> ```

---

## 6. Tekrar seçenekleri değişti
Artık yeniden deneme için üssel beklemeyi kullanıyor.

**Eski seçenekler**
```js
const broker = new ServiceBroker({
    requestRetry: 5
});
```

**Yeni seçenekler**
```js
const broker = new ServiceBroker({
    nodeID: "node-1",
    retryPolicy: {
        enabled: true,
        retries: 5,
        delay: 100,
        maxDelay: 2000,
        factor: 2,
        check: err => err && !!err.retryable
    }
});
```

Çağrı seçeneğinde tekrar değerini geçin. `retryCount` çağrı seçenekleri `retries` olarak yeniden adlandırılmıştır.
```js
broker.call("posts.find", {}, { retries: 3 });
```

> **İpuçları**
>
> Tüm seçenekler eylemde geçirilebilir:
> ```js
> module.export = {
>     name: "users",
>     actions: {
>         find: {
>             retryPolicy: {
>                 // Tüm Yeniden Deneme politika seçenekleri broker seçeneklerinden geçirilebilir.
>                 retries: 3,
>                 delay: 500
>             },
>             handler(ctx) {}
>         },
>         create: {
>             retryPolicy: {
>                 // Bu eylem için tekrarları devre dışı bırak
>                 enabled: false
>             },
>             handler(ctx) {}
>         }
>     }
> };
> ```

---

## 7. Bağlam izleme değişiklikleri

**Eski seçenekler**
```js
const broker = new ServiceBroker({
    trackContext: true
});
```

**Yeni seçenekler**
```js
const broker = new ServiceBroker({
    nodeID: "node-1",
    tracking: {
        enabled: true,
        shutdownTimeout: 5000
    }
});
```

Çağrıda izlemeyi devre dışı bırakın
```js
broker.call("posts.find", {}, { tracking: false });
```

> Kapatma zaman aşımı, hizmet ayarlarında $shutdownTimeout özelliği ile geçirilebilir.

---

## 8. İç istatistik modülü kaldırıldı
Buna ihtiyacınız varsa, [buradan](https://gist.github.com/icebob/99dc388ee29ae165f879233c2a9faf63) indirin, bir hizmet olarak yükleyin ve toplanan istatistikleri almak için `stat.snapshot` çağrısında bulunun.

---

## 9. Yeniden adlandırılmış hatalar
Bazı hatalar isim standartlarına uyması için yeniden adlandırılmıştır.
- `ServiceNotAvailable` -> `ServiceNotAvailableError`
- `RequestRejected` -> `RequestRejectedError`
- `QueueIsFull` -> `QueueIsFullError`
- `InvalidPacketData` -> `InvalidPacketDataError`

Kodunuzda `err.name` veya `instanceof` kontrolü yapıyorsanız, bu kısımları kontrol etmeli ve yeni hata adlarına güncellemelisiniz.

---

## 10. Bağlam nodeID değişiklikleri
`ctx.callerNodeID` kaldırıldı. `ctx.nodeID` her zaman hedef veya çağıran nodeID'sini içerir.

**Adımlar:**
1. Projenizde `callerNodeID` arayın ve bunları `ctx.nodeID` olarak değiştirin.

---

## 11. Geliştirilmiş ping yöntemi
`Ping` yanıtları ile sonuç döndüren bir `Promise` döner. Ayrıca, yöntemin adı `broker.ping` olarak değiştirilmiştir.

**Tüm bilinen düğümleri ping yapma**
```js
broker.ping().then(res => broker.logger.info(res));
```

**Çıktı:**
```js
{ 
    server: { 
        nodeID: 'server', 
        elapsedTime: 10, 
        timeDiff: -2 
    } 
}
```

**Adımlar:**
1. Projenizde `broker.sendPing` kullanıyorsanız, adını `broker.ping` olarak değiştirin ve döndürülen `Promise`'ı yönetin.

---

## 12. Cacher değişiklikleri

### Cacher anahtar oluşturma mantığı değişti
Cacher anahtar oluşturma değişti. Redis cacher kullanıyorsanız, eski  Bu yıkıcı bir değişiklik değildir çünkü eski middleware Moleculer v0.13 ile çalışmaktadır, ancak yapılması önerilmektedir.

Yeni middleware, basit bir `Function` yerine `Object` ile kancalar içerir.

**Eski miras middleware**

```js
const broker = new ServiceBroker({
    middlewares: [
        function(handler, action) {
            // Gerekirse işleyiciyi sar
        }
    ]
});
```

**Aktarılan yeni middleware**

```js
const broker = new ServiceBroker({
    middlewares: [
        {
            localAction: function(handler, action) {
                // Gerekirse işleyiciyi sar
            }
        }
    ]
});
```

> Middleware kaydetmek için `broker.use` yöntemi kullanımı kaldırılmıştır. Bunun yerine broker seçeneklerinde `middlewares:[]` kullanın.

**Yeni middleware'lerde mevcut olan tüm kancaların listesi:**
```js
const MyCustomMiddleware = {
    // Yerel eylem işleyicilerini sar (eski middleware işleyicisi)
    localAction(next, action) {

    },

    // Uzak eylem işleyicilerini sar
    remoteAction(next, action) {

    },

    // Yerel olay işleyicilerini sar
    localEvent(next, event) {

    },

    // broker.createService yöntemini sar
    createService(next) {

    },

    // broker.destroyService yöntemini sar
    destroyService(next) {

    },

    // broker.call yöntemini sar
    call(next) {

    },

    // broker.mcall yöntemini sar
    mcall(next) {

    },

    // broker.emit yöntemini sar
    emit(next) {

    },

    // broker.broadcast yöntemini sar
    broadcast(next) {

    },

    // broker.broadcastLocal yöntemini sar
    broadcastLocal(next) {

    },

    // Yeni bir yerel hizmet oluşturulduktan sonra (senkron)
    serviceCreated(service) {

    },

    // Bir yerel hizmet başlamadan önce (asenkron)
    serviceStarting(service) {

    },

    // Bir yerel hizmet başladıktan sonra (asenkron)
    serviceStarted(service) {

    },

    // Bir yerel hizmet durdurulmadan önce (asenkron)
    serviceStopping(service) {

    },

    // Bir yerel hizmet durdurulduktan sonra (asenkron)
    serviceStopped(service) {

    },

    // Broker oluşturulduktan sonra (asenkron)
    created(broker) {

    },

    // Broker başlamadan önce (asenkron)
    starting(broker) {

    },

    // Broker başladıktan sonra (asenkron)
    started(broker) {

    },

    // Broker durdurulmadan önce (asenkron)
    stopping(broker) {

    },

    // Broker durdurulduktan sonra (asenkron)
    stopped(broker) {

    }
}
```
-----------

**:tada: Başardınız! :clap:**

Yeni Moleculer projenizde mutlu kodlamalar. Yardıma ihtiyacınız olursa, [Gitter sohbetine](https://gitter.im/moleculerjs/moleculer) katılın ve Moleculer topluluğuna sormaktan çekinmeyin.