---
title: XRP Defterinde Mutabakat Süreci
seoTitle: XRP Defterinde Mutabakat ve Doğrulama Süreçleri
sidebar_position: 4
description: Bu makale, XRP Defterinin çalışma prensiplerini ve mutabakat sürecinin önemini ele almaktadır. Özellikle işlemlerin doğrulanması ve defterdeki değişikliklerin nasıl gerçekleştiği üzerinde durulmaktadır.
tags: 
  - XRP Defteri
  - mutabakat
  - blockchain
  - işlemler
  - doğrulama
keywords: 
  - XRP Defteri
  - mutabakat
  - işlemler
  - doğrulama
  - blockchain
---

## Mutabakat Yapısı

_Dave Cohen, David Schwartz ve Arthur Britto tarafından yazılmıştır._

Bu makale, XRP Defteri'nin genel bir görünümünü, depoladığı bilgileri ve `işlemlerin` defterdeki değişiklikleri nasıl sonuçlandırdığını sunmaktadır.

:::tip
XRP Defteri üzerinde uygulama geliştirirken, bu süreci anlamak önemlidir; böylece XRP Defteri API'lerinin davranışlarından ve etkilerinden sürprizle karşılaşılmaz.
:::

## Giriş

Eşler arası XRP Defteri ağı, uygulamalara içerik durumları hakkında otoritatif bilgiler veren dünya çapında paylaşılan bir defter sunar. Bu durum bilgileri şunları içerir:

- her bir `hesap` için ayarlar
- XRP ve `token` bakiyeleri
- dağıtılmış borsa teklifleri
- `işlem maliyetleri` ve `rezerv` miktarları gibi ağ ayarları
- bir zaman damgası

Bir defter sürümünde hangi verilerin yer aldığını tam olarak tanımlamak için, `Defter Formatı Referansı`'na bakın.



_Şekil 1: XRP Defteri Elemanları_

XRP Defteri her birkaç saniyede bir yeni bir defter sürümüne sahiptir. Ağ, bir defter sürümünün içeriği üzerinde mutabakata vardığında, o defter sürümü _doğrulanır_ ve içeriği asla değiştirilemez. Onu izleyen doğrulanmış defter sürümleri, defter tarihini oluşturur. En son doğrulanmış defter bile tarihin bir parçasıdır, çünkü ağın durumunu kısa bir süre önce temsil eder. Şu anda, ağ, uygulanabilir ve bir sonraki defter sürümünde kesinleşebilecek işlemleri değerlendirmektedir. Bu değerlendirme yapılırken, ağda henüz doğrulanmamış aday defter sürümleri bulunmaktadır.


_Şekil 2: XRP Defteri Tarihi_

Bir defter sürümünün iki tanımlayıcısı vardır. Bir tanımlayıcı, onun _defter indeksi_dir. Defter sürümleri artan bir şekilde numaralandırılır. Örneğin, mevcut defter sürümünün defter indeksi 100 ise, önceki sürüm 99 ve sonraki sürüm 101'dir. Diğer bir tanımlayıcı ise _defter hash_'idir; bu, defterin içeriğinin dijital parmak izidir.

:::info
Sunucular deftere uygulanacak işlemleri önerirken, içerikleri biraz farklı olsa da birkaç aday defter sürümü oluşturabilirler. Bu aday defter sürümleri aynı defter indeksine sahiptir ancak farklı defter hash'lerine sahiptir. Çok sayıda adaydan yalnızca biri doğrulanabilir. Diğer tüm aday defter sürümleri iptal edilir. Böylece, tarihte her defter indeksi için tam olarak bir doğrulanmış defter hash'i vardır.
:::

Kullanıcı düzeyindeki değişiklikler, işlemlerin sonuçlarıdır. `İşlemler` örnekleri, ödemeler, hesap ayarlarının veya güven limitlerinin değişiklikleri ve ticaret teklifleridir. Her işlem, defterde bir veya daha fazla değişikliği yetkilendirir ve bir hesap sahibi tarafından kriptografik olarak imzalanmıştır. İşlemler, bir hesaba değişiklik yetkilendirmek veya defterde başka bir şeyi değiştirmek için tek yoldur.

