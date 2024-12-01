---
layout: docs
title: Z-index
description: CoreUI for Bootstrap'un ızgara sisteminin bir parçası olmasa da, z-index'ler bileşenlerimizin nasıl üst üste bindiği ve birbirleriyle nasıl etkileştiği açısından önemli bir rol oynamaktadır. Bu sayfa, z-index kullanımı ve katmanlama konusunda rehberlik sağlamaktadır.
keywords: [z-index, CoreUI, Bootstrap, katmanlama, CSS, bileşenler]
---

Birçok CoreUI for Bootstrap bileşeni, içerikleri düzenlemek için üçüncü bir eksen sağlayan CSS özelliği **`z-index`**'i kullanır. CoreUI for Bootstrap'ta, navigasyon, ipuçları ve açılır pencereler, modallar ve daha fazlasını düzgün bir şekilde katmanlamak için tasarlanmış bir varsayılan z-index ölçeğini kullanıyoruz.

---

Bu daha yüksek değerler, çatışmalardan kaçınmak için yeterince yüksek ve belirgin olan keyfi bir sayı ile başlar. Katmanlı bileşenlerimiz—ipuçları, açılır pencereler, navigasyon çubukları, açılır menüler, modallar—arasında makul bir tutarlılık sağlamak için standart bir dizi bu değerlere ihtiyacımız var. `100`+ veya `500`+ kullanmamamız için hiçbir neden yok.

:::tip
**Not:** Bu bireysel değerlerin özelleştirilmesini teşvik etmiyoruz; eğer birini değiştirirseniz, muhtemelen hepsini değiştirmeniz gerekecektir.
:::

Bileşenler içinde (örneğin, giriş gruplarındaki butonlar ve girişler) üst üste binen kenarları yönetmek için, varsayılan, üzerine gelme ve aktif durumlar için düşük tek haneli **`z-index`** değerleri `1`, `2` ve `3` kullanırız. 

> **Önemli:** Üzerine gelme/odaklanma/aktif durumlarda, belirli bir öğeyi, komşu öğelerin üzerinde göstermek için daha yüksek bir `z-index` değeri ile öne çıkarıyoruz. 
— CoreUI Dokümantasyonu