# Overlay alt ağlar

Uygulama:
* [TON Overlay GitHub](https://github.com/ton-blockchain/ton/tree/master/overlay)

## Genel Bakış

TON'un mimarisi, birçok zincirin aynı anda ve bağımsız olarak var olabilmesini sağlayacak şekilde yapılandırılmıştır - bu zincirler hem özel hem de kamuya açık olabilir. Düğümler, hangi shard'ları ve zincirleri depolayıp işleyeceklerini seçme yeteneğine sahiptir. Aynı zamanda, iletişim protokolü evrenselliği nedeniyle değişmeden kalır. DHT, RLDP ve Overlays gibi protokoller bunun başarılmasını sağlar. İlk iki protokolü zaten biliyoruz; bu bölümde Overlay'in ne olduğunu öğreniyoruz.

Overlays, tek bir ağı ek alt ağlara bölmekle sorumludur. Overlays, herhangi birinin bağlanabileceği kamuya açık olanlar veya giriş için ek kimlik bilgileri gereken ve sadece belirli bir grup insana bilinen özel olanlar olabilir.

TON'daki tüm zincirler, ana zincir dahil, kendi overlay'lerini kullanarak iletişim kurar. Buna katılmak için, içinde zaten bulunan düğümleri bulmanız ve onlarla veri alışverişine başlamanız gerekir. Kamuya açık overlay'ler için düğümleri DHT kullanarak bulabilirsiniz.

---

### ADNL ve Overlay ağları

:::info
ADNL'in aksine, TON overlay ağları genellikle diğer rastgele düğümlere veri datagramları göndermeyi desteklemez.
:::

Bunun yerine, belirli düğmler (ilgili overlay ağı ile "komşular" olarak adlandırılan) arasında bazı "yarı kalıcı bağlantılar" kurulur ve mesajlar genellikle bu bağlantılar aracılığıyla iletilir (yani, bir düğümden bir komşusuna).

Her overlay alt ağı, genellikle overlay ağının tanımının SHA256'sına eşit olan 256 bitlik bir ağ tanımlayıcısına sahiptir - bu, TL-serializeli bir nesnedir.

Overlay alt ağları kamuya açık veya özel olabilir.

Overlay alt ağları özel bir [gossip](https://en.wikipedia.org/wiki/Gossip_protocol) protokolü doğrultusunda çalışır.

---

### Overlay düğümleri ile etkileşim

Daha önce DHT hakkında bir makalede overlay düğümlerini bulma örneğini analiz etmiştik, `blok zincirinin durumunu depolayan düğümleri arama` bölümünde. Bu bölümde onlarla etkileşim kurmaya odaklanacağız.

DHT'yi sorguladığımızda, overlay düğümlerinin adreslerini alacağız; bu adreslerden, [overlay.getRandomPeers](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L237) sorgusunu kullanarak bu overlay'in diğer düğümlerinin adreslerini öğrenebiliriz. Yeterli sayıda düğüme bağlandığımızda, onlardan tüm blok bilgilerini ve diğer zincir olaylarını alabiliriz ve ayrıca onlara işlenmesi için kendi işlemlerimizi gönderebiliriz.

---

### Daha fazla komşu bulma

Overlay'de düğümleri almak için bir örneğe bakalım.

Bunu yapmak için, overlay'in bilinen herhangi bir düğümüne `overlay.getRandomPeers` isteği gönderin, TL şemasını serileştirin:
```tlb
overlay.node id:PublicKey overlay:int256 version:int signature:bytes = overlay.Node;
overlay.nodes nodes:(vector overlay.node) = overlay.Nodes;

overlay.getRandomPeers peers:overlay.nodes = overlay.Nodes;
```
`peers` - bilmediğimiz için boş bir dizi olacak şekilde, bildiğimiz komşuları içermelidir; yani, geri almak istemiyoruz.

Eğer sadece bazı bilgiler almak istemiyorsak, overlay'e katılmak ve yayın almak istiyorsak, isteği yaptığımız düğüm hakkında da `peers` bilgisi eklemeliyiz. Komşularımız bizimle ilgili bilgi edindiğinde - ADNL veya RLDP kullanarak bize yayın göndermeye başlayacaklardır.

Overlay içindeki her istek, TL şemasının ön eki ile başlayacak şekilde olmalıdır:
```tlb
overlay.query overlay:int256 = True;
```
`overlay`, overlay'in kimliği olmalıdır - `tonNode.ShardPublicOverlayId` şemasının anahtarı - DHT'yi aradığımız aynı kimlik.

İki serileştirilmiş şemayı, iki serileştirilmiş byte dizisini basitçe birleştirerek birleştirmemiz gerekiyor, `overlay.query` ilk sırada, `overlay.getRandomPeers` ikinci sırada olacak.

Elde edilen diziyi `adnl.message.query` şeması içinde sarıyoruz ve ADNL üzerinden gönderiyoruz. Yanıt olarak `overlay.nodes` bekliyoruz - bu, bağlanabileceğimiz overlay düğümlerinin bir listesi olacak ve gerekirse yeterli bağlantı alana kadar yeni düğümlere aynı isteği tekrarlayabiliriz.

---

### Fonksiyonel istekler

Bağlantı kurulduktan sonra, overlay düğümlerine [istekler](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L413) `tonNode.*` kullanarak erişebiliriz.

:::warning
Bu tür istekler için RLDP protokolü kullanılır. Ve her sorgu için `overlay.query` ön ekini unutmamak önemlidir - her overlay sorgusunda kullanılmalıdır.
:::

İsteklerin kendisinde olağanüstü bir şey yoktur; bunlar, [ADNL TCP hakkındaki makalede yaptığımız şeylere](https://v3.documentation/network/protocols/adnl/adnl-tcp#getmasterchaininfo) çok benzer.

Örneğin, `downloadBlockFull` isteği, zaten tanıdık blok kimliği şemasını kullanır:
```tlb
tonNode.downloadBlockFull block:tonNode.blockIdExt = tonNode.DataFull;
```
Bunu geçerek, blok hakkında tam bilgi indirebiliriz; yanıt olarak:
```tlb
tonNode.dataFull id:tonNode.blockIdExt proof:bytes block:bytes is_link:Bool = tonNode.DataFull;
or
tonNode.dataFullEmpty = tonNode.DataFull;
```
Mevcutsa, `block` alanı TL-B formatında verileri içerecektir.

Böylece, bilgileri doğrudan düğümlerden alabiliriz.

---

## Referanslar

_Buradaki [orijinal makale bağlantısı](https://github.com/xssnick/ton-deep-doc/blob/master/Overlay-Network.md) [Oleg Baranov](https://github.com/xssnick) tarafından._