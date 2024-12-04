---
title: Etkilere İhtiyacınız Olmayabilir
seoTitle: Gereksiz Etkileri Kaldırarak Performansı Artırın
sidebar_position: 4
description: Bu makalede, React bileşenlerinizde gereksiz etkileri nasıl kaldıracağınızı ve bunun performansınıza nasıl katkıda bulunacağını keşfedeceksiniz. Kullanıcı olayları ve veri yönetimi için en iyi uygulamalara göz atın.
tags: 
  - React
  - Bileşenler
  - Performans
  - Geliştirme
  - Etkiler
keywords: 
  - react
  - bileşen performansı
  - gereksiz etkiler
  - event handlers
  - veri yönetimi
---
Etkiler, React paradigmasından bir kaçış kapısıdır. Size React'ten "dışarı çıkma" imkanı tanır ve bileşenlerinizi bir React dışı widget, ağ veya tarayıcı DOM'u gibi dış sistemlerle senkronize etmenizi sağlar. Dış bir sistem söz konusu değilse (örneğin, bir bileşenin durumunu bazı props veya durum değiştiğinde güncellemek istiyorsanız), bir etkiye ihtiyacınız yoktur. Gereksiz etkileri kaldırmak, kodunuzu daha anlaşılır, daha hızlı çalışır hale getirecek ve daha az hata yapmanıza neden olacaktır.





* Bileşenlerinizden gereksiz etkilerin nasıl kaldırılacağı ve neden gerektiği
* Etkiler olmadan pahalı hesaplamaların nasıl önbelleğe alınacağı
* Etkiler olmadan bileşen durumunun nasıl sıfırlanacağı ve ayarlanacağı
* Olay işleyicileri arasında mantığın nasıl paylaşılıp paylaşılacağı
* Hangi mantığın olay işleyicilerine taşınması gerektiği
* Üst bileşenlere değişiklikler hakkında nasıl bildirim yapılacağı



## Gereksiz Etkileri Kaldırma Yolları {/*how-to-remove-unnecessary-effects*/}

Etkilere ihtiyacınız olmayan iki yaygın durum vardır:

* **Veriyi oluşturmak için etkilerin gerekli değildir.** Örneğin, bir listeyi görüntülemeden önce filtrelemek istiyorsanız. Liste değiştiğinde bir durum değişkenini güncelleyen bir etki yazmaya kalkışabilirsiniz. Ancak bu verimsizdir. Durumu güncellediğinizde, React önce bileşen işlevlerinizi ekranınıza neyin gelmesi gerektiğini hesaplamak için çağırır. Ardından React, bu değişiklikleri DOM'a `“taahhüt eder”` ve ekranı günceller. Sonrasında React, etkilerinizi çalıştırır. Eğer etkiniz *aynı zamanda* durumu hemen güncellerse, bu tüm süreci baştan başlatır! Gereksiz render geçişlerinden kaçınmak için, tüm verileri bileşenlerinizin üst düzeyinde dönüştürün. O kod, props veya durumunuz değiştiğinde otomatik olarak yeniden çalıştırılacaktır.

* **Kullanıcı olaylarını işlemek için etkilerin gerekli değildir.** Örneğin, bir ürünü satın aldığında bir `/api/buy` POST isteği göndermek ve bir bildirim göstermek istiyorsanız. Satın alma butonunun tıklama olay işleyicisinde, ne olduğunu tam olarak biliyorsunuz. Bir etki çalıştığında, kullanıcının ne yaptığını (örneğin, hangi düğmeye tıkladığını) bilemezsiniz. Bu nedenle genelde kullanıcı olaylarını ilgili olay işleyicilerinde işleyeceksiniz.

Dış sistemlerle `senkronize` olmak için etkiler gereklidir. Örneğin, bir jQuery widget'ını React durumu ile senkronize eden bir etki yazabilirsiniz. Ayrıca verileri etkilerle alabilirsiniz: örneğin, arama sonuçlarını mevcut arama sorgusuyla senkronize edebilirsiniz. Modern `çerçevelerin` bileşenlerinizde doğrudan etkiler yazmaktan daha verimli yerleşik veri alma mekanizmaları sunduğunu unutmayın.

Doğru sezgiyi kazanmanıza yardımcı olmak için, bazı yaygın somut örneklere bir göz atalım!

### Props veya Duruma Göre Durum Güncelleme {/*updating-state-based-on-props-or-state*/}

