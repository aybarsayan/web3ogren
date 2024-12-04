---
title: Sunucu Tarafı İşleme APIsi
seoTitle: Sunucu Tarafı İşleme APIsi - Vue
sidebar_position: 1
description: Sunucu tarafı işleme APIsinin temel fonksiyonlarını ve örneklerini keşfedin. Bu API, Vue uygulamalarında sunucu tarafından oluşturulmuş içerik ve akış işleme sağlar.
tags: 
  - sunucu tarafı işleme
  - Vue
  - API
  - SSR
keywords: 
  - sunucu tarafı işleme
  - Vue
  - API
  - SSR
---
## Sunucu Tarafı İşleme API'si {#server-side-rendering-api}

## renderToString() {#rendertostring}

- **`vue/server-renderer`'dan dışa aktarılmıştır.**

- **Tip**

  ```ts
  function renderToString(
    input: App | VNode,
    context?: SSRContext
  ): Promise<string>
  ```

- **Örnek**

  ```js
  import { createSSRApp } from 'vue'
  import { renderToString } from 'vue/server-renderer'

  const app = createSSRApp({
    data: () => ({ msg: 'hello' }),
    template: `<div>{{ msg }}</div>`
  })

  ;(async () => {
    const html = await renderToString(app)
    console.log(html)
  })()
  ```

  ### SSR Bağlamı {#ssr-context}

  İsteğe bağlı bir bağlam nesnesi geçirebilirsiniz, bu nesne render sırasında ek verileri kaydetmek için kullanılabilir; örneğin, `Teleports içeriğine erişmek`:

  ```js
  const ctx = {}
  const html = await renderToString(app, ctx)

  console.log(ctx.teleports) // { '#teleported': 'teleported content' }
  ```

  Bu sayfadaki diğer çoğu SSR API'si de isteğe bağlı bir bağlam nesnesi alır. Bağlam nesnesi, bileşen kodunda `useSSRContext` yardımcı fonksiyonu aracılığıyla erişilebilir.

- **Ayrıca bakınız** `Kılavuz - Sunucu Tarafı İşleme`