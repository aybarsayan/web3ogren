# Sık Sorulan Sorular

Bu bölüm, TON Blockchain hakkında en popüler soruları kapsar.

## Genel Bakış

### TON hakkında kısa bir genel bilgi verebilir misiniz?

- `The Open Network'e Giriş`
- [TON Blockchain, PoS konsensüsüne dayanmaktadır](https://blog.ton.org/the-ton-blockchain-is-based-on-pos-consensus)
- `TON Beyaz Kitapları`

### EVM blok zincirlerine benzerlikler ve farklılıklar nelerdir?

- `Ethereum'dan TON'a`
- [TON, Solana ve Ethereum 2.0 Karşılaştırması](https://ton.org/comparison_of_blockchains.pdf)

### TON'un bir test ortamı var mı?

- `Testnet`

---

## TON ve L2

### İş zincirleri neden L1 → L2'den daha iyidir?

TON'daki iş zincirleri, geleneksel L1 ve L2 katman mimarisine göre birçok avantaj sunar.

1. **Anlık İşlem İşleme**: Bir blok zincirinin en önemli avantajlarından biri, işlemlerin anlık işlenmesidir. Geleneksel L2 çözümlerinde, varlıkların katmanlar arasında taşınmasında gecikmeler olabilir. İş zincirleri, ağın farklı parçaları arasında kesintisiz ve anlık işlemler sağlayarak bu sorunu ortadan kaldırır. Bu, yüksek hız ve düşük gecikme gerektiren uygulamalar için özellikle önemlidir.
2. **Çapraz Shard Desteği**: İş zincirleri, çapraz shard aktivitesini destekler; yani kullanıcılar, aynı ağ içindeki farklı shard zincirleri veya iş zincirleri arasında etkileşimde bulunabilir.
3. **Ölçeklenebilirlik**: Ölçeklenebilirlik, modern blok zincir sistemleri için en önemli zorluklardan biridir. Geleneksel L2 çözümlerinde, ölçeklenebilirlik, sıralayıcının kapasitesiyle sınırlıdır. Eğer L2'deki TPS (saniyedeki işlem sayısı) sıralayıcının kapasitesini aşarsa, sorunlarla karşılaşmak mümkündür. TON'daki iş zincirlerinde bu sorun, shard'ı bölerek çözülmektedir.

:::tip
**Özet**: İş zincirleri, geleneksel L1 ve L2 çözümlerine göre daha hızlı, daha ölçeklenebilir ve kesintisiz işlem yeteneği sunar.
:::

### TON üzerinde L2'ye ihtiyaç var mı?

Herhangi bir işlem maliyetinde, o ücreti sürdüremeyen ancak çok daha düşük bir maliyetle çalışabilen uygulamalar her zaman olacaktır. Benzer şekilde, varılan gecikmeye bakılmaksızın, daha düşük gecikme gerektiren uygulamalar her zaman vardır. Bu nedenle, gelecekte TON platformunda bu özel gereksinimlere yanıt vermek için L2 çözümlerine ihtiyaç duyulabileceği öngörülebilir.

---

## MEV

### TON'da öncelikli işlemler mümkün mü?

TON blok zincirinde, belirleyici işlem sırası, öncelikli işlemleri önlemek için önemli bir rol oynar. Bu, bir blok zinciri içindeki işlemlerin sırasının önceden belirlendiği ve belirleyici olduğu anlamına gelir. 

:::warning
Bu sistem, işlemlerin sırasını kar elde etmek amacıyla manipüle etme olasılığını ortadan kaldırır ve TON'u, blok içindeki işlemlerin sırasını değiştirebilen Ethereum gibi diğer blok zincirlerinden ayırır; bu, MEV (maksimum çıkarılabilir değer) fırsatları yaratır.
:::

### Blok

### Blok bilgilerini almak için kullanılan RPC yöntemi nedir?

Validatorlar tarafından üretilen bloklar. Mevcut bloklar, Lite sunucuları aracılığıyla mevcuttur. 

- Lite İstemci çekirdeğine erişmek için GitHub'daki bu bölümü kontrol edin: [ton-blockchain/tonlib](https://github.com/ton-blockchain/ton/tree/master/tonlib)

Ayrıca, aşağıda üç yüksek seviyeli üçüncü taraf blok keşif aracı bulunmaktadır:
- https://explorer.toncoin.org/last
- https://toncenter.com/
- https://tonwhales.com/explorer

Daha fazla bilgi için belgelerimizdeki `TON'daki Keşif Araçları` bölümüne göz atın.

---

### Blok süresi

_2-5sn_

:::info
TON'un zincir üzerindeki metriklerini, blok süresi ve nihai süre gibi, Solana ve Ethereum ile karşılaştırmak için analizimize göz atabilirsiniz:
* [Blok Zincirleri Karşılaştırma Belgesi](https://ton.org/comparison_of_blockchains.pdf)
* `Blok Zincirleri Karşılaştırma Tablosu (belgeden çok daha az bilgilendirici, ancak daha görsel)`
:::

### Nihai süresi

_6 sn altında._

:::info
TON'un zincir üzerindeki metriklerini, blok süresi ve nihai süre gibi, Solana ve Ethereum ile karşılaştırmak için analizimize göz atabilirsiniz:
* [Blok Zincirleri Karşılaştırma Belgesi](https://ton.org/comparison_of_blockchains.pdf)
* `Blok Zincirleri Karşılaştırma Tablosu (belgeden çok daha az bilgilendirici, ancak daha görsel)`
:::

### Ortalama blok boyutu

```bash 
max block size param 29
max_block_bytes:2097152
```

:::info
Daha fazla güncel parametreyi `Ağ Yapılandırmaları` bölümünde bulabilirsiniz.
:::

### TON'daki blokların düzeni nedir?

Düzenin her alanına ilişkin ayrıntılı açıklamalar:

- `Blok düzeni`

---

## İşlemler

### İşlem verilerini almak için RPC yöntemi

- `yukarıdaki yanıtı görün`

### TON işlemi asenkron mu yoksa senkron mu? Bu sistemin nasıl çalıştığını gösteren belgeler erişilebilir mi?

TON Blockchain mesajları asenkron:
- gönderici işlem gövdesini (mesaj boc) hazırlar ve Lite İstemci (veya daha yüksek seviyeli bir araç) aracılığıyla yayınlar.
- Lite İstemci, yayın durumunu geri döndürür, ancak İşlemin yürütülmesinin sonucunu değil.
- gönderici, hedef hesap (adres) durumunu veya tüm blok zinciri durumunu dinleyerek istenen sonucu kontrol eder.

:::note
TON asenkron mesajlaşmanın nasıl çalıştığını, Cüzdan akıllı sözleşmeleri ile ilgili bir örnek üzerinden açıklar:
- [TON cüzdanları nasıl çalışır ve bunlara JavaScript ile nasıl erişilir](https://blog.ton.org/how-ton-wallets-work-and-how-to-access-them-from-javascript#1b-sending-a-transfer)
:::

---

### Bir işlemin %100 tamamlandığını belirlemek mümkün mü? İşlem düzeyi verilerini sorgulamak bu bilgiyi elde etmek için yeterli mi?

**Kısa yanıt:** İşlemin tamamlandığından emin olmak için alıcının hesabını kontrol etmek gereklidir.

:::tip
İşlem doğrulaması hakkında daha fazla bilgi edinmek için lütfen aşağıdaki örneklere göz atın:
- Go: [Cüzdan örneği](https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go)
- Python: `TON'da ödemelerle vitrin botu`
- JavaScript: `Dumpling satışları için kullanılan bot`
:::

### TON'daki bir işlemin düzeni nedir?

Düzenin her alanına ilişkin ayrıntılı açıklamalar:
- `İşlem düzeni`

### İşlem gruplama mümkün mü?

Evet, TON'da işlem gruplama iki ayrı şekilde gerçekleştirilebilir:
- TON'un asenkron doğasını kullanarak, yani bağımsız işlemleri ağa göndermek.
- Görev alıp bunu bir grup olarak yürütebilen akıllı sözleşmeler kullanarak.

Örnek, grup özelliğine sahip sözleşmenin (yüksek yük cüzdanı):
- https://github.com/tonuniverse/highload-wallet-api

Varsayılan cüzdanlar (v3/v4) de bir işlemde birden fazla mesaj gönderimini (4'e kadar) destekler.

---

## Standartlar

### TON için hangi para birimlerinin hassasiyeti mevcuttur?

_9 haneli_

:::info
Mainnet tarafından desteklenen ondalık basamak sayısı: 9 haneli.
:::

### İşlemlerde fungible ve non-fungible token'ların basımı, yakılması ve transferi için standartlaştırılmış protokoller var mı?

Non-fungible token'lar (NFT'ler):
- [TEP-62: NFT standardı](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)
- `NFT belgelemesi`

Jettonlar (token'lar):
- [TEP-74: Jettonlar standardı](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- [Dağıtılmış token'lar genel bakışı](https://telegra.ph/Scalable-DeFi-in-TON-03-30)
- `Fungible token belgelemesi (Jettonlar)`

Diğer Standartlar:
- https://github.com/ton-blockchain/TEPs

### Jettonlar (Tokenlar) ve NFT ile olayları ayrıştırma örnekleri var mı?

TON'da tüm veriler boc-mesajları olarak iletilir. Bu, işlemlerde NFT'lerin kullanımının olağan bir olay olmadığı anlamına gelir. Ancak, belirli dizinlenmiş API'ler, bir sözleşmeye gönderilen veya o sözleşmeden alınan tüm mesajları görüntülemenizi sağlar ve bunları belirli gereksinimlerinize göre filtrelemenizi sağlar.

- https://docs.tonconsole.com/tonapi/rest-api

Bu sürecin nasıl çalıştığını daha iyi anlamak için `Ödeme İşleme` bölümüne göz atabilirsiniz.

---

## Hesap Yapısı

### Adres formatı nedir?

- `Akıllı Sözleşme Adresi`

### ENS benzeri bir isimli hesaba sahip olmak mümkün mü?

Evet, TON DNS kullanarak:
- `TON DNS & Alan Adları`

### Normal bir hesap ile akıllı sözleşme arasında nasıl ayrım yapılır?

- `Her şey bir akıllı sözleşmedir`

### Bir adresin bir token adresi olup olmadığını nasıl anlarız?

Bir **Jetton** sözleşmesi, [standardın arayüzünü](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) uygulamalı ve _get_wallet_data()_ veya _get_jetton_data()_ metotları ile veri döndürmelidir.

### Ağ tarafından sahip olunan özel hesaplar (örneğin, ağın sahip olduğu hesaplar) var mı ve bunların diğerlerinden farklı kuralları veya yöntemleri var mı?

TON içinde özel bir ana blok zinciri vardır ve buna Masterchain denir. 

:::info
Masterchain, iş zincirleri ve shard zincirleri hakkında daha fazla bilgi edinmek için: `Blok Zincirleri Blok Zinciri` makalesine göz atın.
:::

İyi bir örnek, masterchain'in parçası olan akıllı yönetişim sözleşmesidir:
- `Yönetişim sözleşmeleri`

---

## Akıllı Sözleşmeler

### TON'da sözleşme dağıtım olaylarını tespit etmek mümkün mü?

:::tip
`TON'da her şey bir akıllı sözleşmedir`.
:::

Hesap adresi, _ilk durumundan_ belirleyici bir şekilde üretilir; bu, _ilk kodu_ ve _ilk verileri_ (cüzdanlar için, ilk veri arasında genel anahtar gibi diğer parametreler vardır) içerir. Herhangi bir bileşen değiştiğinde, adres de buna göre değişir.

Akıllı sözleşme, başlatılmamış bir durumda var olabilir; bu, durumunun blok zincirinde mevcut olmadığı, ancak sözleşmenin sıfır olmayan bir bakiyeye sahip olduğu anlamına gelir. İlk durum, daha sonra içsel veya dışsal bir mesajla ağa gönderilebilir, dolayısıyla bunlar sözleşme dağıtımını tespit etmek amacıyla izlenebilir.

:::note
Mesaj zincirlerinin mevcut olmayan sözleşmelerde duraklamasını önlemek için TON, "bounce" özelliğini kullanır. Daha fazla bilgi için bu makalelere göz atın:
- `TonLib aracılığıyla cüzdan dağıtımı`
- `Sorguları işlemek ve yanıt göndermek için ödeme yapma`
:::

### Akıllı sözleşmelerin güncellenebilirliği, kullanıcıları için tehdit oluşturur mu?

Günümüzde akıllı sözleşmeleri güncelleme yeteneği, normal bir uygulama haline gelmiştir ve çoğu modern protokolde yaygın olarak kullanılmaktadır. Bu, güncellenebilirliğin hata düzeltmeleri, yeni özellikler eklemek ve güvenliği artırmak için önemli olmasından kaynaklanmaktadır.

:::tip
Riskleri azaltmak için:
1. İyi bir üne sahip projelere ve tanınmış geliştirme ekiplerine dikkat edin.
2. Güvenilir denetim firmalarından tamamlanmış birkaç denetime sahip projeleri arayın.
3. Aktif bir topluluk ve olumlu geri bildirim, bir projenin güvenilirliğinin ek bir göstergesi olabilir.
4. Projenin güncelleme sürecini nasıl uyguladığını inceleyin. 
:::

### Kullanıcılar, sözleşme sahibinin belirli koşulları değiştirmeyeceğinden (bir güncelleme yoluyla) nasıl emin olabilir?

Sözleşmenin doğrulanması gerekir; bu, kaynak kodunu kontrol etmenizi ve değişiklik yapılmasını sağlamak için güncelleme mantığı olmadığını garanti etmenizi sağlar.

### Var olan bir adrese kodu yeniden dağıtmak mümkün mü yoksa yeni bir sözleşme olarak mı dağıtılmalıdır?

Evet, bu mümkündür. Eğer bir akıllı sözleşme belirli talimatları (`set_code()`) gerçekleştirirse, kodu güncellenebilir ve adres aynı kalır.

### Akıllı sözleşme silinebilir mi?

Evet, ya depolama ücreti birikimi sonucu (sözleşmenin silinmesi için -1 TON bakiyesine ulaşması gerekir) ya da [mod 160](https://v3/documentation/smart-contracts/message-management/sending-messages#message-modes) ile bir mesaj gönderilerek silinebilir.

---

### Akıllı sözleşme adresleri büyük/küçük harf hassasiyetine sahip mi?

Evet, akıllı sözleşme adresleri büyük/küçük harf hassasiyetine sahiptir çünkü [base64 algoritması](https://en.wikipedia.org/wiki/Base64) kullanılarak üretilir. Akıllı sözleşme adresleri hakkında daha fazla bilgi almak için `buradan` göz atabilirsiniz.

---

### Ton Sanal Makinesi (TVM) EVM ile uyumlu mu?

TVM, Ethereum Çalışma Makinesi (EVM) ile uyumlu değildir çünkü TON, tamamen farklı bir mimariden yararlanır.

:::note
[Asenkron akıllı sözleşmeler hakkında daha fazla bilgi okuyun](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25).
:::

### TON için Solidity ile yazmak mümkün mü?

Aynı zamanda, TON ekosistemi Ethereum'un Solidity programlama dilinde geliştirmeyi desteklememektedir.

Ancak, Solidity sözdizimine asenkron mesajlar ekleyip, verilerle düşük seviyede etkileşim yeteneğini eklerseniz, FunC elde edersiniz. FunC, çoğu modern programlama diline ortak bir sözdizimi sunar ve özellikle TON üzerinde geliştirme için tasarlanmıştır.

---

## Uzaktan Prosedür Çağrıları (RPC'ler)

### Veri çıkarmak için önerilen düğüm sağlayıcıları şunlardır:

API türleri:
- Farklı `API Türleri` hakkında daha fazla bilgi edinin.

Düğüm sağlayıcı ortakları:

- https://toncenter.com/api/v2/
- [getblock.io](https://getblock.io/)
- https://www.orbs.com/ton-access/
- [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api) 
- [nownodes.io](https://nownodes.io/nodes)
- https://dton.io/graphql

TON Topluluğundan projelerin bulunduğu dizin:

- [ton.app](https://ton.app/)

### Aşağıda, TON Blockchain'deki kamu düğüm uç noktalarıyla ilgili bilgi almak için kullanılan iki ana kaynak yer almaktadır (hem TON Mainnet hem de TON Testnet için).

- `Ağ Yapılandırmaları`
- `Örnekler ve dersler`