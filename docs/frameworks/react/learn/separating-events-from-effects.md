---
title: Olayları Etkilerden Ayırma
seoTitle: Olayları Etkilerden Ayırma - React Öğren
sidebar_position: 4
description: Bu sayfa, olay işleyicileri ve etkiler arasındaki farkları anlamanızı sağlayarak, etkilerin reaktif şekilde nasıl çalıştığını açıklamaktadır. Ayrıca, reaktif değerleri ve mantığı netleştirecektir.
tags: 
  - React
  - Olay İşleyicileri
  - Etkiler
  - Reaktif Programlama
  - Bileşenler
keywords: 
  - olay işleyicileri
  - etkiler
  - reaktif
  - React
  - bileşenler
---
Olay işleyicileri yalnızca aynı etkileşimi tekrar gerçekleştirdiğinizde yeniden çalıştırılır. Olay işleyicilerin aksine, etkiler, okudukları bazı değerler, bir prop veya bir durum değişkeni gibi, son render sürecindeki değerden farklı olduğunda yeniden senkronize olurlar. Bazen, hem bazı değerlere yanıt olarak yeniden çalışan hem de diğerlerine yanıt vermeyen bir etki karışımına ihtiyacınız vardır. Bu sayfa, bunu nasıl yapacağınızı öğretecektir.





- Olay işleyicisi ile etki arasında nasıl seçim yapılacağını
- Neden etkilerin reaktif olduğunu ve olay işleyicilerin olmadığını
- Etki kodunuzun bir kısmının reaktif olmaması gerektiğinde ne yapacağınızı
- Etki olaylarının ne olduğunu ve bunları etkilerinizden nasıl çıkaracağınızı
- Etkilerde en son props ve durumu nasıl okuyacağınızı



## Olay işleyicileri ve etki arasında seçim yapmak {/*choosing-between-event-handlers-and-effects*/}

Öncelikle, olay işleyicileri ile etkiler arasındaki farkı gözden geçirelim.

Bir sohbet odası bileşeni uyguladığınızı hayal edin. Gereksinimleriniz şöyle:

1. Bileşeniniz seçilen sohbet odasına otomatik olarak bağlanmalıdır.
2. "Gönder" butonuna tıkladığınızda, bir mesajı sohbete göndermelidir.

Diyelim ki bunlar için kodu zaten uyguladınız, ancak bunu nereye yerleştireceğinizden emin değilsiniz. Olay işleyicileri mi yoksa etkiler mi kullanmalısınız? Bu soruya her ihtiyaç duyduğunuzda, `*kodun neden çalışması gerektiğini*` düşünün.

### Olay işleyicileri belirli etkileşimlere yanıt olarak çalışır {/*event-handlers-run-in-response-to-specific-interactions*/}

