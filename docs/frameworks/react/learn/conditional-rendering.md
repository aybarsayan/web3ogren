---
title: Koşullu Renderleme
seoTitle: Koşullu Renderleme | React
sidebar_position: 4
description: Reactte koşullu renderleme yöntemlerini öğrenin. Farklı durumlarda JSX nasıl döndürüleceğini keşfedin.
tags: 
  - React
  - koşullu renderleme
  - JSX
  - JavaScript
keywords: 
  - React
  - koşullu renderleme
  - JSX
  - JavaScript
---
Bileşenleriniz genellikle farklı koşullara bağlı olarak farklı şeyler göstermek zorunda kalacaktır. React'te, `if` ifadeleri, `&&` ve `? :` operatörleri gibi JavaScript söz dizimini kullanarak JSX'yi koşullu olarak renderleyebilirsiniz.





* Bir koşula bağlı olarak farklı JSX nasıl döndürüleceği
* Bir JSX parçasının koşullu olarak nasıl dahil edileceği veya hariç tutulacağı
* React kod tabanlarında karşılaşacağınız yaygın koşullu sözdizimi kısayolları



## Koşullu Olarak JSX Döndürme {/*conditionally-returning-jsx*/}

Diyelim ki, `PackingList` bileşeniniz birkaç `Item` render ediyor ve bu bileşenler paketlenmiş veya paketlenmemiş olarak işaretlenebilir:



```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride'ın Paketleme Listesi</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Uzay elbisesi" 
        />
        <Item 
          isPacked={true} 
          name="Altın yapraklı kask" 
        />
        <Item 
          isPacked={false} 
          name="Tam'ın fotoğrafı" 
        />
      </ul>
    </section>
  );
}
```



Bazı `Item` bileşenlerinin `isPacked` propunun `false` yerine `true` olarak ayarlandığını fark edeceksiniz. `isPacked={true}` ise paketlenmiş öğelere bir onay işareti (✅) eklemek istiyorsunuz.

Bunu bir [`if`/`else` ifadesi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) şeklinde yazabilirsiniz:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Eğer `isPacked` prop'u `true` ise, bu kod **farklı bir JSX ağacı döndürür.** Bu değişiklik ile bazı öğeler sonunda bir onay işareti alır:



```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride'ın Paketleme Listesi</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Uzay elbisesi" 
        />
        <Item 
          isPacked={true} 
          name="Altın yapraklı kask" 
        />
        <Item 
          isPacked={false} 
          name="Tam'ın fotoğrafı" 
        />
      </ul>
    </section>
  );
}
```



Hangi durumda döndürülen öğeleri düzenlemeyi deneyin ve sonucun nasıl değiştiğini görün!

JavaScript'teki `if` ve `return` ifadeleri ile nasıl dallanma mantığı oluşturduğunuzu fark edin. React'te kontrol akışı (koşullar gibi) JavaScript ile yönetilir.

### `null` ile Hiçbir Şey Döndürmeden Koşullu Olarak Döndürme {/*conditionally-returning-nothing-with-null*/}

Bazı durumlarda, hiçbiri render etmek istemeyebilirsiniz. Örneğin, hiç paketlenmiş öğeleri göstermek istemiyorsanız. Bir bileşenin bir şeyi döndürmesi gerekir. Bu durumda `null` döndürebilirsiniz:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Eğer `isPacked` `true` ise, bileşen hiçbir şey döndürecek, `null` döndürecektir. Aksi halde, render edilecek bir JSX döndürecektir.



```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride'ın Paketleme Listesi</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Uzay elbisesi" 
        />
        <Item 
          isPacked={true} 
          name="Altın yapraklı kask" 
        />
        <Item 
          isPacked={false} 
          name="Tam'ın fotoğrafı" 
        />
      </ul>
    </section>
  );
}
```



Uygulamada, bir bileşenden `null` döndürmek nadirdir çünkü bu, onu render etmeye çalışan bir geliştiriciyi şaşırtabilir. Daha sık olarak, bileşeni üst bileşenin JSX'sinin içinde koşullu olarak dahil etmeyi veya hariç tutmayı tercih edersiniz. İşte bunu nasıl yapacağınız!

## JSX'yi Koşullu Olarak Dahil Etme {/*conditionally-including-jsx*/}

Önceki örnekte, hangi (varsa!) JSX ağacının bileşen tarafından döndürüleceğini kontrol ettiniz. Render çıktısında bazı tekrarlar fark etmiş olabilirsiniz:

