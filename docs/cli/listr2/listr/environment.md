---
title: Ortam
order: 10
description: Bu belge, `listr2` kütüphanesinin desteklediği `node.js` ortamları ve modül yapıları hakkında bilgi sağlar. Ayrıca, `esm` ve `cjs` desteği ile ilgili geçiş süreçlerini değinir.
keywords: [listr2, node.js, cjs, esm, modül yapıları, görev listesi]
---



`listr2`, çoğunlukla CLI uygulamaları için tasarlandığından, yalnızca modern `node.js` ortamlarını destekler, ancak herhangi bir uygulamada görev listesi olarak da kullanılabilir.



- `listr2`, şu an için hem `esm` hem de `cjs` modüllerini desteklemektedir.
- Desteklenen bir `node.js` sürümüne ihtiyacınız var, desteklenmeyen ve sonlandırılmış sürümler kullanımdan kaldırılmıştır.

## Birden Fazla Node Modül Yapısını Destekleme

Bir noktada, `cjs` desteği `node.js` ekosistemine ayak uydurmak için kaldırılacaktır. Bu elbette büyük bir sürümle yapılacaktır.

:::tip
Gelecekteki sürümlerde `cjs` desteğinin kaldırılması durumunda, projelerinizi `esm` modül sistemine uygun hale getirmek için zamanında planlamalar yapmanız önemlidir.
:::

Ancak, şu anda çoğunlukla `cjs` kütüphanelerine bağımlı olduğum durumumu göz önünde bulundurarak, `esm`'ye doğru yavaşça geçiş yaparken `cjs` sürümünü korumak istiyorum.

`ts-node`, `jest` ve `ts-jest` üzerindeki son değişiklikler, repository'deki her şeyi `esm`'ye taşıma imkanını sağladı. Bu, sürüm `>= 6`'dan itibaren repository'nin `esm` modülü kullanan her şey için dinamik importları kullanmasına izin verdi. Dolayısıyla, o sürüm ve sonraki sürümlerde her şey bağımlılıkların güncel haliyle uyumlu olmalıdır. Bu nedenle, `cjs` sürümünü korumak, ilgili paketleri güncellememize engel teşkil etmez.

### Dezavantajlar

- İki örneği birleştirmek zorundayız, bu da dağıtım boyutumuzu iki katına çıkarır.
- Topluluk tamamen `esm` modüllerine geçiyor. Birçok temel `npm` paketinin bakımını üstlenen [sindresorhus](https://github.com/sindresorhus), sonlandırılmış `node.js` `10` desteğiyle bu hareketi yönlendirmelidir. Daha fazlasını [buradan](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) okuyabilirsiniz.