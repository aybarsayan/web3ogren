---
title: "Veritabanlarına Bağlanma"
description: Bu doküman, Deno ile çeşitli veritabanlarına nasıl bağlanacağınızı ve veri işlemlerini yönetme yöntemlerini sunmaktadır. MySQL, PostgreSQL, MongoDB, SQLite, Firebase, Supabase ve ORM çözümleri hakkında bilgiler içermektedir.
keywords: [Deno, veritabanları, MySQL, PostgreSQL, MongoDB, SQLite, ORM]
---

Uygulamaların verileri veritabanlarından saklaması ve alması yaygın bir durumdur. Deno, birçok veritabanı yönetim sistemine bağlanmayı destekler.

Deno topluluğu, MySQL, Postgres ve MongoDB gibi popüler veritabanlarına kolayca bağlanmayı sağlayan birçok üçüncü taraf modül yayımlamıştır. 

:::info
Bu modüller Deno'nun üçüncü taraf modül sitesinde barındırılmaktadır [deno.land/x](https://deno.land/x).
:::

## MySQL

[deno_mysql](https://deno.land/x/mysql) Deno için bir MySQL ve MariaDB veritabanı sürücüsüdür.

### deno_mysql ile MySQL'e Bağlanma

Öncelikle `mysql` modülünü içe aktarıp yeni bir istemci örneği oluşturun. Ardından bağlantı bilgilerini içeren bir nesne geçirerek veritabanına bağlanın:

```ts title="main.js"
import { Client } from "https://deno.land/x/mysql/mod.ts";

const client = await new Client().connect({
  hostname: "127.0.0.1",
  username: "root",
  db: "dbname",
  password: "password",
});
```

Bağlandıktan sonra sorgular çalıştırabilir, veri ekleyebilir ve bilgi alabilirsiniz.

## Postgres

[deno-postgres](https://deno.land/x/postgres) Deno için geliştirici deneyimine odaklanan hafif bir PostgreSQL sürücüsüdür.

### deno-postgres ile Postgres'e Bağlanma

Öncelikle `deno-postgres` modülünden `Client` sınıfını içe aktarın ve yeni bir istemci örneği oluşturun. Ardından bağlantı bilgilerini içeren bir nesne geçirerek veritabanına bağlanın:

```ts
import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client({
  user: "user",
  database: "dbname",
  hostname: "127.0.0.1",
  port: 5432,
  password: "password",
});
await client.connect();
```

[postgresjs](https://deno.land/x/postgresjs) Node.js ve Deno için tam özellikli bir Postgres istemcisidir.

### postgresjs ile Postgres'e Bağlanma

`postgres` modülünü içe aktarın ve yeni bir istemci örneği oluşturun. Ardından bağlantı dizesini bir argüman olarak geçirerek veritabanına bağlanın:

```js
import postgres from "https://deno.land/x/postgresjs/mod.js";

const sql = postgres("postgres://username:password@host:port/database");
```

## MongoDB

Resmi [MongoDB sürücüsü](https://www.npmjs.com/package/mongodb) ile çalışmak için
`npm spesifikasyonları` kullanmanızı öneririz. Sürücü ile nasıl çalışacağınızı daha fazla öğrenmek için
[resmi belgeleri](https://www.mongodb.com/docs/drivers/node/current/) inceleyebilirsiniz. Deno bağlamında bu modülü kullanmanın tek farkı, `npm:` spesifikasyonu ile modülü içe aktarma şeklinizdir.

MongoDB sürücüsünü içe aktarın, bağlantı yapılandırmasını ayarlayın ve ardından bir MongoDB örneğine bağlanın. Bağlandıktan sonra belgeleri bir koleksiyona eklemek gibi işlemler gerçekleştirebilirsiniz:

```ts title="main.js"
import { MongoClient } from "npm:mongodb@6";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "myProject";

await client.connect();
console.log("Sunucuya başarıyla bağlandı");

// Bir koleksiyona referans alın
const db = client.db(dbName);
const collection = db.collection("documents");

// Kaydetme işlemi gerçekleştirin
const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }]);
console.log("Ekleme işlemi =>", insertResult);

client.close();
```

## SQLite

Deno'da SQLite'a bağlanmanın iki temel çözümü vardır:

### FFI Modülü ile SQLite'a Bağlanma

[@db/sqlite](https://jsr.io/@db/sqlite) SQLite3 C API için JavaScript bağlamaları sağlar ve `Deno FFI` kullanır.

```ts
import { Database } from "jsr:@db/sqlite@0.12";

const db = new Database("test.db");

const [version] = db.prepare("select sqlite_version()").value<[string]>()!;
console.log(version);

db.close();
```

### Wasm-Optimize Modülü ile SQLite'a Bağlanma

[sqlite](https://deno.land/x/sqlite) JavaScript ve TypeScript için bir SQLite modülüdür. Deno için özel olarak hazırlanmış bir sargıdır ve WebAssembly (Wasm) ile derlenmiş bir SQLite3 sürümünü kullanır.

```ts
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("test.db");

db.close();
```

## Firebase

Deno ile Firebase'a bağlanmak için
[firestore npm modülünü](https://firebase.google.com/docs/firestore/quickstart)
[ESM CDN](https://esm.sh/) ile içe aktarın. Deno'da bir CDN ile npm modüllerini kullanmayı öğrenmek için, 
`npm paketlerini CDNLer ile kullanma` konusunu inceleyin.

### firestore npm modülü ile Firebase'a Bağlanma

```js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";

import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  QuerySnapshot,
  setDoc,
  where,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

const app = initializeApp({
  apiKey: Deno.env.get("FIREBASE_API_KEY"),
  authDomain: Deno.env.get("FIREBASE_AUTH_DOMAIN"),
  projectId: Deno.env.get("FIREBASE_PROJECT_ID"),
  storageBucket: Deno.env.get("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: Deno.env.get("FIREBASE_MESSING_SENDER_ID"),
  appId: Deno.env.get("FIREBASE_APP_ID"),
  measurementId: Deno.env.get("FIREBASE_MEASUREMENT_ID"),
});
const db = getFirestore(app);
const auth = getAuth(app);
```

## Supabase

Deno ile Supabase'a bağlanmak için
[supabase-js npm modülünü](https://supabase.com/docs/reference/javascript) 
[esm.sh CDN](https://esm.sh/) ile içe aktarın. Deno'da bir CDN ile npm modüllerini kullanmayı öğrenmek için, 
`npm paketlerini CDNLer ile kullanma` konusuna bakabilirsiniz.

### supabase-js npm modülü ile Supabase'a Bağlanma

```js
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const options = {
  schema: "public",
  headers: { "x-my-custom-header": "my-app-name" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

const supabase = createClient(
  "https://xyzcompany.supabase.co",
  "public-anon-key",
  options,
);
```

## ORM'ler

Nesne-İlişkisel Haritalama (ORM), veri modellerinizi veritabanına kaydedebileceğiniz sınıflar olarak tanımlar. Bu sınıfların örnekleri üzerinden verilerinizi okuyabilir ve yazabilirsiniz.

Deno, Prisma ve DenoDB dahil birçok ORM'yi destekler.

### DenoDB

[DenoDB](https://deno.land/x/denodb) Deno'ya özgü bir ORM'dir.

#### DenoDB'ye Bağlanma

```ts
import {
  Database,
  DataTypes,
  Model,
  PostgresConnector,
} from "https://deno.land/x/denodb/mod.ts";

const connection = new PostgresConnector({
  host: "...",
  username: "user",
  password: "password",
  database: "airlines",
});

const db = new Database(connection);
```

## GraphQL

GraphQL, farklı veri kaynaklarını istemci merkezli API'lere derlemek için sıklıkla kullanılan bir API sorgulama dilidir. GraphQL API'sini kurmak için öncelikle bir GraphQL sunucusu kurmalısınız. Bu sunucu, verilerinizi istemci uygulamalarınızın veri sorgulayabileceği bir GraphQL API olarak sunar.

### Sunucu

Deno'da bir GraphQL API sunucusu çalıştırmak için Deno için evrensel bir GraphQL HTTP ara katmanı olan [gql](https://deno.land/x/gql) kullanabilirsiniz.

#### gql ile GraphQL API sunucusu çalıştırma

```ts
import { GraphQLHTTP } from "https://deno.land/x/gql/mod.ts";
import { makeExecutableSchema } from "https://deno.land/x/graphql_tools@0.0.2/mod.ts";
import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => `Merhaba Dünya!`,
  },
};

const schema = makeExecutableSchema({ resolvers, typeDefs });

Deno.serve({ port: 3000 }, async (req) => {
  const { pathname } = new URL(req.url);

  return pathname === "/graphql"
    ? await GraphQLHTTP<Request>({
      schema,
      graphiql: true,
    })(req)
    : new Response("Bulunamadı", { status: 404 });
});
```

### İstemci

Deno'da GraphQL istemci çağrıları yapmak için
[graphql npm modülünü](https://www.npmjs.com/package/graphql) 
[esm CDN](https://esm.sh/) ile içe aktarın. Deno'da CDN aracılığıyla npm modüllerini kullanmayı öğrenmek için
`bura` bakabilirsiniz.

#### graphql npm modülü ile GraphQL istemci çağrıları yapma

```js
import { buildSchema, graphql } from "https://esm.sh/graphql";

const schema = buildSchema(`
type Query {
  hello: String
}
`);

const rootValue = {
  hello: () => {
    return "Merhaba dünya!";
  },
};

const response = await graphql({
  schema,
  source: "{ hello }",
  rootValue,
});

console.log(response);
```

:::tip
Artık Deno projenizi bir veritabanına bağlayarak kalıcı verilerle çalışabilir, CRUD işlemleri gerçekleştirebilir ve daha karmaşık uygulamalar geliştirmeye başlayabilirsiniz.
:::