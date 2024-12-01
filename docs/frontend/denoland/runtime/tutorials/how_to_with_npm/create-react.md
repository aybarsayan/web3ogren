---
title: "create-vite ile React uygulaması oluşturma"
description: Bu eğitimde Deno ile basit bir React uygulaması oluşturacağız. Uygulama, bir grup dinozorun listesini gösterecek ve daha fazla ayrıntı için dinozor sayfasına yönlendirecek.
keywords: [React, Vite, Deno, uygulama geliştirme, JavaScript]
---

[React](https://reactjs.org) en yaygın kullanılan JavaScript frontend kütüphanesidir.

Bu eğitimde, Deno ile basit bir React uygulaması oluşturacağız. Uygulama, bir grup dinozorun listesini gösterecek. Birine tıkladığınızda, daha fazla ayrıntıyı içeren bir dinozor sayfasına gideceksiniz. Bitmiş uygulama depolarını
[GitHub'da](https://github.com/denoland/tutorial-with-react) görebilirsiniz.

![uygulamanın demosu](../../../../images/cikti/denoland/runtime/tutorials/images/how-to/react/react-dinosaur-app-demo.gif)

## Vite ve Deno ile bir React uygulaması oluşturma

:::info
Bu eğitimde, [create-vite](https://vitejs.dev/) kullanarak Deno ve React uygulamasını hızlıca başlatacağız. Vite, modern web projeleri için bir yapı aracı ve geliştirme sunucusudur.
:::

Vite, React ve Deno ile iyi bir uyum sağlar, ES modüllerini kullanarak React bileşenlerini doğrudan içe aktarmanıza olanak tanır.

Terminalinizde, TypeScript şablonunu kullanarak Vite ile yeni bir React uygulaması oluşturmak için aşağıdaki komutu çalıştırın:

```sh
deno run -A npm:create-vite@latest --template react-ts
```

İstendiğinde, uygulamanıza bir ad verin ve yeni oluşturulan proje dizinine `cd` yapın. Daha sonra bağımlılıkları yüklemek için aşağıdaki komutu çalıştırın:

```sh
deno install
```

Artık yeni React uygulamanızı başlatmak için aşağıdakini çalıştırabilirsiniz:

```sh
deno task dev
```

Bu, Vite sunucusunu başlatacaktır; tarayıcıda uygulamanızı görmek için çıktıda sağlanan localhost bağlantısına tıklayın. Eğer
`VSCode için Deno uzantısını` yüklediyseniz, editör kodda bazı hataları vurguladığını görebilirsiniz. 

> Bu, Vite tarafından oluşturulan uygulamanın Node göz önünde bulundurularak tasarlandığı ve Deno'nun kullanmadığı bazı varsayımları (örneğin, 'gevşek içe aktarımlar' - dosya uzantısız modülleri içe aktarma) kullandığı içindir. 
> — Deno uzantısını devre dışı bırakın veya `deno.json dosyası ile React uygulaması oluşturma eğitimini` deneyin.

## Bir backend ekleyin

Sonraki adım, bir backend API eklemektir. Çok basit bir dinozor bilgileri döndüren API oluşturacağız.

Yeni projenizin kök dizininde bir `api` klasörü oluşturun. O klasörde, sunucuyu çalıştıracak bir `main.ts` dosyası ve kodlanmış dinozor verilerini içerecek bir `data.json` dosyası oluşturun.

[Aşağıdakilerdeki json dosyasını](https://github.com/denoland/tutorial-with-react/blob/main/api/data.json) `api/data.json` dosyasına kopyalayın ve yapıştırın.

Dinozor bilgilerini döndüren yollarla basit bir API sunucusu oluşturacağız. [`oak` middleware framework'ünü](https://jsr.io/@oak/oak) ve [`cors` middleware'ini](https://jsr.io/@tajpouria/cors) kullanarak
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) desteği ekleyeceğiz.

Projenize gerekli bağımlılıkları eklemek için `deno add` komutunu kullanın:

```shell
deno add jsr:@oak/oak jsr:@tajpouria/cors
```

Sonra, `api/main.ts` dosyasını gerekli modülleri içe aktarmak ve bazı yollar tanımlamak için yeni bir `Router` örneği oluşturacak şekilde güncelleyin:

```ts title="main.ts"
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import data from "./data.json" with { type: "json" };

const router = new Router();
```

Bundan sonra aynı dosyada, iki yol tanımlayacağız. Bir `/api/dinosaurs` yoluyla tüm dinozorları dönecek ve diğeri `/:dinosaur` yolu ile URL'deki isme bağlı olarak belirli bir dinozoru dönecek:

```ts title="main.ts"
router.get("/api/dinosaurs", (context) => {
  context.response.body = data;
});

router.get("/api/dinosaurs/:dinosaur", (context) => {
  if (!context?.params?.dinosaur) {
    context.response.body = "Dinozor adı verilmedi.";
  }

  const dinosaur = data.find((item) =>
    item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
  );

  context.response.body = dinosaur ?? "Dinozor bulunamadı.";
});
```

Son olarak, aynı dosyanın en altında yeni bir `Application` örneği oluşturun ve tanımladığımız yolları uygulamaya eklemek için `app.use(router.routes())` kullanarak sunucuyu 8000 portunda dinlemeye başlayın:

```ts title="main.ts"
const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
```

API sunucusunu `deno run --allow-env --allow-net api/main.ts` komutunu çalıştırarak başlatabilirsiniz. Bu komutu arka planda çalıştırmak için bir görev oluşturacağız ve geliştirme görevini, hem React uygulamasını hem de API sunucusunu çalıştıracak şekilde güncelleyeceğiz.

`package.json` dosyanızda `scripts` bölümünü aşağıdaki gibi güncelleyin:

```jsonc
{
  "scripts": {
    "dev": "deno task dev:api & deno task dev:vite",
    "dev:api": "deno run --allow-env --allow-net api/main.ts",
    "dev:vite": "deno run -A npm:vite",
    // ...
}
```

Artık `deno task dev` komutunu çalıştırırsanız ve `localhost:8000/api/dinosaurs` adresini tarayıcınızda ziyaret ederseniz, tüm dinozorların JSON yanıtını görmelisiniz.

## Giriş noktasını güncelleyin

React uygulamasının giriş noktası `src/main.tsx` dosyasındadır. Bizimki çok temel olacak:

```tsx title="main.tsx"
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />,
);
```

## Bir yönlendirici ekle

Uygulama iki yolu olacak: `/` ve `/:dinosaur`.

Biraz yönlendirme mantığı oluşturmak için [`react-router-dom`](https://reactrouter.com/en/main) kullanacağız, böylece projenize `react-router-dom` bağımlılığını eklememiz gerekecek. Proje kök dizininde aşağıdakileri çalıştırın:

```shell
deno add npm:react-router-dom
```

`/src/App.tsx` dosyasını güncelleyerek `react-router-dom` kütüphanesinden [`BrowserRouter`](https://reactrouter.com/en/main/router-components/browser-router) bileşenini içe aktarın ve iki yolu tanımlayın:

```tsx title="App.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/index";
import Dinosaur from "./pages/Dinosaur";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:selectedDinosaur" element={<Dinosaur />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### API isteklerini iletmek için proxy ayarı

Vite, uygulamayı `5173` portunda sunacakken, API'miz `8000` portunda çalışıyor. Bu nedenle, yönlendiricinin `api/` yollarına ulaşabilmesi için bir proxy ayarlamamız gerekecek. `vite.config.ts` dosyasını aşağıdaki ile yapılandırmak için yeniden yazın:

```ts title="vite.config.ts"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
```

## Sayfaları oluşturun

İki sayfa oluşturacağız: `Index` ve `Dinosaur`. `Index` sayfası tüm dinozorları listeleyecek ve `Dinosaur` sayfası belirli bir dinozorun ayrıntılarını gösterecek.

`src` dizininde bir `pages` klasörü oluşturun ve o klasörde iki dosya oluşturun: `index.tsx` ve `Dinosaur.tsx`.

### Türler

Her iki sayfa da API'den bekledikleri veri şeklinin tanımı için `Dino` türünü kullanacak, bu yüzden `src` dizininde bir `types.ts` dosyası oluşturalım:

```ts title="types.ts"
export type Dino = { name: string; description: string };
```

### index.tsx

Bu sayfa, API'den dinozor listesini alacak ve bağlantı olarak görüntüleyecek:

```tsx title="index.tsx"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dino } from "../types.ts";

export default function Index() {
  const [dinosaurs, setDinosaurs] = useState<Dino[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/dinosaurs/`);
      const allDinosaurs = await response.json() as Dino[];
      setDinosaurs(allDinosaurs);
    })();
  }, []);

  return (
    <main>
      <h1>Dinozor uygulamasına hoş geldiniz</h1>
      <p>Aşağıdaki dinozorlardan birine tıklayarak daha fazla bilgi edinin.</p>
      {dinosaurs.map((dinosaur: Dino) => {
        return (
          <Link
            to={`/${dinosaur.name.toLowerCase()}`}
            key={dinosaur.name}
            className="dinosaur"
          >
            {dinosaur.name}
          </Link>
        );
      })}
    </main>
  );
}
```

### Dinosaur.tsx

Bu sayfa, API'den belirli bir dinozorun ayrıntılarını alacak ve bir paragraf içinde görüntüleyecek:

```tsx title="Dinosaur.tsx"
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Dino } from "../types";

export default function Dinosaur() {
  const { selectedDinosaur } = useParams();
  const [dinosaur, setDino] = useState<Dino>({ name: "", description: "" });

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/dinosaurs/${selectedDinosaur}`);
      const dino = await resp.json() as Dino;
      setDino(dino);
    })();
  }, [selectedDinosaur]);

  return (
    <div>
      <h1>{dinosaur.name}</h1>
      <p>{dinosaur.description}</p>
      <Link to="/">🠠 Tüm dinozorlara geri dön</Link>
    </div>
  );
}
```

### Dinozor listesinin stilini ayarlama

Ana sayfada dinozorların listesini gösterdiğimiz için, temel bir biçimlendirme yapalım. Aşağıdakileri `src/App.css` dosyasının en altına ekleyin:

```css title="src/App.css"
.dinosaur {
  display: block;
}
```

## Uygulamayı çalıştırma

Uygulamayı çalıştırmak için daha önce oluşturduğunuz görevi kullanın:

```sh
deno task dev
```

Tarayıcınızda yerel Vite sunucusuna (`localhost:5173`) gidin ve tıklanabilir dinozorların listesi ile her birinin ayrıntılarına ulaşabileceğinizi görmelisiniz.

![uygulamanın demosu](../../../../images/cikti/denoland/runtime/tutorials/images/how-to/react/react-dinosaur-app-demo.gif)

## Oluşturma ve dağıtım

Bu aşamada uygulama Vite geliştirme sunucusu tarafından sunulmaktadır. Uygulamayı üretimde sunmak için Vite ile uygulamayı oluşturabilir ve ardından oluşturulan dosyaları Deno ile sunabilirsiniz. 

:::warning
Bunu yapmak için API sunucusunu oluşturulan dosyaları sunacak şekilde güncellememiz gerekecek. 
:::

`api` dizininizde yeni bir `util` klasörü ve `routeStaticFilesFrom.ts` adında yeni bir dosya oluşturun ve aşağıdaki kodu ekleyin:

```ts title="routeStaticFilesFrom.ts"
import { Next } from "jsr:@oak/oak/middleware";
import { Context } from "jsr:@oak/oak/context";

// Statik site yollarını yapılandırın, böylece Vite yapı çıktısını ve public klasörünü sunabiliriz.
export default function routeStaticFilesFrom(staticPaths: string[]) {
  return async (context: Context<Record<string, object>>, next: Next) => {
    for (const path of staticPaths) {
      try {
        await context.send({ root: path, index: "index.html" });
        return;
      } catch {
        continue;
      }
    }

    await next();
  };
}
```

Bu middleware, `staticPaths` dizisinde sağlanan yollardan statik dosyaları sunmaya çalışacaktır. Dosya bulunamazsa, zincirdeki sonraki middleware'i çağıracaktır. Artık `api/main.ts` dosyasını bu middleware'i kullanacak şekilde güncelleyebiliriz:

```ts title="main.ts"
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import data from "./data.json" with { type: "json" };
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";

const router = new Router();

router.get("/api/dinosaurs", (context) => {
  context.response.body = data;
});

router.get("/api/dinosaurs/:dinosaur", (context) => {
  if (!context?.params?.dinosaur) {
    context.response.body = "Dinozor adı verilmedi.";
  }

  const dinosaur = data.find((item) =>
    item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
  );

  context.response.body = dinosaur ? dinosaur : "Dinozor bulunamadı.";
});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/dist`,
  `${Deno.cwd()}/public`,
]));

await app.listen({ port: 8000 });
```

`package.json` dosyanıza, uygulamanızı Vite ile oluşturup ardından API sunucusunu çalıştıracak bir `serve` betiği ekleyin:

```jsonc
{
  "scripts": {
    // ...
    "serve": "deno task build && deno task dev:api",
}
```

Artık uygulamanızı Deno ile çalıştırmak için aşağıdaki komutu çalıştırabilirsiniz:

```sh
deno task serve
```

Tarayıcınızda `localhost:8000` adresini ziyaret ettiğinizde, uygulamanın çalıştığını görmelisiniz!

🦕 Artık Vite ve Deno ile bir React uygulaması oluşturabilir ve geliştirebilirsiniz! Hızlı web uygulamaları inşa etmeye hazırsınız. Bu keskin araçları keşfetmenin tadını çıkarmanızı umuyoruz, neler oluşturduğunuzu görmek için sabırsızlanıyoruz!