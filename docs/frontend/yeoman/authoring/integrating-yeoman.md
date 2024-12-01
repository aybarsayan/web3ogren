---
description: Yeoman'ın entegrasyon süreci ve nasıl bir ortam oluşturulacağı hakkında kapsamlı bir rehber.
keywords: [Yeoman, entegrasyon, kullanıcı arayüzü, ortam, jeneratör, JavaScript]
---

# Yeoman'ı Entegre Etmek

Her seferinde bir jeneratör çalıştırdığınızda, aslında `yeoman-environment` kullanıyorsunuz. Ortam, herhangi bir UI bileşeninden ayrılmış temel bir sistemdir ve herhangi bir araç tarafından soyutlanabilir. `yo` çalıştırdığınızda, esasen Yeoman ortamının üstünde bir terminal UI yüzeyi çalıştırıyorsunuz.

## Temel Bilgiler

Bilmeniz gereken ilk şey, ortam sisteminin `yeoman-environment` paketinde yer aldığıdır. Bunu aşağıdaki komutu çalıştırarak kurabilirsiniz:

```sh
npm install --save yeoman-environment
```

Bu modül, kurulu jeneratörleri almak, kayıt etmek ve çalıştırmak için yöntemler sağlar. Ayrıca, jeneratörlerin kullandığı kullanıcı arayüzleri adaptörünü de sağlar. Biz [tam API belgeleri](https://yeoman.github.io/environment/) sunuyoruz (bu mevcut olan yöntemlerin kısa listesidir).

## `yeoman-environment` Kullanımı

:::tip
**Önemli:** `yeoman-environment` package'ini doğru bir şekilde kullanmak, projenizin başarısı için kritik öneme sahiptir.
:::

### Basit bir kullanım örneği

Daha derin konulara geçmeden önce, `yeoman-environment`'in basit bir kullanım örneği ile başlayalım.

Bu örnekte `npm`'nin bir `npm init` komutu sağlayarak bir `package.json` oluşturmak istediğini varsayalım. Belgelerin diğer sayfalarını okuyarak, bir jeneratör oluşturmayı zaten biliyorsunuz - bu nedenle, `generator-npm`'nin zaten var olduğunu varsayalım. Bunu nasıl çağıracağımızı göreceğiz.

İlk adım, yeni bir ortam örneği oluşturmaktır.

```js
var yeoman = require('yeoman-environment');
var env = yeoman.createEnv();
```

Daha sonra, `generator-npm`'yi kaydetmek isteyeceğiz böylece daha sonra kullanılabilir. Burada iki seçeneğiniz var:

```js
// Burada bir jeneratörün yoluna göre kaydediyoruz. Namespace sağlamak
// isteğe bağlıdır.
env.register(require.resolve('generator-npm'), 'npm:app');

// Ya da bir jeneratör yapıcısı sağlayabilirsiniz. Bunu yaparken, 
// bir namespace'i manuel olarak sağlamanız gerekir.
var GeneratorNPM = generators.Base.extend(/* yöntemlerinizi buraya koyun */);
env.registerStub(GeneratorNPM, 'npm:app');
```

İstediğiniz kadar jeneratörü kayıt edebileceğinizi unutmayın. Kayıtlı jeneratörler, ortam boyunca (örneğin, bileşen oluşturma için) kullanılabilir hale gelir.

Bu noktada, ortamınız `npm:app`'yi çalıştırmaya hazır.

```js
// En basit haliyle
env.run('npm:app', done);

// Veya argüman ve seçenek geçerek
env.run('npm:app some-name', { 'skip-install': true }, done);
```

İşte bu kadar. Bu kodu bir `bin` çalıştırılabilir dosyasına koymanız yeterli ve `yo` kullanmadan bir Yeoman jeneratörünü çalıştırabilirsiniz.

### Yüklenmiş Jeneratörleri Bulma

Ama kullanıcı makinesinde yüklenmiş her Yeoman jeneratörüne erişim sağlamak isterseniz ne olur? O zaman kullanıcı diskinin bir aramasını gerçekleştirmeniz gerekir.

```js
env.lookup(function () {
  env.run('angular');
});
```

`Environment#lookup()` bir geri çağırma alır ve bu geri çağırma, Yeoman kurulu jeneratörleri aramayı tamamladığında çağrılır. Bulunan her jeneratör ortamda kayıtlı olacak.

:::info
Yerel jeneratörler, küresel jeneratörleri geçersiz kılacak şekilde organize edilmiştir.
:::

### Kayıtlı Jeneratör hakkında veri alma

`Environment#getGeneratorsMeta()` çağrıldığında, arama görevinin kaydettiği meta verileri tanımlayan bir nesne döndürür.

Her nesne anahtarı bir jeneratör namespace'idir ve değer nesnesi bu anahtarları içerir:

- `resolved`: bir jeneratöre çözülmüş yol
- `namespace`: jeneratörün namespace'i

Örneğin:

```json
{
  "webapp:app": {
    "resolved": "/usr/lib/node_modules/generator-webapp/app/index.js",
    "namespace": "webapp:app"
  }
}
```

Not: `#registerStub()` kullanılarak kaydedilen jeneratörler `"unknown"` değerine sahip `resolved` olacaktır.

## Özel Bir Kullanıcı Arayüzü (UI) Sağlama

Yeoman, jeneratör çalıştırmak için gerekli kullanıcı arayüzlerini kolayca sağlaması adına IDE, kod editörü gibi araçlar için bir soyutlama katmanı olarak _adaptörler_ kullanır.

Bir adaptör, kullanıcı ile tüm etkileşimleri yönetmekten sorumlu olan nesnedir. Eğer klasik komut satırından farklı bir etkileşim modeli sağlamak istiyorsanız, kendi adaptörünüzü yazmalısınız. Bir kullanıcıyla etkileşimde bulunmanın her yöntemi bu adaptör üzerinden geçer (özellikle: isteme, günlük tutma ve karşılaştırma).

:::note
Varsayılan olarak, Yeoman [Terminal Adaptörü](https://github.com/yeoman/environment/blob/master/lib/adapter.js) sunar.
:::

Bir adaptör yüklemek için `yeoman.createEnv(args, opts, adapter)` fonksiyonunun üçüncü parametresini kullanın.

Bir adaptör, en az üç metot sağlamalıdır.

### `Adapter#prompt()`

Bu, soru-cevap işlevselliğini sağlar (örneğin, `yo`'yu başlattığınızda, kullanıcının yanıtlaması için olası eylemlerin bir seti sunulur). İmzası ve davranışı [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) metodlarına uyar. Jeneratörler `this.prompt` çağırdığında, çağrı sonunda adaptör tarafından işlenir.

### `Adapter#diff()`

Bir çakışma ile karşılaşıldığında ve kullanıcı yeni dosya ile eski dosya arasında bir karşılaştırma istemediğinde dahili olarak çağrılır (her iki dosyanın içeriği argüman olarak geçirilir).

### `Adapter#log()`

Bu, genel çıktı için tasarlanmış hem bir fonksiyon hem de bir nesnedir. Tam metod listesi için [`lib/util/log.js`](https://github.com/yeoman/environment/blob/master/lib/util/log.js) sayfasına bakın.

## Örnek Uygulamalar

İşte `yeoman-environment` kullanan modüllerin/eklentilerin/uygulamaların bir listesi. Bunları ilham almak için kullanabilirsiniz.

- [yo](https://github.com/yeoman/yo)
- [yeoman-app](https://github.com/yeoman/yeoman-app)