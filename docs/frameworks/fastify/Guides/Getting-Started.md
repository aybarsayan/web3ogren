---
title: Hızlı Başlangıç
seoTitle: Hızlı Başlangıç ile Fastifya Giriş
sidebar_position: 1
description: Bu belge, Fastify frameworkü ve özelliklerine yönelik temel bir önsöz sunmaktadır. Fastifyı kullanımınıza başlayabilmeniz için gerekli adımları içerir.
tags: 
  - Fastify
  - JavaScript
  - Web Framework
  - Node.js
  - Hızlı Başlangıç
keywords: 
  - Fastify
  - JavaScript
  - Web Framework
  - Node.js
  - Hızlı Başlangıç
---


## Hızlı Başlangıç

Merhaba! Fastify'ı incelediğiniz için teşekkürler!

Bu belge, framework ve özelliklerine nazik bir giriş yapmayı amaçlamaktadır. Diğer doküman bölümüne bağlantılar ve örneklerle birlikte temel bir önsöz niteliğindedir.

Haydi başlayalım!

### Kurulum


`npm` ile yükleyin:
```sh
npm i fastify
```

`yarn` ile yükleyin:
```sh
yarn add fastify
```

### İlk sunucunuz


İlk sunucumuzu yazalım:
```js
// Framework'ü isteyin ve örneğini oluşturun

// ESM
import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})
// CommonJs
const fastify = require('fastify')({
  logger: true
})

// Bir route (yol) tanımlayın
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

// Sunucuyu çalıştırın!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Sunucu artık ${address} üzerinde dinliyor
})
```

> ECMAScript Modüllerini (ESM) projenizde kullanıyorsanız,
> "type": "module" ifadesini `package.json` dosyanıza eklediğinizden emin olun.
>```js
>{
>  "type": "module"
>}
>```

`async/await` kullanmayı mı tercih ediyorsunuz? Fastify bunu kutudan çıkar çıkmaz destekler.

```js
// ESM
import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})
// CommonJs
const fastify = require('fastify')({
  logger: true
})

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

/**
 * Sunucuyu çalıştırın!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
```

Harika, bu kolaydı.

Ne yazık ki, karmaşık bir uygulama yazmak bu örnekten çok daha fazla kod gerektirir. Yeni bir uygulama oluştururken yaşanan klasik bir sorun, birden fazla dosyayı, asenkron başlatmayı ve kodunuzun mimarisini nasıl yöneteceğinizdir.

Fastify, yukarıda belirtilen tüm sorunları ve daha fazlasını çözmeye yardımcı olacak kolay bir platform sunmaktadır!

> ## Not
> Yukarıdaki örnekler ve bu belgede sonraki örnekler, yalnızca
> localhost `127.0.0.1` arayüzünde dinleyecek şekilde varsayılan olarak ayarlanmıştır. Tüm
> mevcut IPv4 arayüzlerinde dinlemek için örneği şu şekilde
> düzenleyebilirsiniz:
>
> ```js
> fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
>   if (err) {
>     fastify.log.error(err)
>     process.exit(1)
>   }
>   fastify.log.info(`sunucu ${address} üzerinde dinliyor`)
> })
> ```
>
> Benzer şekilde, yalnızca yerel bağlantıları kabul etmek için `::1` belirtin. Ya da
> tüm IPv6 adreslerinde bağlantıları kabul etmek için `::` belirtin ve işletim
> sistemi destekliyorsa, tüm IPv4 adreslerinde de bağlantıları kabul edin.
>
> Docker (veya başka bir tür) konteynerine dağıtım yaparken `0.0.0.0` veya
> `::` kullanmak, uygulamayı dışa aktarmanın en kolay yöntemidir.

### İlk eklentiniz


JavaScript'te her şey bir nesne olduğu gibi, Fastify'da her şey bir eklentidir.

Buna derinlemesine inmeye başlamadan önce, nasıl çalıştığını görelim!

Temel sunucumuzu tanımlayalım, ancak route'u giriş noktasının içine değil, bir dış dosyada tanımlayacağız (route
declaration `belgesine` göz atın).
```js
// ESM
import Fastify from 'fastify'
import firstRoute from './our-first-route.js'
/**
 * @type {import('fastify').FastifyInstance} Fastify örneği
 */
const fastify = Fastify({
  logger: true
})

fastify.register(firstRoute)

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Sunucu artık ${address} üzerinde dinliyor
})
```

