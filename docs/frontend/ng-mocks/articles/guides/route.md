---
title: Angular uygulamasında bir rotayı nasıl test ederiz
description: Angular rotasını testlerle kapsama. Bu kılavuz, Angular'da bir rotanın test edilmesi ile ilgili adımları ve önerileri kapsamaktadır. Rotaların doğru bir şekilde işlediğini doğrulamak için gerekli bileşenleri ve test yöntemlerini açıklamaktadır.
keywords: [Angular, rota testleri, ng-mocks, RouterModule, RouterTestingModule, TestBed, async testing]
---

Bir rotayı test etmek, belirli bir sayfanın belirli bir bileşeni yüklediğini doğrulamak istediğimiz anlamına gelir.

:::tip
`ng-mocks` ile, bir rotanın mevcut olduğundan ve tüm bağımlılıklarının içe aktarılan modülde bulunduğundan emin olabilirsiniz, aksi takdirde testler başarısız olacaktır.
:::

Ancak bunu test etmek için biraz farklı bir şekilde `TestBed`'i yapılandırmamız gerekiyor:

- Tüm bileşenleri ve beyanları taklit etmekte bir sakınca yoktur.
- `RouterModule` mevcut haliyle korunmalı, böylece işini yapabilir.
- Boş rotalarla `RouterTestingModule` eklenmelidir.
- `NG_MOCKS_ROOT_PROVIDERS` korunmalıdır, çünkü `RouterModule`, taklit edilemeyecek birçok kök hizmete bağımlıdır.

Bu, uygulamanın rotalarının kullanılacağını garanti eder ve bir rota veya bağımlılıkları kaldırıldığında testler başarısız olur.

```ts
beforeEach(() =>
  MockBuilder(
    // Korunacak ve dışa aktarılacak öğeler.
    [
      RouterModule,
      RouterTestingModule.withRoutes([]),
      NG_MOCKS_ROOT_PROVIDERS,
    ], 
    // Taklit edilecek öğeler.
    TargetModule,
  )
);
```

Bir sonraki ve çok önemli adım, bir test geri çağırmasını `it` içinde `fakeAsync` fonksiyonu ile sarmak ve `RouterOutlet`'ı render etmektir. Bunu yapmamızın nedeni, `RouterModule`'ün asenkron alanlara dayanmasıdır. Ayrıca, ikinci parametre olarak boş bir nesne belirtmeye dikkat edin; bu, `RouterOutlet`'ın girişlerini değiştirmeden bırakmak için gereklidir.

```ts
// fakeAsync --------------------------|||||||||
it('renders /1 with Target1Component', fakeAsync(() => {
  const fixture = MockRender(RouterOutlet, {});
}));
```

`RouterOutlet`'ı render ettikten sonra rotayı başlatmalıyız, ayrıca burada varsayılan URL'yi ayarlayabiliriz. Yukarıda belirtildiği gibi, bunun için alanları ve `fakeAsync` kullanmalıyız.

```ts
const router = TestBed.get(Router);
const location = TestBed.get(Location);

location.go('/1');
if (fixture.ngZone) {
  fixture.ngZone.run(() => router.initialNavigation());
  tick();
}
```

Artık mevcut rotayı ve neyi render ettiğini doğrulayabiliriz.

```ts
expect(location.path()).toEqual('/1');
expect(() => ngMocks.find(fixture, Target1Component)).not.toThrow();
```

> **Not:** İşte bu kadar.

