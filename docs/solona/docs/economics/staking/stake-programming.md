---
title: Stake Programming
---

Stake dağılımını, merkezsizlik, ve sansüre karşı dirençliliği maksimize etmek için Solana ağında, **staking programatik olarak gerçekleştirilebilir**. Ekip ve topluluk, stake'leri yönetmeyi kolaylaştırmak için birkaç zincir içi ve zincir dışı program geliştirmiştir.

#### Stake-o-matic yani Otomatik Delegasyon Botları

:::note
**Bu zincir dışı program**, merkezi bir otorite tarafından stake edilen büyük bir doğrulayıcı popülasyonunu yönetir.
:::

Solana Vakfı, belirli performans gereksinimlerini karşılayan "yükümlülüğü olmayan" doğrulayıcılara düzenli olarak stake'ini devretmek için bir otomatik delegasyon botu kullanmaktadır.

#### Stake Havuzları

:::info
Bu zincir içi program, bir yönetici tarafından stake edilecek **SOL'ları havuzlar**, SOL sahiplerinin stake'leri yönetmeden stake edip ödüller kazanmalarına olanak tanır.
:::

Kullanıcılar, stake havuzundaki sahipliklerini temsil eden SPL token'ları (staking türevleri) karşılığında SOL yatırır. Havuz yöneticisi, yatırılan SOL'ları stratejisine göre stake eder; belki de yukarıda tarif edilen otomatik delegasyon botunun bir varyantını kullanarak. Stake'ler ödül kazandıkça, havuz ve havuz token'ları orantılı olarak değer kazanır. 

> **Önemli Not:** Havuz token sahipleri, SOL'yi geri almak için SPL token'larını tekrar stake havuzuna gönderebilir, böylece çok daha az çaba gerektirerek merkezsizlikte iştirak etmiş olurlar.  
> — **Stake Havuzları Özeti**

Daha fazla bilgi için  
[SPL stake havuzu belgelendirmesine](https://spl.solana.com/stake-pool) göz atabilirsiniz.

---


Ekstra Bilgi ve Açıklamalar

- Stake havuzlarının kullanımı, kullanıcıların daha az teknik bilgiye sahip olmasını sağlar.
- Otomatik delegasyon botları, staker'ların kripto varlıklarını daha etkin bir şekilde yönetmesine yardımcı olur.

