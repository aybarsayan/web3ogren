# Sahipliği Anlamak

Sahiplik, Rust'ın en eşsiz özelliğidir ve dilin geri kalanı üzerinde derin etkileri vardır. Rust'ın çöp toplayıcıya ihtiyaç duymadan bellek güvenliği garantileri verebilmesini sağlar. Bu nedenle sahipliğin nasıl çalıştığını anlamak önemlidir. 

:::tip
Sahiplik, bellek yönetimi konusunda önemli bir kavramdır; bu yüzden Rust'ta nasıl kullanıldığını öğrenmek, etkili bir şekilde program yazmanın temelidir.
:::

Bu bölümde, sahiplik ve ayrıca birkaç ilgili özellik hakkında konuşacağız: ödünç alma, dilimleme ve Rust'ın verileri bellekte nasıl düzenlediği.

## Sahiplik ve Ödünç Alma

Sahiplik, bir değişkenin bellek üzerindeki verileri kontrol etme yetkisini belirler. Bir değişken, bir değer üzerinde bir sahibi olduğu anlamına gelir. 

:::info
Her Rust değişkeninin bir sahibi vardır ve bir değerin yalnızca bir sahibi olabilir.
:::

### Ödünç Alma

Ödünç alma, sahiplik kurallarına uygun olarak veri erişimini kontrol eden bir mekanizmadır. Rust'ta iki tür ödünç alma vardır: 

1. **Kaynak (immutable) ödünç alma**
2. **Değişken (mutable) ödünç alma**

:::warning
Eğer değişkeni mutable olarak ödünç aldıysanız, sadece bir mutable ödünç almaya izin vardır; bu, aynı anda birden fazla mutable ödünç almanın yasak olduğu anlamına gelir.
:::

## Bellek Yönetimi

Rust, verileri bellekte nasıl düzenlediği ile ilgili birkaç önemli prensip belirler. Bunlardan biri, veri parçalarını yönetirken sahiplik ve ödünç alma kurallarını takip etmektir. 

:::note
Bu özellikler, bellek üzerinde daha fazla kontrol sağlar ve hatalı bellek erişimlerinin önüne geçer.
:::

## Daha Fazla Bilgi


Belirli bir örnek üzerinden açıklama

Rust’da bir değişkenin sahibi başka bir değişkene atandığında, eski değişken geçersiz hale gelir. Bu davranış bellek güvenliğini artırır.

```rust
fn main() {
    let s1 = String::from("Merhaba");
    let s2 = s1; // s1 artık geçersiz
}
```


---

Bu temel ilkeleri anlamak, Rust ile etkili bir şekilde çalışabilmek için kritik öneme sahiptir.

> “Belirli bir kapsamda, bir değerin sadece bir sahibi olmalıdır.”  
> — Rust Kılavuzu