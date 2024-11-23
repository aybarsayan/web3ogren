# TL

TL (Tip Dili), veri yapıları tanımlamak için bir dildir.

Faydalı verilerin yapılandırılması için, iletişim sırasında [TL şemaları](https://github.com/ton-blockchain/ton/tree/master/tl/generate/scheme) kullanılır.

TL, 32 bitlik bloklar üzerinde çalışır. Buna göre, TL'deki veri boyutu 4 baytın bir katı olmalıdır. 
Eğer nesnenin boyutu 4'ün bir katı değilse, gerekli sayıda sıfır bayt eklememiz gerekir. 

:::info
Sayılardaki kodlamalar her zaman Küçük Uçlu (Little Endian) sırasındadır.
:::

TL hakkında daha fazla bilgi [Telegram belgelerinde](https://core.telegram.org/mtproto/TL) bulunabilir.

## Bayt dizisi kodlama

Bir bayt dizisini kodlamak için ilk olarak boyutunu belirlememiz gerekir. 
Eğer 254 bayttan daha az ise, o zaman boyut olarak 1 bayt kullanılır. Eğer daha fazlaysa, 
ilk bayt olarak 0xFE yazılır, bu büyük bir dizinin göstergesi olarak kabul edilir ve ardından 3 bayt boyut yazılır.

> Örneğin, `[0xAA, 0xBB]` dizisini kodluyoruz, boyutu 2. 
> 1 bayt boyut kullanıyoruz ve ardından veriyi yazıyoruz, sonuç: `[0x02, 0xAA, 0xBB]` oluyor, ancak son boyutun 3 olduğunu ve 4 baytın bir katı olmadığını görüyoruz, bu durumda 1 bayt doldurma eklememiz gerekiyor, böylece sonuç: `[0x02, 0xAA, 0xBB, 0x00]` olur.  
> — TL Kodlama Kılavuzu

Eğer boyutu, örneğin, 396 olan bir diziyi kodlamamız gerekirse, bunu yaparız: 396 >= 254, bu nedenle boyut kodlaması için 3 bayt ve 1 bayt aşırı boyut göstergesi kullanıyoruz, sonuç: `[0xFE, 0x8C, 0x01, 0x00, dizi baytları]`, 396+4 = 400, bu 4'ün bir katı, hizalamaya gerek yok.

---

## Belirgin olmayan serileştirme kuralları

Sıklıkla, şemanın kendisinden önce 4 baytlık bir önek yazılır - bunun kimliği. 
Şema ID'si, şema metni üzerindeki IEEE tablosuyla bir CRC32'dir; `;` ve parantez `()` gibi semboller metinden önce kaldırılır. 

:::note
ID öneki ile bir şemanın serileştirilmesine **boxed** denir, bu da parser'ın önünde gelen şemanın hangisi olduğunu belirlemesine yardımcı olur, eğer birden fazla seçenek varsa.
:::

Bir şemanın boxed olarak serileştirilip serileştirilmeyeceğine nasıl karar verilir? 
Eğer şemamız başka bir şemanın parçasıysa, o zaman alan türünün nasıl belirtildiğine bakmamız gerekir, eğer açıkça belirtilmişse o zaman öneksiz serileştiriyoruz, eğer açıkça değilse (birçok tür var), o zaman boxed olarak serileştirmemiz gerekir. 

Örnek:
```tlb
pub.unenc data:bytes = PublicKey;
pub.ed25519 key:int256 = PublicKey;
pub.aes key:int256 = PublicKey;
pub.overlay name:bytes = PublicKey;
```
Bu türlerimiz var, eğer `PublicKey` şemada belirtilirse, örneğin `adnl.node id:PublicKey addr_list:adnl.addressList = adnl.Node`, o zaman açıkça belirtilmemiştir ve ID ön eki ile serileştirmemiz gerekir (boxed). Ve eğer şu şekilde belirtilmiş olsaydı: `adnl.node id:pub.ed25519 addr_list:adnl.addressList = adnl.Node`, o zaman bu açık olurdu ve ön ek gerekli olmazdı.

---

## Referanslar

_Burada [orijinal makaleye](https://github.com/xssnick/ton-deep-doc/blob/master/TL.md) [Oleg Baranov](https://github.com/xssnick) tarafından bir bağlantı var._