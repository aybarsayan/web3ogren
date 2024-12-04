---
title: V5 Göç Kılavuzu
seoTitle: Fastify V5 Migration Guide
sidebar_position: 1
description: Bu kılavuz, Fastify v4ten v5e geçişe yardımcı olmak amacıyla hazırlanmıştır. Bu güncelleme ile beraber gelen önemli değişiklikler ve gereksinimler hakkında bilgi bulabilirsiniz.
tags: 
  - Fastify
  - Migration
  - Node.js
  - API
keywords: 
  - fastify
  - v5
  - migration
  - node.js
  - api
---
## V5 Göç Kılavuzu

Bu kılavuz, Fastify v4'ten v5'e geçişe yardımcı olmak amacıyla hazırlanmıştır.

V5'e geçmeden önce, lütfen v4'teki tüm kullanım dışı uyarılarını giderdiğinizden emin olun. Tüm v4 kullanım dışı özellikleri kaldırılmıştır ve güncellemeden sonra çalışmayacaktır.

## Uzun Süreli Destek Dönemi

Fastify v5, yalnızca Node.js v20+ sürümünü destekleyecektir. Eğer eski bir Node.js sürümü kullanıyorsanız, Fastify v5'i kullanmak için daha yeni bir sürüme güncellemeniz gerekecektir.

Fastify v4, 30 Haziran 2025'e kadar desteklenmeye devam edecektir. Eğer güncelleme yapamıyorsanız, HeroDevs'ten bir kullanım sonu destek planı satın almayı düşünmelisiniz.

### Neden Node.js v20?

Fastify v5, `node:test` için daha iyi destek gibi v18 ile karşılaştırıldığında önemli farklılıklar sunduğu için yalnızca Node.js v20+ sürümünü destekleyecektir. Bu, daha iyi bir geliştirici deneyimi sunmamızı ve bakım süreçlerini kolaylaştırmamızı sağlar.

Node.js v18, 30 Nisan 2025'te Uzun Süreli Destek'ten ayrılacak, bu nedenle v20'ye geçmeyi planlamalısınız.

## Kırıcı Değişiklikler

:::warning
Aşağıda belirtilen değişiklikler, Fastify v5'te uygulamanızın davranışını etkileyebilir. Öğrenmek için dikkatli olun!
:::

### `querystring`, `params` ve `body` ile yanıt şemaları için tam JSON Şeması artık gereklidir

V5 ile birlikte, Fastify, `querystring`, `params` ve `body` şeması için tam bir JSON şeması gerektirecektir. `jsonShortHand` seçeneğinin de kaldırıldığını unutmayın.

Varsayılan JSON Şeması doğrulayıcısı kullanılıyorsa, `querystring`, `params`, `body` ve `response` şemaları için tam bir JSON şeması sağlamanız gerekecektir; bu şemalar, `type` özelliğini de içermelidir.

```js
// v4
fastify.get('/route', {
  schema: {
    querystring: {
      name: { type: 'string' }
    }
  }
}, (req, reply) => {
  reply.send({ hello: req.query.name });
});
```

```js
// v5
fastify.get('/route', {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      },
      required: ['name']
    }
  }
}, (req, reply) => {
  reply.send({ hello: req.query.name });
});
```

