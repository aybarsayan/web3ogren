---
title: Görev API'si
description: Grunt görevlerini oluşturma, kayıt yapma ve dış görevleri yüklemek için önemli bilgiler ve örnekler içermektedir. Detaylı açıklamalarla, kullanıcıların Grunt ile çalışma süreçlerini anlamalarına yardımcı olmaktadır.
keywords: [Grunt, görev API'si, kayıt, dış görev, görev oluşturma]
---

Kayıt yapın, dış görevleri çalıştırın ve yükleyin.

Daha fazla bilgi için [görev lib kaynak](https://github.com/gruntjs/grunt/blob/master/lib/grunt/task.js) ve [görev util lib kaynak](https://github.com/gruntjs/grunt/blob/master/lib/util/task.js) sayfasına bakın.

## Görev API'si
Bir görev çalışırken, Grunt birçok görev özel yardımcı özellik ve metodunu görev fonksiyonu içinde `this` nesnesi aracılığıyla açıklar. Bu özellik ve metodların bir listesini görmek için [[Görevler İçinde]] kılavuzuna bakın.

Görevlere `this` nesnesi aracılığıyla birçok yardımcı özellik ve metod erişilebilir.

:::info
☃ (unicode kar adam) ile işaretlenen herhangi bir metodun `grunt` nesnesi üzerinde doğrudan erişilebilir olduğunu unutmayın. Bilginiz olsun. Daha fazla kullanım bilgisi için `API ana sayfasına` bakın.
:::

## Görevler Oluşturma

### grunt.task.registerTask ☃
Bir "takma görev" veya görev fonksiyonu kaydedin. Bu metod aşağıdaki iki imzayı destekler:

**Takma görev**

Bir görev listesi belirtilmişse, yeni görev bir veya daha fazla diğer görev için bir takma isim olacaktır. Bu "takma görev" çalıştığında, `taskList` içinde belirtilen her görev, belirtilen sırayla çalıştırılacaktır. `taskList` argümanı bir görevler dizisi olmalıdır.

```js
grunt.task.registerTask(taskName, taskList)
```

Opsiyonel `description` dizesi geçirildiğinde, `grunt --help` çalıştırıldığında görüntülenecektir:

```js
grunt.task.registerTask(taskName, description, taskList)
```

> Bu örnek takma görev, Grunt belirtilen hiçbir görev olmadan çalıştırıldığında "jshint", "qunit", "concat" ve "uglify" görevlerinin otomatik olarak çalıştığı bir "varsayılan" görev tanımlar:
> — Grunt Belgeleme

```js
task.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
```

Görev argümanları da belirtilmelidir. Bu örnekte, "dist" takma ismi "concat" ve "uglify" görevlerini "dist" argümanı ile çalıştırır:

```js
task.registerTask('dist', ['concat:dist', 'uglify:dist']);
```

**Fonksiyon görevi**

Eğer `description` ve `taskFunction` geçirilirse, belirtilen fonksiyon, görev çalıştırıldığında yürütülür. Ayrıca, belirtilen açıklama `grunt --help` çalıştırıldığında gösterilecektir. Görev özel özellikleri ve metodları görev fonksiyonu içinde `this` nesnesinin özellikleri olarak mevcuttur. Görev fonksiyonu, görevin başarısız olduğunu göstermek için `false` döndürebilir.

Aşağıda açıklandığı gibi `grunt.task.registerMultiTask` metodu, "çoklu görev" olarak bilinen özel bir görev tanımlamak için kullanılabilir.

```js
grunt.task.registerTask(taskName, description, taskFunction)
```

Bu örnek görev, Grunt `grunt foo:testing:123` ile çalıştırıldığında `foo, testing 123` yazdırır. Eğer görev `grunt foo` olarak, argüman olmadan çalıştırılırsa görev `foo, no args` yazdırır.

```js
grunt.task.registerTask('foo', 'Bir şeyleri yazdıran örnek görev.', function(arg1, arg2) {
  if (arguments.length === 0) {
    grunt.log.writeln(this.name + ", no args");
  } else {
    grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
  }
});
```

:::tip
Daha fazla görev ve takma görev örneği için `görevler oluşturma` belgesine bakın.
:::

_Bu metod ayrıca `grunt.registerTask` olarak da mevcuttur._

### grunt.task.registerMultiTask ☃
"Çoklu görev" kaydedin. Çoklu bir görev, belirli bir hedef belirtilmemişse tüm adlandırılmış alt özellikleri (AKA hedefleri) üzerinde dolaylı olarak yinelemeler yapar. Varsayılan özellikler ve metodların yanı sıra, görev fonksiyonu içinde `this` nesnesinin özellikleri olarak ek çoklu görev özel özellikleri mevcuttur.

Birçok katkı görevi, [jshint görevi](https://github.com/gruntjs/grunt-contrib-jshint), [concat görevi](https://github.com/gruntjs/grunt-contrib-concat) ve [uglify görevi](https://github.com/gruntjs/grunt-contrib-uglify) gibi, çoklu görevlerdir.

```js
grunt.task.registerMultiTask(taskName, description, taskFunction)
```

Belirtilen yapılandırmaya göre, bu örnek çoklu görev `grunt log:foo` ile çalıştırıldığında `foo: 1,2,3` yazdırır, veya `grunt log:bar` ile çalıştırıldığında `bar: hello world` yazdırır. Ancak `grunt log` olarak çalıştırıldığında, önce `foo: 1,2,3`, sonra `bar: hello world`, ardından `baz: false` yazdırılır.

```js
grunt.initConfig({
  log: {
    foo: [1, 2, 3],
    bar: 'hello world',
    baz: false
  }
});

grunt.task.registerMultiTask('log', 'Şeyleri yazdır.', function() {
  grunt.log.writeln(this.target + ': ' + this.data);
});
```

:::warning
Daha fazla çoklu görev örneği için `görevler oluşturma` belgesine bakın.
:::
  
_Bu metod ayrıca `grunt.registerMultiTask` olarak da mevcuttur._

### grunt.task.requires

Başka bir görev başarısız olursa veya hiç çalışmazsa görevi başarısız kılın.

```js
grunt.task.requires(taskName);
```

### grunt.task.exists
*0.4.5'te eklendi*

Belirli bir isimle kayıtlı görevlerden birinin var olup olmadığını kontrol edin. Boolean bir değer döndürür.

```js
grunt.task.exists(name)
```

### grunt.task.renameTask ☃
Bir görevi yeniden adlandırın. Bu, bir görevin varsayılan davranışını geçersiz kılmak istediğinizde, eski ismi korurken faydalı olabilir.

_Eğer bir görev yeniden adlandırılmışsa, `this.name` ve `this.nameArgs` özellikleri buna göre değişecektir._

```js
grunt.task.renameTask(oldname, newname)
```

_Bu metod ayrıca `grunt.renameTask` olarak da mevcuttur._

## Harici Olarak Tanımlanan Görevlerin Yüklenmesi
Çoğu proje, görevleri `Gruntfile` içinde tanımlar. Daha büyük projeler için veya görevlerin projeler arasında paylaşılması gerektiğinde, görevler bir veya daha fazla harici dizinden veya Npm ile yüklenen Grunt eklentilerinden yüklenebilir.

### grunt.task.loadTasks ☃
Belirtilen dizinden, görevle ilgili dosyaları yükleyin, `Gruntfile` ile göreli. Bu metod, o eklentinin "tasks" alt dizininde yer alan görevle ilgili dosyaları yüklemek için kullanılabilir.

```js
grunt.task.loadTasks(tasksPath)
```

_Bu metod ayrıca `grunt.loadTasks` olarak da mevcuttur._

### grunt.task.loadNpmTasks ☃
Belirtilen Grunt eklentisinden görevleri yükleyin. Bu eklenti, npm aracılığıyla yerel olarak yüklenmiş olmalı ve `Gruntfile` ile göreli olmalıdır. Grunt eklentileri, [grunt-init gruntplugin şablonunu](https://github.com/gruntjs/grunt-init) kullanarak oluşturulabilir: `grunt init:gruntplugin`.

```js
grunt.task.loadNpmTasks(pluginName)
```

_Bu metod ayrıca `grunt.loadNpmTasks` olarak da mevcuttur._

## Görev Sırasını Oluşturma
Grunt, komut satırında belirtilen tüm görevleri otomatik olarak sıraya alır ve çalıştırır, ancak bireysel görevler ek görevleri sıraya alabilir.

### grunt.task.run
Bir veya daha fazla görev sıraya alın. `taskList` içinde belirtilen her görev, mevcut görev tamamlandığında, belirtilen sırayla hemen çalıştırılacaktır. Görev listesi bir görevler dizisi veya bireysel görev argümanları olabilir.

```js
grunt.task.run(taskList)
```

### grunt.task.clearQueue
Görev kuyruğunu tamamen boşaltın. Ek görevler sıraya alınmamışsa, başka görev çalıştırılmayacaktır.

```js
grunt.task.clearQueue()
```

### grunt.task.normalizeMultiTaskFiles
Bir görev hedef yapılandırma nesnesini bir dizi src-dest dosya eşlemesine normalize eder. Bu metod, çoklu görev sistemi içinde `this.files / grunt.task.current.files` özelliği tarafından dahili olarak kullanılır.

```js
grunt.task.normalizeMultiTaskFiles(data [, targetname])
```