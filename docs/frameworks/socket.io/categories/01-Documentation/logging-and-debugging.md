---
title: Günlükleme ve Hata Ayıklama
seoTitle: Socket.IO Günlükleme ve Hata Ayıklama Rehberi
sidebar_position: 5
description: Socket.IO ile hata ayıklama ve günlükleme konusunda kapsamlı bir rehber. Debugging araçları ve yöntemleri hakkında bilgi edinin.
tags: 
  - Socket.IO
  - hata ayıklama
  - debugging
  - geliştirici
  - Node.js
keywords: 
  - Socket.IO
  - hata ayıklama
  - debugging
  - geliştirici
  - Node.js
---
Socket.IO artık TJ Holowaychuk tarafından geliştirilen minimal ama son derece güçlü bir araç olan [debug](https://github.com/visionmedia/debug) ile tamamen izlenebilir hale getirildi.

1.0’dan önce, Socket.IO sunucusu her şeyi konsola günlüklemeyi varsayılan olarak yapıyordu. Bu, birçok kullanıcı için rahatsız edici bir derecede ayrıntılıydı (diğerleri için son derece yararlı olsa da), bu nedenle artık varsayılan olarak tamamen sessiz olmayı tercih ediyoruz.

Temel fikir, Socket.IO tarafından kullanılan her modülün iç işleyişe dair içgörüler sağlayan farklı hata ayıklama alanları sunmasıdır. Varsayılan olarak, tüm çıktı bastırılır ve `DEBUG` ortam değişkenini (Node.JS) veya `localStorage.debug` özelliğini (Tarayıcılar) sağlayarak mesajları görmek isteyebilirsiniz.

Bunu canlı olarak ana sayfamızda görebilirsiniz:



## Mevcut hata ayıklama alanları

Mevcut bilgilerin neler olduğunu görmek için en iyi yol `*` kullanmaktır:

```
DEBUG=* node yourfile.js
```

ya da tarayıcıda:

```
localStorage.debug = '*';
```

Ve ilginizi çeken alanlarla filtreleme yapabilirsiniz. `*`'yi birden fazla varsa virgül ile ayrılmış alanlarla öne ekleyebilirsiniz. Örneğin, yalnızca Node.js üzerindeki socket.io istemcisinden hata ayıklama ifadelerini görmek için şunu deneyin:

```
DEBUG=socket.io:client* node yourfile.js
```

Motorun *ve* socket.io’dan tüm hata ayıklama mesajlarını görmek için:

```
DEBUG=engine,socket.io* node yourfile.js
```

### Tarayıcı paketinizden hatayı kaldırma

Geliştirme sırasında yararlı olsa da, debug paketi son pakete ek bir yük ekler (minify edilmiş ve gzipped yaklaşık 4KB), bu nedenle ince paketten hariç tutulmuştur (farklı tarayıcı paketleri ile ilgili daha fazla bilgi `burada` bulunabilir).

Eğer webpack kullanıyorsanız, bunu [webpack-remove-debug](https://github.com/johngodley/webpack-remove-debug) ile kaldırabilirsiniz:

```js
{
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'webpack-remove-debug'
      }
    ]
  }
}
```

## Tarayıcı konsolunda hata günlükleri

Lütfen aşağıdaki hataların Socket.IO kütüphanesi tarafından değil, tarayıcı tarafından oluşturulduğunu ve bu nedenle kontrolümüz dışında olduğunu unutmayın:

- `net::ERR_INTERNET_DISCONNECTED`
- `net::ERR_CONNECTION_REFUSED`
- `WebSocket is already in CLOSING or CLOSED state`
- `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at xxx. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing).`
- `The connection to xxx was interrupted while the page was loading`

:::info
Socket.IO ile hata ayıklama yaparken, `DEBUG` ortam değişkenini uygun şekilde ayarladığınızdan emin olun.
:::

:::warning
Geliştirme sırasında dikkatli olun, tarayıcı konsolundaki hatalar genellikle uygulamanızın hata ayıklama sürecinden bağımsızdır.
:::