## Fonksiyonlar

Fonksiyonlar Rust kodunda yaygındır. Bu dilde en önemli fonksiyonlardan birini zaten gördünüz: `main` fonksiyonu, birçok programın giriş noktasıdır. Ayrıca yeni fonksiyonlar tanımlamanızı sağlayan `fn` anahtar kelimesini de gördünüz.

Rust kodu, fonksiyon ve değişken adları için geleneksel stil olan *snake case* kullanır; burada tüm harfler küçük ve alt çizgiler kelimeleri ayırır. İşte bir örnek fonksiyon tanımı içeren bir program:

Dosya adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-16-functions/src/main.rs}}
```

Rust'ta bir fonksiyonu tanımlamak için `fn` yazarak ardından bir fonksiyon adı ve bir dizi parantez gireriz. Süslü parantezler derleyiciye fonksiyon gövdesinin nerede başlayıp nerede bittiğini söyler.

> **Not:** Tanımladığımız herhangi bir fonksiyonu, adını yazarak ve ardından bir dizi parantez ekleyerek çağırabiliriz. `another_function` programda tanımlı olduğu için, `main` fonksiyonunun içinden çağrılabilir. 

Not edin ki, `another_function`'ı kaynak kodunda `main` fonksiyonundan *sonra* tanımladık; aynı zamanda onu önce de tanımlayabilirdik. Rust, fonksiyonlarınızı nerede tanımladığınızla ilgilenmez; yalnızca bir çağrıcı tarafından görülebilecek bir kapsamda tanımlı olmaları gerektiği ile ilgilenir.

Fonksiyonları daha fazla keşfetmek için *functions* adında yeni bir ikili proje başlatalım. `another_function` örneğini *src/main.rs* içine yerleştirin ve çalıştırın. Aşağıdaki çıktıyı görmelisiniz:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-16-functions/output.txt}}
```

---

Satırlar, `main` fonksiyonunda göründükleri sırada yürütülür. Önce "Hello, world!" mesajı yazdırılır, ardından `another_function` çağrılır ve mesajı yazdırılır.

### Parametreler

Fonksiyonları *parametreler* alacak şekilde tanımlayabiliriz; bunlar, bir fonksiyonun imzasının bir parçası olan özel değişkenlerdir. Bir fonksiyon parametreleri olduğunda, o parametreler için somut değerler sağlayabilirsiniz. Teknik olarak, somut değerlere *argüman* denir, ancak gündelik konuşmalarda insanlar genellikle fonksiyon tanımındaki değişkenler veya bir fonksiyonu çağırırken geçilen somut değerler için *parametre* ve *argüman* kelimelerini birbirinin yerine kullanır.

Bu `another_function` sürümünde bir parametre ekliyoruz:

Dosya adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-17-functions-with-parameters/src/main.rs}}
```

Bu programı çalıştırmayı deneyin; aşağıdaki çıktıyı almalısınız:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-17-functions-with-parameters/output.txt}}
```

`another_function` tanımının bir `x` adında bir parametresi vardır. `x`'in tipi `i32` olarak belirtilir. `another_function`'a `5` geçtiğimizde, `println!` makrosu `x`'in bulunduğu çift süslü parantezlerde `5`'i yerleştirir.

> **Dikkat:** Fonksiyon imzalarında her parametrenin tipini *mecburen* tanımlamalısınız. Bu, Rust tasarımındaki kasıtlı bir karardır: fonksiyon tanımlarında tip anotasyonlarına ihtiyaç duymak, derleyicinin kodun diğer yerlerinde ne tür bir tipi kastettiğinizi anlamak için genellikle bunlara ihtiyaç duymamasını sağlar. Derleyici ayrıca fonksiyonun beklediği tipleri bilirse daha yardımcı hata mesajları verebilir.

Birden fazla parametre tanımlarken, parametre tanımlarını virgüllerle ayırın, şu şekilde:

