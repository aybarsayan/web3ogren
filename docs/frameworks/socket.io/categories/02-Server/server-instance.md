---
title: Sunucu Örneği
seoTitle: Socket.IO Sunucu Örneği
sidebar_position: 3
description: Sunucu örneği, uygulamanızda faydalı olabilecek birkaç özelliğe sahiptir. Bu sayfada, sunucu APIsini ve yardımcı yöntemleri keşfedeceksiniz.
tags: 
  - Socket.IO
  - sunucu
  - örnek
  - Engine.IO
keywords: 
  - Socket.IO
  - sunucu
  - Engine.IO
  - v4.1.0
  - yöntemler
---
Sunucu örneği (kod örneklerinde genellikle `io` olarak adlandırılır) uygulamanızda faydalı olabilecek birkaç özelliğe sahiptir.

Ayrıca, `namespace.use()` (bkz. `burada`) veya `namespace.allSockets()` gibi `ana ad alanı` metodlarının tümünü miras alır.

## Server#engine

Temel Engine.IO sunucusuna bir referans.

Bu, mevcut bağlı istemci sayısını almak için kullanılabilir:

```js
const count = io.engine.clientsCount;
// kullanımınıza bağlı olarak, ana ad alanındaki Socket örneklerinin sayısıyla benzer olabilir veya olmayabilir
const count2 = io.of("/").sockets.size;
```

Veya özel bir oturum ID'si (adı `sid` sorgu parametresi) oluşturmak için:

```js
const uuid = require("uuid");

io.engine.generateId = (req) => {
  return uuid.v4(); // tüm Socket.IO sunucuları arasında benzersiz olmalıdır
}
```

:::info
`socket.io@4.1.0` itibarıyla, Engine.IO sunucusu üç özel olay yayımlamaktadır:
:::

- `initial_headers`: oturumun ilk HTTP talebinin yanıt başlıkları yazılmadan hemen önce yayımlanır (el sıkışma), bunları özelleştirmenize olanak tanır.

```js
io.engine.on("initial_headers", (headers, req) => {
  headers["test"] = "123";
  headers["set-cookie"] = "mycookie=456";
});
```

- `headers`: oturumun her HTTP talebinin yanıt başlıkları yazılmadan hemen önce yayımlanır (WebSocket yükseltmesi dahil), bunları özelleştirmenize olanak tanır.

```js
io.engine.on("headers", (headers, req) => {
  headers["test"] = "789";
});
```

- `connection_error`: bağlantı anormal şekilde kapandığında yayımlanır.

```js
io.engine.on("connection_error", (err) => {
  console.log(err.req);	     // istek nesnesi
  console.log(err.code);     // hata kodu, örneğin 1
  console.log(err.message);  // hata mesajı, örneğin "Oturum ID'si bilinmiyor"
  console.log(err.context);  // bazı ek hata bağlamı
});
```

:::tip
Olası hata kodlarının listesi:
:::

| Kod |            Mesaj             |
|:----:|:------------------------------:|
|  0   |      "Taşıyıcı bilinmiyor"      |
|  1   |      "Oturum ID'si bilinmiyor"      |
|  2   |     "Kötü el sıkışma yöntemi"     |
|  3   |         "Kötü istek"          |
|  4   |          "Yasak"           |
|  5   | "Desteklenmeyen protokol sürümü" |

## Yardımcı yöntemler

Socket.IO v4.0.0'da Socket örneklerini ve odalarını yönetmek için bazı yardımcı yöntemler eklendi:

- `socketsJoin`: eşleşen socket örneklerinin belirtilen odalara katılmasını sağlar
- `socketsLeave`: eşleşen socket örneklerinin belirtilen odalardan ayrılmasını sağlar
- `disconnectSockets`: eşleşen socket örneklerinin bağlantısını keser
- `fetchSockets`: eşleşen socket örneklerini döndürür

`serverSideEmit` yöntemi Socket.IO v4.1.0'da eklendi.

Bu yöntemler yayınlama ile aynı anlamlara sahiptir ve aynı filtreler geçerlidir:

```js
io.of("/admin").in("room1").except("room2").local.disconnectSockets();
```

Bu, "admin" ad alanındaki tüm Socket örneklerinin

- "room1" odasında (`in("room1")` veya `to("room1")`)
- "room2"dekiler hariç (`except("room2")`)
- ve yalnızca mevcut Socket.IO sunucusunda (`local`)

bağlantısını kesmesini sağlar.

Ayrıca Redis adaptörü ile de uyumludur (başlangıç olarak `socket.io-redis@6.1.0`), yani Socket.IO sunucuları arasında çalışacaktır.

### `socketsJoin`

Bu yöntem, eşleşen Socket örneklerini belirtilen odalara katılmaya zorlar:

```js
// tüm Socket örneklerini "room1" odasına katılmaya zorla
io.socketsJoin("room1");

// "room1" odasındaki tüm Socket örneklerini "room2" ve "room3" odalarına katılmaya zorla
io.in("room1").socketsJoin(["room2", "room3"]);

// "admin" ad alanındaki "room1" odasındaki tüm Socket örneklerini "room2" odasına katılmaya zorla
io.of("/admin").in("room1").socketsJoin("room2");

// bu aynı zamanda tek bir socket ID'si ile de çalışır
io.in(theSocketId).socketsJoin("room1");
```

