---
title: Durum İçindeki Dizileri Güncelleme
seoTitle: JavaScript ve Reactte Durum İçindeki Dizileri Güncelleme
sidebar_position: 4
description: Bu sayfa, Reactte durum içindeki dizilerin nasıl güncelleneceğini, dikkat edilmesi gereken yöntemleri ve en iyi uygulamaları anlatmaktadır.
tags: 
  - React
  - JavaScript
  - state management
  - arrays
  - development
keywords: 
  - React
  - JavaScript
  - state management
  - arrays
  - development
---
Diziler JavaScript'te değişken bir yapıdır, ancak durum içerisine kaydettiğinizde onlara değişmez olarak davranmalısınız. Nesnelerde olduğu gibi, durum içerisinde saklanan bir diziyi güncellemek istediğinizde, yeni bir dizi oluşturmanız (veya mevcut bir dizinin bir kopyasını yapmanız) ve ardından durumu güncellemek için yeni diziyi kullanmanız gerekir.





- React durumunda bir diziye eleman ekleme, çıkarma veya değiştirme yöntemleri
- Bir dizinin içindeki bir nesneyi güncelleme
- Immer kullanarak dizi kopyalamayı daha az tekrarlı hale getirme



## Değişiklik Olmadan Dizileri Güncelleme {/*updating-arrays-without-mutation*/}

:::tip
JavaScript'te diziler, başka bir nesne türüdür. **React durumundaki dizilere yalnızca okunabilen dizi olarak yaklaşmalısınız.**
:::

Bu, `arr[0] = 'kuş'` gibi dizinin içindeki öğeleri yeniden atamamamız gerektiği ve `push()` veya `pop()` gibi diziyi değiştiren yöntemleri kullanmamamız gerektiği anlamına gelir.

Bunun yerine, bir diziyi her güncellemek istediğinizde, durumu ayarlama işlevinize *yeni* bir dizi geçirmelisiniz. Bunu yapmak için, durumunuzdaki orijinal diziden, `filter()` veya `map()` gibi değiştirmeyen yöntemleri çağırarak yeni bir dizi oluşturabilirsiniz. Ardından durumu, sonuçta elde edilen yeni dizi ile güncelleyebilirsiniz.

İşte yaygın dizi işlemlerinin bir referans tablosu. React durumundaki dizilerle çalışırken, sol sütundaki yöntemlerden kaçınmalı ve sağ sütundaki yöntemleri tercih etmelisiniz:

|           | kaçınılması gereken (diziyi değiştirir)           | tercih edilen (yeni bir dizi döner)                                       |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| ekleme    | `push`, `unshift`                   | `concat`, `[...arr]` yayılma sözdizimi (`örnek`) |
| çıkarma   | `pop`, `shift`, `splice`            | `filter`, `slice` (`örnek`)                   |
| değiştirme | `splice`, `arr[i] = ...` ataması | `map` (`örnek`)                          |
| sıralama  | `reverse`, `sort`                   | önce diziyi kopyalayın (`örnek`)   |

Alternatif olarak, `Immer kullanabilirsiniz` ki bu, her iki sütundaki metodları kullanmanıza izin verir.



:::warning
Maalesef, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) ve [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) isimleri benzer ama oldukça farklıdır:

* `slice`, bir diziyi veya bir kısmını kopyalamanıza olanak tanır.
* `splice`, **diziyi değiştirir** (öğeleri eklemek veya silmek için).
:::

React'te `slice` (p harfi yok!) daha sık kullanılacaktır çünkü durumu değiştiren nesneleri veya dizileri istemiyoruz. `Nesneleri Güncelleme` mutasyonun ne olduğunu ve neden durum için önerilmediğini açıklar.



### Bir Diziye Ekleme {/*adding-to-an-array*/}

:::note
`push()` bir diziyi değiştirecektir, bu istemediğiniz bir durumdur:
:::



```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>İlham Veren Heykeltraşlar:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Ekle</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```



Bunun yerine, mevcut öğeleri *ve* sonunda yeni bir öğe içeren *yeni* bir dizi oluşturmalısınız. Bunu yapmanın birçok yolu vardır, ancak en kolay yol `...` [dizi yayma](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals) sözdizimini kullanmaktır:

```js
setArtists( // Durumu günceller
  [ // yeni bir dizi ile
    ...artists, // tüm eski öğeleri içeren
    { id: nextId++, name: name } // ve sonunda bir yeni öğe
  ]
);
```

Artık doğru bir şekilde çalışıyor:



```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>İlham Veren Heykeltraşlar:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Ekle</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```



