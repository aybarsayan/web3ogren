---
title: En İyi Uygulamalar - BNB Akıllı Zincir Düğüm Yapılandırması - BSC Geliştirme
description: Bu içerik, BNB Akıllı Zincir düğüm yapılandırması için en iyi uygulamaları, donanım gereksinimlerini ve önerilen ayarları kapsamaktadır. Kullanıcılar için hızlı, arşiv ve tam düğüm yapılandırmaları ile beraber güvenlik önlemleri hakkında bilgi sunulmaktadır.
keywords: [BNB, Akıllı Zincir, Düğüm Yapılandırması, BSC, Geliştirme, Performans, Güvenlik]
---

# BNB Akıllı Zincir (BSC) Düğüm Yapılandırması: En İyi Uygulamalar

## Donanım Spesifikasyonları

Optimal performans ve güvenilirlik sağlamak için, BNB Akıllı Zincir üzerinde işlem işleme ve durum sorgulama için belirli gereksinimlerinize dayanan uygun düğüm türünü seçmek kritik öneme sahiptir.

### Hızlı Düğüm (Tavsiye Edilen Yapılandırma)

En son dünya durumuna hafif bir modda erişim gerektiren kullanıcılar için hızlı düğüm ideal bir seçimdir. Bu, sisteminizin CPU'su ve disk alanı üzerinde daha az yük oluşturur.

- **İşlemci**: Minimum 16 çekirdekli CPU.
- **Bellek**: En az 32 GB RAM.
- **Depolama**: Minimum 2TB kapasiteye sahip Katı Hal Sürücüsü (SSD).
- **Ağ**: Stabil ve hızlı internet bağlantısı, minimum 5 MBps.

### Arşiv Düğümu

