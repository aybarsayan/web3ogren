---
description: tinyhttp Uygulama sınıfı belgeleri, uygulama oluşturma, işleme ve hata yönetimi ile ilgili bilgileri içermektedir.
keywords: [tinyhttp, uygulama, middleware, HTTP, handler, TypeScript, web geliştirme]
---

# Uygulama

`app` nesnesi, tüm middleware'leri, handler'ları ve ayarları ile birlikte tinyhttp uygulamasını temsil eder.

```ts
import { App } from '@tinyhttp/app'

const app = new App()

app.get('/', (req, res) => {
  res.send('merhaba dünya')
})

app.listen(3000)
```

App nesnesinin aşağıdakiler için yöntemleri vardır:

- HTTP isteği yönlendirme; örneğin, `app.METHOD`.
- Middleware yapılandırma; `app.route` bölümüne bakın.
- HTML görünümlerini render etme; `app.render` bölümüne bakın.
- Bir şablon motoru kaydetme; `app.engine` bölümüne bakın.

:::info
Tinyhttp uygulama nesnesine, isteği nesnesi ve yanıt nesnesi üzerinden `req.app` ve `res.app` olarak referans verilebilir.
:::

## Yapıcı

### `noMatchHandler(req, res)`

Rotalardan hiçbiri eşleşmezse çağrılan handler. 404 Not Found döndürmelidir.

```ts
import { App, Request, Response } from '@tinyhttp/app'

const app = new App({
  noMatchHandler: (req: Request, res: Response) =>
    void res.status(404).end('Bulunamadı :('),
})

app
  .get('/', (req, res) => {
    res.send('merhaba dünya')
  })
  .listen(3000)
```

### `onError(err, req, res)`

Sunucu hatalarını yakalamak için bir middleware. Hata herhangi bir şey olabilir. 500 Internal Server Error döndürmelidir.

```ts
import { App, Request, Response } from '@tinyhttp/app'

const app = new App({
  onError: (err, req, res) => {
    res.status(500).send({
      message: err.message,
    })
  },
})

app.get('/', (req, res) => void res.send('merhaba dünya')).listen(3000)
```

### `applyExtensions`

Handler benzeri bir fonksiyon, handler'lara istek ve yanıt uzantıları ekler. Varsayılan olarak, tüm tinyhttp'nin `req` / `res` uzantılarını içeren `extendMiddleware` fonksiyonu kullanılır.

```js
import { App, extendMiddleware } from '@tinyhttp/app'

const app = new App({
  applyExtensions: (req, res, next) => {
    extendMiddleware(req, res, next)

    res.someExt = someExt(req, res, next)
  },
})
```

:::note
Boş bir fonksiyon geçirildiğinde, `extendMiddleware`'dan tüm uzantılar dahil edilmeyecektir.
:::

```js
import { App } from '@tinyhttp/app'
import { send } from '@tinyhttp/send'

const app = new App({
  applyExtensions: (req, res, next) => {
    // artık tinyhttp sadece `res.send` uzantısına sahip
    res.send = send(req, res)
  },
})
```

Ayrıca tüm uzantıları devre dışı bırakmak için boş bir fonksiyon geçirilebilir:

```js
import { App } from '@tinyhttp/app'

const app = new App({
  applyExtensions: (req, res, next) => {
    next()
  },
})
```

### `settings`

tinyhttp uygulaması, çeşitli uygulama parçalarını açıp kapatmak için bir ayarlar listesi içerir. Tüm ayarlar varsayılan olarak devre dışıdır ve en iyi performansı sağlamak için (daha az uzantı, daha iyi performans) tasarlanmıştır.

```ts
import { App } from '@tinyhttp/app'

const app = new App({
  settings: {
    networkExtensions: true,
  },
})

app.use((req, res) => void res.send(`Hostname: ${req.hostname}`)).listen(3000)
```

Tüm ayarların listesi:

- `networkExtensions` - ağ `req` uzantıları
- `subdomainOffset` - `req.subdomains` için alt alan adı ofseti
- `bindAppToReqRes` - mevcut `App`'i `req.app` ve `res.app` ile ilişkilendir
- `xPoweredBy` - `X-Powered-By: "tinyhttp"` başlığını ayarla
- `enableReqRoute` - `req.route` özelliğini etkinleştir
- `views` - şablonların bulunduğu görünüm dizini
- `view` - şablon motoru renderleme mantığını yönetmek için özel Görünüm nesnesi
- `view cache` - görünümlerin önbelleğe alınmasını aç/kapa
- `view engine` - varsayılan motor uzantısı (örn. `eta`)

#### `networkExtensions`

Ağ ile ilgili İstek nesnesi uzantılarının bir listesini etkinleştirir.

- `req.protocol`
- `req.secure`
- `req.hostname`
- `req.ip`
- `req.ips`
- `req.subdomains`

#### `subdomainOffset`

`req.subdomains` için alt alan adı ofseti. Varsayılan değeri `2`dir.

#### `bindAppToReqRes`

