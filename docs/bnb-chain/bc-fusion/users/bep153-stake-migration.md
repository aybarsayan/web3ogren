---
title: BEP153 İçin Stake Taşınması
description: Bu belge, BEP-153 delegatörleri için stake taşıma sürecini ve Likit Staking Türevleri (LSD) protokolü kullanıcıları için gerekli adımları açıklamaktadır.
keywords: [BEP-153, BNB, staking, LSD, delegatör, Beacon Zinciri, BSC]
---

# BEP153 İçin Stake Taşınması

[BEP-153](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP153.md), BNB Akıllı Zinciri'nde [BNB Zincir birleşimi](https://www.bnbchain.org/en/bnb-chain-fusion) öncesinde yerel bir staking protokolü olarak tanıtılmıştır. Bu BEP ile bireysel veya kurumsal delegatörler, belirli doğrulayıcılara BNB stake edebilir ve BSC tarafında staking ödülleri alabilirler.

:::info
**Önemli Not:** Protokol kullanıcısının BNB'si, Beacon Zinciri'ne çapraz zincir transfer edilir ve ardından orada stake edilir. BEP-153 delegatörlerinin stake'lerini `yeni staking sistemine` taşımaları gerekmektedir.
:::

BEP-153 stake'leri için delegatörlerin, unbound (bağlantıdan çıkarma) süresini (7 gün) bekleyerek, önce delegasyonlarını sona erdirmesi ve ardından BNB'lerini yeni staking sisteminde stake etmeleri gerekmektedir.

> “Bu belge, BEP-153 delegatörleri için stake taşıma sürecinde, ayrıca Likit Staking Türevleri (LSD) protokolü kullanıcılarını da kapsayarak rehberlik edecektir.” — Belge Açıklaması

## Bireysel Delegatörler İçin

1. [Staking sözleşmesini](https://bscscan.com/address/0x0000000000000000000000000000000000002001) BSCScan'de açın.

2. Delegasyon bilgilerinizi "Transactions" sekmesinde bulabilir veya sözleşmeyi aşağıdaki gibi sorgulayabilirsiniz:
    * [Staking sözleşmesi sekmesine](https://bscscan.com/address/0x0000000000000000000000000000000000002001#readContract) gidin.
    * Adresinizi parametre olarak kullanarak `getDelegated` fonksiyonunu sorgulayın.
   ![](../../images/bnb-chain/assets/bcfusion/bep153-migration1.png)

3. Delegelerinizi sona erdirmek için
   `undelegate` [fonksiyonunu](https://bscscan.com/address/0x0000000000000000000000000000000000002001#writeContract) çağırın.
   ![](../../images/bnb-chain/assets/bcfusion/bep153-migration2.png)

4. Unbound süresi (7 gün) sonunda, BNB'nizi geri almak için
   `claimUndelegated` [fonksiyonunu](https://bscscan.com/address/0x0000000000000000000000000000000000002001#writeContract) çağırın.
   ![](../../images/bnb-chain/assets/bcfusion/bep153-migration3.png)

5. Ardından, `yeni staking kılavuzunu` takip ederek BNB'nizi yeni staking sistemine delegasyon yapın.

---

## LSD Protokol Delegatörleri İçin

1. LSD protokolünüzün dApp'lerine gidin ve delegelerinizi sona erdirin.

2. Unbound süresini (7 gün) bekleyin.

3. Ardından, `yeni staking kılavuzunu` izleyerek BNB'nizi yeni staking sistemine delegasyon yapın.

## LSD Protokol Projeleri İçin

:::warning
**Dikkat:** LSD protokol projeleri için, **MUTLAKA** Beacon Zinciri'nin [İkinci Sunset Forku](https://www.bnbchain.org/en/bnb-chain-fusion) öncesinde delegasyonlarınızı tamamlamalısınız. 
:::

İkinci Sunset Fork'ta, tüm delegasyonlar otomatik olarak delegatör adreslerine geri dönecektir. Eğer delegasyon adresiniz bir EOA adresi değilse, stake'lerinizin kontrolünü kaybedersiniz ve fonlar kaybolur.