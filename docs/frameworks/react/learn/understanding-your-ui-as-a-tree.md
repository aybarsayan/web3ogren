---
title: Kullanıcı Arayüzünüzü Bir Ağaç Olarak Anlamak
seoTitle: Kullanıcı Arayüzünüzü Ağaç Modeli ile Anlamak
sidebar_position: 1
description: React uygulamalarında kullanıcı arayüzlerinin ağaç yapısı ile nasıl modellendiğini keşfedin. Bileşen ilişkilerini anlamanın yanı sıra performans ve durum yönetiminde nasıl faydalı olabileceğini öğrenin.
tags: 
  - React
  - kullanıcı arayüzü
  - bileşen yapısı
  - performans
keywords: 
  - React
  - bileşen
  - ağaç yapısı
  - uygulama performansı
---
React uygulamanız, birbirinin içine yerleştirilmiş birçok bileşen ile şekil alıyor. React, uygulamanızın bileşen yapısını nasıl takip ediyor?

React ve birçok diğer UI kütüphanesi, kullanıcı arayüzünü bir ağaç olarak modellemektedir. Uygulamanızı bir ağaç olarak düşünmek, bileşenler arasındaki ilişkiyi anlamak için faydalıdır. Bu anlayış, performans ve durum yönetimi gibi gelecekteki kavramları hata ayıklamanıza yardımcı olacaktır.





* React'in bileşen yapısını nasıl "gördüğünü"
* Render ağacının ne olduğunu ve ne işe yaradığını
* Modül bağımlılığı ağacının ne olduğunu ve ne işe yaradığını



## Kullanıcı Arayüzünüzü Bir Ağaç Olarak {/*your-ui-as-a-tree*/}

Ağaçlar, nesneler arasındaki ilişki modelidir ve kullanıcı arayüzü genellikle ağaç yapıları kullanılarak temsil edilir. Örneğin, tarayıcılar HTML'yi ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) ve CSS'i ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)) modellemek için ağaç yapıları kullanır. Mobil platformlar da görünüm hiyerarşilerini temsil etmek için ağaçlar kullanmaktadır.



React, bileşenlerinizden bir kullanıcı arayüzü ağacı oluşturur. Bu örnekte, UI ağacı daha sonra DOM'a render edilir.


Tarayıcılar ve mobil platformlar gibi, React da bileşenler arasındaki ilişkiyi yönetmek ve modellemek için ağaç yapıları kullanır. Bu ağaçlar, bir React uygulamasında verilerin nasıl aktığını ve render ile uygulama boyutunu nasıl optimize edeceğinizi anlamak için faydalı araçlardır.

## Render Ağacı {/*the-render-tree*/}

Bileşenlerin ana özelliklerinden biri, başka bileşenlerden bileşenler oluşturma yeteneğidir. `Bileşenleri iç içe yerleştirdiğimizde`, her biri başka bir bileşenin çocuğu olabilen ebeveyn ve çocuk bileşenleri kavramı vardır.

Bir React uygulamasını render ettiğimizde, bu ilişkiyi render ağacı olarak bilinen bir ağaçta modelleyebiliriz.

> İşte ilham verici alıntılar render eden bir React uygulaması.
> — Öneri



```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/quotes.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```





React, render edilen bileşenlerden oluşan bir *render ağacı* oluşturur.



Örnek uygulamadan yukarıdaki render ağacını inşa edebiliriz.

Ağaç, her birinin bir bileşeni temsil eden düğümlerden oluşmaktadır. `App`, `FancyText`, `Copyright` gibi isimler, ağacımızdaki düğümlerden sadece birkaçıdır.

Bir React render ağacındaki kök düğüm, uygulamanın `kök bileşeni`'dir. Bu durumda, kök bileşen `App`dir ve React'ın render ettiği ilk bileşendir. Ağaçtaki her ok bir ebeveyn bileşeninden bir çocuk bileşenine işaret eder.



#### Render ağacındaki HTML etiketleri nerede? {/*where-are-the-html-elements-in-the-render-tree*/}

Yukarıdaki render ağacında, her bileşenin render ettiği HTML etiketlerinden bahsedilmediğini fark edeceksiniz. Bunun nedeni, render ağacının yalnızca React `bileşenleri` ile oluşmasıdır.

