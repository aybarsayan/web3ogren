---
title: Fastify
seoTitle: Fastify Documentation
sidebar_position: 1
description: Fastify is a fast and low-overhead Node.js framework designed for efficient HTTP application development. This document provides insights into its configuration and features.
tags: 
  - fastify
  - nodejs
  - http
  - framework
  - web development
keywords: 
  - fastify
  - nodejs
  - http
  - framework
  - web development
---


## Fabrika


Fastify modülü, yeni <b>Fastify sunucu</b> örnekleri oluşturmak için kullanılan bir fabrika fonksiyonu ihraç eder. Bu fabrika fonksiyonu, oluşan örneği özelleştirmek için kullanılan bir seçenek nesnesini kabul eder. Bu belge, o seçenek nesnesinde mevcut olan özellikleri açıklar.

- `Fabrika`
  - `http`
  - `http2`
  - `https`
  - `connectionTimeout`
  - `keepAliveTimeout`
  - `forceCloseConnections`
  - `maxRequestsPerSocket`
  - `requestTimeout`
  - `ignoreTrailingSlash`
  - `ignoreDuplicateSlashes`
  - `maxParamLength`
  - `bodyLimit`
  - `onProtoPoisoning`
  - `onConstructorPoisoning`
  - `logger`
  - `loggerInstance`
  - `disableRequestLogging`
  - `serverFactory`
  - `caseSensitive`
  - `allowUnsafeRegex`
  - `requestIdHeader`
  - `requestIdLogLabel`
  - `genReqId`
  - `trustProxy`
  - `pluginTimeout`
  - `querystringParser`
  - `exposeHeadRoutes`
  - `constraints`
  - `return503OnClosing`
  - `ajv`
  - `serializerOpts`
  - `http2SessionTimeout`
  - `frameworkErrors`
  - `clientErrorHandler`
  - `rewriteUrl`
  - `useSemicolonDelimiter`
- `Örnek`
  - `Sunucu Metotları`
    - `sunucu`
    - `after`
    - `ready`
    - `listen`
  - `listenTextResolver`
    - `adresler`
    - `routing`
    - `route`
    - `hasRoute`
    - `findRoute`
    - `close`
    - `decorate\*`
    - `register`
    - `addHook`
    - `prefix`
    - `pluginName`
    - `hasPlugin`
  - `listeningOrigin`
    - `log`
    - `version`
    - `inject`
    - `addHttpMethod`
    - `addSchema`
    - `getSchemas`
    - `getSchema`
    - `setReplySerializer`
    - `setValidatorCompiler`
    - `setSchemaErrorFormatter`
    - `setSerializerCompiler`
    - `validatorCompiler`
    - `serializerCompiler`
    - `schemaErrorFormatter`
    - `schemaController`
    - `setNotFoundHandler`
    - `setErrorHandler`
    - `setChildLoggerFactory`
    - `setGenReqId`
    - `addConstraintStrategy`
    - `hasConstraintStrategy`
    - `printRoutes`
    - `printPlugins`
    - `addContentTypeParser`
    - `hasContentTypeParser`
    - `removeContentTypeParser`
    - `removeAllContentTypeParsers`
    - `getDefaultJsonParser`
    - `defaultTextParser`
    - `errorHandler`
    - `childLoggerFactory`
    - `Symbol.asyncDispose`
    - `initialConfig`

### `http`


+ Varsayılan: `null`

Sunucunun dinleme soketini yapılandırmak için kullanılan bir nesnedir. Seçenekler, Node.js çekirdeğinin [`createServer`
metodu](https://nodejs.org/docs/latest-v20.x/api/http.html#httpcreateserveroptions-requestlistener) ile aynıdır.

Bu seçenek, `http2` veya `https` seçenekleri ayarlandığında göz ardı edilir.

### `http2`


+ Varsayılan: `false`

Eğer `true` ise, Node.js çekirdeğinin [HTTP/2](https://nodejs.org/dist/latest-v20.x/docs/api/http2.html) modülü soketi bağlamak için kullanılır.

### `https`


+ Varsayılan: `null`

Sunucunun TLS için dinleme soketini yapılandırmak için kullanılan bir nesnedir. Seçenekler, Node.js çekirdeğinin [`createServer`
metodu](https://nodejs.org/dist/latest-v20.x/docs/api/https.html#https_https_createserver_options_requestlistener) ile aynıdır. Bu özellik `null` olduğunda, soket TLS için yapılandırılmayacaktır.

Bu seçenek, `http2` seçeneği ayarlandığında da geçerlidir.

### `connectionTimeout`


+ Varsayılan: `0` (zaman aşımı yok)

Sunucu zaman aşımını milisaniye cinsinden tanımlar. Bu seçeneğin etkisini anlamak için [`server.timeout`
özelliği](https://nodejs.org/api/http.html#http_server_timeout) belgelerine bakın.

`serverFactory` seçeneği belirtildiğinde bu seçenek göz ardı edilir.

### `keepAliveTimeout`


+ Varsayılan: `72000` (72 saniye)

Sunucunun keep-alive zaman aşımını milisaniye cinsinden tanımlar. Bu seçeneğin etkisini anlamak için [`server.keepAliveTimeout`
özelliği](https://nodejs.org/api/http.html#http_server_keepalivetimeout) belgelerine bakın. Bu seçenek yalnızca HTTP/1 kullanıldığında geçerlidir.

`serverFactory` seçeneği belirtildiğinde bu seçenek göz ardı edilir.

### `forceCloseConnections`


+ Varsayılan: `"idle"` eğer HTTP sunucusu bunu izin veriyorsa, aksi halde `false`

`true` olarak ayarlandığında, `close` sırasında sunucu mevcut sürekli bağlantıları teker teker inceleyecek ve [soketlerini
yok edecektir](https://nodejs.org/dist/latest-v16.x/docs/api/net.html#socketdestroyerror).

> **Uyarı**
> Bağlantılar, isteklerin tamamlanıp tamamlanmadığını belirlemek için incelenmez.

Fastify, HTTP sunucusunun [`closeAllConnections`](https://nodejs.org/dist/latest-v18.x/docs/api/http.html#servercloseallconnections)
metodunu tercih edecektir, aksi takdirde dahili bağlantı takibi kullanacaktır.

`"idle"` olarak ayarlandığında, `close` sırasında sunucu, bir isteği göndermeyen veya yanıt beklemeyen mevcut sürekli bağlantıları teker teker inceleyecek ve onların soketlerini yok edecektir. Bu değer yalnızca HTTP sunucusunun
[`closeIdleConnections`](https://nodejs.org/dist/latest-v18.x/docs/api/http.html#servercloseidleconnections)
metodunu desteklemesi durumunda desteklenir, aksi takdirde ayarlamaya çalışmak bir istisna oluşturur.

### `maxRequestsPerSocket`


+ Varsayılan: `0` (sınırlama yok)

Bir soketin sürekli bağlantıyı kapatmadan önce işleyebileceği maksimum istek sayısını tanımlar. Bu seçeneğin etkisini anlamak için [`server.maxRequestsPerSocket`
özelliği](https://nodejs.org/dist/latest/docs/api/http.html#http_server_maxrequestspersocket) belgelerine bakın. Bu seçenek yalnızca HTTP/1.1 kullanıldığında geçerlidir. Ayrıca, `serverFactory` seçeneği belirtildiğinde bu seçenek göz ardı edilir.

> **Not**
> Yazım tarihi itibarıyla, yalnızca node >= v16.10.0 bu seçeneği desteklemektedir.

### `requestTimeout`


+ Varsayılan: `0` (sınırlama yok)

Müşteriden tüm isteği almak için maksimum milisaniye sayısını tanımlar. Bu seçeneğin etkisini anlamak için [`server.requestTimeout`
özelliği](https://nodejs.org/dist/latest/docs/api/http.html#http_server_requesttimeout) belgelerine bakın.

`serverFactory` seçeneği belirtildiğinde bu seçenek göz ardı edilir. Potansiyel Denial-of-Service saldırılarına karşı koruma sağlamak için sıfırdan farklı bir değer (örn. 120 saniye) olarak ayarlanmalıdır eğer sunucu önünde bir ters proxy yoksa.

> **Not**
> Yazım tarihi itibarıyla, yalnızca node >= v14.11.0 bu seçeneği desteklemektedir.

### `ignoreTrailingSlash`


+ Varsayılan: `false`

Fastify, routing işlemleri için [find-my-way](https://github.com/delvedor/find-my-way) kullanır. Varsayılan olarak, Fastify, son eğik çizgileri dikkate alacaktır. `/foo` ve `/foo/` gibi yollar farklı yollar olarak değerlendirilir. Bunu değiştirmek istiyorsanız, bu bayrağı `true` olarak ayarlayın. Bu şekilde, hem `/foo` hem de `/foo/` aynı ruta işaret edecektir. Bu seçenek, oluşan sunucu örneği için *tüm* rota kayıtlarına uygulanır.

```js
const fastify = require('fastify')({
  ignoreTrailingSlash: true
})

// "/foo" ve "/foo/" ikisini de kaydeder
fastify.get('/foo/', function (req, reply) {
  reply.send('foo')
})

// "/bar" ve "/bar/" ikisini de kaydeder
fastify.get('/bar', function (req, reply) {
  reply.send('bar')
})
```

### `ignoreDuplicateSlashes`


+ Varsayılan: `false`

Fastify, routing işlemleri için [find-my-way](https://github.com/delvedor/find-my-way) kullanır. `ignoreDuplicateSlashes` seçeneğini kullanarak yolun kopya eğik çizgilerini kaldırabilirsiniz. Bu, hem rota yolundaki hem de istek URL'sindeki kopya eğik çizgileri kaldırır. Bu seçenek, oluşan sunucu örneği için *tüm* rota kayıtlarına uygulanır.

Eğer `ignoreTrailingSlash` ve `ignoreDuplicateSlashes` her ikisi de `true` olarak ayarlanırsa, Fastify önce kopya eğik çizgileri kaldıracak, ardından son eğik çizgileri kaldırarak `//a//b//c//` olan bir yolu `/a/b/c` haline getirecektir.

```js
const fastify = require('fastify')({
  ignoreDuplicateSlashes: true
})

// "/foo/bar/" kaydeder
fastify.get('///foo//bar//', function (req, reply) {
  reply.send('foo')
})
```

### `maxParamLength`


+ Varsayılan: `100`

Parametrik (standart, regex ve çoklu) rotalarda parametreler için özel bir uzunluk ayarlamak mümkündür; varsayılan değer 100 karakterdir. Maksimum uzunluk sınırına ulaşıldığında, "bulunamadı" rotası çağrılacaktır.

Bu, özellikle regex tabanlı bir rotaya sahipseniz, [ReDoS
saldırılarına](https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS) karşı koruma sağlayabilir.

### `bodyLimit`


+ Varsayılan: `1048576` (1MiB)

Sunucunun kabul edebileceği maksimum yükü, byte cinsinden tanımlar. Varsayılan gövde okuyucu, gövdenin boyutu bu sınırı aşarsa `FST_ERR_CTP_BODY_TOO_LARGE`
yanıtını gönderir. Eğer `preParsing` hook` sağlanmışsa, bu limit, hook'un döndürdüğü akışın boyutuna (yani "çözülmüş" gövdenin boyutuna) uygulanır.

### `onProtoPoisoning`


+ Varsayılan: `'error'`

`__proto__` ile JSON nesnesini işlerken çerçevenin hangi eylemi gerçekleştirmesi gerektiğini tanımlar. Bu işlevsellik, [secure-json-parse](https://github.com/fastify/secure-json-parse) tarafından sağlanmaktadır. Prototip zehirlenme saldırıları hakkında daha fazla bilgi için `Prototip Zehirlenmesi` bölümüne bakın.

Olası değerler `'error'`, `'remove'` veya `'ignore'`dir.

### `onConstructorPoisoning`


+ Varsayılan: `'error'`

`constructor` ile JSON nesnesini işlerken çerçevenin hangi eylemi gerçekleştirmesi gerektiğini tanımlar. Bu işlevsellik, [secure-json-parse](https://github.com/fastify/secure-json-parse) tarafından sağlanmaktadır. Prototip zehirlenme saldırıları hakkında daha fazla bilgi için `Prototip Zehirlenmesi` bölümüne bakın.

Olası değerler `'error'`, `'remove'` veya `'ignore'`dir.

### `logger`


Fastify, [Pino](https://getpino.io/) günlüğü ile yerleşik kayıt sağlar. Bu özellik, iç günlük örneğini yapılandırmak için kullanılır.

Bu özellik için mümkün olan değerler:

+ Varsayılan: `false`. Günlük kaydı devre dışıdır. Tüm günlükleme yöntemleri, null bir günlük [abstract-logging](https://npm.im/abstract-logging) örneğine işaret edecektir.

+ `object`: standart bir Pino [seçenek nesnesi](https://github.com/pinojs/pino/blob/c77d8ec5ce/docs/API.md#constructor). Bu, Pino yapıcısına doğrudan iletilecektir. Aşağıdaki özellikler, nesnede yoksa uygun şekilde eklenecektir:
    * `level`: minimum günlükleme seviyesi. Ayarlanmazsa, `'info'` olarak ayarlanacaktır.
    * `serializers`: seri hale getirme işlevlerinin bir hash'idir. Varsayılan olarak, `req` (gelen istek nesneleri), `res` (giden yanıt nesneleri) ve `err` (standart `Error` nesneleri) için seri hale getiriciler eklenir. Bir günlükleme yöntemi bu özelliklerden herhangi birine sahip bir nesne aldığında, ilgili seri hale getirici bu özellik için kullanılacaktır. Örneğin:
        ```js
        fastify.get('/foo', function (req, res) {
          req.log.info({req}) // seri hale getirilmiş istek nesnesini kaydet
          res.send('foo')
        })
        ```
      Kullanıcı tarafından sağlanan herhangi bir seri hale getirici, ilgili özelliğin varsayılan seri hale getiricisinde geçersiz kılacaktır.

### `loggerInstance`


+ Varsayılan: `null`

Özel bir günlük örneği. Günlük, bir Pino örneği olmalıdır veya aşağıdaki yöntemlere sahip Pino arayüzüne uygun olmalıdır: `info`, `error`, `debug`, `fatal`, `warn`, `trace`, `child`. Örneğin:
  ```js
  const pino = require('pino')();

  const customLogger = {
    info: function (o, ...n) {},
    warn: function (o, ...n) {},
    error: function (o, ...n) {},
    fatal: function (o, ...n) {},
    trace: function (o, ...n) {},
    debug: function (o, ...n) {},
    child: function() {
      const child = Object.create(this);
      child.pino = pino.child(...arguments);
      return child;
    },
  };

  const fastify = require('fastify')({logger: customLogger});
  ```

### `disableRequestLogging`


+ Varsayılan: `false`

Günlük kaydı etkinleştirildiğinde, Fastify bir isteğin alındığında ve o isteğe ait yanıtın gönderildiğinde bir `info` seviyesinde günlük kaydı mesajı oluşturur. Bu seçeneği `true` olarak ayarlayarak, bu günlük kayıtları devre dışı bırakılabilir. Bu, özel `onRequest` ve `onResponse` hook'ları ekleyerek istek başlangıcı ve bitiş günlüklemeleri için daha esnek bir şekilde yapılandırma sağlar.

Devre dışı bırakılan diğer günlük kayıtları:
- Yanıt geri çağırma hataları için varsayılan `onResponse` hook'u tarafından yazılan bir hata kaydı
- Hata yönetiminde `defaultErrorHandler` tarafından yazılan hata ve bilgi kayıtları
- Mevcut olmayan bir rota istendiğinde `fourOhFour` işleyicisi tarafından yazılan bilgi kaydı

Fastify tarafından üretilen diğer günlük kayıtları devre dışı kalmayacak, deprecation uyarıları ve sunucu kapanırken gelen isteklerde yayımlanan mesajlar gibi.

```js
// Devre dışı bırakılan işlevselliği taklit eden hook örnekleri.
fastify.addHook('onRequest', (req, reply, done) => {
  req.log.info({ url: req.raw.url, id: req.id }, 'istek alındı')
  done()
})

fastify.addHook('onResponse', (req, reply, done) => {
  req.log.info({ url: req.raw.originalUrl, statusCode: reply.raw.statusCode }, 'istek tamamlandı')
  done()
})
```

### `serverFactory`


Fastify'a özel bir HTTP sunucusu geçirmek için `serverFactory` seçeneğini kullanabilirsiniz.

`serverFactory`, bir `handler` parametresi alan bir işlevdir, bu parametre istek ve yanıt nesnelerini alır, ve Fastify'a geçirdiğiniz seçenek nesnesi ile aynıdır.

```js
const serverFactory = (handler, opts) => {
  const server = http.createServer((req, res) => {
    handler(req, res)
  })

  return server
}

const fastify = Fastify({ serverFactory })

fastify.get('/', (req, reply) => {
  reply.send({ hello: 'world' })
})

fastify.listen({ port: 3000 })
```

Fastify, dahili olarak Node çekirdek HTTP sunucusunun API'sını kullanır, bu nedenle özel bir sunucu kullanıyorsanız, aynı API'nin açık olduğundan emin olmalısınız. Aksi takdirde, `return` ifadesinden önce `serverFactory` işlevinde sunucu örneğini geliştirebilirsiniz.

### `caseSensitive`


+ Varsayılan: `true`

`true` olduğunda, yollar büyük-küçük harfe duyarlı olarak kaydedilir. Yani, `/foo` ile `/Foo` birbirine eşit değildir. `false` olduğunda, yollar büyük-küçük harfe duyarsızdır.

Bu seçeneği `false` olarak ayarlamak, [RFC3986](https://datatracker.ietf.org/doc/html/rfc3986#section-6.2.2.1)'ye aykırıdır.

`caseSensitive` ayarını `false` olarak ayarladığınızda, tüm yollar küçük harfle eşleşecektir, ancak rota parametreleri veya joker karakterler orijinal harf biçimini koruyacaktır. Bu seçenek, sorgu dizelerine etki etmez, bunların işlenmesini değiştirmek için `querystringParser` bölümüne bakın.

```js
fastify.get('/user/:username', (request, reply) => {
  // URL: /USER/NodeJS verildiğinde
  console.log(request.params.username) // -> 'NodeJS'
})
```

### `allowUnsafeRegex`


+ Varsayılan: `false`

Varsayılan olarak devre dışıdır, bu nedenle yollar yalnızca güvenli düzenli ifadeleri kabul eder. Güvensiz ifadeleri kullanmak için `allowUnsafeRegex` seçeneğini `true` olarak ayarlayın.

```js
fastify.get('/user/:id(^([0-9]+){4}$)', (request, reply) => {
  // allowUnsafeRegex = true olmadan hata verecektir
})
```

### `requestIdHeader`


+ Varsayılan: `'request-id'`

İstek kimliğini ayarlamak için kullanılan başlık adıdır. `istek kimliği` bölümüne bakın. `requestIdHeader`'ı `true` olarak ayarlamak, `requestIdHeader`'ı `"request-id"` olarak ayarlayacaktır. `requestIdHeader`'ı boş olmayan bir dizeye ayarlamak, belirtilen dizeyi `requestIdHeader` olarak kullanacaktır. Varsayılan olarak `requestIdHeader` `false` olarak ayarlanır ve hemen `genReqId` kullanılır. `requestIdHeader`'ı boş bir dizeye (`""`) ayarlamak, requestIdHeader'ı `false` olarak ayarlayacaktır.

+ Varsayılan: `false`

```js
const fastify = require('fastify')({
  requestIdHeader: 'x-custom-id', // -> mevcutsa 'X-Custom-Id' başlığını kullan
  //requestIdHeader: false, // -> her zaman genReqId kullan
})
```

### `requestIdLogLabel`


+ Varsayılan: `'reqId'`

İsteği günlüklerken istek tanımlayıcısı için kullanılan etiketi tanımlar.

### `genReqId`


+ Varsayılan: `'request-id' başlığının değeri verildiyse veya monotonik artan tam sayılar`

İstek kimliğini oluşturmak için bir işlev. _Ham_ gelen isteği bir parametre olarak alacaktır. Bu işlevin hatasız olması beklenir.

Özellikle dağıtık sistemlerde, varsayılan ID oluşturma davranışını aşağıda gösterildiği gibi geçersiz kılmak isteyebilirsiniz. `UUID`'ler oluşturmak için [hyperid](https://github.com/mcollina/hyperid) projesini kontrol edebilirsiniz.

> **Not**
> `genReqId`, `requestIdHeader` altında ayarlanan başlık mevcutsa çağrılmaz (varsayılan olarak 'request-id' olur).

```js
let i = 0
const fastify = require('fastify')({
  genReqId: function (req) { return i++ }
})