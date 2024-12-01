---
description: Bootstrap İkonları veya diğer simgeler ile stilize edilmiş köprüler hızlı bir şekilde oluşturun. Bu doküman, ikon bağlantılarının nasıl oluşturulacağına ve özelleştirileceğine dair detaylı bir rehber sunmaktadır.
keywords: [ikon, bağlantı, Bootstrap, stil, CSS, özelleştirme]
---

İkon bağlantısı yardımcı bileşeni varsayılan bağlantı stillerimizi değiştirerek, görünümünü geliştirmekte ve simge ve metin eşleştirmelerini hızlı bir şekilde hizalamaktadır. Hizalama, çevrimiçi flexbox stilleri ve varsayılan bir `gap` değeri ile ayarlanır. **Alt çizgiyi özel bir kaydırma ve renk ile stilize ediyoruz.** Simgeler, ilişkili metnin `font-size` değerine en iyi şekilde uyum sağlamak için otomatik olarak `1em` boyutunda ayarlanır.

:::info
İkon bağlantıları [Bootstrap İkonlarının](https://icons.getbootstrap.com) kullanıldığını varsayar, ancak istediğiniz herhangi bir simge veya resmi de kullanabilirsiniz.
:::


Simgeler tamamen dekoratif olduğunda, yardımcı teknolojilerden gizlenmeleri için `aria-hidden="true"` kullanılması gerekir, bunu örneklerimizde yaptığımız gibi. Anlam taşıyan simgeler için, uygun bir metin alternatifi sağlamak amacıyla `role="img"` ve uygun bir `aria-label="..."` ekleyin.
## Örnek

Standart bir `` öğesini alın, `.icon-link` sınıfını ekleyin ve simgeyi bağlantı metninizin soluna veya sağına yerleştirin. **Simge otomatik olarak boyutlandırılır, yerleştirilir ve renklendirilir.**

  
  İkon bağlantısı

  İkon bağlantısı
  

## Üzerine Geldiğinde Stil

Simgeleri üzerine geldiğinde sağa kaydırmak için `.icon-link-hover` ekleyin.

  İkon bağlantısı
  

## Özelleştir

Bir ikon bağlantısının stilini, link CSS değişkenlerimizle, Sass değişkenleriyle, yardımcı işlevlerle veya özel stillerle değiştirebilirsiniz.

### CSS Değişkenleri

**Varsayılan görünümü değiştirmek için `--cui-link-*` ve `--cui-icon-link-*` CSS değişkenlerini gerektiği gibi değiştirin.**

Üzerine gelindiğinde `transform` değerini değiştirmek için `--cui-icon-link-transform` CSS değişkenini geçersiz kılın:

  
  İkon bağlantısı

**Rengi özelleştirmek için `--cui-link-*` CSS değişkenini geçersiz kılın:**

  İkon bağlantısı
  

### Sass Değişkenleri

Bootstrap destekli projenizdeki tüm ikon bağlantısı stillerini değiştirmek için ikon bağlantısı Sass değişkenlerini özelleştirin.

### Sass Yardımcı İşlevleri API'si

Alt çizgi rengi ve kaydırmasını değiştirmek için `link yardımcı işlevlerimizden` herhangi birini kullanarak ikon bağlantılarını değiştirebilirsiniz.

  İkon bağlantısı
  

