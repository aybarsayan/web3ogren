---
title: Angular testlerinde bileşenleri nasıl Mock'lamak
description: Angular testlerinde bileşenleri ng-mocks yardımıyla Mock'lama bilgisi. Bu içerik, mock bileşenlerin nasıl oluşturulacağı ve kullanılacağı hakkında detaylı bilgi sunmaktadır.
keywords: [Angular, test, mock, ng-mocks, bileşenler]
---

**Angular testlerinde bir mock bileşen**, `MockComponent` fonksiyonu ile oluşturulabilir. Mock bileşen, orijinal bileşeninin arayüzüne saygı gösterir, ancak tüm yöntemleri saçmadır.

Bir mock bileşen oluşturmak için, sadece sınıfını `MockComponent` fonksiyonuna geçirmeniz yeterlidir.

```ts
TestBed.configureTestingModule({
  declarations: [
    // tek bir bileşen için
    MockComponent(Component),

    // bir grup bileşen için
    ...MockComponents(Component1, Component2),
  ],
});
```

**Bir mock bileşenin sınıfı:**

- aynı `selector`'a sahiptir
- alias desteği ile aynı `@Inputs` ve `@Outputs`'a sahiptir
- transclusion'ı sağlamak için saf `` etiketleri ile şablonlara sahiptir
- `@ContentChild` ve `@ContentChildren` desteği vardır
- `ControlValueAccessor`, `Validator` ve `AsyncValidator` desteği vardır
- `exportAs` desteği vardır
- `bağımsız bileşenler` desteği vardır

:::tip
FormControl, ControlValueAccessor, Validator ve AsyncValidator'ı mock'lama hakkında bilgi, `farklı bir bölümde` bulunmaktadır.
:::

## Basit örnek

Diyelim ki Angular uygulamamızda `TargetComponent`, `DependencyComponent` adlı bir alt bileşene bağımlıdır ve biz bunun mock nesnesini bir testte kullanmak istiyoruz.

Genellikle `beforeEach` şu şekilde görünür:

```ts
describe('Test', () => {
  let component: TargetComponent;
  let fixture: ComponentFixture<TargetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        // test için bileşenimiz
        TargetComponent,

        // rahatsız edici bağımlılık
        DependencyComponent,
      ],
    });

    fixture = TestBed.createComponent(TargetComponent);
    component = fixture.componentInstance;
  });
});
```

**Bir mock alt bileşen oluşturmak için**, sadece sınıfını `MockComponent`'e geçirmeniz yeterlidir:

```ts
TestBed.configureTestingModule({
  declarations: [
    TargetComponent,

    // kazanmak
    MockComponent(DependencyComponent),
  ],
});
```

Ya da profesyonel gibi olun ve `MockBuilder`, `.mock` yöntemi ve `MockRender` kullanın:

```ts
describe('Test', () => {
  beforeEach(() => {
    // DependencyComponent, ItsModule'da bir deklarasyon veya bir yerde içe aktarılmıştır.
    return MockBuilder(TargetComponent, ItsModule);
  });

  it('oluşturulmalı', () => {
    const fixture = MockRender(TargetComponent);
    expect(fixture.point.componentInstance).toBeDefined();
  });
});
```

## Bağımsız bileşenler

Angular 14'ten itibaren, bağımsız bileşenler için destek sağlar. Bunlar `ng-mocks` tarafından desteklenmektedir. Bir bağımsız bileşeni mock'lamak için `imports` içinde `MockComponent` çağırmanız gerekir:

```ts
TestBed.configureTestingModule({
  imports: [
    // tek bir bileşen için
    MockComponent(StandaloneComponent),

    // bir grup bileşen için
    ...MockComponents(Standalone1Component, Standalone2Component),
  ],
  declarations: [
    // test için bileşenimiz
    TargetComponent,
  ],
});
```

:::info
`MockBuilder` ayrıca bağımsız bileşenleri destekler ve yalnızca sığ render almak için bileşenlerinin içe aktarımlarını mock'lamanıza olanak tanır.
:::

## Gelişmiş örnek

**bileşenleri mock'lama** hakkında gelişmiş bir örnek. Lütfen koddaki yorumlara dikkat edin.

