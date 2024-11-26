---
date: 2024-04-30T00:00:00Z
difficulty: intro
title: "Solana'da bir token oluşturma"
description: "Solana'da nasıl bir token oluşturulacağını öğrenin."
tags:
  - quickstart
  - token 2022
  - token extensions
  - metaplex
  - cli
  - token
keywords:
  - tutorial
  - solana geliştirmeye giriş
  - blokzincir geliştiricisi
  - blokzincir eğitimi
  - web3 geliştiricisi
  - token
  - metadata
  - spl
  - spl token
---

Bu kılavuzda, Solana üzerinde yeni bir token oluşturacaksınız. Solana CLI, yeni
[Token Extensions programı](https://solana.com/news/token-extensions-developer-guide) ve
[Token Metadata extension](https://solana.com/developers/guides/token-extensions/metadata-pointer) kullanacağız,
bu sayede işlemi biraz basitleştirebileceğiz.

:::note
Bu kılavuzdaki adımlar, Token Extensions Programı için geçerlidir; yani program ID'si
`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`dir. Bu Token Extensions programı,
metadata - token adı, sembolü ve resimleri tanımlayan dosyanın URI'si gibi - bilgilerini
[token mint üzerinde doğrudan saklamamıza](https://explorer.solana.com/address/mntTymSqMU4e1NEDdxJ9XoPN4MitCgQ7xxGW6AuRAWQ?cluster=devnet) olanak tanır.
Eski Token Programı, yani program ID'si
`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`, metadata'yı mintimizin dışında
ekstra bir hesapta saklamayı gerektiriyordu. Metadata uzantısını kullanan token'lar,
Solana Cüzdanları ve Keşifleri tarafından geniş bir destek alırken, dilerseniz
[eski token programını ve Metaplex'i](https://developers.metaplex.com/token-metadata) de kullanabilirsiniz.
:::

## Solana Araçlarını Yükleme

Öncelikle, sistemimize Solana araçlarını indirmemiz gerekiyor. Solana CLI'yi
`yüklemek için bu kılavuzu` izleyin.

## Klasör Oluşturma

Yeni bir terminal açın ve yeni bir klasör oluşturun:

```bash
mkdir new-token
cd new-token
```

## Mint Yetkisi için bir anahtar çifti oluşturma

Birazdan, özel token'ımızı yaratacak olan bir **token mint hesabı** oluşturacağız. Ancak
bunu yapmadan önce, bu fabrikayı yönetecek olan **mint yetkisi** için bir hesap
oluşturmamız gerekiyor. Bu hesabı **freeze authority** ve **metadata update authority** olarak
da kullanacağız. Bu hesap, yeni token'lar mintleme, mint'i dondurma veya token'ımızın
metadata'sını güncelleme işlemlerinin imzasını atmak zorunda kalacak.

`bos` ile başlayan bir anahtar çifti oluşturalım; bu, 'boss' kelimesinin kısaltması.
Daha fazla harf ekleyebilirsiniz, ancak anahtarın üretilmesi daha uzun sürecektir.
Dört harf hala makul, ama beş harf almak uzun zaman alacaktır.

```bash
solana-keygen grind --starts-with bos:1
```

Bu, genel anahtarın adıyla adlandırılmış bir JSON dosyasına anahtar çiftini kaydedecektir:

```bash
bosy1VC2BH2gh5fdXA3oKn53EuATLwapLWC4VR2sGHJ.json
```

> Yukarıdaki `bos` genel anahtarını, sonraki adımlarda mint yetkisi olarak kullanacağınız
> genel anahtar ile değiştirin!

Mint yetkisi anahtar çifti dosyasının içeriğini güvende tutun. Anahtarın sahibi, token
mintleyebilecek, metadata'yı güncelleyebilecek ve potansiyel olarak token hesaplarını
dondurabilecektir!

Solana CLI'yi kullandığımız anahtar çiftini ayarlayacak şekilde yapılandırın, örneğin:

```bash
solana config set --keypair bosy1VC2BH2gh5fdXA3oKn53EuATLwapLWC4VR2sGHJ.json
```

Ayrıca Solana CLI'yi devnet kullanacak şekilde ayarlayacağız:

```bash
solana config set --url devnet
```

Bundan sonra, CLI'den gerçekleştirdiğiniz tüm işlemler `bos` anahtar çifti kullanılarak
imzalanacak ve devnet üzerinde gerçekleştirilecektir.

Mevcut yapılandırmayı görmek için şunu çalıştırabilirsiniz:

```bash
solana config get
```

![`solana config get` devnet ve mint yetki hesabımızı gösteriyor](../../../images/solana/public/assets/guides/make-a-token/solana-config-get.png)

## Mint yetkisi için Devnet SOL al

![Solana Faucet](../../../images/solana/public/assets/guides/make-a-token/solana-faucet.png)

Solana devnet için sadece ücretsiz SOL alabileceğiz, [DevNet faucet](https://faucet.solana.com) üzerinden. Eğer oran sınırlamaya uğrarsanız, `devnet SOL almak için bu kılavuzu` takip edin.
Mint yetkisi hesabınızı finanse etmeyi unutmayın - yani `new-token` klasörünüzde `bos`
ile başlayan anahtar çiftini. Adresinizi almak için, şunu çalıştırabilirsiniz:

```bash
solana address
```

Ana ağı (mainnet) kullanıyorsanız, hesabı gerçek SOL ile finanse etmeniz gerekecek. SOL satın alabileceğiniz merkezi borsa, kripto on-ramp'lar veya merkezi olmayan borsalarda diğer token'ları SOL ile takas edebilirsiniz.

## Bir Mint Adresi Oluşturma

Özel token'ımızı oluşturmak için kullanacağımız bir **Mint Hesabı** için bir adet daha
adres oluşturalım. Bunun `mnt` ile başlamasını sağlayarak bunun token **mint hesabı** olduğunu
hatırlayabiliriz.

```bash
solana-keygen grind --starts-with mnt:1
```

Yeni bir anahtar çifti, genel anahtarın adıyla kaydedilecektir: 
`mntTymSqMU4e1NEDdxJ9XoPN4MitCgQ7xxGW6AuRAWQ.json`

> `mnt` adresini, sonraki adımlarda token mint hesabınızın adresi ile değiştirin!

## Token mint hesabını oluşturma

Öncelikle, bir ondalık yerini belirleyelim. Bilgisayarlar ikili sistem kullandığı için,
ondalık sayıları iyi bir şekilde işleyemezler. Bu nedenle finansal programlar - hem geleneksel
finansta hem de blokzincirlerde - genellikle değeri **küçük birimlerle** tam olarak
transfer ederler; örneğin, ABD Doları için sent veya GBP için peni. Benzer şekilde, token
için bir ondalık noktası belirleyebilirsiniz. Örneğin, [USDC](https://explorer.solana.com/address/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v) 6 ondalık basamağa sahiptir, yani her
USDC bir milyonuncusuna bölünebilir. 1 USDC transfer etmek için, 1 milyon USDC sent
transfer edersiniz.

Token'ınız için farklı ondalık değerlerini, komuta `--decimals` bayrağını ekleyerek
yapılandırabilirsiniz. Eğer bunu ayarlamazsanız, varsayılan 9'dur.

Şimdi token mint'ini oluşturacağız ve Token Extensions Programı (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`) kullanacağımızı, metadata uzantısının da etkinleştirileceğini belirteceğiz.

`mnt...` adresimizi, yeni tokenımız için `token mint hesabı` olarak kullanacağız:

```bash
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata mntTymSqMU4e1NEDdxJ9XoPN4MitCgQ7xxGW6AuRAWQ.json
```

:::warning
Token mint hesabınızı oluşturduktan sonra daha fazla uzantı ekleyemezsiniz.
:::

## Resim ve offchain metadata oluşturma ve yükleme

Daha sonra token'ımız için offchain metadata oluşturacağız. Bu veriler, insanlar token mint adresimize
baktıklarında [Solana Explorer](https://explorer.solana.com) gibi sitelerde gösterilecektir.

Resmin kare olması ve ya 512x512 ya da 1024x1024 piksel boyutunda olması, mümkünse 100kb'den daha az olması gerekir.

:::tip
İçerisinde (örneğin `image`) referans verilen metadata ve medya, herkese açık bir şekilde erişilebilir bir yerde saklanmalıdır.
:::

Üretim tokenları için, aşağıdakiler gibi merkeziyetsiz bir depolama hizmetinin kullanılması daha uygun kabul edilmektedir:

- [Akord](https://akord.com/) - Arweave'ye yükler; hesabınız olmadan 100Mb için ücretsiz; yüklemeler bir süre alabilir
- [Irys](https://irys.xyz/) - daha önce Bundlr olarak biliniyordu, Arweave'ye yükler
- [Metaboss](https://metaboss.rs/) - Metaplex tarafından
- [NFT Storage](https://nft.storage/) - birçok popüler proje tarafından kullanılır
- [Pinata](https://app.pinata.cloud/) - IPFS'ye yükler; kayıt gerektirir; 1Gb için ücretsiz
- [ShadowDrive](https://www.shdwdrive.com/) - Solana'ya özel bir depolama çözümü
- [web3.storage](https://web3.storage) - ücretsiz plan için kaydolmayı gerektirir - ilk 5Gb ücretsiz, kullanımı kolay

> Eğer merkeziyetsiz depolama çözümleri sağlayıcısıysanız ve burada listelenmek istiyorsanız,
> lütfen 'sayfayı düzenle' butonunu kullanarak bir PR açın.

Test token'ları için, AWS S3, GCP veya GitHub gibi merkezi bir depolama çözümü (işte 'raw' URL formatı `https://raw.githubusercontent.com/...`) kullanmak yeterlidir.

#### Resmi Yükle

Öncelikle, resim dosyanızı istediğiniz çevrimiçi depolama çözümüne yükleyin ve bağlantıyı alın. **Bağlantının doğrudan resim dosyanızı açtığından emin olun!**

```text
https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/CompressedCoil/image.png
```

#### Offchain metadata dosyasını oluşturun ve yükleyin

Bir `metadata.json` dosyası oluşturun, bir isim, sembol ve açıklama ekleyin plus yüklediğiniz resmi:

```json filename="metadata.json"
{
  "name": "Örnek Token",
  "symbol": "EXMPL",
  "description": "Solana Token oluşturma kılavuzundan örnek token.",
  "image": "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/CompressedCoil/image.png"
}
```

Ardından, `metadata.json` dosyasını tercih ettiğiniz depolama sağlayıcısına yükleyin. Sonuçta benzer bir bağlantınız olacak:

```text
https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/CompressedCoil/metadata.json
```

**Bağlantının doğrudan metadata dosyanızı açtığından emin olun!**

Artık bu metadata'yı token'ımıza ekleyebiliriz.

## Metadata'yı token'a ekleme

> Daha önce belirtildiği gibi, bu adım yalnızca Token Extensions programını kullanan
> tokenlar (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`) için geçerlidir, eski Token Programı
> (`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`) için geçerli değildir.

Artık token'ımız için oluşturup yüklediğimiz metadata ile metadata'yı başlatacağız.

```bash
spl-token initialize-metadata mntTymSqMU4e1NEDdxJ9XoPN4MitCgQ7xxGW6AuRAWQ 'Örnek token' 'EXMPL' https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/CompressedCoil/metadata.json
```

Tebrikler, metadata ile bir token oluşturdunuz! Token'ın mint adresine (başlangıcı `mnt` olan) 
Solana Explorer'dan bakın - devnet kullanmayı ihmal etmeyin (devnet üzerinde çalışıyorsanız).

![Metadata'ya sahip token](../../../images/solana/public/assets/guides/make-a-token/token-with-metadata.png)

## Token mintleme

Artık token tamamen kurulmuş durumda, bazı token'lar mintleyebiliriz. 100 mintleyelim.

Öncelikle, token mintimiz için token'ları tutacak bir token hesabı oluşturmamız gerekiyor:

```bash
spl-token create-account mntTymSqMU4e1NEDdxJ9XoPN4MitCgQ7xxGW6AuRAWQ
```

Bu, Solana yapılandırmasında şu anda ayarlanan hesap için yeni bir token hesabı oluşturacaktır. Komutun sonuna adres ekleyerek farklı bir hesabı da belirtebilirsiniz.

Şimdi bu token hesabına token mintlemek için nihayet mintleme işlemini gerçekleştirebiliriz:

```bash
spl-token mint mntTymSqMU4e1NEDdxJ9XoPN4MitCgQ7xxGW6AuRAWQ 100
```

Solana Explorer'ı açın ve yeni token bakiyenize bakın!

![Hesabımızdaki mintlenen token'lar](../../../images/solana/public/assets/guides/make-a-token/minted-tokens-in-new-account.png)

Artık token'ı başka bir token sahibi adresine gönderebilirsiniz, örneğin:

```bash
spl-token transfer mntTymSqMU4e1NEDdxJ9XoPN4MitCgQ7xxGW6AuRAWQ 10 (alıcı cüzdan adresi) --fund-recipient
```

`--fund-recipient` bayrağı, alıcının token hesabını (yani hesap kirasını) oluşturmak için ödeme yapmanıza olanak tanır.

**Artık bir token mintlediniz, token'lar oluşturdunuz ve bunları transfer ettiniz!**

Tebrikler!

## Tokenlar hakkında daha fazla okuma

- [Token uzantıları](https://solana.com/developers/guides/token-extensions/getting-started) - Token'ınıza ek işlevsellik nasıl ekleyeceğinizi öğrenin.
- [a16z'den dış kaynak: Token lansmanları için 5 kural](https://a16zcrypto.com/posts/article/5-rules-for-token-launches/) - Bu makalede, düzenleyici uyumluluk, piyasa koşulları ve topluluk katılımı gibi token lansmanları için önemli yönergeler belirlenmektedir ve kripto girişimcileri için bir temel sağlamaktadır.
- [a16z'den dış kaynak: Token lansman riskleri ile nasıl başa çıkılır](https://a16zcrypto.com/posts/article/navigating-token-launch-risks/) - Bu yazı, token lansmanlarıyla ilgili riskleri yönetme yollarını tartışmakta ve başarılı bir lansman için gerekli olan hukuki zorluklar, piyasa dalgalanması ve teknolojik engeller gibi konuları kapsamaktadır.
- [a16z'den dış kaynak: Bir token lansmanı için hazır olun](https://a16zcrypto.com/posts/article/getting-ready-to-launch-a-token/) - Token lansmanı için hazırlık kılavuzu, teknik ayarlar, ekip uyumu, düzenleyici incelemeler ve katılım stratejileri hakkında bilgi vermekte ve başarılı bir kamuya açık açılış sağlamak için hedeflenmiştir.