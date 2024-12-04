---
title: Bileşenler Arasında Durum Paylaşımı
seoTitle: Bileşenler Arasında Durum Paylaşımının Yöntemleri
sidebar_position: 4
description: Bu kılavuzda, React bileşenleri arasında durumu yükseltme yöntemlerini keşfedeceksiniz. Bileşenleri koordine etmek, durumu paylaşmak ve daha fazlasını öğrenin.
tags: 
  - React
  - durumu yükseltme
  - bileşenler arası iletişim
  - JavaScript
keywords: 
  - React
  - durum
  - bileşen
  - props
  - JavaScript
---
Bazen, iki bileşenin durumunun her zaman birlikte değişmesini istersiniz. Bunu yapmak için, her ikisinden de durumu çıkarın, en yakın ortak üst bileşenlerine taşıyın ve ardından bunu props üzerinden onlara iletin. Bu işleme *durum yükseltme* denir ve bu, React kodu yazarken yapacağınız en yaygın şeylerden biridir.





- Durumu bileşenler arasında yükselterek paylaşmayı
- Kontrollü ve kontrolsüz bileşenlerin ne olduğunu



## Örnekle Durum Yükseltme {/*lifting-state-up-by-example*/}

Bu örnekte, bir üst `Accordion` bileşeni iki ayrı `Panel` bileşeni render ediyor:

* `Accordion`
  - `Panel`
  - `Panel`

Her `Panel` bileşeni, içeriğinin görünür olup olmadığını belirleyen bir boolean `isActive` durumuna sahiptir.

Her iki panel için "Göster" butonuna basın:



```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Göster
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almatı, Kazakistan</h2>
      <Panel title="Hakkında">
        Yaklaşık 2 milyonluk bir nüfusa sahip olan Almatı, Kazakistan'ın en büyük şehridir. 1929'dan 1997'ye kadar ülkenin başkenti olmuştur.
      </Panel>
      <Panel title="Etymoloji">
        İsim, Kazakça "elma" anlamına gelen <span lang="kk-KZ">алма</span> kelimesinden gelmektedir ve genellikle "elmalarla dolu" olarak çevrilir. Aslında, Almatı'yı çevreleyen bölgenin elmanın atası olduğu düşünülmektedir ve vahşi <i lang="la">Malus sieversii</i> modern evcil elmanın muhtemel atası olarak kabul edilmektedir.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```



Bir panel butonuna basmanın diğer paneli etkilemediğine dikkat edin; bunlar bağımsızdır.





Başlangıçta, her `Panel`'in `isActive` durumu `false` olduğundan, her ikisi de çökük görünür





Herhangi bir `Panel`'in butonuna tıkladığınızda sadece o `Panel`'in `isActive` durumu güncellenir





**Ama şimdi, yalnızca bir panelin herhangi bir zamanda genişletilmesini isteyip istemediğinizi düşünelim.** Bu tasarımla, ikinci panelin genişletilmesi birinci panelin kapanmasını sağlamalıdır. Bunu nasıl yaparsınız?

Bu iki paneli koordine etmek için, durumu "yükseltmeniz" gerekir. Bu işlem üç aşamada gerçekleştirilir:

1. **Durumu** çocuk bileşenlerden kaldırın.
2. **Ortak üstten** sabit veriler geçin.
3. **Ortak üst bileşene** durum ekleyin ve olay işleyicileri ile birlikte aşağıya geçin.

Bu, `Accordion` bileşeninin her iki `Panel`'i koordine etmesini ve yalnızca birinin genişlemesini sağlar.

### Adım 1: Durumu çocuk bileşenlerden kaldırın {/*step-1-remove-state-from-the-child-components*/}

`Panel`'in `isActive` kontrolünü üst bileşenine vereceksiniz. Bu, üst bileşenin `isActive` değerini `Panel`'e bir prop olarak ileteceği anlamına gelir. Başlangıçta `Panel` bileşeninden bu satırı **kaldırın**:

```js
const [isActive, setIsActive] = useState(false);
```

Ve onun yerine, `Panel`'in prop listesine `isActive` ekleyin:

