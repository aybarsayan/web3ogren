# Parametre Değiştirme

Bu belgenin amacı, TON Blockchain'in yapılandırma parametrelerinin temel bir açıklamasını sağlamaktır ve bu parametrelerin çoğunlukla onaylanan bir konsensüs ile nasıl değiştirileceği konusunda adım adım talimatlar vermektedir.

Okuyucunun zaten `Fift` ve `Lite Client` ile tanışmış olduğunu varsayıyoruz, bu konular `FullNode-HOWTO (düşük seviye)` ve `Validator-HOWTO (düşük seviye)` belgelerinde açıklanmaktadır; burada, yapılandırma önerilerine oy veren doğrulayıcıların süreçleri anlatılmaktadır.

## 1. Yapılandırma parametreleri

**Yapılandırma parametreleri**, doğrulayıcıların ve/veya TON Blockchain'in temel akıllı sözleşmelerinin davranışını etkileyen belirli değerlerdir. Tüm yapılandırma parametrelerinin mevcut değerleri, ana zincirin durumunun özel bir parçası olarak saklanır ve gerektiğinde mevcut ana zincir durumundan çıkarılır. Bu nedenle, yapılandırma parametrelerinin değerleri belirli bir ana zincir bloğuna atıfta bulunarak konuşmak mantıklıdır. Her shardchain bloğu, en son bilinen ana zincir bloğuna bir referans içerir; buna bağlı ana zincir durumundan alınan değerler bu shardchain bloğu için aktiftir ve onun oluşturulması ve doğrulanması sırasında kullanılır. Ana zincir blokları için, önceki ana zincir bloğunun durumu aktif yapılandırma parametrelerini çıkarmak için kullanılır. Bu nedenle, birisi bir ana zincir bloğu içinde bazı yapılandırma parametrelerini değiştirmeye çalışsa bile, değişiklikler yalnızca sonraki ana zincir bloğu için aktif hale gelecektir.

:::tip
**Kilit Nokta:** Yapılandırma parametrelerinin değerleri belirli bir ana zincir bloğuna atıfta bulunularak belirlenir ve yalnızca sonraki blokta geçerli olur.
:::

Her yapılandırma parametresi, **yapılandırma parametre indeksi** ya da kısaca **indeks** olarak adlandırılan imzalı 32 bit tamsayı indeksi ile tanımlanır. Bir yapılandırma parametresinin değeri her zaman bir Cell'dir. Bazı yapılandırma parametreleri eksik olabilir; bu durumda, bu parametrenin değeri `Null` olarak varsayılmaktadır. Her zaman mevcut olması gereken **zorunlu** yapılandırma parametrelerinin bir listesi de vardır; bu liste yapılandırma parametresi `#10`'da saklanmaktadır.

Tüm yapılandırma parametreleri **yapılandırma sözlüğü** içinde bir araya getirilmiştir - imzalı 32 bit anahtarlar (yapılandırma parametre indeksleri) ve tam olarak bir Cell referansından oluşan değerler ile bir Hashmap. Diğer bir deyişle, bir yapılandırma sözlüğü TL-B türünün bir değeridir (`HashmapE 32 ^Cell`). Gerçekten de, tüm yapılandırma parametrelerinin topluluğu, ana zincir durumunda TL-B türü `ConfigParams` olarak saklanmaktadır:

```
_config_addr:bits256 config:^(Hashmap 32 ^Cell) = ConfigParams;
```

Yapılandırma sözlüğünden başka, `ConfigParams`'nın `config_addr`'ı - ana zincirdeki yapılandırma akıllı sözleşmesinin 256 bitlik adresini içerdiğini görüyoruz. Yapılandırma akıllı sözleşmesi ile ilgili daha fazla ayrıntı daha sonra verilecektir.

Aktif tüm yapılandırma parametrelerinin değerlerini içeren yapılandırma sözlüğü, tüm akıllı sözleşmelere, kodları bir işlem sırasında çalıştırıldığında özel TVM kaydı `c7` aracılığıyla erişilebilir. Daha hassas olarak, bir akıllı sözleşme çalıştırıldığında, `c7` bir Tuple ile başlatılır; bunun tek öğesi, akıllı sözleşmenin çalıştırılması için yararlı olan birkaç "bağlam" değerinden oluşan bir Tuple'dır, örneğin, mevcut Unix zamanı (blok başlığında kaydedilmiştir). Bu Tuple'ın onuncu girişi (yani, sıfır tabanlı indeks 9) yapılandırma sözlüğünü temsil eden bir Cell içermektedir. Bu nedenle, `c7` ile TVM talimatları `PUSH c7; FIRST; INDEX 9` veya eşdeğer talimat `CONFIGROOT` ile erişilebilir. Aslında, özel TVM talimatları `CONFIGPARAM` ve `CONFIGOPTPARAM`, önceki işlemleri bir sözlük aramasıyla birleştirir ve istenen indeksi üzerinden herhangi bir yapılandırma parametresini geri döner. Bu talimatlar hakkında daha fazla ayrıntı için TVM belgelerine başvuruyoruz. 

