---
description: Çağrılar, içerikleri görsel olarak farklı bir formatla sunan önemli bileşenlerdir. Bu sayfa, çağrı bileşeninin özelliklerini ve özelleştirme yöntemlerini açıklamaktadır.
keywords: [çağrı bileşeni, CSS değişkenleri, SASS değişkenleri, CoreUI, modifikatörler]
---

## Örnekler

Çağrı bileşeni, her uzunluktaki metne ve ek öğelere (simge, başlık vb.) hazırlanmıştır. Stil için, **zorunlu** bağlamsal sınıflardan birini kullanın (örn., `.callout-success`).



{{- range (index $.Site.Data "theme-colors") }}

  Flexbox konusunda yeni veya aşina olmayanlar için? CSS Tricks flexbox kılavuzuna göz atın; arka plan, terminoloji, yönergeler ve kod parçacıkları için.
{{- end -}}



## Özelleştirme

### CSS değişkenleri

Çağrılar, geliştirilmiş anlık özelleştirme için `.callout` içindeki yerel CSS değişkenlerini kullanır. CSS değişkenleri için değerler Sass aracılığıyla ayarlanır, bu nedenle Sass özelleştirmesi de desteklenmektedir.

### SASS değişkenleri

:::tip
Bu değişkenleri ve etkileşimlerini anlamak, çağrı bileşeninin özelleştirilmesi için kritik bir adımdır.
:::

#### Varyantlar

Bu döngüleri nasıl özelleştireceğinizi ve CoreUI'nin temel-modifikatör yaklaşımını kendi kodunuza nasıl genişleteceğinizi görmek için `Sass haritalarımız ve döngüler belgelerimize` göz atın.

#### Modifikatörler

CoreUI'nin çağrı bileşeni, bir temel-modifikatör sınıf yaklaşımı ile inşa edilmiştir. Bu, stilin büyük bir kısmının `.callout` temel sınıfına özgü olduğu, stil varyasyonlarının ise modifikatör sınıflarına (örn., `.callout-danger`) sıkı bir şekilde bağlı olduğu anlamına gelir.

:::note
Bu modifikatör sınıfları, modifikatör sınıf sayısını ve adını özelleştirmek için `$callout-variants` haritasından oluşturulmuştur.
:::