Her defter sürümü, bir işlem seti ve bu işlemler hakkında meta veriler içerir. İçerdiği işlemler, yeni defter sürümünü oluşturmak için önceki defter sürümüne uygulanmış olanlardır. Meta veriler, işlemin defterin durum verileri üzerindeki tam etkilerini kaydeder.


_Şekil 3: Defter Sürümüne Uygulanan İşlemler_

Bir defter örneğinde yer alan işlem seti, o defterde kaydedilir ve XRP Defteri tarihinin denetimlerini sağlar. Eğer bir hesap bakiyesi defter N+1'de, defter N'ye göre farklıysa, o zaman defter N+1, değişimin sorumlusu olan işlem(leri) içerir.

> **Not:** Bir doğrulanmış defterde görünen işlemler, defteri değiştirmekte başarılı olmuş olabilir veya istenen eylemi gerçekleştirmeden işlenmiş olabilir. Başarılı işlemler, talep edilen değişikliklerin deftere uygulandığını gösteren **`tesSUCCESS`** `sonuç kodu` taşır. Defterde başarısız işlemler **`tec`** sınıf sonuç kodlarına sahiptir.

Bir defterde yer alan tüm işlemler, bir işlem maliyeti (## TODO) nedeniyle bazı XRP'leri yok eder; bu, **`tes`** veya **`tec`** kodları olup olmadığına bakılmaksızın geçerlidir. Yok edilecek XRP miktarı, imzalı işlem talimatlarıyla tanımlanır.

Başka sonuç kodu sınıfları da vardır; bunlar **`tes`** ve **`tec`** dışındaki sınıflardır. Başka sonuç kodu sınıfları, API çağrıları tarafından döndürülen geçici hataları ifade eder. Yalnızca **`tes`** ve **`tec`** kodları defterlerde yer almaktadır. Defterlerde yer almayan işlemler, defter durumu (XRP bakiyeleri dahil) üzerinde herhangi bir etkiye sahip olamaz, ancak geçici olarak başarısız olan geçişler yine de başarılı olabilir.

`XRP Defteri API'leri` ile çalışırken uygulamalar, deftere dahil edilmesi önerilen aday işlemler ile doğrulanmış işlemler arasında ayrım yapmalıdır. Yalnızca doğrulanmış bir defterde bulunan işlem sonuçları değiştirilemez. Bir aday işlem sonunda doğrulanmış bir defterde yer alabilir veya almayabilir.

:::warning
Önemli: Bazı `rippled` API'leri`, aday işlemler üzerinden geçici sonuçlar sağlar. Uygulamalar, işlemin nihai sonucunu belirlemek için geçici sonuçlara asla güvenmemelidir.
:::

Bir işlemin nihayetinde başarılı olduğunu kesin olarak bilmenin tek yolu, işlemin durumunu kontrol etmektir; bu, işlemin hem doğrulanmış bir defterde yer alması hem de sonuç kodunun `tesSUCCESS` olması koşuluyla yapılmalıdır. Eğer işlem, doğrulanmış bir defterde başka bir sonuç koduyla yer alıyorsa, başarısız olmuştur. Bir işlemin `LastLedgerSequence` ile belirtilen defteri onaylanmışsa, ancak işlem o defterde veya herhangi bir önceki defterde görünmüyorsa, bu durumda işlem başarısız olmuştur ve herhangi bir defterde asla görünemez. Nihai bir sonuç, yalnızca doğrulanmış bir defterde yer alan işlemler için veya daha sonra bu belgede açıklanan `LastLedgerSequence` kısıtlamaları yüzünden asla görünemeyen işlemler için geçerlidir.

## XRP Defteri Protokolü – Mutabakat ve Doğrulama

Eşler arası XRP Defteri ağı, işlemleri kabul eden ve işleyen birçok bağımsız XRP Defteri sunucusundan oluşur (genellikle `rippled` çalıştırarak). İstemci uygulamaları, işlemleri XRP Defteri sunucularına imzalar ve gönderir; bu sunucular, aday işlemleri işlenmek üzere ağda iletir. İstemci uygulamaları arasında mobil ve web cüzdanları, finansal kurumlara kapılar ve elektronik ticaret platformları bulunmaktadır.


_Şekil 4: XRP Defteri Protokolünde Katılımcılar_

İşlemleri kabul eden, ileten ve işleyen sunucular takip sunucuları veya doğrulayıcılar olabilir. Takip sunucularının ana işlevleri, istemcilerden gelen işlemleri dağıtmak ve defter hakkında sorgulara yanıt vermektir. Doğrulayıcı sunucular, takip sunucularının işlevlerini gerçekleştirir ve ayrıca defter tarihini ilerletmeye katkıda bulunurlar.

İstemci uygulamaları tarafından sunulan işlemleri kabul ederken, her takip sunucusu son doğrulanmış defteri başlangıç noktası olarak kullanır. Kabul edilen işlemler adaydır. Sunucular, aday işlemlerini akranlarına ileterek, aday işlemlerin ağda yayılmasına olanak tanır. İdeali, her bir aday işlemin tüm sunucular tarafından bilinmesidir; böylece her biri, son doğrulanmış deftere uygulanabilecek aynı işlem setini değerlendirebilir. Ancak, işlemlerin yayılması zaman aldıkça sunucular her zaman aynı aday işlem setiyle çalışmaz. Bunu hesaba katmak için, XRP Defteri, eşler arası XRP Defteri ağında aynı işlemlerin işlenmesini ve doğrulanmış defterlerin tutarlı olmasını sağlamak için mutabakat adında bir süreç kullanır.

### Mutabakat

Ağdaki sunucular, aday işlemler hakkında bilgi paylaşır. Mutabakat süreci boyunca, doğrulayıcılar, bir sonraki defter için dikkate alınacak belirli bir aday işlem alt kümesi üzerinde anlaşırlar. Mutabakat, sunucuların öneriler, ya da aday işlem setleri iletmesiyle gerçekleşen yinelemeli bir süreçtir. Sunucular, önerileri güncelleyip iletmeye devam ederler ta ki seçilen doğrulayıcıların süper çoğunluğu aynı aday işlem seti üzerinde anlaşana kadar.

:::note
Mutabakat sırasında, her sunucu, belirli bir sunucu kümesinden önerileri değerlendirir; bu sunuculara güvenilir doğrulayıcılar veya _Benzersiz Düğüm Listesi (UNL)_ denir. Güvenilir doğrulayıcılar, önerileri değerlendiren sunucuyu dolandırmaya çalışmaktan "güvenilir" olarak topluca kabul edilen bir alt kümesini temsil eder. Bu "güven" tanımı, her bir seçilen doğrulayıcının güvenilir olmasını gerektirmez. Aksine, doğrulayıcılar, ağa iletilen verileri sahte göstermeye yönelik koordineli bir çaba içinde birleşmeyecekleri umuduyla seçilir.
:::


_Şekil 5: Doğrulayıcılar İşlem Setlerini Önerir ve Gözden Geçirir — Mutabakatın başlangıcında, doğrulayıcıların farklı işlem setleri olabilir. Sonraki turlarda, sunucular, güvendiği doğrulayıcıların önerilerine uymak üzere önerilerini değiştirir. Bu süreç, hangi işlemlerin şu anda tartışılan defter sürümüne uygulanması ve hangilerinin ileri defter sürümlerine ertelenmesi gerektiğini belirler._

Kabul edilen öneri içinde yer almayan aday işlemler, aday işlemler olarak kalır. Bir sonraki defter sürümünde tekrar değerlendirilebilirler. Genellikle, bir defter sürümünde yer almayan bir işlem, bir sonraki defter sürümünde yer alır.

Bazı durumlarda, bir işlemin mutabakatı sonsuza dek başarısız olabilir. Bu gibi durumlardan biri, ağın gereken `işlem maliyetini` işlemden daha yüksek bir değere çıkardığı durumdur. İşlem, ücretler gelecekte bir noktada düşerse başarılı olabilir. Bir işlemin belirli bir defter indeksine kadar işlenmemiş olması durumunda başarısız olup başarısız olmadığını garanti altına almak için işlemler, belirli bir defter indeksi geçilmediği sürece süre aşımına uğrayacak şekilde ayarlanabilir. Daha fazla bilgi için, `Güvenilir İşlem Gönderimi` bölümüne bakın.

### Doğrulama

Doğrulama, sunucuların aynı sonuçları alıp almadığını doğrulayan ve bir defter sürümünü kesin olarak ilan eden toplam mutabakat sürecinin ikinci aşamasıdır. Nadiren, `mutabakatın ilk aşamasının başarısız olması` durumunda, doğrulama sonrasında bir onay sağlar, böylece sunucular bunu tanıyabilir ve uygun şekilde hareket edebilir.

Doğrulama esasen iki bölüme ayrılabilir:

- Kararlaştırılan işlem setinde oluşturulan sonuç defter sürümünü hesaplama.
- Sonuçları karşılaştırma ve yeterli güvenilir doğrulayıcıların aynı görüşte olması durumunda defter sürümünü doğrulanmış olarak ilan etme.

Ağdaki her sunucu doğrulamayı ayrı ve yerel olarak gerçekleştirir.

#### Doğrulamaları Hesapla ve Paylaş

Mutabakat süreci tamamlandığında, her sunucu, kararlaştırılan işlem setinden bağımsız olarak yeni bir defter hesaplar. Her sunucu, aşağıda özetlenen aynı kuralları izleyecek şekilde sonuçları hesaplar:

1. Önceki doğrulanmış defter ile başlayın.

2. Kararlaştırılan işlem setini, her sunucunun aynı şekilde işlemesi için _kanonik sıraya_ yerleştirin.

   [Kanonik sıra](https://github.com/XRPLF/rippled/blob/8429dd67e60ba360da591bfa905b58a35638fda1/src/ripple/app/misc/CanonicalTXSet.cpp#L25-L36), işlemlerin alındığı durum değildir; çünkü sunucular aynı işlemleri farklı sıralarla alabilirler. Katılımcıların işlem sıralaması üzerinde rekabet etmesini önlemek için, kanonik sıra manipüle edilmesi zor bir yapıdır.

3. Her işlemi talimatlarına göre, sırayla işleyin. Defterin durum verilerini buna göre güncelleyin.

   İşlem başarılı bir şekilde yürütülemiyorsa, işlemi bir `tec`-sınıfı sonuç kodu` ile ekleyin.

   Belirli "tekrar denenebilir" işlem hataları için, işlemi kanonik sıranın sonuna taşıyarak, o defter sürümünde diğer işlemler yürütüldükten sonra tekrar denemek için yerleştirin.

4. Defter başlığını uygun meta verilerle güncelleyin.

   Bu, defter indeksini, önceki doğrulanmış defterin tanımlayıcı hash'ini (bu defterin "ebeveyni"), bu defter sürümünün yaklaşık kapanma zamanını ve bu defterin içeriğinin kriptografik hash'lerini içerir.

5. Yeni defter sürümünün tanımlayıcı hash'ini hesaplayın.


_Şekil 7: Bir XRP Defteri Sunucusu Doğrulama Hesaplar — Her sunucu, kararlaştırılan işlemleri önceki doğrulanmış deftere uygular. Doğrulayıcılar, sonuçlarını tüm ağa gönderir._

#### Sonuçları Karşılaştır

Doğrulayıcılar, hesapladıkları defter sürümünün hash'ini içeren imzalı bir mesaj şeklinde sonuçlarını iletirler. Bu mesajlar, _doğrulamalar_ olarak adlandırılır ve her sunucunun hesapladığı defteri, akranlarının hesapladıklarıyla karşılaştırmasına olanak tanır.


_Şekil 8: Defter, Süper Çoğunluk Peers Aynı Sonucu Hesapladığında Doğrulanır — Her sunucu, hesapladığı defteri, seçtiği doğrulayıcılardan gelen hash'lerle karşılaştırır. Eğer mutabakat sağlanmazsa, sunucu yeniden hesaplamak veya doğru defteri almak zorundadır._

Ağda bir defter örneği, akranların süper çoğunluğu aynı doğrulama hash'ini imzalayıp yayınladığında doğrulanmış olarak kabul edilir. İleriye dönük olarak, işlemler bu güncellenmiş ve şimdi doğrulanmış deftere, defter indeksi N+1 ile uygulanır.

Bir sunucu azınlıkta kaldığında, akranlarının hesapladığı defterden farklı bir defter hesapladığında, sunucu hesapladığı defteri görmezden gelir. Gerekirse doğru defteri yeniden hesaplar veya alır.

Eğer ağ, doğrulamaların üzerinde süper çoğunluk mutabakatı sağlayamazsa, bu, işlem hacminin çok yüksek olduğunu veya ağ gecikmesinin çok büyük olduğunu gösterir; bu nedenle, mutabakat süreci tutarlı öneriler üretemez. Bu durumda, sunucular yeni bir defter sürümü için mutabakat sürecini tekrarlar. Mutabakat sürecinin başladığı zaman geçtikçe, sunucuların aynı aday işlem setini aldıkları büyük olasılıkla geçerli hale gelir; çünkü her mutabakat turu, anlaşmazlığı azaltır. XRP Defteri, bu koşullara yanıt olarak `işlem maliyetlerini` ve mutabakat için bekleme sürelerini dinamik olarak ayarlamaktadır.

Bir kez süper çoğunluk mutabakatına ulaştıklarında, sunucular yeni doğrulanmış defter ile, defter indeksi N+1 ile çalışırlar. Mutabakat ve doğrulama süreci, son turda yer almayan aday işlemleri ve bu zamana kadar sunulan yeni işlemleri göz önünde bulundurarak tekrarlar.

## Anahtar Bilgiler

XRP Defteri'ne sunulan işlemler anında işlenmez. Bir süre boyunca, her işlem aday olarak kalır.

Bir işlemin yaşam döngüsü şu şekildedir:

- Bir işlem oluşturulur ve bir hesap sahibi tarafından imzalanır.
- İşlem ağa sunulur.
    - Kötü tasarlanmış işlemler hemen reddedilebilir.
    - İyi tasarlanmış işlemler geçici olarak başarılı olabilir, ardından başarısız olabilir.
    - İyi tasarlanmış işlemler geçici olarak başarısız olabilir, ardından başarılı olabilir.
- Mutabakat sırasında, işlem deftere dahil edilir.
    - Başarılı bir mutabakat turunun sonucu, doğrulanmış bir defterdir.
    - Eğer bir mutabakat turu başarısız olursa, mutabakat süreci yeniden tekrarlanır.
- Doğrulanmış defter, işlemi ve defter durumu üzerindeki etkilerini içerir.

Uygulamalarda yalnızca doğrulanmış defterlerdeki bilgilere güvenilmelidir, aday işlemlerinin geçici sonuçlarına değil. Bazı `rippled` API'leri`, işlemler için başlangıçta geçici sonuçlar döndürmektedir. Bir işlemin sonuçları yalnızca o işlem doğrulanmış bir defterde yer aldığında veya işlem `LastLedgerSequence` içerdiğinde ve belirtilen defter indeksi ile daha düşük bir defterde görünmediğinde değişmez hale gelir.

:::tip
İşlem sunan uygulamalar için en iyi uygulamalar arasında:
- İşlemlerin karar vermesini ve başarısızlığını kesin ve hızlı bir şekilde sağlamak için `LastLedgerSequence` parametresini kullanın.
- Doğrulanmış defterlerdeki işlemlerin sonuçlarını kontrol edin.
    - Bir işlem içeren defter doğrulanmadan veya `LastLedgerSequence` geçilmedikçe sonuçlar geçicidir.
    - **`tesSUCCESS`** sonuç kodu ve `"validated": true` olan işlemler kesin olarak başarılı olmuştur.
    - Diğer sonuç kodlarına sahip ve `"validated": true` olan işlemler kesin olarak başarısız olmuştur.
    - `LastLedgerSequence` ile tanımlanan herhangi bir doğrulanmış defterde görünmeyen işlemler kesin olarak başarısız olmuştur.
        - Bu durumu tespit etmek için sürekli bir defter tarihi olan bir sunucu kullanmak önemlidir.
    - `LastLedgerSequence` ile tanımlanan defter doğrulanana kadar bir işlemin durumunu tekrar tekrar kontrol etmek gerekebilir.
:::

## Ayrıca Bakınız

- **Kavramlar:**
    - `Mutabakat Araştırması`
    - [Mutabakat Mekanizması (YouTube)](https://www.youtube.com/watch?v=k6VqEkqRTmk&list=PLJQ55Tj1hIVZtJ_JdTvSum2qMTsedWkNi&index=2)
- **Eğitimler:**
    - `Güvenilir İşlem Gönderimi`
    - `rippled`i Doğrulayıcı Olarak Çalıştırma`
- **Referanslar:**
    - `Defter Formatı Referansı`
    - `İşlem Formatı Referansı`
    - [consensus_info yöntemi][]
    - [validator_list_sites yöntemi][]
    - [validators yöntemi][]
---

title: Dipnotlar
description: Bu bölümde, XRP ağındaki işlemler ve sonuç kodları hakkında önemli bilgiler sunulmaktadır. Ayrıca, doğrulayıcıların rolü, konsensüs süreçleri ve sunucu güvenilirliği gibi konulara dair detaylar yer almaktadır.
keywords: [XRP, konsensüs, doğrulayıcılar, işlemler, sonuç kodları, ağ güvenliği, sunucu]
---

---
title: Dipnotlar
seoTitle: Dipnotlar - XRP Ağı
sidebar_position: 5
description: Bu bölümde, XRP ağı ve tec sonuç kodları ile ilgili önemli bilgiler bulunmaktadır. Kullanıcılar için kritik anlam taşıyan durumları ve işlemleri anlamak için bir rehber niteliğindedir.
tags:
  - XRP
  - tec sonuç kodları
  - işlemler
  - doğrulayıcılar
keywords:
  - XRP
  - tec sonuç kodları
  - işlemler
  - doğrulayıcılar
---

## Dipnotlar

1 – **tec** sonuç kodları ile olan işlemler, talep edilen eylemi gerçekleştirmez, ancak defter üzerinde etkileri vardır. Ağa yapılan suistimalleri önlemek ve işlemin dağıtım maliyetini ödemek için XRP işlem maliyetini yok ederler. Aynı zamanda gönderilen diğer işlemleri engellememek için gönderen hesabın dizi numarasını artırırlar. `tec` sınıfı sonuçlar, bazen süresi dolmuş nesnelerin silinmesi veya fonlanmamış ticaret tekliflerinin iptal edilmesi gibi bakım işlemlerini de gerçekleştirir.

:::info
Teknik olarak, `tec` sonuç kodları, herhangi bir eylemi yerine getirmeyen durumları ifade eder ve kullanıcılar için önemli bir bilgi kaynağıdır.
:::

2 – Örneğin, Alice'ın 100 $'ı olduğunu ve bunun tamamını Bob'a gönderdiği bir durumu düşünün. Eğer bir uygulama önce o ödeme işlemini gönderirse, ardından hemen Alice'ın bakiyesini kontrol ederse, API $0 döner. 

> Bu değer, bir aday işlemin geçici sonucu üzerinde temellendirilmiştir. 
> — Ödeme başarılı olduğunda, Alice'in bakiyesi 0 $ olarak görünse de, işlem aslında henüz onaylanmamıştır.

Ödemenin başarısız olduğu ve Alice'ın bakiyesinin 100 $'da kaldığı (veya diğer işlemler nedeniyle başka bir miktara dönüştüğü) durumlar vardır. Alice'in Bob'a yaptığı ödemenin başarılı olduğunu kesinlikle bilmenin tek yolu, işlemin hem doğrulanmış bir defterde olduğunu hem de sonuç kodunun **`tesSUCCESS`** olduğunu kontrol etmektir.

3 – Teknik olarak, doğrulayıcılar izleme sunucularının bir alt kümesidir. Aynı özellikleri sağlarlar ve ek olarak "doğrulama" mesajları gönderirler. İzleme sunucuları, tam veya kısmi defter geçmişi tutup tutmadıklarına göre daha da kategorize edilebilirler.

:::tip
Doğrulayıcı ve izleme sunucularının özellikleri arasındaki farkları anlamak, XRP ağındaki işlemlerin güvenilirliği için kritik öneme sahiptir.
:::

4 – İşlemler, işlemi tanıyan akranların yüzdesi bir eşik değerinin altına düştüğünde bir konsensüs turunu geçemezler. Her tur, yinelemeli bir süreçtir. İlk turun başında, en az %50 akranın anlaşması gerekir. Bir konsensüs turu için nihai eşik %80 anlaşmadır. Bu spesifik değerler değişiklik gösterebilir.

---

5 – Her sunucu kendi güvenilir doğrulayıcılarını tanımlar, ancak ağın tutarlılığı, farklı sunucuların yüksek ölçüde örtüşen listeleri seçmesine bağlıdır. Bu nedenle, Ripple önerilen doğrulayıcılar listesini yayımlar.

6 – Eğer tüm doğrulayıcılardan gelen teklifler değerlendirilseydi, sadece çöküşe yol açacak şekilde seçilmeyen doğrulayıcılardan değil, kötü niyetli bir saldırgan daha fazla doğrulayıcı çalıştırarak doğrulama süreci üzerinde orantısız bir güç elde edebilirdi. 
> Böylece geçersiz işlemleri tanıtabilir veya doğru işlemleri teklifler arasından çıkarabilirdi. 
> — Seçilen doğrulayıcı listesi, `Sybil saldırılarına karşı korunmayı sağlar`.

7 – Süper çoğunluk eşiği, Kasım 2014 itibarıyla, en az %80 akranın bir defterin doğrulanması için anlaşması gerektiğini gerektirir. Bu, bir konsensüs turu için gereken aynı yüzdedir. Her iki eşik de değişebilir ve eşit olmak zorunda değildir.

8 – Pratikte, sunucu tüm akranlardan doğrulamaları almadan önce azınlıkta olduğunu algılar. %20'den fazla akrandan eşleşmeyen doğrulamalar aldığında, doğrulamasının %80 eşiğini karşılayamayacağını bilir. O noktada, bir defteri yeniden hesaplamaya başlayabilir.

9 – Pratikte, XRP Defteri doğrulama tamamlanmadan yeni bir konsensüs turuna başlamak suretiyle daha verimli çalışır.

10 – Bir `rippled` sunucusu, tam bir defter geçmişi olmaksızın bile API isteklerine yanıt verebilir. Hizmetteki kesintiler veya ağ bağlantısı sorunları, sunucunun defter geçmişinde eksik defterler veya boşluklar oluşturabilir. 

---

### Süreç Yönetimi

Zamanla, yapılandırıldığı takdirde, `rippled` geçmişindeki boşlukları doldurur. Eksik işlemleri test ederken, işlemin gönderildiği andan itibaren `LastLedgerSequence`'ine kadar kesintisiz tam defterler tutan bir sunucuya karşı doğrulama yapmak önemlidir. Hangi defterlerin belirli bir sunucuya mevcut olduğunu belirlemek için [server_info yöntemi][] kullanılmalıdır.

