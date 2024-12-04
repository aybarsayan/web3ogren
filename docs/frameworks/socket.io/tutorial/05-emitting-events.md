---
title: Etap #4 - Olay Yayma
seoTitle: Olay Yayma - Socket.IO ile Gerçek Zamanlı İletişim
sidebar_position: 4
description: Socket.IO kullanarak bir olay gönderip almayı öğrenin. Kullanıcı mesaj gönderdikçe nasıl çalıştığını keşfedin.
tags: 
  - Socket.IO
  - olay yayma
  - gerçek zamanlı iletişim
  - JavaScript
keywords: 
  - Socket.IO
  - olay yayma
  - iletişim
  - JavaScript
---



## Olay Yayma

Socket.IO'nun arkasındaki ana fikir, istediğiniz herhangi bir olayı, istediğiniz herhangi bir veri ile gönderip alabilmenizdir. JSON olarak kodlanabilen herhangi bir nesne iş görecektir ve `ikili veriler` de desteklenmektedir.

Kullanıcı bir mesaj yazdığında, sunucunun bunu `chat message` olayı olarak almasını sağlayalım. `index.html` içindeki `script` bölümü aşağıdaki gibi görünmelidir:


  

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();

  const form = document.getElementById('form');
  const input = document.getElementById('input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });
</script>
```

  
  

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();

  var form = document.getElementById('form');
  var input = document.getElementById('input');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });
</script>
```

  


Ve `index.js` içinde `chat message` olayını yazdırıyoruz:

```js
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});
```

Sonuç aşağıdaki video gibi olmalıdır:



:::info
Bu örneği tarayıcınızda doğrudan çalıştırabilirsiniz:


  

- [CodeSandbox](https://codesandbox.io/p/sandbox/github/socketio/chat-example/tree/cjs/step4?file=index.js)
- [StackBlitz](https://stackblitz.com/github/socketio/chat-example/tree/cjs/step4?file=index.js)

  
  

- [CodeSandbox](https://codesandbox.io/p/sandbox/github/socketio/chat-example/tree/esm/step4?file=index.js)
- [StackBlitz](https://stackblitz.com/github/socketio/chat-example/tree/esm/step4?file=index.js)

  

:::