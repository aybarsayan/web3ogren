# GetBlock ile TON API

Bu kılavuz, GetBlock tarafından sağlanan özel RPC uç noktalarını edinme ve kullanma ile ilgili temel adımları kapsayacaktır.

:::info
[GetBlock](https://getblock.io/) bir Web3 altyapı sağlayıcısıdır ve çeşitli blok zincir ağlarıyla, TON dahil olmak üzere, etkileşimde bulunmak için HTTP tabanlı API uç noktaları sunmaktadır.
:::

## TON Blok Zinciri Uç Noktalarına Nasıl Erişilir

GetBlock’ın uç noktalarını kullanmaya başlamak için kullanıcıların hesaplarına giriş yapmaları, bir TON uç noktası URL'si elde etmeleri ve işlem yapmaları yeterlidir. Daha ayrıntılı rehberlik için takip edin.

### 1. GetBlock Hesabı Oluşturun

GetBlock [web sitesini](https://getblock.io/?utm_source=external&utm_medium=article&utm_campaign=ton_docs) ziyaret edin ve ana sayfadaki “Ücretsiz Başlayın” butonunu bulun. Email adresinizle veya bir MetaMask cüzdanı bağlayarak bir hesap oluşturun.



### 2. TON Blok Zincirini Seçin

Giriş yaptıktan sonra, kontrol paneline yönlendirileceksiniz. "Uç Noktalarım" başlıklı bölümü bulun ve "Protokoller" açılır menüsünden "TON" seçeneğini işaretleyin.

- İstediğiniz ağı ve API türünü (JSON-RPC veya JSON-RPC(v2)) seçin.

![**GetBlock_hesap_kontrol_paneli**](../../../../images/ton/static/img/docs/getblock-img/unnamed-4.png)

### 3. Uç Nokta URL’nizi Oluşturun

TON blok zinciri uç noktanızın URL'sini oluşturmak için “Al” butonuna tıklayın.

> GetBlock API'sindeki tüm uç noktalar tutarlı bir yapıya sahiptir: `https://go.getblock.io/[ACCESS TOKEN]/`.  
> — GetBlock API Kılavuzu

Bu erişim belirteçleri, her kullanıcı veya uygulama için benzersiz tanımlayıcılar olarak hizmet eder ve isteğin uygun uç noktalara yönlendirilmesi için gerekli bilgileri içerir; hassas detayları ifşa etmeden. Temel olarak, ayrı yetkilendirme başlıkları veya API anahtarları ihtiyacını ortadan kaldırır.

Kullanıcılar birden fazla uç nokta oluşturma, belirteçlerini ifşa olmaları durumunda yenileme veya kullanılmayan uç noktaları silme esnekliğine sahiptir.

![**GetBlock_hesap_uç_noktaları**](../../../../images/ton/static/img/docs/getblock-img/unnamed-3.png)

Artık bu URL’leri kullanarak TON blok zinciri ile etkileşime girebilir, veri sorgulayabilir, işlemler gönderebilir ve merkeziyetsiz uygulamalar oluşturabilirsiniz; altyapı kurulumu ve bakım sıkıntısı olmadan.

---

### Ücretsiz İstekler ve Kullanıcı Sınırları

Lütfen, her kayıtlı GetBlock kullanıcısının 60 RPS (Saniyede İstek) ile sınırlandırılmış 40,000 ücretsiz isteği olduğunu unutmayın. İstek bakiyesi günlük olarak yenilenir ve desteklenen blok zincirleri boyunca herhangi bir paylaşılan uç noktada kullanılabilir.

:::tip
Gelişmiş özellikler ve yetenekler için kullanıcıların aşağıda açıklanacak ücretli seçenekleri keşfetme seçeneği bulunmaktadır.
:::

GetBlock.io, Paylaşılan Düğüm ve Adanmış Düğüm olarak iki tür plan sunar. Müşteriler ihtiyaçlarına ve bütçelerine göre tarife seçebilirler.

### Paylaşılan Düğüm

- Birden fazla müşterinin aynı anda kullandığı giriş seviyesi fırsat;
- Hız sınırı 200 RPS'ye çıkarıldı;
- Bireysel kullanım veya, tam ölçekli üretim uygulamalarına kıyasla daha düşük işlem hacmi ve kaynak gereksinimleri olan uygulamalar için iyi bir şekilde uygundur;
- Sınırlı bütçeye sahip bireysel geliştiriciler veya küçük ekipler için daha uygun bir seçenektir.

Paylaşılan düğümler, önemli bir başlangıç yatırımı veya taahhüt olmaksızın TON blok zinciri altyapısına erişim sağlamak için maliyet etkin bir çözüm sunar.

Geliştiriciler, uygulamalarını ölçeklendirdikçe ve ek kaynaklara ihtiyaç duydukça, abonelik planlarını kolayca yükseltebilir veya gerekirse adanmış düğümlere geçiş yapabilirler.

### Adanmış Düğüm

- Tek bir müşteri için özel olarak tahsis edilmiş bir düğüm;  
  İstek sınırı yok;
- Arşiv düğümlerine, çeşitli sunucu konumlarına ve özel ayarlara erişim açar;
- Müşterilere premium düzeyde hizmet ve destek garantisi verir.

Bu, geliştiriciler ve ölçeklendikçe yüksek bağlantı hızı ve garantili kaynaklar gerektiren merkeziyetsiz uygulamalar (dApp'ler) için bir sonraki düzey çözümüdür.

## GetBlock ile TON HTTP API Nasıl Kullanılır

Bu bölümde, GetBlock tarafından sağlanan TON HTTP API’nin pratik kullanımına dalacağız. Blok zinciri etkileşimleriniz için oluşturulan uç noktaların verimli bir şekilde nasıl kullanılacağını göstermek amacıyla örnekler inceleyeceğiz.

### Yaygın API çağrılarının örnekleri

Belirli bir adres için bakiyeyi almak için ‘/getAddressBalance’ yöntemini kullanarak basit bir örnekle başlayalım.

    curl --location --request GET 'https://go.getblock.io/[ACCESS-TOKEN]/getAddressBalance?address=EQDXZ2c5LnA12Eum-DlguTmfYkMOvNeFCh4rBD0tgmwjcFI-' \
    
    --header 'Content-Type: application/json'

Gerçek erişim belirtecinizle `ACCESS-TOKEN` kısmını değiştirmeyi unutmayın.

Bu, nanotonda bakiyeyi çıktılayacaktır.

![**getAddressBalance_cevabı_TON_blok_zincirinde**](../../../../images/ton/static/img/docs/getblock-img/unnamed-2.png)

TON blok zincirini sorgulamak için mevcut diğer yöntemler:

| # | Yöntem | Uç Nokta           | Açıklama                                                                                                |
|---|--------|--------------------|------------------------------------------------------------------------------------------------------------|
| 1 | GET    | getAddressState    | Belirli bir adresin TON blok zincirindeki mevcut durumunu (başlatılmamış, aktif veya dondurulmuş) döner   |
| 2 | GET    | getMasterchainInfo | Ana zincirin durumuna ilişkin bilgileri alır                                                             |
| 3 | GET    | getTokenData       | Belirli bir TON hesabıyla ilişkili bir NFT veya Jetton hakkında ayrıntıları alır                          |
| 4 | GET    | packAddress        | Bir TON adresini ham formatından okunabilir bir formata dönüştürür                                        |
| 5 | POST   | sendBoc            | Serileştirilmiş BOC dosyalarını ve harici mesajları blok zincirine yürütme için gönderir                  |

:::note
Kapsamlı bir API referansı için GetBlock'un [belgelendirmesine](https://getblock.io/docs/ton/json-rpc/ton_jsonrpc/) başvurun; örnekler ve ek yöntemler için bir liste içerir.
:::

### Akıllı sözleşmeleri dağıtma

Geliştiriciler, TON kütüphanesini kullanarak TON blok zincirine sözleşmeleri pürüzsüz bir şekilde dağıtmak için aynı uç nokta URL'lerini kullanabilirler.

Kütüphane, GetBlock HTTP API uç noktaları aracılığıyla ağa bağlanmak için bir istemci başlatacak.

![**TON Blueprint IDE'den görüntü**](../../../../images/ton/static/img/docs/getblock-img/unnamed-6.png)

Bu eğitim, GetBlock'un API'sini TON Blok Zinciri ile etkili bir şekilde kullanmak isteyen geliştiriciler için kapsamlı bir rehber sağlamalıdır.

Daha fazla bilgi için [web sitesini](https://getblock.io/?utm_source=external&utm_medium=article&utm_campaign=ton_docs) ziyaret edebilir veya GetBlock'un destek ekibiyle canlı sohbet, [Telegram](https://t.me/GetBlock_Support_Bot) veya web formu aracılığıyla iletişime geçebilirsiniz.