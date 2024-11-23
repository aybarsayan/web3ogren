# Fonksiyonlar
FunC programı esasen fonksiyon bildirimi/tanımları ve genel değişken bildirimlerinin bir listesidir. Bu bölüm ilk konuyu kapsamaktadır.

Herhangi bir fonksiyon bildirimi veya tanımı ortak bir desenle başlar ve ardından üç şeyden biri gelir:
- Tek `;`, bu, fonksiyonun henüz tanımlanmadığını belirtir. Daha sonra aynı dosyada veya şu anki dosyadan önce FunC derleyicisine geçen başka bir dosyada tanımlanabilir. Örneğin,
  ```func
  int add(int x, int y);
  ```
  `add` adlı `(int, int) -> int` tipinde bir fonksiyonun basit bir bildirimi.
- Assembler fonksiyon gövde tanımı. Fonksiyonları daha sonraki kullanım için düşük seviyeli TVM ilkeleri ile tanımlamanın yoludur. Örneğin,
  ```func
  int add(int x, int y) asm "ADD";
  ```
  `ADD` TVM opcode'una dönüşecek aynı `add` fonksiyonunun assembler tanımıdır.

- Sıradan blok bildirim fonksiyon gövde tanımı. Fonksiyonları tanımlamanın olağan yoludur. Örneğin,
  ```func
  int add(int x, int y) {
    return x + y;
  }
  ```
  `add` fonksiyonunun sıradan bir tanımıdır.

## Fonksiyon bildirimi
Önceden belirtildiği gibi, herhangi bir fonksiyon bildirimi veya tanımı ortak bir desenle başlar. Aşağıdaki desen şudur:
```func
[<forall declarator>] <return_type> <function_name>(<comma_separated_function_args>) <specifiers>
```
burada `[ ... ]` isteğe bağlı bir kaydı temsil eder.

### Fonksiyon adı
Fonksiyon adı herhangi bir `belirleyici` olabilir ve ayrıca `.` veya `~` sembolleriyle başlayabilir. Bu sembollerin anlamı, ifadeler bölümünde `açıklanmaktadır`.

**Örneğin**, `udict_add_builder?`, `dict_set` ve `~dict_set` geçerli ve farklı fonksiyon adlarıdır. (Bunlar `stdlib.fc` içinde tanımlanmıştır.)

#### Özel fonksiyon adları
FunC (aslında Fift assembler) birkaç önceden tanımlı `ids` ile rezervlenmiş fonksiyon adı içerir.
- `main` ve `recv_internal` id = 0
- `recv_external` id = -1
- `run_ticktock` id = -2

Her program, id 0'a sahip bir fonksiyon, yani `main` veya `recv_internal` fonksiyonuna sahip olmalıdır. `run_ticktock`, özel akıllı sözleşmelerin ticktock işlemlerinde çağrılır.

#### İçsel alma

`recv_internal`, bir akıllı sözleşmenin gelen bir iç mesajı aldığında çağrılır. `TVM başlatıldığında` bazı değişkenler yığında bulunur; `recv_internal` içinde argümanlar ayarlayarak, akıllı sözleşme koduna bunlardan bazıları hakkında bilgi vermiş oluruz. Kodun bilmediği argümanlar, yığın içinde en altta hiç dokunulmadan kalacaktır.

:::note
Yani, aşağıdaki her `recv_internal` bildirimi doğrudur, ancak daha az değişken içerenler biraz daha az gaz harcayacaktır (her kullanılmayan argüman ek bir `DROP` talimatı ekler).
:::

```func

() recv_internal(int balance, int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(cell in_msg_cell, slice in_msg) {}
() recv_internal(slice in_msg) {}
```

#### Dışsal alma

`recv_external`, gelen dış mesajlar içindir.

