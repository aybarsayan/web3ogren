---
title: Bileşenleri Saf Tutma
seoTitle: Bileşenlerinizi Saf Tutmanın Yolları
sidebar_position: 4
description: Bu makalede, bileşenlerinizi saf fonksiyonlar olarak yazmanın önemini ve bunu nasıl başaracağınızı öğreneceksiniz. Hatalardan kaçınma yolları ve Sıkı Modu kullanma yöntemleri üzerinde durulmaktadır.
tags: 
  - bileşenler
  - saf fonksiyonlar
  - React
  - programlama
keywords: 
  - bileşenler
  - saf fonksiyonlar
  - React
  - JavaScript
---
Bazı JavaScript fonksiyonları *saf*tır. Saf fonksiyonlar yalnızca bir hesaplama yapar ve başka hiçbir şey yapmaz. Bileşenlerinizi yalnızca saf fonksiyonlar olarak yazarak, kod tabanınız büyüdükçe kafa karıştırıcı hatalar ve öngörülemeyen davranışlar sınıfını önleyebilirsiniz. Ancak bu avantajları elde etmek için dikkat etmeniz gereken bazı kurallar vardır.





* Saflığın ne olduğunu ve hatalardan nasıl kaçınmanıza yardımcı olduğunu
* Bileşenleri saf tutmanın yollarını, değişiklikleri render aşamasından uzak tutarak
* Bileşenlerinizde hataları bulmak için Sıkı Modu nasıl kullanacağınızı



## Saflık: Bileşenler Formüller Gibi {/*purity-components-as-formulas*/}

