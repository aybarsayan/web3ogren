---
description: Angular host direktifini taklit etme yöntemlerini keşfedin. Bu kılavuz, mock'lama ile ilgili detaylar, örnek kodlar ve en iyi uygulamalar sunmaktadır.
keywords: [Angular, host direktifi, mocklama, TestBed, MockBuilder, ng-mocks]
---

Bir bileşenin taklit edilmesi gereken bir host direktifi olabilir.

:::tip
`ng-mocks` ile host direktiflerini taklit etmenin birkaç yolu vardır. Aşağıda bu yöntemler açıklanmaktadır.
:::

- `MockBuilder` ve onun `shallow` bayrağı
- `MockBuilder` yapıcı
- `TestBed`

## `shallow` bayrağı

> Bu, tüm host direktiflerini otomatik olarak kapsayan en kolay ve önerilen yoldur, bu nedenle hepsini belirtmeye gerek yoktur.  
> — Angular Best Practices

Tüm host direktiflerini taklit etmek için, yalnızca `MockBuilder.mock` içinde `shallow` bayrağını sağlamak yeterlidir:

```ts
beforeEach(() =>
  MockBuilder().mock(TargetComponent, { shallow: true }),
);
```

Artık, tüm host direktifleri ve bağımlılıkları taklitler olacaktır.

## `MockBuilder`

:::info
`MockBuilder` yalnızca bir veya birkaç host direktifinin taklit edilmesi gerektiğinde faydalıdır.
:::

Bunu yapmak için, host direktifleri `MockBuilder` 'nın ikinci parametresi olarak belirtilmelidir:

```ts
beforeEach(() => MockBuilder(TargetComponent, HostDirective));
```

Bu kadar, şimdi `TargetComponent` bir `HostDirective` taklidine sahip olacaktır.

## TestBed

Eğer `TestBed` kullanıyorsanız, istediğiniz host direktifini `MockDirective` ile taklit etmelisiniz ve bileşenini içe aktarmalısınız/deklare etmelisiniz.

Örneğin, bileşenin adı `TargetComponent` ve host direktifi `HostDirective` olarak adlandırılmışsa, `TestBed` şöyle tanımlanabilir:

```ts
beforeEach(() =>
  TestBed.configureTestingModule({
    imports: [MockDirective(HostDirective)], // host direktifini taklit etme
    declarations: [TargetComponent], // test edilen bileşeni tanımlama
  }).compileComponents(),
);
```

Kazanç! Arka planda `TargetComponent`, `HostDirective`'ın bir taklidini kullanacak şekilde yeniden tanımlanacaktır.

## Canlı örnek

- [CodeSandbox'da deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockHostDirective/test.spec.ts&initialpath=%3Fspec%3DMockHostDirective)
- [StackBlitz'de deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockHostDirective/test.spec.ts&initialpath=%3Fspec%3DMockHostDirective)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockHostDirective/test.spec.ts"
import {
  Component,
  Directive,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  MockBuilder,
  MockDirective,
  MockRender,
  ngMocks,
} from 'ng-mocks';

@Directive({
  selector: 'host',
  standalone: true,
})
class HostDirective {
  @Input() input?: string;
  @Output() output = new EventEmitter<void>();

  public hostMockHostDirective() {}
}

@Component({
  selector: 'target',
  hostDirectives: [
    {
      directive: HostDirective,
      inputs: ['input'],
      outputs: ['output'],
    },
  ],
  template: 'target',
})
class TargetComponent {
  public targetMockHostDirective() {}
}

describe('MockHostDirective', () => {
  describe('TestBed', () => {
    beforeEach(() =>
      TestBed.configureTestingModule({
        imports: [MockDirective(HostDirective)],
        declarations: [TargetComponent],
      }),
    );

    it('mocks host directives', () => {
      const fixture = TestBed.createComponent(TargetComponent);

      const directive = ngMocks.findInstance(fixture, HostDirective);
      expect(directive).toBeDefined();
    });
  });

  describe('MockBuilder', () => {
    beforeEach(() => MockBuilder(TargetComponent, HostDirective));

    it('mocks host directives', () => {
      MockRender(TargetComponent, { input: 'test' });

      const directive = ngMocks.findInstance(HostDirective);
      expect(directive.input).toEqual('test');
    });
  });

  describe('MockBuilder:shallow', () => {
    beforeEach(() =>
      MockBuilder().mock(TargetComponent, { shallow: true }),
    );

    it('mocks host directives', () => {
      MockRender(TargetComponent, { input: 'test' });

      const directive = ngMocks.findInstance(HostDirective);
      expect(directive.input).toEqual('test');
    });
  });
});