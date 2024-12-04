---
title: Giriş
seoTitle: Socket.IO Giriş
sidebar_position: 1
description: Socket.IO, düşük gecikmeli ve iki yönlü iletişimi sağlayan bir kütüphanedir. Bu belgede, Socket.IOnun ne olduğu, özellikleri ve kullanımı hakkında bilgi edineceksiniz.
tags: 
  - Socket.IO
  - WebSocket
  - Gerçek Zamanlı İletişim
  - JavaScript
  - Node.js
keywords: 
  - Socket.IO
  - WebSocket
  - Gerçek Zamanlı İletişim
  - JavaScript
  - Node.js
---

:::tip
Eğer Socket.IO'ya yeniyseniz, `öğreticimizi` incelemenizi öneririz.
:::

## Socket.IO Nedir

Socket.IO, bir istemci ile bir sunucu arasında **düşük gecikmeli**, **iki yönlü** ve **olay tabanlı** iletişimi mümkün kılan bir kütüphanedir.

![](../../../images/frameworks/socket.io/static/images/bidirectional-communication2.png)

Socket.IO bağlantısı, farklı düşük seviyeli taşıma yöntemleri ile kurulabilir:

- HTTP uzun anketleme
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [WebTransport](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport_API)

Socket.IO, en iyi mevcut seçeneği otomatik olarak seçecektir; bu, aşağıdakilere bağlıdır:

- tarayıcının yetenekleri (bkz. [burada](https://caniuse.com/websockets) ve [burada](https://caniuse.com/webtransport))
- ağ (bazı ağlar WebSocket ve/veya WebTransport bağlantılarını engeller)

Bunun hakkında daha fazla ayrıntıyı `"Nasıl çalışır" bölümünde` bulabilirsiniz.

### Sunucu Uygulamaları

| Dil                  | Web Sitesi                                                                                                                                                  |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| JavaScript (Node.js) | - `Kurulum adımları`- `API`- [Kaynak kod](https://github.com/socketio/socket.io) |
| JavaScript (Deno)    | https://github.com/socketio/socket.io-deno                                                                                                                 |
| Java                 | https://github.com/mrniko/netty-socketio                                                                                                                 |
| Java                 | https://github.com/trinopoty/socket.io-server-java                                                                                                         |
| Python               | https://github.com/miguelgrinberg/python-socketio                                                                                                          |
| Golang               | https://github.com/googollee/go-socket.io                                                                                                                  |
| Rust                 | https://github.com/Totodore/socketioxide                                                                                                                   |

### İstemci Uygulamaları

| Dil                                           | Web Sitesi                                                                                                                                                      |
|-----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| JavaScript (tarayıcı, Node.js veya React Native) | - `Kurulum adımları`- `API`- [Kaynak kod](https://github.com/socketio/socket.io-client) |
| JavaScript (WeChat Mini-Programları için)       | https://github.com/weapp-socketio/weapp.socket.io                                                                                                              |
| Java                                          | https://github.com/socketio/socket.io-client-java                                                                                                              |
| C++                                           | https://github.com/socketio/socket.io-client-cpp                                                                                                               |
| Swift                                         | https://github.com/socketio/socket.io-client-swift                                                                                                             |
| Dart                                          | https://github.com/rikulo/socket.io-client-dart                                                                                                                |
| Python                                        | https://github.com/miguelgrinberg/python-socketio                                                                                                              |
| .Net                                          | https://github.com/doghappy/socket.io-client-csharp                                                                                                            |
| Rust                                          | https://github.com/1c3t3a/rust-socketio                                                                                                                        |
| Kotlin                                        | https://github.com/icerockdev/moko-socket-io                                                                                                                   |
| PHP                                           | https://github.com/ElephantIO/elephant.io                                                                                                                      |

## Socket.IO NEDİR DEĞİL

:::caution
Socket.IO bir WebSocket uygulaması **DEĞİLDİR**.
:::

Socket.IO, mümkün olduğunda WebSocket'i taşımak için kullanmasına rağmen, her pakete ek meta veriler ekler. Bu nedenle, WebSocket istemcisi bir Socket.IO sunucusuna başarılı bir şekilde bağlanamaz ve bir Socket.IO istemcisi de sıradan bir WebSocket sunucusuna bağlanamaz.

> **UYARI**: istemci BAĞLANAMAYACAK!
> ```js
> const socket = io("ws://echo.websocket.org");
> ```

Düz bir WebSocket sunucusu arıyorsanız, lütfen [ws](https://github.com/websockets/ws) veya [µWebSockets.js](https://github.com/uNetworking/uWebSockets.js) inceleyin.

Ayrıca, Node.js çekirdeğine bir WebSocket sunucusu dahil edilmesi hakkında [tartışmalar](https://github.com/nodejs/node/issues/19308) bulunmaktadır.

İstemci tarafında, [robust-websocket](https://github.com/nathanboktae/robust-websocket) paketine ilginizi çekebilir.

:::caution
Socket.IO, mobil uygulamalar için arka planda bir hizmette kullanılmak üzere tasarlanmamıştır.
:::

Socket.IO kütüphanesi, sunucuya açık bir TCP bağlantısı tutar, bu da kullanıcılarınız için yüksek pil tüketimine yol açabilir. Lütfen bu kullanım durumu için [FCM](https://firebase.google.com/docs/cloud-messaging) gibi bir özel mesajlaşma platformu kullanın.

## Özellikler

Socket.IO'nun düz WebSocket'ler üzerinde sunduğu özellikler şunlardır:

### HTTP uzun anketleme geri dönüş

Bağlantı, WebSocket bağlantısı kurulamıyorsa HTTP uzun anketlemeye geri dönecektir.

Bu özellik, proje on yıldan fazla bir süre önce oluşturulduğunda, insanların Socket.IO'yu kullanmasının #1 nedeni idi (!), çünkü WebSocket'lerin tarayıcı desteği hala emekleme aşamasındaydı.

Artık en çok tarayıcı WebSocket'leri desteklese de (daha fazla [%97](https://caniuse.com/mdn-api_websocket)), bu hala harika bir özellik çünkü bazı yanlış yapılandırılmış proxy'lerin arkasında olan kullanıcıların WebSocket bağlantısı kuramadıklarına dair raporlar almaya devam ediyoruz.

### Otomatik yeniden bağlantı

Bazı özel koşullar altında, sunucu ile istemci arasındaki WebSocket bağlantısı kesilebilir ve her iki taraf da bağlantı durumunu bilmeyebilir.

Bu nedenle Socket.IO, bağlantının durumunu periyodik olarak kontrol eden bir kalp atış mekanizması içerir.

Ve istemci sonunda bağlantısı koptuğunda, sunucuyu zorlamamak için otomatik olarak üstel bir geri bağlantı gecikmesi ile yeniden bağlanır.

### Paket tamponlama

Paketler, istemci bağlantısı kesildiğinde otomatik olarak tamponlanır ve yeniden bağlandığında gönderilir.

Daha fazla bilgi `burada`.

### Onaylar

Socket.IO, bir olay göndermenin ve cevap almanın kolay bir yolunu sunar:

*Gönderen*

```js
socket.emit("hello", "world", (response) => {
  console.log(response); // "aldım"
});
```

*Alıcı*

```js
socket.on("hello", (arg, callback) => {
  console.log(arg); // "world"
  callback("aldım");
});
```

Ayrıca bir zaman aşımı ekleyebilirsiniz:

```js
socket.timeout(5000).emit("hello", "world", (err, response) => {
  if (err) {
    // diğer taraf verilen gecikme içinde olayı onaylamadı
  } else {
    console.log(response); // "aldım"
  }
});
```

### Yayınlama

Sunucu tarafında, `tüm bağlı istemcilere` veya `belirli bir istemci grubuna` bir olay gönderebilirsiniz:

```js
// tüm bağlı istemcilere
io.emit("hello");

// "haber" odasındaki tüm bağlı istemcilere
io.to("news").emit("hello");
```

Bu, `birden fazla düğüme ölçeklenirken` de çalışır.

### Çoklama

Ad alanları, uygulamanızın mantığını tek bir paylaşılan bağlantı üzerinden paylaşmanıza olanak tanır. Bu, yalnızca yetkili kullanıcıların katılabileceği bir "admin" kanalı oluşturmak istiyorsanız faydalı olabilir.

```js
io.on("connection", (socket) => {
  // klasik kullanıcılar
});

io.of("/admin").on("connection", (socket) => {
  // admin kullanıcılar
});
```

Bunun hakkında daha fazla bilgi `burada`.

## Ortak Sorular

### Socket.IO'ya hala ihtiyaç var mı?

Bu adil bir soru, çünkü WebSocket'ler [neredeyse her yerde](https://caniuse.com/mdn-api_websocket) artık destekleniyor.

Bununla birlikte, eğer uygulamanızda düz WebSocket kullanıyorsanız, sonunda zaten Socket.IO'da dahil (ve savaş testinden geçmiş) çoğu özelliği, örneğin `yeniden bağlantı`, `onaylar` veya `yayınlama` özelliklerini uygulamanız gerektiğine inanıyoruz.

### Socket.IO protokolünün aşırı yükü nedir?

`socket.emit("hello", "world")` tek bir WebSocket çerçevesi olarak `42["hello","world"]` olarak gönderilecektir:

- `4`, Engine.IO "mesaj" paket tipidir
- `2`, Socket.IO "mesaj" paket tipidir
- `["hello","world"]` argüman dizisinin `JSON.stringify()` ile dönüştürülmüş halidir

Yani, her mesaj için birkaç ek bayt, bu da `özel bir ayrıştırıcı` kullanılarak daha da azaltılabilir.

:::info
Tarayıcı paketinin boyutu [`10.4 kB`](https://bundlephobia.com/package/socket.io-client) (minify edilmiş ve gzipped).
:::

Socket.IO protokolünün ayrıntılarını `burada` bulabilirsiniz.

### Bir şey düzgün çalışmıyor, lütfen yardım edin?

Lütfen `Sorun Giderme kılavuzumuzu` kontrol edin.

## Sonraki Adımlar

- `Başlangıç örneği`
- `Sunucu kurulumu`
- `İstemci kurulumu`