---
title: Yeoman Insight
description: Yeoman Insight, Yeoman CLI tarafından projeye ait kullanım verilerini toplayan ve raporlayan bir araçtır. Bu içerikte, metrik raporlama sürecinin detayları ve önemli bilgiler yer almaktadır.
keywords: [Yeoman, CLI, metrikler, Google Analytics, kullanım verileri, raporlama]
---

## Genel Bakış

Yeoman Insight, Yeoman CLI tarafından kullanılan metrik raporlama aracıdır ve projeye ait toplam kullanım verilerini kaydeder ve raporlar. İlk günden itibaren (sıfır noktasından başlayarak), metrik odaklı olmaya kararlıyız. **İnsanların aracımızla neler yaptığını görmek**, projenin başarısını ölçmemize ve gelecekteki yönünü belirlememize yardımcı olacaktır.

---

## Ölçülecek Şeyler

İyi metriklerle cevaplayabileceğimiz birçok yararlı soru var:

- **İndirme sayısı**
  - Kullanıcılar Yeoman'ı komut satırından yükler (`$ curl -L get.yeoman.io | bash`). CLI ilk kez çalıştırıldığında bir "indirme" sayfası görüntüsü kaydediyoruz. Bu esasen yüklemelerin sayısıyla eşdeğerdir. Kullanıcıların yükleme komutunu verip bir yeoman görevini hiç çalıştırmaları olası değildir.
  - :::note GitHub, proje sayfasından # .zip/.tar.gz indirmelerini takip etmenin bir yolunu sağlamaz.
  
- **7, 14, 30 günlük aktifiz**
- **Son 30 günde kaç kişi proje oluşturdu?**
- **Hangi komutlar/eylemler en kullanışlıdır? Hangileri en az popüler?**
- **Hangi bölgeler aracı kullanıyor?**
- **Geliştiricilerin yeni bir sürüme geçmesi ne kadar sürüyor?**
- **İnsanlar hangi JS çatılarını kullanıyor?**
- Hayal edin: Yeoman v2.0'ı @ AwesomeConf JS 2013'te duyurduk. Tabii ki Hacker News tarafından alındı! Pssht. Ama... kaç yeni yükleme yaptık?

Görünüşe göre, [Google Analytics](http://www.google.com/analytics/) bu durumların tümüyle başa çıkmak için mükemmeldir.

---

## Toplama İş Akışı

### Backend

Google Analytics, çoğu ihtiyacımızı karşılıyor. Herhangi bir uygulama türünün (mobil, web sayfası olmayan özellikler, yüklü uygulamalar vb.) verileri Analytics'e gönderip işlenmesine izin vermek için tasarlanmıştır.  Mevcut API ile benzer şekilde çalışır, tek farkla ki çerezler artık gerekli değildir.

Kendi toplama sunucumuzu App Engine'de oluşturmaktan ziyade Analytics kullanmanın birçok faydası vardır. Belki de en büyüğü: **verileri kendimizin işlemesine gerek olmaması.**

### yeomaninsight.py

`yeomaninsight.py`, `/cli/bin` klasöründe bulunan işlemin beyin kısmıdır:

    ├── bin
    │   └── yeomaninsight.py
    │   └── …

> *Not: /metrics, Analytics arka uç olarak seçilmeden önce App Engine Python uygulaması olarak kuruldu. Bu aşamada ayrı bir sunucuya ihtiyacımız yok, ancak bir gün Yeoman için bir gösterge paneli oluşturma kararı alırsak kodumuz mevcut.*

Bu script, kullanıcıların a.) "yeoman*" yazıp otomatik tamamlama ile scripti görmesini engellemek ve b.) scripti doğrudan çalıştırmasını önlemek için global olarak `_yeomaninsight` takma adıyla yüklenmiştir. Script, kullanım verilerini toplama, saklama ve Google Analytics'e gönderme konusunda sorumludur.

`_yeomaninsight`, `/cli/lib/plugins/insight.py` tarafından çağrılır ve CLI ilk kez çalıştırıldığında ana dizinde (`~/.yeoman/insight/`) bir klasör oluşturur ve kullanıcıdan anonim metrikleri göndermeye katılmayı istemektedir.

### Eylemlerin Kaydedilmesi

Kullanıcılar Yeoman CLI komutlarını çalıştırdığında, CLI, `yeomaninsight.py`'nin kayıt API'sini çağırarak verilen [alt]komutları yakalar. Yüklenmiş paket versiyonu ve adı da bayraklar olarak geçilir. yeomaninsight.py ardından görevi bir çevrimdışı günlük dosyası olan .log'a yazar (ilk `yeomaninsight.py` çalıştırıldığında oluşturulur). Dosyanın formatı:

    CLIENTID
    TIMESTAMP command
    TIMESTAMP command subcommand
    …

Bu dosya, kullanıcının ana dizine (`~/.yeoman/insight/.log`) oluşturulur ve kaydedilir.

#### Örnek çalışma:

    $ yeoman init
        -> çağrılır "_yeomaninsight -n yeoman -v 0.9.3 record init"

