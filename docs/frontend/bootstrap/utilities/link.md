---
description: Bağlantı yardımcı programları, bağlantılarınızın rengini, saydamlığını, alt çizgi ofsetini, alt çizgi rengini ve daha fazlasını ayarlamak için kullanılır. Bu belgede, bağlantıların görünümünü özelleştirmek için çeşitli stratgiler ve teknikler ele alınmaktadır.
keywords: [bağlantı, saydamlık, alt çizgi, yardımcı programlar, stil, tasarım, renk]
---

# Bağlantılar

## Bağlantı saydamlığı

Bağlantı `rgba()` renk değerinin alfa saydamlığını yardımcı programlarla değiştirin. Bir rengin saydamlığındaki değişikliklerin, `*yetersiz* kontrast` olan bağlantılara yol açabileceğini lütfen dikkate alın.


Bağlantı saydamlığı 10
Bağlantı saydamlığı 25
Bağlantı saydamlığı 50
Bağlantı saydamlığı 75
Bağlantı saydamlığı 100
:::tip
Fare ile üzerine geldiğinizde saydamlık seviyesini değiştirebilirsiniz.
:::


Bağlantı üzeri saydamlığı 10
Bağlantı üzeri saydamlığı 25
Bağlantı üzeri saydamlığı 50
Bağlantı üzeri saydamlığı 75
Bağlantı üzeri saydamlığı 100
---

## Bağlantı alt çizgileri

### Alt çizgi rengi

Alt çizginin rengini, bağlantı metni renginden bağımsız olarak değiştirin.



{{- range (index $.Site.Data "theme-colors") }}
{{ .name | title }} alt çizgi
{{- end -}}

### Alt çizgi ofseti

Alt çizginin metninizden olan mesafesini değiştirin. Ofset, elemanın mevcut `font-size`'ı ile otomatik olarak ölçeklenebilmesi için `em` biriminde ayarlanır.


Varsayılan bağlantı
Ofset 1 bağlantısı
Ofset 2 bağlantısı
Ofset 3 bağlantısı
### Alt çizgi saydamlığı

Alt çizginin saydamlığını değiştirin. Alpha saydamlığını değiştirmeden önce bir `rgba()` rengi ayarlamak için `.link-underline` eklemeyi gerektirir.


Alt çizgi saydamlığı 0
Alt çizgi saydamlığı 10
Alt çizgi saydamlığı 25
Alt çizgi saydamlığı 50
Alt çizgi saydamlığı 75
Alt çizgi saydamlığı 100
### Üzerine gelme varyantları

`.link-opacity-*-hover` yardımcı programları gibi, `.link-offset` ve `.link-underline-opacity` yardımcı programları varsayılan olarak `:hover` varyantlarını içerir. Eşleştirerek benzersiz bağlantı stilleri oluşturun.

  Alt çizgi saydamlığı 0

---

## Renkli bağlantılar

`Renkli bağlantı yardımcıları` bağlantı yardımcı programlarımızla eşleşecek şekilde güncellenmiştir. Yeni yardımcı programları kullanarak bağlantı saydamlığını, alt çizgi saydamlığını ve alt çizgi ofsetini değiştirebilirsiniz.



{{- range (index $.Site.Data "theme-colors") }}
{{ .name | title }} bağlantısı
{{- end -}}

Vurgu bağlantısı


---

## Sass

Aşağıdaki Sass işlevselliğine ek olarak, renkler ve daha fazlası için dahil edilen `CSS özel özellikleri` (yani CSS değişkenleri) hakkında okumayı düşünün.

### Yardımcı Programlar API'si

Bağlantı yardımcı programları, `scss/_utilities.scss` dosyasında yardımcı programlar API'sinde tanımlanmıştır. `Yardımcı programlar API'sini nasıl kullanacağınızı öğrenin.`

