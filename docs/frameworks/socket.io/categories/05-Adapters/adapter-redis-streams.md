---
title: Redis Akış Adaptörü
seoTitle: Redis Streams Adapter for Socket.IO
sidebar_position: 3
description: Redis Akış Adaptörü, Socket.IO sunucuları arasında veri iletimini etkinleştirmek için kullanılır. Bu adaptör, geçici bağlantı kopmalarını doğru bir şekilde ele alarak veriyi kayıpsız bir şekilde yeniden başlatır.
tags: 
  - redis
  - socket.io
  - streams
  - adapter
keywords: 
  - redis
  - socket.io
  - streams
  - adapter
---
## Nasıl çalışır

Adaptör, Socket.IO sunucuları arasında paketleri yönlendirmek için bir [Redis akışı](https://redis.io/docs/data-types/streams/) kullanacaktır.

Mevcut Redis adaptörüyle (ki bu [Redis Pub/Sub mekanizmasını](https://redis.io/docs/manual/pubsub/) kullanır) ana fark, bu adaptörün Redis sunucusundaki her türlü geçici bağlantı kopmasını doğru bir şekilde ele alması ve akışı kayıp olmadan yeniden başlatmasıdır.

:::tip
Tüm ad alanları için tek bir akış kullanılır.
:::

- `maxLen` seçeneği akışın boyutunu sınırlamaya olanak tanır.
- Redis PUB/SUB mekanizmasına dayalı adaptörün aksine, bu adaptör Redis sunucusundaki her türlü geçici bağlantı kopmasını doğru bir şekilde ele alır ve akışı yeniden başlatır.
- `bağlantı durumu kurtarma` etkinleştirildiyse, oturumlar Redis'te klasik bir anahtar/değer çifti olarak saklanır.

> Kaynak kodu: [GitHub](https://github.com/socketio/socket.io-redis-streams-adapter) — Socket.IO Redis Streams Adapter

## Desteklenen özellikler

| Özellik                         | `socket.io` sürümü                  | Destek                                         |
|---------------------------------|-------------------------------------|-------------------------------------------------|
| Socket yönetimi                 | `4.0.0`                             | :white_check_mark: EVET (sürüm `0.1.0` itibarıyla) |
| Sunucular arası iletişim        | `4.1.0`                             | :white_check_mark: EVET (sürüm `0.1.0` itibarıyla) |
| Onay ile yayım                 | `4.5.0` | :white_check_mark: EVET (sürüm `0.1.0` itibarıyla) |
| Bağlantı durumu kurtarma       | `4.6.0` | :white_check_mark: EVET (sürüm `0.1.0` itibarıyla) |

## Kurulum

```
npm install @socket.io/redis-streams-adapter redis
```

## Kullanım

### `redis` paketi ile

```js
import { createClient } from "redis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";

const redisClient = createClient({ url: "redis://localhost:6379" });

await redisClient.connect();

const io = new Server({
  adapter: createAdapter(redisClient)
});

io.listen(3000);
```

### `redis` paketi ile ve bir Redis kümesi

```js
import { createCluster } from "redis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";

const redisClient = createCluster({
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

await redisClient.connect();

const io = new Server({
  adapter: createAdapter(redisClient)
});

io.listen(3000);
```

### `ioredis` paketi ile

```js
import { Redis } from "ioredis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";

const redisClient = new Redis();

const io = new Server({
  adapter: createAdapter(redisClient)
});

io.listen(3000);
```

### `ioredis` paketi ile ve bir Redis kümesi

```js
import { Cluster } from "ioredis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";

const redisClient = new Cluster([
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

const io = new Server({
  adapter: createAdapter(redisClient)
});

io.listen(3000);
```

## Seçenekler

| İsim                | Açıklama                                                                                                       | Varsayılan değer  |
|---------------------|-------------------------------------------------------------------------------------------------------------------|--------------------|
| `streamName`        | Redis akışının adı.                                                                                             | `socket.io`        |
| `maxLen`            | Akışın maksimum boyutu. Neredeyse tam kesim (~) kullanılır.                                                       | `10_000`           |
| `readCount`         | Her XREAD çağrısında alınacak öğe sayısı.                                                                         | `100`              |
| `sessionKeyPrefix`  | Bağlantı durumu kurtarma özelliği etkin olduğunda Socket.IO oturumunu depolamak için kullanılan anahtarın ön eki. | `sio:session:`     |
| `heartbeatInterval` | İki kalp atışı arasında geçen ms sayısı.                                                                          | `5_000`            |
| `heartbeatTimeout`  | Kalp atışı olmadan geçen ms sayısı dolayısıyla bir düğümün kapalı olarak kabul edilmesi.                         | `10_000`           |

## Sıkça sorulan sorular

### Redis Akış adaptörünü kullanırken hâlâ yapışkan oturumları etkinleştirmem gerekiyor mu?

Evet. Bunu yapmamak, HTTP 400 yanıtları ile sonuçlanacaktır (Socket.IO oturumunu bilmeyen bir sunucuya ulaşıyorsunuz).

Daha fazla bilgi için `buraya` bakabilirsiniz.

### Redis sunucusu kapalıyken ne olur?

Klasik `Redis adaptörü` ile karşılaştırıldığında, bu adaptör Redis sunucusundaki her türlü geçici bağlantı kopmasını doğru bir şekilde ele alır ve akışı kayıp olmadan yeniden başlatır.

## En son sürümler

| Sürüm  | Yayın tarihi | Yayın notları                                                                          | Fark                                                                                                 |
|--------|--------------|----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `0.2.1`| Mart 2024    | [link](https://github.com/socketio/socket.io-redis-streams-adapter/releases/tag/0.2.1) | [`0.2.0...0.2.1`](https://github.com/socketio/socket.io-redis-streams-adapter/compare/0.2.0...0.2.1) |
| `0.2.0`| Şubat 2024   | [link](https://github.com/socketio/socket.io-redis-streams-adapter/releases/tag/0.2.0) | [`0.1.0...0.2.0`](https://github.com/socketio/socket.io-redis-streams-adapter/compare/0.1.0...0.2.0) |
| `0.1.0`| Nisan 2023   | [link](https://github.com/socketio/socket.io-redis-streams-adapter/releases/tag/0.1.0) |                                                                                                      |

[Tamamı değişiklik kaydı](https://github.com/socketio/socket.io-redis-streams-adapter/blob/main/CHANGELOG.md)