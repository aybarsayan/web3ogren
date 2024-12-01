---
title: "DynamoDB ile API Sunucusu"
description: Bu eğitimde, DynamoDB ile desteklenen küçük bir API oluşturmayı öğreneceksiniz. Uç noktalar ile bilgi ekleme ve alma süreçlerini detaylı bir şekilde inceleyeceğiz.
keywords: [DynamoDB, API, Deno Deploy, AWS, veritabanı, eğitim, programlama]
---

Bu eğitimde, DynamoDB ile desteklenen, bilgi eklemek ve almak için uç noktaları olan küçük bir API nasıl oluşturabileceğimize bakalım.

Eğitim, bir AWS ve Deno Deploy hesabına sahip olduğunuzu varsayıyor.

- `Genel Bakış`
- `DynamoDB Kurulumu`
- `Deno Deploy'de Proje Oluşturma`
- `Uygulamayı Yazma`
- `Uygulamayı Yayınlama`

## Genel Bakış

:::tip
GET/POST isteklerini kabul eden ve uygun bilgileri döndüren tek bir uç nokta ile bir API oluşturacağız.
:::

```sh
# Uç noktaya yapılan bir GET isteği, şarkının başlığına dayalı olarak şarkı detaylarını döndürmelidir.
GET /songs?title=Song%20Title # '%20' == boşluk
# yanıt
{
  title: "Şarkı Başlığı"
  artist: "Birisi"
  album: "Bir Şey",
  released: "1970",
  genres: "country rap",
}

# Uç noktaya yapılan bir POST isteği, şarkı detaylarını eklemelidir.
POST /songs
# post isteği gövdesi
{
  title: "Yeni bir Başlık"
  artist: "Yeni Birisi"
  album: "Yeni Bir Şey",
  released: "2020",
  genres: "country rap",
}
```

## DynamoDB Kurulumu

Sürecin ilk adımı, DynamoDB'ye programatik olarak erişmek için AWS kimlik bilgilerini oluşturmaktır.

### Kimlik Bilgilerini Oluşturma:

1. https://console.aws.amazon.com/iam/ adresine gidin ve "Kullanıcılar" bölümüne gidin.
2. **Kullanıcı oluştur** butonuna tıklayın, **Kullanıcı adı** alanını doldurun (belki `denamo` kullanabilirsiniz) ve **Programatik erişim** türünü seçin.
3. **İleri** butonuna tıklayın.
4. **Politikaları doğrudan ekle** seçeneğini seçin ve `AmazonDynamoDBFullAccess` için arama yapın. Sonuçlarda bu politikanın yanındaki kutucuğu işaretleyin.
5. **İleri** ve **Kullanıcı oluştur** butonuna tıklayın.
6. Oluşan **Kullanıcılar** sayfasında, yeni oluşturduğunuz kullanıcıya tıklayın.
7. **Erişim anahtarı oluştur** butonuna tıklayın.
8. **AWS dışında çalışan uygulama** seçeneğini seçin.
9. ***Oluştur** butonuna tıklayın.
10. Yeni oluşturduğunuz kimlik bilgilerini indirmek için **.csv dosyasını indir** butonuna tıklayın.

### Veritabanı tablosu oluşturma:

1. https://console.aws.amazon.com/dynamodb adresine gidin ve **Tablo oluştur** butonuna tıklayın.
2. **Tablo adı** alanını `songs` ve **Bölüm anahtarı** alanını `title` olarak doldurun.
3. Aşağı kaydırın ve **Tablo oluştur** butonuna tıklayın.
4. Tablo oluşturulduğunda, tablo adına tıklayın ve **Genel bilgiler** kısmını bulun.
5. **Amazon Kaynak Adı (ARN)** altında, yeni tablonuzun bölgesini not alın (örneğin us-east-1).

## Uygulamayı Yazma

`index.js` adında bir dosya oluşturun ve aşağıdakileri ekleyin:

