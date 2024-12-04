---
title: API - Genel Bakış
seoTitle: API Overview for Socket.IO
sidebar_position: 1
description: A concise overview of the Socket.IO API, covering common methods, acknowledgments, and events. Ideal for developers looking to understand the fundamental functionalities.
tags: 
  - API
  - Socket.IO
  - WebSockets
  - Real-time Communication
keywords: 
  - Socket.IO
  - WebSocket
  - API
  - communication
---

Daha fazla ilerlemeden önce, Socket.IO tarafından sağlanan API'nin kısa bir turunu yapalım:

## Ortak API

Aşağıdaki yöntemler, hem istemci hem de sunucu için kullanılabilir.

### Temel emit

`adım #4`'te gördüğümüz gibi, `socket.emit()` ile diğer tarafa herhangi bir veriyi gönderebilirsiniz:


  

*İstemci*

```js
socket.emit('hello', 'world');
```

*Sunucu*

```js
io.on('connection', (socket) => {
  socket.on('hello', (arg) => {
    console.log(arg); // 'world'
  });
});
```

  
  

*Sunucu*

```js
io.on('connection', (socket) => {
  socket.emit('hello', 'world');
});
```

*İstemci*

```js
socket.on('hello', (arg) => {
  console.log(arg); // 'world'
});
```

  


Herhangi bir sayıdaki argümanları gönderebilirsiniz ve tüm seri hale getirilebilir veri yapıları desteklenmektedir, bunlar arasında [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) veya [Buffer](https://nodejs.org/docs/latest/api/buffer.html#buffer_buffer) (sadece Node.js):


  

*İstemci*

```js
socket.emit('hello', 1, '2', { 3: '4', 5: Uint8Array.from([6]) });
```

*Sunucu*

```js
io.on('connection', (socket) => {
  socket.on('hello', (arg1, arg2, arg3) => {
    console.log(arg1); // 1
    console.log(arg2); // '2'
    console.log(arg3); // { 3: '4', 5: <Buffer 06> }
  });
});
```

  
  

*Sunucu*

```js
io.on('connection', (socket) => {
  socket.emit('hello', 1, '2', { 3: '4', 5: Buffer.from([6]) });
});
```

*İstemci*

```js
socket.on('hello', (arg1, arg2, arg3) => {
  console.log(arg1); // 1
  console.log(arg2); // '2'
  console.log(arg3); // { 3: '4', 5: ArrayBuffer (1) [ 6 ] }
});
```

  


:::tip

Nesneler üzerinde `JSON.stringify()` çağrısı yapmak gerekmez:

```js
// KÖTÜ
socket.emit('hello', JSON.stringify({ name: 'John' }));

// İYİ
socket.emit('hello', { name: 'John' });
```

:::

### Onaylar

Olaylar harika, ancak bazı durumlarda daha klasik bir istek-yanıt API'si isteyebilirsiniz. Socket.IO'da, bu özellik "onaylar" olarak adlandırılır.

İki versiyonu vardır:

#### Bir geri çağırma işlevi ile

Son argüman olarak `emit()` fonksiyonuna bir geri çağırma ekleyebilirsiniz ve bu geri çağırma, diğer taraf etkinliği onayladığında çağrılacaktır:


  

*İstemci*

```js
socket.timeout(5000).emit('request', { foo: 'bar' }, 'baz', (err, response) => {
  if (err) {
    // sunucu belirlenen süre içinde olayı onaylamadı
  } else {
    console.log(response.status); // 'ok'
  }
});
```

*Sunucu*

```js
io.on('connection', (socket) => {
  socket.on('request', (arg1, arg2, callback) => {
    console.log(arg1); // { foo: 'bar' }
    console.log(arg2); // 'baz'
    callback({
      status: 'ok'
    });
  });
});
```

  
  

*Sunucu*

```js
io.on('connection', (socket) => {
  socket.timeout(5000).emit('request', { foo: 'bar' }, 'baz', (err, response) => {
    if (err) {
      // istemci belirlenen süre içinde olayı onaylamadı
    } else {
      console.log(response.status); // 'ok'
    }
  });
});
```

*İstemci*

```js
socket.on('request', (arg1, arg2, callback) => {
  console.log(arg1); // { foo: 'bar' }
  console.log(arg2); // 'baz'
  callback({
    status: 'ok'
  });
});
```

  


#### Bir Promise ile

`emitWithAck()` yöntemi aynı işlevselliği sağlar, ancak diğer taraf olayı onayladığında çözülecek bir Promise döner:


  

*İstemci*

```js
try {
  const response = await socket.timeout(5000).emitWithAck('request', { foo: 'bar' }, 'baz');
  console.log(response.status); // 'ok'
} catch (e) {
  // sunucu belirlenen süre içinde olayı onaylamadı
}
```

*Sunucu*

```js
io.on('connection', (socket) => {
  socket.on('request', (arg1, arg2, callback) => {
    console.log(arg1); // { foo: 'bar' }
    console.log(arg2); // 'baz'
    callback({
      status: 'ok'
    });
  });
});
```

  
  

*Sunucu*

```js
io.on('connection', async (socket) => {
  try {
    const response = await socket.timeout(5000).emitWithAck('request', { foo: 'bar' }, 'baz');
    console.log(response.status); // 'ok'
  } catch (e) {
    // istemci belirlenen süre içinde olayı onaylamadı
  }
});
```

*İstemci*

```js
socket.on('request', (arg1, arg2, callback) => {
  console.log(arg1); // { foo: 'bar' }
  console.log(arg2); // 'baz'
  callback({
    status: 'ok'
  });
});
```

  


:::caution

[Promise'leri desteklemeyen](https://caniuse.com/promises) ortamlarda (örneğin Internet Explorer) bir polyfill eklenmesi veya bu özelliği kullanmak için [babel](https://babeljs.io/) gibi bir derleyici kullanılması gerekecektir (ancak bu, bu eğitimin kapsamının dışında).

:::

### Tüm olayları dinleyen dinleyiciler

Bir tüm olayları dinleyen dinleyici, gelen her olay için çağrılan bir dinleyicidir. Bu, uygulamanızı debug etmek için kullanışlıdır:

*Gönderici*

```js
socket.emit('hello', 1, '2', { 3: '4', 5: Uint8Array.from([6]) });
```

*Alıcı*

```js
socket.onAny((eventName, ...args) => {
  console.log(eventName); // 'hello'
  console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
});
```

Benzer şekilde, giden paketler için:

```js
socket.onAnyOutgoing((eventName, ...args) => {
  console.log(eventName); // 'hello'
  console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
});
```

## Sunucu API'si

### Yayınlama

`adım #5`'te gördüğümüz gibi, `io.emit()` ile tüm bağlı istemcilere bir olayı yayınlayabilirsiniz:

```js
io.emit('hello', 'world');
```



### Odalar

Socket.IO terminolojisinde, bir *oda* soketlerin katılabileceği ve çıkabileceği keyfi bir kanaldır. Bağlı istemcilerin bir alt kümesine olay yayınlamak için kullanılabilir:

```js
io.on('connection', (socket) => {
  // 'some room' adlı odaya katıl
  socket.join('some room');
  
  // odaya bağlı tüm istemcilere yayın yap
  io.to('some room').emit('hello', 'world');

  // odaya bağlı olanlar hariç tüm istemcilere yayın yap
  io.except('some room').emit('hello', 'world');

  // odadan çık
  socket.leave('some room');
});
```



Temel olarak bu kadar! Gelecek için referans olarak, tüm API `burada` (sunucu) ve `burada` (istemci) bulunmaktadır.