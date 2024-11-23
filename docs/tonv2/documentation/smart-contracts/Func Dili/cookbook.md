# FunC Yemek Kitabı

FunC Yemek Kitabı'nın oluşturulmasının temel nedeni, FunC geliştiricilerinin tüm deneyimlerini bir araya getirerek gelecekteki geliştiricilerin bunu kullanabilmelerini sağlamaktır!

`FunC Dokümantasyonu` ile karşılaştırıldığında, bu makale her FunC geliştiricisinin akıllı sözleşmelerin geliştirilmesi sırasında çözdüğü günlük görevlere daha fazla odaklanmaktadır.

## Temeller

### Bir if ifadesi nasıl yazılır

Herhangi bir olayın ilgili olup olmadığını kontrol etmek istediğimizi varsayalım. Bunu yapmak için bayrak değişkenini kullanıyoruz. FunC'de `true` değerinin `-1` ve `false` değerinin `0` olduğunu unutmayın.

```func
int flag = 0; ;; yanlış

if (flag) { 
    ;; bir şey yap
}
else {
    ;; işlemi reddet
}
```

> 💡 **Not:** Kullanıcı `==` operatörüne ihtiyacımız yok, çünkü `0` değeri `false` olduğu için diğer herhangi bir değer `true` olur.

> 💡 **Yararlı bağlantılar**  
> `"If ifadesi" belgelerde`

### Bir repeat döngüsü nasıl yazılır

Örnek olarak üslü sayma işlemini alabiliriz.

```func
int number = 2;
int multiplier = number;
int degree = 5;

repeat(degree - 1) {
    number *= multiplier;
}
```

> 💡 **Yararlı bağlantılar**  
> `"Repeat döngüsü" belgelerde`

### Bir while döngüsü nasıl yazılır

Belirli bir eylemi ne sıklıkla gerçekleştireceğimizi bilmediğimizde while kullanışlıdır. Örneğin, dört referansa kadar diğer hücreleri depolayabilen bir `cell` alalım.

```func
cell inner_cell = begin_cell() ;; yeni bir boş oluşturucu oluştur 
        .store_uint(123, 16) ;; değeri 123 ve uzunluğu 16 bit olan uint depola
        .end_cell(); ;; oluşturucuyu bir hücreye dönüştür

cell message = begin_cell()
        .store_ref(inner_cell) ;; hücreyi referans olarak depola
        .store_ref(inner_cell)
        .end_cell();

slice msg = message.begin_parse(); ;; hücreyi dilime dönüştür
while (msg.slice_refs_empty?() != -1) { ;; -1'in true olduğunu hatırlatmalıyız
    cell inner_cell = msg~load_ref(); ;; dilim msg'den hücreyi yükle
    ;; bir şey yap
}
```

> 💡 **Yararlı bağlantılar**  
> `"While döngüsü" belgelerde`  
> `"Cell" belgelerde`  
> `"slice_refs_empty?()" belgelerde`  
> `"store_ref()" belgelerde`  
> `"begin_cell()" belgelerde`  
> `"end_cell()" belgelerde`  
> `"begin_parse()" belgelerde`

### Bir do until döngüsü nasıl yazılır

Döngünün en az bir kez çalışmasını gerektiğinde `do until` kullanıyoruz.

```func 
int flag = 0;

do {
    ;; bayrak yanlış (0) olduğu için bile bir şey yap 
} until (flag == -1); ;; -1 true
```

> 💡 **Yararlı bağlantılar**  
> `"Until döngüsü" belgelerde`

### Dilimin boş olup olmadığını nasıl belirleriz

`slice` ile çalışmadan önce, doğru bir şekilde işleyebilmesi için içinde veri olup olmadığını kontrol etmemiz gerekir. Bunu yapmak için `slice_empty?()` kullanabiliriz, ancak en az bir `bit` veri veya bir `ref` varsa `0` (`false`) döneceğini dikkate almalıyız.

```func
;; boş dilim oluşturma
slice empty_slice = "";
;; `slice_empty?()` `true` döner, çünkü dilimde herhangi bir `bit` veya `ref` yoktur
empty_slice.slice_empty?();

;; yalnızca bit içeren dilim oluşturma
slice slice_with_bits_only = "Merhaba, dünya!";
;; `slice_empty?()` `false` döner, çünkü dilimde herhangi bir `bit` bulunur
slice_with_bits_only.slice_empty?();

;; yalnızca ref içeren dilim oluşturma
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_empty?()` `false` döner, çünkü dilimde herhangi bir `ref` bulunur
slice_with_refs_only.slice_empty?();

;; hem bit hem de ref içeren dilim oluşturma
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Merhaba, dünya!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_empty?()` `false` döner, çünkü dilimde herhangi bir `bit` ve `ref` bulunur
slice_with_bits_and_refs.slice_empty?();
```

> 💡 **Yararlı bağlantılar**  
> `"slice_empty?()" belgelerde`  
> `"store_slice()" belgelerde`  
> `"store_ref()" belgelerde`  
> `"begin_cell()" belgelerde`  
> `"end_cell()" belgelerde`  
> `"begin_parse()" belgelerde`

### Sadece `bits` olmadığını (ama `refs` olabilir) nasıl belirleriz

Eğer yalnızca `bits` kontrol etmemiz gerekiyorsa ve dilimde herhangi bir `refs` olup olmadığı önemli değilse, `slice_data_empty?()` kullanmalıyız.

```func 
;; boş dilim oluşturma
slice empty_slice = "";
;; `slice_data_empty?()` `true` döner, çünkü dilimde herhangi bir `bit` yoktur
empty_slice.slice_data_empty?();

;; yalnızca bit içeren dilim oluşturma
slice slice_with_bits_only = "Merhaba, dünya!";
;; `slice_data_empty?()` `false` döner, çünkü dilimde herhangi bir `bit` bulunur
slice_with_bits_only.slice_data_empty?();

;; yalnızca ref içeren dilim oluşturma
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_data_empty?()` `true` döner, çünkü dilimde herhangi bir `bit` yoktur
slice_with_refs_only.slice_data_empty?();

;; hem bit hem de ref içeren dilim oluşturma
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Merhaba, dünya!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_data_empty?()` `false` döner, çünkü dilimde herhangi bir `bit` bulunur
slice_with_bits_and_refs.slice_data_empty?();
```

