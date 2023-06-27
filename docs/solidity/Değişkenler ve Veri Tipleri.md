# Değişkenler ve Veri Tipleri

Değişkenleri ve veri tiplerini yine aynı şekilde Remix üzerinden gerçekleştireceğiz. Remixe girdikten sonra `contracts` klasörü içerisine yeni bir dosya oluşturacağız. İsim olarak daha önce öğrendiğimiz kurallara uygun şekilde baş harfi büyük `MyContract.sol` ismini vereceğiz.

Yine önceden öğrendiğimiz şekilde ilk olarak lisansı ve sürümü en üste tanımlamamız gerekmektedir.

``` solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
```

Bu şekilde projeye girdikten sonra kontratımızı dosya ismini verdiğimiz ad ile obje şeklinde oluşturabiliriz. 

```solidity
contracts MyContract{

}
```

Peki değişkenlerden bahsettik, nedir bu değişkenler? Değişkenler akıllı kontratımız içerisinde değer atayarak yeniden ve yeniden kullanabileceğimiz elemanlardır. Her nasıl fonksiyonlar yeniden ve yeniden kullanabileceğimiz kod parçalarıysa değişkenlerde yeninden ve yeniden kullanabileceğimiz veri elemanlarıdır. 

Değişkenlerden bahsederken `State Variables` ve `Local Variables` başlıklarından bahsetmemiz gerekmektedir. İlk olarak `Local Varaibles` yani yerel değişkenlerden bahsedebiliriz.

Yerel değişkenler solidity fonksiyonları içerisinde yer alan değişkenlerdir. Bir yerel değişken tanımlamak istiyorsak bu işlemi daha önceden de öğrendiğimiz şekilde fonksiyon içerisinde gerçekleştirebiliriz.

```solidity
function getValue() public {
        uint value = 1;
        return value;
    }
```

Yukarıda yazdığımız kod örneğinde value bir yerel değişken (Local Variable) örneğidir. Bu durum beraberinde bazı sıkıntılar ile gelmektedir. Değişkenimiz fonksiyonun içerisinde olduğu için o fonksiyon dışında herhangi bir fonksiyonda yeniden tanımlanmadan kullanılamaz. 

Veriyi tanımlarken aynı zamanda istediğimiz işlemleri de yapabiliriz. Bu şekilde daha kısa satırda kod yazmış oluruz.

Daha önceden yaptığımız gibi fonksiyonun bazı özelliklerini eklememiz gerekmektedir. Bu kısımda karşımıza `view` yerine kullanabileceğimiz farklı bir değer gelmektedir. Bu değer `pure` değeridir. Pure blokzincir içerisinde herhangi bir değişiklik yapmayan fonksiyonlarda kullanılan bir sınıflandırma yöntemidir. Devamında yine aynı şekilde bir fonksiyonun bir çıktı verdiğini belirtmek için `returns(uint)` değerini girmemiz gerekmektedir. Bu durumun nedeni fonksiyonumuzun `uint` değerinde bir çıktı vermesidir.

```solidity
contract MyContract{  
    // Local Değişken
    function getValue() public pure returns(uint){
        uint value = 1;
        return value; 
    }
}
```

State Değişkenlerine baktığımızda aynı şekilde tanımlayabildiğimizi fark ederiz. Önemli olan değişkeni nasıl tanımladığımızdan çok nerede tanımladığımız olmaktadır. State değişkenlerine ise tüm kontrat içerisinde erişmek istediğimiz için `contract` içerisinde tanımlarız.

```solidity
contract MyContract{ 
    // State Değişkeni
    uint myUint public = 1;
}
```

Şimdi Solidity içerisinde yer alan diğer değişken türlerini tanıyabiliriz. Bu işlemi gerçekleştirmek için `uint256` yapısını kullanabiliriz. Bu yapıyı `uint` ile değiştirdiğimizde Solidity bize tam olarak aynı değişkeni verdiğini görürürüz. Bu durumun nedeni `uint` değerinin hali hazırda `uint256` ifadesinin kısaltması olmasıdır. Yani `uint256` işaretsiz integer değerleri için bir standart olmaktadır. 

Integer değerleri bu şekilde sayılar ile 8 bitten 256 bite kadar değer alabilir. Ancak artışları 2'nin kuvvetlerine göre olmalıdır. Buradaki sayı bizim için değişkenin bit uzunluğunu ifade etmektedir. uint8 değeri işaretsiz 8 bitten oluşan bir değişkeni ifade ederken int256 değeri 256 bitten oluşan işaretli bir integer değişkeni ifade eder.

