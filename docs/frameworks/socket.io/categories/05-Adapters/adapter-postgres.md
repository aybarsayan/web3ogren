---
title: Postgres adaptörü
seoTitle: PostgreSQL Adapter for Socket.IO
sidebar_position: 5
description: Postgres adaptörü, Socket.IO ile PostgreSQLi nasıl entegre ettiğinizi açıklar. Bu kılavuz, kurulum ve kullanım adımlarını içerir.
tags: 
  - Postgres
  - Socket.IO
  - Real-time Communication
  - Database
keywords: 
  - Postgres
  - Socket.IO
  - Adapter
  - Real-time
  - Database
---

## Nasıl çalışır

Postgres adaptörü, [NOTIFY](https://www.postgresql.org/docs/current/sql-notify.html) ve [LISTEN](https://www.postgresql.org/docs/current/sql-listen.html) komutlarına dayanır.

Birden fazla istemciye (örneğin, `io.to("room1").emit()` veya `socket.broadcast.emit()`) gönderilen her paket:

- mevcut sunucuya bağlı tüm eşleşen istemcilere gönderilir
- paket ikili veri içeriyorsa veya 8000 bayt sınırını aşıyorsa, paket:
  - [msgpack](https://msgpack.org/) ile kodlanır ve yardımcı bir tabloya eklenir
  - satır ID'si bir NOTIFY komutu içinde gönderilir
  - bu satır ID'si kümenin diğer Socket.IO sunucuları tarafından alınır, tablo sorgulanır, paket çözülür ve ardından kendi bağlı istemcilerine yayınlanır
- aksi takdirde, paket basitçe bir NOTIFY komutu içinde gönderilir ve kümenin diğer Socket.IO sunucuları tarafından alınır



Bu adaptörün kaynak kodu [burada](https://github.com/socketio/socket.io-postgres-adapter) bulunabilir.

## Desteklenen özellikler

| Özellik                         | `socket.io` sürümü                  | Destek                                         |
|---------------------------------|-------------------------------------|-------------------------------------------------|
| Socket yönetimi                 | `4.0.0`                             | :white_check_mark: EVET (sürüm `0.1.0` itibarıyla) |
| Sunucular arası iletişim        | `4.1.0`                             | :white_check_mark: EVET (sürüm `0.1.0` itibarıyla) |
| Onaylı yayın                    | `4.5.0` | :white_check_mark: EVET (sürüm `0.3.0` itibarıyla) |
| Bağlantı durumu geri yükleme    | `4.6.0` | :x: HAYIR                                        |

## Kurulum

:::tip
Dikkat: Aşağıdaki komutu çalıştırarak gerekli paketleri yükleyin.
:::

```
npm install @socket.io/postgres-adapter pg
```

TypeScript kullanıcıları, ayrıca `@types/pg` gerektiğini görebilir.

## Kullanım

```js
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/postgres-adapter";
import pg from "pg";

const io = new Server();

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "changeit",
  port: 5432,
});

pool.query(`
  CREATE TABLE IF NOT EXISTS socket_io_attachments (
      id          bigserial UNIQUE,
      created_at  timestamptz DEFAULT NOW(),
      payload     bytea
  );
`);

pool.on("error", (err) => {
  console.error("Postgres hatası", err);
});

io.adapter(createAdapter(pool));
io.listen(3000);
```

## Seçenekler

| İsim                | Açıklama                                                                                   | Varsayılan değer       |
|---------------------|-----------------------------------------------------------------------------------------------|-------------------------|
| `uid`               | bu düğümün ID'si                                                                           | rastgele bir ID         |
| `channelPrefix`     | bildirim kanalının ön eki                                                                  | `socket.io`             |
| `tableName`         | 8000 bayt sınırını aşan veya ikili veri içeren yükler için tablonun adı                    | `socket_io_attachments` |
| `payloadThreshold`  | bayt cinsinden yük boyutu için eşik                                                        | `8000`                  |
| `requestsTimeout`   | `fetchSockets()` veya `serverSideEmit()` gibi sunucular arası istekler için zaman aşıma süresi | `5000`                  |
| `heartbeatInterval` | iki kalp atışı arasında geçen ms sayısı                                                     | `5000`                  |
| `heartbeatTimeout`  | bir düğümün kapalı olduğunu düşünmeden önce kalp atışsız geçen ms sayısı                     | `10000`                 |
| `cleanupInterval`   | iki temizlik sorgusu arasında geçen ms sayısı                                              | `30000`                 |

## Sıkça sorulan sorular

### Postgres adaptörünü kullanırken yapışkan oturumları etkinleştirmem gerekiyor mu?

Evet. Bunu yapmamak, HTTP 400 yanıtlarına yol açar (Socket.IO oturumunu bilmeyen bir sunucuya ulaşıyorsunuz).

Daha fazla bilgi `burada` bulunabilir.

### Postgres sunucusu kapalıyken ne olur?

Postgres sunucusuna bağlantı kesilirse, paketler yalnızca mevcut sunucuya bağlı istemcilere gönderilecektir.

## Son sürümler

| Sürüm   | Yayın tarihi   | Yayın notları                                                                        | Fark                                                                                            |
|---------|----------------|-------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `0.4.0` | Temmuz 2024    | [link](https://github.com/socketio/socket.io-postgres-adapter/releases/tag/0.4.0)  | [`0.3.1...0.4.0`](https://github.com/socketio/socket.io-postgres-adapter/compare/0.3.1...0.4.0) |
| `0.3.1` | Şubat 2023     | [link](https://github.com/socketio/socket.io-postgres-adapter/releases/tag/0.3.1)  | [`0.3.0...0.3.1`](https://github.com/socketio/socket.io-postgres-adapter/compare/0.3.0...0.3.1) |
| `0.3.0` | Nisan 2022     | [link](https://github.com/socketio/socket.io-postgres-adapter/releases/tag/0.3.0)  | [`0.2.0...0.3.0`](https://github.com/socketio/socket.io-postgres-adapter/compare/0.2.0...0.3.0) |
| `0.2.0` | Aralık 2021    | [link](https://github.com/socketio/socket.io-postgres-adapter/releases/tag/0.2.0)  | [`0.1.1...0.2.0`](https://github.com/socketio/socket.io-postgres-adapter/compare/0.1.1...0.2.0) |
| `0.1.1` | Haziran 2021   | [link](https://github.com/socketio/socket.io-postgres-adapter/releases/tag/0.1.1)  | [`0.1.0...0.1.1`](https://github.com/socketio/socket.io-postgres-adapter/compare/0.1.0...0.1.1) |
| `0.1.0` | Haziran 2021   | [link](https://github.com/socketio/socket.io-postgres-adapter/releases/tag/0.1.0)  |                                                                                                 |

[Tam değişiklik kaydı](https://github.com/socketio/socket.io-postgres-adapter/blob/main/CHANGELOG.md)

## Yayıncı

Postgres yayıncısı, başka bir Node.js sürecinden bağlı istemcilere paket gönderilmesine olanak tanır:



### Kurulum

```
npm install @socket.io/postgres-emitter pg
```

### Kullanım

```js
const { Emitter } = require("@socket.io/postgres-emitter");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "changeit",
  port: 5432,
});

const emitter = new Emitter(pool);

setInterval(() => {
  emitter.emit("ping", new Date());
}, 1000);
```

Lütfen antrenman notlarına `buradan` bakın.

### Son sürümler

| Sürüm   | Yayın tarihi  | Yayın notları                                                                        | Fark  |
|---------|---------------|-------------------------------------------------------------------------------------|-------|
| `0.1.0` | Haziran 2021  | [link](https://github.com/socketio/socket.io-postgres-emitter/releases/tag/0.1.0)  |       |

[Tam değişiklik kaydı](https://github.com/socketio/socket.io-postgres-emitter/blob/main/CHANGELOG.md)