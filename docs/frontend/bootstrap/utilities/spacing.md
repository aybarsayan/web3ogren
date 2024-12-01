---
description: CoreUI for Bootstrap, bir öğenin görünümünü değiştirmek için geniş bir yelpazede kısayol duyarlı kenar boşluğu, dolgu ve boşluk yardımcı sınıfları içerir. Bu belgede, kenar boşluğu ve dolgu uygulamaları, notasyonları, örnekleri ve Sass ile ilgili bilgiler sunulmaktadır.
keywords: [CoreUI, Bootstrap, kenar boşluğu, dolgu, boşluk yardımcı sınıfları, Sass, responsive design]
---

# Boşluk Bırakma

## Kenar boşluğu ve dolgu

Kısayol sınıfları ile bir öğeye veya kenarlarının bir alt kümesine duyarlı dostu `kenar boşluğu` veya `dolgu` değerleri atayın. Bireysel özellikler, tüm özellikler ve dikey ile yatay özellikler için destek içerir. Sınıflar, `.25rem` ile `3rem` arasında bir varsayılan Sass haritasından oluşturulur.

:::tip
**CSS Grid düzen modülünü mü kullanıyorsunuz?** Bunun yerine `boşluk yardımcı sınıfını` kullanmayı düşünün.
:::

### Notasyon

Tüm kırılma noktalarına uygulanan boşluk yardımcı sınıfları, `xs`'den `xxl`'ye kadar, içinde hiçbir kırılma noktası kısaltması bulunmamaktadır. Bunun nedeni, bu sınıfların `min-width: 0`'dan itibaren uygulanmasıdır ve bu nedenle bir medya sorgusuyla sınırlı değildir. Ancak, kalan kırılma noktaları bir kırılma noktası kısaltması içerir.

Sınıflar, `xs` için `{özellik}{kenarlar}-{boyut}` ve `sm`, `md`, `lg`, `xl`, `xxl` için `{özellik}{kenarlar}-{kırılma noktası}-{boyut}` formatında adlandırılmıştır.

Burada *özellik* şunlardan biridir:

- `m` - `kenar boşluğu` ayarlayan sınıflar için
- `p` - `dolgu` ayarlayan sınıflar için

Burada *kenarlar* şunlardan biridir:

- `t` - `kenar-boşluğu üst` veya `dolgu üst` ayarlayan sınıflar için
- `b` - `kenar-boşluğu alt` veya `dolgu alt` ayarlayan sınıflar için
- `s` - (başlangıç) LTR'de `kenar-boşluğu sol` veya `dolgu sol`, RTL'de ise `kenar-boşluğu sağ` veya `dolgu sağ` ayarlayan sınıflar için
- `e` - (bitiş) LTR'de `kenar boşlığı sağ` veya `dolgu sağ`, RTL'de ise `kenar boşluğu sol` veya `dolgu sol` ayarlayan sınıflar için
- `x` - Hem `*-sol` hem de `*-sağ` ayarlayan sınıflar için
- `y` - Hem `*-üst` hem de `*-alt` ayarlayan sınıflar için
- boş - Bir öğenin 4 tarafından bir `kenar boşluğu` veya `dolgu` ayarlayan sınıflar için

Burada *boyut* şunlardan biridir:

- `0` - `kenar boşluğu` veya `dolgu`'yu `0` olarak ayarlayan sınıflar için
- `1` - (varsayılan) `kenar boşluğu` veya `dolgu`'yu `$spacer * .25` olarak ayarlayan sınıflar için
- `2` - (varsayılan) `kenar boşluğu` veya `dolgu`'yu `$spacer * .5` olarak ayarlayan sınıflar için
- `3` - (varsayılan) `kenar boşluğu` veya `dolgu`'yu `$spacer` olarak ayarlayan sınıflar için
- `4` - (varsayılan) `kenar boşluğu` veya `dolgu`'yu `$spacer * 1.5` olarak ayarlayan sınıflar için
- `5` - (varsayılan) `kenar boşluğu` veya `dolgu`'yu `$spacer * 3` olarak ayarlayan sınıflar için
- `auto` - `kenar boşluğu`'nu otomatik olarak ayarlayan sınıflar için

:::note
(Daha fazla boyut eklemek için `$spacers` Sass harita değişkenine girişler ekleyebilirsiniz.)
:::

### Örnekler

Bu sınıfların bazı temsilci örnekleri:

```scss
.mt-0 {
  margin-top: 0 !important;
}

.ms-1 {
  margin-left: ($spacer * .25) !important;
}

.px-2 {
  padding-left: ($spacer * .5) !important;
  padding-right: ($spacer * .5) !important;
}

.p-3 {
  padding: $spacer !important;
}
```

### Yatay merkezleme

Ayrıca, CoreUI for Bootstrap sabit genişlikte blok düzeyinde içerikleri yatay olarak merkezlemek için `.mx-auto` sınıfını da içerir; yani, `display: block` ve belirlenmiş bir `width`'e sahip olan içerikleri, yatay marginleri `auto` olarak ayarlayarak merkezler.


  
    Merkezlenmiş öğe
  


```html
<div class="mx-auto" style="width: 200px;">
  Merkezlenmiş öğe
</div>
```

## Negatif kenar boşluğu

CSS'te `kenar boşluğu` özellikleri negatif değerler kullanabilir (`dolgu` kullanamaz). Bu negatif kenar boşlukları varsayılan olarak **devre dışıdır**, ancak Sass'ta `$enable-negative-margins: true` ayarlanarak etkinleştirilebilir.

Sözdizimi, varsayılan, pozitif kenar boşluğu yardımcı sınıflarıyla neredeyse aynıdır, ancak istenen boyuttan önce `n` eklenmiştir. İşte `.mt-1` sınıfının tersidir:

```scss
.mt-n1 {
  margin-top: -0.25rem !important;
}
```

## Boşluk

`display: grid` veya `display: flex` kullanırken, üst öğeye `boşluk` yardımcı sınıflarını kullanabilirsiniz. Bu, bir ızgara veya esnek konteynırın bireysel çocuklarına margin yardımcı sınıfları eklemekten tasarruf ettirebilir. Boşluk yardımcı sınıfları varsayılan olarak duyarlıdır ve `$spacers` Sass haritasına göre, yardımcı program API'miz aracılığıyla oluşturulur.

  Izgara öğesi 1
  Izgara öğesi 2
  Izgara öğesi 3
  Izgara öğesi 4

Destek, CoreUI'nın grid kırılma noktaları için duyarlı seçenekler ve `$spacers` haritasından altı boyut içerir (`0`–`5`). `.gap-auto` yardımcı sınıfı yoktur çünkü etkili şekilde `.gap-0` ile aynıdır.

### row-gap

`row-gap`, belirtilen konteynırda çocuk öğeleri arasındaki dikey alanı ayarlar.

  Izgara öğesi 1
  Izgara öğesi 2
  Izgara öğesi 3
  Izgara öğesi 4

### column-gap

`column-gap`, belirtilen konteynırda çocuk öğeleri arasındaki yatay alanı ayarlar.

  Izgara öğesi 1
  Izgara öğesi 2
  Izgara öğesi 3
  Izgara öğesi 4

## Sass

### Haritalar

Boşluk yardımcı sınıfları Sass haritası aracılığıyla ilan edilir ve ardından yardımcı program API'mizle üretilir.

### Yardımcı Program API'si

Boşluk yardımcı sınıfları, `scss/_utilities.scss` dosyasında yardımcı program API'mizde ilan edilir. `Yardımcı program API'sini nasıl kullanacağınızı öğrenin.`

