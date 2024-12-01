---
title: ngMocks.trigger
description: ngMocks.trigger hakkında, birim testlerinde her türlü olayın tetiklenmesi için basit bir arayüze sahip bir araç. Bu içerik, farklı olayların nasıl tetikleneceğini ve bunların test süreçlerinde nasıl kullanılacağını açıklar.
keywords: [ngMocks, trigger, test, olay, birim testi, Angular]
---

`ngMocks.trigger`, tüm olay çeşitlerini tetiklemeye ve özelliklerini özelleştirmeye olanak tanıyan basit bir arayüz sağlar.

## Yaygın olaylar

:::tip
Herhangi bir olay türünü tetiklemek için `ngMocks.trigger` kullanılabilir.
:::

Örneğin, bir odak olayı şu şekilde tetiklenebilir:

```ts
const el = ngMocks.find('input');
ngMocks.trigger(el, 'focus');
ngMocks.trigger(el, 'blur');
ngMocks.trigger(el, 'mouseleave', {
  x: 1,
  y: 2,
});
```

ya da `ngMocks.find` tarafından desteklenen seçicilerle basitçe.

```ts
ngMocks.trigger('input[name="address"]', 'focus');
ngMocks.trigger(['name', 'address'], 'blur');
```

## Tuş kombinasyonları

:::info
Kısa tuşları simüle etmek ve bunların işleyicilerini test etmek için, örneğin `Control+Shift+Z`, `ngMocks.trigger` yöntemi kullanılabilir.
:::

```ts
const el = ngMocks.find('input');
ngMocks.trigger(el, 'keydown.control.shift.z');
ngMocks.trigger(el, 'keyup.meta.s');
```

## Özel olaylar

:::note
Bir olay adı yerine bir olay nesnesi geçirilebilir. Bu, daha özel durumları simüle etmek için yararlıdır.
:::

Bir olay nesnesi oluşturmak için `ngMocks.event` kullanılabilir.

```ts
const el = ngMocks.find('input');
const event = new CustomEvent('my-event');
ngMocks.trigger(el, event);
```