---
title: "Başlangıç şablonu ile bir React uygulaması oluşturun"
description: Bu öğreticide Deno ile basit bir React uygulaması oluşturacağız. Uygulama, dinozorların bir listesini gösterecek ve daha fazla detay için sizi ayrı bir sayfaya yönlendirecek.
keywords: [React, Deno, Vite, uygulama geliştirme, JavaScript, dinozor, API]
---

[React](https://reactjs.org) en yaygın kullanılan JavaScript ön yüz kütüphanesidir.

Bu öğreticide Deno ile basit bir React uygulaması oluşturacağız. Uygulama, dinozorların bir listesini gösterecek. Birine tıkladığınızda, sizi daha fazla detay içeren bir dinozor sayfasına götürecektir. Tamamlanmış [uygulama deposunu GitHub'da](https://github.com/denoland/tutorial-with-react-denojson) görebilirsiniz.

![uygulamanın demo görüntüsü](../../../../images/cikti/denoland/runtime/tutorials/images/how-to/react/react-dinosaur-app-demo.gif)

:::info
Bu öğretici, uygulamayı yerel olarak sunmak için [Vite](https://vitejs.dev/) kullanacaktır. Vite, modern web projeleri için bir yapı aracı ve geliştirme sunucusudur.
:::

Vite, React ve Deno ile iyi bir uyum sağlar, ES modüllerini kullanır ve React bileşenlerini doğrudan içe aktarmanıza olanak tanır.

## Başlangıç uygulaması

Sizin için kullanabileceğiniz bir [başlangıç şablonu oluşturduk](https://github.com/denoland/react-vite-ts-template). Bu, React, Vite ve projenizi yapılandırmanız için bir deno.json dosyası ile temel bir başlangıç uygulaması kuracaktır. GitHub deposuna gidin [https://github.com/denoland/react-vite-ts-template](https://github.com/denoland/react-vite-ts-template) ve yeni bir depo oluşturmak için "Bu şablonu kullan" butonuna tıklayın.

Şablondan yeni bir depo oluşturduktan sonra, bunu yerel makinenize klonlayın ve proje dizinine gidin.

## Depoyu yerel olarak klonlayın

```sh
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

## Bağımlılıkları kurun

Projenin bağımlılıklarını kurmak için şu komutu çalıştırın:

```sh
deno install
```

## Geliştirme sunucusunu çalıştırın

Artık yeni React uygulamanızı çalıştırmak için şu komutu kullanabilirsiniz:

```sh
deno run dev
```

:::tip
Bu, Vite sunucusunu başlatacaktır, çıktıyı tıkladığınızda tarayıcıda uygulamanızı görebileceksiniz.
:::

## Şablon hakkında

Klonladığınız şablon deposunda temel bir React uygulaması bulunmaktadır. Uygulama Vite'i geliştirme sunucusu olarak kullanmakta ve [oak](https://jsr.io/@oak/oak) ile oluşturulmuş bir statik dosya sunucusu sağlamaktadır, bu, dağıtıldığında oluşturulan uygulamayı sunacaktır. React uygulaması `client` klasöründe ve arka uç sunucusu `server` klasöründedir.

`deno.json` dosyası, projenin yapılandırılması ve uygulamanın çalışması için gerekli izinleri belirtmek için kullanılır, `deno run` ile çalıştırılabilen `tasks` alanını içerir. `dev` görevini çalıştırdığında Vite sunucusunu çalıştırır ve `build` görevi uygulamayı Vite ile oluşturur, `serve` görevi ise oluşturulan uygulamayı sunmak için arka uç sunucusunu çalıştırır.

## Arka uç API ekleme

Şablonla birlikte sunulan sunucuya bir API inşa edeceğiz. Bu, dinozor verilerimizi alacağımız yer olacak.

Yeni projenizin `server` dizininde bir `api` klasörü oluşturun. O klasörde, sabit kodlanmış dinozor verilerini içerecek bir `data.json` dosyası oluşturun.

[`this json file`](https://github.com/denoland/tutorial-with-react/blob/main/api/data.json) içeriğini `api/data.json` dosyasına kopyalayıp yapıştırın. (Gerçek bir uygulama inşa ediyorsanız, bu verileri muhtemelen bir veritabanından veya harici bir API'den alırdınız.)

Şablonla birlikte gelen sunucunun içine dinozor bilgilerini döndüren bazı API yolları oluşturacağız, `CORS`'u etkinleştirmek için [`cors` middleware](https://jsr.io/@tajpouria/cors) kullanmamız gerekecek.

Projenize cors bağımlılığını eklemek için `deno install` komutunu kullanın:

```shell
deno install jsr:@tajpouria/cors
```

Sonra, `server/main.ts` dosyasını güncelleyerek gerekli modülleri içe aktarın ve bazı yolları tanımlamak için yeni bir `Router` örneği oluşturun:

```ts title="main.ts"
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import data from "./api/data.json" with { type: "json" };

export const app = new Application();
const router = new Router();
```

:::note
Bu aşamadan sonra, aynı dosyada, iki yol tanımlayacağız.
:::

Birincisi `/api/dinosaurs` yolunda, tüm dinozorları döndürecek ve ikincisi `/api/dinosaurs/:dinosaur` ile URL'deki adı baz alarak belirli bir dinozoru döndürecek:

```ts title="main.ts"
router.get("/api/dinosaurs", (context) => {
  context.response.body = data;
});

router.get("/api/dinosaurs/:dinosaur", (context) => {
  if (!context?.params?.dinosaur) {
    context.response.body = "Dinozor adı sağlanmadı.";
  }

  const dinosaur = data.find((item) =>
    item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
  );

  context.response.body = dinosaur ?? "Dinozor bulunamadı.";
});
```

Aynı dosyanın en altına, yeni tanımladığımız yolları uygulamaya ekleyeceğiz. Şablondan alınan statik dosya sunucusunu da dahil etmemiz gerekiyor ve nihayetinde sunucuyu 8000 portunda dinlemeye başlayacağız:

```ts title="main.ts"
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/client/dist`,
  `${Deno.cwd()}/client/public`,
]));

if (import.meta.main) {
  console.log("Sunucu http://localhost:8000 portunda dinliyor");
  await app.listen({ port: 8000 });
}
```

API sunucusunu `deno run --allow-env --allow-net server/main.ts` komutunu kullanarak çalıştırabilirsiniz. Bu komutu arka planda çalıştırmak için bir görev oluşturup geliştirme görevini, hem React uygulaması hem de API sunucusunu çalıştıracak şekilde güncelleyeceğiz.

`package.json` dosyanızda `scripts` alanını şu şekilde güncelleyin:

```diff title="deno.json"
{
  "tasks": {
+   "dev": "deno run -A --node-modules-dir=auto npm:vite & deno run server:start",
    "build": "deno run -A --node-modules-dir=auto npm:vite build",
    "server:start": "deno run -A --node-modules-dir --watch ./server/main.ts",
    "serve": "deno run build && deno run server:start"
  }
}
```

Artık `deno run dev` komutunu çalıştırırsanız ve `localhost:8000/api/dinosaurs` adresine giderseniz, tarayıcınızda tüm dinozorların bir JSON yanıtını görmelisiniz.

## Giriş noktası güncelleme

React uygulamasının giriş noktası `client/src/main.tsx` dosyasında bulunmaktadır. Bizimki oldukça basit olacak:

```tsx title="main.tsx"
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## Router ekleme

Uygulama, iki yola sahip olacak: `/` ve `/:dinosaur`.

[`react-router-dom`](https://reactrouter.com/en/main) kullanarak bazı yönlendirme mantıkları oluşturacağız, bu nedenle projenize `react-router-dom` bağımlılığını eklememiz gerekecek. Proje kök dizininde çalıştırın:

```shell
deno install npm:react-router-dom
```

`/src/App.tsx` dosyasını güncelleyerek `react-router-dom`'dan [`BrowserRouter`](https://reactrouter.com/en/main/router-components/browser-router) bileşenini içe aktarın ve iki yolu tanımlayın:

```tsx title="App.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/index.tsx";
import Dinosaur from "./pages/Dinosaur.tsx";
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

## API isteklerini iletmek için proxy oluşturma

Vite uygulamayı `3000` portunda sunacakken, API'miz `8000` portunda çalışmaktadır. Bu nedenle, `api/` yollarının yönlendirici tarafından erişilebilir olabilmesi için bir proxy ayarlamamız gerekecek. `vite.config.ts` dosyasına bir proxy ayarı ekleyin:

```diff title="vite.config.ts"
export default defineConfig({
  root: "./client",
  server: {
    port: 3000,
+   proxy: {
+     "/api": {
+       target: "http://localhost:8000",
+       changeOrigin: true,
+     },
+   },
  },
});
```

## Sayfaları oluşturma

İki sayfa oluşturacağız: `Index` ve `Dinosaur`. `Index` sayfası tüm dinozorları listeleyecek ve `Dinosaur` sayfası belirli bir dinozorun detaylarını gösterecektir.

`src` dizininde bir `pages` klasörü oluşturun ve içine `index.tsx` ve `Dinosaur.tsx` adlı iki dosya oluşturun.

### Türler

Her iki sayfa da API'den bekledikleri verilerin şekillenmesini tanımlamak için `Dino` türünü kullanacak, bu nedenle `src` dizininde bir `types.ts` dosyası oluşturalım:

```ts title="types.ts"
export type Dino = { name: string; description: string };
```

### index.tsx

Bu sayfa, API'den dinozorların listesini alacak ve bunları bağlantılar olarak görselleştirecek:

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
      <p>Aşağıdaki dinozorlardan birine tıklayarak daha fazla bilgi edinebilirsiniz.</p>
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

Bu sayfa, API'den belirli bir dinozorun detaylarını alacak ve bunları bir paragrafta gösterecektir:

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
      <Link to="/">🠠 Tüm dinozolara geri dön</Link>
    </div>
  );
}
```

### Dinozor listesini stilize etme

Ana sayfada dinozor listesini görüntüleyeceğimiz için, bazı temel biçimlendirmeler yapalım. Bunu sağlamak için `src/App.css` dosyasının altına şu satırları ekleyin:

```css title="src/App.css"
.dinosaur {
  display: block;
}
```

## Uygulamayı çalıştırma

Uygulamayı çalıştırmak için daha önce ayarladığınız görevi kullanın.

```sh
deno run dev
```

Tarayıcınızda yerel Vite sunucusuna gidin (`localhost:5173`) ve tüm dinozorların görüntüleneceğini göreceksiniz.

![uygulamanın demo görüntüsü](../../../../images/cikti/denoland/runtime/tutorials/images/how-to/react/react-dinosaur-app-demo.gif)

## Oluşturma ve dağıtım

Klonladığınız şablon, uygulamayı oluşturup arka uç sunucusuyla sunan bir `serve` görevine sahiptir. Uygulamayı oluşturmak ve sunmak için şu komutu çalıştırın:

```sh
deno run serve
```

Tarayıcınızda `localhost:8000` adresine giderseniz, uygulamanın çalıştığını görmelisiniz!

:::warning
Bu uygulamayı favori bulut sağlayıcınıza dağıtabilirsiniz. Basit ve kolay bir dağıtım deneyimi için [Deno Deploy](https://deno.com/deploy) kullanmanızı öneririz.
:::

Deno Deploy'a dağıtım yapmak için [Deno Deploy kontrol paneline](https://dash.deno.com) gidin ve yeni bir proje oluşturun. Ardından, GitHub deponuzu bağlayarak ve dağıtmak istediğiniz dalı seçerek uygulamayı dağıtabilirsiniz.

Projeye bir isim verin ve `oluşturma adımının` `deno run build` olarak ayarlandığından ve `Giriş Noktası`nın `./server.main.ts` olduğundan emin olun.

`Dağıtım Projesi` butonuna tıklayın ve uygulamanız aktif hale gelecektir!

🦕 Artık Vite ve Deno ile bir React uygulaması oluşturabilir ve geliştirebilirsiniz! Hızlı web uygulamaları oluşturmak için hazırsınız. Bu uç teknolojileri keşfederken keyif almanızı umuyoruz, neler yaptığınızı görmek için sabırsızlanıyoruz!