---
title: "Stabilite ve sürümler"
description: Deno sürüm takvimi ve uzun süreli destek (LTS) kanalları hakkında bilgiler sunmaktadır. Bu içerik, yeni API'lerin kararlılığı ve standart kütüphane modüllerinin durumu konusunda rehberlik eder.
keywords: [Deno, sürüm takvimi, uzun süreli destek, LTS, API kararlılığı, standart kütüphane, kararsız bayraklar]
---

Deno 1.0.0 itibarıyla, `Deno` ad alanı API'leri kararlıdır. Bu, 1.0.0 altında çalışan kodun gelecekteki sürümlerde de çalışmasını sağlamak için çaba göstereceğimiz anlamına gelir.

## Sürüm takvimi, kanallar ve uzun süreli destek

Deno, aylık bir takvimde yeni bir kararlı, küçük sürüm (örneğin, v2.1.0, v2.0.0) yayınlar.

En son küçük sürüm için hata düzeltmelerini içeren yaman sürümler gerektiğinde yayınlanır - yeni bir küçük sürüm yayınlanmadan önce iki veya üç yamalı sürüm bekleyebilirsiniz.

### Sürüm kanalları

Deno, 4 sürüm kanalı sunar:

- `stable` - yukarıda açıklandığı gibi, bir semver küçük/yaman sürümü. Bu, **varsayılan** dağıtım kanalıdır ve çoğu kullanıcı için önerilir.
- `lts` - belirli bir kararlı sürüm için uzun süreli destek, sık sık güncelleme yapmak istemeyen kurumsal kullanıcılar için önerilir. Ayrıntılar aşağıda.
- `rc` - yaklaşan semver küçük sürümü için bir sürüm adayı.
- `canary` - günde birden fazla kez değişen kararsız bir sürüm, son hata düzeltmelerini ve `stable` kanalda yer alabilecek yeni özellikleri denemeyi sağlar.

### Uzun Süreli Destek (LTS)

Deno v2.1.0'dan itibaren (Kasım 2024'te yayınlanacak) Deno, bir LTS (uzun süreli destek) kanalı sunacaktır.


LTSS hakkında daha fazla bilgi

Bir LTS kanalı, yalnızca geriye dönük uyumlu hata düzeltmeleri ile bakımı yapılacak bir semver küçük sürümüdür.

![Deno uzun süreli destek takvimi](../../../images/cikti/denoland/runtime/fundamentals/images/deno-lts-support.png)

Yeni bir LTS sürümü yılda iki kez yayınlanır ve **6 ay süreyle desteklenir**, kullanıcılara LTS sürümleri arasında güncelleme yapmak için bir aylık bir pencere verir. Bir LTS kanalının yeni bir yamalı sürümü en az **çeyrekte bir** yayınlanır.

LTS'ye uygun geri dönüşler, güvenlik düzeltmeleri ve hata düzeltmeleri (çökme, yanlış yanıtlar) içerir.

Kritik performans iyileştirmeleri **ciddiyetine** bağlı olarak geri alınabilir.

API değişiklikleri ve büyük yeni özellikler **çarpılamaz**.


## Kararsız API'ler

Yeni API'ler tanıtıldığında, bunlar önce kararsız olarak işaretlenir. Bu, API'nin gelecekte değişebileceği anlamına gelir. Bu API'ler, açıkça bir kararsız bayrağı geçmediğiniz sürece kullanılabilir değildir, örneğin `--unstable-kv` gibi.
> **Önemli Not:** `Ayrıca, `--unstable-*` bayrakları hakkında daha fazla bilgi edinin`.

Ayrıca, Deno'nun kararsız olarak kabul edilen bazı runtime dışı özellikleri vardır ve bunlar kararsız bayraklarla kilitlenmiştir. Örneğin, `--unstable-sloppy-imports` bayrağı, dosya uzantıları belirtmeden `import` etmeyi etkinleştirmek için kullanılır.

## Standart kütüphane

Deno Standart Kütüphanesi (https://jsr.io/@std) çoğunlukla kararlıdır. 1.0.0 veya üzeri sürümdeki tüm standart kütüphane modülleri kararlı olarak kabul edilir. Diğer tüm modüller (0.x) kararsız olarak kabul edilir ve gelecekte değişebilir.

:::warning
Kararsız standart kütüphane modüllerini üretim kodlarında kullanmak önerilmez, ancak yeni özellikleri denemek ve Deno ekibine geri bildirim sağlamak için harika bir yoldur.
:::

Kararsız standart kütüphane modüllerini kullanmak için herhangi bir kararsız bayrak kullanmak gerekli değildir.