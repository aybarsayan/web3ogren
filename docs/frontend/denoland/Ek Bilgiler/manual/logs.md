---
title: "Uygulama günlüğü"
description: Uygulama günlükleri ve görüntüleme yöntemleri hakkında kapsamlı bilgiler sunmaktadır. Günlüklerin nasıl oluşturulacağı ve saklanacağı, ayrıca saklama sürelerinin nasıl yönetileceği detaylandırılmaktadır.
keywords: [uygulama günlüğü, canlı günlükler, deployctl, günlük görüntüleme, günlük saklama]
---

Uygulamalar, `console.log`, `console.error` gibi yöntemler kullanarak çalışma zamanında günlükler üretebilir. Bu günlükler, **gerçek zamanlı** olarak şu yollarla görüntülenebilir:

- Bir projenin veya dağıtımın `Günlükler` paneline giderek.
- [deployctl](https://docs.deno.com/deploy/manual/deployctl) içindeki `logs` alt komutunu kullanarak.

:::info
Günlükler, doğrudan uygulamadan günlüğü paneline aktarılacak veya `deployctl logs` komutuyla görüntülenecektir.
:::

Gerçek zamanlı günlüklerin yanı sıra, günlükler belirli bir süre boyunca (abone oldukları plana bağlı olarak) saklanır. Saklanan günlükleri görüntülemek için:

- Tarayıcınızdaki günlük panelini kullanıyorsanız, arama kutusunun yanındaki açılır menüden `Canlı` seçeneğinden **Son** veya **Özel** seçeneğine geçiş yapın.
- Komut satırını tercih ediyorsanız, `deployctl logs` komutunuza `--since=` ve/veya `--until=` ekleyin. Daha fazla ayrıntı için `deployctl logs --help` kısmını inceleyin.

:::tip
Günlük mesajlarının maksimum boyutu **2KB**'dir. Bu sınırı aşan mesajlar **2KB**'ye kadar küçültülür.
:::

Saklama süresinden eski günlükler otomatik olarak sistemden **silinir**.

> "Günlük mesajlarının maksimum boyutu 2KB'dir. Bu sınırı aşan mesajlar 2KB'ye kadar küçültülür."  
> — Uygulama Günlüğü Bilgisi