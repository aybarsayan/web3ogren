---
description: tinyhttp İstek nesnesi, HTTP isteklerini işlemek için gerekli özellikleri sağlar. Bu belgede `req` nesnesinin özellikleri ve metodları detaylıca açıklanmıştır.
keywords: [tinyhttp, req, HTTP, özellikler, metodlar, kestirme, middleware]
---

# İstek

`req` nesnesi HTTP isteğini temsil eder ve istek sorgu dizesi, parametreler, gövde, HTTP başlıkları vb. için özelliklere sahiptir.

```ts
app.get('/user/:id', (req, res) => void res.send(`kullanıcı ${req.params.id}`))
```

`req` nesnesi, Node.js yerleşik [IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) nesnesinin geliştirilmiş bir versiyonudur.

## Özellikler

### `req.hostname`

`Host` veya `X-Forwarded-Host` HTTP başlığından türetilen ana bilgisayarı içerir.

```ts
// Host: "example.com:3000"
console.dir(req.hostname)
// => 'example.com'
```

### `req.query`

Bu özellik, rota üzerindeki her sorgu dizesi parametresi için bir özellik içeren bir nesnedir.

```ts
// GET /search?q=tobi+ferret
console.dir(req.query.q)
// => "tobi ferret"

// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
console.dir(req.query.order)
// => "desc"

console.dir(req.query.shoe.color)
// => "blue"

console.dir(req.query.shoe.type)
// => "converse"

// GET /shoes?color[]=blue&color[]=black&color[]=red
console.dir(req.query.color)
// => [blue, black, red]
```

### `req.route`

> Bu özellik `enableReqRoute` ayarı aracılığıyla etkinleştirilebilir.

Geçerli eşleşen rota olan bir dize içerir. Örneğin:

```ts
app.get('/user/:id?', function userIdHandler(req, res) {
  console.log(req.route)
  res.send('GET')
})
```

Örnek çıktı, şöyle bir şey olacaktır:

```txt
{
  path: '/user/:id?',
  method: 'GET',
  handler: [Function: userIdHandler],
  type: 'route'
}
```

### `req.params`

Bu özellik, adlandırılmış rota "parametreleri" ile eşleştirilmiş özellikleri içeren bir nesnedir. Örneğin, `/user/:name` rotasına sahipseniz, "name" özelliği `req.params.name` olarak mevcuttur. Bu nesne varsayılan olarak `{}` ile başlar.

```ts
// GET /user/v1rtl

app.get('/user/:name', (req, res) => {
  res.end(`Merhaba ${req.params.name}!`)
})
// => v1rtl
```

### `req.protocol`

İsteğin protokol dizesini içerir: ya http ya da (TLS istekleri için) https. Bu özellik, `X-Forwarded-Proto` başlık alanının değeri varsa bu değeri kullanır. Bu başlık, istemci veya proxy tarafından ayarlanabilir.

```ts
console.dir(req.protocol)
```

### `req.secure`

TLS bağlantısının kurulması durumunda true olan bir Boole özelliğidir. Aşağıdaki ile eşdeğerdir:

```ts
req.protocol === 'https'
```

### `req.xhr`

İsteğin `X-Requested-With` başlık alanı "XMLHttpRequest" olduğunda true olan bir Boole özelliğidir; bu, isteğin bir istemci kütüphanesi (örneğin `fetch`) tarafından verildiğini gösterir.

```ts
console.dir(req.xhr)
// => true
```

### `req.fresh`

Yanıt istemcinin önbelleğinde hala "taze" olduğunda true döner, bu durumda false döner; bu, istemci önbelleğinin artık eski olduğunu ve tam bir yanıtın gönderilmesi gerektiğini belirtir.

