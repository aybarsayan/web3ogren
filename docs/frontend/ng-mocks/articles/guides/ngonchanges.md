---
title: Angular uygulamasında ngOnChanges yaşam döngüsü kancasını nasıl test edeceksiniz
description: Bu doküman, Angular ngOnChanges yaşam döngüsü kancasının testlerde nasıl kapsandığını detaylandırmaktadır. Test stratejileri ve örneklerle  uygulama geliştirme sürecine yardımcı olur.
keywords: [Angular, ngOnChanges, TestBed, MockRender, TestLifecycleHooks, unit testing, component testing]
---

`TestBed.createComponent`, `ngOnChanges`'i kutudan çıkar çıkmaz desteklemez. 
Bu durumda [`MockRender`](https://www.npmjs.com/package/ng-mocks#mockrender) yardımcı olabilir.

Bunu `TestBed.createComponent` yerine kullanın.

```ts
const fixture = MockRender(TargetComponent, {
  input: '',
});
// Kanca zaten burada çağrıldı.
```

Parametrelerdeki değişiklikler kancayı tetikler.

```ts
fixture.componentInstance.input = 'change';
fixture.detectChanges(); // <- kancayı tekrar tetikler.
// Burada istenen doğrulamaları yapabiliriz.
```

## Canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestLifecycleHooks/test.spec.ts&initialpath=%3Fspec%3DTestHttpRequest)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestLifecycleHooks/test.spec.ts&initialpath=%3Fspec%3DTestHttpRequest)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestLifecycleHooks/test.spec.ts"
import { TestBed } from '@angular/core/testing';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

import {
  TargetComponent,
  TargetModule,
  TargetService,
} from './fixtures';

describe('TestLifecycleHooks', () => {
  ngMocks.faster();

  // MockBuilder'ın sözleşmesini unutmamak için geri dönüş yapmayı unutmayın.
  beforeEach(() => MockBuilder(TargetComponent, TargetModule));

  it('parametreler aracılığıyla mock-render ile yaşam döngüsü kancalarını doğru bir şekilde tetikler', () => {
    // Öncelikle detectChanges'i bastıralım.
    const fixture = MockRender(
      TargetComponent,
      {
        input: '',
      },
      { detectChanges: false },
    );

    const service: TargetService =
      fixture.point.injector.get(TargetService);

    // Varsayılan olarak hiçbir şey başlatılmamıştır, yalnızca ctor.
    expect(service.ctor).toHaveBeenCalledTimes(1); // değiştirildi
    expect(service.onInit).toHaveBeenCalledTimes(0);
    expect(service.onDestroy).toHaveBeenCalledTimes(0);
    expect(service.onChanges).toHaveBeenCalledTimes(0);
    expect(service.afterViewInit).toHaveBeenCalledTimes(0);
    expect(service.afterViewChecked).toHaveBeenCalledTimes(0);
    expect(service.afterContentInit).toHaveBeenCalledTimes(0);
    expect(service.afterContentChecked).toHaveBeenCalledTimes(0);

    // Şimdi bileşeni render edelim.
    fixture.detectChanges();

    // Bu, onDestroy ve onChanges hariç her şeyi çağırır.
    expect(service.ctor).toHaveBeenCalledTimes(1);
    expect(service.onInit).toHaveBeenCalledTimes(1); // değiştirildi
    expect(service.onDestroy).toHaveBeenCalledTimes(0);
    expect(service.onChanges).toHaveBeenCalledTimes(1); // değiştirildi
    expect(service.afterViewInit).toHaveBeenCalledTimes(1); // değiştirildi
    expect(service.afterViewChecked).toHaveBeenCalledTimes(1); // değiştirildi
    expect(service.afterContentInit).toHaveBeenCalledTimes(1); // değiştirildi
    expect(service.afterContentChecked).toHaveBeenCalledTimes(1); // değiştirildi

    // Bunu değiştirelim.
    fixture.componentInstance.input = 'change';
    fixture.detectChanges();

    // Sadece OnChange, AfterViewChecked, AfterContentChecked
    // tetiklenmelidir.
    expect(service.ctor).toHaveBeenCalledTimes(1);
    expect(service.onInit).toHaveBeenCalledTimes(1);
    expect(service.onDestroy).toHaveBeenCalledTimes(0);
    expect(service.onChanges).toHaveBeenCalledTimes(2); // değiştirildi
    expect(service.afterViewInit).toHaveBeenCalledTimes(1);
    expect(service.afterViewChecked).toHaveBeenCalledTimes(2); // değiştirildi
    expect(service.afterContentInit).toHaveBeenCalledTimes(1);
    expect(service.afterContentChecked).toHaveBeenCalledTimes(2); // değiştirildi

    // Daha fazla değişiklik neden olalım.
    fixture.detectChanges();
    fixture.detectChanges();

    // Sadece AfterViewChecked, AfterContentChecked tetiklenmelidir.
    expect(service.ctor).toHaveBeenCalledTimes(1);
    expect(service.onInit).toHaveBeenCalledTimes(1);
    expect(service.onDestroy).toHaveBeenCalledTimes(0);
    expect(service.onChanges).toHaveBeenCalledTimes(2);
    expect(service.afterViewInit).toHaveBeenCalledTimes(1);
    expect(service.afterViewChecked).toHaveBeenCalledTimes(4); // değiştirildi
    expect(service.afterContentInit).toHaveBeenCalledTimes(1);
    expect(service.afterContentChecked).toHaveBeenCalledTimes(4); // değiştirildi

    // Bunu yok edelim.
    fixture.destroy();

    // Bu, onDestroy ve onChanges hariç her şeyi çağırır.
    expect(service.ctor).toHaveBeenCalledTimes(1);
    expect(service.onInit).toHaveBeenCalledTimes(1);
    expect(service.onDestroy).toHaveBeenCalledTimes(1); // değiştirildi
    expect(service.onChanges).toHaveBeenCalledTimes(2);
    expect(service.afterViewInit).toHaveBeenCalledTimes(1);
    expect(service.afterViewChecked).toHaveBeenCalledTimes(4);
    expect(service.afterContentInit).toHaveBeenCalledTimes(1);
    expect(service.afterContentChecked).toHaveBeenCalledTimes(4);
  });

  it('TestBed.createComponent aracılığıyla onChanges’i doğru şekilde tetiklemez', () => {
    const fixture = TestBed.createComponent(TargetComponent);
    fixture.componentInstance.input = '';

    const service: TargetService =
      fixture.debugElement.injector.get(TargetService);

    // Varsayılan olarak, hiçbir şey başlatılmamış olmalıdır.
    expect(service.onChanges).toHaveBeenCalledTimes(0);

    // Şimdi bileşeni render edelim.
    fixture.detectChanges();

    // Kanca çağrılmış olmalıdır, ancak TestBed.createComponent aracılığıyla değil.
    expect(service.onChanges).toHaveBeenCalledTimes(0); // başarısız

    // Şimdi değiştirelim.
    fixture.componentInstance.input = 'change';
    fixture.changeDetectorRef.detectChanges();

    // Kanca çağrılmış olmalıdır, ancak TestBed.createComponent aracılığıyla değil.
    expect(service.onChanges).toHaveBeenCalledTimes(0); // başarısız
  });
});