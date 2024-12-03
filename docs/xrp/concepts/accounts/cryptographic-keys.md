---
title: Kriptografik Anahtarlar
seoTitle: XRP Defteri için Kriptografik Anahtarlar
sidebar_position: 4
description: Kriptografik anahtarları kullanarak işlemleri onaylayın, böylece XRP Defteri bunları gerçekleştirebilir. Bu döküman, dijital imza ve anahtar oluşturma süreçlerini detaylandırmaktadır.
tags: 
  - Kriptografik Anahtarlar
  - XRP Defteri
  - Dijital İmza
  - Anahtar Oluşturma
  - Güvenlik
keywords: 
  - Kriptografik Anahtarlar
  - XRP Defteri
  - Dijital İmza
  - Anahtar Oluşturma
  - Güvenlik
---

# Kriptografik Anahtarlar

XRP Defteri'nde, dijital imza bir _işlemi_ yetkilendirmek için kullanılır ve bu işlem belirli bir eylem setini gerçekleştirmek için gereklidir. Sadece imzalı işlemler ağa gönderilebilir ve onaylanmış bir deftere dahil edilebilir.

Dijital imza oluşturmak için, işlemin gönderim hesabıyla ilişkilendirilmiş bir kriptografik anahtar çiftine ihtiyaç vardır. Bir anahtar çifti, XRP Defteri'nin desteklediği herhangi bir `kriptografik imza algoritması` kullanılarak oluşturulabilir. Bir anahtar çifti, kullanılan algoritma ne olursa olsun, bir `anahtar çifti`, `normal anahtar çifti` veya bir `imzalayıcı listesi` üyesi olarak kullanılabilir.

:::dangerKriptografik anahtarlarınızı korumak çok önemlidir. Dijital imzalar, XRP Defteri'nde işlemleri yetkilendirmek için tek yöntemdir ve uygulandıktan sonra geri alınabilen ayrıcalıklı bir yönetici yoktur. Eğer başka birisi XRP Defteri hesabınızın seed'ini veya özel anahtarını biliyorsa, bu kişi sizin gibi herhangi bir işlemi onaylayabilecek dijital imzalar oluşturabilir.:::

---

## Anahtarları Oluşturma

Birçok `istemci kütüphanesi` ve uygulama, XRP Defteri ile kullanılabilecek bir anahtar çifti oluşturabilir. Ancak, yalnızca güvendiğiniz cihazlar ve yazılımlar ile oluşturulmuş anahtar çiftlerini kullanmalısınız. Tehlikeye atılmış uygulamalar, gizli bilgilere kötü niyetli kullanıcıların ulaşmasına sebep olabilir ve bu kişiler daha sonra hesabınızdan işlemler gönderebilirler.

:::note
Not: Farklı araçların farklı varsayılanları vardır. Birçok istemci kütüphanesi (örneğin xrpl.js), varsayılan kriptografik algoritma olarak Ed25519'u kullanırken, `rippled`'in `wallet_propose` yönetici RPC komutu varsayılan olarak secp256k1 kullanmaktadır. Bu, aynı seed'den farklı bir araç kullanarak bir cüzdan oluşturursanız, farklı bir adres alabileceğiniz anlamına gelir.
:::

## Anahtar Bileşenleri

Bir kriptografik anahtar çifti, matematiksel olarak bir anahtar türetme süreciyle bağlanmış bir **özel anahtar** ve bir **açık anahtar** içerir. Her anahtar bir sayıdır; özel anahtar güçlü bir rastgelelik kaynağı kullanılarak seçilmelidir. `Kriptografik imza algoritması`, anahtar türetme sürecini tanımlar ve kriptografik anahtar olarak kullanılabilecek sayılara kısıtlamalar getirir.

XRP Defteri ile ilgilenirken, bir şifre, seed, hesap ID'si veya adres gibi bazı ilgili değerleri de kullanabilirsiniz.


_Şekil: Kriptografik anahtar değerleri arasındaki ilişkilerin basitleştirilmiş görünümü._

