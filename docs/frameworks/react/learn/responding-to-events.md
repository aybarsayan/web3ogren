---
title: Olaylara Yanıt Verme
seoTitle: Olaylara Yanıt Verme - React
sidebar_position: 4
description: Bu bölümde Reactte olay işleyicilerinin nasıl kullanılacağını öğreneceksiniz. Olay işleyicilerinin özelliklerini ve yayılma mekanizmasını keşfedeceksiniz.
tags: 
  - React
  - Olay İşleyicileri
  - JSX
keywords: 
  - olay işleyicileri
  - React
  - tıklama
  - form
  - bileşenler
---
React, JSX'inize *olay işleyicileri* eklemenizi sağlar. Olay işleyicileri, tıklama, üzerlerinde durma, form girdilerine odaklanma gibi etkileşimlere yanıt olarak tetiklenecek olan kendi fonksiyonlarınızdır.





* Bir olay işleyicisini yazmanın farklı yolları
* Olay işleme mantığını bir üst bileşenden nasıl geçirileceği
* Olayların nasıl yayıldığı ve nasıl durdurulacağı



## Olay İşleyicileri Eklemek {/*adding-event-handlers*/}

Bir olay işleyicisi eklemek için önce bir fonksiyon tanımlayacak ve sonra bu fonksiyonu uygun JSX etiketine `prop olarak` geçireceksiniz. Örneğin, henüz bir şey yapmayan bir buton:



```js
export default function Button() {
  return (
    <button>
      Hiçbir şey yapmıyorum
    </button>
  );
}
```



Bir kullanıcı tıkladığında bir mesaj göstermesini sağlamak için bu üç adımı takip edebilirsiniz:

1. `Button` bileşeninizin *içinde* `handleClick` adında bir fonksiyon tanımlayın.
2. O fonksiyonun içinde mantığı uygulayın (mesajı göstermek için `alert` kullanın).
3. `` JSX'ine `onClick={handleClick}` ekleyin.



```js
export default function Button() {
  function handleClick() {
    alert('Bana tıkladın!');
  }

  return (
    <button onClick={handleClick}>
      Bana tıkla
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```



`handleClick` fonksiyonunu tanımladınız ve ardından `prop olarak` `` etiketine geçirdiniz. `handleClick` bir **olay işleyicisidir.** Olay işleyici fonksiyonları:

* Genellikle bileşenlerinizin *içinde* tanımlanır.
* `handle` ile başlayan ve ardından olayın adını takip eden isimlere sahiptir.

Geleneksel olarak, olay işleyicilerine `handle` ve ardından olay adı konulması yaygındır. Sıklıkla `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}` gibi yapılar görürsünüz.

Alternatif olarak, bir olay işleyicisini JSX içinde satır içi olarak tanımlayabilirsiniz:

```jsx
<button onClick={function handleClick() {
  alert('Bana tıkladın!');
}}>
```

Ya da daha öz bir şekilde, bir ok fonksiyonu kullanarak:

```jsx
<button onClick={() => {
  alert('Bana tıkladın!');
}}>
```

Tüm bu stiller eşdeğerdir. Satır içi olay işleyicileri kısa fonksiyonlar için kullanışlıdır.

:::tip
Olay işleyicilerine geçirilen fonksiyonlar geçirilmelidir, çağrılmamalıdır. Örneğin:
:::

| Fonksiyonu geçmek (doğru)           | Fonksiyonu çağırmak (yanlış)     |
| ------------------------------------ | --------------------------------- |
| ``    | `` |

Fark ince. İlk örnekte, `handleClick` fonksiyonu bir `onClick` olay işleyicisi olarak geçirilmiştir. Bu, React'a onu hatırlamasını ve yalnızca kullanıcı butona tıkladığında fonksiyonu çağırmasını söyler.

