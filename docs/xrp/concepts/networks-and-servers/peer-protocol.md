---
title: Peer Protokolü
seoTitle: XRP Ledger | Peer Protokolü
sidebar_position: 4
description: Peer protokolü, rippled sunucularının birbirleriyle iletişim kurduğu dili belirler ve XRP Ledger üzerindeki iletişimi yönetir. Bu içerikte, peer protokolünün işleyişi ve yapılandırmaları hakkında ayrıntılar bulabilirsiniz.
tags: 
  - peer
  - protokol
  - XRP Ledger
  - iletişim
  - sunucu
keywords: 
  - peer
  - protokol
  - XRP Ledger
  - iletişim
  - sunucu
---

## Peer Protokolü

XRP Ledger üzerindeki sunucular, birbirleriyle XRP Ledger peer protokolünü kullanarak iletişim kurarlar. 

Peer protokolü, XRP Ledger üzerindeki sunucular arasındaki ana iletişim yoludur. XRP Ledger'ın davranışı, ilerlemesi ve bağlantı durumu ile ilgili tüm bilgiler peer protokolü aracılığıyla geçer. Peer-to-peer iletişim örnekleri şunları içerir:

- Peer-to-peer ağındaki diğer sunuculara bağlantı talep etme ya da bağlantı noktalarının mevcut olduğunu ilan etme.
- Ağa aday işlemleri paylaşma.
- Tarihsel defterlerden defter verilerini talep etme ya da bu verileri sağlama.
- Konsensüs için bir dizi işlem önermesi ya da bir konsensüs işlem setinin uygulanmasının hesaplanan sonucunu paylaşma.

