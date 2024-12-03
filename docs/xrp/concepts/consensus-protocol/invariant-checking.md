---
title: Değişmez Kontrol
seoTitle: Değişmez Kontrol - XRP Defteri Güvenlik Özelliği
sidebar_position: 4
description: Değişmez kontrol, XRP Defterinin güvenlik özelliğidir. Bu mekanizma, işlem süreci boyunca belirli değişmezliklerin doğruluğunu sağlar.
tags: 
  - Değişmez Kontrol
  - XRP Defteri
  - Güvenlik
  - İşlem Süreci
  - Değişmezlikler
keywords: 
  - Değişmez Kontrol
  - XRP Defteri
  - Güvenlik
  - İşlem Süreci
  - Değişmezlikler
---

## Değişmez Kontrol

Değişmez kontrol, XRP Defteri'nin bir güvenlik özelliğidir. Belirli _değişmezliklerin_ tüm işlemler boyunca doğru kalmasını garanti eden, normal işlem sürecinden ayrılmış bir dizi kontrolden oluşur.

:::tip
Değişmez kontrol, XRP Defteri'nin güvenliğini sağlamak için kritik bir rol oynar.
:::

Birçok güvenlik özelliğinde olduğu gibi, değişmez kontrolün asla bir şey yapması gerekmediğini umuyoruz. Ancak, XRP Defteri'nin değişmezliklerini anlamak, onların XRP Defteri'nin işlem süreci üzerinde katı limitleri tanımladığı ve bir işlemin bir değişmez kontrolü ihlal ettiği nadir durumlarda sorunu tanıma açısından faydalı olabilir.

Değişmezlikler tetiklenmemelidir, ancak keşfedilmemiş veya henüz oluşturulmamış hatalardan XRP Defteri'nin bütünlüğünü sağlamaktadır.

---

## Neden Vardır

- XRP Defteri'nin kaynak kodu karmaşık ve geniştir; yanlış bir şekilde çalıştırma potansiyeli yüksektir.
- Yanlış bir işlemin maliyeti yüksek ve hiçbir standart tarafından kabul edilemez.

Özellikle, yanlış işlem yürütmeleri geçersiz veya bozuk veriler oluşturabilir ve bu veriler daha sonra ağı "imkansız" bir duruma sokacak şekilde sunucuları sürekli çökertir, bu da tüm ağı durdurabilir.

> Yanlış işlem işleme, XRP Defteri'nde güvenin değerini zayıflatır.  
> — XRP Güvenlik Uzmanı

Değişmez kontrol, güvenilirlik özelliğini ekleyerek tüm XRP Defteri'ne değer katar.

---

## Nasıl Çalışır

Değişmez kontrolü, her işlemden sonra otomatik olarak gerçek zamanlı olarak çalışan ikinci bir kod katmanıdır. İşlemin sonuçları deftere kaydedilmeden önce, değişmez kontrolü bu değişikliklerin doğruluğunu inceler. İşlemin sonuçları, XRP Defteri'nin katı kurallarından birini bozarsa, değişmez kontrolü işlemi reddeder. Bu şekilde reddedilen işlemler `tecINVARIANT_FAILED` koduyla sonuçlanır ve deftere etki olmadan eklenir.

Bir işlemi `tec` sınıfı koduyla deftere eklemek için bazı minimum süreçler gereklidir. Eğer bu minimum süreç değişmezliği hala ihlal ederse, işlem `tefINVARIANT_FAILED` koduyla başarısız olur ve deftere hiç eklenmez.

---

## Aktif Değişmezlikler

XRP Defteri, her işlemde aşağıdaki değişmezlikleri kontrol eder:

[[Kaynak]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L92 "Kaynak")

- `İşlem Ücreti Kontrolü`

[[Kaynak]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L118 "Kaynak")

- `XRP Oluşturulmadı`

[[Kaynak]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L146 "Kaynak")

- `Hesap Kökleri Silinmedi`

[[Kaynak]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L173 "Kaynak")

- `XRP Bakiyesi Kontrolü`

[[Kaynak]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L197 "Kaynak")

- `Defter Girdi Türleri Eşleşmeli`

[[Kaynak]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L224 "Kaynak")

- `XRP Güven Hattı Olmamalı`

[[Kaynak]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L251 "Kaynak")

- `Kötü Teklif Olmamalı`

[[Kaynak]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L275 "Kaynak")

- `Sıfır Eskravo Olmamalı`

[[Kaynak]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L300 "Kaynak")

