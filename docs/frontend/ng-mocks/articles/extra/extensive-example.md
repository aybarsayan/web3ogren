---
title: Angular testlerinde mocks kullanımına dair geniş bir örnek
description: Bu belge, Angular testlerinde mocks kullanımını ve bunun nasıl uygulanacağını göstermektedir. Kod örnekleri ile birlikte, bu sürecin anlaşılması kolaylaştırılmaktadır.
keywords: [Angular, test, mocks, örnek, uygulama]
sidebar_label: Geniş örnek
---

Aşağıda, Angular testlerinde mocks nasıl kullanılacağına dair kapsamlı bir örnek bulunmaktadır. Lütfen kod içerisindeki yorumlara dikkat edin, bu yorumlar amaçları ve niyetleri açıklar.

:::info
Ayrıca, testle oynamak için sandboxes'ta deneyebilirsiniz:
:::

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/main/test.spec.ts&initialpath=%3Fspec%3Dmain)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/main/test.spec.ts&initialpath=%3Fspec%3Dmain)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/main/test.spec.ts"
@Pipe({
  name: 'translate',
})
class TranslatePipe implements PipeTransform {
  public transform(value: string): string {
    // Sadece test amacı için
    // herhangi bir çeviri servisi kullanmıyoruz.
    return `translated:${value}`;
  }
}

// Test etmek istediğimiz ana bileşen.
@Component({
  selector: 'app-root',
  template: `
    <app-header [showLogo]="true" [title]="title" (logo)="logoClick.emit()">
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
  @Input() public title = 'Uygulamam';
}

// Mock oluşturmak istediğimiz bağımlı bir bileşen
// bileşenin girdileri, çıktıları ve ContentChild'ına saygı göstererek.
@Component({
  selector: 'app-header',
  template: `
    <a (click)="logo.emit()">
      <img src="../../../images/cikti/yeoman/assets/img/blog/2016-07-13/logo.png" *ngIf="showLogo" alt="Logo" />
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
  // Genellikle, böyle bir şeyimiz olurdu.
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
  // Ancak, genellikle AppHeaderComponent ve TranslatePipe yerine
  // mocks kullanmak isteriz.

  // ng-mocks ile bu şekilde tanımlanabilir.
  beforeEach(() => {
    // AppComponent olduğu gibi kalacak,
    // AppModule içindeki her şey mocks ile değiştirilecektir.
    return (
      MockBuilder(AppComponent, AppModule)
        // Mock AppHeaderComponent'ı nasıl oluşturacağımıza dair
        // özel bir yapı ekliyoruz.
        .mock(AppHeaderComponent, {
          render: {
            // #menu şablonu, mock AppHeaderComponent ile
            // eş zamanlı olarak işlenecektir.
            menu: true,
          },
        })
        // sahte bir dönüşüm işleyicisi.
        .mock(TranslatePipe, v => `fake:${v}`)
    );
    // aynı şekilde
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
    // ya da ngMocks.guts kullandıysak
    // TestBed.configureTestingModule(ngMocks.guts(
    //   AppComponent, // <- olduğu gibi tutuyoruz.
    //   AppModule,
    // ));
    // return testBed.compileComponents();
    // Ancak bu durumda TranslatePipe, 
    // Customize etmediğimiz takdirde undefined dönecektir
    // MockInstance ya da defaultMock ile.
  });

  it('AppComponent davranışını doğrular', () => {
    const logoClickSpy = jasmine.createSpy(); // veya jest.fn();
    // jest durumunda
    // const logoClickSpy = jest.fn();

    // beforeEach'teki TestBed.createComponent(AppComponent) yerine
    // MockRender doğrudan testlerde kullanılabilir.
    const fixture = MockRender(AppComponent, {
      logoClick: logoClickSpy,
      title: 'Sahte Uygulama',
    });
    // Yardımcı bir bileşen oluşturur
    // aşağıdaki şablonla:
    // <app-root
    //   [title]="'Sahte Uygulama'"
    //   (logoClick)="logoClickSpy($event)"
    // ></app-root>
    // ve bunu TestBed.createComponent(HelperComponent) ile işler.
    // AppComponent, fixture.point üzerinden erişilebilir.

    // fixture.debugElement.query(
    //   By.directive(AppHeaderComponent)
    // );
    // ama tip güvenilir ve hiçbir şey bulunmazsa hata verir.
    const header = ngMocks.find(AppHeaderComponent);

    // AppComponent'in AppHeaderComponent'i nasıl kullandığını doğrular.
    expect(header.componentInstance.showLogo).toBe(true);
    expect(header.componentInstance.title).toBe('Sahte Uygulama');

    // AppComponents'in AppHeaderComponent'i güncellediğini kontrol etme.
    fixture.componentInstance.title = 'Güncellenmiş Uygulama';
    fixture.detectChanges();
    expect(header.componentInstance.title).toBe(
      'Güncellenmiş Uygulama',
    );

    // AppComponent'in AppHeaderComponent çıktılarında olup olmadığını kontrol etme.
    expect(logoClickSpy).not.toHaveBeenCalled();
    header.componentInstance.logo.emit();
    expect(logoClickSpy).toHaveBeenCalled();

    // AppComponent'in AppHeaderComponent'e doğru menüyü geçtiğini doğrular.
    const links = ngMocks.findAll(header, 'a');
    expect(links.length).toBe(2);
    const [link1, link2] = links;

    // TranslatePipe'in kullanıldığını kontrol etme.
    expect(link1.nativeElement.innerHTML).toEqual('fake:Home');
    // Bir girdinin değerini almak için kolay bir yol. Aynı şey
    // links[0].injector.get(RouterLinkWithHref).routerLink
    expect(ngMocks.input(link1, 'routerLink')).toEqual(['/home']);

    expect(link2.nativeElement.innerHTML).toEqual('fake:About');
    expect(ngMocks.input(link2, 'routerLink')).toEqual(['/about']);
  });
});