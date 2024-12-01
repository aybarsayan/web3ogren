---
title: "Deno ile Planetscale Kullanımı"
description: Deno ile Planetscale veritabanını kullanarak veritabanı oluşturma, yönetme ve sorgulama süreçlerine dair adım adım bir kılavuz. Bu içerik, geliştiricilere Deno ve Planetscale ile veritabanı uygulamaları geliştirmeleri için gereken bilgileri sunar.
keywords: [Deno, Planetscale, veritabanı, SQL, sunucusuz, geliştirici, programlama]
---

Planetscale, geliştiricilerin komut satırı üzerinden veritabanları oluşturup, dallandırıp ve dağıtabildiği bir geliştirici iş akışı ile tasarlanmış, MySQL uyumlu bir sunucusuz veritabanıdır.

[Kaynağı buradan görüntüleyin.](https://github.com/denoland/examples/tree/main/with-planetscale)

Deno ile çalışmak için Planetscale sunucusuz sürücüsünü, `@planetscale/database`, kullanacağız. İlk olarak `main.ts` dosyasını oluşturmak ve bu paketten `connect` yöntemini içe aktarmak istiyoruz:

```tsx
import { connect } from "npm:@planetscale/database@^1.4";
```

## Bağlantımızı Yapılandırma

Bağlantı üç kimlik bilgisi gerektirir: host, kullanıcı adı ve şifre. Bunlar veritabanına özeldir, bu nedenle önce Planetscale'de bir veritabanı oluşturmalıyız. Bunu başlangıç talimatlarını takip ederek yapabilirsiniz [burada](https://planetscale.com/docs/tutorials/planetscale-quick-start-guide).

:::tip
Şemayı eklemek için endişelenmeyin—bunu `@planetscale/database` üzerinden yapabiliriz.
:::

Veritabanını oluşturduktan sonra, Genel Bakış'a gidin, "Bağlan" seçeneğine tıklayın ve "Connect with `@planetscale/database`" seçeneğini seçin. Böylece host ve kullanıcı adını alabilirsiniz. Ardından, veritabanınız için yeni bir şifre oluşturmak üzere Şifreler'e tıklayın. Üç kimlik bilgisine sahip olduğunuzda, bunları doğrudan girebilir veya daha iyi bir yöntem olarak çevresel değişkenler olarak saklayabilirsiniz:

```bash
export HOST=<host>
export USERNAME=<username>
export PASSWORD=<password>
```

Ardından `Deno.env` kullanarak çağırın:

```tsx
const config = {
  host: Deno.env.get("HOST"),
  username: Deno.env.get("USERNAME"),
  password: Deno.env.get("PASSWORD"),
};

const conn = connect(config);
```

Bu, çevresel değişkenleri dashboard'da ayarlarsanız Deno Deploy'de de çalışacaktır. Şu şekilde çalıştırın:

```shell
deno run --allow-net --allow-env main.ts
```

`conn` nesnesi artık Planetscale veritabanımıza açık bir bağlantıdır.

## Veritabanı Tablosu Oluşturma ve Doldurma

Bağlantınız çalışır durumda olduğuna göre, SQL komutları ile tablolar oluşturmak ve başlangıç verilerini eklemek için `conn.execute()` kullanabilirsiniz:

```tsx
await conn.execute(
  "CREATE TABLE dinosaurs (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, name varchar(255) NOT NULL, description varchar(255) NOT NULL);",
);
await conn.execute(
  "INSERT INTO `dinosaurs` (id, name, description) VALUES (1, 'Aardonyx', 'Sauropodların evriminde erken bir aşama.'), (2, 'Abelisaurus', 'Abel'in kertenkeleyi tek bir kafadan yeniden yapılandırıldığı.') , (3, 'Deno', 'Hayatını yaşayan en hızlı dinozor.')",
);
```

## Planetscale Sorgulama

Aynı `conn.execute()` yöntemini sorgularımızı yazmak için de kullanabiliriz. Dinozorlarımızın bir listesini alalım:

```tsx
const results = await conn.execute("SELECT * FROM `dinosaurs`");
console.log(results.rows);
```

:::info
Sonuç:
:::

```tsx
[
  {
    id: 1,
    name: "Aardonyx",
    description: "Sauropodların evriminde erken bir aşama.",
  },
  {
    id: 2,
    name: "Abelisaurus",
    description: "Abel'in kertenkeleyi tek bir kafadan yeniden yapılandırıldığı.",
  },
  { id: 3, name: "Deno", description: "Hayatını yaşayan en hızlı dinozor." },
];
```

Ayrıca bir dinozor adı belirtmek suretiyle veritabanından yalnızca tek bir satır alabiliriz:

```tsx
const result = await conn.execute(
  "SELECT * FROM `dinosaurs` WHERE `name` = 'Deno'",
);
console.log(result.rows);
```

Bu da bize tek bir satır sonucu verir:

```tsx
[{ id: 3, name: "Deno", description: "Hayatını yaşayan en hızlı dinozor." }];
```

Planetscale ile çalışma hakkında daha fazla bilgiye [belgelerinden](https://planetscale.com/docs) ulaşabilirsiniz.