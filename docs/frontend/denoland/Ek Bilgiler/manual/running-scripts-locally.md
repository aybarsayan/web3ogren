---
title: "Yerel Geliştirme"
description: Bu içerik, Deno CLI'sinin yerel geliştirme için nasıl kullanılacağını ve scriptlerinizi çalıştırma yöntemlerini açıklamaktadır. Ek olarak, dosya izleme özellikleri ve Deno ile çalışma hakkında daha fazlasını öğrenmek için kılavuzlara yönlendirmeler sunulmaktadır.
keywords: [Deno, yerel geliştirme, CLI, script çalıştırma, dosya izleme]
---

Yerel geliştirme için `deno` CLI'sini kullanabilirsiniz. `deno`'yu kurmak için aşağıdaki
[Deno kılavuzu](https://deno.land/manual/getting_started/installation) talimatlarını izleyin.

:::tip
Deno CLI ile hızlı bir başlangıç için, gereken adımları dikkatlice takip etmenizde fayda var.
:::

Kurulumdan sonra, scriptlerinizi yerel olarak çalıştırabilirsiniz:

```shell
$ deno run --allow-net=:8000 https://deno.com/examples/hello.js
Listening on http://localhost:8000
```

Dosya değişikliklerini izlemek için `--watch` bayrağını ekleyin:

```shell
$ deno run --allow-net=:8000 --watch ./main.js
Listening on http://localhost:8000
```

:::info
Scriptlerinizi çalıştırmadan önce, Geliştirici Araçları'nın güncel olduğundan emin olun.
:::

Deno CLI hakkında daha fazla bilgi ve geliştirme ortamınızı ve IDE'nizi nasıl yapılandıracağınız için, Deno Kılavuzu'nun [Başlarken][manual-gs] bölümünü ziyaret edin.


Detaylı Bilgi

Deno, modern JavaScript ve TypeScript geliştirme için güvenli bir çalışma ortamı sağlar. Aşağıdaki gibi bazı önemli özellikleri vardır:

- **Modüler Yapı**: Deno, URL üzerinden modülleri doğrudan kullanmanıza izin verir.
- **Güvenlik**: İzinler, çalıştırılan scriptlerin hangi kaynaklara erişebileceğini yönetir.



[manual-gs]: https://deno.land/manual/getting_started