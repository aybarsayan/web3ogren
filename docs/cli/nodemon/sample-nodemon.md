---
description: Bu sayfa, örnek bir nodemon.json dosyasının nasıl yapılandırılacağını göstermektedir. Nodemon, Node.js uygulamalarını geliştirmek için kullanılan bir araçtır ve bu yapılandırma dosyası, uygulamanızın otomatik olarak yeniden başlatılmasını sağlar.
keywords: [nodemon, json, nodejs, yapılandırma, geliştirme]
---

# Örnek nodemon.json

İşte (hayali bir) `nodemon.json` dosyası için bir örnek:

```json
{
  "restartable": "rs",
  "ignore": [
    ".git",
    "node_modules/**/node_modules"
  ],
  "verbose": true,
  "execMap": {
    "js": "node --harmony"
  },
  "events": {
    "restart": "osascript -e 'display notification \"Uygulama şu nedenle yeniden başlatıldı:\n'$FILENAME'\" with title \"nodemon\"'"
  },
  "watch": [
    "test/fixtures/",
    "test/samples/"
  ],
  "env": {
    "NODE_ENV": "development"
  },
  "ext": "js,json"
}
```

:::tip 
`nodemon.json` dosyasında yapılandırma ayarlarını düzenlemek, uygulamanın daha verimli çalışmasını sağlayabilir.
:::

`ignore` kısmında kullanılan kural nodemon'un varsayılan göz ardı kuralıdır. Tam varsayılanlar burada görülebilir: [defaults.js](https://github.com/remy/nodemon/blob/master/lib/config/defaults.js).

:::info
Nodemon, özellikle geliştirme ortamında sürekli olarak dosya değişikliklerini izler ve uygulamanızı her değişiklikte yeniden başlatır. Bu, geliştirme sürecini hızlandırır.
:::

:::warning
Nodemon yapılandırma dosyanızda yer alan `watch` ayarları, izlemek istediğiniz dosya veya dizinleri belirtir. Yanlış yapılandırma, beklenmedik yeniden başlatmalara neden olabilir.
:::

> "Nodemon ile geliştirme yaparken, yapılandırmalarınızı dikkatlice ayarlamak önemlidir." — Geliştirici Rehberi


Ekstra Bilgiler

- `restartable`: Uygulamanızı yeniden başlatmak için kullanacağınız komut.
- `verbose`: Detaylı hata mesajı almak için `true` olarak ayarlayın.
- `execMap`: Hangi dosya türlerinin hangi komutla çalıştırılacağını belirler.
- `events`: Uygulamanız yeniden başlatıldığında meydana gelecek olayları tanımlar.
- `watch`: İzlenmesi gereken dosya veya dizinleri belirtir.
- `env`: Çalıştırılacak ortam değişkenlerini tanımlar.
- `ext`: İzlenecek dosya uzantılarını belirtir.

