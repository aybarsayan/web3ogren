---
description: tinyhttp ile uygulama yazarken ana kavramlar hakkında bilgi.
keywords: [tinyhttp, middleware, routing, uygulama, hata yönetimi, şablon motorları, işleyici]
---

# Ana Kavramlar

## Uygulama

Bir tinyhttp uygulaması, middleware ve yönlendirici (router) yöntemlerini içeren bir `App` sınıfının bir örneğidir.

```js
import { App } from '@tinyhttp/app'

const app = new App()

app.use((req, res) => void res.send('Merhaba Dünya'))

app.listen(3000)
```

App seçenekleri bir kurucu içinde ayarlanabilir.

```js
const app = new App({
  noMatchHandler: (req, res) => void res.send('Oopsie, sayfa bulunamadı'),
})
```

## Middleware

Middleware, Express'teki gibi isteği yönetmek için bir işleyici fonksiyonu ve isteğe bağlı olarak bir yol içeren bir nesnedir.

```js
app
  .use((req, _res, next) => {
    console.log(` ${req.url} adresinden bir istek yapıldı!`)
    next()
  })
  .use((_req, res) => void res.send('Merhaba Dünya'))
```

### İşleyici

İşleyici, `Request` ve `Response` nesnesini argüman olarak alan bir fonksiyondur. Bu nesneler, yerleşik `http`'nin `IncomingMessage` ve `ServerResponse` nesnelerinin genişletilmiş versiyonlarıdır.

```js
app.use((req, res) => {
  res.send({ query: req.query })
})
```

### Asenkron işleyiciler

tinyhttp, Express'ten farklı olarak, asenkron fonksiyonları işleyici olarak destekler. Bir promise tarafından atılan herhangi bir hata, üst düzey `try...catch` ile yakalanır; bu da, eğer gerekmediyse kendi `try...catch` bloğunuzu oluşturmanıza gerek kalmaz.

```js
import { App } from '@tinyhttp/app'
import { readFile } from 'node:fs/promises'

app.use('/', async (req, res, next) => {
  const file = await readFile('file.txt') // hata durumunda 500 ile hata mesajı gönderir
  res.send(file)
})
```

### Yol

İstek URL'si belirtilen yol ile başlarsa, işleyici istek ve yanıt nesnelerini işler. Middleware yalnızca belirtilen yol ile başlayan URL'leri işleyebilir. Gelişmiş yollar (parametreli ve tam eşleşmeli) için `Routing` bölümüne gidin.

```js
app.use('/', (_req, _res, next) => void next()) // Tüm yolları işleyecek
app.use('/path', (_req, _res, next) => void next()) // /path ile başlayan yolları işleyecek
```

`path` argümanı isteğe bağlıdır (varsayılan olarak `/`dır), bu yüzden işleyici fonksiyonunuzu `app.use`'in ilk argümanı olarak koyabilirsiniz.

### Zincirleme

tinyhttp uygulaması, herhangi bir `app.use` çağrısında kendisini döndürür, bu da zincirleme yapmamıza olanak tanır:

```js
app.use((_) => {}).use((_) => {})
```

`app.get` gibi yönlendirme fonksiyonları da zincirlemeyi destekler.

### Çalışma sırası

Tüm middleware bir döngü içinde çalıştırılır. Bir middleware işleyicisi `next()` çağırdığında, tinyhttp bir sonraki middleware'e geçer ve döngü sona erene kadar devam eder.

```js
app
  .use((_, res) => res.end('Merhaba Dünya'))
  .use((_, res) => res.end('Ben ulaşılamayan middleware\'im'))
```

Middleware zincirlerinde `next()` çağırdığınızdan emin olun, çünkü aksi takdirde mevcut işleyicide kalır ve bir sonraki işleyiciye geçmez.

## Routing

_**Routing**_ uygulamanızın belirli yollar (örn. `/` veya `/test`) ve yöntemler (`GET`, `POST` vb.) kullanarak istekleri nasıl yöneteceğini tanımlamaktır.

Her yönelge, istek URL'si ile eşleştiğinde devreye giren bir veya daha fazla middleware'e sahip olabilir.

Yönlendirmeler genellikle aşağıdaki yapıya sahiptir:

