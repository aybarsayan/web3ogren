---
title: Reaktif Etkilerin Yaşam Döngüsü
seoTitle: Reaktif Etkilerin Yaşam Döngüsü | React
sidebar_position: 4
description: Bu bölümde, reaktif etkilerin yaşam döngüsünü ve bileşenlerin nasıl senkronize olduğunu öğreneceksiniz. Reactın etkileri nasıl yeniden senkronize ettiğini anlamak önemlidir.
tags: 
  - React
  - Etkiler
  - Bileşen Yaşam Döngüsü
  - JavaScript
keywords: 
  - reaktif etkiler
  - yaşam döngüsü
  - bileşenler
  - senkronizasyon
---
Etkilerin yaşam döngüsü, bileşenlerin yaşam döngüsünden farklıdır. Bileşenler eklenebilir, güncellenebilir veya kaldırılabilir. Bir Etki yalnızca iki şey yapabilir: bir şeyi senkronize etmeye başlamak ve daha sonra onu senkronize etmeyi durdurmak. Bu döngü, Etkinizin zamanla değişen props ve durumlarına bağlıysa birden fazla kez gerçekleşebilir. React, Etkinizin bağımlılıklarını doğru şekilde belirttiğinizi kontrol etmek için bir linter kuralı sağlar. Bu, Etkinizin en son props ve duruma senkronize kalmasına yardımcı olur.





- Bir Etkinin yaşam döngüsünün bileşenin yaşam döngüsünden nasıl farklı olduğunu
- Her bir Etkiye nasıl bağımsız olarak düşünülmesi gerektiğini
- Etkinizin ne zaman yeniden senkronize edilmesi gerektiğini ve nedenini
- Etkinizin bağımlılıklarının nasıl belirlendiğini
- Bir değerin reaktif olması ne anlama gelir
- Boş bir bağımlılık dizisinin ne anlama geldiğini
- React'ın bağımlılıkların doğru olduğuna dair nasıl doğrulama yaptığı
- Linter ile anlaşmadığınızda ne yapacağınızı



## Bir Etkinin yaşam döngüsü {/*the-lifecycle-of-an-effect*/}

Her React bileşeni aynı yaşam döngüsünden geçer:

- Bir bileşen ekrana _eklenir_.
- Bir bileşen yeni props veya durum aldığında, genellikle bir etkileşime yanıt olarak _güncellenir_.
- Bir bileşen ekrandan _kaldırıldığında_.

**Bu, bileşenler hakkında düşünmenin iyi bir yolu, ancak Etkiler hakkında _değil_.** Bunun yerine, her Etkiye bileşeninizin yaşam döngüsünden bağımsız olarak düşünmeye çalışın. Bir Etki, mevcut props ve durumu `senkronize etmeyi` nasıl tanımladığını belirtir. Kodunuz değiştikçe, senkronizasyon daha sık veya daha az sık olması gerekecektir.

Bu noktayı açıklamak için, bileşeninizi bir sohbet sunucusuna bağlayan bu Etkiye bakalım:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Etkinizin gövdesi, nasıl **senkronize olmaya başlayacağınızı** belirtir:

```js {2-3}
// ...
const connection = createConnection(serverUrl, roomId);
connection.connect();
return () => {
  connection.disconnect();
};
// ...
```

Etkinizden dönen temizleme işlevi, nasıl **senkronize olmayı durduracağınızı** belirtir:

```js {5}
// ...
const connection = createConnection(serverUrl, roomId);
connection.connect();
return () => {
  connection.disconnect();
};
// ...
```

İnsani olarak, React'ın bileşeniniz ekrana geldiğinde **senkronize olmaya başlayacağını** ve bileşeniniz ekrandan kaldırıldığında **senkronize olmayı durduracağını** düşünebilirsiniz. Ancak bu, hikayenin sonu değil! Bazen bileşen sürdüğü sürece **birden fazla kez senkronize olmak ve durdurmak** da gerekebilir.

Bunun neden gerekli olduğunu, ne zaman gerçekleştiğini ve bu davranışı nasıl kontrol edebileceğinizi görelim.



Bazı Etkiler hiç temizleme işlevi döndürmez. `Çoğu zaman,` bir tane döndürmek isteyeceksiniz - ancak eğer döndürmezseniz, React boş bir temizleme işlevi döndürüyor gibi davranacaktır.



