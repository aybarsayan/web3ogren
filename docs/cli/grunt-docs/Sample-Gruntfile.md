---
description: Bu sayfa, basit bir projenin ihtiyaçlarını karşılayacak bir `Gruntfile` oluşturma sürecini detaylandırmaktadır. Grunt eklentilerini kullanarak JavaScript kodunuzu optimize etmeyi ve test etmeyi öğrenin.
keywords: [Gruntfile, Grunt eklentileri, JavaScript, JSHint, QUnit, uglify, concat]
---

# GruntFile Örneği

Bu sayfada, basit bir projenin ihtiyaçlarını karşılayacak bir `Gruntfile` oluşturma sürecini detaylandırmaktadır. Grunt eklentilerini kullanarak JavaScript kodunuzu optimize etmeyi ve test etmeyi öğrenin.

```js
module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);

};
```

## Gereksinimler

Her projenin kendi ihtiyaçları vardır, ancak çoğunun bazı ortak noktaları bulunur. Bu kılavuzda, temel gereksinimleri otomatikleştirmek için birkaç Grunt eklentisini tanıtıyoruz. Nihai amaç, bu Grunt eklentilerini yapılandırmayı öğrenmeniz ve projelerinizde kullanmanızdır.

:::tip
Örnek vermek gerekirse, bir JavaScript kütüphanesi oluşturduğunuzu varsayalım.
:::

Tipik klasör yapısı aşağıdaki klasörleri içerir: `src`, `dist` ve `test`. `src` klasörü (bazen `app` olarak adlandırılır), kütüphanenin yazarak oluşturduğunuz kaynak kodunu içerir. `dist` klasörü (bazen `build` olarak adlandırılır), kaynak kodunun minimize edilmiş bir sürümünü içerir. Minimize edilmiş bir dosya, gerekmediği halde gereksiz karakterler (boşluklar, yeni satırlar, yorumlar gibi) kaldırılmış, ancak kaynak kodunun işlevselliğini etkilememiş bir dosyadır. Minimize edilmiş kaynak kodu, projenin kullanıcıları için özellikle yararlıdır çünkü transfer edilmesi gereken veri miktarını azaltır. Son olarak, `test` klasörü projenin test edilmesi için gereken kodu içerir. Bu yapı, `Gruntfile` konfigürasyonu oluştururken sonraki bölümlerde kullanılacaktır.

:::info
Kütüphaneyi geliştirirken ve yeni sürümler yayınlarken, düzenli olarak gerçekleştirmeniz gereken birkaç görev vardır. 
:::

