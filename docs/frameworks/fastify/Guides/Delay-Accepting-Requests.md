---
title: İstekleri Geciktirme
seoTitle: Fastify İstek Geciktirme
sidebar_position: 1
description: Fastify, belirli istekleri kabul ederken ve diğerlerini reddederken nasıl özelleştirileceğini ele alan bir çözüm sunar. Bu kılavuz, bir OAuth sağlayıcısıyla kimlik doğrulaması yapmayı içeren senaryolar için uygun bir yaklaşım sağlar.
tags: 
  - Fastify
  - OAuth
  - Hook
  - Webhook
  - Plugin
keywords: 
  - Fastify
  - OAuth
  - İstek Geciktirme
  - API
  - Web Geliştirici
---


## Giriş

Fastify, çeşitli durumlar için yararlı birkaç `hook` sağlar. Bunlardan biri, sunucunun yeni istekleri almaya başlamadan *hemen önce* görevleri yerine getirmek için yararlı olan `onReady` hook'udur. Ancak, sunucunun **belirli** istekleri kabul etmesini ve diğer tüm istekleri reddetmesini istediğiniz senaryoları ele almak için doğrudan bir mekanizma yoktur, en azından bir noktaya kadar.

:::info
Örneğin, sunucunuzun istekleri sunmaya başlamadan önce bir OAuth sağlayıcısıyla kimlik doğrulaması yapması gerekiyorsa, [OAuth Yetkilendirme Kod Akışı](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow) adımlarını izlemelidir. 
:::

Bu, kimlik doğrulama sağlayıcısından iki isteği dinlemesini gerektirir:

1. Yetkilendirme Kodu webhook'u
2. Token'lar webhook'u

Yetkilendirme akışı tamamlanana kadar müşteri isteklerine hizmet edemezsiniz. O zaman ne yapmalısınız?

Bu tür bir davranışı elde etmek için birkaç çözüm vardır. Burada bu tekniklerden birini tanıtacağız ve umarım, işlerinizi mümkün olan en kısa sürede yoluna koyabileceksiniz!

## Çözüm

### Genel Bakış

Önerilen çözüm, bu senaryo ve benzerleri ile başa çıkmanın birçok olası yolundan biridir. Tamamen Fastify'a dayanır, bu nedenle şatafatlı altyapı numaralarına veya üçüncü taraf kütüphanelere ihtiyaç duyulmayacaktır.

Basitlik adına, tam bir OAuth akışı ile ilgilenmeyeceğiz; bunun yerine, bir isteği sunmak için gerekli olan bir anahtarın sadece çalışma zamanında bir dış sağlayıcıyla kimlik doğrulaması yapılarak elde edilebileceği bir senaryoyu simüle edeceğiz.

:::note
Buradaki ana hedef, aksi takdirde başarısız olacak istekleri **mümkün olan en erken** aşamada ve bazı **anlamlı bağlamlarla** reddetmektir. Bu, sunucu için (başarısız olmasına kesin gözüyle bakılan bir göreve daha az kaynak tahsis edilmesi) ve müşteri için (anlamlı bilgi alması ve bunun için uzun süre beklememesi) faydalıdır.
:::

Bu, özel bir eklentiye iki ana özelliği sarmalayarak gerçekleştirilecektir:

1. Sağlayıcıyla kimlik doğrulama mekanizması
   - `fastify` nesnesine kimlik doğrulama anahtarını (`magicKey` buradan itibaren) `decorating` etme
2. Aksi takdirde başarısız olacak olan istekleri reddetme mekanizması

### Uygulama

Bu örnek çözümde aşağıdakileri kullanacağız:

- `node.js v16.14.2`
- `npm 8.5.0`
- `fastify 4.0.0-rc.1`
- `fastify-plugin 3.0.1`
- `undici 5.0.0`

Öncelikle aşağıdaki temel sunucu ayarına sahip olduğumuzu varsayalım:

```js
const Fastify = require('fastify')

const provider = require('./provider')

const server = Fastify({ logger: true })
const USUAL_WAIT_TIME_MS = 5000

server.get('/ping', function (request, reply) {
  reply.send({ error: false, ready: request.server.magicKey !== null })
})

server.post('/webhook', function (request, reply) {
  // Webhook isteklerinin gerçekte beklediğiniz yerden geldiğini doğrulamak iyi bir uygulamadır.
  // Bu örnekte basitlik adına atlanmıştır.

  const { magicKey } = request.body
  request.server.magicKey = magicKey
  request.log.info('Müşteri istekleri için hazır!')

  reply.send({ error: false })
})

server.get('/v1*', async function (request, reply) {
  try {
    const data = await provider.fetchSensitiveData(request.server.magicKey)
    return { customer: true, error: false }
  } catch (error) {
    request.log.error({
      error,
      message: 'Sağlayıcıdan hassas verileri alırken başarısız oldu',
    })

    reply.statusCode = 500
    return { customer: null, error: true }
  }
})

server.decorate('magicKey')

server.listen({ port: '1234' }, () => {
  provider.thirdPartyMagicKeyGenerator(USUAL_WAIT_TIME_MS)
    .catch((error) => {
      server.log.error({
        error,
        message: 'Sihirli anahtarı almak için bir hata oluştu!'
      })

      // İsteklere hizmet edemeyeceğimiz için işleri toparlayalım.
      server.close(() => process.exit(1))
    })
})
```

