## Async ve Await

Bilgisayara yaptırdığımız birçok işlem bitmek için zaman alabilir. Örneğin, eğer bir video editörü kullanarak bir aile kutlamasının videosunu oluşturduysanız, bunu dışa aktarmak birkaç dakikadan birkaç saate kadar sürebilir. Benzer şekilde, ailenizden biri tarafından paylaşılan bir videoyu indirmek de uzun zaman alabilir. Uzun süreli bu işlemlerin tamamlanmasını beklerken başka bir şey yapabilseydik ne güzel olurdu.

Video dışa aktarma, mümkün olan en fazla CPU ve GPU gücünü kullanacaktır. Eğer sadece bir CPU çekirdeğiniz varsa ve işletim sisteminiz bu dışa aktarmayı tamamlanana kadar durdurmuyor ise, çalışırken bilgisayarınızda başka bir şey yapamazsınız. Bu, oldukça sinir bozucu bir deneyim olurdu. Bunun yerine, bilgisayarınızın işletim sistemi, dışa aktarmayı yeterince sık bir şekilde görünmez bir şekilde kesebilir; böylece yol boyunca diğer işlerinizi yapabilirsiniz.

Dosya indirme ise farklıdır. Çok fazla CPU süresi harcamaz. Bunun yerine, CPU'nun ağdan veri gelmesini beklemesi gerekir. Verilerin bir kısmı mevcut olduğunda okumaya başlayabilirsiniz, ancak geri kalan verilerin gelmesi biraz zaman alabilir. Veriler tamamen mevcut olduğunda bile, bir video oldukça büyük olabilir, bu nedenle hepsini yüklemek zaman alabilir. Belki sadece bir veya iki saniye sürer—ama bu, her saniyede milyarlarca işlem yapabilen modern bir işlemci için oldukça uzun bir süredir. 

:::tip
Ağ isteği tamamlanana kadar CPU’yu başka işlerde kullanmak mümkün olsaydı, çok güzel olurdu—yine, işletim sisteminiz programınızı görünmez bir şekilde keserek diğer işlemlerin ağ operasyonu devam ederken gerçekleşmesini sağlar.
:::

> Not: Video dışa aktarma, genellikle “CPU-bound” veya “compute-bound” olarak tanımlanan bir işlem türüdür. Bu, bilgisayarın veriyi işleme yeteneği olan *CPU* veya *GPU* hızının ne kadarının kullanılabileceğiyle sınırlıdır. Video indirme ise genellikle “IO-bound” olarak tanımlanan bir işlem türüdür, çünkü bilgisayarın *girdi ve çıktısı* hızına bağlıdır. Verilerin ağ üzerinden gönderilme hızına kadar gidebilir.

Bu iki örnekte de, işletim sisteminin görünmez kesintileri bir tür eşzamanlılık sağlar. Ancak bu eşzamanlılık tamamen bir program düzeyinde gerçekleşir: işletim sistemi bir programı keserek diğer programların işlerini yapmasına izin verir. Çoğu durumda, programlarımızı işletim sisteminin anlayabileceğinden çok daha ayrıntılı bir seviyede bildiğimiz için, işletim sisteminin göremediği birçok eşzamanlılık fırsatını fark edebiliriz.

Örneğin, dosya indirmelerini yönetmek için bir araç geliştiriyorsak, programımızı bir indirmenin başlamasının kullanıcı arayüzünü kilitlememesi ve kullanıcıların aynı anda birden fazla indirme başlatabilmesini sağlayacak şekilde yazabilmeliyiz. 

:::warning
Ancak birçok işletim sistemi API'si, ağ ile etkileşimde *engelleyici*dir. Yani, bu API'ler, işleme aldıkları veri tamamen hazır olana kadar programın ilerlemesini engeller.
:::

> Not: Düşündüğünüzde, *çoğu* fonksiyon çağrısının böyle çalıştığını görebilirsiniz! Ancak, genellikle “engelleyici” terimini yalnızca dosyalar, ağ veya bilgisayardaki diğer kaynaklarla etkileşime giren fonksiyon çağrıları için ayırırız; çünkü bireysel bir programın işlemden *engellemeyen* şekilde faydalandığı yerler buralardır.

Ana iş parçacığımızı engellemekten kaçınmak için her bir dosya indirmek üzere özel bir iş parçacığı oluşturabiliriz. Ancak eninde sonunda bu iş parçacıklarının maliyetinin bir sorun olacağını buluruz. Ayrıca, çağrının başlangıçta engelleyici olmaması da tercih edilir. Son olarak, engelleyici kodda kullandığımız doğrudan tarza yazabilmek daha iyi olurdu. Bunun gibi bir şey:

```rust,ignore,does_not_compile
let data = fetch_data_from(url).await;
println!("{data}");
```

Rust'un asenkron soyutlamasının bize verdiği tam olarak budur. Ancak bunun pratikte nasıl çalıştığını görmeden önce, paralellik ve eşzamanlılık arasındaki farklara kısa bir sapma yapmalıyız.

