---
description: Bootstrap için CoreUI'de sağdan sola metin desteğini etkinleştirmek için gerekli adımları öğrenin. Anahtar bileşenler ve başlangıç şablonları ile birlikte RTL yaklaşımlarını keşfedin.
keywords: [CoreUI, Bootstrap, sağdan sola, RTL, stil, önizleme, özelleştirme]
---

## Aşina olun

Öncelikle CoreUI for Bootstrap hakkında bilgi edinmenizi öneririz. `Başlangıç Kılavuzu sayfamızı` okuyarak başlayabilirsiniz. Bunun ardından, RTL'yi nasıl etkinleştireceğinizi öğrenmek için buradan devam edin.

:::info
Ayrıca, RTL yaklaşımımızı destekleyen [RTLCSS projesi](https://rtlcss.com/) hakkında da bilgi edinmek isteyebilirsiniz.
:::

## Gerekli HTML

Bootstrap tabanlı sayfalarda RTL'yi etkinleştirmek için iki katı gereksinim bulunmaktadır.

1. `` öğesine `dir="rtl"` ayarını yapın.
2. `` öğesine `lang` niteliğini, örneğin `lang="ar"` olacak şekilde ekleyin.

Bundan sonra, CSS'imizin RTL sürümünü de dahil etmelisiniz. Örneğin, RTL etkinleştirilmiş derlenmiş ve sıkıştırılmış CSS'imiz için still dosyası şu şekildedir:

```html
<link rel="stylesheet" href="{{< param "cdn.css_rtl" >}}" integrity="{{< param "cdn.css_rtl_hash" >}}" crossorigin="anonymous">
```

### Başlangıç şablonu

Yukarıdaki gereksinimlerin, bu değiştirilmiş RTL başlangıç şablonunda nasıl göründüğünü görebilirsiniz.

```html
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <!-- Gerekli meta etiketleri -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CoreUI for Bootstrap CSS -->
    <link rel="stylesheet" href="{{< param "cdn.css_rtl" >}}" integrity="{{< param "cdn.css_rtl_hash" >}}" crossorigin="anonymous">

    <title>مرحبا بالعالم!</title>
  </head>
  <body>
    <h1>مرحبا بالعالم!</h1>

    <!-- Opsiyonel JavaScript; ikisinden birini seçin! -->

    <!-- Seçenek 1: Popper ile CoreUI for Bootstrap Bundle -->
    <script src="{{< param "cdn.js_bundle" >}}" integrity="{{< param "cdn.js_bundle_hash" >}}" crossorigin="anonymous"></script>

    <!-- Seçenek 2: Ayrı Popper ve CoreUI for Bootstrap JS -->
    <!--
    <script src="{{< param "cdn.popper" >}}" integrity="{{< param "cdn.popper_hash" >}}" crossorigin="anonymous"></script>
    <script src="{{< param "cdn.js" >}}" integrity="{{< param "cdn.js_hash" >}}" crossorigin="anonymous"></script>
    -->
  </body>
</html>
```

## Yaklaşım

CoreUI'ye RTL desteği ekleme yaklaşımımız, CSS'mizi yazma ve kullanma şeklimizi etkileyen iki önemli karar ile birlikte geliyor:

1. **İlk olarak, CoreUI 3'te kendimize ait mixin'lerle tasarlama kararı aldık.** Bu, bize tam kontrol sağlar ve LTR ve RTL'yi ayrı ayrı oluşturma veya gerektiğinde her iki sürümün de olduğu bir stil dosyası oluşturma imkanı tanır; böylelikle stil tekrarları olmaktan kaçınırız.

2. **İkinci olarak, CoreUI 3'te birkaç yönsel sınıf tanıttık, örneğin `mfs-auto`, ancak CoreUI 4'te bunları basitleştirdik, örneğin `ms-auto` haline getirerek, tüm yönsel sınıfları mantıksal özellikler yaklaşımını benimseyecek şekilde yeniden adlandırdık.** Çoğunuz mantıksal özelliklerle etkileşimde bulunmuşsunuzdur; bu, yön özellikleri olan `left` ve `right` yerine `start` ve `end` kullanır. Bu, sınıf adlarını ve değerlerini LTR ve RTL için uygun hale getirir.

  Örneğin, `margin-left` için `.ml-3` yerine `.ms-3` kullanın.

:::tip
RTL ile çalışmak, kaynak Sass veya derlenmiş CSS üzerinden, varsayılan LTR'den çok farklı olmamalıdır.
:::

## Kaynaktan Özelleştirme

`özelleştirme` söz konusu olduğunda, tercih edilen yol değişkenler, haritalar ve mixin'leri kullanmaktır.


  Alternatif font yedekleri
  
  Özel bir font kullanıyorsanız, tüm fontların Latin dışı alfabeyi desteklemediğini unutmayın. Pan-Avrupa fontlardan Arap ailesine geçmek için, font yedeklerinizde font ailelerinin isimlerini değiştirmek için `/*rtl:insert: {value}*/` kullanmanız gerekebilir.

  Örneğin, LTR için `Helvetica Neue Webfont`'dan RTL için `Helvetica Neue Arabic`'e geçmek için, Sass kodunuz şu şekilde görünmelidir:
  
  ```scss
  $font-family-sans-serif:
    Helvetica Neue #{"/* rtl:insert:Arabic */"},
    // Tüm platformlar için genel font ailesi (default kullanıcı arayüzü fontu)
    system-ui,
    // macOS ve iOS için Safari (San Francisco)
    -apple-system,
    // macOS için Chrome < 56 (San Francisco)
    BlinkMacSystemFont,
    // Windows
    "Segoe UI",
    // Android
    Roboto,
    // Temel web yedekleme
    Arial,
    // Linux
    "Noto Sans",
    // Sans serif yedek
    sans-serif,
    // Emoji fontları
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !default;
  ```


### Aynı anda LTR ve RTL

Sayfada hem LTR hem de RTL kullanmanız mı gerekiyor? Tek yapmanız gereken aşağıdaki değişkenleri ayarlamaktır:

```scss
$enable-ltr: true;
$enable-rtl: true;
```

Sass'ı çalıştırdıktan sonra, CSS dosyalarınızdaki her seçici `html:not([dir=rtl])` ve RTL dosyaları için `*[dir=rtl]` ile önceliklendirilecektir. Artık her iki dosyayı da aynı sayfada kullanabilirsiniz.

### Sadece RTL

Varsayılan olarak LTR etkin ve RTL devre dışıdır, ancak bunu kolayca değiştirebilir ve yalnızca RTL kullanabilirsiniz.

```scss
$enable-ltr: false;
$enable-rtl: true;
```

## Ek kaynaklar

- [RTL Stil 101](https://rtlstyling.com/posts/rtl-styling)