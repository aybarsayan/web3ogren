---
title: Değerleri Referanslarla İşaretleme
seoTitle: Değerleri Referanslarla İşaretleme - React
sidebar_position: 4
description: Bu doküman, Reactte değerleri ref ile nasıl yöneteceğiniz hakkında bilgi sağlar. Ref ve durum arasındaki farkları anlamanıza ve en iyi uygulamaları öğrenmenize yardımcı olur.
tags: 
  - React
  - ref
  - state
  - useRef
keywords: 
  - React
  - ref
  - state
  - useRef
---
Bir bileşenin bazı bilgileri "hatırlamasını" istiyorsanız, ancak bu bilgilerin `yeni render'lar tetiklemesini` istemiyorsanız, bir *ref* kullanabilirsiniz.





- Bileşeninize nasıl ref ekleyeceğinizi
- Bir ref'in değerini nasıl güncelleyeceğinizi
- Refnin durumdan nasıl farklı olduğunu
- Reflere nasıl güvenli bir şekilde kullanılacağını



## Bileşeninize bir ref ekleme {/*adding-a-ref-to-your-component*/}

Bileşeninize bir ref eklemek için React'ten `useRef` Hook'unu içe aktarabilirsiniz:

```js
import { useRef } from 'react';
```

Bileşeninizin içinde, `useRef` Hook'unu çağırın ve referanslamak istediğiniz başlangıç değerini yalnızca tek argüman olarak geçirin. Örneğin, işte `0` değerine bir ref:

```js
const ref = useRef(0);
```

`useRef`, şöyle bir nesne döndürür:

```js
{ 
  current: 0 // useRef'e geçirdiğiniz değer
}
```