### Senkronizasyonun birden fazla kez gerçekleşmesi gerekebilir mi {/*why-synchronization-may-need-to-happen-more-than-once*/}

Hayal edin ki bu `ChatRoom` bileşeni, kullanıcının bir açılır menüde seçtiği bir `roomId` prop'u alıyor. Diyelim ki başlangıçta kullanıcı, `roomId` olarak `"general"` odasını seçiyor. Uygulamanız `"general"` sohbet odasını gösteriyor:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Hoş geldiniz, {roomId} odasına!</h1>;
}
```

Arayüz görüntülendikten sonra, React Etkinizi **senkronize olmaya başlamak** için çalıştıracaktır. Bu, `"general"` odasına bağlanır:

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "general" odasına bağlanır
    connection.connect();
    return () => {
      connection.disconnect(); // "general" odasından ayrılır
    };
  }, [roomId]);
  // ...
```

Şu ana kadar her şey yolunda.

Daha sonra, kullanıcı açılır menüde farklı bir odayı (örneğin `"travel"`) seçer. İlk olarak, React arayüzü günceller:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Hoş geldiniz, {roomId} odasına!</h1>;
}
```

Sonrasında ne olacağını düşünün. Kullanıcı, UI'da `"travel"` odasının seçili olduğunu görüyor. Ancak, en son çalıştırılan Etki hala `"general"` odasına bağlıdır. **`roomId` prop'u değişti, bu yüzden o zamanki Etkinizin yaptığı şey (yani `"general"` odasına bağlanmak) artık UI ile eşleşmiyor.**

Bu noktada, React'in iki şey yapmasını istiyorsunuz:

1. Eski `roomId` ile senkronize olmayı durdurmak (yani `"general"` odasından ayrılmak)
2. Yeni `roomId` ile senkronize olmaya başlamak (yani `"travel"` odasına bağlanmak)

**Neyse ki, React'a bu iki şeyi nasıl yapacağını zaten öğrettiniz!** Etkinizin gövdesi, senkronize olmaya başlama şeklinizi belirtir ve temizleme işleviniz, senkronize olmayı durdurma şeklinizi belirtir. React'ın yapması gereken tek şey, bunları doğru sırayla ve doğru props ve durumlarla çağırmaktır. Bunu nasıl yaptığını görelim.

### React Etkinizi nasıl yeniden senkronize eder {/*how-react-re-synchronizes-your-effect*/}

`ChatRoom` bileşeniniz `roomId` prop'u için yeni bir değer aldı. Eskiden `"general"` idi, şimdi ise `"travel"`. React, Etkinizi yeniden senkronize etmesi gerektiği için sizi farklı bir odaya yeniden bağlamalıdır.

**Senkronize olmayı durdurmak için,** React `"general"` odasına bağlandıktan sonra dönen temizleme işlevini çağıracaktır. Çünkü `roomId` `"general"` idi, temizleme işlevi `"general"` odasından ayrılacaktır:

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "general" odasına bağlanır
    connection.connect();
    return () => {
      connection.disconnect(); // "general" odasından ayrılır
    };
    // ...
```

Ardından, bu render sırasında sağladığınız Etkiyi çalıştırır. Bu sefer, `roomId` `"travel"` olduğu için **senkronize olmaya** başlar (temizleme işlevi bir gün çağrılana kadar):

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "travel" odasına bağlanır
    connection.connect();
    // ...
