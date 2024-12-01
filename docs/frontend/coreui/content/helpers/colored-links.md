---
description: Bu belgede, hover durumlarına sahip renkli bağlantıların nasıl kullanılacağı açıklanmaktadır. Ayrıca, bu bağlantılar için önerilen stil kuralları ve örnekler sunulmaktadır.
keywords: [renkli bağlantılar, CSS, hover durumu, stil kuralları, kullanıcı arayüzü, yardımcı sınıflar]
---

`.link-*` sınıflarını bağlantıları renklendirmek için kullanabilirsiniz. `.text-*` sınıflarından` farklı olarak, bu sınıfların `:hover` ve `:focus` durumları vardır.



{{- range (index $.Site.Data "theme-colors") }}
{{ .name | title }} bağlantısı
{{- end -}}

:::info
Bazı bağlantı stilleri nispeten hafif bir ön plan rengine sahiptir ve yeterli kontrast sağlamak için yalnızca koyu bir arka planda kullanılmalıdır.
:::

> “Bu teknik, kullanıcıların bağlantı üzerinde durduğunda veya bağlantıyı seçtiğinde görsel geri bildirim almasını sağlar.”  
> — Dikkat Edilmesi Gereken.


Gelişmiş Bilgiler

### Renkli Bağlantıların Kullanımı

Renkli bağlantılar, kullanıcıların sayfada gezinirken dikkatinizi çekmek için etkili bir yöntemdir. Aşağıdaki noktaları göz önünde bulundurun:

- **Kontrast**: Her zaman yeterli kontrast sağlayın.
- **Erişilebilirlik**: Farklı kullanıcı grupları için okunabilirliği artırın.



---

### Örnek Kullanım

```html
<a href="#" class="link-primary">Örnek Bağlantı</a>
```

Bağlantıları renklendirmek için yukarıdaki kodu kullanabilirsiniz.