# Beyanlar
Bu bölüm, sıradan işlev gövdelerinin kodunu oluşturan FunC beyanlarını kısaca tartışmaktadır.

## İfade beyanları
Beyanın en yaygın türü **ifade beyanı**dır. Bir ifadenin ardından `;` gelir. :::note İfadenin tanımı oldukça karmaşık olacağından, burada sadece bir taslak sunulmaktadır. Kural olarak, tüm alt ifadeler soldan sağa hesaplanır; ancak `asm yığın düzenlemesi` gibi bir istisna, sırayı manuel olarak tanımlayabilir.

### Değişken tanımı
Bir yerel değişken tanımlamak için başlangıç değeri tanımlamadan mümkün değildir.

İşte bazı değişken tanım örnekleri:
```func
int x = 2;
var x = 2;
(int, int) p = (1, 2);
(int, var) p = (1, 2);
(int, int, int) (x, y, z) = (1, 2, 3);
(int x, int y, int z) = (1, 2, 3);
var (x, y, z) = (1, 2, 3);
(int x = 1, int y = 2, int z = 3);
[int, int, int] [x, y, z] = [1, 2, 3];
[int x, int y, int z] = [1, 2, 3];
var [x, y, z] = [1, 2, 3];
```
:::tip Unutmayın: Bir değişken aynı kapsamda "yeniden tanımlanabilir". 

Örneğin, bu doğru bir koddur:
```func
int x = 2;
int y = x + 1;
int x = 3;
```
:::info Gerçekte, `int x`'in ikinci görünümü bir tanım değil, yalnızca `x`'in `int` türünde olduğu için derleme zamanı sigortasıdır. Üçüncü satır temelde basit bir atama `x = 3;` ile eşdeğerdir.

İç içe geçmiş kapsamda, bir değişken C dilindeki gibi gerçekten yeniden tanımlanabilir. Örneğin, kodu göz önünde bulundurun:
```func
int x = 0;
int i = 0;
while (i < 10) {
  (int, int) x = (i, i + 1);
  ;; burada x (int, int) türünde bir değişkendir
  i += 1;
}
;; burada x (farklı) bir int türünde değişkendir
```
:::warning Ancak küresel değişkenler `bölümünde` belirtildiği gibi, bir küresel değişken yeniden tanımlanamaz.

Bir değişken tanımının **bir** ifade beyanı olduğunu unutmayın, bu nedenle `int x = 2` gibi yapılar tam anlamıyla ifadeler olarak kabul edilir. Örneğin, bu doğru bir koddur:
```func
int y = (int x = 3) + 1;
```
Bu, sırasıyla `3` ve `4` olan `x` ve `y` adında iki değişkenin tanımıdır.

#### Alt Çizgi
Bir değer gerekmiyorsa alt çizgi `_` kullanılır. Örneğin, bir `foo` işlevinin `int -> (int, int, int)` türünde olduğunu varsayalım. İlk dönen değeri alabilir ve ikinci ve üçüncüyü şu şekilde göz ardı edebiliriz:
```func
(int fst, _, _) = foo(42);
```

### Fonksiyon uygulaması
Bir fonksiyon çağrısı, geleneksel bir dilde olduğu gibi görünür. Fonksiyon çağrısının argümanları fonksiyon adından sonra, virgülle ayrılarak listelenir.
```func
;; varsayalım ki foo (int, int, int) -> int türünde
int x = foo(1, 2, 3);
```
:::info Ancak, `foo` aslında `(int, int, int)` türünde **bir** argümanı olan bir fonksiyondur. Farkı görmek için varsayalım ki `bar` `int -> (int, int, int)` türünde bir fonksiyondur. Geleneksel dillerde olduğu gibi, fonksiyonları şu şekilde birleştirebilirsiniz:
```func
int x = foo(bar(42));
```
benzer ama daha uzun bir form yerine:
```func
(int a, int b, int c) = bar(42);
int x = foo(a, b, c);
```
:::warning Aynı zamanda Haskell tarzı çağrılar da mümkündür, ancak her zaman değil (sonradan düzeltilecek):
```func
;; varsayalım ki foo int -> int -> int -> int türünde
;; yani taşınmış
(int a, int b, int c) = (1, 2, 3);
int x = foo a b c; ;; tamam
;; int y = foo 1 2 3; derlenmeyecek
int y = foo (1) (2) (3); ;; tamam
```

