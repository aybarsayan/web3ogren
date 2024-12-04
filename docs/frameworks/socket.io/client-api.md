---
title: İstemci APIsi
seoTitle: Socket.IO İstemci APIsi
sidebar_position: 1
description: Socket.IO istemci APIsinin detaylı bir incelemesi. İstemci bağlantısı, olaylar ve kullanımı hakkında bilgiler içerir.
tags: 
  - socket.io
  - istemci
  - websocket
  - api
keywords: 
  - socket.io
  - istemci
  - websocket
  - javascript
---

## IO

`io` yöntemi, bağımsız derlemede global alana bağlıdır:

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();
</script>
```

`4.3.0` sürümünden itibaren bir ESM paketi de mevcuttur:

```html
<script type="module">
  import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

  const socket = io();
</script>
```

Bir [import haritası](https://caniuse.com/import-maps) ile:

```html
<script type="importmap">
  {
    "imports": {
      "socket.io-client": "https://cdn.socket.io/4.8.1/socket.io.esm.min.js"
    }
  }
</script>

<script type="module">
  import { io } from "socket.io-client";

  const socket = io();
</script>
```

Aksi takdirde, diğer tüm durumlarda (bazı yapım araçlarıyla, Node.js veya React Native'de), `socket.io-client` paketinden içe aktarılabilir:

```js
// ES modülleri
import { io } from "socket.io-client";

// CommonJS
const { io } = require("socket.io-client");
```

### io.protocol

* [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type)

Protokol revizyon numarası (şu anda: 5).

Protokol, istemci ile sunucu arasında değiştirilen paketlerin formatını tanımlar. Hem istemcinin hem de sunucunun birbirlerini anlaması için aynı revizyonu kullanması gerekir.

Daha fazla bilgiyi [burada](https://github.com/socketio/socket.io-protocol) bulabilirsiniz.

### io([url][, options])

- `url` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#string_type) (varsayılan olarak `window.location.host`)
- `options` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `forceNew` [``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#boolean_type) yeni bir bağlantı oluşturup oluşturmama
- **Döndürür** ``

Verilen URL için yeni bir `Manager` oluşturur ve `multiplex` seçeneği `false` geçmedikçe, sonraki çağrılar için mevcut bir `Manager`'ı yeniden kullanmaya çalışır. Bu seçenek geçildiğinde, `"force new connection": true` veya `forceNew: true` geçişinin eşdeğeridir.

Verilen URL'deki yol adına göre varsayılan olarak `/` olan ad alanı için yeni bir `Socket` örneği döndürülür. Örneğin, `url` `http://localhost/users` ise, `http://localhost` ile bir taşıma bağlantısı kurulacak ve `/users` için bir Socket.IO bağlantısı kurulacaktır.

Sorgu parametreleri, ya `query` seçeneği ile ya da doğrudan URL'de sağlanabilir (örneğin: `http://localhost/users?token=abc`).

Arka planda ne olduğunu anlamak için aşağıdaki örneği inceleyebilirsiniz:

```js
import { io } from "socket.io-client";

const socket = io("ws://example.com/my-namespace", {
  reconnectionDelayMax: 10000,
  auth: {
    token: "123"
  },
  query: {
    "my-key": "my-value"
  }
});
```

bu, şu kısayol versiyonudur:

```js
import { Manager } from "socket.io-client";

const manager = new Manager("ws://example.com", {
  reconnectionDelayMax: 10000,
  query: {
    "my-key": "my-value"
  }
});

const socket = manager.socket("/my-namespace", {
  auth: {
    token: "123"
  }
});
```

Mevcut seçeneklerin tam listesi `burada` bulunabilir.