Dizi yayma sözdizimi ayrıca, yeni öğeyi *orijinal `...artists`'in önüne koyarak* eklemeyi sağlar:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Eski öğeleri sonda tutar
]);
```

Bu şekilde, yayma hem `push()` ile dizinin sonuna ekleme hem de `unshift()` ile dizinin başına ekleme işini yapabilir. Bunu yukarıdaki kum havuzunda deneyin!

### Bir Diziye Eklemeyi Kaldırma {/*removing-from-an-array*/}

Bir diziden bir öğeyi kaldırmanın en kolay yolu, onu *filtrelemektir*. Diğer bir deyişle, o öğeyi içermeyen yeni bir dizi oluşturacaksınız. Bunu yapmak için `filter` yöntemini, örneğin şöyle kullanın:



```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>İlham Veren Heykeltraşlar:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Sil
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```



"Sil" butonuna birkaç kez tıklayın ve tıklama işlevine bakın.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Burada, `artists.filter(a => a.id !== artist.id)` ifadesi, "ID'si `artist.id`'den farklı olan `artists` dizisinden oluşan bir dizi oluştur" anlamına gelir. Diğer bir deyişle, her sanatçının "Sil" butonu o sanatçıyı diziden filtreler ve sonuçta elde edilen dizi ile yeniden render talep eder. `filter` yönteminin orijinal diziyi değiştirmediğini unutmayın.

### Bir Diziyi Dönüştürme {/*transforming-an-array*/}

Dizinin bazı veya tüm öğelerini değiştirmek istiyorsanız, `map()` kullanarak **yeni** bir dizi oluşturabilirsiniz. `map`'e geçireceğiniz işlev, her öğeyle ne yapılacağını, verisine veya indeksine (veya her ikisine) göre belirleyebilir.

Bu örnekte, bir dizi iki dairenin ve bir karenin koordinatlarını tutar. Butona bastığınızda yalnızca daireler 50 piksel aşağı hareket eder. Bunu, `map()` kullanarak yeni bir veri dizisi üreterek gerçekleştirir:



```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // Değişiklik yok
        return shape;
      } else {
        // Yeni bir daireyi 50px aşağı döndür
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Yeni dizi ile yeniden render yap
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Daireleri Aşağı Taşı!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```



### Bir Dizi Üzerinde Öğeleri Değiştirme {/*replacing-items-in-an-array*/}

Bir dizide bir veya daha fazla öğeyi değiştirmek yaygın bir durumdur. `arr[0] = 'kuş'` gibi atamalar, orijinal diziyi değiştirmektedir, bu nedenle bunun yerine `map` kullanmak istersiniz.

Bir öğeyi değiştirmek için, `map` ile yeni bir dizi oluşturun. `map` çağrınızın içinde, öğe indeksini ikinci argüman olarak alırsınız. Bununla, orijinal öğeyi (birinci argüman) veya başka bir şeyi döndürmeye karar verebilirsiniz:



```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Tıklanan sayacı artır
        return c + 1;
      } else {
        // Diğerleri değişmedi
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```



### Bir Diziye Ekleme {/*inserting-into-an-array*/}

Bazen, bir öğeyi ne başlangıçta ne de sonunda belirli bir konuma eklemek isteyebilirsiniz. Bunu yapmak için, `...` dizi yayma sözdizimini `slice()` yöntemi ile birleştirebilirsiniz. `slice()` yöntemi bir dizinin "dilimini" kesmenize izin verir. Bir öğe eklemek için, ekleme noktasının *öncesindeki* dilimi yayarak, sonra yeni öğeyi ve ardından başlangıç dizisinin geri kalanını oluşturmalısınız.

Bu örnekte, Ekle butonu her zaman `1` indeksinde ekleme yapar:



```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Herhangi bir indeks olabilir
    const nextArtists = [
      // Ekleme noktasından önceki öğeler:
      ...artists.slice(0, insertAt),
      // Yeni öğe:
      { id: nextId++, name: name },
      // Ekleme noktasından sonraki öğeler:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>İlham Veren Heykeltraşlar:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Ekle
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```



### Bir Dizide Diğer Değişiklikler Yapma {/*making-other-changes-to-an-array*/}

Bazı şeyleri yalnızca yayma sözdizimi ve değiştirmeyen yöntemler (örneğin `map()` ve `filter()` gibi) ile yapamazsınız. Örneğin, bir diziyi tersine çevirmek veya sıralamak isteyebilirsiniz. JavaScript `reverse()` ve `sort()` yöntemleri, orijinal diziyi değiştirir, bu nedenle bunları doğrudan kullanamazsınız.

**Ancak, önce diziyi kopyalama işlemini yapabilir ve ardından üzerinde değişiklik yapabilirsiniz.**

Örneğin:



```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Büyük Göbekler' },
  { id: 1, title: 'Ay Manzarası' },
  { id: 2, title: 'Terracotta Ordu' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Ters Çevir
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```



Burada, önce orijinal dizinin bir kopyasını oluşturmak için `[...list]` yayma sözdizimini kullanıyorsunuz. Artık bir kopyaya sahip olduğunuz için, `nextList.reverse()` veya `nextList.sort()` gibi değiştiren yöntemleri kullanabilir veya `nextList[0] = "bir şey"` şeklinde bireysel öğeleri atayabilirsiniz.

Ancak, **kopyalanmış bir diziyi bile, içindeki mevcut öğeleri doğrudan değiştiremiyorsunuz.** Bunun nedeni kopyalamanın yüzeysel olmasıdır; yeni dizi, orijinal dizinin aynı öğelerini içerecektir. Dolayısıyla, kopyalanmış dizinin içindeki bir nesneyi değiştirirseniz, mevcut durumu değiştirirsiniz. Örneğin, aşağıdaki gibi bir kod sorundur.

```js
const nextList = [...list];
nextList[0].seen = true; // Sorun: list[0]'ı değiştirir
setList(nextList);
```

`nextList` ve `list` iki farklı dizi olmasına rağmen, **`nextList[0]` ve `list[0]` aynı nesneye işaret eder.** Bu nedenle, `nextList[0].seen` değerini değiştirerek, `list[0].seen` değerini de değiştiriyorsunuz. Bu bir durum değişikliği yaratır ki, bunları önlemek gereklidir! Bu durumu, `iç içe JavaScript nesnelerini güncelleme` ile ilgili benzer bir yöntemle çözebilirsiniz; değiştirmek istediğiniz bireysel öğeleri kopyalayarak yapmalısınız. İşte şöyle.

## Diziler İçinde Nesneleri Güncelleme {/*updating-objects-inside-arrays*/}

Nesneler gerçekten dizilerin "içinde" bulunmazlar. Kodda "içinde" gibi görünebilirler, ancak bir dizideki her nesne ayrı bir değerdir ki dizi bu değere "işaret eder". Bu yüzden `list[0]` gibi iç içe alanları değiştirirken dikkatli olmalısınız. Başka bir kişinin sanat eserleri listesi, dizinin aynı öğesine işaret edebilir!

:::info
**İç içe durumu güncellerken, güncellemek istediğiniz noktadan itibaren kopyalar oluşturmalısınız, bu işlemi en üst seviyeye kadar sürdürmelisiniz.**
:::

Bu örnekte, iki ayrı sanat eserleri listesi aynı başlangıç durumuna sahiptir. İzole olmaları bekleniyor ama bir değişiklik nedeniyle durumları yanlışlıkla paylaşılır ve bir listede bir kutu işaretlemek, diğer listeyi etkiler:



```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Büyük Göbekler', seen: false },
  { id: 1, title: 'Ay Manzarası', seen: false },
  { id: 2, title: 'Terracotta Ordu', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Sanat Hedef Listem</h1>
      <h2>Görmem Gereken Sanatlar:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Görmen Gereken Sanatlar:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```



Sorun, aşağıdaki gibi bir kodda bulunur:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Sorun: var olan bir öğeyi değiştirir
setMyList(myNextList);
```

`myNextList` dizisi yeni olmasına rağmen, *öğelerin kendileri* hala orijinal `myList` dizisindeki öğeler ile aynıdır. Bu nedenle, `artwork.seen` değişikliği, *orijinal* sanat eseri öğesini değiştiriyor. Bu sanat eseri öğesi ayrıca `yourList`'te de yer aldığından, hata meydana geliyor. Bu tür hatalar karmaşık olabilir, ancak durumu değiştirdiğinizde kaybolurlar.

**`map` kullanarak eski bir öğeyi güncellenmiş versiyonu ile değiştirerek durumu değiştirmeden güncelleyebilirsiniz.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Değişiklik içeren *yeni* bir nesne oluşturun
    return { ...artwork, seen: nextSeen };
  } else {
    // Değişiklik yok
    return artwork;
  }
}));
```

Burada, `...` nesne yayma sözdizimi, `bir nesneyi kopyalamak için kullanılır.`

Bu yaklaşım ile mevcut durum öğelerinin hiçbiri değiştirilmez ve hata düzeltilmiş olur:



```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Büyük Göbekler', seen: false },
  { id: 1, title: 'Ay Manzarası', seen: false },
  { id: 2, title: 'Terracotta Ordu', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Değişiklik içeren *yeni* bir nesne oluşturun
        return { ...artwork, seen: nextSeen };
      } else {
        // Değişiklik yok
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Değişiklik içeren *yeni* bir nesne oluşturun
        return { ...artwork, seen: nextSeen };
      } else {
        // Değişiklik yok
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Sanat Hedef Listem</h1>
      <h2>Görmem Gereken Sanatlar:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Görmen Gereken Sanatlar:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```



Genel olarak, **sadece yeni oluşturduğunuz nesneleri değiştirmelisiniz.** Eğer yeni bir sanat eseri ekliyorsanız, onu değiştirebilirken, zaten durumu etkileyen bir şeyle işlem yapıyorsanız kopyalar oluşturmanız gerekmektedir.