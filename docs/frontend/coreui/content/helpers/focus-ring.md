---
layout: docs
title: Odak halkası
description: Elemanlara ve bileşenlere özel odak halkası stillerini eklemenizi ve değiştirmenizi sağlayan yardımcı sınıflar. Bu doküman, odak halkası stilini nasıl özelleştireceğinizi ve kullanacağınız CSS ve Sass değişkenlerini detaylı bir şekilde açıklar.
keywords: [odak halkası, CSS değişkenleri, Sass değişkenleri, yardımcı sınıflar, stil özelleştirme]
---

`.focus-ring` yardımcı sınıfı `:focus` üzerindeki varsayılan `outline`'ı kaldırır ve yerine daha geniş bir şekilde özelleştirilebilen bir `box-shadow` ekler. Yeni gölge, `:root` seviyesinden miras alınan bir dizi CSS değişkeninden oluşur ve herhangi bir eleman veya bileşen için değiştirilebilir.

## Örnek

Aşağıdaki bağlantıya tıklayarak odak halkasının etkisini görebilir veya aşağıdaki örneğe gidip ardından Tab tuşuna basabilirsiniz.

  Özel odak halkası

---

## Özelleştirme

CSS değişkenlerimiz, Sass değişkenlerimiz, yardımcı sınıflarımız veya özel stillerimiz ile odak halkasının stilini değiştirin.

### CSS değişkenleri

Varsayılan görünümü değiştirmek için gerekli olduğu kadar `--cui-focus-ring-*` CSS değişkenlerini değiştirin.

  Yeşil odak halkası

:::tip
`.focus-ring` stilleri, herhangi bir üst elemanda geçersiz kılınabilen global CSS değişkenleri aracılığıyla ayarlanır. Bu değişkenler, Sass değişkenlerinin karşıtlarından türetilmiştir.
:::

Varsayılan olarak, `--cui-focus-ring-x`, `--cui-focus-ring-y` veya `--cui-focus-ring-blur` mevcut değildir, ancak başlangıç `0` değerlerine geri dönüş sağlayan CSS değişkenleri sunuyoruz. Varsayılan görünümü değiştirmek için bunları değiştirin.

  Bulanık ofset odak halkası

### Sass değişkenleri

Projenizde odak halkası stillerinin tüm kullanımını değiştirmek için odak halkası Sass değişkenlerini özelleştirin.

### Sass yardımcıları API'si

`.focus-ring`'e ek olarak, yardımcı sınıf varsayılanlarını değiştirmek için birkaç `.focus-ring-*` yardımcı sınıfına sahibiz. Rengini `tema renklerimizden` herhangi biriyle değiştirin. Mevcut renk modu desteği göz önüne alındığında, açık ve koyu varyantların tüm arka plan renklerinde görünmeyeceğini unutmayın.

:::info
Odak halkası yardımcıları, `scss/_utilities.scss` dosyasında yardımcılar API'mizde tanımlanmıştır. `Yardımcılar API'sini nasıl kullanacağınızı öğrenin.`
:::



{{- range (index $.Site.Data "theme-colors") }}
{{ title .name }} odak
{{- end -}}

