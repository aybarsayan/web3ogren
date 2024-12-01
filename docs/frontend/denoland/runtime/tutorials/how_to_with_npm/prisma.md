---
description: Bu kılavuz, Deno ile Oak ve Prisma kullanarak basit bir RESTful API oluşturmanın adımlarını detaylandırmaktadır. Veri modelleme ve dinozor veritabanı oluşturma süreçlerini adım adım gösterir.
keywords: [Deno, Prisma, Oak, RESTful API, veritabanı, dinozor]
title: "Prisma ve Oak ile RESTful API Nasıl Oluşturulur"
---

[Prisma](https://prisma.io), Deno'da çalışmak için en çok talep edilen modüllerden biri olmuştur. **Prisma'nın geliştirici deneyimi oldukça üst düzeydir** ve pek çok kalıcı veri depolama teknolojisiyle uyumlu çalışır, bu nedenle talep de anlaşılır.

Prisma'yı Deno ile nasıl kullanacağınızı göstermek için buradayız.

Bu Kılavuzda, Oak ve Prisma kullanarak Deno'da basit bir RESTful API kuracağız.

Hadi başlayalım.

[Kaynağı görüntüle](https://github.com/denoland/examples/tree/main/with-prisma) veya [video kılavuzuna göz atın](https://youtu.be/P8VzA_XSF8w).

## Uygulamayı Kurma

`rest-api-with-prisma-oak` klasörünü oluşturalım ve oraya geçelim:

```shell
mkdir rest-api-with-prisma-oak
cd rest-api-with-prisma-oak
```

Sonra, Deno ile `prisma init` komutunu çalıştıralım:

```shell
deno run --allow-read --allow-env --allow-write npm:prisma@latest init
```

Bu, 
[`prisma/schema.prisma`](https://www.prisma.io/docs/concepts/components/prisma-schema) dosyasını oluşturacaktır. Bunu aşağıdaki gibi güncelleyelim:

```ts
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["deno"]
  output = "../generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Dinosaur {
  id          Int     @id @default(autoincrement())
  name        String  @unique
  description String
}
```

:::note
Prisma ayrıca bir `.env` dosyası ile bir `DATABASE_URL` ortam değişkeni oluşturur. `DATABASE_URL`'yi bir PostgreSQL bağlantı dizesine atayalım. Bu örnekte, ücretsiz bir 
[Supabase PostgreSQL veritabanı](https://supabase.com/database) kullanacağız.
:::

Sonrasında, veritabanı şemasını oluşturalım:

```shell
deno run -A npm:prisma@latest db push
```

Bunun tamamlanmasının ardından, Prisma Client'ı oluşturmalıyız:

```shell
deno run -A --unstable npm:prisma@latest generate --no-engine
```

## Prisma Veri Platformunda Accelerate Kurulumu

Prisma Veri Platformu ile başlamanız için:

1. Ücretsiz [Prisma Veri Platformu hesabına](https://console.prisma.io) kaydolun.
2. Bir proje oluşturun.
3. Oluşturduğunuz projeye gidin.
4. Veritabanınızın bağlantı dizesini vererek Accelerate'i etkinleştirin.
5. Accelerate bağlantı dizesini oluşturun ve panonuza kopyalayın.

`DATABASE_URL`'deki bağlantı dizesini, `prisma://` ile başlayan Accelerate bağlantı dizesiyle değiştirin.

Sonrasında, veritabanını beslemek için bir tohum betiği oluşturalım.

## Veritabanınızı Besleyin

`./prisma/seed.ts` oluşturun:

```shell
touch prisma/seed.ts
```

Ve `./prisma/seed.ts` dosyasında:

```ts
import { Prisma, PrismaClient } from "../generated/client/deno/edge.ts";

const prisma = new PrismaClient({
  datasourceUrl: envVars.DATABASE_URL,
});

const dinosaurData: Prisma.DinosaurCreateInput[] = [
  {
    name: "Aardonyx",
    description: "Sauropodların evrimindeki erken bir aşama.",
  },
  {
    name: "Abelisaurus",
    description: "Abel'in kertenkele kafatasından yeniden inşa edildi.",
  },
  {
    name: "Acanthopholis",
    description: "Hayır, bu bir Yunan şehri değil.",
  },
];

/**
 * Veritabanını besle.
 */

for (const u of dinosaurData) {
  const dinosaur = await prisma.dinosaur.create({
    data: u,
  });
  console.log(`ID'si: ${dinosaur.id} olan bir dinozor oluşturuldu`);
}
console.log(`Besleme tamamlandı.`);

await prisma.$disconnect();
```

Artık `seed.ts` dosyasını şu komutla çalıştırabiliriz:

```shell
deno run -A --env prisma/seed.ts
```

> [!TIP]
>
> `--env` bayrağı, Deno'ya `.env` dosyasından ortam değişkenlerini yüklemesini söylemek için kullanılır.

Bunu yaptıktan sonra, aşağıdaki komutu çalıştırarak Prisma Studio'da verilerinizi görebilmelisiniz:

```bash
deno run -A npm:prisma studio
```

Aşağıdaki ekran görüntüsü benzeyen bir şey görmelisiniz:

![Yeni dinozorlar Prisma panosunda](../../../../images/cikti/denoland/runtime/tutorials/images/how-to/prisma/1-dinosaurs-in-prisma.png)

---

## API Rotalarınızı Oluşturun

API rotalarını oluşturmak için [`oak`](https://deno.land/x/oak) kullanacağız. Şimdilik onları basit tutalım.

`main.ts` dosyasını oluşturalım:

```shell
touch main.ts
```

Sonra, `main.ts` dosyanızda:

```ts
import { PrismaClient } from "./generated/client/deno/edge.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

/**
 * Başlat.
 */

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: envVars.DATABASE_URL,
    },
  },
});
const app = new Application();
const router = new Router();

