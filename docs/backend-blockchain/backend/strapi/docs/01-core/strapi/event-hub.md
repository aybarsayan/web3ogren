---
title: Etkinlik Merkezi
description: Etkinlik merkezi, Strapi uygulamasında çeşitli etkinlikleri işleyen merkezi bir sistemdir. Bu belge, etkinlik merkezinin tasarımını, yönetim yöntemlerini ve alternatiflerini incelemektedir.
keywords: [Strapi, etkinlik merkezi, eklentiler, yaşam döngüsü kancaları, performans, abonelik yönetimi]
---

# Etkinlik Merkezi

## Özeti

Etkinlik merkezi, Strapi uygulamasında çeşitli etkinlikleri işleyen merkezi bir sistemdir. Bu etkinlikler, ilişkili abone fonksiyonlarını tetiklemek için çeşitli kaynaklardan yayılabilir.

![](../../../../../images/cikti/backend/strapi/static/img/utils/event-hub-diagram.png)

_yukarıda: Etkinlik merkezinin farklı kaynaklardan gelen etkinlikleri nasıl işlediğini gösteren bir diyagram_

:::tip
Etkinlik merkezi, Strapi'de web kancaları ve denetim günlükleri gibi özellikleri güçlendirmek için önemli bir bileşendir.
:::

Etkinlikler genellikle Strapi'de web kancaları ve denetim günlükleri özelliklerini güçlendirmek için kullanılır. Ancak, eklenti geliştiricileri de eklenti API'sını kullanarak etkinlik merkezine erişebilir. Bu, eklentilerin Strapi tarafından yayımlanan etkinlikleri dinlemesine ve etkinlik merkezine yeni etkinlikler yaymasına olanak tanır.

## Detaylı Tasarım

Etkinlik merkezi, abone fonksiyonlarının bir deposudur. Hub'a bir etkinlik yayımlandığında, depodaki her abone fonksiyonu etkinliğin adı ve değişken sayıda argüman ile çağrılır.

> Bu tasarım, Strapi'nin [yaşam döngüsü kancaları](https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#lifecycle-hooks) ile nasıl çalıştığına ilham alınarak oluşturulmuştur. 
> — Strapi Geliştirme Ekibi

