---
title: Anlık Durum
seoTitle: React Durum Yönetimi
sidebar_position: 1
description: Durum değişkenlerinin nasıl çalıştığını, ayarlandığında yeniden render tetikleyip tetiklemediğini keşfedin. Etkileşimlerinizi doğru yönetmek için kritik ipuçları edinin.
tags: 
  - React
  - Durum Yönetimi
  - Bileşen
  - Geliştirme
keywords: 
  - React
  - Durum
  - Geliştirici
  - Bileşen
---
Durum değişkenleri, okuyup yazabileceğiniz normal JavaScript değişkenleri gibi görünebilir. Ancak durum daha çok bir anlık görüntü gibi davranır. Durumu ayarlamak, zaten sahip olduğunuz durum değişkenini değiştirmez, bunun yerine yeniden render'ı tetikler.





* Durum ayarlamanın yeniden render'ları nasıl tetiklediği
* Durumun ne zaman ve nasıl güncellendiği
* Durumun ayarlandıktan hemen sonra neden güncellenmediği
* Olay işleyicilerin durumu nasıl bir "anlık görüntü" olarak eriştiği



## Durum Ayarlama Yeniden Render'ları Tetikler {/*setting-state-triggers-renders*/}

Kullanıcı arayüzünüzü, tıklama gibi bir kullanıcı olayına doğrudan yanıt olarak değişiyormuş gibi düşünebilirsiniz. React'te bu, bu zihinsel modelden biraz farklı çalışır. Önceki sayfada, `durum ayarlamanın React'ten yeniden render talep ettiğini` gördünüz. Bu, bir arayüzün olaya tepki vermesi için *durumun güncellenmesi* gerektiği anlamına gelir.

Bu örnekte, "gönder" butonuna bastığınızda, `setIsSent(true)` React'e UI'yi yeniden render etmesini söyler:



```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Merhaba!');
  if (isSent) {
    return <h1>Mesajınız yolda!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Mesaj"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Gönder</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```



Butona tıkladığınızda olanlar:

1. `onSubmit` olay işleyici çalıştırılır.
2. `setIsSent(true)` `isSent`'i `true` olarak ayarlar ve yeni bir render kuyruğa alır.
3. React, yeni `isSent` değerine göre bileşeni yeniden render eder.

:::info
Durum ve render arasındaki ilişkiye daha yakından bakalım.
:::

## Render Zamanında Bir Anlık Görüntü Alır {/*rendering-takes-a-snapshot-in-time*/}

`"Render" işlemi`, React'in bileşeninizi çağırdığı anlamına gelir; bu, bir işlevdir. O işlevden dönen JSX, zaman içindeki UI'nin bir anlık görüntüsü gibidir. Props'ları, olay işleyicileri ve yerel değişkenleri, tümü **o render sırasında durumunu kullanarak** hesaplanmıştır.

:::note
Bir fotoğraf ya da film karesi gibi olmasa da, döndürdüğünüz UI "anlık görüntüsü" etkileşimlidir. Girdi yanıtında ne olacağının belirtildiği olay işleyicileri gibi mantığı içerir.
:::

React, bir bileşeni yeniden render ettiğinde:

1. React, işlevinizi tekrar çağırır.
2. İşleviniz, yeni bir JSX anlık görüntüsü döner.
3. React, ardından ekranı işlevinizin döndürdüğü anlık görüntü ile günceller.


    
    
    


Bir bileşenin hafızası olarak, durum, işleviniz döndükten sonra kaybolan normal bir değişken gibi değildir. Durum aslında React'in kendisinde, sanki bir rafın üzerinde yaşıyor gibi! React, bileşeninizi çağırdığında, size o belirli render için durumun bir anlık görüntüsünü verir. Bileşeniniz, bu render için hesaplanmış taze bir props ve olay işleyici seti ile JSX içinde bir UI anlık görüntüsü döner, tümü **o renderden elde edilen durum değerleri kullanılarak!**

:::tip
Bu çalışmanın nasıl olduğunu göstermek için küçük bir deney yapalım.
:::

Bu örnekte, "+3" butonuna tıkladığınızda sayacın üç kez artacağını bekleyebilirsiniz çünkü `setNumber(number + 1)` üç kez çağrılır.

"+3" butonuna tıkladığınızda ne olduğunu görün:



```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```



Dikkat edin ki `number` her tıklamada yalnızca bir kez artıyor!

:::warning
**Durumu ayarlamak, sadece *bir sonraki* render için değiştirir.** İlk render sırasında, `number` `0` idi. Bu, *o renderin* `onClick` işleyicisinde `number` değerinin hala `0` olduğu anlamına gelir, `setNumber(number + 1)` çağrıldıktan sonra bile:
:::

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Bu butonun tıklama işleyicisi React'e şunları söylemektedir:

1. `setNumber(number + 1)`: `number` `0` olduğu için `setNumber(0 + 1)`.
    - React, bir sonraki renderda `number`'ı `1` olarak değiştirmek için hazırlanır.
2. `setNumber(number + 1)`: `number` `0` olduğu için `setNumber(0 + 1)`.
    - React, bir sonraki renderda `number`'ı `1` olarak değiştirmek için hazırlanır.
3. `setNumber(number + 1)`: `number` `0` olduğu için `setNumber(0 + 1)`.
    - React, bir sonraki renderda `number`'ı `1` olarak değiştirmek için hazırlanır.

`setNumber(number + 1)`'i üç kez çağırmış olsanız bile, *bu renderin* olay işleyicisinde `number` her zaman `0`'dır, bu yüzden durumu `1` olarak üç kez ayarlarsınız. Bu nedenle, olay işleyiciniz tamamlandığında, React bileşeni `number` eşit `1` olacak şekilde yeniden render eder.

Kodunuzdaki durum değişkenlerini değerleriyle zihinsel olarak değiştirerek bu durumu görselleştirebilirsiniz. Çünkü `number` durum değişkeni *bu render* için `0` olduğundan, olay işleyicisi şöyle görünür:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Sonraki renderda, `number` `1`'dir, bu yüzden *o renderin* tıklama işleyicisi şöyle görünür:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

Bu, butona tekrar tıkladığınızda sayacın önce `2`, ardından `3` olacağı ve bu şekilde devam edeceği anlamına gelir.

## Zamana Göre Durum {/*state-over-time*/}

İyi, bu eğlenceliydi. Bu butona tıkladığınızda neyin uyarı vereceğini tahmin etmeye çalışın:



```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```



Eğer önceki değişim yöntemini kullanırsanız, uyarının "0" olduğunu tahmin edebilirsiniz:

```js
setNumber(0 + 5);
alert(0);
```

Ama uyarıyı bir zamanlayıcıya koyarsanız, böylece yalnızca _bileşen yeniden render edildikten sonra_ ateşlenirse? "0" mı yoksa "5" mi der? Bir tahminde bulunun!



```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```



Şaşırdınız mı? Eğer önceki değişim yöntemini kullanırsanız, uyarıya geçen durumun "anlık görüntüsünü" görebilirsiniz.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

React'te kayıtlı durum, uyarı çalıştığında değişmiş olabilir, ancak kullanıcı etkileşimi sırasında durumun anlık görüntüsü kullanılarak planlanmıştı!

:::tip
**Bir durum değişkeninin değeri bir render içinde asla değişmez,** hatta olay işleyicisinin kodu asenkron bile olsa. *O renderin* `onClick`'inde, `number` değeri, `setNumber(number + 5)` çağrıldıktan sonra bile `0` olmaya devam eder. Değeri, React'in UI'nin anlık görüntüsünü almadan önce "sabittir".
:::

Bu, olay işleyicilerinizi zamanlama hatalarına karşı daha az duyarlı hale getirir. Aşağıda beş saniyelik bir gecikme ile bir mesaj gönderen bir form örneği vardır. Bu senaryoyu hayal edin:

1. "Gönder" butonuna basıyorsunuz ve "Merhaba"yı Alice'e gönderiyorsunuz.
2. Beş saniyelik gecikme sona ermeden önce, "Kime" alanının değerini "Bob" olarak değiştiriyorsunuz.

Uyarının neyi göstermesini bekliyorsunuz? "Alice'e Merhaba dediniz" mi? Yoksa "Bob'a Merhaba dediniz" mi? Bildiklerinize dayanarak bir tahminde bulunun ve ardından bunu deneyin:



```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Merhaba');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
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



:::danger
**React, durum değerlerini bir renderin olay işleyicileri içinde "sabitlemektedir."** Kod çalışırken durumun değişip değişmediği konusunda endişelenmenize gerek yok.
:::

Ama yeniden render'dan önce en son durumu okumak istiyorsanız? `Durum güncelleyici işlevi` kullanmak isteyeceksiniz, bir sonraki sayfada detaylandırılacak!



* Durum ayarlamak, yeni bir render talep eder.
* React, durumu bileşeninizin dışında, sanki bir rafın üzerinde saklar.
* `useState` fonksiyonunu çağırdığınızda, React, o render için durumun bir anlık görüntüsünü verir.
* Değişkenler ve olay işleyicileri "yeniden render" sürekliliğini sağlamaz. Her render kendi olay işleyicilerine sahiptir.
* Her render (ve içindeki işlevler) her zaman o render için React'in verdiği durum anlık görüntüsünü "görmektedir."
* Olay işleyicilerinde durumu zihinsel olarak değiştirebilirsiniz, tıpkı render edilen JSX'e düşündüğünüz gibi.
* Geçmişte oluşturulan olay işleyicileri, oluşturuldukları renderdeki durum değerlerini taşır.





#### Trafik Işığını Uygulama {/*implement-a-traffic-light*/}

Buton tıklandığında değişen bir yaya ışığı bileşeni buradadır:



```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Değiştir: {walk ? 'Dur' : 'Yürü'}
      </button>
      <h1 style={{
        color: walk ? 'koyu yeşil' : 'koyu kırmızı'
      }}>
        {walk ? 'Yürü' : 'Dur'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```



Olay işleyicisinde bir `alert` ekleyin. Işık yeşil olduğunda ve "Yürü" dediğinde, butona tıklandığında "Dur sonraki" demelidir. Işık kırmızı olduğunda ve "Dur" dediğinde, butona tıklandığında "Yürü sonraki" demelidir.

:::note
`alert`'i `setWalk` çağrısından önce mi yoksa sonra mı koymanın bir anlamı var mı?
:::



Uyarınız şöyle görünmelidir:



```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Dur sonraki' : 'Yürü sonraki');
  }

  return (
    <>
      <button onClick={handleClick}>
        Değiştir: {walk ? 'Dur' : 'Yürü'}
      </button>
      <h1 style={{
        color: walk ? 'koyu yeşil' : 'koyu kırmızı'
      }}>
        {walk ? 'Yürü' : 'Dur'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```



`alert`'i `setWalk` çağrısından önce mi yoksa sonra mı koyduğunuz fark etmez. O render 'dan gelen `walk` değerinin sabit olduğu bir durumdur. `setWalk` çağrılması yalnızca bir sonraki render için durumu değiştirecektir, ancak önceki render'in olay işleyicisini etkilemeyecektir.

Bu satır, ilk başta karşıt bir mantık gibi görünebilir:

```js
alert(walk ? 'Dur sonraki' : 'Yürü sonraki');
```

Ama şöyle okunursa mantıklıdır: "Eğer trafik ışığı 'Şimdi Yürü' diyorsa, mesaj 'Dur sonraki' olmalıdır." Olay işleyicinizin içindeki `walk` değişkeni, o renderin `walk` değerine eşittir ve değişmez.

Doğru olduğunu doğrulamak için değişim yöntemini uygulayabilirsiniz. `walk` doğruysa, şunu elde edersiniz:

```js
<button onClick={() => {
  setWalk(false);
  alert('Dur sonraki');
}}>
  Değiştir: Dur
</button>
<h1 style={{color: 'koyu yeşil'}}>
  Yürü
</h1>
```

Bu nedenle "Dur'a Değiştir" butonuna tıkladığınızda `walk` değeri `false` olarak ayarlanmış bir render kuyruğuna girer ve "Dur sonraki" uyarısını verir.