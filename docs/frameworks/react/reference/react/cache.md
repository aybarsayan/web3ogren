---
title: önbellek
seoTitle: React Ön bellek Kullanımı
sidebar_position: 4
description: Bu belge, React etrafında önbellek fonksiyonunun nasıl kullanılacağını açıklar. Verimliliğini artırmak için önbelleğe alma yöntemine dair rehberlik sağlar.
tags: 
  - React
  - önbellek
  - geliştirici
keywords: 
  - önbellek
  - React
  - performans
---
* `önbellek`, sadece `React Sunucu Bileşenleri` ile kullanıma yönelik. `Frameworkler` hakkında bilgi edinin, React Sunucu Bileşenlerini destekleyenler.

* `önbellek`, React’in `Canary` ve `deneysel` kanallarında kullanılabilir. `önbellek`'i üretimde kullanmadan önce sınırlamaları anladığınızdan emin olun. `React'ın sürüm kanallarını burada daha fazla öğrenin`.




`önbellek`, veri alma veya hesaplama sonucunu önbelleğe almanızı sağlar.

```js
const cachedFn = önbellek(fn);
```