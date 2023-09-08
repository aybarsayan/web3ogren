# Başlangıç Rehberi 🚀

Hey hoş geldiniz! KILT Protocol'un heyecan verici dünyasına derin bir dalış yapmak üzere hazır mısınız? 🤓 Bu tutorialda, KILT'teki `claim` yolculuğunu kapsamlı bir şekilde keşfedeceğiz.

## 🎭 Ana Aktörler: Kim Kimdir? 🎭

Bir kahraman hikayesi olmazsa olmaz üç kilit karakterimiz var:
1. **Claimer (Talep Sahibi)** 🦸‍♀️
2. **Attester (Onaylayıcı)** 🕵️‍♂️
3. **Verifier (Doğrulayıcı)** 🧐

Bu üçlüyü workshop'ta göreceğiz, her biri için farklı klasörler oluşturacağız. Gerçek hayatta, bu üçlü farklı kişi veya organizasyonlar olabilir.

---

## 🌐 Dağıtık Güven 🌐

KILT'ın büyük amacı "Dağıtılmış Güven" oluşturmaktır. Ama bu kelimelerin ardında ne yatıyor? Haydi bir göz atalım.

### 🦸‍♀️ Claimer: Süper Kahramanınız 🦸‍♀️

- **Kimdir?** Kendi hakkında bir iddiada bulunan süper kahraman! 🌟
  
- **Ne Yapar?** Kimlik bilgilerini veya yeteneklerini belgeleyerek kendi hikayesini yaratır! 📜

- **Neden Önemli?** Çünkü onlar, kendi kimliklerinin efendileridir! 🗝️
  
- **DID Gerekir Mi?** Hayır, onlar bağımsız süper kahramanlardır! 🚫⛓️

### 🕵️‍♂️ Attester: Güvenin Bekçisi 🕵️‍♂️

- **Kimdir?** Kimlik kartınızı damgalayan adam! 👮‍♂️
  
- **Ne Yapar?** Sizi tanır, iddianızı onaylar ve kimlik kartınıza mühür basar! 🌐
  
- **DID Gerekir Mi?** Evet, onlar resmi görevlilerdir ve KILT Blockchain'ine kayıtlıdırlar! ✅⛓️
  
- **Neden Önemli?** Güvenleri sağlarlar, böylece siz de işleri halledebilirsiniz! 🤝

### 🧐 Verifier: Sherlock Holmes 🧐

- **Kimdir?** Sizin kim olduğunuzu anlamaya çalışan dedektif! 🔍
  
- **Ne Yapar?** Sizden, kimlik kartınızı ve onun gerçek olduğuna dair kanıtı ister. 📜🔐
  
- **DID Gerekir Mi?** Hayır, ama onlar da kendi kaynaklarına güvenirler. 📚
  
- **Neden Önemli?** Çünkü onlar, her şeyin yolunda olduğunu teyit ederler! ✅

---

:::info 🤔 Detaylar 🤔
Claimer, KILT Blockchain ile hiç temas etmeyebilir. 😌 Ama Attester ve Verifier, KILT Blockchain'i kullanmak zorundadır. Sadece Attester, işlem için ödeme yapmak zorundadır. 💰 Verifier, sadece kontrol yapar. 🕵️‍♂️
:::

Bu kadar! Şimdi bu süper kahramanları daha yakından tanımak için hazır mısınız? 🚀🌟

---
## Attestation Talebinde Bulunmak

Claimer bir credential'ın (kimlik belgesi) attest olması için göndermesinden önce `Light DID` oluşturması gerekmektedir. Light DID tamamen zincir dışında işlemleri gerçekleştirebildiğimiz yapılardır. 

Buna karşı olarak attester zincire kayıtlı bir DID oluşturmak zorundadır. Bu durumun nedeni Attester'ın attestation işlemi için KILT Coin'lerini kullanmasıdır.

Her iki `Attester` ve `Claimer` bireyleri DID'lerini oluşturduktan sonra `Claimer` attestation işlemini `Attester`'dan attestation talep ederek başlatabilir.

![alt text](../../static/img/kilt/KILT%20Attestation%20İsteme.png)

Hadi yukarıda gördüğümüzü adım adım yukarıdan aşağı sırasıyla inceleyelim:

:::note
Bu yapıda sadece `Claimer` ve `Attester` yapılarının olduğunu görüntüleyebiliriz. Claimer sizsiniz diyelim, Attester'da noter. Bu durumda Credantial imzalatmak istediğiniz belge, attestation'a imzalanmış belge olmaktadır.
:::

