---
title: Bileşenleri İçe ve Dışa Aktarma
seoTitle: Bileşen İçe ve Dışa Aktarma Rehberi
sidebar_position: 5
description: Bu sayfada, bileşenlerin nasıl içe ve dışa aktarılacağı hakkında bilgi bulacaksınız. Ayrıca varsayılan ve adlandırılmış içe ve dışa aktarmalar hakkında detaylar yer almaktadır.
tags: 
  - bileşen
  - içe aktarma
  - dışa aktarma
  - JavaScript
  - React
keywords: 
  - bileşen
  - içe aktarma
  - dışa aktarma
  - JavaScript
  - React
---
Bileşenlerin sihri, yeniden kullanılabilirliğindedir: başka bileşenlerden oluşan bileşenler oluşturabilirsiniz. Ancak daha fazla bileşeni iç içe yerleştirdikçe, genellikle bunları farklı dosyalara ayırmak mantıklıdır. Bu, dosyalarınızı taraması kolay tutmanıza ve bileşenleri daha fazla yerde yeniden kullanmanıza olanak tanır.





* Kök bileşen dosyasının ne olduğunu
* Bir bileşeni nasıl içe ve dışa aktaracağınızı
* Ne zaman varsayılan ve adlandırılmış içe ve dışa aktarımlar kullanmanız gerektiğini
* Bir dosyadan birden fazla bileşeni nasıl içe ve dışa aktaracağınızı
* Bileşenleri nasıl birden fazla dosyaya ayıracağınızı



## Kök Bileşen Dosyası {/*the-root-component-file*/}

`İlk Bileşeniniz` içindeki bir `Profile` bileşeni ve onu render eden bir `Gallery` bileşeni oluşturdunuz:



```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Harika bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```



Bunlar şu anda bu örnekte `App.js` adlı bir **kök bileşen dosyasında** bulunmaktadır. Yapınıza bağlı olarak, kök bileşeniniz başka bir dosyada da olabilir. Eğer Next.js gibi dosya tabanlı yönlendirmeye sahip bir çerçeve kullanıyorsanız, her sayfa için kök bileşeniniz farklı olacaktır.

## Bir Bileşeni Dışa ve İçe Aktarma {/*exporting-and-importing-a-component*/}

Gelecekte açılış ekranını değiştirmek ve oraya bir bilim kitapları listesi koymak isterseniz ne olur? Veya tüm profilleri başka bir yere yerleştirmek? `Gallery` ve `Profile`'ı kök bileşen dosyasından taşımak mantıklıdır. Bu, onları diğer dosyalarda daha modüler ve yeniden kullanılabilir hale getirecektir. Bir bileşeni üç adımda taşıyabilirsiniz:

1. **Yeni** bileşenleri koymak için bir JS dosyası oluşturun.
2. O dosyadan işlev bileşenini **dışa aktarın** (ya [varsayılan](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) ya da [adlandırılmış](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) dışa aktarımlar kullanarak).
3. Bileşeni kullanacağınız dosyada **içe aktarın** (corresponding technique for importing [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) or [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) exports).

Burada `Profile` ve `Gallery` `App.js`'dan yeni `Gallery.js` adlı bir dosyaya taşınmıştır. Artık `App.js`'i `Gallery.js`'den `Gallery`'yi içe aktarmak için değiştirebilirsiniz:



```js src/App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Harika bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```



Bu örneğin artık iki bileşen dosyasına bölündüğüne dikkat edin:

1. `Gallery.js`:
     - Aynı dosyada yalnızca kullanılan `Profile` bileşenini tanımlar ve dışa aktarmaz.
     - `Gallery` bileşenini **varsayılan dışa aktarma** olarak dışa aktarır.
2. `App.js`:
     - `Gallery`'yi `Gallery.js`'den **varsayılan içe aktarma** olarak alır.
     - Kök `App` bileşenini **varsayılan dışa aktarma** olarak dışa aktarır.



