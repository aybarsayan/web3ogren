---
title: Grunt Yapılandırması Kılavuzu
description: Bu kılavuz, bir Gruntfile kullanarak projeniz için görevleri nasıl yapılandıracağınızı açıklamaktadır. Grunt, görevlerinizi yönetmek için güçlü bir araçtır ve bu belgede süreci adım adım öğreneceksiniz.
keywords: [Grunt, yapılandırma, Gruntfile, JavaScript, görev yönetimi]
---

Bu kılavuz, bir `Gruntfile` kullanarak projeniz için görevleri nasıl yapılandıracağınızı açıklar. Eğer bir `Gruntfile` nedir bilmiyorsanız, lütfen [[Başlarken]] kılavuzunu okuyun ve [[Örnek Gruntfile]]'ı kontrol edin.

## Grunt Yapılandırması

:::info
Grunt, görevlerinizi yönetmek için güçlü bir araçtır ve genişletilebilir bir yapıya sahiptir.
:::

Görev yapılandırması, `grunt.initConfig` yöntemi aracılığıyla `Gruntfile`'ınızda belirtilir. Bu yapılandırma çoğunlukla görev adlarıyla adlandırılan özellikler altında olacak, ancak herhangi bir keyfi veriyi içerebilir. Özellikler, görevlerinizin gerektirdiği özelliklerle çakışmadığı sürece göz ardı edilecektir.

Ayrıca, bu bir JavaScript olduğu için, JSON ile sınırlı değilsiniz; burada geçerli herhangi bir JavaScript kullanabilirsiniz. Gerekirse yapılandırmayı programatik olarak da oluşturabilirsiniz.

```js
grunt.initConfig({
  concat: {
    // concat görev yapılandırması buraya gelecek.
  },
  uglify: {
    // uglify görev yapılandırması buraya gelecek.
  },
  // Keyfi görev dışı özellikler.
  my_property: 'her neyse',
  my_src_files: ['foo/*.js', 'bar/*.js'],
});
```

## Görev Yapılandırması ve Hedefler

:::tip
Bir görev çalıştırıldığında, Grunt yapılandırmasını aynı adı taşıyan bir özellik altında arar.
:::

Bir görev çalıştırıldığında, Grunt yapılandırmasını aynı adı taşıyan bir özellik altında arar. Çoklu görevler, keyfi adlarla "hedefler" kullanarak birden çok yapılandırma alabilir. Aşağıdaki örnekte, `concat` görevinde `foo` ve `bar` hedefleri bulunurken, `uglify` görevinde yalnızca bir `bar` hedefi vardır.

```js
grunt.initConfig({
  concat: {
    foo: {
      // concat görev "foo" hedef seçenekleri ve dosyaları buraya gelecek.
    },
    bar: {
      // concat görev "bar" hedef seçenekleri ve dosyaları buraya gelecek.
    },
  },
  uglify: {
    bar: {
      // uglify görev "bar" hedef seçenekleri ve dosyaları buraya gelecek.
    },
  },
});
```

Bir görev ve hedefi birlikte belirtmek gibi `grunt concat:foo` veya `grunt concat:bar` sadece belirtilen hedefin yapılandırmasını işleme alırken, `grunt concat` çalıştırmak _tüm_ hedefleri dolaşarak her birini sırayla işler. Eğer bir görev, `grunt.task.renameTask` ile yeniden adlandırılmışsa, Grunt yapılandırma nesnesinde _yeni_ görev adıyla bir özellik arar.

---

## Seçenekler

Bir görev yapılandırmasının içinde, yerleşik varsayılanları geçersiz kılmak için `options` özelliği belirtilebilir. Ayrıca, her hedefin yalnızca o hedef için özel olan bir `options` özelliği olabilir. Hedef düzeyindeki seçenekler, görev düzeyindeki seçenekleri geçersiz kılacaktır.

`options` nesnesi isteğe bağlıdır ve gerekmediği takdirde atlanabilir.

