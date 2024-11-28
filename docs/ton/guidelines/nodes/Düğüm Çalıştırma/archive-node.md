# Arşiv Düğümleri

:::info
Bu makaleden önce `Tam Düğüm` hakkında bilgi okuyun.
:::

## Genel Bakış

Bir **Arşiv Düğümü**, bir blok zincirinin genişletilmiş tarihsel verilerini depolayan bir Tam Düğüm türüdür. Tarihsel verilere erişim gerektiren bir blok zinciri keşif aracı veya benzeri bir uygulama oluşturuyorsanız, bir Arşiv Düğümü'nü bir dizinleyici olarak kullanmanız önerilir.

## OS gereksinimleri

mytonctrl'ü desteklenen işletim sistemleri üzerinde kurmanızı şiddetle öneririz:
* **Ubuntu 20.04**
* **Ubuntu 22.04**
* **Debian 11**

## Donanım gereksinimleri

* 16 x Çekirdek CPU 
* 128GB ECC Bellek 
* 9TB SSD _VEYA_ 64+k IOPS depolama
* 1 Gbit/s ağ bağlantısı
* zirve yükte aylık 16 TB trafik
* bir genel IP adresi (sabit IP adresi)

:::info 
**Veri Sıkıştırma**  
Sıkıştırılmamış veri için 9TB gereklidir. 6TB, sıkıştırma etkinleştirilmiş bir ZFS hacmi kullanmaya dayanmaktadır.    
Veri hacmi her ay yaklaşık 0.5TB ve 0.25TB artış göstermektedir; son güncelleme Kasım 2024'tedir.
:::

## Kurulum

### ZFS'i Kurun ve Hacmi Hazırlayın

Dökümler, plzip kullanılarak sıkıştırılmış ZFS Anlık Görüntüleri şeklinde gelir. Kendi host'unuzda zfs kurmanız ve dökümü geri yüklemeniz gerekir; daha fazla bilgi için [Oracle Belgeleri](https://docs.oracle.com/cd/E23824_01/html/821-1448/gavvx.html#scrolltoc) sayfasına bakın.

Genellikle, düğümünüz için ayrı bir ZFS havuzu oluşturmak iyi bir fikirdir ve bu özel bir SSD sürücüsünde olmalıdır; bu, depolama alanını kolayca yönetmenizi ve düğümünüzü yedeklemenizi sağlar.

