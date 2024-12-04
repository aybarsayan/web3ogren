---
title: Bağlam ile Derin Veri Aktarımı
seoTitle: Bağlam ile Derin Veri Aktarımı - Reaktif Programlama
sidebar_position: 2
description: Bu içerik, Reactte bilgiyi üst bileşenden alt bileşene aktarmak için bağlamın nasıl kullanılacağını açıklamar. Ayrıca, props geçişinin olası zorluklarını ele alıyor.
tags: 
  - React
  - Bağlam
  - Verimlilik
  - Bileşen İletişimi
keywords: 
  - React
  - Bağlam
  - Bileşenler
  - Veri Aktarımı
---
Genelde, bir üst bileşenden bir alt bileşene bilgi geçişi yaparken props kullanırsınız. Ancak, çok sayıda bileşen arasında props geçmeniz gerektiğinde veya uygulamanızdaki birçok bileşen aynı bilgiye ihtiyaç duyduğunda, props geçişi fazlasıyla uzun ve rahatsız edici hale gelebilir. **Bağlam** (Context), üst bileşenin ağaçtaki herhangi bir bileşenin kullanımına kapalı olan bilgi sağladığından, onu açıkça prop olarak geçmeden yapmak mümkündür.





- "Prop delme" nedir
- Tekrarlı prop geçişinin bağlam ile nasıl değiştirileceği
- Bağlam için yaygın kullanım durumları
- Bağlama alternatif yaygın yöntemler



## Props Geçmenin Problemi {/*the-problem-with-passing-props*/}

:::info
`Props geçişi`, verileri UI ağacınızda onu kullanan bileşenlere açıkça iletmek için harika bir yoldur.
:::

Ancak, bazı prop'ları ağaçta derinlemesine geçmeniz gerektiğinde veya birçok bileşenin aynı prop'a ihtiyaç duyduğunda, props geçişi rahatsız edici ve uzun hale gelebilir. En yakın ortak üst bileşen, verilere ihtiyaç duyan bileşenlerden uzak olabilir ve `durumu yukarı çıkarmak` bu yüksekliğinde "prop delme" adı verilen bir duruma yol açabilir.





Durumu yukarıda çıkarma




Prop delme





Eğer verileri ağaçtaki bileşenlere "teleport" etmenin bir yolu olsa ve bunu props geçişi olmadan yapsanız harika olmaz mıydı? React'in bağlam özelliği ile bunu gerçekleştirebilirsiniz!

## Bağlam: Prop Geçmenin Bir Alternatifi {/*context-an-alternative-to-passing-props*/}

Bağlam, bir üst bileşenin altındaki tüm ağaç için veri sağlamasına olanak tanır. Bağlam için birçok kullanım vardır. İşte bir örnek. Boyutu için bir `level` kabul eden bu `Heading` bileşenini düşünün:



```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Başlık</Heading>
      <Heading level={2}>Başlık</Heading>
      <Heading level={3}>Alt Başlık</Heading>
      <Heading level={4}>Alt Alt Başlık</Heading>
      <Heading level={5}>Alt Alt Alt Başlık</Heading>
      <Heading level={6}>Alt Alt Alt Alt Başlık</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Bilinmeyen seviye: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```



Diyelim ki aynı `Section` içinde birden fazla başlığın aynı boyutta olmasını istiyorsunuz:



```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Başlık</Heading>
      <Section>
        <Heading level={2}>Başlık</Heading>
        <Heading level={2}>Başlık</Heading>
        <Heading level={2}>Başlık</Heading>
        <Section>
          <Heading level={3}>Alt Başlık</Heading>
          <Heading level={3}>Alt Başlık</Heading>
          <Heading level={3}>Alt Başlık</Heading>
          <Section>
            <Heading level={4}>Alt Alt Başlık</Heading>
            <Heading level={4}>Alt Alt Başlık</Heading>
            <Heading level={4}>Alt Alt Başlık</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Bilinmeyen seviye: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```



Şu anda, her ``'e `level` prop'unu ayrı ayrı geçiriyorsunuz:

```js
<Section>
  <Heading level={3}>Hakkında</Heading>
  <Heading level={3}>Fotoğraflar</Heading>
  <Heading level={3}>Videolar</Heading>
</Section>
```

`` bileşenine `level` prop'unu verip ``'den çıkarmanız güzel olurdu. Bu sayede, aynı bölümdeki tüm başlıkların aynı boyutta olmasını garanti edebilirsiniz:

```js
<Section level={3}>
  <Heading>Hakkında</Heading>
  <Heading>Fotoğraflar</Heading>
  <Heading>Videolar</Heading>
</Section>
```

Ama `` bileşeni en yakın ``'in seviyesini nasıl bilecek? **Bu, çocuk bileşenin ağaçta yukarıda bir yerden veri "istemesi" için bir yol gerektiriyor.**

Sadece props ile bunu yapamazsınız. İşte burada bağlam devreye giriyor. Bunu üç adımda gerçekleştireceksiniz:

1. **Bir bağlam oluşturun.** (Buna `LevelContext` diyebilirsiniz, çünkü başlık seviyesidir.)
2. **Veri ihtiyacı olan bileşende bu bağlamı kullanın.** (`Heading`, `LevelContext`'i kullanacaktır.)
3. **Veriyi belirten bileşenden bu bağlamı sağlayın.** (`Section`, `LevelContext`'i sağlayacaktır.)

Bağlam, bir üst bileşenin—hatta uzaktaki birinin!—içindeki tüm ağaç için bazı veriler sağlamasına olanak tanır.





Bağlamı yakın çocuklarda kullanma





Bağlamı uzak çocuklarda kullanma





### Adım 1: Bağlamı Oluştur {/*step-1-create-the-context*/}

Öncelikle, bağlamı oluşturmanız gerekiyor. Bileşenlerinizin bunu kullanması için bir dosyadan **dışa aktarmanız** gerekecek:



```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Başlık</Heading>
      <Section>
        <Heading level={2}>Başlık</Heading>
        <Heading level={2}>Başlık</Heading>
        <Heading level={2}>Başlık</Heading>
        <Section>
          <Heading level={3}>Alt Başlık</Heading>
          <Heading level={3}>Alt Başlık</Heading>
          <Heading level={3}>Alt Başlık</Heading>
          <Section>
            <Heading level={4}>Alt Alt Başlık</Heading>
            <Heading level={4}>Alt Alt Başlık</Heading>
            <Heading level={4}>Alt Alt Başlık</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Bilinmeyen seviye: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```



`createContext`'in tek argümanı _varsayılan_ değerdir. Burada `1`, en büyük başlık seviyesine işaret eder, ancak herhangi bir tür değer (hatta bir nesne bile) geçebilirsiniz. Önceki adımda varsayılan değerin önemiyle ilgili bilgi edineceksiniz.

### Adım 2: Bağlamı Kullanın {/*step-2-use-the-context*/}

React'ten `useContext` Hook'unu ve bağlamınızı içe aktarın:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

Şu anda, `Heading` bileşeni `level`'i props'tan okuyor:

```js
export default function Heading({ level, children }) {
  // ...
}
```

Bunun yerine, `level` prop'unu kaldırın ve içe aktardığınız bağlamdan, `LevelContext`'ten değeri okuyun:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` bir Hook'tur. `useState` ve `useReducer` gibi, bir Hook'u yalnızca bir React bileşeninin içinde hemen çağırabilirsiniz (döngüler veya koşullar içinde değil). **`useContext`, React'e `Heading` bileşeninin `LevelContext`'i okumak istediğini bildirir.**

Artık `Heading` bileşeninin bir `level` prop'u olmadığından, JSX'inizde yukarıdaki gibi `Heading`'e `level` prop'unu geçmenize gerek kalmaz:

```js
<Section>
  <Heading level={4}>Alt Alt Başlık</Heading>
  <Heading level={4}>Alt Alt Başlık</Heading>
  <Heading level={4}>Alt Alt Başlık</Heading>
</Section>
```

JSX'i güncelleyin, böylece bu sefer `Section` onu alsın:

```jsx
<Section level={4}>
  <Heading>Alt Alt Başlık</Heading>
  <Heading>Alt Alt Başlık</Heading>
  <Heading>Alt Alt Başlık</Heading>
</Section>
```

Hatırlatma olması açısından, çalışmasını istediğiniz markup şöyle:



```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Başlık</Heading>
      <Section level={2}>
        <Heading>Başlık</Heading>
        <Heading>Başlık</Heading>
        <Heading>Başlık</Heading>
        <Section level={3}>
          <Heading>Alt Başlık</Heading>
          <Heading>Alt Başlık</Heading>
          <Heading>Alt Başlık</Heading>
          <Section level={4}>
            <Heading>Alt Alt Başlık</Heading>
            <Heading>Alt Alt Başlık</Heading>
            <Heading>Alt Alt Başlık</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Bilinmeyen seviye: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```



Bu örneğin henüz tam olarak çalışmadığını unutmayın! Tüm başlıklar aynı boyutta çünkü **bağlamı *sağlamadınız*.** React, nereden alacağını bilmez!

Eğer bağlamı sağlamazsanız, React daha önce belirttiğiniz varsayılan değeri kullanacaktır. Bu örnekte `createContext`'e `1` argümanını belirttiğiniz için, `useContext(LevelContext)` `1` döner ve tüm başlıkları `` yapar. Bu durumu çözmek için her `Section`'ın kendi bağlamını sağlamasını sağlayalım.

### Adım 3: Bağlamı Sağlayın {/*step-3-provide-the-context*/}

`Section` bileşeni şu anda çocuklarını render ediyor:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Onları bir bağlam sağlayıcı ile sarmalayın** ki `LevelContext`'i sağlamış olun:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

Bu, React'e "bu `` içinde herhangi bir bileşen `LevelContext` için bir istek yaparsa, onlara bu `level` değerini ver" demektir. Bileşen, en yakın ``'ın değerini kullanır.



```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Başlık</Heading>
      <Section level={2}>
        <Heading>Başlık</Heading>
        <Heading>Başlık</Heading>
        <Heading>Başlık</Heading>
        <Section level={3}>
          <Heading>Alt Başlık</Heading>
          <Heading>Alt Başlık</Heading>
          <Heading>Alt Başlık</Heading>
          <Section level={4}>
            <Heading>Alt Alt Başlık</Heading>
            <Heading>Alt Alt Başlık</Heading>
            <Heading>Alt Alt Başlık</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Bilinmeyen seviye: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```



Aynı sonuca varıyorsunuz ama artık her `Heading` bileşenine `level` prop'unu geçmek zorunda değilsiniz! Bunun yerine, en yakın `Section`'dan "eğitim" alarak seviyesini öğreniyor: