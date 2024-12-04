---
title: İstemci Kurulumu
seoTitle: Socket.IO İstemci Kurulumu
sidebar_position: 1
description: Bu sayfa, Socket.IO istemcisinin kurulumu ve sürüm uyumluluğu hakkında bilgi sağlamaktadır. İstemcinin kurulumu için gerekli adımlar ve tarayıcı desteği hakkında bilgi bulabilirsiniz.
tags: 
  - socket.io
  - istemci
  - kurulumu
  - web geliştirme
keywords: 
  - socket.io
  - istemci
  - web soketleri
  - tarayıcı desteği
---



:::info
Son sürüm şu anda `4.8.1`, Ekim 2024'te yayımlandı.  
Sürüm notlarını `buradan` bulabilirsiniz.
:::

## Sürüm uyumluluğu

Sunucu ve JS istemcisi arasındaki uyumluluk tablosu aşağıda yer almaktadır:


    
        JS İstemci sürümü
        Socket.IO sunucu sürümü
    
    
        1.x
        2.x
        3.x
        4.x
    
    
        1.x
        EVET
        HAYIR
        HAYIR
        HAYIR
    
    
        2.x
        HAYIR
        EVET
        EVET1
        EVET1
    
    
        3.x
        HAYIR
        HAYIR
        EVET
        EVET
    
    
        4.x
        HAYIR
        HAYIR
        EVET
        EVET
    


[1] Evet, `allowEIO3: true` ile

İlgili geçiş kılavuzlarını kontrol ediniz:

- `v2'den v3'e`
- `v3'ten v4'e`

## Tarayıcı desteği

Socket.IO, IE9 ve üzerini desteklemektedir. IE 6/7/8 artık desteklenmemektedir.  

Tarayıcı uyumluluğu, harika Sauce Labs platformu sayesinde test edilmektedir:

![](../../../images/frameworks/socket.io/static/images/saucelabs.svg)

## Kurulum

### Bağımsız yapı

Varsayılan olarak, Socket.IO sunucusu `/socket.io/socket.io.js` adresinde bir istemci paketi sunmaktadır.  

`io` global bir değişken olarak kaydedilecektir:

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();
</script>
```

Buna ihtiyacınız yoksa (aşağıdaki diğer seçeneklere bakın), sunucu tarafında bu işlevselliği devre dışı bırakabilirsiniz:

```js
const { Server } = require("socket.io");

