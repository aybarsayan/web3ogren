---
title: Angular uygulamalarında ng-select kullanımını test etme
description: Bu kılavuz, Angular uygulamalarında `ng-select` bileşeninin test edilmesi için gerekli adımları açıklamaktadır. Yıllara göre düzgün bir şekilde yapılandırılmış test senaryoları ile `ng-select`'in nasıl kullanılacağını öğrenin.
keywords: [Angular, ng-select, test, MockBuilder, TemplateRef]
---

`ng-select`'i test etmek için doğru `inputs` / `outputs` değerlerini geçirdiğimizden emin olmalıyız. Bunun yanı sıra, `ng-select`'i özelleştiriyorsak `ng-templates`'i de doğrulamalıyız.

Bir bileşenin şablonunun `ng-select`'i şu şekilde kullandığını hayal edelim:

```html
<ng-select
  [items]="cities"
  groupBy="avatar"
  [(ngModel)]="selectedCity"
  bindLabel="name"
  bindValue="name"
>
  <!-- ng-label-tmp şablonu -->
  <ng-template ng-label-tmp let-item="item">
    <strong>{{ item.name }}</strong>
  </ng-template>

  <!-- ng-optgroup-tmp şablonu -->
  <ng-template ng-optgroup-tmp let-item="item" let-index="index">
    {{ index }}
    <img [src]="item.avatar" [alt]="item.name" />
  </ng-template>

  <!-- ng-option-tmp şablonu -->
  <ng-template
    ng-option-tmp
    let-item="item"
    let-index="index"
    let-search="searchTerm"
  >
    <span class="ng-option-tmp">
      {{ search }} {{ item.name }}
    </span>
  </ng-template>
</ng-select>
```

Bu nedenle, bunu test etmek için şunları yapmalıyız:

- `ng-select`'i taklit et
- Geçilen girişleri kontrol et
- Çıktılar üzerindeki dinleyicileri kontrol et
- Şablonları kontrol et

:::note
`ng-template` ve onun `TemplateRef`'i hakkında bilgi `ngMocks.render` kaynağından alınmıştır.
:::

## Spec dosyası

Her şeyin yanı sıra bileşenimizi taklit etmenin en iyi yolu `MockBuilder` kullanmaktır. Bileşenin adının `TargetComponent` ve ait olduğu modülün adının `TargetModule` olduğunu varsayalım.

O zaman `beforeEach`'imiz şu şekilde görünmelidir:

```ts
beforeEach(() => MockBuilder(TargetComponent, TargetModule));
```

---

## ng-select girişlerini test etme

Bileşenin şablonuna dayanan `ng-select` üzerinde bağladığımız 5 girdi var:

2'si bileşen örneğinin özelliklerine bağlıdır:

- items
- ngModel

3'ü statik:

- groupBy
- bindLabel
- bindValue

Bu nedenle, bir test yazmak için şunları kullanmalıyız:

- `MockRender`: `TargetComponent`'i render etmek ve örneğini almak için
- `ngMocks.find`: `NgSelectComponent`'e ait bir debug elementini bulmak için
- `ngMocks.input`: bir girdinin değerini almak için

```ts
it('binds inputs', () => {
  // TargetComponent'i render etme ve örneğine erişme.
  const targetComponent =
    MockRender(TargetComponent).point.componentInstance;

  // ng-select'in bir debug elementini arama.
  const ngSelectEl = ngMocks.find('ng-select');

  // Bağlı özellikleri kontrol etme.
  expect(ngMocks.input(ngSelectEl, 'items')).toBe(
    targetComponent.cities,
  );
  expect(ngMocks.input(ngSelectEl, 'ngModel')).toBe(
    targetComponent.selectedCity,
  );

  // Statik özellikleri kontrol etme.
  expect(ngMocks.input(ngSelectEl, 'groupBy')).toEqual('avatar');
  expect(ngMocks.input(ngSelectEl, 'bindLabel')).toEqual('name');
  expect(ngMocks.input(ngSelectEl, 'bindValue')).toEqual('name');
});
```

---

## ng-select çıktısını test etme

`ng-select` üzerinde bağladığımız 1 çıktı var. Angular isimlendirme kuralına göre, `[(ngModel)]` için çıktı adı `ngModelChange`'dir.

Bunu testle dönüştürmek için şunları kullanmalıyız:

- `MockRender`: `TargetComponent`'i render etmek ve örneğini almak için
- `ngMocks.find`: `NgSelectComponent`'e ait bir debug elementini bulmak için
- `ngMocks.output`: bir çıktının `EventEmitter`'ını almak için

