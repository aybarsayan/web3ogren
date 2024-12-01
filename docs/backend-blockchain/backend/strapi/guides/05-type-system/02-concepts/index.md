---
title: Kavramlar
description: Bu sayfa, TypeScript dilinde tür sisteminin temel kavramlarını açıklamaktadır. TypeScript'in sunduğu türler ve onların nasıl kullanıldığı hakkında bilgi sağlanmaktadır.
keywords: [typescript, tür sistemi, tür, kavramlar, programlama, tipler]
---

```mdx-code-block
import DocCardList from '@theme/DocCardList';
import { useCurrentSidebarCategory } from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items} />
```

:::info
TypeScript, JavaScript'e statik tür ekleyerek daha güvenli ve hatasız bir kod yazımını mümkün kılar. 
:::

## Temel Kavramlar

TypeScript'te kullanılan bazı **temel kavramlar** şunlardır:

- **Tipler:** Değişkenlerin saklayabileceği değerlerin türlerini belirtir.
- **Arayüzler:** Bir nesnenin hangi özellik ve metotlara sahip olacağını tanımlar.
- **Sınıflar:** Nesne yönelimli programlamada kullanılmak üzere yapılandırılmış kod birimleridir.

---

:::tip
TypeScript kullanırken, **tipleri** mümkün olduğunca açık bir şekilde belirtmek, kodun okunabilirliğini artırır.
:::

### Tipler

TypeScript, temel olarak birkaç temel tür sunar:

1. **string** - Metin değerlerini temsil eder.
2. **number** - Sayısal değerleri temsil eder.
3. **boolean** - Doğru (true) veya yanlış (false) değerlerini temsil eder.

> "TypeScript, JavaScript'in potansiyel hatalarını en aza indirirken, daha iyi geliştirme deneyimi sağlar." — Yazar


Özel Tipler

TypeScript, ayrıca kullanıcı tanımlı diğer tipleri de destekler. Örneğin:

- **Union Types:** Birden fazla türü birleştirir.
- **Intersection Types:** Birden fazla türün bir araya gelerek yeni bir tür oluşturmasını sağlar.



---

:::warning
TypeScript'te yanlış tip kullanımı, çalışma zamanı hatalarına neden olabilir. Bu yüzden tipleri dikkatlice planlamak önemlidir.
:::

## Sonuç

Bu sayfada, TypeScript'in tür sistemine dair temel kavramlar üzerinde durulmuştur. Daha fazla bilgi ve detaylar için belgelerimizi incelemeye devam edin.