## Ek B: Operatörler ve Semboller

Bu ek, Rust’ın sözdizimi ile ilgili bir sözlük içermektedir; operatörler ve  
kendi başlarına veya yollar, generikler, trait sınırlamaları, makrolar, özellikler, yorumlar, demetler ve köşeli parantezler bağlamında görünen diğer semboller de dahil.

### Operatörler

Tablo B-1, Rust'taki operatörleri, operatörün bağlamda nasıl görüneceğine dair bir örneği, kısa bir açıklamayı ve o operatörün aşırı yüklenebilir olup olmadığını içermektedir. Eğer bir operatör aşırı yüklenebilir ise, o operatörün aşırı yüklenmesi için kullanılacak ilgili trait listelenmiştir.

Tablo B-1: Operatörler

| Operatör | Örnek | Açıklama | Aşırı Yüklenebilir mi? |
|----------|-------|----------|------------------------|
| `!` | `ident!(...)`, `ident!{...}`, `ident![...]` | Makro genişletme | |
| `!` | `!expr` | Bit düzeyinde veya mantıksal tamamlayıcı | `Not` |
| `!=` | `expr != expr` | Eşitsizlik karşılaştırması | `PartialEq` |
| `%` | `expr % expr` | Aritmetik kalan | `Rem` |
| `%=` | `var %= expr` | Aritmetik kalan ve atama | `RemAssign` |
| `&` | `&expr`, `&mut expr` | Borçlanma | |
| `&` | `&type`, `&mut type`, `&'a type`, `&'a mut type` | Borçlanan işaretçi türü | |
| `&` | `expr & expr` | Bit düzeyinde VE | `BitAnd` |
| `&=` | `var &= expr` | Bit düzeyinde VE ve atama | `BitAndAssign` |
| `&&` | `expr && expr` | Kısa devre mantıksal VE | |
| `*` | `expr * expr` | Aritmetik çarpma | `Mul` |
| `*=` | `var *= expr` | Aritmetik çarpma ve atama | `MulAssign` |
| `*` | `*expr` | Dereference | `Deref` |
| `*` | `*const type`, `*mut type` | Ham işaretçi | |
| `+` | `trait + trait`, `'a + trait` | Bileşik tür kısıtlaması | |
| `+` | `expr + expr` | Aritmetik toplama | `Add` |
| `+=` | `var += expr` | Aritmetik toplama ve atama | `AddAssign` |
| `,` | `expr, expr` | Argüman ve eleman ayırıcı | |
| `-` | `- expr` | Aritmetik negatifleme | `Neg` |
| `-` | `expr - expr` | Aritmetik çıkarma | `Sub` |
| `-=` | `var -= expr` | Aritmetik çıkarma ve atama | `SubAssign` |
| `->` | `fn(...) -> type`, &vert;...&vert; -> type | Fonksiyon ve closure dönüş tipi | |
| `.` | `expr.ident` | Üye erişimi | |
| `..` | `..`, `expr..`, `..expr`, `expr..expr` | Sağ dışlayıcı aralık ifadesi | `PartialOrd` |
| `..=` | `..=expr`, `expr..=expr` | Sağ dahil aralık ifadesi | `PartialOrd` |
| `..` | `..expr` | Struct literal güncelleme sözdizimi | |
| `..` | `variant(x, ..)`, `struct_type { x, .. }` | “Ve geri kalanı” model bağlama | |
| `...` | `expr...expr` | (Kullanımdan kaldırıldı, bunun yerine `..=` kullanın) Bir modelde: dahil aralık modeli | |
| `/` | `expr / expr` | Aritmetik bölme | `Div` |
| `/=` | `var /= expr` | Aritmetik bölme ve atama | `DivAssign` |
| `:` | `pat: type`, `ident: type` | Kısıtlamalar | |
| `:` | `ident: expr` | Struct alan başlatıcısı | |
| `:` | `'a: loop {...}` | Döngü etiketi | |
| `;` | `expr;` | İfade ve öğe sonlandırıcı | |
| `;` | `[...; len]` | Sabit boyutlu dizi sözdizimi parçası | |
| `` | `pat => expr` | Eşleşme kolu sözdiziminin bir kısmı | |
| `>` | `expr > expr` | Büyükten karşılaştırma | `PartialOrd` |
| `>=` | `expr >= expr` | Büyük veya eşit karşılaştırma | `PartialOrd` |
| `>>` | `expr >> expr` | Sağdan kaydırma | `Shr` |
| `>>=` | `var >>= expr` | Sağdan kaydırma ve atama | `ShrAssign` |
| `@` | `ident @ pat` | Model bağlama | |
| `^` | `expr ^ expr` | Bit düzeyinde ayrı veya | `BitXor` |
| `^=` | `var ^= expr` | Bit düzeyinde ayrı veya ve atama | `BitXorAssign` |
| `?` | `expr?` | Hata yayılma | |

