# TVM Güncellemesi 2024.04

## Ucuz ücret hesaplaması için yeni talimatların tanıtımı

:::tip
Bu güncelleme 16 Mart'tan bu yana ana ağda aktiftir (bkz. https://t.me/tonstatus/101). Bu güncellemenin taslak için önizlemesi `@ton/sandbox@0.16.0-tvmbeta.3`, `@ton-community/func-js@0.6.3-tvmbeta.3` ve `@ton-community/func-js-bin@0.4.5-tvmbeta.3` paketlerinde mevcuttur.
:::

Bu güncelleme, Config8 `version` >= 6 tarafından etkinleştirilmiştir.

## c7

**c7** demetinin eleman sayısı **14**'ten **16**'ya çıkarılmıştır:

* **14**: bazı yapılandırma parametrelerini hücre dilimleri olarak içeren demet. Eğer parametre yapılandırmada yoksa, değer **null**'dur.
  * **0**: `ConfigParam 18`'den `StoragePrices`. Tüm sözlük değil, yalnızca mevcut zamana karşılık gelen StoragePrices girişi.
  * **1**: `ConfigParam 19` (küresel id).
  * **2**: `ConfigParam 20` (mc gaz fiyatları).
  * **3**: `ConfigParam 21` (gaz fiyatları).
  * **4**: `ConfigParam 24` (mc fwd ücretleri).
  * **5**: `ConfigParam 25` (fwd ücretleri).
  * **6**: `ConfigParam 43` (boyut sınırları).
* **15**: "[vadesi geçmiş ödeme](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L237)" - depolama ücreti için mevcut borç (nanoton). Asm opcode: `DUEPAYMENT`.
* **16**: "önceden derlenmiş gaz kullanımı" - mevcut sözleşme için gaz kullanımı eğer önceden derlenmişse (bkz. ConfigParam 45), aksi takdirde **null**. Asm opcode: `GETPRECOMPILEDGAS`.

:::note
Bu c7'nin açılmış yapılandırma parametreleri ile genişletilmesi fikri şudur: bu veriler küresel yapılandırmadan işlem yürütücüsü tarafından alınacaktır, bu nedenle işlemcinin belleğinde zaten mevcuttur. Ancak (genişletme öncesi) akıllı sözleşme bu parametrelerin tümünü yapılandırma sözlüğünden tek tek almak zorundadır ki bu, maliyet açısından pahalıdır ve gaz açısından potansiyel olarak öngörülemezdir (çünkü maliyet, parametre sayısına bağlıdır).
:::

Vadesi geçmiş ödeme, sözleşmenin depolama ücretlerini doğru bir şekilde değerlendirmesi için gereklidir: mesaj akıllı sözleşmeye varsayılan (geri alınabilir) modda gönderildiğinde, depolama ücretleri (veya depolama ücretiyle ilgili borç içeren due_payment alanına eklenir) mesajın değeri bakiyeye eklenmeden önce düşülmektedir. Böylece, eğer sözleşme mesajı işledikten sonra gaz fazlasını mod=64 ile geri gönderirse, bu, sözleşme bakiyesi 0'a çarptığında, bir sonraki işlemlerde depolama ücretlerinin due_payment'ye birikmeye başladığı anlamına gelir (ve gelen mesajlardan düşülmez). Bu şekilde borç, hesap donana kadar sessizce birikmeye devam eder. `DUEPAYMENT`, geliştiricinin depolama için komisyonu açıkça hesaplamasına/mahrum etmesine ve böylece herhangi bir sorun önlemesine olanak tanır.

---

## Yeni opcode'lar

### Yeni c7 değerleri ile çalışacak opcode'lar
Her biri için **26 gaz**, `SENDMSG` hariç (hücre işlemleri nedeniyle).

| Fift sözdizimi | Yığın | Açıklama                                                                    |
|:-|:--------------------|:-------------------------------------------------------------------------------------------------------------------------|
| `UNPACKEDCONFIGTUPLE` | _`- c`_             | c7'den yapılandırma dilimlerinin demetini alır                                                                                |
| `DUEPAYMENT` | _`- i`_             | c7'den vadesi geçmiş ödeme değerini alır                                                                                   |
| `GLOBALID` | _`- i`_             | Artık c7'den `ConfigParam 19`'u alır, ton form yapılandırma sözlüğünden.                                                      |
| `SENDMSG` | _`msg mode - i`_    | Artık c7'den `ConfigParam 24/25` (mesaj fiyatları) ve `ConfigParam 43` (`max_msg_cells`) alır, yapılandırma sözlüğünden değil. |

### Yapılandırma parametrelerini işlemek için opcode'lar

