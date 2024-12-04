---
title: Etkileri Kaldırma Bağımlılıkları
seoTitle: Etkileri Kaldırma Bağımlılıkları - Geliştirici Kılavuzu
sidebar_position: 4
description: Bu kılavuz, Reactteki etkilerinizden gereksiz bağımlılıkları nasıl gözden geçirip kaldıracağınızı anlatmaktadır. Elde edeceğiniz bilgilerle, etkilerinizin verimliliğini artırabilirsiniz.
tags: 
  - React
  - etkiler
  - bağımlılıklar
  - geliştirme
keywords: 
  - React
  - etkiler
  - bağımlılıklar
  - linter
---
Bir Efekt yazdığınızda, linter, etkilerinizin bağımlılık listesindeki her reaktif değeri (props ve state gibi) içerdiğinizi doğrular. Bu, Efektinizin bileşeninizin en son props ve state'i ile senkronize kalmasını sağlar. Gereksiz bağımlılıklar, Efektinizin çok sık çalışmasına veya hatta sonsuz bir döngü oluşturmasına neden olabilir. Bu kılavuzu izleyerek etkilerinizden gereksiz bağımlılıkları gözden geçirip kaldırabilirsiniz.





- Sonsuz Efekt bağımlılık döngülerini nasıl çözebilirsiniz
- Bir bağımlılığı kaldırmak istediğinizde ne yapmalısınız
- Efektinizden bir değeri "tepki" vermeden nasıl okuyabilirsiniz
- Nesne ve fonksiyon bağımlılıklarını nasıl ve neden kaçınmalısınız
- Bağımlılık linter'ını bastırmanın neden tehlikeli olduğu ve bunun yerine ne yapmalısınız



## Bağımlılıklar koda uymalıdır {/*dependencies-should-match-the-code*/}

