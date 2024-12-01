---
description: Bu belge, Angular uygulamalarında @angular/material (Angular Material) kullanımını test etme yöntemlerini kapsamlı bir şekilde ele almaktadır. 'mat-table' kullanarak bir bileşenin nasıl test edileceğine dair örnekler ve öneriler içermektedir.
keywords: [Angular, Angular Material, mat-table, test, bileşen, ng-mocks, JavaScript]
---

`Angular Material`, birçok UI bileşenine sahip bir UI kütüphanesidir.  
Aşağıda, `Angular Material` kullanan bir bileşenin nasıl test edileceğine dair bilgiler bulabilirsiniz.

Bir sonraki örnek, `mat-table` kullanımı üzerine olacak.  
Bir bileşenin `mat-table`'ı şu şekilde kullandığını varsayalım:

```html
<table mat-table [dataSource]="dataSource">
  <!-- Position Column -->
  <ng-container matColumnDef="position">
    <th mat-header-cell *matHeaderCellDef>No.</th>
    <td mat-cell *matCellDef="let element">
      {{ element.position }}
    </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr
    mat-row
    *matRowDef="let row; columns: displayedColumns"
  ></tr>
</table>
```

Bu tür bir şablonun testi için:

- `mat-table`'ı sahtelemek
- geçirilen girişleri doğrulamak
- Position sütunu için şablonları doğrulamak
- Diğer şablonları doğrulamak

:::note
`ng-template` ve onun `TemplateRef`'i hakkında bilgi `ngMocks.render` dökümanından alınmıştır.
:::

## Spec dosyası

`MockBuilder` ile, spec dosyamızda sahtelemeleri sağlamak için tek bir satıra ihtiyacımız var:

```ts
beforeEach(() => MockBuilder(TargetComponent, TargetModule));
```

Burada `TargetComponent`, `mat-table` kullanan bir bileşendir ve `TargetModule`, onun modülüdür.

## mat-table'ın girişlerini test etme

Bu testte, `mat-table` verisinin bileşen örneğimizden geldiğini doğrulamamız gerekiyor.

Gerekli `ng-mocks` araçları:

- `MockRender`: `TargetComponent`'ı oluşturmak ve onun örneğini almak için
- `ngMocks.reveal`: `MatTable`'ın debug elemanını bulmak için
- `ngMocks.input`: bir girişin değerini almak için

```ts
it('binds inputs', () => {
  // TargetComponent'ı render ediyor ve onun örneğine erişiyoruz.
  const targetComponent =
    MockRender(TargetComponent).point.componentInstance;

  // `MatTable`'ın debug elemanını arıyoruz.
  const tableEl = ngMocks.reveal(['mat-table']);

  // Bağlı özellikleri doğruluyoruz.
  expect(ngMocks.input(tableEl, 'dataSource')).toBe(
    targetComponent.dataSource,
  );
});
```

## matColumnDef ve matCellDef şablonlarını test etme

`ng-template`'i test etmek için, `matColumnDef` ve `matCellDef` niteliklerine ait olan `TemplateRef`'i bulmalı, onları render etmeli ve oluşturulan html'i doğrulamalıyız.

Gerekli `ng-mocks` araçları:

- `MockRender`: `TargetComponent`'ı oluşturmak ve onun örneğini almak için
- `ngMocks.reveal`: `mat-table` ve `ng-container` debug elemanlarını bulmak için
- `ngMocks.formatHtml`: bir `ng-container`'ın html'ini almak için
- `ngMocks.render`: şablonları render etmek için

```ts
it('provides correct template for matColumnDef="position"', () => {
  MockRender(TargetComponent);
  // tabloyu ve konteyneri arıyoruz.
  const tableEl = ngMocks.reveal(['mat-table']);
  const containerEl = ngMocks.reveal(['matColumnDef', 'position']);

  // çevresinde hiçbir kalıntı olmadığını kontrol ediyoruz.
  expect(ngMocks.formatHtml(containerEl)).toEqual('');

  // başlığı kontrol etme
  const headerEl = ngMocks.reveal(containerEl, [
    'matHeaderCellDef',
  ]);
  ngMocks.render(tableEl.componentInstance, headerEl);
  expect(ngMocks.formatHtml(headerEl)).toEqual(
    '<th mat-header-cell="">No.</th>',
  );

  // hücreyi kontrol etme
  const cellEl = ngMocks.reveal(containerEl, ['matCellDef']);
  ngMocks.render(tableEl.componentInstance, cellEl, {
    position: 'testPosition',
  });
  expect(ngMocks.formatHtml(cellEl)).toEqual(
    '<td mat-cell=""> testPosition </td>',
  );
});
```

## mat-header-row şablonunu test etme

`mat-header-row`'u test etme yaklaşımı yukarıdakilerle aynıdır.

Hangi direktifin `mat-header-row`'a ait olduğunu bulmamız gerekiyor, o da `MatHeaderRowDef`dir.

Gerekli `ng-mocks` araçları:

- `ngMocks.findInstance`: `MatHeaderRowDef` örneğini bulmak için

```ts
it('provides correct template for mat-header-row', () => {
  const targetComponent =
    MockRender(TargetComponent).point.componentInstance;
  const tableEl = ngMocks.reveal(['mat-table']);

  // çevresinde hiçbir kalıntı olmadığını kontrol ediyoruz.
  expect(ngMocks.formatHtml(tableEl)).toEqual('');

  const header = ngMocks.findInstance(tableEl, MatHeaderRowDef);
  expect(header.columns).toBe(targetComponent.displayedColumns);
  ngMocks.render(tableEl.componentInstance, header);
  expect(ngMocks.formatHtml(tableEl)).toContain(
    '<tr mat-header-row=""></tr>',
  );
});
```

## mat-row şablonunu test etme

`mat-row`'ı test etme yaklaşımı yukarıdakilerle aynıdır.

Hangi direktifin `mat-row`'a ait olduğunu bulmamız gerekiyor, o da `MatRowDef`dir.

```ts
it('provides correct template for mat-row', () => {
  const targetComponent =
    MockRender(TargetComponent).point.componentInstance;
  const tableEl = ngMocks.reveal(['mat-table']);

  // çevresinde hiçbir kalıntı olmadığını kontrol ediyoruz.
  expect(ngMocks.formatHtml(tableEl)).toEqual('');

  const row = ngMocks.findInstance(tableEl, MatRowDef);
  expect(row.columns).toBe(targetComponent.displayedColumns);
  ngMocks.render(tableEl.componentInstance, row);
  expect(ngMocks.formatHtml(tableEl)).toContain(
    '<tr mat-row=""></tr>',
  );
});