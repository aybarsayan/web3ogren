---
title: rippled Sunucusu Senkronize Olmuyor
seoTitle: XRP Ledger ile Senkronize Olmayan rippled Sunucusu Sorun Giderme
sidebar_position: 4
description: Bir rippled sunucusunun ağa senkronize olmamasının olası nedenlerini ve çözüm yollarını ele alın. Bu kılavuz, kullanıcıların sorunları daha iyi anlamalarına yardımcı olmayı amaçlamaktadır.
tags: 
  - rippled
  - senkronizasyon
  - XRP Ledger
  - sorun giderme
  - veritabanı
keywords: 
  - rippled
  - senkronizasyon
  - XRP Ledger
  - sorun giderme
  - veritabanı
---

## rippled Sunucusu Senkronize Olmuyor

Bu sayfa, bir `rippled` sunucusunun başarıyla başlayabileceği, ancak asla ağa tam olarak bağlanmadan **"bağlı" durumda** takılı kalabileceği olası nedenleri açıklar. (Eğer sunucu, başlangıç sırasında veya hemen sonrasında çöküyorsa, `Sunucu Başlayamıyor` sayfasına bakın.)

Bu talimatlar, `yukarıdaki `rippled` yazılımının desteklenen bir platforma kurulu olduğunu varsayar.

## Normal Senkronizasyon Davranışı

Ağ ile senkronizasyon genellikle yaklaşık 5 ila 15 dakika sürer. Bu süre zarfında sunucu birkaç şey yapar:

- Hangi doğrulayıcıları güvenilir bulduğunu belirlemek için önerilen bir doğrulayıcı listesini (örneğin, `vl.ripple.com` üzerinden) yükler.
- `Eş sunucuları keşfeder` ve onlara bağlanır.
- Hangi defter hash'lerinin yakın zamanda doğrulandığını bulmak için güvenilir doğrulayıcılarını dinler.
- Eşlerden en son tam defteri indirir ve bunu kendi iç veritabanını oluşturmak için kullanır.
- Yeniden yayınlanan işlemleri toplar ve bunları devam eden defterine uygulamaya çalışır.

> Eğer sunucu bu görevleri yerine getirirken ağla senkronize olamıyorsa, sunucu ağa senkronize olmaz. — Dikkat!

## İlk Adım: Yeniden Başlatma

Birçok senkronizasyon sorunu sunucuyu yeniden başlatarak çözülebilir. İlk kez neden senkronize olamadığı önemli değil, ikinci denemede başarılı olabilir.

Eğer [server_info metodu][] `proposing` veya `full` dışında bir `server_state` gösteriyorsa ve `server_state_duration_us` `900000000`'dan (mikrosaniyede 15 dakika) fazla ise, `rippled` hizmetini kapatmalısınız, birkaç saniye bekleyin ve tekrar başlatın. İsteğe bağlı olarak, tüm makineyi yeniden başlatın.

:::tip
Eğer sorun devam ederse, bu sayfada listelenen diğer olasılıkları kontrol edin. 
:::

Eğer hiçbiri geçerli görünmüyorsa, [rippled deposunda bir sorun açın](https://github.com/XRPLF/rippled/issues) ve **"Senkronizasyon sorunu"** etiketini ekleyin.

## Senkronizasyon Sorunlarının Yaygın Nedenleri

Senkronizasyon sorunlarının en yaygın nedeni `sistem gereksinimlerini` karşılamamaktır. En yaygın üç eksiklik şunlardır:

- **Yavaş diskler.** Sürekli hızlı bir katı hal sürücüsüne (SSD) ihtiyacınız var. AWS gibi bulut sağlayıcıları genellikle disk performansını garanti etmez, çünkü bu diğer müşterilerle paylaşılan donanıma bağlıdır.
- **Yetersiz RAM.** Bellek gereksinimleri, önceden tahmin edilmesi zor olan ağ yükü ve XRP Ledger'ı kullanma biçimi gibi çeşitli faktörlere bağlı olarak değişir, bu yüzden minimum sistem gereksinimlerinin üzerinde daha fazla belleğe sahip olmak iyidir.
- **Kötü ağ bağlantısı.** Ağ gereksinimleri, insanların XRP Ledger'ı nasıl kullandığına bağlı olarak en çok değişir, ancak yavaş veya dengesiz bir bağlantı, yeni işlemler ve XRP Ledger'a eklenen verilerle güncel kalınmasını imkansız hale getirebilir.

Eğer senkronize kalmakta zorlanıyorsanız, sunucunuzun sistem gereksinimlerini karşıladığından emin olun. Sunucunuzu nasıl kullandığınıza bağlı olarak, daha yüksek **"Önerilen"** gereksinimleri karşılamanız gerekebilir. **"Önerilen"** gereksinimleri karşılıyorsanız ve hala senkronize olamıyorsanız, bu sayfadaki diğer olasılıkları deneyin.

---

## Doğrulayıcı Listesi Yüklenemedi

Varsayılan yapılandırma, `vl.ripple.com` adresinden alınan önerilen bir doğrulayıcı listesini kullanır. Bu liste, Ripple'ın kriptografik anahtar çiftinden imzalanmıştır ve yerleşik bir son kullanma tarihine sahiptir. Sunucunuz herhangi bir nedenle `vl.ripple.com` adresinden listeyi indiremiyorsa, sunucunuz güvenilir doğrulayıcı seti seçmez ve hangi olası defterlerin geçerli olduğunu belirleyemez. (Eğer `testnet veya başka bir paralel ağa` bağlıysanız, sunucunuz o ağ için güvenilir doğrulayıcılar listesini kullanır.)

[server_info metodu][] yanıtındaki `validator_list` bloğu, doğrulayıcı listenizin durumunu, süresinin sonunu gösterir. Eğer bir listeye sahipseniz, ancak süresi dolmuşsa, sunucunuzun doğrulayıcı listesi sitesine önce bağlanabildiği, ancak son zamanlarda bağlanamadığı mümkündür; bu durumda mevcut listeniz, sunucunuz daha güncel bir listeyi indiremeyecekken süresi dolmuştur.

:::warning
Daha ayrıntılı bilgi almak için [validator_list_sites metodu][]nu da kullanabilirsiniz. Eğer yanıtındaki doğrulayıcı site nesnelerindeki `last_refresh_status` ve `last_refresh_time` alanları eksikse, bu muhtemelen sunucunuzun doğrulayıcı listeye bağlanmakta zorluk çektiği anlamına gelir. Güvenlik duvarı yapılandırmanızı kontrol edin ve çıkış trafiğini 80 (HTTP) veya 443 (HTTPS) portlarında engellemediğinizden emin olun. Ayrıca, DNS'inizin doğrulayıcı liste site alanını çözümleyip çözümleyemediğini kontrol edin.
:::

## Yeterince Eş Sunucu Yok

Eğer sunucunuz yeterince **eş sunucuya** bağlanamazsa, ağ devam ederken yeni işlemleri indirmek için yeterli veriyi alamayabilir. Bu, eğer ağ bağlantınız güvenilmezse veya sunucunuzu **özel sunucu** olarak yapılandırdıysanız ve yeterince güvenilir sabit eş eklemediyseniz oluşabilir.

Sunucunuzun mevcut eşleri hakkında bilgi almak için [peers metodu][]nu kullanabilirsiniz. Eğer tam olarak 10 veya 11 eşiniz varsa, bu güvenlik duvarınızın gelen eş bağlantılarını engellediğini gösterebilir. Daha fazla gelen bağlantıya izin vermek için **port yönlendirmesi ayarlayın**. Eğer sunucunuz özel bir sunucu olarak yapılandırıldıysa, yapılandırma dosyanızdaki `[ips_fixed]` bölümünün içeriğini ve sözdizimini kontrol edin ve mümkünse daha fazla proxy veya genel hub ekleyin.

---

## Bozuk Veritabanları

Nadir durumlarda, `rippled` sunucusunun iç veritabanlarında kaydedilen bozuk veriler senkronize olamamasına neden olabilir. Sunucunuz çalışmadığı sürece, sunucunuzun veritabanlarını genellikle güvenle silebilirsiniz. Bozuk veriler, diske kopyalama veya yazma sırasında geçici bir donanım arızası, daha ciddi bir disk arızası, başka bir sürecin çökmesi ve diskin yanlış kısmına yazması veya diğer sorunlar ile sonuçlanabilir.

Test amacıyla, yeterli boş alanınız varsa sunucunuzun veritabanlarının yollarını geçici olarak değiştirebilirsiniz.

:::note
Veritabanı yollarını değiştirdiğinizde, sunucu bazı kaydedilmiş ayarları yüklemez; bu ayarların içinde sunucunun mevcut [node key pair][]'i ve **peer rezervasyonları** da bulunmaktadır. Veritabanı yollarını değiştirmek sunucunuzun senkronizasyon problemlerini çözerse, bu ayarlardan bazılarını yeniden oluşturmak isteyebilirsiniz.
:::

1. Eğer çalışıyorsa `rippled` sunucusunu durdurun.

    ```bash
    $ sudo systemctl stop rippled
    ```

2. Yeni boş klasörler oluşturarak taze veritabanlarını tutacak yer oluşturun.

    ```bash
    $ mkdir /var/lib/rippled/db_new/
    $ mkdir /var/lib/rippled/db_new/nudb
    ```

3. Yeni yolları kullanmak için yapılandırma dosyasını düzenleyin. `[node_db]` bölümündeki `path` alanını **ve** `[database_path]` bölümündeki değeri değiştirdiğinizden emin olun.

    ```bash
    [node_db]
    type=NuDB
    path=/var/lib/rippled/db_new/nudb

    [database_path]
    /var/lib/rippled/db_new
    ```

    partial file="/docs/_snippets/conf-file-location.md" /%}

4. `rippled` sunucusunu tekrar başlatın.

    ```bash
    $ sudo systemctl start rippled
    ```

    Sunucu taze veritabanlarıyla başarıyla senkronize olursa, eski veritabanlarını tutan klasörleri silebilirsiniz. Ayrıca, donanım arızalarını kontrol etmek isteyebilirsiniz, özellikle disk ve RAM için.

## Ayrıca Bakınız

- **Kavramlar:**
    - `The `rippled` Sunucusu`
    - `Eş Protokolü`
    - `Teknik SSS`
- **Kılavuzlar:**
    - `Log Mesajlarını Anlamak`
    - `Kapasite Planlama`
- **Referanslar:**
    - `rippled API Referansı`
        - [peers metodu][]
        - [server_info metodu][]
        - [validator_list_sites metodu][]
        