```js
<li className="item">{name} ✅</li>
```

şu ile oldukça benzer:

```js
<li className="item">{name}</li>
```

Her iki koşullu dal, `...` döndürmektedir:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Bu tekrar zararlı olmasa da, kodunuzu bakımı zor hale getirebilir. `className`'i değiştirmek isterseniz? Kodunuzun iki yerinde bunu yapmak zorunda kalırsınız! Böyle bir durumda, kodunuzu daha [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) hale getirmek için bir miktar JSX'yi koşullu olarak dahil edebilirsiniz.

### Koşullu (ternary) operatör (`? :`) {/*conditional-ternary-operator--*/}

JavaScript'te koşullu bir ifadeyi yazmak için kompakt bir sözdizimi vardır - [koşullu operatör](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) veya "ternary operatörü".

Bunu şöyle yazmak yerine:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Şu şekilde yazabilirsiniz:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```

Bunu şöyle okuyabilirsiniz: *"Eğer `isPacked` doğruysa, o zaman (`?`) `name + ' ✅'` render et, aksi takdirde (`:`) `name` render et."*



#### Bu iki örnek tamamen eşdeğer mi? {/*are-these-two-examples-fully-equivalent*/}

Eğer nesne yönelimli programlama geçmişinden geliyorsanız, yukarıdaki iki örneğin ince bir şekilde farklı olduğunu düşünebilirsiniz; çünkü biri ``nin iki farklı "örneği" yaratabilir. Ancak JSX elemanları "örnekler" değildir çünkü iç durumu tutmazlar ve gerçek DOM düğümleri değildirler. Onlar hafif tanımlamalar, mavi baskılar gibi. Dolayısıyla bu iki örnek aslında *tamamen* eşdeğerdir. `Durumu Koruma ve Sıfırlama` bu konuyu detaylı olarak ele alıyor.



Şimdi diyelim ki, tamamlanan öğenin metnini başka bir HTML etiketine sarmak istiyorsunuz, örneğin `` ile üzerini çizmek için. Her iki durumda daha fazla JSX yerleştirmeyi kolaylaştıracak şekilde daha fazla boşluk ve parantez ekleyebilirsiniz:



```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✅'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride'ın Paketleme Listesi</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Uzay elbisesi" 
        />
        <Item 
          isPacked={true} 
          name="Altın yapraklı kask" 
        />
        <Item 
          isPacked={false} 
          name="Tam'ın fotoğrafı" 
        />
      </ul>
    </section>
  );
}
```



Bu stil, basit koşullar için iyi çalışır, ancak aşırı kullanmaktan kaçının. Eğer bileşenleriniz çok fazla iç içe geçmiş koşullu markup ile karmaşık hale gelirse, işleri temizlemek için çocuk bileşenleri çıkarmayı düşünün. React'te, markup kodunuzun bir parçasıdır, bu nedenle karmaşık ifadeleri düzenlemek için değişkenler ve fonksiyonlar gibi araçları kullanabilirsiniz.

### Mantıksal VE operatörü (`&&`) {/*logical-and-operator-*/}

Karşılaşacağınız bir başka yaygın kısayol ise [JavaScript mantıksal VE (`&&`) operatörü.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.) React bileşenleri içinde, genellikle koşul doğruysa bazı JSX'yi render etmek veya başka bir şey render etmemek istediğinizde ortaya çıkar. `&&` ile, yalnızca `isPacked` `true` ise onay işaretini koşullu olarak render edebilirsiniz:

```js
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

Bunu şöyle okuyabilirsiniz: *"Eğer `isPacked` doğruysa, o zaman (`&&`) onay işaretini render et, aksi takdirde, hiçbir şey render et."*

İşte eylemde:



```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride'ın Paketleme Listesi</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Uzay elbisesi" 
        />
        <Item 
          isPacked={true} 
          name="Altın yapraklı kask" 
        />
        <Item 
          isPacked={false} 
          name="Tam'ın fotoğrafı" 
        />
      </ul>
    </section>
  );
}
```



Bir [JavaScript && ifadesi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) eğer sol tarafı (`true`) ise, sağ tarafın değerini (bizim durumumuzda, onay işareti) döndürür. Ama eğer koşul `false` ise, tüm ifade `false` haline gelir. React bunun yerine boş bir yer olarak `false`'u dikkate alır, tıpkı `null` veya `undefined` gibi ve yerinde hiçbir şey render etmez.




