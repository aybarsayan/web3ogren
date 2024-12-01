---
description: Bu belgede, kendi Yeoman üreticinizi nasıl oluşturup dağıtacağınızı öğreneceksiniz. Adım adım rehberimiz, üretici oluşturma sürecinin temel unsurlarını kapsamaktadır.
keywords: [Yeoman, üretici, Node.js, generator-generator, npm, yazılım geliştirme, dokümantasyon]
---

# Kendi Yeoman Üreticinizi Yazmak
### Üreticilere yeni mi başlıyorsunuz? Buradan başlayın

Üreticiler, Yeoman ekosisteminin yapı taşlarıdır. Bunlar, son kullanıcılar için dosyalar oluşturmak üzere `yo` tarafından çalışan eklentilerdir.

Bu bölümü okuduğunuzda, kendi üreticinizi nasıl oluşturup dağıtacağınızı öğreneceksiniz.


  :::note
  Kullanıcıların kendi üreticileriyle başlamalarına yardımcı olmak için bir [generator-generator](https://github.com/yeoman/generator-generator) geliştirdik. Aşağıdaki kavramları anladıktan sonra, kendi üreticinizi başlatmak için bunu kullanabilirsiniz.
  :::  


---

## Üreticilerinizi Düzenleme

### Bir node modülü olarak ayarlama

Bir üretici, temelinde bir Node.js modülüdür.

**Öncelikle**, üreticinizi yazacağınız bir klasör oluşturun. Bu klasör `generator-name` (burada `name`, üreticinizin adıdır) olarak adlandırılmalıdır. Bu önemlidir, çünkü Yeoman, mevcut üreticileri bulmak için dosya sistemine güvenir.

**Üretici klasörünüze girdiğinizde**, bir `package.json` dosyası oluşturun. Bu dosya, bir Node.js modül manifestosudur. Bu dosyayı, komut satırından `npm init` çalıştırarak veya aşağıdakileri manuel olarak girerek oluşturabilirsiniz:

```json
{
  "name": "generator-name",
  "version": "0.1.0",
  "description": "",
  "files": [
    "generators"
  ],
  "keywords": ["yeoman-generator"],
  "dependencies": {
    "yeoman-generator": "^1.0.0"
  }
}
```

> **Not:** `name` özelliği `generator-` ile başlamalıdır. `keywords` özelliği `"yeoman-generator"` içermeli ve depo, `üreticiler sayfamızda` dizinlenebilmek için bir açıklamaya sahip olmalıdır.

`yeoman-generator` paketinin en son sürümünü bir bağımlılık olarak ayarladığınızdan emin olun. Bunu `npm install --save yeoman-generator` çalıştırarak yapabilirsiniz.

`files` özelliği, üreticiniz tarafından kullanılan dosyaların ve dizinlerin bir dizisi olmalıdır.

Gerekirse diğer [`package.json` özelliklerini](https://docs.npmjs.com/files/package.json) ekleyin.

---

### Klasör ağacı

Yeoman'ın işlevselliği, dizin ağacınızı nasıl yapılandırdığınıza bağlıdır. Her alt üretici kendi klasörü içinde yer alır.

`yo name` çağrıldığında kullanılan varsayılan üretici, `app` üreticisidir. Bu, `app/` dizininde bulunmalıdır.

`yo name:subcommand` çağrıldığında kullanılan alt üreticiler, alt komut ile tam olarak aynı adı taşıyan klasörlerde saklanır.

Bir örnek proje, bir dizin ağacı şöyle görünebilir:

```
├───package.json
└───generators/
    ├───app/
    │   └───index.js
    └───router/
        └───index.js
```

Bu üretici, `yo name` ve `yo name:router` komutlarını açığa çıkaracaktır.

:::info
Yeoman, iki farklı dizin yapısına izin verir. Mevcut üreticileri kaydetmek için `./` ve `generators/` dizinlerinde arama yapacaktır.
:::

Önceki örnek, şu şekilde de yazılabilir:

```
├───package.json
├───app/
│   └───index.js
└───router/
    └───index.js
```

Bu ikinci dizin yapısını kullanıyorsanız, `package.json` dosyanızdaki `files` özelliğini tüm üretici klasörlerine işaret ettiğinizden emin olun.

```json
{
  "files": [
    "app",
    "router"
  ]
}
```

---

## Üreticiyi Genişletme

Bu yapıyı oluşturduktan sonra, gerçek üreticiyi yazma zamanı geldi.

**Yeoman**, kendi davranışınızı uygulamak için genişletebileceğiniz bir temel üretici sunar. Bu temel üretici, işinizi kolaylaştıracak birçok işlevselliği ekleyecektir.

Üreticinin `index.js` dosyasında, temel üreticiyi genişletmenin yolu şudur:

```js
var Generator = require('yeoman-generator');

module.exports = class extends Generator {};
```

> **Not:** Genişletilen üreticiyi `module.exports`'a atıyoruz, böylece ekosisteme mevcut hale gelmiş oluyor. Bu, [Node.js'te modül dışa aktarma](https://nodejs.org/api/modules.html#modules_module_exports) yöntemimizdir.

### Yapıcıyı Geçersiz Kılma

Bazı üretici yöntemleri yalnızca `constructor` fonksiyonu içinde çağrılabilir. Bu özel yöntemler, önemli durum kontrollerini ayarlamak gibi şeyler yapabilir ve yapılandırıcının dışındaki işlevleri çalışmayabilir.

Üretici yapıcısını geçersiz kılmak için, şöyle bir yapıcı yöntemi ekleyin:

```js
module.exports = class extends Generator {
  // `constructor` adı burada önemlidir
  constructor(args, opts) {
    // Üreticimizin doğru bir şekilde ayarlandığından emin olmak için süper yapıcıyı çağırmak önemlidir
    super(args, opts);

    // Sonra, özel kodunuzu ekleyin
    this.option('babel'); // Bu yöntem `--babel` bayrağı desteği ekler
  }
};
```

### Kendi İşlevselliğinizi Eklemek

Prototipe eklenen her yöntem, üretici çağrıldığında bir kez çalıştırılır ve genellikle sırayla gelir. Ancak, bir sonraki bölümde göreceğimiz gibi, bazı özel yöntem adları belirli bir çalışma sırasını tetikler.

Şimdi bazı yöntemler ekleyelim:

```js
module.exports = class extends Generator {
  method1() {
    this.log('method 1 just ran');
  }

  method2() {
    this.log('method 2 just ran');
  }
};
```

Daha sonra üreticiyi çalıştırdığımızda, bu satırların konsola kaydedildiğini göreceksiniz.

---

## Üreticiyi Çalıştırma

Bu noktada, çalışan bir üreticiniz var. Bir sonraki mantıklı adım, çalıştırmak ve çalışıp çalışmadığını görmektir.

**Üreticiyi yerel olarak geliştirdiğiniz için**, henüz genel bir npm modülü olarak mevcut değildir. Genel bir modül oluşturulabilir ve yerel bir modüle bağlanabilir, npm kullanarak. Yapmanız gerekenler:

Komut satırında, üretici projenizin kökünden (`generator-name/` klasöründe) şunları yazın:

```
npm link
```

Bu, proje bağımlılıklarınızı yükleyecek ve genel bir modülü yerel dosyanıza bağlayacaktır. npm tamamlandıktan sonra, `yo name` komutunu çağırabileceksiniz ve daha önce tanımlanan `this.log`'ın terminalde görüntülendiğini görmelisiniz. **Tebrikler**, ilk üreticinizi oluşturdunuz!

### Proje Kökünü Bulma

Bir üreticiyi çalıştırırken, Yeoman, çalıştığı klasörün bağlamına dayalı olarak bazı şeyleri anlamaya çalışacaktır.

En önemlisi, Yeoman dizin ağacında bir `.yo-rc.json` dosyası arar. Eğer bulunduysa, bu dosyanın yerini projenin kökü olarak kabul eder. Arkada, Yeoman geçerli dizini `.yo-rc.json` dosyasının konumuna değiştirecek ve istenen üreticiyi orada çalıştıracaktır.

Depolama modülü `.yo-rc.json` dosyasını oluşturur. İlk kez bir üreticiden `this.config.save()` çağrısı yapmak dosyayı oluşturacaktır.

Dolayısıyla, eğer üreticiniz geçerli çalışma dizininizde çalışmıyorsa, dizin ağacında yukarıda bir `.yo-rc.json` dosyanız olmadığından emin olun.

---

## Buradan Nereye Gitmeli?

Bunu okuduktan sonra, yerel bir üretici oluşturup çalıştırabilmeniz gerekir.

Eğer bu, bir üretici yazma girişiminizse, `çalıştırma bağlamı ve çalışma döngüsü` başlıklı bir sonraki bölümü okumak kesinlikle gerekir. Bu bölüm, üreticinizin çalışacağı bağlamı anlamak ve Yeoman ekosistemindeki diğer üreticilerle iyi bir şekilde birleşmesini sağlamak için hayati öneme sahiptir. Belgenin diğer bölümleri, hedeflerinize ulaşmanıza yardımcı olmak için Yeoman çekirdeğinde mevcut olan işlevselliği sunacaktır.