BSC ana ağının tüm tarihi dünya durumuna kapsamlı erişim için bir Arşiv Düğümü dağıtmayı düşünün. Detaylı talimatlar için [BSC Erigon GitHub deposuna](https://github.com/node-real/bsc-erigon) bakabilirsiniz.

- **İşlemci**: Minimum 16 çekirdekli CPU.
- **Bellek**: En az 128 GB RAM.
- **Depolama**: Minimum 10TB kapasiteye sahip SSD (optimal performans için NVME SSD'ler önerilir).
- **Ağ**: Stabil ve hızlı internet bağlantısı, minimum 5 MBps.

### Tam Düğüm

En son dünya durumunu almak ve durumun geçerliliğini doğrulamak veya veri kanıtları üretmek için standart bir Tam Düğüm uygundur.

- **İşlemci**: Minimum 16 çekirdekli CPU.
- **Bellek**: En az 64 GB RAM.
- **Depolama**: Minimum 3TB kapasiteye sahip Katı Hal Sürücüsü (SSD).
- **Ağ**: Stabil ve hızlı internet bağlantısı, minimum 5 MBps.

---

## Eşler Yapılandırması

### Ana Ağ

- Statik düğümleri belirtmenize gerek yoktur; ana ağ için yalnızca kodda zaten yapılandırılmış olan Bootnode'lar gereklidir. Ayrıca, en son sürümden config.toml dosyasını kullandığınızdan emin olun. Daha fazla detay için bu [bloga](https://forum.bnbchain.org/t/try-bootnodes-after-bsc-release-v1-2-12/1998#h-32to-join-the-network-with-bootnodes-5) göz atabilirsiniz.

### Test Ağı

- Test ağında hala Statik Düğümleri manuel olarak yapılandırmanız gerekmekte ve bu nedenle Statik Düğümler listesi en son sürümün config.toml dosyasındadır. Örneğin: geth v1.3.7 için statik düğümlerle güncellenmiş config.toml'a buradan bakabilirsiniz: [geth v1.3.7 test ağı yapılandırması](https://github.com/bnb-chain/bsc/releases/download/v1.3.7/testnet.zip)

---

## Anlık Görüntülerin Açıklaması

BSC, esasen [PBSS & PebbleDB](https://forum.bnbchain.org/t/faq-pbss-pebbledb/2260) desteği sağlayacağından, yalnızca PBSS&PebbleDB anlık görüntülerini kapsayacağız ve HashBased&LevelDB anlık görüntülerini buradan göz ardı edeceğiz. Bu [referansa](https://github.com/bnb-chain/bsc-snapshots/issues/349) başvurun.

## Test Ağı'nda Eş Olmaması Sorun Giderme

:::warning
Yanlış zincir kimliği veya yanlış yapılandırma dosyası/dizini gibi yapılandırma sorunlarını kontrol edin.
:::

- En son sürüme göre config.toml dosyasını güncellemeyi unutmayın.
- Test ağı üzerinde bootnode kullanmayın, bu gerekli değildir.
- `geth/nodes` ve `geth/nodekey` dosya/dizini silmek yardımcı olabilir.
- Anlık görüntüyü yeniden indirin ve tekrar deneyin.

Referans [burada](https://github.com/bnb-chain/bsc/issues/2164#issuecomment-1897980997).

---

## İzleme Metrikleri ve Uyarılar

Düğüm sağlığı ve performansını korumak için aşağıdaki ana metrikleri izleyin:

- **İşlem Havuzu Uyarısı**: İşlem havuzu 5000 işlemi aştığında tetiklenir.
- **Blok İçe Aktarım Süresi Uyarısı**: Blok içe aktarma süresi 3 saniyeyi aştığında etkinleşir.
- **RPC Gecikmesi Uyarısı**: RPC gecikmesi 100ms'yi aştığında başlatılır.

---

## Performans Optimizasyonu

BSC düğümleri, performansı artırmak için yapılandırılabilir önbellek ayarları sunar. **Fiziksel belleğin** yaklaşık üçte birini önbelleğe ayırmak tavsiye edilir. Örneğin, 64GB fiziksel bellek ile, önbellek ayarı şöyle yapılandırılabilir:

```
--cache 20000
```

## Senkronizasyon Hızını Takip Edin

```
t=2021-05-13T17:17:17+0800 lvl=info msg="Yeni zincir segmenti içe aktarıldı"             blocks=11  txs=3701  mgas=482.461  elapsed=8.075s    mgasps=59.744  number=7,355,800 hash=0x84e085b1cd5b1ad4f9a954e2f660704c8375a80f04326395536eedf83363942f age=12h38m32s dirty="583.73 MiB"
t=2021-05-13T17:17:20+0800 lvl=info msg="Derin dondurulmuş zincir segmenti"               blocks=117 elapsed=263.497ms number=7,265,806 hash=0x7602f6b960b4092d39ff49781c64404a047e2c78bc166f071ee8714020c39b2e
t=2021-05-13T17:17:25+0800 lvl=info msg="Yeni zincir segmenti içe aktarıldı"             blocks=17  txs=5025  mgas=740.885  elapsed=8.125s    mgasps=91.177  number=7,355,817 hash=0xde7a2a76ff7b38414acf3b360bb427d2d0b7dd1f8fe2afe2ffd59d64b237a81b age=12h37m49s dirty="594.65 MiB"
t=2021-05-13T17:17:33+0800 lvl=info msg="Yeni zincir segmenti içe aktarıldı"             blocks=18  txs=5108  mgas=748.016  elapsed=8.354s    mgasps=89.535  number=7,355,835 hash=0x757c476f9fe30fc6ef001fb4a03fa991843cf3ed271f21cfc01a9bba5e5eff98 age=12h37m3s  dirty="604.39 MiB"
t=2021-05-13T17:17:42+0800 lvl=info msg="Yeni zincir segmenti içe aktarıldı"             blocks=18  txs=5612  mgas=799.778  elapsed=8.260s    mgasps=96.815  number=7,355,853 hash=0x73e87742ef4405ffefec987fc4b8b19e69c54b8f914c27ea69a502fae4d735e0 age=12h36m18s dirty="613.03 MiB"
```

Senkronizasyon hızınız **mgasps**. Değerin yaklaşık 100 civarında olması gerekiyor. Eğer yavaş senkronize oluyorsanız, lütfen diskinizin hızını kontrol edin.

---

## Çalışma Verisi Anlık Görüntüsünü Kullanma

Lütfen zincir verisi [anlık görüntüsünü](https://github.com/bnb-chain/bsc-snapshots) indirin ve hızlandırmak için ana klasörünüze çıkarın.

## BNB'nizi Donanım Cüzdanı ile Saklayın

**Bir doğrulayıcı için en değerli varlıklar iki anahtardır**: biri işlemleri imzalamak, diğeri ise blokları imzalamak için.

---

## Tam Düğüm RPC'nizi Kötü Amaçlı Kullanıcılardan Koruma

Lütfen RPC uç noktalarınızı genel ağda açmayın.

## Hesap Özel Anahtarları

BNB'nizi korumak için, 24 kelimenizi kimseyle paylaşmayın. Bunları bilmesi gereken tek kişi sizsiniz. Kısacası, HSM'ler özel anahtarlarınızı güvenli bir şekilde oluşturmanıza, saklamanıza ve yönetmenize yardımcı olan uygun fiyatlı, performanslı ve taşınabilir donanım parçalarıdır. Kötü amaçlı yazılım saldırıları ve özel anahtarların uzaktan çıkarılması, bir HSM düzgün yapılandırıldığında çok daha zordur.

---

## Yazılım Güvenlik Açıkları

BNB'nizi korumak için, yazılımı yalnızca resmi kaynaklardan indirin ve her zaman en son ve en güvenli sürümü kullandığınızdan emin olun.

## Sunucuyu Daemon Olarak Çalıştırma

**geth**'nin her zaman çalışır durumda olması önemlidir. Bunu sağlamanın birkaç yolu vardır ve önerdiğimiz en basit çözüm, **geth**'yi sistemd servisi olarak kaydettirmektir, böylece sistem yeniden başlatıldığında ve diğer olaylarda otomatik olarak başlatılır.

--- 

## Yedek Düğüm Kurma

* Arşiv modunda doğrulayıcı düğümü çalıştırın.
* Düğümleri düzgün bir şekilde kapatın.
* Araçlarla aktif izleme.

## Yedek Düğüm Çalıştırma Adımları

1. En son geth sürümünü kurun.
2. Hızlı senkronizasyon modu kullanarak en son yüksekliğe senkronize olun. Dilerseniz en son anlık görüntüyü indirebilir veya düğümünüz tamamen senkronize olduğunda hızlı senkronizasyona başlayabilirsiniz.
3. Düğümünüzü düzgün bir şekilde kapatın: `kill -HUP $(pgrep geth)`.
4. Düğümünüzü yeniden başlatın.

### Yeniden Başlatma Sonrası Düğüm Neden Bir Süre Çevrimdışı Olacak? veya Müşteri Zorla Kapatılırsa Ne Olur?

Uzun bir süre (senkronize) çalıştıktan sonra aniden sona erdirildiğinde, yalnızca arşiv düğümlerinin yeniden başlatıldığında hızlı bir şekilde senkronize olması beklenir.

> **Nedenler**
> Eğer Geth çökse (veya düzgün kapatılmazsa), bellek içinde tutulan son durum kaybolur ve yeniden oluşturulması gerekir. Geth'in durumları geri yüklemesi uzun zaman alır.
> 
> Temel neden, **geth**'nin durum trie'ını periyodik olarak temizlemesidir. Bu süre, **config.toml** dosyasındaki **trieTimeout** olarak tanımlanmıştır.

---

## Yedek Düğümü Doğrulayıcı Düğümü Haline Nasıl Güncelleyebilirsiniz?

Yeni blokları madencilikten durdurmak için **geth console** içerisinde komutlar gönderebilirsiniz.

**geth attach ipc:path/to/geth.ipc** ile doğrulayıcı düğümünüze bağlanın.

```bash
miner.stop()
```

Ardından, yedek düğümün doğrulamaya devam etmesine izin verin,

```bash
miner.start()
```

---

## Doğrulayıcıları Güvende Tutma

Her doğrulayıcı adayının operasyonlarını bağımsız olarak yürütmeleri teşvik edilmektedir, çünkü çeşitli kurulumlar ağın dayanıklılığını artırır. Doğrulayıcılar tarafından yapılan yüksek yatırım miktarı nedeniyle, bunları çeşitli DoS ve DDoS saldırılarından korumak son derece önemlidir. Bu bölümde, BSC'nin doğrulayıcıları için benimsemiş olduğu güvenlik mekanizmasını tartışıyoruz.

### Sentry Düğümleri (DDOS Koruması)

Doğrulayıcılar, ağın hizmet reddi saldırılarına dayanıp dayanamayacağını sağlama konusunda sorumludur. Bu riskleri azaltmanın önerilen bir yolu, doğrulayıcıların ağ topolojisini sentry düğüm mimarisi olarak dikkatlice yapılandırmasıdır. Sentry düğümleri hızlı bir şekilde yapılandırılabilir veya IP adreslerini değiştirebilir. Sentry düğümlerine bağlantılar özel IP alanında olduğundan, internet tabanlı bir saldırı onları doğrudan rahatsız edemez. Bu, doğrulayıcı blok teklifleri ve oylarının her zaman ağın geri kalanına ulaşmasını sağlar.

Sentry düğüm mimarinizi kurmak için aşağıdaki talimatları izleyebilirsiniz:

1. Özel bir ağ oluşturun ve doğrulayıcı düğüm ile sentry düğümü arasında güvenilir özel bağlantılar kurun.

Lütfen doğrulayıcı tam düğümünüzün RPC uç noktalarını genel ağa açmayın.

`fullnode` yükleyin.

2. Sentry'yi doğrulayıcı düğüm için eşler olarak ayarlayın.

Sentry düğüm konsolunda **admin.nodeInfo.enode** komutunu çalıştırın. Şuna benzer bir çıktı almanız gerekir:

```
enode://f2da64f49c30a0038bba3391f40805d531510c473ec2bcc7c201631ba003c6f16fa09e03308e48f87d21c0fed1e4e0bc53428047f6dcf34da344d3f5bb69373b@[::]:30306?discport=0
```

!!! Not:
* [::] localhost (127.0.0.1) olarak görüntülenecektir. Düğümleriniz yerel bir ağda ise, her bir bireysel ana makineyi kontrol edin ve `ifconfig` ile IP'nizi bulun.
* Eğer eşleriniz yerel ağda değilse, enode URL'sini oluşturmak için dış IP adresinizi bilmeniz gerekir (bir hizmet kullanın).

Bu değeri kopyalayın ve ilk düğüm konsolunda çalıştırın,

Doğrulayıcı düğümün **config.toml** dosyasını güncelleyin:

```
# düğümü görünmez yap
NoDiscovery = true
# yalnızca sentry'ye bağlan
StaticNodes = ["enode://f2da64f49c30a0038bba3391f40805d531510c473ec2bcc7c201631ba003c6f16fa09e03308e48f87d21c0fed1e4e0bc53428047f6dcf34da344d3f5bb69373b@[10.1.1.1]:30306"]
```

Bu başarılıysa true dönecektir, ancak bu düğümün başarılı bir şekilde eklendiği anlamına gelmez.

Onaylamak için **admin.peers** komutunu çalıştırın ve eklediğiniz düğümün detaylarını görmelisiniz.

Bu şekilde doğrulayıcı düğümünüz yalnızca sağladığınız sentry düğümleriyle eşleşmeye çalışacaktır.

3. Bağlantıyı doğrulayın

Bağlantıyı doğrulamak için **admin.peers** komutunu çalıştırın ve eklediğiniz düğümün detaylarını görmelisiniz.

### Güvenlik Duvarı Yapılandırması

**geth** farklı amaçlar için birkaç TCP bağlantı noktası kullanır.

**geth**, varsayılan olarak her ikisi de 30303 üzerinde bulunan dinleyici (TCP) bağlantı noktası ve keşif (UDP) bağlantı noktası kullanır.

JSON-RPC çalıştırmanız gerektiğinde, ayrıca TCP bağlantı noktası 8545'e ihtiyacınız olacaktır. **JSON-RPC bağlantı noktasının dış dünyaya açılmaması gerektiğini** unutmayın, çünkü buradan yönetim işlemleri yapılabilir.