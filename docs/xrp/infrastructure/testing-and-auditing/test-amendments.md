---
title: Değişiklikleri Test Et
seoTitle: Test Procedures for Rippled Changes
sidebar_position: 4
description: Önerilen değişiklikleri ağda etkinleştirilmeden önce test edebilirsiniz. Bu rehber, rippledin önerilen özelliklerinin nasıl test edileceğini ve bağımsız modun önemini açıklar.
tags: 
  - rippled
  - test
  - özelliği
  - bağımsız mod
  - Blockchain
keywords: 
  - rippled
  - test
  - özelliği
  - bağımsız mod
  - Blockchain
---

## Değişiklikleri Test Et

`rippled`'in önerilen değişiklikler tamamen üretim ağında etkinleştirilmeden önce nasıl davrandığını test edebilirsiniz. Konsensüs ağının diğer üyeleri bu özelliği etkinleştirmeyeceği için, sunucunuzu bağımsız modda çalıştırın.

:::warning
**Dikkat:** Bu yalnızca geliştirme amaçları için tasarlanmıştır.
:::

Bir özelliği zorla etkinleştirmek için, `rippled.cfg` dosyanıza değişiklik kısa adları ile bir `[features]` dizesi ekleyin. Her değişikliğin kendine ait bir satırı olmalıdır.



Örnek
```
[features]
MultiSign
TrustSetAuth
```




> **Anahtar Nokta:** `rippled`'in doğru yapılandırılması, güvenli ve sorunsuz bir test süreci sağlar.  
> — `rippled` Dokümantasyonu


## Daha Fazla Bilgi

Konsensüs ağında yapacağınız testler, önerilen değişikliklerin etkinleştirilmeden önce nasıl davranacağını anlamanıza yardımcı olur. Özellikle, bağımsız modda etkinleştirilen özellikleri kullanmak, olası hataları ve sorunları önceden tespit etmenizi sağlar.