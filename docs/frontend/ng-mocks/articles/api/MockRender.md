---
title: MockRender - Angular testlerinde gelişmiş render işlemleri
description: MockRender`, Angular testlerinde bileşenleri daha etkili bir şekilde test etmek için kullanılan bir yöntemdir. Bu içerikte, `MockRender` kullanımının avantajları, çeşitli bileşen türleri ile etkilešimi ve performans iyileştirmeleri hakkında bilgiler bulacaksınız.
keywords: [MockRender, Angular, testler, bileşen, performans]
---

**Angular testlerinde gelişmiş render işlemleri** `MockRender` fonksiyonu aracılığıyla sağlanır. `MockRender`, `Inputs`, `Outputs`, `ChildContent` üzerinde doğrulama yapmanız gerektiğinde veya özel şablonlar render etmek istediğinizde yardımcı olur.

`MockRender`, Angular `TestBed.createComponent`'ı arka planda kullanır ve aşağıdakileri sağlar:

- `Inputs` ve `Outputs` için doğru bağlamalar
- özel şablonların render edilmesi
- tüm yaşam döngüsü kancaları için destek (`ngOnInit`, `ngOnChanges` vb.)
- `ChangeDetectionStrategy.OnPush` bileşenlerini test etme desteği
- bağlam sağlayıcıları için destek

---

## Bilinmesi gerekenler

### Döndürülen tür

:::caution
`MockRender(Component)`'ın `fixture`ı, `ComponentFixture` türüne dönüştürülemez.

Türü `MockedComponentFixture`'dir.
:::

Bu, `MockRender`'ın istenen şeyi render etmek için ek bir bileşen oluşturmasından kaynaklanmaktadır ve arayüzü farklıdır.

`MockedComponentFixture` türünü döndürür. Fark, ek bir `point` özelliği olmasıdır. Bunun en iyi yanı, `fixture.point.componentInstance` ile ilişkili sınıfa tam olarak belirlenmiş olmasıdır ve **sadece bileşenleri değil, direktifleri, servisleri ve token'ları da destekler**.

### Params ve fixture arasındaki proxy

`MockRender` kullanımıyla `fixture.componentInstance` ve `fixture.point.componentInstance` vardır ve bunların arasındaki farkı bilmek önemlidir:

- `fixture.point.componentInstance` gerçek bileşen örneğidir
- `fixture.componentInstance`, bileşenin `@Inputs` ve `@Outputs` değerlerini doğru bir şekilde kontrol eder

`MockRender(Component, params)` kullanıldığında `fixture.componentInstance`, `params` için bir proxy'dir, bu nedenle `fixture.componentInstance`'ı değiştirmek, `params`'ı değiştirmekle aynı anlama gelir ve tersi de geçerlidir.


Bir örnek

```ts
class Component {
  @Input() public i1: number = 1;
  @Input() public i2: number = 2;
}

const params = {
  i1: 5,
};

const fixture = MockRender(Component, params);

// fixture.componentInstance.i1 = 5;
// Değer, params üzerinden bir proxy ile alınır,
// çünkü params'da i1 vardır.

// fixture.componentInstance.i2 = 2;
// Değer, point üzerinden bir proxy ile alınır,
// çünkü params'da i2 yoktur ve Component'te vardır.

params.i1 = 6;
// Şimdi fixture.componentInstance.i1 = 6.

fixture.componentInstance.i1 = 7;
// Şimdi params.i1 = 7.

params.i2 = 8;
// Hiçbir şey yapmaz, çünkü proxy,
// params'ın başlangıç anahtarlarına dayanır,
// ve i2 orada yoktur.

fixture.point.componentInstance.i2 = 3;
// Şimdi fixture.componentInstance.i2 = 3.

fixture.componentInstance.i2 = 4;
// Şimdi fixture.point.componentInstance.i2 = 4.