### Önemli Nokta:
> Tüm yapılandırma parametreleri, tüm akıllı sözleşmelerden (ana zincir veya shardchain) kolaylıkla erişilebilir olmalıdır.

:::warning
**Dikkat:** Eğer yapılandırma parametre indeksi `i` negatif değilse, bu parametrenin değeri geçerli TL-B türünün bir değeri olmalıdır (`ConfigParam i`).
:::

Bu nedenle, bu tür parametrelerin yapısı kaynak dosya `crypto/block/block.tlb` içinde belirlenmiştir; burada (`ConfigParam i`) farklı `i` değerleri için tanımlanmıştır. Örneğin:

```
_config_addr:bits256 = ConfigParam 0;
_elector_addr:bits256 = ConfigParam 1;
_dns_root_addr:bits256 = ConfigParam 4;  // kök TON DNS çözümleyicisi

capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;
_GlobalVersion = ConfigParam 8;  // yoksa tamamı sıfır
```

Görüyoruz ki, yapılandırma parametresi `#8`, referans içermeyen ve tam olarak 104 veri bitine sahip bir Cell içermektedir. İlk dört bit `11000100` olmalı, ardından 32 bit mevcut olan "küresel versiyon" depolanır ve ardından mevcut yeteneklerle ilgili bayrakları temsil eden 64 bitlik bir tamsayı gelir. Tüm yapılandırma parametrelerinin daha ayrıntılı açıklamaları, TON Blockchain belgelerinin ekinde verilecektir; şu an için, `crypto/block/block.tlb` içindeki TL-B şemasını inceleyebilir ve farklı parametrelerin doğrulayıcı kaynaklarında nasıl kullanıldığını kontrol edebilirsiniz.

:::note
**İlginç Not:** Negatif olmayan indekslere sahip yapılandırma parametrelerinin aksine, negatif indekslere sahip yapılandırma parametreleri keyfi değerler içerebilir.
:::

## 2. Yapılandırma parametrelerini değiştirme

Yapılandırma parametrelerinin mevcut değerlerinin ana zincirin durumunun özel bir bölümünde saklandığını zaten açıkladık. Peki, bu değerler nasıl değiştirilir? 

Aslında, ana zincirde yer alan özel bir akıllı sözleşme vardır ki bu **yapılandırma akıllı sözleşmesi** olarak adlandırılır. Adresi `ConfigParams` içindeki `config_addr` alanı ile belirlenir ki bu daha önce tanımladığımız bir alandır. Verilerindeki ilk Cell referansı, tüm yapılandırma parametrelerinin güncel bir kopyasını içermelidir. Yeni bir ana zincir bloğu oluşturulurken, yapılandırma akıllı sözleşmesi adresi `config_addr` ile kontrol edilir ve ilk cell referansından yeni yapılandırma sözlüğü çıkarılır. Bir takım geçerlilik kontrolleri yapıldıktan sonra (örneğin, negatif olmayan 32 bit indeksi `i` olan herhangi bir değerin gerçekten geçerli TL-B türü `ConfigParam i` değeri olup olmadığını doğrulamak gibi) doğrulayıcı, bu yeni yapılandırma sözlüğünü, ConfigParams'ı içeren ana zincirin bölümü içerisine kopyalar. 

:::info
**Yöntem:** Yapılandırma parametrelerinde tüm değişiklikler yapılandırma akıllı sözleşmesi ile gerçekleştirilir.
:::

Bu işlem, tüm işlemler oluşturulduktan sonra gerçekleşir, bu nedenle yalnızca yapılandırma akıllı sözleşmesinde depolanan yeni yapılandırma sözlüğünün son versiyonu incelenir. Geçerlilik kontrolleri başarısız olursa, o zaman "gerçek" yapılandırma sözlüğü değişmeden kalır. Bu şekilde, yapılandırma akıllı sözleşmesi geçersiz yapılandırma parametresi değerlerini yükleyemez. Eğer yeni yapılandırma sözlüğü mevcut yapılandırma sözlüğü ile çakışıyorsa, o zaman hiçbir kontrol yapılmaz ve hiçbir değişiklik gerçekleştirilmez.

Bu şekilde, yapılandırma parametrelerinde tüm değişiklikler yapılandırma akıllı sözleşmesi ile gerçekleştirilir ve değişim kurallarını belirleyen kodu bu akıllı sözleşmedir. Mevcut durumda, yapılandırma akıllı sözleşmesi, yapılandırma parametrelerini değiştirmek için iki mod desteklemektedir:

