---
title: Sunucu seçenekleri
seoTitle: Socket.IO Sunucu Seçenekleri
sidebar_position: 2
description: Socket.IO sunucu seçenekleri ve yapılandırmaları hakkında kapsamlı bir rehber. Bu belge, Socket.IO uygulamanız için önemli olan ayarları ve kullanımlarını içerir.
tags: 
  - Socket.IO
  - Sunucu
  - WebSocket
  - Geliştirme
  - Node.js
keywords: 
  - Socket.IO
  - Sunucu seçenekleri
  - WebSocket
  - Geliştirme
  - Node.js
---



## Socket.IO sunucu seçenekleri

Aşağıdaki seçenekler, Socket.IO sunucusunun davranışını etkiler.

### `adapter`

Varsayılan değer: `require("socket.io-adapter")` (hafızada saklanan adaptör, kaynak kodu [burada](https://github.com/socketio/socket.io-adapter/) bulunabilir)

Kullanılacak `"Adaptör"`.

:::tip
Redis adaptörünü kullanarak bir örnek:
:::


  

```js
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();

const io = new Server({
  adapter: createAdapter(pubClient, subClient)
});

io.listen(3000);
```

  
  

```js
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();

const io = new Server({
  adapter: createAdapter(pubClient, subClient)
});

io.listen(3000);
```

  
  

```ts
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();

const io = new Server({
  adapter: createAdapter(pubClient, subClient)
});

io.listen(3000);
```

  


### `cleanupEmptyChildNamespaces`

*V4.6.0'da eklendi*

Varsayılan değer: `false`

Bağlı socket'leri olmayan `çocuk alan adlarını` kaldırma seçeneği.

:::info
Bu seçenek, birçok dinamik alan adı oluşturuyorsanız kullanışlı olabilir, çünkü her alan adı kendi adaptör örneğini oluşturur.
:::

Bu seçenek etkinleştirildiğinde (varsayılan olarak devre dışı), bir socket dinamik bir alan adından bağlantısını kestiğinde ve başka bir socket ona bağlı değilse, alan adı temizlenecek ve adaptörü kapatılacaktır.

### `connectionStateRecovery`

*V4.6.0'da eklendi*

Varsayılan değer: `undefined`

`Bağlantı durumu geri kazanımı` özelliği için seçenek:

```js
const io = new Server(httpServer, {
  connectionStateRecovery: {
    // oturumların ve paketlerin yedekleme süresi
    maxDisconnectionDuration: 2 * 60 * 1000,
    // başarılı bir geri kazanımda orta katmanları atlayıp atlamayacağını
    skipMiddlewares: true,
  }
});
```

:::warn
`skipMiddlewares` seçeneği `true` olarak ayarlandığında, bağlantı başarılı bir şekilde geri kazanıldığında orta katmanlar atlanacaktır.
:::

```js
function computeUserIdFromHeaders(headers) {
  // uygulanacak
}

// bu orta katman bağlantı başarılı bir şekilde geri kazanıldığında atlanacaktır
io.use(async (socket, next) => {
  socket.data.userId = await computeUserIdFromHeaders(socket.handshake.headers);

  next();
});

io.on("connection", (socket) => {
  // userId niteliği ya buradan gelecektir:
  // - yukarıdaki orta katmandan (ilk bağlantı veya başarısız geri kazanım)
  // - geri kazanım mekanizmasından
  console.log("userId", socket.data.userId);
});
```

### `connectTimeout`

Varsayılan değer: `45000`

Bir alan adına başarıyla katılmayan bir istemcinin bağlantısının kesilmeden önce beklediği ms sayısı.

### `parser`

Varsayılan değer: `socket.io-parser`

Kullanılacak ayrıştırıcı. Lütfen belgelere `buradan` bakın.

### `path`

Varsayılan değer: `/socket.io/`

Sunucu tarafında yakalanacak olan yolun adıdır.

:::caution
Sunucu ve istemci değerleri eşleşmelidir (aralarında bir yol-yazma proxy kullanmıyorsanız).
:::

*Sunucu*

```js
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  path: "/my-custom-path/"
});
```

*İstemci*

```js
import { io } from "socket.io-client";

const socket = io("https://example.com", {
  path: "/my-custom-path/"
});
```

### `serveClient`

Varsayılan değer: `true`

İstemci dosyalarını sunma durumu. Eğer `true` ise, farklı paketler aşağıdaki konumda sunulacaktır:

- `/socket.io/socket.io.js`
- `/socket.io/socket.io.min.js`
- `/socket.io/socket.io.msgpack.min.js`

(ilişkili kaynak haritalar dahil)

Ayrıca `buraya` bakın.

## Düşük seviye motor seçenekleri

Aşağıdaki seçenekler, temel Engine.IO sunucusunun davranışını etkiler.

### `addTrailingSlash`

*V4.6.0'da eklendi*

Varsayılan değer: `true`

Varsayılan olarak eklenen son / işareti artık devre dışı bırakılabilir:

```js
import { createServer } from "node:http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  addTrailingSlash: false
});
```

Yukarıdaki örnekte, istemciler son / işaretini atlayabilir ve `/socket.io` yerine `/socket.io/` kullanabilirler.

### `allowEIO3`

Varsayılan değer: `false`

Socket.IO v2 istemcileri ile uyumluluğu etkinleştirme durumu.

:::info
Ayrıca bakınız: `2.x'den 3.0'a geçiş`.
:::

Örnek:

```js
const io = new Server(httpServer, {
  allowEIO3: true // varsayılan olarak false
});
```

### `allowRequest`

Varsayılan: `-`

Verilen bir el sıkışma veya yükseltme isteğini ilk parametre olarak alan ve devam edip etmeyeceğine karar verebilen bir fonksiyon.

Örnek:

```js
const io = new Server(httpServer, {
  allowRequest: (req, callback) => {
    const isOriginValid = check(req);
    callback(null, isOriginValid);
  }
});
```

Bu ayrıca `initial_headers` olayında bir çerezi istemciye göndermek için de kullanılabilir:

```js
import { serialize } from "cookie";

const io = new Server(httpServer, {
  allowRequest: async (req, callback) => {
    const session = await fetchSession(req);
    req.session = session;
    callback(null, true);
  }
});

io.engine.on("initial_headers", (headers, req) => {
  if (req.session) {
    headers["set-cookie"] = serialize("sid", req.session.id, { sameSite: "strict" });
  }
});
```

Ayrıca bakınız:

- `express-session ile nasıl kullanılır`
- `çerezlerle nasıl başa çıkılır`

### `allowUpgrades`

Varsayılan değer: `true`

Taşıma yükseltmelerine izin verilip verilmediği.

### `cookie`

Varsayılan değer: `-`

[`cookie`](https://github.com/jshttp/cookie/) modülüne iletilecek seçenekler listesi. Mevcut seçenekler:

- domain
- encode
- expires
- httpOnly
- maxAge
- path
- sameSite
- secure

Örnek:

```js
import { Server } from "socket.io";

const io = new Server(httpServer, {
  cookie: {
    name: "my-cookie",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 86400
  }
});
```

:::info
Socket.IO v3'ten itibaren, varsayılan olarak hiçbir çerez gönderilmez (`referans`).
:::

### `cors`

Varsayılan değer: `-`

[`cors`](https://www.npmjs.com/package/cors) modülüne iletilecek seçenekler listesi. Daha fazla bilgi `burada` bulunabilir.

Örnekler:

- Belirli bir kaynağa izin ver

```js
const io = new Server(httpServer, {
  cors: {
    origin: ["https://example.com"]
  }
});
```

- Yerel geliştirme için belirli bir kaynağa izin ver

```js
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"]
  }
});
```

- Belirtilen kaynaklara, başlıklara ve kimlik bilgilerine (çerezler, yetkilendirme başlıkları veya TLS istemci sertifikaları gibi) izin ver

```js
const io = new Server(httpServer, {
  cors: {
    origin: ["https://example.com", "https://dev.example.com"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
```

:::note
Tarayıcının çerezler, yetkilendirme başlıkları veya TLS istemci sertifikaları gibi kimlik bilgilerini göndermesi için, istemci tarafında `withCredentials` seçeneğini `true` olarak ayarlamanız gerekir:

```js
import { io } from "socket.io-client";

const socket = io("https://my-backend.com", {
  withCredentials: true
});
```

Daha fazla bilgi [burada](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials).
:::

- Herhangi bir kaynağa izin ver

```js
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});
```

:::warning
Bu durumda, aslında Cross-Origin Resource Sharing (CORS) sağlayan güvenliği devre dışı bıraktığınızdan lütfen dikkat edin, çünkü herhangi bir alan sunucunuza erişim sağlayabilir. Lütfen dikkatli kullanın.
:::

Mevcut seçenekler:

| Seçenek                | Açıklama                                                                                                                                                                                                                                                                                                        |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `origin`               | **Access-Control-Allow-Origin** CORS başlığını yapılandırır.                                                                                                                                                                                                                                                        |
| `methods`              | **Access-Control-Allow-Methods** CORS başlığını yapılandırır. Virgülle ayrılmış bir dize (örneğin: 'GET,PUT,POST') veya bir dizi (örneğin: `['GET', 'PUT', 'POST']`) bekler.                                                                                                                                                     |
| `allowedHeaders`       | **Access-Control-Allow-Headers** CORS başlığını yapılandırır. Virgülle ayrılmış bir dize (örneğin: 'Content-Type,Authorization') veya bir dizi (örneğin: `['Content-Type', 'Authorization']`) bekler. Belirtilmezse, varsayılan olarak isteğin **Access-Control-Request-Headers** başlığında belirtilen başlıkları yansıtır. |
| `exposedHeaders`       | **Access-Control-Expose-Headers** CORS başlığını yapılandırır. Virgülle ayrılmış bir dize (örneğin: 'Content-Range,X-Content-Range') veya bir dizi (örneğin: `['Content-Range', 'X-Content-Range']`) bekler. Belirtilmezse, özel başlıklar açığa çıkarılmaz.                                                                    |
| `credentials`          | **Access-Control-Allow-Credentials** CORS başlığını yapılandırır. Başlığı göndermek için `true` olarak ayarlayın, aksi takdirde atlanır.                                                                                                                                                                                        |
| `maxAge`               | **Access-Control-Max-Age** CORS başlığını yapılandırır. Başlığı göndermek için bir tam sayıya ayarlayın, aksi takdirde atlanır.                                                                                                                                                                                              |
| `preflightContinue`    | CORS ön uçtan önceki yanıtı bir sonraki işleyiciye iletin.                                                                                                                                                                                                                                                              |
| `optionsSuccessStatus` | Başarılı `OPTIONS` istekleri için kullanılacak bir durum kodu sağlar, çünkü bazı eski tarayıcılar (IE11, çeşitli SmartTV'ler) `204` durum kodunu kabul etmez.                                                                                                                                                                               |

`origin` seçeneği için olası değerler:

- `Boolean` - `origin` değerini `true` olarak ayarlayarak [istek kaynağını](http://tools.ietf.org/html/draft-abarth-origin-09) yansıtır, `req.header('Origin')` ile tanımlandığı şekilde veya `false` olarak ayarlayarak CORS'u devre dışı bırakır.
- `String` - `origin` değerini belirli bir kaynak olarak ayarlayın. Örneğin, `"http://example.com"` olarak ayarlarsanız yalnızca "http://example.com" kaynağından gelen istekler kabul edilir.
- `RegExp` - `origin` değerini istek kaynağını test etmek için kullanılacak bir düzenli ifade desenine ayarlayın. Eşleşiyorsa, istek kaynağı yansıtılacaktır. Örneğin `/example\.com$/` deseni, "example.com" ile biten bir kaynaktan gelen istekleri yansıtacaktır.
- `Array` - `origin` değerini geçerli kaynakların bir dizisine ayarlayın. Her kaynak bir `String` veya bir `RegExp` olabilir. Örneğin `["http://example1.com", /\.example2\.com$/]` herhangi bir istek kabul edecektir "http://example1.com" veya "example2.com" alt alanlarından.
- `Function` - `origin` değerini özel bir mantığı uygulayan bir fonksiyona ayarlayın. Fonksiyon, istek kaynağını birinci parametre olarak alır ve geri çağrıyı (beklenen imza `err [object], allow [bool]`) ikinci argüman olarak alır.

:::note
Seçenek `origin` olarak adlandırılmıştır (ve `origins` değil) birden fazla alan ile bile:
```js
const io = new Server(httpServer, {
  cors: {
    // KÖTÜ
    origins: ["https://example.com"],
    // İYİ
    origin: ["https://example.com"],
  }
});
```
:::

:::caution
`credentials: true` ayarlanırken `origin: "*"` kullanamazsınız:

```js
// BU ÇALIŞMAYACAK
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true
  }
});
```

Tarayıcı konsolunda aşağıdaki hata mesajını göreceksiniz:

> Çapraz Kaynak İsteği Engellendi: Aynı Kaynak İlkesi, ‘.../socket.io/?EIO=4&transport=polling&t=NvQfU77’ uzaktaki kaynağı okumayı engelliyor. (Sebep: Kimlik belgesi 'Access-Control-Allow-Origin' ' *' olarak ayarlanamaz.)

Ya bir dizi alan sağlamanız gerekecek (önerilen çözüm) ya da aşağıdaki yöntemi kullanacaksınız:

```js
const io = new Server(httpServer, {
  cors: {
    origin: (_req, callback) => {
      callback(null, true);
    },
    credentials: true
  }
});
```
Lütfen dikkat edin ki bu durumda, `origin: "*"` veya `origin: true` ile olduğu gibi, temelde Cross-Origin Resource Sharing (CORS) tarafından sağlanan güvenliği devre dışı bırakıyorsunuz, çünkü herhangi bir alan sunucunuza erişim sağlayabilir. Lütfen dikkatli kullanın.
:::

### `httpCompression`

*V1.4.0'da eklendi*

Varsayılan değer: `true`

HTTP uzun anket taşıması için sıkıştırmanın etkinleştirilip etkinleştirilmeyeceği.

:::note
Lütfen `httpCompression` `false` olarak ayarlandığında, bağlantı HTTP uzun anket talepleriyle kurulduğunda, yayınlandığında kullanılan sıkıştırma bayrağının (`socket.compress(true).emit(...)`) görmezden gelineceğini unutmayın.
:::

Node.js [`zlib` modülünden](https://nodejs.org/api/zlib.html#zlib_class_options) tüm seçenekler desteklenmektedir.

Örnek:

```js
const io = new Server(httpServer, {
  httpCompression: {
    // Engine.IO seçenekleri
    threshold: 2048, // varsayılan olarak 1024
    // Node.js zlib seçenekleri
    chunkSize: 8 * 1024, // varsayılan olarak 16 * 1024
    windowBits: 14, // varsayılan olarak 15
    memLevel: 7, // varsayılan olarak 8
  }
});
```

### `maxHttpBufferSize`

Varsayılan değer: `1e6` (1 MB)

Bir mesajın, soketi kapatmadan önce kaç bayt olabileceğini tanımlar. İhtiyaçlarınıza bağlı olarak bu değeri artırabilir veya azaltabilirsiniz.

```js
const io = new Server(httpServer, {
  maxHttpBufferSize: 1e8
});
```

ws paketinin [maxPayload](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback) seçeneği ile eşleşmektedir.

### `perMessageDeflate`


    Tarihçe

| Versiyon | Değişiklikler                                                 |
|----------|--------------------------------------------------------------|
| v3.0.0   | permessage-deflate uzantısı artık varsayılan olarak devre dışı. |
| v1.4.0   | İlk uygulama.                                              |



Varsayılan değer: `false`

WebSocket taşıması için [permessage-deflate uzantasının](https://tools.ietf.org/html/draft-ietf-hybi-permessage-compression-19) etkinleştirilip etkinleştirilmeyeceği. Bu uzantı, performans ve bellek tüketiminde önemli bir yük eklediği için, gerçekten gerekli olmadıkça etkinleştirilmesi önerilmez.

Lütfen `perMessageDeflate` `false` olarak ayarlandığında (varsayılan olarak), yayınlandığında kullanılan sıkıştırma bayrağının (`socket.compress(true).emit(...)`) WebSocket'ler ile bağlantı kurulduğunda görmezden gelineceğini unutmayın, çünkü permessage-deflate uzantısı bir mesaj bazında etkinleştirilemez.

[`ws` modülünden](https://github.com/websockets/ws/blob/master/README.md#websocket-compression) tüm seçenekler desteklenmektedir:

```js
const io = new Server(httpServer, {
  perMessageDeflate: {
    threshold: 2048, // varsayılan olarak 1024

    zlibDeflateOptions: {
      chunkSize: 8 * 1024, // varsayılan olarak 16 * 1024
    },

    zlibInflateOptions: {
      windowBits: 14, // varsayılan olarak 15
      memLevel: 7, // varsayılan olarak 8
    },

    clientNoContextTakeover: true, // varsayılan olarak müzakere edilmiş değer.
    serverNoContextTakeover: true, // varsayılan olarak müzakere edilmiş değer.
    serverMaxWindowBits: 10, // varsayılan olarak müzakere edilmiş değer.

    concurrencyLimit: 20, // varsayılan olarak 10
  }
});
```

### `pingInterval`

Varsayılan değer: `25000`

Bu değer, sunucu ile istemci arasındaki bağlantının hala canlı olup olmadığını periyodik olarak kontrol eden kalp atışı mekanizmasında kullanılır.

Sunucu, her `pingInterval` ms'de bir ping paketi gönderir ve istemci `pingTimeout` ms içinde bir pong ile yanıt vermezse, sunucu bağlantının kapandığını düşünür.

Benzer şekilde, istemci sunucudan `pingInterval + pingTimeout` ms içinde bir ping paketi alamazsa, istemci de bağlantının kapandığını düşünür.

Her iki durumda da, bağlantı kesilme nedeni: `ping timeout`

```js
socket.on("disconnect", (reason) => {
  console.log(reason); // "ping timeout"
});
```

:::caution
`1000` gibi küçük bir değer kullanmak (saniyede bir kalp atışı), sunucunuzda yük oluşturur ve birkaç bin bağlı istemci ile fark edilir hale gelebilir.
:::

### `pingTimeout`


    Tarihçe

| Versiyon | Değişiklikler                                  |
|----------|------------------------------------------------|
| v4.0.0   | `pingTimeout` artık varsayılan olarak `20000` ms. |
| v2.1.0   | Varsayılan olarak `5000` ms.                   |
| v1.0.0   | Varsayılan olarak `60000` ms.                  |



Varsayılan değer: `20000`

`üstte` bakın.

:::caution
Küçük bir değer kullanmak, geçici olarak yanıt vermeyen bir sunucunun istemci bağlantı kopmalarını tetiklemesi anlamına gelebilir.

Tersine, büyük bir değer kullanmak, hatalı bir bağlantının daha uzun sürede tespit edilmesi anlamına gelir (ve `pingInterval + pingTimeout` 60 saniyeden büyükse React Native'de uyarı alabilirsiniz).
:::

### `transports`

Varsayılan değer: `["polling", "websocket"]`

Sunucu tarafında izin verilen düşük seviyeli taşıma yöntemleri.

:::note
WebTransport etkinleştirildiğinde örnek:
:::

```js
const io = new Server({
  transports: ["polling", "websocket", "webtransport"]
});
```

WebTransport örneğine [buradan](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) göz atın.

Ayrıca istemci tarafındaki `transports` bakın.

### `upgradeTimeout`

Varsayılan değer: `10000`

Tamamlanmamış bir taşıma yükseltmesinin iptal edilmeden önce bekleyeceği gecikme süresi (milisaniye cinsinden).