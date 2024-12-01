---
title: Kurallar
description: Bu içerik, nodemon.json dosyasını kullanarak nodemon'un davranışlarını anlamanızı sağlar. Dosya izleme ve yok sayma kurallarının nasıl çalıştığına dair derinlemesine bilgi sunar.
keywords: [nodemon, dosya izleme, yok sayma, json, geliştirme, javascript]
---

# Kurallar

nodemon.json dosyasını içeren:

```json
{
  "ignore": ["*.coffee"],
  "watch": ["server/*.coffee", "test/"]
}
```

O zaman nodemon değişiklikleri algılar, ancak **nodemon'u yeniden başlatan nedir?** Yok sayılan dosyalar mı yoksa izlenen dosyalar mı? Hangisi kazanır?

```js
const files = ['server/foo.coffee', 'server/app.js'];

// afterIgnore = ['server/app.js'] şimdi çünkü foo.coffee *.coffee ile eşleşiyor
const afterIgnore = files.filter(applyIgnore);

// watch = ['server/foo.coffee'] çünkü izleme altında
const watched = files.filter(applyWatch);
```

:::tip
Eğer bir dosya hem izleniyor hem de yok sayılıyorsa, yok sayılanlar önceliklidir. Bu durumu göz önünde bulundurmak önemlidir.
:::

Peki ya:

```js
const files = ['test/app.js', 'test/app.coffee'];

// afterIgnore = ['test/app.js'] şimdi çünkü test/app.coffee *.coffee ile eşleşiyor
const afterIgnore = files.filter(applyIgnore);

// watch.length = 2 çünkü watch test/*.*'ı ifade ediyor
const watched = files.filter(applyWatch);
```

:::info
İzleme ve yok sayma kuralları arasındaki etkileşim, geliştirme sürecinizi büyük ölçüde etkileyebilir. Doğru yapılandırmalar ile verimliliğinizi artırabilirsiniz.
:::

--- 
```
