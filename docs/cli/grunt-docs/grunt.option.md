---
description: Grunt seçenek API'si hakkında bilgi ve kullanım örnekleri sunmaktadır. Komut satırı parametrelerini yönetmek ve görevler arasında veri paylaşmak için nasıl kullanılacağına dair bilgiler içermektedir.
keywords: [Grunt, seçenek API, komut satırı, örnekler, deploy, parameter sharing]
---

# Grunt.options

The Grunt seçenek API'si, birden çok görev arasında **parametre paylaşımı** yapmak ve komut satırında ayarlanan parametrelere erişmek için kullanılır.

:::tip
Bir örnek, yapılandırmanızı geliştirme veya staging (hazırlık) için hedefleyen bir bayrak olabilir.
:::

Komut satırında: `grunt deploy --target=staging`, `grunt.option('target')`'ın `"staging"` döndürmesini sağlar.

`target` seçeneğini kullanmak için bir örnek `Gruntfile` şu şekilde olabilir:

```js
grunt.initConfig({
  compass: {
    dev: {
      options: {
        /* ... */
        outputStyle: 'expanded'
      },
    },
    staging: {
      options: {
        /* ... */
        outputStyle: 'compressed'
      },
    },
  },
});
var target = grunt.option('target') || 'dev';
grunt.registerTask('deploy', ['compass:' + target]);
```

`grunt deploy` komutunu çalıştırdığınızda, stilleriniz varsayılan olarak `dev` hedefini alacak ve CSS'yi genişletilmiş formatta çıkartacaktır. Eğer `grunt deploy --target=staging` komutunu çalıştırırsanız, `staging` hedefi çalıştırılacak ve CSS'niz sıkıştırılmış formatta olacaktır.

> **Anahtar Nokta:** 
> `grunt.option` görevler içinde de kullanılabilir.
> — Grunt API Belgeleri

Örneğin:

```js
grunt.registerTask('upload', 'Belirtilen hedefe kod yükle.', function(n) {
  var target = grunt.option('target');
  // burada hedef ile yararlı bir şey yapın
});
grunt.registerTask('deploy', ['validate', 'upload']);
```

_Boolean (mantıksal) seçenekler, değer olmadan yalnızca bir anahtar kullanılarak belirtilebilir. Örneğin, komut satırında `grunt deploy --staging` çalıştırmak, `grunt.option('staging')`'in `true` döndürmesini sağlar._

### grunt.option ☃
Bir seçeneği alır veya ayarlar.

```js
grunt.option(key[, val])
```

Boolean (mantıksal) seçenekler, `key`'in önüne `no-` eklenerek inkar edilebilir. Örneğin:

```js
grunt.option('staging', false);
var isDev = grunt.option('no-staging');
// isDev === true
```

### grunt.option.init
`grunt.option`'ı başlatır. `initObject` atlanırsa, seçenek boş bir nesne olarak başlatılır, aksi takdirde `initObject` olarak ayarlanır.

```js
grunt.option.init([initObject])
```

### grunt.option.flags
Seçenekleri bir dizi komut satırı parametresi olarak döndürür.

```js
grunt.option.flags()
```

### grunt.option.keys 
@since 1.2.0+

Tüm seçenek anahtarlarını döndürür.

```js
grunt.option.keys()
```