Kodumuz basitçe birkaç rotaya sahip bir Fastify sunucusunu ayarlıyor:

- `/ping` rotası, `magicKey` ayarlandığında servisin istekleri sunmaya hazır olup olmadığını belirtir
- `/webhook` uç noktası, sağlayıcımız hazır olduğunda bize geri dönüş yapar ve `magicKey`'yi paylaşır. `magicKey` daha sonra `fastify` nesnesindeki önceden ayarlanmış dekoratöre kaydedilir
- Müşteri tarafından başlatılan istekleri simüle etmek için bir catchall `/v1*` rotası. Bu istekler geçerli bir `magicKey`'ye dayanır

`provider.js` dosyası, dış sağlayıcının eylemlerini simüle eden kod aşağıdaki gibidir:

```js
const { fetch } = require('undici')
const { setTimeout } = require('node:timers/promises')

const MAGIC_KEY = '12345'

const delay = setTimeout

exports.thirdPartyMagicKeyGenerator = async (ms) => {
  // İşlem gecikmesini simüle et
  await delay(ms)

  // Sunucumuza webhook isteğini simüle et
  const { status } = await fetch(
    'http://localhost:1234/webhook',
    {
      body: JSON.stringify({ magicKey: MAGIC_KEY }),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    },
  )

  if (status !== 200) {
    throw new Error('Sihirli anahtarı almakta başarısız oldu')
  }
}

exports.fetchSensitiveData = async (key) => {
  // İşlem gecikmesini simüle et
  await delay(700)
  const data = { sensitive: true }

  if (key === MAGIC_KEY) {
    return data
  }

  throw new Error('Geçersiz anahtar')
}
```

Buradaki en önemli parça, `thirdPartyMagicKeyGenerator` işlevidir; bu işlev 5 saniye bekleyecek ve ardından `/webhook` uç noktamıza POST isteği gönderecektir.

Sunucumuz başladığında, `magicKey` ayarlanmadan yeni bağlantıları dinlemeye başlarız. Dış sağlayıcımızdan webhook isteğini alana kadar (bu örnekte 5 saniyelik bir gecikmeyi simüle ediyoruz) `/v1*` yolundaki tüm istekler (müşteri istekleri) başarısız olacaktır. Dahası, geçersiz bir anahtar ile sağlayıcımıza ulaştıktan sonra hata alacağız. Bu, bizim ve müşterilerimiz için kaybedilmiş zaman ve kaynaklar anlamına geliyor. Çalıştığımız uygulamanın türüne ve beklediğimiz istek oranına bağlı olarak bu gecikme kabul edilebilir değildir ya da en azından çok rahatsız edicidir.

Elbette, `/v1*` işleyicisinde sağlayıcıyı vurmadan önce `magicKey`'nin ayarlanıp ayarlanmadığını kontrol ederek basitçe hafifletilebilir. Tabii ki, ama bu kodda şişkinliğe neden olur. Ve farz edelim ki, o anahtarı gerektiren farklı denetleyicileri olan onlarca farklı rotaya sahibiz. Tümüne bu kontrolü tekrar tekrar eklemeli miyiz? Bu hata yapma olasılığını artırır ve daha zarif çözümler vardır.

Bu ayarları genel olarak iyileştirmek için; hem:

- hazır olduğumuzda aksi halde başarısız olacak istekleri kabul etmemek
- mümkün olan en kısa sürede sağlayıcımıza ulaşmak

için sorumlu olacak bir `Plugin` oluşturacağız.

Bu şekilde, belirli bir iş kuralıyla ilgili tüm yapılandırmamızı tek bir varlıkta toplayarak, kod tabanımızda dağınık bir şekilde değil, düzenli bir şekilde tutacağız.

Bu davranışı iyileştirecek değişikliklerle, kod şöyle görünecektir:

##### index.js

```js
const Fastify = require('fastify')

const customerRoutes = require('./customer-routes')
const { setup, delay } = require('./delay-incoming-requests')

const server = new Fastify({ logger: true })

server.register(setup)

// Engellenmeyen URL
server.get('/ping', function (request, reply) {
  reply.send({ error: false, ready: request.server.magicKey !== null })
})

// Sağlayıcının yanıtını işlemek için webhook - ayrıca engellenmeyen
server.post('/webhook', function (request, reply) {
  // Webhook isteklerinin gerçekte beklediğiniz yerden geldiğini doğrulamak iyi bir uygulamadır.
  // Bu örnekte basitlik adına atlanmıştır.

  const { magicKey } = request.body
  request.server.magicKey = magicKey
  request.log.info('Müşteri istekleri için hazır!')

  reply.send({ error: false })
})

// Engellenmiş URL'ler
// Müşteri rotaları eklentisini oluşturmak için `delay` fabrikasını çağırdığımızı unutmayın.
server.register(delay(customerRoutes), { prefix: '/v1' })

server.listen({ port: '1234' })
```

