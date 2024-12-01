---
title: Terminoloji
description: Bu bölümde komut satırı argümanları ile ilgili terimler ve açıklamaları ele alınmaktadır. Komut satırı seçenekleri, komutlar ve argümanları hakkında kapsamlı bilgiler sunulmaktadır.
keywords: [komut satırı, argümanlar, seçenekler, komut, terminoloji]
---

# Terminoloji

Komut satırı argümanları seçeneklerden, seçenek-argümanlarından, komutlardan ve komut-argümanlarından oluşur.

| Terim | Açıklama |
| --- | --- |
| **seçenek** | bir `-` ile başlayan bir argüman, veya `--` ile başlayan bir kelime (veya tire ile ayrılmış kelimeler), örneğin `-s` veya `--short` |
| **seçenek-argüman** | bazı seçenekler bir argümanı alabilir |
| **komut** | bir program veya komut alt komutlara sahip olabilir |
| **komut-argüman** | komut için argüman (ve bir seçenek veya seçenek-argümanı değil) |

:::tip
**Kullanım İpuçları:** Komut satırında her bir argümanı doğru bir şekilde takip etmek, komutların beklenildiği gibi çalışmasını sağlar.
:::

Örneğin:

```sh
my-utility command -o --option option-argument command-argument-1 command-argument-2
```

Diğer referanslarda **seçenekler** bazen *bayraklar* olarak adlandırılır ve **komut-argümanları** bazen *pozisyonel argümanlar* veya *operandlar* olarak adlandırılır.

:::info
**Önemli Bilgi:** Argümanlar için doğru sıralama ve yapı, komut satırının işlevselliği açısından kritik öneme sahiptir.
:::