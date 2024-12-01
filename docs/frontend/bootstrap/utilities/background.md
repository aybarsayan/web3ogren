---
description: Arka plan rengi ve gradyan kullanımı üzerine kapsamlı bir kılavuz. Bu içerik, CSS değişkenleri ile dinamik saydamlık ve renk sınıflarını nasıl oluşturabileceğinizi anlatıyor.
keywords: [arka plan, gradyan, CSS, saydamlık, renk sınıfları]
---

# Arka plan rengi

Bağlamsal metin rengi sınıflarına benzer şekilde, bir öğenin arka planını herhangi bir bağlamsal sınıfa ayarlayın. Arka plan yardımcı sınıfları **`color` ayarlamaz**, bu nedenle bazı durumlarda `.text-*` `renk yardımcı sınıflarını` kullanmak isteyebilirsiniz.



{{- range (index $.Site.Data "theme-colors") }}
.bg-{{ .name }}
.bg-{{ .name }}-subtle
{{- end -}}

.bg-body-secondary
.bg-body-tertiary

.bg-body
.bg-black
.bg-white
.bg-transparent
## Arka plan gradyanı

`.bg-gradient` sınıfını ekleyerek, arka planlara bir lineer gradyan eklenir. Bu gradyan, alttan kaybolan yarı saydam bir beyaz ile başlar.

:::tip
Özelleştirilmiş CSS'inizde bir gradyana ihtiyacınız var? Sadece `background-image: var(gradient);` ekleyin.
:::



{{- range (index $.Site.Data "theme-colors") }}
.bg-{{ .name }}.bg-gradient
{{- end -}}

.bg-black.bg-gradient
## Saydamlık

v4.1.0 itibarıyla, `background-color` yardımcı sınıfları Sass kullanılarak CSS değişkenleri ile oluşturulur. Bu, derleme olmadan gerçek zamanlı renk değişikliklerine ve dinamik alfa saydamlık değişikliklerine olanak tanır.

### Nasıl çalışır

Varsayılan `.bg-success` yardımcı sınıfımızı düşünün.

```css
.bg-success {
  --cui-bg-opacity: 1;
  background-color: rgba(var(--cui-success-rgb), var(--cui-bg-opacity)) !important;
}
```

> Her `.bg-*` sınıfındaki yerel CSS değişkeni, miras alma sorunlarını önleyerek yardımcı sınıfların iç içe geçmiş örneklerinin otomatik olarak değiştirilmiş alfa saydamlık almasını engeller. — CSS Kılavuzu

### Örnek

Bu saydamlığı değiştirmek için, `--cui-bg-opacity` değerini özel stiller veya satır içi stiller ile geçersiz kılın.


Bu varsayılan başarı arka planıdır
Bu %50 saydamlıkta başarı arka planıdır
Ya da, herhangi bir `.bg-opacity` yardımcı sınıfından birini seçin:


Bu varsayılan başarı arka planıdır
Bu %75 saydamlıkta başarı arka planıdır
Bu %50 saydamlıkta başarı arka planıdır
Bu %25 saydamlıkta başarı arka planıdır
Bu %10 saydamlıkta başarı arka planıdır
## Sass

Aşağıdaki Sass işlevselliğine ek olarak, renkler ve daha fazlası için dahil edilen `CSS özel değişkenleri` hakkında okumayı düşünün.

### Değişkenler

Çoğu `background-color` yardımcı sınıfı, genel renk paleti değişkenlerinden yeniden atanan tema renklerimiz tarafından oluşturulur.

Gri tonları da mevcuttur, ancak yalnızca bir alt kümesi herhangi bir yardımcı sınıf oluşturmak için kullanılır.

:::info
Işık ve karanlık modda `.bg-*-subtle` yardımcı sınıflarında `background-color` ayarlamak için değişkenler bulunur.
:::

### Harita

Tema renkleri, yardımcı sınıflarımızı, bileşen modifikatörlerimizi ve daha fazlasını oluşturmak için döngüye alabilmemiz için bir Sass haritasına yerleştirilir.

Gri tonları da bir Sass haritası olarak mevcuttur. **Bu harita, herhangi bir yardımcı sınıf oluşturmak için kullanılmaz.**

RGB renkleri, ayrı bir Sass haritasından oluşturulmaktadır:

Ve arka plan renk saydamlıkları, yardımcı sınıf API'si tarafından tüketilen kendi haritasıyla inşa edilir:

### Miksinler

**Arka plan yardımcı sınıflarımızı oluşturmak için hiç miksin kullanılmaz**, ancak kendi gradyanlarınızı oluşturmak istediğiniz durumlar için bazı ek miksinlere sahibiz.

### Kullanım API'si

Arka plan yardımcı sınıfları, `scss/_utilities.scss` dosyasında yardımcı sınıf API'mizde tanımlanır. `Yardımcı sınıf API'sinin nasıl kullanılacağını öğrenin.`

