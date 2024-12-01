---
title: NPS
description: NPS anketi, kullanıcı geri bildirimlerini toplamak için önemli bir araçtır. Kullanıcıların deneyimlerini değerlendirmesine ve ek yorumlar sağlamasına olanak tanır.
keywords: [NPS, geri bildirim, kullanıcı deneyimi, Strapi, anket]
---

## Ne İşe Yarar

NPS anketi, Strapi hakkında kullanıcıların geri bildirimlerini almak için kullanıcılara gösterilir. 0 ile 10 arasında bir değerlendirme ölçeğine dayanır ve kullanıcıları ek yorumlar sağlamaya davet ederiz.

## Anketi Ne Zaman Gösteriyoruz?

NPS anketi yalnızca kayıt sırasında "Beni güncel tut" onay kutusunu seçen admin kullanıcılara gösterilir. Anket, 5 dakikalık bir etkinlikten sonra sunulur.

:::tip
Anketi uygun bir zamanda sunabilmek için belirtilen süre sınırlarına dikkat edilmelidir.
:::

Anket, aşağıdaki kurallara göre uygun kullanıcılara gösterilir:

- Bir kullanıcı ankete yanıt verirse, anket 90 gün içerisinde tekrar sunulacaktır.
- Bir kullanıcı, son yanıtından sonra ilk seferde ankete yanıt vermezse, anket 7 gün sonra tekrar sunulacaktır.
- Bir kullanıcı, son yanıtından sonra ikinci veya sonraki seferlerde ankete yanıt vermezse, anket 90 gün sonra tekrar sunulacaktır.

## Verilerin Gönderileceği Yer

Veriler şu uç noktaya gönderilir: `https://analytics.strapi.io/submit-nps`.

## Kancalar

### useNpsSurveySettings

Bu kanca, yardımcı eklentiden `usePersistentState` kancasını kullanır (daha fazla bilgi `burada` mevcuttur). Kullanıcıların "Beni güncel tut" onay kutusunu seçip seçmediğini belirlemek için kayıt sürecinde kullanılabilmesi için dışa aktarılmıştır.

:::info
Bu kanca, kullanıcı verilerini yönetmek için önemli bir rol oynamaktadır ve dikkatli bir şekilde kullanılmalıdır.
:::