Bir bileşeniniz olduğunu varsayın; iki durum değişkeni var: `firstName` ve `lastName`. Bunları birleştirerek bir `fullName` hesaplamak istiyorsunuz. Dahası, `firstName` veya `lastName` değiştiğinde `fullName`'in güncellenmesini istersiniz. İlk sezginiz, bir `fullName` durum değişkeni eklemek ve bunu bir etkide güncellemektir:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Kaçının: gereksiz durum ve gereksiz etki
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Bu, gerekenden daha karmaşıktır. Aynı zamanda verimsizdir: ilk olarak `fullName` için geçerli olmayan bir değeri içeren tüm render geçişini yapar, ardından güncellenmiş değerle tekrar yeniden render yapar. Durum değişkenini ve etkisini kaldırın:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ İyi: render sırasında hesaplanır
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**Mevcut props veya durumdan hesaplanabilen bir şey olduğunda, `durumda tutmayın.` Bunun yerine, render sırasında hesaplayın.** Bu kodunuzu daha hızlı hale getirir (ekstra "aşamalı" güncellemeleri önlersiniz), daha basit hale getirir (bazı kodları kaldırırsınız) ve daha az hata yapmanıza neden olur (farklı durum değişkenlerinin birbirleriyle senkronize olmaması nedeniyle oluşan hatalardan kaçınırsınız). Bu yaklaşım size yeni geliyorsa, `React'te Düşünme` durumun içine neyin girmesi gerektiğini açıklar.

### Pahalı Hesaplamaları Önbelleğe Alma {/*caching-expensive-calculations*/}

Bu bileşen, aldığı `todos`'ları props üzerinden alır ve `filter` propuna göre filtreleyerek `visibleTodos`'u hesaplar. Sonucu duruma depolamak ve bir etkiden güncellemek istemiş olabilirsiniz:

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Kaçının: gereksiz durum ve gereksiz etki
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

Önceki örnekte olduğu gibi, bu hem gereksiz hem de verimsizdir. Öncelikle durumu ve etkinizi kaldırın:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Bu, getFilteredTodos() yavaş değilse gayet iyidir.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

Genellikle, bu kod iyidir! Ama belki `getFilteredTodos()` yavaş çalışıyordur veya birçok `todos`'unuz vardır. Bu durumda, `newTodo` gibi alakasız bir durum değişkeni değiştiğinde `getFilteredTodos()`'u yeniden hesaplamak istemezsiniz.

Bir pahalı hesaplamayı ``useMemo`` kancasıyla sararak önbelleğe alabilirsiniz:

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ todos veya filter değişmediği sürece tekrar çalışmaz
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

Ya da, tek bir satır olarak yazılmış:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ todos veya filter değişmediği sürece getFilteredTodos() tekrar çalışmaz
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**Bu, React'e iç işlevin `todos` veya `filter` değişmediği sürece yeniden çalışmasını istemediğinizi söyler.** React, başlangıç render'ında `getFilteredTodos()`'un dönüş değerini hatırlayacaktır. Sonraki render'larda, `todos` veya `filter`'ın farklı olup olmadığını kontrol edecektir. Eğer bir öncekiyle aynıysalar, `useMemo` son sakladığı sonucu döndürecektir. Ancak farklılarsa, React iç işlevi tekrar çağıracak (ve sonucunu saklayacaktır).

`useMemo` ile sardığınız işlev render sırasında çalışır, bu nedenle bu yalnızca `saf hesaplamalar` için geçerlidir.



#### Bir Hesaplamanın Pahalı Olup Olduğunu Nasıl Anlarsınız? {/*how-to-tell-if-a-calculation-is-expensive*/}

Genel olarak, binlerce nesne oluşturmadıkça veya döngüye sokmadıkça, muhtemelen pahalı değildir. Daha fazla güven kazanmak isterseniz, bir parça kodda harcanan zamanı ölçmek için bir konsol kaydı ekleyebilirsiniz:

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