fixture.point.componentInstance.i3 = 5;
// Hiçbir şey yapmaz, çünkü proxy,
// başlangıç özelliklerine dayanır,
// ve i3 orada yoktur.
```



Göründüğü kadar karmaşık değil, değil mi?

Bu nedenle `MockRender` ile test yazmanın en iyi yolu, şunlara dayanmak:

- `inputs / outputs`'ı değiştirmek istiyorsanız `fixture.componentInstance` ya da `params`
- beklentilerinizi doğrulamak istiyorsanız `fixture.point.componentInstance`

:::tip
Olası bir çözüm olarak, `params` yayılabilir:

```ts
const fixture = MockRender(Component, { ...params });
```
:::

### Bir test için bir MockRender

`MockRender`, `TestBed`'e enjekte edilmesi gereken özel bir sarmalayıcı bileşeni oluşturur. Sarmalayıcı, sağlanan veya parametreler temelinde oluşturulan özel şablonu render etmek için gereklidir. Yeni bileşenlerin `TestBed` içinde tanımlanabilmesi, `TestBed`'in henüz kullanılmamış olması durumunda mümkündür.

Bunun sonucunda, `TestBed.get`, `TestBed.inject`, `TestBed.createComponent` veya başka bir `MockRender` kullanıldıktan sonra `MockRender` kullanımında, kirli `TestBed` hakkında bir hata tetiklenir.

---

Ancak, bir test içinde birden fazla kez `MockRender` kullanmak hâlâ mümkündür. Bu, `TestBed`'in sıfırlanmasını gerektirir (bkz. `ngMocks.flushTestBed`). Lütfen bunun mevcut tüm servis örneklerini etkisiz hale getireceğini unutmayın.

### Örnek Kod

```ts
it('iki render', () => {
  MockRender('<div>1</div>'); // tamam
  MockRender('<div>2</div>'); // hata
});

// MockRender'ı kullanmanın doğru yolu.
it('iki renderın ilki', () => {
  MockRender('<div>1</div>'); // tamam
});
it('iki renderın ikincisi', () => {
  MockRender('<div>2</div>'); // tamam
});

// Mümkün, ancak önerilmez.
it('iki render', () => {
  MockRender('<div>1</div>'); // tamam
  ngMocks.flushTestBed();
  MockRender('<div>2</div>'); // tamam
  MockRender('<div>3</div>', {}, {reset: true}); // tamam
});
```

## ChangeDetectionStrategy.OnPush'u test etmek

`TestBed.createComponent(OnPushComponent)`’ı kullanmayı hiç denediniz mi? `ChangeDetectionStrategy.OnPush` bileşeni ile?

O zaman giriş değişikliklerinde yeniden render edilmediğini bildiğinizi biliyorum.

`MockRender` bu durumu kapsamaktadır ve girişlerin ve çıkışların değişikliklerinin bileşenlerinizi ve direktiflerinizi nasıl etkilediğini kontrol edebilirsiniz.

```ts
const fixture = MockRender(OnPushComponent);

fixture.componentInstance.myInput = 5;
fixture.detectChanges();
expect(ngMocks.formatText(fixture)).toContain(':5:');

