---
title: Giriş - Telegram BNB Mini Uygulamaları Oluşturma
description: Bu rehber, Telegram üzerinde BNB kullanarak mini uygulama oluşturma sürecini adım adım açıklamaktadır. Geliştiriciler, Telegram'ın özelliklerini kullanarak çeşitli uygulamalar ve oyunlar yaratabilirler.
keywords: [Telegram, BNB, mini uygulama, blockchain, geliştirme, rehber, oyun]
---

# Telegram BNB Mini Uygulamaları Oluşturma: Geliştiriciler için Bir Rehber

Telegram üzerinde merkeziyetsiz uygulamaların başlatılması, kullanıcılara ek yazılım yüklemeden mini uygulamalara ve oyunlara erişim sağlaması nedeniyle giderek daha popüler hale gelmiştir. Bu, kullanıcıların blockchain tabanlı hizmetlerle etkileşimde bulunmalarını kolaylaştırarak giriş engellerini azaltmakta ve geliştiricilerin uygulamalarını geniş bir Telegram kitlesine dağıtmasını kolaylaştırmaktadır.

:::tip
Bu rehber, sadece birkaç saat içinde BNB üzerinde temel bir Telegram mini uygulaması oluşturma adımlarını gösterecektir. Telegram'ın açık platformunda kendi BNB projenizi başlatma becerisine sahip olacaksınız.
:::

İster bir blockchain uzmanı olun, ister yeni başlıyor olun, bu eğitim merkeziyetsiz uygulama yaratımını açıklığa kavuşturmayı amaçlamaktadır. O halde BSC üzerinde geliştirmeye başlayalım! Telegram mini uygulamalarını öğrendiğinizde olanaklar sınırsızdır.

