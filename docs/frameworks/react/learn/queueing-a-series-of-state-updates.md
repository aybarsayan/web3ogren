---
title: Durum Güncellemeleri Sırasını Bekletme
seoTitle: React Durum Güncellemeleri ve Gruplama
sidebar_position: 4
description: Bir durum değişkenini ayarlamanın, bir sonraki renderı nasıl etkilediğini ve Reactin durum güncellemelerini nasıl grupladığını anlayın. Bu makalede, güncelleyici fonksiyonlarının nasıl çalıştığını da keşfedeceksiniz.
tags: 
  - React
  - durum güncellemeleri
  - gruplama
  - performans
keywords: 
  - React
  - durum güncellemeleri
  - gruplama
  - güncelleyici fonksiyonu
---
Bir durum değişkenini ayarlamak, bir başka render'ı sıraya alır. Ancak bazen, bir sonraki render'ı sıraya almadan önce değeri üzerinde birden fazla işlem yapmak isteyebilirsiniz. Bunu yapmak için, React'in durum güncellemelerini nasıl grupladığını anlamak yardımcı olur.





* "Gruplamanın" ne olduğunu ve React'in birden fazla durum güncellemesini işlemek için bunu nasıl kullandığını
* Aynı durum değişkenine ardışık birkaç güncelleme uygulama



## React, durum güncellemelerini gruplar {/*react-batches-state-updates*/}

:::tip
Bir durum güncellenmesi sırası, performansı artırır çünkü gereksiz yeniden render işlemlerinden kaçınmanıza yardımcı olur.
:::

"+3" butonuna tıkladığınızda, `setNumber(number + 1)`'in üç kez çağrılması nedeniyle sayacın üç kez artmasını bekleyebilirsiniz:



```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```



Ancak, önceki bölümde hatırlayabileceğiniz gibi, `her render'ın durum değerleri sabittir`, bu nedenle ilk render'ın olay yöneticisindeki `number` değeri her zaman `0`'dır; `setNumber(1)`'i kaç kez çağırırsanız çağırın:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

:::note
React, olay yöneticilerindeki tüm kod çalışmadan önce durum güncellemelerinizi işlemek için bekler.
:::

Bu, bir garsonun restoranın mutfağına sipariş almak için koşmadığını hatırlatabilir. Bir garson ilk yemeğinizin adını duyduğunda mutfağa gitmez. Aksine, siparişinizi tamamlamanızı, ona değişiklik yapmanızı ve hatta masadaki diğer kişilerden sipariş almasını bekler.



Bu, birden fazla durum değişkenini güncellemeyi sağlar—hatta birden fazla bileşenden bile—çok fazla `yeniden render tetiklenmeden.` Ancak bu durum, kullanıcı arayüzünün, olay yöneticiniz tamamlanana kadar güncellenmeyeceği anlamına da gelir. Bu davranış, **gruplama** olarak da bilinir ve React uygulamanızın çok daha hızlı çalışmasını sağlar. Ayrıca yalnızca bazı değişkenler güncellenmişken "yarıda kalmış" render'lar ile uğraşmak zorunda kalmazsınız.

**React, *birden fazla* kasıtlı olay (tıklama gibi) arasında grup oluşturmaz**—her tıklama ayrı olarak ele alınır. React'in grup işlemini yalnızca genel olarak güvenli olduğu durumlarda gerçekleştirdiğinden emin olabilirsiniz. Bu, örneğin, ilk buton tıklamasının bir formu devre dışı bırakması durumunda, ikinci tıklamanın onu tekrar göndermeyeceği anlamına gelir.

## Bir sonraki render'dan önce aynı durumu birden fazla kez güncelleme {/*updating-the-same-state-multiple-times-before-the-next-render*/}

Bu, yaygın bir kullanım durumu değildir, ancak bir sonraki render'dan önce aynı durum değişkenini birden fazla kez güncellemek istiyorsanız, *bir sonraki durum değerini* geçmek yerine `setNumber(number + 1)` gibi, kuyruğun bir öncekine dayalı olarak bir sonraki durumu hesaplayan bir *fonksiyon* geçebilirsiniz; bu da `setNumber(n => n + 1)` şeklindedir. Bu, React'e durum değerini "bir şey yap" demenin bir yoludur.

Kaç sayacını artırmayı deneyin:



```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```



Burada, `n => n + 1` bir **güncelleyici fonksiyonu** olarak adlandırılır. Bunu bir durum ayarlayıcısına geçirdiğinizde:

1. React, bu fonksiyonu olay yöneticisindeki diğer tüm kod çalıştıktan sonra işlenecek şekilde sıraya alır.
2. Bir sonraki render sırasında, React sıradan geçer ve size son güncellenmiş durumu verir.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

| kuyruklanan güncelleme | `n` | döndürür |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React, `useState`'den dönerken son sonucu 3 olarak saklar.

Bu nedenle, yukarıdaki örnekte "+3" tıkladığınızda değer doğru bir şekilde 3 artar.

### Durumu değiştirdikten sonra güncelleme ne olur {/*what-happens-if-you-update-state-after-replacing-it*/}

Bu olay yöneticisi ne yapar? Bir sonraki render'da `number` ne olur?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```



```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Sayısı artır</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```



Bu olay yöneticisinin React'e ne yapacağını söyleyip:

1. `setNumber(number + 5)`: `number` `0`'dır, bu nedenle `setNumber(0 + 5)`. React, *"değeri `5` ile değiştir"* demeyi kuyruğa ekler.
2. `setNumber(n => n + 1)`: `n => n + 1` bir güncelleyici fonksiyondur. React, *o fonksiyonu* kuyruğa ekler.

Bir sonraki render'da React, durum kuyruğunu işler:

| kuyruklanan güncelleme | `n` | döndürür |
|--------------|---------|-----|
| "değeri `5` ile değiştir" | `0` (kullanılmamış) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React, `6` değerini son sonuç olarak saklar ve `useState`'den döner.



`setState(5)` komutunun aslında `setState(n => 5)` gibi çalıştığını fark etmiş olmalısınız, ancak `n` kullanılmamış durumda!


### Durumu güncelledikten sonra değiştirdiğinizde ne olur {/*what-happens-if-you-replace-state-after-updating-it*/}

Bir örnek daha deneyelim. Bir sonraki render'da `number` ne olur?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```



```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Sayısı artır</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```



React'in bu kod satırlarını çalıştırırken nasıl yürütüldüğü:

1. `setNumber(number + 5)`: `number` `0`'dır, bu nedenle `setNumber(0 + 5)`. React, *"değeri `5` ile değiştir"* demeyi kuyruğa ekler.
2. `setNumber(n => n + 1)`: `n => n + 1` bir güncelleyici fonksiyondur. React, *o fonksiyonu* kuyruğa ekler.
3. `setNumber(42)`: React, *"değeri `42` ile değiştir"* demeyi kuyruğa ekler.

Bir sonraki render'da React, durum kuyruğunu işler:

| kuyruklanan güncelleme | `n` | döndürür |
|--------------|---------|-----|
| "değeri `5` ile değiştir" | `0` (kullanılmamış) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "değeri `42` ile değiştir" | `6` (kullanılmamış) | `42` |

Sonra React, `42` değerini son sonuç olarak saklar ve `useState`'den döner.

Özetlemek gerekirse, `setNumber` durum ayarlayıcısına verdiğiniz değerleri şu şekilde düşünebilirsiniz:

* **Bir güncelleyici fonksiyonu** (örneğin `n => n + 1`) kuyruğa eklenir.
* **Herhangi bir başka değer** (örneğin sayi `5`) kuyrukta zaten ne varsa göz ardı edilerek "değeri `5` ile değiştir" ekler.

Olay yöneticisi tamamlandıktan sonra, React yeniden render işlemini tetikleyecektir. Yeniden render sırasında, React sırayı işleyecektir. Güncelleyici fonksiyonlar render sırasında çalıştığı için, **güncelleyici fonksiyonlar `saf`** olmalı ve yalnızca sonucu döndürmelidir. Onların içinde durumu ayarlamaya çalışmayın veya başka yan etkiler çalıştırmayın. Strict Modda, React her bir güncelleyici fonksiyonunu iki kez çalıştırır (ancak ikinci sonucu atar) - bu, hataları bulmanıza yardımcı olur.

### İsimlendirme kuralları {/*naming-conventions*/}

Güncelleyici fonksiyon argümanını, ilgili durum değişkeninin ilk harfleri ile adlandırma yaygındır:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Daha ayrıntılı kod istemiyorsanız, başka bir yaygın kural, tam durum değişkeni adıyla tekrarlamak veya bir ön ek kullanmaktır; örneğin `setEnabled(enabled => !enabled)` veya `setEnabled(prevEnabled => !prevEnabled)`.



