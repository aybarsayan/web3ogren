---
title: ngMocks.formatHtml
description: ng-mocks kütüphanesinden ngMocks.formatHtml hakkında dokümantasyon. Bu döküman, ngMocks.formatHtml fonksiyonunun nasıl çalıştığı ve kullanım örneklerini içermektedir. HTML'yi daha basit hale getirerek testlerde kullanılmasını ve anlaşılmasını kolaylaştırır.
keywords: [ngMocks, formatHtml, HTML normalizasyon, Angular, test, test araçları, ng-container]
---

`ngMocks.formatHtml`, testlerde daha basit HTML beklentileri sağlamak için HTML'yi normalize etmeyi amaçlamaktadır.

```ts
const element = document.createElement('div');

// varsayılan mod
ngMocks.formatHtml(element); // boş

// dış mod
ngMocks.formatHtml(element, true); // <div></div>
```

`ngMocks.formatHtml`, aşağıdakileri kaldırır:
- tüm HTML yorumları
- boşluk, yeni satır, sekme dizileri tek bir boşluk sembolü ile değiştirilir
- kardeşler arasındaki boşluklar kaldırılır, yani ` ` `` haline gelir

:::tip 
`ngMocks.formatHtml`, aşağıdaki türlerden birini kabul eder: bir dize, `HTMLElement`, `Text`, `Comment`, `DebugElement`, `DebugNode`, `ComponentFixture` veya bunların bir dizisi.
:::

## kirli html

şu şekilde bir HTML

```html
<div>
  <!-- binding1 -->
  <strong>header</strong>
  <!-- binding2 -->
  <ul>
    <li>1</li>
    <li>2</li>
  </ul>
  <!-- binding3 -->
</div>
```

şuna dönüşür

```html
<div><strong>header</strong><ul><li>1</li><li>2</li></ul></div>
```

## ng-container

Güzel bir şey, `ngMocks.formatHtml`'nin arka planda `ngMocks.crawl` kullanmasıdır ve `ng-container`'a saygı göstermesidir.

:::info
Bu yüzden `ng-container`'a bir gösterimimiz varsa, içeriğini belirleme yapabiliriz.
:::

```html
<div>
  header
  <ng-container block1>1</ng-container>
  body
  <ng-container block2>2</ng-container>
  footer
</div>
```

```ts
const div = ngMocks.find('div');
const block1 = ngMocks.reveal(div, ['block1']);
const block2 = ngMocks.reveal(div, ['block2']);

ngMocks.formatHtml(div, true);
// döner
// <div> headaer 1 body 2 footer </div>

ngMocks.formatHtml(block1);
// döner
// 1
ngMocks.formatHtml(block2);
// döner
// 2
```