```js
app.METHOD(path, handler, ...handlers)
```

Burada `app`, tinyhttp `App` örneğidir, `path`, isteğin URL'si ile eşleşmesi gereken yoldur ve `handler` (+ `handlers`), belirtilen yollar istek URL'si ile eşleştiğinde yürütülen bir fonksiyondur.

```js
import { App } from '@tinyhttp/app'

const app = new App()

app.get('/', (_req, res) => void res.send('Merhaba Dünya'))
```

### Yönlendirme fonksiyonları

En popüler yöntemler (örn. `GET`, `POST`, `PUT`, `OPTIONS`) yönlendirme için önceden tanımlanmış fonksiyonlara sahiptir. tinyhttp'nin ileriki sürümlerinde tüm yöntemler için kendi fonksiyonları olacaktır.

```js
app
  .get('/', (_req, res) => void res.send('Merhaba Dünya'))
  .post('/a/b', (req, res) => void res.send('Bir POST isteği gönderildi'))
```

Tüm HTTP yöntemlerini işlemek için `app.all` kullanın:

```js
app.all('*', (req, res) =>
  res.send(` ${req.url} adresine ${req.method} yöntemiyle bir istek yapıldı`)
)
```

### Yönlendirme yolları

Yönlendirme yolları, bir istek yöntemi ile birleştiğinde, isteğin yapılabileceği uç noktaları tanımlar. Yönlendirme yolları dizeler, dize kalıpları veya düzenli ifadeler (henüz değil) olabilir.

