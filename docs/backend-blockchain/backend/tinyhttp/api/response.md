---
description: tinyhttp Yanıt nesnesi belgeleri iletimi hakkında kapsamlı bir içerik sunmaktadır. Yanıt nesnesinin özellikleri ve yöntemleri detaylı olarak açıklanmaktadır, böylece uygulama geliştirme sürecinde etkili bir şekilde kullanılabilir.
keywords: [tinyhttp, yanıt, nesne, HTTPS, cookie, json, http]
---

## Yanıt

`res` nesnesi, bir tinyhttp uygulamasının HTTP isteği aldığında gönderdiği HTTP yanıtını temsil eder.

## Özellikler

### `res.app`

> Bu özellik `bindAppToReqRes` ayarı ile etkinleştirilebilir.

Şu anda kullanılan uygulamanın bir referansına işaret eder.

```js
app.use((req, res) => {
  res.json(res.app.settings)
})
```

## Yöntemler

### `res.append`

Belirtilen `value` değerini HTTP yanıt `header` alanına ekler. Eğer header daha önce ayarlanmamışsa, belirtilen değerle birlikte yeni bir header oluşturur. Değer parametresi bir dize veya bir dizi olabilir.

> `res.append()` çağrısından sonra `res.set()` çağrılması, daha önce ayarlanan header değerini sıfırlar.

```js
res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>'])
res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly')
res.append('Warning', '199 Çeşitli uyarı')
```

### `res.cookie`

Cookie `name` değerini `value` olarak ayarlar. `value` parametresi bir dize veya JSON'a dönüştürülmüş bir nesne olabilir.

`options` parametresi aşağıdaki özelliklere sahip bir nesne olabilir.

| Özellik    | Tür                 | Açıklama                                                                                                                                  |
| ---------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`   | `string`            | Cookie için alan adı. Varsayılan olarak uygulamanın alan adını alır.                                                                          |
| `encode`   | `Function`          | Cookie değeri kodlaması için kullanılan senkron bir fonksiyon. Varsayılan olarak `encodeURIComponent` kullanır.                                                     |
| `expires`  | `Date`              | Cookie'nin GMT cinsinden sona erme tarihi. Belirtilmemişse veya 0 olarak ayarlandığında, bir oturum çerezi oluşturur.                                                    |
| `httpOnly` | `boolean`           | Cookie'nin yalnızca web sunucusu tarafından erişilebilir olmasını işaretler.                                                                                    |
| `maxAge`   | `number`            | Geçerlilik süresini mevcut zamana göre milisaniye cinsinden ayarlamak için kullanışlı bir seçenektir.                                                  |
| `path`     | `string`            | Cookie için yol. Varsayılan olarak “/” alır.                                                                                                        |
| `secure`   | `boolean`           | Cookie'nin yalnızca HTTPS ile kullanılmasını işaretler.                                                                                                 |
| `signed`   | `boolean`           | Cookie'nin imzalanıp imzalanmayacağını belirtir.                                                                                                    |
| `sameSite` | `boolean \| string` | “SameSite” Set-Cookie niteliğinin değeri. [Daha fazla bilgi](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1). |

> `res.cookie()` yönteminin yaptığı şey, sağlanan seçeneklerle HTTP Set-Cookie header'ını ayarlamaktır. Belirtilmeyen herhangi bir seçenek, RFC 6265'te belirtilen değer varsayılanlarını alır.

```ts
res.cookie('name', 'tobi', {
  domain: '.example.com',
  path: '/admin',
  secure: true,
})

