---
title: ngMocks.defaultConfig
description: Documentation about ngMocks.defaultConfig from ng-mocks library. This guide covers the default configurations for components and directives using ngMocks, highlighting best practices and examples.
keywords: [ngMocks, defaultConfig, MockBuilder, Angular testing, structural directives, configuration]
---

Mocks için varsayılan yapılandırmayı ayarlar `MockBuilder`.

- `ngMocks.defaultConfig( Component, config )` - bir bileşen için varsayılan yapılandırma ayarlar
- `ngMocks.defaultConfig( Directive, config )` - bir direktif için varsayılan yapılandırma ayarlar
- `ngMocks.defaultConfig( Component )` - yapılandırmayı kaldırır
- `ngMocks.defaultConfig( Directive )` - yapılandırmayı kaldırır

:::tip
Bunu yapmak için en iyi yer `src/test.ts` dosyasıdır, jasmine için veya `src/setup-jest.ts` / `src/test-setup.ts` dosyasıdır, jest için.
:::

Örneğin, her zaman görüntülemek istediğiniz **basit bir yapısal direktifiniz** varsa, bunu `ngMocks.defaultConfig` ile yapılandırabilirsiniz.

```ts title="src/test.ts"
// Bir yapısal direktif için yapılandırma.
ngMocks.defaultConfig(StructuralDirective, {
  // varsayılan olarak direktifin sahte halini oluştur
  render: true,
});

// İçerik görünümleri olan bir bileşen için yapılandırma.
ngMocks.defaultConfig(ViewComponent, {
  render: {
    // varsayılan olarak bir bloğu oluştur
    block1: true,
    
    // bağlam ile bir bloğu oluştur
    block2: {
      $implicit: {
        data: 'MOCK_DATA',
      },
    },
  },
});

// yapılandırmayı kaldırma.
ngMocks.defaultMock(StructuralDirective);
```

:::info
Yukarıdaki örnek, hem yapılandırmayı nasıl uygulayacağınızı hem de kaldıracağınızı göstermektedir. Bu, testlerde güvenilirlik ve bütünlük sağlamak için önemlidir.
:::