:::info
Tek bir özellik için bir abone fonksiyonu bulundurabilme yeteneğini sağladığı ve [hafıza sızıntısı endişelerine](https://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected) neden olmadığı için [Node.js etkinlik yayıcıyı](https://nodejs.org/api/events.html#class-eventemitter) tercih edilmiştir.
:::

### Etkinlik Yayma

#### `emit`

Hub'a yeni bir etkinlik gönderir. Tüm abonelerin çalışmasını sağladıktan sonra çözülen bir söz döndürür.

```ts
// Türler
type Emit = (name: string, ...args: any[]) => Promise<void>;

// Kullanım
strapi.eventHub.emit('some.event', { meta: 'data' });
```

### Aboneleri Yönetme

#### `subscribe`

Hub'a yayımlanan her etkinlik için çağrılacak bir abone fonksiyonu ekler. Aboneyi kaldırmak için kullanılabilecek bir fonksiyon döndürür.

```ts
// Türler
type Subscriber = (name: string, ...args: Object) => void | Promise<void>;
type UnsubscribeCallback = () => void;
type Subscribe = (subscriber: Subscriber) => UnsubscribeCallback;

// Abone ekle
const unsubcribe = strapi.eventHub.subscribe((name: string, ...args: any[]) => {
  // Abone lojiklerinizi buraya yazın
});

// Döndürülen fonksiyonu kullanarak aboneliği kaldır
unsubscribe();
```

#### `unsubscribe`

Bir abone fonksiyonunu kaldırır. Onu bir argüman olarak geçmek için abonenin referansını vermeniz gerekir.

```ts
// Türler
type Subscriber = (name: string, ...args: any[]) => void | Promise<void>;
type Unsubscribe = (subscriber: Subscriber) => void;

// Bir abone eklendikten sonra
const subscriber: Subscriber = (name, ...args) => {};
strapi.eventHub.subscribe(subscriber);

// Onun referansını kullanarak kaldır
strapi.eventHub.unsubcribe(subscriber);
```

### Tek bir Etkinliği Dinleme

Eğer yalnızca bir belirli etkinlik için bir fonksiyon çalıştırmanız gerekiyorsa, bir abone fonksiyonu oluşturmak aşırı olabilir. Bu nedenle, etkinlik merkezi, [Node.js etkinlik yayıcı](https://nodejs.org/api/events.html#class-eventemitter)'dan ilham alınarak `on`, `off` ve `once` yöntemlerini sağlar.

#### `on`

Her seferinde belirli bir etkinlik yayımlandığında çağrılan bir dinleyici fonksiyonu kaydeder. Dinleyiciyi kaldırmak için çağrılabilecek bir fonksiyon döndürür.

```ts
// Türler
type Listener = (args: any[]) => void | Promise<void>;
type RemoveListenerCallback = () => void;
type On = (eventName: string, listener: Listener) => RemoveListenerCallback;

// Bir dinleyici ekle
const removeListener = strapi.eventHub.on('some.event', () => {
  // Dinleyici lojiklerinizi buraya yazın
});

// Döndürülen fonksiyonu kullanarak dinleyiciyi kaldır
removeListener();
```

#### `off`

Bir dinleyici fonksiyonunu kaldırır. Dinlediği etkinliğin adını ve dinleyicinin referansını argüman olarak vermeniz gerekir.

```ts
// Türler
type Listener = (args: any[]) => void | Promise<void>;
type Off = (listener: Listener) => void;

// Bir dinleyici eklendikten sonra
const listener: Listener = (...args) => {};
strapi.eventHub.on('some.event', listener);

// Onun referansını kullanarak kaldır
strapi.eventHub.off('some.event', listener);
```

#### `once`

Bir etkinlik yayımlandığında yalnızca ilk seferinde çağrılacak bir dinleyici fonksiyonu kaydeder. Etkinlik yayımlandıktan sonra dinleyici otomatik olarak kaldırılacaktır. Ayrıca, çağrılmadan önce dinleyiciyi kaldırmak için kullanılabilecek bir fonksiyonu döndürür.

```ts
// Türler
type Listener = (args: any[]) => void | Promise<void>;
type RemoveListenerCallback = () => void;
type Once = (eventName: string, listener: Listener) => RemoveListenerCallback;

// Tek kullanımlık bir dinleyici ekle
const removeListener = strapi.eventHub.once('some.event', () => {
  // Dinleyici lojiklerinizi buraya yazın
});

// Tek kullanımlık dinleyiciyi döndürülen fonksiyonu kullanarak kaldır
removeListener();
```

## Dezavantajlar

- Potansiyel kırıcı değişiklikler: bir etkinliğin adı veya yük içeriğindeki değişiklikler, aynı etkinliği dinleyen diğer özellikleri veya eklentileri etkileyebilir. Bu etkinlikleri yönetirken geriye dönük uyumluluk bir endişe kaynağıdır.
  
:::warning
Performans: Strapi birçok etkinlik yayımlar, bu nedenle abone fonksiyonlarınızın çalıştırılmasının çok maliyetli olmamasını sağlamalısınız.
:::

## Alternatifler

Etkinlik merkezine ihtiyacınız olmayabilir:

- Belirli bir içerik türündeki veritabanı etkinliklerini dinlemek istiyorsanız, [yaşam döngüsü kancalarını](https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#lifecycle-hooks) kullanın.
- Tüm içerik türlerindeki veritabanı etkinliklerini dinlemek istiyorsanız, [genel veritabanı yaşam döngüsü kancası](https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#declarative-and-programmatic-usage) kullanın.
- Bir etkinlik yayımlamak istiyorsanız ancak diğer özellikler veya eklentilerle ifşa edilmesini istemiyorsanız, doğrudan bir [hizmet](https://docs.strapi.io/developer-docs/latest/development/backend-customization/services.html#services) oluşturun ve onu doğrudan çağırın.