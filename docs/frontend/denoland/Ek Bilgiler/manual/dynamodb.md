---
title: "DynamoDB'ye Bağlanın"
description: Amazon DynamoDB ile programatik olarak veri işleme adımlarını öğrenin. Bu eğitim, Deno Deploy kullanarak uygulama oluşturma ve AWS ile bağlantıları ele alır.
keywords: [DynamoDB, Deno Deploy, AWS, NoSQL, veri erişimi]
---

Amazon DynamoDB, tamamen yönetilen bir NoSQL veritabanıdır. DynamoDB'ye veri kalıcı hale getirmek için aşağıdaki adımları izleyin:

:::tip
Bu eğitim, bir AWS ve Deno Deploy hesabınızın olduğu varsayımıyla yapılmaktadır.
:::

DynamoDB üzerinde örnek bir uygulama inşa eden daha kapsamlı bir eğitimi `buradan` bulabilirsiniz.

## DynamoDB'den kimlik bilgilerini toplayın

Bu süreçteki ilk adım, DynamoDB'ye programatik olarak erişmek için AWS kimlik bilgilerini oluşturmaktır.

**Kimlik Bilgilerini Oluşturun:**

1. https://console.aws.amazon.com/iam/ adresine gidin ve "Kullanıcılar" bölümüne gidin.
2. **Kullanıcı ekle** butonuna tıklayın, **Kullanıcı adı** alanını doldurun (belki `denamo` kullanın) ve **Programatik erişim** türünü seçin.
3. **İleri: İzinler** butonuna tıklayın, ardından **Mevcut politikaları doğrudan ekle** seçeneğine tıklayın, `AmazonDynamoDBFullAccess` arayın ve seçin.
4. **İleri: Etiketler** butonuna tıklayın, sonra **İleri: İnceleme** butonuna tıklayın ve son olarak **Kullanıcı oluştur** butonuna tıklayın.
5. **.csv indirin** butonuna tıklayarak kimlik bilgilerini indirin.

## Deno Deploy'de bir proje oluşturun

Sonraki adım, Deno Deploy'de bir proje yaratmak ve gerekli ortam değişkenleriyle ayarlamaktır:

1. [https://dash.deno.com/new](https://dash.deno.com/new) adresine gidin (daha önce GitHub ile giriş yapmadıysanız giriş yapın) ve **Komut satırından dağıt** altında **+ Boş Proje** üzerine tıklayın.
2. Şimdi proje sayfasında bulunan **Ayarlar** butonuna tıklayın.
3. **Ortam Değişkenleri** bölümüne gidin ve aşağıdaki sırları ekleyin.

- `AWS_ACCESS_KEY_ID` - İndirilen CSV'deki **Erişim anahtarı kimliği** sütununda bulunan değeri kullanın.
- `AWS_SECRET_ACCESS_KEY` - İndirilen CSV'deki **Gizli erişim anahtarı** sütununda bulunan değeri kullanın.

## DynamoDB'ye bağlanan kodu yazın

AWS, tarayıcılarla çalışan bir [resmi SDK](https://www.npmjs.com/package/@aws-sdk/client-dynamodb) sunmaktadır. Deno Deploy'in API'lerinin çoğu, tarayıcılarla benzer olduğu için aynı SDK Deno Deploy ile de çalışır. Deno'da SDK'yı kullanmak için aşağıdaki gibi bir CDN'den içe aktarın ve bir istemci oluşturun:

```js
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "https://esm.sh/@aws-sdk/client-dynamodb?dts";

// Bölgenizle birlikte bir istemci örneği oluşturun.
// Kimlik bilgileri, Deno Deploy'deki proje oluşturma adımında ayarladığımız ortam değişkenlerinden otomatik olarak alınır, bu nedenle burada manuel olarak geçmemize gerek yok.
const client = new ApiFactory().makeNew(DynamoDB);

serve({
  "/songs": handleRequest,
});

async function handleRequest(request) {
  // async/await.
  try {
    const data = await client.send(command);
    // veriyi işleyin.
  } catch (error) {
    // hata yönetimi.
  } finally {
    // nihayet.
  }
}
```

## Uygulamayı Deno Deploy'a dağıtın

Uygulamanızı yazmayı bitirdiğinizde, Deno Deploy'de dağıtabilirsiniz.

Bunu yapmak için, `https://dash.deno.com/projects/` adresindeki proje sayfanıza geri dönün.

Dağıtım için birkaç seçenek görmelisiniz:

- `GitHub entegrasyonu`
- `deployctl`
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

:::info
Bir derleme adımı eklemek istemiyorsanız, GitHub entegrasyonunu seçmenizi öneriyoruz.
:::

Deno Deploy'de dağıtım yapmanın farklı yolları ve farklı yapılandırma seçenekleri hakkında daha fazla bilgi için `buradan` okuyabilirsiniz.