> 💡 **Yararlı bağlantılar**  
> `"slice_data_empty?()" belgelerde`  
> `"store_slice()" belgelerde`  
> `"store_ref()" belgelerde`  
> `"begin_cell()" belgelerde`  
> `"end_cell()" belgelerde`  
> `"begin_parse()" belgelerde`

### Sadece `refs` olmadığını (ama `bits` olabilir) nasıl belirleriz

Eğer yalnızca `refs` ile ilgileniyorsak, varlıklarını `slice_refs_empty?()` kullanarak kontrol etmeliyiz.

```func 
;; boş dilim oluşturma
slice empty_slice = "";
;; `slice_refs_empty?()` `true` döner, çünkü dilimde herhangi bir `ref` yoktur
empty_slice.slice_refs_empty?();

;; yalnızca bit içeren dilim oluşturma
slice slice_with_bits_only = "Merhaba, dünya!";
;; `slice_refs_empty?()` `true` döner, çünkü dilimde herhangi bir `ref` yoktur
slice_with_bits_only.slice_refs_empty?();

;; yalnızca ref içeren dilim oluşturma
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_refs_empty?()` `false` döner, çünkü dilimde herhangi bir `ref` bulunur
slice_with_refs_only.slice_refs_empty?();

;; hem bit hem de ref içeren dilim oluşturma
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Merhaba, dünya!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_refs_empty?()` `false` döner, çünkü dilimde herhangi bir `ref` bulunur
slice_with_bits_and_refs.slice_refs_empty?();
```

> 💡 **Yararlı bağlantılar**  
> `"slice_refs_empty?()" belgelerde`  
> `"store_slice()" belgelerde`  
> `"store_ref()" belgelerde`  
> `"begin_cell()" belgelerde`  
> `"end_cell()" belgelerde`  
> `"begin_parse()" belgelerde`

### Bir hücrenin boş olup olmadığını nasıl belirleriz

Bir `cell` içinde herhangi bir veri olup olmadığını kontrol etmek için önce onu bir `slice`'e dönüştürmeliyiz. Sadece `bits` ile ilgilendiğimizde `slice_data_empty?()`, yalnızca `refs` ile ilgilendiğimizde `slice_refs_empty?()` kullanmalıyız. Herhangi bir verinin var olup olmadığını kontrol etmek istediğimizde `slice_empty?()` kullanmalıyız.

```func
cell cell_with_bits_and_refs = begin_cell()
    .store_uint(1337, 16)
    .store_ref(null())
    .end_cell();

;; `cell` türünü `begin_parse()` ile dilime değiştirin
slice cs = cell_with_bits_and_refs.begin_parse();

;; dilimin boş olup olmadığını belirle
if (cs.slice_empty?()) {
    ;; hücre boş
}
else {
    ;; hücre boş değil
}
```

> 💡 **Yararlı bağlantılar**  
> `"slice_empty?()" belgelerde`  
> `"begin_cell()" belgelerde`  
> `"store_uint()" belgelerde`  
> `"end_cell()" belgelerde`  
> `"begin_parse()" belgelerde`

### Bir dict'in boş olup olmadığını nasıl belirleriz

Dict içinde veri varlığını kontrol etmek için `dict_empty?()` yöntemini kullanırız. Bu yöntem genellikle bir `null` hücresinin boş bir sözlük olduğunu düşünüldüğünde `cell_null?()` ile eşdeğerdir.

```func
cell d = new_dict();
d~udict_set(256, 0, "merhaba");
d~udict_set(256, 1, "dünya");

if (d.dict_empty?()) { ;; Sözlüğün boş olup olmadığını belirleyin
    ;; sözlük boş
}
else {
    ;; sözlük boş değil
}
```

> 💡 **Yararlı bağlantılar**  
> `"dict_empty?()" belgelerde`  
> `"new_dict()" belgelerde` boş bir sözlük oluşturma  
> `"dict_set()" belgelerde` sözlük d'ye bazı öğeler ekleyerek, böylece boş değildir

### Bir tuple'ın boş olup olmadığını nasıl belirleriz

`tuples` ile çalışırken, içlerinde herhangi bir değerin olup olmadığını her zaman bilmek önemlidir. Eğer boş bir `tuple`'dan değer çıkarmaya çalışırsak, "geçerli boyutta bir tuple değil" hatasını alırız ve `exit code 7` döner.

```func
;; tlen fonksiyonunu tanımlayın çünkü stdlib'de mevcut değildir
(int) tlen (tuple t) asm "TLEN";

() main () {
    tuple t = empty_tuple();
    t~tpush(13);
    t~tpush(37);

    if (t.tlen() == 0) {
        ;; tuple boş
    }
    else {
        ;; tuple boş değil
    }
}
```

> 💡 **Not:** tlen assembly fonksiyonunu tanımlıyoruz. Daha fazlasını okuyabilirsiniz `burada` ve `tüm assembly komutları listesine` göz atabilirsiniz.

> 💡 **Yararlı bağlantılar**  
> `"empty_tuple?()" belgelerde`  
> `"tpush()" belgelerde`  
> `"Exit kodları" belgelerde`

### LISP tarzı bir listenin boş olup olmadığını nasıl belirleriz

```func
tuple numbers = null();
numbers = cons(100, numbers);

if (numbers.null?()) {
    ;; liste tarzı liste boş
} else {
    ;; liste tarzı liste boş değil
}
```

Liste tarzı listemize `cons` fonksiyonu ile 100 sayısını ekliyoruz, böylece boş olmayacaktır.

### Sözleşmenin durumunun boş olup olmadığını nasıl belirleriz

Bir `counter`'ımız olduğunu varsayalım, bu değişken işlemlerin sayısını depolar. Bu değişken akıllı sözleşme durumunda ilk işlem sırasında mevcut olmayacağı için, böyle bir durumu işlememiz gerekmektedir. Durum boşsa, bir `counter` değişkeni oluşturur ve kaydederiz.

