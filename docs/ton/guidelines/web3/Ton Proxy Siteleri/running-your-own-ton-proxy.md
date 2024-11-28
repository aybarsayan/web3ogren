# Kendi TON Proxy'nizi Çalıştırma

Bu belgenin amacı, TON Ağı üzerinden erişilen web siteleri olan TON Siteleri ile ilgili yumuşak bir giriş sağlamaktır. TON Siteleri, diğer TON Hizmetleri için uygun bir giriş noktası olarak kullanılabilir. Özellikle, TON Sitelerinden indirilen HTML sayfaları, kullanıcının bağlantıya tıklayarak gerçekleştirebileceği ödemeleri temsil eden `ton://...` URI'leri içerebilir; bunun için kullanıcının cihazında bir TON Cüzdanı kurulu olmalıdır.

Teknik açıdan, TON Siteleri standart web sitelerine oldukça benzer, ancak Internet yerine `TON Ağı` üzerinden erişilir (bu, İnternet içinde bir üst ağdır). Daha spesifik olarak, bir `ADNL` Adresi (geleneksel bir IPv4 veya IPv6 adresi yerine) vardır ve HTTP sorgularını `RLDP` protokolü üzerinden kabul eder (bu, TON Ağı'nın ana protokolü olan ADNL üzerine inşa edilmiş daha yüksek seviyeli bir RPC protokolüdür) ve normal TCP/IP yerine kullanılır. Tüm şifreleme ADNL üzerinden gerçekleştirilir, bu nedenle giriş proxy'si kullanıcının cihazında yerel olarak barındırılıyor ise HTTPS (yani TLS) kullanma ihtiyacı yoktur.

Mevcut sitelere erişmek ve yeni TON Siteleri oluşturmak için "normal" internet ile TON Ağı arasında özel geçitlere ihtiyaç vardır. Esasen, TON Siteleri, istemcinin makinesinde çalışan bir HTTP->RLDP proxy aracılığıyla erişilir ve uzaktaki bir web sunucusunda çalışan ters bir RLDP->HTTP proxy aracılığıyla oluşturulur.

[TON Siteleri, WWW ve Proxy hakkında daha fazla bilgi okuyun](https://blog.ton.org/ton-sites)

---

## Giriş Proxy'sini Çalıştırma

:::info Lütfen dikkat
Mevcut TON Sitelerine erişmek için bilgisayarınızda bir RLDP-HTTP Proxy çalıştırmanız gerekir.
:::

1. **rldp-http-proxy** dosyasını [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest) adresinden indirin.

   Veya bu `talimatları` takip ederek **rldp-http-proxy**'yi kendiniz derleyebilirsiniz.

2. TON küresel yapılandırmasını `indirin`.

3. **rldp-http-proxy**'yi çalıştırın.

   ```bash
   rldp-http-proxy/rldp-http-proxy -p 8080 -c 3333 -C global.config.json
   ```

Yukarıdaki örnekte, `8080`, localhost üzerinde gelen HTTP sorguları için dinlenecek TCP portudur ve `3333`, outbound ve inbound RLDP ve ADNL etkinliği için kullanılacak UDP portudur (yani TON Ağı üzerinden TON Sitelerine bağlanmak için). `global.config.json` ise TON küresel yapılandırmasının dosya adı.

Her şeyi doğru yapmışsanız, giriş proxy'si sonlanmayacak, terminalde çalışmaya devam edecektir. Artık TON Sitelerine erişim için kullanılabilir. Artık ihtiyacınız kalmadığında, `Ctrl-C` tuşuna basarak veya terminal penceresini kapatarak sonlandırabilirsiniz.

Giriş proxy'niz `localhost` port `8080` üzerinden HTTP ile erişilebilir olacaktır.

---

## Uzak Bir Bilgisayar Üzerinde Giriş Proxy'sini Çalıştırma

:::warning Dikkat
Uzaktan çalıştırmanız gereken bazı adımlar var.
:::

1. **rldp-http-proxy** dosyasını [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest) adresinden indirin.

   Veya bu `talimatları` takip ederek **rldp-http-proxy**'yi kendiniz derleyebilirsiniz.

2. TON küresel yapılandırmasını `indirin`.

3. **generate-random-id** dosyasını [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest) adresinden indirin.

   Veya bu `talimatları` takip ederek **generate-random-id**'yi kendiniz derleyebilirsiniz.

4. Giriş proxy'niz için kalıcı bir ANDL Adresi oluşturun.

   ```bash
   mkdir keyring

   utils/generate-random-id -m adnlid
   ```

   Şuna benzer bir şey göreceksiniz:
   ```
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   Bu, yeni oluşturduğunuz kalıcı ADNL Adresi olup, onaltılık ve kullanıcı dostu formdadır. Karşılık gelen özel anahtar, mevcut dizinde `45061...2DB` dosyasına kaydedilmiştir. Anahtarı anahtar dizinine taşıyın.

   ```bash
   mv 45061C1* keyring/
   ```

5. **rldp-http-proxy**'yi çalıştırın.

   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a <your_public_ip>:3333 -C global.config.json -A <your_adnl_address>
   ```

   burada ``, genel IPv4 adresiniz ve ``, bir önceki adımda oluşturulan ADNL adresidir.

   Örnek:
   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a 777.777.777.777:3333 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   Yukarıdaki örnekte, `8080`, localhost üzerinde gelen HTTP sorguları için dinlenecek TCP portudur ve `3333`, outbound ve inbound RLDP ve ADNL etkinliği için kullanılacak UDP portudur (yani TON Ağı üzerinden TON Sitelerine bağlanmak için). `global.config.json` ise TON küresel yapılandırmasının dosya adıdır.

Her şeyi doğru yapmışsanız, Proxy sonlanmayacak, ancak terminalde çalışmaya devam edecektir. Artık TON Sitelerine erişim için kullanılabilir. Artık ihtiyacınız kalmadığında, `Ctrl-C` tuşuna basarak veya terminal penceresini kapatarak sonlandırabilirsiniz. Bunu kalıcı olarak çalıştırmak için bir unix hizmeti olarak da çalıştırabilirsiniz.

Giriş proxy'niz `` port `8080` üzerinden HTTP ile erişilebilir olacaktır.

---

## TON Sitelerine Erişim

Şimdi bilgisayarınızda `localhost:8080` üzerinde dinleyen bir RLDP-HTTP Proxy örneğiniz olduğunu varsayalım; yukarıda açıklandığı gibi.

Her şeyin düzgün çalışıp çalışmadığını basit bir test ile `curl` veya `wget` gibi programlar kullanarak yapabilirsiniz. Örneğin,

```
curl -x 127.0.0.1:8080 http://just-for-test.ton
```

`just-for-test.ton` (TON) Sitesinin ana sayfasını `127.0.0.1:8080` üzerindeki proxy kullanarak indirmeye çalışır. Proxy çalışıyorsa, şuna benzer bir şey göreceksiniz:

```html
<html>
<head>
<title>TON Site</title>
</head>
<body>
<h1>TON Proxy Çalışıyor!</h1>
</body>
</html>
```

Ayrıca TON Sitelerine ADNL adresleri ile sahte bir alan adı `.adnl` kullanarak erişebilirsiniz.

```bash
curl -x 127.0.0.1:8080 http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/
```

şu anda aynı TON Web sayfasını alır.

Alternatif olarak, `localhost:8080`'i tarayıcınızdaki HTTP proxy'si olarak ayarlayabilirsiniz. Örneğin, Firefox kullanıyorsanız, [Ayarlar] -> Genel -> Ağ Ayarları -> Ayarlar -> Proxy Erişimini Yapılandır -> Manuel Proxy Yapılandırması alanına gidin ve "HTTP Proxy" alanına "127.0.0.1" ve "Port" alanına "8080" yazın.

`localhost:8080`'i tarayıcınızdaki kullanılacak HTTP proxy olarak ayarladığınızda, şimdi tarayıcınızın adres çubuğuna `http://just-for-test.ton` veya `http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/` gibi istediğiniz URI'yi yazarak, TON Sitesi ile normal Web Siteleri ile etkileşim kurar gibi etkileşimde bulunabilirsiniz.

---

## TON Sitesini Çalıştırma

:::tip Öğretici Kaynağı!
Hey! Başlangıç dostu öğreticilerden `TON Sitesini Nasıl Çalıştırırım?` ile başlamaz mısınız?
:::

Çoğu insan yeni TON Siteleri oluşturmak değil, mevcut olanlara erişmek isteyecektir. Ancak, bir tane oluşturmak istiyorsanız, sunucunuzda RLDP-HTTP Proxy'sini çalıştırmanız ve Apache veya Nginx gibi normal web sunucusu yazılımları kullanmanız gerekecektir.

Ordinary web sitelerini nasıl kurduğunuzu bildiğinizi varsayıyoruz ve sunucunuzda bir tane zaten yapılandırdığınızı, TCP portu `:80` üzerinde gelen HTTP bağlantılarını kabul ettiğinizi ve gerekli TON Ağı alan adını (örneğin `example.ton`) web sunucunuzun yapılandırmasında ana alan adı veya takma ad olarak tanımlamış olduğunuzu varsayıyoruz.

1. **rldp-http-proxy** dosyasını [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest) adresinden indirin.

   Veya bu `talimatları` izleyerek **rldp-http-proxy**'yi kendiniz derleyebilirsiniz.

2. TON küresel yapılandırmasını `indirin`.

3. **generate-random-id** dosyasını [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest) adresinden indirin.

   Veya bu `talimatları` takip ederek **generate-random-id**'yi kendiniz derleyebilirsiniz.

4. Sunucunuz için kalıcı bir ADNL Adresi oluşturun.

   ```bash
   mkdir keyring

   utils/generate-random-id -m adnlid
   ```

   Şuna benzer bir şey göreceksiniz.
   ```
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   Bu, yeni oluşturduğunuz kalıcı ADNL Adresi olup, onaltılık ve kullanıcı dostu formdadır. Karşılık gelen özel anahtar, mevcut dizinde `45061...2DB` dosyasına kaydedilmiştir. Anahtarı anahtar dizinine taşıyın.

   ```bash
   mv 45061C1* keyring/
   ```

5. Web sunucunuzun `.ton` ve `.adnl` alan adları ile HTTP isteklerini kabul ettiğinden emin olun.

   Örneğin, nginx kullanıyorsanız ve yapılandırmanız `server_name example.com;` ise, `server_name _;` veya `server_name example.com example.ton vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl;` olarak değiştirmeniz gerekir.

6. Ters modda proxy'i çalıştırın.

   ```bash
   rldp-http-proxy/rldp-http-proxy -a <your-server-ip>:3333 -L '*' -C global.config.json -A <your-adnl-address> -d -l <log-file>
   ```

   burada ``, sunucunuzun genel IPv4 adresi ve ``, bir önceki adımda oluşturulan ADNL adresidir.

Eğer TON Sitelerinin kalıcı olarak çalışmasını istiyorsanız, `-d` ve `-l ` seçeneklerini kullanmanız gerekecektir.

Örnek:
 ```bash
 rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -L '*' -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
 ```

Her şey düzgün çalışıyorsa, RLDP-HTTP proxy'si, UDP portu 3333 üzerinden RLDP/ADNL aracılığıyla TON Ağı'ndan gelen HTTP sorgularını kabul edecektir (elbette, isterseniz herhangi bir başka UDP portunu da kullanabilirsiniz) ve bu HTTP sorgularını tüm hostlara yönlendirecektir (belirli hostları yönlendirmek istiyorsanız, `-L '*'`'yi `-L ` olarak değiştirin) ve `127.0.0.1` üzerindeki TCP portu `80`'e yönlendirecektir (yani normal web sunucunuza).

`http://.adnl` (`http://vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl` bu örnekte) adresine bir istemci makinesindeki tarayıcıdan erişebilirsiniz; "TON Sitelerine Erişim" bölümünde açıklandığı gibi ve TON Sitelerinizin gerçekten herkese açık olup olmadığını kontrol edebilirsiniz.

İsterseniz, bir TON DNS alan adı (örneğin 'example.ton') `kaydettirebilir` ve bu alan adı için kalıcı ADNL Adresinize işaret eden bir `site` kaydı oluşturabilirsiniz. Böylece, istemci modunda çalışan RLDP-HTTP proxy'leri `http://example.ton` adresini ADNL Adresinize işaret edecek şekilde çözümleyecek ve TON Sitelerinize erişecektir.

Ayrıca, ayrı bir sunucuda ters bir proxy çalıştırabilir ve web sunucunuzu uzaktan bir adres olarak ayarlayabilirsiniz. Bu durumda `-L '*'` yerine `-R '*'@:` kullanın.

Örnek:
```bash
rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -R '*'@333.333.333.333:80 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
```

Bu durumda, normal web sunucunuz `http://333.333.333.333:80` üzerinden erişilebilir olmalıdır (bu IP dışarıya kapalı olacaktır).

---

### Öneriler

:::note Taahhütler
TON Proxy 2.0'da anonimlik mevcut olacağından, web sunucunuzun IP adresini açıklamak istemiyorsanız, bunu iki şekilde yapabilirsiniz:
:::

 * Yukarıda açıklandığı gibi `-R` bayrağı ile ayrı bir sunucuda ters bir proxy çalıştırın.

 * Web sitenizin bir kopyasını bulunduran bir yedek sunucu oluşturun ve ters proxy'yi yerel olarak çalıştırın.