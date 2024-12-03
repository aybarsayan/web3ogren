---
title: Validator Olarak rippledi Çalıştırın
seoTitle: Validator Çalıştırma için Kılavuz - rippled
sidebar_position: 1
description: Bu kılavuz, validator olarak rippledi çalıştırma sürecini anlatarak ağda güvenilir bir konum elde etmenize yardımcı olacaktır.
tags: 
  - validator
  - rippled
  - XRP Ledger
  - konsensüs
  - güvenilir
  - ağ bağlantısı
keywords: 
  - validator
  - rippled
  - XRP Ledger
  - konsensüs
  - güvenilir
  - ağ bağlantısı
---

# Validator Olarak rippled'i Çalıştırın

Bir `rippled` sunucusu `validator modunda` çalıştığında standart bir sunucunun yaptığı her şeyi yapar:

- `eşler ağı` ile bağlantı kurar
- Kriptografik olarak imzalanmış `işlemleri` iletir
- Tam paylaşılan küresel `defter` için yerel bir kopya tutar

Bir validatorü farklı kılan şey, aynı zamanda XRP Ledger ağı tarafından `konsensüs süreci` sırasında değerlendirilmek üzere aday işlemler seti olan validasyon mesajları da göndermesidir.

Validasyon mesajları göndermek, validatorünüze konsensüs sürecinde söz hakkı vermez; bu nedenle sistem bir [Sybil saldırısına](https://en.wikipedia.org/wiki/Sybil_attack) maruz kalmaz. Diğer sunucular, validatorünüzü Yönetici Düğüm Listelerine (UNL) eklemedikçe validasyon mesajlarınızı yok sayar. Eğer validatorünüz UNL'de yer alıyorsa, bu _güvenilir_ bir validator'dur ve önerileri, ona güvenen sunucular tarafından konsensüs sürecinde dikkate alınır.

Validatorünüz _güvenilir_ bir validator değilse bile, ağın genel sağlığı açısından hala önemli bir rol oynar. Bu validatorler, güvenilir validatorlerin ölçüleceği standartları belirlemesine yardımcı olur. Örneğin, eğer bir güvenilir validator, UNL'lerde yer almayan birçok validator ile anlaşmazlık yaşıyorsa, bu bir sorunu gösterebilir.

:::danger
Validatorler halka açık olmamalıdır. Validator sunucunuza veya başka herhangi bir halka açık erişime WebSocket erişimi vermeyin.
:::

---

## 1. İyi bir validatörün özelliklerini anlayın

Validatorünüzün aşağıdaki özellikleri taşımasını sağlamaya çalışın. İyi bir validator olmak, `rippled` sunucu operatörlerine ve validator listesi yayıncılarına (örneğin, https://vl.ripple.com ve https://vl.xrplf.org) validatorünüzü UNL'lerine eklemeden önce güvenmelerine yardımcı olur.

- **Her zaman ulaşılabilir**

    İyi bir validator, her önerilen defter için validasyon oylarını sürekli olarak gönderen bir yapıdadır. %100 çalışma süresi hedefleyin.

- **Anlaşmalı**

    İyi bir validatörün oyları, konsensüs sürecinin sonucuyla mümkün olduğunca eşleşir. Aksi davranmak, validatorünüzün yazılımının eski, hatalı veya kasıtlı olarak yanlı olduğunu gösterebilir. Her zaman [en son `rippled` sürümünü](https://github.com/XRPLF/rippled/tree/release) değiştirmeden çalıştırın. [`rippled` sürümlerini](https://github.com/XRPLF/rippled/releases) takip edin ve yeni sürümlerle ilgili bildirim almak için [Google Grubu](https://groups.google.com/g/ripple-server) grubuna abone olun.

- **Hızlı oylar verme**

    İyi bir validatörün oyları, konsensüs turu sona ermeden hızlı bir şekilde gelir. Oylarınızı zamanında tutmak için, validatorünüzün önerilen `sistem gereksinimlerini` karşıladığından emin olun; bunlar hızlı bir internet bağlantısını içerir.

    Yeni işlemler göndermek ve veri sorgulamak için bir validatör kullanmak mümkündür, ancak API sorguları yüksek yüklerde validatörü konsensüs sağlamakta daha az güvenilir hale getirebilir. API ihtiyaçlarınız yeterince hafifse, o zaman her iki amaç için bir sunucu kullanabilirsiniz. İdeal olarak, bir validatör konsensüste yer almak için adanmış olmalıdır.

- **Tanımlı**

    İyi bir validatörün açıkça tanımlanmış bir sahibi vardır. `Alan adı doğrulaması` sağlamak iyi bir başlangıçtır. İdeal olarak, XRP Ledger ağı UNL'leri, farklı sahipler tarafından yürütülen validatorleri, farklı yasal yargı alanlarında ve coğrafi alanlarda içerir. Bu, herhangi bir yerel olayın güvenilir validatorlerin tarafsız işleyişine müdahale etme olasılığını azaltır.

Operatörlerin, [bu örnek dosyada](https://github.com/XRPLF/rippled/blob/develop/cfg/validators-example.txt) yer alan liste sağlayıcılarını kullanmaları şiddetle önerilmektedir.

---

## 2. `rippled` sunucusu kurun

Daha fazla bilgi için, `Install `rippled` sayfasına bakın.

---

## 3. `rippled` sunucunuzda validasyonu etkinleştirin

`rippled` sunucunuzda validasyonu etkinleştirmek, sunucunuzun `rippled.cfg` dosyasında bir validatör anahtarı sağlamanıza anlamına gelir. `validator-keys` aracını (`rippled` paketlerinde dahil) kullanarak validatör anahtarlarınızı ve jetonlarınızı güvenli bir şekilde oluşturabilir ve yönetebilirsiniz.

Validatorünüzde **değil** olmak üzere güvenli bir konumda:

1. `validator-keys` aracını kullanarak bir validatör anahtar çifti oluşturun; bu araç `rippled` paketinde yer alır:

    ```bash
    $ cd /opt/ripple/bin/
    ```
    
    Sonra çalıştırın:

    ```bash
    $ ./validator-keys create_keys
    ```

    Ubuntu'da örnek çıktı:

    ```bash
    Validator anahtarları /home/my-user/.ripple/validator-keys.json dosyasına kaydedildi.
    
    Bu dosya güvenli bir şekilde saklanmalı ve paylaşılmamalıdır.
    ```

    macOS'ta örnek çıktı:

    ```bash
    Validator anahtarları /Users/my-user/.ripple/validator-keys.json dosyasına kaydedildi.
    
    Bu dosya güvenli bir şekilde saklanmalı ve paylaşılmamalıdır.
    ```

    :::danger
    Oluşturulan `validator-keys.json` anahtar dosyasını güvenli, çevrimdışı ve kurtarılabilir bir konumda, örneğin şifrelenmiş bir USB bellek sürücüsünde saklayın. Anahtarları kullanmayı planladığınız validator'de saklamayın. Eğer `secret_key`'iniz ele geçirilirse, hemen [anahtarı iptal edin](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md#key-revocation). Yeni bir jeton oluşturduktan sonra yedekleme güncellerken `validator-keys.json` dosyasının içeriğini değiştirmeyin. Eğer aynı yedeklemeden birden fazla jeton oluşturursanız ve güncellemezseniz, ağ daha sonrakileri görmez çünkü aynı `token_sequence` numarasını kullanmaktadır.
    :::

    `validator-keys` aracı ve ürettiği anahtar çiftleri hakkında daha fazla bilgi için, [Validator Keys Tool Guide](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md) sayfasını inceleyin.

2. `create_token` komutunu kullanarak bir validatör jetonu oluşturun. [Dikkat edin `/opt/ripple/bin/` dizimindesiniz]

    ```bash
    $ ./validator-keys create_token --keyfile /PATH/TO/YOUR/validator-keys.json
    ```

    Örnek çıktı:

    ```bash
    rippled.cfg dosyasını bu değerlerle güncelleyin:

    # validatör genel anahtarı: nHUtNnLVx7odrz5dnfb2xpIgbEeJPbzJWfdicSkGyVw1eE5GpjQr

    [validator_token]
    eyJ2YWxpZGF0aW9uX3NlY3J|dF9rZXkiOiI5ZWQ0NWY4NjYyNDFjYzE4YTI3NDdiNTQzODdjMDYyNTkwNzk3MmY0ZTcxOTAyMzFmYWE5Mzc0NTdmYT|kYWY2IiwibWFuaWZlc3QiOiJKQUFBQUFGeEllMUZ0d21pbXZHdEgyaUNjTUpxQzlnVkZLaWxHZncxL3ZDeEhYWExwbGMyR25NaEFrRTFhZ3FYeEJ3RHdEYklENk9NU1l1TTBGREFscEFnTms4U0tGbjdNTzJmZGtjd1JRSWhBT25ndTlzQUtxWFlvdUorbDJWMFcrc0FPa1ZCK1pSUzZQU2hsSkFmVXNYZkFpQnNWSkdlc2FhZE9KYy9hQVpva1MxdnltR21WcmxIUEtXWDNZeXd1NmluOEhBU1FLUHVnQkQ2N2tNYVJGR3ZtcEFUSGxHS0pkdkRGbFdQWXk1QXFEZWRGdjVUSmEydzBpMjFlcTNNWXl3TFZKWm5GT3I3QzBrdzJBaVR6U0NqSXpkaXRROD0ifQ==
    ```

Validatorünüzde:

1. `[validator_token]` ve değerini validatorünüzün `rippled.cfg` dosyasına ekleyin.

    Eğer daha önce `validator-keys` aracı olmadan validatorünüzü yapılandırdıysanız, `rippled.cfg` dosyanızdan `[validation_seed]` ve değerini silin. Bu, validatorünüzün genel anahtarını değiştirir.

2. `rippled` hizmetine yeniden başlatın.

    ```bash
    $ sudo systemctl restart rippled.service
    ```

3. Validatorünüzün gerçekten çalıştığını doğrulamak için `server_info` komutunu kullanın.

    ```bash
    $ rippled server_info
    ```

    - Yanıttaki `pubkey_validator` değeri, validatorünüzle kullanmak için ürettiğiniz `validator-keys.json` dosyasındaki `public_key` ile eşleşmelidir.
    - `server_state` değeri _**önerme**_ olmalıdır.

**Güvenlik İpucu:** `rippled.cfg` dosyanızın izinlerini daha kısıtlayıcı hale getirin. Linux'ta  `0600` olması önerilmektedir. Bunu `chmod 0600 rippled.cfg` komutuyla yapabilirsiniz.

---

## 4. Ağa Bağlanın

Bu bölüm, validatorünüzü XRP Ledger ağına bağlamak için kullanabileceğiniz üç farklı konfigürasyonu tanıtmaktadır. Kullanım durumunuza en uygun konfigürasyonu kullanın.

- `Keşfedilmiş eşler`: Peer-to-peer ağındaki herhangi bir sunucuya bağlanın.
- `Proxyler`: Validatorünüz ile peer-to-peer ağının geri kalanındaki standart `rippled` sunucuları arasında proxy olarak çalıştırın.
- `Halka açık merkezler`: Yalnızca yüksek itibara sahip belirli halka açık sunucularla bağlanın.

Bu yaklaşımların karşılaştırması için `Bağlantı Yapılandırmalarının Avantajları ve Dezavantajları` sayfasına bakın.

### Keşfedilmiş eşler kullanarak bağlanma

Bu yapılandırma, validatorünüzü XRP Ledger ağına `keşfedilmiş eşler` aracılığıyla bağlar. Bu, `rippled` sunucularının varsayılan davranışıdır.

_**Validatorünüzü XRP Ledger ağına keşfedilmiş eşler kullanarak bağlamak için,**_ validatorünüzün `rippled.cfg` dosyasında `[peer_private]` bölümünü atlayın veya `0` olarak ayarlayın. [Örnek `rippled.cfg` dosyası](https://github.com/XRPLF/rippled/blob/develop/cfg/rippled-example.cfg) bu yapılandırma ile birlikte sunulmuştur.

### Proxyler kullanarak bağlanma

Bu yapılandırma, validatorünüzü kendinizin çalıştırdığı standart `rippled` sunucuları aracılığıyla ağa bağlar. Bu proxy sunucular, validatorünüz ile gelen ve giden ağ trafiği arasında yer alır.

_**Validatorünüzü XRP Ledger ağına proxyler kullanarak bağlamak için:**_

1. Standart `rippled` sunucuları kurun. Daha fazla bilgi için `Install rippled` sayfasına bakın.

2. Validatorünüzü ve standart `rippled` sunucularınızı bir `küme` içinde çalışacak şekilde yapılandırın.

3. Validatorünüzün `rippled.cfg` dosyasında, `[peer_private]` değerini `1` olarak ayarlayın. Bu, validatorünüzün IP adresinin iletilmesini engeller. Daha fazla bilgi için, `Özel Eşler` sayfasına göz atın. Bu ayrıca validatorünüzün, validatorınızı çalıştırmak üzere tanımladığınız `[ips_fixed]` bölümünde tanımlı olmayan sunuculara bağlanmasını engeller.

    :::danger
    Validatorünüzün IP adresini başka şekillerde yayınlamaktan kaçının.
    :::

4. Validatorünüzün host makinesinin güvenlik duvarını, sadece aşağıdaki trafiğe izin verecek şekilde yapılandırın:

    - Gelen trafik: Sadece yapılandırdığınız kümedeki standart `rippled` sunucularının IP adreslerinden.
    - Giden trafik: Sadece yapılandırdığınız kümedeki standart `rippled` sunucularının IP adreslerine ve UNL liste sağlayıcılarınıza port 443 üzerinden.

5. `rippled` hizmetine yeniden başlatın.

    ```bash
    $ sudo systemctl restart rippled.service
    ```

6. Standart `rippled` sunucularınızdan birinde `Peer Crawler` uç noktasını kullanın. Yanıtınızda validatorünüz yer almamalıdır. Bu, validatorünüzün `[peer_private]` konfigürasyonunun çalıştığını doğrular. Validatorünüzde `[peer_private]` özelliğinin etkinleştirilmesinin bir etkisi, validatorünüzün eşlerinin, onu Peer Crawler sonuçlarında dahil etmemesidir.
    
    ```bash
    $ curl --insecure https://STOCK_SERVER_IP_ADDRESS_HERE:51235/crawl | python3 -m json.tool
    ```

### Halka açık merkezler kullanarak bağlanma

Bu yapılandırma, validatorünüzü ağı üç `halka açık merkez` kullanarak bağlar. Bu yapılandırma, `kendi kendinize çalıştırdığınız proxyler üzerinden bağlanma` ile benzerlik gösterir, ancak bunun yerine halka açık merkezler üzerinden bağlanırsınız.

_**Validatorünüzü ağı halka açık merkezler kullanarak bağlamak için:**_

1. Validatorünüzün `rippled.cfg` dosyasında, aşağıdaki `[ips_fixed]` bölümünü ekleyin. `r.ripple.com 51235` ve `sahyadri.isrdc.in 51235` iki değerin varsayılan halka açık merkezlerdir. Bu bölüm, `rippled`'e her zaman bu halka açık merkezlerle eş bağlantılarını korumasını söyler.

    ```ini
    [ips_fixed]
    r.ripple.com 51235
    sahyadri.isrdc.in 51235
    ```

    admonition tip="warning" name="Dikkat
    Bu yapılandırma, validatorünüzü ağı varsayılan halka açık merkezler aracılığıyla bağlar. Bu halka açık merkezler _varsayılan_ olduklarından, bazen validatorünüze ağa bağlantı sağlamak için fazla meşgul olabilirler. Bu durumu önlemek için daha fazla halka açık merkeze bağlanın, daha da iyisi, varsayılan olmayan halka açık merkezlere bağlanın.
    :::

    Burada başka `rippled` sunucularının IP adreslerini de ekleyebilirsiniz, ancak _**sadece**_ aşağıdakileri yapacaklarına güveniyorsanız:

      - Mesajları sansürlemeden iletmek.
      - Sürekli çevrimdışı kalmamak.
      - DDoS saldırısı yapmamak.
      - Sunucunuzu çökertmeye çalışmamak.
      - IP adresinizi yabancılara yaymamak.

2. Ayrıca validatorünüzün `rippled.cfg` dosyasında, aşağıdaki `[peer_private]` bölümünü ekleyin ve değerini `1` olarak ayarlayın. Bu, validatorünüzün eşlendirilmiş IP adresinin yayımlanmasını engeller. Bu ayar, validatorünüzün yalnızca `[ips_fixed]` bölümünde yapılandırılan eşlere bağlanmasını da talimatlandırır. Bu, validatorünüzün yalnızca bilinen ve güvendiğiniz `rippled` sunucularıyla IP paylaşmasını sağlar.

    ```ini
    [peer_private]
    1
    ```

    :::danger
    Validatorünüzün IP adresini başka şekillerde yayınlamaktan kaçının.
    :::

    `[peer_private]` etkinleştirildiğinde, `rippled`, `[ips]` bölümünde önerilen herhangi bir bağlantıyı görmezden gelir. Eğer `[ips]` bölümünüzde şu anda bulunan bir IP adresine bağlanmanız gerekiyorsa, bunu `[ips_fixed]` bölümüne ekleyin, ancak _**sadece**_ bunun, adım 1'de belirtildiği gibi sorumlulukla davranacaklarından emin olmak kaydıyla.

3. `rippled` hizmetine yeniden başlatın.

    ```bash
    $ sudo systemctl restart rippled.service
    ```

---

## 5. Ağ bağlantınızı doğrulayın

Validatorünüzün XRP Ledger ağıyla sağlıklı bir bağlantıya sahip olduğunu doğrulamak için kullanabileceğiniz bazı yöntemler:

- `peers` komutunu kullanarak validatorünüze şu anda bağlı olan tüm `rippled` sunucularının listesini döndürebilirsiniz. Eğer `peers` dizisi `null` ise, ağa sağlıklı bir bağlantınız yok demektir. Bu belgede yer alan talimatları takip ederek validatorünüzü yapılandırdıysanız, `peers` dizisi, `[ips_fixed]` bölümünde tanımladığınız eş sayısı kadar nesne içermelidir.

    Eğer `[ips_fixed]` bölümünüzde bir halka açık merkez listelediyseniz ve bu meşgulse, validator您的 bağlantısını reddedebilir. Bu durumda `[ips_fixed]` bölümünüzde yapılandırdığınızdan daha az bağlantı elde edebilirsiniz. Validatorünüz, bağlantı reddedildiğinde tekrar denemektedir.

    Eğer ağla güvenilir ve sağlam bir bağlantıyı sürdüremezseniz ve halka açık merkezler veya proxyler kullanarak bağlantılar kurmadıysanız, `4. Ağa Bağlanın` başlığına bakın. Bu bölümdeki yöntemlerden birinin kullanılması, validatorünüzün sağlıklı bir şekilde ağa bağlı kalmasına yardımcı olabilir.

- `server_info` komutunu kullanarak validatorünüz hakkında bazı temel bilgileri döndürebilirsiniz. `server_state` değeri `proposing` olarak ayarlanmış olmalıdır. Ayrıca birkaç dakika boyunca `full` veya `validating` olarak da ayarlanabilir, ancak daha sonra `proposing` durumuna geçmelidir.

    `server_state` değeri, çoğunlukla `proposing` olarak ayarlanmış durumda kalmıyorsa, bu, validatorünüzün XRP Ledger ağına tam olarak katılamayabileceğinin bir işareti olabilir. Validatorünüzdeki sorunları teşhis etmek için `server_info` uç noktasını kullanma ve sunucu durumları hakkında daha fazla bilgi için, `rippled` Sunucu Durumları` ve `server_info` al` konularına bakın.

- `validators` komutunu kullanarak validator tarafından kullanılan mevcut yayımlanmış ve güvenilir validatörlerin listesini döndürebilirsiniz. `validator_list_expires` değerinin ya `asla` ya da geçerli olmadığı veya geçerlilik süresinin dolmak üzere olmayıp olmadığını kontrol edin.

---

## 6. Alan adı doğrulaması sağlayın

Validator listesi yayıncılarının ve XRP Ledger ağına katılan diğer katılımcıların validatorünüzü kimin yönettiğini anlamalarına yardımcı olmak için, validatorünüz için alan adı doğrulaması sağlayın. Yüksek düzeyde, alan adı doğrulaması iki yönlü bir bağlantıdır:

- Alan adınızı kullanarak bir validatör anahtarının mülkiyetini talep edin.
- Validatör anahtarınızı kullanarak bir alan adının mülkiyetini talep edin.

Bu bağlantıyı oluşturmak, hem validator anahtarına hem de alan adına sahip olduğunuzu kanıtlayan güçlü bir delil oluşturur. Bu kanıtı sağlamak, `iyi bir validatör` olmanın bir yönüdür.

Alan adı doğrulaması sağlamak için:

1. Validatorünüzle kamuya açık olarak ilişkilendirmek istediğiniz sahip olduğunuz bir alan adı seçin. DDoS saldırılarına karşı bir önlem olarak, alan adınız validatorünüzün IP adresine çözülmemelidir.

2. Alan adınızda bir `xrp-ledger.toml` dosyası-host edin ve `alan adı doğrulama` adımlarını tamamlayın. Bu adımları tamamladıktan sonra, validatorünüz livenet [keşfi](https://livenet.xrpl.org/network/validators) veya validator ağını izleyen ve merkezi olmayan alan adı doğrulamasını destekleyen başka herhangi bir site tarafından görünür olmalıdır.

3. Validatorünüzün genel anahtarını özellikle diğer `rippled` operatörleri ile kamuya paylaşın. Örneğin, validatorünüzün genel anahtarını web sitenizde, sosyal medyada, [XRPChat topluluk forumunda](https://www.xrpchat.com/) veya bir basın bülteninde paylaşabilirsiniz.

---

## Validator anahtarlarını iptal etme

Eğer validatorünüzün ana özel anahtarı ele geçirilirse, derhal ve kalıcı olarak iptal etmelisiniz.

Validatorünüz için `validator-keys` aracı kullanarak oluşturduğunuz bir anahtar çiftini nasıl iptal edeceğiniz hakkında bilgi için [Anahtar İptali](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md#key-revocation) sayfasına bakın.

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `XRP Ledger Genel Görünümü`
    - `rippled` Sunucusu`
- **Kılavuzlar:**
    - `Küme rippled Sunucuları`
    - `Install `rippled`
    - `Kapasite Planlaması`
- **Referanslar:**
    - [Validator Keys Tool Guide](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md)
    - [consensus_info yöntemi][]
    - [validator_list_sites yöntemi][]
    - [validators yöntemi][]
  
