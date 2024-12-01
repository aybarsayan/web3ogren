---
title: Angular uygulamasında bir bileşeni test etme
description: Bu içerik, bir Angular bileşeninin test edilmesine dair kapsamlı bir rehber sunmaktadır. Bileşenin temel özellikleri ve test stratejileri hakkında bilgi verilmektedir.
keywords: [Angular, bileşen testi, Input, Output, MockBuilder, TestBed]
---

Aşağıda bir bileşenin sahip olabileceği hemen hemen her şeyi test etme örneğini bulabilirsiniz:

* `@Input`
* `@Output`
* `@ContentChild`
* yönlendirme

## Canlı örnek

- [CodeSandbox'ta dene](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/main/test.spec.ts&initialpath=%3Fspec%3Dmain)
- [StackBlitz'te dene](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/main/test.spec.ts&initialpath=%3Fspec%3Dmain)

```ts title="https://github.com/help-me-mom/ng-mocks/tree/master/examples/main/test.spec.ts"
import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  Output,
  Pipe,
  PipeTransform,
  TemplateRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

@Pipe({
  name: 'translate',
})
class TranslatePipe implements PipeTransform {
  public transform(value: string): string {
    // Sadece test amacıyla
    // herhangi bir çeviri hizmeti kullanmıyoruz.
    return `translated:${value}`;
  }
}

// Test etmek istediğimiz ana bileşenimiz.
@Component({
  selector: 'app-root',
  template: `
    <app-header
      [showLogo]="true"
      [title]="title"
      (logo)="logoClick.emit()"
    >
      <ng-template #menu>
        <ul>
          <li>
            <a [routerLink]="['/home']">{{ 'Home' | translate }}</a>
          </li>
          <li>
            <a [routerLink]="['/about']">{{ 'About' | translate }}</a>
          </li>
        </ul>
      </ng-template>
    </app-header>
    <router-outlet></router-outlet>
  `,
})
class AppComponent {
  @Output() public logoClick = new EventEmitter<void>();
  @Input() public title = 'My Application';
}

// Bir mock oluşturmak istediğimiz bağımlı bileşen
// bileşenin girişleri, çıkışları ve ContentChild'ı ile birlikte.
@Component({
  selector: 'app-header',
  template: `
    <a (click)="logo.emit()">
      <img src="../../../images/cikti/yeoman/assets/img/blog/2016-07-13/logo.png" *ngIf="showLogo" />
    </a>
    {{ title }}
    <template [ngTemplateOutlet]="menu"></template>
  `,
})
class AppHeaderComponent {
  @Output() public readonly logo = new EventEmitter<void>();
  @ContentChild('menu') public menu?: TemplateRef<ElementRef>;
  @Input() public showLogo = false;
  @Input() public title = '';
}

// Bileşenlerimizin tanımlandığı modül.
@NgModule({
  declarations: [AppComponent, AppHeaderComponent, TranslatePipe],
  imports: [CommonModule, RouterModule.forRoot([])],
})
class AppModule {}

describe('main', () => {
  // Genelde şöyle bir şeyimiz olur.
  // beforeEach(() => {
  //   TestBed.configureTestingModule({
  //     imports: [
  //       CommonModule,
  //       RouterModule.forRoot([]),
  //     ],
  //     declarations: [
  //       AppComponent,
  //       AppHeaderComponent,
  //       TranslatePipe,
  //     ],
  //   });
  //
  //   fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  // });
  // Ama genelde, AppHeaderComponent ve TranslatePipe yerine
  // mock'lar kullanmak isteriz.

  // ng-mocks ile aşağıdaki şekilde tanımlanabilir.
  beforeEach(() => {
    // AppComponent olduğu gibi kalacak,
    // AppModule içindeki her şey mock'ları ile değiştirilecektir.
    return (
      MockBuilder(AppComponent, AppModule)
        // mock AppHeaderComponent oluşturma özel yapılandırması ekleme.
        .mock(AppHeaderComponent, {
          render: {
            // #menu şablonu
            // mock AppHeaderComponent ile aynı anda render edilecektir.
            menu: true,
          },
        })
        // sahte bir dönüşüm işleyici.
        .mock(TranslatePipe, v => `fake:${v}`)
    );
    // aynısı
    // TestBed.configureTestingModule({
    //   imports: [
    //     MockModule(CommonModule),
    //     MockModule(RouterModule.forRoot([])),
    //   ],
    //   declarations: [
    //     AppComponent, // <- olduğu gibi tutuyoruz.
    //     MockComponent(AppHeaderComponent),
    //     MockPipe(TranslatePipe, v => `fake:${v}`),
    //   ],
    // });
    // return testBed.compileComponents();
    //
    // veya ngMocks.guts kullanarak
    // TestBed.configureTestingModule(ngMocks.guts(
    //   AppComponent, // <- olduğu gibi tutuyoruz.
    //   AppModule,
    // ));
    // return testBed.compileComponents();
    // Ama bu durumda, TranslatePipe özelleştirilmezse undefined dönecektir,
    // MockInstance veya defaultMock ile.
  });

  it('AppComponent davranışını doğrular', () => {
    const logoClickSpy =
      typeof jest === 'undefined' ? jasmine.createSpy() : jest.fn();
    // jest durumunda
    // const logoClickSpy = jest.fn();

    // beforeEach'teki TestBed.createComponent(AppComponent) yerine
    // MockRender doğrudan testlerde kullanılabilir.
    const fixture = MockRender(AppComponent, {
      logoClick: logoClickSpy,
      title: 'Fake Application',
    });
    // Bu, bir yardımcı bileşen oluşturur
    // aşağıdaki şablonla:
    // <app-root
    //   [title]="'Fake Application'"
    //   (logoClick)="logoClickSpy($event)"
    // ></app-root>
    // ve TestBed.createComponent(HelperComponent) ile render eder.
    // AppComponent, fixture.point aracılığıyla erişilebilir.

    // fixture.debugElement.query(
    //   By.directive(AppHeaderComponent)
    // );
    // yerine ama tip güvenli ve hiçbir şey bulunmadığında başarısız olur.
    const header = ngMocks.find(AppHeaderComponent);

    // AppComponent'in AppHeaderComponent'i nasıl kullandığını doğrular.
    expect(header.componentInstance.showLogo).toBe(true);
    expect(header.componentInstance.title).toBe('Fake Application');

    // AppComponents'in AppHeaderComponent'i güncellemesini kontrol etme.
    fixture.componentInstance.title = 'Updated Application';
    fixture.detectChanges();
    expect(header.componentInstance.title).toBe(
      'Updated Application',
    );

    // AppComponent'in AppHeaderComponent'in çıkışlarını dinleyip dinlemediğini kontrol etme.
    expect(logoClickSpy).not.toHaveBeenCalled();
    header.componentInstance.logo.emit();
    expect(logoClickSpy).toHaveBeenCalled();

    // AppComponent'in AppHeaderComponent'e doğru menüyü geçirdiğini doğrular.
    const links = ngMocks.findAll(header, 'a');
    expect(links.length).toBe(2);
    const [link1, link2] = links;

    // TranslatePipe'in kullanıldığını kontrol etme.
    expect(link1.nativeElement.innerHTML).toEqual('fake:Home');
    // Bir giriş değerini almanın kolay bir yolu. Aynı
    // links[0].injector.get(RouterLinkWithHref).routerLink
    expect(ngMocks.input(link1, 'routerLink')).toEqual(['/home']);

    expect(link2.nativeElement.innerHTML).toEqual('fake:About');
    expect(ngMocks.input(link2, 'routerLink')).toEqual(['/about']);
  });
});