---
title: Grunt Yapılandırma Verileri
description: Bu belge, Grunt yapılandırma verilerine erişim yöntemlerini detaylandırmakta ve bu verilerin nasıl mevcut olduğunu açıklamaktadır. Gruntfile içinde yer alan çeşitli yöntemler ile yapılandırma işlemleri hakkında bilgi sağlayacaktır.
keywords: [Grunt, yapılandırma, gruntfile, jshint, js, yapılandırma verileri]
---


Proje spesifik yapılandırma verilerine `Gruntfile` içinde erişim sağlanmaktadır.

:::info
Not: ☃ (unicode kar) ile işaretlenmiş herhangi bir yöntem, `grunt` nesnesi üzerinde doğrudan da mevcuttur, ve ☆ (beyaz yıldız) ile işaretlenmiş herhangi bir yöntem, `this` nesnesinin içinde görevler üzerine de mevcuttur.
:::

## Yapılandırma Verilerini Başlatma
_Aşağıdaki yöntemin `grunt` nesnesinde `grunt.initConfig` olarak da mevcut olduğunu unutmayın._

### grunt.config.init ☃
Mevcut proje için bir yapılandırma nesnesi başlatır. Belirtilen `configObject`, görevler tarafından kullanılır ve `grunt.config` yöntemi kullanılarak erişilebilir. Neredeyse her projenin `Gruntfile` dosyası bu yöntemi çağıracaktır.

```js
grunt.config.init(configObject)
```

Belirtilen herhangi bir `` şablon dizesi, yapılandırma verileri alındığında işlenecektir.

> **Örnek:** Bu örnek, [grunt-contrib-jshint eklentisi](https://github.com/gruntjs/grunt-contrib-jshint) `jshint` görevi için örnek yapılandırma verileri içermektedir.

```js
grunt.config.init({
  jshint: {
    all: ['lib/*.js', 'test/*.js', 'Gruntfile.js']
  }
});
```

Daha fazla yapılandırma örneği için [[Başlarken]] kılavuzuna bakın.

:::note
_Bu yöntem ayrıca `grunt.initConfig` olarak da mevcuttur._
:::

## Yapılandırma Verilerine Erişme
Aşağıdaki yöntemler, Grunt yapılandırma verilerine ya `pkg.author.name` gibi nokta ile ayrılmış bir dize üzerinden ya da `['pkg', 'author', 'name']` gibi özellik adı parçalarından oluşan bir dizi üzerinden erişim sağlanmasını sağlar.

Belirtilen bir özellik adı `.` noktasını içeriyorsa, bu noktanın doğrudan bir ters eğik çizgi ile kaçırılması gerekir, örn. `'concat.dist/built\\.js'`. Parça dizisi belirtilirse, Grunt, `grunt.config.escape` yöntemi ile kaçırmayı dahili olarak halledecektir.

### grunt.config
Projenin Grunt yapılandırmasından bir değer almak veya ayarlamak için kullanılır. Bu yöntem, diğer yöntemlere bir takma ad görevi görür; iki argüman geçilirse, `grunt.config.set` çağrılır, aksi takdirde `grunt.config.get` çağrılır.

```js
grunt.config([prop [, value]])
```

### grunt.config.get
Projenin Grunt yapılandırmasından bir değer alır. `prop` belirtilmişse, o özelliğin değeri döndürülür, aksi takdirde `null` döner. Eğer `prop` belirtilmemişse, yapılandırma nesnesinin bir kopyası döndürülür. Şablon dizeleri, `grunt.config.process` yöntemi kullanılarak özyinelemeli olarak işlenecektir.

```js
grunt.config.get([prop])
```

### grunt.config.process
Bir değeri işler, Grunt yapılandırması bağlamında karşılaşıldıkça `` şablonlarını ( `grunt.template.process` yöntemi aracılığıyla) özyinelemeli olarak açar. Bu yöntem otomatik olarak `grunt.config.get` tarafından çağrılır ama _grunt.config.getRaw_ tarafından çağrılmaz.

```js
grunt.config.process(value)
```

Eğer elde edilen herhangi bir değer tamamen bir `''` veya `''` şablon dizesiyse ve belirtilen `foo` veya `foo.bar` özelliği bir dize değilse (ve `null` veya `undefined` değilse), bu değer _gerçek_ değere genişletilecektir. Bu durum, Grunt'ın görev sisteminin dizileri otomatik olarak düzleştirmesi ile birleştiğinde son derece faydalı olabilir.

### grunt.config.getRaw
Projenin Grunt yapılandırmasından, `` şablon dizelerini işlenmeden bir ham değer alır. `prop` belirtilmişse, o özelliğin değeri döndürülür, aksi takdirde `null`. Eğer `prop` belirtilmemişse, yapılandırma nesnesinin bir kopyası döndürülür.

```js
grunt.config.getRaw([prop])
```

### grunt.config.set
Projenin Grunt yapılandırmasına bir değer ayarlamak için kullanılır.

```js
grunt.config.set(prop, value)
```

Belirtilen herhangi bir `` şablon dizesi, yalnızca yapılandırma verileri alındığında işlenecektir.

### grunt.config.escape
Verilen `propString` içindeki `.` noktalarını kaçırır. Bu, nokta içeren özellik adları için kullanılmalıdır.

```js
grunt.config.escape(propString)
```

### grunt.config.merge
*0.4.5'te eklendi*

Belirtilen `configObject` nesnesinin özelliklerini mevcut proje yapılandırmasına özyinelemeli olarak birleştirir. Dizi ve düz nesne özellikleri özyinelemeli olarak birleştirilirken, diğer değer türleri üzerine yazılır.

```js
grunt.config.merge(configObject)
```

:::tip
Bu yöntemi, zaten tanımlanmış görevlere yapılandırma seçenekleri, hedefler vb. eklemek için kullanabilirsiniz, örneğin:
```js
grunt.config.merge({
  watch: {
    files: ["path/to/files"],
    tasks: ["task"]
  }
});
```
Dizi değerleri, dizinin indekslerine göre birleştirilir. Aşağıdaki kodu düşünün:
```js
grunt.initConfig({
  jshint: {
    files: ['Gruntfile.js', 'src/**/*.js'],
  }
);

var config = {
  jshint: {
    files: ['hello.js'],
  }
};

grunt.config.merge(config);
```
Sonuç olarak, `config` değişkeninde tanımlı `files` dizisinin ilk değeri (`hello.js`), `initConfig` yapılandırma çağrısında belirtilen ilk değeri (`Gruntfile.js`) geçersiz kılacaktır.
:::

## Yapılandırma Verilerini Gerektirme
_Aşağıda listelenen yöntemin, `this` nesnesi içinde görevler üzerinde `this.requiresConfig` olarak da mevcut olduğunu unutmayın._

### grunt.config.requires ☆
Gerekli yapılandırma özelliklerinden bir veya birkaçı eksikse, `null` veya `undefined` ise mevcut görevi başarısız kılar. Bir veya birden fazla dize veya dizi yapılandırma özelliği belirtilebilir.

```js
grunt.config.requires(prop [, prop [, ...]])
```

:::warning
_Bu yöntem, görevler içinde `this.requiresConfig` olarak da mevcuttur._
:::