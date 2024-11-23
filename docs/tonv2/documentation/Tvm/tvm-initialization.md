# TVM Başlatma

:::info
Bu sayfayı daha iyi anlamak için, `TL-B dili` ile aşina olmanız şiddetle tavsiye edilir.
:::

TVM, olağan ve/veya diğer işlemlerin hesaplama aşamasında başlatılır.

## Başlangıç durumu

TVM'nin yeni bir örneği, akıllı sözleşmenin yürütülmeden önce aşağıdaki gibi başlatılır:

- Orijinal **cc** (mevcut devam ettirme) değeri, akıllı sözleşmenin `code` bölümünden oluşturulan hücre dilimi kullanılarak başlatılır. Hesap dondurulmuş veya başlatılmamış bir durumda ise, kod, gelen mesajın `init` alanında sağlanmalıdır.

- **cp** (mevcut TVM kod sayfası) varsayılan değer olan 0 olarak ayarlanır. Akıllı sözleşme başka bir TVM kod sayfası _x_ kullanmak istiyorsa, bunun için kodunun ilk talimatı olarak `SETCODEPAGE` _x_ kullanmalıdır.

- **gas** değerleri (_gas limitleri_) Kredi aşaması sonuçlarına göre başlatılır.

- **kütüphaneler** (_kütüphane bağlamı_) hesaplaması `aşağıda açıklanmaktadır`.

- **yığın** başlatma süreci, işlemi tetikleyen etkinliğe bağlıdır ve içeriği `aşağıda açıklanmaktadır`.

- Kontrol kaydedici **c0** (geri dönüş devam ettirmesi) sıra dışı devam ettirme `ec_quit` ile 0 parametresi ile başlatılır. Uygulandığında, bu devam ettirme, TVM'nin çıkış kodu 0 ile sonlanmasına yol açar.

- Kontrol kaydedici **c1** (alternatif geri dönüş devam ettirmesi) sıra dışı devam ettirme `ec_quit` ile 1 parametresi ile başlatılır. Çağrıldığında, bu TVM'nin çıkış kodu 1 ile sonlanmasına yol açar. Hem 0 hem de 1 çıkış kodlarının TVM'nin başarılı bir şekilde sonlandığı kabul edilmelidir.

- Kontrol kaydedici **c2** (istisna işleyici) sıra dışı devam ettirme `ec_quit_exc` ile başlatılır. Çağrıldığında, yığından tepe değeri çıkarılır (istisna numarasına eşit olan tam sayı) ve TVM, o tam sayıya eşit bir çıkış kodu ile sonlanır. Bu şekilde, varsayılan olarak tüm istisnalar akıllı sözleşme yürütmesini, istisna numarasına eşit bir çıkış kodu ile sonlandırır.

- Kontrol kaydedici **c3** (kod sözlüğü) akıllı sözleşme koduna sahip hücre ile başlatılır, yukarıda tanımlanan **cc** (mevcut devam ettirme) gibi.

- Kontrol kaydedici **c4** (sürekli verinin kökü) akıllı sözleşmenin `data` bölümünde saklanan kalıcı verilerle başlatılır. Hesap dondurulmuş veya başlatılmamış durumda ise, veriler gelen mesajın `init` alanında sağlanmalıdır. Bunun gerçekleşmesi için akıllı sözleşmenin kalıcı verilerinin tamamen yüklenmesi gerekmez. Bunun yerine kök yüklenir ve TVM, diğer hücreleri yalnızca kökten erişim sağlandığında yükleyebilir; böylece sanal bellek sağlanır.

- Kontrol kaydedici **c5** (hareketlerin kökü) boş bir hücre ile başlatılır. TVM'nin "çıkış eylemi" ilkel yapı taşları, başarılı akıllı sözleşme sonlanmasından sonra gerçekleştirilecek çıkış eylemlerini (örneğin, dışa mesajlar) bu kaydedicide biriktirir. Bunun için TL-B şeması `aşağıda açıklanmaktadır`.

- Kontrol kaydedici **c7** (geçici verinin kökü) bir tuple olarak başlatılır ve yapısı `aşağıda açıklanmaktadır`.

## Kütüphane bağlamı

Bir akıllı sözleşmenin _kütüphane bağlamı_ (kütüphane ortamı), 256 bitlik hücre (temsil) hash'lerini ilgili hücrelere eşleyen bir hashmap'tir. Bir akıllı sözleşme yürütülmesi sırasında, dış bir hücre referansı kullanıldığında, ilgili hücre, kütüphane ortamında aranır ve dış hücre referansı, bulunan hücre ile otomatik olarak değiştirilir.

Bir akıllı sözleşmenin kütüphane ortamı aşağıdaki gibi hesaplanır:

