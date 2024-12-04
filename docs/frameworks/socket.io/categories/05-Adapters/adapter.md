---
title: Adaptör
seoTitle: Socket.IO Adaptör Rehberi
sidebar_position: 1
description: Bir Adaptör, Socket.IO sunucularında olayları yönetmek için önemli bir bileşendir. Bu belge, adaptörlerin nasıl kullanılacağını ve özelliklerini açıklar.
tags: 
  - adaptör
  - Socket.IO
  - mikro hizmetler
  - yayıncı
keywords: 
  - adaptör
  - Socket.IO
  - mikro hizmet
  - yayıncı
---

Bir Adaptör, olayları tüm veya bir alt küme istemcilerine yaymaktan sorumlu bir sunucu tarafı bileşenidir.

Birden fazla Socket.IO sunucusuna ölçeklenirken, olayların tüm istemcilere doğru bir şekilde yönlendirilmesi için varsayılan bellekteki adaptörü başka bir uygulama ile değiştirmeniz gerekecektir.

:::tip
Ekip tarafından yönetilen adaptörlerin faydalarını keşfedin.
:::

İşte ekibimiz tarafından yönetilen adaptörlerin listesi:

- `Redis adaptörü`
- `Redis Streams adaptörü`
- `MongoDB adaptörü`
- `Postgres adaptörü`
- `Cluster adaptörü`
- `Google Cloud Pub/Sub adaptörü`
- `AWS SQS adaptörü`
- `Azure Service Bus adaptörü`

Ayrıca (harika!) topluluk tarafından yönetilen birkaç başka seçenek de bulunmaktadır:

- [AMQP](https://github.com/sensibill/socket.io-amqp) (örneğin RabbitMQ)
- [NATS](https://github.com/MickL/socket.io-nats-adapter)
- [NATS](https://github.com/distrue/socket.io-nats-adapter)

Lütfen, birden fazla Socket.IO sunucusu ve HTTP uzun süreli bekleme kullanırken yapışkan oturumların etkinleştirilmesinin hala gerekli olduğunu unutmayın. Daha fazla bilgi `burada`.

## API

Adaptör örneğine erişebilirsiniz:

```js
// ana boşluk
const mainAdapter = io.of("/").adapter; // UYARI! io.adapter() çalışmayacak
// özel boşluk
const adminAdapter = io.of("/admin").adapter;
```

`socket.io@3.1.0` sürümünden itibaren, her Adaptör örneği aşağıdaki olayları yayar:

- `create-room` (argüman: oda)
- `delete-room` (argüman: oda)
- `join-room` (argüman: oda, id)
- `leave-room` (argüman: oda, id)

:::note
Örnek kullanım senaryolarını görmek için aşağıya göz atabilirsiniz:
:::

Örnek:

```js
io.of("/").adapter.on("create-room", (room) => {
  console.log(`oda ${room} oluşturuldu`);
});

io.of("/").adapter.on("join-room", (room, id) => {
  console.log(`socket ${id} oda ${room}'a katıldı`);
});
```

## Yayımcı

Çoğu adaptör uygulaması, başka bir Node.js sürecinden Socket.IO sunucuları grubuna iletişim göndermeye olanak tanıyan kendi ilgili yayıcı paketine sahiptir.



Bu, örneğin, tüm istemcilerin mikro hizmet M1'e bağlandığı ve mikro hizmet M2'nin paketleri yaymak için yayıcıyı kullandığı bir mikro hizmet kurulumunda yararlı olabilir (tek yönlü iletişim).

## Yayımcı kılavuzu

```js
// tüm istemcilere
emitter.emit(/* ... */);

// "room1"deki tüm istemcilere
emitter.to("room1").emit(/* ... */);

// "room1"deki tüm istemcilere "room2"de olmayanlar
emitter.to("room1").except("room2").emit(/* ... */);

const adminEmitter = emitter.of("/admin");

// "admin" boşluğundaki tüm istemcilere
adminEmitter.emit(/* ... */);

// "admin" boşluğundaki tüm istemcilere ve "room1" odasındaki istemcilere
adminEmitter.to("room1").emit(/* ... */);
```

Yayıcı ayrıca `socket.io@4.0.0` sürümünde eklenen yardımcı yöntemleri de destekler:

- `socketsJoin()`

```js
// tüm Socket örneklerini "room1" odasına katılmasını sağla
emitter.socketsJoin("room1");

// "room1" odasındaki "admin" boşluğundaki tüm Socket örneklerini "room2" odasına katılmasını sağla
emitter.of("/admin").in("room1").socketsJoin("room2");
```

- `socketsLeave()`

```js
// tüm Socket örneklerinin "room1" odasından ayrılmasını sağla
emitter.socketsLeave("room1");

// "room1" odasındaki tüm Socket örneklerinin "room2" ve "room3" odalarından ayrılmasını sağla
emitter.in("room1").socketsLeave(["room2", "room3"]);

// "admin" boşluğunun "room1" odasındaki tüm Socket örneklerinin "room2" odasından ayrılmasını sağla
emitter.of("/admin").in("room1").socketsLeave("room2");
```

- `disconnectSockets()`

```js
// tüm Socket örneklerinin bağlantısını kes
emitter.disconnectSockets();

// "room1" odasındaki tüm Socket örneklerinin bağlantısını kes (ve düşük seviyedeki bağlantıyı iptal et)
emitter.in("room1").disconnectSockets(true);

// "admin" boşluğundaki "room1" odasındaki tüm Socket örneklerinin bağlantısını kes
emitter.of("/admin").in("room1").disconnectSockets();

// bu ayrıca tek bir socket ID ile de çalışır
emitter.of("/admin").in(theSocketId).disconnectSockets();
```

- `serverSideEmit()`

```js
// kümenin tüm Socket.IO sunucularına bir olay yay
emitter.serverSideEmit("merhaba", "dünya");

// Socket.IO sunucusu (sunucu tarafı)
io.on("merhaba", (arg) => {
  console.log(arg); // "dünya"yı yazdırır
});
```