Şifre, seed ve özel anahtar **gizli** bilgilerdir: Bu değerlerden herhangi birini bir hesap için biliyorsanız, geçerli imzalar üretebilir ve o hesap üzerinde tam kontrolünüz olur. Eğer bir hesaba sahipseniz, hesabınızın gizli bilgileri konusunda **çok dikkatli** olmalısınız. Eğer bu değerlere sahip değilseniz, hesabınızı kullanamazsınız. Eğer başka birisi bu değerlere erişebiliyorsa, o kişi hesabınızı kontrol edebilir.

Açık anahtar, hesap ID'si ve adres kamu bilgisi olarak kabul edilir. Bazı durumlarda bir açık anahtarı geçici olarak saklayabilirsiniz, ancak nihayetinde bu değeri bir işlemin parçası olarak yayımlamanız gerekir, böylece XRP Defteri imzayı doğrulayabilir ve işlemi işleyebilir.

Anahtar türetmenin nasıl çalıştığına dair daha teknik detaylar için `Anahtar Türetimi` bölümüne bakabilirsiniz.

---

### Şifre

İsteğe bağlı olarak, bir şifre veya başka bir girdi kullanarak bir seed veya özel anahtar seçebilirsiniz. Bu, seed veya özel anahtarı tamamen rastgele seçmekten daha az güvenlidir, ancak bazı nadir durumlarda bunu yapmak isteyebilirsiniz. (Örneğin, 2018'de "XRPuzzler", bir bulmacayı [çözen](https://bitcoinexchangeguide.com/cryptographic-puzzle-creator-xrpuzzler-offers-137-xrp-reward-to-anyone-who-can-solve-it/) ilk kişiye XRP verdi; o, ödül XRP'sini tutan bir hesaba erişmek için bulmacanın çözümünü şifre olarak kullandı.)

Şifre, gizli bir bilgidir, bu nedenle onu çok dikkatli bir şekilde korumalısınız. Bir adresin şifresini bilen herkes, o adres üzerinde tam kontrol sahibi olur.

---

### Seed

Bir _seed_ değeri, bir hesabın gerçek özel ve açık anahtarlarını `türetmek` için kullanılan kompakt bir değerdir. [wallet_propose method][] yanıtında, `master_key`, `master_seed` ve `master_seed_hex` hepsi farklı formatlarda aynı seed değerini temsil eder. Bu formatların herhangi biri işlemleri imzalamak için kullanılabilir. `master_` öneki ile başlamasına rağmen, bu seed'in temsil ettiği anahtarlar bir hesabın anahtarları olmayabilir; bir anahtar çifti, normal bir anahtar veya çoklu imza listesinin üyesi olarak da kullanılabilir.

Seed değeri gizli bir bilgidir, bu nedenle onu çok dikkatli korumalısınız. Bir adresin seed değerini bilen herkes, o adres üzerinde etkili bir şekilde tam kontrol sahibidir.

---

### Özel Anahtar

_Özel anahtar_, bir dijital imza oluşturmak için kullanılan değerdir. Çoğu XRP Defteri yazılımı özel anahtarı açıkça göstermez ve gerekirse seed değerinden özel anahtarını `türetir`. Özel anahtarı seed yerine kaydetmek ve bunu işlemleri doğrudan imzalamak için kullanmak teknik olarak mümkündür, ancak bu kullanım nadirdir.

Seed gibi, özel anahtar gizli bir bilgidir, bu nedenle onu çok dikkatli korumalısınız. Bir adresin özel anahtarını bilen herkes, o adres üzerinde tam kontrol sahibidir.

---

### Açık Anahtar

_Açık anahtar_, bir dijital imzanın geçerliliğini doğrulamak için kullanılan değerdir. Açık anahtar, özel anahtardan türetilerek oluşturulur. [wallet_propose method][] yanıtında, `public_key` ve `public_key_hex` her ikisi de aynı açık anahtar değerini temsil eder.

XRP Defteri'nde işlemler, ağın işlemlerin imzalarını doğrulayabilmesi için açık anahtarları içermelidir. Açık anahtar geçerli imzalar oluşturmak için kullanılamaz, bu nedenle kamuya açık şekilde paylaşmak güvenlidir.

---

### Hesap ID'si ve Adres

**Hesap ID'si**, bir `hesap` veya bir anahtar çifti için temel kimlik bilgisi olan değerdir. Açık anahtardan türetilir. XRP Defteri protokolünde, Hesap ID'si 20 byte'lık ikili veridir. Çoğu XRP Defteri API'si, Hesap ID'sini iki formattan birinde adres olarak temsil eder:

- "Klasik adres", bir Hesap ID'sini [base58][] ile bir kontrol toplamı yazar. [wallet_propose method][] yanıtında bu, `account_id` değeri olarak görünmektedir.
- "X-Adres", bir Hesap ID'sini _ve_ bir `Hedef Etiket` birleştirir ve bir kontrol toplamı ile birleştirilmiş değeri [base58][] formatında yazar.

Her iki formatta da kontrol toplamı, küçük değişikliklerin geçersiz bir adrese yol açması için bulunmaktadır; böylece başka bir hesabı temsil etmesine neden olmadan bağlı bulunduğunun yanlış bir yer olması sağlanır. Bu şekilde, bir yazım hatası yaptığınızda veya bir iletim hatası oluştuğunda, yanlış yere para göndermiş olmazsınız.

Hangi Hesap ID'lerinin (veya adreslerinin) defterdeki hesaplarla ilişkili olduğunu bilmek önemlidir. Anahtarlar ve adreslerin türetilmesi tamamen matematiksel bir işlemdir. Bir hesabın XRP Defteri'nde kaydı olması için `XRP ödemesi alması` gerekir; bu, `rezerv gereksinimini` finanse eder. Bir hesap, finanse edilene kadar işlem gönderemez.

Bir Hesap ID'si veya adresi finanse edilen bir hesaba refere etmese bile, o Hesap ID'sini veya adresi bir `normal anahtar çifti` veya `imzalayıcı listesi` üyesi olarak kullanabilirsiniz.

---

### Anahtar Türü

XRP Defteri birden fazla `kriptografik imza algoritmasını` destekler. Herhangi bir anahtar çifti yalnızca belirli bir kriptografik imza algoritması için geçerlidir. Bazı özel anahtarlar, teknik olarak birden fazla algoritma için geçerli anahtarlar olarak nitelenebilir, ancak bu özel anahtarların her bir algoritma için farklı açık anahtarları vardır ve özel anahtarları yeniden kullanmamalısınız.

[wallet_propose method][] içindeki `key_type` alanı, kullanılacak kriptografik imza algoritmasını ifade eder.

---

## Anahtar Çifti

Anahtar çifti, bir özel anahtar ve bir açık anahtardan oluşmaktadır. Bir hesabın adresi, hesabın anahtar çiftinden türetilir ve bu nedenle birbirleriyle bağlıdır. Anahtar çiftini değiştiremezsiniz veya kaldıramazsınız, ancak devre dışı bırakabilirsiniz.

[wallet_propose method][] bu amaçla bir anahtar çiftinin oluşturulmasında bir yöntemdir. Bu yöntemin yanıtı, hesabın seed'ini, adresini ve anahtar açık anahtarını bir arada gösterir. Anahtar çiftlerini kurmanın bazı diğer yolları için `Güvenli İmza` bölümüne bakın.

