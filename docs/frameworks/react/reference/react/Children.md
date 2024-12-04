---
title: Çocuklar
seoTitle: React Children API Kullanımı
sidebar_position: 4
description: Reactta children propunun nasıl kullanılacağını ve Children APIsinin işlevlerini öğrenin. Çocukları sayma, dönüştürme ve yönetme örneklerine göz atın.
tags: 
  - React
  - children
  - props
  - JSX
  - API
keywords: 
  - React
  - children
  - props
  - JSX
  - API
---
:::warning
`Çocuklar` kullanımı nadirdir ve kırılgan koda yol açabilir. `Ortak alternatiflere bakın.`
:::

:::info
`Çocuklar`, aldığınız JSX'i `children` prop.` üzerinde manipüle etmenizi ve dönüştürmenizi sağlar.
:::

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);
```