- [Bunu CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockComponent/test.spec.ts&initialpath=%3Fspec%3DMockComponent)
- [Bunu StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockComponent/test.spec.ts&initialpath=%3Fspec%3DMockComponent)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockComponent/test.spec.ts"
describe('MockComponent', () => {
  beforeEach(() => {
    return MockBuilder(TargetComponent, ItsModule);
  });

  it('çocuk girdisine doğru değeri gönderiyor', () => {
    const fixture = MockRender(TargetComponent);
    const component = fixture.point.componentInstance;

    // Aşağıdakinin aynısıdır
    // fixture.debugElement.query(
    //   By.css('child')
    // ).componentInstance
    // ama uygun şekilde türlendirilmiştir.
    const mockComponent = ngMocks.find<ChildComponent>(
      'child',
    ).componentInstance;

    // Diyelim ki DependencyComponent 'someInput' adında bir girdiye sahip.
    // MyComponent, değerini
    // `[someInput]="value"` aracılığıyla ayarlar. Girdinin değeri,
    // mock bileşene geçilecek, böylece bu üzerinde varsayımlarda bulunabiliriz.
    component.value = 'foo';
    fixture.detectChanges();

    // ng-mocks sayesinde, bu tür güvenli.
    expect(mockComponent.someInput).toEqual('foo');
  });

  it('çocuk bileşenin bir yayılımı olduğunda bir şey yapar', () => {
    const fixture = MockRender(TargetComponent);
    const component = fixture.point.componentInstance;

    // Aşağıdakinin aynısıdır
    // fixture.debugElement.query(
    //   By.directive(DependencyComponent)
    // ).componentInstance
    // ama uygun şekilde türlendirilmiştir.
    const mockComponent = ngMocks.findInstance(ChildComponent);

    // Yine de diyelim ki DependencyComponent'ın
    // 'someOutput' adında bir çıktısı var. MyComponent, çıkışı aracılığıyla dinler
    // `(someOutput)="trigger($event)"`.
    // Bir casus oluşturalım ve çıktıyı tetikleyelim.
    ngMocks.stubMember(
      component,
      'trigger',
      typeof jest === 'undefined' ? jasmine.createSpy() : jest.fn(),
    );
    mockComponent.someOutput.emit({
      payload: 'foo',
    });

    // Etki üzerindeki varsayımı yapalım.
    expect(component.trigger).toHaveBeenCalledWith({
      payload: 'foo',
    });
  });

  it('çocuk bileşenin içinde bir şey render eder', () => {
    const localFixture = MockRender<ChildComponent>(`
      <child>
        <p>içeride içerik</p>
      </child>
    `);

    // HTML'ye doğrudan erişim sağlayabiliriz ve bazı yan etkiler üzerinde varsayımda bulunabiliriz.
    const mockNgContent = localFixture.point.nativeElement.innerHTML;
    expect(mockNgContent).toContain('<p>içeride içerik</p>');
  });

  it('çocuk bileşenin ContentChild'ını render eder', () => {
    const fixture = MockRender<ChildComponent>(`
      <child>
        <ng-template #something>
          <p>içeride şablon</p>
        </ng-template>
        <p>içeride içerik</p>
      </child>
    `);

    // Enjekte edilen ng-content, şablonlar hariç her şeyi render etti.
    const mockNgContent = fixture.point.nativeElement.innerHTML;
    expect(mockNgContent).toContain('<p>içeride içerik</p>');
    expect(mockNgContent).not.toContain('<p>içeride şablon</p>');

    // Şimdi şablonu render edelim. Önce, mock bileşeninin
    // `__render` yöntemine erişmek için MockedComponent<T> olmalıdır. `isMockOf` fonksiyonu burada yardımcı olur.
    const mockComponent = fixture.point.componentInstance;
    ngMocks.render(
      mockComponent,
      ngMocks.findTemplateRef('something'),
    );

    // Render edilen şablon `<div data-key="something">` ile sarılmıştır.
    // İçeriğini tam olarak varsayımlamak için bu seçiciyi kullanabiliriz.
    const mockNgTemplate =
      ngMocks.find(ChildComponent).nativeElement.innerHTML;
    expect(mockNgTemplate).toContain('<p>içeride şablon</p>');
  });
});