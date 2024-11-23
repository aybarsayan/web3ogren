# Solidity vs FunC

Akıllı sözleşme geliştirme, Ethereum için Solidity ve TON için FunC gibi önceden tanımlanmış dillerin kullanılmasını içerir. Solidity, C++, Python ve JavaScript'ten etkilenen, nesne yönelimli, yüksek seviyeli, kesinlikle tipli bir dildir ve özellikle Ethereum blok zinciri platformlarında yürütülen akıllı sözleşmeleri yazmak için tasarlanmıştır.

FunC, TON Blockchain üzerinde akıllı sözleşmeleri programlamak için kullanılan yüksek seviyeli bir dildir ve C benzeri, alan spesifik, statik tipli bir dirdir.

Aşağıdaki bölümlerde bu dillerin veri türleri, depolama, fonksiyonlar, akış kontrol yapıları ve sözlükler (hashmap) gibi aşağıdaki yönleri kısaca analiz edilecektir.

## Depolama düzeni

Solidity, tüm durum değişkenlerinin tek bir sürekli bellekte depolandığı düz bir depolama modeli sağlar ve bu belleğe depolama denir. Depolama, her anahtarın depolama slot numarasını temsil eden 256 bit (32 byte) bir tam sayı olduğu ve her değerin o slotta depolanan 256 bit kelime olduğu bir anahtar-değer deposudur. Slotlar sıfırdan başlayarak art arda numaralandırılır ve her slot tek bir kelime depolayabilir. Solidity, programcının depolama düzenini belirtmesine olanak tanır; durum değişkenlerini tanımlamak için `storage` anahtar kelimesinin kullanılmasını gerektirir. Değişkenlerin tanımlanma sırası, onların depolamadaki konumlarını belirler.

:::info
Her slotun yalnızca 256 bit veri depolayabileceğini göz önünde bulundurun; dolayısıyla, büyük veri setleri için farklı stratejiler düşünmeniz gerekebilir.
:::

TON Blockchain üzerindeki kalıcı depolama verileri bir hücre olarak depolanır. Hücreler, yığın tabanlı TVM'de bellek rolü oynar. Bir hücre dilim haline dönüştürülebilir ve ardından hücreden dilim yüklenerek veri bitleri ve diğer hücrelere olan referanslar elde edilebilir. Veri bitleri ve diğer hücrelere olan referanslar bir yapıcıya depolanabilir ve ardından yapılandırıcı yeni bir hücreye sonlandırılabilir.

## Veri türleri

Solidity, aşağıdaki temel veri türlerini içerir:
- İşaretli/İşaretsiz tam sayılar
- Boolean
- **Adresler** – Ethereum cüzdanı veya akıllı sözleşme adreslerini depolamak için kullanılır, genellikle yaklaşık 20 byte civarındadır. Bir adres türü, yalnızca cüzdan adreslerini saklamak ve transfer ve gönderim kripto fonksiyonlarını kullanmak için sınırladığı için "payable" anahtar kelimesi ile eklenebilir.
- Bayt dizileri – "bytes" anahtar kelimesi ile tanımlanır, 32'ye kadar önceden tanımlanmış bayt sayısını depolamak için kullanılan sabit boyutlu bir dizidir.
- **Literaller** – adresler, rasyoneller ve tam sayılar, dizeler, unicode ve onaltılılar gibi değişmez değerlerdir ve bir değişkende saklanabilir.
- Enumlar
- Diziler (sabit/dinamik)
- Yapılar
- Haritalar

FunC için ana veri türleri şunlardır:
- Tam sayılar
- Hücre – TON opak veri yapısı için temel, 1.023 bite kadar ve diğer hücrelere 4 referansa kadar içerebilir
- Dilim ve Yapıcı – hücrelerden okumak ve yazmak için özel nesneler,
- Devam – yürütmeye hazır TVM bayt kodunu içeren bir diğer hücre türü
- Demetler – 255 bileşene kadar, olasılıkla farklı değer türlerine sahip düzenli bir koleksiyondur.
- Tenserler – kütle ataması için hazır bir düzenli koleksiyondur: (int, int) a = (2, 4). Tensor türünün özel bir durumu birim türüdür (). Bir fonksiyonun hiçbir değer döndürmediğini veya argümanlarının olmadığını temsil eder.

