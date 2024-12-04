---
title: Soket Örneği (sunucu tarafı)
seoTitle: Sunucu Tarafı Soket Örneği
sidebar_position: 4
description: Bu belge, Socket.IO sunucu tarafı için temel özellikleri ve kullanımı hakkında bilgi sağlar. Özellikle bağlantılar, el sıkışma süreçleri ve olay yönetimi ele alınacaktır.
tags: 
  - sunucu
  - socket.io
  - istemci
  - el sıkışma
  - olay yönetimi
keywords: 
  - Socket.IO
  - sunucu
  - istemci
  - socket
  - el sıkışma
  - olay yönetimi
---

Bir `Socket`, istemci ile etkileşim kurmak için temel sınıftır. Node.js [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter) sınıfının tüm metodlarını miras alır; `emit`, `on`, `once` veya `removeListener`.

![](../../../images/frameworks/socket.io/static/images/bidirectional-communication-socket.png)
![](../../../images/frameworks/socket.io/static/images/bidirectional-communication-socket-dark.png)




Bunun yanı sıra:

- `etkinlik yayma` ve `dinleme` 
- `etkinlikleri yayınlama`
- `odalara katılma ve ayrılma`

Soket örneği, uygulamanızda faydalı olabilecek birkaç özellik içerir:

## Socket#id

Her yeni bağlantıya rastgele 20 karakterden oluşan bir tanımlayıcı atanır.

Bu tanımlayıcı, istemci tarafındaki değerle senkronize edilir.

```js
// sunucu tarafı
io.on("connection", (socket) => {
  console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
});

// istemci tarafı
socket.on("connect", () => {
  console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
});
```

:::caution
Lütfen, `bağlantı durumu kurtarma` etkinleştirilmedikçe, `id` özelliğinin uygulamanızda kullanılmak üzere tasarlanmış **geçici** bir ID olduğunu unutmayın (veya yalnızca hata ayıklama amaçları için) çünkü:

- bu ID her yeniden bağlantıda yeniden üretilir (örneğin WebSocket bağlantısı kesildiğinde veya kullanıcı sayfayı yenilediğinde)
- iki farklı tarayıcı sekmesi iki farklı ID'ye sahip olacaktır
- sunucuda belirli bir ID için saklanan hiç mesaj kuyruğu yoktur (yani istemci bağlantısı kesildiğinde, bu ID'ye gönderilen sunucu mesajları kaybolur)

Lütfen bunun yerine düzenli bir oturum ID'si kullanın (ya bir çerezde gönderin ya da localStorage'a kaydedin ve `auth` yüklemesinde gönderin).

Ayrıca bkz:

- `Özel mesaj kılavuzumuzun II. Bölümü`
- `Çerezlerle nasıl başa çıkılır`
:::

:::note
Not: Bu tanımlayıcıyı geçersiz kılamazsınız, çünkü Socket.IO kod tabanının çeşitli parçalarında kullanılmaktadır.
:::

## Socket#handshake

Bu nesne, Socket.IO oturumunun başlangıcında gerçekleşen el sıkışma hakkında bazı detaylar içerir.

```
{
  headers: /* ilk isteğin başlıkları */
  query: /* ilk isteğin sorgu parametreleri */
  auth: /* kimlik doğrulama yüklemesi */
  time: /* oluşturulma tarihini (string olarak) */
  issued: /* oluşturulma tarihi (unix zaman damgası) */
  url: /* isteğin URL stringi */
  address: /* istemcinin ip adresi */
  xdomain: /* bağlantının çapraz alan olup olmadığı */
  secure: /* bağlantının güvenli olup olmadığı */
}
```

Örnek:

```json
{
  "headers": {
    "user-agent": "xxxx",
    "accept": "*/*",
    "host": "example.com",
    "connection": "close"
  },
  "query": {
    "EIO": "4",
    "transport": "polling",
    "t": "NNjNltH"
  },
  "auth": {
    "token": "123"
  },
  "time": "Sun Nov 22 2020 01:33:46 GMT+0100 (Central European Standard Time)",
  "issued": 1606005226969,
  "url": "/socket.io/?EIO=4&transport=polling&t=NNjNltH",
  "address": "::ffff:1.2.3.4",
  "xdomain": false,
  "secure": true
}
```

## Socket#rooms

Bu, Soket'in şu anda bulunduğu `odalara` bir referanstır.

```js
io.on("connection", (socket) => {
  console.log(socket.rooms); // Set { <socket.id> }
  socket.join("room1");
  console.log(socket.rooms); // Set { <socket.id>, "room1" }
});
```

## Socket#data

`fetchSockets()` yardımcı yöntemi ile birlikte kullanılabilecek rastgele bir nesne:

```js
// sunucu A
io.on("connection", (socket) => {
  socket.data.username = "alice";
});

// sunucu B
const sockets = await io.fetchSockets();
console.log(sockets[0].data.username); // "alice"
```