### Operatör Olmayan Semboller

Aşağıdaki liste, operatör olarak işlev görmeyen tüm sembolleri içerir; yani, bir işlev veya metod çağrısı gibi davranmazlar.

Tablo B-2, kendi başlarına görünen ve çeşitli yerlerde geçerli olan sembolleri göstermektedir.

Tablo B-2: Tek Başına Sözdizimi

| Sembol | Açıklama |
|--------|----------|
| `'ident` | İsimlendirilmiş yaşam süresi veya döngü etiketi |
| `...u8`, `...i32`, `...f64`, `...usize`, vb. | Belirli türde sayısal literal |
| `"..."` | Dize literal |
| `r"..."`, `r#"..."#`, `r##"..."##`, vb. | Ham dize literal, kaçış karakterleri işlenmez |
| `b"..."` | Bayt dize literal; bir dizi bayt oluşturur, dize yerine |
| `br"..."`, `br#"..."#`, `br##"..."##`, vb. | Ham bayt dize literal, ham ve bayt dize literal birleşimi |
| `'...'` | Karakter literal |
| `b'...'` | ASCII bayt literal |
|&vert;...&vert; expr | Closure |
| `!` | Her zaman dallanan fonksiyonlar için boş dip türü |
| `_` | “Göz ardı” edilen model bağlaması; ayrıca tam sayılı literal'leri okunabilir kılmak için kullanılır |

Tablo B-3, bir öğeye doğru modül hiyerarşisi boyunca bir yol bağlamında görünen sembolleri göstermektedir.

Tablo B-3: Yol ile İlgili Sözdizimi

| Sembol | Açıklama |
|--------|-------------|
| `ident::ident` | Ad alanı yolu |
| `::path` | Tüm diğer crate'lerin kök aldığı dış prelude'a göre yol (yani, crate adını içeren açıkça mutlak yol) |
| `self::path` | Mevcut modüle göre yol (yani, açıkça göreli bir yol). |
| `super::path` | Mevcut modülün ebeveynine göre yol |
| `type::ident`, `::ident` | İlişkili sabitler, fonksiyonlar ve türler |
| `::...` | Doğrudan isimlendirilemeyen bir türün ilişkili öğesi (örneğin, `::...`, `::...`, vb.) |
| `trait::method(...)` | Bir metod çağrısını tanımlayan trait'yi isimlendirerek ayırt etme |
| `type::method(...)` | Tanımlandığı türü isimlendirerek bir metod çağrısını ayırt etme |
| `::method(...)` | Trait ve türü isimlendirerek bir metod çağrısını ayırt etme |

Tablo B-4, genel tür parametrelerini kullanmanın bağlamında görünen sembolleri göstermektedir.

Tablo B-4: Generikler

| Sembol | Açıklama |
|--------|-------------|
| `path` | Bir türde genel tür için parametreleri belirtir (örneğin, `Vec`) |
| `path::`, `method::` | Bir ifadede genel tür, fonksiyon veya metoda parametreleri belirtir; genellikle turbo fish olarak adlandırılır (örneğin, `"42".parse::()`) |
| `fn ident ...` | Genel fonksiyon tanımlama |
| `struct ident ...` | Genel yapı tanımlama |
| `enum ident ...` | Genel enum tanımlama |
| `impl ...` | Genel uygulama tanımlama |
| `for type` | Daha yüksek sıralı yaşam süresi sınırları |
| `type` | Bir veya daha fazla ilişkili türün belirli atamaları olan genel tür (örneğin, `Iterator`) |

