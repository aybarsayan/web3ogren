---
title: Render ve Taahhüt
seoTitle: Render ve Taahhüt ile React Uygulamalarınızı Anlayın
sidebar_position: 4
description: React uygulamalarında render ve taahhüt süreçlerini anlamak, bileşenlerin nasıl çalıştığını ve davranışını açıklamak için önemlidir. Bu makale, render sürecini üç adımda detaylandırmaktadır.
tags: 
  - react
  - bileşen
  - render
  - DOM
keywords: 
  - render
  - taahhüt
  - bileşen
  - react
---
Bileşenleriniz ekranda gösterilmeden önce, React tarafından render edilmelidir. Bu süreçteki adımları anlamak, kodunuzun nasıl çalıştığı ve davranışını açıklamak için yardımcı olacaktır.





* React'te render işleminin ne anlama geldiği
* React'in bir bileşeni ne zaman ve neden render ettiği
* Ekranda bir bileşeni görüntülemenin adımları
* Render işleminin her zaman DOM güncellemesi üretmemesi nedenleri



Bileşenlerinizi mutfakta malzemelerden lezzetli yemekler hazırlayan aşçılar olarak hayal edin. Bu senaryoda, React müşterilerin siparişlerini almak ve onlara siparişlerini getiren garsondur. UI'yi talep etme ve sunma süreci üç adımdan oluşur:

1. **Render'ı tetiklemek** (misafirin siparişini mutfağa iletmek)
2. **Bileşeni render etmek** (mutfakta siparişi hazırlamak)
3. **DOM'a taahhüt etmek** (siparişi masaya koymak)


  
  
  


## Adım 1: Render'ı Tetiklemek {/*step-1-trigger-a-render*/}

Bir bileşenin render edilmesinin iki nedeni vardır:

1. Bileşenin **ilk render'ıdır.**
2. Bileşenin (veya bir ata bileşenin) **durumu güncellenmiştir.**

### İlk render {/*initial-render*/}

Uygulamanız başladığında, ilk render'ı tetiklemeniz gerekir. Frameworkler ve kumanda kutuları bazen bu kodu gizler, ancak bu, `createRoot` çağrısı ile hedef DOM düğümünü almak ve ardından bileşeninizle `render` yöntemini çağırmak suretiyle yapılır:



```js src/index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' tarafından Eduardo Catalano: yansıtıcı yapraklara sahip devasa metalik bir çiçek heykeli"
    />
  );
}
```



`root.render()` çağrısını yorumlamaya çalışın ve bileşenin kaybolduğunu görün!

### Durum güncellendiğinde yeniden render edilme {/*re-renders-when-state-updates*/}

