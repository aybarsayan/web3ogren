---
title: Hızlı Başlangıç
seoTitle: React ile Hızlı Başlangıç
sidebar_position: 1
description: React uygulamalarına giriş yapmak için temel kavramları öğrenin. Bu sayfa, yeni başlayanlar için kritik bilgileri sunmaktadır.
tags: 
  - React
  - Geliştirme
  - JavaScript
  - Bileşenler
keywords: 
  - React
  - Geliştirme
  - JavaScript
  - Bileşenler
---
React belgelerine hoş geldiniz! Bu sayfa, günlük olarak kullanacağınız React kavramlarının %80'ine bir giriş yapacaktır.





- Bileşenleri nasıl oluşturup iç içe geçireceğiniz
- İşaretleme ve stilleri nasıl ekleyeceğiniz
- Verileri nasıl görüntüleyeceğiniz
- Koşulları ve listeleri nasıl oluşturacağınız
- Olaylara nasıl yanıt verip ekranı güncelleyeceğiniz
- Bileşenler arasında nasıl veri paylaşacağınız



## Bileşen Oluşturma ve İç İçe Geçirme {/*components*/}

React uygulamaları, *bileşenlerden* oluşur. Bir bileşen, kendi mantığı ve görünümü olan bir UI (kullanıcı arayüzü) parçasıdır. Bir bileşen bir düğme kadar küçük veya bir sayfa kadar büyük olabilir.

:::tip
Bileşenlerinizi yeniden kullanılabilir hale getirmek için her zaman başka yerlerde kullanabileceğiniz bileşenler yazın.
:::

React bileşenleri, işaretleme döndüren JavaScript fonksiyonlarıdır:

```js
function MyButton() {
  return (
    <button>Ben bir düğmeyim</button>
  );
}
```

Artık `MyButton`'ü tanımladığınıza göre, onu başka bir bileşenin içine yerleştirebilirsiniz:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Uygulamaıma hoş geldiniz</h1>
      <MyButton />
    </div>
  );
}
```

``'in büyük harfle başladığını fark edin. Bu, onun bir React bileşeni olduğunu gösterir. React bileşen adları daima büyük harfle başlamalıdır; HTML etiketleri ise küçük harfle olmalıdır.

Sonucu gözden geçirin:



```js
function MyButton() {
  return (
    <button>
      Ben bir düğmeyim
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Uygulamaıma hoş geldiniz</h1>
      <MyButton />
    </div>
  );
}
```



`export default` anahtar kelimeleri, dosyadaki ana bileşeni belirtir. JavaScript söz dizimindeki bazı kavramlarla tanışmıyorsanız, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) ve [javascript.info](https://javascript.info/import-export) harika başvuru kaynaklarıdır.

## JSX ile İşaretleme Yazma {/*writing-markup-with-jsx*/}

Yukarıda gördüğünüz işaretleme sözdizimi *JSX* olarak adlandırılır. Bu isteğe bağlıdır, ancak çoğu React projesi pratikliğinden dolayı JSX kullanır. Önerdiğimiz tüm `yerel geliştirme araçları` JSX'i kutudan çıkar çıkmaz destekler.

JSX, HTML'den daha katıdır. `` gibi etiketleri kapatmalısınız. Bileşeniniz aynı zamanda birden fazla JSX etiketini döndüremez. Bunları bir ortak üst öğe içinde sarmalamalısınız, örneğin bir `...` veya boş bir `...` sarmalayıcı:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>Hakkında</h1>
      <p>Merhaba.<br />Nasılsınız?</p>
    </>
  );
}
```

