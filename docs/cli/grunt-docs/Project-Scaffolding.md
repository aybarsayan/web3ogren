---
title: Grunt-init Aracı
description: Grunt-init, proje oluşturmayı otomatikleştirmek için kullanılan bir iskelet aracıdır. Mevcut ortam ve sorulara verilen yanıtlara bağlı olarak, tam bir dizin yapısı oluşturur. Kullanılabilir şablonlar ve yükleme talimatları ile kullanım detaylarına ulaşabilirsiniz.
keywords: [grunt, проект, шаблон, автоматизация, npm]
---

## grunt-init
Grunt-init, proje oluşturmayı otomatikleştirmek için kullanılan bir iskelet aracıdır. Mevcut ortam ve sorulara verilen yanıtlara bağlı olarak, tam bir dizin yapısı oluşturur. Oluşturulan dosya ve içerikler, seçilen şablona ve sorulan sorulara verilen yanıtlara bağlı olarak değişiklik gösterir.

> _Not: Bu bağımsız yardımcı program, Grunt'a "init" görevi olarak entegre edilmişti. Bu değişiklik hakkında daha fazla bilgi için Grunt [0.3'ten 0.4'e Yükseltme](https://gruntjs.com/upgrading-from-0.3-to-0.4) kılavuzuna bakın._

## Kurulum
Grunt-init'i kullanmak için, onu küresel olarak yüklemek isteyeceksiniz.

```shell
npm install -g grunt-init
```

Bu, `grunt-init` komutunu sistem yolunuza ekleyecek ve her yerden çalıştırılmasını sağlayacaktır.

:::warning
_Bunu yapmak için sudo kullanmanız veya komut shell'inizi Yönetici olarak çalıştırmanız gerekebilir._
:::

## Kullanım
* Program hakkında yardım almak ve mevcut şablonların listesini görmek için `grunt-init --help` komutunu kullanın.
* Mevcut bir şablona dayanan bir proje oluşturmak için `grunt-init TEMPLATE` komutunu kullanın.
* Arbitre konumda bir şablona dayanan bir proje oluşturmak için `grunt-init /path/to/TEMPLATE` komutunu kullanın.

Çoğu şablon mevcut dizin içinde dosyalarını oluşturduğundan, mevcut dosyaları üzerine yazmak istemiyorsanız önce yeni bir dizine geçmeyi unutmayın.