// "httpOnly" ve "expires" parametrelerini etkinleştir
res.cookie('rememberme', '1', {
  expires: new Date(Date.now() + 900000),
  httpOnly: true,
})
```

### `res.clearCookie`

Belirtilen `name` ile çerezi temizler. `options` nesnesi hakkında ayrıntılar için `res.cookie()` sayfasına bakın.

> Web tarayıcıları ve diğer uyumlu istemciler, verilen seçenekler `res.cookie()` ile verilenlerle özdeş olduğu sürece sadece çerezi temizleyecektir; expires ve maxAge hariç.

```ts
res.cookie('name', 'tobi', { path: '/admin' })
res.clearCookie('name', { path: '/admin' })
```

### `res.end`

Yanıt sürecini sonlandırır. Bu yöntem, [http.ServerResponse'ın response.end()](https://nodejs.org/api/http.html#http_response_end_data_encoding_callback) metodundan gelir.

Ham veriler göndermek veya yanıtı hiç veri olmadan sonlandırmak için kullanılabilir. Veri ile yanıt vermeniz gerekiyorsa, uygun içerik tipi başlıkları ayarlanmışsa, bunun yerine `res.send()` ve `res.json()` gibi yöntemler kullanmalısınız.

```ts
res.end()
res.status(404).end()
```

### `res.json`

JSON yanıtı gönderir. Bu yöntem, parametreyi [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) kullanarak bir JSON dizesine dönüştürerek yanıt gönderir (doğru `Content-Type` başlığı ile).

Gövde herhangi bir türde JSON olabilir; nesne, dizi, `string`, `boolean`, `number` veya `null` dahil.

```ts
res.json(null)
res.json({ user: 'tobi' })
res.status(500).json({ error: 'message' })
```

### `res.send`

HTTP yanıtını gönderir.

Gövde bir `Buffer` nesnesi, bir dize, bir nesne veya bir dizi olabilir.

```ts
res.send(Buffer.from('whoop'))
res.send({ some: 'json' })
res.send('<p>bazı html</p>')
res.status(404).send('Üzgünüm, bunu bulamıyoruz!')
res.status(500).send({ error: 'bir şey patladı' })
```

Bu yöntem, basit akış dışı yanıtlar için birçok yararlı görev gerçekleştirir: Örneğin, otomatik olarak uygun `Content-Length` başlığı değerini ayarlar ve otomatik HEAD ve HTTP önbellek tazeliği desteği sağlar.

Parametre bir `Buffer` nesnesi olduğunda, yöntem `Content-Type` yanıt başlık alanını `"application/octet-stream"` olarak ayarlar; daha önce tanımlanmamışsa aşağıda gösterildiği gibi:

```ts
res.set('Content-Type', 'text/html')
res.send(Buffer.from('<p>bazı html</p>'))
```

Parametre bir dize olduğunda, yöntem `Content-Type`'ı `"text/html"` olarak ayarlar:

```ts
res.send('<p>bazı html</p>')
```

Parametre bir Dizi veya Nesne olduğunda, Express JSON temsilini yanıt verir (tıpkı `res.json` gibi):

```ts
res.send({ user: 'tobi' })
res.send([1, 2, 3])
```

### `res.status`

Yanıt için HTTP durumunu ayarlar. Node’un `response.statusCode`'sinin zincirlenebilir bir takma adıdır.

```ts
res.status(403).end()
res.status(400).send('Kötü İstek')
```

### `res.sendStatus`

Yanıt HTTP durum kodunu statusCode'ye ayarlar ve durum metnini yanıt gövdesi olarak gönderir.

```ts
res.sendStatus(200) // res.status(200).send('OK') ile eşdeğerdir
res.sendStatus(403) // res.status(403).send('Yasaklı') ile eşdeğerdir
res.sendStatus(404) // res.status(404).send('Bulunamadı') ile eşdeğerdir
res.sendStatus(500) // res.status(500).send('Sunucu Hatası') ile eşdeğerdir
```

Desteklenmeyen bir durum kodu belirtilirse, HTTP durumu hala statusCode olarak ayarlanır ve kodun dize versiyonu yanıt gövdesi olarak gönderilir.

```ts
res.sendStatus(9999) // res.status(9999).send('9999') ile eşdeğerdir
```

[Daha fazla HTTP Durum Kodu hakkında](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

### `res.sendFile`

Bir dosyayı yanıt akışına ileterek gönderir. Ayrıca, uygun bir `Content-Type` başlık alanını ayarlamak için uzantıyı kontrol eder.

> Yol argümanı mutlak olmalıdır. Göreceli bir yol kullanmak için önce `root` seçeneğini belirtin.

```js
res.sendFile('song.mp3', { root: process.cwd() }, (err) => console.log(err))
```

### `res.set`

Yanıtın HTTP başlık `field`ini `value` olarak ayarlar. Birden fazla alanı bir kerede ayarlamak için, parametre olarak bir nesne geçiririn.

```ts
res.set('Content-Type', 'text/plain')