:::note
Şu anda, FunC özel türleri tanımlama desteğine sahip değildir.
:::

### Ayrıca Bakınız

- `Statements`

## Değişkenlerin Tanımlanması ve Kullanımı

Solidity, her değişkenin türünün tanımlandığı statik tipli bir dildir.

```js
uint test = 1; // İşaretsiz tamsayı türünde bir değişken tanımlama
bool isActive = true; // Mantıksal değişken
string name = "Alice"; // Dize değişken
```

FunC, daha soyut ve işlev odaklı bir dildir, dinamik tiplemeyi ve işlevsel programlama tarzını destekler.

```func
(int x, int y) = (1, 2); // İki tam sayı değişkeni içeren bir demet
var z = x + y; // Dinamik değişken tanımı
```

### Ayrıca Bakınız

- `Statements`

## Döngüler

Solidity `for`, `while` ve `do { ... } while` döngülerini destekler.

Bir şeyi 10 kez yapmak istiyorsanız, bunu şu şekilde yapabilirsiniz:

```js
uint x = 1;

for (uint i; i < 10; i++) {
    x *= 2;
}

// x = 1024
```

FunC ise `repeat`, `while` ve `do { ... } until` döngülerini destekler. For döngüsü desteklenmemektedir. Yukarıdaki örnekteki kodu FunC'ta çalıştırmak istiyorsanız `repeat` kullanabilirsiniz.

```func
int x = 1;
repeat(10) {
  x *= 2;
}
;; x = 1024
```

### Ayrıca Bakınız

- `Statements`

## Fonksiyonlar

Solidity, fonksiyon tanımlarına hem netlik hem de kontrolü birleştirerek yaklaşır. Bu programlama dilinde, her fonksiyon "function" anahtar kelimesi ile başlar, ardından fonksiyon adı ve parametreleri gelir. Fonksiyonun gövdesi süslü parantezler içinde yer alır ve işlem kapsamını açıkça tanımlar. Ayrıca, dönen değerler "returns" anahtar kelimesi ile belirtilir. Solidity'yi diğerlerinden ayıran şey, fonksiyon görünürlüğünün kategorilendirilmesidir; fonksiyonlar `public`, `private`, `internal` veya `external` olarak belirlenebilir ve diğer sözleşmeler veya dış varlıklar tarafından ne zaman erişileceğini ve çağrılacağını belirler. Aşağıda Solidity dilinde küresel değişken `num`'u ayarladığımız bir örnek verilmiştir:

```js
function set(uint256 _num) public returns (bool) {
    num = _num;
    return true;
}
```

FunC'a geçiş yapıldığında, FunC programı esasen bir dizi fonksiyon tanımı/tanımlaması ve küresel değişken tanımıdır. FunC fonksiyon tanımı tipik olarak isteğe bağlı bir tanımlayıcı ile başlar, ardından dönüş türü ve fonksiyon adı gelir. Parametreler listelenir ve tanım, `impure`, `inline/inline_ref`, ve `method_id` gibi çeşitli belirleyicilerle sonlanır. Bu belirleyiciler, fonksiyonun görünürlüğünü, sözleşme depolamasını değiştirme yeteneğini ve inline davranışını ayarlamaktadır. Aşağıda, FunC dilinde bir hücreye kalıcı depolama değişkeni kaydettiğimiz bir örnek verilmiştir:

```func
() save_data(int num) impure inline {
  set_data(begin_cell()
            .store_uint(num, 32)
           .end_cell()
          );
}
```

### Ayrıca Bakınız 

- `Functions`

## Akış kontrol yapıları

Kıvrımlı parantezler ile bildiğimiz kontrol yapılarının çoğu Solidity'de mevcuttur: `if`, `else`, `while`, `do`, `for`, `break`, `continue`, `return`, C veya JavaScript'ten bilinen yaygın anlamlarla.

