---
layout: docs
title: Renk modları
description: CoreUI, v5.0.0 itibarıyla renk modlarını veya temaları desteklemektedir. Varsayılan açık renk modumuzu ve yeni karanlık modumuzu keşfedin veya stillerimizi şablon olarak kullanarak kendi modunuzu oluşturun.
keywords: [Renk modları, Karanlık mod, CoreUI, Bootstrap, Tema özelleştirme, CSS değişkenleri, Sass]
group: customize
toc: true
added: "5.0"
---


**Kendin deneyin!** CoreUI için Bootstrap ile Stylelint kullanarak kaynak kodunu ve çalışan demoyu indirin ve [twbs/examples deposundan](https://github.com/twbs/examples/tree/main/color-modes) renk modlarını keşfedin. Ayrıca [örneği StackBlitz'te açabilirsiniz](https://stackblitz.com/github/twbs/examples/tree/main/color-modes?file=index.html).
## Karanlık mod

**CoreUI için Bootstrap şimdi karanlık modla birlikte renk modlarını destekliyor!** v5.0.0 ile kendi renk modunuz geçiş düğmesini uygulayabilirsiniz (aşağıda CoreUI için Bootstrap belgelerinden bir örneği inceleyin) ve farklı renk modlarını istediğiniz gibi uygulayabilirsiniz. Varsayılan olarak açık bir mod ve şimdi karanlık mod desteklenmektedir. Renk modları, `data-coreui-theme` niteliği sayesinde `` öğesi üzerinde veya belirli bileşenler ve öğeler üzerinde global olarak geçiş yapılabilir.

:::warning
Alternatif olarak, renk modları mixinimiz sayesinde bir medya sorgusu uygulamasına da geçiş yapabilirsiniz—daha fazla detay için `kullanım bölümüne bakın`. Ancak dikkatli olun—bu, gösterildiği gibi her bir bileşen bazında temaları değiştirme yeteneğinizi ortadan kaldırır.
:::

## Örnek

Örneğin, bir açılır menünün renk modunu değiştirmek için, üstteki `.dropdown` öğesine `data-coreui-theme="light"` veya `data-coreui-theme="dark"` ekleyin. Artık global renk moduna bakılmaksızın, bu açılır menüler belirtilen tema değeri ile görüntülenecektir.

  
    Varsayılan açılır menü
  
  
    Eylem
    Eylem
    Başka bir eylem
    Burada başka bir şey
    
    Ayrılmış bağlantı
  



  
    Karanlık açılır menü
  
  
    Eylem
    Eylem
    Başka bir eylem
    Burada başka bir şey
    
    Ayrılmış bağlantı
  

## Nasıl çalışır

- Yukarıda gösterildiği gibi, renk modu stilleri `data-coreui-theme` niteliği ile kontrol edilir. Bu nitelik, `` öğesine veya CoreUI için Bootstrap bileşenlerinden herhangi birine uygulanabilir. `` öğesine uygulanırsa, her şeye uygulanır. Bir bileşene veya öğeye uygulanırsa, yalnızca o spesifik bileşen veya öğe için geçerli olur.

- Desteklemek istediğiniz her renk modu için, paylaşılan global CSS değişkenleri için yeni geçersiz kılmalar eklemeniz gerekecek. Bunu zaten karanlık mod için `_root.scss` stil dosyamızda yapıyoruz; açık mod ise varsayılan değerlerdir. Renk moduna özgü stiller yazarken, mixin'i kullanın:

  ```scss
  // Renk modu değişkenleri _root.scss içinde
  @include color-mode(dark) {
    // CSS değişken geçersiz kılmaları burada...
  }
  ```

- Karanlık mod için bu paylaşılan global CSS değişken geçersiz kılmalarını sağlamak üzere özel bir `_variables-dark.scss` kullanıyoruz. Bu dosya, kendi özel renk modlarınız için gerekli değildir, ancak karanlık modumuz için iki nedenden dolayı gereklidir. İlk olarak, global renkleri sıfırlamak için tek bir yer olması daha iyidir. İkincisi, bazı Sass değişkenlerinin, CSS'imizde yer alan akordeonlar, form bileşenleri ve daha fazlasındaki gömülü arka plan resimleri için geçersiz kılınması gerekti.

## Kullanım

### Karanlık modu etkinleştirme

Projenizin tamamında yerleşik karanlık renk modunu etkinleştirmek için `` öğesine `data-coreui-theme="dark"` niteliğini ekleyin. Bu, belirli bir `data-coreui-theme` niteliği uygulanmayan tüm bileşenler ve öğeler için karanlık renk modunu uygulayacaktır. `Hızlı başlangıç şablonu` üzerinde inşa ederek:

```html
<!doctype html>
<html lang="en" data-coreui-theme="dark">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CoreUI için Bootstrap demo</title>
    <link href="{{< param "cdn.css" >}}" rel="stylesheet" integrity="{{< param "cdn.css_hash" >}}" crossorigin="anonymous">
  </head>
  <body>
    <h1>Merhaba, dünya!</h1>
    <script src="{{< param "cdn.js_bundle" >}}" integrity="{{< param "cdn.js_bundle_hash" >}}" crossorigin="anonymous"></script>
  </body>
</html>
```

CoreUI için Bootstrap, henüz yerleşik bir renk modu seçici ile birlikte gönderilmiyor, ancak isterseniz kendi belgelerimizden birini kullanabilirsiniz. `JavaScript bölümünde daha fazlasını öğrenin.`

### Sass ile inşa etme

Yeni karanlık modu seçeneğimiz, CoreUI için Bootstrap'ın tüm kullanıcıları tarafından kullanılabilir, ancak veri nitelikleri aracılığıyla kontrol edilir ve proje renk modunuzu otomatik olarak geçiş yapmaz. Sass aracılığıyla `$enable-dark-mode` değerini `false` yaparak karanlık modumuzu tamamen devre dışı bırakabilirsiniz.

Renk modlarının nasıl uygulandığını kontrol etmenize yardımcı olmak için özel bir Sass mixin'i `color-mode()` kullanıyoruz. Varsayılan olarak, bir `data` niteliği yaklaşımını kullanıyoruz; bu, ziyaretçilerinizin otomatik bir karanlık mod seçmesi veya tercihlerini kontrol etmesi için daha kullanıcı dostu deneyimler oluşturmanıza olanak tanır (buradaki belgelerimizde olduğu gibi). Bu ayrıca, açık ve karanlığın ötesinde farklı temalar ve daha fazla özel renk modları eklemek için de kolay ve ölçeklenebilir bir yoldur.

Eğer medya sorgularını kullanmak ve yalnızca renk modlarını otomatik yapmak istiyorsanız, mixin'in varsayılan türünü Sass değişkeni aracılığıyla değiştirebilirsiniz. Aşağıdaki kod parçacığı ve derlenmiş CSS çıktısına göz atın.

```scss
$color-mode-type: data;

@include color-mode(dark) {
  .element {
    color: var(--cui-primary-text-emphasis);
    background-color: var(--cui-primary-bg-subtle);
  }
}
```

Şunları üretir:

```css
[data-coreui-theme=dark] .element {
  color: var(--cui-primary-text-emphasis);
  background-color: var(--cui-primary-bg-subtle);
}
```

Ve `media-query` olarak ayarlandığında:

```scss
$color-mode-type: media-query;

@include color-mode(dark) {
  .element {
    color: var(--cui-primary-text-emphasis);
    background-color: var(--cui-primary-bg-subtle);
  }
}
```

Şunları üretir:

```css
@media (prefers-color-scheme: dark) {
  .element {
    color: var(--cui-primary-text-emphasis);
    background-color: var(--cui-primary-bg-subtle);
  }
}
```

## Özel renk modları

Renk modlarının ana kullanım durumu açık ve karanlık mod olsa da, özel renk modları da mümkündür. Kendi `data-coreui-theme` seçicinizle özel bir değer belirleyerek renk modunuzu oluşturun, ardından Sass ve CSS değişkenlerinizi gerektiği gibi değiştirin. CoreUI için Bootstrap'ın karanlık moduna özgü Sass değişkenlerini barındırmak için ayrı bir `_variables-dark.scss` stil dosyası oluşturmaya karar verdik, ancak bu sizin için gerekli değildir.

Örneğin, `data-coreui-theme="blue"` seçicisi ile bir "mavi tema" oluşturabilirsiniz. Özel Sass veya CSS dosyanızda, yeni seçiciyi ekleyin ve gerektiğinde herhangi bir global veya bileşen CSS değişkenini geçersiz kılın. Sass kullanıyorsanız, CSS değişken geçersiz kılmalarınız içinde Sass fonksiyonlarını da kullanabilirsiniz.


  Örnek mavi tema
  Mavi temanın yazılı bir metinle nasıl görünebileceğini göstermek için bazı paragraf metinleri.

  

  
    
      Açılır menü düğmesi
    
    
      Eylem
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  


```html
<div data-coreui-theme="blue">
  ...
</div>
```

## JavaScript

Ziyaretçilerin veya kullanıcıların renk modlarını değiştirebilmeleri için `data-coreui-theme` niteliğini kök öğesi `` üzerinde kontrol etmek için bir geçiş düğmesi oluşturmanız gerekecek. Hedef kitlenizin mevcut sistem renk moduna başvuruda bulunan, ancak o tercihleri geçersiz kılma seçeneği sunan bir değiştirici yapısını belgelerimizde geliştirdik.

İşte bunu güçlendiren JavaScript'e bir bakış. Bunun nasıl uygulandığını görmek için kendi belge navigasyon çubuğumuzu incelemekten çekinmeyin. JavaScript'i sayfanızın üst kısmında dahil etmeniz önerilir; bu, sitenizin yeniden yüklenmesi sırasında potansiyel ekran yanıp sönmesini azaltır. Renk modlarınız için medya sorgularını kullanımını tercih ederseniz, JavaScript'iniz değiştirilmesi veya kaldırılması gerekebilir.



{{- readFile (path.Join "docs/static/assets/js/color-modes.js") -}}

## Tema renkleri ekleme

Yeni bir rengi `$theme-colors`'a eklemek, `uyarılar` ve `liste grupları` gibi bazı bileşenlerimiz için yeterli değildir. Yeni renkler ayrıca $theme-colors-text, $theme-colors-bg-subtle ve $theme-colors-border-subtle için açık tema; ancak karanlık tema için de $theme-colors-text-dark, $theme-colors-bg-subtle-dark ve $theme-colors-border-subtle-dark olarak tanımlanmalıdır.

:::note
Bu manuel bir süreçtir çünkü Sass, var olan bir değişken veya haritadan kendi Sass değişkenlerini üretemez. Gelecek Bootstrap sürümlerinde, bu ayarı tekrar gözden geçirerek tekrarları azaltmayı planlıyoruz.
:::

```scss
// Gerekli
@import "functions";
@import "variables";
@import "variables-dark";

// $theme-colors'a özel bir renk ekleyin
$custom-colors: (
  "custom-color": #712cf9
);
$theme-colors: map-merge($theme-colors, $custom-colors);

@import "maps";
@import "mixins";
@import "utilities";

// Yeni tema haritalarına özel bir renk ekleyin

// Açık mod
$custom-colors-text: ("custom-color": #712cf9);
$custom-colors-bg-subtle: ("custom-color": #e1d2fe);
$custom-colors-border-subtle: ("custom-color": #bfa1fc);

$theme-colors-text: map-merge($theme-colors-text, $custom-colors-text);
$theme-colors-bg-subtle: map-merge($theme-colors-bg-subtle, $custom-colors-bg-subtle);
$theme-colors-border-subtle: map-merge($theme-colors-border-subtle, $custom-colors-border-subtle);

// Karanlık mod
$custom-colors-text-dark: ("custom-color": #e1d2f2);
$custom-colors-bg-subtle-dark: ("custom-color": #8951fa);
$custom-colors-border-subtle-dark: ("custom-color": #e1d2f2);

$theme-colors-text-dark: map-merge($theme-colors-text-dark, $custom-colors-text-dark);
$theme-colors-bg-subtle-dark: map-merge($theme-colors-bg-subtle-dark, $custom-colors-bg-subtle-dark);
$theme-colors-border-subtle-dark: map-merge($theme-colors-border-subtle-dark, $custom-colors-border-subtle-dark);

// Kalan Bootstrap ithalatları
@import "root";
@import "reboot";
// vb.
```

## Özelleştirme

### CSS değişkenleri

Karanlık mod için değişkenleri kalıplak bu kalıntılar, renk modu seçicisine özel olarak tekrar tekrar gösterilmektedir, bu ise varsayılan olarak `data-coreui-theme` ile birlikte kullanılır ancak `ayarlanabilir` bir `prefers-color-scheme` medya sorgusu kullanmak için de yapabilirsiniz. Bu değişkenleri, kendi yeni renk modlarınızı oluştururken bir kılavuz olarak kullanabilirsiniz.

### Sass değişkenleri

Karanlık mod için CSS değişkenleri, `_variables-dark.scss`'daki karanlık mod özel Sass değişkenlerinden kısmı olarak üretilmektedir. Bu, ayrıca bileşenlerimizde kullanılan yerleşik SVG'lerin renklerini değiştirmek için bazı özel geçersiz kılmaları da içerir.

### Sass mixin'leri

Karanlık mod ve oluşturduğunuz özel renk modları için stiller, `data-coreui-theme` niteliği seçicisine veya medya sorgusuna uygun şekilde ölçeklendirilebilir ve özelleştirilebilir `color-mode()` mixin'i ile birlikte kullanılabilir. Daha fazla detay için `Sass kullanım bölümüne` bakın.

