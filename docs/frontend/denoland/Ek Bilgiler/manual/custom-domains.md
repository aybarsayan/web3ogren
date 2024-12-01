---
title: "Özel alan adları"
description: Özel alan adlarını Deno Deploy projelerine nasıl ekleyeceğinizi adım adım öğrenin. Bu rehber, DNS kayıtlarını güncellemeyi ve sertifika alımını kapsamaktadır.
keywords: [özel alan adı, Deno Deploy, DNS kayıtları, Let's Encrypt, sertifika]
---

Varsayılan olarak, bir projeye, `$PROJECT_ID.deno.dev` önizleme URL'si üzerinden ulaşılabilir. Örneğin, `dead-clam-55.deno.dev`. Aşağıdaki talimatları izleyerek özel bir alan adı da ekleyebilirsiniz.

## **Adım 1:** Özel alan adınızı Deno Deploy kontrol paneline ekleyin

1. Proje sayfasındaki "Ayarlar" butonuna tıklayın, ardından yan menüden "Alan Adları"nı seçin.
2. Projeye eklemek istediğiniz alan adını girin ve "Ekle" butonuna basın. Eklemek istediğiniz alan adını sahip olmanız gerektiğini unutmayın. Henüz bir alan adınız yoksa, Google Domains, Namecheap veya gandi.net gibi bir alan adı kayıt şirketinde bir tane kaydedebilirsiniz.
   ![add_custom_domain](../../../images/cikti/denoland/deploy/docs-images/add_custom_domain.png)

:::tip
Alan adı eklerken, doğru formatı kullandığınızdan emin olun.
:::

3. Alan adı, alan adları listesine eklenecek ve bir "kurulum" rozeti alacaktır.
4. Alan adı kurulum sayfasını ziyaret etmek için "kurulum" rozetine tıklayın; burada alan adınız için oluşturulması/güncellenmesi gereken DNS kayıtlarının listesi görüntülenecektir.
   ![dns_records_modal](../../../images/cikti/denoland/deploy/docs-images/dns_records_modal.png)

## **Adım 2:** Özel alan adınızın DNS kayıtlarını güncelleyin

Alan adı kayıt şirketinizin DNS yapılandırma paneline (veya DNS'i yönetmek için kullandığınız hizmete) gidin ve alan adı kurulum sayfasında tanımlandığı gibi kayıtları girin.

![change_dns_records](../../../images/cikti/denoland/deploy/docs-images/change_dns_records.png)

## **Adım 3:** DNS kayıtlarının güncellendiğini doğrulayın

Deno Deploy kontrol paneline geri dönün ve alan adı kurulum sayfasında **Doğrula** butonuna tıklayın. DNS kayıtlarının doğru ayarlandığını kontrol eder ve eğer öyleyse durumu "Doğrulandı, sertifika sağlama bekleniyor." olarak günceller.

![get_certificates](../../../images/cikti/denoland/deploy/docs-images/get_certificates.png)

## **Adım 4:** Özel alan adınız için bir sertifika sağlayın

:::info
Bu noktada iki seçeneğiniz var. Zamanın %99'unda birinci seçeneği seçmelisiniz.
:::

1. Let's Encrypt kullanarak otomatik olarak bir sertifika sağlayalım.

   Bunu yapmak için, **Otomatik sertifika al** butonuna basın. TLS sertifikası sağlamanın bir dakikaya kadar sürebileceğini unutmayın. Alan adınız, [Let's Encrypt](https://letsencrypt.org/) tarafından sertifika sağlanmasını engelleyen bir CAA kaydı belirtiyorsa, sağlama işlemi başarısız olabilir. Sertifikalar, süresi dolmadan yaklaşık 30 gün önce otomatik olarak yenilenecektir. Sertifikalar başarıyla verildiğinde, bu şekilde bir yeşil onay işareti göreceksiniz:

   ![green_check](../../../images/cikti/denoland/deploy/docs-images/green_check.png)

2. Sertifikayı ve özel anahtarı manuel olarak yükleyin.

   Sertifika zincirini ve özel anahtarı manuel olarak yüklemek için **Kendi sertifikalarınızı yükleyin** butonuna basın. Sertifika zinciri ve özel anahtar yüklemeniz istenecektir. Sertifika zincirinin tamamlanmış ve geçerli olması gerekir ve yaprak sertifikanız zincirin en üstünde olmalıdır.