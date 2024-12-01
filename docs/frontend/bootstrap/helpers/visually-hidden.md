---
description: Bu yardımcıları kullanarak öğeleri görsel olarak gizleyin, ancak erişilebilir teknolojiler için erişilebilir durumda tutun.
keywords: [gizleme, erişilebilirlik, ekran okuyucular, CSS, yardımcı teknolojiler]
---

Bir öğeyi görsel olarak gizleyip, yine de yardımcı teknolojilere (örneğin ekran okuyuculara) maruz bırakmak için **`.visually-hidden`** kullanın. Varsayılan olarak bir öğeyi görsel olarak gizlemek için **`.visually-hidden-focusable`** kullanın, ancak odaklandığında (örneğin yalnızca klavye kullanan bir kullanıcı tarafından) görüntülemek için. **`.visually-hidden-focusable`** ayrıca bir kapsayıcıya da uygulanabilir; `:focus-within` sayesinde, kapsayıcının herhangi bir alt öğesi odaklandığında kapsayıcı görüntülenecektir.

:::tip
Bu yöntemler, web tasarımında erişilebilirliği artırmak için etkilidir.
:::


Ekran okuyucular için başlık
Ana içeriğe atla
Bir odaklanabilir öğeye sahip bir kapsayıcı.
Hem **`visually-hidden`** hem de **`visually-hidden-focusable`** mixin olarak da kullanılabilir.

```scss
// Mixin olarak kullanım

.visually-hidden-title {
  @include visually-hidden;
}

.skip-navigation {
  @include visually-hidden-focusable;
}
```

:::info
**Mixin** kullanımı kodunuzu daha temiz ve yönetilebilir hale getirir.
:::

```scss
// Mixin olarak kullanım

.visually-hidden-title {
  @include visually-hidden;
}
```

> **Anahtar Nokta:** Erişilebilir bir kullanıcı deneyimi yaratmak için, görünürlüğü ve gizliliği dengede tutmalısınız.  
> — Web Erişilebilirliği Uzmanı

---