---
title: "Postgres ile API sunucusu"
description: "Bu kılavuz, Postgres ile Deno Deploy'u kullanarak basit bir API sunucusu oluşturmayı gösterir. Adım adım talimatlar ve kod örnekleri ile API uç noktalarını nasıl geliştireceğinizi öğreneceksiniz."
keywords: [Postgres, API, Deno Deploy, veritabanı, eğitim]
oldUrl:
  - /deploy/docs/tutorial-postgres/
  - /deploy/manual/tutorial-postgres/
---

Postgres, esnekliği ve kullanım kolaylığı nedeniyle web uygulamaları için popüler bir veritabanıdır. Bu kılavuz, Deno Deploy'u Postgres ile nasıl kullanacağınızı gösterecektir.

- `Postgres ile API sunucusu`
  - `Genel Bakış`
  - `Postgres Kurulumu`
    - `Neon Postgres`
    - `Supabase`
  - `Uygulamayı yazma ve dağıtma`

## Genel Bakış

Basit bir görev listesi uygulaması için API inşa edeceğiz. İki uç noktamız olacak:

`GET /todos` tüm görevlerin listesini dönecek ve `POST /todos` yeni bir görev oluşturacak.

> **Teklif:** Bu uç noktaları test etmek için cURL kullanabilirsiniz.

```
GET /todos
---
title: "tüm görevlerin listesini döner"
---
[
  {
    "id": 1,
    "title": "Ekmek al"
  },
  {
    "id": 2,
    "title": "Pirinç al"
  },
  {
    "id": 3,
    "title": "Baharat al"
  }
]

POST /todos
---
title: "yeni bir görev oluşturur"
---
" süt al"
---
title: "201 durum kodunu döner"
---
```

Bu eğiticide şunları yapacağız:

