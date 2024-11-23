# Sorun Giderme

Bu bölüm, düğüm çalıştırma ile ilgili en sık sorulan sorulara yanıtlar içermektedir.

## Hesap durumunu almakta hata

```
Hesap durumunu almakta hata
```

Bu hata, bu hesabın shard durumunda aranmasında sorunlar olduğu anlamına gelir. Muhtemelen, liteserver düğümü çok yavaş senkronize ediliyor, özellikle Masterchain senkronizasyonu shardchains (Basechain) senkronizasyonunu geçmiştir. Bu durumda, düğüm son zamanlardaki Masterchain bloğunu biliyor ancak son shardchain bloğunda hesap durumunu kontrol edemiyor ve **Hesap durumunu almakta hata** döndürüyor.

## Hesap durumunu açmakta hata

```
Hesap durumunu açmakta hata
```

Bu hata, istenen hesabın mevcut durumda var olmadığını gösterir. Yani, bu hesap aynı anda hem dağıtılmamış hem de sıfır bakiyeye sahiptir.

## Düğüm senkronizasyonunda 3 saat boyunca ilerleme olmaması hakkında

Aşağıdaki kontrolleri gerçekleştirin:

1. İşlem çökme olmadan mı çalışıyor? (systemd işlem durumunu kontrol edin)
2. Düğüm ile internet arasında bir güvenlik duvarı var mı? Varsa, `/var/ton-work/db/config.json` dosyasındaki `addrs[0].port` alanında belirtilen porta gelen UDP trafiğini geçirecek mi?
3. Makine ile internet arasında bir NAT var mı? Varsa, `/var/ton-work/db/config.json` dosyasındaki `addrs[0].ip` alanında tanımlanan IP adresinin makinenin gerçek genel IP'si ile eşleştiğinden emin olun. Bu alanın değeri imzalı bir INT olarak belirtilmiştir. Dönüşümler için [ton-tools/node](https://github.com/sonofmom/ton-tools/tree/master/node) içindeki `ip2dec` ve `dec2ip` script'leri kullanılabilir.

## Arşiv düğümü, senkronizasyon sürecinin üzerinden 5 gün geçmesine rağmen senkronize değil

`Yukarıdaki bölümden` kontrol listesini inceleyin.

## Yavaş senkronizasyon potansiyel nedenleri

1. Disk görece zayıf. **Diskin IOPS'lerini kontrol etmek tavsiye olunur** (ancak bazen barındırma sağlayıcıları bu rakamları abartabilir).
2. Güncellemeler ağ yoğunluğu ile çakıştı. Ancak, yavaş senkronizasyon yükten kaynaklanmaktadır, güncellemelerden değil. Tam düğüm ağa yetişemiyor çünkü yaklaşık 100 milyon işlem vardı.
3. Tam Düğüm durumu için tarih tutma varsayılan değeri bir güne düşürüldüğünden, ağda eski durumları sağlayabilecek daha az Tam Düğüm bulunmaktadır, bu da böyle bir gecikme ile senkronize olmayı zorlaştırabilir.

---

## Mevcut duruma dış mesajı uygulayamıyor : Dış mesaj kabul edilmedi

```
Mevcut duruma dış mesajı uygulayamıyor : Dış mesaj kabul edilmedi
```

Bu hata, sözleşmenin dış mesajı kabul etmediği anlamına gelir. İzlemede çıkış kodunu bulmalısınız. -13, hesabın mesajı kabul etmek için yeterli TON olmadığını gösterir (veya daha fazla gaz kredi gerektirir). Cüzdan sözleşmelerinde çıkış kodu=33, yanlış seqno anlamına gelir (kullandığınız seqno verisi muhtemelen güncel değil), çıkış kodu=34 yanlış subwallet_id'yi ifade eder (eski cüzdanlar için v1/v2, yanlış imza demektir), çıkış kodu=35, mesajın ya süresinin dolmuş olduğunu ya da imzanın yanlış olduğunu gösterir.

## Hata 651 ne anlama geliyor?

`[Hata : 651 : no nodes]` ifadesi, düğümünüzün TON Blockchain içinde başka bir düğümü bulamadığını gösterir.

Bazen bu işlem 24 saate kadar sürebilir. Ancak, bu hatayı birkaç gün boyunca aldıysanız, bu, düğümünüzün mevcut ağ bağlantısı üzerinden senkronize olamayacağı anlamına gelir.

:::tip Çözüm
Güvenlik duvarı ayarlarını kontrol etmeniz gerekiyor, varsa herhangi bir NAT ayarını da dahil edin.

