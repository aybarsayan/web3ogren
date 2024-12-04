---
title: Fastify
seoTitle: Fastify Logging Guide
sidebar_position: 4
description: This document provides comprehensive guidance on configuring and using the Fastify logging system. It includes details on metadata generation and effective logging strategies.
tags: 
  - fastify
  - logging
  - web development
  - nodejs
keywords: 
  - fastify
  - logging
  - web development
  - nodejs
---
## Logging

### Logging'i etkinleştir
Logging varsayılan olarak devre dışıdır ve bir Fastify örneği oluşturduğunuzda `{ logger: true }` veya `{ logger: { level: 'info' } }` geçerek etkinleştirebilirsiniz. Logger devre dışı ise, çalışma zamanında etkinleştirmek mümkün değildir. Bu amaç için [abstract-logging](https://www.npmjs.com/package/abstract-logging) kullanıyoruz.

Fastify performansa odaklandığı için, varsayılan log seviyesi etkinleştirildiğinde `'info'` olarak ayarlanmış [pino](https://github.com/pinojs/pino) logger'ını kullanır.

### Üretim JSON logger'ını etkinleştirme:
```js
const fastify = require('fastify')({
  logger: true
})
```

:::info
Yerel geliştirme, üretim ve test ortamı için uygun yapılandırma ile logger'ı etkinleştirmek biraz daha fazla yapılandırma gerektirir:
:::

```js
const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}
const fastify = require('fastify')({
  logger: envToLogger[environment] ?? true // haritada eşleşen giriş yoksa varsayılan olarak true olur
})
```
> ⚠️ `pino-pretty` bir geliştirme bağımlılığı olarak yüklenmelidir, varsayılan olarak performans nedenleriyle dahil edilmez.

### Kullanım
Logger'ı rota işlemlerinizde şöyle kullanabilirsiniz:
```js
fastify.get('/', options, function (request, reply) {
  request.log.info('Mevcut taleple ilgili bazı bilgiler')
  reply.send({ hello: 'world' })
})
```

Rota işlemcileri dışında yeni loglar tetiklemek için Fastify örneğinden Pino örneğini kullanabilirsiniz:
```js
fastify.log.info('Önemli bir şey oldu!');
```

☑️ Logger'a bazı seçenekler vermek isterseniz, bunları Fastify'a iletin. Tüm mevcut seçenekleri [Pino belgeleri](https://github.com/pinojs/pino/blob/master/docs/api.md#options) içinde bulabilirsiniz. Bir dosya hedefi belirtmek isterseniz:
```js
const fastify = require('fastify')({
  logger: {
    level: 'info',
    file: '/path/to/file' // pino.destination() kullanacak
  }
})

fastify.get('/', options, function (request, reply) {
  request.log.info('Mevcut taleple ilgili bazı bilgiler')
  reply.send({ hello: 'world' })
})
```
```js
const split = require('split2')
const stream = split(JSON.parse)

const fastify = require('fastify')({
  logger: {
    level: 'info',
    stream: stream
  }
})
```



Varsayılan olarak, Fastify her talebe daha kolay izleme için bir ID ekler. Eğer requestIdHeader seçeneği ayarlanmışsa ve ilgili başlık mevcutsa, o zaman değeri kullanılır, aksi takdirde yeni bir artan ID üretilir. Özelleştirme seçenekleri için Fastify Fabrikası `requestIdHeader` ve Fastify Fabrikası `genReqId` inceleyin.

Varsayılan logger, `req`, `res` ve `err` özelliklerine sahip nesneleri serileştiren bir standart serializer seti ile yapılandırılmıştır. `req` tarafından alınan nesne Fastify `Request` nesnesidir, `res` tarafından alınan nesne ise Fastify `Reply` nesnesidir. Bu davranış, özel serializer'lar belirterek özelleştirilebilir.
```js
const fastify = require('fastify')({
  logger: {
    serializers: {
      req (request) {
        return { url: request.url }
      }
    }
  }
})
```
> **Not**: Bazı durumlarda, `res` serializer'ına geçirilen `Reply` nesnesi tamamen oluşturulamamış olabilir. Özel bir `res` serializer'ı yazarken, `statusCode` dışında `reply` üzerindeki herhangi bir özelliğin varlığını kontrol etmek gereklidir; bu özellik her zaman mevcuttur. Örneğin, `getHeaders`'ın çağrılmadan önce varlığını kontrol etmek gereklidir:
```js
const fastify = require('fastify')({
  logger: {
    transport: {
      target: 'pino-pretty'
    },
    serializers: {
      res (reply) {
        return {
          statusCode: reply.statusCode,
          headers: typeof reply.getHeaders === 'function'
            ? reply.getHeaders()
            : {}
        }
      },
    }
  }
});
```

**Not**: Talep gövdesi, `req` yönteminde serileştirilemez, çünkü talep, alt logger'ı oluşturduğumuzda serileştirilir. Bu zamanlarda gövde henüz ayrıştırılmamıştır.

**Not**: Serializer'ların asla hata fırlatmadığından emin olun; çünkü bir serializer'dan fırlatılan bir hata, Node işlemine son verebilir. Daha fazla bilgi için [Pino belgeleri](https://getpino.io/#/docs/api?id=opt-serializers) üzerinden serializer'lara bakın.

*Pino dışında herhangi bir logger bu seçeneği göz ardı eder.*

Kendi logger örneğinizi de sağlayabilirsiniz. Yapılandırma seçenekleri yerine, örneği `loggerInstance` olarak geçin. Sağladığınız logger, Pino arayüzüne uymalıdır; yani aşağıdaki yöntemlere sahip olmalıdır: `info`, `error`, `debug`, `fatal`, `warn`, `trace`, `silent`, `child` ve bir `level` string özelliği.

Örnek:
```js
const log = require('pino')({ level: 'info' })
const fastify = require('fastify')({ loggerInstance: log })

log.info('talep bilgisi yok')

fastify.get('/', function (request, reply) {
  request.log.info('talep bilgilerini içerir, ancak `log` ile aynı logger örneği')
  reply.send({ hello: 'world' })
})
```

## Log Redaksiyonu

[Pino](https://getpino.io) kaydedilen loglardaki belirli özelliklerin değerlerini gizlemek için düşük aşındırmalı log redaksiyonunu destekler. Örneğin, güvenlik kaygıları nedeniyle `Authorization` başlığı dışında tüm HTTP başlıklarını loglamak isteyebiliriz:
```js
const fastify = Fastify({
  logger: {
    stream: stream,
    redact: ['req.headers.authorization'],
    level: 'info',
    serializers: {
      req (request) {
        return {
          method: request.method,
          url: request.url,
          headers: request.headers,
          host: request.host,
          remoteAddress: request.ip,
          remotePort: request.socket.remotePort
        }
      }
    }
  }
})
```

Daha fazla bilgi için https://getpino.io/#/docs/redaction adresine bakın.