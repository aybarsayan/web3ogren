---
title: ngMocks Ad Alanına Giriş
description: ngMocks nesnesine ve amacına giriş. Bu belge, ngMocks ad alanının temel işlevlerini ve yardımcı özelliklerini anlamanızı sağlayacak ve kullanımınıza dair önemli ipuçları sunacaktır.
keywords: [ngMocks, mock, test, simülasyon, Angular, yardımcı işlevler]
---

**ngMocks**, mock'ları özelleştirmeyi, istenen öğelere ve örneklere erişimi sağlayan çeşitli yardımcı işlevler sunan bir ad alanıdır.

## Mock davranışını özelleştirme

- `defaultMock()`

:::tip
Mock davranışını özelleştirirken, kullanılan yöntemlerin özelliklerini dikkate almak önemlidir.
:::

- `globalExclude()`
- `globalKeep()`
- `globalMock()`
- `globalReplace()`
- `globalWipe()`

## Form kontrol olaylarını simüle etme

- `change()`
- `touch()`

## HTML olaylarını simüle etme

- `click()`
- `trigger()`
- `event()`

## `ng-template` ile etkileşim

- `render()`
- `hide()`

## Öğelere ve örneklere erişim

- `input()`
- `output()`

:::info
Öğelere ve örneklere erişim, test işlemlerinde kritik bir adımdır.
:::

* `find()`
* `findAll()`

- `reveal()`
- `revealAll()`

* `get()`
* `findInstance()`
* `findInstances()`

- `findTemplateRef()`
- `findTemplateRefs()`

* `crawl()`

## Metodları ve özellikleri stub'lama

- `stub()`
- `stubMember()`

## Testler için yardımcılar

- `guts()`
- `faster()`

:::warning
Test süreçlerinde kullanılan yardımcıların doğru bir şekilde yapılandırılması, testlerin güvenilirliğini artırır.
:::

- `ignoreOnConsole()`
- `throwOnConsole()`
- `formatHtml()`
- `formatText()`

* `flushTestBed()`
* `reset()`

> "ngMocks ad alanı, Angular uygulamalarında test süreçlerini kolaylaştırarak geliştiricilerin işini büyük ölçüde basitleştirir."  
> — ngMocks Kullanım Kılavuzu