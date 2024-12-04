---
title: Reactte Düşünmek
seoTitle: Kullanıcı Arayüzü Geliştirmede Reacti Anlamak
sidebar_position: 1
description: React ile kullanıcı arayüzü geliştirme sürecine dair temel kavramlar ve bileşen yapısı hakkında bilgi verilmektedir. Bu kılavuz, pratik örneklerle süreci açıklamaktadır.
tags: 
  - React
  - Bileşenler
  - Kullanıcı Arayüzü
  - Geliştirme
  - Eğitim
keywords: 
  - react
  - kullanıcı arayüzü
  - bileşen
  - etkileşim
  - eğitim
---
React, incelediğiniz tasarımlar ve kurduğunuz uygulamalar hakkında düşünme şeklinizi değiştirebilir. Bir kullanıcı arayüzü inşa ederken, önce bunu *bileşenler* olarak adlandırılan parçalara ayıracaksınız. Ardından, her bileşeniniz için farklı görsel durumları tanımlayacaksınız. Son olarak, bileşenlerinizi bir araya getirerek verilerin onlar üzerinden akmasını sağlayacaksınız. Bu eğitimde, React ile aranabilir bir ürün veri tablosu oluşturma düşünce sürecine sizi yönlendireceğiz.



## Mockup ile Başlayın {/*start-with-the-mockup*/}

Diyelim ki zaten bir JSON API'ye ve bir tasarımcısından bir mockup'a sahipsiniz.

JSON API'nın döndürdüğü veri aşağıdaki gibidir:

```json
[
  { "category": "Meyveler", "price": "$1", "stocked": true, "name": "Elma" },
  { "category": "Meyveler", "price": "$1", "stocked": true, "name": "Ejderha Meyvesi" },
  { "category": "Meyveler", "price": "$2", "stocked": false, "name": "Passiflora" },
  { "category": "Sebzeler", "price": "$2", "stocked": true, "name": "Ispanak" },
  { "category": "Sebzeler", "price": "$4", "stocked": false, "name": "Balkabağı" },
  { "category": "Sebzeler", "price": "$1", "stocked": true, "name": "Bezelye" }
]
```

Mockup şu şekilde görünmektedir:

![](../../images/frameworks/react/public/images/docs/s_thinking-in-react_ui.png)

React'te bir kullanıcı arayüzü uygulamak için genellikle aynı beş adımı takip edersiniz.

## Adım 1: UI'yı Bileşen Hiyerarşisine Ayırın {/*step-1-break-the-ui-into-a-component-hierarchy*/}

:::tip
Mockup'taki her bileşen ve alt bileşen etrafında kutular çizerek başlayın ve onlara ad verin.
:::

Bir tasarımcıyla çalışıyorsanız, tasarım aracı içinde bu bileşenleri zaten adlandırmış olabilir. Onlara sorun!

Arka planınıza bağlı olarak, bir tasarımı bileşenlere ayırma konusunda farklı şekillerde düşünebilirsiniz:

* **Programlama**—yeni bir fonksiyon veya nesne oluşturup oluşturmayacağınıza karar verirken aynı teknikleri kullanın. Böyle bir teknik [tekil sorumluluk ilkesi](https://en.wikipedia.org/wiki/Single_responsibility_principle)dir, yani bir bileşen ideal olarak yalnızca bir şey yapmalıdır. Eğer büyürse, daha küçük alt bileşenlere ayrılmalıdır.
* **CSS**—hangi sınıf seçimcilerini yapacağınızı düşünün. (Ancak bileşenler biraz daha az ayrıntılıdır.)
* **Tasarım**—tasarımın katmanlarını nasıl organize edeceğinizi düşünün.

JSON'unuz iyi yapılandırılmışsa, genellikle UI'nızın bileşen yapısına doğal olarak eşleştiğini göreceksiniz. Bunun nedeni, UI ve veri modellerinin genellikle aynı bilgi mimarisine sahip olmasıdır—yani aynı şekle sahip olmalarıdır. UI'nızı bileşenlere ayırın; her bileşen, veri modelinizin bir parçasına karşılık gelir.

Bu ekranda beş bileşen bulunmaktadır:





![](../../images/frameworks/react/public/images/docs/s_thinking-in-react_ui_outline.png)

1. `FilterableProductTable` (gri) tüm uygulamayı içerir.
2. `SearchBar` (mavi) kullanıcı girdisini alır.
3. `ProductTable` (lavanta) kullanıcı girdisine göre listedeki ürünleri görüntüler ve filtreler.
4. `ProductCategoryRow` (yeşil) her kategori için bir başlık görüntüler.
5. `ProductRow` (sarı) her ürün için bir satır görüntüler.





`ProductTable` (lavanta) bileşenine baktığınızda, başlık satırının ("İsim" ve "Fiyat" etiketlerini içeren) kendi bileşeni olmadığını göreceksiniz. Bu bir tercihtir ve her iki şekilde de gidebilirsiniz. Bu örnek için, `ProductTable` içinde yer aldığı için bir parçası olarak kabul edilmiştir. Ancak, bu başlık karmaşık hale gelirse (örneğin, sıralama eklerseniz), bunu kendi `ProductTableHeader` bileşenine taşıyabilirsiniz.

Artık mockup'taki bileşenleri belirlediğinize göre, bunları bir hiyerarşi oluşturacak şekilde düzenleyin. Mockup'taki bir bileşenin içinde yer alan bileşenler, hiyerarşide çocuk olarak görünmelidir:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## Adım 2: React'te Statik Bir Versiyon Oluşturun {/*step-2-build-a-static-version-in-react*/}

Artık bileşen hiyerarşinizi oluşturduğunuza göre, uygulamanızı uygulama zamanı. En basit yaklaşım, henüz herhangi bir etkileşim eklemeden veri modelinizden UI oluşturan bir versiyon yapmaktır... bu genellikle önce statik versiyonu oluşturmak ve daha sonra etkileşim eklemek daha kolaydır. Statik bir versiyon oluşturmak çok fazla yazım gerektirir ve düşünmeyi gerektirmez, ancak etkileşim eklemek ise çok fazla düşünmeyi ve çok az yazmayı gerektirir.

Veri modelinizi görüntüleyen bir statik versiyon yapmak için, diğer bileşenleri yeniden kullanan ve verileri `props` üzerinden geçen `bileşenler` oluşturmak isteyeceksiniz. Props, verileri üstten alta geçirme yoludur. (Eğer `state` kavramıyla tanıştıysanız, bu statik versiyonu oluşturmak için state kullanmayın. State yalnızca etkileşim için ayrılmıştır, yani zamanla değişen veriler içindir. Bu, uygulamanın statik bir versiyonu olduğundan, buna ihtiyacınız yoktur.)

Ya hiyerarşide daha yukarıdaki bileşenlerle ("üstten aşağı") başlayarak ya da aşağıdaki bileşenlerden çalışarak ("alttan yukarı") oluşturabilirsiniz. Daha basit örneklerde genellikle üstten aşağı gitmek daha kolaydır, daha büyük projelerde ise alttan yukarı gitmek daha kolaydır.



```jsx src/App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>İsim</th>
          <th>Fiyat</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Ara..." />
      <label>
        <input type="checkbox" />
        {' '}
        Sadece stokta olan ürünleri göster
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Meyveler", price: "$1", stocked: true, name: "Elma"},
  {category: "Meyveler", price: "$1", stocked: true, name: "Ejderha Meyvesi"},
  {category: "Meyveler", price: "$2", stocked: false, name: "Passiflora"},
  {category: "Sebzeler", price: "$2", stocked: true, name: "Ispanak"},
  {category: "Sebzeler", price: "$4", stocked: false, name: "Balkabağı"},
  {category: "Sebzeler", price: "$1", stocked: true, name: "Bezelye"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```



:::warning
(Bu kod korkutucu görünüyorsa, önce `Hızlı Başlangıç` bölümüne göz atın!)
:::

Bileşenlerinizi oluşturduktan sonra, veri modelinizi görüntüleyen yeniden usable bileşenler kütüphanesine sahip olacaksınız. Bu, statik bir uygulama olduğu için, bileşenler yalnızca JSX döndürecektir. Hiyerarşinin en üstündeki bileşen (`FilterableProductTable`), veri modelinizi bir prop olarak alacaktır. Bu bir _tek yönlü veri akışı_ olarak adlandırılır çünkü veri, üst düzey bileşenden ağaçtaki alt bileşenlere doğru akar.



Bu noktada, herhangi bir state değerini kullanmamalısınız. Bu, bir sonraki adımda!



## Adım 3: UI Durumunun Minimal Ama Tam Temsili Öğrenin {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

UI'yı etkileşimli hale getirmek için, kullanıcıların temel veri modelinizi değiştirmelerine izin vermeniz gerekir. Bunun için *state* kullanacaksınız.

State'i, uygulamanızın hatırlaması gereken değişen verilerin minimal seti olarak düşünün. State yapılandırması için en önemli ilke, [DRY (Kendini Tekrar Etme)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) ilkesine bağlı kaldığınızdan emin olmaktır. Uygulamanızın ihtiyaç duyduğu state'lerin en minimal temsilisini belirleyin ve diğer her şeyi talep üzerine hesaplayın. Örneğin, bir alışveriş listesi oluşturuyorsanız, öğeleri state'te bir dizi olarak saklayabilirsiniz. Liste içindeki öğelerin sayısını görüntülemek istiyorsanız, öğe sayısını başka bir state değeri olarak saklamayın, bunun yerine dizinizin uzunluğunu okuyun.

Şimdi düşünün, bu örnek uygulamadaki tüm veri parçaları:

1. Orijinal ürün listesini
2. Kullanıcının girdiği arama metnini
3. Checkbox'un değerini
4. Filtrelenmiş ürün listesini

Bunlardan hangileri state? Değil olanları belirleyin:

* Zamanla **değişmeden kalıyor mu?** Eğer öyleyse, bu state değildir.
* **Üstten geçiş yapılarak alınmış mı?** Eğer öyleyse, bu state değildir.
* **Mevcut state veya props'lara dayanarak hesaplayabilir misiniz?** Eğer öyleyse, bu *kesinlikle* state değildir!

Geriye kalan muhtemelen state'tir.

Şimdi bunları tekrar birer birer gözden geçirelim:

1. Orijinal ürün listesi, **prop olarak geçildiği için state değildir.**
2. Arama metni, zamanla değiştiği ve herhangi bir şeyden hesaplanamayacağı için state görünmektedir.
3. Checkbox'un değeri, zamanla değiştiği ve herhangi bir şeyden hesaplanamayacağı için state görünmektedir.
4. Filtrelenmiş ürün listesi, **state değildir çünkü hesaplanabilir**; orijinal ürün listesini alarak arama metni ve checkbox değerine göre filtreleyebilirsiniz.

Bu, yalnızca arama metni ve checkbox değeri state olduğu anlamına gelir! Harika bir iş çıkardınız!



#### Props ve State {/*props-vs-state*/}

React'teki veri için iki tür "model" verisi vardır: props ve state. İkisi çok farklıdır:

* `**Props**, bir fonksiyona geçirdiğiniz argümanlar gibidir.` Bir üst bileşenin bir alt bileşene veri aktarmasına ve görünümünü özelleştirmesine olanak tanır. Örneğin, bir `Form`, bir `Button`'a bir `color` prop'u geçirebilir.
* `**State**, bir bileşenin belleği gibidir.` Bir bileşenin bazı bilgileri takip etmesine ve etkileşimlere yanıt olarak değiştirmesine olanak tanır. Örneğin, bir `Button` `isHovered` state'ini takip edebilir.

Props ve state farklıdır, ancak birlikte çalışırlar. Bir üst bileşen genellikle bazı bilgileri state'te tutar (bunu değiştirebilmek için) ve *alt bileşenlerine props olarak geçirir*. Bu farkın ilk okunuşta hâlâ belirsiz gelmesi sorun değil. Bunun gerçekten anlaşılması biraz pratik gerektirir!



## Adım 4: State'in Nerede Olması Gerektiğini Belirleyin {/*step-4-identify-where-your-state-should-live*/}

Uygulamanızın minimal state verilerini belirledikten sonra, bu state'i değiştirmekten sorumlu bileşeni belirlemeniz gerekir veya *state'in sahibi* olmalıdır. Unutmayın: React, veri akışını tek yönde kullanır; veriyi üstten alta, üst bileşenden alt bileşene geçirir. Hangi bileşenin hangi state'i sahip olacağı hemen net olmayabilir. Bu kavram yeni iseniz zorlayıcı olabilir, ancak aşağıdaki adımları takip ederek bunu çözebilirsiniz!

Uygulamanızdaki her state parçası için:

1. O state'e dayalı bir şey render eden *her* bileşeni belirleyin.
2. Onların en yakın ortak üst bileşenini bulun—bir hiyerarşide hepsinin üzerinde olan bir bileşen.
3. State'in nerede bulunması gerektiğine karar verin:
    1. Genellikle, state'i doğrudan ortak ebeveyn bileşenine koyabilirsiniz.
    2. State'i ortak ebeveynin üstündeki bazı bileşenlere de koyabilirsiniz.
    3. State'i sahip olabilecek bir bileşen bulamazsanız, yalnızca state'i tutmak için yeni bir bileşen oluşturun ve onu ortak ebeveyn bileşenin üzerindeki bir yere ekleyin.

Önceki adımda, uygulama içinde iki state buldunuz: arama giriş metni ve checkbox'un değeri. Bu örnekte her zaman birlikte yer aldıkları için aynı yerde durmaları mantıklıdır.

Şimdi bunlar için stratejimizi uygulayalım:

1. **State kullanan bileşenleri belirleyin:**
    * `ProductTable`, bu state'e (arama metni ve checkbox değeri) dayalı olarak ürün listesini filtrelemesi gerekir. 
    * `SearchBar`, bu state'i (arama metni ve checkbox değeri) görüntülemesi gerekir.
2. **Ortak ebeveynlerini bulun:** Her iki bileşenin ortak üst bileşeni `FilterableProductTable`'dır.
3. **State'in nerelerde yaşayacağına karar verin:** Filtre metnini ve işaretli state değerlerini `FilterableProductTable` içinde saklayacağız.

Böylece state değerleri `FilterableProductTable` içinde yaşayacak.

[`useState()` Hook'u ile](https://beta.reactjs.org/reference/react/useState) bileşene state ekleyin. `FilterableProductTable`'in üst kısmında iki state değişkeni ekleyin ve başlangıç durumlarını belirtin:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

Ardından, `filterText` ve `inStockOnly`'yi `ProductTable` ve `SearchBar`'a props olarak iletin:

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

Uygulamanızın nasıl davranacağını görmeye başlayabilirsiniz. Sandbox kodundaki `filterText` başlangıç değerini `useState('')`'den `useState('meyve')`'ye düzenleyin. Hem arama giriş metni hem de tablonun güncelleneceğini göreceksiniz:



```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>İsim</th>
          <th>Fiyat</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Ara..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Sadece stokta olan ürünleri göster
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Meyveler", price: "$1", stocked: true, name: "Elma"},
  {category: "Meyveler", price: "$1", stocked: true, name: "Ejderha Meyvesi"},
  {category: "Meyveler", price: "$2", stocked: false, name: "Passiflora"},
  {category: "Sebzeler", price: "$2", stocked: true, name: "Ispanak"},
  {category: "Sebzeler", price: "$4", stocked: false, name: "Balkabağı"},
  {category: "Sebzeler", price: "$1", stocked: true, name: "Bezelye"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```



:::info
Formu düzenlemenin henüz çalışmadığını fark edin. Yukarıdaki sandbox'ta nedenini açıklayan bir konsol hatası var:
:::



Bir form alanına \`value\` prop'u sağladınız ama bir \`onChange\` işleyici eklemediniz. Bu, salt okunur bir alan oluşturur.



Yukarıdaki sandbox'ta, `ProductTable` ve `SearchBar`, tabloyu, girişi ve checkbox'u görüntülemek için `filterText` ve `inStockOnly` props'unu kullanmaktadır. Örneğin, işte `SearchBar`'ın girdi değerini nasıl doldurduğu:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Ara..."/>
```

Ancak kullanıcı etkileşimleri gibi yazdığınız kodlar henüz eklenmedi. Bu, son adımınız olacak.