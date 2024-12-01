---
description: Renk yardımcı sınıfları ile metinlerinizi renklendirin ve CSS değişkenleri ile opaklık ayarlarını dinamik hale getirin. Renk paletleri ve haritaları hakkında bilgi edinin.
keywords: [renkler, yardımcı sınıflar, opaklık, CSS değişkenleri, tema renkleri]
---

# Renkler

Renk yardımcıları ile metinleri renklendirin. Bağlantıları renklendirmek istiyorsanız, `:hover` ve `:focus` durumları olan `.link-*` yardımcı sınıflarını` kullanabilirsiniz.



{{- range (index $.Site.Data "theme-colors") }}
.text-{{ .name }}
.text-{{ .name }}-emphasis
{{- end -}}
.text-body
.text-body-emphasis
.text-body-secondary
.text-body-tertiary

.text-black
.text-white
.text-black-50
.text-white-50

**Kullanımdan kaldırma:** `.text-opacity-*` yardımcıları ve metin yardımcıları için CSS değişkenlerinin eklenmesiyle, `.text-black-50` ve `.text-white-50` v4.1.0 itibarıyla kullanımdan kaldırılmıştır. v6.0.0'da kaldırılacaklardır.


---

## Opaklık

v4.1.0 itibarıyla, metin rengi yardımcıları CSS değişkenlerini kullanarak Sass ile oluşturulmaktadır. Bu, derleme olmadan gerçek zamanlı renk değişikliklerine ve dinamik alfa opaklık değişikliklerine olanak tanır.

### Nasıl çalışır

Varsayılan `.text-primary` yardımcı sınıfımızı düşünün.

```css
.text-primary {
  --cui-text-opacity: 1;
  color: rgba(var(--cui-primary-rgb), var(--cui-text-opacity)) !important;
}
```

`--cui-primary` CSS değişkenimizin RGB versiyonunu (değeri `13, 110, 253`) kullanıyoruz ve alfa opaklığı için ikinci bir CSS değişkeni, `--cui-text-opacity` ekliyoruz (varsayılan değeri `1` yerel bir CSS değişkeni sayesinde). Yani şimdi `.text-primary` kullandığınızda, hesaplanan `color` değeri `rgba(13, 110, 253, 1)` olur. 

:::note
Her bir `.text-*` sınıfı içindeki yerel CSS değişkeni, miras alma sorunlarını önler, böylece yardımcıların iç içe geçmiş örnekleri otomatik olarak değiştirilmiş bir alfa opaklığa sahip olmaz.
:::

### Örnek

Oluşturulan opaklığı değiştirmek için `--cui-text-opacity` değerini özel stiller veya satır içi stiller aracılığıyla geçersiz kılabilirsiniz.


Bu varsayılan birincil metindir
Bu %50 opaklıkta birincil metindir
Ya da `.text-opacity` yardımcılarından herhangi birini seçin:


Bu varsayılan birincil metindir
Bu %75 opaklıkta birincil metindir
Bu %50 opaklıkta birincil metindir
Bu %25 opaklıkta birincil metindir
---

## Özellik

Bazen bağlamsal sınıflar, başka bir seçicinin belirginliği nedeniyle uygulanamaz. Bazı durumlarda, yeterli bir çözüm, öğe içeriğinizi istediğiniz sınıfa sahip bir `` veya daha anlamlı bir öğe içine sarmaktır.

## Sass

Aşağıdaki Sass işlevselliğine ek olarak, renkler ve daha fazlası için dahil edilen `CSS özel özellikleri` hakkında okumayı düşünebilirsiniz.

Özel CSS’nizde bir gradyana mı ihtiyacınız var? `background-image: var(--cui-gradient);` ekleyin.

### Değişkenler

Çoğu `color` yardımcı sınıfları, genel renk paleti değişkenlerimizden yeniden atanmış tema renkleri tarafından oluşturulmaktadır.

Gri tonları da mevcuttur, ancak bunların yalnızca bir alt kümesi herhangi bir yardımcı sınıfı oluşturmak için kullanılmaktadır.

### Harita

Tema renkleri, yardımcılarımızı, bileşen değiştiricilerimizi ve daha fazlasını oluşturmak için döngüye girebildiğimiz bir Sass haritasına konur.

Gri renkler de bir Sass haritası olarak mevcuttur. **Bu harita, herhangi bir yardımcı oluşturmak için kullanılmaz.**

RGB renkleri ayrı bir Sass haritasından üretilir:

Ve renk opaklıkları, yardımcılar API'si tarafından tüketilen kendi haritasıyla birlikte bunun üzerine inşa edilir:

### Utilities API

Renk yardımcıları, `scss/_utilities.scss` dosyasında bulunan yardımcı API'mizde tanımlanmıştır. `API'yi nasıl kullanacağınızı öğrenin.`

