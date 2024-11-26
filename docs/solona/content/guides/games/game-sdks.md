---
date: 2024-04-25T00:00:00Z
difficulty: intro
title: Solana Oyun SDK'ları
description:
  Solana ile ilk Solana Oyununu yaratmaya başlamanızı sağlayacak Solana Oyun SDK'larının bir listesi.
tags:
  - oyunlar
  - anchor
  - program
  - altyapı
  - unity
keywords:
  - öğretici
  - blok zinciri geliştirici
  - blok zinciri öğreticisi
  - web3 geliştirici
  - anchor
  - oyunlar
  - örnek
---

Solana, düşük ücretler ve hızlı işlemlerle yüksek performanslı bir blok zinciri olduğu için etrafında harika bir oyun geliştirici topluluğu oluşmuştur. 

Burada, ekosistem içindeki Solana oyun geliştirme SDK'larıyla ilgili ayrıntıları bulabilirsiniz. `GameShift` dışında tüm SDK'lar açık kaynaklı ve topluluk tarafından geliştirilmiştir. Eğer kendiniz bir SDK üzerinde çalışıyorsanız, bu sayfaya bir PR açmaktan çekinmeyin ve ekleyin.

## Unity SDK

**Unity oyun motoru**, yeni başlayanlar için dostane yaklaşımı ve WebGL, iOS ve Android'i kapsayan çoklu platform desteği ile bilinir. Bir kez inşa edin, her yere aktarın.

