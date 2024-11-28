---
description: BSC üzerinde stake etmenin temel kavramlarını ve işlemlerini detaylandırarak, kullanıcılar için önemli bilgileri sunmaktadır.
keywords: [stake, BNB, BSC, doğrulayıcı, ödül, delegasyon, PoSA]
---

# Stake Etme

BNB akıllı zinciri (BSC), Proof-of-Staked-Authority (PoSA) blockchain'dir, bu da stake etmenin sistemin en önemli kısımlarından biri olduğu anlamına gelir. [BEP-294](https://github.com/bnb-chain/BEPs/pull/294), BNB zinciri füzyonundan sonra yeni yerel stake etme mekanizmasını tanıtmaktadır ve birkaç farklılığı vardır:

- Kullanıcılar, BNB'yi Beacon zincirine taşımadan doğrudan BSC'de stake etmeye katılabilirler.
- Belirli bir doğrulayıcıya stake edilen BNB'nin kanıtı olarak stake kredisi transfer edilemez. Farklı doğrulayıcılar, farklı stake kredileri verir.
- Stake ödülü otomatik olarak dağıtılmayacaktır.

:::info
Bu bölümde, BSC üzerinde stake etmenin temel kavramlarını ve işlemlerini açıklayacağız.
:::

## Temel Kavramlar

### Konsensüs Motoru

BSC, konsensüs için DPoS ve PoA'yı birleştiren bir konsensüs mekanizması kullanır, böylece:

* Bloklar sınırlı bir doğrulayıcı seti tarafından üretilir.
* Doğrulayıcılar, PoA şeklinde blok üretmek için sırayla görev alırlar.
* Doğrulayıcı seti, stake temelli yönetime dayanarak seçilir.

Stake etme mekanizması, doğrulayıcıların blok üretme uygunluğunu belirlemek için esastır.

### Doğrulayıcı Seti

> Doğrulayıcı seti, BSC üzerinde işlemleri doğrulamak ve blok üretmekten sorumlu düğüm grubudur.  
> — BSC Dokümantasyonu

Doğrulayıcı seti, her doğrulayıcının sahip olduğu stake miktarıyla belirlenir; bu, doğrulayıcının ve delegelerinin stake ettiği BNB miktarını yansıtır. En çok stake eden üst doğrulayıcılar aktif doğrulayıcı seti olarak seçilir ve sırayla blok önermeye ve oylamaya katılırlar. Diğer doğrulayıcılar ise bekleme doğrulayıcı setindedir ve stake'leri artarsa veya bazı aktif doğrulayıcılar ayrılırsa aktif doğrulayıcı setine katılabilirler.

Herhangi bir kuruluş veya birey, zincir üzerinde kendi doğrulayıcısını oluşturarak ve yeterince delegasyon güvence altına alarak doğrulayıcı setinin bir parçası olabilir. Benzer şekilde, tüm BNB delegasyonlarını geri çekerek opt-out yapabilirler.

> Doğrulayıcılar ayrıca kötü davranış veya çevrimdışı olma için bir ceza olan slashing ile doğrulayıcı setinden çıkarılabilirler.

### Doğrulayıcı Seçimi

Doğrulayıcıların farklı rolleri vardır:

* Kabine: Blok üretme şansı en yüksek olan en üst K (bu an itibarıyla 21) doğrulayıcı.
* Aday: Küçük blok üretme şansı olan en üst (K, K+NumOfCandidates] (bu an itibarıyla (21,45]) doğrulayıcı.
* Pasif: Blok üretme şansı olmayan diğer doğrulayıcılar.

![img](../../images/bnb-chain/assets/bcfusion/validator-election.png)

Tüm doğrulayıcıların rollerini belirlemek için, doğrulayıcı seti her 24 saatte bir en son stake bilgilerine dayanarak güncellenir. UTC 00:00'dan sonraki ilk blokta, konsensüs motoru tüm doğrulayıcıları sıralar ve BSC doğrulayıcı seti sözleşmesini güncelleyerek sıralama bilgisini kaydeder. 