```js
grunt.initConfig({
  concat: {
    options: {
      // Görev düzeyindeki seçenekler burada olabilir, görev varsayılanlarını geçersiz kılar.
    },
    foo: {
      options: {
        // "foo" hedef seçenekleri burada olabilir, görev düzeyindeki seçenekleri geçersiz kılar.
      },
    },
    bar: {
      // Hiçbir seçenek belirtilmedi; bu hedef görev düzeyindeki seçenekleri kullanacak.
    },
  },
});
```

---

## Dosyalar

Çoğu görev dosya işlemleri gerçekleştirdiğinden, Grunt, görevlerin hangi dosyalar üzerinde işlem yapacağını belirlemek için güçlü soyutlamalara sahiptir. **src-dest** (kaynak-hedef) dosya eşlemelerini tanımlamak için birkaç yol vardır; bu yollar, farklı derecelerde açıklık ve kontrol sunar. Herhangi bir çoklu görev, tüm bu formatları anlayacaktır, bu nedenle ihtiyaçlarınıza en uygun formatı seçin.

Tüm dosya formatları `src` ve `dest` destekler ancak `Compact` ve `Files Array` formatları birkaç ek özellik destekler:

* `filter`: Geçerli bir [fs.Stats yöntem adı](https://nodejs.org/docs/latest/api/fs.html#fs_class_fs_stats) veya eşleşen `src` dosya yolunu alan ve `true` veya `false` döndüren bir işlev. `Örnekleri görmek için`.
* `nonull`: `true` olarak ayarlandığında, işlem eşleşmeyen desenleri de içerecektir. Grunt'un `--verbose` bayrağı ile birleştirildiğinde, bu seçenek dosya yolu sorunlarını çözmeyi yardımcı olabilir.
* `dot`: Desenlerin bir noktadan başlayarak dosya adları ile eşleşmesine izin ver, desenin o noktada açık bir noktası yoksa bile.

### Grunt ve Görev Seçenekleri Arasındaki Fark

Çoğu görev dosya işlemleri gerçekleştirdiği için Grunt, bir görevin işlem yapacağı dosyaları almak için yerleşik bir altyapı sağlamaktadır. Avantajı, bu mantığın yeniden görev yazarları tarafından uygulanması gerekmemesidir. Kullanıcının bu dosyaları belirtmesine izin vermek için, Grunt `nonull` ve `filter` gibi seçenekler sunar.

Üzerinde çalışılacak dosyaların yanı sıra, her görevin kendi özel ihtiyaçları vardır. Bir görev yazarı, varsayılan davranışı geçersiz kılacak bazı seçeneklerin kullanıcı tarafından yapılandırılmasına izin vermek isteyebilir. Bu görev spesifik seçenekler, daha önce açıklanan Grunt seçenekleri ile karıştırılmamalıdır.

Bu farkı daha fazla netleştirmek için, [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint) kullanılarak bir örnek görelim:

```js
grunt.initConfig({
  jshint: {
    ignore_warning: {
      options: {
        '-W015': true,
      },
      src: 'js/**',
      filter: 'isFile'
    }
  }
});
```

Bu yapılandırma, işleme alınacak dosyaları belirtmek için Grunt seçeneklerini `src` ve `filter` kullanır. Ayrıca belirli bir uyarıyı yok saymak için (kode `W015` olan) grunt-contrib-jshint görevine özgü seçeneği `-W015` kullanır.

### Compact Format

Bu form, her hedef için tek bir **src-dest** (kaynak-hedef) dosya eşlemesi sağlar. Genellikle [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint) gibi yalnızca okuma amaçlı görevler için en yaygın olarak kullanılır, burada yalnızca bir `src` özelliği gerekir ve hiçbir `dest` anahtarı ilgili değildir. Bu format ayrıca her src-dest dosya eşlemesi için ek özellikleri destekler.

```js
grunt.initConfig({
  jshint: {
    foo: {
      src: ['src/aa.js', 'src/aaa.js']
    },
  },
  concat: {
    bar: {
      src: ['src/bb.js', 'src/bbb.js'],
      dest: 'dest/b.js',
    },
  },
});
```

### Files Object Format

Bu form, her hedef için birden fazla src-dest eşlemesine destek verir; burada özellik adı hedef dosyasıdır ve değeri kaynak dosya(ları)dır. Bu şekilde belirtilen herhangi bir sayıdaki src-dest dosya eşlemesine sahip olabilirsiniz, ancak ek özellikler belirtilmeyecektir.

```js
grunt.initConfig({
  concat: {
    foo: {
      files: {
        'dest/a.js': ['src/aa.js', 'src/aaa.js'],
        'dest/a1.js': ['src/aa1.js', 'src/aaa1.js'],
      },
    },
    bar: {
      files: {
        'dest/b.js': ['src/bb.js', 'src/bbb.js'],
        'dest/b1.js': ['src/bb1.js', 'src/bbb1.js'],
      },
    },
  },
});
```

### Files Array Format

Bu form, her hedef için birden fazla src-dest dosya eşlemesine destek verirken, ek özelliklerin de belirtilmesine olanak tanır.

```js
grunt.initConfig({
  concat: {
    foo: {
      files: [
        {src: ['src/aa.js', 'src/aaa.js'], dest: 'dest/a.js'},
        {src: ['src/aa1.js', 'src/aaa1.js'], dest: 'dest/a1.js'},
      ],
    },
    bar: {
      files: [
        {src: ['src/bb.js', 'src/bbb.js'], dest: 'dest/b/', nonull: true},
        {src: ['src/bb1.js', 'src/bbb1.js'], dest: 'dest/b1/', filter: 'isFile'},
      ],
    },
  },
});
```

### Older Formats

**dest-as-target** dosya formatı, çoklu görevler ve hedefler var olmadan önce kalıntı olarak kalmıştır; burada hedef yol adı aslında hedef adı olmaktadır. Ne yazık ki, çünkü hedef adları dosya yollarıdır, `grunt task:target` çalıştırmak tuhaf olabilir. Ayrıca, hedef düzeyindeki seçenekleri veya ek özellikleri src-dest dosya eşlemesine göre belirtmek mümkün değildir.

Bu formatı kullanımdan kaldırılmış olarak değerlendirin ve mümkün olduğunca kaçının.

```js
grunt.initConfig({
  concat: {
    'dest/a.js': ['src/aa.js', 'src/aaa.js'],
    'dest/b.js': ['src/bb.js', 'src/bbb.js'],
  },
});
```

### Custom Filter Function

`filter` özelliği, dosyaları daha ayrıntılı bir şekilde hedeflemenize yardımcı olabilir. Geçerli bir [fs.Stats yöntem adı](https://nodejs.org/docs/latest/api/fs.html#fs_class_fs_stats) kullanabilirsiniz. Aşağıdaki sadece bir dosya gerçekte eşleşirse temizleyecektir:

```js
grunt.initConfig({
  clean: {
    foo: {
      src: ['tmp/**/*'],
      filter: 'isFile',
    },
  },
});
```

Ya da kendi `filter` işlevinizi oluşturun ve dosyanın eşleşip eşleşmeyeceği konusunda `true` veya `false` döndürün. Örneğin, aşağıdaki yalnızca boş dizinleri temizler:

```js
grunt.initConfig({
  clean: {
    foo: {
      src: ['tmp/**/*'],
      filter: function(filepath) {
        return (grunt.file.isDir(filepath) && require('fs').readdirSync(filepath).length === 0);
      },
    },
  },
});
```

Başka bir örnek - `globbing` ve `expand: true` özelliklerini kullanarak - mevcut dosyaların üzerini yazmaktan kaçınmanıza olanak tanır:

```js
grunt.initConfig({
  copy: {
    templates: {
      files: [{
        expand: true,
        cwd: ['templates/css/'],     // Orijinal CSS şablonlarının ana dizini
        src: '**/*.css',             // Üst dizin içindeki (ve alt dizinleriyle) tüm `*.css` dosyalarını toplar
        dest: 'src/css/',            // Toplanan `*.css` dosyalarını `src/css/` klasörüne kaydeder
        filter: function (dest) {    // `dest`, bu durumda her eşleşen `src`'in dosya yoludur
          var cwd = this.cwd,        // Değişkenleri yapılandırır (bunlar yalnızca sizin için belgelenmiştir)
              src = dest.replace(new RegExp('^' + cwd), '');
              dest = grunt.task.current.data.files[0].dest;
          return (!grunt.file.exists(dest + src));    // `src` dosyalarını sadece hedefleri boşsa kopyalar
        }
      }]
    }
  }
});
```

Yukarıdaki teknik, hedefin mevcut olup olmadığını kontrol ederken `rename property` dikkate alınmaz.

### Globbing desenleri

Tüm kaynak dosya yollarını bireysel olarak belirtmek genellikle pratik değildir, bu nedenle Grunt, yerleşik [node-glob][] ve [minimatch][] kütüphaneleri aracılığıyla dosya adı genişletmeyi (globbing olarak da bilinir) destekler.

[node-glob]: https://github.com/isaacs/node-glob
[minimatch]: https://github.com/isaacs/minimatch

Bu, globbing desenleri üzerine kapsamlı bir eğitim değildir, ancak bir dosya yolunda:

* `*` herhangi bir karakter sayısını eşleştirir, ancak `/` eşleştirmez
* `?` tek bir karakteri eşleştirir, ancak `/` eşleştirmez
* `**` herhangi bir karakter sayısını, `/` dahil, yol kısmında tek şey olarak eşleştirir
* `{}` virgülle ayrılmış "veya" ifadeleri listesine izin verir
* Bir desenin başında `!` eşleşmeyi olumsuzlar

---

Çoğu insanın bilmesi gereken, `foo/*.js` dosyalarındaki `foo/` alt dizininde `.js` ile biten tüm dosyaları eşleştirirken, `foo/**/*.js` dosyalarındaki `foo/` alt dizininde _ve tüm alt dizinlerinde_ `.js` ile biten tüm dosyaları eşleştirecektir.

Ayrıca, aksi takdirde karmaşık globbing desenlerini basitleştirmek için Grunt, dosya yolları veya globbing desenleri dizilerinin belirtilmesine olanak tanır. Desenler sırayla işlenir, `!` ile öneklenmiş eşleşmeler, eşleşen dosyaları sonuç kümesinden hariç tutar. Sonuç kümesi benzersiz hale getirilir.

Örneğin:

```js
// Tek dosyalar belirtebilirsiniz:
{src: 'foo/this.js', dest: ...}
// Veya dosyalar dizileri:
{src: ['foo/this.js', 'foo/that.js', 'foo/the-other.js'], dest: ...}
// Veya genel bir glob desen ile:
{src: 'foo/th*.js', dest: ...}

// Bu tek node-glob deseni:
{src: 'foo/{a,b}*.js', dest: ...}
// Bu şekilde de yazılabilir:
{src: ['foo/a*.js', 'foo/b*.js'], dest: ...}

// Tüm .js dosyaları, foo/, alfabetik sırayla:
{src: ['foo/*.js'], dest: ...}
// Burada, bar.js ilk sıradadır, ardından kalan dosyalar gelir, alfabetik sırayla:
{src: ['foo/bar.js', 'foo/*.js'], dest: ...}

// Bar.js hariç tüm dosyalar, alfabetik sırayla:
{src: ['foo/*.js', '!foo/bar.js'], dest: ...}
// Alfabetik sırayla tüm dosyalar, ancak bar.js en son olsun.
{src: ['foo/*.js', '!foo/bar.js', 'foo/bar.js'], dest: ...}

// Dosya yollarında veya glob desenlerinde şablonlar kullanılabilir:
{src: ['src/<%= basename %>.js'], dest: 'build/<%= basename %>.min.js'}
// Ancak belirli bir yapılandırmada tanımlanmış dosya listelerini de referans alabilir:
{src: ['foo/*.js', '<%= jshint.all.src %>'], dest: ...}
```

Glob desen sözdizimi hakkında daha fazla bilgi için [node-glob][] ve [minimatch][] belgelerine bakın.

### Dosya nesnesini dinamik olarak oluşturma

Birçok bireysel dosyayı işlemek istediğinizde, dosya listesini dinamik olarak oluşturmak için birkaç ek özellik kullanılabilir. Bu özellikler, hem `Compact` hem de `Files Array` eşlemesi formatlarında belirtilebilir.

`expand` `true` olarak ayarlandığında, aşağıdaki özellikleri etkinleştirir:

* `cwd`: Tüm `src` eşleşmelerinin bu yol ile ilişkili (ancak dahil değil).
* `src`: Eşleşmek için desenler, `cwd` ile ilişkilidir.
* `dest`: Hedef yol ek öneki.
* `ext`: Mevcut uzantıyı bu değer ile değiştirir, oluşturulan `dest` yollarında.
* `extDot`: Uzantının hangi noktada olduğunu belirtmek için kullanılır. Ya `'first'` (uzantı, dosya adındaki ilk noktanın ardından başlar) ya da `'last'` (uzantı, son noktadan sonra başlar) alabilir ve varsayılan olarak `'first'` *[0.4.3'te eklendi]*
* `flatten`: Oluşturulan `dest` yollarından tüm yol parçalarını kaldırır.
* `rename`: Özelleştirilmiş bir işlevi gömülü hale getirir; bu işlev, yeni hedef ve dosya adını içeren bir dize döndürür. Bu işlev, her eşleşen `src` dosyası için (uzantı adlandırması ve düzleştirmenin ardından) çağrılır. `Daha fazla bilgi`

Aşağıdaki örnekte, `uglify` görevi, hem `static_mappings` hem de `dynamic_mappings` hedefleri için aynı src-dest dosya eşlemesi listesini görecektir, çünkü Grunt otomatik olarak `dynamic_mappings` dosya nesnesini, görev çalıştığında bulunan 4 dosya için 4 bireysel statik src-dest dosya eşlemesine dönüştürecektir.

Herhangi bir statik src-dest ve dinamik src-dest dosya eşlemesi kombinasyonu belirtilebilir.

```js
grunt.initConfig({
  uglify: {
    static_mappings: {
      // Bu src-dest dosya eşlemesi manuel olarak belirlendiği için, her seferinde
      // yeni bir dosya eklendiğinde veya kaldırıldığında Gruntfile'ın güncellenmesi gerekir.
      files: [
        {src: 'lib/a.js', dest: 'build/a.min.js'},
        {src: 'lib/b.js', dest: 'build/b.min.js'},
        {src: 'lib/subdir/c.js', dest: 'build/subdir/c.min.js'},
        {src: 'lib/subdir/d.js', dest: 'build/subdir/d.min.js'},
      ],
    },
    dynamic_mappings: {
      // Grunt, "uglify" görevi çalıştığında "lib/" altında "**/*.js" arayacak
      // ve o anda uygun src-dest dosya eşlemesini oluşturacak; böylece
      // dosyalar eklendiğinde veya kaldırıldığında Gruntfile'ı güncellemek zorunda kalmazsınız.
      files: [
        {
          expand: true,     // Dinamik genişlemeyi etkinleştir.
          cwd: 'lib/',      // Src eşleşmeleri bu yola göre görelidir.
          src: ['**/*.js'], // Gerçek eşleşmek için desenler.
          dest: 'build/',   // Hedef yol öneki.
          ext: '.min.js',   // Dest dosya yollarının bu uzantıya sahip olmasını sağlar.
          extDot: 'first'   // Dosya adlarındaki uzantılar ilk noktadan sonra başlar
        },
      ],
    },
  },
});
```

#### Yeniden adlandırma Özelliği

`rename` özelliği benzersizdir; çünkü ona geçerli olan tek değer bir JavaScript işlevidir. Fonksiyon bir dize döndürdüğü için `rename` için bir dize kullanamazsınız (bunu yapmak `Propert 'rename' of object # is not a function` hatasına neden olur). Aşağıdaki örnekte, `copy` görevi README.md dosyasının bir yedeğini alır.

```js
grunt.initConfig({
  copy: {
    backup: {
      files: [{
        expand: true,
        src: ['docs/README.md'],    // Yedekleme için README.md dosyası belirtildi
        rename: function () {       // Yeniden adlandırma için değer bir işlev olmalıdır
          return 'docs/BACKUP.txt'; // Fonksiyonun tam yeri ile bir dize döndürmesi gerekir
        }
      }]
    }
  }
});
```

Fonksiyon çağrıldığında, `dest` ve eşleşen `src` yolu geçilir ve çıktı dizesini döndürmek için kullanılabilir. Aşağıdaki örnekte, dosyalar `dev` klasöründen `dist` klasörüne kopyalanır ve "beta" kelimesini kaldıracak şekilde yeniden adlandırılır.

```js
grunt.initConfig({
  copy: {
    production: {
      files: [{
        expand: true,
        cwd: 'dev/',
        src: ['*'],
        dest: 'dist/',
        rename: function (dest, src) {          // `dest` ve `src` değerleri işlevin içine geçirilebilir
          return dest + src.replace('beta',''); // `src` yeniden adlandırılıyor; `dest` aynı kalıyor
        }
      }]
    }
  }
});
```

Eşleşen birden fazla `src` yolunun aynı hedef yerine (örneğin, iki farklı dosya aynı dosya adına yeniden adlandırıldığında) yeniden adlandırılması durumunda, her çıkış ona ait kaynaklar için bir diziye eklenir.

## Şablonlar

`` ayırıcılarını kullanarak belirtilen şablonlar, görevler yapılandırma okurken otomatik olarak genişletilecektir. Şablonlar, başka şablon kalmadığında tekrar tekrar genişletilir.

Tüm yapılandırma nesnesi, özelliklerin çözümlendiği bağlamdır. Ayrıca, şablonlar içinde `grunt` ve yöntemleri de mevcuttur, örneğin, ``.

* `` Yapılandırmadaki `prop.subprop` değerine genişletilir, türünden bağımsız. Bu tür şablonlar yalnızca dize değerlerine değil, aynı zamanda dizilere veya diğer nesnelere de referans vermek için kullanılabilir.
* `` Keyfi satır içi JavaScript kodu çalıştırır. Bu, kontrol akışı veya döngüler için yararlıdır.

Aşağıdaki örnekte, `concat` görev yapılandırması, `grunt concat:sample` çalıştırıldığında `build/abcde.js` adında bir dosya oluşturacaktır; bu dosya `foo/*.js` + `bar/*.js` + `baz/*.js` ile eşleşen tüm dosyaları birleştirerek başlık olan `/* abcde */` ile birleştirir.

```js
grunt.initConfig({
  concat: {
    sample: {
      options: {
        banner: '/* <%= baz %> */\n',   // '/* abcde */\n'
      },
      src: ['<%= qux %>', 'baz/*.js'],  // [['foo/*.js', 'bar/*.js'], 'baz/*.js']
      dest: 'build/<%= baz %>.js',      // 'build/abcde.js'
    },
  },
  // Görev yapılandırma şablonlarında kullanılan keyfi özellikler.
  foo: 'c',
  bar: 'b<%= foo %>d', // 'bcd'
  baz: 'a<%= bar %>e', // 'abcde'
  qux: ['foo/*.js', 'bar/*.js'],
});
```

## Harici Verileri İçe Aktarma

Aşağıdaki Gruntfile'da, proje meta verisi yapılandırmadan `package.json` dosyasına aktarılır ve [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify) `uglify` görevi dinamik olarak bu metadatanin bir kaynak dosyasını küçültmek ve bir başlık yorumu oluşturmak için yapılandırılır.

Grunt, JSON ve YAML verilerini içe aktarmak için `grunt.file.readJSON` ve `grunt.file.readYAML` yöntemlerine sahiptir.

```js
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  uglify: {
    options: {
      banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    },
    dist: {
      src: 'src/<%= pkg.name %>.js',
      dest: 'dist/<%= pkg.name %>.min.js'
    }
  }
});