```

Bunun sayesinde, artık kullanıcı tarafından UI'da seçilen odada bağlısınız. Felaket önlendi!

Her seferinde bileşeniniz farklı bir `roomId` ile yeniden render edildiğinde, Etkiniz yeniden senkronize olacaktır. Örneğin, kullanıcı `roomId`'yi `"travel"`dan `"music"`e değiştirirse. React yine **senkronize olmayı durduracak** ve temizleme işlevini çağıracak (sizi `"travel"` odasından ayırarak). Ardından **senkronize olmaya** başlayacak ve yeni `roomId` prosuyla gövdesini çalıştıracaktır (sizi `"music"` odasına bağlayarak).

Son olarak, kullanıcı farklı bir ekrana geçtiğinde `ChatRoom` kaldırılır. Artık bağlı kalmaya gerek yoktur. React, Etkinizi bir son kez **senkronize olmayı durduracak** ve sizi `"music"` sohbet odasından ayıracaktır.

### Etkinin bakış açısından düşünmek {/*thinking-from-the-effects-perspective*/}

`ChatRoom` bileşeninin bakış açısına göre neler olduğunu tekrar gözden geçirelim:

1. `ChatRoom` `"general"` ayarlı `roomId` ile yüklendi
2. `ChatRoom` `"travel"` ayarlı `roomId` ile güncellendi
3. `ChatRoom` `"music"` ayarlı `roomId` ile güncellendi
4. `ChatRoom` kaldırıldı

Bu noktalar sırasında, Etkiniz farklı şeyler yaptı:

1. Etkiniz `"general"` odasına bağlandı
2. Etkiniz `"general"` odasından ayrıldı ve `"travel"` odasına bağlandı
3. Etkiniz `"travel"` odasından ayrıldı ve `"music"` odasına bağlandı
4. Etkiniz `"music"` odasından ayrıldı

Şimdi de etkinin bakış açısından neler olduğunu düşünelim:

```js
  useEffect(() => {
    // Etkiniz roomId ile belirlenen odaya bağlandı...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...ta ki ayrıldı
      connection.disconnect();
    };
  }, [roomId]);
```

Bu kodun yapısı, olup biteni örtüşmeyen zaman dilimleri dizisi olarak görmeniz için sizi cesaretlendirebilir:

1. Etkiniz `"general"` odasına bağlandı (ta ki ayrılana kadar)
1. Etkiniz `"travel"` odasına bağlandı (ta ki ayrılana kadar)
1. Etkiniz `"music"` odasına bağlandı (ta ki ayrılana kadar)

Öncelikle, bileşenin bakış açısından düşünüyordunuz. Bileşenin bakış açısından bakarken, Etkileri belirli bir zaman diliminde "geri çağrılar" veya "yaşam döngüsü olayları" olarak düşünmek cazipti. Bu düşünme yolu çok karmaşık hale gelir, bu yüzden kaçınmak en iyisidir.

**Bunun yerine, her seferinde tek bir başlangıç/durdurma döngüsüne odaklanın. Bileşenin eklenip eklenmediği, güncellenip güncellenmediği önemli olmamalıdır. Tek yapmanız gereken, senkronizasyonu başlatmak ve durdurmak için nasıl bir tanım yapacağınızdır. Bunu iyi yaparsanız, Etkiniz gerektiği kadar başlatılıp durdurulmaya dayanıklı olacaktır.**

Bu, bileşeninizi render ederken JSX oluşturan mantığı yazarken bir bileşenin eklenip eklenmediğini düşünmeyeceğiniz gibidir. Ne olacağını tanımlarsınız ve React `geri kalanını halleder.`

### React Etkinizin yeniden senkronize olabileceğini nasıl doğrular {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

İşte oynayabileceğiniz bir canlı örnek. `ChatRoom` bileşenini yüklemek için "Sohbeti Aç" butonuna tıklayın:



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
  return <h1>Hoş geldiniz, {roomId} odasına!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Sohbet odasını seçin: {' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">genel</option>
          <option value="travel">seyahat</option>
          <option value="music">müzik</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Sohbeti Kapat' : 'Sohbeti Aç'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama sunucuya gerçekten bağlanacaktır
  return {
    connect() {
      console.log('✅ "' + roomId + '" odasına ' + serverUrl + ' üzerinde bağlanıyor...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" odasından ' + serverUrl + ' üzerinde ayrıldı');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```



Bileşen ilk kez yüklendiğinde, üç günlüğü görüyorsunuz:

1. `✅ "'general'" odasına https://localhost:1234 üzerinde bağlanıyor...` *(sadece geliştirme)*
1. `❌ "'general'" odasından https://localhost:1234 üzerinde ayrıldı.` *(sadece geliştirme)*
1. `✅ "'general'" odasına https://localhost:1234 üzerinde bağlanıyor...`

İlk iki günlüğü yalnızca geliştirmededir. Geliştirme aşamasında, React her bileşeni bir kez yeniden yükler.

**React, Etkinizin yeniden senkronize olabileceğini, onu geliştirme aşamasında hemen zorlayarak doğrular.** Bu, kapıyı açıp kapatmanın, kapı kilidinin çalışıp çalışmadığını kontrol etmek gibi bir durumu hatırlatabilir. React, temizleme işleminizi iyi gerçekleştirdiğinizden emin olmak için Etkinizi geliştirmede bir kez daha durdurup başlatır `bunu kontrol eder.`

