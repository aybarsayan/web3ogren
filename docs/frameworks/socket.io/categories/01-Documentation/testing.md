---
title: Test Etme
seoTitle: Test Etme - Kütüphaneler ile Uygulama
sidebar_position: 6
description: Bu belge, yaygın test kütüphaneleri olan Mocha, Jest, Tape ve Vitest ile örnek kodlar içermektedir. Her kütüphanenin kurulum ve test setleri hakkında bilgi sağlamaktadır.
tags: 
  - test
  - kütüphane
  - mocha
  - jest
  - tape
  - vitest
keywords: 
  - test
  - mocha
  - jest
  - tape
  - vitest
---



Aşağıda bazı yaygın test kütüphaneleri ile ilgili kod örneklerini bulacaksınız:


  




  

Kurulum:

```
npm install --save-dev mocha chai
```

Test seti:

```js title="test/basic.js"
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const ioc = require("socket.io-client");
const { assert } = require("chai");

function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("benim harika projem", () => {
  let io, serverSocket, clientSocket;

  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  after(() => {
    io.close();
    clientSocket.disconnect();
  });

  it("çalışmalı", (done) => {
    clientSocket.on("hello", (arg) => {
      assert.equal(arg, "world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  it("onayla ile çalışmalı", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      assert.equal(arg, "hola");
      done();
    });
  });

  it("emitWithAck() ile çalışmalı", async () => {
    serverSocket.on("foo", (cb) => {
      cb("bar");
    });
    const result = await clientSocket.emitWithAck("foo");
    assert.equal(result, "bar");
  });

  it("waitFor() ile çalışmalı", () => {
    clientSocket.emit("baz");

    return waitFor(serverSocket, "baz");
  });
});
```

  
  

Kurulum:

```
npm install --save-dev mocha chai
```

Test seti:

```js title="test/basic.js"
import { createServer } from "node:http";
import { io as ioc } from "socket.io-client";
import { Server } from "socket.io";
import { assert } from "chai";

function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("benim harika projem", () => {
  let io, serverSocket, clientSocket;

  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  after(() => {
    io.close();
    clientSocket.disconnect();
  });

  it("çalışmalı", (done) => {
    clientSocket.on("hello", (arg) => {
      assert.equal(arg, "world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  it("onayla ile çalışmalı", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      assert.equal(arg, "hola");
      done();
    });
  });

  it("emitWithAck() ile çalışmalı", async () => {
    serverSocket.on("foo", (cb) => {
      cb("bar");
    });
    const result = await clientSocket.emitWithAck("foo");
    assert.equal(result, "bar");
  });

  it("waitFor() ile çalışmalı", () => {
    clientSocket.emit("baz");

    return waitFor(serverSocket, "baz");
  });
});
```

  
  

Kurulum:

```
npm install --save-dev mocha chai @types/mocha @types/chai
```

Test seti:

```ts title="test/basic.ts"
import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import { assert } from "chai";

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("benim harika projem", () => {
  let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;

  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  after(() => {
    io.close();
    clientSocket.disconnect();
  });

  it("çalışmalı", (done) => {
    clientSocket.on("hello", (arg) => {
      assert.equal(arg, "world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  it("onayla ile çalışmalı", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      assert.equal(arg, "hola");
      done();
    });
  });

  it("emitWithAck() ile çalışmalı", async () => {
    serverSocket.on("foo", (cb) => {
      cb("bar");
    });
    const result = await clientSocket.emitWithAck("foo");
    assert.equal(result, "bar");
  });

  it("waitFor() ile çalışmalı", async () => {
    clientSocket.emit("baz");

    await waitFor(serverSocket, "baz");
  });
});
```

  


Referans: https://mochajs.org/



  
  




  

Kurulum:

```
npm install --save-dev jest
```

Test seti:

```js title="__tests__/basic.test.js"
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const ioc = require("socket.io-client");

function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("benim harika projem", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });

  test("çalışmalı", (done) => {
    clientSocket.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  test("onayla ile çalışmalı", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      expect(arg).toBe("hola");
      done();
    });
  });

  test("emitWithAck() ile çalışmalı", async () => {
    serverSocket.on("foo", (cb) => {
      cb("bar");
    });
    const result = await clientSocket.emitWithAck("foo");
    expect(result).toBe("bar");
  });

  test("waitFor() ile çalışmalı", () => {
    clientSocket.emit("baz");

    return waitFor(serverSocket, "baz");
  });
});
```

  
  

Kurulum:

```
npm install --save-dev jest
```

Test seti:

```js title="__tests__/basic.test.js"
import { createServer } from "node:http";
import { io as ioc } from "socket.io-client";
import { Server } from "socket.io";

function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("benim harika projem", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });

  test("çalışmalı", (done) => {
    clientSocket.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  test("onayla ile çalışmalı", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      expect(arg).toBe("hola");
      done();
    });
  });

  test("emitWithAck() ile çalışmalı", async () => {
    serverSocket.on("foo", (cb) => {
      cb("bar");
    });
    const result = await clientSocket.emitWithAck("foo");
    expect(result).toBe("bar");
  });

  test("waitFor() ile çalışmalı", () => {
    clientSocket.emit("baz");

    return waitFor(serverSocket, "baz");
  });
});
```

  
  

