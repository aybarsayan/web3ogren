---
title: UIyi Tanımlama
seoTitle: React ile Kullanıcı Arayüzü Tanımlama
sidebar_position: 1
description: Bu bölümde, React bileşenleri oluşturmayı, özelleştirmeyi ve koşullu olarak görüntülemeyi öğreneceksiniz. Ayrıca komponentlere props geçirme yöntemlerini keşfedeceksiniz.
tags: 
  - React
  - Bileşenler
  - Kullanıcı Arayüzü
  - JavaScript
keywords: 
  - React
  - Bileşenler
  - Kullanıcı Arayüzü
  - JavaScript
---
React, kullanıcı arayüzlerini (UI) oluşturmak için kullanılan bir JavaScript kütüphanesidir. UI, butonlar, metinler ve görseller gibi küçük birimlerden oluşur. React, bunları yeniden kullanılabilir, iç içe yerleştirilebilir *bileşenler* haline getirmenizi sağlar. Web sitelerinden telefon uygulamalarına kadar, ekrandaki her şey bileşenlere ayrılabilir. Bu bölümde, React bileşenleri oluşturmayı, özelleştirmeyi ve koşullu olarak görüntülemeyi öğreneceksiniz.





* `İlk React bileşeninizi nasıl yazarsınız`
* `Birden fazla bileşen dosyasını ne zaman ve nasıl yaratmalısınız`
* `JavaScript'te JSX ile nasıl işaretleme eklersiniz`
* `Bileşenlerinizden JavaScript işlevselliğine erişmek için JSX ile nasıl süslü parantezler kullanırsınız`
* `Bileşenleri nasıl props ile yapılandırırsınız`
* `Bileşenleri nasıl koşullu olarak render edersiniz`
* `Birden fazla bileşeni aynı anda nasıl görüntülersiniz`
* `Bileşenleri saf tutarak karmaşık hatalardan nasıl kaçınırsınız`
* `UI'nizi ağaçlar olarak anlamanın neden faydalı olduğu`



## İlk bileşeniniz {/*your-first-component*/}

React uygulamaları, *bileşenler* olarak adlandırılan izole UI parçalarından oluşturulur. Bir React bileşeni, işaretleme (markup) ile süslenebilen bir JavaScript fonksiyonudur. Bileşenler, bir butondan kadar küçük veya tüm bir sayfa kadar büyük olabilir. İşte üç `Profile` bileşenini render eden bir `Gallery` bileşeni:



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





**`İlk Bileşeniniz`** başlıklı sayfayı okuyarak React bileşenlerini nasıl bildireceğinizi ve kullanacağınızı öğrenin.



## Bileşenleri içe aktarma ve dışa aktarma {/*importing-and-exporting-components*/}

Bir dosyada birçok bileşen bildirebilirsiniz, ancak büyük dosyalar gezinmeyi zorlaştırabilir. Bunun üstesinden gelmek için bir bileşeni kendi dosyasına *dışa aktarabilir* ve ardından o bileşeni başka bir dosyadan *içe aktarabilirsiniz*:



```js src/App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js active
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
img { margin: 0 10px 10px 0; }
```





**`Bileşenleri İçe Aktarma ve Dışa Aktarma`** başlıklı sayfayı okuyarak bileşenleri kendi dosyalarına nasıl böleceğinizi öğrenin.



## JSX ile işaretleme yazma {/*writing-markup-with-jsx*/}

Her React bileşeni, React'in tarayıcıya render ettiği bazı işaretleme içerebilen bir JavaScript fonksiyonudur. React bileşenleri, işaretlemeyi temsil etmek için JSX adı verilen bir sözdizimi genişletmesini kullanır. JSX, HTML'ye çok benzer, ancak biraz daha katıdır ve dinamik bilgileri sergileyebilir.

Mevcut HTML işaretlemesini bir React bileşenine yapıştırırsak, her zaman çalışmayabilir:



```js
export default function TodoList() {
  return (
    // Bu doğru çalışmaz!
    <h1>Hedy Lamarr'ın Yapılacaklar Listesi</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Yeni trafik ışıkları icat et
      <li>Bir film sahnesini prova et
      <li>Spektrum teknolojisini geliştirin
    </ul>
  );
}
```

```css
img { height: 90px; }
```



Elinizde bu şekilde mevcut bir HTML varsa, bunu bir [dönüştürücü](https://transform.tools/html-to-jsx) kullanarak düzeltebilirsiniz:



```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr'ın Yapılacaklar Listesi</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Yeni trafik ışıkları icat et</li>
        <li>Bir film sahnesini prova et</li>
        <li>Spektrum teknolojisini geliştirin</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```





**`JSX ile İşaretleme Yazma`** başlıklı sayfayı okuyarak geçerli JSX yazmayı öğrenin.



## JSX'de süslü parantezlerle JavaScript {/*javascript-in-jsx-with-curly-braces*/}

JSX, HTML-benzeri işaretleme yazmanızı sağlar. JavaScript dosyasında render etme mantığı ve içeriği aynı yerde tutar. Bazen, o işaretleme içinde biraz JavaScript mantığı eklemek veya dinamik bir özelliğe referans vermek isteyebilirsiniz. Bu durumda, JSX'inizde JavaScript'e "bir pencere açmak" için süslü parantezler kullanabilirsiniz:



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
      <h1>{person.name}'in Yapılacaklar Listesi</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Videofonu geliştirmek</li>
        <li>Aeronautik dersleri hazırlamak</li>
        <li>Alkol yakıtlı motor üzerinde çalışmak</li>
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





**`JSX'de Süslü Parantezlerle JavaScript`** başlıklı sayfayı okuyarak JSX'den JavaScript verilerine nasıl erişileceğini öğrenin.



## Bileşene props geçirme {/*passing-props-to-a-component*/}

React bileşenleri, birbirleriyle iletişim kurmak için *props* kullanır. Her ebeveyn bileşeni, çocuk bileşenlerine props vererek bazı bilgileri onlara iletebilir. Props, HTML niteliklerini hatırlatabilir, ancak bunlar aracılığıyla herhangi bir JavaScript değerini, nesneleri, dizileri, fonksiyonları ve hatta JSX'i geçirebilirsiniz!



```js
import { getImageUrl } from './utils.js'

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

function Card({ children }) {
  return (
    <div className="card">
      {children}
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





**`Bileşene Props Geçirme`** başlıklı sayfayı okuyarak props geçirme ve okuma konusunda bilgi edinin.



## Koşullu render {/*conditional-rendering*/}

Bileşenleriniz, genellikle farklı koşullara bağlı olarak farklı şeyler göstermek zorunda kalacaktır. React'te, JSX'i koşullu olarak render etmek için `if` ifadeleri, `&&` ve `? :` operatörleri gibi JavaScript sözdizimini kullanabilirsiniz.

Bu örnekte, JavaScript `&&` operatörü, bir onay kutusunu koşullu olarak render etmek için kullanılır:



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





**`Koşullu Render`** başlıklı sayfayı okuyarak içeriği koşullu olarak render etmenin farklı yollarını öğrenin.



## Listeleri render etme {/*rendering-lists*/}

Bir veri koleksiyonundan birden fazla benzer bileşeni görüntülemek istemeniz sık karşılaşılan bir durumdur. JavaScript'in `filter()` ve `map()` fonksiyonlarını React ile birlikte kullanarak veri dizinizi bir bileşenler dizisine filtreleyip dönüştürebilirsiniz.

Her dizi öğesi için bir `key` belirtmeniz gerekecektir. Genellikle, bir `key` olarak veritabanından bir ID kullanmak istersiniz. Anahtarlar React'in, liste her değiştiğinde her öğenin yerini takip etmesini sağlar.



```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        {person.accomplishment} ile tanınan
      </p>
    </li>
  );
  return (
    <article>
      <h1>Bilim İnsanları</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'matematikçi',
  accomplishment: 'uzay uçuşu hesaplamaları',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'kimyacı',
  accomplishment: 'Kuzey Kutbu ozon deliklerinin keşfi',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'fizikçi',
  accomplishment: 'elektromanyetizma teorisi',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'kimyacı',
  accomplishment: 'kortizon ilaçları, steroidler ve doğum kontrol hapları öncüsü',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrofizikçi',
  accomplishment: 'beyaz cüce yıldız kütlesi hesaplamaları',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```





**`Listeleri Render Etme`** başlıklı sayfayı okuyarak bileşenlerin bir listesini nasıl render edeceğinizi ve nasıl bir anahtar seçeceğinizi öğrenin.



## Bileşenleri saf tutma {/*keeping-components-pure*/}

Bazı JavaScript fonksiyonları *saf*tır. Saf bir fonksiyon:

* **Kendi işine bakar.** Daha önce çağrılmış olan hiçbir nesneyi veya değişkeni değiştirmez.
* **Aynı girdiler, aynı çıktı.** Aynı girdilerle, saf bir fonksiyon her zaman aynı sonucu döndürmelidir.

Bileşenlerinizi yalnızca saf fonksiyonlar olarak yazarak, karmaşık hatalardan ve kod tabanınız büyüdükçe öngörülemez davranışlardan kaçınabilirsiniz. İşte bir kirli bileşen örneği:



```js
let guest = 0;

function Cup() {
  // Kötü: var olan bir değişkeni değiştiriyor!
  guest = guest + 1;
  return <h2>Misafir #{guest} için çay fincanı</h2>;
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



Bu bileşeni, mevcut bir değişkeni değiştirmek yerine bir prop geçirerek saf hale getirebilirsiniz:



```js
function Cup({ guest }) {
  return <h2>Misafir #{guest} için çay fincanı</h2>;
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





**`Bileşenleri Saf Tutma`** başlıklı sayfayı okuyarak bileşenleri saf, öngörülebilir fonksiyonlar olarak yazmayı öğrenin.



## UI'nizin ağaç gibi görünmesi {/*your-ui-as-a-tree*/}

React, bileşenler ve modüller arasındaki ilişkileri modellemek için ağaçlar kullanır.

Bir React render ağacı, bileşenler arasındaki ebeveyn ve çocuk ilişkisinin bir temsilidir.



Örnek bir React render ağacı.



Ağaçta, kök bileşenine yakın olan bileşenler, üst düzey bileşenler olarak kabul edilir. Çocuk bileşeni olmayan bileşenler yaprak bileşenlerdir. Bu bileşenlerin kategorize edilmesi, veri akışını ve render performansını anlamak için faydalıdır.

JavaScript modülleri arasındaki ilişkiyi modellemek, uygulamanızı anlamanın başka bir yararlı yoludur. Buna modül bağımlılık ağıcı diyoruz.



Örnek bir modül bağımlılık ağıcı.



Bağımlılık ağaçları, derleme araçları tarafından istemcinin indirmesi ve render etmesi için tüm ilgili JavaScript kodunu paketlemek amacıyla sıkça kullanılır. Büyük bir paket boyutu, React uygulamaları için kullanıcı deneyimini olumsuz yönde etkiler. Modül bağımlılık ağacını anlamak, bu tür sorunları düzeltmekte yardımcıdır.



**`UI'niz bir Ağaç Gibi`** başlıklı sayfayı okuyarak bir React uygulaması için render ve modül bağımlılık ağaçlarının nasıl oluşturulacağını ve bunların kullanıcı deneyimi ve performansı artırmak için nasıl kullanılacağını öğrenin.



## Sırada ne var? {/*whats-next*/}

`İlk Bileşeniniz` sayfasına giderek bu bölümü sayfa sayfa okumaya başlayın!

Ya da bu konulara zaten aşina iseniz, neden `Etkileşim Eklemeyi` okumuyorsunuz?