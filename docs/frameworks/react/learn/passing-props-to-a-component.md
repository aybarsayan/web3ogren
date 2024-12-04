---
title: Bir Bileşene Props Geçirme
seoTitle: Reactte Bileşenlere Props Geçirme
sidebar_position: 4
description: React bileşenleri arasında veri iletimi için props kullanımını keşfedin. Propsları geçirme, okuma ve varsayılan değerler belirleme konularında adım adım rehberlik edilecektir.
tags: 
  - React
  - Props
  - Bileşenler
  - JavaScript
keywords: 
  - react
  - props
  - bileşenler
  - javascript
---
React bileşenleri, birbirleriyle iletişim kurmak için *props* kullanır. Her parent bileşen, child bileşenlerine props vererek bazı bilgileri onlara geçirebilir. Props, HTML özniteliklerini hatırlatabilir, ancak bunlar aracılığıyla herhangi bir JavaScript değerini, nesneleri, dizileri ve fonksiyonları da geçirebilirsiniz.





* Bir bileşene props nasıl geçirilir
* Bir bileşenden props nasıl okunur
* Props için varsayılan değerler nasıl belirtilir
* Bir bileşene bazı JSX nasıl geçilir
* Props zamanla nasıl değişir



## Tanıdık props {/*familiar-props*/}

Props, bir JSX etiketine geçirdiğiniz bilgilerdir. Örneğin, `className`, `src`, `alt`, `width` ve `height` gibi bazı props'ları bir `<img>` etiketine geçirebilirsiniz:



```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```



Bir `<img>` etiketine geçirebileceğiniz props, önceden tanımlıdır (ReactDOM [HTML standardına](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element) uygundur). Ancak, kendi bileşenlerinize, örneğin ``, bazı props geçirerek bunları özelleştirebilirsiniz. İşte bu şekilde!

## Bir bileşene props geçirme {/*passing-props-to-a-component*/}

Bu kodda, `Profile` bileşeni child bileşeni `Avatar`'a herhangi bir props geçmiyor:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

`Avatar`'a bazı props vermek için iki adım izleyebilirsiniz.

### Adım 1: Child bileşene props geçin {/*step-1-pass-props-to-the-child-component*/}

Öncelikle, `Avatar`'a bazı props geçin. Örneğin, iki props geçirip geçirince: `person` (bir nesne) ve `size` (bir sayı):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```



`person=` ifadesinden sonraki çift süslü parantezlerin sizi karıştırmaması için, `onların JSX süslü parantezleri içindeki bir nesne olduğunu` hatırlayın.



Artık bu props'ları `Avatar` bileşeninin içinde okuyabilirsiniz.

### Adım 2: Child bileşenin içinde props'ları okuyun {/*step-2-read-props-inside-the-child-component*/}

Bu props'ları `({` ve `})` içinde isimlerini `person, size` olarak listeleyerek okuyabilirsiniz. Bu, onları `Avatar` kodu içinde, bir değişken gibi kullanmanıza olanak tanır.

```js
function Avatar({ person, size }) {
  // person ve size burada kullanılabilir
}
```

`Avatar` bileşenine, `person` ve `size` props'larını kullanarak render işlemi için bazı mantık ekleyin ve tamamlayın.

Artık `Avatar`'ı farklı props'larla birçok farklı şekilde render edecek şekilde yapılandırabilirsiniz. Değerleri değiştirerek deneyin!



```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

```js src/utils.js
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```



Props, parent ve child bileşenleri bağımsız olarak düşünmenize izin verir. Örneğin, `Profile` içinde `person` veya `size` props'larını değiştirebilir, `Avatar`'ın bunları nasıl kullandığına dair düşünmenize gerek kalmaz. Benzer şekilde, `Avatar`'ın bu props'ları nasıl kullandığını değiştirebilir, `Profile`'a bakmayabilirsiniz.

**"Düğmeler" gibi düşünebilirsiniz**. İşlevler için argümanların oynadığı aynı rolü üstlenirler—aslında, props, bileşeniniz için _tek_ argümandır! React bileşen fonksiyonları tek bir argüman alır, bir `props` nesnesi:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

Genellikle tüm `props` nesnesine ihtiyaç duymazsınız, bu nedenle onu bireysel props'lara ayırırsınız.



**Prop'ları tanımlarken `(` ve `)` içindeki `{` ve `}` çiftini kaçırmayın:**

```js
function Avatar({ person, size }) {
  // ...
}
```

Bu sözdizimi ["destructuring"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) olarak adlandırılır ve bir işlev parametresinden özellikleri okumaya eşdeğerdir:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```



