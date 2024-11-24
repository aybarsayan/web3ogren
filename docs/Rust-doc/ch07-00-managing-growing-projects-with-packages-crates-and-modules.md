# Paketler, Kütüphaneler ve Modüller ile Büyüyen Projeleri Yönetme

Büyük programlar yazdıkça, kodunuzu düzenlemek giderek daha önemli hale gelecektir. İlgili işlevselliği gruplandırarak ve belirgin özelliklere sahip kodu ayırarak, belirli bir özelliği uygulayan kodu nerede bulacağınızı ve bir özelliğin nasıl çalıştığını değiştirmek için nereye gideceğinizi netleştireceksiniz.

:::tip
Kodunuzu düzenli tutmak için mantıksal bir yapı oluşturmayı düşünün. Bu, proje büyüdükçe işlerinizi kolaylaştırır.
:::

Şimdiye kadar yazdığımız programlar tek bir dosyada tek bir modülde olmuştur. Bir proje büyüdüğünde, kodu birden fazla modüle ve ardından birden fazla dosyaya ayırarak düzenlemelisiniz. Bir paket, birden çok ikili kütüphane içerebilir ve isteğe bağlı olarak bir kütüphane kütüphanesi de içerebilir. Bir paket büyüdükçe, bazı kısımları ayrı kütüphanelere çıkarabilir ve bu da dış bağımlılıklar haline gelebilir. Bu bölüm, tüm bu teknikleri kapsar. Birlikte gelişen ilişkili paketlerden oluşan çok büyük projeler için Cargo, bölüm 14'te ele alacağımız *çalışma alanları* sağlar.

:::info
Çalışma alanları, projelerinizi daha verimli yönetmenin harika bir yoludur.
:::

Ayrıca, uygulama detaylarını kapsüllemeyi de tartışacağız; bu, kodu daha yüksek bir düzeyde yeniden kullanmanıza olanak tanır: bir işlemi uyguladıktan sonra, diğer kodlar, uygulamanın nasıl çalıştığını bilmeden, kodunuza kamu arayüzü aracılığıyla erişebilir. Kod yazma şekliniz, diğer kodun kullanabilmesi için hangi parçaların kamuya açık olduğunu ve hangi parçaların özel uygulama detayları olduğunu belirler; sizin değişiklik yapma hakkınızı saklı tutarsınız. Bu, aklınızda tutmanız gereken detay miktarını sınırlamanın bir başka yoludur.

İlgili bir kavram alan: kodun yazıldığı iç içe geçmiş bağlam, “kapsamda” olarak tanımlanan bir dizi adı içerir. Kod okuma, yazma ve derleme sırasında, programcılar ve derleyiciler, belirli bir yerlerde belirli bir adın bir değişkene, işlevselliğe, yapı, enum, modül, sabit veya diğer bir öğeye atıfta bulunup bulunmadığını ve o öğenin ne anlama geldiğini bilmelidir. Alanlar oluşturabilir ve hangi adların kapsamda olduğunu değiştirebilirsiniz. Aynı kapsamda aynı adı taşıyan iki öğe olamaz; ad çakışmalarını çözmek için araçlar mevcuttur.

> Rust, kodunuzun organizasyonunu yönetmenize, hangi detayların açığa çıktığına, hangi detayların özel olduğuna ve programlarınızdaki her kapsamda hangi adların bulunduğuna izin veren bir dizi özelliğe sahiptir.
> — Rust Dökümantasyonu

Bu özellikler bazen topluca *modül sistemi* olarak adlandırılır ve şunları içerir:

* **Paketler:** Kütüphanelerinizi oluşturmanıza, test etmenize ve paylaşmanıza olanak tanıyan bir Cargo özelliği
* **Kütüphaneler:** Bir kütüphane veya çalıştırılabilir bir dosya üreten modüllerin bir ağaç yapısı
* **Modüller** ve **use:** Yolların organizasyonunu, kapsamını ve gizliliğini kontrol etmenize olanak tanır
* **Yollar:** Bir öğeyi adlandırmanın bir yolu, örneğin bir yapı, işlev veya modül

:::note
Bu içerik, modül sistemi ile ilgili temel bilgilerle başlayıp daha karmaşık konulara detalara inecek bir yapıdadır.
:::

Bu bölümde, tüm bu özellikleri kapsayacağız, nasıl etkileşime girdiklerini tartışacağız ve alanı yönetmek için nasıl kullanılacaklarını açıklayacağız. Sonunda, modül sistemini sağlam bir şekilde anlamış olmalı ve alanlarla profesyonel bir şekilde çalışabilmelisiniz!

---

[workspaces]: ch14-03-cargo-workspaces.html