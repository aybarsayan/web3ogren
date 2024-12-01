---
layout: docs
title: Utility API
description: Utility API, Sass tabanlı bir araçtır ve yardımcı sınıflar üretir. Bu API, özelleştirilebilir yardımcı sınıfları ve CSS değişkenlerini oluşturmak için geniş bir yelpazede seçenekler sunar.
keywords: [Sass, Utility API, CSS, yardımcı sınıflar, responsive, CSS değişkenleri]
---

CoreUI Bootstrap yardımcıları, bizim yardımcı API'mizle oluşturulur ve varsayılan yardımcı sınıf setimizi Sass aracılığıyla değiştirmek veya uzatmak için kullanılabilir. Yardımcı API'miz, çeşitli seçeneklerle sınıf aileleri oluşturmak için bir dizi Sass haritası ve işlevine dayanmaktadır. Sass haritalarına aşina değilseniz, başlayabilmek için [resmi Sass belgelerine](https://sass-lang.com/documentation/values/maps) göz atın.

> **Not**: `$utilities` haritası tüm yardımcılarımızı içerir ve daha sonra mevcutsa, özel `$utilities` haritanızla birleştirilir.

:::tip
Yardımcı harita, aşağıdaki seçenekleri kabul eden yardımcı gruplarının anahtar listesine sahiptir:
:::


| Seçenek | Tür | Varsayılan&nbsp;değer | Açıklama |
| --- | --- | --- | --- |
| `property` | **Gerekli** | – | Özelliğin adı, bu bir dize veya dizeler dizisi olabilir (örneğin, yatay dolgu veya kenar boşlukları). |
| `values` | **Gerekli** | – | Değerler listesi veya sınıf adının değere eşit olmasını istemiyorsanız bir harita. `null` harita anahtarı olarak kullanıldığında, `class` sınıf adının önüne eklenmez. |
| `class` | Opsiyonel | null | Üretilen sınıfın adı. Sağlanmadıysa ve `property` bir dizi dizeyse, `class` ilk `property` dizisi elemanına varsayılan olarak atanır. Sağlanmadıysa ve `property` bir dizeyse, `values` anahtarları `class` adları için kullanılır. |
| `css-var` | Opsiyonel | `false` | CSS kuralları yerine CSS değişkenleri oluşturmak için boole. |
| `css-variable-name` | Opsiyonel | null | Kurallar kümesi içindeki CSS değişkeni için özel ön ek içermeyen ad. |
| `local-vars` | Opsiyonel | null | CSS kurallarına ek olarak oluşturulacak yerel CSS değişkenlerinin haritası. |
| `state` | Opsiyonel | null | Üretilmesi gereken pseudo-sınıf varyantları listesi (örneğin, `:hover` veya `:focus`). |
| `responsive` | Opsiyonel | `false` | Yanıt veren sınıfların oluşturulup oluşturulmayacağını belirten boole. |
| `rfs` | Opsiyonel | `false` | `RFS ile akışkan yeniden boyutlandırmayı` etkinleştirmek için boole. |
| `print` | Opsiyonel | `false` | Yazdırma sınıflarının üretilmesi gerekip gerekmediğini belirten boole. |
| `rtl` | Opsiyonel | `true` | Yardımcının RTL'de tutulup tutulmayacağını belirten boole. |
---

## API açıklandı

Tüm yardımcı değişkenler, `_utilities.scss` stil dosyamız içindeki `$utilities` değişkenine eklenir. Her bir yardımcı grubu şöyle görünür:

```scss
$utilities: (
  "opacity": (
    property: opacity,
    values: (
      0: 0,
      25: .25,
      50: .5,
      75: .75,
      100: 1,
    )
  )
);
```

Aşağıdakileri verir:

```css
.opacity-0 { opacity: 0; }
.opacity-25 { opacity: .25; }
.opacity-50 { opacity: .5; }
.opacity-75 { opacity: .75; }
.opacity-100 { opacity: 1; }
```

---

### Özellik

Gerekli `property` anahtarı, herhangi bir yardımcı için ayarlanmalıdır ve geçerli bir CSS özelliği içermelidir. Bu özellik, üretilen yardımcı'nın kurallar kümesinde kullanılır. `class` anahtarı çıkarıldığında, aynı zamanda varsayılan sınıf adı olarak da hizmet eder. `text-decoration` yardımcı sınıfını düşünün:

```scss
$utilities: (
  "text-decoration": (
    property: text-decoration,
    values: none underline line-through
  )
);
```

Çıktı:

```css
.text-decoration-none { text-decoration: none !important; }
.text-decoration-underline { text-decoration: underline !important; }
.text-decoration-line-through { text-decoration: line-through !important; }
```

---

### Değerler

Üretilen sınıf adlarında ve kurallardaki belirtilen `property` için hangi değerlerin kullanılacağını belirtmek için `values` anahtarını kullanın. Bir liste veya harita (yardımcılar veya bir Sass değişkeni içinde ayarlanmış) olabilir.

Bir liste olarak, `text-decoration` yardımcıları` örneğinde olduğu gibi:

```scss
values: none underline line-through
```

Bir harita olarak, `opacity` yardımcıları` örneğinde olduğu gibi:

```scss
values: (
  0: 0,
  25: .25,
  50: .5,
  75: .75,
  100: 1,
)
```

Bir Sass değişkeni olarak, `position` yardımcıları` örneğinde olduğu gibi:

```scss
values: $position-values
```

---

### Sınıf

Derlenmiş CSS'de kullanılan sınıf ön ekini değiştirmek için `class` seçeneğini kullanın. Örneğin, `.opacity-*` den `.o-*`'ya değiştirmek için:

```scss
$utilities: (
  "opacity": (
    property: opacity,
    class: o,
    values: (
      0: 0,
      25: .25,
      50: .5,
      75: .75,
      100: 1,
    )
  )
);
```

Çıktı:

```css
.o-0 { opacity: 0 !important; }
.o-25 { opacity: .25 !important; }
.o-50 { opacity: .5 !important; }
.o-75 { opacity: .75 !important; }
.o-100 { opacity: 1 !important; }
```

---

### CSS değişken yardımcıları

`css-var` boole seçeneğini `true` olarak ayarlayın ve API, içerik için genellikle `property: value` kuralları yerine yerel CSS değişkenleri oluşturacaktır. Sınıf adından farklı bir CSS değişken adı ayarlamak için opsiyonel bir `css-variable-name` ekleyin.

> **Önemli**: `.text-opacity-*` yardımcılarımızı düşünün. Eğer `css-variable-name` seçeneğini eklesek, özel bir çıktı alırız.

```scss
$utilities: (
  "text-opacity": (
    css-var: true,
    css-variable-name: text-alpha,
    class: text-opacity,
    values: (
      25: .25,
      50: .5,
      75: .75,
      100: 1
    )
  ),
);
```

Çıktı:

```css
.text-opacity-25 { --cui-text-opacity: .25; }
.text-opacity-50 { --cui-text-opacity: .5; }
.text-opacity-75 { --cui-text-opacity: .75; }
.text-opacity-100 { --cui-text-opacity: 1; }
```

---

### Yerel CSS değişkenleri

Yardımcı sınıfın kurallar kümesinde yerel CSS değişkenleri oluşturacak bir Sass haritasını belirtmek için `local-vars` seçeneğini kullanın. Bu yerel CSS değişkenlerini üretilen CSS kurallarında kullanmak için ek çalışma gerektirebilir. Örneğin, `.bg-*` yardımcılarımızı düşünün:

```scss
$utilities: (
  "background-color": (
    property: background-color,
    class: bg,
    local-vars: (
      "bg-opacity": 1
    ),
    values: map-merge(
      $utilities-bg-colors,
      (
        "transparent": transparent
      )
    )
  )
);
```

Çıktı:

```css
.bg-primary {
  --cui-bg-opacity: 1;
  background-color: rgba(var(--cui-primary-rgb), var(--cui-bg-opacity)) !important;
}
```

---

### Durumlar

Pseudo-sınıf varyasyonları oluşturmak için `state` seçeneğini kullanın. Örnek pseudo-sınıflar `:hover` ve `:focus`'tır. Bir dizi durum sağlandığında, o pseudo-sınıf için sınıf adları oluşturulur. Örneğin, fare ile üzerine gelindiğinde opaklığı değiştirmek için `state: hover` ekleyin ve derlenmiş CSS'de `.opacity-hover:hover` alacaksınız.

Birden fazla pseudo-sınıf mı gerekiyor? Durumların boşlukla ayrılmış bir listesini kullanın: `state: hover focus`.

```scss
$utilities: (
  "opacity": (
    property: opacity,
    class: opacity,
    state: hover,
    values: (
      0: 0,
      25: .25,
      50: .5,
      75: .75,
      100: 1,
    )
  )
);
```

Çıktı:

```css
.opacity-0-hover:hover { opacity: 0 !important; }
.opacity-25-hover:hover { opacity: .25 !important; }
.opacity-50-hover:hover { opacity: .5 !important; }
.opacity-75-hover:hover { opacity: .75 !important; }
.opacity-100-hover:hover { opacity: 1 !important; }
```

---

### Yanıt veren

`responsive` boole seçeneğini ekleyerek `tüm kesim noktalarında` yanıt veren yardımcıları oluşturun (örneğin, `.opacity-md-25`).

```scss
$utilities: (
  "opacity": (
    property: opacity,
    responsive: true,
    values: (
      0: 0,
      25: .25,
      50: .5,
      75: .75,
      100: 1,
    )
  )
);
```

Çıktı:

```css
.opacity-0 { opacity: 0 !important; }
.opacity-25 { opacity: .25 !important; }
.opacity-50 { opacity: .5 !important; }
.opacity-75 { opacity: .75 !important; }
.opacity-100 { opacity: 1 !important; }

@media (min-width: 576px) {
  .opacity-sm-0 { opacity: 0 !important; }
  .opacity-sm-25 { opacity: .25 !important; }
  .opacity-sm-50 { opacity: .5 !important; }
  .opacity-sm-75 { opacity: .75 !important; }
  .opacity-sm-100 { opacity: 1 !important; }
}

@media (min-width: 768px) {
  .opacity-md-0 { opacity: 0 !important; }
  .opacity-md-25 { opacity: .25 !important; }
  .opacity-md-50 { opacity: .5 !important; }
  .opacity-md-75 { opacity: .75 !important; }
  .opacity-md-100 { opacity: 1 !important; }
}

@media (min-width: 992px) {
  .opacity-lg-0 { opacity: 0 !important; }
  .opacity-lg-25 { opacity: .25 !important; }
  .opacity-lg-50 { opacity: .5 !important; }
  .opacity-lg-75 { opacity: .75 !important; }
  .opacity-lg-100 { opacity: 1 !important; }
}

@media (min-width: 1200px) {
  .opacity-xl-0 { opacity: 0 !important; }
  .opacity-xl-25 { opacity: .25 !important; }
  .opacity-xl-50 { opacity: .5 !important; }
  .opacity-xl-75 { opacity: .75 !important; }
  .opacity-xl-100 { opacity: 1 !important; }
}

@media (min-width: 1400px) {
  .opacity-xxl-0 { opacity: 0 !important; }
  .opacity-xxl-25 { opacity: .25 !important; }
  .opacity-xxl-50 { opacity: .5 !important; }
  .opacity-xxl-75 { opacity: .75 !important; }
  .opacity-xxl-100 { opacity: 1 !important; }
}
```

---

### Yazdırma

`print` seçeneğini etkinleştirerek, utility classes for print, sadece `@media print { ... }` medya sorgusu içinde uygulanır.

```scss
$utilities: (
  "opacity": (
    property: opacity,
    print: true,
    values: (
      0: 0,
      25: .25,
      50: .5,
      75: .75,
      100: 1,
    )
  )
);
```

Çıktı:

```css
.opacity-0 { opacity: 0 !important; }
.opacity-25 { opacity: .25 !important; }
.opacity-50 { opacity: .5 !important; }
.opacity-75 { opacity: .75 !important; }
.opacity-100 { opacity: 1 !important; }

@media print {
  .opacity-print-0 { opacity: 0 !important; }
  .opacity-print-25 { opacity: .25 !important; }
  .opacity-print-50 { opacity: .5 !important; }
  .opacity-print-75 { opacity: .75 !important; }
  .opacity-print-100 { opacity: 1 !important; }
}
```

---

## Önem

API tarafından üretilen tüm yardımcılar, bileşenler ve modifier sınıflarını gerektiği gibi geçersiz kılmak için `!important` içerir. Bu ayarı global olarak `$enable-important-utilities` değişkeni ile değiştirebilirsiniz (varsayılan olarak `true`).

---

## API'yi Kullanma

Artık yardımcı API'sinin nasıl çalıştığını anladığınıza göre, kendi özel sınıflarınızı nasıl ekleyeceğinizi ve varsayılan yardımcılarımızı nasıl değiştireceğinizi öğrenin.

### Yardımcıları Geçersiz Kılma

Mevcut yardımcıları aynı anahtarı kullanarak geçersiz kılın. Örneğin, ek yanıt veren taşma yardımcı sınıfı oluşturmak istiyorsanız, bunu yapabilirsiniz:

```scss
$utilities: (
  "overflow": (
    responsive: true,
    property: overflow,
    values: visible hidden scroll auto,
  ),
);
```

---

### Yardımcılar Eklemek

Yeni yardımcılar, varsayılan `$utilities` haritasına `map-merge` ile eklenebilir. Önce gerekli Sass dosyalarımızı ve `_utilities.scss` dosyasını içe aktardığınızdan emin olun, sonra `map-merge` kullanarak ek yardımcılarınızı ekleyin. Örneğin, işte üç değere sahip bir responsive `cursor` yardımcısı eklemenin yolu:

```scss
@import "@coreui/coreui/scss/functions";
@import "@coreui/coreui/scss/variables";
@import "@coreui/coreui/scss/maps";
@import "@coreui/coreui/scss/mixins";
@import "@coreui/coreui/scss/utilities";

$utilities: map-merge(
  $utilities,
  (
    "cursor": (
      property: cursor,
      class: cursor,
      responsive: true,
      values: auto pointer grab,
    )
  )
);

@import "@coreui/coreui/scss/utilities/api";
```

---

### Yardımcıları Değiştirme

Varsayılan `$utilities` haritasındaki mevcut yardımcıları `map-get` ve `map-merge` işlevleri ile değiştirebilirsiniz. Aşağıdaki örnekte, `width` yardımcılarına ek bir değer ekliyoruz. Başlangıçta bir `map-merge` ile başlayın ve ardından hangi yardımcıyı değiştirmek istediğinizi belirtin. Oradan, iç içe geçmiş `"width"` haritasını `map-get` ile alıp yardımcı'nın seçeneklerini ve değerlerini erişip değiştirebilirsiniz.

```scss
@import "@coreui/coreui/scss/functions";
@import "@coreui/coreui/scss/variables";
@import "@coreui/coreui/scss/maps";
@import "@coreui/coreui/scss/mixins";
@import "@coreui/coreui/scss/utilities";

$utilities: map-merge(
  $utilities,
  (
    "width": map-merge(
      map-get($utilities, "width"),
      (
        values: map-merge(
          map-get(map-get($utilities, "width"), "values"),
          (10: 10%),
        ),
      ),
    ),
  )
);

@import "@coreui/coreui/scss/utilities/api";
```

---

#### Yanıt Veren Modu

Varsayılan olarak yanıt vermeyen mevcut bir yardımcı seti için yanıt veren sınıfları etkinleştirebilirsiniz. Örneğin, `border` sınıflarını yanıt veren hale getirmek için:

```scss
@import "@coreui/coreui/scss/functions";
@import "@coreui/coreui/scss/variables";
@import "@coreui/coreui/scss/maps";
@import "@coreui/coreui/scss/mixins";
@import "@coreui/coreui/scss/utilities";

$utilities: map-merge(
  $utilities, (
    "border": map-merge(
      map-get($utilities, "border"),
      ( responsive: true ),
    ),
  )
);

@import "@coreui/coreui/scss/utilities/api";
```

Bu artık her kesim noktası için `.border` ve `.border-0` yanıt veren varyasyonları üretecektir. Üretilen CSS'iniz şöyle görünecektir:

```css
.border { ... }
.border-0 { ... }

@media (min-width: 576px) {
  .border-sm { ... }
  .border-sm-0 { ... }
}

@media (min-width: 768px) {
  .border-md { ... }
  .border-md-0 { ... }
}

@media (min-width: 992px) {
  .border-lg { ... }
  .border-lg-0 { ... }
}

@media (min-width: 1200px) {
  .border-xl { ... }
  .border-xl-0 { ... }
}

@media (min-width: 1400px) {
  .border-xxl { ... }
  .border-xxl-0 { ... }
}
```

---

#### Yardımcıları Yeniden Adlandırma

Eksik v4 yardımcıları mı var, yoksa başka bir adlandırma konvansiyonuna mı alışkınsınız? Yardımcılar API'si, belirli bir yardımcı için sonuçta elde edilen `class`'ı geçersiz kılmak üzere kullanılabilir - örneğin, `.ms-*` yardımcılarını eski `.ml-*` olarak yeniden adlandırmak için:

```scss
@import "@coreui/coreui/scss/functions";
@import "@coreui/coreui/scss/variables";
@import "@coreui/coreui/scss/maps";
@import "@coreui/coreui/scss/mixins";
@import "@coreui/coreui/scss/utilities";

$utilities: map-merge(
  $utilities, (
    "margin-start": map-merge(
      map-get($utilities, "margin-start"),
      ( class: ml ),
    ),
  )
);

@import "@coreui/coreui/scss/utilities/api";
```

---

### Yardımcıları Kaldırma

Varsayılan yardımcıların herhangi birini [map-remove() Sass işlevi](https://sass-lang.com/documentation/modules/map#remove) ile kaldırabilirsiniz.

```scss
@import "@coreui/coreui/scss/functions";
@import "@coreui/coreui/scss/variables";
@import "@coreui/coreui/scss/maps";
@import "@coreui/coreui/scss/mixins";
@import "@coreui/coreui/scss/utilities";

// Virgülle ayrılmış liste ile birden fazla yardımcıyı kaldırın
$utilities: map-remove($utilities, "width", "float");

@import "@coreui/coreui/scss/utilities/api";
```

Ayrıca [map-merge() Sass işlevi](https://sass-lang.com/documentation/modules/map#merge) kullanarak grup anahtarını `null` olarak ayarlayarak yardımcıyı kaldırabilirsiniz.

```scss
@import "@coreui/coreui/scss/functions";
@import "@coreui/coreui/scss/variables";
@import "@coreui/coreui/scss/maps";
@import "@coreui/coreui/scss/mixins";
@import "@coreui/coreui/scss/utilities";

$utilities: map-merge(
  $utilities,
  (
    "width": null
  )
);

@import "@coreui/coreui/scss/utilities/api";
```

---

### Ekle, Kaldır, Değiştir

Birçok yardımcıyı tek seferde ekleyebilir, kaldırabilir ve değiştirebilirsiniz. İşte [`map-merge()` Sass işlevi](https://sass-lang.com/documentation/modules/map#merge) ile önceki örnekleri daha büyük bir haritada nasıl birleştirebileceğinizin yolu.

```scss
@import "@coreui/coreui/scss/functions";
@import "@coreui/coreui/scss/variables";
@import "@coreui/coreui/scss/maps";
@import "@coreui/coreui/scss/mixins";
@import "@coreui/coreui/scss/utilities";

$utilities: map-merge(
  $utilities,
  (
    // `width` yardımcı sınıfını kaldır
    "width": null,

    // Mevcut bir yardımcıyı yanıt veren hale getir
    "border": map-merge(
      map-get($utilities, "border"),
      ( responsive: true ),
    ),

    // Yeni yardımcılar ekle
    "cursor": (
      property: cursor,
      class: cursor,
      responsive: true,
      values: auto pointer grab,
    )
  )
);

@import "@coreui/coreui/scss/utilities/api";
```