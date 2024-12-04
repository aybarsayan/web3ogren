---
title: Sunucu Başlatma
seoTitle: Socket.IO Sunucu Başlatma Kılavuzu
sidebar_position: 2
description: Socket.IO sunucu kütüphanesi ile sunucu başlatma yöntemlerini keşfedin. HTTP ve HTTPS sunucuları ile farklı uygulama senaryolarını öğrenin.
tags: 
  - sunucu
  - socket.io
  - http
  - https
  - developman
keywords: 
  - Socket.IO
  - sunucu başlatma
  - HTTP sunucusu
  - HTTPS sunucusu
  - TypeScript
---



Socket.IO sunucu kütüphanesini `yükledikten` sonra sunucuyu başlatabilirsiniz. Seçeneklerin tam listesi `burada` bulunabilir.

:::tip
TypeScript kullanıcıları, olaylar için tür ipuçları sağlama imkanına sahiptir. Lütfen `şunu` kontrol edin.
:::

## Başlatma

### Bağımsız


  

```js
const { Server } = require("socket.io");

const io = new Server({ /* options */ });

io.on("connection", (socket) => {
  // ...
});

io.listen(3000);
```

  
  

```js
import { Server } from "socket.io";

const io = new Server({ /* options */ });

io.on("connection", (socket) => {
  // ...
});

io.listen(3000);
```

  
  

```ts
import { Server } from "socket.io";

const io = new Server({ /* options */ });

io.on("connection", (socket) => {
  // ...
});

io.listen(3000);
```

  


Ayrıca, bağlantı noktasını ilk argüman olarak geçebilirsiniz:


  

```js
const { Server } = require("socket.io");

const io = new Server(3000, { /* options */ });

io.on("connection", (socket) => {
  // ...
});
```

  
  

```js
import { Server } from "socket.io";

const io = new Server(3000, { /* options */ });

io.on("connection", (socket) => {
  // ...
});
```

  
  

```ts
import { Server } from "socket.io";

const io = new Server(3000, { /* options */ });

io.on("connection", (socket) => {
  // ...
});
```

  


