---
title: ngMocks.ignoreOnConsole
description: Angular birim testlerinde konsol loglarını bastırma yöntemi. Bu özellik, testleriniz sırasında `console.log` gibi komutları yönetmenize yardımcı olur. Kullanım Olasılıkları ve detayları, bu dokümanda açıklanmaktadır.
keywords: [Angular, ngMocks, unit tests, console logging, testing strategies]
---

`ngMocks.ignoreOnConsole`, `console.log`'ı bir spy ile bastırır (eğer `otomatik spy` kullanılıyorsa).

:::info
`ngMocks.ignoreOnConsole`, mevcut test takımı için `beforeAll` içerisinde fonksiyonları bastırır ve `afterAll` içerisinde geri yükler.
:::

Ayrıca, başka yöntemler de stub edilebilir:

```ts
ngMocks.ignoreOnConsole('log', 'err', 'warn');
```

> "Bu yöntem, test sırasında konsoldaki gürültüyü azaltarak daha temiz bir çıktı sağlar." — Angular Testing Guide

---

### Kullanım Detayları


Ekstra Bilgiler

- **Kapsamlı Kontrol**: Birden fazla konsol komutunu aynı anda bastırma yeteneği.
- **Arka Plan Bilgisi**: Testlerin doğru çalışması için gereksiz logların silinmesi.



---

:::tip
Testlerinizde konsol loglarını yönetirken bu yöntemi kullanarak, çıktıları daha yönetilebilir hale getirebilirsiniz. 
:::

### Uygulama

1. `ngMocks.ignoreOnConsole` fonksiyonunu çağırarak konsol loglarını bastırın.
2. Test işlemleri sonunda `afterAll` kullanarak isteğe bağlı olarak geri yükleyin.

---