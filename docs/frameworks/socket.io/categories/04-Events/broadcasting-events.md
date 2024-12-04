---
title: Yayınlama Olayları
seoTitle: Socket.IO Yayınlama Olayları
sidebar_position: 3
description: Socket.IO ile bağlı istemcilere olay göndermenin yollarını keşfedin. Bu belgede farklı yayınlama yöntemleri ve onay süreçleri hakkında bilgi bulabilirsiniz.
tags: 
  - Socket.IO
  - yayınlama
  - istemci
  - olay
keywords: 
  - Socket.IO
  - yayınlama
  - istemci
  - olay
---

Socket.IO, tüm bağlı istemcilere olay göndermeyi kolaylaştırır.

:::info
Lütfen, yayınlamanın **sunucuya özel** bir özellik olduğunu unutmayın.
:::

## Tüm bağlı istemcilere



```js
io.emit("hello", "world");
```

:::caution
Şu anda bağlantısı kesilmiş (veya yeniden bağlanma sürecinde) istemciler olayı alamayacaktır. Bu olayı bir yere (örneğin, bir veritabanında) saklamak sizin kullanım durumunuza bağlıdır.
:::

## Gönderen hariç tüm bağlı istemcilere



```js
io.on("connection", (socket) => {
  socket.broadcast.emit("hello", "world");
});
```

:::note
Yukarıdaki örnekte, `socket.emit("hello", "world")` ( `broadcast` bayrağı olmadan) olayı "istemci A"ya gönderecektir. Bir olayı göndermenin tüm yollarının listesini `cheatsheet` içerisinde bulabilirsiniz.
:::

## Onaylarla birlikte

Socket.IO 4.5.0 itibarıyla, artık bir olayı birden fazla istemciye yayınlayabilir ve her birinden bir onay bekleyebilirsiniz:

```js
io.timeout(5000).emit("hello", "world", (err, responses) => {
  if (err) {
    // bazı istemciler belirtilen sürede olayı onaylamadı
  } else {
    console.log(responses); // her istemci için bir yanıt
  }
});
```

Tüm yayınlama biçimleri desteklenmektedir:

- bir odada

```js
io.to("room123").timeout(5000).emit("hello", "world", (err, responses) => {
  // ...
});
```

- belirli bir `socket`'tan

```js
socket.broadcast.timeout(5000).emit("hello", "world", (err, responses) => {
  // ...
});
```

- bir isim alanında

```js
io.of("/the-namespace").timeout(5000).emit("hello", "world", (err, responses) => {
  // ...
});
```

## Birden fazla Socket.IO sunucusu ile

Yayınlama, birden fazla Socket.IO sunucusu ile de çalışır. Varsayılan adaptörü `Redis Adaptörü` veya başka bir `uyumlu adaptör` ile değiştirmeniz yeterlidir.



Belli durumlarda, yalnızca mevcut sunucuya bağlı istemcilere yayın yapmak isteyebilirsiniz. Bunu `local` bayrağı ile gerçekleştirebilirsiniz:

```js
io.local.emit("hello", "world");
```



Yayınlama sırasında belirli istemcileri hedeflemek için lütfen `Odalar` hakkındaki belgelere bakın.