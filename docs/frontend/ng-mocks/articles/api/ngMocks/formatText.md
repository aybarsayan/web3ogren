---
title: ngMocks.formatText
description: ng-mocks kütüphanesindeki ngMocks.formatText ile ilgili belgeler, testlerde daha basit metin beklentileri sağlamak amacıyla kullanılan bir araçtır. HTML etiketlerini temizleyerek ve boşlukları normalleştirerek daha okunabilir metin çıktıları oluşturur.
keywords: [ngMocks, formatText, HTML, test, metin, Angular, normalizasyon]
---

`ngMocks.formatText`, testlerde **daha basit metin beklentileri** sağlamak için `textContent`'ı normalleştirmek amacıyla tasarlanmıştır.

`ngMocks.formatText` şunları kaldırır:
- tüm html yorumları
- tüm html etiketleri
- boşluklar, yeni satırlar, sekmeler dizileri tek bir boşluk sembolü ile değiştirilir

`ngMocks.formatText` şunları kabul eder:
- bir dize
- `HTMLElement`, `Text`, `Comment`
- `DebugElement`, `DebugNode`, `ComponentFixture`
- bunların bir dizisi

## kirli html

Bir HTML şöyle:

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

Şuna dönüşür:

```html
header 12
```

## ng-container

:::info
Harika bir şey, `ngMocks.formatText`'in arka planda `ngMocks.crawl` kullanması ve `ng-container`'a saygı duymasıdır.
:::

Bu nedenle, `ng-container`'a bir işaretçimiz varsa, içeriğini doğrulayabiliriz.

```html
<div>
  &lt;
  <ng-container block1>1</ng-container>
  &amp;
  <ng-container block2>2</ng-container>
  &gt;
</div>
```

```ts
const div = ngMocks.find('div');
const block1 = ngMocks.reveal(div, ['block1']);
const block2 = ngMocks.reveal(div, ['block2']);

ngMocks.format(div);
// geri döner
// < 1 & 2 >

ngMocks.formatHtml(block1);
// geri döner
// 1
ngMocks.formatHtml(block2);
// geri döner
// 2
```

:::tip
`ngMocks.formatText` kullanırken, temizlenen metin çıktılarını kontrol etmek için test senaryolarınıza dikkat edin.
:::