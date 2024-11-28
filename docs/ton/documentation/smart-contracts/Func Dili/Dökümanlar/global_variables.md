# Küresel Değişkenler

FunC programı esasen bir dizi fonksiyon bildirimi/tanımı ve küresel değişken bildiriminden oluşur. Bu bölüm ikinci konuyu kapsar.

Bir küresel değişken, `global` anahtar kelimesi ile ardından değişken türü ve değişken adı ile bildirilir. Örneğin,

```func
global ((int, int) -> int) op;

int check_assoc(int a, int b, int c) {
  return op(op(a, b), c) == op(a, op(b, c));
}

int main() {
  op = _+_;
  return check_assoc(2, 3, 9);
}
```

basit bir programdır; bu program küresel işlevsel değişken `op`'a toplama operatörünü `_+_` yazmakta ve üç örnek tam sayının, 2, 3 ve 9, toplamasının eşitliğini kontrol etmektedir.

Dahili olarak, küresel değişkenler TVM'nin c7 kontrol kaydında depolanır.

:::info
Bir küresel değişkenin türü atlanabilir. Bu durumda, değişkenin kullanımı üzerinden çıkarım yapılacaktır.
:::

Örneğin, programı şu şekilde yeniden yazabiliriz:

```func
global op;

int check_assoc(int a, int b, int c) {
  return op(op(a, b), c) == op(a, op(b, c));
}

int main() {
  op = _+_;
  return check_assoc(2, 3, 9);
}
```

Aynı `global` anahtar kelimesinden sonra birden fazla değişken bildirmek mümkündür. Aşağıdaki kodlar eşdeğerdir:

```func
global int A;
global cell B;
global C;
```

```func
global int A, cell B, C;
```

:::warning
Zaten bildirilmiş bir küresel değişken ile aynı isimde bir yerel değişken bildirilmesine izin verilmez. 
:::

Örneğin, bu kod derlenmeyecektir:

```func
global cell C;

int main() {
  int C = 3;
  return C;
}
```

Aşağıdaki kodun doğru olduğunu unutmayın:

```func
global int C;

int main() {
  int C = 3;
  return C;
}
```

fakat burada `int C = 3;` ifadesi **`C = 3;`** ile eşdeğerdir, yani bu durum küresel değişken `C`'ye atama yapılmaktadır, yerel değişken `C`'nin bildirimi değildir (bu etkiyi `değerler` kısmında bulabilirsiniz).