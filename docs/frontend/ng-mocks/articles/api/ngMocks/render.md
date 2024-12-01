---
title: ngMocks.render
description: ng-mocks kütüphanesindeki `ngMocks.render` ile ilgili dokümantasyon. Bu içerik, `ngMocks.render` fonksiyonunun nasıl kullanılacağını ve çeşitli örnekler üzerinden açıklamalar sunmaktadır.
keywords: [ngMocks, render, TemplateRef, yapısal direktif, Angular]
---

`ngMocks.render`, **tüm sorgular** üzerinden geçer, örneğin `ContentChild` ve `ContentChildren`, ilgili `TemplateRef` veya bir **yapısal direktif** bulmaya çalışır ve bunu verilen bağlam ile render eder.

:::tip
Onları gizlemek için `ngMocks.hide` kullanın.
:::

```ts
ngMocks.render(declarationInst, templateRef);
ngMocks.render(declarationInst, templateRef, context);
ngMocks.render(declarationInst, templateRef, context, variables);
```

```ts
ngMocks.render(declarationInst, debugNode);
ngMocks.render(declarationInst, debugNode, context);
ngMocks.render(declarationInst, debugNode, context, variables);
```

```ts
ngMocks.render(declarationInst, structuralDir);
ngMocks.render(declarationInst, structuralDir, context);
ngMocks.render(declarationInst, structuralDir, context, variables);
```

- `declarationInst`, bir bileşen veya öznitelik direktifi örneği olmalıdır.
- `templateRef`, bir `TemplateRef` örneği olmalıdır.
- `structuralDir`, bir yapısal direktif örneği olmalıdır.
- `context`, isteğe bağlı bir bağlam değişkenidir.
- `variables`, ek bağlam değişkenleridir.

**Birinci** ve **ikinci** parametre **boş olamaz**.

- [CodeSandbox'da deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestTemplateRefByRender/test.spec.ts&initialpath=%3Fspec%3DTestTemplateRefByRender)
- [StackBlitz'de deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestTemplateRefByRender/test.spec.ts&initialpath=%3Fspec%3DTestTemplateRefByRender)

---

## TemplateRef / ng-template Render Etme

Bir `TemplateRef` / `ng-template` render etmek için 2 şeye ihtiyacımız var:

- sorguya işaret eden bir değişken
- şablona işaret eden bir değişken

İlk görev, `ngMocks.find` veya `ngMocks.findInstance` ile çözülebilir, ikinci görev ise `ngMocks.findTemplateRef` ile çözülebilir.

Farz edelim ki, aşağıdaki şablona sahibiz:

```html
<xd-card>
  <ng-template #id let-label="label">
    rendered-id-{{ label }}
  </ng-template>
  
  <ng-template myTpl="header" let-label>
    rendered-header-{{ label }}
  </ng-template>
  
  <span my-tpl *myTpl="'footer'; let label">
    rendered-footer-{{ label }}
  </span>
</xd-card>
```

### Bileşen işaretçisi

`xd-card` bileşenini bulalım:

```ts
const xdCardEl = ngMocks.find('xd-card');
```

Veya sınıfını kullanabiliriz:

```ts
const xdCardEl = ngMocks.find(XdCardComponent);
```

**Lütfen unutmayın**, bu sadece bir bileşen örneği değil, aynı zamanda bir **özellik direktifi** örneği de olabilir.

### Şablon işaretçisi

Şimdi, 3 şablonu bulalım:

```ts
const tplId = ngMocks.findTemplateRef(
  xdCardEl,
  // şablonun id'si
  'id',
);

const tplHeader = ngMocks.findTemplateRef(
  xdCardEl,
  // şablondaki öznitelik ve değer
  ['myTpl', 'header'],
);

const tplFooter = ngMocks.findTemplateRef(
  xdCardEl,
  // şablondaki öznitelik ve değer
  ['myTpl', 'footer'],
);
```

:::info
`tplFooter`'ı `my-tpl` ile bulamayacağımıza dikkat edin, çünkü `*myTpl` sözdizim şekeri ve `my-tpl`, istenen şablona **ait değildir**, ancak onun içindeki `span`'a aittir.
:::

### Id'yi Render Etme

Bir **mock bileşeninin** `TemplateRef`'sini render etmek için, bunu `ngMocks.render`'ın **ikinci parametresi** olarak geçmemiz gerekiyor. Üçüncü ve dördüncü parametre, şablon için **bağlam sağlamada** kullanılır.

```ts
ngMocks.render(
  xdCardEl.componentInstance,
  tplId,
  undefined,
  {label: 'test'},
);
```

Artık render edilmiş html'i doğrulayabiliriz:

```ts
expect(xdCardEl.nativeElement.innerHTML)
  .toContain('rendered-id-test');
```

### Header'ı Render Etme

İşlem yukarıdakilerle aynıdır:

```ts
ngMocks.render(
  xdCardEl.componentInstance,
  tplHeader,
  'test',
);
expect(xdCardEl.nativeElement.innerHTML)
  .toContain('rendered-header-test');
```

### Footer'ı Render Etme

İşlem yukarıdakilerle aynıdır:

```ts
ngMocks.render(
  xdCardEl.componentInstance,
  tplFooter,
  'test',
);
expect(xdCardEl.nativeElement.innerHTML)
  .toContain('<span my-tpl=""> rendered-footer-test </span>');
```

---

## Yapısal Direktifleri Render Etme

`ngMocks.render`, yalnızca `TemplateRef`'leri değil, aynı zamanda yapısal direktifleri de render eder.

Tüm `MyTplDirective` örneklerini bulalım.

```ts
const [header, footer] = ngMocks.findInstances(
  xdCardEl,
  MyTplDirective,
);
```

Çünkü bunlar yapısal direktiflerdir, 2 seçeneğimiz vardır:

- bileşenden render etmek
- doğrudan render etmek

:::warning
**Fark**, birinci seçeneğin bileşenin direktife erişebilmesi için **bağlı sorgular** garanti etmesidir.
:::

### Sorgular aracılığıyla

Sorguları doğrulamak için, bileşeni ilk parametre olarak, ve **istenen yapısal direktifi** ikinci parametre olarak geçmemiz gerekiyor.

```ts
ngMocks.render(xdCardEl.componentInstance, header, 'test');
expect(xdCardEl.nativeElement.innerHTML)
  .toContain('rendered-header-test');
```

### Doğrudan

Bir **yapısal direktifi doğrudan** render etmek için, bunun örneğini `ngMocks.render`'ın ilk ve **ikinci parametresi** olarak geçmemiz gerekiyor.

```ts
ngMocks.render(footer, footer, 'test');
expect(xdCardEl.nativeElement.innerHTML)
  .toContain('rendered-footer-test');
```

---

## Derinlemesine İç İçe Şablonlar

Herhangi bir `TemplateRef` veya yapısal direktifi **herhangi bir derinlikte** render etmek mümkündür, tek gereklilik, istenen örnekten ulaşmak için **yeterli sorgulara** sahip olmaktır.

Aşağıdaki şablonu düşünelim:

```html
<xd-card>
  <xd-header>
    <xd-cell>
      <ng-template icon>(i)</ng-template>
    </xd-cell>
  </xd-header>
</xd-card>
```

Eğer `xdCard` bileşen örneğine işaret ediyorsa ve `icon` içteki `ng-template`'ye işaret ediyorsa, şöyle render edebiliriz:

```ts
ngMocks.render(xdCard, icon);
```

:::note
Burada yararlı olan şey, bir sorgu, öğeler arasında kaldırılırsa, render işleminin başarısız olacağıdır.
:::