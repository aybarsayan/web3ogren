---
title: preload
seoTitle: Preload Function in React
sidebar_position: 4
description: Preload is a function that allows you to fetch resources like stylesheets, fonts, or external scripts preemptively. This document covers its usage, parameters, and best practices.
tags: 
  - React
  - preload
  - performance
  - web development
keywords: 
  - React
  - preload
  - performance
  - web development
---
`preload` işlevi şu anda yalnızca React'in Canary ve deneysel kanallarında mevcuttur. Daha fazla bilgi için `React'in sürüm kanallarını buradan öğrenin`.





`React tabanlı frameworkler` genellikle kaynak yüklemeyi sizin için halleder, bu nedenle bu API'yi kendiniz çağırmanıza gerek kalmayabilir. Ayrıntılar için framework'ünüzün belgelerine başvurun.





`preload`, kullanmayı beklediğiniz bir stil sayfası, font veya dış script gibi bir kaynağı istekli bir şekilde almanızı sağlar.

```js
preload("https://example.com/font.woff2", {as: "font"});
```