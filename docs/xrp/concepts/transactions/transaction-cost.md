---
title: İşlem Maliyeti
seoTitle: XRP Defteri İşlem Maliyeti ve Uygulamaları
sidebar_position: 4
description: İşlem maliyeti, XRP Defterini spam ve hizmet reddi saldırılarından koruyan küçük bir XRP miktarıdır. Bu, ağ üzerindeki yükün yüksekliğine göre değişiklik gösterir.
tags: 
  - işlem maliyeti
  - XRP
  - hizmet reddi
  - ağ yükü
  - işlem gönderme
  - hesap silme
  - çok-imzalı işlem
keywords: 
  - işlem maliyeti
  - XRP
  - hizmet reddi
  - ağ yükü
  - işlem gönderme
  - hesap silme
  - çok-imzalı işlem
---

# İşlem Maliyeti

XRP Defterini spam ve hizmet reddi saldırılarıyla bozulmaktan korumak için, her işlem küçük bir `XRP` miktarını yok etmelidir. Bu _işlem maliyeti_, ağ üzerindeki yük ile birlikte artacak şekilde tasarlanmıştır, bu da ağı kasıtlı veya isteksiz olarak aşırı yüklemek için oldukça pahalı hale getirir.

Her işlem, işlem maliyetini ödemek için `ne kadar XRP yok edeceğini belirtmelidir`.

## Güncel İşlem Maliyeti

Ağ tarafından standart bir işlem için gerekli olan mevcut minimum işlem maliyeti **0.00001 XRP** (10 damla) olarak belirlenmiştir. Bazen bu, olağandışı bir yük nedeniyle artar.

Ayrıca, `güncel işlem maliyetini sorgulamak için `rippled` kullanabilirsiniz`.

### Özel İşlem Maliyetleri

Bazı işlemlerin farklı işlem maliyetleri vardır:

| İşlem                         | Yük Ölçeklendirmeden Önceki Maliyet |
|-------------------------------|-------------------------------------|
| `Referans İşlemi` (Çoğu işlem) | 10 damla |
| `Anahtar Sıfırlama İşlemi` | 0 |
| `Çok-İmzalı İşlem` | 10 damla × (1 + Sağlanan İmza Sayısı) |
| `Tamamlanma Ile EscrowFinish İşlemi` | 10 damla × (33 + (Tamamlanma boyutu byte cinsinden ÷ 16)) |
| `Hesap Silme İşlemi` | 2.000.000 damla |

:::info
İşlem maliyeti hiçbir tarafa ödenmez: **XRP geri dönülemez şekilde yok edilir.**
:::

## Yük Maliyeti ve Açık Defter Maliyeti

İşlem maliyeti için iki eşik vardır:

* İşlem maliyeti, bir `rippled` sunucusunun `yük tabanlı işlem maliyeti eşiğine` uymuyorsa, sunucu işlemi tamamen yok sayar.
* İşlem maliyeti, bir `rippled` sunucusunun `açık defter maliyeti eşiğine` uymuyorsa, sunucu işlemi daha sonraki bir defter için sıraya alır.

Bu, işlemleri kabaca üç kategoriye ayırır:

* İşlem maliyeti o kadar düşük olan işlemler ki, yük tabanlı işlem maliyeti tarafından reddedilir.
* İşlem maliyeti, geçerli açık deftere dahil edilmek için yeterince yüksek olan işlemler.
* Bu ikisinin arasında kalan işlemler, `daha sonraki bir defter versiyonu için sıraya alınır`.

## Yerel Yük Maliyeti

Her `rippled` sunucusu, mevcut yüküne dayalı bir maliyet eşiği korur. Eğer bir işlem, `rippled` sunucusunun mevcut yük tabanlı işlem maliyetinden daha düşük bir `Fee` değeri ile gönderilirse, o sunucu işlemi ne uygular ne de iletir. (**Not:** Eğer bir işlemi bir `admin bağlantısı` aracılığıyla gönderirseniz, sunucu işlemi, işlemin ölçeklendirilmemiş minimum işlem maliyeti karşılandığı sürece uygular ve iletir.) Bir işlem, `Fee` değeri çoğu sunucunun gereksinimlerini karşılamadığı sürece `konsensüs sürecinden` hayatta kalması çok olası değildir.

## Açık Defter Maliyeti

`rippled` sunucusunun, işlem maliyetini zorlamak için bir ikinci mekanizması vardır, buna _açık defter maliyeti_ denir. Bir işlem, XRP cinsinden açık defter maliyetini karşıladığı sürece açık deftere dahil edilebilir. Açık defter maliyetini karşılamayan işlemler, bunun yerine `sonraki bir deftere sıraya alınabilir`.