```js
function Panel({ title, children, isActive }) {
```

Artık `Panel`'in üst bileşeni `isActive` değerini `prop olarak ileterek kontrol edebilir.` Tersine, `Panel` bileşeni artık `isActive` değerinin üzerinde *hiçbir kontrol* sahibi değildir; artık bu üst bileşene bağlıdır!

### Adım 2: Ortak üstten sabit verileri geçin {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

Durumu yükseltmek için, koordine etmek istediğiniz *her iki* çocuk bileşenin en yakın ortak üst bileşenini bulmanız gerekir:

* `Accordion` *(en yakın ortak üst)*
  - `Panel`
  - `Panel`

Bu örnekte, `Accordion` bileşenidir. Her iki panelin üzerinde yer aldığı ve bunların props'larını kontrol edebildiği için, hangi panelin şu anda aktif olduğunu belirleyen "gerçeklik kaynağı" olacaktır. `Accordion` bileşeninin her iki panele de sabit bir `isActive` değeri (örneğin `true`) geçmesini sağlayın:



```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almatı, Kazakistan</h2>
      <Panel title="Hakkında" isActive={true}>
        Yaklaşık 2 milyonluk bir nüfusa sahip olan Almatı, Kazakistan'ın en büyük şehridir. 1929'dan 1997'ye kadar ülkenin başkenti olmuştur.
      </Panel>
      <Panel title="Etymoloji" isActive={true}>
        İsim, Kazakça "elma" anlamına gelen <span lang="kk-KZ">алма</span> kelimesinden gelmektedir ve genellikle "elmalarla dolu" olarak çevrilir. Aslında, Almatı'yı çevreleyen bölgenin elmanın atası olduğu düşünülmektedir ve vahşi <i lang="la">Malus sieversii</i> modern evcil elmanın muhtemel atası olarak kabul edilmektedir.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Göster
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```



`Accordion` bileşenindeki sabit `isActive` değerlerini düzenlemeyi deneyin ve sonuçları ekranda görün.

### Adım 3: Ortak üst bileşene durum ekleyin {/*step-3-add-state-to-the-common-parent*/}

Durumu yükseltmek, genellikle neyi durum olarak saklayacağınızı değiştirir.

Bu durumda, yalnızca bir panel her seferinde aktif olmalıdır. Bu, `Accordion` ortak üst bileşeninin hangi panelin aktif olduğunu takip etmesi gerektiği anlamına gelir. `boolean` değeri yerine, durumu indeks olarak aktif `Panel` için bir sayı kullanabilir:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

`activeIndex` `0` olduğunda, birinci panel aktiftir; `1` olduğunda, ikinci panel aktiftir.

Herhangi bir `Panel`'deki "Göster" butonuna tıklamak, `Accordion` içindeki aktif indeksi değiştirmelidir. `Panel` doğrudan `activeIndex` durumunu ayarlayamaz, çünkü bu değer `Accordion` içinde tanımlıdır. `Accordion` bileşeni, `Panel` bileşeninin durumunu değiştirmesine *açıkça izin vermelidir* `bir olay işleyicisini prop olarak geçirerek`:

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

`Panel` içindeki ``, artık tıklama olay işleyicisi olarak `onShow` propunu kullanacaktır:



```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almatı, Kazakistan</h2>
      <Panel
        title="Hakkında"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Yaklaşık 2 milyonluk bir nüfusa sahip olan Almatı, Kazakistan'ın en büyük şehridir. 1929'dan 1997'ye kadar ülkenin başkenti olmuştur.
      </Panel>
      <Panel
        title="Etymoloji"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        İsim, Kazakça "elma" anlamına gelen <span lang="kk-KZ">алма</span> kelimesinden gelmektedir ve genellikle "elmalarla dolu" olarak çevrilir. Aslında, Almatı'yı çevreleyen bölgenin elmanın atası olduğu düşünülmektedir ve vahşi <i lang="la">Malus sieversii</i> modern evcil elmanın muhtemel atası olarak kabul edilmektedir.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Göster
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```



