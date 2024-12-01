---
title: "MySQL2'yi Deno ile Kullanma"
description: "Bu belge, Deno ile MySQL veritabanını kullanmak için `mysql2` paketinin nasıl kullanılacağını adım adım anlatmaktadır. MySQL sunucusuna bağlantı sağlama, veritabanı oluşturma ve temel sorgulamaların nasıl yapıldığı hakkında bilgiler içermektedir."
keywords: [Deno, MySQL, mysql2, veritabanı, Node.js]
---

[MySQL](https://www.mysql.com/) en popüler veritabanıdır ve 
[2022 Stack Overflow Geliştirici Anketi](https://survey.stackoverflow.co/2022/#most-popular-technologies-database)nde
Facebook, Twitter, YouTube ve Netflix gibi kullanıcıları bulunmaktadır.

[Kaynağı buradan görüntüleyin.](https://github.com/denoland/examples/tree/main/with-mysql2)

Deno ile bir MySQL veritabanını `mysql2` node paketini kullanarak ve `npm:mysql2` ile içe aktararak manipüle edebilir ve sorgulayabilirsiniz. Bu,   
Promise sarmalayıcısını kullanmamıza ve üst düzey await avantajlarından yararlanmamıza olanak tanır.

```tsx
import mysql from "npm:mysql2@^2.3.3/promise";
```

## MySQL'e Bağlanma

:::info 
MySQL sunucumuza `createConnection()` yöntemini kullanarak bağlanabiliriz. 
Host'a (`test ediyorsanız `localhost`, muhtemelen üretimde bulut veritabanı uç noktası) ve kullanıcı ve şifreye ihtiyacınız var:
:::

```tsx
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});
```

Bağlantı oluşturma sırasında isteğe bağlı olarak bir veritabanı da belirtebilirsiniz. Burada `mysql2` kullanarak veritabanını anında oluşturacağız.

## Veritabanını Oluşturma ve Doldurma

:::tip
Bağlantınız çalışmaya başladığında, veritabanları ve tablolar oluşturmak, ayrıca başlangıç verilerini eklemek için `connection.query()` ile SQL komutlarını kullanabilirsiniz.
:::

Öncelikle kullanmak için veritabanını oluşturmak ve seçmek istiyoruz:

```tsx
await connection.query("CREATE DATABASE denos");
await connection.query("use denos");
```

Sonrasında tabloyu oluşturmak istiyoruz:

```tsx
await connection.query(
  "CREATE TABLE `dinosaurs` (   `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,   `name` varchar(255) NOT NULL,   `description` varchar(255) )",
);
```

> **Not**: Tablo oluşturulduktan sonra verileri doldurabiliriz.

```tsx
await connection.query(
  "INSERT INTO `dinosaurs` (id, name, description) VALUES (1, 'Aardonyx', 'Sauropodların evriminde erken bir aşama.'), (2, 'Abelisaurus', 'Abel'in kertenkele'si tek bir kafatasından yeniden yapılandırılmıştır.'), (3, 'Deno', 'Şimdiye kadar yaşamış en hızlı dinozor.')",
);
```

Artık sorgulamaya başlamak için tüm veriler hazır.

## MySQL Sorgulama

Aynı `connection.query()` yöntemini sorgularımızı yazmak için kullanabiliriz. Öncelikle `dinosaurs` tablosundaki tüm verileri almaya çalışıyoruz:

```tsx
const results = await connection.query("SELECT * FROM `dinosaurs`");
console.log(results);
```

Bu sorgunun sonucu veritabanımızdaki tüm verilerdir:

```tsx
[
  [
    {
      id: 1,
      name: "Aardonyx",
      description: "Sauropodların evriminde erken bir aşama."
    },
    {
      id: 2,
      name: "Abelisaurus",
      description: `Abel'in kertenkele'si tek bir kafatasından yeniden yapılandırılmıştır.`
    },
    { id: 3, name: "Deno", description: "Şimdiye kadar yaşamış en hızlı dinozor." }
  ],
```

Eğer veritabanından sadece tek bir elementi almak istiyorsak, sorgumuzu değiştirebiliriz:

```tsx
const [results, fields] = await connection.query(
  "SELECT * FROM `dinosaurs` WHERE `name` = 'Deno'",
);
console.log(results);
```

Bu, bize tek bir satır sonucunu verir:

```tsx
[{ id: 3, name: "Deno", description: "Şimdiye kadar yaşamış en hızlı dinozor." }];
```

Son olarak, bağlantıyı kapatabiliriz:

```tsx
await connection.end();
```

:::warning
`mysql2` hakkında daha fazla bilgi için belgelerine göz atabilirsiniz 
[buradan](https://github.com/sidorares/node-mysql2).
:::