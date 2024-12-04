---
title: React Nedir?
seoTitle: React - Modern Web Uygulamaları için JavaScript Kütüphanesi
sidebar_position: 1
description: React, kullanıcı arayüzleri oluşturmak için kullanılan açık kaynaklı bir JavaScript kütüphanesidir. Facebook tarafından geliştirilmiştir.
tags:
  - React
  - JavaScript
  - Frontend
  - UI Library
keywords:
  - React.js
  - React Hooks
  - Component Based
  - Virtual DOM
  - JSX
---

React, Facebook tarafından geliştirilen açık kaynaklı bir JavaScript kütüphanesidir. Kullanıcı arayüzleri oluşturmak için tasarlanmış, bileşen tabanlı ve bildirimsel bir yaklaşım sunar.

:::tip Neden React?
React'in "Bir kere öğren, her yerde yaz" felsefesi, web, mobil ve masaüstü uygulamaları geliştirmenize olanak tanır.
:::

## Temel Kavramlar {#core-concepts}

### JSX {#jsx}

JSX, JavaScript için XML benzeri bir sözdizimi uzantısıdır:

```jsx
const element = (
  <div className="greeting">
    <h1>Merhaba, {formatName(user)}!</h1>
  </div>
);
```

### Bileşenler {#components}

React uygulamaları, yeniden kullanılabilir bileşenlerden oluşur:

```jsx
// Fonksiyonel Bileşen
function Welcome(props) {
  return <h1>Merhaba, {props.name}</h1>;
}

// Class Bileşeni
class Welcome extends React.Component {
  render() {
    return <h1>Merhaba, {this.props.name}</h1>;
  }
}
```

:::info
Modern React uygulamalarında, Hooks ile birlikte fonksiyonel bileşenler tercih edilmektedir.
:::

## React Hooks {#react-hooks}

### State Yönetimi {#state-management}

```jsx
import { useState, useEffect } from 'react';

function ExampleComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `${count} kez tıklandı`;
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count} kez tıklandı
    </button>
  );
}
```

### Yaygın Hooks {#common-hooks}

1. **useState**: Durum yönetimi
2. **useEffect**: Yan etki yönetimi
3. **useContext**: Bağlam erişimi
4. **useRef**: DOM referansları
5. **useMemo**: Hesaplama önbelleği
6. **useCallback**: Fonksiyon önbelleği

## Veri Akışı {#data-flow}

### Props {#props}

```jsx
function Welcome(props) {
  return <h1>Merhaba, {props.name}</h1>;
}

// Kullanımı
<Welcome name="Ahmet" />
```

### State vs Props {#state-vs-props}

```jsx
function Counter() {
  // State: Bileşen içinde değiştirilebilir
  const [count, setCount] = useState(0);
  
  // Props: Sadece okunabilir
  return (
    <DisplayCount 
      count={count} 
      onIncrement={() => setCount(count + 1)} 
    />
  );
}
```

## Performans Optimizasyonu {#performance-optimization}

### React.memo {#react-memo}

```jsx
const MemoizedComponent = React.memo(function MyComponent(props) {
  /* render */
});
```

### useMemo ve useCallback {#usememo-usecallback}

```jsx
function Example({ data }) {
  // Değer önbelleğe alma
  const memoizedValue = useMemo(() => {
    return heavyComputation(data);
  }, [data]);

  // Fonksiyon önbelleğe alma
  const memoizedCallback = useCallback(() => {
    doSomething(data);
  }, [data]);

  return <Child value={memoizedValue} onClick={memoizedCallback} />;
}
```

## Yaşam Döngüsü {#lifecycle}

### Class Bileşenleri {#class-lifecycle}

```jsx
class Example extends React.Component {
  componentDidMount() {
    // Bileşen DOM'a eklendiğinde
  }

  componentDidUpdate(prevProps, prevState) {
    // Bileşen güncellendiğinde
  }

  componentWillUnmount() {
    // Bileşen DOM'dan kaldırılmadan önce
  }
}
```

### Hooks ile Yaşam Döngüsü {#hooks-lifecycle}

```jsx
function Example() {
  useEffect(() => {
    // componentDidMount
    return () => {
      // componentWillUnmount
    };
  }, []); // Boş dependency array

  useEffect(() => {
    // componentDidUpdate
  }, [someProp]); // Prop değişimini izle
}
```

## Router {#routing}

React Router ile sayfa yönlendirmesi:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## State Yönetimi {#state-management}

### Context API {#context-api}

```jsx
const ThemeContext = React.createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}
```

:::warning
Context API, küçük-orta ölçekli uygulamalar için uygundur. Büyük uygulamalar için Redux veya Zustand gibi state yönetim kütüphaneleri düşünülebilir.
:::

## En İyi Pratikler {#best-practices}

1. Bileşenleri küçük ve odaklı tutun
2. Props drilling'den kaçının
3. Erken optimizasyondan kaçının
4. İsimlendirme kurallarına uyun
5. Tip kontrolü için PropTypes veya TypeScript kullanın

## Örnek Kullanım Alanları {#use-cases}

1. Tek sayfa uygulamaları (SPA)
2. E-ticaret platformları
3. Sosyal medya uygulamaları
4. Dashboard ve admin panelleri
5. İnteraktif web uygulamaları

## Sonuç {#conclusion}

React, modern web uygulamaları geliştirmek için güçlü ve esnek bir kütüphanedir. Geniş ekosistemi, aktif topluluğu ve sürekli gelişen yapısı ile frontend geliştirme dünyasında lider konumdadır.

:::tip Başlarken
React öğrenmeye başlamak için [resmi React dokümantasyonunu](https://react.dev/) inceleyebilirsiniz.
:::