Daha fazla detay için [#5586](https://github.com/fastify/fastify/pull/5586) bakabilirsiniz.

:::info
JSON Şeması doğrulayıcısını, Zod gibi farklı bir format kullanmak için geçersiz kılmak hala mümkündür; bu değişiklik de bunu kolaylaştırır.
:::

Bu değişiklik, [`@fastify/swagger`](https://github.com/fastify/fastify-swagger) gibi diğer araçların entegrasyonunu kolaylaştırır.

### Yeni logger oluşturucu imzası

Fastify v4'te, Fastify, `logger` seçeneğinde bir pino logger oluşturmak için seçenekleri ve özel bir logger örneğini kabul etti. Bu durum ciddi bir kafa karışıklığına neden oldu.

Sonuç olarak, `logger` seçeneği v5'te artık özel bir logger kabul etmeyecek. Özel bir logger kullanmak için, `loggerInstance` seçeneğini kullanmalısınız:

```js
// v4
const logger = require('pino')();
const fastify = require('fastify')({
  logger
});
```

```js
// v5
const loggerInstance = require('pino')();
const fastify = require('fastify')({
  loggerInstance
});
```

### `useSemicolonDelimiter` varsayılan olarak false

V5 ile birlikte, Fastify örnekleri artık v4'te olduğu gibi sorgu dizesinde noktalı virgül ayırıcılarının kullanılmasını varsayılan olarak desteklemeyecektir. Bu, standart dışı bir davranıştır ve [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986#section-3.4) ile uyumlu değildir.

Eğer hala noktalı virgülleri ayırıcı olarak kullanmak istiyorsanız, sunucu yapılandırmasında `useSemicolonDelimiter: true` ayarını yapabilirsiniz.

```js
const fastify = require('fastify')({
  useSemicolonDelimiter: true
});
```

### Parametreler nesnesinin artık bir prototipi yok

v4'te, `parameters` nesnesinin bir prototipi vardı; bu v5'te böyle değil. Bu, `parameters` nesnesinde `Object`'dan miras alınan özelliklere, `toString` veya `hasOwnProperty` gibi, artık erişemeyeceğiniz anlamına gelir.

```js
// v4
fastify.get('/route/:name', (req, reply) => {
  console.log(req.params.hasOwnProperty('name')); // true
  return { hello: req.params.name };
});
```

```js
// v5
fastify.get('/route/:name', (req, reply) => {
  console.log(Object.hasOwn(req.params, 'name')); // true
  return { hello: req.params.name };
});
```

Bu, uygulamanın güvenliğini artırarak prototip kirlenmesi saldırılarına karşı güçlendirilmesini sağlar.

### Tip Sağlayıcılar artık doğrulayıcı ve serileştirici şemaları arasında farklılık gösteriyor

v4'te, tip sağlayıcılar doğrulama ve serileştirme için aynı türleri içeriyordu. v5'te, tip sağlayıcıları iki ayrı türe ayrıldı: `ValidatorSchema` ve `SerializerSchema`.

[`@fastify/type-provider-json-schema-to-ts`](https://github.com/fastify/fastify-type-provider-json-schema-to-ts) ve [`@fastify/type-provider-typebox`](https://github.com/fastify/fastify-type-provider-typebox) zaten güncellendi: yeni tipleri almak için en son sürüme yükseltin. Eğer özel bir tip sağlayıcı kullanıyorsanız, aşağıdaki gibi değiştirmeniz gerekecektir:

```
--- a/index.ts
+++ b/index.ts
@@ -11,7 +11,8 @@ import {
 import { FromSchema, FromSchemaDefaultOptions, FromSchemaOptions, JSONSchema } from 'json-schema-to-ts'

 export interface JsonSchemaToTsProvider<
   Options extends FromSchemaOptions = FromSchemaDefaultOptions
 > extends FastifyTypeProvider {
-  output: this['input'] extends JSONSchema ? FromSchema<this['input'], Options> : unknown;
+  validator: this['schema'] extends JSONSchema ? FromSchema<this['schema'], Options> : unknown;
+  serializer: this['schema'] extends JSONSchema ? FromSchema<this['schema'], Options> : unknown;
 }
 ```

### .listen() yönteminde değişiklikler

.listen() yönteminin çok sayıda argüman imzası kaldırılmıştır. Bu, `.listen()` çağrısını değişken sayıda argüman ile yapamayacağınız anlamına gelir.

```js
// v4
fastify.listen(8000)
```

Şöyle olacak:

```js
// v5
fastify.listen({ port: 8000 })
```

Bu, v4'te `FSTDEP011` olarak zaten kullanım dışı bırakıldığından, yeni imzayı kullanmak için kodunuzu güncellemeyi çoktan yapmış olmalısınız.

### Trailers'ın doğrudan döndürülmesi kaldırılmıştır

v4'te, bir handler'dan doğrudan trailers döndürebiliyordunuz. Bu, v5'te artık mümkün değildir.

```js
// v4
fastify.get('/route', (req, reply) => {
  reply.trailer('ETag', function (reply, payload) {
    return 'custom-etag'
  })
  reply.send('')
});
```

```js
// v5
fastify.get('/route', (req, reply) => {
  reply.trailer('ETag', async function (reply, payload) {
    return 'custom-etag'
  })
  reply.send('')
});
```

Bir geri çağırma da kullanılabilirdi. Bu, v4'te `FSTDEP013` olarak zaten kullanım dışı bırakıldığı için, yeni imzayı kullanmak için kodunuzu güncellemeyi çoktan yapmış olmalısınız.

### Rota tanımına daha kolay erişim

Rota tanımına erişimle ilgili tüm kullanım dışı özellikler kaldırılmış ve artık `request.routeOptions` üzerinden erişilmektedir.

| Kod | Açıklama | Nasıl Çözülür | Tartışma |
| ---- | ----------- | ------------ | ---------- |
| FSTDEP012 | Kullanım dışı bırakılmış `request.context` özelliğine erişmeye çalışıyorsunuz. | `request.routeOptions.config` veya `request.routeOptions.schema` kullanın. | [#4216](https://github.com/fastify/fastify/pull/4216) [#5084](https://github.com/fastify/fastify/pull/5084) |
| FSTDEP015 | Kullanım dışı bırakılmış `request.routeSchema` özelliğine erişiyorsunuz. | `request.routeOptions.schema` kullanın. | [#4470](https://github.com/fastify/fastify/pull/4470) |
| FSTDEP016 | Kullanım dışı bırakılmış `request.routeConfig` özelliğine erişiyorsunuz. | `request.routeOptions.config` kullanın. | [#4470](https://github.com/fastify/fastify/pull/4470) |
| FSTDEP017 | Kullanım dışı bırakılmış `request.routerPath` özelliğine erişiyorsunuz. | `request.routeOptions.url` kullanın. | [#4470](https://github.com/fastify/fastify/pull/4470) |
| FSTDEP018 | Kullanım dışı bırakılmış `request.routerMethod` özelliğine erişiyorsunuz. | `request.routeOptions.method` kullanın. | [#4470](https://github.com/fastify/fastify/pull/4470) |
| FSTDEP019 | Kullanım dışı bırakılmış `reply.context` özelliğine erişiyorsunuz. | `reply.routeOptions.config` veya `reply.routeOptions.schema` kullanın. | [#5032](https://github.com/fastify/fastify/pull/5032) [#5084](https://github.com/fastify/fastify/pull/5084) |

Daha fazla bilgi için [#5616](https://github.com/fastify/fastify/pull/5616) bakabilirsiniz.

### `reply.redirect()` yeni bir imzaya sahiptir

`reply.redirect()` yönteminin yeni bir imzası vardır: `reply.redirect(url: string, code?: number)`.

```js
// v4
reply.redirect(301, '/new-route')
```

Bunu şu şekilde değiştirin:

```js
// v5
reply.redirect('/new-route', 301)
```

Bu, v4'te `FSTDEP021` olarak zaten kullanım dışı bırakıldığından, yeni imzayı kullanmak için kodunuzu güncellemeyi çoktan yapmış olmalısınız.

### `reply.sent` özelliğini değiştirmek artık yasak

v4'te, `reply.sent` özelliğini değiştirerek yanıtın gönderilmesini engelleyebiliyordunuz. Bu, v5'te artık mümkün değildir, bunun yerine `reply.hijack()` kullanmalısınız.

```js
// v4
fastify.get('/route', (req, reply) => {
  reply.sent = true;
  reply.raw.end('hello');
});
```

Bunu şu şekilde değiştirin:

```js
// v5
fastify.get('/route', (req, reply) => {
  reply.hijack();
  reply.raw.end('hello');
});
```

Bu zaten v4'te `FSTDEP010` olarak kullanım dışı bırakılmıştı, bu nedenle yeni imzayı kullanmak için kodunuzu güncellemeyi çoktan yapmış olmalısınız.

### Rota sürümleme imza değişiklikleri için kısıtlamalar

Rota sürümleme kısıtlamaları için imzayı değiştirdik. `version` ve `versioning` seçenekleri kaldırılmıştır ve bunun yerine `constraints` seçeneğini kullanmalısınız.

| Kod | Açıklama | Nasıl Çözülür | Tartışma |
| ---- | ----------- | ------------ | ---------- |
| FSTDEP008 | Rota `{version: "..."}` seçeneği ile rota kısıtlamaları kullanıyorsunuz. | `{constraints: {version: "..."}}` seçeneğini kullanın. | [#2682](https://github.com/fastify/fastify/pull/2682) |
| FSTDEP009 | Sunucu `{versioning: "..."}` seçeneği via özel rota sürümleme stratejisi kullanıyorsunuz. | `{constraints: {version: "..."}}` seçeneğini kullanın. | [#2682](https://github.com/fastify/fastify/pull/2682) |

### `HEAD` rotalarının `GET`'ten önce kaydedilmesi gerekmektedir `exposeHeadRoutes: true` durumunda

`exposeHeadRoutes: true` olduğunda, özel `HEAD` rota için daha katı bir gereksinimimiz vardır. 

Eğer özel bir `HEAD` rotası sağlıyorsanız, `exposeHeadRoutes`'i açıkça `false` yapmalısınız.

```js
// v4
fastify.get('/route', {

}, (req, reply) => {
  reply.send({ hello: 'world' });
});

fastify.head('/route', (req, reply) => {
  // ...
});
```

```js
// v5
fastify.get('/route', {
  exposeHeadRoutes: false
}, (req, reply) => {
  reply.send({ hello: 'world' });
});

fastify.head('/route', (req, reply) => {
  // ...
});
```

veya `HEAD` rotasını `GET`'ten önce yerleştirin.

```js
// v5
fastify.head('/route', (req, reply) => {
  // ...
});

fastify.get('/route', {

}, (req, reply) => {
  reply.send({ hello: 'world' });
});
```

Bu, [#2700](https://github.com/fastify/fastify/pull/2700) içinde değiştirildi ve eski davranış v4'te `FSTDEP007` olarak kullanım dışı bırakıldı.

### `request.connection` kaldırıldı

`request.connection` özelliği v5'te kaldırılmıştır. Bunun yerine `request.socket` kullanmalısınız.

```js
// v4
fastify.get('/route', (req, reply) => {
  console.log(req.connection.remoteAddress);
  return { hello: 'world' };
});
```

```js
// v5
fastify.get('/route', (req, reply) => {
  console.log(req.socket.remoteAddress);
  return { hello: 'world' };
});
```

Bu, zaten v4'te `FSTDEP05` olarak kullanım dışı bırakıldığı için, yeni imzayı kullanmak için kodunuzu güncellemeyi çoktan yapmış olmalısınız.

### `reply.getResponseTime()` kaldırıldı, bunun yerine `reply.elapsedTime` kullanın

`reply.getResponseTime()` yöntemi v5'te kaldırılmıştır. Bunun yerine `reply.elapsedTime` kullanmalısınız.

```js
// v4
fastify.get('/route', (req, reply) => {
  console.log(reply.getResponseTime());
  return { hello: 'world' };
});
```

```js
// v5
fastify.get('/route', (req, reply) => {
  console.log(reply.elapsedTime);
  return { hello: 'world' };
});
```

Bu, v4'te `FSTDEP20` olarak kullanım dışı bırakıldığından, yeni imzayı kullanmak için kodunuzu güncellemeyi çoktan yapmış olmalısınız.

### `fastify.hasRoute()` artık `find-my-way` davranışını eşleştiriyor

`fastify.hasRoute()` yöntemi artık `find-my-way` davranışını eşleştiriyor ve rota tanımının tanımlandığı gibi geçilmesini gerektiriyor.

```js
// v4
fastify.get('/example/:file(^\\d+).png', function (request, reply) { })

console.log(fastify.hasRoute({
  method: 'GET',
  url: '/example/12345.png'
})); // true
```

```js
// v5

fastify.get('/example/:file(^\\d+).png', function (request, reply) { })

console.log(fastify.hasRoute({
  method: 'GET',
  url: '/example/:file(^\\d+).png'
})); // true
```

### Bazı standart dışı HTTP yöntemlerinin kaldırılması

Fastify'dan aşağıdaki HTTP yöntemleri kaldırılmıştır:
- `PROPFIND`
- `PROPPATCH`
- `MKCOL`
- `COPY`
- `MOVE`
- `LOCK`
- `UNLOCK`
- `TRACE`
- `SEARCH`

Artık bunları `addHttpMethod` yöntemi aracılığıyla geri eklemek mümkündür.

```js
const fastify = Fastify()

// varsayılanların üzerine yeni bir http yöntemi ekleyin:
fastify.addHttpMethod('REBIND')

// bir gövde kabul eden yeni bir HTTP yöntemi ekleyin:
fastify.addHttpMethod('REBIND', { hasBody: true })

// HTTP yöntemleri listesini okumak:
fastify.supportedMethods // bir dizi döndürür
```

Daha fazla bilgi için [#5567](https://github.com/fastify/fastify/pull/5567) bakabilirsiniz.

### Dekoratörlerde referans türlerine destek kaldırıldı

Request/Reply'i referans türü (`Array`, `Object`) ile süslemek artık yasaktır; çünkü bu referans tüm istekler arasında paylaşılmaktadır.

```js
// v4
fastify.decorateRequest('myObject', { hello: 'world' });
```

```js
// v5
fastify.decorateRequest('myObject');
fastify.addHook('onRequest', async (req, reply) => {
  req.myObject = { hello: 'world' };
});
```

ya da bir fonksiyon haline getirin

```js
// v5
fastify.decorateRequest('myObject', () => { hello: 'world' });
```

ya da bir getter olarak

```js
// v5
fastify.decorateRequest('myObject', {
  getter () {
    return { hello: 'world' }
  }
});
```

Daha fazla bilgi için [#5462](https://github.com/fastify/fastify/pull/5462) bakabilirsiniz.

### Boş gövde ile `Content-Type: application/json` başlığı olan DELETE'e destek kaldırıldı

v4'te Fastify, `Content-Type: application/json` başlığı olan ve boş gövde ile DELETE isteklerine izin veriyordu. Bu artık v5'te izin verilmemektedir.

Daha fazla bilgi için [#5419](https://github.com/fastify/fastify/pull/5419) bakabilirsiniz.

### Eklentiler artık geri çağrı/promise API'sini karıştıramaz

v4'te, eklentiler geri çağrı ve promise API'sini karıştırabilir, bu da beklenmedik davranışlara yol açabilirdi. Bu artık v5'te izin verilmemektedir.

```js
// v4
fastify.register(async function (instance, opts, done) {
  done();
});
```

```js
// v5
fastify.register(async function (instance, opts) {
  return;
});
```

veya

```js
// v5
fastify.register(function (instance, opts, done) {
  done();
});
```

### `getDefaultRoute` ve `setDefaultRoute` yöntemleri kaldırıldı

`getDefaultRoute` ve `setDefaultRoute` yöntemleri v5'te kaldırılmıştır.

Daha fazla bilgi için [#4485](https://github.com/fastify/fastify/pull/4485) ve [#4480](https://github.com/fastify/fastify/pull/4485) bakabilirsiniz. Bu, zaten v4'te `FSTDEP014` olarak kullanım dışı bırakıldığı için, kodunuzu güncellemek için çoktan yapmak zorundasınız.

## Yeni Özellikler

### Diagnostic Channel desteği

Fastify v5 artık [Diagnostics Channel](https://nodejs.org/api/diagnostics_channel.html) API'sini yerel olarak desteklemekte ve bir isteğin yaşam döngüsünü izlemek için bir yol sunmaktadır.

```js
'use strict'

const diagnostics = require('node:diagnostics_channel')
const sget = require('simple-get').concat
const Fastify = require('fastify')

diagnostics.subscribe('tracing:fastify.request.handler:start', (msg) => {
  console.log(msg.route.url) // '/:id'
  console.log(msg.route.method) // 'GET'
})

diagnostics.subscribe('tracing:fastify.request.handler:end', (msg) => {
  // msg, 'tracing:fastify.request.handler:start' kanalından yayımlananla aynıdır
  console.log(msg)
})

diagnostics.subscribe('tracing:fastify.request.handler:error', (msg) => {
  // hata durumunda
})

const fastify = Fastify()
fastify.route({
  method: 'GET',
  url: '/:id',
  handler: function (req, reply) {
    return { hello: 'world' }
  }
})

fastify.listen({ port: 0 }, function () {
  sget({
    method: 'GET',
    url: fastify.listeningOrigin + '/7'
  }, (err, response, body) => {
    t.error(err)
    t.equal(response.statusCode, 200)
    t.same(JSON.parse(body), { hello: 'world' })
  })
})
```

Daha fazla detay için [belgelere](https://github.com/fastify/fastify/blob/main/docs/Reference/Hooks.md#diagnostics-channel-hooks) ve [#5252](https://github.com/fastify/fastify/pull/5252) bakabilirsiniz.