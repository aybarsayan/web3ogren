---
title: Genel Durum Sıkıştırma Hedefleri

objectives:
  - Solana'nın durum sıkıştırma mantığının akışını açıklayın.
  - Bir Merkle ağacı ile eşzamanlı Merkle ağacı arasındaki farkı açıklayın.
  - Temel bir Solana programında genel durum sıkıştırmasını uygulayın.

description:
  Sıkıştırılmış NFT'lerin arkasındaki teknoloji olan durum sıkıştırmasını anlayın
  - ve bunu Solana programlarınızda nasıl uygulayacağınızı öğrenin.
---

## Özet

- Solana'daki durum sıkıştırması öncelikle sıkıştırılmış NFT'ler (cNFT'ler) için kullanılmaktadır, ancak her türlü veri tipine uygulanabilir.
- Durum sıkıştırması, Merkle ağaçları kullanarak onchain depolamanız gereken veri miktarını azaltır.
- Bir Merkle ağacı, verileri tekrar tekrar hashleyerek sıkıştırır, böylece tek bir kök hash üretilir. Bu kök hash daha sonra onchain depolanır.
- Bir Merkle ağacındaki her yaprak, o yaprağın verisinin bir hash'idir.
- Eşzamanlı bir Merkle ağacı, bir Merkle ağacının özel bir versiyonudur. Standart bir Merkle ağacının aksine, birden fazla güncellemeye aynı anda izin verir, işlem geçerliliğini etkilemeden.

:::note
Bir durum sıkıştırılmış programda veriler onchain olarak depolanmaz. Bu nedenle, verilerin offchain bir önbelleğini tutmak için indexleyiciler kullanmalısınız. Bu offchain önbellek verisi daha sonra onchain Merkle ağacına karşı doğrulama yapmak için kullanılır.
:::

## Ders

Daha önce, durum sıkıştırmasını sıkıştırılmış NFT'ler bağlamında konuştuk.

Sıkıştırılmış NFT'ler, durum sıkıştırması için en önemli kullanım durumu olmasına rağmen, durum sıkıştırmasını herhangi bir Solana programına uygulayabilirsiniz. Bu derste, durum sıkıştırmasını genel terimlerle tartışacağız, böylece Solana projelerinizde kullanabilirsiniz.

### Durum sıkıştırmasının teorik bir görünümü

Normalde, Solana programlarındaki veriler serileştirilmiş (genellikle borsha ile) ve doğrudan bir hesapta saklanır. Bu, program aracılığıyla verileri okumayı ve yazmayı kolaylaştırır. Hesap verileri güvenilirdir çünkü yalnızca program bunu değiştirebilir.

> **_Not:_** Verilerin bütünlüğünü doğrulamak için, gerçek verileri onchain depolamanıza gerek yoktur. 

Bunun yerine, verilerin hash'lerini depolayabiliriz, bu da doğruluğunu kanıtlamak veya doğrulamak için kullanılabilir. Bu, _durum sıkıştırması_ olarak adlandırılır.

Bu hash'ler, orijinal verilerden çok daha az depolama alanı kaplar. Tam veri daha ucuz bir offchain konumda depolanabilir ve yalnızca erişildiğinde onchain hash ile doğrulanması gerekir.

Solana Durum Sıkıştırma programı, **eşzamanlı Merkle ağaçı** olarak bilinen bir program kullanır. Eşzamanlı bir Merkle ağacı, verileri belirleyici bir şekilde hash'leyen özel bir ikili ağaç türüdür, yani aynı girdiler her zaman aynı Merkle kökünü üretecektir.

Son hash, _Merkle kökü_ olarak adlandırılır, tüm orijinal tam veri kümelerinin toplamından çok daha küçüktür. Bu nedenle "sıkıştırma" olarak adlandırılır. Ve bu hash onchain depolanır.

**Bu sürecin adımları aşağıda sıralanmıştır:**

1. Bir veri parçasını alın.
2. O verinin hash'ini oluşturun.
3. Hash'i ağacın alt kısmında bir "yaprak" olarak depolayın.
4. Yaprak çiftlerini bir araya getirerek dallar oluşturun.
5. Dallar çiftlerini bir araya getirin.
6. Bu süreci ağacın tepesine ulaşana kadar tekrarlayın.
7. Ağacın tepe kısmı son bir "kök hash" içerir.
8. Bu kök hash'i verinin kanıtı olarak onchain depolayın.
9. Veriyi doğrulamak için hash'leri yeniden hesaplayın ve son hash'i onchain kök hash ile karşılaştırın.

:::warning
Bu yöntem bazı takaslarla birlikte gelir:
1. Veriler onchain olarak depolanmadığı için erişimi daha zordur.
2. Geliştiricilerin veriyi onchain hash ile ne sıklıkla doğrulayacaklarına karar vermeleri gerekir.
3. Veri değiştiğinde, tüm veri seti, yeni veri ile birlikte programa gönderilmelidir. Ayrıca, verinin hash ile eşleştiğine dair kanıt da gerekecektir.
:::

Bu hususlar, programlarınızda durum sıkıştırmasını uygulayıp uygulamamak, ne zaman ve nasıl uygulamak gerektiğini belirlerken yol gösterecektir. Bu hızlı genel görünümle daha teknik detaylara girelim.

#### Eşzamanlı Merkle Ağaçları

Bir Merkle ağacı tek bir hash olarak temsil edildiğinden, bir yaprak düğümündeki herhangi bir değişiklik kök hash'i değiştirir. Bu, aynı slot içinde birden fazla işlemin yaprak verileri güncellemeye çalışması durumunda problemli hale gelir. İşlemler ardışık olarak yani birbiri ardına yürütüldüğünden, ilk işlem hariç hepsi başarısız olacaktır, çünkü ilk gerçekleşen işlem kök hash ve sağlanan kanıtı geçersiz kılacaktır.

Kısacası, standart bir Merkle ağacı yalnızca bir yaprak güncellemesi işleyebilir. [slot](https://solana.com/docs/terminology#slot). Bu durum, durum sıkıştırılmış bir programda bir Merkle ağacına bağımlı olduğundan, verimliliği önemli ölçüde sınırlar.

Neyse ki, bu sorun bir _eşzamanlı_ Merkle ağacı kullanılarak çözülebilir. Standart bir Merkle ağacının aksine, bir eşzamanlı Merkle ağacı son güncellemelerin güvenli bir değişiklik günlüğünü, kök hash'i ve elde etmek için gerekli kanıtı tutar. Aynı slot içindeki birden fazla işlem yaprak verilerini değiştirmeye çalıştığında, değişiklik günlüğü referans işlevi görerek ağacın eşzamanlı güncellemelerine olanak tanır.

Eşzamanlı Merkle ağacı bunu nasıl başarır? Standart bir Merkle ağacında yalnızca kök hash depolanır. Ancak, eşzamanlı bir Merkle ağacı, sonraki yazımların başarılı olmasını sağlayan ek veriler içerir.

Bu, aşağıdakileri içerir:

1. Kök hash - Standart bir Merkle ağacında bulunan aynı kök hash.
2. Değişiklik günlüğü tamiri - Son kök hash değişiklikleri için kanıt verilerini içeren bir tampon, böylece aynı slot içindeki daha fazla yazımın başarılı olmasını sağlar.
3. Çatı - Belirli bir yaprağı güncellemek için, yapraktan kök hash'e kadar olan tüm kanıt yoluna ihtiyacınız vardır. Çatı, bu yol boyunca ara kanıt düğümlerini depolar, böylece hepsinin istemciden programa gönderilmesi gerekmez.

### Eşzamanlı Merkle Ağacını Yapılandırmak için Anahtar Parametreler

Bir geliştirici olarak, ağacın boyutunu, maliyetini ve işleyebileceği eşzamanlı değişiklik sayısını doğrudan etkileyen üç anahtar parametreyi kontrol etmekten sorumlusunuz:

1. **Maksimum Derinlik**
2. **Maksimum Tampon Boyutu**
3. **Çatı Derinliği**

Her bir parametrenin kısa bir özeti.

#### Maksimum Derinlik

**maksimum derinlik**, bir yapraktan ağacın köküne ulaşmak için gereken seviye veya "hops" sayısını belirler. Merkle ağaçları ikili ağaçlar olarak yapılandırıldığından, her yaprak sadece bir diğer yaprakla eşleştiğinden, maksimum derinlik, ağacın total düğüm sayısını şu formül ile hesaplamak için kullanılabilir: `2^maxDepth`.

Aşağıda bir TypeScript fonksiyonu bulunmaktadır:

```typescript
const getMaxDepth = (itemCount: number) => {
  if (itemCount === 0) {
    return 0;
  }
  return Math.ceil(Math.log2(itemCount));
};
```

20 maksimum derinliğe sahip olmak, bir milyondan fazla yaprağa izin verir, bu da NFT'ler gibi büyük veri kümelerini depolamak için uygundur.

#### Maksimum Tampon Boyutu

**maksimum tampon boyutu**, kök hash'i geçerli tutarken bir slot içinde ağaca kaç eşzamanlı güncelleme yapılabileceğini kontrol eder. Standart bir Merkle ağacında, bir slotta yalnızca ilk işlem başarılı olur çünkü bu kök hash'i günceller, bu da tüm sonraki işlemlerin hash uyuşmazlıkları nedeniyle başarısız olmasına neden olur. Ancak, bir eşzamanlı Merkle ağaçlarında, tampon değişikliklerin günlüğünü korur, böylece birden fazla işlem kök hash'i doğru bir şekilde kontrol ederek ağacı eşzamanlı olarak güncelleyebilir. Daha büyük bir tampon boyutu, daha fazla eşzamanlı değişikliğe izin vererek verimliliği artırır.

#### Çatı Derinliği

**çatı derinliği**, belirli bir kanıt yolu için kaç tane kanıt düğümünün onchain depolanacağını belirtir. Ağacın herhangi bir yaprağını doğrulamak için, ağacın katmanlarının her biri için bir kanıt düğümüne ihtiyacınız vardır. Maksimum derinliği 14 olan bir ağaçta toplam 14 kanıt düğümü olacaktır. Her kanıt düğümü, işlemi 32 bayt artırır ve dikkatli yönetilmezse, büyük ağaçlar işlem boyutu limitini aşabilir.

Daha fazla kanıt düğümünün onchain depolanması (daha derin bir çatıya sahip olmak), diğer programların ağaçlarınıza etkileşime girmesine olanak tanır, ancak bu aynı zamanda daha fazla onchain depolama kullanır. Uygun bir çatı derinliği seçerken, ağaçla etkileşimlerin karmaşıklığını göz önünde bulundurun.

### Takasları Dengeleme

Bu üç değer - maksimum derinlik, maksimum tampon boyutu ve çatı derinliği - hepsi takaslarla birlikte gelir. Herhangi birini artırmak, ağacı depolamak için kullanılan hesabı genişletir ve ağacın oluşturulması maliyetini artırır.

- **Maksimum Derinlik:** Depolanması gereken veri miktarına göre belirlenmesi oldukça basittir. Örneğin, her biri bir yaprak olan 1 milyon sıkıştırılmış NFT (cNFT) depolamak istiyorsanız, 20 maksimum derinliğe ihtiyacınız olacaktır (`2^maxDepth > 1 milyon`).
- **Maksimum Tampon Boyutu:** Tampon boyutunu seçmek esasen verimlilik sorusudur - kaç eşzamanlı güncelleme gereklidir? Daha büyük bir tampon, aynı slot içinde daha fazla güncellemeye izin verir.
- **Çatı Derinliği:** Daha derin bir çatı, diğer programların durum sıkıştırılmış programınızla etkileşime girmesini sağlar ve işlem boyutu sınırlarını aşmadan etkileşim sağlar. Çatının atlanması önerilmez, çünkü bu diğer programlar dahil olduğunda işlem boyutu sorunları yaratabilir.

### Durum Sıkıştırılmış Bir Programda Veri Erişimi

Durum sıkıştırılmış bir programda, gerçek veri doğrudan onchain depolanmaz. Bunun yerine, eşzamanlı Merkle ağaç yapısı depolanır, ham veriler ise blockchain'in daha uygun fiyatlı defter durumunda yer alır. Bu, veriye erişimi daha karmaşık hale getirir, ancak imkansız değildir.

Solana defteri, temelde, teorik olarak Genesis bloğuna geri izlenebilen imzalı işlemlerden oluşan bir giriş listesi olarak işlev görür. Bu, bir işlemde her zaman yer alan verinin deftere kaydedildiği anlamına gelir.

:::info
Durum sıkıştırma süreci onchain gerçekleştiğinden, tüm veriler hala defter durumundadır. Teorik olarak, orijinal verileri tekrar oynatarak elde etmek mümkündür, ancak pratikte, verileri takip etmek ve indexlemek için bir indexleyici kullanmak çok daha uygundur (ve biraz karmaşıktır). Bu, verilerin offchain "önbellek" oluşturulmasına olanak tanır ve bu veriler onchain kök hash ile kolayca erişilebilir ve doğrulanabilir.
:::

Bu süreç başlangıçta karmaşık görünse de, uygulama ile daha açık hale gelir.

### Durum Sıkıştırma Araçları

Durum sıkıştırmasının arkasındaki teoriyi anlamak önemli olsa da, tüm bunları baştan sona inşa etmeniz gerekmiyor. Yetenekli mühendisler, süreci basitleştirmek için SPL Durum Sıkıştırma Programı ve Noop Programı gibi temel araçlar geliştirmiştir.

#### SPL Durum Sıkıştırma ve Noop Programları

SPL Durum Sıkıştırma Programı, Solana ekosisteminde eşzamanlı Merkle ağaçlarının yaratımını ve yönetimini sadeleştirmek ve standart hale getirmek için tasarlanmıştır. Merkle ağaçlarını başlatma, ağaç yapraklarını yönetme (veri ekleme, güncelleme veya kaldırma gibi) ve yaprak verilerinin bütünlüğünü doğrulama için Talimat İşleyicileri sağlamaktadır.

Ayrıca, Durum Sıkıştırma Programı, ayrı bir "Noop" programıyla birlikte çalışır. Bir `no-op programı`>) hiçbiri "işlem" anlamına gelir. Solana Noop Programı, verileri defter durumuna kaydeder, ancak bu kaydetme, durum sıkıştırması için önemlidir:

Sıkıştırılmış verileri depoladığınızda, veriler Durum Sıkıştırma Programına gönderilir, veri hash'lenir ve Noop Programına bir "olay" olarak iletilir. Hash, eşzamanlı Merkle ağacında depolanırken, ham verilere Noop Programı'nın işlem günlükleri aracılığıyla erişilebilir.

### Kolay Erişim için Verileri İndeksleme

Genel olarak, onchain verilere erişmek, ilgili hesabı almak kadar basittir. Ancak durum sıkıştırması söz konusu olduğunda, durum o kadar basit değildir.

Daha önce belirtildiği gibi, veriler artık bir hesapta değil defter durumundadır. Tam veriyi bulmanın en erişilebilir yeri, Noop talimatının günlükleridir. Bu veri, defter durumunda süresiz olarak saklanır, ancak belirli bir süre sonra doğrulayıcılar tarafından erişilemez hale gelebilir.

Doğrulayıcılar, alan tasarrufu sağlamak ve performansı artırmak için tüm işlemleri Genesis bloğuna geri kaydetmezler. Noop talimat günlüklerine erişebileceğiniz süre, doğrulayıcılara bağlı olarak değişir. Sonunda, doğrudan erişim sağlarsanız günlükler erişilemez hale gelecektir.

Teorik olarak, işlem durumlarını genesis bloğuna kadar oynatmak mümkündür, ancak bu yöntem çoğu ekip için pratik değildir ve verimli değildir. Bazı RPC sağlayıcıları, sıkıştırılmış NFT'ler ve diğer varlıkları verimli bir şekilde sorgulamak için [Dijital Varlık Standardı (DAS)](https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api) benimsemiştir. Ancak, şu anda DAS, keyfi durum sıkıştırmasını desteklememektedir.

Esasen iki ana seçeneğiniz vardır:

1. Programınız için özel bir indeksleme çözümü yaratmak üzere bir indeksleme sağlayıcısı kullanmak, bu, Noop programına gönderilen olayları izleyecek ve ilgili verileri offchain depolayacaktır.
2. İşlem verilerini offchain depolayan kendi indeksleme çözümünüzü oluşturmak.

Çoğu dApp için, ikinci seçenek pratik bir tercih olabilir. Ancak daha büyük ölçekli uygulamalar, indeksleme ihtiyaçlarını yönetmek için altyapı sağlayıcılarına bağımlı kalabilir.

### Durum Sıkıştırma Geliştirme Süreci

#### Rust Türlerini Oluşturma

Tipik bir Anchor programında, geliştiriciler genellikle hesapları temsil eden Rust türlerini tanımlamaya başlarlar. Ancak, durum sıkıştırılmış bir programda, odak noktası Merkle ağaç yapısına uyum sağlayan türleri tanımlamaya kayar.

Durum sıkıştırmasında, onchain hesabınız esasen Merkle ağacını depolayacaktır. Daha pratik veriler, daha kolay erişim ve yönetim için Noop programına serileştirilip kaydedilecektir. Rust türleriniz, yaprak düğümlerde saklanan tüm verileri ve bu verileri yorumlamak için gerekli olan herhangi bir bağlamsal bilgiyi kapsamalıdır. 

> **Örnek:** Basit bir mesajlaşma programı geliştiriyorsanız, `Message` struct'ınız aşağıdaki gibi görünebilir:

```rust
const DISCRIMINATOR_SIZE: usize = 8;
const PUBKEY_SIZE: usize = 32;

/// İki genel anahtar arasında gönderilen mesajlar için bir günlük girişi.
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MessageLog {
    /// Mesaj kaydı için yaprak düğüm hash'i.
    pub leaf_node: [u8; DISCRIMINATOR_SIZE + PUBKEY_SIZE],
    /// Mesaj göndereninin genel anahtarı.
    pub from: Pubkey,
    /// Mesaj alıcısının genel anahtarı.
    pub to: Pubkey,
    /// Gerçek mesaj içeriği.
    pub message: String,
}

/// Yeni bir `MessageLog` oluşturur.
///
/// # Argümanlar
///
/// * `leaf_node` - Yaprak düğüm hash'ini temsil eden 32 baytlık dizi.
/// * `from` - Mesaj göndereninin genel anahtarı.
/// * `to` - Mesaj alıcısının genel anahtarı.
/// * `message` - Gönderilecek mesaj.
///
/// # Dönüş
///
/// Yeni bir `MessageLog` örneği döner.
pub fn new_message_log(leaf_node: [u8; DISCRIMINATOR_SIZE + PUBKEY_SIZE], from: Pubkey, to: Pubkey, message: String) -> MessageLog {
    MessageLog { leaf_node, from, to, message }
}
```

Açık olmak gerekirse, **`MessageLog` okumak için bir hesap değildir**. Bunun yerine, programınız, bir Hesap İşleyicisinden gelen girdileri kullanarak `MessageLog` örneğini oluşturacaktır, bir hesapta okunan verilerden değil. Sıkıştırılmış hesaplardan veri okumayı daha sonra ele alacağız.

#### Yeni Bir Ağaç Başlatma

Yeni bir Merkle ağacı kurmak için, istemcilerin iki ayrı adım atması gerekir.

1. İlk olarak, Sistem Programını arayarak hesabı ayırmaları gerekir.
2. Ardından, yeni hesabı başlatmak için özel bir program kullanmaları gerekir. Bu başlatma, Merkle ağacı için maksimum derinlik ve tampon boyutunu ayarlamayı içerir.

Başlatma Talimat İşleyicisi, Durum Sıkıştırma Programından `init_empty_merkle_tree` talimatını çağırmak için bir CPI (Cross-Program Invocation) oluşturmalıdır. Bu talimat İşleyicisine maksimum derinlik ve tampon boyutunu argüman olarak sağlamanız gerekecektir.

- **Maksimum derinlik:** Herhangi bir yapraktan ağacın köküne gitmek için gereken maksimum hops sayısını tanımlar.
- **Maksimum tampon boyutu:** Ağaç güncellemeleri için bir değişiklik günlüğü saklamak üzere ayrılan alanı belirtir. Bu değişiklik günlüğü, aynı blok içindeki eşzamanlı güncellemeleri desteklemek için esastır.

Örneğin, kullanıcılar arasında mesajları saklamak için bir ağaç başlatıyorsanız, Talimat İşleyiciniz şöyle görünebilir:

```rust
/// Belirtilen derinlik ve tampon boyutu ile, mesajlar için boş bir Merkle ağacı başlatır.
///
/// Bu fonksiyon, sağlanan yetki ve sıkıştırma programını kullanarak Merkle ağacı hesabını başlatmak için bir CPI (Cross-Program Invocation) çağrısı oluşturur. PDA (Program Türetilmiş Adresi) tohumları, işlemi imzalamak için kullanılır.
///
/// # Argümanlar
///
/// * `ctx` - Merkle ağacının başlatılması için gerekli hesapları içeren bağlam.
/// * `max_depth` - Merkle ağacının maksimum derinliği.
/// * `max_buffer_size` - Merkle ağacının maksimum tampon boyutu.
///
/// # Dönüş
///
/// Bu fonksiyon, başarı veya başarısızlığı gösteren bir `Result<()>` döner.
///
/// # Hatalar
///
/// Bu fonksiyon, `init_empty_merkle_tree` talimatındaki CPI çağrısı başarısız olursa bir hata döndürecektir.
pub fn create_messages_tree(
    ctx: Context<MessageAccounts>,
    max_depth: u32, // Merkle ağacının maksimum derinliği
    max_buffer_size: u32 // Merkle ağacının maksimum tampon boyutu
) -> Result<()> {
    // Merkle ağacı hesabının adresini al
    let merkle_tree = ctx.accounts.merkle_tree.key();

    // PDA'lar imzalamak için tohumları
    let signers_seeds: &[&[&[u8]]] = &[
        &[
            merkle_tree.as_ref(), // Merkle ağaç hesabının adresi
            &[*ctx.bumps.get("tree_authority").unwrap()], // PDA için bump tohumu
        ],
    ];

    // `init_empty_merkle_tree` talimat işleyici için CPI bağlamı oluştur
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.compression_program.to_account_info(), // SPL hesap sıkıştırma programı
        Initialize {
            authority: ctx.accounts.tree_authority.to_account_info(), // PDA kullanarak Merkle ağaçı için yetki
            merkle_tree: ctx.accounts.merkle_tree.to_account_info(), // Başlatılacak Merkle ağaç hesabı
            noop: ctx.accounts.log_wrapper.to_account_info(), // Verileri kaydetmek için noop programı
        },
        signers_seeds // PDA'lar imzalamak için tohumlar
    );

    // Verilen maksimum derinlik ve tampon boyutuyla boş bir Merkle ağacı başlatmak için CPI
    init_empty_merkle_tree(cpi_ctx, max_depth, max_buffer_size)?;

    Ok(())
}

#### Ağaçlara Hash Ekleme

Merkle ağacı başlatıldıktan sonra, ona veri hash'leri eklemeye başlayabilirsiniz. Bu süreç, verileri programınızdaki bir Talimat yöneticisine geçirmeyi içerir; bu, veriyi hash'ler, Noop Programına kaydeder ve ardından State Compression Programı'nın `append` talimatını kullanarak hash'i ağaca ekler. İşte Talimat Yöneticisinin nasıl çalıştığına dair ayrıntılar:

1. **Veriyi Hash'le**: Veriyi hash'lemek için `keccak` crate'indeki `hashv` fonksiyonunu kullanın. Hash'te veri sahibi veya yetkilisini dahil etmeniz önerilir, **böylece yalnızca doğru yetkilinin bunu değiştirmesi sağlanır.**
  
   :::tip
   Unutmayın ki, hashleme sürecinde her zaman verinin yetkili sahiplerinin dahil edilmesi önemlidir. 
   :::tip

2. **Veriyi Kaydet**: Noop Programına kaydetmek istediğiniz veriyi temsil eden bir log nesnesi oluşturun. Ardından, bu nesne ile Noop Programına bir CPI (Cross-Program Invocation) gerçekleştirmek için `wrap_application_data_v1`i çağırın. Bu, sıkıştırılmamış verilerin ihtiyaç duyan her istemciye, örneğin indeksleyicilere, kolay erişilebilir hale gelmesini sağlar. Uygulamanız için veri gözlemleyip indekslemek üzere özel bir istemci de geliştirebilirsiniz.

3. **Hash'i Ekle**: State Compression Programı'nın `append` Talimatına bir CPI oluşturun ve gönderin. Bu, 1. adımda oluşturulan hash'i alacak ve Merkle ağacındaki bir sonraki mevcut yaprağa ekleyecektir. Önceki adımlarda olduğu gibi, bu işlem Merkle ağaç adresi ve ağaç yetkilisi bump'ı için imza tohumları gerektirir.

Mesajlaşma sistemine uygulandığında, ortaya çıkan uygulama şu şekilde görünebilir:

```rust
/// Mesajı Merkle ağacına ekler.
///
/// Bu fonksiyon, mesajı ve gönderenin genel anahtarını hash'ler ve bir yaprak düğümü oluşturur,
/// mesajı noop programını kullanarak kaydeder ve yaprak düğümünü Merkle ağacına ekler.
///
/// # Argümanlar
///
/// * `ctx` - Mesajı eklemek için gereken hesapları içeren bağlam.
/// * `message` - Merkle ağacına eklemek için mesaj.
///
/// # Dönüşler
///
/// Bu fonksiyon, başarı veya başarısızlık belirten bir `Result` döndürür.
///
/// # Hatalar
///
/// Bu fonksiyon, herhangi bir CPI çağrısı (kayıt veya ekleme) başarısız olursa bir hata döndürecektir.
pub fn append_message(ctx: Context, message: String) -> Result {
    // Mesajı + gönderenin genel anahtarını hash'leyerek bir yaprak düğümü oluştur
    let leaf_node = keccak::hashv(&[message.as_bytes(), ctx.accounts.sender.key().as_ref()]).to_bytes();

    // Yaprak düğüm hash'i, gönderen, alıcı ve mesaj kullanarak yeni bir "MessageLog" oluştur
    let message_log = new_message_log(
        leaf_node.clone(),
        ctx.accounts.sender.key().clone(),
        ctx.accounts.recipient.key().clone(),
        message,
    );

    // "MessageLog" verisini noop programını kullanarak kaydet
    wrap_application_data_v1(message_log.try_to_vec()?, &ctx.accounts.log_wrapper)?;

    // Merkle ağaç hesabı adresini al
    let merkle_tree = ctx.accounts.merkle_tree.key();

    // PDA'lar için imza tohumları
    let signers_seeds: &[&[&[u8]]] = &[
        &[
            merkle_tree.as_ref(), // Merkle ağaç hesabının adresi bir tohum olarak
            &[*ctx.bumps.get("tree_authority").unwrap()], // PDA için bump tohumu
        ],
    ];

    // CPI bağlamı oluştur ve yaprak düğümünü Merkle ağacına ekle
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.compression_program.to_account_info(), // SPL hesap sıkıştırma programı
        Modify {
            authority: ctx.accounts.tree_authority.to_account_info(), // PDA kullanarak Merkle ağacı için yetki
            merkle_tree: ctx.accounts.merkle_tree.to_account_info(), // Değiştirilecek Merkle ağaç hesabı
            noop: ctx.accounts.log_wrapper.to_account_info(), // Veri kaydetmek için noop programı
        },
        signers_seeds, // PDA'lar için imza tohumları
    );

    // Yaprak düğümünü Merkle ağacına eklemek için CPI çağrısı
    append(cpi_ctx, leaf_node)?;

    Ok(())
}
```

---

#### Hash'leri Güncelleme

Merkle ağacındaki bir yaprağı güncellemek için, mevcut bir hash'i değiştirmek üzere yeni bir hash üretmeniz gerekecek. Bu süreç dört ana girdi gerektirir:

1. Güncellemek istediğiniz yaprağın indeksi
2. Merkle ağacının kök hash'i
3. Değiştirmek istediğiniz orijinal veri
4. Güncellenmiş veri

Bu girdileri kullanarak, verileri ağaçta başlatırken izlenen adımların benzer bir dizisini takip edebilirsiniz:

1. **Güncelleme Yetkisini Doğrula**: Güncellemeler için özel olan ilk adım, güncellemeyi yapan varlığın yetkisini doğrulamaktır. **Bu genellikle `update` işlemine imza atan kişinin, belirttiğiniz indeksteki yaprağın sahibi veya yetkili olduğunu kontrol etmek anlamına gelir.** Çünkü yapraktaki veri hash'lenmiştir, bu nedenle yetkilinin genel anahtarını saklanan bir değerle doğrudan karşılaştıramazsınız. Bunun yerine, eski verileri ve hesap doğrulama yapısında listelenen `authority`'yi kullanarak önceki hash'i hesaplayın. Ardından, hash'in eşleşip eşleşmediğini doğrulamak için State Compression Programı'nın `verify_leaf` talimatına bir CPI çağrısı yapın.

2. **Yeni Veriyi Hash'le**: Bu adım, veri ekleme sürecindeki hash'leme süreciyle örtüşmektedir. Yeni veriyi ve güncelleme yetkisini hash'lemek için `keccak` crate'indeki `hashv` fonksiyonunu kullanın, her birini karşılık gelen byte temsilimine dönüştürün.

3. **Yeni Veriyi Kaydet**: İlk ekleme işleminde olduğu gibi, yeni veriyi temsil eden bir log nesnesi oluşturun ve Noop Programına bir CPI ile başvurmak için `wrap_application_data_v1` kullanın. Bu, yeni sıkıştırılmamış verinin offchain'de kaydedildiğinden ve erişilebilir olduğundan emin olur.

4. **Mevcut Yaprak Hash'ini Değiştir**: Bu adım, yeni verilerin eklenmesinden biraz farklıdır. Burada, State Compression Programı'nın `replace_leaf` talimatına bir CPI çağrısı yapmanız gerekecektir. Bu işlem, belirtilen yaprak indeksindeki mevcut hash'i yeni hash ile değiştirecektir. Eski hash'i, yeni hash'i ve yaprak indeksini sağlamanız gerekecektir. Her zamanki gibi, imza tohumları olarak Merkle ağaç adresi ve ağaç yetkilisi bump'ı gereklidir.

Güncellemeleri gerçekleştirmek için talimatlar birleştiğinde şu şekilde görünebilir:

```rust
/// Merkle ağacındaki bir mesajı günceller.
///
/// Bu fonksiyon, yaprak düğümünü kontrol ederek Merkle ağacındaki eski mesajı doğrular
/// ve ardından yaprak düğümünü yeni mesajla değiştirir.
///
/// # Argümanlar
///
/// * `ctx` - Mesajı güncellemek için gereken hesapları içeren bağlam.
/// * `index` - Güncellenmesi gereken yaprak düğümünün indeksi.
/// * `root` - Merkle ağacının kök hash'i.
/// * `old_message` - Merkle ağacında mevcut olan eski mesaj.
/// * `new_message` - Eski mesajı değiştirecek yeni mesaj.
///
/// # Dönüşler
///
/// Bu fonksiyon, başarı veya başarısızlık belirten bir `Result` döndürür.
///
/// # Hatalar
///
/// Bu fonksiyon, Merkle ağacı yaprağının doğrulanması veya değiştirilmesi sırasında hata döndürecektir.
pub fn update_message(
    ctx: Context,
    index: u32,
    root: [u8; 32],
    old_message: String,
    new_message: String
) -> Result {
    // Eski mesaj + gönderenin genel anahtarını hash'leyerek eski yaprak düğümünü oluştur
    let old_leaf = keccak::hashv(&[old_message.as_bytes(), ctx.accounts.sender.key().as_ref()]).to_bytes();

    // Merkle ağaç hesabı adresini al
    let merkle_tree = ctx.accounts.merkle_tree.key();

    // PDA'lar için imza tohumları
    let signers_seeds: &[&[&[u8]]] = &[
        &[
            merkle_tree.as_ref(), // Merkle ağaç hesabının adresi bir tohum olarak
            &[*ctx.bumps.get("tree_authority").unwrap()], // PDA için bump tohumu
        ],
    ];

    // Merkle ağacındaki eski yaprak düğümünü doğrula
    {
        // Eski ve yeni mesajlar aynıysa, güncellemeye gerek yok
        if old_message == new_message {
            msg!("Mesajlar aynı!");
            return Ok(());
        }

        // Yaprak düğümünü doğrulamak için CPI bağlamı oluştur
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.compression_program.to_account_info(), // SPL hesap sıkıştırma programı
            VerifyLeaf {
                merkle_tree: ctx.accounts.merkle_tree.to_account_info(), // Doğrulanacak Merkle ağaç hesabı
            },
            signers_seeds, // PDA'lar için imza tohumları
        );

        // Merkle ağacındaki eski yaprak düğümünü doğrula
        verify_leaf(cpi_ctx, root, old_leaf, index)?;
    }

    // Yeni mesaj + gönderenin genel anahtarını hash'leyerek yeni yaprak düğümünü oluştur
    let new_leaf = keccak::hashv(&[new_message.as_bytes(), ctx.accounts.sender.key().as_ref()]).to_bytes();

    // Yeni mesajı indeksleyiciler için noop programını kullanarak kaydet
    let message_log = new_message_log(
        new_leaf.clone(),
        ctx.accounts.sender.key().clone(),
        ctx.accounts.recipient.key().clone(),
        new_message,
    );
    wrap_application_data_v1(message_log.try_to_vec()?, &ctx.accounts.log_wrapper)?;

    // Eski yaprağı yeni yaprak ile Merkle ağacında değiştir
    {
        // Yaprak düğümünü değiştirmek için CPI bağlamı oluştur
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.compression_program.to_account_info(), // SPL hesap sıkıştırma programı
            Modify {
                authority: ctx.accounts.tree_authority.to_account_info(), // PDA kullanarak Merkle ağacı için yetki
                merkle_tree: ctx.accounts.merkle_tree.to_account_info(), // Değiştirilecek Merkle ağaç hesabı
                noop: ctx.accounts.log_wrapper.to_account_info(), // Veri kaydetmek için noop programı
            },
            signers_seeds, // PDA'lar için imza tohumları
        );

        // Eski yaprak düğümünü yeni olanla Merkle ağacında değiştir
        replace_leaf(cpi_ctx, root, old_leaf, new_leaf, index)?;
    }

    Ok(())
}
```

---

#### Hash'leri Silme

Şu anda, State Compression Programı'nın özel bir `delete` talimatı yoktur. 

Bunun yerine, "silinmiş" olduğunu belirten bir değerle yaprak verisini güncelleyerek silinmeyi simüle edebilirsiniz. 

Seçtiğiniz tam değer, belirli kullanım durumunuza ve güvenlik gereksinimlerinize bağlı olacaktır. Bazı durumlarda, tüm veri alanlarını sıfıra ayarlamak gerekebilirken, diğerleri "silinmiş" olarak işaretlemek için önceden tanımlanmış bir statik string depolamayı tercih edebilir. **Bu yaklaşım, uygulamanızın ihtiyaçlarına uygun bir şekilde silmeleri yönetmenizi sağlar ve veri bütünlüğünü tehlikeye atmaz.**

---

#### İstemciden Veriye Erişim

Durum sıkıştırmasında veri oluşturma, güncelleme ve silme konularını ele aldık, ancak veriyi okuma kendine özgü zorluklar sunar. 

Bir istemciden sıkıştırılmış verilere erişmek, Merkle ağacının yalnızca veri hash'lerini depolaması nedeniyle zor olabilir ve bu hash'ler orijinal verileri geri almak için kullanılamaz. Ayrıca, Noop programına kaydedilen sıkıştırılmamış veri sonsuza kadar saklanmaz.

Bu veriye erişmek için genellikle iki seçeneğiniz vardır:

1. **Özelleştirilmiş bir çözüm geliştirmek için bir indeksleme sağlayıcısı ile çalışmak**: Bu, istemci tarafında veri almak ve erişmek için kod yazmanıza olanak tanır; nasıl indeksleyicinin sunduğuna bağlıdır.
2. **Veriyi saklamak ve geri almak için kendi sahte indeksleyicinizi oluşturmak**: Bu, daha hafif bir çözüm sunar.

Projeniz merkeziyetsizse ve ön yüzünüzün ötesinde geniş etkileşim bekliyorsanız, 2. seçenek yeterli olmayabilir. Ancak, çoğu program etkileşimi üzerinde kontrol sahibiyseniz, bu yaklaşım işleyebilir.

Burada tek tip bir çözüm yoktur. İki olası strateji şunlardır:

1. **Ham veriyi depolamak**: Bir yaklaşım, ham veriyi bir veritabanında aynı anda göndermek yoluyla saklamaktır. **Bu, verilerin kaydını ve verinin hash'lenip saklandığı Merkle ağaç yaprağını tutmanızı sağlar.**

2. **Bir işlem gözlemci oluşturmak**: Diğer bir yaklaşım, programınızın yürüttüğü işlemleri gözlemleyen bir sunucu oluşturmaktır. Bu sunucu, işlemleri alır, ilişkili Noop loglarını kullanarak bunları çözer ve veriyi saklar.

Laboratuvar ortamında test yazarken, bu iki yaklaşımı da simüle edeceğiz; ancak bir veritabanı yerine test süresi boyunca veri bellekte saklanacaktır.

Bunu ayarlama süreci biraz karmaşık olabilir. **Belirli bir işlem için, RPC sağlayıcısından geriye alır, Noop programıyla ilişkili iç talimatları çıkarır ve `@solana/spl-account-compression` JS paketindeki `deserializeApplicationDataEvent` fonksiyonunu kullanarak logları çözümleriz. Ardından, verileri çözmek için Borsh kullanacağız. İşte bu süreci gösteren mesajlaşma programından bir örnek:**

```typescript
export async function getMessageLog(
  connection: Connection,
  txSignature: string,
) {
  // İşlemi onayla, aksi takdirde getTransaction bazen null döndürür
  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: txSignature,
  });

  // İşlem bilgisini tx imzası kullanarak al
  const txInfo = await connection.getTransaction(txSignature, {
    maxSupportedTransactionVersion: 0,
  });

  // 0. indeksteki program talimatıyla ilişkili iç talimatları al
  // Test işlemi sırasında yalnızca bir talimat gönderdiğimiz için, ilkinin doğru olduğunu varsayabiliriz
  const innerIx = txInfo!.meta?.innerInstructions?.[0]?.instructions;

  // SPL_NOOP_PROGRAM_ID ile eşleşen iç talimatları al
  const noopInnerIx = innerIx.filter(
    instruction =>
      txInfo?.transaction.message.staticAccountKeys[
        instruction.programIdIndex
      ].toBase58() === SPL_NOOP_PROGRAM_ID.toBase58(),
  );

  let messageLog: MessageLog;
  for (let i = noopInnerIx.length - 1; i >= 0; i--) {
    try {
      // Talimat verilerini çözmeye ve geri çözmeye çalış
      const applicationDataEvent = deserializeApplicationDataEvent(
        Buffer.from(bs58.decode(noopInnerIx[i]?.data!)),
      );

      // Uygulama verilerini al
      const applicationData = applicationDataEvent.fields[0].applicationData;

      // Uygulama verilerini MessageLog örneğine geri çözümler
      messageLog = deserialize(
        MessageLogBorshSchema,
        MessageLog,
        Buffer.from(applicationData),
      );

      if (messageLog !== undefined) {
        break;
      }
    } catch (__) {}
  }

  return messageLog;
}
```

---

### Sonuç

Genelleştirilmiş durum sıkıştırmasının uygulanması zorlayıcı olabilir, ancak mevcut araçlar kullanılarak tamamen başarılabilir. Ekosistem geliştikçe, bu araçlar ve programlar daha da iyileşecektir ve süreç daha akıcı hale gelecektir. Geliştirme deneyiminizi artıran çözüm bulursanız, lütfen bunları toplulukla paylaşmaktan çekinmeyin!

## Laboratuvar: Genel Durum Sıkıştırması ile Not Alma Uygulaması Geliştirme

Bu laboratuvar sırasında, özelleştirilmiş durum sıkıştırmasını kullanan bir Anchor programı geliştirme sürecine adım adım göz atacağız. **Bu, sıkıştırılmış verilerle çalışma konusunda pratik deneyim kazandıracak ve Solana'daki durum sıkıştırmasıyla ilgili anahtar kavramları pekiştirmeye yardımcı olacaktır.**

#### 1. Projeyi Ayarlama

Öncelikle bir Anchor programı başlatın:

```bash
anchor init compressed-notes
```

Ardından, `cpi` özelliği etkinleştirilmiş `spl-account-compression` crate'ini ekleyeceğiz. Bunu yapmak için, `programs/compressed-notes` dizininde bulunan `Cargo.toml` dosyasını güncelleyerek aşağıdaki bağımlılığı ekleyin:

```toml
[dependencies]
anchor-lang = "0.28.0"
spl-account-compression = { version="0.2.0", features = ["cpi"] }
solana-program = "1.16.0"
```

Testleri yerel olarak çalıştıracağız, ancak bunun için hem State Compression Programı hem de Noop Programına Mainnet'ten ihtiyacımız olacak. Bu programların yerel kümemizde mevcut olduğundan emin olmak için, kök dizininde bulunan `Anchor.toml` dosyasında bunları eklememiz gerekiyor. İşte nasıl ekleyeceğiniz:

`Anchor.toml` dosyasındaki programlar bölümünü şu şekilde güncelleyin:

```toml
[test.validator]
url = "https://api.mainnet-beta.solana.com"