1. Belirli bir özel anahtar ile imzalanmış dış bir mesaj aracılığıyla, bu özel anahtar, yapılandırma akıllı sözleşmesinin verilerinde depolanan bir umum anahtar ile ilişkilidir. Bu, genel test ağı ve muhtemelen bir varlık tarafından kontrol edilen daha küçük özel test ağlarında kullanılan bir yöntemdir, çünkü bu, operatörün herhangi bir yapılandırma parametresinin değerlerini kolayca değiştirmesini sağlamaktadır. Bu umum anahtar, eski bir anahtar ile imzalanmış özel bir dış mesajla değiştirilebilir ve sıfıra değişirse, bu mekanizma devre dışı bırakılır. Bu nedenle, yeni bir başlatmada ince ayar yapmak için kullanılabilir ve sonra kalıcı olarak devre dışı bırakılabilir.
2. "Yapılandırma önerileri" oluşturmak yoluyla, bu öneriler sonrasında doğrulayıcılar tarafından onaylanır veya reddedilir. Tipik olarak, bir yapılandırma önerisinin tüm doğrulayıcıların (ağırlıklı olarak) %3/4'ten fazlasından oy toplaması gerekir ve bu yalnızca bir turda değil, birkaç turda (yani, birden fazla ardışık doğrulayıcı setinin önerilen parametre değişikliğini onaylaması gerekir) gerçekleşir. Bu, TON Blockchain Mainnet'inin kullanacağı dağıtılmış yönetişim mekanizmasıdır.

:::tip
**Önemli Bilgi:** Yapılandırma parametrelerini değiştirme yöntemi iki mod içerir; biri dış mesajlarla, diğeri öneri onayı ile gerçekleştirilir.
:::

Yapılandırma parametrelerini değiştirme yönteminin ikincisini daha ayrıntılı olarak açıklamak istiyoruz.

## 3. Yapılandırma önerileri oluşturma

