# TVM ve EVM

Ethereum Sanal Makinesi (EVM) ve TON Sanal Makinesi (TVM), akıllı sözleşme kodunu çalıştırmak için geliştirilmiş yığın tabanlı sanal makineleridir. Ortak özelliklere sahip olmalarına rağmen, aralarında dikkate değer farklılıklar vardır.

## Veri Sunumu

### Ethereum Sanal Makinesi (EVM)

1. **Temel Veri Birimleri**
   - EVM, öncelikle Ethereum'un kriptografik işlevlerine (örneğin, Keccak-256 hashing ve eliptik eğri işlemleri) dayalı olarak 256-bit tamsayılar üzerinde çalışır.
   - Veri türleri, esas olarak tamsayılar, baytlar ve bazen bu türlerin dizileri ile sınırlıdır, ancak tümü 256-bit işleme kurallarına uymalıdır.

2. **Durum Depolama**
   - Ethereum blok zincirinin tüm durumu, 256-bit adreslerle 256-bit değerler arasında bir eşleme olarak tutulur. Bu eşleme, Merkle Patricia Trie (MPT) olarak bilinen bir veri yapısında korunur.
   - MPT, Ethereum'un blok zinciri durumunun tutarlılığını ve bütünlüğünü kriptografik doğrulama ile kanıtlamasına olanak tanır; bu, Ethereum gibi merkeziyetsiz bir sistem için hayati öneme sahiptir.

   :::info
   MPT'nin sağladığı güvenilirlik, Ethereum sisteminin güvenliği açısından kritik öneme sahiptir.
   ::: 

3. **Veri Yapısı Sınırlamaları**
   - 256-bit kelime kısıtlamalarına yapılan basitleştirme, EVM'nin karmaşık veya özel veri yapılarını doğrudan işlemek için tasarlanmadığı anlamına gelir.
   - Geliştiricilerin genellikle akıllı sözleşmeler içinde daha karmaşık veri yapılarını simüle etmek için ek mantık uygulamaları gerekebilir; bu da gaz maliyetlerini ve karmaşıklığı artırabilir.

### TON Sanal Makinesi (TVM)

1. **Hücre Tabanlı Mimari**
   - TVM, verileri temsil etmek için benzersiz bir "hücre çantası" modelini kullanır. Her hücre, 128 veri baytına kadar içerebilir ve diğer hücrelere kadar 4 referansa sahip olabilir.
   - Bu yapı, TVM'nin keyfi cebirsel veri türlerini ve daha karmaşık yapılar olan ağaçlar veya yönlendirilmiş döngüsel grafikler (DAG'lar) gibi yapıları yerel olarak desteklemesine olanak tanır.

2. **Esneklik ve Verimlilik**
   - Hücre modeli önemli esneklik sağlar, böylece TVM, EVM'den daha doğal ve verimli bir şekilde çok çeşitli veri yapılarını işleyebilir.
   - **Örnek:** Hücre referansları aracılığıyla bağlantılı yapılar oluşturma yeteneği, belirli türdeki uygulamalar için yani merkeziyetsiz sosyal ağlar veya karmaşık merkeziyetsiz finans (DeFi) protokolleri gibi uygulamalar için kritik olan dinamik ve potansiyel olarak sonsuz veri yapıları sağlar.

3. **Karmaşık Veri Yönetimi**
   - Karmaşık veri türlerini VM mimarisi içinde yönetme yeteneği, akıllı sözleşmelerde geçici çözüm uygulamalarına olan ihtiyacı azaltarak potansiyel olarak yürütme maliyetini düşürür ve yürütme hızını artırır.
   - TVM'nin tasarımı, karmaşık durum yönetimi veya iç içe geçmiş veri yapıları gerektiren uygulamalar için özellikle avantajlıdır ve geliştiricilerin karmaşık ve ölçeklenebilir merkeziyetsiz uygulamalar inşa etmeleri için sağlam bir temel sağlar.

## Yığın Makinesi

### Ethereum Sanal Makinesi (EVM)

