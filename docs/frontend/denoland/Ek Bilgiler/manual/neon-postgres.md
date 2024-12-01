---
title: "Neon Postgres'a Bağlanma"
description: Bu öğretici, Deno Deploy üzerinde dağıtılmış bir uygulamadan Neon Postgres veritabanına nasıl bağlanacağınızı kapsamaktadır. Adım adım talimatlarla, Postgres'in temel kurulumunu ve Deno Deploy sürecindeki yapılandırmayı öğrenin.
keywords: [Deno, Postgres, Neon, Deno Deploy, veritabanı bağlantısı, eğitim, geliştirme]
---

Bu öğretici, Deno Deploy üzerinde dağıtılmış bir uygulamadan Neon Postgres veritabanına nasıl bağlanacağınızı kapsamaktadır.

Postgres üzerinde örnek bir uygulama kuran daha kapsamlı bir öğreticiye `buradan` ulaşabilirsiniz.

## Postgres Kurulumu

Başlamak için, bağlanacağımız yeni bir Postgres örneği oluşturmamız gerekiyor. Bu öğretici için, ücretsiz, yönetilen Postgres örnekleri sunduğu için [Neon Postgres](https://neon.tech/) kullanacağız. Veritabanınızı başka bir yerde barındırmak isterseniz, bunu da yapabilirsiniz.

1. https://neon.tech/ adresine gidin ve bir e-posta, Github, Google veya partner hesabıyla **Kaydol** butonuna tıklayın. Kaydolduktan sonra, ilk projenizi oluşturmak için Neon Konsolu'na yönlendirileceksiniz.
2. Projeniz için bir isim girin, bir Postgres sürümü seçin, bir veritabanı ismi sağlayın ve bir bölge seçin. Genellikle, uygulamanıza en yakın bölgeyi seçmek istersiniz. İşlemi tamamladıktan sonra **Proje oluştur** butonuna tıklayın.
3. Yeni projeniz için bağlantı dizesi sunulacaktır; bu dizeyi veritabanınıza bağlanmak için kullanabilirsiniz. Bağlantı dizesini kaydedin, görünümü şu şekilde olacaktır:

   ```sh
   postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

   Bağlantı dizesine bir sonraki adımda ihtiyacınız olacaktır.

## Deno Deploy'de bir proje oluşturma

Sonraki adımda, Deno Deploy'de bir proje oluşturalım ve gerekli çevresel değişkenlerle yapılandıralım:

1. [https://dash.deno.com/new](https://dash.deno.com/new) adresine gidin (daha önce yapmadıysanız GitHub ile oturum açın) ve **Kendi kodunuzu dağıtın** bölümündeki **Boş bir proje oluşturun** butonuna tıklayın.
2. Şimdi proje sayfasında mevcut olan **Ayarlar** butonuna tıklayın.
3. **Çevre Değişkenleri** bölümüne gidin ve aşağıdaki gizli değişkeni ekleyin.

   - `DATABASE_URL` - Değer, bir önceki adımda kaydettiğiniz bağlantı dizesi olarak ayarlanmalıdır.

   ![postgres_env_variable](../../../images/cikti/denoland/deploy/docs-images/neon_postgres_env_variable.png)

## Postgres'e bağlanan kod yazma

:::tip
Neon sunucusuz sürücüsünü kullanarak Postgres'e okumak/yazmak için, önce `deno add` komutunu kullanarak bunu yükleyin.
:::

[Neon sunucusuz sürücüsü](https://deno.com/blog/neon-on-jsr) kullanarak Postgres'e okumak/yazmak için, önce `deno add` komutunu kullanarak bunu yükleyin:

```sh
deno add jsr:@neon/serverless
```

Bu, bağımlılığı içeren `deno.json` dosyanızı oluşturacak veya güncelleyecektir:

```json
{
  "imports": {
    "@neon/serverless": "jsr:@neon/serverless@^0.10.1"
  }
}
```

Artık sürücüyü kodunuzda kullanabilirsiniz:

```ts
import { neon } from "@neon/serverless";

// "DATABASE_URL" çevre değişkeninden bağlantı dizesini alın
const databaseUrl = Deno.env.get("DATABASE_URL")!;

// Bir SQL sorgu çalıştırıcısı oluşturun
const sql = neon(databaseUrl);

try {
  // Tabloyu oluşturun
  await sql`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL
    )
  `;
} catch (error) {
  console.error(error);
}
```

## Uygulamayı Deno Deploy'e dağıtma

Uygulamanızı yazmayı bitirdikten sonra, onu Deno Deploy'e dağıtabilirsiniz.

Bunu yapmak için, `https://dash.deno.com/projects/` adresine gidin.

Dağıtım için birkaç seçenek görmelisiniz:

- `Github entegrasyonu`
- `deployctl`
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

:::warning
Bir derleme adımı eklemek istemiyorsanız, GitHub entegrasyonunu seçmenizi öneririz.
:::

Deno Deploy'de dağıtımın farklı yolları ve farklı yapılandırma seçenekleri hakkında daha fazla bilgi için `buraya` göz atın.