fixture.componentInstance.myInput = 6;
fixture.detectChanges();
expect(ngMocks.formatText(fixture)).toContain(':6:');
```

Girişlerin ve çıkışların `MockRender` tarafından nasıl işlendiği hakkında daha fazla ayrıntı aşağıdaki bölümlerde açıklanmaktadır.

## Fabrika

`MockRender`, bir ara katman bileşeni oluşturur. Bu, test performansı üzerinde istenmeyen bir etki yaratabilir. Özellikle, aynı kurulumun farklı testlerde kullanılması gereken durumlarda.

Örneğin, 5 testimiz varsa ve her test `MockRender(MyComponent)` çağrısı yapıyorsa, her seferinde bir ara katman bileşeni oluşturulacak ve `TestBed`'e enjekte edilecektir. Oysa `MockRender` mevcut ara katman bileşenini yeniden kullanabilir ve bunun üzerinden yeni bir fixture oluşturabilirdi.

Bu tür durumlarda, `MockRender` yerine `MockRenderFactory` kullanabilirsiniz. Bu, `bindings` ve `providers` kabul eder, ancak anında bir render yerine, bir fabrika fonksiyonu döndürür. Fabrika fonksiyonu, sadece ara katman bileşeninin üzerinden yeni bir fixture oluşturur.

Yukarıdaki koşulları göz önünde bulundurarak, `beforeAll` içinde `MockRenderFactory` yardımıyla bir fabrikayı bir kez oluşturması gerekir ve ardından 5 test bu fabrikayı çağırarak fixture'ları oluşturmalıdır.

```ts
describe('Maksimum performans', () => {
  const factory = MockRenderFactory(MyComponent, ['input1', 'input2']);
  
  ngMocks.faster();
  beforeAll(() => MockBuilder(MyComponent, MyModule));
  beforeAll(() => factory.configureTestBed());

  it('bir durumu kapsar', () => {
    const fixture = factory({input1: 1});
    expect(fixture.point.componentInstance.input1).toEqual(1);
  });

  it('başka bir durumu kapsar', () => {
    const fixture = factory({input2: 2});
    expect(fixture.point.componentInstance.input2).toEqual(2);
  });
});
```

## Params, Inputs ve Outputs

`MockRender`, oluşturulan şablon için ikinci parametre olarak `params` alır. `params`'ın amacı esneklik sağlamak ve `inputs`, `outputs` ve şablon değişkenleri üzerinde kontrol izin vermektir.

Bir bileşen veya direktif `MockRender`'a geçirildiğinde, `MockRender`, `selector`, `inputs`, `outputs` ve sağlanan `params`'a dayalı bir şablon oluşturur.

`MockRender`'in `params`'ı nasıl işlediğini bilmek, hangi şablonun oluşturulduğunu anlamak için hayati önem taşır.

### Hiçbir params yoksa

Eğer `MockRender` hiçbir `params` ile veya `null` ya da `undefined` olarak çağrıldıysa, tüm `inputs` otomatik olarak bağlanır ve tüm `outputs` göz ardı edilir. Bu nedenle, test edilen bileşende varsayılan değerler kullanılmaz, tüm `inputs` `null` alır.

:::tip
Neden `null`?

Çünkü `Angular`, isteğe bağlı zincir başarısız olduğunda `null` kullanır: ``.
Varsayılan değerine rağmen, eğer zincir başarısız olduysa, `input` `null` olur.

Böylece, `MockRender` bu davranışı varsayılan olarak sağlar.
:::

Örneğin, `input1` ve `input2` adında iki `inputs` ve `update1` ve `update2` adında iki `outputs` olan `MyComponent` adında bir bileşenimiz olduğunu varsayalım.

Yani, aşağıdaki gibi herhangi bir çağrı:

```ts
MockRender(MyComponent);
MockRender(MyComponent, null);
MockRender(MyComponent, undefined);
```

aşağıdaki gibi bir şablon oluşturur:

```html
<my-component [input1]="input1" [input2]="input2"></my-component>
```

burada `input1` ve `input2`, sarmalayıcı bileşenin `null` olan özellikleridir.

```ts
expect(fixture.componentInstance.input1).toEqual(null);
expect(fixture.componentInstance.input2).toEqual(null);

expect(fixture.point.componentInstance.input1).toEqual(null);
expect(fixture.point.componentInstance.input1).toEqual(null);
```

Eğer `fixture.componentInstance`'ın özelliklerini değiştirirsek, `fixture.detectChanges()`'ten sonra, test edilen bileşen güncellenmiş değerleri alacaktır.

```ts
expect(fixture.componentInstance.input1).toEqual(null);
expect(fixture.point.componentInstance.input1).toEqual(null);

fixture.componentInstance.input1 = 1;
// hala eski değer
expect(fixture.point.componentInstance.input1).toEqual(null);

fixture.detectChanges();
// şimdi çalışıyor
expect(fixture.point.componentInstance.input1).toEqual(1);
```

Varsayılan değerleri kullanmak/test etmek istiyorsanız, lütfen bir sonraki bölüme devam edin.

### Boş params

Varsayılan değerleri test etmek için, `params` olarak boş bir nesne sağlayabiliriz. Bu durumda, `MockRender`, yalnızca sağlanan nesnede ayarlanmış olan `inputs` ve `outputs` öğelerini işler.

Örneğin, `input1` ve `input2` adında iki `inputs` ve `update1` ve `update2` adında iki `outputs` olan `MyComponent` adında bir bileşenimiz var.

O zaman aşağıdaki gibi bir çağrı:

```ts
MockRender(MyComponent, {});
```

aşağıdaki gibi bir şablon oluşturur:

```html
<my-component></my-component>
```

`inputs`'a eriştiğimizde, varsayılan değerlerini alırız:
```ts
expect(fixture.point.componentInstance.input1).toEqual('default1');
expect(fixture.point.componentInstance.input1).toEqual('default2');
```

Bu durumda sarmalayıcı bileşen gereksizdir ve değişiklikler doğrudan test edilen bileşenin (`point`) örneği üzerinde yapılmalıdır.

### Sağlanan params

`MockRender`, sağlanan `params` için bir şablon oluşturmaya çalışır. Sadece `inputs` ve `outputs` ile aynı isimde olan `params` şablonu etkiler.

#### Inputs

`inputs` durumunda oldukça basittir, `MockRender` basitçe `[propName]="propName"` oluşturur.

Örneğin, `input1`, `input2` ve `input3` adında üç `inputs`'a sahip `MyComponent` adında bir bileşenimiz var,

O zaman şöyle bir çağrı:

```ts
const params = {input1: 1, input2: 2};
const fixture = MockRender(MyComponent, params);
```

aşağıdaki gibi bir şablon oluşturur:

```html
<my-component [input1]="input1" [input2]="input2"></my-component>
```

burada `input1` ve `input2`, sağlanan nesneye ait olup, nesnedeki herhangi bir değişiklik şablondaki değerleri etkileyecektir ve `input3` göz ardı edilir ve varsayılan değerini alır.

```ts
expect(fixture.point.componentInstance.input1).toEqual(1);

