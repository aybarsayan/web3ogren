---
description: "Nesne sığdırma, içeriğin boyutlarını ayarlamak ve farklı boyutlara uyum sağlamak için kullanılan CSS özellikleri ve teknikleri hakkında bilgi sunmaktadır."
keywords: [Nesne sığdırma, CSS, responsive design, object-fit, yardımcı sınıflar]
---

# Nesne Sığdırma

## Nasıl çalışır

[`object-fit` özelliğinin](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) değerini yanıt veren `object-fit` yardımcı sınıflarımızla değiştirin. Bu özellik, içeriğin çeşitli şekillerde ana konteyneri doldurmasını sağlar; örneğin, en-boy oranını koruma veya mümkün olduğunca fazla alan kaplama gibi.

:::tip
`object-fit` yardımcı sınıflarının kullanımı, içeriği görsel olarak daha çekici hale getirir ve aynı zamanda responsive tasarım için önemli bir araçtır.
:::

`object-fit` için değer sınıfları `.object-fit-{değer}` formatını kullanarak adlandırılır. Aşağıdaki değerlerden birini seçin:

- `contain`
- `cover`
- `fill`
- `scale` (küçültme için)
- `none`

## Örnekler

`object-fit-{değer}` sınıfını [değiştirilmiş öğeye](https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element) ekleyin:







## Yanıt veren

Her `object-fit` değeri için yanıt veren çeşitler de mevcuttur ve bu çeşitler `.object-fit-{breakpoint}-{değer}` formatını kullanır. Aşağıdaki kesme kısaltmalarını kullanabilirsiniz: `sm`, `md`, `lg`, `xl`, ve `xxl`. Sınıflar, ihtiyaç duyduğunuz çeşitli efektler için birleştirilebilir.

:::info
Yanıt veren sınıfların kullanımı, farklı ekran boyutlarında daha iyi bir kullanıcı deneyimi sağlar.
:::







## Video

`.object-fit-{değer}` ve yanıt veren `.object-fit-{breakpoint}-{değer}` yardımcı programları `` öğelerinde de çalışır.

```html
<video src="..." class="object-fit-contain" autoplay></video>
<video src="..." class="object-fit-cover" autoplay></video>
<video src="..." class="object-fit-fill" autoplay></video>
<video src="..." class="object-fit-scale" autoplay></video>
<video src="..." class="object-fit-none" autoplay></video>
```

## CSS

### Sass yardımcı programları API'si

Nesne sığdırma yardımcı programları `scss/_utilities.scss` dosyamızdaki yardımcı programlar API'sinde tanımlanmıştır. `Yardımcı programlar API'sini nasıl kullanacağınızı öğrenin.`

:::note
Sass ile çalışma, projelerinizi daha modüler hale getirir ve kod tekrarını azaltır.
:::

