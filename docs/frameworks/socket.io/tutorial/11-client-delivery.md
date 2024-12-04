---
title: Müşteri Teslimatı - Eğitim Adımı #8
seoTitle: Müşteri Teslimatı Eğitimi - Adım #8
sidebar_position: 8
description: Bu sayfada, Socket.IO kullanımında müşteri teslimatının nasıl güvence altına alındığı ele alındı. Farklı teslimat garantileri ve kullanım senaryoları açıklanmaktadır.
tags: 
  - Socket.IO
  - Müşteri Teslimatı
  - Olay Yönetimi
keywords: 
  - Socket.IO
  - Olay Yönetimi
  - Müşteri Teslimatı
  - Yazılım Geliştirici
---



## Müşteri Teslimatı

Sunucunun her zaman müşteriler tarafından gönderilen mesajları aldığından nasıl emin olabileceğimizi görelim.

:::info
Varsayılan olarak, Socket.IO "en fazla bir kez" teslimat garantisi sağlar (aynı zamanda "ateşle ve unut" olarak da bilinir), bu da mesajın sunucuya ulaşmaması durumunda tekrar deneme yapılmayacağı anlamına gelir.
:::

## Tamponlanmış olaylar

Bir istemci bağlantısını kestiğinde, `socket.emit()` çağrıları yeniden bağlantı kurulana kadar tamponlanır:



Yukarıdaki videoda, "gerçek zamanlı" mesaj bağlantı yeniden sağlanana kadar tamponlanır.

Bu davranış uygulamanız için tamamen yeterli olabilir. Ancak, bir mesajın kaybolabileceği birkaç durum vardır:

- Olay gönderilirken bağlantı kopar
- Olay işlenirken sunucu çökebilir veya yeniden başlatılabilir
- Veritabanı geçici olarak kullanılamaz hale gelebilir

## En az bir kez

"En az bir kez" garantisini uygulayabiliriz:

- Manuel olarak bir onay ile:

```js
function emit(socket, event, arg) {
  socket.timeout(5000).emit(event, arg, (err) => {
    if (err) {
      // sunucudan onay yok, tekrar deneyelim
      emit(socket, event, arg);
    }
  });
}

emit(socket, 'merhaba', 'dünya');
```

- Veya `retries` seçeneği ile:

```js
const socket = io({
  ackTimeout: 10000,
  retries: 3
});

socket.emit('merhaba', 'dünya');
```

Her iki durumda da istemci, sunucudan onay alana kadar mesajı göndermeye tekrar deneyecektir:

```js
io.on('connection', (socket) => {
  socket.on('merhaba', (value, callback) => {
    // olay başarıyla işlendiğinde
    callback();
  });
})
```

:::tip
`retries` seçeneği ile mesajların sırası garanti altındadır, çünkü mesajlar sıraya alındığı ve bir bir şekilde gönderildiği için. Bu, ilk seçenek için geçerli değildir.
:::

## Tam olarak bir kez

Tekrarlarla ilgili sorun, sunucunun artık aynı mesajı birden fazla kez alabileceğidir, bu nedenle her mesajı benzersiz bir şekilde tanımlamak ve bunu veritabanında yalnızca bir kez saklamak için bir yol bulması gerekir.

Sohbet uygulamamızda "tam olarak bir kez" garantisini nasıl uygulayabileceğimize bakalım.

Her mesaja istemci tarafında benzersiz bir tanımlayıcı atayarak başlayacağız:


  

```html title="index.html"
<script>
  // dikkat çekilecek satır
  let counter = 0;

  const socket = io({
    auth: {
      serverOffset: 0
    },
    // dikkat çekmeye başlanacak
    // tekrar denemeyi etkinleştir
    ackTimeout: 10000,
    retries: 3,
    // dikkat çekmeyi sona erdi
  });

  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      // dikkat çekmeye başlanacak
      // benzersiz bir offset hesapla
      const clientOffset = `${socket.id}-${counter++}`;
      socket.emit('sohbet mesajı', input.value, clientOffset);
      // dikkat çekmeyi sona erdi
      input.value = '';
    }
  });

  socket.on('sohbet mesajı', (msg, serverOffset) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    socket.auth.serverOffset = serverOffset;
  });
</script>
```

  
  