İkinci örnekte, `handleClick()` sonundaki `()` fonksiyonu *hemen* `renderleme` sırasında, herhangi bir tıklama olmadan çalıştırır. Bu, JSX içindeki `JSX `{` ve `}` JavaScript'in hemen çalıştırılması nedeniyle olur.

Kod yazdığınızda, aynı tuzak farklı bir şekilde kendini gösterir:

| Fonksiyonu geçmek (doğru)            | Fonksiyonu çağırmak (yanlış)     |
| ------------------------------------ | --------------------------------- |
| ` alert('...')}>` | `` |

Satır içi olarak böyle bir kod geçmek, tıklamada tetiklenmeyecek; her seferinde bileşen render edildiğinde tetiklenecektir:

```jsx
// Bu uyarı bileşen render edildiğinde tetiklenir, tıklandığında değil!
<button onClick={alert('Bana tıkladın!')}>
```

Eğer olay işleyicinizi satır içi tanımlamak istiyorsanız, onu anonim bir fonksiyonun içinde takip edin:

```jsx
<button onClick={() => alert('Bana tıkladın!')}>
```

Her renderda içindeki kodu çalıştırmak yerine, bu daha sonra çağrılacak bir fonksiyon yaratır.

Her iki durumda da geçirmeniz gereken bir fonksiyon vardır:

* `` `handleClick` fonksiyonunu geçirir.
* ` alert('...')}>` `() => alert('...')` fonksiyonunu geçirir.

[Daha fazla okuma yapmak için ok fonksiyonları hakkında bilgi edinin.](https://javascript.info/arrow-functions-basics)

:::

### Olay İşleyicilerinde Prop Okuma {/*reading-props-in-event-handlers*/}

Olay işleyicileri bir bileşenin içinde tanımlandığından, bileşenin props'larına erişimleri vardır. İşte tıklandığında `message` prop'u ile bir uyarı gösteren bir buton:



```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Oynatılıyor!">
        Film Oynat
      </AlertButton>
      <AlertButton message="Yükleniyor!">
        Görüntü Yükle
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```



Bu, iki butonun farklı mesajlar göstermesini sağlar. Onlara geçen mesajları değiştirmeyi deneyin.

### Olay İşleyicilerini Prop Olarak Geçme {/*passing-event-handlers-as-props*/}

Sıklıkla, üst bileşenin bir çocuğun olay işleyicisini belirtmesini istersiniz. Butonları düşünün: `Button` bileşenini nerede kullandığınıza bağlı olarak, belki biri bir filmi oynatırken diğeri bir görüntüyü yüklemek isteyebilirsiniz.

Bunu yapmak için, olay işleyici olarak geçen bir prop'u üst bileşenden çocuğa geçirirsiniz:



```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Oynatılıyor ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      "{movieName}" Oynat
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Yükleniyor!')}>
      Görüntü Yükle
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki'nin Teslimat Servisi" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```



Burada, `Toolbar` bileşeni bir `PlayButton` ve bir `UploadButton` render eder:

- `PlayButton`, `Button` bileşeninin içine `handlePlayClick`'i `onClick` prop'u olarak geçirir.
- `UploadButton`, `Button` bileşeninin içine `() => alert('Yükleniyor!')`'yi `onClick` prop'u olarak geçirir.

Son olarak, `Button` bileşeniniz bir `onClick` adında bir prop kabul eder. Bu prop'u doğrudan yerleşik tarayıcı `` stiline `onClick={onClick}` ile geçirir. Bu, React'a geçirilen fonksiyonu tıklamada çağırması talimatını verir.

Eğer bir [tasarım sistemi](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) kullanıyorsanız, butonlar gibi bileşenlerin genellikle stil içermesi ama davranışı belirtmemesi yaygındır. Bunun yerine, `PlayButton` ve `UploadButton` gibi bileşenler olay işleyicilerini aşağıya geçerler.

### Olay İşleyici Prop'larının İsimlendirilmesi {/*naming-event-handler-props*/}

Yerleşik bileşenler olan `` ve ``, yalnızca `tarayıcı olay isimlerini` destekler. Ancak, kendi bileşenlerinizi oluşturduğunda, olay işleyici prop'larını istediğiniz gibi adlandırabilirsiniz.

Geleneksel olarak, olay işleyici prop'ları `on` ile başlamalı ve ardından büyük bir harf kullanılmalıdır.

Örneğin, `Button` bileşeninin `onClick` prop'u `onSmash` olarak adlandırılabilirdi:



```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Oynatılıyor!')}>
        Film Oynat
      </Button>
      <Button onSmash={() => alert('Yükleniyor!')}>
        Görüntü Yükle
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```



Bu örnekte, `` tarayıcı `` (küçük harfle) bir `onClick` adında bir prop gerektirdiğini, ancak özel `Button` bileşeniniz tarafından alınan prop adının size kalmış olduğunu göstermektedir!

Bileşeniniz birden fazla etkileşimi destekliyorsa, olay işleyici prop'larını uygulama özelliklerine göre adlandırabilirsiniz. Örneğin, bu `Toolbar` bileşeni `onPlayMovie` ve `onUploadImage` olay işleyicilerini alır:



```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Oynatılıyor!')}
      onUploadImage={() => alert('Yükleniyor!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Film Oynat
      </Button>
      <Button onClick={onUploadImage}>
        Görüntü Yükle
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```



`App` bileşeninin `Toolbar`'ın `onPlayMovie` veya `onUploadImage`'yi ne yapacağını bilmesine gerek yoktur. Bu, `Toolbar`'ın bir uygulama detaylarıdır. Burada, `Toolbar` bunları `Button`'lerine `onClick` işleyici olarak geçirir, ancak daha sonra bunları bir klavye kısayolunda da tetikleyebilir. `onPlayMovie` veya `onUploadImage` gibi uygulama özelliklerine göre prop adları vermek, nasıl kullanılacaklarını değiştirme esnekliği sağlar.