Uygulamayı `req.app` ve `res.app` ile ilişkilendirmek için referans olarak bağlar. Varsayılan olarak devre dışıdır.

#### `enableReqRoute`

`req.route` özelliğini etkinleştirir. Varsayılan olarak devre dışıdır.

## Özellikler

### `app.locals`

> `app.locals` nesnesi, uygulama içinde yerel değişkenlerdir.

```ts
console.dir(app.locals.title)
// => 'My App'

console.dir(app.locals.email)
// => 'me@myapp.com'
```

Ayarlanınca, `app.locals` özelliklerinin değerleri uygulama ömrü boyunca geçerlidir, buna karşın `res.locals` özellikleri yalnızca isteğin ömrü için geçerlidir.

Uygulama içinde render edilen şablonlarda yerel değişkenlere erişebilirsiniz. Bu, şablonlara yardımcı işlevler sağlamak ve uygulama düzeyindeki verileri sağlamak için yararlıdır.

```ts
app.locals.title = 'My App'
app.locals.strftime = require('strftime')
app.locals.email = 'me@myapp.com'
```

### `app.parent`

`app.parent`, bir üst `App` nesnesine işaret eder, örneğin, bağlandığı uygulama.

```js
const app = new App()

const subapp = new App()

app.use(subapp)

console.log(app.parent)

/*
<ref *1> App {
  middleware: [],
  mountpath: '/',
  apps: {
    '/': App {
      middleware: [],
      mountpath: '/',
      apps: {},
      parent: [Circular *1]
    }
  }
}
*/
```

## Yöntemler

### `app.METHOD`

Bir HTTP isteğini yönlendirir; METHOD, istek HTTP yöntemidir (GET, PUT, POST vb.) küçük harfle yazılır. Gerçek yöntemler app.get(), app.post(), app.put() ve benzerleridir.

### `app.all`

Bu yöntem, standart `app.METHOD()` yöntemleri gibidir ancak tüm HTTP fiillerini eşleştirir.

:::tip
Aşağıdaki geri çağırma, `/secret` yoluna yapılan GET, POST, PUT, DELETE veya herhangi bir HTTP isteği yöntemiyle eşleşince çalışacaktır:
:::

```ts
app.all('/secret', (req, res, next) => {
  console.log('Gizli bölüme erişiliyor...')
  next() // kontrolü bir sonraki handler'a geçir
})
```

`app.all()` yöntemi, belirli yol önekleri veya keyfi eşleşmeler için "küresel" bir mantığı eşlemek için yararlıdır. Örneğin, tüm diğer rota tanımlarından önce aşağıdaki kodu koyarsanız, bu noktadan itibaren tüm rotaların kimlik doğrulamasını gerektirmesini zorunlu kılacak ve otomatik olarak bir kullanıcı yükleyecektir. Bu geri çağırmaların son nokta olarak hareket etmesi gerekmiyor: loadUser bir işlevi yerine getirebilir, sonra bir sonraki rotaları eşleştirmeye devam etmek için `next()` çağırabilir.

```ts
app.all('*', requireAuthentication, loadUser)
```

### `app.get`

HTTP GET isteklerini belirtilen yola belirtilen handler fonksiyonlarıyla yönlendirir.

```ts
app.get('/', (req, res) => {
  res.send(`${req.method || 'GET'} ana sayfasına istek`)
})
```

### `app.post`

HTTP POST isteklerini belirtilen yola belirtilen handler fonksiyonlarıyla yönlendirir.

```ts
app.post('/', (req, res) => {
  res.send(`${req.method || 'POST'} ana sayfasına istek`)
})
```

### `app.put`

HTTP PUT isteklerini belirtilen yola belirtilen handler fonksiyonlarıyla yönlendirir.

```ts
app.put('/', (req, res) => {
  res.send(`${req.method || 'PUT'} ana sayfasına istek`)
})
```

### `app.delete`

HTTP DELETE isteklerini belirtilen yola belirtilen handler fonksiyonlarıyla yönlendirir.

```ts
app.delete('/', (req, res) => {
  res.send(`${req.method || 'DELETE'} ana sayfasına istek`)
})
```

### `app.use`

Belirtilen middleware fonksiyonu veya fonksiyonlarını belirtilen yolda monte eder: middleware fonksiyonu, istenen yolun tabanında yol ile eşleştiğinde çalıştırılır.

Bir rota, yolundan hemen sonra gelen herhangi bir yolu eşleştirecektir. Örneğin: `app.use('/apple', ...)` yolu `/apple`, `/apple/images`, `/apple/images/news` gibi yolları eşleştirir.

Yol varsayılan olarak `/,` olduğu için, yol olmadan monte edilen middleware, uygulama için her istek için çalıştırılacaktır. Örneğin, bu middleware fonksiyonu uygulama için her istekte çalıştırılacaktır:

```ts
app.use((req, res, next) => {
  console.log('Zaman: %d', Date.now())
  next()
})
```

:::warning
Middleware fonksiyonları sıralı olarak çalıştırılır; bu nedenle, middleware ekleme sırası önemlidir.
:::

