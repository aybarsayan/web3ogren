---
title: Eski tarayıcı ortamlarında IIFE Vanilla JavaScript
description: IIFE dağıtımı, ECMAScript modüllerini desteklemeyen eski tarayıcılara hitap etmektedir. Bu dokümanda IIFE kullanarak vanilla JavaScript ile CSV verilerini işleme yöntemleri açıklanmaktadır.
keywords: [csv, iife, tarayıcı, vanilla javascript, oluştur, ayıkla, dönüştür, stringify]
sort: 4.4
---

# Eski Tarayıcılar İçin Vanilla JavaScript (IIFE)

[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) dağıtımı, ECMAScript modüllerini desteklemeyen tarayıcılara yöneliktir.

:::tip
IIFE'lar, kodunuzu bir fonksiyon içinde sarmalayarak global alanı kirletmemenizi sağlar. Bu, değişken isimlerinin çakışmasını önler.
:::

Dosyalar [`packages/csv/dist/iife`](https://github.com/adaltas/node-csv/tree/master/packages/csv/dist/iife) klasörü içinde bulunmaktadır. Projenize içe aktarın veya paketi indirmek ve ona atıfta bulunmak için NPM kullanın.

Sayfa bağlamında global olarak mevcut:

* **Akış ve geri çağırma API'si**: `stream_transform.transform(/* arguments */);`
* **Senkron API**: `stream_transform_sync.transform(/* arguments */);`

## Örnek

Çalışan bir demo, [`demo/browser`](https://github.com/adaltas/node-csv/tree/master/demo/browser) dizininde mevcuttur.

* [`./iife/csv.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/iife/csv.html)
* [`./iife/csv_sync.html`](https://github.com/adaltas/node-csv/tree/master/demo/browser/iife/csv_sync.html)

:::info
Express ile dosyaları sunarken, doğru yolda olduğunuzdan emin olun.
:::

Express ile dosyaları şu şekilde sunabilirsiniz:

```js
const app = express();
app.use('/lib/csv/',
  express.static(`node_modules/csv/dist/iife/`));
app.listen(3000);
```

HTML kodu şöyle görünmektedir:

```html
<script src="/lib/csv/index.js"></script>
<script>
  csv
  // 20 kayıt oluştur
  .generate(/* arguments */)
  // CSV verilerini kayıtlara dönüştür
  .pipe(csv.parse(/* arguments */))
  // Her değeri büyük harfe dönüştür
  .pipe(csv.transform(/* arguments */))
  // Nesneleri bir akışa dönüştür
  .pipe(csv.stringify(/* arguments */))
  .pipe(/* çıktıyı tüket */)
</script>
```

:::note
Bu yapılandırma, CSV verilerini işlemek için esnek bir yol sunmaktadır. Her aşamada belirli dönüşümler gerçekleştirebilirsiniz.
:::

Senkron API kullanmak istiyorsanız, şunu kullanın:

```html
<script src="/lib/csv/sync.js"></script>
<script>
  const input = csv_sync.generate(/* arguments */);
  const rawRecords = csv_sync.parse(input, /* arguments */);
  const refinedRecords = csv_sync.transform(rawRecords, /* arguments */);
  const output = csv_sync.stringify(refinedRecords, /* arguments */);
</script>
```