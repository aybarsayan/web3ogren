---
title: Uygulama Yapısı
seoTitle: Server Application Structure
sidebar_position: 9
description: Bu bölüm, olay işleyicilerini nasıl kaydedeceğinizi ve farklı yöntemlerin avantajlarını açıklar.
tags: 
  - olay işleyicileri
  - yazılım geliştirme
  - node.js
  - socket.io
keywords: 
  - olay işleyicileri
  - yazılım geliştirme
  - node.js
  - socket.io
---
## Olay işleyicilerini kaydetme

:::info 
Aşağıda olay işleyicilerinizi nasıl kaydedebileceğinize dair iki öneri bulacaksınız. Lütfen bunların sadece öneriler olduğunu ve kesin kurallar olmadığını unutmayın. Kendi zevkinize göre uyarlayın!
:::

### Her dosya kendi olay işleyicilerini kaydeder

Burada, giriş noktası derli toplu tutulur, ancak olay dinleyicileri daha az keşfedilebilir olabilir (güçlü isimlendirme kuralı/ctrl+f yardımcı olacaktır).

`index.js`

```js
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer);

const registerOrderHandlers = require("./orderHandler");
const registerUserHandlers = require("./userHandler");

const onConnection = (socket) => {
  registerOrderHandlers(io, socket);
  registerUserHandlers(io, socket);
}

io.on("connection", onConnection);
```

`orderHandler.js`

```js
module.exports = (io, socket) => {
  const createOrder = (payload) => {
    // ...
  }

  const readOrder = (orderId, callback) => {
    // ...
  }

  socket.on("order:create", createOrder);
  socket.on("order:read", readOrder);
}
```

### Tüm olay işleyicileri `index.js` dosyasında kaydedilir

Burada, her olay adı aynı yerde bulunur, bu keşfedilebilirlik için harika ama orta/büyük bir uygulamada kontrol edilemez hale gelebilir.

`index.js`

```js
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer);

const { createOrder, readOrder } = require("./orderHandler")(io);
const { updatePassword } = require("./userHandler")(io);

const onConnection = (socket) => {
  socket.on("order:create", createOrder);
  socket.on("order:read", readOrder);

  socket.on("user:update-password", updatePassword);
}

io.on("connection", onConnection);
```

`orderHandler.js`

```js
module.exports = (io) => {
  const createOrder = function (payload) {
    const socket = this; // bu yüzden yukarıdaki 'function', çünkü bir ok fonksiyonu çalışmayacak
    // ...
  };

  const readOrder = function (orderId, callback) {
    // ...
  };

  return {
    createOrder,
    readOrder
  }
}
```

:::tip 
Her iki yöntemin de avantajlarını dikkate alarak projenizin ihtiyaçlarına uygun olanı seçin. 
:::