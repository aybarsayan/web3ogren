---
title: State Bir Bileşenin Belleği
seoTitle: State Yönetimi - React Bileşenleri
sidebar_position: 4
description: Bu makalede, React bileşenlerinde durum (state) yönetimini öğreneceksiniz. Durum değişkenleri nasıl eklenir ve kullanılır, detaylı örneklerle açıklanacaktır.
tags: 
  - React
  - state yönetimi
  - useState
  - JavaScript
keywords: 
  - React
  - state yönetimi
  - useState
  - JavaScript
---
Bileşenler, bir etkileşim sonucunda ekranda ne olduğunu değiştirmeleri gerektiğinde sıklıkla kullanılmaktadır. Formda yazı yazmak, giriş alanını güncellemelidir; bir resim karuselinde "sonraki"ye tıklamak, görüntülenen resmi değiştirmelidir; "satın al" düğmesine tıklamak, bir ürünü alışveriş sepetine eklemelidir. Bileşenlerin "hatırlaması" gereken şeyler vardır: mevcut giriş değeri, mevcut resim, alışveriş sepeti. React'te, bu tür bileşen özel belleğine *durum* denir.





* `useState` Hook'u ile bir durum değişkeninin nasıl ekleneceği
* `useState` Hook'unun döndürdüğü değer çifti
* Birden fazla durum değişkeninin nasıl ekleneceği
* Neden durumun yerel olarak adlandırıldığı



## Standart bir değişken yeterli olmadığında {/*when-a-regular-variable-isnt-enough*/}

İşte bir heykel resmi görüntüleyen bir bileşen. "Sonraki" düğmesine tıklandığında `index` değerini `1`, ardından `2` ve devamında yükselterek bir sonraki heykeli göstermelidir. Ancak bu **çalışmaz** (denemek isteyebilirsin!):



```js
import { sculptureList } from './data.js';

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Sonraki
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        tarafından {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} / {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Colvin genellikle antik sembolleri çağrıştıran soyut temalarla tanınmaktadır; bu devasa heykel, bir nörocerrahilik onuru olarak, kamu sanatının en tanınmış eserlerinden biridir.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'İki çapraz elin nazikçe parmaklarının ucunda bir insan beynini tuttuğu bir bronz heykel.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'Bu devasa (75 ft. veya 23m) gümüş çiçek Buenos Aires'te yer almaktadır. Gece peteklerini kapatıp sabah açılması için tasarlanmıştır.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Yansıtıcı aynaya benzer petallere ve güçlü tohumlara sahip devasa bir metal çiçek heykeli.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson, eşitlik, sosyal adalet gibi insanoğlunun temel ve manevi nitelikleriyle ilgili bir kaygı ile tanınmıştır. Bu devasa (7ft. veya 2,13m) bronz heykel, "evrensel insanlık hissiyle dolu sembolik bir Siyah varlık" olarak tanımlamıştır.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'İnsani bir başı tasvir eden heykel sürekli ve huzurlu bir şekilde etrafa yayılır.'
}, {
  name: 'Moai',
  artist: 'Bilinmeyen Sanatçı',
  description: 'Paskalya Adası\'nda, Rapa Nui halkı tarafından oluşturulan 1.000 adet moai veya mevcut anıtsal heykel bulunmaktadır; bazıları bunların tanrılaştırılmış ataları temsil ettiğini düşünmektedir.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Üç anıtsal taş büst, orantısız büyük başlarıyla ve somurtkan yüzleriyle.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nanas, zafer kazanmış yaratıklar, kadınlık ve annelik sembolleridir. Başlangıçta, Saint Phalle Nanas için kumaş ve buluntu nesneler kullanmış, ardından daha canlı bir etki elde etmek için polyester tanıtmıştır.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Neşeli bir kıyafet içinde dans eden bir kadın figürünün büyük mozaik heykeli.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'Bu soyut bronz heykel, Yorkshire Heykel Parkı\'ndaki Aile Serisi\'nin bir parçasıdır. Hepworth, dünyanın gerçekçi tasvirlerini yapmamaya karar vermiş, insan ve peyzajdan ilham alarak soyut biçimler geliştirmiştir.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Birbirine yığılmış üç elementten oluşan yüksek bir heykel, insana benzeyen bir form hatırlatmaktadır.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Dört nesil ahşap oymacı soyundan gelen Fakeye'nin çalışması geleneksel ve çağdaş Yoruba temalarını harmanlamıştır.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Desenli bir ata binen oduncu heykeli ile odaklanmış bir yüz.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow, kırılganlık ve gençliğin geçiciliği için bir metafor olarak parçalı bedeni simgeleyen heykelleri ile tanınmaktadır. Bu heykel, üst üste yığılmış iki son derece gerçekçi büyük karnı göstermektedir, her biri yaklaşık beş feet (1,5m) yükseklikte.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'Heykel, kırışıklıklar halindeki bir şelaleyi hatırlatıyor, klasik heykellerde yer alan karınlardan oldukça farklı.'
}, {
  name: 'Terracotta Army',
  artist: 'Bilinmeyen Sanatçı',
  description: 'Terracotta Ordusu, Çin\'in ilk İmparatoru Qin Shi Huang\'ın ordularını gösteren bir dizi terracotta heykelden oluşmaktadır. Ordu, 8.000\'den fazla askeri, 130 savaş aracını 520 atla ve 150 süvari atını içermekteydi.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: 'Her birinin kendine özgü bir yüz ifadesi ve zırhı olan 12 terracotta heykeli.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson, New York kenti enkazından topladığı nesneleri, daha sonra anıtsal yapılar haline getirmek için bir araya getirerek tanınmıştır. Burada, bir yatak direği, jonglör bezi ve koltuk parçası gibi çeşitli parçaları kullanarak, bunları çivileyip yapıştırarak kutular haline getirmiştir. Bu, Kübizm’in geometrik soyutlamasının uzay ve biçim üzerindeki etkisini yansıtmaktadır.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Bireysel unsurların başlangıçta tanınamaz olduğu mat bir siyah heykel.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar, geleneksel ile moderni, doğal ile sanayiyi birleştiriyor. Sanatı, insan ve doğa arasındaki ilişkiye odaklanmaktadır. Eserleri, soyut ve gerçekçi olarak etkileyici, yer çekimini aşan ve "olağandışı malzemelerin ince bir sentezi" olarak tanımlanmıştır.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Beton duvara monte edilmiş, zemine inen soluk bir tel benzeri heykel. Hafif görünmektedir.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'Taipei Hayvanat Bahçesi, suya dalmış hipopotamları içeren bir Hippo Meydanı tasarlamıştır.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Yüzer gibi görünüyormuşçasına bir aralarında dolaşan bronz hipopotam heykelleri.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```