Bu, durumu yükseltme işlemini tamamlar! Durumu ortak üst bileşene taşımak, iki paneli koordine etmenizi sağladı. İki "görüntüleniyor" bayrağı yerine aktif indeksi kullanmak, her seferinde yalnızca bir panelin aktif olmasını sağladı. Olay işleyicisini alt bileşene geçmek, alt bileşenin üst bileşenin durumunu değiştirmesine olanak tanıdı.





Başlangıçta, `Accordion`'ın `activeIndex` değeri `0` olduğundan, ilk `Panel` `isActive = true` alır





`Accordion`'ın `activeIndex` durumu `1`'e değiştiğinde, ikinci `Panel` `isActive = true` alır







#### Kontrollü ve Kontrolsüz Bileşenler {/*controlled-and-uncontrolled-components*/}

Bir bileşenin bir miktar yerel durumu olması "kontrolsüz" olarak adlandırılır. Örneğin, orijinal `Panel` bileşeni bir `isActive` durum değişkenine sahipse, kontrolsüzdür çünkü üst bileşeni, panelin aktif olup olmadığını etkileyemez.

Tersine, bir bileşenin önemli bilgileri, kendi yerel durumundan ziyade props tarafından yönlendiriliyorsa, "kontrollü" olduğu söylenebilir. Bu, üst bileşenin tam olarak davranışını belirlemesine olanak tanır. Son `Panel` bileşeni, `isActive` prop ile `Accordion` bileşeni tarafından kontrol edilmektedir.

Kontrolsüz bileşenler, üstler içinde daha az yapılandırma gerektirdiğinden daha kolay kullanılır. Ancak, onları bir arada koordine etmek istediğinizde daha az esneklik sunar. Kontrollü bileşenler en yüksek esneklik sağlar, ancak üst bileşenlerin onları tamamen konfigüre etmelerini gerektirir.

Pratikte, "kontrollü" ve "kontrolsüz" kesin teknik terimler değildir; her bileşen genellikle hem yerel durum hem de props'un bir karışımına sahiptir. Ancak, bileşenlerin nasıl tasarlandığı ve hangi yetenekleri sunduğuna dair konuşmak için yararlı bir yoldur.

Bir bileşen yazarken, içinde hangi bilginin kontrollü (props aracılığıyla) ve hangisinin kontrolsüz (durum aracılığıyla) olması gerektiğini düşünün. Ancak her zaman fikrinizi değiştirebilir ve yeniden yapılandırabilirsiniz.



## Her Durum İçin Tek Bir Doğru Kaynak {/*a-single-source-of-truth-for-each-state*/}

Bir React uygulamasında, birçok bileşen kendi durumuna sahip olacaktır. Bazı durumlar, ağaçtaki yaprak bileşenlerin (en alttaki bileşenler) yakınında "yaşayabilir", diğer durumlar ise uygulamanın üst tarafında "yaşayabilir". Örneğin, istemci tarafı yönlendirme kütüphaneleri genellikle mevcut rotayı React durumunda saklayarak ve bunu props aracılığıyla geçirerek uygulanır!

