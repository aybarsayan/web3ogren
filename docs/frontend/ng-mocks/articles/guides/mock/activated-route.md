---
title: Angular testlerinde ActivatedRoute'u nasıl mock'lanır 
description: Bu döküman, Angular testlerinde `ActivatedRoute` nesnesinin nasıl mock'lanacağına dair kapsamlı bir rehber sunmaktadır. Ayrıca, bileşenlerdeki parametrelerin nasıl test edileceğine dair örnekler içermektedir.
keywords: [Angular, ActivatedRoute, test, mock, RouterModule, ng-mocks, test örnekleri]
---

`ActivatedRoute`'u mock'lamaktan bahsettiğimizde, test altında bulunan bileşende kullanılan `ActivatedRoute` snapshot'undaki stub parametreleri sağlama çözümünü kastediyoruz.

## activatedRoute.snapshot

Bir `TargetComponent` bileşenine sahip olduğumuzu varsayalım, bu bileşen `ActivatedRoute` snapshot'undaki `paramId`'ye bağlıdır. 

```ts
@Component({
  selector: 'target',
  template: '{{ param }}',
})
class TargetComponent {
  public param: string | null = null;

  public constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.param = this.route.snapshot.paramMap.get('paramId');
  }
}
```

:::info
Testimizde mock `ActivatedRoute` olarak, `paramId` değerine `paramValue` sağlamak istiyoruz. Bunu yapmak için `MockInstance` kullanabiliriz.
:::

İlk adım, birisi `snapshot`'a erişmek istediğinde bir spy çağrısında bulunmaktır, ikinci adım ise stub parametreleri döndürmek:

```ts
it('ActivatedRoute from snapshot ile çalışır', () => {
  // jasmine için
  // ActivatedRoute.snapshot'ın getter'ını mock'lama
  MockInstance(ActivatedRoute, 'snapshot', jasmine.createSpy(), 'get')
    // getter'ın ne döndüğünü özelleştirmek için jasmine.spy.and.returnValue kullanma.
    .and.returnValue({
      paramMap: new Map([['paramId', 'paramValue']]),
    });
  // jest için
  // ActivatedRoute.snapshot'ın getter'ını mock'lama
  MockInstance(ActivatedRoute, 'snapshot', jest.fn(), 'get')
    // getter'ın ne döndüğünü özelleştirmek için jest.fn.mockReturnValue kullanma.
    .mockReturnValue({
      paramMap: new Map([['paramId', 'paramValue']]),
    });

  // testin geri kalanı
  // ...
});
```

> Kâr. Artık birisi `ActivatedRoute`'un `snapshot`'ına eriştiğinde, spy çağrılacak ve istediğimiz parametrelerle stub `paramMap` dönecektir. — 

## activatedRoute.params

Eğer bir bileşen `ActivatedRoute.params`'a bağımlıysa ve bunlar mock'lanması gerekiyorsa, o zaman yaklaşım yukarıdaki `gibi` çok benzer olacaktır:

```ts
it('ActivatedRoute dan params ile çalışır', () => {
  // jasmine için
  // ActivatedRoute.params'ın getter'ını mock'lama
  MockInstance(ActivatedRoute, 'params', jasmine.createSpy(), 'get')
    // getter'ın ne döndüğünü özelleştirmek için jasmine.spy.and.returnValue kullanma.
    .and.returnValue(of({paramId: 'paramValue'}));
  // jest için
  // ActivatedRoute.params'ın getter'ını mock'lama
  MockInstance(ActivatedRoute, 'params', jest.fn(), 'get')
    // getter'ın ne döndüğünü özelleştirmek için jest.fn.mockReturnValue kullanma.
    .mockReturnValue(of({paramId: 'paramValue'}));

  // testin geri kalanı
  // ...
});
```

## RouterModule.forRoot

:::note
`RouterModule.forRoot`'u içeren bir modülü mock'lamak istediğinizde, yalnızca test edilen bileşen tutulmalıdır.
:::

```ts
// TargetModule ve RouterModule.forRoot mock olacak
beforeEach(() => MockBuilder(
  TargetComponent, // tut
  TargetModule, // mock
));
```

## RouterModule.forChild

:::warning
`RouterModule.forChild`'ı içeren bir modülü mock'lamak istediğinizde, `RouterModule.forRoot`'u da mock'lara eklemeniz gerekir. Aksi takdirde, `ActivatedRoute` ve diğer bağımlılıklar mevcut olmayacaktır.
:::

```ts
// TargetModule, RouterModule.forChild ve RouterModule.forRoot mock olacak
beforeEach(() => MockBuilder(
  TargetComponent, // tut
  [TargetModule, RouterModule.forRoot([])], // mock, buraya RouterModule.forRoot([]) ekle
));
```

## ActivatedRoute'u mock'lamak için canlı örnek

- [CodeSandbox üzerinde deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockActivatedRoute/test.spec.ts&initialpath=%3Fspec%3DMockActivatedRoute)
- [StackBlitz üzerinde deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockActivatedRoute/test.spec.ts&initialpath=%3Fspec%3DMockActivatedRoute)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockActivatedRoute/test.spec.ts"
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { MockBuilder, MockInstance, MockRender } from 'ng-mocks';

@Component({
  selector: 'route',
  template: '{{ param }}',
})
class RouteComponent implements OnInit {
  public param: string | null = null;

  public constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.param = this.route.snapshot.paramMap.get('paramId');
  }
}

@NgModule({
  declarations: [RouteComponent],
  imports: [
    RouterModule.forRoot([
      {
        path: 'test/:paramId',
        component: RouteComponent,
      },
    ]),
  ],
})
class TargetModule {}

describe('MockActivatedRoute', () => {
  // Her testten sonra özelleştirmeleri sıfırlar, bizim durumumuzda `ActivatedRoute`.
  MockInstance.scope();

  // RouteComponent'i olduğu gibi tutuyoruz ve TargetModule'deki tüm tanımlamaları mock'lıyoruz.
  beforeEach(() => MockBuilder(RouteComponent, TargetModule));

  it('ActivatedRoute\'dan paramId kullanır', () => {
    // Snapshot'ın parametrelerini ayarlayalım.
    MockInstance(
      ActivatedRoute,
      'snapshot',
      jasmine.createSpy(),
      'get',
    ).and.returnValue({
      paramMap: new Map([['paramId', 'paramValue']]),
    });
    // // jest durumda.
    // MockInstance(
    //   ActivatedRoute,
    //   'snapshot',
    //   jest.fn(),
    //   'get',
    // ).mockReturnValue({
    //   paramMap: new Map([['paramId', 'paramValue']]),
    // });

    // RouteComponent'i render ediyoruz.
    const fixture = MockRender(RouteComponent);

    // Doğru paramId'yi alıp almadığını doğruluyoruz.
    expect(fixture.point.componentInstance.param).toEqual(
      'paramValue',
    );
  });
});