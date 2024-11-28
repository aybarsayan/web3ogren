# DHT

DHT, Dağıtık Hash Tablosu anlamına gelir ve temelde, ağın her bir üyesinin kendileri hakkında bilgi gibi bir şey saklayabileceği dağıtık bir anahtar-değer veritabanıdır.

***TON'daki DHT'nin uygulanması, IPFS'de kullanılan [Kademlia](https://codethechange.stanford.edu/guides/guide_kademlia.html) uygulamasına doğrudan benzerlik gösterir.*** Herhangi bir ağ üyesi bir DHT düğümü çalıştırabilir, anahtarlar oluşturabilir ve veri saklayabilir. Bunu yapmak için rastgele bir ID oluşturmaları ve diğer düğümlere kendileri hakkında bilgi vermeleri gerekir.

Veriyi saklayacak düğümü belirlemek için, düğüm ile anahtar arasındaki "mesafeyi" belirlemek amacıyla bir algoritma kullanılır. Algoritma basittir: düğümün ID'sini ve anahtarın ID'sini alırız, XOR işlemi yaparız. Değer ne kadar küçükse, düğüm o kadar yakın demektir. Görev, anahtarı anahtara mümkün olduğunca yakın olan düğümlerde saklamaktır; böylece diğer ağ katılımcıları aynı algoritmayı kullanarak bu anahtar için veri verebilecek bir düğüm bulabilirler.

## Anahtar ile Değer Bulma
Bir anahtar arama örneğine bakalım, `herhangi bir DHT düğümüne bağlanın ve ADNL UDP aracılığıyla bir bağlantı kurun`.

Örneğin, foundation.ton sitesini barındıran düğüme bağlanmak için adresini ve genel anahtarını bulmak istiyoruz. Bu sitenin ADNL adresini DNS sözleşmesinin Get yöntemini uygulayarak zaten elde ettiğimizi varsayalım. ADNL adresinin hex temsili `516618cf6cbe9004f6883e742c9a2e3ca53ed02e3e36f4cef62a98ee1e449174` olacaktır. Şimdi amacımız bu adrese sahip olan düğümün ip, port ve genel anahtarını bulmaktır.

Bunu yapmak için öncelikle DHT anahtar ID'sini almak üzere DHT anahtar şemasını doldurmamız gerekmektedir:
```tlb
dht.key id:int256 name:bytes idx:int = dht.Key
```
`name`, anahtarın türüdür; ADNL adresleri için `address` kelimesi kullanılır ve shardchain düğümleri aramak için ise `nodes` kullanılır. Ancak anahtar türü, aradığınız değere bağlı olarak herhangi bir bayt dizisi olabilir.

Bu şemayı doldurarak şunları elde ederiz:
```
8fde67f6                                                           -- TL ID dht.key
516618cf6cbe9004f6883e742c9a2e3ca53ed02e3e36f4cef62a98ee1e449174   -- aradığımız ADNL adresi
07 61646472657373                                                  -- anahtar türü, TL bayt dizisi olarak "address" kelimesi
00000000                                                           -- yalnızca 1 anahtar olduğu için indeks 0
```
Sonraki adımda, yukarıda serileştirilen baytlardan sha256 hashini alarak anahtar ID'sini elde ediyoruz. Bu `b30af0538916421b46df4ce580bf3a29316831e0c3323a7f156df0236c5b2f75` olacaktır.

Artık arama işlemine başlayabiliriz. Bunun için [şemaya](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L197) sahip bir sorgu yürütmemiz gerekecek:
```tlb
dht.findValue key:int256 k:int = dht.ValueResult
```
`key`, DHT anahtarımızın id'sidir, `k` ise aramanın "genişliğidir"; daha küçük olduğunda daha kesin, ancak sorgulanacak potansiyel düğüm sayısı daha az olur. ***TON'daki maksimum k değeri 10'dur, genellikle 6 kullanılır.***