params.input1 = 3;
fixture.detectChanges();
expect(fixture.point.componentInstance.input1).toEqual(3);
```

#### Outputs

`outputs` durumu biraz farklıdır. `MockRender`, özelliklerin türlerini algılar ve şablonlarda farklı parçalar oluşturur.

Şu anda `MockRender` aşağıdaki türleri işleyebilir:

- fonksiyonlar
- olay yayıcıları
- konular
- sabitler

Örneğin, `o1`, `o2`, `o3` ve `o4` adında dört `outputs` olan `MyComponent` adında bir bileşenimiz var,

O zaman şöyle bir çağrı:

```ts
const params = {
  o1: undefined,
  o2: jasmine.createSpy('o2'),
  o3: new EventEmitter(),
  o4: new Subject(),
};
const fixture = MockRender(MyComponent, params);
```

aşağıdaki gibi bir şablon oluşturur:

```html
<my-component
  (o1)="o1=$event"
  (o2)="o2($event)"
  (o3)="o3.emit($event)"
  (o4)="o4.next($event)"
></my-component>
```

Herhangi bir `output` üzerinde yayım yapıldığında, ilişkili eylem tetiklenir:

```ts
expect(params.o1).toEqual(undefined);
expect(params.o2).not.toHaveBeenCalled();

fixture.point.componentInstance.o1.emit(1);
fixture.point.componentInstance.o2.emit(2);

expect(params.o1).toEqual(1);
expect(params.o2).toHaveBeenCalledWith(2);
```

## fixture.detectChanges

Varsayılan olarak `MockRender`, `fixture.detectChanges`'ı tetikler; bu nedenle kendiniz tetiklemek zorunda değilsiniz. Ancak, `fixture.detectChanges`'ı tetiklemeyi ertelemek gerekebilir.

Bunu yapmak için, `MockRender` seçeneklerinde `detectChanges`'ı `false` olarak ayarlamanız gerekir:

```ts
const fixture = MockRender(MyComponent, null /* veya undefined ya da params */, {
  detectChanges: false,
});

// ... bir sihir
fixture.detectChanges();
```
```ts
// ya da basitçe
const fixture = MockRender(MyComponent, null /* veya undefined ya da params */, false);
// ... bir sihir
fixture.detectChanges();
```

## Bir bileşenle örnek

```ts
const fixture = MockRender(AppComponent);

// ara katman bir bileşen, çoğunlukla gereksiz
fixture.componentInstance;

// AppComponent'in bir örneği
fixture.point.componentInstance;
```

## Bir direktifle örnek

```ts
const fixture = MockRender(AppDirective);

// ara katman bir bileşen, çoğunlukla gereksiz
fixture.componentInstance;

// AppDirective'in bir örneği
fixture.point.componentInstance;
```

## Bir pipe ile örnek

```ts
const fixture = MockRender(DatePipe, {
  $implicit: new Date(), // dönüştürülecek değer
});

// parametreleri yönetmek için bir ara katman bileşeni
fixture.componentInstance.$implicit.setHours(5);

// DatePipe'ın bir örneği
fixture.point.componentInstance;
```

```ts
const fixture = MockRender('{{ 3.99 | currency }}');

// bilinmeyen bir örnek
fixture.point.componentInstance;
```

## Bir servisle örnek

```ts
const fixture = MockRender(TranslationService);

