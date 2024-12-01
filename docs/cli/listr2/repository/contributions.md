---
title: Katkılar
description: Bu belge, depo katkılarını kabul etme süreçlerini ve katılımcılara yönelik kılavuzları içermektedir. Katkılar, hatalar, özellik talepleri ve belgeler dahil pek çok alanı kapsamaktadır.
keywords: [katkılar, hata raporu, özellik talepleri, dokümantasyon, yazılım geliştirme]
order: 10
---



Bu depo için katkılar çok welcome. Depo, nasıl çalıştığı açısından oldukça kararlıdır ancak sürekli olarak gelişen bir ortamda her zaman bir iyileştirmeye ihtiyaç duyar.



## Kabul Edilen Katkılar

Hatalar, özellik talepleri ve testler, örnekler, dokümantasyon, `JSDocs` gibi depo bileşenlerini destekleme konularında katkılar takdirle karşılanacaktır.

:::tip
Hataları bildirmek ve özellik talep etmek için her zaman yeni bir sorun açabilirsiniz. Ayrıca, belgelendirmede eksiklik nedeniyle bir şey yaparken başarısız olduğunuzda kullanım için bir sorun bile açabilirsiniz.
:::

**Lütfen katkınız olan özellik/hata düzeltmesini uygulamayı düşünün ve deneyin, onların çoğu hemen kabul edilmekte ve mümkün olan en kısa sürede yayınlanmaktadır.**

## Katkıları Bekliyoruz

Bu bölüm, aşağıdaki özelliklerin veya hata düzeltmelerinin herhangi bir nedenle engellendiğini ve her türlü katkıdan memnuniyet duyulacağını ifade etmektedir.

### Renderer Güncellemesi

Kısmi güncellemeler yapabilen başka bir kütüphane için mevcut güncelleyici [`log-update`](https://www.npmjs.com/package/log-update) ile değiştirilmesi.

#### Mevcut Uygulamadaki Problemler

- Yeterince uzun görev listeleri için, `ListrEventType.SHOULD_REFRESH_RENDER` tarafından başlatılan bir yeniden çizmenin yapılması gerektiğini gösteren ana görevin güncellenmesi nedeniyle tüm ekranın güncellenmesi sebebiyle yanıp sönme efekti görülmektedir.
- Çoğu sorun, _Listr_ 'ın terminal çıktısını bozması veya kırması ile ilgilidir. Bu bazen istenmeyen davranışlara neden olur.
- Gömülü olanın çalışmadığı için, varsayılan render'da satırları tekrar sarmak ve kısaltmak için çok fazla ek yük getirmektedir.

#### Ne Yapıldı?

[`stdout-update`](https://www.npmjs.com/package/stdout-update) kütüphanesini kullanarak taşınmak için birkaç deneme yapılmıştır.

> Bu, bazı testlerde garip davranış sergilediği için çoğunlukla başarısız denemeler olmuştur.  
> — Katkı Yapan

Elbette, bunun bir birebir yerine geçmesini beklemiyoruz, ancak bazı testler hiç çıkış üretemedi.

### İlerleme Çubuğu

Bir ilerleme çubuğu, bir _Görev_ içinde `task.progress()` gibi kullanılabilir ve görev tamamlandığında ilerlemeyi `100%` olarak ayarlar, mevcut mimariye çok iyi bir ekleme olabilir.

:::info
Bu, görev çıktısından veya görev başlığından hemen sonra görüntülenebilir. Hangi yaklaşımın en iyi olacağını bilmiyorum.
:::

Bu yüzden, uzun süren görevler için kullanıcılara bir `ETA` verebiliriz.

## Ön Kontroller

### Özellikler ve Özellik Talepleri için Katkılar Kontrol Listesi

- [x] Öncelikli bir tartışma için bir sorun oluşturun veya mevcut bir sorunu bağlayın.
- [x] Mevcut sorunları ve sağlanan dökümantasyonu okuyun/araştırın.
- [x] Uygulamayı sağlayın ve finalize edildiğinde bir çekme isteği gönderin.
- [x] `git-hooks` tarafından uygulanan linting, testler ve commit konvansiyonu kurallarına uyun, bu [Angular geleneksel commitler](https://www.conventionalcommits.org/) dir.
- [ ] Mümkünse veya varsa testler ekleyin.
- [ ] Dokümantasyonu güncelleyin.

**Çok takdir edilir!**

### Hata Düzeltmeleri için Katkılar Kontrol Listesi

- [x] Mevcut sorunu bağlayın.
- [x] Uygulamayı sağlayın ve finalize edildiğinde bir çekme isteği gönderin.
- [x] `git-hooks` tarafından uygulanan linting, testler ve commit konvansiyonu kurallarına uyun, bu [Angular geleneksel commitler](https://www.conventionalcommits.org/) dir.
- [ ] Mümkünse veya varsa testler ekleyin.
- [ ] Dokümantasyonu güncelleyin.

**Çok takdir edilir!**

### Özellik Talepleri için Bir Sorun Açma Kontrol Listesi

- [x] Mevcut sorunları ve sağlanan [dokümantasyonu](https://listr2.kilic.dev) okuyun/araştırın.
- [x] `katkı bekleyen bölümde` bir sorun açmadığınızdan emin olun.
- [x] Mevcut uygulamadan neyin eksik olduğunu ve sağlananlarla nasıl gerçekleştirilemeyeceğini tarif edin.
- [x] Yazılımın son sürümünü kontrol ederek, bunun zaten eklenip eklenmediğini doğrulayın.

### Hata Düzeltmeleri için Bir Sorun Açma Kontrol Listesi

- [x] Mevcut sorunları ve sağlanan [dokümantasyonu](https://listr2.kilic.dev) okuyun/araştırın.
- [x] `katkı bekleyen bölümde` bir sorun açmadığınızdan emin olun.
- [x] Probleminizi net bir şekilde tanımlayın.
- [x] Mümkünse kopyalar, depo veya [replit](https://replit.com/) aracılığıyla çoğaltma sağlayın.
- [x] Yazılımın son sürümünü kontrol ederek, bunun zaten düzeltilip düzeltilmediğini doğrulayın.