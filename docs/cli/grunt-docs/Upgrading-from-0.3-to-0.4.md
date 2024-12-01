---
description: Grunt'ın en son sürüm bilgileri, yapılandırma detayları ve eklentilerin kullanımı hakkında ayrıntılı bilgi.
keywords: [Grunt, Gruntfile, eklentiler, npm, yapılandırma]
---

# Grunt 3.0'dan 0.4'e Geçiş

Sürümler 0.4 ve daha eski olanlar artık bakımda değildir. Daha fazla bilgi edinmek ve ek destek seçeneklerini görmek için `buraya` göz atın.

:::info
_Not: Grunt ile tanışık olsanız bile, yeni [[Başlarken]] kılavuzunu okumak faydalı olacaktır._
:::

Grunt artık üç parçaya ayrılmıştır: `grunt`, `grunt-cli` ve `grunt-init`.

1. npm modülü `grunt`, projenize yerel olarak yüklenmelidir. Görevleri çalıştırmak, eklentileri yüklemek vb. için kodu ve mantığı içerir.
2. npm modülü `grunt-cli`, küresel olarak yüklenmelidir. `grunt` komutunu PATH'inize koyar, böylece her yerde çalıştırabilirsiniz. Kendi başına bir şey yapmaz; görevi, projenize yerel olarak yüklenen Grunt'ı yüklemek ve çalıştırmak olan, versiyonuna bakılmaksızın çalıştırır. Bunun neden değiştiği hakkında daha fazla bilgi için lütfen [npm 1.0: Global vs Local installation](http://blog.nodejs.org/2011/03/23/npm-1-0-global-vs-local-installation) yazısını okuyun.
3. `init` görevini kendi npm modülü olan `grunt-init` olarak ayırdık. `npm install -g grunt-init` ile küresel olarak yüklenmeli ve `grunt-init` komutuyla çalıştırılmalıdır. Önümüzdeki aylarda, [Yeoman](http://yeoman.io/) tamamen grunt-init'in yerini alacaktır. Daha fazla bilgi için [grunt-init proje sayfasına](https://github.com/gruntjs/grunt-init) göz atın.

---

## Grunt 0.3 Notları

Grunt 0.3'ten yükseltiyorsanız, global `grunt`'ı kaldırdığınızdan emin olun:

```shell
npm uninstall -g grunt
```

:::warning
_0.3.x için, eklenti adları ve görev yapılandırma seçenekleri "Gruntfile" bölümünde gösterilenlerden farklı olabilir._
:::

_Bu dosya 0.3.x sürümleri için `grunt.js` olarak adlandırılmıştır._

---

## Var olan görevler ve eklentiler

Tüm `grunt-contrib-*` serisi eklentileri Grunt 0.4 ile uyumlu hale getirilmiştir. Ancak, Grunt 0.3 için yazılmış üçüncü taraf eklentilerin 0.4 ile çalışmaya devam etmesi pek olası değildir, güncellenene kadar. Eklenti yazarlarıyla hızlı bir şekilde bunu sağlamak için aktif olarak çalışıyoruz.

:::note
_Gelecek bir Grunt sürümü, eklentilerin gelecekteki güncellemelerden etkilenmemesi için Grunt'ın mimarisini birbirinden ayırmaya odaklanacaktır._
:::

---

## Gereksinimler

- Grunt artık Node.js sürümünü `>= 0.8.0` olarak gerektirmektedir.

---

## Gruntfile

- "Gruntfile" adı `grunt.js`'dan `Gruntfile.js`'ye değiştirilmiştir.
- CoffeeScript, `Gruntfile.coffee` projesi `Gruntfile` veya `*.coffee` görev dosyalarınızda desteklenmektedir (JS'ye dönüştürme otomatik olarak gerçekleşir).

Daha fazla bilgi için [[Başlarken]] kılavuzundaki "Gruntfile" bölümüne bakın.

---

## Ana Görevler artık Grunt Eklentileri

Grunt 0.3'te yer alan sekiz ana görev artık ayrı Grunt eklentileridir. Her biri eklenti olarak yüklenmesi gereken bağımsız bir npm modülüdür; bunu [[Başlarken]] kılavuzunun "Grunt eklentilerini ve görevlerini yükleme" bölümünde görebilirsiniz.

- concat → [grunt-contrib-concat](https://github.com/gruntjs/grunt-contrib-concat) eklentisi
- init → bağımsız [grunt-init] aracı
- lint → [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint) eklentisi
- min → [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify) eklentisi
- qunit → [grunt-contrib-qunit](https://github.com/gruntjs/grunt-contrib-qunit) eklentisi
- server → [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect) eklentisi
- test → [grunt-contrib-nodeunit](https://github.com/gruntjs/grunt-contrib-nodeunit) eklentisi
- watch → [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) eklentisi

Bazı görev adları ve seçenekleri değişmiştir. En son yapılandırma detayları için yukarıda bağlantı verilen her eklentinin dokümantasyonuna bakmayı unutmayın.

---

## Yapılandırma

Grunt 0.4 görevleri için yapılandırma formatı standart hale getirilmiş ve büyük ölçüde geliştirilmiştir. Daha fazla bilgi için [[Görevleri yapılandırma]] kılavuzuna ve ayrıca bireysel eklenti dokümantasyonuna bakın.

- Dosya globbing (joker karakter) kalıpları artık eşleşen dosyaları hariç tutmak için olumsuz hale getirilebilir.
- Görevler artık standart bir `options` nesnesini destekliyor.
- Görevler artık standart bir `files` nesnesini destekliyor.

:::tip
`` tarzı şablon dizeleri, `Gruntfile` içinde yapılandırma verisi olarak belirtildiğinde otomatik olarak genişletilir, daha fazla bilgi için [[grunt.template]] belgelerine bakın.
:::

**Yönergeler kaldırılmıştır**, ancak işlevselliği korunmuştur. Bu değişiklikler yapılabilir:

- `''` → `''`
- `''` → `grunt.file.readJSON('file.json')`
- `''` → `grunt.template.process(grunt.file.read('file.js'))`

`''` veya `''` ile dosya listesinde bir afiş belirtmek yerine, [grunt-contrib-concat](https://github.com/gruntjs/grunt-contrib-concat) ve [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify) eklentilerinin her birinin bir `banner` seçeneği vardır.

Afişleri dosyalardan tek tek çıkarmak yerine `''`, her bir [grunt-contrib-concat](https://github.com/gruntjs/grunt-contrib-concat) ve [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify) eklentisinin afişleri çıkarma/saklama seçenekleri vardır.

---

## Takip Görevi Değişiklikleri

Alias görevini belirtirken, çalıştırılacak görevlerin listesi artık bir dizi olarak belirtilmelidir.

```js
// v0.3.x (eski format)
grunt.registerTask("default", "jshint nodeunit concat");
// v0.4.x (yeni format)
grunt.registerTask("default", ["jshint", "nodeunit", "concat"]);
```

---

## Görev argümanları artık boşluk içerebilir

Yukarıda belirtilen alias görev değişikliği (görev listeleri bir dizi olarak belirtilmelidir) bunu mümkün kılmaktadır. Görev argümanlarını belirlerken, boşluk içerenleri alıntı işaretleriyle çevrelemeyi unutmayın, böylece doğru şekilde ayrıştırılabilir.

```shell
grunt my-task:argument-without-spaces "other-task:argument with spaces"
```

---

## Karakter kodlamaları

Karakter kodlamalarını normalize etmek için `file.defaultEncoding` yöntemi eklendi ve tüm `grunt.file` yöntemleri belirtilen kodlamayı destekleyecek şekilde güncellendi.

---

## Yardımcılar

Grunt'ın yardımcı sistemi, node `require` lehine kaldırılmıştır. Grunt eklentileri arasında işlevselliği paylaşmak için kısa bir örnek için [grunt-lib-legacyhelpers](https://github.com/gruntjs/grunt-lib-legacyhelpers) sayfasını inceleyin. Eklenti yazarlarının eklentilerini güncellemeleri teşvik edilmektedir.

---

## API

Grunt API'si 0.3'ten 0.4'e önemli değişiklikler geçirmiştir.

- `grunt`
  - `grunt.registerHelper` ve `grunt.renameHelper` yöntemleri kaldırılmıştır.
- `grunt.config`
  - `config.get` yöntemi, `` şablonlarını otomatik olarak genişletmek için değiştirildi.
  - Ham (genişletilmemiş) yapılandırma verilerini almak için `config.getRaw` yöntemi eklendi.
  - Değiştirilen `config.process` yöntemi artık bir değeri yapılandırmadan alındığı gibi işler ve şablonları ham olarak genişletir. Bu yöntem, `config.get` içinde içsel olarak çağrılır, ancak `config.getRaw` içinde çağrılmaz.
- `grunt.event` yöntemleri eklenmiştir, böylece görevler olaylar yayabilir.
- `grunt.fail`
  - `--no-color` seçeneği belirtilirse bir bip sesi çıkarmaz.
  - `fail.code` çıkış kodu haritası eklendi.
  - `fail.warnAlternate` yöntemi kaldırıldı.
- `grunt.file`
  - Görevler artık otomatik olarak `~/.grunt/tasks/` dizininden yüklenmez (bunları projenize yerel olarak yükleyin!).
  - Karakter kodlamasını normalize etmek için `file.defaultEncoding` yöntemi eklendi.
  - `file.delete` yöntemi eklendi.
  - Görevlere ait olan `file.exists`, `file.isDir`, `file.isFile`, `file.isLink`, `file.isPathCwd`, `file.isPathInCwd`, `file.doesPathContain`, `file.arePathsEquivalent` test yöntemleri eklendi.
  - Dosya yollarında joker karakter kalıplarını eşleştirmek için `file.match` ve `file.isMatch` yöntemleri eklendi.
  - 1'e 1 kaynak-hedef dosya eşlemesi oluşturmak için `file.expandMapping` yöntemi eklendi.
  - `file.readYAML` yöntemi eklendi.
  - `file.findup` yöntemi [findup-sync](https://github.com/cowboy/node-findup-sync) modülünü kullanacak şekilde değiştirildi.
  - `file.glob` yöntemi [glob](https://github.com/isaacs/node-glob) modülünü kullanacak şekilde değiştirildi.
  - `file.minimatch` yöntemi [minimatch](https://github.com/isaacs/minimatch) modülünü açığa çıkarır.
  - `file.userDir` yöntemi kaldırılmıştır (bu [grunt-init] içine taşınmıştır).
  - `file.clearRequireCache` yöntemi kaldırılmıştır.
  - `file.expandFiles` ve `file.expandDirs` yöntemleri kaldırılmıştır, bunun yerine `file.expand` yönteminin `filter` seçeneğini kullanın.
  - `file.expandFileURLs` yöntemi kaldırılmıştır. Dosyaların belirtilmesi gereken yerlerde URL belirtmeyin (örn. qunit görevi artık bir `urls` seçeneği sunmaktadır).
- `grunt.task`
  - Hem `task.registerTask` hem de `task.registerMultiTask` ile kaydedilen görevler, `this.options` yöntemine sahiptir.
  - `this.file` özelliğine multi görev `files` nesnelerinin normalleştirilmesine yardımcı olmak için `task.normalizeMultiTaskFiles` yöntemi eklendi.
  - `task.registerHelper` ve `task.renameHelper` yöntemleri kaldırılmıştır.
  - `task.searchDirs` özelliği kaldırılmıştır.
  - `task.expand`, `task.expandDirs`, `task.expandFiles`, `task.getFile`, `task.readDefaults` yöntemleri kaldırılmıştır (bunlar [grunt-init] içine taşınmıştır).
- `grunt.package` Grunt'ın `package.json` dosyasında saklanan meta verileri yansıtır.
- `grunt.version` Grunt'ın mevcut sürümünü dize olarak ifade eder.
- `grunt.template`
  - Yeni şablon ayırıcıları eklemek için `template.addDelimiters` yöntemi eklendi.
  - Şablon ayırıcılarını seçmek için `template.setDelimiters` yöntemi eklendi.
  - `init` ve `user` şablon ayırıcıları kaldırılmıştır, ancak ihtiyacınız olursa, tekrar ekleyebilirsiniz ([grunt-init] bunu `{% %}` şablon ayırıcılarını etkinleştirmek için kullanır).
- `grunt.util` artık kaldırılan `grunt.utils`'in yerini alır.
  - `util._`, [Lo-Dash](http://lodash.com/) kullanacak şekilde değiştirildi.
  - `util.callbackify` yöntemi eklendi.
  - `util.spawn` yöntemi çok daha iyi davrandı ve sonuçtaki geri çağırma işlevine daha tutarlı argümanlar geçti.

---

## Görev / eklenti yazarları

**Eklenti yazarları, lütfen depolarınızın README dosyasında hangi sürüm numarasının Grunt 0.3 ile uyumluluğu bozduğunu açıkça belirtin.**

### Görevler

- Çoklu görevler
  - Hedef başına bir `files` nesnesinde birden fazla kaynak-hedef dosya eşlemesi belirtilebilir (bu isteğe bağlıdır).
- `this.files / grunt.task.current.files`
  - `this.files` özelliği, multi görevde döngüye alınacak kaynak-hedef dosya eşlemesi nesnelerinin bir dizisidir. Her zaman bir dizi olacaktır ve en yaygın kullanım durumu tek bir dosya belirtmek olsa bile, her zaman üzerinde döngü yapmalısınız.
  - Her kaynak-hedef dosya eşlemesi nesnesi bir `src` ve bir `dest` özelliğine sahiptir (ve muhtemelen diğerleri, kullanıcının belirttiklerine bağlıdır). `src` özelliği, kullanıcının belirtmiş olabileceği herhangi bir glob deseninden zaten genişletilmiştir.
- `this.filesSrc / grunt.task.current.filesSrc`
  - `this.filesSrc` özelliği, belirtilen tüm `src` özellikleri tarafından eşleşen tüm dosyaların azaltılmış, benzersiz bir dizisidir. Salt okunur görevler için yararlıdır.
- `this.options / grunt.task.current.options`
  - `this.options` yöntemi, görevler içinde seçenekleri normalleştirmek için kullanılabilir. Bir görev içinde varsayılan seçenekleri şu şekilde belirtebilirsiniz: `var options = this.options({option: 'defaultvalue', ...});`

### Eklentiler

Grunt 0.4 ile uyumlu eklentiler için güncellenmiş bir `gruntplugin` şablonu oluşturulmuş ve bağımsız [grunt-init] ile erişilebilir hale getirilmiştir.

---

## Sorun Giderme

- Daha önce Grunt 0.4'ün bir geliştirici sürümünü veya herhangi bir grunt-contrib eklentisini yüklediyseniz, Grunt ve grunt-contrib eklentilerinin son sürümünü çektiğinizden emin olmak için önce `npm cache clean` ile npm önbelleğinizi temizlemelisiniz.

[grunt-init]: https://github.com/gruntjs/grunt-init