Dosya uzantısı `.js` olmayan dosyalarla karşılaşabilirsiniz:

```js 
import Gallery from './Gallery';
```

Hem `'./Gallery.js'` hem de `'./Gallery'` React ile çalışır, ancak ilki [yerel ES Modüllerinin](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) çalışma biçimine daha yakındır.





#### Varsayılan ve Adlandırılmış Dışa Aktarımlar {/*default-vs-named-exports*/}

JavaScript'te değerleri dışa aktarmanın iki ana yolu vardır: varsayılan dışa aktarımlar ve adlandırılmış dışa aktarımlar. Şu ana kadar örneklerimiz yalnızca varsayılan dışa aktarımlar kullanmıştır. Ancak aynı dosyada bir veya her ikisini de kullanabilirsiniz. **Bir dosya, bir _varsayılan_ dışa aktarımdan fazlasına sahip olamaz, ancak istediğiniz kadar _adlandırılmış_ dışa aktarıma sahip olabilir.**

![Varsayılan ve adlandırılmış dışa aktarımlar](../../images/frameworks/react/public/images/docs/illustrations/i_import-export.svg)

Bileşeninizi nasıl dışa aktardığınız, onu nasıl içe aktarmanız gerektiğini belirler. Eğer bir varsayılan dışa aktarmayı adlandırılmış dışa aktarma gibi içe aktarmaya çalışırsanız bir hata alırsınız! Bu tablo, takip etmenize yardımcı olabilir:

| Sözdizimi        | Dışa aktarma ifadesi                    | İçe aktarma ifadesi                       |
| -----------      | -----------                             | -----------                               |
| Varsayılan  | `export default function Button() {}` | `import Button from './Button.js';`      |
| Adlandırılmış    | `export function Button() {}`         | `import { Button } from './Button.js';`  |

Bir _varsayılan_ içe aktarma yazarken, `import` ifadesinden sonra istediğiniz herhangi bir ismi koyabilirsiniz. Örneğin, `import Banana from './Button.js'` yazabilirsiniz ve bu yine de aynı varsayılan dışa aktarımı sağlar. Aksine, adlandırılmış içe aktarmalarda, isimlerin her iki tarafta da eşleşmesi gerekir. Bu yüzden bunlara _adlandırılmış_ içe aktarmalar denir!

**Bir dosyanın yalnızca bir bileşen dışa aktardığı durumlarda genellikle varsayılan dışa aktarım kullanılır, birden fazla bileşen ve değer dışa aktardığında ise adlandırılmış dışa aktarımlar kullanılır.** Hangi kodlama stilini tercih ederseniz edin, her zaman bileşen işlevlerinize ve onları içeren dosyalara anlamlı isimler verin. `export default () => {}` gibi isimsiz bileşenler önerilmez çünkü hata ayıklamayı zorlaştırır.



## Aynı Dosyadan Birden Fazla Bileşeni Dışa ve İçe Aktarma {/*exporting-and-importing-multiple-components-from-the-same-file*/}

Eğer yalnızca bir `Profile` göstermek isterseniz ne olur? `Profile` bileşenini de dışa aktarabilirsiniz. Ancak `Gallery.js` zaten bir *varsayılan* dışa aktarma içeriyor ve _iki_ varsayılan dışa aktarıma sahip olamazsınız. Yeni bir dosya oluşturup varsayılan dışa aktarma yapabilir veya `Profile` için bir *adlandırılmış* dışa aktarma ekleyebilirsiniz. **Bir dosya yalnızca bir varsayılan dışa aktarıma sahip olabilir, ancak birçok adlandırılmış dışa aktarıma sahip olabilir!**



Varsayılan ve adlandırılmış dışa aktarımlar arasındaki potansiyel karışıklığı azaltmak için bazı takımlar yalnızca bir stil (varsayılan veya adlandırılmış) kullanmayı tercih eder veya bir dosyada karıştırmaktan kaçınırlar. Sizin için en iyi ne işe giriyorsa onu yapın!



