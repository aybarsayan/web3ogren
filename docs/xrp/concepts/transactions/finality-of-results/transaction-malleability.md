---
title: İşlem Malleability
seoTitle: İşlem Malleability - XRP Ledger
sidebar_position: 4
description: İşlemlerin beklenenden farklı bir hashe sahip olmak üzere değiştirilebileceği yolları öğrenin. Bu makale, XRP Ledgerda işlem malleability kavramını detaylı bir şekilde ele almaktadır.
tags: 
  - XRP Ledger
  - işlem malleability
  - çoklu imzalı işlemler
  - güvenlik
  - ECDSA
keywords: 
  - XRP Ledger
  - işlem malleability
  - çoklu imzalı işlemler
  - güvenlik
  - ECDSA
---

# İşlem Malleability

Bir işlem, imzalandıktan sonra herhangi bir şekilde değiştirilebiliyorsa "malleable" (değiştirilebilir) olarak adlandırılır; bunun için imzalamak üzere anahtarlara ihtiyaç yoktur. XRP Ledger'da, imzalanmış bir işlemin **işlevselliği** değiştirilemez, ancak bazı durumlarda bir üçüncü taraf, bir işlemin imzasını ve tanımlayıcı hash'ini _değiştirebilir_.

:::warning
Vulnerable yazılımlar değiştirilebilir işlemleri gönderip bunların yalnızca orijinal hash altında yürütüleceğini varsayıyorsa, işlemleri takip etme yeteneğini kaybedebilir.
:::

En kötü durumda, kötü niyetli aktörler bunu kullanarak savunmasız sistemden para çalabilir.

XRP Ledger ana ağında, yalnızca **çoklu imzalı işlemler** malleable (değiştirilebilir) olabilir; bunun nedeni, gerekli olandan daha fazla imzaya sahip olmaları veya yetkili bir imzacı tarafından gereğinden fazla bir imza sağlanmasıdır. İyi operasyonel güvenlik bu sorunlara karşı koruma sağlayabilir. `Çoklu İmza Malleability için Önlemler` bölümüne bakın.

:::info
2014'ten önce, tek imzalı işlemler varsayılan imzalama algoritması olan ECDSA ve secp256k1 eğrisi özellikleri nedeniyle malleable (değiştirilebilir) olabiliyordu.
:::

Eski imzalama araçlarıyla uyum sağlamak amacıyla, [RequireFullyCanonicalSig değişikliği][] 2020-07-03 tarihinde etkinleşene kadar değiştirilebilir tek imzalı işlemler oluşturmak ve göndermek mümkündü. (Ed25519 anahtarlarıyla `imzalanan işlemler` bu soruna hiç maruz kalmamıştır.)

## Arka Plan

XRP Ledger'da bir işlem yürütülemez, eğer:

- Tüm `işlem alanları` imzalanmamışsa, imza hariç.
- İşlemi imzalamak için kullanılan anahtar çiftleri, o hesap adına işlem gönderme yetkisine `sahip olmalıdır`.
- İmza _kanonik_ olmalı ve işlem talimatlarıyla eşleşmelidir.

:::note
İmzalanmış alanlarda yapılacak en küçük bir değişiklik, imzayı geçersiz kılacağı için, işlemin hiçbir kısmı imza hariç malleable olamaz.
:::

İmza, bir işlemin tanımlayıcı hash'ini hesaplamak için kullanılan veriler arasında yer aldığından, değiştirilebilir bir işlemin herhangi bir değişikliği farklı bir hash ile sonuçlanır.

### Alternatif secp256k1 İmzaları

"Kanoni" olmak için, ECDSA algoritması ve secp256k1 eğrisi (varsayılan olan) ile oluşturulan imzalar, aşağıdaki gereklilikleri karşılamalıdır:

