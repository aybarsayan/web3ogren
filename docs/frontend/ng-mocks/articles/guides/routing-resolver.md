---
title: Angular uygulamasında yönlendirme çözümleyicisini test etme
description: Testlerle Angular yönlendirme çözümleyicisini kapsama. Bu içerikte, Angular'da yönlendirme çözümleyicilerinin nasıl test edileceği konusunda adım adım bir rehber bulunmaktadır.
keywords: [Angular, yönlendirme, test, çözümleyici, RouterModule]
sidebar_label: Yönlendirme çözümleyicisi
---

Eğer `"Bir yönlendirmeyi nasıl test edeceğinizi" (route.md)` okumadıysanız, lütfen önce bunu yapın.

:::tip
**Not:** Bir çözümleyiciyi test etmek istediğinizde, yan etkilere neden olmamak için tüm diğer çözümleyicileri ve korumaları kaldırmalısınız.
:::

Bir çözümleyiciyi izole bir şekilde test etmek için tanımlamaları taklit etmeli, `RouterModule` ve bağımlılıklarını koruyarak `Location` ve `ActivatedRoute` üzerinde sonuçları doğrulamalısınız.

## İşlevsel çözümleyiciler

İşlevsel bir çözümleyici, `inject` kullanarak başka hizmetleri alıp, kendi rotası için veri getiren basit bir fonksiyondur. 
Bir işlevsel çözümleyicinin bir hizmet veya token olarak tanımlanmadığını belirtmek önemlidir, bu nedenle yalnızca bir rotanın tanımında var olur.

Varsayalım ki, çözümleyici `dataResolver` olarak adlandırılsın ve onun rotasıyla birlikte `TargetModule` modülü kullanılsın.

Yukarıdaki gibi `TestBed`'i yapılandırmak için kod şu şekilde olabilir:

```ts
beforeEach(() =>
  MockBuilder(
    // birinci parametre
    // RouterModule ve bağımlılıklarını sağlama
    [
      RouterModule,
      RouterTestingModule.withRoutes([]),
      NG_MOCKS_ROOT_PROVIDERS,
    ],
  
    // ikinci parametre
    // TargetModule tanımını taklit etme
    TargetModule,
  )

  // zincir
  // yan etkilere neden olmamak için tüm korumaları hariç tutma
  .exclude(NG_MOCKS_GUARDS)

  // zincir
  // yan etkilere neden olmamak için tüm çözümleyicileri hariç tutma
  .exclude(NG_MOCKS_RESOLVERS)

  // zincir
  // testi yapılacak dataResolver'ı koruma
  .keep(dataResolver)
);
```

:::info
**Önemli Bilgi:** Çözümleyiciyi test etmek için `RouterOutlet`'ı render etmemiz gerekiyor.
:::

```ts
const fixture = MockRender(RouterOutlet, {}); // {} girdi değerlerinin etkilenmemesi için gereklidir.
```

Ayrıca, çözümleyici verileri almak için bunları kullanıyorsa taklit edilmiş hizmetleri de doğru şekilde özelleştirmemiz gerekiyor.

```ts
const dataService = ngMocks.get(DataService);
dataService.data = () => from([false]);
```

Bir sonraki adım, çözümleyicinin bulunduğu rotaya gitmek ve yönlendiricinin başlangıç işlemini tetiklemektir.

```ts
const location = ngMocks.get(Location);
const router = ngMocks.get(Router);

location.go('/target');
if (fixture.ngZone) {
  fixture.ngZone.run(() => router.initialNavigation());
  tick();
}
```

Verinin belirli bir rota için sağlandığı göz önüne alındığında, `fixture` içindeki bileşeni bulmamız ve `ActivatedRoute`'ı onun enjeksiyonundan çıkarmamız gerekir. 
Varsayalım ki `/target` `TargetComponent`'i render ediyor.

```ts
const el = ngMocks.find(fixture, TargetComponent);
const route = ngMocks.get(el, ActivatedRoute);
```

Sonuç, artık çözümleyicinin sağladığı veriyi doğrulayabiliriz.

```ts
expect(route.snapshot.data).toEqual({
  data: {
    flag: false,
  },
});
```

## Sınıf Çözümleyici (eski)

Eğer kodunuz sınıfları ve angular hizmetleri içeren çözümleyiciler barındırıyorsa, bu süreç `işlevsel çözümleyiciler` ile tam olarak aynıdır.

Örneğin, çözümleyicinin sınıfı `DataResolver` olarak adlandırılırsa, `TestBed`'in yapılandırması şu şekilde olmalıdır:

```ts
beforeEach(() =>
  MockBuilder(
    // birinci parametre
    // RouterModule ve bağımlılıklarını sağlama
    [
      RouterModule,
      RouterTestingModule.withRoutes([]),
      NG_MOCKS_ROOT_PROVIDERS,
    ],
  
    // ikinci parametre
    // TargetModule tanımını taklit etme
    TargetModule,
  )

  // zincir
  // yan etkilere neden olmamak için tüm korumaları hariç tutma
  .exclude(NG_MOCKS_GUARDS)

  // zincir
  // yan etkilere neden olmamak için tüm çözümleyicileri hariç tutma
  .exclude(NG_MOCKS_RESOLVERS)

  // zincir
  // testi yapılacak DataResolver'ı koruma
  .keep(DataResolver)
);
```

