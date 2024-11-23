# Bakım ve Güvenlik

## Giriş
Bu kılavuz, TON Validator düğümlerinin bakımını ve güvenliğini sağlama konusunda bazı temel bilgiler sunmaktadır.

Bu belge, bir doğrulayıcının **`TON Foundation tarafından önerilen`** yapılandırma ve araçlar kullanarak yüklü olduğunu varsayar, ancak genel kavramlar diğer senaryolar için de geçerlidir ve bilgili sistem yöneticileri için yararlı olabilir.

---

## Bakım

### Veritabanı bakımı
TON Düğümü, veritabanını `validator-engine`'ın `--db` bayrağı ile belirtilen yol içinde tutar, genellikle `/var/ton-work/db`. Veritabanı boyutunu azaltmak için, bazı saklanan verilerin TTL (yaşam süresi) değerini azaltabilirsiniz.

Geçerli TTL değerleri, düğüm hizmet dosyasında bulunabilir (varsayılan yol `/etc/systemd/system/validator.service`). Eğer MyTonCtrl kullanıyorsanız `installer status` komutunu kullanabilirsiniz. Eğer değerlerden bazıları ayarlanmamışsa, varsayılan değerler kullanılır.

### archive-ttl

`archive-ttl`, blokların yaşam süresini tanımlayan bir parametredir. Varsayılan değer 604800 saniye (7 gün) olarak belirlenmiştir. Bu değeri, veritabanı boyutunu azaltmak için azaltabilirsiniz.

```bash
MyTonCtrl> installer set_node_argument --archive-ttl <değer>
```

Eğer MyTonCtrl kullanmıyorsanız, düğüm hizmet dosyasını düzenleyebilirsiniz.

### state-ttl

