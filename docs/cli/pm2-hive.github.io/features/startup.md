---
description: PM2'nin başlangıç scriptleri ile süreçlerin otomatik olarak yeniden başlatılmasını sağlayın. Sunucu yeniden başlatıldığında uygulamaların stabil kalmasını garanti altına alın.
keywords: [PM2, başlangıç scripti, süreç yönetimi, otomatik başlatma, server yönetimi]
---

# Kalıcı uygulamalar: Başlangıç Scripti Üretici

PM2, süreç listenizin beklenen veya beklenmeyen makine yeniden başlatmaları sırasında intact kalmasını sağlamak için başlangıç scriptleri oluşturabilir ve yapılandırabilir.

- **systemd**: Ubuntu >= 16, CentOS >= 7, Arch, Debian >= 7
- **upstart**: Ubuntu  -u --hp
```

Ardından görüntülenen komutu terminale kopyalayıp yapıştırın:

```bash
sudo su -c "env PATH=$PATH:/home/unitech/.nvm/versions/node/v14.3/bin pm2 startup <distribution> -u  --hp
```

> **Not**: Artık PM2 otomatik olarak açılışta yeniden başlayacaktır.

**Not**: Servis adını `--service-name ` opsiyonu ile özelleştirebilirsiniz ([#3213](https://github.com/Unitech/pm2/pull/3213))

### Yeniden başlatıldığında geri yüklenmek üzere uygulama listesini kaydetme

Tüm istediğiniz uygulamaları başlattıktan sonra, uygulama listesini kaydedin böylece yeniden başlatma sonrasında geri yüklenir:

```bash
pm2 save
```

### Süreçleri manuel olarak yeniden canlandırma

Daha önce kaydedilmiş süreçleri (pm2 save aracılığıyla) manuel olarak geri getirmek için:

```bash
pm2 resurrect
```

### Başlangıç sistemini devre dışı bırakma

Mevcut başlangıç yapılandırmasını devre dışı bırakmak ve kaldırmak için:

```bash
pm2 unstartup
```

Önceki kod satırı PM2'nin platformunuzu tespit etmesine olanak tanır. Alternatif olarak, kendiniz başka belirtilmiş bir init sistemi kullanabilirsiniz:

#### Node.js sürüm yükseltmeden sonra başlangıç scriptini güncelleme

Yerel Node.js sürümünü yükselttiğinizde, PM2 başlangıç scriptini güncellemeyi unutmayın, böylece kurulu en son Node.js ikili dosyasını çalıştırır.

Öncelikle mevcut başlangıç yapılandırmasını devre dışı bırakın ve kaldırın (bu komutun çıktısını kopyalayın):

```bash
$ pm2 unstartup
```

Ardından taze bir başlangıç scripti geri yükleyin:

```bash
$ pm2 startup
```

#### Kullanıcı izinleri

Başlangıç scriptinin başka bir kullanıcı altında çalıştırılmasını istiyorsanız.

Sadece `-u ` opsiyonunu ve `--hp `'u değiştirin:

```bash
pm2 startup ubuntu -u www --hp /home/ubuntu
```

#### Init sistemini belirtme

Kullanmakta olduğunuz platformu kendiniz belirtebilirsiniz (platform yukarıda belirtilenlerden biri olabilir):
```
pm2 startup [ubuntu | ubuntu14 | ubuntu16 | ubuntu18 | ubuntu20 | ubuntu12 | centos | centos6 | arch | oracle | amazon | macos | darwin | freebsd | systemd | systemv | upstart | launchd | rcd | openrc]
```

#### SystemD kurulumunu kontrol etme

```bash
# pm2- servisinin eklenip eklenmediğini kontrol edin
$ systemctl list-units
# Logları kontrol et
$ journalctl -u pm2
# Systemd yapılandırma dosyasını göster
$ systemctl cat pm2
# Başlangıcı analiz et
$ systemd-analyze plot  output.svg
```

Makinenin çevrimiçi olmasını beklemek için PM2'nin çalışması için verimli bir şekilde:

```
[Unit]
Wants=network-online.target
After=network.target network-online.target

[....]

[Install]
WantedBy=multi-user.target network-online.target
```

#### Windows başlangıç scripti

Windows uyumlu bir başlangıç scripti oluşturmak için mükemmel [pm2-installer](https://github.com/jessety/pm2-installer) kütüphanesine göz atın.

#### Desteklenen init sistemleri

- **systemd**: Ubuntu >= 16, CentOS >= 7, Arch, Debian >= 7
- **upstart**: Ubuntu <= 14
- **launchd**: Darwin, MacOSx
- **openrc**: Gentoo Linux, Arch Linux
- **rcd**: FreeBSD
- **systemv**: Centos 6, Amazon Linux

Bu init sistemleri, `pm2 startup` komutuyla PM2 tarafından otomatik olarak algılanır.