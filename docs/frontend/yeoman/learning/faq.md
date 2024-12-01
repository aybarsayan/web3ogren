---
description: Bu belge, Yeoman ile ilgili sıkça sorulan soruları ve yanıtlarını kapsamaktadır. Projenin hedeflerinden, geliştirme araçlarına kadar çeşitli konularda bilgiler içermektedir.
keywords: [Yeoman, Sık Sorulan Sorular, CLI, Paket Yöneticisi, Geliştirme Araçları, Web Uygulamaları]
title: Sık Sorulan Sorular
---

# Sıkça Sorulan Sorular

`Projenin hedefleri nelerdir?`

`Komut satırı arayüzü nedir?`

`Paket yöneticisi nedir?`

`Yeoman, Grunt veya Gulp gibi derleme araçlarından nasıl farklıdır?`

`Yeoman, Brunch veya Ember-cli gibi araçlardan nasıl farklıdır?`

`Bower'da bir paketi nasıl kaydeder veya kaldırırım?`

`Yeoman projesi popüler çerçeveler için Generatörler sağlayacak mı?`

`Yeoman hangi lisansla yayımlanmıştır?`

`GitHub üzerinden bir sorun bildirmeden önce ne yapmalıyım?`

`npm` Yeoman'ı yüklemiş gibi görünüyor ama `yo` hala "komut bulunamadı" diyor.`

`EMFILE, çok fazla açık dosya` alıyorum`

`Uygulama belgelerimi yazmak için ne kullanmalıyım?`

`Insight veya Güncelleme Bildiricisini nasıl devre dışı bırakabilirim?`

`Özel bir web sunucusuyla canlı yenilemeyi kullanabilir miyim?`

`Yeoman ile oluşturulan bir web uygulamasını klonladıktan sonra ne yapmalıyım?`

`npm install -g yo` OS X üzerinde `sh: node: command not found` hatası verirse ne yapabilirim?`

###  Projenin hedefleri nelerdir?

Yeoman'ın kısa vadeli hedefleri, geliştiricilere daha iyi bir araç iş akışı sağlamaktır, böylece süreç üzerinde daha az zaman harcayıp güzel web uygulamaları inşa etmeye daha fazla odaklanabilirler. 

:::tip
Başlangıçta, mevcut çerçeveler ve geliştiricilerin alışık olduğu araçlarla çalışmayı mümkün olduğunca kolay hale getirmeyi umuyoruz.
:::

Uzun vadede, proje ayrıca geliştiricilere Web Bileşenleri gibi modern teknolojiler kullanarak uygulamalar oluşturma konusunda yardımcı olabilir.

###  Komut satırı arayüzü nedir?

