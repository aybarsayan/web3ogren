---
title: SQLite İşlem Veritabanı Sayfa Boyutu Sorununu Düzeltme
seoTitle: SQLite Page Size Issue Resolution for Rippled Servers
sidebar_position: 4
description: SQLite sayfa boyutu sorunu, rippled sunucusu için çeşitli sorunlara yol açabilir. Bu belge, sorunun tespit edilmesi ve düzeltilmesi için gerekli adımları açıklamaktadır.
tags: 
  - SQLite
  - rippled
  - veritabanı
  - sayfa boyutu
  - sorun düzeltme
  - işlem geçmişi
  - büyük veritabanı
keywords: 
  - SQLite
  - rippled
  - veritabanı
  - sayfa boyutu
  - sorun düzeltme
  - işlem geçmişi
  - büyük veritabanı
---

# SQLite İşlem Veritabanı Sayfa Boyutu Sorununu Düzeltme

Tam `defter tarihi` veya çok büyük bir işlem geçmişine sahip `rippled` sunucuları ve başlangıçta `rippled` sürüm 0.40.0'dan önce oluşturulmuş bir veritabanesi, sunucunun düzgün çalışmasını engelleyen SQLite veritabanı sayfa boyutu sorunu ile karşılaşabilir. Yalnızca son işlem geçmişini depolayan (varsayılan yapılandırma) ve veritabanı dosyaları `rippled` sürüm 0.40.0 ve sonrasında oluşturulan sunucuların bu sorunu yaşama olasılığı düşüktür.

Bu belge, bu sorunu tespit etme ve düzeltme adımlarını açıklar.

## Arka Plan

`rippled` sunucuları işlem geçmişinin bir kopyasını SQLite veritabanında saklar. Sürüm 0.40.0'dan önce, `rippled` bu veritabanını yaklaşık 2 TB kapasiteyle yapılandırdı. Çoğu kullanım için bu yeterlidir. Ancak, 32570'den (üretim XRP Ledger tarihindeki mevcut olan en eski defter versiyonu) tam işlem geçmişi, SQLite veritabanı kapasitesini aşma ihtimaline sahiptir. `rippled` sunucuları sürüm 0.40.0 ve sonrasında daha büyük kapasiteye sahip SQLite veritabanı dosyaları oluşturduğu için bu sorunla karşılaşma olasılığı düşüktür.

