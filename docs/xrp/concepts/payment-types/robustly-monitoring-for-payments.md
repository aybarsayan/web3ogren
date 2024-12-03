---
title: Ödemeleri Güçlü Bir Şekilde İzlemek
seoTitle: Güçlü Ödeme İzleme Stratejileri
sidebar_position: 4
description: Gelen ödemeleri sağlam bir biçimde kontrol etmek için öneriler sunulmaktadır. Kısmi ödemeleri dikkatle izlemek ve finansal yönetim pratikleri hakkında bilgiler içerir.
tags: 
  - ödemeler
  - izleme
  - XRB
  - kısmi ödemeler
  - işlem sonuçları
  - XRP Ledger
  - finansal yönetim
keywords: 
  - ödemeler
  - izleme
  - XRB
  - kısmi ödemeler
  - işlem sonuçları
  - XRP Ledger
  - finansal yönetim
---

## Ödemeleri Güçlü Bir Şekilde İzlemek

Gelen ödemeleri sağlam bir biçimde kontrol etmek için, émeticilerin aşağıdakileri yapması gerekmektedir:

* En son işlenmiş işlem ve defter kaydını tutun. Bu şekilde, bağlantıyı geçici olarak kaybederseniz, ne kadar geriye gitmeniz gerektiğini bilirsiniz.
* Her gelen ödemenin sonuç kodunu kontrol edin. Bazı ödemeler, başarısız olsalar bile, bir anti-spam ücreti almak için deftere girer. **Sadece** `tesSUCCESS` sonuç koduna sahip işlemler, XRB dışındaki bakiyeleri değiştirebilir. Yalnızca doğrulanmış bir defterden gelen işlemler sonlandırılmıştır.

:::tip
Kısmi ödemeler dikkatle izlenmelidir.
:::

* `Kısmi Ödemelere` dikkat edin. Kısmi ödeme bayrağı etkinleştirildiğinde, herhangi bir sıfır olmayan miktar teslim edilirse "başarılı" olarak kabul edilebilir, hatta çok küçük miktarlar bile.
    * İşlemi `delivered_amount` alanı için kontrol edin. Varsa, bu alan, `Hedef` adresine _gerçekten_ ne kadar para teslim edildiğini gösterir.
    * xrpl.js içinde, her adresin ne kadar aldığını görmek için [`xrpl.getBalanceChanges()` yöntemini](https://js.xrpl.org/modules.html#getBalanceChanges) kullanabilirsiniz. Bazı durumlarda, bu farklı güven hatları üzerinde birden fazla parçaya bölünebilir.

:::info
Ödemelerin sorgulanması, finansal düzene katkı sağlar.
:::

* Bazı işlemler, doğrudan bir adresinizden ya da adresinize ödeme olmadan bakiyelerinizi değiştirir.

Müşterileriniz için işleri kolaylaştırmak adına, hem operasyonel adresinize hem de ihraç adreslerinize ödemeleri kabul etmenizi öneririz.

Ek bir önlem olarak, her yeni XRP Ledger defter versiyonu itibarıyla mevcut bakiyelerinizi ihraç adresinizdeki teminat fonlarıyla karşılaştırmanızı öneriyoruz. **İhraç adresinin negatif bakiyeleri**, ağ dışında XRP Ledger'a ayırdığınız varlıklarla örtüşmelidir. 

> **Not:**
> İkisi örtüşmüyorsa, XRP Ledger'a işlemleri kabul etmeyi ve gerçekleştirmeyi durdurmalısınız ta ki bu tutarsızlığı çözene kadar. — 

* Bakiyelerinizi kontrol etmek için `gateway_balances` yöntemini kullanın.
* Eğer bir Transfer Ücretiniz varsa, diğer XRP Ledger adresleri tokenlarınızı kendi aralarında transfer ettiğinde XRP Ledger'ındaki yükümlülükleriniz biraz azalır.

Gelen işlemlerin ayrıntılarını okuma konusunda daha fazla bilgi için `İşlem Sonuçlarını Görüntüleyin` bölümüne bakın.