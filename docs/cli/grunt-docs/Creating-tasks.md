---
title: Grunt Görevleri
description: Grunt görevlerini tanımlama ve kullanma konusunda kapsamlı bir rehber. Bu içerik, Grunt'ın temel işlevselliğini ve nasıl kullanılacağını anlatmaktadır.
keywords: [Grunt, görevler, otomasyon, JavaScript, CLI]
---

Görevler, grunt'ın temel işlevidir. En sık yaptığınız şeyler, örneğin `jshint` veya `nodeunit`. Grunt her çalıştığında, ne yapmasını istediğinizi belirtmek için bir veya daha fazla görev tanımlarsınız.

:::info
Eğer bir görev belirtmezseniz, ancak "default" adlı bir görev tanımlandıysa, bu görev varsayılan olarak çalışacaktır.
:::

## Takma İsim Görevleri
Eğer bir görev listesi belirtilirse, yeni görev bir veya daha fazla diğer görevin takma adı olacaktır. Bu "takma isim görevi" çalıştırıldığında, `taskList`'te belirtilen her görev belirtilen sırayla çalıştırılacaktır. `taskList` argümanı bir görevler dizisi olmalıdır.

```js
grunt.registerTask(taskName, [description, ] taskList)
```

> Bu örnek takma isimli görev, Grunt herhangi bir görev belirtmeden çalıştırıldığında "jshint", "qunit", "concat" ve "uglify" görevlerinin otomatik olarak çalıştırıldığı bir "default" görevi tanımlar:
>
> ```js
> grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
> ```

Görev argümanları da belirtilebilir. Bu örnekte, "dist" takma ismi hem "concat" hem de "uglify" görevlerini, her biriyle bir "dist" argümanı ile çalıştırır:

```js
grunt.registerTask('dist', ['concat:dist', 'uglify:dist']);
```

## Çoklu Görevler
Bir çoklu görev çalıştırıldığında, Grunt yapılandırmadaki aynı adı taşıyan bir özelliği arar. Çoklu görevlerin birden fazla yapılandırması olabilir ve bunlar rastgele adlandırılmış "hedefler" kullanılarak tanımlanabilir.

`grunt concat:foo` veya `grunt concat:bar` gibi hem bir görev hem de hedef belirtmek, yalnızca belirtilen hedefin yapılandırmasını işlerken, `grunt concat` çalıştırmak _tüm_ hedeflerin üzerinden geçerek her birini sırayla işler. Unutmayın ki, eğer bir görev `grunt.task.renameTask` ile yeniden adlandırıldıysa, Grunt yapılandırma nesnesinde _yeni_ görev adına sahip bir özellik arayacaktır.

