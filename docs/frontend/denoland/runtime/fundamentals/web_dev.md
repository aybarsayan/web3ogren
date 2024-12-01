---
title: "Web geliştirimi"
description: Deno, web uygulamaları için güvenli bir geliştirme ortamı sunarak modern web geliştirme sürecini kolaylaştırır. Bu içerikte, Deno ile birlikte kullanılabilecek popüler web framework'leri hakkında bilgi edinilecektir.
keywords: [Deno, web geliştirme, framework, React, Next.js, Fresh, Astro]
oldUrl:
 - /runtime/manual/getting_started/web_frameworks/
 - /runtime/fundamentals/web_frameworks/
---

Deno, web uygulamaları geliştirmek için güvenli ve geliştirici dostu bir ortam sunarak web geliştirme deneyiminizi keyifli hale getirir.

1. Deno, `güvenli varsayılanlara` sahiptir; bu, dosya, ağ ve ortam erişimi için açık izin gerektirdiği anlamına gelir ve güvenlik açıkları riskini azaltır.
2. Deno, `yerleşik TypeScript desteği` sağlar, böylece ek yapılandırma veya araçlar olmadan TypeScript kodu yazabilirsiniz.
3. Deno, HTTP sunucuları, dosya sistemi işlemleri gibi yaygın görevler için modüller içeren `standart bir kütüphane` ile birlikte gelir.

:::tip
Deno ile çalışırken, projenizin gereksinimlerini göz önünde bulundurarak uygun bir framework seçmek önemlidir.
:::

Muhtemelen daha karmaşık bir uygulama geliştiriyorsanız, Deno ile bir web framework'ü üzerinden etkileşimde bulunacaksınız.

## React/Next