Tablo B-5, trait sınırları ile genel tür parametrelerini kısıtlamanın bağlamında görünen sembolleri göstermektedir.

Tablo B-5: Trait Sınır Kısıtlamaları

| Sembol | Açıklama |
|--------|-------------|
| `T: U` | Genel parametre `T`, `U`'yu uygulayan türlerle kısıtlıdır |
| `T: 'a` | Genel tür `T`, yaşam süresi `'a`'yı aşmalıdır (yani tür, `'a`'dan daha kısa yaşam sürelerine sahip referanslar içeremez) |
| `T: 'static` | Genel tür `T`, yalnızca `'static` olan referanslar içerir |
| `'b: 'a` | Genel yaşam süresi `'b`, yaşam süresi `'a`'dan uzun olmalıdır |
| `T: ?Sized` | Genel tür parametresinin dinamik olarak boyutlandırılmış bir tür olmasına izin ver |
| `'a + trait`, `trait + trait` | Bileşik tür kısıtlaması |

Tablo B-6, makroları çağırma veya tanımlama ve bir öğeye özellikler belirtme bağlamında görünen sembolleri göstermektedir.

Tablo B-6: Makrolar ve Özellikler

| Sembol | Açıklama |
|--------|-------------|
| `#[meta]` | Dış özellik |
| `#![meta]` | İç özellik |
| `$ident` | Makro ikamesi |
| `$ident:kind` | Makro yakalama |
| `$(…)…` | Makro tekrarı |
| `ident!(...)`, `ident!{...}`, `ident![...]` | Makro çağrısı |

Tablo B-7, yorumlar oluşturan sembolleri göstermektedir.

Tablo B-7: Yorumlar

| Sembol | Açıklama |
|--------|-------------|
| `//` | Satır yorumu |
| `//!` | İç satır belge yorumu |
| `///` | Dış satır belge yorumu |
| `/*...*/` | Blok yorumu |
| `/*!...*/` | İç blok belge yorumu |
| `/**...*/` | Dış blok belge yorumu |

Tablo B-8, demetleri kullanma bağlamında görünen sembolleri göstermektedir.

Tablo B-8: Demetler

| Sembol | Açıklama |
|--------|-------------|
| `()` | Boş demet (aka birim), hem literal hem de tür |
| `(expr)` | Parantez içine alınmış ifade |
| `(expr,)` | Tek elemanlı demet ifadesi |
| `(type,)` | Tek elemanlı demet türü |
| `(expr, ...)` | Demet ifadesi |
| `(type, ...)` | Demet türü |
| `expr(expr, ...)` | Fonksiyon çağrı ifadesi; demet `struct`'larını ve demet `enum` varyantlarını başlatmak için de kullanılır |
| `expr.0`, `expr.1`, vb. | Demet dizinleme |

Tablo B-9, süslü parantezlerin kullanıldığı bağlamları göstermektedir.

Tablo B-9: Süslü Parantezler

| Bağlam | Açıklama |
|--------|-------------|
| `{...}` | Blok ifadesi |
| `Type {...}` | `struct` literal |

Tablo B-10, köşeli parantezlerin kullanıldığı bağlamları göstermektedir.

Tablo B-10: Köşeli Parantezler

| Bağlam | Açıklama |
|--------|-------------|
| `[...]` | Dizi literal |
| `[expr; len]` | `len` kopyaları içeren dizi literal |
| `[type; len]` | `len` örneklerini içeren dizi türü |
| `expr[expr]` | Koleksiyon dizinleme. Aşırı yüklenebilir (`Index`, `IndexMut`) |
| `expr[..]`, `expr[a..]`, `expr[..b]`, `expr[a..b]` | Koleksiyon dizinlemenin koleksiyon dilimlemesi gibi görünmesini sağlamak; "dizin" olarak `Range`, `RangeFrom`, `RangeTo` veya `RangeFull` kullanmak |

--- 

:::tip
**Not:** Yukarıdaki tablolar, Rust'ın operatörleri ve sembolleri hakkında kapsamlı bir bakış sunmaktadır. 
:::note
Her bir operatör veya sembol ile ilgili bilgilere dikkatle göz atın.
:::info
Bilgilerin doğru ve güncel olduğundan emin olun!
    
---