Peer-to-peer bağlantısını kurmak için, bir sunucu HTTPS kullanarak başka bir sunucuya bağlanır ve `XRPL/2.0` protokolüne (eski adıyla `RTXP/1.2`) geçiş yapmak için bir [HTTP yükseltmesi](https://tools.ietf.org/html/rfc7230#section-6.7) talep eder. (Daha fazla bilgi için, [`rippled` deposundaki](https://github.com/ripple/rippled) [Overlay Ağı](https://github.com/XRPLF/rippled/blob/96bbabbd2ece106779bb544aa0e4ce174e99fdf6/src/ripple/overlay/README.md#handshake) makalesine bakın.)

## Peer Keşfi

XRP Ledger, XRP Ledger ağı içerisinde diğer sunucuları bulmak için "gossip" protokolünü kullanır. Bir sunucu her başlatıldığında, daha önce bağlandığı diğer tüm peer'lere yeniden bağlanır. Yedek olarak, [hardcoded public hubs](https://github.com/XRPLF/rippled/blob/fa57859477441b60914e6239382c6fba286a0c26/src/ripple/overlay/impl/OverlayImpl.cpp#L518-L525) kullanır. Bir sunucu başarılı bir şekilde bir peer ile bağlandığında, o peer'den diğer XRP Ledger sunucularının (genellikle IP adresi ve port) iletişim bilgilerini talep eder. Sunucu, o sunuculara bağlanabilir ve daha fazla XRP Ledger sunucusu ile bağlantı kurmak için onlardan iletişim bilgilerini isteyebilir. Bu süreç aracılığıyla, sunucu, herhangi bir tek peer ile bağlantısını kaybetse bile, ağı güvenilir bir şekilde bulundurmaya yetecek kadar peer bağlantısı kurar.

Genellikle, bir sunucunun, diğer peer'lere bağlanmak için yalnızca bir kez, kısa bir süreliğine bir kamu hub'a bağlanması gerekir. Bunu yaptıktan sonra, sunucu bu hub'la bağlı kalabilir ya da kalmayabilir; bu, ağ bağlantısının ne kadar kararlı olduğuna, hub'ın ne kadar meşgul olduğuna ve sunucunun bulduğu diğer yüksek kaliteli peer sayısına bağlıdır. Sunucu, ağ kesintisi veya yeniden başlatma sonrasında daha sonra bu diğer peer'lere doğrudan yeniden bağlanabilmesi için bu diğer peer'lerin adreslerini kaydeder.

> [peers metodu][] sunucunuzun şu anda bağlı olduğu peer'lerin bir listesini gösterir.

:::info
Bazı yüksek değerli sunucular (örneğin, önemli `validator'lar`) için, sunucunuzun peer keşif işlemi aracılığıyla güvenilmeyen peer'lere bağlanmasını istemeyebilirsiniz. Bu durumda, sunucunuzu yalnızca `özel peer'lerle` kullanacak şekilde yapılandırabilirsiniz.
:::

## Peer Protokolü Bağlantı Noktası

XRP Ledger'da yer almak için, `rippled` sunucuları peer protokolünü kullanarak rastgele peer'lere bağlanır. (Tüm peer'ler, mevcut sunucu ile `kümelenmediği` sürece güvenilmeyen olarak kabul edilir.)

İdeal olarak, sunucu peer portu üzerinde hem bağlantı gönderebilir hem de alabilir. Peer protokolü için kullanılan bağlantı noktasını `güvenlik duvarınız üzerinden yeniden yönlendirmelisiniz` `rippled` sunucusuna.

IANA, XRP Ledger peer protokolü için port **2459** ayırmıştır, ama eski sistemlerle uyumluluk için, [varsayılan `rippled` yapılandırma dosyası](https://github.com/XRPLF/rippled/blob/master/cfg/rippled-example.cfg), tüm ağ arabirimlerinde **port 51235** üzerinde gelen peer protokolü bağlantılarını dinler. Bir sunucu çalıştırıyorsanız, sunucunuzun dinlediği port(ları) `rippled.cfg` dosyasıyla yapılandırabilirsiniz.

**Örnek:**

```
[port_peer]
port = 2459
ip = 0.0.0.0
protocol = peer
```

Peer protokolü portu ayrıca `özel peer port yöntemlerini` de sağlar.

## Düğüm Anahtarı Çifti

Bir sunucu ilk başlatıldığında, peer protokolü iletişimlerinde kendisini tanımlamak için bir _düğümler anahtarı çifti_ oluşturur. Sunucu, tüm peer protokolü iletişimlerini imzalamak için bu anahtarını kullanır. Bu, başka bir sunucudan gelen mesajların güvenilir bir şekilde kimliğini tanımlamak ve bütünlüğünü doğrulamak mümkün hale getirir; bu, eğer bu sunucunun mesajları güvenilmeyen peer'ler aracılığıyla iletiliyorsa bile.

Düğüm anahtarı çifti veritabanında kaydedilir ve sunucu yeniden başlatıldığında yeniden kullanılır. Sunucunun veritabanlarını silerseniz, yeni bir düğüm anahtarı çifti oluşturur ve böylece farklı bir kimlikle çevrimiçi olur. Aynı anahtar çiftini tekrar kullanmak isterseniz, sunucuyu `[node_seed]` dizesi ile yapılandırabilirsiniz. `[node_seed]` dizesinde kullanılacak uygun bir değeri oluşturmak için, [validation_create metodunu][] kullanın.

:::note
Düğüm anahtarı çifti, `kümelenme` veya `peer bağlantı noktalarını ayırma` amaçları için diğer sunucuları tanımlar. Eğer bir sunucular kümeniz varsa, kümelerdeki her sunucuyu benzersiz bir `[node_seed]` ayarı ile yapılandırmalısınız. Bir küme oluşturma hakkında daha fazla bilgi için, `Küme `rippled` Sunucuları` sayfasına bakın.
:::

## Sabit Peer'ler ve Peer Rezervasyonları

Normalde, `rippled` sunucusu sağlıklı bir peer sayısını korumaya çalışır ve maksimum sayıya kadar güvenilmeyen peer'lere otomatik olarak bağlanır. `rippled` sunucusunu, çeşitli yollarla belirli peer sunucularına bağlı bırakacak şekilde yapılandırabilirsiniz:

- **Sabit Peer'ler** kullanarak, belirli diğer peer'lere her zaman bağlı kalın. Bu, yalnızca peer'lerin sabit IP adresleri varsa işe yarar. Sabit peer'leri yapılandırmak için `[ips_fixed]` ayar dizesini kullanın. Bu, `kümelenme` veya `özel peer'ler` için gerekli bir parçadır. Sabit peer'ler, yapılandırma dosyasında tanımlanır, bu nedenle değişiklikler yalnızca sunucu yeniden başlatıldığında uygulanır. Sabit peer'ler, bu sunucuların aynı kişi veya kuruluş tarafından çalıştırılması durumunda sunucuları bağlı tutmak için en yararlıdır.
- **Peer Rezervasyonları** kullanarak belirli peer'lere öncelik verin. Eğer sunucunuzda belirli bir peer için bir peer rezervasyonu varsa, sunucunuz her zaman o peer'den gelen bağlantı taleplerini kabul eder; bu durum, sunucunun mevcut bağlı peer sayısının üzerine çıkmasına neden olabilir. (Bu, sunucunuzun _maksimum_ peer sayısının üzerine çıkmasına neden olabilir.) Bir rezervli peer'i, `düğüm anahtarı çifti` ile tanımlarsınız, bu nedenle bunu değişken IP adreslerine sahip peer'ler için bile yapabilirsiniz. Peer rezervasyonları, yönetici komutları aracılığıyla yapılandırılır ve sunucu veritabanlarında kaydedilir, bu nedenle sunucu çevrimiçi iken ayarlanabilir ve yeniden başlatmalarda kaydedilir. Peer rezervasyonları, farklı kişiler veya kuruluşlar tarafından işletilen sunucuları bağlamak için en yararlıdır.

Aşağıdaki durumlarda, `rippled` sunucusu güvenilmeyen peer'lere bağlanmaz:

- Sunucu `özel bir peer` olarak yapılandırılmışsa, yalnızca sabit peer'lerine bağlanır.
- Sunucu `bağımsız modda` çalışıyorsa, _hiçbir_ peer'e bağlanmaz.

## Özel Peer'ler

Bir `rippled` sunucusunu, IP adresini genel kamuya gizli tutmak için "özel" bir sunucu olarak yapılandırabilirsiniz. Bu, güvenilir validator'lar gibi önemli `rippled` sunucularının hizmet reddi saldırılarına ve müdahale girişimlerine karşı bir önlem olarak faydalı olabilir. Peer-to-peer ağına katılmak için özel bir sunucunun, mesajlarını ağın geri kalanına ileten en az bir özel olmayan sunucuya bağlanması gerekir.

:::warning
Özel bir sunucuyu `sabit peer'ler` olmadan yapılandırırsanız, sunucu ağa bağlanamaz, dolayısıyla ağ durumunu bilemez, işlem yayamaz veya konsensüs sürecine katılamaz.
:::

Bir sunucuyu özel bir sunucu olarak yapılandırmanın birkaç etkisi vardır:

- Sunucu, başka sunucularla bağlantı kurmak için açık bağlantılar yapmaz; yalnızca bu sunuculara bağlı olacak şekilde açıkça yapılandırılmışsa diğer sunucularla bağlantı kuracaktır.
- Sunucu, başka sunuculardan gelen bağlantıları kabul etmez; yalnızca bu sunucularla bağlantı kabul etmek üzere açıkça yapılandırılmışsa kabul eder.
- Sunucu, rakip peer'lerinden kendisinin IP adresini güvenilmeyen iletişimlerde (örneğin, `peer crawler API yanıtı` gibi) açıklamamaları için doğrudan peer'lerine talepte bulunur. Bu, [peers yönetici metodu][peers method] gibi güvenilir iletişimleri etkilemez.

    Validator'lar, özel sunucu ayarlarına bakılmaksızın her zaman peer'lerinden validator'ların IP adreslerini gizlemelerini ister. Bu, validator'ların hizmet reddi saldırılarıyla aşırı yüklenmelerini önlemeye yardımcı olur.

    :::warning
    Bir sunucunun kaynak kodunu, bu isteği görmezden gelecek şekilde değiştirmek mümkündür ve bu nedenle, doğrudan peer'lerinin IP adreslerini paylaşmak mümkündür. Özel sunucunuzu, bu şekilde değiştirilmediğinden emin olduğunuz sunuculara yalnızca bağlanacak şekilde yapılandırmalısınız.
    :::

### Peer Konfigürasyonlarının Artıları ve Eksileri

XRP Ledger'a katılmak için, bir `rippled` sunucusunun açık peer-to-peer ağına bağlı olması gerekir. Kabaca, bir `rippled` sunucusunun ağa bağlanma şekli için üç yapılandırma kategorisi vardır:

- **Keşfedilen peer'ler** kullanarak. Sunucu bulduğu herhangi bir güvenilmeyen sunucuya bağlanır ve bu sunucular uygun davranmadığı sürece bağlı kalır. (Örneğin, fazla veri talep etmezler, ağ bağlantıları stabil olduğunda ve aynı `ağı` takip ettikleri görünüyorsa.) Bu varsayılan ayardır.
- Aynı kişi veya kuruluş tarafından işletilen **proxy'ler olarak özel bir sunucu**. Proxy'ler, özel sunucuyla sabit bir peering bağlantısı sürdüren keşfedilen peer'lere bağlı olan standart `rippled` sunuculardır.
- **Kamusal hub'lar kullanarak özel bir sunucu**. Bu, proxy'ler kullanmaya benzer, ancak belirli üçüncü taraflara dayanır.

Her yapılandırmanın artıları ve eksileri şunlardır:

| Yapılandırma                        | Artılar                                                                                                                                                                       | Eksiler                                                                                                                                                    |
|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Keşfedilen Peer'ler                | En basit yapılandırma, düşük bakım yükü ile.  Birçok doğrudan peer bağlantısı oluşturma fırsatı sunar. Daha fazla doğrudan peer'e sahip olmak, çeşitli faydalar sağlar. Sunucunuz, hem senkronizasyon sırasında hem de tarih geri yükleme sırasında `tarih çekmek` için birden çok peer'den veri alabilir. Tüm peer'ler tam tarihi korumadığından, daha fazla peer'in erişimine sahip olmak, ayrıca daha geniş bir tarihsel veriye erişim sağlayabilir.  Ağdan kopma olasılığını azaltır; çünkü sunucunuz, bağlı olmayan peer'leri yeni olanlarla değiştirebilir. | Sunucu peering'lerini seçmenize izin vermez, yani peer'lerinizin kötücül davranış sergileyip sergilemeyeceğini bilmezsiniz. `rippled` sunucuları, kötücül peer'lere karşı korunmak üzere tasarlanmış olsalar da, her zaman, kötü niyetli peer'lerin sunucunuza etki edebilmek için yazılım hatalarını istismar etme riski vardır.  Sunucunuzun peer'leri sık sık kopabilir veya değişebilir. |
| Proxy Olarak Özel Sunucu           | Etkin bir şekilde uygulandığında en güvenli ve güvenilir yapılandırma.  O kadar güvenilir ve o kadar yedekli olabilir.  Özel sunucunun performansını `kümelenme` ile optimize edebilirsiniz.  Özel sunucunuz, çoğu doğrudan peer bağlantısı oluşturma fırsatı sunar. Özel sunucunuz, `tarih çekmek` için birden çok peer'den veri alabilir. Peer'leri siz çalıştırdığınız için, her bir peer'in ne kadar defter tarihi saklayacağını kontrol edersiniz. | Birden fazla sunucu çalıştırmaktan kaynaklanan daha yüksek bakım yükü ve maliyet.  Peer bağlantı kesintisi olasılığını tamamen ortadan kaldırmaz. Ne kadar çok proxy çalıştırırsanız çalıştırın, hepsi aynı sunucu rafında bulunuyorsa, bir ağ veya güç kesintisi hepsini etkileyebilir. |
| Kamusal Hub'lar Kullanarak Özel Sunucu | Düşük bakım yükü ile az bir yapılandırma.  Ağa güvenli bağlantılara erişim sağlar.  Proxy kullanmaya kıyasla, özel sunucunuzun ağa bağlanmadan zaman kaybetmesini sağlama olasılığını azaltabilir. | Güvenilir kalmak için yüksek itibar sahibi üçüncü taraflara bağımlı.  Kullandığınız kamusal hub'lar çok meşgulse, sunucunuzun ağa bağlı kalmasını sağlayamaz. Kamusal hub'ların doğası gereği en popüler olanlar, her zaman açık durumdaki bağlantıları koruyamamaktadırlar.  Bu sorunun önüne geçmek için, daha fazla kamu hub'ı kullanın; ne kadar çok olursa o kadar iyi. Ayrıca, yoğun olma ihtimali daha düşük olan varsayılan olmayan hub'ları kullanmak da yardımcı olabilir. |

### Özel Bir Sunucuyu Yapılandırma

Sunucunuzu özel bir sunucu olarak yapılandırmak için, yapılandırma dosyasında `[peer_private]` ayarını `1` olarak ayarlayın. Ayrıntılı talimatlar için `Özel Bir Sunucu Yapılandırma` sayfasına bakın.

## Ayrıca Bakınız

- **Kavramlar:**
    - `Konsensüs`
    - `Paralel Ağlar`
- **Eğitimler:**
    - `Küme rippled Sunucuları`
    - `Özel Bir Sunucu Yapılandırma`
    - `Peer Crawler'ı Yapılandır`
    - `Peering için Portları Yeniden Yönlendirme`
    - `Belirli Bir Peer'e Manuel Olarak Bağlan`
    - `Maksimum Peer Sayısını Ayarlama`
    - `Peer Rezervasyonu Kullanma`
- **Referanslar:**
    - [peers metodu][]
    - [peer_reservations_add metodu][]
    - [peer_reservations_del metodu][]
    - [peer_reservations_list metodu][]
    - [connect metodu][]
    - [fetch_info metodu][]
    - `Peer Crawler`

