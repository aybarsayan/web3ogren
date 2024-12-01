---
description: Bu belgede, kullanıcı yapılandırma seçeneklerini depolamak ve paylaşmak için kullanılan yöntemler açıklanmaktadır. Yapılandırmalar, Yeoman Storage API aracılığıyla yönetilmektedir.
keywords: [yapılandırma, yeoman, api, json, geliştirici]
title: Yapılandırmayı Yönetme
---

# Depolama

Kullanıcı yapılandırma seçeneklerini depolamak ve bunları alt üreteçler arasında paylaşmak yaygın bir görevdir. Örneğin, kullanıcının CoffeeScript kullanıp kullanmadığı gibi dil tercihlerini, stil seçeneklerini (boşluklarla veya sekmelerle girintileme) paylaşmak yaygındır.

:::info
Bu yapılandırmalar, [Yeoman Storage API](https://yeoman.github.io/generator/Storage.html) aracılığıyla `.yo-rc.json` dosyasına kaydedilebilir. Bu API, `generator.config` nesnesi üzerinden erişilebilir.
:::

Kullanacağınız bazı yaygın yöntemler şunlardır:

## Yöntemler

### `this.config.save()`

Bu yöntem, **yapılandırmayı** `.yo-rc.json` dosyasına yazacaktır. Eğer dosya henüz mevcut değilse, `save` yöntemi dosyayı oluşturacaktır.

> **Not:** `.yo-rc.json` dosyası ayrıca bir projenin kökünü belirler. Bu nedenle, depolama için bir şey kullanmasanız bile, `:app` üreteçinizin içinde `save` çağrısının yapılması en iyi uygulama olarak kabul edilir.

Ayrıca, her `set` yapılandırma seçeneğini çağırdığınızda `save` yönteminin otomatik olarak çağrıldığını unutmayın. Bu nedenle genellikle bunu açıkça çağırmanıza gerek yoktur.

### `this.config.set()`

`set`, ya bir anahtar ve ilişkili bir değer alır ya da birden fazla anahtar/değer çifti olan bir nesne alır.

:::tip
Değerlerin JSON serileştirilebilir olması gerektiğini unutmayın (Dize, Sayı veya özyinelemeli olmayan nesneler).
:::

### `this.config.get()`

`get`, bir `String` anahtarı parametre olarak alır ve ilişkili değeri döndürür.

### `this.config.getAll()`

Mevcut tüm yapılandırmanın bir nesnesini döndürür. Döndürülen nesne değerle, referansla iletilir. Bu, yapılandırma deposunu güncellemek için hala `set` yöntemini kullanmanız gerektiği anlamına gelir.

### `this.config.delete()`

Bir anahtarı siler.

### `this.config.defaults()`

Varsayılan değerler olarak kullanılacak bir seçenekler hash'ini kabul eder. Eğer bir anahtar/değer çifti zaten mevcutsa, değer dokunulmadan kalır. Eğer bir anahtar eksikse, eklenir.

---

## `.yo-rc.json` yapısı

`.yo-rc.json` dosyası, birden fazla üreteçten alınan yapılandırma nesnelerinin depolandığı bir JSON dosyasıdır. Her üreteç yapılandırması, üreteçler arasında isim çakışmalarının önlenmesi için alan adları ile ilişkilendirilmiştir.

:::note
Bu aynı zamanda her üreteç yapılandırmasının kum havuzuna alındığı ve yalnızca alt üreteçler arasında paylaşılabileceği anlamına gelir. Farklı üreteçler arasında depolama API'sını kullanarak yapılandırmaları paylaşamazsınız. Farklı üreteçler arasında veri paylaşmak için çağrı sırasında seçenekler ve argümanlar kullanın.
:::

İşte bir `.yo-rc.json` dosyasının dahili görünümü:

```json
{
  "generator-backbone": {
    "requirejs": true,
    "coffee": true
  },
  "generator-gruntfile": {
    "compass": false
  }
}
```

Yapı, son kullanıcılarınız için oldukça kapsamlıdır. Bu, bu dosya içinde gelişmiş yapılandırmaları depolamak isteyebileceğiniz ve gelişmiş kullanıcılardan her seçenek için istemler kullanmanın mantıklı olmadığı durumlarda dosyayı doğrudan düzenlemelerini isteyebileceğiniz anlamına gelir.