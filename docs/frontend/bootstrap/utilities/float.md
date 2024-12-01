---
description: Bu içerik, bir öğenin yan kaldırma (float) özelliklerini kullanarak nasıl geçiş yapacağını ve bunun duyarlı varyasyonlarını açıklamaktadır. Yan kaldırma yardımcı sınıflarının kullanımı ve detayları hakkında bilgi verir.
keywords: [float, yan kaldırma, responsive, CSS özellikleri, yardımcı sınıflar]
---

# Float

## Genel Bakış

Bu yardımcı sınıflar, mevcut görünüm boyutuna bağlı olarak bir öğeyi sola veya sağa kaldırır ya da kaldırmayı devre dışı bırakır ve [CSS `float` özelliğini](https://developer.mozilla.org/en-US/docs/Web/CSS/float) kullanır. Belirli sorunların önüne geçmek için `!important` kullanılır. Bunlar, ızgara sistemimizle aynı görünüm kırılma noktalarını kullanır. Lütfen yan kaldırma yardımcılarının esnek (flex) öğeler üzerinde etkisi olmadığını unutmayın.

:::tip
Yan kaldırma sınıflarını kullanarak öğelerinizi daha etkili bir şekilde konumlandırabilirsiniz.
:::


Tüm görünüm boyutlarında başlangıçta yan kaldırma
Tüm görünüm boyutlarında sonunda yan kaldırma
Tüm görünüm boyutlarında yan kaldırma yok
Bir üst öğeye `clearfix yardımcı aracını` kullanarak yan kaldırmaları temizleyebilirsiniz.

---

## Duyarlı

Her `float` değeri için duyarlı varyasyonlar da mevcuttur.

:::info
Duyarlı varyasyonlar, farklı görünüm boyutlarına uyum sağlamak için tasarlanmıştır.
:::


SM (küçük) boyutlarına veya daha geniş görünüm alanlarında sonunda yan kaldırma
MD (orta) boyutlarına veya daha geniş görünüm alanlarında sonunda yan kaldırma
LG (büyük) boyutlarına veya daha geniş görünüm alanlarında sonunda yan kaldırma
XL (çok büyük) boyutlarına veya daha geniş görünüm alanlarında sonunda yan kaldırma
XXL (çok çok büyük) boyutlarına veya daha geniş görünüm alanlarında sonunda yan kaldırma
İşte tüm destek sınıfları:



{{- range $.Site.Data.breakpoints }}
- `.float{{ .abbr }}-start`
- `.float{{ .abbr }}-end`
- `.float{{ .abbr }}-none`
{{- end -}}

---

## Sass

### Araçlar API'si

Yan kaldırma yardımcıları, `scss/_utilities.scss` dosyamızda bulunan yardımcılar API'sinde tanımlıdır. `Araçlar API'sini nasıl kullanacağınızı öğrenin.`

:::warning
Yan kaldırma özelliklerini kullanırken, esnek öğelerin davranışının farklı olabileceğini unutmayın.
:::

