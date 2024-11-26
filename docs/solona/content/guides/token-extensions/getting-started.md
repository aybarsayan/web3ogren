---
featured: true
featuredPriority: 1
date: 2024-01-19T00:00:00Z
difficulty: beginner
seoTitle: "Token Uzantılarıyla Başlarken"
title: "Token Uzantılarıyla Başlarken"
description:
  "Yeni token uzantıları ile token'larınız için özel mantık oluşturalabilirsiniz. Bu rehberde token uzantıları hakkında bilmeniz gereken her şeyi gözden geçireceğiz ve bugün inşa etmeye başlamanız için gerekenleri ele alacağız."
keywords:
  - token 2022
  - token uzantıları
  - token programı
tags:
  - token 2022
  - token uzantıları
---

Token uzantıları, **Solana Program Kütüphanesi standardının** bir sonraki neslidir. Token uzantıları, normal token işlevselliğini genişletmenin yeni yollarını tanıtır. Orijinal Token programı, token'ları mintleme, transfer etme ve dondurma gibi temel yetenekler getirdi. **Token Uzantıları programı**, aynı özellikleri içerir, ancak gizli transferler, özel transfer mantığı, genişletilmiş metadata ve çok daha fazlası gibi ek özellikler ile birlikte gelir.

[Token Uzantıları programı](https://spl.solana.com/token-2022), programID'si `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` olan bir süper kümeyi temsil eder ve orijinal işlevselliği içeren [Token Programı](https://spl.solana.com/token) ise `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` adresindedir.

:::tip
Her Token Uzantısı için özel bir video eğitimini bu [Token Uzantıları YouTube listesi](https://www.youtube.com/playlist?list=PLilwLeBwGuK6imBuGLSLmzMEyj6yVHGDO) üzerinde bulabilirsiniz.
:::

## Token uzantıları ile bir token nasıl oluşturabilirim?

Token uzantıları ile token oluşturma işlemini başlatmak için, `Solana Araç Seti` kullanarak CLI ile token oluşturabilirsiniz. Oluşturmak istediğiniz uzantıya bağlı olarak, komut bayraklarınız farklı olabilir. Aşağıda her tür uzantı için eklemeniz gereken bayraklar bulunmaktadır.

| Uzantı                                                                                           | CLI Bayrağı                                  |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| [Mint Kapatma Yetkisi](https://solana.com/developers/guides/token-extensions/mint-close-authority) | --enable-close                                |
| [Transfer Ücretleri](https://solana.com/developers/guides/token-extensions/transfer-fee)         | --transfer-fee \ \ |
| [Taşınamaz](https://solana.com/developers/guides/token-extensions/non-transferable)             | --enable-non-transferable                     |
| [Faiz Getiren](https://solana.com/developers/guides/token-extensions/interest-bearing-tokens)   | --interest-rate \                       |
| [Kalıcı Temsilci](https://solana.com/developers/guides/token-extensions/permanent-delegate)     | --enable-permanent-delegate                   |
| [Transfer Kancası](https://solana.com/developers/guides/token-extensions/transfer-hook)          | --transfer-hook \                  |
| [Metadata](https://solana.com/developers/guides/token-extensions/metadata-pointer)              | --enable-metadata                             |
| [Metadata Göstergesi](https://solana.com/developers/guides/token-extensions/metadata-pointer)   | --metadata-address \               |
| Gizli Transferler                                                                              | --enable-confidential-transfers auto          |

Bazı uzantıları, mint yerine bir token hesabında etkinleştirirsiniz, bunlar için gereken bayrakları aşağıda bulabilirsiniz.

| Uzantı                                                                                               | CLI Bayrağı                             |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [Değiştirilemez Sahip](https://solana.com/developers/guides/token-extensions/immutable-owner)      | Varsayılan olarak dahil                 |
| [Transferde Gerekli Memo](https://solana.com/developers/guides/token-extensions/required-memo)     | enable-required-transfer-memos           |
| [CPI Koruması](https://spl.solana.com/token-2022/extensions#cpi-guard)                              | enable-cpi-guard                         |
| [Varsayılan Hesap Durumu](https://solana.com/developers/guides/token-extensions/default-account-state) | --default-account-state \        |

Artık hangi uzantıların mevcut olduğunu bildiğinize göre, token uzantıları ile yeni token'inizi aşağıdaki komut ile oluşturabilirsiniz:

```shell
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  create-token <uzantı bayrakları>
```

Token uzantıları ile projeniz için neye ihtiyacınız olduğu doğrultusunda kombinasyonlar yapabilirsiniz. Örneğin, transfer ücretleri ve özel bir metadata içeren bir token isterseniz, uzantıları birleştirmek için şu komutu kullanabilirsiniz:

```shell
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  create-token --interest-rate 5 --enable-metadata
```

> Uzantıları karıştırıp eşleştirebilirsiniz, fakat çoğu uzantı, token mint'i oluşturulduktan sonra eklenemez. Taşınamaz olanlar, çeşitli "gösterge" uzantıları ve birkaç diğerleri de buna dahildir.

## Hangi uzantılar birbirleriyle uyumlu?

Birden fazla uzantıyı bir araya getirebilirsiniz, ancak bazı uzantılar birlikte çalışmayabilir veya birleştirmenin anlamı olmayabilir. Örneğin, transfer kancalarını, taşınamaz token uzantısı ile bir araya getirmek isteyemezsiniz çünkü bu token'a hiçbir şey katmaz ve sadece daha fazla maliyet oluşturur.

Aşağıdaki uzantı kombinasyonları ya birlikte çalışmaz ya da birleştirmek mantıklı değildir:

- Taşınamaz + (transfer kancaları, transfer ücretleri, gizli transfer)
- Gizli transfer + ücretler (1.18'e kadar)
- Gizli transfer + transfer kancaları (bu transferler yalnızca kaynak / hedef hesapları görebilir, bu nedenle aktarım miktarına müdahale edemez)
- Gizli transfer + kalıcı temsilci

Bunlar dışında, projenizin ihtiyaçlarına uygun herhangi bir kombinasyon ile özelleştirme seçeneğiniz vardır.

## Token uzantıları ile token'larıma özel mantık nasıl eklerim?

Token uzantıları, token'larınızla özel mantık oluşturmanızı sağlayarak dApps, cüzdanlar ve programlar ile tam bileşenlik özelliği sunar. Bunu sağlamak için iki uzantı vardır: **Transfer Kancası** ve **Metadata** uzantıları.

### Transfer Kancaları

Transfer kancaları, token ihraççılarına kullanıcılar ve token'lar nasıl etkileşimde bulunacağını dikte etme yeteneği sağlayan güçlü bir yeni uzantıdır. Normal bir transfer yerine, herhangi bir geliştirici, transfer kancası uzantısı ile kullanılmak üzere bir programa özel mantık ekleyebilir. **Transfer kancalarıyla**, zincir üzerinde zorunlu telif hakları gibi daha ayrıntılı token etkileşimlerini etkinleştirebilirsiniz.

Önemli bir nokta olarak, transfer kancaları, bir transfer içinde özel mantık ekleme yeteneğini sağlasa da, ilk transferden gelen tüm hesaplar salt okunur hesaplara dönüştürülür. Bu, göndericinin imza ayrıcalıklarının Transfer Kancası programına genişlemediği anlamına gelir. Bu, bir token ile transfer kancaları olan bir cüzdanla etkileşimde bulunan birinin cüzdanında potansiyel beklenmeyen bir mantığın yürütülmesini önlemek için kullanıcıları korur.

Bugün [transfer kancaları ile inşa etmeye başlayabilirsiniz](https://github.com/solana-foundation/developer-content/pull/43/files).

### Metadata

Metadata uzantısı, token ihraççilerine özelleştirilebilir alanlarla zincir üzerinde herhangi bir anahtar değer çiftini itme yeteneği kazandırır ve tüm bunları aynı hesap içinde barındırır. Bu, **oyunlar** gibi projelerin, her bir token içinde potansiyel olarak özel metadata'ya sahip olmalarını sağlayarak, oyunların oyun içi token'ları ve öğeleriyle yapabilecekleri olasılıkları artırır.

Bu özelleştirilmiş zincir üzerindeki metadata, yeni standartların oluşturulmasına kapı aralar, geliştirici topluluğunun bir araya gelerek token uzantıları altında zincir üzerinde metadata kullanmanın yeni yollarını yaratma fırsatını sunar.

Bugün [metadata uzantısı ile yapmaya başlayabilirsiniz](https://solana.com/developers/guides/token-extensions/metadata-pointer).

## Token'ları bir standarttan diğerine nasıl taşırım?

Token uzantıları yeni bir token standardı olmasına rağmen, kimsenin bir standarttan diğerine geçiş yapması zorunlu değildir. Orijinal Token standardında kalmak isteyebileceğiniz bazı nedenler olabilir.

Eğer sadece transfer ve dondurma işlevlerine ihtiyacınız var ve token uzantılarının ek özelliklerine ihtiyacınız yoksa, Token programı standardı projeniz için yeterli olacaktır. Ancak daha gelişmiş özellikler eklemek isterseniz, token uzantıları yardımcı olabilir.

Bugün standartlar arası token'larınızı otomatik olarak dönüştürmenin bir yolu yoktur. Token standartları arasında [bir geçiş yolu](https://spl.solana.com/token-upgrade) vardır, ancak bazı karmaşıklıklarla birlikte gelir:

- Önceki standartta bulunan tüm token'ların yakılması gerekir.
- Geçiş, kullanıcı onayına bağlı olacaktır.

Genel öneri, token'ınız için token uzantıları yeteneklerine sahip olmak istiyorsanız, o standart ile token'inizi oluşturmaya başlamaktır.

## Token uzantıları için talimat düzeni nedir?

Token uzantıları, **Token** ile aynı talimat düzenlerini byte byte destekler. Örneğin, 2 ondalıklı bir mint üzerinde 100 token transfer etmek isterseniz, bu byte-temsil verisi ile bir **TransferChecked** talimatı oluşturursunuz:

```
[12, 100, 0, 0, 0, 0, 0, 0, 0, 2]
 ^^ TransferChecked enum
     ^^^^^^^^^^^^^^^^^^^^^^^^ 100, küçük sonlu 64-bit işaretsiz tamsayı olarak
                               ^ 2, bir byte
```

Bu format, **Token** ve **Token uzantıları** için tam olarak aynı anlama gelir. Bir programı diğerine hedeflemek istiyorsanız, talimattaki `program_id` değerini değiştirmeniz yeterlidir.

Token uzantıları programındaki tüm yeni talimatlar, orijinal Token programının sona erdiği yerden başlar. Orijinal Token programı, 0'dan 24'e kadar indekslere sahip 25 benzersiz talimata sahiptir. Token uzantıları programı, bu talimatları destekler ve ardından 25 numaralı indekste yeni işlevsellik ekler.

## Mint'ler ve Hesapların düzeni nedir?

Yapı düzenleri için, temel olarak aynı fikir geçerlidir. Bir `Account`, Token ve Token uzantıları arasında ilk `165` byte için tam olarak aynı temsil üzerine sahiptir ve bir `Mint`, ilk `82` byte için aynı temsili paylaşır.

## Token uzantılarının kaynak kodu nerede?

Token uzantıları programının kaynak kodu [GitHub](https://github.com/solana-labs/solana-program-library/tree/master/token/program-2022) üzerinde mevcuttur.

Türler ve talimatlar hakkında bilgi için, Rust dokümanları [docs.rs](https://docs.rs/spl-token-2022/latest/spl_token_2022/) adresinden mevcuttur.

## Token uzantıları programı denetlendi mi?

Token uzantıları programı birden fazla kez denetlenmiştir. Yapılan denetimlerin güncel tam listesine programın [Güvenlik Denetimleri](https://spl.solana.com/token-2022#security-audits) belgelerinden ulaşabilirsiniz.

**13 Aralık 2023** itibarıyla tamamlanan denetimler şunlardır:

- Halborn
  - İnceleme commit hash
    [`c3137a`](https://github.com/solana-labs/solana-program-library/tree/c3137af9dfa2cc0873cc84c4418dea88ac542965/token/program-2022)
  - Nihai rapor
    https://github.com/solana-labs/security-audits/blob/master/spl/HalbornToken2022Audit-2022-07-27.pdf
- Zellic
  - İnceleme commit hash
    [`54695b`](https://github.com/solana-labs/solana-program-library/tree/54695b233484722458b18c0e26ebb8334f98422c/token/program-2022)
  - Nihai rapor
    https://github.com/solana-labs/security-audits/blob/master/spl/ZellicToken2022Audit-2022-12-05.pdf
- Trail of Bits
  - İnceleme commit hash
    [`50abad`](https://github.com/solana-labs/solana-program-library/tree/50abadd819df2e406567d6eca31c213264c1c7cd/token/program-2022)
  - Nihai rapor
    https://github.com/solana-labs/security-audits/blob/master/spl/TrailOfBitsToken2022Audit-2023-02-10.pdf
- NCC Group
  - İnceleme commit hash
    [`4e43aa`](https://github.com/solana-labs/solana/tree/4e43aa6c18e6bb4d98559f80eb004de18bc6b418/zk-token-sdk)
  - Nihai rapor
    https://github.com/solana-labs/security-audits/blob/master/spl/NCCToken2022Audit-2023-04-05.pdf
- OtterSec
  - İnceleme commit hash
    [`e92413`](https://github.com/solana-labs/solana-program-library/tree/e924132d65ba0896249fb4983f6f97caff15721a)
  - Nihai rapor
    https://github.com/solana-labs/security-audits/blob/master/spl/OtterSecToken2022Audit-2023-11-03.pdf
- OtterSec (ZK Token SDK)
  - İnceleme commit hash
    [`9e703f8`](https://github.com/solana-labs/solana/tree/9e703f8/zk-token-sdk)
  - Nihai rapor
    https://github.com/solana-labs/security-audits/blob/master/spl/OtterSecZkTokenSdkAudit-2023-11-04.pdf