Kurulum:

```
npm install --save-dev jest @types/jest
```

Test seti:

```ts title="__tests__/basic.test.ts"
import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("benim harika projem", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });

  test("çalışmalı", (done) => {
    clientSocket.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  test("onayla ile çalışmalı", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      expect(arg).toBe("hola");
      done();
    });
  });

  test("emitWithAck() ile çalışmalı", async () => {
    serverSocket.on("foo", (cb) => {
      cb("bar");
    });
    const result = await clientSocket.emitWithAck("foo");
    expect(result).toBe("bar");
  });

  test("waitFor() ile çalışmalı", async () => {
    clientSocket.emit("baz");

    await waitFor(serverSocket, "baz");
  });
});
```

  


Referans: https://jestjs.io/



  
  




  

Kurulum:

```
npm install --save-dev tape
```

Test seti:

```js title="test/basic.js"
const test = require("tape");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const ioc = require("socket.io-client");

let io, serverSocket, clientSocket;

function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

test("kurulum", (t) => {
  const httpServer = createServer();
  io = new Server(httpServer);
  httpServer.listen(() => {
    const port = httpServer.address().port;
    clientSocket = ioc(`http://localhost:${port}`);
    io.on("connection", (socket) => {
      serverSocket = socket;
    });
    clientSocket.on("connect", t.end);
  });
});

test("işe yarıyor", (t) => {
  t.plan(1);
  clientSocket.on("hello", (arg) => {
    t.equal(arg, "world");
  });
  serverSocket.emit("hello", "world");
});

test("onayla ile işe yarıyor", (t) => {
  t.plan(1);
  serverSocket.on("hi", (cb) => {
    cb("hola");
  });
  clientSocket.emit("hi", (arg) => {
    t.equal(arg, "hola");
  });
});

test("emitWithAck() ile işe yarıyor", async (t) => {
  t.plan(1);
  serverSocket.on("foo", (cb) => {
    cb("bar");
  });
  const result = await clientSocket.emitWithAck("foo");
  t.equal(result, "bar");
});

test("waitFor() ile işe yarıyor", async (t) => {
  t.plan(1);
  clientSocket.emit("baz");

  await waitFor(serverSocket, "baz");
  t.pass();
});

test.onFinish(() => {
  io.close();
  clientSocket.disconnect();
});
```

  
  

Kurulum:

```
npm install --save-dev tape
```

Test seti:

```js title="test/basic.js"
import { test } from "tape";
import { createServer } from "node:http";
import { io as ioc } from "socket.io-client";
import { Server } from "socket.io";

let io, serverSocket, clientSocket;

function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

test("kurulum", (t) => {
  const httpServer = createServer();
  io = new Server(httpServer);
  httpServer.listen(() => {
    const port = httpServer.address().port;
    clientSocket = ioc(`http://localhost:${port}`);
    io.on("connection", (socket) => {
      serverSocket = socket;
    });
    clientSocket.on("connect", t.end);
  });
});

test("işe yarıyor", (t) => {
  t.plan(1);
  clientSocket.on("hello", (arg) => {
    t.equal(arg, "world");
  });
  serverSocket.emit("hello", "world");
});

test("onayla ile işe yarıyor", (t) => {
  t.plan(1);
  serverSocket.on("hi", (cb) => {
    cb("hola");
  });
  clientSocket.emit("hi", (arg) => {
    t.equal(arg, "hola");
  });
});

test("emitWithAck() ile işe yarıyor", async (t) => {
  t.plan(1);
  serverSocket.on("foo", (cb) => {
    cb("bar");
  });
  const result = await clientSocket.emitWithAck("foo");
  t.equal(result, "bar");
});

test("waitFor() ile işe yarıyor", async (t) => {
  t.plan(1);
  clientSocket.emit("baz");

  await waitFor(serverSocket, "baz");
  t.pass();
});

test.onFinish(() => {
  io.close();
  clientSocket.disconnect();
});
```

  
  

Kurulum:

```
npm install --save-dev tape
```

Test seti:

```ts title="test/basic.ts"
import { test } from "tape";
import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";

let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

test("kurulum", (t) => {
  const httpServer = createServer();
  io = new Server(httpServer);
  httpServer.listen(() => {
    const port = (httpServer.address() as AddressInfo).port;
    clientSocket = ioc(`http://localhost:${port}`);
    io.on("connection", (socket) => {
      serverSocket = socket;
    });
    clientSocket.on("connect", t.end);
  });
});

test("işe yarıyor", (t) => {
  t.plan(1);
  clientSocket.on("hello", (arg) => {
    t.equal(arg, "world");
  });
  serverSocket.emit("hello", "world");
});

test("onayla ile işe yarıyor", (t) => {
  t.plan(1);
  serverSocket.on("hi", (cb) => {
    cb("hola");
  });
  clientSocket.emit("hi", (arg) => {
    t.equal(arg, "hola");
  });
});

test("emitWithAck() ile işe yarıyor", async (t) => {
  t.plan(1);
  serverSocket.on("foo", (cb) => {
    cb("bar");
  });
  const result = await clientSocket.emitWithAck("foo");
  t.equal(result, "bar");
});

test("waitFor() ile işe yarıyor", async (t) => {
  t.plan(1);
  clientSocket.emit("baz");

  await waitFor(serverSocket, "baz");
  t.pass();
});

test.onFinish(() => {
  io.close();
  clientSocket.disconnect();
});
```

  


Referans: https://github.com/ljharb/tape



  
  


  

Kurulum:

```
npm install --save-dev vitest
```

Test seti:

```js title="test/basic.js"
const { beforeAll, afterAll, describe, it, expect } = require("vitest");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const ioc = require("socket.io-client");

function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("benim harika projem", () => {
  let io, serverSocket, clientSocket;

  beforeAll(() => {
    return new Promise((resolve) => {
      const httpServer = createServer();
      io = new Server(httpServer);
      httpServer.listen(() => {
        const port = httpServer.address().port;
        clientSocket = ioc(`http://localhost:${port}`);
        io.on("connection", (socket) => {
          serverSocket = socket;
        });
        clientSocket.on("connect", resolve);
      });
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });

  it("çalışmalı", () => {
    return new Promise((resolve) => {
      clientSocket.on("hello", (arg) => {
        expect(arg).toEqual("world");
        resolve();
      });
      serverSocket.emit("hello", "world");
    });
  });

  it("onayla ile çalışmalı", () => {
    return new Promise((resolve) => {
      serverSocket.on("hi", (cb) => {
        cb("hola");
      });
      clientSocket.emit("hi", (arg) => {
        expect(arg).toEqual("hola");
        resolve();
      });
    });
  });

  it("emitWithAck() ile çalışmalı", async () => {
    serverSocket.on("foo", (cb) => {
      cb("bar");
    });
    const result = await clientSocket.emitWithAck("foo");
    expect(result).toEqual("bar");
  });

  it("waitFor() ile çalışmalı", () => {
    clientSocket.emit("baz");

    return waitFor(serverSocket, "baz");
  });
});
```

  
  

Kurulum:

```
npm install --save-dev vitest
```

Test seti:

```js title="test/basic.js"
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { createServer } from "node:http";
import { io as ioc } from "socket.io-client";
import { Server } from "socket.io";

function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("benim harika projem", () => {
  let io, serverSocket, clientSocket;

  beforeAll(() => {
    return new Promise((resolve) => {
      const httpServer = createServer();
      io = new Server(httpServer);
      httpServer.listen(() => {
        const port = httpServer.address().port;
        clientSocket = ioc(`http://localhost:${port}`);
        io.on("connection", (socket) => {
          serverSocket = socket;
        });
        clientSocket.on("connect", resolve);
      });
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });

  it("çalışmalı", () => {
    return new Promise((resolve) => {
      clientSocket.on("hello", (arg) => {
        expect(arg).toEqual("world");
        resolve();
      });
      serverSocket.emit("hello", "world");
    });
  });

  it("onayla ile çalışmalı", () => {
    return new Promise((resolve) => {
      serverSocket.on("hi", (cb) => {
        cb("hola");
      });
      clientSocket.emit("hi", (arg) => {
        expect(arg).toEqual("hola");
        resolve();
      });
    });
  });

  it("emitWithAck() ile çalışmalı", async () => {
    serverSocket.on("foo", (cb) => {
      cb("bar");
    });
    const result = await clientSocket.emitWithAck("foo");
    expect(result).toEqual("bar");
  });

  it("waitFor() ile çalışmalı", () => {
    clientSocket.emit("baz");

    return waitFor(serverSocket, "baz");
  });
});
```

  
  

Kurulum:

```
npm install --save-dev vitest
```

Test seti:
```ts title="test/basic.ts"
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("benim harika projem", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });

  it("çalışmalı", (done) => {
    clientSocket.on("hello", (arg) => {
      expect(arg).toEqual("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  it("onayla ile çalışmalı", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      expect(arg).toEqual("hola");
      done();
    });
  });

  it("emitWithAck() ile çalışmalı", async () => {
    serverSocket.on("foo", (cb) => {
      cb("bar");
    });
    const result = await clientSocket.emitWithAck("foo");
    expect(result).toEqual("bar");
  });

  it("waitFor() ile çalışmalı", async () => {
    clientSocket.emit("baz");

    await waitFor(serverSocket, "baz");
  });
});
```

  


Referans: https://vitest.dev/