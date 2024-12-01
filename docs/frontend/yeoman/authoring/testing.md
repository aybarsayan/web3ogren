---
description: Yeoman test generatorları hakkında bilgi edinin ve birim testlerinin nasıl düzenlenebileceğini keşfedin.
keywords: [Yeoman, test, generator, Mocha, BDD, unit test, helpers]
---

# Tet Etme

Test yardımcıları hakkında daha fazla bilgi edinmek için okumaya devam edin ve Yeoman'ın bir jeneratörün birim testlerini kolaylaştırmak için eklediği araçları keşfedin.

Aşağıdaki örneklerin [Mocha](http://mochajs.org/) ile BDD modunda kullanıldığı varsayılmaktadır. Küresel kavramın, tercihinize göre birim test çerçeve çerçevenize kolayca uygulanması gerekir.

## Testlerinizi Organize Etme

Testlerinizi basit ve kolay düzenlenebilir tutmak önemlidir.

Genellikle testlerinizi düzenlemenin en iyi yolu, her bir jeneratörü ve alt jeneratörleri kendi `describe` bloğuna ayırmaktır. Daha sonra, jeneratörünüzün kabul ettiği her bir seçenek için bir `describe` bloğu ekleyin. Ve ardından, her bir doğrulama (veya ilgili doğrulama) için bir `it` bloğu kullanın.

Kodda, aşağıdaki yapıya benzer bir yapı oluşturmalısınız:

```js
describe('backbone:app', function () {
  it('require.js ile bir proje oluşturur', function () {
      // dosyanın var olduğunu doğrula
      // dosyanın AMD tanımını kullandığını doğrula
  });

  it('webpack ile bir proje oluşturur');
});
```

:::tip
Testlerinizi daha düzenli hale getirmek için, her test senaryosunu iyi tanımlanmış açıklamalarla süslemeyi unutmayın.
:::

## Test Yardımcıları

Yeoman, test yardımcıları sağlayan yöntemler sunmaktadır. Bunlar `yeoman-test` paketinin içinde bulunur.

```js
var helpers = require('yeoman-test');
```

[Tam yardımcıların API'sini burada kontrol edebilirsiniz](https://github.com/yeoman/yeoman-test).

Bir jeneratörün birim testlerini yaparken en kullanışlı yöntem `helpers.run()`'dır. Bu yöntem, dizini ayarlamak, sahte istem, sahte argümanlar vb. çağırabileceğiniz bir [RunContext](https://github.com/yeoman/yeoman-test/blob/master/lib/run-context.js) nesnesi döndürecektir.

```js
var path = require('path');

it('proje oluştur', function () {
  // Dönen nesne bir promise gibi çalışır, bu nedenle işlemin tamamlanmasını beklemek için bunu döndürün
  return helpers.run(path.join(__dirname, '../app'))
    .withOptions({ foo: 'bar' })      // Geçilen sahte seçenekler
    .withArguments(['name-x'])        // Sahte argümanlar
    .withPrompts({ coffee: false })   // Sahte istem yanıtları
    .withLocalConfig({ lang: 'en' }) // Yerel ayarları sahtele
    .then(function() {
      // jeneratör hakkında bir şey doğrula
    });
})
```

:::info
Tes yarışmalarında, birim testlerinizin her yönünü kapsamak için çok sayıda `it` bloğu kullanmanız önemlidir.
:::

Bazen, jeneratörün hedef dizindeki mevcut içeriklerle çalışması için bir test senaryosu oluşturmak isteyebilirsiniz. Bu durumda, `inTmpDir()`'yi bir geri çağırma fonksiyonu ile kullanabilirsiniz, şöyle:

```js
var path = require('path');
var fs = require('fs-extra');

helpers.run(path.join(__dirname, '../app'))
  .inTmpDir(function (dir) {
    // `dir` yeni geçici dizinin yoludur
    fs.copySync(path.join(__dirname, '../templates/common'), dir)
  })
  .withPrompts({ coffee: false })
  .then(function () {
    assert.file('common/file.txt');
  });
```

Geri çağırmanızda asenkron görevler de gerçekleştirebilirsiniz:

```js
var path = require('path');
var fs = require('fs-extra');

helpers.run(path.join(__dirname, '../app'))
  .inTmpDir(function (dir) {
    var done = this.async(); // `this` RunContext nesnesidir.
    fs.copy(path.join(__dirname, '../templates/common'), dir, done);
  })
  .withPrompts({ coffee: false });
```

Çalıştırma Promise'i, jeneratörün çalıştığı dizinle çözümlenecektir. Bu, jeneratörün çalıştığı geçici dizini kullanmak istediğinizde yararlı olabilir:

```js
helpers.run(path.join(__dirname, '../app'))
  .inTmpDir(function (dir) {
    var done = this.async(); // `this` RunContext nesnesidir.
    fs.copy(path.join(__dirname, '../templates/common'), dir, done);
  })
  .withPrompts({ coffee: false })
  .then(function (dir) {
    // `dir` içindeki nesne hakkında bir şey doğrula
  });
```

Eğer jeneratörünüz `composeWith()` çağrıyorsa, o bağımlı jeneratörleri sahtelemek isteyebilirsiniz. `#withGenerators()` kullanarak, ilk öğe olarak `#createDummyGenerator()` ve ikinci öğe olarak sahte jeneratörün bir ad alanı olan bir dizi dizisini geçin:

```js
var deps = [
  [helpers.createDummyGenerator(), 'karma:app']
];
return helpers.run(path.join(__dirname, '../app')).withGenerators(deps);
```

:::warning
Test senaryolarınızı oluştururken doğru bağımlılıkları sağlamadığınızda odak kaybı yaşanabilir.
:::

Eğer promises'tan nefret ediyorsanız, `'ready'`, `'error'`, ve `'end'` olaylarını kullanabilirsiniz:

```js
helpers.run(path.join(__dirname, '../app'))
  .on('error', function (error) {
    console.log('Ah Hayır!', error);
  })
  .on('ready', function (generator) {
    // Bu, `generator.run()` çağrılmadan hemen önce çağrılır
  })
  .on('end', done);
```

Ayrıca, bir jeneratörü bir modül olarak içe aktararak çalıştırabilirsiniz. Bu, jeneratörünüzün kaynak kodu dönüştürülmüşse faydalıdır.

`run` için aşağıdaki ayarları sağlamanız gerekecek:
- `resolved`: Jeneratörün yolu, örneğin `../src/app/index.js`
- `namespace`: Jeneratörün ad alanı, örneğin `mygenerator:app`

```js
var MyGenerator = require('../src/app');

helpers.run(MyGenerator, { 
  resolved: require.resolve(__dirname, '../src/app/index.js'),
  namespace: 'mygenerator:app'
});
```

## Doğrulama Yardımcıları

Yeoman, [yerel assert modülünü](https://nodejs.org/api/assert.html) jeneratörle ilgili doğrulama yardımcıları ile genişletir. Doğrulama yardımcılarının tam listesini [`yeoman-assert` deposunda](https://github.com/yeoman/yeoman-assert) görebilirsiniz.

Doğrulama yardımcılarını içe aktarın:

```js
var assert = require('yeoman-assert');
```

### Dosyaların varlığını doğrula

```js
assert.file(['Gruntfile.js', 'app/router.js', 'app/views/main.js']);
```

`assert.noFile()` bunun tersini doğrular.

### Bir dosya içeriğini doğrula

```js
assert.fileContent('controllers/user.js', /App\.UserController = Ember\.ObjectController\.extend/);
```

`assert.noFileContent()` bunun tersini doğrular.