### Lambda ifadeleri
Lambda ifadeleri henüz desteklenmemektedir.

### Yöntem çağrıları

#### Değiştirmeyen yöntemler
Bir fonksiyonun en az bir argümanı varsa, değiştirmeyen bir yöntem olarak çağrılabilir. Örneğin, `store_uint` türü `(builder, int, int) -> builder` olan bir işlevdir (ikinci argüman saklanacak değerdir ve üçüncüsü bit uzunluğudur). `begin_cell` yeni bir oluşturucu oluşturan bir işlevdir. Aşağıdaki kodlar eşdeğerdir:
```func
builder b = begin_cell();
b = store_uint(b, 239, 8);
```
```func
builder b = begin_cell();
b = b.store_uint(239, 8);
```
:::note Bu nedenle, bir fonksiyonun ilk argümanı, fonksiyon adı olmadan önce ayrılarak geçirilebilir, eğer `.` ile ayrılmışsa. Kod daha da basit hale getirilebilir:
```func
builder b = begin_cell().store_uint(239, 8);
```
Birden fazla yöntem çağrısı da mümkündür:
```func
builder b = begin_cell().store_uint(239, 8)
                        .store_int(-1, 16)
                        .store_uint(0xff, 10);
```

#### Değiştiren yöntemler
Bir fonksiyonun ilk argümanı `A` türünde ve fonksiyonun döndürme değeri `(A, B)` biçimindedir; burada `B` bazı rastgele bir türdür, bu durumda fonksiyon değiştiren bir yöntem olarak çağrılabilir. :::tip Değiştiren yöntem çağrıları bazı argümanlar alabilir ve bazı değerler döndürebilir, ancak ilk argümanlarını değiştirir, yani döndürülen değerin ilk bileşenini ilk argümandan gelen bir değişkene atar. Örneğin, varsayalım ki `cs` bir hücre dilimi ve `load_uint` türü `(slice, int) -> (slice, int)` olan bir işlevdir: bu bir hücre dilimini ve yükleme için bit sayısını alır ve dilimin geri kalanını ve yüklenen değeri döndürür. Aşağıdaki kodlar eşdeğerdir:
```func
(cs, int x) = load_uint(cs, 8);
```
```func
(cs, int x) = cs.load_uint(8);
```
```func
int x = cs~load_uint(8);
```
:::warning Bazı durumlarda, herhangi bir değer döndürmeyen ve yalnızca ilk argümanı değiştiren bir işlevi değiştiren bir yöntem olarak kullanmak isteyebiliriz. Bunu, birimler ile aşağıdaki gibi yapabiliriz: Varsayalım ki `int -> int` türünde bir işlev `inc` tanımlamak istiyoruz ve onu bir değiştiren yöntem olarak kullanmak istiyoruz. O zaman `inc`'i `int -> (int, ())` türünde bir işlev olarak tanımlamalıyız:
```func
(int, ()) inc(int x) {
  return (x + 1, ());
}
```
Böyle tanımlandığında, değiştiren bir yöntem olarak kullanılabilir. Aşağıdaki `x`'i artıracaktır.
```func
x~inc();
```