[[test.validator.clone]]
address = "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV"

[[test.validator.clone]]
address = "cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK"
```

Son olarak, demo için `lib.rs` dosyasını ayarlayalım. Öncelikle `initialize` talimatını ve `Initialize` hesaplar yapısını kaldırdıktan sonra gerekli ithalatları ekleyin, **_sizin_** program ID'nizi dahil etmeyi unutmayın.

```rust
use anchor_lang::{
    prelude::*,
    solana_program::keccak,
};
use spl_account_compression::{
    Noop,
    program::SplAccountCompression,
    cpi::{
        accounts::{Initialize, Modify, VerifyLeaf},
        init_empty_merkle_tree, verify_leaf, replace_leaf, append,
    },
    wrap_application_data_v1,
};

// Program ID'nizi buraya yerleştirin
declare_id!("PROGRAM_PUBLIC_KEY_GOES_HERE");

/// Verimli depolama ve doğrulama için Merkle ağacı kullanarak sıkıştırılmış notları yöneten bir program.
#[program]
pub mod compressed_notes {
    use super::*;

    // Program talimatları burada tanımlayın.

    /// Mesajları depolamak için yeni bir Merkle ağacı başlatır.
    ///
    /// Bu fonksiyon, belirtilen maksimum derinlik ve tampon boyutuna sahip bir Merkle ağacı oluşturur.
    ///
    /// # Argümanlar
    ///
    /// * `ctx` - Ağacı başlatmak için gereken hesapları içeren bağlam.
    /// * `max_depth` - Merkle ağacının maksimum derinliği.
    /// * `max_buffer_size` - Merkle ağacının maksimum tampon boyutu.
    pub fn create_messages_tree(
        ctx: Context,
        max_depth: u32,
        max_buffer_size: u32,
    ) -> Result {
        // Ağaç oluşturma mantığı burada
        Ok(())
    }

