---
title: Etkileşim Ekleme
seoTitle: Etkileşim Ekleme - React
sidebar_position: 1
description: Bu bölümde, etkileşimleri yöneten bileşenler yazmayı, durumlarını güncellemeyi ve zamanla farklı çıktılar göstermeyi öğreneceksiniz. Reactte durumun nasıl yönetileceğine dair temel bilgiler sunulmaktadır.
tags: 
  - React
  - durum
  - bileşen
  - kullanıcı etkileşimleri
keywords: 
  - React
  - durum
  - bileşen
  - olay işleyicileri
---
Ekrandaki bazı şeyler kullanıcı girdilerine yanıt olarak güncellenir. Örneğin, bir resim galerisine tıklamak aktif resmi değiştirir. React'te, zamanla değişen verilere *durum* denir. Durumu herhangi bir bileşene ekleyebilir ve gerektiğinde güncelleyebilirsiniz. Bu bölümde, etkileşimleri yöneten bileşenler yazmayı, durumlarını güncellemeyi ve zamanla farklı çıktılar göstermeyi öğreneceksiniz.





* `Kullanıcı başlatılan olayları nasıl yönetirsiniz`
* `Bileşenlerin durumu ile bilgileri nasıl "hatırlatabilirsiniz"`
* `React'in UI'yi iki aşamada nasıl güncellediğini`
* `Durumun neden hemen güncellenmediği`
* `Birden fazla durum güncellemesini nasıl sıraya alabilirsiniz`
* `Durumdaki bir nesneyi nasıl güncelleyebilirsiniz`
* `Durumdaki bir diziyi nasıl güncelleyebilirsiniz`



## Olaylara Yanıt Verme {/*responding-to-events*/}

React, JSX'nize *olay işleyicileri* eklemenizi sağlar. Olay işleyicileri, kullanıcı etkileşimlerine (tıklama, üzerine gelme, form girdilerine odaklanma vb.) yanıt olarak tetiklenecek kendi fonksiyonlarınızdır.

`` gibi yerleşik bileşenler yalnızca `onClick` gibi yerleşik tarayıcı olaylarını destekler. Ancak, kendi bileşenlerinizi de oluşturabilir ve olay işleyici prop'larına istediğiniz uygulama spesifik isimleri verebilirsiniz.

:::tip
Olay işleyicileriyle kullanıcı etkileşimlerine yanıt verirken, hangi etkileşimleri ele alacağınızı dikkatlice planlayın. Bu, kullanıcı deneyimini büyük ölçüde artırabilir.
:::



```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Oynatılıyor!')}
      onUploadImage={() => alert('Yükleniyor!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Film Oynat
      </Button>
      <Button onClick={onUploadImage}>
        Resim Yükle
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```





**`Olaylara Yanıt Verme`** konusunu okuyun, olay işleyicilerini nasıl ekleyeceğinizi öğrenin.



## Durum: Bir Bileşenin Hafızası {/*state-a-components-memory*/}

Bileşenlerin genellikle bir etkileşim sonucu ekranın ne olduğunu değiştirmesi gerekir. Formda yazmak, giriş alanını güncellemeli, bir resim karuseli üzerinde "sonraki" düğmesine tıklamak hangi resmin görüntüleneceğini değiştirmeli ve "satın al" düğmesine tıklamak bir ürünü alışveriş sepetine eklemelidir. Bileşenlerin "hatırlaması" gereken şeyler vardır: mevcut giriş değeri, mevcut resim, alışveriş sepeti. React'te, bu tür bileşen spesifik hafızaya *durum* denir.

Bir bileşene `useState` Hook'u ile durum ekleyebilirsiniz. *Hook'lar*, bileşenlerinizin React özelliklerini kullanmasına izin veren özel fonksiyonlardır (durum, bu özelliklerden biridir). `useState` Hook'u, bir durum değişkeni tanımlamanıza olanak tanır. Başlangıç durumunu alır ve iki değeri: mevcut durumu ve bunu güncellemenizi sağlayan bir durum ayarlayıcı fonksiyonu döner.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Bir resim galerisi nasıl kullanılacağını ve tıklamada durumu nasıl güncellediğini burada görebilirsiniz:



```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Sonraki
      </button>
      <h2>
        <i>{sculpture.name} </i>
        tarafından {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} / {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Gizle' : 'Göster'} detaylar
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Colvin öncelikle ön-Hispanik sembollerine göndermede bulunan soyut temalarıyla tanınmakta, bu devasa heykel, bir nöroşirurjiye saygı duruşu, en tanınmış kamusal sanat eserlerinden biridir.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'İki çapraz elin, parmaklarının uçlarında bir insan beynini narince tuttuğu bir bronz heykel.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'Bu devasa (75 ft. veya 23m) gümüş çiçek Buenos Aires\'te bulunmaktadır. Akşamları veya güçlü rüzgarlarda yapraklarını kapatma ve sabahları açma tasarımı yapılmıştır.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Yansıtıcı aynalı yapraklara ve güçlü stamenslere sahip devasa bir metalik çiçek heykeli.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson, eşitlik, sosyal adaletin yanı sıra insanlığın temel ve ruhsal nitelikleri ile ilgili takıntılarıyla tanınmıştır. Bu devasa (7ft veya 2,13m) bronz, onun "evrensel insanlık hissiyle dolu bir sembolik Siyah varlık" olarak tanımladığı şeyi temsil eder.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'Bir insan başını tasvir eden heykel, her zaman mevcut ve ciddi bir ifade verir. Sakinlik ve huzur yayar.'
}, {
  name: 'Moai',
  artist: 'Bilinmeyen Sanatçı',
  description: 'Paskalya Adası\'nda, erken Rapa Nui halkı tarafından yaratılmış 1.000 moai, yani mevcut anıtsal heykel vardır ve bazıları bunların kutsallaştırılmış ataları temsil ettiğine inanır.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Üç anıtsal taş büst, orantısız büyük kafalı ve ciddi yüz ifadelerine sahip.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nana\'lar zaferle dolu yaratıklardır, feminenlik ve annelik sembolleridir. Başlangıçta, Saint Phalle Nanas için kumaş ve bulunmuş nesneler kullanmış, daha sonra daha canlı bir etki elde etmek için polyester tanıtmıştır.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Renkli bir kostümle neşeyle dans eden bir kadın figürünün büyük bir mozaik heykeli.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'Bu soyut bronz heykel, Yorkshire Heykel Parkı\'nda bulunan Aile Serisi\'nin bir parçasıdır. Hepworth, dünyanın somut tasvirlerini oluşturmamayı seçti, ancak insanlardan ve manzaralardan ilham alan soyut formlar geliştirdi.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Birbiri üstüne yerleştirilmiş üç öğeden oluşan, insan figürünü hatırlatan bir uzun heykel.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Dört nesil ahşap oymacısından inen Fakeye'nin çalışmaları, geleneksel ve çağdaş Yoruba temalarını harmanlamaktadır.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Desenlerle süslenmiş bir ata odaklı, yüzü dikkatli bir savaşçının detaylı ahşap heykeli.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow, gençliğin ve güzelliğin kırılganlığı ve geçiciliğini bir metafor olarak parçalanmış beden heykelleriyle tanınmaktadır. Bu heykel, üst üste monte edilmiş, her biri yaklaşık beş fit (1,5m) yüksekliğinde, çok gerçekçi bir şekilde tasvir edilmiş iki büyük karnı betimler.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'Hepsinin çok farklı kıvrımlar olarak tasvir edildiği, klasik heykellerdeki karnlardan oldukça farklı bir görünüm sunar.'
}, {
  name: 'Terracotta Army',
  artist: 'Bilinmeyen Sanatçı',
  description: 'Terracotta Ordusu, Çin\'in ilk İmparatoru Qin Shi Huang\'ın ordularını tasvir eden terrakotta heykellerin bir koleksiyonudur. Ordu 8,000\'den fazla askeri, 130 savaş arabası ve 520 at ile 150 süvari atını içermektedir.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: 'Her biri benzersiz bir yüz ifadesine ve zırha sahip 12 terracotta heykel.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson, nesneleri New York City atıklarından toplamakla biliniyordu ve bunları daha sonra anıtsal yapılar haline getirmek için bir araya getirmekteydi. Bu çalışmasında, yatak direği, jonglör sopası ve oturma parçası gibi çeşitli parçalar kullanarak, bunları nailing ve yapıştırarak, Kubizm’in mekansal ve biçimsel soyutlamasının etkisini yansıtan kutulara monte etmektedir.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Bireysel öğelerin başlangıçta ayırt edilemediği mat siyah bir heykel.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar, geleneksel ve modern, doğal ve endüstriyel olanı birleştiriyor. Sanatı, insan ve doğa arasındaki ilişkiye odaklanıyor. Çalışmaları soyut ve anlamsal bakımdan etkileyici olarak tanımlanıyor ve "beklenmedik malzemelerin ince sentezi" şeklinde ifade ediliyor.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Bir beton duvara monte edilmiş, yere inen ince tel benzeri heykel. Hafif görünüyor.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'Taipei Hayvanat Bahçesi, suyun altında oyun oynayan hipopotamları içeren bir Hippo Meydanı hazırlattı.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Yüzme yapıyormuş gibi görünerek, kaldırımlardan ortaya çıkan bronz hipopotam heykeller grubu.'
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





**`Durum: Bir Bileşenin Hafızası`** konusunu okuyun, bir değeri nasıl hatırlayacağınızı ve etkileşimde nasıl güncelleyeceğinizi öğrenin.



## Render ve Taahhüt {/*render-and-commit*/}

Bileşenleriniz ekranda görüntülenmeden önce, React tarafından render edilmeleri gerekir. Bu süreçteki adımları anlamak, kodunuzun nasıl çalıştığını düşünmenize ve davranışını açıklamanıza yardımcı olacaktır.

Bileşenlerinizi mutfakta lezzetli yemekler hazırlayan aşçılar olarak hayal edin. Bu senaryoda, React, müşterilerden siparişleri alan ve siparişlerini getiren garson gibidir. Kullanıcı arayüzü isteme ve servis etme sürecinin üç aşaması vardır:

1. **Render'ı Tetikleme** (yemek siparişini mutfağa iletmek)
2. **Bileşeni Render Etme** (mutfakta siparişi hazırlamak)
3. **DOM'a Taahhüt Etme** (siparişi masaya yerleştirmek)


  
  
  




**`Render ve Taahhüt`** konusunu okuyun, bir UI güncelleme yaşam döngüsünü öğrenin.



## Durum olarak Anlık Görüntü {/*state-as-a-snapshot*/}

Normal JavaScript değişkenlerinin aksine, React durumu daha çok anlık görüntü gibi davranır. Durumu ayarlamak, zaten sahip olduğunuz durum değişkenini değiştirmez, aksine yeniden render tetikler. Bu başta şaşırtıcı olabilir!

```js
console.log(count);  // 0
setCount(count + 1); // 1 ile yeniden render iste
console.log(count);  // Hala 0!
```

Bu davranış ince hatalardan kaçınmanıza yardımcı olur. İşte küçük bir sohbet uygulaması. Önce "Gönder"e tıklayıp *sonra* alıcıyı Bob olarak değiştirdiğinizde ne olacağını tahmin etmeye çalışın. Beş saniye sonra hangi isimin `alert` içinde görünecek?



```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Merhaba');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`Siz ${message} dediniz ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Kime:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Mesaj"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Gönder</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```





