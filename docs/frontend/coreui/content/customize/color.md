---
layout: docs
title: Renk
description: CoreUI for Bootstrap, stillen olan stillerimiz ve bileşenlerimiz için geniş bir renk sistemi desteği sağlar. Bu, her projede daha kapsamlı özel ayarlamalar ve genişletmeler yapılmasına olanak tanır.
keywords: [CoreUI, Bootstrap, renk, renk paleti, Sass, CSS değişkenleri, tema renkleri]
---

## Renkler

Bootstrap'ın renk paleti, v5.0.0'da genişlemeye ve daha ayrıntılı hale gelmeye devam etti. `secondary` ve `tertiary` metin ve arka plan renkleri için yeni değişkenler ekledik, ayrıca tema renklerimiz için `{color}-bg-subtle`, `{color}-border-subtle`, ve `{color}-text-emphasis` ekledik. Bu yeni renkler, çeşitli ışık ve karanlık gibi çoklu renk modları arasında özelleştirmeyi kolaylaştırmak amacıyla Sass ve CSS değişkenleri üzerinden mevcuttur (ancak renk haritalarımız veya yardımcı sınıflarımız üzerinden değil). Bu yeni değişkenler `:root` üzerinde küresel olarak ayarlanmıştır ve orijinal tema renklerimiz değişmeden kalırken yeni karanlık renk modumuza uyarlanmıştır.

`-rgb` ile biten renkler, `rgb()` ve `rgba()` renk modlarında kullanılmak üzere `kırmızı, yeşil, mavi` değerlerini sağlar. Örneğin, `rgba(var(--cui-secondary-bg-rgb), .5)`.

:::warning
**Dikkat!** Yeni ikincil ve üçüncül renklerimiz ile mevcut ikincil tema rengimiz, ayrıca açık ve koyu tema renklerimizle bazı potansiyel karışıklıklar olabilir. Bunun v6'da netleştirilmesini bekleyin.
:::


  
    
      Açıklama
      Renk Kartelası
      Değişkenler
    
  
  
    
      
        **Gövde —** Varsayılan ön plan (renk) ve arka plan, bileşenler dahil.
      
      
        &nbsp;
      
      
        `--cui-body-color``--cui-body-color-rgb`
      
    
    
      
        &nbsp;
      
      
        `--cui-body-bg``--cui-body-bg-rgb`
      
    
    
      
        **İkincil —** Daha açık metin için `color` seçeneğini kullanın. Ayırıcılar için ve devre dışı bileşen durumlarını göstermek için `bg` seçeneğini kullanın.
      
      
        &nbsp;
      
      
        `--cui-secondary-color``--cui-secondary-color-rgb`
      
    
    
      
        &nbsp;
      
      
        `--cui-secondary-bg``--cui-secondary-bg-rgb`
      
    
    
      
        **Üçüncül —** Daha açık metin için `color` seçeneğini kullanın. Hover durumları, vurgular ve kuyular için arka plan stilleri eklemek için `bg` seçeneğini kullanın.
      
      
        &nbsp;
      
      
        `--cui-tertiary-color``--cui-tertiary-color-rgb`
      
    
    
      
        &nbsp;
      
      
        `--cui-tertiary-bg``--cui-tertiary-bg-rgb`
      
    
    
      
        **Vurgulama —** Daha yüksek kontrastlı metin için. Arka planlar için geçerli değildir.
      
      
        &nbsp;
      
      
        `--cui-emphasis-color``--cui-emphasis-color-rgb`
      
    
    
      
        **Sınır —** Bileşen sınırları, ayırıcılar ve kurallar için. Arka planlarla karıştırmak için `--cui-border-color-translucent` kullanın ve bir `rgba()` değeri kullanın.
      
      
        &nbsp;
      
      
        `--cui-border-color``--cui-border-color-rgb`
      
    
    
      
        **Birincil —** Ana tema rengi, köprüler, odak stilleri ve bileşen ve form aktif durumları için kullanılır.
      
      
        &nbsp;
      
      
        `--cui-primary``--cui-primary-rgb`
      
    
    
      
        &nbsp;
      
      
        `--cui-primary-bg-subtle`
      
    
    
      
        &nbsp;
      
      
        `--cui-primary-border-subtle`
      
    
    
      
        Metin
      
      
        `--cui-primary-text-emphasis`
      
    
    
      
        **Başarı —** Olumlu veya başarılı hareketler ve bilgiler için kullanılan tema rengi.
      
      
        &nbsp;
      
      
        `--cui-success``--cui-success-rgb`
      
    
    
      
        &nbsp;
      
      
        `--cui-success-bg-subtle`
      
    
    
      
        &nbsp;
      
      
        `--cui-success-border-subtle`
      
    
    
      
        Metin
      
      
        `--cui-success-text-emphasis`
      
    
    
      
        **Tehlike —** Hatalar ve tehlikeli hareketler için kullanılan tema rengi.
      
      
        &nbsp;
      
      
        `--cui-danger``--cui-danger-rgb`
      
    
    
      
        &nbsp;
      
      
        `--cui-danger-bg-subtle`
      
    
    
      
        &nbsp;
      
      
        `--cui-danger-border-subtle`
      
    
    
      
        Metin
      
      
        `--cui-danger-text-emphasis`
      
    
    
      
        **Uyarı —** Yıkıcı olmayan uyarı mesajları için kullanılan tema rengi.
      
      
        &nbsp;
      
      
        `--cui-warning``--cui-warning-rgb`
      
    
    
      
        &nbsp;
      
      
        `--cui-warning-bg-subtle`
      
    
    
      
        &nbsp;
      
      
        `--cui-warning-border-subtle`
      
    
    
      
        Metin
      
      
        `--cui-warning-text-emphasis`
      
    
    
      
        **Bilgi —** Nötr ve bilgilendirici içerik için kullanılan tema rengi.
      
      
        &nbsp;
      
      
        `--cui-info``--cui-info-rgb`
      
    
    
      
        &nbsp;
      
      
        `--cui-info-bg-subtle`
      
    
    
      
        &nbsp;
      
      
        `--cui-info-border-subtle`
      
    
    
      
        Metin
      
      
        `--cui-info-text-emphasis`
      
    
    
      
        **Açık —** Daha az kontrastlı renkler için ek tema seçeneği.
      
      
        &nbsp;
      
      
        `--cui-light``--cui-light-rgb`
      
    
    
      
        &nbsp;
      
      
        `--cui-light-bg-subtle`
      
    
    
      
        &nbsp;
      
      
        `--cui-light-border-subtle`
      
    
    
      
        Metin
      
      
        `--cui-light-text-emphasis`
      
    
    
      
        **Koyu —** Daha yüksek kontrastlı renkler için ek tema seçeneği.
      
      
        &nbsp;
      
      
        `--cui-dark``--cui-dark-rgb`
      
    
    
      
        &nbsp;
      
      
        `--cui-dark-bg-subtle`
      
    
    
      
        &nbsp;
      
      
        `--cui-dark-border-subtle`
      
    
    
      
        Metin
      
      
        `--cui-dark-text-emphasis`
      
    
  