```solidity
uint8 A1;
uint16 A2;
uint32 A3;
uint64 A4;
uint128 A5;
uint256 A6;

int8 B1;
int16 B2;
int32 B3;
int64 B4;
int128 B5;
int256 B6;
```

Peki neden kullandığımız değişkenlerin boyutu bizim için önemlidir? Bu durumun nedeni aslında blokzincir içerisinde kullandığımız verilerin bize maliyet olarak geri gelmesidir. Bu nedenle maliyetleri düşük tutmak için elimizden geldiğince küçük alanda yer alabilecek veriler ile işlem yapmamız gerekmektedir. 

Genel olarak `uint256` yeterli olmaktayken git gide ürüne dönüşen programlarda bu ayrımı yapmak önemli olmaktadır.

---

"Stinglere baktığımızda ise ilk olarak string tanımı ile başlayabiliriz. Stringler iki adet alıntı işareti ("") içerisinde bulunan klavyede yazabildiğimiz rakamlardan harflere noktalama işaretlerinden emojilere her veriyi içeren bir veri tipitir. Tek bir karakter olduğu gibi bir karakter dizisi de olabilir. Hatta ve hatta bu anlatım cümlesinin tamamı bir stringtir! Çünkü başlangıcında ve bitişinde alıntı işareti bulunmakta."

Solidity içerisinde yine aynı şekilde tanımladığımız değişkenin türünü de belirtmeliyiz. Bu işlemi yaparken her nasıl integer değişkenin başına `uint` ifadesini ekliyorsak string ifadesinin başına da `string` ifadesini ekleyebiliriz.

```solidity
string public myString = "Merhaba Dünya!";
```

String tanımlamayı başka şekilde de gerçekleştirebiliriz. Stringleri aynı zamanda Byte değerleri ile de tanımlayabiliriz. Bytelar'da integer değerleri gibi istenilen büyüklükte ayarlanabilmektedirler.

```solidity
bytes32 public myBytes32 = "Hello, world!";
```

Bu işlem ile string değerimizi daha çok arraylere yakın bir formatta depolayabiliriz. 

---

Aynı zamanda Solidity içerisinde adresleri de bir değişken olarak tutabiliriz. Bu işlemi yapmak için `address` anahtar kelimesini kullanmamız gerekmektedir. Adresler blokzincir içerisinde kullanıcı adına benzemektedir. Adresler ile hesapları eşleştirebilir ve kişileri tanımlayabilirsiniz.

```solidity
address public myAdress = 0x39e0e97F020E779Ce59F82C587dD380753Da0a81;
```

---

Son olarak struct veri yapılarından bahsedebiliriz. Şu ana kadar stringleri ve integerları gördük. Ancak solidity'nin iyi tarafı bu değişkenlere ek olarak kişisel veri tipi oluşturmaya izin vermesidir. Bu veri tipi oluşturmamızı sağlayan yapıya ise `struct` denir. Strucları diğer verileri birleştirerek oluşturabiliriz. 

```solidity
    uint256 public myUint256 = 1;
    string public myString = "Merhaba";

    struct MyStruct{
        uint256 myUint256;
        String myString;
    }

    MyStruct public myStructt = MyStruct(1, "Hello World!");
```

Üst kısımda verilen kod örneğinde de görüldüğü üzere ilk olarak başlangıç değerlerinin belirlendiği değişkenler `myUint256` ve `myString` olarak tanımlanmalıdır. Sonrasında `struct` yapısı içerisinde eklemek istediğimiz değişkenleri yazarız ve en son olarak yaptığımız struct'ı sanki bir değişken türüymüş gibi çağırarak oluşturduğumuz struct türünde bir değişken oluşturmuş hale geliriz.

--- 

## Arrayler