    /// Merkle ağacına yeni bir mesaj ekler.
    ///
    /// Bu fonksiyon, mesajı hash'leyerek ağaca bir yaprak düğümü olarak ekler.
    ///
    /// # Argümanlar
    ///
    /// * `ctx` - Mesajı eklemek için gereken hesapları içeren bağlam.
    /// * `message` - Merkle ağacına eklenmesi gereken mesaj.
    pub fn append_message(ctx: Context, message: String) -> Result {
        // Mesaj ekleme mantığı burada
        Ok(())
    }

    /// Merkle ağacındaki mevcut bir mesajı günceller.
    ///
    /// Bu fonksiyon, eski mesajı doğrular ve ağacındaki yeni mesajla değiştirir.
    ///
    /// # Argümanlar
    ///
    /// * `ctx` - Mesajı güncellemek için gereken hesapları içeren bağlam.
    /// * `index` - Ağacın içindeki mesajın indeksi.
    /// * `root` - Merkle ağacının kökü.
    /// * `old_message` - Değiştirilecek eski mesaj.
    /// * `new_message` - Eski mesajı değiştirecek yeni mesaj.
    pub fn update_message(
        ctx: Context,
        index: u32,
        root: [u8; 32],
        old_message: String,
        new_message: String,
    ) -> Result {
        // Mesaj güncelleme mantığı burada
        Ok(())
    }