O ref'in geçerli değerine `ref.current` özelliği aracılığıyla erişebilirsiniz. Bu değer kasıtlı olarak değiştirilebilir, yani hem okuyabilir hem de yazabilirsiniz. Bu, React'in takip etmediği bileşeninizin bir tür gizli cebidir. (Bu, onu React'ın tek yönlü veri akışından "kaçış" haline getirir—daha fazlası aşağıda!)

Burada, bir düğme her tıkladığınızda `ref.current` değerini artıracak:



```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('Tıkladınız ' + ref.current + ' kez!');
  }

  return (
    <button onClick={handleClick}>
      Tıkla!
    </button>
  );
}
```



Ref, bir sayıya işaret eder, ancak `durum` gibi, bir dizeye, bir nesneye veya hatta bir işleve de işaret edebilirsiniz. Durumdan farklı olarak, ref, okuyup değiştirebileceğiniz `current` özelliğine sahip düz bir JavaScript nesnesidir.

**Bileşenin her artışta yeniden render edilmediğini** unutmayın. Durum gibi, React, re-renderlar arasında reffleri saklar. Ancak, durumu ayarlamak bileşeni yeniden render eder. Bir ref'i değiştirmek bunu yapmaz!

## Örnek: bir kronometre oluşturma {/*example-building-a-stopwatch*/}

Reflere ve duruma tek bir bileşende birleştirebilirsiniz. Örneğin, kullanıcının bir düğmeye basarak başlatabileceği veya durdurabileceği bir kronometre yapalım. Kullanıcının "Başla" düğmesine bastığı zamandan itibaren ne kadar zaman geçtiğini gösterebilmek için, "Başla" düğmesine ne zaman basıldığını ve o anki zamanı takip etmeniz gerekecek. **Bu bilgi render için kullanılır, bu yüzden bunu duruma koyacaksınız:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

Kullanıcı "Başla" butonuna bastığında, her 10 milisaniyede bir zamanı güncellemek için [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) kullanacaksınız:



```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Saymaya başla.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Her 10ms'de mevcut zamanı güncelle.
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Geçen zaman: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Başla
      </button>
    </>
  );
}
```



"Dur" butonuna basıldığında, mevcut intervalin iptal edilmesi gerekir, böylece `now` durum değişkenini güncellemeyi durdurur. Bunu yapmak için [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) çağırmanız gerekiyor, ancak kullanıcı "Başla" butonuna bastığında `setInterval` çağrısı tarafından daha önce döndürülen interval kimliğini vermeniz gerekiyor. Interval ID'sini bir yerde saklamanız gerekiyor. **Interval ID'si render için kullanılmadığı için, bunu bir ref içinde tutabilirsiniz:**



```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Geçen zaman: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Başla
      </button>
      <button onClick={handleStop}>
        Dur
      </button>
    </>
  );
}
```



Bir bilgi render için kullanılıyorsa, onu durumda tutun. Bir bilgi yalnızca olay işleyicileri tarafından gerektiğinde ve onu değiştirmek yeniden render gerektirmiyorsa, bir ref kullanmak daha verimli olabilir.

## Reflar ve durum arasındaki farklar {/*differences-between-refs-and-state*/}

Belki de refların durumdan daha "katı" görünmediğini düşünüyorsunuz—örneğin, onları değiştirebilirken her zaman bir durum ayarlama fonksiyonu kullanmanız gerekmiyor. Ancak çoğu durumda durumu kullanmak isteyeceksiniz. Reflar "kaçış" noktasıdır, sık kullanmanız gerekmeyecek. İşte durum ve reflar arasındaki karşılaştırma:

| refs                                                                                  | state                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` `{ current: initialValue }` döndürür                               | `useState(initialValue)` bir durum değişkenin mevcut değerini ve bir durum ayarlama fonksiyonu ( `[value, setValue]`) döndürür |
| Değiştirildiğinde yeniden render tetiklemez.                                           | Değiştirildiğinde yeniden render tetikler.                                                                                |
| Değiştirilebilir—`current` değerini render işleminden dışarıda değiştirebilir ve güncelleyebilirsiniz. | "Değiştirilemez"—durum değişkenlerini değiştirmek için durum ayarlama fonksiyonunu kullanmalısınız, yeniden render için sıraya alır. |
| Render sırasında `current` değerini okumamalı (veya yazmamalısınız). | Durum her zaman okunabilir. Ancak, her render'ın kendi `snapshot` durumu vardır ve değişmez.

İşte durumla uygulanan bir karşı hesaplama düğmesi:



```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      {count} kez tıkladınız
    </button>
  );
}
```



`count` değeri görüntüleneceği için, bu değer için bir durum değeri kullanmak mantıklıdır. Sayaç değeri `setCount()` ile ayarlandığında, React bileşeni yeniden render eder ve ekran yeni sayımı yansıtacak şekilde güncellenir.

Eğer bunu bir ref ile uygulamaya çalışırsanız, React bileşeni asla yeniden render etmeyecek, bu yüzden sayım değiştiğini asla göremezsiniz! Bu düğmeye tıklamanın **metnini güncellemediğini** görün:



```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // Bu, bileşeni yeniden render etmez!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      {countRef.current} kez tıkladınız
    </button>
  );
}
```



Bu nedenle, render sırasında `ref.current` okumak, güvenilmez koda yol açar. Bunu istiyorsanız, durumu kullanın.



#### useRef nasıl çalışır? {/*how-does-use-ref-work-inside*/}

Her ne kadar hem `useState` hem de `useRef` React tarafından sağlansa da, prensip olarak `useRef`, `useState` üzerine _uygulanabilir_. React içinde `useRef`'in şu şekilde uygulanmış olduğunu hayal edebilirsiniz:

```js
// React içinde
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

İlk render sırasında `useRef`, `{ current: initialValue }` döndürür. Bu nesne React tarafından saklanır, böylece bir sonraki render'da aynı nesne döndürülür. Bu örnekte durum ayarlayıcısının kullanılmadığını unutmayın. Çünkü `useRef` her zaman aynı nesneyi döndürmelidir!

React, pratikte yeterince yaygın olduğu için optimize edilmiş bir `useRef` sürümü sağlar. Ancak, bunu bir ayarlayıcı olmadan bir durum değişkeni olarak düşünebilirsiniz. Nesne yönelimli programlamaya aşina iseniz, reffler, örnek alanlarını hatırlatabilir—ama `this.something` yerine `somethingRef.current` yazarsınız.



## Reflar ne zaman kullanılır? {/*when-to-use-refs*/}

Genellikle, bileşeninizin React dışına "adım atması" ve dış API'ler ile iletişim kurması gerektiğinde bir ref kullanırsınız—genellikle bileşenin görünümünü etkilemeyecek bir tarayıcı API'si. İşte bu nadir durumlardan bazıları:

- [timeout ID'lerini](https://developer.mozilla.org/docs/Web/API/setTimeout) saklamak
- [DOM elemanlarını](https://developer.mozilla.org/docs/Web/API/Element) saklamak ve bunlarla manipüle etmek, bunu `bir sonraki sayfada` ele alıyoruz
- JSX'i hesaplamak için gerekli olmayan diğer nesneleri saklamak.

Bileşeniniz bir değeri saklaması gerekiyorsa, ancak bu durum renderlama mantığını etkilemiyorsa, reffleri seçin.

## Reflar için en iyi uygulamalar {/*best-practices-for-refs*/}

Bu ilkeleri takip ederek, bileşenlerinizi daha öngörülebilir hale getirebilirsiniz:

- **Refları bir kaçış noktası olarak değerlendirin.** Reflar, dış sistemler veya tarayıcı API'leri ile çalışırken yararlıdır. Uygulamanızın çoğu mantığı ve veri akışı refflere dayanıyorsa, yaklaşımınızı yeniden gözden geçirmeniz gerekebilir.
- **Render sırasında `ref.current`'i okumayın veya yazmayın.** Render sırasında bazı bilgilere ihtiyaç varsa, bunun yerine `durumu` kullanın. React, `ref.current` değiştiğinde ne zaman olduğunu bilmediği için, render sırasında okumak bile bileşeninizin davranışını tahmin edilmesi zor hale getirir. (Bunun tek istisnası `if (!ref.current) ref.current = new Thing()` gibi kodlardır, bu sadece ilk render sırasında reffü bir kez ayarlar.)

React durumunun sınırlamaları, reffler için geçerli değildir. Örneğin, durum her render için `anlık görüntü` gibi davranır ve `senkronize olarak güncellenmez.` Ancak ref'in mevcut değeri değiştirildiğinde hemen değişir:

```js
ref.current = 5;
console.log(ref.current); // 5
```

Bunun nedeni, **ref'in kendisinin düz bir JavaScript nesnesi** olması ve bu nedenle böyle davranmasıdır.

Bir ref ile çalışırken, `değişimi önlemekten` endişelenmenize gerek yoktur. Değiştirdiğiniz nesne renderlama için kullanılmadığı sürece, React ne yaptığınızla ilgilenmez.

## Reflar ve DOM {/*refs-and-the-dom*/}

Bir ref'i herhangi bir değere işaret edebilirsiniz. Ancak, bir ref'in en yaygın kullanım durumu, bir DOM elemanına erişim sağlamaktır. Örneğin, bir girişi programlı olarak odaklamak isterseniz oldukça kullanışlıdır. JSX'te bir `ref` özniteliğine bir ref geçirdiğinizde, `` gibi, React, ilgili DOM elemanını `myRef.current` içerisine yerleştirir. Eleman DOM'dan kaldırıldığında, React `myRef.current` değerini `null` olarak günceller. Bunu `Refs ile DOM'u Manipüle Etmekte` daha fazla okuyabilirsiniz.



- Reflar, render için kullanılmayan değerlere tutunmanın bir kaçış noktasıdır. Sık ihtiyaç duymazsınız.
- Bir ref, okumak veya ayarlamak için erişebileceğiniz `current` adlı tek bir özellik içeren düz bir JavaScript nesnesidir.
- `useRef` Hook'unu çağırarak React'ten bir ref isteyebilirsiniz.
- Durum gibi, reffler bileşenin yeniden renderları arasında bilgileri korumanıza olanak tanır.
- Durumdan farklı olarak, ref'in `current` değerini ayarlamak, yeniden render tetiklemez.
- Render sırasında `ref.current`'i okumayın veya yazmayın. Bu, bileşeninizi tahmin edilemez hale getirir.





#### Bozuk bir sohbet girişini düzeltin {/*fix-a-broken-chat-input*/}

Bir mesaj yazın ve "Gönder"e tıklayın. "Gönderildi!" uyarısını görmeden önce üç saniyelik bir gecikme olduğunu fark edeceksiniz. Bu gecikme sırasında, "Geri al" düğmesini görebilirsiniz. Bu "Geri al" düğmesi, "Gönderildi!" mesajının görünmesini önlemek için tasarlanmıştır. Bu, `handleSend` sırasında saklanan timeout ID'si için [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) çağrısı yaparak yapılır. Ancak, "Geri al" tıklandığında, "Gönderildi!" mesajı hala görünür. Neden çalışmadığını bulup düzeltin.



`let timeoutID` gibi yerel değişkenler re-rendurations arasında "hayatta kalmaz", çünkü her değişim, bileşeninizi (ve değişkenlerini) sıfırdan baştan başlatır. Timeout ID'sini başka bir yerde saklasanız mı?





```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Gönderildi!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Gönderiliyor...' : 'Gönder'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Geri Al
        </button>
      }
    </>
  );
}
```





Bileşeniniz her yeniden render olduğunda (durum ayarladığınızda olduğu gibi), tüm yerel değişkenler sıfırdan başlatılmaktadır. Bu, timeout ID'sini yerel bir değişkende, örneğin `timeoutID` içinde saklayamazsınız ve başka bir olay işleyicisinin gelecekte bunu "görmesini" bekleyemezsiniz. Bunun yerine, bunu bir ref içinde saklayın, böylece React, yeniden renderlar arasında onu koruyacaktır.



```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Gönderildi!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Gönderiliyor...' : 'Gönder'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Geri Al
        </button>
      }
    </>
  );
}
```






#### Yeniden render edilmeyen bir bileşeni düzeltin {/*fix-a-component-failing-to-re-render*/}

Bu düğme "Açık" ve "Kapalı" arasında geçiş yapıyor olmalı. Ancak, her zaman "Kapalı" olarak gözüküyor. Bu kodda ne yanlış? Düzeltin.



```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'Açık' : 'Kapalı'}
    </button>
  );
}
```





Bu örnekte, ref'in mevcut değeri render çıktısını hesaplamak için kullanılıyor: `{isOnRef.current ? 'Açık' : 'Kapalı'}`. Bu, bu bilginin ref içerisinde olmaması ve durumla tutulması gerektiği anlamına gelir. Düzeltmek için, ref'i kaldırın ve durumu kullanın:



```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'Açık' : 'Kapalı'}
    </button>
  );
}
```





#### Debouncing'i düzeltin {/*fix-debouncing*/}

Bu örnekte, tüm düğme tıklama işlemleri ["debounced."](https://redd.one/blog/debounce-vs-throttle) Bunu ne anlama geldiğini görmek için, düğmelerden birine basın. Mesajın bir saniye sonra göründüğünü fark edin. Mesaja tıklarsanız, zamanlayıcı sıfırlanır. Yani aynı düğmeye hızlıca birden çok kez basmaya devam ederseniz, mesaj bir saniye *sonra* görünür.

Bu örnek çalışıyor ama tam olarak beklendiği gibi değil. Düğmeler bağımsız değil. Problemi görmek için bir butona tıklayın ve hemen ardından başka bir butona tıklayın. Bir gecikme sonra her iki düğmenin mesajlarının da görünmesini beklerdiniz. Ama sadece son butonun mesajı görünür. İlk butonun mesajı kaybolur.

Düğmeler neden birbirleriyle interferans yapıyor? Sorunu bulup düzeltin.



Son timeout ID değişkeni, tüm `DebouncedButton` bileşenleri arasında paylaşılmaktadır. Bu nedenle, bir düğmeye tıkladığınızda bir diğer düğmenin zaman aşımı sıfırlanmaktadır. Her düğme için ayrı bir zaman aşımı ID'si saklayabilir misiniz?





```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Uzay gemisi fırlatıldı!')}
      >
        Uzay gemisini fırlat
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Çorba kaynadı!')}
      >
        Çorbayı kaynat
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Ninni söylendi!')}
      >
        Ninni söyler
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```





`timeoutID` gibi bir değişken, tüm bileşenler arasında paylaşılmaktadır. Bu, ikinci düğmeye tıklamanın ilk düğmenin bekleyen zaman aşımını sıfırlamasına neden olur. Bunu düzeltmek için, her butonun kendi referansında zaman aşımını tutun. İki butona hızlıca tıkladığınızda her iki mesajı da göreceksiniz.



```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Uzay gemisi fırlatıldı!')}
      >
        Uzay gemisini fırlat
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Çorba kaynadı!')}
      >
        Çorbayı kaynat
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Ninni söylendi!')}
      >
        Ninni söyler
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```