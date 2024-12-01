---
description: "Deno kaldır komutu, Deno uygulamalarını kaldırmak için kullanılır. Bu içerik, bu komutun nasıl kullanılacağını ve sahip olduğu seçenekleri açıklar."
keywords: [Deno, kaldır, komut, uygulama, seçenekler]
---

# deno kaldır

:::tip
Deno kaldır komutunu kullanmadan önce, kaldırmak istediğiniz uygulamanın yedeğini almayı unutmayın.
:::

Deno, JavaScript ve TypeScript için modern bir çalışma zamanıdır. `deno kaldır` komutu, belirli bir Deno uygulamasını sisteminizden kaldırmak için kullanılır. Bu komut, aşağıdaki gibi çalışır:

```bash
deno remove <path-to-your-app>
```

**Aşağıdaki adımlar, komutun kullanımına dair detayları içerir:**

1. Hedef uygulamanın yolunu belirtin.
2. Komutu çalıştırın.

:::info
Eğer kaldırmak istediğiniz uygulama sistemde yüklü değilse, komut bir hata mesajı verebilir.
:::

**Önemli Not:**

> "Uygulamayı kaldırmadan önce, ona ait olan tüm verilerinizi yedeklediğinizden emin olun."  
> — Deno Kullanım Kılavuzu

## Komut Seçenekleri

Deno kaldırma işlemi için özel seçenekler bulunmaktadır:

- `--force`: Uygulamanın mevcut en son sürümünü zorla kaldırır.
- `--help`: Komut hakkında yardım bilgilerini görüntüler.


Ek Bilgi
Deno kaldır komutunu kullanmak için sistem üzerinde gerekli izinlere sahip olmanız önemlidir.


---

Kaldırma işlemi başarılı bir şekilde tamamlandığında, uygulama sistemden tamamen kaldırılacaktır. Bu süreçte dikkatli olmak ve yedekleme yapmak her zaman iyi bir uygulamadır.