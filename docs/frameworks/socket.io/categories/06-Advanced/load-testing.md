---
title: Yük Testi
seoTitle: Socket.IO Yük Testi Rehberi
sidebar_position: 5
description: Socket.IO ile yük testi yapmanın yollarını keşfedin. Artillery kullanımı ve manuel istemci oluşturma hakkında detaylı bilgi edinin.
tags: 
  - yük testi
  - Socket.IO
  - Artillery
  - istemci yönetimi
keywords: 
  - yük testi
  - Socket.IO
  - Artillery
  - istemci yönetimi
---
Socket.IO kendi [protokolüne](https://github.com/socketio/socket.io-protocol) sahip olduğu için, el sıkışma, kalp atışları ve özelleştirilmiş paket kodlaması da dahil olmak üzere, Socket.IO sunucunuzu yük test etmek için en kolay yol, Socket.IO istemci kütüphanesini kullanmak ve *birçok* istemci oluşturmaktır.

Bunu yapmanın iki klasik çözümü vardır:

- `Artillery` kullanmak
- veya `istemcileri manuel olarak yönetmek`

## Artillery

Artillery uygulamanızın yük testini yapmak için harika bir araçtır. Bağlantılar kurmanıza, olaylar göndermenize ve onayları kontrol etmenize olanak tanır.

Belgelerine [buradan](https://artillery.io/docs/guides/guides/socketio-reference.html) ulaşabilirsiniz.

:::warning
**Önemli not**: Varsayılan kurulum, v3/v4 sunucusu ile `uyumlu olmayan` bir v2 istemcisi ile gelir. Bunun için özel bir motor yüklemeniz gerekir: https://github.com/ptejada/artillery-engine-socketio-v3
:::

Kurulum:

```
$ npm install artillery artillery-engine-socketio-v3
```

Örnek senaryo:

```yaml
## my-scenario.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
  engines:
   socketio-v3: {}

scenarios:
  - name: Örnek senaryom
    engine: socketio-v3
    flow:
      # WebSocket yükselişini bekleyin (isteğe bağlı)
      - think: 1

      # temel yayım
      - emit:
          channel: "hello"
          data: "world"

      # bir nesne yayma
      - emit:
          channel: "hello"
          data:
            id: 42
            status: "devam ediyor"
            tags:
              - "etiket1"
              - "etiket2"

      # özelleştirilmiş bir ad alanında yayma
      - namespace: "/my-namespace"
        emit:
          channel: "hello"
          data: "world"

      # onay ile yayma
      - emit:
          channel: "ping"
        acknowledge:
          match:
            value: "pong"

      # 30 saniye bir şey yapmadan bekleyin ve sonra bağlantıyı koparın
      - think: 30
```

Bu senaryoyu çalıştırmak için:

```
$ npx artillery run my-scenario.yml
```

Artillery ayrıca [metrikleri çeşitli uç noktalara yayınlama](https://artillery.io/docs/guides/plugins/plugin-publish-metrics.html) veya [AWS'den testleri çalışma](https://artillery.io/docs/guides/guides/running-tests-with-artillery-pro.html) gibi harika birçok özellikle gelir.

Tek sınırlaması, sunucu-istemci olaylarını kolayca test edememenizdir; çünkü Artillery DSL, klasik istemci-sunucu iletişimi için daha uygundur. Bu da bizi `bir sonraki bölüme` getiriyor.

## Manuel istemci oluşturma

İşte bin tane Socket.IO istemcisi oluşturmak ve saniye başına alınan paket sayısını izlemek için temel bir betik:

```js
const { io } = require("socket.io-client");

const URL = process.env.URL || "http://localhost:3000";
const MAX_CLIENTS = 1000;
const POLLING_PERCENTAGE = 0.05;
const CLIENT_CREATION_INTERVAL_IN_MS = 10;
const EMIT_INTERVAL_IN_MS = 1000;

let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;

const createClient = () => {
  // gösterim amaçlı olarak, bazı istemciler HTTP uzun anketleme içinde sıkışır
  const transports =
    Math.random() < POLLING_PERCENTAGE ? ["polling"] : ["polling", "websocket"];

  const socket = io(URL, {
    transports,
  });

  setInterval(() => {
    socket.emit("client to server event");
  }, EMIT_INTERVAL_IN_MS);

  socket.on("server to client event", () => {
    packetsSinceLastReport++;
  });

  socket.on("disconnect", (reason) => {
    console.log(`disconnect due to ${reason}`);
  });

  if (++clientCount < MAX_CLIENTS) {
    setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
  }
};

createClient();

const printReport = () => {
  const now = new Date().getTime();
  const durationSinceLastReport = (now - lastReport) / 1000;
  const packetsPerSeconds = (
    packetsSinceLastReport / durationSinceLastReport
  ).toFixed(2);

  console.log(
    `istenci sayısı: ${clientCount} ; saniye başına alınan ortalama paket sayısı: ${packetsPerSeconds}`
  );

  packetsSinceLastReport = 0;
  lastReport = now;
};

setInterval(printReport, 5000);
```

Bunu kendi uygulamanızın yük testine başlamak için bir başlangıç noktası olarak kullanabilirsiniz.