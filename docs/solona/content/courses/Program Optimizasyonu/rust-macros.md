---
title: Rust İşlevsel Makroları
objectives:
  - Rust'ta **İşlevsel Makrolar** oluşturma ve kullanma
  - Rust Soyut Sözdizim Ağaçları (AST) ile çalışma ve açıklama
  - Anchor çerçevesinde işlevsel makroların nasıl kullanıldığını tanımlama
description: "Derleme zamanında kod oluşturmak için Rust makrolarını kullanın."
---

## Özet

- **İşlevsel makrolar**, programcının özel girdi bilgisine dayanarak derleme zamanında kod oluşturmasına olanak tanıyan özel bir Rust makrosudur.
- Anchor çerçevesinde, işlevsel makrolar, Solana programları yazarken gereken gereksiz kodu azaltan kodlar üretir.
- **Soyut Sözdizim Ağacı (AST)**, bir işlevsel makroya geçirilen giriş kodunun sözdizimini ve yapısını temsil eder. Bir makro oluştururken, uygun kodu oluşturmak için token ve öğe gibi AST öğelerini kullanırsınız.
- **Token**, Rust derleyicisinin ayrıştırabileceği en küçük kaynak kodu birimidir.
- **Öğe**, bir Rust programında bir yapı, enum, trait, fonksiyon veya yöntem gibi kullanılabilecek bir şeyi tanımlayan bir bildirimdir.
- **TokenStream**, bir kaynak kodu parçasını temsil eden token dizisidir. Bunu bir işlevsel makroya geçirebilir, böylece kodda bireysel token'lara erişip bunları manipüle edebilirsiniz.

## Ders

Rust'ta bir makro, bir kez yazıp ardından "genişletip" derleme zamanında kod oluşturabileceğiniz bir kod parçasıdır. Bu kod oluşturma işlemi, tekrarlayan veya karmaşık kodlar oluşturmanız gerektiğinde veya programınızda birçok yerde aynı kodu kullanmak istediğinizde faydalı olabilir.

İki farklı makro türü vardır: deklaretif makrolar ve **işlevsel makrolar**.

- Deklaretif makrolar, kod kalıplarıyla eşleşip, eşleşen kalıba dayanarak kod oluşturmanıza olanak tanıyan `macro_rules!` makrosu kullanılarak tanımlanır.
- Rust'taki işlevsel makrolar, Rust kodu kullanılarak tanımlanır ve giriş TokenStream'inin soyut sözdizim ağacı (AST) üzerinde çalışır; bu da onlara daha ince bir ayrıntı seviyesinde kodu manipüle etme ve oluşturma yeteneği kazandırır.

:::info
Bu ders, Anchor çerçevesinde standart olan işlevsel makrolara odaklanacaktır.
:::

### Rust Kavramları

Özellikle makroları tartışmadan önce, ders boyunca kullanacağımız bazı önemli terminoloji, kavramlar ve araçları gözden geçirelim.

### Token