:::note
BC füzyonu sırasında, Beacon Chain'de oluşturulan doğrulayıcılar ile BSC'de oluşturulan doğrulayıcılar birlikte sıralanarak en iyi doğrulayıcılar belirlenir. Ancak, BSC'de oluşturulan doğrulayıcılar aynı miktarda BNB stake için Beacon Chain'de oluşturulan doğrulayıcılara göre üç kat oy gücü alacaklardır.
:::

### Sistem Sözleşmeleri

BSC stake etme işlemini kolaylaştırmak için birkaç yerleşik sözleşme (yani sistem sözleşmeleri) bulunmaktadır.

* **Doğrulayıcı Seti Sözleşmesi**: Sözleşme, periyodik olarak bir doğrulayıcı seti seçer. Sözleşme aynı zamanda doğrulayıcı ödüllerini geçici olarak depolamak için bir kasa görevi görür. Periyodik olarak, bu ödüller BC'ye geri gönderilir veya BSC yerel stake modülüne transfer edilir.

* **Sistem Ödül Sözleşmesi**: Bu sözleşme, işlem ücretlerinin bir kısmını toplamak için bir kasa olarak işlev görür. Fonlar, hızlı nihai ödüller dağıtmak gibi çeşitli kamu amaçları için kullanılır.

* **Slashing Sözleşmesi**: Bu sözleşme, bir doğrulayıcının ne kadar süreyle kullanılamaz hale geldiğini takip etmek için kullanılır ve belirli bir eşik aşıldığında ceza tetikler. Ayrıca, bu sözleşme, iki kez imzalama ve hızlı nihai oylamada kötü niyetli davranış gibi diğer slashing olaylarını da ele alır.

* **Stake Hub Sözleşmesi**: Bu sözleşme, doğrulayıcıları ve delegasyonları yönetmek için bir giriş noktası olarak hizmet ederken, belirli doğrulayıcıların slashing mantığını da uygular. Delegasyon/geri delegasyon/yeni delegasyon işlemleri için, bir kullanıcının stake'ini yönetmek için farklı doğrulayıcıların uygulama sözleşmelerini arayacaktır.

### Kredi Sözleşmesi

Her doğrulayıcının, staking kredi yönetimini ve kredi ile BNB arasında değişimi kolaylaştıran kendi doğrulayıcı sözleşmesi bulunmaktadır. Bir stake k redisinin token adı "stake {{validator moniker}} credit" ve sembolü "st{{validator moniker}}"dır. Sözleşme, bir doğrulayıcı oluşturulduğunda Stake Hub Sözleşmesi tarafından oluşturulacaktır.

Bir kullanıcı BNB'yi delegasyon yaptığında, eşdeğer miktarda kredi token'ı oluşturulur. Öte yandan, bir kullanıcı delegasyonunu geri çektiğinde, ilgili miktarda kredi token'ı yok edilir ve böylece BNB serbest bırakılır.

### Ödül Dağıtımı

Stake ödülü işlem ücretlerinden gelir - bir blok üretildiğinde, blok ücretinin çoğunluğu, bloğu öneren doğrulayıcı için ödül olarak toplanır. Her gün, toplanan ödüllerin bir kısmı doğrudan doğrulayıcının operatör hesabına komisyon olarak gönderilirken, kalan kısmı ilgili doğrulayıcı kredi sözleşmesine gönderilecektir. Ve bir kullanıcı geri delegasyon yapıp hisse senetlerini talep ettiğinde, biriken ödül ve orijinal stake kendisine iade edilir.

---

## Doğrulayıcı İşlemleri

Doğrulayıcılar, BNB Akıllı Zinciri yazılımını çalıştıran düğümlerdir ve konsensüs sürecine katılırlar. Kendi doğrulayıcı adreslerinde minimum BNB stake etmeleri gerekmektedir ve diğer BNB sahiplerinden delegasyon alabilirler. Doğrulayıcılar, işlem ücretlerinden ödül kazanır ve bu ödüllerin çoğunu delegeleriyle paylaşırlar.

### Doğrulayıcı Oluşturma

