---
title: v0.14.x için Geçiş Kılavuzu
description: Bu belge, projenizi Moleculer v0.14.x sürümleri ile uyumlu hale getirmek için gerekli adımları sunmaktadır. Değişiklikler ve yeni özellikler hakkında bilgilendirme içermektedir.
keywords: [Moleculer, geçiş, 0.14.x, güncelleme, middleware]
---

# v0.14.x için Geçiş Kılavuzu
Bu belge, projenizi Moleculer v0.14.x sürümleri ile uyumlu hale nasıl getireceğinizi açıklamaktadır.

> Lütfen dikkat edin, iletişim protokolü değiştirilmiştir. Bu, yeni Moleculer 0.14 düğümlerinin eski  next(ctx);
};
```

**Kabul edilen ara katman tanımı**
```js
const MyMiddleware = {
    localAction: function(next, action) {
        return ctx => {
            myLogger.info(`${action.name} çağrıldı`);
            return next(ctx);
        }
    }
};
```

**Ara katman tanımını `Function` olarak kabul etme**

Bu durumda, `broker`'a bir işaretçiniz var.
```js
const MyMiddleware = function(broker) {
    // Özel adlı bir günlükleyici oluştur
    const myLogger = broker.getLogger("MY-LOGGER");

    return {
        localAction: function(next, action) {
            return ctx => {
                myLogger.info(`${action.name} çağrıldı`);
                return next(ctx);
            }
        }
    }
};
```

---

## 4. Yeni bağlam tabanlı olay işleyici imzasını kullanın
Moleculer, olay işleyicinizin imzasını algılamaktadır. Eğer imzayı `"user.created(ctx) { ... }}` olarak bulursa, bunu Olay Bağlamı ile çağıracaktır. Eğer bulamazsa, eski argümanlarla çağıracak ve 4. argüman Olay Bağlamı olacaktır, gibi `"user.created"(payload, sender, eventName, ctx) {...}`

**Eski olay işleyici imzası**
```js
module.exports = {
    name: "accounts",
    events: {
        "user.created"(payload, sender, eventName) {
            ...
        }
    }
};
```

**Bağlam ile eski olay işleyici imzası**
```js
module.exports = {
    name: "accounts",
    events: {
        "user.created"(payload, sender, eventName, ctx) {
            ...
        }
    }
};
```

**Yeni bağlam tabanlı olay işleyici imzası**
```js
module.exports = {
    name: "accounts",
    events: {
        "user.created"(ctx) {
            // eski `payload` `ctx.params` içindedir
            // eski `sender` `ctx.nodeID` içindedir
            // eski `eventName` `ctx.eventName` içindedir
        }
    }
};
```

### Ara katmanlardaki `localEvent` işleyici imzası

Lütfen özel ara katmanlarınızda `localEvent` işleyici imzasını da kontrol edin. Bu, yeni bağlam tabanlı imzayı takip etmelidir.

**Ara katmanda `localEvent` kancasında yeni bağlam tabanlı imza**
```js
// my-middleware.js
module.exports = {
    // Yerel olay işleyicilerini sar
    localEvent(next, event) {
        return (ctx) => {
            return next(ctx);
        };
    },
};
```

---

## 5. `node.health` yanıtı değişti
`$node.health` eyleminin yanıtı değişmiştir. `transit` özelliği kaldırılmıştır. Transit metriklerini almak için yeni `$node.metrics` dahili eylemini kullanın.

---

## 6. Yeni metrikler ve izleme özelliklerini kullanın

**Eski broker ayarları**
```js
// moleculer.config.js
module.exports = {
    metrics: true,
    metricsRate: 1.0
};
```

**Yeni broker ayarları**
```js
// moleculer.config.js
module.exports = {
    metrics: {
        enabled: true,
    },
    tracing: {
        enabled: true,

        exporters: [
            {
                type: "Zipkin",
                options: {
                    baseURL: "http://zipkin-server:9411",
                }
            },
            {
                type: "Jaeger",
                options: {
                    host: "jaeger-server",
                    port: 6832
                }
            }
        ],

        sampling: {
            rate: 1.0, // 0.0 - Asla, 1.0 > x > 0.0 - Sabit, 1.0 - Her Zaman
            tracesPerSecond: null, // 1: 1 iz / saniye, 5: 5 iz / saniye, 0.1: 1 iz / 10 saniye
            minPriority: null
        },

        actions: true,
        events: false,

        errorFields: ["name", "message", "code", "type", "data"],
        stackTrace: false,

        defaultTags: null,
    }
};
```

