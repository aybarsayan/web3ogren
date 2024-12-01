---
title: Geliştirici API'si
description: Geliştirici API'si, Node.js'i tsx ile geliştirme sürecini kolaylaştırır. Bu belge, API'nin kullanımı ve modül türleri hakkında bilgi sunar.
keywords: [Geliştirici API, Node.js, tsx, CommonJS, ES Modül, TypeScript, CLI]
---

# Geliştirici API'si

Geliştirici API'si, `tsx` komutunu kullanmanıza gerek kalmadan Node.js'i _tsx_ ile geliştirmenizi sağlar.

:::info
`_Watch modu_` ve `REPL` gibi CLI özelliklerinin mevcut olmayacağını unutmayın.
:::

## Kullanım Durumları

### `node`'u Doğrudan Çalıştırmak

Bazen, `node`'u doğrudan çalıştırmanız gerekebilir ancak yine de _tsx_ kullanmak istersiniz. `tsx` komutunu kullanmak yerine, bunu Node'a `node --import tsx` ile geçirebilir veya script'inizin en üstünde `import 'tsx'` yapabilirsiniz. 

> Bu, Node.js ortamında daha fazla kontrol sağlamanız gerektiğinde, belirli şekilde `node` çağrısı yapan araçlarla entegre olduğunuzda veya yalnızca `node` komutunu kullanmayı tercih ettiğinizde yararlıdır.  
> — Geliştirici API Dokümantasyonu

### 3. Taraf Paketleri

Bazı üçüncü taraf paketleri, tüm çalıştırma ortamını etkilemeden yapılandırma dosyaları gibi TypeScript dosyalarını yüklemek zorundadır. `tsImport()` API'si` bu paketlerin TypeScript dosyalarını yerel olarak yüklemesine olanak tanır ve ortama yan etkilerde bulunmaz.

## Modül Türlerini Anlamak

Geliştirici API'sini kullanırken Node.js modül türlerini, CommonJS (CJS) ve ES Modül (ESM) anlamak faydalı olabilir.

ESM, modern standarttır ve JavaScript için `.mjs`, TypeScript için `.mts` dosya uzantıları ile gösterilir. CommonJS, daha eski format olup JavaScript için `.cjs`, TypeScript için `.cts` dosya uzantılarını kullanır. 


Dosya Uzantıları ve Modül Türleri
Dosya uzantısı belirsiz olduğunda, örneğin `.js` veya `.ts`, [`package.json#type`](https://nodejs.org/api/packages.html#type) modül türünü belirlemek için kullanılır. Eğer `type` `module` olarak ayarlanmışsa, dosyalar ES Modülleri olarak işlenir. Eğer `type` `commonjs` olarak ayarlanmışsa veya hiç ayarlanmamışsa, dosyalar CommonJS modülleri olarak işlenir.


Her ne kadar her iki modül türü aynı ortamda bir arada var olabilse de, kendilerine özgü kapsamları ve davranışları vardır. _tsx_, hem CommonJS hem de ES modüllerini seçici bir şekilde geliştirmek için API'ler sunar. 

:::tip
Bu ayırt edici özelliklerin farkında olmak ve hangi modül türünü kullandığınızı bilmek, bu geliştirmeleri tercih ederken bilinçli kararlar vermenizi sağlayacaktır.
:::