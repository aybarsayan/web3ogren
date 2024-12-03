---
title: rippled Sunucusu Başlamıyor
seoTitle: rippled Sunucusu Sorun Giderme
sidebar_position: 1
description: Bu sayfa, rippled sunucusunun neden başlamadığını ve bu sorunları nasıl düzeltebileceğinizi açıklamaktadır.
tags: 
  - rippled
  - sunucu
  - yapılandırma
  - sorun giderme
keywords: 
  - rippled
  - sunucu
  - hata
  - yapılandırma
  - sorun giderme
---

## rippled Sunucusu Başlamıyor

Bu sayfa, `rippled` sunucusunun neden başlamadığını ve bunları nasıl düzeltebileceğinizi açıklamaktadır.

:::info
Bu talimatlar, `rippled`'in desteklenen bir platformda kurulu olduğunu varsayar.
:::

## Dosya Tanımlayıcıları Sınırı

Bazı Linux sürümlerinde, `rippled` çalıştırılmaya çalışıldığında aşağıdaki gibi bir hata mesajı alabilirsiniz:

```text
WARNING: Sadece 1024 dosya tanımlayıcısı (yumuşak limit) mevcut; bu da
eşzamanlı bağlantı sayısını sınırlıyor.
```

Bu, sistemin tek bir sürecin açabileceği dosya sayısında bir güvenlik sınırı olduğu için gerçekleşir, ancak sınır `rippled` için çok düşük ayarlanmıştır. Sorunu düzeltmek için, **root erişimi gereklidir**. `rippled`'in açmasına izin verilen dosya sayısını artırmak için aşağıdaki adımları izleyin:

1. `/etc/security/limits.conf` dosyanızın sonuna aşağıdaki satırları ekleyin:

    ```
    *                soft    nofile          65536
    *                hard    nofile          65536
    ```

