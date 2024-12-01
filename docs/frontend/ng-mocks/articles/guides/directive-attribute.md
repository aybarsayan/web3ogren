---
title: Angular uygulamasında bir nitelik direktifini nasıl test edilir
description: Bu belge, Angular'da bir nitelik direktifinin nasıl test edileceğini kapsamlı bir şekilde ele alır. Doğru testleri yazmak için gereken adımları açıklayarak, kullanıcıların direktiflerinin davranışlarını doğrulamalarına yardımcı olur.
keywords: [Angular, test, nitelik direktifi, MockRender, geliştirme, yazılım testi]
---

Nitelik direktifleri genellikle DOM'u manipüle eder veya benzer elemanların bir grubunu işaretler.  
Bir test için, direktifi kullandığımız özel bir şablon oluşturmamız gerektiği anlamına gelir, ardından davranışını doğrulayabiliriz.

:::tip
Bu aşamada, **direktif haricindeki her şeyi** taklit etmeliyiz.  
Ya da direktifin bağımlılıkları yoksa tek başına geçirebiliriz:
:::

```ts
beforeEach(() => MockBuilder(TargetDirective));
```

Bir sonraki adım, özel bir şablon oluşturmaktır. Direktifin seçicisi `[target]` olduğunu varsayalım.  
Şimdi bunu bir testte render edelim:

```ts
const fixture = MockRender(`<div target></div>`);
```

[`MockRender`](https://www.npmjs.com/package/ng-mocks#mockrender) kullandığımız için, direktifi içeren öğeye  
`fixture.point` ile erişebileceğimizi biliyoruz.

Artık direktifin dinlediği olayları tetikleyebiliriz,  
veya daha fazla doğrulama için örneğine erişebiliriz:

```ts
fixture.point.triggerEventHandler('mouseenter', null);
const instance = ngMocks.get(fixture.point, TargetDirective);
```

## Canlı örnek

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestAttributeDirective/test.spec.ts&initialpath=%3Fspec%3DTestAttributeDirective)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestAttributeDirective/test.spec.ts&initialpath=%3Fspec%3DTestAttributeDirective)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/TestAttributeDirective/test.spec.ts"
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

// Direktifin amacı, mouseenter'da bir arka plan rengi eklemek
// ve mouseleave'de kaldırmaktır.
// Varsayılan olarak renk sarıdır.
@Directive({
  selector: '[target]',
})
class TargetDirective {
  @Input() public color = 'yellow';

  public constructor(protected ref: ElementRef) {}

  @HostListener('mouseenter') public onMouseEnter() {
    this.ref.nativeElement.style.backgroundColor = this.color;
  }

  @HostListener('mouseleave') public onMouseLeave() {
    this.ref.nativeElement.style.backgroundColor = '';
  }
}

describe('TestAttributeDirective', () => {
  ngMocks.faster(); // birden fazla testi için aynı TestBed.

  // Direktifi test etmek istediğimiz için, MockBuilder'ın ilk
  // parametresi olarak geçiyoruz. İkinci parametreyi atlayabiliriz,
  // çünkü bağımlılık yok.
  // MockBuilder'ın sözleşmesini döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(TargetDirective));

  it('varsayılan arka plan rengini kullanır', () => {
    const fixture = MockRender('<div target></div>');

    // Varsayılan olarak, mouse enter olmadan, div'de arka plan
    // rengi yoktur.
    expect(fixture.nativeElement.innerHTML).not.toContain(
      'style="background-color: yellow;"',
    );

    // Mouse enter olayını simüle edelim.
    // fixture.point, render edilen şablondan kök öğemizdir,
    // bu nedenle olay tetiklenecek div'i işaret eder.
    fixture.point.triggerEventHandler('mouseenter', null);

    // Rengi doğrulayalım.
    expect(fixture.nativeElement.innerHTML).toContain(
      'style="background-color: yellow;"',
    );

    // Şimdi mouse leave olayını simüle edelim.
    fixture.point.triggerEventHandler('mouseleave', null);

    // Ve arka plan renginin şimdi gittiğini doğrulayalım.
    expect(fixture.nativeElement.innerHTML).not.toContain(
      'style="background-color: yellow;"',
    );
  });

  it('sağlanan arka plan rengini ayarlar', () => {
    // Girdileri/çıkışları test etmek istediğimizde, MockRender'ın
    // ikinci parametresini kullanmalıyız, sadece şablon için
    // değişkenleri geçirin, bunlar fixture.componentInstance'ın
    // özellikleri olacaktır.
    const fixture = MockRender('<div [color]="color" target></div>', {
      color: 'red',
    });

    // Arka plan renginin kırmızı olduğunu doğrulayalım.
    fixture.point.triggerEventHandler('mouseenter', null);
    expect(fixture.nativeElement.innerHTML).toContain(
      'style="background-color: red;"',
    );

    // Rengi değiştirelim, .point'e ihtiyacımız yok, çünkü
    // MockRender'ın orta bir bileşenine erişiyoruz.
    fixture.componentInstance.color = 'blue';
    fixture.detectChanges(); // şablonu güncelle
    fixture.point.triggerEventHandler('mouseenter', null);
    expect(fixture.nativeElement.innerHTML).toContain(
      'style="background-color: blue;"',
    );
  });
});