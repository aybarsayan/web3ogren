---
title: Eğitim - Giriş
seoTitle: Socket.IO Eğitimi - Giriş
sidebar_position: 1
description: Socket.IO eğitimine hoş geldiniz. Bu eğitimde, basit bir sohbet uygulaması oluşturacağız. Her bilgi seviyesindeki kullanıcılar için idealdir.
tags: 
  - Socket.IO
  - Eğitim
  - Node.js
  - Gerçek Zamanlı İletişim
keywords: 
  - sohbet uygulaması
  - Node.js
  - Socket.IO
  - eğitim
---



## Başlarken

Socket.IO eğitimine hoş geldiniz!

Bu eğitimde basit bir sohbet uygulaması oluşturacağız. Node.JS veya Socket.IO hakkında neredeyse hiçbir temel bilgi gerektirmediği için, tüm bilgi seviyelerindeki kullanıcılar için idealdir.

## Giriş

LAMP (PHP) gibi popüler web uygulama yığınlarıyla bir sohbet uygulaması yazmak genellikle çok zordur. Sunucudan değişiklikler için sorgulama yapmayı, zaman damgalarını takip etmeyi gerektirir ve olması gerektiğinden çok daha yavaştır.

Soketler, çoğu gerçek zamanlı sohbet sisteminin mimarisi etrafında dönen çözümdür ve bir istemci ile bir sunucu arasında iki yönlü bir iletişim kanalı sağlar.

Bu, sunucunun istemcilere *mesaj gönderebileceği* anlamına gelir. Bir sohbet mesajı yazdığınızda, sunucunun mesajı alması ve tüm diğer bağlı istemcilere göndermesi fikridir.

## Bu eğitimi nasıl kullanacaksınız

### Araçlar

Herhangi bir metin editörü (basit bir metin editöründen [VS Code](https://code.visualstudio.com/) gibi tam bir IDE'ye kadar) bu eğitimi tamamlamak için yeterli olacaktır.

Ayrıca, her adımın sonunda, kodu doğrudan tarayıcınızdan çalıştırmanıza olanak tanıyan bazı çevrimiçi platformlara ([CodeSandbox](https://codesandbox.io) ve [StackBlitz](https://stackblitz.com) gibi) bir bağlantı bulacaksınız:

![CodeSandbox platformunun ekran görüntüsü](../../images/frameworks/socket.io/static/images/codesandbox.png)

### Söz dizimi ayarları

Node.js dünyasında modülleri import etmenin iki yolu vardır:

- standart yol: ECMAScript modülleri (veya ESM)

```js
import { Server } from "socket.io";
```

Referans: https://nodejs.org/api/esm.html

- eski yol: CommonJS

```js
const { Server } = require("socket.io");
```

Referans: https://nodejs.org/api/modules.html

Socket.IO her iki sözdizimini de destekler.

:::tip
Projelerinizde ESM sözdizimini kullanmanızı öneririz, ancak bazı paketlerin bu sözdizimini desteklememesi nedeniyle bu her zaman mümkün olmayabilir.
:::

Kolaylığınız için, eğitim boyunca her kod bloğu tercih ettiğiniz sözdizimini seçmenize olanak tanır:


  

```js
const { Server } = require("socket.io");
```

  
  

```js
import { Server } from "socket.io";
```

  


Hazır mısınız? Başlamak için "İleri"ye tıklayın.