## Bir prop için varsayılan bir değer belirtme {/*specifying-a-default-value-for-a-prop*/}

Eğer bir prop için varsayılan bir değer vermek isterseniz, bunu destructuring ile yapabilirsiniz; parametreden hemen sonra `=` ve varsayılan değeri ekleyerek:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Artık, `` `size` prop'u olmadan render edilirse, `size` değeri `100` olarak ayarlanır.

Varsayılan değer yalnızca `size` prop'u eksikse veya `size={undefined}` geçirilmişse kullanılır. Ancak, `size={null}` veya `size={0}` geçirirseniz, varsayılan değer **kullanılmaz.**

## JSX yayılma sözdizimi ile props iletme {/*forwarding-props-with-the-jsx-spread-syntax*/}

Bazen, props iletmek oldukça tekrarlı hale gelebilir:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

Tekrarlı kodda bir sakınca yoktur—belki daha okunabilir olabilir. Ancak bazen özlü olmayı tercih edebilirsiniz. Bazı bileşenler, tüm props'larını çocuklarına iletir, tıpkı `Profile`'ın `Avatar` ile yaptığı gibi. Çünkü doğrudan herhangi bir props kullanmadıkları için, daha özlü bir "yayılma" sözdizimini kullanmak anlamlı olabilir:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Bu, `Profile`'ın tüm props'larını `Avatar`'a, her birinin isimlerini listelemeden iletir.

**Yayılma sözdizimini ihtiyatla kullanın.** Eğer her diğer bileşende kullanıyorsanız, bir sorun var demektir. Sıklıkla, bileşenlerinizi bölüp, çocukları JSX olarak geçmeniz gerektiğini gösterir. Bunun hakkında daha fazla bilgi vereceğiz!

## JSX'yi children olarak geçme {/*passing-jsx-as-children*/}

Özellikle, yerleşik tarayıcı etiketlerini iç içe kullanmak yaygındır:

```js
<div>
  <img />
</div>
```

Bazen, kendi bileşenlerinizi de aynı şekilde iç içe yerleştirmek isteyeceksiniz:

```js
<Card>
  <Avatar />
</Card>
```

Bir JSX etiketinin içine içerik yerleştirdiğinizde, parent bileşen o içeriği `children` adı verilen bir prop olarak alır. Örneğin, aşağıdaki `Card` bileşeni, ``'yi içeren bir `children` prop'u alacak ve onu bir kapsayıcı div içinde render edecektir:



```js src/App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

```js src/Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

```js src/utils.js
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
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```



`` içindeki ``'yı bir metin ile değiştirerek, `Card` bileşeninin hangi içeriği sarabileceğine dikkat edin. İçinde neyin render edileceğini "bilmesine" gerek yoktur. Bu esnek deseni birçok yerde göreceksiniz.

`children` prop'una sahip bir bileşeni, üst bileşenlerinin rastgele JSX ile "doldurabileceği" bir "delik" olarak düşünebilirsiniz. Genellikle görsel sarmalar için `children` prop'unu kullanacaksınız: paneller, ızgaralar, vb. 



## Props'ların zamanla nasıl değiştiği {/*how-props-change-over-time*/}