[React](https://reactjs.org/) kullanıcı arayüzleri oluşturmak için popüler bir JavaScript kütüphanesidir. Deno ile React kullanmak için popüler web framework'ü [Next.js](https://nextjs.org/) kullanabilirsiniz.

Deno'da Next.js ile başlamanın yolu, yeni bir next uygulaması oluşturmak ve onu hemen çalıştırmaktır:

```sh
deno run -A npm:create-next-app@latest my-next-app
cd my-next-app
deno task dev
```

> Bu, TypeScript ile yeni bir Next.js uygulaması oluşturacak ve Deno ile çalıştıracaktır.  
> Tarayıcınızı `http://localhost:3000` adresine açarak yeni uygulamanızı görebilir ve `page.tsx` dosyasını düzenleyerek değişikliklerinizi canlı olarak görebilirsiniz.  
> — Deno Kullanıcı Kılavuzu

JSX ve Deno'nun arka planda nasıl etkileşimde bulunduğunu daha iyi anlamak için `buradan` okumaya devam edin.

## Fresh

[Fresh](https://fresh.deno.dev/) Deno için en popüler web framework'üdür. Varsayılan olarak istemcilere JavaScript göndermeyen bir model kullanır.

Fresh uygulamanıza başlamak için aşağıdaki komutu kullanabilir ve uygulamanızı oluşturmak için cli istemlerini izleyebilirsiniz:

```sh
deno run -A -r https://fresh.deno.dev
cd my-fresh-app
deno task start
```

Bu, yeni bir Fresh uygulaması oluşturacak ve Deno ile çalıştıracaktır. Daha sonra tarayıcınızı `http://localhost:8000` adresine açarak yeni uygulamanızı görebilirsiniz. `/routes/index.tsx` dosyasını düzenleyerek değişikliklerinizi canlı olarak görebilirsiniz.

:::info
Fresh, çoğu render işlemini sunucuda yapar ve istemci yalnızca küçük [etkileşim adacıkları](https://jasonformat.com/islands-architecture/) için yeniden render etmekten sorumludur. 
:::

## Astro

[Astro](https://astro.build/) geliştiricilerin hızlı ve hafif web siteleri oluşturmasına olanak tanıyan bir statik site oluşturucusudur.

Astro ile başlamanın yolu, yeni bir Astro sitesi oluşturmak için aşağıdaki komutu kullanmaktır:

```sh
deno run -A npm:create-astro my-astro-site
cd my-astro-site
deno task dev
```

Bu, yeni bir Astro sitesi oluşturacak ve Deno ile çalıştıracaktır. Daha sonra tarayıcınızı `http://localhost:4321` adresine açarak yeni sitenizi görebilirsiniz. `src/pages/index.astro` dosyasını düzenleyerek değişikliklerinizi canlı olarak görebilirsiniz.

## Vite

[Vite](https://vitejs.dev/) kodunuzu yerel ES modülleri aracılığıyla sunan bir web geliştirme yapı aracıdır, bu modüller tarayıcıda doğrudan çalıştırılabilir. Vite, Deno ile modern web uygulamaları geliştirmenin harika bir seçimidir.

Vite ile başlamanın yolu, yeni bir Vite uygulaması oluşturmak için aşağıdaki komutu kullanmaktır:

```sh
deno run -A npm:create-vite@latest
cd my-vite-app
deno install
deno task dev
```

---

## Lume

[Lume](https://lume.land/) diğer statik site oluşturucularından, Jekyll veya Eleventy gibi esinlenerek Deno için bir statik site oluşturucudur.

Lume ile başlamanın yolu, yeni bir Lume sitesi oluşturmak için aşağıdaki komutu kullanmaktır:

```sh
mkdir my-lume-site
cd my-lume-site
deno run -A https://lume.land/init.ts
deno task serve
```

## Docusaurus

[Docusaurus](https://docusaurus.io/) teknik dokümantasyon web siteleri için optimize edilmiş bir statik site oluşturucudur.

Docusaurus ile başlamanın yolu, yeni bir Docusaurus sitesi oluşturmak için aşağıdaki komutu kullanmaktır:

```sh
deno run -A npm:create-docusaurus@latest my-website classic
cd my-website
deno task start
```

## Hono

[Hono](https://hono.dev) Express ve Sinatra geleneğinde hafif bir web uygulaması framework'üdür.

Hono ile başlamanın yolu, yeni bir Hono uygulaması oluşturmak için aşağıdaki komutu kullanmaktır:

```sh
deno run -A npm:create-hono@latest
cd my-hono-app
deno task start
```

Bu, yeni bir Hono uygulaması oluşturacak ve Deno ile çalıştıracaktır. Daha sonra tarayıcınızı `http://localhost:8000` adresine açarak yeni uygulamanızı görebilirsiniz.

## Oak

[Oak](https://jsr.io/@oak/oak) Deno ile HTTP işlemleri için bir ara katman framework'üdür. Oak, ön uç uygulamanız ile potansiyel bir veritabanı ya da diğer veri kaynakları (örneğin REST API'leri, GraphQL API'leri) arasında köprü işlevi görür.

Oak, yerel Deno HTTP sunucusuna ek olarak temel bir yönlendirici, JSON ayrıştırıcı, ara katmanlar, eklentiler vb. gibi ek işlevsellik sunar.

Oak ile başlamanın yolu, `server.ts` adlı bir dosya oluşturmak ve aşağıdakileri eklemektir:

```ts
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = `<!DOCTYPE html>
    <html>
      <head><title>Hello oak!</title><head>
      <body>
        <h1>Hello oak!</h1>
      </body>
    </html>
  `;
});

const app = new Application();
const port = 8080;

app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Server running on http://localhost:${port}`);

app.listen({ port: port });
```

Sunucuyu aşağıdaki komutla çalıştırın:

```sh
deno run --allow-net server.ts
```

## Node projeleri

Deno, Node.js projelerinizi kutudan çıkardığı gibi çalıştıracaktır. Node.js projenizi Deno'ya taşıma konusunda `kılavuzumuza` göz atın.