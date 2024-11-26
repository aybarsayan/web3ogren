---
title: Kurs Rehberi
objectives:
  - web3'ün ne olduğunu anlamak
  - Solana'nın ne olduğunu anlamak
  - bu kursun nasıl yapılandırıldığını öğrenmek
  - bu kurstan en iyi şekilde nasıl faydalanacağınızı bilmek
description: "Web3, blok zincirleri ve Solana'nın ne olduğunu anlayın."
---

## Hoş Geldiniz

Web3 ve blok zincirlerini öğrenmek isteyen geliştiriciler için en iyi başlangıç noktasına hoş geldiniz!

## Web 3 Nedir?

Genellikle, eski sistemlerde insanlar birbirleriyle üçüncü taraf platformları aracılığıyla etkileşimde bulunurlar:

- Kullanıcı hesapları, Google, X (eski adıyla Twitter) ve Meta (Facebook, Instagram) gibi büyük platformlarda saklanır. Bu hesaplar, şirketler tarafından istendiğinde kaldırılabilir ve bu hesaplara ait 'sahip olunan' öğeler sonsuza dek kaybolabilir.

- Değer saklayan ve transfer eden hesaplar - ödeme kartları, banka hesapları ve hisse senedi ticaret hesapları gibi - kredi kartı şirketleri, para transfer organizasyonları ve borsa gibi büyük platformlar tarafından yönetilir. Çoğu durumda, bu şirketler, platformlarında gerçekleşen her işlemden (yaklaşık %1 - %3) bir pay alırlar. İşlem yerleşimini yavaşlatma cazibesi nedeniyle kuruluşun yararına olabilirler. Bazı durumlarda, aktarılan öğe alıcıya ait olmayabilir, bunun yerine alıcının adına tutulmaktadır.

Web3, insanların birbirleriyle **doğrudan işlem yapmalarını** sağlayan bir internet evrimi:

- Kullanıcılar hesaplarının sahibi, cüzdanlarıyla temsil edilir.

- Değer transferleri kullanıcılar arasında doğrudan gerçekleşebilir.

- Para birimlerini, dijital sanatı, etkinlik biletlerini, gayrimenkulleri veya başka her şeyi temsil eden token'lar, kullanıcı tarafından tamamen kontrol altında tutulur.

Web3'ün yaygın kullanımları arasında:

- Hızlı sıfır ücret ve anında yerleşim ile çevrimiçi mal ve hizmet satışı.

- Her bir öğenin özgün olduğunu ve kopyaların orijinal öğelerden ayırt edilebilir olduğunu sağlayarak dijital veya fiziksel öğelerin satışı.

- Geleneksel para transfer şirketlerinin zaman ve masrafını olmaksızın anlık global ödemeler.

:::info
Web3'ün temel avantajlarından biri, kullanıcıların kendi verileri üzerinde tam kontrol sağlamasıdır.
:::

## Solana Nedir?

Solana, insanların **birbirleriyle anında neredeyse hiç maliyet olmadan işlem yapmalarını** sağlar.

Eski platformlarla, örneğin Bitcoin ve Ethereum ile karşılaştırıldığında, Solana:

- Önemli ölçüde daha hızlı - çoğu işlem bir veya iki saniye içinde tamamlanır.

- Son derece ucuz - işlem ücretleri (eski ağlarda 'gaz ücretleri' olarak adlandırılır) genellikle $0.00025 (bir kuruştan çok daha az) olup, aktarılan değerle ilişkili değildir.

- Yüksek derecede merkeziyetsizdir, herhangi bir proof-of-stake ağının en yüksek Nakamoto katsayılarından (merkeziyetsizlik puanı) birine sahiptir.

Solana'daki birçok yaygın kullanım durumu, eski blok zincirlerinin yüksek maliyetleri ve yavaş işlem süreleri nedeniyle yalnızca Solana'da mümkündür.

