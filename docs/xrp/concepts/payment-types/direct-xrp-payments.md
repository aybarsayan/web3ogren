---
title: Doğrudan XRP Ödemeleri
seoTitle: XRP Ledger ile Doğrudan Ödeme Rehberi
sidebar_position: 4
description: Doğrudan XRP ödemeleri, XRP Ledgerda değer göndermenin en hızlı ve en basit yoludur. Bu süreçteki temel bilgiler ve aşamalar hakkında bilgi edinin.
tags: 
  - XRP
  - doğrudan ödemeler
  - XRP Ledger
  - değer transferi
  - ödeme işlemi
keywords: 
  - XRP
  - doğrudan ödemeler
  - XRP Ledger
  - değer transferi
  - ödeme işlemi
---

# Doğrudan XRP Ödemeleri

Herhangi bir finansal sistemin temeli değer transferidir. **XRP Ledger'da** en hızlı ve en basit yöntem, bir hesapla diğer hesap arasında doğrudan XRP ödemesidir. Birçok işlem gerektiren diğer ödeme yöntemlerinin aksine, doğrudan XRP ödemesi tek bir işlemde, aracı olmaksızın gerçekleştirilir ve tipik olarak 8 saniye veya daha kısa sürede tamamlanır. Doğrudan ödemeleri yalnızca XRP'nin gönderilen ve alınan para birimi olduğu durumlarda yapabilirsiniz.

## Doğrudan XRP Ödeme Yaşam Döngüsü

1. Gönderen bir [Ödeme işlemi][] oluşturur; bu işlem, ödemenin parametrelerini belirler. XRP, gönderilen ve alınan para birimi olduğunda işlem, doğrudan bir XRP ödemesi olur.

2. İşlem işleme, işlemin parametrelerini ve koşullarını kontrol eder; eğer herhangi bir kontrol başarısız olursa, ödeme başarısız olur.

    - Tüm alanlar düzgün bir şekilde formatlanmıştır.
    - Gönderen adres, XRP Ledger'da fonlanmış bir hesaptır.
    - Tüm sağlanan imzalar, gönderen adres için geçerlidir.
    - Hedef adres, gönderen adresten farklıdır.
    - Gönderen, ödemeyi göndermek için yeterli **XRP** bakiyesine sahiptir.

3. İşlem işleme, alıcı adresini kontrol eder; eğer herhangi bir kontrol başarısız olursa, ödeme başarısız olur.

    - Eğer alıcı adres fonlanmışsa, motor ek ayarlarına göre ek kontroller yapar, örneğin `Deposit Authorization`.
    - Eğer alıcı adres fonlanmamışsa, ödeme, minimum `hesap rezervi` gereksinimini karşılamak için yeterli XRP gönderecek mi kontrol eder. Rezerv karşılanırsa, adres için yeni bir hesap oluşturulur ve başlangıç bakiyesi alınan miktardır.

4. Defter, ilgili hesaplardan borç ve alacak işlemlerini gerçekleştirir.

    :::info
    Gönderen, XRP `işlem maliyeti` ile de borçlandırılır.
    :::

---

## Ayrıca Bakınız

- **Eğitimler:**
    - `XRP Gönder (Etkileşimli Eğitim)`
    - `WebSocket ile Gelen Ödemeleri İzleme`
- **Referanslar:**
    - [Ödeme işlemi][]
    - `İşlem Sonuçları`
    - [account_info yöntemi][] - XRP bakiyelerini kontrol etmek için