```js
// CommonJs
/**
 * @type {import('fastify').FastifyInstance} Fastify örneği
 */
const fastify = require('fastify')({
  logger: true
})

fastify.register(require('./our-first-route'))

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Sunucu artık ${address} üzerinde dinliyor
})
```


```js
// our-first-route.js

/**
 * Route'ları kapsülleme
 * @param {FastifyInstance} fastify  Kapsüllenmiş Fastify Örneği
 * @param {Object} options eklenti seçenekleri, https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options adresine bakın
 */
async function routes (fastify, options) {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })
}

// ESM
export default routes;

// CommonJs
module.exports = routes
```
Bu örnekte, Fastify framework'ünün temelini oluşturan `register` API'sini kullandık. Route'ları, eklentileri vb. eklemenin tek yoludur.

Bu kılavuzun başında, Fastify'ın uygulamanızın asenkron başlatılmasına yardımcı olan bir temel sağladığını belirtmiştik. Bu neden önemlidir?

Veri depolama işlemini yönetmek için bir veritabanı bağlantısına ihtiyaç duyulan bir senaryoyu düşünün. Veritabanı bağlantısının, sunucu bağlantıları kabul etmeden önce mevcut olması gerekmektedir. Bu sorunu nasıl çözeriz?

Tipik bir çözüm, karmaşık bir geridönüş veya vaatler kullanmaktır - bu sistem, framework API'sini diğer kütüphaneler ve uygulama koduyla karıştıracaktır.

Fastify, bunu minimum çabayla içsel olarak yönetmektedir!

Yukarıdaki örneği bir veritabanı bağlantısıyla yeniden yazalım.

Öncelikle `fastify-plugin` ve `@fastify/mongodb`'yi yükleyin:

```sh
npm i fastify-plugin @fastify/mongodb
```

**server.js**
```js
// ESM
import Fastify from 'fastify'
import dbConnector from './our-db-connector.js'
import firstRoute from './our-first-route.js'

/**
 * @type {import('fastify').FastifyInstance} Fastify örneği
 */
const fastify = Fastify({
  logger: true
})
fastify.register(dbConnector)
fastify.register(firstRoute)

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Sunucu artık ${address} üzerinde dinliyor
})
```

```js
// CommonJs
/**
 * @type {import('fastify').FastifyInstance} Fastify örneği
 */
const fastify = require('fastify')({
  logger: true
})

fastify.register(require('./our-db-connector'))
fastify.register(require('./our-first-route'))

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Sunucu artık ${address} üzerinde dinliyor
})

```

**our-db-connector.js**
```js
// ESM
import fastifyPlugin from 'fastify-plugin'
import fastifyMongo from '@fastify/mongodb'

/**
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
async function dbConnector (fastify, options) {
  fastify.register(fastifyMongo, {
    url: 'mongodb://localhost:27017/test_database'
  })
}

// Eklenti fonksiyonunu fastify-plugin ile sarmak, eklenti içinde tanımlanan dekoratörleri
// ve kancaları ana kapsama açar.
export default fastifyPlugin(dbConnector)

```

```js
// CommonJs
/**
 * @type {import('fastify-plugin').FastifyPlugin}
 */
const fastifyPlugin = require('fastify-plugin')


/**
 * MongoDB veritabanına bağlanır
 * @param {FastifyInstance} fastify Kapsüllenmiş Fastify Örneği
 * @param {Object} options eklenti seçenekleri, https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options adresine bakın
 */
async function dbConnector (fastify, options) {
  fastify.register(require('@fastify/mongodb'), {
    url: 'mongodb://localhost:27017/test_database'
  })
}

// Eklenti fonksiyonunu fastify-plugin ile sarmak, eklenti içinde tanımlanan dekoratörleri
// ve kancaları ana kapsama açar.
module.exports = fastifyPlugin(dbConnector)

```

**our-first-route.js**
```js
/**
 * Kapsüllenmiş route'ları sunan bir eklenti
 * @param {FastifyInstance} fastify kapsüllenmiş fastify örneği
 * @param {Object} options eklenti seçenekleri, https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options adresine bakın
 */
async function routes (fastify, options) {
  const collection = fastify.mongo.db.collection('test_collection')

  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  fastify.get('/animals', async (request, reply) => {
    const result = await collection.find().toArray()
    if (result.length === 0) {
      throw new Error('Hiçbir belge bulunamadı')
    }
    return result
  })

  fastify.get('/animals/:animal', async (request, reply) => {
    const result = await collection.findOne({ animal: request.params.animal })
    if (!result) {
      throw new Error('Geçersiz değer')
    }
    return result
  })

  const animalBodyJsonSchema = {
    type: 'object',
    required: ['animal'],
    properties: {
      animal: { type: 'string' },
    },
  }

  const schema = {
    body: animalBodyJsonSchema,
  }

  fastify.post('/animals', { schema }, async (request, reply) => {
    // Müşteri tarafından gönderilen veriyi almak için `request.body` nesnesini kullanabiliriz
    const result = await collection.insertOne({ animal: request.body.animal })
    return result
  })
}

module.exports = routes
```