Bir doğrulayıcı oluşturmak için, bir BNB sahibi `StakeHub` sözleşmesine, sistem sözleşmesi olan ve adresi `0x0000000000000000000000000000000000002002` olan bir `CreateValidator` işlemi göndermelidir, doğrulayıcının kendi doğrulayıcı adresine stake etmesi gereken minimum BNB miktarını (2000 BNB) belirterek, aşağıdaki bilgileri içermelidir:

- **Operatör adresi**: Stake kredisi ve ödülleri alacak olan doğrulayıcının adresi.
- **Konsensüs adresi**: Doğrulayıcının düğümünün konsensüs adresi.
- **Oylama Adresi**: Hızlı nihai oylama için katılacak adres.
- **BLS Kanıtı**: Doğrulayıcının oylama adresine sahip olduğunu kanıtlayan bir BLS imzası.
- **Komisyon**: Komisyon oranı, doğrulayıcının kendisi için saklayacağı ödül yüzdesini tanımlar, geri kalan ise delegelere dağıtılır. Ayrıca, doğrulayıcının belirli bir zaman diliminde ayarlayabileceği maksimum komisyon oranını ve maksimum değişim oranını içerir.
- **Açıklama**: Doğrulayıcı hakkında isteğe bağlı bilgi, moniker, kimlik, web sitesi vb. gibi.

`CreateValidator` işlemi, doğrulayıcı adresinden minimum kendine delegasyon miktarını düşer ve doğrulayıcıya ilgili stake kredisini verir. Doğrulayıcı daha sonra bekleme doğrulayıcı setine katılacak ve aktif doğrulayıcı setine katılıp katılamayacağını görmek için bir sonraki doğrulayıcı seti güncellemesini bekleyecektir.

### Doğrulayıcıyı Düzenleme

Bir doğrulayıcı, `StakeHub` sözleşmesine `EditConsensusAddress`, `EditCommissionRate`, `EditDescription`, `EditVoteAddress` işlemleri göndererek doğrulayıcı bilgilerini düzenleyebilir ve aşağıdaki bilgileri uygun şekilde belirtebilir:

- **Yeni konsensüs adresi**: Doğrulayıcının düğümünün yeni konsensüs adresi.
- **Yeni komisyon oranı**: Doğrulayıcının kendisi için ayıracağı ödüllerin yeni yüzdesi; sadece maksimum değişim oranı sınırı içinde artırılabilir.
- **Yeni açıklama**: Doğrulayıcı hakkında yeni bilgi, moniker, kimlik, web sitesi vb. gibi.
- **Yeni oylama adresi**: Hızlı nihai oylama için katılacak yeni oylama adresi.

Bu işlemler, BNB akıllı zincirindeki doğrulayıcı bilgilerini günceller ve değişiklikler hemen geçerli olur. Ancak, yeni komisyon oranı yalnızca işlemden sonra kazanılan ödüllere uygulanacak ve önceki ödüller, önceki komisyon oranına göre dağıtılacaktır.

---

## Delegatör İşlemleri

Delegatörler, BNB'lerini bir doğrulayıcı ile stake eden ve ödülleri paylaşan BNB sahipleridir. Herhangi bir aktif veya bekleme doğrulayıcıyı seçebilir, bunlar arasında geçiş yapabilir, BNB'lerini geri çekebilir ve her zaman ödül talep edebilirler.

### Delegasyon

Bir doğrulayıcıya BNB'yi delegasyon yapmak için, bir BNB sahibi `StakeHub` sözleşmesine `Delegate` işlemi göndermelidir ve aşağıdaki bilgileri belirtmelidir:

- **Operatör adresi**: Delegasyondan BNB'yi alacak doğrulayıcının adresi.
- **Delegasyon Oylama Gücü**: Delegatörün yönetime katılmak için oylama gücünü doğrulayıcıya devretmek isteyip istemediğini belirten bayrak.

`Delegate` işlemi, delegatör adresinden ilgili BNB miktarını düşer ve doğrulayıcıya karşılık gelen stake kredisini verir. Doğrulayıcı daha sonra, komisyon oranına göre delegatörle ödüllerini paylaşacaktır.

> Bir delegatörün alacağı kredi token'ları (veya pay) şu şekilde hesaplanır - `delegation amount` * `total supply of credit token` / `total pooled BNB`. 
> — İşlem Prensibi