Olay işleyicileriniz için uygun HTML etiketlerini kullandığınızdan emin olun. Örneğin, tıklamaları işlemek için [``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) kullanın, `` değil. Gerçek bir tarayıcı `` kullanmak, klavye navigasyonu gibi yerleşik tarayıcı davranışlarını etkinleştirir. Eğer bir butonun varsayılan tarayıcı stilinden hoşlanmıyorsanız ve onu bir bağlantı veya farklı bir UI öğesi gibi görünmesini istiyorsanız, bunu CSS ile başarabilirsiniz. [Erişilebilir işaretleme yazma hakkında daha fazla bilgi edinin.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)



## Olay Yayılımı {/*event-propagation*/}

Olay işleyicileri, bileşeninizin sahip olabileceği alt öğelerden gelen olayları da yakalar. Bir olayın "kabarcık" yaptığı ya da "yayıl"dığı söylenir: olayın gerçekleştiği yerden başlar ve ardından yukarı doğru gider.

Bu ``, iki butonu içerir. Hem `` hem de her buton kendi `onClick` işleyicisine sahiptir. Butona tıkladığınızda hangi işleyicilerin tetikleneceğini düşünüyorsunuz?



```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('Araç çubuğuna tıkladınız!');
    }}>
      <button onClick={() => alert('Oynatılıyor!')}>
        Film Oynat
      </button>
      <button onClick={() => alert('Yükleniyor!')}>
        Görüntü Yükle
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```



Eğer butonlardan birine tıklarsanız, önce onun `onClick`'i çalışacak, ardından üstteki ``'nin `onClick`'i çalışacak. Böylece iki mesaj çıkacaktır. Eğer doğrudan araç çubuğuna tıklarsanız, yalnızca üstteki ``'nin `onClick`'i çalışır.

:::warning
React'te tüm olaylar yayılır, `onScroll` dışında, bu yalnızca onu bağladığınız JSX etiketinde çalışır.
:::

### Yayılımı Durdurma {/*stopping-propagation*/}

Olay işleyicileri, yalnızca bir argümanı olarak bir **olay nesnesi** alır. Geleneksel olarak, bu genellikle `e` olarak adlandırılır, bu da "olay" anlamına gelir. Bu nesneyi olay hakkında bilgi okumak için kullanabilirsiniz.

Bu olay nesnesi, yayılmayı durdurmanıza da olanak tanır. Eğer bir olayın üst bileşenlere ulaşmasını önlemek istiyorsanız, `e.stopPropagation()` çağırmalısınız; işte bu `Button` bileşeni gibi:



```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('Araç çubuğuna tıkladınız!');
    }}>
      <Button onClick={() => alert('Oynatılıyor!')}>
        Film Oynat
      </Button>
      <Button onClick={() => alert('Yükleniyor!')}>
        Görüntü Yükle
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```



Bir butona tıkladığınızda:

1. React, `` etiketine geçirilen `onClick` işleyicisini çağırır. 
2. O işleyici, `Button` içinde tanımlanmıştır ve şunları yapar:
   * `e.stopPropagation()` çağırır ve olayın daha fazla yayılmasını engeller.
   * `Toolbar` bileşeninden geçen `onClick` fonksiyonunu çağırır.
3. Bu fonksiyon, `Toolbar` bileşeninde tanımlanır ve butonun kendi uyarısını gösterir.
4. Yayılma durdurulduğundan, üstteki ``'nin `onClick` işleyicisi *çalışmaz*.

`e.stopPropagation()` sonucunda, butona tıkladığınızda artık yalnızca bir uyarı (butondan) görünüyor. Bir butona tıklamak, çevresindeki araç çubuğuna tıklamak ile aynı şey değildir, dolayısıyla yayılımı durdurmak bu UI için mantıklıdır.



#### Yakalama aşaması olayları {/*capture-phase-events*/}

Nadir durumlarda, çocuk öğelerdeki tüm olayları yakalamak isteyebilirsiniz, *yayılmayı durdurmuş olsalar bile*. Örneğin, belki her tıklamayı analitiğe loglamak istiyorsunuz, yayılma mantığından bağımsız olarak. Bunu olay adı sonunda `Capture` ekleyerek yapabilirsiniz:

```js
<div onClickCapture={() => { /* bu önce çalışır */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Her olay üç aşamada yayılır:

1. Aşağı doğru yol alır, tüm `onClickCapture` işleyicilerini çağırır.
2. Tıklanan öğenin `onClick` işleyicisini çalıştırır. 
3. Yukarı doğru yol alır, tüm `onClick` işleyicilerini çağırır.

Yayılma olayları, yönlendiriciler veya analitik gibi kodlar için yararlıdır, ancak büyük ihtimalle uygulama kodunda kullanmayacaksınız.



### Olayların Yayılması için Alternatif Olarak İşleyicilerin Geçirilmesi {/*passing-handlers-as-alternative-to-propagation*/}

Bu tıklama işleyicisinin bir satır kod çalıştırdığını _ve sonra_ üstteki `onClick` prop'unu çağırdığını fark edin:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

Bu işleyiciye üstteki `onClick` olay işleyicisini çağırmadan önce daha fazla kod ekleyebilirsiniz. Bu model, yayılma için bir *alternatif* sağlar. Bu, alt bileşenin olayı işlemesine olanak tanırken, üst bileşenin ek bir davranış belirlemesini sağlar. Yayılmanın tersine, bu otomatik değildir. Ancak bu yaklaşımın faydası, bir olayın sonucu olarak yürütülen kod zincirini açıkça takip edebilmenizdir.

Yayılmaya güvendiğinizde ve hangi işleyicilerin neden yürütüldüğünü izlemek zor olduğunda, bunun yerine bu yöntemi deneyin.

### Varsayılan Davranışın Önlenmesi {/*preventing-default-behavior*/}

Bazı tarayıcı olaylarının varsayılan davranışları vardır. Örneğin, bir ``'ın gönderme olayı, içindeki bir butona tıklandığında tüm sayfayı yenileyecektir:



```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Gönderiliyor!')}>
      <input />
      <button>Gönder</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```



Bunun olmasını durdurmak için olay nesnesinde `e.preventDefault()` çağırabilirsiniz:



```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Gönderiliyor!');
    }}>
      <input />
      <button>Gönder</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```



`e.stopPropagation()` ve `e.preventDefault()`'u karıştırmayın. İkisinin de kullanışlıdır, ancak birbirleriyle alakalı değildirler:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) olayın üstündeki etiketlere bağlı işleyicilerin tetiklenmesini durdurur.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) sadece bunun için varsayılan tarayıcı davranışını durdurur.

## Olay İşleyicileri Yan Etkilere Sahip Olabilir mi? {/*can-event-handlers-have-side-effects*/}

Kesinlikle! Olay işleyicileri yan etkiler için en iyi yerdir.

Renderleme fonksiyonlarından farklı olarak, olay işleyicilerinin `saf` olması gerekmez, bu nedenle bir şeyi *değiştirmek* için harika bir yerdir—örneğin, yazmaya yanıt olarak bir girdinin değerini değiştirmek veya bir butona basıldığında bir listeyi değiştirmek. Ancak bazı bilgileri değiştirmek için önce bir şekilde saklamanız gerekir. React'te bu, `durum, bir bileşenin hafızası.` kullanılarak yapılır. Bunları bir sonraki sayfada öğreneceksiniz.



* Olayları `` gibi bir elemana bir fonksiyonu prop olarak geçirerek işleyebilirsiniz.
* Olay işleyicileri geçirilmelidir, **çağırılmamalıdır!** `onClick={handleClick}`, `onClick={handleClick()}` değil.
* Bir olay işleyici fonksiyonunu ayrı veya satır içi olarak tanımlayabilirsiniz.
* Olay işleyicileri bir bileşenin içinde tanımlandığı için props'lara erişebilir.
* Bir üstte olay işleyicisi tanımlayıp, bunu bir çocuğa prop olarak geçirebilirsiniz.
* Uygulama spesifik adlarla kendi olay işleyici prop'larınızı tanımlayabilirsiniz.
* Olaylar yukarı doğru yayılır. İlk argüman üzerine `e.stopPropagation()` çağırarak bunu önleyebilirsiniz.
* Olayların istenmeyen varsayılan tarayıcı davranışları olabilir. Bunu önlemek için `e.preventDefault()` çağırarak önleyin.
* Bir çocuk işleyicide açıkça bir olay işleyici prop'unu çağırmak, yayılım için iyi bir alternatiftir.





#### Bir Olay İşleyicisini Düzeltme {/*fix-an-event-handler*/}

Bu butona tıklamak, sayfanın arka planını beyaz ve siyah arasında değiştirmek için tasarlanmıştır. Ancak, tıkladığınızda hiçbir şey olmuyor. Sorunu düzeltin. (handleClick içindeki mantık hakkında endişelenmeyin—o kısım iyi.)



```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Işıkları aç/kapat
    </button>
  );
}
```





Sorun, ``'in `handleClick` fonksiyonunu render sırasında _çağırması_ ve _geçirmemesi_. `()` çağrısını kaldırarak, `` yapmanız sorunu düzeltir:



```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Işıkları aç/kapat
    </button>
  );
}
```



Alternatif olarak, çağrıyı başka bir fonksiyonun içine sarabilirsiniz, örneğin ` handleClick()}>`:



```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Işıkları aç/kapat
    </button>
  );
}
```