Vay, bu hızlıydı!

Şimdi bazı yeni kavramlar tanıttığımız için burada neler yaptığımızı özetleyelim.

Gördüğünüz gibi, hem veritabanı bağlayıcısı hem de route'ların kaydı için `register` kullandık.

Bu, Fastify'ın en iyi özelliklerinden biridir; eklentilerinizi tanımladığınız sırayla yükleyecek ve mevcut olan her eklenti yüklendiğinde, bir sonraki eklentiyi yalnızca yükleyecektir. Bu şekilde, veritabanı bağlayıcısını ilk eklentide kaydedebilir ve ikinci eklentide kullanabiliriz *(plugin kapsamını anlamak için `buraya` okuyun)*.

Eklenti yükleme, `fastify.listen()`, `fastify.inject()` veya `fastify.ready()` çağrıldığında başlar.

MongoDB eklentisi, Fastify örneğine özel nesneler eklemek için `decorate` API'sini kullanır ve bu nesneleri her yerde kullanılabilir hale getirir. Kolay kod yeniden kullanımı sağlamak ve kod veya mantık tekrarını azaltmak için bu API'nin kullanılması teşvik edilmektedir.

Fastify eklentilerinin nasıl çalıştığını, yeni eklentiler geliştirmeyi ve uygulamanın asenkron başlatılmasıyla ilgili karmaşıklıklarla başa çıkmak için Fastify API'sinin tamamını nasıl kullanacağınıza dair daha fazla bilgi edinmek için `eklenti rehberine` göz atın.

### Eklentilerinizin Yükleme Sırası


Uygulamanızın tutarlı ve tahmin edilebilir bir davranış sergilemesini sağlamak için, kodunuzu her zaman aşağıda gösterildiği gibi yüklemenizi öneririz:
```
└── eklentiler (Fastify ekosisteminden)
└── kendi eklentileriniz (kendi özel eklentileriniz)
└── dekoratörler
└── kancalar
└── hizmetleriniz
```
Bu şekilde, mevcut kapsamda tanımlanan tüm özelliklere her zaman erişiminiz olacaktır.

Daha önce tartışıldığı gibi, Fastify, uygulamanızı tekil ve bağımsız hizmetler olarak oluşturmanıza yardımcı olmak için sağlam bir kapsülleme modeli sunar. Sadece belirli bir route alt kümesi için bir eklenti kaydetmek istiyorsanız, yukarıdaki yapıyı tekrar etmeniz yeterlidir.
```
└── eklentiler (Fastify ekosisteminden)
└── kendi eklentileriniz (kendi özel eklentileriniz)
└── dekoratörler
└── kancalar
└── hizmetleriniz
    │
    └──  hizmet A
    │     └── eklentiler (Fastify ekosisteminden)
    │     └── kendi eklentileriniz (kendi özel eklentileriniz)
    │     └── dekoratörler
    │     └── kancalar
    │     └── hizmetleriniz
    │
    └──  hizmet B
          └── eklentiler (Fastify ekosisteminden)
          └── kendi eklentileriniz (kendi özel eklentileriniz)
          └── dekoratörler
          └── kancalar
          └── hizmetleriniz
```

### Verilerinizi Doğrulayın


Veri doğrulama son derece önemlidir ve framework'ün temel bir kavramıdır.

