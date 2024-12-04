---
title: Redis adaptörü
seoTitle: Redis Adaptörü - Socket.IO ile Redis İletişimi
sidebar_position: 2
description: Redis adaptörü, Redis Pub/Sub mekanizmasını kullanarak Socket.IO sunucuları arasında iletişim sağlar. Bu belge, kurulumdan başlayarak adaptörün desteklediği özellikler ve kullanım örnekleri gibi bilgileri içerir.
tags: 
  - Redis
  - Socket.IO
  - Pub/Sub
  - Adaptör
keywords: 
  - Redis adaptörü
  - Socket.IO
  - Pub/Sub
  - İletişim
  - Geliştirici
---

## Nasıl çalışır

Redis adaptörü, Redis [Pub/Sub mekanizmasını](https://redis.io/topics/pubsub) kullanır.

Birden fazla istemciye (örneğin, `io.to("room1").emit()` veya `socket.broadcast.emit()`) gönderilen her paket:

- mevcut sunucuya bağlı tüm eşleşen istemcilere gönderilir
- bir Redis kanalında yayınlanır ve kümenin diğer Socket.IO sunucuları tarafından alınır



Bu adaptörün kaynak koduna [buradan](https://github.com/socketio/socket.io-redis-adapter) ulaşabilirsiniz.

## Desteklenen özellikler

| Özellik                         | `socket.io` sürümü                 | Destek                                        |
|---------------------------------|-------------------------------------|------------------------------------------------|
| Socket yönetimi                 | `4.0.0`                             | :white_check_mark: EVET (sürüm `6.1.0`'dan beri) |
| Sunucular arası iletişim        | `4.1.0`                             | :white_check_mark: EVET (sürüm `7.0.0`'dan beri) |
| Onaylı yayın                    | `4.5.0` | :white_check_mark: EVET (sürüm `7.2.0`'dan beri) |
| Bağlantı durumu kurtarma       | `4.6.0` | :x: HAYIR                                       |

## Kurulum

```
npm install @socket.io/redis-adapter
```

## Uyumluluk tablosu

| Redis Adaptör sürümü | Socket.IO sunucu sürümü |
|-----------------------|--------------------------|
| 4.x                   | 1.x                      |
| 5.x                   | 2.x                      |
| 6.0.x                 | 3.x                      |
| 6.1.x                 | 4.x                      |
| 7.x ve üzeri         | 4.3.1 ve üzeri          |

## Kullanım

:::tip

Yeni geliştirmeler için, Redis 7.0'de tanıtılan [parçalı Pub/Sub özelliğinden](https://redis.io/docs/latest/develop/interact/pubsub/#sharded-pubsub) yararlanan `parçalı adaptörü` kullanmanızı öneririz.

:::

### `redis` paketi ile

:::caution

`redis` paketinin yeniden bağlantıdan sonra Redis aboneliklerini geri yükleme konusunda sorunları olduğu görülmektedir:

- https://github.com/redis/node-redis/issues/2155
- https://github.com/redis/node-redis/issues/1252

Bunun yerine `ioredis` paketini kullanmak isteyebilirsiniz.

:::

```js
import { createClient } from "redis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

await Promise.all([
  pubClient.connect(),
  subClient.connect()
]);

const io = new Server({
  adapter: createAdapter(pubClient, subClient)
});

io.listen(3000);
```

### `redis` paketi ve bir Redis kümesi ile

```js
import { createCluster } from "redis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

const pubClient = createCluster({
  rootNodes: [
    {
      url: "redis://localhost:7000",
    },
    {
      url: "redis://localhost:7001",
    },
    {
      url: "redis://localhost:7002",
    },
  ],
});
const subClient = pubClient.duplicate();

await Promise.all([
  pubClient.connect(),
  subClient.connect()
]);

const io = new Server({
  adapter: createAdapter(pubClient, subClient)
});

io.listen(3000);
```

### `ioredis` paketi ile

```js
import { Redis } from "ioredis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

const pubClient = new Redis();
const subClient = pubClient.duplicate();

const io = new Server({
  adapter: createAdapter(pubClient, subClient)
});

io.listen(3000);
```

### `ioredis` paketi ve bir Redis kümesi ile

```js
import { Cluster } from "ioredis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

const pubClient = new Cluster([
  {
    host: "localhost",
    port: 7000,
  },
  {
    host: "localhost",
    port: 7001,
  },
  {
    host: "localhost",
    port: 7002,
  },
]);
const subClient = pubClient.duplicate();

const io = new Server({
  adapter: createAdapter(pubClient, subClient)
});

io.listen(3000);
```

### Redis parçalı Pub/Sub ile

Parçalı Pub/Sub, Redis 7.0'da, küme modunda Pub/Sub kullanımını ölçeklendirmek amacıyla tanıtılmıştır.

Referans: https://redis.io/docs/interact/pubsub/#sharded-pubsub

`createShardedAdapter()` metodu ile özel bir adaptör oluşturulabilir:

```js
import { Server } from "socket.io";
import { createClient } from "redis";
import { createShardedAdapter } from "@socket.io/redis-adapter";

const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();

await Promise.all([
  pubClient.connect(),
  subClient.connect()
]);

const io = new Server({
  adapter: createShardedAdapter(pubClient, subClient)
});

io.listen(3000);
```

Minimum gereksinimler:

- Redis 7.0
- [`redis@4.6.0`](https://github.com/redis/node-redis/commit/3b1bad229674b421b2bc6424155b20d4d3e45bd1)

:::caution

Şu anda `ioredis` paketi ve bir Redis kümesi ile parçalı adaptör kullanmak mümkün değildir ([referans](https://github.com/luin/ioredis/issues/1759)).

:::

## Seçenekler

### Varsayılan adaptör

| Ad                              | Açıklama                                                                   | Varsayılan değer |
|--------------------------------|----------------------------------------------------------------------------|-------------------|
| `key`                          | Redis Pub/Sub kanalları için ön ek.                                       | `socket.io`       |
| `requestsTimeout`              | Bu zaman aşımından sonra adaptör, yanıtlar için beklemeyi durduracaktır. | `5_000`           |
| `publishOnSpecificResponseChannel` | İsteği yapan düğüme özel kanala yanıtı yayımlayıp yayımlamayacağını belirler. | `false`           |
| `parser`                       | Redis'e gönderilen ve Redis'den alınan mesajların kodlanması ve çözülmesi için kullanılacak ayrıştırıcı. | `-`               |

:::tip

`publishOnSpecificResponseChannel` seçeneğini `true` olarak ayarlamak daha verimlidir çünkü yanıtlar (örneğin, `fetchSockets()` veya `serverSideEmit()` çağrısı yapıldığında) yalnızca isteği yapan sunucuya gönderilir, tüm sunuculara değil.

Ancak, şu anda geriye dönük uyumluluk için varsayılan olarak `false`'dur.

:::

### Parçalı adaptör

| Ad                     | Açıklama                                                                                 | Varsayılan değer |
|------------------------|------------------------------------------------------------------------------------------|-------------------|
| `channelPrefix`        | Redis Pub/Sub kanalları için ön ek.                                                     | `socket.io`       |
| `subscriptionMode`     | Abonelik modu, adaptör tarafından kullanılan Redis Pub/Sub kanalı sayısını etkiler.     | `dynamic`         |

`subscriptionMode` seçeneği için kullanılabilir değerler:

| Değer               | Pub/Sub kanalları sayısı               | Açıklama                                                                                                                                     |
|---------------------|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| `static`            | her ad alanı için 2                   | Dinamik ad alanları ile kullanıldığında faydalıdır.                                                                                         |
| `dynamic` (varsayılan) | her ad alanı için (2 + 1 her kamu odası başına) | Bazı odalarda düşük sayıda istemci olduğunda faydalıdır (bu durumda yalnızca birkaç Socket.IO sunucusu bilgilendirilir).                      |
| `dynamic-private`   | her ad alanı için (2 + 1 her oda başına)        | `dynamic` gibi ama özel odalar için ayrı kanallar oluşturur. `socket.emit()` çağrıları aracılığıyla çok sayıda 1:1 iletişim olduğunda faydalıdır. |

## Yaygın sorular

### Redis'te herhangi bir veri depolanıyor mu?

Hayır, Redis adaptörü, Socket.IO sunucuları arasında paketleri iletmek için [Pub/Sub mekanizmasını](https://redis.io/topics/pubsub) kullanır; bu nedenle Redis'te anahtarlar depolanmaz.

### Redis adaptörünü kullanırken hala yapışkan oturumları etkinleştirmem gerekir mi?

Evet. Bunu yapmamak, HTTP 400 yanıtlarına neden olacaktır (socket.io oturumundan haberdar olmayan bir sunucuya ulaşıyorsunuz).

Daha fazla bilgi `burada` bulunabilir.

### Redis sunucusu kapandığında ne olur?

Redis sunucusuna olan bağlantı kesildiğinde, paketler yalnızca mevcut sunucuya bağlı istemcilere gönderilir.

## `socket.io-redis`'den geçiş

Paket, `socket.io-redis`'den `@socket.io/redis-adapter` olarak [v7](https://github.com/socketio/socket.io-redis-adapter/releases/tag/7.0.0) sürümünde yeniden adlandırılmıştır. Bu, Redis yayıncılarının adını (`@socket.io/redis-emitter`) yansıtmak amacıyla yapılmıştır.

Yeni pakete geçiş yapmak için, kendi Redis istemcilerinizi sağladığınızdan emin olmalısınız, çünkü paket artık kullanıcı adına Redis istemcileri oluşturmayacaktır.

Önce:

```js
const redisAdapter = require("socket.io-redis");

io.adapter(redisAdapter({ host: "localhost", port: 6379 }));
```

Sonra:

```js
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

:::tip

Socket.IO sunucuları arasındaki iletişim protokolü güncellenmediğinden, bazı sunucular `socket.io-redis` ve diğerleri `@socket.io/redis-adapter` ile aynı anda bulunabilir.

:::

## En son sürümler

| Sürüm  | Yayın tarihi   | Yayın notları                                                                  | Fark                                                                                          |
|--------|----------------|--------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| `8.3.0` | Mart 2024      | [link](https://github.com/socketio/socket.io-redis-adapter/releases/tag/8.3.0) | [`8.2.1...8.3.0`](https://github.com/socketio/socket.io-redis-adapter/compare/8.2.1...8.3.0) |
| `8.2.1` | Mayıs 2023     | [link](https://github.com/socketio/socket.io-redis-adapter/releases/tag/8.2.1) | [`8.2.0...8.2.1`](https://github.com/socketio/socket.io-redis-adapter/compare/8.2.0...8.2.1) |
| `8.2.0` | Mayıs 2023     | [link](https://github.com/socketio/socket.io-redis-adapter/releases/tag/8.2.0) | [`8.1.0...8.2.0`](https://github.com/socketio/socket.io-redis-adapter/compare/8.1.0...8.2.0) |
| `8.1.0` | Şubat 2023     | [link](https://github.com/socketio/socket.io-redis-adapter/releases/tag/8.1.0) | [`8.0.0...8.1.0`](https://github.com/socketio/socket.io-redis-adapter/compare/8.0.0...8.1.0) |
| `8.0.0` | Aralık 2022    | [link](https://github.com/socketio/socket.io-redis-adapter/releases/tag/8.0.0) | [`7.2.0...8.0.0`](https://github.com/socketio/socket.io-redis-adapter/compare/7.2.0...8.0.0) |
| `7.2.0` | Mayıs 2022     | [link](https://github.com/socketio/socket.io-redis-adapter/releases/tag/7.2.0) | [`7.1.0...7.2.0`](https://github.com/socketio/socket.io-redis-adapter/compare/7.1.0...7.2.0) |

[Tam güncelleme günlüğü](https://github.com/socketio/socket.io-redis-adapter/blob/main/CHANGELOG.md)

## Yayıncı

Redis yayıncısı, başka bir Node.js sürecinden bağlı istemcilere paketler göndermeyi sağlar:



Bu yayıncı, birkaç dilde de mevcuttur:

- Javascript: https://github.com/socketio/socket.io-redis-emitter
- Java: https://github.com/sunsus/socket.io-java-emitter
- Python: https://pypi.org/project/socket.io-emitter/
- PHP: https://github.com/rase-/socket.io-php-emitter
- Golang: https://github.com/yosuke-furukawa/socket.io-go-emitter
- Perl: https://metacpan.org/pod/SocketIO::Emitter
- Rust: https://github.com/epli2/socketio-rust-emitter

### Kurulum

```
npm install @socket.io/redis-emitter redis
```

### Kullanım

```js
import { Emitter } from "@socket.io/redis-emitter";
import { createClient } from "redis";

const redisClient = createClient({ url: "redis://localhost:6379" });

redisClient.connect().then(() => {
  const emitter = new Emitter(redisClient);

  setInterval(() => {
    emitter.emit("time", new Date);
  }, 5000);
});
```

Not: `redis@3` ile, Redis istemcisi üzerinde `connect()` çağrısı yapmanıza gerek yoktur:

```js
import { Emitter } from "@socket.io/redis-emitter";
import { createClient } from "redis";

const redisClient = createClient({ url: "redis://localhost:6379" });
const emitter = new Emitter(redisClient);

setInterval(() => {
  emitter.emit("time", new Date);
}, 5000);
```

Lütfen yardım kılavuzuna `buradan` ulaşın.

### `socket.io-emitter`'dan geçiş

Paket, `socket.io-emitter`'dan `@socket.io/redis-emitter` olarak [v4](https://github.com/socketio/socket.io-redis-emitter/releases/tag/4.0.0) sürümünde yeniden adlandırılmıştır. Bu, Redis ile ilişkiyi daha iyi yansıtmak amacıyla yapılmıştır.

Yeni pakete geçiş yapmak için, kendi Redis istemcilerinizi sağladığınızdan emin olmalısınız, çünkü paket artık kullanıcı adına Redis istemcileri oluşturmayacaktır.

Önce:

```js
const io = require("socket.io-emitter")({ host: "127.0.0.1", port: 6379 });
```

Sonra:

```js
const { Emitter } = require("@socket.io/redis-emitter");
const { createClient } = require("redis");

const redisClient = createClient();
const io = new Emitter(redisClient);
```

### En son sürümler

| Sürüm  | Yayın tarihi    | Yayın notları                                                                  | Fark                                                                                         |
|--------|-----------------|--------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| `5.1.0` | Ocak 2023       | [link](https://github.com/socketio/socket.io-redis-emitter/releases/tag/5.1.0) | [`5.0.0...5.1.0`](https://github.com/socketio/socket.io-redis-emitter/compare/5.0.0...5.1.0) |
| `5.0.0` | Eylül 2022      | [link](https://github.com/socketio/socket.io-redis-emitter/releases/tag/5.0.1) | [`4.1.1...5.0.0`](https://github.com/socketio/socket.io-redis-emitter/compare/4.1.1...5.0.0) |
| `4.1.1` | Ocak 2022       | [link](https://github.com/socketio/socket.io-redis-emitter/releases/tag/4.1.1) | [`4.1.0...4.1.1`](https://github.com/socketio/socket.io-redis-emitter/compare/4.1.0...4.1.1) |
| `4.1.0` | Mayıs 2021      | [link](https://github.com/socketio/socket.io-redis-emitter/releases/tag/4.1.0) | [`4.0.0...4.1.0`](https://github.com/socketio/socket.io-redis-emitter/compare/4.0.0...4.1.0) |
| `4.0.0` | Mart 2021       | [link](https://github.com/socketio/socket.io-redis-emitter/releases/tag/4.0.0) | [`3.2.0...4.0.0`](https://github.com/socketio/socket.io-redis-emitter/compare/3.2.0...4.0.0) |

[Tam güncelleme günlüğü](https://github.com/socketio/socket.io-redis-emitter/blob/main/CHANGELOG.md)