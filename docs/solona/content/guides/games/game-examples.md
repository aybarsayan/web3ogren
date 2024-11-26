---
date: 2024-04-25T00:00:00Z
difficulty: intro
title: Solana Oyun Geliştirme Örnekleri
description:
  Başlangıç için sizi yönlendirecek eğitimlerle birlikte Solana'da açık kaynak oyunlar ve örneklerin bir listesi.
tags:
  - oyunlar
  - anchor
  - program
  - react
  - web3js
  - unity
  - rust
keywords:
  - eğitim
  - blockchain geliştirici
  - blockchain eğitimi
  - web3 geliştirici
  - anchor
  - oyunlar
  - örnek
---

[Solana Oyun Örnekleri](https://github.com/solana-developers/solana-game-examples) birçok açık kaynak oyun örneği ve oyun geliştirme için araçlar içermektedir. Bu örneklere bakmak ve belirli özelliklerin nasıl uygulandığını görmek, geliştirme hızınızı önemli ölçüde artırabilir. Eğer başka örnek oyunlarınız varsa, [bir PR göndermekten](https://github.com/solana-developers/solana-game-examples/pulls) çekinmeyin.

## create-solana-game Kullanma

:::info
Unity istemcisi, Anchor programı ve bir Next.js ön yüzü ile yeni bir Solana oyun projesi kuran basit bir npx komutudur. 
:::

Desteklenen özellikler:

- Cüzdan adaptörü
- Anchor programı
- Unity istemcisi
- Next.js ön yüzü
- Proje adının tüm geçişlerini kendi oyununuzun adıyla değiştirme
- NFT ve sıkıştırılmış NFT desteği
- [Oturum anahtarları](https://docs.magicblock.gg/Onboarding/Session%20Keys/how-do-session-keys-work) otomatik olarak işlem onaylama için

Bu komut ile tüm bu özelliklerle çalışan yeni bir oyun kolayca kurabilirsiniz:

```bash
npx create-solana-game your-game-name
```

Burada nasıl çalıştığını öğrenebilirsiniz:

- [Video](https://www.youtube.com/watch?v=fnhivg_pemI)
- [Kaynak ve dokümanlar](https://github.com/solana-developers/solana-game-preset)

---

## Unity'den Anchor Programları ile Etkileşim

Küçük macera, Anchor çerçevesi ve Unity SDK kullanarak zincir üzerinde bir oyuncuyu sağa ve sola hareket ettiren basit bir örnektir.

- `Eğitim Kılavuzu`
- [Video](https://www.youtube.com/watch?v=_vQ3bSs3svs)
- [Canlı Versiyon](https://solplay.de/TinyAdventure/index.html)
- [Oyun Alanı](https://beta.solpg.io/tutorials/tiny-adventure)
- [Unity İstemcisi](https://github.com/solana-developers/solana-game-examples/tree/main/seven-seas/unity/Assets/SolPlay/Examples/TinyAdventure)

---

## PDA'da SOL Tasarrufu

PDA tohum kasasında SOL nasıl saklanacağını ve oyuncuya geri nasıl gönderileceğini öğrenin. Bu arka uç Anchor ile yazılmıştır ve ön uç Unity SDK'yı kullanmaktadır.

- `Eğitim Kılavuzu`
- [Video](https://www.youtube.com/watch?v=gILXyWvXu7M)
- [Canlı Versiyon](https://solplay.de/TinyAdventureTwo/index.html)
- [Kaynak](https://beta.solpg.io/tutorials/tiny-adventure-two)

---

## Solana Pay QR Kodlarını Kullanarak Bir Oyunu Kontrol Etme

:::tip
Solana Pay işlem talepleri sadece ödemeler için değil, aynı zamanda bir telefon cüzdanında veya bir bağlantıda herhangi bir işlemi imzalamak için de kullanılabilir.
:::

İp çekme, birçok insanın büyük bir ekranda oynayabileceği çok oyunculu bir oyundur, Solana Pay QR kodlarını kullanarak ipi bir yöne veya diğerine çekmekte ve bu da bir hesapta verileri değiştirmektedir. Ödüller, ipi tamamen bir tarafa çekmeyi başaran takıma verilecektir. Arka uç Anchor, ön uç ise React.js ve Next.js 13'tür.

- [Eğitim](https://www.youtube.com/watch?v=_XBvEHwSqJc&ab_channel=SolPlay)
- [Geliştirici ağındaki canlı sürüm](https://tug-of-war-solana-pay.vercel.app/?network=devnet)
- [Kaynak](https://github.com/Solana-Workshops/tug-of-war-solana-pay)

---

## Tur Bazlı Çok Oyunculu Oyun Yapma

Anchor ile yazılmış basit bir çok oyunculu XOX oyunu

- [Eğitim](https://book.anchor-lang.com/anchor_in_depth/milestone_project_tic-tac-toe.html)
- [Kaynak](https://github.com/coral-xyz/anchor-book/tree/master/programs/tic-tac-toe)
- [Magic Block Bolt XOX](https://github.com/magicblock-labs/bolt-tic-tac-toe)

---

## Zincir Üzeri Satranç

Anchor ile yazılmış, 3D Unity uygulaması olan tamamıyla zincir üzerinde oynanabilir satranç oyunu. Birine bir bağlantı göndererek bir oyuna başlayın.

> **Kaynak:**  
> [Kaynak](https://github.com/magicblock-labs/Solana-Unity-Chess/)

---

## Oylama Sistemi Kullanarak Çok Oyunculu Oyun

İnsanların ortaklaşa hamleler üzerinde oy kullandığı bir Pokemon tarzı oyun. Her hamle kaydedilir ve her hamle NFT’ler olarak basılabilir.

- [Canlı Versiyon](https://solana.playspokemon.xyz/)
- [Kaynak](https://github.com/nelsontky/web3-plays-pokemon)

---

## Entity Component System Örnekleri

### MagicBlock Bolt

MagicBlock Bolt, zincir üzerinde bir entity component system'dir. MagicBlock ayrıca süper hızlı işlem için geçici bir rollup sistemi üzerinde çalışmaktadır.

[Bolt](https://github.com/magicblock-labs/bolt)

### Arc Çerçevesi

Kyoudai Clash, Jump Crypto'nun [Arc çerçevesini](https://github.com/JumpCrypto/sol-arc) kullanan zincir üzerinde bir gerçek zamanlı strateji oyunu olup, artık bakım yapılmamaktadır.

- [xNFT Versiyon](https://www.xnft.gg/app/D2i3cz9juUPLwbpi8rV2XvAnB5nEe3f8fM5YUpgVprbT)
- [Kaynak](https://github.com/spacemandev-git/dominari-arc)

---

## Diğer Oyunculardan Oyun Durumunu Gizleme

Zincir üzerinde verileri gizlemek zordur çünkü tüm hesaplar, veri hesapları dahil olmak üzere, herkese açık ve herkes tarafından okunabilir. Ancak bazı çözümler vardır.

### Light Protokolü

Light protokolü, L1 üzerinde durumun güvenli ölçeklenmesini sağlayan yeni bir ilke olan ZK sıkıştırması ile birlikte Solana üzerinde inşa etmenize olanak tanıyan ZK katmanı çözümüdür.

- [Kaynak](https://github.com/Lightprotocol/light-protocol)
- [Web Sitesi](https://lightprotocol.com/)

### Race Protokolü

Race protokolü bir zincir üstü poker oyunu inşa etmekte ve verileri gizlemek için iki çözüm sunmaktadır. Bir tanesi sunucu tabanlı, diğeri ise oyuncuların birbirlerine şifreli veri göndermesine dayanır.

[Kaynak](https://github.com/RACE-Game)

### Şans Kağıdı Makas

Zincir üzerinde verilerin gizli tutulduğu bir oyun, bir hash'in istemcide saklanması ve ifşa edilene kadar bekletilmesi ile yapılır. Kazanana ödül olarak SPL Token verilir.

[Kaynak](https://github.com/kevinrodriguez-io/bonk-paper-scissors)

### Tilted Fish Oyunları

Grizzlython hackathonu için gönderilmiş başka bir örnek, girişleri şifreleyerek bir sonraki oyuncuya göndermektedir:

[Kaynak](https://github.com/solanaGames)

---

## Macera Canavarlara Daldırma ve XP Kazanma

Lumia online, bir hackathon gönderimi olup küçük bir macera oyunu için güzel bir referanstır.

- [xNFT Versiyon](https://www.xnft.gg/app/D2i3cz9juUPLwbpi8rV2XvAnB5nEe3f8fM5YUpgVprbT)
- [Kaynak](https://github.com/spacemandev-git/dominari-arc)

---

## Gerçek Zamanlı PVP Zincir Üzeri Oyun

### Solana Civ

Şehirler inşa edebileceğiniz, diğer oyuncularla ticaret yapabileceğiniz ve savaşlar yapabileceğiniz bir Medeniyet tarzı oyundur. Yeni teknolojileri açarak çağlar boyunca ilerleyin, toprakları fethedin ve zaman testine dayanacak bir medeniyet inşa edin. Tümü açık kaynak ve Solana topluluğu tarafından, gib.work aracılığıyla inşa edilmiştir.

- [Kaynak](https://github.com/proxycapital/solana-civ)
- [Web Sitesi](https://solana-civ.com/)
- `Katılın`

### Yedi Denizin

Yedi Deniz, gerçek zamanlı bir Solana Battle Royale oyunudur. Anchor programını, UnitySDK'yi ve WebSocket hesap aboneliklerini kullanarak. Oyuncular, NFT'leri temsil edilen gemilerini bir ızgara üzerinde spawn edebilir ve hareket edebilir. Eğer bir oyuncu başka bir oyuncuya veya sandığa çarparsa, SOL ve bazı Korsan Para SPL tokenlerini toplar. Izgara, her kaidede oyuncuların cüzdan anahtarını ve NFT açık anahtarını kaydeden iki boyutlu bir dizi olarak uygulanmıştır. Ayrıca, sol üst köşede bir QR kod, oyuncuların telefonlarında imzalayabileceği bir Solana Pay işlem talebini tetikler, böylece Cthulhu en yakın gemiye ateş edebilir.

- [Örnek](https://solplay.de/sevenseas)
- [Kaynak](https://github.com/solana-developers/solana-game-examples/tree/main/seven-seas)
- [Sekiz Saatlik video boot camp](https://www.youtube.com/playlist?list=PLilwLeBwGuK6NsYMPP_BlVkeQgff0NwvU)

### Dark Forest Gibi Blob Savaşları Zincir Strateji Oyunu

Blob Wars, Dark Forest veya Tribal Wars gibi bir strateji oyunu oluşturabileceğinizi gösterir, ancak ZK özellikleri olmadan. Her oyuncu, kamuş anahtarından türetilen bir renkle ev blobunu spawn eder. Bu bloblar daha sonra diğer blobların saldırısında kullanılabilir ve fethedilebilir. Bloblar zamanla renklerini yenileyerek, nerelerde blob spawn edeceğiniz ve nasıl saldırılara birleşeceğiniz konusunda birçok taktik içerir.

- [Kaynak](https://github.com/Woody4618/colosseum_2024)
- [Demo Video](https://www.youtube.com/watch?v=XNHxqdd6pz8)

---

## Kentridge Hikayesi

Turbo oyun motoru ile yapılmış bir oyundur.  
[Turbo](https://turbo.computer/) sıfırdan yazılmış yeni bir Rust oyun motorudur ve hafif mimari ve hızlı iterasyon sürelerine odaklanmaktadır. Her zaman Solana akılda tutulmuştur. Başlangıç dostudur ve tamamen Solana RPC desteği ile gelir. Hatta tamamlanan oyunları oluşturmak için AI araçlarını kullanabilirsiniz.

- [Örnek oyun](https://github.com/super-turbo-society/turbo-demos/tree/main/solana-lumberjack)
- [Dokümanlar](https://turbo.computer/docs/intro/)

---

## Roguelike Oyun

Bir mağarayı keşfedip hazine bulabileceğiniz bir oyundur. Oyun Anchor ile yazılmıştır ve ön yüz bir Unity istemcisidir. Mağarada 0'dan 100'e kadar ilerlemeniz gerekiyor ve nihai düşmanla savaşmalısınız. Her öldüğünüzde tekrar seviye 1'den başlarsınız. Eşya ve kaynakların verildiği sandıklar vardır ve mavi sandıklardan gelen eşyalar bir sonraki koşu için saklanabilir. Özel bir özellik, bir katmanın belirli bir oyuncuya ait olabilmesidir ve o katmanı geçtiğinizde ya o oyuncu ile savaşmalısınız ya da geçebilmek için küçük bir ücret ödemelisiniz.

- [Geliştirici ağı örneği](https://solplay.de/ancientcave/)
- [Kaynak](https://github.com/Woody4618/speedrun2)

---

## Zincir Üstü Şehir Kurucu Örneği

Bu örnek, zincir üzerinde nasıl bir şehir kurucu inşa edebileceğinizi gösterir. Özel özellik, tüm kaynakların oyuncular arasında paylaşıldığı ancak binalarınızı sola veya sağa inşa edip etmediğinize bağlı olarak goblinleri veya insanları desteklemektedir.

- [Geliştirici ağı örneği](https://solplay.de/humansandgoblins/)
- [Kaynak](https://github.com/solana-developers/solana-game-examples/tree/main/city-builder)

---

## Rebirth Rumble PVP dövüşçüsü

Diğer oyuncularla savaşabileceğiniz 5'e 5 PVP oyunudur. Oyun Anchor ile yazılmıştır ve ön yüzü bir Unity istemcisidir. Farklı karakterler arasında seçim yapabilir ve diğer oyuncularla savaşabilirsiniz. Oyun hâlâ geliştirilmekte olup ikinci [Solana Hız Koşusu](https://solanaspeedrun.com/) yarışmasının kazananıdır.

- [Kaynak](https://github.com/kimo-do/Speedrun2)
- [xNFT versiyonu](https://www.xnft.gg/app/8iGi6rMEPbjTHofEwU8MNsy5MTPfhorj9QXCfH8dKBme)

---

## Zincir Üstü Eşleştirme

Karakter istatistikleri için NFT istatistiklerini kullanan çok oyunculu üç eşleştir oyunu ve ilginç bir zincir üstü eşleştirme sistemi vardır.

- [Canlı Versiyon](https://deezquest.vercel.app/)
- [Kaynak](https://github.com/val-samonte/deezquest)

---

## Oyun Geliştirme Eğitim Videoları

- [Solana'da Oyun Oluşturma](https://www.youtube.com/watch?v=KT9anz_V9ns)
- [Sekiz saatlik bootcamp](https://www.youtube.com/watch?v=0P8JeL3TURU&t=1s)
- [Enerji Sistemi](https://www.youtube.com/watch?v=YYQtRCXJBgs&t=3s)
- [Oturum Anahtarları](https://www.youtube.com/watch?v=oKvWZoybv7Y)
- [Clockwork](https://www.youtube.com/watch?v=ax0Si3Vkvbo&t=252s)
- [Solana'da Bellek](https://www.youtube.com/watch?v=zs_yU0IuJxc)
- [Dinamik Metaveri NFT'leri](https://www.youtube.com/watch?v=n-ym1utpzhk)
- [Gelişmiş Konular](https://www.youtube.com/watch?v=jW8ep_bmaIw)