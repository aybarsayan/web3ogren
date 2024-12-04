---
title: react-dom/test-utils Kullanımdan Kaldırma Uyarıları
seoTitle: react-dom/test-utils Kullanımdan Kaldırma Uyarıları
sidebar_position: 4
description: react-dom/test-utils içindeki act fonksiyonunun kullanılmaması ve geçiş yöntemleri hakkında bilgiler. Ayrıca, kaldırılan APIlerin listesi sunulmaktadır.
tags: 
  - react
  - test-utils
  - react-testing-library
  - Javascript
keywords: 
  - react
  - test-utils
  - act
  - react-testing-library
---
## ReactDOMTestUtils.act() uyarısı {/*reactdomtestutilsact-warning*/}

`react-dom/test-utils` içindeki `act` kullanımdan kaldırılmıştır, yerine `react` içindeki `act` kullanılmalıdır.

Önce:

```js
import {act} from 'react-dom/test-utils';
```

Sonra:

```js
import {act} from 'react';
```