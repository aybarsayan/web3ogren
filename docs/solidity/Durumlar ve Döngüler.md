# Şartlı Durumlar ve Döngüler

## Şartlı Durumlar

Eğer şu olursa bunu yap anlamına gelen şartlı durumlardır. Bakkal gibi düşünülebilir. Şartlı durumları en iyi örnekler ile anlayabiliriz.

Bir arraydeki sayıların tek mi çift mi olduğuna bakan bir kod yazmak istersek alttaki gibi bir yapı yapmamız gerekmektedir.

```solidity
uint[] public numbers = [1,2,3,4,5,6,7,8,9,10];

funtion isEvenNumber(uint _number) public view returns(bool){
    if(_number % 2 == 8){
        return true;
    }else{
        return false;
    }
}
```
 
Kodumuzu açıklamamız gerekirse, ilk olarak daha önceden öğrendiğimiz array tanımını yaparız. Sonrasında da bir fonksiyon tanımlarız. Bu fonksiyon deploy ekranından içerisine sayı eklememizi sağlamaktadır. Sonrasında koşullu döngümüze başlayabiliriz. Koşullu döngümüz içerisine girdiğimizde `if` yani eğer ifadesinden sonra koşulun parantez içerisinde yazıldığını görüntüleyebiliriz. Koşul yazıldıktan sonra kod bloğu içerisine içerisine koşulun sağlanması durumunda yapmak istediklerimizi yazmaktayız. Kod bloğunu kapattıktan sonra karşımıza `else` yapısı çıkmaktadır. Bu yapı `if` ile belirtilen şartın sağlanmadığı tüm durumları ifade etmektedir. Bu sayede genel kümeyi kapsamış oluruz. 

NOT: Bir sayının çift olup olmadığına gerçek hayattaki 2'ye bölünüp bölünmüyor olmasından bakabiliriz. Bu işlemi kontrol etmek için `%` ifadesini kullanırız. 

Bu işlemi deploy ekranından da kontrol edebileceğimiz gibi aynı anda döngüler ile de kontrol edebiliriz.

---

## Döngüler

Döngüler belirli sayıda elemanı bulunan arrayleri alarak bu arraydeki her bir eleman için bir işlem gerçekleştiren kod elemanlarıdır. 

Döngüleri denemek için de alt kısımdaki döngü örneği kontrol edilebilir.

```solidity
function countEvenNumbers() public view returns(uint){
    uint count = 0;

    for(uint i = 0; i < numbers.lenght, i++) {
        if(isEvenNumber(numbers[i])) {
            count+;
        }
    }
    return count;
}
```

Yukarı kısımda normalden daha uzun bir kod parçası karşımıza çıkmaktadır. Bu kodu sırasıyla incelersek ilk önce normalde oluşturduğumuz şekli ile bir fonksiyon oluşturmak ile başlamaktayız. Sonrasında fonksiyon içerisinde bir değişken tanımlamaktayız. Bu degişken dizinde kaç adet çift sayı olduğunu ifade etmektedir. Sonrasında karşımıza `for` döngüsü gelmektedir. For döngüsü `if` döngüsüne benzer bir şekilde parantez içerisinde bazı şartlar almaktadır. Bu şartlara sırasıyla bakılacak olunursa:

- i adında bir integer değeri tanımla ve bunu sıfıra eşitle

- bu i değeri numbers adı ile daha önceden tanımladığımız arrayin uzunluğundan az olana kadar döngü içerisindeki işlemleri yapmaya devam et.

- i değerini her döngü bir kez gerçekleşince bir arttır.

--- 

Koşullu durumlar ile ilgili olarak bir örnek program da akıllı kontratlarda çokça kullanılan sorgulayanın erişen olup olmaması durumunun `if` döngüsü ile kontrol edilmesidir. Bu işlemi alt kısımda ifade edilen kod ile test edebiliriz.

```solidity
address public owner;
contsturctor(){
    owner = msg.sender;
}

function isOwner() public view returns(bool){
    return(msg.sender == owner)
}
```

Yukarıda yazdığımız kodu inceleyecek olursak, ilk olarak owner adında bir `state varable` oluşturduğumuzu görüntüleyebiliriz. Bu değişkenin içerisine kontratı oluşturan yani sahip olan kişinin adresi gelecektir. Bu nedenle değişkenin tipi `address` olmaktadır. Sonrasında constructor fonskiyon ile karşılaşmakayız. Bu fonksiyon daha önceden de incelediğimiz üzere kontrat çalışmaya başlarken sadece 1 kez çalışmaktadır. Kodu ilk kez çalıştıran da owner olacağı için bizim tam ihtiyacımızı karşılamaktadır. Constructer içerisine girdiğimizde oluşturduğumuz owner değerinin daha önceden de gördüğümüz `msg` global değişkeni içerisindeki `sender` değerine bağlandığını görürüz. Bu sayede tek bir sefer için ownerımzı belirlenmiş olunur. Sonrasında alt kısımlara indiğimizde yeni bir fonksiyon tanımladığımızı görürüz. Bu fonksiyon `bool` adı verilen true false değerlerini çıktı vermektedir. Kod bloğunun içerisine girdiğimizde ise bizleri yeni bir yapı karşılamaktadır. Bu yapıda harici bir if else döngüsü kullanmadan `==` ile iki değerin birbirine eşitliğini kontrol edebiliriz. Eğer eşitse fonksiyon `true` döndürecektir, eğer eşit değilse `false` döndürecektir.

