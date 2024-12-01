---
description: Renk ve arka plan yardımcıları ile şık ve kontrast renkler oluşturun. Otomatik olarak belirlenen karşıt renkler sayesinde estetik ve okunabilir bir tasarım elde edin. 
keywords: [renk, arka plan, Sass, kontrast, yardımcılar, tasarım]
title: Renk ve arka plan
---

## Genel Bakış

Renk ve arka plan yardımcıları, `.text-*` yardımcıları` ve `.bg-*` yardımcıları` gücünü tek bir sınıfta birleştirir. Sass `color-contrast()` fonksiyonumuzu kullanarak, belirli bir `background-color` için otomatik olarak karşıt bir `color` belirliyoruz.

:::warning
**Dikkat!** Şu anda CSS yerel `color-contrast` fonksiyonu için destek yok, bu yüzden kendi Sass versiyonumuzu kullanıyoruz. Bu, tema renklerimizi CSS değişkenleri ile özelleştirmenin bu yardımcılar ile renk kontrast sorunlarına yol açabileceği anlamına geliyor.
:::



{{- range (index $.Site.Data "theme-colors") }}
{{ .name | title }} karşıt rengi ile
{{- end -}}

## Bileşenlerle Birlikte

Birleştirilmiş `.text-*` ve `.bg-*` sınıfları yerine bunları kullanın, örneğin `rozetler`:


Birincil
Bilgi
Ya da `kartlar`:

  Başlık
  
    Kart başlığına temel oluşturan ve kartın içeriğinin çoğunu oluşturmak için bazı hızlı örnek metinler.
  


  Başlık
  
    Kart başlığına temel oluşturan ve kartın içeriğinin çoğunu oluşturmak için bazı hızlı örnek metinler.
  