## Şablonları Yükleme
Şablonlar `~/.grunt-init/` dizininize (`%USERPROFILE%\.grunt-init\` Windows'ta) yüklendikten sonra, grunt-init aracılığıyla kullanılabilir olacaktır. Bu dizine bir şablon klonlamak için git kullanmanız önerilir. Örneğin, [grunt-init-jquery](https://github.com/gruntjs/grunt-init-jquery) şablonunu şu şekilde yükleyebilirsiniz:

```shell
git clone https://github.com/gruntjs/grunt-init-jquery.git ~/.grunt-init/jquery
```

:::note
_Not: Şablonu yerel olarak "foobarbaz" olarak kullanılabilir hale getirmek isterseniz, klonlama sırasında `~/.grunt-init/foobarbaz` belirtmeniz gerekir. Grunt-init, `~/.grunt-init/` dizinindeki gerçek şablon dizin adını kullanacaktır._
:::

Birkaç grunt-init şablonu resmi olarak sürdürülmektedir:

* [grunt-init-commonjs](https://github.com/gruntjs/grunt-init-commonjs) - Nodeunit birim testleri de dahil olmak üzere bir commonjs modülü oluşturur. ([örnek "üretim" repo](https://github.com/gruntjs/grunt-init-commonjs-sample/tree/generated) | [oluşturma transkripti](https://github.com/gruntjs/grunt-init-commonjs-sample#project-creation-transcript))
* [grunt-init-gruntfile](https://github.com/gruntjs/grunt-init-gruntfile) - Temel bir Gruntfile oluşturur. ([örnek "üretim" repo](https://github.com/gruntjs/grunt-init-gruntfile-sample/tree/generated) | [oluşturma transkripti](https://github.com/gruntjs/grunt-init-gruntfile-sample#project-creation-transcript))
* [grunt-init-gruntplugin](https://github.com/gruntjs/grunt-init-gruntplugin) - Nodeunit birim testleri de dahil olmak üzere bir Grunt eklentisi oluşturur. ([örnek "üretim" repo](https://github.com/gruntjs/grunt-init-gruntplugin-sample/tree/generated) | [oluşturma transkripti](https://github.com/gruntjs/grunt-init-gruntplugin-sample#project-creation-transcript))
* [grunt-init-jquery](https://github.com/gruntjs/grunt-init-jquery) - QUnit birim testleri de dahil olmak üzere bir jQuery eklentisi oluşturur. ([örnek "üretim" repo](https://github.com/gruntjs/grunt-init-jquery-sample/tree.generated) | [oluşturma transkripti](https://github.com/gruntjs/grunt-init-jquery-sample#project-creation-transcript))
* [grunt-init-node](https://github.com/gruntjs/grunt-init-node) - Node.js modülü oluşturur, Nodeunit birim testleriyle birlikte. ([örnek "üretim" repo](https://github.com/gruntjs/grunt-init-node-sample/tree/generated) | [oluşturma transkripti](https://github.com/gruntjs/grunt-init-node-sample#project-creation-transcript))

## Özel Şablonlar
Özel şablonlar oluşturabilir ve kullanabilirsiniz. Şablonunuz, yukarıda belirtilen şablonlar ile aynı yapıyı izlemelidir.

`my-template` adında bir örnek şablon, bu genel dosya yapısını izlemelidir:

* `my-template/template.js` - ana şablon dosyası.
* `my-template/rename.json` - şablona özgü yeniden adlandırma kuralları, işlenir.
* `my-template/root/` - hedef konuma kopyalanacak dosyalar.

Bu dosyaların `/path/to/my-template` yolunda mevcut olduğunu varsayarsak, `grunt-init /path/to/my-template` komutu şablonu işlemek için kullanılacaktır. Aynı dizinde birden fazla benzersiz adlı şablon mevcut olabilir.

:::tip
Ayrıca, bu özel şablonu `~/.grunt-init/` dizininize (`%USERPROFILE%\.grunt-init\` Windows'ta) koyarsanız, sadece `grunt-init my-template` ile otomatik olarak kullanılabilir hale gelecektir.
:::

### Dosyaları Kopyalama
Bir şablon `init.filesToCopy` ve `init.copyAndProcess` yöntemlerini kullanıyorsa, `root/` alt dizinindeki herhangi bir dosya, init şablonu çalıştırıldığında mevcut dizine kopyalanacaktır.

:::note
_Not: Kopyalanan tüm dosyalar şablon olarak işlenecek ve `{% %}` şablonu, toplanan `props` veri nesnesine karşı işlenecektir, `noProcess` seçeneği ayarlanmadığı sürece. Örneğin bir [jquery şablonuna](https://github.com/gruntjs/grunt-init-jquery) bakabilirsiniz._
:::

### Şablon Dosyalarının Yeniden Adlandırılması veya Hariç Tutulması
`rename.json`, `sourcepath` ile `destpath` yeniden adlandırma eşlemelerini tanımlar. `sourcepath`, kopyalanacak dosyanın `root/` klasörüne göre yolu olmalı, ancak `destpath` değeri `{% %}` şablonlarını içerebilir ve varış yolunu tanımlayabilir.

`false` olarak belirtilen bir `destpath` varsa dosya kopyalanmayacaktır. Ayrıca, `srcpath` için glob desenleri de desteklenir.

## Varsayılan İstem Yanıtlarını Belirleme
Her init isteminin ya önceden tanımlı bir varsayılan değeri vardır ya da mevcut ortamı inceleyerek varsayılan değeri belirlemeye çalışır. Belirli bir istemin varsayılan değerini geçersiz kılmak isterseniz, bunu isteğe bağlı OS X veya Linux `~/.grunt-init/defaults.json` veya Windows `%USERPROFILE%\.grunt-init\defaults.json` dosyasında yapabilirsiniz.

Örneğin, benim `defaults.json` dosyam şu şekilde görünüyor, çünkü varsayılan isimden biraz farklı bir isim kullanmak istiyorum, e-posta adresimi hariç tutmak istiyorum ve otomatik olarak bir yazar URL'si belirtmek istiyorum.

```json
{
  "author_name": "\"Cowboy\" Ben Alman",
  "author_email": "none",
  "author_url": "http://benalman.com/"
}
```

:::warning
_Not: Tüm yerleşik istemler belgelenene kadar, adlarını ve varsayılan değerlerini [kaynak kodda](https://github.com/gruntjs/grunt-init/blob/master/tasks/init.js) bulabilirsiniz._
:::

## Bir Init Şablonu Tanımlama

### exports.description
Bu kısa şablon tanımı, kullanıcı `grunt init` veya `grunt-init ` komutunu çalıştırdığında şablon adıyla birlikte gösterilecektir.

```js
exports.description = descriptionString;
```

### exports.notes
Eğer belirtilirse, bu isteğe bağlı genişletilmiş tanım, herhangi bir istemden önce gösterilecektir. Bu, kullanıcıya isimlendirme kurallarını, hangi istemlerin zorunlu veya isteğe bağlı olabileceğini açıklamak için biraz yardımcı olmanın iyi bir yeridir.

```js
exports.notes = notesString;
```

### exports.warnOn
Eğer bu isteğe bağlı (ama önerilen) joker desen veya joker desenler dizisi eşleşirse, Grunt, kullanıcının `--force` ile geçersiz kılabileceği bir uyarı ile duracaktır. Bu, init şablonunun mevcut dosyaları üzerine yazma olasılığının olduğu durumlarda oldukça faydalıdır.

```js
exports.warnOn = wildcardPattern;
```

En yaygın değer `'*'` olacak, herhangi bir dosya veya dizini eşleştirecektir, kullanılan [minimatch](https://github.com/isaacs/minimatch) joker desen sözdizimi çok fazla esneklik sağlar. Örneğin:

```js
exports.warnOn = 'Gruntfile.js';    // Gruntfile.js dosyası için uyarı.
exports.warnOn = '*.js';            // Herhangi bir .js dosyası için uyarı.
exports.warnOn = '*';               // Herhangi bir nokta dosyası veya nokta dizini için uyarı.
exports.warnOn = '.*';              // Herhangi bir noktalar dosyası veya nokta dizini için uyarı.
exports.warnOn = '{.*,*}';          // Herhangi bir dosya veya dizin (nokta veya nokta olmayan) için uyarı.
exports.warnOn = '!*/**';           // Herhangi bir dosya için uyarı (dizini göz ardı ederek).
exports.warnOn = '*.{png,gif,jpg}'; // Herhangi bir resim dosyası için uyarı.

// Son örneği yazmanın başka bir yolu.
exports.warnOn = ['*.png', '*.gif', '*.jpg'];
```

### exports.template
`exports` özellikleri bu işlevin dışında tanımlanmış olmasına rağmen, tüm gerçek init kodu burada belirtilmiştir. Bu işleve üç argüman geçilir. `grunt` argümanı, tüm `grunt yöntemleri ve kütüphanelerini` içeren bir grunt referansıdır. `init` argümanı, bu init şablonuna özgü yöntemler ve özellikler içeren bir nesnedir. `done` argümanı, init şablonu çalışmayı tamamladığında çağrılması gereken bir işlevdir.

```js
exports.template = function(grunt, init, done) {
  // "Bir init şablonunun içindeki" bölümüne bakın.
};
```

## Bir init şablonunun içinde

### init.addLicenseFiles
Dosyalar nesnesine uygun şekilde adlandırılmış lisans dosyaları ekleyin.

```js
var files = {};
var licenses = ['MIT'];
init.addLicenseFiles(files, licenses);
// files === {'LICENSE-MIT': 'licenses/LICENSE-MIT'}
```

### init.availableLicenses
Mevcut lisanslar dizisini döndür.

```js
var licenses = init.availableLicenses();
// licenses === [ 'Apache-2.0', 'GPL-2.0', 'MIT', 'MPL-2.0' ]
```

### init.copy
Bir mutlak veya ilişkili kaynak yolu verildiğinde, ve isteğe bağlı bir ilişkili varış yolu belirttiğinizde, bir dosyayı kopyalayın, isteğe bağlı olarak belirtilen geri çağırma ile işleyin.

```js
init.copy(srcpath[, destpath], options)
```

### init.copyAndProcess
Verilen nesnedeki tüm dosyalar üzerinde yineleme yapın, kaynak dosyayı varış noktasına kopyalayın, içeriği işleyin.

```js
init.copyAndProcess(files, props[, options])
```

### init.defaults
Kullanıcı tarafından belirtilen varsayılan init değerleri `defaults.json` dosyasından alınır.

```js
init.defaults
```

### init.destpath
Mutlak varış dosyası yolu.

```js
init.destpath()
```

### init.expand
Aynı [grunt.file.expand](https://github.com/gruntjs/grunt/wiki/grunt.file#wiki-grunt-file-expand) gibi çalışır.

Verilen joker desen(ler) ile eşleşen tüm dosya veya dizin yollarının benzersiz bir dizisini döndürür. Bu yöntem, ya virgülle ayrılmış joker desenleri ya da bir joker desenleri dizisi kabul eder. `!` ile başlayan desenler, döndürülen diziden hariç tutulur. Desenler sırasıyla işlenir, bu nedenle dahil etme ve hariç tutma sırası önemlidir.

```js
init.expand([options, ] patterns)
```

### init.filesToCopy
Yeniden adlandırma.json (varsa) kurallarına göre yeniden adlandırılmış (veya kaldırılmış) mutlak kaynak yolu ve görece varış yolu ile kopyalanacak dosyaları içeren bir nesne döndürür.

```js
var files = init.filesToCopy(props);
/* files === { '.gitignore': 'template/root/.gitignore',
  '.jshintrc': 'template/root/.jshintrc',
  'Gruntfile.js': 'template/root/Gruntfile.js',
  'README.md': 'template/root/README.md',
  'test/test_test.js': 'template/root/test/name_test.js' } */
```

### init.getFile
Tek bir görev dosyası yolunu alın.

```js
init.getFile(filepath[, ...])
```

### init.getTemplates
Tüm mevcut şablonların bir nesnesini döndürür.

```js
init.getTemplates()
```

### init.initSearchDirs
Init şablonları için arama dizinlerini başlat. `template`, bir şablonun konumunu belirtir. Ayrıca `~/.grunt-init/` ve grunt-init içindeki temel init görevlerini de içerecektir.

```js
init.initSearchDirs([filename])
```

### init.process
Girdi isteme sürecini başlatın.

```js
init.process(options, prompts, done)
```

```js
init.process({}, [
  // Bu değerler için istem yap
  init.prompt('name'),
  init.prompt('description'),
  init.prompt('version')
], function(err, props) {
  // Tüm işlemler tamamlandı, özelliklerle bir şeyler yapın
});
```

### init.prompt
Bir kullanıcıdan bir değer isteme.

```js
init.prompt(name[, default])
```

### init.prompts
Tüm istemlerin bir nesnesi.

```js
var prompts = init.prompts;
```

### init.readDefaults
Görev dosyalarından (varsa) JSON varsayılanlarını okuyun, bunları tek bir veri nesnesine birleştirin.

```js
init.readDefaults(filepath[, ...])
```

### init.renames
Şablon için yeniden adlandırma kuralları.

```js
var renames = init.renames;
// renames === { 'test/name_test.js': 'test/{%= name %}_test.js' }
```

### init.searchDirs
Şablonlar için arama yapılacak dizinlerin bir dizisi.

```js
var dirs = init.searchDirs;
/* dirs === [ '/Users/shama/.grunt-init',
  '/usr/local/lib/node_modules/grunt-init/templates' ] */
```

### init.srcpath
İsim dosyası için init şablon yollarında ara ve mutlak yolu döndür.

```js
init.srcpath(filepath[, ...])
```

### init.userDir
Kullanıcının şablon dizinine giden mutlak yolu döndürür.

```js
var dir = init.userDir();
// dir === '/Users/shama/.grunt-init'
```

### init.writePackageJSON
Hedef dizinde bir package.json dosyası kaydedin. Geri çağırma, özellikleri eklemek/çıkarmak vb. için kullanılabilir.

```js
init.writePackageJSON(filename, props[, callback])
```

## Yerleşik İstemler

### author_email
`package.json` dosyasında kullanılacak yazarın e-posta adresi. Kullanıcının git konfigürasyonundan varsayılan bir değer bulmaya çalışacaktır.

### author_name
`package.json` ve telif hakkı bildirimlerinde kullanılacak yazarın tam adı. Kullanıcının git konfigürasyonundan varsayılan bir değer bulmaya çalışacaktır.

### author_url
`package.json` dosyasında kullanılacak yazarın web sitesi için herkese açık bir URL.

### bin
Bir CLI scripti için proje kökünden ilişkili bir yol.

### bugs
Projenin sorun izleyicisi için herkese açık bir URL. Projenin bir GitHub deposu varsa, varsayılan olarak GitHub sorun izleyicisine geçecektir.

### description
Projenin tanımı. `package.json` ve README dosyalarında kullanılır.

### grunt_version
Projenin ihtiyaç duyduğu Grunt için geçerli bir semantik sürüm aralığı tanımlayıcısı.

### homepage
Projenin ana sayfası için herkese açık bir URL. GitHub reposu varsa varsayılan olarak GitHub URL'sine geçecektir.

### jquery_version
Bir jQuery projesi ise, projenin ihtiyaç duyduğu jQuery sürümü. Geçerli bir semantik sürüm aralığı tanımlayıcısı olmalıdır.

### licenses
Proje için lisans(lar). Birden fazla lisans boşluklarla ayrılır. Yerleşik lisanslar şunlardır: `MIT`, `MPL-2.0`, `GPL-2.0` ve `Apache-2.0`. Varsayılan olarak `MIT` olarak ayarlanır. `init.addLicenseFiles` ile özel lisanslar ekleyebilirsiniz.

### main
Projenin ana giriş noktası. Varsayılan olarak `lib` klasöründeki proje adı olarak ayarlanır.

### name
Projenin adı. Proje şablonunun dört bir yanında yoğun bir şekilde kullanılacaktır. Varsayılan olarak mevcut çalışma dizinidir.

### node_version
Projenin gerektirdiği Node.js sürümü. Geçerli bir semantik sürüm aralığı tanımlayıcısı olmalıdır.

### npm_test
Projenizde testleri çalıştırmak için komut. Varsayılan olarak `grunt` olarak ayarlanır.

### repository
Projenin git deposu. Varsayılan olarak bir GitHub URL'sini tahmin eder. 

### title
İnsan tarafından okunabilir bir proje adı. Varsayılan olarak gerçekteki proje adının daha insan tarafından okunabilir bir biçimde değiştirilmiş halidir.

### version
Projenin sürümü. Varsayılan olarak ilk geçerli semantik sürüm, `0.1.0` olarak ayarlanır.