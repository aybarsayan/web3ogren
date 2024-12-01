---
title: Grunt Görevlerinde `this` Kullanımı
description: Grunt görevlerinde `this` nesnesinin nasıl kullanılacağına dair detaylı bilgiler. Asenkron görevlerden, gerekli yapılandırmalara kadar birçok önemli metod açıklanmaktadır.
keywords: [Grunt, this, görev yönetimi, asenkron, yapılandırma, JavaScript]
---

# Grunt Görevlerinde this Kullanımı

While a task is running, Grunt exposes many task-specific utility properties and methods inside the task function via the `this` object. This same object is also exposed as `grunt.task.current` for use in `templates`, eg. the property `this.name` is also available as `grunt.task.current.name`.

## Tüm Görevler İçinde

### this.async
:::tip
Eğer bir görev asenkron ise, Grunt'a beklemesini bildirmek için bu metod çağrılmalıdır.
:::

Eğer `this.async` metodu çağrılmazsa, görev senkron bir şekilde yürütülecektir.

```js
// Grunt'a bu görevin asenkron olduğunu belirt.
var done = this.async();
// Asenkron kodunuz.
setTimeout(function() {
  // Bazen bir hata simüle edelim.
  var success = Math.random() > 0.5;
  // Her şey tamam!
  done(success);
}, 1000);
```

### this.requires
:::info
Eğer bir görev başka bir görevin (ya da görevlerin) başarılı bir şekilde tamamlanmasına bağlıysa, bu metod kullanılarak mevcut görevi iptal edebilirsiniz.
:::

```js
this.requires(tasksList)
```

### this.requiresConfig
Bir veya daha fazla gerekli `config` özelliği eksikse mevcut görevi başarısız hale getirir.

```js
this.requiresConfig(prop [, prop [, ...]])
```

Daha fazla bilgi için `grunt.config belgelerine` bakın.

> Bu metod `grunt.config.requires` metodunun bir takma adıdır. — Grunt Belgeleri

### this.name
`grunt.registerTask` içinde tanımlanan görevin adı. Örneğin, `this.name` bir görev fonksiyonunda kullanılabilir.

### this.nameArgs
Görevin adı, komut satırında belirtilen argüman veya bayrağı içerir.

### this.args
Göreve geçirilen argümanların bir dizisi.

### this.flags
Göreve geçirilen argümanlardan oluşturulmuş bir nesne.

### this.errorCount
Bu görev sırasında meydana gelen `grunt.log.error` çağrılarının sayısı.

### this.options
Bir seçenekler nesnesi döndürür ve isteğe bağlı argümanların özellikleri ile geçersiz kılma yapılabilir.

```js
this.options([defaultsObj])
```

## Multi Görevler İçinde

### this.target
Bir multi görevde, bu özellik şu anda üzerinde iterasyon yapılan hedefin adını içerir. 

### this.files
Bir multi görevde, Grunt destekleyen tüm dosyalar otomatik olarak tek bir formata normalleştirilecektir.

> Eğer var olmayan dosyalar `src` değerlerinde bulunuyorsa, kullanmadan önce kaynak dosyaların mevcut olduğunu açıkça test etmek isteyebilirsiniz. — Grunt Dökümantasyonu

### this.filesSrc
Bir multi görevde, belirtilen tüm `src` dosyaları bir diziye indirgenir.

### this.data
Bir multi görevde, bu Grunt yapılandırma nesnesinde belirtilen hedef için depolanan gerçek verilerdir.

:::warning
Değerlerin normalleştirildiği `this.options`, `this.files` ve `this.filesSrc` kullanımının önerildiği unutulmamalıdır.
:::