```func
;; `get_data()` sözleşme durumundan veri hücresini döndürecektir
cell contract_data = get_data();
slice cs = contract_data.begin_parse();

if (cs.slice_empty?()) {
    ;; sözleşme verisi boş, bu yüzden sayacı oluşturup kaydediyoruz
    int counter = 1;
    ;; hücre oluştur, sayacı ekle ve sözleşme durumuna kaydet
    set_data(begin_cell().store_uint(counter, 32).end_cell());
}
else {
    ;; sözleşme verisi boş değil, bu yüzden sayacımızı alıp artırıyoruz ve kaydediyoruz
    ;; sayacımızın bit cinsinden doğru uzunluğunu belirtmeliyiz
    int counter = cs~load_uint(32) + 1;
    set_data(begin_cell().store_uint(counter, 32).end_cell());
}
```

> 💡 **Not:** Bir sözleşmenin durumunun boş olduğunu, `cell boşsa` belirleyerek anlayabiliriz.

> 💡 **Yararlı bağlantılar**  
> `"get_data()" belgelerde`  
> `"begin_parse()" belgelerde`  
> `"slice_empty?()" belgelerde`  
> `"set_data?()" belgelerde`

### İç mesaj hücresinin nasıl oluşturulacağı

Eğer sözleşmenin bir iç mesaj göndermesini istiyorsak, öncelikle teknik bayrakları, alıcı adresini ve diğer verileri belirterek doğru bir şekilde bir hücre oluşturmalıyız.

```func
;; Geçerli adresi bir dize içinden almak için `a` literal'ını kullanıyoruz 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
;; işlemleri tanımlamak için `op` kullanıyoruz
int op = 0;

cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; varsayılan mesaj başlıkları (mesaj gönderme sayfasına bakınız)
    .store_uint(op, 32)
.end_cell();

send_raw_message(msg, 3); ;; mod 3 - ücretleri ayrı öde ve hataları göz ardı et 
```

> 💡 **Not:** Bu örnekte geçerli adresi almak için `a` literal'ını kullanıyoruz. Dize literal'ları hakkında daha fazla bilgiye `belgelerde` ulaşabilirsiniz.

> 💡 **Not:** Daha fazlasını `belgelerde` bulabilirsiniz. Ayrıca bu bağlantıyla `düzen` sayfasına gidebilirsiniz.

> 💡 **Yararlı bağlantılar**  
> `"begin_cell()" belgelerde`  
> `"store_uint()" belgelerde`  
> `"store_slice()" belgelerde`  
> `"store_coins()" belgelerde`  
> `"end_cell()" belgelerde`  
> `"send_raw_message()" belgelerde`

### Bir mesaj hücresinin gövdesini referans olarak nasıl içerebiliriz

Mesajın gövdesinde bayraklar ve diğer teknik verilerden sonra `int`, `slice` ve `cell` gönderebiliriz. İkincisi durumunda, `store_ref()` öncesinde bit `1`'e ayarlanmalıdır, bu da `cell`'in devam edeceğini belirtir.

Mesaj gövdesini, yeterli alan olduğundan eminsek, aynı `cell` içinde başlıkla birlikte gönderebiliriz. Bu durumda, bit `0`'a ayarlanmalıdır.

```func
;; Geçerli adresi bir dize içinden almak için `a` literal'ını kullanıyoruz 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
cell message_body = begin_cell() ;; mesaj ile birlikte bir hücre oluşturma
    .store_uint(op, 32)
    .store_slice("❤")
.end_cell();
    
cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1) ;; varsayılan mesaj başlıkları (mesaj gönderme sayfasına bakınız)
    .store_uint(1, 1) ;; hücre gideceğini belirtmek için biti 1'e ayarla
    .store_ref(message_body)
.end_cell();

send_raw_message(msg, 3); ;; mod 3 - ücretleri ayrı öde ve hataları göz ardı et 
```

> 💡 **Not:** Bu örnekte geçerli adresi almak için `a` literal'ını kullanıyoruz. Dize literal'ları hakkında daha fazla bilgiye `belgelerde` ulaşabilirsiniz.

> 💡 **Not:** Bu örnekte, gelen tonları alıp, belirtilen kadar (miktar) göndermek için mod 3 kullanıldı. Komisyonu sözleşme bakiyesinden ödeyerek hataları göz ardı ediyor. Mod 64, alınan tüm tonların, komisyon çıkarılarak geri döndürülmesi için gereklidir ve mod 128, tüm bakiyeyi gönderecektir.

> 💡 **Not:** `Bir mesaj oluşturuyoruz`, ancak mesaj gövdesini ayrı olarak ekliyoruz.

> 💡 **Yararlı bağlantılar**  
> `"begin_cell()" belgelerde`  
> `"store_uint()" belgelerde`  
> `"store_slice()" belgelerde`  
> `"store_coins()" belgelerde`  
> `"end_cell()" belgelerde`  
> `"send_raw_message()" belgelerde`

### Bir mesaj hücresinin gövdesini slice olarak nasıl içerebiliriz

Mesaj gönderirken, mesajın gövdesi ya `cell` ya da `slice` olarak gönderilebilir. Bu örnekte, mesajın gövdesini `slice` içinde gönderiyoruz.

```func 
;; Geçerli adresi bir dize içinden almak için `a` literal'ını kullanıyoruz 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
slice message_body = "❤"; 

cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; varsayılan mesaj başlıkları (mesaj gönderme sayfasına bakınız)
    .store_uint(op, 32)
    .store_slice(message_body)
.end_cell();

send_raw_message(msg, 3); ;; mod 3 - ücretleri ayrı öde ve hataları göz ardı et 
```

> 💡 **Not:** Bu örnekte geçerli adresi almak için `a` literal'ını kullanıyoruz. Dize literal'ları hakkında daha fazla bilgiye `belgelerde` ulaşabilirsiniz.

> 💡 **Not:** Bu örnekte, gelen tonları alıp, belirtilen kadar (miktar) göndermek için mod 3 kullanıldı. Komisyonu sözleşme bakiyesinden ödeyerek hataları göz ardı ediyor. Mod 64, alınan tüm tonların, komisyon çıkarılarak geri döndürülmesi için gereklidir ve mod 128, tüm bakiyeyi gönderecektir.

> 💡 **Not:** `Bir mesaj oluşturuyoruz`, ancak mesajı bir dilim olarak gönderiyoruz.

### İkili demetler üzerinde nasıl yineleme yapılır (her iki yönde)

