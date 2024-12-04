---
title: PM2 ile Kullanım
seoTitle: PM2 Kullanımı için Kapsamlı Rehber
sidebar_position: 4
description: PM2, Node.js uygulamaları için bir üretim süreç yöneticisidir. Bu döküman PM2 ile Socket.IO sunucusu ölçeklendirme yöntemlerini ve kullanımını açıklar.
tags: 
  - PM2
  - Socket.IO
  - Node.js
  - süreç yöneticisi
keywords: 
  - PM2
  - Socket.IO
  - Node.js
  - uygulama yönetimi
---
PM2, Node.js uygulamaları için yerleşik bir yük dengeleyici ile birlikte bir üretim süreç yöneticisidir. Uygulamaları sonsuza kadar canlı tutmanıza, kesinti olmadan yeniden yüklemenize ve yaygın sistem yöneticisi görevlerini kolaylaştırmanıza olanak tanır.

Belgelerine buradan ulaşabilirsiniz: [PM2 Belgeleri](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)

PM2 ile bir Socket.IO sunucusunu ölçeklendirmek için üç çözüm vardır:

- İstemci tarafında HTTP uzun süreli sorgulamayı devre dışı bırakma:

  ```js
  const socket = io({
    transports: ["websocket"]
  });
  ```

  Bu durumda, WebSocket bağlantısı kurulamazsa HTTP uzun süreli sorgulamaya geri düşme olmayacaktır.

- Her işçi için ayrı bir port kullanmak ve önünde nginx gibi bir yük dengelemesi yapmak.
- `@socket.io/pm2` kullanmak.

## Kurulum

```
npm install -g @socket.io/pm2
```

Eğer `pm2` zaten kuruluysa, önce onu kaldırmanız gerekir:

```
npm remove -g pm2
```

`@socket.io/pm2`, `pm2` için bir doğrudan yedek olarak kullanılabilir ve `pm2` aracının tüm komutlarını destekler.

Tek fark [bu committen](https://github.com/socketio/pm2/commit/8c29a7feb6cbde3c8ef9eb072fee284686f1553f) kaynaklanmaktadır.

## Kullanım

`worker.js`

```js
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/cluster-adapter");
const { setupWorker } = require("@socket.io/sticky");

const httpServer = createServer();
const io = new Server(httpServer);

io.adapter(createAdapter());

setupWorker(io);

io.on("connection", (socket) => {
  console.log(`connect ${socket.id}`);
});
```

`ecosystem.config.js`

```js
module.exports = {
  apps : [{
    script    : "worker.js",
    instances : "max",
    exec_mode : "cluster"
  }]
}
```

Ve ardından `pm2 start ecosystem.config.js` (veya `pm2 start worker.js -i 0`) komutunu çalıştırın. Hepsi bu kadar! Artık Socket.IO kümesine 8080 portundan ulaşabilirsiniz.

## Nasıl Çalışır

`Birden Fazla Düğüme Ölçeklenirken` yapılması gereken iki şey vardır:

- Yapışkan oturumları etkinleştirmek, böylece bir Socket.IO oturumunun HTTP isteklerinin aynı işçiye yönlendirilmesi.
- Paketlerin tüm istemcilere iletilmesi için özel bir adaptör kullanmak, hatta başka bir işçiye bağlı olsalar bile.

Bunu başarmak için `@socket.io/pm2`, iki ek paket içerir:

- [`@socket.io/sticky`](https://github.com/socketio/socket.io-sticky)
- [`@socket.io/cluster-adapter`](https://github.com/socketio/socket.io-cluster-adapter)

`pm2` ile tek fark [bu committen](https://github.com/socketio/pm2/commit/8c29a7feb6cbde3c8ef9eb072fee284686f1553f) kaynaklanmaktadır:

- God süreci artık kendi HTTP sunucusunu oluşturur ve HTTP isteklerini doğru işçiye yönlendirir.
- God süreci ayrıca işçiler arasında paketleri tekrar iletir, böylece `io.emit()` tüm istemcilere doğru ulaşır.

Birden fazla PM2 kümesi çalıştıran birçok sunucunuz varsa, `Redis adaptörü` gibi başka bir adaptör kullanmanız gerekeceğini lütfen unutmayın.

Fork'un kaynak kodu [burada](https://github.com/socketio/pm2) bulunabilir. `pm2` paketinin sürümlerini yakından takip etmeye çalışacağız.