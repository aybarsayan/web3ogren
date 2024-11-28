# TON HTTP Tabanlı API'ler

:::tip
Blok zincirine bağlanmanın farklı yolları vardır:
1. **RPC veri sağlayıcı veya başka bir API**: çoğu durumda, bunun kararlılığına ve güvenliğine *güvenmek* zorundasınız.
2. ADNL bağlantısı: bir `liteserver` ile bağlantı kuruyorsunuz. Erişilemez olabilir, ancak kütüphanede uygulanmış belirli bir doğrulama düzeyi ile, yanıltamaz.
3. Tonlib ikili dosyası: yine bir liteserver ile bağlantı kuruyorsunuz, bu nedenle tüm avantajlar ve dezavantajlar geçerlidir, ancak uygulamanız dışarıdan derlenmiş dinamik olarak yüklenen bir kütüphane içerir.
4. Sadece offchain. Bu tür SDK'lar, hücrelerin oluşturulmasını ve seri hale getirilmesini sağlar, daha sonra API'lere gönderilebilir.
:::

## Artılar & Eksiler

- ✅ Alışkanlık ve hızlı bir başlangıç için uygun, bu TON ile oynamak isteyen her yeni gelen için mükemmeldir.
- ✅ Web odaklı. TON akıllı sözleşmelerinden veri yüklemek için mükemmel olup, ayrıca mesaj göndermeye de olanak tanır.

- ❌ Basitleştirilmiş. İndekslenmiş bir TON API'sine ihtiyaç duyulan yerlerde bilgi almak mümkün değildir.
- ❌ HTTP-Aracı. Sunucu yanıtları blockchain verilerini `Merkle kanıtları` ile doğrulamadıkça tamamen güvenilir değildir.

---

## İzleme

* [status.toncenter](https://status.toncenter.com/) - son bir saat içinde aktif olan tüm tam ağ düğümleri ve doğrulayıcıları ile çeşitli istatistikleri gösterir.
* [Tonstat.us](https://tonstat.us/) - tüm TON ile ilgili API'lerin durumunu gösteren gerçek zamanlı Grafana tabanlı bir gösterge paneli sağlar, veriler her 5 dakikada bir güncellenir.

---

## RPC Düğümleri

* [QuickNode](https://www.quicknode.com/chains/ton?utm_source=ton-docs) - optimize edilmiş küresel erişim ve yük dengelemesi için en hızlı erişim sunan önde gelen blok zinciri düğüm sağlayıcısı.
* [Chainstack](https://chainstack.com/build-better-with-ton/) - coğrafi ve yük dengelemesi ile birden çok bölgede RPC düğümleri ve indeksleyici.
* [Tatum](https://docs.tatum.io/reference/rpc-ton) - bir basit platformda TON RPC düğümlerine ve güçlü geliştirici araçlarına erişin.
* [GetBlock Düğmeleri](https://getblock.io/nodes/ton/) - GetBlocks Düğümlerini kullanarak dApp'lerinizi bağlayın ve test edin.
* [TON Erişimi](https://www.orbs.com/ton-access/) - The Open Network (TON) için HTTP API.
* [Toncenter](https://toncenter.com/api/v2/) - API ile Hızlı Başlangıç için topluluk tarafından barındırılan proje. (Bir API anahtarı almak için [@tonapibot](https://t.me/tonapibot))
* [ton-node-docker](https://github.com/fmira21/ton-node-docker) - Docker Tam Düğüm ve Toncenter API.
* [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api) - kendi RPC düğümünüzü çalıştırın. 
* [nownodes.io](https://nownodes.io/nodes) - NOWNodes tam Düğümleri ve blockbook Gözlemcileri API aracılığıyla.
* [Chainbase](https://chainbase.com/chainNetwork/TON) - The Open Network için Düğüm API'si ve veri altyapısı.

---

## İndeksleyici

### Toncenter TON İndeksi

İndeksleyiciler, belirli filtrelerle jetton cüzdanlarını, NFT'leri ve işlemleri listelemek için yalnızca belirli olanları almakla kalmaz.

- Kamu TON İndeksi kullanılabilir: testler ve geliştirme ücretsizdir, [premium](https://t.me/tonapibot) üretim için - [toncenter.com/api/v3/](https://toncenter.com/api/v3/).
- [Worker](https://github.com/toncenter/ton-index-worker/tree/36134e7376986c5517ee65e6a1ddd54b1c76cdba) ve [TON İndeks API sargısı](https://github.com/toncenter/ton-indexer) ile kendi TON İndeksinizi çalıştırın.

### Anton

Go diliyle yazılmış olan Anton, Apache License 2.0 altında mevcut olan açık kaynak The Open Network blok zinciri indeksleyicisidir. Anton, geliştiricilerin blok zinciri verilerine erişim sağlaması ve analiz etmesi için ölçeklenebilir, esnek bir çözüm sunmak üzere tasarlanmıştır. Amacımız, geliştiricilerin ve kullanıcıların blok zincirinin nasıl kullanıldığını anlamalarına yardımcı olmak ve geliştiricilerin kendi sözleşmelerini özel mesaj şemalarıyla gözlemciye eklemelerine olanak tanımaktır.

* [Proje GitHub](https://github.com/tonindexer/anton) - kendi indeksleyicinizi çalıştırmak için
* [Swagger API dokümantasyonu](https://github.com/tonindexer/anton), [API Sorgu Örnekleri](https://github.com/tonindexer/anton/blob/main/docs/API.md) - kullanmak, belgeleri incelemek ve örnekleri gözden geçirmek için
* [Apache Superset](https://github.com/tonindexer/anton) - verileri görüntülemek için kullanın

### GraphQL Düğümleri

GraphQL düğümleri de indeksleyici olarak işlev görür.

* [dton.io](https://dton.io/graphql) - sözleşme verilerini "jetton mı", "NFT mi" bayraklarıyla artırmanın yanı sıra, işlemleri taklit etme ve yürütme izlerini alma olanağı sağlar.

---

## Diğer API'ler

* [TonAPI](https://docs.tonconsole.com/tonapi) - kullanıcılara akıllı sözleşmelerin düşük düzeyli ayrıntılarıyla ilgilenmeden akıcı bir deneyim sunmak için tasarlanan API.