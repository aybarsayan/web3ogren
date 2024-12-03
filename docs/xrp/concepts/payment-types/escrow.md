---
title: Escrow
seoTitle: Escrow - XRP Ledger
sidebar_position: 4
description: Escrow, belirli koşullar yerine getirildiğinde fonları tutar; XRP Ledger, escrowsu otomatik hale getirir ve üç çeşit escrow destekler.
tags: 
  - escrow
  - XRP Ledger
  - finansal işlemler
  - kripto-koşullar
  - ödeme türleri
  - escrow türleri
keywords: 
  - escrow
  - XRP Ledger
  - finansal işlemler
  - kripto-koşullar
  - ödeme türleri
  - escrow türleri
---

# Escrow

Geleneksel olarak, bir escrow, iki taraf arasında finansal işlemleri kolaylaştıran bir sözleşmedir. Tarafsız bir üçüncü taraf, fonları alır ve tutar ve yalnızca sözleşmede belirtilen koşullar yerine getirildiğinde bunları hedef alana serbest bırakır. Bu yöntem her iki tarafın da yükümlülüklerini yerine getirmesini sağlar.

:::tip
**İpucu:** Escrow işlemleri, iki tarafın güvenliği için önemli bir araçtır. Taraflar arasındaki güveni artırır.
:::

XRP Ledger, escrows'u bir adım öteye taşıyarak, üçüncü tarafın yerini defterde yerleşik bir otomatik sistemle değiştirir. Bir escrow, koşullar yerine getirilene kadar kullanılamayan veya yok edilemeyen XRP'yi kilitler.

## Escrow Türleri

XRP Ledger üç çeşit escrow'u destekler:

- **Zaman Tabanlı Escrow:** Fonlar yalnızca belirli bir süre geçtikten sonra kullanılabilir hale gelir.
- **Koşullu Escrow:** Bu escrow, karşılık gelen bir koşul ve yerine getirme ile oluşturulur. Koşul, fonlar üzerinde bir kilit görevi görür ve doğru yerine getirme anahtarı sağlanmadıkça serbest bırakılmaz.
- **Kombinasyon Escrow:** Bu escrow, zaman tabanlı ve koşullu escrow'un özelliklerini birleştirir. Escrow, belirlenen süre geçene kadar tamamen erişilemezdir; bu süreden sonra doğru yerine getirme sağlandığında fonlar serbest bırakılabilir.

## Escrow Yaşam Döngüsü

1. Gönderen, `EscrowCreate` işlemi kullanarak bir escrow oluşturur. Bu işlem şunları tanımlar:

    - Kilitlenecek XRP miktarı.
    - XRP'yi serbest bırakma koşulları.
    - XRP'nin alıcısı.

2. İşlem işlendiğinde, XRP Ledger, escrowed XRP'yi tutan bir `Escrow` nesnesi oluşturur.

3. Alıcı, XRP'yi iletmek için bir `EscrowFinish` işlemi gönderir. **Koşullar yerine getirilmişse, bu `Escrow` nesnesini yok eder ve XRP'yi alıcıya teslim eder.**

:::info
Eğer escrow'un bir sona erme süresi varsa ve belirtilen zamandan önce başarıyla tamamlanmazsa, escrow süresi dolmuş olur. Süresi dolmuş bir escrow, `EscrowCancel` işlemi ile iptal edilene kadar defterde kalır, böylece `Escrow` nesnesi yok edilir ve XRP alıcıya iade edilir.
:::

## Escrow Durumları

Aşağıdaki diyagram, bir Escrow'un ilerleyebileceği durumları göstermektedir:



Diyagram, escrow'un "sonra bitir" zamanı (`FinishAfter` alanı), kripto-koşul (`Condition` alanı) ve sona erme zamanı (`CancelAfter` alanı) için üç olası kombinasyona ait üç farklı durumu göstermektedir:

- **Zaman Tabanlı Escrow (solda):** Sadece bir sonra bitir zamanı ile, escrow **Held** durumunda oluşturulur. Belirtilen süre geçtikten sonra, **Ready** hale gelir ve herkes bunu tamamlayabilir. Eğer escrow'un bir sona erme zamanı varsa ve kimse o süre geçmeden tamamlarsa, escrow **Expired** hale gelir. Süresi dolmuş durumda, bir escrow tamir edilemez ve herkes bunu iptal edebilir. Eğer escrow'un `CancelAfter` alanı yoksa, hiç bir zaman süresi dolmaz ve iptal edilemez.

- **Kombinasyon Escrow (ortada):** Eğer escrow, hem bir kripto-koşul (`Condition` alanı) _hem de_ bir "sonra bitir" zamanı (`FinishAfter` alanı) belirtiyorsa, escrow, bitir zamanına kadar **Held** olarak kalır. Daha sonra, **Conditionally Ready** hale gelir ve doğru yerine getirme sağlandığında tamamlabilir. Eğer escrow'un bir sona erme zamanı (`CancelAfter` alanı) varsa, ve kimse o süre geçmeden tamamlarsa, escrow **Expired** hale gelir. Süresi dolmuş durumda, bir escrow tamir edilemez ve herkes bunu iptal edebilir. Eğer escrow'un `CancelAfter` alanı yoksa, hiç bir zaman süresi dolmaz ve iptal edilemez.

- **Koşullu Escrow (sağda):** Eğer escrow, bir kripto-koşul (`Condition` alanı) belirtiyorsa ve bir bitiş zamanı yoksa, escrow oluşturulduğu anda **Conditionally Ready** olur. Bu süre boyunca, kimse escrow'u tamamlayabilir, ama yalnızca doğru yerine getirme sağlandığından. Eğer kimse escrow'u sona erme zamanından önce tamamlarsa (`CancelAfter` alanı), escrow **Expired** hale gelir. (Bir bitiş zamanı olmayan bir escrow _mutlaka_ bir sona erme zamanına sahip olmalıdır.) Süresi dolmuş durumda, escrow tamir edilemez ve herkes bunu iptal edebilir.

## Sınırlamalar

- Escrow yalnızca XRP ile çalışır, token'larla değil.
- Maliyetler, küçük miktarlar için uygulanabilir hale getirmeyebilir.
    - Escrow, bir escrow oluşturmak için bir işlem ve tamamlamak ya da iptal etmek için bir işlem gerektirir. Kripto-Koşullar, genellikle daha yüksek `işlem maliyeti` gerektirir.
    - Escrow tamamlanmadığı sürece, gönderen `Escrow` nesnesinin `rezerv gereksinimi` için sorumludur.
- Geçmiş zaman değerleriyle bir escrow oluşturamazsınız.
- Zamanlı serbest bırakmalar ve sona erme işlemleri, `defter kapanma zamanlarına` göre çözülür. Pratikte, gerçek serbest bırakma ve sona erme zamanları, defterlerin kapanmasına bağlı olarak yaklaşık beş saniye kadar değişebilir.
- Desteklenen tek kripto-koşul türü PREIMAGE-SHA-256'dır.

## EscrowFinish İşlem Maliyeti

Kripto-koşulları kullanırken, EscrowFinish işlemi, **kripto-koşul yerine getirme doğrulama sürecinin yüksek yükü nedeniyle** `daha yüksek işlem maliyeti` ödemelidir.

Gerekli ek işlem maliyeti, yerine getirmenin boyutuna orantılıdır. İşlem `çok imzalanmış` ise, çok imzalama maliyeti yerine getirme maliyetine eklenir.

Şu anda, yerine getirmeli bir EscrowFinish için minimum işlem maliyeti **330 `XRP damlası` artı yerine getirmenin boyutundaki her 16 byte için 10 damla** gerektirir.

:::info
Yukarıdaki formül, bir işlemin referans maliyetinin 10 XRP damlası olduğu varsayımına dayanmaktadır.
:::

Eğer `Ücret Oylaması` `reference_fee` değerini değiştirirse, formül yeni referans maliyete göre ölçeklenir. Yerine getirme ile bir EscrowFinish işlemi için genelleştirilmiş formül aşağıdaki gibidir:

```
reference_fee * (signer_count + 33 + (fulfillment_bytes / 16))
```

## Ayrıca Bakınız

XRP Ledger'daki Escrow hakkında daha fazla bilgi için aşağıdakilere bakın:

- `Escrow Eğitimleri`
- `İşlem Referansı`
    - [EscrowCreate işlemi][]
    - [EscrowFinish işlemi][]
    - [EscrowCancel işlemi][]
- `Defter Referansı`
    - `Escrow nesnesi`

Ripple'ın 55 milyar XRP kilitleme süreci hakkında daha fazla bilgi için [Ripple'ın Insights Blog'u](https://ripple.com/insights/ripple-to-place-55-billion-xrp-in-escrow-to-ensure-certainty-into-total-xrp-supply/) adresini ziyaret edin.

