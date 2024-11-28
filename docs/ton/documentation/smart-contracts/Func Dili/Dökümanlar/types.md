# Türler

:::info
FunC belgeleri, başlangıçta [@akifoq](https://github.com/akifoq) tarafından yazılmıştır.
:::

FunC'nın aşağıdaki yerleşik türleri vardır.

## Atomik türler

- `int`, 257-bit işaretli tam sayıların türüdür. Varsayılan olarak, taşma kontrolü etkinleştirilmiştir ve bu durum tam sayı taşma istisnalarına yol açar.
- `cell`, TVM hücrelerinin türüdür. TON Blockchain'deki tüm kalıcı veriler, hücre ağaçlarında depolanır. Her hücre, 1023 bit'e kadar rastgele veri ve diğer hücrelere dört adede kadar referans içerir. Hücreler, yığın tabanlı TVM'lerde bellek görevi görür.
- `slice`, hücre dilimlerinin türüdür. Bir hücre bir dilime dönüştürülebilir; ardından hücreden elde edilen veri bitleri ve diğer hücrelere referanslar dilimden yüklenerek elde edilebilir.
- `builder`, hücre inşaatçılarının türüdür. Veri bitleri ve diğer hücrelere referanslar bir inşaatçıda saklanabilir; ardından inşaatçı yeni bir hücreye sonlandırılabilir.
- `tuple`, TVM sonlu dizilerinin türüdür. Tuple, olası olarak farklı olan rastgele değer türlerine sahip en fazla 255 bileşenden oluşan sıralı bir koleksiyondur.
- `cont`, TVM devamlarının türüdür. Devamlar, TVM programlarının yürütme akışını kontrol etmek için kullanılır. FunC açısından oldukça düşük seviyeli bir nesne olmasına rağmen, paradoksal olarak oldukça genel bir yapıdır.

:::tip
Yukarıdaki türlerin her biri, TVM yığınındaki tek bir girişi yalnızca kaplar.
:::

### Boolean türü yokluğu

FunC'da boolean değerler tam sayılar olarak temsil edilir; `false` değeri `0` ile, `true` değeri ise `-1` (binary gösterimde 257 tane bir) ile temsil edilir. Mantıksal işlemler bit düzeyinde işlemler olarak gerçekleştirilir. Bir koşul kontrol edildiğinde, sıfır olmayan her tam sayı `true` değeri olarak kabul edilir.

### Null değerler

TVM türü `Null` olan `null` değeri, FunC'de bazı atomik türlerin değerinin yokluğunu temsil eder. Standart kütüphaneden bazı temel türler, atomik tür döndüren bir tür olarak tanımlanmış olabilir ve aslında bazı durumlarda `null` dönebilir. Diğerleri ise atomik tür hariç bir değere sahip olarak tanımlanmış, ancak `null` değerleri ile de çalışabilir. Bu tür bir davranış, ilkel tanımda açıkça belirtilmiştir. Varsayılan olarak, `null` değerleri yasaktır ve çalışma zamanı istisnasına yol açar.

:::warning
Bu şekilde, atomik tür `A` dolaylı olarak tür `A^?` ya da diğer adıyla `Maybe A`'ya dönüştürülebilir (tip kontrolörü bu tür bir dönüşüme kayıtsızdır).
:::

## Hole türü

FunC, tür çıkarımı desteğine sahiptir. Türler `_` ve `var`, tür kontrolü sırasında daha sonra doldurulabilecek tür "deliklerini" temsil eder. Örneğin, `var x = 2;` ifadesi, `2`'ye eşit olan değişken `x` tanımlamasıdır. Tür kontrolörü, `x`'in `int` türüne sahip olduğunu çıkarabilir, çünkü `2`'nin türü `int`'dir ve atamanın sol ve sağ taraflarının eşit türlere sahip olması gerekmektedir.

## Bileşik türler

Türler, daha karmaşık türler oluşturmak için birleştirilebilir.

### İşlevsel tür

`A -> B` biçimindeki türler, belirli bir alan ve karşı alan ile tanımlanan işlevleri temsil eder. Örneğin, `int -> cell` türü, bir tam sayı argümanı alan ve bir TVM hücresi döndüren işlevin türüdür.

İçsel olarak, bu türlerin değerleri devamlar olarak temsil edilir.

### Tensör türler

`(A, B, ...)` biçimindeki türler, esasen, `A`, `B`, ... türlerinden oluşan değerlerin sıralı koleksiyonlarını temsil eder ve bu koleksiyonlar beraberinde birden fazla TVM yığın girişini kaplar.

Örneğin, `foo` işlevinin türü `int -> (int, int)` ise, bu, işlevin bir tam sayı aldığını ve bunlardan bir çift döndürdüğünü gösterir.

:::note
Bu işlevin çağrısı, `(int a, int b) = foo(42);` şeklinde görünebilir. İçsel olarak, işlev bir yığın girişini tüketir ve iki giriş bırakır.
:::

Düşük seviyeli bir bakış açısıyla, `(int, (int, int))` türündeki `(2, (3, 9))` değeri ve `(int, int, int)` türündeki `(2, 3, 9)` değeri, üç yığın girişi olarak `2`, `3` ve `9` şeklinde aynı şekilde temsil edilir. FunC tür kontrolörü için bunlar **farklı** türlerin değerleridir. Örneğin, `(int a, int b, int c) = (2, (3, 9));` kodu derlenmeyecektir.

Tensör türünün özel bir durumu, **birim tür** `()`'dir. Genellikle, bir işlevin herhangi bir değer döndürmediğini veya hiç argümanı olmadığını temsil etmek için kullanılır. Örneğin, bir `print_int` işlevinin türü `int -> ()` iken, `random` işlevinin türü `() -> int`'dir. 0 yığın girişi kaplayan tek bir sakini `()`'dur.

`(A)` biçimindeki tür, tür kontrolörü tarafından `A` türüyle aynı tür olarak kabul edilir.

### Tuple türleri

`[A, B, ...]` biçimindeki türler, başlangıçta bilinen belirli uzunluk ve bileşen türlerine sahip TVM tuplelarını temsil eder. Örneğin, `[int, cell]` türü, uzunluğu tam olarak 2 olan ve birinci bileşeni bir tam sayı, ikinci bileşeni bir hücre olan TVM tuple türüdür. `[]` boş tupleların türüdür (tek sakini—boş tuple). Birim tür `()` ile karşılaştırıldığında, `[]` değerinin bir yığın girişi kapladığına dikkat edilmelidir.

## Tür değişkenleri ile polimorfizm

FunC, polimorfik işlevler için destek sağlayan Miller-Rabin tür sistemine sahiptir. Örneğin, aşağıdaki işlev:
```func
forall X -> (X, X) duplicate(X value) {
  return (value, value);
}
```
bir polimorfik işlevdir ve tek bir yığın girişi değerini alır ve bu değerin iki kopyasını döndürür. `duplicate(6)` değeri `6 6` döndürecek, `duplicate([])` değeri ise boş tuple'nın iki kopyası `[] []` döndürecektir.

:::tip
Bu örnekte, `X` bir tür değişkenidir.
:::

Bu konudaki daha fazla bilgiyi `fonksiyonlar` bölümünde bulabilirsiniz.

## Kullanıcı tanımlı türler

Şu anda, FunC, yukarıda tanımlanan tür yapıları dışında tür tanımlamayı desteklememektedir.

## Tür genişliği

Her tür değerinin belirli bir sayıda yığın girişi kapladığına dikkat etmişsinizdir. Eğer türün tüm değerleri için aynı sayıda yığın girişi varsa, bu sayıya **tür genişliği** denir. Polimorfik işlevler şu anda yalnızca sabit ve önceden bilineni tür genişliği olan türler için tanımlanabilir.