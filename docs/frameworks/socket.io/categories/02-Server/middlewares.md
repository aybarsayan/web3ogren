---
title: Ara Katmanlar
seoTitle: Ara Katmanlar ile Socket.IO Kullanımı
sidebar_position: 5
description: Ara katman fonksiyonları, her gelen bağlantı için yürütülen fonksiyonlardır. Bu bölümler, bu fonksiyonların nasıl kullanılacağını ve yönetileceğini açıklamaktadır.
tags: 
  - ara katman
  - socket.io
  - kimlik doğrulama
  - hata yönetimi
keywords: 
  - ara katman
  - socket.io
  - kimlik doğrulama
  - hata yönetimi
---
Bir ara katman fonksiyonu, her gelen bağlantı için yürütülen bir fonksiyondur.

Ara katman fonksiyonları, şunlar için faydalı olabilir:

- günlükleme
- kimlik doğrulama / yetkilendirme
- oran sınırlama

**Not:** Bu fonksiyon, bağlantı birden fazla HTTP isteğinden oluşsa bile, her bağlantı başına yalnızca bir kez yürütülecektir.

:::info
Eğer Express ara katmanlarını arıyorsanız, lütfen `bu bölüme` göz atın.
:::

## Bir ara katman kaydetme

Bir ara katman fonksiyonu, `Socket örneğine` ve bir sonraki kayıtlı ara katman fonksiyonuna erişime sahiptir.

```js
io.use((socket, next) => {
  if (isValid(socket.request)) {
    next();
  } else {
    next(new Error("geçersiz"));
  }
});
```

Birden fazla ara katman fonksiyonu kaydedebilirsiniz ve bunlar sıralı olarak yürütülecektir:

```js
io.use((socket, next) => {
  next();
});

io.use((socket, next) => {
  next(new Error("geçemeyeceksin"));
});

io.use((socket, next) => {
  // yürütülmez, çünkü önceki ara katman bir hata döndürmüştür
  next();
});
```

Her durumda `next()` çağrısını yaptığınızdan emin olun. Aksi takdirde, bağlantı, belirtilen bir zaman aşımından sonra kapatılana kadar beklemede kalacaktır.

**Önemli not:** Ara katman yürütüldüğünde Socket örneği aslında bağlı değildir, bu da bağlantı başarısız olursa `disconnect` olayının yayımlanmayacağı anlamına gelir.

**Örnek:** İstemci bağlantıyı manuel olarak kapatırsa:

```js
// sunucu tarafı
io.use((socket, next) => {
  setTimeout(() => {
    // istemci bağlantısı kesildikten sonra next çağrılır
    next();
  }, 1000);

  socket.on("disconnect", () => {
    // tetiklenmez
  });
});

io.on("connection", (socket) => {
  // tetiklenmez
});

// istemci tarafı
const socket = io();
setTimeout(() => {
  socket.disconnect();
}, 500);
```

## Kimlik bilgilerini gönderme

İstemci, `auth` seçeneği ile kimlik bilgilerini gönderebilir:

```js
// düz nesne
const socket = io({
  auth: {
    token: "abc"
  }
});

// veya bir fonksiyonla
const socket = io({
  auth: (cb) => {
    cb({
      token: "abc"
    });
  }
});
```

Bu kimlik bilgilerine, sunucu tarafında `handshake` nesnesinde erişilebilir:

```js
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // ...
});
```

## Ara katman hatasını yönetme

Eğer `next` metodu bir Hata nesnesi ile çağrılırsa, bağlantı reddedilir ve istemci `connect_error` olayı alır.

```js
// istemci tarafı
socket.on("connect_error", (err) => {
  console.log(err.message); // hataya bağlı mesajı yazdırır
});
```

Hata nesnesine ek ayrıntılar ekleyebilirsiniz:

```js
// sunucu tarafı
io.use((socket, next) => {
  const err = new Error("yetkisiz");
  err.data = { content: "Lütfen daha sonra tekrar deneyin" }; // ek ayrıntılar
  next(err);
});

// istemci tarafı
socket.on("connect_error", (err) => {
  console.log(err instanceof Error); // true
  console.log(err.message); // yetkisiz
  console.log(err.data); // { content: "Lütfen daha sonra tekrar deneyin" }
});
```

## Express ara katmanlarıyla uyumluluk

Socket.IO ara katmanları, genellikle bir HTTP istek/yanıt döngüsüne bağlı olmadıkları için, [Express ara katmanları](https://expressjs.com/en/guide/using-middleware.html) ile gerçekten uyumlu değildir.

Bununla birlikte, `4.6.0` sürümünden itibaren, Express ara katmanları artık alt motor tarafından desteklenmektedir:

```js
io.engine.use((req, res, next) => {
  // bir şey yap

  next();
});
```

Bu ara katmanlar, gelen her HTTP isteği için çağrılır, yükseltme istekleri de dahil.

[`express-session`](https://www.npmjs.com/package/express-session) ile bir örnek:

```js
import session from "express-session";

io.engine.use(session({
  secret: "klavye kedi",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
```

[`helmet`](https://www.npmjs.com/package/helmet) ile bir örnek:

```js
import helmet from "helmet";

io.engine.use(helmet());
```

Eğer ara katman yalnızca el sıkışma isteğine (her HTTP isteği için değil) uygulanması gerekiyorsa, `sid` sorgu parametresinin varlığını kontrol edebilirsiniz.

[`passport-jwt`](https://www.npmjs.com/package/passport-jwt) ile bir örnek:

```js
io.engine.use((req, res, next) => {
  const isHandshake = req._query.sid === undefined;
  if (isHandshake) {
    passport.authenticate("jwt", { session: false })(req, res, next);
  } else {
    next();
  }
});
```