:::tip 
Dahası, [grunt-contrib-jshint eklentisi jshint görevine](https://github.com/gruntjs/grunt-contrib-jshint#jshint-task) ve [grunt-contrib-concat eklentisi concat görevine](https://github.com/gruntjs/grunt-contrib-concat#concat-task) dahil olmak üzere, çoğu katkı görevleri çoklu görevlere sahiptir.
:::

```js
grunt.registerMultiTask(taskName, [description, ] taskFunction)
```

Belirtilen yapılandırmaya göre, bu örnek çoklu görev `grunt log:foo` ile çalıştırıldığında `foo: 1,2,3` yazar veya `grunt log:bar` ile çalıştırıldığında `bar: hello world` yazar. Ancak Grunt `grunt log` olarak çalıştırıldığında, `foo: 1,2,3`, sonra `bar: hello world`, ardından `baz: false` yazar.

```js
grunt.initConfig({
  log: {
    foo: [1, 2, 3],
    bar: 'hello world',
    baz: false
  }
});

grunt.registerMultiTask('log', 'Log stuff.', function() {
  grunt.log.writeln(this.target + ': ' + this.data);
});
```

## "Temel" Görevler
Bir temel görev çalıştırıldığında, Grunt yapılandırmaya veya ortama bakmaz - yalnızca belirtilen görev işlevini çalıştırır ve belirtilen herhangi bir iki noktadan ayrılmış argümanı işlev argümanları olarak geçer.

```js
grunt.registerTask(taskName, [description, ] taskFunction)
```

Bu örnek görev `grunt foo:testing:123` ile çalıştırıldığında `foo, testing 123` yazar. Görev argüman olmadan `grunt foo` olarak çalıştırıldığında görev `foo, no args` yazar.

```js
grunt.registerTask('foo', 'A sample task that logs stuff.', function(arg1, arg2) {
  if (arguments.length === 0) {
    grunt.log.writeln(this.name + ", no args");
  } else {
    grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
  }
});
```

## Özel görevler
Görevlerle çılgınca oynayabilirsiniz. Eğer görevleriniz "çoklu görev" yapısını takip etmiyorsa, özel bir görev kullanın.

```js
grunt.registerTask('default', 'My "default" task description.', function() {
  grunt.log.writeln('Currently running the "default" task.');
});
```

Bir görev içinde, diğer görevleri çalıştırabilirsiniz.

```js
grunt.registerTask('foo', 'My "foo" task.', function() {
  // "foo" tamamlandıktan sonra çalışacak şekilde "bar" ve "baz" görevlerini sıraya koyun.
  grunt.task.run('bar', 'baz');
  // Veya:
  grunt.task.run(['bar', 'baz']);
});
```

:::warning
Görevler asenkron olabilir. 
:::

```js
grunt.registerTask('asyncfoo', 'My "asyncfoo" task.', function() {
  // Görevi asenkron moda zorlayın ve "done" fonksiyonuna bir referans alın.
  var done = this.async();
  // Biraz senkron işler yapın.
  grunt.log.writeln('Processing task...');
  // Ve bazı asenkron işler.
  setTimeout(function() {
    grunt.log.writeln('All done!');
    done();
  }, 1000);
});
```

Görevler kendi adlarına ve argümanlarına erişebilir.

```js
grunt.registerTask('foo', 'My "foo" task.', function(a, b) {
  grunt.log.writeln(this.name, a, b);
});

// Kullanım:
// grunt foo
//   logs: "foo", undefined, undefined
// grunt foo:bar
//   logs: "foo", "bar", undefined
// grunt foo:bar:baz
//   logs: "foo", "bar", "baz"
```

Görevler, herhangi bir hatanın kaydedilmesi durumunda başarısız olabilir.

```js
grunt.registerTask('foo', 'My "foo" task.', function() {
  if (failureOfSomeKind) {
    grunt.log.error('This is an error message.');
  }

  // Bu görev hatalara sahipse false döndürerek başarısız ol.
  if (ifErrors) { return false; }

  grunt.log.writeln('This is the success message');
});
```

Görevler başarısız olduğunda, `--force` belirtilmedikçe tüm sonraki görevler durdurulacaktır.

```js
grunt.registerTask('foo', 'My "foo" task.', function() {
  // Senkron olarak başarısız ol.
  return false;
});

grunt.registerTask('bar', 'My "bar" task.', function() {
  var done = this.async();
  setTimeout(function() {
    // Asenkron olarak başarısız ol.
    done(false);
  }, 1000);
});
```

:::danger
Görevler, diğer görevlerin başarılı bir şekilde çalıştırılmasına bağlı olabilir. Unutmayın ki `grunt.task.requires`, diğer görev(ler)i gerçekten ÇALIŞTIRMAYACAKTIR. Yalnızca çalışıp çalışmadığını ve başarısız olmadığını kontrol edecektir.
:::

```js
grunt.registerTask('foo', 'My "foo" task.', function() {
  return false;
});

grunt.registerTask('bar', 'My "bar" task.', function() {
  // "foo" görevi başarısızsa veya hiç çalışmadıysa görevi başarısız kılın.
  grunt.task.requires('foo');
  // Bu kod, "foo" görevi başarıyla çalıştıysa çalışır.
  grunt.log.writeln('Hello, world.');
});

// Kullanım:
// grunt foo bar
//   log yapmaz, çünkü foo başarısız oldu.
//   ***Not: Bu, boşlukla ayrılmış ardışık komutların bir örneğidir,
//   (iki satır kod çalıştırmaya benzer: `grunt foo` ardından `grunt bar`)
// grunt bar
//   log yapmaz, çünkü foo hiç çalışmadı.
```

Görevler, gereken yapılandırma özellikleri mevcut olmadığında başarısız olabilir.

```js
grunt.registerTask('foo', 'My "foo" task.', function() {
  // "meta.name" yapılandırma özelliği yoksa görevi başarısız kıl
  // Format 1: Dize
  grunt.config.requires('meta.name');
  // veya Format 2: Dizi
  grunt.config.requires(['meta', 'name']);
  // Log... koşullu olarak.
  grunt.log.writeln('This will only log if meta.name is defined in the config.');
});
```

Görevler yapılandırma özelliklerine erişebilir.

```js
grunt.registerTask('foo', 'My "foo" task.', function() {
  // Özellik değerini loglayın. Özellik tanımsızsa null döner.
  grunt.log.writeln('The meta.name property is: ' + grunt.config('meta.name'));
  // Ayrıca özellik değerini loglar. Özellik tanımsızsa null döner.
  grunt.log.writeln('The meta.name property is: ' + grunt.config(['meta', 'name']));
});
```

Daha fazla örnek için [katkı görevlerine](https://github.com/gruntjs/) göz atın.

---

## CLI seçenekleri / ortam

[Çevresel değişkenlere](https://en.wikipedia.org/wiki/Environment_variable) erişmek için `process.env` kullanın.

Mevcut komut satırı seçenekleri hakkında daha fazla bilgi için [CLI Kullanımı](https://gruntjs.com/using-the-cli) sayfasını okuyun.

## Neden asenkron görevim tamamlanmıyor?
Bu durum, görevinizin asenkron olduğunu Grunt'a bildirmek için [this.async](https://gruntjs.com/api/inside-tasks#this.async) yöntemini çağırmayı unuttuğunuzdan kaynaklanıyor olabilir. Basitlik açısından, Grunt senkron bir kodlama tarzı kullanır ve görev gövdesinde `this.async()` çağrısı ile asenkron moda geçiş yapabilirsiniz.

`done()` fonksiyonuna `false` geçmek, Grunt'a görevin başarısız olduğunu bildirir.

Örneğin:

```js
grunt.registerTask('asyncme', 'My asynchronous task.', function() {
  var done = this.async();
  doSomethingAsync(done);
});
```

## Ek Referans

Görevlerinizi oluşturmak için ek referansa ihtiyacınız varsa [API](https://gruntjs.com/api) belgelerine göz atın.