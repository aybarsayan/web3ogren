---
title: Durumun Korunması ve Sıfırlanması
seoTitle: React Durum Yönetimi Koruma ve Sıfırlama
sidebar_position: 4
description: Bu bölümde, React bileşenlerinin durum yönetimi konusunda önemli bilgiler öğreneceksiniz. Durumun korunması ve sıfırlanmasıyla ilgili temel kavramlar ve örnekler bulacaksınız.
tags: 
  - React
  - durum yönetimi
  - bileşenler
  - kullanıcı arayüzü
keywords: 
  - React
  - durum
  - bileşen
  - yönetim
  - UI
---
Durum, bileşenler arasında izole edilmiştir. React, durumun hangi bileşene ait olduğunu, kullanıcı arayüzü (UI) ağacındaki yerlerine bağlı olarak takip eder. Durumu ne zaman koruyacağınızı ve ne zaman sıfırlayacağınızı kontrol edebilirsiniz.





* React’in durumu ne zaman koruyacağını ya da sıfırlayacağını
* React’in bileşenin durumunu sıfırlamak için nasıl zorlanacağını
* Anahtarların ve türlerin durumun korunup korunmadığını nasıl etkilediğini



## Durum, render ağacındaki bir konuma bağlıdır {/*state-is-tied-to-a-position-in-the-tree*/}

React, kullanıcı arayüzünüzdeki bileşen yapısı için `render ağaçları` oluşturur.

Bir bileşene durum verdiğinizde, bu durumun bileşenin içinde "yaşadığını" düşünebilirsiniz. Ancak durum aslında React'in içinde tutulur. React, tuttuğu her durum parçasını, o bileşenin render ağacındaki yerine göre uygun bileşenle ilişkilendirir.

> **Bunlar iki ayrı sayaçtır çünkü her biri ağacın kendi konumunda render edilmiştir.** React'i kullanırken genellikle bu konumları düşünmenize gerek yoktur, ancak nasıl çalıştığını anlamak faydalı olabilir.

React'te, ekranda her bileşenin tam anlamıyla izole bir durumu vardır. Örneğin, yan yana iki `Counter` bileşeni render ettiğinizde, her biri kendi bağımsız `score` ve `hover` durumlarına sahip olacaktır.

Her iki sayaca tıklamayı deneyin ve birbirlerini etkilemediklerini fark edin:



```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```



Gördüğünüz gibi, bir sayaç güncellendiğinde, yalnızca o bileşenin durumu güncellenir:





Durumu güncelleme





React, ağacın aynı konumunda aynı bileşeni render ettiğiniz sürece durumu saklı tutar. Bunu görmek için her iki sayacı birer birer artırın, ardından ikinci bileşeni "İkinci sayacı render et" onay kutusunu kaldırarak kaldırın ve ardından tekrar işaretleyerek geri ekleyin:



```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        İkinci sayacı render et
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```



İkinci sayacı render etmeyi durdurduğunuz anda, durumunun tamamen silindiğini gözlemleyin. Çünkü React bir bileşeni kaldırdığında, durumunu yok eder.





Bir bileşeni silme





"İkinci sayacı render et" seçeneğini işaretlediğinizde, ikinci bir `Counter` ve durumu sıfırdan (`score = 0`) başlatılır ve DOM'a eklenir.





Bir bileşeni ekleme





**React, bir bileşenin durumunu, o bileşenin UI ağacındaki konumunda render edildiği sürece korur.** Eğer kaldırılırsa veya aynı konumda farklı bir bileşen render edilirse, React durumunu yok eder.

## Aynı bileşen aynı konumda durumu korur {/*same-component-at-the-same-position-preserves-state*/}

Bu örnekte, iki farklı `` etiketi bulunmaktadır:



```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Şık stil kullan
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```



Onay kutusunu işaretlediğinizde veya kaldırdığınızda, sayaç durumu sıfırlanmaz. `isFancy` `true` veya `false` olduğunda, her zaman `App` bileşeninin döndürdüğü `div`in ilk çocuğu olarak bir `` elde edersiniz:





`App` durumunun güncellenmesi, `Counter`'ı sıfırlamaz çünkü `Counter` aynı konumda kalmaktadır.





:::warning
Unutmayın ki **önemli olan React için UI ağaçtaki konumudur, JSX işaretlemeleri değil!** Bu bileşenin içinde iki `return` ifadesi vardır ve farklı `` JSX etiketleri bulunmaktadır:
:::



```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Şık stil kullan
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Şık stil kullan
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```



Onay kutusunu işaretlediğinizde durumun sıfırlanmasını bekleyebilirsiniz, ancak sıfırlanmaz! Çünkü **bu iki `` etiketi aynı konumda render edilmiştir.** React, işlevinizde koşulları nereye koyduğunuzu bilmez. Onun için tek gördüğü şey, geri döndürdüğünüz ağaçtır.

Her iki durumda da `App` bileşeni, bir `` içinde `` döndürmektedir. React için bu iki sayacın "adresleri" aynıdır: kökün ilk çocuğunun ilk çocuğu. Bu, React'in önceki ve sonraki renderlar arasında eşleştirme yapmasını sağlar, mantığınızın yapısını nasıl kurduğunuzun önemi yoktur.