---
title: Refs ile DOM İşlemleri
seoTitle: Refs ve DOM Manipülasyonu
sidebar_position: 4
description: Bu sayfada, Reactta refs kullanarak DOM öğelerine nasıl erişeceğinizi ve bunlarla nasıl etkileşime geçeceğinizi öğreneceksiniz. Özellikle, useRef ve event handlerlar ile refler üzerine önemli bilgiler sunulmaktadır.
tags: 
  - React
  - refs
  - DOM
  - useRef
keywords: 
  - React
  - refs
  - DOM
  - useRef
---
React, render çıktınızı karşılamak için [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) otomatik olarak günceller, bu nedenle bileşenlerinizin genellikle bunu manipüle etmesine gerek kalmaz. Ancak, bazı durumlarda, React tarafından yönetilen DOM öğelerine erişmeniz gerekebilir – örneğin, bir düğümün odaklanması, ona kaydırma veya boyut ve konumunu ölçme amacıyla. React'ta bunları yapmanın yerleşik bir yolu yoktur, bu nedenle DOM düğümüne bir *ref* almanız gerekecektir.





- `ref` özniteliği ile React tarafından yönetilen bir DOM düğümüne nasıl erişileceği
- `ref` JSX özniteliğinin `useRef` Hook'u ile ilişkisi
- Başka bir bileşenin DOM düğümüne nasıl erişileceği
- React tarafından yönetilen DOM'u hangi durumlarda güvenli bir şekilde değiştirebileceğiniz



## Düğüm için bir ref almak {/*getting-a-ref-to-the-node*/}

:::tip
`useRef` kullanarak bir referans almanın ve bunu nasıl kullanacağınızın temel konseptleri hakkında bilgi edinin.
:::

React tarafından yönetilen bir DOM düğümüne erişmek için önce `useRef` Hook'unu içe aktarın:

```js
import { useRef } from 'react';
```

Ardından, bileşeniniz içinde bir ref tanımlamak için kullanın:

```js
const myRef = useRef(null);
```

Son olarak, ref'inizi almak istediğiniz JSX etiketine `ref` özniteliği olarak geçirin:

```js
<div ref={myRef}>
```

`useRef` Hook'u, `current` adlı tek bir özelliğe sahip bir nesne döndürür. Başlangıçta, `myRef.current` `null` olacaktır. React, bu `` için bir DOM düğümü oluşturduğunda, React bu düğüme bir referans koyacaktır `myRef.current` içine. Ardından, bu DOM düğümüne `etkinlik işleyicilerinizden` erişebilir ve tanımlanan [tarayıcı API'lerini](https://developer.mozilla.org/docs/Web/API/Element) kullanabilirsiniz.

```js
// Herhangi bir tarayıcı API'sini kullanabilirsiniz, örneğin:
myRef.current.scrollIntoView();
```

### Örnek: Metin girişi odaklama {/*example-focusing-a-text-input*/}

Bu örnekte, düğmeye tıklamak, girişi odaklayacaktır:



```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Girişi odakla
      </button>
    </>
  );
}
```



Bunu uygulamak için:

1. `inputRef`'i `useRef` Hook'u ile tanımlayın.
2. Bunu `` şeklinde geçin. Bu, React'a **bu ``'in DOM düğümünü `inputRef.current` içine koymasını söyler.**
3. `handleClick` fonksiyonunda, `inputRef.current` üzerinden girdi DOM düğümünü okuyun ve buna `focus()` [metodunu](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) çağırın.
4. `handleClick` etkinlik işleyicisini `` ile `onClick` kullanarak geçin.

DOM manipülasyonu ref'ler için en yaygın kullanım durumu olsa da, `useRef` Hook'u React dışındaki diğer şeyleri depolamak için de kullanılabilir, örneğin zamanlayıcı kimlikleri. State gibi, ref'ler renderlar arasında kalır. Ref'ler, ayar yaptığınızda yeniden render almaz. Ref'leri `Ref'lerle Değerleri Referanslama.` makalesinde okuyun.

### Örnek: Bir öğeye kaydırma {/*example-scrolling-to-an-element*/}

Bir bileşende birden fazla ref bulundurabilirsiniz. Bu örnekte, üç resmin bulunduğu bir kaydırıcı var. Her düğme, karşılık gelen DOM düğümü üzerinde tarayıcı [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) yöntemini çağırarak bir resmi merkezler:



```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```





#### Ref geri çağrısı kullanarak bir ref listesini nasıl yönetirsiniz {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

Yukarıdaki örneklerde, önceden tanımlanmış bir ref sayısı bulunuyor. Ancak, bazen liste içindeki her öğe için bir ref'e ihtiyacınız olabilir ve kaç tane olacağını bilemezsiniz. Bu şekilde bir şey **çalışmaz**:

```js
<ul>
  {items.map((item) => {
    // Çalışmaz!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Bu, **Hook'ların yalnızca bileşeninizin en üst düzeyinde çağrılması gerektiği** anlamına gelir. `useRef`'i bir döngüde, bir koşulda veya `map()` çağrısı içinde çağırmanız mümkün değildir.

Bunun etrafında bir yol, ebeveyn öğesi için tek bir ref almak ve ardından `querySelectorAll` gibi DOM manipülasyon yöntemlerini kullanarak bireysel çocuk düğümlerini "bulmaktır." Ancak bu kırılgandır ve DOM yapınız değişirse bozulabilir.

Başka bir çözüm, **`ref` özniteliğine bir fonksiyon geçirmektir.** Buna `ref` geri çağrısı` denir. React, ref'i ayarlama zamanı geldiğinde DOM düğümü ile, temizleme zamanı geldiğinde ise `null` ile ref geri çağrınızı çağıracaktır. Bu, kendi dizinizi veya bir [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) tutmanıza ve herhangi bir ref'e onun indeksi veya bir tür kimliğiyle erişmenize olanak tanır.

Bu örnek, uzun bir listede rastgele bir düğüme kaydırmak için bu yaklaşımın nasıl kullanılabileceğini gösterir:



```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // İlk kullanımda Map'i başlat.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[9])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(cat, node);
                } else {
                  map.delete(cat);
                }
              }}
            >
              <img src={cat} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push("https://loremflickr.com/320/240/cat?lock=" + i);
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  }
}
```



Bu örnekte, `itemsRef` tek bir DOM düğümünü tutmaz. Bunun yerine, öğe kimliğinden DOM düğümüne bir [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) tutar. Her liste öğesi üzerindeki `ref` geri çağrısı` Map'i güncellemekle ilgilidir:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Map'e ekle
      map.set(cat, node);
    } else {
      // Map'ten çıkar
      map.delete(cat);
    }
  }}
