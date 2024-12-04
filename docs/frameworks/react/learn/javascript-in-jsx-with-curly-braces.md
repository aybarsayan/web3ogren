---
title: JSX ile JavaScript ve Küme Parantezleri
seoTitle: JSX ile JavaScript ve Küme Parantezleri - Öğrenin
sidebar_position: 4
description: JSX, JavaScriptte HTML benzeri işaretleme yazmayı kolaylaştırır. Bu sayfada, JSXde JavaScript değişkenleri ve fonksiyonları nasıl kullanılacağına dair bilgi bulacaksınız.
tags: 
  - JSX
  - JavaScript
  - React
keywords: 
  - JSX
  - JavaScript
  - React
---
JSX, bir JavaScript dosyasında HTML benzeri işaretleme yazmanıza olanak tanır ve render mantığını ve içeriği aynı yerde tutar. Bazen bu işaretleme içinde biraz JavaScript mantığı eklemek veya dinamik bir özelliğe referans vermek isteyebilirsiniz. Bu durumda, JSX’inizde JavaScript’e erişmek için küme parantezlerini kullanabilirsiniz.





* Alıntı ile dize geçirme
* Küme parantezleri ile JSX içinde JavaScript değişkenine başvurma
* Küme parantezleri ile JSX içinde JavaScript fonksiyonu çağırma
* Küme parantezleri ile JSX içinde JavaScript nesnesi kullanma



## Alıntı ile dize geçirme {/*passing-strings-with-quotes*/}

JSX’ye bir dize niteliği geçirmek istediğinizde, bunu tek veya çift tırnak içine alırsınız:



```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```



Burada, `"https://i.imgur.com/7vQD0fPs.jpg"` ve `"Gregorio Y. Zara"` dizeler olarak geçmektedir.

Ama `src` veya `alt` metnini dinamik olarak belirtmek isterseniz? **Değeri JavaScript’ten almak için `"` ve `"` yerine `{` ve `}` kullanabilirsiniz**:



```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```



`className="avatar"` ile, resmi yuvarlak yapan `"avatar"` CSS sınıf adını belirttiğinizi, `src={avatar}` ile de `avatar` adındaki JavaScript değişkeninin değerini okuduğunuzu unutmayın. Çünkü küme parantezleri, işaretlemeniz içinde JavaScript ile çalışmanıza olanak tanır!

## Küme parantezlerini kullanma: JavaScript dünyasına bir pencere {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX, JavaScript yazmanın özel bir yoludur. Bu, içinde JavaScript kullanmanın mümkün olduğu anlamına gelir—küme parantezleri `{ }` ile. Aşağıdaki örnek, önce bilim insanının ismini `name` olarak tanımlar, ardından bunu `` içinde küme parantezleriyle gömülür:



```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```



`name` değerini `'Gregorio Y. Zara'`'dan `'Hedy Lamarr'`’a değiştirmeyi deneyin. Liste başlığının nasıl değiştiğine bakın!

Küme parantezleri arasında herhangi bir JavaScript ifadesi çalışır, örneğin `formatDate()` gibi fonksiyon çağrıları:



```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```



### Küme parantezlerini nerede kullanmalıyım? {/*where-to-use-curly-braces*/}

Küme parantezlerini JSX içinde yalnızca iki şekilde kullanabilirsiniz:

1. **Metin olarak** doğrudan bir JSX etiketi içinde: `{name}'s To Do List` çalışır, ancak `Gregorio Y. Zara'nın To Do List` çalışmaz.
2. **Nitelik olarak** `=` işaretinin hemen ardından: `src={avatar}` `avatar` değişkenini okur, fakat `src="{avatar}"` `"{avatar}"` dizisini geçirir.

## "Çift küme" kullanma: JSX'de CSS ve diğer nesneler {/*using-double-curlies-css-and-other-objects-in-jsx*/}

Dizeler, sayılar ve diğer JavaScript ifadelerine ek olarak, JSX'de nesneleri bile geçirebilirsiniz. Nesneler de `{ name: "Hedy Lamarr", inventions: 5 }` ile belirtilir. Bu nedenle, bir JS nesnesini JSX'ye geçirmek için nesneyi başka bir çift küme parantezi içine almanız gerekir: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

Bunu JSX'de çevrimiçi CSS stillerinde görebilirsiniz. React, çevrimiçi stiller kullanmanızı zorunlu kılmaz (CSS sınıfları çoğu durumda harika çalışır). Ancak, çevrimiçi bir stil gerektiğinde, `style` niteliğine bir nesne geçirirsiniz:



```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Videofonu geliştirin</li>
      <li>Aeronotiks derslerini hazırlayın</li>
      <li>Alkolle çalışan motor üzerinde çalışın</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```



`backgroundColor` ve `color` değerlerini değiştirmeyi deneyin.

JSX'de bunu şu şekilde yazarak küme parantezleri içinde JavaScript nesnesini gerçekten görebilirsiniz:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

JSX'de `{{` ve `}}` gördüğünüzde, bunun aslında JSX küme parantezlerinin içinde bulunan bir nesne olduğunu bilin!