#### `.` ve `~` fonksiyon adlarında
Varsayalım ki `inc`'i bir değiştirmeyen yöntem olarak kullanmak istiyoruz. Bunun gibi bir şey yazabiliriz:
```func
(int y, _) = inc(x);
```
Ancak, `inc` tanımını değiştiren bir yöntem olarak geçersiz kılmak mümkündür.
```func
int inc(int x) {
  return x + 1;
}
(int, ()) ~inc(int x) {
  return (x + 1, ());
}
```
:::tip Ve sonra şu şekilde çağrılabilir:
```func
x~inc();
int y = inc(x);
int z = x.inc();
```
İlk çağrı `x`'i değiştirecektir; ikinci ve üçüncüsü değiştirmeyecektir.

:::info Özetle, `foo` adıyla bir fonksiyon `.foo` veya `~foo` sözdizimi ile değiştirmeyen veya değiştiren bir yöntem olarak çağrıldığında, FunC derleyicisi `.foo` veya `~foo` tanımını kullanır; eğer böyle bir tanım yoksa, `foo` tanımını kullanır.

### Operatörler
Şu anda tüm tekil ve ikili operatörlerin tam sayı operatörleri olduğunu unutmayın. Mantıksal operatörler, bit düzeyinde tam sayı operatörleri olarak temsil edilir (bkz. `boole türünün yokluğu`).

#### Tekil operatörler
İki tane tekil operatör vardır:
- `~` bitwise değil (öncelik 75)
- `-` tam sayı negatif (öncelik 20)

Argümandan ayrılmalıdırlar:
- `- x` tamamdır.
- `-x` tamam değildir (bir tek tanımlayıcıdır)

#### İkili operatörler
Öncelik 30 (soldan sağa):
- `*` tam sayı çarpma
- `/` tam sayı bölme (aşağıya doğru)
- `~/` tam sayı bölme (yuvarlama)
- `^/` tam sayı bölme (yukarıya doğru)
- `%` tam sayı modül bölmesi (aşağıya doğru)
- `~%` tam sayı modül bölmesi (yuvarlama)
- `^%` tam sayı modül bölmesi (yukarıya doğru)
- `/%` bölüm ve kalan döndürür
- `&` bitwise VE

Öncelik 20 (soldan sağa):
- `+` tam sayı toplama
- `-` tam sayı çıkarma
- `|` bitwise VEYA
- `^` bitwise XOR

Öncelik 17 (soldan sağa):
- `>` bitwise sağa kaydırma
- `~>>` bitwise sağa kaydırma (yuvarlama)
- `^>>` bitwise sağa kaydırma (yukarıya doğru)

Öncelik 15 (soldan sağa):
- `==` tam sayı eşitliği kontrolü
- `!=` tam sayı eşitsizliği kontrolü
- `` tam sayı karşılaştırması
- `>=` tam sayı karşılaştırması
- `` tam sayı karşılaştırması (−1, 0 veya 1 döndürür)

Argümandan ayrılmalıdırlar:
- `x + y` tamamdır
- `x+y` tamam değildir (bir tek tanımlayıcıdır)

#### Koşullu operatör
Alışılmış sözdizimine sahiptir.
```func
<koşul> ? <sonuç> : <alternatif>
```
Örneğin:
```func
x > 0 ? x * fac(x - 1) : 1;
```
Öncelik 13'tür.

#### Atamalar
Öncelik 10.

Basit atama `=` ve ikili işlemlerin eşdeğerleri: `+=`, `-=`, `*=`, `/=`, `~/=`, `^/=`, `%=`, `~%=`, `^%=`, `>=`, `~>>=`, `^>>=`, `&=`, `|=`, `^=`.

## Döngüler
FunC `repeat`, `while` ve `do { ... } until` döngülerini destekler. `for` döngüsü desteklenmez.

