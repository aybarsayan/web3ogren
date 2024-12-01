---
description: CoreUI Bootstrap Admin Template içinde, önceden derlenmiş ve kaynak kodu çeşitlerimizi de içeren içerikleri keşfedin. Proje yapısı ve dosya düzeni hakkında bilgi edinin.
keywords: [CoreUI, Bootstrap, Admin Template, proje yapısı, kaynak kod, dosya düzeni]
---

## Proje yapısı

:::info
CoreUI Admin Template ile ilgili daha fazla bilgi edinmek için, resmi [CoreUI belgeleri](https://coreui.io/docs/) sayfasını ziyaret edebilirsiniz.
:::

İndirdikten sonra, sıkıştırılmış klasörü açtığınızda aşağıdakine benzer bir şey göreceksiniz:

```text
coreui-bootstrap-admin-template/
├── build/
├── dist/
├── src/
│   ├── assets/
│   │   ├── brand/
│   │   ├── favicon/
│   │   ├── icons/
│   │   ├── img/
│   ├── js/
│   ├── pug/
│   │   ├── _layout/
│   │   ├── _partial/
│   │   ├── base/
│   │   ├── buttons/
│   │   ├── icons/
│   │   ├── notifications/
│   │   ├── ...
│   │   ├── index.pug
│   │   └── ...
│   ├── scss/
│   ├── vendors/
│   └── views/
│       ├── base/
│       ├── buttons/
│       ├── css/
│       ├── icons/
│       ├── notifications/
│       ├── ...
│       ├── index.html
│       └── ...
└── package.json
```

:::tip
Bu yapının, bileşenlerin nasıl organize edildiğini ve özelleştirilebileceğini daha iyi anlamanıza yardımcı olacağını unutmayın.
:::

Bu, CoreUI Admin Templates'in en temel halidir. `scss/` ve `js/` klasörleri **CSS** ve **JavaScript** için kaynak kodudur. `dist/` klasörü, neredeyse her web projesinde hızlı bir şekilde kullanılmak üzere önceden derlenmiş dosyaları içerir. 

> Bu yapının esnekliği sayesinde, projelerinizi ihtiyaçlarınıza göre özelleştirebilir ve geliştirme sürecinizi hızlandırabilirsiniz.  
> — CoreUI Takımı

Bunun ötesinde, eklenen diğer dosyalar paketler, lisans bilgileri ve geliştirme için destek sağlar.