---

Bu yapıyı dolduralım, serileştirelim ve `adnl.message.query` şeması kullanarak isteği gönderelim. `Bunun hakkında daha fazla bilgi edinebilirsiniz`.

Yanıt olarak şunları alabiliriz:
* `dht.valueNotFound` - eğer değer bulunamazsa.
* `dht.valueFound` - eğer değer bu düğümde bulunursa.

### dht.valueNotFound
:::warning
`dht.valueNotFound` alırsak, yanıt, talep ettiğimiz düğüm tarafından bilinen ve talep ettiğimiz anahtara mümkün olduğunca yakın olan düğümlerin bir listesini içerecektir. 
:::

Bu durumda, alınan düğümlere bağlanmamız ve onları bildiğimiz düğümler listesine eklememiz gerekiyor. Daha sonra, bildiğimiz tüm düğümlerin listesinden en yakın, erişilebilir ve henüz sorgulamayı denemediğimiz düğümü seçeriz ve ona aynı isteği göndeririz. Bu şekilde, belirlediğimiz aralıktaki tüm düğümleri denediğimiz ya da yeni düğümlerin alınmasını durdurduğumuz zamana kadar devam ederiz.

Yanıt alanlarını daha ayrıntılı inceleyelim, kullanılan şemalar:
```tlb
adnl.address.udp ip:int port:int = adnl.Address;
adnl.addressList addrs:(vector adnl.Address) version:int reinit_date:int priority:int expire_at:int = adnl.AddressList;

dht.node id:PublicKey addr_list:adnl.addressList version:int signature:bytes = dht.Node;
dht.nodes nodes:(vector dht.node) = dht.Nodes;

dht.valueNotFound nodes:dht.nodes = dht.ValueResult;
```
`dht.nodes -> nodes` - DHT düğümleri listesidir (dizi).

Her düğümün, genellikle [pub.ed25519](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L47) olarak adlandırılan genel anahtarı olan bir `id`'si vardır; bu anahtar, ADNL aracılığıyla düğüme bağlanmak için kullanılan sunucu anahtarıdır. Ayrıca, her düğümün `addr_list:adnl.addressList`, versiyonu ve imzası olan bir adres listesi bulunmaktadır.

Her düğümün imzasını kontrol etmemiz gerekiyor; bunun için `signature` değerini okuyoruz ve alanı sıfıra ayarlıyoruz (boş bir bayt dizisi yapıyoruz). Sonra - boş imza ile `dht.node` TL yapısını serileştiriyoruz ve önce boşaltılan `signature` alanını kontrol ediyoruz. 
Alınan serileştirilmiş baytlarda, `id` alanından gelen genel anahtarı kullanarak kontrol ediyoruz. 

