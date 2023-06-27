# Gerçek Hayat Örneği

Bu dosyamızda birlikte önceki öğrendiklerimize birkaç yeni başlık ekleyerek tamamlanmış bir proje üreteceğiz. Bu açıklamamızda ekstra olarak:

- Ether ile ödeme yapma
- Fonksiyon Modifierları
- Fonksiyon Görünürlüğü
- Eventler
- Enumlar

Başlıklarını öğreneceğiz. 

---

Projemizde `HotelRoom.sol` adında bir akıllı kontrat oluşturacağız. Bu kontartı remix içerisinde kontratlar başlığı altında yeni bir kontrat oluşturarak ekleyebiliriz. Her projemize başlarken yaptığımız gibi bu projemize de belirli başlıkları ekleyerek başlayacağız.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HotelRoom{ 

}
```

NOT: Yazacağımız akıllı kontrat bir otel odasının rezerve edilmesine ve açılmasına hizmet edecektir.

__Hadi ilk işlevimiz ile başlayalım.__

İlk olarak ödeme işlemlerinin yapılacağı adresi yani kontartın sahibinin adresini daha önceki örneklerde de gördüğümüz üzere belirlememiz gerekmektedir.

```solidity
address payable public owner;
```

Bu işlem için ilk olarak `adddress` tipine sahip bir `state variable` oluşturmamız gerekmektedir. Bu değişkeni oluştururken `public` ifadesinden önce kullandığımız `payable` anahtar kelimesine dikkat edilmesi gerekmektedir. Bu kelime değişken içerisine eklenen adresin ödemeye açık olduğunu ifade etmektedir.  

Sonrasında `owner` değişkeni içerisine bir adres eklemek için global `msg` değkenine erişen bir `constructer` fonksiyon yazmamız gerekmektedir. 

```solidity
constructor(){
    owner = payable(msg.sender);
}
```

NOT: Constructor fonksiyonunun kullanılma nedeni tek bir sefer çalışmasıdır. 

Artık `Rezerve()` adında yeni bir fonksiyon oluşturup bu fonksiyon içerisinde işlemler yapmaya başlayabiliriz.

```solidity
function rezerve() public{
    
}
```

Sonrasında bu fonksiyonun içerisinde ödeme yapılacak hesaba transferin yapıldığına emin olmamız gerekmektedir. Bu işlem için `transfer` ve `value` değerlerini kullanırız.

```solidity
function rezerve() public{
    owner.transfer(msg.value);
}
```

Yukarıda verilen hali ile owner içerisindeki `transfer` fonksiyonu çalışmaktadır. Peki nedir bu `transfer` fonksiyonu? Transfer fonksiyonu içerisine aldığı (parantez içerisi) miktarı birlikte çağırıldığı adrese - ki bu bizim durumumuzda `owner` - transfer etmektedir. Bu şekilde fonksiyonumuzu ayarladığımızda her `rezerve` fonksiyonu çalışınca çalıştıran hesaptan kripto para çekilmekte olunur. Ancak bu işlemi gerçekleştirmek için aynı zamanda fonksiyonun `payable` olması gerekmektedir.

```solidity
function rezerve() public payable{
    owner.transfer(msg.value);
}
```

Transfer sağlandıktan sonra otel odamızın uygundan, alınmış hale dönmesi gerekmektedir. Bu durumu `enum` yapısı ile kontrol edeceğiz. Peki enum yapıları nedir diye baktığımızda bizleri çevirisi olan `sınıflandırmak` karşılamaktadır. Yapı olarak `bool` değerlerine benzemektedirler. Belirli bir durumun sadece belirli sayıda durumunun olduğunu ifade etmektedirler. Mesela diyelim ki bir oyun yazıyoruz ve oyuncunun oyun içerisinde hangi durumda olduğunu kod içerisinde belirtmek istiyoruz. Bu durumda enum ile oyuncunun durumunu `OYUNDA` , ,`OYUNU DURDURDU` ve `OYUNU KAYBETTİ` durumlarından biri ile kaydedebiliriz. Bu şekilde sonrasında oluşturduğumuz `enum` değerini çağırarak `eğer oyun durumu OYUNDA ise şu işlemi yap` ifadesini kullanabiliriz. Şu anda yazdığımız kodda da odanın durumunu boş ve dolu olarak sınıflandırmak için kullanacağız. 


```solidity
enum Durum {Bos, Dolu}
```
NOT: Kısacası enum asla değişmeyecek sınıflar bütünüdür. Kod bloğu içerisinde yer aldığı için sonuna `;` gerektirmez.

Enum ile durumu oluşturduktan sonra mevcut durumu içerisinde tutacak bir değişken tanımlayabiliriz. 

```solidity
Durum public mevcutDurum;
```

Görüldüğü üzere `enum` olarak tanımladığımız veri tipini kullanan bir değişken tanımlayabiliriz.

Sonrasında `mevcutDurum` değişkenini kod zincire eklenirken çalışacak ve durumu boş olarak gösterecek şekilde `constractor` fonksiyonu içerisine ekleyebiliriz.

```solidity
constructor(){
    owner = payable(msg.sender);
    mevcutDurum = Durum.Bos;
}
```

Şimdi transfer yapıldıktan sonra odanın dolu olduğunu göstermek için `rezerve()` fonksiyonu içerisinde durumu yeniden değiştirmemiz gerekemktedir.

```solidity
function rezerve() public payable{
    mevcutDurum = Durum.Dolu;
    owner.transfer(msg.value);
}
```

Kaba hatlarıyla kodumuz tamamlanmış olsada bazı mantık hatalarının düzeltilmesi gerekmektedir. Bunlar:

- Oda birden fazla kez doldurulmuş mu?
- Oda ne kadar tuttu? 

Olmaktadır. Yani bizim odanın fiyatını ayarlamamız gerekmektedir. Sonrasında da odanın durumunu kontrol etmemiz gerekmektedir. 

İlk olarak odanın durumunu kontrol ederek başlayabiliriz. Bu işlemi gerçekleştirmek için Solidity içerisinde yer alan `require()` fonksiyonunu kullanabiliriz. Bu fonksiyonunun görevi, başka bir fonksiyon içerisine koyulduğunda içerisine girilen şartın `true` veya `false` olduğunu kontrol etmesidir. Eğer ve eğer şart sağlanıyorsa kendisinden sonra gelen kodları çalıştırır. Yani aslında bir `if` kullanmadan `if` döngüsü içerisine alma işlemi gerçekleşmiştir. Eğer işlem sağlanmazsa fonksiyonda kendisinden sonra gelenleri çalıştırmaz. Ayrıca içerisine şarttan sonra ikinci argüman olarak koşulun sağlanmaması durumunda kullanıcıya sunulabilecek bir `string` değerinde mesaj içerebilir. 

```solidity
function rezerve() public payable{
    require(mevcutDurum == Durum.Bos, "Şu anda oda uygun değil.");
    mevcutDurum = Durum.Dolu;
    owner.transfer(msg.value);
    }