- [Neon Postgres](https://neon.tech/) veya [Supabase](https://supabase.com) üzerinde bir [Postgres](https://www.postgresql.org/) örneği oluşturup kurmak.
- Uygulamayı geliştirmek ve dağıtmak için bir `Deno Deploy` oyun alanı kullanmak.
- Uygulamamızı [cURL](https://curl.se/) kullanarak test etmek.

---

## Postgres Kurulumu

:::info
Bu eğitim, tamamen Postgres'e şifrelenmemiş olarak bağlanmaya odaklanacaktır. Özel bir CA sertifikası ile şifreleme kullanmak istiyorsanız, belgeleri [buradan](https://deno-postgres.com/#/?id=ssltls-connection) inceleyebilirsiniz.
:::

Başlamak için, bağlanacağımız yeni bir Postgres örneği oluşturmamız gerekiyor. Bu eğitim için [Neon Postgres](https://neon.tech/) veya [Supabase](https://supabase.com) kullanabilirsiniz; her ikisi de ücretsiz, yönetilen Postgres örnekleri sağlar. Veritabanınızı başka bir yerde barındırmak isterseniz, bunu da yapabilirsiniz.

### Neon Postgres

1. https://neon.tech/ adresini ziyaret edin ve bir e-posta, Github, Google veya ortak hesap ile **Kaydol** butonuna tıklayın. Kayıt olduktan sonra, ilk projenizi oluşturmak için Neon Konsolu'na yönlendirileceksiniz.
2. Projeniz için bir isim girin, bir Postgres sürümü seçin, bir veritabanı adı sağlayın ve bir bölge seçin. Genel olarak, uygulamanıza en yakın bölgeyi seçmek isteyeceksiniz. İşlemi bitirdiğinizde **Proje oluştur** butonuna tıklayın.
3. Yeni projeniz için bağlantı dizesiyle karşılaşacaksınız; bunu veritabanınıza bağlanmak için kullanabilirsiniz. Aşağıda görünen bağlantı dizesini kaydedin:

   ```sh
   postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### Supabase

1. https://app.supabase.io/ adresini ziyaret edin ve "Yeni proje" butonuna tıklayın.
2. Veritabanınız için bir isim, şifre ve bölge seçin. Şifreyi kaydetmeyi unutmayın, çünkü daha sonra ihtiyacınız olacak.
3. "Yeni proje oluştur" butonuna tıklayın. Projenin oluşturulması biraz zaman alabilir, bu yüzden sabırlı olun.
4. Proje oluşturulduktan sonra, sol taraftaki "Veritabanı" sekmesine gidin.
5. "Bağlantı Havuzu" ayarlarına gidin ve "Bağlantı Dizesi" alanından bağlantı dizesini kopyalayın. Bu, veritabanınıza bağlanmak için kullanacağınız bağlantı dizesidir. Daha önce kaydettiğiniz şifreyi bu dizeye ekleyin ve sonra bu dizeyi bir yere kaydedin – daha sonra ihtiyaç duyacaksınız.

---

## Uygulamayı yazma ve dağıtma

Artık uygulamamızı yazmaya başlayabiliriz. Başlamak için, kontrol panelinde yeni bir Deno Deploy oyun alanı oluşturacağız: https://dash.deno.com/projects adresinde "Yeni Oyun Alanı" butonuna basın.

Bu, oyun alanı editörünü açacaktır. Gerçekten kod yazmaya başlamadan önce, Postgres bağlantı dizesini çevresel değişkenlere koymamız gerekiyor. Bunu yapmak için, editörün sol üst köşesindeki proje adına tıklayın. Bu, proje ayarlarını açacaktır.

Buradan, sol navigasyon menüsünden "Ayarlar" -> "Çevresel Değişken" sekmesine gidebilirsiniz. "Anahtar" alanına "DATABASE_URL" yazın ve "Değer" alanına bağlantı dizesini yapıştırın. Şimdi, "Ekle" butonuna basın. Çevresel değişkenleriniz ayarlandı.

Editöre geri dönelim: bunu yapmak için, sol navigasyon menüsünden "Genel Bakış" sekmesine gidin ve "Oyun Alanını Aç" butonuna basın. HTTP isteklerini `Deno.serve()` kullanarak sunmaya başlayalım:

```ts
Deno.serve(async (req) => {
  return new Response("Bulunamadı", { status: 404 });
});
```

Bu kodu Ctrl+S (veya Mac'te Cmd+S) ile kaydedebilirsiniz. Sağdaki önizleme sayfasının otomatik olarak yenilendiğini görmelisiniz: artık "Bulunamadı" yazmaktadır.

Sonraki adım olarak, Postgres modülünü içe aktaralım, çevresel değişkenlerden bağlantı dizesini okuyalım ve bir bağlantı havuzu oluşturalım.

```ts
import * as postgres from "https://deno.land/x/postgres@v0.14.0/mod.ts";

// "DATABASE_URL" çevresel değişkeninden bağlantı dizesini alın
const databaseUrl = Deno.env.get("DATABASE_URL")!;

// Üç bağlantı ile tembel bir şekilde kurulan bir veritabanı havuzu oluşturun
const pool = new postgres.Pool(databaseUrl, 3, true);
```

Yine, şimdi bu kodu kaydedebilirsiniz, ancak bu sefer herhangi bir değişiklik görmemeniz gerekir. Bir bağlantı havuzu oluşturuyoruz, ancak henüz veritabanına herhangi bir sorgu gerçekleştirmiyoruz. Bunu yapmak için önce tablo şemamızı ayarlamamız gerekiyor.

Görevlerin bir listesini saklamak istiyoruz. `id` sütunu otomatik artan ve `title` sütununa sahip bir `todos` adında bir tablo oluşturalım:

```ts
const pool = new postgres.Pool(databaseUrl, 3, true);

// Veritabanına bağlanın
const connection = await pool.connect();
try {
  // Tabloyu oluştur
  await connection.queryObject`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL
    )
  `;
} finally {
  // Bağlantıyı havuza geri ver
  connection.release();
}
```

Artık bir tablomuz olduğuna göre, GET ve POST uç noktaları için HTTP işleyicilerini ekleyebiliriz.

```ts
Deno.serve(async (req) => {
  // URL'yi ayrıştırın ve istenen uç noktanın /todos olduğunu kontrol edin. Eğer değilse
  // 404 yanıtı döndürün.
  const url = new URL(req.url);
  if (url.pathname !== "/todos") {
    return new Response("Bulunamadı", { status: 404 });
  }

  // Veritabanı havuzundan bir bağlantı alın
  const connection = await pool.connect();

  try {
    switch (req.method) {
      case "GET": { // Bu bir GET isteği. Tüm görevlerin listesini döndür.
        // Sorguyu çalıştır
        const result = await connection.queryObject`
          SELECT * FROM todos
        `;

        // Sonucu JSON formatına dönüştür
        const body = JSON.stringify(result.rows, null, 2);

        // Sonucu JSON olarak döndür
        return new Response(body, {
          headers: { "content-type": "application/json" },
        });
      }
      case "POST": { // Bu bir POST isteği. Yeni bir görev oluştur.
        // İstek gövdesini JSON olarak ayrıştırın. Eğer istek gövdesinin ayrıştırılması
        // başarısız olursa, bir dize değilse veya 256 karakterden daha uzunsa, 400 yanıtı döndürün.
        const title = await req.json().catch(() => null);
        if (typeof title !== "string" || title.length > 256) {
          return new Response("Kötü İstek", { status: 400 });
        }

        // Yeni görevi veritabanına ekleyin
        await connection.queryObject`
          INSERT INTO todos (title) VALUES (${title})
        `;

        // 201 Oluşturuldu yanıtını döndür
        return new Response("", { status: 201 });
      }
      default: // Eğer bu ne POST ne de GET ise 405 yanıtı döndür.
        return new Response("Yöntem İzin Verilmiyor", { status: 405 });
    }
  } catch (err) {
    console.error(err);
    // Bir hata oluşursa, 500 yanıtı döndür
    return new Response(`İçsel Sunucu Hatası\n\n${err.message}`, {
      status: 500,
    });
  } finally {
    // Bağlantıyı havuza geri ver
    connection.release();
  }
});
```

İşte bu kadar - uygulama tamamlandı. Bu kodu editörde kaydederek dağıtın. Artık `/todos` uç noktasına POST yaparak yeni bir görev oluşturabilir ve `/todos` uç noktasına GET isteği yaparak tüm görevlerin listesini alabilirsiniz:

```sh
$ curl -X GET https://tutorial-postgres.deno.dev/todos
[]⏎

$ curl -X POST -d '"Süt al"' https://tutorial-postgres.deno.dev/todos

$ curl -X GET https://tutorial-postgres.deno.dev/todos
[
  {
    "id": 1,
    "title": "Süt al"
  }
]⏎
```

Her şey çalışıyor 🎉

Eğitimin tam kodu:



:::note
Ek bir zorluk olarak, bir görevi silmek için `DELETE /todos/:id` uç noktasını eklemeyi deneyin. [URLPattern][urlpattern] API'si bu konuda size yardımcı olabilir.
:::

[urlpattern]: https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API