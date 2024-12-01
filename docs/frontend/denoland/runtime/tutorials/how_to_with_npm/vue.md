---
title: "Vue.js Uygulaması Oluşturun"
description: Bu öğretici, Vite ve Deno ile basit bir Vue.js uygulaması oluşturmayı adım adım açıklamaktadır. Uygulama, kullanıcıların dinozorlar hakkında bilgi almasına olanak tanır.
keywords: [Vue.js, Vite, Deno, Dinozor API, Frontend Development]
---

[Vue.js](https://vuejs.org/) ilerleyici bir ön uç JavaScript framework'üdür. Dinamik ve etkileşimli kullanıcı arayüzleri oluşturmak için araçlar ve özellikler sunar.

Bu öğreticide Vite ve Deno ile basit bir Vue.js uygulaması oluşturacağız. Uygulama, dinozorların bir listesini gösterecek. Birine tıkladığınızda, daha fazla ayrıntıyla birlikte bir dinozor sayfasına gideceksiniz. Tam uygulamanın
[bitmiş halini GitHub'da](https://github.com/denoland/tutorial-with-vue) görebilirsiniz.

![Vue.js uygulaması eylemde](../../../../images/cikti/denoland/runtime/tutorials/images/how-to/vue/vue.gif)

## Vite ve Deno ile Vue.js uygulaması oluşturun

Temel bir Vue.js uygulaması oluşturmak için [Vite](https://vitejs.dev/) kullanacağız. Terminalinizde, yeni bir .js uygulaması oluşturmak için aşağıdaki komutu çalıştırın:

```shell
deno run -A npm:create-vite
```

İstenildiğinde, uygulamanıza bir ad verin ve sunulan framework'lerden `Vue`'yu seçin ve `TypeScript`'yi bir varyant olarak belirleyin.

Oluşturulduktan sonra, yeni projenize `cd` yapın ve bağımlılıkları kurmak için aşağıdaki komutu çalıştırın:

```shell
deno install
```

Daha sonra, yeni Vue.js uygulamanızı sunmak için aşağıdaki komutu çalıştırın:

```shell
deno task dev
```

Deno, Vite sunucusunu başlatacak olan `package.json` dosyasındaki `dev` görevini çalıştıracak. Uygulamanızı tarayıcıda görmek için localhost'taki çıktı bağlantısına tıklayın.

## Bir arka uç ekleyin

:::tip
Sonraki adım, bir arka uç API eklemektir. Çok basit bir API oluşturmak, uygulamanızın temel işlevselliğini geliştirecek.
:::

Yeni vite projenizin kökünde bir `api` klasörü oluşturun. O klasörde, sunucuyu çalıştıracak bir `main.ts` dosyası ve sabit veri için bir `data.json` dosyası oluşturun.

[Aşağıdaki json dosyasını](https://raw.githubusercontent.com/denoland/tutorial-with-vue/refs/heads/main/api/data.json) `api/data.json` içine kopyalayın ve yapıştırın.

Dinozor bilgilerini döndüren yollarla basit bir API sunucusu kuracağız. [`oak` middleware framework'ünü](https://jsr.io/@oak/oak) ve [`cors` middleware'ini](https://jsr.io/@tajpouria/cors) kullanacağız ve
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) etkinleştireceğiz.

Gerekli bağımlılıkları projenize eklemek için `deno add` komutunu kullanın:

```shell
deno add jsr:@oak/oak jsr:@tajpouria/cors
```

Sonra, `api/main.ts` dosyasını güncelleyerek gerekli modülleri içe aktarın ve bazı yolları tanımlamak için yeni bir `Router` örneği oluşturun:

```ts title="main.ts"
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import data from "./data.json" with { type: "json" };

const router = new Router();
```

Bundan sonra, aynı dosyada üç yol tanımlayacağız. İlk yol olan `/` "Dinozor API'sine hoş geldiniz!" stringini döndürecek, daha sonra `/dinosaurs` tüm dinozorları döndürecek ve son olarak `/dinosaurs/:dinosaur` URL'deki isme göre belirli bir dinozoru döndürecek:

```ts title="main.ts"
router
  .get("/", (context) => {
    context.response.body = "Dinozor API'sine hoş geldiniz!";
  })
  .get("/dinosaurs", (context) => {
    context.response.body = data;
  })
  .get("/dinosaurs/:dinosaur", (context) => {
    if (!context?.params?.dinosaur) {
      context.response.body = "Dinozor adı sağlanmadı.";
    }

    const dinosaur = data.find((item) =>
      item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
    );

    context.response.body = dinosaur ? dinosaur : "Dinozor bulunamadı.";
  });
```

Son olarak, aynı dosyanın en altında yeni bir `Application` örneği oluşturun ve tanımladığımız yolları uygulamaya ekleyin ve sunucunun 8000 portunda dinlemeye başlamasını sağlayın:

```ts title="main.ts"
const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
```

API sunucusunu `deno run --allow-env --allow-net api/main.ts` ile çalıştırabilirsiniz. Bu komutu çalıştırmak ve hem Vue.js uygulamasını hem de API sunucusunu çalıştıracak şekilde geliştirme görevini güncellemek için bir görev oluşturacağız.

`package.json` dosyanızda, `scripts` alanını aşağıdaki gibi güncelleyin:

```jsonc
{
  "scripts": {
    "dev": "deno task dev:api & deno task dev:vite",
    "dev:api": "deno run --allow-env --allow-net api/main.ts",
    "dev:vite": "deno run -A npm:vite",
    // ...
}
```

Artık `deno task dev` komutunu çalıştırdığınızda ve `localhost:8000` adresini ziyaret ettiğinizde, tarayıcınızda "Dinozor API'sine hoş geldiniz!" yazısını görmelisiniz ve `localhost:8000/dinosaurs` adresini ziyaret ettiğinizde tüm dinozorların JSON yanıtını görmelisiniz.

## Ön ucu oluşturun

### Giriş noktası ve yönlendirme

`src` dizininde, bir `main.ts` dosyası bulacaksınız. Bu, Vue.js uygulaması için giriş noktasıdır. Uygulamamızda birden fazla yönlendirme olacak, bu yüzden istemci tarafı yönlendirmesi için bir yönlendiriciye ihtiyacımız olacak. Bunu resmi
[Vue Router](https://router.vuejs.org/) kullanarak yapacağız.

`src/main.ts` dosyasını güncelleyerek yönlendiriciyi içe aktarın ve kullanın:

```ts
import { createApp } from "vue";
import router from "./router/index.ts";

import "./style.css";
import App from "./App.vue";

createApp(App)
  .use(router)
  .mount("#app");
```

Vue Router modülünü projeye eklemek için `deno add` kullanın:

```shell
deno add npm:vue-router
```

Sonra, `src` dizininde bir `router` dizini oluşturun. İçinde, aşağıdaki içeriğe sahip bir `index.ts` dosyası oluşturun:

```ts title="router/index.ts"
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";
import Dinosaur from "../components/Dinosaur.vue";

export default createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
    },
    {
      path: "/:dinosaur",
      name: "Dinosaur",
      component: Dinosaur,
      props: true,
    },
  ],
});
```

Bu, `/` ve `/:dinosaur` ile iki yol tanımlayan bir yönlendirici kuracaktır. `HomePage` bileşeni `/` adresinde ve `Dinosaur` bileşeni `/:dinosaur` adresinde gösterilecektir.

Son olarak, `src/App.vue` dosyasındaki tüm kodu silerek sadece `` bileşenini içerecek şekilde güncelleyin:

```vue title="App.vue"
<template>
  <RouterView />
</template>;
```

### Bileşenler

Vue.js, ön uç kullanıcı arayüzünü bileşenlere ayırır. Her bileşen, yeniden kullanılabilir bir kod parçasıdır. Ev sayfası için bir, dinozorlar listesi için bir ve bireysel bir dinozor için üç bileşen oluşturacağız.

Her bileşen dosyası üç kısma ayrılmıştır: ``, ``, ve ``. `` etiketi bileşenin JavaScript mantığını içerirken, `` etiketi HTML'i ve `` etiketi CSS'i içerir.

`/src/components` dizininde üç yeni dosya oluşturun: `HomePage.vue`, `Dinosaurs.vue` ve `Dinosaur.vue`.

#### Dinosaurs bileşeni

`Dinosaurs` bileşeni daha önce kurduğumuz API'den dinozor listesini alacak ve bunları bağlantılar olarak render edecektir; bu nedenle
[Vue Router'dan `RouterLink` bileşenini](https://router.vuejs.org/guide/) kullanacağız. (TypeScript projesi yaptığımızdan, script etiketinde `lang="ts"` niteliğini belirtmeyi unutmayın.) `Dinosaurs.vue` dosyasına aşağıdaki kodu ekleyin:

```vue title="Dinosaurs.vue"
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    async setup() {
        const res = await fetch("http://localhost:8000/dinosaurs")
        const dinosaurs = await res.json() as Dinosaur[];
        return { dinosaurs };
    }
});
</script>

<template>
    <div v-for="dinosaur in dinosaurs" :key="dinosaur.name">
        <RouterLink :to="{ name: 'Dinosaur', params: { dinosaur: `${dinosaur.name.toLowerCase()}` } }" >
            {{ dinosaur.name }}
        </RouterLink>
    </div>
</template>
```

Bu kod, `dinosaurs` dizisini yineleyerek her dinozoru bir `RouterLink` bileşeni olarak render etmek için Vue.js'in
[v-for](https://vuejs.org/api/built-in-directives.html#v-for) direktifini kullanır. `RouterLink` bileşeninin `:to` niteliği, bağlantıya tıklandığında gidilecek rotayı belirtirken, `:key` niteliği her dinozoru benzersiz bir şekilde tanımlamak için kullanılır.

#### Anasayfa bileşeni

Ana sayfa bir başlık ve ardından `Dinosaurs` bileşenini render edecektir. `HomePage.vue` dosyasına aşağıdaki kodu ekleyin:

```vue title="HomePage.vue"
<script setup lang="ts">
import Dinosaurs from './Dinosaurs.vue';
</script>
<template>
  <h1>Dinozor Uygulamasına Hoş Geldiniz! 🦕</h1>
  <p>Bir dinozora tıklayarak daha fazla bilgi edinin</p>
  <Suspense>
    <template #default>
      <Dinosaurs />
    </template>
    <template #fallback>
      <div>Yükleniyor...</div>
    </template>
  </Suspense>
</template>
```

`Dinosaurs` bileşeni verileri asenkron olarak aldığından, yüklenme durumunu ele almak için [`Suspense` bileşenini](https://vuejs.org/guide/built-ins/suspense.html) kullanın.

#### Dinozor bileşeni

`Dinosaur` bileşeni, belirli bir dinozorun adını ve açıklamasını gösterecek ve tam listeye geri dönmek için bir bağlantı sağlayacak.

Öncelikle, alacağımız veriler için bazı türleri ayarlayalım. `src` dizininde bir `types.ts` dosyası oluşturun ve aşağıdaki kodu ekleyin:

```ts title="types.ts"
type Dinosaur = {
  name: string;
  description: string;
};

type ComponentData = {
  dinosaurDetails: null | Dinosaur;
};
```

Ardından, `Dinosaur.vue` dosyasını güncelleyerek:

```vue title="Dinosaur.vue"
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: { dinosaur: String },
    data(): ComponentData {
        return { 
            dinosaurDetails: null 
        };
    },
    async mounted() {
        const res = await fetch(`http://localhost:8000/dinosaurs/${this.dinosaur}`);
        this.dinosaurDetails = await res.json();
    }
});
</script>

<template>
    <h1>{{ dinosaurDetails?.name }}</h1>
    <p>{{ dinosaurDetails?.description }}</p>
    <RouterLink to="/">🠠 Tüm dinozorlara geri dön</RouterLink>
</template>
```

Bu kod, bileşene iletilecek olan `dinosaur` adında bir prop tanımlamak için `props` seçeneğini kullanır. `mounted` yaşam döngüsü kancası, `dinosaur` propuna dayalı olarak dinozorun ayrıntılarını almak ve bunları `dinosaurDetails` veri özelliğinde saklamak için kullanılır. Bu veri daha sonra şablonda render edilir.

## Uygulamayı çalıştırın

Artık ön ucu ve arka ucu kurduğumuza göre, uygulamayı çalıştırabiliriz. Terminalinizde aşağıdaki komutu çalıştırın:

```shell
deno task dev
```

Tarayıcınızda uygulamayı görmek için çıktı localhost bağlantısına gidin. Daha fazla ayrıntı görmek için bir dinozora tıklayın!

![Vue uygulaması eylemde](../../../../images/cikti/denoland/runtime/tutorials/images/how-to/vue/vue.gif)

:::info
🦕 Artık Deno ile Vite'de bir Vue uygulaması çalıştırdığınıza göre gerçek dünya uygulamaları oluşturmak için hazırsınız! Bu demoyu genişletmek istiyorsanız, oluşturulduktan sonra statik uygulamayı sunacak bir arka uç sunucusu oluşturmayı düşünmelisiniz, böylece
[dinozor uygulamanızı buluta dağıtabilirsiniz](https://docs.deno.com/deploy/manual/).
:::