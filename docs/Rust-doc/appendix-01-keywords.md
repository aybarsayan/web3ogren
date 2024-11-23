## Ek A: Anahtar Kelimeler

Aşağıdaki liste, Rust dilinin mevcut veya gelecekteki kullanımları için ayrılmış anahtar kelimeleri içermektedir. Bu nedenle, tanımlayıcılar olarak kullanılamazlar (yalnızca “[Ham Tanımlayıcılar][raw-identifiers]” bölümünde tartışacağımız gibi ham tanımlayıcılar olarak kullanılabilirler). Tanımlayıcılar, fonksiyon, değişken, parametre, yapı alanları, modüller, kütüphaneler, sabitler, makrolar, statik değerler, öznitelikler, türler, özellikler veya yaşam döngülerinin adlarıdır.

[raw-identifiers]: #raw-identifiers

### Halihazırda Kullanımda Olan Anahtar Kelimeler

Aşağıda, işlevsellikleri açıklanan, halihazırda kullanımda olan anahtar kelimelerin bir listesi bulunmaktadır.

* `as` - ilkel tip dönüşümü uygulamak, belirli bir nesneyi içeren özelliği ayırt etmek veya `use` ifadelerinde öğeleri yeniden adlandırmak
* `async` - mevcut işlemi engellemek yerine bir `Future` döndürmek
* `await` - bir `Future`ın sonucu hazır olana kadar yürütmeyi askıya almak
* `break` - döngüyü hemen terketmek
* `const` - sabit öğeler veya sabit ham işaretçiler tanımlamak
* `continue` - bir sonraki döngü yinelemesine devam etmek
* `crate` - bir modül yolu içinde, kütüphane kökünü ifade eder
* `dyn` - bir özellik nesnesine dinamik yönlendirme
* `else` - `if` ve `if let` kontrol akış yapıları için geri dönüş
* `enum` - bir enumeration tanımlamak
* `extern` - bir dış işlevi veya değişkeni bağlamak
* `false` - Boolean yanlış literal
* `fn` - bir işlev veya işlev işaretçisi türü tanımlamak
* `for` - bir yineleyiciden öğeleri döngülemek, bir özelliği uygulamak veya daha yüksek dereceli bir yaşam döngüsü belirtmek
* `if` - bir koşullu ifadenin sonucuna göre dal
* `impl` - özsel veya özellik işlevselliğini uygulamak
* `in` - `for` döngüsü sözdiziminde bir parça
* `let` - bir değişkeni bağlamak
* `loop` - koşulsuz döngü
* `match` - bir değeri desenlerle eşleştirmek
* `mod` - bir modül tanımlamak
* `move` - bir kapanışın tüm yakaladığı değerlerin sahipliğini almasını sağlamak
* `mut` - referanslarda, ham işaretçilerde veya desen bağlamalarında değişkenliği belirtmek
* `pub` - yapı alanlarında, `impl` bloklarında veya modüllerde genel görünürlük belirtmek
* `ref` - referans ile bağlamak
* `return` - işlevden dönmek
* `Self` - tanımladığımız veya uyguladığımız tür için bir tür takma adı
* `self` - yöntem konusu veya mevcut modül
* `static` - global değişken veya program yürütülmesi boyunca süren yaşam döngüsü
* `struct` - bir yapı tanımlamak
* `super` - mevcut modülün üst modülü
* `trait` - bir özellik tanımlamak
* `true` - Boolean doğru literal
* `type` - bir tür takma adı veya ilişkili tür tanımlamak
* `union` - bir [union][union] tanımlamak; yalnızca bir union bildirimi içinde bir anahtar kelimedir
* `unsafe` - güvensiz kod, işlevler, özellikler veya uygulamalar belirtmek
* `use` - sembolleri kullanılabilir hale getirmek
* `where` - bir türü kısıtlayan ifadeleri belirtmek
* `while` - bir ifadenin sonucuna göre koşullu döngü

[union]: ../reference/items/unions.html

### Gelecek Kullanım için Ayrılmış Anahtar Kelimeler

Aşağıdaki anahtar kelimelerin henüz herhangi bir işlevselliği yoktur, ancak Rust tarafından gelecekteki olası kullanımlar için ayrılmıştır.

* `abstract`
* `become`
* `box`
* `do`
* `final`
* `macro`
* `override`
* `priv`
* `try`
* `typeof`
* `unsized`
* `virtual`
* `yield`

### Ham Tanımlayıcılar

*Ham tanımlayıcılar*, anahtar kelimeleri normalde kullanılmalarına izin verilmeyen yerlerde kullanmanıza olanak tanıyan bir sözdizimidir. Bir anahtar kelimeye `r#` ile önek ekleyerek bir ham tanımlayıcı kullanırsınız.

Örneğin, `match` bir anahtar kelimedir. Aşağıdaki işlevi `match` adını kullanarak derlemeye çalıştığınızda:

Dosya Adı: src/main.rs

```rust,ignore,does_not_compile
fn match(needle: &str, haystack: &str) -> bool {
    haystack.contains(needle)
}
```

:::warning
Bu kod aşağıdaki hata mesajını verecektir:
```text
hata: beklenen tanımlayıcı, bulunan anahtar kelime `match`
 --> src/main.rs:4:4
  |
4 | fn match(needle: &str, haystack: &str) -> bool {
  |    ^^^^^ beklenen tanımlayıcı, bulunan anahtar kelime
```
:::

Hata, `match` anahtar kelimesinin işlev tanımlayıcısı olarak kullanılamayacağını gösterir. `match`i bir işlev adı olarak kullanmak için ham tanımlayıcı sözdizimini kullanmanız gerekir, bu şekilde:

Dosya Adı: src/main.rs

```rust
fn r#match(needle: &str, haystack: &str) -> bool {
    haystack.contains(needle)
}

fn main() {
    assert!(r#match("foo", "foobar"));
}
```

:::tip
Bu kod hatasız derlenecektir. İşlev adının tanımındaki `r#` önekine ve `main`de işlev çağrıldığı yere dikkat edin.
:::

Ham tanımlayıcılar, anahtar kelime olan herhangi bir kelimeyi tanımlayıcı olarak kullanmanıza olanak tanır. Bu, tanımlayıcı adlarını seçme özgürlüğü sağlar ve bu kelimelerin anahtar kelime olmadığı başka bir dilde yazılmış programlarla entegre olmanıza da imkan tanır. Ayrıca, ham tanımlayıcılar, kütüphanenizin kullandığı Rust baskısından farklı bir yılda yazılmış kütüphaneleri kullanmanıza olanak tanır.

:::note
Örneğin, `try` 2015 baskısında bir anahtar kelime değil, 2018 baskısında bir anahtar kelimedir. Eğer 2015 baskısını kullanan ve `try` işlevine sahip bir kütüphaneye bağımlıysanız, o işlevi 2018 baskı kodunuzdan çağırmak için ham tanımlayıcı sözdizimi olan `r#try` kullanmanız gerekir. Yıldan daha fazla bilgi için [Ek B][appendix-e] bölümüne bakın.
:::

[appendix-e]: appendix-05-editions.html