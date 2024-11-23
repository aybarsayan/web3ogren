---
sidebar_position: 13
title: Huawei Cloud KooGallery ile Camino Düğümü Çalıştırma
description: Huawei Cloud KooGallery'de Camino Düğümü nasıl kurulur öğrenin.
---

# Huawei Cloud KooGallery'de Camino Düğümü Kurulumu

Bu kılavuzda, Huawei Cloud KooGallery platformunda Camino Düğümü'nü kurmak için gereken adımları size detaylarıyla anlatacağız.

Blok zincir teknolojisine yeni başlayan biri olsanız da deneyimli bir Huawei Cloud kullanıcısı olsanız da, bu kılavuz hem erişilebilir hem de takip etmesi kolay olacak şekilde tasarlanmıştır. Camino Düğümü'nüzü Huawei KooGallery'de sorunsuz bir şekilde çalıştırmanıza yardımcı olmak için adım adım talimatlar sunmaktadır.

Camino Düğümü'nü Huawei KooGallery'de kurma işlemi ile başlayalım.

### Güvenlik Grubu Oluşturma: Erişim İzinlerini Yapılandırma

Bu adımda, Camino Düğümü makinelerine gelen ve giden trafiği kontrol etmek için sanal bir güvenlik duvarı işlevi görecek bir Güvenlik Grubu oluşturacağız. Güvenlik Grubu içindeki erişim izinlerini tanımlayarak, Camino Düğümü için gerekli portların (staking portu, HTTP portu) ve SSH bağlantısının güvenli bir şekilde izinli olmasını sağlayabiliriz.

Güvenlik Grubu ayarları, makineye erişmesine izin verilen IP adreslerini ve portları belirler. Güvenlik Grubu'nu, güvenli uzaktan bağlantılar için SSH erişimine izin verecek ve Camino Düğümü için gerekli TCP portları üzerinden iletişimi sağlayacak şekilde yapılandıracağız.

Uygun kurallarla Güvenlik Grubu'nu ayarlayarak, Camino Düğümü makinenizin erişilebilir ve yetkisiz erişimden korunmuş olmasını sağlayabiliriz.

Camino Düğümü'nü güvenli bir şekilde çalıştırabilmek için şimdi Güvenlik Grubu'nu oluşturmaya ve erişim izinlerini yapılandırmaya geçelim.

1. Huawei Cloud Konsolunda **Elastic Cloud Server Konsolu**'nu seçin. Burada sanal makine örneklerinizi oluşturabilir ve yönetebilirsiniz.



Şekil 1: ECS Bölümüne Gidin


2. **"Ağ & Güvenlik" >> "Güvenlik Grupları"** bölümüne gidin. Bu, yeni bir tarayıcı sekmesi açacaktır.

3. **"Güvenlik Grubu Oluştur"** butonuna tıklayın.

4. Güvenlik grubu için bir ad yazın, örneğin "camino-security-group".

5. Şablonlardan **"Hızlı kural ekle"** seçeneğini seçin.

6. Açıklama yazın, örneğin "SSH portu ve Camino TCP portları için gelen trafiğe izin ver". Ardından **"Tamam"** butonuna tıklayın.



Şekil 2: Bilgileri Doldurun


6. Yeni kurallar eklemenize izin veren bir pop-up mesajı belirecektir. **"Kuralları Yönet"** butonuna tıklayın.



Şekil 3: Kuralları Yönet


