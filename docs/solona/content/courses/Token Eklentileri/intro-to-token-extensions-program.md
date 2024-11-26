---
title: Token Uzantılarına Giriş
objectives:
  - Token Uzantıları Programı hakkında bilgi sahibi olun
  - Token Uzantıları kullanan madeni paraların Token Uzantıları Programı ile yaratılması gerektiğini anlayın
  - Çok çeşitli token uzantılarını öğrenin
  - Solana CLI'den token uzantılarını kullanın
description:
  "Token uzantılarının ne olduğunu ve bu özellikleri kullanan token'ların nasıl oluşturulacağını öğrenin."
---

## Özet

- Mevcut Token Programı, fungible ve non-fungible token'lar için arabirimler sağlar. Ancak yeni özelliklere ihtiyaç duyulduğunda, çeşitli Token Programı çatalları oluşturulmuş ve bu da ekosistemde benimseme zorlukları yaratmıştır.
- Mevcut kullanıcılar, cüzdanlar ve merkeziyetsiz uygulamalar (dApp'ler) üzerinde herhangi bir kesinti olmadan yeni token özellikleri tanıtmak ve mevcut token'ların güvenliğini sağlamak amacıyla, yeni bir token programı olan Token Uzantıları Programı (aynı zamanda Token-2022 olarak da adlandırılır) geliştirilmiştir.
- Token Uzantıları Programı, orijinal Token Programı'ndan ayrı bir adresi olan ayrı bir programdır. Aynı işlevleri destekler ve uzantılar aracılığıyla ek işlevler sunar.

---

## Genel Bakış

Token Uzantıları Programı, daha önce Token 2022 olarak bilinen, orijinal Token Programı tarafından sunulan işlevselliğin bir üst kümesidir. Token Programı, fungible ve non-fungible token'lar için basit bir arayüz ve yapı seti ile çoğu ihtiyacı karşılar. **Basit ve performanslı** olmasına rağmen, Token Programı geliştirici topluluğunun ihtiyaç duyduğu özelliklerden yoksundu. Bu da Token Programı'nın çatallarını zorunlu hale getirerek ekosistemi bölme potansiyeli doğurdu.

> Örneğin, bir üniversite, bir mezunun cüzdanına NFT versiyonu bir diploma göndermeyi istiyor varsayalım. Bu diplomanın asla üçüncü bir tarafa aktarılmadığından nasıl emin olabiliriz? Mevcut Token Programı'nda bu mümkün değil - tüm işlemleri reddeden bir transfer talimatına ihtiyaç duyarız. Bunun bir çözümü, Token Programı'nı çatallamak ve kontrol eklemektir. Ancak bu tamamen ayrı bir token programı olacağı anlamına gelir. Üniversitenin cüzdanlar ve diploma kontrol dapps'leri için benimsenmesi için bir kampanya yürütmesi gerekecektir.

:::note
Ayrıca, farklı üniversitelerin farklı işlevsellikler istemesi durumunda ne olacak? Bu iç tartışmaları yönetmek için bir tür Üniversite DAO'su olması gerekecektir - belki de birkaç Üniversite DAO'su olacaktır...
:::

Yoksa yeni Token Uzantıları Programı'ndaki `non-transferable token` uzantısını kullanabilirler. Bu, herkes tarafından benimsenen temel bir Solana programıdır.

Bu yüzden Token Uzantıları Programı yaratıldı; orijinal Token Programı'ndan en çok talep edilen ve istenen özelliklerin işlevselliğini ve özelleştirilmesini büyük ölçüde artırmak için. Bu program, geliştiricilerin orijinal programda alışkın olduğu tüm işlevleri %100 destekler ve gelecekteki iyileştirmelere de yer bırakır. İki programın benimsenmesi, onlarca programdan çok daha kolaydır.

Bununla birlikte, Token Uzantıları Programı ayrı bir adrese dağıtılmıştır. Bu iki programın arayüzleri aynı olsa da, bu programların adresleri **değiştirilemez**. Yani, Token Programı ile oluşturulan bir token, Token Uzantıları Programı ile etkileşime giremez. Sonuç olarak, Token Uzantıları programını desteklemek istiyorsak, istemci uygulamamızın bu iki program arasında token'ları ayırt etmek için ek bir mantığa ihtiyacı olacak.

:::warning
Son bir not - Token Uzantıları Programı, Token Programı'nın tamamen yerini almaz; belirli bir token'ın kullanım durumu çok basitse, uzantılara ihtiyaç duymayabilir.
:::

### Uzantılar

Token Uzantıları Programı'nın uzantıları yalnızca uzantılardır. Yani, uzantı için gerekli olan ek veriler, alışık olduğumuz Mint ve Token hesaplarının sonuna eklenmiştir. Bu, Token Programı ve Token Uzantıları Programı'nın arayüzlerinin uyumlu olması için kritik öneme sahiptir.

Yazı yazıldığı tarihte toplam [16 uzantı](https://spl.solana.com/token-2022/extensions) mevcuttur, bunlardan dördü Token hesaplarını, 12'si ise Mint hesaplarını kapsamaktadır:

**Hesap uzantıları** arasında şu anda şunlar bulunmaktadır:

- **Zorunlu notlar**: Bu uzantı, tüm transferlerde bir not bulunmasını zorunlu kılar, tıpkı geleneksel bankacılık sistemlerinde olduğu gibi.
  
- **Değiştirilemez mülkiyet**: Bir token hesabının sahibi normalde mülkiyeti başka bir adrese devredebilir. Bu birçok senaryo için faydalı olsa da, özellikle İlişkili Token Hesapları (ATA'lar) ile çalışırken güvenlik açıklarına yol açabilir. Bu sorunları önlemek için, hesabın mülkiyetini yeniden atamayı imkansız hale getiren bu uzantıyı kullanabiliriz.
  

  Tüm Token Uzantıları Programı ATA'larının değiştirilemez mülkiyet uzantısı entegre edilmiştir.
  Tüm Token Uzantıları Programı ATA'larının değiştirilemez mülkiyet uzantısı entegre edilmiştir.


- **Varsayılan hesap durumu**: Mint yaratıcıları, tüm yeni token hesaplarının dondurulmasını zorunlu kılan bu uzantıyı kullanabilir. Bu şekilde, kullanıcıların hesaplarını çözmek ve token'ları kullanmak için bir tür hizmet ile etkileşimde bulunmaları gerekecektir.

- **CPI koruma**: Bu uzantı, kullanıcıların kendilerine görünmeyen, özellikle de Sistem veya Token programları olmayan gizli programları onaylamalarına karşı koruma sağlar. Bunu, belirli etkinlikleri çapraz program çağrıları içinde kısıtlayarak gerçekleştirir.

**Mint uzantıları** şunları içerir:

- **Transfer ücretleri**: Token Uzantıları Programı, protokol seviyesinde transfer ücretlerini uygular ve her transferden belirli bir miktarı alıcı hesabından keser. Bu kesilen miktar alıcıya erişilemez ve mint yaratıcısının belirlediği herhangi bir adres tarafından düzeltilebilir.

- **Minti kapatma**: Token Programı altında yalnızca token hesapları kapatılabiliyordu. Ancak, kapanma yetkisi uzantısının tanıtılması, mint hesaplarının da kapatılmasına izin vermektedir.


  Bir mint hesabını kapatmak için, arzın 0 olması gerekir.
  Dolayısıyla tüm minted token'lar yanmalıdır.


- **Faiz getiren token'lar**: Sürekli dalgalanan değerlere sahip token'lar, güncellenen değerlerin istemcilerde gösterilmesi, düzenli yeniden baz alma veya güncelleme işlemleri gerektiren proxy'ler gerektirir. Bu uzantı ile, token'ın üstünde bir faiz oranı belirleyerek ve herhangi bir zamanda faiz ile miktarını alarak UI token miktarının nasıl temsil edildiğini değiştirebiliriz. **Not**: Token üzerindeki faiz tamamen estetik olup, bir hesap içindeki token miktarını değiştirmez.

- **Değiştirilemez token'lar**: Bu uzantı, sahibine "bağlı" olan ve başka birine aktarılamayan token'ların oluşturulmasını sağlar.

- **Kalıcı delegasyon**: Bu uzantı, bir mint için kalıcı bir delege belirlememizi sağlar. Bu yetki, o mint'in herhangi bir token hesabı üzerindeki sınırsız delege ayrıcalıklarına sahiptir. **Bu, herhangi bir hesaptan herhangi bir miktar token'ı yakma veya transfer etme yeteneğine sahip olduğu anlamına gelir. Kalıcı delegasyon, örneğin, erişim token'larını iptal etmek için üyelik programları veya yaptırım uygulanan varlıkların bakiyelerini iptal etmek için stabilcoin ihraççıları tarafından kullanılabilir. Bu uzantı güçlü ve tehlikelidir.**

- **Transfer kancası**: Bu uzantı, token yaratıcılarının token'larının nasıl transfer edildiği üzerinde daha fazla kontrol sağlamasına olanak tanır ve on-chain'de bir geri çağırma "kanca" fonksiyonu sağlar. Yaratıcıların, kancanın arabirimini uygulayan bir program geliştirmeleri ve dağıtmaları, ardından token mintlerini kullanmak için programlarını yapılandırmaları gerekir. Daha sonra, o mint'in herhangi bir transferinde, transfer kancası çağrılacaktır.

- **Metadata işaretçisi**: Bir mintin özelliğini tanımlayan birden fazla farklı hesap olabilir. Bu uzantı, token yaratıcısının kanonik meta veriyi tanımlayan bir adres belirlemesine izin verir. **İşaretçi**, bir Metaplex meta veri hesabı gibi bir dış hesap veya meta veri uzantısı kullanılıyorsa, kendi kendine işaret eden olabilir.

- **Metadata**: Bu uzantı, bir mint yaratıcısının token'ının meta verilerini doğrudan mint hesabına dahil etmesine izin verir. Bu her zaman metadata işaretçisi uzantısıyla birlikte kullanılır.

- **Grup işaretçisi**: Token grubunu, bir token "koleksiyonu" gibi düşünün. Daha spesifik olarak, bir NFT koleksiyonunda, grup işaretçisi uzantısına sahip mint, koleksiyon NFT'si olarak kabul edilecektir. Bu uzantı, [Token-Grup Arayüzüne](https://github.com/solana-labs/solana-program-library/tree/master/token-group/interface) uyan bir hesapta bir işaretçi içerir.

- **Grup**: Bu, mint'in içinde grup bilgilerini depolar. Her zaman grup işaretçisi uzantısıyla birlikte kullanılır.

- **Üye işaretçisi**: Grup işaretçisinin tersidir. Bu işaretçi, hangi grupta yer aldığını gösteren üye verilerini tutan bir hesaba işaret eder. Bir NFT koleksiyonunda, bunlar koleksiyondaki NFT'ler olacaktır.

- **Üye**: Bu, mint'in içinde üye bilgilerini depolar. Her zaman üye işaretçisi uzantısıyla birlikte kullanılır.

- **Gizli transferler**: Bu uzantı, işlem esnasında işlem miktarı gibi önemli detayları ifşa etmeden, işlemlerin gizliliğini artırır.

:::note
Bu uzantılar, çok sayıda yüksek işlevselliğe sahip token'lar oluşturmak için karıştırılıp eşleştirilebilir.
:::

Her bir uzantıyı ayrı derslerde daha derinlemesine inceleyeceğiz.

---

## Token Programı ve Token Uzantıları Programı ile çalışma sırasında dikkate alınması gerekenler

Bu programların her ikisinin arayüzleri tutarlı kalsa da, iki farklı programdır. Bu programların program kimlikleri değiştirilemez ve onları kullanarak oluşturulan adresler farklıdır. Hem Token Programı token'larını hem de Token Uzantıları Programı token'larını desteklemek istiyorsanız, istemci tarafında ve program tarafında ek mantık eklemeniz gerekir. Bu uygulamalara daha sonraki derslerde dalacağız.

---

## Laboratuvar

Şimdi, `spl-token-cli` CLI'si kullanarak bu uzantılardan bazılarının testini yapacağız.

### 1. Başlarken

Uzantıları kullanmadan önce `spl-token-cli`'yi yüklememiz gerekir. [Bu kılavuzu](https://spl.solana.com/token#setup) takip edin. Yüklemeden sonra, aşağıdaki komutu çalıştırarak doğrulayın:

```bash
spl-token --version
```

:::note
Yukarıdaki [kılavuzu](https://spl.solana.com/token#setup) takip ettiğinizden emin olun, çünkü bu aynı zamanda yerel bir cüzdanı nasıl başlatacağınızı ve SOL'u nasıl airdrop alacağınızı da açıklıyor.
:::

### 2. Kapatma yetkisi ile bir mint oluşturma

Kapatma yetkisi uzantısı ile bir mint hesabı oluşturacağız ve ardından bunun çalıştığını göstermek için mint'i kapatacağız!

CLI kullanarak kapanma yetkisi uzantısı ile bir mint oluşturalım:

Bu uzantı şu argümanları gerektirir:

- `create-token`: İlgili işlemi yürütmek istediğimiz talimat.
- `--program-id`: Kullanmak istediğimiz program kimliğini belirtmek için kullanılan bu bayrak.
  `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` Token Uzantıları Programı'nın dağıtıldığı kamu adresidir.
- `--enable-close`: Mint'i kapanma yetkisi ile başlatmak istediğimizi belirten bu bayrak.

Aşağıdaki komutu çalıştırın:

```bash
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-close
```

Aşağıda gösterildiği gibi benzer bir çıktı göreceğiz:

```bash
Token 3s6mQcPHXqwryufMDwknSmkDjtxwVujfovd5gPQLvKw9 TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb programı altında oluşturuluyor.

Adres:  3s6mQcPHXqwryufMDwknSmkDjtxwVujfovd5gPQLvKw9
Ondalık:  9

İmza: fGQQ1eAGsnKN11FUcFhGuacpuMTGYwYEfaAVBUys4gvH4pESttRgjVKzTLSfqjeQ5rNXP92qEyBMaFFNTVPMVAD
```

Yeni oluşturulan mintin ayrıntılarını görüntülemek için `display` komutunu kullanabiliriz. Bu komut, bir token minti, hesap veya çok imzalı hesap için ilgili ayrıntıları gösterir. Önceki adımın mint adresini geçelim.

```bash
spl-token display <ACCOUNT_ADDRESS>
```

Artık bir mintimiz olduğu için, önceki adımdan elde edilen `TOKEN_MINT_ADDRESS` ile mint'i kapatabiliriz.

```bash
spl-token close-mint <TOKEN_MINT_ADDRESS>
```

:::note
Hesabı kapatarak, mint hesabındaki kira lamportlarını geri alırız. Hatırlayın, mint üzerindeki arz sıfır olmalıdır.
:::

Yetenek testi olarak, bu süreci tekrarlayın; ancak mint hesabını kapatmadan önce biraz token mintleyip ardından kapatmayı deneyin - ne olacağını görün. **(İpucu:** başarısız olacak**)**

### 3. Değiştirilemez sahipli bir token hesabı oluşturma

Şimdi başka bir uzantıyı test edelim, bu sefer bir Token hesabı uzantısı. Yeni bir mint oluşturacağız ve ardından değiştirilemez sahiplik uzantısını kullanarak ilişkili bir token hesabı oluşturacağız.

Öncelikle, herhangi bir ek uzantı olmadan yeni bir standart mint oluşturalım:

```bash
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
```

Şuna benzer bir çıktı almalısınız:

```bash
Token FXnaqGm42aQgz1zwjKrwfn4Jk6PJ8cvkkSc8ikMGt6EU TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb programı altında oluşturuluyor.

Adres:  FXnaqGm42aQgz1zwjKrwfn4Jk6PJ8cvkkSc8ikMGt6EU
Ondalık:  9

İmza: 3tX6FHvE24e8UHqSWbK5HRpBFxtCnDTRHASFZtipKkTzapgMGZEeNJ2zHAHSrSUs8L8wQGnLbvJiLrHuomyps39j
```

Elde edilen mint adresini kaydedin, bunu bir sonraki adımda kullanacağız.

Şimdi, `immutable owner` uzantısını kullanan bir ilişkili token hesabına (ATA) bu token'lardan birini mintleyelim. Varsayılan olarak, tüm ATA'lar `immutable owner` uzantısını etkinleştirir. CLI ile oluşturulan tüm token hesapları ATA olduğundan, `immutable owner` otomatik olarak etkinleştirilecektir.

Bu uzantı şu argümanları gerektirir:

- `create-account`: İlgili işlemi yürütmek istediğimiz talimat.
- `--program-id` (isteğe bağlı): Kullanmak istediğimiz program kimliği. Bu isteğe bağlıdır çünkü CLI mint'in sahip olduğu programı belirleyecektir.
- `--owner` (isteğe bağlı): Sahibin cüzdanının genel anahtarı. Şu anda çalışan genel anahtar olarak varsayılan hale gelecektir, `solana address` komutunu çalıştırarak alabiliriz.
- `--fee-payer` (isteğe bağlı): İşlem için ödeme yapan cüzdanın anahtarı. Bu, mevcut çalışan anahtar çiftine varsayılan olarak ayarlanacaktır, `solana config get` ile bulunabilir.
- ``: `create-token` komutundan aldığımız mint hesabıdır.

Değiştirilemez sahibi uzantısıyla ilişkili token hesabını oluşturmak için aşağıdaki komutu çalıştırın:

```bash
spl-token create-account <TOKEN_MINT_ADDRESS>
```

Bu komutu çalıştırdıktan sonra, aşağıda gösterildiği gibi benzer bir çıktı göreceğiz.

```bash
Hesap F8iDrVskLGwYo53SdJnvBKTpN1C7hobgnPQMq6hLivUn oluşturuluyor

İmza: 5zX73E2aFVwcsvhCgBSF6AxWqydWYk3KJaTmeS4AY22FwCvgEvnodvJ7fzvBHZptqv3FMz6tbLFR5LbmiUHLUkne
```

Artık `mint` fonksiyonu ile buna token'lar mintleyebiliriz. İşte sağlamamız gereken argümanlar:

- `mint`: Talimat
- ``: İlk adımdan aldığımız mint adresi
- ``: Mintlemek istediğimiz token miktarı
- `` (isteğe bağlı): Bu, önceki adımda oluşturduğumuz token'ları tutmak için kullanılan token hesabı. Ancak bu, mevcut çalışan anahtar çiftimiz ve mint için ATA olana otomatik olarak ayarlanacaktır.

```bash
spl-token mint <TOKEN_MINT_ADDRESS> <TOKEN_AMOUNT>
```

Sonuç şu şekilde olacaktır:

```bash
1 token mintleniyor
  Token: FXnaqGm42aQgz1zwjKrwfn4Jk6PJ8cvkkSc8ikMGt6EU
  Alıcı: 8r9VNjnLqjzrpgkcgCozgvCBDQwWWYUL7RKwatSWnd6B

İmza: 54yREwGCH8YfYXqEf6gRKGou681F8NkToAJZvJqM5qZETJokRkdTb8s8HVkKPeVMQQcc8gCZkq4Kxx3YbLtY9Frk
```

Mint ve token hesabı hakkında biraz bilgi almak için `spl-token display` komutunu kullanabilirsiniz.

### 4. Değiştirilemez ("ruh bağlı") NFT oluşturma

Son olarak, transfer edilemeyen, bazen "ruh bağlı" NFT olarak adlandırılan bir NFT oluşturalım. Bunu, sadece bir kişi veya hesap tarafından özel olarak sahip olunan bir başarı token'ı olarak düşünün. Bu token'ı oluşturmak için üç uzantı kullanacağız: metadata işaretçisi, metadata ve değiştirilemez token.

Metadata uzantısıyla, meta verileri doğrudan mint hesabına dahil edebiliriz ve değiştirilemez uzantı token'ı hesabına özel kılar.

Komut şu argümanları alır:

- `create-token`: İlgili işlemi yürütmek istediğimiz talimat.
- `--program-id`: Kullanmak istediğimiz program kimliği.
- `--decimals`: NFT'ler genellikle tam sayıdır ve 0 ondalık gösterimine sahiptir.
- `--enable-metadata`: Metadata uzantıları için bayrak. (Bu, metadata ve meta veri işaretçisi uzantılarını başlatır)
- `--enable-non-transferable`: Değiştirilemez uzantı için bayrak.

Metadata ve değiştirilemez uzantıları ile başlatılmış bir token yaratmak için aşağıdaki komutu çalıştırın.

```bash
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --decimals 0 --enable-metadata --enable-non-transferable
```

Aşağıda gösterildiği gibi benzer bir çıktı göreceğiz.

```bash
Token GVjznwtfPndL9RsBtAYDFT1H8vhQjx8ymAB1rbd17qPr TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb programı altında oluşturuluyor
Mint içinde meta veriyi başlatmak için `spl-token initialize-metadata GVjznwtfPndL9RsBtAYDFT1H8vhQjx8ymAB1rbd17qPr <TOKEN_ADINIZ> <TOKEN_SEMBOLÜ> <TOKEN_URI>` komutunu çalıştırın ve mint yetkisi ile imzalayın.

Adres:  GVjznwtfPndL9RsBtAYDFT1H8vhQjx8ymAB1rbd17qPr
Ondalık:  0

İmza: 5EQ95NPTXg5reg9Ybcw9LQRjiWFZvfb9WqJidxu6kKbcKGajp1U999ioToC1qC88KUS4kdUi6rZbibqjgJbzYses
```

Metadata uzantısı ile mint oluşturduktan sonra, yukarıdaki çıktıda belirtilen şekilde meta veriyi başlatmamız gerekir. Meta veriyi başlatmak şu argümanları alır:

- Mint adresi: Meta veriyi başlatmak için mint adresi.
- ``: Token adı
- ``: Token'ın kimliği için sembol.
- ``: Token için URI.
- `--update-authority` (isteğe bağlı): Meta veriyi güncelleme yetkisine sahip hesabın adresi. Bu varsayılan olarak mevcut çalışan genel anahtara ayarlanacaktır.

Metadata başlatmak için aşağıdaki komutu çalıştırın:

```bash
spl-token initialize-metadata <TOKEN_MINT_ADDRESS> MyToken TOK http://my.tokn
```

Artık güvenilir `display` komutumuzu arayarak meta veriye bir göz atalım.

```bash
spl-token display <TOKEN_MINT_ADDRESS>
```

Şimdi, mint için meta verileri güncelleyelim. Token adı güncelleyeceğiz. Aşağıdaki komutu çalıştırın:

```bash
spl-token update-metadata <TOKEN_MINT_ADDRESS> name MyAwesomeNFT
```

Mint'in meta verilerine özel bir alan eklemek nasıl yapılacağına bakalım. Bu komut şu argümanları alır:

- Mint adresi: Meta verileri güncellemek için mint adresi.
- Özel alan adı: Yeni özel alanın adı.
- Özel alan değeri: Yeni özel alanın değeri.

Aşağıdaki komutu çalıştırın:

```bash
spl-token update-metadata <TOKEN_MINT_ADDRESS> new-field new-value
```

Ayrıca, mint meta verilerinden özel alanları kaldırabiliriz. Aşağıdaki komutu çalıştırın:

```bash
spl-token update-metadata <TOKEN_MINT_ADDRESS> new-field --remove
```

Son olarak, bunu gerçek bir değiştirilemez NFT haline getirelim. Bunu, NFT'yi ATA'mıza mintleyerek ve ardından mint yetkisini kaldırarak yapıyoruz. Bu şekilde arz yalnızca bir olacak.

```bash
spl-token create-account <TOKEN_MINT_ADDRESS>
spl-token mint <TOKEN_MINT_ADDRESS> 1
spl-token authorize <TOKEN_MINT_ADDRESS> mint --disable
```

Artık başarıyla yalnızca ATA'mıza ait olan değiştirilemez bir NFT oluşturmuş olduk.

İşte bu kadar! Token Uzantıları Programı ile Solana CLI'yi kullanma şeklimiz budur. Bu uzantıları ayrı derslerde daha derinlemesine inceleyeceğiz ve bunları programatik olarak nasıl kullanabileceğimizi göreceğiz.

---

## Challenge

Farklı uzantı kombinasyonlarını denemek için gidin ve deneyin.

:::info
İpucu: Seçeneklerinize göz atmak için `--help` bayrağı ile komutları çağırın:
```bash
spl-token --create-token --help
```
:::