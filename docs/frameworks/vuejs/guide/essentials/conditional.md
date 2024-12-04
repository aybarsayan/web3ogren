---
title: Koşullu Render
seoTitle: Koşullu Render Guide
sidebar_position: 4
description: Koşullu render, Vue.jsde dinamik içerik göstermenin temel bir yoludur. Bu kılavuz, v-if, v-else, ve diğer koşullu yapıları nasıl kullanacağınızı öğretecektir.
tags: 
  - Vue.js
  - Koşullu Render
  - Geliştiriciler
  - Frontend Geliştirme
keywords: 
  - Vue.js
  - Koşullu Render
  - Geliştiriciler
  - Frontend Geliştirme
---
## Koşullu Render {#conditional-rendering}




## `v-if` {#v-if}

`v-if` direktifi, bir bloğu koşullu olarak render etmek için kullanılır. Bloc, sadece direktifin ifadesi doğru bir değer döndüğünde render edilecektir.

```vue-html
<h1 v-if="awesome">Vue harika!</h1>
```

## `v-else` {#v-else}

`v-else` direktifini kullanarak `v-if` için bir "else bloğu" belirtebilirsiniz:

```vue-html
<button @click="awesome = !awesome">Değiştir</button>

<h1 v-if="awesome">Vue harika!</h1>
<h1 v-else>Ah hayır 😢</h1>
```


  Değiştir
  Vue harika!
  Ah hayır 😢




[Oyun Alanında Deneyin](https://play.vuejs.org/#eNpFjkEOgjAQRa8ydIMulLA1hegJ3LnqBskAjdA27RQXhHu4M/GEHsEiKLv5mfdf/sBOxux7j+zAuCutNAQOyZtcKNkZbQkGsFjBCJXVHcQBjYUSqtTKERR3dLpDyCZmQ9bjViiezKKgCIGwM21BGBIAv3oireBYtrK8ZYKtgmg5BctJ13WLPJnhr0YQb1Lod7JaS4G8eATpfjMinjTphC8wtg7zcwNKw/v5eC1fnvwnsfEDwaha7w==)




[Oyun Alanında Deneyin](https://play.vuejs.org/#eNpFjj0OwjAMha9iMsEAFWuVVnACNqYsoXV/RJpEqVOQqt6DDYkTcgRSWoplWX7y56fXs6O1u84jixlvM1dbSoXGuzWOIMdCekXQCw2QS5LrzbQLckje6VEJglDyhq1pMAZyHidkGG9hhObRYh0EYWOVJAwKgF88kdFwyFSdXRPBZidIYDWvgqVkylIhjyb4ayOIV3votnXxfwrk2SPU7S/PikfVfsRnGFWL6akCbeD9fLzmK4+WSGz4AA5dYQY=)



Bir `v-else` elemanı, bir `v-if` veya `v-else-if` elemanının hemen ardından gelmelidir; aksi takdirde tanınmayacaktır.

## `v-else-if` {#v-else-if}

`v-else-if`, adından da anlaşılacağı gibi, `v-if` için bir "else if bloğu" işlevi görür. Birden fazla kez zincirleme de yapılabilir:

```vue-html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  A/B/C Değil
</div>
```

`t-else` ile benzer şekilde, bir `v-else-if` elemanı, bir `v-if` veya bir `v-else-if` elemanının hemen ardından gelmelidir.

## `v-if` üzerinde `` {#v-if-on-template}

`v-if`, bir direktif olduğundan, tek bir elemana takılması gerekir. Ama birden fazla elementi değiştirmek istersek ne yapmalıyız? Bu durumda, `v-if`'i görünmez bir sarıcı görevi gören bir `` elementi üzerinde kullanabiliriz. Nihai render edilen sonuç, `` elementini içermeyecektir.

```vue-html
<template v-if="ok">
  <h1>Başlık</h1>
  <p>Paragraf 1</p>
  <p>Paragraf 2</p>
</template>
```

`v-else` ve `v-else-if` de `` üzerinde kullanılabilir.

## `v-show` {#v-show}

Bir elementi koşullu olarak görüntülemek için başka bir seçenek ise `v-show` direktifidir. Kullanımı büyük ölçüde aynıdır:

```vue-html
<h1 v-show="ok">Merhaba!</h1>
```

Fark şu ki, `v-show` ile kullanılan bir element her zaman render edilir ve DOM'da kalır; `v-show` yalnızca elementin `display` CSS özelliğini değiştirir.

`v-show`, `` elementini desteklemez ve `v-else` ile çalışmaz.

## `v-if` vs. `v-show` {#v-if-vs-v-show}

**Dikkat!** `v-if`, gerçek "koşullu" renderdir çünkü olay dinleyicilerini ve koşullu bloğun içerisindeki alt bileşenleri düzgün bir şekilde yok eder ve değiştirdiğinde yeniden oluşturur.

`v-if` ayrıca **tembel**'dir: eğer koşul başlangıç render'ında yanlışsa, hiçbir şey yapmaz. Koşullu blok, koşul ilk kez doğru olduğunda render edilmeyecek.

Buna karşılık, `v-show` çok daha basittir - element her zaman render edilir, başlangıç koşuluna bakılmaksızın CSS tabanlı değişim yapılır.

Genel anlamda, `v-if` daha yüksek değiştirme maliyetine sahipken, `v-show` daha yüksek başlangıç render maliyetine sahiptir. Bu nedenle, eğer bir şeyi çok sık değiştirecekseniz `v-show` kullanmayı tercih edin, ve koşul çalışma zamanında değişmeyecekse `v-if` kullanmayı tercih edin.

## `v-if` ile `v-for` {#v-if-with-v-for}

::: warning Nota
Aynı eleman üzerinde `v-if` ve `v-for` kullanılması **tavsiye edilmez** çünkü örtük öncelik nedeniyle sorunlar çıkarabilir. Detaylar için `stil kılavuzuna` bakın.
:::

`v-if` ve `v-for` aynı eleman üzerinde kullanıldığında, önce `v-if` değerlendirilecektir. Detaylar için `liste render kılavuzuna` bakın.