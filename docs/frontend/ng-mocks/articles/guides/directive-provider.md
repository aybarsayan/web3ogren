---
title: Angular uygulamasında bir direktif sağlayıcısını test etme
description: Bu içerik, bir Angular direktifinin sağlayıcısını test etmenin yöntemlerini kapsamaktadır. Test senaryoları ve örneklerle konunun detaylarına inilmiştir.
keywords: [Angular, direktif, test, sağlayıcı, MockBuilder, TestBed, ngMocks]
---

Bu test, `"Bir bileşen sağlayıcısını nasıl test edersiniz"` başlığına oldukça benzer. Farklı olan, biraz farklı bir şablona ihtiyaç duymamızdır.

Şimdi `TestBed`'i hazırlayalım: test için servis ilk parametre, direktif ise ikinci parametredir:

```ts
beforeEach(() => MockBuilder(TargetService, TargetDirective));
```

:::info
Test için özel bir şablon şöyle görünebilir:
:::

```ts
const fixture = MockRender(`<div target></div>`);
```

Fixture'ı elde ettiğimizde, içinden servisi çıkartabilir ve davranışını doğrulayabiliriz:

```ts
const service = fixture.point.injector.get(TargetService);
```

## Canlı örnek

- [Bunu CodeSandbox'ta dene](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestProviderInDirective/test.spec.ts&initialpath=%3Fspec%3DTestProviderInDirective)
- [Bunu StackBlitz'te dene](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestProviderInDirective/test.spec.ts&initialpath=%3Fspec%3DTestProviderInDirective)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestProviderInDirective/test.spec.ts"
import {
  Directive,
  ElementRef,
  Injectable,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

// Basit bir servis, daha fazla mantık içerebilir,
// ancak test gösterimi için gereksizdir.
@Injectable()
class TargetService {
  public readonly value = true;
}

// Direktifin amacı, fare üzerine gelindiğinde
// bir arka plan rengi eklemektir ve fare ayrıldığında kaldırmaktır.
@Directive({
  providers: [TargetService],
  selector: '[target]',
})
class TargetDirective implements OnInit {
  public constructor(
    public readonly service: TargetService,
    protected ref: ElementRef,
    protected templateRef: TemplateRef<void>,
    protected viewContainerRef: ViewContainerRef,
  ) {}

  public ngOnInit(): void {
    this.viewContainerRef.clear();
    if (this.service.value) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}

describe('TestProviderInDirective', () => {
  ngMocks.faster(); // birden fazla TestBed için aynı.

  // Servisi test etmek istediğimiz için, MockBuilder'ın
  // ilk parametresi olarak geçiyoruz.
  // TargetDirective ile ilgilenmediğimiz için, ikinci
  // parametre olarak bir mock kopyasıyla değiştirilmesi için geçiyoruz.
  // MockBuilder'ın promisini döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(TargetService, TargetDirective));

  it('direktif üzerinden servise erişim var', () => {
    // Direktif ile bir div oluşturalım.
    MockRender('<div target></div>');

    // Direktif ile debugElement'i bulalım.
    // Lütfen burada ngMocks.find kullandığımızı unutmayın.
    const el = ngMocks.find(TargetDirective);

    // Servisi çıkaralım.
    const service = ngMocks.get(el, TargetService);

    // İşte buradayız, artık servisle ilgili her şeyi doğrulayabiliriz.
    expect(service.value).toEqual(true);
  });

  it('yapısal direktif üzerinden servise erişim var', () => {
    // Direktif ile bir div oluşturalım.
    MockRender('<div *target></div>');

    // Direktif ile debugNode'i bulalım.
    // Lütfen burada ngMocks.reveal kullandığımızı unutmayın.
    const node = ngMocks.reveal(TargetDirective);

    // Servisi çıkaralım.
    const service = ngMocks.get(node, TargetService);

    // İşte buradayız, artık servisle ilgili her şeyi doğrulayabiliriz.
    expect(service.value).toEqual(true);
  });
});