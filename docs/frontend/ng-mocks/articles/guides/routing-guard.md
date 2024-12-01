---
title: Angular uygulamasında bir yönlendirme koruyucusunu nasıl test edilir
description: Bu belge, bir Angular yönlendirme koruyucusunun nasıl test edileceğini ve test sürecinde dikkate alınması gereken önemli noktaları özetler. Adım adım bir kılavuz sunarak, geliştiricilerin koruyucuları etkili bir biçimde test etmelerine yardımcı olur.
keywords: [Angular, yönlendirme koruyucusu, test, ng-mocks, RouterModule, yazılım testi, component testing]
---

Eğer `"Bir yön dizesinin nasıl test edileceğini"` okumadıysanız, lütfen önce bunu yapın.

:::info
Bir koruyucuyu test etmek, koruyucu ve `RouterModule` haricindeki her şeyi sahte bir şekilde simüle etmemiz gerektiği anlamına gelir.
:::

Ama, ya birden fazla koruyucumuz varsa? Eğer onları sahteleyip mock yaparsak, yanlış dönen mock metodları nedeniyle yolları engellerler.  
**Angular testlerinde koruyucuları kaldırmak için `ng-mocks` `NG_MOCKS_GUARDS` token'ını sağlar**, bunu `.exclude` içerisine geçmeliyiz, ardından diğer tüm koruyucular `TestBed`'den dışlanacak ve **sadece istediğimiz koruyucuyu test ettiğimizden emin olabileceğiz**.

Aşağıdaki örnek tüm koruyucu türleri için geçerlidir:

- `canActivate` -
  [CodeSandbox](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestRoutingGuard/can-activate.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3AcanActivate),
  [StackBlitz](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestRoutingGuard/can-activate.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3AcanActivate)
- `canActivateChild` -
  [CodeSandbox](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestRoutingGuard/can-activateChild.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3AcanActivateChild),
  [StackBlitz](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestRoutingGuard/can-activateChild.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3AcanActivateChild)
- `canDeactivate` -
  [CodeSandbox](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestRoutingGuard/can-deactivate.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3AcanDeactivate),
  [StackBlitz](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestRoutingGuard/can-deactivate.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3AcanDeactivate)
- `canMatch` -
  [CodeSandbox](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestRoutingGuard/can-match.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3AcanMatch),
  [StackBlitz](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestRoutingGuard/can-match.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3AcanMatch)
- `canLoad` -
  [CodeSandbox](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestRoutingGuard/can-load.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3AcanLoad),
  [StackBlitz](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestRoutingGuard/can-load.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3AcanLoad)
- sınıf koruyucuları (eski) -
  [CodeSandbox](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestRoutingGuard/test.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3Atest),
  [StackBlitz](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestRoutingGuard/test.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3Atest)

---

## Fonksiyonel Koruyucular

Fonksiyonel bir koruyucu, basit bir fonksiyondur ve Angular 14 öncesinde olduğu gibi bir servis veya token değildir.  
Bir koruyucu, `RouterModule.forRoot` veya `RouterModule.forChild` şeklinde bir modülde tanımlanan yolların yapılandırmasında yer alır.

:::tip
Bir koruyucu test etmek için, koruyucuyu ve koruyucunun tanımlandığı bir modülü sağlamanız gerekmektedir. Kolaylık olması açısından koruyucuyu `loginGuard` ve modülü `TargetModule` olarak adlandıralım.
:::

Koruyucu, diğer koruyucuların yan etkilerinden kaçınmak için izole bir şekilde test edilmelidir.  
Ayrıca, `RouterModule` ve onun bağımlılıkları, koruyucunun yoluna doğru bir şekilde bağlandığından emin olmak için bir testte sağlanmalıdır ve `Location` ve/veya `Router` üzerinde doğrulama yapabilirsiniz.  
Geri kalan kısmı sahtelemeler olabilir.