FunC klasik `if-else` ifadelerini, `ifnot`, `repeat`, `while` ve `do/until` döngülerini destekler. Ayrıca v0.4.0'dan itibaren `try-catch` ifadeleri de desteklenmektedir.

### Ayrıca Bakınız

- `Statements`

## Sözlükler

Sözlük (hashmap/mapping) veri yapısı, Solidity ve FunC sözleşme geliştirme için çok önemlidir, çünkü geliştiricilerin akıllı sözleşmelerde, özellikle bir anahtar ile ilgili verileri etkin bir şekilde saklayıp alabilmelerini sağlar, örneğin bir kullanıcının bakiyesi veya bir varlığın sahipliği gibi.

Mapping, Solidity'de anahtar-değer çiftleri olarak veri saklayan bir hash tablosudur; anahtar, referans türleri hariç, herhangi bir yerleşik veri türü olabilir ve veri türünün değeri herhangi bir türde olabilir. Haritalar, genellikle Solidity'de ve Ethereum blok zincirinde, belirli bir değere karşılık gelen bir Ethereum adresini bağlamak için kullanılır. Herhangi bir başka programlama dilinde, bir mapping bir sözlük ile eşdeğerdir.

Solidity'de haritalar uzunluğa sahip değildir ve bir anahtar veya değer belirleme kavramına sahip değildir. Haritalar, yalnızca depolama referans türleri olarak işlev gören durum değişkenlerine uygulanabilir. Haritalar başlatıldığında, her olası anahtarı içerir ve değerleri sıfır olan byte gösterimleri ile eşleştirilir.

FunC'teki haritalara karşılık gelen bir benzetme, sözlüklerdir veya TON hashmap'leridir. TON bağlamında, bir hashmap bir hücre ağacı tarafından temsil edilen bir veri yapısıdır. Hashmap, anahtarları, hızlı arama ve değiştirme olanağı sunacak şekilde, herhangi bir türden değerlere eşler. TVM'deki bir hashmap'ın soyut temsili bir Patricia ağacı veya kompakt bir ikili trie'dir. 

:::warning
Potansiyel olarak büyük hücre ağaçları ile çalışmak birkaç sorun yaratabilir. Her güncelleme işlemi, önemli sayıda hücre oluşturur (her oluşturulan hücre 500 gaz maliyetindedir), bu da bu işlemlerin dikkatsizce kullanılması durumunda kaynakları tüketebileceği anlamına gelir. Gaz limitini aşmamak için, tek bir işlemde kesin sayıda sözlük güncellemelerini sınırlayın.
:::

Ayrıca, `N` anahtar-değer çifti için bir ikili ağaç, `N-1` çatala sahiptir; bu da toplamda en az `2N-1` hücre gerektirdiği anlamına gelir. Bir akıllı sözleşmenin depolaması `65536` benzersiz hücre ile sınırlıdır; bu nedenle, sözlükteki maksimum kayıt sayısı `32768`'dir veya tekrarlayan hücreler varsa biraz daha fazla olabilir.

### Ayrıca Bakınız 

- `Dictionaries in TON`

## Akıllı sözleşme iletişimi

Solidity ve FunC, akıllı sözleşmelerle etkileşim kurma konusunda farklı yaklaşımlar sunar. Ana fark, sözleşmeler arasında çağırma ve etkileşim mekanizmalarındadır.

Solidity, sözleşmelerin birbiriyle yöntem çağrıları yoluyla etkileşime girdiği nesne yönelimli bir yaklaşım kullanır. Bu, geleneksel nesne yönelimli programlama dillerindeki yöntem çağrılarına benzer.

```js
// Dış sözleşme arayüzü
interface IReceiver {
    function receiveData(uint x) external;
}

contract Sender {
    function sendData(address receiverAddress, uint x) public {
        IReceiver receiver = IReceiver(receiverAddress);
        receiver.receiveData(x);  // Sözleşme fonksiyonunun doğrudan çağrısı
    }
}
```