1. Mevcut iş zinciri için küresel kütüphane ortamı, ana zincirin mevcut durumundan alınır.
2. Ardından, akıllı sözleşmenin durumunun `library` alanında saklanan yerel kütüphane ortamı ile genişletilir. Sadece, ilgili değer hücrelerinin hash'lerine eşit olan 256 bit anahtarlar dikkate alınır. **Bir anahtar hem küresel hem de yerel kütüphane ortamında mevcutsa, yerel ortam birleşimde önceliklidir.**
3. Son olarak, gelen mesajın `init` alanındaki `library` alanı (varsa) ile genişletilir. Hesap dondurulmuş veya başlatılmamışsa, önceki adımda yerel kütüphane ortamı üzerinde mesaj kütüphanesi kullanılacaktır. Mesaj kütüphanesi, hem yerel hem de küresel kütüphane ortamlarından daha düşük önceliğe sahiptir.

TVM için paylaşılan kütüphaneler oluşturmanın en yaygın yolu, ana zincirde kütüphanenin kök hücresine bir referans yayınlamaktır.

## Yığın

TVM yığınının başlatılması, TVM'nin başlangıç durumunun oluşmasından sonra gelir ve işlemi tetikleyen etkinliğe bağlıdır:

- iç mesaj
- dış mesaj
- tik-tak
- bölme hazırlığı
- birleştirme yüklemesi

Yığına en son eklenen öğe her zaman _fonksiyon seçicisi_ dir; bu bir _Tam Sayı_ dır ve işlemi tetikleyen etkinliği tanımlar.

### İç mesaj

İç mesaj durumunda, yığın akıllı sözleşmenin `main()` fonksiyonuna geçecek olan argümanları aşağıdaki gibi iterek başlatılır:

- Akıllı sözleşmenin bakiyesi _b_ (gelen mesajın değeri kredi edildikten sonra) bir _Tam Sayı_ nanotonu olarak geçilir.
- Gelen mesajın _b_m bakiyesi bir _Tam Sayı_ nanotonu olarak geçilir.
- Gelen mesaj **_m_** bir hücre olarak geçirilir; bu hücre, _Message X_ türünde bir serileştirilmiş değeri içerir; burada **_X_**, mesaj gövdesinin türüdür.
- Gelen mesajın gövdesi _m_b, alan gövdesinin _m_ değerine eşit olup bir hücre dilimi olarak geçirilir.
- Fonksiyon seçicisi _s_, normalde 0'a eşittir.

Bundan sonra, akıllı sözleşmenin kodu, **c3**'ün başlangıç değeri ile yürütülür. Bu, _s_'ye göre doğru fonksiyonu seçer ve kalan argümanları işlemesi ve ardından sonlandırması beklenir.

### Dış mesaj

Gelen bir dış mesaj, `iç mesajda açıklandığı gibi` benzer biçimde işlenir, ancak şu değişikliklerle:

- Fonksiyon seçicisi _s_ -1 olarak ayarlanır.
- Gelen mesajın _b_m bakiyesi her zaman 0'dır.
- İlaveten, başlangıç mevcut gaz limiti _g_l her zaman 0'dır. Ancak, başlangıç gaz kredisi _g_c > 0'dır.

**Akıllı sözleşme, _g_c = 0 veya _g_r ≥ _g_c ile sonlanmalıdır; aksi takdirde, işlem ve onu içeren blok geçersiz kabul edilir.** Validator veya birleştirici, geçersiz gelen dış mesajları işleyen işlem adaylarını asla dahil etmemelidir.

### Tik ve tak

Tik ve tak işlemleri durumunda, yığın akıllı sözleşmenin `main()` fonksiyonuna argümanları iterek başlatılır:

- Mevcut hesabın bakiyesi _b_, bir _Tam Sayı_ nanotonu olarak geçirilir.
- Ana zincir içindeki mevcut hesabın 256 bitlik adresi, işaretsiz bir _Tam Sayı_ olarak geçirilir.
- Tik işlemleri için 0 ve tak işlemleri için -1 olan bir tam sayı.
- Fonksiyon seçicisi _s_, -2'ye eşittir.

### Bölme hazırlığı

Bölme hazırlığı işlemi durumunda, yığın akıllı sözleşmenin `main()` fonksiyonuna argümanları iterek başlatılır:

- Mevcut hesabın bakiyesi _b_, bir _Tam Sayı_ nanotonu olarak geçirilir.
- _SplitMergeInfo_ içeren bir _Dilim_.
- Mevcut hesabın 256 bitlik adresi.
- Kardeş hesabın 256 bitlik adresi.
- 0 ≤ _d_ ≤ 63 olan bir tam sayı, mevcut ve kardeş hesabın farklı olduğu tek bitin konumuna eşittir.
- Fonksiyon seçicisi _s_, -3'e eşittir.

### Birleştirme yüklemesi

Birleştirme yüklemesi işlemi durumunda, yığın akıllı sözleşmenin `main()` fonksiyonuna argümanları iterek başlatılır:

- Mevcut hesabın bakiyesi _b_ (zaten kardeş hesabın nanoton bakiyesi ile birleştirilmiş) bir _Tam Sayı_ nanotonu olarak geçirilir.
- Kardeş hesabın bakiyesi _b'_, gelen mesaj _m_ üzerinden alınır ve bir _Tam Sayı_ nanotonu olarak geçirilir.
- Kardeş hesap açısından oluşturulan mesaj _m_, otomatik olarak birleştirme hazırlığı işlemiyle ilişkili bir mesajdır. `init` alanı, kardeş hesabın son durumunu içerir. Mesaj, _Message X_ türünde bir serileştirilmiş değeri içeren bir hücre olarak geçirilir; burada **_X_**, mesaj gövdesinin türüdür.
- Kardeş hesabın durumu, _StateInit_ ile temsil edilir.
- Bir _Dilim_ içeren _SplitMergeInfo_.
- Mevcut hesabın 256 bitlik adresi.
- Kardeş hesabın 256 bitlik adresi.
- 0 ≤ _d_ ≤ 63 olan bir tam sayı, mevcut ve kardeş hesabın farklı olduğu tek bitin konumuna eşittir.
- Fonksiyon seçicisi _s_, -4'e eşittir.

## Kontrol kaydedici c5

Akıllı sözleşmenin _çıkış eylemleri_, kontrol kaydedici **c5** içinde saklanan hücreye birikir: hücre kendisi bir liste içindeki son eylemi ve önceki bir referansı içerir ve böylece bağlı bir liste oluşturur.

Liste, aynı zamanda _OutList n_ türünde bir değer olarak serileştirilebilir; burada **_n_** listenin uzunluğudur:

```tlb
out_list_empty$_ = OutList 0;

out_list$_ {n:#}
  prev:^(OutList n)
  action:OutAction
  = OutList (n + 1);

out_list_node$_
  prev:^Cell
  action:OutAction = OutListNode;
```

**Mümkün olan eylemler listesi aşağıdaki gibidir:**

- `action_send_msg` — çıkış mesajı göndermek için
- `action_set_code` — bir opcode ayarlamak için
- `action_reserve_currency` — bir para koleksiyonu depolamak için
- `action_change_library` — kütüphaneyi değiştirmek için

İlgili TL-B şemasında belirtildiği gibi:

```tlb
action_send_msg#0ec3c86d
  mode:(## 8) 
  out_msg:^(MessageRelaxed Any) = OutAction;
  
action_set_code#ad4de08e
  new_code:^Cell = OutAction;
  
action_reserve_currency#36e6b809
  mode:(## 8)
  currency:CurrencyCollection = OutAction;

libref_hash$0
  lib_hash:bits256 = LibRef;
libref_ref$1
  library:^Cell = LibRef;
action_change_library#26fa1dd4
  mode:(## 7) { mode <= 2 }
  libref:LibRef = OutAction;
```

## Kontrol kaydedici c7

Kontrol kaydedici **c7**, bir Tupla olarak geçici verinin kökünü içerir; bu Tupla, zaman, küresel yapılandırma vb. gibi bazı temel blok zinciri bağlam verilerini içeren _SmartContractInfo_ türündedir. Aşağıdaki TL-B şeması ile tanımlanmıştır:

```tlb
smc_info#076ef1ea
  actions:uint16 msgs_sent:uint16
  unixtime:uint32 block_lt:uint64 trans_lt:uint64 
  rand_seed:bits256 balance_remaining:CurrencyCollection
  myself:MsgAddressInt global_config:(Maybe Cell) = SmartContractInfo;
```

Bu tuple'ın ilk bileşeni, her zaman 0x076ef1ea'ya eşit olan bir _Tam Sayı_ değeridir; ardından 9 adlandırılmış alan gelir:

| Alan | Tür | Açıklama |
| ----- | ---- | ----------- |
| `actions` | uint16 | Başlangıçta 0 ile başlatılır, ancak bir çıkış eylemi bir RAW çıkış eylemi ilke taşı tarafından yüklendiğinde bir arttırılır. |
| `msgs_sent` | uint16 | Gönderilen mesaj sayısı |
| `unixtime` | uint32 | Saniye cinsinden Unix zaman damgası |
| `block_lt` | uint64 | Bu hesabın önceki bloğunun _mantıksal zamanı_ nı temsil eder. `Mantıksal zaman hakkında daha fazla bilgi` |
| `trans_lt` | uint64 | Bu hesabın önceki işleminin _mantıksal zamanı_ nı temsil eder |
| `rand_seed` | bits256 | Bloktan, hesap adresinden, işlenmekte olan gelen mesajın hash'indan (varsa) ve işlem mantıksal zamanı `trans_lt`'den belirleyici olarak başlatılır. |
| `balance_remaining` | `CurrencyCollection` | Akıllı sözleşmenin kalan bakiyesi |
| `myself` | `MsgAddressInt` | Bu akıllı sözleşmenin adresi |
| `global_config` | (Maybe Cell) | Küresel yapılandırma ile ilgili bilgileri içerir |

:::warning
Dikkat edilmelidir ki, yaklaşan TVM güncellemesinde, **c7** tuple'ı 10'dan 14 öğeye genişletilmiştir. Daha fazla bilgi için `buraya` bakın.
:::

## Ayrıca bakınız

- Beyaz kitapta yer alan [TVM Başlatma](https://docs.ton.org/tblkch.pdf#page=89&zoom=100) orijinal açıklaması