> **Uygulama örneği**  
> [Örnek Kod](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/dht/client.go#L91)

`addrs:(vector adnl.Address)` listesinden bir adres alıyor ve ADNL UDP bağlantısı kurmaya çalışıyoruz; sunucu anahtarı olarak genel anahtarı `id` kullanıyoruz.

Bu düğüme olan "mesafeyi" öğrenmek için, `anahtar ID'sini` almalı ve düğümün anahtar ID'si ile istenen anahtar arasındaki mesafeyi XOR işlemi ile kontrol etmeliyiz. Mesafe yeterince küçükse, bu düğüme aynı isteği yapabiliriz. Bu şekilde devam ederiz, ya bir değeri bulana kadar ya da yeni düğüm kalmayana kadar.

### dht.valueFound
Yanıt, değerin kendisi, tam anahtar bilgisi ve isteğe bağlı olarak bir imza içerecektir (değer türüne bağlıdır).

Yanıt alanlarını daha ayrıntılı inceleyelim, kullanılan şemalar:
```tlb
adnl.address.udp ip:int port:int = adnl.Address;
adnl.addressList addrs:(vector adnl.Address) version:int reinit_date:int priority:int expire_at:int = adnl.AddressList;

dht.key id:int256 name:bytes idx:int = dht.Key;

dht.updateRule.signature = dht.UpdateRule;
dht.updateRule.anybody = dht.UpdateRule;
dht.updateRule.overlayNodes = dht.UpdateRule;

dht.keyDescription key:dht.key id:PublicKey update_rule:dht.UpdateRule signature:bytes = dht.KeyDescription;

dht.value key:dht.keyDescription value:bytes ttl:int signature:bytes = dht.Value; 

dht.valueFound value:dht.Value = dht.ValueResult;
```
Öncelikle, `key:dht.keyDescription` inceleyelim; bu, anahtarın tam tanımını, anahtarı ve değeri nasıl ve kimlerin güncelleyebileceği hakkında bilgiyi kapsar.

* `key:dht.key` - anahtar, arama için aldığımız anahtar ID'sine eşleşmelidir.
* `id:PublicKey` - kayıt sahibinin genel anahtarı.
* `update_rule:dht.UpdateRule` - kayıt güncelleme kuralıdır.
* * `dht.updateRule.signature` - yalnızca özel anahtarın sahibi kaydı güncelleyebilir; anahtar ve değerin imzası geçerli olmalıdır.
* * `dht.updateRule.anybody` - herkes kaydı güncelleyebilir; `signature` boş olup kontrol edilmez.
* * `dht.updateRule.overlayNodes` - aynı overlay'den olan düğümler anahtarı güncelleyebilir; aynı overlay'in düğümlerini bulmak ve kendinizi eklemek için kullanılır.

#### dht.updateRule.signature
Anahtar tanımını okuduktan sonra, `updateRule`'a bağlı olarak hareket ederiz; ADNL adresi arama durumunda tür her zaman `dht.updateRule.signature` olacaktır. 
Anahtar imzasını geçen seferki gibi kontrol ederiz, imzayı boş bir bayt dizisi yapar, serileştirir ve kontrol ederiz. Sonrasında aynı işlemi değere (yani tüm `dht.value` nesnesine) yeniden yaparız (anahtar imzasını eski yerine geri koyarak).

> **Uygulama örneği**  
> [Örnek Kod](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/dht/client.go#L331)

#### dht.updateRule.overlayNodes
Ağda başka düğümlerin shardları hakkında bilgi içeren anahtarlar için kullanılır; değer her zaman TL yapısı `overlay.nodes` olacaktır. 
Değer alanı boş olmalıdır.

```tlb
overlay.node id:PublicKey overlay:int256 version:int signature:bytes = overlay.Node;
overlay.nodes nodes:(vector overlay.node) = overlay.Nodes;
```
Geçerliliği kontrol etmek için tüm `nodes`'ları kontrol etmemiz gerekir ve her birinin imzasını `id`'ye göre kontrol etmeliyiz. 
Bu TL yapısını serileştirdiğimizde:
```tlb
overlay.node.toSign id:adnl.id.short overlay:int256 version:int = overlay.node.ToSign;
```
Görüldüğü üzere, `id`, orijinal yapıdan `id` alanının anahtar ID'sini (hash) gösterecek şekilde `adnl.id.short` ile değiştirilmelidir. Serileştirmeden sonra; verilerle imzayı kontrol ediyoruz.

Sonuç olarak, ihtiyacımız olan workchain shard'ı hakkında bilgi verebilecek geçerli düğüm listesini almış oluruz.

#### dht.updateRule.anybody
İmzalar yoktur, herkes güncelleme yapabilir.

### Bir Değer Kullanma

Her şey doğrulandıktan ve `ttl:int` değeri süresi dolmadıktan sonra, değerle çalışmaya başlayabiliriz; yani `value:bytes`. Bir ADNL adresi için içinde `adnl.addressList` yapısı bulunmalıdır. 
Bu, talep edilen ADNL adresine karşılık gelen sunucuların ip adreslerini ve portlarını içerecektir. Bizim durumumuzda, muhtemelen `foundation.ton` hizmetinin 1 RLDP-HTTP adresi olacaktır. 
Sunucu anahtarı olarak DHT anahtar bilgisi içinden `id:PublicKey` genel anahtarını kullanacağız.

Bağlantı sağlandıktan sonra, RLDP protokolünü kullanarak sitenin sayfalarını talep edebiliriz. **DHT tarafındaki görev bu aşamada tamamlanmıştır.**

---

### Blockchain Durumunu Saklayan Düğümleri Arama

DHT, ayrıca, workchain'lerin ve shard'larının verilerini saklayan düğümler hakkında bilgi bulmak için de kullanılır. Bu süreç, herhangi bir anahtar arama süreciyle aynıdır; tek fark, anahtarın kendisinin serileştirilmesi ve yanıtın doğrulanmasıdır; bu noktaları bu bölümde analiz edeceğiz.

Veri almak için, örneğin masterchain ve shard'ları hakkında, TL yapısını doldurmamız gerekiyor:
```
tonNode.shardPublicOverlayId workchain:int shard:long zero_state_file_hash:int256 = tonNode.ShardPublicOverlayId;
```
Burada, `workchain` masterchain durumunda -1'e eşit olmalıdır; shard'ı -922337203685477580 (0xFFFFFFFFFFFFFFFF) olur ve `zero_state_file_hash`, zincirin sıfır durumunun hash'idir (file_hash), diğer veriler gibi, bu değer de global ağ yapılandırmasından `"validator"` alanında alınabilir:
```json
"zero_state": {
  "workchain": -1,
  "shard": -9223372036854775808, 
  "seqno": 0,
  "root_hash": "F6OpKZKqvqeFp6CQmFomXNMfMj2EnaUSOXN+Mh+wVWk=",
  "file_hash": "XplPz01CXAps5qeSWUtxcyBfdAo5zVb1N979KLSKD24="
}
```
`tonNode.shardPublicOverlayId` doldurulduktan sonra, serileştiriyoruz ve hash'leyerek anahtar ID'sini alıyoruz (her zamanki gibi).

Elde edilen anahtar ID'sini `name` olarak kullanarak `pub.overlay name:bytes = PublicKey` yapısını dolduruyoruz; bunu TL bayt dizisine sarıyoruz. Sonrasında onu serileştiriyoruz ve artık elde edilen anahtar ID'si kullanacağız.

Sonuç olarak elde edilen id, 
```bash
dht.findValue
```
işleminde kullanılacak ve `name` alanının değeri `nodes` kelimesi olacaktır. Önceki bölümdeki süreci tekrar ediyoruz; her şey daha önceki gibi fakat `updateRule` `dht.updateRule.overlayNodes` olacaktır.

Doğrulama sonrasında, workchain ve shard'ımız hakkında bilgi sahibi düğümlerin genel anahtarlarını (`id`) alacağız. Düğümlerin ADNL adreslerini almak için, anahtarlardan (hashleme yöntemi kullanarak) ID'ler oluşturmamız ve daha önce bahsedilen ADNL adresleri için yukarıdaki prosedürü tekrar etmemiz gerekiyor; `foundation.ton` alan adı için geçerli ADNL adresinde olduğu gibi.

Sonuç olarak, [overlay.getRandomPeers](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L237) aracılığıyla eğer istersek, bu zincirin diğer düğümlerinin adreslerini öğrenebileceğimiz düğümlerin adreslerini elde etmiş olacağız. Ayrıca, bu düğümlerden bloklar hakkında tüm bilgi alabileceğiz.

## Referanslar

***Burada [Oleg Baranov](https://github.com/xssnick) tarafından yazılan [orijinal makale](https://github.com/xssnick/ton-deep-doc/blob/master/DHT.md) bağlantısı.***