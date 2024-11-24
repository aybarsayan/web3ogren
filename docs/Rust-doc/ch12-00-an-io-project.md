# Bir I/O Projesi: Bir Komut Satırı Programı Oluşturma

Bu bölüm, şimdiye kadar öğrenmiş olduğunuz birçok becerinin bir özeti ve birkaç standart kütüphane özelliğinin keşfi. Dosya ve komut satırı girdi/çıktısıyla etkileşime giren bir komut satırı aracı oluşturacağız ve artık sahip olduğunuz bazı Rust kavramlarını pratik etme imkanı bulacağız.

Rust’ın hızı, güvenliği, tek ikili çıktı ve çoklu platform desteği, komut satırı araçları oluşturmak için ideal bir dil yapar; bu yüzden projemiz için klasik komut satırı arama aracı `grep`'in kendi versiyonunu yapacağız (**g**lobal **r**egüler **e**kspresyonu arar ve **p**rint eder). En basit kullanım durumunda, `grep` belirli bir dosyada belirli bir dizeyi arar. Bunu yapmak için, `grep` bir dosya yolu ve bir dizeyi argüman olarak alır. Daha sonra dosyayı okuyarak, dize argümanını içeren dosyadaki satırları bulur ve o satırları yazdırır.

:::tip
**Öneri:** Komut satırı aracını oluştururken, kullanıcı deneyimini artırmak için komut satırı argümanlarını dikkatlice düşünün. 
:::

Bu süreçte, komut satırı aracımızın birçok diğer komut satırı aracının kullandığı terminal özelliklerini nasıl kullanacağını göstereceğiz. Kullanıcının aracımızın davranışını yapılandırmasına olanak tanımak için bir ortam değişkeninin değerini okuyacağız. Ayrıca, başarılı çıktıyı bir dosyaya yönlendirebilecek bir kullanıcı görsel hata mesajlarını ekranında görebilsin diye hata mesajlarını standart çıktı (`stdout`) yerine standart hata konsol akışına (`stderr`) yazdıracağız.

> “Rust topluluğundan bir üye olan Andrew Gallant, çok hızlı ve tam özellikli bir `grep` versiyonu olan `ripgrep`'i zaten oluşturdu.”  
> — Andrew Gallant

`grep` projemiz, şu ana kadar öğrendiğiniz bir dizi kavramı birleştirecek:

* Kod organizasyonu ([Bölüm 7][ch7])
* Vektörler ve dizeler kullanımı ([Bölüm 8][ch8])
* Hata yönetimi ([Bölüm 9][ch9])
* Uygun durumlarda traitler ve yaşam süreleri kullanımı ([Bölüm 10][ch10])
* Test yazımı ([Bölüm 11][ch11])

:::info
**Ek Bilgi:** Ayrıca kapamalar, yineleyiciler ve trait nesneleri hakkında kısa bir tanıtım yapacağız; bu konular [Bölüm 13][ch13] ve [Bölüm 18][ch18] kapsamında detaylı olarak ele alınacaktır.
:::

Ayrıca kapamalar, yineleyiciler ve trait nesneleri hakkında kısa bir tanıtım yapacağız; bu konular [Bölüm 13][ch13] ve [Bölüm 18][ch18] kapsamında detaylı olarak ele alınacaktır.

--- 

[ch7]: ch07-00-managing-growing-projects-with-packages-crates-and-modules.html  
[ch8]: ch08-00-common-collections.html  
[ch9]: ch09-00-error-handling.html  
[ch10]: ch10-00-generics.html  
[ch11]: ch11-00-testing.html  
[ch13]: ch13-00-functional-features.html  
[ch18]: ch18-00-oop.html  