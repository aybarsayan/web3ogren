## Yorumlar

Tüm programcılar kodlarını anlaşılır hale getirmeye çalışır, ancak bazen ek açıklamaya ihtiyaç duyulur. Bu durumlarda, programcılar kaynak kodlarında derleyicinin göz ardı edeceği *yorumlar* bırakır; ancak kaynak kodu okuyan insanlar bu yorumları faydalı bulabilir.

:::tip
Yorumlar, kodu daha anlaşılır kılmak için önemli bir araçtır. 
:::

İşte basit bir yorum:

```rust
// merhaba, dünya
```

Rust'ta, yerleşik yorum stili bir yorumu iki eğik çizgi ile başlatır ve yorum, satırın sonuna kadar devam eder. Tek satırı aşan yorumlar için, her satırda `//` eklemeniz gerekir, şöyle:

```rust
// Burada karmaşık bir şey yapıyoruz, yeterince uzun ki bunu
// yapmak için birden fazla yorum satırına ihtiyacımız var! Of! Umarım,
// bu yorum neler olduğunu açıklar.
```

Yorumlar ayrıca kod içeren satırların sonunda da yer alabilir:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-24-comments-end-of-line/src/main.rs}}
```

Ancak genellikle bu formatta, yorum kodunun üzerinde ayrı bir satırda görünür:

Dosya Adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-25-comments-above-line/src/main.rs}}
```

:::info
Rust ayrıca belge yorumları olan başka bir yorum türüne sahiptir; bunu [“Crates.io’ya Bir Krate Yayınlama”][publishing] bölümünde 14. Bölüm'de tartışacağız.
:::

[publishing]: ch14-02-publishing-to-crates-io.html