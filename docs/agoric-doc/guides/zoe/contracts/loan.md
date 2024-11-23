---
title: Kredi Sözleşmesi
---



#####  (Son güncelleme: 23 Kasım 2021)

##### 

Temel kredi sözleşmesi, bir _kredili veren_ ve bir _borçlu_ olmak üzere iki taraf içerir. Bu sözleşme, borçlunun belirli bir markada teminat eklemesine ve başka bir markada kredi almasına olanak tanır. Teminat (marj olarak da bilinir), kredi değerinin belirli bir yüzdesi olmalıdır (varsayılan %150'dir). Gerekli kesin yüzde, sözleşmenin maddeleri içinde Bakım Marjı Gereksinimi (`mmr`) olarak tanımlanmıştır.

Kredi sözleşmesinin belirli bir sona erme zamanı yoktur. Aksine, teminatın değeri öyle bir şekilde değişirse ki yetersiz marj sağlanıyorsa, teminat tasfiye edilir ve kredi kapatılır. Herhangi bir zamanda, borçlu teminat ekleyebilir veya krediyi faiz ile geri ödeyerek, krediyi kapatabilir.

Tüm teminatların aynı marka olması gerektiğini ve kredi tutarının ve faizinin aynı (ayrı) marka olması gerektiğini unutmayın.

## Şartlar

- `mmr` (varsayılan = 150) - Bakım Marjı Gereksinimi, yüzde cinsinden. Varsayılan %150'dir, yani teminatın kredi değerinin en az %150'si kadar olması gereklidir. Teminatın değeri `mmr`'nin altına düşerse, tasfiye gerçekleşebilir.
-  - Teminatın güncel değerini almak ve tasfiye tetikleyicilerini ayarlamak için kullanılır.
- `autoswapInstance` -  kurulumu için çalışan sözleşme örneği. Örneğin `publicFacet`, tasfiye sırasında teminatı satmak için bir davet oluşturmak üzere kullanılır.
- `periodNotifier` -  kullanarak sürenin geçtiğine dair bildirimler almak için kullanılır; bu durumda bileşik faiz `interestRate` ile hesaplanır.
- `interestRate` - Her dönem için borçla çarpılacak  cinsinden oran.
- `interestPeriod` - Faizin hesaplanacağı dönem.

## IssuerKeywordRecord

Tüm anahtar kayıtları, sözleşmedeki rollerine bakılmaksızın aşağıdaki şekilde kullanılır:

- Anahtar: `Teminat` - Teminat olarak yapılacak dijital varlıkların ihraççısı/ödemesi.
- Anahtar: `Kredi` - Kredi verilecek dijital varlıkların ihraççısı/ödemesi.

## Kredili Veren

Kredili veren, borçluya verilecek miktarı sağlar ancak başka bir işlem gerçekleştirmez. Kredi, tamamen geri ödenene veya tasfiye edilene kadar devam eder; bu noktada kredili veren bir ödeme alır. Bu, kredili verenin ödemesinin kredi markalı dijital varlıklar olacağı, teminat markalı değil demektir. (Tek istisna, tasfiye tetikleyicilerinin `priceAuthority` ile zamanlamasının bir hata oluşturmasıdır. Bu durumda, biz teminatı kredili verene vermeliyiz. Borçlu zaten kredisi ile ayrılmıştır.)

Kredili veren, ya geri ödeme ya da tasfiye sonuçları için kredi faizini almak isteyecektir. Eğer tasfiye öncesinde teminat fiyatı düşerse, toplam ödeme sıfır olabilir. Bu nedenle, kredili veren talebinde hiçbir şey `istememelidir`.

Kredili veren, borçlanma gerçekleşene kadar talep üzerine çıkış yapabilmelidir. Eğer çıkış kuralı `feragat edilirse`, bir borçlu davetini tutarak kredi verenin teminatını sonsuza dek kilitleyebilir.

<<< @/../snippets/zoe/contracts/test-loan.js#lend

## Borçlu

Borçlu, katılmak için bir davet alır, teminatını Zoe aracılığıyla bloke ederek bir teklif yapar ve kredisini alır. Teminat, `collateralSeat` adlı dahili bir alana taşınır ve bu noktada borçlu koltuğu çıkılarak borçlunun kredisinin ödemesini alması sağlanır. Borçlu ayrıca, sözleşmeye etkileşimde devam etmelerini sağlayan bir nesne (`borrowFacet`) alır.

<<< @/../snippets/zoe/contracts/test-loan.js#borrow

Kredi başladıktan sonra, borçlu krediyi tamamen geri ödeyebilir (bu noktada kredili veren, kredi tutarını ve faizi geri alır ve sözleşme kapanır) veya tasfiyeyi önlemek için daha fazla teminat ekleyebilir.

<<< @/../snippets/zoe/contracts/test-loan.js#closeLoanInvitation

<<< @/../snippets/zoe/contracts/test-loan.js#addCollateralInvitation

## Sözleşmenin Kapatılması

Sözleşme, üç koşuldan herhangi biri altında kapanır:

1. Kredi (faizle birlikte) geri ödenir.
   - Kredili veren geri ödemeyi alır ve borçlu teminatını geri alır.
2. Teminatın değeri düşer ve teminat tasfiye edilir.
   - Kredili veren teminat satışının sonucunu alır ve borçlu, kredi tutarını elinde tutar.
3. `priceAuthority` kullanılırken bir hata oluşur.
   - Kredili veren teminatı alır ve borçlu, kredi tutarını elinde tutar.

## Borç ve Faiz Hesaplaması

Faiz, `periodNotifier` yeni bir değer gönderdiğinde hesaplanır ve bileşik hale getirilir. Her dönem için faiz oranı, `interestRate` parametresi ile tanımlanır.

`borrowFacet`, mevcut borç miktarını almak için yöntemlere sahiptir (`E(borrowFacet).getRecentCollateralAmount()`), veya borcun yeniden hesaplandığında güncellenecek bir  edinebilir. Sözleşme ayrıca borcun en son hesaplandığı zamana ilişkin bilgiyi de açığa çıkarır: (`E(borrowFacet).getLastCalculationTimestamp()`).

## Tasfiye Zamanlaması

Tasfiye, `priceAuthority` parametresi kullanılarak zamanlanır. Özellikle, sözleşme teminatın değeri `mmr` parametresi tarafından tanımlanan tetik değerinin altına düştüğünde çözülen bir vaadi alır:

<<< @/../snippets/zoe/contracts/test-loan.js#liquidate

Borçlu, kendi marj çağrıları kurarak potansiyel bir tasfiye konusunda kendini önceden uyarmak isteyebilir. Bunu, koşullardan  alarak ve şu şekilde çağırarak yapar:

<<< @/../snippets/zoe/contracts/test-loan.js#customMarginCall

Burada `myWarningLevel`, borçlunun teminatın Kredi markasındaki değerine eklemeyi istediği teminatı eklemeye dair hatırlatıcı almak için ayarlamak istediği değerdir.

## Tasfiye

Gerçek tasfiye, mevcut fiyat ne olursa olsun bir AMM aracılığıyla yapılır. Eğer fiyat, `priceAuthority`'nin belirttiğinden daha kötü veya daha iyi olsa bile tasfiye edilir.