Öncelikle, `Gallery.js`'den `Profile`'ı adlandırılmış bir dışa aktarma kullanarak **dışa aktarın** (no `default` keyword):

```js
export function Profile() {
  // ...
}
```

Sonra, `App.js` içinden `Gallery.js`'den `Profile`'ı adlandırılmış bir içe aktarma kullanarak **içe aktarın** (küme parantezleri ile):

```js
import { Profile } from './Gallery.js';
```

Son olarak, `App` bileşeninden ``'i **render** edin:

```js
export default function App() {
  return <Profile />;
}
```

Artık `Gallery.js` iki dışa aktarma içeriyor: bir varsayılan `Gallery` dışa aktarması ve bir adlandırılmış `Profile` dışa aktarması. `App.js` her ikisini de içe aktarıyor. Bu örnekte ``'i `` olarak değiştirmeyi ve geri dönmeyi deneyin:



```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js src/Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Harika bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```



Artık varsayılan ve adlandırılmış dışa aktarmaların bir karışımını kullanıyorsunuz:

* `Gallery.js`:
  - `Profile` bileşenini **adlandırılmış dışa aktarma olan `Profile` olarak dışa aktarır.**
  - `Gallery` bileşenini **varsayılan dışa aktarma olarak dışa aktarır.**
* `App.js`:
  - `Gallery`'yi `Gallery.js`'den **varsayılan bir içe aktarma** olarak alır.
  - `Profile`'ı `Gallery.js`'den **adlandırılmış bir içe aktarma olan `Profile` olarak alır.**
  - Kök `App` bileşenini **varsayılan dışa aktarma** olarak dışa aktarır.



Bu sayfada öğrendikleriniz:

* Kök bileşen dosyasının ne olduğunu
* Bir bileşeni nasıl içe ve dışa aktaracağınızı
* Varsayılan ve adlandırılmış içe ve dışa aktarımların ne zaman ve nasıl kullanılacağını
* Aynı dosyadan birden fazla bileşeni nasıl dışa aktaracağınızı





#### Bileşenleri Daha Da Ayır {/*split-the-components-further*/}

Şu anda, `Gallery.js` hem `Profile` hem de `Gallery`'yi dışa aktarır, bu biraz kafa karıştırıcıdır.

`Profile` bileşenini kendi `Profile.js` dosyasına taşıyın ve ardından `App` bileşenini hem `` hem de ``'yi birbiri ardına render etmek için değiştirin.

`Profile` için ya bir varsayılan ya da adlandırılmış dışa aktarma kullanabilirsiniz, ancak bunu hem `App.js`'de hem de `Gallery.js`'de karşılık gelen içe aktarma sözdizimini kullanmayı unutmayın! Yukarıdaki derin dalış tablosuna bakabilirsiniz:

| Sözdizimi        | Dışa aktarma ifadesi                    | İçe aktarma ifadesi                       |
| -----------      | -----------                             | -----------                               |
| Varsayılan  | `export default function Button() {}` | `import Button from './Button.js';`      |
| Adlandırılmış    | `export function Button() {}`         | `import { Button } from './Button.js';`  |



Bileşenlerinizi çağrıldığı yerde içe aktarmayı unutmayın. `Gallery`’nin de `Profile` kullanmadığını mı düşünüyorsunuz?





```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js src/Gallery.js active
// Beni Profile.js'e taşıyın!
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Harika bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```



Bir tür dışa aktarım kullanarak çalışana kadar çalışmaya devam edin ve daha sonra diğer türle çalıştırın.



Bu, adlandırılmış dışa aktarmalarla çözüm:



```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Harika bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```



Bu, varsayılan dışa aktarım ile çözüm:



```js src/App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Harika bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```