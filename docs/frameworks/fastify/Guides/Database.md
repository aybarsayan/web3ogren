---
title: Fastify
seoTitle: Fastify - Hızlı ve Esnek Node.js Web Çerçevesi
sidebar_position: 1
description: Fastify, web uygulamaları geliştirmek için hız ve düşük gecikme süreleri sağlayan bir çerçevedir. Bu rehber, Fastifyın veritabanı eklentilerini kapsamaktadır.
tags: 
  - fastify
  - web development
  - Node.js
keywords: 
  - fastify
  - Node.js
  - web applications
  - database plugins
  - development
---
Fastify

## Veritabanı

Fastify ekosistemi, çeşitli veritabanı motorlarına bağlanmak için bir dizi eklenti sağlar. Bu rehber, Fastify organizasyonu içinde bakım yapılan Fastify eklentilerine sahip motorları kapsar.

> Seçtiğiniz veritabanı için bir eklenti mevcut değilse, Fastify veritabanı bağımsız olduğu için yine de veritabanını kullanabilirsiniz. Bu kılavuzda listelenen veritabanı eklentilerinin örneklerini takip ederek, eksik veritabanı motoru için bir eklenti yazılabilir.

> Kendi Fastify eklentinizi yazmak isterseniz, lütfen `eklenti rehberine` göz atın.

### [MySQL](https://github.com/fastify/fastify-mysql)

Eklentiyi `npm i @fastify/mysql` komutunu çalıştırarak kurun.

*Kullanım:*

```javascript
const fastify = require('fastify')()

fastify.register(require('@fastify/mysql'), {
  connectionString: 'mysql://root@localhost/mysql'
})

fastify.get('/user/:id', function(req, reply) {
  fastify.mysql.query(
    'SELECT id, username, hash, salt FROM users WHERE id=?', [req.params.id],
    function onResult (err, result) {
      reply.send(err || result)
    }
  )
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
```

### [Postgres](https://github.com/fastify/fastify-postgres)
Eklentiyi `npm i pg @fastify/postgres` komutunu çalıştırarak kurun.

*Örnek*:

```javascript
const fastify = require('fastify')()

fastify.register(require('@fastify/postgres'), {
  connectionString: 'postgres://postgres@localhost/postgres'
})

fastify.get('/user/:id', function (req, reply) {
  fastify.pg.query(
    'SELECT id, username, hash, salt FROM users WHERE id=$1', [req.params.id],
    function onResult (err, result) {
      reply.send(err || result)
    }
  )
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
```

### [Redis](https://github.com/fastify/fastify-redis)
Eklentiyi `npm i @fastify/redis` komutunu çalıştırarak kurun.

*Kullanım:*

```javascript
'use strict'

const fastify = require('fastify')()

fastify.register(require('@fastify/redis'), { host: '127.0.0.1' })
// veya
fastify.register(require('@fastify/redis'), { url: 'redis://127.0.0.1', /* diğer redis seçenekleri */ })

fastify.get('/foo', function (req, reply) {
  const { redis } = fastify
  redis.get(req.query.key, (err, val) => {
    reply.send(err || val)
  })
})

fastify.post('/foo', function (req, reply) {
  const { redis } = fastify
  redis.set(req.body.key, req.body.value, (err) => {
    reply.send(err || { status: 'ok' })
  })
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
```

Varsayılan olarak, `@fastify/redis` Fastify sunucusu kapandığında istemci bağlantısını kapatmaz. Bu davranışa katılmak için istemciyi şu şekilde kaydedin:

```javascript
fastify.register(require('@fastify/redis'), {
  client: redis,
  closeClient: true
})
```

### [Mongo](https://github.com/fastify/fastify-mongodb)
Eklentiyi `npm i @fastify/mongodb` komutunu çalıştırarak kurun.

*Kullanım:*
```javascript
const fastify = require('fastify')()

fastify.register(require('@fastify/mongodb'), {
  // uygulama durduğunda mongodb bağlantısını kapatmayı zorlayın
  // varsayılan değer false'tır
  forceClose: true,

  url: 'mongodb://mongo/mydb'
})

fastify.get('/user/:id', async function (req, reply) {
  // veya this.mongo.client.db('mydb').collection('users')
  const users = this.mongo.db.collection('users')

  // id ObjectId formatındaysa, yeni bir ObjectId oluşturmanız gerekir
  const id = this.mongo.ObjectId(req.params.id)
  try {
    const user = await users.findOne({ id })
    return user
  } catch (err) {
    return err
  }
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})
```

### [LevelDB](https://github.com/fastify/fastify-leveldb)
Eklentiyi `npm i @fastify/leveldb` komutunu çalıştırarak kurun.

