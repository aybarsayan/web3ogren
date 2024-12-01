---
title: Geri Çağırma
description: CSV - Node.js akış borusu API'sini CSV ile nasıl kullanacağınızı öğrenin. Bu bölüm, geri çağırma API'sinin nasıl kullanılacağını ve avantajlarını açıklamaktadır. Ayrıca, örneklerle daha iyi anlamanızı sağlamaktadır.
keywords: [csv, ayrıştır, ayrıştırıcı, örnek, tarif, akış, eşzamansız, boru, oku, yaz]
sort: 3.2
---

# Geri Çağırma API'si

:::info
`csv` modülünde geri çağırma API'si de mevcuttur. Bu API, büyük veri kümeleri ile ölçeklenmeyebilir. Aşağıda daha fazla bilgi bulabilirsiniz.
:::

Tüm veri kümesi ikinci geri çağırma argümanında mevcuttur. Bu nedenle büyük veri kümesi ile ölçeklenmeyecektir. 

> **Not:** [geri çağırma örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv/samples/callback.js) her CSV işlevini sıralı olarak başlatır, öncekinin çıktısıyla. Açıklık adına, örneğin hata yönetimi ile ilgilenmediğini unutmayın.

:::tip
Yeterince karmaşık bir kod yazmaktan kaçınmak için, basit örnekler üzerinde çalışarak başlayabilirsiniz.
:::

```javascript
// Burada kod bloğu için örnek gösterilebilir
```


Detaylı Bilgi

Bu API ile çalışmanın bazı temel noktaları şunlardır:
- **Basitlik:** İlk başta basit bir veri kümesi ile başlayın.
- **Yavaşça Büyüyün:** Veri kümesini zamanla artırarak test edin.
- **Hata Yönetimi:** Uygulamanızda gelişmiş hata yönetim yöntemlerini düşünün.

