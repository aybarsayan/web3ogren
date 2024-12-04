---
title: Durum Yapısını Seçme
seoTitle: Durum Yapısını Seçme - React Öğrenin
sidebar_position: 4
description: Durum yapısını seçerken dikkat edilmesi gereken ilkeler ve ipuçları. Gereksiz durumlardan nasıl kaçınacağınızı öğrenin.
tags: 
  - React
  - State Management
  - Best Practices
keywords: 
  - durum
  - React
  - bileşen
  - yapılandırma
  - teknik terimler
---
Durumu iyi yapılandırmak, değiştirilmesi ve hata ayıklanması kolay bir bileşen ile sürekli hata kaynağı olan bir bileşen arasında fark yaratabilir. İşte durum yapılandırırken dikkate almanız gereken bazı ipuçları.





* Tek bir durum değişkeni mi, yoksa birden fazla mı kullanmanız gerektiğine karar verme
* Durumu organize ederken kaçınılması gerekenler
* Durum yapısındaki yaygın sorunları nasıl düzelteceğiniz



## Durum Yapılandırma İlkeleri {/*principles-for-structuring-state*/}

Bir durum tutan bileşen yazarken, ne kadar çok durum değişkeni kullanacağınıza ve verilerinin şeklinin ne olacağına dair seçimler yapmanız gerekecektir. Alt optimal bir durum yapısı ile doğru programlar yazmak mümkün olsa da, sizi daha iyi seçimler yapmaya yönlendirebilecek birkaç ilke vardır:

1. **İlgili durumu gruplandırın.** Eğer her zaman iki veya daha fazla durum değişkenini aynı anda güncelleyebiliyorsanız, onları tek bir durum değişkeninde birleştirmeyi düşünün.
2. **Durumda çelişkilerden kaçının.** Durum, birkaç parçanın birbiriyle çeliştiği ve "anlaşmazlık" içinde olduğu bir şekilde yapılandırıldığında, hatalara kapı açarsınız. Bunu önlemeye çalışın.
3. **Gereksiz durumlardan kaçının.** Bir bileşenin prop'larından veya mevcut durum değişkenlerinden bazı bilgileri, render sırasında hesaplayabiliyorsanız, o bilgiyi bileşenin durumuna koymamalısınız.
4. **Durumda tekrarı önleyin.** Aynı verilerin birden fazla durum değişkeni arasında veya iç içe geçmiş nesneler içinde tekrarı varsa, bunları senkronize tutmak zorlaşır. Mümkünse tekrarları azaltın.
5. **Derin iç içe geçmiş durumdan kaçının.** Derin hiyerarşik durum güncellenmesi pek pratik değildir. Mümkün olduğunca, durumu düz bir şekilde yapılandırmayı tercih edin.

Bu ilkelerin arkasındaki amaç, *durumu güncellemeyi hatalar oluşturmaktan kaçınarak kolay hale getirmek*'tir. Durumdan gereksiz ve tekrar eden verileri kaldırmak, tüm parçalarının senkronize kalmasını sağlamaya yardımcı olur. Bu, bir veritabanı mühendisinin hataları azaltmak için veritabanı yapısını ["normalleştirmek"](https://docs.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description) istemesine benzer. Albert Einstein'dan alıntı yaparsak, **"Durumunuzu mümkün olan en basit hale getirin--ama daha basit değil."**

Şimdi bu ilkelerin nasıl uygulandığına bakalım.

## İlgili Durumu Gruplandırın {/*group-related-state*/}

Bazen tek bir durum değişkeni mi yoksa birden fazla mı kullanmanız gerektiği konusunda kararsız kalabilirsiniz.

Bunu yapmalı mısınız?

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

Yoksa bunu mu?

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Teknik olarak, bu iki yaklaşımdan birini kullanabilirsiniz. Ama **eğer iki durum değişkeni her zaman birlikte değişiyorsa, onları tek bir durum değişkenine birleştirmek iyi bir fikir olabilir.** Bu durumda, bunları senkronize tutmayı unutmayacaksınız, tıpkı imleci hareket ettirmenin kırmızı noktanın her iki koordinatını güncellediği bu örnek gibi:



```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```



Veri gruplamanın bir başka durumuysa, kaç tane durum parçasına ihtiyacınız olacağını bilmediğinizde meydana gelir. Örneğin, kullanıcının özel alanlar ekleyebildiği bir formda bu yardımcı olur.

:::warning
Eğer durum değişkeniniz bir nesne ise, `sadece bir alanı güncelleyemeyeceğinizi` unutmayın. Yukarıdaki örnekte `setPosition({ x: 100 })` yapamazsınız çünkü `y` özelliği hiç olmayacaktır! Bunun yerine, yalnızca `x`’i ayarlamak istiyorsanız, ya `setPosition({ ...position, x: 100 })` yapmalısınız ya da bunları iki durum değişkenine ayırıp `setX(100)` yapmalısınız.
:::

## Durumda Çelişkilerden Kaçının {/*avoid-contradictions-in-state*/}

İşte `isSending` ve `isSent` durum değişkenlerine sahip bir otel geri bildirim formu:



```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Geri bildiriminiz için teşekkürler!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>The Prancing Pony'deki konaklamanız nasıldı?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Gönder
      </button>
      {isSending && <p>Gönderiliyor...</p>}
    </form>
  );
}

// Mesaj göndermeyi taklit edin.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```



Bu kod çalışsa da, "imkansız" durumlara kapı açmaktadır. Örneğin, `setIsSent` ve `setIsSending`'i birlikte çağırmayı unuturken, hem `isSending` hem de `isSent`’in aynı anda `true` olduğu bir duruma düşebilirsiniz. Bileşeniniz ne kadar karmaşık olursa, ne olduğunu anlamak o kadar zorlaşır.

**Çünkü `isSending` ve `isSent` aynı anda asla `true` olmamalıdır, bunların yerini alacak tek bir `status` durum değişkeni kullanmak daha iyidir; bu da üç geçerli durumdan birini alabilir:** `'typing'` (başlangıç), `'sending'` ve `'sent'`:



```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
    return <h1>Geri bildiriminiz için teşekkürler!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>The Prancing Pony'deki konaklamanız nasıldı?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Gönder
      </button>
      {isSending && <p>Gönderiliyor...</p>}
    </form>
  );
}

// Mesaj göndermeyi taklit edin.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```



