---
title: MongoDB adaptörü
seoTitle: MongoDB Adapter for Socket.IO
sidebar_position: 4
description: MongoDB adaptörü ile Socket.IO arasında etkin bir iletişim kurmayı öğrenin. Bu kılavuzda, kurulumu ve kullanımını adım adım keşfedeceksiniz.
tags: 
  - MongoDB
  - Socket.IO
  - WebSocket
  - Node.js
  - Adapter
keywords: 
  - mongoDB
  - socketIO
  - change streams
  - real-time communication
  - node.js
---

## Nasıl çalışır

MongoDB adaptörü, MongoDB'nin [Change Streams](https://docs.mongodb.com/manual/changeStreams/) özelliğine dayanır (ve bu nedenle bir replikasyon seti veya parçalı bir kümeye ihtiyaç duyar).

Birden çok istemciye gönderilen her paket (örneğin, `io.to("room1").emit()` veya `socket.broadcast.emit()`) şunları yapar:

- mevcut sunucuya bağlı olan tüm eşleşen istemcilere gönderilir
- MongoDB sınırlı bir koleksiyonuna eklenir ve kümenin diğer Socket.IO sunucuları tarafından alınır



Bu adaptörün kaynak koduna [buradan](https://github.com/socketio/socket.io-mongo-adapter) ulaşabilirsiniz.

## Desteklenen özellikler

| Özellik                           | `socket.io` sürümü                     | Destek                                        |
|-----------------------------------|----------------------------------------|------------------------------------------------|
| Socket yönetimi                   | `4.0.0`                                | :white_check_mark: Evet (sürüm `0.1.0`'dan itibaren) |
| Sunucular arası iletişim          | `4.1.0`                                | :white_check_mark: Evet (sürüm `0.1.0`'dan itibaren) |
| Onaylı yayınlama                  | `4.5.0`  | :white_check_mark: Evet (sürüm `0.2.0`'dan itibaren) |
| Bağlantı durumu kurtarma          | `4.6.0`  | :white_check_mark: Evet (sürüm `0.3.0`'dan itibaren) |

## Kurulum

```
npm install @socket.io/mongo-adapter mongodb
```

TypeScript kullanıcıları için, ayrıca `@types/mongodb` de gerekli olabilir.

## Kullanım

Socket.IO kümesi içinde paket yayınlama, MongoDB belgeleri oluşturarak ve her Socket.IO sunucusunda bir [change stream](https://docs.mongodb.com/manual/changeStreams/) kullanarak gerçekleştirilir.

MongoDB'deki belgeleri temizlemenin iki yolu vardır:

- bir [sınırlı koleksiyon](https://www.mongodb.com/docs/manual/core/capped-collections/)
- bir [TTL indeksi](https://www.mongodb.com/docs/manual/core/index-ttl/)

### Sınırlı koleksiyon ile kullanım

```js
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/mongo-adapter";
import { MongoClient } from "mongodb";

const DB = "mydb";
const COLLECTION = "socket.io-adapter-events";

const io = new Server();

const mongoClient = new MongoClient("mongodb://localhost:27017/?replicaSet=rs0");

await mongoClient.connect();

try {
  await mongoClient.db(DB).createCollection(COLLECTION, {
    capped: true,
    size: 1e6
  });
} catch (e) {
  // koleksiyon zaten var
}
const mongoCollection = mongoClient.db(DB).collection(COLLECTION);

io.adapter(createAdapter(mongoCollection));
io.listen(3000);
```

### TTL indeksi ile kullanım

```js
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/mongo-adapter";
import { MongoClient } from "mongodb";

const DB = "mydb";
const COLLECTION = "socket.io-adapter-events";

const io = new Server();

const mongoClient = new MongoClient("mongodb://localhost:27017/?replicaSet=rs0");

await mongoClient.connect();

const mongoCollection = mongoClient.db(DB).collection(COLLECTION);

await mongoCollection.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600, background: true }
);

io.adapter(createAdapter(mongoCollection, {
  addCreatedAtField: true
}));

io.listen(3000);
```

## Seçenekler

| İsim                | Açıklama                                                                                  | Varsayılan değer | Eklendi  |
|---------------------|-------------------------------------------------------------------------------------------|------------------|----------|
| `uid`               | bu düğümün kimliği                                                                        | rastgele bir id   | `v0.1.0` |
| `requestsTimeout`   | `fetchSockets()` veya `serverSideEmit()` gibi sunucular arası istekler için zaman aşımı   | `5000`           | `v0.1.0` |
| `heartbeatInterval` | iki kalp atışı arasındaki ms sayısı                                                       | `5000`           | `v0.1.0` |
| `heartbeatTimeout`  | bir düğümün kapalı olduğu kabul edilmeden önce kalp atışı olmadan geçen ms sayısı        | `10000`          | `v0.1.0` |
| `addCreatedAtField` | her MongoDB belgesine `createdAt` alanı eklenip eklenmeyeceği                             | `false`          | `v0.2.0` |

## Sıkça Sorulan Sorular

### MongoDB adaptörü kullanırken hala yapışkan oturumları etkinleştirmem gerekiyor mu?

:::tip
Evet. Bunu yapmamak, HTTP 400 yanıtlarına neden olacaktır (Socket.IO oturumu hakkında bilgi sahibi olmayan bir sunucuya ulaşmaya çalışıyorsunuz).
:::

Daha fazla bilgi `burada` bulunabilir.

### MongoDB kümesi kapalı olduğunda ne olur?

MongoDB kümesine bağlantı kesilirse, davranış MongoDB istemcisinin `bufferMaxEntries` seçeneğinin değerine bağlı olacaktır:

- değeri `-1` (varsayılan) ise, paketler yeniden bağlantı sağlanana kadar yığılacaktır.
- değeri `0` ise, paketler yalnızca mevcut sunucuya bağlı olan istemcilere gönderilecektir.

Belgeler: http://mongodb.github.io/node-mongodb-native/3.6/api/global.html#MongoClientOptions

## Son Sürümler

| Sürüm   | Yayın tarihi  | Yayın notları                                                                  | Fark                                                                                         |
|---------|---------------|--------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| `0.3.2` | Ocak 2024     | [link](https://github.com/socketio/socket.io-mongo-adapter/releases/tag/0.3.2) | [`0.3.1...0.3.2`](https://github.com/socketio/socket.io-mongo-adapter/compare/0.3.1...0.3.2) |
| `0.3.1` | Ocak 2024     | [link](https://github.com/socketio/socket.io-mongo-adapter/releases/tag/0.3.1) | [`0.3.0...0.3.1`](https://github.com/socketio/socket.io-mongo-adapter/compare/0.3.0...0.3.1) |
| `0.3.0` | Şubat 2023    | [link](https://github.com/socketio/socket.io-mongo-adapter/releases/tag/0.3.0) | [`0.2.1...0.3.0`](https://github.com/socketio/socket.io-mongo-adapter/compare/0.2.1...0.3.0) |
| `0.2.1` | Mayıs 2022    | [link](https://github.com/socketio/socket.io-mongo-adapter/releases/tag/0.2.1) | [`0.2.0...0.2.1`](https://github.com/socketio/socket.io-mongo-adapter/compare/0.2.0...0.2.1) |
| `0.2.0` | Nisan 2022    | [link](https://github.com/socketio/socket.io-mongo-adapter/releases/tag/0.2.0) | [`0.1.0...0.2.0`](https://github.com/socketio/socket.io-mongo-adapter/compare/0.1.0...0.2.0) |
| `0.1.0` | Haziran 2021  | [link](https://github.com/socketio/socket.io-mongo-adapter/releases/tag/0.1.0) |                                                                                              |

[Tam değişiklik günlüğü](https://github.com/socketio/socket.io-mongo-adapter/blob/main/CHANGELOG.md)

## Yayıncı

MongoDB yayıncısı, başka bir Node.js işleminden bağlı istemcilere paket göndermeyi sağlar:



### Kurulum

```
npm install @socket.io/mongo-emitter mongodb
```

### Kullanım

```js
const { Emitter } = require("@socket.io/mongo-emitter");
const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient("mongodb://localhost:27017/?replicaSet=rs0");

const main = async () => {
  await mongoClient.connect();

  const mongoCollection = mongoClient.db("mydb").collection("socket.io-adapter-events");
  const emitter = new Emitter(mongoCollection);

  setInterval(() => {
    emitter.emit("ping", new Date());
  }, 1000);
}

main();
```

Lütfen `burada` hızlı referansa bakın.