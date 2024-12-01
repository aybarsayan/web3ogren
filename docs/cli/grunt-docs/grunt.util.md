---
title: Grunt.utils
description: This document provides an overview of various utilities available in Grunt for handling common tasks. It covers methods for type detection, error handling, string manipulation, and asynchronous processing within your Gruntfile.
keywords: [Grunt, utilities, error handling, asynchronous processing, string manipulation]
---

### grunt.util.kindOf
Bir değerin "türü"nü döndürür. `typeof` ile benzer ancak içsel `[[Class]]` değerini döndürür. Olası sonuçlar `"number"`, `"string"`, `"boolean"`, `"function"`, `"regexp"`, `"array"`, `"date"`, `"error"`, `"null"`, `"undefined"` ve genel `"object"`'dir.

```js
grunt.util.kindOf(value)
```

---

### grunt.util.error
Uygun mesajla birlikte yeni bir Hata örneği (fırlatılabilir) döndürür. Eğer `message` yerine bir Hata nesnesi belirtilmişse, o nesne döndürülür. Ayrıca, `origError` için bir Hata nesnesi belirtilirse ve Grunt `--stack` seçeneği ile çalıştırılmışsa, orijinal Hata yığını dökülecektir.

```js
grunt.util.error(message [, origError])
```

:::tip
Hata oluşturma sürecinde, orijinal hata nesnesini takip etmek, hata ayıklamayı kolaylaştırır.
:::

---

### grunt.util.linefeed
Mevcut işletim sistemi için normalize edilmiş satır sonu karakteri. (`\r\n` Windows için, `\n` diğer durumlarda)

### grunt.util.normalizelf
Bir dize verildiğinde, mevcut işletim sistemi için tüm satır sonları normalize edilmiş yeni bir dize döndürür. (`\r\n` Windows için, `\n` diğer durumlarda)

```js
grunt.util.normalizelf(string)
```

---

### grunt.util.recurse
İç içe geçmiş nesnelerin ve dizilerin içinde yineleme yaparak, her nesne olmayan değer için `callbackFunction`'ı çalıştırır. Eğer `continueFunction` `false` dönerse, belirtilen nesne veya değer atlanır.

```js
grunt.util.recurse(object, callbackFunction, continueFunction)
```

:::info
Bu metod, karmaşık veri yapılarını yönetmek için kullanışlıdır.
:::

---

### grunt.util.repeat
Dize `str`'yi `n` kez tekrar döndürür.

```js
grunt.util.repeat(n, str)
```

---

### grunt.util.pluralize
`"a/b"` olan `str` verildiğinde, eğer `n` `1` ise `"a"` döner, aksi takdirde `"b"` döner. Eğer '/' sizin için uygun değilse, özel bir ayırıcı belirtebilirsiniz.

```js
grunt.util.pluralize(n, str, separator)
```

---

### grunt.util.spawn
Bir alt süreç oluşturur, stdout, stderr ve çıkış kodunu izler. Metod, oluşturulan alt süreç için bir referans döndürür. Çocuk çıkıp gittikten sonra, `doneFunction` çağrılır.

```js
grunt.util.spawn(options, doneFunction)
```

`options` nesnesinin olası özellikleri:

```js
var options = {
  // Uygulanacak komut. Sistem yolunda olmalıdır.
  cmd: commandToExecute,
  // Belirtilirse, şu anda çalışan aynı grunt ikili
  // çocuk komut olarak oluşturulacaktır, "cmd" seçeneği yerine. Varsayılan
  // false'dur.
  grunt: boolean,
  // Komuta geçirilecek argümanların bir dizisi.
  args: arrayOfArguments,
  // Node.js child_process spawn metoduna ek seçenekler.
  opts: nodeSpawnOptions,
  // Bu değer ayarlandığında ve bir hata oluşursa, 
  // değer olarak kullanılacak ve hata değeri olarak null geçilecektir.
  fallback: fallbackValue
};
```

`doneFunction` bu argümanları kabul eder:

```js
function doneFunction(error, result, code) {
  // Eğer çıkış kodu sıfırdan farklı ise ve bir geri dönüş belirtilmemişse, bir Hata
  // nesnesi, aksi takdirde null.
  error
  // Sonuç nesnesi, .stdout, .stderr ve
  // .code (çıkış kodu) özelliklerine sahip bir nesnedir.
  result
  // Sonuç bir dizeye dönüştürüldüğünde, değer sıfır çıkış kodu ise stdout, sıfır dışı çıkış kodu ise ve bir geri dönüş belirtilmişse geri dönüş, ya da sıfır dışı çıkış kodu ise ve bir geri dönüş belirtilmemişse stderr olacaktır.
  String(result)
  // Sayısal çıkış kodu.
  code
}
```

---

### grunt.util.toArray
Bir dizi veya dizimsi nesne verildiğinde, bir dizi döndürür. `arguments` nesnelerini dizilere dönüştürmek için harika.

```js
grunt.util.toArray(arrayLikeObject)
```

### grunt.util.callbackify
Hem "bir değer döndürmek" hem de "sonucu bir geri çağırmaya geçirmek" fonksiyonlarını, belirtilen geri çağırmaya her zaman bir sonuç geçirmek için normalize eder. Eğer orijinal fonksiyon bir değer döndürürse, o değer şimdi geri çağırmaya, tüm diğer önceden tanımlanmış argümanlardan sonra, son argüman olarak geçirilecektir. Eğer orijinal fonksiyon bir değeri bir geri çağırmaya geçirirse, bunu yapmaya devam edecektir.

```js
grunt.util.callbackify(syncOrAsyncFunction)
```

Bu örnek daha iyi açıklayabilir:

```js
function add1(a, b) {
  return a + b;
}
function add2(a, b, callback) {
  callback(a + b);
}

var fn1 = grunt.util.callbackify(add1);
var fn2 = grunt.util.callbackify(add2);

fn1(1, 2, function(result) {
  console.log('1 artı 2 eşittir ' + result);
});
fn2(1, 2, function(result) {
  console.log('1 artı 2 eşittir ' + result);
});
```

---

## Internal libraries

### grunt.util.namespace
Nesnelerde derinlemesine iç içe geçmiş özellikleri çözmek için bir iç kütüphane.

### grunt.util.task
Görev çalıştırma için bir iç kütüphane.

---

## External libraries
*Deprecated*

__Aşağıda listelenen tüm dış kütüphaneler artık kullanılmamaktadır.__

Lütfen projenizin bağımlılıklarında bu dış kütüphaneleri yönetmek için __npm__'yi kullanın.

Örneğin eğer [Lo-Dash](https://www.npmjs.org/package/lodash) kullanmak istiyorsanız, önce yükleyin: `npm install lodash`, ardından `Gruntfile`'ınızda kullanın: `var _ = require('lodash');`.

---

#### grunt.util._
*Deprecated*

[Lo-Dash](http://lodash.com/) ve [Underscore.string](https://github.com/epeli/underscore.string)

`grunt.util._.str` mevcut Lo-Dash yöntemleri ile çakışan yöntemler için mevcuttur.

---

#### grunt.util.async
*Deprecated*

[Async](https://github.com/caolan/async) - node ve tarayıcı için Asenkron yardımcıları.

---

#### grunt.util.hooker
*Deprecated*

[JavaScript Hooker](https://github.com/cowboy/javascript-hooker) - Hata ayıklama ve benzeri şeyler için fonksiyonları monkey-patch (hook) yapar.