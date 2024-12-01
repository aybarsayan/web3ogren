---
description: Düşük seviyeli `z-index` yardımcı programlarımızı kullanarak bir öğenin veya bileşenin yığın seviyesini hızlıca değiştirin. Bu belge, `z-index` ayarları ve örnek kullanımları hakkında bilgi sunar.
keywords: [z-index, yardımcı programlar, CSS, Bootstrap, kullanıcı deneyimi]
---

# Z İndeks

## Örnek

Elemanları üst üste yığmak için `z-index` yardımcı programlarını kullanın. **`static`** dışındaki bir **`position`** değeri gerektirir; bu, özel stillerle veya bizim `konum yardımcı programlarımızı` kullanarak ayarlanabilir.

:::tip
Bunlara "düşük seviyeli" `z-index` yardımcı programları diyoruz çünkü varsayılan değerleri **`-1`** ile **`3`** arasındadır ve bunları üst üste binen bileşenlerin yerleştirilmesinde kullanıyoruz. 
:::

:::info
Yüksek seviyeli `z-index` değerleri, modal ve ipucu gibi örtme bileşenleri için kullanılır.
:::


z-3
z-2
z-1
z-0
z-n1
## Örtmeler

Bootstrap örtme bileşenleri—**açılır menü, modal, offcanvas, popover, toast ve tooltip**—kullanıcı deneyimini sağlamak için kendi `z-index` değerlerine sahiptirler ve arayüzdeki rekabet eden "katmanlar" ile uyumlu bir deneyim sunarlar. 

Onları `z-index` yerleşim sayfasında` okuyun.

## CSS

### Sass haritaları

Kullanılabilir değerleri ve üretilen yardımcı programları değiştirmek için bu Sass haritasını özelleştirin.

### Sass yardımcı programları API'si

Pozisyon yardımcı programları, `scss/_utilities.scss` dosyasında yardımcı programlarımızın API'sinde ilan edilmiştir. `Yardımcı programlar API'sini nasıl kullanacağınızı öğrenin.`