### Dönüş tipi
Dönüş tipi, `tipler` bölümünde açıklandığı gibi herhangi bir atomik veya bileşen tipi olabilir. Örneğin,
```func
int foo();
(int, int) foo'();
[int, int] foo''();
(int -> int) foo'''();
() foo''''();
```
geçerli fonksiyon bildirimleridir.

Tip çıkarımı da mümkündür. Örneğin,
```func
_ pyth(int m, int n) {
  return (m * m - n * n, 2 * m * n, m * m + n * n);
}
```
`(int, int) -> (int, int, int)` tipinde bir `pyth` fonksiyonunun geçerli tanımıdır ve Pisagor üçlülerini hesaplar.

### Fonksiyon argümanları
Fonksiyon argümanları virgülle ayrılır. Bir argümanın geçerli bildirimleri şunlardır:
- Olağan bildirim: tip + ad. Örneğin, `int x`, `() foo(int x);` fonksiyon bildiriminde `int` tipinde ve `x` adıyla bir argüman bildirimi.
- Kullanılmayan argüman bildirimi: sadece tip. Örneğin,
  ```func
  int first(int x, int) {
    return x;
  }
  ```
  `(int, int) -> int` tipinde geçerli bir fonksiyon tanımıdır.
- Çıkarımlı tip bildirimi olan argüman: yalnızca isim.
  Örneğin,
  ```func
  int inc(x) {
    return x + 1;
  }
  ```
  `int -> int` tipinde geçerli bir fonksiyon tanımıdır. `x` türünün `int` olduğu tip kontrolörü tarafından çıkarım yoluyla belirlenmiştir.

Bir fonksiyon çoklu argümanlar içindeymiş gibi görünebilir, ancak aslında tek bir `tensor-tipi` argümanı içerir. Farkı görmek için lütfen `fonksiyon uygulaması` bölümüne başvurun. Yine de, argüman tensorunun bileşenleri geleneksel olarak fonksiyon argümanları olarak adlandırılır.

### Fonksiyon çağrıları

#### Değiştirmeyen yöntemler

:::info
Değiştirmeyen fonksiyon, `.`, ile kısa fonksiyon çağrı formunu destekler.
:::

```func
example(a);
a.example();
```

Eğer bir fonksiyon en az bir argümana sahipse, değiştirmeyen bir yöntem olarak çağrılabilir. 

**Örneğin**, `store_uint` `(builder, int, int) -> builder` tipindedir (ikinci argüman, saklanacak değerdir ve üçüncüsü bit uzunluğudur). `begin_cell`, yeni bir builder oluşturan bir fonksiyondur. Aşağıdaki kodlar eşdeğerdir:
```func
builder b = begin_cell();
b = store_uint(b, 239, 8);
```
```func
builder b = begin_cell();
b = b.store_uint(239, 8);
```
Yani, bir fonksiyonun ilk argümanı, fonksiyon adından önce `.` ile ayrılarak geçilebilir. Kod daha da basitleştirilebilir:
```func
builder b = begin_cell().store_uint(239, 8);
```
Birden fazla yöntem çağrısı da mümkündür:
```func
builder b = begin_cell().store_uint(239, 8)
                        .store_int(-1, 16)
                        .store_uint(0xff, 10);
```

#### Değiştiren fonksiyonlar
:::info
Değiştiren fonksiyon `~` ve `.` operatörleri ile kısa formu destekler.
:::

Fonksiyonun ilk argümanı `A` tipinde ve dönüş değeri `(A, B)` şeklindeyse (burada `B` herhangi bir tiptir) fonksiyon değiştiren yöntem olarak çağrılabilir.

Değiştiren fonksiyon çağrıları bazı argümanlar alabilir ve bazı değerler dönebilir, ancak ilk argümanlarını değiştirirler; yani, döndürülen değerin ilk bileşenini ilk argümandaki değişkene atarız. 
```func
a~example();
a = example(a);
```