Bu, dolaylı olarak bir Node.js [HTTP sunucusunu](https://nodejs.org/docs/latest/api/http.html#http_class_http_server) başlatır ve `io.httpServer` aracılığıyla erişilebilir.

### HTTP sunucusu ile


  

```js
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

  
  

```js
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

  
  

```ts
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

  


### HTTPS sunucusu ile


  

```js
const { readFileSync } = require("fs");
const { createServer } = require("https");
const { Server } = require("socket.io");

const httpsServer = createServer({
  key: readFileSync("/path/to/my/key.pem"),
  cert: readFileSync("/path/to/my/cert.pem")
});

const io = new Server(httpsServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpsServer.listen(3000);
```

  
  

```js
import { readFileSync } from "fs";
import { createServer } from "https";
import { Server } from "socket.io";

const httpsServer = createServer({
  key: readFileSync("/path/to/my/key.pem"),
  cert: readFileSync("/path/to/my/cert.pem")
});

const io = new Server(httpsServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpsServer.listen(3000);
```

  
  

```ts
import { readFileSync } from "fs";
import { createServer } from "https";
import { Server } from "socket.io";

const httpsServer = createServer({
  key: readFileSync("/path/to/my/key.pem"),
  cert: readFileSync("/path/to/my/cert.pem")
});

const io = new Server(httpsServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpsServer.listen(3000);
```

  


Ayrıca bakınız: [Node.js belgeleri](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)

Müşteri sertifikası kimlik doğrulaması ile:

*Sunucu*

```js
import { readFileSync } from "fs";
import { createServer } from "https";
import { Server } from "socket.io";

const httpsServer = createServer({
  key: readFileSync("/path/to/server-key.pem"),
  cert: readFileSync("/path/to/server-cert.pem"),
  requestCert: true,
  ca: [
    readFileSync("/path/to/client-cert.pem")
  ]
});

const io = new Server(httpsServer, { /* options */ });

io.engine.on("connection", (rawSocket) => {
  // sertifika bilgilerine ihtiyacınız varsa (iki tarafın el sıkışma işlemi tamamlandığında artık mevcut değildir)
  rawSocket.peerCertificate = rawSocket.request.client.getPeerCertificate();
});

io.on("connection", (socket) => {
  console.log(socket.conn.peerCertificate);
  // ...
});

httpsServer.listen(3000);
```

*Müşteri*

```js
import { readFileSync } from "fs";
import { io } from "socket.io-client";

const socket = io("https://example.com", {
  key: readFileSync("/path/to/client-key.pem"),
  cert: readFileSync("/path/to/client-cert.pem"),
  ca: [
    readFileSync("/path/to/server-cert.pem")
  ]
});
```

### HTTP/2 sunucusu ile


  

```js
const { readFileSync } = require("fs");
const { createSecureServer } = require("http2");
const { Server } = require("socket.io");

const httpServer = createSecureServer({
  allowHTTP1: true,
  key: readFileSync("/path/to/my/key.pem"),
  cert: readFileSync("/path/to/my/cert.pem")
});

const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

  
  

```js
import { readFileSync } from "fs";
import { createSecureServer } from "http2";
import { Server } from "socket.io";

const httpServer = createSecureServer({
  allowHTTP1: true,
  key: readFileSync("/path/to/my/key.pem"),
  cert: readFileSync("/path/to/my/cert.pem")
});

const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

  
  

```ts
import { readFileSync } from "fs";
import { createSecureServer } from "http2";
import { Server } from "socket.io";

const httpServer = createSecureServer({
  allowHTTP1: true,
  key: readFileSync("/path/to/my/key.pem"),
  cert: readFileSync("/path/to/my/cert.pem")
});

const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

  


Ayrıca bakınız: [Node.js belgeleri](https://nodejs.org/api/http2.html#http2_http2_createsecureserver_options_onrequesthandler)

### Express ile


  

```js
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

  
  

```js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

  
  

```ts
import * as express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

  


:::caution
`app.listen(3000)` kullanmak burada işe yaramayacaktır, çünkü yeni bir HTTP sunucusu oluşturur.
:::

Daha fazla bilgi [burada](http://expressjs.com/).

### Koa ile


  

```js
const Koa = require("koa");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = new Koa();
const httpServer = createServer(app.callback());
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

  
  

```js
import Koa from "koa";
import { createServer } from "http";
import { Server } from "socket.io";

const app = new Koa();
const httpServer = createServer(app.callback());
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

  
  

```ts
import * as Koa from "koa";
import { createServer } from "http";
import { Server } from "socket.io";

const app = new Koa();
const httpServer = createServer(app.callback());
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);
```

  


Daha fazla bilgi [burada](https://koajs.com/).

### Nest ile

Belgelere [buradan](https://docs.nestjs.com/websockets/gateways) ulaşabilirsiniz.

:::caution
NestJS v7 ve altı, Socket.IO v2'ye bağımlıdır, NestJS v8 ise Socket.IO v4'e bağımlıdır. Lütfen `uyumlu bir istemci` kullanın.
:::

# ile

[`fastify-socket.io`](https://github.com/alemagio/fastify-socket.io) eklentisini kaydetmeniz gerekir:


  

```js
const fastify = require("fastify");
const fastifyIO = require("fastify-socket.io");

const server = fastify();
server.register(fastifyIO);

server.get("/", (req, reply) => {
  server.io.emit("hello");
});

server.ready().then(() => {
  // sunucunun hazır olmasını beklememiz gerekiyor, aksi takdirde `server.io` tanımsızdır
  server.io.on("connection", (socket) => {
    // ...
  });
});

server.listen({ port: 3000 });
```

  
  

```js
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";

const server = fastify();
server.register(fastifyIO);

server.get("/", (req, reply) => {
  server.io.emit("hello");
});

server.ready().then(() => {
  // sunucunun hazır olmasını beklememiz gerekiyor, aksi takdirde `server.io` tanımsızdır
  server.io.on("connection", (socket) => {
    // ...
  });
});

server.listen({ port: 3000 });
```

  
  

```ts
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";

const server = fastify();
server.register(fastifyIO);

server.get("/", (req, reply) => {
  server.io.emit("hello");
});

server.ready().then(() => {
  // sunucunun hazır olmasını beklememiz gerekiyor, aksi takdirde `server.io` tanımsızdır
  server.io.on("connection", (socket) => {
    // ...
  });
});

server.listen({ port: 3000 });
```

  


### µWebSockets.js ile {#with-uwebsocketsjs}

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
    console.warn("port zaten kullanımda");
  }
});
```

Reference: https://github.com/uNetworking/uWebSockets.js

### Hono (Node.js) ile


  

```js
const { Hono } = require("hono");
const { serve } = require("@hono/node-server");
const { Server } = require("socket.io");

const app = new Hono();

const httpServer = serve({
    fetch: app.fetch,
    port: 3000,
});

const io = new Server(httpServer, {
    /* options */
});

io.on("connection", (socket) => {
    // ...
});
```

  
  

```js
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Server } from "socket.io";

const app = new Hono();

const httpServer = serve({
    fetch: app.fetch,
    port: 3000,
});

const io = new Server(httpServer, {
    /* options */
});

io.on("connection", (socket) => {
    // ...
});
```

  
  

```ts
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Server } from "socket.io";
import type { Server as HTTPServer } from "node:http";

const app = new Hono();

const httpServer = serve({
    fetch: app.fetch,
    port: 3000,
});

const io = new Server(httpServer as HTTPServer, {
    /* options */
});

io.on("connection", (socket) => {
    // ...
});
```

  


Daha fazla bilgi [burada](https://hono.dev).

## Seçenekler

Mevcut seçeneklerin tam listesi `burada` bulunabilir.