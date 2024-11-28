# Yapılandırma Parametreleri

:::info
Canlı değerleri [tonviewer](https://tonviewer.com/config) ile okuyun
:::

## 👋 Giriş

Bu sayfada, TON Blockchain'de kullanılan yapılandırma parametrelerinin tanımını bulabilirsiniz. TON'un birçok teknik parametre ile karmaşık bir yapılandırması vardır: bazıları blockchain'in kendisi tarafından, bazıları ise ekosistem tarafından kullanılır. Ancak, bu parametrelerin ne anlama geldiğini yalnızca birkaç kişi anlar. Bu makale, kullanıcılara bu parametreleri ve amaçlarını anlaması için basit bir yol sağlamak için gereklidir.

## 💡 Ön şartlar

Bu materyal, parametre listesinin yanında okunmak üzere tasarlanmıştır. Parametre değerlerini [mevcut yapılandırmada](https://explorer.toncoin.org/config) görebilir ve bunların `hücrelere` nasıl yazıldığını [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb) dosyasında `TL-B` formatında bulabilirsiniz.

:::info
TON Blockchain parametresinin sonundaki ikili kodlama, yapılandırmanın verimli depolanması veya iletimi için yapılandırmasının serileştirilmiş ikili temsilidir. Serileştirmenin kesin ayrıntıları, TON Blockchain tarafından kullanılan özel kodlama şemasına bağlıdır.
:::

---

## 🚀 Haydi başlayalım!

Tüm parametreler sıralıdır ve kaybolmazsınız. Kolaylığınız için, hızlı gezinme için sağ kenar çubuğunu kullanın.

## Param 0

Bu parametre, blockchain'in yapılandırmasını saklayan özel bir akıllı sözleşmenin adresidir. Yapılandırma, doğrulayıcı oylama sırasında yüklemesini ve değiştirilmesini kolaylaştırmak için sözleşmede saklanır.

:::info
Yapılandırma parametresinde yalnızca adresin hash kısmı kaydedilir, çünkü sözleşme her zaman `masterchain` (çalışma zinciri -1) içinde yer almaktadır. Bu nedenle, sözleşmenin tam adresi `-1:` olarak yazılacaktır.
:::

## Param 1

Bu parametre, doğrulayıcıları atamaktan, ödülleri dağıtmaktan ve blockchain parametrelerindeki değişiklikler için oy kullanmaktan sorumlu olan `Elector` akıllı sözleşmesinin adresidir.

## Param 2

Bu parametre, yeni TON'ların basıldığı ve blockchain'i doğrulama ödülü olarak gönderildiği Sistem'in adresini temsil eder.

:::info
Eğer parametre 2 yoksa, bunun yerine parametre 0 kullanılır (yeni basılan TON'lar yapılandırma akıllı sözleşmesinden gelir).
:::

## Param 3

Bu parametre, işlem ücreti toplayıcısının adresidir.

:::info
Parametre 3 yoksa (yazı zamanında olduğu gibi), işlem ücretleri Elector akıllı sözleşmesine (parametre 1) gönderilir.
:::

## Param 4

Bu parametre, TON ağının kök DNS sözleşmesinin adresidir.

:::info
Daha detaylı bilgiye `TON DNS & Domains` makalesinde ve daha ayrıntılı orijinal açıklamada [burada](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md) ulaşabilirsiniz. Bu sözleşme, .ton alan adlarını satmaktan sorumlu değildir.
:::

## Param 6

Bu parametre, yeni para birimlerinin basım ücretlerinden sorumludur.

:::info
Şu anda, ek para birimi basımı uygulanmamış ve çalışmamaktadır. Basım ve minter'ın başlatılması planlanmaktadır.

Sorunlar ve beklentiler hakkında daha fazla bilgi edinebilirsiniz `ilgili makalede`.
:::

## Param 7

Bu parametre, dolaşımda bulunan her bir ek para biriminin hacmini saklar. Veriler, bir `sözlük` (ikili ağaç; muhtemelen TON'un geliştirilmesi sırasında bu yapı hatalı olarak hashmap olarak adlandırılmıştır) biçiminde `extracurrency_id -> miktar` olarak saklanır; miktar, `0` ile `2^248` arasındaki bir tam sayı olarak `VarUint 32` şeklinde sunulur.

## Param 8

Bu parametre, ağın sürümünü ve doğrulayıcılar tarafından desteklenen ek yetenekleri belirtir.

:::info
Doğrulayıcılar, yeni bloklar oluşturmak ve işlemleri doğrulamakla sorumlu olan blockchain ağına düğümlerdir.
:::

- **`version`**: Bu alan sürümü belirtir.
- **`capabilities`**: Bu alan, belirli özelliklerin veya yeteneklerin varlığı veya yokluğunu göstermek için kullanılan bir dizi bayraktır.

Böylece, ağı güncellerken, doğrulayıcılar parametre 8'i değiştirmek için oy kullanacaktır. Bu şekilde, TON ağı kesinti olmadan güncellenebilir.

## Param 9

Bu parametre, zorunlu parametrelerin bir listesini (ikili ağaç) içerir. Bu, belirli yapılandırma parametrelerinin her zaman mevcut olmasını ve parametre 9 değişmeden yapılandırmayı değiştirmek için bir öneri ile kaldırılmasını engeller.

## Param 10

Bu parametre, ağ üzerinde önemli etkisi olan kritik TON parametrelerinin bir listesini (ikili ağaç) temsil eder; bu nedenle daha fazla oylama turu yapılır.

## Param 11

Bu parametre, TON yapılandırmasını değiştirmek üzere önerilerin hangi koşullarda kabul edildiğini belirtir.

- **`min_tot_rounds`** - bir teklifin uygulanabilmesi için gereken minimum tur sayısı  
- **`max_tot_rounds`** - teklifin otomatik olarak reddedileceği maksimum tur sayısı  
- **`min_wins`** - gerekli kazanma sayısı (doğrulayıcıların %75'inin oy vermesi gerekiyor)  
- **`max_losses`** - teklifin otomatik olarak reddedileceği maksimum kayıplar  
- **`min_store_sec`** ve **`max_store_sec`**, teklifin saklanabileceği zaman aralığını belirler  
- **`bit_price`** ve **`cell_price`**, teklifin bir bit veya bir hücresinin saklama fiyatını gösterir  

## Param 12

Bu parametre, TON Blockchain'de bir çalışma zincirinin yapılandırmasını temsil eder. TON Blockchain'deki çalışma zincirleri, bağımsız blockchainler olarak tasarlanmıştır ve paralel olarak çalışabilirler; bu, TON'un ölçeklenmesine ve çok sayıda işlem ve akıllı sözleşmeyi işleyebilmesine olanak tanır.

## Çalışma zinciri yapılandırma parametreleri

- **`enabled_since`**: Bu çalışma zincirinin etkinleştirildiği anın UNIX zaman damgası;  
- **`actual_min_split`**: Bu çalışma zincirinin, doğrulayıcılar tarafından desteklenen minimum bölünme (sharding) derinliği;  
- **`min_split`**: Bu çalışma zincirinin yapılandırma ile belirlenen minimum bölünme derinliği;  
- **`max_split`**: Bu çalışma zincirinin maksimum bölünme derinliği;  
- **`basic`**: Bu çalışma zincirinin temel olup olmadığını gösteren bir boolean bayrağı (1 doğru için, 0 yanlış için);  
- **`active`**: Bu çalışma zincirinin o anda aktif olup olmadığını belirten bir boolean bayrağı;  
- **`accept_msgs`**: Bu çalışma zincirinin o anda mesaj kabul edip etmediğini gösteren bir boolean bayrağı;  
- **`flags`**: Çalışma zinciri için ek bayraklar (ayırılmış, şu anda her zaman 0);  
- **`zerostate_root_hash`** ve **`zerostate_file_hash`**: Çalışma zincirinin ilk bloğunun hashleri;  
- **`version`**: Çalışma zincirinin sürümü;  
- **`format`**: Çalışma zincirinin formatı; vm_version ve vm_mode'yu içerir - burada kullanılan sanal makine.  

## Param 13

Bu parametre, `Elector` sözleşmesinde doğrulayıcıların yanlış çalışmaları hakkında şikayet yapma maliyetini tanımlar.

## Param 14

Bu parametre, TON Blockchain'de blok oluşturma ödülünü temsil eder. Nanogramlar nanoTON'dur, bu nedenle masterchain'de blok oluşturma ödülü **1.7 TON**, temel çalışma zincirinde - **1.0 TON**'dir (bu arada, bir çalışma zinciri bölündüğünde, blok ödülü de bölünür: eğer çalışma zincirinde iki shardchain varsa, shard bloğu ödülü **0.5 TON** olacaktır).

## Param 15

Bu parametre, TON Blockchain'deki seçimlerin ve doğrulayıcıların çalışma sürelerinin farklı aşamalarını içerir.

Her doğrulama dönemi için, doğrulama başlangıcında UNIX formatında `election_id` vardır. Mevcut `election_id`'yi (eğer seçimler devam ediyorsa) veya geçmişteki birini Elector sözleşmesinin ilgili get metodları olan `active_election_id` ve `past_election_ids` ile alabilirsiniz.

## Çalışma zinciri yapılandırma parametreleri

- **`validators_elected_for`**: Seçilen doğrulayıcıların rollerini yerine getirdiği süre (bir tur).  
- **`elections_start_before`**: Mevcut turun sonundan önce seçim sürecinin ne kadar süre önce başlayacağını belirtir.  
- **`elections_end_before`**: Mevcut turun sonundan önce bir sonraki tur için doğrulayıcıların ne kadar süre önce seçileceğini belirtir.  
- **`stake_held_for`**: Bir doğrulayıcının stake'inin (şikayetlerin işlenmesi için) turun sona ermesinden sonra tutulduğu dönem.  

:::info
Argümanlardaki her değer, `uint32` veri türü tarafından belirlenir.
:::

### Örnekler

TON Blockchain'de, doğrulama dönemlerini genellikle çift ve tek olanlar olarak ayırmak gelenekseldir. Bu turlar birbiri ardına gelir. Bir sonraki tur için oylama, önceki tur sırasında gerçekleştiğinden, bir doğrulayıcının katılma fırsatına sahip olmak için fonları iki havuza ayırması gerekir.

#### Ana Ağ

Mevcut değerler:

```python
constants = {
    'validators_elected_for': 65536,  # 18.2 saat
    'elections_start_before': 32768,  # 9.1 saat
    'elections_end_before': 8192,     # 2.2 saat
    'stake_held_for': 32768           # 9.1 saat
}
```

Şeması:

![image](../../../../images/ton/static/img/docs/blockchain-configs/config15-mainnet.png)

#### Dönemleri nasıl hesaplarız?

Let `election_id = validation_start = 1600032768`. Sonra:

```python
election_start = election_id - constants['elections_start_before'] = 1600032768 - 32768 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 1600032768 - 8192 = 1600024576
hold_start = validation_end = election_id + constants['validators_elected_for'] = 1600032768 + 65536 = 1600098304
hold_end = hold_start + constants['stake_held_for'] = 1600098304 + 32768 = 1600131072
```

Böylece, o anda bir parite turunun uzunluğu `1600131072 - 1600000000 = 131072 saniye = 36.40888... saat` dir.

#### Test Ağı

##### Mevcut değerler:

```python
constants = {
    'validators_elected_for': 7200,  # 2 saat
    'elections_start_before': 2400,  # 40 dakika
    'elections_end_before': 180,     # 3 dakika
    'stake_held_for': 900            # 15 dakika
}
```

##### Şema

![image](../../../../images/ton/static/img/docs/blockchain-configs/config15-testnet.png)

###### Dönemleri nasıl hesaplarız?

Let `election_id = validation_start = 160002400`. Sonra:

```python
election_start = election_id - constants['elections_start_before'] = 160002400 - 2400 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 160002400 - 180 = 160002220
hold_start = validation_end = election_id + constants['validators_elected_for'] = 160002400 + 7200 = 160009600
hold_end = hold_start + constants['stake_held_for'] = 160009600 + 900 = 160010500
```

Böylece, o anda bir parite turunun uzunluğu `160010500 - 1600000000 = 10500 saniye = 175 dakika = 2.91666... saat`dir.

## Param 16

Bu parametre, TON Blockchain'deki doğrulayıcıların sayısı üzerindeki sınırlamaları belirtir. Bu, doğrudan Elector akıllı sözleşmesi tarafından kullanılır.

### Seçimler için doğrulayıcı sayısı yapılandırma parametreleri:

- **`max_validators`**: Bu parametre, ağın işlemine katılabilecek maksimum doğrulayıcı sayısını temsil eder.  
- **`max_main_validators`**: Bu parametre, masterchain doğrulayıcılarının maksimum sayısını temsil eder.  
- **`min_validators`**: Bu parametre, ağın operasyonunu desteklemek için gerekli minimum doğrulayıcı sayısını temsil eder.  

1. Maksimum doğrulayıcı sayısı, maksimum masterchain doğrulayıcı sayısından büyük veya ona eşit olmalıdır.  
2. Maksimum masterchain doğrulayıcı sayısı, minimum doğrulayıcı sayısından büyük veya ona eşit olmalıdır.  
3. Minimum doğrulayıcı sayısı en az 1 olmalıdır.  

## Param 17

Bu parametre, TON Blockchain'deki stake parametreleri yapılandırmasını temsil eder. Birçok blockchain sisteminde, özellikle Proof-of-Stake veya Delegated Proof-of-Stake konsensüs algoritmasını kullananlar, ağa özgü kripto para sahipleri "stake" yaparak doğrulayıcı olmayı ve ödül kazanmayı sağlar.

## Yapılandırma parametreleri:

- **`min_stake`**: Bu parametre, doğrulama sürecine katılmak için bir tarafın stake etmesi gereken minimum TON miktarını temsil eder.
- **`max_stake`**: Bu parametre, bir tarafın stake edebileceği maksimum TON miktarını temsil eder.
- **`min_total_stake`**: Bu parametre, seçilen doğrulayıcı grubunun tutması gereken minimum toplam TON miktarını temsil eder.
- **`max_stake_factor`**: Bu parametre, maksimum etkili stake'in (teminat) ne kadar fazla olabileceğini gösteren bir çarpandır.

:::info
Argümanlardaki her değer, `uint32` veri türü tarafından belirlenir.
:::

## Param 18

Bu parametre, TON Blockchain'de veri depolama fiyatlarını belirlemek için yapılandırmayı temsil eder. Bu, spam'ı önlemek için bir önlem olarak hizmet eder ve ağın bakımını teşvik eder.

### Depolama ücreti parametreleri sözlüğü:

- **`utime_since`**: Bu parametre, belirtilen fiyatların geçerli olmaya başladığı başlangıç Unix zaman damgasını sağlar.
- **`bit_price_ps`** ve **`cell_price_ps`**: Bu parametreler, TON Blockchain'in ana çalışma zincirlerinde bir bit veya bir hücre bilgisi için depolama fiyatlarını temsil eder (65536 saniye için).
- **`mc_bit_price_ps`** ve **`mc_cell_price_ps`**: Bu parametreler, 65536 saniye için özellikle TON masterchain'deki hesaplama kaynakları için fiyatları temsil eder.

:::info
`utime_since`, `uint32` veri türünde değerler kabul eder.

Diğerleri, `uint64` veri türünde değerler kabul eder.
:::

## Param 20 ve 21

Bu parametreler, TON ağındaki hesaplamaların maliyetlerini belirler. Herhangi bir hesaplama karmaşıklığı, gaz birimlerinde değerlendirilir.

- **`flat_gas_limit`** ve **`flat_gas_price`**: Belirli bir başlangıç gazı, `flat_gas_price` fiyatında sağlanır (TON Sanal Makinesi'nin çalıştırma maliyetlerini karşılamak için).
- **`gas_price`**: Bu parametre, ağdaki gaz fiyatını, nanotons olarak 65536 gaz birimi başına yansıtır.
- **`gas_limit`**: Bu parametre, bir işlem başına tüketilebilecek maksimum gaz miktarını temsil eder.
- **`special_gas_limit`**: Bu parametre, özel (sistem) sözleşmesinin işlemine tüketilebilecek gaz miktarı üzerindeki limiti temsil eder.
- **`gas_credit`**: Bu parametre, harici bir mesajı kontrol etmek amacıyla işlemlere sağlanan gaz birimlerindeki krediyi temsil eder.
- **`block_gas_limit`**: Bu parametre, tek bir blok içinde tüketilebilecek maksimum gaz miktarını temsil eder.
- **`freeze_due_limit`** ve **`delete_due_limit`**: Bir sözleşmenin dondurulacağı ve silineceği, sırasıyla, birikmiş depolama ücretleri (nanoTON) üzerindeki sınırlardır.

:::info
`gas_credit` ve diğer parametreler hakkında daha fazlasını harici mesajlar bölümünde `burada` bulabilirsiniz.
:::

## Param 22 ve 23

Bu parametreler, blok üzerindeki sınırlamaları belirler; bunlara ulaşıldığında blok kesinleşir ve kalan mesajların geri çağrılması (varsa) bir sonraki bloğa taşınır.

### Yapılandırma parametreleri:

- **`bytes`**: Bu bölüm, blok boyutu üzerindeki sınırlamaları bayt cinsinden ayarlar.
- **`underload`**: Underload, shard'ın yük olmadığını anladığı ve komşu bir shard ile birleştirilme isteğinde bulunduğu bir durumdur.
- **`soft_limit`**: Yumuşak limit - bu limite ulaşıldığında, iç mesajların işlenmesi durur.
- **`hard_limit`**: Sert limit - bu, kesin maksimum boyuttur.
- **`gas`**: Bu bölüm, bir blokta tüketilebilecek gaz miktarı üzerindeki sınırlamaları belirler. Gaz, blockchain bağlamında hesaplama işini gösterir. Underload, yumuşak ve sert limitler için olan sınırlamalar, bayt boyutu için aynı şekildedir.
- **`lt_delta`**: Bu bölüm, ilk ve son işlem arasındaki mantıksal zaman farkı üzerindeki sınırlamaları belirler. Mantıksal zaman, olayların sıralanması için TON Blockchain'de kullanılan bir kavramdır. Underload, yumuşak ve sert limitler için olan sınırlamalar, bayt boyutu için aynı şekildedir ve gaz için aynı şekildedir.

:::info
Shard üzerindeki yetersiz yük durumunda ve dolayısıyla komşusuyla birleşme isteği durumunda, `soft_limit`, iç (iç) mesajların işlenmesinin durduğu bir durumu tanımlar, ancak dış (harici) mesajlar işlemeye devam eder. Dış (harici) mesajlar, `(soft_limit + hard_limit)/2` değerine eşit bir limite ulaşıncaya kadar işlenir.
:::

## Param 24 ve 25

Parametre 24, TON Blockchain'de masterchain'deki mesaj gönderim maliyeti yapılandırmasını temsil eder.

Parametre 25, diğer tüm durumlarda mesaj gönderim maliyeti yapılandırmasını temsil eder.

### İletme maliyetlerini tanımlayan yapılandırma parametreleri:

- **`lump_price`**: Bu parametre, bir mesajın iletilmesi için boyut veya karmaşıklıktan bağımsız olarak temel fiyatı ifade eder.
- **`bit_price`**: Bu parametre, mesaj iletimi için bit başına maliyeti temsil eder.
- **`cell_price`**: Bu parametre, bir mesajı hücre başına iletimin maliyetini yansıtır. Bir hücre, TON Blockchain'deki veri depolamanın temel birimidir.
- **`ihr_price_factor`**: Bu, hemen hiper küp yönlendirme (IHR) maliyetini hesaplamak için kullanılan bir faktördür.
  
    :::info
    IHR, TON Blockchain ağı içinde mesajların alıcının shard zincirine doğrudan gönderildiği bir yöntemdir.
    :::

- **`first_frac`**: Bu parametre, mesaj yolunun ilk geçişinde kullanılacak kalan miktarın payını tanımlar.
- **`next_frac`**: Bu parametre, mesaj yolundaki sonraki geçişler için kullanılacak kalan miktarın payını tanımlar.

## Param 28

Bu parametre, TON Blockchain'deki Catchain protokolü yapılandırmasını sağlar. Catchain, TON'da doğrulayıcılar arasında anlaşma sağlamak için kullanılan en düşük seviye konsensüs protokolüdür.

### Yapılandırma parametreleri:

- **`flags`**: Çeşitli ikili parametrelerin ayarlanmasında kullanılabilecek genel bir alandır. Bu durumda, 0'dır; bu da hiçbir özel bayrak ayarlanmadığı anlamına gelir.
- **`shuffle_mc_validators`**: Masterchain doğrulayıcılarının karıştırılıp karıştırılmayacağını belirten bir boolean değeridir. Bu parametre 1 olarak ayarlanmışsa, doğrulayıcılar karıştırılacaktır; aksi takdirde karıştırılmayacaktır.
- **`mc_catchain_lifetime`**: Masterchain catchain gruplarının saniye cinsinden ömrüdür.
- **`shard_catchain_lifetime`**: Shardchain catchain gruplarının saniye cinsinden ömrüdür.
- **`shard_validators_lifetime`**: Shardchain doğrulayıcı grubunun saniye cinsinden ömrüdür.
- **`shard_validators_num`**: Her shardchain doğrulama grubundaki doğrulayıcı sayısıdır.

## Param 29

Bu parametre, TON Blockchain'deki Catchain üzerindeki konsensüs protokolü yapılandırmasını sağlar (`Param 28`). Konsensüs protokolü, bir blockchain ağının kritik bir bileşenidir ve tüm düğümlerin dağıtılmış defterin durumunda uzlaştırılmasını sağlar.

### Konfigürasyon parametreleri:

-   `flags`: Çeşitli ikili parametreleri ayarlamak için kullanılabilen genel bir alan. Bu durumda, **0** değerindedir, yani belirli bir bayrak ayarlanmamıştır.

-   `new_catchain_ids`: Yeni Catchain kimlikleri oluşturulup oluşturulmayacağını belirten bir Boolean değeri. Bu parametre **1** olarak ayarlanmışsa, yeni kimlikler oluşturulacaktır. Bu durumda, değeri **1**'dir, yani yeni kimlikler oluşturulacaktır.

-   `round_candidates`: Konsensüs protokolünün her turunda dikkate alınacak aday sayısı. Burada, **3** olarak ayarlanmıştır.

-   `next_candidate_delay_ms`: Bir blok adayı oluşturma hakkının bir sonraki doğrulayıcıya geçmeden önceki milisaniye cinsinden gecikme. Burada, **2000 ms** (2 saniye) olarak ayarlanmıştır.

-   `consensus_timeout_ms`: Blok konsensüsü için milisaniye cinsinden zaman aşımı. Burada, **16000 ms** (16 saniye) olarak ayarlanmıştır.

---

-   `fast_attempts`: Konsensüse ulaşmak için "hızlı" denemelerin sayısı. Burada, **3** olarak ayarlanmıştır.

-   `attempt_duration`: Her uzlaşma girişiminin süresi. Burada, **8** olarak ayarlanmıştır.

-   `catchain_max_deps`: Bir Catchain bloğunun maksimum bağımlılık sayısı. Burada, **4** olarak ayarlanmıştır.

-   `max_block_bytes`: Bir bloğun maksimum boyutu bayt cinsinden. Burada, **2097152 bayt** (2 MB) olarak ayarlanmıştır.

-   `max_collated_bytes`: Seri hale getirilmiş blok doğruluk kanıtlarının maksimum boyutu bayt cinsinden. Burada, **2097152 bayt** (2 MB) olarak ayarlanmıştır.

-   `proto_version`: Protokol sürümü. Burada, **2** olarak ayarlanmıştır.

:::tip
Catchain'de blok üretim hızını sınırlayan katsayı, [açıklama](https://github.com/ton-blockchain/ton/blob/master/doc/catchain-dos.md). Burada, **10000** olarak ayarlanmıştır.
:::

## Param 31

Bu parametre, herhangi bir gaz veya depolama ücreti alınmayan akıllı sözleşme adreslerinin yapılandırmasını temsil eder ve tick-tok işlemleri oluşturulabilir. Liste genellikle yönetişim sözleşmelerini içerir. Parametre, anahtarların 256-bit temsilcisi olduğu bir ikili ağaç yapısı olarak sunulmaktadır. Sadece ana zincirdeki adresler bu listede bulunabilir.

## Param 32, 34 ve 36

Önceki (32), mevcut (34) ve sonraki (36) turların doğrulayıcılar listesini içerir. Parametre 36, seçimlerin bitiminden tur başlangıcına kadar ayarlanır.

### Konfigürasyon parametreleri:

-   `cur_validators`: Bu, mevcut doğrulayıcılar listesidir. Doğrulayıcılar genellikle bir blok zinciri ağında işlemleri doğrulamaktan sorumludur.

-   `utime_since` ve `utime_until`: Bu parametreler, bu doğrulayıcıların aktif olduğu süreyi sağlar.

-   `total` ve `main`: Bu parametreler toplam doğrulayıcı sayısını ve ağda ana zinciri doğrulayan doğrulayıcı sayısını sağlar.

-   `total_weight`: Bu, doğrulayıcıların ağırlıklarının toplamını alır.

-   `list`: Ağaç formatında doğrulayıcılar listesi `id->validator-data`: `validator_addr`, `public_key`, `weight`, `adnl_addr`: Bu parametreler her doğrulayıcı hakkında detaylar sağlar - ana zincirdeki 256 adresleri, genel anahtar, ağırlık, ADNL adresi (TON’un ağ düzeyinde kullanılan adresi).

## Param 40

Bu parametre, yanlış davranış (doğrulama dışındaki) için ceza yapılandırmasının yapısını tanımlar. Parametre mevcut değilse, varsayılan ceza büyüklüğü **101 TON**'dur.

---

## Konfigürasyon parametreleri:

** `MisbehaviourPunishmentConfig` **: Bu veri yapısı, sistemdeki yanlış davranışların nasıl cezalandırılacağını tanımlar.

Bir dizi alan içerir:

-   `default_flat_fine`: Bu cezanın, stake büyüklüğüne bağlı olmayan kısmıdır.

-   `default_proportional_fine`: Bu cezanın, doğrulayıcının stake büyüklüğüne orantılı olan kısmıdır.

-   `severity_flat_mult`: Bu, doğrulayıcı tarafından önemli ihlaller için `default_flat_fine` değerine uygulanan çarpandır.

-   `severity_proportional_mult`: Bu, doğrulayıcı tarafından önemli ihlaller için `default_proportional_fine` değerine uygulanan çarpandır.

-   `unpunishable_interval`: Bu parametre, geçici ağ sorunlarını veya diğer anormallikleri gidermek için suçluların cezalandırılmadığı süreyi temsil eder.

-   `long_interval`, `long_flat_mult`, `long_proportional_mult`: Bu parametreler yanlış davranışlar için "uzun" bir zaman aralığını ve düz ve orantılı cezalar için çarpanları tanımlar.

-   `medium_interval`, `medium_flat_mult`, `medium_proportional_mult`: Benzer şekilde, yanlış davranışlar için "orta" bir zaman aralığını ve düz ve orantılı cezalar için çarpanları tanımlar.

---

## Param 43

Bu parametre, hesaplar ve mesajlar için çeşitli boyut sınırlamaları ve diğer özellikleri kapsar.

### Konfigürasyon parametreleri:

-   `max_msg_bits`: maksimum mesaj boyutu bit cinsinden.

-   `max_msg_cells`: bir mesajın kaplayabileceği maksimum hücre sayısı (bir tür depolama birimi).

-   `max_library_cells`: kütüphane hücreleri için kullanılabilecek maksimum hücre sayısı.

-   `max_vm_data_depth`: mesajlar ve hesap durumu içindeki maksimum hücre derinliği.

-   `max_ext_msg_size`: dış mesaj için maksimum boyut bit cinsinden.

-   `max_ext_msg_depth`: maksimum dış mesaj derinliği. Bu, mesaj içindeki veri yapısının derinliğini ifade edebilir.

-   `max_acc_state_cells`: bir hesap durumunun kaplayabileceği maksimum hücre sayısı.

-   `max_acc_state_bits`: maksimum hesap durumu boyutu bit cinsinden.

Varsayılan değerler alındığında:

-   `max_size` = **65535**
-   `max_depth` = **512**
-   `max_msg_bits` = **1 \address`

-   `external_chain_address`: Bu, ilgili dış blok zincirindeki köprü sözleşme адресidir.

## Param 79, 81 ve 82

Bu parametre, diğer ağlardan TON ağına token sarmak için köprülere yöneliktir:

-   ETH-TON ** (79) **
-   BSC-TON ** (81) **
-   Polygon-TON ** (82) **

### Konfigürasyon parametreleri:

-   `bridge_address` ve `oracles_address`: Bunlar, köprü ve köprü yönetim sözleşmesinin (oracle çok imzalı) blok zinciri adresleridir.

-   `oracles`: ağaç formatında oracle listesi `id->address`

-   `state_flags`: Durum bayrağı. Bu parametre, ayrı köprü işlevlerinin etkinleştirilmesi/devre dışı bırakılmasından sorumludur.

-   `prices`: Bu parametre, köprü ile ilgili farklı işlemler veya ücretler için fiyatların bir listesini veya sözlüğünü içerir, örneğin `bridge_burn_fee`, `bridge_mint_fee`, `wallet_min_tons_for_storage`, `wallet_gas_consumption`, `minter_min_tons_for_storage`, `discover_gas_consumption`.

-   `external_chain_address`: Diğer bir blok zincirindeki köprü sözleşme adresidir.

---

## Negatif Parametreler

:::info
Negatif parametreler ile pozitif parametreler arasındaki fark, doğrulayıcıların doğrulama gerekliliğidir; genellikle belirli bir atanmış rolleri yoktur.
:::

## Sonraki Adımlar

Bu makaleye derinlemesine bir göz attıktan sonra, aşağıdaki belgelerin daha ayrıntılı incelenmesi için zaman ayırmanız şiddetle önerilir:

-   Orijinal, ancak sınırlı tanımlamalar [whitepaper.pdf](https://ton.org/whitepaper.pdf) ve `tblkch.pdf` içindedir.

-   [mc-config.h](https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/crypto/block/mc-config.h), [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb) ve [BlockMasterConfig Type](https://docs.evercloud.dev/reference/graphql-api/field_descriptions#blockmasterconfig-type) hakkında daha fazla bilgiyi bulabilirsiniz.

## 📖 Ayrıca Şunlara Göz Atın

Bu sayfada, TON Blockchain'in aktif ağ yapılandırmalarını bulabilirsiniz:

-   Mainnet: https://ton.org/global-config.json
-   Testnet: https://ton.org/testnet-global.config.json
-   [Rusça Versiyon](https://github.com/delovoyhomie/description-config-for-TON-Blockchain/blob/main/Russian-version.md).