const io = new Server({
  serveClient: false
});
```

### CDN'den

Ayrıca istemci paketini bir CDN'den de dahil edebilirsiniz:

```html
<script src="https://cdn.socket.io/4.8.1/socket.io.min.js" integrity="sha384-mkQ3/7FUtcGyoppY6bz/PORYoGqOl7/aSUMn2ymDOJcapfS6PHqxhRTMh1RR0Q6+" crossorigin="anonymous"></script>
```

Socket.IO ayrıca diğer CDN'lerde de mevcuttur:

- cdnjs: https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.8.1/socket.io.min.js
- jsDelivr: https://cdn.jsdelivr.net/npm/socket.io-client@4.8.1/dist/socket.io.min.js
- unpkg: https://unpkg.com/socket.io-client@4.8.1/dist/socket.io.min.js

Birçok paket mevcuttur:

| Adı              | Boyut             | Açıklama |
|:------------------|:-----------------|:------------|
| socket.io.js               | 34.7 kB gzip     | Minimize edilmemiş versiyon, [debug](https://www.npmjs.com/package/debug) ile    |
| socket.io.min.js           | 14.7 kB min+gzip | Üretim versiyonu, [debug](https://www.npmjs.com/package/debug) olmadan |
| socket.io.msgpack.min.js   | 15.3 kB min+gzip | Üretim versiyonu, [debug](https://www.npmjs.com/package/debug) olmadan ve [msgpack parser](https://github.com/socketio/socket.io-msgpack-parser) ile    |

[debug](https://www.npmjs.com/package/debug) paketi konsola hata ayıklama bilgileri yazdırmanızı sağlar. Daha fazla bilgiye `buradan` ulaşabilirsiniz.  

Geliştirme sırasında, `socket.io.js` paketini kullanmanızı öneririz. `localStorage.debug = 'socket.io-client:socket'` ayarı ile, istemci tarafından alınan her olay konsola yazdırılacaktır.  

Üretim için, hata ayıklama paketini hariç tutan optimize edilmiş bir yapı olan `socket.io.min.js` paketini kullanmanız önemlidir.

### NPM'den

Socket.IO istemcisi, [webpack](https://webpack.js.org/) veya [browserify](http://browserify.org/) gibi paketleyicilerle uyumludur.


  

```sh
npm install socket.io-client
```

  
  

```sh
yarn add socket.io-client
```

  
  

```sh
pnpm add socket.io-client
```

  


İstemci ayrıca Node.js üzerinden de çalıştırılabilir.  

:::note
Not: Yukarıda belirtilen nedenlerden dolayı, hata ayıklamayı tarayıcı paketinizden hariç tutmak isteyebilirsiniz. Webpack ile, [webpack-remove-debug](https://github.com/johngodley/webpack-remove-debug) kullanabilirsiniz.
:::

:::note
TypeScript kullanıcıları için not: türler artık `socket.io-client` paketine dahil edilmiştir, bu nedenle `@types/socket.io-client` türlerine ihtiyaç yoktur ve aslında hatalara neden olabilir:

```
Nesne literali yalnızca bilinen özellikleri belirtebilir ve 'extraHeaders' 'ConnectOpts' türünde mevcut değildir.
```
:::

## Çeşitli

### Bağımlılık ağaçları

Bir istemcinin temel kurulumu **9** paketi içermektedir; bunlardan **5**'i ekibimiz tarafından sağlanmaktadır:

```
└─┬ socket.io-client@4.7.2
  ├── @socket.io/component-emitter@3.1.0
  ├─┬ debug@4.3.4
  │ └── ms@2.1.2
  ├─┬ engine.io-client@6.5.2
  │ ├── @socket.io/component-emitter@3.1.0 deduped
  │ ├── debug@4.3.4 deduped
  │ ├── engine.io-parser@5.2.1
  │ ├─┬ ws@8.11.0
  │ │ ├── UNMET OPTIONAL DEPENDENCY bufferutil@^4.0.1
  │ │ └── UNMET OPTIONAL DEPENDENCY utf-8-validate@^5.0.2
  │ └── xmlhttprequest-ssl@2.0.0
  └─┬ socket.io-parser@4.2.4
    ├── @socket.io/component-emitter@3.1.0 deduped
    └── debug@4.3.4 deduped
```

### Geçişli sürümler

`engine.io-client` paketi, düşük seviyeli bağlantıları (HTTP uzun bekletme veya WebSocket) yönetmekten sorumlu olan motoru getirir. Ayrıca bakınız: `Nasıl çalışır`

| `socket.io-client` sürümü | `engine.io-client` sürümü | `ws` sürümü1 |
|----------------------------|----------------------------|--------------------------|
| `4.8.x`                    | `6.6.x`                    | `8.17.x`                 |
| `4.7.x`                    | `6.5.x`                    | `8.17.x`                 |
| `4.6.x`                    | `6.4.x`                    | `8.11.x`                 |
| `4.5.x`                    | `6.2.x`                    | `8.2.x`                  |
| `4.4.x`                    | `6.1.x`                    | `8.2.x`                  |
| `4.3.x`                    | `6.0.x`                    | `8.2.x`                  |
| `4.2.x`                    | `5.2.x`                    | `7.4.x`                  |
| `4.1.x`                    | `5.1.x`                    | `7.4.x`                  |
| `4.0.x`                    | `5.0.x`                    | `7.4.x`                  |
| `3.1.x`                    | `4.1.x`                    | `7.4.x`                  |
| `3.0.x`                    | `4.0.x`                    | `7.4.x`                  |
| `2.5.x`                    | `3.5.x`                    | `7.5.x`                  |
| `2.4.x`                    | `3.5.x`                    | `7.5.x`                  |

[1] yalnızca Node.js kullanıcıları için. Tarayıcıda, yerel WebSocket API'si kullanılır.