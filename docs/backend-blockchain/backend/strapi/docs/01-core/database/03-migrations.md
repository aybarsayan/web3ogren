---
description: Strapi'deki göçler için kavramsal rehber. Bu içerik, Strapi'de veri yapılarının nasıl yönetileceği ve migrate işlemlerinin gerçekleştirilmesi hakkında bilgi sunmaktadır.
keywords: [Strapi, göç, veritabanı, schema, migration]
---

Strapi, şema ve veritabanı göçlerini birkaç yolla yönetir. Veritabanı şemasını uygulama yapılandırmasıyla otomatik olarak senkronize etmeye çalışıyoruz. Ancak bu, veritabanı göçlerini veya uzlaşılabilir olmayan şema göçlerini yönetmek için yeterli değildir.

![Migration flowchart](../../../../../images/cikti/backend/strapi/static/img/database/migration-flow.png)

## Dahili göçler

:::info
Dahili göçler, uygulama geliştirmelerini desteklemek için gereklidir. Bu işlemler, uygulama ile veritabanı arasında tutarlılığı sağlamada kritik rol oynar.
:::

### Göç oluşturma

- `packages/core/database/src/migrations/internal-migrations` dizininde bir göç dosyası ekleyin
- Aynı klasördeki `index.ts` dosyasına aktarın ve onu dışa aktarılan diziye son eleman olarak ekleyin.

### Göç dosyası formatı

Her göç bu API'yi takip etmelidir:

```ts
export default {
  name: 'name-of-migration',
  async up(knex: Knex, db: Database): void {},
  async down(knex: Knex, db: Database): void {},
};
```

:::tip
Göç dosyalarını oluşturmak için doğru dizini kullandığınızdan emin olun. Ayrıca, `index.ts` dosyasındaki diziye eklemeyi unutmayın.
:::

---
