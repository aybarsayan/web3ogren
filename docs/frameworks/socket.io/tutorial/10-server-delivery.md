---
title: Tutorial adım #7 - Sunucu teslimatı
seoTitle: Sunucu Teslimatı Eğitimi
sidebar_position: 11
description: Bu bölümde, sunucu teslimatı sürecini ve SQLite kullanarak mesajların kalıcı hale getirilmesini öğreneceksiniz.
tags: 
  - sunucu teslimatı
  - SQLite
  - chat uygulaması
  - Node.js
keywords: 
  - sunucu teslimatı
  - SQLite
  - chat uygulaması
  - Node.js
---



## Sunucu teslimatı

Bağlantı yeniden sağlandığında istemcinin durumunu senkronize etmenin iki yaygın yolu vardır:

- ya sunucu tüm durumu gönderir
- ya da istemci işlediği son olayı takip eder ve sunucu eksik parçaları gönderir

Her ikisi de tamamen geçerli çözümlerdir ve birini seçmek kullanım durumunuza bağlıdır. Bu eğitimde, ikincisini tercih edeceğiz.

Öncelikle, sohbet uygulamamızın mesajlarını kalıcı hale getirelim. Bugün birçok harika seçenek var, burada [SQLite](https://www.sqlite.org/) kullanacağız.

:::tip
Eğer SQLite ile tanışık değilseniz, [bu](https://www.sqlitetutorial.net/) gibi çevrimiçi birçok eğitim bulunmaktadır.
:::

Gerekli paketleri kuralım:


  
  
```sh
npm install sqlite sqlite3
```

  
  

```sh
yarn add sqlite sqlite3
```

  
  

```sh
pnpm add sqlite sqlite3
```

  


Her mesajı bir SQL tablosunda saklayacağız:


  

```js title="index.js"
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
// highlight-start
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
// highlight-end

async function main() {
  // highlight-start
  // veritabanı dosyasını aç
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

  // 'messages' tablomuzu oluştur (şu aşamada 'client_offset' sütununu yoksayabilirsiniz)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `);
  // highlight-end

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {}
  });

  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

  io.on('connection', (socket) => {
    socket.on('chat message', async (msg) => {
      // highlight-start
      let result;
      try {
        // mesajı veritabanında sakla
        result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
      } catch (e) {
        // TODO başarısızlığı ele al
        return;
      }
      // mesaj ile birlikte offset'i dahil et
      io.emit('chat message', msg, result.lastID);
      // highlight-end
    });
  });

  server.listen(3000, () => {
    console.log('sunucu http://localhost:3000 adresinde çalışıyor');
  });
}

main();
```

  
  

```js title="index.js"
import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
// highlight-start
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// veritabanı dosyasını aç
const db = await open({
  filename: 'chat.db',
  driver: sqlite3.Database
});

// 'messages' tablomuzu oluştur (şu aşamada 'client_offset' sütununu yoksayabilirsiniz)
await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
  );
`);
// highlight-end

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('chat message', async (msg) => {
    // highlight-start
    let result;
    try {
      // mesajı veritabanında sakla
      result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
    } catch (e) {
      // TODO başarısızlığı ele al
      return;
    }
    // mesaj ile birlikte offset'i dahil et
    io.emit('chat message', msg, result.lastID);
    // highlight-end
  });
});

server.listen(3000, () => {
  console.log('sunucu http://localhost:3000 adresinde çalışıyor');
});
```

  


İstemci daha sonra offset'i takip edecektir:


  

```html title="index.html"
<script>
  // highlight-start
  const socket = io({
    auth: {
      serverOffset: 0
    }
  });
  // highlight-end

  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });

  // highlight-next-line
  socket.on('chat message', (msg, serverOffset) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    // highlight-next-line
    socket.auth.serverOffset = serverOffset;
  });
</script>
```

  
  

```html title="index.html"
<script>
  // highlight-start
  var socket = io({
    auth: {
      serverOffset: 0
    }
  });
  // highlight-end

  var form = document.getElementById('form');
  var input = document.getElementById('input');
  var messages = document.getElementById('messages');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });

  // highlight-next-line
  socket.on('chat message', function(msg, serverOffset) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    // highlight-next-line
    socket.auth.serverOffset = serverOffset;
  });
</script>
```

  


Ve nihayetinde sunucu, (yeniden) bağlantı sağlandığında eksik mesajları gönderecektir:

```js title="index.js"
// [...]

io.on('connection', async (socket) => {
  socket.on('chat message', async (msg) => {
    let result;
    try {
      result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
    } catch (e) {
      // TODO başarısızlığı ele al
      return;
    }
    io.emit('chat message', msg, result.lastID);
  });

  // highlight-start
  if (!socket.recovered) {
    // bağlantı durumu kurtarılmadıysa
    try {
      await db.each('SELECT id, content FROM messages WHERE id > ?',
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit('chat message', row.content, row.id);
        }
      )
    } catch (e) {
      // bir şeyler yanlış gitti
    }
  }
  // highlight-end
});

// [...]
```

Şimdi bunu aksiyonda görelim:



Yukarıdaki videoda görebileceğiniz gibi, hem geçici bir bağlantı kesilmesinden sonra hem de tam bir sayfa yenilemesinden sonra çalışıyor.

:::tip
“Bağlantı durumu kurtarma” özelliği ile olan fark, başarılı bir kurtarmanın ana veritabanınıza ulaşmak zorunda olmamasıdır (örneğin mesajları bir Redis akışından alabilir).
:::

Tamam, şimdi istemci teslimatı hakkında konuşalım.