**İzleme sürelerinde parametreler ve meta alanlar eklemenin eski yolu**
```js
// posts.service.js
module.exports = {
    name: "posts",
    actions: {
        get: {
            metrics: {
                params: ["id"],
                meta: ["loggedIn.username"],
            },
            async handler(ctx) {
                // ...
            }
        }
    }
};
```

**İzleme sürelerinde parametreler, meta veya yanıt alanları eklemenin yeni yolu**
```js
// posts.service.js
module.exports = {
    name: "posts",
    actions: {
        get: {
            tracing: {
                tags: {
                    params: ["id"],
                    meta: ["loggedIn.username"],
                    response: ["id", "title"] // eylem yanıtından veri etiketi ekleme.
                },
            },
            async handler(ctx) {
                // ...
            }
        }
    }
};
```

---

## 7. Özel bir günlükleyici yerine yeni yerleşik günlükleyiciyi kullanın.
Bu sürümde tüm günlükleme işlevi yeniden yazılmıştır. Bu, birçok yeni özellik içerdiği anlamına gelir, ancak günlükleyicilerin yapılandırmasında kırıcı değişiklikler bulunmaktadır.

**Bir dış günlükleyiciyi kullanmanın eski yolu**
```js
// moleculer.config.js
module.exports = {
    logger: bindings => pino.child(bindings),
};
```

```js
// moleculer.config.js
module.exports = {
    logger: {
        type: "Pino",
        options: {
            // Günlükleme düzeyi
            level: "info",

            pino: {
                // Daha fazla bilgi: http://getpino.io/#/docs/api?id=options-object
                options: null,

                // Daha fazla bilgi: http://getpino.io/#/docs/api?id=destination-sonicboom-writablestream-string
                destination: "/logs/moleculer.log",
            }
        }
    }
};
```

Kendi özel günlükleyicinizi varsa, bunu bir `Logger` sınıfına sarmalayarak `getLogHandler` yöntemini uygulamanız gerekir.

**Özel bir günlükleyici kullanımı**
```js
// moleculer.config.js
const BaseLogger = require("moleculer").Loggers.Base;

class MyLogger extends BaseLogger {
    getLogHandler(bindings) {
        return (type, args) => console`type`;
    }
}

module.exports = {
    logger: new MyLogger()
};
```

