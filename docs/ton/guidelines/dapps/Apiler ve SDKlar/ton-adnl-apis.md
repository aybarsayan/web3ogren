# TON ADNL API

:::tip
Blockchain'a bağlanmanın farklı yolları vardır:
1. RPC veri sağlayıcısı veya başka bir API: çoğu durumda, onun stabilitesine ve güvenliğine *güvenmek* zorundasınız.
2. **ADNL bağlantısı**: bir `liteserver` ile bağlantı kuruyorsunuz. Erişilemez olabilirler, ancak kütüphaneye entegre edilmiş belirli bir doğrulama seviyesi ile yalan söyleyemezler.
3. Tonlib ikili dosyası: liteserver ile de bağlantı kuruyorsunuz, dolayısıyla tüm faydalar ve dezavantajlar geçerlidir, ancak uygulamanız ayrıca dışarıda derlenmiş dinamik yükleme kütüphanesi içerir.
4. Sadece offchain. Böyle SDK'lar hücreler oluşturmanıza ve serileştirmenize olanak tanır, daha sonra bunları API'lere gönderebilirsiniz.
:::

Müşteriler, ikili bir protokol kullanarak doğrudan Liteserver'lara (düğümler) bağlanır.

Müşteri, anahtar bloklarını, hesabın güncel durumunu ve alınan verilerin geçerliliğini garanti eden **Merkle kanıtlarını** indirir.

> **Not:** Okuma işlemleri (get-metot çağrısı gibi) indirilmiş ve doğrulanmış durumla yerel bir TVM başlatarak gerçekleştirilir. Blok zincirinin tam durumunu indirmeye gerek olmadığını belirtmek gerekir; müşteri yalnızca işlem için gerekli olanları indirir.

Kamuya açık liteserver'lara global konfigürasyondan ([Mainnet](https://ton.org/global-config.json) veya [Testnet](https://ton.org/testnet-global.config.json)) bağlanabilir veya kendi `Liteserver'ınızı` çalıştırabilir ve bunu `ADNL SDK'ları` ile yönetebilirsiniz.

[Daha fazla bilgi edinin](https://ton.org/ton.pdf) `Merkle kanıtları hakkında` [TON Beyaz Kitap](https://ton.org/ton.pdf) 2.3.10, 2.3.11.

Kamuya açık liteserver'lar (global konfigürasyondan), TON ile hızlı bir başlangıç yapmanızı sağlar. TON'da program yazmayı öğrenmek veya %100 çalışma süresi gerektirmeyen uygulamalar ve betikler için kullanılabilir.

:::warning
Üretim altyapısı oluşturmak için - iyi hazırlanmış bir altyapı kullanmanız önerilir:
- `kendi liteserver'ınızı ayarlayın`, 
- Liteserver premium sağlayıcılarını kullanın [@liteserver_bot](https://t.me/liteserver_bot)
:::

## Artılar & Eksiler

- ✅ **Güvenilir.** Gelen ikili verileri doğrulamak için Merkle kanıt hash'leri ile API kullanır.  
- ✅ **Güvenli.** Merkle kanıtlarını kontrol ettiğinden, güvenilmeyen liteserver'ları bile kullanabilirsiniz.  
- ✅ **Hızlı.** HTTP ara katman kullanmak yerine doğrudan TON Blockchain düğümlerine bağlanır. 

- ❌ **Karmaşık.** Anlamak için daha fazla zamana ihtiyaç vardır.  
- ❌ **Back-end öncelikli.** Web ön uçlarıyla (HTTP protokolü için oluşturulmuş) uyumlu değildir veya HTTP-ADNL proxy'si gerektirir.

## API referansı

Sunucuya yapılan istekler ve yanıtlar, belirli bir programlama dili için tiplenmiş bir arayüz oluşturmanıza olanak tanıyan `TL` şeması ile tanımlanır.

> **Kaynak:** [TonLib TL Şeması](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl)