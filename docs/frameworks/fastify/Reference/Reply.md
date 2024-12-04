---
title: Fastify
seoTitle: Fastify Documentation
sidebar_position: 1
description: Fastify is a powerful, high-performance web framework for Node.js. This section provides an overview of the response object and its functionalities.
tags: 
  - fastify
  - nodejs
  - web framework
  - http
keywords: 
  - fastify
  - node.js
  - response
  - http
---
## Yanıt
- `Yanıt`
  - `Giriş`
  - `.code(statusCode)`
  - `.elapsedTime`
  - `.statusCode`
  - `.server`
  - `.header(key, value)`
  - `.headers(object)`
  - `.getHeader(key)`
  - `.getHeaders()`
  - `.removeHeader(key)`
  - `.hasHeader(key)`
  - `.writeEarlyHints(hints, callback)`
  - `.trailer(key, function)`
  - `.hasTrailer(key)`
  - `.removeTrailer(key)`
  - [.redirect(dest, [code ,])](#redirectdest--code)
  - `.callNotFound()`
  - `.type(contentType)`
  - [.getSerializationFunction(schema | httpStatus, [contentType])](#getserializationfunctionschema--httpstatus)
  - [.compileSerializationSchema(schema, [httpStatus], [contentType])](#compileserializationschemaschema-httpstatus)
  - [.serializeInput(data, [schema | httpStatus], [httpStatus], [contentType])](#serializeinputdata-schema--httpstatus-httpstatus)
  - `.serializer(func)`
  - `.raw`
  - `.sent`
  - `.hijack()`
  - `.send(data)`
    - `Nesneler`
    - `Dizeler`
    - `Akışlar`
    - `Tamponlar`
    - `TypedArrays`
    - `ReadableStream`
    - `Yanıt`
    - `Hatalar`
    - `Son yükün türü`
    - `Async-Await ve Promisler`
  - `.then(fulfilled, rejected)`

### Giriş


Yardımcı işlevin ikinci parametresi `Yanıt`. Yanıt, aşağıdaki işlevleri ve özellikleri sergileyen bir temel Fastify nesnesidir:

- `.code(statusCode)` - Durum kodunu ayarlar.
- `.status(statusCode)` - `.code(statusCode)` için bir takma ad.
- `.statusCode` - HTTP durum kodunu okur ve ayarlar.
- `.elapsedTime` - Fastify tarafından istek alındıktan sonra geçen süreyi döndürür.
- `.server` - Fastify örnek nesnesine bir referans.
- `.header(name, value)` - Bir yanıt başlığını ayarlar.
- `.headers(object)` - Nesnenin tüm anahtarlarını yanıt başlıkları olarak ayarlar.
- `.getHeader(name)` - Daha önce ayarlanmış başlığın değerini alır.
- `.getHeaders()` - Tüm mevcut yanıt başlıklarının yüzeysel bir kopyasını alır.
- `.removeHeader(key)` - Daha önce ayarlanmış bir başlığın değerini kaldırır.
- `.hasHeader(name)` - Bir başlığın ayarlanıp ayarlanmadığını belirler.
- `.writeEarlyHints(hints, callback)` - Yanıt hazırlanırken kullanıcıya erken ipuçları gönderir.
- `.trailer(key, function)` - Bir yanıt arka başlığını ayarlar.
- `.hasTrailer(key)` - Bir arka başlığın ayarlanıp ayarlanmadığını belirler.
- `.removeTrailer(key)` - Daha önce ayarlanmış bir arka başlığın değerini kaldırır.
- `.type(value)` - `Content-Type` başlığını ayarlar.
- `.redirect(dest, [code,])` - Belirtilen URL'ye yönlendirir, durum kodu isteğe bağlıdır (varsayılan olarak `302`).
- `.callNotFound()` - Özel bulunamadı işleyicisini çağırır.
- `.serialize(payload)` - Belirtilen yükü varsayılan JSON seri hale getiricisi ile seri hale getirir.
- `.getSerializationFunction(schema | httpStatus, [contentType])` - Belirtilen şemaya veya HTTP durumuna göre seri hale getirme işlevini döndürür.
- `.compileSerializationSchema(schema, [httpStatus], [contentType])` - Belirtilen şemayı derleyip varsayılan ya da özelleştirilmiş `SerializerCompiler` kullanarak bir seri hale getirme işlevi döndürür.
- `.serializeInput(data, schema, [,httpStatus], [contentType])` - Belirtilen veriyi kullanarak belirtilen şemayı seri hale getirir ve seri hale getirilmiş yükü döndürür.
- `.serializer(function)` - Yük için özel bir seri hale getirici ayarlar.
- `.send(payload)` - Yükü kullanıcıya gönderir, düz metin, tampon, JSON, akış veya bir Hata nesnesi olabilir.
- `.sent` - `send` yönteminin daha önce çağrılıp çağrılmadığını öğrenmek isterseniz kullanabileceğiniz boolean bir değerdir.
- `.hijack()` - Normal istek yaşam döngüsünü kesintiye uğratır.
- `.raw` - Node çekirdekten bir [`http.ServerResponse`](https://nodejs.org/dist/latest-v20.x/docs/api/http.html#http_class_http_serverresponse).
- `.log` - Gelen isteğin günlüğü.
- `.request` - Gelen istek.

```js
fastify.get('/', options, function (request, reply) {
  // Kodunuzu buraya yazın
  reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({ hello: 'world' })
})
```

### .code(statusCode)


Eğer `reply.code` ile ayarlanmadıysa, sonuç olarak `statusCode` `200` olacaktır.

### .elapsedTime


Fastify tarafından istek alındıktan sonra geçen süreyi hesaplamak için özel yanıt süresi alıcısını çağırır.

```js
const milliseconds = reply.elapsedTime
```

### .statusCode


Bu özellik, HTTP durum kodunu okur ve ayarlar. Bir belirleyici olarak kullanıldığında `reply.code()` için bir takma addır.
```js
if (reply.statusCode >= 299) {
  reply.statusCode = 500
}
```

### .server


Fastify sunucu örneği, geçerli `kapsama bağlamına` sınıflandırılmıştır.

```js
fastify.decorate('util', function util () {
  return 'foo'
})

fastify.get('/', async function (req, rep) {
  return rep.server.util() // foo
})
```

### .header(key, value)


Bir yanıt başlığını ayarlar. Değer belirtilmediğinde veya undefined olduğunda, bu `' '` olarak zorlanır.

> **Not:** Başlıkların değeri uygun biçimde kodlanmış olmalıdır. 
> [`encodeURI`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI) veya
> [`encodeurl`](https://www.npmjs.com/package/encodeurl) gibi benzer modüller kullanılmalıdır. Geçersiz karakterler
> 500 `TypeError` yanıtına yol açacaktır.

Daha fazla bilgi için
[`http.ServerResponse#setHeader`](https://nodejs.org/dist/latest-v20.x/docs/api/http.html#http_response_setheader_name_value) adresine bakabilirsiniz.

- ### set-cookie
  

    - `set-cookie` anahtarı ile farklı değerler gönderirken, her değer önceki değerin yerine geçmek yerine bir çerez olarak gönderilecektir.

    ```js
    reply.header('set-cookie', 'foo');
    reply.header('set-cookie', 'bar');
    ```
  - Tarayıcı, `set-cookie` başlığındaki anahtarın yalnızca en son referansını dikkate alacaktır. Bu,
    yanıtı eklenirken `set-cookie` başlığının işlenmesini önlemek ve yanıtın serileştirilmesi sürecini hızlandırmak için yapılır.

  - `set-cookie` başlığını sıfırlamak için `reply.removeHeader('set-cookie')` adıyla açık bir çağrı yapmanız gerekir; daha fazla bilgi için `.removeHeader(key)` bölümüne bakabilirsiniz.

### .headers(object)


Nesnenin tüm anahtarlarını yanıt başlıkları olarak ayarlar. 
`.header` otomatik olarak çağrılır.
```js
reply.headers({
  'x-foo': 'foo',
  'x-bar': 'bar'
})
```

### .getHeader(key)


Daha önce ayarlanmış bir başlığın değerini alır.
```js
reply.header('x-foo', 'foo') // setHeader: anahtar, değer
reply.getHeader('x-foo') // 'foo'
```

### .getHeaders()


Daha önce ayarlanmış olan tüm yanıt başlıklarının yüzeysel bir kopyasını alır. Fastify tarafından ayarlanan başlıklar, `http.ServerResponse` tarafından ayarlanan başlıklardan önce gelir.

```js
reply.header('x-foo', 'foo')
reply.header('x-bar', 'bar')
reply.raw.setHeader('x-foo', 'foo2')
reply.getHeaders() // { 'x-foo': 'foo', 'x-bar': 'bar' }
```

### .removeHeader(key)


Daha önce ayarlanmış bir başlığın değerini kaldırır.
```js
reply.header('x-foo', 'foo')
reply.removeHeader('x-foo')
reply.getHeader('x-foo') // undefined
```

### .hasHeader(key)


Belirtilen başlığın ayarlanıp ayarlanmadığını bildiren bir boolean değer döndürür.

### .writeEarlyHints(hints, callback)


Erken ipuçlarını istemciye gönderir. Erken ipuçları, istemcinin son yanıt gönderilmeden önce kaynakları işlemeye başlamasına olanak tanır. Bu, istemcinin yanıt hala oluşturulurken kaynakları önceden yüklemesi veya ön bağlanmasını sağladığından performansı artırabilir.

İpuçları parametresi, erken ipuçları anahtar-değer çiftlerini içeren bir nesnedir.

```js
reply.writeEarlyHints({
  Link: '</styles.css>; rel=preload; as=style'
});
```

İsteğe bağlı callback parametresi, ipucunun gönderilmesi veya bir hata meydana gelirse çağrılacak bir işlevdir.

### .trailer(key, function)


Bir yanıt arka başlığını ayarlar. Arka başlık, `data` sonrasında gönderilmesi gereken ve ağır kaynaklar gerektiren bir başlık gereksinimi olduğunda kullanılır, örneğin `Server-Timing` ve `Etag`. Bu, istemcinin yanıt verilerini mümkün olan en kısa sürede almasını sağlar.

*Not: `Transfer-Encoding: chunked` başlığı, arka başlık kullanıldığında eklenecektir. Bu, Node.js'te arka başlık kullanmanın zorunlu bir gerekliliğidir.*

*Not: `done` callback'ine geçirilen herhangi bir hata yok sayılacaktır. Eğer hata ile ilgileniyorsanız, `debug` seviye günlüğü açabilirsiniz.*

```js
reply.trailer('server-timing', function() {
  return 'db;dur=53, app;dur=47.2'
})

const { createHash } = require('node:crypto')
// Arka başlık işlevi de iki argüman alır
// @param {object} reply fastify cevap
// @param {string|Buffer|null} payload önceden gönderilmiş yük, akış gönderildiğinde null olacaktır
// @param {function} done arka başlık değerini ayarlamak için callback
reply.trailer('content-md5', function(reply, payload, done) {
  const hash = createHash('md5')
  hash.update(payload)
  done(null, hash.digest('hex'))
})

// Async-await tercih ederseniz
reply.trailer('content-md5', async function(reply, payload) {
  const hash = createHash('md5')
  hash.update(payload)
  return hash.digest('hex')
})
```

### .hasTrailer(key)


Belirtilen arka başlığın ayarlanıp ayarlanmadığını bildiren bir boolean değer döndürür.

### .removeTrailer(key)


Daha önce ayarlanmış bir arka başlığın değerini kaldırır.
```js
reply.trailer('server-timing', function() {
  return 'db;dur=53, app;dur=47.2'
})
reply.removeTrailer('server-timing')
reply.getTrailer('server-timing') // undefined
```

### .redirect(dest, [code ,])


Belirtilen URL'ye bir isteği yönlendirir, durum kodu isteğe bağlıdır, varsayılan olarak `302` (eğer durum kodu daha önce `code` çağrısı ile ayarlanmamışsa).

> **Not:** Girdi URL'si uygun biçimde kodlanmış olmalıdır 
> [`encodeURI`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI) veya 
> [`encodeurl`](https://www.npmjs.com/package/encodeurl) gibi benzer modüller kullanılmalıdır. Geçersiz URL'ler
> 500 `TypeError` yanıtına yol açacaktır.

Örnek (hiç `reply.code()` çağrısı yok) durum kodunu `302` olarak ayarlar ve `/home`'a yönlendirir.
```js
reply.redirect('/home')
```

Örnek (hiç `reply.code()` çağrısı yok) durum kodunu `303` olarak ayarlar ve `/home`'a yönlendirir.
```js
reply.redirect('/home', 303)
```

Örnek (`reply.code()` çağrısı) durum kodunu `303` olarak ayarlar ve `/home`'a yönlendirir.
```js
reply.code(303).redirect('/home')
```

Örnek (`reply.code()` çağrısı) durum kodunu `302` olarak ayarlar ve `/home`'a yönlendirir.
```js
reply.code(303).redirect('/home', 302)
```

### .callNotFound()


Özel bulunamadı işleyicisini çağırır. **Not:** yalnızca `setNotFoundHandler` ile belirtilen
`preHandler` kancası çağrılacaktır.

```js
reply.callNotFound()
```

### .type(contentType)


Yanıt için içerik türünü ayarlar. Bu,  `reply.header('Content-Type', 'the/type')` için bir kısayoldur.

```js
reply.type('text/html')
```
Eğer `Content-Type` bir JSON alt türüne sahipse ve charset parametresi ayarlanmamışsa, varsayılan olarak `utf-8` kullanılır.

### .getSerializationFunction(schema | httpStatus, [contentType])


Bu işlev, sağlanan bir `schema` veya `httpStatus` kullanılarak çağrıldığında, ve isteğe bağlı `contentType` ile birlikte, çeşitli girdileri seri hale getirmek için kullanılabilecek bir `serileştirme` işlevi döndürecektir. Eğer sağlanan girdi ile hiçbir seri hale getirme işlevi bulunamazsa, `undefined` dönecektir.

Bu, güzergaha bağlı olan `schema#responses` veya `compileSerializationSchema` kullanılarak derlenen seri hale getirme işlevlerine büyük ölçüde bağlıdır.

```js
const serialize = reply
                  .getSerializationFunction({
                    type: 'object',
                    properties: {
                      foo: {
                        type: 'string'
                      }
                    }
                  })
serialize({ foo: 'bar' }) // '{"foo":"bar"}'

// veya

const serialize = reply
                  .getSerializationFunction(200)
serialize({ foo: 'bar' }) // '{"foo":"bar"}'

// veya

const serialize = reply
                  .getSerializationFunction(200, 'application/json')
serialize({ foo: 'bar' }) // '{"foo":"bar"}'
```

Daha fazla bilgi için [.compileSerializationSchema(schema, [httpStatus], [contentType])](#compileserializationschema) bölümüne göz atın.

### .compileSerializationSchema(schema, [httpStatus], [contentType])


Bu işlev, bir seri hale getirme şemasını derleyecek ve veriyi seri hale getirmek için kullanılabilecek bir işlev döndürecektir. Döndürülen işlev, sağlanan `SerializerCompiler` kullanılarak derlenir. Bu ayrıca, derleme çağrılarını azaltmak için bir `WeakMap` kullanılarak önbelleğe alınır.

İsteğe bağlı `httpStatus` ve `contentType` parametreleri, `SerializerCompiler`'a doğrudan iletilir; böylece, özel bir `SerializerCompiler` kullanıldığında seri hale getirme işlevinin derlenmesi için kullanılabilir.

Bu, güzergaha bağlı olan `schema#responses` veya `compileSerializationSchema` kullanılarak derlenen seri hale getirme işlevlerine büyük ölçüde bağlıdır.

```js
const serialize = reply
                  .compileSerializationSchema({
                    type: 'object',
                    properties: {
                      foo: {
                        type: 'string'
                      }
                    }
                  })
serialize({ foo: 'bar' }) // '{"foo":"bar"}'

// veya

const serialize = reply
                  .compileSerializationSchema({
                    type: 'object',
                    properties: {
                      foo: {
                        type: 'string'
                      }
                    }
                  }, 200)
serialize({ foo: 'bar' }) // '{"foo":"bar"}'

// veya

const serialize = reply
                  .compileSerializationSchema({
                        '3xx': {
                          content: {
                            'application/json': {
                              schema: {
                                name: { type: 'string' },
                                phone: { type: 'number' }
                              }
                            }
                          }
                        }
                  }, '3xx', 'application/json')
serialize({ name: 'Jone', phone: 201090909090 }) // '{"name":"Jone", "phone":201090909090}'
```

Bu işlevi kullanırken dikkatli olmalısınız, çünkü sağlanan şemaya bağlı olarak derlenmiş serileştirme işlevlerini önbelleğe alır. Sağlanan şemalar değiştirilirse veya bozulursa, serileştirme işlevleri şemanın değiştirildiğini algılamaz ve örneğin, daha önce sağlanan şema referansına dayanarak önceki derlenmiş serileştirme işlevini yeniden kullanır.

Bir şemanın özelliklerini değiştirmek gerektiğinde, her zaman tamamen yeni bir nesne oluşturarak tercih etmelisiniz, aksi halde uygulama önbellek mekanizmasından yararlanamaz.

:Aşağıdaki şemayı örnek olarak kullanarak:
```js
const schema1 = {
  type: 'object',
  properties: {
    foo: {
      type: 'string'
    }
  }
}
```

*Değil*
```js
const serialize = reply.compileSerializationSchema(schema1)

// Daha sonra...
schema1.properties.foo.type. = 'integer'
const newSerialize = reply.compileSerializationSchema(schema1)

console.log(newSerialize === serialize) // true
```

*Bunun yerine*
```js
const serialize = reply.compileSerializationSchema(schema1)

// Daha sonra...
const newSchema = Object.assign({}, schema1)
newSchema.properties.foo.type = 'integer'

const newSerialize = reply.compileSerializationSchema(newSchema)

console.log(newSerialize === serialize) // false
```

### .serializeInput(data, [schema | httpStatus], [httpStatus], [contentType])


Bu işlev, sağlanan şemaya veya HTTP durum koduna göre giriş verisini seri hale getirecektir. Eğer her ikisi de sağlanırsa, `httpStatus` öncelik kazanır.

Veri için verilen bir `schema` için bir serileştirme işlevi yoksa, yeni bir serileştirme işlevi derlenecek; `httpStatus` ve `contentType` sağlanmışsa, bunlar bildirilecektir.

```js
reply
  .serializeInput({ foo: 'bar'}, {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    }
  }) // '{"foo":"bar"}'

// veya

reply
  .serializeInput({ foo: 'bar'}, {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    }
  }, 200) // '{"foo":"bar"}'

// veya

reply
  .serializeInput({ foo: 'bar'}, 200) // '{"foo":"bar"}'

// veya

reply
  .serializeInput({ name: 'Jone', age: 18 }, '200', 'application/vnd.v1+json') // '{"name": "Jone", "age": 18}'
```

Daha fazla bilgi için [.compileSerializationSchema(schema, [httpStatus], [contentType])](#compileserializationschema) bölümüne göz atın.

### .serializer(func)


Varsayılan olarak, `.send()` hiçbir `Buffer`, `stream`, `string`, `undefined` veya `Error` olmayan herhangi bir değeri JSON olarak seri hale getirecektir. Belirli bir istek için varsayılan seri hale getiriciyi değiştirmek isterseniz, bunu `.serializer()` işlevi ile yapabilirsiniz. Özel bir seri hale getirici kullanıyorsanız, özel bir `'Content-Type'` başlığı ayarlamanız gerektiğini unutmayın.

```js
reply
  .header('Content-Type', 'application/x-protobuf')
  .serializer(protoBuf.serialize)
```

Bu işlevi bir `handler` içinde kullanmanıza gerek yoktur, çünkü Tamponlar, akışlar ve dizeler (bir seri hale getirici ayarlanmadıkça) zaten seri hale getirilmiş olarak kabul edilir.

```js
reply
  .header('Content-Type', 'application/x-protobuf')
  .send(protoBuf.serialize(data))
```

Farklı türde değerler göndermek için daha fazla bilgi için `.send()` bölümüne göz atın.

### .raw


Bu, Node çekirdeğinden bir [`http.ServerResponse`](https://nodejs.org/dist/latest-v20.x/docs/api/http.html#http_class_http_serverresponse) nesnesidir. Fastify `Yanıt` nesnesini kullanıyor olsanız da, `Yanıt.raw` işlevlerini kullanmanız kendi riskinizdedir, çünkü HTTP yanıtını işleme konusundaki tüm Fastify mantığını atlamış olursunuz. Örneğin:

```js
app.get('/cookie-2', (req, reply) => {
  reply.setCookie('session', 'value', { secure: false }) // bu kullanılmayacaktır

  // Bu durumda yalnızca nodejs http sunucu yanıt nesnesini kullanıyoruz
  reply.raw.writeHead(200, { 'Content-Type': 'text/plain' })
  reply.raw.write('ok')
  reply.raw.end()
})
```
`Yanıt.raw`'ın kötüye kullanımına dair başka bir örnek `Yanıt` bölümünde açıkça belirtilmiştir.