---
layout: docs
title: Kenarlar
description: Bir öğenin kenarını ve kenar yarıçapını hızlı bir şekilde stillendirmek için kenar yardımcı programlarını kullanın. Görseller, butonlar veya başka herhangi bir öğe için mükemmeldir. Bu belgede, kenar ekleme, kaldırma, renk, opaklık gibi konular ele alınmaktadır.
keywords: [kenar, stil, CSS, yardımcı program, opaklık, renk, Sass]
---

# Kenar

Kenar yardımcı programlarını kullanarak bir öğenin kenarlarını ekleyebilir veya kaldırabilirsiniz. Tüm kenarları veya tek bir kenarı seçin.

### Eklemeli





### Çıkarıcı

Ya da kenarları kaldırın:





## Renk

Kenar rengini tema renklerimize dayanarak değiştirin.



{{- range (index $.Site.Data "theme-colors") }}


{{- end -}}

:::tip
Yardımcı programlar kullanarak bir kenarı yalnızca bir taraftan değiştirebilirsiniz veya tüm kenarları farklı renklere ayarlayabilirsiniz.
:::







## Kenar Genişliği

Ya da bir bileşenin varsayılan `border-color` değerini değiştirebilirsiniz:

  E-posta adresi
  



  Tehlikeli başlık



  Kenar rengini ve genişliğini değiştirme

## Opaklık

Bootstrap `border-{color}` yardımcı programları, Sass kullanılarak CSS değişkenleri ile oluşturulur. Bu, derleme olmadan gerçek zamanlı renk değişikliklerine ve dinamik alfa saydamlık değişimlerine olanak tanır.

### Nasıl çalışır

Varsayılan `.border-success` yardımcı programımızı düşünün.

```css
.border-success {
  --cui-border-opacity: 1;
  border-color: rgba(var(--cui-success-rgb), var(--cui-border-opacity)) !important;
}
```

:::note
CSS değişkenimiz olan `--cui-success` (değeri `25, 135, 84`) RGB sürümünü kullanıyor ve alfa saydamlığı için ikinci bir CSS değişkeni olan `--cui-border-opacity` ekliyoruz (varsayılan değeri `1` yerel bir CSS değişkeni sayesinde).
:::

Yani artık `.border-success` kullandığınızda, hesaplanan `color` değeriniz `rgba(25, 135, 84, 1)` olacak. Her `.border-*` sınıfı içindeki yerel CSS değişkeni, miras alma sorunlarını önler, **böylece** yardımcı programların iç içe geçmiş örnekleri otomatik olarak değiştirilmiş bir alfa saydamlığa sahip olmaz.

### Örnek

O opaklığı değiştirmek için, özel stiller veya satır içi stiller aracılığıyla `--cui-border-opacity` değerini geçersiz kılabilirsiniz.


Bu varsayılan başarı kenarıdır
Bu %50 opaklıkta başarı kenarıdır
Ya da herhangi bir `.border-opacity` yardımcı programından birini seçin:


Bu varsayılan başarı kenarıdır
Bu %75 opaklıkta başarı kenarıdır
Bu %50 opaklıkta başarı kenarıdır
Bu %25 opaklıkta başarı kenarıdır
Bu %10 opaklıkta başarı kenarıdır
## Genişlik























## Yarıçap

Bir öğeye sınıflar ekleyerek köşelerini kolayca yuvarlayın.















### Boyutlar

Daha büyük veya daha küçük yuvarlak köşeler için ölçeklendirme sınıflarını kullanın. Boyutlar `0` ile `5` arasında değişir ve yardımcı program API'sini düzenleyerek yapılandırılabilir.








## Özelleştirme

### CSS değişkenleri

### Sass değişkenleri

### Sass mixinleri

### Yardımcı Program API'si

Kenar yardımcı programları, `scss/_utilities.scss` dosyasındaki yardımcı program API'mizde tanımlanır. `Yardımcı program API'sini nasıl kullanacağınızı öğrenin.`