Bu, belirli bir porta gelen bağlantılara izin vermeli ve herhangi bir porttan gelen bağlantılara izin vermelidir.
:::

## Doğrulayıcı konsolu ayarları yok

Eğer `Doğrulayıcı konsolu ayarları yok` hatası ile karşılaşırsanız, bu, `MyTonCtrl`'yi yükleme için kullandığınız kullanıcıdan farklı bir kullanıcıdan çalıştırdığınız anlamına gelir.

:::tip Çözüm
`MyTonCtrl`'yi `yüklediğiniz kullanıcıdan` çalıştırın (kök olmayan sudo kullanıcısı).

```bash
mytonctrl
```
:::

### MyTonCtrl'yi Farklı Kullanıcı Olarak Çalıştırmak

MyTonCtrl'yi farklı bir kullanıcı olarak çalıştırmak, aşağıdaki hatayı tetikleyebilir:

```bash
Hata: beklenen str, bytes veya os.PathLike nesne, NoneType değil
```

Bunu çözmek için, MyTonCtrl'yi yükleyen kullanıcı olarak çalıştırmalısınız.

## "blok uygulanmadı" ne anlama geliyor?

**__S:__** Bazen, çeşitli talepler için `blok uygulanmadı` veya `blok hazır değil` alıyoruz - bu normal mi?

**__C:__** Bu normaldir, genellikle bu, sorguladığınız düğüme ulaşmamış bir bloğu almak için denediğiniz anlamına gelir.

**__S:__** Karşılaştırmalı frekans göründüğünde, bu bir yerde bir sorun olduğu anlamına mı gelir?

**__C:__** Hayır. `mytonctrl` içinde "Yerel doğrulayıcı senkronize değil" değerini kontrol etmelisiniz. 20 saniyeden azsa, her şey yolunda demektir.

Ama, düğüm sürekli senkronize olduğunu unutmamalısınız. Bazen, almak için denediğiniz bir blok henüz sorguladığınız düğüme ulaşmamış olabilir.

İsteği hafif bir gecikme ile tekrarlamalısınız.

---

## -d Bayrağı ile Senkronizasyon Problemi

`MyTonCtrl`'yi `-d` bayrağı ile indirdikten sonra `senkronize değil` zaman damgası ile bir sorun ile karşılaşırsanız, dump'ın doğru bir şekilde yüklenmediği (ya da zaten eski olduğu) anlamına gelebilir.

:::tip Çözüm
Tavsiye edilen çözüm, yeni dump ile `MyTonCtrl`'yi tekrar yüklemektir.
:::

