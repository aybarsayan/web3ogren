---
title: Yönetici
description: Yönetici, özelleştirilmiş bir Listr sınıfı oluşturmanın ve bunu birden çok kez kullanmanın harika bir yoludur. Ek bir görev yöneticisi sayesinde, seçeneklerinizi talep üzerine Listr oluşturmak için saklayabilir ve yönetebilirsiniz.
keywords: [Listr, yönetici, görev yönetimi, fabrika, kullanılabilirlik, uygulama örneği]
order: 100
tag:
  - ileri
  - akış
category:
  - yönetici
---



`Yönetici`, özelleştirilmiş bir _Listr_ sınıfı oluşturmanın ve bunu birden çok kez kullanmanın harika bir yoludur.



::: info Örnek

İlgili örnekleri [burada](https://github.com/listr2/listr2/tree/master/examples/manager.example.ts) bulabilirsiniz.

Gerçek bir kullanım durumunu da [burada](https://github.com/tailoredmedia/backend-nx-skeleton/blob/master/packages/nx-tools/src/utils/manager.ts) bulabilirsiniz.

:::

::: danger

`@listr2/manager` isteğe bağlı bir eş bağımlılıktır. Lütfen önce bunu kurun.

::: code-group

```bash [npm]
npm i @listr2/manager
```

```bash [yarn]
yarn add @listr2/manager
```

```bash [pnpm]
pnpm i @listr2/manager
```

:::

## Fikir

Ek bir görev yöneticisine sahip olmanın amacı, her zaman seçeneklerinizle talep üzerine _Listr_ oluşturmak için daha yüksek düzeyde bir fabrika oluşturmaktır. **Bu**, yeni bir _Listr_ oluşturduğunuzda her seferinde enjekte ettiğiniz değişkenler olarak seçeneklerinizi saklamak yerine bir durum yöneticisinde saklamanıza olanak tanır; burada istediğiniz kadar _Listr_ görev listesi başlatabilirsiniz.

::: tip

Görev yöneticisini kullanarak, görevlerinizi daha iyi organize edebilir ve yönetebilirsiniz.

:::

Alternatif olarak, istediğiniz kadar görev ekleyebileceğiniz devam eden eylemler için tek bir görev listesi olarak da kullanılabilir. Bu, _Listr_ üzerinden de mümkündür ancak yapmak o kadar da pratik değildir.