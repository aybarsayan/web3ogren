---
title: İstemci Başlatma
seoTitle: Socket.IO İstemci Başlatma
sidebar_position: 2
description: Socket.IO istemci kütüphanesini başlatma adımlarını içeren kapsamlı bir kılavuz. Bu belgede, istemci oluşturma süreci ve alan adları ile bağlantı konuları ele alınmaktadır.
tags: 
  - istemci
  - Socket.IO
  - programlama
  - JavaScript
  - TypeScript
keywords: 
  - istemci başlatma
  - Socket.IO
  - JavaScript
  - TypeScript
  - CORS
---



Socket.IO istemci kütüphanesini `kurduktan` sonra, istemciyi başlatabilirsiniz. Tüm seçeneklerin tam listesine `buradan` ulaşabilirsiniz.

:::tip
TypeScript kullanıcıları için, olaylar için tür ipuçları sağlamak mümkündür. Lütfen `bunu` kontrol edin.
:::

Aşağıdaki örneklerde, `io` nesnesi ya:

- `` import'undan gelir

```html
<script src="/socket.io/socket.io.js"></script>
```

- bir ESM import'undan gelir

```html
<script type="module">
  import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
</script>
```

- NPM'den gelir


  

```js
const { io } = require("socket.io-client");
```

  
  

```js
import { io } from "socket.io-client";
```

  
  

```ts
import { io } from "socket.io-client";
```

  


## Aynı alan adından

Eğer ön yüzünüz sunucunuzla aynı alan adından sunuluyorsa, basitçe şunu kullanabilirsiniz:

```js
const socket = io();
```

Sunucu URL'si [window.location](https://developer.mozilla.org/en-US/docs/Web/API/Window/location) nesnesinden çıkarılacaktır.

## Farklı bir alan adından

Eğer ön yüzünüz sunucunuzla aynı alan adından sunulmuyorsa, sunucunuzun URL'sini geçmeniz gerekmektedir.

```js
const socket = io("https://server-domain.com");
```

Bu durumda, lütfen sunucuda `Cross-Origin Resource Sharing (CORS)` özelliğini etkinleştirdiğinizden emin olun.

:::info
İsterseniz `https` veya `wss` (sırasıyla `http` veya `ws`) kullanabilirsiniz.
:::

```js
// aşağıdaki formlar benzerdir
const socket = io("https://server-domain.com");
const socket = io("wss://server-domain.com");
const socket = io("server-domain.com"); // yalnızca sayfa https üzerinden sunulduğunda tarayıcıda (Node.js'de çalışmayacaktır)
```

## Özel ad alanı

Yukarıdaki örneklerde, istemci ana ad alanına bağlanacaktır. Çoğu kullanım durumu için yalnızca ana ad alanını kullanmak yeterli olmalıdır, ancak ad alanını aşağıdaki gibi belirtebilirsiniz:

```js
// aynı kök alan versiyonu
const socket = io("/admin");
// çapraz kök alan versiyonu
const socket = io("https://server-domain.com/admin");
```

Ad alanları hakkında daha fazla bilgiyi `buradan` bulabilirsiniz.

## Seçenekler

Mevcut seçeneklerin tam listesine `buradan` ulaşabilirsiniz.