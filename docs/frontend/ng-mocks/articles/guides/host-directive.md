---
title: Angular uygulamasında bir host direktifini nasıl test edersiniz
description: Bu belge, Angular host direktiflerinin testini kapsamaktadır. Örneklerle, testin nasıl gerçekleştirileceği ve dikkat edilmesi gereken noktalar açıklanmaktadır.
keywords: [Angular, host direktifi, test, MockBuilder, ngMocks]
---

Bir `name` özniteliğini ekleyen bir host direktifine sahip bir bileşenimiz olduğunu varsayalım.

Direktifin kodu:

```ts
@Directive({
  selector: 'host',
  standalone: true,
})
class HostDirective {
  @HostBinding('attr.name') @Input() input?: string;
}
```

Bileşenin kodu:

```ts
@Component({
  selector: 'target',
  hostDirectives: [
    {
      directive: HostDirective,
      inputs: ['input'],
    },
  ],
  template: 'target',
})
class TargetComponent {
  // göz ardı etmek istediğimiz çok fazla mantık
}
```

Bileşen ağır olabilir ve ideal bir testte, bileşenin mantığı göz ardı edilmelidir, böylece odak direktifin kendisinde ve nasıl davrandığına kalır.

:::tip
Testlerin daha verimli olması için bileşen mantığını devre dışı bırakmaya çalışın.
:::

`MockBuilder` bileşeni nasıl taklit edeceğini ve bir veya bazı host direktiflerini olduğu gibi nasıl koruyacağını bilir.

Bunu yapmak için, host direktifi korunmalı ve ilgili bileşen taklit edilmelidir:

```ts
beforeEach(() => MockBuilder(HostDirective, TargetComponent));
```

Profit!

Bir testi erişmek için, `ngMocks.findInstnace` kullanılabilir.

```ts
it('keeps host directives', () => {
  const fixture = MockRender(TargetComponent, { input: 'test' });

  const directive = ngMocks.findInstance(HostDirective);
  expect(directive.input).toEqual('test');
  expect(ngMocks.formatHtml(fixture)).toContain(' name="test"');
});
```

## Canlı örnek

- [CodeSandbox'da deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestHostDirective/test.spec.ts&initialpath=%3Fspec%3DTestHostDirective)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestHostDirective/test.spec.ts&initialpath=%3Fspec%3DTestHostDirective)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestHostDirective/test.spec.ts"
import {
  Component,
  Directive,
  HostBinding,
  Input,
} from '@angular/core';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

@Directive({
  selector: 'host',
  standalone: true,
})
class HostDirective {
  @HostBinding('attr.name') @Input() input?: string;

  public hostTestHostDirective() {}
}

@Component({
  selector: 'target',
  hostDirectives: [
    {
      directive: HostDirective,
      inputs: ['input'],
    },
  ],
  template: 'target',
})
class TargetComponent {
  public targetTestHostDirective() {}
}

describe('TestHostDirective', () => {
  beforeEach(() => MockBuilder(HostDirective, TargetComponent));

  it('keeps host directives', () => {
    const fixture = MockRender(TargetComponent, { input: 'test' });

    const directive = ngMocks.findInstance(HostDirective);
    expect(directive.input).toEqual('test');
    expect(ngMocks.formatHtml(fixture)).toContain(' name="test"');
  });
});
```