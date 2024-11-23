# Ortak Koleksiyonlar

Rust’un standart kütüphanesi *koleksiyonlar* olarak adlandırılan son derece kullanışlı veri yapıları içerir. Diğer veri türlerinin çoğu bir özel değeri temsil ederken, koleksiyonlar birden fazla değeri içerebilir. Yerleşik dizi ve demet türlerinin aksine, bu koleksiyonların gösterdiği veriler **heap** üzerinde depolanır, bu da verinin miktarının derleme zamanında bilinmesine gerek olmadığı ve program çalıştıkça büyüyüp küçülebileceği anlamına gelir. 

:::info
Her tür koleksiyonun farklı yetenekleri ve maliyetleri vardır. Mevcut durumunuz için uygun olanı seçmek, zamanla geliştireceğiniz bir beceridir.
:::

Bu bölümde, Rust programlarında çok sık kullanılan üç koleksiyonu tartışacağız:

- Bir *vektör*, yan yana değişken sayıda değer depolamanıza olanak tanır.
- Bir *string*, karakterlerin bir koleksiyonudur. Daha önce `String` türünden bahsetmiştik, ancak bu bölümde onu derinlemesine ele alacağız.
- Bir *hash map*, bir değeri belirli bir anahtarla ilişkilendirmenizi sağlar. Bu, daha genel bir veri yapısı olan *map*'in özel bir uygulamasıdır.

Standart kütüphane tarafından sağlanan diğer koleksiyon türlerini öğrenmek için [belgelere][collections] bakın.

---
Vektörleri, stringleri ve hash mapleri nasıl oluşturup güncelleyeceğimizi ve her birinin neyi özel kıldığını tartışacağız.

> **Anahtar Not:** Bu koleksiyonların kullanımı, Rust'taki veri yönetimini büyük ölçüde basitleştirir. 
> — *Rust Standart Kütüphanesi Üzerine*


Ek Bilgi: Koleksiyonların Avantajları

Koleksiyonlar kullanmanın bazı avantajları şunlardır:

- Dinamik boyutlandırma
- Gelişmiş veri yönetimi
- Daha etkili bellek kullanımı

Bu özellikler, Rust ile daha verimli ve esnek uygulamalar geliştirmek için önemlidir.


[collections]: ../std/collections/index.html