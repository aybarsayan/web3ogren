---
description: Tutarlı tarayıcılar arası stil ve yerleşik özelleştirme için özel aralık girdilerimizi kullanın. Bu belgede, aralık girdileri için özel kontroller oluşturma ve yönetme yöntemleri ele alınmaktadır.
keywords: [aralık, özel kontroller, SASS, form, stil, özelleştirme, tarayıcı uyumluluğu]
---

# Genel Bakış

`.form-range` ile özel `` kontrolleri oluşturun. Takip (arka plan) ve parmak (değer) her iki tarayıcıda da aynı şekilde görünecek şekilde stil verilmiştir. Şu anda, yalnızca Firefox, ilerlemeyi görsel olarak göstermek için parmağın solundan veya sağından traklarını "doldurmayı" desteklemektedir; bu nedenle, bunu şu an desteklemiyoruz.


Örnek aralık

---

## Devre Dışı

Bir girdi üzerine `disabled` boolean niteliğini ekleyerek gri bir görünüm kazandırabilir ve işaretçi olaylarını kaldırabilirsiniz.

:::tip
Görüntü ve etkileşim açısından sıradan bir deneyim sunmak için, `disabled` niteliği kullanıcı arayüzüne önemli etkiler yapar.
:::


Devre dışı aralık

---

## Min ve Max

Aralık girdileri için `min` ve `max` için örtük değerler vardır—sırasıyla `0` ve `100`. Bunlar için yeni değerler belirtilerek `min` ve `max` niteliklerini kullanabilirsiniz.

> "Variations in range inputs provide a significant impact on user experience."  
> — UX Research Team


Örnek aralık

---

## Adımlar

Varsayılan olarak, aralık girdileri tam sayı değerlerine "yakalama" yapar. Bunu değiştirmek için bir `step` değeri belirleyebilirsiniz. Aşağıdaki örnekte, `step="0.5"` kullanarak adım sayısını iki katına çıkarıyoruz.

:::info
Adım değerini kullanarak aralık girdilerini daha hassas bir şekilde kontrol edebilirsiniz. Bu, kullanıcı deneyimini büyük ölçüde artırabilir.
:::


Örnek aralık

---

## Özelleştirme

### SASS değişkenleri

