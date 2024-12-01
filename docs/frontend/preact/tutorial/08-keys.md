---
description: Bu bölümde, Preact'te anahtarların önemini ve listelerin nasıl verimli bir şekilde render edileceğini öğreniyoruz. Anahtarlar, liste öğeleri arasında karşılaştırma yaparken Preact'in doğru şekilde güncelleme yapmasına yardımcı olur.
keywords: [Preact, anahtarlar, JSX, liste renderleme, performans]
---

# Anahtarlar

Birinci bölümde, Preact'in sanal DOM'u kullanarak JSX ile tanımlanan iki ağaç arasındaki değişiklikleri hesaplayıp bu değişiklikleri HTML DOM'a uygulayarak sayfaları güncellediğini gördük. Bu, çoğu senaryo için iyi çalışır, ancak bazen Preact'in iki render arasında ağacın şeklinin nasıl değiştiğini "tahmin etmesi" gerekir.

:::warning
Preact’in tahmininin niyetimizle farklı olabileceği en yaygın senaryo, listeleri karşılaştırdığımız durumdur.
:::

Basit bir yapılacaklar listesi bileşenini düşünelim:

```jsx
export default function TodoList() {
  const [todos, setTodos] = useState(['uyan', 'yatağı yap'])

  function wakeUp() {
    setTodos(['yatağı yap'])
  }

  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li>{todo}</li>
        ))}
      </ul>
      <button onClick={wakeUp}>Uyanıkım!</button>
    </div>
  )
}
```

Bu bileşen ilk yenilendiğinde, iki `` liste öğesi çizilecektir. __"Uyanıkım!"__ butonuna tıkladıktan sonra, `todos` durumu yalnızca ikinci öğeyi, yani `"yatağı yap"` içerecek şekilde güncellenir.

Preact’in birinci ve ikinci renderlarda "gördükleri" şunlardır:


  İlk Yenileme
  İkinci Yenileme


```jsx
<div>
  <ul>
    <li>uyan</li>
    <li>yatağı yap</li>
  </ul>
  <button>Uyanıkım!</button>
</div>
```



```jsx
<div>
  <ul>
    <li>yatağı yap</li>

  </ul>
  <button>Uyanıkım!</button>
</div>
```



Bir problem fark ettiniz mi? İlk liste öğesinin ("uyan") kaldırıldığı bizler için açıkken, Preact bunu bilemez. Preact’in gördüğü tek şey, iki öğe vardı ve şimdi bir tane var. Bu güncellemeyi uygularken, aslında ikinci öğeyi (`yatağı yap`) kaldıracak, ardından ilk öğenin metnini `uyan`'dan `yatağı yap` olarak güncelleyecek.

:::tip
Sonuç teknik olarak doğru – "yatağı yap" metnine sahip bir öğe – ancak bu sonuca ulaşma şeklimiz optimal değildi.
:::

Eğer 1000 liste öğesi olsaydı ve ilk öğeyi kaldırmış olsaydık: Preact, tek bir `` kaldırmak yerine ilk 999 diğer öğenin metnini günceller ve sonuncusunu kaldırırdı.

### Liste Renderlemenin **Anahtarı**

Önceki örnekteki gibi durumlarda, öğelerin _sırası_ değişiyor. Preact’in hangi öğelerin hangi olduğunu bilmesi için bir yolumuz olmalı, böylece her öğenin eklendiğinde, kaldırıldığında veya değiştirildiğinde bunu tespit edebiliriz. Bunu yapmak için, her öğeye bir `key` prop ekleyebiliriz.

`key` prop, belirli bir öğe için bir tanımlayıcıdır. İki ağaç arasındaki öğelerin _sırasını_ karşılaştırmak yerine, `key` prop'u olan öğeler, aynı `key` prop değerine sahip önceki öğeyi bulma yoluyla karşılaştırılır. Bir `key` her tür değeri alabilir, yeter ki renderlar arasında "kararlı" olsun: aynı öğenin tekrar eden renderlarında tam olarak aynı `key` prop değerine sahip olmalıdır.

Önceki örneğe anahtarlar ekleyelim. Yapılacaklar listemiz değişmeyen basit bir dizi olduğundan, bu dizideki stringleri anahtar olarak kullanabiliriz:

```jsx
export default function TodoList() {
  const [todos, setTodos] = useState(['uyan', 'yatağı yap'])

  function wakeUp() {
    setTodos(['yatağı yap'])
  }

  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li key={todo}>{todo}</li>
          //  ^^^^^^^^^^ bir key prop ekleniyor
        ))}
      </ul>
      <button onClick={wakeUp}>Uyanıkım!</button>
    </div>
  )
}
```

Bu yeni `` bileşeninin ilk renderlandığında, iki `` öğesi çizilecektir. "Uyanıkım!" butonuna tıkladığımızda, `todos` durumu yalnızca ikinci öğeyi, `"yatağı yap"` içerecek şekilde güncellenir.

:::info
Artık liste öğelerine `key` eklediğimiz için Preact’in gördükleri şunlardır:
:::


  İlk Yenileme
  İkinci Yenileme


```jsx
<div>
  <ul>
    <li key="uyan">uyan</li>
    <li key="yatağı yap">yatağı yap</li>
  </ul>
  <button>Uyanıkım!</button>
</div>
```



```jsx
<div>
  <ul>

    <li key="yatağı yap">yatağı yap</li>
  </ul>
  <button>Uyanıkım!</button>
</div>
```