Artık arraylerden bahsedebiliriz. Bu işlemi yine aynı dosyada yapacağız ancak kontratın içerisini temizleyip temiz bir başlangıç yapabiliriz.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract{ 
    
}
```

Peki arrayler nedir? `Arrayler` belirli sayıdaki veriler için sıralı bir şekilde depolama yöntemidir. Aslında arraylere birer liste olarak bakabiliriz.

Bir arrayı tanımlamak için birkaç yöntemimiz vardır. Bunlardan ilki bir sayı dizisi tanımlarken kullanabileceğimiz `uint[]` yapısıdır. Normal bir int türüne göre yanına birer köşeli parantez ekleyerek tanımlamayı sağlayabiliriz.

```solidity
uint[] public uintArray = [1,2,3];
```

Arraylerin içerisindeki veriler birbirinden virgül ile ayırmaktayız. Virgül ile ayrılan her bir değer `array` içerisindeki yeni bir elemanı ifade etmektedir. 

Her bir arrayı tanımlarken içerisinde yer alacak verilerin türlerini de söylememiz gerekmektedir. Bir arrayin içerisinde birden fazla türde eleman bulunanmaz. Bir türden oluşan array yaratmak istiyorsak yanına `[]` eklememiz yeterlidir.

```solidity
string[] public stringArray = ["apple","banana","carrot"];

string [] public myArray; // Boş bir array oluşturdu
```

Artık arrayleri nasıl manupüle edeceğimize geçiş yapabiliriz. İlk olarak arrayımiz içerisine bir bir veri ekleme fonksiyonu yazabiliriz. 

```solidity
function addValue(string memory _value) public {
    myArray.push(_value)
}
```

Yukarıda yazdığımız fonksiyon `myArray` içerisine bir veri eklemektedir. Bu fonksiyonu sırasıyla inceleyecek olursa öncekikle içerisine string değerinde bir değişken tutmak istediğimizi parantezin içerisine `string` yazarak belirtiriz. Sonrasında gelen `memory` ifadesini bilgisayrımızdaki RAM gibi düşünebiliriz. Bu ifade fonskiyonun içerisine girilen verinin zincirde direkt olarak saklanmayacağını ifade etmektedir. Son olarak `_value` ifadesini görmekteyiz. Bu ifade bir fonksiyon girdisidir. Sadece fonksiyon içerisinde anlamlıdır ve sonrasında fonksiyonun içerisine gireceğimiz değeri ifade etmek için kullanır.  Kod bloğunun içerisine girdiğimizde array içerisine `.push()` fonksiyonu ile fonksiyonumuza parametre olarak girilen veriyi ekleyebileceğimizi görüntülemekteyiz.

```solidity
string[] public myString;

function addValue(string memory _value) public{
    myString.push(_value);
}
```

Veri eklediğimize göre şimdi array'in içerisinde kaç adet veri var sayabiliriz. Bu işlemi gerçekleştirmek için `uint` döndüren `public` bir fonksiyon yazabiliriz.

```solidity
function countValue() public view returns(uint){

}
```

Yukarıda da görüntülenebildi üzere fonksiyonumuzu tanımlayabiliriz. Dikkat etmemiz gereken fonksiyonun parametre olarak herhangi bir değer almamasıdır. Ayrıca zincire herhangi bir veri yazmayacağımız için public ifadesinin yanında `view` ibaresini görüntüleyebiliriz.

Fonksiyonun içerisine girdiğimizde arrayimizin uzunluğu almak için `.length()` metodunu kullandığımızı görüntüleyebiliriz. Bu değeri `return` edersek fonksiyonumuz çıktı olarak bu sayıyı döndürecek hale gelmektedir.

```solidity
function countValue() public view returns(uint){
    return myString.length;
}
```

Yukarıda görülen fonksiyonu da contratımıza ekleyip sırasıyla compile ve deploy ettiğimizde Compiler sekmesinde `addValue` değerinin yanında bir kutucuk olduğunu görüntüleyebiliriz. Bu kutucuğa herhangi bir string değeri girerek yanındaki `addValue` düğmesine basarsak verimizin başarılı bir şekilde zincire eklendiğini görüntüleyebiliriz. Ayrıca altında bulunan `valueCount` tuşuna bastığımızda da anlık olarak arrayimizin içerisinde kaç eleman olduğunu okuduğunu görüntüleyebiliriz.

---

Arrayler içerisinde son olarak 2 boyutlu arraylerden bahsedebiliriz. Bu array değerleri iç içe geçmiş iki arrayden oluşmaktadır. Normal array tanımlanır gibi yazıldıktan sonra köşeli parantezlerin yanına bir çift köşeli parantez daha eklenir. Bu şekli ile işaretsiz 256 Bit bir integer 2 boyutlu array oluşturmak istersek alt kısımda kodu girmemiz gerekmektedir.

```solidity
uint256[][] public array2D = [[1,2,3],[4,5,6]]
```

Ayrıca not olarak arraylerin indexlerinin 0'dan başladığını not edebiliriz.