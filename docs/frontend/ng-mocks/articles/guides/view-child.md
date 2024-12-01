---
title: Bir ViewChild / ViewChildren Nasıl Test Edilir
description: ViewChild veya ViewChildren ile alınan çocuk bağımlılıklarının taklit edilmesi. Bu belge, Angular bileşenleri içerisindeki çocuk bileşenlerin test edilmesi için kullanılan yöntemleri açıklamaktadır.
keywords: [Angular, ViewChild, ViewChildren, MockBuilder, Test, Dependency]
sidebar_label: ViewChild / ViewChildren
---

Bir `ViewChild` veya `ViewChildren` test etmek istediğimizde,  
ya da bunlara bağımlı bir mantıkta, bu, bileşenlerden veya direktiflerden türeyen çocuk bağımlılıklarımızın olduğu anlamına gelir.  

:::tip
Test yazarken, gerçek bileşenleri kullanmak yerine taklit nesneleri kullanmak en iyi uygulamalardan biridir.
:::

Bu nedenle, bir testi yazmanın en iyi yolu, testte onların taklit nesnelerini kullanmaktır.

Bir `TargetComponent`'i test etmek istediğimizi varsayalım ve kodu şöyle görünüyor:

```ts title="target.component.ts"
@Component({
  selector: 'target',
  templateUrl: './target.component.html',
})
class TargetComponent {
  @ViewChild(DependencyComponent)
  public component?: DependencyComponent;

  @ViewChild(DependencyComponent, {
    read: DependencyDirective,
  })
  public directive?: DependencyDirective;

  @ViewChildren(DependencyDirective)
  public directives?: QueryList<DependencyDirective>;

  @ViewChild('tpl')
  public tpl?: TemplateRef<HTMLElement>;

  public value = '';
}
```

Ve şablonu şöyle:

```html title="target.component.html"
<dependency
  [dependency]="0"
  (trigger)="value = $event"
></dependency>
<div>
  <span
    [dependency]="1"
    (trigger)="value = $event"
  >1</span>
  <span
    [dependency]="2"
    (trigger)="value = $event"
  >2</span>
  <span
    [dependency]="3"
    (trigger)="value = $event"
  >3</span>
</div>
<ng-template #tpl>
  {{ value }}
</ng-template>
```

Bu durumda, `MockBuilder` kullanabiliriz, `TargetComponent`'i ilk parametre olarak ve modülünü ikinci parametre olarak `MockBuilder`'a geçelim. Sonuç olarak, `DependencyComponent` ve `DependencyDirective` taklitleri ile değiştirilecektir, dolayısıyla sahte yayılımlar kullanabiliriz ve gerektiğinde özel davranışlar sağlayabiliriz.

```ts
// MockBuilder'ın sonucunu döndürmeyi unutmayın
beforeEach(() => MockBuilder(
  TargetComponent,
  TargetModule,
));
```

:::info
MockBuilder kullanarak bağımlılıkları taklit ettiğinizde, testlerinizin bağımlılıklardan etkilenmemesini sağlayabilirsiniz.
:::

Testte, taklit tanımlarına normal sorgular aracılığıyla veya `ngMocks.findInstance` ile erişebiliriz.

Örneğin, eğer çocuk bileşenin yayılımını simüle etmek istesek, bunu şöyle çağırabiliriz:

```ts
ngMocks
  .findInstance(DependencyComponent)
  .trigger
  .emit('component');
```

## Canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestViewChild/test.spec.ts&initialpath=%3Fspec%3DTestViewChild)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestViewChild/test.spec.ts&initialpath=%3Fspec%3DTestViewChild)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestViewChild/test.spec.ts"
import {
  Component,
  Directive,
  EventEmitter,
  Input,
  NgModule,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

@Component({
  selector: 'child',
  template: 'child',
})
class ChildComponent {
  @Input() public child: number | null = null;

  @Output() public readonly trigger = new EventEmitter<string>();
}

@Directive({
  selector: '[child]',
})
class ChildDirective {
  @Input() public child: number | null = null;

  @Output() public readonly trigger = new EventEmitter<string>();
}

@Component({
  selector: 'target',
  template: `
    <child
      [child]="0"
      (trigger)="value = $event"
    ></child>
    <div>
      <span [child]="1" (trigger)="value = $event">1</span>
      <span [child]="2" (trigger)="value = $event">2</span>
      <span [child]="3" (trigger)="value = $event">3</span>
    </div>
    <ng-template #tpl>
      {{ value }}
    </ng-template>
  `,
})
class TargetComponent {
  @ViewChild(ChildComponent)
  public component?: ChildComponent;

  @ViewChild(ChildComponent, {
    read: ChildDirective,
  })
  public directive?: ChildDirective;

  @ViewChildren(ChildDirective)
  public directives?: QueryList<ChildDirective>;

  @ViewChild('tpl')
  public tpl?: TemplateRef<HTMLElement>;

  public value = '';
}

@NgModule({
  declarations: [
    ChildComponent,
    ChildDirective,
    TargetComponent,
  ],
  exports: [TargetComponent],
})
class TargetModule {}

describe('TestViewChild', () => {
  beforeEach(() => MockBuilder(TargetComponent, TargetModule));

  it('mock bağımlılıklarını sağlar', () => {
    const fixture = MockRender(TargetComponent);
    const component = fixture.point.componentInstance;

    // @ViewChild(ChildComponent) kontrolü
    expect(component.component).toEqual(
      jasmine.any(ChildComponent),
    );
    expect(
      component.component && component.component.child,
    ).toEqual(0);

    // read: ChildDirective kontrolü
    expect(component.directive).toEqual(
      jasmine.any(ChildDirective),
    );
    expect(
      component.directive && component.directive.child,
    ).toEqual(0);

    // TemplateRef kontrolü
    expect(component.tpl).toEqual(jasmine.any(TemplateRef));

    // @ViewChildren(ChildDirective)
    if (!component.directives) {
      throw new Error('component.directives eksik');
    }
    expect(component.directives.length).toEqual(4);
    const [dir0, dir1, dir2, dir3] = component.directives.toArray();
    expect(dir0 && dir0.child).toEqual(0);
    expect(dir1 && dir1.child).toEqual(1);
    expect(dir2 && dir2.child).toEqual(2);
    expect(dir3 && dir3.child).toEqual(3);

    // ChildComponent'in çıktılarının doğrulanması
    expect(component.value).toEqual('');
    ngMocks
      .findInstance(ChildComponent)
      .trigger.emit('component');
    expect(component.value).toEqual('component');

    // ChildDirective çıktılarının doğrulanması
    ngMocks
      .findInstances(ChildDirective)[0]
      .trigger.emit('dir0');
    expect(component.value).toEqual('dir0');

    ngMocks
      .findInstances(ChildDirective)[1]
      .trigger.emit('dir1');
    expect(component.value).toEqual('dir1');

    ngMocks
      .findInstances(ChildDirective)[2]
      .trigger.emit('dir2');
    expect(component.value).toEqual('dir2');

    ngMocks
      .findInstances(ChildDirective)[3]
      .trigger.emit('dir3');
    expect(component.value).toEqual('dir3');
  });
});