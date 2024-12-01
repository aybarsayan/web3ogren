---
title: "BroadcastChannel"
description: Deno Deploy'de BroadcastChannel API'sinin nasıl kullanılacağını ve farklı sekmelerin mesajlaşmasını sağlayan bir iletişim mekanizmasını keşfedin. Bu içerik, `BroadcastChannel` yapıcısını, özelliklerini ve metodlarını açıklamaktadır.
keywords: [Deno Deploy, BroadcastChannel, API, mesajlaşma, iletişim mekanizması]
oldUrl:
  - /deploy/docs/runtime-broadcast-channel/
  - /deploy/manual/runtime-broadcast-channel
---

Deno Deploy'de kod, istemciye en yakın veri merkezinde istekleri hizmet vererek gecikmeyi azaltmak için dünya çapında farklı veri merkezlerinde çalıştırılır. Tarayıcıda, [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) API'si aynı kökene sahip farklı sekmelerin mesaj alışverişinde bulunmasını sağlar. Deno Deploy'de, BroadcastChannel API'si çeşitli örnekler arasında bir iletişim mekanizması sağlar; dünya çapındaki çeşitli Deploy örneklerini bağlayan basit bir mesaj aktarım sistemidir.

## Yapıcı

`BroadcastChannel()` yapıcı fonksiyonu yeni bir `BroadcastChannel` örneği oluşturur ve sağlanan kanala bağlanır (veya onu oluşturur).

```ts
let channel = new BroadcastChannel(channelName);
```

#### Parametreler

| ad          | tür      | açıklama                                                |
| ----------- | -------- | ------------------------------------------------------- |
| channelName | `string` | Altyapı yayın kanalı bağlantısı için isim.              |

Yapıcı fonksiyonun dönüş türü bir `BroadcastChannel` örneğidir.

## Özellikler

| ad             | tür                     | açıklama                                                                                                   |
| ---------------| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| `name`         | `string`               | Altyapı yayın kanalının adı.                                                                               |
| `onmessage`    | `function` (veya `null`) | Kanal yeni bir mesaj aldığında yürütülen fonksiyon ([`MessageEvent`][messageevent]).                       |
| `onmessageerror` | `function` (veya `null`) | Gelen mesajın bir JavaScript veri yapısına deseralize edilemediğinde yürütülen fonksiyon.                 |

## Metotlar

| ad                     | açıklama                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `close()`              | Altyapı kanalına olan bağlantıyı kapatır. Kapatıldıktan sonra kanala mesaj göndermek mümkün değildir.                      |
| `postMessage(message)` | Altyapı kanalına bir mesaj gönderir. Mesaj bir dize, nesne literali, bir sayı veya her türlü [`Object`][object] olabilir. |

:::tip
`BroadcastChannel`, `EventTarget`'ı genişleterek `BroadcastChannel` örneği üzerinde `addEventListener` ve `removeEventListener` gibi `EventTarget` metotlarını kullanmanıza olanak tanır.
:::

## Örnek: Durum bilgilerini örnekler arasında güncelleme

`BroadcastChannel` tarafından sağlanan bir mesaj aktarım sisteminin bir kullanım durumu, ağ boyunca farklı veri merkezlerinde çalışan izolasyonlar arasında veri olan bellekteki bir önbelleği güncellemektir. Aşağıdaki örnekte, `BroadcastChannel` kullanarak sunucunun tüm çalışan örnekleri arasında durumu senkronize edebilmek için basit bir sunucu nasıl yapılandırabileceğinizi gösteriyoruz.

```ts
import { Hono } from "https://deno.land/x/hono/mod.ts";

// mesajların bellek içi önbelleği
const messages = [];

// Tüm izolasyonlar tarafından kullanılan bir BroadcastChannel
const channel = new BroadcastChannel("all_messages");

// Diğer örneklerden yeni bir mesaj geldiğinde, ekleyin
channel.onmessage = (event: MessageEvent) => {
  messages.push(event.data);
};

// Mesaj eklemek ve almak için bir sunucu oluşturun
const app = new Hono();

// Listeye bir mesaj ekleyin
app.get("/send", (c) => {
  // Yeni mesajlar "message" sorgu parametresi eklenerek eklenebilir
  const message = c.req.query("message");
  if (message) {
    messages.push(message);
    channel.postMessage(message);
  }
  return c.redirect("/");
});

// Mesajların listesini alın
app.get("/", (c) => {
  // Geçerli mesajlar listesini döndürün
  return c.json(messages);
});

Deno.serve(app.fetch);
```

Bu örneği Deno Deploy üzerinde [bu oyun alanı](https://dash.deno.com/playground/broadcast-channel-example) kullanarak kendiniz test edebilirsiniz.

[eventtarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
[messageevent]: https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object