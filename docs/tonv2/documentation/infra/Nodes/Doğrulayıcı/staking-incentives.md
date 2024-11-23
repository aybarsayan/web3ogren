# Stake Etkinlikleri

## Seçim ve Stake

TON Blockchain, PoS (Proof of Stake) konsensüs algoritmasını kullanmaktadır; bu, diğer tüm PoS ağlarında olduğu gibi, ağın güvenlik ve istikrarının bir dizi ağ doğrulayıcısı tarafından korunduğu anlamına gelir. Özellikle, doğrulayıcılar yeni bloklar (işlem gruplarından oluşan) için adaylar önerirken, diğer doğrulayıcılar onları dijital imzalar aracılığıyla _doğrular_ ve onaylar.

Doğrulayıcılar, özel `Elector yönetim sözleşmesi` kullanılarak seçilir. Her bir konsensüs turunda, doğrulayıcı adayları, stake'leri ve istenilen _max_factor_ (her konsensüs turunda doğrulayıcının gerçekleştirdiği bakım miktarını düzenleyen bir parametre) ile birlikte seçim için bir başvuru gönderir.

:::note
Doğrulayıcı seçim sürecinde, yönetim akıllı sözleşmesi bir sonraki doğrulayıcı turunu seçer ve her doğrulayıcıya, toplam stake'lerini maksimize etmek için bir oylama ağırlığı atar; bu, doğrulayıcının stake'i ve _max_factor_ dikkate alınarak gerçekleştirilir. 
:::

Bu bağlamda, stake ve _max_factor_ ne kadar yüksekse, doğrulayıcının oylama ağırlığı da o kadar yüksektir ve tersine.

Seçilen doğrulayıcılar, bir sonraki konsensüs turuna katılarak ağı güvence altına almak için seçilir. Ancak, birçok diğer blockchain'in aksine, yatay ölçeklenebilirliği elde etmek amacıyla her doğrulayıcı yalnızca ağın bir kısmını doğrular:

Her shardchain ve masterchain için özel bir doğrulayıcı seti vardır. Masterchain doğrulayıcı setleri, en yüksek oylama ağırlığına sahip olan 100 doğrulayıcıya kadar içerebilir (Ağ Parametresi `Config16:max_main_validators` olarak tanımlanmıştır).

Buna karşılık, her shardchain 23 doğrulayıcıdan oluşan bir setle doğrulanır (Ağ Parametresi `Config28:shard_validators_num` olarak tanımlanmıştır) ve her 1000 saniyede bir rastgele döndürülür (Ağ Parametresi `Config28:shard_validators_lifetime`).

---

## Stake Değerleri: Max Etkili Stake

Mevcut `max_factor`, yapılandırmada __3__ olup, _en küçük_ doğrulayıcının stake'inin _en büyük_ olanın stake'inden üç kat daha az olamayacağını ifade eder.

Yapılandırma parametreleri ile formül:

`max_factor` =  [`max_stake_factor`](https://tonviewer.com/config#17) / [`validators_elected_for`](https://tonviewer.com/config#15)

### (Basitleştirilmiş) Seçim Algoritması

Bu algoritma, `Elector akıllı sözleşmesi` tarafından çalıştırılır ve bağlı oldukları stake'e göre en iyi doğrulayıcı adaylarını seçer. **İşte nasıl çalıştığının bir özeti:**

1. **İlk Seçim**: Elector, belirli bir minimum miktardan (300K, [yapılandırmada](https://tonviewer.com/config#17) belirtildiği gibi) daha fazla stake yapmış tüm adayları dikkate alır.

2. **Adayların Sıralanması**: Bu adaylar, stake miktarlarına göre en yüksekten en düşüğe doğru sıralanır.

3. **Daraltma**:
   - Aday sayısı izin verilen maksimum doğrulayıcı sayısını aşarsa ([yapılandırmaya bakın](https://tonviewer.com/config#16)), en düşük stake'lere sahip olanlar hariç tutulur.
   - Elector, baştan en büyük gruptan başlayarak, potansiyel aday gruplarını değerlendirir ve daha küçük gruplara geçer:
      - Sıralı listedeki en üst adayları inceler, birer birer artırarak.
      - Her aday için Elector, 'etkili stake'lerini hesaplar. Bir adayın stake'i belirgin bir şekilde minimumun üzerindeyse, aşağıya (örneğin, biri 310k stake yaptıysa ve minimum 100k ise, ama minimumdan üç kat daha fazlası ile sınırlıyorsa, etkili stake'i 300k olarak değerlendirilir).
      - Bu gruptaki tüm adayların etkili stake'lerini toplar.

4. **Son Seçim**: En yüksek toplam etkili stake'e sahip aday grubu, Elector tarafından doğrulayıcılar olarak seçilir.

---

#### Doğrulayıcı Seçim Algoritması

Potansiyel doğrulayıcıların mevcut stake'lerine dayanarak, minimum ve maksimum stake'in optimal değerleri belirlenir; amaç toplam stake'in büyüklüğünü maksimize etmektir:

1. Elector, minimumdan daha yüksek stake'e sahip tüm başvuruları alır ([yapılandırmada 300K](https://tonviewer.com/config#17)).
2. Elector, stake'e göre _azalan_ sırada sıralar.
3. Eğer katılımcı sayısı [maksimum sayıdan](https://tonviewer.com/config#16) fazla olursa, Elector liste sonundaki katılımcıları eleyerek devam eder. Daha sonra Elector şu işlemleri gerçekleştirir:

   * Her döngü __i__ için _1'den N'e_ (geri kalan katılımcı sayısı) kadar, sıralı listeden ilk __i__ başvuruyu alır.
   * Etkili stake'i hesaplar; bu, `max_factor`'ı dikkate alır. Yani, biri 310k stake yaptıysa ama `max_factor` 3 ile sınırlıysa ve listedeki minimum stake 100k Toncoin ise, etkili stake min(310k, 3*100k) = 300k olacaktır. Bir doğrulayıcı düğümü, bu örnekte iki turda 600k TON stake kullanabilir (dönemlerin yarısı teklerde, yarısı çiftlerde). Stake'i artırmak için birden fazla doğrulayıcı düğümü kurmak gerekir.
   * Tüm __i__ katılımcının toplam etkili stake'ini hesaplar.

Elector böyle bir __i__ bulduğunda, toplam etkili stake en yüksek olduğunda, bu __i__ katılımcıyı doğrulayıcı olarak ilan ederiz.

---

## Pozitif Etkinlikler

Tüm blockchain ağları gibi, TON'daki her işlem, ağın depolanmasını ve işlem işlemlerini gerçekleştirmek için kullanılan bir işlem ücreti olan [gas](https://blog.ton.org/what-is-blockchain) gerektirir. TON'da, bu ücretler Elector sözleşmesinde bir ödül havuzunda toplanır.

Ayrıca, ağ, her masterchain bloğu için 1.7 TON ve her basechain bloğu için 1 TON eşit olacak şekilde ödül havuzuna bir sübvansiyon ekleyerek blok oluşturmayı sübvanse eder (Ağ Parametreleri `Config14:masterchain_block_fee` ve `Config14:basechain_block_fee`). Bir basechain'i birden fazla shardchain'e ayırırken, her shardchain bloğu için sübvansiyon ona göre bölünür. Bu işlem, birim zaman başına sübvansiyonun hemen hemen sabit kalmasını sağlar.

:::info
Haziran 2023'te, [Deflasyonist Yakma Mekanizması](https://blog.ton.org/ton-holders-and-validators-vote-in-favor-of-implementing-the-toncoin-real-time-burn-mechanism) tanıtıldı. Bu mekanizma ile, ağ tarafından üretilen TON'un bir kısmı, ödül havuzuna tahsis edilmek yerine yakılmaktadır.
:::

65536 saniye veya ~18 saat (Ağ Parametresi `Config15:validators_elected_for`) süren bir doğrulama döngüsünden sonra, stake edilen TON, her doğrulayıcı tarafından hemen serbest bırakılmaz; bunun yerine 32768 saniye veya ~9 saat boyunca tutulur (Ağ Parametresi `Config15:stake_held_for`). Bu süre zarfında, slashing (doğrulayıcıların kötü davranışlarını cezalandırma mekanizması) cezaları doğrulayıcıdan kesilebilir. Fonlar serbest bırakıldıktan sonra, doğrulayıcılar stake'lerini ve doğrulama turu boyunca oylama _ağırlıklarına_ orantılı olarak birikmiş ödül havuzundan bir payı çekebilirler.

Nisan 2023 itibarıyla, ağ üzerindeki tüm doğrulayıcılar için her konsensüs turundaki toplam ödül havuzu yaklaşık 40,000 TON'dur; her doğrulayıcı için ortalama ödül ise ~120 TON'dur (oylama ağırlığı ile biriken ödüller arasındaki maksimum fark ~3 TON'dur).

Toplam Toncoin arzı (5 milyar TON), yıllık yaklaşık %0.3-0.6'lık bir enflasyon oranına sahiptir.

Ancak bu enflasyon oranı her zaman sabit değildir ve ağın mevcut durumuna bağlı olarak sapmalar yaşayabilir. Nihayetinde, deflasyon mekanizması etkinleştirildikçe ve ağın kullanımı arttıkça deflasyona yönelecektir.

:::info
Güncel TON Blockchain istatistiklerini [buradan](https://tontech.io/stats/) öğrenin.
:::

---

## Negatif Etkinlikler

TON Blockchain'de, doğrulayıcıların kötü davrandıklarında cezalandırılabileceği genel olarak iki yöntem vardır: kayıtsız ve kötü niyetli davranış; ikisi de yasaktır ve eylemleri için ceza (slashing adı verilen bir süreçte) ile sonuçlanabilir.

Eğer bir doğrulayıcı, bir doğrulama turunda blok oluşturma ve işlem imzalama işlemlerine önemli bir süre katılmazsa, _Standart ceza_ parametresi ile ceza alır. Nisan 2023 itibarıyla, biriken Standart ceza 101 TON'dur (Ağ Parametresi `ConfigParam40:MisbehaviorPunishmentConfig`).

:::warning
TON'da slashing cezaları (doğrulayıcılara verilen cezalar), ağın herhangi bir katılımcısının, bir doğrulayıcının kötü davrandığını düşündüğünde şikayette bulunmasını sağlar.
:::

Bu süreçte, şikayette bulunan katılımcı, Elector'a sunmak için kötü davranışa dair kriptografik kanıtları eklemelidir. `stake_held_for` uyuşmazlık çözümleme süresi boyunca, ağda çalışan tüm doğrulayıcılar şikayetlerin geçerliliğini kontrol eder ve şikayete toplu olarak devam edip etmeyeceklerine oylama yaparlar (kötü davranış kanıtlarının geçerliliğini ve ceza dağılımını belirlerken).

Doğrulayıcı onaylarının %66'sına ulaşıldığında (eşit oylama ağırlığı ile ölçülen), bir slashing cezası doğrulayıcıdan kesilir ve doğrulayıcının toplam stake'inden çıkarılır. Cezalandırma ve şikayet çözümleme işlemi genellikle MyTonCtrl kullanılarak otomatik olarak gerçekleştirilir.

---

## Ceza Sisteminin Merkezi Olmayan Yapısı

:::info
Kötü performans sergileyen doğrulayıcılara yönelik uygulanacak sistem, 9 Eylül 2024'te tamamen faaliyete geçecektir.
:::

### Kötü Çalışmanın Belirlenmesi

TON, [lite-client](https://github.com/newton-blockchain/ton/tree/master/lite-client) aracını sunar. Lite-client içinde `checkloadall` komutu bulunmaktadır. Bu komut, doğrulayıcının kaç bloğu işlemesi gerektiğini ve belirli bir süre içinde kaç bloğu işlediğini analiz eder.

Eğer doğrulayıcı, bir doğrulama turunda beklenen blok sayısının %90'ından azını işlediyse, kötü performans sergiliyor sayılır ve cezalandırılması gerekir.

:::info
Süreç hakkında daha fazla teknik bilgi edinmek için [buradan](https://github.com/ton-blockchain/TIPs/issues/13#issuecomment-786627474) öğrenin.
:::

### Şikayet Akışı

- Herkes şikayette bulunabilir ve doğru şikayet için ödül alabilir.
- Şikayet doğrulaması, Doğrulayıcılar tarafından sağlanır ve tamamen merkezi olmayan bir yapıda gerçekleştirilir.

#### Şikayet Yapma

Her doğrulama turundan sonra (~18 saat), o tura katılan doğrulayıcıların stake'leri, Elector akıllı sözleşmesinde yaklaşık 9 saat daha bekletilir. Bu süre zarfında, o turda kötü performans sergileyen bir doğrulayıcıya karşı herkes şikayette bulunabilir. Bu, Elector akıllı sözleşmesi aracılığıyla zincir üzerinde gerçekleşir.

#### Şikayetin Doğrulanması

Her doğrulama turundan sonra, doğrulayıcılar Elector akıllı sözleşmesinden şikayet listesi alır ve `checkloadall` çağrısı yaparak bunları kontrol eder. Şikayet doğrulanırsa, zincir üzerinde o şikayet lehine oy kullanırlar.

Bu işlemler `mytonctrl` içine yerleştirilmiştir ve otomatik olarak gerçekleşir. Eğer şikayet %66 doğrulayıcının oyunu (ağırlıklarıyla) alıyorsa, doğrulayıcının stake'inden ceza kesilir. Kimsenin birine tek başına ceza vermesi mümkün değildir.

[@tonstatus_notifications](https://t.me/tonstatus_notifications) - her turda cezalandırılan doğrulayıcıların listesi.

### Ceza Miktarı

Ceza miktarı sabit olup 101 TON'dur (Ağ Parametresi `ConfigParam40:MisbehaviourPunishmentConfig`), bu da doğrulayıcının her turda elde ettiği gelire yakındır.

:::warning
Ceza miktarı, zamanla değişebilir; çünkü TON'daki işlem sayısı hızla artmakta ve iş gücü kalitesinin en üst düzeyde tutulması hayati önem taşımaktadır.
:::

### Ceza Dağılımı 

Ceza, ağ maliyetleri ve ilk doğru şikayetçi için küçük bir ödül (~8 TON) çıkarıldıktan sonra doğrulayıcılara dağıtılır.

### Doğrulayıcı Kılavuzları

Doğrulayıcı düğümünüzün ceza almasını önlemek için donanım, izleme ve doğrulayıcı operasyonlarının doğru şekilde ayarlandığından emin olmalısınız. **Lütfen, `doğrulayıcı bakım kılavuzlarına` uyduğunuzdan emin olun.** Bunu yapmak istemiyorsanız, staking hizmetlerini değerlendirmeyi düşünün: https://ton.org/stake.

## Ayrıca Bakınız

* `Doğrulayıcı Çalıştırma`
* `İşlem Ücretleri`
* [Blockchain Nedir? Akıllı Sözleşme Nedir? Gas Nedir?](https://blog.ton.org/what-is-blockchain)