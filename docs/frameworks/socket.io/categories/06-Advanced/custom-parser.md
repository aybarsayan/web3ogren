---
title: Özelleştirilmiş ayrıştırıcı
seoTitle: Özelleştirilmiş Socket.IO Ayrıştırıcı
sidebar_position: 2
description: Socket.IO v2.0.0dan itibaren, paketlerin marshalling/unmarshallingını kontrol etmek için kendi ayrıştırıcınızı sağlamanın yöntemleri. Ayrıştırıcıların ve uygulanabilir örneklerin listesi.
tags: 
  - socket.io
  - ayrıştırıcı
  - paketleme
keywords: 
  - özelleştirilmiş
  - socket.io
  - ayrıştırıcı
  - marshalling
  - unmarshalling
---
Socket.IO v2.0.0'dan itibaren, paketlerin marshalling / unmarshalling'ını kontrol etmek için kendi ayrıştırıcınızı sağlamanız artık mümkündür.

**Sunucu**

```js
import { Server } from "socket.io";

const io = new Server({
  parser: myParser
});
```

**İstemci**

```js
import { io } from "socket.io-client";

const socket = io({
  parser: myParser
});
```

## Mevcut ayrıştırıcılar

`varsayılan ayrıştırıcı` dışında, burada mevcut ayrıştırıcıların listesi:

