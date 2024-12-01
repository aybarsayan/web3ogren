---
title: Angular uygulamasında bir bağlam ile yapısal direktif nasıl test edilir
description: Bu içerikte, özel bir şablon ile bağlamı kullanarak Angular yapısal direktifinin nasıl test edileceğine dair detaylı bir açıklama yer almaktadır. Mekaniklerin yanı sıra örnekler ile uygulamalı bilgi sunulmaktadır.
keywords: [Angular, yapısal direktif, test, MockRender, ng-mocks, şablon, bağlam]
sidebar_label: Bağlam ile yapısal direktif
---

Eğer `"Yapısal direktifi nasıl test edilir"` adlı yazıyı okumadıysanız, lütfen önce onu okuyun.

:::info 
Bağlam ile birlikte yapısal direktiflerin test edilmesinin farkı, özel şablonumuzda değişkenlerin bulunmasıdır.
:::

```ts
const fixture = MockRender(
  `<div *target="values; let value; let index = myIndex">
    {{index}}: {{ value }}
  </div>`,
  {
    values: ['hello', 'world'],
  }
);
```

Bu direktif `*ngFor` davranışını simüle eder. Render edilen HTML’i kontrol ederek farklı doğrulamalar yapabiliriz ve `values`'ı değiştirdiğimizde direktifin nasıl davrandığını doğrulayabiliriz:

```ts
expect(fixture.nativeElement.innerHTML).toContain('0: hello');
expect(fixture.nativeElement.innerHTML).toContain('1: world');
```

```ts
fixture.componentInstance.values = ['ng-mocks'];
fixture.detectChanges();
expect(fixture.nativeElement.innerHTML).toContain('0: ng-mocks');
expect(fixture.nativeElement.innerHTML).not.toContain('0: hello');
expect(fixture.nativeElement.innerHTML).not.toContain('1: world');
```

## Canlı örnek

- [CodeSandbox'ta dene](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestStructuralDirectiveWithContext/test.spec.ts&initialpath=%3Fspec%3DTestStructuralDirectiveWithContext)
- [StackBlitz'te dene](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestStructuralDirectiveWithContext/test.spec.ts&initialpath=%3Fspec%3DTestStructuralDirectiveWithContext)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestStructuralDirectiveWithContext/test.spec.ts"
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { MockBuilder, MockRender } from 'ng-mocks';

interface ITargetContext {
  $implicit: string;
  myIndex: number;
}

// Bu direktif neredeyse `ngFor` ile aynıdır,
// her öğeyi yeni bir satır olarak render eder.
@Directive({
  selector: '[target]',
})
class TargetDirective {
  public constructor(
    protected templateRef: TemplateRef<ITargetContext>,
    protected viewContainerRef: ViewContainerRef,
  ) {}

  @Input() public set target(items: string[]) {
    this.viewContainerRef.clear();

    for (let index = 0; index < items.length; index += 1) {
      const value = items[index];
      this.viewContainerRef.createEmbeddedView(this.templateRef, {
        $implicit: value,
        myIndex: index,
      });
    }
  }
}

describe('TestStructuralDirectiveWithContext', () => {
  // Direktifi test etmek istediğimiz için, onu MockBuilder'ın ilk
  // parametresi olarak geçiriyoruz. İkinci parametreyi atlayabiliriz,
  // çünkü bağımlılık yok.
  // MockBuilder'ın promise'ını döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(TargetDirective));

  it('geçirilen değerleri render eder', () => {
    const fixture = MockRender(
      `
        <div *target="values; let value; let index = myIndex">
        {{index}}: {{ value }}
        </div>
      `,
      {
        values: ['hello', 'world'],
      },
    );

    // 'değerlerin' beklenildiği gibi render edildiğini doğrulayalım
    expect(fixture.nativeElement.innerHTML).toContain('0: hello');
    expect(fixture.nativeElement.innerHTML).toContain('1: world');

    // 'değerleri' değiştirelim ve yeni renderın
    // her şeyin beklendiği gibi yapıldığını doğrulayalım.
    fixture.componentInstance.values = ['ngMocks'];
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('0: ngMocks');
    expect(fixture.nativeElement.innerHTML).not.toContain('0: hello');
    expect(fixture.nativeElement.innerHTML).not.toContain('1: world');
  });
});
```  