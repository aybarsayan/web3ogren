---
description: Değişkenler, haritalar, mixin'ler ve fonksiyonlardan yararlanarak projelerinizi daha hızlı inşa edin ve özelleştirin. Bu doküman, CoreUI for Bootstrap ile Sass dosyalarınızı nasıl yapılandıracağınızı ve kullanacağınızı anlatmaktadır.
keywords: [Sass, CoreUI, Bootstrap, değişkenler, haritalar, mixin'ler, stil yönetimi]
---

Kaynak Sass dosyalarımızdan yararlanarak değişkenler, haritalar, mixin'ler ve daha fazlasıyla çalışın.

## Dosya yapısı

Mümkün olduğunca, CoreUI for Bootstrap'ın temel dosyalarını değiştirmekten kaçının. Sass için bu, CoreUI for Bootstrap'ı içeren kendi stil sayfanızı oluşturmanız anlamına gelir, böylece onu değiştirebilir ve genişletebilirsiniz. npm gibi bir paket yöneticisi kullanıyorsanız, dosya yapınız aşağıdaki gibi görünür:

```text
your-project/
├── scss
│   └── custom.scss
└── node_modules/
    └── @coreui/coreui
        ├── js
        └── scss
```

:::info
Kaynak dosyalarımızı indirdiyseniz ve bir paket yöneticisi kullanmıyorsanız, benzer bir yapı oluşturmak için manuel olarak işlem yapmalısınız ve CoreUI'nin kaynak dosyalarını kendi dosyalarınızdan ayrı tutmalısınız.
:::

```text
your-project/
├── scss
│   └── custom.scss
└── @coreui/coreui/
    ├── js
    └── scss
```

## İçe Aktarma

`custom.scss` dosyanızda CoreUI'nin kaynak Sass dosyalarını içe aktaracaksınız. İki seçeneğiniz var: CoreUI'nin tamamını dahil etmek veya ihtiyacınız olan kısımları seçmek. 

> **Tavsiyemiz:** İkinci seçeneği tavsiye ediyoruz, ancak bileşenlerimiz arasında bazı gereklilikler ve bağımlılıklar olduğunu unutmayın. Eklentilerimiz için bazı JavaScript dosyalarını da eklemeniz gerekecek.

```scss
// Custom.scss
// Seçenek A: CoreUI'nin tamamını dahil et

@import "../node_modules/@coreui/coreui/scss/coreui";

// Ardından burada ek özel kod ekleyin
```

```scss
// Custom.scss
// Seçenek B: CoreUI'nin bazı kısımlarını dahil et

// 1. Önce fonksiyonları dahil et (böylece renkleri, SVG'leri, hesaplamaları vb. manipüle edebilirsin)
@import "../node_modules/@coreui/coreui/scss/functions";

// 2. Varsayılan değişken geçersiz kılmalarını burada dahil et

// 3. Gerekli CoreUI stil sayfalarının geri kalanını dahil et
@import "../node_modules/@coreui/coreui/scss/variables";

// 4. Varsayılan harita geçersiz kılmalarını burada dahil et

// 5. Gerekli diğer kısımları dahil et
@import "../node_modules/@coreui/coreui/scss/maps";
@import "../node_modules/@coreui/coreui/scss/mixins";
@import "../node_modules/@coreui/coreui/scss/root";

// 6. Gerekirse başka kısımları isteğe bağlı olarak dahil et
@import "../node_modules/@coreui/coreui/scss/utilities";
@import "../node_modules/@coreui/coreui/scss/reboot";
@import "../node_modules/@coreui/coreui/scss/type";
@import "../node_modules/@coreui/coreui/scss/images";
@import "../node_modules/@coreui/coreui/scss/containers";
@import "../node_modules/@coreui/coreui/scss/grid";
@import "../node_modules/@coreui/coreui/scss/helpers";

// 7. İsteğe bağlı olarak, _utilities.scss dosyasındaki Sass haritasına dayalı sınıflar oluşturmak için utilities API'yi en son dahil et
@import "../node_modules/@coreui/coreui/scss/utilities/api";

// 8. Ardından burada ek özel kod ekleyin
```

Bu ayarlarla birlikte, `custom.scss` dosyanızda Sass değişkenlerini ve haritalarını değiştirmeye başlayabilirsiniz. Ayrıca, gerektiğinde `// İsteğe Bağlı` bölümüne CoreUI for Bootstrap'ın kısımlarını eklemeye başlayabilirsiniz. Başlangıç noktanız olarak `coreui.scss` dosyasından tam import yığınını kullanmanızı öneririz.

---

## Derleme

Tarayıcıda özel Sass kodunuzu CSS olarak kullanmak için bir Sass derleyicisine ihtiyacınız var. Sass, bir CLI paketi olarak gelir, ancak [Gulp](https://gulpjs.com/) veya [Webpack](https://webpack.js.org/) gibi diğer yapı araçlarıyla veya GUI uygulamalarıyla da derleyebilirsiniz. Bazı IDE'lerde de yerleşik Sass derleyicileri veya indirilebilir uzantılar bulunmaktadır.

:::warning
Sass'ı derlemek için CLI'yi kullanmayı tercih ediyoruz, ancak tercih ettiğiniz herhangi bir yöntemi kullanabilirsiniz.
:::

Komut satırında aşağıdakileri çalıştırın:

```shell
# Sass'ı global olarak kur
npm install -g sass

# Özel Sass'ınızı değişiklikler için izle ve CSS'ye derle
sass --watch ./scss/custom.scss ./css/custom.css
```

---

## Dahil Etme

CSS'niz derlendikten sonra, HTML dosyalarınıza dahil edebilirsiniz. `index.html` dosyanızın içinde, derlenmiş CSS dosyanızı dahil etmek isteyeceksiniz. Eğer derlenmiş CSS dosyanızın yolunu değiştirdiyseniz, güncellemeyi unutmayın.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Özel CoreUI for Bootstrap</title>
    <link href="/css/custom.css" rel="stylesheet">
  </head>
  <body>
    <h1>Merhaba, dünya!</h1>
  </body>
</html>
```

---

## Değişken varsayılanları

CoreUI for Bootstrap içindeki her Sass değişkeni, kendi Sass'ınızda değişkenin varsayılan değerini geçersiz kılmanıza olanak tanıyan `!default` bayrağına sahiptir. Gerekirse değişkenleri kopyalayın ve yapılarının değerlerini değiştirin ve `!default` bayrağını kaldırın. Bir değişken zaten atanmışsa, o zaman varsayılan değerler tarafından yeniden atanmayacaktır.

**CoreUI for Bootstrap'ın değişkenlerinin tam listesini** `scss/_variables.scss` **dosyasında bulacaksınız. Bazı değişkenler** `null` **olarak ayarlanmıştır, bu değişkenler, yapılandırmanızda geçersiz kılınmadıkça özellik çıkışı vermez.**

Değişken geçersiz kılmaları, fonksiyonlarımız içe aktarılmadan sonra ancak geri kalan importlardan önce gelmelidir.

npm üzerinden CoreUI for Bootstrap'ı içe aktarırken ve derlerken `` için `background-color` ve `color` değişikliklerini gösteren bir örnek:

```scss
// Gerekli
@import "../node_modules/@coreui/coreui/scss/functions";

// Varsayılan değişken geçersiz kılmaları
$body-bg: #000;
$body-color: #111;

// Gerekli
@import "../node_modules/@coreui/coreui/scss/variables";
@import "../node_modules/@coreui/coreui/scss/maps";
@import "../node_modules/@coreui/coreui/scss/mixins";
@import "../node_modules/@coreui/coreui/scss/root";

// İsteğe bağlı CoreUI bileşenleri burada
@import "../node_modules/@coreui/coreui/scss/reboot";
@import "../node_modules/@coreui/coreui/scss/type";
// vb.
```

CoreUI için herhangi bir değişken için gerektiği gibi yineleyin, ayrıca aşağıdaki genel seçenekler de dahil.

---

## Haritalar ve döngüler

CoreUI for Bootstrap, ilişkili CSS ailelerini oluşturmayı kolaylaştıran çok sayıda Sass haritası ve anahtar-değer çiftleri içerir. Renklerimizi, ızgara kırılma noktalarımızı ve daha fazlasını yapmak için Sass haritalarını kullanıyoruz. Tıpkı Sass değişkenleri gibi, tüm Sass haritaları `!default` bayrağına da sahiptir ve geçersiz kılınabilir ve genişletilebilir.

Bazı Sass haritalarımız varsayılan olarak boş olanlarla birleştirilmiştir. Bu, belirli bir Sass haritasını kolayca genişletmenize olanak sağlarken, haritadan öğeleri kaldırmayı biraz daha zor hale getirir.

### Haritayı Değiştir

`$theme-colors` haritasındaki tüm değişkenler bağımsız değişkenler olarak tanımlanır. `$theme-colors` haritasındaki mevcut bir rengi değiştirmek için, özel Sass dosyanıza aşağıdakileri ekleyin:

```scss
$primary: #0074d9;
$danger: #ff4136;
```

Sonra bu değişkenler CoreUI for Bootstrap'ın `$theme-colors` haritasında ayarlanır:

```scss
$theme-colors: (
  "primary": $primary,
  "danger": $danger
);
```

### Haritaya Ekleyin

Yeni renkleri `$theme-colors` veya herhangi bir diğer haritaya eklemek için, kendi özel değerlerinizle yeni bir Sass haritası oluşturup bunu orijinal harita ile birleştirin. Bu durumda, yeni bir `$custom-colors` haritası oluşturacağız ve bunu `$theme-colors` ile birleştireceğiz.

```scss
// Kendi haritanızı oluşturun
$custom-colors: (
  "custom-color": #900
);

// Haritaları birleştir
$theme-colors: map-merge($theme-colors, $custom-colors);
```

### Haritadan Çıkar

`$theme-colors` veya herhangi bir haritadan renkleri çıkarmak için `map-remove` kullanın. Bu işlemi gereksinimlerimiz ve seçeneklerimiz arasında eklemeniz gerektiğini unutmayın:

```scss
// Gerekli
@import "../node_modules/@coreui/coreui/scss/functions";
@import "../node_modules/@coreui/coreui/scss/variables";
@import "../node_modules/@coreui/coreui/scss/maps";
@import "../node_modules/@coreui/coreui/scss/mixins";
@import "../node_modules/@coreui/coreui/scss/root";

$theme-colors: map-remove($theme-colors, "info", "light", "dark");

// İsteğe bağlı
@import "../node_modules/@coreui/coreui/scss/reboot";
@import "../node_modules/@coreui/coreui/scss/type";
// vb.
```

---

## Gerekli anahtarlar

CoreUI for Bootstrap, Sass haritalarında belirli anahtarların varlığını varsayar çünkü bunları kendimiz kullanır ve genişletiriz. Dahil edilen haritaları özelleştirirken, bir Sass haritasının anahtarının kullanıldığı durumlarla karşılaşabilirsiniz.

Örneğin, `$theme-colors` haritasından `primary`, `success` ve `danger` anahtarlarını bağlantılar, butonlar ve form durumları için kullanıyoruz. Bu anahtarların değerlerini değiştirmek sorun yaratmamalıdır, ancak onları kaldırmak Sass derleme sorunlarına neden olabilir. Bu durumlarda, o değerleri kullanan Sass kodunu değiştirmeniz gerekecektir.

---

## Fonksiyonlar

### Renkler

`Sass haritaları` yanında, tema renkleri ayrıca `$primary` gibi bağımsız değişkenler olarak da kullanılabilir. 

```scss
.custom-element {
  color: $gray-100;
  background-color: $dark;
}
```

CoreUI for Bootstrap'ın `tint-color()` ve `shade-color()` fonksiyonları ile renkleri açabilir veya koyulaştırabilirsiniz. Bu fonksiyonlar, renkleri siyah veya beyaz ile karıştırır, oysa Sass'ın yerel `lighten()` ve `darken()` fonksiyonları, sabit bir miktarla aydınlığı değiştirir ki bu genellikle istenen etkiye yol açmaz.

Uygulamada, fonksiyonu çağırır ve renk ile ağırlık parametrelerini geçirirsiniz.

```scss
.custom-element {
  color: tint-color($primary, 10%);
}

.custom-element-2 {
  color: shade-color($danger, 30%);
}

.custom-element-3 {
  color: shift-color($success, 40%);
  background-color: shift-color($success, -60%);
}
```

### Renk kontrastı

[Web İçeriği Erişilebilirlik Yönergeleri (WCAG)](https://www.w3.org/TR/WCAG/) koşuluyla sağlanması gereken standartlara uymak için yazarlar **minimum 4.5:1** [metin rengi kontrastı](https://www.w3.org/TR/WCAG/#contrast-minimum) ve minimum 3:1 [metin dışı renk kontrastı](https://www.w3.org/TR/WCAG/#non-text-contrast), çok az istisna ile sağlamalıdır.

CoreUI for Bootstrap'ta eklediğimiz bir diğer fonksiyon da renk kontrast fonksiyonu, `color-contrast`. Bu, sağlanan temel renge bağlı olarak otomatik olarak açık (`#fff`), koyu (`#212529`) veya siyah (`#000`) kontrast rengi döndürmek için [WCAG 2.0 algoritması](https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests) kullanır. Bu, birden çok sınıf oluşturduğunuzda, mixin'ler veya döngüler için özellikle kullanışlıdır.

Örneğin, `$theme-colors` haritasından renk örnekleri üretmek için:

```scss
@each $color, $value in $theme-colors {
  .swatch-#{$color} {
    color: color-contrast($value);
  }
}
```

Ayrıca, tek seferlik kontrast ihtiyaçları için de kullanılabilir:

```scss
.custom-element {
  color: color-contrast(#000); // `color: #fff` döner
}
```

Renk harita fonksiyonlarımız ile bir temel renk belirtebilirsiniz:

```scss
.custom-element {
  color: color-contrast($dark); // `color: #fff` döner
}
```

### SVG'yi Kaçır

`` ve `#` karakterlerini SVG arka plan görüntüleri için kaçırmak için `escape-svg` fonksiyonunu kullanıyoruz. `escape-svg` fonksiyonu kullanıldığında, veri URI'leri tırnak içinde olmalıdır.

### Topla ve Çıkar fonksiyonları

CSS `calc` fonksiyonunu sarmak için `add` ve `subtract` fonksiyonlarını kullanıyoruz. Bu fonksiyonların birincil amacı, "birimsiz" `0` değerinin bir `calc` ifadesine geçirilmesi durumunda hataları önlemektir. `calc(10px - 0)` gibi ifadeler tüm tarayıcılarda matematiksel olarak doğru olmasına rağmen hata döndürecektir.

Geçerli bir hesaplamanın örneği:

```scss
$border-radius: .25rem;
$border-width: 1px;

.element {
  // Çıktı calc(.25rem - 1px) geçerlidir
  border-radius: calc($border-radius - $border-width);
}

.element {
  // Yukarıdaki gibi aynı calc(.25rem - 1px) çıktısını verir
  border-radius: subtract($border-radius, $border-width);
}
```

Geçersiz bir hesaplamanın örneği:

```scss
$border-radius: .25rem;
$border-width: 0;

.element {
  // Çıktı calc(.25rem - 0) geçersizdir
  border-radius: calc($border-radius - $border-width);
}

.element {
  // Çıktı .25rem
  border-radius: subtract($border-radius, $border-width);
}
```

---

## Mixin'ler

`scss/mixins/` dizinimiz, CoreUI for Bootstrap parçalarını güçlendiren ve ayrıca kendi projelerinizde kullanılabilecek birçok mixin içerir.

### Renk şemaları

`prefers-color-scheme` medya sorgusu için kısa bir mixin, `light`, `dark` ve özel renk şemaları desteği ile mevcuttur.

```scss
.custom-element {
  @include color-scheme(light) {
    // Buraya açık mod stilini ekleyin
  }

  @include color-scheme(dark) {
    // Buraya koyu mod stilini ekleyin
  }
}