Yeni bir **yapılandırma önerisi** aşağıdaki verileri içerir:
- Değiştirilecek yapılandırma parametresinin indeksi
- Yapılandırma parametresinin yeni değeri (silinecekse Null)
- Önerinin sonlandırma Unix zamanı
- Önerinin **kritik** olup olmadığını belirten bayrak
- Mevcut değerin cell hash'ini içeren isteğe bağlı **eski değerin hash'i** (önerinin aktif hale gelmesi için mevcut değerin belirtilen hash'e sahip olması gerekir)

Ana zincirde bir cüzdanı olan herkes, uygun bir ücret ödemek kaydıyla yeni bir yapılandırma önerisi oluşturabilir. Ancak yalnızca doğrulayıcılar mevcut yapılandırma önerilerine oy verebilir veya karşı oy kullanabilir.

:::warning
**Ayrım:** Kritik ve sıradan yapılandırma önerileri arasında ayrım vardır; kritik öneriler daha maliyetli ve zorlu bir onay gerektirir.
:::

Yeni bir yapılandırma önerisi oluşturmak için, öncelikle önerilen yeni değeri içeren bir BoC (bag-of-cells) dosyası oluşturulmalıdır. Bunu yapmanın kesin yolu, değiştirilen yapılandırma parametresine bağlıdır. Örneğin, `-239` parametresini UTF-8 dizesi "TEST" (yani `0x54455354`) içerecek şekilde oluşturmak istiyorsak, `config-param-239.boc`'yu şu şekilde oluşturabiliriz: Fift'i başlatıp ardından yazmalıyız

```
<b "TEST" $, b> 2 boc+>B "config-param-239.boc" B>file
bye
```

Sonuç olarak, gerekli değerin serileştirmesini içeren 21 baytlık bir `config-param-239.boc` dosyası oluşturulacaktır.

Daha karmaşık durumlar için, özellikle negatif olmayan indekslere sahip yapılandırma parametreleri için bu basit yaklaşım kolayca uygulanamaz. `fift` yerine `create-state` (inşa dizininde `crypto/create-state` olarak mevcuttur) kullanmayı ve genellikle TON Blockchain'inin sıfır durumunu ("diğer blockchain mimarilerinde "genesis block"u temsil eden) oluşturmak için kullanılan `crypto/smartcont/gen-zerostate.fif` ve `crypto/smartcont/CreateState.fif` kaynak dosyalarının uygun bölümlerini kopyalayıp düzenlemeyi öneririz.

Örneğin, şu anda etkin olan küresel blockchain versiyonunu ve yetenekleri içeren yapılandırma parametresi `#8`'i ele alalım:

```
capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;
_GlobalVersion = ConfigParam 8;
```

Mevcut değerini, hafif istemciyi çalıştırarak ve `getconfig 8` yazarak inceleyebiliriz:

```
> getconfig 8
...
ConfigParam(8) = (
  (capabilities version:1 capabilities:6))
  
x{C4000000010000000000000006}
```

:::note
**Hedef:** `capReportVersion` yeteneğini etkinleştirmek için istediğimiz `version=1` ve `capabilities=14` ayarlarını yapmalıyız.
:::

Bu örnekte, hala doğru serileştirmeyi tahmin edebiliriz ve gerekli dosyayı doğrudan Fift yazışmasında oluşturmamız mümkün olur.
```
x{C400000001000000000000000E} s>c 2 boc+>B "config-param8.boc" B>file
```

(Sonucunda, istenen değeri içeren 30 baytlık bir `config-param8.boc` dosyası oluşturulmaktadır.)

Ancak, daha karmaşık durumlarda bu bir seçenek olmayabilir, bu nedenle bu örneği farklı bir şekilde yapalım. Yani, `crypto/smartcont/gen-zerostate.fif` ve `crypto/smartcont/CreateState.fif` kaynak dosyalarını ilgili bölümler için incelemiş olalım.  

```
// versiyon yetenekleri --
{ <b x{c4} s, rot 32 u, swap 64 u, b> 8 config! } : config.version!
1 constant capIhr
2 constant capCreateStats
4 constant capBounceMsgBody
8 constant capReportVersion
16 constant capSplitMergeTransactions
```

ve

```
// versiyon yetenekleri
1 capCreateStats capBounceMsgBody or capReportVersion or config.version!
```

Görüyoruz ki, `config.version!` yalnızca son `8 config!` bulunmadığında temelde ihtiyacımız olan şeyleri yapıyor, bu nedenle geçici bir Fift beti oluşturarak, örneğin, `create-param8.fif`: 
```

#!/usr/bin/fift -s
"TonUtil.fif" dahil et

1 sabit capIhr
2 sabit capCreateStats
4 sabit capBounceMsgBody
8 sabit capReportVersion
16 sabit capSplitMergeTransactions
{ <b x{c4} s, rot 32 u, swap 64 u, b> } : prepare-param8

:::tip
Yapılandırma parametresi için yeni bir değer oluşturmak için aşağıdaki komutu kullanın.
:::

// yapılandırma parametresi için yeni bir değer oluştur
1 capCreateStats capBounceMsgBody veya capReportVersion veya prepare-param8
// bu değerin geçerliliğini kontrol et
dup 8 geçerli-config? değil abort"seçilen yapılandırma parametresi için geçerli bir değer değil"
// yazdır
dup ."Serileştirilmiş değer = " <s csr.
// dosyayı ilk komut satırı argümanı olarak sağlanan dosyaya kaydet
2 boc+>B $1 tuck B>file
."(Dosyaya kaydedildi " type .")" cr

Şimdi `fift -s create-param8.fif config-param8.boc` veya daha iyisi, `crypto/create-state -s create-param8.fif config-param8.boc` (build dizininden) çalıştırırsak, aşağıdaki çıktıyı görürüz:

```
Serileştirilmiş değer = x{C400000001000000000000000E}
(Dosyaya kaydedildi config-param8.boc)
```

:::note
Ve aynı içeriğe sahip 30 baytlık bir `config-param8.boc` dosyası elde ederiz.
:::

İstenilen yapılandırma parametresi değerine sahip bir dosyamız olduğunda, kaynak ağacının `crypto/smartcont` dizininde bulunan `create-config-proposal.fif` betiğini uygun argümanlarla çağırırız. Tekrar, `fift` yerine `create-state` kullanmayı öneriyoruz (build dizininden `crypto/create-state` olarak mevcut), çünkü bu, daha fazla blockchain ile ilgili geçerlilik kontrolleri yapabilen özel bir genişletilmiş Fift sürümüdür:

```
$ crypto/create-state -s create-config-proposal.fif 8 config-param8.boc -x 1100000

Yapılandırma parametresi 8'in yeni değeri config-param8.boc dosyasından yükleniyor
x{C400000001000000000000000E}

Kritik olmayan yapılandırma teklifi 1586779536'da (1100000 saniye içinde) süresi dolacak
Sorgu kimliği 6810441749056454664 
sonuçlanan iç mesaj metni: x{6E5650525E838CB0000000085E9455904_}
 x{F300000008A_}
  x{C400000001000000000000000E}

B5EE9C7241010301002C0001216E5650525E838CB0000000085E9455904001010BF300000008A002001AC400000001000000000000000ECD441C3C
(toplam 104 veri biti, 0 hücre referansı -> 59 BoC veri baytı)
(Dosyaya kaydedildi config-msg-body.boc)
```

:::warning
Taşınması gereken bir iç mesajda, yapılandırma akıllı sözleşmesine gönderilecek bir iç mesajın gövdesini elde ettik.
:::

Herhangi bir (cüzdan) akıllı sözleşmeye, masterchain içinde bir miktar Toncoin ile birlikte göndereceğiz. Yapılandırma akıllı sözleşmesinin adresini `getconfig 0` yazarak alabiliriz:
```
> getconfig 0
ConfigParam(0) = ( config_addr:x5555555555555555555555555555555555555555555555555555555555555555)
x{5555555555555555555555555555555555555555555555555555555555555555}
```
Yapılandırma akıllı sözleşmesinin adresinin `-1:5555...5555` olduğunu görüyoruz. Bu akıllı sözleşmenin uygun get-methodlarını çalıştırarak, bu yapılandırma teklifini oluşturmak için gereken ödemeyi öğrenebiliriz:

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 proposal_storage_price 0 1100000 104 0
```

:::info
Argümanlar:  [ 0 1100000 104 0 75077 ] 
Sonuç:  [ 2340800000 ] 
Uzaktan sonuç (güvenilmez):  [ 2340800000 ] 
:::

`proposal_storage_price` get-methoduna verilen parametreler kritik bayrak (bu durumda 0), bu teklifin etkin olacağı zaman aralığı (1.1 Megasaniye), veri içindeki toplam bit sayısı (104) ve hücre referansları (0). Son iki miktar `create-config-proposal.fif` çıktısında görülebilir.

Bu teklifin oluşturulması için 2.3408 Toncoin ödenmesi gerektiğini görüyoruz. İşlem ücretlerini ödemek için en az 1.5 Toncoin eklemek daha iyidir, bu nedenle başvuruyla birlikte 4 Toncoin göndermeyi planlıyoruz (tüm fazla Toncoin geri dönülecek). Şimdi `wallet.fif` (veya kullandığımız cüzdan için ilgili Fift betiği) ile 4 Toncoin taşıyan bir transfer oluşturuyoruz ve `config-msg-body.boc`'un gövdesini ekliyoruz. Bu genellikle şöyle görünür:

```
$ fift -s wallet.fif my-wallet -1:5555555555555555555555555555555555555555555555555555555555555555 31 4. -B config-msg-body.boc
```

:::tip
GR$4. hesabına transfer ediliyor kf9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQft = -1:5555555555555555555555555555555555555555555555555555555555555555 seqno=0x1c bounce=-1 
Transfer mesajının gövdesi x{6E5650525E835154000000085E9293944_}
 x{F300000008A_}
  x{C400000001000000000000000E}
:::

Mesaj imzalanıyor: x{0000001C03}
 x{627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944_}
  x{F300000008A_}
   x{C400000001000000000000000E}

Sonuçlanan harici mesaj: x{89FE000000000000000000000000000000000000000000000000000000000000000007F0BAA08B4161640FF1F5AA5A748E480AFD16871E0A089F0F017826CDC368C118653B6B0CEBF7D3FA610A798D66522AD0F756DAEECE37394617E876EFB64E9800000000E01C_}
 x{627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944_}
  x{F300000008A_}
   x{C400000001000000000000000E}

B5EE9C724101040100CB0001CF89FE000000000000000000000000000000000000000000000000000000000000000007F0BAA08B4161640FF1F5AA5A748E480AFD16871E0A089F0F017826CDC368C118653B6B0CEBF7D3FA610A798D66522AD0F756DAEECE37394617E876EFB64E9800000000E01C010189627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944002010BF300000008A003001AC400000001000000000000000EE1F80CD3
(Dosyaya kaydedildi wallet-query.boc)

:::tip
Şimdi `wallet-query.boc` harici mesajını blockchain'e gönderiyoruz ve lite client ile.
:::

```
> sendfile wallet-query.boc
....
harici mesaj durumu 1
```

Bir süre bekledikten sonra, cüzdanımızın gelen mesajlarını kontrol edebiliriz veya şanslıysak, yapılandırma akıllı sözleşmesinin `list_proposals` yöntemi aracılığıyla tüm aktif yapılandırma teklifleri listesini doğrudan kontrol edebiliriz.

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 list_proposals
...
:::note
Argümanlar:  [ 107394 ] 
Sonuç:  [ ([64654898543692093106630260209820256598623953458404398631153796624848083036321 [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0]]) ] 
Uzaktan sonuç (güvenilmez):  [ ([64654898543692093106630260209820256598623953458404398631153796624848083036321 [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0]]) ] ... hücre önbelleğe alınıyor FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC
:::

Aktif yapılandırma tekliflerimizin listesinin tam olarak bir girişten oluştuğunu görüyoruz. 

```
[6465...6321 [1586779536 0 [8 C{FDCD...} -1] 1124...2998 () 8646...209 3 0 0]]
```
İlk numara `6465..6321` yapılandırma teklifinin benzersiz tanımlayıcısıdır, 256-bit hash'ine eşittir. Bu çiftin ikinci bileşeni, bu yapılandırma teklifinin durumunu açıklayan bir Demet'tir. Bu Demet'in ilk bileşeni, yapılandırma teklifinin süresinin dolacağı Unix zamanıdır (`1586779546`). İkinci bileşen (`0`) kritiklik bayrağıdır. Sonra, değiştirilecek yapılandırma parametresinin indeksi ile yeni değeri açıklayan `[8 C{FDCD...} -1]` üçlüsü vardır, burada `8`, değiştirilecek yapılandırma parametresi indeksidir, `C{FDCD...}` ise yeni değer ile birlikte hücredir (bu hücrenin hash'ine dayanmaktadır) ve `-1` bu parametrenin eski değeri hash'inin belirtilmediğini ifade eder (`-1` bu hash'in belirtilmediği anlamına gelir). Sonra, güncel onaylayıcı setinin tanımlayıcısını temsil eden büyük bir sayı `1124...2998`, ardından şu anda bu teklifi şu ana kadar oy veren aktif onaylayıcıların setini temsil eden boş bir liste `()` ve "kalan ağırlık" olan `weight_remaining` değeri gelir, ki bu pozitif bir sayı ise bu teklifin bu turda yeterli onaylayıcı oyunu toplayamadığını gösterir, aksi takdirde negatiftir. Ardından üç sayı daha gelir: `3 0 0`. Bu sayılar `rounds_remaining` (bu teklif en fazla üç tur hayatta kalacak, yani mevcut onaylayıcı setindeki değişiklikler), `wins` (bu teklifin ağırlığa göre tüm onaylayıcılardan %3/4'ten fazla oy topladığı tur sayısı) ve `losses` (bu teklifin %3/4 onaylayıcı oyunu toplayamadığı tur sayısı).

:::tip
Yapılandırma parametresi `#8` için önerilen değeri kontrol etmek için, lite-client'tan bu hücreyi genişletmesini isteyebiliriz `C{FDCD...}` hash'ini kullanarak veya bu hash'in yeterince uzun bir ön ekini kullanarak bu hücreyi benzersiz bir şekilde tanımlamak için:
:::

```
> dumpcell FDC
C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} =
  x{C400000001000000000000000E}
```
Değerin `x{C400000001000000000000000E}` olduğunu görüyoruz, ki bu gerçekten de yapılandırma teklifimize yerleştirdiğimiz değerdir. Lite client'tan bu Hücreyi TL-B türünün değerleri olarak göstermesini isteyebiliriz (`ConfigParam 8`).
```
> dumpcellas ConfigParam8 FDC
dumping cells as values of TLB type (ConfigParam 8)
C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} =
  x{C400000001000000000000000E}
(
    (yetenekler sürüm:1 yetenekler:14))
```
Bu, başka insanlar tarafından oluşturulan yapılandırma tekliflerini göz önünde bulundurduğumuzda özellikle yararlıdır.

Yapılandırma teklifi bu noktadan sonra 256-bit hash'i ile tanımlanır -- devasa ondalık sayı `6465...6321`. Belirli bir yapılandırma teklifinin mevcut durumunu `get_proposal` get-methodunu kullanarak kontrol edebiliriz ve tek argüman olarak yapılandırma teklifinin tanımlayıcısını kullanarak:
```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 get_proposal 64654898543692093106630260209820256598623953458404398631153796624848083036321
...
argümanlar:  [ 64654898543692093106630260209820256598623953458404398631153796624848083036321 94347 ] 
sonuç:  [ [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0] ] 
```
Esasen daha önce aldığımız aynı sonucu elde ediyoruz, ancak başlangıçta yalnızca bir yapılandırma teklifi için. 

## 4. Yapılandırma teklifleri için oylama

:::info
Bir yapılandırma teklifi oluşturulduktan sonra, mevcut onaylayıcılardan %3/4'ten fazla oy toplaması gerekir (kilo, yani stake'e göre) mevcut turda ve belki birkaç sonraki turda (seçilen onaylayıcı setleri). Böylelikle, bir yapılandırma parametresinin değiştirilmesi kararı, yalnızca mevcut onaylayıcı setinin değil, aynı zamanda birkaç sonraki onaylayıcı setinin de önemli bir çoğunluğu tarafından onaylanmalıdır.
:::

