---
title: "Program Örnekleri"
description:
  "Kendi projeleriniz için referans olarak kullanabileceğiniz, farklı diller ve frameworklerde Solana program örneklerinin bir listesi."
tags:
  - hızlı başlangıç
  - program
  - anchor
  - javascript
  - yerel
  - rust
  - token22
  - token uzantıları
keywords:
  - rust
  - cargo
  - toml
  - program
  - rehber
  - solana geliştirmeye giriş
  - blockchain geliştirici
  - blockchain rehberi
  - web3 geliştirici
  - anchor
sidebarSortOrder: 3
---

[Solana Program Örnekleri](https://github.com/solana-developers/program-examples) GitHub üzerindeki deposu, Solana programlama paradigması ve dilleri için tasarlanmış çeşitli alt klasörler içermektedir. **Bu örnekler, geliştiricilerin Solana blokzinciri geliştirmesi hakkında bilgi edinmelerine ve denemeler yapmalarına yardımcı olmak için tasarlanmıştır.**

Örnekleri `solana-developers/program-examples` içinde bulabilirsiniz. Farklı örneklerin nasıl çalıştırılacağını açıklayan README dosyaları ile birlikte gelir. Çoğu örnek, yerel Rust dilinde (yani, herhangi bir framework olmadan) ve [Anchor](https://www.anchor-lang.com/docs/installation) frameworkünde, kendi kendine yeterlidir. Ayrıca katkılar olarak görmek istediğimiz örneklerin bir listesini de içeririz: [katkı sağlamak üzeri](https://github.com/solana-developers/program-examples?tab=readme-ov-file#examples-wed-love-to-see).

Repo içinde, her biri çeşitlendirilmiş örnek programlar içeren aşağıdaki alt klasörleri bulacaksınız:

- `Temel Bilgiler`
- `Sıkıştırma`
- `Oracle'lar`
- `Tokenler`
- `Token 2022 (Token Uzantıları)`
- `Break`
  - `İnşa Et ve Çalıştır`

## Temel Bilgiler

Yerel Rust kütüphanelerini kullanarak Solana programları oluşturmanın temel adımlarını gösteren bir dizi örnek içerir. **Bu örnekler, geliştiricilerin Solana programlamanın temel kavramlarını anlamalarına yardımcı olmak için tasarlanmıştır.**

| Örnek Adı                                                                                                                 | Açıklama                                                                                      | Dil                     |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ----------------------- |
| [Hesap Verisi](https://github.com/solana-developers/program-examples/tree/main/basics/account-data)                    | **Bir hesabın içinde ad, ev numarası, sokak ve şehri kaydeder.**                                             | Yerel, Anchor           |
| [Hesap Kontrolleri](https://github.com/solana-developers/program-examples/tree/main/basics/checking-accounts)          | **Hesap kontrolü için güvenlik dersleri sunar.**                                               | Yerel, Anchor           |
| [Hesabı Kapat](https://github.com/solana-developers/program-examples/tree/main/basics/close-account)                   | **Hesapları kapatmayı ve kirasını geri almayı gösterir.**                                            | Yerel, Anchor           |
| [Sayacı](https://github.com/solana-developers/program-examples/tree/main/basics/counter)                               | **Farklı mimarilerde basit bir sayaç programı.**                                     | Yerel, Anchor, mpl-stack|
| [Hesap Oluştur](https://github.com/solana-developers/program-examples/tree/main/basics/create-account)                 | **Bir program içinde bir sistem hesabı nasıl oluşturulur.**                                                 | Yerel, Anchor           |
| [Programlar Arası Çağrı](https://github.com/solana-developers/program-examples/tree/main/basics/cross-program-invocation) | **Bir el ve kol analogisi kullanarak, bir program içinden başka bir programı nasıl çağırırsınız.** | Yerel, Anchor           |
| [merhaba solana](https://github.com/solana-developers/program-examples/tree/main/basics/hello-solana)                       | **İşlem günlüğünde merhaba dünya yazdıran bir örnek.**                                  | Yerel, Anchor           |
| [PDA Kira Ödeyici](https://github.com/solana-developers/program-examples/tree/main/basics/pda-rent-payer)                | **Yeni bir hesap için PDA'daki lamportları nasıl ödeyebileceğinizi gösterir.**                              | Yerel, Anchor           |
| [İşlem Talimatları](https://github.com/solana-developers/program-examples/tree/main/basics/processing-instructions)      | **Talimat veri dizesini ve u32'yi nasıl yöneteceğinizi gösterir.**                                         | Yerel, Anchor           |
| [Program Türetilmiş Adresler](https://github.com/solana-developers/program-examples/tree/main/basics/program-derived-addresses) | **Tohumları kullanarak bir PDA'ya nasıl atıfta bulunabileceğinizi ve içinde veri nasıl saklayabileceğinizi gösterir.** | Yerel, Anchor           |
| [Yeniden Ayrıştır](https://github.com/solana-developers/program-examples/tree/main/basics/realloc)                       | **Mevcut bir hesabın boyutunu nasıl artırıp azaltacağınızı gösterir.**                                  | Yerel, Anchor           |
| [Kira](https://github.com/solana-developers/program-examples/tree/main/basics/rent)                                       | **Bir program içinde kira ihtiyaçlarını nasıl hesaplayacağınızı öğreneceksiniz.**                         | Yerel, Anchor           |
| [Depo Düzeni](https://github.com/solana-developers/program-examples/tree/main/basics/repository-layout)                  | **Program düzeninizi nasıl yapılandıracağınız konusunda öneriler.**                                    | Yerel, Anchor           |
| [SOL Transferi](https://github.com/solana-developers/program-examples/tree/main/basics/transfer-sol)                     | **Sistem hesapları ve PDA'lar için SOL transfer etmenin farklı yolları.**                              | Yerel, Anchor, Seahorse |

## Sıkıştırma

Solana'da `durum sıkıştırma` kullanımını gösteren bir dizi örnek içerir. Temelde cNFT'lere (sıkıştırılmış NFT) odaklanır.

| Örnek Adı                                                                                     | Açıklama                                                                  | Dil    |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------ |
| [cNFT-yak](https://github.com/solana-developers/program-examples/tree/main/compression/cnft-burn)     | **Bir cNFT'nin yakılması için nasıl yapılacağını gösterir.**                    | Anchor |
| [cNFT-Vault](https://github.com/solana-developers/program-examples/tree/main/compression/cnft-vault/anchor)   | **Bir programda cNFT'yi nasıl saklayacağınızı ve tekrar nasıl göndereceğinizi gösterir.**                | Anchor |
| [cutils](https://github.com/solana-developers/program-examples/tree/main/compression/cutils)           | **Bir programda cNFT'leri mintlemek ve doğrulamak için bir araç seti.**               | Anchor |

## Oracle'lar

Oracle'lar, programlarda zincir dışı verilerin kullanılmasına olanak tanır.

| Örnek Adı                                                                                       | Açıklama                                                           | Dil    |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- | ------ |
| [Pyth](https://github.com/solana-developers/program-examples/tree/main/oracles/pyth)         | **Pyth, tokenlerin fiyat verilerini zincir içi programlarda kullanılabilir hale getirir.** | Anchor |

## Tokenler

Çoğu token, Solana Program Kütüphanesi (SPL) token standardını kullanır. İşte token mintleme, transfer etme, yakma ve programlarla etkileşim kurma yollarına dair birçok örnek bulabilirsiniz.

| Örnek Adı                                                                                                    | Açıklama                                                                                       | Dil              |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------- |
| [Token Oluştur](https://github.com/solana-developers/program-examples/tree/main/tokens/create-token)         | **Bir token nasıl oluşturulur ve ona metaplex verileri eklenir.**                                  | Anchor, Yerel    |
| [NFT Minter](https://github.com/solana-developers/program-examples/tree/main/tokens/nft-minter)             | **Sadece bir miktar token mintleyip ardından mint yetkisini kaldırma.**                             | Anchor, Yerel    |
| [PDA Mint Yetkisi](https://github.com/solana-developers/program-examples/tree/main/tokens/pda-mint-authority) | **Bir mintin mint yetkisini nasıl değiştireceğinizi gösterir, program içinden token mintlemek için.** | Anchor, Yerel    |
| [SPL Token Minter](https://github.com/solana-developers/program-examples/tree/main/tokens/spl-token-minter)  | **Token hesaplarını takip edebilmek için Associated Token Accounts kullanımını açıklar.**           | Anchor, Yerel    |
| [Token Değişimi](https://github.com/solana-developers/program-examples/tree/main/tokens/token-swap)          | **SPL tokenler için AMM (otomatik piyasa yapıcı) havuzu kurmayı gösteren kapsamlı bir örnek.**     | Anchor           |
| [Token Transferi](https://github.com/solana-developers/program-examples/tree/main/tokens/transfer-tokens)    | **SPL tokenlerin token programına CPIs kullanılarak nasıl transfer edileceğini gösterir.**          | Anchor, Yerel    |
| [Token-2022](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022)            | **Token 2022 (Token uzantıları) hakkında bilgi verir.**                                            | Anchor, Yerel    |

## Token 2022 (Token Uzantıları)

Token 2022, Solana'daki tokenlar için yeni bir standarttır. **Daha esnek bir yapıya sahiptir ve bir token mintine 16 farklı uzantı eklemenize olanak tanır.** Uzantıların tam listesine [Başlarken Kılavuzu](https://solana.com/developers/guides/token-extensions/getting-started) içinde ulaşabilirsiniz.

| Örnek Adı                                                                                                                                        | Açıklama                                                                                                             | Dil    |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------ |
| [Temel Bilgiler](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/basics/anchor)                               | **Bir token nasıl oluşturulur, mintlenir ve transfer edilir.**                                                          | Anchor |
| [Varsayılan hesap durumu](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/default-account-state/native)     | **Bu uzantı, belirli bir durumu olan token hesapları oluşturmanıza olanak tanır, örneğin dondurulmuş.**                | Yerel  |
| [Mint Kapatma Yetkisi](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/mint-close-authority)                | **Eski token programıyla mint kapanışı yapmak mümkün değildi, şimdi bu mümkündür.**                                      | Yerel  |
| [Birden Fazla Uzantı](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/multiple-extensions)                  | **Tek bir mintte birden fazla uzantı ekleyebileceğinizi gösterir.**                                                   | Yerel  |
| [NFT Metadata işaretleyici](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/nft-meta-data-pointer)           | **Metadata uzantısını kullanarak NFT'ler oluşturmak ve dinamik zincir üzerinde metadata eklemek mümkündür.**         | Anchor |
| [Transfer Edilemez](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/non-transferable/native)                  | **Örneğin başarılar, referans programları veya herhangi bir ruh bağlantılı tokenler için faydalıdır.**                     | Yerel  |
| [Transfer Ücreti](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/transfer-fees)                             | **Tokenlerin her transferinde belli bir miktar token hesapta tutulur ve daha sonra toplanabilir.**                    | Yerel  |
| [Transfer Kancası](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/transfer-hook)                           | **Tokeninize, token programından programınıza bir CPI kullanarak ek işlevsellik eklemek için dört örnek.**            | Anchor |

## Break

[Break](https://break.solana.com/) kullanıcıların Solana ağının ne kadar hızlı ve yüksek performanslı olduğunu hissetmesini sağlayan bir React uygulamasıdır. **Solana blokzincirini gerçekten _kırabilir misiniz_?** 15 saniyelik bir oyun süresinde, her bir butona basışınız veya tuş vuruşunuz, kümeye yeni bir işlem gönderir. Klavyeyi mümkün olan en hızlı şekilde vurun ve işlemlerinizin gerçek zamanlı olarak sonuçlandığını izlerken ağın her şeyi ne kadar kolaylıkla kaldırdığını görün!

Break, Devnet, Testnet ve Mainnet Beta ağlarımızda oynanabilir. Oyun, Devnet ve Testnet'te ücretsizdir; burada oturum bir ağ musluğu tarafından finanse edilir. Mainnet Beta'da, kullanıcılar her oyun için 0.08 SOL öder. Oturum hesabı, yerel bir anahtar cüzdanıyla veya Trust Wallet'tan bir QR kodu tarayarak token transferi yapılarak finanse edilebilir.

[Buraya tıklayarak Break oyna](https://break.solana.com/)

### İnşa Et ve Çalıştır

Öncelikle örnek kodun en son sürümünü edinin:

```shell
git clone https://github.com/solana-labs/break.git
cd break
```

Ardından, git deposunun [README](https://github.com/solana-labs/break/blob/main/README.md) dosyasındaki adımları izleyin.