### Paralellik ve Eşzamanlılık

Önceki bölümde, paralellik ve eşzamanlılığı çoğunlukla değiştirilebilir olarak ele aldık. Şimdi bunlar arasındaki ayrımı daha kesin bir şekilde yapmak zorundayız; çünkü farklılıklar çalışmaya başladıkça ortaya çıkacaktır.

Bir ekibin bir yazılım projesi üzerinde çalışmayı nasıl bölebileceğine dair farklı yolları düşünün. Tek bir bireye birden fazla görev verebiliriz veya her ekip üyesine bir görev atayabiliriz ya da her iki yaklaşımın bir karışımını yapabiliriz.

Bir birey tamamlanmadan önce birkaç farklı görev üzerinde çalışıyorsa, bu *eşzamanlılık*tır. Bilgisayarınızda iki farklı projeyi kontrol etmiş olabilirsiniz ve bir projede sıkıldığınızda veya takıldığınızda diğerine geçersiniz. Siz sadece bir kişisiniz, bu nedenle her iki görevde de tam olarak aynı anda ilerleme kaydedemezsiniz—ama çoklu görev yapabilir, görevler arasında geçiş yaparak birden fazla işte ilerleme kaydedebilirsiniz.



![](images/rust/img/trpl17-01.svg)

Şekil 17-1: Görev A ve Görev B arasında geçiş yaparak bir eşzamanlı iş akışı.



Görevleri ekipteki insanlar arasında böldüğünüzde, her kişi bir görevi alır ve yalnız başına çalışırsa, bu *paralellik*tir. Ekipteki her kişi tam olarak aynı anda ilerleme kaydedebilir.



![](images/rust/img/trpl17-02.svg)

Şekil 17-2: Görev A ve Görev B bağımsız olarak gerçekleşen bir paralel iş akışı.



Her iki durumda da, farklı görevler arasında koordinasyon yapmanız gerekebilir. Belki bir kişinin çalıştığı görevin herkesin işinden tamamen bağımsız olduğunu *düşünmüş* olabilirsiniz, ancak gerçekten başka bir kişinin tamamlaması gereken bir şey gerektiriyor. Bazı işler paralel olarak yapılabilir, ama bazıları aslında *seri*dir: yalnızca bir dizi içinde, bir şeyin ardından bir başka bir şey olarak gerçekleşebilir, Şekil 17-3’teki gibi.



![](images/rust/img/trpl17-03.svg)

Şekil 17-3: Görev A ve Görev B’nin bağımsız olarak gerçekleştiği, ancak görev A3’ün görev B3'ün sonuçlarına bağlı olduğu kısmen paralel bir iş akışı.



Aynı şekilde, kendi görevlerinizden birinin, başka bir görevinize bağlı olduğunu fark edebilirsiniz. Artık eşzamanlı işiniz de seri hale gelmiştir.

Paralellik ve eşzamanlılık birbirleriyle de kesişebilir. Bir meslektaşınızın, sizin görevlerinizden birini tamamlamanızı beklediğini öğrendiğinizde, muhtemelen tüm çabalarınızı o göreve odaklarsınız ve “engellemeyi kaldırmaya” çalışırsınız. Siz ve çalışma arkadaşınız artık paralel olarak çalışamazsınız ve aynı zamanda kendi görevlerinizde eşzamanlı olarak çalışamazsınız.

Bu temel dinamikler, yazılım ve donanım ile de oynar. Tek bir CPU çekirdeğine sahip bir makinede, CPU yalnızca bir işlemi bir seferde gerçekleştirebilir, ancak yine de eşzamanlı çalışabilir. İş parçacıkları, süreçler ve asenkron gibi araçlar kullanarak bilgisayar, bir aktiviteyi durdurup diğerlerine geçerek nihayetinde ilk aktiviteye geri dönebilir. Birden fazla CPU çekirdeğine sahip bir makinede, ayrıca paralel olarak çalışabilir. Bir çekirdek bir şey yaparken, diğer çekirdek tamamen alakasız bir şeyi yapabilir ve bu gerçekte aynı anda gerçekleşir.

Rust'ta asenkron çalışırken, her zaman eşzamanlılık ile ilgileniyoruz. Donanım, işletim sistemi ve kullandığımız asenkron çalışma zamanı—kısa süre içinde asenkron çalışma sürelerinden daha fazla!—bu eşzamanlılık temelde paralellik de kullanabilir.

Şimdi, Rust'ta asenkron programlamanın nasıl çalıştığına dalalım! Bu bölümün geri kalanında:

* Rust’un `async` ve `await` sözdizimini nasıl kullanacağımızı göreceğiz
* Asenkron modelin, Bölüm 16'da ele aldığımız bazı aynı zorlukları nasıl çözebileceğini keşfedeceğiz
* Çoklu iş parçacığı ve asenkronun, birçok durumda birlikte de kullanabileceğiniz tamamlayıcı çözümler sunduğunu göreceğiz