Sonuç.

## Canlı örnek

- [CodeSandbox üzerinde deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestRoutingResolver/fn.spec.ts&initialpath=%3Fspec%3DTestRoutingResolver%3Afn)
- [StackBlitz üzerinde deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestRoutingResolver/fn.spec.ts&initialpath=%3Fspec%3DTestRoutingResolver%3Afn)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestRoutingResolver/fn.spec.ts"
import { Location } from '@angular/common';
import {
  Component,
  inject,
  Injectable,
  NgModule,
} from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import {
  ActivatedRoute,
  ResolveFn,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { combineLatest, from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  MockBuilder,
  MockRender,
  NG_MOCKS_GUARDS,
  NG_MOCKS_RESOLVERS,
  NG_MOCKS_ROOT_PROVIDERS,
  ngMocks,
} from 'ng-mocks';

// Veri isteğini simüle eden basit bir hizmet.
@Injectable()
class DataService {
  protected flag = true;

  public data(): Observable<boolean> {
    return from([this.flag]);
  }
}

// Test etmek istediğimiz bir çözümleyici.
const dataResolver: ResolveFn<Observable<{ flag: boolean }>> = () =>
  combineLatest([inject(DataService).data()]).pipe(
    map(([flag]) => ({ flag })),
  );

// Yok saymak istediğimiz bir çözümleyici.
const sideEffectResolver: ResolveFn<
  Observable<{ mock: boolean }>
> = () => of({ mock: true });

// Bir sahte bileşen.
// Bir taklit kopyasıyla değiştirilecektir.
@Component({
  selector: 'route',
  template: 'route',
})
class RouteComponent {
  public routeTestRoutingFnResolver() {}
}

// Yönlendirme modülünün tanımı.
@NgModule({
  declarations: [RouteComponent],
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot([
      {
        component: RouteComponent,
        path: 'route',
        resolve: {
          data: dataResolver,
          mock: sideEffectResolver,
        },
      },
    ]),
  ],
  providers: [DataService],
})
class TargetModule {}

describe('TestRoutingResolver:fn', () => {
  // Bir çözümleyiciyi test etmek istediğimizde, bu, onun
  // RouterModule ile olan entegrasyonunu test etmek istediğimiz anlamına gelir.
  // Bu nedenle, RouterModule ve çözümleyici korunmalıdır,
  // ve rotayı tanımlayan modülün geri kalanı taklit edilebilir.
  // Test için RouterModule'u yapılandırmak üzere,
  // RouterModule, RouterTestingModule.withRoutes([]), NG_MOCKS_ROOT_PROVIDERS
  // MockBuilder'ın birinci parametresi olarak belirtilmelidir (evet, boş rotalarla).
  // Rotaya ve çözümleyiciye sahip modül, MockBuilder'ın ikinci parametresi olarak belirtilmelidir.
  // Ardından, `NG_MOCKS_RESOLVERS` hariç tutulmalıdır, böylece tüm çözümleyiciler kaldırılır,
  // ve `dataResolver` korunarak test edilmesi sağlanır.
  beforeEach(() => {
    return MockBuilder(
      [
        RouterModule,
        RouterTestingModule.withRoutes([]),
        NG_MOCKS_ROOT_PROVIDERS,
      ],
      TargetModule,
    )
      .exclude(NG_MOCKS_GUARDS)
      .exclude(NG_MOCKS_RESOLVERS)
      .keep(dataResolver);
  });

  // Yönlendirme testlerini fakeAsync içinde çalıştırmak önemlidir.
  it('rota üzerindeki veriyi sağlar', fakeAsync(() => {
    const fixture = MockRender(RouterOutlet, {});
    const router = ngMocks.get(Router);
    const location = ngMocks.get(Location);
    const dataService = ngMocks.get(DataService);

    // DataService bir taklit kopyasıyla değiştirilmiştir,
    // şimdi daha sonra doğrulayacağımız özel bir değer ayarlayalım.
    dataService.data = () => from([false]);

    // Şimdi çözümleyiciyle birlikte rotaya geçelim.
    location.go('/route');

    // Artık yönlendirmeyi başlatabiliriz.
    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick(); // mevcut rotanın render edilmesi için gereklidir.
    }

    // Doğru sayfada olduğumuzu kontrol edelim.
    expect(location.path()).toEqual('/route');

    // Şu anki bileşenin ActivatedRoute'ını çıkartalım.
    const el = ngMocks.find(RouteComponent);
    const route = ngMocks.findInstance(el, ActivatedRoute);

    // Artık beklenen verilerin mevcut olduğunu doğrulayabiliriz.
    expect(route.snapshot.data).toEqual({
      data: {
        flag: false,
      },
    });
  }));
});