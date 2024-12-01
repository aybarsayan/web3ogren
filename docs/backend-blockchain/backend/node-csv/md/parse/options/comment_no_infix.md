---
description: "`comment_no_infix` seçeneği, yorum tanımlarını tam satırlara kısıtlar ve satır içi yorumları göz ardı eder. Bu, veri analizinde netlik sağlar."
keywords: ['csv', 'parse', 'options', 'columns', 'comment_no_infix']
---

# Seçenek `comment_no_infix`

`comment_no_infix` seçeneği, yorum tanımlarını **tam satırlara** kısıtlar. Bir satırın ortasında tanımlanan yorum karakterleri, böyle yorum olarak yorumlanmaz.

:::tip
Yorumlar varsayılan olarak devre dışıdır. Dolayısıyla, bu seçenek yalnızca yorumlar etkinleştirildiğinde etkili olur.
:::

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* Sürüm: `5.5.0`
* İlgili: `comment` &mdash; `Mevcut Seçenekler` bölümüne bakın

## Örnek

Varsayılan davranış `[ [ 'a', 'b' ] ]` üretirken, aşağıdaki örnekte `comment_no_infix` aktif hale getirildiğinde, ikinci satırdaki yorum karakteri göz ardı edilir.

> Önemli bir not: `comment_no_infix` seçeneği etkinleştirildiğinde, yorumlar tam satırlar üzerinde geçerli olacak ve yanlış yorumlamaların önüne geçilecektir.  
> — Duygu İ.

`embed:packages/csv-parse/samples/option.comment_no_infix.js`