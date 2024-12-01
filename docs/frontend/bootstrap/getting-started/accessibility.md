---
description: Erişilebilir içerik oluşturma için CoreUI için Bootstrap özellikleri ve sınırlamaları hakkında kısa bir genel bakış. Geliştiricilerin erişilebilir web siteleri ve uygulamaları oluşturmasına yardımcı olan en iyi uygulamaları içermektedir.
keywords: [Erişilebilirlik, CoreUI, Bootstrap, WCAG, WAI-ARIA, renk kontrastı, kullanıcı deneyimi]
layout: docs
title: Erişilebilirlik
group: getting-started
toc: true
---

CoreUI için Bootstrap, geliştiricilerin görsel olarak çekici, işlevsel olarak zengin ve kutudan çıkar çıkmaz erişilebilir web siteleri ve uygulamalar oluşturmalarını sağlayan, önceden hazırlanmış stiller, düzen araçları ve etkileşimli bileşenler içeren kullanımı kolay bir çerçeve sunar.

## Genel Bakış ve Sınırlamalar

Bootstrap ile oluşturulan herhangi bir projenin genel erişilebilirliği, büyük ölçüde yazarın işaretlemesine, ek stillere ve dahil ettikleri betiklere bağlıdır. Ancak, bunların doğru bir şekilde uygulanması durumunda, WCAG 2.2 (A/AA/AAA), [Section 508](https://www.section508.gov/) ve benzeri erişilebilirlik standartları ve gereksinimlerini karşılayan web siteleri ve uygulamalar oluşturmak tamamen mümkündür.

> **Anahtar Nokta:** CoreUI ile Bootstrap kullanarak erişilebilir web siteleri oluşturmak mümkündür. 

### Yapısal İşaretleme

CoreUI için Bootstrap stil ve düzeni geniş bir işaretleme yapısına uygulanabilir. Bu dokümantasyon, geliştiricilere CoreUI için Bootstrap'ın kullanımıyla doğru semantik işaretlemeyi göstermeyi ve potansiyel erişilebilirlik endişelerinin nasıl ele alınabileceğini anlatan en iyi uygulama örnekleri sunmayı hedeflemektedir.

:::tip
**Öneri:** Semantik işaretlemeyi doğru kullanmak, erişilebilirliği büyük ölçüde artırır.
:::

### Etkileşimli Bileşenler

CoreUI için Bootstrap etkileşimli bileşenler—modala diyaloglar, açılır menüler ve özel ipuçları gibi—dokunmatik, fare ve klavye kullanıcıları için çalışacak şekilde tasarlanmıştır. İlgili [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) rolleri ve özelliklerinin kullanımı sayesinde, bu bileşenlerin yardımcı teknolojiler (örneğin ekran okuyucular) kullanılarak anlaşılır ve işletilebilir olması sağlanmalıdır.

> **Dikkat:** Yazarların, bileşenlerinin doğasını daha iyi yansıtmak için ek ARIA rolleri ve özellikleri kullanmaları gerekebilir. 
— CoreUI Belgeleri

### Renk Kontrasti

Bootstrap'ın varsayılan paletini oluşturan bazı renk kombinasyonları—buton varyasyonları, uyarı varyasyonları, form doğrulama göstergeleri gibi şeyler için çerçeve boyunca kullanılan—yetersiz renk kontrastına (önerilen [WCAG 2.2 metin renk kontrast oranı 4.5:1](https://www.w3.org/TR/WCAG/#contrast-minimum) ve [WCAG 2.2 metin dışı renk kontrast oranı 3:1](https://www.w3.org/TR/WCAG/#non-text-contrast)) neden olabilir, özellikle açık bir arka plan üzerinde kullanıldığında. Yazarların, renklerini özel kullanımlarını test etmeleri ve gerektiğinde bu varsayılan renkleri manuel olarak değiştirip genişletmeleri teşvik edilmektedir.

### Görsel Olarak Gizli İçerik

Görsel olarak gizlenmesi gereken, ancak ekran okuyucular gibi yardımcı teknolojilere erişilebilir olması gereken içerik, `.visually-hidden` sınıfı ile stilize edilebilir. Bu, ek görsel bilgilerin veya ipuçlarının (renk ile ifade edilen anlam gibi) görsel olmayan kullanıcılara da iletilmesi gereken durumlarda faydalı olabilir.

```html
<p class="text-danger">
  <span class="visually-hidden">Tehlike: </span>
  Bu işlem geri alındı
</p>
```

> **Not:** Görsel olarak gizli etkileşimli kontroller için, geleneksel "atla" bağlantıları gibi, `.visually-hidden-focusable` sınıfını kullanın. Bu, kontrolün odaklandığında görünür olmasını sağlayacaktır (görme engelli klavye kullanıcıları için). **Dikkat edin, geçmiş sürümlerdeki karşılık gelen `.sr-only` ve `.sr-only-focusable` sınıflarına kıyasla, CoreUI'nın `.visually-hidden-focusable` sınıfı bağımsız bir sınıftır ve `.visually-hidden` sınıfı ile birlikte kullanılmamalıdır.**

```html
<a class="visually-hidden-focusable" href="#content">Ana içeriğe atla</a>
```

### Azaltılmış Hareket

CoreUI için Bootstrap, [`prefers-reduced-motion`](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-motion) medya özelliğini destekler. Kullanıcının azaltılmış hareket tercihlerini belirtebildiği tarayıcılarda/ortamlarda, CoreUI için Bootstrap'taki çoğu CSS geçiş efekti (örneğin, bir modaldiyalog açıldığında veya kapandığında ya da kayan animasyonlu karusellerde) devre dışı bırakılacak ve anlamlı animasyonlar (örneğin, dönerler) yavaşlatılacaktır.

:::info
**Ek Bilgi:** `prefers-reduced-motion`'u destekleyen tarayıcılarda ve kullanıcının azaltılmış hareketi tercih etmeyi açıkça belirtmediği durumlarda (yani `prefers-reduced-motion: no-preference` durumunda), CoreUI için Bootstrap, `scroll-behavior` özelliği kullanarak akıcı kaydırmayı etkinleştirir.
:::

## Ek Kaynaklar

- [Web İçeriği Erişilebilirlik Kılavuzları (WCAG) 2.2](https://www.w3.org/TR/WCAG/)
- [A11Y Projesi](https://www.a11yproject.com/)
- [MDN erişilebilirlik belgeleri](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Tenon.io Erişilebilirlik Kontrol Aracı](https://tenon.io/)
- [Renk Kontrast Analizörü (CCA)](https://developer.paciellogroup.com/resources/contrastanalyser/)
- ["HTML Kod Sniffer" yer imini erişilebilirlik sorunlarını tespit etmek için](https://github.com/squizlabs/HTML_CodeSniffer)
- [Microsoft Erişilebilirlik Görünüm İçi](https://accessibilityinsights.io/)
- [Deque Axe test araçları](https://www.deque.com/axe/)