FunC, TON blok zinciri ekosisteminde kullanıldığında, akıllı sözleşmeler arasında çağırma ve etkileşim sağlamak üzere mesajlar üzerine inşa edilmiştir. Yöntemleri doğrudan çağırmak yerine, sözleşmeler birbirine mesaj gönderir; bu mesajlar veri ve yürütme için kod içerebilir.

Bir akıllı sözleşme göndericisinin, bir numara ile bir mesaj göndermesi ve alıcının bu numarayı alarak üzerinde bazı işlemler yapması gerektiğini düşünelim.

Öncelikle akıllı sözleşme alıcısı, mesajları nasıl alacağını tanımlamalıdır.

```func
() recv_internal(int my_balance, int msg_value, cell in_msg, slice in_msg_body) impure {
    int op = in_msg_body~load_uint(32);
    
    if (op == 1) {
        int num = in_msg_body~load_uint(32);
        ;; bazı işlemler yap
        return ();
    }

    if (op == 2) {
        ;;...
    }
}
```

Hedef sözleşmede bir mesajın nasıl alındığını daha ayrıntılı bir şekilde tartışalım:
1. `recv_internal()` - bu işlev, bir sözleşme doğrudan blok zincirinde erişildiğinde çalışır. Örneğin, bir sözleşme bizim sözleşmemize eriştiğinde.
2. İşlev, sözleşmenin bakiyesinin miktarını, gelen mesajın miktarını, orijinal mesajı içeren hücreyi ve alınan mesajın yalnızca gövdesini depolayan `in_msg_body` dilimini kabul eder.
3. Mesaj gövdemiz iki tamsayıyı depolayacaktır. İlk sayı, gerçekleştirilecek `işlem` veya çağrılacak akıllı sözleşme `metodu` olarak tanımlanan 32 bit işaretsiz tam sayıdır. Solidity ile bazı benzetmeler yapabiliriz ve `op`'u bir fonksiyon imzası olarak düşünebiliriz. İkinci sayı ise üzerinde bazı işlemler gerçekleştirmek istediğimiz sayıdır.
4. Sonuçlanan dilimden `op` ve `sayı`yı okumak için `load_uint()` kullanırız.
5. Sonra, sayıda, (bu işlevselliği bu örnekte atladık) bazı işlemler yaparız.

Sonrasında, göndericinin akıllı sözleşmesi, mesajı doğru bir şekilde göndermelidir. Bu, bir argüman olarak bir serileştirilmiş mesaj bekleyen `send_raw_message` ile gerçekleştirilebilir.

```func
int num = 10;
cell msg_body_cell = begin_cell().store_uint(1,32).store_uint(num,32).end_cell();

var msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; burada, alıcının adresini sabitliyoruz
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(msg_body_cell)
        .end_cell();

send_raw_message(msg, mode);
```

Alıcıya mesaj göndermek için akıllı sözleşmemizin nasıl göründüğünü daha ayrıntılı olarak tartışalım:
1. İlk olarak, mesajımızı inşa etmemiz gerekiyor. Gönderim yapısının tam yapısını `burada` bulabilirsiniz. Burada nasıl birleştirileceğine dair ayrıntılara girmeyeceğiz, bu konuda linkte okuyabilirsiniz.
2. Mesajın gövdesi bir hücreyi temsil eder. `msg_body_cell` içinde şunları yaparız: `begin_cell()` - gelecekteki hücre için bir `Builder` oluşturur, ilk `store_uint` - ilk uint'i `Builder` içine depolar (1 - bu bizim `op`), ikinci `store_uint` - ikinci uint'i `Builder` içine depolar (num - bu bizim alıcı sözleşmemizde üzerinde çalışacağımız numara), `end_cell()` - hücreyi oluşturur.
3. `recv_internal` içinde gelen mesajda gövdeyi eklemek için, topladığımız hücreyi mesaj içerisinde `store_ref` ile referans gösteririz.
4. Bir mesaj gönderilir.

:::tip
Bu örnek, akıllı sözleşmelerin birbirleriyle nasıl iletişim kurabileceğini sunar.
:::

### Ayrıca Bakınız 

- `Internal Messages`
- `Sending Messages`
- `Non-bouncable messages`