- İmza düzgün bir şekilde [DER-kodlu veri](https://en.wikipedia.org/wiki/X.690#DER_encoding) olmalıdır.
- İmza, DER-kodlu verinin dışında herhangi bir dolgu baytına sahip olmamalıdır.
- İmzanın bileşen tam sayıları negatif olmamalıdır ve secp256k1 grup sıra numarasından büyük olmamalıdır.

Genel olarak, herhangi bir standart ECDSA uygulaması bu gereklilikleri otomatik olarak yerine getirir. Ancak, secp256k1 ile, bu gereklilikler malleability'yi önlemek için yeterli değildir. Bu nedenle, XRP Ledger'ın aynı sorunu yaşamayan "tamamen kanonik" imzalar kavramı vardır.

Bir ECDSA imzası, R ve S adında iki tam sayıdan oluşur. secp256k1 _grup sırası_, N, tüm secp256k1 imzaları için sabit bir değerdir. Özellikle, N, `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141` değeri ile tanımlanır. Verilen herhangi bir imza için `(R,S)`, `(R, N-S)` (yani, S'nin yerine N eksi S kullanmak) imzası da geçerlidir.

Böylece _tamamen_ kanonik imzalara sahip olmak için, iki olasılıktan hangisinin tercih edileceğini seçmek ve diğerini geçersiz olarak ilan etmek gerekir. XRP Ledger'ın yaratıcıları, iki olası değerden _daha küçük_ olanı tercih etmeyi keyfi olarak seçmiştir; S veya N-S. Bir işlem, tercih edilen (küçük) S değerini kullanıyorsa ve kanonik olmanın bütün normal kurallarını takip ediyorsa _tamamen kanonik_ olarak kabul edilir. Tamamen kanonik bir ECDSA imzasını hesaplamak için, S ile N-S karşılaştırılmalı, hangisinin küçük olduğu belirlenmeli ve bu değer `Signature` alanında kullanılmalıdır.

:::tip
[Enhancements RequiredFullyCanonicalSig değişikliği][] (2020'de etkinleştirildi), tüm işlemlerin yalnızca _tamamen kanonik_ imzaları kullanmasını gerektirmiştir.
:::

2014 ile 2020 arasında, XRP Ledger, her zaman tamamen kanonik imzalar üretmeyen eski yazılımlar ile uyumlu hale geldi; ancak bu, `**tfFullyCanonicalSig`**` adlı işlemlere bir bayrak ekleyerek uyumlu yazılımların işlem malleability'ye karşı korunmasını sağladı. Bu bayrak, uyumlu imzalama yazılımınca varsayılan olarak etkinleştirildi ve işlemin geçerli olabilmesi için _tamamen kanonik_ bir imza kullanma talebinde bulunuyordu. Şimdi [RequireFullyCanonicalSig değişikliği][] etkin olduğuna göre, bu bayrak artık gerekli değildir, fakat yine de etkinleştirmekte bir sakınca yoktur.

### Çoklu İmzalarla Malleability

Çoklu imzalamanın önemli ve açık bir özelliği, farklı birden fazla olasılıkla bir işlemin geçerli olabilmesidir. Örneğin, bir hesap, beş imzacının herhangi üçünden gelen imzaların bir işlemi yetkilendirecek şekilde yapılandırılabilir. Ancak, bu, geçerli bir işlemin farklı tanımlayıcı hash'lerle birden fazla farklı varyasyonunu olabileceği anlamına gelir.

Aşağıdaki tüm durumlar, işlem malleability'sine yol açabilir:

- Eğer bir işlem, bir veya daha fazla imza kaldırıldıktan sonra yeterli imzaya sahip olmaya devam ediyorsa. Herhangi bir üçüncü taraf bir imzayı kaldırabilir ve işlemi imzasız yeniden gönderebilir.
- Eğer bir işlem zaten yeterli bir imza sayısına sahipken yeni bir geçerli imza eklenebiliyorsa. Sadece gönderici hesabının yetkili bir imzacısı böyle bir imza oluşturabilir.
- Eğer bir işlemden bir imza başka geçerli bir imza ile değiştirilirken yeterli imza sayası korunuyorsa. Yine, sadece gönderici hesabının yetkili bir imzacısı böyle bir imza oluşturabilir.

:::note
Yetkili imzacılarınız kasıtlı olarak kötü niyetli olmasa bile, karışıklık veya kötü koordinasyon nedeniyle çok sayıda imzacı, aynı işlemin farklı geçerli sürümlerini gönderebilir.
:::

#### Çoklu İmza Malleability için Önlemler

**İyi operasyonel güvenlik bu sorunlara karşı koruma sağlayabilir.** Çoklu imzalama sırasında işlem malleability sorunlarından kaçınmak için iyi operasyonel güvenlik uygulamalarını izlemelisiniz. Bunlar arasında şunlar yer alır:

- Gerekenden fazla imza toplamayın.
- Ya gerekli imza sayısını topladıktan sonra bir tarafın işlemi oluşturmasını atayın ya da imzacılara işlem talimatlarını belirli bir sırayla imzalamalarını söyleyin.
- Multi-imza listelerinize, işlemi yetkilendirmek için yeterli olmayan `weight` değerlerine sahip olsa bile gereksiz veya güvenilmeyen imzacıları eklemeyin.
- Bir işlemin farklı bir hash ve imza seti ile yürütülme olasılığına hazırlıklı olun. Hesabınızın gönderdiği işlemleri dikkatli bir şekilde izleyin (örneğin, [account_tx yöntemi][] kullanarak).
- Hesabınızın `Sequence` numarasını izleyin (örneğin, [account_info yöntemi][] kullanarak). Bu numara, hesabınızın başarılı bir şekilde bir işlem gönderdiğinde tam olarak bir artar ve başka bir şekilde artmaz. Eğer beklediğiniz numara ile eşleşmiyorsa, yakın zamandaki işlemlerinizi kontrol etmelisiniz (Malleable işlemler dışında, bunun olabileceği başka yollar da vardır. Belki başka bir uygulama, sizin adınıza işlemler gönderecek şekilde yapılandırıldı. Belki de kötü niyetli bir kullanıcı, gizli anahtarınıza erişti. Ya da belki uygulamanız veri kaybetti ve gönderdiğiniz bir işlemi unuttu).
- Çoklu imzalama yapmak için işlemleri yeniden oluşturuyorsanız, amaçlanan hareketlerin henüz gerçekleştirilmediğine dair manuel olarak onay almadığınız sürece `Sequence` numarasını _değiştirmeyin_.
- İmzalamadan önce `tfFullyCanonicalSig` bayrağının etkin olup olmadığını kontrol edin.

Daha fazla güvenlik için, bu yönergeler birden fazla koruma katmanı sağlar.

## Malleable İşlemlerle Sömürü

Kullandığınız yazılım XRP Ledger ile etkileşimde bulunurken değiştirilebilir işlemler gönderiyorsa, kötü niyetli bir kişi, yazılımınızı bir işlemin nihai sonucundan kaybolmasına neden olacak şekilde kandırabilir ve en kötü durumda karşılık gelen ödemeleri birden fazla kez gönderebilir.

Eğer yalnızca tek imzalar kullanıyorsanız, bu sömürüye karşı savunmasız değilsinizdir. Çoklu imzalar kullanıyorsanız, yeterinden fazla imza sunduğunuzda veya imzacılarınız sunduğunda savunmasız olabilirsiniz.

### Sömürü Senaryosu Adımları

Savunmasız bir sistemi sömürmek için süreç, aşağıdaki gibi bir dizi adımdan oluşur:

1. Savunmasız sistem, çoklu imzalı bir işlem oluşturur ve gerekenden fazla imza toplar.

    Yetkili bir imzacı kötü niyetli veya sorumsuzsa, imzasının dahil edilmediği fakat eklenebileceği durumda işlem de savunmasız hale gelebilir.

2. Sistem, savunmasız işlemin tanımlayıcı hash'ini not eder, XRP Ledger ağına gönderir ve ardından o hash'in doğrulanmış bir defter versiyonuna dahil edilmesini izlemeye başlar.

3. Kötü niyetli bir aktör, işlem doğrulanmadan önce ağda yayıldığını görür.

4. Kötü niyetli aktör, savunmasız işlemden bir ekstra imzayı kaldırır.

    Farklı işlem talimatları için bir imza oluşturmak gibi, bu, büyük bir hesaplama çalışması gerektirmeyen bir işlemdir. Bir imza üretmekten çok daha az zamanda gerçekleştirilebilir.

    Alternatif olarak, işlemin imza listesinin zaten bir parçası olmayan yetkili bir imzacı, savunmasız işlemin imza listesine kendi imzasını ekleyebilir. Gönderenin çoklu imzalama ayarlarına bağlı olarak, bu diğer imzaları işlemden kaldırmanın yerine ya da ek olarak yapılabilir.

    Değiştirilen imza listesi, farklı bir tanımlayıcı hash ile sonuçlanır. (Ağa göndermeden önce hash hesaplamanız gerekmez, ancak hash'i bilmek daha sonra işlemin durumunu kontrol etmeyi kolaylaştırır).

5. Kötü niyetli aktör, değiştirilmiş işlemi ağa gönderir.

    Bu, orijinal olarak gönderilen işlem ile kötü niyetli aktörün gönderdiği değiştirilmiş sürüm arasında bir "yarış" oluşturur. Her iki işlem de karşılıklı olarak dışlayıcıdır. Her ikisi de geçerlidir, ancak aynı işlem verilerine sahiptirler; `Sequence` numarası dahil, bu nedenle bunlardan sadece biri doğrulanmış bir deftere dahil edilebilir.

    Peer-to-peer ağdaki sunucular, hangisinin "önce geldiği" veya orijinal gönderici tarafından hangi versiyonun hedef alındığını bilemez. Ağ bağlantısındakile delays veya diğer tesadüfler, doğrulayıcıların konsensüs önerilerini tamamladıklarında yalnızca birini görebilecekleri gibi sonuçlanabilir, bu nedenle biri "yarışı kazanabilir".

    Kötü niyetli bir aktör, ağdaki peer-to-peer sunucuları arasında kontrol etmeleri durumunda, kanonik olmayan işlemlerin onaylanma şansını artırabilir; bu sunucular doğrulayıcı olarak güvenilir olmasa bile.

    Eğer kötü niyetli aktör, savunmasız sistemin işlemi gönderdiği tek sunucuya sahipse, kötü niyetli aktör, hangi versiyonun ağın geri kalanına dağıtılacağını kolayca kontrol edebilir.

6. Kötü niyetli aktörün işlem versiyonu konsensüse ulaşır ve doğrulanmış bir deftere dahil edilir.

    Bu noktada işlem gerçekleştirilmiştir ve geri alınamaz. Etkileri (örneğin, XRP göndermek) kesinleşmiştir. Orijinal işlem versiyonu artık geçerli değildir çünkü `Sequence` numarası kullanılmıştır.

    XRP Ledger'daki işlemin etkileri, orijinal versiyonun gerçekleştirilmişçesine tamamen aynıdır.

7. Savunmasız sistem, beklediği işlem hash'ini göremez ve işlemin yürütülmediğini yanlış bir şekilde sonuçlandırır.

    Eğer işlem `LastLedgerSequence` alanını içeriyorsa, bu belirli defter indeksinin geçmesi sonrasında gerçekleşir.

    Eğer işlem `LastLedgerSequence` alanını atladıysa, bu başka bir şekilde yanlış olabilir: eğer aynı gönderenin başka hiçbir işlemi aynı `Sequence` numarasını kullanmıyorsa, o işlem teorik olarak daha sonra başarılı olabilir; ne kadar zaman geçtiğine bakılmaksızın. (Detaylar için `Güvenilir İşlem Gönderimi` bölümüne bakın).

8. Savunmasız sistem, işlemin başarısız olduğunu varsayarak harekete geçer.

    Örneğin, XRP Ledger'de gönderildiği düşünülen fonlar ile ilgili olarak kendi sisteminde bir müşterinin bakiyesini geri ödeyebilir (veya onu almayabilir).

    Daha kötüsü, savunmasız sistem yeni bir işlem oluşturup işlemden yeni `Sequence`, `LastLedgerSequence` ve `Fee` parametrelerini mevcut ağ durumu bazında seçebilir, fakat işlemin geri kalanını orijinal ile aynı tutarak. Eğer bu yeni işlem de değiştirilebilir ise, sistem, aynı şekilde sonsuz sayıda kez sömürülebilir.

## Ayrıca Bakınız

- **Kavramlar:**
    - `İşlemler`
    - `Sonuçların Kesinliği`
- **Rehberler:**
    - `İşlem Sonuçlarını Araştırın`
    - `Güvenilir İşlem Gönderimi`
- **Referanslar:**
    - `Temel Veri Türleri - Hash'ler`
    - `İşlem Yaygın Alanları - Küresel Bayraklar`
    - `İşlem Sonuçları`
    - `Serileştirme Formatı`