```js
import {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.6.0/mod.ts";
// AWS, tarayıcılarla uyumlu bir resmi SDK'ya sahiptir. Deno Deploy'un
// API'leri, tarayıcılarınkine benzer olduğundan, aynı SDK Deno Deploy ile de çalışır.
// Bu yüzden, verileri eklemek ve almak için gereken bazı sınıflarla birlikte SDK'yı import ediyoruz.
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "https://esm.sh/@aws-sdk/client-dynamodb";

// Bölge bilginizi sağlayarak bir istemci örneği oluşturun.
// Kimlik bilgileri, Deno Deploy üzerindeki proje oluşturma adımında ayarladığımız
// ortam değişkenlerinden elde edilir.
const client = new DynamoDBClient({
  region: Deno.env.get("AWS_TABLE_REGION"),
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID"),
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY"),
  },
});

serve({
  "/songs": handleRequest,
});

async function handleRequest(request) {
  // Uç nokta GET ve POST isteğine izin verir. GET isteği için işlenmesi gereken "title" adında bir parametre vardır.
  // ve POST isteğini işlemek için aşağıda tanımlanan alanlarla birlikte bir gövde gereklidir.
  // validateRequest, sağlanan terimlerin isteği karşıladığını sağlar.
  const { error, body } = await validateRequest(request, {
    GET: {
      params: ["title"],
    },
    POST: {
      body: ["title", "artist", "album", "released", "genres"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  // POST isteğini işleyin.
  if (request.method === "POST") {
    try {
      // DynamoDB ile etkileşimde bulunmak istediğimizde, istemci örneğini kullanarak bir komut gönderiyoruz.
      // Burada, istekteki verileri eklemek için bir PutItemCommand gönderiyoruz.
      const {
        $metadata: { httpStatusCode },
      } = await client.send(
        new PutItemCommand({
          TableName: "songs",
          Item: {
            // Burada 'S', değerin string türünde olduğunu,
            // 'N' ise bir sayı olduğunu belirtir.
            title: { S: body.title },
            artist: { S: body.artist },
            album: { S: body.album },
            released: { N: body.released },
            genres: { S: body.genres },
          },
        }),
      );

      // Başarılı bir put item isteği yapıldığında, Dynamo 200 durum kodu döner (garip).
      // Bu yüzden, verinin eklenip eklenmediğini doğrulamak için durum kodunu test ediyoruz
      // ve istekte sağlanan verilerle bir yanıt veriyoruz.
      if (httpStatusCode === 200) {
        return json({ ...body }, { status: 201 });
      }
    } catch (error) {
      // İstek sırasında bir sorun çıkarsa, hatayı referansımız için kaydediyoruz.
      console.log(error);
    }

    // Eğer yürütme buraya ulaşırsa, bu, eklemenin başarılı olmadığını gösterir.
    return json({ error: "veri eklenemedi" }, { status: 500 });
  }

  // GET isteğini işleyin.
  try {
    // İstekten başlığı alıyoruz ve şarkı bilgilerini almak için bir GetItemCommand
    // gönderiyoruz.
    const { searchParams } = new URL(request.url);
    const { Item } = await client.send(
      new GetItemCommand({
        TableName: "songs",
        Key: {
          title: { S: searchParams.get("title") },
        },
      }),
    );

    // Item özelliği tüm verileri içerir, bu yüzden tanımsız değilse,
    // başlık hakkındaki bilgileri döndürmeye devam ediyoruz.
    if (Item) {
      return json({
        title: Item.title.S,
        artist: Item.artist.S,
        album: Item.album.S,
        released: Item.released.S,
        genres: Item.genres.S,
      });
    }
  } catch (error) {
    console.log(error);
  }

  // Buraya, veritabanına yapılan istek sırasında bir hata fırlatıldığında
  // veya Item veritabanında bulunmadığında ulaşabiliriz.
  // İki durumu genel bir mesajla yansıtırız.
  return json(
    {
      message: "başlık bulunamadı",
    },
    { status: 404 },
  );
}
```

:::info
Yeni projenizde git'i başlatın ve [GitHub'a gönderin](https://docs.github.com/en/get-started/start-your-journey/hello-world#step-1-create-a-repository).
:::

## Uygulamayı Yayınlama

Artık her şey yerli yerinde olduğuna göre, yeni uygulamanızı yayınlayalım!

1. Tarayıcınızda [Deno Deploy](https://dash.deno.com/new_project) adresine gidin ve GitHub hesabınızı bağlayın.
2. Yeni uygulamanızı içeren depoyu seçin.
3. Projenize bir isim verebilir veya Deno'nun sizin için bir tane oluşturmasına izin verebilirsiniz.
4. Giriş Noktası açılır menüsünde `index.js`'yi seçin.
5. **Projeyi Yayınla** butonuna tıklayın.

Uygulamanızın çalışması için, ortam değişkenlerini yapılandırmamız gerekecek.

Projenizin başarı sayfasında veya proje panosunda, **Ortam değişkenleri ekle** butonuna tıklayın. Ortam Değişkenleri altında, **+ Değişken Ekle** butonuna tıklayın. Aşağıdaki değişkenleri oluşturun:

1. `AWS_ACCESS_KEY_ID` - indirdiğiniz CSV'den aldığınız değerle
2. `AWS_SECRET_ACCESS_KEY` - indirdiğiniz CSV'den aldığınız değerle.
3. `AWS_TABLE_REGION` - tablonuzun bölgesiyle

Değişkenleri kaydetmek için tıklayın.

:::warning
API'yi test etmeden önce, ortam değişkenlerini doğru şekilde yapılandırdığınızdan emin olun.
:::

API'yi test edelim.

Bir veri POST edin.

```sh
curl --request POST --data \
'{"title": "Old Town Road", "artist": "Lil Nas X", "album": "7", "released": "2019", "genres": "Country rap, Pop"}' \
--dump-header - https://<project_name>.deno.dev/songs
```

Başlık hakkında bilgi GET edin.

```sh
curl https://<project_name>.deno.dev/songs?title=Old%20Town%20Road
```

DynamoDB'yi Deno Deploy ile kullanmayı öğrendiğiniz için tebrikler!