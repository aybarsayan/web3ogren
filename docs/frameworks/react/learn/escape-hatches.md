---
title: Kaçış Hızları
seoTitle: React Dışında Etkileşim için Kaçış Hızları
sidebar_position: 4
description: Bu bölümde, React dışındaki sistemlerle etkileşim kurmak için kaçış hızlarını öğrenin. Refs, Effects ve daha fazlasını keşfedin.
tags: 
  - React
  - Kullanıcı Arayüzü
  - Bileşenler
  - Geliştirme
keywords: 
  - React
  - Refs
  - Effects
  - Bileşenler
  - Kullanıcı Arayüzü
---
Bileşenlerinizin, React dışındaki sistemlerle kontrol etmesi ve senkronize olması gerekebilir. Örneğin, bir girişi tarayıcı API'si kullanarak odaklamanız, React olmadan uygulanan bir video oynatıcıda oynatmak ve duraklatmak ya da uzak bir sunucudan mesaj dinlemek gerekebilir. Bu bölümde, React'tan "dışarı adım atmanızı" sağlayan kaçış hızlarını öğreneceksiniz. Uygulama mantığınız ve veri akışınızın çoğu bu özelliklere dayanmaz.





* `Yeniden render yapmadan bilgileri nasıl "hatırlarsınız"`
* `React tarafından yönetilen DOM öğelerine nasıl erişilir`
* `Bileşenleri dış sistemlerle nasıl senkronize edersiniz`
* `Bileşenlerinizden gereksiz Effects'i nasıl kaldırırsınız`
* `Bir Effect'in yaşam döngüsünün, bir bileşenin yaşam döngüsünden nasıl farklı olduğunu`
* `Bazı değerlerin Effects'i yeniden tetiklemesini nasıl önlersiniz`
* `Bileşenler arasında mantığı nasıl paylaşabilirsiniz`



## Referans değerleri ile refs {/*referencing-values-with-refs*/}

Bir bileşenin bazı bilgileri "hatırlamasını" istediğinizde, ancak bu bilgilerin `yeni render'ları tetiklemesini` istemediğinizde, bir *ref* kullanabilirsiniz:

```js
const ref = useRef(0);
```

Durum gibi, refs yeniden render'lar arasında React tarafından korunur. Ancak, durum ayarlamak bir bileşeni yeniden render eder. Bir ref'i değiştirmek etmez! O ref'in mevcut değerine `ref.current` özelliği aracılığıyla erişebilirsiniz.



```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```



