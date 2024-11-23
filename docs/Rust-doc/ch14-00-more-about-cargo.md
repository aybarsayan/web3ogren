# Cargo ve Crates.io Hakkında Daha Fazla

Şu ana kadar sadece Cargo'nun en temel özelliklerini kullanarak kodumuzu derledik, çalıştırdık ve test ettik, ancak daha fazlasını yapabilir. Bu bölümde, aşağıdakileri nasıl yapacağınızı göstermek için onun diğer, daha gelişmiş özelliklerinden bazılarını tartışacağız:

* **Çıkış profilleri aracılığıyla** derlemenizi özelleştirin
* [crates.io](https://crates.io/) üzerinde **kütüphaneleri yayınlayın**
* **Büyük projeleri** çalışma alanlarıyla organize edin
* [crates.io](https://crates.io/) üzerinden **binary dosyaları yükleyin**
* **Özel komutlar** kullanarak Cargo'yu genişletin

:::note
Cargo, bu bölümde kapsadığımız işlevsellikten çok daha fazlasını yapabilir. 
:::

Cargo'nun tüm özelliklerinin tam açıklaması için [belgelere](https://doc.rust-lang.org/cargo/) bakın.

---

:::tip
Derleme sürecini daha iyi anlamak için çıkış profillerini kullanmayı deneyin. Bu, farklı yapı ihtiyaçlarınıza göre ayarlama yapmanızı sağlar.
:::

:::warning
Özellikle büyük projelerde çalışma alanları kullanırken, bağımlılıkların doğru bir şekilde yönetilmesi önemlidir. Aksi takdirde, versiyon çatışmaları ile karşılaşabilirsiniz.
:::

“Cargo, güçlü yapılandırma yetenekleri sunar.”  
— Rust Belgeleri


Gelişmiş Özellikler Hakkında Daha Fazla Bilgi

Cargo, yalnızca projelerinizi derlemekle kalmaz; aynı zamanda bağımlılık yönetimi, hata ayıklama ve önceki sürümler arasında geçiş gibi birçok ileri düzey işlevsellik sunar.

