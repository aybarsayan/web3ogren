---
title: Seçenek Yorum
description: Seçenek "yorum" karakterlerini göz ardı eder. Bu özellik, veri analizi sırasında yorum satırlarını etkili bir şekilde işlemenizi sağlar.
keywords: [csv, parse, options, comment, escape, data analysis, parsing comments]
---

# Seçenek `yorum`

Bu karakterden sonrasını bir yorum olarak değerlendirir. Bir veya birden fazla kaçış karakterinden oluşabilir. Varsayılan olarak, boş bir dize `""` tanımlanarak devre dışı bırakılır.

* **Tür:** `boolean`
* **Opsiyonel**
* **Varsayılan:** `""`
* **Bu sürümden itibaren:** ilk günler

:::tip
Kaçış dizisinin tanımlanması, yorum satırlarının daha esnek işlenmesine yardımcı olur.
:::

Kaçış dizisi, kaydın başında (eğer kayıt ayırıcı bir satır sonu ise bir satır) veya başka bir yerde tanımlanabilir. Kaçış dizisinden sonra bulunan her karakter yok sayılacaktır.

Kaçış, bir alıntılanmış alanda devre dışıdır. Kaçış dizisi, diğer baytlar gibi korunacaktır. Kaçışı yapılamaz.

---

# Örnek

:::info
Aşağıdaki örnek, yorum satırlarını nasıl etkili bir şekilde işleyebileceğinizi gösterir.
:::

[yorum örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.comment.js), dosyanın başında bir tane ve bir kaydın ardından bir tane olmak üzere iki yorum ekler.

> “Bu yorum satırları veri işleme sürecinde önemli bir rol oynar.”  
> — Kaynak: CSV Parse Belgeleri

```javascript
// Örnek kod
const parse = require('csv-parse');
```


Detaylar

Kaçış dizisi, yorumun nerede başladığını ve bittiğini belirlemek için kullanılır. 

```javascript
// Başka bir örnek
const parser = parse({
  comment: '#',
});
```


`embed:packages/csv-parse/samples/option.comment.js`