Bir ref, React'ın takip etmediği bileşeninizin gizli bir cebi gibidir. Örneğin, refs'i [timeout kimliklerini](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [DOM öğelerini](https://developer.mozilla.org/en-US/docs/Web/API/Element) ve bileşenin render çıktısını etkilemeyen diğer nesneleri depolamak için kullanabilirsiniz.



**`Referans Değerleri ile Refs`** sayfasını okuyarak refs'i nasıl kullanacağınızı öğrenin.



## DOM'u refs ile manipüle etme {/*manipulating-the-dom-with-refs*/}

React, render çıktınızı karşılamak için DOM'u otomatik olarak günceller, bu nedenle bileşenlerinizin bunu manipüle etmesi çok sık gerekmez. Ancak, bazen React tarafından yönetilen DOM öğelerine erişmeniz gerekebilir; örneğin, bir düğmeye tıklamak, girişi odaklamak, ona kaydırmak veya boyutunu ve konumunu ölçmek için. React'te bunları yapmanın yerleşik bir yolu yoktur, bu nedenle DOM düğümüne bir ref'e ihtiyacınız olacaktır. Örneğin, düğmeye tıklamak girişi bir ref kullanarak odaklar:



```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```





**`Refs ile DOM'u Manipüle Etme`** sayfasını okuyarak React tarafından yönetilen DOM öğelerine nasıl erişeceğinizi öğrenin.



## Effects ile Senkronize Olma {/*synchronizing-with-effects*/}

Bazı bileşenlerin dış sistemlerle senkronize olması gerekir. Örneğin, bir React durumu temelinde bir React dışı bileşeni kontrol etmek, bir sunucu bağlantısı kurmak ya da bir bileşen ekranında belirdiğinde bir analiz kaydı göndermek isteyebilirsiniz. Olay işleyicilerinin belirli olayları ele almasına izin vermesinin aksine, *Effects* bazı kodları render işleminden sonra çalıştırmanıza olanak tanır. Bunları bileşeninizi React dışındaki bir sistemle senkronize etmek için kullanın.

Oynat/Durdur düğmesine birkaç kez basın ve video oynatıcının `isPlaying` prop değeriyle nasıl senkronize kaldığını görün:



```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```



Birçok Effect de kendinden "temizlenir". Örneğin, bir sohbet sunucusuna bağlantı kuran bir Effect, React'a bileşeninizi o sunucudan nasıl bağlantısının kesileceğini anlatan bir *temizleme işlevi* döndürmelidir:



```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Gerçek bir uygulama aslında sunucuya bağlanacak
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```



Geliştirme aşamasında, React, Effect'inizi bir kez daha hemen çalıştıracak ve temizleyecektir. Bu, temizlik işlevini uygulamayı unutmadığınızdan emin olmak içindir.



**`Effects ile Senkronize Olma`** sayfasını okuyarak bileşenleri dış sistemlerle nasıl senkronize edeceğinizi öğrenin.



## Bir Etkili Olmayı Gerektirmeyebilir {/*you-might-not-need-an-effect*/}

Effects, React paradigmalarından bir kaçış kapısıdır. Bileşenlerinizi dış bir sistemle senkronize etmenizi sağlar. Dış bir sistem dahil değilse (örneğin, bazı props veya durum değiştiğinde bir bileşenin durumunu güncellemek istiyorsanız) bir Effect'e ihtiyacınız olmamalıdır. Gereksiz Effects'i kaldırmak, kodunuzu daha okunaklı, daha hızlı çalışır hale getirir ve hata olasılığını azaltır.

Effects'e ihtiyaç duymadığınız iki yaygın durum vardır:
- **Verileri render için dönüştürmek üzere Effects kullanmanıza gerek yoktur.**
- **Kullanıcı olaylarını yönetmek üzere Effects kullanmanıza gerek yoktur.**

Örneğin, başka bir duruma dayalı olarak bazı durumları ayarlamak için bir Effect'e ihtiyacınız yoktur:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Kaçının: gereksiz durum ve gereksiz Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Bunun yerine, mümkün olduğunca render sırasında hesaplayın:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ İyi: render sırasında hesaplandı
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

Ancak, dış sistemlerle senkronize olmak için *Effects*'e ihtiyacınız vardır. 



**`Bir Etkili Olmayı Gerektirmeyebilir`** sayfasını okuyarak gereksiz Effects'i nasıl kaldıracağınızı öğrenin.



## Reaktif Effects'in Yaşam Döngüsü {/*lifecycle-of-reactive-effects*/}

Effects'in bileşenlerden farklı bir yaşam döngüsü vardır. Bileşenler monte edilebilir, güncellenebilir veya unmount edilebilir. Bir Effect yalnızca iki şey yapabilir: bir şeyi senkronize etmeye başlamak ve daha sonra onu senkronize etmeyi durdurmak. Bu döngü, Effect'inin zamanla değişen props ve duruma bağlı olduğu durumlarda birçok kez gerçekleşebilir.

Bu Effect, `roomId` prop değerine bağlıdır. Props *reaktif değerlerdir,* bu da onların yeniden render sırasında değişebileceği anlamına gelir. Effect'in `roomId` değiştiğinde *yeniden senkronize* (ve sunucuya yeniden bağlanır) olduğunu unutmayın:



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

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
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
  // Gerçek bir uygulama aslında sunucuya bağlanacak
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```



React, Effect'inin bağımlılıklarını doğru bir şekilde belirttiğinizden emin olmak için bir linter kuralı sağlar. Yukarıdaki örnekte `roomId` bağımlılıklar listesini belirtmeyi unutursanız, linter bu hatayı otomatik olarak bulur.



**`Reaktif Eventlerin Yaşam Döngüsü`** sayfasını okuyarak bir Effect'in yaşam döngüsünün bir bileşenden nasıl farklı olduğunu öğrenin.



## Olayları Effects'ten Ayırma {/*separating-events-from-effects*/}



Bu bölüm, **henüz stabil bir React sürümünde yayımlanmamış deneysel bir API'yi** tanımlar.



Olay işleyicileri yalnızca aynı etkileşimi tekrar gerçekleştirdiğinizde yeniden çalışır. Olay işleyicilerinin aksine, Effects, okuduğu değerler (props veya durum gibi) son render sırasında farklıysa yeniden senkronize olur. Bazen, her iki davranışın bir karışımını istersiniz: bazı değerlere yanıt olarak yeniden çalışan ancak diğerlerine yanıt vermeyen bir Effect.

Effects'in içindeki tüm kod *reaktif*'dir. Yeniden render sonucu nedeniyle okuduğu bazı reaktif değer değiştiğinde tekrar çalışır. Örneğin, bu Effect, `roomId` veya `theme` değişirse sohbet bağlantısına yeniden bağlanacaktır:



```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanacak
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```



Bu ideal değildir. `roomId` değiştiğinde sohbet bağlantısına yeniden bağlanmak istersiniz. `theme` değiştirmek sohbet bağlantısına yeniden bağlanmamalıdır! `theme`'i Effect'inizden çıkararak bir *Effect Olayı*'na taşıyın:



```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanacak
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```



Effect Olayları içindeki kod reaktif değildir, bu nedenle `theme` değiştirmek artık Effect'inizi yeniden bağlamaz.



**`Olayları Effects'ten Ayırma`** sayfasını okuyarak bazı değerlerin Effects'i yeniden tetiklemesini nasıl önleyeceğinizi öğrenin.