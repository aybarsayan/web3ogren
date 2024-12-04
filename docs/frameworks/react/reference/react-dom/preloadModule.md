---
title: preloadModule
seoTitle: preloadModule Function in React
sidebar_position: 10
description: The preloadModule function allows for preloading ESM modules. This guide explores its usage and parameters.
tags: 
  - React
  - preloadModule
  - ESM
  - react-dom
keywords: 
  - React
  - preloadModule
  - ESM
  - react-dom
---
`preloadModule` fonksiyonu şu anda yalnızca React'in Canary ve deneysel kanallarında mevcuttur. `React'in sürüm kanalları hakkında burada daha fazla bilgi edinin`.





`React tabanlı çerçeveler` genellikle kaynak yüklemeyi sizin için halleder, bu yüzden bu API'yi kendiniz çağırmak zorunda kalmayabilirsiniz. Ayrıntılar için çerçevenizin belgelerine bakın.





`preloadModule`, kullanmayı beklediğiniz bir ESM modülünü istekli bir şekilde almanızı sağlar.

```js
preloadModule("https://example.com/module.js", {as: "script"});
```