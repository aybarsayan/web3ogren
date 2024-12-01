---
title: "Sürüm Takvimi"
description: Bu sayfa, Deno CLI için sürüm takvimini ve yayınlama süreçlerini açıklamaktadır. Her ay düzenli olarak yayınlanan sürümler ve kanarya sürümleri hakkında bilgi verir.
keywords: [Deno, sürüm takvimi, kanarya, güncelleme, CLI]
---

Her ay, ayın üçüncü Perşembe günü `deno` cli için yeni bir küçük sürüm yayımlanır.

Gelecek sürümler için [Deno'nun GitHub'undaki Kilometre Taşları](https://github.com/denoland/deno/milestones) sayfasına bakın.

Küçük sürümlerin ardından genellikle iki veya üç yamanın (haftalık olarak yapılan) sürümü yayımlanır; bunlardan sonra yeni özellikler için gelecek küçük sürüm adına bir birleştirme penceresi açılır.

Kararlı sürümler [GitHub sürüm sayfasında](https://github.com/denoland/deno/releases) bulunabilir.

---

## Canary kanalı

:::info 
Yukarıda açıklanan kararlı kanalın yanı sıra, kanaryalar günde birden fazla kez (ana dalda her bir taahhüt için) yayımlanır. 
:::

En yeni kanarya sürümüne yükseltmek için şunu çalıştırabilirsiniz:

```console
deno upgrade --canary
```

Belirli bir kanaryaya güncellemek için `--version` seçeneğinde taahhüt hash'ini geçin:

```console
deno upgrade --canary --version=973af61d8bb03c1709f61e456581d58386ed4952
```

Kararlı kanala dönmek için `deno upgrade` komutunu çalıştırın.

:::tip
Kanaryalar https://dl.deno.land adresinden indirilebilir.
:::