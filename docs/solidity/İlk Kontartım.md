# İlk Solidity Kontratım

## Solidity Nedir?
Solidity Etherium ve deiğer EVM destekli akıllı kontratlarını yazmamızı sağlayan ana yazılım dilidir.

Obje yönelimli ve high-level bir dildir. Python ve JavaScript gibi dillerden esinlendiği için yeni başlayanlar için arkadaş canlısıdır.

Kodlamaya başladığımızda tüm kodumuzu `remix` adı verilen tarayıcıda açılan bir IDE'de yazacağımızı görüntüleyebiliriz. Bu siteye erişmek için https://remix.ethereum.org/ sitesini ziyaret edebilirsiniz.

---

İlk olarak kontratımız için bir dosya açarak işe başlamamız gerekmektedir. Bu işlemi gerçekleştirmek için remix'in içerisinde `contrats` klasörünün içerisine yeni bir dosya oluşturabiliriz. Şimdilik bu dos Bu isimlendirme birkaç aşamadan geçmektedir.

- Kontratların isimleri büyük harf ile başlamalıdır

- Kontatlar `.sol` uzantısı ile bitmelidir.

Solidity akıllı kontratı içerisinde yapmamız gereken ilk şey Solidity'nin hangi sürümünde olduğumuzu belirtmektir. Bu işlemi `pragma` operatörü ile gerçekleştiriririz.

```Solidity
pragma solidity ^0.8.0;
```

Her bir yeni solidity versiyonu ile yeni özellikler geldiği için bu şekilde bir tanım yapmak önemli olmaktadır.

Kontartı oluşturmak için diğer kodlama dillerinde alıştığımız fonksiyon yapısına benzer bir yapı kurmamız gerekmektedir. Bu işlemi `contract` anahtar kelimesi ile gerçekleştirebiliriz. Bu anahtar kelimenin sonrasında dosya isminde de kullandığımız dosya isminin gelmesi gerekmektedir. Bu isim bizim durumumuz için `Counter` olmaktadır. Sonrasında süslü parantez ile kod bloğunu açarak akıllı kontartımızın yazılacağı alanı hazırlamış oluruz.

```solidity
contract Counter{
    //Tüm kodlar burada yer alacaktır.
}
```

Solidity'nin kendi sayfasında da belirtildiği üzere Solidity nesne yönelimli bir programlama dilidir. Bu nedenle Solidity her bir kontarta obje gözüyle bakar. Bu bakış sayesinde kalıtım yapabilir ve başka kontartları çağırabilir. 

Artık yazacağımız akıllı kontartın hangi işlemi yapacağını düşünebiliriz. Yazacağımız akıllı kontrat blokzincir içerisinde bir veriyi tutup bizim istediğimiz şekillerde arttıran azaltan bir sayıcı olacaktır. 

İlk olarak kontartımız içerisinde bir değişken tanımlamamız gerekmektedir. Bu değişkeni tanımalarken birkaç adıma dikkat etmemiz gerekmektedir.

- İlk olarak contact bloğu içerisinde yazdığımız her şey `state variable` adını alır ve blokzincir içerisinde kaydedilir.

- Solidity `staticly-typed` bir dil olmaktadır. Bu nedenle bir değişken tanımlarken o değişkenin türününde tanımlanması gerekmektedir. Değişken tanımlandıktan sonra tanımlandığı türden çıkamamaktadır.

```solidity
uint count;
```

Bizim yazacağımız kodda bir değeri arttıracağımız için bir `unsigned integer` yani `uint` tanımlayabiliriz. İşaretsiz integer anlamına gelen bu terim başında `+` veya `-` işareti olmayan sadece pozitif sayılardan ve 0'dan oluşan bir kümedir.

Artık bir fonksiyon oluşturmaya hazır konumdayız. Fonksiyonlar belirli bir işlemi tekrar ve tekrar yazmaktansa tek bir kez yazıp o koda yeniden dönmemizi sağlayan kod bloklarıdır. 

Fonksiyunu tanımlamak için JavaScript gibi dillerden de aşına olabileceğiniz üzere `funtion` anahtar kelimesini kullanmamız gerekmektedir. Sonrasında fonksiyona istediğimiz ismi verebiliriz. Dikkat edilmesi gereken nokta bu isim tanımlandıktan sonra `() ` ifadesinin sona eklenmesidir. Bu ifade parametrelerin geleceği yeri ifade etmektedir. Şu anlık boş bırakılabilir ancak ilerleyen projelerde doldurulacaktır. 

Fonksiyonun adı tanımlandıktan sonra kod blokları açarak içerisine kod yazmaya başlayabiliriz.

