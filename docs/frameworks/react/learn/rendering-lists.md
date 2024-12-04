---
title: Liste Oluşturma
seoTitle: React ile Liste Oluşturma
sidebar_position: 4
description: Bu bölümde, JavaScript dizileri ve React kullanarak dinamik listeler nasıl oluşturulur öğrenilecektir. Özellikle, map() ve filter() yöntemlerinin nasıl kullanıldığına dair örnekler bulunmaktadır.
tags: 
  - React
  - JavaScript
  - liste oluşturma
  - bileşen
keywords: 
  - React
  - JavaScript
  - diziler
  - bileşenler
  - map
  - filter
---
Bir veri koleksiyonundan birden fazla benzer bileşeni görüntülemek isteyeceksiniz. Verilerinizi işlemek için [JavaScript dizi yöntemlerini](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) kullanabilirsiniz. Bu sayfada, verilerinizin dizisini bileşenler dizisine filtrelemek ve dönüştürmek için React ile [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) ve [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) kullanacaksınız.





* JavaScript'in `map()` yöntemini kullanarak diziden bileşenleri nasıl oluşturacağınızı
* Sadece belirli bileşenleri JavaScript'in `filter()` yöntemiyle nasıl oluşturacağınızı
* React anahtarlarını ne zaman ve neden kullanacağınızı



## Dizilerden Veri Oluşturma {/*rendering-data-from-arrays*/}

Diyelim ki bir içerik listeniz var.

```js
<ul>
  <li>Creola Katherine Johnson: matematikçi</li>
  <li>Mario José Molina-Pasquel Henríquez: kimyager</li>
  <li>Mohammad Abdus Salam: fizikçi</li>
  <li>Percy Lavon Julian: kimyager</li>
  <li>Subrahmanyan Chandrasekhar: astrofizikçi</li>
</ul>
```

Liste öğeleri arasındaki tek fark, içerikleridir, verileridir. Arayüzler oluştururken farklı veriler kullanarak aynı bileşenden birkaç örneği göstermeniz sıkça gerekecektir: yorum listelerinden profil resimleri galerisine kadar. Bu durumlarda verileri JavaScript nesnelerinde ve dizilerinde saklayabilir ve dizilerden bileşen listeleri oluşturmak için [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) ve [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) gibi yöntemleri kullanabilirsiniz.

Bir diziden öğe listesini nasıl oluşturacağınızla ilgili kısa bir örnek:

1. Verileri bir diziye **taşıyın**:

```js
const people = [
  'Creola Katherine Johnson: matematikçi',
  'Mario José Molina-Pasquel Henríquez: kimyager',
  'Mohammad Abdus Salam: fizikçi',
  'Percy Lavon Julian: kimyager',
  'Subrahmanyan Chandrasekhar: astrofizikçi'
];
```

2. `people` üyelerini JSX düğüm dizisi `listItems` oluşturarak **haritalayın**:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. `listItems` öğelerini `` içinde sarmalı olarak **döndürün**:

```js
return <ul>{listItems}</ul>;
```

Sonuç:



```js
const people = [
  'Creola Katherine Johnson: matematikçi',
  'Mario José Molina-Pasquel Henríquez: kimyager',
  'Mohammad Abdus Salam: fizikçi',
  'Percy Lavon Julian: kimyager',
  'Subrahmanyan Chandrasekhar: astrofizikçi'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```



> **Uyarı:** Listede her çocuğun benzersiz bir "anahtar" özelliği olmalıdır. — Konsol Hatası

Bu hatayı daha sonra bu sayfada nasıl düzelteceğinizi öğreneceksiniz. Öncelikle verilerinize biraz yapı ekleyelim.

## Öğe Dizilerini Filtreleme {/*filtering-arrays-of-items*/}

Veri daha da yapılandırılabilir.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'matematikçi',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'kimyager',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'fizikçi',
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'kimyager',  
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrofizikçi',
}];
```

Diyelim ki sadece `'kimyager'` olan kişileri göstermek istiyorsunuz. JavaScript'in `filter()` yöntemini kullanarak yalnızca o kişileri döndürebilirsiniz. Bu yöntem, bir dizi öğesini alır, onları bir "test"ten geçirir (geriye `true` veya `false` döndüren bir fonksiyon) ve sadece testi geçen (geriye `true` döndüren) öğelerin yeni bir dizisini döndürür.

Sadece `profession` değerinin `'kimyager'` olduğu öğeleri istiyorsunuz. "Test" fonksiyonu `(person) => person.profession === 'kimyager'` şeklindedir. İşte bir araya getirilmiş hali:

1. `people` üzerinden `person.profession === 'kimyager'` kullanarak, yalnızca "kimyager" kişilerden oluşan yeni bir dizi, `chemists` oluşturun:

```js
const chemists = people.filter(person =>
  person.profession === 'kimyager'
);
```

2. Şimdi `chemists` üzerinde **map** işlevini uygulayın:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       ile tanınan {person.accomplishment}
     </p>
  </li>
);
```