```html title="index.html"
<script>
  // dikkat çekilecek satır
  var counter = 0;

  var socket = io({
    auth: {
      serverOffset: 0
    },
    // dikkat çekmeye başlanacak
    // tekrar denemeyi etkinleştir
    ackTimeout: 10000,
    retries: 3,
    // dikkat çekmeyi sona erdi
  });

  var form = document.getElementById('form');
  var input = document.getElementById('input');
  var messages = document.getElementById('messages');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      // dikkat çekmeye başlanacak
      // benzersiz bir offset hesapla
      var clientOffset = `${socket.id}-${counter++}`;
      socket.emit('sohbet mesajı', input.value, clientOffset);
      // dikkat çekmeyi sona erdi
      input.value = '';
    }
  });

  socket.on('sohbet mesajı', function(msg, serverOffset) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    socket.auth.serverOffset = serverOffset;
  });
</script>
```

  


:::note
`socket.id` niteliği, her bağlantıya atanan rastgele 20 karakterden oluşan bir tanımlayıcıdır.

Ayrıca, benzersiz bir offset oluşturmak için [`getRandomValues()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) kullanmış olabilirdik.
:::

Sonrasında bu offset'i mesajla birlikte sunucu tarafında saklarız:

```js title="index.js"
// [...]

io.on('connection', async (socket) => {
  // dikkat çekilecek satır
  socket.on('sohbet mesajı', async (msg, clientOffset, callback) => {
    let result;
    try {
      // dikkat çekilecek satır
      result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
    } catch (e) {
      // dikkat çekmeye başlanacak
      if (e.errno === 19 /* SQLITE_CONSTRAINT */ ) {
        // mesaj zaten eklendi, bu yüzden istemciyi bilgilendiriyoruz
        callback();
      } else {
        // yapılacak bir şey yok, istemcinin tekrar denemesi yeter
      }
      return;
      // dikkat çekmeyi sona erdi
    }
    io.emit('sohbet mesajı', msg, result.lastID);
    // dikkat çekmeye başlanacak
    // olayı onaylayın
    callback();
    // dikkat çekmeyi sona erdi
  });

  if (!socket.recovered) {
    try {
      await db.each('SELECT id, content FROM messages WHERE id > ?',
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit('sohbet mesajı', row.content, row.id);
        }
      )
    } catch (e) {
      // bir şeyler yanlış gitti
    }
  }
});

// [...]
```

Bu şekilde, `client_offset` sütunundaki UNIQUE kısıtlaması mesajın çiftlenmesini önler.

:::caution
Olayı onaylamayı unutmayın, aksi takdirde istemci tekrar denemeye devam edecektir (en fazla `retries` kadar). 

```js
socket.on('sohbet mesajı', async (msg, clientOffset, callback) => {
  // ... ve nihayet
  callback();
});
```
:::

:::info
Tekrar, varsayılan garanti ("en fazla bir kez") uygulamanız için yeterli olabilir, ancak artık daha güvenilir hale getirileceğini biliyorsunuz.
:::

Sonraki adımda, uygulamamızı yatay olarak nasıl ölçeklendirebileceğimizi göreceğiz.

:::info


  

Bu örneği doğrudan tarayıcınızda çalıştırabilirsiniz:

- [CodeSandbox](https://codesandbox.io/p/sandbox/github/socketio/chat-example/tree/cjs/step8?file=index.js)
- [StackBlitz](https://stackblitz.com/github/socketio/chat-example/tree/cjs/step8?file=index.js)

  
  

Bu örneği doğrudan tarayıcınızda çalıştırabilirsiniz:

- [CodeSandbox](https://codesandbox.io/p/sandbox/github/socketio/chat-example/tree/esm/step8?file=index.js)
- [StackBlitz](https://stackblitz.com/github/socketio/chat-example/tree/esm/step8?file=index.js)

  

:::