| Paket                                                                                                         | Açıklama                                                                                                                                                      |
|---------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`socket.io-circular-parser`](https://www.npmjs.com/package/socket.io-circular-parser)                        | Varsayılan ayrıştırıcıya benzer, ancak döngüsel referansları işleme alır.                                                                                     |
| [`socket.io-msgpack-parser`](https://www.npmjs.com/package/socket.io-msgpack-parser)                          | Paketleri kodlamak için [MessagePack](https://msgpack.org/) kullanır ( [`notepack.io`](https://github.com/darrachequesne/notepack) paketine dayanmaktadır).  |
| [`@skgdev/socket.io-msgpack-javascript`](https://www.npmjs.com/package/@skgdev/socket.io-msgpack-javascript)  | Paketleri kodlamak için [MessagePack](https://msgpack.org/) kullanır ( [`@msgpack/msgpack`](https://github.com/msgpack/msgpack-javascript) paketine dayanmaktadır). |
| [`socket.io-json-parser`](https://www.npmjs.com/package/socket.io-json-parser)                                | Paketleri kodlamak için `JSON.stringify()` ve `JSON.parse()` kullanır.                                                                                       |
| [`socket.io-cbor-x-parser`](https://www.npmjs.com/package/socket.io-cbor-x-parser)                            | Paketleri kodlamak için [cbor-x](https://github.com/kriszyp/cbor-x) kullanır.                                                                                 |
| [`@socket.io/devalue-parser`](https://www.npmjs.com/package/@socket.io/devalue-parser)                        | Paketleri kodlamak için [devalue](https://github.com/Rich-Harris/devalue) kullanır.                                                                          |

## Kendi ayrıştırıcınızı uygulama

`JSON.stringify()` ve `JSON.parse()` yöntemlerini kullanan bir ayrıştırıcı ile basit bir örnek:

```js
import { Emitter } from "@socket.io/component-emitter"; // tarayıcıda Node.js EventEmitter polyfill'i

class Encoder {
  /**
   * Bir paketi dize/buffer listesine kodla
   */
  encode(packet) {
    return [JSON.stringify(packet)];
  }
}

function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

class Decoder extends Emitter {
  /**
   * Bir parça (dize veya buffer) al ve isteğe bağlı olarak yeniden yapılandırılmış paketi içeren "decode" olayını yayınla
   */
  add(chunk) {
    const packet = JSON.parse(chunk);
    if (this.isPacketValid(packet)) {
      this.emit("decoded", packet);
    } else {
      throw new Error("geçersiz format");
    }
  }
  isPacketValid({ type, data, nsp, id }) {
    const isNamespaceValid = typeof nsp === "string";
    const isAckIdValid = id === undefined || Number.isInteger(id);
    if (!isNamespaceValid || !isAckIdValid) {
      return false;
    }
    switch (type) {
      case 0: // BAĞLAN
        return data === undefined || isObject(data);
      case 1: // BAĞLANTIDAN AYRIL
        return data === undefined;
      case 2: // OLAY
        return Array.isArray(data) && typeof data[0] === "string";
      case 3: // ONAY
        return Array.isArray(data);
      case 4: // BAĞLANMA_HATASI
        return isObject(data);
      default:
        return false;
    }
  }
  /**
   * Dahili buffer'ları temizle
   */
  destroy() {}
}

export const parser = { Encoder, Decoder };
```

## Varsayılan ayrıştırıcı

Varsayılan ayrıştırıcının kaynak kodu ( `socket.io-parser` paketi) burada bulunabilir: https://github.com/socketio/socket.io-parser

**Çıktı örneği:**

- temel yayma

```js
socket.emit("test", 42);
```

şu şekilde kodlanacaktır:

```
2["test",42]
||
|└─ JSON'la kodlanmış yük
└─ paket türü (2 => OLAY)
```

- ikili, onay ve özel ad alanı ile yayma

```js
socket.emit("test", Uint8Array.from([42]), () => {
  console.log("onay alındı");
});
```

şu şekilde kodlanacaktır:

```
51-/admin,13["test",{"_placeholder":true,"num":0}]
||||     || └─ ikili ekler için yer tutucular içeren JSON'la kodlanmış yük
||||     |└─ onay id'si
||||     └─ ayırıcı
|||└─ ad alanı (ana ad alanı olduğunda dahil edilmez)
||└─ ayırıcı
|└─ ikili ek sayısı
└─ paket türü (5 => İKİLİ OLAY)

ve bir ek (çıkarılan Uint8Array)
```

**Artılar:**

- ikili ekler daha sonra base64 ile kodlandığı için bu ayrıştırıcı, [Arraybuffer'ı desteklemeyen](https://caniuse.com/mdn-javascript_builtins_arraybuffer) tarayıcılarla uyumludur, örneğin IE9

**Eksiler:**

- ikili içeriğe sahip paketler iki ayrı WebSocket çerçevesi olarak gönderilir (WebSocket bağlantısı kurulduysa)

## Msgpack Ayrıştırıcısı

Bu ayrıştırıcı, [MessagePack](https://msgpack.org/) serileştirme formatını kullanır.

Bu ayrıştırıcının kaynak kodu burada bulunabilir: https://github.com/socketio/socket.io-msgpack-parser

**Örnek kullanım:**

**Sunucu**

```js
import { Server } from "socket.io";
import customParser from "socket.io-msgpack-parser";

const io = new Server({
  parser: customParser
});
```

**İstemci (Node.js)**

```js
import { io } from "socket.io-client";
import customParser from "socket.io-msgpack-parser";

const socket = io("https://example.com", {
  parser: customParser
});
```

Tarayıcıda, bu ayrıştırıcıyı içeren resmi bir paket bulunmaktadır:

- https://cdn.socket.io/4.8.1/socket.io.msgpack.min.js
- cdnjs: https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.8.1/socket.io.msgpack.min.js
- jsDelivr: https://cdn.jsdelivr.net/npm/socket.io-client@4.8.1/dist/socket.io.msgpack.min.js
- unpkg: https://unpkg.com/socket.io-client@4.8.1/dist/socket.io.msgpack.min.js

Bu durumda, `parser` seçeneğini belirtmenize gerek yoktur.

**Artılar:**

- ikili içeriğe sahip paketler tek bir WebSocket çerçevesi olarak gönderilir (WebSocket bağlantısı kurulduysa)
- daha küçük yüklerin sonucunu verebilir (özellikle çok sayıda sayı kullanıldığında)

**Eksiler:**

- [Arraybuffer'ı desteklemeyen](https://caniuse.com/mdn-javascript_builtins_arraybuffer) tarayıcılarla uyumsuzdur, örneğin IE9
- tarayıcının Ağ sekmesinde hata ayıklanması daha zordur

:::info

Lütfen `socket.io-msgpack-parser`'ın [`notepack.io`](https://github.com/darrachequesne/notepack) MessagePack uygulamasına bağlı olduğunu unutmayın. Bu uygulama, esas olarak performansa ve minimal paket boyutuna odaklanır ve bu nedenle genişletme türleri gibi özellikleri desteklemez. [Resmi JavaScript uygulamasına](https://github.com/msgpack/msgpack-javascript) dayanan bir ayrıştırıcı için, [bu pakete](https://www.npmjs.com/package/@skgdev/socket.io-msgpack-javascript) göz atabilirsiniz.

:::