Birçok HTML'yi JSX'e taşımak istiyorsanız, bir [ çevrimiçi dönüştürücü](https://transform.tools/html-to-jsx) kullanabilirsiniz.

## Stil Ekleme {/*adding-styles*/}

React'te bir CSS sınıfını `className` ile belirtirsiniz. Bu, HTML'deki [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) niteliği ile aynı şekilde çalışır:

```js
<img className="avatar" />
```

Sonra bunun için CSS kurallarını ayrı bir CSS dosyasında yazarsınız:

```css
/* CSS'inizde */
.avatar {
  border-radius: 50%;
}
```

React, CSS dosyalarını nasıl ekleyeceğinizi dikte etmez. En basit durumda, HTML'ye bir [``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) etiketi eklersiniz. Bir derleme aracı veya çerçeve kullanıyorsanız, projenize CSS dosyasını eklemek için belgelere başvurun.

## Veri Görüntüleme {/*displaying-data*/}

JSX, işaretlemeyi JavaScript içinde yerleştirmenize olanak tanır. Süslü parantezler, belirli bir değişkeni kodunuzdan "geri alma" imkanı tanır ve bunu kullanıcıya gösterebilir. Örneğin, bu `user.name`'i görüntüler:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

Ayrıca, JSX özelliklerinden JavaScript'e "kaçmak" için de süslü parantezler kullanabilirsiniz, ancak alıntılar *yerine* süslü parantezleri kullanmanız gerekir. Örneğin, `className="avatar"` CSS sınıfı olarak `"avatar"` dizgisini geçirirken, `src={user.imageUrl}` JavaScript `user.imageUrl` değişkeninin değerini okur ve ardından bu değeri `src` niteliği olarak iletir:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

Daha karmaşık ifadeleri de JSX süslü parantezleri içinde kullanabilirsiniz, örneğin, [dizi birleştirme](https://javascript.info/operators#string-concatenation-with-binary):



```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Fotoğrafı ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```



Yukarıdaki örnekte, `style={{}}` özel bir sözdizimi değildir, ancak `style={ }` JSX süslü parantezleri içindeki sıradan bir `{}` nesnesidir. Stiliniz JavaScript değişkenlerine bağımlıysa `style` niteliğini kullanabilirsiniz.

## Koşullu Görüntüleme {/*conditional-rendering*/}

React'te koşul yazmak için özel bir sözdizimi yoktur. Bunun yerine, normal JavaScript kodu yazarken kullandığınız teknikleri kullanacaksınız. Örneğin, bir `if` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)) ifadesi kullanarak JSX'i koşullu olarak içeriklere dahil edebilirsiniz:

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

Daha kompakt bir kod tercih ederseniz, [koşullu `?` operatörünü](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) kullanabilirsiniz. `if`'in aksine, bu JSX içinde çalışır:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

`else` dalına ihtiyacınız yoksa, ayrıca daha kısa bir [mantıksal `&&` sözdizimini](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation) de kullanabilirsiniz:

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Tüm bu yaklaşımlar, koşullu olarak nitelikler belirtmek için de çalışır. Bu JavaScript sözdizimlerinden bazılarına aşina değilseniz, her zaman `if...else` kullanmaya başlayabilirsiniz.

## Listeleri Görüntüleme {/*rendering-lists*/}

Listeleri görüntülemek için [`for` döngüsü](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) ve [dizi `map()` işlevi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) gibi JavaScript özelliklerine güveneceksiniz.

Örneğin, diyelim ki ürünlerden oluşan bir diziniz var:

```js
const products = [
  { title: 'Lahana', id: 1 },
  { title: 'Sarımsak', id: 2 },
  { title: 'Elma', id: 3 },
];
```

Bileşeninizin içinde `map()` işlevini kullanarak bir ürünler dizisini `` öğeleri dizisine dönüştürün:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

`` öğesinin bir `key` niteliğine sahip olduğunu fark edin. Bir listede her öğe için, o öğeyi kardeşleri arasında benzersiz şekilde tanımlayan bir dize veya bir sayı geçirmelisiniz. Genellikle, bir anahtarın veri kaynağından, örneğin bir veritabanı kimliğinden gelmesi gerekir. React, sizin anahtarlarınızı, daha sonra öğeleri eklediğinizde, sildiğinizde veya sıraya göre değiştirdiğinizde ne olduğunu bilmek için kullanır.



```js
const products = [
  { title: 'Lahana', isFruit: false, id: 1 },
  { title: 'Sarımsak', isFruit: false, id: 2 },
  { title: 'Elma', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```



## Olaylara Yanıt Verme {/*responding-to-events*/}

Olaylara, bileşenlerinizin içinde *olay işleyici* fonksiyonları tanımlayarak yanıt verebilirsiniz:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('Bana tıkladınız!');
  }

  return (
    <button onClick={handleClick}>
      Tıkla
    </button>
  );
}
```

`onClick={handleClick}`'in sonunda parantez olmadığını fark edin! Olay işleyici fonksiyonunu _çağırmayın_: sadece onu *geçin*. React, kullanıcı düğmeyi tıkladığında olay işleyicinizi çağıracaktır.

## Ekranı Güncelleme {/*updating-the-screen*/}

Çoğu zaman, bileşeninizin bazı bilgileri "hatırlaması" ve bunları görüntülemesini istersiniz. Örneğin, belki bir düğmeye kaç kez tıklandığını saymak istersiniz. Bunu yapmak için, bileşeninize *durum* ekleyin.

Öncelikle, React'ten `useState` içe aktarın:

```js
import { useState } from 'react';
```

Artık bileşeninizin içinde bir *durum değişkeni* tanımlayabilirsiniz:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

`useState`'den iki şey alırsınız: mevcut durum (`count`) ve onu güncellemenizi sağlayan fonksiyon (`setCount`). İstediğiniz isimleri verebilirsiniz, ancak geleneksel şekilde `[bir şey, setBirŞey]` yazmanız önerilir.

Düğme ilk kez görüntülendiğinde, `count` `0` olacaktır çünkü `useState()`'ye `0` geçirdiniz. Durumu değiştirmek istediğinizde, `setCount()` fonksiyonunu çağırıp yeni değeri ona geçirirsiniz. Bu düğmeye tıkladığınızda sayacı artıracaktır:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      {count} kez tıklandı
    </button>
  );
}
```