> [Yeni günlükleme özelliği ve tüm desteklenen günlükleyiciler hakkında daha fazla bilgi okuyun.](https://moleculer.services/docs/0.14/logging.html)

---

## 8. Bluebird kaldırıldı
Bluebird Promise kütüphanesi projeden kaldırılmıştır çünkü Node 10 ile yerleşik `Promise` uygulaması Bluebird'den [daha hızlı (2x)](https://github.com/icebob/js-perf-benchmark/blob/95803284dcb46c403eb71f2f114b76bf669189ce/suites/promise.js#L123-L133) dir.

Yerleşik Promise yerine Bluebird kullanmak istiyorsanız, yalnızca `Promise` broker ayarını ayarlamanız gerekir.

```js
const BluebirdPromise = require("bluebird");

// moleculer.config.js
module.exports = {
    Promise: BluebirdPromise
};
```

> Lütfen verilen Promise kütüphanesinin Moleculer modülleri içinde kullanılan `delay`, `method`, `timeout` ve `mapSeries` yöntemleri ile polyfilled edileceğini unutmayın.

Eğer Typescript kullanıyorsanız, aldığı `Promise` türünü Bluebird'den geçersiz kılmak için Moleculer tanımlarını artırmanız gerekecek. Derleme sırasında aşağıdaki kodu içeren bir .d.ts dosyasına sahip olmanız gerekecek:
```ts
import Bluebird from "bluebird";
declare module "moleculer" {
  type Promise<T> = Bluebird<T>;
}
```

Ayrıca, `PromiseLike`'yi Moleculer tarafından döndürülen herhangi bir şey için bir tür olarak kullanıyorsanız, bu `Promise` olarak dönüştürülmelidir; yerleşik promise veya üçüncü şahıs promise kullanıyor olsanız da.

---

## 9. Typescript tanımları daha katı
0.13 sürümü, `Context` sınıfı ve `ServiceBroker` sınıflarındaki `call`, `emit` ve `broadcast` yöntemleri için `params` ve `meta` üzerinde çok gevşek bir tanım yapıyordu. Bu türlere genel türler sağlanmamışsa, varsayılan davranış `any` döndürecekti:
```ts
type GenericObject = { [name: string]: any };
...
class Context<P = GenericObject, M = GenericObject> {
  ...
  params: P;
  meta: M;
  ...
  call<T = any, P extends GenericObject = GenericObject>(actionName: string, params?: P, opts?: GenericObject): PromiseLike<T>;
  emit<D = any>(eventName: string, data: D, groups: Array<string>): void;
  emit<D = any>(eventName: string, data: D, groups: string): void;
  emit<D = any>(eventName: string, data: D): void;
  broadcast<D = any>(eventName: string, data: D, groups: Array<string>): void;
  broadcast<D = any>(eventName: string, data: D, groups: string): void;
  broadcast<D = any>(eventName: string, data: D): void;
```

Genel tür aşmaları sağlanmadığında, bu türler kesinlikle hiçbir tür güvenliği sağlamıyordu çünkü `Context` içindeki gelen `params` ve `meta` tümü `any` olarak tanımlanıyordu, `call` sonucunun türü `any` olarak tanımlanıyordu, `call`'a sağlanan parametreler herhangi bir nesneye izin veriyordu ve `emit` ve `broadcast`'a sağlanan yükler `any` olabiliyordu.

0.14 sürümünde, varsayılan imza aşağıdaki şekilde sıkılaştırılmıştır:
```ts
class Context<P = unknown, M extends object = {}> {
  ...
  params: P;
  meta: M;
  ...
  call<T>(actionName: string): PromiseLike<T>;
  call<T, P>(actionName: string, params: P, opts?: GenericObject): PromiseLike<T>;

  emit<D>(eventName: string, data: D, opts: GenericObject): PromiseLike<void>;
  emit<D>(eventName: string, data: D, groups: Array<string>): PromiseLike<void>;
  emit<D>(eventName: string, data: D, groups: string): PromiseLike<void>;
  emit<D>(eventName: string, data: D): PromiseLike<void>;
  emit(eventName: string): PromiseLike<void>;

  broadcast<D>(eventName: string, data: D, opts: GenericObject): PromiseLike<void>;
  broadcast<D>(eventName: string, data: D, groups: Array<string>): PromiseLike<void>;
  broadcast<D>(eventName: string, data: D, groups: string): PromiseLike<void>;
  broadcast<D>(eventName: string, data: D): PromiseLike<void>;
  broadcast(eventName: string): PromiseLike<void>;
```

Etkin bir şekilde, genel türler sağlanmadığında `params` `unknown` olarak, `meta` ise boş bir nesne olarak tanımlanacaktır. `call`'ın döndürdüğü değer ise `unknown` olacaktır. `emit` ve `broadcast`'a gönderilen herhangi bir yük, herhangi bir doğrulama olmaksızın geçecektir. Moleculer hizmetleri çağırdığında ve parametreleri aktarırken, parametrelerin ve çağrılan eylem döndürme değerlerinin türlerini anlamasını sağlayacak bir rehberliğe ihtiyaç vardır. Genel türler bu rehberliği sağlar ve uygulamanızda tür güvenliği sağlar.

Eğer bu türler için zaten genel türler sağlıyorsanız, tebrikler(!), yapmanız gereken hiçbir şey yok. Eğer bu türler için genel türler sağlamıyorsanız, muhtemelen `any` olarak daha önce tanımlanan değerlerin şimdi `unknown` olacağı nedeniyle tür hataları alacaksınız. Bu türleri güncellemeniz gerekecek.

Bu tür sorunlarını çözmenin birkaç yolu vardır:
1. (**önerilen**) `Context`, `call`, `emit`, ve `broadcast`da bu genel türler için uygun türleri sağlayın. Artık `ctx.params`, `ctx.meta`, `call`'dan dönen değer, `call`'a geçirilen `params` ve `emit` ile `broadcast`'a geçirilen yükler için tür güvenliğine sahip olacaksınız.
2. (önerilmez) Kendi yerel TS tanımlarınızı Moleculer modülüne artırarak bu türleri önceki davranışlarına döndürebilirsiniz. Bu, kodunuzun daha önce olduğu gibi çalışmasını sağlar, ancak hiçbir tür güvenliği sağlamaz.
3. (önerilmez) Uygulamanızdaki `Context` türünün tüm kullanımlarını `Context`, `call`'ı `call`, `emit`i `emit` ve `broadcast`ı `broadcast` ile değiştirin. 2. ile benzer şekilde, yine tür güvenliği olmayacaktır, ancak hızlı ve kirli bir yaklaşımı temsil edebilir.

**NOT:** Yukarıdaki örnekler `Context` sınıfındaki değişiklikleri göstermektedir fakat benzer değişiklikler `ServiceBroker` sınıfında da yapılmıştır. Bu yüzden `Context` için yapmanız gereken her değişiklik `ServiceBroker` için de gereklidir.

---

**:tada: Artık işiniz bitti! :clap:**

Güncel Moleculer projenizde kodlamanın tadını çıkarın. Yardıma ihtiyacınız olursa, [Discord sohbetine katılın](https://discord.gg/j5cJYdu) ve Moleculer topluluğuna sormaktan çekinmeyin.