```ts
// bu middleware isteğin geçmesine izin vermeyecektir
app.use((req, res, next) => void res.send('Merhaba Dünya'))

// istekler bu rotaya asla ulaşmayacaktır
app.get('/', (req, res) => void res.send('Hoş geldiniz'))
```

### `app.engine`

Bir şablon motoru kaydeder. `renderFile` fonksiyonu içeren herhangi bir Express şablon motoru ile çalışır.

```js
import { App } from '@tinyhttp/app'
import { renderFile } from 'eta'

const app = new App()

app.engine('eta', renderFile) // app.engines['eta']'yı `renderFile` ile eşleştir
```

### `app.render`

> [Eta v2](https://eta.js.org/docs/2.x.x/examples/express) tinyhttp ile en iyi şekilde çalışır. [Eta v3](https://eta.js.org/docs/api#setting-up-eta) ile motoru kaydetmeye gerek yoktur, şablonları bir `Eta` örneği kullanarak render etmelisiniz.

Daha önce `app.engine` aracılığıyla ayarlanan motor ile bir dosyayı render eder. Sonucu render edip yanıtlamak için `res.render` kullanın.

```js
import { App } from '@tinyhttp/app'
import { renderFile } from 'eta'

const app = new App()

app.engine('eta', renderFile)

app.render(
  'index',
  { name: 'Eta' },
  {
    /* bazı seçenekler */
  },
  (err, html) => {
    if (err) throw err
    doSomethingWithHTML(html)
  }
)
```

Tinyhttp henüz `app.render` aşırı yüklemelerini desteklemiyor. Bu nedenle, bazı motorlar (örneğin Pug) ilave sarma gerektirebilir.

```js
import { App } from '@tinyhttp/app'
import pug from 'pug'

const app = new App()

const renderPug = (path, _, options, cb) => pug.renderFile(path, options, cb)

app.engine('pug', renderPug)

app.use((_, res) => void res.render('index.pug'))

app.listen(3000, () => console.log(`http://localhost:3000 üzerinde dinleniyor`))
```

### `app.path`

Uygulamanın mountpath'ini döndürür.

```js
const app = new App()
const blog = new App()
const blogAdmin = new App()

app.use('/blog', blog)
blog.use('/admin', blogAdmin)

console.dir(app.path()) // ''
console.dir(blog.path()) // '/blog'
console.dir(blogAdmin.path()) // '/blog/admin'
```

### `app.route`

Tek bir rota örneği döndürür; ardından HTTP fiilleriyle optional middleware'yi işlemek için kullanabilirsiniz. Aynı rota isimlerinin tekrarını önlemek için `app.route()` kullanın.

```js
new App()
  .route('/events')
  .all((req, res, next) => {
    // tüm HTTP fiilleri için önce çalışıyor
    // bunu rota özel middleware olarak düşünün!
  })
  .get((req, res, next) => res.json({ hello: 'world' }))
  .post((req, res, next) => {
    // belki yeni bir etkinlik ekleyin...
  })
```

### `app.enable`

`Boolean` ayar adını `true` olarak ayarlar; ad, uygulama ayarlarından birinin özelliğidir.

```js
app.enable('networkExtensions')
```

### `app.disable`

`Boolean` ayar adını `false` olarak ayarlar; ad, uygulama ayarlarından birinin özelliğidir.

```js
app.disable('networkExtensions')
```

### `app.set`

Ayar adını değere ayarlar; değeri uygulama ayarlarından birinin özelliğidir.

```js
app.set('subdomainOffset', 2)
```

### `app.handler`

`req` / `res` nesnelerini uzatır, 404 ve 500 handler'larını ekler, middleware'i dağıtır ve yolları eşleştirir.

Sunucuyu başlatmanıza gerek olmayan bazı durumlarda `req` / `res` handler'ını geçirebilirsiniz.

> Örneğin, HTTP bir sunucusu yerine bir HTTP/2 sunucusu başlatmak isterseniz:

```ts
import { App } from '@tinyhttp/app'
import type { Request, Response } from '@tinyhttp/app'
import fs from 'fs'
import { createSecureServer } from 'http2'

const app = new App()

const options = {
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
}

app.get(
  '/',
  (req, res) => void res.send(`HTTP ${req.httpVersion} sunucusundan merhaba!`)
)

createSecureServer(options, async (req: Request, res: Response) => {
  await app.handler(req, res)
}).listen(3000)
```

Ayrıca, handler'ı sunucusuz işlevlerde (örneğin, Vercel) geçirmekte yaygındır, şu şekilde:

```js
const { App } = require('@tinyhttp/app')

app.use((req, res) => void res.send(`${req.url} adresindesiniz`))

module.exports = async (req, res) => await app.handler(req, res)
```

### `app.listen`

Belirtilen bir port ve host üzerinde bir HTTP sunucusu başlatır ve dinler.

```js
import { App } from '@tinyhttp/app'

const app = new App()

app
  .use((_, res) => void res.send('Merhaba Dünya'))
  .listen(3000, () => console.log(`:3000 üzerinde başlatıldı`))
```