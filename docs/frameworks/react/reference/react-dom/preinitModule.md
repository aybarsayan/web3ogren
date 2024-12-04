---
title: preinitModule
seoTitle: Understanding preinitModule in React
sidebar_position: 4
description: The preinitModule function in Reacts experimental channels allows you to pre-load ESM modules. Understand its parameters, usage, and important considerations.
tags: 
  - React
  - JavaScript
  - ESM
  - Web Development
keywords: 
  - preinitModule
  - React
  - JavaScript
  - ESM
  - Web Development
---
`preinitModule` fonksiyonu şu anda yalnızca React'in Canary ve deneysel kanallarında mevcuttur. `React'in sürüm kanalları hakkında daha fazla bilgi edinin`.





`React tabanlı çerçeveler` genellikle kaynak yüklemesini sizin için halleder, bu nedenle bu API'yi kendiniz çağırmanıza gerek kalmayabilir. Ayrıntılar için çerçevenizin belgelerine danışın.





`preinitModule`, bir ESM modülünü istekle indirip değerlendirmeyi sağlar.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```