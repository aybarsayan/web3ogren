---
title: Bileşen
seoTitle: React Bileşenleri Hakkında Bilgi
sidebar_position: 1
description: React bileşenleri, sınıflar yerine fonksiyonlar olarak tanımlanabilen temel yapı taşlarıdır. Bu belgede, bileşenlerin özellikleri ve yaşam döngüsü yöntemleri hakkında bilgi bulacaksınız.
tags: 
  - React
  - Bileşenler
  - JavaScript
  - Geliştirici
keywords: 
  - React
  - Bileşen
  - JavaScript
  - Geliştirme
---
:::tip
Bileşenleri sınıflar yerine fonksiyonlar olarak tanımlamayı öneriyoruz. `Göç etme yöntemini görün.`
:::



`Component`, [JavaScript sınıfları](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) olarak tanımlanan React bileşenleri için temel sınıftır. Sınıf bileşenleri hala React tarafından desteklenmektedir, ancak yeni kodda kullanılmasını önermiyoruz.

```js
class Greeting extends Component {
  render() {
    return <h1>Merhaba, {this.props.name}!</h1>;
  }
}
```