Kullanıcı açısından, bir mesaj göndermek *çünkü* belirli "Gönder" butonuna tıklanması gerekir. Kullanıcı, mesajlarını herhangi bir başka zamanda veya başka bir nedenle gönderirseniz oldukça üzülür. Bu nedenle, bir mesaj göndermek bir olay işleyicisi olmalıdır. Olay işleyicileri, belirli etkileşimleri yönetmeyi sağlar:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Gönder</button>
    </>
  );
}
```

Bir olay işleyicisi ile, `sendMessage(message)`'in yalnızca kullanıcı butona bastığında çalışacağından emin olabilirsiniz.

### Etkiler senkronizasyona ihtiyaç duyulduğunda çalışır {/*effects-run-whenever-synchronization-is-needed*/}

Bileşeni sohbet odasına bağlı tutmanız gerektiğini hatırlayın. Bu kod nereye gidiyor?

Bu kodun çalıştırılma *neden*'i belirli bir etkileşim değildir. Kullanıcının sohbet odası ekranına neden veya nasıl geçtiği önemli değildir. Şimdi onu görüyorlar ve bununla etkileşimde bulunabilirler, bileşenin seçilen sohbet sunucusuna bağlı kalması gerekir. Uygulamanızın ilk ekranı sohbet odası bileşeni olsa bile ve kullanıcı hiçbir etkileşim gerçekleştirmemiş olsa bile, *hala* bağlantı kurmanız gerekir. Bu nedenle, bu bir etkidir:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Bu kod ile, belirli bir etkileşim tarafından gerçekleştirilenlerin *ötesinde* her zaman seçilen sohbet sunucusuna etkin bir bağlantının olduğundan emin olabilirsiniz. Kullanıcı yalnızca uygulamanızı açmış, farklı bir odayı seçmiş veya başka bir ekrana gidip geri dönmüş olsalar bile, etki, bileşenin *belirli bir odayla senkronize kalmasını* ve `gerektiğinde yeniden bağlanmasını sağlar.`



```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>{roomId} odasına hoş geldiniz!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Gönder</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  const [show, setShow] = useState(false);
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
      <button onClick={() => setShow(!show)}>
        {show ? 'Sohbeti kapat' : 'Sohbeti aç'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function sendMessage(message) {
  console.log('🔵 Gönderdiğiniz: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanacaktır
  return {
    connect() {
      console.log('✅ "' + roomId + '" odasına ' + serverUrl + ' üzerinden bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" odasından ' + serverUrl + ' üzerinden bağlantı kesildi');
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```



## Reaktif değerler ve reaktif mantık {/*reactive-values-and-reactive-logic*/}

Sezgisel olarak, olay işleyicilerinin her zaman "manuel" olarak tetiklendiğini, örneğin bir düğmeye tıklanarak söylenebilir. Öte yandan, etkiler "otomatik" olarak çalışır ve yeniden çalışır; senkronize kalmak için gerektiği kadar sıklıkla tetiklenir.

Bunu düşünmenin daha kesin bir yolu vardır.

Bileşen gövdesinde tanımlanan props, durum ve değişkenler reaktif değerler olarak adlandırılır. Bu örnekte, `serverUrl` bir reaktif değer değildir, ancak `roomId` ve `message` reaktiftir. Bunlar, render veri akışına katılır:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Bu tür reaktif değerler, bir yeniden render sonucunda değişebilir. Örneğin, kullanıcı `message` değerini düzenleyebilir veya dropdown'da farklı bir `roomId` seçebilir. Olay işleyicileri ve etkiler bu değişikliklere farklı yanıt verir:

- **Olay işleyicileri içindeki mantık *reaktif değildir.*** Tekrar çalışmaz, kullanıcı aynı etkileşimi (örneğin, bir tıklama) tekrar gerçekleştirmedikçe. Olay işleyicileri reaktif değerleri okuyabilir, ancak değişikliklerine "tepki vermezler."
- **Etkilerin içindeki mantık *reaktiftir.*** Eğer etkiniz bir reaktif değeri okursa, `onu bir bağımlılık olarak belirtmelisiniz.` Ardından, bir yeniden render bu değerin değişmesine neden olursa, React etkinizin mantığını yeni değerle yeniden çalıştıracaktır.

Bu farkı açıklığa kavuşturmak için önceki örneği tekrar gözden geçirelim.

### Olay işleyicileri içindeki mantık reaktif değildir {/*logic-inside-event-handlers-is-not-reactive*/}

Bu kod satırına bakalım. Bu mantık reaktif mi olmalı, değil mi?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

Kullanıcı açısından, **`message` değeri değiştiğinde _onların_ bir mesaj göndermek istediği anlamına gelmez.** Bu yalnızca kullanıcının yazdığı anlamına gelir. Diğer bir deyişle, bir mesaj gönderme mantığı reaktif olmamalıdır. Sadece reaktif değerin değiştiği için tekrar çalışmamalıdır. Bu nedenle olay işleyicisine aittir:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Olay işleyicileri reaktif değildir, bu nedenle `sendMessage(message)` yalnızca kullanıcı "Gönder" butonuna tıkladığında çalışacaktır.

### Etkiler içindeki mantık reaktiflidir {/*logic-inside-effects-is-reactive*/}

Şimdi şu satırlara geri dönelim:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

Kullanıcı açısından, **`roomId` değerinin bir değişimi *farklı bir odaya bağlanmak istedikleri* anlamına gelir.** Diğer bir deyişle, odaya bağlanma mantığının reaktif olması gerekir. Bu kod satırlarının, reaktif değere "uyum sağlaması" ve bu değer farklı olduğunda tekrar çalışması gerekir. Bu nedenle, bu bir etkidir:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Etkiler reaktiftir, bu nedenle `createConnection(serverUrl, roomId)` ve `connection.connect()` her farklı `roomId` değeri için çalışır. Etkiniz, sohbet bağlantısını şu anda seçilen odayla senkronize tutar.

## Etkilerden reaktif olmayan mantığı çıkarma {/*extracting-non-reactive-logic-out-of-effects*/}

Reaktif mantığı reaktif olmayan mantık ile karıştırmak istediğinizde daha karmaşık hale geliyor.

Örneğin, kullanıcının sohbetle bağlandığında bir bildirim göstermek istediğinizi düşünün. Doğru rengin bildirimde gösterilmesi için mevcut temayı (karanlık veya aydınlık) props'tan okuyorsunuz:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Bağlandı!', theme);
    });
    connection.connect();
    // ...
```

Ancak, `theme` bir reaktif değerdir (yeniden render edilmesi sonucu değişebilir) ve `her reaktif değer etki tarafından okunduğunda bağımlılık olarak belirtilmelidir.` Artık `theme`'i etkinizin bağımlılığı olarak belirtmeniz gerekir:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Bağlandı!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ Tüm bağımlılıklar belirtildi
  // ...
```

Bu örneği oynayın ve bu kullanıcı deneyimindeki sorunu tespit edip edemediğinizi görün:



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
      showNotification('Bağlandı!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>{roomId} odasına hoş geldiniz!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Karanlık tema kullan
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
  // Gerçek bir uygulama aslında sunucuya bağlanacaktır
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
        throw Error('Handler iki kez eklenemez.');
      }
      if (event !== 'connected') {
        throw Error('Yalnızca "connected" olayı destekleniyor.');
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



`roomId` değiştiğinde, sohbetin yeniden bağlandığını beklediğiniz gibi görünüyor. Ancak, `theme` de bir bağımlılık olduğu için, sohbet her karanlık ve aydınlık tema arasında geçiş yaptığınızda *da* yeniden bağlantı kurar. Bu pek iyi değil!

Diğer bir deyişle, bu satırın reaktif olmasını istemezsiniz, ancak bir etki içinde (ki reaktiftir):

```js
      // ...
      showNotification('Bağlandı!', theme);
      // ...
```

Reaktif olmayan mantığı, etrafındaki reaktif etkiden ayırmanın bir yoluna ihtiyacınız vardır.

### Bir etki olayını duyurma {/*declaring-an-effect-event*/}



Bu bölüm, **henüz kararlı bir React sürümünde yayımlanmamış deneysel bir API'yi** açıklar.



Bu reaktif olmayan mantığı etkinizden çıkarmak için `useEffectEvent` adında özel bir Hook kullanın:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Bağlandı!', theme);
  });
  // ...
```

Burada `onConnected`, *etki olayı* olarak adlandırılır. Etki mantığınızın bir parçasıdır, ancak bir olay işleyicisi gibi çok daha fazla davranır. İçindeki mantık reaktif değildir ve her zaman props ve durumunuzun en son değerlerini "görür."

Artık etkinizden `onConnected` etki olayını çağırabilirsiniz:

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Bağlandı!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Tüm bağımlılıklar belirtildi
  // ...
```

Bu sorunu çözer. Dikkat edin ki, *onConnected*'i etkinizin bağımlılıkları listesinden *çıkarmanız* gerekti. **Etki olayları reaktif değildir ve bağımlılıklardan çıkarılmalıdır.**

Yeni davranışın beklediğiniz gibi çalıştığını doğrulayın:



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
    showNotification('Bağlandı!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} odasına hoş geldiniz!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Karanlık tema kullan
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
  // Gerçek bir uygulama aslında sunucuya bağlanacaktır
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
        throw Error('Handler iki kez eklenemez.');
      }
      if (event !== 'connected') {
        throw Error('Yalnızca "connected" olayı destekleniyor.');
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



Etki olaylarını, olay işleyicilerine çok benzer bir şekilde düşünebilirsiniz. Ana fark, olay işleyicilerinin kullanıcı etkileşimlerine yanıt olarak çalışırken, etki olaylarının etkilerden tetiklenmesidir. Etki olayları, etkilerin reaktifliği ile reaktif olmayan mantık arasında "bağlantıyı kırmak" için size bir yol sağlar.