```ts
beforeEach(() =>
  MockBuilder(
    // ilk parametre
    // RouterModule ve bağımlılıklarını sağlamak
    [
      RouterModule,
      RouterTestingModule.withRoutes([]),
      NG_MOCKS_ROOT_PROVIDERS,
    ],
    
    // ikinci parametre
    // TargetModule'in sahte tanımı
    TargetModule,
  )
  
  // zincir
  // yan etkileri önlemek için tüm koruyucuları hariç tutuyoruz
  .exclude(NG_MOCKS_GUARDS)
  
  // zincir
  // test için loginGuard'ı koruyoruz
  .keep(loginGuard)
);
```

Koruyucunun, kullanıcı giriş yapmadığı takdirde tüm yolları `/login` adresine yönlendirdiğini varsayalım.  
Yani uygulama başlatıldığında yönlendirme `/login`'da bitmelidir.

Bunu doğrulayalım:

1. bir yönlendirme çıkışı render et
2. yönlendirmeyi başlat
3. konumu doğrula

Bir yönlendirme çıkışı render etmek için `MockRender`'ı boş parametrelerle kullanabilirsiniz.

```ts
const fixture = MockRender(RouterOutlet, {});
```

Artık `Router` ve `Location`'ı alabilirsiniz.  
İlki, başlatma için gerekir, ikincisi ise doğrulama için.

```ts
const router = ngMocks.get(Router);
const location = ngMocks.get(Location);
```

Yönlendirmeyi başlatmak için `router.initialNavigation` çağrısını yapmanız ve ardından `tick` ile yolun başlatıldığından ve render edildiğinden emin olmanız gerekir. 

```ts
if (fixture.ngZone) {
  fixture.ngZone.run(() => router.initialNavigation());
  tick(); // mevcut yolun render edilmesi için gereklidir.
}
```

Artık konumu doğrulayabilirsiniz.

```ts
expect(location.path()).toEqual('/login');
```

:::warning
Kar, `fonksiyonel bir koruyucu için bir test örneği` olacaktır.
:::

## Sınıf Koruyucular (eski)

Kodunuzda sınıf olan ve Angular servisleri ile koruyucular varsa, süreç tam olarak `fonksiyonel koruyucular` ile aynı olacaktır.

Örneğin, koruyucunun sınıfı `LoginGuard` olarak adlandırılmışsa, `TestBed`'in yapılandırması şu şekilde olmalıdır:

```ts
beforeEach(() =>
  MockBuilder(
    // ilk parametre
    // RouterModule ve bağımlılıklarını sağlamak
    [
      RouterModule,
      RouterTestingModule.withRoutes([]),
      NG_MOCKS_ROOT_PROVIDERS,
    ],
    
    // ikinci parametre
    // TargetModule'in sahte tanımı
    TargetModule,
  )
  
  // zincir
  // yan etkileri önlemek için tüm koruyucuları hariç tutuyoruz
  .exclude(NG_MOCKS_GUARDS)
  
  // zincir
  // test için LoginGuard'ı koruyoruz
  .keep(LoginGuard)
);
```

Kar.

## Canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestRoutingGuard/can-activate.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3AcanActivate)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestRoutingGuard/can-activate.spec.ts&initialpath=%3Fspec%3DTestRoutingGuard%3AcanActivate)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestRoutingGuard/can-activate.spec.ts"
import { Location } from '@angular/common';
import {
  Component,
  inject,
  Injectable,
  NgModule,
} from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { from } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import {
  MockBuilder,
  MockRender,
  NG_MOCKS_GUARDS,
  NG_MOCKS_ROOT_PROVIDERS,
  ngMocks,
} from 'ng-mocks';

// Giriş kontrolünü simüle eden basit bir servis.
// Bu, mock kopyasıyla değiştirilecektir.
@Injectable()
class LoginService {
  public isLoggedIn = false;
}

// Test etmek istediğimiz koruyucu.
const canActivateGuard: CanActivateFn = (route, state) => {
  if (route && state && inject(LoginService).isLoggedIn) {
    return true;
  }

  return from(inject(Router).navigate(['/login'])).pipe(mapTo(false));
};

// Gerçek bir dünya örneği gibi başka bir koruyucu.
// Koruyucu, yol üzerinde yan etkilere neden olmamak için testten çıkarılmalıdır.
const sideEffectGuard: CanActivateFn = () => false;

// Giriş formu gibi davranan basit bir bileşen.
// Bu, mock kopyasıyla değiştirilecektir.
@Component({
  selector: 'login',
  template: 'login',
})
class LoginComponent {
  public loginTestRoutingGuardCanActivate() {}
}

// Korunmalı bir gösterge panosuna benzer basit bir bileşen.
// Bu, mock kopyasıyla değiştirilecektir.
@Component({
  selector: 'dashboard',
  template: 'dashboard',
})
class DashboardComponent {
  public dashboardTestRoutingGuardCanActivate() {}
}

// Yönlendirme modülünün tanımı.
@NgModule({
  declarations: [LoginComponent, DashboardComponent],
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot([
      {
        component: LoginComponent,
        path: 'login',
      },
      {
        canActivate: [canActivateGuard, sideEffectGuard],
        component: DashboardComponent,
        path: '**',
      },
    ]),
  ],
  providers: [LoginService],
})
class TargetModule {}

describe('TestRoutingGuard:canActivate', () => {
  // Bir canActive koruyucusunu test etmek istediğimiz için, bu
  // RouterModule ile entegrasyonunu test etmek istediğimiz anlamına gelir.
  // Bu nedenle, RouterModule ve koruyucu tutulmalı,
  // ve yolu tanımlayan modülün geri kalanı sahtelemelidir.
  // Test için RouterModule'u yapılandırmak üzere,
  // RouterModule, RouterTestingModule.withRoutes([]), NG_MOCKS_ROOT_PROVIDERS
  // MockBuilder'ın ilk parametresi olarak belirtilmelidir (evet, boş yollarla).
  // Yollar ve koruyucu olan modül, MockBuilder'ın
  // ikinci parametresi olarak belirtilmelidir.
  // Ardından, tüm koruyucuları kaldırmak için `NG_MOCKS_GUARDS` hariç tutulmalı
  // ve `canActivateGuard` test edebilmeniz için tutulmalıdır.
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
      .keep(canActivateGuard);
  });

  // Yönlendirme testlerini fakeAsync içinde çalıştırmak önemlidir.
  it('girişe yönlendirir', fakeAsync(() => {
    const fixture = MockRender(RouterOutlet, {});
    const router = ngMocks.get(Router);
    const location = ngMocks.get(Location);

    // Önce yönlendirmeyi başlatmamız gerekiyor.
    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick(); // mevcut yolun render edilmesi için gereklidir.
    }

    // Çünkü varsayılan olarak giriş yapmadığımız için, koruyucu
    // bizi /login sayfasına yönlendirmelidir.
    expect(location.path()).toEqual('/login');
    expect(() => ngMocks.find(LoginComponent)).not.toThrow();
  }));

  it('gösterge panosunu yükler', fakeAsync(() => {
    const fixture = MockRender(RouterOutlet, {});
    const router = ngMocks.get(Router);
    const location = ngMocks.get(Location);
    const loginService = ngMocks.get(LoginService);

    // Koruyucuya giriş yaptığımızı bildirmek.
    loginService.isLoggedIn = true;

    // Önce yönlendirmeyi başlatmamız gerekiyor.
    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick(); // mevcut yolun render edilmesi için gereklidir.
    }

    // Artık giriş yaptığımız için, koruyucu bizi
    // gösterge panosuna yönlendirmelidir.
    expect(location.path()).toEqual('/');
    expect(() => ngMocks.find(DashboardComponent)).not.toThrow();
  }));
});