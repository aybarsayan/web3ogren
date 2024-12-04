---
title: Fastify Stil Rehberi
seoTitle: Fastify Style Guide
sidebar_position: 1
description: Bu rehber, Fastify kullanıcıları için geliştirme belgeleri yazarken takip edilmesi gereken stil kılavuzunu sunmaktadır. Kullanıcıların etkili ve anlaşılır belgeler yazmasını sağlamayı amaçlamaktadır.
tags: 
  - fastify
  - stil rehberi
  - yazım
  - belgeler
keywords: 
  - fastify
  - stil rehberi
  - yazım
  - belgeler
---
## Hoşgeldiniz

*Fastify Stil Rehberi*'ne hoşgeldiniz. Bu rehber, açık kaynak çerçevemiz üzerinde geliştirici belgeleri yazan kullanıcılar için geleneksel bir yazım stilini sağlamayı amaçlamaktadır. Her konu net ve iyi bir şekilde açıklanmış olup, kullanıcıların kolayca anlayabileceği ve uygulayabileceği belgeler yazmalarına yardımcı olmak için hazırlanmıştır.

## Bu rehber kimler içindir?

Bu rehber, Fastify ile geliştirme yapmayı seven veya belgelerimize katkıda bulunmak isteyen herkes içindir. Teknik belge yazımında uzman olmanız gerekmez. Bu rehber, size yardımcı olmak için buradadır.