Örneğin, yazdığınız kodun en iyi uygulamalara uyduğundan emin olmak isteyebilirsiniz ya da yazdığınız kodun beklenmeyen davranışlara yol açmadığından. Bunu yapmak için [JSHint](http://jshint.com/about/) adında bir aracı kullanabilirsiniz. Grunt'ın bunun için resmi bir eklentisi vardır: [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint) ve bu örnekte bunu benimseyeceğiz. Özellikle kodunuzu değiştirirken, kuralları veya en iyi uygulamaları ihlal etmediğinizden emin olmak isteyebilirsiniz.

> **Note:** Bu nedenle, her yaptığınız değişiklikte kodu kontrol etmek iyi bir stratejidir.

Bunu yapmak için, dosya eklendiğinde, değiştirildiğinde veya silindiğinde `grunt-contrib-jshint` gibi önceden tanımlanmış görevleri çalıştıran [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) adlı bir Grunt eklentisini ele alacağız.

Kaynak kodunuzun en iyi uygulamalara uygun olup olmadığını kontrol etmek, bunun stabilitesini garanti altına almaz ve hatalar içermediğinden emin olmanızı sağlamaz. Sağlam bir proje oluşturmak için test etmeniz gerekir. [QUnit](https://qunitjs.com/) veya [Jasmine](http://jasmine.github.io/) gibi benimseyebileceğiniz birkaç kütüphane vardır. Bu kılavuzda, QUnit'i ve özellikle [grunt-contrib-qunit](https://github.com/gruntjs/grunt-contrib-qunit) aygıtını kullanarak kodunuzu nasıl test edeceğinizi açıklayacağız.

:::warning
Çalışmanızı dağıtırken, mümkün olduğunca küçük boyutta bir versiyon sunmak istersiniz.
:::

Minimize edilmiş bir versiyon oluşturmak için [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify) gibi bir Grunt eklentisine ihtiyaç duyarsınız. Ayrıca, geliştirdiğiniz projenin çok küçük olmadıkça, kodu birden fazla dosyaya bölmüş olma ihtimaliniz yüksektir. Bu geliştirici için iyi bir uygulama olmakla birlikte, kullanıcıların yalnızca bir dosya eklemelerini istersiniz. Bu nedenle, kodu minimize etmeden önce, kaynak dosyalarını birleştirerek tek bir dosya oluşturmalısınız. Bu amacı gerçekleştirebilmek için [grunt-contrib-concat](https://github.com/gruntjs/grunt-contrib-concat) gibi bir Grunt eklentisine ihtiyacınız var.

Özetle, bu kılavuzda aşağıdaki beş Grunt eklentisini kullanacağız:

* [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify)
* [grunt-contrib-qunit](https://github.com/gruntjs/grunt-contrib-qunit)
* [grunt-contrib-concat](https://github.com/gruntjs/grunt-contrib-concat)
* [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint)
* [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)

:::note
Eğer sonucun neye benzediğini merak ediyorsanız, tüm `Gruntfile` bu sayfanın sonunda bulunmaktadır.
:::

## `Gruntfile`'ın Kurulumu

İlk bölüm "sarmalayıcı" işlevi, Grunt konfigürasyonunuzu kapsüllüyor.

```js
module.exports = function(grunt) {
};
```

Bu fonksiyon içerisinde konfigürasyon nesnemizi başlatabiliriz:

```js
grunt.initConfig({
});
```

Sonraki adım, `package.json` dosyasındaki proje ayarlarını `pkg` özelliğine kaydetmektir. Bu, `package.json` dosyasındaki özelliklerin değerlerine atıfta bulunmamızı sağlar, kısa süre sonra göreceğimiz gibi.

```js
pkg: grunt.file.readJSON('package.json')
```

Şimdi elimizde şu var:

```js
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });
};
```

Artık bahsettiğimiz her bir görev için bir konfigürasyon tanımlayabiliriz. Bir eklentinin konfigürasyon nesnesi, genellikle eklentinin adıyla aynı adı taşıyan bir özellik olarak bulunur. `grunt-contrib-concat` için konfigürasyon, aşağıda gösterildiği gibi `concat` anahtarı altında bulunan konfigürasyon nesnesine girer:

```js
concat: {
  options: {
    // birleştirilmiş çıktıda her dosya arasında yerleştirilecek bir dize tanımlayın
    separator: ';'
  },
  dist: {
    // birleştirilecek dosyalar
    src: ['src/**/*.js'],
    // oluşan JS dosyasının konumu
    dest: 'dist/<%= pkg.name %>.js'
  }
}
```

Yukarıdaki parçacıkta, JSON dosyasındaki `name` özelliğine atıfta bulunduğumuza dikkat edin. Daha önce, `package.json` dosyasını yüklemenin sonucu olarak `pkg` özelliğini tanımladığımız için, buna `pkg.name` kullanarak erişiyoruz ve bu daha sonra bir JavaScript nesnesine ayrıştırılıyor. Grunt, konfigürasyon nesnesindeki özelliklerin değerlerini çıktıya aktarmak için basit bir şablon motoruna sahiptir. Burada `concat` görevine, `src/` içerisinde bulunan tüm dosyaları birleştirmesi talimatını veriyoruz ve bunların .js ile bitmesini sağlıyoruz.

:::details
Şimdi JavaScript kodunu minimize eden `grunt-contrib-uglify` eklentisini yapılandırayalım:
:::

```js
uglify: {
  options: {
    // banner çıktı dosyasının üst kısmına eklenir
    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
  },
  dist: {
    files: {
      'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
    }
  }
}
```

Bu parçacık, `grunt-contrib-uglify`'ya, minimize edilmiş JavaScript dosyalarının sonucunu içeren bir dosya oluşturmasını söyler. Burada `` kullanarak, uglify'nın birleştirme görevinden elde edilen dosyayı minimize etmesini sağlıyoruz.

Bu noktaya kadar, eklentileri kütüphanenin dağıtım versiyonunu oluşturacak şekilde yapılandırdık. Şimdi `grunt-contrib-qunit`'i kullanarak kodun test edilmesini otomatikleştirmek için zamanıdır. Bunu yapmak için test koşucusu dosyalarının konumunu belirtmemiz gerekiyor; bunlar QUnit'in çalıştığı HTML dosyalarıdır. Ortaya çıkan kod aşağıda verilmiştir:

```js
qunit: {
  files: ['test/**/*.html']
},
```

Tamamlandıktan sonra, projenin kodunun en iyi uygulamalara uyduğundan emin olmak için konfigürasyonu ayarlama zamanı. JSHint, yüksek döngüsel karmaşıklık, fazla rahat eşitlik operatörü yerine sıkı eşitlik operatörünün kullanımı ve kullanılmayan değişkenler ve işlevlerin tanımı gibi sorunları veya olası sorunları tespit edebilen bir araçtır.

Projenizin tüm JavaScript dosyamızı, `Gruntfile` ve test dosyaları dahil olmak üzere, `grunt-contrib-jshint` ile analiz etmenizi öneririz. `grunt-contrib-jshint` için bir konfigürasyon örneği aşağıdaki gibidir:

```js
jshint: {
  // lintlenmesi gereken dosyaları tanımlayın
  files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
  // JSHint'i yapılandırın (http://www.jshint.com/docs/ adresinde belgelenmiştir)
  options: {
    // JSHint varsayılan ayarlarını geçersiz kılmak istiyorsanız, burada daha fazla seçenek
    globals: {
      jQuery: true,
      console: true,
      module: true
    }
  }
}
```

Bu eklenti, bir dizi dosya ve ardından bir dizi seçenek alır. Bunlar [JSHint web sitesinde](http://www.jshint.com/docs/) belgelenmiştir. Eklentinin varsayılan ayarlarıyla mutluysanız, bunları Gruntfile içinde yeniden tanımlamanıza gerek yoktur.

Yapılandırılması gereken son eklenti `grunt-contrib-watch`. Bunu, bir JavaScript dosyası eklendiğinde, silindiğinde veya değiştirildiğinde `jshint` ve `qunit` görevlerini çalıştırmak için kullanacağız. Belirtilen dosyalarından herhangi biri değiştiğinde (burada, JSHint'in kontrol etmesi için aynı dosyaları kullanıyoruz), belirttiğiniz görevleri, sıralarına göre çalıştırır. Bu, komut satırında `grunt watch` ile çalıştırılabilir.

Önceki tanımı `grunt-contrib-watch` için bir konfigürasyona dönüştürmek, aşağıdaki parçacığı üretir:

```js
watch: {
  files: ['<%= jshint.files %>'],
  tasks: ['jshint', 'qunit']
}
```

Bu parçacıkla, tanıtımda bahsedilen tüm eklentiler için konfigürasyonu ayarlamış olduk. Yapmamız gereken son adım, ihtiyacımız olan Grunt eklentilerini yüklemektir. Bunların hepsi daha önce npm üzerinden yüklenmiş olmalıdır.

```js
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-qunit');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
```

Ve son olarak, bazı görevler belirleyin. Bunların en önemlisi varsayılan görevdir:

```js
// bu, komut satırında "grunt test" yazarak çalıştırılacak
grunt.registerTask('test', ['jshint', 'qunit']);

// varsayılan görev, komut satırında sadece "grunt" yazarak çalıştırılabilir
grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
```

Varsayılan görev, bir görev belirtmeden `Grunt`'ı çağırdığınızda (`grunt`) çalıştırılır.

## Ortaya Çıkan `Gruntfile`

Eğer bu kılavuzu doğru takip ettiyseniz, aşağıdaki `Gruntfile`'a sahip olmalısınız:

```js
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // JSHint varsayılan ayarlarını geçersiz kılmak için burada seçenekler
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};