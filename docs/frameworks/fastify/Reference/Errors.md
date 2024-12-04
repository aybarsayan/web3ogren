---
title: Fastify
seoTitle: Fastify Error Management
sidebar_position: 4
description: This document covers error management in Fastify, including handling uncaught errors and specific error codes. It highlights best practices for managing errors effectively in a Node.js environment.
tags: 
  - Fastify
  - Error Management
  - Node.js
  - API Development
keywords: 
  - Fastify
  - Error Handling
  - Node.js
  - API Development
---
## Hatalar


**İçindekiler**
- `Hatalar`
  - `Node.js İçinde Hata Yönetimi`
    - `Yakalanmamış Hatalar`
    - `Sözleşmelerde Hataları Yakalama`
  - `Fastify İçindeki Hatalar`
    - `Giriş Verilerindeki Hatalar`
    - `Fastify İçinde Yakalanmamış Hataları Yakalama`
  - `Fastify Yaşam Döngüsü Kancalarında ve Özel Hata Yönetici`
  - `Fastify Hata Kodları`
    - `FST_ERR_NOT_FOUND`
    - `FST_ERR_OPTIONS_NOT_OBJ`
    - `FST_ERR_QSP_NOT_FN`
    - `FST_ERR_SCHEMA_CONTROLLER_BUCKET_OPT_NOT_FN`
    - `FST_ERR_SCHEMA_ERROR_FORMATTER_NOT_FN`
    - `FST_ERR_AJV_CUSTOM_OPTIONS_OPT_NOT_OBJ`
    - `FST_ERR_AJV_CUSTOM_OPTIONS_OPT_NOT_ARR`
    - `FST_ERR_CTP_ALREADY_PRESENT`
    - `FST_ERR_CTP_INVALID_TYPE`
    - `FST_ERR_CTP_EMPTY_TYPE`
    - `FST_ERR_CTP_INVALID_HANDLER`
    - `FST_ERR_CTP_INVALID_PARSE_TYPE`
    - `FST_ERR_CTP_BODY_TOO_LARGE`
    - `FST_ERR_CTP_INVALID_MEDIA_TYPE`
    - `FST_ERR_CTP_INVALID_CONTENT_LENGTH`
    - `FST_ERR_CTP_EMPTY_JSON_BODY`
    - `FST_ERR_CTP_INSTANCE_ALREADY_STARTED`
    - `FST_ERR_INSTANCE_ALREADY_LISTENING`
    - `FST_ERR_DEC_ALREADY_PRESENT`
    - `FST_ERR_DEC_DEPENDENCY_INVALID_TYPE`
    - `FST_ERR_DEC_MISSING_DEPENDENCY`
    - `FST_ERR_DEC_AFTER_START`
    - `FST_ERR_DEC_REFERENCE_TYPE`
    - `FST_ERR_HOOK_INVALID_TYPE`
    - `FST_ERR_HOOK_INVALID_HANDLER`
    - `FST_ERR_HOOK_INVALID_ASYNC_HANDLER`
    - `FST_ERR_HOOK_NOT_SUPPORTED`
    - `FST_ERR_MISSING_MIDDLEWARE`
    - `FST_ERR_HOOK_TIMEOUT`
    - `FST_ERR_LOG_INVALID_DESTINATION`
    - `FST_ERR_LOG_INVALID_LOGGER`
    - `FST_ERR_LOG_INVALID_LOGGER_INSTANCE`
    - `FST_ERR_LOG_INVALID_LOGGER_CONFIG`
    - `FST_ERR_LOG_LOGGER_AND_LOGGER_INSTANCE_PROVIDED`
    - `FST_ERR_REP_INVALID_PAYLOAD_TYPE`
    - `FST_ERR_REP_RESPONSE_BODY_CONSUMED`
    - `FST_ERR_REP_ALREADY_SENT`
    - `FST_ERR_REP_SENT_VALUE`
    - `FST_ERR_SEND_INSIDE_ONERR`
    - `FST_ERR_SEND_UNDEFINED_ERR`
    - `FST_ERR_BAD_STATUS_CODE`
    - `FST_ERR_BAD_TRAILER_NAME`
    - `FST_ERR_BAD_TRAILER_VALUE`
    - `FST_ERR_FAILED_ERROR_SERIALIZATION`
    - `FST_ERR_MISSING_SERIALIZATION_FN`
    - `FST_ERR_MISSING_CONTENTTYPE_SERIALIZATION_FN`
    - `FST_ERR_REQ_INVALID_VALIDATION_INVOCATION`
    - `FST_ERR_SCH_MISSING_ID`
    - `FST_ERR_SCH_ALREADY_PRESENT`
    - `FST_ERR_SCH_CONTENT_MISSING_SCHEMA`
    - `FST_ERR_SCH_DUPLICATE`
    - `FST_ERR_SCH_VALIDATION_BUILD`
    - `FST_ERR_SCH_SERIALIZATION_BUILD`
    - `FST_ERR_SCH_RESPONSE_SCHEMA_NOT_NESTED_2XX`
    - `FST_ERR_HTTP2_INVALID_VERSION`
    - `FST_ERR_INIT_OPTS_INVALID`
    - `FST_ERR_FORCE_CLOSE_CONNECTIONS_IDLE_NOT_AVAILABLE`
    - `FST_ERR_DUPLICATED_ROUTE`
    - `FST_ERR_BAD_URL`
    - `FST_ERR_ASYNC_CONSTRAINT`
    - `FST_ERR_INVALID_URL`
    - `FST_ERR_ROUTE_OPTIONS_NOT_OBJ`
    - `FST_ERR_ROUTE_DUPLICATED_HANDLER`
    - `FST_ERR_ROUTE_HANDLER_NOT_FN`
    - `FST_ERR_ROUTE_MISSING_HANDLER`
    - `FST_ERR_ROUTE_METHOD_INVALID`
    - `FST_ERR_ROUTE_METHOD_NOT_SUPPORTED`
    - `FST_ERR_ROUTE_BODY_VALIDATION_SCHEMA_NOT_SUPPORTED`
    - `FST_ERR_ROUTE_BODY_LIMIT_OPTION_NOT_INT`
    - `FST_ERR_ROUTE_REWRITE_NOT_STR`
    - `FST_ERR_REOPENED_CLOSE_SERVER`
    - `FST_ERR_REOPENED_SERVER`
    - `FST_ERR_PLUGIN_VERSION_MISMATCH`
    - `FST_ERR_PLUGIN_CALLBACK_NOT_FN`
    - `FST_ERR_PLUGIN_NOT_VALID`
    - `FST_ERR_ROOT_PLG_BOOTED`
    - `FST_ERR_PARENT_PLUGIN_BOOTED`
    - `FST_ERR_PLUGIN_TIMEOUT`
    - `FST_ERR_PLUGIN_NOT_PRESENT_IN_INSTANCE`
    - `FST_ERR_PLUGIN_INVALID_ASYNC_HANDLER`
    - `FST_ERR_VALIDATION`
    - `FST_ERR_LISTEN_OPTIONS_INVALID`
    - `FST_ERR_ERROR_HANDLER_NOT_FN`