**Örneğin**, `cs` bir hücre dilimi ve `load_uint` `(slice, int) -> (slice, int)` tipindedir: bir hücre dilimi ve yüklenmesi gereken bit sayısını alır ve dilimin geri kalanını ve yüklenen değeri döner. Aşağıdaki kodlar eşdeğerdir:
```func
(cs, int x) = load_uint(cs, 8);
```
```func
(cs, int x) = cs.load_uint(8);
```
```func
int x = cs~load_uint(8);
```
Bazı durumlarda, herhangi bir değer döndürmeyen ve yalnızca ilk argümanını değiştiren bir fonksiyonu değiştiren yöntem olarak kullanmak isteriz. Bunu, birimler kullanarak şu şekilde yapabiliriz: `int -> int` tipinde bir `inc` fonksiyonu tanımlamak istiyoruz, bu da bir integer'ı artırır ve bunu değiştiren yöntem olarak kullanırız. Bu durumda `inc`'i `int -> (int, ())` tipinde bir fonksiyon olarak tanımlamalıyız:
```func
(int, ()) inc(int x) {
  return (x + 1, ());
}
```
Böyle tanımlandığında, şu şekilde kullanılabilir: 
```func
x~inc();
```

#### `.` ve `~` fonksiyon adlarında
Diyelim ki `inc`'i değiştirmeyen yöntem olarak da kullanmak istiyoruz. Bunu şöyle yazabiliriz:
```func
(int y, _) = inc(x);
```
Ama `inc`'in değiştiren yöntemi olarak tanımını geçersiz kılmak mümkündür.
```func
int inc(int x) {
  return x + 1;
}
(int, ()) ~inc(int x) {
  return (x + 1, ());
}
```
Ve sonra şöyle çağrılabilir:
```func
x~inc();
int y = inc(x);
int z = x.inc();
```
İlk çağrı `x`'i değiştirecektir; ikinci ve üçüncü çağrılar değiştirmeyecektir.

**Özetle**, `foo` adındaki bir fonksiyon, değiştirmeyen veya değiştiren bir yöntem olarak çağrıldığında (yani `.foo` veya `~foo` sözdizimi ile), FunC derleyicisi, böyle bir tanım mevcutsa sırasıyla `.foo` veya `~foo` tanımını kullanır ve eğer yoksa, `foo` tanımını kullanır.

### Belirleyiciler
Üç tür belirleyici vardır: `impure`, `inline`/`inline_ref` ve `method_id`. Bir, birkaç veya hiçbiri bir fonksiyon bildiriminin içinde yer alabilir ancak şu anda doğru sırada sunulmalıdır. Örneğin, `impure`'yi `inline`'dan sonra koymak yasaktır.
#### Kirli belirleyici
`impure` belirleyici, fonksiyonun göz ardı edilemeyecek bazı yan etkileri olabileceği anlamına gelir. Örneğin, fonksiyon sözleşme depolamasını değiştirebiliyorsa, mesajlar gönderebiliyorsa veya bazı veriler geçersiz olduğunda bir istisna fırlatıyorsa ve bu verileri doğrulaması amaçlanıyorsa `impure` belirleyicisini koymalıyız.

Eğer `impure` belirtilmemişse ve fonksiyon çağrısının sonucu kullanılmıyorsa, FunC derleyicisi bu fonksiyon çağrısını silebilir ve silecektir.

**Örneğin**, `stdlib.fc` fonksiyonu
```func
int random() impure asm "RANDU256";
```
olarak tanımlanmıştır. `RANDU256`, rastgele sayı üretecinin iç durumu değiştirdiği için `impure` kullanılır.

#### Inline belirleyici
Eğer bir fonksiyon `inline` belirleyicisine sahip ise, kodu aslında fonksiyonun çağrıldığı her yere yerleştirilir. Rekürsif çağrılar için iç içe geçmiş fonksiyonlar mümkün değildir.

