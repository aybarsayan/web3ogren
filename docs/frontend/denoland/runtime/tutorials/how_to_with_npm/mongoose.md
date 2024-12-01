---
title: "Deno ile Mongoose Kullanma"
description: Deno projenizle Mongoose ve MongoDB'yi nasıl kuracağınızı öğrenin. Bu eğitim, Mongoose'un temel bileşenleri ile MongoDB'ye bağlanmayı ve veri manipülasyonunu kapsamaktadır.
keywords: [Deno, Mongoose, MongoDB, veri modeli, örnek uygulama]
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/mongoose/
---

[Mongoose](https://mongoosejs.com/) popüler, şemaya dayalı bir kütüphanedir ve
[MongoDB](https://www.mongodb.com/) için verileri modellemek üzere tasarlanmıştır. MongoDB doğrulama, tür dönüştürme ve diğer ilgili iş mantıklarını yazmayı basit hale getirir.

Bu eğitim, Deno projenizle Mongoose ve MongoDB'yi nasıl kuracağınızı gösterecektir.

[Kaynağı görüntüle](https://github.com/denoland/examples/tree/main/with-mongoose) veya
[video rehberini kontrol edin](https://youtu.be/dmZ9Ih0CR9g).

## Mongoose Modeli Oluşturma

MongoDB'ye bağlanan, bir `Dinosaur` modeli oluşturan ve veritabanına bir dinozor ekleyip güncelleyen basit bir uygulama oluşturalım.

Öncelikle, gerekli dosyaları ve dizinleri oluşturacağız:

```console
touch main.ts && mkdir model && touch model/Dinosaur.ts
```

`/model/Dinosaur.ts` dosyasında, `npm:mongoose`'i içe aktaracağız, [şemayı] tanımlayacağız
ve dışa aktaracağız:

```ts
import { model, Schema } from "npm:mongoose@^6.7";

// Şemayı tanımla.
const dinosaurSchema = new Schema({
  name: { type: String, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Doğrulamalar
dinosaurSchema.path("name").required(true, "Dinozor adı boş olamaz.");
dinosaurSchema.path("description").required(
  true,
  "Dinozor açıklaması boş olamaz.",
);

// Modeli dışa aktar.
export default model("Dinosaur", dinosaurSchema);
```

## MongoDB'ye Bağlantı

Şimdi, `main.ts` dosyamızda, mongoose'u ve `Dinosaur` şemasını içe aktaracağız ve
MongoDB'ye bağlanacağız:

```ts
import mongoose from "npm:mongoose@^6.7";
import Dinosaur from "./model/Dinosaur.ts";

await mongoose.connect("mongodb://localhost:27017");

// Bağlantı durumunu kontrol et.
console.log(mongoose.connection.readyState);
```

Deno, üst düzey `await` desteği sağladığından, basitçe 
`await mongoose.connect()` yazabiliyoruz.

Bunu çalıştırdığımızda, `1` logunu beklemeliyiz:

```shell
$ deno run --allow-read --allow-sys --allow-env --allow-net main.ts
1
```

Başarılı oldu!

---

## Verileri Manipüle Etme

:::tip
Dinosaur modelinizde, farklı örnek yöntemler ekleyerek daha karmaşık işlemler gerçekleştirebilirsiniz.
:::

`/model/Dinosaur.ts` dosyamızda `Dinosaur` şemasına bir örnek [metodu](https://mongoosejs.com/docs/guide.html#methods) ekleyelim:

```ts
// ./model/Dinosaur.ts

// Yöntemler.
dinosaurSchema.methods = {
  // Açıklamayı güncelle.
  updateDescription: async function (description: string) {
    this.description = description;
    return await this.save();
  },
};

// ...
```

Bu örnek metodu, `updateDescription`, bir kaydın açıklamasını güncellemenizi sağlayacak.

`main.ts` dosyasına geri dönerek, MongoDB'de veri eklemeye ve manipüle etmeye başlayalım.

```ts
// main.ts

// Yeni bir Dinozor oluştur.
const deno = new Dinosaur({
  name: "Deno",
  description: "Dünyada yaşamış en hızlı dinozor.",
});

// Deno'yu ekle.
await deno.save();

// Deno'yu adıyla bul.
const denoFromMongoDb = await Dinosaur.findOne({ name: "Deno" });
console.log(
  `MongoDB'de Deno'yu Bulma -- \n  ${denoFromMongoDb.name}: ${denoFromMongoDb.description}`,
);

// Deno'nun açıklamasını güncelle ve kaydet.
await denoFromMongoDb.updateDescription(
  "Dünyada yaşamış en hızlı ve en güvenli dinozor.",
);

// Deno'nun güncellenmiş açıklamasını görmek için MongoDB'yi kontrol et.
const newDenoFromMongoDb = await Dinosaur.findOne({ name: "Deno" });
console.log(
  `Deno'yu (tekrar) Bulma -- \n  ${newDenoFromMongoDb.name}: ${newDenoFromMongoDb.description}`,
);
```

Kodu çalıştırdığımızda, şu sonucu alıyoruz:

```console
MongoDB'de Deno'yu Bulma --
  Deno: Dünyada yaşamış en hızlı dinozor.
Deno'yu (tekrar) Bulma --
  Deno: Dünyada yaşamış en hızlı ve en güvenli dinozor.
```

"Harika!" 

:::info
Mongoose'un sunduğu şema doğrulama ve tür yönetimi özellikleri, veritabanı işlemlerinizin güvenilirliğini artırır.
:::

Mongoose kullanımıyla ilgili daha fazla bilgi için lütfen 
[belgelerine](https://mongoosejs.com/docs/guide.html) başvurun.