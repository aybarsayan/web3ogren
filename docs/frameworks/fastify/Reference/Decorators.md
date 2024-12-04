---
title: Fastify
seoTitle: Fastify Documentation
sidebar_position: 1
description: Fastifys Decorator API allows for customization of core Fastify objects, enabling extensions to request and response objects. This guide provides usage examples and best practices.
tags: 
  - Fastify
  - API
  - Decorators
  - JavaScript
keywords: 
  - Fastify
  - Decorator API
  - JavaScript
  - Customization
  - HTTP
---
## Dekoratörler

Dekoratör API'si, temel Fastify nesnelerinin, örneğin sunucu örneği ve HTTP istek yaşam döngüsü sırasında kullanılan her türlü istek ve yanıt nesnelerinin özelleştirilmesine olanak tanır. Dekoratör API'si, temel nesnelere her türden özelliği eklemek için kullanılabilir; örneğin, fonksiyonlar, düz nesneler veya yerel türler.

Bu API *senkron* bir yapıya sahiptir. Asenkron olarak bir dekorasyon tanımlamaya çalışmak, dekorasyon tamamlanmadan Fastify örneğinin başlatılmasına neden olabilir. Bu sorunu önlemek ve asenkron bir dekorasyonu kaydetmek için, `register` API'si ile birlikte `fastify-plugin` kullanılmalıdır. Daha fazla bilgi için `Eklentiler` belgesine bakın.

:::
tip
Dikkat edilmesi gereken bir ipucu: Asenkron dekorasyon tanımlarken `fastify-plugin` kullanmayı unutmayın.
:::

Bu API ile temel nesneleri dekore etmek, temel JavaScript motorunun sunucu, istek ve yanıt nesnelerinin işlenmesini optimize etmesine olanak tanır. Bu, tüm nesne örneklerinin şeklinin, bunlar oluşturulmadan ve kullanılmadan önce tanımlanarak gerçekleştirilir. Örneğin, aşağıdaki kullanım önerilmez çünkü nesnelerin biçimini yaşam döngüleri sırasında değiştirecektir:

```js
// Kötü örnek! Okumaya devam edin.

// İstek işleyici çağrılmadan önce gelen isteğe bir kullanıcı özelliği ekleyin.
fastify.addHook('preHandler', function (req, reply, done) {
  req.user = 'Bob Dylan'
  done()
})

// Eklenen kullanıcı özelliğini istek işleyicisinde kullanın.
fastify.get('/', function (req, reply) {
  reply.send(`Merhaba, ${req.user}`)
})
```

Yukarıdaki örnek, istek nesnesi zaten oluşturulduktan sonra onu değiştirdiğinden, JavaScript motoru istek nesnesine erişimi deoptimize etmek zorunda kalır. Dekoratör API'sini kullanarak bu deoptimizasyonun önüne geçebiliriz:

```js
// İsteği 'user' özelliği ile dekore et
fastify.decorateRequest('user', '')

// Özelliğimizi güncelleyelim
fastify.addHook('preHandler', (req, reply, done) => {
  req.user = 'Bob Dylan'
  done()
})
// Ve sonunda buna erişelim
fastify.get('/', (req, reply) => {
  reply.send(`Merhaba, ${req.user}!`)
})
```

Dekore edilmiş bir alanın başlangıç şeklinin, gelecekte dinamik olarak ayarlanacak değere mümkün olduğunca yakın olması önemlidir. Eğer hedef değer bir dize ise dekoratörü `''` ile, bir nesne veya fonksiyon olacaksa `null` ile başlatın.

:::
warning
Dekoratör API'si, yalnızca değer türleri ile çalışır; referans türleri Fastify başlangıcında hata verecektir.
:::

Daha fazla bilgi için `decorateRequest` belgesine bakın.

