---
title: Genel Bakış - BSC Yönetimi
description: BSC Yönetimi, yerel yönetim modülü ve temel özellikleri hakkında detaylı bir bakış sunar. Teklif verme, oy hakları, sürekli ödüller ve güvenli icra gibi önemli unsurları içerir.
keywords: [BSC Yönetimi, Yerel Yönetim, Teklif Verme, Oy Hakları, Sürekli Ödüller, Delegasyon, Güvenli İcra]
---

# BSC Yönetimi Genel Bakış
![governance](../../images/bnb-chain/bnb-smart-chain/img/Governance.png)

[BEP-297](https://github.com/bnb-chain/BEPs/pull/297), BSC için yerel yönetim modülünü tanıtmaktadır ve [OpenZeppelin Governor](https://docs.openzeppelin.com/contracts/4.x/governance)'dan ilham alınmıştır. BSC Yönetimi'nin temel özellikleri şunlardır:

-  **Teklif ve Oy Hakları**: Stake kredi sahipleri, yönetim konularında teklif verebilir ve oy kullanabilir.
-  **Sürekli Ödüller**: Oy verenler, oylama süresi boyunca stake ödülleri kazanmaya devam edebilir.
-  **Esnek Delegasyon**: Kullanıcılar oy haklarını devredebilir, bu da diğerlerinin yönetime katılmasına olanak tanır.
-  **Güvenli İcra**: Teklifler, kabul edildikten sonra uygulanmadan önce bir zaman kilidi süresine tabi tutulur.

---

## İş Akışı Genel Bakışı

### Teklif Gönder

-  **Başlatma**: Herhangi bir stake kredi sahibi, `kullanıcı kılavuzu`'nu takip ederek bir teklif gönderebilir.
-  **Gerekli Detaylar**: Teklif sahibi adresi, hedef adresler, değerler, fonksiyon imzaları, çağrı verileri ve kapsamlı bir açıklama.
-  **Gereksinimler**: Minimum 200 BNB stake ve aynı delegatörden gelen bekleyen teklifler olmamalıdır.

### Oy Kullan

-  **Katılım**: Oy verenler, `Governor` sözleşmesinde `castVote` işlemi aracılığıyla oy kullanır.
-  **Gerekli Bilgiler**: Oy veren adresi, teklif kimliği ve destek değeri (Doğru veya Yanlış).
-  **Esneklik**: Oy verenler, oylama süresi boyunca destek değerlerini ayarlayabilirler, şu anda **7 gün** olarak belirlenmiştir.
-  **Oy Gücü**: Oy gücü, bir teklif yapıldığında oy verenin sahip olduğu stake kredi miktarıdır.

### Teklifi Uygula

-  **Uygulama Çoğunluğu**: Oylanan stake kredinin toplam stake krediye oranı, yönetim çoğunluğundan aşağı olmamalıdır, şu anda **%10** olarak belirlenmiştir.
-  **Sayım Eşiği**: `Evet` için oy gücü yüzdesi, `Hayır` için olandan az olmamalıdır ve sayım eşiğini karşılamalıdır, şu anda **%50** olarak belirlenmiştir.
-  **Uygulama Zaman Kilidi**: Bir teklif uygulama koşullarını karşıladığında, tetiklenebilmesi için gerekli bir gecikme süresi vardır, şu anda **1 gün** olarak belirlenmiştir.

---

## Oy Gücünün Delegasyonu 

Stake kredi sahipleri, zaman veya uzmanlık eksikliği durumunda oy güçlerini yönetime katılmak üzere devredebilirler. 

:::tip
Güvenilir bir tarafa, örneğin bir doğrulayıcıya veya profesyonel bir hizmete delegasyon yaparak uzmanlıktan faydalanabilir ve oy kullanmamaktan dolayı ödüllerini kaybetme riskini azaltabilirler.
:::