---
title: Genel Bakış
description: Bu içerik, yerel Strapi sağlayıcılarının nasıl çalıştığını ve veri transfer süreçlerini açıklamaktadır. Yerel Strapi örneğinin veri kaynağı olarak kullanımına dair önemli bilgiler sunmaktadır.
keywords: [Strapi, veri transferi, yerel sağlayıcı, otomatik kapatma, veri kaynağı]
---

# Yerel Strapi Sağlayıcıları

Yerel Strapi sağlayıcısı, verilerin transfer motorunun çalıştırıldığı aynı proje olan yerel Strapi örneğini veri kaynağı olarak kullanmayı sağlar.

:::note
Bir yerel Strapi veri sağlayıcısı oluşturmak, o sunucunun Varlık Servisi ve Sorgu Motoru ile etkileşimde bulunmak için başlatılmış bir `strapi` sunucu nesnesinin geçirilmesini gerektirir. Bu nedenle, yerel Strapi projesi başlatılamıyorsa (hatalar nedeniyle), sağlayıcılar kullanılamaz.
:::

**Önemli**: Bir transfer tamamlandığında, geçirilen `strapi` nesnesi `autoDestroy` seçeneğine dayanarak otomatik olarak kapatılır. Dış bir betik aracılığıyla bir transfer çalıştırıyorsanız, düzgün bir şekilde kapatılmasını sağlamak için `autoDestroy: true` kullanmanız önerilir, ancak şu anda çalışan bir Strapi örneği içinde bir transfer çalıştırıyorsanız `autoDestroy: false` ayarlamalısınız ya da Strapi örneğiniz transferin sonunda kapatılacaktır. 

> "Dış bir betik aracılığıyla bir transfer çalıştırıyorsanız, düzgün bir şekilde kapatılmasını sağlamak için `autoDestroy: true` kullanmanız önerilir."  
> — Strapi Belgelendirme

--- 