```ts
it('binds outputs', () => {
  // TargetComponent'i render etme ve örneğine erişme.
  const targetComponent =
    MockRender(TargetComponent).point.componentInstance;

  // ng-select'in bir debug elementini arama.
  const ngSelectEl = ngMocks.find('ng-select');

  // Bir emit simülasyonu yapma.
  ngMocks.output(ngSelectEl, 'ngModelChange').emit('test');

  // Emit'in etkisini kontrol etme.
  expect(targetComponent.selectedCity).toEqual('test');
});
```

---

## ng-label-tmp şablonunu test etme

`ng-select` şablonunu test etmek için, `ng-select`'in bir debug elementini bulmamız, ardından `ng-label-tmp`'e ait bir şablonu bulmamız ve uygun bir bağlam ile render etmemiz gerekiyor.

Bir test yazmak için şunları kullanmalıyız:

- `MockRender`: `TargetComponent`'i render etmek ve örneğini almak için
- `ngMocks.find`: `NgSelectComponent`'e ait bir debug elementini bulmak için
- `ngMocks.findTemplateRef`: `ng-label-tmp`'e ait şablonu bulmak için
- `ngMocks.render`: şablonu render etmek için

```ts
it('provides correct template for ng-label-tmp', () => {
  // TargetComponent'i render etme.
  MockRender(TargetComponent);

  // ng-select'in bir debug elementini arama.
  const ngSelectEl = ngMocks.find('ng-select');

  // ng-label-tmp şablonunu arama
  const ngLabelTmp = ngMocks.findTemplateRef(
    ngSelectEl,
    // attr adı
    ['ng-label-tmp'],
  );

  // ngSelect'in ngLabelTmp'ye erişebildiğini doğrulama
  // ve render ettiğini kontrol etme.
  ngMocks.render(
    ngSelectEl.componentInstance,
    ngLabelTmp,
    {},
    // Bağlam değişkenlerini sağlama.
    { item: { name: 'test' } },
  );

  // Render edilen HTML'i kontrol etme.
  expect(ngSelectEl.nativeElement.innerHTML).toContain(
    '<strong>test</strong>',
  );
});
```

---

## ng-optgroup-tmp şablonunu test etme

`ng-optgroup-tmp`'yi test etme yaklaşımı yukarıdaki gibidir.

```ts
it('provides correct template for ng-optgroup-tmp', () => {
  // TargetComponent'i render etme ve örneğine erişme.
  MockRender(TargetComponent);

  // ng-select'in bir debug elementini arama.
  const ngSelectEl = ngMocks.find('ng-select');

  // ng-optgroup-tmp şablonunu arama
  const ngOptgroupTmp = ngMocks.findTemplateRef(
    ngSelectEl,
    // attr adı
    ['ng-optgroup-tmp'],
  );

  // ngSelect'in ngOptgroupTmp'ye erişebildiğini doğrulama
  // ve render ettiğini kontrol etme.
  ngMocks.render(
    ngSelectEl.componentInstance,
    ngOptgroupTmp,
    {},
    // Bağlam değişkenlerini sağlama.
    {
      index: 7,
      item: {
        avatar: 'test.jpeg',
        name: 'test',
      },
    },
  );

  // Render edilen HTML'i kontrol etme.
  expect(ngSelectEl.nativeElement.innerHTML).toContain(
    '7 <img src="test.jpeg" alt="test">',
  );
});
```

---

## ng-option-tmp şablonunu test etme

`ng-option-tmp`'yi test etme yaklaşımı yukarıdaki gibidir.

```ts
it('provides correct template for ng-option-tmp', () => {
  // TargetComponent'i render etme ve örneğine erişme.
  MockRender(TargetComponent);

  // ng-select'in bir debug elementini arama.
  const ngSelectEl = ngMocks.find('ng-select');

  // ng-option-tmp şablonunu arama
  const ngOptionTmp = ngMocks.findTemplateRef(
    ngSelectEl,
    // attr adı
    ['ng-option-tmp'],
  );

  // Örneğin taklit edildiğini doğrulama.
  // Ve istediğimiz TemplateRef'ye işaret eden 
  // özelliğini render etme.
  ngMocks.render(
    ngSelectEl.componentInstance,
    ngOptionTmp,
    {},
    // Bağlam değişkenlerini sağlama.
    {
      item: {
        name: 'test',
      },
      searchTerm: 'search',
    },
  );

  // Render edilen HTML'i kontrol etme.
  expect(ngSelectEl.nativeElement.innerHTML).toContain(
    '<span class="ng-option-tmp">search test</span>',
  );
});