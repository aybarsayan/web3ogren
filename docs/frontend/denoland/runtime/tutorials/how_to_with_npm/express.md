---
description: Deno ile Express kullanarak basit bir API oluşturmanın adımlarını öğrenin. Bu kılavuz, verilerin nasıl ekleneceğini ve rotaların nasıl yapılandırılacağını göstermektedir.
keywords: [Deno, Express, API, middleware, JavaScript]
---

[Express](https://expressjs.com/) basit ve tarafsız olmasıyla bilinen, geniş bir middleware ekosistemine sahip popüler bir web çerçevesidir.

Bu nasıl yapılır kılavuzu, size **Express** ve **Deno** kullanarak basit bir API oluşturmayı gösterecektir.

[Kaynağı burada görüntüle.](https://github.com/denoland/examples/tree/main/with-express)

## `main.ts` Oluşturma

Hadi `main.ts` oluşturalım:

```console
touch main.ts
```

`main.ts` içinde basit bir sunucu oluşturalım:

```ts
// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";

const app = express();

app.get("/", (req, res) => {
  res.send("Dinozor API'sine hoş geldiniz!");
});

app.listen(8000);
```

Bu sunucuyu çalıştıralım:

```console
deno run -A main.ts
```

:::tip
Tarayıcınızı `localhost:8000` adresine yönlendirdiğinizde **"Dinozor API'sine hoş geldiniz!"** mesajını görmelisiniz.
:::

## Veri ve Rotalar Ekleme

Buradaki bir sonraki adım, biraz veri eklemektir. [Bu makaleden](https://www.thoughtco.com/dinosaurs-a-to-z-1093748) bulduğumuz Dinozor verisini kullanacağız. İsterseniz 
[burasıdan kopyalayabilirsiniz](https://github.com/denoland/examples/blob/main/with-express/data.json).

`data.json` oluşturalım:

```console
touch data.json
```

Ve dinozor verisini yapıştırın.

Sonra, bu veriyi `main.ts` içine aktaralım. Dosyanın başına şu satırı ekleyelim:

```ts
import data from "./data.json" assert { type: "json" };
```

Daha sonra, bu verilere erişim sağlamak için rotalar oluşturabiliriz. Bunu basit tutmak için, yalnızca `/api/` ve `/api/:dinosaur` için `GET` işleyicileri tanımlayalım. Aşağıdaki kodu `const app = express();` satırının altına ekleyin:

```ts
app.get("/", (req, res) => {
  res.send("Dinozor API'sine hoş geldiniz!");
});

app.get("/api", (req, res) => {
  res.send(data);
});

app.get("/api/:dinosaur", (req, res) => {
  if (req?.params?.dinosaur) {
    const found = data.find((item) =>
      item.name.toLowerCase() === req.params.dinosaur.toLowerCase()
    );
    if (found) {
      res.send(found);
    } else {
      res.send("Hiç dinozor bulunamadı.");
    }
  }
});

app.listen(8000);
```

Sunucuyu `deno run -A main.ts` ile çalıştıralım ve `localhost:8000/api` adresine bakalım. Bir dinozor listesini görmelisiniz:

```json
[
  {
    "name": "Aardonyx",
    "description": "Sauropodların evriminde erken bir aşama."
  },
  {
    "name": "Abelisaurus",
    "description": "\"Abel'in kertenkeleleri\" tek bir kafatasından yeniden inşa edilmiştir."
  },
  {
    "name": "Abrictosaurus",
    "description": "Heterodontosaurus'un erken bir akrabası."
  },
  ...
]
```

Ve `localhost:8000/api/aardonyx` adresine gittiğimizde:

```json
{
  "name": "Aardonyx",
  "description": "Sauropodların evriminde erken bir aşama."
}
```

:::info
Veritabanınıza eklediğiniz her dinozor için `GET` isteği ile ayrıntılarını görüntüleyebilirsiniz.
:::

**Harika!**