```solidity
funtion getCount(){

    // Fonksiyon ile ilgili kod buraya gelecektir.

}
```

Fonksiyonu tanımladıktan sonra içerisini doldurmaya başlayabiliriz. İlk olarak çıktı ile başlayalım. Bizim fonskiyonumuz ne çıktı vermeli? Programımızın çalışma mantığına baktığımızda içerisine girilen değeri her çalıştığında arttıracağını görmekteyiz o zaman bize `count` değerini yani sayaçımızı çıktı verebiliriz.

```solidity
funtion getCount(){
    return count;
}
```

Yukarıda da ifade edildiği üzere çıktı alırken `return` anahtar kelimesini kullanmamız gerekmektedir. Bu kelime türkçeye "geri ver" olarak çevrilebilir. Yani aslında bu anahtar kelime ile biz fonksiyonumuza işlemleri yaptıktan sonra bana "şunu" geri ver demekteyiz.

Fonksiyonumuzun içerisini doldurmaya başladık ancak fonksiyonumuzda birkaç değişiklik daha yapmamız gerekmektedir. 

- Bunlardan ilki fonksiyonumuzun görünürlüğünü ayarlamaktır. Bu işlemi fonksiyon süslü parantezleri açılmadan önce `public` anahtar kelimesi ile gerçekleştirebiliriz. Bu anahtar kelime sayesinde fonksiyonumuzu akıllı kontrat dışarısında da sıkıntı çıkmadan çağırabiliriz. Bu değişikliği yapmadan blokzincir içerisinde gerekli etkileşimlere girmemiz mümkün olmazdı. 

- Diğer yapacağımız değişiklik fonkisyonun içerisindeki değişkenlere direkt olarak zincir üzerinden değişiklik yapmayacağımızı belirten `view` anahtar kelimesidir. Bu işlemi Google drive'da bir dosya gönderirken kimlerin görüp göremeyeceğini kimlerin değiştirebileceğini seçtiğimiz sisteme benzetebiliriz. 

- Son olarak fonksiyonun hangi tür değişken döndüreceğini tanımlamamız gerekmektedir. Bu sayede beklenmedik şekilde farklı bir tipe dönüşen değişken fark edilir ve güvenli bir şekilde hata verilir. Bu işlemi `returns()` metodu ile gerçekleştirmekteyiz. Parantez içerisine hangi türden bir değişken çıktı vereceği girilmelidir.

```solidity
funtion getCount()public view returns(uint){
        return count;
}
```

Bu şekilde bizlere blokzincir içerisindeki değeri gösteren fonksiyonu yazmış bulunmaktayız. Artık bu değişkeni değiştiren kodu yazmamız gerekmektedir. Bu işlemi yapmak için `incrementCount()` adlı bir public fonkisyon tanımlayabiliriz. 

```solidity
function incrementCount() public {
    count = count + 1;
}
```

Yukarıda ifade edildiği şekilde fonksiyon içerisinde count değerini gösterilen eşitliği sağlayarak bir arttırmak mümkündür. Bu adımda fonkisyonlar ile ilgili bilmemiz gereken bazı durumlar daha mevcuttur. Fonksiyonlar iki tipte var olabilirler. Bunlar `read` ve `write` olmaktadır, türkçeye oku ve yaz olarak çevrilebilir. Blokzincirin yapısı gereği kodlarımız çalışırken bazen "Gas" adı verilen bir ücreti ödememiz gerekmektedir. Solidity'de bu ödeme işlemi kod içerisinde sadece bir yazma işlemi varsa talep edilmektedir. Aksi halde okuma işlemleri için bu ücret talep edilmemektedir. Bu bağlamda yazdığımız kodları incelersek ilk yazdığımız `getCount()` fonksiyonu okuma fonksiyonu olarak herhangi bir gas ödemesi beklemdiğini gözlemleyebiliriz. Fakat `incrementCount()` fonksiyonuna baktığımızda `state varable` olan `count` değerini arttırarak zincirde bir yazma işlemi yaptığımızı bu nedenle de ücret ödenmesi gerektiğini gözlemleyebiliriz.


Blokzincir üzerinden count değerini almayı sağlayan ve değiştirmeyi sağlayan bir kod yazmış olsakda `count` değişkeninin başlangıç değerini henüz tanımlamamış olmaktayız. Bu işlemi akıllı kontratların `Yapıcı Fonksiyonları(Constructer Function)` ile gerçekleştireceğiz.

