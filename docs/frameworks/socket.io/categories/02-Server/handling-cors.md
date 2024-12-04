---
title: CORS Yönetimi
seoTitle: CORS Yönetimi - Socket.IO Rehberi
sidebar_position: 8
description: Socket.IO ile CORS yönetimi hakkında gerekli bilgiler ve örnekler. CORS yapılandırmasını nasıl etkinleştireceğinizi öğrenin.
tags: 
  - CORS
  - Socket.IO
  - Web Geliştirme
  - HTTP Başlıkları
keywords: 
  - CORS
  - Socket.IO
  - Web Geliştirme
  - HTTP Başlıkları
---
## Yapılandırma

Socket.IO v3'ten itibaren, [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) (CORS) özelliğini açıkça etkinleştirmeniz gerekmektedir.

```js
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://example.com"
  }
});
```

Tüm seçenekler [cors](https://www.npmjs.com/package/cors) paketine iletilecektir. Seçeneklerin tam listesi [burada](https://github.com/expressjs/cors#configuration-options) bulunabilir.

:::tip
Çerezlerle [(withCredentials)](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials) ve ek başlıklarla çalışırken dikkatli olun.
:::

### Örnek

```js
// sunucu tarafında
const io = new Server(httpServer, {
  cors: {
    origin: "https://example.com",
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

// istemci tarafında
import { io } from "socket.io-client";
const socket = io("https://api.example.com", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});
```

Not: Bu durum, web uygulamanız ve sunucunuz aynı porttan sunulmadığında localhost için de geçerlidir.

```js
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080"
  }
});

httpServer.listen(3000);
```

Tüm çapraz kaynak isteklerini `allowRequest` seçeneği ile engelleyebilirsiniz:

```js
const io = new Server(httpServer, {
  allowRequest: (req, callback) => {
    const noOriginHeader = req.headers.origin === undefined;
    callback(null, noOriginHeader); // sadece 'origin' başlığı olmayan istekleri kabul et
  }
});
```

## Sorun Giderme

### CORS başlığı ‘Access-Control-Allow-Origin’ eksik

Tam hata mesajı:

> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at .../socket.io/?EIO=4&transport=polling&t=NMnp2WI. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing).

Eğer sunucunuzu düzgün bir şekilde yapılandırdıysanız (bkz. `yukarıda`), bu durum tarayıcınızın Socket.IO sunucusuna ulaşılamadığını gösterebilir.

Aşağıdaki komut:

```
curl "https://api.example.com/socket.io/?EIO=4&transport=polling"
```

şu gibi bir şey döndürmelidir:

```
0{"sid":"Lbo5JLzTotvW3g2LAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000}
```

Eğer durum böyle değilse, lütfen sunucunuzun dinlediğinden ve verilen portta gerçekten erişilebilir olduğundan emin olun.

### CORS başlığı ‘Access-Control-Allow-Origin’ ‘*’ ise kimlik doğrulaması desteklenmez

Tam hata mesajı:

> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at ‘.../socket.io/?EIO=4&transport=polling&t=NvQfU77’. (Reason: Credential is not supported if the CORS header ‘Access-Control-Allow-Origin’ is ‘*’)

`withCredentials` değerini `true` olarak ayarlayamazsınız; `origin: *` ile birlikte çalıştırmak için belirli bir origin kullanmalısınız:

```js
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://my-frontend.com",
    // ya da bir dizi origin ile
    // origin: ["https://my-frontend.com", "https://my-other-frontend.com", "http://localhost:3000"],
    credentials: true
  }
});
```

### CORS başlığı ‘Access-Control-Allow-Credentials’ için ‘true’ bekleniyor

Tam hata mesajı:

> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at .../socket.io/?EIO=4&transport=polling&t=NvQny19. (Reason: expected ‘true’ in CORS header ‘Access-Control-Allow-Credentials’)

Bu durumda, istemcide `withCredentials` `true` olarak ayarlanmış, ancak sunucuda `cors` seçeneğinde `credentials` özelliği eksik. Yukarıdaki örneğe bakın.