Okunabilirlik için bazı sabitler de tanımlayabilirsiniz:

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```

Ama bunlar durum değişkeni olmadıkları için, birbirleriyle senkronize olma konusunda endişelenmenize gerek yoktur.

## Gereksiz Durumlardan Kaçının {/*avoid-redundant-state*/}

Eğer bileşenin prop'larından veya mevcut durum değişkenlerinden bazı bilgileri, render sırasında hesaplayabiliyorsanız, o bilgiyi bileşenin durumuna koymamalısınız.

Örneğin, bu formu ele alalım. Çalışıyor ama içinde herhangi bir gereksiz durum bulabiliyor musunuz?



```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Hoş geldiniz</h2>
      <label>
        İlk ad:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Soyad:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Biletiniz şu kişi adına düzenlenecek: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```



Bu formun üç durum değişkeni vardır: `firstName`, `lastName` ve `fullName`. Ancak, `fullName` gereksizdir. **`fullName`'i her zaman render sırasında `firstName` ve `lastName`'den hesaplayabilirsiniz, bu yüzden durumdan kaldırmalısınız.**

Bunu şöyle yapabilirsiniz:



```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Hoş geldiniz</h2>
      <label>
        İlk ad:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Soyad:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Biletiniz şu kişi adına düzenlenecek: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```



Burada `fullName` *durum değişkeni değildir*. Bunun yerine, render sırasında hesaplanır:

```js
const fullName = firstName + ' ' + lastName;
```

Sonuç olarak, değişiklik yöneticilerinin güncellemek için herhangi bir özel şey yapmasına gerek yoktur. `setFirstName` veya `setLastName`'ı çağırdığınızda, yeniden render tetiklenir ve ardından bir sonraki `fullName` güncel verilerle hesaplanır.



#### Props'ları durum içinde yansıtmayın {/*don-t-mirror-props-in-state*/}

Gereksiz durum değişkenlerinin yaygın bir örneği aşağıdaki gibidir:

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

Burada, `color` durum değişkeni `messageColor` prop'una atanır. Sorun şu ki, **eğer üst bileşen daha sonra `messageColor`'ın farklı bir değerini geçirirse (örneğin, `'red'` yerine `'blue'`), `color` *durum değişkeni* güncellenmez!** Durum yalnızca ilk render sırasında başlatılır.

Bu yüzden bazı bir prop'u bir durum değişkeninde "yansıtmak", karışıklığa yol açabilir. Bunun yerine, `messageColor` prop'unu doğrudan kodunuzda kullanın. Eğer ona daha kısa bir isim vermek istiyorsanız, bir sabit kullanın:

```js
function Message({ messageColor }) {
  const color = messageColor;
```

Bu durumda, prop'un üst bileşenden geçen değeri ile senkronize olmayacak.

Durumda "yansıtmak", belirli bir prop için tüm güncellemeleri görmezden gelmek istediğinizde mantıklıdır. Bir kural olarak, prop adının başına `initial` veya `default` ekleyin, böylece yeni değerlerinin görmezden gelindiği açık olsun:

```js
function Message({ initialColor }) {
  // `color` durum değişkeni `initialColor`'ın *ilk* değerini tutar.
  // `initialColor` prop'unun daha sonraki değişiklikleri görmezden gelinir.
  const [color, setColor] = useState(initialColor);
```



## Durumda Tekrarı Önleyin {/*avoid-duplication-in-state*/}

Bu menü listesi bileşeni, birkaç seçenek arasından tek bir seyahat atıştırmalığı seçmenizi sağlar:



```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <h2>Seyahat atıştırmalığınız nedir?</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Seç</button>
          </li>
        ))}
      </ul>
      <p>Seçiminiz: {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```



Mevcut durumda, seçilen öğe `selectedItem` durum değişkeninde bir nesne olarak saklanmaktadır. Ancak bu pek iyi değildir: **`selectedItem` içindeki içerik, `items` listesindeki öğelerle aynı nesnedir.** Bu, öğe hakkında bilginin iki yerde tekrarlandığı anlamına gelir.

Bu bir sorun. Şimdi her öğeyi düzenlenebilir yapalım:



```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>Seyahat atıştırmalığınız nedir?</h2> 
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Seç</button>
          </li>
        ))}
      </ul>
      <p>Seçiminiz: {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```



Dikkat edin, eğer önce bir öğeye "Seç" butonuna tıklayıp *sonra* düzenlerseniz, **input güncelleniyor ama altındaki etiket güncellemiyor.** Bunun nedeni, tekrarlayan bir durumunuz var ve `selectedItem`'ı güncellemeyi unuttunuz.

`selectedItem`'ı güncellemeyi de yapabilirsiniz ama daha kolay bir çözüm tekrarları ortadan kaldırmaktır. Bu örnekte, `selectedItem` nesnesi olmak yerine durumda yalnızca `selectedId` tutarak, ardından o öğeyi bulmak için `items` dizisinde arama yapabilirsiniz:



```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>Seyahat atıştırmalığınız nedir?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>Seç</button>
          </li>
        ))}
      </ul>
      <p>Seçiminiz: {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```



Durum şu şekilde tekrarlanmış:

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedItem = {id: 0, title: 'pretzels'}`

Ama değişimden sonra şöyle oldu:

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedId = 0`

Tekrar ortadan kalktı ve yalnızca gerekli durumu koruyorsunuz!

Artık seçilen öğeyi düzenlediğinizde, alttaki mesaj hemen güncellenecektir. Bunun nedeni, `setItems`'ın yeniden render tetiklemesi ve `items.find(...)`'in güncellenmiş başlığı olan öğeyi bulmasıdır. *Seçilen öğeyi* duruma tutmamanıza gerek yoktur, çünkü yalnızca *seçilen ID* önemlidir; geri kalanını render sırasında hesaplayabilirsiniz.