`handleClick` olay yöneticisi, yerel bir değişken olan `index`'i güncellemektedir. Ancak, değişikliğin görünmesini engelleyen iki şey vardır:

1. **Yerel değişkenler, yeniden render edilmesi arasında kalıcı değildir.** React bu bileşeni ikinci kez render ettiğinde, onu sıfırdan render eder - yerel değişkenlerde yapılan değişiklikleri dikkate almaz.
2. **Yerel değişkenlerdeki değişiklikler, render tetiklemez.** React, yeni verilerle bileşeni tekrar render etmesi gerektiğini anlamaz.

Bir bileşeni yeni verilerle güncellemek için iki şeyin gerçekleşmesi gerekir:

1. **Veriyi** yeniden render edilmesi arasında korumak.
2. **React'i** bileşeni yeni verilerle render etmesi için tetiklemek (yeniden render).

`useState` Hook'u bu iki şeyi sağlar:

1. Yeniden render edilmesi arasında veriyi korumak için bir **durum değişkeni**.
2. Değişkeni güncellemek ve React'in bileşeni tekrar render etmesini tetiklemek için bir **durum ayarlayıcı fonksiyonu**.

## Bir durum değişkeni eklemek {/*adding-a-state-variable*/}

Bir durum değişkeni eklemek için, dosyanın en üstünde React'ten `useState`'i import edin:

```js
import { useState } from 'react';
```

Sonra şu satırı değiştirin:

```js
let index = 0;
```

şu şekilde:

```js
const [index, setIndex] = useState(0);
```

`index`, bir durum değişkenidir ve `setIndex` ayarlayıcı fonksiyondur.