**`Anlık Görüntü Olarak Durum`** konusunu okuyun, durumun neden "sabit" ve olay işleyicileri içinde değişmeyen bir görüntü gibi göründüğünü anlayın.



## Bir Dizi Durum Güncellemesini Sıraya Alma {/*queueing-a-series-of-state-updates*/}

Bu bileşen hatalı: "+3" tuşuna tıkladığınızda, puan yalnızca bir kez artar.



```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Puan: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```



**`Anlık Görüntü Olarak Durum`** konusunu okuyun, bu durumun neden böyle olduğunu açıklamaktadır. Durumu ayarlamak, yeni bir yeniden render isteğini tetikler, ancak zaten çalışan kodda durumu değiştirmez. Bu nedenle `score`, `setScore(score + 1)` çağrısından hemen sonra `0` olmaya devam eder.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

Bu durumu düzeltmek için, durumu ayarlarken bir *güncelleyici fonksiyonu* geçirebilirsiniz. `setScore(score + 1)` yerine `setScore(s => s + 1)` kullanmanın, "+3" düğmesini nasıl düzelttiğine dikkat edin. Bu, birden fazla durum güncellemelerini sıraya almanıza olanak tanır.



```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Puan: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```





**`Bir Dizi Durum Güncellemesini Sıraya Alma`** konusunu okuyun, durum güncellemelerinin nasıl sıralanacağını öğrenmek için.