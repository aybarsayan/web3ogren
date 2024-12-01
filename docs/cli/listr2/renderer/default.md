---
title: Varsayılan Renderer
description: Bu belge, DefaultRenderer'ın özelliklerini, kullanımını ve özelleştirme seçeneklerini açıklamaktadır. `listr2` kütüphanesinin ana render'ı olan DefaultRenderer, terminal çıktısı sağlamak için geliştirilmiştir.
keywords: [DefaultRenderer, listr2, terminal uyumluluğu, özelleştirme, TTY ortamları]
order: 10
tag:
  - temel
category:
  - renderer
---



_DefaultRenderer_, `listr2`'nin ana render'ıdır.



_DefaultRenderer_, _Task_'taki değişikliklere bağlı olarak mevcut güncellemeyi sürekli güncel tutan `TTY` ortamları için `vt100` terminal uyumluluğu ile tasarlanmıştır. Bu render, özelleştirme için birçok seçeneğe sahiptir ve bu seçenekler _Listr_, _Subtask_ veya _Task_ seviyesinde değiştirilebilir.

:::tip
Bu render kullanılırken, terminal ortamınıza uyum sağlamak için uygun ayarları kontrol etmeyi unutmayın.
:::

Bu renderer, terminali kontrol etmek için _ProcessOutput_ kullanır.


## Renderer Seçenekleri

::: details

:::

## Renderer Görev Seçenekleri

::: details

:::

:::info
Renderer seçenekleri ve görev seçenekleri, isteğe bağlı olarak projelerinizde özelleştirilebilir.
:::

## Önemli Açıklamalar

DefaultRenderer, terminal çıktısı oluşturma alanında esneklik sağlar. Aşağıdaki noktalar, kullanıcıların bu render hakkında bilmesi gereken önemli bilgiler içerir:

- Özelleştirilebilir görev seçenekleri
- `TTY` ortamları için yapılmış tasarım
- Sürekli güncelleme yeteneği

> "Bu render, özelleştirme için birçok seçeneğe sahiptir." — Varsayılan Renderer Özellikleri