Bir yapılandırma teklifi için oy verme, yapılandırma parametresi `#34`'te listelenen mevcut onaylayıcılara (daimi genel anahtarları ile birlikte) yalnızca mümkündür. Süreç yaklaşık olarak şu şekildedir:

1. Bir onaylayıcının operatörü, yapılandırma parametresi `#34`'te saklanan mevcut onaylayıcı setindeki kendi onaylayıcısının `val-idx` (0 tabanlı) indeksini bulur.
2. Operatör, kaynak ağacındaki `crypto/smartcont` dizininde bulunan özel bir Fift betiği `config-proposal-vote-req.fif`'i çağırır ve `val-idx` ve `config-proposal-id`'ı argümanları olarak belirtir:
```
    $ fift -s config-proposal-vote-req.fif -i 0 64654898543692093106630260209820256598623953458404398631153796624848083036321
    Yapılandırma teklifine oy verme talebi oluşturuluyor 0x8ef1603180dad5b599fa854806991a7aa9f280dbdb81d67ce1bedff9d66128a1 adına 0 indeksine sahip onaylayıcıdan 
    566F744500008EF1603180DAD5B599FA854806991A7AA9F280DBDB81D67CE1BEDFF9D66128A1
    Vm90RQAAjvFgMYDa1bWZ-oVIBpkaeqnygNvbgdZ84b7f-dZhKKE=
    Dosyaya kaydedildi validator-to-sign.req
```
3. Daha sonra, oylama talebinin mevcut onaylayıcının özel anahtarıyla imzalanması gerekir; bu da `validator-engine-console`'da `sign  566F744...28A1` kullanılarak yapılır. Bu işlem, onaylayıcı seçimlerine katılmak için `Validator-HOWTO` bölümünde açıklanan yöntemi taklit eder, ancak bu sefer mevcut aktif anahtar kullanılmalıdır.
4. Daha sonra, başka bir `config-proposal-signed.fif` betiği çağrılmalıdır. Bu betik, `config-proposal-req.fif` betiği ile benzer argümanlara sahiptir, ancak oylama talebini imzalamak için kullanılan genel anahtarın base64 temsili ve imzanın base64 temsili de dahil olmak üzere iki ek argüman bekler. Bu da `Validator-HOWTO` bölümünde açıklanan sürece oldukça benzerdir.
5. Bu şekilde, imzalı oy taşıyan iç mesajın gövdesini içeren `vote-msg-body.boc` dosyası oluşturulur.
6. Daha sonra, `vote-msg-body.boc`, masterchain içinde herhangi bir akıllı sözleşme (genellikle onaylayıcının kontrol eden akıllı sözleşmesi kullanılır) aracılığıyla işlenmesi için küçük bir Toncoin ile birlikte taşınmalıdır (genellikle, işleme ücretlerini ödemek için 1.5 Toncoin yeterlidir). Bu yine, onaylayıcı seçimleri sırasında kullanılan prosedürle tamamen benzerdir. Bu genellikle şöyle gerçekleştirilir:
```
$ fift -s wallet.fif my_wallet_id -1:5555555555555555555555555555555555555555555555555555555555555555 1 1.5 -B vote-msg-body.boc
```
(eğer onaylayıcıyı kontrol etmek için basit bir cüzdan kullanılıyorsa) ve ardından `lite client`'dan elde edilen `wallet-query.boc` dosyasını göndermektedir:

```
> sendfile wallet-query.boc
```

Yapılandırma akıllı sözleşmesine mevcut oylama sorgularınızın durumunu öğrenmek için cevap mesajlarını kontrol edebilirsiniz. Alternatif olarak, yapılandırma önerisinin durumunu `show_proposal` yöntemiyle kontrol edebilirsiniz:
```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 get_proposal 64654898543692093106630260209820256598623953458404398631153796624848083036321
...
argümanlar:  [ 64654898543692093106630260209820256598623953458404398631153796624848083036321 94347 ] 
sonuç:  [ [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 (0) 864691128455135209 3 0 0] ]
```

:::info
Bu sefer, bu yapılandırma teklifine oy veren onaylayıcıların indekslerinin listesi boş bir liste olmamalıdır ve sizin onaylayıcınızın indeksini içermelidir. Bu örnekte, bu liste (`0`) anlamına gelir, yani yalnızca yapılandırma parametresi `#34` içinde `0` indeksine sahip onaylayıcı oy vermiştir. Listeler yeterince büyük hale geldiğinde, teklifin durumu da yeni bir kazanım sayısını gösterecektir (önerinin statüsü içindeki `3 0 0`'da ilk sıfır). Eğer kazanımlar sayısı yapılandırma parametresi `#11`'de belirtilen değere eşit veya daha büyük olursa, yapılandırma teklifi otomatik olarak kabul edilir ve önerilen değişiklikler hemen geçerlilik kazanır. Öte yandan, onaylayıcı seti değiştiğinde, daha önce oy veren onaylayıcıların listesi boşalır, `rounds_remaining` değeri (bu durumda üç) bir azaltılır ve eğer negatif olursa, yapılandırma teklifi yok edilir. Eğer yok edilmezse ve bu turda kazanamazsa, kayıpların sayısı (bu durumda `3 0 0` içindeki ikinci sıfır) artırılır. Eğer bu sayılar, yapılandırma parametresi `#11`'de belirtilen değerden büyük olursa, yapılandırma teklifi atılacaktır. Sonuç olarak, bir turda oy vermeyen tüm onaylayıcılar, istemeden de olsa bu teklifin aleyhine oy vermiş olurlar.
:::

## 5. Yapılandırma teklifleri için oylama otomasyonu

`validator-engine-console` içinde `createelectionbid` komutunun sağladığı otomasyon benzeri olarak, `validator-engine` ve `validator-engine-console`, önceki bölümde açıklanan adımların çoğunu otomatikleştirme yeteneği sunarak yapılandırma tekliflerine oy verme sürecini hızlandırır. 

:::note
Bu yukarıdaki `vote-msg-body.boc` dosyasını oluşturmak için bir iç mesaj oluşturmanıza yardımcı olur.
:::

Bu yöntemi kullanmak için, `validator-engine`'in `validator-elect-req.fif` ve `validator-elect-signed.fif` dosyalarını bulmak için kullandığı aynı dizine `config-proposal-vote-req.fif` ve `config-proposal-vote-signed.fif` Fift betiklerini yüklemelisiniz. Daha sonra, sadece bu komutu çalıştırarak
```
    createproposalvote 64654898543692093106630260209820256598623953458404398631153796624848083036321 vote-msg-body.boc
```
`vote-msg-body.boc` dosyasını oluşturmak için, yapılandırma akıllı sözleşmesine gönderilecek içk mesajını oluşturmuş olursunuz.

## 6. Yapılandırma akıllı sözleşmesinin ve seçici akıllı sözleşmesinin kodlarını güncelleme

Yapılandırma akıllı sözleşmesinin kendisi veya seçici akıllı sözleşmesinin kodları güncellenmesi gerekebilir. Bunun için, yukarıda açıkladığımız aynı mekanizmalar kullanılır. 

:::warning
Yeni kod, bir değer hücresinin tek referansında saklanır ve bu değer hücresi, yapılandırma parametresi `-1000` (yapılandırma akıllı sözleşmesini güncellemek için) veya `-1001` (seçici akıllı sözleşmeyi güncellemek için) olarak önerilmelidir. Bu parametreler kritik görünmektedir, bu nedenle yapılandırma akıllı sözleşmesini değiştirmek için pek çok onaylayıcı oyu gerekmektedir (bu, yeni bir anayasanın kabul edilmesine benzer). 
:::

Bu tür değişikliklerin öncelikle bir test ağında test edilmesi, ardından her onaylayıcı operatörünün önerilen değişikliklere oy vermeden önce bir kamu forumunda tartışılması beklenmektedir.

Alternatif olarak, kritik yapılandırma parametreleri `0` (yapılandırma akıllı sözleşmesinin adresi) veya `1` (seçici akıllı sözleşmesinin adresi), zaten mevcut ve doğru şekilde başlatılmış akıllı sözleşmelere değiştirilmiştir. Özellikle, yeni yapılandırma akıllı sözleşmesi, kalıcı verilerinin ilk referansında geçerli bir yapılandırma sözlüğüne sahip olmalıdır. 

Farklı akıllı sözleşmeler arasında değişen verileri (aktif yapılandırma teklifleri, veya önceki ve mevcut onaylayıcı seçim listeleri gibi) doğru bir şekilde aktarmak bu kadar kolay olmadığından, çoğu durumda mevcut bir akıllı sözleşmenin kodunu güncellemeyi tercih etmek daha iyidir.

Böyle bir yapılandırma teklifini oluşturmak için iki yardımcı betik vardır; bunlar, yapılandırma akıllı sözleşmesi veya seçici akıllı sözleşmesini yükseltmek için `create-config-upgrade-proposal.fif` öncelikle bir Fift derleyici kaynak dosyasını (varsayılan olarak `auto/config-code.fif`, bu `crypto/smartcont/config-code.fc`'den otomatik olarak üretilen kodun karşılığıdır) yükler ve ilgili yapılandırma teklifini oluşturur (yapılandırma parametresi `-1000` için). Benzer şekilde, `create-elector-upgrade-proposal.fif` da bir Fift derleyici kaynak dosyasını (`auto/elector-code.fif` varsayılan olarak) yükler ve onu kullanarak yapılandırma parametresi `-1001` için bir yapılandırma teklifi oluşturur. Bu şekilde, bu iki akıllı sözleşmeden birinin kodunu güncellemek için yapılandırma teklifleri oluşturmak son derece basit olmalıdır. 

:::danger
Ancak, akıllı sözleşmenin değiştirilmiş FunC kaynak kodunu da yayımlamak, derlemek için kullanılan FunC derleyici sürümünü de tam olarak belirtmek önemlidir; böylece tüm onaylayıcılar (veya daha doğrusu onların operatörleri) yapılandırma teklifindeki kodu yeniden oluşturabilir (ve hashleri karşılaştırabilir) ve kaynak kodunu inceleyebilir ve tartışabilirler.
:::