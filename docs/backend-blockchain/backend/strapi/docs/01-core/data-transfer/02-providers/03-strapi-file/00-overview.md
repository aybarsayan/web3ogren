---
title: Genel Bakış
description: Strapi veri dosyası sağlayıcıları hakkında genel bir bakış. Bu belgede, veri dosyalarının nasıl aktarılacağını ve güvenlik önlemlerini kapsayan bilgiler bulunmaktadır.
keywords: [Strapi, veri dosyası, sağlayıcılar, aktarım, şifreleme]
---

# Strapi Veri Dosyası Sağlayıcıları

Strapi veri dosyası sağlayıcıları, verileri bir `Strapi Veri Dosyası` ile aktarır.

:::note
**Dosya Güvenliği:** Dosyalar, isteğe bağlı olarak belirli bir anahtar (şifre) kullanılarak sıkıştırılabilir ve/veya şifrelenebilir.
:::

Dosya aktarım süreciyle ilgili en önemli noktalar şunlardır:

- Güvenlik: Dosyaların şifrelenmesi, verilerin güvenliğini artırır.
- Sıkıştırma: Dosyaların boyutunu azaltmak, aktarım hızını artırabilir.

:::tip
**Öneri:** Verilerinizi transfer etmeden önce her zaman bir yedek oluşturun.
:::

Ayrıca, verilerinizi aktarmadan önce mutlaka ilgili dokümanları kontrol ediniz. Bu, sorunsuz bir aktarım süreci sağlamak için önemlidir. 

---