### `socketsLeave`

Bu yöntem, eşleşen Socket örneklerini belirtilen odalardan ayrılmaya zorlar:

```js
// tüm Socket örneklerini "room1" odasından ayrılmaya zorla
io.socketsLeave("room1");

// "room1" odasındaki tüm Socket örneklerini "room2" ve "room3" odalarından ayrılmaya zorla
io.in("room1").socketsLeave(["room2", "room3"]);

// "admin" ad alanındaki "room1" odasındaki tüm Socket örneklerini "room2" odasından ayrılmaya zorla
io.of("/admin").in("room1").socketsLeave("room2");

// bu aynı zamanda tek bir socket ID'si ile de çalışır
io.in(theSocketId).socketsLeave("room1");
```

### `disconnectSockets`

Bu yöntem, eşleşen Socket örneklerini bağlantı kesmeye zorlar:

```js
// tüm Socket örneklerinin bağlantısını kes
io.disconnectSockets();

// "room1" odasındaki tüm Socket örneklerinin bağlantısını kes (ve düşük düzey bağlantıyı at)
io.in("room1").disconnectSockets(true);

// "admin" ad alanındaki "room1" odasındaki tüm Socket örneklerinin bağlantısını kes
io.of("/admin").in("room1").disconnectSockets();

// bu aynı zamanda tek bir socket ID'si ile de çalışır
io.of("/admin").in(theSocketId).disconnectSockets();
```

### `fetchSockets`

Bu yöntem, eşleşen Socket örneklerini döndürür:

```js
// ana ad alanındaki tüm Socket örneklerini döndür
const sockets = await io.fetchSockets();

// ana ad alanındaki "room1" odasındaki tüm Socket örneklerini döndür
const sockets = await io.in("room1").fetchSockets();

// "admin" ad alanındaki "room1" odasındaki tüm Socket örneklerini döndür
const sockets = await io.of("/admin").in("room1").fetchSockets();

// bu aynı zamanda tek bir socket ID'si ile de çalışır
const sockets = await io.in(theSocketId).fetchSockets();
```

Yukarıdaki örnekteki `sockets` değişkeni, normal Socket sınıfının bir alt kümesini sergileyen nesnelerden oluşan bir dizi:

```js
for (const socket of sockets) {
  console.log(socket.id);
  console.log(socket.handshake);
  console.log(socket.rooms);
  console.log(socket.data);
  socket.emit(/* ... */);
  socket.join(/* ... */);
  socket.leave(/* ... */);
  socket.disconnect(/* ... */);
}
```

`data` niteliği, Socket.IO sunucuları arasında bilgi paylaşmak için kullanılabilecek keyfi bir nesnedir:

```js
// sunucu A
io.on("connection", (socket) => {
  socket.data.username = "alice";
});

// sunucu B
const sockets = await io.fetchSockets();
console.log(sockets[0].data.username); // "alice"
```

### `serverSideEmit`

Bu yöntem, bir `çoklu sunucu kurulumunda` başka Socket.IO sunucularına etkinlik göndermeyi sağlar.

Sözdizimi:

```js
io.serverSideEmit("hello", "world");
```

Ve alıcı tarafından:

```js
io.on("hello", (arg1) => {
  console.log(arg1); // "world" çıktısını verir
});
```

Onaylar da desteklenmektedir:

```js
// sunucu A
io.serverSideEmit("ping", (err, responses) => {
  console.log(responses[0]); // "pong" çıktısını verir
});

// sunucu B
io.on("ping", (cb) => {
  cb("pong");
});
```

:::note
Notlar:
- `connection`, `connect` ve `new_namespace` dizeleri rezerve edilmiş olup uygulamanızda kullanılamaz.
- Herhangi bir sayıda argüman gönderebilirsiniz, ancak ikili yapılar şu anda desteklenmemektedir (argümanlar dizisi `JSON.stringify` ile dönüştürülecektir).
:::

Örnek:

```js
io.serverSideEmit("hello", "world", 1, "2", { 3: "4" });
```

- Onay geri çağrısı, diğer Socket.IO sunucularından belirli bir süre sonra yanıt gelmezse bir hata ile çağrılabilir.

```js
io.serverSideEmit("ping", (err, responses) => {
  if (err) {
    // en az bir Socket.IO sunucusu yanıt vermedi
    // ancak 'responses' dizisi zaten alınmış tüm yanıtları içerir
  } else {
    // başarı! 'responses' dizisi, kümedeki her bir diğer Socket.IO sunucusu için bir nesne içerir
  }
});
```

## Olaylar

Sunucu örneği tek bir olayı yayımlar (teknik olarak iki tane, ancak `connect`, `connection` için bir takma addır):

- `connection`

### `connection`

Bu olay yeni bir bağlantı gerçekleştiğinde tetiklenir. İlk argüman bir `Socket örneği`.

```js
io.on("connection", (socket) => {
  // ...
});
```

## Tam API

Sunucu örneği tarafından sağlanan eksiksiz API'yi `buradan` bulabilirsiniz.