- İlk olarak `Claimer` (Yani biz) `Attestation` etmek istediği Credential'ı yani kimlik belgesini bazı kanıtlar ile hazırlar. Örneğin bir ilaç alacağız diyelim, bu durumda claimer olarak doktora onaylatmak istediğimiz reçeteyi yanımıza almalıyız. Bu belgenin yanında şartarı sağladığımızı kanıtlamak için TC Kimlik cüzdanımızı da yanımıza almamız gerekmektedir. Claimer bu şekilde imzalamak istediği belgeyi ve kanıtları ile kendini hazırlar.
- Sonrasında belgeyi `Attestation` işlemi için `Attester` kişisine gönderir. 
- Belgeyi yani `credential`'i alan `Attester` kanıtları inceleyerek iddanın doğru olup olmadığıına karar verir. Eğer doğruysa imzaladığı belge olan `Attestation` belgesini zincirde depolar. Ancak bu belgenin sadece Hash değerini yani tek başına işlevsiz kopyasını depolamaktadır.
- Son olarak Attester bu `hash` değerini alır ve `Claimer` kişisine yani bize iletir. Bu sayede imzalı dosyamızın gerçekten imzalı olduğunu kanıtlayan belge ellerimize ulaşmış olur.

:::caution
Hash değeri zincirde tek başına tutulur. Bu veriyi kötü niyetli bir kişi çalsa da tek başına bir anlam ifade etmediği için herhangi bir tehlike ifade etmez. Hash değeri sadece beraberinde orjinal veri ile değerlidir. Bir anahtar kilit ikilisi gibi. Hem anahtar hem kilit tek başına yeterli değildir.
:::

### Attestation İşlemini Doğrulama

`Verifier` `Claimer` bireyinden spesifik bir Ctype talep etmektedir (Detayları sonradan anlatılacaktır). Bu spesifik Ctype sunumu olmadan `Claimer`'ın diğer belgeleri bir anlam ifade etmemektedir. Bu nedenle büyük önem arz etmektedir. Talep sonrası `Claimer`'ın sunucağı `credential` üzerinde her bilginin görünür olmasına gerek olmamaktadır. Bu durum KILT'in en büyük özellikleriden biridir. `Claimer` kişisi sunduğu belgeden sadece `Verifier`'ın kontrol etmek zorunda olduğu bilgileri göstermekte özgürdür. Geri kalan bilgileri saklayabilir. Eğer `Verifier` sadece burcunuz ile ilgileniyorsa isterseniz isminizi gizleyebilirsiniz. 

![alt text](../../static/img/kilt/KILT%20Verify.png)

Hadi şimdi de yukarıda yine gördüğümüz doğrulama işlemlerini yukarıdan aşağıya ilerleyerek inceleyelim:

:::note
Bu yapıda sadece `claimer` ve `Verifier` mekanizmalarının yer aldığını görebiliriz. Aradan `attester` yani noter çıkarılmış. Hangi doğrulayacıya gidersek gidelim Attester'ın haberi olmayacak. Bu sayede gizliliği sağlamış oluyoruz. Buradaki Verifier yapısını bir ev sahibi olarak düşünebiliriz.
:::

- İlk olarak `Verifier` kişisi bizden yani claimerdan spesifik bir belge yani `CTYPE` istemektedir. Örneğin bir doğal gaz açtırma belgesi olabilir. Bize diyor ki doğal gazı açtır bende sana anahtar vereyim. Biz doğal gazı açtırmaya gittik, açtırdık, noterden (yani attester) açtırdığımıza dair belgemizi aldık ve belgeyi hazırladık.
- Belgemiz hazır ancak bu belge içerisindeki tüm bilgileri vermek zorunda değiliz. Evet ev sahibimiz doğal gazı açtırıp açtırmadığımızı öğrenmek istiyor ancak TC'mizi bilmesine gerek yok. Bu nedenle sunumu yaparken bu belgeleri gizledik.
- Ev sahibine belgemizi sunduk.
- Ev sahibi belgenin doğruluğunu belgenin hash değerini zincirdeki hash değeri ile karşılaştırarak onayladı. 
- `Attester`'a da güvendiğinden dolayı işlemi onayladı veee Harika! Anahtar bizim.

:::coution
Gördüğünüz bu sistemde ev sahibinin bize güvenmesine gerek kalmadı. Çünkü daha önce iş yaptığı veya makamından dolayı saygı duyduğu `attester` bireyine güvendi ve imzası ile bizlere anahtarımızı verdi. 

Bu işlem her ne kadar Attester'a duyulan güven ile ortaya çıksa da ikinci aşamada `attester`'ın yer almamasından dolayı kendisinin haberi olmadı. Gizlilik güvenle sağlandı.
:::
