## Ek E - Sürümler

Bölüm 1'de, `cargo new` komutunun *Cargo.toml* dosyanıza bir sürüm hakkında biraz meta veri eklediğini gördünüz. Bu ek, bunun ne anlama geldiğini anlatıyor!

Rust dili ve derleyicisi altı haftada bir sürüm döngüsüne sahiptir; bu da kullanıcıların sürekli yeni özellikler aldığı anlamına gelir. Diğer programlama dilleri daha büyük değişiklikleri daha nadir yayınlar; Rust ise daha sık olarak daha küçük güncellemeler sunar. **Bir süre sonra, bu küçük değişikliklerin tümü birikmeye başlar.** Ancak sürümden sürüme bakmak, “Vay canına, Rust 1.10 ile Rust 1.31 arasında Rust çok değişmiş!” demeyi zorlaştırabilir.

:::info
Her iki veya üç yılda bir, Rust ekibi yeni bir Rust *sürümü* hazırlar. **Her sürüm, net bir paket içinde bir araya gelen özellikleri ve tamamen güncellenmiş belgeleri ve araçları getirir.**
:::

Sürümler, farklı insanlar için farklı amaçlara hizmet eder:

* Aktif Rust kullanıcıları için yeni bir sürüm, artan değişiklikleri anlaması kolay bir paket içinde toplar.
* Kullanıcı olmayanlar için yeni bir sürüm, bazı büyük ilerlemelerin gerçekleştiğini gösterir; bu da Rust'a bir kez daha göz atmayı gerektirebilir.
* Rust geliştirenler için yeni bir sürüm, projenin bütünü için bir toplanma noktası sağlar.

Bu yazının yazıldığı sırada, üç Rust sürümü mevcuttur: Rust 2015, Rust 2018 ve Rust 2021. Bu kitap, Rust 2021 sürümündeki deyimlerle yazılmıştır.

*Carg.toml* dosyasındaki `edition` anahtarı, derleyicinin kodunuz için hangi sürümü kullanması gerektiğini belirtir. **Anahtar mevcut değilse, Rust geriye dönük uyumluluk nedenleriyle `2015` sürüm değerini kullanır.**

:::tip
Her proje, varsayılan 2015 sürümü dışındaki bir sürümü tercih edebilir. 
:::

Sürümler, koddaki tanımlayıcılarla çelişen yeni bir anahtar kelime eklemek gibi uyumsuz değişiklikler içerebilir. Ancak, bu değişikliklere dahil olmadığınız sürece, kodunuz Rust derleyici sürümünüzü güncelledikçe derlenmeye devam edecektir.

Tüm Rust derleyici sürümleri, o derleyicinin sürümünden önce mevcut olan herhangi bir sürümü destekler ve desteklenen sürümlerin kutularını bir araya getirebilirler. Sürüm değişiklikleri, yalnızca derleyicinin kodu ilk kez çözmeye çalıştığı şekli etkiler. Bu nedenle, Rust 2015 kullanıyorsanız ve bağımlılıklarınızdan biri Rust 2018 kullanıyorsa, projeniz derlenir ve o bağımlılığı kullanabilir. Ters durum, yani projeniz Rust 2018 kullanırken bir bağımlılık Rust 2015 kullanıyorsa, bu da geçerlidir.

:::warning
Açık olmak gerekirse: çoğu özellik tüm sürümlerde mevcut olacaktır. **Herhangi bir Rust sürümünü kullanan geliştiriciler, yeni kararlı sürümler yayınlandıkça iyileştirmeler görmeye devam edeceklerdir.**
:::

Ancak, bazı durumlarda, özellikle yeni anahtar kelimeler eklendiğinde, bazı yeni özellikler yalnızca daha sonraki sürümlerde mevcut olabilir. Bu tür özelliklerden yararlanmak istiyorsanız sürüm değiştirmeniz gerekecektir.

:::note
Daha fazla ayrıntı için, [*Sürüm Kılavuzu*](https://doc.rust-lang.org/stable/edition-guide/) sürümler arasındaki farklılıkları sıralayan ve kodunuzu yeni bir sürüme otomatik olarak güncellemenin yollarını açıklayan kapsamlı bir kitaptır.
:::