# Ön Söz

Her zaman böyle net değildi, ancak Rust programlama dili temelde *güçlendirme* ile ilgilidir: şu anda yazdığınız kod türü ne olursa olsun, Rust sizi daha ileriye götürür, daha önce yaptığınızdan daha geniş bir yelpazede güvenle programlama yapmanıza yardımcı olur.

Örneğin, bellek yönetimi, veri temsili ve eşzamanlılık gibi düşük seviyeli ayrıntılarla ilgilenen "sistem düzeyindeki" işleri ele alalım. Geleneksel olarak, bu programlama alanı gizemli olarak görülmektedir ve yalnızca bu ünlü tuzaklardan kaçınmayı öğrenmek için gerekli yılları harcayan seçkin birkaç kişi için erişilebilir olmaktadır. Ve hatta bunu uygulayanlar bile, kodlarının istismarlar, çökme veya bozulmalara açık olmaması için dikkatle yaklaşmaktadır.

Rust, eski tuzakları ortadan kaldırarak ve size bu süreçte yardımcı olmak için dostane, cilalı bir araç seti sunarak bu engelleri yıkar. Daha düşük seviyeli kontrollere “girmeniz” gereken programcılar, çökme veya güvenlik açıkları klasik risklerini üstlenmeden Rust ile bunu yapabilirler ve dengesiz bir araç zincirinin ince noktalarını öğrenmeye ihtiyaç duymadan gerçekleştirebilirler. Dahası, dil, size hız ve bellek kullanımı açısından verimli olan güvenilir koda doğal bir şekilde yönelmenizi sağlamak üzere tasarlanmıştır.

:::tip
Rust ile çalışırken aşağıdaki stratejileri göz önünde bulundurun:
- Hataları proaktif bir şekilde yakalamak için derleyiciyi kullanın.
- Düşük seviyeli kontrol gereksinimlerini anlamak için belgeleri okuyun.
- Performansı artırmak için Rust'un özelliklerini kullanın.
:::

Zaten düşük seviyeli kodla çalışan programcılar, Rust ile hedeflerini yükseltebilirler. Örneğin, Rust'ta paralellik eklemek görece düşük riskli bir işlemdir: derleyici klasik hataları sizin için yakalayacaktır. Ve kodunuzda daha iddialı optimizasyonlar yaparken, yanlışlıkla çökme veya güvenlik açıkları tanıtmaktan korkmadan bu işlemleri gerçekleştirebilirsiniz.

> Rust, yazılım geliştirme alanında güvenliği ve performansı öncelikli hedef olarak belirleyen bir dildir.  
> — Nicholas Matsakis ve Aaron Turon

Ancak Rust, düşük seviyeli sistem programlaması ile sınırlı değildir. CLI uygulamaları, web sunucuları ve birçok farklı kod türünü yazmayı oldukça keyifli hale getirmek için yeterince ifade gücüne ve ergonomiye sahiptir — ilerleyen bölümlerde basit örneklerini bulacaksınız. Rust ile çalışmak, bir alandan diğerine aktarılan beceriler geliştirmenizi sağlar; bir web uygulaması yazarak Rust öğrenebilir, ardından bu becerileri Raspberry Pi’nizi hedef almak için uygulayabilirsiniz.

:::note
Rust ile gelişim sürecinde, topluluk kaynakları ve belgeleri büyük bir yardım sağlar.  
:::

Bu kitap, Rust'ın kullanıcılarını güçlendirme potansiyelini tamamen benimsemektedir. Rust bilgilerinizi artırmanın yanı sıra, genel olarak bir programcı olarak erişiminizi ve güveninizi artırmak için tasarlanmış dostane ve erişilebilir bir metindir. O halde derin bir nefes alın, öğrenmeye hazır olun — ve Rust topluluğuna hoş geldiniz!