# Akıllı Sözleşme Adresleri Belgelendirmesi

Bu bölüm, TON Blockchain üzerindeki akıllı sözleşme adreslerinin spesifik özelliklerini tanımlamaktadır. Ayrıca, aktörlerin TON'daki akıllı sözleşmelerle eşanlamlı olduğunu açıklamaktadır.

## Her Şey Bir Akıllı Sözleşmedir

TON üzerinde, akıllı sözleşmeler `Aktör modeli` kullanılarak oluşturulmaktadır. Aslında, TON'daki aktörler teknik olarak akıllı sözleşme olarak temsil edilmektedir. Bu, cüzdanınızın bile basit bir aktör (ve bir akıllı sözleşme) olduğu anlamına gelir.

Genellikle, aktörler gelen mesajları işler, içsel durumlarını değiştirir ve sonuç olarak dışa mesajlar üretir. Bu nedenle, TON Blockchain üzerindeki her aktörün (yani akıllı sözleşmenin) mesaj alabilmesi için bir adresi olmalıdır.

:::info EVM DENEYİMİ
Ethereum Sanal Makinesi'nde (EVM), adresler akıllı sözleşmelerden tamamen ayrıdır. Solidity geliştiricilerini şaşırtacak TON Blockchain'in ["Altı Benzersiz Özelliği"](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) başlıklı makalemizi okuyarak daha fazla bilgi edinebilirsiniz.
:::

## Akıllı Sözleşmenin Adresi

TON üzerindeki akıllı sözleşme adresleri genellikle iki ana bileşenden oluşur:

* **(workchain_id)**: İş zinciri ID'sini belirten (imzalı 32 bit tamsayı)
* **(account_id)**: Hesap adresini belirten (64-512 bit, iş zincirine bağlı olarak)

Bu belgelendirme dokümanının ham adres genel bakış bölümünde, **(workchain_id, account_id)** çiftlerinin nasıl sunulduğunu tartışacağız.

### İş Zinciri ID'si ve Hesap ID'si

#### İş Zinciri ID'si

`Daha önce gördüğümüz gibi`, TON Blockchain üzerinde `2^32` kadar iş zinciri oluşturmak mümkündür. Ayrıca, 32 bit önek akıllı sözleşme adreslerinin farklı iş zincirlerindeki akıllı sözleşme adresleri ile nasıl tanımlandığını ve bunlarla bağlantılı olduğunu not ettik. Bu, akıllı sözleşmelerin TON Blockchain üzerindeki farklı iş zincirlerinden mesaj göndermesine ve almasına olanak tanır.

Günümüzde, yalnızca Masterchain (workchain_id=-1) ve zaman zaman temel iş zinciri (workchain_id=0) TON Blockchain üzerinde çalışmaktadır.

Her ikisi de 256 bit adreslere sahiptir, bu nedenle, workchain_id'nin ya 0 ya da -1 olduğunu varsayıyoruz ve iş zincirindeki adres kesinlikle 256 bittir.

#### Hesap ID'si

TON üzerindeki tüm hesap ID'leri, Masterchain ve Basechain (veya temel iş zinciri) üzerinde 256 bit adresler kullanmaktadır.

Aslında, Hesap ID'si **(account_id)** akıllı sözleşme nesneleri için hash fonksiyonları olarak tanımlanmaktadır (özellikle, SHA-256). TON Blockchain üzerinde çalışan her akıllı sözleşme iki ana bileşeni saklar. Bunlar:

1. _Derlenmiş kod_. Akıllı sözleşmenin bayt kodu formunda derlenmiş mantığı.
2. _Başlangıç durumu_. Sözleşmenin zincirdeki dağıtım anındaki değerleri.

Son olarak, sözleşmenin adresini türetmek için, **(Başlangıç kodu, Başlangıç durumu)** nesnesine karşılık gelen hash'i hesaplamak gereklidir. Şu aşamada, `TVM` çalışma prensibini derinlemesine incelemeyeceğiz, ancak TON'daki hesap ID'lerinin şu formülle belirlendiğini anlamak önemlidir:  
**account_id = hash(initial code, initial state)**

