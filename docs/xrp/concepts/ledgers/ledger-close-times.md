---
title: Defter Kapanış Zamanları
seoTitle: XRP Defteri Kapanış Zamanlarının Hesaplanması
sidebar_position: 4
description: XRP Defterinin kapanış zamanlarının hesaplama süreçlerini ve uzlaşmalarını detaylı bir şekilde ele alıyoruz. Örnekler üzerinden süreçlerin nasıl işlediğini açıklıyoruz.
tags: 
  - XRP
  - ledger
  - kapanış zamanı
  - blockchain
  - uzlaşma
  - doğrulayıcı
  - escrow
keywords: 
  - XRP
  - ledger
  - kapanış zamanı
  - blockchain
  - uzlaşma
  - doğrulayıcı
  - escrow
---

## Defter Kapanış Zamanları

Bir defter sürümünün kapanış zamanı, `defter başlığı` `close_time` alanında kaydedilir. Ağa, tam bir kapanış zamanında uzlaşmaya ulaşmasını kolaylaştırmak için, bu değer kapanış zamanı çözümlemesine dayalı olarak bir dizi saniyeye yuvarlanır, bu da şu anda **10 saniye**dir. Yuvarlama, bir defterin kapanış zamanının ebeveyn defterinin kapanış zamanı ile aynı (veya daha erken) olmasına neden olursa, çocuk defterin kapanış zamanı ebeveynin kapanış zamanı artı 1 olarak ayarlanır. Bu, doğrulanan defterlerin kapanış zamanlarının katı bir şekilde artan olmasını garanti eder.

:::info
Yeni defter sürümleri genellikle her 3 ila 5 saniyede bir kapanış yaptığından, bu kurallar, defterlerin kapanış zamanlarının :00, :01, :02, :10, :11, :20, :21 ile biten gevşek bir desene sahip olmasına neden olur.
:::

2 ile biten zamanlar daha az yaygındır ve 3 ile biten zamanlar çok nadirdir; ancak her ikisi de rastgele daha fazla defter, rastgele olarak **10 saniyelik** bir zaman diliminde kapanırken meydana gelir.

Genel olarak, defter, kapanış zamanı çözümlemesinden daha hassas zaman ölçümleri yapamaz. Örneğin, bir nesnenin bir son tarihini geçip geçmediğini kontrol etmek için kural, bunu ebeveyn defterinin kapanış zamanı ile karşılaştırmaktır. (Bir defterin kapanış zamanı, o deftere geçiş işlemleri gerçekleştirilirken henüz bilinmemektedir.) Bu, örneğin, bir `Escrow` nesnesinde belirtilen zamana dayalı son tarihten yaklaşık **10 saniye daha sonra** gerçek dünya zamanında başarılı bir şekilde tamamlanabileceği anlamına gelir.

---

### Örnek

Aşağıdaki örnekler, kapanış zamanı **12:00:00** olan bir defteri izleyen bir doğrulayıcı perspektifinden defter kapanış zamanlarının yuvarlanma davranışını göstermektedir:

**Mevcut uzlaşma turu**

1. Bir doğrulayıcı, defterin kapandığı ve uzlaşmaya girdiği zamanın **12:00:03** olduğunu not eder. Doğrulayıcı, bu kapanış zamanını tekliflerine dahil eder.
2. Doğrulayıcı, diğer çoğu doğrulayıcının (UNL'sinde) **12:00:02** olarak bir kapanış zamanı önerdiğini ve bir diğerinin **12:00:03** önerdiğini gözlemler. Önerdiği kapanış zamanını **12:00:02** uzlaşmasına uyacak şekilde değiştirir.
3. Doğrulayıcı, bu değeri en yakın kapanış zamanı aralığına yuvarlar ve **12:00:00** elde eder.
4. **12:00:00**, önceki defterin kapanış zamanından daha büyük olmadığından, doğrulayıcı kapanış zamanını tam olarak önceki defterin kapanış zamanından **1 saniye** sonra olacak şekilde ayarlar. Sonuç, ayarlanmış kapanış zamanı **12:00:01** olur.
5. Doğrulayıcı, bu ayrıntılarla defteri oluşturur, elde edilen hash'i hesaplar ve doğrulama adımında diğerlerinin de aynı işlemi yaptığını onaylar.

> Doğrulama yapmayan sunucular da aynı adımları takip eder, ancak kaydettikleri kapanış zamanlarını ağın geri kalanına önermezler.  
> — Kapanış Zamanı Süreci Açıklaması

---

**Sonraki uzlaşma turu**

1. Bir sonraki defter, çoğu doğrulayıcıya göre **12:00:04**'te uzlaşmaya girer.
2. Bu tekrar aşağı yuvarlanır ve kapanış zamanı **12:00:00** olur.
3. Bu, önceki defterin kapanış zamanı olan **12:00:01**'den büyük olmadığından, ayarlanmış kapanış zamanı **12:00:02** olur.

**Sonraki uzlaşma turu**

1. Ondan sonraki defter, çoğu doğrulayıcıya göre **12:00:05**'te uzlaşmaya girer.
2. Bu, kapanış zamanı çözümlemesine dayanarak yukarı yuvarlanır ve **12:00:10** olur.
3. Bu değer, önceki defterin kapanış zamanından daha büyük olduğundan, ayarlama gerektirmez. **12:00:10** resmi kapanış zamanı olur.