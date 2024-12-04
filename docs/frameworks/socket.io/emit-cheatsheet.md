---
title: Emit kılavuzu
seoTitle: Emit Guide
sidebar_position: 1
description: Bu kılavuz, socket.ionun emit işlevselliğini ayrıntılı bir şekilde açıklar. Sunucu ve istemci tarafında nasıl kullanılacağını anlayabilirsiniz.
tags: 
  - socket.io
  - emit
  - sunucu
  - istemci
  - JavaScript
keywords: 
  - socket.io
  - emit
  - sunucu
  - istemci
  - JavaScript
---



:::caution

Aşağıdaki olay adları rezerve edilmiştir ve uygulamanızda kullanılmamalıdır:

- `connect`
- `connect_error`
- `disconnect`
- `disconnecting`
- `newListener`
- `removeListener`

```js
// Kötü, hata verecek
socket.emit("disconnecting");
```

:::

## Sunucu

### Tek istemci

#### Temel emit

```js
io.on("connection", (socket) => {
  socket.emit("hello", 1, "2", { 3: "4", 5: Buffer.from([6]) });
});
```

#### Onay


  

```js
io.on("connection", (socket) => {
  socket.emit("hello", "world", (arg1, arg2, arg3) => {
    // ...
  });
});
```

  
  

```js
io.on("connection", async (socket) => {
  const response = await socket.emitWithAck("hello", "world");
});
```

  


#### Onay ve zaman aşımı


  

```js
io.on("connection", (socket) => {
  socket.timeout(5000).emit("hello", "world", (err, arg1, arg2, arg3) => {
    if (err) {
      // istemci belirlenen gecikme süresinde olayı onaylamadı
    } else {
      // ...
    }
  });
});
```

  
  

```js
io.on("connection", async (socket) => {
  try {
    const response = await socket.timeout(5000).emitWithAck("hello", "world");
  } catch (e) {
    // istemci belirlenen gecikme süresinde olayı onaylamadı
  }
});
```

  


### Yayınlama

#### Tüm bağlı istemcilere

```js
io.emit("hello");
```

#### Gönderen hariç

```js
io.on("connection", (socket) => {
  socket.broadcast.emit("hello");
});
```

#### Onaylar


  

```js
io.timeout(5000).emit("hello", "world", (err, responses) => {
  if (err) {
    // bazı istemciler belirlenen gecikme süresinde olayı onaylamadı
  } else {
    console.log(responses); // her istemci için bir yanıt
  }
});
```

  
  

```js
try {
  const responses = await io.timeout(5000).emitWithAck("hello", "world");
  console.log(responses); // her istemci için bir yanıt
} catch (e) {
  // bazı istemciler belirlenen gecikme süresinde olayı onaylamadı
}
```

  


#### Bir odada

- "my room" adlı odadaki tüm bağlı istemcilere

```js
io.to("my room").emit("hello");
```

- "my room" adlı odada olmayan tüm bağlı istemcilere

```js
io.except("my room").emit("hello");
```

- birden fazla koşul ile

```js
io.to("room1").to(["room2", "room3"]).except("room4").emit("hello");
```

#### Bir ad alanında

```js
io.of("/my-namespace").emit("hello");
```

:::tip

Modifiye ediciler kesinlikle birbirine zincirlenebilir:

```js
io.of("/my-namespace").on("connection", (socket) => {
  socket
    .timeout(5000)
    .to("room1")
    .to(["room2", "room3"])
    .except("room4")
    .emit("hello", (err, responses) => {
      // ...
    });
});
```

Bu, şu anda bağlı olan tüm istemcilere "hello" olayını yayınlar:

- `my-namespace` adlı ad alanında
- `room1`, `room2` ve `room3` adlı odalardan en az birinde, ancak `room4`'te değil
- gönderen hariç

Ve önümüzdeki 5 saniye içinde bir onay bekler.

:::

### Sunucular arasında

#### Temel emit

```js
io.serverSideEmit("hello", "world");
```

Alıcı taraf:

```js
io.on("hello", (value) => {
  console.log(value); // "world"
});
```

#### Onaylar


  

```js
io.serverSideEmit("hello", "world", (err, responses) => {
  if (err) {
    // bazı sunucular belirlenen gecikme süresinde olayı onaylamadı
  } else {
    console.log(responses); // mevcut olan dışında her sunucu için bir yanıt
  }
});
```

  
  

```js
try {
  const responses = await io.serverSideEmitWithAck("hello", "world");
  console.log(responses); // mevcut olan dışında her sunucu için bir yanıt
} catch (e) {
  // bazı sunucular belirlenen gecikme süresinde olayı onaylamadı
}
```

  


Alıcı taraf:

```js
io.on("hello", (value, callback) => {
  console.log(value); // "world"
  callback("hi");
});
```

## İstemci

### Temel emit

```js
socket.emit("hello", 1, "2", { 3: "4", 5: Uint8Array.from([6]) });
```

### Onay


  

```js
socket.emit("hello", "world", (arg1, arg2, arg3) => {
  // ...
});
```

  
  

```js
const response = await socket.emitWithAck("hello", "world");
```

  


### Onay ve zaman aşımı


  

```js
socket.timeout(5000).emit("hello", "world", (err, arg1, arg2, arg3) => {
  if (err) {
    // sunucu belirlenen gecikme süresinde olayı onaylamadı
  } else {
    // ...
  }
});
```

  
  

```js
try {
  const response = await socket.timeout(5000).emitWithAck("hello", "world");
} catch (e) {
  // sunucu belirlenen gecikme süresinde olayı onaylamadı
}
```