**Her yeni defter versiyonu için**, sunucu, önceki defterdeki işlem sayısına dayalı olarak açık deftere dahil edilecek işlem sayısı için bir yumuşak sınır belirler. Açık defter maliyeti, açık defterdeki işlem sayısı yumuşak sınıra eşit olana kadar minimum ölçeklendirilmemiş işlem maliyeti ile eşittir. Daha sonra, açık defter maliyeti, açık deftere dahil edilen her işlem için üssel olarak artar.

:::warning
Bir sonraki defter için, sunucu, mevcut defter yumuşak sınırına göre daha fazla işlem içeriyorsa yumuşak sınırı artırır ve konsensüs süreci 5 saniyeden fazla sürerse yumuşak sınırı azaltır.
:::

Açık defter maliyet gereksinimi, `işlemin normal maliyeti` orantılıdır, mutlak işlem maliyetine değil. Normalden yüksek gereksinime sahip işlem türleri, örneğin `çok-işzalı işlemler`, açık defter maliyetini karşılamak için, minimum işlem maliyetine sahip işlemlerden daha fazla ödemek zorundadır.

Ayrıca bakınız: [`rippled` deposundaki Ücret Artışı açıklaması](https://github.com/XRPLF/rippled/blob/release/src/ripple/app/misc/FeeEscalation.md).

### Sıraya Alınan İşlemler

`rippled`, sunucunun yerel yük maliyetini karşıladığı ancak `açık defter maliyetini` karşılamadığı bir işlem aldığında, sunucu işlemin daha sonraki bir deftere "dahil olma olasılığını" değerlendirir. Eğer öyleyse, sunucu işlemi işlem kuyruğuna ekler ve işlemi ağın diğer üyelerine iletir. Aksi takdirde, sunucu işlemi iptal eder. Sunucu, bağlı işlemlerin bir işlem maliyeti ödemeyecekleri yük miktarını en aza indirmeye çalışır, çünkü `işlem maliyeti yalnızca bir işlem doğrulanan bir deftere dahil edildiğinde uygulanır`.

Sıraya alınan işlemler hakkında daha fazla bilgi için `İşlem Kuyruğu` sayfasını inceleyin.

## Referans İşlem Maliyeti

"Referans İşlemi", gerekli `işlem maliyeti` bakımından en ucuz (ücretsiz olmayan) işlemdir. Çoğu işlem referans işlemiyle aynı maliyeti taşır. Bazı işlemler, örneğin `çok-işzalı işlemler`, bunun yerine bu maliyetin katlarını gerektirir. Açık defter maliyeti yükseldiğinde, gereksinim işlemin temel maliyetine orantılıdır.

### Ücret Düzeyleri

_Ücret düzeyleri_, minimum maliyet ile bir işlemin gerçek maliyeti arasındaki orantılı farkı temsil eder. `Açık Defter Maliyeti` mutlak maliyet yerine ücret düzeyleri ile ölçülmektedir. Aşağıdaki tabloda bir karşılaştırma görebilirsiniz:

| İşlem                                     | Damla cinsinden minimum maliyet | Ücret düzeylerinde minimum maliyet | Damla cinsinden çift maliyet | Ücret düzeylerinde çift maliyet |
|-------------------------------------------|----------------------------------|-----------------------------------|-------------------------------|----------------------------------|
| Referans işlemi (çoğu işlem)             | 10                               | 256                               | 20                            | 512                              |
| `Çok-İmzalı işlem` 4 imza ile | 50                               | 256                               | 100                           | 512                              |
| `Anahtar sıfırlama işlemi` | 0                                | (Etkin şekilde sonsuz)          | N/A                           | (Etkin şekilde sonsuz)           |
| `Tamamlanma İşlemi` 32-byte preimage ile. | 350                              | 256                               | 700                           | 512                              |

## İşlem Maliyetini Sorgulama

`rippled` API'ları, yerel yük tabanlı işlem maliyetini sorgulamanın iki yolunu sunar: `server_info` komutu (insanlar için tasarlanmıştır) ve `server_state` komutu (makineler için tasarlanmıştır).

Açık defter maliyetini kontrol etmek için [ücret metodunu][] kullanabilirsiniz.

### server_info

[server_info yöntemi][] önceki defter için ölçeklendirilmemiş minimum XRP maliyetini `validated_ledger.base_fee_xrp` olarak, ondalık XRP biçiminde rapor eder. Bir işlemin iletilebilmesi için gerekli gerçek maliyet, aynı yanıtta sunucunun mevcut yük seviyesini temsil eden `load_factor` parametresi ile `base_fee_xrp` değerinin çarpılmasıyla ölçeklenir. Diğer bir deyişle:

**Güncel İşlem Maliyeti XRP cinsinden = `base_fee_xrp` × `load_factor`**

### server_state

[server_state yöntemi][] doğrudan `rippled`'in iç yük hesaplamalarının bir temsilini döndürür. Bu durumda, etkin yük oranı, mevcut `load_factor` ile `load_base` oranıdır. `validated_ledger.base_fee` parametresi, `xrp damlası` cinsinden minimum işlem maliyetini rapor eder. Bu tasarım, `rippled`'in işlem maliyetini yalnızca tam sayı matematiği kullanarak hesaplamasına olanak tanırken, sunucu yükü için makul miktarda ince ayar yapılmasını sağlar. İşlem maliyetinin gerçek hesaplaması aşağıdaki gibidir:

**Güncel İşlem Maliyeti Damla cinsinden = (`base_fee` × `load_factor`) ÷ `load_base`**

## İşlem Maliyetini Belirleme

Her imzalı işlem, `Fee` alanında` işlem maliyetini içermelidir. İmzalı bir işlemin tüm alanları gibi, bu alan imzayı geçersiz kılmadan değiştirilemez.

Kural olarak, XRP Defteri işlemleri imzalandıkları gibi _tam olarak_ gerçekleştirir. (Bunu başka bir şekilde yapmak, merkezi olmayan bir konsensüs ağı boyunca koordinat edinmek zor olacağından, en azından.) Bunun sonucu olarak, her işlem, `Fee` alanında belirtilen kesin miktar kadar XRP'yi yok eder; belirtilen miktar, ağın herhangi bir tarafında mevcut minimum işlem maliyetinden çok daha fazla olsa bile. İşlem maliyeti, aksi halde bir hesabın `rezerv gereksinimi` için ayrılmış olan XRP'yi bile yok edebilir.

:::tip
Bir işlemi imzalamadan önce, `güncel yük tabanlı işlem maliyetini sorgulamanızı` öneririz. Eğer işlem maliyeti yük ölçeklendirmesi nedeniyle yüksekse, onu düşmesini beklemek isteyebilirsiniz. Eğer işlemi hemen göndermeyi planlamıyorsanız, gelecekteki yük tabanlı dalgalanmaları hesaba katmak için biraz daha yüksek bir işlem maliyeti belirtmenizi öneririz.
:::

### İşlem Maliyetini Otomatik Olarak Belirleme

`Fee` alanı, bir işlem oluşturulurken `otomatik doldurulabilen` şeylerden biridir. Bu durumda, otomatik doldurma yazılımı, eşler arası ağdaki mevcut yük temelinde uygun bir `Fee` değeri sağlar. Ancak, bu şekilde işlem maliyetini otomatik olarak doldurmanın birçok dezavantajı ve sınırlaması vardır:

- Eğer ağın işlem maliyeti otomatik doldurma ile işlem gönderme arasında artarsa, işlem onaylanmayabilir.
    - Bir işlemin kesin olarak onaylanmış veya reddedilmiş bir durumda sıkışmaması için, sonunda süresi dolması için bir `LastLedgerSequence` parametresi sağlamaya dikkat etmelisiniz. Alternatif olarak, aynı `Sequence` numarasını yeniden kullanarak `sıkışmış bir işlemi iptal etmeyi` deneyebilirsiniz. En iyi uygulamalar için `güvenilir işlem gönderimi` sayfasına bakın.
- Otomatik olarak sağlanan değerin çok yüksek olmamasına dikkat etmelisiniz. Küçük bir işlemi göndermek için büyük bir ücret ödemek istemezsiniz.
    - Eğer `rippled` kullanıyorsanız, [imza yöntemi][] ile yük ölçeklendirmeye imza vermek istediğiniz limiti ayarlamak için `fee_mult_max` ve `fee_div_max` parametrelerini de kullanabilirsiniz.
    - Bazı istemci kütüphaneleri (örneğin, [xrpl.js](https://js.xrpl.org/) ve [xrpl-py](https://xrpl-py.readthedocs.io/)) ayarlanabilir maksimum `Fee` değerlerine sahiptir ve maksimumdan daha yüksek bir `Fee` değerine sahip bir işlemi imzaladığında hata verir.
- Bir çevrimdışı makineden veya `çok imzalı işlemler` sırasında otomatik dolduramazsınız.

## İşlem Maliyetleri ve Başarısız İşlemler

İşlem maliyetinin amacı, XRP Defteri eşler arası ağını aşırı yükten korumak olduğundan, ağda dağıtılan herhangi bir işleme uygulanmalıdır; işlem başarılı olup olmadığına bakılmaksızın. Ancak, paylaşılan küresel deftere etki edebilmesi için, bir işlem doğrulanan bir deftere dahil edilmelidir. Bu nedenle, `rippled` sunucuları, `tec` durum kodları` ("tec", "İşlem Motoru - Sadece talep edilen ücret") ile başarısız işlemleri defterlere dahil etmeye çalışır.

İşlem maliyeti yalnızca işlem, doğrulanan bir deftere dahil olduğunda gönderenin XRP bakiyesinden düşülür. Bu, işlemin başarılı olarak değerlendirilip değerlendirilmmediğine veya bir `tec` kodu ile başarısız olup olmadığına bakılmaksızın doğrudur.

Eğer bir işlemin başarısızlığı `kesinse`, `rippled` sunucusu bunu ağa iletmez. İşlem, doğrulanan bir deftere dahil edilmez, bu nedenle kimsenin XRP bakiyesi üzerinde hiçbir etkisi olamaz.

### Yetersiz XRP

Bir `rippled` sunucusu bir işlemi ilk değerlendirdiğinde, eğer gönderen hesabın XRP işlem maliyetini ödemek için yeterince yüksek bir XRP bakiyesi yoksa, işlemi `terINSUF_FEE_B` hata kodu ile reddeder. Bu bir `ter` (Yeniden Deneme) kodu olduğu için, `rippled` sunucusu işlemi ağa iletmeden yeniden dener; işlem sonucunun `kesin` olduğu zamana kadar.

Bir işlem, ağda zaten dağıtılmışsa, ancak hesabın işlem maliyetini ödemek için yeterince XRP yoksa, sonuç kodu `tecINSUF_FEE` ortaya çıkar. Bu durumda, hesap alabildiği tüm XRP'yi öder ve 0 XRP ile sona erer. Bu, `rippled`'in, işlemi onun devam eden defterine dayalı olarak ağa iletip iletmemeye karar vermesi nedeniyle ortaya çıkabilir; ancak işlemler, konsensüs defterini oluştururken atılabilir veya sıralanabilir.

## Anahtar Sıfırlama İşlemi

Özel bir durum olarak, bir hesap, `lsfPasswordSpent` bayrağı devre dışı olduğunda `0` işlem maliyeti ile bir `SetRegularKey` işlemi gönderebilir. Bu işlem, hesabın _master anahtar çiftleri_ ile imzalanmalıdır. Bu işlemi göndermek, `lsfPasswordSpent` bayrağını etkinleştirir.

Bu özellik, düzenli anahtarın ele geçirilmesi durumunda bir hesabın geri kazanılmasını sağlamak için tasarlanmıştır; böylece ele geçirilmiş bir hesabın yeterli XRP'si olup olmadığı konusunda endişelenmenize gerek kalmaz. Bu şekilde, daha fazla XRP göndermeden önce hesabın kontrolünü geri kazanabilirsiniz.

`lsfPasswordSpent` bayrağı` başlangıçta devre dışıdır. Bu bayrak, master anahtar çifti ile imzalanmış bir SetRegularKey işlemi gönderdiğinizde etkinleşir. Hesap, bir `Ödeme` XRP aldığında, bayrak tekrar devre dışı bırakılır.

`rippled`, nominal işlem maliyeti sıfır olsa bile anahtar sıfırlama işlemlerini diğer işlemlerden daha öncelikli hale getirir.

## İşlem Maliyetini Değiştirme

XRP Defterinin, XRP'nin değerindeki uzun vadeli değişiklikleri dikkate almak için minimum işlem maliyetini değiştirme mekanizması vardır. Herhangi bir değişiklik, konsensüs süreci tarafından onaylanmalıdır. Daha fazla bilgi için `Ücret Oylama` sayfasını inceleyin.

## Ayrıyeten Bakınız

- **Kavramlar:**
    - `Rezervler`
    - `Ücret Oylaması`
    - `İşlem Kuyruğu`
- **Eğitimler:**
    - `Güvenilir İşlem Gönderimi`
- **Referanslar:**
    - [ücret metodu][]
    - [server_info metodu][]
    - `FeeSettings nesnesi`
    - [SetFee sahte işlemi][]