`Total pooled BNB`, delegasyon BNB'si ve doğrulayıcının talep edilmemiş ödül BNB'sini içerir. Bu, bir delegatörün kredi token'ları alacağını, kendi delegasyon BNB miktarının toplam stake edilmiş ve ödül BNB'ye oranı üzerinden belirleyeceği anlamına gelir. Doğrulayıcı blok ödülü aldığında, `total pooled BNB` miktarı artar; bu da demek oluyor ki geri delegasyon yapıldığında, delegatör kendi delegasyonunu ve havuzdan ödül BNB'sini alır.

### Yeniden Delegasyon

Bir doğrulayıcıdan diğerine BNB'yi yeniden delegasyon yapmak için, bir delegatör `StakeHub` sözleşmesine `Redelegate` işlemi göndermelidir ve aşağıdaki bilgileri belirtmelidir:

- **Kaynak operatör adresi**: BNB'yi hedef doğrulayıcıya gönderecek kaynak doğrulayıcının adresi.
- **Hedef operatör adresi**: Kaynak doğrulayıcıdan BNB'yi alacak hedef doğrulayıcının adresi.
- **Miktar**: Delegatörün kaynak doğrulayıcıdan hedef doğrulayıcıya yeniden delegasyon yapmak istediği BNB miktarı.
- **Delegasyon Oylama Gücü**: Delegatörün yönetime katılmak için oylama gücünü hedef doğrulayıcıya devretmek isteyip istemediğini belirten bayrak.

`Redelegate` işlemi, kaynak doğrulayıcı stake kredisinden miktarı düşer ve kullanıcıya ilgili hedef doğrulayıcı stake kredisini verir. Hedef doğrulayıcı daha sonra, komisyon oranına göre delegatörle ödüllerini paylaşacaktır.

:::warning
`Redelegate` işlemi, geri delegasyon süresini gerektirmez, ancak yeniden delegasyon ücreti doğurur; bu, delegatörlerin en yüksek ödülleri elde etmek veya en yüksek risklerden kaçınmak için sıkça doğrulayıcı değiştirmelerini önlemek amacıyla tasarlanmıştır. Mevcut ücret oranı %0.002'dir.
:::

### Geri Delegasyon

Bir doğrulayıcıdan BNB'yi geri delegasyon yapmak için, bir delegatör `StakeHub` sözleşmesine `Undelegate` işlemi göndermelidir ve aşağıdaki bilgileri belirtmelidir:

- **Operatör adresi**: BNB'yi delegatöre gönderecek doğrulayıcının adresi.
- **Miktar**: Delegatörün doğrulayıcıdan geri almak istediği BNB miktarı.

`Undelegate` işlemi, kullanıcının stake kredisinden miktarı yakar ve BNB'yi bir çekme kuyruğuna taşır. BNB, delegatörün bunu talep etmeden önce **geri delegasyon süresi** boyunca kilitlenir. Geri delegasyon süresi şu anda 7 gün olarak belirlenmiştir ve bu, delegatörlerin bir doğrulayıcının kötü davranışı veya bir ağ saldırısı durumunda BNB'lerini hızla geri çekmelerini önlemek amacıyla tasarlanmıştır.

### Talep

Geri delegeli BNB'yi ve ödülleri talep etmek için bir delegatör, `StakeHub` sözleşmesine `Claim` işlemi göndermelidir ve aşağıdaki bilgileri belirtmelidir:

- **Delegatör adresi**: Ödülleri doğrulayıcıdan alacak olan delegatörün BEP20 adresi.
- **Kuyrukta bekleyen geri delegasyon sayısı**: Talep edilecek geri delegasyon isteği sayısı, 0 değeri, tüm geri delegasyon taleplerinden BNB ve ödül talep etmek anlamına gelir.

`Claim` işlemi, delegasyondaki BNB ve ödülleri delegatöre geri döndürecektir. Not edilmelidir ki, bir delegatör yalnızca geri delegasyon sonrası ödülleri alabilir. Geri delegasyon yapılmadan önce, ödül, bir delegatörün gelirini artırmak için daha fazla stake edilecektir.