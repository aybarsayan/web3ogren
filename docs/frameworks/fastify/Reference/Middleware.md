---
title: Fastify
seoTitle: Fastify - A Powerful Web Framework
sidebar_position: 4
description: Fastify is a fast and low-overhead web framework for Node.js. This section delves into middleware support and usage in Fastify.
tags: 
  - Fastify
  - Middleware
  - Node.js
  - Express
keywords: 
  - Fastify
  - Middleware
  - Node.js
  - Express
---
Fastify

## Middleware

:::info
Fastify v3.0.0 ile birlikte, middleware kutudan çıktığında desteklenmemektedir ve [`@fastify/express`](https://github.com/fastify/fastify-express) veya [`@fastify/middie`](https://github.com/fastify/middie) gibi bir harici eklenti gerektirir.
:::

[`@fastify/express`](https://github.com/fastify/fastify-express) eklentisini `use` Express middleware olarak kaydetmenin bir örneği:

```js
await fastify.register(require('@fastify/express'))
fastify.use(require('cors')())
fastify.use(require('dns-prefetch-control')())
fastify.use(require('frameguard')())
fastify.use(require('hsts')())
fastify.use(require('ienoopen')())
fastify.use(require('x-xss-protection')())
```

Ayrıca, basit Express tarzı middleware için destek sağlayan ancak geliştirilmiş performansa sahip [`@fastify/middie`](https://github.com/fastify/middie) kullanabilirsiniz:

```js
await fastify.register(require('@fastify/middie'))
fastify.use(require('cors')())
```

:::note
Middleware'in kapsüllenebileceğini unutmayın; bu, middleware'iniz nerede çalışacağını belirleyebileceğiniz anlamına gelir ve bunu `register` kullanarak yapabilirsiniz. Bkz. `plugins guide`.
:::

Fastify middleware'i `send` yöntemini veya Fastify `Reply` örneğine özgü diğer yöntemleri açığa çıkarmamaktadır. Bunun nedeni, Fastify'ın gelen `req` ve `res` Node örneklerini `Request` ve `Reply` nesneleri ile sarmasıdır, ancak bu middleware aşamasından sonradır. Middleware oluşturmanız gerekiyorsa, Node'un `req` ve `res` örneklerini kullanmalısınız. Aksi takdirde, zaten `Request` ve `Reply` Fastify örneklerine sahip olan `preHandler` kancasını kullanabilirsiniz. Daha fazla bilgi için bkz. `Hooks`.

#### Middleware yürütmesini belirli yollara kısıtlayın


Sadece belirli yollar altında middleware çalıştırmanız gerekiyorsa, ilk parametre olarak sadece yolu `use` metoduna geçirin ve işiniz tamam!

*Bu, parametre içeren rotalar (ör. `/user/:id/comments`) ile desteklenmez ve birden fazla yolda joker karakterler desteklenmez.*

```js
const path = require('node:path')
const serveStatic = require('serve-static')

// Tek yol
fastify.use('/css', serveStatic(path.join(__dirname, '/assets')))

// Joker yol
fastify.use('/css/(.*)', serveStatic(path.join(__dirname, '/assets')))

// Birden fazla yol
fastify.use(['/css', '/js'], serveStatic(path.join(__dirname, '/assets')))
```

### Alternatifler

:::tip
Fastify, en yaygın kullanılan middleware'ler için bazı alternatifler sunar, örneğin [`@fastify/helmet`](https://github.com/fastify/fastify-helmet) eğer [`helmet`](https://github.com/helmetjs/helmet) kullanıyorsanız, [`@fastify/cors`](https://github.com/fastify/fastify-cors) için [`cors`](https://github.com/expressjs/cors) ve [`@fastify/static`](https://github.com/fastify/fastify-static) için [`serve-static`](https://github.com/expressjs/serve-static).
:::