Constructer tanımlamak için özel bir fonksiyon oluşturmamız gerekmektedir. Bu fonksiyonu `constructer()` metodu ile oluşturabiliriz. 

```solidity
constructer() public{
    // Yapıcı işlemler buraya gelecektir.
}
```

Yapıcımızı tanımladıktan sonra içerisine `count` değişkeninin başlangıç değerini ekleyebiliriz.

```solidity
constructer() public{
    count = 0;
}
```

Yapıcı içerisinde yazdığımız her bir kod satırı kontrat çağırılır çağırılmaz işleve girecektir bu nedenle başlangıç değerleri atamamk için son derece uygundur. 


---- 
Akıllı kontratımızı hazırlamış bulunmaktayız. Bu kodu zincire eklememiz için birkaç adım daha gereklidir. Bunlardan ilki kodu makinelerin okuyacağı dile çevirmemiz gerekmektedir. Bu nedenle bize bir `compiler` gerekmektedir. Şanslıyız ki Remix içerisinde bu compiler hali hazırda bulunmaktadır. Bu compiler'a erişmek için ekranın en sol tarafında bulunan ve arama buttonunun altındaki solidity sembolüne basmanız yeterlidir. Compile ettiğimiz kodlar etherium ve tüm EVM uyumlu zincirlerde çalışmaktadır.

Compiler sekmesine geldikten sonra `compile` tuşuna basabiliriz. Tuşa bastıktan sonra karşımıza birkaç uyarının geldiğini görüntüleyebiliriz. Bunlardan ilki lisansımızın olmadığını belirtmektedir. Bu uyarıyı geçirmek için MIT lisansını kullanabiliriz. Altta ifade edilen kodu kodumuzun en üst kısmına eklediğimizde uyarının kaybolduğunu görüntüleyebiliriz. Diğer uyarı şu anlık önemli olmamaktadır.

```solidity
// SPDX-License-Identifier: MIT
```

Başarılı bir şekilde compile edildikten sonra akıllı kontartımızı `bytecode` adı verilen bitlere çevirdiğini görüntüleyebiliriz. Bu kodu yine compiler sekmesinde yanında kopyalama sembolü ile görüntülemek mümkündür. Eğer bu sembole basarsak kontratımızı bytecode olarak kopyalamış oluruz. 

Artık blokzincirimizde hazırladığımız kodu yayınlayabiliriz. Bu işlemi gerçekleştirmek için yan panelden compiler sekmesinin altındaki `deploy` sekmesine giriş yapmamız gerekmektedir. Burada ilk olarak bize hangi makinada çalışacağını sormaktadır. Bu makineler gerçek zinciri taklit eden makinelerdir ve test için kullanılır. Biraz daha alta indiğimizde de deploy buttonu ile karşılaşırız. Bu button sayesinde kodumuzu deploy edebiliriz. 

Deploy tuşuna bastığımızda eğer doğru bir şekilde yazdıysak kontartımızın çalışıyor olması gerekmektedir. Blokzincir üzerindeki her bir işlem kaydedilmektedir ve o işleme özgü hash değeri atanmaktadır. Kodumuz deploy olduktan sonra bu bilgileri çıktı vermektedir. Remix üzerinde bu değere basarsak ayrıntıları görüntüleyebiliriz. Örnek bir çıktı alt kısımda ifade edilmiştir.

```solidity
[vm]
from: 0x5B3...eddC4
to: Counter.(constructor)
value: 0 wei
data: 0x608...70033
logs: 0
hash: 0x72c...51b21
status	true Transaction mined and execution succeed
transaction hash	0x72cfe1f94da111d5f7fa6d94eb37b5c236cbbee1fa86c25743ba7ad093c51b21
from	0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
to	Counter.(constructor)
gas	155325 gas
transaction cost	135065 gas 
execution cost	135065 gas 
input	0x608...70033
decoded input	{}
decoded output	 - 
logs	[]
val	0 wei
```

Kontratımızı deploy ettikten sonra sol sekmenin en altında `Deployed Contracts` başlığı altında eklediğimiz kontartı görüntüleyebiliriz. Bu kontratın üzerine tıkladığımızda hali hazıda oluşturduğumuz fonksiyon isimlerini görüntüleyebiliriz. Bu fonksiyonların isimleri üzerine tıklamak fonksiyonu çalıştırmaya denk gelmektedir. Eğer `getCount` tuşuna basarsak fonksiyonumuz çalışır ve count değerini blokzincirden çekerek bizlere gösterir. Bu değeri çıkan hash değeri üzerine bastıktan sonra altta da ifade edildiği üzere `decoded output` başlığı altında görüntüleyebiliriz.