>
```

Bu, daha sonra Map'ten bireysel DOM düğümlerini okumanıza olanak tanır.



Bu örnek, bir `ref` geri çağrısı temizleme fonksiyonu ile Map'i yönetmenin bir diğer yaklaşımını gösterir.

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Map'e ekle
    map.set(cat, node);

    return () => {
      // Map'ten çıkar
      map.delete(cat);
    };
  }}
>
```





## Başka bir bileşenin DOM düğümlerine erişim {/*accessing-another-components-dom-nodes*/}

Bir tarayıcı öğesi çıkaran yerleşik bir bileşene bir ref koyduğunuzda, React bu ref'in `current` özelliğini karşılık gelen DOM düğümüne (örneğin, tarayıcıda gerçek ``) ayarlayacaktır.

Ancak, **kendi** bileşeninize, örneğin `` gibi bir ref koymaya çalıştığınızda, varsayılan olarak `null` alırsınız. İşte bunu gösteren bir örnek. Düğmeye tıklamanın **girişi** odaklamadığını fark edin:



```js
import { useRef } from 'react';

function MyInput(props) {
  return <input {...props} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Girişi odakla
      </button>
    </>
  );
}
```



Sorunu fark etmenize yardımcı olmak için, React ayrıca konsola bir hata yazdırır:



Uyarı: Fonksiyon bileşenlerine ref verirken sorunlar yaşanabilir. Bu ref'e erişim girişimleri başarısız olacaktır. React.forwardRef() kullanmayı mı kastettiniz?



Bu, varsayılan olarak React'ın bir bileşenin diğer bileşenlerin DOM düğümlerine erişmesine izin vermediği anlamına gelir. Hatta kendi çocukları için bile! Bu, kasten yapılmıştır. Ref'ler, sıkı bir şekilde kullanılmalarını gerektiren bir kaçış kapısıdır. Başka bir bileşenin DOM düğümlerini manuel olarak manipüle etmek, kodunuzu daha kırılgan hale getirir.

Bunun yerine, DOM düğümlerini _açmak_ isteyen bileşenlerin, bu davranışa **katılım göstermesi** gerekir. Bir bileşen, ref'ini çocuklarından birine "ileri yönlendirdiğini" belirtebilir. `MyInput`'in `forwardRef` API'sini nasıl kullanabileceğini gösterelim:

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

Bu şöyle çalışır:

1. `` React'a karşılık gelen DOM düğümünü `inputRef.current` içine yerleştirmesini söyler. Ancak, bu davranışa katılım göstermek `MyInput` bileşeninin sorumluluğundadır – varsayılan olarak yapmaz.
2. `MyInput` bileşeni `forwardRef` kullanılarak tanımlanmıştır. **Bu, yukarıdaki `inputRef`'i ikinci `ref` argümanı olarak alma katılımını sağlar** ki bu `props`'tan sonra bildirilmiştir.
3. `MyInput` kendisi aldığı `ref`'i içindeki ``'e iletir.

