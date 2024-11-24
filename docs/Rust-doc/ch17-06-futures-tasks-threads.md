## Gelecekler, Görevler ve İpler

Önceki bölümde gördüğümüz gibi, ipler eşzamanlılık için bir yaklaşım sağlar. Bu bölümde ise, geleceklere ve akışlara sahip asenkron kullanarak eşzamanlılığın başka bir yolunu gördük. Birini ya da diğerini seçmenin nedenini merak ediyor olabilirsiniz. Cevap: bu duruma bağlı! Ve birçok durumda, seçim ipler **veya** asenkron değil, aslında ipler **ve** asenkron.

Birçok işletim sistemi, on yıllardır ip tabanlı eşzamanlılık modelleri sağladı ve birçok programlama dili bu nedenle bunları desteklemekte. Ancak, bu yöntemlerin bazı dezavantajları da var. Birçok işletim sisteminde, her ip için oldukça fazla bellek kullanır ve başlatma ile kapatma süreçlerinde bazı ek yükleri vardır. **İpler, yalnızca işletim sisteminiz ve donanımınız destekliyorsa bir seçenek olarak mevcuttur!** 

:::warning
Ana akım masaüstü ve mobil bilgisayarların aksine, bazı gömülü sistemlerin hiç işletim sistemi yoktur, bu yüzden ipler de yoktur!
:::

Asenkron model, farklı ve nihayetinde tamamlayıcı bir dizi dezavantaj sağlar. Asenkron modelde, eşzamanlı işlemler kendi iplerine ihtiyaç duymazlar. Bunun yerine, görevler üzerinde çalışabilirler; tıpkı `trpl::spawn_task` kullanarak akışlar bölümünde senkron bir işlevden çalışma başlattığımız gibi. **Bir görev, bir ip ile benzer, ancak işletim sistemi tarafından değil, kütüphane düzeyindeki kod yani çalışma ortamı tarafından yönetilir.**

