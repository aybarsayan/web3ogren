---
title: Angular uygulamasında bir pipe'ı test etme
description: Bu belge, Angular içinde bir pipe'nin nasıl test edileceğini kapsamlı bir şekilde ele alır. Pipe'ların test edilmesine yönelik yaklaşımlar ve örnek test senaryoları sunulmaktadır.
keywords: [Angular, pipe, test, MockBuilder, ng-mocks]
---

Pipe'ları test etme yaklaşımı, direktiflere benzer. Pipe'ı [`MockBuilder`](https://www.npmjs.com/package/ng-mocks#mockbuilder) metodunun **ilk** parametresi olarak geçiriyoruz ve varsa bağımlılıklarıyla birlikte modülünü **ikinci** parametre olarak gönderiyoruz:

```ts
beforeEach(() => MockBuilder(TargetPipe));
```

:::tip
**İpucu:** Pipe'ın nasıl davrandığını doğrulamak için özel bir şablon render etmemiz gerekiyor.
:::

```ts
const fixture = MockRender(TargetPipe, {
  $implicit: ['1', '3', '2'],
});
```

Artık neyin render edildiğini doğrulayabiliriz:

```ts
expect(fixture.nativeElement.innerHTML).toEqual('1, 2, 3');
```

## Canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestPipe/test.spec.ts&initialpath=%3Fspec%3DTestPipe)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestPipe/test.spec.ts&initialpath=%3Fspec%3DTestPipe)

:::info
**Ekstra Bilgi:** Aşağıdaki örnek, pipe test etme sürecini daha iyi anlamanızı sağlayacaktır.
:::

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestPipe/test.spec.ts"
import { Pipe, PipeTransform } from '@angular/core';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

// Bir dizi string kabul eden, bunları sıralayan
// ve değerlerin birleştirilmiş stringini döndüren basit bir pipe.
@Pipe({
  name: 'target',
})
class TargetPipe implements PipeTransform {
  public transform(value: string[], asc = true): string {
    let result = [...(value || [])].sort();
    if (!asc) {
      result = result.reverse();
    }

    return result.join(', ');
  }
}

describe('TestPipe', () => {
  ngMocks.faster(); // birden fazla test için aynı TestBed.

  // Pipe'ı test etmek istediğimiz için, MockBuilder'ın ilk
  // parametresi olarak geçiyoruz. İkinci parametreyi atlayabiliriz,
  // çünkü bağımlılık yok.
  // MockBuilder'ın promise'ini döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(TargetPipe));

  it('stringleri sıralar', () => {
    const fixture = MockRender(TargetPipe, {
      $implicit: ['1', '3', '2'],
    });

    expect(fixture.nativeElement.innerHTML).toEqual('1, 2, 3');
  });

  it('parametreye göre stringleri ters çevirir', () => {
    const fixture = MockRender('{{ values | target:flag }}', {
      flag: false,
      values: ['1', '3', '2'],
    });

    expect(fixture.nativeElement.innerHTML).toEqual('3, 2, 1');
  });
});
```