Komut satırı arayüzü, geliştiricilerin bir sistemle metin komutları kullanarak etkileşimde bulunmalarının bir yoludur. Linux veya OSX'te bu genellikle terminal kullanılarak yapılır. Windows'ta, komut kabuğu (`cmd.exe`) veya PowerShell kullanılır, ancak daha iyi bir deneyim için [`cmder`](http://cmder.net/) kullanmanızı öneririz.

###  Paket yöneticisi nedir?

Paket yöneticisi, projelerin bağımlılıklarını kurma, güncelleme, yapılandırma ve yönetme sürecini otomatikleştiren bir araçtır. İyi örnekler arasında npm (Node.js), Bower (Web), Pypi (Python), Gem (Ruby), Composer (PHP), NuGet (.NET) bulunur.

###  Yeoman, Grunt veya Gulp gibi derleme araçlarından nasıl farklıdır?

Yeoman, geliştiricilerin yaygın görevleri daha kolay bir şekilde gerçekleştirmelerine yardımcı olmak için bir takım açık kaynak araçlarının üzerine inşa edilmiştir. [Gulp](http://gulpjs.com/) ve [Grunt](http://gruntjs.com/) kullandığımız görev çalıştırıcılardır. Bunlar, temel derleme sürecimizi ve görev eklenti mimarimizi güçlendirir.

Bu mimarinin üzerine, iyi bir şekilde birbiriyle çalışan ve geliştiricilere jeneratör sistemimiz ve Bower entegrasyonu gibi özellikler sunan özelleştirilmiş görevler, profiller ve sistemler ekledik. Yeoman, yapılandırma dosyası ayarlarınızı yapılandırmayı ve Sass, CoffeeScript ve Require.js'yi kutu içinde ayarlamayı üstlenir. Ek özellikler ile birlikte, kablolama, geliştirilmiş `serve` ve `init` gibi.

:::info 
Geliştiriciler, Yeoman tarafından başlatılan herhangi bir yapılandırmayı özelleştirme özgürlüğüne sahiptir.
:::

###  Yeoman, Brunch veya Ember-cli gibi araçlardan nasıl farklıdır?

Brunch ve Ember-cli gibi araçları seviyoruz ve bunların, Backbone.js ve Ember gibi çerçeveler ile iskele oluşturmak isteyen geliştiriciler için harika bir çözüm sunduğuna inanıyoruz. Yeoman jeneratör sistemi ile, Ruby on Rails Jeneratör sistemini Node ile çalışacak şekilde geçirdiğimiz için, uygulama iskelelerini yeni bir yöne taşıma fırsatını elde ettiğimiz düşüncesindeyiz; bu doğru bir noktada, herhangi bir geliştiricinin iskeletler yazmasını, birden fazla test çerçevesini desteklemesini, kendi şablonlarını yakalayıp kolayca yeniden kullanmasını sağlamaktadır.

###  Bower'da bir paketi nasıl kaydeder veya kaldırırım?

Bower'da paketler `register` komutunu kullanarak kaydedilebilir. örn. `bower register myawesomepackagename git://github.com/youraccount/yourrepo`. 

:::warning
Bunu yapmadan önce depolarınızın `install` edilmeyi destekleyecek gerekli dosyaları içerdiğinden emin olmak için Bower [belgelerini](http://bower.io/) okumanızı öneririz.
:::

###  Yeoman projesi popüler çerçeveler için Generatörler sağlayacak mı?

Amacımız, geliştiricilere ve topluluğa zengin web uygulamaları oluşturmaları için gereken araçları kolayca sağlamak. Bu hedefle, jeneratör sistemimize harika bir API (ve dökümantasyon) sunacağız ve örneklerin nasıl uygulanacağı konusunda örnekler vereceğiz, ancak popüler çerçeveler için jeneratörler oluşturup sürdürmek için topluluğa güveneceğiz. 

Bu, Yeoman'ı daha iyi hale getirmeye odaklanmamıza olanak tanıyacaktır.

Github'da resmi olarak desteklenen [jeneratörler listesini](https://github.com/yeoman?query=generator-) görebilirsiniz.

###  Yeoman hangi lisansla yayımlanmıştır?

Yeoman, [BSD](http://opensource.org/licenses/bsd-license.php/) lisansı altında yayımlanmıştır.

###  GitHub üzerinden bir sorun bildirmeden önce ne yapmalıyım?

`Bir sorun bildirme kılavuzunu` okuduğunuzdan emin olun.

###  `npm` Yeoman'ı yüklemiş gibi görünüyor ama `yo` hala "komut bulunamadı" diyor.

> Muhtemelen, PATH'iniz henüz küresel NPM modüllerini hesaba katmıyor. 
> Daha iyi belgeler yakında çıkacak, ama şimdilik, [bu yorumu](https://github.com/yeoman/yeoman/issues/466#issuecomment-8602733) ve [bu konuyu](https://github.com/yeoman/yeoman/issues/430#issuecomment-8597663) okuyun.

Bu genellikle, Node'u Homebrew aracılığıyla yüklediğinizde olur, çünkü bu durum, Node modüllerini PATH'inizde bulunmayan bir dizine koyar.

Homebrew'den:

```
==> Caveats
Homebrew npm yükledi.
npm ile yüklenen ikili dosyaların tanınabilmesi için aşağıdaki yolu PATH ortam değişkeninize eklemenizi öneririz:
  /usr/local/share/npm/bin
```

:::note
İleri düzey kullanıcılar için hızlı bir çözüm, şu satırı `.bashrc` dosyanıza eklemektir:
`export PATH=/usr/local/share/npm/bin:$PATH`

Yeni başlayanlar için `brew uninstall node` komutunu çalıştırın ve Node'u [web sitelerinden](https://nodejs.org/) indirin ve yükleyin.
:::

###  `EMFILE, çok fazla açık dosya` alıyorum

EMFILE, işletim sisteminin aynı anda açık dosya açıklıkları için ulaştığınız sınırı ifade eder. Bunun için yapacak pek bir şeyimiz yok, ancak sınırı kendiniz artırabilirsiniz.

Soft limitinizi artırmak için `.bashrc/.zshrc` dosyanıza `ulimit -n [dosya sayısı]` ekleyin.

Eğer işletim sisteminin sert limitine ulaşırsanız, bunu artırmak için [bu StackOverflow cevabını](http://stackoverflow.com/questions/34588/how-do-i-change-the-number-of-open-files-limit-in-linux/34645#34645) izleyebilirsiniz.

###  Uygulama belgelerimi yazmak için ne kullanmalıyım?

[Belgelerin oluşturulması için önerilen çözümlerle ilgili #152 biletinin detaylarını](https://github.com/yeoman/yeoman/issues/152#issuecomment-7081670) görüntüleyin.

###  Insight veya Güncelleme Bildiricisini nasıl devre dışı bırakabilirim?

Bunları devre dışı bırakmak için komut satırı bayrağı kullanabilirsiniz. Örn. `yo webapp --no-insight`.

- Insight: `--no-insight`  
- Güncelleme Bildiricisi: `--no-update-notifier` 

Ayrıca, `yeoman_test` gibi bir ortam değişkenini herhangi bir değerle tanımlayarak ikisini birden kalıcı olarak devre dışı bırakabilirsiniz.

###  Özel bir web sunucusuyla canlı yenilemeyi kullanabilir miyim?

Tabii ki! Gruntfile/Gulpfile'ınızdaki `connect` görevini kaldırabilir ve HTML'nize şu snippeti manuel olarak ekleyebilirsiniz:

```html
<!-- livereload script -->
<script>document.write('<script src="http://'
 + (location.host || 'localhost').split(':')[0]
 + ':35729/livereload.js?snipver=1" type="text/javascript"><\/script>')
</script>
```

Bundan sonra, normalde olduğu gibi `serve` görevini çalıştırın ve otomatik sayfa yenilemenin keyfini çıkarın.

###  Yeoman ile oluşturulan bir web uygulamasını klonladıktan sonra ne yapmalıyım?

Yeoman sizin için bir `.gitignore` dosyası oluşturur. Bu dosya, `node_modules` ve `bower_components` klasörlerini kara listeye alır. Yani, `serve` görevini çalıştırmak ve `bower.json` dosyasında listelenen JavaScript bağımlılıklarını indirmek için her iki komutu da çalıştırmalısınız:

```sh
$ npm install
$ bower install
```

Ve bu klasörlerin doğru bir şekilde oluşturulup oluşturulmadığını kontrol edin.

###  `npm install -g yo` OS X üzerinde `sh: node: command not found` hatası verirse ne yapabilirim?

Şunu deneyin:

```sh
sudo chmod a+rx /usr/local/bin /usr/local/bin/node
```

Kimlik doğrulaması yapın ve tekrar çalıştırın.  
Açıklama: NPM yüklemeyi _nobody_ olarak yürütür, bu yüzden ikili erişilemezse yüklemenin, _node_ bulunamazmış gibi görünmesine neden olabilir.

![](../../images/cikti/yeoman/assets/img/yeoman-009.png)