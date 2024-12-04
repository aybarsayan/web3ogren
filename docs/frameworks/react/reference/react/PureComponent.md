---
title: PureComponent
seoTitle: Understanding PureComponent in React
sidebar_position: 4
description: PureComponent is a specialized component that prevents unnecessary re-renders in React. This guide covers its usage and migration strategies for functional components.
tags: 
  - React
  - PureComponent
  - Functional Components
  - Class Components
keywords: 
  - React
  - PureComponent
  - Functional Components
  - Class Components
---
Bileşenleri sınıflar yerine fonksiyonlar olarak tanımlamanızı öneririz. `Taşınma nasıl yapılır?`
:::



`PureComponent`, `Component` ile benzerdir ancak aynı props ve state için yeniden render etmeyi atlar. Sınıf bileşenleri React tarafından hala desteklenmektedir, ancak yeni kodda kullanılmasını önermiyoruz.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Merhaba, {this.props.name}!</h1>;
  }
}
```