- EVM, bir son giren ilk çıkar (LIFO) yığını kullanarak hesaplamayı yönetir.
- İşlemleri, yığın içindeki tüm öğeler için standart boyut olan 256-bit tamsayıları iterek ve çekerek işler.

### TON Sanal Makinesi (TVM)

- TVM de yığın tabanlı bir makine olarak çalışır, ancak önemli bir farklılıkla: hem 257-bit tamsayıları hem de hücre referanslarını destekler.
- Bu, TVM'nin bu iki farklı veri türünü yığına itip çekmesine olanak tanır ve doğrudan veri maniplasyonu konusunda daha fazla esneklik sağlar.

### Yığın İşlemlerinin Örneği

Eğer EVM'de iki sayıyı (2 ve 2) toplamak istiyorsak, süreç sayıları yığına itmek ve ardından `ADD` talimatını çağırmak olacaktır. Sonuç (4) yığının en üstünde kalacaktır.

Bu işlemi TVM'de de aynı şekilde yapabiliriz. Ancak, hücre referansı gibi daha karmaşık veri yapılarını içeren başka bir örneğe bakalım. Diyelim ki anahtar-değer çiftlerini saklayan bir hashmap'imiz var, burada anahtarlar tamsayılar ve değerler ya tamsayılar ya da hücre referanslarıdır. Hashmap'imizin aşağıdaki girişleri içerdiğini varsayalım:

```js
{
    1: 10,
    2: cell_a (10 içeren hücre)
}
```

Anahtarlar 1 ve 2 ile ilişkili değerleri toplamak ve sonucu anahtar 3 ile saklamak istiyoruz. Yığın işlemlerine bakalım:

1. Anahtar 1'i yığına it: `stack` = (1)
2. Anahtar 1 için `DICTGET` çağır: (yığının en üstündeki anahtarla ilişkili değeri alır): Değer 10’u alır. `stack` = (10)
3. Anahtar 2'yi yığına it: `stack` = (10, 2)
4. Anahtar 2 için `DICTGET` çağır: Cell_A'nın referansını alır. `stack` = (10, Cell_A)
5. Cell_A'dan değeri yükle: Hücre referansından değeri yüklemek için bir talimat yürütülür. `stack` = (10, 10)
6. `ADD` talimatını çağır: `ADD` talimatı yürütüldüğünde, TVM yığından üstteki iki öğeyi poplayacak, bunları toplayacak ve sonucu yığına itecektir. Bu durumda, üstteki iki öğe 10 ve 10'dur. Toplama işleminden sonra yığın sonucu içerecek: `stack` = (20)
7. Anahtar 3'ü yığına it: `stack` = (20, 3)
8. `DICTSET` çağır: 20’yi anahtar 3 ile saklar. Güncellenmiş hashmap:

```js
{
    1: 10,
    2: cell_a,
    3: 20
}
```

EVM'de aynı şeyi yapmak için, anahtar-değer çiftlerini saklayan bir haritalama tanımlamamız ve doğrudan haritalama içinde depolanan 256-bit tamsayılarla çalıştığımız bir işlev oluşturmalıyız. EVM, daha karmaşık veri yapıları aracılığıyla Solidity'i kullanarak karmaşık veri yapıları desteklese de, bu yapılar EVM'nin daha basit veri modelinin üzerine inşa edilmiştir ve bu, TVM'nin daha ifade edici veri modelinden köklü bir şekilde farklıdır.

## Aritmetik İşlemler

### Ethereum Sanal Makinesi (EVM)

- Ethereum Sanal Makinesi (EVM), aritmetiği 256-bit tamsayılar kullanarak yönetir; bu da toplama, çıkarma, çarpma ve bölme gibi işlemlerin bu veri boyutuna göre düzenlenmiş olduğu anlamına gelir. 

### TON Sanal Makinesi (TVM)

