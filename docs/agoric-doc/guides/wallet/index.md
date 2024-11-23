---
title: Agoric Cüzdan
---

# Agoric Cüzdan

Bu sayfa, _Agoric Cüzdanı_ ve bunun _petnames_ kullanımını, Agoric Platformu mimarisindeki yerini belgelemektedir. Ayrıca  ve  konularına da bakabilirsiniz.

## Cüzdan ve Agoric Mimarisi

Agoric Sistemi, birbirine bağlı Agoric VM'lerden oluşmaktadır. Bazıları blok zincirinde, bazıları ise yerel olarak çalışmaktadır. Cüzdan, kullanıcının Agoric VM ağı ile etkileşimde bulunduğu güvenilir bir aracıdır.

Ayrıca, Agoric VM'lerle etkileşimde bulunan Web UI'lara sahip Dapps (_Merkeziyetsiz uygulamalar_) da bulunmaktadır. Dapps'in kendi hedefleri olabilir... bu hedefler, cüzdanlardan varlık çalmak da dahil olmak üzere çeşitli amaçlar içerebilir.

Bir _Ag-Solo_, tek bir zincir dışı Agoric VM'dir. Kendi UI'sine ve zincirlerle (birden fazla zincir ve ağ bağlantısı da dahil) iletişim kurma yöntemine sahiptir. Agoric Sistemi'ne giriş noktası olarak hizmet eder.

`agoric start` komutunu çalıştırdığınızda, özel cüzdanınızı çalıştıran özel bir ag-solo elde edersiniz. Cüzdan, kullanıcının _güvenilir aracı_dır. Dapps'ten giriş bağlantılarını etkinleştirme veya devre dışı bırakma ve etkinleştirdiğiniz bu Dapps'ten gelen önerileri onaylama veya reddetme imkanı sağlar. Cüzdan, `agoric open` komutunu çalıştırdığınızda görünür.

Cüzdan'ın UI'sindeki bu işlem, bir Zoe _teklifi_ parçası olan _öneriler_ aracılığıyla gerçekleşir; bir Dapp, kullanıcının bir şey teklif etmesini ister. Cüzdan, bu isteği/teklifi bir açılır pencerede ifade eder ve kullanıcı bunu uygulamak isteyip istemediğini belirtir.

Dapps her yerde olabilir; bunlar genellikle cüzdanlarla etkileşimde bulunan web uygulamalarıdır. Genellikle nedenleri, sizin paranızı istemek ve/veya başka biriyle bir şeyler değişmenize yardımcı olmaktır. Hatta sizi ücretsiz bir şeyle de ödüllendirmek isteyebilirler. Ancak, bir Dapp'in ana kullanımı, zincir üzerinden bir şeyi değiştirmek ve ne tür bir erişim elde ettiklerini kontrol etmek ile önerileri yönetmektir.

## Cüzdan Köprü Protokolü

_Cüzdan köprüsü_, bir Agoric Cüzdan'a doğrudan erişim sağlayan bir web sayfasıdır. Bu, Dapp'e API'nin bir bölümünü sunar. Dapps, doğrudan bir Cüzdan ile iletişim kurmaz, yalnızca Cüzdan'ın nereye bağlı olduğunu bilen bu köprü ile konuşurlar. Örneğin, bir Dapp, tarayıcınızda `https://treasury.agoric.app/` adresinde çalışıyorsa ve Cüzdan yerel olarak çalışıyorsa, doğrudan iletişim kurmazlar. Bunun yerine JSON biçiminde kodlanmış mesajlar göndererek cüzdan köprüsü üzerinden iletişim kurarlar.

## Pet İsimleri ve Yollar

Cüzdan'a geçmeden önce, _pet isimleri_ hakkında bilgi sahibi olmalısınız; bunlar nesneler için kişisel adlarınızdır. Başkası, sizin izniniz olmadan bir pet ismini göremez veya değiştiremez. Bunları telefonunuzun rehberi olarak düşünebilirsiniz. Gerçek telefon numarası, telefonunuzun birini araması için kullanıldığı numaradır; ancak, bir numaranın kime ait olduğunu daha kolay anlamanız için, ona bir pet ismi vermişsinizdir. Örneğin, Anne, Dede, Kate S. gibi. Farklı insanlar, farklı nesneler için farklı pet isimleri kullanabilir. Örneğin, aynı kişi sizin için "Anne", onun torunu için "Mimi" ve birçok kişi için "Bayan Watson" olabilir.