Etkinizin pratikte yeniden senkronize olmasının ana nedeni, kullandığı bazı verilerin değişmesidir. Yukarıdaki sandalyede, seçili sohbet odasını değiştirin. `roomId` değiştiğinde, Etkiniz yeniden senkronize olur.

Ancak, yeniden senkronizasyonun gerekli olduğu daha alışılmadık durumlar da vardır. Örneğin, sohbet açıkken yukarıdaki sandalyede `serverUrl`'yı düzenlemeyi deneyin. Kodunuzdaki düzenlemelere yanıt olarak Etkinizin nasıl yeniden senkronize olduğunu görün. Gelecekte, React'ın yeniden senkronizasyona dayanacak daha fazla özellik ekleme olasılığı bulunmaktadır.

### React, Etkinizin yeniden senkronize olması gerektiğini nasıl biliyor {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

React'ın `roomId` değiştikten sonra Etkinizin yeniden senkronize olması gerektiğini nasıl bildiğini merak ediyor olabilirsiniz. Çünkü *React'a* bağımlılık listesini dahil ederek `roomId`'nin kodunuza bağımlı olduğunu söylediniz `bağımlılık:`

```js {1,3,8}
function ChatRoom({ roomId }) { // roomId propsu zamanla değişebilir
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Bu Etki roomId okur
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Böylece React'a bu Etkinin "roomId'ye bağımlı olduğunu" söylediniz
  // ...
```

Bu şöyle işler:

1. `roomId`'nin bir prop olduğunu biliyordunuz, yani zamanla değişebilir.
2. Etkinizin `roomId` okuduğunu biliyordunuz (yani mantığı değişebilir bir değere bağlı).
3. Bu nedenle, onu bir Etkinin bağımlılığı olarak belirttiniz (böylece `roomId` değiştiğinde yeniden senkronize olur).

Bileşeniniz her yeniden render edildikten sonra, React geçirdiğiniz bağımlılık dizisini kontrol eder. Eğer dizideki değerlerden herhangi biri, önceki render sırasında kendi pozisyondaki değerden farklıysa, React Etkinizi yeniden senkronize eder.

Örneğin, başlangıçta `["general"]` geçirdiyseniz ve sonraki render sırasında `["travel"]` geçirdiyseniz, React `"general"` ve `"travel"` değerlerini karşılaştıracaktır. Bu, [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) ile karşılaştırıldığında farklı değerlerdir, bu yüzden React Etkinizi yeniden senkronize edecektir. Öte yandan, bileşeniniz yeniden render edilirse ancak `roomId` değişmedi ise, Etkiniz aynı odaya bağlı kalacaktır.

### Her Etki, ayrı bir senkronizasyon sürecini temsil eder {/*each-effect-represents-a-separate-synchronization-process*/}

Etkilerinize yalnızca bu mantıkların aynı zamanda çalışması gerektiği için alakasız bir mantık ekleme isteğine karşı çıkın. Örneğin, kullanıcının odayı ziyaret ettiğinde bir analitik olay göndermek istiyorsanız. Daha önce `roomId`'ye bağımlı bir Etkiniz olduğu için, analitik çağrısını oraya ekleme isteği duyabilirsiniz:

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Ancak, daha sonra bu Etkiye yeniden bağlantıyı gerektiren başka bir bağımlılık eklediyseniz. Eğer bu Etki yeniden senkronize olursa, aynı oda için `logVisit(roomId)`'i de çağırır ki, bunu istemedinizdir. Ziyareti günlüğe kaydetme **bağlantı kurmaktan ayrı bir süreçtir**. Bunu iki farklı Etki olarak yazın:

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**Kodunuzdaki her Etki, ayrı ve bağımsız bir senkronizasyon sürecini temsil etmelidir.**

Örneğin, bir Etkiyi silseniz diğer Etkinin mantığını etkilemez. Bu, bunların farklı senkronizasyonlar olduğuna iyi bir işaret ve bu nedenle ayrı ayrı yazmak mantıklıdır. Öte yandan, birbiriyle ilişkili bir mantığı ayrı Etkilere bölerseniz, kod "daha temiz" görünebilir ancak `daha zor bakımı yapılabilir.` Bu yüzden, süreçlerin aynı mı yoksa ayrı mı olduğunu düşünmelisiniz, kodun daha temiz görünüp görünmemesi değil.