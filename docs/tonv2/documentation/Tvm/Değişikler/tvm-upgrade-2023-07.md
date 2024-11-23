# TVM Yükseltmesi 2023.07

:::tip
Bu yükseltme Aralık 2023'te Mainnet'ten [çalıştırıldı](https://t.me/tonblockchain/223).
:::

## c7

**c7**, sözleşme yürütümü için gerekli olan yerel bağlam bilgilerini (zaman, lt, ağ yapılandırmaları vb) saklayan kayıttır.

**c7** demeti, 10'dan 14 elemana genişletilmiştir:
* **10**: Akıllı sözleşmenin kodunun bulunduğu `cell`.
* **11**: `[integer, maybe_dict]`: Gelen mesajın TON değeri, ekstra para birimi.
* **12**: `integer`, depolama aşamasında toplanan ücretler.
* **13**: Önceki bloklar hakkında bilgi içeren `tuple`.

**10**: Şu anda akıllı sözleşmenin kodu, yalnızca yürütülebilir bir devam olarak TVM seviyesinde sunulmakta ve hücreye dönüştürülemez. Bu kod, genellikle aynı türdeki bir komşu sözleşmeyi yetkilendirmek için kullanılır; örneğin jetton-cüzdan, jetton-cüzdanı yetkilendirir. Şu an için, depolama ve `init_wrapper`'ı daha zahmetli hale getiren kod hücresini açıkça depolamamız gerekiyor. **10**'u kod için kullanmak, Everscale güncellemesi ile uyumludur.

:::info
**11**: Şu an için, gelen mesajın değeri TVM başlatmasından sonra yığında sunulmaktadır. Yürütme sırasında gerekiyorsa, ya bunu küresel bir değişkende saklamak ya da yerel değişkenler aracılığıyla geçirecek biri olmalıdır (funC seviyesinde bu, tüm işlevlerde ek `msg_value` argümanı gibi görünmektedir). Bunu **11** elemanına koyarak, sözleşme bakiyesi davranışını tekrar edeceğiz: bu, hem yığında hem de c7'de sunulmaktadır.
:::

- **12**: Şu anda depolama ücretlerini hesaplamanın tek yolu, önceki işlemdeki bakiyeyi saklamak, önceki işlemdeki gaz kullanımını bir şekilde hesaplamak ve ardından mevcut bakiyeyi mesaj değerinden çıkarmaktır. Bu arada, depolama ücretlerini hesaplamak sıklıkla istenir.

## Önceki Bloklar Hakkında Bilgi

**13**: Şu anda önceki bloklar hakkında veri alma yolu yoktur. TON'un öldürücü özelliklerinden biri, her yapının bir Merkle kanıt dostu hücreler çantası (ağaç) olmasıdır; ayrıca TVM de hücre ve Merkle kanıt dostudur. Bu şekilde, bloklar hakkında bilgileri TVM bağlamına dahil edersek, birçok güvenilmez senaryo oluşturmak mümkün olacaktır: 

- Sözleşme A, sözleşme B üzerindeki işlemleri inceleyebilir (B'nin iş birliği olmadan).
- Bozulmuş mesaj zincirlerini geri yüklemek mümkündür (geri yükleme sözleşmesi bazı işlemlerin gerçekleştirildiğini ancak geri alındığını kanıtlarla kontrol eder).
- Bazı doğrulama balıkçı fonksiyonları onchain'de yapabilmek için ana zincir blok hash'lerini bilmek de gereklidir.

Blok kimlikleri aşağıdaki formatta sunulmaktadır:

```
[ wc:Integer shard:Integer seqno:Integer root_hash:Integer file_hash:Integer ] = BlockId;
[ last_mc_blocks:[BlockId0, BlockId1, ..., BlockId15]
  prev_key_block:BlockId ] : PrevBlocksInfo
```

Ana zincirin son 16 blokunun kimlikleri (veya ana zincir seqno'su 16'dan azsa daha az) ile birlikte son anahtar bloğu dahil edilir. Shard bloklar hakkında veri dahil edilmesi bazı veri erişebilirlik sorunlarına yol açabilir (birleştirme/ayırma olayları nedeniyle), bu gerekli değildir (herhangi bir olay/veri ana zincir blokları kullanılarak kanıtlanabilir) ve bu nedenle dahil etmeme kararı aldık.

---

## Yeni opcode'lar
Yeni opcode'lar için gaz maliyeti seçerken genel kural, normalden (opcode uzunluğuna göre hesaplanmış) daha az olmaması ve gaz birimi başına 20 ns'den fazla olmamasıdır.

### Yeni c7 değerleri ile çalışacak opcode'lar
Her biri için 26 gaz, yalnızca `PREVMCBLOCKS` ve `PREVKEYBLOCK` için 34 gaz.

| xxxxxxxxxxxxxxxxxxxxxxFift sözdizimi | xxxxxxxxxYığın | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAçıklama               |
|:-|:-|:--------------------------------------------------------------------|
| `MYCODE` | _`- c`_ | c7'den akıllı sözleşmenin kodunu alır                            |
| `INCOMINGVALUE` | _`- t`_ | c7'den gelen mesajın değerini alır                         |
| `STORAGEFEES` | _`- i`_ | c7'den depolama aşaması ücretlerinin değerini alır                       |
| `PREVBLOCKSINFOTUPLE` | _`- t`_ | c7'den PrevBlocksInfo: `[last_mc_blocks, prev_key_block]` alır |
| `PREVMCBLOCKS` | _`- t`_ | Yalnızca `last_mc_blocks` alır                                     |
| `PREVKEYBLOCK` | _`- t`_ | Yalnızca `prev_key_block` alır                                     |
| `GLOBALID` | _`- i`_ | 19 ağ yapılandırmasından `global_id` alır                        |

## Gaz

| xxxxxxxxxxxxxxFift sözdizimi | xxxxxxxxYığın | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAçıklama                       |
|:-|:-|:-----------------------------------------------------------------------------|
| `GASCONSUMED` | _`- g_c`_ | Şu ana kadar (bu talimat dahil) VM tarafından tüketilen gazı döndürür._26 gaz_ |

---

## Aritmetik
Yeni `bölme opcode'u` (`A9mscdf`) çeşitleri eklenmiştir:
`d=0`, yığından ek bir tam sayı alır ve bölme/rshift öncesinde ara değere ekler. Bu işlemler hem bölüm hem de kalanı döndürür (tam olarak `d=3` gibi).

:::warning
Sessiz (quiet) versiyonlar da mevcuttur (örneğin `QMULADDDIVMOD` veya `QUIET MULADDDIVMOD`).
:::

Dönüş değerleri, 257-bit tamsayılara sığmazsa veya bölüm sıfırsa, sessiz işlem bir tam sayı taşma istisnası atar. Sessiz işlemler, sığmayan değer yerine `NaN` döner (bölüm sıfırsa iki tane `NaN`).

**Gaz maliyeti opcode uzunluğu eklenen 10'a eşittir**: çoğu opcode için 26, `LSHIFT#`/`RSHIFT#` için +8, +8 sessiz için.

| xxxxxxxxxxxxxxxxxxxxxxFift sözdizimi | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYığın |
|:-|:-|
| `MULADDDIVMOD` | _`x y w z - q=floor((xy+w)/z) r=(xy+w)-zq`_              |
| `MULADDDIVMODR` | _`x y w z - q=round((xy+w)/z) r=(xy+w)-zq`_              |
| `MULADDDIVMODC` | _`x y w z - q=ceil((xy+w)/z) r=(xy+w)-zq`_               |
| `ADDDIVMOD` | _`x w z - q=floor((x+w)/z) r=(x+w)-zq`_                  |
| `ADDDIVMODR` | _`x w z - q=round((x+w)/z) r=(x+w)-zq`_                  |
| `ADDDIVMODC` | _`x w y - q=ceil((x+w)/z) r=(x+w)-zq`_                   |
| `ADDRSHIFTMOD` | _`x w z - q=floor((x+w)/2^z) r=(x+w)-q*2^z`_             |
| `ADDRSHIFTMODR` | _`x w z - q=round((x+w)/2^z) r=(x+w)-q*2^z`_             |
| `ADDRSHIFTMODC` | _`x w z - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`_              |
| `z ADDRSHIFT#MOD` | _`x w - q=floor((x+w)/2^z) r=(x+w)-q*2^z`_               |
| `z ADDRSHIFTR#MOD` | _`x w - q=round((x+w)/2^z) r=(x+w)-q*2^z`_               |
| `z ADDRSHIFTC#MOD` | _`x w - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`_                |
| `MULADDRSHIFTMOD` | _`x y w z - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`_         |
| `MULADDRSHIFTRMOD` | _`x y w z - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`_         |
| `MULADDRSHIFTCMOD` | _`x y w z - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`_          |
| `z MULADDRSHIFT#MOD` | _`x y w - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`_           |
| `z MULADDRSHIFTR#MOD` | _`x y w - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`_           |
| `z MULADDRSHIFTC#MOD` | _`x y w - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`_            |
| `LSHIFTADDDIVMOD` | _`x w z y - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`_        |
| `LSHIFTADDDIVMODR` | _`x w z y - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`_        |
| `LSHIFTADDDIVMODC` | _`x w z y - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`_         |
| `y LSHIFT#ADDDIVMOD` | _`x w z - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`_          |
| `y LSHIFT#ADDDIVMODR` | _`x w z - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`_          |
| `y LSHIFT#ADDDIVMODC` | _`x w z - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`_           |

---

## Yığın İşlemleri
Şu anda tüm yığın işlemlerinin argümanları 256 ile sınırlıdır. Bu, yığın derinliği 256'dan fazla olduğunda derin yığın öğelerini yönetmenin zor olduğu anlamına gelir. Çoğu durumda, bu sınır için güvenlik nedenleri yoktur, yani argümanlar aşırı maliyetli işlemleri önlemek için sınırlı değildir.

:::note
`ROLLREV` gibi bazı toplu yığın işlemleri için (burada hesaplama süresi doğrusal olarak argüman değerine bağlıdır), gaz maliyeti de argüman değerine doğrusal olarak bağlıdır.
:::

- `PICK`, `ROLL`, `ROLLREV`, `BLKSWX`, `REVX`, `DROPX`, `XCHGX`, `CHKDEPTH`, `ONLYTOPX`, `ONLYX` argümanlarının artık sınırsızdır.
- `ROLL`, `ROLLREV`, `REVX`, `ONLYTOPX` büyük argümanlar kullanıldığında daha fazla gaz tüketmektedir: ek gaz maliyeti `max(arg-255,0)` (256'dan az olan argüman için gaz tüketimi sabit ve mevcut davranışa karşılık gelmektedir).
- `BLKSWX` için ek maliyet `max(arg1+arg2-255,0)`'dır (mevcut davranışla örtüşmediğinden, çünkü şu anda hem `arg1` hem de `arg2` 255 ile sınırlıdır).

---

## Hash'ler
Şu anda TVM'de yalnızca iki hash işlemi mevcuttur: hücre/şerit temsil hash'sinin hesaplanması ve verinin sha256'sı, ancak yalnızca 127 byte'a kadar (bu kadar veri yalnızca bir hücreye sığar).

:::tip
`HASHEXT[A][R]_(HASH)` ailesi işlemleri eklenmiştir:
:::

| xxxxxxxxxxxxxxxxxxxFift sözdizimi | xxxxxxxxxxxxxxxxxxxxxxYığın | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAçıklama                                |
|:-|:-|:--------------------------------------------------------------------------------------|
| `HASHEXT_(HASH)` | _`s_1 ... s_n n - h`_            | `s_1...s_n` dilimlerinin (veya oluşturucuların) birleştirilmiş hash'ını hesaplar ve döndürür. |
| `HASHEXTR_(HASH)` | _`s_n ... s_1 n - h`_            | Aynı işlem, ancak argümanlar ters sırada verilir.                                 |
| `HASHEXTA_(HASH)` | _`b s_1 ... s_n n - b'`_         | Hesaplanan hash'ı bir oluşturucu `b`'ye ekler, yığına itmek yerine.       |
| `HASHEXTAR_(HASH)` | _`b s_n ... s_1 n - b'`_         | Argümanlar ters sırada verilir, oluşturucuya hash ekler.                        |

`s_i`'nin kök hücrelerinden yalnızca bitler kullanılır.

Her parça `s_i`, tam sayı olmayan byte sayısını içerebilir. Ancak, tüm parçaların bit toplamı 8'e tam olarak bölünebilir olmalıdır. TON, en anlamlı bit sıralaması kullanır, bu nedenle tam sayı olmayan byte sayısına sahip iki dilim birleştirildiğinde, ilk dilimden bitler en anlamlı bitler haline gelir.

**Gaz tüketimi**, hash'lenen byte sayısına ve seçilen algoritmaya bağlıdır. Her bir parça için ek olarak 1 gaz birimi tüketilir.

`[A]` etkin değilse, hash'in sonucu 256 bit sığarsa imzalı bir tam sayı olarak döndürülür, aksi takdirde tamsayılar tuple olarak döner.

### Mevcut Algoritmalar
Aşağıdaki algoritmalar mevcuttur:
- `SHA256` - openssl implementasyonu, byte başına 1/33 gaz, hash 256 bit.
- `SHA512` - openssl implementasyonu, byte başına 1/16 gaz, hash 512 bit.
- `BLAKE2B` - openssl implementasyonu, byte başına 1/19 gaz, hash 512 bit.
- `KECCAK256` - [ethereum uyumlu implementasyon](http://keccak.noekeon.org/), byte başına 1/11 gaz, hash 256 bit.
- `KECCAK512` - [ethereum uyumlu implementasyon](http://keccak.noekeon.org/), byte başına 1/6 gaz, hash 512 bit.

**Gaz kullanımı** aşağı yuvarlanır.

---

## Kripto
Şu anda mevcut olan tek kriptografik algoritma `CHKSIGN`: `h` hash'inin Ed25519 imzasını bir genel anahtar `k` için kontrol eder.

:::warning
- Önceki nesil blok zincirleri ile uyumluluk için, Bitcoin ve Ethereum gibi `secp256k1` imzalarını kontrol etmemiz de gerekmektedir.
- Modern kriptografik algoritmalar için, en azından eğri toplama ve çarpma gereklidir.
- Ethereum 2.0 PoS ve diğer bazı modern kriptografi ile uyumluluk için, bls12-381 eğrisi üzerinde BLS imza şemasına ihtiyacımız var.
- Bazı güvenli donanımlar için secp256r1 == P256 == prime256v1 gereklidir.
:::

### secp256k1
Bitcoin/ethereum imzaları. [libsecp256k1 implementasyonu](https://github.com/bitcoin-core/secp256k1) kullanır.

| xxxxxxxxxxxxxFift sözdizimi | xxxxxxxxxxxxxxxxxYığın | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAçıklama |
|:-|:-|:-|
| `ECRECOVER` | _`hash v r s - 0 veya h x1 x2 -1`_ | İmzadan genel anahtarı kurtarır, Bitcoin/Ethereum işlemleri ile aynıdır.32 byte hash'i `hash` olarak uint256; 65 byte imza olarak uint8 `v` ve uint256 `r`, `s` alır.Başarısızlıkta `0`, başarıda genel anahtar ve `-1` döndürür.65 byte genel anahtar uint8 `h`, uint256 `x1`, `x2` olarak döndürülür._1526 gaz_ |

---

### secp256r1
OpenSSL implementasyonunu kullanır. Arayüz `CHKSIGNS`/`CHKSIGNU` ile benzerdir. Apple Secure Enclave ile uyumludur.

| xxxxxxxxxxxxxFift sözdizimi | xxxxxxxxxxxxxxxxxYığın | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAçıklama |
|:-|:-|:-|
| `P256_CHKSIGNS` | _`d sig k - ?`_ | Dilim `d`'nin veri kısmının ve genel anahtar `k`'nin `sig`'inin seck256r1 imzasını kontrol eder. Başarıda -1, başarısızlıkta 0 döndürür.Genel anahtar 33 byte'lık bir dilimdir ( [SECG SEC 1](https://www.secg.org/sec1-v2.pdf) bölüm 2.3.4 nokta 2'ye göre kodlanmıştır).İmza `sig`, iki 256-bit tamsayı `r` ve `s` olan 64 byte'lık bir dilimdir._3526 gaz_ |
| `P256_CHKSIGNU` | _`h sig k - ?`_ | Aynı işlem, ancak imzalı veri 256-bit işaretsiz tam sayı `h`'nin 32 byte'lık kodlamasıdır._3526 gaz_ |

---

### Ristretto
Genişletilmiş belgeler [burada](https://ristretto.group/) bulunmaktadır. Kısacası, Curve25519 performans dikkate alınarak geliştirildi, ancak birden fazla temsile sahip olduğu için simetri sergilemektedir. Daha basit protokoller, Schnorr imzaları veya Diffie-Hellman gibi bazı sorunları azaltmak için protokol düzeyinde hileler uygular, ancak anahtar türetme ve anahtar karartma şemalarını bozar. Ve bu hileler, Bulletproofs gibi daha karmaşık protokoller için ölçeklenemez. Ristretto, her grup öğesinin benzersiz bir noktaya karşılık geldiği şekilde Curve25519 üzerinde bir aritmetik soyutlama sağlar; bu, çoğu kriptografik protokol için gereklidir. Ristretto, Curve25519 için gerekli aritmetik soyutlamayı sunan bir sıkıştırma/açma protokolüdür. Sonuç olarak, kripto protokollerinin doğru yazılması kolaydır ve aynı zamanda Curve25519'un yüksek performansından yararlanırlar.

Ristretto işlemleri, Curve25519 üzerinde eğri işlemleri hesaplamayı sağlar (tersi doğru değildir), bu nedenle hem Ristretto'yu hem de Curve25519 eğri işlemini tek adımda eklediğimizi düşünebiliriz.

[libsodium](https://github.com/jedisct1/libsodium/) implementasyonu kullanılmaktadır.

Tüm ristretto-255 noktaları TVM'de 256-bit imzalı tam sayılar olarak temsil edilmektedir. 
Sessiz (quiet) işlemler geçerli kodlanmış noktalar değilse `range_chk` atar. 
Sıfır noktası tam sayı `0` olarak temsil edilir.

| xxxxxxxxxxxxxFift sözdizimi | xxxxxxxxxxxxxxxxxYığın | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAçıklama                                                        |
|:-|:-|:------------------------------------------------------------------------------------------------------------------|
| `RIST255_FROMHASH` | _`h1 h2 - x`_ | 512-bit hash'den (iki 256-bit tam sayı olarak verilen) deterministik olarak geçerli bir nokta `x` oluşturur._626 gaz_  |
| `RIST255_VALIDATE` | _`x -`_ | Tam sayı `x`'nin geçerli bir eğri noktası olup olmadığını kontrol eder. Hata durumunda `range_chk` atar._226 gaz_ |
| `RIST255_ADD` | _`x y - x+y`_ | Eğri üzerindeki iki noktanın toplamını hesaplar._626 gaz_                                                                  |
| `RIST255_SUB` | _`x y - x-y`_ | Eğri üzerindeki iki noktanın farkını hesaplar._626 gaz_                                                                 |
| `RIST255_MUL` | _`x n - x*n`_ | Nokta `x`'yi `n` skalar ile çarpar.Herhangi bir `n` geçerlidir, negatif olanlar dâhildir._2026 gaz_                    |
| `RIST255_MULBASE` | _`n - g*n`_ | Üretici noktası `g`'yi `n` skalar ile çarpar.Herhangi bir `n` geçerlidir, negatif olanlar dâhildir._776 gaz_       |
| `RIST255_PUSHL` | _`- l`_ | Kümenin sırasını temsil eden `l=2^252+27742317777372353535851937790883648493` değerini yığına iter._26 gaz_    |
| `RIST255_QVALIDATE` | _`x - 0 veya -1`_ | Sessiz (quiet) sürümü `RIST255_VALIDATE`._234 gaz_                                                                |
| `RIST255_QADD` | _`x y - 0 veya x+y -1`_ | Sessiz (quiet) sürümü `RIST255_ADD`. _634 gaz_                                                                    |
| `RIST255_QSUB` | _`x y - 0 veya x-y -1`_ | Sessiz (quiet) sürümü `RIST255_SUB`._634 gaz_                                                                     |
| `RIST255_QMUL` | _`x n - 0 veya x*n -1`_ | Sessiz (quiet) sürümü `RIST255_MUL`._2034 gaz_                                                                    |
| `RIST255_QMULBASE` | _`n - 0 veya g*n -1`_ | Sessiz (quiet) sürümü `RIST255_MULBASE`._784 gaz_                                                                 |

---

### BLS12-381
Eşleme dostu BLS12-381 eğrisi üzerindeki işlemler. [BLST](https://github.com/supranational/blst) implementasyonu kullanılmaktadır. Ayrıca, bu eğriye dayalı BLS imza şeması için ops sağlanmaktadır.

BLS değerleri TVM'de şu şekilde temsil edilmektedir:
- G1-points ve genel anahtarlar: 48 byte dilim.
- G2-points ve imzalar: 96 byte dilim.
- FP alanının elemanları: 48 byte dilim.
- FP2 alanının elemanları: 96 byte dilim.
- Mesajlar: dilim. Bit sayısı 8'e bölünebilir olmalıdır.

Giriş değeri bir nokta veya bir alan elemanı olduğunda, dilim 48/96 byte'dan fazla olabilir. Bu durumda yalnızca ilk 48/96 byte alınır. Eğer dilim daha az byte içerirse (veya mesaj boyutu 8'e bölünemiyorsa), hücre alt akışı istisnası atılır.

#### Yüksek Seviyeli İşlemler
Bunlar BLS imzalarını doğrulamak için yüksek seviyeli işlemlerdir.

| xxxxxxxxxxxxxFift sözdizimi | xxxxxxxxxxxxxxxxxYığın | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAçıklama                                                                                                                 |
|:-|:-|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `BLS_VERIFY` | _`pk msg sgn - bool`_ | BLS imzasını kontrol eder, başarıda true, aksi halde false döndürür._61034 gaz_                                                                                             |
| `BLS_AGGREGATE` | _`sig_1 ... sig_n n - sig`_ | İmzaları toplar. `n>0`. `n=0` veya `sig_i`'den biri geçerli bir imza değilse istisna fırlatır._`gaz=n*4350-2616`_                                                |
| `BLS_FASTAGGREGATEVERIFY`- | _`pk_1 ... pk_n n msg sig - bool`_ | Anahtarlar `pk_1...pk_n` ve mesaj `msg` için toplu BLS imzasını kontrol eder. Başarısızlıkta false döner, `n=0` ise false döner._`gaz=58034+n*3000`_         |
| `BLS_AGGREGATEVERIFY` | _`pk_1 msg_1 ... pk_n msg_n n sgn - bool`_ | Anahtar-mesaj çifti `pk_1 msg_1...pk_n msg_n` için toplu BLS imzasını kontrol eder. Başarısızlıkta false döner, `n=0` ise false döner._`gaz=38534+n*22500`_ |

:::warning
`VERIFY` talimatları geçersiz imza ve genel anahtarlar üzerinde istisna atmaz (hücre alt akış istisnaları dışında), bunun yerine false döner.
:::

#### Düşük seviye işlemler
Bunlar, grup elemanları üzerinde yapılan aritmetik işlemlerdir.

| xxxxxxxxxxxxxFift sözdizimi | xxxxxxxxxxxxxxxxxYığın | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAçıklama                                                                                                                                                                      |
|:-|:-|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `BLS_G1_ADD` | _`x y - x+y`_ | G1 üzerinde toplama._3934 gaz_                                                                                                                                                                                                  |
| `BLS_G1_SUB` | _`x y - x-y`_ | G1 üzerinde çıkarma._3934 gaz_                                                                                                                                                                                               |
| `BLS_G1_NEG` | _`x - -x`_ | G1 üzerinde olumsuzlama._784 gaz_                                                                                                                                                                                                   |
| `BLS_G1_MUL` | _`x s - x*s`_ | G1 noktasını `x` skalar `s` ile çarpar.Herhangi bir `s` geçerlidir, negatif olanlar da dahil._5234 gaz_                                                                                                                                 |

| `BLS_G1_MULTIEXP` | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | G1 noktaları `x_i` ve skalarlar `s_i` için `x_1*s_1+...+x_n*s_n` hesaplar. `n=0` ise sıfır noktası döner.Herhangi bir `s_i` geçerlidir, negatif olanlar da dahil._`gaz=11409+n*630+n/floor(max(log2(n),4))*8820`_                           || `BLS_G1_ZERO` | _`- sıfır`_ | G1'de sıfır noktasını iteler._34 gaz_                                                                                                                                                                                           |
| `BLS_MAP_TO_G1` | _`f - x`_ | FP elemanı `f`'yi G1 noktasına dönüştürür._2384 gaz_                                                                                                                                                                           |
| `BLS_G1_INGROUP` | _`x - bool`_ | Dilim `x`'nin G1'in geçerli bir elemanını temsil edip etmediğini kontrol eder._2984 gaz_                                                                                                                                                          |
| `BLS_G1_ISZERO` | _`x - bool`_ | G1 noktası `x`'nin sıfıra eşit olup olmadığını kontrol eder._34 gaz_                                                                                                                                                                         |
| `BLS_G2_ADD` | _`x y - x+y`_ | G2 üzerinde toplama._6134 gaz_                                                                                                                                                                                                  |
| `BLS_G2_SUB` | _`x y - x-y`_ | G2 üzerinde çıkarma._6134 gaz_                                                                                                                                                                                               |
| `BLS_G2_NEG` | _`x - -x`_ | G2 üzerinde olumsuzlama._1584 gaz_                                                                                                                                                                                                  |
| `BLS_G2_MUL` | _`x s - x*s`_ | G2 noktasını `x` skalar `s` ile çarpar.Herhangi bir `s` geçerlidir, negatif olanlar da dahil._10584 gaz_                                                                                                                                |
| `BLS_G2_MULTIEXP` | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | G2 noktaları `x_i` ve skalarlar `s_i` için `x_1*s_1+...+x_n*s_n` hesaplar. `n=0` ise sıfır noktası döner.Herhangi bir `s_i` geçerlidir, negatif olanlar da dahil._`gaz=30422+n*1280+n/floor(max(log2(n),4))*22840`_                         |
| `BLS_G2_ZERO` | _`- sıfır`_ | G2'de sıfır noktasını iteler._34 gaz_                                                                                                                                                                                           |
| `BLS_MAP_TO_G2` | _`f - x`_ | FP2 elemanı `f`'yi G2 noktasına dönüştürür._7984 gaz_                                                                                                                                                                          |
| `BLS_G2_INGROUP` | _`x - bool`_ | Dilim `x`'nin G2'nin geçerli bir elemanını temsil edip etmediğini kontrol eder._4284 gaz_                                                                                                                                                          |
| `BLS_G2_ISZERO` | _`x - bool`_ | G2 noktası `x`'nin sıfıra eşit olup olmadığını kontrol eder._34 gaz_                                                                                                                                                                         |
| `BLS_PAIRING` | _`x_1 y_1 ... x_n y_n n - bool`_ | G1 noktaları `x_i` ve G2 noktaları `y_i` verilen, `x_i,y_i` eşleşmelerini hesaplar ve çarpar. Sonuç FP12'de çarpan kimliği ise doğru döner, aksi halde yanlış döner. `n=0` ise yanlış döner._`gaz=20034+n*11800`_ |
| `BLS_PUSHR` | _`- r`_ | G1 ve G2'nin sırasını iteler (yaklaşık `2^255`)._34 gaz_                                                                                                                                                                   |

:::warning
`INGROUP`, `ISZERO` geçersiz noktalar üzerinde istisna atmaz (hücre alt akış istisnaları dışında), bunun yerine yanlış döner. 
Diğer aritmetik işlemler geçersiz eğri noktaları üzerinde istisna atar. Verilen eğri noktalarının G1/G2 grubuna ait olup olmadığını kontrol etmezler. Bunu kontrol etmek için `INGROUP` talimatını kullanın.
:::

---

## RUNVM
Şu anda, TVM'deki kodun dışarıdan güvenilmeyen kodu "sandık içinde" çağırmasının bir yolu yok. Başka bir deyişle, harici kod her zaman sözleşmenin kodunu, verilerini veya tüm parayı gönderme gibi eylemleri geri dönüşü olmayan bir şekilde güncelleyebilir.

`RUNVM` talimatı, bağımsız bir VM örneği başlatmayı, istenen kodu çalıştırmayı ve gereken verileri (yığın, kayıtlar, gaz tüketimi vb.) çağıranın durumunu kirletmeden almayı sağlar. Rastgele kodu güvenli bir şekilde çalıştırmak, `v4 tarzı eklentiler`, [Tact'ın](https://docs.tact-lang.org) `init` tarzı alt sözleşme hesaplama gibi durumlar için faydalı olabilir.

| xxxxxxxxxxxxxFift sözdizimi | xxxxxxxxxxxxxxxxxYığın | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAçıklama                                                                                                                           |
|:-|:-|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `flags RUNVM` | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | `code` ve yığın `x_1...x_n` ile çocuk VM'i çalıştırır. Sonuç yığınını `x'_1...x'_m` ve çıkış kodunu döner.Diğer argümanlar ve dönüş değerleri, aşağıda belirtilen bayraklarla etkinleştirilir. |
| `RUNVMX` | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] flags - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | Aynı şey, ancak bayrakları yığından çıkarır.                                                                                                                                               |

Bayraklar, fift'teki `runvmx` ile benzer:
- `+1`: c3'ü koda ayarla
- `+2`: kodu çalıştırmadan önce bir örtük 0 ekle
- `+4`: yığından `c4`'ü al (kalıcı veri), nihai değerini döner
- `+8`: yığından gaz limitini `g_l` al, kullanılan gazı `g_c` döner
- `+16`: yığından `c7`'yi al (akıllı sözleşme bağlamı)
- `+32`: `c5`'in nihai değerini döner (hareketler)
- `+64`: yığından zor gaz limitini `g_m` çıkar (KABUL ile etkinleşmiştir)
- `+128`: "izole gaz tüketimi". Çocuk VM ayrı bir ziyaret edilen hücreler setine ve ayrı bir chksgn sayacına sahip olacaktır.
- `+256`: tam olarak `r` değerini döndür, yığının tepe noktasından `r` değerini çıkar:
      - RUNVM çağrısı başarılı ise ve `r` ayarlanmışsa, `r` eleman döner. Eğer `r` ayarlanmamışsa - tümünü döner;
      - RUNVM başarılıdır ama yığında yeterli eleman yoksa (yığın derinliği `r`'den az) bu çocuk VM'de bir istisna olarak kabul edilir, çıkış_kodu=-3 ve çıkış_argümanı=0 (0, tek yığın elemanı olarak döner);
      - RUNVM, istisna ile başarısız olursa - yalnızca bir eleman döner - çıkış argümanı (çıkış kodu ile karıştırılmamalıdır);
      - OOG durumunda ise, çıkış_kodu = -14 ve çıkış_argümanı gaz miktarıdır.

:::note
Gaz maliyeti:
- 66 gaz
- Çocuk VM'e verilen her yığın elemanı için 1 gaz (ilk 32 ücretsiz)
- Çocuk VM'den dönen her yığın elemanı için 1 gaz (ilk 32 ücretsiz)
:::

---

## Mesaj gönderme
Şu anda, bir sözleşmede mesaj gönderme maliyetini hesaplamak zordur (bu da bazı yaklaşık hesaplamalara neden olur, örneğin [jettons](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L94)) ve eylem aşaması yanlışsa isteğin geri dönüşünü sağlamak imkansızdır. Ayrıca, "sözleşme mantığı için sabit ücret" ve "gaz masraflarından" gelen mesajın toplamından doğru bir şekilde çıkarmak da imkansızdır.

- `SENDMSG`, bir hücre ve mod olarak giriş alır. Bir çıkış eylemi oluşturur ve bir mesaj oluşturma ücreti döner. Mod, SENDRAWMSG durumundaki etkiyle aynı etkiye sahiptir. Ek olarak, `+1024` demek - bir eylem oluşturma, yalnızca ücreti tahmin et. Diğer modlar, ücret hesaplamalarını şu şekilde etkiler: `+64` gelen mesajın tüm bakiyesinin çıkış değeri olarak değiştirilmesini sağlar (hafif hatalı, hesaplama tamamlanmadan önce tahmin edilemeyen gaz masrafları hesaba katılmamaktadır), `+128` ise hesaplama aşamasının başlangıcından önce sözleşmenin bakiyesinin tüm değerini değiştirilmesini sağlar (hafif hatalı, çünkü hesaplama aşaması tamamlanmadan önce tahmin edilemeyen gaz masrafları hesaba katılmamaktadır).
- `SENDRAWMSG`, `RAWRESERVE`, `SETLIBCODE`, `CHANGELIB` - `+16` bayrağı eklenir, bu demektir ki eylem başarısız olursa - işlemi geri döner. `+2` kullanıldığında hiçbir etkisi yoktur.