React, bileşen fonksiyonunuzu bir kez daha çağırır. Bu sefer, `count` `1` olacaktır. Sonra `2` olacaktır. Ve böyle devam eder.

Aynı bileşeni birden fazla kez render ederseniz, her biri kendi durumu olacak. Her düğmeye ayrı ayrı tıklayın:



```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Ayrı güncellenen sayacılar</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      {count} kez tıklandı
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```



Her düğmenin kendi `count` durumunu "hatırladığını" ve diğer düğmeleri etkilemediğini fark edin.

## Hook'ları Kullanma {/*using-hooks*/}

`use` ile başlayan fonksiyonlara *Hook* denir. `useState`, React tarafından sağlanan yerleşik bir Hook'tur. Diğer yerleşik Hook'ları [API referansında](https://reactjs.org/docs/hooks-overview.html) bulabilirsiniz. Mevcut olanları birleştirerek kendi Hook'larınızı da yazabilirsiniz.

Hook'lar, diğer fonksiyonlardan daha kısıtlayıcıdır. Hook'ları sadece bileşenlerinizin (veya diğer Hook'ların) *en üstünde* çağırabilirsiniz. Bir koşulda veya döngüde `useState` kullanmak istiyorsanız, yeni bir bileşen çıkarmalı ve oraya koymalısınız.

## Bileşenler Arasında Veri Paylaşma {/*sharing-data-between-components*/}

Önceki örnekte, her `MyButton` bağımsız `count`'a sahipti ve her düğmeye tıklandığında yalnızca tıklanan düğmenin `count`'u değişti:





İlk olarak, her `MyButton`'ın `count` durumu `0`





İlk `MyButton` sayacı `1` olarak günceller





Ancak genellikle bileşenlerin *veri paylaşmasını ve her zaman birlikte güncellenmesini* istersiniz.

Her iki `MyButton` bileşeninin aynı `count`'u görüntülemesi ve birlikte güncellenmesi için, durumu bireysel düğmelerden "yukarıya" en yakın bileşene taşımak gerekecektir.

Bu örnekte, bu `MyApp`'dır:





Başlangıçta `MyApp`'ın `count` durumu `0` ve her iki çocuğa da geçildi





Tıklayınca, `MyApp` sayacını `1` olarak günceller ve her iki çocuğa da geçer





Artık, hangi düğmeye tıklarsanız tıklayın, `MyApp`'taki `count` değişecek ve bu, `MyButton`'daki her iki sayacı da değiştirecektir. Bunu kod ile nasıl ifade edebileceğinize bakalım.

Öncelikle, durumu `MyButton`'dan `MyApp`'a *taşıyın*:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Aynı anda güncellenen sayaçlar</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... buradan kod taşıyoruz ...
}

```

Sonra, durumu `MyApp`'dan her `MyButton`'a, birlikte paylaşılan tıklama yöntemi ile *geçirin*. `MyButton`'a JSX süslü parantezleri kullanarak bilgi geçirebilirsiniz; tıpkı daha önce `<img>` gibi yerleşik etiketlerle yaptığınız gibi:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Aynı anda güncellenen sayaçlar</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

Geçirdiğiniz bilgiler _props_ olarak adlandırılır. Artık `MyApp` bileşeni `count` durumunu ve `handleClick` olay işleyicisini içeriyor ve *her ikisini birlikte* `MyButton` bileşenlerine prop olarak geçiriyor.

Son olarak, `MyButton`'ı *okuyacak* şekilde değiştirin:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      {count} kez tıklandı
    </button>
  );
}
```

Düğmeye tıkladığınızda, `onClick` işleyacisi çalışır. Her düğmenin `onClick` prop'u, `MyApp` içindeki `handleClick` fonksiyonuna ayarlanmış olduğundan, içindeki kod çalışır. Bu kod, `setCount(count + 1)` den çağrılır, böylece `count` durum değişkeni artmış olur. Yeni `count` değeri her düğmeye prop olarak geçer, böylece hepsi yeni değeri gösterir. Buna "durumu yukarı taşıma" denir. Durumu yukarı taşıyarak, bileşenler arasında paylaşmış oldunuz.



```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Aynı anda güncellenen sayaçlar</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      {count} kez tıklandı
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```



## Sonraki Adımlar {/*next-steps*/}

Artık, React kodu yazmanın temel bilgilerini biliyorsunuz!

`Öğreticiye` göz atın ve bunları pratik etmek için ilk mini uygulamanızı React ile oluşturun.