SQLite veritabanının kapasitesi, veritabanının _sayfa boyutu_ parametresinin bir sonucudur ve veritabanı oluşturulduktan sonra kolayca değiştirilemez. (SQLite'ın iç yapısı hakkında daha fazla bilgi için [resmi SQLite belgelendirmesine](https://www.sqlite.org/fileformat.html) bakın.) Veritabanı, depolandığı disk ve dosya sisteminde hâlâ boş alan olsa bile kapasitesine ulaşabilir. Aşağıdaki `Düzeltme` bölümünde açıklandığı gibi, bu sorunu önlemek için sayfa boyutunu yeniden yapılandırmak, zaman alıcı bir göç süreci gerektirir.

:::tip 
**İpucu:** Tam tarihçe çoğu kullanım durumu için gerekli değildir. Tam işlem geçmişine sahip sunucular, uzun vadeli analiz ve arşiv amaçları için veya felaketlere karşı bir önlem olarak yararlı olabilir. İşlem tarihinin depolanmasına daha az kaynak yoğun bir katkıda bulunmak için `Tarih Dilimleme` konusuna bakın.
:::

## Tespit

Sunucunuz bu soruna karşı savunmasızsa, iki şekilde tespit edebilirsiniz:

- `rippled` sunucunuz sürüm 1.1.0 veya daha yeni ise, sorunu `proaktif` olarak (sorunlar ortaya çıkmadan önce) tespit edebilirsiniz.
- Herhangi bir `rippled` sürümünde (sunucunuz çökünce) sorunu `reaktif` olarak belirleyebilirsiniz.

Her iki durumda da, sorunun tespiti için `rippled` sunucusunun günlüklerine erişim gereklidir.

:::tip 
**İpucu:** Debug günlüklerinin yeri, `rippled` sunucunuzun yapılandırma dosyasına bağlıdır. [Varsayılan yapılandırma](https://github.com/XRPLF/rippled/blob/master/cfg/rippled-example.cfg#L1139-L1142), sunucunun debug günlüklerini `/var/log/rippled/debug.log` dosyasına yazar.
:::

### Proaktif Tespit

SQLite sayfa boyutu sorununu proaktif olarak tespit etmek için **`rippled` 1.1.0 veya daha yeni** bir sürüm çalıştırmalısınız. `rippled` sunucusu, debug günlüğünde aşağıdaki gibi bir mesajı belli aralıklarla, en az her 2 dakikada bir yazar. (Günlük girişi ile ilgili tam sayısal değerler ve işlem veritabanınıza giden yol, ortamınıza bağlıdır.)

> Transaction DB pathname: /opt/rippled/transaction.db; SQLite page size: 1024 bytes; Free pages: 247483646; Free space: 253423253504 bytes; Note that this does not take into account available disk space.  
> — `rippled` Debug Log

Değer `SQLite page size: 1024 bytes` ise, işlem veritabanınız daha küçük bir sayfa boyutu ile yapılandırılmıştır ve tam işlem geçmişi için kapasitesi yoktur. Değer zaten 4096 bayt veya daha üstünde ise, SQLite veritabanınız zaten tam işlem geçmişini saklamak için yeterli kapasiteye sahiptir ve bu belgede açıklanan göç sürecini gerçekleştirmenize gerek yoktur.

`rippled` sunucusu, bu günlük mesajında açıklanan `Free space` 524288000 bayttan (500 MB) az olduğunda durur. Eğer boş alanınız bu eşiğe yaklaşıyorsa, `sorunu düzeltin` ve beklenmedik bir kesintiden kaçının.

### Reaktif Tespit

Eğer sunucunuzun SQLite veritabanı kapasitesi aşılmışsa, `rippled` servisi sorunu belirten bir günlük mesajı yazar ve durur.

#### rippled 1.1.0 ve Sonrası

`rippled` sürüm 1.1.0 ve sonrasında, sunucu aşağıdaki gibi bir mesaj ile birlikte düzgün bir şekilde kapanır:

> Free SQLite space for transaction db is less than 512MB. To fix this, rippled must be executed with the vacuum parameter before restarting. Note that this activity can take multiple days, depending on database size.  
> — `rippled` Debug Log

#### rippled 1.1.0'dan Önce

`rippled` sürümleri 1.1.0'dan önce, sunucu sürekli olarak aşağıdaki gibi mesajlar ile çökerek durur:

> Terminating thread doJob: AcquisitionDone: unhandled N4soci18sqlite3_soci_errorE 'sqlite3_statement_backend::loadOne: database or disk is full while executing "INSERT INTO [...]'  
> — `rippled` Debug Log

## Düzeltme

Bu durumu düzeltmek için `rippled`'i desteklenen Linux sistemlerinde kullanım adımlarını takip edebilirsiniz. Tam tarih sunucusu olduğunda, sistem özellikleri yaklaşık olarak `önerilen donanım yapılandırması` ile eşleşiyorsa, bu süreç iki tam günden fazla sürebilir.

### Ön Koşullar

- **`rippled` sürüm 1.1.0 veya daha yeni** çalıştırıyor olmalısınız.

    - Bu sürece başlamadan önce `rippled sürümünü` en son kararlı sürüme yükseltin.

    - `rippled`'in bilgisayarınıza hangi sürümünü yüklediğinizi kontrol etmek için aşağıdaki komutu çalıştırabilirsiniz:

        ```
        rippled --version
        ```

- İşlem veritabanının ikinci bir kopyasını geçici olarak saklayacak kadar boş alana sahip olmalısınız, bu alan `rippled` kullanıcısının yazma iznine sahip olduğu bir dizinde olmalıdır. Bu boş alanın mevcut işlem veritabanıyla aynı dosya sisteminde olması gerekmez.

    İşlem veritabanı, yapılandırmanızın `[database_path]` ayarı ile belirtilen klasörde `transaction.db` dosyasında saklanır. Bu dosyanın boyutunu kontrol ederek ne kadar boş alana ihtiyacınız olduğunu görebilirsiniz. Örneğin:

    ```
    ls -l /var/lib/rippled/db/transaction.db
    ```

### Göç Süreci

İşlem veritabanınızı daha büyük bir sayfa boyutuna geçirmek için aşağıdaki adımları takip edin:

1. Tüm `ön koşulları` karşıladığınızdan emin olun.

2. Göç süreci sırasında geçici dosyaları saklamak için bir klasör oluşturun.

    ```
    mkdir /tmp/rippled_txdb_migration
    ```

3. `rippled` kullanıcısına geçici klasörün sahibini verin, böylece oraya dosya yazabilir. (Eğer geçici klasörünüz `rippled` kullanıcısının zaten yazma iznine sahip olduğu bir yerdeyse, bu gerekli değildir.)

    ```
    chown rippled /tmp/rippled_txdb_migration
    ```

4. Geçici klasörünüzün, işlem veritabanı kopyasını saklamak için yeterli boş alana sahip olduğunu doğrulayın.

    Örneğin, `df` komutunun `Avail` çıktısını, `transaction.db dosyanızın boyutu` ile karşılaştırın.

    ```
    df -h /tmp/rippled_txdb_migration

    Filesystem      Size  Used Avail Use% Mounted on
    /dev/sda2       5.4T  2.6T  2.6T  50% /tmp
    ```

5. Eğer `rippled` hâlâ çalışıyorsa, durdurun:

    ```
    sudo systemctl stop rippled
    ```

6. Oturum kapandığınızda işlem durmaması için bir `screen` oturumu açın (veya başka bir benzer araç):

    ```
    screen
    ```

7. `rippled` kullanıcısı olun:

    ```
    sudo su - rippled
    ```

8. Geçici dizinin yolunu vererek `--vacuum` komutuyla `rippled` executable'ını direkt olarak çalıştırın:

    ```
    /opt/ripple/bin/rippled -q --vacuum /tmp/rippled_txdb_migration
    ```

    `rippled` executable'ı hemen aşağıdaki mesajı gösterir:

    ```
    VACUUM beginning. page_size: 1024
    ```

9. Sürecin tamamlanmasını bekleyin. Bu iki tam günden fazla sürebilir.

    Süreç tamamlandığında, `rippled` executable'ı aşağıdaki mesajı gösterir ve ardından çıkar:

    ```
    VACUUM finished. page_size: 4096
    ```

    Beklerken, `screen` oturumunuzu **CTRL-A**, ardından **D** tuşlarına basarak ayırabilirsiniz. Daha sonra oturumu yeniden bağlamak için aşağıdaki gibi bir komut kullanabilirsiniz:

    ```
    screen -x -r
    ```

    Süreç bittiğinde, ekran oturumından çıkın:

    ```
    exit
    ```

    `screen` komutu hakkında daha fazla bilgi için [resmi Screen Kullanıcı Kılavuzuna](https://www.gnu.org/software/screen/manual/screen.html) veya çevrimiçi birçok diğer kaynağa bakabilirsiniz.

10. `rippled` hizmetini yeniden başlatın.

    ```
    sudo systemctl start rippled
    ```

11. `rippled` hizmetinin başarıyla başladığından emin olun.

    Sunucu durumunu kontrol etmek için `komut satırı arayüzünü` kullanabilirsiniz (sunucunuzu JSON-RPC isteklerini kabul etmeyecek şekilde yapılandırmadıysanız). Örneğin:

    ```
    /opt/ripple/bin/rippled server_info
    ```

    Bu komutun beklenen yanıtı hakkında daha fazla bilgi için [server_info yöntemi][] belgelerine bakın.

12. Sunucunun debug günlüğünü izleyerek `SQLite page size` değerinin artık 4096 olduğunu doğrulayın:

    ```
    tail -F /var/log/rippled/debug.log
    ```

    `Periyodik günlük mesajı` da artık göç öncesinden çok daha fazla boş sayfa göstermelidir.

13. İsterseniz, şimdi göç süreci için oluşturduğunuz geçici klasörü kaldırabilirsiniz.

    ```
    rm -r /tmp/rippled_txdb_migration
    ```

    Eğer işlem veritabanının geçici kopyasını saklamak için ek bir depolama alanı eklediyseniz, şimdi onu kaldırabilir ve çıkarabilirsiniz.

## Ayrıca Bakınız

- **Kavramlar:**
    - `rippled` Sunucusu`
    - `Defter Tarihi`
- **Eğitimler:**
    - `Günlük Mesajlarını Anlamak`
    - `Tam Tarih Yapılandırması`
- **Kaynaklar:**
    - `rippled API Referansı`
        - `rippled` Komut Satırı Kullanımı`
        - [server_info yöntemi][]