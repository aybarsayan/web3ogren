---
title: Gaz Fiyatı Belirleme - opBNB Geliştir
description: Bu belge, cüzdanınızdaki opBNB işlemleri için öncelik fiyatını ve taban fiyatını nasıl belirleyeceğinizi gösterir. Uygun ayarlamalar yaparak işlem maliyetlerinizi düşürebilir ve gecikmeleri önleyebilirsiniz.
keywords: [opBNB, gaz fiyatı, öncelik fiyatı, taban fiyatı, Metamask, işlem onayı, gaz ücreti]
---

Bu belgede, cüzdanınızdaki opBNB işlemleri için öncelik fiyatını ve taban fiyatını nasıl belirleyeceğinizi göstereceğiz. Bu fiyatlar, işleminizin bir sonraki bloğa dahil edilmesi için ne kadar ödeme yapmaya istekli olduğunuzu (Öncelik Gaz Fiyatı) ve işleminiz tarafından kullanılan gaz için ne kadar ödeme yapmaya istekli olduğunuzu belirler. *Bu fiyatları doğru ayarlamak, para tasarrufu yapmanıza ve gecikmeleri önlemenize yardımcı olabilir.*

---

Öncelik fiyatını ve taban fiyatını ayarlamak için şu adımları izleyin:

### Metamask:

1. Metamask cüzdanınızı açın ve sağ üst köşede opBNB ağını tıklayın.

2. Gönder butonuna tıklayın ve alıcı adresini ve göndermek istediğiniz opBNB miktarını girin.

3. İşleminizi onaylamadan önce, gaz ücreti bölümünün yanında bulunan **gelişmiş -> düzenle** butonuna tıklayın.
![img](../../images/bnb-chain/bnb-opbnb/img/gas-price-setting.png)

4. İki kaydırıcı göreceksiniz: biri **Maksimum taban ücret (Gwei)** fiyatı ve diğeri **Öncelik Ücreti (Gwei)** için. Öncelik fiyatı, işleminizin bir sonraki bloğa dahil edilmesi için gaz başına ödemeye istekli olduğunuz opBNB miktarıdır. Taban fiyatı, işleminiz tarafından kullanılan gaz için gaz başına ödemeye istekli olduğunuz opBNB miktarıdır. **Toplam gaz ücreti**, bu iki fiyatın gaz tüketimi ile çarpımının toplamıdır. opBNB işlemleri için taban ücreti dinamik olup blok alanına olan talebe bağlıdır. *Minimum olası taban ücreti 0.000000008 gwei'dir. İşlemi bir bloğa dahil eden sıralayıcıya ödenen öncelik ücreti de 0.000000001 gwei kadar düşük olabilir. Ancak, bu ücretler ağ yoğunluğuna ve işlemin aciliyetine bağlı olarak değişebilir.*
![img](../../images/bnb-chain/bnb-opbnb/img/advanced-setting.png)

5. Kaydırıcıları tercihlerinize göre ayarlayabilirsiniz. Öncelik fiyatı ne kadar yüksekse, işleminiz o kadar hızlı onaylanır, ancak o kadar pahalı olur. Taban fiyatı ne kadar düşükse, işleminiz o kadar ucuz olur, ancak gaz limiti çok düşükse başarısız olma olasılığı o kadar artar.

:::tip
**İpucu:** Ayarları belirlerken, işlem onay süresinin yanı sıra harcama limitlerinizi de göz önünde bulundurun.
:::

6. Ayarlarınızdan memnun kaldığınızda, **kaydet**'e tıklayın ve ardından işleminizi onaylayın.