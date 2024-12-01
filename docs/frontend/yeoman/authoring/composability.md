---
description: Bileşebilirlik, Yeoman'daki jeneratörlerin nasıl bir araya getirildiğini ve kullanıldığını açıklar. Bileşenlerin entegre çalışması hakkında bilgi sağlar.
keywords: [bileşebilirlik, Yeoman, jeneratör, composeWith, API, bağımlılıklar, peerDependencies]
---

#  Bileşebilirlik

> Bileşebilirlik, daha küçük parçaları birleştirerek tek bir büyük şey yapma yoludur. Bir nevi [Voltron&reg; gibi](http://25.media.tumblr.com/tumblr_m1zllfCJV21r8gq9go11_250.gif)

Yeoman, jeneratörlerin ortak bir zemin üzerine inşa etmesi için birden fazla yol sunar. Aynı işlevselliği yeniden yazmanın anlamı yoktur, bu nedenle diğer jeneratörler içinde jeneratörleri kullanmak için bir API sağlanmıştır.

Yeoman'da, bileşebilirlik iki şekilde başlatılabilir:

* **Bir jeneratör**, kendisini başka bir jeneratör ile birleştirmeye karar verebilir (örneğin, `generator-backbone`, `generator-mocha` kullanır).
* **Son kullanıcı** da bileşimi başlatabilir (örneğin, Simon, SASS ve Rails ile bir Backbone projesi oluşturmak istiyor). 

:::note
Not: Son kullanıcı tarafından başlatılan bileşim, planlı bir özelliktir ve şu anda mevcut değildir.
:::

## `this.composeWith()`

`composeWith` yöntemi, jeneratörün başka bir jeneratörle (veya alt jeneratörle) yan yana çalışmasına olanak tanır. Bu şekilde, her şeyi tek başına yapmak zorunda kalmadan, diğer jeneratörden özellikler kullanabilir.

Bileşim yaparken, `çalışma bağlamını ve çalışma döngüsünü` unutmayın. Belirli bir öncelik grubu yürütmesinde, tüm bileşen jeneratörleri o gruptaki işlevleri yürütür. Daha sonra bu, bir sonraki grup için tekrarlanır. Jeneratörler arasındaki yürütme, `composeWith` çağrılma sırasına göre aynıdır, bkz. `yürütme örneği`.

### API

`composeWith`, iki parametre alır.

1. `generatorPath` - Birleştirmek istediğiniz jeneratöre işaret eden tam bir yol (genellikle `require.resolve()` kullanarak).
2. `options` - Bileşen jeneratör çalıştığında aktarılması gereken seçenekleri içeren bir nesne.

:::tip
`peerDependencies` jeneratörü ile bileşim yaparken:
```js
this.composeWith(require.resolve('generator-bootstrap/generators/app'), {preprocessor: 'sass'});
```
:::

`require.resolve()` sağlanan modülü Node.js'in yükleyeceği yoldan döner.

:::warning
Not: `yeoman-generator`'ın 1.0'dan daha eski bir sürümüne dayalı bir Jeneratöre `arguments` geçirmeniz gerekiyorsa, `options.arguments` anahtarı olarak bir `Array` sağlayarak bunu yapabilirsiniz.
:::

Bu, teşvik edilmeyen bir uygulama olsa da, `composeWith`'e bir jeneratör adı alanını da geçirebilirsiniz. Bu durumda, Yeoman, o jeneratörü **peerDependencies** olarak veya son kullanıcı sisteminde global olarak yüklü olarak bulmaya çalışacaktır.

```js
this.composeWith('backbone:route', {rjs: true});
```

### Jeneratör sınıfı ile bileşim

`composeWith`, ilk argüman olarak bir nesne de alabilir. Nesne aşağıdaki özellikleri içermelidir:

- `Generator` - Birleştirilmek istenen jeneratör sınıfı
- `path` - Jeneratör dosyalarına giden yol

Bu, projenizde tanımlanan veya diğer modüllerden içe aktarılmış jeneratör sınıfları ile birleştirmenizi sağlar. `composeWith`'e ikinci argüman olarak `options` geçmek beklenildiği gibi çalışır.

```js
// generator-node'un ana jeneratörünü içe aktar
const NodeGenerator = require('generator-node/generators/app/index.js');

// Bu ile bileşim yap
this.composeWith({
  Generator: NodeGenerator,
  path: require.resolve('generator-node/generators/app')
});
```

###  Yürütme örneği
```js
// In my-generator/generators/turbo/index.js
module.exports = class extends Generator {
  prompting() {
    this.log('prompting - turbo');
  }

  writing() {
    this.log('writing - turbo');
  }
};

// In my-generator/generators/electric/index.js
module.exports = class extends Generator {
  prompting() {
    this.log('prompting - zap');
  }

  writing() {
    this.log('writing - zap');
  }
};

// In my-generator/generators/app/index.js
module.exports = class extends Generator {
  initializing() {
    this.composeWith(require.resolve('../turbo'));
    this.composeWith(require.resolve('../electric'));
  }
};
```

`yo my-generator` komutunu çalıştırdığınızda, bu sonuçlanacaktır:

```
prompting - turbo
prompting - zap
writing - turbo
writing - zap
```

`composeWith` çağrılarının sırasını tersine çevirerek işlev çağrı sırasını değiştirebilirsiniz.

Diğer npm'de mevcut olan kamu jeneratörleri ile de birleştirme yapabileceğinizi unutmayın.

Bileşebilirlik ile ilgili daha karmaşık bir örnek için, [generator-generator](https://github.com/yeoman/generator-generator/blob/master/app/index.js) ile inceleyin, 
bu da [generator-node](https://github.com/yeoman/generator-node) ile birleştirilmiştir.

## Bağımlılıklar veya peerDependencies

*npm*, üç tür bağımlılığı destekler:

* `dependencies`, jeneratöre yerel olarak yüklenir. Kullandığınız bağımlılığın sürümünü kontrol etmek için en iyi seçenektir. Bu tercih edilen seçenektir.
* `peerDependencies`, jeneratörle birlikte, kardeş olarak yüklenir. Örneğin, `generator-backbone` `generator-gruntfile`'ı bir peer bağımlılık olarak belirlediyse, klasör yapısı şu şekilde olur:

    ```
    ├───generator-backbone/
    └───generator-gruntfile/
    ```
* `devDependencies`, test ve geliştirme aracı içindir. Bu burada gerekli değildir.

:::info
`peerDependencies` kullanırken, diğer modüllerin de istenen modüle ihtiyaç duyabileceğini unutmayın. Belirli bir sürüm (veya dar bir sürüm aralığı) isteyerek sürüm çatışmalarını önlemek önemlidir. Yeoman’ın `peerDependencies` ile önerisi, her zaman _daha yüksek veya eşit (>=)_ veya _herhangi (*)_ mevcut sürümleri talep etmektir. Örneğin:
```json
{
  "peerDependencies": {
    "generator-gruntfile": "*",
    "generator-bootstrap": ">=1.0.0"
  }
}
```
:::

**Not**: npm@3 itibarıyla, `peerDependencies` artık otomatik olarak yüklenmemektedir. Bu bağımlılıkları yüklemek için elle yüklenmelidir: `npm install generator-yourgenerator generator-gruntfile generator-bootstrap@">=1.0.0"`