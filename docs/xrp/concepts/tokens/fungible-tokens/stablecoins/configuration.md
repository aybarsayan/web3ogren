---
title: Stabilcoin Yapılandırması
seoTitle: Stabilcoin Yapılandırması - XRPL
sidebar_position: 4
description: Stabilcoinunuzun yeteneklerini ayarlamak için yapılandırın. Bu sayfada, XRPL üzerinde stabilcoin yapılandırmanızı sağlayacak önemli ayarları ve bunların nasıl yapılandırılacağını öğrenin.
tags: 
  - stabilcoin
  - XRPL
  - yapılandırma
  - transfer ücreti
  - güven hatları
keywords: 
  - stabilcoin
  - XRPL
  - yapılandırma
  - transfer ücreti
  - güven hatları
---

# Stabilcoin Yapılandırması

Tokenları ihraç etmeye başlamadan önce XRP Ledger hesabınızda yapılandırmanız gereken bazı ayarlar vardır. Bu ayarların nasıl yapılandırılacağına dair örnekler için `Fungible Token Yayınlayın` sayfasına göz atın.

Yapılandırmak isteyebileceğiniz ayarlar şunlardır:

| Ayar | Notlar |
|------|--------|
| **Varsayılan Ripple** | İhraç edenlerin bu alanı etkinleştirmesi gerekir. |
| **Mevduat Yetkilendirmesi** | Açıkça onaylamadığınız kullanıcılardan gelen tüm ödeme taleplerini engelleyin. |
| **Yetki Gereksinimi** | Tokenlarınızı yalnızca açıkça onayladığınız kullanıcıların tutmasına sınırlayın. |
| **Tick Boyutu** | Merkeziyetsiz borsa işlemlerinde döviz kurlarını yuvarlayarak daha hızlı fiyat keşfini kolaylaştırın. |
| **Transfer Ücreti** | Kullanıcılar tokenlarınızı birbirlerine gönderdiğinde bir yüzde ücreti tahsil edin. |

---

## Varsayılan Ripple

Varsayılan Ripple bayrağı, bir güven hat üzerindeki bakiyelerin varsayılan olarak *ripple* olmasına izin verilip verilmediğini kontrol eder. Rippling, müşterilerin tokenları birbirlerine göndermelerini ve ticaretini yapmalarını sağlar, bu nedenle bir ihraç eden, ihraç adresine ait tüm güven hatlarında rippling'e izin vermelidir. Daha fazla bilgi için `Rippling` sayfasına bakın.

> **Not:** Müşterilerden ihraç adresine güven hatları oluşturmalarını isteyen bir ihraç eden, o adreste Varsayılan Ripple bayrağını etkinleştirmelidir. Aksi takdirde, ihraç eden, diğer adresler tarafından oluşturulan her güven hattı için No Ripple bayrağını ayrı ayrı devre dışı bırakmalıdır.  
> — Stabilcoin Yapılandırması

Varsayılan Ripple bayrağını diğer adreslerde, örneğin operasyonel veya bekleme cüzdanlarınızda *etkinleştirmemelisiniz*.

---

## Mevduat Yetkilendirmesi

Mevduat Yetkilendirmesi ayarı, hesabınıza gelen tüm ödemeleri engeller, eğer:

- Göndereni daha önce önceden yetkilendirdiyseniz.
- Fonları almak için bir işlem gönderirsiniz. Örneğin, bir yabancı tarafından başlatılan bir Escrow'ı tamamlayabilirsiniz.

:::info
Mevduat Yetkilendirmesi, istenmeyen XRP ödemelerini engellemek için en kullanışlıdır, çünkü bir ihraç eden, yalnızca ihraç edenle bir güven hattı oluşturmadıkça token almak için zaten alamaz.
:::

Ancak, stabilcoin ihraç eden biri olarak, kullanıcıların stabilcoin'i dış değerle geri almak için ödemeleri alabilmeniz gerekir; bu nedenle, müşterilerinizi önceden yetkilendirebilirsiniz ancak bu, her özel adres için kitaplıkta bir nesne depolamayı gerektirir ve bu da rezerv gereksiniminizi önemli ölçüde artırır.

Bu nedenle, Mevduat Yetkilendirmesi, şüpheli veya yaptırım altındaki varlıklardan para almakla ilgili düzenleyici gereklilikleri karşılamak için gerekli olmadıkça stabilcoin ihraç edenler için önerilmez.

Daha fazla bilgi için `Mevduat Yetkilendirmesi` sayfasına bakın.

---

## Gelen Güven Hatlarını Engelleme

Gelen Güven Hatlarını Engelleme ayarı, diğer kullanıcıların bir adrese güven hatları açmasını engeller. 

:::tip
Önlem olarak, operasyonel ve bekleme adreslerinizde bu ayarı etkinleştirmelisiniz, böylece bu adresler, yanlışlıkla bile olsa token ihraç edemez.
:::

Bu ayarı ihraç adresinizde etkinleştirmemelisiniz. 

