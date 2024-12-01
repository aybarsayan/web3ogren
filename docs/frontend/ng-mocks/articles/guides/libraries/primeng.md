---
description: PrimeNG bileşenlerinin test edilme yöntemlerini ve en iyi uygulamaları inceleyin. Bu içerik, ng-mocks kullanarak bileşenlerin nasıl taklit edileceği ve test edileceği üzerine bilgiler sunmaktadır.
keywords: [PrimeNG, ng-mocks, test, bileşen, örnek, Angular]
---

`PrimeNG`, geniş bir UI bileşenleri sunar. Bu bileşenlerin uygulamaya entegrasyonunu test etmenin en iyi yolu, bunları `ng-mocks` ile taklit etmek ve `inputs` / `outputs`'ın doğru şekilde bağlandığını doğrulamaktır. Ayrıca bir bileşen şablonları destekliyorsa, doğru olanların alınıp alınmadığını kontrol etmeliyiz.

> **Önemli Not:** Eğer bir bileşen `p-calendar` bileşenini kullanıyorsa ve şablonu şu şekildedir:
> 
> ```html
> <p-calendar [(ngModel)]="dateValue">
>   <ng-template pTemplate="header">Header</ng-template>
>   <ng-template pTemplate="footer">Footer</ng-template>
> </p-calendar>
> ```
> 
> Bunu test etmek için şunları yapmalıyız:
> - `p-calendar`'ı taklit et
> - Geçilen girişleri doğrula
> - Çıktılardaki dinleyicileri doğrula
> - Şablonları doğrula

:::note
`ng-template` ve onun `TemplateRef`'i ile ilgili test bilgileri `ngMocks.render` belgesinden alınmıştır.
:::

---

## Spec dosyası

`MockBuilder` ile, spec dosyamızda taklitleri sağlamak için tek bir satır gereklidir:

```ts
beforeEach(() => MockBuilder(TargetComponent, TargetModule));
```

Burada, `TargetComponent`, `p-calendar`'ı kullanan bir bileşendir; `TargetModule` ise onun modülüdür.

---

## p-calendar girişlerini test etme

Gerekli `ng-mocks` araçları:

- `MockRender`: `TargetComponent`'i render etmek ve örneğini almak için
- `ngMocks.find`: `p-calendar`'a ait bir debug öğesini bulmak için
- `ngMocks.input`: bir girişin değerini almak için

```ts
it('girişleri bağlar', () => {
  // TargetComponent'i render ediyor ve örneğini alıyoruz.
  const targetComponent =
    MockRender(TargetComponent).point.componentInstance;

  // `p-calendar`'a ait bir debug öğesi arıyoruz.
  const calendarEl = ngMocks.find('p-calendar');

  // Bağlı özellikleri doğruluyoruz.
  const actual = ngMocks.input(calendarEl, 'ngModel');
  expect(actual).toBe(targetComponent.dateValue);
});
```

:::tip
Giriş bağlama süreçlerinde, bileşenin beklenen davranış gösterdiğinden emin olun.
:::

---

## p-calendar çıktılarının test edilmesi

Gerekli `ng-mocks` araçları:

- `MockRender`: `TargetComponent`'i render etmek ve örneğini almak için
- `ngMocks.find`: `p-calendar`'a ait bir debug öğesini bulmak için
- `ngMocks.output`: bir çıktının `EventEmitter`'ını almak için

```ts
it('çıktıları bağlar', () => {
  // TargetComponent'i render ediyor ve örneğini alıyoruz.
  const targetComponent =
    MockRender(TargetComponent).point.componentInstance;

  // `p-calendar`'a ait bir debug öğesi arıyoruz.
  const calendarEl = ngMocks.find('p-calendar');

  // Bir emiti simüle ediyoruz.
  const expected = new Date();
  ngMocks.output(calendarEl, 'ngModelChange').emit(expected);

  // Emit'in etkisini doğruluyoruz.
  expect(targetComponent.dateValue).toEqual(expected);
});
```

:::info
Çıktılar üzerinde yapılan testler, bileşenlerin kullanıcı etkileşimlerine tepkilerini değerlendirir.
:::

---

## pTemplate="header" şablonunu test etme

`ng-template`'i test etmek için, sağlanan değerle `pTemplate` özniteliğine ait `TemplateRef`'i bulmalı, render etmeli ve render edilen HTML'yi doğrulamalıyız.

Gerekli `ng-mocks` araçları:

- `MockRender`: `TargetComponent`'i render etmek ve örneğini almak için
- `ngMocks.find`: `p-calendar`'a ait bir debug öğesini bulmak için
- `ngMocks.findTemplateRef`: `pTemplate`'e ait bir şablonu bulmak için
- `ngMocks.render`: şablonu render etmek için

```ts
it('pTemplate="header" için doğru şablonu sağlar', () => {
  // TargetComponent'i render ediyoruz.
  MockRender(TargetComponent);

  // `p-calendar`'a ait bir debug öğesi arıyoruz.
  const calendarEl = ngMocks.find('p-calendar');

  // 'header' şablonunu arıyoruz.
  const header = ngMocks.findTemplateRef(calendarEl, [
    'pTemplate',
    'header',
  ]);

  // Direktiv içeriğinin taklit edildiğini doğruluyoruz.
  // Ve render ediyoruz.
  ngMocks.render(calendarEl.componentInstance, header);

  // Render edilen şablonu doğruluyoruz.
  expect(calendarEl.nativeElement.innerHTML).toContain('Header');
});
```

:::warning
Şablonların doğru bir şekilde render edildiğinden emin olun; aksi takdirde beklenmedik davranışlar meydana gelebilir.
:::

---

## pTemplate="footer" şablonunu test etme

`pTemplate="footer"`'ı test etme yaklaşımı yukarıdakiyle aynıdır.

```ts
it('pTemplate="footer" için doğru şablonu sağlar', () => {
  // TargetComponent'i render ediyoruz.
  MockRender(TargetComponent);

  // `p-calendar`'a ait bir debug öğesi arıyoruz.
  const calendarEl = ngMocks.find('p-calendar');

  // 'footer' şablonunu arıyoruz.
  const footer = ngMocks.findTemplateRef(calendarEl, [
    'pTemplate',
    'footer',
  ]);

  // Direktiv içeriğinin taklit edildiğini doğruluyoruz.
  // Ve render ediyoruz.
  ngMocks.render(calendarEl.componentInstance, footer);

  // Render edilen şablonu doğruluyoruz.
  expect(calendarEl.nativeElement.innerHTML).toContain('Footer');
});