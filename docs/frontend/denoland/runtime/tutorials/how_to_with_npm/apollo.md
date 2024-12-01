---
title: "Apollo'yu Deno ile Kullanma"
description: "Bu kılavuz, Deno ile basit bir Apollo Server kurulumu yapmayı ve GraphQL sorguları ile veri almayı detaylandırmaktadır. Adım adım ilerleyerek, dinazor verilerini sorgulamak için gerekli dosyaları oluşturacaksınız."
keywords: [Apollo Server, Deno, GraphQL, DIY, sunucu kurulumu, sorgu, resolver]
---

[Apollo Server](https://www.apollographql.com/) , birkaç dakika içinde kurabileceğiniz bir GraphQL sunucusudur ve mevcut veri kaynaklarınızla (veya REST API) kullanabilirsiniz. Daha sonra istediğiniz herhangi bir GraphQL istemcisini bağlayarak verileri alabilir ve GraphQL'in tür denetimi ve verimli alım gibi avantajlarından yararlanabilirsiniz.

Yerel verileri sorgulamamıza olanak tanıyan basit bir Apollo sunucusu kuracağız. Bunun için sadece üç dosyaya ihtiyacımız olacak:

1. `schema.ts` veri modelimizi kurmak için
2. `resolvers.ts` şemamızda veri alanlarını nasıl dolduracağımızı belirlemek için
3. Sunucunun başlatılacağı `main.ts`

Şimdi onları oluşturarak başlayalım:

```shell
touch schema.ts resolvers.ts main.ts
```

Her birinin kurulumu üzerinden geçelim.

[Kaynağı buradan görüntüleyin.](https://github.com/denoland/examples/tree/main/with-apollo)

## schema.ts

`schema.ts` dosyamız verimizi tanımlar. Bu durumda, verimiz bir dinozorlar listesidir. Kullanıcılarımızın her dinozorun adını ve kısa bir tanımını alabilmesini istiyoruz. GraphQL dilinde bu, `Dinosaur`'un **tipimiz** olduğunu ve `name` ile `description`'ın **alanlarımız** olduğunu belirtir. Ayrıca her alan için veri tipini de tanımlayabiliriz. Bu durumda, her ikisi de string'dir.

:::info
GraphQL'de veri için izin verdiğimiz sorguları tanımlarken özel **Query** tipini kullanıyoruz.
:::

Ayrıca burada, GraphQL'de veri için izin verdiğimiz sorguları tanımlarız; bu, özel **Query** tipini kullanarak yapılır. İki sorgumuz var:

- `dinosaurs`: Tüm dinozorların listesini alır
- `dinosaur`: Bir dinozor adı (`name`) alır ve o tür dinozor hakkında bilgi döndürür.

Tüm bunları `typeDefs` tür tanımlamaları değişkenimiz içerisinde dışa aktaracağız:

```tsx
export const typeDefs = `
  type Dinosaur {
    name: String
    description: String
  }

  type Query {
    dinosaurs: [Dinosaur]
		dinosaur(name: String): Dinosaur
  }
`;
```

Eğer veri yazmak isteseydik, bu da **Mutation**'ı tanımlayacağımız yer olurdu. Mutasyonlar, GraphQL ile veri yazmanın yoludur. Burada statik bir veri kümesi kullandığımız için hiçbir şey yazmayacağız.

## resolvers.ts

Bir çözümleyici, her sorgu için verileri doldurmaktan sorumludur. Burada dinozor listemiz var ve çözümleyici, ya a) kullanıcı `dinosaurs` sorgusunu talep ederse tüm listeyi istemciye iletecek ya da b) kullanıcı `dinosaur` sorgusunu talep ederse yalnızca bir tanesini iletecektir.

```tsx
const dinosaurs = [
  {
    name: "Aardonyx",
    description: "Bir sauropodların evriminde erken bir aşama.",
  },
  {
    name: "Abelisaurus",
    description: '"Abel\'in kertenkeleleri" tek bir kafatasından yeniden inşa edilmiştir.',
  },
];

export const resolvers = {
  Query: {
    dinosaurs: () => dinosaurs,
    dinosaur: (_: any, args: any) => {
      return dinosaurs.find((dinosaur) => dinosaur.name === args.name);
    },
  },
};
```

:::tip
Sonuncusunda, istemciden gelen argümanları bir işlevde geçerek ismi veri kümesindeki bir isimle eşleştiriyoruz.
:::

## main.ts

`main.ts` dosyamızda `ApolloServer`'ı, `graphql`'ı ve şemamızdan `typeDefs` ve `resolvers`'ı içe aktaracağız:

```tsx
import { ApolloServer } from "npm:@apollo/server@^4.1";
import { startStandaloneServer } from "npm:@apollo/server@4.1/standalone";
import { graphql } from "npm:graphql@16.6";
import { typeDefs } from "./schema.ts";
import { resolvers } from "./resolvers.ts";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 8000 },
});

console.log(`Sunucu çalışıyor: ${url}`);
```

:::warning
`typeDefs` ve `resolvers`'ı `ApolloServer`'a geçirerek yeni bir sunucu başlatıyoruz. 
:::

Son olarak, `startStandaloneServer` sunucunun hızlıca çalışmasını sağlamak için bir yardımcı işlevdir.

## Sunucuyu Çalıştırma

Artık yapmamız gereken tek şey sunucuyu çalıştırmak:

```shell
deno run --allow-net --allow-read --allow-env main.ts
```

Terminalinizde `Sunucu çalışıyor: 127.0.0.1:8000` mesajını görmelisiniz. O adrese gittiğinizde, `dinosaurs` sorgumuzu girebileceğimiz Apollo kumanda panelini göreceksiniz:

```graphql
query {
  dinosaurs {
    name
    description
  }
}
```

Bu, veri kümesini döndürecektir:

```graphql
{
  "data": {
    "dinosaurs": [
      {
        "name": "Aardonyx",
        "description": "Bir sauropodların evriminde erken bir aşama."
      },
      {
        "name": "Abelisaurus",
        "description": "\"Abel'in kertenkeleleri\" tek bir kafatasından yeniden inşa edilmiştir."
      }
    ]
  }
}
```

Sadece bir `dinosaur` almak istersek:

```graphql
query {
  dinosaur(name:"Aardonyx") {
    name
    description
  }
}
```

Bu da döner:

```graphql
{
  "data": {
    "dinosaur": {
      "name": "Aardonyx",
      "description": "Bir sauropodların evriminde erken bir aşama."
    }
  }
}
```

Harika!

:::note
[Apollo ve GraphQL'i kullanma ile ilgili daha fazla bilgi edinin.](https://www.apollographql.com/tutorials/)
:::