##### provider.js

```js
const { fetch } = require('undici')
const { setTimeout } = require('node:timers/promises')

const MAGIC_KEY = '12345'

const delay = setTimeout

exports.thirdPartyMagicKeyGenerator = async (ms) => {
  // İşlem gecikmesini simüle et
  await delay(ms)

  // Sunucumuza webhook isteğini simüle et
  const { status } = await fetch(
    'http://localhost:1234/webhook',
    {
      body: JSON.stringify({ magicKey: MAGIC_KEY }),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    },
  )

  if (status !== 200) {
    throw new Error('Sihirli anahtarı almakta başarısız oldu')
  }
}

exports.fetchSensitiveData = async (key) => {
  // İşlem gecikmesini simüle et
  await delay(700)
  const data = { sensitive: true }

  if (key === MAGIC_KEY) {
    return data
  }

  throw new Error('Geçersiz anahtar')
}
```

##### delay-incoming-requests.js

```js
const fp = require('fastify-plugin')

const provider = require('./provider')

const USUAL_WAIT_TIME_MS = 5000

async function setup(fastify) {
  // İstekleri dinlemeye başladığımızda, sihir yapalım
  fastify.server.on('listening', doMagic)

  // magicKey için yer tutucu ayarla
  fastify.decorate('magicKey')

  // Sihirimiz - hataların ele alındığından emin olmak önemlidir. `try/catch` bloklarının dışındaki asenkron
  // fonksiyonlara dikkat edin.
  // Bu noktada atılan bir hata yakalanmazsa uygulamayı çökertecektir.
  function doMagic() {
    fastify.log.info('Sihir yapmak!')

    provider.thirdPartyMagicKeyGenerator(USUAL_WAIT_TIME_MS)
      .catch((error) => {
        fastify.log.error({
          error,
          message: 'Sihirli anahtarı almak için bir hata oluştu!'
        })

        // İsteklere hizmet edemeyeceğimiz için işleri toparlayalım.
        fastify.close(() => process.exit(1))
      })
  }
}

const delay = (routes) =>
  function (fastify, opts, done) {
    // Müşteri isteklerinin magicKey mevcut değilse kabul edilmeyeceğinden emin olun
    fastify.addHook('onRequest', function (request, reply, next) {
      if (!request.server.magicKey) {
        reply.statusCode = 503
        reply.header('Retry-After', USUAL_WAIT_TIME_MS)
        reply.send({ error: true, retryInMs: USUAL_WAIT_TIME_MS })
      }

      next()
    })

    // Geciktirilmesi gereken rotaları kaydedin
    fastify.register(routes, opts)

    done()
  }

module.exports = {
  setup: fp(setup),
  delay,
}
```

##### customer-routes.js

```js
const fp = require('fastify-plugin')

const provider = require('./provider')

module.exports = fp(async function (fastify) {
  fastify.get('*', async function (request ,reply) {
    try {
      const data = await provider.fetchSensitiveData(request.server.magicKey)
      return { customer: true, error: false }
    } catch (error) {
      request.log.error({
        error,
        message: 'Sağlayıcıdan hassas verileri alırken başarısız oldu',
      })

      reply.statusCode = 500
      return { customer: null, error: true }
    }
  })
})
```

Önceki dosyalarda bahsedilmesi gereken çok özel bir değişiklik vardır: Önceden, kimlik doğrulama sürecine başlamak için `server.listen` geri çağrısını kullanıyorduk ve `server` nesnesini başlatmadan hemen önce dekore ediyorduk. Bu, sunucunun başlatılmasını gereksiz kodlarla şişiriyordu ve Fastify sunucusunu başlatmakla pek ilgisi yoktu. Bu bir iş mantığıydı ve kod tabanında özel bir yeri yoktu.

Artık `delayIncomingRequests` eklentisini `delay-incoming-requests.js` dosyasında uyguladık. Gerçekte, bu, tek bir kullanım durumuna dönüşmek üzere iki farklı eklentiye ayrılmış bir modüldür. Bu, operasyonumuzun beyinlerine karşılık gelmektedir. Eklentilerin neler yaptığını gözden geçirelim:

##### setup

`setup` eklentisi, sağlayıcımıza mümkün olan en kısa sürede ulaşmamızı ve `magicKey`'yi tüm işleyicilere erişilebilir bir yere depolamamızı sağlamaktadır.

```js
  fastify.server.on('listening', doMagic)
```

Sunucu dinlemeye başladığında (bir kod parçasını `server.listen` geri çağrısının işlevine eklemeye benzer bir davranış), bir `listening` olayı yayımlanır (daha fazla bilgi için [Node.js Documentation](https://nodejs.org/api/net.html#event-listening)). Bu olayı, sağlıyoruz - sağlayıcımıza mümkün olan en kısa sürede ulaşmak için `doMagic` işlevini kullanıyoruz.

```js
  fastify.decorate('magicKey')
```

`magicKey` dekorasyonu bu eklentinin bir parçasıdır. Geçerli değerin alınmasını bekleyen bir yer tutucu ile başlatıyoruz.