    // Gerektiği gibi daha fazla fonksiyon ekleyin
}

// Hesaplar, durum vb. için yapıların eklenmesi burada

/// Mesaj işlemleri için gereken hesap bilgilerini tutan yapı.

# MessageAccounts Yapısı

```rust
#[derive(Accounts)]
pub struct MessageAccounts<'info> {
    /// Merkle ağacı hesabı.
    #[account(mut)]
    pub merkle_tree: AccountInfo<'info>,
    /// Merkle ağacı için yetki.
    pub tree_authority: AccountInfo<'info>,
    /// Gönderenin hesabı.
    pub sender: Signer<'info>,
    /// Alıcının hesabı.
    pub recipient: AccountInfo<'info>,
    /// Sıkıştırma programı (Noop programı).
    pub compression_program: Program<'info, SplAccountCompression>,
    /// Veri kaydı için günlük sarmalayıcı hesabı.
    pub log_wrapper: AccountInfo<'info>,
}
```

Önümüzdeki bu demoda, `lib.rs` dosyasında doğrudan güncellemeler yapacağız. Bu yaklaşım açıklamaları basitleştirir. Yapılandırmayı gerektiği gibi değiştirebilirsiniz.

:::tip 
Projenizi şimdi oluşturmak iyi bir fikirdir, böylece ortamınızın doğru ayarlandığını teyit edebilir ve gelecekte derleme sürelerini azaltabilirsiniz.
:::