Aşağıdaki `Clock` bileşeni, parent bileşeninden `color` ve `time` adında iki prop alır. (Parent bileşeninin kodu atlanmıştır çünkü [durum](https://learn-react.dev/learn/state-a-components-memory) kullanır, bu konuyu henüz incelemeyeceğiz.)

Aşağıdaki seçim kutusunda rengi değiştirmeyi deneyin:



```js src/Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
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
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Bir renk seçin:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```



Bu örnek, **bir bileşenin zamanla farklı props alabileceğini** gösterir. Props'lar her zaman statik değildir! Burada, `time` prop'u her saniye değişir ve `color` prop'u başka bir rengi seçtiğinizde değişir. Props'lar, bir bileşenin verilerini herhangi bir anda yansıtır, yalnızca başlangıçta değil.

Bununla birlikte, props [değiştirilemez](https://en.wikipedia.org/wiki/Immutable_object)—bu terim, bilgisayar biliminde "değiştirilemez" anlamına gelir. Bir bileşenin props'larını değiştirmesi gerektiğinde (örneğin, bir kullanıcı etkileşimine veya yeni verilere yanıt olarak), _farklı props_ geçmesini sağlamak için parent bileşenine "sorması" gerekir—yeni bir nesne! Eski props'ları bir kenara atılacak ve sonunda JavaScript motoru bunların kapladığı belleği geri alacaktır.

**"Props'ları değiştirmeye" çalışmayın.** Kullanıcı girdisine yanıt vermeniz gerektiğinde (örneğin, seçili rengi değiştirmek), "durumu ayarlamanız" gerekecektir; bunu `Durum: Bir Bileşenin Hafızası.` konusunu okumakla öğrenebilirsiniz.



* Props'ları geçirmek için, onları JSX'e ekleyin, tıpkı HTML öznitelikleri gibi.
* Props'ları okumak için `function Avatar({ person, size })` destructuring sözdizimini kullanın.
* Bir varsayılan değer belirtmek için `size = 100` gibi bir şey belirtebilirsiniz; bu, eksik ve `undefined` props'lar için kullanılır.
* Tüm props'ları `` JSX yayılma sözdizimi ile iletebilirsiniz, ancak bunu aşırı kullanmayın!
* İç içe JSX, `` olarak görünecektir ve bu `Card` bileşeninin `children` prop'u olacaktır.
* Props'lar değiştirilmesi mümkün olmayan zaman kesitleridir: her render yeni bir props versiyonu alır.
* Props'ları değiştiremezsiniz. Etkileşim gerektiğinde durumu ayarlamanız gerekecektir.





#### Bir bileşeni çıkar {/*extract-a-component*/}

Bu `Gallery` bileşeni, iki profil için oldukça benzer bir markup içerir. Tekrarı azaltmak için içinden bir `Profile` bileşeni çıkarın. Hangi props'ları ona geçirmeniz gerektiğine karar vermeniz gerekecek.



```js src/App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Önemli Bilim Adamları</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Meslek: </b>
            fizikçi ve kimyager
          </li>
          <li>
            <b>Ödüller: 4 </b>
            (Nobel Fizik Ödülü, Nobel Kimya Ödülü, Davy Madalyası, Matteucci Madalyası)
          </li>
          <li>
            <b>Keşfedilen: </b>
            polonyum (kimyasal element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Meslek: </b>
            jeokimyager
          </li>
          <li>
            <b>Ödüller: 2 </b>
            (Jeokimyada Miyake Ödülü, Tanaka Ödülü)
          </li>
          <li>
            <b>Keşfedilen: </b>
            Deniz suyunda karbondioksit ölçme yöntemi
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```





Bir bilim insanının markup'ını çıkararak başlayın. Sonra ikinci örnekteki uymayan parçaları bulun ve bunları props ile yapılandırılabilir hale getirin.





Bu çözümde, `Profile` bileşeni, `imageId` (bir dize), `name` (bir dize), `profession` (bir dize), `awards` (bir dizi) ve `discovery` (bir dize) gibi birden fazla prop alır. 

Dikkat edin ki `imageSize` prop'unun varsayılan bir değeri vardır; bu yüzden onu bileşene geçirmiyoruz.



```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Meslek:</b> {profession}</li>
        <li>
          <b>Ödüller: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Keşfedilen: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Önemli Bilim Adamları</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="fizikçi ve kimyager"
        discovery="polonyum (kimyasal element)"
        awards={[
          'Nobel Fizik Ödülü',
          'Nobel Kimya Ödülü',
          'Davy Madalyası',
          'Matteucci Madalyası'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='jeokimyager'
        discovery="Deniz suyunda karbondioksit ölçme yöntemi"
        awards={[
          'Miyake Ödülü',
          'Tanaka Ödülü'
        ]}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```



Görüyorsunuz ki, `awards` bir dizi olduğunda ayrı bir `awardCount` prop'una ihtiyaç yoktur. Daha sonra `awards.length` ile ödüllerin sayısını sayabilirsiniz. Unutmayın ki props her türlü değer alabilir, bu dizileri de dahil!

Bir başka çözüm ise, bir kişinin tüm bilgilerini tek bir nesne içinde gruplamak ve bu nesneyi bir prop olarak geçmektir:



```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Meslek:</b> {person.profession}
        </li>
        <li>
          <b>Ödüller: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Keşfedilen: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Önemli Bilim Adamları</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'fizikçi ve kimyager',
        discovery: 'polonyum (kimyasal element)',
        awards: [
          'Nobel Fizik Ödülü',
          'Nobel Kimya Ödülü',
          'Davy Madalyası',
          'Matteucci Madalyası'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'jeokimyager',
        discovery: 'Deniz suyunda karbondioksit ölçme yöntemi',
        awards: [
          'Miyake Ödülü',
          'Tanaka Ödülü'
        ],
      }} />
    </div>
  );
}
```

```js src/utils.js
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```



Sözdizimi biraz farklı gözükse de, çünkü burada bir JavaScript nesnesinin özelliklerini tanımlıyormuşsunuz gibi, ama bu örnekler çoğunlukla eşdeğerdir ve her iki yaklaşımı da seçebilirsiniz.