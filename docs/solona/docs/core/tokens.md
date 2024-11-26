---
title: "Solana'daki Tokenlar"
sidebarSortOrder: 7
description:
  Solana tokenları (SPL Tokenlar) hakkında, fungible ve non-fungible
  tokenlar, Token Programı, Token Uzantıları Programı, mint hesapları, token
  hesapları ve Solana üzerinde token oluşturma ve yönetme ile ilgili pratik
  örnekleri öğrenin.
---

Tokenlar, çeşitli kategori varlıklar üzerindeki sahipliği temsil eden dijital
varlıklardır. Tokenizasyon, mülkiyet haklarının dijitalleşmesini sağlar ve
hem fungible hem de non-fungible varlıkların yönetiminde temel bir bileşen
oluşur.

- **Fungible Tokenlar**, aynı tür ve değere sahip değiştirilebilir ve bölünebilir
  varlıkları temsil eder (ör. USDC).
- **Non-fungible Tokenlar (NFT)**, bölünemez varlıkların (ör. sanat eserleri)
  sahipliğini temsil eder.

Bu bölüm, tokenların Solana'da nasıl temsil edildiğinin temellerini
kapsayacaktır. Bunlara **SPL** ([Solana Program Kütüphanesi](https://github.com/solana-labs/solana-program-library))
Tokenları denir.

- `Token Programı`, ağda (hem fungible hem de non-fungible)
  tokenlarla etkileşim için tüm talimat mantığını içerir.

- `Mint Hesabı`, belirli bir türde token'ı temsil eder ve token
  hakkında toplam arz ve mint yetkisi gibi global meta verileri saklar (tokenın
  yeni birimlerini oluşturmak için yetkilendirilmiş adres).

- `Token Hesabı`, belirli bir türde token'ın (mint hesabı)
  ne kadar biriminin belirli bir adres tarafından sahip olunduğunu takip eder.

> Şu anda Token Programı'nın iki versiyonu bulunmaktadır. Orijinal
> [Token Programı](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program)
> ve
> [Token Uzantıları Programı](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program-2022)
> (Token2022). Token Uzantıları Programı, orijinal Token Programı ile aynı
> şekilde çalışır, ancak ek özellikler ve iyileştirmelerle birlikte gelir. Yeni
> tokenlar (mint hesapları) oluşturmak için önerilen versiyon Token Uzantıları
> Programı'dır.

## Ana Noktalar

- Tokenlar, fungible (değiştirilebilir) veya non-fungible (eşsiz) varlıklar
  üzerine sahipliği temsil eder.

- Token Programı, ağda hem fungible hem de non-fungible tokenlar ile etkileşim
  için tüm talimatları içerir.

- Token Uzantıları Programı, ek özellikler sunan yeni bir Token Programı
  versiyonudur ve aynı temel işlevsellikleri korur.

- Mint Hesabı, ağda benzersiz bir token'ı temsil eder ve toplam arz gibi
  global meta verileri saklar.

- Token Hesabı, belirli bir mint hesabı için tokenların bireysel sahipliğini
  takip eder.

- İlişkili Token Hesabı, sahibinin ve mint hesabının adreslerinden türetilen
  bir adres ile oluşturulan Token Hesabıdır.

---

## Token Programı

[Token Programı](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program),
ağda (hem fungible hem de non-fungible) tokenlarla etkileşim için tüm
talimat mantığını içerir. Solana'daki tüm tokenlar, etkili bir şekilde
`veri hesapları` tarafından
Token Programı tarafından sahiplenilmektedir.

Token Programı talimatlarının tam listesini
[buradan](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/instruction.rs)
bulabilirsiniz.

![Token Programı](../../images/solana/public/assets/docs/core/tokens/token-program.svg)

Yaygın olarak kullanılan birkaç talimat şunlardır:

- [`InitializeMint`](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/processor.rs#L29):
  Yeni bir token türünü temsil etmek için yeni bir mint hesabı oluşturun.
- [`InitializeAccount`](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/processor.rs#L84):
  Belirli bir türde tokenın (mint) birimlerini tutmak için yeni bir token
  hesabı oluşturun.
- [`MintTo`](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/processor.rs#L522):
  Belirli bir türde token için yeni birimler oluşturun ve bunları bir token
  hesabına ekleyin. Bu, tokenın arzını artırır ve sadece mint hesabının mint
  yetkisi olan kişi tarafından yapılabilir.
- [`Transfer`](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/processor.rs#L228):
  Belirli bir türde tokenın bir token hesabından diğerine transfer edilmesi.

---

### Mint Hesabı

Solana'daki tokenlar, Token Programı tarafından sahiplenilen bir
[Mint Hesabı](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/state.rs#L18-L32)
adresine göre benzersiz bir şekilde tanımlanır. Bu hesap, belirli bir token için
küresel bir sayaç işlevi görür ve aşağıdaki verileri saklar:

- Arz: Tokenın toplam arzı
- Ondalık: Tokenın ondalık hassasiyeti
- Mint yetkisi: Yeni token birimlerini oluşturmak için yetkilendirilen hesap,
  böylece arzı artırır.
- Dondurma yetkisi: "Token hesaplarından" tokenların transfer edilmesini
  dondurmak için yetkilendirilen hesap.

![Mint Hesabı](../../images/solana/public/assets/docs/core/tokens/mint-account.svg)

Her Mint Hesabında saklanan tam detaylar aşağıdaki gibidir:

```rust
pub struct Mint {
    /// Yeni tokenları mintlemek için kullanılan isteğe bağlı yetki. Mint yetkisi
    /// yalnızca mint oluşturulması sırasında sağlanabilir. Eğer mint yetkisi yoksa
    /// o zaman mint sabit bir arza sahip olur ve daha fazla token mintlenemez.
    pub mint_authority: COption<Pubkey>,
    /// Tokenların toplam arzı.
    pub supply: u64,
    /// Ondalık kesirinin sağında kaç tane base 10 basamağı olduğunu.
    pub decimals: u8,
    /// Eğer `true` ise bu yapı başlatılmıştır.
    pub is_initialized: bool,
    /// Token hesaplarını dondurmak için isteğe bağlı yetki.
    pub freeze_authority: COption<Pubkey>,
}
```

Referans olarak, işte bir Solana Explorer linki:
[USDC Mint Hesabı](https://explorer.solana.com/address/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v).

---

### Token Hesabı

Belirli bir tokenın her bir biriminin bireysel mülkiyetini takip etmek için,
Token Programı tarafından sahiplenen başka bir veri hesabı oluşturulmalıdır. Bu
hesaba
[Token Hesabı](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/state.rs#L89-L110)
denir.

Token Hesabında saklanan en yaygın veriler aşağıdaki gibidir:

- Mint: Token Hesabının sahip olduğu token türü
- Sahibi: Token Hesabından tokenları transfer etme yetkisine sahip hesap
- Miktar: Token Hesabının şu anda tuttuğu token birimlerinin sayısı

![Token Hesabı](../../images/solana/public/assets/docs/core/tokens/token-account.svg)

Her Token Hesabında saklanan tam detaylar aşağıdaki gibidir:

```rust
pub struct Account {
    /// Bu hesabın ilişkili olduğu mint
    pub mint: Pubkey,
    /// Bu hesabın sahibi.
    pub owner: Pubkey,
    /// Bu hesabın tuttuğu token miktarı.
    pub amount: u64,
    /// Eğer `delegate` `Some` ise, `delegated_amount` delegate tarafından yetkilendirilen 
    /// miktarı temsil eder.
    pub delegate: COption<Pubkey>,
    /// Hesabın durumu
    pub state: AccountState,
    /// Eğer is_native.is_some ise, bu doğal bir token'dır ve değer, kira muafiyet
    /// rezervini kaydeder. Bir Hesabın kira muaf olması gerekmektedir, bu yüzden
    /// değer, Processor tarafından sarmalanmış SOL hesaplarının bu eşiğin altına düşmemesi
    /// için kullanılır.
    pub is_native: COption<u64>,
    /// Yetkili kapatma
    pub delegated_amount: u64,
    /// Hesabı kapatmak için isteğe bağlı yetki.
    pub close_authority: COption<Pubkey>,
}
```

Bir cüzdanın belirli bir tokenın birimlerini sahiplenebilmesi için, cüzdanın
belirli bir token türü için bir token hesabı oluşturması gerekir (mint), bu
hesap cüzdanı token hesabının sahibi olarak belirtir. Bir cüzdan, aynı token
türü için birden fazla token hesabı oluşturabilir, ancak her token hesabı yalnızca
bir cüzdan tarafından sahiplenilebilir ve bir token türünün birimlerini
tutabilir.

![Hesap İlişkisi](../../images/solana/public/assets/docs/core/tokens/token-account-relationship.svg)

> Her Token Hesabının verilerinin, belirli bir Token Hesabına kimlerin sahipliği
> hakkında bilgi veren bir `owner` alanı içerdiğini unutmayın. Bu, 
> `AccountInfo` içinde belirtilen program
> sahibinden ayrıdır, bu program Token Hesapları için Token Programıdır.

---

### İlişkili Token Hesabı

Belirli bir mint ve sahibin token hesabının adresini bulma sürecini
basitleştirmek için, genellikle İlişkili Token Hesaplarını kullanırız.

İlişkili Token Hesabı, sahibinin adresi ve mint hesabının adresi kullanılarak
belirlenmiş bir şekilde türetilen bir token hesabıdır. İlişkili Token Hesabını,
belirli bir mint ve sahibi için "varsayılan" token hesabı olarak düşünebilirsiniz.

İlişkili Token Hesabı'nın, farklı bir token hesabı türü olmadığını anlamak önemlidir.
Bu, yalnızca belirli bir adres ile bir token hesabıdır.

![İlişkili Token Hesabı](../../images/solana/public/assets/docs/core/tokens/associated-token-account.svg)

Bu, Solana geliştirmesinde ana bir konsepti tanıtır:
`Program Türetilmiş Adres (PDA)`. Kavramsal olarak, bir PDA, bazı önceden tanımlanmış girdi kullanarak bir adres oluşturmanın deterministik bir yolunu sağlar. Bu, belirli bir zamanda bir hesabın adresini kolayca bulmamıza olanak tanır.

İşte bir [Solana Playground](https://beta.solpg.io/656a2dd0fb53fa325bfd0c41) örneği
USDC İlişkili Token Hesabı adresini ve sahibi tespit eden bir örnektir. Aynı mint
ve sahibin adresi için her zaman
[aynı adresi](https://explorer.solana.com/address/4kokFKCFMxpCpG41yLYkLEqXW8g1WPfCt2NC9KGivY6N)
üretecektir.

```ts
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
  USDC_MINT_ADDRESS,
  OWNER_ADDRESS,
);
```

Özellikle, bir İlişkili Token Hesabı'nın adresi, aşağıdaki girdiler kullanılarak türetilmektedir. Aşağıda, bir
[Solana Playground](https://beta.solpg.io/656a31d0fb53fa325bfd0c42) örneği, önceki örnekle aynı adresi
oluşturmaktadır.

```ts
import { PublicKey } from "@solana/web3.js";

const [PDA, bump] = PublicKey.findProgramAddressSync(
  [
    OWNER_ADDRESS.toBuffer(),
    TOKEN_PROGRAM_ID.toBuffer(),
    USDC_MINT_ADDRESS.toBuffer(),
  ],
  ASSOCIATED_TOKEN_PROGRAM_ID,
);
```

İki cüzdanın aynı token türünde birimlere sahip olabilmesi için, her cüzdanın
belirli mint hesabı için kendi token hesabına ihtiyacı vardır. Aşağıdaki
görsel, bu hesap ilişkisinin nasıl göründüğünü gösterir.

![Genişletilmiş Hesap İlişkisi](../../images/solana/public/assets/docs/core/tokens/token-account-relationship-ata.svg)

---

## Token Örnekleri

[`spl-token` CLI](https://docs.solanalabs.com/cli) SPL tokenları ile
deney yapmak için kullanılabilir. Aşağıdaki örneklerde, CLI komutlarını
tarayıcıda doğrudan çalıştırmak için 
[Solana Playground](https://beta.solpg.io/) terminalini kullanacağız ve CLI'yi
yerel olarak yüklemeye gerek kalmayacaktır.

Tokenların ve hesapların oluşturulması, hesap kiralama depozitleri ve işlem
ücretleri için SOL gerektirir. Eğer Solana Playground'u ilk kez kullanıyorsanız,
bir Playground cüzdanı oluşturun ve Playground terminalinde `solana airdrop`
komutunu yürütün. Ayrıca, kamu
[web musluğu](https://faucet.solana.com/) kullanarak devnet SOL alabilirsiniz.

```sh
solana airdrop 2
```

Mevcut komutlar hakkında tam açıklama için `spl-token --help` komutunu
çalıştırın.

```sh
spl-token --help
```

Alternatif olarak, aşağıdaki komut ile spl-token CLI'yi yerel olarak
yükleyebilirsiniz. Bu öncelikle [Rust'ı](https://rustup.rs/) yüklemeyi gerektirir.

> Aşağıdaki bölümlerde, CLI komutlarını çalıştırdığınızda görüntülenen hesap
> adreslerinin, aşağıda gösterilen örnek çıktıdan farklı olacağını unutmayın. Lütfen
> takip ederken, Playground terminalinizde gösterilen adresi kullanın. Örneğin,
> `create-token` çıktısındaki adres, Playground cüzdanınızın mint yetkisi olarak ayarlandığı
> mint hesabıdır.

---

### Yeni Bir Token Oluşturma

Yeni bir token (`mint hesabı`) oluşturmak için, Solana
Playground terminalinde aşağıdaki komutu çalıştırın.

```sh
spl-token create-token
```

Aşağıda, aşağıdaki gibi bir çıktı görmelisiniz. Token ve işlem detaylarını
görüntülemek için 
[Solana Explorer](https://explorer.solana.com/?cluster=devnet) adresini
kullanabilirsiniz.

Aşağıdaki örnek çıktıdaki yeni tokenın benzersiz tanımlayıcısı (adres) 
`99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg`dir.

```shell filename="Terminal Çıktısı" /99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg/
Token oluşturuluyor: 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg

Adres:  99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg
Ondalık:  9

İmzalı: 44fvKfT1ezBUwdzrCys3fvCdFxbLMnNvBstds76QZyE6cXag5NupBprSXwxPTzzjrC3cA6nvUZaLFTvmcKyzxrm1
```

Yeni tokenların başlangıçta hiç arzı yoktur. Bir tokenın mevcut arzını kontrol
etmek için aşağıdaki komutu kullanabilirsiniz:

```sh
spl-token supply <TOKEN_ADDRESS>
```

Yeni oluşturulan bir token için `supply` komutunu çalıştırmak, `0` değerini
döndürecektir:

```sh /99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg/
spl-token supply 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg
```

Yeni bir Mint Hesabı oluşturmak, iki talimatla bir işlem göndermeyi gerektirir.
İşte, [Solana Playground](https://beta.solpg.io/660ce32ecffcf4b13384d00f) üzerinde
Javascript örneği:

1. Yeni bir hesap oluşturmak için Sistem Programını çağırın ve ardından Token
   Programına sahipliği devredin.

2. Token Programını çağırarak yeni hesabın verilerini Mint Hesabı olarak
   başlatın.

---

### Token Hesabı Oluşturma

Belirli bir tokenın birimlerini tutmak için öncelikle bir
`token hesabı` oluşturmalısınız. Yeni bir token hesabı
oluşturmak için, aşağıdaki komutu kullanın:

```sh
spl-token create-account [OPTIONS] <TOKEN_ADDRESS>
```

Örneğin, Solana Playground terminalinde aşağıdaki komutu çalıştırmak:

```sh /99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg/
spl-token create-account 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg
```

Aşağıdaki çıktıyı döndürür:

- `AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9`, `create-account`
  komutunda belirtilen tokenın birimlerini tutmak için oluşturulan token
  hesabının adresidir.

```shell filename="Terminal Çıktısı" /AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9/
Hesap oluşturuluyor: AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9

İmzalı: 2BtrynuCLX9CNofFiaw6Yzbx6hit66pup9Sk7aFjwU2NEbFz7NCHD9w9sWhrCfEd73XveAGK1DxFpJoQZPXU9tS1
```

Varsayılan olarak `create-account` komutu, cüzdan adresinizi token hesabı
sahibi olarak gösteren bir
`ilişkili token hesabı` oluşturur.

Farklı bir sahibin token hesabını oluşturmak için aşağıdaki komutu kullanabilirsiniz:

```sh
spl-token create-account --owner <OWNER_ADDRESS> <TOKEN_ADDRESS>
```

Örneğin, aşağıdaki komutu çalıştırmak:

```sh /2i3KvjDCZWxBsqcxBHpdEaZYQwQSYE6LXUMx5VjY5XrR/
spl-token create-account --owner 2i3KvjDCZWxBsqcxBHpdEaZYQwQSYE6LXUMx5VjY5XrR 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg
```

Aşağıdaki çıktıyı döndürür:

- `Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt`, `create-account` 
  komutunda belirtilen tokenın birimlerini tutmak için oluşturulan token
  hesabının adresidir (`99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg`) ve `--owner`
  bayrağının ardından belirtilen adres tarafından sahiplenilmektedir
  (`2i3KvjDCZWxBsqcxBHpdEaZYQwQSYE6LXUMx5VjY5XrR`). Bu, başka bir kullanıcı için
  bir token hesabı oluşturmanız gerektiğinde kullanışlıdır.

```shell filename="Terminal Çıktısı" /Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt/
Hesap oluşturuluyor: Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt

İmzalı: 44vqKdfzspT592REDPY4goaRJH3uJ3Ce13G4BCuUHg35dVUbHuGTHvqn4ZjYF9BGe9QrjMfe9GmuLkQhSZCBQuEt
```

Bir İlişkili Token Hesabı oluşturmak için, yalnızca bir talimat gerektiren
tek bir işlem gereklidir:
[İlişkili Token Programı](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/associated-token-account/program/src)
ile. İşte bir Javascript örneği
[Solana Playground](https://beta.solpg.io/660ce868cffcf4b13384d011) üzerinde.

İlişkili Token Programı, 
`Cross Program Invocations` kullanarak:
- [Sistem Programını çağırma](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/associated-token-account/program/src/tools/account.rs#L19)
  yeni hesabın adresi olarak sağlanan PDA’yı kullanarak yeni bir hesap oluşturmak.
- [Token Programını çağırma](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/associated-token-account/program/src/processor.rs#L138-L161)
  yeni hesabın Token Hesap verilerini başlatmak için.

Alternatif olarak, rastgele üretilmiş bir anahtar çiftini kullanarak yeni bir
Token Hesabı oluşturmak (İlişkili Token Hesabı değil) iki talimatla bir işlem
göndermeyi gerektirir. İşte bir Javascript örneği
[Solana Playground](https://beta.solpg.io/660ce716cffcf4b13384d010) üzerinde.

1. Token Hesabı verileri için yeterli alana sahip yeni bir hesap oluşturmak için
   Sistem Programını çağırın ve ardından Token Programına sahipliği devredin.

2. Token Programını çağırarak yeni hesabın verilerini Token Hesabı olarak başlatın.

---

### Tokenları Mintleme

Yeni token birimlerini oluşturmak için aşağıdaki komutu kullanın:

```sh
spl-token mint [OPTIONS] <TOKEN_ADDRESS> <TOKEN_AMOUNT> [--] [ALICI_TOKEN_HESABI_ADRESİ]
```

Örneğin, aşağıdaki komutu çalıştırmak:

```sh
spl-token mint 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg 100
```

Aşağıdaki çıktıyı döndürür:

- `99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg`, tokenların mintlendiği (toplam
  arzı artıran) mint hesabının adresidir.

- `AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9`, tokenların mintlendiği
  cüzdanın token hesabının adresidir (miktarın artırılması).

```shell filename="Terminal Çıktısı" /99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg/ /AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9/
100 token mintleniyor
  Token: 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg
  Alıcı: AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9

İmzalı: 2NJ1m7qCraPSBAVxbr2ssmWZmBU9Jc8pDtJAnyZsZJRcaYCYMqq1oRY1gqA4ddQno3g3xcnny5fzr1dvsnFKMEqG
```

Tokenları farklı bir token hesabına mintlemek için, alıcı token hesabının
adresini belirtin. Örneğin, aşağıdaki komutu çalıştırmak:

```sh /Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt/
spl-token mint 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg 100 -- Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt
```

Aşağıdaki çıktıyı döndürür:

- `99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg`, tokenların mintlendiği (toplam
  arzı artıran) mint hesabının adresidir.

- `Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt`, tokenların mintlendiği
  token hesabının adresidir (miktarın artırılması).

```shell filename="Terminal Çıktısı" /99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg/ /Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt/
100 token mintleniyor
  Token: 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg
  Alıcı: Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt

İmzalı: 3SQvNM3o9DsTiLwcEkSPT1Edr14RgE2wC54TEjonEP2swyVCp2jPWYWdD6RwXUGpvDNUkKWzVBZVFShn5yntxVd7
```

Tekrar belirtmek gerekirse, token birimlerini mintlemek, Token Programı'nda
`MintTo` talimatını çağırmayı gerektirir. Bu talimat, mint yetkisi ile
imzalanmalıdır. Bu talimat, tokenın yeni birimlerini bir Token Hesabına
mintler ve Mint Hesabında toplam arzı artırır. İşte bir Javascript örneği
[Solana Playground](https://beta.solpg.io/660cea45cffcf4b13384d012).

### Transfer Tokenları

Bir tokenın bir token hesabı arasında transferi için aşağıdaki komutu kullanın:

```sh
spl-token transfer [OPTIONS] <TOKEN_ADDRESS> <TOKEN_AMOUNT> <RECIPIENT_ADDRESS or RECIPIENT_TOKEN_ACCOUNT_ADDRESS>
```

> **İpucu:** Aşağıdaki örnekteki gibi, doğru adres ve miktarı girmeyi unutmayın.  
> — Kötü girişler işlem hatalarına yol açabilir.

Örneğin, aşağıdaki komutu çalıştırmak:

```sh
spl-token transfer 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg 100 Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt
```

Aşağıdaki çıktıyı verir:

- `AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9` transferin yapıldığı token hesabının adresidir. Bu, transfer edilen belirli token için sizin token hesabınızın adresi olacaktır.
- `Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt` tokenların transfer edildiği token hesabının adresidir.

```shell filename="Terminal Output" /AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9/ /Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt/
Transfer 100 token
  Gönderen: AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9
  Alıcı: Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt

İmza: 5y6HVwV8V2hHGLTVmTmdySRiEUCZnWmkasAvJ7J6m7JR46obbGKCBqUFgLpZu5zQGwM4Xy6GZ4M5LKd1h6Padx3o
```

Temelinde, token transferi `Transfer` komutunu Token Programı üzerinde çağırmayı gerektirir. Bu komut, gönderenin Token Hesabı sahibi tarafından imzalanmalıdır. Komut, bir tokenın bir Token Hesabından diğerine transferini gerçekleştirir. İşte bir Javascript örneği [Solana Playground](https://beta.solpg.io/660ced84cffcf4b13384d013) üzerinde.

> **Önemli:** Gönderen ve alıcının transfer edilen belirli token türü için mevcut token hesaplarına sahip olmaları önemlidir. Gönderen, genellikle İlişkili Token Hesabı olan alıcının token hesabını oluşturmak için işlem üzerine ek talimatlar ekleyebilir.

---

### Token Metadata Oluşturma

Token Extensions Programı, Mint Hesabı üzerinde doğrudan saklanabilen ek özelleştirilebilir metadata (isim, sembol, resim bağlantısı gibi) sağlar.


@@@ Bilgi: Token Extensions CLI bayraklarını kullanmak için gerekenler

Token Extensions CLI bayraklarını kullanmak için, CLI'nin yerel bir kurulumuna sahip olduğunuzdan emin olun, sürüm 3.4.0 veya daha yeni:

```sh
cargo install --version 3.4.0 spl-token-cli
```



Metadata uzantısı etkinleştirilmiş yeni bir token oluşturmak için, aşağıdaki komutu kullanın:

```sh
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata
```

Komut, aşağıdaki çıktıyı verir:

- `BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP` metadata uzantısı etkinleştirilmiş yeni oluşturulan tokenın adresidir.

```shell filename="Terminal Output" /BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP/
Token BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP oluşturuluyor, program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb altında
Mint içindeki metadata'yı başlatmak için lütfen `spl-token initialize-metadata BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP <YOUR_TOKEN_NAME> <YOUR_TOKEN_SYMBOL> <YOUR_TOKEN_URI>` komutunu yürütün ve mint yetkisi ile imzalayın.

Adres:  BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP  
Haneler:  9

İmza: 5iQofFeXdYhMi9uTzZghcq8stAaa6CY6saUwcdnELST13eNSifiuLbvR5DnRt311frkCTUh5oecj8YEvZSB3wfai
```

Metadata uzantısı etkinleştirilmiş yeni bir token oluşturulduktan sonra, metadata'yı başlatmak için aşağıdaki komutu kullanın.

```sh
spl-token initialize-metadata <TOKEN_MINT_ADDRESS> <YOUR_TOKEN_NAME> <YOUR_TOKEN_SYMBOL> <YOUR_TOKEN_URI>
```

Token URI genellikle token ile ilişkilendirmek istediğiniz offchain metadata'ya bir bağlantıdır. JSON formatının bir örneğini [burada](https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json) bulabilirsiniz.

> **Dikkat:** Aşağıdaki komut, ek metadata'yı belirli mint hesabında doğrudan saklayacaktır:

```sh
spl-token initialize-metadata BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP "TokenName" "TokenSymbol" "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json"
```

Ardından mint hesabının adresini bir gezgin üzerinde metadata'yı incelemek için arayabilirsiniz. Örneğin, metadata uzantısı etkinleştirilmiş tokenı burada bulabilirsiniz: [SolanaFm](https://solana.fm/address/BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP?cluster=devnet-solana).

Daha fazla bilgi edinmek için [Metadata Extension Guide](https://solana.com/developers/guides/token-extensions/metadata-pointer) sayfasını ziyaret edebilirsiniz. Çeşitli Token Extensions ile ilgili daha fazla ayrıntı için Token Extensions [Başlarken Kılavuzu](https://solana.com/developers/guides/token-extensions/getting-started) ve [SPL belgeleri](https://spl.solana.com/token-2022/extensions) sayfasına göz atabilirsiniz.