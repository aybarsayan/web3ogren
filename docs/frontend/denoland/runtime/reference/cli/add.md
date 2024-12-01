---
title: "deno ekle"
description: Bu belge, Deno’yu projenize eklemek için gerekli adımları detaylandırmaktadır. Temel kurulum sürecini ve bazı ipuçlarını içermektedir.
keywords: [Deno, ekleme, kurulum, projeler, JavaScript]
---

# Deno Ekle

## Komut
Deno’yu projenize eklemek için aşağıdaki komutu kullanabilirsiniz:

```
deno add
```

:::tip
Deno kurulumunu daha verimli hale getirmek için önceden yapılandırılmış bir ortam kullanmayı düşünün.
:::

### Temel Bilgiler

Deno, modern JavaScript ve TypeScript için güvenli bir çalışma zamanı sağlar. Kullanıcıların, paket yöneticisi olarak herhangi bir araca ihtiyaç duymadan, doğrudan URL'lerden kodu yüklemesine olanak tanır.

> "Deno, güvenlik, verimlilik ve zengin bir özellik seti sunar."  
> — Deno Resmi Belgesi

## Deno Kurulumu

Deno'yu kurmak için aşağıdaki adımları izleyin:

1. Sisteminizde Deno’yu indirin.
2. Hedef dizine gidin.
3. Aşağıdaki komutu çalıştırın:

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

:::info
Deno, bir JavaScript yürütme ortamı olmasının yanı sıra, TypeScript desteği de sunar.
:::

### Yapılandırma

Deno’yu kurduktan sonra, aşağıdaki yapılandırmaları yapmak isteyebilirsiniz:


Yapılandırma Ayarları

- **Çalışma zamanı**: Asenkron ve bekleme desteği.
- **Modül yönetimi**: Yerel ve uzaktan modül desteği.



## Önemli Notlar

Deno kullanırken dikkat etmeniz gereken bazı noktalar:

- **Güvenlik**: Varsayılan olarak Deno, erişim izinlerine ihtiyaç duyar.
- **Uyumluluk**: Eski Node.js projeleri ile tam uyumlu olmayabilir.

:::warning
Deno’yu kurmadan önce mevcut sistem gereksinimlerini kontrol edin.
:::