3. Son olarak, `listItems` öğelerini bileşeninizden **döndürün**:

```js
return <ul>{listItems}</ul>;
```



```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'kimyager'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        ile tanınan {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
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
  profession: 'kimyager',
  accomplishment: 'Kuzey Kutbu ozon deliği keşfi',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'fizikçi',
  accomplishment: 'elektromanyetik teori',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'kimyager',
  accomplishment: 'kortizon ilaçları, steroidler ve doğum kontrol haplarının öncüsü',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrofizikçi',
  accomplishment: 'beyaz cüce yıldızı kütle hesaplamaları',
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```



:::tip
Ok ok fonksiyonları, `=>` ifadesinden hemen sonrasında döndürme ifadesini otomatik olarak döndürür, bu yüzden bir `return` ifadesine ihtiyaç yoktur:
```js
const listItems = chemists.map(person =>
  <li>...</li> // İkna edici dönüş!
);
```
Ancak, `{` süslü parantezle takip ediliyorsa `return` ifadesini açıkça yazmalısınız:
```js
const listItems = chemists.map(person => { // Süslü parantez
  return <li>...</li>;
});
```
`=> {` içeren ok fonksiyonları, ["blok gövdesi".](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) Birden fazla satır kod yazmanıza izin verir, ancak kendi `return` ifadenizi yazmak zorundasınız. Bunu unutursanız, hiçbir şey geri döndürülmez!
:::

## Anahtar ile Liste Öğelerini Sıralı Tutma {/*keeping-list-items-in-order-with-key*/}

Yukarıdaki tüm kum havuzlarının konsolda bir hata gösterdiğini unutmayın:



Uyarı: Listede her çocuğun benzersiz bir "anahtar" özelliği olmalıdır.



Her dizi öğesine bir `key` vermeniz gerekir - bu, o dizi içindeki diğer öğelerle karşılaştırıldığında benzersiz bir tanımlayıcı olan bir dize veya sayı:

```js
<li key={person.id}>...</li>
```



JSX öğeleri `map()` çağrısı içinde doğrudan anahtar gerektirir!



Anahtarlar, React'in her bileşenin hangi dizi öğesine karşılık geldiğini bilmesini sağlar, böylece daha sonra bunları eşleştirebilir. Bu, dizi öğelerinizin hareket edebilmesi durumunda (örneğin sıralama nedeniyle), eklenmesi veya silinmesi durumunda önemli hale gelir. İyi seçilmiş bir `key`, React'in neyin tam olarak gerçekleştiğini anlamasına yardımcı olur ve DOM ağacına doğru güncellemeleri yapmasını sağlar.

