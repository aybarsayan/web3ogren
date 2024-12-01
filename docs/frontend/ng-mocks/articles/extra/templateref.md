---
title: Bir mock deklarasyonunun TemplateRef'inin nasıl render edileceği
description: Mock bileşeni veya direktifi ile ilişkili ng-şablonları ve yapısal direktiflerin nasıl render edileceği hakkında bilgi. Bu içerik, Angular'daki bileşenlerin test edilmesi için önemli bir kılavuz sunmaktadır.
keywords: [Angular, TemplateRef, ngMocks, bileşen testleri, şablonlar]
sidebar_label: TemplateRef Testi
---

:::warning Bu işlevsellik **kaldırılmıştır**

Lütfen şu yöntemleri kullanın:

- `ngMocks.render`
- `ngMocks.hide`

:::

Şablonlar genellikle **Angular Material**, **NG Bootstrap**, **PrimeNG**, **ng-select** gibi UI bileşen kütüphanelerinde kullanılır.  
Bu kütüphaneler, **özel tasarım** ile bir tablo veya takvim render etmek istediğimizde **şablonlar aracılığıyla esneklik** sağlar.

Genellikle yapısal bir direktif veya kimlikler kullanılarak tanımlanırlar:

```html
<!-- id -->
<ng-template #header>...</ng-template>

<!-- yapısal direktif -->
<ng-template pTemplate="header">...</ng-template>
<ng-template ng-label-tmp let-item="item">...</ng-template>

<!-- yapısal direktif -->
<tr *matHeaderRowDef="..."></tr>
```

## Çözüm

Bir testte, **gerekli verileri sağlamakla savaşmak** yerine, bileşenleri **mock** yapabiliriz ve giriş/çıkışlarının doğru bir şekilde bağlandığını doğrulayabiliriz.  
Ayrıca, **şablonların içeriğini istediğimiz gibi olduğunu** teyit edebiliriz, ama kütüphanenin ne zaman ve nasıl render ettiğini düşünmek istemiyoruz.

:::tip
Farklı UI kütüphaneleri için bazı **test örnekleri** bulunmaktadır:
- `ng-select`
- `Angular Material ve `mat-table`
- `PrimeNG ve `p-calendar`
Diğer kütüphaneler/bileşenler benzer şekilde test edilebilir.
:::

### Kimlikle Şablonlar

```html
<xd-card>
  <ng-template #header>Başlığım</ng-template>
  <ng-template #footer>Alt Bilgi</ng-template>
</xd-card>
```

Bu kod, `xd-card`'ın `ContentChild('header')` ve `ContentChild('footer')` kullanarak şablonları elde ettiğini belirtir.

Onlarla etkileşimde bulunmak için `ng-mock`, `__render(id, context?, additionalVars?)` ve `__hide(id)` fonksiyonlarını sağlar.

Bu örnek için, bizim yapmamız gerekenler:

1. bileşenin örneğini bulmak
2. onun mock yapıldığını doğrulamak
3. şablonları render etmek
4. içeriklerini doğrulamak

```ts
// örneği arama
const component = ngMocks.findInstance(XdCardComponent);

// bileşenin bir mock olduğunu kontrol etme
if (isMockOf(component, XdCardComponent, 'c')) {
  component.__render('header');
  component.__render('footer');
}

// başlığı doğrulama
const header = ngMocks.find('[data-key="header"]');
expect(header.nativeElement.innerHTML)
  .toContain('Başlığım');

// alt bilgiyi doğrulama
const footer = ngMocks.find('[data-key="footer"]');
expect(footer.nativeElement.innerHTML)
  .toContain('Alt Bilgi');
```

Bu kadar. Artık `xd-card` için şablonları doğrulayan bir testimiz var.

- [KodSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestTemplateRefById/test.spec.ts&initialpath=%3Fspec%3DTestTemplateRefById)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestTemplateRefById/test.spec.ts&initialpath=%3Fspec%3DTestTemplateRefById)

### Direktif ile Şablonlar

```html
<xd-card>
  <ng-template xdTpl="header">Başlığım</ng-template>
  <ng-template xdTpl="footer">Alt Bilgi</ng-template>
</xd-card>
```

Bu yaklaşım, `ng-şablonları` kimlikle render etmekten biraz farklıdır.  
Bu kod, `xd-card`'ın istenen şablonları elde etmek için `xdTpl` seçiciye sahip bir direktife güvendiğini belirtir.

Biz de öyle yapıyoruz. **Render, ilişkili bileşen** üzerinde değil, **ilişkili direktif** üzerinde temellidir. Bu nedenle, yapmamız gerekenler:

1. direktifleri bulmak
2. onların mock yapıldığını doğrulamak
3. şablonlarını render etmek
4. içeriklerini doğrulamak

:::info
Şu anda, bu o kadar da kolay değil.
Direktifi, sınıfını sağlayarak bulabiliriz, ama ne yazık ki, seçicisini kullanarak bulamıyoruz.
:::

Ancak, iyi bir haber var ki bu yakında değişecek.  
Lütfen bu GitHub konusunu takip edin: [seçici ile render](https://github.com/help-me-mom/ng-mocks/issues/292).

```ts
// istenen bileşen tarafından
// üretilen elementi arıyoruz
const container = ngMocks.find('xd-card');

// direktifleri alma
const [header, footer] = ngMocks.findInstances(
  container,
  XdTplDirective,
);

// başlığı doğrulama
expect(header.xdTpl).toEqual('header');
ngMocks.render(header, header);
expect(container.nativeElement.innerHTML)
  .toContain('Başlığım');

// alt bilgiyi doğrulama
expect(footer.xdTpl).toEqual('footer');
ngMocks.render(footer, footer);
expect(container.nativeElement.innerHTML)
  .toContain('Alt Bilgi');
```

Tamam. Artık `xd-card`'ın istenen şablonları aldığını doğrulayan bir testimiz var.

- [KodSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/TestTemplateRefByDirective/test.spec.ts&initialpath=%3Fspec%3DTestTemplateRefByDirective)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/TestTemplateRefByDirective/test.spec.ts&initialpath=%3Fspec%3DTestTemplateRefByDirective)

### Properties'de TemplateRef

Mock bileşeninin `TemplateRef`'ini render etmenin bir yol daha var -  
`ContentChild` veya `ContentChildren` ile süslenmiş bir özelliği bildiğimizde.

Örneğin, `XdCardComponent`'in tüm şablonları elde etmek için `tpls` özelliğinde `ContentChildren` kullandığını biliyoruz. 

```html
<xd-card>
  <ng-template xdTpl="header">Başlığım</ng-template>
  <ng-template xdTpl="footer">Alt Bilgi</ng-template>
</xd-card>
```

Sonra, özel bir `__render` metodu arayüzünü kullanabiliriz. Bunu yapmak için, ilk parametre olarak bir tuple sağlamalıyız.

```ts
ngMocks.render(component, ngMocks.findTemplateRef('header'));
```

Bu çağrı, `ContentChildren` ise tüm `QueryList`'i veya `ContentChild` ise `TemplateRef`'i render edecektir.

Sadece belirli bir elementi render etmek istiyorsak, tuplada onun indeksini geçebiliriz.

```ts
ngMocks.render(component, ngMocks.findTemplateRef('footer'));
```

Örnek yaklaşım, `hide` için de geçerlidir.

```ts
ngMocks.hide(component);
```

Şablonlar, `data-prop` özniteliğine sahip özel bir elementin altında render edilecektir.  
Onları sonraki sorgu ile bulabiliriz:

```ts
const element = ngMocks.find('[data-prop="tpls"]');
```