Eğer senkronizasyon olağandışı uzun sürüyorsa, dump ile ilgili sorunlar olabilir. Lütfen [bizimle iletişime geçin](https://t.me/SwiftAdviser) yardım için.

Lütfen, `mytonctrl`'yi yüklediğiniz kullanıcıdan çalıştırın.

## Hata komutu... 3 saniye sonra zaman aşımına uğradı

Bu hata, yerel düğümün henüz senkronize olmadığını (20 saniyeden daha az senkronize değil) ve genel düğümlerin kullanıldığını gösterir. Genel düğümler her zaman yanıt vermeyebilir ve sonuçta bir zaman aşımı hatasına yol açar.

:::tip Çözüm
Sorunun çözümü, yerel düğümün senkronize olmasını beklemek veya aynı komutu birden fazla kez yürütmektir.
:::

## Durum komutu yerel düğüm bölümü olmadan görüntüleniyor

![](../../../images/ton/static/img/docs/full-node/local-validator-status-absent.png)

Eğer düğüm durumunda yerel düğüm bölümü yoksa, bu genellikle yükleme sırasında bir şeylerin yanlış gittiği ve bir doğrulayıcı cüzdanı oluşturma/atanma adımının atlandığı anlamına gelir. Ayrıca doğrulayıcı cüzdanın belirtildiğini kontrol edin.

Doğrudan aşağıdakileri kontrol edin:

```bash
mytonctrl> get validatorWalletName
```

Eğer validatorWalletName null ise aşağıdakileri yürütün:

```bash
mytonctrl> set validatorWalletName validator_wallet_001
```

---

## Yeni Sunucuya Bir Doğrulayıcı Aktar

:::info
Eski düğümden tüm anahtarları ve yapılandırmaları yeni çalıştırılan düğüme aktarın ve başlatın. Yeni düğümde bir sorun çıkarsa, her şeyin kurulu olduğu kaynak hala mevcut olacaktır.
:::

**En iyi yol** (geçici olarak doğrulamama cezası küçük olduğu için kesintisiz olarak yapılabilir):

1. Yeni sunucuda `mytonctrl` kullanarak temiz bir yükleme gerçekleştirin ve her şey senkronize olana kadar bekleyin.

2. Her iki makinede de `mytoncore` ve doğrulayıcı `hizmetlerini` durdurun, kaynakta ve yenisinde yedekleme yapın:

   - 2.1 `/usr/local/bin/mytoncore/...`
   - 2.2 `/home/${user}/.local/share/mytoncore/...`
   - 2.3 `/var/ton-work/db/config.json`
   - 2.4 `/var/ton-work/db/config.json.backup`
   - 2.5 `/var/ton-work/db/keyring`
   - 2.6 `/var/ton-work/keys`

3. Kaynaktan yeni düğüme aktarma yapın (içeriği değiştirin):

   - 3.1 `/usr/local/bin/mytoncore/...`
   - 3.2 `/home/${user}/.local/share/mytoncore/...`
   - 3.3 `/var/ton-work/db/config.json`
   - 3.4 `/var/ton-work/db/keyring`
   - 3.5 `/var/ton-work/keys`

4. `/var/ton-work/db/config.json` içinde `addrs[0].ip` alanını yüklemeden sonra mevcut olan ile değiştirin (yedek `/ton-work/db/config.json.backup` dosyasında görülebilir).

5. Değiştirilen tüm dosyalardaki izinleri kontrol edin.

6. Yeni düğümde `mytoncore` ve `doğrulayıcı` hizmetlerini başlatın, düğümün senkronize olduğunu ve ardından doğrulandığını kontrol edin.

7. Yeni düğümde bir yedekleme yapın:

```bash
cp var/ton-work/db/config.json var/ton-work/db/config.json.backup
```

## Mytonctrl başka bir kullanıcı tarafından yüklendi. Muhtemelen mtc'yi ... kullanıcı ile başlatmanız gerekir

MyTonCtrl'yi yüklemek için kullandığınız kullanıcı ile çalıştırın.

Örneğin, en yaygın durum, birinin MyTonCtrl'yi kök kullanıcı olarak çalıştırmaya çalışmasıdır, oysa farklı bir kullanıcı altında yüklenmiştir. Bu durumda, MyTonCtrl'yi yükleyen kullanıcıya giriş yapmalı ve MyTonCtrl'yi o kullanıcıdan çalıştırmalısınız.

### Mytonctrl başka bir kullanıcı tarafından yüklendi. Muhtemelen mtc'yi `validator` kullanıcı ile başlatmanız gerekir

Aşağıdaki komutu çalıştırın:

```bash
sudo chown <user_name>:<user_name> /var/ton-work/keys/*
```
burada ``, mytonctrl'ü yükleyen kullanıcıdır.

### Mytonctrl başka bir kullanıcı tarafından yüklendi. Muhtemelen mtc'yi `ubuntu` kullanıcı ile başlatmanız gerekir

Ayrıca, `mytonctrl` bu hatayla düzgün çalışmayabilir. Örneğin, `durum` komutu boş bir sonuç döndürebilir.

`mytonctrl` sahibini kontrol edin:

```bash
ls -lh /var/ton-work/keys/
```

Eğer sahibi `root` kullanıcısı ise, `mytonctrl'ü kaldırın` ve `yine yükleyin` **kök olmayan kullanıcıyla**.

Aksi takdirde, mevcut kullanıcıdan çıkış yapın (ssh bağlantısı kullanılıyorsa, bağlantıyı kesin) ve doğru kullanıcı olarak giriş yapın.

Mesaj kaybolmalıdır.

## MyTonCtrl konsolu "Mytonctrl'ün yeni bir versiyonu bulundu! Taşıma işlemi yapılıyor!" mesajından sonra açılmıyor

Bu hatanın göründüğü iki bilinen durum vardır:

### MytonCtrl Güncellemesinden Sonra Hata

* Eğer MyTonCtrl, kök kullanıcı tarafından yüklendiyse: `/usr/local/bin/mytonctrl/VERSION` dosyasını silin.
* Eğer MyTonCtrl, kök olmayan kullanıcı tarafından yüklendiyse: `~/.local/share/mytonctrl/VERSION` dosyasını silin.

### MytonCtrl Yüklemesi Sırasında Hata

`MytonCtrl` açılabilir, ancak düğüm düzgün çalışmayabilir. Lütfen `MytonCtrl`'yi bilgisayarınızdan kaldırın ve yeniden yükleyin, daha önce karşılaşılan hataları dikkate alarak.

## Ayrıca Bakınız

* `MyTonCtrl SSS`