**`&&`'nin sol tarafına sayılar yerleştirmeyin.**

Koşulu test etmek için, JavaScript otomatik olarak sol tarafı bir boolean'a dönüştürür. Ancak, eğer sol taraf `0` ise, o zaman tüm ifade o değeri alır (`0`) ve React bu durumda gerçekten `0`'ı render eder.

Örneğin, yaygın bir hata `messageCount && Yeni mesajlar` şeklinde yazmaktır. `messageCount` `0` olduğunda hiçbir şey render ettiğini varsaymak kolaydır, ama gerçekte `0`'ı kendisi render eder!

Bunu düzeltmek için, sol tarafı bir boolean yapın: `messageCount > 0 && Yeni mesajlar`.



### JSX'yi Bir Değişkene Koşullu Olarak Atama {/*conditionally-assigning-jsx-to-a-variable*/}

Kısayollar yazmayı zorlaştırdığında, düz bir kod yazmayı düşünün ve bir `if` ifadesi ve bir değişken kullanın. Gösterilecek varsayılan içeriği, isim olan bir değişkeni tanımlamakla başlayın:

```js
let itemContent = name;
```

Eğer `isPacked` `true` ise, `itemContent`'e bir JSX ifadesini yeniden atamak için bir `if` ifadesi kullanın:

```js
if (isPacked) {
  itemContent = name + " ✅";
}
```

`Parantezler, JavaScript'e "pencere" açar.` JSX ağacına döndürülen değişkenle birlikte açılan parantezleri kullanarak, daha önce hesaplanan ifadeyi JSX'in içine yerleştirin:

```js
<li className="item">
  {itemContent}
</li>
```

Bu stil en ayrıntılısıdır, ancak en esnek olanıdır. İşte eylemde:



```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✅";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride'ın Paketleme Listesi</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Uzay elbisesi" 
        />
        <Item 
          isPacked={true} 
          name="Altın yapraklı kask" 
        />
        <Item 
          isPacked={false} 
          name="Tam'ın fotoğrafı" 
        />
      </ul>
    </section>
  );
}
```



Öncekilerde olduğu gibi, bu metinler için değil, her türlü JSX için de geçerlidir:



```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✅"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride'ın Paketleme Listesi</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Uzay elbisesi" 
        />
        <Item 
          isPacked={true} 
          name="Altın yapraklı kask" 
        />
        <Item 
          isPacked={false} 
          name="Tam'ın fotoğrafı" 
        />
      </ul>
    </section>
  );
}
```



Eğer JavaScript ile tanışık değilseniz, bu çeşit stiller başlangıçta sizi bunaltıcı gelebilir. Ancak, bunları öğrenmek, herhangi bir JavaScript kodunu okumanıza ve yazmanıza yardımcı olacaktır - yalnızca React bileşenleri değil! Başlangıç için tercih ettiğiniz birini seçin ve diğerlerinin nasıl çalıştığını unuttuğunuzda bu referansa tekrar göz atın.



* React'te dallanma mantığını JavaScript ile kontrol edersiniz.
* Bir JSX ifadesini koşullu olarak bir `if` ifadesiyle döndürebilirsiniz.
* JSX içine başka JSX'yi dahil etmek için bir değişkene koşullu olarak bazı JSX'yi kaydedebilirsiniz.
* JSX'te `{cond ?  : }` demek *"eğer `cond`, `` render et, aksi takdirde `` render et."* anlamına gelir.
* JSX'te `{cond && }` demek *"eğer `cond`, `` render et, aksi takdirde hiçbir şey"* anlamına gelir.
* Kısayollar yaygındır, ancak düz `if` kullanmayı tercih ediyorsanız bunları kullanmak zorunda değilsiniz.





#### Tamamlanmamış öğeler için bir simge gösterin `? :` ile {/*show-an-icon-for-incomplete-items-with--*/}

`isPacked` `true` değilse bir ❌ render etmek için koşullu operatörü (`cond ? a : b`) kullanın.



```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride'ın Paketleme Listesi</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Uzay elbisesi" 
        />
        <Item 
          isPacked={true} 
          name="Altın yapraklı kask" 
        />
        <Item 
          isPacked={false} 
          name="Tam'ın fotoğrafı" 
        />
      </ul>
    </section>
  );
}
```







```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride'ın Paketleme Listesi</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Uzay elbisesi" 
        />
        <Item 
          isPacked={true} 
          name="Altın yapraklı kask" 
        />
        <Item 
          isPacked={false} 
          name="Tam'ın fotoğrafı" 
        />
      </ul>
    </section>
  );
}
```





