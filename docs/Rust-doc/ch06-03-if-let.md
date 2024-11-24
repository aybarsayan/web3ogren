## Kısa Kontrol Akışı `if let` ile

`if let` sözdizimi, bir deseni eşleşen ve geri kalanını göz ardı eden değerleri işlemek için `if` ve `let`'i daha az ayrıntılı bir şekilde birleştirmenizi sağlar. Aşağıdaki 6-6 listesindeki programı düşünün; bu program `config_max` değişkeninde bir `Option` değerine eşleşir, fakat yalnızca değer `Some` çeşidi olduğunda kodu çalıştırmak ister.



```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/listing-06-06/src/main.rs:here}}
```



Eğer değer `Some` ise, `Some` çeşidindeki değeri `max` değişkenine bağlayarak bastırırız. `None` değeri ile bir şey yapmak istemiyoruz. **`match`** ifadesini tatmin etmek için, yalnızca bir çeşidi işledikten sonra `_ => ()` eklememiz gerekiyor; bu, eklemek için sinir bozucu bir gereksiz kod parçasıdır.

:::info
**Not:** Bunun yerine, bunu `if let` kullanarak daha kısa bir şekilde yazabiliriz. Aşağıdaki kod, 6-6 listesindeki `match` ile aynı şekilde davranır:
:::

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-12-if-let/src/main.rs:here}}
```

`if let` sözdizimi, bir deseni ve eşitlik işareti ile ayrılmış bir ifadeyi alır. `match` gibi çalışır; burada ifade `match`'e verilir ve desenin ilk kolu olur. Bu durumda, desen `Some(max)`'dir ve `max`, `Some` içindeki değere bağlanır. Daha sonra `if let` bloğunun gövdesinde `max`'i, ilgili `match` kolunda kullandığımız şekilde kullanabiliriz. `if let` bloğundaki kod, eğer değer desene uymazsa çalıştırılmaz.

> **Önemli:** `if let` kullanmak, daha az yazma, daha az girinti ve daha az gereksiz kod anlamına gelir. Ancak, `match`'in zorunlu kıldığı kapsamlı kontrolü kaybedersiniz. `match` ile `if let` arasında seçim yapmak, belirli durumunuza ve kısalıktan elde edilen avantajın kapsamlı kontrolü kaybetmek için uygun bir değiş-tokuş olup olmadığını düşündüğünüzde değişir.
> 
> — Rust Geliştirici

Diğer bir deyişle, `if let`'i bir desene uyan değerler için kodu çalıştıran ve diğer tüm değerleri göz ardı eden bir `match`'in sözdizimsel şekeri olarak düşünebilirsiniz.

`if let` ile bir `else` ekleyebiliriz. `else` ile gidecek kod bloğu, `if let` ile eşdeğer olan `match` ifadesindeki `_` durumuna gidecek kod bloğu ile aynıdır. 6-4 listesindeki `Coin` enum tanımını hatırlayın; burada `Quarter` çeşidi ayrıca bir `UsState` değerini de barındırıyordu. Eğer gördüğümüz tüm çeyrek olmayan paraları saymak ve çeyreklerin devletini duyurmak istiyorsak, bunu aşağıdaki gibi bir `match` ifadesi ile yapabiliriz:

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-13-count-and-announce-match/src/main.rs:here}}
```

:::tip
Ya da aşağıdaki gibi bir `if let` ve `else` ifadesi kullanabiliriz:
:::

```rust
{{#rustdoc_include ../listings/ch06-enums-and-pattern-matching/no-listing-14-count-and-announce-if-let-else/src/main.rs:here}}
```

Eğer programınızın mantığının çok ayrıntılı olduğu bir durumunuz varsa, `match` kullanarak ifade etmekte zorlanıyorsanız, `if let`'in Rust aracınızda olduğunu unutmayın.

---

## Özet

Artık özel türler oluşturmak için enum'ları nasıl kullanacağınızı ele aldık; bu türler belirli bir dizi sayılan değerden biri olabilir. Standart kütüphanedeki `Option` türünün hata önlemeye yönelik tür sistemini nasıl kullandığını gösterdik. Enum değerlerinin içinde veri olduğu durumlarda, o değerleri çıkarmak ve kullanmak için gerekli durum sayısına bağlı olarak `match` veya `if let` kullanabilirsiniz.

Rust programlarınız artık yapılandırmalar ve enum'lar kullanarak alanınızdaki kavramları ifade edebilir. API'nizde kullanmak için özel türler oluşturmak, tür güvenliğini garanti eder: derleyici, fonksiyonlarınızın yalnızca her bir fonksiyonun beklediği türde değerleri almasını sağlar.

:::note
Kullanıcılarınıza kullanıcı dostu ve yalnızca ihtiyaç duyacakları şeyleri açığa çıkaran iyi organize edilmiş bir API sağlamak için şimdi Rust'ın modüllerine geçelim.
:::