### Yeni renkleri kullanma

Bu yeni renkler CSS değişkenleri ve yardımcı sınıflar aracılığıyla erişilebilir—örneğin `--cui-primary-bg-subtle` ve `.bg-primary-subtle`—kendi CSS kurallarınızı bu değişkenlerle oluşturmanıza veya sınıflar aracılığıyla stil uygulamanıza olanak tanır. Yardımcılar, rengin ilişkili CSS değişkenleri ile oluşturulur ve bu değişkenleri karanlık mod için özelleştirdiğimiz için, varsayılan olarak renk moduna uyum sağlarlar.

  Yardımcılar ile örnek öğe

## Tema renkleri

Renk şemaları oluşturmak için daha küçük bir renk paleti oluşturmak için tüm renklerin bir alt kümesini kullanıyoruz, bunlar ayrıca CoreUI for Bootstrap'ın `scss/_variables.scss` dosyasında Sass değişkenleri ve bir Sass haritası olarak mevcuttur.


  
  {{- range (index $.Site.Data "theme-colors") }}
    
      {{ .name | title }}
    
  {{ end -}}
  
Tüm bu renkler, bir Sass haritası olarak mevcuttur, `$theme-colors`.

Bu renkleri nasıl değiştireceğinizi öğrenmek için `Sass haritalarımız ve döngü belgelerimizi` kontrol edin.

## Tüm renkler

CoreUI for Bootstrap renklerinin tamamı, `scss/_variables.scss` dosyasında Sass değişkenleri ve bir Sass haritası olarak mevcuttur. Artan dosya boyutlarını önlemek için, bu değişkenlerin her biri için metin veya arka plan rengi sınıfları oluşturmuyoruz. Bunun yerine, bu renklerin bir alt kümesini `tema paleti` için seçiyoruz.

**Renkleri özelleştirirken kontrast oranlarını izlemeyi unutmayın.** Aşağıda gösterildiği gibi, her ana renk için—birinin kartelanın mevcut renkleri, birinin beyazı ve birinin siyahı dikkate alındığında—üç kontrast oranı ekledik.


  
  {{- range $color := $.Site.Data.colors }}
    {{- if (and (not (eq $color.name "white")) (not (eq $color.name "gray")) (not (eq $color.name "gray-dark"))) }}
    
      
        ${{ $color.name }}
        {{ $color.hex }}
      
      {{ range (seq 100 100 900) }}
      ${{ $color.name }}-{{ . }}
      {{ end }}
    
    {{ end -}}
  {{ end -}}

  
    
      $gray-500
      #9da5b1
    
  {{- range $.Site.Data.grays }}
    $gray-{{ .name }}
  {{ end -}}
  
    
    
      $black
      #000
    
    
      $white
      #fff
    
  


