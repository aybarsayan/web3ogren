---
title: Seçim İsteği
description: Bu belge, seçim isteği kullanımı ile ilgili teknik bir kılavuz sunmaktadır. Kullanıcılar özelleştirilmiş seçim nesnelerini ve sonuçları nasıl formatlayacaklarını öğrenebilirler.
keywords: [seçim, özelleştirilmiş gösterge, sonuç formatlama, çoklu seçim, kullanım örnekleri]
---

# Seçim İsteği

**Yapılacaklar**

- [ ] Özelleştirilmiş gösterge
- [ ] Özelleştirilmiş gösterge
- [ ] Seçimlerde tanımlanmış özelleştirilmiş gösterge
- [ ] Özelleştirilmiş semboller
- [ ] Seçim grupları
- [ ] Seçim grubu başlıkları
- [ ] Diğer istemlerle seçimleri doldurma
- [ ] Devre dışı seçimler
- [ ] Seçim rolleri
- [ ] Seçim ipuçları
- [ ] Zamanlayıcılar
- [ ] Asenkron seçimler

---

## Seçenekler

Yapılacaklar

---

## Kullanım örnekleri

Yapılacaklar

### Sonucu Özelleştir

:::tip
Varsayılan olarak, seçim istemi kullanıcı tarafından gönderilen seçimin `name` özelliğini döner.
:::

Farklı bir şey gerekiyorsa, döndürülen değeri istediğiniz şekilde formatlamak için seçeneklere (şu "soru" nesnesi) özel bir `result` işlevi ekleyebilirsiniz.

```js
const questions = [
  {
    type: 'select',
    name: 'colors',
    message: 'Favori renk?',
    choices: [
      { name: 'red', message: 'kırmızı', value: '#ff0000' }, //<= seçim nesnesi
      { name: 'green', message: 'Yeşil', value: '#00ff00' }, //<= seçim nesnesi
      { name: 'blue', message: 'Mavi', value: '#0000ff' } //<= seçim nesnesi
    ],
    result(value) {
      return value; // varsayılan olarak, "value" seçim.name
    }
  }
];
```

> **Not:** `multiple` `true` olduğunda, döndürülen değer isimlerin bir dizisidir. Bunu aşağıda da ele alacağız.

### Örnekler

**sadece isim**

Hiçbir şey yapma. Bu varsayılan davranıştır.

**sadece değer**

Seçilen seçimden yalnızca değeri almak istiyorsanız, aşağıdakileri yapabilirsiniz:

```js
result() {
  // "focused" çoklu seçim yokken seçilen seçimdir
  return this.focused.value;
}
// { colors: '#ff0000' }
```

**özellikler (isim ve değer)**

Hem isim hem de değeri istiyorsanız, `this.choices` üzerinde yineleyebilir ve bunu istediğiniz şekilde yapabilirsiniz veya `.map` yöntemini kullanabilirsiniz:

```js
result(name) {
  // .map bir isimler dizisi bekler
  return this.map([name]);
}
// { colors: { kırmızı: '#ff0000' } }
```

**Seçim nesneleri**

Ayrıca seçimler üzerinde yineleme yapabilir ve tüm seçimi veya istediğiniz herhangi bir özelliği döndürebilirsiniz:

```js
result(value) {
  // bu, tüm seçim nesnesini döndürür
  return this.choices.find(choice => choice.name === value);
}
```

## Çoklu Seçim

`MultiSelect` istemi ile (veya Seçim isteminde `options.multiple` doğru olduğunda) aşağıdakileri yapabilirsiniz:

```js
result(names) {
  return this.map(names);
}
```