:::tip
Solana'nın üstün hız ve düşük maliyetleri, özellikle büyük miktarlarla işlem yapıldığında dikkat çekicidir.
:::

## Başlamadan Önce Ne Gerekir?

Bu kursu takip etmek için önceki blok zinciri deneyimine veya Rust bilgisine **ihtiyacınız yok!** Ancak şunlara ihtiyacınız var:

- Linux, Mac veya Windows bilgisayarı.
  - Windows makinelerinde [Windows Terminal](https://aka.ms/terminal) ve [WSL](https://learn.microsoft.com/en-us/windows/wsl/) yüklü olmalıdır.
  - [node.js](https://nodejs.org/en/download) 20 yüklü. Windows makineleri node.js'i WSL2 içinde yüklemelidir.
- Temel TypeScript programlama deneyimi.
- Komut satırının temel düzeyde kullanımı.
- Git'in temel düzeyde kullanımı (komut satırı veya favori GUI aracılığıyla).

:::note
Geliştiriciler için bu kurs temel programlama becerileri üzerinde yoğunlaşmaktadır, dolayısıyla yeni başlayanlar için idealdir.
:::

## Kursu Etkili Şekilde Nasıl Kullanırım?

Bu kurs, bireysel derslere ayrılmıştır. Her derste üç bölüm bulunmaktadır:

- **Genel Bakış** - genel bakış, açıklayıcı metinler, örnekler ve kod parçacıkları içerir. Burada gösterilen örneklerle kod yazmanız _beklenmez_. Amaç, konuları okuyarak ilk aşamada maruz kalmaktır.

- **Laboratuvar** - mutlaka birlikte kodlamanız gereken pratik bir projedir. Bu, içeriğe ikinci maruz kalışınız ve _işi yapma_ fırsatınızdır.

- **Zorluk** - yalnızca birkaç basit istemle uygulamanız gereken başka bir projedir.

Buradaki dersler son derece etkili olsa da, herkes farklı geçmişlerden ve yeteneklerden gelmektedir, bu da durağan içeriklerle hesaba katılamaz. Bununla birlikte, kursun en iyi şekilde faydalanmanıza yardımcı olacak üç öneri:

1. **Kendinize acımasızca dürüst olun** - bu biraz belirsiz gelebilir, ancak belirli bir konuyu ne kadar iyi anladığınız konusunda kendinize dürüst olmak, onu ustalaşmanın anahtarıdır. Bir şeyi okuyup "evet, anladım" demek çok kolaydır, ancak sonra gerçekten anlamadığınızın farkına varırsınız. Her derse geçerken kendinize dürüst olun. Gerekirse bölümleri tekrar etmeyi veya ders ifadeleri sizin için tam olarak çalışmadığında dış araştırma yapmaktan çekinmeyin.

2. **Her laboratuvar ve zorluğu yapın** - bu, ilk noktayla bağlantılıdır. Bir şey hakkında ne kadar iyi bildiğinizi kendinize yalan söylemek oldukça zordur, çünkü bunu yapmaya çalışıyorsunuz. Önceliklerinizi ve sınırlarınızı sınamak ve tekrar ihtiyaç duyduğunuz yerde yapmak için her laboratuvarı ve her zorluğu yapın. Her laboratuvar için çözüm kodu sağlıyoruz, ancak bunu bir destek aracı yerine yardımcı bir kaynak olarak kullanmaya dikkat edin.

3. **Sınırların ötesine geçin** - bu klişe gibi görünebilir, ancak sadece laboratuvarların ve zorlukların sizden istediklerinde durmayın. Yaratıcı olun! Projeleri alıp kendinize mal edin. Onların ötesine inşa edin. Ne kadar çok pratik yaparsanız, o kadar iyi olursunuz.

:::warning
Bu kurs boyunca sık sık pratik yapmak, öğrenme sürecinizi hızlandıracaktır!
:::

Tamam, motivasyon konuşması bu kadar. Haydi başlayın!