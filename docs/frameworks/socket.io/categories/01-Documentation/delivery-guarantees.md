---
title: Teslimat garantileri
seoTitle: Socket.IO Teslimat Garantileri
sidebar_position: 3
description: Bu belge, Socket.IOnun mesaj sıralama ve teslimat garantilerini açıklamaktadır. Mesajların nasıl iletildiği ve bağlantı kopmaları durumunda neler olabileceği konularında bilgi sunar.
tags: 
  - Socket.IO
  - teslimat garantileri
  - mesaj sıralama
  - istemci sunucu iletişimi
keywords: 
  - Socket.IO
  - teslimat garantileri
  - olay gönderimi
  - bağlantı kopması
---
## Mesaj sıralama

Socket.IO, hangi düşük düzey taşıma kullanılırsa kullanılsın (HTTP uzun bekletmeden WebSocket'e geçiş sırasında bile) mesaj sıralamasını garanti etmektedir.

Bu, aşağıdakiler sayesinde gerçekleştirilir:

- Temel TCP bağlantısının sağladığı garantiler
- `Yükseltme mekanizmasının` dikkatli tasarımı

Örnek:

```js
socket.emit("event1");
socket.emit("event2");
socket.emit("event3");
```

Yukarıdaki örnekte, olaylar her zaman diğer taraf tarafından aynı sırayla alınacaktır (gerçekten var oldukları sürece, `aşağıda` bakın).

## Mesaj varışı

### En fazla bir kez

Varsayılan olarak, Socket.IO, teslimat için **en fazla bir kez** garantisi sağlar:

- Bir olay gönderilirken bağlantı koparsa, diğer tarafın bunu alıp almadığına dair bir garanti yoktur ve yeniden bağlantı sağlandığında tekrar deneyemiyecektir.
- Bağlantısı kopmuş bir istemci, `yeniden bağlantı sağlanana kadar olayları tamponlayacaktır` (ancak önceki nokta hala geçerlidir).
- Sunucuda böyle bir tampon yoktur, bu da demektir ki, bağlantısı kopmuş bir istemcinin kaçırdığı herhangi bir olay, yeniden bağlantı sağlandığında o istemciye iletilmeyecektir.

:::info
Şu anda, ek teslimat garantileri uygulamanızda uygulanmalıdır.
:::

### En az bir kez

#### İstemciden sunucuya

İstemci tarafında, `onaylar ve zaman aşımı` ile **en az bir kez** garantisi elde edebilirsiniz:

```js
function emit(socket, event, arg) {
  socket.timeout(2000).emit(event, arg, (err) => {
    if (err) {
      // Sunucudan onay yok, yeniden deneyelim.
      emit(socket, event, arg);
    }
  });
}

emit(socket, "foo", "bar");
```

Yukarıdaki örnekte, istemci belirli bir gecikmeden sonra olayı göndermeyi yeniden deneyecektir, bu nedenle sunucu aynı olayı birkaç kez alabilir.

:::caution
Bu durumda, kullanıcı sekmesini yenilerse herhangi bir bekleyen olay kaybolacaktır.
:::

#### Sunucudan istemciye

Sunucu tarafından gönderilen olaylar için ek teslimat garantileri şu şekilde uygulanabilir:

- Her olaya benzersiz bir kimlik atama
- Olayları bir veritabanında saklama
- İstemci tarafında son alınan olayın ofsetini saklama ve yeniden bağlantı sağlandığında bunu gönderme

Örnek:

*İstemci*

```js
const socket = io({
  auth: {
    offset: undefined
  }
});

socket.on("my-event", ({ id, data }) => {
  // Verilerin üzerinde bir şey yap ve sonra ofseti güncelle
  socket.auth.offset = id;
});
```

*Sunucu*

```js
io.on("connection", async (socket) => {
  const offset = socket.handshake.auth.offset;
  if (offset) {
    // Bu bir yeniden bağlantı
    for (const event of await fetchMissedEventsFromDatabase(offset)) {
      socket.emit("my-event", event);
    }
  } else {
    // Bu ilk bağlantı
  }
});

setInterval(async () => {
  const event = {
    id: generateUniqueId(),
    data: new Date().toISOString()
  }

  await persistEventToDatabase(event);
  io.emit("my-event", event);
}, 1000);
```

Eksik yöntemlerin (`fetchMissedEventsFromDatabase()`, `generateUniqueId()` ve `persistEventToDatabase()`) uygulanması veritabanına özgüdür ve okuyucuya bir alıştırma olarak bırakılmıştır.

### Referanslar

- `socket.auth` (istemci)
- `socket.handshake` (sunucu)