# Yaygın Programlama Kavramları

Bu bölüm, hemen hemen her programlama dilinde bulunan kavramları ve bunların Rust içerisindeki işleyişini kapsar. Birçok programlama dili temel düzeyde birçok ortak niteliğe sahiptir. Bu bölümde sunulan kavramların hiçbiri Rust'a özgü değildir, ancak bu kavramları Rust bağlamında tartışacağız ve bu kavramların kullanımına dair gelenekleri açıklayacağız.

Özellikle, değişkenler, temel türler, fonksiyonlar, yorumlar ve kontrol akışı hakkında bilgi edineceksiniz. Bu temeller her Rust programında bulunacak ve bunları erken öğrenmek size güçlü bir başlangıç noktası verecektir.

> #### Anahtar Kelimeler
>
> Rust dilinin yalnızca dil tarafından kullanıma ayrılmış bir dizi *anahtar kelimesi* vardır, tıpkı diğer dillerde olduğu gibi. Bu kelimeleri değişken veya fonksiyon isimleri olarak kullanamayacağınızı unutmayın. Anahtar kelimelerin çoğu özel anlamlara sahiptir ve Rust programlarınızda çeşitli görevleri yerine getirmek için bunları kullanacaksınız; bazıları ise şu anda herhangi bir işlevsellik ile ilişkili değildir, ancak gelecekte Rust'a eklenebilecek işlevsellik için ayrılmıştır. 

:::tip
Anahtar kelimelerin bir listesini [Ek A][appendix_a] içerisinde bulabilirsiniz.
:::

[appendix_a]: appendix-01-keywords.md