## 2. `Note` Şemasını Tanımlayın

Sonraki adımda, programımız içinde bir notun yapısını tanımlayacağız. Her notun aşağıdaki özelliklere sahip olması gerekir:

- `leaf_node` - Yaprağın üzerinde depolanan hash'i temsil eden 32 baytlık dizi.
- `owner` - Notun sahibinin kamusal anahtarı.
- `note` - Notun metnini içeren bir dize.

```rust
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
/// Not için Merkle ağacındaki bir günlük kaydını temsil eden bir yapı.
pub struct NoteLog {
    /// Not verilerinden oluşturulan yaprak düğüm hash'i.
    pub leaf_node: [u8; 32],
    /// Notun sahibinin kamusal anahtarı.
    pub owner: Pubkey,
    /// Notun içeriği.
    pub note: String,
}

/// Verilen yaprak düğümü, sahip ve not mesajından yeni bir not günlüğü oluşturur.
///
/// # Argümanlar
///
/// * `leaf_node` - Notun hash'ini temsil eden 32 baytlık dizi.
/// * `owner` - Notun sahibinin kamusal anahtarı.
/// * `note` - Not mesajı içeriği.
///
/// # Dönüş
///
/// Sağlanan verileri içeren yeni bir `NoteLog` yapısı.
pub fn create_note_log(leaf_node: [u8; 32], owner: Pubkey, note: String) -> NoteLog {
    NoteLog { leaf_node, owner, note }
}
```

:::info
Geleneksel bir Anchor programında, bir not genellikle `account` makrosunu kullanan bir `Note` yapısı ile temsil edilir. Ancak, durum sıkıştırması kullandığımız için `AnchorSerialize` makrosu uygulanan `NoteLog` yapısını kullanıyoruz.
:::

## 3. Hesap Kısıtlamalarını Tanımlayın

