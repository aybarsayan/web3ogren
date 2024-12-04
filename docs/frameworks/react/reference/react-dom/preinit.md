---
title: preinit
seoTitle: Preinit Function in React
sidebar_position: 4
description: preinit function allows for pre-fetching stylesheets or external scripts, improving load times. This guide details its parameters and usage examples.
tags: 
  - React
  - JavaScript
  - Development
  - Performance
keywords: 
  - preinit
  - react-dom
  - asynchronous loading
  - performance optimization
---
`preinit` fonksiyonu şu anda yalnızca React'in Canary ve deneysel kanallarında mevcuttur. `React'in sürüm kanalları hakkında daha fazla bilgi edinin`.



:::note
`React tabanlı çerçeveler` genellikle kaynak yüklemeyi sizin için halleder, bu nedenle bu API'yi kendiniz çağırmak zorunda kalmayabilirsiniz. Detaylar için çerçevenizin belgelerine danışın.
:::



`preinit`, bir stil sayfasını veya dış betiği önceden almanıza ve değerlendirmenize olanak tanır.

```js
preinit("https://example.com/script.js", {as: "script"});
```