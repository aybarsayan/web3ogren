---
title: Giriş
description: Bu belge, içerik yöneticisinin temel özelliklerini ve işlevlerini tanıtmaktadır. Kullanıcıların içeriklerini kolayca yönetmelerine yardımcı olmak için tasarlanmıştır.
keywords: [içerik yöneticisi, Strapi, API, eklenti, içerik yönetimi]
---

# İçerik Yöneticisi

## İçerik Yöneticisi Nedir?

İçerik yöneticisi, kullanıcıların içeriklerini yazmasına, güncellemesine ve silmesine olanak tanıyan bir eklentidir. Şu anda `@strapi/admin` paketinin içinde bulunmaktadır, ancak V5'ten itibaren kendi eklentisine geri alınacaktır. 

:::tip
İçerik yöneticisinin en temel haliyle, sadece bir **tablo** ve birkaç **form**dan oluştuğunu unutmayın.
:::

Bu formları ve tabloları manipüle etmek için birkaç **kamu API'si** ve kullanıcıların içerik yöneticisi eklentisinin dışında kendi eklentileriyle etkileşimde bulunmaları için bazı **evrensel kancalar** bulunmaktadır.

## Bölümler

```mdx-code-block
import DocCardList from '@theme/DocCardList';
import { useCurrentSidebarCategory } from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items.filter(item => item.label !== "Giriş")} />
```