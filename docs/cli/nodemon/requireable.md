---
title: Nodemon Gerekli Modül Olarak
description: Nodemon, projelerde belirtilen dosyaları izleyerek geliştirme sürecini kolaylaştıran bir araçtır. Bu içerikte, Nodemon'un kullanımını ve yapılandırmalarını bulabilirsiniz.
keywords: [Nodemon, Node.js, geliştirme aracı, otomatik yeniden başlatma, olay yönetimi]
---

# Nodemon Gerekli Modül Olarak

Nodemon (1.0.0 itibarıyla) ayrıca gerekli bir modül olarak çalışır. Şu anda, statik yapılandırma değişkenleri olduğu için **nodemon**'u yalnızca projenize bir kez dahil edebilirsiniz, ancak izleme için farklı bir uygulama ile yeni ayarlarla yeniden çalıştırabilirsiniz.

Nodemon'u dahil ederek işlevselliğini genişletebilirsiniz. Aşağıda projenizde nodemon kullanmanın basit bir örneği bulunmaktadır:

```js
var nodemon = require('nodemon');

nodemon({
  script: 'app.js',
  ext: 'js json'
});

nodemon.on('start', function () {
  console.log('Uygulama başlatıldı');
}).on('quit', function () {
  console.log('Uygulama kapatıldı');
  process.exit();
}).on('restart', function (files) {
  console.log('Uygulama yeniden başlatıldı: ', files);
});
```

:::info
Nodemon, varsayılan olarak bir dizi [olay](https://github.com/remy/nodemon/blob/master/doc/events.md) yayar ve ayrıntılı modda aynı zamanda nodemon cli aracının yansıttığı `log` olayını da yayar.
:::

## Argümanlar

`nodemon` fonksiyonu, ya [nodemon yapılandırmasını](https://github.com/remy/nodemon#config-files) karşılayan bir nesne alır ya da komut satırında kullanılacak argümanları karşılayan bir dize alabilir:

```js
var nodemon = require('nodemon');

nodemon('-e "js json" app.js');
```

## Yöntemler & Özellikler

`nodemon` nesnesinin ayrıca birkaç yöntemi ve özelliği vardır. Bazıları **testlere** yardımcı olmak için açıkça tanıtılmıştır, ancak burada tamlık için listelenmiştir:

### Olay Yönetimi

Bu, nodemon içindeki olay yayıcı otobüsüdür ve üst düzey modül olarak expose edilmiştir (yani, `events` api'sidir):

- `nodemon.on(event, fn)`
- `nodemon.addListener(event, fn)`
- `nodemon.once(event, fn)`
- `nodemon.emit(event)`
- `nodemon.removeAllListeners([event])`

:::warning
Not: `removeListener` yoktur (gerekliyse bir pull request almaktan memnuniyet duyarım).
:::

### Test Araçları

- `nodemon.reset()` - nodemon'un iç durumunu temiz bir sayfaya geri döndürür
- `nodemon.config` - nodemon'un kullandığı iç yapılandırma referansı


Ek Bilgi
Nodemon, projelerinizi geliştirirken zaman kazandırır ve geliştiricilerin odaklanmalarını sağlar. Anlık dosya değişikliklerini takip ederek otomatik yenileme özelliği sunar.