Bu ayarı etkinleştirmek için, `"SetFlag": 15` (`asfDisallowIncomingTrustline`) içeren bir `AccountSet işlemi` gönderin.

---

## XRP'yi Engelleme

XRP'yi Engelleme ayarı, XRP Ledger kullanıcılarının bir adrese yanlışlıkla XRP göndermesini caydırmak için tasarlanmıştır. Bu, istendiğinde XRP'yi almak ve tutmak üzere yönlendirilmemiş ödemeleri geri iade etme maliyetlerini ve çabalarını azaltır. 

> **Önemli:** XRP'yi Engelleme bayrağı, protokol düzeyinde uygulanmamaktadır çünkü bu, adreslerin XRP tükendiğinde kalıcı olarak kullanılamaz hale gelmesine neden olabilir. 
> — Stabilcoin Yapılandırması

XRP'yi Engelleme bayrağı isteğe bağlıdır, ancak müşterilerden XRP almak istemiyorsanız, bunu ihraç adresinizde ve tüm operasyonel adreslerinizde etkinleştirmek isteyebilirsiniz.

---

## Yetki Gereksinimi

Yetki Gereksinimi ayarı, kullanıcıların çıkardığınız tokenları tutmalarını engeller, ta ki önce güven hatlarını açıkça onaylamadığınız sürece. 

:::note
Bu ayarı, XRP Ledger'da tokenlarınızı kimin tutmasının önemli olduğu düzenleyici gereklilikleri karşılamak için kullanabilirsiniz. Ancak, bu, tokenlarınızın kullanımını azaltabilir çünkü onayınız, kullanıcıların onları kullanması için bir dar boğaz olabilir.
:::

Daha fazla bilgi için `Yetkilendirilmiş Güven Hatları` sayfasına bakın.

---

## Tick Boyutu

Tick Boyutu ayarı, `Merkeziyetsiz Borsa` içindeki döviz kurlarını hesaplamak için kullanılan ondalık hanelerin sayısını kontrol eder. Daha yüksek bir Tick Boyutu, daha fazla hassasiyet ve daha az yuvarlama anlamına gelir. 

> **Dikkat:** Aşırı hassasiyet, ticaretlerin çoğunlukla döviz kuru bazında sıralandığı için rahatsız edici olabilir, bu nedenle bir tüccar, listenin üstüne çok az bir miktar daha sunabilir. 
> — Tick Boyutu

Tick Boyutu, yalnızca *döviz kurlarının* hassasiyetini kontrol eder, tokenın kendisinin hassasiyetini değil. Kullanıcılar, tokenın ihraç edeninin belirlediği Tick Boyutu ne olursa olsun çok büyük veya çok küçük miktarları gönderebilir ve tutabilirler.

Daha fazla bilgi için `Tick Boyutu` sayfasına bakın.

---

## Transfer Ücretleri

Transfer ücreti ayarı, kullanıcıların birbirine token göndermesi sırasında bir yüzde ücreti tahsil eder. Transfer ücreti, tokenları ihraç ederken veya ihraç adresiyle doğrudan geri alırken uygulanmaz. 

:::info
Eğer aynı adresten birçok token ihraç ederseniz, aynı transfer ücreti tüm bunlara uygulanır.
:::

Kullanıcılar bir transfer ücreti ile token gönderdiğinde, transfer ücretinin miktarı, hedef miktarın yanı sıra gönderim tarafından tahsil edilir, ancak yalnızca hedef miktar, alıcıya kredi olarak uygulanır. 

Daha fazla bilgi için `Transfer Ücretleri` sayfasına bakın.

---

### Operasyonel ve Bekleme Adresleri ile Transfer Ücretleri

Tüm XRP Ledger adresleri, operasyonel ve bekleme adresleri de dahil olmak üzere, token gönderirken ihraç edenin transfer ücretlerine tabidir. Eğer sıfırdan farklı bir transfer ücreti belirlediyseniz, operasyonel veya bekleme adresinizden ödeme yaparken ek göndermeniz gerekir.

admonition type="warning" name="Uyarı
Transfer ücretleri, doğrudan ihraç adresinden veya ihraç adresine token gönderirken uygulanmaz. İhraç adresi, XRP Ledger'de her zaman tokenlarını nominal değerinde kabul etmelidir. 
:::

Örneğin: Eğer ACME, %1'lik bir transfer ücreti belirlerse, bir müşteri adresinden ACME'nin ihraç adresine 5 EUR.ACME göndermek için XRP Ledger'daki maliyet tam olarak 5 EUR.ACME olacaktır. Ancak, müşteri, ACME'nin operasyonel adresine 5 EUR.ACME teslim etmek için 5.05 EUR.ACME göndermelidir. ACME, ACME'nin operasyonel adresine yapılan ödemeler için müşteri hesabını hem operasyonel adrese teslim edilen miktar hem de transfer ücreti için kredi vererek €5,05 olarak günceller.