Daha fazla bilgi `burada`.

## Socket#conn

Altta yatan Engine.IO soketinin bir referansı (bkz `burada`).

```js
io.on("connection", (socket) => {
  console.log("ilk taşımacılık", socket.conn.transport.name); // "polling"i yazdırır

  socket.conn.once("upgrade", () => {
    // taşımacılığın yükseltildiğinde çağrılır (yani HTTP uzun anketten WebSocket'e)
    console.log("yükseltilmiş taşımacılık", socket.conn.transport.name); // "websocket"i yazdırır
  });

  socket.conn.on("packet", ({ type, data }) => {
    // her alınan paket için çağrılır
  });

  socket.conn.on("packetCreate", ({ type, data }) => {
    // her gönderilen paket için çağrılır
  });

  socket.conn.on("drain", () => {
    // yazma tamponu boşaldığında çağrılır
  });

  socket.conn.on("close", (reason) => {
    // altta yatan bağlantı kapandığında çağrılır
  });
});
```

## Ek özellikler

Mevcut herhangi bir özelliği geçersiz kılmadığınız sürece, Soket örneğine herhangi bir özellik ekleyebilir ve daha sonra kullanabilirsiniz:

```js
// bir ara yazılımda
io.use(async (socket, next) => {
  try {
    const user = await fetchUser(socket);
    socket.user = user;
  } catch (e) {
    next(new Error("bilinmeyen kullanıcı"));
  }
});

io.on("connection", (socket) => {
  console.log(socket.user);

  // bir dinleyicide
  socket.on("set username", (username) => {
    socket.username = username;
  });
});
```

## Socket ara yazılımları

Bu ara yazılımlar, her gelen paket için çağrılan sıradan `ara yazılımlar` gibidir:

```js
socket.use(([event, ...args], next) => {
  // paketi işleme (günlükleme, yetkilendirme, oran sınırlama...)
  // sonunda next() çağrmayı unutmayın
  next();
});
```

`next` metodu, bir hata nesnesi ile de çağrılabilir. Bu durumda, olay kayıtlı olay yöneticilerine ulaşmayacak ve bunun yerine bir `error` olayı yayımlanacaktır:

```js
io.on("connection", (socket) => {
  socket.use(([event, ...args], next) => {
    if (isUnauthorized(event)) {
      return next(new Error("yetkisiz olay"));
    }
    next();
  });

  socket.on("error", (err) => {
    if (err && err.message === "yetkisiz olay") {
      socket.disconnect();
    }
  });
});
```

:::warning
Not: Bu özellik yalnızca sunucu tarafında bulunmaktadır. İstemci tarafı için, `tüm dinleyiciler` ile ilgilenebilirsiniz.
:::

## Etkinlikler

Sunucu tarafında, Soket örneği iki özel olayı yayımlar:

- `disconnect`
- `disconnecting`

### `disconnect`

Bu olay, Soket örneği bağlantı kesildiğinde tetiklenir.

```js
io.on("connection", (socket) => {
  socket.on("disconnect", (reason) => {
    // ...
  });
});
```

Olası nedenlerin listesi:

| Neden                        | Açıklama                                                                                                                                  |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| `server namespace disconnect` | Soket, `socket.disconnect()` ile zorla kesildi.                                                        |
| `client namespace disconnect` | İstemci, `socket.disconnect()` ile soketi manuel olarak kesmiştir.                                         |
| `server shutting down`        | Sunucu, iyi, kapanıyor.                                                                                                                  |
| `ping timeout`                | İstemci, `pingTimeout` gecikmesinde bir PONG paketi göndermedi.                                                                           |
| `transport close`             | Bağlantı kapatıldı (örneğin kullanıcı bağlantıyı kaybetti veya ağ WiFi'den 4G'ye değişti).                                               |
| `transport error`             | Bağlantı bir hata ile karşılaştı.                                                                                                        |
| `parse error`                 | Sunucu, istemciden geçersiz bir paket aldı.                                                                                               |
| `forced close`                | Sunucu, istemciden geçersiz bir paket aldı.                                                                                               |
| `forced server close`         | İstemci, zamanında bir isim alanına katılmadı (bkz `connectTimeout` seçeneği) ve zorla kapatıldı. |

### `disconnecting`

Bu olay, `disconnect` ile benzer ancak biraz daha erken tetiklenir; `Socket#rooms` seti henüz boş değilken tetiklenir.

```js
io.on("connection", (socket) => {
  socket.on("disconnecting", (reason) => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("kullanıcı ayrıldı", socket.id);
      }
    }
  });
});
```

:::danger
Not: Bu olaylar, `connect`, `connect_error`, `newListener` ve `removeListener` ile birlikte, uygulamanızda kullanılmaması gereken özel olaylardır:

```js
// KÖTÜ, bir hata verecek
socket.emit("disconnect");
```
:::

## Tam API

Soket örneğinin sunduğu tam API `burada` bulunmaktadır.