- `Geçerli Yeni Hesap Kökü`

---

### İşlem Ücreti Kontrolü

- **Değişmez Durum(lar):**
    - `işlem maliyeti` miktarı asla negatif veya işlemde belirtilen maliyetten büyük olamaz.

### XRP Oluşturulmadı

- **Değişmez Durum(lar):**
    - Bir işlem XRP oluşturamaz ve yalnızca XRP `işlem maliyetini` yok etmelidir.

### Hesap Kökleri Silinmedi

- **Değişmez Durum(lar):**
    - Bir `hesap` defterden, yalnızca bir [AccountDelete işlemi][] ile silinebilir.
    - Başarılı bir AccountDelete işlemi her zaman tam olarak 1 hesabı siler.

### XRP Bakiyesi Kontrolü

- **Değişmez Durum(lar):**
    - Bir hesabın XRP bakiyesi XRP türünde olmalıdır ve 0'dan az veya tam olarak 100 milyar XRP'den fazla olamaz.

### Defter Girdi Türleri Eşleşmeli

- **Değişmez Durum(lar):**
    - İlgili değiştirilmiş defter girdileri tür açısından eşleşmeli ve eklenen girdiler `geçerli bir tür` olmalıdır.

### XRP Güven Hattı Olmamalı

- **Değişmez Durum(lar):**
    - XRP kullanan `güven hatları` kabul edilmez.

### Kötü Teklif Olmamalı

- **Değişmez Durum(lar):**
    - `Teklifler` negatif olmayan miktarlar için olmalı ve XRP'den XRP'ye olmamalıdır.

### Sıfır Eskravo Olmamalı

- **Değişmez Durum(lar):**
    - Bir `eskravo` girişi 0'dan fazla ve 100 milyar XRP'den az tutmalıdır.

### Geçerli Yeni Hesap Kökü

- **Değişmez Durum(lar):**
    - Yeni bir `hesap kökü` bir ödeme sonucunda olmalıdır.
    - Yeni bir hesap kökü doğru bir başlangıç `sırasına` sahip olmalıdır.
    - Bir işlem birden fazla yeni `hesap` oluşturamaz.

---

### ValidNFTokenPage

- **Değişmez Durum(lar):**
    - Mint edilen veya yakılan NFT sayısı yalnızca `NFTokenMint` veya `NFTokenBurn` işlemleri ile değiştirilebilir.
    - Başarılı bir NFTokenMint işlemi NFT sayısını artırmalıdır.
    - Başarısız bir NFTokenMint işlemi mint edilen NFT sayısını değiştirmemelidir.
    - Bir NFTokenMint işlemi yakılan NFT sayısını değiştiremez.
    - Başarılı bir NFTokenBurn işlemi yakılan NFT sayısını artırmalıdır.
    - Başarısız bir NFTokenBurn işlemi yakılan NFT sayısını değiştirmemelidir.
    - Bir NFTokenBurn işlemi mint edilen NFT sayısını değiştiremez.

### NFTokenCountTracking

- **Değişmez Durum(lar):**
    - Sayfa sahibi ile doğru bir şekilde ilişkilendirilmelidir.
    - Sayfa, sonraki ve önceki bağlantılar arasında doğru bir şekilde sıralanmalıdır.
    - Sayfa geçerli bir NFT sayısını içermelidir.
    - Bu sayfadaki NFT'ler daha düşük veya daha yüksek bir sayfaya ait olmamalıdır.
    - NFT'ler sayfada doğru bir şekilde sıralanmalıdır.
    - Her URI, mevcutsa, boş olmamalıdır.

---

## Ayrıca Bakınız

- **Blog:**
    - [Defteri Koruma: Değişmez Kontrol](https://xrpl.org/blog/2017/invariant-checking.html)

- **Depo:**
    - [Değişmez Check.h](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h)
    - [Değişmez Check.cpp](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.cpp)
    - [Sistem Parametreleri](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/SystemParameters.h#L43)
    - [XRP Miktarı](https://github.com/XRPLF/rippled/blob/develop/src/ripple/basics/XRPAmount.h#L244)
    - [Defter Formatları](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/protocol/LedgerFormats.h#L36-L94)

- **Diğer:**
    - `Yetkili Güven Hatları`
    - [Bir İşlem için Bakiye Değişikliklerini Hesaplama](https://xrpl.org/blog/2015/calculating-balance-changes-for-a-transaction.html#calculating-balance-changes-for-a-transaction)

