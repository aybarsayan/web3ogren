---
title: Giriş
description: Bu doküman, içerik baskılarının mimarisini ve durumlarını detaylandırmaktadır. Kullanıcıların baskı süreçleri hakkında bilgi sahibi olmalarını ve olası durumları anlamalarını sağlar.
keywords: [İçerik Baskıları, Yayınlama, Eklenti, Durum, Kurumsal Sürüm]
---

# İçerik Baskıları

Bir baskı, yayınlama veya geri alma gibi belirli bir eyleme atanabilen çeşitli içerik girdilerini içerir. Bir baskı içinde, girdiler farklı yerel dillerde olabilir veya farklı içerik türlerinden gelebilir. Bir düğmeye tıklayarak, bir baskı her girdi için belirtilen eylemi gerçekleştirebilir. **İçerik Baskıları**, bir kurumsal sürüm özelliğidir.

### Mimari

Diğer EE özelliklerinin `EE klasörü` içinde yer aldığına karşın, Baskılar bir eklenti olarak oluşturulmuştur. Eklenti şu konumda bulunabilir:

```
packages/core/content-releases
```

```mdx-code-block
import DocCardList from '@theme/DocCardList';
import { useCurrentSidebarCategory } from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items} />
```

### Baskının durumu

Baskılara beş durumdan biri atanır:

- **Hazır**: Baskının yayınlamaya tam olarak hazır olduğunu, geçersiz girdi bulunmadığını gösterir.
- **Engelli**: Yayınlamayı engelleyen en az bir geçersiz girdi içeren baskı.
- **Boş**: Hiç girdi içermeyen ve yayınlanamayan baskı.
- **Başarısız**: Yayınlama girişiminin bir hata ile karşılaştığını, o zamandan beri hiçbir değişiklik yapılmadığını gösterir.
- **Tamamlandı**: Baskının herhangi bir hata ile karşılaşmadan başarıyla yayınlandığını onaylar.

:::tip
Bu durumlar, oluşturma, ekleme/çıkarma, güncellemeler ve yayınlama girişimleri gibi eylemlere dayalı olarak dinamik olarak güncellenir.
:::

:::info
Baskı hazır olma durumu ve geçerliliği ile ilgili kısa bir genel bakış sağlar, böylece operasyonların ve veri bütünlüğünün sorunsuz bir şekilde devam etmesini sağlar.
:::

> "İçerik Baskıları, kurumsal sürüm süreçlerinin önemli bir parçasıdır."  
> — İçerik Yönetimi Ekibi

---