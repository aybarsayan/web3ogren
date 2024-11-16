# Durum Akıllı Sözleşmesi

İlk `hello-world` akıllı sözleşmemizde, uzak çağrılmaya imkân tanımak için bir `greet` fonksiyonu oluşturduk ve bunu `publicFacet` aracılığıyla açık hale getirdik. Ancak, dikkat ederseniz, akıllı sözleşmemizde çağrılar arasında korunmuş bir durum bulunmamaktadır. Sözleşmeler, durum için sıradan değişkenler ve veri yapıları kullanabilir.

İkinci örnek akıllı sözleşmemizde, bir oda listesini yöneteceğiz. `publicFacet` erişimine sahip olan herkesin yeni bir oda oluşturabilmesini ve mevcut oda sayısını alabilmesini istiyoruz. Durumu, aşağıdaki gibi bir `Map` veri yapısı kullanarak koruyoruz:

<<< @/../snippets/zoe/src/02-state.js#rooms-map

Yeni odalar eklemek için herkes, aşağıda tanımlanan `makeRoom` fonksiyonuna bir çağrı yapabilir:

<<< @/../snippets/zoe/src/02-state.js#makeRoom

`makeRoom` kullanarak yeni bir oda oluşturulur ve bu yeni eklenen oda üzerinde `getId`, `incr` ve `decr` adındaki fonksiyonların çağrılmasına izin verilir. Gördüğünüz gibi, bu model `Nesne Yeterlilik Modeli`ni izlemektedir; çünkü `makeRoom` çağrısını yapan kişi, artık bu üç metoda erişime sahip olacaktır. Sonrasında, `rooms.set(id, room)` ifadesi yeni oluşturulan odayı sözleşmenin harita durum değişkenine ekler. `getRoomCount` fonksiyonuna yapılan bir çağrı, bu haritada bulunan oda sayısını döndürür.

<<< @/../snippets/zoe/src/02-state.js#getRoomCount

Her şeyi bir araya getirirsek:

<<< @/../snippets/zoe/src/02-state.js#state-contract

Bu sözleşmeyi `02-state.js` olarak kaydedelim ve işlevselliğini doğrulamak için basit bir test oluşturalım:

<<< @/../snippets/zoe/contracts/test-zoe-hello.js#test-state

Bu test, başta oda sayısının sıfır olduğunu ve `makeRoom` çağrısından sonra oda sayısının bir değiştiğini doğrular. Eğer sorun yaşıyorsanız, örnek depo içerisindeki  dalına göz atmayı unutmayın.

::: tip Yığın durumu kalıcıdır

Sıradan yığın durumu, sözleşme çağrıları arasında kalıcılık gösterir.

Büyük sayıda nesne (_sanak nesneleri_) ve yükseltmeler arasında kalan nesneler () için daha açık durum yönetimini daha sonra tartışacağız.

:::