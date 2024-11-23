# İlişkili Verileri Yapılandırmak için Yapıları Kullanma

Bir *struct* ya da *yapı*, bir anlamlı grubu oluşturan birden fazla ilişkili değeri bir araya getirip adlandırmanıza olanak tanıyan özel bir veri türüdür. Eğer nesne yönelimli bir dil ile tanıştıysanız, bir *struct*, bir nesnenin veri özelliklerine benzer. 

:::info
Bu bölümde, zaten bildiklerinizi geliştirmek için demetleri ve yapıları karşılaştıracağız ve yapıların verileri gruplamak için ne zaman daha iyi bir yol olduğunu göstereceğiz.
:::

Yapıları nasıl tanımlayacağımızı ve başlatacağımızı göstereceğiz. Yapı türü ile ilişkili davranışları belirtmek için özellikle *metotlar* adı verilen ilişkili fonksiyonları nasıl tanımlayacağımızı tartışacağız. 

:::tip
Yapıları kullanarak verileri gruplamak, kodunuzu daha düzenli ve okunabilir hale getirir.
:::

Yapılar ve enum'lar (Bölüm 6'da tartışılmıştır) programınızın alanında yeni türler oluşturmanın yapı taşlarıdır ve Rust'ın derleme zamanı tür kontrolünden tam olarak yararlanmanızı sağlar.

---

:::note
Yapılar, sadece verileri tutmakla kalmaz, aynı zamanda onlarla ilgili işlemler için metotlar da içerebilir.
:::

:::warning
Yapı tanımlamalarında dikkat edilmesi gereken bir nokta, aşırı karmaşık yapılardan kaçınmaktır. Kodunuzu daha anlaşılır kılmak için yapıların boyutunu makul tutmalısınız.
:::

> Yapılar ve enum'lar, Rust'ın güçlü tür sisteminin bir parçasıdır. — Rust Belgeleri


Yapılar Hakkında Daha Fazla Bilgi

Yapılar, ilişkili veri alanlarını gruplamak için etkili bir yoldur. Aşağıda, yapıların tanımlanmasıyla ilgili örnek bir kod parçası bulunmaktadır:

```rust
struct Person {
    name: String,
    age: u32,
}
```

Bu renkli örnekte, `Person` yapısı bir kişinin adını ve yaşını temsil eder.
