---
title: "Yedeklemeler"
description: Deno Deploy üzerinde barındırılan KV veritabanlarının sürekli yedeklenmesi ve yapılandırma adımları hakkında detaylı bilgiler sunulmaktadır. Yedekleme işlemleri için gerekli talimatlar ve önerilerle birlikte, AWS ve Google Cloud Storage ile entegrasyon süreçleri açıklanmaktadır.
keywords: [Deno Deploy, KV veritabanı, yedekleme, AWS S3, Google Cloud Storage, veri güvenliği, veri yönetimi]
---



Deno Deploy üzerinde barındırılan KV veritabanları, kendi S3 uyumlu depolama kovalarınıza sürekli olarak yedeklenebilir. Bu, barındırılan Deno KV veritabanlarında depolanan tüm veriler için yüksek kullanılabilirliği ve veri dayanıklılığını sağlamak amacıyla içsel olarak yaptığımız çoğaltma ve yedeklemelere ek olarak sunulmaktadır.

> "Yedekleme işlemi, verilerinizi güvence altına almak için kritik öneme sahiptir."  
> — Deno Deploy Ekibi

Bu yedekleme, çok az bir gecikmeyle sürekli olarak gerçekleşir ve _[anlık zaman geri yükleme](https://en.wikipedia.org/wiki/Point-in-time_recovery)_ ve canlı çoğaltma sağlar. KV veritabanları için yedeklemeyi etkinleştirmek, çeşitli ilginç kullanım senaryolarının kilidini açar:

- Geçmişte herhangi bir zamanda verilerinizin tutarlı bir anlık görüntüsünü alma
- Deno Deploy'dan bağımsız bir salt okunur veri kopyası çalıştırma
- Verilerinizi favori veri borularınıza ileterek Kafka, BigQuery ve ClickHouse gibi akış platformlarına ve analitik veritabanlarına veri gönderme

---

## Amazon S3 için yedekleme yapılandırma

Öncelikle AWS'de bir kova oluşturmalısınız:




1. [AWS S3 konsoluna](https://s3.console.aws.amazon.com/s3/home) gidin
2. "Kova oluştur" butonuna tıklayın
3. Bir kova adı girin ve bir AWS bölgesi seçin, ardından aşağı kaydırın ve "İleri"ye tıklayın




1. [AWS CLI'yi](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) yükleyin
2. Aşağıdaki komutu çalıştırın:
   `aws s3api create-bucket --bucket  --region  --create-bucket-configuration LocationConstraint=`
   (yerine `` ve `` kendi değerlerinizi koyun)




> "AWS konsolunu kullanmanız daha basit bir çözüm sunabilir."  
> — Deno Deploy Ekibi

Ardından, kova için `PutObject` erişimine sahip bir IAM politikası oluşturun, bunu bir IAM kullanıcısına ekleyin ve bu kullanıcı için erişim anahtarları oluşturun:




1. [AWS IAM konsoluna](https://console.aws.amazon.com/iam/home) gidin
2. Sol yan çubukta "Politikalar"a tıklayın
3. "Politika oluştur" butonuna tıklayın
4. "JSON" politika editörünü seçin ve aşağıdaki politikayı yapıştırın:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "KVBackup",
         "Effect": "Allow",
         "Action": "s3:PutObject",
         "Resource": "arn:aws:s3:::<kova-adi>/*"
       }
     ]
   }
   ```
   ``ni daha önce oluşturduğunuz kovanın adıyla değiştirin.
5. "Politikayı gözden geçir" butonuna tıklayın
6. Politika için bir ad girin ve "Politika oluştur" butonuna tıklayın
7. Sol yan çubukta "Kullanıcılar"a tıklayın
8. "Kullanıcı ekle" butonuna tıklayın
9. Kullanıcı için bir ad girin ve "İleri"ye tıklayın
10. "Politikaları doğrudan ekle" butonuna tıklayın
11. Daha önce oluşturduğunuz politikayı arayın ve yanındaki onay kutusunu işaretleyin
12. "İleri"ye tıklayın
13. "Kullanıcı oluştur" butonuna tıklayın
14. Yeni oluşturduğunuz kullanıcıya tıklayın
15. "Güvenlik kimlik bilgileri"ne tıklayın ve ardından "Erişim anahtarı oluştur" butonuna tıklayın
16. "Diğer"i seçin, ardından "İleri"ye tıklayın
17. Erişim anahtarı için bir açıklama girin ve "Erişim anahtarı oluştur" butonuna tıklayın
18. Erişim anahtarı kimliğini ve gizli erişim anahtarını kopyalayın ve güvenli bir yere kaydedin.
    Bunları daha sonra kullanmanız gerekecek ve bir daha geri alamayacaksınız.




1. Aşağıdaki komutu terminalinize kopyalayın ve ``yi daha önce oluşturduğunuz kovanın adıyla değiştirin, ardından çalıştırın:
   ```
   aws iam create-policy --policy-name <politika-adi> --policy-document '{"Version":"2012-10-17","Statement":[{"Sid":"KVBackup","Effect":"Allow","Action":"s3:PutObject","Resource":"arn:aws:s3:::<kova-adi>/*"}]}'
   ```
2. Aşağıdaki komutu terminalinize kopyalayın ve ``yi oluşturduğunuz kullanıcı için bir ad ile değiştirin, ardından çalıştırın:
   ```
   aws iam create-user --user-name <kullanici-adi>
   ```
3. Aşağıdaki komutu terminalinize kopyalayın ve ``yi birinci adımda oluşturduğunuz politikanın ARN'siyle, ``yi bir önceki adımda oluşturduğunuz kullanıcının adıyla değiştirin, ardından çalıştırın:
   ```
   aws iam attach-user-policy --policy-arn <politika-arn> --user-name <kullanici-adi>
   ```
4. Aşağıdaki komutu terminalinize kopyalayın ve ``yi ikinci adımda oluşturduğunuz kullanıcı ile değiştirin, ardından çalıştırın:
   ```
   aws iam create-access-key --user-name <kullanici-adi>
   ```
5. Erişim anahtarı kimliğini ve gizli erişim anahtarını kopyalayın ve güvenli bir yere kaydedin.
   Bunları daha sonra kullanmanız gerekecek ve bir daha geri alamayacaksınız.




Artık [Deno Deploy paneline](https://dash.deno.com) gidin ve projenizdeki "KV" sekmesine tıklayın. "Yedekleme" bölümüne kaydırın ve "AWS S3"ye tıklayın. Daha önce oluşturduğunuz kova adı, erişim anahtarı kimliği ve gizli erişim anahtarını girin ve kovayı bulunduğu bölgeyi belirtin. Ardından "Kaydet" butonuna tıklayın.

![](../../../../images/cikti/denoland/deploy/kv/manual/images/backup-add-bucket-to-dash.png)

Yedekleme hemen başlayacaktır. Veriler yedeklendikten ve sürekli yedekleme aktif hale geldikten sonra durumu "Aktif" olarak değiştireceksiniz.

---

## Google Cloud Storage için yedekleme yapılandırma

Google Cloud Storage (GCS), S3 protokolü ile uyumludur ve yedekleme hedefi olarak da kullanılabilir.

Öncelikle GCP'de bir kova oluşturmalısınız:




1. [GCP Cloud Storage konsoluna](https://console.cloud.google.com/storage/browser) gidin
2. Üst çubukta "Oluştur"a tıklayın
3. Bir kova adı girin, bir konum seçin ve "Oluştur"a tıklayın




1. [gcloud CLI'yi](https://cloud.google.com/sdk/docs/install) yükleyin
2. Aşağıdaki komutu çalıştırın: `gcloud storage buckets create  --location `
   (yerine `` ve `` kendi değerlerinizi koyun)




:::info
Google Cloud Storage, yüksek erişilebilirlik sunar ve veri kaybını önlemek için idealdir.
:::

Ardından, kovaya `Storage Object Admin` erişimine sahip bir hizmet hesabı oluşturun ve hizmet hesabı için bir HMAC erişim anahtarı oluşturun:




1. [GCP IAM konsoluna](https://console.cloud.google.com/iam-admin/iam) gidin
2. Sol yan çubukta "Hizmet hesapları"na tıklayın
3. "Hizmet hesabı oluştur" butonuna tıklayın
4. Hizmet hesabı için bir ad girin ve "Tamam" butonuna tıklayın
5. Yeni oluşturduğunuz hizmet hesabının e-posta adresini kopyalayın. Daha sonra buna ihtiyacınız olacak.
6. [GCP Cloud Storage konsoluna](https://console.cloud.google.com/storage/browser) gidin
7. Önceki adımda oluşturduğunuz kovaya tıklayın
8. Araç çubuğunda "İzinler"e tıklayın
9. "Erişim ver" butonuna tıklayın
10. Daha önce kopyaladığınız hizmet hesabının e-posta adresini "Yeni ilkeler" alanına yapıştırın
11. "Rol seç" açılır menüsünden "Storage Object Admin"ı seçin
12. "Kaydet" butonuna tıklayın
13. Sol yan çubukta "Ayarlar"a tıklayın (hala Cloud Storage konsolunda)
14. "Etkileşim" sekmesine tıklayın
15. "Bir hizmet hesabı için anahtar oluştur" butonuna tıklayın
16. Daha önce oluşturduğunuz hizmet hesabını seçin
17. "Anahtar oluştur" butonuna tıklayın
18. Erişim anahtarını ve gizli erişim anahtarını kopyalayın ve güvenli bir yere kaydedin. Daha sonra bunlara ihtiyaç duyacaksınız ve bir daha geri alamayacaksınız.




1. Aşağıdaki komutu çalıştırın, ``yi oluşturduğunuz hizmet hesabı için bir ad ile değiştirin:
   ```
   gcloud iam service-accounts create <hizmet-hesabi-adi>
   ```
2. Aşağıdaki komutu çalıştırın, ``yi daha önce oluşturduğunuz kovanın adıyla değiştirin ve ``yı önceki adımda oluşturduğunuz hizmet hesabının e-posta adresi ile değiştirin:
   ```
   gsutil iam ch serviceAccount:<hizmet-hesabi-e-posta>:objectAdmin gs://<kova-adi>
   ```
3. Aşağıdaki komutu çalıştırın, ``yı önceki adımda oluşturduğunuz hizmet hesabının e-posta adresi ile değiştirin:
   ```
   gcloud storage hmac create <hizmet-hesabi-e-posta>
   ```
4. `accessId` ve `secret` değerlerini kopyalayın ve güvenli bir yere kaydedin. Daha sonra bunlara ihtiyaç duyacaksınız ve bir daha geri alamayacaksınız.




Artık [Deno Deploy paneline](https://dash.deno.com) gidin ve projenizdeki "KV" sekmesine tıklayın. "Yedekleme" bölümüne kaydırın ve "Google Cloud Storage"a tıklayın. Önceki adımlarda oluşturduğunuz kova adı, erişim anahtarı kimliği ve gizli erişim anahtarını girin ve kovayı bulunduğu bölgeyi belirtin. Ardından "Kaydet" butonuna tıklayın.

Yedekleme hemen başlayacaktır. Veriler yedeklendikten ve sürekli yedekleme aktif hale geldikten sonra durumu "Aktif" olarak değiştireceksiniz.

---

## Yedeklemeleri Kullanma

S3 yedeklemeleri `denokv` aracı ile kullanılabilir. Daha fazla bilgi için [belgelere](https://github.com/denoland/denokv) başvurun.