res.set({
  'Content-Type': 'text/plain',
  'Content-Length': '123',
  ETag: '12345',
})
```

`res.header` için takma addır.

### `res.links`

Parametre olarak sağlanan `links` değerlerini bir araya getirerek yanıtın `Link` HTTP başlık alanını doldurur.

Örneğin, aşağıdaki çağrı:

```ts
res.links({
  next: 'http://api.example.com/users?page=2',
  last: 'http://api.example.com/users?page=5',
})
```

Aşağıdaki sonuçları verir:

```txt
Link: <http://api.example.com/users?page=2>; rel="next",
      <http://api.example.com/users?page=5>; rel="last"
```

### `res.location`

Yanıtın Location HTTP başlığını belirtilen yol parametresi ile ayarlar.

```ts
res.location('/foo/bar')
res.location('http://example.com')
res.location('back')
```

`"back"` değerine sahip bir `path`, özel bir anlam taşır, istemin `Referer` başlığında belirtilen URL'yi ifade eder. Referer başlığı belirtilmemişse, `"/"` değerine karşılık gelir.

> URL'yi kodladıktan sonra, daha önce kodlanmamışsa, tinyhttp belirtilen URL'yi tarayıcıya `Location` başlığı içinde geçirir; herhangi bir doğrulama olmaksızın. Tarayıcılar, mevcut URL veya referans URL'sinden ve Location başlığındaki belirtilen URL'den, niyet edilen URL'yi türetmekten sorumludur ve kullanıcıyı buna göre yönlendirir.

### `res.render`

Önceden tanımlanmış bir motor kullanarak bir şablonu işler ve sonucun yanıtında gönderir.

```js
import { App } from '@tinyhttp/app'
import ejs from 'ejs'

const app = new App()

app.engine('ejs', ejs.renderFile)

app.use((_, res) => void res.render('index.ejs', { name: 'EJS' }))

app.listen(3000, () => console.log(`http://localhost:3000 üzerinde dinleniyor`))
```

### `res.vary`

Vary yanıt başlığına, daha önce yoksa alanı ekler.

```js
res.vary('User-Agent').render('docs')
```

### `res.format`

`Accept` başlığındaki değere dayalı koşullu yanıt gönderir. Örneğin, `Accept` HTML içeriyorsa, HTML seçeneği gönderilecektir.

```js
res.format({
  html: (req, res) => void res.send('<h1>HTML için Merhaba Dünya</h1>')
  text: (req, res) => void res.send('Metin için Merhaba Dünya')
})
```

Ve `Accept` başlığına bağlı olarak farklı yanıtlar gönderecektir:

```sh
curl -H "Accept: text/html" localhost:3000
# <h1>HTML için Merhaba Dünya</h1>

curl localhost:3000
# Metin için Merhaba Dünya
```

### `res.redirect`

Belirtilen URL'ye yönlendirmek için 302 (veya başka bir) durum kodu ve `Location` başlığı gönderir.

```js
res.redirect('/another-page')

// özel durum
res.redirect('/some-other-page', 300)
```

### `res.type`

`Content-Type` HTTP başlığını belirtilen tür için [mime.lookup()](https://github.com/talentlessguy/es-mime-types/blob/master/src/index.ts#L123) ile belirlenen MIME türüne ayarlar. Eğer tür `/` karakterini içeriyorsa, `Content-Type` türüne ayar yapar.

```js
res.type('.html')
// => 'text/html'
res.type('html')
// => 'text/html'
res.type('json')
// => 'application/json'
res.type('application/json')
// => 'application/json'
res.type('png')
// => 'image/png'
```

### `res.jsonp`

JSONP geri çağrı desteği ile JSON yanıtı gönderir. `res.jsonp` pek yaygın olarak kullanılmaz, bu nedenle ayrı bir paket içerisinde bulunur - [`@tinyhttp/jsonp`](https://github.com/tinyhttp/tinyhttp/blob/master/packages/jsonp)

Bunu etkinleştirmenin yolu:

```js
import { jsonp } from '@tinyhttp/jsonp'

app.use((req, res, next) => {
  res.jsonp = jsonp(req, res, app)
  next()
})

app.get('/', (req, res) => {
  res.jsonp({ some: 'jsonp' })
})