Rust programlamasında, bir [token](https://doc.rust-lang.org/reference/tokens.html), dilin sözdiziminin temel bir unsurudur; bir tanımlayıcı veya literal değer gibi. Token'lar, Rust derleyicisi tarafından tanınan en küçük kaynak kodu birimini temsil eder ve bir programdaki daha karmaşık ifadeleri ve beyanları oluşturmak için kullanılır.

Rust token'larının örnekleri şunlardır:

- `fn`, `let` ve `match` gibi [Anahtar Kelimeler](https://doc.rust-lang.org/reference/keywords.html), Rust dilinde özel anlamlara sahip ayrılmış kelimelerdir.
- Değişken ve fonksiyon adları gibi, [Tanımlayıcılar](https://doc.rust-lang.org/reference/identifiers.html), değerlere ve fonksiyonlara işaret eder.
- `{`, `}`, ve `;` gibi [Noktalama İşaretleri](https://doc.rust-lang.org/reference/tokens.html#punctuation), kod bloklarını yapılandırmak ve sınırlamak için kullanılır.
- Sayılar ve dizeler gibi [Literal'lar](https://doc.rust-lang.org/reference/tokens.html#literals), bir Rust programındaki sabit değerleri temsil eder.

Daha fazla bilgi edinebilirsiniz [Rust token'ları hakkında daha fazla bilgi okuyabilirsiniz](https://doc.rust-lang.org/reference/tokens.html).

### Öğe

Öğeler, Rust'taki adlandırılmış ve kendi kendine yeterli kod parçalarıdır. İlgili kodları grup haline getirmenin ve bu gruba referans vermek için bir isim vermenin bir yolunu sağlar; bu da kodunuzu modüler olarak yeniden kullanmanızı ve düzenlemenizi kolaylaştırır.

Farklı türde öğeler vardır, örneğin:

- Fonksiyonlar
- Yapılar
- Enumlar
- Trait'ler
- Modüller
- Makrolar

Daha fazla bilgi edinebilirsiniz [Rust öğeleri hakkında](https://doc.rust-lang.org/reference/items.html).

### Token Stream'ler

`TokenStream` veri türü, bir token dizisini temsil eder. `proc_macro` kütüphanesinde tanımlanmıştır ve makroların, kod tabanındaki diğer kodlardan yola çıkarak yazılmasını sağlamak için sunulur.

:::note
Bir işlevsel makro tanımlarken, makro girişi `TokenStream` olarak makroya geçirilir; bu da ardından ayrıştırılıp dönüştürülür.
:::

Elde edilen `TokenStream`, ardından makro tarafından nihai kod çıktısına genişletilebilir.

```rust
use proc_macro::TokenStream;

#[proc_macro]
pub fn my_macro(input: TokenStream) -> TokenStream {
    ...
}
```

### Soyut Sözdizim Ağacı

Rust işlevsel makro bağlamında, soyut sözdizim ağacı (AST), giriş token'larının hiyerarşik yapısını ve Rust dilindeki anlamını temsil eden bir veri yapısıdır. Genellikle, işlevsel makro tarafından hızlı bir şekilde işlenip dönüştürülebilen girişin ara temsili olarak kullanılır.

:::warning
Makro, AST'yi kullanarak giriş kodunu analiz edebilir ve değişiklikler yapabilir; örneğin token ekleyip çıkarabilir veya kodun anlamını dönüştürebilir.
:::

Daha sonra bu dönüştürülmüş AST'yi kullanarak yeni kod oluşturabilir; bu da proc makrosunun çıktısı olarak dönebilir.

### `syn` Kütüphanesi

`syn` kütüphanesi, bir token akışını makro kodunun gezip manipüle edebileceği bir AST'ye ayrıştırmaya yardımcı olmak için kullanılabilir. Rust programında bir işlevsel makro çağrıldığında, makro işlevi bir token akışı ile çağrılır. Bu girişin ayrıştırılması, neredeyse her makro için ilk adımdır.

Bir proc makrosunu, aşağıdaki şekilde `my_macro!` kullanarak çağırdığınız bir örnek olarak düşünün:

```rust
my_macro!("hello, world");
```

Yukarıdaki kod çalıştırıldığında, Rust derleyicisi giriş token'larını (`"hello, world"`) `my_macro` proc makrosuna `TokenStream` olarak geçirir.

```rust
use proc_macro::TokenStream;
use syn::parse_macro_input;

#[proc_macro]
pub fn my_macro(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as syn::LitStr);
    eprintln!("{:#?}", ast.token());
    ...
}
```

Proc makrosu içinde, kod `parse_macro_input!` makrosunu kullanarak giriş `TokenStream`'ini bir soyut sözdizim ağacına (AST) ayrıştırır. Özellikle, bu örnek, Rust'taki bir UTF-8 dize literalini temsil eden `LitStr` örneği olarak ayrıştırmaktadır. AST'nin hata ayıklama amaçlarıyla çıktısını görmek için `.token()` yöntemini kullanarak bir [Literal](https://docs.rs/proc-macro2/1.0.86/proc_macro2/struct.Literal.html) döndürürüz.

```rust
Literal {
    kind: Str,
    symbol: "hello, world",
    suffix: None,
    // `TokenStream`'in ayrıştırıldığı kaynak kodunun kısmında
    // "hello, world" literalinin byte offsetlerini 31 ile 45 arasında gösterir.
    span: #0 bytes(31..45),
}
```

`eprintln!` makrosunun çıktısı, özgün token'lardan oluşturulan `Literal` AST'sinin yapısını gösterir. Dize literal değerini (`"hello, world"`) ve token hakkında, türü (`Str`), ek (`None`) ve genişleme gibi diğer bilgileri gösterir.

### `quote` Kütüphanesi

Bir diğer önemli kütüphane de `quote` kütüphanesidir; kod oluşturma kısmında kritik bir rol oynar.

Bir proc makrosu, AST'yi analiz etme ve dönüştürme işlemini bitirdikten sonra, `quote` kütüphanesini veya benzer bir kod oluşturma kütüphanesini kullanarak token akışına geri dönüştürebilir. Sonrasında, orijinal akışın kaynak kodundaki yerine geçmesi için Rust derleyicisine döndürülür.

Aşağıdaki `my_macro` örneğini inceleyelim:

```rust
use proc_macro::TokenStream;
use syn::parse_macro_input;
use quote::quote;

#[proc_macro]
pub fn my_macro(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as syn::LitStr);
    eprintln!("{:#?}", ast.token());
    let expanded = quote! {println!("The input is: {}", #ast)};
    expanded.into()
}
```

:::tip
Bu örnek, `quote!` makrosunu kullanarak `LitStr` AST'sini argüman olarak alan bir `println!` makro çağrısından oluşan yeni bir `TokenStream` oluşturur.
:::

Dikkat edin, `quote!` makrosu, `proc_macro2::TokenStream` türünde bir `TokenStream` üretir. Bu `TokenStream`'i Rust derleyicisine döndürmek için, `proc_macro::TokenStream`'e dönüştürmek için `.into()` metodunu kullanın. Rust derleyicisi daha sonra bu `TokenStream`'i orijinal proc makro çağrısının yerine koyacaktır.

```text
The input is: hello, world
```

İşlevsel makrolar kullanarak güçlü kod oluşturma ve metaprogramlama görevleri gerçekleştiren işlevsel makrolar yaratabilirsiniz.

### İşlevsel Makro

Rust'taki işlevsel makrolar, dili genişletmenin ve özel sözdizimi oluşturmanın güçlü bir yoludur. Bu makrolar Rust'ta yazılır ve kodun geri kalanıyla birlikte derlenir. Üç tür işlevsel makro vardır:

- Fonksiyon benzeri makrolar - `custom!(...)`
- Derivasyon makroları - `#[derive(CustomDerive)]`
- Attribute makroları - `#[CustomAttribute]`

:::info
Bu bölüm, üç tür işlevsel makroyu tartışacak ve birine örnek uygulama sağlayacaktır. 
:::

Bir işlevsel makro yazmak, tüm üç türde de tutarlı olduğundan, bu örnek diğer türlere uyarlanabilir.

### Fonksiyon Benzeri Makrolar

Fonksiyon benzeri işlevsel makrolar, üç tür işlevsel makro arasında en basitidir. Bu makrolar, `#[proc_macro]` niteliği ile önceden tanımlanmış bir fonksiyon kullanılarak tanımlanır. Fonksiyon, bir `TokenStream` almalı ve orijinal kodun yerine geçecek yeni bir `TokenStream` döndürmelidir.

```rust
#[proc_macro]
pub fn my_macro(input: TokenStream) -> TokenStream {
    ...
}
```

:::note
Bu makrolar, fonksiyon adının ardından `!` operatörü ile çağrılır. Rust programında ifadeler, beyanlar ve fonksiyon tanımları gibi çeşitli yerlerde kullanılabilirler.
:::

```rust
my_macro!(input);
```

Fonksiyon benzeri işlevsel makrolar, yalnızca tek bir girdi ve çıktı akışı gerektiren basit kod oluşturma görevleri için en iyi şekilde uygundur. Anlaşılması ve kullanılması kolaydır ve derleme zamanında kod oluşturmak için doğrudan bir yol sağlar.

### Attribute Makroları

Attribute makroları, Rust programındaki öğelere, örneğin fonksiyonlar ve yapılar gibi, eklenen yeni nitelikler tanımlar.

```rust
#[my_macro]
fn my_function() {
    ...
}
```

Attribute makroları, `#[proc_macro_attribute]` niteliği ile önceden tanımlanmış bir fonksiyon ile tanımlanır. Fonksiyon, iki token akışını girdi olarak alır ve orijinal öğeyi, arzu edilen sayıda yeni öğe ile değiştiren tek bir `TokenStream` çıktısı döndürür.

```rust
#[proc_macro_attribute]
pub fn my_macro(attr: TokenStream, input: TokenStream) -> TokenStream {
    ...
}
```

İlk token akışı girişi, niteliğin argümanlarını temsil eder. İkinci token akışı, niteliğin eklendiği öğenin geri kalanını, mevcut olabilecek diğer nitelikler dahil.

```rust
#[my_macro(arg1, arg2)]
fn my_function() {
    ...
}
```

Örneğin, bir attribute makrosu, kendisine geçirilen argümanları işleyerek belirli özellikleri açıp kapatabilir ve ikinci token akışını kullanarak orijinal öğeyi değiştirebilir. Her iki token akışına erişim sağlamak, attribute makrolarının tek bir token akışı kullanmaktan daha fazla esneklik ve işlevsellik sağlamasına olanak tanır.

### Derivasyon Makroları

Derivasyon makroları, bir yapı, enum veya birliğe `#[derive]` niteliği kullanılarak çağrılır. Genellikle, otomatik olarak giriş türleri için trait'leri uygulamak için kullanılırlar.

```rust
#[derive(MyMacro)]
struct Input {
    field: String
}
```

Derivasyon makroları, bir işlem öncesinde `#[proc_macro_derive]` niteliği ile tanımlanmış bir fonksiyon ile belirlenir. Bu, yalnızca yapıların, enumların ve birliklerin kodunu üretmek için sınırlıdır. Tek bir token akışı alır ve bir tek token akışı döndürür.

Diğer işlevsel makrolardan farklı olarak, döndürülen token akışı orijinal kodu değiştirmez. Bunun yerine, orijinal öğenin ait olduğu modül veya blokta eklenir; bu da geliştiricilerin orijinal kodu değiştirmeden orijinal öğenin işlevselliğini genişletmelerine olanak tanır.

```rust
#[proc_macro_derive(MyMacro)]
pub fn my_macro(input: TokenStream) -> TokenStream {
    ...
}
```

Trait'leri uygulamanın yanı sıra, derivasyon makroları yardımcı nitelikler de tanımlayabilir. Yardımcı nitelikler, derivasyon makrosunun eklendiği öğenin kapsamı içinde kullanılabilir ve kod oluşturma sürecini özelleştirebilir.

```rust
#[proc_macro_derive(MyMacro, attributes(helper))]
pub fn my_macro(body: TokenStream) -> TokenStream {
    ...
}
```

Yardımcı nitelikler, kendi başlarına etkisi olmayan inaktif niteliklerdir. Tek amacı, tanımlandıkları derivasyon makrosuna girdi olarak kullanılmaktır.

```rust
#[derive(MyMacro)]
struct Input {
    #[helper]
    field: String
}
```

Örneğin, bir derivasyon makrosu, varlığını belirli operasyonlar gerçekleştirmek için tanımlamak üzere bir yardımcı niteliği belirleyebilir ve geliştiricilerin derivasyon makrosunun işlevselliğini daha esnek bir şekilde genişletmesine ve oluşturdukları kodu özelleştirmesine olanak tanır.

### Bir işlevsel makro örneği

Bu örnek, bir yapı için otomatik olarak `describe()` yönteminin uygulanımını nasıl oluşturacağınızı göstermektedir.

```rust
use example_macro::Describe;

#[derive(Describe)]
struct MyStruct {
    my_string: String,
    my_number: u64,
}

fn main() {
    MyStruct::describe();
}
```

`describe()` yöntemi, yapının alanlarının tanımını konsola yazdıracaktır.

```text
MyStruct, şu adlandırılmış alanlara sahip bir yapıdır: my_string, my_number.
```

 İlk adım, işlevsel makroyu `#[proc_macro_derive]` niteliği ile tanımlamaktır. Yapının tanımlayıcısını ve verilerini çıkarmak için giriş `TokenStream`'i `parse_macro_input!()` makrosu ile ayrıştırılır.

```rust
use proc_macro::{self, TokenStream};
use quote::quote;
use syn::{parse_macro_input, DeriveInput, FieldsNamed};

#[proc_macro_derive(Describe)]
pub fn describe_struct(input: TokenStream) -> TokenStream {
    let DeriveInput { ident, data, .. } = parse_macro_input!(input);
    ...
}
```

Bir sonraki adım, `data` değerini `match` anahtar kelimesi ile pattern matching uygulayarak yapının alanlarının adlarını çıkarmaktır.

İlk `match` iki kola sahiptir: biri `syn::Data::Struct` varyantı için ve diğeri `syn::Data`'nın diğer tüm varyantlarını yöneten "yakala" `_` koludur.

İkinci `match` için de iki kola sahiptir: biri `syn::Fields::Named` varyantı için ve diğeri `syn::Fields`'ın diğer tüm varyantlarını yöneten "yakala" `_` koludur.

`#(#idents), *` sözdizimi, `idents`'in "genişletileceği" ve iterator'daki elemanların virgülle ayrılmış bir listesinin oluşturulacağı anlamına gelir.

```rust
use proc_macro::{self, TokenStream};
use quote::quote;
use syn::{parse_macro_input, DeriveInput, FieldsNamed};

#[proc_macro_derive(Describe)]
pub fn describe_struct(input: TokenStream) -> TokenStream {
    let DeriveInput { ident, data, .. } = parse_macro_input!(input);

    let field_names = match data {
        syn::Data::Struct(s) => match s.fields {
            syn::Fields::Named(FieldsNamed { named, .. }) => {
                let idents = named.iter().map(|f| &f.ident);
                format!(
                    "adlandırılmış alanlara sahip bir yapı: {}",
                    quote! {#(#idents), *},
                )
            }
            _ => panic!("syn::Fields varyantı desteklenmiyor"),
        },
        _ => panic!("syn::Data varyantı desteklenmiyor"),
    };
    ...
}
```

Son adım, bir yapı için `describe()` yöntemini uygulamak. `expanded` değişkeni `quote!` makrosunu ve yapının adını saklayan `#ident` değişkenini kullanarak oluşturulur.

Bu uygulama, yapının adını ve alan adlarını yazdırmak için `println!` makrosunu kullanan `describe()` yöntemini tanımlar.

Sonunda, `expanded` değişkeni `TokenStream`'e dönüştürülür.

```rust
use proc_macro::{self, TokenStream};
use quote::quote;
use syn::{parse_macro_input, DeriveInput, FieldsNamed};

#[proc_macro_derive(Describe)]
pub fn describe(input: TokenStream) -> TokenStream {
    let DeriveInput { ident, data, .. } = parse_macro_input!(input);

    let field_names = match data {
        syn::Data::Struct(s) => match s.fields {
            syn::Fields::Named(FieldsNamed { named, .. }) => {
                let idents = named.iter().map(|f| &f.ident);
                format!(
                    "adlandırılmış alanlara sahip bir yapı: {}",
                     quote! {#(#idents), *},
                )
            }
            _ => panic!("syn::Fields varyantı desteklenmiyor"),
        },
        _ => panic!("syn::Data varyantı desteklenmiyor"),
    };

    let expanded = quote! {
        impl #ident {
            fn describe() {
                println!("{} şu şekildedir: {}.", stringify!(#ident), #field_names);
            }
        }
    };

    expanded.into()
}
```

Artık, bir yapıya `#[derive(Describe)]` niteliği eklendiğinde, Rust derleyicisi otomatik olarak `describe()` yönteminin bir uygulamasını oluşturur; bu yöntem, yapının adını ve alanlarını yazdırmak için kullanılabilir.

```rust
#[derive(Describe)]
struct MyStruct {
    my_string: String,
    my_number: u64,
}
```

`cargo expand` komutu, işlevsel makroları kullanan Rust kodunu genişletebilir. Örneğin, `#[derive(Describe)]` niteliğini kullanan `MyStruct` yapısının oluşturduğu kod aşağıdaki gibidir:

```rust
struct MyStruct {
    my_string: String,
    my_number: f64,
}
impl MyStruct {
    fn describe() {
        {
            ::std::io::_print(
                ::core::fmt::Arguments::new_v1(
                    &["", " şu şikilde: ", ".\n"],
                    &[
                        ::core::fmt::ArgumentV1::new_display(&"MyStruct"),
                        ::core::fmt::ArgumentV1::new_display(
                            &"adlandırılmış alanlara sahip bir yapı: my_string, my_number",
                        ),
                    ],
                ),
            );
        };
    }
}
```

### Anchor İşlevsel Makroları

İşlevsel makrolar, genellikle Solana geliştirmelerinde kullanılan Anchor kütüphanesinin arkasındaki sihirdir. Anchor makroları daha kısa kod, standart güvenlik kontrolleri ve daha fazlası sağlar. Anchor'ın işlevsel makroları nasıl kullandığını birkaç örnekle inceleyelim.

### Fonksiyon Benzeri Makro

`declare_id` makrosu, Anchor'da fonksiyon benzeri makroların nasıl kullanıldığını göstermektedir. Bu makro, bir programın kimliğini temsil eden karakterler dizisini girdi olarak alır ve bunu Anchor programında kullanılabilecek bir `Pubkey` türüne dönüştürür.

```rust
declare_id!("G839pmstFmKKGEVXRGnauXxFgzucvELrzuyk6gHTiK7a");
```

`declare_id` makrosu, `#[proc_macro]` niteliği ile tanımlanmıştır; bu da onun bir fonksiyon benzeri proc makrosu olduğunu belirtir.

```rust
#[proc_macro]
pub fn declare_id(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let address = input.clone().to_string();

    let id = parse_macro_input!(input as id::Id);
    let ret = quote! { #id };
    ...
        let idl_print = anchor_syn::idl::gen_idl_print_fn_address(address);
        return proc_macro::TokenStream::from(quote! {
             #ret
             #idl_print
         });
    ...
}
```

### Derivasyon Makrosu

`#[derive(Accounts)]`, Anchor'da kullanılan birden çok derivasyon makrosundan sadece bir örnektir.

`#[derive(Accounts)]` makrosu, verilen yapı için `Accounts` trait'ini uygulayan kodlar üretir. Bu trait, birçok şeyi gerçekleştirir, bunlar arasında bir talebe aktarılacak hesapların doğrulanması ve serileştirilmesi yer alır; bu da yapının bir Anchor programında bir talebe ihtiyaç duyan hesapların listesi olarak kullanılmasına olanak tanır.

`#[account(..)]` niteliği ile belirtilen alanlardaki herhangi bir kısıtlama, serileştirme sırasında uygulanır. `#[instruction(..)]` niteliği de eklenerek talebin argümanlarını belirtir ve bunların makroya erişilebilir olmasını sağlar.

```rust
#[derive(Accounts)]
```

# [instruction(input: String)]
pub struct Initialize {
    #[account(init, payer = payer, space = MyData::DISCRIMINATOR.len() + MyData::INIT_SPACE + input.len())]
    pub data_account: Account,
    #[account(mut)]
    pub payer: Signer,
    pub system_program: Program,
}

:::tip
Bu makro, bir struct'a uygulanabilecek bir türetme makrosu olarak kullanılmasını sağlayan `proc_macro_derive` niteliği kullanılarak tanımlanmıştır.
:::

`#[proc_macro_derive(Accounts, attributes(account, instruction))]` satırı, bunun `account` ve `instruction` yardımcı niteliklerini işleyen bir türetme makrosu olduğunu belirtir.

INIT_SPACE, bir hesabın başlangıç boyutunu hesaplamak için kullanılır. Bu, otomatik olarak `MyData` üzerinde türetme makrosu aracılığıyla uygulanmış ve [anchor_lang::Space](https://docs.rs/anchor-lang/latest/anchor_lang/trait.Space.html#associatedconstant.INIT_SPACE) ile tanımlanmıştır.

```rust
#[account]
#[derive(InitSpace)]
pub struct NewAccount {
 data: u64,
}
```

`#[account]` makrosu ayrıca, 
[anchor_lang::Discriminator](https://docs.rs/anchor-lang/latest/anchor_lang/trait.Discriminator.html) niteliğini uygulayan bir anchor hesabının _DISCRIMINANTI_’ni otomatik olarak türetir. Bu nitelik, ayırt edici olanı içeren 8 baytlık bir dizi sunar; bu, `NewAccount::DISCRIMINATOR` kullanılarak açığa çıkarılabilir. Bu 8 baytlık dizideki `.len()` çağrısı, ayırt edicinin uzunluğunu verir;

```rust
#[proc_macro_derive(Accounts, attributes(account, instruction))]
pub fn derive_anchor_deserialize(item: TokenStream) -> TokenStream {
    parse_macro_input!(item as anchor_syn::AccountsStruct)
        .to_token_stream()
        .into()
}
```

### Niteliği makrosu `#[program]`

`#[program]` niteliği makrosu, Anchor'da bir Solana programı için talimat yöneticilerini içeren modülü tanımlamak için kullanılan bir niteliği makrosunun örneğidir.

```rust
#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ...
    }
}
```

:::info
Bu durumda, `#[program]` niteliği, bir modüle uygulanmıştır; bu modülün bir Solana programı için talimat yöneticilerini içerdiğini belirtir.
:::

```rust
#[proc_macro_attribute]
pub fn program(
    _args: proc_macro::TokenStream,
    input: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    parse_macro_input!(input as anchor_syn::Program)
        .to_token_stream()
        .into()
}
```

Genel olarak, Anchor'da proc makrolarını kullanmak, Solana geliştiricilerinin yazması gereken tekrarlayan kod miktarını önemli ölçüde azaltır. Kodu temel işlevselliğe odaklanarak tekrarı azaltarak, hataları minimuma indirmek ve daha hızlı bir geliştirme süreci sağlamak mümkündür.

---

## Laboratuvar

Bunu yeni bir türetme makrosu oluşturarak pratiğe dökelim! Yeni makromuz, bir Anchor programındaki bir hesabın her alanını güncelleme işlemi için otomatik olarak talimat mantığı oluşturmamıza izin verecek.

### 1. Başlangıç

Başlamak için, `anchor-custom-macro` deposunun `starter` dalından başlangıç kodunu indirin.

Başlangıç kodu, bir `Config` hesabını başlatmanıza ve güncellemenize izin veren basit bir Anchor programı içerir; bu, `Program Yapılandırması dersi` ile yaptığımızın benzeridir.

:::note
Söz konusu hesap aşağıdaki gibi yapılandırılmıştır:
:::

```rust
use anchor_lang::{Discriminator, prelude::*};

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub auth: Pubkey,
    pub bool: bool,
    pub first_number: u8,
    pub second_number: u64,
}

impl Config {
    pub const LEN: usize = Config::DISCRIMINATOR.len() + Config::INIT_SPACE;
}
```

`programs/admin/src/lib.rs` dosyası, programın talimatlarının tanımları ile birlikte program giriş noktası içerir. Şu anda program, bu hesabı başlatmak için talimatlara ve ardından alanı güncellemek için her hesaba bir talimat içerir.

`programs/admin/src/admin_config` dizini, programın talimat mantığı ve durumunu içerir. Bu dosyaların her birine göz atın. Her alan için talimat mantığının her talimat için tekrarlandığını göreceksiniz.

:::warning
Bu laboratuvarın amacı, talimat mantığı işlevlerini değiştirecek ve her talimat için otomatik olarak işlevler oluşturacak bir işlemsel makro uygulamaktır.
:::

### 2. Özel makro bildirimini ayarlama

Özel makromuz için ayrı bir crate oluşturarak başlayalım. Proje kök dizininde `cargo new --lib custom-macro` komutunu çalıştırın. Bu komut, kendine ait `Cargo.toml` dosyasıyla yeni bir `custom-macro` dizini oluşturur. Yeni `Cargo.toml` dosyasını aşağıdaki gibi güncelleyin:

```text
[package]
name = "custom-macro"
version = "0.1.0"
edition = "2021"

[lib]
proc-macro = true

[dependencies]
syn = "2.0.77"
quote = "1.0.73"
proc-macro2 = "1.0.86"
anchor-lang.workspace = true
```

`proc-macro = true` satırı, bu crate'in bir prosedürel makro içerdiğini tanımlar. Bağımlılıklar, türetme makromuzu oluşturmak için kullanacağımız tüm crate'lerdir.

Sonrasında, proje kökündeki `Cargo.toml` dosyasının `members` alanını `"custom-macro"` içercek şekilde güncelleyin:

```text
[workspace]
members = [
 "programs/*",
 "custom-macro"
]

[workspace.dependencies]
anchor-lang = "0.30.1"
```

:::note
`[workspace.dependencies]` alanında _anchor-lang_ bağımlılık olarak tanımlandığında, kök proje yapılandırmasında _anchor-lang_ versiyonunu tanımlayıp, onun üzerine bağımlı olan aynı workspace'in diğer tüm üyelerinde o versiyonu miras alabiliriz. Tıpkı bir sonraki tanımlanacak _custom-macro-test_ crate'i gibi.
:::

Şimdi, crate'imiz ayarlandı ve kullanılmaya hazır. Ama ilerlemeden önce, yaratmakta olduğumuz makroyu test etmek için kök seviyede bir crate daha oluşturalım. Proje kökünde `cargo new custom-macro-test` komutunu kullanın. Ardından yeni oluşturulan `Cargo.toml` dosyasını `anchor-lang` ve `custom-macro` crate'lerini bağımlılıklar olarak ekleyecek şekilde güncelleyin:

```text
[package]
name = "custom-macro-test"
version = "0.1.0"
edition = "2021"

[dependencies]
anchor-lang.workspace = true
custom-macro = { path = "../custom-macro" }
```

Son olarak, kök proje `Cargo.toml` dosyasını yeni `custom-macro-test` crate'ini daha önceki gibi ekleyecek şekilde güncelleyin:

```text
[workspace]
members = [
 "programs/*",
 "custom-macro",
 "custom-macro-test"
]
```

Son olarak, `custom-macro-test/src/main.rs` dosyasındaki kodu aşağıdaki gibi değiştirin. Bunu test etmek için daha sonra kullanacağız:

```rust
use anchor_lang::prelude::*;
use custom_macro::InstructionBuilder;

#[derive(InstructionBuilder)]
pub struct Config {
    pub auth: Pubkey,
    pub bool: bool,
    pub first_number: u8,
    pub second_number: u64,
}
```

### 3. Özel makroyu tanımlama

Şimdi, `custom-macro/src/lib.rs` dosyasında yeni makromuzun bildirimini ekleyelim. Bu dosyada, `TokenStream` girdisini analiz etmek ve bir `DeriveInput` yapısından `ident` ve `data` alanlarını çıkartmak için `parse_macro_input!` makrosunu kullanacağız. Ardından, `ident` ve `data` değerlerini yazdırmak için `eprintln!` makrosunu kullanacağız. Şimdi `TokenStream::new()` kullanarak boş bir `TokenStream` döneceğiz.

```rust
use proc_macro::TokenStream;
use quote::*;
use syn::*;

#[proc_macro_derive(InstructionBuilder)]
pub fn instruction_builder(input: TokenStream) -> TokenStream {
    let DeriveInput { ident, data, .. } = parse_macro_input!(input);

    eprintln! ("{:#?}", ident);
    eprintln! ("{:#?}", data);

    TokenStream::new()
}
```

Bunun neyi yazdırdığına test yapalım. Bunun için önce `cargo-expand` komutunu kurmalısınız; `cargo install cargo-expand` komutunu çalıştırarak bunu yapabilirsiniz. Ayrıca, Rust'un gece yüklemesini de çalıştırmanız gerekiyor; `rustup install nightly` komutunu kullanın.

Bunları yaptıktan sonra, `custom-macro-test` dizinine gidin ve `cargo expand` çalıştırın.

:::note
Bu komut, crate'teki makroları genişletir. `main.rs` dosyası yeni oluşturulan `InstructionBuilder` makrosunu kullandığı için, bu, yapı tanımının `ident` ve `data` için sözdizim ağacını konsola yazdıracaktır. Girdi `TokenStream`'inin doğru bir şekilde analiz edilip edilmediğini onayladıktan sonra, `eprintln!` ifadelerini kaldırabilirsiniz.
:::

### 4. Yapının alanlarını alma

Sonraki adımda, yapının `data` alanından adlandırılmış alanları almak için `match` ifadelerini kullanalım. Ardından, alanların değerlerini yazdırmak için `eprintln!` makrosunu kullanacağız.

```rust
use proc_macro::TokenStream;
use quote::*;
use syn::*;

#[proc_macro_derive(InstructionBuilder)]
pub fn instruction_builder(input: TokenStream) -> TokenStream {
    let DeriveInput { ident, data, .. } = parse_macro_input!(input);

    let fields = match data {
        syn::Data::Struct(s) => match s.fields {
            syn::Fields::Named(n) => n.named,
            _ => panic!("The syn::Fields variant is not supported: {:#?}", s.fields),
        },
        _ => panic!("The syn::Data variant is not supported: {:#?}", data),
    };

    eprintln! ("{:#?}", fields);

    TokenStream::new()
}
```

Bir kez daha, terminalde `cargo expand` kullanarak bu kodun çıktısını görün. Alanların doğru bir şekilde çıkarılıp çıkarılmadığını onayladıktan sonra, `eprintln!` ifadesini kaldırabilirsiniz.

### 5. Güncelleme talimatlarını oluşturma

Sonraki adımda, yapının alanları üzerinde iterasyon yapıp, her alan için bir güncelleme talimatı oluşturabiliriz. Talimat, alanın adı ve tipi ile güncelleme talimatı için yeni bir işlev adı içerecek şekilde `quote!` makrosu kullanılarak oluşturulur.

```rust
use proc_macro::TokenStream;
use quote::*;
use syn::*;

#[proc_macro_derive(InstructionBuilder)]
pub fn instruction_builder(input: TokenStream) -> TokenStream {
    let DeriveInput { ident, data, .. } = parse_macro_input!(input);

    let fields = match data {
        syn::Data::Struct(s) => match s.fields {
            syn::Fields::Named(n) => n.named,
            _ => panic!("The syn::Fields variant is not supported: {:#?}", s.fields),
        },
        _ => panic!("The syn::Data variant is not supported: {:#?}", data),
    };

    let update_instruction = fields.into_iter().map(|f| {
        let name = &f.ident;
        let ty = &f.ty;
        let fname = format_ident!("update_{}", name.clone().unwrap());

        quote! {
            pub fn #fname(ctx: Context<UpdateAdminAccount>, new_value: #ty) -> Result<()> {
                let admin_account = &mut ctx.accounts.admin_account;
                admin_account.#name = new_value;
                Ok(())
            }
        }
    });

    TokenStream::new()
}
```

### 6. Yeni `TokenStream` döndürme

Son olarak, `quote!` makrosunu kullanarak, `ident` değişkeni ile belirtilen adla yapıya ait bir uygulanabilirlik oluşturacağız. Uygulama, yapının her alanı için üretilen güncelleme talimatlarını içerir. Üretilen kod, `into()` yöntemi kullanılarak bir `TokenStream`'e dönüştürülüp, makronun sonucu olarak döndürülür.

```rust
use proc_macro::TokenStream;
use quote::*;
use syn::*;

#[proc_macro_derive(InstructionBuilder)]
pub fn instruction_builder(input: TokenStream) -> TokenStream {
    let DeriveInput { ident, data, .. } = parse_macro_input!(input);

    let fields = match data {
        syn::Data::Struct(s) => match s.fields {
            syn::Fields::Named(n) => n.named,
            _ => panic!("The syn::Fields variant is not supported: {:#?}", s.fields),
        },
        _ => panic!("The syn::Data variant is not supported: {:#?}", data),
    };

    let update_instruction = fields.into_iter().map(|f| {
        let name = &f.ident;
        let ty = &f.ty;
        let fname = format_ident!("update_{}", name.clone().unwrap());

        quote! {
            pub fn #fname(ctx: Context<UpdateAdminAccount>, new_value: #ty) -> Result<()> {
                let admin_account = &mut ctx.accounts.admin_account;
                admin_account.#name = new_value;
                Ok(())
            }
        }
    });

    let expanded = quote! {
        impl #ident {
            #(#update_instruction)*
        }
    };
    expanded.into()
}
```

:::danger
Makronun doğru kodu ürettiğini doğrulamak için `cargo expand` komutunu kullanarak makronun genişletilmiş halini görebilirsiniz. Aşağıdaki gibi bir çıktısı olacaktır:
:::

```rust
use anchor_lang::prelude::*;
use custom_macro::InstructionBuilder;
pub struct Config {
    pub auth: Pubkey,
    pub bool: bool,
    pub first_number: u8,
    pub second_number: u64,
}
impl Config {
    pub fn update_auth(
        ctx: Context<UpdateAdminAccount>,
        new_value: Pubkey,
    ) -> Result<()> {
        let admin_account = &mut ctx.accounts.admin_account;
        admin_account.auth = new_value;
        Ok(())
    }
    pub fn update_bool(ctx: Context<UpdateAdminAccount>, new_value: bool) -> Result<()> {
        let admin_account = &mut ctx.accounts.admin_account;
        admin_account.bool = new_value;
        Ok(())
    }
    pub fn update_first_number(
        ctx: Context<UpdateAdminAccount>,
        new_value: u8,
    ) -> Result<()> {
        let admin_account = &mut ctx.accounts.admin_account;
        admin_account.first_number = new_value;
        Ok(())
    }
    pub fn update_second_number(
        ctx: Context<UpdateAdminAccount>,
        new_value: u64,
    ) -> Result<()> {
        let admin_account = &mut ctx.accounts.admin_account;
        admin_account.second_number = new_value;
        Ok(())
    }
}
```

### 7. Programı yeni makronuzu kullanacak şekilde güncelleyin

Yeni makroyu kullanarak `Config` yapısı için güncelleme talimatlarını üretmek için, önce programın `Cargo.toml` dosyasına `custom-macro` crate'ini bağımlılık olarak ekleyin:

```text
[dependencies]
anchor-lang.workspace = true
custom-macro = { path = "../../custom-macro" }
```

Ardından `state.rs` dosyasına gidin ve şu kodla güncelleyin:

```rust
use crate::admin_update::UpdateAdminAccount;
use anchor_lang::prelude::*;
use custom_macro::InstructionBuilder;

#[derive(InstructionBuilder)]
#[account]
pub struct Config {
    pub auth: Pubkey,
    pub bool: bool,
    pub first_number: u8,
    pub second_number: u64,
}

impl Config {
    pub const LEN: usize = Config::DISCRIMINATOR.len() + Config::INIT_SPACE;
}
```

Sonrasında `admin_update.rs` dosyasına gidin ve mevcut güncelleme talimatlarını silin; dosyada yalnızca `UpdateAdminAccount` bağlam yapısını bırakın.

```rust
use crate::state::Config;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateAdminAccount<'info> {
    pub auth: Signer<'info>,
    #[account(
        mut,
        has_one = auth,
    )]
    pub admin_account: Account<'info, Config>,
}
```

Ardından, programda `lib.rs` dosyasını `InstructionBuilder` makrosu tarafından üretilen güncelleme talimatlarını kullanacak şekilde güncelleyin.

```rust
use anchor_lang::prelude::*;
mod admin_config;
use admin_config::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod admin {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Initialize::initialize(ctx)
    }

    pub fn update_auth(ctx: Context<UpdateAdminAccount>, new_value: Pubkey) -> Result<()> {
        Config::update_auth(ctx, new_value)
    }

    pub fn update_bool(ctx: Context<UpdateAdminAccount>, new_value: bool) -> Result<()> {
        Config::update_bool(ctx, new_value)
    }

    pub fn update_first_number(ctx: Context<UpdateAdminAccount>, new_value: u8) -> Result<()> {
        Config::update_first_number(ctx, new_value)
    }

    pub fn update_second_number(ctx: Context<UpdateAdminAccount>, new_value: u64) -> Result<()> {
        Config::update_second_number(ctx, new_value)
    }
}
```

Son olarak, `admin` dizinine gidin ve `anchor test` çalıştırarak `InstructionBuilder` makrosu tarafından üretilen güncelleme talimatlarının doğru bir şekilde çalıştığını doğrulayın.

```
 admin
 ✔ İnitilize edildi! (160ms)
 ✔ Bool güncellendi! (409ms)
 ✔ u8 güncellendi! (403ms)
 ✔ u64 güncellendi! (406ms)
 ✔ Admin güncellendi! (405ms)

 5 geçerli (2s)
```

:::success
Güzel iş çıkardınız! Artık, geliştirme sürecinize yardımcı olacak işlemsel makrolar oluşturabilirsiniz. Rust dilinin imkanlarından en iyi şekilde yararlanmanızı teşvik ediyoruz; mantıklı olduğunda makroları kullanın. Ama bunların nasıl çalıştığını bilmiyorsanız bile, Anchor'ın altında neler olup bittiğini anlamanıza yardımcı olur.
:::

Çözüm kodu ile daha fazla zamana ihtiyacınız varsa, [anchor-custom-macro](https://github.com/solana-developers/anchor-custom-macro/tree/solution) deposunun `solution` dalını referans alın.

## Meydan Okuma

Öğrendiklerinizi pekiştirmek için: Başka bir işlemsel makro oluşturun. Yazdığınız ve bir makro tarafından azaltılabilir veya geliştirilebilecek kodları düşünün ve deneyin! Bu hâlâ bir pratik olduğu için, istediğiniz gibi çıkmazsa sorun değil. Hemen başlayın ve deneyin!


Kodunuzu GitHub'a yükleyin ve
[bize bu dersi nasıl bulduğunuzu söyleyin](https://form.typeform.com/to/IPH0UGz7#answers-lesson=eb892157-3014-4635-beac-f562af600bf8)!