7. **"Kural Ekle"** butonuna tıklayın, aşağıdaki gelen kuralları ekleyin ve ardından **"Tamam"** butonuna tıklayın:

   - **Kural 1**:
     - **Öncelik**: 1
     - **Eylem**: İzin Ver
     - **Tür**: IPv4
     - **Protokol**: Protokoller/TCP (Özel portlar)
     - **Port**: 22
     - **Kaynak**: IP Adresi
     - **IP Aralığı**: SSH portu erişimi için IP aralığınız (kendi IP aralığınızdan erişime izin verin)
     - **Açıklama**: SSH portu
   - **Kural 2**:
     - **Öncelik**: 1
     - **Eylem**: İzin Ver
     - **Tür**: IPv4
     - **Protokol**: Protokoller/TCP (Özel portlar)
     - **Port**: 9651
     - **Kaynak**: IP Adresi
     - **IP Aralığı**: 0.0.0.0/0 (her IP'den staking port erişimine izin vermek için)
     - **Açıklama**: Staking portu
   - **Kural 3**:
     - **Öncelik**: 1
     - **Eylem**: İzin Ver
     - **Tür**: IPv4
     - **Protokol**: Protokoller/TCP (Özel portlar)
     - **Port**: 9650
     - **Kaynak**: IP Adresi
     - **IP Aralığı**: SSH portu erişimi için IP aralığınız (kendi IP aralığınızdan erişime izin verin)
     - **Açıklama**: API HTTP portu



Şekil 4: Kuralları Ekle


:::tip PORTLARI ANLAMAK: STAKING & API PORTLARI

Camino Düğümü, farklı işlevsellikler için iki port kullanır. 9651 numaralı port, Camino Ağı üzerindeki validator düğümleri ile iletişim için kullanılan staking portudur.

Ayrıca 9650 numaralı port, API’yi dışa açmak için kullanılır. Eğer düğümünüzü API düğümü olarak kullanmayı düşünmüyorsanız, 2. kuralı çıkartabilir ya da API erişimini belirli IP adresleri veya subnetler ile sınırlandırmak isterseniz, kaynak IP aralığını buna göre değiştirebilirsiniz. Staking portu (9651) her zaman tüm IP adreslerine (0.0.0.0/0) sınırlamaları olmaksızın erişim sağlamalıdır.

APIs hakkında daha kapsamlı bilgi için lütfen  belgelerine başvurun.

:::

### Anahtar Çifti Oluşturma: Makinenize Güvenli Erişim

Anahtar çifti oluşturmak, yeni oluşturduğunuz makineye güvenli erişim sağlayacak önemli bir adımdır. Anahtar çifti ile makineye SSH (Güvenli Shell) üzerinden güvenli bir şekilde giriş yapabilir ve etkili bir şekilde yönetebilirsiniz.

Anahtar çifti oluşturma işlemi sırasında, bir genel ve bir özel anahtar çifti oluşturacaksınız. Özel anahtar, makineye bağlanırken kimlik doğrulamanız için kullanılacakken, genel anahtar makine ile ilişkilendirilecek ve güvenli erişimi mümkün kılacaktır.

Özel anahtarınızı güvende tutun ve başkalarıyla paylaşmayın. Bu Anahtar Çifti ile makinenize güvenli bir şekilde erişim sağlamak ve gerekli yapılandırmaları gerçekleştirmek için gerekli kimlik bilgilerine sahip olacaksınız.

Güvenli erişimi sağlamak için şimdi Anahtar Çifti oluşturmaya geçelim.

1. **"ECS Konsolu"**'na geri dönün ve **"Ağ & Güvenlik" > "Anahtar Çifti"** bölümüne gidin.

2. **"Anahtar Çifti Oluştur"** butonuna tıklayın.



Şekil 5: "Anahtar Çifti Oluştur" butonuna tıklayın


3. Anahtar için bir ad yazın, örneğin "camino-key-pair".
4. Anahtar Çifti Hizmeti Feragatnamesi kutusunu işaretleyin.
5. **"Tamam"** butonuna tıklayın ve indirdiğiniz dosyayı kaydedin. Bu anahtar çifti, makineye SSH üzerinden bağlanmak için kullanılacaktır.



Şekil 6: Anahtar Çifti Oluşturma


### ECS Örneği Oluşturma: Camino Düğümü Makinenizi Başlatma

Bu adımda, Camino Düğümü makineniz olarak hizmet verecek bir Elastic Cloud Server (ECS) örneği oluşturacağız. Camino Düğümü görüntüsünü Huawei Cloud KooGallery'de bulacaksınız.

ECS örneği oluştururken, Camino Düğümü gereksinimlerinize uygun örnek türünü, işletim sistemini ve diğer yapılandırmaları seçeceksiniz. Daha önce oluşturulan Anahtar Çifti ve Güvenlik Grubu'nu ilişkilendirerek güvenli erişim ve iletişimi sağlayacağız.

ECS örneği çalışır hale geldiğinde, Camino Düğümü kurulum sürecine başlayabileceksiniz. Örnek, Camino Düğümü'nü verimli bir şekilde çalıştırmak için gerekli kaynaklarla donatılacaktır.

Huawei Cloud'da ECS örneği oluşturmak için şimdi başlayalım.

1. KooGallery'i açın ve "Camino Düğümü" araması yapın veya doğrudan bu  adresini kullanabilirsiniz.



Şekil 7: KooGallery'de Camino Düğümü


2. Aşağı kaydırarak uygun **Bölge, Görüntü ve ECS Aroması**'nı seçin, ardından **"Devam Et ve Gönder"** butonuna tıklayın.



Şekil 8: Camino Düğümü Yapılandırmaları


3. Yeni bir tarayıcı sekmesi açılacak ve ECS örneği oluşturulacaktır. **Bölge, Faturalama Modu, Özellikler, Görüntü ve Sistem Disk**'i yapılandırın. Sistem Disk'in en az **128 GB** olması gerektiğini unutmayın. Ardından **"Sonraki: Ağı Yapılandır"** butonuna tıklayın.



Şekil 9: ECS Özellikleri


4. Tercih edilen **Ağ VPC**'yi seçin. **Güvenlik Grubu**: camino-security-group olarak ayarlayın. **EIP**'yi **Otomatik atama** olarak ayarlayın. Ardından **"Sonraki: Gelişmiş Ayarları Yapılandır"** butonuna tıklayın.



Şekil 10: Ağ Yapılandırmaları


5. Örneğiniz için bir ad yazın. **Anahtar Çifti**'ni giriş yöntemi olarak seçin ve daha önce oluşturulan Anahtar Çifti'ni seçin. **Otomatik Kurtarma** kutusunu işaretleyin. Ardından **"Sonraki: Onayla"** butonuna tıklayın.



Şekil 11: Gelişmiş Ayarların Yapılandırmaları


6. Örnek yapılandırmalarını gözden geçirin ve Görüntü Feragatnamesini kabul edin. Ardından **"Gönder"** butonuna tıklayın.



Şekil 12: Gözden Geçirme ve Gönder


7. Şimdi ECS örneği başlayacak ve Camino Düğümü servisi içinde çalışacaktır. Örnek durumunu kontrol etmek ve ona bağlanmak için **ECS Konsolu**'na geri dönebilirsiniz.

### Sorun Giderme:

Bir sorun çıkarsa, lütfen makineye giriş yapın ve Camino Düğümü Docker konteynerinin çalışıp çalışmadığını kontrol edin.

Eğer çalışmıyorsa, aşağıdaki komutu çalıştırın:

**Ana Ağ için:**

```
docker run -d -v /home/camino-data:/root/.caminogo -p 9650:9650 -p 9651:9651 --restart always c4tplatform/camino-node:latest ./camino-node --networkid=camino --http-host=0.0.0.0 --public-ip-resolution-service=ifconfigme --configfile=/root/.caminogo/configs/node.json
```

**Test Ağı için:**

```
docker run -d -v /home/camino-data:/root/.caminogo -p 9650:9650 -p 9651:9651 --restart always c4tplatform/camino-node:latest ./camino-node --networkid=columbus --http-host=0.0.0.0 --public-ip-resolution-service=ifconfigme --configfile=/root/.caminogo/configs/node.json