Anahtarları anlık olarak üretmek yerine verilerinize dahil etmelisiniz:



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
          ile tanınan {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js
export const people = [{
  id: 0, // JSX'de anahtar olarak kullanılır
  name: 'Creola Katherine Johnson',
  profession: 'matematikçi',
  accomplishment: 'uzay uçuşu hesaplamaları',
  imageId: 'MK3eW3A'
}, {
  id: 1, // JSX'de anahtar olarak kullanılır
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'kimyager',
  accomplishment: 'Kuzey Kutbu ozon deliği keşfi',
  imageId: 'mynHUSa'
}, {
  id: 2, // JSX'de anahtar olarak kullanılır
  name: 'Mohammad Abdus Salam',
  profession: 'fizikçi',
  accomplishment: 'elektromanyetik teori',
  imageId: 'bE7W1ji'
}, {
  id: 3, // JSX'de anahtar olarak kullanılır
  name: 'Percy Lavon Julian',
  profession: 'kimyager',
  accomplishment: 'kortizon ilaçları, steroidler ve doğum kontrol haplarının öncüsü',
  imageId: 'IOjWm71'
}, {
  id: 4, // JSX'de anahtar olarak kullanılır
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrofizikçi',
  accomplishment: 'beyaz cüce yıldızı kütle hesaplamaları',
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```





#### Her liste öğesi için birden fazla DOM düğümü görüntüleme {/*displaying-several-dom-nodes-for-each-list-item*/}

Her öğenin yalnızca tek bir DOM düğümü değil, birden fazla DOM düğümünü oluşturması gerektiğinde ne yaparsınız?

Kısa `...` Fragment` sözdizimi bir anahtar geçirmenize izin vermeyecektir, bu yüzden bunları tek bir `` içinde gruplamanız veya daha uzun ve `daha belirgin `` sözdizimini` kullanmanız gerekir:

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Fragment'ler DOM'dan kaybolur, bu yüzden bu, düz bir ``, ``, ``, ``, ve benzeri bir liste üretecektir.



### Anahtarınızı Nereden Alacaksınız? {/*where-to-get-your-key*/}

Farklı veri kaynakları farklı anahtar kaynakları sağlar:

* **Veritabanından gelen veri:** Verileriniz bir veritabanından geliyorsa, doğal olarak benzersiz olan veritabanı anahtarlarını/kimliklerini kullanabilirsiniz.
* **Yerel olarak üretilen veriler:** Veriniz yerel olarak oluşturulup saklanıyorsa (örneğin, bir not alma uygulamasındaki notlar), artan bir sayıcı, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) veya [`uuid`](https://www.npmjs.com/package/uuid) gibi bir paket kullanarak öğeleri oluşturduğunuzda kullanın.

### Anahtar Kuralları {/*rules-of-keys*/}

* **Anahtarlar kardeşler arasında benzersiz olmalıdır.** Ancak, farklı dizilerde JSX düğümleri için aynı anahtarları kullanmak sorun değildir.
* **Anahtarlar değişmemelidir** yoksa amacı sona erer! Onları oluştururken üretmeyin.

### React neden anahtara ihtiyaç duyar? {/*why-does-react-need-keys*/}

Masaüstünüzdeki dosyaların isimleri olmadığını hayal edin. Bunun yerine, dosyaları sırasıyla tarif ederdiniz - birinci dosya, ikinci dosya, ve böyle devam ederdi. Buna alışabilirdiniz, ancak bir dosyayı sildiğinizde karmaşık hale gelirdi. İkinci dosya birinci dosya olur, üçüncü dosya ikinci dosya olur ve bu şekilde devam eder.

Bir klasördeki dosya isimleri ile bir dizideki JSX anahtarları benzer bir amaca hizmet eder. Kardeşler arasında bir öğeyi benzersiz olarak tanımlamaya olanak tanır. İyi bir şekilde seçilmiş bir anahtar, dizideki konumdan daha fazla bilgi sağlar. Sıralama nedeniyle _konum_ değişse bile, `key` React'in öğeyi ömrü boyunca tanımlamasını sağlar.

:::warning
Bir öğenin dizideki indeksini anahtar olarak kullanma isteği içinde olabilirsiniz. Aslında, hiç anahtar belirtmezseniz React'ın kullanacağı budur. Ancak, öğeleri ne zaman render ederseniz sıralama zamanla değişecektir; bir öğe eklenirse, silinirse veya dizi yeniden sıralanırsa. İndeksleri anahtar olarak kullanmak genelde ince ve kafa karıştırıcı hatalara yol açar.
:::

Aynı şekilde, anahtarları anlık olarak üretmeyin, örneğin `key={Math.random()}` ile. Bu, anahtarların her renderda asla eşleşmemesine neden olur ve bileşenleriniz ve DOM her seferinde yeniden oluşturulur. Bu hem yavaş hem de liste öğeleri içindeki kullanıcı girdisini kaybeder. Bunun yerine, veriye dayanan sabit bir kimlik kullanın.

Anahtarın bir prop olarak bileşenlerinize iletilmeyeceğini unutmayın. Bu sadece React tarafından bir ipucu olarak kullanılır. Eğer bileşeninizin bir ID'ye ihtiyacı varsa, bunu ayrı bir prop olarak geçmelisiniz: ``.





Bu sayfada şunları öğrendiniz:

* Verileri bileşenlerden çıkarıp dizi ve nesne gibi veri yapılarına nasıl taşıyacağınızı.
* JavaScript'in `map()` yöntemini kullanarak benzer bileşen setleri nasıl oluşturacağınızı.
* JavaScript'in `filter()` yöntemini kullanarak filtrelenmiş öğeler dizileri nasıl oluşturacağınızı.
* React'in her bir bileşeni takip edebilmesi için bir koleksiyondaki her bileşene nasıl ve neden `key` atayacağınızı.