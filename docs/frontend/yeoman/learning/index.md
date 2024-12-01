---
description: Yeoman, uygulama geliştirme için bir iskelet sistemi (scaffolding system) sağlayarak projeleri hızlı bir şekilde başlatmanıza yardımcı olur. Bu rehber, Yeoman'ın temellerini ve kullanmaya nasıl başlayacağınızı kapsamlı bir şekilde açıklamaktadır.
keywords: [Yeoman, scaffolding, proje geliştirme, npm, generator, web uygulaması]
title: Yeoman ile Başlarken
---


Yeoman, her türlü uygulamanın oluşturulmasına olanak tanıyan genel bir iskelet sistemi (scaffolding system)dir. Yeni projelere **hızlı bir şekilde** başlamayı sağlar ve mevcut projelerin bakımını kolaylaştırır.

Yeoman, **dil bağımsızdır**. Herhangi bir dilde (Web, Java, Python, C# vb.) projeler oluşturabilir.

Yeoman kendisi hiçbir **karar vermez**. Tüm kararlar, temel olarak Yeoman ortamında eklenti olan _generatörler_ tarafından alınır. [Birçok kamuya açık generatör](https://generators) mevcuttur ve herhangi bir iş akışına uyacak şekilde [yeni bir tane oluşturmak](https://authoring) oldukça kolaydır. Yeoman, iskelet ihtiyaçlarınız için her zaman **doğru seçimdir.**

:::tip
Yeni projelerinizi başlatırken farklı generatörleri denemek için cesur olun, bu süreçte öğrenme ve keşfetme şansınız artar.
:::

İşte bazı yaygın kullanım senaryoları:

- Hızla yeni bir proje oluşturmak
- Bir projenin yeni bölümlerini oluşturmak, örneğin birim testleri ile yeni bir denetleyici
- Modüller veya paketler oluşturmak
- Yeni hizmetleri başlatmak
- Standartları, en iyi uygulamaları ve stil rehberlerini uygulamak
- Kullanıcıların örnek bir uygulama ile başlamasını sağlayarak yeni projeleri tanıtmak
- Vs. vs.

---

## Başlarken

`yo`, iskelet şablonlarını (generators olarak adlandırılır) kullanarak projelerin oluşturulmasına olanak tanıyan Yeoman komut satırı yardımcı programıdır. Yo ve kullanılan generatörler [npm](http://npmjs.org) kullanılarak kurulur.

### yo ve bazı generatörlerin kurulumu

İlk olarak `yo`'yu `npm` kullanarak kurun:

```sh
npm install -g yo
```

Ardından gereken generatör(ler)i kurun. Generatörler, `generator-XYZ` adı verilen npm paketleridir. [Web sitemizde](https://generators) arama yapabilir veya `yo` çalıştırırken "bir generatör kur" menü seçeneğini seçerek bulabilirsiniz. `webapp` generatörünü kurmak için:

```
npm install -g generator-webapp
```

:::warning
Yeni Node ve npm kullanıcıları, izin sorunlarıyla karşılaşabilir. Bu sorunlar, kurulum sırasında `EACCESS` hataları şeklinde ortaya çıkar. Eğer bu başınıza gelirse, [npm izinlerini düzeltme kılavuzuna](https://docs.npmjs.com/getting-started/fixing-npm-permissions) başvurun.
:::

*npm, [Node.js](https://nodejs.org/) için paket yöneticisidir ve onunla birlikte gelir.*

*Windows'ta, deneyimi artırmak için [`cmder`](https://cmder.app/) veya PowerShell gibi daha iyi bir komut satırı aracı kullanmanızı öneririz.*


### Temel iskelet oluşturma

Aşağıdaki örneklerimizde `generator-webapp` kullanacağız. Aynı sonucu elde etmek için `webapp` ile generatör adını değiştirin.

**Yeni bir proje oluşturmak için:**

```sh
yo webapp
```

Çoğu generatör, yeni projeyi özelleştirmek için bir dizi soru soracaktır. Kullanılabilir seçenekleri görmek için, `help` komutunu kullanın:

```sh
yo webapp --help
```

Birçok generatör, [Grunt](http://gruntjs.com/) veya [Gulp](http://gulpjs.com/) gibi yapı sistemlerine ve npm ile Bower gibi paket yöneticilerine dayanır. Yeni uygulamanızı çalıştırma ve bakımını öğrenmek için **generatörün web sitesini** ziyaret ettiğinizden emin olun. Bir generatörün ana sayfasına kolayca erişmek için:

```sh
npm home generator-webapp
```

Karmaşık çerçeveleri iskeletlemek için kullanılan generatörler, genellikle bir projenin daha küçük parçalarını iskeletlemek için ek generatörler sağlar. Bu generatörler genellikle _alt-generatörler_ olarak adlandırılır ve `generator:sub-generator` şeklinde erişilir.

Bir örnek olarak **`generator-angular`** alalım. Tam angular uygulaması oluşturulduktan sonra, başka özellikler eklenebilir. Projeye yeni bir denetleyici eklemek için denetleyici alt-generatörünü çalıştırın:

```sh
yo angular:controller MyNewController
```

---

### Diğer yo komutları

Önceki bölümde ele alınan temellerin yanı sıra, `yo` aynı zamanda tamamen etkileşimli bir araçtır. Bir terminalde sadece `yo` yazarak, generatörlerle ilgili her şeyi yönetmek için bir seçenek listesi alırsınız: çalıştırma, güncelleme, kurulum, yardım ve diğer yardımcı programlar.

Yo ayrıca aşağıdaki komutları sağlar:

- `yo --help` Tüm yardım ekranına erişin
- `yo --generators` Yüklenen tüm generatörleri listele
- `yo --version` Sürümü al

---

### Sorun Giderme

En yaygın sorunların çoğunu bulmak için:

```sh
yo doctor
```

`doctor` komutu, en yaygın sorunları teşhis edecek ve çözüm adımlarını sağlayacaktır.

:::info
Bu komut, projenizi sağlıklı bir şekilde çalıştırabilmeniz için gerekli olan temel bilgileri sağlar.
:::

### Bir generatör oluşturma

[Authoring](https://authoring) sayfasına bakın.