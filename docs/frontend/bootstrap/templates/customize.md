---
description: CoreUI Bootstrap Şablonlarını Sass ile tema oluşturmayı, özelleştirmeyi ve genişletmeyi öğrenin, birçok global seçenek ile birlikte.
keywords: [CoreUI, Bootstrap, Sass, tema oluşturma, özelleştirme]
---

## Genel Bakış

CoreUI'yi Bootstrap için özelleştirmenin birçok yolu vardır. En iyi yolunuz, projenize, yapı araçlarınızın karmaşıklığına, kullandığınız CoreUI sürümüne, tarayıcı desteğine ve daha fazlasına bağlı olabilir.

Bizim iki tercih ettiğimiz yöntem:

1. Kaynak dosyalarımızı genişletebilirsiniz.
2. CoreUI’nin stillerini geçersiz kılabilirsiniz.

---

## Dosya yapısı

Değişkenlerden, haritalardan, mixin'lerden ve fonksiyonlardan yararlanmak için kaynak Sass dosyalarımızı kullanarak proje oluşturmanızı hızlandırın ve özelleştirin.

:::tip
Mümkün olduğunda, CoreUI'nin ana dosyalarını değiştirmekten kaçının. Sass için bu, CoreUI for Bootstrap'i içe aktaran kendi stil sayfanızı oluşturduğunuz anlamına gelir, böylece onu değiştirebilir ve genişletebilirsiniz.
:::

Eğer npm gibi bir paket yöneticisi kullanıyorsanız, aşağıdaki gibi bir dosya yapısına sahip olacaksınız:

```text
your-project/
├── ...
├── node_modules/
│   └── @coreui/coreui
│       ├── js
│       └── scss
├── src
│   └── scss
│       ├── _custom.scss
│       ├── ...
│       ├── _variables.scss
│       └── ...
└── ...
```

---

## Değişken varsayılanları

CoreUI for Bootstrap'taki her Sass değişkeni, CoreUI'nin kaynak kodunu değiştirmeden kendi Sass'ınızda değişkenin varsayılan değerini geçersiz kılmanıza olanak tanıyan `!default` bayrağını içerir. Gerekirse değişkenleri kopyalayın ve yapıştırın, değerlerini değiştirin ve `!default` bayrağını kaldırın. Eğer bir değişken zaten atanmışsa, o zaman CoreUI'deki varsayılan değerler tarafından tekrar atanmayacaktır.

> CoreUI'nin değişkenlerin tam listesini `node_modules/@coreui/coreui/scss/_variables.scss` konumunda bulabilirsiniz. Bazı değişkenler `null` olarak ayarlanmıştır, bu değişkenler yapılandırmanızda geçersiz kılınmadıkça özelliği çıkartmaz. Ayrıca belirli bir bileşen değişkenleri listesini **Özelleştirme** bölümünde bulabilirsiniz, örn. `Uyarılar - Özelleştirme`

npm aracılığıyla CoreUI for Bootstrap'i içe aktarırken ve derlerken `` için `background-color` ve `color` değişen bir örnek:

```scss
// _variables.scss

// Varsayılan değişken geçersiz kılmaları
$body-bg: #000;
$body-color: #111;
```

---

## Özel stiller ve geçersiz kılmalar

`custom.scss` dosyanızda, CoreUI'nin bileşenleri için özel kod veya kendi stillerinizi ekleyebilirsiniz.

```scss
// _custom.scss

// Ek özel kod buraya
.custom-component {
  border: 2px solid #222;
}
```