**Her bir benzersiz durum parçası için "sahip" olan bileşeni seçeceksiniz.** Bu ilkeye, ["tek bir doğru kaynak" oluşturma](https://en.wikipedia.org/wiki/Single_source_of_truth) da denir. Bu, tüm durumların tek bir yerde yaşadığı anlamına gelmez; ancak _her_ durum parçası için _belirli_ bir bileşenin bu bilgiyi tutması gerektiği anlamına gelir. Bileşenler arasındaki paylaşılan durumu çoğaltmak yerine, *onu* ortak paylaşılan üst bileşene *yükseltin* ve onu ihtiyaç duyan çocuklara *iletiin*.

Uygulamanız üzerinde çalışırken değişiklikler olacaktır. Her bir durum parçasının "nerede yaşadığı" konusunda hala fikir edinmeye çalışırken, durumları aşağı veya yukarı taşımanız yaygındır. Bu, sürecin bir parçasıdır!

Bunun pratikte nasıl hissettirdiğini görmek için birkaç bileşenle `React'ta Düşünmek` yazısına bakın.



* İki bileşeni koordine etmek istediğinizde, durumlarını ortak üst bileşenlerine taşıyın.
* Sonra, ortak üst bileşenden bilgi geçirin props aracılığıyla.
* Son olarak, çocukların üst bileşenin durumunu değiştirebilmesi için olay işleyicilerini aşağı gönderen props randomklarllä geçirikoa sağlarsınız.
* Bileşenleri "kontrollü" (props tarafından yönlendirilen) veya "kontrolsüz" (durum tarafından yönlendirilen) olarak düşünmek faydalıdır.





#### Senkronize Girdiler {/*synced-inputs*/}

Bu iki girdi bağımsızdır. Onları senkronize tutun: bir girişi düzenlemek diğer girişi aynı metinle güncellemelidir ve tam tersi.



Durumlarını ebeveyn bileşenine yükseltmeniz gerekecek.





```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="Birinci girdi" />
      <Input label="İkinci girdi" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```





`text` durum değişkenini yanı sıra `handleChange` işleyicisini ebeveyn bileşenine taşıyın. Ardından bunları her iki `Input` bileşenine prop olarak geçirin. Bu, onları senkronize tutacaktır.



```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="Birinci girdi"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="İkinci girdi"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```





#### Bir Listeyi Filtreleme {/*filtering-a-list*/}

Bu örnekte, `SearchBar`'ın kendi `query` durumu, metin girişini kontrol eder. Üst `FilterableList` bileşeni bir `List` öğeleri gösterirken, bu arama sorgusunu dikkate almaz.

Listeyi arama sorgusuna göre filtrelemek için `filterItems(foods, query)` fonksiyonunu kullanın. Değişikliklerinizi test etmek için, girişi "s" yazarak listeyi "Sushi", "Shish kebab" ve "Dim sum" ile filtrelediğinizi kontrol edin.

`filterItems` zaten uygulanmış ve içe aktarılmıştır, bu yüzden kendiniz yazmanıza gerek yoktur!



`query` durumunu ve `handleChange` işleyicisini `SearchBar`'dan kaldırmanız ve bunları `FilterableList`'e taşımanız gerekecek. Sonra bunları `SearchBar`'a `query` ve `onChange` props'u olarak geçirin.





```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Arama:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi, hazırlanan sirke ile harmanlanmış pirinçten oluşan geleneksel bir Japon yemeğidir.'
}, {
  id: 1,
  name: 'Dal',
  description: 'Dal'ı hazırlamanın en yaygın yolu, soğan, domates ve çeşitli baharatlar eklenerek bir çorba şeklinde yapılmasıdır.'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi, dolgusunun etrafına mayasız hamur sarmak ve kaynar suda pişirmek suretiyle yapılan dolgulardır.'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Şiş kebabı, şişe dizilmiş ve ızgara yapılmış et küplerinden oluşan popüler bir yemektir.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum, geleneksel olarak kahvaltı ve öğle yemeği yemekleri için restoranlarda tadına bakılan küçük yemeklerin geniş bir yelpazesidir.'
}];
```





`query` durumunu `FilterableList` bileşenine yükseltin. `filterItems(foods, query)` fonksiyonunu çağırarak filtrelenmiş listeyi alın ve bunu `List`'e geçirin. Artık arama girişi değiştiğinde listede de yansır:



```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Arama:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi, hazırlanan sirke ile harmanlanmış pirinçten oluşan geleneksel bir Japon yemeğidir.'
}, {
  id: 1,
  name: 'Dal',
  description: 'Dal'ı hazırlamanın en yaygın yolu, soğan, domates ve çeşitli baharatlar eklenerek bir çorba şeklinde yapılmasıdır.'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi, dolgusunun etrafına mayasız hamur sarmak ve kaynar suda pişirmek suretiyle yapılan dolgulardır.'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Şiş kebabı, şişe dizilmiş ve ızgara yapılmış et küplerinden oluşan popüler bir yemektir.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum, geleneksel olarak kahvaltı ve öğle yemeği yemekleri için restoranlarda tadına bakılan küçük yemeklerin geniş bir yelpazesidir.'
}];
```