/**
 * Rotaları ayarlayın.
 */

router
  .get("/", (context) => {
    context.response.body = "Dinozor API'sine hoş geldiniz!";
  })
  .get("/dinosaur", async (context) => {
    // Tüm dinozorları al.
    const dinosaurs = await prisma.dinosaur.findMany();
    context.response.body = dinosaurs;
  })
  .get("/dinosaur/:id", async (context) => {
    // ID'ye göre bir dinozoru al.
    const { id } = context.params;
    const dinosaur = await prisma.dinosaur.findUnique({
      where: {
        id: Number(id),
      },
    });
    context.response.body = dinosaur;
  })
  .post("/dinosaur", async (context) => {
    // Yeni bir dinozor oluştur.
    const { name, description } = await context.request.body("json").value;
    const result = await prisma.dinosaur.create({
      data: {
        name,
        description,
      },
    });
    context.response.body = result;
  })
  .delete("/dinosaur/:id", async (context) => {
    // ID'ye göre bir dinozoru sil.
    const { id } = context.params;
    const dinosaur = await prisma.dinosaur.delete({
      where: {
        id: Number(id),
      },
    });
    context.response.body = dinosaur;
  });

/**
 * Middleware'i ayarlayın.
 */

app.use(router.routes());
app.use(router.allowedMethods());

/**
 * Sunucuyu başlat.
 */

await app.listen({ port: 8000 });
```

Artık bunu çalıştırabiliriz:

```shell
deno run -A --env main.ts
```

`localhost:8000/dinosaurs` adresini ziyaret edelim:

![REST API'den tüm dinozorların listesi](../../../../images/cikti/denoland/runtime/tutorials/images/how-to/prisma/2-dinosaurs-from-api.png)

Ardından, yeni bir kullanıcı oluşturmak için şu `curl` komutunu kullanalım:

```shell
curl -X POST http://localhost:8000/dinosaur -H "Content-Type: application/json" -d '{"name": "Deno", "description":"Dünyada yürüyen en hızlı, en güvenli, en kolay kullanılan dinozor."}'
```

Artık Prisma Studio'da yeni bir satır görmelisiniz:

![Prisma'da yeni dinozor Deno](../../../../images/cikti/denoland/runtime/tutorials/images/how-to/prisma/3-new-dinosaur-in-prisma.png)

Harika!

## Sırada Ne Var?

Deno ve Prisma ile bir sonraki uygulamanızı geliştirmek, **veri modelleme**, **tür güvenliği** ve **sağlam IDE desteği** ile sezgisel bir geliştirici deneyimi sundukları için daha verimli ve eğlenceli olacaktır.

:::info
Prisma'yı Deno Deploy ile bağlamaya ilginiz varsa, 
[bu harika kılavuza göz atın](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-deno-deploy).
:::