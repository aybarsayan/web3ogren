---
layout: docs
title: Rozetler
description: Bootstrap rozetleri, küçük sayma ve etiketleme bileşenleridir. Bu belgede rozetlerin kullanımı ve stil değiştirme yöntemleri üzerinde durulmaktadır.
keywords: [Bootstrap, rozetler, etiketleme, sayma, bileşenler, CSS, SASS]
---

## Örnekler

Bootstrap rozetleri, bağlı nesnenin boyutuna uyum sağlamak için göreceli yazı büyüklüğü ve `em` birimleri kullanarak ölçeklenir.

### Başlıklar


Örnek başlık Yeni
Örnek başlık Yeni
Örnek başlık Yeni
Örnek başlık Yeni
Örnek başlık Yeni
Örnek başlık Yeni
### Düğmeler

Rozetler, bir bağlantının veya düğmenin parçası olarak bir sayıcı sağlamak için kullanılabilir.

  Bildirimler 4

:::info
Ekran okuyucuları ve ilgili yardımcı teknolojiler kullanan kullanıcılar için rozetlerin karmaşık olabileceğini unutmayın. Bağlam net değilse, görsel olarak gizlenmiş ek metin parçası ile ek bağlam sağlamayı düşünün.
:::

### Pozisyonlu

Bir `.badge`'i değiştirmek ve bir bağlantının veya düğmenin köşesine yerleştirmek için yardımcı programlar kullanın.

  Gelen kutusu
  
    99+
    okunmamış mesajlar
  

Sayaç olmadan daha genel bir gösterge için `.badge` sınıfını birkaç başka yardımcı ile değiştirebilirsiniz.

  Profil
  
    Yeni bildirimler
  

## Bağlamsal değişiklikler

Aşağıda belirtilen sınıflardan herhangi birini ekleyerek bir rozetin sunumunu değiştirebilirsiniz. **Bootstrap'ın varsayılan** `.bg-light`'ını kullanırken, düzgün stil vermek için `.text-dark` gibi bir metin rengi yardımcı programına ihtiyaç duyabileceğinizi unutmayın. Bunun nedeni, arka plan yardımcılarının yalnızca `background-color` ayarlamasıdır.



{{- range (index $.Site.Data "theme-colors") }}
{{ .name | title }}{{- end -}}



## Pil rozetleri

Rozetlerin yuvarlak hale gelmesi için `.rounded-pill` modifikatör sınıfını uygulayın.



{{- range (index $.Site.Data "theme-colors") }}
{{ .name | title }}{{ - end - }}

## Özelleştirme

### CSS değişkenleri

Rozetler, geliştirilmiş gerçek zamanlı özelleştirme için `.badge` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenleri için değerler Sass aracılığıyla ayarlanır, bu nedenle Sass özelleştirmesi hala desteklenmektedir.

### SASS değişkenleri