**Not: Bu rehber, Telegram BNB mini uygulamalarının oluşturulmasıyla ilgili adımların yüksek seviyeli bir genel görünümünü sağlamaktadır. Detaylı bir rehber için [youtube demosuna](https://www.youtube.com/watch?v=6dMDhPOpPjI) veya [github reposuna](https://github.com/kang5647/bnb-telegram-demo) göz atın.**

---

# Telegram BNB Mini Uygulamaları Giriş 

## Telegram Mini Uygulamaları Nedir?

**Telegram Mini Uygulamaları**, Telegram sohbetleri içinde çalışan hafif web uygulamalarıdır. Geliştiricilerin Telegram'ın özelliklerine ve geniş kitleye hitap eden sosyal deneyimler, oyunlar, pazaryerleri ve diğer hizmetler oluşturmasına olanak tanır.

![catzen](../../images/bnb-chain/showcase/img/catizen.png)

> Catizen’in play-to-earn ve Hamster Kombat’ın tap-to-earn, Telegram mini oyunları için bir sonraki büyük şey ne olacak?  
> — Telegram Geliştirici Ekibi

Mini Uygulamalar anında yüklenir, çevrimdışı çalışır ve yüklenmesine gerek yoktur. Telegram girişi, ödemeler, depolama gibi özellikleri kullanabilirler. Geliştiriciler, HTML, CSS ve JavaScript kullanarak Mini Uygulamalar oluşturabilirler.

## Mini Uygulama Oluşturma

Bir Mini Uygulama oluşturmak için şunlara ihtiyacınız var:

- **Telegram botu** - @BotFather kullanarak bir bot oluşturun ve bir API token alın.
- **Web uygulaması** - Botunuzla iletişim kuran web teknolojilerini (HTML, CSS, JS) kullanarak bir uygulama geliştirin.
- **Mini Uygulama manifestosu** - Uygulamanızla ilgili ad, açıklama, simge ve web uygulamanızın URL'si gibi bilgileri sağlayın. Manifestoyu @BotFather kullanarak kaydedin.

Web uygulamanız bir iframe içinde çalışacak ve kullanıcının Telegram uygulamasıyla Telegram Köprüsü aracılığıyla iletişim kuracaktır. Köprü, Telegram API'sini açığa çıkarır ve web uygulamanız ile kullanıcının Telegram uygulaması arasında mesajları iletir.

## Mini Uygulama Türleri

İki ana Mini Uygulama türü vardır:

### Anlık Uygulamalar

Anlık Uygulamalar, bir kullanıcı botun kullanıcı adını yazdığında sonuç olarak görünür. Kullanıcı, Mini Uygulamayı başlatmak için bir uygulama sonucuna dokunur. Anlık Uygulamalar, özellikle:

- Arama deneyimleri
- Hızlı etkileşimler
- Yeni içerik keşfetmek için harikadır.

### Doğrudan Bağlantı Uygulamaları

Kullanıcılar, yalnızca bir bağlantıya dokunarak Doğrudan Bağlantı Uygulamasını açabilirler. Doğrudan Bağlantı Uygulamaları, mevcut sohbet bağlamının farkındadır ve paylaşımlı, işbirlikçi deneyimleri destekler. Doğrudan Bağlantı Uygulamaları şunlar için idealdir:

- Sosyal deneyimler
- Oyunlar
- Verimlilik araçları
- Ve daha fazlası

![example](https://core.telegram.org/file/464001388/10b1a/IYpn0wWfggw.1156850/fd9a32baa81dcecbe4)

Mini uygulama, ayrıca bir klavye düğmesinden, bir anlık düğmeden ve bot menü düğmesinden başlatılabilir. [Resmi Telegram mini uygulama dokümantasyonuna](https://core.telegram.org/bots/webapps#implementing-mini-apps) başvurun.

---

## BNB Mini Uygulama Oluşturma Adım Adım Rehberi

Telegram arkasında güçleriyle, Mini Uygulamalar sayısız yeni yaratıcılık ve platformda ilgi çekici deneyimler oluşturma fırsatları sunar. Mini Uygulamaların potansiyeli büyüktür ve bu sadece başlangıçtır.

### Telegram Botu Oluşturun

Başlamak için bir Telegram botu oluşturmanız gerekiyor. **@BotFather** botuna gidin ve **/newbot** yazarak yeni bir bot oluşturun. Botunuz için bir API token alacaksınız. Bu token'ı özel tutun çünkü botunuzu kontrol etmenizi sağlayacaktır.

### Web Uygulamasını Botunuza Bağlayın

Sonraki adım, web uygulamanızı Telegram botuna bağlamaktır. **@BotFather** botunda **/newapp** komutunu kullanarak botunuzu seçin. Uygulama adı, açıklama, fotoğraf gibi bilgileri sağlayın. Son olarak, web uygulamanızın URL'sini girin. 

:::info
Mini uygulamanız artık Telegram uygulamasında görünecek ve kullanıcılar tarafından başlatılabilir.
:::

### Ek Yetenekler

Bir doğrudan bağlantıdan açılan mini uygulamalar, sınırlı yeteneklere sahiptir. Kullanıcı adına mesajları okuyamaz veya gönderemezler. Ancak, mevcut sohbet bağlamı içinde işbirlikçi ve çok oyunculu özellikleri desteklerler. Kullanıcılar, mesaj göndermek için aktif olarak bir sonuç seçebilmek için anlık moda yönlendirilmelidir.

Mini uygulamalar, tam teşekküllü web hizmetleri, ekip işbirlikleri, çok oyunculu oyunlar ve daha fazlasını oluşturmak için güçlü araçlardır. Olanaklar sonsuzdur.

---

## Mini Uygulamanızı Bir Oyun Haline Getirme

Mini Uygulamanızı Telegram'da ilgi çekici bir oyuna dönüştürmek için önce **@BotFather** ile bir bot kaydetmeli ve önceki bölümde belirtildiği gibi bir Mini Uygulama oluşturmalısınız. İşlevsel bir Mini Uygulamanız olduğunda, Telegram’ın Oyun API'sini kullanarak onu bir oyuna dönüştürebilirsiniz.

### Mini Uygulamalar ile Mini Oyunlar Arasındaki Fark

Mini oyunlar, ek bilgileri sağlayarak mini uygulamaların üzerine inşa edilir:

- liderlik tabloları,
- oyun açıklamaları,
- ve oyunu başlatacak bir düğme. 
- Mini uygulamanızı paketlemeye yardımcı olurlar ve bu da arkadaşlarınızla ve toplulukla paylaşmayı kolaylaştırır. 

Mini bir oyun oluşturmak için /newgame komutunu kullanın ve oyununuzun URL'sini döndüren geri çağırma işlevlerini yapılandırın.

### @GameBot ile Bir Oyun Kaydet

İlk adım, oyunuzu @BotFather ile kaydetmektir. @BotFather'a /newgame komutunu gönderin ve gereksinim duyulan bilgileri sağlayın:

- Oyununuzun başlığı ve açıklaması
- Kapak resmi
- Bir kullanıcı oyuna başladığında göreceği mesaj metni
- Mini Uygulamanızın URL'si

:::warning
Telegram Oyun API'si ile etkileşimleri yönetmek için kodunuzda geri çağırma işlevlerini uygulamanız gerekir.
:::

Özellikle, oyununuzda bir kullanıcının bir anlık düğmeye tıkladığında Telegram'dan güncellemeleri alacak bir `callback_query()` geri çağırması gerekir. Bu geri çağırmada, hangi düğmenin tıklandığını belirlemek için geri çağırma kimliğini kontrol etmelisiniz. Oyununuz için birden fazla anlık klavye düğmesi uygulayabilirsiniz, ancak ilk düğmenin her zaman oyunu başlatması gerektiğini unutmayın.

![codesnpit1](../../images/bnb-chain/showcase/img/codesnipt1.png)

### Oyununuzu Paylaşın

Kaydedildiğinde, oyununuzun paylaşılabilir bir oyun URL'si ve oyuncuların oyunu başlatmak için girebilecekleri bir oyun kodu alacaktır. Bu URL'yi ve kodu web sitenizde, sosyal medyada ve Telegram sohbetlerinde yeni oyunculara ulaşmak için paylaşabilirsiniz.

![bnbminigame](../../images/bnb-chain/showcase/img/bnbminigame.png)

### Bir Liderlik Tablosu Düşünün (İsteğe Bağlı)

Etkileşimi ve rekabeti artırmak için, oyuncuların en yüksek puanları görebileceği bir oyun içi liderlik tablosu uygulayabilirsiniz. Oyuncu puanlarını bir veritabanında saklamanız ve geri çağırmalarınızda liderlik tablo verilerini döndürmeniz gerekecektir. Liderlik tabloları isteğe bağlı bir özelliktir, ancak Telegram oyunlarının popülaritesini ve sürekliliğini büyük ölçüde artırabilir.

Bu adımları takip ederek, JavaScript ve Telegram Oyun API'sini kullanarak Telegram içinde tam özellikli oyunlar oluşturabilirsiniz. Oyunlar, kullanıcıları etkileşimde bulunma açısından heyecan verici bir yöntemdir ve Telegram'daki çok oyunculu, sosyal ve etkileşimli oyun deneyimleri için olanaklar sonsuzdur. **Yaratıcılığınızı serbest bırakın ve Telegram'da bir sonraki hit oyunu inşa edin!**

---

## Telegram BNB Mini Uygulamalarıyla İlgili SSS

### Telegram BNB Mini Uygulamalarının ana özellikleri nelerdir?

Telegram BNB Mini Uygulamaları, geliştiricilerin Telegram'da doğrudan erişilebilen merkeziyetsiz uygulamalar oluşturmasına olanak tanır. Bazı ana özellikler şunlardır:

- Sohbet bağlamı sağlamak için Telegram kullanıcı adı, sohbet ID'si ve mesaj ID'sine erişim
- Kullanıcılar adına mesaj gönderme yeteneği (izinleri ile)
- Kripto cüzdan aracılığıyla ödemeleri kabul etme seçeneği
- Merkeziyetsiz işlevsellik için BSC/opBNB'ye erişim
- Çok oyunculu oyunlar ve diğer etkileşimli deneyimler oluşturma seçeneği

### Mini Uygulamalar ile Botlar arasındaki farklar nelerdir?

Telegram Mini Uygulamaları, Telegram uygulaması içinde çalışan web uygulamalarıdır; oysa Telegram Botları, API aracılığıyla kontrol edilen otomatik hesaplardır. Bazı ana farklar şunlardır:

- Mini Uygulamalar görsel bir arayüze sahipken, Botlar esasen metin mesajları aracılığıyla iletişim kurar.
- Mini Uygulamalar, ödemeler, oyunlar ve konum paylaşımı gibi özelliklere erişebilirken, Botların daha sınırlı işlevselliği vardır.
- Mini Uygulamalar, verilere erişim ve mesaj gönderme için kullanıcı onayı gerektirir, oysa Botların kullanıcı verilerine ve mesaj gönderme yeteneklerine dolaylı erişimi vardır.
- Mini Uygulamalar, kullanıcılar için daha sağlam bir deneyim sunarken aynı zamanda verilerini ve gizliliklerini korur. Botlar, haber güncellemeleri, hatırlatmalar ve müşteri desteği gibi daha basit kullanım durumları için faydalı olmaya devam etmektedir.

### Mini Uygulama oluşturmak için hangi dilleri ve framework'leri kullanabilirim?

Telegram Mini Uygulamaları oluşturmak için şunları kullanabilirsiniz:

- HTML, CSS ve JavaScript - Mini Uygulamalar, Telegram uygulaması içinde çalışan web uygulamalarıdır.
- React, Vue.js veya Angular - Popüler JavaScript framework'leri frontend oluşturmak için kullanılabilir.
- Solidity - Merkeziyetsiz işlevsellik için BSC üzerinde akıllı sözleşmeler yazmak için.
- Web3.js - Mini Uygulamanızın frontend'inden BSC ile etkileşimde bulunmak için.

---

## Özet

Telegram mini uygulamaları ve mini oyunları geliştiricilere kullanıcılarla etkileşimde bulunmanın heyecan verici yeni yollarını sunmaktadır. Burada belirlenen adım adım rehberi takip ederek, Telegram'ın geniş kullanıcı tabanını kendi etkileşimli web uygulamalarınızı ve oyunlarınızı paylaşmak için kullanabilirsiniz. 

Olanakları düşünün - çok oyunculu deneyimler, sohbet botları, verimlilik araçları ve daha fazlası artık birkaç kod satırı uzaklıkta. Telegram platformunu genişletmeye devam ettikçe, geliştiricilerin en son trendleri takip etme ve milyonlarca kişiye ulaşma fırsatı olacaktır. Bu nedenle beklemeyin, bugün kendi mini uygulamanızı oluşturmaya başlayın! **Doğru fikir ve biraz çabayla, Telegram'da bir sonraki viral fenomene imza atabilirsiniz.**