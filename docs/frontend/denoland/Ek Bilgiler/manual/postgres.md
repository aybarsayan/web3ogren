---
title: "Postgres'e Bağlanın"
description: Bu öğretici, Deno Deploy üzerinde dağıtılan bir uygulamadan Postgres veritabanına nasıl bağlanacağınızı kapsar. Kullanıcıların Postgres'i hızlı bir şekilde kurmaları ve Deno Deploy'de projelerini dağıtmaları için gerekli adımları içerir.
keywords: [Postgres, Deno Deploy, veritabanı bağlantısı, Supabase, ortam değişkenleri]
---

Bu öğretici, Deno Deploy üzerinde dağıtılan bir uygulamadan Postgres veritabanına nasıl bağlanacağınızı kapsar.

Postgres üzerine bir örnek uygulama oluşturmayı detaylandıran daha kapsamlı bir öğretici bulabilirsiniz `burada`.

## Postgres'i Kurun

> Bu öğretici tamamen şifrelenmemiş Postgres'e bağlanmaya odaklanacaktır. Eğer özel bir CA sertifikasıyla şifreleme kullanmak isterseniz, dökümantasyonu [burada](https://deno-postgres.com/#/?id=ssltls-connection) kullanın.

Başlamak için, bağlanmamız gereken yeni bir Postgres örneği yaratmamız gerekiyor. Bu öğreticide, ücretsiz ve yönetilen Postgres örnekleri sağlayan [Supabase](https://supabase.com) kullanacağız. Veritabanınızı başka bir yerde barındırmak isterseniz, bunu da yapabilirsiniz.

1. https://app.supabase.io/ adresine gidin ve **Yeni proje** seçeneğine tıklayın.
2. Veritabanınız için bir isim, şifre ve bölge seçin. Şifreyi kaydetmeyi unutmayın, çünkü daha sonra buna ihtiyacınız olacak.
3. **Yeni proje oluştur** seçeneğine tıklayın. Projenin oluşturulması biraz zaman alabilir, bu yüzden sabırlı olun.

---

## Postgres'ten kimlik bilgilerini toplayın

Postgres veritabanınızı kurduktan sonra, Postgres örneğinizden bağlantı bilgilerinizi toplayın.

### Supabase

Yukarıdaki Supabase örneği için, bağlantı bilginizi almak için:

1. Sol taraftaki **Veritabanı** sekmesine gidin.
2. **Proje Ayarları** >> **Veritabanı** bölümüne gidin ve **Bağlantı Dizesi** >> **URI** alanından bağlantı dizesini kopyalayın. Bu, veritabanınıza bağlanırken kullanacağınız bağlantı dizesidir. Daha önce kaydettiğiniz şifreyi bu dizeye yerleştirin ve ardından dizeyi bir yere kaydedin - daha sonra buna ihtiyacınız olacak.

### psql

Eğer psql kullanıyorsanız, genellikle bağlantı bilgilerinizi bulmak için aşağıdaki komutu çalıştırabilirsiniz:

```psql
test=# \conninfo
```

> Postgres bağlantı dizesi aşağıdaki biçimde olacaktır:
>
> ```sh
> postgres://user:password@127.0.0.1:5432/deploy?sslmode=disable
> ```

---

## Deno Deploy'de bir proje oluşturun

Sonraki adımda, Deno Deploy'de bir proje oluşturalım ve gerekli ortam değişkenleriyle kurulumunu yapalım:

1. [https://dash.deno.com/new](https://dash.deno.com/new) adresine gidin (eğer henüz yapmadıysanız GitHub ile oturum açın) ve **+ Boş Proje** seçeneğine tıklayın.
2. Şimdi proje sayfasındaki **Ayarlar** butonuna tıklayın.
3. **Ortam Değişkenleri** bölümüne gidin ve aşağıdaki gizli bilgileri ekleyin.

- `DATABASE_URL` - Değer, son adımda aldığınız bağlantı dizesi olmalıdır.

![postgres_env_variable](../../../images/cikti/denoland/deploy/docs-images/postgres_env_variable.png)

---

## Postgres'e bağlanan kodu yazın

Postgres'e okumak/yazmak için, Postgres modülünü içe aktarın, ortam değişkenlerinden bağlantı dizesini okuyun ve bir bağlantı havuzu oluşturun.

```ts
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// "DATABASE_URL" ortam değişkeninden bağlantı dizesini alın
const databaseUrl = Deno.env.get("DATABASE_URL")!;

// Üç bağlantıyla temelli olarak oluşturulan bir veritabanı havuzu oluşturun
const pool = new Pool(databaseUrl, 3, true);

// Veritabanına bağlanın
const connection = await pool.connect();

try {
  // Tabloyu oluşturun
  await connection.queryObject`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL
    )
  `;
} finally {
  // Bağlantıyı havuza geri bırakın
  connection.release();
}
```

---

## Uygulamayı Deno Deploy'e dağıtın

Uygulamanızı yazmayı bitirdiğinizde, bunu Deno Deploy'e dağıtabilirsiniz.

Bunu yapmak için, projeniz sayfasına geri dönün ve `https://dash.deno.com/projects/` adresine gidin.

Dağıtım yapmak için birkaç seçenek göreceksiniz:

- `Github entegrasyonu`
- `deployctl`
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

:::tip
Bir yapı adımı eklemek istemiyorsanız, GitHub entegrasyonunu seçmenizi öneririz.
:::

Deno Deploy üzerinde dağıtım yapmanın farklı yolları ve farklı yapılandırma seçenekleri hakkında daha fazla bilgi için `burada` okuyun.