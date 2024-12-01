---
title: Callback API
description: Callback API, tüm kayıtları dönüştürür ve sonuçları kullanıcı tarafından sağlanan bir işlevine geçirilen tek bir veri kümesine tamponlar. Bu API, büyük veri ile çalışırken verimliliği artırmak için kullanılır.
keywords: [csv, parse, api, callback, function, udf, stream]
sort: 3.2
---

# Callback API

Callback API, tüm kayıtları dönüştürür ve sonuçları kullanıcı tarafından sağlanan bir işlevine geçilen tek bir veri kümesine tamponlar. Sonuç olarak, oluşan veri kümesi belleğe sığmalıdır. 

:::tip
İmza: `const stream = transform(records, [options], handler, [callback])`
:::

Girdi kaynağı çok büyük olmadığında kullanılmalıdır.

## Örnek

[callback örneği](https://github.com/adaltas/node-csv/blob/master/packages/stream-transform/samples/api.callback.js) içinde, kullanıcı işlevi her kaydın hücrelerini kaydırır.

```javascript
embed:packages/stream-transform/samples/api.callback.js
```

_Bu örnek `node samples/api.callback.js` komutuyla kullanılabilir._

---

### Ekstra Bilgi


Detaylar

API kullanımı hakkında daha fazla bilgi için ilgili dökümana göz atabilirsiniz.



---

> **Not:** Callback API, büyük miktarda veri için optimal performansı sağlamak üzere tasarlanmıştır.
> — Dökümantasyon Ekibi