Bu sefer Preact, ilk öğenin kaldırıldığını görebiliyor, çünkü ikinci ağaçta `key="uyan"` değerine sahip bir öğe eksik. İlk öğeyi kaldıracak ve ikinci öğeyi dokunulmaz bırakacaktır.

### Anahtarları Ne Zaman **Kullanmayız**

Geliştiricilerin anahtarlarla karşılaştığı en yaygın tuzaklardan biri, yanlışlıkla _renderlar arasında kararsız_ anahtarlar seçmektir. Örneğin, `map()` işlevinden gelen indeks argümanını `key` değerimiz olarak kullanmış olsaydık:

`items.map((item, index) => {item})`

Bu, Preact’in ilk ve ikinci renderda gördüğü ağaçları şu şekilde sonuçlanır:


  İlk Yenileme
  İkinci Yenileme


```jsx
<div>
  <ul>
    <li key={0}>uyan</li>
    <li key={1}>yatağı yap</li>
  </ul>
  <button>Uyanıkım!</button>
</div>
```



```jsx
<div>
  <ul>

    <li key={0}>yatağı yap</li>
  </ul>
  <button>Uyanıkım!</button>
</div>
```



:::danger
Sorun şudur ki, `index` aslında listemizde bir _**değeri**_ tanımlamaz, bir _**pozisyonu**_ tanımlar. Bu şekilde render yapmak, aslında Preact’i öğeleri sırayla eşleştirmeye zorlar, bu da anahtarlar yokmuş gibi çalışacaktır. Indeks anahtarları kullanmak, farklı türdeki liste öğelerine uygulandığında maliyetli veya hatalı çıktılara yol açabilir çünkü anahtarlar farklı türdeki öğelerle eşleşemez.
:::

> 🚙 **Benzerlik Zamanı!** Bir valet otoparkında arabanızı bıraktığınızı düşünün.
>
> Arabanızı almak için geri döndüğünüzde, valet’e gri bir SUV kullandığınızı söylersiniz. Ne yazık ki, park edilen arabaların yarısından fazlası gri SUV'lerdir ve başka birinin arabasını alırsınız. Bir sonraki gri SUV sahibi yanlış bir tane alır ve devam eder.
>
> Eğer valet’e "PR3ACT" ruhsat plakalı gri bir SUV kullandığınızı belirtirseniz, arabanızın geri döneceğinden emin olabilirsiniz.

Kural olarak, asla bir dizinin veya döngünün indeksini `key` olarak kullanmayın. Liste öğesi değerinin kendisini kullanın veya öğeler için benzersiz bir ID oluşturup bunu kullanın:

```jsx
const todos = [
  { id: 1, text: 'uyan' },
  { id: 2, text: 'yatağı yap' }
]

export default function ToDos() {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

Unutmayın: Eğer gerçekten kararlı bir anahtar bulamıyorsanız, `key` propunu tamamen atlamak, indeksi anahtar olarak kullanmaktan daha iyidir.

## Deneyin!

Bu bölümün alıştırması için, anahtarlar hakkında öğrendiklerimizi önceki bölümdeki yan etkilerle birleştireceğiz.


Alıştırma Detayları

`` ilk renderlandığında sağlanan `getTodos()` işlevini çağırmak için bir etki kullanın. Bu işlevin bir Promise döndürdüğünü unutmayın, bu Promise’in değerini almak için `.then(value => { })` çağrısını kullanabilirsiniz. Promise’in değerini elde ettiğinizde, bunu `todos` useState kancasında depolamak için ilişkili `setTodos` yöntemini çağırın.

Son olarak, JSX’i her bir `todos` öğesini .text özellik değerini içeren bir `` olarak render etmek için güncelleyin.



  🎉 Tebrikler!
  
    Bölümün ikinci sonuna geldiniz ve listeleri etkili bir şekilde render etmeyi öğrendiniz.
  



```js:setup
useRealm(function (realm) {
  // uygulama öğesi
  var out = realm.globalThis.document.body.firstElementChild;
  var options = require('preact').options;

  var oldRender = options.__r;
  var timer;
  options.__r = function(vnode) {
    timer = setTimeout(check, 10);
    if (oldRender) oldRender(vnode);
  };

  function check() {
    timer = null;
    var c = out.firstElementChild.children;
    if (
      c.length === 2 &&
      /learn preact/i.test(c[0].textContent) &&
      /make an awesome app/i.test(c[1].textContent)
    ) {
      solutionCtx.setSolved(true);
    }
  }

  return () => {
    options.__r = oldRender;
  };
});
```


```jsx:repl-initial
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const wait = ms => new Promise(r => setTimeout(r, ms))

const getTodos = async () => {
  await wait(500);
  return [
    { id: 1, text: 'learn Preact', done: false },
    { id: 2, text: 'make an awesome app', done: false },
  ]
}

function TodoList() {
  const [todos, setTodos] = useState([])

  return (
    <ul>
    </ul>
  )
}

render(<TodoList />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const wait = ms => new Promise(r => setTimeout(r, ms))

const getTodos = async () => {
  await wait(500);
  return [
    { id: 1, text: 'learn Preact', done: false },
    { id: 2, text: 'make an awesome app', done: false },
  ]
}

function TodoList() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    getTodos().then(todos => {
      setTodos(todos)
    })
  }, [])

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  )
}

render(<TodoList />, document.getElementById("app"));