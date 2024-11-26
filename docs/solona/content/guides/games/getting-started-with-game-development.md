---
date: 2024-04-25T00:00:00Z
difficulty: intro
title: Solana'da Oyun Geliştirmeye Başlamak
description:
  Solana'da nasıl oyun yapılacağını öğrenin. Solana, hız, düşük ücretler ve daha fazlasını kullanarak, her türden web3 oyunu için harika bir oyun deneyimi yaratmak üzere iyi bir şekilde inşa edilmiştir.
tags:
  - oyunlar
  - unity
  - hızlı başlangıç
keywords:
  - eğitim
  - blok zinciri geliştirici
  - blok zinciri eğitimi
  - web3 geliştirici
  - anchor
  - oyunlar
  - örnek
---

Solana ekosistemindeki oyun alanı hızla genişliyor. Solana ile entegre olmak, oyuncuların varlıklarını (oyunlarda NFT'ler aracılığıyla) sahiplenmeleri ve ticaretini yapabilmeleri, açık ve modüler bir oyun içi ekonomi oluşturmaları (çeşitli DeFi protokollerini kullanarak), modüler oyun programları geliştirmeleri ve değerli varlıklar için rekabet etmeleri gibi birçok yarar sağlayabilir.

:::info
**Solana**, oyunlar için neredeyse özel olarak tasarlanmış bir platformdur. 400ms blok süresi ve gök hızında onaylarla, herkesin erişebileceği gerçek zamanlı bir veritabanıdır. Strateji oyunları, şehir kurma oyunları, sıra tabanlı oyunlar ve daha fazlası gibi türler için özellikle mükemmeldir.
:::

Aşırı düşük işlem ücretleri ile, **oyun öğelerini** veya başarıları temsil eden NFT'lerin kullanıldığı daha küçük entegrasyonlar veya oyun içi öğeler için USDC mikro ödemeleri kolayca yapılabilir. Bugün, bildiğiniz ve sevdiğiniz birçok oyun geliştirme çerçevesini kullanarak bu tür zincir üzerinde etkileşimler geliştirmeye başlamak için zaten birçok araç ve SDK mevcut.

Oyunuzu `JavaScript` ve Canvas, [Phaser](https://github.com/Bread-Heads-NFT/phaser-solana-platformer-template), [Turbo Rust](https://turbo.computer/) ya da en büyük üç oyun motoru için Solana Oyun SDK'larından birini kullanarak inşa edebilirsiniz -

- `UnitySDK`
- [UnrealSDK](https://github.com/staratlasmeta/FoundationKit) ve
- [Godot](https://github.com/Virus-Axel/godot-solana-sdk).

Tüm oyun SDK'larının bir listesini burada bulabilirsiniz: `Oyun SDK'ları`.

## Solana'da oyun yapmanın avantajları nelerdir?

1. Kullanıcı yönetimi yok: oyuncular, oyunda kendilerini doğrulamak için Solana cüzdanlarını kullanabilirler.
2. Sunucu maliyetleri yok: Solana merkeziyetsiz bir ağdır, bu yüzden ek yedek sunucular için ödeme yapmanıza gerek yoktur.
3. **Programınız için çalışan maliyet yok.** Hatta
   `programı kapatabilirsiniz`
   ve SOL'unuzu geri alabilirsiniz.
4. Oyuncuları harika başarıları için ödüllendirme yeteneği veya onlara oyunun dışında gerçek değer taşıyan varlıklar için birbirleriyle rekabet etme imkanı.
5. Solana'da dağıtılmış olan diğer programları izinsiz kullanma yeteneği; merkeziyetsiz borsa, NFT pazarları, borç verme protokolleri, yüksek puan programları, sadakat/yönlendirme programları ve daha fazlası gibi.
6. Kendi zincir üstü programlarınızı yazma yeteneği. İstediğiniz bazı oyun işlevselliği zaten mevcut değilse, her zaman
   `kendi özel zincir üstü programınızı yazıp dağıtabilirsiniz`.
7. Tüm tarayıcılar, Android/iOS ve diğer herhangi bir platform için platform bağımsız ödemeler - oyuncular bir işlemi imzalayabildikleri sürece varlık satın alabilirler.
8. Apple ve Google'ın uygulama içi satın alımlardan aldığı %30'luk ücreti ortadan kaldırarak doğrudan
   [Saga dApp mağazasına](https://docs.solanamobile.com/dapp-publishing/intro) dağıtım yapabilirsiniz.

## Solana'yı oyununuzda nasıl entegre edersiniz?

1. Oyunculara oyun içi öğeler için dijital koleksiyonlar verin veya bunları karakter olarak kullanın. `Oyunlarda NFT'ler` için bakın.
2. Oyun içinde uygulama içi satın alımlar veya mikro ödemeler için token kullanın. `Oyunlarda token kullanımı` için bakın.
3. [Solana Cüzdan Adaptörü](https://github.com/anza-xyz/wallet-adapter) çerçevesini kullanarak oyuncunun cüzdanını oyunda kimlik doğrulamak için kullanın.
4. Turnuvalar düzenleyin ve oyuncularınıza kripto ödülleri verin.
5. Oyununuzu tamamen zincir üzerinde geliştirin:

   - her adımda oyuncularınızı ödüllendirin
   - her türlü oyun/uygulama/cihazın oyununuzla bağlantı kurmasına izin verin
   - oyunun geleceği için yönetişimi yürütün
   - hile önleyici sistemler için deftere kaydedilen doğrulanabilir etkinlik sağlayın.

> Solana'da oyun inşa etmeye başlamak için detaylı bir kılavuz için `Solana oyunları "Merhaba dünya"` kısmına bakın.

## Oyun SDK'ları

Tüm bu avantajlarla, **Solana** hızla oyun geliştiricileri için tercih edilen platform haline geliyor. İlk olarak en sevdiğiniz oyun SDK'sını seçerek hemen başlayabilirsiniz:

| Platform                                                                             | Dil                                 |
| ------------------------------------------------------------------------------------ | ----------------------------------- |
| `Unity SDK`                            | C#                                  |
| `Godot SDK`                            | GD script ve C++                   |
| `Solana GameShift`             | RestAPI                             |
| `Turbo.Computer` | Rust                                |
| `Honeycomb Protocol`          | Rust ve JavaScript                 |
| `Unreal SDKs`                        | C++, C#, Blueprints                 |
| `Next js, React, Anchor`    | Rust/Anchor, JavaScript, C#, NextJS |
| `Flutter`                                | Dart                                |
| `Phaser`                                  | HTML5, JavaScript                   |
| `Python`                                  | Python                              |
| `Native C#`                             | C#                                  |

## Oyun Dağıtımı

Oyun dağıtımınız, kullandığınız platforma bağlı olarak büyük ölçüde değişir. Solana ile, iOS, Android, Web ve Yerel Windows veya Mac için oluşturabileceğiniz `oyun SDK'ları` bulunmaktadır. Unity SDK'sını kullanarak teorik olarak Nintendo Switch veya Xbox'ı Solana'ya bağlayabilirsiniz. Birçok oyun şirketi, dünyada bu kadar çok insanın cep telefonuna sahip olması nedeniyle mobil öncelikli bir yaklaşıma dönüyor. Ancak mobilin kendine özgü zorlukları var, bu yüzden oyununuz için en uygun olanı **seçmelisiniz**.

Solana, [Solana Mobile](https://solanamobile.com) tarafından sunulan kriptoya özgü bir cep telefonuyla diğer blok zinciri platformlarına kıyasla belirgin bir avantaja sahiptir; bu telefonın adı Saga. Android tabanlı [Saga telefonu](https://solanamobile.com/hardware), geleneksel uygulama mağazalarının, Google veya Apple gibi, getirdiği kısıtlamalar olmadan kripto oyunlarının dağıtımını mümkün kılan yenilikçi bir dApps mağazası ile donatılmıştır.

## Yayın Platformları

Oyunlarınızı barındırabileceğiniz ve/veya yayınlayabileceğiniz platformlar:

| Platform                                                                                         | Açıklama                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Fractal](https://www.fractal.is/)                                                               | Solana ve Ethereum'u destekleyen bir oyun yayın platformu. Ayrıca, kendi cüzdanı ve hesap yönetimi vardır ve yüksek puanlar ile turnuvalar için bir SDK sunmaktadır.                                                                                                                                                                                                                             |
| [Solana mobil dApp Mağazası](https://github.com/solana-mobile/dapp-publishing/blob/main/README.md) | Google Play ve Apple App Store'a alternatif olan Solana platformudur. Kripto öncelikli bir dApp mağazası, herkesin kullanabileceği açık kaynaklı bir mağaza. ([video yürütmesi](https://youtu.be/IgeE1mg1aYk?si=fZmU1WNiW-kR3qFa))                                                                                                                                                                    |
| [Apple App Store](https://www.apple.com/de/app-store/)                                           | Apple uygulama mağazası yüksek bir erişime sahiptir ve müşterileri tarafından güvenilir bulunur. Ancak, kripto oyunları için giriş engeli yüksektir. Apple'ın uygulama içi satın almalardan aldığı ücretleri aşmaya çalışan her şey için kurallar çok katıdır. Örneğin bir NFT, oyuncuya fayda sağlıyorsa, Apple, bunların uygulama içi satın alma sistemi aracılığıyla satın alınmasını istemektedir. |
| [Google Play Store](https://play.google.com/store/games)                                         | Google, kripto dostu bir yaklaşıma sahiptir ve NFT'ler ile cüzdan derin bağlantılarına sahip oyunların resmi Play Store'da onaylanma geçmişi vardır.                                                                                                                                                                                                                                    |
| [xNFT Backpack](https://www.backpack.app/)                                                       | Backpack, xNFT'ler olarak uygulamaları yayınlamanıza olanak tanıyan bir Solana cüzdanıdır. Uygulamaları satın aldıklarında kullanıcı cüzdanında hemen görünürler. Unity SDK'nın xNFT dışa aktarma özelliği vardır ve diğer web uygulamaları da xNFT olarak yayınlanabilir.                                                                                                                                                      |
| [Elixir Games](https://elixir.games/)                                                            | Elixir Games, blok zinciri tabanlı oyunlara odaklanan bir platformdur. Çeşitli blok zinciri teknolojilerini destekler ve geliştiricilerin oyunlarını yayınlaması için bir platform sunar.                                                                                                                                                                                                                    |
| Kendin Yayınlama                                                                                | Oyununuza kendiniz ev sahipliği yapın. Örneğin, yeni bir sürüm gönderdiğinizde otomatik olarak dağıtım yapacak şekilde kolayca ayarlanabilecek olan [Vercel](https://vercel.com/) gibi. Diğer seçenekler [GitHub sayfaları](https://pages.github.com/) veya [Google Firebase](https://firebase.google.com/docs/hosting) gibi daha fazlasıdır.                                                             |

## Sonraki Adımlar

Solana'da oyun geliştirme hakkında daha fazla bilgi edinmek istiyorsanız, bu geliştirici kaynakları ve kılavuzlara göz atın:

- `Solana Oyun SDK'ları`
- `Merhaba dünya zincir üstü oyunu`
- `Örnekler üzerinden öğrenin`
- `Enerji Sistemi`
- `Oyunlarda NFT'ler`
- `Dinamik meta veriler NFT'leri`
- `Oyunlarda token`