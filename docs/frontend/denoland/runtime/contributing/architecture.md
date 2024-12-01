---
title: "İçsel Detaylar"
description: Deno'nun mimarisi ve kaynak yönetimi üzerine bilgiler sunulmaktadır. Bu içerikte, Deno ve Linux arasındaki analojiler, kaynaklar ve metrikler gibi önemli konular ele alınmaktadır.
keywords: [Deno, Linux, kaynaklar, metrikler, web çalışanları, süreçler, sistem çağrıları]
oldUrl: /runtime/manual/references/contributing/architecture/
---

## Deno ve Linux analojisi

|                       **Linux** | **Deno**                           |
| ------------------------------: | :--------------------------------- |
|                       Süreçler | Web Çalışanları                    |
|                        Sistem Çağrıları | Ops                                |
|           Dosya tanıtıcıları (fd) | `Kaynak kimlikleri (rid)`   |
|                       Planlayıcı | Tokio                              |
| Kullanıcı Alanı: libc++ / glib / boost | https://jsr.io/@std                |
|                 /proc/\$\$/stat | `Deno.metrics()`         |
|                       man sayfaları | deno türleri / https://docs.deno.com |

:::info
Bu tabloda, Deno ve Linux arasındaki ana kavramlar karşılaştırılmaktadır. Her iki sistemin mimarisini anlamak, Deno'nun sağladığı avantajları ve yeteneklerini daha iyi kavramamıza yardımcı olur.
:::

### Kaynaklar

Kaynaklar (AKA `rid`), Deno'nun dosya tanıtıcıları versiyonudur. Açık dosyalar, soketler ve diğer kavramlara atıfta bulunmak için kullanılan tamsayı değerleridir. **Test için, sistemde kaç tane açık kaynak olduğunu sorgulamak iyi olacaktır.**

```ts
console.log(Deno.resources());
// { 0: "stdin", 1: "stdout", 2: "stderr" }
Deno.close(0);
console.log(Deno.resources());
// { 1: "stdout", 2: "stderr" }
```

### Metrikler

Metrikler, Deno'nun çeşitli istatistikler için dahili sayacıdır.

```shell
> console.table(Deno.metrics())
┌─────────────────────────┬───────────┐
│          (idx)          │  Değerler  │
├─────────────────────────┼───────────┤
│      opsDispatched      │    9      │
│    opsDispatchedSync    │    0      │
│   opsDispatchedAsync    │    0      │
│ opsDispatchedAsyncUnref │    0      │
│      opsCompleted       │    9      │
│    opsCompletedSync     │    0      │
│    opsCompletedAsync    │    0      │
│ opsCompletedAsyncUnref  │    0      │
│    bytesSentControl     │   504     │
│      bytesSentData      │    0      │
│      bytesReceived      │   856     │
└─────────────────────────┴───────────┘
```

:::tip
Metriklerinizi izlemek, uygulamanızın performansını değerlendirmek için etkili bir yoldur. Deno.metrics() ile elde edilen veriler, sistemin işleyişi hakkında önemli ipuçları sağlar.
:::

## Konferans

- Ryan Dahl. (27 Mayıs 2020).  
  [Deno ile ilginç bir durum](https://www.youtube.com/watch?v=1b7FoBwxc7E). Deno İsrail.
- Bartek Iwańczuk. (6 Ekim 2020).  
  [Deno iç yapıları - modern JS/TS çalışma zamanı nasıl inşa edilir](https://www.youtube.com/watch?v=AOvg_GbnsbA&t=35m13s). Paris Deno.