Ölçmek istediğiniz etkileşimi gerçekleştirin (örneğin, girdi alanına bir şey yazarak). Sonra konsolunuzda `filter array: 0.15ms` gibi günlükler göreceksiniz. Eğer toplam günlüklenen zaman önemli bir miktara ulaşırsa (örneğin, `1ms` veya daha fazlası), bu hesaplamayı önbelleğe almak mantıklı olabilir. Bir deneme olarak, hesaplamayı `useMemo`'ya sararak etkileşim için toplam günlük zamanın azalıp azalmadığını doğrulayabilirsiniz:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // todos ve filter değişmediği sürece atlanır
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo`, *ilk* renderı daha hızlı hale getirmeyecek. Sadece güncellemelerde gereksiz çalışmaları atlamanıza yardımcı olur.

Unutmayın ki, makineniz muhtemelen kullanıcılarınızdan daha hızlıdır, bu nedenle performansı yapay bir yavaşlama ile test etmek iyi bir fikirdir. Örneğin, Chrome, bunun için [CPU Yavaşlatma](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) seçeneği sunar.

Ayrıca, geliştirme ortamında performans ölçmenin en doğru sonuçları vermez. (Örneğin, `Strict Mode` açık olduğunda, her bileşen bir kez yerine iki kez render edilir). En doğru zamanlamaları almak için, uygulamanızı üretim için derleyin ve kullanıcılarınızın sahip olduğu bir cihazda test edin.



### Bir Prop Değiştiğinde Tüm Durumu Sıfırlama {/*resetting-all-state-when-a-prop-changes*/}

Bu `ProfilePage` bileşeni, bir `userId` prop'u alır. Sayfa bir yorum girişi içerir ve değerini tutmak için bir `comment` durum değişkeni kullanırsınız. Bir gün, bir sorun fark edersiniz: bir profilden diğerine geçtiğinizde, `comment` durumu sıfırlanmaz. Sonuç olarak, yanlış kullanıcının profilinde yanlışlıkla bir yorum göndermek kolaydır. Sorunu çözmek için, `userId` değiştiğinde `comment` durum değişkenini temizlemek istersiniz:

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Kaçının: bir etkinin içinde prop değiştiğinde durumu sıfırlamak
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

Bu verimsizdir çünkü `ProfilePage` ve alt bileşenleri önce geçerli olmayan bir değerle render olacak ve ardından tekrar render olacak. Ayrıca, bu işlemi *her* `ProfilePage` içinde durumu olan bileşende yapmanız gerektiği için karmaşık olur. Örneğin, yorum kullanıcı arayüzü iç içeyse, iç içe geçmiş yorum durumunu da temizlemeniz gerekecektir.

Bunun yerine, React'a her kullanıcının profilinin kavramsal olarak _farklı_ bir profil olduğunu, ona açık bir anahtar vererek belirtebilirsiniz. Bileşeninizi ikiye ayırın ve dış bileşenden iç bileşene bir `key` özniteliği geçirin:

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ Bu ve aşağıdaki herhangi bir durum, anahtar değiştiğinde otomatik olarak sıfırlanır
  const [comment, setComment] = useState('');
  // ...
}
```

Normalde, React, aynı bileşen aynı yerden render edildiğinde durumu korur. **`userId`'yı `Profile` bileşenine bir `key` olarak geçirerek, React'a farklı `userId`'lere sahip iki `Profile` bileşenini durumu paylaşmaması gereken iki farklı bileşen gibi ele almasını söylüyorsunuz.** Anahtar (ki bunu `userId` olarak ayarladınız) değiştiğinde, React DOM'u yeniden oluşturacak ve `durumu sıfırlayacaktır` `Profile` bileşeni ve tüm çocukları için. Artık `comment` alanı, profiller arasında geçiş yaptığınızda otomatik olarak temizlenecektir.

Unutmayın ki bu örnekte, yalnızca dış `ProfilePage` bileşeni dışa aktarılır ve projedeki diğer dosyalara görünür. `ProfilePage`'i render eden bileşenlerin ona anahtarı geçirmesi gerekmez: ona `userId` olarak normal bir prop olarak geçirirler. `ProfilePage`'in bunu içteki `Profile` bileşenine `key` olarak geçirmesi, bir uygulama detayından ibarettir.

### Bir Prop Değiştiğinde Bazı Durumları Ayarlama {/*adjusting-some-state-when-a-prop-changes*/}

Bazen, bir prop değiştiğinde durumu sıfırlamak veya ayarlamak isteyebilirsiniz, ancak hepsini değil.

Bu `List` bileşeni, `items` adında bir prop alır ve `selection` durum değişkeninde seçili öğeyi saklar. `items` prop'u farklı bir dizi aldığında `selection`'ı `null` olarak sıfırlamak istersiniz:

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Kaçının: prop değiştiğinde durumu ayarlamak için bir etkinin içinde
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

Bu da ideal değildir. Her seferinde `items` değiştiğinde, `List` ve alt bileşenleri, önce geçerli olmayan bir `selection` değeri ile render olacak. Sonra React DOM'u güncelleyip etkileri çalıştıracak. Son olarak, `setSelection(null)` çağrısı, `List` ve alt bileşenlerini bir kez daha yeniden render etmesine neden olacak ve tüm bu süreci tekrar başlatacaktır.

Etkileri kaldırarak başlayın. Bunun yerine durumu rendering sırasında doğrudan ayarlayın:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Daha İyi: Render sırasında durumu ayarlama
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

