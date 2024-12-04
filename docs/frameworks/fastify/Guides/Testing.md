---
title: Fastify
seoTitle: Fastify - A Fast and Low Overhead Web Framework
sidebar_position: 1
description: Fastify is a web framework for Node.js focused on speed and low overhead. This document covers testing practices with Fastify, detailing examples and usage of testing libraries.
tags: 
  - fastify
  - testing
  - nodejs
  - web framework
keywords: 
  - fastify
  - testing
  - nodejs
  - web framework
---
## Test Etme


Test etme, bir uygulama geliştirmenin en önemli parçalarından biridir. Fastify, test etme konusunda oldukça esnektir ve çoğu test çerçevesiyle (örneğin [Node Test Runner](https://nodejs.org/api/test.html), aşağıdaki örneklerde kullanılır) uyumludur.

## Uygulama

'`testing-example`' adında yeni bir dizine girmek için `cd` komutunu kullanalım ve terminalimize `npm init -y` yazalım.

`npm i fastify && npm i pino-pretty -D` komutunu çalıştırın.

### Endişeleri Ayırmak Testi Kolaylaştırır

Öncelikle, uygulama kodumuzu sunucu kodumuzdan ayıracağız:

**app.js**:

```js
'use strict'

const fastify = require('fastify')

function build(opts={}) {
  const app = fastify(opts)
  app.get('/', async function (request, reply) {
    return { hello: 'world' }
  })

  return app
}

module.exports = build
```

**server.js**:

```js
'use strict'

const server = require('./app')({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty'
    }
  }
})

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
```

#.inject() Kullanmanın Faydaları

Fastify, [`light-my-request`](https://github.com/fastify/light-my-request) sayesinde sahte HTTP enjeksiyonunu yerleşik destekle sunar.

Herhangi bir testi tanıtmadan önce, `.inject` yöntemini kullanarak rotamıza sahte bir istek yapacağız:

**app.test.js**:

```js
'use strict'

const build = require('./app')

const test = async () => {
  const app = build()

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  console.log('status code: ', response.statusCode)
  console.log('body: ', response.body)
}
test()
```

Öncelikle kodumuz asenkron bir fonksiyon içinde çalışacak ve bize async/await erişimi verecek.

`.inject` tüm kayıtlı eklentilerin başlatıldığından emin olur ve uygulamamız test etmeye hazırdır. Son olarak, kullanmak istediğimiz istek yöntemini ve bir rotayı geçiriyoruz. await kullanarak yanıtı geri çağırma olmadan depolayabiliriz.

Terminalde test dosyasını çalıştırın `node app.test.js`

```sh
status code:  200
body:  {"hello":"world"}
```

### HTTP Enjeksiyon ile Test Etme

Artık `console.log` çağrılarımızı gerçek testlerle değiştirebiliriz!

`package.json` içindeki "test" betiğini şu şekilde değiştirin:

`"test": "node --test --watch"`

**app.test.js**:

```js
'use strict'

const { test } = require('node:test')
const build = require('./app')

test('requests the "/" route', async t => {
  t.plan(1)
  const app = build()

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })
  t.assert.strictEqual(response.statusCode, 200, 'returns a status code of 200')
})
```

Son olarak, terminalde `npm test` komutunu çalıştırın ve test sonuçlarınızı görün!

`inject` yöntemi, URL'ye basit bir GET isteğinden çok daha fazlasını yapabilir:
```js
fastify.inject({
  method: String,
  url: String,
  query: Object,
  payload: Object,
  headers: Object,
  cookies: Object
}, (error, response) => {
  // testlerinizi burada yapın
})
```

`.inject` yöntemleri, geri çağırma işlevini atlayarak zincirlenebilir:

```js
fastify
  .inject()
  .get('/')
  .headers({ foo: 'bar' })
  .query({ foo: 'bar' })
  .end((err, res) => { // .end çağrısı isteği tetikleyecek
    console.log(res.payload)
  })
```

veya promisleşmiş versiyonda

```js
fastify
  .inject({
    method: String,
    url: String,
    query: Object,
    payload: Object,
    headers: Object,
    cookies: Object
  })
  .then(response => {
    // testlerinizi burada yapın
  })
  .catch(err => {
    // hatayı ele alma
  })
```

Async await de desteklenmektedir!
```js
try {
  const res = await fastify.inject({ method: String, url: String, payload: Object, headers: Object })
  // testlerinizi burada yapın
} catch (err) {
  // hatayı ele alma
}
```

#### Başka Bir Örnek:

**app.js**
```js
const Fastify = require('fastify')

function buildFastify () {
  const fastify = Fastify()

  fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
  })

  return fastify
}

module.exports = buildFastify
```

**test.js**
```js
const { test } = require('node:test')
const buildFastify = require('./app')

test('GET `/` route', t => {
  t.plan(4)

  const fastify = buildFastify()

  // Testlerinizin sonunda, tüm dış hizmet bağlantılarının kapatılmasını sağlamak için `.close()` çağrısı yapmanız şiddetle önerilir.
  t.after(() => fastify.close())

  fastify.inject({
    method: 'GET',
    url: '/'
  }, (err, response) => {
    t.assert.ifError(err)
    t.assert.strictEqual(response.statusCode, 200)
    t.assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
    t.assert.deepStrictEqual(response.json(), { hello: 'world' })
  })
})
```

### Çalışan Bir Sunucu ile Test Etme
Fastify, `fastify.listen()` ile sunucu başlatıldıktan sonra veya `fastify.ready()` ile rotalar ve eklentiler başlatıldıktan sonra da test edilebilir.

#### Örnek:

Önceki örnekten **app.js** kullanır.

**test-listen.js** ( [`undici`](https://www.npmjs.com/package/undici) ile test etme)
```js
const { test } = require('node:test')
const { Client } = require('undici')
const buildFastify = require('./app')

test('should work with undici', async t => {
  t.plan(2)

  const fastify = buildFastify()

  await fastify.listen()

   const client = new Client(
    'http://localhost:' + fastify.server.address().port, {
      keepAliveTimeout: 10,
      keepAliveMaxTimeout: 10
    }
  )

  t.after(() => {
    fastify.close()
    client.close()
  })

  const response = await client.request({ method: 'GET', path: '/' })

  t.assert.strictEqual(await response.body.text(), '{"hello":"world"}')
  t.assert.strictEqual(response.statusCode, 200)
})
```

Alternatif olarak, Node.js 18 ile başlayarak, [`fetch`](https://nodejs.org/docs/latest-v18.x/api/globals.html#fetch) ek bir bağımlılık gerekmeden kullanılabilir:

**test-listen.js**
```js
const { test } = require('node:test')
const buildFastify = require('./app')

test('should work with fetch', async t => {
  t.plan(3)

  const fastify = buildFastify()

  t.after(() => fastify.close())

  await fastify.listen()

  const response = await fetch(
    'http://localhost:' + fastify.server.address().port
  )

  t.assert.strictEqual(response.status, 200)
  t.assert.strictEqual(
    response.headers.get('content-type'),
    'application/json; charset=utf-8'
  )
  const jsonResult = await response.json()
  t.assert.strictEqual(jsonResult.hello, 'world')
})
```

**test-ready.js** ( [`SuperTest`](https://www.npmjs.com/package/supertest) ile test etme)
```js
const { test } = require('node:test')
const supertest = require('supertest')
const buildFastify = require('./app')

test('GET `/` route', async (t) => {
  const fastify = buildFastify()

  t.after(() => fastify.close())

  await fastify.ready()

  const response = await supertest(fastify.server)
    .get('/')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
  t.assert.deepStrictEqual(response.body, { hello: 'world' })
})
```

### Node testlerini nasıl denetlersiniz
1. `{only: true}` seçeneğini geçirerek testinizi izole edin
```javascript
test('should ...', {only: true}, t => ...)
```
2. `node --test` komutunu çalıştırın
```bash
> node --test --test-only --node-arg=--inspect-brk test/<test-file.test.js>
```
- `--test-only`, yalnızca `only` seçeneği etkin olduğunda testlerin çalıştırılmasını belirtir
- `--node-arg=--inspect-brk`, node hata ayıklayıcısını başlatır
3. VS Code'da, `Node.js: Attach` hata ayıklama yapılandırmasını oluşturun ve başlatın. Hiçbir değişiklik gerekmez.

Artık test dosyanızda (ve Fastify'ın geri kalanında) kod editörünüzde aşama aşama ilerleyebilmelisiniz.

## Eklentiler
Yeni bir dizine girmek için `cd` komutunu kullanalım, 'testing-plugin-example' adını verelim ve terminalimize `npm init -y` yazalım.

`npm i fastify fastify-plugin` komutunu çalıştırın.

**plugin/myFirstPlugin.js**:

```js
const fP = require("fastify-plugin")

async function myPlugin(fastify, options) {
    fastify.decorateRequest("helloRequest", "Hello World")
    fastify.decorate("helloInstance", "Hello Fastify Instance")
}

module.exports = fP(myPlugin)
```

Bir Eklenti için temel bir örnek. `Eklenti Kılavuzu` kısmını inceleyin.

**test/myFirstPlugin.test.js**:

```js
const Fastify = require("fastify");
const { test } = require("node:test");
const myPlugin = require("../plugin/myFirstPlugin");

test("Test the Plugin Route", async t => {
    // Eklentiyi test etmek için sahte bir fastify uygulaması oluşturun
    const fastify = Fastify()

    fastify.register(myPlugin)

    // İstediğiniz bir uç noktayı ekleyin
    fastify.get("/", async (request, reply) => {
        return ({ message: request.helloRequest })
    })

    // Sahte bir HTTP İsteği yapmak için fastify.inject kullanın
    const fastifyResponse = await fastify.inject({
        method: "GET",
        url: "/"
    })

  console.log('status code: ', fastifyResponse.statusCode)
  console.log('body: ', fastifyResponse.body)
})
```
Daha fazla bilgi edinin ```fastify.inject()```.
Terminalde test dosyasını çalıştırın `node test/myFirstPlugin.test.js`

```sh
status code:  200
body:  {"message":"Hello World"}
```

Artık `console.log` çağrılarımızı gerçek testlerle değiştirebiliriz!

`package.json` içindeki "test" betiğini şu şekilde değiştirin:

`"test": "node --test --watch"`

Uç nokta için testi oluşturun.

**test/myFirstPlugin.test.js**:

```js
const Fastify = require("fastify");
const { test } = require("node:test");
const myPlugin = require("../plugin/myFirstPlugin");

test("Test the Plugin Route", async t => {
    // Test sayısını belirtir
    t.plan(2)

    const fastify = Fastify()

    fastify.register(myPlugin)

    fastify.get("/", async (request, reply) => {
        return ({ message: request.helloRequest })
    })

    const fastifyResponse = await fastify.inject({
        method: "GET",
        url: "/"
    })

    t.assert.strictEqual(fastifyResponse.statusCode, 200)
    t.assert.deepStrictEqual(JSON.parse(fastifyResponse.body), { message: "Hello World" })
})
```

Son olarak, terminalde `npm test` komutunu çalıştırın ve test sonuçlarınızı görün!

`.decorate()` ve `.decorateRequest()` yöntemlerini test edin.

**test/myFirstPlugin.test.js**:

```js
const Fastify = require("fastify");
const { test } = require("node:test");
const myPlugin = require("../plugin/myFirstPlugin");

test("Test the Plugin Route", async t => {
    t.plan(5)
    const fastify = Fastify()

    fastify.register(myPlugin)

    fastify.get("/", async (request, reply) => {
        // fastify dekoratörlerini test etme
        t.assert.ifError(request.helloRequest)
        t.assert.ok(request.helloRequest, "Hello World")
        t.assert.ok(fastify.helloInstance, "Hello Fastify Instance")
        return ({ message: request.helloRequest })
    })

    const fastifyResponse = await fastify.inject({
        method: "GET",
        url: "/"
    })
    t.assert.strictEqual(fastifyResponse.statusCode, 200)
    t.assert.deepStrictEqual(JSON.parse(fastifyResponse.body), { message: "Hello World" })
})