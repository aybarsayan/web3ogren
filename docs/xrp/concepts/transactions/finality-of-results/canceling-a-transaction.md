---
title: Bir İşlemi İptal Etmek
seoTitle: XRP Ledgerda İşlem İptali
sidebar_position: 4
description: Gönderilmiş bir işlemin ne zaman ve nasıl iptal edilebileceğini anlayın. XRP Ledgerın işlem iptal süreci ve dikkate almanız gereken önemli noktalar hakkında bilgi edinin.
tags: 
  - işlem iptali
  - XRP Ledger
  - konsensüs süreci
  - işlem maliyeti
  - AccountSet işlemi
keywords: 
  - işlem iptali
  - XRP Ledger
  - konsensüs süreci
  - işlem maliyeti
  - AccountSet işlemi
---

## Bir İşlemi İptal Etmek

XRP Ledger'ın önemli ve amaçlı bir özelliği, bir `işlemin` sonucunun, `konsensüs süreci` tarafından doğrulanan bir `defter versiyonuna` dahil edilir edilmez `kesin` olmasıdır.

Bir işlem henüz doğrulanmış bir deftere dahil edilmemişse, aynı gönderim adresinden aynı `Sequence` değeri ile başka bir işlem göndererek etkili bir şekilde iptal edilebilir. **Yerine geçecek işlemin bir şey yapmasını istemiyorsanız**, **hiçbir seçeneği olmayan bir [AccountSet işlemi][]** gönderin.

:::warning Ağda dağıtıldıktan sonra geçerli bir işlemi iptal etmenin kesin bir yolu yoktur. Burada açıklanan süreç, ağın ne kadar meşgul olduğu, ağın topolojisi ve önerilen işlemin `işlem maliyeti` gibi faktörlere bağlı olarak çalışabilir veya çalışmayabilir.:::

Eğer işlem zaten ağa dağıtılmış ve sunucuların konsensüs önerilerinde bir `aday işlem` olarak önerilmişse, **iptal etmek için çok geç olabilir.** Daha önce "limbo"da sıkışmış veya `işlem maliyeti` mevcut gereksinimleri karşılamadığından beklemede bulunan bir işlemi iptal etme olasılığınız daha yüksek olacaktır. Bu durumda, yerine geçecek işlem ya hiçbir şey yapmaz ya da iptal edilecek işlemle aynı şeyi yapar. **Yerine geçecek işlem, eğer işlem maliyeti daha yüksekse daha başarılı olma olasılığı taşır.**

> **Örneğin,** 11, 12 ve 13 sıralama numaralarıyla 3 işlem göndermeye çalıştığınızda, ancak işlem 11 bir şekilde kaybolursa veya ağa yayılmak için yeterince yüksek bir `işlem maliyetine` sahip değilse, o zaman işlem 11'i, sıralama numarası 11 olan hiçbir seçeneği olmayan bir AccountSet işlemi göndererek iptal edebilirsiniz. Bu, yeni işlem 11 için işlem maliyetini yok etmekten başka bir şey yapmaz, fakat işlemler 12 ve 13'ün geçerli hale gelmesini sağlar.  
> — XRP Ledger

Bu yaklaşım, 12 ve 13 işlemlerini yeniden numaralandırıp yeniden göndermeye tercih edilir, çünkü bununla işlemlerin farklı sıralama numaraları altında etkin bir şekilde kopyalanmasını önler.

Bu şekilde, hiçbir seçeneği olmayan bir AccountSet işlemi, kanonik "[no-op](http://en.wikipedia.org/wiki/NOP)" işlemi olarak kabul edilir.


Ek Bilgi