Açık kaynak topluluğumuza katılmak için web sitemizdeki [katkıda bulun](https://fastify.dev/contribute) sayfasını ziyaret edin veya GitHub'daki [KATKIDA BULUNMA.md](https://github.com/fastify/fastify/blob/main/CONTRIBUTING.md) dosyasını okuyun.

## Yazmadan önce

Aşağıdakileri bilmeniz gerekir:

* JavaScript
* Node.js
* Git
* GitHub
* Markdown
* HTTP
* NPM

### Hedef Kitlenizi Düşünün

Yazmaya başlamadan önce, hedef kitlenizi düşünün. Bu durumda, hedef kitleniz HTTP, JavaScript, NPM ve Node.js konularını zaten bilmelidir. Okuyucularınızı dikkate almak önemlidir çünkü içeriklerinizi tüketenler onlardır. Mümkün olduğunca faydalı bilgiler vermek istersiniz. Bilmeleri gereken önemli şeyleri düşünün ve bunları nasıl anlayabileceklerini değerlendirin. Okuyucuların kolayca ilişki kurabileceği kelimeler ve referanslar kullanın. Topluluktan geri bildirim isteyin, bu, kullanıcı ve ulaşmak istediğiniz hedefe odaklanmış daha iyi belgeler yazmanıza yardımcı olabilir.

### Doğrudan konuya girin

Okuyucularınıza alacakları net ve kesin bir eylem belirtin. En önemli şeyle başlayın. Bu sayede, ihtiyaç duydukları bilgileri daha hızlı bulmalarına yardımcı olabilirsiniz. Genellikle, okuyucular sayfadaki ilk içeriği okumaya eğilimlidir ve birçok kişi daha fazla kaydırma yapmayacaktır.

**Örnek**

Böyle değil: Önekler, parametreli bir yol kaydı için çok önemlidir. Bu, çerçevenin yeni bir parametre oluşturulduğunu bilmesini sağlar. Parametre adı öncesine iki nokta koyarak parametreli yol oluşturulabilir.

Böyle: Bir parametreli yolu kaydetmek için, parametre adından önce iki nokta koyun. İki nokta kullanmak, çerçeveye bunun parametreli bir yol olduğunu ve statik bir yol olmadığını bildirir.

### Video veya görsel içerik eklemekten kaçının

:::warning
Belgelerinize video veya ekran görüntüsü eklemeyin. Versiyon kontrolü altında tutmak daha kolaydır. Videolar ve görseller, yeni güncellemeler geliştikçe güncel hale gelmeyecektir. Bunun yerine, bir referans bağlantısı veya bir YouTube videosu yapın. 
:::

Bağlantılarınızı ``Başlık`` şeklinde ekleyebilirsiniz.

**Örnek**

```
Kancalar hakkında daha fazla bilgi edinmek için [Fastify kancaları](https://fastify.dev/docs/latest/Reference/Hooks/) sayfasını inceleyin.
```

Sonuç:
> Kancalar hakkında daha fazla bilgi edinmek için [Fastify kancaları](https://fastify.dev/docs/latest/Reference/Hooks/) sayfasını inceleyin.

### İntihalden kaçının

Başka insanların çalışmalarını kopyalamaktan kaçının. Mümkün olduğunca orijinal kalın. Ne yaptıklarından öğrenebilir ve kullandığınız belirli bir alıntı varsa nereden geldiğini referans verebilirsiniz.

## Kelime Seçimi

Belgelerinizi yazarken okuyucuların okunabilirliğini artırmak ve belgelerinizi düzenli, doğrudan ve temiz hale getirmek için kullanmanız ve kaçınmanız gereken birkaç şey vardır.

### İkinci tekil "sen" zamirini ne zaman kullanmalısınız

Makaleler veya kılavuzlar yazarken, içeriğiniz okuyuculara ikinci tekil ("sen") olarak doğrudan hitap etmelidir. Onlara belirli bir konuda ne yapmaları gerektiğini doğrudan öğretmek daha kolaydır. Bir örneği görmek için `Eklentiler Kılavuzu` sayfasını ziyaret edin.

**Örnek**

Böyle değil: Aşağıdaki eklentileri kullanabiliriz.

Böyle: Aşağıdaki eklentileri kullanabilirsiniz.

> `Vikipedi` 'ye göre, ***Sen*** genellikle ikinci tekil zamirdir.  
> Ayrıca, çok resmi bir belirsizlik zamiri yerine daha yaygın bir alternatif olarak belirsiz bir kişiye atıfta bulunmak için de kullanılır.

## İkinci tekil "sen" zamirini ne zaman kullanmamalısınız

Referans belgeleri veya API belgeleri gibi resmi yazım kurallarından biri, ikinci tekil ("sen") veya okuyucuya doğrudan hitap etmekten kaçınmaktır.

**Örnek**

Böyle değil: Aşağıdaki öneriyi örnek olarak kullanabilirsiniz.

Böyle: Örnek olarak, aşağıdaki öneriler referans alınmalıdır.

Canlı bir örneği görüntülemek için `Dekoratörler` referans belgesine bakın.

### Kısaltmalardan kaçının

Kısaltmalar, bir kelimenin yazılı ve sözlü formlarının kısaltılmış versiyonlarıdır, örneğin "yapmam" yerine "yapmam". Daha resmi bir ton sağlamak için kısaltmalardan kaçının.

### Küçümseyici terimler kullanmaktan kaçının

Küçümseyici terimler, şunları içerir:

* Sadece
* Kolay
* Basit
* Temelde
* Belli ki

Okuyucu, Fastify çerçevesini ve eklentilerini kullanmanın kolay olduğunu düşünmeyebilir; basit, kolay, aşağılayıcı veya duyarsız yönünde görünmesini sağlayan kelimelerden kaçının. Belgeleri okuyan herkesin aynı anlayış seviyesine sahip olmadığını unutmayın.

### Fiil ile başlamayı tercih edin

Tanımınıza genellikle bir fiil ile başlayın, bu okuyucunun takip etmesi için basit ve net kılar. Şu an zamanını kullanmaya çalışın, çünkü okuyucunun anlaması daha kolaydır ve geçmiş ya da gelecek zaman yerine kullanımı daha tercih edilir.

**Örnek**

Böyle değil: Fastify'ı kullanabilmek için Node.js'in yüklenmesi gerekir.

Böyle: Fastify'ı kullanmak için Node.js'i yükleyin.

### Gramatik modlar

Gramatik modlar, yazımınızı ifade etmenin harika bir yoludur. Doğrudan bir ifade yaparken fazla baskın bir ton olmaktan kaçının. Belirgin, zorunlu ve ihtimalli modlar arasında ne zaman geçiş yapacağınızı bilin.

**Belirgin** - Gerçek bir ifade veya soru yaparken kullanılır.

Örnek: Test çerçevesi mevcut olmadığından, "Fastify test yazmanın yollarını önerir".

**Zorunlu** - Talimatlar, eylemler, komutlar verirken veya başlıklarınızı yazarken kullanılır.

Örnek: Gelişime başlamadan önce bağımlılıkları yükleyin.

**İhtimalli** - Öneriler, hipotezler veya gerçek dışı ifadeler yaparken kullanılır.

Örnek: Çerçevenin kapsamlı bilgilerini almak için web sitemizdeki belgeleri okumak önerilir.

### **Aktif** ses kullanın, **pasif** değil

Aktif ses, belgelendirmenizi iletmenin daha kompakt ve doğrudan bir yoludur.

**Örnek**

Pasif: Node bağımlılıkları ve paketleri npm tarafından yüklenir.

Aktif: npm paketleri ve node bağımlılıklarını yükler.

## Yazım Stili

### Belge başlıkları

Yeni bir kılavuz, API veya referans yaratırken `/docs/` dizininde, belgenizin konusunu en iyi tanımlayan kısa başlıklar kullanın. Dosyalarınızı kebab biçiminde adlandırın ve Ham veya camelCase kullanmaktan kaçının. Kebab biçimi hakkında daha fazla bilgi edinmek için bu Medium makalesini ziyaret edebilirsiniz: [Case Styles](https://medium.com/better-programming/string-case-styles-camel-pascal-snake-and-kebab-case-981407998841).

**Örnekler**:

>`hook-and-plugins.md`,  
`adding-test-plugins.md`,  
`removing-requests.md`.

### Hiperlinkler

Hiperlinklerin, neye atıfta bulunduğuna dair net bir başlık olması gerekir. Hiperlinkinizin nasıl görünmesi gerektiği:

```MD
<!-- Böyle -->
[Fastify Eklentileri](https://fastify.dev/docs/latest/Plugins/)

<!--Böyle değil -->
[Fastify](https://fastify.dev/docs/latest/Plugins/)
[](https://fastify.dev/docs/latest/Plugins/ "fastify plugin")
[](https://fastify.dev/docs/latest/Plugins/)
[http://localhost:3000/](http://localhost:3000/)
```

Belgelerinize mümkün olduğunca çok önemli referans ekleyin, ancak dikkat dağıtıcı unsurların önüne geçmek için başlangıç seviyesindeki kullanıcılar için çok sayıda bağlantı koymaktan kaçının.