### Sass hakkında notlar

Sass, programatik olarak değişken oluştaramaz, bu yüzden her ton ve gölge için kendi değişkenlerimizi manuel olarak oluşturdum. Orta değerini (örn. `$blue-500`) belirtiriz ve Sass'ın `mix()` renk fonksiyonu aracılığıyla renklerimizi tonlandırmak (açıklaştırmak) veya gölgelendirmek (koyulaştırmak) için özel renk fonksiyonları kullanırız.

`mix()` kullanımı, `lighten()` ve `darken()` ile aynı değildir—ilki belirtilen rengi beyaz veya siyahla karıştırır, ikincisi ise her rengin açıklık değerini sadece ayarlar. Sonuç, [bu CodePen demosunda](https://codepen.io/emdeoh/pen/zYOQOPB) gösterildiği gibi çok daha kapsamlı bir renk yelpazesi olmaktadır.

`mix()` ile birlikte `$theme-color-interval` değişkenimiz üzerinde de karıştırma işlemi yaparak her ürettiğimiz karışık renk için adım adım yüzdelik değeri belirtiyoruz. Tam kaynak kodu için `scss/_functions.scss` ve `scss/_variables.scss` dosyalarına bakın.

## Renk Sass haritaları

CoreUI for Bootstrap'ın kaynak Sass dosyaları, renklerin ve hex değerlerinin listesi üzerinde hızlıca ve kolayca döngü kurmanıza yardımcı olacak üç harita içerir.

- `$colors` tüm mevcut temel (`500`) renklerimizi listeler
- `$theme-colors` tüm anlamsal olarak adlandırılmış tema renklerini listeler (aşağıda gösterilmiştir)
- `$grays` tüm gri tonlarını ve gölgelerini listeler

`scss/_variables.scss` içinde, CoreUI for Bootstrap'ın renk değişkenlerini ve Sass haritasını bulacaksınız. İşte `$colors` Sass haritasının bir örneği:

Harita içinde değerleri ekleyin, kaldırın veya değiştirin; bu değişkenlerin birçok başka bileşende nasıl kullanıldığını güncelleyin. Ne yazık ki bu noktada, her bileşen bu Sass haritasını kullanmamaktadır. Gelecekteki güncellemeler bunun üzerine daha fazla iyileştirme yapmayı hedefleyecektir. Şimdilik, `${color}` değişkenlerini ve bu Sass haritasını kullanmayı planlayın.

### Örnek

Bunları Sass’ta nasıl kullanabileceğinize dair bir örnek:

```scss
.alpha { color: $purple; }
.beta {
  color: $yellow-300;
  background-color: $indigo-900;
}
```

`Renk` ve `arka plan` yardımcı sınıfları, `500` renk değerlerini kullanarak `color` ve `background-color` ayarlamak için de mevcuttur.

## Yardımcılar oluşturma

Bootstrap, her renk değişkeni için `color` ve `background-color` yardımcılarını içermiyor, ancak bunları `yardımcı API'miz` ve v4.1.0'da eklenen genişletilmiş Sass haritalarımız ile kendiniz oluşturabilirsiniz.

1. Başlamak için, fonksiyonlarımızı, değişkenlerimizi, mixin’lerimizi ve yardımcılarımızı içe aktardığınızdan emin olun.
2. Bir yeni haritada birden fazla Sass haritasını hızlı bir şekilde birleştirmek için `map-merge-multiple()` fonksiyonumuzu kullanın.
3. Bu yeni birleştirilmiş haritayı, herhangi bir yardımcıyı `{color}-{level}` sınıf adıyla genişletmek için birleştirin.

Aşağıdaki adımları kullanarak metin rengi yardımcılarını (örn. `.text-purple-500`) üreten bir örnek:

```scss
@import "@coreui/coreui/scss/functions";
@import "@coreui/coreui/scss/variables";
@import "@coreui/coreui/scss/maps";
@import "@coreui/coreui/scss/mixins";
@import "@coreui/coreui/scss/utilities";

$all-colors: map-merge-multiple($blues, $indigos, $purples, $pinks, $reds, $oranges, $yellows, $greens, $teals, $cyans);

$utilities: map-merge(
  $utilities,
  (
    "color": map-merge(
      map-get($utilities, "color"),
      (
        values: map-merge(
          map-get(map-get($utilities, "color"), "values"),
          (
            $all-colors
          ),
        ),
      ),
    ),
  )
);

@import "@coreui/coreui/scss/utilities/api";
```

Bu, her renk ve seviye için yeni `.text-{color}-{level}` yardımcılarını üretir. Aynı şeyi herhangi bir başka yardımcı ve özellik için de yapabilirsiniz.