* Durumu ayarlamak, mevcut render'daki değişkeni değiştirmez, ancak yeni bir render isteğinde bulunur.
* React, durum güncellemelerini olay yöneticileri çalışmayı bitirdikten sonra işler. Bu, gruplama olarak adlandırılır.
* Bir olayda bazı durumları birden fazla kez güncellemek için `setNumber(n => n + 1)` güncelleyici fonksiyonunu kullanabilirsiniz.





#### Bir istek sayacı düzeltin {/*fix-a-request-counter*/}

Bir sanat pazarı uygulaması üzerinde çalışıyorsunuz ve kullanıcıya aynı anda bir sanat eşyası için birden fazla sipariş verme hakkı tanıyorsunuz. Kullanıcı "Satın Al" butonuna her bastığında "Bekleyen" sayaç bir artmalıdır. Üç saniye sonra, "Bekleyen" sayacı düşmeli ve "Tamamlanan" sayacı artmalıdır.

Ancak, "Bekleyen" sayacı beklenildiği gibi davranmıyor. "Satın Al" butonuna bastığınızda, değer `-1`'e düşüyor (bu mümkün olmamalıdır!). Üst üste hızlı tıklarsanız, her iki sayaç da beklenmedik davranış gösteriyor.

Bu neden oluyor? Her iki sayacı düzeltin.



```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Bekleyen: {pending}
      </h3>
      <h3>
        Tamamlandı: {completed}
      </h3>
      <button onClick={handleClick}>
        Satın Al     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```





`handleClick` olay yöneticisinde, `pending` ve `completed` değerleri tıklama olayının gerçekleştiği zamandaki değerlere karşılık gelir. İlk render için `pending` `0` olduğundan, `setPending(pending - 1)` `setPending(-1)` olur ve bu yanlıştır. Sayaçları *arttırmak* veya *azaltmak* istediğinizden, tıklama anında belirli bir değere ayarlamak yerine, güncelleyici fonksiyonları geçirmeniz daha iyidir:



```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Bekleyen: {pending}
      </h3>
      <h3>
        Tamamlandı: {completed}
      </h3>
      <button onClick={handleClick}>
        Satın Al     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```



Bu, bir sayacı artırırken veya azaltırken, en son durumuna göre artırma veya azaltma işlemi yapmanıza olanak tanır.



#### Durum kuyruğunu kendiniz uygulayın {/*implement-the-state-queue-yourself*/}

Bu zorlukta, React'in çok küçücük bir kısmını sıfırdan yeniden uygulayacaksınız! Duyulması zor değil.

Sanal alanını kaydırın. Dört test durumunu gösterdiğine dikkat edin. Bunlar, bu sayfada gördüğünüz örneklere karşılık gelir. Göreviniz `getFinalState` fonksiyonunu uygulamak ve bu durumda her biri için doğru sonucu döndürmektir. Doğru bir şekilde uygularsanız, dört test de geçmelidir.

İki argüman alacaksınız: `baseState` başlangıç durumu (örn. `0`), ve `queue` karışık sayıları (örn. `5`) ve güncelleyici fonksiyonları (örn. `n => n + 1`) içeren bir dizi.

Göreviniz, son durumu döndürmektir, tam olarak bu sayfadaki tabloların gösterdiği gibi!



Eğer sıkışmış gibi hissediyorsanız, şu kod yapısıyla başlayın:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: güncelleyici fonksiyonu uygula
    } else {
      // TODO: durumu değiştir
    }
  }

  return finalState;
}
```

Eksik satırları doldurun!





```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: kuyruk ile bir şeyler yap...

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Temel durum: <b>{baseState}</b></p>
      <p>Kuyruk: <b>[{queue.join(', ')}]</b></p>
      <p>Beklenen sonuç: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Sizin sonucu: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'doğru' :
          'yanlış'
        })
      </p>
    </>
  );
}
```





Bu, React'in son durumu hesaplamak için kullandığı sayfada belirtilen algoritmadır:



```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Güncelleyici fonksiyonu uygula.
      finalState = update(finalState);
    } else {
      // Sonraki durumu değiştir.
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Temel durum: <b>{baseState}</b></p>
      <p>Kuyruk: <b>[{queue.join(', ')}]</b></p>
      <p>Beklenen sonuç: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Sizin sonucu: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'doğru' :
          'yanlış'
        })
      </p>
    </>
  );
}
```



Artık React'in bu kısmının nasıl çalıştığını biliyorsunuz!