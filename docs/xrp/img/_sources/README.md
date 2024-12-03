---
title: Görsel Kaynakları
seoTitle: Geliştirme Portalı için Görsel Kaynaklar ve Diyagramlar
sidebar_position: 4
description: Bu sayfa, geliştirme portalında kullanılan diyagramların kaynak dosyalarını ve bu diyagramların nasıl kullanılacağına dair ipuçlarını içermektedir. Özel Dactyl filtreleri ile diyagramların optimal şekilde yönetimi sağlanmaktadır.
tags: 
  - görsel kaynaklar
  - diyagramlar
  - Dactyl
  - SVG
  - UMLet
  - Google Çizim
  - yeniden renklendirme
keywords: 
  - görsel kaynaklar
  - diyagramlar
  - Dactyl
  - SVG
  - UMLet
  - Google Çizim
  - yeniden renklendirme
---

# Görsel Kaynakları

Bu klasör, mümkün olduğunda geliştirme portalında kullanılan diyagramların kaynak dosyalarını içermektedir. `.txt` dosyaları, Google Çizim veya diğer bulut yazılımları ile oluşturulan diyagramlara bağlantılar içermektedir.

## Diyagram Teknolojisi

Bu repo, oluşturulan HTML'ye inline SVG diyagram dosyalarını eklemek için özel bir `include_svg` Dactyl filtresi kullanıyor. Bunun yanı sıra, bu, diyagramların site temasına uygun şekilde yeniden renklendirilmesini sağlıyor (bu nedenle, diyagramlar örneğin otomatik olarak hem açık hem de koyu temalarla uyumlu hale getirilebilir).

:::tip
Diyagramları oluştururken [UMLet](http://umlet.com/) veya Google Çizim kullanın ve ardından dışa aktarımınızı SVG formatında yapın.
:::

Doğru bir şekilde kullanmanıza yardımcı olacak bazı ipuçları:

- Diyagramları oluşturmak için [UMLet](http://umlet.com/) veya Google Çizim kullanın, ardından bunları SVG olarak dışa aktarın.
- SVG'yi `img/` klasörüne koyun, böylece bağımsız dosya da çıktıya kopyalanır. Filtre, diyagramı orijinal dosyasına bağlantı haline getirir, böylece insanlar üzerine tıklayarak yakınlaştırılmış bir versiyonunu görebilir.
- `_diagrams.scss` dosyası`, diyagramlar için yeniden haritalanmış renkleri tanımlar. Eğer yeniden haritalanmamış bir renk kullanırsanız ve kötü görünüyorsa, bu dosyayı düzenlemeniz ve `CSS'i yeniden oluşturmanız` gerekir.
- Yeniden renklendirme, birden çok arka plan renginin üstündeki metni işleme yeteneğine sahip olmayabilir, çünkü hangi metnin neyin üstünde olduğunu tanıyacak bir yolu yoktur. Dikkatli kullanın.

:::warning
Bu hata, metin tabanlı olmayan bir dosyayı eklemeye çalıştığınızda meydana gelir (örneğin, bir PNG dosyasını SVG yerine `include_svg()` ile eklemeye çalışırsanız):
```
Preprocessor error in page <Page 'Transaction Queue' (transaction-queue.html)>: 'utf-8' codec can't decode byte 0x89 in position 0: invalid start byte.
```
:::