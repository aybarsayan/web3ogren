---
title: TypeScript
seoTitle: TypeScript for Socket.IO
sidebar_position: 8
description: TypeScript provides first-class support for Socket.IO as of version 3. This page outlines type definitions for server and client events, as well as usage examples.
tags: 
  - TypeScript
  - Socket.IO
  - Events
  - Interfaces
  - Node.js
keywords: 
  - TypeScript
  - Socket.IO
  - Server
  - Client
  - Events
---
v3 itibarıyla, Socket.IO artık [TypeScript](https://www.typescriptlang.org/) için birinci sınıf desteğe sahiptir.

## Sunucu için Türler

Öncelikle bazı türleri tanımlayın:

```ts
interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}
```

Ve bunları sunucunuzu oluştururken kullanın:

```ts
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>();
```

Sonrasında, IDE'nizin yardımlarından faydalanın!

`ServerToClientEvents` arayüzünde tanımlanan olaylar, olayları gönderirken ve yayınlarken kullanılır:

```ts
io.on("connection", (socket) => {
  socket.emit("noArg");
  socket.emit("basicEmit", 1, "2", Buffer.from([3]));
  socket.emit("withAck", "4", (e) => {
    // e, number olarak çıkarım yapılır
  });

  // tüm kullanıcılara yayın yapıldığında çalışır
  io.emit("noArg");

  // bir odaya yayın yapıldığında çalışır
  io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));
});
```

`ClientToServerEvents` arayüzünde tanımlananlar, olayları alırken kullanılır:

```ts
io.on("connection", (socket) => {
  socket.on("hello", () => {
    // ...
  });
});
```

`InterServerEvents` arayüzünde tanımlananlar, sunucular arası iletişim için kullanılır (ekli `socket.io@4.1.0`):

```ts
io.serverSideEmit("ping");

io.on("ping", () => {
  // ...
});
```

Ve nihayetinde, `SocketData` türü, `socket.data` özniteliğini biçimlendirmek için kullanılır (ekli `socket.io@4.4.0`):

```ts
io.on("connection", (socket) => {
  socket.data.name = "john";
  socket.data.age = 42;
});
```

:::warning
Bu tür ipuçları, girişi düzgün bir şekilde doğrulama/temizleme işleminin yerini almamaktadır. Her zamanki gibi, kullanıcı girdisine asla güvenmeyin.
:::

## İstemci için Türler

İstemci tarafında, aynı `ServerToClientEvents` ve `ClientToServerEvents` arayüzlerini yeniden kullanabilirsiniz:

```ts
import { io, Socket } from "socket.io-client";

// lütfen türlerin ters olduğunu unutmayın
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
```

Benzer şekilde, `ClientToServerEvents` arayüzünde tanımlanan olaylar, olay gönderirken kullanılır:

```ts
socket.emit("hello");
```

Ve `ServerToClientEvents` arayüzünde tanımlananlar, olayları alırken kullanılır:

```ts
socket.on("noArg", () => {
  // ...
});

socket.on("basicEmit", (a, b, c) => {
  // a, number olarak çıkarım yapılır, b string olarak ve c buffer olarak
});

socket.on("withAck", (d, callback) => {
  // d, string olarak çıkarım yapılır ve callback, bir sayı argümanı alan bir işlev olarak
});
```

## Her ad alanı için Özel türler

Her bir `Ad Alanı` kendi olay kümesine sahip olabilir, bu nedenle her bir ad alanı için bazı türler de sağlayabilirsiniz:

```ts
import { Server } from "socket.io";

// ana ad alanı için türler
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

// "/my-namespace" adlı ad alanı için türler
interface NamespaceSpecificClientToServerEvents {
  foo: (arg: string) => void;
}

interface NamespaceSpecificServerToClientEvents {
  bar: (arg: string) => void;
}

interface NamespaceSpecificInterServerEvents {
  // ...
}

interface NamespaceSpecificSocketData {
  // ...
}

const myNamespace: Namespace<
  NamespaceSpecificClientToServerEvents,
  NamespaceSpecificServerToClientEvents,
  NamespaceSpecificInterServerEvents,
  NamespaceSpecificSocketData
  > = io.of("/my-namespace");

myNamespace.on("connection", (socket) => {
  socket.on("foo", () => {
    // ...
  });

  socket.emit("bar", "123");
});
```

Ve istemci tarafında:

```ts
import { io, Socket } from "socket.io-client";

const socket: Socket<
  NamespaceSpecificServerToClientEvents,
  NamespaceSpecificClientToServerEvents
  > = io("/my-namespace");

socket.on("bar", (arg) => {
  console.log(arg); // "123"
});