---
description: Bootstrap ekmek kırıntısı navigasyon bileşeni, kullanıcıların mevcut konumunu gösterir ve ayrıcıları otomatik olarak ekler. Bu içerik, breadcrumb kullanımını ve özelleştirme yöntemlerini detaylı bir şekilde açıklar.
keywords: [breadcrumb, Bootstrap, navigasyon, erişilebilirlik, CSS değişkenleri, özelleştirme, Sass]
---

## Örnek

Ekmek kırıntısı navigasyonu, kullanıcının gezindiği her önceki sayfaya geri bağlantılar sağlar ve bir web sitesi veya uygulamadaki mevcut konumu gösterir. Ayırıcı eklemenize gerek yoktur, çünkü CSS aracılığıyla [`::before`](https://developer.mozilla.org/en-US/docs/Web/CSS/::before) ve [`content`](https://developer.mozilla.org/en-US/docs/Web/CSS/content) ile otomatik olarak eklenir.

  
    Ana Sayfa
  



  
    Ana Sayfa
    Kütüphane
  



  
    Ana Sayfa
    Kütüphane
    Veri
  

---

## Ayırıcılar

Ayırıcılar CSS aracılığıyla otomatik olarak eklenir ve [`::before`](https://developer.mozilla.org/en-US/docs/Web/CSS/::before) ve [`content`](https://developer.mozilla.org/en-US/docs/Web/CSS/content) kullanılarak değiştirilebilir. Lokal bir CSS özel değişkeni `--cui-breadcrumb-divider` veya `$breadcrumb-divider` Sass değişkeni aracılığıyla değiştirebilirsiniz — RTL karşılığı için gerekli olması durumunda `$breadcrumb-divider-flipped`. Biz varsayılan olarak Sass değişkenimizi kullanıyoruz, bu da özel değişken ile yedek olarak ayarlanmıştır. Bu sayede, CSS'yi yeniden derlemeden istediğiniz zaman geçersiz kılabileceğiniz bir küresel ayırıcı elde edersiniz.


';" aria-label="breadcrumb">
  
    Ana Sayfa
    Kütüphane
  

---

Sass ile değiştirirken, bir dize etrafında tırnakları oluşturmak için [quote](https://sass-lang.com/documentation/modules/string#quote) fonksiyonu gereklidir. Örneğin, `>` ayırıcı olarak kullanıldığında şunu kullanabilirsiniz:

```scss
$breadcrumb-divider: quote(">");
```

Ayrıca bir **gömülü SVG simgesi** kullanmak da mümkündür. Bunu CSS özel değişkenimiz aracılığıyla uygulayın veya Sass değişkenini kullanın.


### Gömülü SVG Kullanımı

SVG'yi veri URI olarak satır içi kullanmak, bazı karakterleri URL ile kaçırmayı gerektirir, özellikle `` ve `#`. Bu nedenle, `$breadcrumb-divider` değişkeni bizim `escape-svg()` Sass fonksiyonumuz` aracılığıyla geçilir. CSS özel değişkenini kullanırken SVG'nizi kendiniz URL ile kaçırmanız gerekecek. [Kevin Weber'in CodePen'deki açıklamalarını](https://codepen.io/kevinweber/pen/dXWoRw ) kaçırmanız gerekenler hakkında ayrıntılı bilgi için okuyun.
  
    Ana Sayfa
    Kütüphane
  

```scss
$breadcrumb-divider: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><path d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='#{$breadcrumb-divider-color}'/></svg>");
```

Ayırıcıyı kaldırmak için `--cui-breadcrumb-divider: '';` ayarını yapabilir (CSS özel değişkenlerinde boş dizeler bir değer olarak sayılır) veya Sass değişkenini `$breadcrumb-divider: none;` olarak ayarlayabilirsiniz.

  
    Ana Sayfa
    Kütüphane
  

```scss
$breadcrumb-divider: none;
```

---

## Erişilebilirlik

Ekmek kırıntıları navigasyon sağladığından, `` öğesine uygulanan navigasyon türünü açıklamak için `aria-label="breadcrumb"` gibi anlamlı bir etiket eklemek faydalıdır. Ayrıca, mevcut sayfayı temsil ettiğini göstermek için setin son öğesine `aria-current="page"` eklemelisiniz.

Daha fazla bilgi için [ARIA Yazma Uygulamaları Kılavuzu ekmek kırıntısı modeli](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/) sayfasına bakın.

---

## Özelleştirme

### CSS değişkenleri

Ekmek kırıntıları, gerçek zamanlı özelleştirmeyi artırmak için `.breadcrumb` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenleri için değerler Sass aracılığıyla ayarlanır, bu nedenle Sass özelleştirmesi de desteklenir.

### SASS değişkenleri

