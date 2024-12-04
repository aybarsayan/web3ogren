---
title: Fastify
seoTitle: Fastify Plugin Documentation
sidebar_position: 1
description: Fastify allows users to extend functionality with plugins. This document covers the details of using and creating plugins effectively.
tags: 
  - fastify
  - plugins
  - decorators
  - error management
keywords: 
  - fastify
  - plugins
  - server
  - decorators
  - error handling
---
## Eklentiler
Fastify, kullanıcının işlevselliğini eklentilerle genişletmesine izin verir. Bir eklenti, bir dizi rota, bir sunucu `decorator` veya başka bir şey olabilir. Bir veya daha fazla eklenti kullanmanız gereken API `register`dır.

Varsayılan olarak, `register` *yeni bir kapsam* oluşturur, bu, Fastify örneğinde bazı değişiklikler yaparsanız (üzerinden `decorate` ile), bu değişikliğin mevcut bağlamın ataşlarına yansımayacağı, yalnızca torunlar tarafından yansıyacağı anlamına gelir. Bu özellik, eklenti *kapsülleme* ve *miras alma* elde etmemizi sağlar; böylece *yönlendirilmiş asiklik bir grafik* (DAG) oluştururuz ve çapraz bağımlılıklardan kaynaklanan sorunlar yaşamayız.

Muhtemelen `Başlarken` kılavuzunda bu API'yi nasıl kolayca kullanabileceğinizi görmüşsünüzdür:
```
fastify.register(plugin, [options])
```

### Eklenti Seçenekleri


`fastify.register` için isteğe bağlı `options` parametresi, Fastify'nın kendisinin kullanacağı önceden tanımlanmış bir dizi seçeneği destekler, eğer eklenti [fastify-plugin](https://github.com/fastify/fastify-plugin) ile sarılmışsa hariç. Bu seçenekler nesnesi, eklenti çağrıldığında da iletilecek, sarılıp sarılmadığına bakılmaksızın. Mevcut Fastify özel seçeneklerinin desteklenen listesi şunlardır:

- `logLevel`
- `logSerializers`
- `prefix`

:::note
Bu seçenekler fastify-plugin ile kullanıldığında göz ardı edilecektir.
:::

Fastify'nın gelecekte diğer seçenekleri doğrudan desteklemesi mümkündür. Bu nedenle çakışmaları önlemek için bir eklentinin, seçeneklerini ad alanıyla için düşünmesi önerilir. Örneğin, `foo` adlı bir eklenti şu şekilde kaydedilebilir:

```js
fastify.register(require('fastify-foo'), {
  prefix: '/foo',
  foo: {
    fooOption1: 'value',
    fooOption2: 'value'
  }
})
```

Çakışmalar sorun değilse, eklenti basitçe seçenek nesnesini olduğu gibi kabul edebilir:

```js
fastify.register(require('fastify-foo'), {
  prefix: '/foo',
  fooOption1: 'value',
  fooOption2: 'value'
})
```

`options` parametresi, eklenti kaydedildiğinde değerlendirilecek bir `Function` da olabilir ve Fastify örneğine ilk konumsal argüman aracılığıyla erişim sağlayabilir:

```js
const fp = require('fastify-plugin')

fastify.register(fp((fastify, opts, done) => {
  fastify.decorate('foo_bar', { hello: 'world' })

  done()
}))

// fastify-foo'nun opts argümanı { hello: 'world' } olacaktır.
fastify.register(require('fastify-foo'), parent => parent.foo_bar)
```

Fonksiyona geçirilen Fastify örneği, eklentinin ilan edildiği **dış Fastify örneğinin** en son durumudur ve daha önceki eklentiler aracılığıyla `decorate` ile eklenen değişkenlere erişim sağlar. Bu, bir eklentinin, bir önceden kaydedilen eklenti tarafından Fastify örneğinde yapılan değişikliklere bağlı olduğu durumlarda yararlıdır, yani mevcut bir veritabanı bağlantısını buna sararak kullanmak.

