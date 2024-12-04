---
title: Sunucu APIsi
seoTitle: Socket.io Sunucu APIsi
sidebar_position: 1
description: Sunucu APIsine genel bir bakış ve temel kullanım kılavuzu. Socket.io ile bağlantı kurma ve olaylar ile işlemleri nasıl yönetileceğine dair bilgiler.
tags: 
  - Sunucu
  - Socket.io
  - API
  - Node.js
keywords: 
  - Sunucu
  - Socket.io
  - API
  - Node.js
---

## Sunucu

![](../images/frameworks/socket.io/static/images/server-class-diagram-server.png)

İlgili belgelere sayfalar:

- `kurulum`
- `başlatma`
- `sunucu örneği detayları`

### Yapıcı

#### new Server(httpServer[, options])

- `httpServer` [``](https://nodejs.org/api/http.html#class-httpserver) | [``](https://nodejs.org/api/https.html#class-httpsserver)
- `options` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```js
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  // options
});

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

Mevcut seçeneklerin tam listesi `burada` bulunabilir.

#### new Server(port[, options])

- `port` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type)
- `options` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```js
import { Server } from "socket.io";

const io = new Server(3000, {
  // options
});

io.on("connection", (socket) => {
  // ...
});
```

Mevcut seçeneklerin tam listesi `burada` bulunabilir.

#### new Server(options)

- `options` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```js
import { Server } from "socket.io";

const io = new Server({
  // options
});

io.on("connection", (socket) => {
  // ...
});

io.listen(3000);
```

Mevcut seçeneklerin tam listesi `burada` bulunabilir.

### Olaylar

#### Olay: 'connect'

`Olay: "connection"` ile eş anlamlıdır.

#### Olay: 'connection'

- `socket` _(Socket)_ istemci ile soket bağlantısı

İstemciden bir bağlantı geldiğinde tetiklenir.

```js
io.on("connection", (socket) => {
  // ...
});
```

#### Olay: 'new_namespace'

- `namespace` `Namespace`

Yeni bir ad alanı oluşturulduğunda tetiklenir:

```js
io.on("new_namespace", (namespace) => {
  // ...
});
```

Bu, örneğin aşağıdaki gibi kullanışlı olabilir:

- Her ad alanına ortak bir middleware eklemek için

```js
io.on("new_namespace", (namespace) => {
  namespace.use(myMiddleware);
});
```

- `dinamik olarak oluşturulan` ad alanlarını izlemek için

```js
io.of(/\/nsp-\w+/);

io.on("new_namespace", (namespace) => {
  console.log(namespace.name);
});
```

### Nitelikler

#### server.engine

Altındaki Engine.IO sunucusuna bir referans. `burada` bakabilirsiniz.

#### server.sockets

* ``

Ana ad alanı (`/`) için bir takma ad.

```js
io.sockets.emit("hi", "everyone");
// eşdeğer olarak
io.of("/").emit("hi", "everyone");
```

### Yöntemler

#### server.adapter([value])

- `value` ``
- **Returns** `` | ``

`value` adapterini ayarlar. Varsayılan olarak, socket.io ile birlikte gelen bellek tabanlı bir `Adapter` örneğidir. Hiçbir argüman sağlanmazsa, bu yöntem mevcut değeri döndürür.

```js
import { Server } from "socket.io"; 
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const io = new Server();

const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

// redis@3
io.listen(3000);

// redis@4
Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.listen(3000);
});
```

#### server.attach(httpServer[, options])

- `httpServer` [``](https://nodejs.org/api/http.html#class-httpserver) | [``](https://nodejs.org/api/https.html#class-httpsserver)
- `options` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`Server`i sağlanan `httpServer` ile bağlar.

```js
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server();

io.attach(httpServer);

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

#### server.attach(port[, options])

- `port` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type)
- `options` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`Server`ı verilen `port` ile sağlanan `options` ile bağlar.

```js
import { Server } from "socket.io";

const io = new Server();

io.attach(3000);

io.on("connection", (socket) => {
  // ...
});
```

#### server.attachApp(app[, options])