2. Şu anda açılabilen dosya sayısı üzerindeki [sert sınırı kontrol edin](https://ss64.com/bash/ulimit.html):

    ```
    ulimit -Hn
    ```

    Komut `65536` döndürmelidir.

3. `rippled`'i tekrar başlatmayı deneyin.

    ```
    systemctl start rippled
    ```

4. Eğer `rippled` hala başlamıyorsa, `/etc/sysctl.conf` dosyasını açın ve aşağıdaki çekirdek düzeyi ayarını ekleyin:

    ```
    fs.file-max = 65536
    ```

---

## /etc/opt/ripple/rippled.cfg Açılmadı

Eğer `rippled` başlatma sırasında aşağıdaki gibi bir hatayla çöküyorsa, bu `rippled`'in yapılandırma dosyasını okuyamadığı anlamına gelir:

```text
Loading: "/etc/opt/ripple/rippled.cfg"
Failed to open '"/etc/opt/ripple/rippled.cfg"'.
Terminating thread rippled: main: unhandled St13runtime_error 'Can not create "/var/opt/ripple"'
Aborted (core dumped)
```

Olası çözümler:

- Yapılandırma dosyasının mevcut olduğunu kontrol edin (varsayılan konum `/etc/opt/ripple/rippled.cfg`) ve `rippled` sürecinizi çalıştıran kullanıcının (genellikle `rippled`) dosyayı okuma iznine sahip olduğundan emin olun.

- `rippled` kullanıcısı tarafından okunabilen bir yapılandırma dosyası oluşturun: `$HOME/.config/ripple/rippled.cfg` (burada `$HOME`, `rippled` kullanıcısının ev dizinini gösterir).

    :::tip
    `rippled` deposu, RPM kurulumu yaptığınızda varsayılan yapılandırma olarak sağlanan [bir örnek `rippled.cfg` dosyası](https://github.com/XRPLF/rippled/blob/master/cfg/rippled-example.cfg) içermektedir. Eğer dosyanız yoksa, oradan kopyalayabilirsiniz.
    :::

- Tercih ettiğiniz yapılandırma dosyasının yolunu `--conf` `komut satırı seçeneği` ile belirtin.

---

## Doğrulayıcılar dosyası açılamadı

Eğer `rippled` başlatma sırasında aşağıdaki gibi bir hata ile çöküyorsa, bu ana yapılandırma dosyasını okuyabildiği ancak bu yapılandırma dosyasının `rippled`'in okuyamadığı ayrı bir doğrulayıcılar yapılandırma dosyasını (tipik olarak `validators.txt` adında) belirttiği anlamına gelir.

```text
Loading: "/home/rippled/.config/ripple/rippled.cfg"
Terminating thread rippled: main: unhandled St13runtime_error 'The file specified in [validators_file] does not exist: /home/rippled/.config/ripple/validators.txt'
Aborted (core dumped)
```

Olası çözümler:

- `[validators.txt]` dosyasının mevcut olduğunu ve `rippled` kullanıcısının onu okuma iznine sahip olduğunu kontrol edin.

    :::tip
    `rippled` deposu, RPM kurulumu yaptığınızda varsayılan yapılandırma olarak sağlanan [bir örnek `validators.txt` dosyası](https://github.com/XRPLF/rippled/blob/master/cfg/validators-example.txt) içermektedir. Eğer dosyanız yoksa, oradan kopyalayabilirsiniz.
    :::

- `rippled.cfg` dosyanızı düzenleyin ve `[validators_file]` ayarını `validators.txt` (veya eşdeğer) dosyanızın doğru yolu ile güncelleyin. Dosya adından önce veya sonra ekstra boşluk olup olmadığını kontrol edin.

- `rippled.cfg` dosyanızı düzenleyin ve `[validators_file]` ayarını kaldırın. Doğrulayıcı ayarlarını doğrudan `rippled.cfg` dosyanıza ekleyin. Örneğin:

    ```
    [validator_list_sites]
    https://vl.ripple.com

    [validator_list_keys]
    ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734
    ```

---

## Veritabanı yolunu oluşturamadı

Eğer `rippled` başlatma sırasında aşağıdaki gibi bir hata ile çöküyorsa, bu sunucunun yapılandırma dosyasındaki `[database_path]`'a yazma izni olmadığı anlamına gelir.

```text
Loading: "/home/rippled/.config/ripple/rippled.cfg"
Terminating thread rippled: main: unhandled St13runtime_error 'Can not create "/var/lib/rippled/db"'
Aborted (core dumped)
```

Yapılandırma dosyası (`/home/rippled/.config/ripple/rippled.cfg`) ve veritabanı yolu (`/var/lib/rippled/db`) yolları sisteminize bağlı olarak değişebilir.

Olası çözümler:

- Hata mesajında belirtilen veritabanı yoluna yazma iznine sahip olan farklı bir kullanıcı olarak `rippled`'i çalıştırın.

- `rippled.cfg` dosyanızı düzenleyin ve `[database_path]` ayarını `rippled` kullanıcısının yazma iznine sahip olduğu bir yol kullanacak şekilde değiştirin.

- `rippled` kullanıcısına yapılandırılmış veritabanı yoluna yazma izni verin.

---

## Durum DB Hatası

`rippled` sunucusunun durum veritabanı bozulursa aşağıdaki hata meydana gelebilir. Bu, beklenmedik bir şekilde kapandığında veya veritabanı türünü RocksDB'den NuDB'ye değiştirirken yapılandırma dosyasındaki `path` ve `[database_path]` ayarlarını değiştirmediğinizde meydana gelebilir.

```text
2018-Aug-21 23:06:38.675117810 SHAMapStore:ERR state db error:
  writableDbExists false archiveDbExists false
  writableDb '/var/lib/rippled/db/rocksdb/rippledb.11a9' archiveDb '/var/lib/rippled/db/rocksdb/rippledb.2d73'

To resume operation, make backups of and remove the files matching /var/lib/rippled/db/state* and contents of the directory /var/lib/rippled/db/rocksdb

Terminating thread rippled: main: unhandled St13runtime_error 'state db error'
```

Bu sorunu çözmenin en kolay yolu, veritabanlarını tamamen silmektir. Onları başka bir yere yedeklemeyi düşünebilirsiniz. Örneğin:

```sh
mv /var/lib/rippled/db /var/lib/rippled/db-bak
```

Ya da, veritabanlarına ihtiyacınız olmadığından eminseniz:

```sh
rm -r /var/lib/rippled/db
```

:::tip
`rippled` veritabanlarını silmek genellikle güvenlidir, çünkü herhangi bir bireysel sunucu, XRP Ledger ağı içindeki diğer sunuculardan defter geçmişini yeniden indirebilir.
:::

Alternatif olarak, yapılandırma dosyasındaki veritabanı yollarını değiştirebilirsiniz. Örneğin:

```
[node_db]
type=NuDB
path=/var/lib/rippled/custom_nudb_path

[database_path]
/var/lib/rippled/custom_sqlite_db_path
```

---

## Çevrimiçi Silme, Defter Geçmişinden Daha Küçük

Aşağıdaki gibi bir hata mesajı, `rippled.cfg` dosyasının `[ledger_history]` ve `online_delete` için çelişkili değerler içerdiğini gösterir.

```text
Terminating thread rippled: main: unhandled St13runtime_error 'online_delete must not be less than ledger_history (currently 3000)
```

`[ledger_history]` ayarı, sunucunun geri doldurmaya çalışacağı defter geçmişinin ne kadarını temsil eder. `online_delete` alanı (`[node_db]` bloğundaki) eski geçmişi silerken saklanacak defterlerin sayısını belirtir. `online_delete` değeri, sunucunun silmeye çalıştığı tarihli defterlerin silinmesini önlemek için `[ledger_history]` ile eşit veya daha büyük olmalıdır.

Sorunu düzeltmek için, `rippled.cfg` dosyasını düzenleyin ve ya `[ledger_history]` ya da `online_delete` seçeneklerini değiştirin veya kaldırın. (Eğer `[ledger_history]`'yi atlarsanız, 256 defter versiyonunu kullanan varsayılan bir değerdir. Eğer `online_delete` alanını belirtirseniz, bu 256'dan büyük olmalıdır. Eğer `online_delete`'yi atlarsanız, eski defter versiyonlarının otomatik silinmesini devre dışı bırakır.)

---

## Hatalı node_size değeri

Aşağıdaki gibi bir hata, `rippled.cfg` dosyasının `node_size` ayarı için yanlış bir değeri içerdiğini gösterir:

```text
Terminating thread rippled: main: unhandled N5beast14BadLexicalCastE 'std::bad_cast'
```

`node_size` alanı için geçerli parametreler `tiny`, `small`, `medium`, `large` veya `huge`dir. Daha fazla bilgi için `Node Size` bölümüne bakın.

---

## Shard yolu eksik

Aşağıdaki gibi bir hata, `rippled.cfg` dosyasının eksik bir `tarih parçalama` yapılandırması içerdiğini gösterir:

```text
Terminating thread rippled: main: unhandled St13runtime_error 'shard path missing'
```

Yapılandırmanız `[shard_db]` bloğunu içeriyorsa, `rippled`'in parçalama deposu için veri yazabileceği bir dizini işaret eden bir `path` alanı içermelidir. Bu hata, `path` alanının eksik veya yanlış yerde olduğunu gösterir. Yapılandırma dosyanızda ekstra boşluk veya yazım hatası olup olmadığını kontrol edin ve `Shard Yapılandırma Örneği` ile karşılaştırın.

---

## Desteklenmeyen parça deposu türü: RocksDB

RocksDB, artık `tarih parçalama` için bir arka uç olarak desteklenmemektedir. Eğer mevcut bir yapılandırmanız RocksDB parça deposunu tanımlıyorsa, sunucu başlamaz.

Bu durumda, süreç, güncel log başlangıç komutundan hemen sonra kapanır ve çıktı logunda aşağıdaki gibi bir hata mesajı görünür:

```text
ShardStore:ERR Unsupported shard store type: RocksDB
```

Bu sorunu düzeltmek için, aşağıdakilerden birini yapın ve ardından sunucuyu yeniden başlatın:

- Parça deponuzu NuDB kullanacak şekilde değiştirin.
- Tarih parçalamayı devre dışı bırakın.

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `rippled` Sunucusu
    - `Teknik SSS`
- **Eğitimler:**
    - `Log Mesajlarını Anlamak`
    - `Kapasite Planlaması`
- **Referanslar:**
    - `rippled API Referansı`
        - `rippled` Komut Satırı Kullanımı
        - [server_info yöntemi][]