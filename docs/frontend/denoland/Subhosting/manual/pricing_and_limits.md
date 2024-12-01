---
title: Fiyatlandırma ve Sınırlar
description: Bu bölüm, dağıtım boyutları, sıklıkları ve CPU süreleri gibi önemli sınırlamaları açıklamaktadır. Kullanıcılara bu sınırlamaların nasıl çalıştığını anlamalarına yardımcı olacak bilgiler sunulmaktadır.
keywords: [dağıtım boyutu, dağıtım sıklığı, CPU süresi, bellek sınırlamaları, olay döngüsü]
---

## Dağıtım Boyutu

Dağıtımlar, her dağıtımda toplamda tüm kaynak kodu ve varlıklar için **1GB'dan daha az** olmalıdır.

---

## Dağıtım Sıklığı

Bir alt barındırma kullanıcısının saatte yapabileceği maksimum dağıtım sayısı ya **60 (ücretsiz katmanda)** ya da **300 (yapımcı katmanında)** olarak belirlenmiştir. Daha yüksek limitler, kurumsal plandaki organizasyonlar için mevcuttur.

:::info
Kurumsal kullanıcılar için özel planlar ile daha yüksek dağıtım limitleri bulunmaktadır.
:::

---

## İstek Başına CPU Süresi

- **50ms** veya **200ms**, katmana bağlı olarak.
- İstek başına CPU süresi, birçok isteğin ortalaması alınarak sınırlıdır. Kesinlikle isteğe dayalı olarak uygulanmaz.
- Bir dağıtımın I/O beklediği süreyi (örneğin, fetch() isteği yaparken uzak sunucuyu beklerken) içermez.

> "İstek başına CPU süresi, toplam sürelerin ortalaması alınarak hesaplanır."  
> — Belge Tasarımı Ekibi

---

## Olay Döngüsünü Engelleme

Programlar, olay döngüsünü **1 saniyeden fazla** engellememelidir.

:::warning
Eğer olay döngüsünü uzun süre engellerseniz, uygulamanızın performansı olumsuz etkilenebilir.
:::

---

## Mevcut Bellek

Maksimum **512MB** bellek mevcuttur. 


Ek Bilgiler
Kullanıcılar, mevcut bellek sınırlarını aşmamaya dikkat etmelidir. Bellek aşımı, uygulamanın beklenmedik bir şekilde durmasına yol açabilir.
