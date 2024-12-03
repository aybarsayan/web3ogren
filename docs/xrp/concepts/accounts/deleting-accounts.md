---
title: Hesap Silme
seoTitle: XRP Ledger Hesap Silme Rehberi
sidebar_position: 4
description: XRP Ledger hesabının silinmesi süreci ve gereksinimleri hakkında detaylı bilgi sunar.
tags: 
  - XRP Ledger
  - AccountDelete
  - işlem maliyeti
  - rezerv
  - hesap silme
keywords: 
  - XRP
  - hesap silme
  - AccountDelete
  - XRP Ledger
  - işlem maliyeti
  - rezerv
---

## Hesap Silme

Bir hesabın sahibi, hesabı ve ilgili girişleri defterden silmek için bir [AccountDelete transaction][] gönderebilir ve hesabın kalan XRP bakiyesinin çoğunu başka bir hesaba gönderir. Hesapların gereksiz yere oluşturulup silinmesini önlemek için, bir hesabın silinmesi, `işlem maliyeti` olarak olağandışı yüksek miktarda XRP yakılmasını gerektirir.

Bazı türdeki ilişkili defter girişleri, bir hesabın silinmesini engeller. Örneğin, bir fungible token'ın émisyoncusu, o token'ın sıfırdan büyük bir bakiyesini elinde bulunduran biri varken silinemez.

:::tip
**Önemli Not:** Bir hesap silindikten sonra, defterde `hesap oluşturma` normal yöntemiyle yeniden oluşturulabilir. Silinmiş ve yeniden oluşturulmuş bir hesap, ilk kez oluşturulan bir hesaptan farklı değildir.
:::

## Gereksinimler

Silinmesi için bir hesabın aşağıdaki gereksinimleri karşılaması gerekir:

- Hesabın `Sequence` numarası artı 256, mevcut [Defter İndeksi][]'nden küçük olmalıdır.
- Hesap, aşağıdaki türdeki `defter girişleri` ile bağlantılı olmamalıdır (gönderen ya da alıcı olarak):
    - `Escrow`
    - `PayChannel`
    - `RippleState`
    - `Check`
- Hesap, defterde 1000 nesneden daha azına sahip olmalıdır.
- **İşlem**, bir nesne için en az `sahip rezervi` kadar özel bir [işlem maliyeti][] ödemelidir (şu anda 2 XRP).

---

## Silme Maliyeti

:::danger 
[AccountDelete transaction][] işlem maliyeti, işlem silinme gereksinimlerini karşılamadığı için başarısız olsa bile, işlem doğrulanmış bir deftere eklendiğinde her zaman geçerlidir. Hesap silinemeyecekse yüksek işlem maliyetini ödeme olasılığını büyük ölçüde azaltmak için, bir AccountDelete transaction gönderirken `fail_hard` seçeneğini kullanın.
:::

Bitcoin ve birçok diğer kripto para biriminden farklı olarak, XRP Ledger'ın kamu defter zincirinin her yeni versiyonu, her yeni hesapla birlikte büyüyen defterin tam durumunu içerir. Bu nedenle, gerekli olmadıkça yeni XRP Ledger hesapları oluşturmamalısınız. Hesabı silerek, bir hesabın 10 XRP'lik `rezerv` miktarının bir kısmını kurtarabilirsiniz, ancak bunu yapmak için hala en az 2 XRP yakmalısınız.

Birçok kullanıcı adına değer gönderen ve alan kurumlar, `**Kaynak Etiketleri** ve **Hedef Etiketleri**` kullanarak, yalnızca XRP Ledger'da bir (veya birkaç) hesap kullanarak müşterilerinden gelen ve giden ödemeleri ayırt edebilirler.