Bir Efekt yazdığınızda, önce Efektinizin ne yapmasını istediğinizi `başlatmak ve durdurmak` belirtiyorsunuz:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
}
```

Sonra, Efekt bağımlılıklarını boş bırakırsanız (`[]`), linter doğru bağımlılıkları önerir:



```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Hata burada düzeltin!
  return <h1>{roomId} odasına hoş geldiniz!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="müzik">müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama, sunucuya bağlanır
  return {
    connect() {
      console.log('✅ "' + roomId + '" odasına ' + serverUrl + ' üzerinden bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" odasından ' + serverUrl + ' üzerinden bağlantı kesildi.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```



Linter'ın söylediğine göre doldurun:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Tüm bağımlılıklar belirtildi
  // ...
}
```

`Etkinlikler "reaktif değerlere" tepki verir.` `roomId` reaktif bir değerdir (yeniden render sırasında değişebilir), bu nedenle linter, bunu bir bağımlılık olarak belirttiğinizi doğrular. `roomId` farklı bir değer alırsa, React Efektinizi yeniden senkronize eder. Bu, sohbetin seçilen odaya bağlı kalmasını ve açılır menüye "tepki" vermesini sağlar:



```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>{roomId} odasına hoş geldiniz!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="müzik">müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama, sunucuya bağlanır
  return {
    connect() {
      console.log('✅ "' + roomId + '" odasına ' + serverUrl + ' üzerinden bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" odasından ' + serverUrl + ' üzerinden bağlantı kesildi.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```



### Bir bağımlılığı kaldırmak için, onun bağımlılık olmadığını kanıtlayın {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Efektinizin bağımlılıklarını "seçemeyeceğinizi" unutmayın. Efektinizin kodu tarafından kullanılan her reaktif değer bağımlılık listenizde belirtilmelidir. Bağımlılık listesi, çevresindeki kod tarafından belirlenir:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // Bu reaktif bir değerdir
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Bu Etki o reaktif değeri okur
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Bu nedenle o reaktif değeri, Efektinizin bağımlılığı olarak belirtmelisiniz
  // ...
}
```

`Reaktif değerler` arasında props ve bileşeninizin içinde doğrudan tanımlanmış tüm değişkenler ve fonksiyonlar bulunur. `roomId` bir reaktif değer olduğundan, bağımlılık listesinden onu kaldırmanız mümkün değildir. Linter buna izin vermez:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect'in eksik bir bağımlılığı var: 'roomId'
  // ...
}
```

Ve linter de haklı olur! `roomId`, zamanla değişebilir, bu da kodunuzda bir hata oluşturur.

**Bir bağımlılığı kaldırmak için, linter'a onun *bağımlı olması gerekmediğini* "kanıtlamalısınız."** Örneğin, `roomId`'yi bileşeninizin dışına taşıyarak onun reaktif olmadığını ve yeniden renderlerde değişmeyeceğini kanıtlayabilirsiniz:

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'müzik'; // Artık reaktif bir değer değil

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Tüm bağımlılıklar belirtilmiştir
  // ...
}
```

Artık `roomId` reaktif bir değer olmadığından (ve yeniden render sırasında değişmeyeceğinden), artık bir bağımlılık olması gerekmiyor:



```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'müzik';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>{roomId} odasına hoş geldiniz!</h1>;
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama, sunucuya bağlanır
  return {
    connect() {
      console.log('✅ "' + roomId + '" odasına ' + serverUrl + ' üzerinden bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" odasından ' + serverUrl + ' üzerinden bağlantı kesildi.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```



Bu nedenle artık [boş (`[]`) bir bağımlılık listesi belirtebilirsiniz.](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) Efektiniz, artık herhangi bir reaktif değere bağlı değildir, dolayısıyla bileşenin props veya state değiştiğinde yeniden çalışması gerekmez.

### Bağımlılıkları değiştirmek için, kodu değiştirin {/*to-change-the-dependencies-change-the-code*/}

Çalışma akışınızda bir desen fark etmiş olmalısınız:

1. Önce, Efektinizin veya reaktif değerlerinizin nasıl tanımlandığının kodunu **değiştirirsiniz.**
2. Sonra, linter'ı takip eder ve **değiştirdiğiniz kodla eşleşecek şekilde bağımlılıkları ayarlarsınız.**
3. Bağımlılık listesinden memnun değilseniz, **ilk adıma geri dönersiniz** (ve tekrar kodu değiştirirsiniz).

Son kısım önemlidir. **Bağımlılıkları değiştirmek istiyorsanız, önce çevreleyen kodu değiştirin.** Bağımlılık listesini, `Etkinliğinizin kodu tarafından kullanılan tüm reaktif değerlerin bir listesi` olarak düşünebilirsiniz. O listeye ne koyacağınızı *seçmezsiniz*. Liste, *kodunuzu tanımlar*. Bağımlılık listesini değiştirmek için, kodu değiştirin.

Bu, bir denklemi çözmek gibi hissedebilir. Bir amaçla başlayabilirsiniz (örneğin, bir bağımlılığı kaldırmak), ve o amaca uygun kodu "bulmanız" gerekir. Herkesin denklemleri çözmekten hoşlandığını söyleyemeyiz, aynı şey Etki yazmak için de geçerli! Neyse ki, aşağıda deneyebileceğiniz yaygın tariflerin bir listesi vardır.



Eğer mevcut bir kod tabanınız varsa, linter'ı bu şekilde bastıran bazı Etkileriniz olabilir:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Linter'ı bu şekilde bastırmaktan kaçının:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Bağımlılıklar kodla eşleşmediğinde, hata oluşturma riski çok yüksektir.** Linter'ı bastırarak, Etkinliğinizin bağımlı olduğu değerler hakkında React'a "yalan söylüyorsunuz".

Bunun yerine, aşağıdaki teknikleri kullanın.





#### Bağımlılık linter'ını bastırmanın bu kadar tehlikeli olmasının nedeni nedir? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Linter'ı bastırmak, bulması ve düzeltmesi zor çok sezgisel olmayan hatalara yol açar. İşte bir örnek:



```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
    setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Sayaç: {count}
        <button onClick={() => setCount(0)}>Sıfırla</button>
      </h1>
      <hr />
      <p>
        Her saniye, artırmak için:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```



Diyelim ki bu Etkiyi "yalnızca montajda" çalıştırmak istiyorsunuz. Boş (`[]`) bağımlılıkların bunu yaptığını duydunuz, bu nedenle linter'ı görmezden gelip `[]` bağımlılıklarını zorla belirttiniz.

Bu sayacın her saniye butonlarla ayarlanabilir miktarda artması gerekiyordu. Ancak, bu Etkinliğin hiçbir şeye bağlı olmadığını React'a "yalan söylediğiniz" için, React başlangıç render'ındaki `onTick` fonksiyonunu sürekli kullanır. `O render sırasında,` `count` `0` ve `increment` `1` idi. İşte bu yüzden `onTick` from o render her saniye `setCount(0 + 1)` çağrısını yapar ve sürekli olarak `1` görüyorsunuz. Böyle hatalar, birden fazla bileşen boyunca yayıldığında daha zor düzelir.

Linter'ı bastırmaktan her zaman daha iyi bir çözüm vardır! Bu kodu düzeltmek için, `onTick`'i bağımlılık listesine eklemeniz gerekir. (Interval'ün yalnızca bir kez ayarlandığından emin olmak için, `onTick'i bir Etkinlik Olayı yapın.`)

**Bağımlılık lint hata iletimini bir derleme hatası olarak değerlendirmeyi öneriyoruz. Eğer bastırmazsanız, bu tür hataları asla görmezsiniz.** Bu sayfanın geri kalanı, bu ve diğer durumlar için alternatifleri belgeler.



## Gereksiz bağımlılıkları kaldırma {/*removing-unnecessary-dependencies*/}

Her seferinde Efektinizin bağımlılıklarını kodu yansıtacak şekilde ayarladığınızda, bağımlılık listesine bakın. Bu bağımlılıklardan herhangi biri değiştiğinde Efektin yeniden çalıştırılması mantıklı mı? Bazen cevap "hayır"dır:

* Farklı koşullar altında Efektinizin *farklı bölümlerini* yeniden çalıştırmak isteyebilirsiniz.
* Bazı bağımlılıkların yalnızca en son değerini okuyup onun değişimlerine "tepki" vermek isteyebilirsiniz.
* Bir bağımlılık, bir nesne veya fonksiyon olduğu için *istenmeden* çok sık değişebilir.

Doğru çözümü bulmak için, Efektiniz hakkında birkaç soruyu cevaplamanız gerekecek. Hadi bunlara bakalım.

### Bu kod bir olay işleyiciye taşınmalı mı? {/*should-this-code-move-to-an-event-handler*/}

Düşünmeniz gereken ilk şey, bu kodun aslında bir Etki olup olmadığıdır.

Bir form düşünün. Gönderildiğinde, `submitted` durum değişkenini `true` olarak ayarlıyorsunuz. Bir POST isteği göndermeniz ve bir bildirim göstermeniz gerekiyor. Bu mantığı, `submitted`'in `true` olmasına "tepki veren" bir Etkinin içine koydunuz:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Kaçınılması gereken: Bir Etkinin içinde olay-bazlı mantık
      post('/api/register');
      showNotification('Başarıyla kaydedildi!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Daha sonra, bildirim mesajını mevcut temaya göre stil vermek istiyorsunuz, böylece mevcut temayı okursunuz. `theme` bileşen gövdesinde tanımlandığı için, bu reaktif bir değerdir, bu nedenle onu bir bağımlılık olarak ekliyorsunuz:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Kaçınılması gereken: Bir Etkinin içinde olay-bazlı mantık
      post('/api/register');
      showNotification('Başarıyla kaydedildi!', theme);
    }
  }, [submitted, theme]); // ✅ Tüm bağımlılıklar belirtildi

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Bunu yaptığınızda bir hata tanıtıyorsunuz. Diyelim ki, önce formu gönderiyorsunuz ve ardından Karanlık ve Aydınlık temaları arasında geçiş yapıyorsunuz. `theme` değiştiğinde, Etki yeniden çalışacak ve aynı bildirimi tekrar gösterecek!

**Buradaki sorun, aslında bu durumun bir Etki olmaması.** POST isteğini göndermek ve bildirimi göstermek, *formun gönderilmesine* yanıt vermek için isteğinizdir. Belirli bir etkileşim karşısında çalıştırmak için, o mantığı doğrudan ilgili olay işleyicisinde koyun:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ İyi: Olay-bazlı mantık olay işleyicilerinden çağrılır
    post('/api/register');
    showNotification('Başarıyla kaydedildi!', theme);
  }  

  // ...
}
```

Artık kod bir olay işleyicisinde bulunduğundan, reaktif değildir—bu nedenle yalnızca kullanıcı formu gönderdiğinde çalışır. `Olay işleyicileri ile Etkiler arasında seçim yapmak` ve `gereksiz Etkileri nasıl silebileceğinizi` hakkında daha fazla bilgi edinin.