Ayrıca, bir sayfadaki bir bağlantının doğru rotaya yönlendirildiğini de doğrulayabiliriz. Bu durumda, bağlantıya sahip bileşeni ilk parametre olarak [`MockBuilder`](https://www.npmjs.com/package/ng-mocks#mockbuilder) fonksiyonuna geçmeliyiz ve `RouterOutlet` yerine bu bileşeni render etmeliyiz.

```ts
beforeEach(() =>
  MockBuilder(
    // Korunacak ve dışa aktarılacak öğeler.
    [
      TargetComponent,
      RouterModule,
      RouterTestingModule.withRoutes([]),
      NG_MOCKS_ROOT_PROVIDERS,
    ], 
    // Taklit edilecek öğeler.
    TargetModule,
  )
);
```

```ts
it('navigates between pages', fakeAsync(() => {
  const fixture = MockRender(TargetComponent);
}));
```

Bir sonraki adım, tıklamak istediğimiz bağlantıyı bulmaktır. Tıklama olayı alanların içinde olmalıdır, çünkü gezinmeyi tetikler. Lütfen, `button: 0`'ın olayı ile birlikte gönderilmesi gerektiğini unutmayın; bu, sol fare düğmesini simüle eder.

```ts
const links = ngMocks.findAll(fixture, 'a');
if (fixture.ngZone) {
  fixture.ngZone.run(() => {
    links[0].triggerEventHandler('click', {
      button: 0, // <- sol fare düğmesini simüle ediyor, sağ değil.
    });
  });
  tick();
}
```

Şimdi mevcut durumu doğrulayabiliriz: konum, beklenen rota ile değiştirilmiş olmalı ve fixture, içerik bileşenini barındırmalıdır.

```ts
expect(location.path()).toEqual('/1');
expect(() => ngMocks.find(fixture, Target1Component)).not.toThrow();
```

## Canlı örnek

- [CodeSandbox'da deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestRoute/test.spec.ts&initialpath=%3Fspec%3DTestRoute:Route)
- [StackBlitz'de deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestRoute/test.spec.ts&initialpath=%3Fspec%3DTestRoute:Route)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestRoute/test.spec.ts"
import { Location } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  MockBuilder,
  MockRender,
  NG_MOCKS_ROOT_PROVIDERS,
  ngMocks,
} from 'ng-mocks';

// Mevcut rotayı render eden bir düzen bileşeni.
@Component({
  selector: 'target',
  template: `
    <a routerLink="/1">1</a>
    <a routerLink="/2">2</a>
    <router-outlet></router-outlet>
  `,
})
class TargetComponent {}

// İlk rota için basit bir bileşen.
@Component({
  selector: 'route1',
  template: 'route1',
})
class Route1Component {}

// İkinci rota için basit bir bileşen.
@Component({
  selector: 'route2',
  template: 'route2',
})
class Route2Component {}

// Routing modülünün tanımı.
@NgModule({
  declarations: [Route1Component, Route2Component],
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot([
      {
        component: Route1Component,
        path: '1',
      },
      {
        component: Route2Component,
        path: '2',
      },
    ]),
  ],
})
class TargetRoutingModule {}

// Ana modülün tanımı.
@NgModule({
  declarations: [TargetComponent],
  exports: [TargetComponent],
  imports: [TargetRoutingModule],
})
class TargetModule {}

describe('TestRoute:Route', () => {
  beforeEach(() => {
    return MockBuilder(
      [
        RouterModule,
        RouterTestingModule.withRoutes([]),
        NG_MOCKS_ROOT_PROVIDERS,
      ],
      TargetModule,
    );
  });

  it('renders /1 with Route1Component', fakeAsync(() => {
    const fixture = MockRender(RouterOutlet, {});
    const router: Router = fixture.point.injector.get(Router);
    const location: Location = fixture.point.injector.get(Location);

    // Öncelikle gezinmeyi başlatmamız gerekiyor.
    location.go('/1');
    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick(); // mevcut rotanın render edilmesi için gereklidir.
    }

    // /1 sayfasında Route1Component bileşenini görmeliyiz.
    expect(location.path()).toEqual('/1');
    expect(() => ngMocks.find(Route1Component)).not.toThrow();
  }));

  it('renders /2 with Route2Component', fakeAsync(() => {
    const fixture = MockRender(RouterOutlet, {});
    const router: Router = fixture.point.injector.get(Router);
    const location: Location = fixture.point.injector.get(Location);

    // Öncelikle gezinmeyi başlatmamız gerekiyor.
    location.go('/2');
    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick(); // mevcut rotanın render edilmesi için gereklidir.
    }

    // /2 sayfasında Route2Component bileşenini görmeliyiz.
    expect(location.path()).toEqual('/2');
    expect(() => ngMocks.find(Route2Component)).not.toThrow();
  }));
});

describe('TestRoute:Component', () => {
  // Gezinmeyi test etmek istediğimiz için,
  // bileşeni 'router-outlet' ile test etmek ve
  // RouterModule ile entegrasyonunu test etmek istiyoruz.
  // Bu nedenle, bileşeni MockBuilder'ın ilk parametresi olarak geçiyoruz.
  // Sonra, düzgün bir şekilde başlatılması için, ikinci
  // parametre olarak modülünü geçmemiz gerekiyor.
  // Son olarak, rotalarını korumak için 
  // RouterModule'ü ve test için araçlar sağlamak üzere
  // RouterTestingModule.withRoutes([]) eklemeliyiz.
  beforeEach(() => {
    return MockBuilder(
      [
        TargetComponent,
        RouterModule,
        RouterTestingModule.withRoutes([]),
        NG_MOCKS_ROOT_PROVIDERS,
      ],
      TargetModule,
    );
  });

  it('navigates between pages', fakeAsync(() => {
    const fixture = MockRender(TargetComponent);
    const router: Router = fixture.point.injector.get(Router);
    const location: Location = fixture.point.injector.get(Location);

    // Öncelikle gezinmeyi başlatmamız gerekiyor.
    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick(); // mevcut rotanın render edilmesi için gereklidir.
    }

    // Varsayılan olarak, rotalarımızda bir bileşen yoktur.
    // Bu nedenle, hiçbirinin render edilmemesi gerekir.
    expect(location.path()).toEqual('/');
    expect(() => ngMocks.find(Route1Component)).toThrow();
    expect(() => ngMocks.find(Route2Component)).toThrow();

    // Gezinme bağlantılarını çıkaralım.
    const links = ngMocks.findAll('a');

    // İlk bağlantıya tıkladığımızda nereye gideceğimizi kontrol edelim.
    if (fixture.ngZone) {
      fixture.ngZone.run(() => {
        // Doğru bir tıklama simüle etmek için, yönlendiricinin
        // sol fare düğmesinin kullanıldığını bilmesi gerekir, bu yüzden
        // parametreyi 0 olarak ayarlamamız gerekiyor (tanımlanmamış, null ya da başka bir şey değil).
        links[0].triggerEventHandler('click', {
          button: 0,
        });
      });
      tick(); // mevcut rotanın render edilmesi için gereklidir.
    }
    // /1 sayfasında Route1Component bileşenini görmeliyiz.
    expect(location.path()).toEqual('/1');
    expect(() => ngMocks.find(Route1Component)).not.toThrow();

    // İkinci bağlantıya tıkladığımızda nereye gideceğimizi kontrol edelim.
    if (fixture.ngZone) {
      fixture.ngZone.run(() => {
        // Sol fare düğmesine tıklama.
        links[1].triggerEventHandler('click', {
          button: 0,
        });
      });
      tick(); // mevcut rotanın render edilmesi için gereklidir.
    }
    // /2 sayfasında Route2Component bileşenini görmeliyiz.
    expect(location.path()).toEqual('/2');
    expect(() => ngMocks.find(Route2Component)).not.toThrow();
  }));
});