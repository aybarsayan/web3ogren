---
title: Kontroller
seoTitle: Kontroller - XRP Ledger
sidebar_position: 4
description: Kontroller, kullanıcıların ertelenmiş ödemeler yaratmalarını sağlar. Fonlar kullanıcıların belirlediği alıcılara nakit olarak ödenebilir.
tags: 
  - Kontroller
  - Ödemeler
  - XRP Ledger
  - Dijital Ödemeler
  - Kripto Para
keywords: 
  - Kontroller
  - Ödemeler
  - XRP Ledger
  - Dijital Ödemeler
  - Kripto Para
---

# Kontroller

Kontroller özelliği, kullanıcıların kişisel kağıt çeklerine benzer şekilde **ertelenmiş ödemeler** oluşturmasını sağlar. Bir emanet veya ödeme kanalı gibi, bir çek oluşturulduğunda fonlar ayrılmış değildir; bu nedenle para yalnızca çek nakit edildiğinde hareket eder. 

> **Önemli Not:** Gönderen, bir çek nakit edildiğinde fonlara sahip değilse, işlem başarısız olur; alıcılar, çekin süresi dolana kadar başarısız işlemleri yeniden deneyebilir.  
> — XRP Ledger Rehberi

XRP Ledger Kontrollerinin süresi dolduktan sonra nakit edilemeyecek bitiş tarihleri olabilir. Alıcı, Çek süresi dolmadan başarılı bir şekilde nakit edemezse, Çek bir daha nakit edilemez, ancak nesne XRP Ledger'da birisi iptal edene kadar kalır. **Yalnızca gönderen ve alıcı**, Çek süresi dolmadan iptal edebilir. Çek nesnesi, gönderen çeki başarılı bir şekilde nakit ettiğinde veya birisi iptal ettiğinde Ledger'dan kaldırılır.

## Kullanım Durumları

- Kontroller, insanların bankacılık sektörü tarafından tanıdık ve kabul edilen bir süreç kullanarak fonları değiştirmelerine olanak tanır.
- Eğer belirlediğiniz alıcı, `Dearkıtırma Yetkisi` kullanarak yabancılardan doğrudan ödemeleri engelliyorsa, bir çek iyi bir alternatiftir.
- Esnek çek nakitleri: Alıcı, Çeki belirli bir minimum ve maksimum miktar arasında nakit edebilir.

---

## Çek Yaşam Döngüsü

1. Gönderen bir [CheckCreate transaction][] gönderir. Bu işlem:
    - Alıcıyı tanımlar.
    - Bir son tarih belirler.
    - Hesabından alınabilecek maksimum miktarı belirler.
2. İşlem işlendiğinde, XRP Ledger bir `Check` nesnesi oluşturur. Çek, gönderen veya alıcı tarafından bir [CheckCancel transaction][] ile iptal edilebilir.
3. Alıcı, fonları transfer eden ve `Check` nesnesini yok eden bir [CheckCash transaction][] gönderir. Alıcıların çekleri nakit etmek için iki seçeneği vardır:
    - **Tam Miktar:** Çekin maksimumunu aşmayan kesin bir miktar belirtirler.
    - **Esnek Miktar:** Bir minimum miktar belirtirler ve XRP Ledger, çek maksimumuna kadar mümkün olan en fazla miktarı sağlar. Eğer gönderen, belirtilen minimumu karşılayacak kadar fonu yoksa, işlem başarısız olur.
4. Eğer çek, alıcı çeki nakit etmeden önce süresi dolarsa, `Check` nesnesi herkes iptal edene kadar kalır.

---

## Ayrıca Bakınız

XRP Ledger'daki Kontroller hakkında daha fazla bilgi için:

- `İşlem Referansı`
    - [CheckCreate][]
    - [CheckCash][]
    - [CheckCancel][]
- `Kontroller Eğitimi`
    - `Bir Çek Gönder`
    - `Kontrol Ara`
    - `Kesin bir miktar için bir çeki nakit et`
    - `Esnek bir miktar için bir çeki nakit et`
    - `Bir Çeki İptal Et`
- [Kontroller değişikliği][]

İlgili özellikler hakkında daha fazla bilgi için:

* `Dearkıtırma Yetkisi`
* `Emanet`
* `Ödeme Kanalları Eğitimi`