Dosya adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-18-functions-with-multiple-parameters/src/main.rs}}
```

Bu örnek, iki parametreye sahip `print_labeled_measurement` adında bir fonksiyon oluşturur. İlk parametre `value` adını taşır ve bir `i32` türüdür. İkincisi `unit_label` adını taşır ve tipi `char`dır. Fonksiyon daha sonra hem `value` hem de `unit_label`'ı içeren metni yazdırır.

> **Uyarı:** Bu kodu çalıştırmayı deneyelim. Projenizin *src/main.rs* dosyasındaki mevcut programı yukarıdaki örnekle değiştirin ve `cargo run` kullanarak çalıştırın:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-18-functions-with-multiple-parameters/output.txt}}
```

`value` için değer olarak `5` ve `unit_label` için `'h'` ile fonksiyonu çağırdığımız için, program çıktısı bu değerleri içermektedir.

### İfadeler ve Cümleler

Fonksiyon gövdeleri, opsiyonel olarak bir ifade ile sona eren bir dizi cümleden oluşur. Şu ana kadar incelediğimiz fonksiyonlar son bir ifadeyi içermedi, ancak bir ifadeyi bir cümle parçası olarak gördünüz. Rust ifadelere dayalı bir dil olduğu için bu önemli bir ayrım anlamak için önemlidir. 

* **Cümleler**, bir eylemi gerçekleştiren ve bir değer döndürmeyen talimatlardır.
* **İfadeler**, bir sonuç değeri elde eder. Bazı örneklere göz atalım.

Aslında daha önce cümleler ve ifadeler kullandık. Bir değişken oluşturmak ve ona `let` anahtar kelimesi ile bir değer atamak bir cümledir. Liste 3-1'de, `let y = 6;` bir cümledir.



```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/listing-03-01/src/main.rs}}
```



Fonksiyon tanımları da cümlelerdir; tüm önceki örnek kendisi bir cümledir. (Aşağıda göreceğimiz gibi, bir fonksiyonu *çağırmak* bir cümle değildir.)

Cümleler değer döndürmez. Bu nedenle, aşağıdaki kodun denediği gibi bir `let` cümlesini başka bir değişkene atayamazsınız; bir hata alırsınız:

Dosya adı: src/main.rs

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-19-statements-vs-expressions/src/main.rs}}
```

Bu programı çalıştırdığınızda alacağınız hata aşağıdaki gibidir:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-19-statements-vs-expressions/output.txt}}
```

`let y = 6` cümlesi bir değer döndürmez, dolayısıyla `x`'in bağlanacağı bir şey yoktur. Bu durum, C ve Ruby gibi diğer dillerde olan durumlardan farklıdır; burada atama, atamanın değerini döndürür. 

> **İlginç:** Bu dillerde, `x = y = 6` yazarak hem `x` hem de `y`'nin değerinin `6` olmasını sağlayabilirsiniz; bu Rust'ta böyle değildir.

İfadeler, bir değeri değerlendiren ve genellikle Rust'ta yazacağınız kodun geri kalanını oluşturan ifade türleridir. `5 + 6` gibi bir matematiksel işlem, `11` değerine sonuçlanan bir ifadedir. İfadeler cümlelerin bir parçası olabilir: Liste 3-1'de, `let y = 6;` cümlesindeki `6`, `6` değerine değerlendiren bir ifadedir. 

Bir fonksiyonu çağırmak bir ifadedir. Bir makroyu çağırmak bir ifadedir. Örneğin, süslü parantezlerle oluşturulan yeni bir kapsam bloğu bir ifadedir:

Dosya adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-20-blocks-are-expressions/src/main.rs}}
```

Bu ifade:

```rust,ignore
{
    let x = 3;
    x + 1
}
```

bu durumda `4` değerine değerlendiren bir bloktur. O değer, `let` cümlesinin bir parçası olarak `y`'ye bağlanır. Not edin ki, `x + 1` satırının sonunda noktalı virgül yoktur, bu da şimdiye kadar gördüğünüz çoğu satırdan farklıdır. İfadelerde bitiş noktalı virgül bulunmaz. 

> **Uyarı:** Eğer bir ifadeye noktalı virgül eklerseniz, onu bir cümle haline getirirsiniz ve bu durumda bir değer döndürmez. Bunu, fonksiyon dönüş değerlerini ve ifadelerini keşfederken aklınızda bulundurun.

### Dönüş Değerine Sahip Fonksiyonlar

Fonksiyonlar, çağrıldıkları kodlara değerler döndürebilir. Dönüş değerlerine isim vermezken, dönüş türlerini bir ok (`->`) sembolünden sonra tanımlamalıyız. Rust'ta bir fonksiyonun dönüş değeri, fonksiyonun gövdesindeki blok içindeki son ifadenin değeri ile özdeştir. 

> **Dikkat:** Bir fonksiyondan erken dönmek için `return` anahtar kelimesini kullanarak bir değer belirtebilirsiniz, ancak çoğu fonksiyon son ifadeyi örtük olarak döndürür. İşte bir değer döndüren bir fonksiyon örneği:

Dosya adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-21-function-return-values/src/main.rs}}
```

`five` fonksiyonunda fonksiyon çağrıları, makrolar veya hatta `let` cümleleri yoktur—sadece kendisi `5` olan bir sayı vardır. Bu, Rust'ta tamamen geçerli bir fonksiyondur. Fonksiyonun dönüş türünün de `-> i32` olarak belirtildiğini unutmayın. Bu kodu çalıştırmayı deneyin; çıktı aşağıdaki gibi olmalıdır:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-21-function-return-values/output.txt}}
```

`five`'deki `5`, fonksiyonun dönüş değeridir; bu nedenle dönüş türü `i32`dir. Bunu daha ayrıntılı inceleyelim. İki önemli nokta vardır: 

1. İlk olarak, `let x = five();` satırı, bir fonksiyonun dönüş değerini bir değişkeni başlatmak için kullandığımızı gösterir. `five` fonksiyonu `5` döndürdüğü için, bu satır aşağıdaki gibi olur:

   ```rust
   let x = 5;
   ```

2. İkincisi, `five` fonksiyonunun parametreleri yoktur ve dönüş değerinin tipini tanımlar, ancak fonksiyonun gövdesi bir noktada yalnızca `5` ile sonlanır ve bu bir ifadedir, çünkü döndürmek istediğimiz değerdir.

Başka bir örneğe bakalım:

Dosya adı: src/main.rs

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-22-function-parameter-and-return/src/main.rs}}
```

Bu kodu çalıştırmak `The value of x is: 6` yazdıracaktır. Ancak `x + 1` içeren satırın sonuna bir noktalı virgül koyarsak (bunu bir cümle haline getirecek şekilde), bir hata alırız:

Dosya adı: src/main.rs

```rust,ignore,does_not_compile
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-23-statements-dont-return-values/src/main.rs}}
```

Bu kodu derlemek aşağıdaki gibi bir hata üretir:

```console
{{#include ../listings/ch03-common-programming-concepts/no-listing-23-statements-dont-return-values/output.txt}}
```

Ana hata mesajı, `mismatched types`, bu kodun temel sorununu ortaya koymaktadır. `plus_one` fonksiyonunun tanımı, bir `i32` döndüreceğini belirtir; ancak cümleler değer döndürmez, bu da `()` birim tipi ile ifade edilir. Dolayısıyla, hiçbir şey döndürülmez ki bu da fonksiyon tanımına aykırıdır ve bir hataya yol açar. Bu çıktı içerisinde, Rust bu sorunu düzeltmek için bir mesaj sağlar: noktalı virgülü kaldırmayı önerir; bu da hatayı çözecektir.