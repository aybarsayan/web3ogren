---
title: Paketleyiciler ile Kullanım
seoTitle: Paketleyiciler ile Kullanım - Bir Rehber
sidebar_position: 10
description: Sunucu için paket oluşturma süreci ve Webpack kullanımı hakkında bilgi. React ve Socket.IO ile geliştirme için pratik örnekler.
tags: 
  - paketleyici
  - webpack
  - socket.io
  - sunucu
keywords: 
  - paketleme
  - webpack
  - socket.io
  - geliştirme
---
Frontend paketlemeye göre daha az yaygın olsa da, sunucu için bir paket oluşturmak tamamen mümkündür.

## Webpack 5

### İstemci dosyalarını sunmadan

Kurulum:

```
npm install -D webpack webpack-cli socket.io bufferutil utf-8-validate
```

```js
const { Server } = require("socket.io");

const io = new Server({
  serveClient: false
});

io.on("connection", socket => {
  console.log(`connect ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });
});

io.listen(3000);
```

```js
const path = require("path");

module.exports = {
  entry: "./index.js",
  target: "node",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  }
};
```

:::note
`bufferutil` ve `utf-8-validate`, `ws` paketinden iki isteğe bağlı bağımlılıktır. Bunları "harici" olarak ayarlayabilirsiniz:
:::

```js
const path = require("path");

module.exports = {
  entry: "./index.js",
  target: "node",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  externals: {
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
  },
};
```

Belgelendirme: [https://webpack.js.org/configuration/externals/](https://webpack.js.org/configuration/externals/)

### İstemci dosyalarını da sunarak

Bu durumda, [Varlık modüllerini](https://webpack.js.org/guides/asset-modules/) kullanmamız gerekecek ve Socket.IO sunucusunun `sendFile` fonksiyonunu geçersiz kılmamız gerekecek:

```js
const { Server } = require("socket.io");

const clientFile = require("./node_modules/socket.io/client-dist/socket.io.min?raw");
const clientMap = require("./node_modules/socket.io/client-dist/socket.io.min.js.map?raw");

Server.sendFile = (filename, req, res) => {
  res.end(filename.endsWith(".map") ? clientMap : clientFile);
};

const io = new Server();

io.on("connection", socket => {
  console.log(`connect ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });
});

io.listen(3000);
```

```js
const path = require("path");

module.exports = {
  entry: "./index.js",
  target: "node",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        resourceQuery: /raw/,
        type: "asset/source",
      },
    ],
  },
};
```