```

Require ile mevcut durumu kontrol ettikten sonra fiyatı da kontrol edebiliriz. Fiyat olarak şu anlık 2 ether belirleyebiliriz. Eğer bu sayıdan daha az bir transfer yapılırsa yine require ile diğer işlemlerin gerçekleşmemesini sağlayabiliriz.

```solidity
function rezerve() public payable{
    require(msg.value >= 2 ether, "Yeterli miktar sağlanmadı");
    require(mevcutDurum == Durum.Bos, "Şu anda oda uygun değil.");
    mevcutDurum = Durum.Dolu;
    owner.transfer(msg.value);
    }
```

Yukarıdaki kodda da ifade edildiği üzere `msg.value` ile transfer edilen miktar alındıktan sonra `2 ether` değerine eşit olup olmadığı kontrol edilebilir. Garip bir yazım türü gibi gözüksede Solidity `2 ether` şeklinde yazıldığında 2 adet ether değerine eşit geldiğini anlamaktadır.

--- 
Bir sonraki yapacağımız işlem kontratımızın biraz daha güzel gözükmesini sağlayan `modifier` yapılarıdır. Bu yapılar fonksiyon parçaları gibidir ve fonksiyon tanımlanırken şart olarak sağlanabilir.

```solidity
modifier sadeceBosken{
    require(mevcutDurum == Durum.Bos, "Şu anda oda uygun değil.");
    _;
}
```

Modifier oluşturulduktan sonra fonksiyon içerisinde yer alan boş oda kontrolü yapan `require` fonksiyon içerisinden kesilerek `modifier` içerisine yerleştirilebilir. Ek olarak alt satırda `_;` ifadesinin yer aldığnı görüntüleyebiliriz. Bu kod yeniden fonksiyona dönüş yapılacağını ifade etmektedir. Sonrasında bu modifier `rezerve()` fonksiyonunun tanımı içerisine yerleştirebilir. Bu sayede şart sadece sağlanırsa fonksiyon çalışmış olacaktır.

```solidity
function rezerve() public payable sadeceBosken {
    require(msg.value >= 2 ether, "Yeterli miktar sağlanmadı");
        
    mevcutDurum = Durum.Dolu;
    owner.transfer(msg.value);
    }
```

Aynı işlemler istenilen miktarın sağlanıp sağlanmadığını kontrol ederken de yapılabilir. Fakat farklı olarak bu sefer modifier oda fiyatını girdi olarak alacaktır ve o fiyata göre durum sorgulayacaktır.

```solidity
modifier sadeceBosken{
    require(mevcutDurum == Durum.Bos, "Şuanda oda uygun değil.");
    _;
}
modifier miktarSaglandıgsa(uint _fiyat){
    require(msg.value >= _fiyat, "Yeterlimiktar sağlanmadı");
    _;
}
function rezerve() public payable sadeceBoskenmiktarSaglandıgsa(2 ether){
    mevcutDurum = Durum.Dolu;
    owner.transfer(msg.value);
}
```

Fonksiyonlarımızı biraz daha temizlemeden önce son olarak rezerve alındıktan sonra bir `event` çalışmasını isteyebiliriz. Bu işlemi Soldity içerisinde `event` işlemini kullanarak yapabiliriz.

```solidity
event Doldur(address _misafir, uint _fiyat);
```

Solidity içerisinde eventleri liste olarak düşünebiliriz. Her ne zaman `event` alt kısımda ifade edildiği üzere `emit` edilirse bu listenin içerisine yeni bir eleman eklenmiş olunur.

```solidity
emit Doldur(msg.sender, msg.value);
```

Fonksiyonumuz tamamlanmıştır ancak ek olarak `transfer` fonksiyonu altarnatif `call` fonksiyonlarından biri ile değiştirebiliriz. Transfer fonksiyonları her zaman mükemmel çalışmaya bilirler.

```solidity
(bool sent, bytes memory data) = owner.call{value: msg.value}("");
require(true);
```
Yukarıda normalden biraz daha karışık bir yapı verilmiştir ancak aslında o kadar da karışık olmamaktadır. ilk olarak `owner` içerisinden `call` fonksiyonunu çağırırırız ve değeri de msg.value ile geri göndermiş oluruz. Bu işlem iki adet değere eşit olmaktadır. Bunlardan ilki transferin başarılı olup olmadığını kontrol eden `sent` ibaresi olmaktayken diğeri transferden dönüş alınan veriyi ifade etmektedir. Altında kalan require ile sadece işlem gerçekleştiyse devam edilmesi sağlanmaktadır.

NOT: Son olarak tüm türkçe karakterlerin ingilizceye çevrildiğine emin olarak compile ve depoloy edebilriz.

--- 

Fonksiyonumuzu tamamladık. Şimdi çalışmasına deploy ekranından bakabiliriz. Rezerve etmek için transfer yapılması gerektiğini ve bu transferin de aynı ekrandan yapıldığını unutmamanız gerekmektedir. Tüm kontrat alt kısımda ifade edilmiştir.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HotelRoom{

    enum Durum {Bos, Dolu}
    Durum public mevcutDurum;
    event Doldur(address _misafir, uint _fiyat);
    address payable public owner;
    
    constructor(){
        owner = payable(msg.sender);
        mevcutDurum = Durum.Bos;
    }

    modifier sadeceBosken{
        require(mevcutDurum == Durum.Bos, "Su anda oda uygun degil.");
        _;
    }

    modifier miktarSaglandigsa(uint _fiyat){
        require(msg.value >= _fiyat, "Yeterli miktar saglanmadi.");
        _;
    }

    function rezerve() payable public sadeceBosken miktarSaglandigsa(2 ether){
        mevcutDurum = Durum.Dolu;

        (bool sent, bytes memory data) = owner.call{value: msg.value}("");
        require(true);

        emit Doldur(msg.sender,msg.value);
    }
}

```