- [Docs](https://docs.magicblock.gg/introduction)
- [Source](https://github.com/magicblock-labs/Solana.Unity-SDK)
- [Verified Unity Asset Store Listing](https://assetstore.unity.com/packages/decentralization/infrastructure/solana-sdk-for-unity-246931)
- [Example Games](https://github.com/solana-developers/solana-game-examples)
- [Tic Tac Toe](https://blog.magicblock.gg/bolt-tic-tac-toe/)

Solana Unity SDK, [Magicblock](https://www.magicblock.gg/) tarafından korunmaktadır ve aşağıdakileri sunar:

- NFT desteği
- Candy machine entegrasyonu
- İşlemler
- RPC işlevleri
- Phantom derin bağlantıları
- WebGL bağlantısı
- Güvenilir WebSocket bağlantı desteği
- Mobil cüzdan adaptörü
- Otomatik onaylama için oturum anahtarları
- Anchor istemci kodu üretimi ve daha fazlası.

:::tip
**Hatırlatma:** Unity ile geliştirdiğiniz oyunların birçok platformda çalışabilir olmasını sağlamak için, her güncellemeye dikkat edin.
:::

## Godot SDK

[Godot Engine](https://godotengine.org/) son birkaç yılda büyük destek kazanan açık kaynak bir oyun motorudur. Godot için Solana SDK, [ZenRepublic](https://twitter.com/ZenRepublicNDM) ve [Virus-Axel](https://twitter.com/AxelBenjam) tarafından korunmaktadır. Bir cüzdan adaptörü entegrasyonu, işlemler, RPC işlevleri ve Anchor istemci kodu üretimi ile birlikte gelir. Aynı zamanda tamamen işlevsel bir Metaplex
[candy machine entegrasyonu](https://zenwiki.gitbook.io/solana-godot-sdk-docs/guides/setup-candy-machine) mevcuttur.

- [Solana Godot Engine SDK](https://github.com/Virus-Axel/godot-solana-sdk)
- [Docs](https://zenwiki.gitbook.io/solana-godot-sdk-docs)
- [Demo](https://github.com/ZenRepublic/GodotSolanaSDKDemoPackage)
- [Tutorial](https://www.youtube.com/watch?v=tszFPInYmXQ)
- [Maintainer](https://twitter.com/ZenRepublicNDM)

:::info
Godot ile başladığınızda, topluluk kaynaklarından yararlanarak daha hızlı sonuçlar elde edebilirsiniz.
:::

## Solana GameShift

Solana GameShift, [Solana Labs](https://solanalabs.com) tarafından geliştirilen bir API çözümüdür ve Solana'yı oyununuza entegre etme yeteneği sağlar; varlıkları kolayca oluşturma ve değiştirme imkanı sunar. Ayrıca, USDC üzerinde çıkış noktalarını ve oyuniçi pazarları destekler. Oyuncularınızı oluşturmak veya yönetmek zorunda kalmadan, kredi kartı ödemeleri ile kolayca ödeme yapmalarını sağlayabilirsiniz.

- [Solana GameShift](https://gameshift.solanalabs.com/)
- [Docs](https://docs.gameshift.dev/)
- [Örnek Oyun Canlı](https://solplay.de/cubeshift)
- [Örnek Oyun Kaynağı](https://github.com/solana-developers/cube_shift)
- [Örnek Oyun Geliştirme Günlüğü](https://www.youtube.com/watch?v=hTCPXVn14TY)

:::warning
**Dikkat:** GameShift kullanırken, güvenlik standartlarına uyduğunuzdan emin olun.
:::

## Turbo.Computer - Rust Oyun Motoru

Turbo, Solana'ya odaklanan sıfırdan geliştirilmiş bir Rust oyun motorudur ve hafif bir mimari ile hızlı iterasyon süreleri sunar. Yeni başlayanlar için dostudur ve tam Solana RPC desteği ile birlikte gelir. Tamamen işlevsel oyunlar oluşturmak için AI araçlarını da kullanabilirsiniz.

- [Website](https://turbo.computer/)
- [Docs](https://turbo.computer/docs/intro)
- [Twitter account](https://twitter.com/makegamesfast)
- [Maintainer](https://twitter.com/jozanza)

## Honeycomb Protokolü

Honeycomb, Solana Sanal Makinesi (SVM) içindeki tüm kritik oyun yaşam döngüsü işlevlerini ve birleşebilirliği yöneten bir dizi onchain program ve durum sıkıştırma aracı sağlar. Staking, görevler, hazine kutuları, oyuncu profilleri, durum sıkıştırma, otomatik onaylama işlemleri ve daha fazlası gibi birçok NFT işlevselliğini destekler.

- [Twitter account](https://twitter.com/honeycomb_prtcl)
- [Docs](https://docs.honeycombprotocol.com/)

## Unreal SDK'lar

Unreal Engine, harika görselleri ve düğüm tabanlı betik çerçevesi ile bilinir. Farklı şirketler tarafından yönetilen birden fazla Solana SDK'sı bulunmaktadır.

### Bitfrost Unreal SDK

Bitfrost, yakın zamanda yapılan Solana oyun jam'lerinde zaten kullanılan bir Unreal SDK üzerinde çalışmaktadır. C# `solnet` desteğiyle C++ ve Blueprintlerde, metaplex NFT'lerinin oluşturulması, oyun cüzdanında ödeme işleme örnekleri ve daha fazlasını sunar.

- [Solana Unreal SDK by Bitfrost](https://github.com/Bifrost-Technologies/Solana-Unreal-SDK)
- [Tutorial](https://www.youtube.com/watch?v=S8fm8mFeUkk)
- [Maintainer](https://twitter.com/BifrostTitan)

### Thugz Unreal SDK

Thugz, açık kaynak bir Solana için Unreal SDK'yı yöneten bir oyun stüdyosu ve NFT projesidir. Birçok NFT odaklı işlevsellik sunmakta ve Unreal pazarında eklentiyi zaten yayımlamıştır.

- [Thugz Unreal eklentisi](https://www.unrealengine.com/marketplace/en-US/product/thugz-blockchain-plugin)
- [Repository](https://github.com/ThugzLabs/Thugz-BC-Plugin-Packaged-for-UE5.0)
- [Video Tutorial](https://www.youtube.com/watch?v=dS7sTZd_E9U&ab_channel=ThugzNFT)

### Star Atlas Foundation Kit

[Star Atlas](https://staratlas.com/) ekibi, _Foundation Kit_ adlı SDK yığınlarının bazılarını açık kaynak hale getirdi. Aktif olarak korunmamaktadır, ancak projeniz için bir başlangıç noktası olabilir.

- [Star Atlas Unreal SDK](https://github.com/staratlasmeta/FoundationKit)
- [Tutorial](https://www.youtube.com/watch?v=S8fm8mFeUkk)

## Next.js/React + Anchor

Solana üzerinde geliştirmenin en kolay yollarından biri, Web3js JavaScript çerçevesini Solana Anchor çerçevesi ile birleştirmektir. Daha karmaşık oyunlar için, `Unity` veya `Unreal` gibi bir Oyun Motoru kullanmanızı öneririz.

Next.js tabanlı bir oyunu ayarlamanın en hızlı yolu:

```shell
npx create-solana-game your-game-name
```

Bu, `wallet-adapter` desteği, bir Anchor programı, bir React uygulaması ve birlikte çalışacak şekilde yapılandırılmış bir Unity istemcisi ile büyük bir başlangıç uygulaması oluşturur. Next.js kullanmanın bir avantajı, arka uçta ve ön uçta aynı kodu kullanabilmenizdir, bu da geliştirmeyi hızlandırır.

- `Web3.js`
- [Video Tutorial](https://www.youtube.com/watch?v=fnhivg_pemI&t=1s&ab_channel=Solana)

> Eğer bir Solana SDK'sı üzerinde çalışıyorsanız ve preset'inizi eklemek istiyorsanız, burada bir PR açabilirsiniz:
> [Solana oyunları preset'i](https://github.com/solana-developers/solana-game-preset)

## Phaser

Canvas ve WebGL destekli tarayıcı tabanlı oyunlar için hızlı, ücretsiz ve eğlenceli bir açık kaynak çerçevesidir. [Phaser](https://phaser.io/) Solana'da oyun geliştirmeye başlamak için harika bir yoldur. Phaser Solana Platformer Şablonu, oyununuz için harika bir başlangıç noktasıdır.

- [Source Code](https://github.com/Bread-Heads-NFT/phaser-solana-platformer-template)
- [Maintainer](https://twitter.com/blockiosaurus)

## Flutter

Flutter, Google tarafından korunmakta olan, tek bir kod tabanından güzel, yerel olarak derlenmiş, çoklu platform uygulamaları oluşturmak için açık kaynak bir çerçevedir. Solana Flutter SDK, [Espresso Cash](https://www.espressocash.com/) ekibi tarafından korunmaktadır.

- [Source Code](https://github.com/espresso-cash/espresso-cash-public)

## Python

Python, öğrenmesi kolay ve yaygın olarak kullanılan bir programlama dilidir (genellikle makine öğrenimi uygulamalarında kullanılır). Seahorse çerçevesi, geliştiricilerin Solana programları yazmasını sağlar. Seahorse, Anchor çerçevesi üzerinde inşa edilmiştir ve Python kodunu Anchor tabanlı rust koduna dönüştürür. Seahorse şu anda beta aşamasındadır.

- [Documentation](https://www.seahorse.dev/)
- [Github Repo](https://github.com/solana-developers/seahorse)
- [Anchor Playground Örneği](https://beta.solpg.io/tutorials/hello-seahorse)

## Native C#

Web3js'in C#'a olan orijinal portudur. İşlemler, RPC işlevleri ve Anchor istemci kodu üretimi gibi bir dizi işlevsellik sunar.

- [Source and Docs](https://github.com/bmresearch/Solnet/blob/master/docs/articles/getting_started.md)

:::danger
**Kritik Uyarı:** SDK'larınızı düzenli olarak güncellemeyi ve güvenlik güncellemelerine dikkat etmeyi unutmayın.
:::