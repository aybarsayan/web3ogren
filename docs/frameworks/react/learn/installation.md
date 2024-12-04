---
title: Kurulum
seoTitle: React Kurulum - Başlangıç Kılavuzu
sidebar_position: 1
description: React, başlangıçtan itibaren kademeli benimseme için tasarlanmıştır. Bu bölüm size React ile başlama konusunda yardımcı olacaktır. Reacti denemek ve projelere entegre etmek için gerekli adımlar açıklanmıştır.
tags: 
  - React
  - Kurulum
  - Geliştirme
  - JavaScript
keywords: 
  - React
  - Kurulum
  - Proje Başlatma
  - Geliştirici Araçları
---
React, başlangıçtan itibaren kademeli benimseme için tasarlanmıştır. İhtiyacınıza göre React'i az ya da çok kullanabilirsiniz. React'i denemek, bir HTML sayfasına biraz etkileşim eklemek veya karmaşık bir React tabanlı uygulama başlatmak istiyorsanız, bu bölüm size başlama konusunda yardımcı olacaktır.





* `Yeni bir React projesine nasıl başlanır`
* `Mevcut bir projeye React nasıl eklenir`
* `Editörünüzü nasıl ayarlarsınız`
* `React Geliştirici Araçları nasıl kurulur`



## React'i Deneyin {/*try-react*/}

:::info
React ile oynamak için hiçbir şey kurmanıza gerek yok. Bu kum havuzunu düzenlemeyi deneyin!
:::



```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```



İsterseniz doğrudan düzenleyebilir veya sağ üst köşedeki "Fork" düğmesine basarak yeni bir sekmede açabilirsiniz.

> React belgelerindeki çoğu sayfa bu şekilde kum havuzları içerir. React belgeleri dışında, React'i destekleyen birçok çevrimiçi kum havuzu vardır: örneğin, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react) veya [CodePen.](https://codepen.io/pen?template=QWYVwWN)

### React'i Yerel Olarak Deneyin {/*try-react-locally*/}

Başka bir bilgisayarda React'i yerel olarak denemek için [bu HTML sayfasını indirin.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Bunu editörünüzde ve tarayıcıda açın!

## Yeni bir React projesi başlatın {/*start-a-new-react-project*/}

Eğer tamamen React ile bir uygulama veya web sitesi oluşturmak istiyorsanız, `yeni bir React projesine başlayın.`

## Mevcut projeye React ekleyin {/*add-react-to-an-existing-project*/}

Eğer mevcut uygulamanızda veya web sitenizde React kullanmayı denemek istiyorsanız, `mevcut bir projeye React ekleyin.`

## Sonraki adımlar {/*next-steps*/}

Her gün karşılaşacağınız en önemli React kavramlarını tanıtan `Hızlı Başlangıç` kılavuzuna gidin.