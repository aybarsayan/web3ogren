---
title: Angular uygulamasında HTTP isteğini nasıl test edilir
description: Angular http isteğini testler ile kapsama. Bu makalede, Angular uygulamalarında HTTP isteklerinin nasıl test edileceği adım adım açıklanmaktadır. HttpClientTestingModule kullanılarak test senaryoları geliştirme yöntemleri hakkında önemli bilgiler bulabilirsiniz.
keywords: [Angular, HTTP, test, HttpClientTestingModule, unit testing, observable, services]
---

Bir http isteğini test etmek, bir servisi veya onu gönderen bir beyanı kapsamamız gerektiği anlamına gelir. Bunun için olması gereken şeyi korumalı ve tüm bağımlılıklarını sahtelemeliyiz. Son önemli adım, `HttpClientModule`'ü `HttpClientTestingModule` ile değiştirmek, böylece istekleri taklit etmek için `HttpTestingController`'ı kullanabilmemizdir.

```ts
beforeEach(() =>
  MockBuilder(TargetService, TargetModule).replace(
    HttpClientModule,
    HttpClientTestingModule
  )
);
```

:::tip
`TargetService`'in `/data` adresine basit bir GET isteği göndermiş olduğunu varsayalım ve sonucunu döndürdüğünü düşünelim. Bunu test etmek için servise abone olmamız ve isteğin bir beklentisini yazmamız gerekiyor.
:::

```ts
const service = TestBed.get(TargetService);
let actual: any;

service.fetch().subscribe(value => (actual = value));
```

```ts
const httpMock = TestBed.get(HttpTestingController);

const req = httpMock.expectOne('/data');
expect(req.request.method).toEqual('GET');
req.flush([false, true, false]);
httpMock.verify();
```

Artık servisin döndürdüğü sonuca dair bir kıyaslama yapabiliriz.

```ts
expect(actual).toEqual([false, true, false]);
```

## Canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestHttpRequest/test.spec.ts&initialpath=%3Fspec%3DTestHttpRequest)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestHttpRequest/test.spec.ts&initialpath=%3Fspec%3DTestHttpRequest)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestHttpRequest/test.spec.ts"
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

// Http istekleri yapan bir servis.
@Injectable()
class TargetService {
  public constructor(protected http: HttpClient) {}

  public fetch(): Observable<boolean[]> {
    return this.http.get<boolean[]>('/data');
  }
}

// Servisi ve http istemcisini sağlayan bir modül.
@NgModule({
  imports: [HttpClientModule],
  providers: [TargetService],
})
class TargetModule {}

describe('TestHttpRequest', () => {
  beforeEach(() => {
    return MockBuilder(TargetService, TargetModule).replace(
      HttpClientModule,
      HttpClientTestingModule,
    );
  });

  it('bir isteği gönderir', () => {
    MockRender();

    // Test etmek için servisi ve http kontrolörünü çıkartalım.
    const service = ngMocks.findInstance(TargetService);
    const httpMock = ngMocks.findInstance(HttpTestingController);

    // Servisin ne döndürdüğünü kontrol etmek için basit bir abone olma.
    let actual: any;
    service.fetch().subscribe(value => (actual = value));

    // Bir isteği simüle etme.
    const req = httpMock.expectOne('/data');
    expect(req.request.method).toEqual('GET');
    req.flush([false, true, false]);
    httpMock.verify();

    // Sonucu kıyaslama yapma.
    expect(actual).toEqual([false, true, false]);
  });
});
```  