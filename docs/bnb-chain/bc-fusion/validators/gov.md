---
title: Yönetim
description: BNB zincir entegrasyonu ile birlikte gelen yerel yönetim modülünü tanıtan bu sayfa, öneri sunma, oy verme ve yürütme süreçlerini detaylandırmaktadır. Kullanıcıların staking ödüllerini koruyarak önerilere katılmasını sağlayan özellikler mevcut.
keywords: [BNB, yönetim, staking, öneri, oy verme, zincir entegrasyonu, OpenZeppelin]
---

# Yönetim

[BEP-297](https://github.com/bnb-chain/BEPs/pull/297), BNB zincir entegrasyonundan sonra BNB akıllı zinciri için yerel yönetim modülünü tanıtmaktadır. Yönetim modülü, aşağıdaki özelliklerle [OpenZeppelin Governor](https://docs.openzeppelin.com/contracts/4.x/governance) kaynağından türetilmiştir:

- Herhangi bir staking kredi sahibi öneride bulunma ve oy kullanma hakkına sahiptir.
- Oy verenler, oylama süresi boyunca staking ödüllerini kazanmaya devam edebilir.
- Kullanıcılar, başkalarını kendi adlarına yönetime katılması için yetkilendirebilir.
- Bir önerinin yürütülmesinden önce bir zaman kilidi süresi tanıtılmaktadır.
- Öneri reddedilirse, öneri sahibi herhangi bir mali kayıp yaşamaz.

## İş Akışı

Yönetim modülünün iş akışı, öneri sunma, oy verme ve öneriyi yürütme olmak üzere üç aşamadan oluşur. Her aşamanın kendi gereksinimleri ve parametreleri vardır ve bunlar BNB akıllı zinciri yönetimi araçları tarafından yapılandırılabilir.

### Öneri Sunma

:::tip
Bir öneri sunmak için, bir staking kredi sahibinin `Governor` kontratına bir `propose` işlemi göndermesi gerekir.
:::

Bir öneri sunmak için, bir staking kredi sahibinin `Governor` kontratına bir `propose` işlemi göndermesi gerekir. Bu, sistem kontratı olup adresi `0x0000000000000000000000000000000000002004`'tür ve aşağıdaki bilgileri belirtmelidir:

- **Öneren adres**: Öneriyi başlatan ve öneri ücretini ödeyen öneren kişinin adresi.
- **Hedefler**: Önerinin etkileşimde bulunmak istediği kontratların veya hesapların adresleri listesi.
- **Değerler**: Önerinin hedeflere aktarmak istediği BNB veya diğer token miktarlarının listesi.
- **İmzalar**: Önerinin hedeflerde çağırmak istediği kontratların fonksiyon imzaları listesi.
- **Çağrı verileri**: Önerinin hedeflerde çağırmak istediği fonksiyonların kodlanmış argümanlarının listesi.
- **Açıklama**: Önerinin daha fazla detay ve gerekçe sunan açıklaması.

:::info
Bir delegatör, öneri sunmanın asgari gereksinimi olarak **200 staked BNB**’den fazla yatırmalıdır. Bu arada, bir delegatör yalnızca kendisi tarafından oluşturulmuş herhangi bir bekleyen öneri yoksa yeni bir öneri sunabilir.
:::

`propose` işlemi, BNB akıllı zincirinde yeni bir öneri oluşturacaktır. Öneri benzersiz bir öneri kimliğine ve `Pending` öneri durumuna sahip olacaktır. Öneri daha sonra, staking kredi sahiplerinin öneri üzerinde oy kullanmaları için zaman dilimi olan oylama dönemine girecektir.

### Oy Kullanma

Bir öneriye oy vermek için, bir staking kredi sahibinin `Governor` kontratına bir `castVote` işlemi göndermesi gerekir. Bu işlem aşağıdaki bilgileri belirtmelidir:

- **Seçmen adresi**: Öneri üzerinde oy kullanan seçmenin adresi. Seçmen adresi, staking kredi sahibinin adresiyle aynı olabilir veya staking kredi sahibi tarafından yönetime katılması için yetkilendirilmiş başka bir adres olabilir.
- **Öneri Kimliği**: Seçmenin oy vermek istediği öneriyi tanımlayan öneri kimliği.
- **Destek**: Oy verme tercihini belirten boolean değer. `True`, seçmenin öneriyi desteklediği anlamına gelirken, `False`, seçmenin öneriye karşı olduğu anlamına gelir.

:::note
Oy verme gücü, seçmenin oy verme zamanı itibarıyla sahip olduğu staking kredi miktarıdır.
:::

`castVote` işlemi, BNB akıllı zincirinde seçmenin destek değerini ve oy verme gücünü kaydedecektir. Oy verme gücü, delegasyon, geri alım veya yeniden delegasyon gibi staking işlemleri nedeniyle değişebilir, ancak destek değeri aynı kalacaktır. Seçmen, oy verme dönemi boyunca herhangi bir zamanda destek değerini değiştirebilir, farklı bir destek değeri ile başka bir `castVote` işlemi göndererek.

Bir öneri sunulduktan sonra, staking kredi sahipleri öneri üzerinde oy kullanabilirler. Oylama dönemi, BNB akıllı zincirinin yönetim parametrelerinden biridir ve şu anda 7 gün olarak belirlenmiştir.

### Öneriyi Yürütme

Bir öneriyi yürütmek için, herkes `Governor` kontratına bir `execute` işlemi gönderebilir ve aşağıdaki bilgileri belirtmelidir:

- **Öneri Kimliği**: Yürütülmek istenen öneriyi tanımlayan öneri kimliği.

`execute` işlemi, BNB akıllı zincirindeki öneri durumunu ve oylama sonuçlarını kontrol edecek ve önerinin yürütülüp yürütülemeyeceğini belirleyecektir. Öneri, aşağıdaki koşullar sağlandığında yürütülebilir:

- **Öneri durumu `Pending`**’dir, bu da önerinin henüz yürütülmediği veya süresinin dolmadığı anlamına gelir.
- **Oylama süresi sona ermiştir**, bu da öneri üzerinde oy kullanma zaman diliminin sona erdiği anlamına gelir.
- **Öneri, yeterli oylama gücüne ulaşmıştır**, bu da `True` veya `False` oy kullanan seçmenlerin toplam oy verme gücünün, BNB akıllı zincirindeki toplam staking kredisinin belirli bir yüzdesinden daha büyük veya eşit olduğu anlamına gelir. Yeterli oy oranı, BNB akıllı zincirinin yönetim parametrelerinden biridir ve şu anda **%10** olarak belirlenmiştir.
- **Öneri, eşiği geçmiştir**, bu da `True` oy kullanan seçmenlerin oy verme gücünün `True` veya `False` oy kullanan seçmenlerin oy verme gücünün belirli bir yüzdesinden daha büyük veya eşit olduğu anlamına gelir.

:::warning
Oylama süresi sona erdikten sonra, öneri gerekli koşulları sağlıyorsa yürütülebilir. Ancak, öneri hemen yürütülemez, çünkü yürütülmeden önce bir zaman kilidi süresi vardır.
:::

Zaman kilidi süresi, BNB akıllı zincirinin bir diğer yönetim parametresidir ve şu anda **1 gün** olarak belirlenmiştir. Zaman kilidi süresi, BNB akıllı zincirindeki ani ve geri alınamaz değişiklikleri önlemek için tasarlanmış ve paydaşların öneri yürütülmesine tepki verme veya hazırlık yapma şansı vermektedir.

---

## Oy Gücü Delegasyonu

Oy kullanmanın yanı sıra, staking kredi sahipleri, kendi adlarına yönetime katılması için oy güçlerini başkasına da devredebilirler. Bu, önerileri takip edip oy kullanmak için zamanı, ilgiyi veya uzmanlığı olmayan staking kredi sahipleri için yararlı olabilir, ancak yine de yönetim sürecinde bir söz sahibi olmak isterler. Oy güçlerini güvenilir bir tarafa, örneğin bir doğrulayıcıya, bir arkadaşa veya profesyonel bir hizmete devrederek, bilgileri ve deneyimlerinden faydalanabilirler ve oy kullanmaktan kaçınmaları nedeniyle staking ödüllerini kaybetme riskinden de kaçınabilirler.

:::tip
Oy güçlerini devretmek için bir staking kredi sahibinin, `GovToken` kontratına bir `delegateVote` işlemi göndermesi gerekir.
:::

Bu, sistem kontratı olup adresi `0x0000000000000000000000000000000000002005`’tir ve aşağıdaki bilgileri belirtmelidir:

- **Delegatör adresi**: Oy gücünü başka bir adrese devreden delegatörün adresi.
- **Delegee adresi**: Delegatörün oy gücünü devrettiği ve kendi adlarına yönetime katılan delegee'nin adresi.

`delegateVote` işlemi, BNB akıllı zincirinde delegasyon ilişkisinin ve delegatörün oy gücünün kaydını tutacaktır. Oy gücü, delegasyon zamanı itibarıyla delegatörün sahip olduğu staking kredi miktarıdır. Oy gücü, delegasyon, geri alım veya yeniden delegasyon gibi staking işlemleri nedeniyle değişebilir, ancak delegasyon ilişkisi aynı kalacaktır. Delegatör, istediği zaman delegee adresini değiştirerek, farklı bir delegee adresi ile başka bir `delegateVote` işlemi gönderebilir.