> tinyhttp, yönlendirme eşleşmesi için bir [regexparam](https://github.com/lukeed/regexparam) modülü kullanır. Yönlendirme kalıpları hakkında daha fazla bilgi için README'sine bakın.

Sonuçta, istek URL'sindeki son `?` sembolünden sonra gelen sorgu dizeleri yoldan çıkarılır.

Bu yönlendirme yolu, kök yönlendirmeye, /'ya gelen istekleri eşleştirecektir.

```js
app.get('/', function (req, res) {
  res.send('kök')
})
```

Bu yönlendirme yolu, /about'a gelen istekleri eşleştirecektir.

```js
app.get('/about', function (req, res) {
  res.send('hakkında')
})
```

Bu yönlendirme yolu, /random.text'e gelen istekleri eşleştirecektir.

```js
app.get('/random.text', (req, res) => void res.send('random.text'))
```

Bu yönlendirme yolu, acd ve abcd'yi eşleştirecektir.

```js
app.get('/ab?cd', (req, res) => void res.send('ab?cd'))
```

#### Yönlendirme parametreleri

Yönlendirme parametreleri, URL'deki pozisyonlarına göre belirtilen değerleri yakalamak için kullanılan adlandırılmış URL segmentleridir. Yakalanan değerler, `req.params` nesnesinde yer alır ve yol parametresinin adını anahtar olarak kullanır.

```
Yönlendirme yolu: /users/:userId/books/:bookId
İstek URL'si: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }
```

Yol parametreli yönlendirmeleri tanımlamak için, yalnızca yolun içinde yönlendirme parametrelerini belirtin:

```js
app.get('/users/:userId/books/:bookId', (req, res) => void res.send(req.params))
```

### Yönlendirme işleyicileri

Bir isteği yönetmek için `middleware` gibi davranan birden fazla geri çağırma fonksiyonu sağlayabilirsiniz. Tek istisna, bu geri çağırmaların kalan yönlendirme geri çağırmalarını atlamak için `next()`'i çağırabilmesidir. Bu tekniği, artık mevcut middleware'de kalmaya gerek kalmadığında, middleware'i koşullu olarak değiştirmek veya atlamak için kullanabilirsiniz.

Yönlendirme işleyicileri, bir fonksiyon veya bir liste halinde olabilir, aşağıdaki örneklerdeki gibi.

Tek bir geri çağırma fonksiyonu bir yönlendirmeyi işleyebilir. Örneğin:

```js
app.get('/example/a', (req, res) => void res.send('A\'dan Merhaba!'))
```

Birden fazla geri çağırma fonksiyonu bir yönlendirmeyi işleyebilir ( `next` fonksiyonunu belirtmeyi unutmayın). Örneğin:

```js
app.get(
  '/example/b',
  (req, res, next) => {
    console.log('yanıt bir sonraki fonksiyon tarafından gönderilecek ...')
    next()
  },
  (req, res) => void res.send('B\'dan Merhaba!')
)
```

Bir liste geri çağırma fonksiyonu bir yönlendirmeyi işleyebilir. Örneğin:

```js
const cb0 = (req, res, next) => {
  console.log('Geri çağırma bir!')
  next()
}

const cb1 = (req, res, next) => {
  console.log('Geri çağırma iki!')
  next()
}

const cb2 = (req, res) => void res.send('Geri çağırma üçten Merhaba!')

app.get('/example/c', cb0, cb1, cb2)
```

## Alt uygulamalar

tinyhttp'nin `App`'ini kullanarak, bir grup işleyiciyi modüler hale getirerek başka bir "ana" uygulamaya bağlayabilirsiniz.

Her uygulamanın kendi middleware, ayarlar ve yerelleri vardır. Şu anda destek deneyseldir ve muhtemelen beklendiği gibi çalışmayacaktır (tüm senaryolar test edilmedi), ancak yine de denemeyi deneyebilirsiniz:

```js
import { App } from '@tinyhttp/app'

const app = new App()

const subApp = new App()

subApp.get(
  '/route',
  (req, res) => void res.send(` ${subApp.mountpath} adresinden Merhaba!`)
)

app.use('/subapp', subApp).listen(3000)

// localhost:3000/subapp/route "Hello from /subapp" gönderecek
```

## Hata yönetimi

Asenkron middleware'lerdeki hatalar tinyhttp tarafından yönetilir ancak belirli bir hatayı yönetmek için kendi `try...catch`'ınızı ekleyebilirsiniz. Ancak, merkezi bir `onError` işleyicisini kullanmanız önerilir.

```js
import { App } from '@tinyhttp/app'
import { readFile } from 'fs/promises'

const app = new App({
  // Özel hata işleyici
  onError: (err, _req, res) => {
    console.log(err)
    res.status(500).send(`Kötü bir şey oldu`)
  },
})

app
  .get('/', async (_, res, next) => {
    const file = await readFile(`var olmayan dosya`)
    res.send(file.toString())
  })
  .listen(3000, () => console.log('http://localhost:3000 adresinde başladı'))
```

## Şablon motorları

> v0.2.70'ten itibaren tinyhttp, şablon motorları için temel destek sağlamaktadır. v2.2'den itibaren, görünüm motoru express ile daha iyi uyumluluk için yeniden tasarlandı.

> [Eta v2](https://eta.js.org/docs/2.x.x/examples/express) tinyhttp ile en iyi çalışmaktadır. [Eta v3](https://eta.js.org/docs/api#setting-up-eta) ile motoru kaydetmeye gerek yoktur, şablonları bir `Eta` örneği kullanarak render etmelisiniz.

Bir motor kullanmak için, öncelikle onu belirli bir uzantı için kaydetmelisiniz.

```js
import { App } from '@tinyhttp/app'
import eta from 'eta'

const app = new App()

app.engine('eta', eta.renderFile) // app.engines['eta']'yı eta.renderFile fonksiyonuna eşler
```

Ayrıca, varsayılan bir motor ayarlayabilirsiniz (bu, tüm şablonlar için varsayılan olarak kullanılacaktır):

```js
app.set('view engine', 'eta')
```

Ve artık herhangi bir şablon dosyasını `res.render` yöntemi kullanarak render etmek mümkün:

```ts
import { App } from '@tinyhttp/app'
import eta from 'eta'
import type { PartialConfig } from 'eta/dist/types/config' // `res.render`'ın şablon motoru ayar türünü miras almasını sağlar

const app = new App()

app.engine('eta', eta.renderFile)

app.use(
  (_, res) => void res.render<PartialConfig>('index.eta', { name: 'Eta' })
)

app.listen(3000, () => console.log(`http://localhost:3000'da dinliyor`))
```

Gelişmiş yapılandırma için [özelleştirilmiş görünüm](https://github.com/tinyhttp/tinyhttp/tree/master/examples/custom-view) ve [eta](https://github.com/tinyhttp/tinyhttp/tree/master/examples/eta) örneklerine başvurun.