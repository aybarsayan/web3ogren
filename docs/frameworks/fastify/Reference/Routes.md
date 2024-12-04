---
title: Fastify
seoTitle: Fastify Documentation
sidebar_position: 4
description: Fastify is a fast and low-overhead web framework for Node.js. This document provides an overview of routes, options, and usage patterns in Fastify.
tags: 
  - Fastify
  - Node.js
  - Web Frameworks
keywords: 
  - fastify
  - routes
  - middleware
  - API
  - server
---
## Routes

Yol yöntemleri uygulamanızın uç noktalarını yapılandıracaktır. Fastify ile bir rotayı iki yolla tanımlayabilirsiniz: kısayol yöntemi ve tam açıklama.

- `Tam açıklama`
- `Rota seçenekleri`
- `Kısayol açıklaması`
- `Url oluşturma`
- `Async Await`
- `Promise çözümü`
- `Rota Ön Ekleme`
  - `Ön ekli eklentiler içinde / rotasının işlenmesi`
- `Özel Log Seviyesi`
- `Özel Log Serileştirici`
- `Yapılandırma`
- `Kısıtlamalar`
  - `Versiyon Kısıtlamaları`
  - `Host Kısıtlamaları`

### Tam açıklama


```js
fastify.route(options)
```

### Rota seçenekleri


* `method`: şu anda `GET`, `HEAD`, `TRACE`, `DELETE`,
  `OPTIONS`, `PATCH`, `PUT` ve `POST` desteklenmektedir. Daha fazla yöntem kabul etmek için,
  `addHttpMethod` kullanılmalıdır.
  Bu ayrıca bir yöntemler dizisi olabilir.