### Tekrar döngüsü
Sözdizimi `repeat` anahtar kelimesi ve `int` türünde bir ifadeyle başlar. Kod belirtilen sayıda kez tekrarlanır. Örnekler:
```func
int x = 1;
repeat(10) {
  x *= 2;
}
;; x = 1024
```
```func
int x = 1, y = 10;
repeat(y + 6) {
  x *= 2;
}
;; x = 65536
```
```func
int x = 1;
repeat(-1) {
  x *= 2;
}
;; x = 1
```
:::warning Eğer tekrar sayısı `-2^31`'den az veya `2^31 - 1`'den fazla ise, aralık kontrolü istisnası fırlatılır.

### While döngüsü
Alışılmış sözdizimine sahiptir. Örnek:
```func
int x = 2;
while (x < 100) {
  x = x * x;
}
;; x = 256
```
:::info `x < 100` koşulunun gerçeklik değeri `int` türündedir (bkz. `boole türünün yokluğu`).

### Until döngüsü
Aşağıdaki sözdizimine sahiptir:
```func
int x = 0;
do {
  x += 3;
} until (x % 17 == 0);
;; x = 51
```

## If beyanları
Örnekler:
```func
;; alışılmış if
if (flag) {
  do_something();
}
```
```func
;; if (~ flag) ile eşdeğer
ifnot (flag) {
  do_something();
}
```
```func
;; alışılmış if-else
if (flag) {
  do_something();
}
else {
  do_alternative();
}
```
```func
;; bazı özel özellikler
if (flag1) {
  do_something1();
} else {
  do_alternative4();
}
```
:::tip Kıvrım parantezleri gereklidir. O kod derlenmeyecektir:
```func
if (flag1)
  do_something();
```

## Try-Catch beyanları
*Func v0.4.0'dan itibaren mevcuttur*

`try` bloğundaki kodu çalıştırır. Eğer hata olursa, `try` bloğunda yapılan değişiklikleri tamamen geri alır ve bunun yerine `catch` bloğunu çalıştırır; `catch` iki argüman alır: herhangi bir türde istisna parametresi (`x`) ve hata kodu (`n`, integer).

:::warning Birçok diğer dilden farklı olarak, FunC try-catch beyanında, try bloğunda yapılan değişiklikler, özellikle yerel ve küresel değişkenlerin değişimi, tüm kayıt değişiklikleri (yani `c4` depolama kaydı, `c5` eylem/mesaj kaydı, `c7` bağlam kaydı ve diğerleri) **iptal edilmektedir** eğer try bloğunda bir hata varsa ve dolayısıyla tüm sözleşme depolama güncellemeleri ve mesaj gönderimleri geri alınacaktır. 

Önemli bir nokta, bazı TVM durum parametrelerinin _codepage_ ve gaz sayacı gibi geri alınmayacağıdır. Bu, özellikle, try bloğunda harcanan tüm gazın dikkate alınacağı ve gaz limitini değiştiren OP'lerin etkilerinin (`accept_message` ve `set_gas_limit`) korunacağı anlamına gelir.

:::note İstisna parametresinin herhangi bir türde olabileceğini (farklı istisna durumlarında farklı olabileceği) ve dolayısıyla FunC'nin bunu derleme zamanında öngöremeyeceğini unutmayın. Bu, geliştiricinin istisna parametresini bir türe dönüştürerek derleyiciye "yardım" etmesi gerektiği anlamına gelir (aşağıdaki Örnek 2'ye bakın):

Örnekler:
```func
try {
  do_something();
} catch (x, n) {
  handle_exception();
}
```
```func
forall X -> int cast_to_int(X x) asm "NOP";
...
try {
  throw_arg(-1, 100);
} catch (x, n) {
  x.cast_to_int();
  ;; x = -1, n = 100
  return x + 1;
}
```
```func
int x = 0;
try {
  x += 1;
  throw(100);
} catch (_, _) {
}
;; x = 0 (1 değil)
```

## Blok beyanları
Blok beyanları da izinlidir. Yeni bir iç kapsam açarlar:
```func
int x = 1;
builder b = begin_cell();
{
  builder x = begin_cell().store_uint(0, 8);
  b = x;
}
x += 1;
```