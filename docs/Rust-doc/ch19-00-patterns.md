# Desenler ve Eşleşme

*Desenler*, Rust'ta türlerin, hem karmaşık hem de basit olanlarının yapısına karşı eşleşmek için özel bir sözdizimidir. Desenleri `match` ifadeleri ve diğer yapılarla birleştirerek, bir programın kontrol akışı üzerinde daha fazla kontrol elde edersiniz. Bir desen, aşağıdakilerin bazı bileşimlerinden oluşur:

- Literaller
- Dışarı çıkarılmış diziler, enumlar, yapılar veya demetler
- Değişkenler
- Yıldız karakterleri
- Yer tutucular

:::info
Bazı örnek desenler `x`, `(a, 3)` ve `Some(Color::Red)`'dir. Desenlerin geçerli olduğu bağlamlarda, bu bileşenler verinin şeklini tanımlar. 
:::

Programımız daha sonra değerleri desenlerle karşılaştırarak belirli bir kod parçasını çalıştırmak için doğru veri şeklinin olup olmadığını belirler.

> Bir deseni kullanmak için, onu bir değerle karşılaştırırız. Eğer desen değeri eşleşirse, değer parçalarını kodumuzda kullanırız.  
> — Rust Programlama Kılavuzu

Desenleri kullanan `match` ifadelerini 6. Bölümdeki madeni para ayırma makinesi örneği gibi hatırlayın. Eğer değer, desenin şekline uyuyorsa, adlandırılmış parçaları kullanabiliriz. Uymuyorsa, desenle ilişkili kod çalışmaz.

---

Bu bölüm, desenlerle ilgili her şey için bir referanstır. Desenleri kullanmak için geçerli yerleri, çürütülebilir ve çürütülemez desenler arasındaki farkı ve görebileceğiniz farklı desen sözdizimi türlerini ele alacağız.


Detaylı Bilgi
Bölümün sonunda, desenleri birçok kavramı net bir şekilde ifade etmek için nasıl kullanacağınızı bileceksiniz.


:::tip
Desen kullanırken, özellikle yer tutucular ve değişkenler arasında doğru seçim yapmak önemlidir. Bu, kodunuzun okunabilirliğini artırır.
:::
