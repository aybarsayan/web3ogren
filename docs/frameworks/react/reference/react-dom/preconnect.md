---
title: Ön Bağlantı
seoTitle: Ön Bağlantı ile Performans Artırma
sidebar_position: 4
description: preconnect fonksiyonu, kaynakları yüklemesini beklediğiniz bir sunucuya önceden bağlanmanızı sağlar. Bu makalede preconnect kullanımının temel yönlerini keşfedin.
tags: 
  - preconnect
  - React
  - performans
  - kaynak yönetimi
keywords: 
  - preconnect
  - React
  - kaynak
  - yükleme hızı
---
`preconnect` fonksiyonu şu anda yalnızca React'in Canary ve deneysel kanallarında mevcuttur. Daha fazla bilgi almak için `React'ın sürüm kanalları hakkında burada öğrenin`.





`preconnect`, kaynakları yüklemesini beklediğiniz bir sunucuya önceden bağlanmanızı sağlar.

```js
preconnect("https://example.com");
```