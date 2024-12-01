---
title: "FaunaDB ile API sunucusu"
description: Bu belge, FaunaDB ve Deno Deploy kullanarak basit bir alıntı API'si oluşturma sürecini ayrıntılı olarak açıklar. FaunaDB ortaya çıkararak alıntıları kalıcı hale getirmek için kullanılacaktır.
keywords: [FaunaDB, Deno Deploy, API, GraphQL, alıntı, sunucusuz uygulama, veri yönetimi]
---

FaunaDB, kendisini "modern uygulamalar için veri API'si" olarak tanımlamaktadır. GraphQL arayüzüne sahip bir veritabanıdır; bu sayede GraphQL kullanarak onunla etkileşimde bulunabilirsiniz. HTTP istekleri aracılığıyla iletişim kurduğumuz için bağlantıları yönetmemiz gerekmiyor, bu da sunucusuz uygulamalar için oldukça uygundur.

Bu eğitimde [FaunaDB](https://fauna.com) ve Deno Deploy hesaplarının bulunduğunu, Deno Deploy CLI'nın kurulu olduğunu ve GraphQL konusunda bazı temel bilgilere sahip olmanızı varsayıyoruz.

- `Genel Bakış`
- `API Uç Noktalarını Oluşturun`
- `Kalıcılık İçin FaunaDB Kullanımı`
- `API'yi Yayınlayın`

## Genel Bakış

:::info
Bu eğitimde, alıntıları ekleyip geri almak için uç noktalara sahip küçük bir alıntı API'si oluşturalım. Daha sonra FaunaDB'yi alıntıları kalıcı kılmak için kullanacağız.
:::

API uç noktalarını tanımlamakla başlayalım.

```sh
# Bir POST isteği uç noktaya alıntıyı listeye eklemelidir.
POST /quotes/
# İsteğin gövdesi.
{
  "quote": "Her günü, hasat ettiğin ile değil, ektiğin tohumlarla yargıla.",
  "author": "Robert Louis Stevenson"
}

# Bir GET isteği uç noktadan veritabanındaki tüm alıntıları döndürmelidir.
GET /quotes/
# İsteğin yanıtı.
{
  "quotes": [
    {
      "quote": "Her günü, hasat ettiğin ile değil, ektiğin tohumlarla yargıla.",
      "author": "Robert Louis Stevenson"
    }
  ]
}
```

Artık uç noktanın nasıl davranması gerektiğini anladığımıza göre, oluşturmaya geçelim.

## API Uç Noktalarını Oluşturun

Öncelikle `quotes.ts` adında bir dosya oluşturun ve aşağıdaki içeriği yapıştırın.

Kodda neler olduğunu anlamak için yorumlara göz atın.

```ts
import {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.6.0/mod.ts";

serve({
  "/quotes": handleQuotes,
});

// Başlangıç olarak, sadece küresel bir alıntı dizisi kullanalım.
const quotes = [
  {
    quote: "Hayal edebilen herkes, imkansızı yaratabilir.",
    author: "Alan Turing",
  },
  {
    quote: "Yeterince ileri teknolojinin sihirle eşdeğer olduğu." ,
    author: "Arthur C. Clarke",
  },
];

async function handleQuotes(request: Request) {
  // İsteğin GET isteği olduğundan emin olun.
  const { error } = await validateRequest(request, {
    GET: {},
  });
  // validateRequest, istek şemamızla karşılanmadığında hatayı doldurur.
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  // Tüm alıntıları döndürün.
  return json({ quotes });
}
```

Yukarıdaki programı [Deno CLI](https://deno.land) kullanarak çalıştırın.

```sh
deno run --allow-net=:8000 ./path/to/quotes.ts
# Listening on http://0.0.0.0:8000/
```

Ve uç noktayı çağırarak bazı alıntıları görün.

```sh
curl http://127.0.0.1:8000/quotes
# {"quotes":[
# {"quote":"Hayal edebilen herkes, imkansızı yaratabilir.", "author":"Alan Turing"},
# {"quote":"Yeterince ileri teknolojinin sihirle eşdeğer olduğu.","author":"Arthur C. Clarke"}
# ]}
```

POST isteğini işlemeye devam edelim.

`validateRequest` fonksiyonunu, bir POST isteğinin sağlanan gövde şemasına uyduğundan emin olacak şekilde güncelleyin.

```diff
-  const { error } = await validateRequest(request, {
+  const { error, body } = await validateRequest(request, {
    GET: {},
+   POST: {
+      body: ["quote", "author"]
+   }
  });
```

POST isteğini işleyecek şekilde `handleQuotes` fonksiyonunu güncelleyin.

```diff
async function handleQuotes(request: Request) {
  const { error, body } = await validateRequest(request, {
    GET: {},
    POST: {
      body: ["quote", "author"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

+  // POST isteklerini işleme al.
+  if (request.method === "POST") {
+    const { quote, author } = body as { quote: string; author: string };
+    quotes.push({ quote, author });
+    return json({ quote, author }, { status: 201 });
+  }

  return json({ quotes });
}
```

Bunu bazı veriler ekleyerek test edelim.

```sh
curl --dump-header - --request POST --data '{"quote": "Test edilmemiş bir program çalışmaz.", "author": "Bjarne Stroustrup"}' http://127.0.0.1:8000/quotes
```

Çıktı aşağıdaki gibi görünebilir.

```console
HTTP/1.1 201 Created
transfer-encoding: chunked
content-type: application/json; charset=utf-8

{"quote":"Test edilmemiş bir program çalışmaz.","author":"Bjarne Stroustrup"}
```

Harika! API uç noktamızı oluşturduk ve beklendiği gibi çalışıyor. Veriler bellekte saklandığından, bir yeniden başlatmadan sonra kaybolacak. Alıntılarımızı kalıcı hale getirmek için FaunaDB'yi kullanalım.

## Kalıcılık İçin FaunaDB Kullanımı

Veritabanı şemamız tanımlamayı GraphQL Şeması ile yapalım.

```gql
# Bir alıntıyı ve yazarını temsil eden yeni bir `Quote` türü oluşturuyoruz.
type Quote {
  quote: String!
  author: String!
}

type Query {
  # Tüm alıntıları geri döndürmek için sorgu işleminde yeni bir alan.
  allQuotes: [Quote!]
}
```

Fauna, veritabanı için bir GraphQL uç noktası sağlar ve şemada tanımlanan bir veri türü için yaratma, güncelleme, silme gibi temel mutasyonları oluşturur. Örneğin, fauna `Quote` veri türü için veritabanında yeni bir alıntı yaratmak için `createQuote` adlı bir mutasyon oluşturacaktır. Ayrıca, veritabanındaki tüm alıntıları döndüren `allQuotes` adında bir sorgu alanı tanımlıyoruz.

Artık Deno Deploy uygulamalarından fauna ile etkileşim kuracak kodu yazmaya geçelim.

Fauna ile etkileşim kurmak için uygun sorgu ve parametreler ile veriyi almak amacıyla GraphQL uç noktasına bir POST isteği yapmamız gerekiyor. Bu yüzden bu işleri halledecek genel bir fonksiyon oluşturalım.

```typescript
async function queryFauna(
  query: string,
  variables: { [key: string]: unknown },
): Promise<{
  data?: any;
  error?: any;
}> {
  // Ortamdan gizli anahtarı alın.
  const token = Deno.env.get("FAUNA_SECRET");
  if (!token) {
    throw new Error("environment variable FAUNA_SECRET not set");
  }

  try {
    // Gövde, sorgu ve değişkenler olan fauna'nın GraphQL uç noktasına POST isteği yapın.
    const res = await fetch("https://graphql.fauna.com/graphql", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const { data, errors } = await res.json();
    if (errors) {
      // Varsa ilk hatayı döndür.
      return { data, error: errors[0] };
    }

    return { data };
  } catch (error) {
    return { error };
  }
}
```

Bu kodu `quotes.ts` dosyasına ekleyin. Şimdi endpoint'i fauna ile etkileşim kuracak şekilde güncellemeye geçelim.

```diff
async function handleQuotes(request: Request) {
  const { error, body } = await validateRequest(request, {
    GET: {},
    POST: {
      body: ["quote", "author"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  if (request.method === "POST") {
+    const { quote, author, error } = await createQuote(
+      body as { quote: string; author: string }
+    );
+    if (error) {
+      return json({ error: "alıntıyı oluşturamadım" }, { status: 500 });
+    }

    return json({ quote, author }, { status: 201 });
  }

  return json({ quotes });
}

+async function createQuote({
+  quote,
+  author,
+}: {
+  quote: string;
+  author: string;
+}): Promise<{ quote?: string; author?: string; error?: string }> {
+  const query = `
+    mutation($quote: String!, $author: String!) {
+      createQuote(data: { quote: $quote, author: $author }) {
+        quote
+        author
+      }
+    }
+  `;
+
+  const { data, error } = await queryFauna(query, { quote, author });
+  if (error) {
+    return { error };
+  }
+
+  return data;
+}
```

Yeni alıntıları eklemek için kodumuzu güncelledik, şimdi kodu test etmek için fauna veritabanı kurulumuna geçelim.

Yeni bir veritabanı oluşturun:

1. https://dashboard.fauna.com adresine gidin (gerekirse giriş yapın) ve **Yeni Veritabanı**'na tıklayın.
2. **Veritabanı Adı** alanını doldurun ve **Kaydet**'e tıklayın.
3. Sol yan çubukta görünen **GraphQL** bölümüne tıklayın.
4. Yukarıda tanımladığımız şemayı içeren `.gql` uzantılı bir dosya oluşturun.

Veritabanına erişmek için bir anahtar oluşturun:

1. **Güvenlik** bölümüne tıklayın ve **Yeni Anahtar**'a tıklayın.
2. **Sunucu** rolünü seçin ve **Kaydet**'e tıklayın. Anahtarı kopyalayın.

Şimdi uygulamayı gizli anahtar ile çalıştıralım.

```sh
FAUNA_SECRET=<alduğunuz_gizli_anahtar> deno run --allow-net=:8000 --watch quotes.ts
# Listening on http://0.0.0.0:8000
```

```sh
curl --dump-header - --request POST --data '{"quote": "Test edilmemiş bir program çalışmaz.", "author": "Bjarne Stroustrup"}' http://127.0.0.1:8000/quotes
```

Alıntının FaunaDB koleksiyonunuza eklendiğini göreceksiniz.

Tüm alıntıları almak için yeni bir fonksiyon yazalım.

```ts
async function getAllQuotes() {
  const query = `
    query {
      allQuotes {
        data {
          quote
          author
        }
      }
    }
  `;

  const {
    data: {
      allQuotes: { data: quotes },
    },
    error,
  } = await queryFauna(query, {});
  if (error) {
    return { error };
  }

  return { quotes };
}
```

Ve `handleQuotes` fonksiyonunu aşağıdaki kod ile güncelleyin.

```diff
-// Başlangıç olarak, sadece küresel bir alıntı dizisi kullanalım.
-const quotes = [
-  {
-    quote: "Hayal edebilen herkes, imkansızı yaratabilir.",
-    author: "Alan Turing",
-  },
-  {
-    quote: "Yeterince ileri teknolojinin sihirle eşdeğer olduğu." ,
-    author: "Arthur C. Clarke",
-  },
-];

async function handleQuotes(request: Request) {
  const { error, body } = await validateRequest(request, {
    GET: {},
    POST: {
      body: ["quote", "author"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  if (request.method === "POST") {
    const { quote, author, error } = await createQuote(
      body as { quote: string; author: string },
    );
    if (error) {
      return json({ error: "alıntıyı oluşturamadım" }, { status: 500 });
    }

    return json({ quote, author }, { status: 201 });
  }

+  // İsteğin yöntemi "GET" olarak varsayılmıştır.
+  {
+    const { quotes, error } = await getAllQuotes();
+    if (error) {
+      return json({ error: "alıntıları alamadım" }, { status: 500 });
+    }
+
+    return json({ quotes });
+  }
}
```

```sh
curl http://127.0.0.1:8000/quotes
```

Veritabanına eklediğimiz tüm alıntıları görmeniz gerekiyor. API'nin nihai kodu [https://deno.com/examples/fauna.ts](https://deno.com/examples/fauna.ts) adresinde bulunmaktadır.

## API'yi Yayınlayın

:::tip
Her şeyi yerleştirdiğimize göre, yeni API'nizi yayınlayalım!
:::

1. Tarayıcınızda [Deno Deploy](https://dash.deno.com/new_project) adresine gidin ve GitHub hesabınızı bağlayın.
2. Yeni API'nizi içeren depoyu seçin.
3. Projenize bir ad verebilir veya Deno'nun sizin için oluşturmasına izin verebilirsiniz.
4. Giriş Noktası açılır menüsünde `index.ts` seçin.
5. **Projeyi Yayınla**'ya tıklayın.

Uygulamanızın çalışması için ortam değişkenlerini yapılandırmamız gerekecek.

Projenizin başarı sayfasında veya projenizin kontrol panelinde, **Ortam değişkenleri ekle** seçeneğine tıklayın. Ortam Değişkenleri altında **+ Değişken Ekle** seçeneğine tıklayın. `FAUNA_SECRET` adında yeni bir değişken oluşturun - Değer, daha önce oluşturduğumuz gizli anahtar olmalıdır.

Değişkenleri kaydetmek için tıklayın.

Projenizin genel bakışında **Görüntüle**'ye tıklayarak projeyi tarayıcınızda görüntüleyin, URL'nin sonuna `/quotes` ekleyerek FaunaDB'nizin içeriğini görün.