Cüzdanınız, Dapps, varlık türleri, émetciler vb. için pet isimlerinizi yönetir.

Cüzdan köprüsü protokolü, pet isimlerini _yol_ olarak aktarır. Tüm eski pet isimleri artık bir _yol_ veya hala sıradan bir dize olarak geçmektedir. Bir yol, ilk öğesi kullanıcının Dapp için verdiği pet isim olan bir dize dizisidir. Dapps, sıradan dize pet isimleri veya dize dizileri ile çalışabilmelidir.

Bunu `JSON.stringify(petnameOrPath)` aracılığıyla yapabilirler ve `petnameOrPath` kullanmadan önce programatik string bağlamında (bir Map veya Set'teki anahtar gibi veya bir HTML öğesinin nitelik değeri, örneğin bir ID gibi) kullanabilirler. Kullanıcılara bir yolu gösterirken, öğelerini `'.'` ile birleştirmelisiniz. Bir UI söz konusu olduğunda, ideal olarak ilk öğeyi noktalar ve diğer öğelerden farklı bir renkte gösterilmelidir. İlk öğe, Dapp için güvenilir, kullanıcı tarafından atanan bir pet isimdir; diğer öğeler ise Dapp veya cüzdan tarafından otomatik olarak oluşturulmuştur. Bu nedenle, kullanıcının onlarla özel bir ilişkisi yoktur.

### Dapp-Özel Yol Önerileri

Dapp’iniz, bir cüzdan kullanıcısının etkileşimde bulunacağı herhangi bir Kurulum, Örnek veya Émetçi için isimler önermelidir. Cüzdan bu isimleri kabul ettiğinde, bunları kullanıcının Dapp için pet ismi ile başlayan yollar (dize dizileri) olarak Dapp'e geri gönderir.

Örneğin, Fungible Faucet Dapp'in 
 şunlardır:

```js
// Issuer'ımız varsayılan olarak `FungibleFaucet.Installation` gibi bir şeyle başlayacak.
walletSend({
  type: 'walletSuggestInstallation',
  petname: 'Installation',
  boardId: INSTALLATION_BOARD_ID
});
// Issuer'ımız varsayılan olarak `FungibleFaucet.Instance` gibi bir şeyle başlayacak.
walletSend({
  type: 'walletSuggestInstance',
  petname: 'Instance',
  boardId: INSTANCE_BOARD_ID
});
// Issuer'ımız varsayılan olarak `FungibleFaucet.Token` gibi bir şeyle başlayacak.
walletSend({
  type: 'walletSuggestIssuer',
  petname: 'Token',
  boardId: TOKEN_ISSUER_BOARD_ID
});
```

## Agoric Tahtası

Birçok Cüzdan API yöntemi, kullanıcıların veriyi genel olarak erişilebilir hale getirmesini sağlayan _Agoric'in Tahtası_ adlı bir anahtar-değer "ilan tahtası" kullanmaktadır. Kullanıcılar, bir değeri paylaştıklarında bir ID elde edebilir ve diğerleri yalnızca ID'yi bilerek bu değeri alabilirler. ID'leri istediğiniz herhangi bir iletişim yöntemiyle kullanıcıya iletebilirsiniz; özel e-posta, bir e-posta bülteni, bir web sitesinde veya televizyon programında reklam, kendi web sitenizde listeleme vb.

<<< @/../snippets/ertp/guide/test-readme.js#getValue

Bir nesneyi, örneğin bir depositFacet'i, Tahta aracılığıyla almak için öncelikle bununla ilişkili olan Tahta ID'sinin ne olduğunu öğrenmelisiniz. `getValue()` yöntemini kullanarak, depositFacet'e referans elde edebilir ve bunun içine ödeme yapabilirsiniz.