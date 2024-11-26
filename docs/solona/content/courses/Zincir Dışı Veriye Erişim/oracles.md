---
title: Orakullar ve Oracle Ağları
objectives:
  - Neden onchain programların kendi başlarına gerçek dünya verilerine kolayca erişemediğini açıklayın
  - Orakulların onchain gerçek dünya verilerine erişim sorununu nasıl çözdüğünü açıklayın
  - Teşvikli oracle ağlarının veriyi nasıl daha güvenilir hale getirdiğini açıklayın
  - Çeşitli türde orakulları kullanmanın getirilerini etkili bir şekilde değerlendirin
  - Onchain bir programdan gerçek dünya verilerine erişmek için orakulları kullanın
description: Solana programı içinde gerçek dünya verilerine erişim.
---

## Özet

- Orakullar, blockchain ağına dış veri sağlayan hizmetlerdir.
- Solana, zengin bir orakül sağlayıcı ekosistemine sahiptir. Bazı dikkat çeken orakül sağlayıcıları şunlardır: [Pyth Network](https://pyth.network), [Switchboard](https://switchboard.xyz), [Chainlink](https://chain.link) ve [DIA](https://www.diadata.org/solana-price-oracles/).
- Kendi veri beslemenizi oluşturmak için kendi orakülünüzü inşa edebilirsiniz.
- Orakül sağlayıcıları seçerken güvenilirlik, doğruluk, merkeziyetsizlik, güncelleme sıklığı ve maliyet gibi faktörleri dikkate alın. 
  :::warning
  Güvenlik risklerinin farkında olun: orakullar potansiyel hata veya saldırı noktaları olabilir. Kritik veriler için güvenilir sağlayıcılar kullanın ve riskleri azaltmak için birden fazla bağımsız orakül düşünün.
  :::

---

## Dersi

Orakullar, blockchain ağına dış veri sağlayan hizmetlerdir. Blockchainler, dış dünyayı doğası gereği bilmeyen, yalıtılmış ortamlardır. Orakullar, çeşitli veri türlerini onchain almak için merkeziyetsiz bir yol sunarak bu sınırlamayı çözer, örneğin:

- Spor etkinliklerinin sonuçları
- Hava durumu verileri
- Politik seçim sonuçları
- Piyasa verileri
- Rastgelelik

Uygulama blockchainlere göre değişiklik gösterebilir, ancak orakullar genel olarak şu şekilde çalışır:

1. Veri offchain olarak temin edilir.
2. Veri, bir işlem aracılığıyla onchain olarak yayımlanır ve bir hesapta saklanır.
3. Programlar, hesapta saklanan verileri okuyabilir ve programın mantığında kullanabilir.

> Bu ders, orakulların nasıl çalıştığının temellerini, Solana'daki orakulların durumunu ve Solana geliştirmenizde orakulları nasıl etkili bir şekilde kullanacağınızı ele alacaktır. — **Ders Özeti**

### Güven ve Orakül Ağları

Orakullar için temel zorluk güvenilirliktir. Blockchainler geri alınamaz finansal işlemleri yürüttüğü için, geliştiricilerin ve kullanıcıların orakül verilerinin geçerliliğine ve doğruluğuna güvenmeleri gerekir. Bir orakülü güvenilir kılmanın ilk adımı, uygulamasını anlamaktır.

Geniş anlamda üç tür uygulama vardır:

1. **Tek, merkezi bir orakül veriyi onchain yayımlar.**
   - **Artı:** Basittir; tek bir gerçeklik kaynağı vardır.
   - **Eksi:** Orakül sağlayıcısının hatalı veriler sağlamasını önleyen hiçbir şey yoktur.
   
2. **Oraküller ağının veriyi yayımladığı ve konsensüsün nihai sonucu belirlediği yapı.**
   - **Artı:** Konsensüs, hatalı verilerin onchain'e itme olasılığını azaltır.
   - **Eksi:** Kötü aktörlerin hatalı veriler yayımlayarak konsensüsü etkilemesi için doğrudan bir tasfiye yoktur.

3. **Stake mekanizmasına sahip orakül ağı:** Oraküllerin katılmak için token stake etmesi gerekmektedir. Bir orakülün yanıtı konsensüsten çok saparsa, stake protokol tarafından alınır ve artık raporlama yapamaz.
   - **Artı:** Bu yaklaşım, tek bir orakülün nihai sonucu aşırı şekilde etkilemesini önlerken, dürüst ve doğru raporlamayı teşvik eder.
   - **Eksi:** Merkeziyetsiz ağlar inşa etmek zordur; uygun teşvikler ve yeterli katılım başarı için gereklidir.

Her uygulama, orakülün kullanım durumuna bağlı olarak yerini alır. Örneğin, bir blockchain tabanlı oyun için merkezi orakullar kullanmak kabul edilebilir olabilir. Ancak, ticaret uygulamaları için fiyat verisi sağlayan merkezi bir orakül ile daha az rahat hissedebilirsiniz.

Kendi uygulamalarınız için offchain verilerine erişmek üzere bağımsız oraküller oluşturabilirsiniz. Ancak, bunların merkeziyetsizliğin temel bir ilke olduğu daha geniş topluluk tarafından kullanılması pek olası değildir. Merkezi üçüncü taraf orakulleri kullanırken de dikkatli olun.

İdeal bir senaryoda, tüm önemli veya değerli veriler, güvenilir bir stake konsensüs mekanizması ile yüksek verimli bir orakül ağı üzerinden onchain sağlanacaktır. Bir stake sistemi, orakül sağlayıcılarını, stake ettikleri fonları korumak için verilerinin doğruluğunu sağlamak amacıyla teşvik eder.

Bir orakül ağı, konsensüs mekanizmasına sahip olduğunu iddia etse bile, risklerin farkında olun. Aşağı akış uygulamalarında toplam stake değeri, orakül ağının stake miktarını aşarsa, orakullar arasında işbirliği için yeterli bir teşvik olabilir.

Bir geliştirici olarak, bir orakül ağının nasıl yapılandırıldığını anlamak ve güvenilir olup olmadığını değerlendirmek sizin sorumluluğunuzdur. Genel olarak, orakullar yalnızca misyon-kritik olmayan işlevler için kullanılmalı ve en kötü senaryolar her zaman göz önünde bulundurulmalıdır.

---

### Solana'daki Orakullar

Solana, her birinin kendine özgü teklifleri olan çeşitli orakül sağlayıcılarına sahiptir. Dikkate değer olanlar:

- [**Pyth**](https://www.pyth.network/price-feeds)  
  Çoğunlukla önde gelen finansal kuruluşlar tarafından yayımlanan finansal verilere odaklanmaktadır. Pyth'ın veri sağlayıcıları, piyasa verisi güncellemelerini yayımlayan onaylı varlıklardır ve bu veriler toplanarak Pyth programı aracılığıyla onchain'e sunulmaktadır. Bu veriler tamamen merkeziyetsiz değildir, çünkü yalnızca onaylı sağlayıcılar yayımlayabilir. Ancak, Pyth'ın en önemli avantajı, bu kuruluşlardan doğrudan alınan yüksek kaliteli, denetlenmiş veriler sunmasıdır.
  
- [**Switchboard**](https://switchboard.xyz)  
  Farklı veri beslemeleri ile tamamen merkeziyetsiz bir orakül ağıdır. Bu beslemeleri [Switchboard web sitesinde](https://app.switchboard.xyz/solana/mainnet) keşfedebilirsiniz. Herkes bir Switchboard orakülü çalıştırabilir veya verilerinden yararlanabilir, ancak bu, kullanıcıların kullandıkları beslemelerin kalitesini araştırma konusunda dikkatli olmalarını gerektirir.
  
- [**Chainlink**](https://chain.link)  
  Birden fazla blockchain üzerinde güvenli offchain hesaplamalar ve gerçek dünya verileri sağlayan merkeziyetsiz bir orakül ağıdır.

- [**DIA**](https://www.diadata.org/solana-price-oracles/)  
  Dijital varlıklar ve geleneksel finansal araçlar için şeffaf ve doğrulanmış veriler sunan açık kaynaklı bir orakül platformudur.

> Bu derste **Switchboard** kullanacağız. Ancak bu kavramlar, çoğu orakül için geçerlidir, bu nedenle ihtiyaçlarınıza en uygun orakül sağlayıcısını seçmelisiniz. — **Dikkat Edilmesi Gerekenler**

Switchboard, önceki bölümde tartışıldığı gibi stake-ağırlıklı bir orakül ağı modelini takip eder, ancak ek bir güvenlik katmanı olarak [**Güvenilir Çalışma Ortamları (TEE)**](https://en.wikipedia.org/wiki/Trusted_execution_environment) kullanır. TEEs, hassas kodların çalıştırılabileceği, sistemin geri kalanından izole edilmiş güvenli ortamlardır. Basitçe söylemek gerekirse, TEEs bir program ve bir girdi alabilir, programı çalıştırabilir ve bir çıktı ile birlikte bir kanıt üretebilir. TEA'ler hakkında daha fazla bilgi için [Switchboard'ın Mimari Tasarım belgelerine](https://docs.switchboard.xyz/docs/switchboard/readme/architecture-design#trusted-execution-environments-for-layered-security) göz atabilirsiniz.

TEA'leri dahil ederek, Switchboard her orakülün yazılımını doğrulayarak, ağ içindeki bütünlüğünü sağlamaktadır. Bir orakül operatörü kötü niyetli davranırsa veya onaylı kodu değiştirirse, veri alıntısı doğrulama süreci başarısız olur. Bu, Switchboard'un yalnızca veri raporlamayı desteklemesini değil, aynı zamanda offchain özel ve gizli hesaplamalar gerçekleştirmesini de sağlar.

---

### Switchboard Orakulları

Switchboard orakulları, veri beslemeleri (aynı zamanda **aggregatörler** olarak da bilinir) aracılığıyla Solana'da veri saklar. Bu veri beslemeleri, tek bir sonuç üretmek için bir araya getirilen birden fazla işten oluşur. Aggregatörler, Switchboard programı tarafından yönetilen normal Solana hesapları olarak onchain'de temsil edilir ve güncellemeler bu hesaplara doğrudan yazılır. Switchboard'un nasıl çalıştığını anlamak için bazı anahtar terimlere göz atalım:

- **[Aggregatör (Veri Beslemesi)](https://github.com/switchboard-xyz/solana-sdk/blob/main/rust/switchboard-solana/src/oracle_program/accounts/aggregator.rs)** -
  Güncellemelerin nasıl talep edileceği, işleneceği ve çözüleceğine dair aggregratör ayarlarını içerir. Aggregatör hesabı, Switchboard programı tarafından yönetilir ve nihai veriyi onchain'de saklar.
  
- **[İş](https://github.com/switchboard-xyz/solana-sdk/blob/main/rust/switchboard-solana/src/oracle_program/accounts/job.rs)** -
  Her veri kaynağı, offchain veriyi temin etmek ve dönüştürmek için görevleri tanımlayan bir iş hesabına karşılık gelir. Bu, belirli bir kaynaktan veri nasıl alınacağı için bir taslak görevi görür.
  
- **[Orakül](https://github.com/switchboard-xyz/solana-sdk/blob/main/rust/switchboard-solana/src/oracle_program/accounts/oracle.rs)** -
  Bir orakül, internet ile blockchain arasında aracılık yapar. İş tanımlarını verilerden okur, sonuçları hesaplar ve bunları onchain yayımlar.
  
- **Orakül Kuyruğu** - Güncelleme talepleri, dairesel bir şekilde atanmış oraküller havuzudur. Kuyruktaki oraküller, güncellemeleri sağlamak için sürekli onchain'de sinyal vermelidir. Kuyruğun verisi ve konfigürasyonu, Switchboard programı tarafından yönetilen [onchain hesabında](https://github.com/switchboard-xyz/solana-sdk/blob/main/javascript/solana.js/src/generated/oracle-program/accounts/OracleQueueAccountData.ts) saklanır.
  
- **Orakül Konsensüsü** - Oraküller, yanıtların medyanını kullanarak ortak bir sonuç üzerinde mutabakata varır. Besleme yetkisi, ek güvenlik için kaç orakülün yanıt vermesi gerektiğini kontrol eder.

Switchboard, orakülleri veri beslemelerini güncel tutmaları için bir ödül sistemi aracılığıyla teşvik eder. Her veri beslemesinin, güncelleme taleplerini yerine getiren orakülleri ödüllendiren önceden finanse edilmiş bir escrow olan bir `LeaseContract` hesabı vardır. `leaseAuthority`, fonları çekebilir, ancak herkes sözleşmeye katkıda bulunabilir. Bir kullanıcı bir besleme güncellemesi talep ettiğinde, escrow hem kullanıcıyı hem de güncelleme talep eden (güncelleme taleplerini sistematik olarak gönderen yazılımı çalıştıran) crank turnerları ödüllendirir. Oraküller sonuçları onchain sunmaya başladığında, bu escrow'dan ödeme alırlar.

Oraküllerin güncellemelere katılmak için aynı zamanda token stake etmeleri gerekir. Eğer bir orakül, kuyruğun yapılandırılmış parametreleri dışındaki bir sonuç sunarsa, stake'i kesilebilir, eğer kuyrukta `slashingEnabled` etkinse. Bu mekanizma, oraküllerin doğru veriler sunarak iyi niyetle hareket etmesini sağlar.

#### Verilerin Onchain Yayınlanması

1. **Orakül Kuyruğu Kurulumu** - Güncelleme talebi yapıldığında, sıradaki `N` orakül kuyruktan atanır ve tamamlandıktan sonra arka plana taşınır. Her kuyruğun, belirli kullanım durumlarına göre güvenliği ve davranışı belirleyen kendi yapılandırması vardır. Kuyruklar, hesaplar olarak onchain'de saklanır ve 
   [`oracleQueueInit` talimatı](https://github.com/switchboard-xyz/solana-sdk/blob/main/javascript/solana.js/src/generated/oracle-program/instructions/oracleQueueInit.ts) aracılığıyla oluşturulabilir.
   - Anahtar
     [Orakül Kuyruğu yapılandırmaları](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/queue/struct.OracleQueueAccountData.html):
     - `oracle_timeout`: Bir sinyal zaman aşımından sonra eski orakulları kaldırır.
     - `reward`: Oraküller ve tur açıcıları için ödülleri tanımlar.
     - `min_stake`: Bir orakülün katılması için gereken minimum stake.
     - `size`: Kuyruktaki mevcut orakül sayısı.
     - `max_size`: Bir kuyruğun destekleyebileceği maksimum orakül sayısı.
2. **[Aggregatör/veri beslemesi ayarı](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/aggregator/struct.AggregatorAccountData.html)** -
   Her besleme, tek bir orakül kuyruğuna bağlıdır ve güncellemelerin nasıl talep edileceği ve işleneceği hakkında yapılandırma ayrıntılarını içerir.
3. **[İş Hesabı Kurulumu](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/job/struct.JobAccountData.html)** -
   Her veri kaynağı, oraküllerin beslemenin güncelleme taleplerini nasıl alacağını ve yerine getireceğini tanımlayan bir iş hesabı gerektirir. Bu iş hesapları ayrıca verilerin nereden temin edileceğini belirtir.
4. **Talep Atama** - Güncelleme talep edildiğinde, orakül kuyruğu görevi kuyruktaki farklı oraküllere atar. Her orakül, beslemenin iş hesaplarında tanımlanan kaynaklardan verileri işler, veriler üzerinde ağırlıklı bir medyan sonucu hesaplar.
5. **Konsensüs ve Sonuç Hesaplama** - Gerekli sayıda orakül yanıtı
   ([`minOracleResults`](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/aggregator/struct.AggregatorAccountData.html#structfield.min_oracle_results))
   alındığında, sonuç yanıtların medyanı olarak hesaplanır. Belirlenen parametreler içinde yanıt gönderen oraküller ödüllendirilir, eğer eşik dışındaysa ceza uygulanır (eğer `slashingEnabled` aktifleştirilmişse).
6. **Veri Depolama** - Nihai sonuç, güncellenmiş verilerin diğer programlar tarafından tüketilmesi için erişilebilir olduğu aggregatör hesabında saklanır.

---

#### Switchboard Orakullarını Kullanma

Switchboard orakullarını kullanarak offchain verilerini Solana programına dahil etmek için ilk adım, ihtiyaçlarınıza uygun bir veri beslemesi bulmaktır. Switchboard, çeşitli veri türleri için birçok [kamusal olarak mevcut besleme](https://app.switchboard.xyz/solana/mainnet) sunmaktadır. Bir besleme seçerken, aşağıdaki faktörleri dikkate almalısınız:

- **Doğruluk/Güvenilirlik**: Verilerin uygulamanız için ne kadar hassas olması gerektiğini değerlendirin.
- **Veri Kaynağı**: Verilerin nereden geldiğine dayalı olarak bir besleme seçin.
- **Güncelleme Sıklığı**: Beslemenin ne sıklıkta güncellendiğini anlayarak kullanım durumunuza uygunluğunu sağlayın.

Kamuya açık beslemeleri tüketirken, bu yönler üzerinde kontrol sahibi olmayacağınız için, gereksinimlerinize dayanarak dikkatlice seçmek önemlidir.

Örneğin, Switchboard, mevcut Bitcoin fiyatını USD cinsinden sağlayan bir [BTC/USD beslemesi](https://app.switchboard.xyz/solana/mainnet/feed/8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee) sunar. Bu besleme, aşağıdaki kamu anahtarıyla Solana devnet ve mainnet'te mevcuttur: `8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee`.

Bir Switchboard besleme hesabının onchain verisinin nasıl göründüğüne dair bir anlık görüntü:

```rust
// Switchboard solana programından
// https://github.com/switchboard-xyz/solana-sdk/blob/main/rust/switchboard-solana/src/oracle_program/accounts/aggregator.rs#L60

pub struct AggregatorAccountData {
    /// Onchain'de saklanacak aggregator adı.
    pub name: [u8; 32],
    ...
    ...
    /// Aggregatörün ait olduğu kuyrukun Pubkey'i.
    pub queue_pubkey: Pubkey,
    ...
    /// Bir tur geçerli kılınmadan önce gerekli minimum orakül yanıt sayısı.
    pub min_oracle_results: u32,
    /// Bir orakülün bir sonucu kabul etmeden önce gereken minimum iş sonuç sayısı.
    pub min_job_results: u32,
    /// Aggregatör turları arasındaki minimum saniye.
    pub min_update_delay_seconds: u32,
    ...
    /// Önceki tur ile mevcut tur arasındaki değişim yüzdesi. Varyans yüzdesi karşılanmazsa, yeni orakül yanıtlarını reddedin.
    pub variance_threshold: SwitchboardDecimal,
    ...
    /// Geçerli olarak kabul edilen en son onaylanan güncelleme talep sonucu. En son onaylanan turda istediğiniz veriyi burada bulacaksınız.
    pub latest_confirmed_round: AggregatorRound,
    ...
    /// Önceki onaylanan tur sonucunun değeri.
    pub previous_confirmed_round_result: SwitchboardDecimal,
    /// Önceki onaylanan turun açıldığı slot.
    pub previous_confirmed_round_slot: u64,
    ...
}
```

Bu veri yapısının tam kodunu [Switchboard programında burada](https://github.com/switchboard-xyz/solana-sdk/blob/main/rust/switchboard-solana/src/oracle_program/accounts/aggregator.rs#L60) görebilirsiniz.

`AggregatorAccountData` türündeki bazı ilgili alanlar ve yapılandırmalar şunlardır:

- `min_oracle_results` - Bir tur geçerli kılınmadan önce gerekli minimum orakül yanıt sayısı.
- `min_job_results` - Bir orakülün bir sonucu kabul etmeden önce gereken minimum iş sonuç sayısı.
- `variance_threshold` - Önceki tur ile mevcut tur arasındaki değişim yüzdesi. Varyans yüzdesi karşılanmazsa, yeni orakül yanıtlarını reddedin.
- `latest_confirmed_round` - Geçerli olarak kabul edilen en son onaylanan güncelleme talep sonucu. Bu, `latest_confirmed_round.result` içinde beslemenin verilerini bulacağınız yerdir.
- `min_update_delay_seconds` - Aggregatör turları arasındaki minimum gereken saniye sayısı.

Yukarıda listelenen ilk üç yapılandırma, bir veri beslemesinin doğruluğu ve güvenilirliği üzerinde doğrudan etkiye sahiptir:

- `min_job_results` alanı, bir orakülün yanıtını onchain'de sunabilmesi için veri kaynaklarından alması gereken minimum başarılı yanıt sayısını temsil eder. Örneğin, `min_job_results` üç olarak ayarlanmışsa, her orakül en az üç iş kaynağından veri çekmelidir. Bu sayı ne kadar yüksek olursa, verilerin güvenilirliği ve doğruluğu o kadar artar ve herhangi bir tek veri kaynağının etkisi azalır.

- `min_oracle_results` alanı, bir turun başarılı olması için gereken minimum orakül yanıt sayısıdır. Kuyruktaki her orakül, her kaynak tanımına ait veriyi alır, bu yanıtların ağırlıklı medyanını alır ve bu medyanı onchain'e sunar. Program daha sonra bu ağırlıklı medyanlardan `min_oracle_results` kadar olanları bekler ve bunların medyanını hesaplar; bu, veri besleme hesabında saklanan nihai sonuçtur.

- `min_update_delay_seconds` alanı, beslemenin güncelleme sıklığı ile ilgilidir. Bu değer, Switchboard programı sonuçları kabul etmeden önce geçmesi gereken zaman dilimidir.

> Switchboard'un gezgini üzerinde bir besleminin iş tabına bakmak faydalı olabilir. Örneğin, [BTC_USD beslemesine göz atabilirsiniz](https://app.switchboard.xyz/solana/devnet/feed/8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee). Her iş, oraküllerin çektiği veri kaynaklarını tanımlar ve her kaynağa atanan ağırlığı gösterir. Bu besleme için verileri sağlayan gerçek API uç noktalarını görebilirsiniz. Programınız için bir besleme seçerken, bu hususlar önemlidir.

Aşağıda, [MEXC](https://www.mexc.com/) ve [Coinbase](https://www.coinbase.com/) üzerinden veri gösteren BTC_USD beslemesine ait iki iş bulunmaktadır.

![Oracle Jobs](../../../images/solana/public/assets/courses/unboxed/oracle-jobs.png)

Bir besleme seçtikten sonra, o beslemeden veriyi deseralize edip hesabın içinde saklanan durumu okuyarak verileri zaten okumaya başlayabilirsiniz. Bunu yapmanın en kolay yolu, programınızdaki `switchboard_solana` paketinden `AggregatorAccountData` yapısını kullanmaktır.

```rust
// Anchor ve Switchboard paketlerini içe aktar
use {anchor_lang::prelude::*, switchboard_solana::AggregatorAccountData};

...
```  

# Frequency Guidelines

:::tip
Maximum 5 enhancement features per 2000 characters.
:::

:::info
Distribute features evenly throughout the content for clarity.
:::

:::warning
Only add where they significantly improve understanding.
:::

# Code Example

```rust
#[derive(Accounts)]
pub struct ConsumeDataAccounts<'info> {
    // Veri akışı hesabını geçir ve AggregatorAccountData'ya ayrıştır
    pub feed_aggregator: AccountLoader<'info, AggregatorAccountData>,
    ...
}
```

Null kopya ayrıştırma kullanarak `AccountLoader`, programın büyük hesaplar gibi `AggregatorAccountData` içindeki belirli verilere erişmesini sağlar, **tüm hesabı belleğe yüklemeden**. Bu, **yalnızca hesapların gerekli kısımlarına erişerek** bellek verimliliğini ve performansı artırır. Aşağıdaki gibi düşünün:

- **Zamandan tasarruf** sağlanır.
- **Kaynaklar** etkin bir şekilde kullanılır.

:::note
Bu, özellikle büyük hesap yapıları için faydalıdır.
:::

:::tip
`AccountLoader` kullanarak veriye üç şekilde erişebilirsiniz:
:::

- `load_init`: Bir hesabı başlattıktan sonra kullanılır (bu, kullanıcının talimat kodu eklendikten sonra eklenen eksik hesap ayırtıcısını göz ardı eder).
- `load`: Hesap değiştirilemez olduğunda kullanılır.
- `load_mut`: Hesap değiştirilebilir olduğunda kullanılır.

Detaylı incelemek için `İleri Düzey Program Mimarisi dersi` bölümüne göz atın, burada `Zero-Copy` ve `AccountLoader` hakkında daha fazla bilgi veriyoruz.

---

Programınıza geçirdiğiniz aggregator hesabıyla, en son oracle sonucunu almak için bunu kullanabilirsiniz. Özellikle, aggregator türünde `get_result()` metodunu kullanabilirsiniz:

```rust
// Bir Anchor programının içinde
...

let feed = &ctx.accounts.feed_aggregator.load()?;
// sonucu al

let val: f64 = feed.get_result()?.try_into()?;```

:::info
`AggregatorAccountData` yapısında tanımlanan `get_result()` metodu, `latest_confirmed_round.result` ile veri alımından daha güvenlidir çünkü Switchboard bazı harika güvenlik kontrolleri uygulamıştır.
:::

```rust
// Switchboard programından
// https://github.com/switchboard-xyz/solana-sdk/blob/main/rust/switchboard-solana/src/oracle_program/accounts/aggregator.rs#L206

pub fn get_result(&self) -> anchor_lang::Result<SwitchboardDecimal> {
    if self.resolution_mode == AggregatorResolutionMode::ModeSlidingResolution {
        return Ok(self.latest_confirmed_round.result);
    }
    let min_oracle_results = self.min_oracle_results;
    let latest_confirmed_round_num_success = self.latest_confirmed_round.num_success;
    if min_oracle_results > latest_confirmed_round_num_success {
        return Err(SwitchboardError::InvalidAggregatorRound.into());
    }
    Ok(self.latest_confirmed_round.result)
}
```

Ayrıca, `AggregatorAccountData` hesabında saklanan mevcut değeri istemci tarafında Typescript ile görüntüleyebilirsiniz.

```typescript
import { AggregatorAccount, SwitchboardProgram } from "@switchboard-xyz/solana.js";
import { PublicKey, SystemProgram, Connection } from "@solana/web3.js";
import { Big } from "@switchboard-xyz/common";
...
...

const DEVNET_RPC_URL = "https://api.devnet.solana.com";
const SOL_USD_SWITCHBOARD_FEED = new PublicKey(
  "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR",
);
// Test kullanıcısı için anahtar çifti oluştur
let user = new anchor.web3.Keypair();

// Switchboard devnet program nesnesini al
switchboardProgram = await SwitchboardProgram.load(
  new Connection(DEVNET_RPC_URL),
  payer,
);

// AggregatorAccount yapıcıya Switchboard program nesnesini ve feed pubkey'yi geç
aggregatorAccount = new AggregatorAccount(
  switchboardProgram,
  SOL_USD_SWITCHBOARD_FEED,
);

// En son SOL fiyatını al
const solPrice: Big | null = await aggregatorAccount.fetchLatestValue();
if (solPrice === null) {
  throw new Error("Aggregator değer tutmuyor");
}
```

Unutmayın, Switchboard veri akışları sadece üçüncü taraflar (oracle) tarafından güncellenen hesaplardır. Bu bağlamda, herhangi bir hesapla yapabileceğiniz her şeyi, programınıza dışarıdan geçirebileceğiniz hesaplarla da yapabilirsiniz.

---

### En İyi Uygulamalar ve Yaygın Hatalar

:::tip
Switchboard akışlarını programlarınıza entegre ederken, iki grup endişeyi göz önünde bulundurmalısınız: seçilen akış ve o akıştan veriyi tüketme.
:::

Bir akışı programınıza entegre etmeden önce her zaman ayarları denetleyin. **Min Güncelleme Gecikmesi**, **Min iş Sonuçları** ve **Min Oracle Sonuçları** gibi yapılandırmalar, nihayetinde aggregator hesabına kalıcı olarak kaydedilecek olan verileri doğrudan etkileyebilir. Örneğin, [BTC_USD akışının](https://app.switchboard.xyz/solana/devnet/feed/8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee) yapılandırma bölümüne bakarak, ilgili yapılandırmasını görebilirsiniz.

![Oracle Yapılandırmaları](../../../images/solana/public/assets/courses/unboxed/oracle-configs.png)

- BTC_USD akışının Min Güncelleme Gecikmesi = 6 saniyedir. 
- Bu, BTC fiyatının bu akıştaki minimum her 6 saniyede bir güncelleneceği anlamına gelir.

:::warning
Bu, çoğu kullanım durumu için muhtemelen yeterlidir, ancak bu akışı bir gecikme hassasiyeti gerektiren bir şey için kullanmak istiyorsanız, muhtemelen iyi bir seçim değildir.
:::

Ayrıca, oracle keşif aracındaki İşler bölümünde bir akışın kaynaklarını denetlemek de faydalıdır. Onchain'de kalıcı olarak saklanan değer, oracle'ların her kaynaktan çektiği ağırlıklı medyan sonuç olduğundan, kaynaklar, akışta saklananları doğrudan etkiler. **Şüpheli bağlantılar için kontrol edin** ve güvenlerini kazanmak için bir süre API'leri kendiniz çalıştırın.

:::

### 1. Frequency Guidelines:
- Maximum 5 enhancement features per 2000 characters
- Distribute features evenly throughout the content
- Only add where they significantly improve understanding

---

### 2. Strategic Use of Admonitions:

:::info
**Göz önünde bulundurmanız gereken hesap kısıtlamaları:**
:::

- Kullanıcı hesabından `escrow` hesabına SOL transferi yapacağımız için her ikisinin de değiştirilebilir olması gerekir.
- `escrow_account`'ın, "MICHAEL BURRY" dizesi ve kullanıcının pubkey'i ile türetilmiş bir PDA olması gerektiğini biliyoruz. Bu gereksinimi karşılayacak şekilde geçen adresin gerçekten uygun olduğunu garanti etmek için Anchor hesap kısıtlamalarını kullanabiliriz.
- Ayrıca, bu PDA'da program için bir durum saklamak üzere bir hesap başlatmamız gerektiğini de biliyoruz. Burada `init` kısıtlamasını kullanıyoruz.

--- 

### 3. Details Elements:

Gerçek Mantık

Şimdi gerçek mantığa geçelim. Yapmamız gereken tek şey `escrow` hesabının durumunu başlatmak ve SOL transferini gerçekleştirmektir. Kullanıcının, escrow'da kilitlenmesini istediği SOL miktarını ve kilit açma fiyatını geçmesini bekliyoruz. Bu değerleri `escrow` hesabında saklayacağız.

Bunun ardından, yöntem transferi gerçekleştirmelidir. Bu program, yerel SOL kilitleyecektir. Bu nedenle, token hesaplarına veya Solana token programına ihtiyacımız yok. Kullanıcının escrow'da kilitlemek istediği lamportları transfer etmek ve transfer talimatını çağırmak için `system_program`'ı kullanmamız gerekecek.


---

```rust filename="deposit.rs"
pub fn deposit_handler(ctx: Context<Deposit>, escrow_amount: u64, unlock_price: f64) -> Result<()> {
    msg!("Escrow'da fon yatırılıyor...");

    let escrow = &mut ctx.accounts.escrow_account;
    escrow.unlock_price = unlock_price;
    escrow.escrow_amount = escrow_amount;

    let transfer_instruction =
        transfer(&ctx.accounts.user.key(), &escrow.key(), escrow_amount);

    invoke(
        &transfer_instruction,
        &[
            ctx.accounts.user.to_account_info(),
            ctx.accounts.escrow_account.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    msg!(
        "Transfer tamamlandı. Escrow SOL'u {}'de açılacak.",
        &ctx.accounts.escrow_account.unlock_price
    );

    Ok(())
}
```

:::note
`deposit.rs` dosyasının sonunda görünüm şu şekilde olmalıdır:
:::

```rust filename="deposit.rs"
use crate::constants::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction::transfer};

pub fn deposit_handler(ctx: Context<Deposit>, escrow_amount: u64, unlock_price: f64) -> Result<()> {
    msg!("Escrow'da fon yatırılıyor...");

    let escrow = &mut ctx.accounts.escrow_account;
    escrow.unlock_price = unlock_price;
    escrow.escrow_amount = escrow_amount;

    let transfer_instruction =
        transfer(&ctx.accounts.user.key(), &escrow.key(), escrow_amount);

    invoke(
        &transfer_instruction,
        &[
            ctx.accounts.user.to_account_info(),
            ctx.accounts.escrow_account.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    msg!(
        "Transfer tamamlandı. Escrow SOL'u {}'de açılacak.",
        &ctx.accounts.escrow_account.unlock_price
    );

    Ok(())
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        seeds = [ESCROW_SEED, user.key().as_ref()],
        bump,
        payer = user,
        space = DISCRIMINATOR_SIZE + Escrow::INIT_SPACE
    )]
    pub escrow_account: Account<'info, Escrow>,

    pub system_program: Program<'info, System>,
}
```

---

### 8. Çekme

`Withdraw` talimatı, `Deposit` talimatıyla aynı üç hesaba ek olarak `SOL_USDC` Switchboard feed hesabını gerektirecektir. Bu kod, `withdraw.rs` dosyasına yerleştirilecektir.

```rust filename="withdraw.rs"
use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use std::str::FromStr;
use switchboard_solana::AggregatorAccountData;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [ESCROW_SEED, user.key().as_ref()],
        bump,
        close = user
    )]
    pub escrow_account: Account<'info, Escrow>,

    #[account(
        address = Pubkey::from_str(SOL_USDC_FEED).unwrap()
    )]
    pub feed_aggregator: AccountLoader<'info, AggregatorAccountData>,

    pub system_program: Program<'info, System>,
}
```

:::warning
Kapatma kısıtlamasını kullandığımızı unutmayın çünkü işlem tamamlandığında `escrow_account`'ı kapatmak istiyoruz.
:::

Ayrıca, verilen feed hesabının gerçekten `usdc_sol` feed'i olduğunu doğrulamak için adres kısıtlamalarını da kullanıyoruz (SOL_USDC_FEED adresi kodda sabitlenmiştir). Deseralize edilen AggregatorAccountData yapısı, Switchboard rust crate'inden gelir. Bu, verilen hesabın switchboard programı tarafından sahiplenildiğini doğrular ve değerlerine kolayca erişmemizi sağlar. Gördüğünüz gibi, bu `AccountLoader` içinde yer almaktadır. Bunun nedeni, feed'in aslında oldukça büyük bir hesap olmasıdır ve sıfır kopyaya ihtiyacı vardır.

---

### 9. Test Etme

Hadi birkaç test yazalım. Dört tane olmalı:

- Geçerli SOL fiyatının **_altında_** bir kilit açma fiyatı ile bir Escrow oluşturmak, böylece ödünç almak için test edelim
- Yukarıdaki escrow'dan çekme ve kapatma
- Geçerli SOL fiyatının **_üzerinde_** bir kilit açma fiyatı ile bir Escrow oluşturmak, böylece ödünç almak için test edelim
- Yukarıdaki escrow'dan çekme ve başarısız olma

Not edin ki her kullanıcı için yalnızca bir escrow olabilir, bu nedenle yukarıdaki sıra önemlidir.

:::tip
Tüm test kodunu bir parçacık halinde sağlayacağız. Çalıştırmadan önce, onun üzerinden geçip anladığınızdan emin olun.
:::

```typescript filename="burry-escrow.ts"
// tests/burry-escrow.ts içindeki
// Test kodu burada
```

```bash
  burry-escrow
Onchain kilit açma fiyatı: 137.42243
Escrow'daki miktar: 1058020
    ✔ oluşturur Burry Escrow Mevcut Fiyatın Altında (765ms)
Hesap mevcut değil veya verisi yok LxDZ9DXNwSFsu2e6u37o6C2T3k59B6ySEHHVaNDrgBq
    ✔ escrow'dan çeker (353ms)
Onchain kilit açma fiyatı: 157.42243
Escrow'daki miktar: 1058020
    ✔ oluşturur Burry Escrow Mevcut Fiyatın Üstünde (406ms)
AnchorError oluştu. Hata Kodu: SolPriceBelowUnlockPrice. Hata Numarası: 6003. Hata Mesajı: Mevcut SOL fiyatı Kilit açma fiyatının üstünde değil..
    ✔ kilit açma fiyatının altında iken çekmeyi başarısız olur

  4 başarılı (2s)
```

---

:::danger
Bir şey ters giderse, laboratuvarı gözden geçirin ve her şeyin doğru olduğundan emin olun.
:::

```markdown
Kodunuzu GitHub'a yükleyin ve [bize bu dersle ilgili ne düşündüğünüzü söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=1a5d266c-f4c1-4c45-b986-2afd4be59991)!
```