Tüm işlem işleyicilerimiz aynı
[hesap kısıtlamaları](https://www.anchor-lang.com/docs/account-constraints):

- `owner` - Notun yaratıcısı ve sahibi, işlemi imzalamalıdır.
- `tree_authority` - Merkle ağacının yetkisi, sıkıştırma ile ilgili CPIs'yi imzalamada kullanılır.
- `merkle_tree` - Not hash'lerinin depolandığı Merkle ağacının adresi; bu, Durum Sıkıştırma Programı tarafından doğrulandığı için kontrol edilmeyecek.
- `log_wrapper` - Noop Programının adresi.
- `compression_program` - Durum Sıkıştırma Programının adresi.

```rust
#[derive(Accounts)]
/// Not yönetimi için Merkle ağacı ile etkileşimde bulunmak için gerekli hesaplar.
pub struct NoteAccounts<'info> {
    /// İşlem için ödeyici, aynı zamanda notun sahibidir.
    #[account(mut)]
    pub owner: Signer<'info>,

    /// Merkle ağacı için PDA (Program Türevli Adres) yetkisi.
    /// Bu hesap yalnızca imzalamak için kullanılır ve Merkle ağacı adresinden türetilmiştir.
    #[account(
        seeds = [merkle_tree.key().as_ref()],
        bump,
    )]
    pub tree_authority: SystemAccount<'info>,

    /// Notların depolandığı Merkle ağaç hesabı.
    /// Bu hesap, SPL Hesap Sıkıştırma programı tarafından doğrulanmaktadır.
    ///
    /// Hesabın doğrulaması CPI'ye ertelendiği için `UncheckedAccount` türü kullanılır.
    #[account(mut)]
    pub merkle_tree: UncheckedAccount<'info>,

    /// Veri kaydı için kullanılan Noop programı.
    /// Bu, SPL Hesap Sıkıştırma yığınının bir parçasıdır ve not işlemlerini kaydeder.
    pub log_wrapper: Program<'info, Noop>,

    /// Merkle ağaç işlemleri için kullanılan SPL Hesap Sıkıştırma programı.
    pub compression_program: Program<'info, SplAccountCompression>,
}
```

## 4. `create_note_tree` İşlem İşleyicisini Oluşturun

Sonraki adımda, zaten tahsis edilmiş Merkle ağaç hesabını başlatmak için `create_note_tree` işlem işleyicisini oluşturacağız.

Bunu uygulamak için, Durum Sıkıştırma Programı'ndan `init_empty_merkle_tree` işlemini çağırmak için bir CPI oluşturmanız gerekecek. `NoteAccounts` yapısı gerekli hesapları sağlayacak, ancak iki ek argümanı da dahil etmeniz gerekecek:

1. **`max_depth`** - Merkle ağacının maksimum derinliğini belirtir ve herhangi bir yapraktan köke kadar en uzun yolu belirtir.
2. **`max_buffer_size`** - Merkle ağacının maksimum tampon boyutunu tanımlar ve bu, ağaç güncellemelerini kaydetmek için tahsis edilen alanı belirler. Bu tampon, aynı blok içinde eşzamanlı güncellemeleri desteklemek için kritik önem taşır.

```rust
#[program]
pub mod compressed_notes {
    use super::*;

    /// Sıkıştırılmış notları depolamak için yeni bir not ağacı (Merkle ağacı) oluşturma işlemi.
    ///
    /// # Argümanlar
    /// * `ctx` - Bu işlem için gerekli hesapları içeren bağlam.
    /// * `max_depth` - Merkle ağacının maksimum derinliği.
    /// * `max_buffer_size` - Merkle ağacının maksimum tampon boyutu.
    ///
    /// # Dönüş
    /// * `Result<()>` - Başarı veya hata sonucu döner.
    pub fn create_note_tree(
        ctx: Context<NoteAccounts>,
        max_depth: u32,       // Merkle ağacının maksimum derinliği
        max_buffer_size: u32, // Merkle ağacının maksimum tampon boyutu
    ) -> Result<()> {
        // Merkle ağaç hesabının adresini al
        let merkle_tree = ctx.accounts.merkle_tree.key();

        // PDA'ların imzalama için tohumları
        let signers_seeds: &[&[&[u8]]] = &[&[
            merkle_tree.as_ref(), // Tohum olarak Merkle ağaç hesabı adresi
            &[*ctx.bumps.get("tree_authority").unwrap()], // Ağaç yetkisi PDA'sı için bump tohumu
        ]];

        // Boş Merkle ağacını başlatmak için CPI (Programlar Arası Çağrı) bağlamı oluştur.
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.compression_program.to_account_info(), // SPL Hesap Sıkıştırma programı
            Initialize {
                authority: ctx.accounts.tree_authority.to_account_info(), // Merkle ağacı için PDA yetkisi
                merkle_tree: ctx.accounts.merkle_tree.to_account_info(),  // Merkle ağaç hesabı
                noop: ctx.accounts.log_wrapper.to_account_info(),        // Veri kaydı için Noop programı
            },
            signers_seeds, // PDA'ların imzalama için tohumları
        );

        // Belirtilen derinlik ve tampon boyutu ile boş bir Merkle ağacını başlatmak için CPI çağrısı.
        init_empty_merkle_tree(cpi_ctx, max_depth, max_buffer_size)?;

        Ok(())
    }

    // Program için diğer fonksiyonlar burada yer alabilir...
}
```

:::warning
CPI'nizi kurarken, Merkle ağaç adresini ve ağaç yetkisi bump'ını imzacı tohumlarıyla dahil etmeyi unutmayın.
:::

## 5. `append_note` İşlem İşleyicisini Oluşturun

Şimdi `append_note` işlem işleyicisini oluşturalım. Bu işlem, bir ham notu hash'leyip Merkle ağacında depolarken, verilerin Noop programına kaydedildiğinden emin olacaktır.

Bunu başarmak için:

1. **Verileri Hash'le**: Notu ve sahibinin kamusal anahtarını hash'lemek için `keccak` kütüphanesindeki `hashv` fonksiyonunu kullanın. İkisini de byte temsil biçimlerine dönüştürmeniz gerekecek. Sahibi hash'lemek, güncellemeler sırasında sahiplik doğrulaması için gereklidir.

2. **Verileri Kaydet**: 1. adımdan elde edilen hash ile, sahibin kamusal anahtarı ve notu `String` olarak içeren bir `NoteLog` örneği oluşturun. Daha sonra, bu `NoteLog` örneğini kullanarak verileri Noop programına göndermek için `wrap_application_data_v1` fonksiyonunu kullanın. Bu, tam notu (sadece hash değil) istemcilere sunar; indeksleyicilerin cNFT'ler ile yönettiği gibi. Ayrıca, uygulamanıza özel indeksleyici işlevselliğini simüle etmek için bir gözlemci istemcisi geliştirebilirsiniz.

3. **Merkle Ağacına Ekleyin**: Durum Sıkıştırma Programı'nın `append` işleminin CPI'sini oluşturun ve gönderin. Bu, 1. adımdan elde edilen hash'i Merkle ağacınızdaki bir sonraki mevcut yaprağa ekleyecektir. Merkle ağaç adresinin ve ağaç yetkisi bump'ının imzacı tohumları olarak dahil edildiğinden emin olun.

```rust
#[program]
pub mod compressed_notes {
    use super::*;

    //...

    /// Merkle ağacına bir not ekleme işlemi.
    ///
    /// # Argümanlar
    /// * `ctx` - Bu işlem için gerekli hesapları içeren bağlam.
    /// * `note` - Merkle ağaçında yaprak düğümü olarak eklenecek not mesajı.
    ///
    /// # Dönüş
    /// * `Result<()>` - Başarı veya hata sonucu döner.
    pub fn append_note(ctx: Context<NoteAccounts>, note: String) -> Result<()> {
        // Adım 1: Merkle ağacı için bir yaprak düğümü oluşturmak üzere not mesajını hash'le
        let leaf_node = keccak::hashv(&[note.as_bytes(), ctx.accounts.owner.key().as_ref()]).to_bytes();

        // Adım 2: Yaprak düğümü, sahibi ve not içeren yeni bir NoteLog örneği oluştur
        let note_log = NoteLog::new(leaf_node.clone(), ctx.accounts.owner.key().clone(), note);

        // Adım 3: Noop programını kullanarak NoteLog verilerini kaydet
        wrap_application_data_v1(note_log.try_to_vec()?, &ctx.accounts.log_wrapper)?;

        // Adım 4: Merkle ağaç hesabı anahtarını (adresini) al
        let merkle_tree = ctx.accounts.merkle_tree.key();

        // Adım 5: PDA'ların imzalama için tohumları
        let signers_seeds: &[&[&[u8]]] = &[&[
            merkle_tree.as_ref(), // Tohum olarak Merkle ağaç hesabı adresi
            &[*ctx.bumps.get("tree_authority").unwrap()], // PDA için bump tohumu
        ]];

        // Adım 6: Merkle ağacını değiştirmek için CPI (Programlar Arası Çağrı) bağlamı oluştur
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.compression_program.to_account_info(), // SPL Hesap Sıkıştırma programı
            Modify {
                authority: ctx.accounts.tree_authority.to_account_info(), // PDA yetkisi
                merkle_tree: ctx.accounts.merkle_tree.to_account_info(),  // Değiştirilmekte olan Merkle ağaç hesabı
                noop: ctx.accounts.log_wrapper.to_account_info(),        // Veri kaydı için Noop programı
            },
            signers_seeds, // Bu işlemi imzalayacak PDA'lar için tohumlar
        );

        // Adım 7: Merkle ağacına CPI kullanarak yaprak düğümünü ekle
        append(cpi_ctx, leaf_node)?;

        Ok(())
    }

    //...
}
```

## 6. `update_note` İşlem İşleyicisini Oluşturun

Uygulayacağımız son işlem `update_note` olacak, bu işlem mevcut bir yaprağı güncellenmiş not verilerini temsil eden yeni bir hash ile değiştirir.

Bu güncellemeyi gerçekleştirmek için aşağıdaki parametreler gereklidir:

1. **İndeks**: Güncellenecek yaprağın indeksi.
2. **Kök**: Doğrulama için Merkle ağacının kök hash'i.
3. **Eski Not**: Güncellenen notun dize temsili.
4. **Yeni Not**: Eski notu değiştirecek yeni notun dize temsili.

Bu işlem süreci, `append_note` ile benzerdir, ancak bazı ek adımları içerir:

1. **Sahipliği Doğrula**: Güncellemeyi gerçekleştirmeden önce, bu işlemi gerçekleştiren `owner`'ın belirtilen indeksteki yaprağın gerçek sahibi olduğunu kanıtlayın. Yaprak verileri bir hash olarak sıkıştırıldığı için, doğrudan `owner`'ın kamusal anahtarı ile karşılaştırma yapamazsınız. Bunun yerine, eski not verileri ve hesap doğrulama yapısından elde edilen `owner` ile önceki hash'i hesaplayın. Ardından, bu hesaplanan hash'i kullanarak Durum Sıkıştırma Programı'nın `verify_leaf` işlemine bir CPI oluşturun ve gönderin.

2. **Yeni Veriyi Hash'le**: Yeni not ve sahibinin kamusal anahtarını `keccak` kütüphanesinin `hashv` fonksiyonunu kullanarak hash'leyin, her birini byte temsil biçimlerine dönüştürün.

3. **Yeni Veriyi Kaydet**: 2. adımdan elde edilen yeni hash, sahibinin kamusal anahtarı ve yeni not ile birlikte bir `NoteLog` örneği oluşturun. Bu `NoteLog` örneğini kullanarak verileri Noop programına göndermek için `wrap_application_data_v1` fonksiyonunu çağırın, böylece güncellenmiş not verisi istemcilere erişilebilir hale gelir.

4. **Yaprağı Değiştir**: Durum Sıkıştırma Programı'nın `replace_leaf` işlemini oluşturun ve gönderin. Bu, belirtilen yaprak indeksinde eski hash'i yeni hash ile değiştirecektir. Merkle ağacı adresinin ve ağaç yetkisi bump'ının imzacı tohumları olarak dahil edildiğinden emin olun.

```rust
#[program]
pub mod compressed_notes {
    use super::*;

    //...

    /// Merkle ağacında bir notu güncelleme işlemi.
    ///
    /// # Argümanlar
    /// * `ctx` - Bu işlem için gerekli hesapları içeren bağlam.
    /// * `index` - Merkle ağacında güncellenecek notun indeksi.
    /// * `root` - Doğrulama için Merkle ağacının kök hash'i.
    /// * `old_note` - Güncellenen mevcut not.
    /// * `new_note` - Eski notun yerini alacak yeni not.
    ///
    /// # Dönüş
    /// * `Result<()>` - Başarı veya hata sonucu döner.
    pub fn update_note(
        ctx: Context<NoteAccounts>,
        index: u32,
        root: [u8; 32],
        old_note: String,
        new_note: String,
    ) -> Result<()> {
        // Adım 1: Eski notu hash'leyerek karşılık gelen yaprak düğümünü oluştur
        let old_leaf = keccak::hashv(&[old_note.as_bytes(), ctx.accounts.owner.key().as_ref()]).to_bytes();

        // Adım 2: Merkle ağaç hesabının adresini al
        let merkle_tree = ctx.accounts.merkle_tree.key();

        // Adım 3: PDA'ların imzalama için tohumları
        let signers_seeds: &[&[&[u8]]] = &[&[
            merkle_tree.as_ref(), // Tohum olarak Merkle ağaç hesabı adresi
            &[*ctx.bumps.get("tree_authority").unwrap()], // PDA için bump tohumu
        ]];

        // Adım 4: Eski not ile yeni notun aynı olup olmadığını kontrol et
        if old_note == new_note {
            msg!("Notlar aynı!");
            return Ok(());
        }

        // Adım 5: Merkle ağacındaki yaprak düğümünü doğrula
        let verify_cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.compression_program.to_account_info(), // SPL hesap sıkıştırma programı
            VerifyLeaf {
                merkle_tree: ctx.accounts.merkle_tree.to_account_info(), // Değiştirilmekte olan Merkle ağaç hesabı
            },
            signers_seeds, // PDA'ların imzalama için tohumları
        );
        // Doğrula veya hata al
        verify_leaf(verify_cpi_ctx, root, old_leaf, index)?;

        // Adım 6: Yeni notu hash'leyerek yeni yaprak düğümünü oluştur
        let new_leaf = keccak::hashv(&[new_note.as_bytes(), ctx.accounts.owner.key().as_ref()]).to_bytes();

        // Adım 7: Yeni not için bir NoteLog girişi oluştur
        let note_log = NoteLog::new(new_leaf.clone(), ctx.accounts.owner.key().clone(), new_note);

        // Adım 8: Noop programını kullanarak NoteLog verilerini kaydet
        wrap_application_data_v1(note_log.try_to_vec()?, &ctx.accounts.log_wrapper)?;

        // Adım 9: Eski yaprak düğümünü yeni ile değiştirmek için hazırlık yap
        let modify_cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.compression_program.to_account_info(), // SPL hesap sıkıştırma programı
            Modify {
                authority: ctx.accounts.tree_authority.to_account_info(), // Merkle ağacı için PDA yetkisi
                merkle_tree: ctx.accounts.merkle_tree.to_account_info(), // Değiştirilecek Merkle ağaç hesabı
                noop: ctx.accounts.log_wrapper.to_account_info(), // Veri kaydı için Noop programı
            },
            signers_seeds, // İmza için PDA'ların tohumları
        );

        // Adım 10: Eski yaprak düğümünü Merkle ağacında yeni yaprak düğümü ile değiştir
        replace_leaf(modify_cpi_ctx, root, old_leaf, new_leaf, index)?;

        Ok(())
    }
}
``` 

#### 7. İstemci Test Kurulumu

Programımızın doğru çalıştığından emin olmak için bazı testler kuracağız ve yazacağız. Kurulum için yapmanız gerekenler:

1. **Bağımlılıkları Yükleyin**: Testlerimiz için `@solana/spl-account-compression` paketini kullanacağız. Bunu aşağıdaki komut ile yükleyin:

   ```bash
   yarn add @solana/spl-account-compression
   ```

2. **Yardımcı Dosyası Oluşturun**: Test etmeyi kolaylaştırmak için bir yardımcı dosya sağladık. `tests` dizininde `utils.ts` dosyasını oluşturun ve sağlanan içeriği ekleyin. Bu dosyanın detaylarına kısa süre içinde değineceğiz.

   ```typescript
   import {
     SPL_NOOP_PROGRAM_ID,
     deserializeApplicationDataEvent,
   } from "@solana/spl-account-compression";
   import { Connection, PublicKey } from "@solana/web3.js";
   import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
   import { deserialize } from "borsh";
   import { keccak256 } from "js-sha3";

   class NoteLog {
     leafNode: Uint8Array;
     owner: PublicKey;
     note: string;

     constructor(properties: {
       leafNode: Uint8Array;
       owner: Uint8Array;
       note: string;
     }) {
       this.leafNode = properties.leafNode;
       this.owner = new PublicKey(properties.owner);
       this.note = properties.note;
     }
   }

   // Borsh deserialization için Not yapısını tanımlayan bir harita
   const NoteLogBorshSchema = new Map([
     [
       NoteLog,
       {
         kind: "struct",
         fields: [
           ["leafNode", [32]], // 32 `u8` dizisi
           ["owner", [32]], // Pubkey
           ["note", "string"],
         ],
       },
     ],
   ]);

   export function getHash(note: string, owner: PublicKey) {
     const noteBuffer = Buffer.from(note);
     const publicKeyBuffer = Buffer.from(owner.toBytes());
     const concatenatedBuffer = Buffer.concat([noteBuffer, publicKeyBuffer]);
     const concatenatedUint8Array = new Uint8Array(
       concatenatedBuffer.buffer,
       concatenatedBuffer.byteOffset,
       concatenatedBuffer.byteLength,
     );
     return keccak256(concatenatedUint8Array);
   }

   export async function getNoteLog(connection: Connection, txSignature: string) {
     // İşlemi onaylayın, aksi takdirde getTransaction bazen null döner
     const latestBlockHash = await connection.getLatestBlockhash();
     await connection.confirmTransaction({
       blockhash: latestBlockHash.blockhash,
       lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
       signature: txSignature,
     });

     // İşlem imzasını kullanarak işlem bilgilerini alın
     const txInfo = await connection.getTransaction(txSignature, {
       maxSupportedTransactionVersion: 0,
     });

     // 0. indeksteki program talimatıyla ilgili iç talimatları alın
     // Test işlemi sırasında yalnızca bir talimat gönderdiğimiz için ilk talimatı varsayabiliriz
     const innerIx = txInfo!.meta?.innerInstructions?.[0]?.instructions;

     // SPL_NOOP_PROGRAM_ID'ye uyan iç talimatları alın
     const noopInnerIx = innerIx.filter(
       instruction =>
         txInfo?.transaction.message.staticAccountKeys[
           instruction.programIdIndex
         ].toBase58() === SPL_NOOP_PROGRAM_ID.toBase58(),
     );

     let noteLog: NoteLog;
     for (let i = noopInnerIx.length - 1; i >= 0; i--) {
       try {
         // Talimat verisini çözümlemeye ve serileştirmeye çalışın
         const applicationDataEvent = deserializeApplicationDataEvent(
           Buffer.from(bs58.decode(noopInnerIx[i]?.data!)),
         );

         // Uygulama verisini alın
         const applicationData = applicationDataEvent.fields[0].applicationData;

         // Uygulama verisini NoteLog örneğine serileştirin
         noteLog = deserialize(
           NoteLogBorshSchema,
           NoteLog,
           Buffer.from(applicationData),
         );

         if (noteLog !== undefined) {
           break;
         }
       } catch (__) {}
     }

     return noteLog;
   }
   ```

   `utils.ts` dosyası üç temel bileşen içerir:

   - **`NoteLog` Sınıfı**: Bu sınıf, Noop programı kayıtlarından çıkaracağımız not günlüğünü temsil eder. Ayrıca, serileştirme için kullanılan `NoteLogBorshSchema` adlı Borsh şemasını içerir.
   - **`getHash` Fonksiyonu**: Bu fonksiyon, not ve sahibinden bir hash oluşturur ve bunu Merkle ağacındaki verilerle karşılaştırmamızı sağlar.
   - **`getNoteLog` Fonksiyonu**: Bu fonksiyon, işlem kayıtları arasında Noop programı kayıtlarını bulur, ardından serileştirir ve ilgili `NoteLog`'u alır.

---

#### 8. İstemci Testlerini Yazın

Paketlerimiz ve yardımcı dosyamız kurulduktan sonra testler yazmaya dalmaya hazırız. Programımız için dört test oluşturacağız:

1. **Not Ağacı Oluşturma**: Bu test, not hash'lerini saklamak için Merkle ağacını başlatacaktır.
2. **Not Ekleme**: Bu test, bir notu ağaca eklemek için `append_note` talimatını çağıracaktır.
3. **Merkle ağacına maksimum boyutlu not ekleme**: Bu test, `append_note` talimatını kullanacak, ancak tek bir işlemdaki maksimum 1232 bayt boyutuna ulaşan bir notla çalışacaktır.
4. **Merkle ağacındaki ilk notu güncelleme**: Bu test, eklenen ilk notu değiştirmek için `update_note` talimatını kullanacaktır.

> **Not**: İlk test temelde kurulum amaçlıdır. Kalan üç test için, Merkle ağacındaki not hash'inin, not içeriği ve imzalayan temel alınarak beklenen değerle eşleşip eşleşmediğini kontrol edeceğiz.

İlk olarak, ithalatlarımızı kuracağız. Bu, Anchor, `@solana/web3.js`, `@solana/spl-account-compression` ve kendi yardımcı işlevlerimizden çeşitli bileşenleri içerecektir.

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CompressedNotes } from "../target/types/compressed_notes";
import {
  Keypair,
  Transaction,
  PublicKey,
  sendAndConfirmTransaction,
  Connection,
} from "@solana/web3.js";
import {
  ValidDepthSizePair,
  createAllocTreeIx,
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
  ConcurrentMerkleTreeAccount,
} from "@solana/spl-account-compression";
import { getHash, getNoteLog } from "./utils";
import { assert } from "chai";
```

Ardından, testlerimiz için gerekli durum değişkenlerini kuracağız. Bu kurulum şunları içerecektir:

1. **Varsayılan Anchor Kurulumu**: Anchor testi için temel ortamı yapılandırın.
2. **Merkle Ağaç Anahtarı**: Merkle ağacı için bir anahtar çifti oluşturun.
3. **Ağaç Yetkisi**: Merkle ağacı yetkisi için bir anahtar çifti oluşturun.
4. **Notlar**: Testlerde kullanılacak bazı örnek notları tanımlayın.

```typescript
describe("compressed-notes", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = new Connection(
    provider.connection.rpcEndpoint,
    "confirmed",
  );

  const wallet = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.CompressedNotes as Program<CompressedNotes>;

  // Merkle ağaç hesabı için yeni bir anahtar çifti oluşturun
  const merkleTree = Keypair.generate();

  // Merkle ağaç hesabı için ağaç yetkisi olarak kullanılacak PDA'yı türetin
  const [treeAuthority] = PublicKey.findProgramAddressSync(
    [merkleTree.publicKey.toBuffer()],
    program.programId,
  );

  const firstNote = "merhaba dünya";
  const secondNote = "0".repeat(917);
  const updatedNote = "güncellenmiş not";

  describe("Merkle Ağaç İşlemleri", () => {
    // Testler burada yer alacak
  });
});
```

---

Şimdi, `Not Ağacı Oluşturma` testine dalalım. Bu test iki temel görevi yerine getirecektir:

1. **Yeni Bir Merkle Ağaç Hesabı Tahsis Etme**: Merkle ağacı için, maksimum derinliği 3, maksimum tampon boyutunu 8 ve kanopi derinliğini 0 belirterek yeni bir hesap oluşturun.
2. **Hesabı Başlatma**: Programımızın `createNoteTree` talimatını kullanarak yeni tahsis edilen Merkle ağaç hesabını kurun.

```typescript
it("creates a new note tree", async () => {
  const maxDepthSizePair: ValidDepthSizePair = {
    maxDepth: 3,
    maxBufferSize: 8,
  };

  const canopyDepth = 0;

  // Ağaç için gerekli alana sahip yeni bir hesap oluşturmak için talimat
  const allocTreeIx = await createAllocTreeIx(
    connection,
    merkleTree.publicKey,
    wallet.publicKey,
    maxDepthSizePair,
    canopyDepth,
  );

  // Not programı aracılığıyla ağacı başlatmak için talimat
  const ix = await program.methods
    .createNoteTree(maxDepthSizePair.maxDepth, maxDepthSizePair.maxBufferSize)
    .accounts({
      owner: wallet.publicKey,
      merkleTree: merkleTree.publicKey,
      treeAuthority,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    })
    .instruction();

  const tx = new Transaction().add(allocTreeIx, ix);
  await sendAndConfirmTransaction(connection, tx, [wallet.payer, merkleTree]);

  // Merkle ağaç hesabını alıp başlatıldığını doğrulayın
  const merkleTreeAccount =
    await ConcurrentMerkleTreeAccount.fromAccountAddress(
      connection,
      merkleTree.publicKey,
    );
  assert(merkleTreeAccount, "Merkle ağaç başlatılmış olmalı");
});