Artık düğmeye tıklamak girişi odaklamayı çalışır hale getirir:



```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Girişi odakla
      </button>
    </>
  );
}
```



Tasarım sistemlerinde, düğmeler, girişler ve benzeri gibi düşük düzeydeki bileşenlerin, DOM düğümlerine ref'lerini yönlendirmesi yaygın bir modeldir. Diğer yandan, formlar, listeler veya sayfa bölümleri gibi yüksek düzeyde bileşenler, genellikle DOM düğümlerine erişim sağlamazlar ve böylece DOM yapısına kazaen bağımlılıkları önlerler.



#### İmperatif bir tutacak ile API'nin bir alt kümesini açma {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

Yukarıdaki örnekte, `MyInput` orijinal DOM giriş öğesini açmaktadır. Bu, ebeveyn bileşenin buna `focus()` çağırmasına olanak tanır. Ancak bu aynı zamanda ebeveynin başka bir şey yapmasına da olanak tanır – örneğin, CSS stilini değiştirmek. Nadir durumlarda, açılan işlevselliği kısıtlamak isteyebilirsiniz. Bunu `useImperativeHandle` kullanarak yapabilirsiniz:



```js
import {
  forwardRef, 
  useRef, 
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Yalnızca odaklama işlevini aç
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Girişi odakla
      </button>
    </>
  );
}
```



Burada, `MyInput` içindeki `realInputRef` gerçek giriş DOM düğümünü tutar. Ancak, `useImperativeHandle` React'a ebeveyn bileşene, referansın değerinin kendi özel nesnesi sağlayacağını instruct eder. Böylece `Form` bileşeninin içindeki `inputRef.current` yalnızca `focus` metoduna sahip olacaktır. Bu durumda, ref "tutacağı" DOM düğümü değil, `useImperativeHandle` çağrısında oluşturduğunuz özel nesnedir.



## React'in ref'leri eklediği zaman {/*when-react-attaches-the-refs*/}

React'ta her güncelleme `iki aşamaya` bölünmüştür:

* **Render** sırasında, React bileşenlerinizi çağırır ve ekranda ne olması gerektiğini bulur.
* **Commit** sırasında, React DOM'a değişiklik uygular.

Genel olarak, [ref'lere erişmek](https://react.dev/learn/referencing-values-with-refs#best-practices-for-refs) istemezsiniz render sırasında. Bu, DOM düğümlerini tutan ref'ler için de geçerlidir. İlk render sırasında, DOM düğümleri henüz oluşturulmamıştır, bu nedenle `ref.current` `null` olacaktır. Ve güncellemeleri render ederken, DOM düğümleri henüz güncellenmemiştir. Yani bunları okumak için çok erkendir.

React, commit sırasında `ref.current` değerini ayarlar. DOM'u güncellemeden önce, React, etkilenen `ref.current` değerlerini `null` olarak ayarlar. DOM'u güncelledikten sonra, React derhal bunları karşılık gelen DOM düğümlerine ayarlar.

**Genellikle, event handler'lardan ref'lere erişirsiniz.** Bir ref ile yapmak istediğiniz bir şey varsa, ancak bunu yapmak için belirli bir etkinlik yoksa, bir Etkiye ihtiyaç duyabilirsiniz. Etkiler hakkında bir sonraki sayfalarda tartışacağız.



#### flushSync ile durumsal güncellemeleri senkronize olarak boşaltma {/*flushing-state-updates-synchronously-with-flush-sync*/}

Aşağıdaki gibi bir kodu düşünün; bu, yeni bir todo ekleyip ekranı listenin son çocuğuna kaydırır. Nedenini fark edin, her nedense her zaman en son eklenen todo'dan *önceki* todo'ya kaydırır:



```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Ekle
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```



Sorunun nedeni bu iki satırda yatıyor:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

React'ta `durum güncellemeleri kuyruklanır.` Genellikle bu, istediğiniz şeydir. Ancak burada sorun yaratıyor çünkü `setTodos` DOM'u hemen güncellemiyor. Bu nedenle, listenizi son elemanına kaydırma zamanınız geldiğinde todo henüz eklenmemiştir. Bu nedenle, kaydırma her zaman "bir öğe geride" kalır.

Bu sorunu düzeltmek için, React'a DOM'u senkronize bir şekilde güncellemesini ("boşaltmasını") zorlayabilirsiniz. Bunu yapmak için `react-dom`'dan `flushSync`'i içe aktarın ve **durum güncellemesini** bir `flushSync` çağrısına sarın:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Bu, React'a, `flushSync` içinde sarılı kod çalıştırıldıktan sonra DOM'u senkronize bir şekilde güncellemesini talimat vermektedir. Sonuç olarak, son todo, kaydırmak için denediğinizde DOM'da zaten bulunmaktadır:



```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);      
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Ekle
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