**Örneğin**,
```func
(int) add(int a, int b) inline {
    return a + b;
}
```

`add` fonksiyonu `inline` belirleyicisi ile işaretlendiği için derleyici, `add` çağrılarını `a + b` gerçek kodu ile değiştirerek fonksiyon çağrısının aşamasını önlemeye çalışacaktır.

İşte inline kullanımına dair başka bir örnek, [ICO-Minter.fc](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-minter-ICO.fc#L16) dosyasından alınmıştır:

```func
() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline {
  set_data(begin_cell()
            .store_coins(total_supply)
            .store_slice(admin_address)
            .store_ref(content)
            .store_ref(jetton_wallet_code)
           .end_cell()
          );
}
```

#### Inline_ref belirleyici
`inline_ref` belirleyiciye sahip bir fonksiyonun kodu ayrı bir hücreye konur ve her seferinde fonksiyon çağrıldığında bir `CALLREF` komutu TVM tarafından çalıştırılır. Bu, `inline` ile benzerdir, ancak bir hücre birkaç yerde kopyalanmadan yeniden kullanılabileceğinden, genellikle `inline` yerine `inline_ref` belirleyici kullanmak, fonksiyon yalnızca bir kez çağrılıyorsa verimlidir. `inline_ref`'li fonksiyonların rekürsif çağrıları hala imkansızdır çünkü TVM hücrelerinde döngüsel referanslar yoktur.
#### method_id
Her fonksiyon, çağrılabileceği dahili bir tamsayı id'ye sahiptir. Olağan fonksiyonlar genellikle 1'den başlayarak ardışık tamsayılarla numaralandırılır, ancak sözleşmenin get-method'ları isimlerinin crc16 hashleri ile numaralandırılır. `method_id()` belirleyici, bir fonksiyonun id'sini belirtilen değere ayarlamayı sağlar ve `method_id` varsayılan değeri kullanır: `(crc16() & 0xffff) | 0x10000`. Eğer bir fonksiyon `method_id` belirleyicisine sahipse, o zaman lite-client veya ton-explorer'da ismi ile bir get-method olarak çağrılabilir.

**Örneğin**,
```func
(int, int) get_n_k() method_id {
  (_, int n, int k, _, _, _, _) = unpack_state();
  return (n, k);
}
```
çoklu sözleşme için bir get-method'dur.

### Polimorfizm ve forall
Herhangi bir fonksiyon bildirimi veya tanımından önce `forall` tür değişkeni belirleyici yer alabilir. Aşağıdaki sözdizimine sahiptir:
```func
forall <comma_separated_type_variables_names> ->
```
burada tür değişkeni adı herhangi bir `belirleyici` olabilir. Genellikle büyük harfle adlandırılırlar.

**Örneğin**,
```func
forall X, Y -> [Y, X] pair_swap([X, Y] pair) {
  [X p1, Y p2] = pair;
  return [p2, p1];
}
```
uzunluğu tam olarak 2 olan bir ikili tuple alan bir fonksiyondur, ancak bileşenler içindeki değerlerin herhangi bir (tek yığın girişi) tipindedir ve birbirleriyle yer değiştirirler.

`pair_swap([2, 3])` `[3, 2]` ve `pair_swap([1, [2, 3, 4]])` `[[2, 3, 4], 1]` üretecektir.

Bu örnekte `X` ve `Y`, `tip değişkenleri`dir. Fonksiyon çağrıldığında, tip değişkenleri gerçek tiplerle değiştirilir ve fonksiyonun kodu yürütülür. Fonksiyon polimorfik olmasına rağmen, aslında her tip değişimi için derleyici kodu aynı kalır. Bu, esasen yığın manipülasyonları ilkesinin polimorfizmi ile sağlanır. Şu anda, başka polimorfizm biçimleri (tip sınıfları ile ad-hoc polimorfizm gibi) desteklenmemektedir.

Ayrıca, `X` ve `Y`'nin tip genişliğinin 1 olması gerektiğini belirtmek önemlidir; yani, `X` veya `Y` değerleri tek bir yığın girişini işgal etmelidir. Dolayısıyla `pair_swap` fonksiyonunu `[(int, int), int]` tipi üzerindeki bir tuple ile çağırmak mümkün değildir, çünkü tip `(int, int)` 2 genişliğe sahiptir; yani, 2 yığın girişi işgal eder.

## Assembler fonksiyon gövde tanımı
Yukarıda belirtildiği gibi, bir fonksiyon assembler kodu ile tanımlanabilir. Söz dizimi, bir veya birkaç assembler komutunu temsil eden `asm` anahtar kelimesi ile takip edilen bir dizi dizedir.
**Örneğin**, aşağıdakini tanımlamak mümkündür:
```func
int inc_then_negate(int x) asm "INC" "NEGATE";
```
— bir tamsayıyı artıran ve ardından tersini alan bir fonksiyondur. Bu fonksiyona yapılan çağrılar 2 assembler komutuna `INC` ve `NEGATE` dönüşecektir. Fonksiyonu tanımlamanın alternatif bir yolu:
```func
int inc_then_negate'(int x) asm "INC NEGATE";
```
`INC NEGATE`, FunC tarafından bir assembler komutu olarak kabul edilecektir, ancak bu, Fift assembler'in bunun 2 ayrı komut olduğunu bildiği için kabul edilebilir.

:::info
Assembler komutları listesini burada bulabilirsiniz: `TVM talimatları`.
:::

### Yığın girişlerini yeniden düzenleme
Bazı durumlarda, argümanları assembler fonksiyonuna, assembler komutunun gerektirdiğinden farklı bir sırayla geçmek veya/veya sonucu komutun geri döndürdüğünden farklı bir yığın giriş düzeninde almak isteriz. İlgili yığın ilke ekleyerek yığın düzenini manuel olarak yeniden düzenleyebiliriz, ancak FunC bunu otomatik olarak yapabilir.

:::info
Manuel düzenleme durumunda, argümanlar yeniden düzenlenmiş sırada hesaplanacaktır. Bu davranışı yazmak için `#pragma compute-asm-ltr` kullanın: `compute-asm-ltr`
:::

**Örneğin**, assembler komutu STUXQ bir tamsayı, bir builder ve bir tamsayı alıyorsa, ardından builder'ı ve işlemin başarısını veya başarısızlığını belirten bir tamsayı bayrağını döndürür.
Fonksiyonu şu şekilde tanımlayabiliriz:
```func
(builder, int) store_uint_quite(int x, builder b, int len) asm "STUXQ";
```
Ancak, argümanları yeniden düzenlemek istiyorsak, şu şekilde tanımlayabiliriz:
```func
(builder, int) store_uint_quite(builder b, int x, int len) asm(x b len) "STUXQ";
```
Yani, `asm` anahtar kelimesinden sonra gereken argüman sırasını belirtebilirsiniz.

Ayrıca, dönüş değerlerini de şu şekilde yeniden düzenleyebiliriz:
```func
(int, builder) store_uint_quite(int x, builder b, int len) asm( -> 1 0) "STUXQ";
```
Sayılar döndürülen değerlerin dizinlerine karşılık gelir (0, döndürülen değerler arasında en derin yığın girişidir).

Bu tekniklerin birleştirilmesi de mümkündür.
```func
(int, builder) store_uint_quite(builder b, int x, int len) asm(x b len -> 1 0) "STUXQ";
```

### Çoklu asm'ler
Çoklu assembler komutları veya hatta Fift-kodu parçaları, `"""` ile başlayan ve biten çok satırlı dizeler olarak tanımlanabilir.

```func
slice hello_world() asm """
  "Hello"
  " "
  "World"
  $+ $+ $>s
  PUSHSLICE
""";