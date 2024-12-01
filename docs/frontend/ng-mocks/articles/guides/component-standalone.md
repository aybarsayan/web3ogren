---
title: Angular'da bağımsız bir bileşeni nasıl test ederiz ve `imports`'ını taklit ederiz
description: Bu bölüm, bağımsız bir bileşenin nasıl test edileceğini ve dışa aktarımlarının nasıl taklit edilebileceğini açıklar. Testler, geliştiricilerin bağımlılıklarını yönetmeleri için önemli bir araçtır. 
keywords: [Angular, test, bağımsız bileşen, MockBuilder, bağımlılıklar, ng-mocks, yazılım geliştirme]
sidebar_label: Bağımsız Bileşen
---

Bu bölüm, bağımsız bir bileşeni nasıl test edileceğini açıklar.

Genellikle geliştiriciler tüm bağımlılıkları taklit etmek ister. 
Bir bağımsız bileşen için bu, tüm içe aktarımlarını ifade eder. 
Bu davranış `MockBuilder` ile elde edilebilir.

Bir sonraki bağımsız bileşene sahip olduğumuzu düşünelim:

```ts
@Component({
  selector: 'target',
  template: `<dependency>{{ name | standalone }}</dependency>`,
  standalone: true,
  imports: [DependencyModule, StandalonePipe],
})
class StandaloneComponent {
  @Input() public readonly name: string | null = null;
}
```

Görüldüğü gibi, `DependencyModule`'ü içe aktarıyor, bu da `DependencyComponent`'i ve `StandalonePipe`'i sağlar ve ideal olarak, bunlar taklit edilmelidir.

Cevap:

```ts
beforeEach(() => {
  return MockBuilder(StandaloneComponent);
});
```

:::tip
`MockBuilder` kullanarak bağımsız bileşeninizi test etme sürecini kolaylaştırabilirsiniz. 
Herhangi bir bağımlılığı taklit etmek istiyorsanız, kullanımı oldukça basittir.
:::

Arka planda, `StandaloneComponent` `kept` olarak işaretlenir ve `shallow` ile `export` bayrakları ayarlanır:

```ts
beforeEach(() => {
  return MockBuilder().keep(StandaloneComponent, {
    shallow: true,
    export: true,
  });
});
```

Hepsi bu. Artık `StandaloneComponent`'in tüm içe aktarımları taklitlerdir ve özellikleri, yöntemleri, enjekte edilenleri ve şablonu test için mevcuttur.

:::info
Eğer bir içe aktarmayı korumanız gerekiyorsa, sadece `.keep` ile çağırın. 
Bu, testlerinizde belirli bileşenleri sürdürmenizi sağlar.
:::

Örneğin, `StandalonePipe`'i korumak istiyorsak kod şöyle görünecektir:

```ts
beforeEach(() => {
  return MockBuilder(StandaloneComponent).keep(StandalonePipe);
});
```

## Canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestStandaloneComponent/test.spec.ts&initialpath=%3Fspec%3DTestStandaloneComponent)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestStandaloneComponent/test.spec.ts&initialpath=%3Fspec%3DTestStandaloneComponent)

```ts title="https://github.com/help-me-mom/ng-mocks/tree/master/examples/TestStandaloneComponent/test.spec.ts"
import {
  Component,
  Input,
  NgModule,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

// Taklit edeceğimiz basit bir bağımsız boru.
@Pipe({
  name: 'standalone',
  standalone: true,
})
class StandalonePipe implements PipeTransform {
  transform(value: string | null): string {
    return `${value}:${this.constructor.name}`;
  }
}

// Taklit edeceğimiz basit bir bağımlılık bileşeni.
@Component({
  selector: 'dependency',
  template: '<ng-content></ng-content>',
})
class DependencyComponent {
  @Input() public readonly name: string | null = null;
}

// Bağımlılık bileşenini bildiren ve dışarı aktaran bir modül.
@NgModule({
  declarations: [DependencyComponent],
  exports: [DependencyComponent],
})
class DependencyModule {}

// Test edeceğimiz bağımsız bir bileşen.
@Component({
  selector: 'standalone',
  template: `<dependency [name]="name">{{
    name | standalone
  }}</dependency>`,
  standalone: true,
  imports: [DependencyModule, StandalonePipe],
})
class StandaloneComponent {
  @Input() public readonly name: string | null = null;
}

describe('TestStandaloneComponent', () => {
  beforeEach(() => {
    return MockBuilder(StandaloneComponent);
  });

  it('bağımlılıkları render ediyor', () => {
    const fixture = MockRender(StandaloneComponent, {
      name: 'test',
    });

    // Girdiği geçirdiğimizi doğrulama
    const dependencyComponent = ngMocks.findInstance(
      DependencyComponent,
    );
    expect(dependencyComponent.name).toEqual('test');

    // Boru nasıl çağırıldığını doğrulama
    const standalonePipe = ngMocks.findInstance(StandalonePipe);
    // Bu, autoSpy sayesinde mümkündür.
    expect(standalonePipe.transform).toHaveBeenCalledWith('test');

    // veya üretilen html'i doğrulama
    expect(ngMocks.formatHtml(fixture)).toEqual(
      '<standalone ng-reflect-name="test"><dependency ng-reflect-name="test"></dependency></standalone>',
    );
  });
});
```  