:::info
TON işlem yürütücüsünde yapılandırma dilimlerinin demetinin tanıtılması, ücret parametrelerini analiz etmek için maliyet etkin hale gelmiştir. Ancak, yeni yapılandırma parametreleri oluşturucuları gelecekte tanıtılabileceğinden, akıllı sözleşmelerin bu yeni parametreleri yorumlaması gerekebilir. Bu sorunu çözmek için, ücret hesaplaması için özel opcode'lar tanıtılmıştır. Bu opcode'lar c7'den parametreleri okur ve ücretleri yürütücü ile aynı şekilde hesaplar. Yeni parametre oluşturucuları tanıtıldığında, bu opcode'ların değişikliklerle uyumlu hale getirilmesi sağlanacaktır. Bu, akıllı sözleşmelerin ücret hesaplaması için bu talimatlara güvenmesine olanak tanır, tüm türlerdeki oluşturucuları yorumlamaya gerek kalmaz.
:::

Her biri için **26 gaz**.

| Fift sözdizimi | Yığın | Açıklama                                                                                                                                                                                                                                                 |
|:-|:-|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GETGASFEE` | _`gas_used is_mc - price`_ | _`gas_used`_ gaz tüketen işlem için nanotonda hesaplama maliyetini hesaplar.                                                                                                                                                                                                               |
| `GETSTORAGEFEE` | _`cells bits seconds is_mc - price`_ | Mevcut depolama fiyatlarına dayalı olarak sözleşme için nanotonda depolama ücretlerini hesaplar. `cells` ve `bits`, [`AccountState`](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L247) boyutudur (tekrarlamayı içeren, kök hücreyi dahil ederek). |
| `GETFORWARDFEE` | _`cells bits is_mc - price`_ | Çıkan mesaj için nanotonda iletilme ücretlerini hesaplar. _`is_mc`_ kaynak veya hedefin ana zincirde olması durumunda doğrudur, her ikisi de temel zincirde ise yanlıştır. Not, mesajdaki hücreler ve bitler, tekrarlama ve _kök-hesaplanmaz_ kurallarına dikkat edilerek sayılmalıdır.                     |
| `GETPRECOMPILEDGAS` | _`- null`_ | ayrılmış, şu anda `null` döner. Bu sözleşme _önceden derlenmiş_ ise gaz birimlerinde sözleşme yürütme maliyetini döndürecektir.                                                                                                                                                                             |
| `GETORIGINALFWDFEE` | _`fwd_fee is_mc - orig_fwd_fee`_ | `fwd_fee * 2^16 / first_frac` hesaplar. Mesajın orijinal `fwd_fee`'sini almak için kullanılabilir (örneğin, gelen mesajdan ECF'den ayrılmış değerler gibi) _`is_mc`_ kaynak veya hedefin ana zincirde olması durumunda doğrudur, her ikisi de temel zincirde ise yanlıştır. |
| `GETGASFEESIMPLE` | _`gas_used is_mc - price`_ | Eklenen _`gas_used`_ için nanotonda ek hesaplama maliyetini hesaplar. Diğer bir deyişle, `GETGASFEE` ile aynı, ancak sabit fiyat olmadan (sadece `(gas_used * price) / 2^16`).                                                                                             |
| `GETFORWARDFEESIMPLE` | _`cells bits is_mc - price`_ | Eklenen _`cells`_ ve _`bits`_ için nanotonda ek iletim maliyetini hesaplar. Diğer bir deyişle, `GETFORWARDFEE` ile aynı, ancak toplam fiyat olmadan (sadece `(bits*bit_price + cells*cell_price) / 2^16`).                                                                      |

`gas_used`, `cells`, `bits`, `time_delta` **0..2^63-1** aralığında tamsayılardır.

### Hücre düzeyinde işlemler
Merkle kanıtları ile çalışmak için işlemler, hücrelerin sıfırdan büyük düzeyleri ve birden fazla hash içerebildiği durumlarda kullanılır. Her biri için **26 gaz**.

| Fift sözdizimi | Yığın | Açıklama               |
|:-|:-|:--------------------------------------------------------------------|
| `CLEVEL` | _`cell - level`_ | Hücrenin seviyesini döner |
| `CLEVELMASK` | _`cell - level_mask`_ | Hücrenin seviye maskesini döner |
| `i CHASHI` | _`cell - hash`_ | Hücrenin `i`nci hash'ını döner|
| `i CDEPTHI` | _`cell - depth`_ | Hücrenin `i`nci derinliğini döner|
| `CHASHIX` | _`cell i - depth`_ | Hücrenin `i`nci hash'ını döner|
| `CDEPTHIX` | _`cell i - depth`_ | Hücrenin `i`nci derinliğini döner|

`i` **0..3** aralığındadır.