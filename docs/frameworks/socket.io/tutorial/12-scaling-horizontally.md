---
title: Ders Adımı #9 - Yatay Ölçekleme
seoTitle: Yatay Ölçekleme ile Uygulama Yönetimi
sidebar_position: 11
description: Bu derste yatay ölçeklemenin temel kavramlarını öğreneceksiniz. Uygulamanızın daha fazla istemciyi desteklemesi için sunucu altyapısını nasıl geliştireceğiniz hakkında bilgi edineceksiniz.
tags: 
  - yatay ölçekleme
  - Socket.IO
  - Node.js
  - yazılım geliştirme
keywords: 
  - yatay ölçekleme
  - Socket.IO
  - Node.js
  - geliştirme
---




## Yatay Ölçekleme

Artık uygulamamız geçici ağ kesintilerine dirençli olduğuna göre, binlerce eş zamanlı istemciyi destekleyebilmek için **nasıl yatay ölçeklendirebileceğimizi** görelim.

:::note
- Yatay ölçekleme (aynı zamanda "ölçeklenme dışa" olarak da bilinir), yeni taleplere yanıt vermek için altyapınıza yeni sunucular eklemek anlamına gelir.
- Dikey ölçekleme (aynıca "ölçeklenme yukarı" olarak adlandırılır), mevcut altyapınıza daha fazla kaynak (işlem gücü, bellek, depolama, ...) eklemek anlamına gelir.
:::

**İlk adım:** mevcut makinadaki tüm çekirdekleri kullanmak. Varsayılan olarak, Node.js Javascript kodunuzu tek bir iş parçacığında çalıştırır, bu da 32 çekirdekli bir CPU ile bile yalnızca bir çekirdeğin kullanılacağı anlamına gelir. Neyse ki, Node.js [`cluster` modülü](https://nodejs.org/api/cluster.html#cluster), her çekirdek için bir işçi iş parçacığı oluşturmanın kolay bir yolunu sağlar.

Ayrıca, Socket.IO sunucuları arasında olayları iletmek için bir yönteme ihtiyacımız olacak. Bu bileşene **"Adaptör"** diyoruz.



Öyleyse, **cluster adaptörünü** kurmaya başlayalım:


  

```sh
npm install @socket.io/cluster-adapter
```

  
  

```sh
yarn add @socket.io/cluster-adapter
```

  
  

```sh
pnpm add @socket.io/cluster-adapter
```

  


Şimdi bunu bağlayalım:


  

```js title="index.js"
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
// highlight-start
const { availableParallelism } = require('node:os');
const cluster = require('node:cluster');
const { createAdapter, setupPrimary } = require('@socket.io/cluster-adapter');
// highlight-end

if (cluster.isPrimary) {
  // highlight-start
  const numCPUs = availableParallelism();
  // create one worker per available core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i
    });
  }
  
  // set up the adapter on the primary thread
  return setupPrimary();
  // highlight-end
}

async function main() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    // highlight-start
    // set up the adapter on each worker thread
    adapter: createAdapter()
    // highlight-end
  });

  // [...]

  // highlight-start
  // each worker will listen on a distinct port
  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
  // highlight-end
}

main();
```

  
  

```js title="index.js"
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
// highlight-start
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
// highlight-end

if (cluster.isPrimary) {
  // highlight-start
  const numCPUs = availableParallelism();
  // create one worker per available core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i
    });
  }
  
  // set up the adapter on the primary thread
  setupPrimary();
  // highlight-end
} else {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    // highlight-start
    // set up the adapter on each worker thread
    adapter: createAdapter()
    // highlight-end
  });

  // [...]

  // highlight-start
  // each worker will listen on a distinct port
  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
  // highlight-end
}
```

  


Hepsi bu! Bu, makinenizde mevcut olan her CPU için bir işçi iş parçacığı başlatır. Hadi bunu **eylemde** görelim:



Adres çubuğunda gördüğünüz gibi, her tarayıcı sekmesi farklı bir Socket.IO sunucusuna bağlıdır ve adaptör basitçe **`chat message`** olaylarını bunlar arasında iletmektedir.

:::tip
Şu anda 5 resmi adaptör uygulaması bulunmaktadır:
- `Redis adaptörü`
- `Redis Streams adaptörü`
- `MongoDB adaptörü`
- `Postgres adaptörü`
- `Cluster adaptörü`

Böylece ihtiyaçlarınıza en uygun olanı seçebilirsiniz. Ancak, bazı uygulamaların Bağlantı durumu geri yükleme özelliğini desteklemediğini lütfen unutmayın, uyumluluk matrisini `buradan` bulabilirsiniz.
:::

:::note
Çoğu durumda, bir Socket.IO oturumunun tüm HTTP isteklerinin aynı sunucuya ulaşmasını sağlamak (aynı zamanda "yapışkan oturum" olarak da bilinir) gerekir. Ancak burada bunun gerekli olmadığını, çünkü her Socket.IO sunucusunun kendi portuna sahip olduğunu unutmamak gerekir.

Daha fazla bilgi `burada`.
:::

Ve nihayetinde bu sohbet uygulamamızı tamamlıyor! Bu tutorialda şu konuları inceledik:
- istemci ile sunucu arasında bir olay gönderme
- bir olayı tüm veya bağlı istemcilerin bir alt kümesine yayınlama
- geçici kesintileri yönetme
- yatay ölçekleme

Socket.IO tarafından sağlanan özellikler hakkında daha iyi bir genel bakışa sahip olmalısınız. Şimdi kendi gerçek zamanlı uygulamanızı oluşturmaya hazırsınız!

:::info

  
  
Bu örneği tarayıcınızda doğrudan çalıştırabilirsiniz:
- [CodeSandbox](https://codesandbox.io/p/sandbox/github/socketio/chat-example/tree/cjs/step9?file=index.js)
- [StackBlitz](https://stackblitz.com/github/socketio/chat-example/tree/cjs/step9?file=index.js)

  
  
  
Bu örneği tarayıcınızda doğrudan çalıştırabilirsiniz:
- [CodeSandbox](https://codesandbox.io/p/sandbox/github/socketio/chat-example/tree/esm/step9?file=index.js)
- [StackBlitz](https://stackblitz.com/github/socketio/chat-example/tree/esm/step9?file=index.js)
- [Repl.it](https://replit.com/github/socketio/chat-example)

  

:::