it("adds a note to the Merkle tree", async () => {
  const txSignature = await program.methods
    .appendNote(firstNote)
    .accounts({
      owner: wallet.publicKey,
      merkleTree: merkleTree.publicKey,
      treeAuthority,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    })
    .rpc();

  const noteLog = await getNoteLog(connection, txSignature);
  const hash = getHash(firstNote, wallet.publicKey);

  assert(
    hash === Buffer.from(noteLog.leafNode).toString("hex"),
    "Leaf node hash eşleşmeli",
  );
  assert(firstNote === noteLog.note, "Not, eklenen not ile eşleşmeli");
});

it("adds max size note to the Merkle tree", async () => {
  const txSignature = await program.methods
    .appendNote(secondNote)
    .accounts({
      owner: wallet.publicKey,
      merkleTree: merkleTree.publicKey,
      treeAuthority,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    })
    .rpc();

  const noteLog = await getNoteLog(connection, txSignature);
  const hash = getHash(secondNote, wallet.publicKey);

  assert(
    hash === Buffer.from(noteLog.leafNode).toString("hex"),
    "Leaf node hash eşleşmeli",
  );
  assert(
    secondNote === noteLog.note,
    "Not, eklenen maksimum boyutlu not ile eşleşmeli",
  );
});

it("updates the first note in the Merkle tree", async () => {
  const merkleTreeAccount =
    await ConcurrentMerkleTreeAccount.fromAccountAddress(
      connection,
      merkleTree.publicKey,
    );
  const root = merkleTreeAccount.getCurrentRoot();

  const txSignature = await program.methods
    .updateNote(0, root, firstNote, updatedNote)
    .accounts({
      owner: wallet.publicKey,
      merkleTree: merkleTree.publicKey,
      treeAuthority,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    })
    .rpc();

  const noteLog = await getNoteLog(connection, txSignature);
  const hash = getHash(updatedNote, wallet.publicKey);

  assert(
    hash === Buffer.from(noteLog.leafNode).toString("hex"),
    "Leaf node hash güncellemeden sonra eşleşmeli",
  );
  assert(
    updatedNote === noteLog.note,
    "Güncellenmiş not, kaydedilen not ile eşleşmeli",
  );
});
```

---

Hepsi bu kadar—tebrikler! `anchor test` çalıştırın ve dört testin de geçtiğini görmelisiniz.

Herhangi bir sorunla karşılaşırsanız, demoya geri dönmekten veya  
[Compressed Notes repository](https://github.com/unboxed-software/anchor-compressed-notes) içindeki tam çözüm koduna göz atmaktan çekinmeyin.

### Zorluk

Artık durum sıkıştırmasını çözümlediniz, Compressed Notes programına yeni bir özellik ekleme zamanı. Göreviniz, kullanıcıların mevcut bir notu silmesine izin veren bir talimat uygulamaktır. Unutmayın ki, Merkle ağacından bir yaprağı fiziksel olarak kaldıramazsınız, bu nedenle bir notun silindiğini gösterecek bir yöntem bulmalısınız.

İyi şanslar ve mutlu kodlamalar!

Silme işlevini nasıl uygulayacağınıza dair basit bir örnek için  
[`ana` dalını GitHub'da](https://github.com/Unboxed-Software/anchor-compressed-notes/tree/main) kontrol edin.


Kodunuzu GitHub'a yükleyin ve [bu ders hakkında ne düşündüğünüzü bize bildirin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=60f6b072-eaeb-469c-b32e-5fea4b72d1d1)!
