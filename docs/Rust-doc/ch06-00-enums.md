# Enum'lar ve Desen Eşleştirme

Bu bölümde, *enumeration* olarak adlandırılan *enum'lara* bakacağız. Enum'lar, olası *varyantlarını* sıralayarak bir tür tanımlamanıza olanak tanır. 

:::note
Enum'lar, verilerin türlerini daha anlamlı bir şekilde yönetmenizi sağlar.
:::

## Enum Tanımı ve Kullanımı

İlk olarak, bir enum'u tanımlayıp kullanarak bir enum'un nasıl anlam ile birlikte veriyi kodlayabileceğini göstereceğiz. 

> “Enum'lar, bir değer kümesini tanımlamak için etkili bir yoldur.”  
> — Kodlama Kılavuzu

:::tip
Enum tanımlarken, her bir varyantı anlamlı isimlerle adlandırmak en iyi uygulamadır.
:::

## Option Enum'u

Ardından, bir değerinin ya bir şey ya da hiçbir şey olabileceğini ifade eden `Option` adlı özellikle yararlı bir enum'u inceleyeceğiz. 


Option Enum Nedir?
`Option`, Rust dilindeki en kullanışlı enum'lardan biridir. İçinde bir değer barındırabilir (`Some`) veya hiç değer taşıyabilir (`None`).


## Desen Eşleştirme

Daha sonra, `match` ifadesindeki desen eşleştirmenin, bir enum'un farklı değerleri için farklı kodlar çalıştırmayı ne kadar kolaylaştırdığını göreceğiz. 

:::info
`Match`, bir enum'un hangi varyantının kullanılması gerektiğini belirlemek için oldukça etkili bir yoldur.
:::

### `if let` Yapısı

Son olarak, enum'ları kodunuza entegre etmek için kullanılabilir başka bir pratik ve özlü deyim olan `if let` yapısını ele alacağız.

:::warning
`if let`, sadece bir varyantla çalışırken kullanılmalıdır; aksi takdirde, kodunuz beklenmeyen hatalar verebilir.
:::