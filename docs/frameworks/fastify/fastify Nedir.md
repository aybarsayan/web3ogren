---
title: Fastify Nedir?
seoTitle: Fastify - Yüksek Performanslı Node.js Web Framework'ü
sidebar_position: 1
description: Fastify, Node.js için yüksek performanslı ve düşük ek yüke sahip bir web framework'üdür. JSON şeması tabanlı validasyon ile hızlı API geliştirmeye odaklanır.
tags:
  - Fastify
  - Node.js
  - Web Framework
  - Backend
keywords:
  - Fastify
  - Node.js Framework
  - API Development
  - Backend Development
  - JSON Schema
---

Fastify, Node.js için geliştirilmiş, yüksek performanslı ve düşük ek yüke sahip bir web framework'üdür. Özellikle JSON şeması tabanlı validasyon ve hızlı HTTP API'leri geliştirmeye odaklanır.

:::tip Neden Fastify?
Fastify, Express'e kıyasla 2x daha hızlı performans sunar ve built-in validasyon özellikleri ile güvenli API'ler geliştirmenizi sağlar.
:::

## Temel Özellikler {#core-features}

### Hızlı Başlangıç {#quick-start}

```javascript
const fastify = require('fastify')({ logger: true })

// Route tanımlama
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// Sunucuyu başlatma
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

### JSON Schema Validasyonu {#schema-validation}

```javascript
const opts = {
  schema: {
    body: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        age: { type: 'integer', minimum: 0 }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { 
            type: 'object',
            properties: {
              id: { type: 'string' }
            }
          }
        }
      }
    }
  }
}

fastify.post('/user', opts, async (request, reply) => {
  const { name, email, age } = request.body
  // İşlemler...
  return { success: true, data: { id: 'xyz' } }
})
```

## Middleware ve Hooks {#middleware-hooks}

### Hooks Kullanımı {#using-hooks}

```javascript
fastify.addHook('onRequest', async (request, reply) => {
  // Her istekte çalışır
})

fastify.addHook('preHandler', async (request, reply) => {
  // Route handler'dan önce çalışır
})

fastify.addHook('onResponse', async (request, reply) => {
  // Yanıt gönderildikten sonra çalışır
})
```

### Özel Plugin Oluşturma {#custom-plugins}

```javascript
const fp = require('fastify-plugin')

async function dbConnector(fastify, options) {
  const db = await connectDB(options.uri)
  
  fastify.decorate('db', db)
}

module.exports = fp(dbConnector)
```

## HTTP/2 Desteği {#http2-support}

```javascript
const fastify = require('fastify')({
  http2: true,
  https: {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }
})
```

## Decorators {#decorators}

```javascript
// Özel dekoratör ekleme
fastify.decorate('util', {
  sayHello: (name) => `Hello, ${name}!`
})

// Kullanımı
fastify.get('/hello/:name', async (request, reply) => {
  return fastify.util.sayHello(request.params.name)
})
```

## Serileştirme ve Dönüşüm {#serialization}

```javascript
const opts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  serializer: (data) => {
    return {
      ...data,
      timestamp: new Date(data.timestamp).toISOString()
    }
  }
}
```

## Hata Yönetimi {#error-handling}

```javascript
fastify.setErrorHandler(function (error, request, reply) {
  if (error.validation) {
    reply.status(400).send(error.validation)
  }
  
  request.log.error(error)
  reply.status(500).send({ error: 'Sunucu hatası' })
})

// Özel hata oluşturma
const createError = require('fastify-error')
const CustomError = createError('CUSTOM_ERROR', 'Özel hata mesajı', 400)
```

## Route Yapılandırması {#route-configuration}

### Prefix ve Versiyonlama {#prefix-versioning}

```javascript
// API versiyonlama
fastify.register(async function (fastify, opts) {
  fastify.get('/user', async (request, reply) => {
    return { version: 'v1' }
  })
}, { prefix: '/api/v1' })

// Farklı versiyon
fastify.register(async function (fastify, opts) {
  fastify.get('/user', async (request, reply) => {
    return { version: 'v2' }
  })
}, { prefix: '/api/v2' })
```

### Route Parametreleri {#route-params}

```javascript
fastify.get('/users/:id', {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', pattern: '^[0-9]+$' }
      }
    }
  }
}, async (request) => {
  return { userId: request.params.id }
})
```

## Testing {#testing}

```javascript
const build = require('./app')
const tap = require('tap')

tap.test('GET `/` route', async (t) => {
  const fastify = build()
  
  const response = await fastify.inject({
    method: 'GET',
    url: '/'
  })
  
  t.equal(response.statusCode, 200)
  t.same(JSON.parse(response.payload), { hello: 'world' })
})
```

## En İyi Pratikler {#best-practices}

1. **Schema Kullanımı**
   - Her route için şema tanımlayın
   - Response şemalarını kullanın
   - Shared şemaları ayırın

2. **Plugin Mimarisi**
   - Modüler yapı kullanın
   - Bağımlılıkları doğru yönetin
   - `fastify-plugin` kullanın

3. **Logging**
   - Built-in logger kullanın
   - Log seviyelerini doğru ayarlayın
   - Request/Response loglarını yapılandırın

:::warning
Production ortamında pretty-print logging'i devre dışı bırakın ve uygun log seviyesini ayarlayın.
:::

## Örnek Kullanım Senaryoları {#use-cases}

1. Yüksek performanslı REST API'ler
2. Mikroservisler
3. GraphQL sunucuları
4. WebSocket uygulamaları
5. Proxy sunucuları

## Sonuç {#conclusion}

Fastify, modern Node.js uygulamaları için hızlı, güvenilir ve ölçeklenebilir bir çözümdür. JSON şema validasyonu, plugin sistemi ve yüksek performansı ile öne çıkar.

:::tip Başlarken
Daha detaylı bilgi için [resmi Fastify dokümantasyonunu](https://www.fastify.io/docs/latest/) inceleyebilirsiniz.
:::