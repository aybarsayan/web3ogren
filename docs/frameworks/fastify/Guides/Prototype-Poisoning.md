---
title: Prototip Zehirlenmesinin Tarihi
seoTitle: Prototip Zehirlenmesi ve Güvenlik Açıkları
sidebar_position: 4
description: Eran Hammerın prototip zehirlenmesi makalesi, web güvenliğinde kritik bir sorun üzerine derinlemesine bir inceleme sunmaktadır. JavaScriptteki potansiyel riskler ve çözüm yolları ele alınmaktadır.
tags: 
  - güvenlik
  - javascript
  - veri doğrulama
  - açık kaynak
keywords: 
  - prototip zehirlenmesi
  - JSON
  - joi
  - hapi
---
> Aşağıda Eran Hammer tarafından yazılmış bir makale bulunmaktadır. 
> Geçmişe dönük olarak burada [izinle](https://github.com/fastify/fastify/issues/1426#issuecomment-817957913) çoğaltılmıştır. 
> Orijinal HTML kaynağından Markdown kaynağına yeniden formatlanmıştır, 
> ancak başka bir değişiklik yapılmamıştır. Orijinal HTML yukarıdaki izin linkinden alınabilir.

## Prototip zehirlenmesinin tarihi


Eran Hammer'ın makalesine dayanarak, bu sorun bir web güvenliği hatasından kaynaklanıyor. 
Aynı zamanda açık kaynak yazılımı sürdürmek için gerekli çabaları ve mevcut iletişim kanallarının sınırlamalarını mükemmel bir şekilde göstermektedir.

:::tip
Ama önce, gelen JSON verilerini işlemek için bir JavaScript framework'ü kullanıyorsak, 
[Prototip Zehirlenmesi](https://medium.com/intrinsic/javascript-prototype-poisoning-vulnerabilities-in-the-wild-7bc15347c96) hakkında genel bir bilgi edinmek için bir an ayırmamız faydalı olacaktır 
ve bu konunun özel [teknik detaylarını](https://github.com/hapijs/hapi/issues/3916) okumalıyız.
:::

Bu kritik bir sorun olabilir, bu yüzden önce kendi kodumuzu doğrulamamız gerekebilir. 
Belirli bir framework'e odaklansa da, `JSON.parse()` kullanarak dış verileri işleyen her çözüm potansiyel olarak risk altındadır.

### PAT


Lob mühendislik ekibi (uzun süreli cömert destekçilerim!) veri doğrulama modülümüzde tanımladıkları kritik bir güvenlik açığını bildirdi — [joi](https://github.com/hapijs/joi). 
Bazı teknik detaylar ve önerilen bir çözüm sağladılar.

Bir veri doğrulama kütüphanesinin temel amacı, çıktının tanımlanan kurallara tam olarak uymasını sağlamaktır. 
Uymuyorsa, doğrulama başarısız olur. Geçerse, çalıştığınız verilerin güvenli olduğunu sorgusuz sualsiz güvenebiliriz. 

> Gerçekten de, çoğu geliştirici doğrulanmış girişi sistem bütünlüğü açısından tamamen güvenli olarak değerlendirir ki bu kritik bir durumdur!

Bizim case'imizde, Lob ekibi bazı verilerin doğrulama mantığını aşabildiği ve tespit edilmeden geçebildiği bir örnek sağladı. 
Bu, bir doğrulama kütüphanesinin sahip olabileceği en kötü hatadır.

### Prototip kısaca


Bunu anlamak için, JavaScript'in nasıl çalıştığını bir parça anlamamız gerekiyor. 
JavaScript'te her nesnenin bir prototipi olabilir. Bu, başka bir nesneden "devraldığı" metodlar ve özellikler kümesidir. 
"Devralmak" terimini tırnak içinde kullandım çünkü JavaScript gerçekten nesne yönelimli bir dil değildir. 
Prototype tabanlı bir nesne yönelimli dildir.

Uzun zaman önce, birçok alakasız sebepten, birinin nesnenin prototipine erişmek (ve ayarlamak) için özel özellik adı `__proto__` kullanmanın iyi bir fikir olacağına karar verdi. 
Bu o zamandan beri geçersiz kılındı ama yine de tamamen destekleniyor.

Göstermek için:

```
> const a = { b: 5 };
> a.b;
5
> a.__proto__ = { c: 6 };
> a.c;
6
> a;
{ b: 5 }
```

Nesneyle `c` özelliği yok, ama prototipinde var. 
Nesneyi doğrularken, doğrulama kütüphanesi prototipi görmezden gelir ve sadece nesnenin kendi özelliklerini doğrular. 
Bu, `c`'nin prototip aracılığıyla içeri sızmasına izin verir.

Bir diğer önemli kısım `JSON.parse()`'ın — JSON biçiminde formatlanmış metni nesnelere dönüştürmek için dil tarafından sağlanan bir yardımcı — bu sihirli `__proto__` özellik adını nasıl ele aldığıdır.

```
> const text = '{"b": 5, "__proto__": { "c": 6 }}';
> const a = JSON.parse(text);
> a;
{b: 5, __proto__: { c: 6 }}
```

`a`nın bir `__proto__` özelliğine sahip olduğunu fark edin. Bu bir prototip referansı değildir. 
Bu, yalnızca `b` gibi basit bir nesne özellik anahtarına benzemektedir. 
İlk örnekte gördüğümüz gibi, bu anahtarı atama ile oluşturamayız çünkü bu, prototip sihrini tetikler ve gerçek bir prototip atar. 
Ancak, `JSON.parse()` bu zehirli isimle basit bir özellik ayarlamaktadır.

Kendiliğinden, `JSON.parse()` tarafından oluşturulan nesne tamamen güvenlidir. 
Kendine ait bir prototipi yoktur. Sadece JavaScript'in yerleşik sihirli adı ile örtüşen görünüşte zararsız bir özelliği vardır.

Ancak, diğer yöntemler bu kadar şanslı değildir:

```
> const x = Object.assign({}, a);
> x;
{ b: 5}
> x.c;
6;
```

Eğer daha önce `JSON.parse()` ile oluşturulan `a` nesnesini alır ve onu yardımcı `Object.assign()` metoduna (boş `{}` nesnesine `a`nın tüm üst düzey özelliklerinin yüzeysel kopyasını oluşturmak için kullanılır) geçirirsek, sihirli `__proto__` özelliği "sızar" ve `x`in gerçek prototipi haline gelir.

Sürpriz!

Eğer dış bir metin girdisi alırsanız ve onu `JSON.parse()` ile ayrıştırırsanız 
sonra bu nesne üzerinde bazı basit manipülasyonlar yaparsanız (örneğin yüzeysel bir kopyalama ve bir `id` ekleme), 
ve bunu doğrulama kütüphanemize geçirirseniz, bu, `__proto__` aracılığı ile tespit edilmeden içeri sızar.

### Oh joi!


İlk soru, tabii ki, doğrulama modülü **joi** neden prototipi görmezden geliyor ve potansiyel olarak zararlı verilerin geçmesine izin veriyor? 
Biz de aynı soruyu kendimize sorduk ve düşündüğümüz şey "bir dikkatsizlikti". 
Bir hata - gerçekten büyük bir hata. Joi modülü bunun olmasına izin vermemeliydi. Ama…

Joi esas olarak web giriş verilerini doğrulamak için kullanılırken, aynı zamanda prototipleri olan iç nesneleri doğrulamak için onu kullanan önemli bir kullanıcı tabanı vardır. 
Joi'nin prototipi görmezden gelmesi, nesnenin kendi özelliklerini doğrularken karmaşık bir prototip yapısını (birçok metod ve literal özellik ile) görmezden gelerek yardımcı bir "özellik" haline gelir.

> Joi seviyesindeki herhangi bir çözüm, bazı çalışan kodları bozmak zorunda kalacaktır.

### Doğru şey


Bu noktada, korkunç bir güvenlik açığı ile karşı karşıyaydık. 
Efsanevi güvenlik hatalarının üst seviyelerinde. Bildiğimiz tek şey, 
son derece popüler veri doğrulama kütüphanemizin zararlı verileri engelleyemediği ve bu verilerin içeri sızması için basit olduğu. 
Gerekli olan tek şey, bir JSON girişi üzerine `__proto__` ve bazı kötü öğeler eklemek ve bunu araçlarımızı kullanarak inşa edilmiş bir uygulamaya göndermektir.

(Dramatik duraksama)

Bunun önlenmesi için joi'yi düzeltmemiz gerektiğini biliyorduk ama bu sorunun ölçeği göz önüne alındığında, 
dikkat çekmeden bir düzeltme yapmak zorundaydık - bunu ne kadar hızlı sömürülebileceğini kolaylaştırmadan - en azından en azından çoğu sistem güncellemeyi aldıktan sonra.

Bir düzeltmeyi gizli şekilde yapmak kolay değildir. Ancak bunu, 
kodun gereksiz yere bir yeniden yapılandırılmasıyla birleştirirseniz ve birkaç alakasız hata düzeltmesi ekler ve belki de havalı bir yeni özellik ekliyorsanız, gerçek sorunu düzeltme gereğini dikkate almadan yeni bir sürüm yayımlayabilirsiniz.

Sorun şuydu ki, doğru düzeltmeyi yapmak geçerli kullanım senaryolarını bozacaktı. 
Joi, prototipi ayarlayıp ayarlamak istemediğinizi bilmenin bir yoluna sahip değildir, 
ya da saldırgan tarafından ayarlanan prototipi engellemek. Sökülme açığını kapatacak bir çözüm kodu bozacaktır ve kodu bozmak genellikle büyük bir dikkat çekmektedir.

Öte yandan, eğer uygun ([anlamlı versiyonlamaya](https://semver.org/)) bir düzeltme yayımlarsak, bunu bir kırılan değişiklik olarak işaretler ve 
joi'ye prototip ile ne yapmak istediğinizi açıkça söylemesi için yeni bir API eklersek, 
bu açığı nasıl suistimal edileceğini dünyaya duyurmuş oluruz. Ayrıca sistemlerin güncellemeleri zaman alacak şekilde daha sıkı hale gelecektir (kırılan değişiklikler otomatik olarak uygulama araçları tarafından uygulanmaz).

### Bir sapma


Eldeki sorun, gelen istek yükleri hakkında olduğu sürece, 
sorgu dizesi, çerezler ve başlıklar aracılığıyla gelen verilerin de etkilenip etkilenmediğini kontrol etmek zorunda kaldık. 
Temel olarak, metinden nesnelere serileştirilmesine neden olan her şey.

Node'un varsayılan sorgu dizesi ayrıştırıcısının iyi olduğunu ve başlık ayrıştırıcısını hızlı bir şekilde doğruladık. 
Base64 kodlama ile okunmuş JSON çerezlerinde bir olası sorunu ve özel sorgu dizesi ayrıştırıcılarının kullanımını belirledim. 
Ayrıca, en popüler üçüncü taraf sorgu dizesi ayrıştırıcısının — [qs](https://www.npmjs.com/package/qs) —  etkilenmediğini teyit etmek için birkaç test yazdık (etkilenmiyor!).

### Bir gelişme


Bu üçlünün boyunca, zehirli prototipe sahip offending girdisinin joi'ye hapi aracılığıyla girdiğini varsaydık. 
Lob ekibinin yaptığı daha ayrıntılı inceleme, sorunun daha karmaşık olduğunu buldu.

Hapi, gelen verileri işlemek için `JSON.parse()` kullanıyordu. 
Öncelikle sonuç nesnesini gelen isteğin `payload` özelliği olarak ayarladı ve ardından aynı nesneyi doğrulama için joi'ye geçti, daha sonra uygulama iş mantığına geçirildi. 
`JSON.parse()` aslında `__proto__` özelliğini sızdırmadığından, joi'ye geçerken geçersiz bir anahtar ile gelmesi ve doğrulamayı geçememesi gerekti.

Ancak, hapi doğrulama öncesinde yük verisini incelemek (ve işlemek) için iki genişletme noktası sağlar. 
Her şey düzgün bir şekilde belgelenmiştir ve çoğu geliştirici tarafından iyi anlaşılmaktadır. 
Bu genişletme noktaları, doğrulama öncesinde ham girdilerle etkileşimde bulunmanızı sağlamak için var.

Eğer bu iki genişletme noktasından birinde bir geliştirici `Object.assign()` veya benzeri bir metodu payload üzerinde kullanmışsa, 
`__proto__` özelliği sızar ve gerçek bir prototip haline gelir.

### Rahatlama


Artık çok daha farklı ve korkunç bir sefaletle başa çıkıyorduk. 
Doğrulama öncesinde yük nesnesinin değiştirilmesi yaygın değildir, bu da bu durumun artık kıyamet senaryosu olmadığı anlamına geliyordu. 
Yine de, potansiyel olarak yıkıcıydı ama belirli uygulamalara inme durumu düştü.

Artık gizli bir joi sürümünü incelemiyorduk. 
Joi'deki sorun hâlâ orada, ama şimdi bunu doğru bir API ve önümüzdeki birkaç hafta içinde bir kırılma sürümü ile ele alabileceğiz.

Ayrıca, bu açığı çerçeve seviyesinde kolay bir şekilde hafifletebileceğimizi bildik çünkü hangi verilerin dışarıdan geldiğini ve hangisinin içten üretildiğini biliyor. 
Çerçeve, geliştiricilerin böyle beklenmedik hatalar yapmalarını engellemek için gerçekten tek parça.

### İyi haber, kötü haber, kötü haber?


İyi haber, bu durumun bizim hatamız olmamasıydı. 
Bu hapi veya joi'de bir hata değildi. 
Bu yalnızca karmaşık bir eylem kombinasyonu yoluyla mümkün olduğu için, bu hapi veya joi'ye özgü değildir. 
Bu her diğer JavaScript çerçevesinde gerçekleşebilir. 
Eğer hapi kırılmışsa, o zaman dünya da kırılmıştır.

> Harika - suçlama oyununu çözdük.

Kötü haber, suçlayacak hiçbir şeyin olmadığında (JavaScript dışında) düzeltmenin daha zor olduğudur.

Bir güvenlik sorunu bulunduğunda, insanlar ilk olarak hangi güvenlik sorunlarının CVE olarak yayımlanıp yayımlanmayacağını sorarlar. 
CVE - Ortak Güvenlik Açıkları ve Maruz Kalma - bilinen güvenlik sorunlarının [veritabanıdır](https://cve.mitre.org/). 
Bu web güvenliğinin kritik bir bileşenidir. 
CVE yayımlamanın avantajı, hemen alarmları tetiklemesi ve genellikle sistemleri bu sorun çözülene kadar bozuk olmasıdır.

Ama bunu hangi şeye dayandıracağız?

Muhtemelen hiçbir şeye. 
Bazı hapi sürümlerine bir uyarı ekleyip eklemeyeceğimiz hala tartışılıyor. 
"Biz" node güvenlik işlemi. 
Şu anda, varsayılan olarak sorunu hafifleten yeni bir hapi sürümüne sahip olduğumuz için bu bir düzeltme olarak kabul edilebilir. 
Ama çünkü düzeltme hapi'nin kendisindeki bir sorun değil, daha eski sürümlerin zararlı olduğunu beyan etmek doğru değil.

Gözden geçirilmiş önceki hapi sürümlerine, yalnızca insanları farkındalık ve güncelleme konusunda uyarmak amacıyla bir danışmanlık yayımlamak, danışmanlık sürecinin istismarıdır. 
Bu amaçla bu durumu geliştirmek için bunu istismar etmekten şahsen memnunum ama bu benim kararım değil. 
Bu yazının yazıldığı tarihte, hâlâ tartışılıyor.

### Çözüm işine


Sorunu hafifletmek kolay değildi. 
Ölçeklenebilir ve güvenli hale getirmek biraz daha karmaşık olduğunu gördük. 
Zararlı verilerin sistemin neresinden girebileceğini biliyorduk ve sorunlu `JSON.parse()`'ı kullandığımız yerleri biliyorduk, bu yüzden bunu güvenli bir uygulama ile değiştirebilirdik.

Bir problem. Verileri doğrulamak maliyetli olabilir ve şimdi her gelen JSON metnini doğrulamayı planlıyoruz. 
Yerleşik `JSON.parse()` uygulaması hızlıdır. Gerçekten çok hızlıdır. 
Daha güvenli ve aynı hızda olan bir bileşeni inşa edebileceğimiz olası değildir. Özellikle de bir gecede ve yeni hatalar tanıtmadan.

Mevcut `JSON.parse()` metodunu ek bir mantıkla sarmalayacağımız açıktı. 
Sadece fazla yük eklemediğinden emin olmamız gerekiyordu. 
Bu sadece bir performans durumu değil, aynı zamanda bir güvenlik durumudur. 
Belirli verileri göndererek bir sistemi yavaşlatmayı kolaylaştırırsak, düşük maliyetle [DoS saldırısı](https://en.wikipedia.org/wiki/Denial-of-service_attack) gerçekleştirmeyi kolaylaştırırız.

Aptalca basit bir çözüm geliştirdim: önce metni mevcut araçları kullanarak ayrıştırın. 
Eğer bu başarısız olmazsa, orijinal ham metni saldırgan dizesi olan "__proto__" için tarayın. 
Zaten buluyorsak, nesneyi gerçekten tarıyoruz. 
Her `__proto__` referansını engelleyemeyiz - bazen bu, burada ve bu metni Medium'a yayına göndermek gibi tamamen geçerli bir değerdir.

Bu, "mutlu yolun" pratiğe neredeyse önceden olduğu gibi olmasını sağladı. 
Sadece bir fonksiyon çağrısı, hızlı bir metin taraması (yine, çok hızlı yerleşik uygulama) ve koşullu bir dönüş ekledi. 
Çözüm, beklenen verilerin büyük çoğunluğu üzerinde ihmal edilebilir bir etki yarattı.

Bir sonraki sorun. Prototip özelliği, gelen nesnenin üst düzeyinde olmayabilir. 
Derinlemesine iç içe geçmiş olabileceğini gösteriyor. 
Bu, yalnızca üst düzeyde varlığını kontrol edemeyeceğimiz anlamına gelir. 
Nesne üzerinde yinelemeli olarak geçmemiz gerekiyor.

Yinelemeli işlevler en sevilen araçlardan biri olmasına rağmen, 
güvenli yazılım kodu yazarken felaket olabilir. 
Gördüğünüz gibi, yinelemeli işlevler yürütülen çağrı yığınının boyutunu artırır. 
Ne kadar çok döngüye girerseniz, çağrı yığınınız o kadar uzar. 
Bir noktada — KABOOM — maksimum uzunluğa ulaşırsınız ve işlem ölür.

Gelen verilerin şeklini garanti edemiyorsanız, yinelemeli geçiş açık bir tehdit haline gelir. 
Bir saldırgan, sunucularınızı çökertmek için yeterince derin bir nesne oluşturarak bunu kullanabilir.

Daha bellek verimli (daha az fonksiyon çağrısı, daha az geçici argüman geçişi) 
ve daha güvenli bir düz bir döngü implementasyonu kullandım. 
Bunu yalnızca övünmek için belirtmiyorum, 
ama temel mühendislik uygulamalarının güvenlik tuzaklarını nasıl oluşturabileceğini (ya da bunlardan kaçınabileceğini) göstermek için.

### Test etmeye koyulma


Kodu iki kişiye gönderdim. Önce [Nathan LaFreniere](https://github.com/nlf)'e çözümün güvenlik özelliklerini kontrol ettirmek için, ve ardından [Matteo Collina](https://github.com/mcollina)'ya performansı gözden geçirmek için. 
Onlar yaptıkları işin en iyilerinden ve sıklıkla benim başvurduğum kişilerdir.

Performans ölçümleri "mutlu yolun" pratiğe pek etkilenmediğini doğruladı. 
İlginç olan, zararlı değerlerin kaldırılmasının, bir istisna atmaktan daha hızlı olduğuydu. 
Bu, yeni modülün varsayılan davranışının ne olacağı sorusunu gündeme getirdi - hata mı yoksa temizleme mi?

Endişe, tekrar DoS saldırısı tehditi olmaktaydı. 
Eğer `__proto__` ile bir istekte bulunulursa, durum %500 daha yavaş hale gelirse, bu, kötü yönde sömürülebilecek bir nokta olabilir. 
Ama biraz daha test yaptıktan sonra, **herhangi** geçersiz JSON metninin çok benzer bir maliyet yarattığını doğruladık.

Diğer bir deyişle, eğer JSON'u ayrıştırıyorsanız, geçersiz değerlerin maliyeti her zaman daha fazla olacaktır, 
geçersiz kılan şey ne olursa olsun. Ayrıca, performans ölçme % maliyetin önemli olduğunu hatırlamak önemlidir, 
ancak CPU zamanında hala milisaniyelerin kesirindedir. 
Önemli not ve ölçüm ama aslında zararlı değil.

### Mutlu sonrası


Minnettar olmamız gereken birçok şey var.

Lob ekibinin ilk bildirimi mükemmeldi. 
Özel olarak, doğru insanlara, doğru bilgilerle rapor edildi. 
Ek bulgular ile ilişkili olarak takip ettiler, doğru bir şekilde çözebilmemiz için bize zaman ve alan verdiler. 
Lob, yıllar içinde hapi üzerindeki çalışma alanımın da büyük bir sponsoru oldu ve bu mali destek her şeyin olmasını sağladı. 
Buna daha sonra değineceğim.

Değerlendirme stresi vardı ancak doğru insanlarla birlikteydi. 
[Nicolas Morel](https://github.com/Marsup), Nathan ve Matteo gibi insanlara erişim ve yardım arzusu kritik. 
Baskı olmadan bununla başa çıkmak kolay değil, ama baskıyla birlikte, hatalar muhtemel değilse doğru takım işbirliği yapılmadığı sürece.

Gerçek bir güvenlik açığıyla şansımız oldu. 
Başlangıçta felaket gibi görünen bir problemin, hassas ama basit bir sorunu ele almak üzere olduğu ortaya çıktı.

Çözümün kaynağında etkili olarak azaltabilmek için şanslıydık - 
tanımadığımız bir çerçeve bakımcısına e-posta gönderip hızlı cevap almak zorunda kalmadık. 
Hapi'nin tüm bağımlılıkları üzerindeki kontrolü yine bir kez daha faydasını ve güvenliğini kanıtladı. 
[Hapi](https://hapi.dev) kullanmıyor musunuz? [Belki de kullanmalısınız](https://hueniverse.com/why-you-should-consider-hapi-6163689bd7c2).

### Mutlu sonrasında


Bu durumu sürdürülebilir ve güvenli açık kaynak ihtiyacını yinelemek için bir fırsat olarak kullanmam gerektiği yer burasıdır.

Bu tek bir mesele üzerinde harcadığım süre 20 saatin üzerindeydi. 
Bu, yarım bir çalışma haftasıdır. 
Bu, Aralık'ta 30 saatten fazla bir sürede yeni büyük bir hapi sürümünü yayına alma sürecini tamamladığım bir ayın sonunda gerçekleşti. 
Bu, bu ay kişisel olarak 5000 dolardan fazla zarar görmem anlamına geliyor (bu süre zarfında buna zaman ayırmak için ücretli müşteri işlerini azaltmak zorunda kaldım).

Eğer benim bakımımda olan bir koddan yararlanıyorsanız, 
işte tam da isteyeceğiniz destek, kalite ve taahhüt düzeyi budur (ve dürüst olalım - bekliyorsunuz). 
Birçoğunuz bunu göz ardı ediyor - yalnızca benim işim değil, 
diğer yüzlerce özverili açık kaynak geliştiricisinin de. 

Bu işin önemli olduğunu düşündüğüm için sadece mali olarak sürdürülebilir hale getirmeyi değil, 
bunu büyütmeyi ve genişletmeyi de hedefledim. 
Geliştirilmesi gereken çok şey var. 
Bu, beni Mart ayında gelecek yeni [ticari lisans planını](https://web.archive.org/web/20190201220503/https://hueniverse.com/on-hapi-licensing-a-preview-f982662ee898) uygulamaya motive eden şeydir. 
Bununla ilgili daha fazla bilgiyi [buradan](https://web.archive.org/web/20190201220503/https://hueniverse.com/on-hapi-licensing-a-preview-f982662ee898) okuyabilirsiniz.