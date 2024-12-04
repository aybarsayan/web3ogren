---
title: Fastify
seoTitle: Fastify HTTP2 Support
sidebar_position: 4
description: Fastify supports HTTP2 over secure connections. This document outlines the usage and configuration for both secure and insecure connections.
tags: 
  - fastify
  - HTTP2
  - HTTPS
  - Node.js
keywords: 
  - fastify
  - HTTP2
  - HTTPS
  - Node.js
---


_Fastify_, HTTPS (h2) veya düz metin (h2c) üzerinden HTTP2'yi destekler.

Şu anda, _Fastify_ aracılığıyla HTTP2'ye özgü API'lar mevcut değil, ancak
Node'un `req` ve `res` nesnelerine `Request` ve `Reply`
arayüzü aracılığıyla erişilebilir. PR'lar memnuniyetle karşılanır.

### Güvenli (HTTPS)

HTTP2, tüm modern tarayıcılar tarafından __yalnızca güvenli bir bağlantı üzerinden__ desteklenmektedir:

```js
'use strict'

const fs = require('node:fs')
const path = require('node:path')
const fastify = require('fastify')({
  http2: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, '..', 'https', 'fastify.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'https', 'fastify.cert'))
  }
})

fastify.get('/', function (request, reply) {
  reply.code(200).send({ hello: 'world' })
})

fastify.listen({ port: 3000 })
```

[ALPN müzakeresi](https://datatracker.ietf.org/doc/html/rfc7301), hem HTTPS hem de HTTP/2'nin aynı soket üzerinden desteklenmesini sağlar. Node çekirdek `req` ve `res` nesneleri ya [HTTP/1](https://nodejs.org/api/http.html) ya da [HTTP/2](https://nodejs.org/api/http2.html) olabilir. _Fastify_ bunu kutudan çıkar çıkmaz destekler:

```js
'use strict'

const fs = require('node:fs')
const path = require('node:path')
const fastify = require('fastify')({
  http2: true,
  https: {
    allowHTTP1: true, // HTTP1 için geri dönüş desteği
    key: fs.readFileSync(path.join(__dirname, '..', 'https', 'fastify.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'https', 'fastify.cert'))
  }
})

// bu rota her iki protokol üzerinden de erişilebilir
fastify.get('/', function (request, reply) {
  reply.code(200).send({ hello: 'world' })
})

fastify.listen({ port: 3000 })
```

Yeni sunucunuzu test edebilirsiniz:

```
$ npx h2url https://localhost:3000
```

### Düz veya güvensiz

Eğer mikro hizmetler inşa ediyorsanız, HTTP2'ye düz metin üzerinden bağlanabilirsiniz, ancak bu tarayıcılar tarafından desteklenmemektedir.

```js
'use strict'

const fastify = require('fastify')({
  http2: true
})

fastify.get('/', function (request, reply) {
  reply.code(200).send({ hello: 'world' })
})

fastify.listen({ port: 3000 })
```

Yeni sunucunuzu test edebilirsiniz:

```
$ npx h2url http://localhost:3000
```