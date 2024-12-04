---
title: Ad Alanları
seoTitle: Ad Alanları - Uygulama Mimarisi
sidebar_position: 1
description: Bir Ad Alanı, uygulamanızın mantığını tek bir paylaşılan bağlantı üzerinden bölmenize olanak tanıyan bir iletişim kanalıdır. Bu kılavuz, ad alanlarının yapılandırılmasını ve kullanım senaryolarını kapsamaktadır.
tags: 
  - ad alanı
  - socket.io
  - middleware
  - olay işleme
keywords: 
  - ad alanı
  - socket.io
  - olay
  - middleware
---

Bir Ad Alanı, uygulamanızın mantığını tek bir paylaşılan bağlantı üzerinden bölmenize olanak tanıyan bir iletişim kanalıdır (aynı zamanda "multiplexing" olarak da adlandırılır).

![](../../../images/frameworks/socket.io/static/images/namespaces.png)

## Giriş

Her ad alanının kendine ait:

- `olay işleyicileri`

```js
io.of("/orders").on("connection", (socket) => {
  socket.on("order:list", () => {});
  socket.on("order:create", () => {});
});

io.of("/users").on("connection", (socket) => {
  socket.on("user:list", () => {});
});
```

- `odalar`

```js
const orderNamespace = io.of("/orders");

orderNamespace.on("connection", (socket) => {
  socket.join("room1");
  orderNamespace.to("room1").emit("hello");
});

const userNamespace = io.of("/users");

userNamespace.on("connection", (socket) => {
  socket.join("room1"); // "orders" ad alanındaki odadan ayrıdır
  userNamespace.to("room1").emit("holà");
});
```

- `middleware'ler`

```js
const orderNamespace = io.of("/orders");

orderNamespace.use((socket, next) => {
  // soketin "orders" ad alanına erişimi olduğundan emin olun ve sonra
  next();
});

const userNamespace = io.of("/users");

userNamespace.use((socket, next) => {
  // soketin "users" ad alanına erişimi olduğundan emin olun ve sonra
  next();
});
```

:::tip
Olası kullanım senaryoları:
- Özel bir ad alanı oluşturmak istiyorsanız, yalnızca yetkili kullanıcıların bu alana erişmesi için o kullanıcılarla ilgili mantığı, uygulamanın geri kalanından ayırabilirsiniz.
:::

```js
const adminNamespace = io.of("/admin");

adminNamespace.use((socket, next) => {
  // kullanıcının yeterli haklara sahip olduğundan emin olun
  next();
});

adminNamespace.on("connection", socket => {
  socket.on("delete user", () => {
    // ...
  });
});
```

- Uygulamanızın birden fazla kiracısı varsa, her kiracı için dinamik olarak bir ad alanı oluşturmak isteyebilirsiniz.

```js
const workspaces = io.of(/^\/\w+$/);

workspaces.on("connection", socket => {
  const workspace = socket.nsp;

  workspace.emit("hello");
});
```

## Ana Ad Alanı

Şu ana kadar, ana ad alanı olan `/` ile etkileşime geçtiniz. `io` örneği, tüm yöntemlerini devralır:

```js
io.on("connection", (socket) => {});
io.use((socket, next) => { next() });
io.emit("hello");
// aslında eşdeğerdir
io.of("/").on("connection", (socket) => {});
io.of("/").use((socket, next) => { next() });
io.of("/").emit("hello");
```

Bazı eğitimler ayrıca `io.sockets`'dan da bahsedebilir; bu, sadece `io.of("/")` için bir takma addır.

```js
io.sockets === io.of("/")
```

## Özelleştirilmiş Ad Alanları

Özelleştirilmiş bir ad alanı kurmak için, sunucu tarafında `of` işlevini çağırabilirsiniz:

```js
const nsp = io.of("/my-namespace");

nsp.on("connection", socket => {
  console.log("birisi bağlandı");
});

nsp.emit("hi", "herkese!");
```

## İstemci Başlatma

Aynı köken sürümü:

```js
const socket = io(); // veya io("/"), ana ad alanı
const orderSocket = io("/orders"); // "orders" ad alanı
const userSocket = io("/users"); // "users" ad alanı
```

Farklı köken/Node.js sürümü:

```js
const socket = io("https://example.com"); // veya io("https://example.com/"), ana ad alanı
const orderSocket = io("https://example.com/orders"); // "orders" ad alanı
const userSocket = io("https://example.com/users"); // "users" ad alanı
```

Yukarıdaki örnekte yalnızca bir WebSocket bağlantısı kurulacak ve paketler otomatik olarak doğru ad alanına yönlendirilecektir.

:::note
Lütfen multiplexing'in aşağıdaki durumlarda devre dışı bırakılacağını unutmayın:
- Aynı ad alanı için birden fazla sahip olma
```js
const socket1 = io();
const socket2 = io(); // multiplexing yok, iki ayrı WebSocket bağlantısı
```

- Farklı alanlar
```js
const socket1 = io("https://first.example.com");
const socket2 = io("https://second.example.com"); // multiplexing yok, iki ayrı WebSocket bağlantısı
```

- `forceNew` seçeneğinin kullanımı
```js
const socket1 = io();
const socket2 = io("/admin", { forceNew: true }); // multiplexing yok, iki ayrı WebSocket bağlantısı
```
:::

## Dinamik Ad Alanları

Ayrıca, bir düzenli ifade ile ya da bir fonksiyon ile dinamik olarak ad alanları oluşturmaya da olanak tanır:

```js
io.of(/^\/dynamic-\d+$/);
```

veya bir fonksiyon ile:

```js
io.of((name, auth, next) => {
  next(null, true); // veya false, kreasyon reddedildiğinde
});
```

Yeni ad alanına `connection` olayında erişiminiz vardır:

```js
io.of(/^\/dynamic-\d+$/).on("connection", (socket) => {
  const namespace = socket.nsp;
});
```

`of()` yönteminin döndürülen değeri, üst ad alanı olarak adlandırdığımız şeydir; buradan:

- `middleware'ler` kaydedebilirsiniz

```js
const parentNamespace = io.of(/^\/dynamic-\d+$/);

parentNamespace.use((socket, next) => { next() });
```

Middleware, her bir çocuk ad alanında otomatik olarak kaydedilecektir.

- `broadcast` olayları

```js
const parentNamespace = io.of(/^\/dynamic-\d+$/);

parentNamespace.emit("hello"); // /dynamic-1, /dynamic-2, ... kullanıcılarına gönderilecektir
```

:::warning
Mevcut ad alanları, dinamik ad alanlarına öncelik verir. Örneğin:
```js
// "dynamic-101" ad alanını kaydedin
io.of("/dynamic-101");

io.of(/^\/dynamic-\d+$/).on("connection", (socket) => {
  // "dynamic-101" ad alanındaki bağlantı için çağrılmayacaktır
});
```
:::

## Tam API

Namespace örneği tarafından sunulan tam API `burada` bulunabilir.