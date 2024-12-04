---
title: Müşteri Seçenekleri
seoTitle: Müşteri Seçenekleri - Socket.IO
sidebar_position: 2
description: Socket.IOda müşteri seçeneklerini ve ayarlarını keşfedin. WebSocket bağlantıları için düşük seviye motor ayarlarını öğrenin.
tags: 
  - Socket.IO
  - WebSocket
  - Müşteri
  - Ayarlar
keywords: 
  - müşteri seçenekleri
  - WebSocket ayarları
  - Socket.IO ayarları
---



## IO fabrika seçenekleri

### `forceNew`

Varsayılan değer: `false`

Yeni bir Manager örneği oluşturup oluşturmama.

Bir Manager örneği, sunucuya yapılan düşük seviyeli bağlantıdan sorumlu olup, yeniden bağlanma mantığını yönetir. Aşağıdaki örnek, birden fazla Socket örneği için aynı Manager örneğini yeniden kullanır:

```js
const socket = io("https://example.com"); // ana isim alanı
const productSocket = io("https://example.com/product"); // "ürün" isim alanı
const orderSocket = io("https://example.com/order"); // "sipariş" isim alanı
```

**Dikkat:** Tek bir Manager, birden fazla Socket örneğine bağlanabilir.

### `multiplex`

Varsayılan değer: `true`

`forceNew`'un zıttı: var olan bir Manager örneğini yeniden kullanıp kullanmama.

```js
const socket = io(); // 1. yöneticisi
const adminSocket = io("/admin", { multiplex: false }); // 2. yöneticisi
```

## Düşük seviye motor seçenekleri

:::info
Bu ayarlar, aynı Manager'a bağlı tüm Socket örnekleri tarafından paylaşılacaktır.
:::

### `addTrailingSlash`

*V4.6.0'da eklendi*

Varsayılan olarak eklenen son eğik çizgi artık devre dışı bırakılabilir:

```js
import { io } from "socket.io-client";

const socket = io("https://example.com", {
  addTrailingSlash: false
});
```

### `autoUnref`

*V4.0.0'da eklendi*

Varsayılan değer: `false`

`autoUnref` `true` olarak ayarlandığında, Socket.IO istemcisi, etkin bir zamanlayıcı yoksa programın çıkmasına izin verir:

```js
import { io } from "socket.io-client";

const socket = io({
  autoUnref: true
});
```

Yukarıdaki örnekte, istek URL'si `https://example.com/socket.io` olarak görülecektir.

### `closeOnBeforeunload`


Tarihçe

| Sürüm   | Değişiklikler                           |
|---------|------------------------------------------|
| v4.7.1  | Seçenek artık varsayılan olarak `false` olacak. |
| v4.1.0  | İlk uygulama.                           |



Varsayılan değer: `false`

Tarayıcıda [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event) olayı yayımlandığında bağlantıyı kapatma:

:::note
Bu davranış Firefox için geçerlidir. Diğer tarayıcılarda bu olay tetiklenmeyecektir.
:::

### `extraHeaders`

Ek başlıklar (sunucu tarafında `socket.handshake.headers` nesnesinde bulunur):

*Müsteri*

```js
import { io } from "socket.io-client";

const socket = io({
  extraHeaders: {
    "my-custom-header": "1234"
  }
});
```

:::caution
Tarayıcı ortamında, sadece WebSocket taşınımı etkinse `extraHeaders` seçeneği yok sayılacaktır.
:::

### `path`

Varsayılan değer: `/socket.io/`

Sunucu tarafında yakalanan yolun adıdır.

:::caution
Sunucu ve istemci değerleri eşleşmelidir.
:::

```js
import { io } from "socket.io-client";

const socket = io("https://example.com", {
  path: "/my-custom-path/"
});
```

### `transportOptions`

*V2.0.0'da eklendi*

Varsayılan değer: `{}`

Taşıma-özel seçenekler.

### `transports`

Varsayılan değer: `["polling", "websocket", "webtransport"]`

Socket.IO sunucusuna düşük seviyeli bağlantı sağlar.

### `upgrade`

Varsayılan değer: `true`

İstemcinin taşımanın güncellenmesini denemesi gerekip gerekmediğini belirtir.

## Yönetici seçenekleri

:::info
Bu ayarlar, aynı Manager'a bağlı tüm Socket örnekleri tarafından paylaşılacaktır.
:::

### `autoConnect`

Varsayılan değer: `true`

Oluşturulduğunda otomatik olarak bağlanıp bağlanmayacağını belirler.

```js
import { io } from "socket.io-client";

const socket = io({
  autoConnect: false
});

socket.connect();
```

### `parser`

*V2.2.0'da eklendi*

Varsayılan değer: `require("socket.io-parser")`

Paketleri işlemek için kullanılan ayrıştırıcı.