Daha zaman içinde, bu belgelendirme boyunca TVM ve TL-B şemasının teknik özellikleri ve genel bakışına daha derinlemesine dalacağız. **account_id**'nin üretilmesini ve TON'daki akıllı sözleşme adresleriyle olan etkileşimlerini anladıktan sonra, Ham ve Kullanıcı-Dostu adresleri açıklayalım.

## Adres Durumu

Her adres bir veya daha fazla olası durumda olabilir:

- `nonexist` - bu adres üzerinde kabul edilen hiçbir işlem olmamıştır, bu nedenle herhangi bir verisi yoktur (veya sözleşme silinmiştir). Başlangıçta tüm 2256 adresin bu durumda olduğunu söyleyebiliriz.
- `uninit` - adresin, bakiye ve meta bilgileri içeren bazı verileri vardır. Bu durumda adresin henüz herhangi bir akıllı sözleşme kodu/kalıcı verisi yoktur. Bir adres, örneğin, daha önce `nonexist` durumundayken başka bir adres ona token gönderdiğinde bu duruma geçer.
- `active` - adres akıllı sözleşme kodu, kalıcı veri ve bakiye içerir. Bu durumda, işlem sırasında bazı mantıklar gerçekleştirebilir ve kalıcı verisini değiştirebilir. Bir adres, `uninit` durumundayken gelen message ile state_init parametresi olduğunda bu duruma geçer (not, bu adresi dağıtabilmek için `state_init` ve `code` hash'inin adres ile eşit olması gerektiğini belirtmek gerekir).
- `frozen` - adres herhangi bir işlem gerçekleştiremiyor, bu durum yalnızca önceki durumun iki hash'ini (kod ve durum hücreleri sırasıyla) içermektedir. Bir adresin depolama ücreti, bakiyesi aştığında bu duruma girer. Bunu çözmek için, daha önce tanımlanan hash'leri ve bazı Toncoin'leri saklayan `state_init` ve `code` ile bir iç mesaj gönderebilirsiniz. Bu durumu geri kazanmak zor olabilir, bu yüzden bu durumu yaşamamanız gerekir. Adresin çözüldüğü bir proje vardır, bunu [buradan](https://unfreezer.ton.org/) bulabilirsiniz.

## Ham ve Kullanıcı-Dostu Adresler

TON üzerindeki akıllı sözleşme adreslerinin iş zincirleri ve hesap ID'lerini nasıl kullandığına dair kısa bir genel bakış verdikten sonra, bu adreslerin iki ana formatta ifade edildiğini anlamak önemlidir:

* **Ham adresler**: Akıllı sözleşme adreslerinin orijinal tam temsili.
* **Kullanıcı-dostu adresler**: Kullanıcı-dostu adresler, daha iyi güvenlik ve kullanım kolaylığı sağlamak için ham adresin geliştirilmiş bir formatıdır.

Aşağıda, bu iki adres türü arasındaki farkları açıklayacağız ve kullanıcı-dostu adreslerin neden TON'da kullanıldığını daha derinlemesine inceleyeceğiz.

### Ham adres

Ham akıllı sözleşme adresleri, bir iş zinciri ID'si ve hesap ID'si *(workchain_id, account_id)* içermekte olup aşağıdaki formatta gösterilmektedir:

* [ondalık workchain_id\]:[64 altıgen rakam ile account_id\]

Aşağıda, bir iş zinciri ID'si ve hesap ID'sini ( **workchain_id** ve **account_id** olarak ifade edilen) kullanan bir ham akıllı sözleşme adresinin örneği verilmiştir:

```
-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260
```

Adres dizesinin başındaki `-1`, Masterchain'e ait bir _workchain_id_ olduğunu belirtmektedir.

:::note
Adres dizelerinde büyük harfler (örneğin 'A', 'B', 'C', 'D' vb.) yerine küçük harfleri (örneğin 'a', 'b', 'c', 'd' vb.) kullanabiliriz.
:::

#### Ham Adreslerle İlgili Sorunlar

Ham Adres formatını kullanmak, iki ana sorunu beraberinde getirir:

1. Ham adres formatını kullanırken, adresleri doğrulamak ve hata ayıklamak mümkün değildir.  
   Bu, işlemi göndermeden önce adres dizesine karakter ekler veya çıkartırsanız, işlemin yanlış bir yere gönderileceği ve bu durumun hesap kaybına yol açacağı anlamına gelir.
2. Ham adres formatını kullanırken, kullanıcı-dostu adresleri kullanarak yapılan işlemlerde kullanılan özel bayraklar eklemek imkansızdır.  
   Bu kavramı daha iyi anlamanıza yardımcı olmak için, aşağıda hangi bayrakların kullanılabileceğini açıklayacağız.

### Kullanıcı-Dostu Adres

Kullanıcı-dostu adresler, TON kullanıcılarının internet üzerinde (örneğin, kamu mesajlaşma platformlarında veya e-posta servis sağlayıcıları aracılığıyla) adres paylaşımını güvenli ve basit hale getirmek için geliştirilmiştir, ayrıca gerçek dünyada da kullanılmaktadır.

#### Kullanıcı-Dostu Adres Yapısı

Kullanıcı-dostu adresler toplamda 36 bayttan oluşmakta ve aşağıdaki bileşenlerin sırayla üretilmesiyle elde edilmektedir:

1. _[bayraklar - 1 bayt]_ — Adreslere eklenen bayraklar, akıllı sözleşmelerin gelen mesaja nasıl tepki verdiğini değiştirir.  
   Kullanıcı-dostu adres formatını kullanan bayrak türleri şunlardır:

   - isBounceable. Geri dönebilir veya geri dönemez adres türünü belirtir. (_0x11_ "geri dönebilir" için, _0x51_ "geri dönemez" için)
   - isTestnetOnly. Sadece test ağı amacıyla kullanılan bir adres türü belirtir. _0x80_ ile başlayan adresler, üretim ağında çalışan yazılımlar tarafından kabul edilmemelidir.
   - isUrlSafe. Bir adres için URL güvenli olarak tanımlanan bir bayrak olup, tüm adreslerin URL güvenli olduğu kabul edilir.
   
2. _\[workchain_id - 1 bayt]_ — İş zinciri ID'si (_workchain_id_), imzalı 8 bit tamsayı _workchain_id_ ile tanımlanır.  
   (_0x00_ BaseChain için, _0xff_ MasterChain için)

3. _\[account_id - 32 bayt]_ — Hesap ID'si, iş zincirindeki ([big-endian](https://www.freecodecamp.org/news/what-is-endianness-big-endian-vs-little-endian/)) 256 bit adresinden oluşmaktadır.

4. _\[adres doğrulaması - 2 bayt]_ — Kullanıcı-dostu adreslerde adres doğrulaması, önceki 34 bayttan oluşan bir CRC16-CCITT imzasından meydana gelir. ([Örnek](https://github.com/andreypfau/ton-kotlin/blob/ce9595ec9e2ad0eb311351c8a270ef1bd2f4363e/ton-kotlin-crypto/common/src/crc32.kt))  
   Aslında, kullanıcı-dostu adresler için doğrulama süreci, kullanıcıların yanlışlıkla mevcut olmayan kart numaraları girmelerini önlemek için tüm kredi kartlarında kullanılan [Luhn algoritması](https://en.wikipedia.org/wiki/Luhn_algorithm) ile oldukça benzerdir.

Bu 4 ana bileşenin eklenmesi şu şekilde toplamda: `1 + 1 + 32 + 2 = 36` bayt (her kullanıcı-dostu adres için).

Kullanıcı-dostu adres oluşturmak için geliştirici, tüm 36 baytı aşağıdaki ikisinden biri kullanarak kodlamalıdır:

- _base64_ (yani, rakamlar, büyük ve küçük Latin harfler, '/' ve '+')
- _base64url_ ( '/' ve '+' yerine '_' ve '-' kullanarak)

Bu süreç tamamlandıktan sonra, 48 boşluk içermeyen karakter uzunluğuna sahip bir kullanıcı-dostu adresin üretilmesi tamamlanır.

:::info DNS ADRES BAYRAKLARI
TON üzerinde, ham ve kullanıcı-dostu adresler yerine bazen mywallet.ton gibi DNS adresleri kullanılmaktadır. DNS adresleri, kullanıcı-dostu adreslerden oluşur ve geliştiricilerin TON alanı içindeki DNS kaydından tüm gerekli bayraklara erişmesini sağlayan tüm gerekli bayrakları içerir.
:::

#### Kullanıcı-Dostu Adres Kodlama Örnekleri

Örneğin, "test giver" akıllı sözleşmesi (testnet masterchain'de bulunan ve isteyen herkese 2 test tokeni gönderen özel bir akıllı sözleşme) aşağıdaki ham adresi kullanmaktadır:

```
-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260
```

Yukarıdaki "test giver" ham adresinin kullanıcı-dostu adres biçimine dönüştürülmesi gerekmektedir. Bu, daha önce tanıttığımız base64 veya base64url formatlarından biri kullanılarak elde edilir:

* `kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)
* `kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny` (base64url)

:::info
Her iki biçimin (_base64_ ve _base64url_) de geçerli olduğunu ve kabul edilmesi gerektiğini unutmayın!
:::

#### Geri Dönebilir ve Geri Dönemez Adresler

Geri dönebilir adres bayrağının temel amacı, göndericinin fonlarının güvenliğidir.

> Örneğin, eğer varış noktası akıllı sözleşmesi mevcut değilse veya işlem sırasında bir sorun oluşursa, mesaj göndericiye "geri dönecek" ve işlemin orijinal değerinin geri kalanını temsil edecektir (tüm transfer ve gas ücretleri hariç).  
> — Belgelendirme Notu

Özellikle geri dönebilir adreslerle ilgili olarak:

1. **bounceable=false** bayrağı genellikle alıcının bir cüzdan olduğunu belirtmektedir.
2. **bounceable=true** bayrağı ise genellikle kendi uygulama mantığına sahip özel bir akıllı sözleşmeyi belirtmektedir (örneğin, bir DEX). Bu örnekte, güvenlik nedenleriyle geri dönebilir mesajlar gönderilmemelidir.

Bu konu hakkında daha fazla bilgi edinmek için belgelendirmemizi okuyarak `geri dönemez mesajlar` hakkında daha iyi anlam elde edebilirsiniz.

#### Zırhlı base64 Temsilleri

TON Blockchain ile ilgili ek ikili veriler benzer "zırhlı" base64 kullanıcı-dostu adres temsillerini kullanmaktadır. Bunlar, bayt etiketinin ilk 4 karakterine bağlı olarak birbirinden farklılık göstermektedir. Örneğin, 256 bit Ed25519 genel anahtarlar, aşağıdaki süreçle bir 36 baytlık dizilim oluşturarak temsil edilmektedir:

- _0x3E_ formatında tek bir bayt etiketi, genel anahtarı belirtir.
- _0xE6_ formatında tek bir bayt etiketi, bir Ed25519 genel anahtarını belirtir.
- 32 bayt, Ed25519 genel anahtarının standart ikili temsilini içerir.
- 2 bayt, önceki 34 baytın big-endian temsilinin CRC16-CCITT'sini içerir.

Elde edilen 36 baytlık dizilim, standart bir yöntemle 48 karakterlik bir base64 veya base64url dizgisine dönüştürülmektedir. Örneğin, Ed25519 genel anahtarı `E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D` (genellikle şu şekilde 32 bayt dizisi ile temsil edilir:  `0xE3, 0x9E, ..., 0x7D`) "zırhlı" temsil olarak aşağıdaki gibi görünmektedir:

```
Pubjns2gp7DGCnEH7EOWeCnb6Lw1akm538YYaz6sdLVHfRB2
```

### Kullanıcı-Dostu Adreslerle Ham Adresleri Dönüştürme

Kullanıcı-dostu ve ham adresleri dönüştürmenin en basit yolu, birkaç TON API'si ve diğer araçlardan birini kullanmaktır:

* [ton.org/address](https://ton.org/address)
* [dton.io API yöntemi](https://dton.io/api/address/0:867ac2b47d1955de6c8e23f57994fad507ea3bcfe2a7d76ff38f29ec46729627)
* [toncenter ana ağ API yöntemleri](https://toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)
* [toncenter test ağı API yöntemleri](https://testnet.toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)

Ayrıca, JavaScript kullanarak cüzdanlar için kullanıcı-dostu ve ham adresleri dönüştürmenin iki yolu vardır:

* [ton.js kullanarak adresi kullanıcı-dostu veya ham biçimden dönüştür](https://github.com/ton-org/ton-core/blob/main/src/address/Address.spec.ts)
* [tonweb kullanarak adresi kullanıcı-dostu veya ham biçimden dönüştür](https://github.com/toncenter/tonweb/tree/master/src/utils#address-class)

Benzer mekanizmaları `SDK'lar` kullanarak da kullanmak mümkündür.

### Adres Örnekleri

TON Adresleri ile ilgili daha fazla örneği `TON Cookbook` bölümünde öğrenebilirsiniz.

## Olası Problemler

TON blockchain ile etkileşimde bulunurken, `uninit` cüzdan adreslerine TON parası transferinin sonuçlarını anlamak önemlidir. Bu bölüm, bu tür işlemlerin nasıl ele alındığını açıklığa kavuşturmak için çeşitli senaryoları ve sonuçlarını ortaya koymaktadır.

### Toncoin'i uninit bir adresine gönderdiğinizde ne olur?

#### İçinde `state_init` bulunan işlem

İşleminizle `state_init` (cüzdan veya akıllı sözleşmenin kodu ve verileri) eklerseniz, önce sağlanan `state_init` ile akıllı sözleşme dağıtılır. Dağıtımdan sonra, gelen mesaj işlenir, bu da daha önce başlatılmış bir hesaba gönderme işlemi gibidir.

#### `state_init` içermeyen ve `bounce` bayrağı ayarlı işlem

Mesaj `uninit` akıllı sözleşmeye teslim edilemez ve göndericiye geri döner. Tüketilen gas ücretleri düşüldükten sonra, kalan miktar göndericinin adresine iade edilir.

#### `state_init` içermeyen ve `bounce` bayrağı kapalı işlem

Mesaj teslim edilemez, ancak geri dönmez. Bunun yerine, gönderilen miktar alıcı adresine kredi edilir, böylece bakiye artırılır, ancak cüzdan henüz başlatılmamıştır. Bakiye, adresin sahibi bir akıllı cüzdan sözleşmesi dağıtana kadar orada saklanacaktır ve sonra bu bakiyeye erişebilirler.

#### Bunu doğru yapmak için

Bir cüzdanı dağıtmanın en iyi yolu, `bounce` bayrağı kapatılarak henüz başlatılmamış adresine biraz TON göndermektir. Bu aşamadan sonra, sahibi mevcut başlatılmamış adres üzerinden fonlarla cüzdanı dağıtıp başlatabilir. Bu adım genellikle ilk cüzdan işleminde gerçekleşir.

### TON blockchain'in hatalı işlemler karşısında koruma sağladığını unutmayın

TON blockchain'inde, standart cüzdanlar ve uygulamalar, geri dönebilir ve geri dönemez adresler kullanarak henüz başlatılmamış adreslere yapılan işlemlerin karmaşasını otomatik olarak yönetmektedir.  
Bunlar `burada` açıklanmaktadır. Cüzdanların, başlatılmamış adreslere para gönderirken, hem geri dönebilir hem de geri dönemez adreslere tüm geri gönderme olmadan para göndermesi yaygın bir uygulamadır.

Hızlı bir şekilde geri dönebilir/geri dönemez biçimde bir adres almak isterseniz, bunu [burada](https://ton.org/address/) yapabilirsiniz.

### Özel ürünler için sorumluluk

Eğer TON blockchain üzerinde özel bir ürün geliştiriyorsanız, benzer kontrolleri ve mantığı uygulamak çok önemlidir:

> Alıcı adresinin başlatılmış olup olmadığını kontrol etmek için uygulamanızın doğrulama yaptığından emin olun.  
> — Belgelendirme Notu

Adres durumuna bağlı olarak, özel uygulama mantığına sahip kullanıcı akıllı sözleşmeleri için geri dönebilir adres kullanın, fonların geri dönmesini sağlamak için. Cüzdanlar için geri dönemez adres kullanın.