```solidity
call
[call]
from: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
to: Counter.getCount()
data: 0xa87...d942c
from	0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
to	Counter.getCount() 0xd9145CCE52D386f254917e481eB44e9943F39138
execution cost	23479 gas (Cost only applies when called by a contract)
input	0xa87...d942c
decoded input	{}
decoded output	{
	"0": "uint256: 0"
}
logs	[]
```

0 olarak belirlediğimiz bu değeri az önce çalıştırdığımız fonksiyonun hemen altında bulunan `incrementCount` tuşu ile arttırabiliriz. Bu tuşa bastığımızda hash açıklamasında belirli bir miktar gas harcandığını görüntüleyebiliriz. Ancak yeniden `decoded output` başlığına baktığımızda alt kısımda ifade edildiği üzere herhangi bir değer vermemektedir. Bu durumun nedeni count değerini zincirden çekerek bize gösteren fonksiyonun `getCount` fonksiyonu olmasıdır.

```solidity
[vm]
from: 0x5B3...eddC4
to: Counter.incrementCount() 0xd91...39138
value: 0 wei
data: 0xe50...71b8e
logs: 0
hash: 0x7ea...6fdcb
status	true Transaction mined and execution succeed
transaction hash	0x7ea6a3f636f3c4c75cbb6b82b0f2274c0604f812dea09ee6c159fbe80b76fdcb
from	0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
to	Counter.incrementCount() 0xd9145CCE52D386f254917e481eB44e9943F39138
gas	50044 gas
transaction cost	43516 gas 
execution cost	43516 gas 
input	0xe50...71b8e
decoded input	{}
decoded output	{}
logs	[]
val	0 wei
```

Yeniden `getCount` fonksiyonunu çağırmamız durumunda alt kısımda ifade edildiği üzere count değerinin `decoded output` başlığı içerisinde bir arttığını gözlemleyebiliriz.

```solidity
[call]
from: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
to: Counter.getCount()
data: 0xa87...d942c
from	0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
to	Counter.getCount() 0xd9145CCE52D386f254917e481eB44e9943F39138
execution cost	23479 gas (Cost only applies when called by a contract)
input	0xa87...d942c
decoded input	{}
decoded output	{
	"0": "uint256: 1"
}
logs	[]
```
Görüldüğü üzere kontratımız tamamlanmış olmaktadır ve bu haliyle çalışmaktadır. Ancak birkaç iyileştirme ile kodumuzu daha hızlı çalışan duruma getirip gas ücretini azaltabiliriz. İlk değişiklik olarak `count` değerini 1 arttıran alana `count = count + 1;` şeklinde bir eşitlik konymak yerine `count++;` ifadesini yerleştirebiliriz.

İkinci olarak getCount fonksiyonunu tamamen çıkarabiliriz. Bu işlemi yapmak için tanımladığımız count değişkenini public yapmamız gerekmektedir. Bu şekilde her kod çalıştığında solidity eğer içerisinde count değişkeni geçiyorsa hash açıklamalarına count değerini yerleştirecektir.

```solidity
uint public count;
```

Bir sonraki yapacağımız işlem `constructer()` metodunu kaldırmak olacaktır. Bu işlemi yapabilmemizin nedeni solidity içerisinde inline olarak (yani aynı satır içerisinde) `state varable` değişkenlerine ilk değerini atayabilmemizdir. Bu sayede ek bir fonksiyon kullanmadan tanım içerisinde altta ifade edildiği üzere count değerimizi atayabiliriz.

```solidity
uint public count = 0;
```

Bu işlemleri önceden yapabilsekde yapmamamızın nedeni Solidity içerisindeki konseptlerin daha iyi anlaşılmasıdır.

Eski kod:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter{
    uint count;

    constructor() public {
        count = 0;
    }

    function getCount() public view returns(uint) {
        return count;
    }

    function incrementCount()public{
        count = count + 1;
    }
}
```

Yeni Kod:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter{
    uint public count = 0;


    function incrementCount()public{
        count++;
    }
}
```

Kodumuzu yeniden compiler ederken önceki uyarılar tamamen yok olduğunu görüntüleyebiliriz. Sonrasında deploy ettiğimizde `getCount` fonksiyonunun yok olduğunu görüntüleyebiliriz. Bu değer yerini `count` tuşuna bırakmıştır. Ancak işlevleri aynı kalmaktadır.

---

Bu şekilde Solidity üzerinde ilk akıllı kontartımızı yazmış olduk. Bir sonraki derste değişken ve veri tiplerinden bahsedeceğiz :)