Bu konuyla ilgili daha fazla bilgi için [JavaScript motoru temelleri: Şekiller ve Satır İçi Önbellekler](https://mathiasbynens.be/notes/shapes-ics) sayfasını inceleyin.

### Kullanım


#### `decorate(name, value, [dependencies])`


Bu yöntem, Fastify `sunucu` örneğini özelleştirmek için kullanılır.

Örneğin, sunucu örneğine yeni bir metot eklemek için:

```js
fastify.decorate('utility', function () {
  // Çok faydalı bir şey
})
```

Yukarıda belirtildiği gibi, işlev olmayan değerler sunucu örneğine aşağıdaki gibi eklenebilir:

```js
fastify.decorate('conf', {
  db: 'some.db',
  port: 3000
})
```

Dekore edilmiş özelliklere erişmek için dekorasyon API'sine sağlanan ismi kullanın:

```js
fastify.utility()

console.log(fastify.conf.db)
```

Dekore edilmiş `Fastify sunucusu`, `route` işleyicilerinde `this` üzerine bağlıdır:

```js
fastify.decorate('db', new DbConnection())

fastify.get('/', async function (request, reply) {
  // return kullanarak
  return { hello: await this.db.query('world') }

  // veya
  // reply.send() kullanarak
  reply.send({ hello: await this.db.query('world') })
  await reply
})
```

`dependencies` parametresi, tanımlanan dekoratörün bağımlı olduğu dekoratörlerin isteğe bağlı bir listesidir. Bu liste, diğer dekoratörlerin adlarının bir dizesinin listesidir. Aşağıdaki örnekte, "utility" dekoratörü "greet" ve "hi" dekoratörlerine bağımlıdır:

```js
async function greetDecorator (fastify, opts) {
  fastify.decorate('greet', () => {
    return 'selam mesajı'
  })
}

async function hiDecorator (fastify, opts) {
  fastify.decorate('hi', () => {
    return 'merhaba mesajı'
  })
}

async function utilityDecorator (fastify, opts) {
  fastify.decorate('utility', () => {
    return `${fastify.greet()} | ${fastify.hi()}`
  })
}

fastify.register(fastifyPlugin(greetDecorator, { name: 'greet' }))
fastify.register(fastifyPlugin(hiDecorator, { name: 'hi' }))
fastify.register(fastifyPlugin(utilityDecorator, { dependencies: ['greet', 'hi'] }))

fastify.get('/', function (req, reply) {
  // Cevap: {"hello":"selam mesajı | merhaba mesajı"}
  reply.send({ hello: fastify.utility() })
})

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
})
```

Not: Bir ok fonksiyonu kullanmak, `this`'in `FastifyInstance`'e bağlanmasını bozacaktır.

Eğer bir bağımlılık karşılanmazsa, `decorate` metodu bir istisna fırlatır. Bağımlılık kontrolü sunucu örneği başlatılmadan önce gerçekleştirilir. Dolayısıyla, çalışma zamanında gerçekleşemez.

#### `decorateReply(name, value, [dependencies])`


İsmi önerdiği gibi, bu API temel `Reply` nesnesine yeni metotlar/özellikler eklemek için kullanılır:

```js
fastify.decorateReply('utility', function () {
  // Çok faydalı bir şey
})
```

Not: Bir ok fonksiyonu kullanmak, `this`'in Fastify `Reply` örneğine bağlanmasını bozacaktır.

Not: `decorateReply` kullanmak, bir referans türü ile kullanıldığında hata fırlatacaktır:

```js
// Bunu yapmayın
fastify.decorateReply('foo', { bar: 'fizz'})
```

Bu örnekte, nesnenin referansı tüm isteklerle paylaşılacak ve **herhangi bir değişiklik tüm istekleri etkileyecek, bu da potansiyel olarak güvenlik açıklarına veya bellek sızıntılarına neden olabilecektir**, bu yüzden Fastify bunu engeller.

İstekler arasında doğru kapsülleme sağlamak için, her gelen istek için yeni bir değer yapılandırın `'onRequest'` kancası` içinde. Örnek:

```js
const fp = require('fastify-plugin')

async function myPlugin (app) {
  app.decorateRequest('foo')
  app.addHook('onRequest', async (req, reply) => {
    req.foo = { bar: 42 }
  })
}

module.exports = fp(myPlugin)
```

`dependencies` parametresi hakkında bilgi için `decorate` belgesine bakın.

#### `decorateRequest(name, value, [dependencies])`


Yukarıda `decorateReply` ile olduğu gibi, bu API, temel `Request` nesnesine yeni metotlar/özellikler eklemek için kullanılır:

```js
fastify.decorateRequest('utility', function () {
  // çok faydalı bir şey
})
```

Not: Bir ok fonksiyonu kullanmak, `this`'in Fastify `Request` örneğine bağlanmasını bozacaktır.

Not: `decorateRequest` kullanmak, bir referans türü ile kullanıldığında hata fırlatacaktır:

```js
// Bunu yapmayın
fastify.decorateRequest('foo', { bar: 'fizz'})
```

Bu örnekte, nesnenin referansı tüm isteklerle paylaşılacak ve **herhangi bir değişiklik tüm istekleri etkileyecek, bu da potansiyel olarak güvenlik açıklarına veya bellek sızıntılarına neden olabilecektir**, bu yüzden Fastify bunu engeller.

İstekler arasında doğru kapsülleme sağlamak için, her gelen istek için yeni bir değer yapılandırın `'onRequest'` kancası`.

Örnek:

```js
const fp = require('fastify-plugin')

async function myPlugin (app) {
  app.decorateRequest('foo')
  app.addHook('onRequest', async (req, reply) => {
    req.foo = { bar: 42 }
  })
}

module.exports = fp(myPlugin)
```

Kanca çözümü, `onRequest` kancasında daha fazla mantık ekleyebileceğiniz için daha esnektir ve daha karmaşık başlatmalara olanak tanır.

Başka bir yaklaşım, getter/setter desenini kullanmaktır, ancak bu, 2 dekoratör gerektirir:

```js
fastify.decorateRequest('my_decorator_holder') // tutucu tanımla
fastify.decorateRequest('user', {
  getter () {
    this.my_decorator_holder ??= {} // tutucuyu başlat
    return this.my_decorator_holder
  }
})

fastify.get('/', async function (req, reply) {
  req.user.access = 'granted'
  // diğer kod
})
```

Bu, `user` özelliğinin her istek için her zaman benzersiz olmasını garanti eder.

`dependencies` parametresi hakkında bilgi için `decorate` belgesine bakın.

#### `hasDecorator(name)`


Bir sunucu örneği dekorasyonunun varlığını kontrol etmek için kullanılır:

```js
fastify.hasDecorator('utility')
```

#### hasRequestDecorator


Bir İstek dekorasyonunun varlığını kontrol etmek için kullanılır:

```js
fastify.hasRequestDecorator('utility')
```

#### hasReplyDecorator


Bir Yanıt dekorasyonunun varlığını kontrol etmek için kullanılır:

```js
fastify.hasReplyDecorator('utility')
```

### Dekoratörler ve Kapsülleme


Aynı **kapsüllenmiş** bağlamda aynı isimle bir dekoratör tanımlamak, bir istisna fırlatır.

Örneğin, aşağıdaki kod hata verecektir:

```js
const server = require('fastify')()

server.decorateReply('view', function (template, args) {
  // Harika bir görünüm oluşturma motoru
})

server.get('/', (req, reply) => {
  reply.view('/index.html', { hello: 'world' })
})

// Kod tabanımızın başka bir yerinde, başka bir
// görünüm dekoratörü tanımlıyoruz. Bu hata verir.
server.decorateReply('view', function (template, args) {
  // Diğer bir oluşturma motoru
})

server.listen({ port: 3000 })
```

Ama bu hata vermez:

```js
const server = require('fastify')()

server.decorateReply('view', function (template, args) {
  // Harika bir görünüm oluşturma motoru.
})

server.register(async function (server, opts) {
  // Mevcut kapsüllenmiş eklentiye bir görünüm dekoratörü ekliyoruz. 
  // Bu hata vermez; çünkü burada görünüm yeni bir tanım olurken,
  // kapsül dışında eski olan budur.
  server.decorateReply('view', function (template, args) {
    // Diğer bir oluşturma motoru
  })

  server.get('/', (req, reply) => {
    reply.view('/index.page', { hello: 'world' })
  })
}, { prefix: '/bar' })

server.listen({ port: 3000 })
```

### Alıcılar ve Ayarlayıcılar


Dekoratörler, özel "getter/ayarlayıcı" nesnelerini tanır. Bu nesnelerin `getter` ve `setter` adında fonksiyonları vardır (ancak `setter` fonksiyonu isteğe bağlıdır). Bu, dekoratörler aracılığıyla özellikler tanımlamaya olanak tanır, örneğin:

```js
fastify.decorate('foo', {
  getter () {
    return 'bir alıcı'
  }
})
```

Bu, Fastify örneğinde `foo` özelliğini tanımlayacaktır:

```js
console.log(fastify.foo) // 'bir alıcı'
```