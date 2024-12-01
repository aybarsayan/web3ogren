---
description: Deno ile basit bir HTTP sunucusu oluşturmanın ve çalıştırmanın adımlarını keşfedin. Bu rehber, Deno'nun `serve` komutunu kullanarak HTTP isteklerini nasıl işleyebileceğinizi gösterir.
keywords: [Deno, HTTP sunucusu, fetch, server, Deno serve]
---

## Örnek

:::info
Deno kullanarak hızlı ve etkili bir HTTP sunucusu oluşturmak için aşağıdaki adımları takip edebilirsiniz.
:::

İşte deklaratif fetch ile basit bir HTTP sunucusu oluşturmanın bir örneği:

```typescript title="server.ts"
export default {
  async fetch(_req) {
    return new Response("Hello world!");
  },
};
```

Ardından sunucuyu `deno serve` komutunu kullanarak çalıştırabilirsiniz:

```bash
deno serve server.ts
```

:::tip
`fetch` fonksiyonu içindeki mantığı, farklı türdeki istekleri işlemek ve içerik sunmak için özelleştirebilirsiniz.
:::

```typescript title="server.ts"
export default {
  async fetch(request) {
    if (request.url.startsWith("/json")) {
      return Response.json({ hello: "world" });
    }

    return new Response("Hello world!");
  },
};
```

> **Önemli Not:** Sunucunuz farklı türdeki istekleri işlemek üzere yapılandırılabilir. — Deno Dokümantasyonu