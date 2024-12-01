---
layout: docs
title: Etkileşimler
description: Kullanıcıların bir web sitesinin içerikleriyle nasıl etkileşimde bulunduğunu değiştiren yardımcı sınıflar. Bu içerikte, etkileşim sınıflarının kullanımı ve önemli bilgiler yer almaktadır.
keywords: [etkileşim, kullanıcı deneyimi, CoreUI, Bootstrap, araçlar API'si]
---

## Metin seçimi

Kullanıcının içerikle etkileşimde bulunduğunda, içeriğin nasıl seçileceğini değiştirir.


Bu paragraf, kullanıcı tarafından tıklandığında tamamen seçilecektir.
Bu paragrafın varsayılan seçim davranışı vardır.
Bu paragraf, kullanıcı tarafından tıklandığında seçilemeyecektir.
## Gösterici olaylar

CoreUI for Bootstrap, element etkileşimlerini önlemek veya eklemek için `.pe-none` ve `.pe-auto` sınıflarını sağlar.


> **Not:** `.pe-none` sınıfı (ve ayarladığı `pointer-events` CSS özelliği), yalnızca bir göstericiyle (fare, kalem, dokunma) etkileşimi engeller.  

`.pe-none` olan bağlantılar ve kontroller, varsayılan olarak klavye kullanıcıları için yine de odaklanabilir ve eyleme geçirilebilir. Klavye kullanıcıları için tamamen etkisiz hale getirilmelerini sağlamak için, yanı sıra `tabindex="-1"` (klavye odaklanmasını önlemek için) ve `aria-disabled="true"` (onların aslında devre dışı olduğunu yardımcı teknolojilere iletmek için) gibi ek öznitelikler eklemeniz gerekebilir. Ayrıca, bunların eyleme geçirilebilir olmasını tamamen engellemek için JavaScript kullanmanız gerekebilir.

Mümkünse, daha basit çözüm:

- Form kontrolleri için, `disabled` HTML özniteliğini ekleyin.
- Bağlantılar için, `href` özniteliğini kaldırarak onu etkileşimsiz bir kenar çubuğu veya yer tutucu bağlantı yapın.

---

## Sass

### Araçlar API'si

Etkileşim yardımcıları, `scss/_utilities.scss` dosyamızda araçlar API'sinde tanımlanır. `Araçlar API'sini nasıl kullanacağınızı öğrenin.`

