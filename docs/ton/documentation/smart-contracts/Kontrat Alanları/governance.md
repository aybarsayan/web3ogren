# Yönetim Sözleşmeleri

TON'da, TVM, catchain, ücretler ve zincir topolojisi ile ilgili düğüm işletim konsensüs parametreleri (bu parametrelerin nasıl depolandığı ve güncellendiği dahil) bir dizi özel akıllı sözleşme tarafından kontrol edilmektedir. Bu parametrelerin sert kodlanmasının eski ve esnek olmayan yöntemlerinin aksine, TON kapsamlı ve şeffaf bir zincir içi yönetim uygular. Özel sözleşmeler seti, mevcut olarak Seçmen, Konfigürasyon ve DNS sözleşmelerini içerir ve gelecekte ekstra para birimi Üreticisi gibi diğerleriyle genişletilecektir.

## Seçmen

Seçmen akıllı sözleşmesi, doğrulama turlarının birbirini nasıl değiştirdiğini, kimin blok zincirini doğrulama görevini alacağını ve doğrulama için ödüllerin nasıl dağıtılacağını kontrol eder. Eğer bir doğrulayıcı olmak ve Seçmen ile etkileşimde bulunmak istiyorsanız, :::tip [doğrulayıcı talimatlarını](https://ton.org/validator) kontrol edin.

Seçmen, `credits` hashmap'inde geri çekilmeyen Toncoin verilerini, `elect` hashmap'inde yeni başvuruları ve _past_elections_ hashmap'inde önceki seçimlerle ilgili bilgileri saklar. Sonuncusu, doğrulayıcı kötü davranışları hakkında _şikayetler_ içinde ve zaten bitmiş turlar için doğrulayıcının _dondurulmuş_ stake'ları ile saklanır. Bu stake'lar `stake_held_for` (ConfigParam 15) için tutulur. Seçmen sözleşmesinin üç amacı vardır:

- Doğrulayıcıların seçimi için başvuruları işlemek
- Seçimler düzenlemek
- Doğrulayıcı kötü davranış raporlarını işlemek
- Doğrulama ödüllerini dağıtmak

### Başvuru İşleme

Bir başvuru oluşturmak için, gelecekteki bir doğrulayıcı, ilgili parametreleri (ADNL adresi, genel anahtar, `max_factor` vb.) içeren özel bir mesaj oluşturmalı, bunu belirli bir TON miktarına (stake olarak adlandırılır) eklemeli ve Seçmen'e göndermelidir. Seçmen, bu parametreleri kontrol eder ve ya bir başvuruyu kaydeder ya da hemen stake'i gönderen kişiye geri döner. **Başvuruların yalnızca masterchain üzerindeki adreslerden kabul edildiğini unutmayın.**

### Seçim Yapma

Seçmen, her blokta zorunlu olarak çağrılabilen özel bir akıllı sözleşmedir (sözde Tick ve Tock işlemleri). Gerçekten de, Seçmen her blokta çağrılır ve yeni bir seçim yapmanın zamanı olup olmadığını kontrol eder.

Seçim sürecinin genel konsepti, tüm başvuruları, özellikle TON miktarını ve `max_factor`'ı dikkate alarak ve her doğrulayıcıya, TON miktarına orantılı olarak ama tüm `max_factor` koşullarının karşılandığı şekilde ağırlık vermektir.

Bu, teknik olarak şu şekilde uygulanır:

1. Seçmen, stake miktarı mevcut ağ minimumu `min_stake`'in (ConfigParam 17) üzerinde olan tüm başvuruları alır.
2. Bunları azalan sırayla stake miktarına göre sıralar.
3. Katılımcı sayısı maksimum doğrulayıcı sayısından (`max_validators` ConfigParam 16) fazla ise, listenin sonunu atar.
4. `i` döngüsü 1'den `N`'ye (kalan katılımcı sayısı).
   - Listeden (azalan sırada sıralanmış) ilk `i` elemanı al
   - _i_-inci adayın son kabul edilen olacağını varsay (ve dolayısıyla en düşük ağırlığa sahip olacak) ve `max_factor` ile ilgili olarak etkili stake (`true_stake` kodda) hesapla. 
   - Başka bir deyişle, _j_-inci (`j<i`) başvuranın etkili stake'i `min(stake[i]*max_factor[j], stake[j])` olarak hesaplanır.
   - 1'den _i_-inci katılımcılara kadar toplam etkili stake'i (TES) hesapla. Eğer bu TES, daha önce bilinen maksimum TES'ten yüksekse, o zaman bu mevcut en iyi ağırlık konfigürasyonu olarak kabul edilir.
5. Mevcut en iyi konfigürasyonu al, yani maksimum stake’i kullanan ağırlık konfigürasyonunu al ve bunu yeni doğrulayıcı seti olarak konfigürasyon sözleşmesine (Konfigürasyon sözleşmesi, aşağıya bakınız) gönder.
6. Doğrulayıcı olmayan başvuranlardan gelen ve fazla olan kullanılamayan stake'leri `credits` tablosuna koy, bu tablodan başvuranlar tarafından istenebilir.

---

Bu şekilde, dokuz adayın 100.000 stake ve 2.7 faktörü varsa ve bir katılımcının 10.000 stake'i varsa, son katılımcı seçilmeyecektir: Onun olmaması durumunda, etkili stake 900.000 olacak, ancak onunla birlikte sadece 9 * 27.000 + 10.000 = 253.000 olacak. Buna karşın, eğer bir aday 100.000 ve 2.7 faktörü ile ve dokuz katılımcı 10.000 stake'i varsa, hepsi doğrulayıcı olur. Ancak, ilk aday sadece 10*2.7 = 27.000 TON stake yapacak ve artan 73.000 TON `credits`'e gidecektir.

**Seçim sonuçları için bazı sınırlamalar vardır** (açıkça TON konfigürasyon parametreleri tarafından kontrol edilen) özellikle `min_validators`, `max_validators` (ConfigParam 16), `min_stake`, `max_stake`, `min_total_stake`, `max_stake_factor` (ConfigParam 17). Eğer mevcut başvurularla bu koşulları karşılama yolu yoksa, seçimler ertelenecektir.

### Doğrulayıcı kötü davranışlarını raporlama süreci

Her doğrulayıcı, zaman zaman yeni bir blok oluşturması için rastgele atanır (eğer doğrulayıcı birkaç saniye içinde başarısız olursa, bu görev bir sonraki doğrulayıcıya geçer). Böyle atamaların sıklığı doğrulayıcının ağırlığı ile belirlenir. Bu nedenle, herkes önceki doğrulama turundan blokları alabilir ve üretilen blokların beklenen sayısının gerçek blok sayısına yakın olup olmadığını kontrol edebilir. **İstatistiksel olarak önemli bir sapma**, üretim blok sayısının beklenenden az olması, bir doğrulayıcının kötü davrandığı anlamına gelir. TON üzerinde, kötü davranışı kanıtlamak Merkle kanıtları kullanarak oldukça kolaydır. Seçmen sözleşmesi, saklanması için ödeme yapmaya hazır olan herkesten böyle bir kanıtı kabul eder ve şikayeti kaydeder. Ardından, mevcut turdaki her doğrulayıcı şikayeti kontrol eder ve eğer doğruysa ve önerilen ceza kötü davranışın ciddiyeti ile uyumluysa, ona oy verir. Ağırlık açısından 2/3’ten fazla oy aldığında, şikayet kabul edilir ve ceza `past_elections`'ın ilgili elemanının `frozen` hashmap'inden ayrılır.

### Doğrulama ödüllerinin dağıtımı

Yeni seçim yapmanın zamanı olup olmadığını kontrol etmekle aynı şekilde, Seçmen her blokta `past_elections` için `frozen`'den fonların serbest bırakılması zamanının gelip gelmediğini kontrol eder. İlgili blokta, Seçmen, ilgili doğrulama turlarından (gaz ücretleri ve blok oluşturma ödülleri) toplanan kazançları, o turun doğrulayıcılarına doğrulayıcı ağırlıklarına orantılı olarak dağıtır. Sonrasında, ödüllerle birlikte stake'ler `credits` tablosuna eklenir ve seçim `past_elections` tablosundan kaldırılır.

### Seçmen'in mevcut durumu

Mevcut durumu :::info [dapp](https://1ixi1.github.io/elector/) üzerinden kontrol edebilirsiniz; bu, seçim katılımcılarını, kilitli stake'leri, çekilmeye hazır fonları, şikayetleri vb. görmeyi sağlar.

---

## Konfigürasyon

Konfigürasyon akıllı sözleşmesi TON konfigürasyon parametrelerini kontrol eder. Mantığı, bazı parametreleri değiştirme iznine kimin sahip olduğunu ve hangi koşullar altında bunu yapabileceğini belirler. Ayrıca bir öneri/oylama mekanizması ve doğrulayıcı setinin döngüsel güncellemelerini de gerçekleştirir.

### Doğrulayıcı seti döngüsel güncellemeleri

Konfigürasyon sözleşmesi, Seçmen sözleşmesinden yeni bir doğrulayıcı setinin seçildiğine dair özel bir mesaj aldığında, ConfigParam 36'ya (bir sonraki doğrulayıcılar) yeni bir doğrulayıcı seti koyar. Daha sonra, TickTock işlemleri sırasında her blokta, konfigürasyon sözleşmesi yeni doğrulayıcı setini uygulama zamanının gelip gelmediğini kontrol eder (zaman `utime_since`, doğrulayıcı setinin kendisine gömülüdür) ve geçmiş seti ConfigParam 34'ten (mevcut doğrulayıcılar) ConfigParam 32'ye (geçmiş doğrulayıcılar) taşır ve ConfigParam 36'dan gelen seti ConfigParam 34'e ayarlar.

### Öneri/oylama mekanizması

Öneri saklama ücreti ödemeye hazır olan herkes, ilgili mesajları Konfigürasyon sözleşmesine göndererek bir veya daha fazla konfigürasyon parametresinin değişikliğini önerebilir. Karşılığında, mevcut set içindeki herhangi bir doğrulayıcı, kendi özel anahtarıyla bir onay mesajı imzalayarak bu öneriye oy verebilir. **Unutmayın:** ilgili genel anahtar ConfigParam 34'te saklanmaktadır. 3/4 oy alındığında veya alınmadığında (doğrulayıcıların ağırlığına göre), öneri turu kazanır veya kaybeder. Kritik bir tur sayısı kazanıldığında (`min_wins` ConfigParam 11), öneri kabul edilir; kritik bir tur sayısı kaybedildiyse (`max_losses` ConfigParam 11), öneri reddedilir. Bazı parametrelerin kritik olarak kabul edildiğini unutmayın (kritik parametre seti kendisi bir konfigürasyon parametresidir, ConfigParam 10) ve bu nedenle kabul edilmesi için daha fazla tura ihtiyaç vardır.

Acil durum güncellemeleri için `-999`, `-1000`, `-1001` konfigürasyon parametreleri için oylama yapılması için ayrılmıştır. Karşılık gelen indekslerle önerinin yeterli oy alması durumunda, Acil durum anahtarı, Konfigürasyon sözleşmesinin ya da Seçmen sözleşmesinin kodunu günceller.

---

#### Acil Durum Güncellemesi

Doğrulayıcılar, oylama mekanizması aracılığıyla yapılamadığında konfigürasyon parametrelerini güncellemek için özel bir genel anahtar atamak için oy kullanabilirler. Bu, ağın aktif gelişimi sırasında gerekli olan geçici bir önlemdir. Ağ olgunlaştıkça, bu önlemin sona ermesi beklenmektedir. Geliştirildikten ve test edildikten sonra, anahtar çok imzalı bir çözüme aktarılacaktır. Ve ağ kararlılığını kanıtladığında, acil durum mekanizması tamamen kaldırılacaktır.

Doğrulayıcılar, bu anahtarı TON Vakfı'na atamak için Temmuz 2021'de oy verdiler (masterchain bloğu `12958364`). Böyle bir anahtarın yalnızca konfigürasyon güncellemelerini hızlandırmak için kullanılabileceğini unutmayın. Hiçbir sözleşmenin koduna, depolamasına veya bakiyesine müdahale edemez.

Acil durum güncellemelerinin geçmişi:

- 17 Nisan 2022'de, seçim için başvuru sayısı o kadar arttı ki, o an gaz sınırları dâhilinde seçim yapılamadı. Özellikle, seçimler 10 milyon gaz gerektirirken, blok `soft_limit` ve `hard_limit` sırasıyla `10m` ve `20m` olarak ayarlanmıştı (ConfigParam 22); `special_gas_limit` ve `block_gas_limit` sırasıyla `10m` ve `10m` olarak ayarlanmıştı (ConfigParam 20). Bu nedenle, yeni doğrulayıcılar belirlenemedi ve blok gaz limitinin aşılması nedeniyle, masterchain üzerindeki dahili mesajları işleyen işlemler bloğa dahil edilemedi. **Sonuç olarak, konfigürasyon güncellemeleri için oy kullanmanın imkânsız hale gelmesi durumu oluştu.** Acil durum anahtarı, ConfigParam 22 `soft_limit`'i `22m` ve `hard_limit`'i `25m` (blok `19880281`) olarak güncellemek için kullanıldı ve ConfigParam 20 `special_gas_limit`'i `20m` ve `block_gas_limit`'i `22m` (blok `19880300`) olarak güncelledi. Sonuç olarak, seçim başarılı bir şekilde gerçekleştirildi; sonraki blok `10 001 444` gaz tüketti. Seçimlerin toplam ertelenmesi süresi yaklaşık 6 saatti ve temel zincirin işlevselliği etkilenmedi.

- 2 Mart 2023'te, seçim için başvuru sayısı yeterince büyüdü ki, `20m` gaz seçim gerçekleştirmek için yeterli olmadı. Ancak bu sefer masterchain, daha yüksek `hard_limit` nedeniyle dış mesajları işlemeye devam etti. Acil durum anahtarı, ConfigParam 20 `special_gas_limit`'i `25m` ve `block_gas_limit`'i `27m` (blok `27747086`) olarak güncellemek için kullanıldı. Sonuç olarak, bir sonraki blokta seçim başarıyla gerçekleştirildi. **Seçimlerin toplam ertelenme süresi yaklaşık 6 saatti; buna ek olarak, hem master zincirin hem de temel zincirin işlevselliği etkilenmedi.**

- 22 Kasım 2023'te, anahtar [kendini terk etti](https://t.me/tonblockchain/221) (blok `34312810`). Sonuç olarak, genel anahtar 32 sıfır bayt ile değiştirildi.

- Ed25519 imza doğrulamasının OpenSSL implementasyonuna geçiş nedeniyle, [genel anahtarın tüm baytlarının aynı olduğu](https://github.com/ton-blockchain/ton/blob/7fcf26771748338038aec4e9ec543dc69afeb1fa/crypto/ellcurve/Ed25519.cpp#L57C1-L57C1) özel durumu kontrolü devre dışı bırakıldı. Bu nedenle, sıfır genel anahtarına karşı kontrol, beklendiği gibi çalışmadı. Bu sorunu kullanarak, acil durum anahtarı 9 Aralık'ta [güncellendi](https://t.me/tonstatus/80) (blok `34665437`, [tx](https://tonscan.org/tx/MU%2FNmSFkC0pJiCi730Fmt6PszBooRZkzgiQMv0sExfY=)) sıfırdan bir şey yok-byte_dizisine `82b17caadb303d53c3286c06a6e1affc517d1bc1d3ef2e4489d18b873f5d7cd1` olarak; bu `sha256("Not a valid curve point")`'tir. **Artık**, ağ konfigürasyon parametrelerinin güncellenmesinin tek yolu doğrulayıcı konsensüsüdür.

## Ayrıca Bakınız

- `Önceden Derlenmiş Sözleşmeler`