---
title: FXP Sayı Analizi
description: FXP, sayısalları analiz etmek için strnum npm kütüphanesini kullanır. Bu kütüphane sayesinde sayısal verilerinizi çeşitli şekilde analiz edebilirsiniz.
keywords: [FXP, sayısal analiz, strnum, numParseOptions, JavaScript]
---

From 3.20.0

FXP, sayısalları analiz etmek için [strnum](https://github.com/NaturalIntelligence/strnum) npm kütüphanesini kullanır. Bu nedenle, *strnum* tarafından desteklenen seçenekleri `numParseOptions` özelliğine geçirebilirsiniz.

```js
const result = parser.parse(xmlData, {
    parseNodeValue: true, //varsayılan
    numParseOptions: {
        hex :  true, //eğer true ise onaltılık sayılar ondalık sayılara dönüştürülecek
        leadingZeros: true, //eğer true ise '006' 6 olarak işlenecek
        skipLike: /regex/ //belirtilirse, verilen regex ile eşleşen string işlenmeyecek
    }
});
```

---

:::info
Geriye dönük uyumluluk sağlanması için, `parseTrueNumberOnly` özelliği true olarak ayarlanabilir.
:::

eğer `parseTrueNumberOnly` true olarak ayarlanmışsa

```js
const result = parser.parse(xmlData, {
    parseNodeValue: true, //varsayılan
    parseTrueNumberOnly: true
});
```

o zaman şu şekilde kabul edilecektir 

```js
const result = parser.parse(xmlData, {
    parseNodeValue: true, //varsayılan
    numParseOptions: {
        hex :  true,
        leadingZeros: false,
    }
});
```

---

**Kırıcı değişiklik**

:::warning
Uzun sayılar bilimsel gösterim olarak işlenecektir, bu nedenle bu durumu göz önünde bulundurmalısınız.
:::
``` 