Bu, .log dosyasını oluşturur, ilk çalıştırmada indirmeyi kaydeder ve komutu ekler:


Dizin yapısı.log

├── ~/.yeoman/insight/
│   └── .log


1336617026.860.421519437366
1336617031.37 /downloaded
1336617031.37 /init




Daha karmaşık bir komut çalıştırmak da mümkündür:

    $ yeoman add model MyModel
        -> çağrılır "_yeomaninsight.py -n yeoman -v 0.9.3 record add model myModel"

    .log şunları içerir:
    1336617026.860.421519437366
    1336630501.37 /add/model

Dikkat edin ki:

1. Boşlukla ayrılmış komutlar, sahte bir URL yolu oluşturmak için "/" ile birleştirilir. Bu, Analytics'te kaydedilecek bir sayfa görüntüsü simüle eder.
- Oluşturulacak modelin adı gibi kişiselleştirilmiş bilgiler ("myModel") kaydedilmez veya gönderilmez.

#### Neden bir günlük dosyası?

Eylemleri .log dosyasında saklamanın alternatifi, komutlar verildiğinde Analytics'e canlı talepler göndermektir. Bu yaklaşımın ana dezavantajı, aracın çevrimdışı kullanılamamasıdır. Uçakta Yeoman kullanmak istiyorum, dostum!

### Verileri Gönderme

`yeomaninsight.py`, günlük verilerini Analytics'e göndermekten de sorumludur. Her çalıştırılan komutla verileri gönderme girişiminde bulunuruz. Bir bağlantı yoksa, veriler .log dosyasına kaydedilir ve başarılı bir Analytics isteği yapılana kadar saklanmaya devam eder. Bu, birinin CLI'yi bir kez çalıştırıp birkaç saat boyunca kullanmamasını mümkün kılar. Sorun değil. Günlük dosyasındaki zaman damgası, Analytics'e yapılan istek ile birlikte gönderilir, bu da daha eski sonuçların doğru işlenmesini sağlar.

> *Not: Analytics, geçmiş verileri gönderebileceğiniz 24 saatlik bir maksimum süresi vardır. Eğer bir kullanıcı veriye sahipse ve bu sürenin sona ermesinden sonra yeoman çalıştırırsa, bu hareketleri kaybederiz. Bu konuda yapılacak bir şey yok. Bu, Analytic arka ucunun bir sınırlamasıdır.*

Veriler işlendiğinde, günlük dosyasından hemen kaldırılırlar.

#### Analytics İstek Formatı

Bir komut, Analytics'te "sayfa görüntüsü" olarak kaydedilir. yeomaninsight.py, ilgili parametreler ile birlikte Analytics uç noktasına GET istekleri yapar.

#### Örnek

Eric, 4 saattir ilk kez Yeoman'ı açıyor ve birkaç komut çalıştırıyor:

    $ yeoman install jquery
        -> çağrılır "_yeomaninsight.py -n yeoman -v 0.9.3 record install jquery"
    $ yeoman install angular
        -> çağrılır "_yeomaninsight.py -n yeoman -v 0.9.3 record install angular"

CLI, bu girişlerin her birini kaydeder ve Analytics'e gönderir. Bu, günlük dosyasındaki her şeyi yükleyen `_send_all()` çağrısını başlatır. Kullanıcı çevrimdışıyken (ilk Analytics isteği başarısız olduğunda) yükleme tetiklendiğinde, mevcut günlük verisi korunur ve CLI'nin çevrimiçi olduğu bir sonraki çalıştırma çevrimdışıyken saklanır.

Tüm veriler gönderildiğinde, `.log` eski verilerden arındırılır, ancak Kullanıcı ID'si korunur:

    1336617026.860.421519437366

### Gizlilik

Uygulamamız Google Analytics'i kullanır. Daha fazla bilgi için [TOS/Gizlilik Politikasına](http://www.google.com/analytics/learn/privacy.html) bakabilirsiniz (örneğin, Google'ın Gizlilik Politikası). Vurgulanması gereken birkaç nokta var:

- İstatistikleri kaydetmek isteğe bağlıdır. Bu, CLI'nin ilk çalıştırılmasında belirlenir.
- Toplanan verileri halkın kullanımına açmayı planlıyoruz. **Herkes faydalanacak!!** Toplumun verileri görebileceği bir metrik gösterge paneli oluşturmaya yönelik planlarımız var.
- Kullanıcı ID'si zaman damgası + rastgele_sayı kombinasyonu olarak oluşturulur ve IP adresi, isim, konum veya diğer kişisel olarak tanınabilir bilgilerle hiçbir şekilde ilişkilendirilmez. Google Analytics, bu veriyi (toplu halde) bir uygulamanın kullanıcılarını ayırt etmek için kullanır. Bu, bize "# 7 günlük aktif kullanıcı sayısını" sorma imkanı tanır.
- Veriler, bir toplu veri toplama hizmeti olan Analytics'e gönderilir. Birey hakkındaki bilgilere ulaşmamız mümkün olmayacaktır.
- Oluşturulan şeylerin isimlerini kaydetmiyoruz (örneğin, birinin model adı, dosya isimlendirme kuralları vb.)