Bilgisayar bilimlerinde (ve özellikle işlevsel programlama dünyasında), [saf bir fonksiyon](https://wikipedia.org/wiki/Pure_function) aşağıdaki özelliklere sahip bir fonksiyondur:

* **Kendine gelir.** Çağrılmadan önce var olan hiçbir nesne veya değişkeni değiştirmez.
* **Aynı girdiler, aynı çıkış.** Aynı girdiler verildiğinde, bir saf fonksiyon her zaman aynı sonucu döndürmelidir.

> Bir saf fonksiyon örneğiyle zaten tanışmış olabilirsiniz: matematikteki formüller.  
> — İlk aldığımız derslerden bir tanesi.

Bu matematik formülünü düşünün: y = 2x.

Eğer x = 2 ise, o zaman y = 4. Her zaman.

Eğer x = 3 ise, o zaman y = 6. Her zaman. 

Eğer x = 3, y bazen 9 veya –1 veya 2.5 olmayacaktır; günün saatine veya borsa durumuna bağlı olmayacaktır.

Eğer y = 2x ve x = 3, y _her zaman_ 6 olacaktır. 

Bunu bir JavaScript fonksiyonu haline getirirsek, şöyle görünecektir:

```js
function double(number) {
  return 2 * number;
}
```

Yukarıdaki örnekte, `double` bir **saf fonksiyondur.** Eğer ona `3` verirseniz, `6` döndürecektir. Her zaman.

React bu kavrama göre tasarlanmıştır. **React, yazdığınız her bileşenin bir saf fonksiyon olduğunu varsayar.** Bu, yazdığınız React bileşenlerinin her zaman aynı girdiler verildiğinde aynı JSX’i döndürmesi gerektiği anlamına gelir:



```js src/App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>{drinkers} bardak su kaynatın.</li>
      <li>{drinkers} kaşık çay ve {0.5 * drinkers} kaşık baharat ekleyin.</li>
      <li>{0.5 * drinkers} bardak süt ve isteğe göre şeker ekleyin.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Baharatlı Chai Tarifi</h1>
      <h2>İki kişi için</h2>
      <Recipe drinkers={2} />
      <h2>Toplantılar için</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```



`drinkers={2}` değerini `Recipe` bileşenine geçtiğinizde, `2 bardak su` içeren JSX döndürecektir. Her zaman.

Eğer `drinkers={4}` geçirirseniz, `4 bardak su` içeren JSX döndürecektir. Her zaman.

Tam bir matematik formülü gibi.

Bileşenlerinizi tarifler olarak düşünebilirsiniz: eğer onları takip ederseniz ve pişirme sürecinde yeni malzemeler eklemezseniz, her defasında aynı yemeği alırsınız. O "yemek", bileşenin React'e sunacağı JSX'tir `render.`



## Yan Etkiler: (istenmeyen) sonuçlar {/*side-effects-unintended-consequences*/}

React'in render süreci her zaman saf olmalıdır. Bileşenler yalnızca *JSX’lerini* döndürmelidir ve önceden var olan nesneleri veya değişkenleri *değiştirmemelidir*—bu onları saf olmayan hale getirir!

:::warning
Bu kuralı bozan bir bileşen örneği:
:::



```js
let guest = 0;

function Cup() {
  // Kötü: mevcut bir değişkeni değiştiriyor!
  guest = guest + 1;
  return <h2>Misafir #{guest} için çay bardağı</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```



Bu bileşen, dışarıda tanımlanmış bir `guest` değişkenini okuyor ve yazıyor. Bu, **bu bileşeni birden fazla kez çağırmanın farklı JSX’ler üretmesine neden olur!** Dahası, _diğer_ bileşenler `guest` değişkenini okursa, onları da aynı şekilde etkileyebilir. Bu öngörülemez.

Formüle geri dönecek olursak y = 2x, artık x = 2 olsa bile, y = 4 olduğuna güvenemeyiz. Testlerimiz başarısız olabilir, kullanıcılarımız kafası karışık olur, uçaklar havadan düşebilir—bunun kafa karıştırıcı hatalara yol açabileceğini görebilirsiniz!

Bu bileşeni, `guest` değişkenini bir prop olarak geçerek` düzeltebilirsiniz:



```js
function Cup({ guest }) {
  return <h2>Misafir #{guest} için çay bardağı</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```



Artık bileşeniniz saf, çünkü döndürdüğü JSX yalnızca `guest` prop’unun değerine bağlı. 

Genel olarak, bileşenlerinizin herhangi bir belirli sırada render edilmesini beklememelisiniz. y = 2x formülünü y = 5x formülünden önce veya sonra çağırmanızın bir önemi yoktur: her iki formül de birbiriyle bağımsız olarak çözülecektir. Aynı şekilde, her bileşen yalnızca "kendi düşünmelidir" ve render sırasında başkalarıyla koordine olmaya veya onlara bağımlı olmaya çalışmamalıdır. Render, bir okul sınavı gibidir: her bileşen kendi JSX'ini hesaplamalıdır!



#### Sıkı Mod ile saf olmayan hesaplamaları tespit etme {/*detecting-impure-calculations-with-strict-mode*/}

Henüz hepsini kullanmamış olabilirsiniz, ancak React'ta render sırasında okuyabileceğiniz üç tür giriş vardır: `props`, `state` ve `context.`. Bu girişleri her zaman yalnızca okunabilir olarak değerlendirmelisiniz.

Kullanıcı girdisine yanıt olarak bir şeyi *değiştirmek* istediğinizde, bunu `state belirlemek` yerine bir değişkene yazmamalısınız. Bileşeniniz render olurken mevcut değişkenleri veya nesneleri değiştirmemelisiniz.

React, geliştirme sırasında her bileşenin işlevini iki kez çağıran "Sıkı Mod"u sunar. **Bileşen işlevlerini iki kez çağırarak, Sıkı Mod bu kuralları bozan bileşenleri bulmaya yardımcı olur.**

Orijinal örneğin "Misafir #2", "Misafir #4" ve "Misafir #6" gösterdiğini, "Misafir #1", "Misafir #2" ve "Misafir #3" göstermediğini fark edin. Orijinal işlev saf değildi, bu yüzden iki kez çağırıldığında bozulmuştu. Ancak düzeltildiğinde, saf sürüm bile her çağrıldığında düzgün çalışır. **Saf fonksiyonlar yalnızca hesaplama yapar, bu yüzden onları iki kez çağırmak hiçbir şeyi değiştirmeyecektir** —tıpkı `double(2)` fonksiyonunu iki kez çağırmanın döndürülen sonucu değiştirmemesi gibi; y = 2x formülünü iki kez çözmek y'nin değerini değiştirmeyecektir. Aynı girdiler, aynı çıktılar. Her zaman.

Sıkı Modun üretimde hiçbir etkisi yoktur, bu nedenle kullanıcılarınız için uygulamanın yavaşlamasına neden olmaz. Sıkı Mod'a geçmek için, kök bileşeninizi `` içine sarabilirsiniz. Bazı çerçeveler bunu varsayılan olarak yapar.



### Yerel mutasyon: Bileşeninizin küçük sırrı {/*local-mutation-your-components-little-secret*/}

Yukarıdaki örnekte, sorun bileşenin render sırasında mevcut bir değişkeni değiştirmesiydi. Bu genellikle **"mutasyon"** olarak adlandırılır ve biraz daha korkutucu bir hale getirilmiştir. Saf fonksiyonlar, işlevin kapsamı dışındaki değişkenleri veya çağrıdan önce oluşturulmuş nesneleri değiştirmez—bu onları saf olmayan hale getirir!

Ancak, **render sırasında yalnızca *yeni* oluşturduğunuz değişkenleri ve nesneleri değiştirmeniz tamamen doğaldır.** Bu örnekte, bir `[]` dizisi oluşturuyorsunuz, bunu `cups` değişkenine atıyorsunuz ve ardından içine bir düzine fincan ekliyorsunuz:



```js
function Cup({ guest }) {
  return <h2>Misafir #{guest} için çay bardağı</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```



Eğer `cups` değişkeni veya `[]` dizisi `TeaGathering` fonksiyonunun dışında oluşturulmuş olsaydı, bu büyük bir sorun olurdu! Dışarıdan bir kod, bu diziye öğeler ekleyerek mevcut bir nesneyi değiştiriyor olacaktı.

Ancak, bunu *aynı render sırasında*, `TeaGathering` içinde oluşturduğunuz için sorun yok. Dışarıda, `TeaGathering` işlevinin böyle bir şey yaptığını asla bilemez. Buna **"yerel mutasyon"** denir—bu, bileşeninizin küçük sırrı gibidir.

## Nerede yan etkiler oluşturabilirsiniz {/*where-you-_can_-cause-side-effects*/}

Fonksiyonel programlama saf olmaya yoğun bir şekilde dayanır, ancak bir noktada, bir yerde, _bir şeyin_ değişmesi gerekir. Bu programlamanın temel noktasıdır! Bu değişiklikler —ekranı güncellemek, bir animasyona başlamak, veriyi değiştirmek— **yan etkiler** olarak adlandırılır. Render sırasında değil, _yan tarafta_ gerçekleşen şeylerdir.

React'te, **yan etkiler genellikle `olay işleyicileri içinde` bulunur.** Olay işleyicileri, bir eylem gerçekleştirdiğinizde React'in çalıştırdığı işlevlerdir—örneğin, bir düğmeye tıkladığınızda. Olay işleyicileri bileşeniniz içinde *tanımlanmış* olsa da, *render sırasında* çalışmazlar! **Bu yüzden olay işleyicileri saf olmak zorunda değildir.**

Tüm diğer seçenekleri kullandıysanız ve yan etkiniz için doğru olay işleyicisini bulamıyorsanız, bileşeninizde bir `useEffect` çağrısı ile döndürülen JSX'inize hala ekleyebilirsiniz. Bu, React'e bunu daha sonra, renderdan sonra, yan etkilerin izin verildiği bir zamanda gerçekleştirmesi talimatı verir. **Ancak, bu yaklaşım son çare olmalıdır.**

Mümkünse, mantığınızı yalnızca render ile ifade etmeye çalışın. Bunu nasıl yapabileceğiniz konusunda şaşıracaksınız!



#### React neden saflıkla ilgileniyor? {/*why-does-react-care-about-purity*/}

Saf fonksiyonlar yazmak bazı alışkanlık ve disiplin gerektirir. Ancak bu, büyüleyici fırsatları da beraberinde getirir:

* Bileşenleriniz farklı bir ortamda çalıştırılabilir—örneğin, sunucuda! Aynı girdiler için aynı sonucu döndürdüklerinden, bir bileşen birçok kullanıcı isteğine hizmet edebilir.
* Değişmeyen bileşenlerin renderını atlayarak performansı artırabilirsiniz—bu, saf fonksiyonların her zaman aynı sonuçlar döndürmesi nedeniyle güvenlidir, dolayısıyla bunları önbelleğe almak güvenlidir.
* Derin bileşen ağacını render ederken bazı veriler değişirse, React eski renderi bitirmek için zaman kaybetmeden renderı yeniden başlatabilir. Saflık, hesaplamayı istediğiniz zaman durdurmayı güvenli hale getirir.

Yapımını üstlendiğimiz her yeni React özelliği saflıktan faydalanır. Veri alma, animasyonlar ve performanstan, bileşenleri saf tutmak, React paradigmasının gücünü serbest bırakır.





* Bir bileşen saf olmalıdır, yani:
  * **Kendine gelir.** Render öncesinde var olan nesneleri veya değişkenleri değiştirmemelidir.
  * **Aynı girdiler, aynı çıkış.** Aynı girdiler verildiğinde, bir bileşen her zaman aynı JSX döndürmelidir. 
* Render her an gerçekleşebilir, bu yüzden bileşenler birbirlerinin render sırasına bağlı olmamalıdır.
* Bileşenlerinizin renderında kullandığınız herhangi bir girişi değiştirmemelisiniz. Bu, props, state ve context'i içerir. Ekranı güncellemek için, mevcut nesneleri değiştirmek yerine `"state belirleyin"`.
* Bileşeninizin mantığını döndürdüğünüz JSX'de ifade etmeye çalışın. "Bir şeyleri değiştirmek" gerektiğinde genellikle bunu bir olay işleyicisinde yapmak istersiniz. Son çare olarak, `useEffect` kullanabilirsiniz.
* Saf fonksiyonlar yazmak biraz pratik gerektirir, ancak bu, React'ın paradigmasının gücünü serbest bırakır.





#### Bozuk bir saati düzeltin {/*fix-a-broken-clock*/}

Bu bileşen, gece yarısından altı saat kadar CSS sınıfını `"night"` olarak ayarlamaya çalışmakta ve tüm diğer zamanlarda `"day"` olarak ayarlamaktadır. Ancak işe yaramıyor. Bu bileşeni düzeltebilir misiniz?

Çözümünüzün işe yaradığını geçici olarak bilgisayarın saat dilimini değiştirerek doğrulayabilirsiniz. Geçerli zaman gece yarısı ile altı arasında olduğunda, saat ters renkler göstermelidir!



Render bir *hesaplamadır*, "bir şeyler yapmaya" çalışmamalıdır. Aynı fikri farklı bir şekilde ifade edebilir misiniz?





```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```





Bu bileşeni, `className`'i hesaplayarak ve bunu render çıktısına dahil ederek düzeltebilirsiniz:



```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```



Bu örnekte, yan etki (DOM'u değiştirmek) aslında tamamen gereksizdi. Sadece JSX döndürmeniz yeterliydi.



#### Bozuk bir profili düzeltin {/*fix-a-broken-profile*/}

İki `Profile` bileşeni yan yana farklı verilerle render ediliyor. İlk profilde "Daralt" butonuna basarak ardından "Genişlet" butonuna basın. İki profilde de aynı kişi göründüğünü fark edeceksiniz. Bu bir hata.

Hatanın kaynağını bulun ve düzeltin.



Hatalı kod `Profile.js` içinde. Tüm kodu üstten alta okuduğunuzdan emin olun!





```js src/Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Daralt' : 'Genişlet'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```





Sorun, `Profile` bileşeninin bir mevcut değişken olan `currentPerson`'a yazması ve `Header` ile `Avatar` bileşenlerinin ondan okumasıdır. Bu, *üçünün de* saf olmaması ve tahmin edilmesi zor hale gelmesine neden olur.

Hata düzeltmek için `currentPerson` değişkenini kaldırın. Bunun yerine, `Profile`'dan `Header` ve `Avatar` bileşenlerine tüm bilgiyi props aracılığıyla iletin. Her iki bileşene de bir `person` prop'u eklemeniz ve bu bilgiyi en alta kadar geçirmeniz gerekecek.



```js src/Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Daralt' : 'Genişlet'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```



React'in bileşen işlevleri belirli bir sırada çalışacağına dair bir garanti vermediğini unutmayın, bu yüzden bileşenler arasında iletişim kurmak için değişkenleri ayarlayamazsınız. Tüm iletişim yalnızca props aracılığıyla gerçekleşmelidir.