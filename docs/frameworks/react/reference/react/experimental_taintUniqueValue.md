---
title: deneysel_taintUniqueValue
seoTitle: Experimental taintUniqueValue API
sidebar_position: 4
description: Bu API, Reactın deneysel sürümünde bulunan taintUniqueValue fonksiyonunu tanıtır. Kişisel anahtarlar gibi benzersiz verilerin Client Bileşenlerine geçmesini önler.
tags: 
  - API
  - React
  - güvenlik
  - experimental
keywords: 
  - taintUniqueValue
  - React
  - client components
  - security
---
**Bu API deneysel olup, henüz React'ın kararlı sürümünde mevcut değildir.**

Bunu deneyebilmek için React paketlerini en son deneysel sürüme yükseltebilirsiniz:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

React'ın deneysel sürümleri hatalar içerebilir. Bunları üretimde kullanmayın.

Bu API yalnızca `React Sunucu Bileşenleri` içinde mevcuttur.





`taintUniqueValue`, şifreler, anahtarlar veya jetonlar gibi benzersiz değerlerin Client Bileşenlerine geçirilmesini önlemenizi sağlar.

```js
taintUniqueValue(errMessage, lifetime, value)
```

Hassas veriler içeren bir nesnenin geçirilmesini önlemek için `taintObjectReference` sayfasına bakın.