- `app` [``](https://unetworking.github.io/uWebSockets.js/generated/interfaces/TemplatedApp.html)
- `options` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Socket.IO sunucusunu bir [µWebSockets.js](https://github.com/uNetworking/uWebSockets.js) uygulamasına bağlar:

```js
import { App } from "uWebSockets.js";
import { Server } from "socket.io";

const app = App();
const io = new Server();

io.attachApp(app);

io.on("connection", (socket) => {
  // ...
});

app.listen(3000, (token) => {
  if (!token) {
    console.warn("port already in use");
  }
});
```

#### server.bind(engine)

- `engine` ``
- **Returns** ``

Sadece ileri düzey kullanım için. Sunucuyu belirli bir engine.io `Server` (veya uyumlu API) örneğine bağlar.

```js
import { createServer } from "node:http";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";

const httpServer = createServer((req, res) => {
  res.writeHead(404).end();
});

const engine = new Engine();

engine.attach(httpServer, {
  path: "/socket.io/"
});

const io = new Server();

io.bind(engine);

httpServer.listen(3000);
```

#### server.close([callback])

- `callback` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Socket.IO sunucusunu kapatır ve tüm istemcileri koparır. `callback` argümanı isteğe bağlıdır ve tüm bağlantılar kapatıldığında çağrılır.

:::info
Bu, alttaki HTTP sunucusunu da kapatır.
:::

```js
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3030;
const io = new Server(PORT);

io.close();

const httpServer = createServer();

httpServer.listen(PORT); // PORT kullanımda serbest

io.attach(httpServer);
```

:::note
Sadece altta yatan HTTP sunucusunu kapatmak yeterli değildir, çünkü bu yalnızca yeni bağlantıları kabul etmesini engeller ama WebSocket ile bağlı olan istemciler hemen koparılmaz.
Referans: https://nodejs.org/api/http.html#serverclosecallback
:::

#### server.disconnectSockets([close])

*V4.0.0'da eklendi*

`io.of("/").disconnectSockets(close)` için takma ad.

```js
// tüm Socket örneklerini kopar
io.disconnectSockets();

// "room1" odasındaki tüm Socket örneklerini kopar (ve düşük seviyedeki bağlantıyı kapat)
io.in("room1").disconnectSockets(true);
```

:::tip
Bu yöntem ayrıca birden fazla Socket.IO sunucusunun bulunduğu bir kümede de çalışır, uyumlu bir adaptör ile `Postgres adaptörü` gibi.
Bu durumda, yalnızca belirli bir düğümdeki soket örnelerini etkilemek istiyorsanız, `local` bayrağını kullanmanız gerekir:
```js
// şu anda belirtilen düğümde bağlı olan tüm Socket örneklerini kopar
io.local.disconnectSockets();
```
:::

`burada` bakınız.

#### server.emit(eventName[, ...args])


    Geçmiş

| Version | Değişiklikler                                  |
|---------|------------------------------------------------|
| v4.5.0  | `io.emit()` artık onayları destekliyor.       |
| v1.0.0  | İlk uygulama.                                  |



- `eventName` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#string_type) | [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#symbol_type)
- `args` `any[]`
- **Returns** `true`

Ana ad alanındaki tüm bağlı istemcilere bir olay yayar.

```js
io.emit("hello");
```

Herhangi bir sayıda parametre eklenebilir ve tüm serileştirilebilir veri yapıları desteklenir:

```js
io.emit("hello", 1, "2", { "3": 4 }, Buffer.from([5]));
```

Ve alıcı tarafında:

```js
socket.on("hello", (arg1, arg2, arg3, arg4) => {
  console.log(arg1); // 1
  console.log(arg2); // "2"
  console.log(arg3); // { "3": 4 }
  console.log(arg4); // ArrayBuffer veya Buffer, platforma bağlı olarak
});
```

:::info
Argümanlar otomatik olarak serileştirilecektir, bu nedenle `JSON.stringify()` çağırmak gerekmez.
:::

Belirli istemcilere paket göndermek için `to()` ve `except()` kullanabilirsiniz:

```js
// “hello” olayı "room1" odasında veya "room2" odasında olan tüm bağlı istemcilere yayınlanacak, "room3" odasındakiler hariç
io.to("room1").to("room2").except("room3").emit("hello");
```

V4.5.0 sürümünden itibaren, yayında onaylar kullanmak artık mümkündür:

```js
io.timeout(10000).emit("some-event", (err, responses) => {
  if (err) {
    // bazı istemciler belirlenen gecikme içinde olayı onaylamadı
  } else {
    console.log(responses); // her istemci için bir yanıt
  }
});
```

:::caution
Bu durumda `timeout()` çağırmak zorunludur.
:::

#### server.emitWithAck(eventName[, ...args])

*V4.6.0'da eklendi*

- `eventName` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#string_type) | [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#symbol_type)
- `args` `any[]`
- **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Tüm hedeflenen istemcilerden bir onay beklemeyi içeren, yayının promised tabanlı bir versiyonu:

```js
try {
  const responses = await io.timeout(10000).emitWithAck("some-event");
  console.log(responses); // her istemci için bir yanıt
} catch (e) {
  // bazı istemciler belirlenen gecikme içinde olayı onaylamadı
}
```

Yukarıdaki örnek şuna eşdeğerdir:

```js
io.timeout(10000).emit("some-event", (err, responses) => {
  if (err) {
    // bazı istemciler belirlenen gecikme içinde olayı onaylamadı
  } else {
    console.log(responses); // her istemci için bir yanıt
  }
});
```

Ve alıcı tarafında:

```js
socket.on("some-event", (callback) => {
  callback("got it"); // yalnızca bir argüman bekleniyor
});
```

#### server.except(rooms)

*V4.0.0'da eklendi*

- `rooms` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#string_type) | [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#string_type)
- **Returns** `BroadcastOperator`

Yayın yaparken, verilen `rooms`'ta bulunmayan istemcilere yalnızca _yayın yapacak_ şekilde bir değiştirme ayarlayarak yayımlar.

```js
// "foo" olayı, "room-101" odasındaki istemciler hariç tüm bağlı istemcilere yayılacaktır
io.except("room-101").emit("foo", "bar");

// odalar dizisi ile
io.except(["room-101", "room-102"]).emit("foo", "bar");

// çoklu zincirleme çağrılar ile
io.except("room-101").except("room-102").emit("foo", "bar");
```

#### server.fetchSockets()

*V4.0.0'da eklendi*

`io.of("/").fetchSocket()` için takma ad.

```js
// ana ad alanındaki tüm Socket örneklerini döndür
const sockets = await io.fetchSockets();

// ana ad alanındaki "room1" odasındaki tüm Socket örneklerini döndür
const sockets = await io.in("room1").fetchSockets();
```

Örnek kullanım:

```js
io.on("connection", (socket) => {
  const userId = computeUserId(socket);

  socket.join(userId);

  socket.on("disconnect", async () => {
    const sockets = await io.in(userId).fetchSockets();
    if (sockets.length === 0) {
      // verilen kullanıcı için daha fazla aktif bağlantı yok
    }
  });
});
```

:::tip
Bu yöntem ayrıca birden fazla Socket.IO sunucusunun bulunduğu bir kümede de çalışır, uyumlu bir adaptör ile `Postgres adaptörü` gibi.
Bu durumda, yalnızca belirtilen düğümdeki soket örneklerini döndürmek istiyorsanız, `local` bayrağını kullanmanız gerekir:
```js
// şu anda belirtilen düğümde bağlı olan tüm Socket örneklerini döndür
const sockets = await io.local.fetchSockets();
```
:::

`burada` bakınız.

#### server.in(room)

*V1.0.0'da eklendi*

`server.to(room)` ile eş anlamlıdır, ancak bazı durumlarda daha kabul edilebilir görünebilir:

```js
// "room-101" odasındaki tüm istemcileri kopar
io.in("room-101").disconnectSockets();
```

#### server.listen(httpServer[, options])

[server.attach(httpServer[, options])](#serverattachhttpserver-options) ile eş anlamlıdır.

#### server.listen(port[, options])

[server.attach(port[, options])](#serverattachport-options) ile eş anlamlıdır.

#### server.of(nsp)

- `nsp` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#string_type) | [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- **Returns** ``

Belirtilen `Namespace`'i yol adı tanımlayıcısı `nsp` ile başlatır ve alır. Ad alanı zaten başlatılmışsa hemen döndürür.

```js
const adminNamespace = io.of("/admin");
```

Bir regex veya bir işlev sağlayarak, dinamik bir şekilde ad alanı oluşturabilirsiniz:

```js
const dynamicNsp = io.of(/^\/dynamic-\d+$/).on("connection", (socket) => {
  const newNamespace = socket.nsp; // newNamespace.name === "/dynamic-101"

  // belirli bir alt ad alanındaki tüm istemcilere yay
  newNamespace.emit("hello");
});

// istemci tarafında
const socket = io("/dynamic-101");

// her alt ad alanındaki tüm istemcilere yay
dynamicNsp.emit("hello");

// her alt ad alanı için bir middleware kullan
dynamicNsp.use((socket, next) => { /* ... */ });
```

Bir işlev ile:

```js
io.of((name, query, next) => {
  // checkToken yöntemi bir boolean döndürmelidir, istemcinin bağlanıp bağlanamayacağına dair.
  next(null, checkToken(query.token));
}).on("connection", (socket) => { /* ... */ });
```

#### server.on(eventName, listener)

*[EventEmitter sınıfından türemiştir.](https://nodejs.org/api/events.html#class-eventemitter)*

- `eventName` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#string_type) | [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#symbol_type)
- `listener` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- **Returns** ``

Belirtilen `eventName` adlı etkinlik için dinleyici işlevini dinleyiciler dizisinin sonuna ekler.

Mevcut olaylar:

- `connection`
- `new_namespace`
- `serverSideEmit` yönteminden herhangi bir özel olay

```js
io.on("connection", (socket) => {
  // ...
});
```

#### server.onconnection(socket)

- `socket` ``
- **Returns** ``

Sadece ileri düzey kullanım için. Gelen engine.io (veya uyumlu API) `Socket`'ten yeni bir `socket.io` istemcisi oluşturur.

```js
import { Server } from "socket.io";
import { Server as Engine } from "engine.io";

const engine = new Engine();
const io = new Server();

engine.on("connection", (socket) => {
  io.onconnection(socket);
});

engine.listen(3000);
```

#### server.path([value])

- `value` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#string_type)
- **Returns** `` | [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#string_type)

`engine.io` ve statik dosyaların sunulacağı `value` yolunu ayarlar. Varsayılan olarak `/socket.io/` şeklindedir. Hiçbir argüman sağlanmazsa, bu yöntem mevcut değeri döndürür.

```js
import { Server } from "socket.io";

const io = new Server();

io.path("/myownpath/");
```

:::warning
`path` değeri istemci tarafında kiyle eşleşmelidir:

```js
import { io } from "socket.io-client";

const socket = io({
  path: "/myownpath/"
});
```
:::

#### server.serveClient([value])

- `value` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#boolean_type)
- **Returns** `` | [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#boolean_type)

`value` `true` olduğunda, ekli sunucu istemci dosyalarını sunacaktır. Varsayılan olarak `true`'dur. Bu yöntem `listen` çağrıldıktan sonra etkili olmaz. Hiçbir argüman sağlanmazsa, bu yöntem mevcut değeri döndürür.

```js
import { Server } from "socket.io";

const io = new Server();

io.serveClient(false);

io.listen(3000);
```

#### server.serverSideEmit(eventName[, ...args][, ack])

*V4.1.0'da eklendi*

Alias for: `io.of("/").serverSideEmit(/* ... */);`

- `eventName` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#string_type)
- `args` ``
- `ack` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- **Returns** `true`

Küme içindeki diğer Socket.IO sunucularına bir mesaj gönderir.

Sözdizimi:

```js
io.serverSideEmit("hello", "world");
```

Ve alıcı tarafında:

```js
io.on("hello", (arg1) => {
  console.log(arg1); // "world" yazdırır
});
```

Onaylar da desteklenir:

```js
// sunucu A
io.serverSideEmit("ping", (err, responses) => {
  console.log(responses[0]); // "pong" yazdırır
});

// sunucu B
io.on("ping", (cb) => {
  cb("pong");
});
```

Notlar:

- `connection`, `connect` ve `new_namespace` dizeleri ayrılmıştır ve uygulamanızda kullanılamaz.

- Herhangi bir sayıda argüman gönderebilirsiniz, ancak ikili yapılar şu anda desteklenmez (argümanların dizisi `JSON.stringify`-edilecektir).

Örnek:

```js
io.serverSideEmit("hello", "world", 1, "2", { 3: "4" });
```

- Onay geri çağrısı, diğer Socket.IO sunucuları belirtilen gecikme içinde yanıt vermezse bir hata ile çağrılabilir.

```js
io.serverSideEmit("ping", (err, responses) => {
  if (err) {
    // en az bir Socket.IO sunucusu yanıt vermedi
    // 'responses' dizisi zaten alınan tüm yanıtları içerir
  } else {
    // başarı! 'responses' dizisi, kümedeki diğer her Socket.IO sunucusu için bir nesne içerir
  }
});