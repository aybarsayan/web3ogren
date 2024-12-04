---
title: Eğitim Adımı #5 - Yayınlama
seoTitle: Yayınlama - Socket.IO Kullanımı
sidebar_position: 4
description: Bu bölümde, Socket.IO aracılığıyla etkinlik göndermeyi öğreneceksiniz. Herkese etkinlik gönderimi ve belirli kullanıcılara mesaj gönderimini keşfedeceksiniz.
tags: 
  - Socket.IO
  - Yayınlama
  - JavaScript
  - Web Geliştirme
keywords: 
  - Socket.IO
  - yayım
  - etkinlik
  - JavaScript
  - web uygulamaları
---



## Yayınlama

Bir sonraki hedefimiz, sunucudan diğer kullanıcılara etkinlik göndermektir. 

:::tip
Herkese etkinlik göndermek için Socket.IO, `io.emit()` yöntemini sağlar.
:::

```js
// bu, tüm bağlı soketlere etkinliği gönderir
io.emit('hello', 'world'); 
```

Belirli bir yayım yapan soket haricindeki tüm kullanıcılara mesaj göndermek isterseniz, o soketten yayım yapmak için `broadcast` bayrağını kullanabiliriz:

```js
io.on('connection', (socket) => {
  socket.broadcast.emit('hi');
});
```

Bu durumda, basitlik açısından, göndericiyi de dahil ederek herkese mesajı göndereceğiz:

```js
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});
```

Ve istemci tarafında `chat message` olayını yakaladığımızda, bunu sayfada dahil edeceğiz.


  

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();

  const form = document.getElementById('form');
  const input = document.getElementById('input');
  // highlight-start
  const messages = document.getElementById('messages');
  // highlight-end

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });

  // highlight-start
  socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
  // highlight-end
</script>
```

  
  

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();

  var form = document.getElementById('form');
  var input = document.getElementById('input');
  // highlight-start
  var messages = document.getElementById('messages');
  // highlight-end

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });

  // highlight-start
  socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
  // highlight-end
</script>
```

  


Bunu eylemde görelim:



:::info

  

Bu örneği doğrudan tarayıcınızda çalıştırabilirsiniz:

- [CodeSandbox](https://codesandbox.io/p/sandbox/github/socketio/chat-example/tree/cjs/step5?file=index.js)
- [StackBlitz](https://stackblitz.com/github/socketio/chat-example/tree/cjs/step5?file=index.js)

  
  

Bu örneği doğrudan tarayıcınızda çalıştırabilirsiniz:

- [CodeSandbox](https://codesandbox.io/p/sandbox/github/socketio/chat-example/tree/esm/step5?file=index.js)
- [StackBlitz](https://stackblitz.com/github/socketio/chat-example/tree/esm/step5?file=index.js)

  

:::