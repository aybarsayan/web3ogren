---
title: Olayları Dinleme
seoTitle: Olay Yönetimi için Detaylı Kılavuz
sidebar_position: 2
description: Sunucu ve istemci arasında iletilen olayların yönetimini ele alıyoruz. Bu kılavuz, Socket.IO ve EventEmitter yöntemleri hakkında ayrıntılı bilgiler içerir.
tags: 
  - olay yönetimi
  - Socket.IO
  - EventEmitter
  - JavaScript
keywords: 
  - olay dinleme
  - Socket.IO
  - Node.js
  - web geliştirme
---
Sunucu ile istemci arasında iletilen olayları yönetmenin birkaç yolu vardır.

## EventEmitter yöntemleri

Sunucu tarafında, Socket örneği Node.js [EventEmitter](https://nodejs.org/docs/latest/api/events.html#events_events) sınıfını genişletir.

İstemci tarafında, Socket örneği [component-emitter](https://github.com/component/emitter) kütüphanesi tarafından sağlanan olay yayıcıyı kullanır ve bu, EventEmitter yöntemlerinin bir alt kümesini açığa çıkarır.

### socket.on(eventName, listener)

*eventName* adı verilen olay için dinleyiciler dizisinin sonuna *listener* işlevini ekler.

```js
socket.on("details", (...args) => {
  // ...
});
```

### socket.once(eventName, listener)

*eventName* adı verilen olay için **bir kereye mahsus** *listener* işlevini ekler.

```js
socket.once("details", (...args) => {
  // ...
});
```

### socket.off(eventName, listener)

Belirtilen *listener*’ı *eventName* adı verilen olay için dinleyici dizisinden kaldırır.

```js
const listener = (...args) => {
  console.log(args);
}

socket.on("details", listener);

// ve daha sonra...
socket.off("details", listener);
```

### socket.removeAllListeners([eventName])

Tüm dinleyicileri veya belirtilen *eventName* olanların hepsini kaldırır.

```js
// belirli bir olay için
socket.removeAllListeners("details");
// tüm olaylar için
socket.removeAllListeners();
```

## Catch-all dinleyiciler

Socket.IO v3'ten itibaren, [EventEmitter2](https://github.com/EventEmitter2/EventEmitter2) kütüphanesinden ilham alınarak yeni bir API, catch-all dinleyiciler tanımlamak için kullanılabilir.

Bu özellik hem istemci hem de sunucu üzerinde mevcuttur.

### socket.onAny(listener)

Herhangi bir olay yayıldığında tetiklenecek bir dinleyici ekler.

```js
socket.onAny((eventName, ...args) => {
  // ...
});
```

:::caution
`Onaylar` catch-all dinleyici tarafından yakalanmaz.

```js
socket.emit("foo", (value) => {
  // ...
});

socket.onAnyOutgoing(() => {
  // olay gönderildiğinde tetiklenir
});

socket.onAny(() => {
  // onay alındığında tetiklenmez
});
```
:::

### socket.prependAny(listener)

Herhangi bir olay yayıldığında tetiklenecek bir dinleyici ekler. Dinleyici, dinleyiciler dizisinin başına eklenir.

```js
socket.prependAny((eventName, ...args) => {
  // ...
});
```

### socket.offAny([listener])

Tüm catch-all dinleyicileri veya sağlanan dinleyiciyi kaldırır.

```js
const listener = (eventName, ...args) => {
  console.log(eventName, args);
}

socket.onAny(listener);

// ve daha sonra...
socket.offAny(listener);

// veya tüm dinleyiciler
socket.offAny();
```

### socket.onAnyOutgoing(listener)

Çıkan paketler için yeni bir catch-all dinleyici kaydeder.

```js
socket.onAnyOutgoing((event, ...args) => {
  // ...
});
```

:::caution
`Onaylar` catch-all dinleyici tarafından yakalanmaz.

```js
socket.on("foo", (value, callback) => {
  callback("OK");
});

socket.onAny(() => {
  // olay alındığında tetiklenir
});

socket.onAnyOutgoing(() => {
  // onay gönderildiğinde tetiklenmez
});
```
:::

### socket.prependAnyOutgoing(listener)

Çıkan paketler için yeni bir catch-all dinleyici kaydeder. Dinleyici, dinleyiciler dizisinin başına eklenir.

```js
socket.prependAnyOutgoing((event, ...args) => {
  // ...
});
```

### socket.offAnyOutgoing([listener])

Daha önce kaydedilmiş dinleyiciyi kaldırır. Hiçbir dinleyici sağlanmazsa, tüm catch-all dinleyicileri kaldırılır.

```js
const listener = (eventName, ...args) => {
  console.log(eventName, args);
}

socket.onAnyOutgoing(listener);

// tek bir dinleyiciyi kaldır
socket.offAnyOutgoing(listener);

// tüm dinleyicileri kaldır
socket.offAnyOutgoing();
```

## Doğrulama

Olay argümanlarının doğrulanması, Socket.IO kütüphanesinin kapsamı dışındadır.

Bu kullanım durumunu kapsayan birçok paket bulunmaktadır; bunlar arasında:

- [zod](https://zod.dev/)
- [joi](https://www.npmjs.com/package/joi)
- [ajv](https://www.npmjs.com/package/ajv)
- [validatorjs](https://www.npmjs.com/package/validatorjs)

`Onaylar` ile birlikte [joi](https://joi.dev/api/) örneği:

```js
const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().max(30).required(),
  email: Joi.string().email().required()
});

io.on("connection", (socket) => {
  socket.on("create user", (payload, callback) => {
    if (typeof callback !== "function") {
      // bir onay değil
      return socket.disconnect();
    }
    const { error, value } = userSchema.validate(payload);
    if (error) {
      return callback({
        status: "Bad Request",
        error
      });
    }
    // değer ile bir şey yap, ve sonra
    callback({
      status: "OK"
    });
  });
});
```

## Hata yönetimi

Socket.IO kütüphanesinde yerleşik hata yönetimi mevcut değildir; bu, dinleyicide oluşabilecek herhangi bir hatayı yakalamanız gerektiği anlamına gelir.

```js
io.on("connection", (socket) => {
  socket.on("list items", async (callback) => {
    try {
      const items = await findItems();
      callback({
        status: "OK",
        items
      });
    } catch (e) {
      callback({
        status: "NOK"
      });
    }
  });
});
```

Bu şu şekilde yeniden yapılandırılabilir:

```js
const errorHandler = (handler) => {
  const handleError = (err) => {
    console.error("lütfen beni yönet", err);
  };

  return (...args) => {
    try {
      const ret = handler.apply(this, args);
      if (ret && typeof ret.catch === "function") {
        // asenkron işleyici
        ret.catch(handleError);
      }
    } catch (e) {
      // senkron işleyici
      handleError(e);
    }
  };
};

// sunucu veya istemci tarafında
socket.on("hello", errorHandler(() => {
  throw new Error("panik yapalım");
}));