Bileşen ilk kez render edildikten sonra, durumu `set` fonksiyonu` ile güncelleyerek daha fazla render tetikleyebilirsiniz. Bileşeninizin durumunu güncellemek otomatik olarak bir render sırasını oluşturur. (Bunu, bir restoran misafirinin ilk siparişini verdikten sonra, susuzluk veya açlık durumuna bağlı olarak çay, tatlı ve her türlü şey sipariş ettiğini hayal edebilirsiniz.)


  
  
  


## Adım 2: React bileşenlerinizi render eder {/*step-2-react-renders-your-components*/}

Render'ı tetiklediğinizde, React ekranınızda ne görüntüleneceğini belirlemek için bileşenlerinizi çağırır. **"Render", React'in bileşenlerinizi çağırmasıdır.**

* **İlk render sırasında,** React ana bileşeni çağırır.
* **Sonraki render'lar için,** React render'ı tetikleyen durum güncellemesi olan fonksiyon bileşenini çağırır.

Bu süreç yinelemeli bir süreçtir: Eğer güncellenen bileşen başka bir bileşen döndürürse, React bir sonraki olarak _o_ bileşeni render edecektir, ve eğer o bileşen de bir şey döndürürse, bir sonraki olarak _o_ bileşeni render edecektir, ve bu böyle devam eder. Süreç, içeride başka bileşen kalmayana kadar devam eder ve React neyin ekranınızda görüntülenmesi gerektiğini tam olarak bilir.

Aşağıdaki örnekte, React `Gallery()` ve `Image()` fonksiyonlarını birkaç kez çağıracaktır:



```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>İlham Veren Heykeller</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' tarafından Eduardo Catalano: yansıtıcı yapraklara sahip devasa metalik bir çiçek heykeli"
    />
  );
}
```

```js src/index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```



* **İlk render sırasında,** React, ``, `` ve üç `<img>` etiketi için [DOM düğümlerini oluşturur](https://developer.mozilla.org/docs/Web/API/Document/createElement).
* **Yeniden render sırasında,** React, render'dan önceki değişiklikleri hesaplayacak, eğer varsa, hangi özelliklerin değiştiğini hesaplayacak. Bu bilgiyi bir sonraki adım olan taahhüt aşamasına kadar kullanmayacaktır.

:::tip
Render işlemi her zaman bir saf hesaplama olmalıdır.
:::

* **Aynı girdiler, aynı çıktı.** Aynı girdiler verildiğinde, bir bileşen her zaman aynı JSX'i döndürmelidir. (Birisi domatesli bir salata sipariş ederse, soğanlı bir salata almamalıdır!)
* **Kendi işine bakmalı.** Önceden render edilen nesneleri veya değişkenleri değiştirmemelidir. (Bir sipariş başkasının siparişini değiştirmemelidir.)

Aksi takdirde, kod tabanınız büyüdükçe karmaşık hatalar ve öngörülemeyen davranışlarla karşılaşabilirsiniz. "Strict Mode"da geliştirirken, React her bileşenin fonksiyonunu iki kez çağırır, bu da kirli fonksiyonlar nedeniyle yapılan hataları açığa çıkarmaya yardımcı olabilir.

:::warning
Aksi takdirde, kod tabanınız büyüdükçe karmaşık hatalar ve öngörülemeyen davranışlarla karşılaşabilirsiniz.
:::



#### Performansı Optimize Etme {/*optimizing-performance*/}

Güncellenen bileşenin içinde yer alan tüm bileşenlerin render edilmesi varsayılan davranış, eğer güncellenen bileşen ağaçta çok yüksek bir konumdaysa, performans açısından optimal değildir. Performans sorunu ile karşılaşırsanız, [Performans](https://reactjs.org/docs/optimizing-performance.html) bölümünde belirtilen birkaç isteğe bağlı çözüm yolu bulunmaktadır. **Önceden optimizasyon yapmayın!**



## Adım 3: React DOM'a değişiklikleri taahhüt eder {/*step-3-react-commits-changes-to-the-dom*/}

Bileşenlerinizi render ettikten sonra, React DOM'u değiştirecektir.

* **İlk render için,** React, tüm oluşturduğu DOM düğümlerini ekranda göstermek için [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API'sini kullanacaktır.
* **Yeniden render için,** React, render sırasında hesaplanan en az gerekli işlemleri (güncellemeyi DOM'un en son render çıktısına eşleştirme) uygulayacaktır.

**React yalnızca renderler arasında bir fark varsa DOM düğümlerini değiştirir.** Örneğin, burada her saniyede bir ebeveyninden farklı prop'lar alarak yeniden render edilen bir bileşen var. `` içine biraz metin ekleyip `value`'sini güncelleyebileceğinizi, ancak bileşen yeniden render edildiğinde metnin kaybolmadığını fark edin:



```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```



Bu, bu son adımda React'in yalnızca `` içeriğini yeni `time` ile güncellediği için çalışır. ``'in önceki yerinde JSX içinde yer aldığını gördüğünden, React ``'i—veya onun `value`'sini—değiştirmez!

## Epilog: Tarayıcı boyama {/*epilogue-browser-paint*/}

Render işlemi tamamlandığında ve React DOM'u güncellediğinde, tarayıcı ekranı yeniden boyar. Bu süreç "tarayıcı render'ı" olarak bilinse de, belgeler boyunca karışıklığı önlemek için "boyama" olarak adlandıracağız.





* Bir React uygulamasındaki herhangi bir ekran güncellemesi üç adımda gerçekleşir:
  1. Tetikleme
  2. Render
  3. Taahhüt
* Bileşenlerinizdeki hataları bulmak için Strict Mode'u kullanabilirsiniz
* React, render çıktısı bir önceki ile aynıysa DOM'u ellemiyor