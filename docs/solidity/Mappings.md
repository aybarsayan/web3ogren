# Mapipings

## Mappingsler Nedir?

Mappingler blokzincir üzerinde key ve value çifti ile veri saklamayı sağlayan veri tipleridir. Pythondaki sözlükler veya JavaScript'teki objeler gibi düşünülebilir. Gerçek hayatta her nasıl türkçe-ingilizce sözlükte `hello` , `merhaba` sözcüğüne karşılık geliyorsa solidity içerisinde mappinglerde de her bir değere karşılık gelen bir anahtar vardır. Veriler birbirine anahtar veri halinde bağlıdır.

Solidity üzerinde mapping değerleri tanımlarken diğer veri tiperinde yaptığımız gibi kaydedeceğimiz verinin tipini belirtmeliyiz. Bu işlemi yapabilmek için `mapping` anahtar kelimesini kullanmaktayız. Bu anahtar kelimeden sonra parantez açarak anahtar ve verinin hangi tiplerde olacağını belirtmemiz gerekmektedir. Sonrasında oluşturduğumuz `mapping` değişkeninine vermek istediğimiz ismi veririz.

```solidity
mapping(uint => string) isimler;
```

Yukarıda verilen kodu okuduğumuzda, isimler adıyla mapping tipinde işartesiz integer değerleri anahtar stringleri veri olarak tutan bir değişken oluşturduğumuzu görürüz.

Mappingler içerisine veri eklerken bu işlemi sadece bir kez çalışacak olan `constructor` fonksiyonları ile yapabiliriz. Bu işlemi alt kısımda verilen kod örneğindeki hali ile yapabiliriz.

```solidity
constructor()  {
    isimler[1] = "Aybars";
    isimler[2] = "İrem";
}
```

Aslında mappinglerin yaptıklarını daha çok günümüz veri tabanlarına benzetmek için `struct` yapılarını kullanabiliriz.

```solidity
struct Book{
    string title;
    string author;
}
```

Bu şekilde kendi veri tipimizi oluştudurktan sonra mapping içerisine olduğu gibi ekleyebiliriz.

```solidity
mapping(uint => Book) public kitabım;
```

Mappinglerin içerisine veri eklemeyi kolaylaştırmak için `addBook` adında bir fonksiyon yazabiliriz. 

```solidity
funtion addBook(uint _id, 
string memory _title, 
string memory _author
)public{
    books[_id] = Book(_title,_author);
}
```

HATIRLATMA: fonksion içerisindeki parametreler local değişkenlerdir.

Solidity içerisinde her nasıl Arraylerin arraylerini oluşturabiliyorsak aynı zamanda mappingleri iç içe de yazabiliriz. Bu işlem genelde token veya NFT'lerde kullanılmaktadır. Bu işlemi gerçekleştirmek için veri kısmına mapping türünde yeni bir değerin girilmesi yeterlidir.

```solidity
mapping(address => mapping(uint => Book)) public kitaplarım;
```

Yukarıda iç içe bir mapping örneği verilmiştir. Bu veriyi JSON formatına benzetebiliriz.

Nasted mappinglere yani iç içe mappinglere ekleme yaparken alt kısımda verildiği üzere bir ekleme yapabiliriz.

```solidity
kitaplarım[msg.sender][_id] = Book(_title, _auther)
```

Üst kısımda verildiği üzere iç içe mappinglerde ekleme yapılabilir. 

NOT: Bu kod bloğu içerisinde `msg.sender` yapısı dikkatinizi çekmiş olabilir. Solidity her akıllı kontratta kod içerisinde direkt olarak yer almasada `msg` adlı bir global değişken tutmaktadırlar. Bu değişken içerisinde kontrat ile alakalı bazı bilgiler tutmaktadır. Bu örneğimizde verilen `msg.sender` yapısı akıllı kontratın hangi kişi tarafından sorgulandığını ifade etmektedir.

Kodumuzu sırasıyla compile ve deploy ile çalıştırıp işlevine bakabiliriz.