1. [zfs](https://ubuntu.com/tutorials/setup-zfs-storage-pool#1-overview) paketini kurun
    ```shell
    sudo apt install zfsutils-linux
    ```
    
2. Özel 4TB `` üzerinde [Havuz oluşturun](https://ubuntu.com/tutorials/setup-zfs-storage-pool#3-creating-a-zfs-pool) ve adını `data` koyun.
    ```shell
    sudo zpool create data <disk>
    ```

3. Geri yüklemeden önce, ana ZFS dosya sisteminde sıkıştırmayı etkinleştirmenizi şiddetle öneriyoruz; bu, size [birçok alan](https://www.servethehome.com/the-case-for-using-zfs-compression/) kazandıracaktır. `data` hacmi için sıkıştırmayı etkinleştirmek için root hesabıyla şu komutu girin:
    ```shell
    sudo zfs set compression=lz4 data
    ```

### MyTonCtrl'ü Kurun

Lütfen **mytonctrl**'ü **kurmak** ve **çalıştırmak** için bir `Tam Düğüm` kullanın.

### Bir Arşiv Düğümünü Çalıştırın

#### Düğüme Hazırlık

1. Geri yükleme işlemini gerçekleştirmeden önce, doğrulayıcıyı root hesabıyla durdurmalısınız:
    ```shell
    sudo -s
    systemctl stop validator.service
    ```

2. `ton-work` yapılandırma dosyalarının bir yedeğini alınız ( `/var/ton-work/db/config.json`, `/var/ton-work/keys` ve `/var/ton-work/db/keyring` dosyalarına ihtiyacımız olacak):
    ```shell
    mv /var/ton-work /var/ton-work.bak
    ```

#### Dökümü İndirin

1. Dökümleri indirmek için erişim kazanmak amacıyla `user` ve `password` kimlik bilgilerini [@TONBaseChatEn](https://t.me/TONBaseChatEn) Telegram sohbetinde talep edin.

2. ton.org sunucusundaki **mainnet** dökümünü indirmek ve geri yüklemek için örnek bir komut:
    ```shell
    wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
    ```

   **testnet** dökümünü kurmak için:
    ```shell
    wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest_testnet.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
    ```

Döküm büyüklüğü yaklaşık **4TB**'dır; bu nedenle indirmek ve geri yüklemek birkaç gün (maksimum 4 gün) alabilir. Döküm boyutu ağ geliştikçe artabilir.

Komutu hazırlayın ve çalıştırın:
1. Gerekirse aracları yükleyin (`pv`, `plzip`)
2. `` ve `` yi kimlik bilgilerinizle değiştirin
3. `plzip` komutunun çıkartmayı hızlandırmak için makinenizin izin verdiği kadar çekirdek kullanmasını sağlayın (`-n`)

#### Dökümü Montaj Yapın

1. zfs'i montaj yapın:
    ```shell
    zfs set mountpoint=/var/ton-work data/ton-work && zfs mount data/ton-work
    ```
    
2. Yedekten `/var/ton-work` dizinine `db/config.json`, `keys` ve `db/keyring` dosyalarını geri yükleyin:
    ```shell
    cp /var/ton-work.bak/db/config.json /var/ton-work/db/config.json
    cp -r /var/ton-work.bak/keys /var/ton-work/keys
    cp -r /var/ton-work.bak/db/keyring /var/ton-work/db/keyring
    ```

3. `/var/ton-work` ve `/var/ton-work/keys` dizinleri için izinlerin doğru bir şekilde ayarlandığından emin olun:

    - `/var/ton-work/db` dizin sahibi `validator` kullanıcısı olmalıdır:
        ```shell
        chown -R validator:validator /var/ton-work/db
        ```
    
    - `/var/ton-work/keys` dizin sahibi `ubuntu` kullanıcısı olmalıdır:
        ```shell
        chown -R ubuntu:ubuntu /var/ton-work/keys
        ```

#### Yapılandırmayı Güncelleyin

Arşiv Düğümü için düğüm yapılandırmasını güncelleyin.

1. Düğüm yapılandırma dosyasını açın `/etc/systemd/system/validator.service`
    ```shell
    nano /etc/systemd/system/validator.service
    ```

2. `ExecStart` satırında düğüm için depolama ayarlarını ekleyin:
    ```shell
    --state-ttl 315360000 --archive-ttl 315360000 --block-ttl 315360000
    ```

:::info
Düğümü başlattığınızda sabırlı olun ve günlükleri gözlemleyin.    
Dökümler DHT önbellekleri olmadan gelir; dolayısıyla, düğümünüzün diğer düğümleri bulması ve onlarla senkronize olması zaman alacaktır.    
Anlık görüntünün yaşı ve internet bağlantı hızınıza bağlı olarak,    
düğümünüzün ağı yakalaması **birkaç saatten birkaç güne kadar** sürebilir.    
**Minimum bir kurulumda, bu işlem 5 güne kadar sürebilir.**    
Bu normaldir.
:::

:::caution
Eğer düğüm senkronizasyon süreci zaten 5 gün sürdüyse ama düğüm hala senkronize değilse, 
`problem çözme bölümünü` kontrol etmelisiniz.
:::

#### Düğüme Başlayın

1. Aşağıdaki komutu çalıştırarak doğrulayıcıyı başlatın:
    ```shell
    systemctl start validator.service
    ```

2. _Yerel kullanıcı_ olarak `mytonctrl`'ü açın ve `status` kullanarak düğüm durumunu kontrol edin.

## Düğüm Bakımı

Düğüm veritabanının zaman zaman temizlenmesi gerekir (haftada bir kez yapmayı tavsiye ediyoruz); bunu yapmak için lütfen aşağıdaki adımları root olarak uygulayın:

1. Doğrulayıcı sürecini durdurun (**Bunu asla atlamayın!**)
    ```shell
    sudo -s
    systemctl stop validator.service
    ```

2. Eski günlükleri kaldırın
    ```shell
    find /var/ton-work -name 'LOG.old*' -exec rm {} +
    ```
    
3. Geçici dosyaları kaldırın
    ```shell
    rm -r /var/ton-work/db/files/packages/temp.archive.*
    ```

4. Doğrulayıcı sürecini başlatın
    ```shell
    systemctl start validator.service
    ```

## Sorun Giderme ve Yedekleme

Eğer bir sebep yüzünden bir şey çalışmazsa veya bozulursa, her zaman [geri dönebilirsiniz](https://docs.oracle.com/cd/E23824_01/html/821-1448/gbciq.html#gbcxk) ZFS dosya sisteminizdeki `@archstate` anlık görüntüsüne; bu, dökümlerden gelen orijinal durumdur.

1. Doğrulayıcı sürecini durdurun (**Bunu asla atlamayın!**)
    ```shell
    sudo -s
    systemctl stop validator.service
    ```

2. Anlık görüntü adını kontrol edin
    ```shell
    zfs list -t snapshot
    ```

3. Anlık görüntüye geri dönün
    ```shell
    zfs rollback data/ton-work@dumpstate
    ```

Eğer Düğümünüz iyi çalışıyorsa, bu anlık görüntüyü depolama alanı tasarrufu için kaldırabilirsiniz; fakat, doğrulayıcı düğümünün bazı durumlarda verileri ve `config.json`'u bozma eğiliminde olduğunu göz önünde bulundurarak, yedekleme amaçları için dosya sisteminizi düzenli olarak anlık görüntülemenizi öneririz. [zfsnap](https://www.zfsnap.org/docs.html) anlık görüntü döngüsünü otomatikleştirmek için hoş bir araçtır.

:::tip Yardıma mı ihtiyacınız var?
Bir sorunuz varsa veya yardıma ihtiyacınız varsa, lütfen [TON geliştirici sohbetinde](https://t.me/tondev_eng) topluluktan yardım almak için sorun. MyTonCtrl geliştiricileri de orada bulunmaktadır.
:::

## İpuçları & Püf Noktaları

### Arşiv düğümünü blokları depolamaması için zorlamak

Düğümün arşiv bloklarını depolamaması için 86400 değerini kullanın. Daha fazla bilgi için `set_node_argument bölümüne` bakın.
```bash
installer set_node_argument --archive-ttl 86400
```

## Destek 

Teknik destek için [@mytonctrl_help](https://t.me/mytonctrl_help) ile iletişime geçin.

## Ayrıca Bakınız

* `TON Düğüm Türleri`
* `Tam Düğüm Çalıştırma`