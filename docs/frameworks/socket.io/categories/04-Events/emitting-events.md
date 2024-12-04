---
title: Olayların Yayılması
seoTitle: Olayların Yayılması - Socket.IO
sidebar_position: 1
description: Sunucu ile istemci arasında olay göndermenin yollarını keşfedin. Socket.IOnun etkinlik yayıcı yapısına dair bilgiler edinin.
tags: 
  - Socket.IO
  - Olaylar
  - İstemci
  - Sunucu
  - Node.js
keywords: 
  - olaylar
  - Socket.IO
  - istemci
  - sunucu
  - Node.js
---
Sunucu ile istemci arasında olay göndermenin birkaç yolu vardır.

:::tip
TypeScript kullanıcıları için olaylar için tip ipuçları sağlamak mümkündür. Lütfen `bunu` kontrol edin.
:::

## Temel Yayma

Socket.IO API'si Node.js [EventEmitter](https://nodejs.org/docs/latest/api/events.html#events_events) ilham alınarak tasarlanmıştır. Yani, bir tarafta olayları yayabilir ve diğer tarafta dinleyicileri kaydedebilirsiniz:

### Sunucu

```js
io.on("connection", (socket) => {
  socket.emit("hello", "world");
});
```

### İstemci

```js
socket.on("hello", (arg) => {
  console.log(arg); // world
});
```

Bu, diğer yönde de çalışır:

### Sunucu

```js
io.on("connection", (socket) => {
  socket.on("hello", (arg) => {
    console.log(arg); // world
  });
});
```

### İstemci

```js
socket.emit("hello", "world");
```

İstediğiniz kadar argüman gönderebilir ve tüm seri hale getirilebilir veri yapıları desteklenmektedir. Bunlara [Buffer](https://nodejs.org/docs/latest/api/buffer.html#buffer_buffer) veya [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) gibi ikili nesneler de dahildir.

### Sunucu

```js
io.on("connection", (socket) => {
  socket.emit("hello", 1, "2", { 3: '4', 5: Buffer.from([6]) });
});
```

### İstemci

```js
// istemci tarafı
socket.on("hello", (arg1, arg2, arg3) => {
  console.log(arg1); // 1
  console.log(arg2); // "2"
  console.log(arg3); // { 3: '4', 5: ArrayBuffer (1) [ 6 ] }
});
```

Nesneleri `JSON.stringify()` ile çalıştırmanıza gerek yoktur, bu sizin için yapılacaktır.

### Kötü Örnek

```js
// KÖTÜ
socket.emit("hello", JSON.stringify({ name: "John" }));
```

### İyi Örnek

```js
// İYİ
socket.emit("hello", { name: "John" });
```

Notlar:

- [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) nesneleri, string temsiline dönüştürülecek (ve bu şekilde alınacaktır), örneğin `1970-01-01T00:00:00.000Z`
- [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) ve [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) elle seri hale getirilmelidir:

```js
const serializedMap = [...myMap.entries()];
const serializedSet = [...mySet.keys()];
```

- Bir nesnenin seri hale getirilmesini özelleştirmek için [`toJSON()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior) yöntemini kullanabilirsiniz.

Bir sınıf örneği:

```js
class Hero {
  #hp;

  constructor() {
    this.#hp = 42;
  }

  toJSON() {
    return { hp: this.#hp };
  }
}

socket.emit("here's a hero", new Hero());
```

## Tanıma

Olaylar harika, ancak bazı durumlarda daha klasik bir istek-cevap API'sı istersiniz. Socket.IO'da bu özellik tanıma olarak adlandırılır.

`emit()`'in son argümanı olarak bir geri çağırma ekleyebilirsiniz ve bu geri çağırma, diğer taraf olayın tanındığında çağrılacaktır:

### Sunucu

```js
io.on("connection", (socket) => {
  socket.on("update item", (arg1, arg2, callback) => {
    console.log(arg1); // 1
    console.log(arg2); // { name: "updated" }
    callback({
      status: "ok"
    });
  });
});
```

### İstemci

```js
socket.emit("update item", "1", { name: "updated" }, (response) => {
  console.log(response.status); // ok
});
```

## Zaman Aşımı ile

Socket.IO v4.4.0 ile başlayarak, her yayma için bir zaman aşımı atayabilirsiniz:

```js
socket.timeout(5000).emit("my-event", (err) => {
  if (err) {
    // diğer taraf belirlenen gecikmede olayı tanımadı
  }
});
```

Bir zaman aşımını ve bir `tanımayı` da kullanabilirsiniz:

```js
socket.timeout(5000).emit("my-event", (err, response) => {
  if (err) {
    // diğer taraf belirlenen gecikmede olayı tanımadı
  } else {
    console.log(response);
  }
});
```

## Volatil Olaylar

Volatil olaylar, alt bağlantı hazır değilse gönderilmeyecek olaylardır (güvenilirlik açısından [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol) gibi).

Örneğin, çevrimiçi bir oyundaki karakterlerin pozisyonunu göndermeniz gerektiğinde bu ilgi çekici olabilir (çünkü yalnızca en son değerler yararlıdır).

```js
socket.volatile.emit("hello", "might or might not be received");
```

Bir diğer kullanım durumu, istemci bağlanmadığında olayları atlamaktır (varsayılan olarak, olaylar yeniden bağlanana kadar tamponlanır).

### Örnek

#### Sunucu

```js
io.on("connection", (socket) => {
  console.log("connect");

  socket.on("ping", (count) => {
    console.log(count);
  });
});
```

#### İstemci

```js
let count = 0;
setInterval(() => {
  socket.volatile.emit("ping", ++count);
}, 1000);
```

Sunucuyu yeniden başlattığınızda, konsolda aşağıdakileri göreceksiniz:

```
connect
1
2
3
4
## sunucu yeniden başlatılıyor, istemci otomatik olarak yeniden bağlanıyor
connect
9
10
11
```

`volatile` bayrağı olmadan, şu şekilde göreceksiniz:

```
connect
1
2
3
4
# sunucu yeniden başlatılıyor, istemci otomatik olarak yeniden bağlanıyor ve tamponlanmış olaylarını gönderiyor
connect
5
6
7
8
9
10
11
```