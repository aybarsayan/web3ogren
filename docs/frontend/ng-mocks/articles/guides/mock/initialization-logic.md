---
title: Başlatma Mantığının Bağımlılıklarını Nasıl Mocklamak
description: Bu makale, Angular'da başlatma mantığının bağımlılıklarını mocklamak için yöntemler sunmaktadır. Özellikle, `Service` ve `InjectionToken`'leri nasıl mocklayabileceğinizi ve `ng-mocks` kütüphanesinin bu süreçte nasıl yardımcı olabileceğini ele alacaktır.
keywords: [Angular, mock, bağımlılık, Testing, ng-mocks, TestBed, mocklama]
---

Bu makale **başlatma mantığının bağımlılıklarını nasıl mocklayacağınızı** açıklamaktadır. Temelde, **bir `Service` nasıl mocklanır** ve/veya **bir `InjectionToken` nasıl mocklanır** gibi, bunlar bir yapıcıda bağımlılıklar olarak enjeksiyon yapılır. Ayrıca, bu makale mock'ları değiştirerek başlatma mantığı için farklı değerler sağlama yöntemini ele almaktadır.

Bir bağımlılığa sahip bir deklarasyonumuz olduğunu hayal edelim. Genellikle, deklarasyon bir bileşen, direktif, boru, hizmet veya hatta bir modüldür ve bağımlılıkları hizmetler, token'lar veya daha karmaşık mantık bileşenler ve direktiflerdir; bunlar aynı anahtar elementte bulunur.

```ts title="Yapıcıda bağımlılıkların değerlerine dayalı olarak bir özelliğin nasıl hesaplandığına dair bir örnek."
class TargetComponent {
  // Başka bir yerde kullanılacak bir özellik: bir şablonda veya başka bir yerde.
  public name: string;
  
  // Gerekli bağımlılıklar.
  constructor(
    @Inject(CONFIG) config: ConfigInterface,
    user: CurrentUserService,
  ) {

    // Adı hesaplamak için yapıcıdaki iş mantığı.
    if (config.displayName === 'first') {
      this.name = user.firstName;
    } else {
      this.name = user.lastName;
    }
  }
}
```

Sanırım burada bir sorun fark ettiniz. Doğru, **bağımlılıkları mocklamak ve özelleştirmek için çok fazla boilerplate gerekebilir**, çünkü bunlar yapıcıda kullanılır.

:::info Angular deklarasyonlarında başlatma mantığını test etmenin başlıca dezavantajları ve acıkları:

- Her kullanım durumu için hafif farklılıklar olan birçok ek, çoğunlukla kopyala-yapıştır `TestBed.configureTestingModule`
- Değerleri ayarlamak için ek `beforeEach` bloğu ile `TestBed.inject`
- `TestBed.inject` host bağımlılıklarıyla çalışmaz
- `TestBed.inject` ilkel değerleri değiştirmeye izin vermez
:::

Bunu keyifli hale getirmek için, `ng-mocks` her `it` öncesinde `MockInstance` yerleştirmenizi sağlar, bu `MockRender`](../../api/MockRender.md) veya `TestBed.createComponent` kullanarak değerleri ayarlamanızı sağlar ve **tüm mock bağımlılıklarının özelleştirilmesini destekler**: `InjectionToken`, `Service` veya `Component`, `Directive` gibi host bağımlılıkları.

```ts
// Varsayılan özelleştirmeleri kullanamıyorsanız gereklidir.
// https://ng-mocks.sudo.eu/extra/install#default-customizations
// Her testten sonra MockInstance tarafından yapılan özelleştirmeleri kaldırır.
MockInstance.scope();

beforeEach(() => {
  // TargetComponent'in bağımlılıkları için mock'lar.
  return TestBed.configureTestingModule({
    declarations: [TargetComponent],
    providers: [
      MockProvider(CONFIG),
      MockProvider(CurrentUserService, {
        firstName: 'firstName',
        lastName: 'lastName',
      }),
    ],
  }).compileComponents();
});

it('ilk adı kapsar', () => {
  // Kullanım durumu için özelleştirme.
  MockInstance(
    CONFIG,
    (): ConfigInterface => ({
      displayName: 'first',
    }),
  );

  const fixture = TestBed.createComponent(TargetComponent);
  fixture.detectChanges();

  expect(fixture.componentInstance.name).toEqual('firstName');
});

it('son adı kapsar', () => {
  // Kullanım durumu için özelleştirme.
  MockInstance(
    CONFIG,
    (): ConfigInterface => ({
      displayName: 'last',
    }),
  );

  const fixture = TestBed.createComponent(TargetComponent);
  fixture.detectChanges();

  expect(fixture.componentInstance.name).toEqual('lastName');
});
```

:::warning Özelleştirmeleri sıfırlama
Lütfen testlerinizden önce `MockInstance.scope();` eklediğinizden emin olun. 
Bu, testlerden sonra `MockInstance`'ın özelleştirmelerini sıfırlar.
:::

Kazanç, **`MockInstance` yardımıyla, Angular testinde herhangi bir mock deklarasyonunu özelleştirebilirsiniz**,
öyle ki, ister `InjectionToken`, `Service` veya hatta host `Component` veya `Directive` olsun.

---

## Optimize edilmiş versiyon

Yukarıdaki örnekteki kod miktarını azaltmak istiyorsanız, `MockBuilder` ve `MockRender` kullanmalısınız.

```ts
MockInstance.scope();

beforeEach(() =>
  MockBuilder(TargetComponent, ItsModule).mock(
    CurrentUserService,
    {
      firstName: 'firstName',
      lastName: 'lastName',
    },
  ),
);

it('ilk adı kapsar', () => {
  // Kullanım durumu için özelleştirme.
  MockInstance(
    CONFIG,
    (): ConfigInterface => ({
      displayName: 'first',
    }),
  );

  const fixture = MockRender(TargetComponent);
  expect(fixture.point.componentInstance.name).toEqual(
    'firstName',
  );
});

it('son adı kapsar', () => {
  // Kullanım durumu için özelleştirme.
  MockInstance(
    CONFIG,
    (): ConfigInterface => ({
      displayName: 'last',
    }),
  );

  const fixture = MockRender(TargetComponent);
  expect(fixture.point.componentInstance.name).toEqual(
    'lastName',
  );
});
```

:::warning Noktayı kullanma
`MockRender`, bileşeni `fixture.point.componentInstance` altında sağlar.
:::

---

## Canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockInitializationLogic/test.spec.ts&initialpath=%3Fspec%3DMockInitializationLogic)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockInitializationLogic/test.spec.ts&initialpath=%3Fspec%3DMockInitializationLogic)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockInitializationLogic/test.spec.ts"
import {
  Component,
  Inject,
  Injectable,
  InjectionToken,
  NgModule,
} from '@angular/core';
import {
  MockBuilder,
  MockInstance,
  MockProvider,
  MockRender,
} from 'ng-mocks';
import { TestBed } from '@angular/core/testing';

interface ConfigInterface {
  displayName: 'first' | 'last';
}

const CONFIG = new InjectionToken<ConfigInterface>('CONFIG');

@Injectable()
class CurrentUserService {
  firstName?: string;
  lastName?: string;
}

@Component({
  selector: 'target',
  template: '{{ name }}',
})
class TargetComponent {
  // Başka bir yerde kullanılacak bir özellik: bir şablonda veya başka bir yerde.
  public name?: string;

  // Gerekli bağımlılıklar.
  constructor(
    @Inject(CONFIG) config: ConfigInterface,
    user: CurrentUserService,
  ) {
    // Adı hesaplamak için yapıcıdaki iş mantığı.
    if (config.displayName === 'first') {
      this.name = user.firstName;
    } else {
      this.name = user.lastName;
    }
  }

  TargetComponentMockInitializationLogic() {}
}

@NgModule({
  declarations: [TargetComponent],
  providers: [
    {
      provide: CONFIG,
      useValue: {
        displayName: 'first',
      },
    },
    CurrentUserService,
  ],
})
class ItsModule {}

describe('MockInitializationLogic', () => {
  describe('TestBed', () => {
    // Varsayılan özelleştirmeleri kullanamıyorsanız gereklidir.
    // https://ng-mocks.sudo.eu/extra/install#default-customizations
    // Her testten sonra MockInstance tarafından yapılan özelleştirmeleri kaldırır.
    MockInstance.scope();

    beforeEach(() => {
      // TargetComponent'in bağımlılıkları için mock'lar.
      return TestBed.configureTestingModule({
        declarations: [TargetComponent],
        providers: [
          MockProvider(CONFIG),
          MockProvider(CurrentUserService, {
            firstName: 'firstName',
            lastName: 'lastName',
          }),
        ],
      }).compileComponents();
    });

    it('ilk adı kapsar', () => {
      // Kullanım durumu için özelleştirme.
      MockInstance(
        CONFIG,
        (): ConfigInterface => ({
          displayName: 'first',
        }),
      );

      const fixture = TestBed.createComponent(TargetComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance.name).toEqual('firstName');
    });

    it('son adı kapsar', () => {
      // Kullanım durumu için özelleştirme.
      MockInstance(
        CONFIG,
        (): ConfigInterface => ({
          displayName: 'last',
        }),
      );

      const fixture = TestBed.createComponent(TargetComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance.name).toEqual('lastName');
    });
  });

  describe('MockBuilder', () => {
    MockInstance.scope();

    beforeEach(() =>
      MockBuilder(TargetComponent, ItsModule).mock(
        CurrentUserService,
        {
          firstName: 'firstName',
          lastName: 'lastName',
        },
      ),
    );

    it('ilk adı kapsar', () => {
      // Kullanım durumu için özelleştirme.
      MockInstance(
        CONFIG,
        (): ConfigInterface => ({
          displayName: 'first',
        }),
      );

      const fixture = MockRender(TargetComponent);
      expect(fixture.point.componentInstance.name).toEqual(
        'firstName',
      );
    });

    it('son adı kapsar', () => {
      // Kullanım durumu için özelleştirme.
      MockInstance(
        CONFIG,
        (): ConfigInterface => ({
          displayName: 'last',
        }),
      );

      const fixture = MockRender(TargetComponent);
      expect(fixture.point.componentInstance.name).toEqual(
        'lastName',
      );
    });
  });
});