---
title: Durumda Nesneleri Güncelleme
seoTitle: React State Management Updating Objects
sidebar_position: 4
description: Bu içerik, Reactte durum nesnelerini nasıl güncelleyeceğinizi açıklamaktadır. Doğru güncellemeleri yapmayı ve mutasyon sorunlarını aşmayı öğrenin.
tags: 
  - React
  - State Management
  - Immutable State
  - JavaScript
keywords: 
  - React
  - State
  - Update
  - Immutable
  - JavaScript
---
Durum, nesneler de dahil olmak üzere herhangi bir JavaScript değerini tutabilir. Ancak, React durumunda tuttuğunuz nesneleri doğrudan değiştirmemelisiniz. Bunun yerine, bir nesneyi güncellemek istediğinizde, yeni bir nesne oluşturmanız (veya mevcut bir nesneyi kopyalamanız) ve ardından durumu bu kopyayı kullanacak şekilde ayarlamanız gerekir.





- React durumunda bir nesneyi doğru bir şekilde nasıl güncelleyeceğiniz
- Bir nesneyi mutasyona uğratmadan nasıl güncelleyeceğinizi
- İmmutabilitenin ne olduğunu ve bunu nasıl kırmamanız gerektiğini
- Immer ile nesne kopyalamayı nasıl daha az tekrarlı hale getirebileceğinizi



## Mutasyon nedir? {/*whats-a-mutation*/}

Durumda herhangi bir tür JavaScript değerini saklayabilirsiniz.

```js
const [x, setX] = useState(0);
```

Şimdiye kadar sayılar, dizeler ve boolean'larla çalışıyordunuz. Bu tür JavaScript değerleri "değişmez"dir, yani değiştirilemez veya "salt okunur" anlamına gelir. Bir değeri _değiştirmek_ için yeniden bir render tetikleyebilirsiniz:

```js
setX(5);
```

`x` durumu `0`'dan `5`'e değişti, ancak _sayının `0` kendisi_ değişmedi. JavaScript'teki yerleşik ilkel değerlerden (sayılar, dizeler ve booleolar gibi) herhangi bir değişiklik yapmanız mümkün değildir.

Şimdi durumdaki bir nesneyi düşünelim:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Teknik olarak, _nesnenin içeriğini_ değiştirmek mümkündür. **Bu duruma mutasyon denir:**

```js
position.x = 5;
```

Ancak, React durumundaki nesneler teknik olarak değiştirilebilir olsa da, onları **değişmezmiş gibi** ele almanız gerekir--tıpkı sayılar, booleolar ve dizeler gibi. Onları mutasyona uğratmak yerine, her zaman değiştirmeniz gerekir.

## Durumu salt okunur olarak ele alın {/*treat-state-as-read-only*/}

Başka bir deyişle, duruma koyduğunuz herhangi bir JavaScript nesnesini **salt okunur olarak ele almalısınız.**

Bu örnek, mevcut gösterim konumunu temsil etmek için bir nesneyi durum içinde tutar. Kırmızı noktanın, ön izleme alanına dokunduğunuzda veya gösterimin üstünde hareket ettirdiğinizde hareket etmesi beklenmektedir. Ancak nokta, başlangıç konumunda kalmaktadır:



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
        position.x = e.clientX;
        position.y = e.clientY;
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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```



Sorun, bu kod parçasındadır.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

Bu kod, `position`'a atanan nesneyi `önceki render'dan.` değiştirir. Ancak durum ayarlama fonksiyonunu kullanmadan, React nesnenin değiştiğini bilmez. Bu nedenle React, tepki vermez. Bu, yemek yedikten sonra siparişi değiştirmeye çalışmak gibidir. Durumu mutasyona uğratmak bazı durumlarda işe yarayabilir, ancak bunu öneremeyiz. Render'da erişiminiz olan durum değerini salt okunur olarak ele almalısınız.

Gerçekten bir `yeniden render tetiklemek` için, **yeni bir nesne oluşturun ve durum ayarlama fonksiyonuna iletin:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

`setPosition` ile, React'a şunu söylüyorsunuz:

* `position`'ı bu yeni nesne ile değiştir
* Ve bu bileşeni tekrar render et