Bir dizi veya yığın ile çalışmak istersek, FunC'te demet gerekli olacaktır. İlk olarak, bunlarla çalışabilmek için değerleri yineleyebilmemiz gerekiyor.

```func
(int) tlen (tuple t) asm "TLEN";
forall X -> (tuple) to_tuple (X x) asm "NOP";

() main () {
    tuple t = to_tuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    int len = t.tlen();
    
    int i = 0;
    while (i < len) {
        int x = t.at(i);
        ;; x ile bir şeyler yap
        i = i + 1;
    }

    i = len - 1;
    while (i >= 0) {
        int x = t.at(i);
        ;; x ile bir şeyler yap
        i = i - 1;
    }
}
```

> 💡 **Not**
> 
> `tlen` assembly fonksiyonunu tanımlıyoruz. Daha fazla bilgi almak için [buradan](https://v3/documentation/smart-contracts/func/docs/functions#assembler-function-body-definition) okuyabilir ve [tüm montaj komutlarının listesini](https://v3/documentation/tvm/instructions) görebilirsiniz.

> Ayrıca `to_tuple` fonksiyonunu da tanımlıyoruz. Bu sadece herhangi bir girişin veri tipini demete dönüştürür, bu nedenle kullanırken dikkatli olun.

---

### `asm` anahtar kelimesi kullanarak kendi fonksiyonlarınızı nasıl yazarsınız

Herhangi bir özellik kullanırken aslında bizim için önceden hazırlanmış yöntemleri `stdlib.fc` içinde kullanıyoruz. Ancak gerçekte, elimizde daha fazla fırsat bulunmaktadır ve bunları kendimiz yazmayı öğrenmemiz gerekiyor.

Örneğin, `tuple`'a bir eleman ekleyen `tpush` adlı bir metodumuz var, ancak `tpop` yok. Bu durumda, şunu yapmalıyız:

```func
;; ~ demek değiştirme metodudur
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP"; 
```

Döngü için `tuple` uzunluğunu öğrenmek istiyorsak, `TLEN` asm talimatıyla yeni bir fonksiyon yazmalıyız:

```func
int tuple_length (tuple t) asm "TLEN";
```

`stdlib.fc`'den zaten bildiğimiz bazı fonksiyon örnekleri:

```func
slice begin_parse(cell c) asm "CTOS";
builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
```

> 💡 **Yararlı bağlantılar:**
>
> `"değiştirme metodları" belgelerinde`  
> `"stdlib" belgelerinde`  
> `"TVM talimatları" belgelerinde`  

---

### N-nestel demetler üzerinde yineleme

Bazen iç içe demetleri yinelemek isteriz. Aşağıdaki örnek, bellekleri baştan başlayarak `[[2,6],[1,[3,[3,5]]], 3]` biçimindeki bir demet içindeki tüm öğeleri yineleyecektir.

```func
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
forall X -> int is_tuple (X x) asm "ISTUPLE";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> (tuple) to_tuple (X x) asm "NOP";

;; global değişken tanımla
global int max_value;

() iterate_tuple (tuple t) impure {
    repeat (t.tuple_length()) {
        var value = t~tpop();
        if (is_tuple(value)) {
            tuple tuple_value = cast_to_tuple(value);
            iterate_tuple(tuple_value);
        }
        else {
            if(value > max_value) {
                max_value = value;
            }
        }
    }
}

() main () {
    tuple t = to_tuple([[2,6], [1, [3, [3, 5]]], 3]);
    int len = t.tuple_length();
    max_value = 0; ;; max_value'yi sıfırla;
    iterate_tuple(t); ;; demeti yinele ve maksimum değeri bul
    ~dump(max_value); ;; 6
}
```

> 💡 **Yararlı bağlantılar**
>
> `"Global değişkenler" belgelerinde`  
> `"~dump" belgelerinde`  
> `"TVM talimatları" belgelerinde`  

---

### Demetlerle temel işlemler

```func
(int) tlen (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";

() main () {
    ;; boş bir demet oluşturma
    tuple names = empty_tuple(); 
    
    ;; yeni öğeler ekle
    names~tpush("Naito Narihira");
    names~tpush("Shiraki Shinichi");
    names~tpush("Akamatsu Hachemon");
    names~tpush("Takaki Yuichi");
    
    ;; son öğeyi çıkar
    slice last_name = names~tpop();

    ;; ilk öğeyi al
    slice first_name = names.first();

    ;; indeks ile bir öğe al
    slice best_name = names.at(2);

    ;; liste uzunluğunu al
    int number_names = names.tlen();
}
```

---

### X tipini çözme

Aşağıdaki örnek, bir değerin bir demette bulunup bulunmadığını kontrol eder, ancak demet değerleri X (cell, slice, int, tuple, int) içerir. Değeri kontrol etmemiz ve uygun şekilde dönüştürmemiz gerekiyor.

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> int is_int (X x) asm "<{ TRY:<{ 0 PUSHINT ADD DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_cell (X x) asm "<{ TRY:<{ CTOS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_slice (X x) asm "<{ TRY:<{ SBITS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_tuple (X x) asm "ISTUPLE";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> cell cast_to_cell (X x) asm "NOP";
forall X -> slice cast_to_slice (X x) asm "NOP";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";

forall X -> () resolve_type (X value) impure {
    ;; değer burada X tipindedir, çünkü kesin değer nedir bilmiyoruz - değeri kontrol etmemiz ve sonra dönüştürmemiz gerekir
    
    if (is_null(value)) {
        ;; null ile bir şeyler yap
    }
    elseif (is_int(value)) {
        int valueAsInt = cast_to_int(value);
        ;; int ile bir şeyler yap
    }
    elseif (is_slice(value)) {
        slice valueAsSlice = cast_to_slice(value);
        ;; slice ile bir şeyler yap
    }
    elseif (is_cell(value)) {
        cell valueAsCell = cast_to_cell(value);
        ;; cell ile bir şeyler yap
    }
    elseif (is_tuple(value)) {
        tuple valueAsTuple = cast_to_tuple(value);
        ;; tuple ile bir şeyler yap
    }
}

() main () {
    ;; boş bir demet oluştur
    tuple stack = empty_tuple();
    ;; diyelim ki bir demetimiz var ve bunların kesin tiplerini bilmiyoruz
    stack~tpush("Bazı metinler");
    stack~tpush(4);
    ;; değerimizin tipi ne olduğunu bilmediğimiz için var kullanıyoruz
    var value = stack~tpop();
    resolve_type(value);
}
```

> 💡 **Yararlı bağlantılar**
>
> `"TVM talimatları" belgelerinde`  

---

### Geçerli zamanı nasıl alırsınız

```func
int current_time = now();
  
if (current_time > 1672080143) {
    ;; bazı işlemleri yap 
}
```

---

### Rastgele sayı nasıl üretilir

:::caution taslak
Lütfen unutmayın ki bu rastgele sayı üretme yöntemi güvenli değildir.

Daha fazla bilgi için `Rastgele Sayı Üretimi` sayfasına göz atın.
:::

```func
randomize_lt(); ;; bunu bir kez yap

int a = rand(10);
int b = rand(1000000);
int c = random();
```

---

### Modül işlemleri

Örneğin, tüm 256 sayının aşağıdaki hesaplamasını çalıştırmak istediğimizi varsayalım: `(xp + zp)*(xp-zp)`. Bu işlemlerin çoğunun kriptografi için kullanıldığını göz önünde bulundurursak, aşağıdaki örnekte montgomery eğrileri için modül operatörünü kullanıyoruz.  
xp+zp geçerli bir değişken adı olduğunu unutmayın (boşluk yok).

```func
(int) modulo_operations (int xp, int zp) {  
   ;; 2^255 - 19 montgomery eğrileri için bir asal sayıdır, yani tüm işlemler bunun asal sayısı etrafında yapılmalıdır
   int prime = 57896044618658097711785492504343953926634992332820282019728792003956564819949; 

   ;; muldivmod bir sonraki iki satırı kendisi işleme alır
   ;; int xp+zp = (xp + zp) % prime;
   ;; int xp-zp = (xp - zp + prime) % prime;
   (_, int xp+zp*xp-zp) = muldivmod(xp + zp, xp - zp, prime);
   return xp+zp*xp-zp;
}
```

> 💡 **Yararlı bağlantılar**
>
> `"muldivmod" belgelerinde`  

---

### Hataları nasıl atarsınız

```func
int number = 198;

throw_if(35, number > 50); ;; hata yalnızca sayı 50'den büyükse tetiklenecektir

throw_unless(39, number == 198); ;; hata yalnızca sayı 198'e EŞİT DEĞİLSE tetiklenecektir

throw(36); ;; hata her koşulda tetiklenecektir
```

`Standart tvm istisna kodları`  

---

### Demetleri tersine çevirmek

Demet verileri bir yığın olarak depoladığından, bazen diğer uçtan verileri okumak için demeti tersine çevirmemiz gerekir.

```func
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple) to_tuple (X x) asm "NOP";

(tuple) reverse_tuple (tuple t1) {
    tuple t2 = empty_tuple();
    repeat (t1.tuple_length()) {
        var value = t1~tpop();
        t2~tpush(value);
    }
    return t2;
}

() main () {
    tuple t = to_tuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    tuple reversed_t = reverse_tuple(t);
    ~dump(reversed_t); ;; [10 9 8 7 6 5 4 3 2 1]
}
```

> 💡 **Yararlı bağlantılar**
>
> `"tpush()" belgelerinde`  

---

### Belirli bir indeksle bir öğeyi listeden nasıl kaldırırsınız

```func
int tlen (tuple t) asm "TLEN";

(tuple, ()) remove_item (tuple old_tuple, int place) {
    tuple new_tuple = empty_tuple();

    int i = 0;
    while (i < old_tuple.tlen()) {
        int el = old_tuple.at(i);
        if (i != place) {
            new_tuple~tpush(el);
        }
        i += 1;  
    }
    return (new_tuple, ());
}

() main () {
    tuple numbers = empty_tuple();

    numbers~tpush(19);
    numbers~tpush(999);
    numbers~tpush(54);

    ~dump(numbers); ;; [19 999 54]

    numbers~remove_item(1); 

    ~dump(numbers); ;; [19 54]
}
```

---

### Dizi eşitliğini belirleme

İki farklı şekilde eşitliği belirleyebiliriz. Biri dilim hash'ine dayanmaktadır, diğeri ise SDEQ asm talimatını kullanarak.

```func
int are_slices_equal_1? (slice a, slice b) {
    return a.slice_hash() == b.slice_hash();
}

int are_slices_equal_2? (slice a, slice b) asm "SDEQ";

() main () {
    slice a = "Bazı metinler";
    slice b = "Bazı metinler";
    ~dump(are_slices_equal_1?(a, b)); ;; -1 = doğru

    a = "Metin";
    ;; Doğru adrese dilim içinden geçerli adresi almak için literal 'a' kullanıyoruz
    b = "EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF"a;
    ~dump(are_slices_equal_2?(a, b)); ;; 0 = yanlış
}
```

#### 💡 **Yararlı bağlantılar**

 * `"slice_hash()" belgelerinde`  
 * `"SDEQ" belgelerinde`  

---

### Hücrelerin eşit olup olmadığını belirleme 

Hücre eşitliğini, hash'lerine dayanarak kolayca belirleyebiliriz.

```func
int are_cells_equal? (cell a, cell b) {
    return a.cell_hash() == b.cell_hash();
}

() main () {
    cell a = begin_cell()
            .store_uint(123, 16)
            .end_cell();

    cell b = begin_cell()
            .store_uint(123, 16)
            .end_cell();

    ~dump(are_cells_equal?(a, b)); ;; -1 = doğru
}
```

> 💡 **Yararlı bağlantılar**
>
> `"cell_hash()" belgelerinde`  

---

### Demetlerin eşit olup olmadığını belirleme

Daha gelişmiş bir örnek, her bir demet değerini yineleyip karşılaştırmaktır. X olduklarından, kontrol etmemiz ve karşılık gelen tipe dönüştürmemiz gerekiyor ve eğer demet ise yinelemeli olarak dönüştürmemiz gerekiyor.

```func
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> cell cast_to_cell (X x) asm "NOP";
forall X -> slice cast_to_slice (X x) asm "NOP";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> int is_null (X x) asm "ISNULL";
forall X -> int is_int (X x) asm "<{ TRY:<{ 0 PUSHINT ADD DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_cell (X x) asm "<{ TRY:<{ CTOS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_slice (X x) asm "<{ TRY:<{ SBITS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_tuple (X x) asm "ISTUPLE";
int are_slices_equal? (slice a, slice b) asm "SDEQ";

int are_cells_equal? (cell a, cell b) {
    return a.cell_hash() == b.cell_hash();
}

(int) are_tuples_equal? (tuple t1, tuple t2) {
    int equal? = -1; ;; başlangıç değeri doğru
    
    if (t1.tuple_length() != t2.tuple_length()) {
        ;; demetler uzunluk açısından farklıysa eşit olamazlar
        return 0;
    }

    int i = t1.tuple_length();
    
    while (i > 0 & equal?) {
        var v1 = t1~tpop();
        var v2 = t2~tpop();
        
        if (is_null(t1) & is_null(t2)) {
            ;; null her zaman eşittir
        }
        elseif (is_int(v1) & is_int(v2)) {
            if (cast_to_int(v1) != cast_to_int(v2)) {
                equal? = 0;
            }
        }
        elseif (is_slice(v1) & is_slice(v2)) {
            if (~ are_slices_equal?(cast_to_slice(v1), cast_to_slice(v2))) {
                equal? = 0;
            }
        }
        elseif (is_cell(v1) & is_cell(v2)) {
            if (~ are_cells_equal?(cast_to_cell(v1), cast_to_cell(v2))) {
                equal? = 0;
            }
        }
        elseif (is_tuple(v1) & is_tuple(v2)) {
            ;; iç içe demetlerin eşitliğini yinelemeli olarak belirle
            if (~ are_tuples_equal?(cast_to_tuple(v1), cast_to_tuple(v2))) {
                equal? = 0;
            }
        }
        else {
            equal? = 0;
        }

        i -= 1;
    }

    return equal?;
}

() main () {
    tuple t1 = cast_to_tuple([[2, 6], [1, [3, [3, 5]]], 3]);
    tuple t2 = cast_to_tuple([[2, 6], [1, [3, [3, 5]]], 3]);

    ~dump(are_tuples_equal?(t1, t2)); ;; -1 
}
```

> 💡 **Yararlı bağlantılar**
>
> `"cell_hash()" belgelerinde`  
> `"TVM talimatları" belgelerinde`  

---

### İç adres nasıl üretilir

Sözleşmemiz yeni bir sözleşme dağıtmalıysa ama adresini bilmiyorsak iç bir adres üretmemiz gerekiyor. Diyelim ki zaten `state_init` var - yeni sözleşmenin kodu ve verileri. 

Mesaj AddressInt TLB için karşılık gelen bir iç adres oluşturur.

```func
(slice) generate_internal_address (int workchain_id, cell state_init) {
    ;; addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;

    return begin_cell()
        .store_uint(2, 2) ;; addr_std$10
        .store_uint(0, 1) ;; herhangi bir mesaj yok
        .store_int(workchain_id, 8) ;; işçilerin kimliği: -1
        .store_uint(cell_hash(state_init), 256)
    .end_cell().begin_parse();
}

() main () {
    slice deploy_address = generate_internal_address(workchain(), state_init);
    ;; o zaman yeni sözleşmeyi dağıtabiliriz
}
```

> 💡 **Not**
> 
> Bu örnekte, işçi kimliğini almak için `workchain()` kullanıyoruz. İşçi kimliği ile ilgili daha fazla bilgi için [belgelere](https://v3/documentation/smart-contracts/addresses#workchain-id) göz atabilirsiniz.

> 💡 **Yararlı bağlantılar**
>
> `"cell_hash()" belgelerinde`  

---

### Dış adres nasıl üretilir

Bu formatta bir adresi nasıl oluşturacağımızı anlamak için [block.tlb](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L101C1-L101C12) dosyasından TL-B şemasını kullanıyoruz. 

```func
(int) ubitsize (int a) asm "UBITSIZE";

slice generate_external_address (int address) {
    ;; addr_extern$01 len:(## 9) external_address:(bits len) = MsgAddressExt;
    
    int address_length = ubitsize(address);
    
    return begin_cell()
        .store_uint(1, 2) ;; addr_extern$01
        .store_uint(address_length, 9)
        .store_uint(address, address_length)
    .end_cell().begin_parse();
}
```

Adresin kapladığı bit sayısını belirlememiz gerektiğinden, aşağıdaki gibi `asm fonksiyonu` ile `UBITSIZE` opcodeunu uma tanımlamak da gereklidir, bu da sayıyı saklamak için gereken minimum bit sayısını döndürecektir.

> 💡 **Yararlı bağlantılar**
>
> `"TVM talimatları" belgelerinde`  

---

### Yerel depolamada sözlüğü nasıl saklar ve yükleriz

Sözlüğü yükleme mantığı

```func
slice local_storage = get_data().begin_parse();
cell dictionary_cell = new_dict();
if (~ slice_empty?(local_storage)) {
    dictionary_cell = local_storage~load_dict();
}
```

Sözlüğü saklama mantığı ise aşağıdaki örneğe benzemektedir:

```func
set_data(begin_cell().store_dict(dictionary_cell).end_cell());
```

> 💡 **Yararlı bağlantılar**
>
> `"get_data()" belgelerinde`  
> `"new_dict()" belgelerinde`  
> `"slice_empty?()" belgelerinde`  
> `"load_dict()" belgelerinde`  
> `"~" belgelerinde`  

---

### Basit bir mesaj nasıl gönderilir

Bir mesaj göndermenin alışıldık yolu aslında basit bir mesajdır. Mesajın gövdesinin `yorum` olduğunu belirtmek için, mesaj metninden önce `32 bit` kısmını `0` olarak ayarlamalıyız.

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; bayraklar
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; hedef adres
    .store_coins(100) ;; gönderilecek nanoTon miktarı
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; varsayılan mesaj başlıkları (mesaj gönderme sayfasına bak)
    .store_uint(0, 32) ;; sıfır opcode - yorumla basit transfer mesajı anlamına gelir
    .store_slice("FunC'tan Merhaba!") ;; yorum
.end_cell();
send_raw_message(msg, 3); ;; mod 3 - ücretleri ayrı öde, hataları görmezden gel
```

> 💡 **Yararlı bağlantılar**
>
> `"Mesaj yapısı" belgelerinde`  

---

### Gelen hesapla mesaj nasıl gönderilir

Aşağıdaki sözleşme örneği, kullanıcı ve ana sözleşme arasında herhangi bir işlem yapmamız gerektiğinde, yani bir proxy sözleşmesine ihtiyaç duyduğumuzda bize yararlıdır.

```func
() recv_internal (slice in_msg_body) {
    {-
        Bu, bir proxy sözleşmesinin basit bir örneğidir.
        in_msg_body'nın mesaj modunu, gövdesini ve gönderilecek hedef adresini içermesini bekleyecektir.
    -}

    int mode = in_msg_body~load_uint(8); ;; ilk bayt msg modunu içerecektir
    slice addr = in_msg_body~load_msg_addr(); ;; ardından hedef adresi ayrıştırırız
    slice body = in_msg_body; ;; in_msg_body'da kalan her şey yeni mesajın gövdesi olacaktır

    cell msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(addr)
        .store_coins(100) ;; yalnızca örnek olması açısından
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; varsayılan mesaj başlıkları (gönderim sayfasına bak)
        .store_slice(body)
    .end_cell();
    send_raw_message(msg, mode);
}
```

> 💡 **Yararlı bağlantılar**
> 
> `"Mesaj yapısı" belgelerinde`  
> `"load_msg_addr()" belgelerinde`  

---

### Tam bakiye ile mesaj nasıl gönderilir

Akıllı sözleşmenin tüm bakiyesini göndermemiz gerekiyorsa, bu durumda `mod 128` kullanmamız gerekecek. Bu tür bir durumda, ödemeleri kabul eden ve ana sözleşmeye ileten bir proxy sözleşmesi olacaktır.

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; bayraklar
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; hedef adres
    .store_coins(0) ;; şu anda bu değeri umursamıyoruz
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; varsayılan mesaj başlıkları (mesaj gönderme sayfasına bak)
    .store_uint(0, 32) ;; sıfır opcode - yorumla basit transfer mesajı anlamına gelir
    .store_slice("FunC'tan Merhaba!") ;; yorum
.end_cell();
send_raw_message(msg, 128); ;; mod = 128, mevcut akıllı sözleşmenin kalan tüm bakiyesini taşıyacak mesajlar için kullanılır
```

> 💡 **Yararlı bağlantılar**
>
> `"Mesaj yapısı" belgelerinde`  
> `"Mesaj modları" belgelerinde`  

### Uzun metin yorumuyla nasıl mesaj gönderilir

Bildiğimiz gibi, bir `cell` içerisine yalnızca 127 karakter sığabilir ( 📌 **Faydalı bağlantılar**
>
> `"Dahili mesajlar" belgelerinde`

---

### Sadece bir dilimden veri bitleri nasıl alınır (refs olmadan)

Eğer `slice` içerisindeki `refs` ile ilgilenmiyorsak, ayrı bir veri elde edip onunla çalışabiliriz.

```func
slice s = begin_cell()
    .store_slice("Bazı veri bitleri...")
    .store_ref(begin_cell().end_cell()) ;; bazı referanslar
    .store_ref(begin_cell().end_cell()) ;; bazı referanslar
.end_cell().begin_parse();

slice s_only_data = s.preload_bits(s.slice_bits());
```

> 📌 **Faydalı bağlantılar**
>
> `"Slice primitives" belgelerinde`
>
> `"preload_bits()" belgelerinde`
>
> `"slice_bits()" belgelerinde`

---

### Kendi değiştirme metodunuzu nasıl tanımlarsınız

Değiştirme yöntemleri, verilerin aynı değişken içinde değiştirilmesine olanak tanır. Bu, diğer programlama dillerindeki referanslama ile karşılaştırılabilir.

```func
(slice, (int)) load_digit (slice s) {
    int x = s~load_uint(8); ;; dilimden 8 bit (bir karakter) yükle
    x -= 48; ;; karakter '0' kodu 48 olduğundan, sayıyı elde etmek için bunu çıkarıyoruz
    return (s, (x)); ;; modifiye edilmiş dilimimizi ve yüklenmiş rakamı döndür
}

() main () {
    slice s = "258";
    int c1 = s~load_digit();
    int c2 = s~load_digit();
    int c3 = s~load_digit();
    ;; burada s "", c1 = 2, c2 = 5, c3 = 8'e eşit
}
```

> 📌 **Faydalı bağlantılar**
>
> `"Değiştirme yöntemleri" belgelerinde`

---

### Bir sayıyı n. kuvvetine nasıl yükseltiriz

```func
;; Optimizasyonsuz variant
int pow (int a, int n) {
    int i = 0;
    int value = a;
    while (i val çifti ile bir şey yap

    (key, val, flag) = d.udict_get_next?(256, key);
}
```

> 📌 **Faydalı bağlantılar**
>
> `"Sözlükler primitives" belgelerinde`
>
> `"dict_get_max?()" belgelerinde`
>
> `"dict_get_min?()" belgelerinde`
>
> `"dict_get_next?()" belgelerinde`
>
> `"dict_set()" belgelerinde`

---

### Sözlüklerden bir değeri nasıl sileriz

```func
cell names = new_dict();
names~udict_set(256, 27, "Alice");
names~udict_set(256, 25, "Bob");

names~udict_delete?(256, 27);

(slice val, int key) = names.udict_get?(256, 27);
~dump(val); ;; null() -> bu, anahtarın sözlükte bulunmadığı anlamına gelir
```

---

### Cell ağaçlarını nasıl yineleyerek geçeriz

Bildiğimiz gibi, bir `cell`, en fazla `1023 bit` veri ve `4 refs` depolayabilir. Bu sınırı aşmak için, bir hücreler ağacı kullanabiliriz; ancak bunu yapabilmek için düzgün veri işleme sağlamak üzere yineleyebilmemiz gerekir.

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS";
forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS";

() main () {
    ;; örnek olarak sadece bazı hücreler
    cell c = begin_cell()
        .store_uint(1, 16)
        .store_ref(begin_cell()
            .store_uint(2, 16)
        .end_cell())
        .store_ref(begin_cell()
            .store_uint(3, 16)
            .store_ref(begin_cell()
                .store_uint(4, 16)
            .end_cell())
            .store_ref(begin_cell()
                .store_uint(5, 16)
            .end_cell())
        .end_cell())
    .end_cell();

    ;; hiçbir verisi olmayan bir tuple oluşturuyoruz, bu yığın rolünü oynar
    tuple stack = null();
    ;; ana hücreyi işlemek için yığına götür
    stack~push_back(c);
    ;; stack null olmadığı sürece bunu yap
    while (~ stack.is_null()) {
        ;; yığından hücreyi al ve işlemek için bunu bir dilime dönüştür
        slice s = stack~pop_back().begin_parse();

        ;; s verisi ile bir şey yap

        ;; eğer mevcut dilimin herhangi bir referansı varsa, bunları yığına ekle
        repeat (s.slice_refs()) {
            stack~push_back(s~load_ref());
        }
    }
}
```

> 📌 **Faydalı bağlantılar**
> 
> `"Lisp tarzı listeler" belgelerinde`
>
> `"null()" belgelerinde`
>
> `"slice_refs()" belgelerinde`

---

### Lisp tarzı listelerde nasıl iterasyon yaparız

Tuple veri türü en fazla 255 değer tutabilir. Eğer bu yeterli değilse, o zaman bir lisp tarzı liste kullanmalıyız. Bir tuple'ı bir tuple'ın içine koyabiliriz, böylece sınırı aşarız.

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS";
forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS";

() main () {
    ;; bazı örnek listeler
    tuple l = null();
    l~push_back(1);
    l~push_back(2);
    l~push_back(3);

    ;; elemanlar arasında iterasyon yapıyoruz
    ;; lüzum açısından bu iterasyon ters sırada
    while (~ l.is_null()) {
        var x = l~pop_back();

        ;; x ile bir şey yap
    }
}
```

> 📌 **Faydalı bağlantılar**
> 
> `"Lisp tarzı listeler" belgelerinde`
>
> `"null()" belgelerinde`

---

### Deploy mesajı nasıl gönderilir (sadece stateInit ile, stateInit ve body ile)

```func
() deploy_with_stateinit(cell message_header, cell state_init) impure {
  var msg = begin_cell()
    .store_slice(begin_parse(msg_header))
    .store_uint(2 + 1, 2) ;; init:(Maybe (Either StateInit ^StateInit))
    .store_uint(0, 1) ;; body:(Either X ^X)
    .store_ref(state_init)
    .end_cell();

  ;; mod 64 - yeni mesajda kalan değeri taşımak
  send_raw_message(msg, 64); 
}

() deploy_with_stateinit_body(cell message_header, cell state_init, cell body) impure {
  var msg = begin_cell()
    .store_slice(begin_parse(msg_header))
    .store_uint(2 + 1, 2) ;; init:(Maybe (Either StateInit ^StateInit))
    .store_uint(1, 1) ;; body:(Either X ^X)
    .store_ref(state_init)
    .store_ref(body)
    .end_cell();

  ;; mod 64 - yeni mesajda kalan değeri taşımak
  send_raw_message(msg, 64); 
}
```

---

### stateInit hücresi nasıl oluşturulur

```func
() build_stateinit(cell init_code, cell init_data) {
  var state_init = begin_cell()
    .store_uint(0, 1) ;; split_depth:(Maybe (## 5))
    .store_uint(0, 1) ;; special:(Maybe TickTock)
    .store_uint(1, 1) ;; (Maybe ^Cell)
    .store_uint(1, 1) ;; (Maybe ^Cell)
    .store_uint(0, 1) ;; (HashmapE 256 SimpleLib)
    .store_ref(init_code)
    .store_ref(init_data)
    .end_cell();
}
```

---

### Sözleşme adresi nasıl hesaplanır (stateInit kullanarak)

```func
() calc_address(cell state_init) {
  var future_address = begin_cell() 
    .store_uint(2, 2) ;; addr_std$10
    .store_uint(0, 1) ;; anycast:(Maybe Anycast)
    .store_uint(0, 8) ;; workchain_id:int8
    .store_uint(cell_hash(state_init), 256) ;; address:bits256
    .end_cell();
}
```

---

### Akıllı sözleşme mantığı nasıl güncellenir

Aşağıda, sayacı artırma ve akıllı sözleşme mantığını güncelleme işlevine sahip basit bir `CounterV1` akıllı sözleşme örneği bulunmaktadır.

```func
() recv_internal (slice in_msg_body) {
    int op = in_msg_body~load_uint(32);
    
    if (op == op::increase) {
        int increase_by = in_msg_body~load_uint(32);
        ctx_counter += increase_by;
        save_data();
        return ();
    }

    if (op == op::upgrade) {
        cell code = in_msg_body~load_ref();
        set_code(code);
        return ();
    }
}
```

> 📌 **Not:** Akıllı sözleşme üzerinde işlem yaptıktan sonra, metreküp azaltma özelliğinin eksik olduğunu fark edersiniz. Akıllı sözleşmenin `CounterV1` kodunu kopyalayıp `increase` işlevinin yanına yeni bir `decrease` işlevi eklemeniz gerekir. Artık kodunuz şu şekilde görünmektedir:

```func
() recv_internal (slice in_msg_body) {
    int op = in_msg_body~load_uint(32);
    
    if (op == op::increase) {
        int increase_by = in_msg_body~load_uint(32);
        ctx_counter += increase_by;
        save_data();
        return ();
    }

    if (op == op::decrease) {
        int decrease_by = in_msg_body~load_uint(32);
        ctx_counter -= decrease_by; ;; burada doğru değişken kullanıldı
        save_data();
        return ();
    }

    if (op == op::upgrade) {
        cell code = in_msg_body~load_ref();
        set_code(code);
        return ();
    }
}
```

`CounterV2` akıllı sözleşmesi hazır olduktan sonra, onu off-chain olarak bir `cell` içerisine derlemeli ve `CounterV1` akıllı sözleşmesine bir güncelleme mesajı göndermelisiniz.

```javascript
await contractV1.sendUpgrade(provider.sender(), {
    code: await compile('ContractV2'),
    value: toNano('0.05'),
});
```

> 📌 **Faydalı bağlantılar**
> 
> `Var olan bir adrese kod yeniden dağıtmak mümkün mü yoksa bu yeni bir sözleşme olarak mı dağıtılmalıdır?`
>
> `"set_code()" belgelerinde`