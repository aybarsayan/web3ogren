---
title: "Organizasyonlar"
description: "Bu belge, kullanıcıların Deno Deploy üzerinde organizasyon oluşturma ve üye ekleme süreçlerini ayrıntılı bir şekilde açıklamaktadır. Organizasyonlar, projelerin yönetimini kolaylaştırır ve ekip işbirliğini artırır."
keywords: [Deno Deploy, organizasyon, üye ekleme, projeleri yönetme, işbirliği]
---

**Organizasyonlar**, diğer kullanıcılarla işbirliği yapmanıza olanak tanır. Bir organizasyonda oluşturulan bir proje, organizasyonun tüm üyeleri tarafından erişilebilir. Kullanıcılar, bir organizasyona eklenmeden önce Deno Deploy'a kaydolmalıdır.

Şu anda, tüm organizasyon üyeleri organizasyona tam erişime sahiptir. Üyeleri ekleyip/çıkartabilir ve organizasyondaki tüm projeleri oluşturup/silerek/düzenleyebilirler.

### Bir organizasyon oluşturma

1. Deploy kontrol panelinizde, ekranın sol üst kısmındaki organizasyon açılır menüsüne tıklayın.
   ![](../../../images/cikti/denoland/deploy/docs-images/organizations.png)
2. **Organizasyon +**'yı seçin.
3. Organizasyonunuz için bir isim girin ve **Oluştur** butonuna tıklayın.

:::tip
Organizasyon adınızı belirlerken, ekip üyelerinizin kolayca hatırlayabileceği ve tanımlayabileceği bir isim seçmeye özen gösterin.
:::

### Üye ekleme

1. Ekranın sol üst kısmındaki organizasyon açılır menüsünde istenen organizasyonu seçin.
2. **Üyeler** simge butonuna tıklayın.
3. **Üyeler** panelinde, **+ Üye davet et** butonuna tıklayın.
   > **Not:** Kullanıcılar, davet etmeden önce [bu bağlantıyı](https://dash.deno.com/signin) kullanarak Deno Deploy'a kaydolmalıdır.
4. Kullanıcının GitHub kullanıcı adını girin ve **Davet et** butonuna tıklayın.

Deploy, kullanıcıya bir davet e-postası gönderecektir. Kullanıcı, davetinizi kabul edebilir veya reddedebilir. Daveti kabul ettiklerinde, organizasyonunuza eklenir ve üyeler panelinde gösterilir.

:::info
Beklemede olan davetler **Davetler** panelinde görüntülenir. Beklemede olan davetleri iptal etmek için, beklemede olan davetin yanındaki silme simgesine tıklayarak iptal edebilirsiniz.
:::

### Üye kaldırma

1. Ekranın sol üst kısmındaki organizasyon açılır menüsünde istenen organizasyonu seçin.
2. **Üyeler** simge butonuna tıklayın.
3. **Üyeler** panelinde, kaldırmak istediğiniz kullanıcının yanındaki silme butonuna tıklayın.

:::warning
Üye kaldırma işlemi geri alınamaz. Kaldırılan kullanıcı, organizasyona tekrar eklenmeden önce yeniden davet edilmelidir.
:::