Gelen talepleri doğrulamak için Fastify, [JSON Şeması](https://json-schema.org/) kullanır.

Route'lar için doğrulamayı gösteren bir örneğe bakalım:
```js
/**
 * @type {import('fastify').RouteShorthandOptions}
 * @const
 */
const opts = {
  schema: {
    body: {
      type: 'object',
      properties: {
        someKey: { type: 'string' },
        someOtherKey: { type: 'number' }
      }
    }
  }
}

fastify.post('/', opts, async (request, reply) => {
  return { hello: 'world' }
})
```
Bu örnek, route'a bir options nesnesi geçirmenin nasıl yapılacağını gösterir; bu nesne, route, `body`, `querystring`, `params` ve `headers` için tüm şemaları içeren bir `schema` anahtarını kabul eder.

Daha fazla bilgi edinmek için `Doğrulama ve
Serileştirme` bağlantısına göz atın.

### Verilerinizi Serileştirin


Fastify, JSON için birinci sınıf destek sunar. JSON gövdelerini ayrıştırmak ve JSON çıktısını serileştirmek için son derece optimize edilmiştir.

JSON serileştirmesini hızlandırmak için (evet, yavaştır!) aşağıdaki örnekte gösterildiği gibi şema seçeneğinin `response` anahtarını kullanabilirsiniz:
```js
/**
 * @type {import('fastify').RouteShorthandOptions}
 * @const
 */
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

fastify.get('/', opts, async (request, reply) => {
  return { hello: 'world' }
})
```
Şemayı belirttiğinizde, serileştirmeyi 2-3 kat hızlandırabilirsiniz. Bu ayrıca, potansiyel olarak hassas verilerin sızdırılmasını önlemeye yardımcı olur, çünkü Fastify yalnızca yanıt şemasında bulunan verileri serileştirecektir. Daha fazla bilgi edinmek için `Doğrulama ve Serileştirme` bağlantısına göz atın.

### İstek Yüklerini Ayrıştırma


Fastify, `'application/json'` ve `'text/plain'` istek yüklerini doğal olarak ayrıştırır ve sonuç, `Fastify
request` nesnesinden `request.body` içinde erişilebilir.

Aşağıdaki örnek, bir isteğin ayrıştırılmış gövdesini istemciye geri döner:

```js
/**
 * @type {import('fastify').RouteShorthandOptions}
 */
const opts = {}
fastify.post('/', opts, async (request, reply) => {
  return request.body
})
```

Fastify'ın varsayılan ayrıştırma işlevselliği ve diğer içerik türlerini desteklemek hakkında daha fazla bilgi edinmek için `Content-Type Ayrıştırıcı` belgesine göz atın.

### Sunucunuzu Genişletin


Fastify, son derece genişletilebilir ve minimal olacak şekilde tasarlanmıştır; bizler sade bir framework'ün harika uygulamalar oluşturmak için yeterli olduğuna inanıyoruz.

Diğer bir deyişle, Fastify "pil dahil" bir framework değildir ve harika bir `ekosisteme` dayanır!

### Sunucunuzu CLI'dan Test Edin


Fastify, bir test framework'ü sunmaz, ancak Fastify'ın özelliklerini ve mimarisini kullanan testlerinizi yazmanız için bir yol öneririz.

Daha fazla bilgi için `test
belgeleri` bağlantısına göz atın!

### Sunucunuzu CLI'dan Çalıştırın


Fastify, ayrıca [fastify-cli](https://github.com/fastify/fastify-cli) sayesinde CLI entegrasyonuna sahiptir.

Öncelikle `fastify-cli`'yi yükleyin:

```sh
npm i fastify-cli
```

Ayrıca `-g` ile küresel olarak da yükleyebilirsiniz.

Ardından, `package.json` dosyanıza aşağıdaki satırları ekleyin:
```json
{
  "scripts": {
    "start": "fastify start server.js"
  }
}
```

Ve sunucu dosyanızı/da oluşturun:
```js
// server.js
'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })
}
```

Ardından sunucunuzu şu şekilde çalıştırın:
```bash
npm start
```

### Slaytlar ve Videolar


- Slaytlar
  - [HTTP sunucunuzu çılgın
    hızda sürün](https://mcollina.github.io/take-your-http-server-to-ludicrous-speed)
    [@mcollina](https://github.com/mcollina)
  - [Eğer size HTTP'nin
    hızlı olabileceğini söyleseydim ne olurdu?](https://delvedor.github.io/What-if-I-told-you-that-HTTP-can-be-fast)
    [@delvedor](https://github.com/delvedor)

- Videolar
  - [HTTP sunucunuzu çılgın
    hızda sürün](https://www.youtube.com/watch?v=5z46jJZNe8k) [@mcollina](https://github.com/mcollina)
  - [Eğer size HTTP'nin
    hızlı olabileceğini söyleseydim ne olurdu?](https://www.webexpo.net/prague2017/talk/what-if-i-told-you-that-http-can-be-fast/)
    [@delvedor](https://github.com/delvedor)