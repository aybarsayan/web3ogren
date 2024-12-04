---
title: Sunucu Kurulumu
seoTitle: Socket.IO Sunucu Kurulumu
sidebar_position: 1
description: Socket.IO sunucusunun nasıl kurulacağına dair adım adım bir kılavuz. Node.js gereksinimleri ve alternatif WebSocket sunucu uygulamaları hakkında bilgi içerir.
tags: 
  - Socket.IO
  - Node.js
  - WebSocket
  - uWebSockets
keywords: 
  - Socket.IO
  - Node.js
  - WebSocket
  - uWebSockets
---



:::info

En son sürüm şu anda `4.8.1`, Ekim 2024'te yayınlandı.

Sürüm notlarını bulabilirsiniz `burada`.

:::

## Gereksinimler

Lütfen sisteminizde [Node.js](https://nodejs.org/en/) yüklü olduğundan emin olun. Mevcut Uzun Süreli Destek (LTS) sürümü ideal bir başlangıç noktasıdır, [burada](https://github.com/nodejs/Release#release-schedule) görebilirsiniz.

:::info

En az Node.js 10 gereklidir, daha eski sürümler artık desteklenmemektedir.

:::

## Kurulum

En son sürümü yüklemek için:


  

```sh
npm install socket.io
```

  
  

```sh
yarn add socket.io
```

  
  

```sh
pnpm add socket.io
```

  


Belirli bir sürümü yüklemek için:


  

```sh
npm install socket.io@version
```

  
  

```sh
yarn add socket.io@version
```

  
  

```sh
pnpm add socket.io@version
```

  


## Ek paketler

Varsayılan olarak, Socket.IO [ws](https://www.npmjs.com/package/ws) paketi tarafından sağlanan WebSocket sunucusunu kullanır.

Bu paketle birlikte yüklenebilecek 2 isteğe bağlı paket vardır. Bu paketler, belirli işlemleri geliştiren ikili eklentilerdir. En popüler platformlar için önceden oluşturulmuş ikili dosyalar mevcuttur, bu nedenle mutlaka makinenizde bir C++ derleyicisi bulundurmanız gerekmez.

- [bufferutil](https://www.npmjs.com/package/bufferutil): WebSocket çerçevelerinin veri yükünü maskeleme ve maskeleme gibi işlemleri verimli bir şekilde gerçekleştirmeyi sağlar.
- [utf-8-validate](https://www.npmjs.com/package/utf-8-validate): Bir mesajın, spesifikasyona uygun geçerli UTF-8 içerip içermediğini verimli bir şekilde kontrol etmeyi sağlar.

Bu paketleri yüklemek için:


  

```sh
npm install --save-optional bufferutil utf-8-validate
```

  
  

```sh
yarn add --optional bufferutil utf-8-validate
```

  
  

```sh
pnpm add -O bufferutil utf-8-validate
```

  


Lütfen bu paketlerin isteğe bağlı olduğunu unutmayın, WebSocket sunucusu mevcut olmadıklarında Javascript implementasyonuna geri dönecektir. Daha fazla bilgi [burada](https://github.com/websockets/ws/#opt-in-for-performance-and-spec-compliance) bulunabilir.

## Diğer WebSocket sunucu uygulamaları

Aynı API'yi (özellikle [handleUpgrade](https://github.com/websockets/ws/blob/master/doc/ws.md#serverhandleupgraderequest-socket-head-callback) metodunu) sergileyen herhangi bir Websocket sunucu uygulaması kullanılabilir.

Örneğin, (şimdi kullanım dışı) [uws](https://www.npmjs.com/package/uws) paketinin bir çatalı olan [eiows](https://www.npmjs.com/package/eiows) paketini kullanabilirsiniz:


  

```sh
npm install eiows
```

  
  

```sh
yarn add eiows
```

  
  

```sh
pnpm add eiows
```

  


Ve ardından `wsEngine` seçeneğini kullanın:

```js
const { Server } = require("socket.io");
const eiows = require("eiows");

const io = new Server(3000, {
  wsEngine: eiows.Server
});
```

:::note

Bu uygulama "öncelikli olarak izin verir, ancak garanti etmez" önemli performans ve bellek kullanımı iyileştirmeleri sağlar. Her zamanki gibi, kendi kullanımınıza karşı test etmeyi unutmayın.

:::

## `µWebSockets.js` ile Kullanım {#usage-with-uwebsockets}

`4.4.0` sürümünden itibaren, bir Socket.IO sunucusu artık [`µWebSockets.js`](https://github.com/uNetworking/uWebSockets.js) sunucusuna bağlanabilir.

Kurulum:


  

```sh
npm install uWebSockets.js@uNetworking/uWebSockets.js#v20.4.0
```

  
  

```sh
yarn add uWebSockets.js@uNetworking/uWebSockets.js#v20.4.0
```

  
  

```sh
pnpm add uWebSockets.js@uNetworking/uWebSockets.js#v20.4.0
```

  


Kullanım:

```js
const { App } = require("uWebSockets.js");
const { Server } = require("socket.io");

const app = App();
const io = new Server();

io.attachApp(app);

io.on("connection", (socket) => {
  // ...
});

app.listen(3000, (token) => {
  if (!token) {
    console.warn("port already in use");
  }
});
```

## Çeşitli

### Bağımlılık ağacı

Sunucunun temel kurulumu **21** paketi içerir, bunlardan **6** tanesi ekibimiz tarafından bakım yapılmaktadır:

```
└─┬ socket.io@4.7.2
  ├─┬ accepts@1.3.8
  │ ├─┬ mime-types@2.1.35
  │ │ └── mime-db@1.52.0
  │ └── negotiator@0.6.3
  ├── base64id@2.0.0
  ├─┬ cors@2.8.5
  │ ├── object-assign@4.1.1
  │ └── vary@1.1.2
  ├─┬ debug@4.3.4
  │ └── ms@2.1.2
  ├─┬ engine.io@6.5.2
  │ ├── @types/cookie@0.4.1
  │ ├─┬ @types/cors@2.8.13
  │ │ └── @types/node@20.4.6 deduped
  │ ├── @types/node@20.4.6
  │ ├── accepts@1.3.8 deduped
  │ ├── base64id@2.0.0 deduped
  │ ├── cookie@0.4.2
  │ ├── cors@2.8.5 deduped
  │ ├── debug@4.3.4 deduped
  │ ├── engine.io-parser@5.2.1
  │ └─┬ ws@8.11.0
  │   ├── UNMET OPTIONAL DEPENDENCY bufferutil@^4.0.1
  │   └── UNMET OPTIONAL DEPENDENCY utf-8-validate@^5.0.2
  ├─┬ socket.io-adapter@2.5.2
  │ └── ws@8.11.0 deduped
  └─┬ socket.io-parser@4.2.4
    ├── @socket.io/component-emitter@3.1.0
    └── debug@4.3.4 deduped
```

:::info

Üçüncü taraf paketler için tip bildirimleri dahil edilmiştir, böylece kütüphanenin TypeScript kullanıcıları için kullanımını kolaylaştırabiliriz (ama hafif daha büyük bir paket maliyeti ile).

Ayrıca bakınız: https://github.com/microsoft/types-publisher/issues/81#issuecomment-234051345

:::


### Geçici sürümler

`engine.io` paketi, düşük seviyeli bağlantıları (HTTP uzun bekletme veya WebSocket) yönetmekten sorumlu olan motoru getirir. Ayrıca bakın: `Nasıl çalışır`

| `socket.io` sürümü | `engine.io` sürümü | `ws` sürümü |
|---------------------|---------------------|--------------|
| `4.8.x`             | `6.6.x`             | `8.17.x`     |
| `4.7.x`             | `6.5.x`             | `8.17.x`     |
| `4.6.x`             | `6.4.x`             | `8.11.x`     |
| `4.5.x`             | `6.2.x`             | `8.2.x`      |
| `4.4.x`             | `6.1.x`             | `8.2.x`      |
| `4.3.x`             | `6.0.x`             | `8.2.x`      |
| `4.2.x`             | `5.2.x`             | `7.4.x`      |
| `4.1.x`             | `5.1.x`             | `7.4.x`      |
| `4.0.x`             | `5.0.x`             | `7.4.x`      |
| `3.1.x`             | `4.1.x`             | `7.4.x`      |
| `3.0.x`             | `4.0.x`             | `7.4.x`      |
| `2.5.x`             | `3.6.x`             | `7.5.x`      |
| `2.4.x`             | `3.5.x`             | `7.4.x`      |