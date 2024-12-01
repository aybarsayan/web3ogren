---
title: Lazy Yüklemiş Modüllerin Bildirimlerini Test Etme
description: Lazy yüklemiş bir modülün nasıl taklit edileceğine ve bildirimlerinin nasıl test edileceğine dair bir örnek. Bu içerik, lazy yüklemenin avantajlarını ve test süreçlerini ele almaktadır.
keywords: [Lazy yükleme, test süreçleri, Angular, MockBuilder, LazyComponent]
sidebar_label: Lazy yüklemiş modüller
---

Lazy yüklemiş bir modülün bildirimlerini test etme süreci, normal modüllerin bildirimlerini test etme süreciyle aynıdır. Ancak, lazy yüklemiş modülü yükleyen ana modülden bildirimlere ihtiyacımız olabilir.

:::tip
Lazy yüklemiş modüllerle çalışırken, ana modülü anlamak ve ona göre test senaryoları oluşturmak önemlidir.
:::

Böyle bir durum için, `MockBuilder` ikinci parametre olarak modüllerin bir dizisini destekler. Burada, lazy yüklemiş modülü ve ana modülünü sağlayabiliriz.

```ts
beforeEach(() => MockBuilder(LazyComponent, [AppModule, LazyModule]));
```

Artık `AppModule` içindeki tüm bildirimler taklit edilecek ve dışa aktarılacaktır. `LazyModule` içindeki bildirimler de `LazyComponent` hariç aynı şekilde gerçekleşir.

```ts
it('renders LazyComponent', () => {
  const fixture = MockRender(Component1);
  expect(ngMocks.formatText(fixture)).toEqual('lazy-loaded');
});
```

Kâr.

## Canlı örnek

- [CodeSandbox’da deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestLazyModule/test.spec.ts&initialpath=%3Fspec%3DTestLazyModule)
- [StackBlitz’de deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestLazyModule/test.spec.ts&initialpath=%3Fspec%3DTestLazyModule)

:::info
Bu örnekler, lazy yükleme ile ilgili test süreçlerini hızlıca denemenizi sağlar. 
:::

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestLazyModule/test.spec.ts"
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

import { LazyComponent, LazyModule } from './lazy-module';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
class AppComponent {}

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot([
    {
      loadChildren: () => import('./lazy-module').then(module => module.LazyModule),
      path: '',
    },
  ])],
})
class AppModuleRouting {}

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [AppModuleRouting],
})
class AppModule {}

describe('TestLazyModule', () => {
  beforeEach(() =>
    MockBuilder(LazyComponent, [AppModule, LazyModule]),
  );

  it('renders lazy component', () => {
    const fixture = MockRender(LazyComponent);
    expect(ngMocks.formatText(fixture)).toEqual('lazy-component');
  });
});
```

:::note
Lazy yüklemelerin test edilmesi, etkileşimli kullanıcı arayüzlerinin daha verimli ve hızlı bir şekilde yönetilmesine olanak tanır.
:::