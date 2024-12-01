---
title: isNgDef
description: ng-mocks kütüphanesinden isNgDef hakkında belge. Bu içerik, `isNgDef` fonksiyonunun sınıf süslemesiyle ilgili kullanımını detaylandırmaktadır. Ayrıca, sınıfın türünü belirlemek için uygulanan çeşitli kontrolleri içermektedir.
keywords: [ng-mocks, isNgDef, Angular, sınıf, süsleme, bileşen, direktif]
---

`isNgDef`, bir sınıfın nasıl süslendiğini doğrular.

:::tip
`isNgDef` fonksiyonunun kullanımını anlamak, Angular uygulamalarının bileşenlerini ve diğer yapı taşlarını etkili bir şekilde yönetmek için önemlidir.
:::

```ts
if (isNgDef(SomeClass, 'm')) {
  // SomeClass bir modüldür
}

if (isNgDef(SomeClass, 'c')) {
  // SomeClass bir bileşendir
}

if (isNgDef(SomeClass, 'd')) {
  // SomeClass bir direktiftir
}

if (isNgDef(SomeClass, 'p')) {
  // SomeClass bir borudur
}

if (isNgDef(SomeClass, 'i')) {
  // SomeClass bir servistir
}

if (isNgDef(SomeClass, 't')) {
  // SomeClass bir token'dır
}

if (isNgDef(SomeClass)) {
  // SomeClass bir modül veya bileşen veya direktif veya boru veya hizmettir
}
```

:::info
`isNgDef` fonksiyonu, sınıf türünü belirlemek için kullanılan etkin bir yöntemdir. Yukarıdaki koşullar, bilinçli kararlar vermenizi sağlar.
:::

--- 

### Kullanım Örnekleri

`isNgDef` fonksiyonu çeşitli türlerdeki Angular bileşenlerini belirlemek için kullanılabilir:

- **Modül Kontrolü:** 
  `isNgDef(SomeClass, 'm')`
  
- **Bileşen Kontrolü:** 
  `isNgDef(SomeClass, 'c')`
  
- **Direktif Kontrolü:** 
  `isNgDef(SomeClass, 'd')`
  
- **Boru Kontrolü:** 
  `isNgDef(SomeClass, 'p')`

:::note
Angular uygulamalarında doğru yapı taşlarının kullanılmasını sağlamak için bu kontrollerin yapılması önemlidir. Uygulamanız için doğru bileşeni seçtiğinizden emin olun.
:::