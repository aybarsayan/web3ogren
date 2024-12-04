---
title: Küme adaptörü
seoTitle: Socket.IO Küme Adaptörü - Kullanım ve Kurulum
sidebar_position: 6
description: Küme adaptörü, Socket.IO kullanımını Node.js kümesi içinde sağlarken, birden fazla istemciye gönderilen her paketi diğer işçilere de yönlendirir. Bu belge, kurulum ve kullanım detaylarını sunar.
tags: 
  - Socket.IO
  - Node.js
  - küme adaptörü
  - geliştirme
  - IPC
keywords: 
  - Socket.IO
  - Node.js
  - küme adaptörü
  - geliştirme
  - IPC
---
## Nasıl çalışır

Küme adaptörü, [Node.js kümesi](https://nodejs.org/api/cluster.html) içinde Socket.IO kullanmayı sağlar.

**Birden fazla istemciye gönderilen her paket** (örneğin `io.to("room1").emit()` veya `socket.broadcast.emit()`) IPC kanalı aracılığıyla diğer işçilere de gönderilir.

:::info
Bu adaptörün kaynak koduna [buradan](https://github.com/socketio/socket.io-cluster-adapter) ulaşabilirsiniz.
:::

## Desteklenen özellikler

| Özellik                          | `socket.io` versiyonu                | Destek                                         |
|----------------------------------|--------------------------------------|------------------------------------------------|
| Socket yönetimi                  | `4.0.0`                              | :white_check_mark: EVET (sürüm `0.1.0` itibarıyla) |
| Sunucular arası iletişim         | `4.1.0`                              | :white_check_mark: EVET (sürüm `0.1.0` itibarıyla) |
| Onaylı yayın yapma              | `4.5.0` | :white_check_mark: EVET (sürüm `0.2.0` itibarıyla) |
| Bağlantı durumu kurtarma        | `4.6.0` | :x: HAYIR                                       |

## Kurulum

```
npm install @socket.io/cluster-adapter
```

## Kullanım

### Node.js kümesi ile

```js
const cluster = require("cluster");
const http = require("http");
const { Server } = require("socket.io");
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

if (cluster.isMaster) {
  console.log(`Ana ${process.pid} çalışıyor`);

  const httpServer = http.createServer();

  // yapışkan oturumları ayarla
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });

  // işçiler arasındaki bağlantıları ayarla
  setupPrimary();

  // tampon içeren paketler için gereklidir (sadece düz metin nesneleri gönderiyorsanız göz ardı edebilirsiniz)
  // Node.js < 16.0.0
  cluster.setupMaster({
    serialization: "advanced",
  });
  // Node.js > 16.0.0
  // cluster.setupPrimary({
  //   serialization: "advanced",
  // });

  httpServer.listen(3000);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`İşçi ${worker.process.pid} öldü`);
    cluster.fork();
  });
} else {
  console.log(`İşçi ${process.pid} başlatıldı`);

  const httpServer = http.createServer();
  const io = new Server(httpServer);

  // küme adaptörünü kullan
  io.adapter(createAdapter());

  // ana süreçle bağlantıyı ayarla
  setupWorker(io);

  io.on("connection", (socket) => {
    /* ... */
  });
}
```

### PM2 ile

:::tip
`İlgili belgeleri` inceleyin.
:::

### `recluster` ile

`cluster.js`

```js
const cluster = require("cluster");
const http = require("http");
const { setupMaster } = require("@socket.io/sticky");
const { setupPrimary } = require("@socket.io/cluster-adapter");
const recluster = require("recluster");
const path = require("path");

const httpServer = http.createServer();

// yapışkan oturumları ayarla
setupMaster(httpServer, {
  loadBalancingMethod: "least-connection",
});

// işçiler arasındaki bağlantıları ayarla
setupPrimary();

// tampon içeren paketler için gereklidir (sadece düz metin nesneleri gönderiyorsanız göz ardı edebilirsiniz)
// Node.js < 16.0.0
cluster.setupMaster({
  serialization: "advanced",
});
// Node.js > 16.0.0
// cluster.setupPrimary({
//   serialization: "advanced",
// });

httpServer.listen(3000);

const balancer = recluster(path.join(__dirname, "worker.js"));

balancer.run();
```

`worker.js`

```js
const http = require("http");
const { Server } = require("socket.io");
const { setupWorker } = require("@socket.io/sticky");
const { createAdapter } = require("@socket.io/cluster-adapter");

const httpServer = http.createServer();
const io = new Server(httpServer);

// küme adaptörünü kullan
io.adapter(createAdapter());

// ana süreçle bağlantıyı ayarla
setupWorker(io);

io.on("connection", (socket) => {
  /* ... */
});
```

## Seçenekler

| İsim               | Açıklama                                                                                   | Varsayılan değer |
|---------------------|-------------------------------------------------------------------------------------------|-------------------|
| `requestsTimeout`   | `fetchSockets()` veya onaylı `serverSideEmit()` gibi sunucular arası istekler için zaman aşımı | `5000`            |

## En son sürümler

| Sürüm   | Sürüm tarihi  | Sürümler notları                                                                   | Fark                                                                                               |
|---------|---------------|-------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `0.2.2` | Mart 2022    | [link](https://github.com/socketio/socket.io-cluster-adapter/releases/tag/0.2.2)  | [`0.2.1...0.2.2`](https://github.com/socketio/socket.io-cluster-adapter/compare/0.2.1...0.2.2) |
| `0.2.1` | Ekim 2022    | [link](https://github.com/socketio/socket.io-cluster-adapter/releases/tag/0.2.1)  | [`0.2.0...0.2.1`](https://github.com/socketio/socket.io-cluster-adapter/compare/0.2.0...0.2.1) |
| `0.2.0` | Nisan 2022   | [link](https://github.com/socketio/socket.io-cluster-adapter/releases/tag/0.2.0)  | [`0.1.0...0.2.0`](https://github.com/socketio/socket.io-cluster-adapter/compare/0.1.0...0.2.0) |
| `0.1.0` | Haziran 2021  | [link](https://github.com/socketio/socket.io-cluster-adapter/releases/tag/0.1.0)  |                                                                                                    |

[Tam değişiklik günlüğü](https://github.com/socketio/socket.io-cluster-adapter/blob/main/CHANGELOG.md)