`Önceki render'lardan bilgi depolamak` gibi bu, anlaması zor olabilir, ancak bir etkinin içindeki durumu güncellemeye göre daha iyidir. Yukarıdaki örnekte, `setSelection` render sırasında doğrudan çağrılır. React, `return` ifadesiyle çıktığında `List`'i yeniden render eder. React henüz `List` çocuklarını render etmeye veya DOM'u güncellemeye başlamamıştır, bu nedenle bu, `List` çocuklarının geçerli olmayan `selection` değerini render etmelerini atlamasına olanak tanır.

Bir bileşeni render ederken güncellemek, React'ın döndürülen JSX'yi atmasına ve hemen yeniden render etmeye çalışmasına neden olur. Çok yavaş kademeli yeniden denemeleri önlemek için, React yalnızca render sırasında aynı bileşenin durumunu güncellemeye izin verir. Eğer render sırasında başka bir bileşenin durumunu güncelliyorsanız, bir hata alırsınız. `items !== prevItems` gibi bir koşul, döngüleri önlemek için gereklidir. Durumunuzu bu şekilde ayarlayabilirsiniz, ancak herhangi bir yan etkiler (örneğin, DOM'u değiştirmek veya zaman aşamaları ayarlamak) olay işleyicilerinde veya etkilerde kalmalıdır `bileşenleri saf tutmak için.`

**Bu desen, etkiden daha verimli olsa da, çoğu bileşenin bunu gerektirmemesi gerekir.** Her ne şekilde yaparsanız yapın, durumu diğer durumlara veya prop'lara dayalı olarak ayarlamak, veri akışınızı anlamayı ve hata ayıklamayı daha zor hale getirir. Her zaman, durumu `anahtar ile sıfırlamayı` veya `her şeyi render sırasında hesaplamayı` kontrol edin. Örneğin, seçili *öğeyi* saklamak (ve sıfırlamak) yerine, seçili *öğe kimliğini* saklayabilirsiniz:

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ En İyi: Her şeyi render sırasında hesaplayın
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

Artık durumu "ayarlamak" için bir neden yok. Seçili kimliğe sahip öğe listede varsa seçili kalır. Yoksa, render sırasında hesaplanan `selection` `null` olacaktır çünkü eşleşen öğe bulunamamıştır. Bu davranış farklıdır, ama çoğu `items` değişikliğinde seçimi koruduğu için daha iyi olarak kabul edilebilir.

### Olay İşleyicileri Arasında Mantık Paylaşma {/*sharing-logic-between-event-handlers*/}

Diyelim ki, ürünü sepete eklerken her iki butonun (Satın Al ve Ödeme) kullanıcıya bildirimi gösteren bir ürün sayfanız var. Kullanıcı ürünü sepete koyduğunda bir bildirim göstermek istiyorsunuz. Her iki butonun tıklama olay işleyicisinde `showNotification()`'u çağırmak tekrarlayıcı hissedebilir, bu nedenle bu mantığı bir etkide koyma eğiliminde olabilirsiniz:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Kaçının: Olay özel mantığı bir etkide bulundurmak
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Sepete eklendi: ${product.name}!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

Bu etki gereksizdir. Ayrıca çoğu ihtimalle hatalara neden olacaktır. Örneğin, uygulamanız sayfa yeniden yüklemeleri arasında sepetteki ürünleri "hatırlıyorsa". Bir ürünü sepete bir kez ekleyip sayfayı yenileyince, bildirim tekrar görünecektir. Ürün sayfası yenilendiğinde bu bildirim sürekli olarak belirecektir. Bunun nedeni, `product.isInCart` sayfa yüklemede zaten `true` olduğu için yukarıdaki etki `showNotification()`'u çağıracaktır.

**Eğer bazı kodların bir etkide mi yoksa bir olay işleyicisinde mi olması gerektiğinden emin değilseniz, kendinize bu kodun neden çalışması gerektiğini sorun. Etkileri yalnızca bileşen kullanıcıya gösterildiği için çalışması gereken kodlar için kullanın.** Bu örnekte bildirim, kullanıcının *butona bastığı için* görünmelidir, sayfa görüntülendiği için değil! Etkiyi silin ve paylaşılan mantığı her iki olay işleyicisinden de çağrılan bir fonksiyona yerleştirin:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ İyi: Olaylara özel mantık olay işleyicilerinden çağrılır
  function buyProduct() {
    addToCart(product);
    showNotification(`Sepete eklendi: ${product.name}!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

Bu, gereksiz etkiyi kaldırır ve hatayı düzeltir.