`state-ttl`, blok durumlarının yaşam süresini tanımlayan bir parametredir. Varsayılan değer 86400 saniye (24 saat) olarak belirlenmiştir. Bu değeri, veritabanı boyutunu azaltmak için azaltabilirsiniz, ancak doğrulayıcılar için varsayılan değeri kullanmanız şiddetle önerilir (bayrağı ayarlamayı bırakın). Ayrıca, bu değer doğrulama süresinin uzunluğundan fazla olmalıdır (değer **[15. yapılandırma parametrelerinde](https://docs.ton.org/v3/documentation/network/configs/blockchain-configs#param-15)** bulunabilir).

```bash
MyTonCtrl> installer set_node_argument --state-ttl <değer>
```

Eğer MyTonCtrl kullanmıyorsanız, düğüm hizmet dosyasını düzenleyebilirsiniz.

---

### Yedeklemeler
Doğrulayıcıyı yedeklemek için en kolay ve en etkili yol, kritik düğüm yapılandırma dosyalarını, anahtarları ve mytonctrl ayarlarını kopyalamaktır:

* Düğüm yapılandırma dosyası: `/var/ton-work/db/config.json`
* Düğüm özel anahtarları: `/var/ton-work/db/keyring`
* Düğüm genel anahtarları: `/var/ton-work/keys`
* mytonctrl yapılandırması ve cüzdanlar: `$HOME/.local/share/myton*`, burada $HOME, mytonctrl yüklemesini başlatan kullanıcının ev dizinidir **VEYA** kök olarak mytonctrl yüklediyseniz `/usr/local/bin/mytoncore` olacaktır.

> Bu set, düğümünüzü sıfırdan kurtarmanız için gereken her şeyi içerir.  
> — Bakım Takımı

#### Anlık Görüntüler
Modern dosya sistemleri, ZFS gibi, anlık görüntü işlevselliği sunar, çoğu bulut sağlayıcısı da müşterilerin makinelerinin anlık görüntülerini almalarına izin verir; bu durumda tüm disk gelecekteki kullanımlar için korunur.

Her iki yöntemin sorunu, anlık görüntü almadan önce düğümü durdurmanız gerektiğidir; bunu yapmazsanız, büyük olasılıkla beklenmedik sonuçlarla birlikte bozulmuş bir veritabanı ile karşılaşabilirsiniz. 

:::warning  
Birçok bulut sağlayıcısı, anlık görüntü almadan önce makineyi kapatmanızı da gerektirir.  
:::

Bu tür durdurmalar sık sık yapılmamalıdır; eğer düğümünüzü haftada bir kez anlık görüntü alırsanız, en kötü senaryoda kurtarma sonrasında bir hafta önceki bir veritabanına sahip olursunuz ve düğümünüzün ağa uyum sağlaması, mytonctrl kullanarak yeni bir yükleme yapmaktan daha uzun sürecektir (bu işlem sırasında `install.sh` komutunun çağrısına eklenen -d bayrağı ile).

---

### Felaket Kurtarma
Yeni bir makinede düğüm kurtarma işlemini gerçekleştirmek için:

#### mytonctrl / düğüm yükleyin
Düğümün en hızlı başlatılması için yükleme komutuna `-d` switch'ini ekleyin.

#### Kök kullanıcıya geçiş yapın
```sh
sudo -s
```
#### mytoncore ve doğrulayıcı süreçlerini durdurun
```sh
systemctl stop validator
systemctl stop mytoncore
```
#### Yedeklenen düğüm yapılandırma dosyalarını uygulayın
* Düğüm yapılandırma dosyası: `/var/ton-work/db/config.json`
* Düğüm özel anahtarları: `/var/ton-work/db/keyring`
* Düğüm genel anahtarları: `/var/ton-work/keys`

####  Düğüm IP adresini ayarlayın
Yeni düğümünüzün farklı bir IP adresine sahip olması durumunda, düğüm yapılandırma dosyasını `/var/ton-work/db/config.json` düzenlemeli ve leaf `.addrs[0].ip`'i yeni IP adresinin **ondalık** gösterimine ayarlamalısınız. IP'nizi ondalığa dönüştürmek için **[bu](https://github.com/sonofmom/ton-tools/blob/master/node/ip2dec.py)** python scriptini kullanabilirsiniz.

#### Veritabanı izinlerinin uygunluğunu kontrol edin
```sh
chown -R validator:validator /var/ton-work/db
```
#### Yedeklenen mytonctrl yapılandırma dosyalarını uygulayın
$HOME/.local/share/myton* dizinindeki içeriği, yedeklenmiş içerik ile değiştirin; yedeklenen dosyaların sahibi olduğuna emin olun.

#### mytoncore ve doğrulayıcı süreçlerini başlatın
```sh
systemctl start validator
systemctl start mytoncore
```

---

## Güvenlik

### Host düzeyi güvenlik
Host düzeyinde güvenlik, bu belgenin kapsamının dışında büyük bir konudur, ancak mytonctrl'ü kök kullanıcı altında asla yüklememenizi öneririz, ayrıcalık ayrımını sağlamak için bir hizmet hesabı kullanın.

### Ağ düzeyi güvenlik
TON Doğrulayıcıları, dış tehditlerden korunması gereken yüksek değerli varlıklardır, atacağınız ilk adımlardan biri, düğümünüzü mümkün olduğunca görünmez hale getirmektir; bu, tüm ağ bağlantılarını kilitlemek anlamına gelir. 

#### Araçlar
Bir **[ufw](https://help.ubuntu.com/community/UFW)** güvenlik duvarı arayüzü ve bir **[jq](https://github.com/stedolan/jq)** JSON komut satırı işleyicisi kullanacağız.

#### Yönetim Ağları
Bir düğüm operatörü olarak, makine üzerinde tam kontrol ve erişimi korumalısınız; bunu sağlamak için en az bir sabit IP adresine veya aralığına ihtiyacınız var.

Ayrıca, sabit bir IP'nin olmadığı bir ev/iş yerinde, güvenli makinelerinize erişmek için sizi kullanabilen sabit IP adresine sahip küçük bir "jumpstation" VPS kurmanızı da öneririz.

#### ufw ve jq yükleyin
```sh
sudo apt install -y ufw jq
```
#### ufw kural setinin temel kilidi
```sh
sudo ufw default deny incoming; sudo ufw default allow outgoing
```
#### Otomatik ICMP yankı isteği kabulünü devre dışı bırakın
```sh
sudo sed -i 's/-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/#-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/g' /etc/ufw/before.rules
```
#### Yönetim ağlarından gelen tüm erişimi etkinleştir
```sh
sudo ufw insert 1 allow from <YÖNETİM_AĞI>
```
yukarıdaki komutu her yönetim ağı/adresi için tekrarlayın.

#### Düğüm / doğrulayıcı UDP portunu herkese açın
```sh
sudo ufw allow proto udp from any to any port `sudo jq -r '.addrs[0].port' /var/ton-work/db/config.json`
```
#### Yönetim ağlarınızı kontrol edin
Önemli: Güvenlik duvarını açmadan önce, doğru yönetim adreslerini eklediğinizi kontrol edin!

#### ufw güvenlik duvarını etkinleştir
```sh
sudo ufw enable
```
#### Durumu kontrol etme
Güvenlik duvarı durumunu kontrol etmek için şu komutu kullanın:
```sh
sudo ufw status numbered
```
Etkili bir şekilde kilitlenmiş bir düğüm için iki yönetim ağı/adresi ile örnek çıktı:

```
Durum: aktif

     Hedef                      İşlem      Kaynak
     --                         ------      ----
[ 1] Herhangi bir yer           GİRİŞE İZİN    <YÖNETİM_AĞI_A>/28
[ 2] Herhangi bir yer           GİRİŞE İZİN    <YÖNETİM_AĞI_B>/32
[ 3] <DÜĞÜM_PORTU>/udp         GİRİŞE İZİN    Herhangi bir yer
[ 4] <DÜĞÜM_PORTU>/udp (v6)    GİRİŞE İZİN    Herhangi bir yer (v6)
```

#### LiteServer portunu açma
```sh
sudo ufw allow proto tcp from any to any port `sudo jq -r '.liteservers[0].port' /var/ton-work/db/config.json`
```
:::danger  
Lütfen LiteServer portunun bir doğrulayıcı üzerinde halka açık olarak açılmaması gerektiğini unutmayın.  
:::

#### UFW hakkında daha fazla bilgi
UFW hakkında daha fazla bilgi için **[ufw eğitimi](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands)**, Digital Ocean'dan daha fazla UFW sihri için mükemmel bir kaynaktır.

---

### IP Değiştirme
Düğümünüzün bir saldırıya uğradığını düşünüyorsanız, IP Adresinizi değiştirmeyi düşünebilirsiniz. Değiştirme yöntemi, barındırma sağlayıcınıza bağlıdır; ikinci bir adres ön sipariş edebilir, **durdurulmuş** VM'nizi başka bir örneğe klonlayabilir veya yeni bir örnek oluşturmak amacıyla **`felaket kurtarma`** sürecini uygulayabilirsiniz.

Her durumda, lütfen **`yeni IP Adresinizi`** düğüm yapılandırma dosyasında ayarladıktan emin olun!