// ara katman bir bileşen, çoğunlukla gereksiz
fixture.componentInstance;

// TranslationService'in bir örneği
fixture.point.componentInstance;
```

## Bir token ile örnek

```ts
const fixture = MockRender(APP_BASE_HREF);

// ara katman bir bileşen, çoğunlukla gereksiz
fixture.componentInstance;

// APP_BASE_HREF'in değeri
fixture.point.componentInstance;
```

## Özel bir şablonla örnek

```ts
// özel şablon
const fixture = MockRender<AppComponent>(
  `<app-component [header]="value | translate">
    özel gövde
  </app-component>`,
  { value: 'test' },
);

// ara katman bir bileşen, çoğunlukla gereksiz
fixture.componentInstance;

// AppComponent'in bir örneği
fixture.point.componentInstance;
```

## Sağlayıcılarla örnek

İstediğimizde, render için `providers` veya `viewProviders` belirtebiliriz; bunları 3. parametre aracılığıyla geçirebiliriz. Bu, **mock sistem token'ları/servisleri** sağlamak istediğimizde yararlıdır; örneğin `APP_INITIALIZER`, `DOCUMENT` vb.

```ts
const fixture = MockRender(
  ComponentToRender,
  {},
  {
    providers: [
      SomeService,
      {
        provide: DOCUMENT,
        useValue: MockService(Document),
      },
    ],
    providers: [MockProvider(OtherService, {
      serviceFlag: true,
    })],
  },
);
```

## İleri düzey örnek

:::tip
Lütfen, değerleri değiştirdiğimizde render'ı güncellemek için `fixture.detectChanges()` ve / veya `await fixture.whenStable()` çağırmayı unutmayın.
:::

Aşağıda **Angular testinde özel bir şablon render etmenin ileri düzey örneği** bulunmaktadır. Lütfen kodda yer alan yorumlara dikkat edin.

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockRender/test.spec.ts&initialpath=%3Fspec%3DMockRender)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockRender/test.spec.ts&initialpath=%3Fspec%3DMockRender)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockRender/test.spec.ts"
describe('MockRender', () => {
  // MockBuilder'ın promise'ını döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(TargetComponent, ChildModule));

  it('şablonu render eder', () => {
    const spy = jasmine.createSpy();
    // jest durumunda
    // const spy = jest.fn();

    const fixture = MockRender(
      `
        <target
          (trigger)="myListener1($event)"
          [value1]="myParam1"
          value2="check"
        >
          <ng-template #header>
            ng-template olarak bir şey
          </ng-template>
          ng-content olarak bir şey
        </target>
      `,
      {
        myListener1: spy,
        myParam1: 'something1',
      },
    );

    // ngMocks.input, sahibi bilinmeden
    // bir ilgili debugElement üzerindeki bir input'un mevcut değerini almasına yardımcı olur.
    expect(ngMocks.input(fixture.point, 'value1')).toEqual(
      'something1',
    );
    expect(ngMocks.input(fixture.point, 'value2')).toEqual('check');

    // ngMocks.output, çıktılar üzerinde aynı şeyi yapar.
    ngMocks.output(fixture.point, 'trigger').emit('foo1');
    expect(spy).toHaveBeenCalledWith('foo1');
  });

  it('inputs ve outputs'u otomatik olarak render eder', () => {
    const spy = jasmine.createSpy();
    // jest durumunda
    // const logoClickSpy = jest.fn();

    // Aşağıdaki gibi bir şablon oluşturur:
    // <target [value1]="value1" [value2]="value2"
    // (trigger)="trigger"></target>.
    const fixture = MockRender(TargetComponent, {
      trigger: spy,
      value1: 'something2',
    });

    // Girişleri kontrol etme.
    expect(ngMocks.input(fixture.point, 'value1')).toEqual(
      'something2',
    );
    expect(ngMocks.input(fixture.point, 'value2')).toEqual(
      'default2',
    );

    // Çıktıları kontrol etme.
    ngMocks.output(fixture.point, 'trigger').emit('foo2');
    expect(spy).toHaveBeenCalledWith('foo2');

    // güncellenmiş değerin test edilen bileşene geçirildiğini kontrol etme.
    fixture.componentInstance.value1 = 'updated';
    fixture.detectChanges();
    expect(ngMocks.input(fixture.point, 'value1')).toEqual('updated');
  });
});
```