:::info
İstemci, geçişi gerektiren bir son-son yeniden yükleme isteği belirtmek için `Cache-Control: no-cache` istek başlığını gönderdiğinde, bu modül bu tür istekleri şeffaf hale getirmek için false döner. Önbellek doğrulamanın nasıl çalıştığına dair daha fazla ayrıntı için [HTTP/1.1 Önbellek Spesifikasyonu](https://tools.ietf.org/html/rfc7234) sayfasına bakabilirsiniz.
:::

```ts
console.dir(req.fresh)
// => true
```

### `req.stale`

İsteğin "eski" olup olmadığını belirtir ve `req.fresh` özelliğinin zıttıdır. Daha fazla bilgi için `req.fresh` bölümüne bakınız.

```ts
console.dir(req.stale)
// => true
```

### `req.ip`

İsteğin uzaktaki IP adresini içerir.

```ts
console.log(req.ip)
// => '127.0.0.1'
```

### `req.ips`

İsteğin uzaktaki IP adresleri içeren bir dizi içerir.

```ts
console.log(req.ips)
// => ['127.0.0.1']
```

### `req.subdomains`

> Bu özellik `networkExtensions` ayarı aracılığıyla etkinleştirilebilir.

Bir dizi alt alan adını içerir. Alt alan ofseti `subdomainOffset` ile ayarlanabilir.

```ts
console.log(req.hostname)
// dev.node0.example.com

console.log(req.subdomains)
// ['node0', 'dev']
```

### `req.app`

> Bu özellik `bindAppToReqRes` ayarı aracılığıyla etkinleştirilebilir.

Kullanılan uygulamanın bir referansını göstermektedir.

```ts
app.use((req, res) => void res.json(req.app.settings))
```

### `req.path`

İstek URL'sinin yol kısmını içerir.

```js
// example.com/users?sort=desc
console.dir(req.path)
// => '/users'
```

## Metodlar

### `req.accepts`

İstenilen içerik türlerinin, isteğin `Accept` HTTP başlık alanına dayanarak kabul edilip edilmediğini kontrol eder. Metod, en iyi eşleşmeyi döner; eğer belirtilen içerik türlerinden hiçbiri kabul edilmezse, `false` döner (bu durumda uygulama `406 "Kabul Edilemez"` yanıtı vermelidir).

Tip değeri tek bir MIME türü dizesi (örneğin `"application/json"`), bir uzantı adı (örneğin `"json"`), virgüllerle ayrılmış bir liste veya bir dizi olabilir. Bir liste veya dizi için metod, _**en iyi**_ eşleşmeyi döner (varsa).

```ts
// Accept: text/html
req.accepts('html')
// => "html"

// Accept: text/*, application/json
req.accepts('html')
// => "html"
req.accepts('text/html')
// => "text/html"
req.accepts(['json', 'text'])
// => "json"
req.accepts('application/json')
// => "application/json"

// Accept: text/*, application/json
req.accepts('image/png')
req.accepts('png')
// => false

// Accept: text/*;q=.5, application/json
req.accepts(['html', 'json'])
// => "json"
```

Daha fazla bilgi için veya sorunlarınız varsa, [accepts](https://github.com/jshttp/accepts) sayfasına bakabilirsiniz.

### `req.acceptsEncodings`

Belirtilen kodlamaların en erken kabul edilen kodlamasını döndürür, isteğin `Accept-Encoding` HTTP başlık alanına dayanarak. Eğer belirtilen kodlamalardan hiçbiri kabul edilmezse, `false` döner.

### `req.acceptsCharsets`

Belirtilen karakter setlerinin en erken kabul edilen karakter setini döndürür, isteğin `Accept-Charset` HTTP başlık alanına dayanarak. Eğer belirtilen karakter setlerinden hiçbiri kabul edilmezse, `false` döner.

### `req.get`

Belirtilen HTTP istek başlık alanını döndürür (büyük/küçük harf duyarsız eşleşme).

```ts
req.get('Content-Type')
// => "text/plain"

req.get('content-type')
// => "text/plain"

req.get('Something')
// => undefined
```

### `req.range`

`Range` başlığını işler.

```js
app.use((req, res) => {
  const ranges = req.range(1000)

  if (range.type === 'bytes') {
    // aralıklar
    range.forEach((r) => {
      // r.start ve r.end ile bir şey yap
    })
  }
})
```  