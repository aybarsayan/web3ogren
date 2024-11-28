---
title: Cross Chain Program FAQ - BNB Greenfield Cross Chain Integration
description: BNB Greenfield sıkça sorulan sorular listesi hakkında cross-chain program. Bu içerik, BSC ile BNB Greenfield arasında mirroring uygulamaları ve özellikleri hakkında bilgi sunar. Kullanıcıların hangi nesnelerin taklit edileceği ve ortaya çıkabilecek değişiklikler hakkında bilgilendirme sağlar.
keywords: [BNB Greenfield Cross Chain, BNB Greenfield Erişim Kontrolü, NFT, mirroring, BSC]
---

# Cross Chain Program FAQ

### Mirroring'in avantajları nelerdir?
> Nesnelerin kontrolünü BSC üzerindeki akıllı sözleşmeye devrederek ve zincir üzerinde yönetimi sağlayarak, nesne mirroring'i BNB Greenfield üzerindeki merkeziyetsiz depolama üzerinde tüm BSC dApp'lerine daha fazla esneklik ve kontrol sağlar.  
> — BNB Greenfield Ekibi

Nesne mirroring, BSC'nin yeteneklerinden ve akıllı sözleşme işlevselliğinden yararlanarak, iki platform arasında geliştirilmiş işlevsellik ve birlikte çalışabilirlik sunar.

---

### Mirroring BSC'de nasıl uygulanmaktadır?
BSC üzerindeki mirroring, Greenfield Blockchain'den BSC'ye **kaynakların taklit edilmesine** olanak tanır. Bu kaynaklar ticari olmayan tokenlar (NFT'ler) olarak temsil edilir. Aşağıdaki öğeleri içerir:
- **Bucket'lar**
- **Nesneler**
- **Gruplar**

Ayrıca, bir grup içerisindeki üyeler, izinleri temsil eden ERC-1155 tokenları olarak taklit edilebilir.

:::tip
BSC'de taklit edildikten sonra, bu kaynaklar BSC ağı üzerindeki akıllı sözleşmeler tarafından doğrudan yönetilebilir.
:::

BSC üzerinde gerçekleştirilen herhangi bir işlem, Greenfield üzerindeki veri saklama formatını, erişim izinlerini ve diğer yönleri etkiler ve BSC üzerinde yapılan değişikliklerin Greenfield'de yansıtılmasını sağlar. Şu anda, taklit edilen NFT'ler transfer edilemez, ancak **transfer edilebilme yeteneği gelecekte tanıtılacaktır**.

---

### Nesneler varsayılan olarak BSC'ye mi taklit edilmektedir?
BNB Greenfield'den BSC'ye nesnelerin taklit edilmesi, nesne oluşturulduğunda otomatik olarak gerçekleşmez. Kullanıcıların, işlem gazı gerektirdiğinden, bucket veya nesne düzeyinde seçilen nesneler için mirroring sürecini **manuel olarak tetiklemesi** gerekir. Bu, kullanıcıların hangi nesnelerin taklit edileceği üzerinde kontrol sahibi olmalarını sağlarken, ilgili maliyetlerin farkında olmalarını sağlar.

---

### Taklit edilen BSC nesneleri üzerindeki değişiklikler, BNB Greenfield'deki gerçek değişikliklere ne kadar sürede yansır?
BSC üzerindeki taklit edilen nesnelere yapılan değişiklikler, ilgili işlemler her iki blok zincirinde de tamamlandığında BNB Greenfield'e aktarılır. BSC'nin blok kesinliği 3 saniye, BNB Greenfield'in blok kesinliği ise 2 saniyedir. Sonuç olarak, değişiklikler, bu iki blok kesinlik zamanından daha uzun olan **3 saniyelik maksimum blok kesinliği içinde** yansıtılmalıdır.

---

### Nesne yeniden adlandırıldığında, mirroring bozulur mu ve tekrar “remirrored” yapılması mı gerekir?
BNB Greenfield'deki mirroring, benzersiz nesne kimliğine dayanmaktadır ve nesne meta verilerindeki değişikliklerden, adının değiştirilmesi de dahil olmak üzere, etkilenmez. **Bir nesne yeniden adlandırılsa bile, mirroring süreci sağlam kalır**, çünkü bu tür meta veri değişikliklerinden etkilenmez.

---

### Taklit edilmiş nesne depolama sağlayıcıları arasında taşınabilir mi?
BNB Greenfield'deki mirroring süreci, nesnenin verileri ve meta verileri her zaman BNB Greenfield'de bulunduğundan, nesne göçüne olanak tanır. Veriler BSC'ye kopyalanmadığı için, mirroring etkilenmez. Bu, **gerçek içeriğin bir depolama sağlayıcısından diğerine taşınmasının mirroring sürecini etkilemediği** anlamına gelir.