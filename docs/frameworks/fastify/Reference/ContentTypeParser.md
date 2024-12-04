---
title: Fastify
seoTitle: Fastify Documentation - Content-Type Parser
sidebar_position: 4
description: Fastify supports only application/json and text/plain content types natively. This guide explains how to handle content type parsing using the Fastify framework.
tags: 
  - Fastify
  - Content-Type Parser
  - API
  - Web Development
keywords: 
  - Fastify
  - content-type
  - parsing
  - API
  - web framework
---
## `Content-Type` Ayrıştırıcı
Fastify, yerel olarak yalnızca `'application/json'` ve `'text/plain'` içerik türlerini destekler. Eğer içerik türü bunlardan biri değilse, bir `FST_ERR_CTP_INVALID_MEDIA_TYPE` hatası fırlatılacaktır. Diğer yaygın içerik türleri, [eklenti](https://fastify.dev/ecosystem/) kullanılarak desteklenir.

Varsayılan karakter seti `utf-8`'dir. Eğer farklı içerik türlerini desteklemeniz gerekiyorsa, `addContentTypeParser` API'sını kullanabilirsiniz. **Varsayılan JSON ve/veya düz metin ayrıştırıcısı değiştirilebilir veya kaldırılabilir.**

:::note
Eğer `Content-Type` başlığı ile kendi içerik türünüzü belirtmeyi seçerseniz, UTF-8 varsayılan olmayacaktır. UTF-8'i bu şekilde dahil ettiğinizden emin olun `text/html; charset=utf-8`.
:::

Diğer API'lerde olduğu gibi, `addContentTypeParser` tanımlandığı kapsamda kapsüllenmiştir. Bu, kök kapsamda tanımlanırsa her yerde kullanılabilen, eğer bir eklenti içinde tanımlanırsa yalnızca o kapsamda ve altlarında kullanılabilen anlamına gelir.

Fastify, ayrıştırılmış istek yükünü `Fastify request` nesnesine otomatik olarak ekler ve buna `request.body` ile erişebilirsiniz.

`GET` ve `HEAD` istekleri için yük asla ayrıştırılmaz. `OPTIONS` ve `DELETE` istekleri için yük yalnızca içerik türü içerik türü başlığında verildiğinde ayrıştırılır. Verilmezse, `catch-all` ayrıştırıcısı `POST`, `PUT` ve `PATCH` ile olduğu gibi çalıştırılmaz, yük basitçe ayrıştırılmaz.

> ## ⚠ Güvenlik Notu
> `Content-Type`'ı tespit etmek için RegExp kullanırken, `Content-Type`'ı nasıl doğru bir şekilde tespit edeceğinize dikkat etmelisiniz. Örneğin, eğer `application/*` gerekiyorsa, yalnızca [öz MIME türü](https://mimesniff.spec.whatwg.org/#mime-type-miscellaneous) ile eşleşmek için `/^application\/([\w-]+);?/` kullanmalısınız.

### Kullanım
```js
fastify.addContentTypeParser('application/jsoff', function (request, payload, done) {
  jsoffParser(payload, function (err, body) {
    done(err, body)
  })
})

// Aynı fonksiyonla birden fazla içerik türünü işleyin
fastify.addContentTypeParser(['text/xml', 'application/xml'], function (request, payload, done) {
  xmlParser(payload, function (err, body) {
    done(err, body)
  })
})

// Node versiyonu >= 8.0.0'da asenkron da desteklenir
fastify.addContentTypeParser('application/jsoff', async function (request, payload) {
  const res = await jsoffParserAsync(payload)

  return res
})

// RegExp ile eşleşen tüm içerik türlerini işleyin
fastify.addContentTypeParser(/^image\/([\w-]+);?/, function (request, payload, done) {
  imageParser(payload, function (err, body) {
    done(err, body)
  })
})

// Farklı içerik türleri için varsayılan JSON/Düz metin ayrıştırıcısını kullanabilirsiniz
fastify.addContentTypeParser('text/json', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))
```

Fastify önce `string` değeri ile bir içerik türü ayrıştırıcısını eşleştirmeye çalışır, ardından eşleşen bir `RegExp` bulmaya çalışır. Eğer örtüşen içerik türleri sağlarsanız, Fastify son geçilen içerik türüyle başlayıp ilk geçilene kadar eşleşen içerik türünü bulmaya çalışır. Yani genel bir içerik türünü daha kesin belirtmek isterseniz, önce genel içerik türünü ve ardından daha özel olanı belirtmelisiniz, aşağıdaki örnekte olduğu gibi.

```js
// Burada yalnızca ikinci içerik türü ayrıştırıcısı çağrılır çünkü değeri aynı zamanda ilk ile de eşleşmektedir
fastify.addContentTypeParser('application/vnd.custom+xml', (request, body, done) => {} )
fastify.addContentTypeParser('application/vnd.custom', (request, body, done) => {} )

// Burada istenen davranış elde edilir çünkü fastify önce `application/vnd.custom+xml` içerik türü ayrıştırıcısını eşleştirmeye çalışır
fastify.addContentTypeParser('application/vnd.custom', (request, body, done) => {} )
fastify.addContentTypeParser('application/vnd.custom+xml', (request, body, done) => {} )
```

#.register ile addContentTypeParser Kullanımı
`addContentTypeParser`'ı `fastify.register` ile kombinasyonu sırasında, rotaları kaydederken `await` kullanılmamalıdır. `await` kullanımı, rota kaydını asenkron hale getirir ve kayıtların `addContentTypeParser` set edilmeden önce kaydedilmesine neden olabilir.

#### Doğru Kullanım
```js
const fastify = require('fastify')();

fastify.register((fastify, opts) => {
  fastify.addContentTypeParser('application/json', function (request, payload, done) {
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  })

  fastify.get('/hello', async (req, res) => {});
});
```

`addContentTypeParser` API'sının yanı sıra kullanılabilecek diğer API'lar da vardır. Bunlar `hasContentTypeParser`, `removeContentTypeParser` ve `removeAllContentTypeParsers`.

#### hasContentTypeParser

Belirli bir içerik türü ayrıştırıcısının zaten mevcut olup olmadığını öğrenmek için `hasContentTypeParser` API'sını kullanabilirsiniz.

```js
if (!fastify.hasContentTypeParser('application/jsoff')){
  fastify.addContentTypeParser('application/jsoff', function (request, payload, done) {
    jsoffParser(payload, function (err, body) {
      done(err, body)
    })
  })
}
```

#### removeContentTypeParser

`removeContentTypeParser` ile bir veya bir dizi içerik türü kaldırılabilir. Bu yöntem `string` ve `RegExp` içerik türlerini destekler.

```js
fastify.addContentTypeParser('text/xml', function (request, payload, done) {
  xmlParser(payload, function (err, body) {
    done(err, body)
  })
})

// Yalnızca text/html için içerik türü ayrıştırıcısı mevcut olacak şekilde her iki yerleşik içerik türü ayrıştırıcısını kaldırır
fastify.removeContentTypeParser(['application/json', 'text/plain'])
```

#### removeAllContentTypeParsers

Yukarıdaki örnekte, kaldırmak istediğimiz her içerik türünü belirtmek zorunda olduğumuzu fark etmek mümkündür. Bu sorunu çözmek için Fastify, `removeAllContentTypeParsers` API'sini sunar. Bu, mevcut tüm içerik türü ayrıştırıcılarını kaldırmak için kullanılabilir. Aşağıdaki örnekte, yukarıdaki örnekle aynı sonuca ulaşıyoruz, sadece silmek istediğimiz her içerik türünü belirtmemize gerek kalmıyor. `removeContentTypeParser` gibi, bu API'de kapsülleme desteği vardır. Bu API, her içerik türü için çalıştırılıp yerleşik ayrıştırıcıların göz ardı edilmesi gereken bir `catch-all içerik türü ayrıştırıcısı` kaydetmek istediğinizde özellikle kullanışlıdır.

```js
fastify.removeAllContentTypeParsers()

fastify.addContentTypeParser('text/xml', function (request, payload, done) {
  xmlParser(payload, function (err, body) {
    done(err, body)
  })
})
```

**Not**: Ayrıştırıcı için eski sözdizimleri `function(req, done)` ve `async function(req)` hala desteklenmektedir ancak kullanılmaları tavsiye edilmemektedir.

#### Gövde Ayrıştırıcı
Bir isteğin gövdesini iki şekilde ayrıştırabilirsiniz. İlk yol yukarıda gösterilmiştir: özel bir içerik türü ayrıştırıcısı ekleyip istek akışını yönetirsiniz. İkincisi, `addContentTypeParser` API'sına bir `parseAs` seçeneği geçmenizdir; burada gövdeyi nasıl almak istediğinizi belirtirsiniz. Bu, `'string'` veya `'buffer'` türünde olabilir. Eğer `parseAs` seçeneğini kullanıyorsanız, Fastify stream'i dahili olarak yönetir ve gövdenin `maksimum boyutu` ve içerik uzunluğu gibi bazı kontroller yapar. Limit aşılırsa, özel ayrıştırıcı çağrılmayacaktır.
```js
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
  try {
    const json = JSON.parse(body)
    done(null, json)
  } catch (err) {
    err.statusCode = 400
    done(err, undefined)
  }
})
```

[`example/parser.js`](https://github.com/fastify/fastify/blob/main/examples/parser.js) örneği için bakınız.

##### Özel Ayrıştırıcı Seçenekleri
+ `parseAs` (string): Gelen verilerin nasıl toplanacağını belirlemek için `'string'` veya `'buffer'`. Varsayılan: `'buffer'`.
+ `bodyLimit` (number): Özel ayrıştırıcının kabul edeceği maksimum yük boyutu (bayt cinsinden). Varsayılan, `Fastify fabrika fonksiyonu` için iletilen global gövde limitidir.

#### Catch-All
Bazı durumlarda, içerik türleri ne olursa olsun, tüm istekleri yakalamanız gerekebilir. Fastify ile yalnızca `'*'` içerik türünü kullanabilirsiniz.
```js
fastify.addContentTypeParser('*', function (request, payload, done) {
  let data = ''
  payload.on('data', chunk => { data += chunk })
  payload.on('end', () => {
    done(null, data)
  })
})
```

Bunu kullanarak, karşılık gelen bir içerik türü ayrıştırıcısı olmayan tüm istekler belirtilen fonksiyon tarafından işlenecektir.

Bu, istek akışını yönlendirmek için de kullanışlıdır. Bir içerik ayrıştırıcısını şu şekilde tanımlayabilirsiniz:

```js
fastify.addContentTypeParser('*', function (request, payload, done) {
  done()
})
```

ve ardından temel HTTP isteğine doğrudan erişim sağlayarak istediğiniz yere yönlendirmek için:

```js
app.post('/hello', (request, reply) => {
  reply.send(request.raw)
})
```

Gelen [json line](https://jsonlines.org/) nesnelerini kaydeden bir örnek:

```js
const split2 = require('split2')
const pump = require('pump')

fastify.addContentTypeParser('*', (request, payload, done) => {
  done(null, pump(payload, split2(JSON.parse)))
})

fastify.route({
  method: 'POST',
  url: '/api/log/jsons',
  handler: (req, res) => {
    req.body.on('data', d => console.log(d)) // her gelen nesneyi kaydedin
  }
})
 ```

Dosya yüklemelerini yönlendirmek istiyorsanız [bu eklentiye](https://github.com/fastify/fastify-multipart) göz atmalısınız.

Eğer içerik türü ayrıştırıcısının yalnızca spesifik birini değil, tüm içerik türlerinde çalıştırılmasını istiyorsanız, öncelikle `removeAllContentTypeParsers` yöntemini çağırmalısınız.

```js
// Bu çağrı olmadan, application/json içerik türündeki istek gövdesi yerleşik JSON ayrıştırıcısı tarafından işlenecektir
fastify.removeAllContentTypeParsers()

fastify.addContentTypeParser('*', function (request, payload, done) {
  const data = ''
  payload.on('data', chunk => { data += chunk })
  payload.on('end', () => {
    done(null, data)
  })
})