- TON Sanal Makinesi (TVM), 64-bit, 128-bit ve 256-bit tamsayılar, hem işaretli hem de işaretsiz, ayrıca modülüs işlemleri gibi daha çeşitli bir dizi aritmetik işlemi destekler. TVM ayrıca, sabit noktalı aritmetiği uygulamak için özellikle yararlı olan çarpma-sonra-bit kaydırma ve bit kaydırma-sonra-bölme gibi işlemler ile aritmetik yeteneklerini daha da geliştirmektedir. Bu çeşitlilik, geliştiricilere akıllı sözleşmelerinin belirli gereksinimlerine dayalı olarak en verimli aritmetik işlemleri seçme imkanı tanır ve veri boyutu ve türüne göre olası optimizasyonlar sunar.

## Taşma Kontrolleri

### Ethereum Sanal Makinesi (EVM)

- EVM'de, taşma kontrolleri sanal makine tarafından doğrudan yapılmaz. Solidity 0.8.0 ile birlikte, güvenliği artırmak için dil içinde otomatik taşma ve alt taşma kontrolleri entegre edilmiştir. Bu kontroller, aritmetik işlemlerle ilgili yaygın güvenlik açıklarını önlemeye yardımcı olur ancak daha eski sürümler (solidity'nin) bu önlemlerin manuel olarak uygulanmasını gerektirir. 

### TON Sanal Makinesi (TVM)

- TVM, bunun aksine, tüm aritmetik işlemler için otomatik taşma kontrolleri gerçekleştirir; bu, sanal makineye doğrudan entegre edilmiş bir özellik. Bu tasarım tercihi, akıllı sözleşmelerin geliştirilmesini kolaylaştırarak hata riskini azaltır ve kodun genel güvenilirliğini ve güvenliğini artırır.

## Kriptografi ve Hash Fonksiyonları

### Ethereum Sanal Makinesi (EVM)

- EVM, secp256k1 eliptik eğrisi ve keccak256 hash fonksiyonu gibi Ethereum'a özgü kriptografi şemalarını destekler. Ayrıca, EVM'nin öğelerin bir sete üyeliğini doğrulamak için kullanılan kriptografik kanıtlar olan Merkle kanıtları için yerleşik desteği yoktur.

### TON Sanal Makinesi (TVM)

- TVM, Curve25519 gibi önceden tanımlanmış eğriler için 256-bit Eliptik Eğri Kriptografisini (ECC) destekler. Ayrıca, hızlı zk-SNARK'lar (sıfır-knowledge kanıtları) uygulamaları için yararlı olan bazı eliptik eğrilerde Weil eşlemeleri destekler. SHA256 gibi popüler hash fonksiyonları da desteklenir ve kriptografik işlemler için daha fazla seçenek sunar. Ayrıca, TVM Merkle kanıtlarıyla çalışabilir ve belirli kullanım durumlarına yararlı olabilecek ek kriptografik özellikler sağlar; örneğin, bir işlemin bir blokta yer aldığını doğrulama.

## Yüksek Seviyeli Diller

### Ethereum Sanal Makinesi (EVM)

- EVM esas olarak, JavaScript ve C++'a benzer statik tiplenmiş, nesne yönelimli bir dil olan Solidity'yi yüksek seviyeli dili olarak kullanır. Ayrıca, Ethereum akıllı sözleşmeleri yazmak için Vyper, Yul gibi diğer diller de mevcuttur.

### TON Sanal Makinesi (TVM)

- TVM, TON akıllı sözleşmelerini yazmak için tasarlanmış yüksek seviyeli bir dil olan FunC'yi kullanır. Statik türleri ve cebirsel veri türlerini destekleyen prosedürel bir dildir. FunC, Fift'e derlenir; Fift ise TVM byte koduna derlenir.

## Sonuç

Özetle, hem EVM hem de TVM, akıllı sözleşmeleri yürütmek için tasarlanmış yığın tabanlı makineler olmasına rağmen, TVM daha fazla esneklik, daha geniş bir veri türleri ve yapıları yelpazesi, yerleşik taşma kontrolleri ve gelişmiş kriptografik özellikler sunar.

:::note
TVM'nin parçalama bilincine sahip akıllı sözleşmeleri desteklemesi ve benzersiz veri temsil yaklaşımı, onu belirli kullanım durumlarına ve ölçeklenebilir blok zinciri ağlarına daha uygun hale getirir.
:::