*Kullanım:*
```javascript
const fastify = require('fastify')()

fastify.register(
  require('@fastify/leveldb'),
  { name: 'db' }
)

fastify.get('/foo', async function (req, reply) {
  const val = await this.level.db.get(req.query.key)
  return val
})

fastify.post('/foo', async function (req, reply) {
  await this.level.db.put(req.body.key, req.body.value)
  return { status: 'ok' }
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
```

### Veritabanı kütüphanesi için eklenti yazmak
Bir veritabanı kütüphanesi için de bir eklenti yazabiliriz (örn. Knex, Prisma veya TypeORM). Örneğimizde [Knex](https://knexjs.org/) kullanacağız.

```javascript
'use strict'

const fp = require('fastify-plugin')
const knex = require('knex')

function knexPlugin(fastify, options, done) {
  if (!fastify.knex) {
    const knex = knex(options)
    fastify.decorate('knex', knex)

    fastify.addHook('onClose', (fastify, done) => {
      if (fastify.knex === knex) {
        fastify.knex.destroy(done)
      }
    })
  }

  done()
}

export default fp(knexPlugin, { name: 'fastify-knex-example' })
```

### Bir veritabanı motoru için eklenti yazmak

Bu örnekte, sıfırdan basit bir Fastify MySQL eklentisi oluşturacağız (bu, basit bir örnektir; lütfen üretimde resmi eklentiyi kullanın).

```javascript
const fp = require('fastify-plugin')
const mysql = require('mysql2/promise')

function fastifyMysql(fastify, options, done) {
  const connection = mysql.createConnection(options)

  if (!fastify.mysql) {
    fastify.decorate('mysql', connection)
  }

  fastify.addHook('onClose', (fastify, done) => connection.end().then(done).catch(done))

  done()
}

export default fp(fastifyMysql, { name: 'fastify-mysql-example' })
```

### Göçler

Veritabanı şeması göçleri, veritabanı yönetimi ve geliştirilmesi için ayrılmaz bir parçadır. Göçler, veritabanının şemasını değiştirmek için tekrar edilebilir ve test edilebilir bir yol sağlar ve veri kaybını önler.

Rehberin başında belirtildiği gibi, Fastify veritabanı bağımsızdır ve herhangi bir Node.js veritabanı göç aracı ile kullanılabilir. Postgres, MySQL, SQL Server ve SQLite'yi destekleyen [Postgrator](https://www.npmjs.com/package/postgrator) kullanarak bir örnek vereceğiz. MongoDB göçleri için [migrate-mongo](https://www.npmjs.com/package/migrate-mongo) kontrol ediniz.

#### [Postgrator](https://www.npmjs.com/package/postgrator)

Postgrator, veritabanı şemasını değiştirmek için bir SQL komut dosyası dizini kullanan Node.js SQL göç aracıdır. Bir göçler klasöründeki her dosya, şu deseni takip etmelidir: ` [version].[action].[optional-description].sql`.

**version:** artan bir sayı olmalıdır (örn. `001` veya bir zaman damgası).

**action:** `do` veya `undo` olmalıdır. `do`, versiyonu uygular; `undo` geri alır. Bunu diğer göç araçlarındaki `up` ve `down` şeklinde düşünün.

**optional-description** ise göçte hangi değişikliklerin yapıldığını tanımlar. Opsiyonel olmasına rağmen, tüm göçlerde kullanılmalıdır; çünkü bu, herkesin bir göçte hangi değişikliklerin yapıldığını kolayca anlamasını sağlar.

Örneğimizde, bir `users` tablosu oluşturan tek bir göçümüz olacak ve bu göçü çalıştırmak için `Postgrator` kullanacağız.

> Örneği çalıştırmak için gereken bağımlılıkları kurmak için `npm i pg postgrator` komutunu çalıştırın.

```sql
// 001.do.create-users-table.sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY NOT NULL,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL
);
```
```javascript
const pg = require('pg')
const Postgrator = require('postgrator')
const path = require('node:path')

async function migrate() {
  const client = new pg.Client({
    host: 'localhost',
    port: 5432,
    database: 'example',
    user: 'example',
    password: 'example',
  });

  try {
    await client.connect();

    const postgrator = new Postgrator({
      migrationPattern: path.join(__dirname, '/migrations/*'),
      driver: 'pg',
      database: 'example',
      schemaTable: 'migrations',
      currentSchema: 'public', // Sadece Postgres ve MS SQL Server
      execQuery: (query) => client.query(query),
    });

    const result = await postgrator.migrate()

    if (result.length === 0) {
      console.log(
        'No migrations run for schema "public". Already at the latest one.'
      )
    }

    console.log('Migration done.')

    process.exitCode = 0
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  }

  await client.end()
}

migrate()
```