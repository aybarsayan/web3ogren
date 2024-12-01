---
title: Angular uygulamasında bir HTTP interceptor nasıl test edilir
description: Angular HTTP interceptor'ının test edilmesine dair kapsamlı bir rehber. Bu içerik, interceptor'ların test edilmesi sırasında dikkat edilmesi gereken önemli noktaları ve uygulanan adımları açıklamaktadır.
keywords: [Angular, HTTP Interceptor, Test, HttpClient, HttpTestingController, TestBed]
---

Bir interceptor'ı test etmek için interceptor'ın kendisine ve modülüne ihtiyacımız var. Interceptor `useValue` veya `useFactory` ile tanımlanmışsa, **refaktoring** yapmayı dikkate alın; `useClass` ve `useExisting` desteklenmektedir. 

:::tip
`useValue` ve `useFactory`'nin problemleri, diğer interceptor'ların `TestBed` üzerindeki etkisini önlemek için ayırt edilmesinin zor olmasıdır.
:::

Interceptor, `HTTP_INTERCEPTORS` token'ı ile tanımlandığı için bunu korumamız gerekiyor. Ancak, bu diğer tüm interceptor'ların da korunmasına neden olur; bu yüzden `NG_MOCKS_INTERCEPTORS` token'ını hariç tutarak onlardan kurtulmamız gerekiyor. Buradaki sorun, daha fazla interceptor varsa, bu interceptor'ların sahte kopyalarının "Bir akış beklenirken 'undefined' sağladınız." hatasıyla başarısız olmasıdır. 

:::warning
Son önemli adım, `HttpClientModule`'u `HttpClientTestingModule` ile değiştirmektir, böylece istekleri sahtelemek için `HttpTestingController` kullanabiliriz.
:::

```ts
beforeEach(() =>
  MockBuilder(TargetInterceptor, TargetModule)
    .exclude(NG_MOCKS_INTERCEPTORS)
    .keep(HTTP_INTERCEPTORS)
    .replace(HttpClientModule, HttpClientTestingModule)
);
```

`TargetInterceptor`'ın her isteğe `My-Custom: HttpInterceptor` başlığını eklediğini varsayalım. Bunu test etmek için `HttpClient` aracılığıyla bir istek göndermemiz gerekiyor.

```ts
const client = TestBed.get(HttpClient);

client.get('/target').subscribe();
```

Bir sonraki adım, isteğin beklentisini yazmaktır.

```ts
const req = httpMock.expectOne('/target');

req.flush('');
httpMock.verify();
```

Artık isteğin başlıklarını doğrulayabiliriz.

```ts
expect(req.request.headers.get('My-Custom')).toEqual(
  'HttpInterceptor'
);
```

## Canlı örnekler

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestHttpInterceptor/test.spec.ts&initialpath=%3Fspec%3DTestHttpInterceptor)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestHttpInterceptor/test.spec.ts&initialpath=%3Fspec%3DTestHttpInterceptor)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestHttpInterceptor/test.spec.ts"
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';

import {
  MockBuilder,
  MockRender,
  NG_MOCKS_INTERCEPTORS,
  ngMocks,
} from 'ng-mocks';

// Test etmek istediğimiz bir interceptor.
@Injectable()
class TargetInterceptor implements HttpInterceptor {
  protected value = 'HttpInterceptor';

  public intercept(
    request: HttpRequest<void>,
    next: HttpHandler,
  ): Observable<HttpEvent<void>> {
    return next.handle(
      request.clone({
        setHeaders: {
          'My-Custom': this.value,
        },
      }),
    );
  }
}

// Görmezden gelmek istediğimiz bir interceptor.
@Injectable()
class MockInterceptor implements HttpInterceptor {
  protected value = 'Ignore';

  public intercept(
    request: HttpRequest<void>,
    next: HttpHandler,
  ): Observable<HttpEvent<void>> {
    return next.handle(
      request.clone({
        setHeaders: {
          'My-Mock': this.value,
        },
      }),
    );
  }
}

// Tanımını içeren bir modül.
@NgModule({
  imports: [HttpClientModule],
  providers: [
    TargetInterceptor,
    MockInterceptor,
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useExisting: TargetInterceptor,
    },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: MockInterceptor,
    },
  ],
})
class TargetModule {}

describe('TestHttpInterceptor', () => {
  // Interceptor'ı test etmek istediğimiz için, onu MockBuilder'ın ilk parametresi olarak geçiriyoruz.
  // Bağımlılıklarını doğru bir şekilde yerine getirmek için, modülünü ikinci parametre olarak geçmemiz gerekiyor.
  // Ayrıca, `.mock` içine HTTP_INTERCEPTORS geçirmeli ve
  // HttpClientModule'u HttpClientTestingModule ile değiştirmeliyiz.
  beforeEach(() => {
    return MockBuilder(TargetInterceptor, TargetModule)
      .exclude(NG_MOCKS_INTERCEPTORS)
      .keep(HTTP_INTERCEPTORS)
      .replace(HttpClientModule, HttpClientTestingModule);
  });

  it('interceptor\'ı tetikler', () => {
    MockRender();

    // Test için hizmeti ve http denetleyicisini çıkaralım.
    const client = ngMocks.findInstance(HttpClient);
    const httpMock = ngMocks.findInstance(HttpTestingController);

    // Basit bir istek yapalım.
    client.get('/target').subscribe();

    // Şimdi isteğe bir başlığın eklendiğini doğrulayabiliriz.
    const req = httpMock.expectOne('/target');
    req.flush('');
    httpMock.verify();

    expect(req.request.headers.get('My-Custom')).toEqual(
      'HttpInterceptor',
    );
  });
});