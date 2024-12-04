---
title: Çevrimdışı Davranış
seoTitle: Socket Bağlantısı Durumuna Göre Olay Yönetimi
sidebar_position: 4
description: Socket bağlı olmadığında yayımlanan olayların buffere alınması ve bu duruma yönelik çözümler hakkında bilgi verir. Olası senaryolar ve önerilen yaklaşımlar ele alınmaktadır.
tags: 
  - Socket
  - Olay Yönetimi
  - Bağlantı Durumu
  - JavaScript
keywords: 
  - socket
  - buffere alınmış olaylar
  - yeniden bağlantı
  - olay patlaması
---
## Buffere Alınmış Olaylar

Varsayılan olarak, Socket bağlı olmadığında yayımlanan herhangi bir olay, yeniden bağlanana kadar buffere alınacaktır.

Bu durum, çoğu durumda (yeniden bağlantı gecikmesi kısa olduğunda) faydalı olsa da, bağlantı yeniden sağlandığında büyük bir olay patlamasına neden olabilir. 

:::tip
Bağlantı durumunu kontrol etmek için Socket örneğinin `connected` niteliğini kullanabilirsiniz.
:::

Bu davranışı önlemek için, kullanım durumunuza bağlı olarak birkaç çözüm bulunmaktadır:

- Socket örneğinin `connected` niteliğini kullanın

```js
if (socket.connected) {
  socket.emit( /* ... */ );
} else {
  // ...
}
```

- `volatile olayları` kullanın

```js
socket.volatile.emit( /* ... */ );
```