---
title: Socket.IO Nedir?
seoTitle: Socket.IO - Gerçek Zamanlı Web Uygulamaları için JavaScript Kütüphanesi
sidebar_position: 1
description: Socket.IO, gerçek zamanlı, çift yönlü ve olay tabanlı iletişim sağlayan güçlü bir JavaScript kütüphanesidir.
tags:
  - Socket.IO
  - JavaScript
  - WebSocket
  - Real-time
keywords:
  - Socket.IO
  - WebSocket
  - Real-time Communication
  - Event-Driven Programming
  - Node.js
---

Socket.IO, web uygulamalarında gerçek zamanlı, çift yönlü ve olay tabanlı iletişim sağlayan güçlü bir JavaScript kütüphanesidir. WebSocket protokolü üzerine inşa edilmiş olup, güvenilir ve geniş tarayıcı desteği sunar.

:::tip
Socket.IO, WebSocket'in desteklenmediği durumlarda otomatik olarak alternatif iletişim yöntemlerine geçiş yapabilir (Long Polling, vb.).
:::

## Temel Özellikler {#core-features}

### 1. Otomatik Yeniden Bağlanma {#auto-reconnection}

```javascript
const socket = io({
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});
```

### 2. Paket Tamponu {#packet-buffering}

Bağlantı kopukluğunda veri kaybını önler:

```javascript
socket.volatile.emit('ping', 'Bu mesaj bağlantı yoksa kaybolabilir');
```

### 3. Odalar ve Ad Alanları {#rooms-and-namespaces}

```javascript
// Server tarafı
io.on('connection', (socket) => {
  socket.join('oda1');
  io.to('oda1').emit('yeni-kullanıcı', 'Kullanıcı odaya katıldı');
});
```

## Kurulum ve Temel Kullanım {#setup-and-basic-usage}

### Server Tarafı Kurulum {#server-setup}

```javascript
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı');
});

httpServer.listen(3000);
```

### Client Tarafı Kullanım {#client-usage}

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log('Sunucuya bağlandı');
});

socket.emit('mesaj', 'Merhaba Dünya!');
```

## İleri Düzey Özellikler {#advanced-features}

### 1. Middleware Kullanımı {#middleware}

```javascript
io.use((socket, next) => {
  if (socket.handshake.auth.token) {
    next();
  } else {
    next(new Error("Kimlik doğrulama başarısız"));
  }
});
```

:::warning
Middleware'ler bağlantı kurulmadan önce çalıştırılır. Hata yönetimi önemlidir!
:::

### 2. Özel Olaylar {#custom-events}

```javascript
// Server
io.on('connection', (socket) => {
  socket.on('özel-olay', (data, callback) => {
    // İşlem
    callback({ status: 'başarılı' });
  });
});

// Client
socket.emit('özel-olay', { data: 'test' }, (response) => {
  console.log(response.status);
});
```

### 3. Odalar ve Yayın {#broadcasting}

```javascript
io.on('connection', (socket) => {
  // Belirli bir odaya mesaj gönderme
  socket.to('oda1').emit('olay', 'mesaj');
  
  // Gönderen hariç herkese yayın
  socket.broadcast.emit('olay', 'mesaj');
});
```

## En İyi Pratikler {#best-practices}

1. **Hata Yönetimi**
```javascript
socket.on('connect_error', (error) => {
  console.log('Bağlantı hatası:', error);
});
```

2. **Bağlantı Durumu Kontrolü**
```javascript
if (socket.connected) {
  socket.emit('olay', 'mesaj');
}
```

:::info
Üretim ortamında SSL/TLS kullanmak güvenlik açısından önemlidir.
:::

## Örnek Kullanım Senaryoları {#use-cases}

1. Gerçek zamanlı sohbet uygulamaları
2. Çok oyunculu oyunlar
3. Canlı analitik panelleri
4. İşbirlikçi döküman düzenleme
5. IOT cihaz izleme sistemleri

## Performans İpuçları {#performance-tips}

### 1. Binary Veriler {#binary-data}

```javascript
socket.binary(true).emit('binary-olay', binaryData);
```

### 2. Sıkıştırma {#compression}

```javascript
const io = new Server(httpServer, {
  compression: true
});
```

## Sonuç {#conclusion}

Socket.IO, gerçek zamanlı web uygulamaları geliştirmek için güçlü ve güvenilir bir çözümdür. WebSocket protokolünün tüm avantajlarını sunarken, geniş tarayıcı desteği ve otomatik geri dönüş mekanizmaları ile öne çıkar.

:::tip Başlarken
Daha detaylı bilgi için [resmi Socket.IO dokümantasyonunu](https://socket.io/docs/v4/) inceleyebilirsiniz.
:::