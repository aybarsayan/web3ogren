---
title: Hesaplar - BNB Greenfield Temel Kavramları
description: Greenfield, hesabını BSC ve Ethereum ile aynı formatta tanımlar. Kullanıcılar, kendi adresleri ile depolama nesneleri oluşturabilir, izinleri yönetebilir ve ücretleri ödeyebilirler.
keywords: [BNB Greenfield adresi, BNB Greenfield imzası, dijital imzalar, hesap yönetimi, staking, EIP-712]
order: 1
---

## Hesaplar
Her Greenfield kullanıcısının kendi hesabı için bir tanımlayıcı olan adresi vardır. 
Adresler, Greenfield üzerinde depolama nesneleri oluşturabilir, izinleri taşıyabilir ve yönetebilir ve ücretleri ödeyebilir.

Greenfield, hesabını BSC ve Ethereum ile aynı formatta tanımlar. 
Anahtarlar için ECDSA secp256k1 eğrisi ile başlar ve 
tam [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) yolları için [EIP84](https://github.com/ethereum/EIPs/issues/84) ile uyumludur. 
Greenfield tabanlı hesaplar için kök HD yolu m/44'/60'/0'/0'dır. Okunabilir sunumda, bir Greenfield adresi, 
kontrol eden hesabın genel anahtarının son 20 baytından türetilen 0x ile başlayarak 42 karakterlik bir onaltılık dizidir.

:::info
Bu uyumlu adres şeması ile kullanıcılar, Greenfield üzerindeki mevcut BSC hesaplarını ve altyapısını yeniden kullanabilir. Örneğin, BNB'lerini BSC'den Greenfield'a aktarırken TrustWallet ve Metamask (veya diğer uyumlu cüzdanlar) kullanabilirler.

:::note
Ayrıca, her iki BSC ve Greenfield üzerindeki aynı adreslere atıfta bulunarak aynı sahipleri kolayca tanımlamak mümkündür.

### Kullanıcı Bakiyesi

Hesap, BNB bakiyesi tutabilir. Bu BNB'ler, staking'e katılmak, 
Greenfield işlemlerinin gaz ücretlerini ödemek ve Greenfield hizmetleri için kullanılabilir.

Bu bakiye, Greenfield üzerindeki yerel BNB transferi ile eklenebilir veya 
Greenfield ile BSC arasında zincirler arası transfer ile aktarılabilir.

---

### Hesap Tanımı

Greenfield'de bir **hesap**, bir `PubKey` ve `PrivKey` çiftini tanımlar. 
`PubKey`, çeşitli `Adresler` oluşturmak için türetilerek 
uygulamada kullanıcıları (diğer taraflar arasında) tanımlamak için kullanılır.

### İmzalar

Bir kullanıcının kimliğini doğrulamanın ana yolu, [dijital imzalar](https://en.wikipedia.org/wiki/Digital_signature) kullanarak yapılır. 
Kullanıcılar, işlemleri kendi özel anahtarları ile imzalar. İmza doğrulaması, ilgili genel anahtar ile yapılır. 
Zincir üstü imza doğrulaması amacıyla, genel anahtarı `Account` nesnesinde (doğru bir işlem doğrulaması için gerekli diğer verilerle birlikte) saklarız.

> Düğümlerde, tüm veriler [Protocol Buffers](https://protobuf.dev/) serileştirmesi ile saklanır.

Greenfield, dijital imza oluşturmak için yalnızca [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) anahtar şemalarını destekler:

|             | Adres uzunluğu (bayt) | Genel anahtar uzunluğu (bayt) | İşlem kimlik doğrulaması için kullanılır | Konsensüs için kullanılır (Tendermint) |
| :---------: | :---------------------: | :----------------------------: | :-------------------------------------: | :-----------------------------------: |
| `secp256k1` |           20            |              33                |                  evet                   |                hayır                  |

### Adresler

`Adresler` ve `PubKey`'ler, uygulamadaki aktörleri tanımlayan her ikisi de kamu bilgisi olan bilgilerdir. `Account`, kimlik doğrulama bilgilerini saklamak için kullanılır. Temel hesap uygulaması, bir `BaseAccount` nesnesi tarafından sağlanır.

Kullanıcıları tanımlamak için Greenfield, `AccAddress` değişkenini kullanır. Adres formatı [ERC-55](https://eips.ethereum.org/EIPS/eip-55) standardını takip eder.

## Anahtar Yönetimi

Greenfield blok zinciri, EVM'siz bir uygulama özel zincirdir. 
Sonuç olarak, işlem veri yapısı ve API'si BSC'den farklıdır. 
Greenfield, mevcut cüzdanlarda Transfer, İşlem Gönderme gibi tam işlevleri desteklemeyecektir. 
Ancak, bu cüzdanlar [EIP712](https://eips.ethereum.org/EIPS/eip-712) standardını kullanarak işlemleri imzalayabilir. 
Bu standart, cüzdanların imza istemlerinde verileri yapılandırılmış ve okunabilir bir formatta görüntülemesine olanak tanır. 

> Bu, Metamask'ta kullanılışı hakkında bir [örnek](https://medium.com/metamask/eip712-is-coming-what-to-expect-and-how-to-use-it-bb92fd1a7a26) olup, 
sonuç olarak cüzdanlar, Greenfield'ı doğrudan desteklemeye başlayacaktır.

### EIP-712 Desteği

Greenfield zinciri, EIP-712 yapılandırılmış işlemlerini destekler ve yalnızca bunları destekler. 
Bu, mevcut cüzdan altyapısının Greenfield ile doğal bir şekilde etkileşimde bulunmasına olanak tanır.

Bunu başarmak için aşağıdaki değişiklikler yapılmıştır.

1. Ethereum uyumlu bir RPC arka ucu. Not edilmelidir ki yalnızca bir cüzdanı bağlamak için gerekli olan 
   yöntemleri destekliyoruz (`eth_chainId`, `eth_networkId`, `eth_blockNumber`, `eth_getBlockByNumber` ve `eth_getBalance`). Diğer RPC yöntemleri uygulanmamıştır.
2. Ethereum ile aynı imza algoritması (`eth_scep256k1`).

Geliştiriciler, kolay entegrasyon için [greenfield-go-sdk](https://github.com/bnb-chain/greenfield-go-sdk) ve 
[greenfield-js-sdk](https://github.com/bnb-chain/greenfield-js-sdk) kaynaklarına başvurabilirler.

### Anahtar Arayüzü

`Keyring` arayüzü, greenfield-cosmos-sdk'de anahtar yönetimi için temel arayüzdür. 
Bir türün bir anahtar depolama arka ucu olarak kullanılabilmesi için uygulaması gereken yöntemleri tanımlar. 
Bu yöntemler şunları içerir:

- `Get`: bir anahtarı adıyla alır.
- `List`: anahtar halkasında saklanan tüm anahtarları listeler.
- `Delete`: bir anahtarı adıyla siler.
- `Sign`: bir anahtarı kullanarak bir mesajı imzalar.

:::tip
Bu yöntemleri uygulayarak, uygulamanızın özel ihtiyaçlarını karşılayan özel bir anahtar depolama arka ucu oluşturabilirsiniz.

Bu, anahtarınızı yönetmek için `Keyring` arayüzünü takip etmeniz gerektiği anlamına gelmez; mevcut Ethereum cüzdanlarının 
Greenfield için de geçerli olduğunu hatırlayın.

### Arka Uç Seçenekleri

greenfield-cosmos-sdk, anahtar depolama için farklı seçenekler sunar; her birinin kendine özgü güçlü ve zayıf yönleri vardır. 
Arka uç seçimi, belirli kullanım durumunuza bağlı olacaktır. İşte mevcut seçenekler:

#### Sistem Seçenekleri

- **os**: Bu arka uç, anahtar depolama işlemlerini güvenli bir şekilde yönetmek için `işletim sistemi`nin varsayılan kimlik bilgileri deposunu kullanır. 
  Anahtar halkası, kullanıcının oturumu boyunca açık kalabilir.

- **memory**: Bu arka uç, geçici bir depolama kullanır; yani Anahtarlar, süreç sona erdiğinde veya tür örneği bellekten silindiğinde atılır.

#### Araç Seçenekleri

- **file**: Bu arka uç, anahtar halkasını uygulamanın yapılandırma dizininde şifrelenmiş halde saklar. Bu anahtar halkası, her erişimde bir şifre talep eder ve bu, tek bir komut içinde birden çok kez gerçekleşebilir ve bu da tekrarlanan şifre istemlerine neden olabilir.

- **kwallet**: Bu arka uç, bir kimlik bilgisi yönetim uygulaması olarak `KDE Cüzdan Yöneticisi`ni kullanır.

- **pass**: Bu arka uç, anahtarları saklamak ve almak için `pass` komut satırı yardımcı programını kullanır.

- **test**: Bu arka uç, anahtarları güvensiz bir şekilde diske saklar. Kilidi açmak için şifre istemez ve yalnızca test amaçları için kullanılmalıdır.

### Desteklenen İmza Algoritmaları

greenfield-cosmos-sdk, kullanıcıların istediği kadar imza algoritmasını destekler; ancak Greenfield bağlamında yalnızca 
`eth_secp256k1` ve `ed25519` desteklenir. Bu algoritmalar, güvenliği ve Ethereum ile Tendermint ekosistemleriyle uyumluluğu nedeniyle seçilmiştir.