---
layout: docs
title: CSS değişkenleri
description: Hızlı ve ileriye dönük tasarım ve geliştirme için Bootstrap'ın CSS özel özelliklerini CoreUI ile kullanın. Bu belgede CoreUI'nin sunduğu CSS değişkenleri ve bunların kullanımı hakkında bilgi bulabilirsiniz.
keywords: [CSS, değişkenler, CoreUI, Bootstrap, özel özellikler, tasarım, geliştirme]
---

CoreUI for Bootstrap, derlenmiş CSS'inde yaklaşık iki düzine [CSS özel özellikleri (değişkenler)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) içermektedir ve bileşen bazında daha iyi özelleştirme için yolda daha pek çok değişken bulunmaktadır. Bu değişkenler, tarayıcı denetleyicinizde, bir kod sandbox'ında veya genel prototip oluşturma ortamında çalışırken tema renklerimiz, kesme noktaları ve ana font yığınları gibi yaygın değerler için kolay erişim sağlar.

**Tüm özel özelliklerimiz, üçüncü taraf CSS ile çakışmaları önlemek için `cui-` ile başlar.**

## Kök değişkenler

CoreUI for Bootstrap'ın CSS'inin yüklendiği her yerde erişilebilen (not: `:root` gereklidir) değişkenler burada yer almaktadır. Bu değişkenler, `_root.scss` dosyamızda bulunmaktadır ve derlenmiş dist dosyalarımıza dahil edilmiştir.

```css
{{< root.inline >}}
{{- $css := readFile "dist/css/coreui.css" -}}
{{- $match := findRE `:root,\n\[data-coreui-theme=light\] {([^}]*)}` $css 1 -}}

{{- if (eq (len $match) 0) -}}
{{- errorf "No matches found for :root in %q!" $.Page.Path -}}
{{- end -}}

{{- index $match 0 -}}

{{< /root.inline >}}
```

### Karanlık mod

Bu değişkenler, yerleşik karanlık modumuz için kullanıma sunulmuştur.

```css
{{< root.inline >}}
{{- $css := readFile "dist/css/coreui.css" -}}
{{- $match := findRE `\[data-coreui-theme=dark\] {([^}]*)}` $css 1 -}}
{{- if (eq (len $match) 0) -}}
{{- errorf "No matches found for [data-coreui-theme=dark] in %q!" $.Page.Path -}}
{{- end -}}
{{- index $match 0 -}}
{{< /root.inline >}}
```

## Bileşen değişkenleri

CoreUI, çeşitli bileşenler için yerel değişkenler olarak özel özellikleri giderek daha fazla kullanmaktadır. Bu sayede derlenmiş CSS'mizi azaltıyor, stillerin iç içe tablo gibi yerlerde miras alınmasını engelliyoruz ve Sass derlemesinden sonra Bootstrap bileşenlerinin temel yeniden stillendirilmesini ve genişletilmesini sağlıyoruz.

:::tip
CSS değişkenlerinin nasıl kullanılacağına dair bazı `bilgiler için tablo belgelerimize` göz atın. 
:::

:::info
`Nav barlarımız da CSS değişkenlerini` kullanmaktadır (v4.2.6 itibarıyla). Ayrıca, `yeni isteğe bağlı CSS ızgarasında` ızgaralarımızda CSS değişkenlerini kullanıyoruz; gelecekte daha fazla bileşen kullanımı beklenmektedir.
:::

Mümkün olduğunda, CSS değişkenlerini temel bileşen düzeyinde atayacağız (örneğin, `.navbar` navbar ve alt bileşenleri için). Bu, nerede ve nasıl özelleştirme yapılacağını tahmin etmeyi azaltır ve ekibimizin gelecekteki güncellemelerde kolay değişiklikler yapabilmesini sağlar.

## Önek

Çoğu CSS değişkeni, kendi kod tabanınızla çakışmaları önlemek için bir önek kullanır. Bu önek, her CSS değişkeninde gereklidir olan `--`'ye ek olarak gelir.

Öneki `$prefix` Sass değişkeni üzerinden özelleştirin. Varsayılan olarak, `cui-` olarak ayarlanmıştır (sonundaki tire dahil).

## Örnekler

CSS değişkenleri, Sass değişkenlerine benzer bir esneklik sunar, ancak tarayıcıya sunulmadan önce derleme gerektirmez. Örneğin, burada sayfamızın fontunu ve bağlantı stillerini CSS değişkenleri ile sıfırlıyoruz.

```css
body {
  font: 1rem/1.5 var(--cui-font-sans-serif);
}
a {
  color: var(--cui-blue);
}
```

## Odak değişkenleri

Bootstrap, belirli bileşenler ve öğelere isteğe bağlı olarak eklenebilen bir kombinasyon ile özel `:focus` stilleri sağlar. Henüz tüm `:focus` stillerini küresel olarak geçersiz kılmıyoruz.

Sass'ımızda, derlemeden önce özelleştirilebilen varsayılan değerler ayarlıyoruz.

Bu değişkenler daha sonra, gerçek zamanlı olarak özelleştirilebilen `:root` düzeyinde CSS değişkenlerine atanmaktadır; bu değişkenlerin `x` ve `y` kaydırma seçenekleri de (varsayılan olarak geri dönüş değeri `0` olan) bulunmaktadır.

## Izgara kesme noktaları

Izgara kesme noktalarımızı CSS değişkenleri olarak dahil etsek de (`xs` hariç), **CSS değişkenleri medya sorgularında çalışmamaktadır**. Bu, değişkenlerle ilgili CSS spesifikasyonunda yer alan bir tasarımdır, ancak `env()` değişkenleri ile desteklenmesi ile birlikte önümüzdeki yıllarda değişebilir. 

:::warning
Bazı yararlı bağlantılar için [bu Stack Overflow yanıtına](https://stackoverflow.com/a/47212942) göz atın. 
:::

Bu arada, bu değişkenleri diğer CSS durumlarında ve JavaScript'inizde kullanabilirsiniz.