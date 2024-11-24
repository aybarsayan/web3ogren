# Korkusuz Eşzamanlılık

Eşzamanlı programlamayı güvenli ve etkili bir şekilde yönetmek, Rust'ın en önemli hedeflerinden biridir. *Eşzamanlı programlama*, bir programın farklı parçalarının bağımsız olarak çalıştığı, ve *paralel programlama*, bir programın farklı parçalarının aynı anda çalıştığı durumlar giderek daha önemli hale gelmektedir, çünkü daha fazla bilgisayar çoklu işlemcilerinden yararlanmaktadır. Tarihsel olarak, bu bağlamlarda programlama zorlu ve hata yapmaya yatkın olmuştur: Rust bunun değişmesini ummaktadır.

:::info
Başlangıçta, Rust ekibi bellek güvenliğini sağlamak ve eşzamanlılık problemlerini önlemek için iki ayrı zorluk olduğunu düşünüyordu. 
:::

Zamanla, ekip sahiplik ve tip sistemlerinin bellek güvenliği *ve* eşzamanlılık problemlerini yönetmek için güçlü bir araç seti olduğunu keşfetti! Sahiplik ve tip kontrolünden faydalanarak, birçok eşzamanlılık hatası Rust'ta derleme zamanı hatalarıdır, çalışma zamanı hataları değil. Bu nedenle, çalışma zamanı eşzamanlılık hatasının meydana geldiği kesin koşulları yeniden oluşturmaya harcayacağınız zamandan çok, yanlış kod derlenmeyi reddedecek ve problemi açıklayan bir hata mesajı sunacaktır. Sonuç olarak, kodunuzu üzerinde çalışırken düzeltebilirsiniz, üretime gönderildikten sonra potansiyel olarak değil. Rust'ın bu yönüne *korkusuz* *eşzamanlılık* adını verdik. Korkusuz eşzamanlılık, ince hatalardan arındırılmış ve yeni hatalar tanıtmadan yeniden yapılandırması kolay kod yazmanıza izin verir.

> Not: Basitlik açısından, birçok problemi *eşzamanlı* olarak adlandıracağız; *eşzamanlı ve/veya paralel* demek yerine. Bu kitap eşzamanlılık ve/veya paralellik hakkında olsaydı, daha spesifik olurduk. Bu bölüm için, *eşzamanlı* kelimesini kullandığımızda lütfen zihninizde *eşzamanlı ve/veya paralel* ile değiştirdiğinizi düşünün.  
> — Rust Ekibi

Birçok dil, eşzamanlı problemleri ele almak için sundukları çözümler konusunda dogmatik davranmaktadır. Örneğin, Erlang'ın mesaj-paslaşma eşzamanlılığı için şık bir işlevselliği vardır, fakat threadler arasında durum paylaşmanın yalnızca belirsiz yollarını sunmaktadır. Yalnızca olası çözümlerin bir alt kümesini desteklemek, daha yüksek seviyeli diller için makul bir stratejidir, çünkü daha yüksek seviyeli bir dil, soyutlamalar elde etmek için bazı kontrollerden vazgeçmekten yarar sağlamayı vaat eder. Ancak, daha düşük seviyeli dillerin herhangi bir durumda en iyi performansı sağlayacak çözümü sunması beklenir ve donanım üzerinde daha az soyutlama sunar. Bu nedenle, Rust, durumunuza ve gereksinimlerinize uygun olarak problemleri modellemek için çeşitli araçlar sunar.

---

Bu bölümde ele alacağımız konular:

* Aynı anda birden fazla kod parçası çalıştırmak için nasıl thread oluşturulacağı
* Threadler arasında mesaj gönderen *mesaj-paslaşma* eşzamanlılığı
* Birden fazla thread'in bazı verilere erişimi olduğu *paylaşılan durum* eşzamanlılığı
* Rust'ın eşzamanlılık garantilerini kullanıcı tanımlı türler ve standart kütüphane tarafından sağlanan türler ile genişleten `Sync` ve `Send` yetenekleri