**Not:** Fonksiyona geçirilen Fastify örneğinin, eklentiye geçirilecek ile aynı olduğunu, yani bir referans değil, dış Fastify örneğinin bir kopyası olduğunu unutmayın. Örneğin, `decorate` çağrıldığında, eğer [`fastify-plugin`](https://github.com/fastify/fastify-plugin) ile sarılmamışsa, süslü değişkenler eklentinin fonksiyonu içinde mevcut olacaktır.

#### Rota Ön Ekleme seçeneği


`prefix` anahtarına sahip bir seçenek, bir `string` değeri ile geçerseniz, Fastify bunu kaydın içindeki tüm rotalara ön ek olarak kullanır; daha fazla bilgi için `buraya` bakın.

Eğer rotalarınızı [`fastify-plugin`](https://github.com/fastify/fastify-plugin) ile sararsanız, bu seçeneğin çalışmayacağını unutmayın (mevcut bir `çözüm` bulunmaktadır).

#### Hata Yönetimi


Hata yönetimi [avvio](https://github.com/mcollina/avvio#error-handling) tarafından gerçekleştirilmektedir.

Genel bir kural olarak, hatalarınızı bir sonraki `after` veya `ready` bloğunda yönetmeniz şiddetle önerilir, aksi takdirde hataları `listen` geri çağrısında alırsınız.

```js
fastify.register(require('my-plugin'))

// `after`, daha önce tanımlanmış `register` tamamlandığında bir kez çalıştırılacaktır.
fastify.after(err => console.log(err))

// `ready`, tüm açık olan kayıtların tamamlandığında çalıştırılacaktır.
fastify.ready(err => console.log(err))

// `listen` özel bir ready'dir,
// bu nedenle aynı şekilde çalışır.
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) console.log(err)
})
```

### async/await


*async/await* `after`, `ready` ve `listen` tarafından, ayrıca `fastify`'nın bir Thenable olması desteklenmektedir.

```js
await fastify.register(require('my-plugin'))

await fastify.after()

await fastify.ready()

await fastify.listen({ port: 3000 })
```

:::tip
*Not: Eklenti kaydederken `await` kullanmak, eklentiyi ve temel bağımlılık ağacını yükler, kapsülleme sürecini "tamamlar". Yüklenmiş olan eklentiyi ve bağımlılıklarını değiştiren herhangi bir değişiklik, ana örneğe yansıtılmayacaktır.*
:::

#### ESM Desteği


ESM desteği, [Node.js `v13.3.0`](https://nodejs.org/api/esm.html) ve üzeri sürümlerden itibaren de mevcuttur!

```js
// main.mjs
import Fastify from 'fastify'
const fastify = Fastify()

fastify.register(import('./plugin.mjs'))

fastify.listen({ port: 3000 }, console.log)


// plugin.mjs
async function plugin (fastify, opts) {
  fastify.get('/', async (req, reply) => {
    return { hello: 'world' }
  })
}

export default plugin
```

### Bir eklenti oluşturma


Bir eklenti oluşturmak çok kolaydır, yalnızca üç parametre alan bir fonksiyon oluşturmanız yeterlidir: `fastify` örneği, bir `options` nesnesi ve `done` geri çağrısı.

Örnek:
```js
module.exports = function (fastify, opts, done) {
  fastify.decorate('utility', function () {})

  fastify.get('/', handler)

  done()
}
```

Başka bir `register` içinde de `register` kullanabilirsiniz:
```js
module.exports = function (fastify, opts, done) {
  fastify.decorate('utility', function () {})

  fastify.get('/', handler)

  fastify.register(require('./other-plugin'))

  done()
}
```

Bazen daha önce belirtmek zorunda kalabilirsiniz, örneğin, bir veritabanı bağlantısını kapamanız gerektiğinde. Ne zaman olacağını bilmek için `'onClose'` kancası kullanılabilir.

`register`'in her zaman yeni bir Fastify kapsamı oluşturacağını unutmayın; eğer buna ihtiyacınız yoksa, aşağıdaki bölümü okuyun.

### Kapsamı yönetme


Eğer yalnızca sunucunun işlevselliğini `decorate` ile genişletmek için `register` kullanıyorsanız, Fastify'a yeni bir kapsam oluşturmayacağını bildirmek sizin sorumluluğunuzdadır. Aksi takdirde, yaptığınız değişiklikler üst kapsamda kullanıcıya erişilebilir olmayacaktır.

Fastify'a yeni bir bağlam oluşturmaktan kaçınmak için iki yolunuz vardır:
- [`fastify-plugin`](https://github.com/fastify/fastify-plugin) modülünü kullanın
- `'skip-override'` gizli özelliğini kullanın

Bu sorunu sizin için çözdüğü için `fastify-plugin` modülünü kullanmanızı öneririz ve eklentinizin destekleyeceği Fastify sürüm aralığını bir parametre olarak iletebilirsiniz.
```js
const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, done) {
  fastify.decorate('utility', function () {})
  done()
}, '0.x')
```

Bu modülü kullanma hakkında daha fazla bilgi almak için [`fastify-plugin`](https://github.com/fastify/fastify-plugin) belgelerine göz atın.

Eğer `fastify-plugin` modülünü kullanmıyorsanız, `'skip-override'` gizli özelliğini kullanabilirsiniz, ama bunu önermiyoruz. Gelecekte Fastify API'si değişirse, modülü güncellemek sizin sorumluluğunuz olacaktır; fakat `fastify-plugin` kullanırsanız, geriye dönük uyum açısından güvenceniz vardır.
```js
function yourPlugin (fastify, opts, done) {
  fastify.decorate('utility', function () {})
  done()
}
yourPlugin[Symbol.for('skip-override')] = true
module.exports = yourPlugin
```