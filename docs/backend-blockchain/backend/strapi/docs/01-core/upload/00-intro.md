---
title: Giriş
description: Bu belge, Yükleme çekirdek eklentisiyle ilgili kapsamlı bir genel bakış sunmaktadır. Eklentinin tüm özellikleri ve kullanımı hakkında bilgi bulabilirsiniz.
keywords: [Yükleme, eklenti, içerik yöneticisi, özellikler, genel bakış]
---

# İçerik Yöneticisi

Bu bölüm, Yükleme çekirdek eklentisiyle ilgili tüm özelliklerin genel bir görünümüdür:

:::tip
Yükleme eklentisini kullanırken, eklentinin tüm özelliklerini etkin bir şekilde kullanabilmek için belgeleri dikkatlice incelemeniz önerilir.
:::

```mdx-code-block
import DocCardList from '@theme/DocCardList';
import { useCurrentSidebarCategory } from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items} />
```

Bu belgeyle ilgili anahtar noktalar:

> Yükleme eklentisi, içerik yönetimini kolaylaştırmak için tasarlanmıştır.  
> — Yükleme Eklentisi Takımı

Ayrıca, eklentinin bazı önemli özelliklerini aşağıdaki gibi sıralayabiliriz:

- **Kullanıcı dostu arayüz**
- **Gelişmiş dosya yükleme seçenekleri**
- **Desteklenen dosya formatları**

---


Önemli Bilgiler

### Yükleme Eklentisi Hakkında

Eklenti, içerik yöneticileri için çeşitli dosyaların yüklenmesini sağlar. **Dosya boyutu** ve **formatı** gibi kriterler, yükleme sürecinde dikkate alınmalıdır.