React, bir UI çerçevesi olarak platformdan bağımsızdır. react.dev'de, web'e render eden örnekler sunuyoruz, bu da HTML işaretlemesini UI ilkelimiz olarak kullanır. Ancak bir React uygulaması, farklı UI ilkeleleri kullanabilen bir mobil veya masaüstü platformuna da render edebilir; örneğin [UIView](https://developer.apple.com/documentation/uikit/uiview) veya [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

Bu platform UI ilkeleleri React'in bir parçası değildir. React render ağaçları, uygulamanızın hangi platformda render edildiğine bakılmaksızın, uygulama içgüdülerimizi sağlamaktadır.



Render ağacı, bir React uygulamasının tek bir render geçişini temsil eder. [Koşullu render](https://learn/conditional-rendering) ile bir ebeveyn bileşen, geçen veriye bağlı olarak farklı çocukları render edebilir.

Uygulamayı, ilham verici alıntıyı ya da rengi koşullu olarak render edecek şekilde güncelleyebiliriz.



```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
        ? <FancyText text={inspiration.value} />
        : <Color value={inspiration.value} />}

      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  {type: 'quote', value: "Don’t let yesterday take up too much of today.” — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Ambition is putting a ladder against the sky."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "A joy that's shared is a joy made double."},
  {type: 'color', value: "#F9F2B4"},
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```





Koşullu render ile, farklı renderlar arasında render ağacı farklı bileşenleri render edebilir.



Bu örnekte, `inspiration.type` değerine göre `` veya `` render edebiliriz. Render ağacı, her render geçişi için farklı olabilir.

Render ağaçları render geçişleri arasında farklılık gösterebilirken, bu ağaçlar genellikle React uygulamanızdaki *üst düzey* ve *uç düğüm bileşenlerini* tanımlamak için faydalıdır. Üst düzey bileşenler, kök bileşene en yakın olanlardır ve onların altında yer alan tüm bileşenlerin render performansını etkiler ve genellikle en fazla karmaşıklığa sahiptir. Uç düğüm bileşenleri, ağacın alt kısmında bulunur, çocuk bileşenleri yoktur ve sıklıkla yeniden render edilirler.

Bu bileşen kategorilerini tanımlamak, uygulamanızdaki veri akışını ve performansı anlamak için faydalıdır.

## Modül Bağımlılığı Ağacı {/*the-module-dependency-tree*/}

React uygulamasında bir ağaç ile modellenebilecek bir diğer ilişki, uygulamanın modül bağımlılıklarıdır. Bileşenlerimizi `ayırdığımızda` ve mantığı ayrı dosyalara koyduğumuzda, bileşenleri, fonksiyonları veya sabitleri içerebileceğimiz [JS modülleri](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) oluştururuz.

Modül bağımlılık ağacındaki her düğüm bir modüldür ve her dal, o modülde bulunan bir `import` ifadesini temsil eder.

Önceki İlham uygulamasını alırsak, bir modül bağımlılığı ağacı veya kısaca bağımlılık ağacı inşa edebiliriz.



İlham uygulaması için modül bağımlılığı ağacı.



Ağacın kök düğümü kök modüldür, ayrıca giriş dosyası olarak da bilinir. Genellikle kök bileşeni içeren modüldür.

Aynı uygulamanın render ağacı ile karşılaştırıldığında, benzer yapılar vardır ancak bazı önemli farklılıklar bulunur:

* Ağacı oluşturan düğümler modülleri temsil eder, bileşenleri değil.
* `inspirations.js` gibi bileşen olmayan modüller bu ağaçta da yer alır. Render ağacı yalnızca bileşenleri kapsar.
* `Copyright.js`, `App.js` altında görünürken, render ağacında `Copyright` bileşeni `InspirationGenerator`'ın çocuğu olarak görünmektedir. Bunun nedeni, `InspirationGenerator`'ın JSX'i `çocuk prop'ları olarak` kabul etmesidir; bu nedenle, `Copyright` bileşeni bir çocuk bileşeni olarak render edilir ancak modülü içe aktaramaz.

Bağımlılık ağaçları, React uygulamanızı çalıştırmak için hangi modüllerin gerekli olduğunu belirlemek için faydalıdır. Üretim için bir React uygulaması inşa ederken, genellikle tüm gerekli JavaScript'i istemciye gönderecek bir yapı adımı vardır. Bunu gerçekleştiren araçlara [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem) denir ve bundle'lar bağımlılık ağaçını kullanarak hangi modüllerin dahil edileceğini belirler.

Uygulamanız büyüdükçe, genellikle bundle boyutu da büyür. Büyük bundle boyutları, bir istemcinin indirmesi ve çalıştırması için pahalıdır. Büyük bundle boyutları, kullanıcı arayüzünüzün çizilmesi için gereken süreyi geciktirebilir. Uygulamanızın bağımlılık ağaçlarını anlamak bu sorunları hata ayıklamak için yardımcı olabilir.



* Ağaçlar, varlıklar arasındaki ilişkiyi temsil etmenin yaygın bir yoludur. Genellikle kullanıcı arayüzlerini modellemek için kullanılırlar.
* Render ağaçları, bir render geçişi boyunca React bileşenleri arasındaki iç içe geçmiş ilişkiyi temsil eder.
* Koşullu render ile, render ağacı farklı renderlar arasında değişebilir. Farklı prop değerleri ile, bileşenler farklı çocuk bileşenleri render edebilir.
* Render ağaçları, üst düzey ve uç düğüm bileşenlerini tanımlamaya yardımcı olur. Üst düzey bileşenler, bunların altında yer alan tüm bileşenlerin render performansını etkiler ve uç düzüm bileşenleri sıklıkla yeniden render edilir. Bunları tanımlamak, render performansını anlamak ve hata ayıklamak için faydalıdır.
* Bağımlılık ağaçları, bir React uygulamasındaki modül bağımlılıklarını temsil eder.
* Bağımlılık ağaçları, uygulamayı göndermek için gerekli kodu bir araya getirmek için yapı araçları tarafından kullanılır.
* Bağımlılık ağaçları, UI'nin çizilme süresini yavaşlatan büyük bundle boyutlarını hata ayıklamak için faydalıdır ve hangi kodun bundle'landığını optimize etme fırsatlarını açığa çıkarır.