> Buradaki `[` ve `]` söz dizimi [dizi parçalama](https://javascript.info/destructuring-assignment) olarak adlandırılır ve bir diziden değerleri okumanızı sağlar. `useState` tarafından döndürülen dizi her zaman tam olarak iki öğe içerir.

`handleClick` fonksiyonundaki bir durum değişkeninin nasıl çalıştığını gösterelim:

```js
function handleClick() {
  setIndex(index + 1);
}
```

Artık "Sonraki" düğmesine tıklamak mevcut heykeli değiştirmektedir:



```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);

  function handleClick() {
    setIndex(index + 1);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Sonraki
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        tarafından {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} / {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Colvin genellikle antik sembolleri çağrıştıran soyut temalarla tanınmaktadır; bu devasa heykel, bir nörocerrahilik onuru olarak, kamu sanatının en tanınmış eserlerinden biridir.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'İki çapraz elin nazikçe parmaklarının ucunda bir insan beynini tuttuğu bir bronz heykel.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'Bu devasa (75 ft. veya 23m) gümüş çiçek Buenos Aires\'te yer almaktadır. Gece peteklerini kapatıp sabah açılması için tasarlanmıştır.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Yansıtıcı aynaya benzer petallere ve güçlü tohumlara sahip devasa bir metal çiçek heykeli.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson, eşitlik, sosyal adalet gibi insanoğlunun temel ve manevi nitelikleriyle ilgili bir kaygı ile tanınmıştır. Bu devasa (7ft. veya 2,13m) bronz heykel, "evrensel insanlık hissiyle dolu sembolik bir Siyah varlık" olarak tanımlamıştır.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'İnsani bir başı tasvir eden heykel sürekli ve huzurlu bir şekilde etrafa yayılır.'
}, {
  name: 'Moai',
  artist: 'Bilinmeyen Sanatçı',
  description: 'Paskalya Adası\'nda, Rapa Nui halkı tarafından oluşturulan 1.000 adet moai veya mevcut anıtsal heykel bulunmaktadır; bazıları bunların tanrılaştırılmış ataları temsil ettiğini düşünmektedir.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Üç anıtsal taş büst, orantısız büyük başlarıyla ve somurtkan yüzleriyle.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nanas, zafer kazanmış yaratıklar, kadınlık ve annelik sembolleridir. Başlangıçta, Saint Phalle Nanas için kumaş ve buluntu nesneler kullanmış, ardından daha canlı bir etki elde etmek için polyester tanıtmıştır.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Neşeli bir kıyafet içinde dans eden bir kadın figürünün büyük mozaik heykeli.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'Bu soyut bronz heykel, Yorkshire Heykel Parkı\'ndaki Aile Serisi\'nin bir parçasıdır. Hepworth, dünyanın gerçekçi tasvirlerini yapmamaya karar vermiş, insan ve peyzajdan ilham alarak soyut biçimler geliştirmiştir.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Birbirine yığılmış üç elementten oluşan yüksek bir heykel, insana benzeyen bir form hatırlatmaktadır.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Dört nesil ahşap oymacı soyundan gelen Fakeye'nin çalışması geleneksel ve çağdaş Yoruba temalarını harmanlamıştır.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Desenli bir ata binen oduncu heykeli ile odaklanmış bir yüz.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow, kırılganlık ve gençliğin geçiciliği için bir metafor olarak parçalı bedeni simgeleyen heykelleri ile tanınmaktadır. Bu heykel, üst üste yığılmış iki son derece gerçekçi büyük karnı göstermektedir, her biri yaklaşık beş feet (1,5m) yükseklikte.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'Heykel, kırışıklıklar halindeki bir şelaleyi hatırlatıyor, klasik heykellerde yer alan karınlardan oldukça farklı.'
}, {
  name: 'Terracotta Army',
  artist: 'Bilinmeyen Sanatçı',
  description: 'Terracotta Ordusu, Çin\'in ilk İmparatoru Qin Shi Huang\'ın ordularını gösteren bir dizi terracotta heykelden oluşmaktadır. Ordu, 8.000\'den fazla askeri, 130 savaş aracını 520 atla ve 150 süvari atını içermekteydi.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: 'Her birinin kendine özgü bir yüz ifadesi ve zırhı olan 12 terracotta heykeli.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson, New York kenti enkazından topladığı nesneleri, daha sonra anıtsal yapılar haline getirmek için bir araya getirerek tanınmıştır. Burada, bir yatak direği, jonglör bezi ve koltuk parçası gibi çeşitli parçaları kullanarak, bunları çivileyip yapıştırarak kutular haline getirmiştir. Bu, Kübizm’in geometrik soyutlamasının uzay ve biçim üzerindeki etkisini yansıtmaktadır.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Bireysel unsurların başlangıçta tanınamaz olduğu mat bir siyah heykel.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar, geleneksel ile moderni, doğal ile sanayiyi birleştiriyor. Sanatı, insan ve doğa arasındaki ilişkiye odaklanmaktadır. Eserleri, soyut ve gerçekçi olarak etkileyici, yer çekimini aşan ve "olağandışı malzemelerin ince bir sentezi" olarak tanımlanmıştır.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Beton duvara monte edilmiş, zemine inen soluk bir tel benzeri heykel. Hafif görünmektedir.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'Taipei Hayvanat Bahçesi, suya dalmış hipopotamları içeren bir Hippo Meydanı tasarlamıştır.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Yüzer gibi görünüyormuşçasına bir aralarında dolaşan bronz hipopotam heykelleri.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```



### İlk Hook'unuzu Tanıyın {/*meet-your-first-hook*/}

React'te, `useState` ve "`use`" ile başlayan diğer fonksiyonlar bir Hook olarak adlandırılır.

*Hook'lar*, yalnızca React `render ederken` kullanılabilen özel fonksiyonlardır (bununla ilgili daha fazla detay bir sonraki sayfada görülecektir). Farklı React özelliklerine "takılmanıza" izin verir.

Durum, bu özelliklerden sadece biridir, ancak diğer Hook'larla daha sonra tanışacaksınız.

:::tip
Hook'lar - `use` ile başlayan fonksiyonlar - yalnızca bileşenlerinizin üst seviyesinde ya da `kendi Hook'larınızda` çağrılabilir. Koşullar, döngüler veya diğer iç içe fonksiyonlar içinde Hook'ları çağırmak mümkün değildir. Hook'lar fonksiyonlardır, ancak bunları bileşeninizin ihtiyaçları hakkında koşulsuz deklarasyonlar olarak düşünmek faydalıdır. React özelliklerini, dosyanızın en üstünde modülleri "import" ettiğiniz gibi bileşeninizin en üstünde "kullanırsınız".
:::

### `useState`'in Anatomisi {/*anatomy-of-usestate*/}

`useState` fonksiyonunu çağırdığınızda, bu bileşenin bir şeyi hatırlamasını istediğinizi React'e bildirirsiniz:

```js
const [index, setIndex] = useState(0);
```

Bu durumda, React'ten `index`'i hatırlamasını istemiş olursunuz.



Bu çiftin adı genellikle `const [something, setSomething]` şeklindedir. Onu istediğiniz gibi adlandırabilirsiniz, ancak standartlar projeler arasında anlamayı kolaylaştırır.



`useState`'in tek argümanı, durum değişkeninizin **ilk değeridir**. Bu örnekte, `index`'in ilk değeri `useState(0)` ile `0` olarak ayarlanmıştır.

Bileşeniniz her yeniden render edildiğinde, `useState` size iki değeri içeren bir dizi döndürür:

1. **Durum değişkeni** (`index`) sakladığınız değer ile.
2. Durum değişkenini güncelleyebilecek ve React'i bileşeni tekrar render etmesi için tetikleyebilecek **durum ayarlayıcı fonksiyonu** (`setIndex`).

İşte bunun nasıl gerçekleştiğini gösterelim:

```js
const [index, setIndex] = useState(0);
```

1. **Bileşeniniz ilk kez render edilir.** `index` için ilk değer olarak `0` verdiğiniz için, `[0, setIndex]` döndürülür. React, `0`'ın en son durum değeri olduğunu hatırlar.
2. **Durumu güncelliyorsunuz.** Kullanıcı düğmeye tıkladığında `setIndex(index + 1)` çağrılır. `index` `0` olduğundan `setIndex(1)` olur. Bu, React 'e `index`'in artık `1` olduğunu hatırlamasını söyler ve bir yeniden render etmeyi tetikler.
3. **Bileşeninizin ikinci render'i.** React hala `useState(0)` görmektedir, ancak React *hatırlar* ki `index` değerini `1` olarak ayarlamıştınız, dolayısıyla `[1, setIndex]` döndürülür.
4. Ve böyle devam eder!