Önceki bölümde, bir asenkron kanal kullanarak ve senkron koddan çağırabileceğimiz bir asenkron görev başlatarak bir `Stream` oluşturabileceğimizi gördük. Tam olarak aynı şeyi bir ip ile de yapabilirdik! Listelemede, `trpl::spawn_task` ve `trpl::sleep` kullandık. Diğer bir listelemede ise bunları standart kütüphanenin `get_intervals` işlevi içindeki `thread::spawn` ve `thread::sleep` API’leri ile değiştiriyoruz.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-41/src/main.rs:threads}}
```



Bunu çalıştırdığınızda, çıktının aynı olduğunu göreceksiniz. Ve çağıran kod açısından buradaki değişimin ne kadar az olduğunu fark edin! 

:::info
Dahası, bir işlevimizin çalışma ortamında bir asenkron görev oluşturduğu ve diğerinin bir işletim sistemi ipi başlattığı durumlarda bile, elde edilen akışlar farklılıklardan etkilenmemiştir.
:::

Benzerliklere rağmen, bu iki yaklaşım oldukça farklı davranıyor, ancak bu oldukça basit örnekte bunu ölçmek zor olabilir. Herhangi bir modern kişisel bilgisayarda milyonlarca asenkron görev oluşturabiliriz. İplerle bunun yapılmaya çalışılması durumunda bellekten tamamen düşeceğimiz gibi bir durum olacaktır!

Bununla birlikte bu API’lerin bu kadar benzer olmasının bir nedeni var. **İpler, eşzamanlı işlemler için bir sınır görevi görür; eşzamanlılık, ipler *arasında* mümkündür.** Görevler ise, *asenkron* işlemler için bir sınır görevi görür; görevler arasında ve *içinde* eşzamanlılık mümkündür, çünkü bir görev içerisinde geleceklere geçiş yapabilir. 

:::note
Son olarak, geleceklere, Rust’ın en granüler eşzamanlılık birimi olup, her bir gelecek başka geleceklere bir ağaç olarak temsil edebilir. Çalışma ortamı—özellikle, yürütücüsü—görevleri yönetir ve görevler geleceklere yönetir.
:::

Bu bağlamda, görevler, işletim sisteminden değil, bir çalışma ortamı tarafından yönetilmeleri sayesinde ek yeteneklere sahip hafif, çalışma ortamı yönetimindeki iplerle benzerlik gösterir.

Bu, asenkron görevlerin her zaman iplerden daha iyi olduğu anlamına gelmez; ipler de her zaman görevlerden daha iyi değildir. **İplerle eşzamanlılık, bazı yönlerden asenkron ile eşzamanlılıktan daha basit bir programlama modelidir.** Bu, bir avantaj ya da zayıflık olabilir. 

:::tip
İpler, kısmen "bir ateş ve unut" yaklaşımına sahiptir; geleceklere karşılık gelen yerel bir eşdeğeri yoktur, bu yüzden sadece sonuçlanana kadar çalışır.
:::

Yani, işletim sistemi kendisi dışında kesintiye uğramazlar. Yani, geleceklere gelen *görev içi eşzamanlılık* konusunda yerleşik destekleri yoktur. Rust’ta iplerin iptası için de mekanizması yoktur—bu, bu bölümde derinlemesine ele almadığımız bir konudur, ancak bir geleceği sonlandırdığımızda, durumunun doğru bir şekilde temizlendiği gerçeğinde gizlidir.

Bu sınırlamalar, iplerin geleceklere kıyasla bir araya getirilmesini de zorlaştırır. Örneğin, geleceklere daha doğal bir şekilde birleştirilebilen zengin veri yapıları olması nedeniyle, ipleri kullanarak `timeout` gibi yardımcılar oluşturmak çok daha zordur. 

:::note
“**Kendi Asenkron Abstraksiyonlarımızı Oluşturma**” veya “**Akışları Birleştirme**” ile akışlarla kullandığımız `throttle` yöntemini ele alalım.
:::

Görevler, geleceklere *ek* kontrol sağlar; geleceklere nerede ve nasıl gruplayacağınızı seçmenize izin verir. Ve görüldüğü gibi, ipler ve görevler çoğu zaman iyi bir şekilde birlikte çalışır; çünkü görevler (en azından bazı çalışma ortamlarında) ipler arasında taşınabilir. 

:::tip
Şimdiye kadar bahsetmediğimiz bir konu ama kullandığımız `Runtime`, `spawn_blocking` ve `spawn_task` işlevleri de varsayılan olarak çoklu iş parçacıklıdır!
:::

Birçok çalışma ortamı, iplerin mevcut kullanımına göre görevleri ipler arasında şeffaf bir şekilde taşımak için *görev hırsızlığı* olarak adlandırılan bir yaklaşım kullanır; bunun amacı sistemin genel performansını artırmaktır. Bunu oluşturmak aslında ipler *ve* görevler ve dolayısıyla geleceklere ihtiyaç duyar.

Ne zaman hangi yöntemin kullanılacağına dair varsayılan bir düşünce tarzı olarak:

- Eğer iş *çok paralelize edilebiliyorsa*, yani her bir parçası ayrı olarak işlenebiliyorsa, ipler daha iyi bir seçimdir.
- Eğer iş *çok eşzamanlı ise*, yani farklı kaynaklardan gelen mesajları işlemek gibi, bunlar farklı aralıklarda veya farklı hızlarda gelebilir, o zaman asenkron daha iyi bir seçimdir.

Ve eğer paralellik ve eşzamanlılıktan bir karışım gerekiyorsa, ipler ve asenkron arasında seçim yapmak zorunda değilsiniz. Her birinin en iyi olduğu kısımda hizmet etmesine izin vererek bunları birlikte özgürce kullanabilirsiniz. Örneğin, 17-42. listeleme, bu tür bir karışımın gerçek dünya Rust kodundaki oldukça yaygın bir örneğini göstermektedir.



```rust
{{#rustdoc_include ../listings/ch17-async-await/listing-17-42/src/main.rs:all}}
```



Önce bir asenkron kanal oluşturmakla başladık. Ardından, kanalın gönderici tarafının mülkiyetini alan bir ip başlatıyoruz. İpin içinde, 1'den 10'a kadar sayıları gönderiyor ve her biri arasında bir saniye uyuyoruz. Son olarak, bu bölüm boyunca yaptığımız gibi `trpl::run`'a geçirilen bir asenkron blok ile oluşturduğumuz bir geleceği çalıştırıyoruz. O gelecekte, gördüğümüz diğer mesaj geçişi örneklerinde olduğu gibi, o mesajları bekliyoruz.

Bölüme başlarken verdiğimiz örneklere geri dönersek: **bir dizi video kodlama görevini özel bir ip kullanarak çalıştırmayı hayal edebilirsiniz; çünkü video kodlama hesaplama bağlıdır, ancak o işlemlerin tamamlandığını UI’ya bildirmek için bir asenkron kanal kullanabilirsiniz.** Bu tür karışımın birçok örneği vardır!

## Özet

Bu kitapta eşzamanlılık konusunu son kez görmeyeceksiniz: 21. bölümdeki proje, burada tartışılan daha küçük örneklerden daha gerçekçi bir durumda bu bölümdeki kavramları kullanacak ve ipler ile görevler ve geleceklere dayanan bu tür sorunları çözmenin nasıl bir şey olduğunu daha doğrudan karşılaştıracaktır.

**İster iplerle, ister geleceklere ve görevlerle, ister hepsinin kombinasyonu ile Rust, güvenli, hızlı, eşzamanlı kod yazmak için gereken araçları sağlar—ister yüksek verimli bir web sunucusu, ister gömülü bir işletim sistemi için.**

Sonraki bölümde, Rust programlarınız büyüdükçe sorunları modelleyip çözümleri yapılandırmanın dilbilgisel yollarını tartışacağız. Ayrıca, Rust’ın dilbilgilerinin nesne yönelimli programlamayla ilişkilendirilebileceğiniz dillerle nasıl ilişkili olduğunu da ele alacağız.

[combining-futures]: ch17-03-more-futures.html#building-our-own-async-abstractions
[streams]: ch17-04-streams.html#composing-streams