Kırmızı noktanın artık gösterim alanına dokundukça veya üzerine geldiğinizde nasıl hareket ettiğini fark edin:



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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```





#### Yerel mutasyon sorun değildir {/*local-mutation-is-fine*/}

Bunun gibi bir kod sorunludur çünkü durumdaki *mevcut* bir nesneyi değiştirir:

```js
position.x = e.clientX;
position.y = e.clientY;
```

Ama bu kod **tamamen uygundur** çünkü sadece *yeni oluşturduğunuz* bir nesneyi değiştiriyorsunuz:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

Aslında, bu şu şekilde yazmakla tamamen eşdeğerdir:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Mutasyon yalnızca durumda zaten var olan *mevcut* nesneleri değiştirdiğinizde bir sorun teşkil eder. Henüz kimsenin referans vermediği bir nesneyi mutasyona uğratmak kabul edilebilir çünkü değiştirmek, buna bağlı olan bir şeyi kazara etkilemeyecektir. Bunu "yerel mutasyon" olarak adlandırıyoruz. Yerel mutasyonu, `render ederken` bile yapabilirsiniz. Çok uygun ve tamamen kabul edilebilir!

  

## Yayılma sözdizimi ile nesne kopyalama {/*copying-objects-with-the-spread-syntax*/}

Önceki örnekte, `position` nesnesi her zaman mevcut imleç konumundan yeni bir şekilde oluşturulur. Ancak genellikle, oluşturduğunuz yeni nesnenin bir parçası olarak *mevcut* verileri de dahil etmek isteyeceksiniz. Örneğin, bir formda *sadece bir* alanı güncellemek isteyebilirsiniz, ancak diğer tüm alanlar için önceki değerleri korumak isteyebilirsiniz.

Bu giriş alanları, `onChange` işleyicileri durumu mutasyona uğrattığı için çalışmaz:



```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        İlk ad:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Soyad:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        E-posta:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```



Örneğin, bu satır geçmiş bir render'dan durumu mutasyona uğratıyor:

```js
person.firstName = e.target.value;
```

Aradığınız davranışı elde etmenin güvenilir yolu, yeni bir nesne oluşturmak ve bunu `setPerson`'a iletmektir. Ancak burada, **değişiklik yapacağınız alanın yanı sıra** mevcut veriyi kopyalamak da istersiniz:

```js
setPerson({
  firstName: e.target.value, // Girişten yeni ilk ad
  lastName: person.lastName,
  email: person.email
});
```

Her bir property'yi ayrı ayrı kopyalamak zorunda kalmamak için `...` [nesne yayılma](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) sözdizimini kullanabilirsiniz.

```js
setPerson({
  ...person, // Eski alanları kopyala
  firstName: e.target.value // Ama bu alanı geçersiz kıl
});
```

Artık form çalışıyor! 

Her bir giriş alanı için ayrı bir durum değişkeni tanımlamadığınızı unutmayın. Büyük formlar için tüm verilerin bir nesnede gruplandırılması çok pratik--doğru bir şekilde güncelledikçe!



```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        İlk ad:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Soyad:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        E-posta:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```



`...` yayılma sözdiziminin "sığ" olduğunu unutmayın--sadece bir seferde bir seviyeyi kopyalar. Bu hızlıdır, ancak bir iç alanı güncellemek istiyorsanız, birden fazla kez kullanmanız gerekir.



#### Birden fazla alan için tek bir olay işleyici kullanma {/*using-a-single-event-handler-for-multiple-fields*/}

Nesne tanımındaki `[` ve `]` köşeli parantezleri kullanarak dinamik bir isim ile property tanımlayabilirsiniz. İşte aynı örnek, fakat üç ayrı işleyici yerine tek bir olay işleyici ile:



```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        İlk ad:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Soyad:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        E-posta:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```



Burada, `e.target.name` `` DOM elemanına verilen `name` özelliğine referans verir.



## İç içe bir nesneyi güncelleme {/*updating-a-nested-object*/}

Aşağıdaki gibi iç içe bir nesne yapısını düşünelim:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

Eğer `person.artwork.city`'yi güncellemek istiyorsanız, mutasyon ile bunu nasıl yapacağınız açıktır:

```js
person.artwork.city = 'Yeni Delhi';
```

Ama React'ta durumu değişmez olarak ele alıyoruz! `city`'yi değiştirmek için önce yeni `artwork` nesnesini oluşturmanız (öncekinden verilerle önceden doldurulmuş) ve ardından yeni `person` nesnesini oluşturmanız gerekir ki bu da yeni `artwork`'e işaret eder:

```js
const nextArtwork = { ...person.artwork, city: 'Yeni Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

Ya da, tek bir fonksiyon çağrısı olarak yazılmış:

```js
setPerson({
  ...person, // Diğer alanları kopyala
  artwork: { // Ama sanatı değiştir
    ...person.artwork, // aynı olanla
    city: 'Yeni Delhi' // ama Yeni Delhi'de!
  }
});
```

Bu biraz uzun sürebilir, ancak birçok durum için gayet iyi çalışıyor:



```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        İsim:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Başlık:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Şehir:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Resim:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' tarafından '}
        {person.name}
        <br />
        (bulunduğu yer: {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```





#### Nesneler gerçekten iç içe değil {/*objects-are-not-really-nested*/}

Böyle bir nesne, kodda "iç içe" gibi görünür:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

Ancak, "iç içe" kelimesi, nesnelerin nasıl davrandığına dair yanlış bir düşünce tarzıdır. Kod çalıştığında, "iç içe" bir nesne yoktur. Gerçekte, iki farklı nesne ile ilgileniyorsunuz:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

`obj1` nesnesi `obj2` içinde "içeride" değildir. Örneğin, `obj3` de `obj1`'e "işaret" edebilir:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Taklitçi',
  artwork: obj1
};
```

Eğer `obj3.artwork.city`'yi değiştirmeye çalışırsanız, hem `obj2.artwork.city` hem de `obj1.city` etkilenir. Bunun nedeni, `obj3.artwork`, `obj2.artwork` ve `obj1`'in aynı nesne olmasıdır. Buna "iç içe" olarak bakıldığında görmek zor. Bunun yerine, özellikleri ile birbiriyle "işaret eden" ayrı nesneleri düşünmelisiniz.

  

### Immer ile özlü güncelleme mantığı yazın {/*write-concise-update-logic-with-immer*/}

Eğer durumunuz derin bir iç içe yapıdaysa, durumu `düzleştirmeyi` düşünebilirsiniz. Ancak durum yapınızı değiştirmek istemiyorsanız, iç içe yayılmalara bir kısayol tercih edebilirsiniz. [Immer](https://github.com/immerjs/use-immer) kullanımı basit ve nesneyi değiştiriyormuş gibi görünen bir sözdizimi ile yazmanıza izin veren popüler bir kütüphanedir ve size kopyaları üretme konusunda yardımcı olur. Immer ile yazdığınız kod, "kuralları ihlal ediyormuş" ve bir nesneyi değiştiriyormuş gibi görünmektedir:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

Ancak, olağan bir mutasyonun aksine, geçmiş durumu üst üste yazmaz!



#### Immer nasıl çalışır? {/*how-does-immer-work*/}

Immer tarafından sağlanan `draft`, üzerinde özgürce mutasyon yapabileceğiniz özel bir nesnedir. Bu, yaptıklarınızı "kaydettiği" bir [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) türüdür. Arka planda, Immer, `draft`'in hangi parçalarının değiştiğini belirler ve düzenlemelerinizi içeren tamamen yeni bir nesne üretir.



Immer denemek için:

1. `npm install use-immer` komutunu çalıştırarak Immer'ı bağımlılık olarak ekleyin
2. Ardından `import { useState } from 'react'`'ı `import { useImmer } from 'use-immer'` ile değiştirin

İşte yukarıdaki örneğin Immer'a dönüştürülmüş hali:



```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        İsim:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Başlık:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Şehir:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Resim:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' tarafından '}
        {person.name}
        <br />
        (bulunduğu yer: {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```



Olay işleyicilerinin ne kadar daha özlü hale geldiğine dikkat edin. `useState` ile `useImmer`'ı istediğiniz kadar karıştırabilirsiniz. Immer, durumunuzda iç içe bulunuyorsa güncelleme işleyicilerini özlü tutmak için harika bir yoldur, çünkü nesneleri kopyalamak tekrarlı koda yol açabilir.