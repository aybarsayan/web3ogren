---
title: react-test-renderer Kullanımdan Kaldırma Uyarıları
seoTitle: react-test-renderer Kullanım Duyuruları
sidebar_position: 4
description: Bu doküman, react-test-rendererın kullanımının kaldırılması hakkında önemli uyarılar ve alternatif test kütüphanelerine geçiş önerileri sunmaktadır.
tags: 
  - react-test-renderer
  - test araçları
  - React
keywords: 
  - react-test-renderer
  - testing-library/react
  - testing-library/react-native
---
## ReactTestRenderer.create() uyarısı {/*reacttestrenderercreate-warning*/}

:::warning
react-test-renderer kullanılmaktan kaldırılmıştır. ReactTestRenderer.create() veya ReactShallowRender.render() çağrıldığında bir uyarı tetiklenecektir. 
:::

react-test-renderer paketi NPM'de mevcut olmaya devam edecek ancak bakım yapılmayacak ve yeni React özellikleri veya React'ın iç yapısındaki değişiklikler ile bozulabilir.

React Takımı, modern ve iyi desteklenen bir test deneyimi için testlerinizi [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) veya [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/start/intro) kütüphanesine geçirmenizi önermektedir.

## new ShallowRenderer() uyarısı {/*new-shallowrenderer-warning*/}

:::info
react-test-renderer paketi artık `react-test-renderer/shallow` ile bir shallow renderer dışa aktarmamaktadır. Bu, önceden ayrı bir paket olan `react-shallow-renderer`'ın yeniden paketlenmesiydi. 
:::

Bu nedenle, shallow renderer'ı doğrudan kurarak aynı şekilde kullanmaya devam edebilirsiniz. Daha fazla bilgi için [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer) sayfalarına bakabilirsiniz.