### Node.js İçinde Hata Yönetimi


#### Yakalanmamış Hatalar
Node.js’de yakalanmamış hatalar, bellek sızıntılarına, dosya tanımlayıcı sızıntılarına ve diğer büyük üretim sorunlarına neden olabilir. 
[Domain'ler](https://nodejs.org/en/docs/guides/domain-postmortem/) bunu çözmek için başarısız bir girişimdi.

Tüm yakalanmamış hataları mantıklı bir şekilde işlemek mümkün olmadığından, onlarla başa çıkmanın en iyi yolu 
[çökme](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly).

#### Sözleşmelerde Hataları Yakalama
Eğer sözleşmeleri kullanıyorsanız, senkron olarak `.catch()` yöneticisini eklemelisiniz.

# İçindeki Hatalar
Fastify, her şey ya da hiçbiri yaklaşımını takip eder ve mümkün olduğunca hafif ve optimal olmaya çalışır. Geliştirici, hataların düzgün bir şekilde işlenmesini sağlamakla sorumludur.

#### Giriş Verilerindeki Hatalar
Most errors are a result of unexpected input data, so we recommend `validating your input data against a JSON schema`.

## İçinde Yakalanmamış Hataları Yakalama
Fastify, performansı engellemeden yakalanmamış hataları mümkün olduğunca yakalamaya çalışır. Bu şunları içerir:

1. senkron rotalar, örneğin `app.get('/', () => { throw new Error('kaboom') })`
2. `async` rotalar, örneğin `app.get('/', async () => { throw new Error('kaboom') })`

Her iki durumda da hata güvenli bir şekilde yakalanır ve Fastify’ın varsayılan hata yöneticisine yönlendirilir, bu da genel bir `500 Internal Server Error` yanıtı gönderir.

Bu davranışı özelleştirmek için 
`setErrorHandler` kullanmalısınız.

# Yaşam Döngüsü Kancalarında ve Özel Hata Yönetici

`Hooks belgelerinde` belirtildiği gibi:
> Eğer kanca yürütmesi sırasında bir hata alırsanız, sadece `done()`'a iletin ve Fastify otomatik olarak isteği kapatacak ve kullanıcıya uygun hata kodunu gönderecektir.

Özel bir hata yöneticisi, `setErrorHandler` üzerinden tanımlandığında, bu yönetici `done()` geri çağrısına geçen hatayı (veya diğer desteklenen otomatik hata yönetimi mekanizmaları aracılığıyla) alır. `setErrorHandler` birden çok kez kullanılarak birden çok yönetici tanımlanırsa, hata, hata `kapsama bağlamında` tanımlanan en önde gelen yöneticisine yönlendirilir. Hata yöneticileri tamamen kapsüllenmiştir, bu nedenle bir eklenti içinde `setErrorHandler` çağrısı, hata yöneticisini yalnızca o eklentinin bağlamı ile sınırlayacaktır.

Kök hata yöneticisi, Fastify'ın genel hata yöneticisidir. Bu hata yöneticisi, mevcutsa `Error` nesnesindeki başlıkları ve durum kodunu kullanacaktır. Özel bir hata yöneticisi sağlanırsa, başlıklar ve durum kodu otomatik olarak ayarlanmıyor.

Özel hata yöneticiğinizde dikkate almanız gereken bazı şeyler:

- `reply.send(data)` çağrısı yapabilirsiniz, bu da `normal rota yöneticilerinde` nasıl davranıyorsa öyle davranacaktır.
  - nesneler serileştirilir, tanımlı bir `preSerialization` yaşam döngüsü kancası varsa bu tetiklenir
  - dizeler, tamponlar ve akışlar istemciye gönderilir, uygun başlıklarla (serileştirme yok)

- Özel hata yöneticinizde yeni bir hata fırlatabilirsiniz - hatalar (yeni hata veya alınan hata parametresi tekrar fırlatılır) - üst `errorHandler`'ı çağıracaktır.
  - `onError` kancası yalnızca ilk fırlatılan hata için bir kez tetiklenecektir.
  - bir yaşam döngüsü kancasından hata iki kez tetiklenmeyecektir - Fastify, hata çağrısını içsel olarak izleyerek yanıtlama aşamalarında (rota yöneticisinden sonraki) meydana gelen sonsuz döngülerden kaçınır.

`setErrorHandler` üzerinden Fastify'ın özel hata yönetimini kullanırken, özel ve varsayılan hata yöneticileri arasındaki hata yayılımının nasıl olduğunu bilmelisiniz.

Eğer bir eklentinin hata yöneticisi bir hatayı tekrar fırlatırsa ve hata [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) örneği değilse (aşağıdaki örnekte `/bad` rotasında görüldüğü gibi), bu hata üst bağlam hata yöneticisine yayılmayacaktır. Bunun yerine varsayılan hata yöneticisi tarafından yakalanacaktır.

Tutarlı bir hata yönetimi sağlamak için, `Error` örnekleri fırlatmanız önerilir. Örneğin, aşağıdaki örnekte `/bad` rotasında `throw 'foo'` yerine `throw new Error('foo')` kullanmak, hataların özel hata yönetim zincirinde gerektiği gibi yayılmasını sağlar. Bu uygulama, Fastify'da özel hata yönetimi ile çalışırken potansiyel tehlikelerden kaçınmanıza yardımcı olur.

Örneğin:
```js
const Fastify = require('fastify')

// Çerçeveyi başlat
const fastify = Fastify({
  logger: true
})

// Üst hata yöneticisini ekle
fastify.setErrorHandler((error, request, reply) => {
  reply.status(500).send({ ok: false })
})

fastify.register((app, options, next) => {
  // Çocuk hata yöneticisini ekle
  fastify.setErrorHandler((error, request, reply) => {
    throw error
  })

  fastify.get('/bad', async () => {
    // Hata tipinde bir değer fırlatır, 'bar'
    throw 'foo'
  })

  fastify.get('/good', async () => {
    // Bir Error örneği fırlatır, 'bar'
    throw new Error('bar')
  })

  next()
})

// Sunucuyu çalıştır
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Sunucu ${address} adresinde dinliyor
})