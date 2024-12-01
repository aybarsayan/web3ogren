---
description: Yeoman ile dosya sistemi kullanımı için rehber. Konum bağlamları, dosya yazma ve şablon işlemleri hakkında bilgi içerir.
keywords: [Yeoman, dosya sistemi, şablon, hedef bağlamı, bellek içi dosya sistemi, dosya yardımcı programları, kod güncelleme]
---

# Konum bağlamları ve yollar

Yeoman dosya yardımcı programları, diskte her zaman iki konum bağlamına sahip olma fikrine dayanır. Bu bağlamlar, oluşturucunuzun büyük olasılıkla okuyacağı ve yazacağı klasörlerdir.

### Hedef bağlamı

İlk bağlam _hedef bağlamı_ dır. Hedef, Yeoman’nın yeni bir uygulama oluşturacağı klasördür. Bu sizin kullanıcı projeniz klasörünüzdür, çoğunlukla iskeleti burada yazacaksınız.

:::info
Hedef bağlamı, ya mevcut çalışma dizini olarak ya da bir `.yo-rc.json` dosyasını içeren en yakın üst klasör olarak tanımlanır.
:::

Hedef bağlamı, `.yo-rc.json` dosyasını kullanarak bir Yeoman projesinin kökünü tanımlar. Bu dosya, kullanıcınızın alt dizinlerde komutlar çalıştırmasını ve bunların projeyle çalışmasını sağlar. Bu, son kullanıcı için tutarlı bir davranış sağlar.

**Hedef yolu**'nu `this.destinationRoot()` kullanarak veya bir yolu birleştirerek `this.destinationPath('sub/path')` ile alabilirsiniz.

```js
// Varsayılan hedef kökü ~/projects
class extends Generator {
  paths() {
    this.destinationRoot();
    // '~/projects' döner

    this.destinationPath('index.js');
    // '~/projects/index.js' döner
  }
}
```

Ve bunu `this.destinationRoot('new/path')` kullanarak manuel olarak ayarlayabilirsiniz. Ancak tutarlılık açısından, varsayılan hedefi değiştirmemeniz muhtemelen daha iyidir.

Kullanıcının `yo`'yu nereden çalıştırdığını bilmek istiyorsanız, `this.contextRoot` ile yolu alabilirsiniz. Bu, `yo`'nun çağrıldığı ham yoldur; proje kökünü belirlemeden önce `.yo-rc.json` ile.

### Şablon bağlamı

Şablon bağlamı, şablon dosyalarınızı sakladığınız klasördür. Genellikle okuyup kopyalayacağınız klasördür.

Şablon bağlamı varsayılan olarak `./templates/` olarak tanımlanır. Bu varsayılanı `this.sourceRoot('new/template/path')` kullanarak geçersiz kılabilirsiniz.

Yol değerini `this.sourceRoot()` ile ya da bir yolu birleştirerek `this.templatePath('app/index.js')` ile alabilirsiniz.

```js
class extends Generator {
  paths() {
    this.sourceRoot();
    // './templates' döner

    this.templatePath('index.js');
    // './templates/index.js' döner
  }
};
```

## "Bellek içi" dosya sistemi

Yeoman, kullanıcı dosyalarını üzerine yazma konusunda çok dikkatlidir. Temelde, mevcut bir dosyada gerçekleşen her yazma, bir çelişki çözümleme sürecinden geçer. Bu süreç, kullanıcının içeriği üzerine yazan her dosya yazımını doğrulamasını gerektirir.

:::warning
Bu davranış, kötü sürprizleri önler ve hata riskini azaltır. Öte yandan, bu her dosyanın disk'e asenkron olarak yazılacağı anlamına gelir.
:::

Asenkron API'ler kullanması daha zor olduğundan, Yeoman, her dosyanın [bellek içi dosya sistemi](https://github.com/sboudrias/mem-fs) içine yazıldığı ve Yeoman çalışmayı tamamlarken disk'e yalnızca bir kez yazıldığı senkron bir dosya sistemi API'si sunar.

Bu bellek dosya sistemi, tüm `kompozit oluşturucular` arasında paylaşılmaktadır.

## Dosya yardımcı programları