* `url`: bu rotayı eşleştirmek için URL'nin yolu (takma ad: `path`).
* `schema`: istek ve cevap için şemaları içeren bir nesne. Bunlar
  [JSON Şeması](https://json-schema.org/) formatında olmalıdır, daha fazla bilgi için 
  `buraya` bakın.

  * `body`: POST, PUT, PATCH,
    TRACE, SEARCH, PROPFIND, PROPPATCH veya LOCK yöntemi ise isteğin gövdesini doğrular.
  * `querystring` veya `query`: sorgu dizesini doğrular. Bu, 
    `object` türü için `type` özelliği içeren bir JSON Şeması nesnesi veya aşağıda gösterildiği gibi 
    `properties` nesnesinde yer alacak değerler olabilir.
  * `params`: parametreleri doğrular.
  * `response`: cevabı filtreleme ve bir şema oluşturma, bir şema belirlemek 
    bize %10-20 daha fazla verimlilik sağlar.
* `exposeHeadRoute`: herhangi bir `GET` rotası için bir kardeş `HEAD` rotası oluşturur.
  Varsayılan olarak, `exposeHeadRoutes` 
  örnek seçenek değeridir. Bu seçeneği devre dışı bırakmadan özel bir `HEAD` işleyicisi istiyorsanız, 
  `GET` rotasından önce bunu tanımladığınızdan emin olun.
* `attachValidation`: isteğe `validationError` ekleyerek, 
  bir şema doğrulama hatası varsa, hatayı hata işleyicisine göndermenin yerine.
  Varsayılan [hata formatı](https://ajv.js.org/api.html#error-objects) Ajv formatındadır.
* `onRequest(request, reply, done)`: geldiği anda çağrılan bir 
  `fonksiyon`, bu bir dizi fonksiyon da olabilir.
* `preParsing(request, reply, done)`: isteği ayrıştırmadan önce 
  çağrılan bir `fonksiyon`, bu bir dizi fonksiyon da olabilir.
* `preValidation(request, reply, done)`: paylaşılmış 
  `preValidation` kancalarından sonra çağrılan bir `fonksiyon`, 
  örneğin rota seviyesinde kimlik doğrulama yapılması gerektiğinde, bu bir dizi fonksiyon 
  da olabilir.
* `preHandler(request, reply, done)`: istek işleyicisinden önce 
  çağrılan bir `fonksiyon`, bu bir dizi fonksiyon da olabilir.
* `preSerialization(request, reply, payload, done)`: serileştirmeden önce 
  çağrılan bir `fonksiyon`, bu bir dizi fonksiyon da olabilir.
* `onSend(request, reply, payload, done)`: bir cevabı göndermeden hemen önce 
  çağrılan bir `fonksiyon`, bu bir dizi fonksiyon da olabilir.
* `onResponse(request, reply, done)`: bir cevap gönderildiğinde 
  çağrılan bir `fonksiyon`, böylece istemciye daha fazla veri gönderemezsiniz. 
  Bu bir dizi fonksiyon da olabilir.
* `onTimeout(request, reply, done)`: bir isteğin zaman aşıma uğradığında 
  ve HTTP soketi kapatıldığında çağrılan bir `fonksiyon`.
* `onError(request, reply, error, done)`: bir hata oluştuğunda veya 
  hata işleyicisi tarafından istemciye gönderildiğinde çağrılan bir `fonksiyon`.
* `handler(request, reply)`: bu isteği işleyecek olan fonksiyondur. 
  `Fastify sunucusu` bu fonksiyon çağrıldığında `this` ile bağlanacaktır. 
  Not: ok işlevi kullanmak `this` bağlamını bozacaktır.
* `errorHandler(error, request, reply)`: isteğin kapsamı için özel bir hata işleyicisidir. 
  Varsayılan hata küresel işleyicisini geçersiz kılar ve 
  `setErrorHandler` tarafından ayarlanan her şeyi,
  rotaya yapılan istekler için. Varsayılan işleyiciye erişmek için, `instance.errorHandler` erişebilirsiniz. 
  Bu sadece bir eklenti bunu zaten geçersiz kılmadıysa, Fastify'ın varsayılan 
  `errorHandler`'ına işaret eder.
* `childLoggerFactory(logger, binding, opts, rawReq)`: her istek için 
  bir çocuk logger örneği üretmek üzere çağrılacak bir özel fabrika fonksiyonu. 
  Daha fazla bilgi için `childLoggerFactory` 
  belgesine bakın. Varsayılan logger fabrikasını geçersiz kılar ve 
  `setChildLoggerFactory` tarafından ayarlanan her şeyi, 
  rotaya yapılan istekler için. Varsayılan fabrikaya erişmek için, 
  `instance.childLoggerFactory` erişebilirsiniz. 
  Bu sadece bir eklenti bunu zaten geçersiz kılmadıysa, Fastify'ın varsayılan 
  `childLoggerFactory`'ına işaret eder.
* `validatorCompiler({ schema, method, url, httpPart })`: istek doğrulama 
  şemaları inşa eden bir fonksiyon. `Doğrulama ve 
  Serileştirme` belgelerine bakın.
* `serializerCompiler({ { schema, method, url, httpStatus, contentType } })`: 
  cevap serileştirme şemaları inşa eden bir fonksiyon. `Doğrulama ve 
  Serileştirme` belgelerine bakın.
* `schemaErrorFormatter(errors, dataVar)`: doğrulama derleyicisinden gelen hataları formatlayan bir fonksiyon. 
  `Doğrulama ve 
  Serileştirme` belgelerine bakın. 
  Rotaya yapılan istekler için, küresel şema hata formatlayıcı işleyicisinden 
  geçersiz kılar ve `setSchemaErrorFormatter` ile ayarlanan her şeyi.
* `bodyLimit`: bu sayıdan daha büyük istek gövdelerinin ayrıştırılmasını 
  önler. Bir tam sayı olmalıdır. Bu seçeneği ilk Fastify örneğini `fastify(options)` 
  oluşturduğunuzda global olarak da ayarlayabilirsiniz. Varsayılan olarak `1048576` (1 MiB) olarak ayarlıdır.
* `logLevel`: bu rota için log seviyesini ayarlar. Aşağıda gözden geçirin.
* `logSerializers`: bu rota için logcıları ayarlayın.
* `config`: özel yapılandırma depolamak için kullanılan nesne.
* `version`: uç noktanın versiyonunu tanımlayan bir [semver](https://semver.org/) uyumlu dize. 
  `Örnek`.
* `constraints`: isteğe bağlı değerler veya özellikler temelinde rota sınırlamalarını tanımlar, 
  [find-my-way](https://github.com/delvedor/find-my-way) kısıtlamalarını kullanarak özelleştirilmiş eşleştirmeye olanak tanır. 
  Yerleşik `version` ve `host` kısıtlamaları ile birlikte özel kısıtlama stratejilerinin desteği vardır.
* `prefixTrailingSlash`: bir rotayı öneki ile geçerken `/`'in nasıl işleneceğini belirlemek için kullanılan dize.
  * `both` (varsayılan): Hem `/prefix` hem de `/prefix/` kaydedecektir.
  * `slash`: Sadece `/prefix/` kaydedecektir.
  * `no-slash`: Sadece `/prefix` kaydedecektir.

  Not: Bu seçenek, `Server` yapılandırmasında 
  `ignoreTrailingSlash`'ı geçersiz kılmıyor.

* `request` `Request` içerisinde tanımlanmıştır.

* `reply` `Reply` içerisinde tanımlanmıştır.

:::warning
**Dikkat:** `onRequest`, `preParsing`, `preValidation`, 
`preHandler`, `preSerialization`, `onSend` ve `onResponse` belgeleri daha ayrıntılı olarak 
`Hooks` içerisinde açıklanmaktadır. Ayrıca, bir cevabı `handler` 
tarafından işlenmeden önce göndermek isterseniz, `Bir 
kancadan isteğe cevap verin` ile 
başvurun.
:::

Örnek:
```js
fastify.route({
  method: 'GET',
  url: '/',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        excitement: { type: 'integer' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
    }
  },
  handler: function (request, reply) {
    reply.send({ hello: 'world' })
  }
})
```

### Kısayol açıklaması


Yukarıdaki rota bildirimi daha *Hapi*'ye benzer, ancak bir *Express/Restify* yaklaşımını tercih ediyorsanız, bunu da destekliyoruz:

`fastify.get(path, [options], handler)`

`fastify.head(path, [options], handler)`

`fastify.post(path, [options], handler)`

`fastify.put(path, [options], handler)`

`fastify.delete(path, [options], handler)`

`fastify.options(path, [options], handler)`

`fastify.patch(path, [options], handler)`

Örnek:
```js
const opts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
    }
  }
}
fastify.get('/', opts, (request, reply) => {
  reply.send({ hello: 'world' })
})
```

`fastify.all(path, [options], handler)` tüm desteklenen yöntemler için aynı işleyiciyi ekleyecektir.

İşleyici, `options` nesnesi aracılığıyla da sağlanabilir:
```js
const opts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
    }
  },
  handler: function (request, reply) {
    reply.send({ hello: 'world' })
  }
}
fastify.get('/', opts)
```

> Not: işleyici hem `options` içerisinde hem de kısayol metoduna üçüncü
> parametre olarak belirtilirse, tekrarlayan bir `handler` hatası fırlatılır.

### Url oluşturma


Fastify hem statik hem de dinamik URL'leri destekler.

**Parametreli** bir yolu kaydetmek için, parametre adının önüne *nokta* kullanın.
**Wildcard** için, *yıldız* kullanın. Statik rotaların her zaman parametreli ve wildcard'tan önce kontrol edildiğini unutmayın.

```js
// parametreli
fastify.get('/example/:userId', function (request, reply) {
  // curl ${app-url}/example/12345
  // userId === '12345'
  const { userId } = request.params;
  // kodunuzu buraya yazın
})
fastify.get('/example/:userId/:secretToken', function (request, reply) {
  // curl ${app-url}/example/12345/abc.zHi
  // userId === '12345'
  // secretToken === 'abc.zHi'
  const { userId, secretToken } = request.params;
  // kodunuzu buraya yazın
})

// wildcard
fastify.get('/example/*', function (request, reply) {})
```

Düzenli ifade rotaları da desteklenmektedir, ancak eğrilere dikkat etmeniz gerekiyor. 
Düzenli işlemler de performans açısından oldukça masraflıdır!
```js
// parametreli ve regexp ile
fastify.get('/example/:file(^\\d+).png', function (request, reply) {
  // curl ${app-url}/example/12345.png
  // file === '12345'
  const { file } = request.params;
  // kodunuzu buraya yazın
})
```

Aynı çift eğrinin içerisinde birden fazla parametre tanımlamak mümkündür:
```js
fastify.get('/example/near/:lat-:lng/radius/:r', function (request, reply) {
  // curl ${app-url}/example/near/15°N-30°E/radius/20
  // lat === "15°N"
  // lng === "30°E"
  // r ==="20"
  const { lat, lng, r } = request.params;
  // kodunuzu buraya yazın
})
```
*Bu durumda parametre ayırıcı olarak tire ("-") kullanmayı unutmayın.*

Son olarak, düzenli ifade ile birden fazla parametreye sahip olabilirsiniz:
```js
fastify.get('/example/at/:hour(^\\d{2})h:minute(^\\d{2})m', function (request, reply) {
  // curl ${app-url}/example/at/08h24m
  // hour === "08"
  // minute === "24"
  const { hour, minute } = request.params;
  // kodunuzu buraya yazın
})
```
Bu durumda parametre ayırıcı olarak düzenli ifade ile eşleşmeyen herhangi bir karakter kullanılabilir.

Son parametreyi isteğe bağlı hale getirmek için parametre adının sonuna bir soru işareti ("?") ekleyin.
```js
fastify.get('/example/posts/:id?', function (request, reply) {
  const { id } = request.params;
  // kodunuzu buraya yazın
})
```
Bu durumda `/example/posts` ve `/example/posts/1` isteği yapabilirsiniz.
İsteğe bağlı parametre belirtilmediği takdirde undefined olur.

Birden fazla parametreye sahip bir rota kullanmak performansı olumsuz etkileyebilir, bu nedenle mümkün olduğunca 
tek parametre yaklaşımını tercih edin, özellikle uygulamanızın sıcak rotalarında. Eğer yönlendirmeyi nasıl yönettiğimizle ilgileniyorsanız, 
[find-my-way](https://github.com/delvedor/find-my-way) kontrol edin.

Bir parametre bildirmeden nokta içeren bir yol istiyorsanız, iki nokta kullanın. Örneğin:
```js
fastify.post('/name::verb') // /name:verb olarak yorumlanır
```

### Async Await


`async/await` kullanıcısı mısınız? Sizin için düşündük!
```js
fastify.get('/', options, async function (request, reply) {
  const data = await getData()
  const processed = await processData(data)
  return processed
})
```

Gördüğünüz gibi, kullanıcıya veri göndermek için `reply.send` çağırmıyoruz. 
Gövdeyi yalnızca döndürmeniz yeterlidir ve işiniz biter!

Eğer gerekirse, kullanıcıya veriyi `reply.send` ile de geri gönderebilirsiniz. Bu durumda, `async` işleyicinizde 
`return reply` veya `await reply` yazmayı unutmayın, aksi takdirde belirli durumlarda bir yarış durumu ortaya çıkabilirsiniz.

```js
fastify.get('/', options, async function (request, reply) {
  const data = await getData()
  const processed = await processData(data)
  return reply.send(processed)
})
```

Eğer rota bir çağrı tabanlı API ile sarma işini yapıyorsa ve `reply.send()`'i 
vaat zinciri dışında arıyorsanız, `await reply` yapabilirsiniz:

```js
fastify.get('/', options, async function (request, reply) {
  setImmediate(() => {
    reply.send({ hello: 'world' })
  })
  await reply
})
```

`reply` ile geri dönmek de işe yarar:

```js
fastify.get('/', options, async function (request, reply) {
  setImmediate(() => {
    reply.send({ hello: 'world' })
  })
  return reply
})
```

:::warning
**Uyarı:**
* Hem `return value` hem de `reply.send(value)`'i aynı anda kullanırken, 
  gerçekleşen ilk üstünlük kazanır, ikinci değer iptal edilir ve iki kez yanıt vermeye çalıştığınız için 
  bir *warn* günlük kaydı da yayılacaktır.
* Vaat dışındaki `reply.send()` çağrısı mümkündür ama özel bir dikkat gerektirir. Daha fazla detay için 
  `promise-resolution` bölümüne bakın.
* `undefined` döndüremezsiniz. Daha fazla detay için 
  `promise-resolution` bölümüne bakın.
:::

### Promise çözümü


Eğer işleyiciniz bir `async` fonksiyonuysa veya bir vaatte bulunuyorsa, 
geri çağrım ve vaad akış kontrolünü desteklemek için gerekli olan özel davranışların farkında olmalısınız. 
İşleyicinin vaadi çözüldüğünde, yukarıdan otomatik olarak iletilecektir. Bu, 
işleyicide `reply` beklemeyi veya `return` etmeyi açık bir şekilde yapmadığınız takdirde.

1. `async/await` veya vadeler kullanmak ve bir değerle yanıt vermek istiyorsanız:
   - **Yapın** `return reply` / `await reply`.
   - **Yapmayın** `reply.send` çağırmayı unutmayın.
2. `async/await` veya vadeler kullanmak istiyorsanız:
   - **Yapmayın** `reply.send` kullanın.
   - **Yapın** göndermek istediğiniz değeri döndürün.

Bu şekilde, hem `callback-style` hem de `async-await` destekleyebiliriz, 
minimum değişimle. Bu kadar özgürlükten dolayı, tüm bu tarzın birini 
seçmenizi öneririz çünkü hata işleme uygulamanızda tutarlı bir şekilde 
yapılmalıdır.

:::note
**Dikkat**: Her async fonksiyonu kendisi bir vaat döndürür.
:::

### Rota Ön Ekleme


Bazen aynı API'nin iki veya daha fazla sürümünü korumanız gerekebilir; klasik bir yaklaşım, 
tüm rotaları API sürüm numarası ile öneklemektir, örneğin `/v1/user`. Fastify, 
tüm rota adlarını manuel olarak değiştirmeden, aynı API'nin farklı sürümlerini 
hızlı ve akıllıca oluşturmanın bir yolunu sunar, *rota öne ekleme*. İşte nasıl çalıştığı:

```js
// server.js
const fastify = require('fastify')()

fastify.register(require('./routes/v1/users'), { prefix: '/v1' })
fastify.register(require('./routes/v2/users'), { prefix: '/v2' })

fastify.listen({ port: 3000 })
```

```js
// routes/v1/users.js
module.exports = function (fastify, opts, done) {
  fastify.get('/user', handler_v1)
  done()
}
```

```js
// routes/v2/users.js
module.exports = function (fastify, opts, done) {
  fastify.get('/user', handler_v2)
  done()
}
```
Fastify, iki farklı rota için aynı ismi kullandığınız için şikayet etmeyecektir, 
çünkü derleme zamanında öneki otomatik olarak yönetecektir *(bu aynı zamanda 
performansı da etkilemeyecektir!)*.

Artık müşterileriniz aşağıdaki rotalara erişebilir:
- `/v1/user`
- `/v2/user`

Bunu istediğiniz kadar yapabilirsiniz, ayrıca iç içe `register` için de çalışır ve 
rota parametreleri desteklenir.

Tüm rotalarınız için önek kullanmak isterseniz, onları bir eklenti içinde koyabilirsiniz:

```js
const fastify = require('fastify')()

const route = {
    method: 'POST',
    url: '/login',
    handler: () => {},
    schema: {},
}

fastify.register(function (app, _, done) {
  app.get('/users', () => {})
  app.route(route)

  done()
}, { prefix: '/v1' }) // global rota öneki

await fastify.listen({ port: 3000 })
```

### Rota Ön Ekleme ve fastify-plugin


Eğer yollarınızı sarmak için [`fastify-plugin`](https://github.com/fastify/fastify-plugin) kullanıyorsanız, 
bu seçenek çalışmayacaktır. Bunu bir eklentide sararak hala çalıştırabilirsiniz, örneğin:
```js
const fp = require('fastify-plugin')
const routes = require('./lib/routes')

module.exports = fp(async function (app, opts) {
  app.register(routes, {
    prefix: '/v1',
  })
}, {
  name: 'my-routes'
})
```

#### Ön ekli eklentiler içindeki / rotasının işlenmesi

`/` rotasının davranışı, önekin `/` ile bitip bitmemesine bağlı olarak farklıdır. Örneğin, 
bir önek `/something/` düşünürsek, bir `/` rotası eklemek bu sadece `/something/`'i eşleyecektir. 
Bir önek `/something` alırsak, bir `/` rotası eklemek, hem `/something` hem de `/something/`'i eşleştirecektir.

Bu davranışı değiştirmek için yukarıdaki `prefixTrailingSlash` rota seçeneğine bakın.

### Özel Log Seviyesi


Rotalarınızda farklı log seviyelerine ihtiyacınız olabilir; Fastify, bunu oldukça sade bir şekilde 
başarır.

Sadece `logLevel` seçeneğini ya eklenti seçeneği ya da rota 
seçeneği ile birlikte ihtiyacınız olan [değeri](https://github.com/pinojs/pino/blob/master/docs/api.md#level-string) 
geçmeniz yeterlidir.

Eğer `logLevel`'i eklenti seviyesinde ayarlarsanız, 
`setNotFoundHandler` ve 
`setErrorHandler` da etkilenir.

```js
// server.js
const fastify = require('fastify')({ logger: true })

fastify.register(require('./routes/user'), { logLevel: 'warn' })
fastify.register(require('./routes/events'), { logLevel: 'debug' })

fastify.listen({ port: 3000 })
```

Ya da bunu doğrudan bir rotaya ulaştırabilirsiniz:
```js
fastify.get('/', { logLevel: 'warn' }, (request, reply) => {
  reply.send({ hello: 'world' })
})
```
*Özel log seviyesi yalnızca rotalara uygulanır ve küresel Fastify Logger'a değil, 
`fastify.log` ile erişilebilen log'a uygulanmaz.*