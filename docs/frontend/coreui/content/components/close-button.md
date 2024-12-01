---
description: Modallar ve uyarılar gibi içeriği kapatmak için genel bir kapatma düğmesi.
keywords: [kapatma düğmesi, kullanıcı deneyimi, Sass, bileşen, özelleştirme]
---

## Örnek

> **Not:** `.btn-close` ile bir bileşeni kapatma veya kapatma seçeneği sağlayın. Varsayılan stil sınırlıdır, ancak yüksek derecede özelleştirilebilir. Varsayılan `background-image`'i değiştirmek için Sass değişkenlerini değiştirmek önemlidir. 

**Ekran okuyucular için metin eklemeyi unutmayın**, bunu `aria-label` ile yaptığımız gibi.

---

## Devre Dışı Durum

> **Bilgi:** Devre dışı bırakılmış kapatma düğmeleri `opacity` değerini değiştirir. Hover ve aktif durumların tetiklenmesini önlemek için `pointer-events: none` ve `user-select: none` uyguladık.

---

## Koyu Variant


**Dikkat!** v5.0.0 itibarıyla, `.btn-close-white` sınıfı kullanım dışı bırakılmıştır. Bunun yerine, kapatma düğmesinin renk modunu değiştirmek için `data-coreui-theme="dark"` kullanın.
Kapatma düğmesini tersine çevirmek için `.btn-close`'a veya üst öğesine `data-coreui-theme="dark"` ekleyin. Bu, değerini geçersiz kılmadan `background-image`'i tersine çevirmek için `filter` özelliğini kullanır.

  
  

---

## Özelleştirme

### SASS Değişkenleri