#### Öğenin önemini `&&` ile gösterin {/*show-the-item-importance-with-*/}

Bu örnekte, her `Item` bir sayısal `importance` prop'u alır. Sıfırdan farklı olan önem için italik olarak "_(Önem: X)_" göstermek için `&&` operatörünü kullanın. Öğelerinizin listesi aşağıdaki gibi görünmelidir:

* Uzay elbisesi _(Önem: 9)_
* Altın yapraklı kask
* Tam'ın fotoğrafı _(Önem: 6)_

İki etiket arasında bir boşluk eklemeyi unutmayın!



```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride'ın Paketleme Listesi</h1>
      <ul>
        <Item 
          importance={9} 
          name="Uzay elbisesi" 
        />
        <Item 
          importance={0} 
          name="Altın yapraklı kask" 
        />
        <Item 
          importance={6} 
          name="Tam'ın fotoğrafı" 
        />
      </ul>
    </section>
  );
}
```





Bu işin üstesinden gelmeli:



```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Önem: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride'ın Paketleme Listesi</h1>
      <ul>
        <Item 
          importance={9} 
          name="Uzay elbisesi" 
        />
        <Item 
          importance={0} 
          name="Altın yapraklı kask" 
        />
        <Item 
          importance={6} 
          name="Tam'ın fotoğrafı" 
        />
      </ul>
    </section>
  );
}
```



Unutmayın ki, `importance > 0 && ...` yazmalısınız; `importance && ...` yazmak yerine. Böylece `importance` `0` olduğunda, `0` sonucu olarak render edilmez!

Bu çözümde, isim ve önem etiketi arasında bir boşluk eklemek için iki ayrı koşul kullanılır. Alternatif olarak, önde bir boşluk ile bir Fragment kullanabilir: `importance > 0 && ...` veya `` içinde hemen bir boşluk ekleyebilirsiniz: `importance > 0 &&  ...`.



#### Bir dizi `? :` koşulunu `if` ve değişkenlere yeniden düzenleyin {/*refactor-a-series-of---to-if-and-variables*/}

Bu `Drink` bileşeni, `name` prop'u `"tea"` veya `"coffee"` olup olmadığını gösteren bir dizi `? :` koşulu kullanmaktadır. Her içecek hakkında bilgi birkaç koşula yayılmış durumda. Bu kodu, üç `? :` koşulu yerine tek bir `if` ifadesi kullanacak şekilde yeniden düzenleyin.



```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Bitkinin kısmı</dt>
        <dd>{name === 'tea' ? 'yaprak' : 'fasulye'}</dd>
        <dt>Kafein içeriği</dt>
        <dd>{name === 'tea' ? '15–70 mg/kupa' : '80–185 mg/kupa'}</dd>
        <dt>Yaş</dt>
        <dd>{name === 'tea' ? '4,000+ yıl' : '1,000+ yıl'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```



Kodunuzu `if` kullanacak şekilde yeniden düzenledikten sonra, daha fazla basitleştirme konusunda fikirleriniz var mı?



Bu konuda birden fazla yol vardır, ancak burada bir başlangıç noktası:



```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'yaprak';
    caffeine = '15–70 mg/kupa';
    age = '4,000+ yıl';
  } else if (name === 'coffee') {
    part = 'fasulye';
    caffeine = '80–185 mg/kupa';
    age = '1,000+ yıl';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Bitkinin kısmı</dt>
        <dd>{part}</dd>
        <dt>Kafein içeriği</dt>
        <dd>{caffeine}</dd>
        <dt>Yaş</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```



Burada, her içecek hakkında bilgi bir araya getirilmiştir, böylece çoklu koşullar arasında dağılmak yerine, gelecekte daha fazla içecek eklemeyi kolaylaştırır.

Alternatif bir çözüm, tüm bilgileri nesnelere taşıyarak koşulları tamamen kaldırmaktır:



```js
const drinks = {
  tea: {
    part: 'yaprak',
    caffeine: '15–70 mg/kupa',
    age: '4,000+ yıl'
  },
  coffee: {
    part: 'fasulye',
    caffeine: '80–185 mg/kupa',
    age: '1,000+ yıl'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Bitkinin kısmı</dt>
        <dd>{info.part}</dd>
        <dt>Kafein içeriği</dt>
        <dd>{info.caffeine}</dd>
        <dt>Yaş</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```