Oluşturucular, `this.fs` üzerinde tüm dosya yöntemlerini dışa aktarır; bu, [mem-fs editörü](https://github.com/sboudrias/mem-fs-editor) örneğidir - mevcut yöntemler için [modül belgelerini](https://github.com/sboudrias/mem-fs-editor) kontrol etmeyi unutmayın.

:::note
`this.fs` 'nin `commit`'i dışa aktardığını belirtmek önemlidir; ancak bunu oluşturucunuzda çağırmamalısınız. Yeoman, çalışma döngüsünün çelişki aşamasından sonra bunu dahili olarak çağırır.
:::

### Örnek: Bir şablon dosyasını kopyalama

İşte bir şablon dosyasını kopyalamak ve işlemek istediğimiz bir örnek.

`./templates/index.html` dosyasının içeriği:

```html
<html>
  <head>
    <title><%= title %></title>
  </head>
</html>
```

Dosyayı kopyalarken içeriği şablon olarak işlemek için [`copyTpl`](https://github.com/sboudrias/mem-fs-editor#copytplfrom-to-context-templateoptions--copyoptions) yöntemini kullanacağız. `copyTpl`, [ejs şablon sözdizimini](http://ejs.co) kullanmaktadır.

```js
class extends Generator {
  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: 'Yeoman ile Şablonlama' }
    );
  }
}
```

Oluşturucu çalışmayı tamamladığında, `public/index.html` şu içeriğe sahip olacaktır:

```html
<html>
  <head>
    <title>Yeoman ile Şablonlama</title>
  </head>
</html>
```

Çok yaygın bir senaryo, kullanıcı yanıtlarını `sorma aşamasında` saklamak ve bunları şablonlama için kullanmaktır:

```js
class extends Generator {
  async prompting() {
    this.answers = await this.prompt([{
      type    : 'input',
      name    : 'title',
      message : 'Projenizin başlığı',
    }]);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: this.answers.title } // kullanıcı yanıtı `title` kullanıldı
    );
  }
}
```

## Çıktı dosyalarını akışlar aracılığıyla dönüştürme

Oluşturucu sistemi, her dosya yazımında özel filtreler uygulamanıza izin verir. Dosyaları otomatik olarak güzelleştirmek, boşlukları normalize etmek vb. mümkündür.

Her Yeoman işlemi başına, her değiştirilmiş dosya diske yazılacaktır. Bu işlem, bir [vinyl](https://github.com/wearefractal/vinyl) nesne akışından (tıpkı [gulp](http://gulpjs.com/) gibi) geçirilir. Herhangi bir oluşturucu yazarı, dosya yolunu ve/veya içeriğini değiştirmek için bir `transformStream` kaydedebilir.

Yeni bir değiştirici kaydetmek, `registerTransformStream()` yöntemi aracılığıyla yapılır. İşte bir örnek:

```js
var beautify = require("gulp-beautify");
this.registerTransformStream(beautify({ indent_size: 2 }));
```

**Her dosyanın herhangi bir türü bu akıştan geçirilir**. Herhangi bir dönüştürme akışının desteklemediği dosyaları geçmesi önemlidir. [gulp-if](https://github.com/robrich/gulp-if) veya [gulp-filter](https://github.com/sindresorhus/gulp-filter) gibi araçlar, geçersiz türleri filtrelemeye ve geçirmeye yardımcı olacaktır.

Temel olarak, yazma aşamasında oluşturulan dosyaları işlemek için Yeoman dönüştürme akışıyla herhangi bir _gulp_ eklentisini kullanabilirsiniz.

## İpucu: Var olan dosyanın içeriğini güncelleyin

Mevcut bir dosyayı güncellemek her zaman basit bir görev değildir. Bunu yapmanın en güvenilir yolu dosya AST'sini ([soyut sözdizim ağacı](http://en.wikipedia.org/wiki/Abstract_syntax_tree)) analiz etmek ve düzenlemektir. Bu çözümün ana sorunu, bir AST'yi düzenlemenin ayrıntılı ve biraz zor anlaşılır olabilmesidir.

Bazı popüler AST ayrıştırıcıları şunlardır:

- HTML ayrıştırmak için [Cheerio](https://github.com/cheeriojs/cheerio).
- JavaScript ayrıştırmak için [Esprima](https://github.com/ariya/esprima) - Esprima sözdizim ağacını düzenlemek için bir alt düzey API sağlayan [AST-Query](https://github.com/SBoudrias/ast-query) ile ilgilenebilirsiniz.
- JSON dosyaları için yerel [`JSON` nesne yöntemlerini](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) kullanabilirsiniz.
- Dinamik olarak bir Gruntfile'ı değiştirmek için [Gruntfile Editor](https://github.com/SBoudrias/gruntfile-editor).

:::danger
Bir kod dosyasını RegEx ile ayrıştırmak tehlikeli bir yoldur; bunu yapmadan önce [bu CS antropolojik yanıtları](http://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags#answer-1732454) okumalısınız ve RegEx ayrıştırmasının kusurlarını anlamalısınız. Eğer mevcut dosyaları RegEx ile değil de AST ağacı ile düzenlemeyi tercih ederseniz, lütfen dikkatli olun ve kapsamlı birim testleri sağlayın. - Lütfen, kullanıcılarınızın kodunu bozmayın.
:::