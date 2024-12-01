---
title: Async iterator
description: CSV Parse - ES6 async iterator kullanarak kayıtlarınızı nasıl dolaşacağınızı gösterir. Bu kılavuz, asenkron iteratorlar ve CSV ayrıştırma sürecinin nasıl çalıştığını detaylı bir şekilde açıklar.
keywords: ['csv', 'parse', 'parser', 'örnek', 'tarif', 'asenkron', 'iterator', 'akış', 'boru', 'oku', 'vaat']
---

# Async iterator

Asenkron iteratorlar, her bir ayrıştırılmış kaydı yinelemek için [`for await...of` yapısını](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) kullanarak şık bir yöntem sağlar.

:::info
CSV parse, Node.js akış okunabilir API'sine dayanır ve bunu kullanır. 
:::

[Ayrıca,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator) [Symbol.asyncIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator) veya [Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator) iterable protokolünü uygular.

Bu, tür olarak belirsiz bir JS işlevselliğidir ve bununla uğraşmamıza gerek yoktur. Nihai sonuç oldukça kapsamlıdır ve aşağıda bir referans ile gösterilmektedir:

> **Not:** [asenkron iterator örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/recipe.async.iterator.js)
> — Kaynak: node-csv

Bu örneğe `node samples/recipe.async.iterator.js` komutu ile erişebilirsiniz.

`embed:packages/csv-parse/samples/recipe.async.iterator.js`

Asenkron yineleme, CoffeeScript'te de desteklenmektedir. Sürüm 1.12.0'dan itibaren mevcut olan [`for...from`](https://coffeescript.org/#generators) sözdizimi ile ifade edilir. 

:::note
[Coffeescript'teki asenkron örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/recipe.async.iterator.coffee) şöyle:
:::

`embed:packages/csv-parse/samples/recipe.async.iterator.coffee`