:::warning
Çevrimiçi `style` nitelikleri camelCase ile yazılmalıdır. Örneğin, HTML `` bileşeninizde `` olarak yazılır.
:::

## JavaScript nesneleri ve küme parantezleri ile daha fazla eğlence {/*more-fun-with-javascript-objects-and-curly-braces*/}

Birden fazla ifadeyi bir nesneye taşıyabilir ve bunları JSX'nizde küme parantezleri içinde referans alabilirsiniz:



```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Videofonu geliştirin</li>
        <li>Aeronotiks derslerini hazırlayın</li>
        <li>Alkolle çalışan motor üzerinde çalışın</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```



Bu örnekte, `person` JavaScript nesnesi bir `name` dizesi ve bir `theme` nesnesi içerir:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

Bileşen, `person`'dan bu değerleri şöyle kullanabilir:

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX, JavaScript kullanarak veri ve mantığı organize etmenize olanak tanıdığı için şablon dili olarak oldukça minimalisttir.



Artık JSX hakkında hemen hemen her şeyi biliyorsunuz:

* JSX nitelikleri içinde alıntı olarak geçirilir.
* Küme parantezleri, JavaScript mantığını ve değişkenlerini işaretlemenize getirir.
* JSX etiket içeriğinde veya niteliklerde `=` işaretinin hemen ardından çalışırlar.
* `{{` ve `}}` özel bir sözdizimi değildir: bu, JSX küme parantezlerinin içinde yer alan bir JavaScript nesnesidir.





#### Hatası düzeltin {/*fix-the-mistake*/}

Bu kod, `Objects are not valid as a React child` hatası verir:



```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Videofonu geliştirin</li>
        <li>Aeronotiks derslerini hazırlayın</li>
        <li>Alkolle çalışan motor üzerinde çalışın</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```



Sorunu bulabilir misiniz?

Küme parantezlerinin içindekine bakın. Orada doğru şeyi mi koyuyoruz?



Bu, bu örneğin *bir nesneyi* işaretlemeye çalışması nedeniyle meydana gelir; `{person}'s Todos` tüm `person` nesnesini render etmeye çalışıyor! Ham nesneleri metin içeriği olarak dahil etmek bir hata fırlatır çünkü React, bunları nasıl göstermek istediğinizi bilemez.

Bunu düzeltmek için `{person}'s Todos` ifadesini `{person.name}'s Todos` ile değiştirin:



```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Videofonu geliştirin</li>
        <li>Aeronotiks derslerini hazırlayın</li>
        <li>Alkolle çalışan motor üzerinde çalışın</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```





#### Bilgiyi bir nesneye çıkarın {/*extract-information-into-an-object*/}

Görüntü URL'sini `person` nesnesine çıkarın.



```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Videofonu geliştirin</li>
        <li>Aeronotiks derslerini hazırlayın</li>
        <li>Alkolle çalışan motor üzerinde çalışın</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```





Görüntü URL'sini `person.imageUrl` adlı bir özellik haline getirin ve `<img>` etiketi içinden curlies kullanarak okuyun:



```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Videofonu geliştirin</li>
        <li>Aeronotiks derslerini hazırlayın</li>
        <li>Alkolle çalışan motor üzerinde çalışın</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```





#### JSX küme parantezleri içinde bir ifade yazın {/*write-an-expression-inside-jsx-curly-braces*/}

Aşağıdaki nesnede, tam görüntü URL'si dört parçaya ayrılmıştır: temel URL, `imageId`, `imageSize` ve dosya uzantısı.

Görüntü URL'sinin bu özellikleri birleştirmesi gerekiyor: temel URL (her zaman `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`) ve uzantı (her zaman `'.jpg'`). Ancak, `<img>` etiketinin `src` tanımında bir sorun vardır.

Bunu düzeltebilir misin?



```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Videofonu geliştirin</li>
        <li>Aeronotiks derslerini hazırlayın</li>
        <li>Alkolle çalışan motor üzerinde çalışın</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```



Düzeltmenizin işe yaradığını kontrol etmek için `imageSize` değerini `'b'` olarak değiştirmeyi deneyin. Değiştirmenizden sonra görüntü boyutu değişmelidir.



Bunu `src={baseUrl + person.imageId + person.imageSize + '.jpg'}` şeklinde yazabilirsiniz.

1. `{` JavaScript ifadesini açar
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` doğru URL dizesini üretir
3. `}` JavaScript ifadesini kapatır



```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Videofonu geliştirin</li>
        <li>Aeronotiks derslerini hazırlayın</li>
        <li>Alkolle çalışan motor üzerinde çalışın</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```



Bu ifadeyi ayrıca aşağıdaki gibi ayrı bir fonksiyon `getImageUrl` içine yerleştirebilirsiniz:



```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Videofonu geliştirin</li>
        <li>Aeronotiks derslerini hazırlayın</li>
        <li>Alkolle çalışan motor üzerinde çalışın</li>
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```



Değişkenler ve fonksiyonlar, işaretlemelerinizi basit tutmanıza yardımcı olabilir!