:::dangerKötü niyetli bir aktör, anahtar özel anahtarınızı (veya seed'inizi) öğrenirse, anahtar çiftiniz devre dışı bırakılmadıkça hesabınız üzerinde tam kontrol sahibidir. Hesabınızdaki tüm parayı alabilir ve başka geri dönüşü olmayan zararlar verebilir. Gizli değerlerinizi dikkatle saklayın!:::

Anahtar çiftini değiştirmek mümkün olmadığından, bu değeri sahip olduğu değere orantılı bir şekilde korumanız önemlidir. İyi bir uygulama, anahtar çiftinizi `çevrimdışı saklamaktır` ve bunun yerine işlem imzalamak için normal bir anahtar çifti oluşturmaktır. Anahtar çiftini çevrimdışı tutarak, kimsenin ona internet üzerinden erişmesini sağlamaktan oldukça emin olabilirsiniz, ancak yine de bir acil durumda kullanılmak üzere bulabilirsiniz.

Anahtar çiftinizi çevrimdışı tutmak, gizli bilgileri (şifre, seed veya özel anahtar) kötü niyetli aktörlerin erişebileceği hiçbir yere koymamak anlamına gelir. Genel olarak, bu, onu internete genel olarak bağlanan bir bilgisayar programının erişimini sağlamak anlamına gelir. Örneğin, bunu internete bağlanmayan bir air-gapped makinede, bir kasada saklanmış bir kâğıtta veya tamamen ezberlenmiş bir şekilde tutabilirsiniz. (Ezberleme, unutulması halinde anahtarın aktarılması imkânsız hale geldiğinden bazı dezavantajlara sahiptir.)

### Özel İzinler

**Sadece** anahtar çifti, işlemleri belirli şeyleri yapabilmesi için yetkilendirebilir:

- Bir hesabın ilk işlemini göndermek, çünkü hesaplar başka bir yöntemle `işlemleri yetkilendiremezler`.

- Anahtar çiftini devre dışı bırakmak.

- `Dondurma` yetkisini sonsuza kadar bırakmak.

- İşlem masrafı 0 XRP olan özel bir `anahtar sıfırlama işlemi` göndermek.

Normal bir anahtar veya `çoklu imza` aynı şekilde her şeyi yapabilir. Özellikle, anahtar çiftini devre dışı bıraktıktan sonra, normal bir anahtar çifti veya çoklu imza kullanarak tekrar etkinleştirebilirsiniz. Ayrıca, `bir hesabı silme` gereksinimlerine uygun olduğunda hesabı silebilirsiniz.

---

## Normal Anahtar Çifti

Bir XRP Defteri hesabı, bir _normal anahtar çifti_ yetkilendirebilir. Bunu yaptıktan sonra, işlemleri yetkilendirmek için ya `anahtar çiftini` ya da normal anahtarı kullanabilirsiniz. Normal anahtar çiftinizi istediğiniz zaman kaldırabilir veya değiştirebilir, böylece hesabınızdaki diğer unsurları değiştirmeden yapabilirsiniz.

Normal anahtar çiftleri, anahtar çiftleri ile aynı tür işlemden geçer ve `belirli istisnalar` dışında anahtar çiftinin aynı türde işlemleri yetkilendirebilir. Örneğin, normal bir anahtar çifti, normal anahtar çiftini değiştirmek için bir işlemi yetkilendirebilir.

İyi bir güvenlik uygulaması, anahtar özel anahtarınızı bir yerde çevrimdışı saklamak ve çoğu zaman normal anahtar çiftini kullanmaktır. Bir tedbir olarak, normal anahtar çiftini düzenli olarak değiştirebilirsiniz. Eğer kötü niyetli bir kullanıcı normal özel anahtarınızı öğrenirse, çevrimdışındaki saklama alanından anahtar çiftini çıkartabilir ve normal anahtar çiftini değiştirmek veya kaldırmak için kullanabilirsiniz. Bu şekilde, hesabınızın kontrolünü yeniden kazanabilirsiniz. Kötü niyetli kullanıcının parasını çalmasını önleyecek kadar hızlı olamazsanız bile, en azından yeni bir hesaba taşınmak ve tüm ayarları ve ilişkileri sıfırdan yeniden oluşturmak zorunda kalmazsınız.

Normal anahtar çiftleri, anahtar çiftlerinin aynı formatına sahiptir. Onları aynı şekilde (örneğin, [wallet_propose method][] kullanarak) oluşturdunuz. Tek fark, normal anahtar çiftinin imzalandığı hesap ile özdeş bir bağlılığı olmamasıdır. Diğer bir hesabın normal anahtar çifti olarak bir anahtar çiftini kullanmak teknik olarak mümkündür (ancak iyi bir fikir değildir).

[SetRegularKey transaction][] bir hesabın normal anahtar çiftini atar veya değiştirir. Normal bir anahtar çiftinin atanması veya değiştirilmesiyle ilgili bir eğitim için `Normal Anahtar Çifti Atama` bölümüne bakın.

---

## İmza Algoritmaları

Kriptografik anahtar çiftleri, gizli anahtar ile açık anahtar arasındaki matematiksel ilişkileri tanımlayan belirli bir imza algoritmasına bağlıdır. Kriptografik imza algoritmalarının özelliklerinden biri, mevcut kriptografik tekniklerin durumu göz önüne alındığında, bir gizli anahtarı kullanarak eşleşen bir açık anahtarı hesaplamanın "kolay" olması, ancak bir açık anahtardan başlayarak eşleşen bir gizli anahtarı hesaplamanın pratikte imkânsız olmasıdır.

XRP Defteri aşağıdaki kriptografik imza algoritmalarını destekler:

| Anahtar Türü  | Algoritma | Açıklama |
|-------------|-----------|---|
| `secp256k1` | [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) kullanarak, eliptik eğri [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) | Bu, Bitcoin'in kullandığı aynı şemadır. XRP Defteri, varsayılan olarak bu anahtar türlerini kullanmaktadır. |
| `ed25519`   | [EdDSA](https://tools.ietf.org/html/rfc8032) kullanarak, eliptik eğri [Ed25519](https://ed25519.cr.yp.to/) | Bu, daha iyi performansa ve diğer kullanışlı özelliklere sahip daha yeni bir algoritmadır. Ed25519 açık anahtarları, secp256k1 anahtarlarından bir bayt daha kısa olduğu için, `rippled` Ed25519 açık anahtarlarını `0xED` baytı ile öneki vererek iki tür açık anahtarın da 33 bayt olmasını sağlar. |

[wallet_propose method][] ile bir anahtar çifti oluşturduğunuzda, hangi kriptografik imza algoritmasını kullanacağınıza karar vermek için `key_type` değerini belirleyebilirsiniz. Varsayılan dışındaki bir anahtar türü oluşturduysanız, işlemleri imzalamak için de `key_type` belirtmelisiniz.

---

### Gelecek Algoritmalar

Gelecekte, XRP Defteri'nin kriptografideki gelişmelere ayak uydurmak için yeni kriptografik imza algoritmalarına ihtiyaç duyulması muhtemeldir. Örneğin, [Shor'un algoritması](https://en.wikipedia.org/wiki/Shor's_algorithm) (veya benzeri bir şey) kullanan kuantum bilgisayarların, eliptik eğri kriptografisini kırabilmesi için pratik hale gelmesi durumunda, XRP Defteri geliştiricileri kolayca kırılmayan bir kriptografik imza algoritması ekleyebilir. 2020 ortası itibarıyla henüz kesin bir "kuantum dirençli" imza algoritması yoktur ve kuantum bilgisayarlar henüz bir tehdit oluşturacak kadar pratik değildir, bu nedenle herhangi bir özel algoritmanın eklenmesi için mevcut bir plan yoktur.

---

## Anahtar Türetimi

Anahtar çiftini türetme süreci, imza algoritmasına bağlıdır. Tüm durumlarda, anahtarlar 16 bayt (128 bit) uzunluğunda bir _seed_ değerinden türetilir. Seed değeri tamamen rastgele (tercih edilir) veya belirli bir şifreden türetilmiş olabilir; bu durumda [SHA-512 hash][Hash] alınıp ilk 16 bayt tutulur (bu, [SHA-512Half][] gibi, ancak çıktının 256 bit yerine yalnızca 128 bitini koruyarak gerçekleşir).

### Örnek Kod

Burada açıklanan anahtar türetme işlemleri, çeşitli yerlerde ve programlama dillerinde uygulanmıştır:

- C++ dilinde `rippled` kod tabanında:
    - [Seed tanımı](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/Seed.h)
    - [Genel ve Ed25519 anahtar türetme](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/impl/SecretKey.cpp)
    - [secp256k1 anahtar türetme](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/impl/SecretKey.cpp)
- Python 3'te repo-link path="_code-samples/key-derivation/py/key_derivation.pybu depo kod örnekleri kısmında/repo-link %}.
- JavaScript'te [`ripple-keypairs`](https://github.com/XRPLF/xrpl.js/tree/main/packages/ripple-keypairs) paketinde.

---

### Ed25519 Anahtar Türetimi
[[Kaynak]](https://github.com/XRPLF/rippled/blob/fc7ecd672a3b9748bfea52ce65996e324553c05f/src/ripple/protocol/impl/SecretKey.cpp#L203 "Kaynak")


1. Seed değerinin [SHA-512Half][] hesaplayın. Sonuç, 32 baytlık gizli anahtardır.

    admonition type="success" name="İpucuTüm 32 baytlık sayılar geçerli Ed25519 gizli anahtarlarıdır. Ancak, yalnızca yeterince rastgele seçilen sayılar gizli anahtar olarak kullanılmak için yeterince güvenlidir.:::

2. Ed25519 açık anahtarını hesaplamak için, 32 baytlık açık anahtarı türetmek üzere standart açık anahtar türetme yöntemlerini kullanın [Ed25519](https://ed25519.cr.yp.to/software.html) için.

    :::warning Kriptografik algoritmalarla ilgili her zaman olduğu gibi, standart, iyi bilinen, kamuya açık denetimden geçmiş bir uygulama kullanın. Örneğin, [OpenSSL](https://www.openssl.org/) Ed25519 ve secp256k1 fonksiyonlarının uygulamalarına sahiptir.:::

3. 32 baytlık açık anahtarı, bir Ed25519 açık anahtar olduğunu belirtmek üzere `0xED` baytı ile öneki ekleyerek 33 bayta çıkarın.

    İşlemlere imza atacak bir kod uyguluyorsanız, `0xED` önekini kaldırın ve gerçek imza sürecinde 32 baytlık anahtarı kullanın.

4. Hesap açık anahtarını [base58][] formatında serileştirirken, hesap açık anahtar öneki `0x23` kullanın.

    Doğrulayıcı geçici anahtarları Ed25519 olamaz.

---
title: secp256k1 Anahtar Türetimi
description: secp256k1 ile XRP Ledger hesap anahtarlarının türetilmesi hakkında detaylı bir kılavuz sunulmaktadır. Bu süreç, tohum değerinden hesap anahtarlarının elde edilmesi için gereken adımları kapsamaktadır.
keywords: [secp256k1, XRP Ledger, anahtar türetimi, gizli anahtar, ECDSA]
---

---
title: secp256k1 Anahtar Türetimi
seoTitle: secp256k1 Key Generation in XRP Ledger
sidebar_position: 4
description: secp256k1 key generation for XRP Ledger involves multiple steps due to specific requirements. This document outlines the methodologies and best practices for deriving key pairs.
tags:
  - secp256k1
  - XRP Ledger
  - key generation
  - cryptography
keywords:
  - secp256k1
  - XRP Ledger
  - key generation
  - cryptography
---

### secp256k1 Anahtar Türetimi
[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/impl/SecretKey.cpp "Source")



secp256k1 XRP Ledger hesap anahtarları için anahtar türetimi, birkaç neden ile Ed25519 anahtar türetiminden daha fazla adım içerir:

- Tüm 32 baytlık sayılar geçerli secp256k1 gizli anahtarlar değildir.
- XRP Ledger'ın referans uygulaması, tek bir tohum değerinden bir anahtar çiftleri ailesi türetme için kullanılmayan, eksik bir çerçeveye sahiptir.

:::info
Bir tohum değerinden XRP Ledger'ın secp256k1 hesap anahtar çiftini türetme adımları aşağıdaki gibidir:
:::

1. Aşağıdaki adımları izleyerek bir "kök anahtar çifti" hesaplayın:

    1. Aşağıdakileri sırasıyla birleştirerek toplam 20 bayt oluşturun:
        - Tohum değeri (16 bayt)
        - "kök sırası" değeri (4 bayt), büyük endian işaretsiz tamsayı olarak. Kök sırası için başlangıç değeri olarak 0 kullanın.

    2. Birleştirilmiş (tohum+kök sırası) değerin [SHA-512Half][] değerini hesaplayın.

    3. Sonuç geçerli bir secp256k1 gizli anahtar değilse, kök sırasını 1 artırın ve baştan başlayın. [[Source]](https://github.com/XRPLF/rippled/blob/fc7ecd672a3b9748bfea52ce65996e324553c05f/src/ripple/crypto/impl/GenerateDeterministicKey.cpp#L103 "Source")

        > Geçerli bir secp256k1 anahtarı sıfır olmamalıdır ve _secp256k1 grup sırası_ değerinden numerik olarak daha az olmalıdır. secp256k1 grup sırası, `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141` sabit değeridir.

    4. Geçerli bir secp256k1 gizli anahtar ile, kök kamu anahtarı türetmek için secp256k1 eğrisi ile standart ECDSA halkası türetimini kullanın. (Şifreleme algoritmalarında her zaman olduğu gibi, mümkünse standart, iyi bilinen ve kamu denetimi yapılmış bir uygulama kullanın. Örneğin, [OpenSSL](https://www.openssl.org/) Ed25519 ve secp256k1 işlevlerinin temel uygulamalarını içerir.)
    :::tip
    Validatorlar bu kök anahtar çiftini kullanır. Eğer bir validatorun anahtar çiftini hesaplıyorsanız, burada durabilirsiniz. Bu iki farklı türdeki kamu anahtarlarını ayırt etmek için, validator kamu anahtarları için [base58][] serileştirmesi `0x1c` ön ekini kullanır.
    :::

2. Kök kamu anahtarını 33 baytlık sıkıştırılmış forma dönüştürün.

    Herhangi bir ECDSA kamu anahtarının sıkıştırılmamış formu çift 32 baytlık tamsayıdan oluşur: bir X koordinatı ve bir Y koordinatı. Sıkıştırılmış form X koordinatı ve bir baytlık ön ekten oluşur: Y koordinatı çift ise `0x02`, tek ise `0x03`.

    Sıkıştırılmamış bir kamu anahtarını sıkıştırılmış hale getirmek için `openssl` komut satırı aracını kullanabilirsiniz. Örneğin, sıkıştırılmamış kamu anahtarı `ec-pub.pem` dosyasındaysa, sıkıştırılmış formu şu şekilde çıkartabilirsiniz:

    ```
    $ openssl ec -in ec-pub.pem -pubin -text -noout -conv_form compressed
    ```

3. Sıkıştırılmış kök kamu anahtarından "ara anahtar çifti" türetin:

    1. Aşağıdakileri sırasıyla birleştirerek toplam 41 bayt oluşturun:
        - Sıkıştırılmış kök kamu anahtarı (33 bayt)
        - `0x00000000000000000000000000000000` (4 bayt sıfır). (Bu değer, aynı ailenin farklı üyelerini türetmek için kullanılmak üzere tasarlanmıştı, ancak uygulamada yalnızca 0 kullanılır.)
        - "anahtar sırası" değeri (4 bayt), büyük endian işaretsiz tamsayı olarak. Anahtar sırası için başlangıç değeri olarak 0 kullanın.

    2. Birleştirilmiş değerin [SHA-512Half][] değerini hesaplayın.

    3. Sonuç geçerli bir secp256k1 gizli anahtar değilse, anahtar sırasını 1 artırın ve hesabın ara anahtar çiftini türetmeyi yeniden başlatın.

    4. Geçerli bir secp256k1 gizli anahtar ile, standart ECDSA kamu anahtarını türetmek için secp256k1 eğrisi ile türetimini kullanın. (Şifreleme algoritmalarında her zaman olduğu gibi, mümkünse standart, iyi bilinen ve kamu denetimi yapılmış bir uygulama kullanın. Örneğin, [OpenSSL](https://www.openssl.org/) Ed25519 ve secp256k1 işlevlerinin temel uygulamalarını içerir.)

4. Ara kamu anahtarını kök kamu anahtarına ekleyerek ana kamu anahtar çiftini türetin. Benzer şekilde, ara gizli anahtarı kök gizli anahtara ekleyerek gizli anahtarı türetin.

    - ECDSA gizli anahtar çok büyük bir tamsayıdır, bu nedenle iki gizli anahtarın toplamını secp256k1 grup sırasına göre toplamak suretiyle hesaplayabilirsiniz.

    - ECDSA kamu anahtarı, eliptik eğrinin üzerindeki bir noktadır, bu nedenle noktaları toplamak için eliptik eğri matematiğini kullanmalısınız.

5. Ana kamu anahtarını daha önce olduğu gibi 33 baytlık sıkıştırılmış forma dönüştürün.

6. Bir hesabın kamu anahtarını [base58][] formatına serileştirirken, hesap kamu anahtar ön ekini `0x23` kullanın.

    Bir hesabın kamu anahtarından adresine dönüştürme ile ilgili bilgi ve örnek kod için `Adres Kodlama` kısmına bakın.

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `İşlem ve Operasyon Adresleri`
- **Eğitimler:**
    - `Normal Anahtar Çifti Atama`
    - `Normal Anahtar Çiftini Değiştirme veya Kaldırma`
- **Referanslar:**
    - [SetRegularKey işlemi][]
    - `AccountRoot defter nesnesi`
    - [wallet_propose yöntemi][]
    - [account_info yöntemi][]
    
