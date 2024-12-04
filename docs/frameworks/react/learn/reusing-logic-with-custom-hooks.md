---
title: Özel Hooklar ile Mantığı Yeniden Kullanma
seoTitle: Özel Hooklar ile Mantığı Yeniden Kullanma
sidebar_position: 4
description: Reactte özel hooklar oluşturarak bileşenler arasında mantığı paylaşmanın nasıl olduğunu öğrenin. Bu kılavuz, özel hooklarınızı geliştirme ve uygulamanızda nasıl kullanacağınız konusunda rehberlik eder.
tags: 
  - React
  - Hook
  - Özel Hook
  - Bileşenler
  - Mantık Paylaşımı
keywords: 
  - React
  - Hook
  - Özel Hook
  - Bileşenler
  - Mantık Paylaşımı
---
React, `useState`, `useContext` ve `useEffect` gibi çeşitli yerleşik Hook'lar ile gelir. Bazen daha spesifik bir amaç için bir Hook'un olmasını istersiniz: örneğin, veri çekmek, kullanıcının çevrimiçi olup olmadığını takip etmek veya bir sohbet odasına bağlanmak. Bu Hook'ları React'te bulamayabilirsiniz, ancak uygulamanızın ihtiyaçları doğrultusunda kendi Hook'larınızı oluşturabilirsiniz.





- Özel Hook'ların ne olduğunu ve nasıl yazılacağını
- Bileşenler arasında mantığı nasıl yeniden kullanacağınızı
- Özel Hook'larınızı nasıl adlandırıp yapılandıracağınızı
- Özel Hook'ları ne zaman ve neden çıkarmanız gerektiğini



## Özel Hook'lar: Bileşenler Arasında Mantık Paylaşımı {/*custom-hooks-sharing-logic-between-components*/}

Bir ağdan yoğun bir şekilde yararlanan bir uygulama geliştirdiğinizi hayal edin (çoğu uygulama gibi). Kullanıcınızı ağ bağlantısının yanlışlıkla kesildiğinde uyarmak istiyorsunuz. Bunu nasıl yaparsınız? Bileşeninizde iki şeye ihtiyacınız olduğunu görüyorsunuz:

1. Ağın çevrimiçi olup olmadığını takip eden bir durum parçası.
2. Durumu güncelleyen global [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) ve [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) olaylarına abone olan bir Etki.

Bu, bileşeninizi ağ durumuyla `senkronize` tutacaktır. Bir şeyle başlayabilirsiniz:



```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Çevrimiçi' : '❌ Bağlantı Kesildi'}</h1>;
}
```



Ağınızı açıp kapatmayı deneyin ve bu `StatusBar`'ın eylemlerinize nasıl tepki verdiğini gözlemleyin.

Şimdi aynı mantığı farklı bir bileşende de kullanmak istediğinizi hayal edin. Ağ kapalıyken "Kaydet" yerine "Bağlanıyor..." göstererek devre dışı kalacak bir Kaydet düğmesi uygulamak istiyorsunuz.

Başlamak için `isOnline` durumunu ve Etki'yi `SaveButton`'a kopyalayıp yapıştırabilirsiniz:



```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ İlerleme kaydedildi');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'İlerlemeyi kaydet' : 'Bağlanıyor...'}
    </button>
  );
}
```



Ağınızı kapatırsanız, düğmenin görünümünün değiştiğini doğrulayın.

Bu iki bileşen iyi çalışıyor, ancak aralarındaki mantık kopyalaması talihsiz. Görünüşleri farklı olsa da, aralarındaki mantığı yeniden kullanmak istiyorsunuz.

### Bir Bileşenden Kendi Özel Hook'unuzu Çıkarmak {/*extracting-your-own-custom-hook-from-a-component*/}

`useState` ve `useEffect` gibi, içinde `useOnlineStatus` adında yerleşik bir Hook olduğunu varsayalım. O zaman bu iki bileşeni de basit hale getirebilir ve aralarındaki tekrarı kaldırabilirsiniz:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Çevrimiçi' : '❌ Bağlantı Kesildi'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ İlerleme kaydedildi');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'İlerlemeyi kaydet' : 'Bağlanıyor...'}
    </button>
  );
}
```

Bu yerleşik Hook yok ama kendiniz yazabilirsiniz. `useOnlineStatus` adında bir fonksiyon tanımlayın ve daha önce yazdığınız bileşenlerden tüm tekrar eden kodları ona taşıyın:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

Fonksiyonun sonunda `isOnline` değerini döndürün. Bu, bileşenlerinizin bu değeri okumasını sağlar:



```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Çevrimiçi' : '❌ Bağlantı Kesildi'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ İlerleme kaydedildi');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'İlerlemeyi kaydet' : 'Bağlanıyor...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```



Ağın açılıp kapandığında her iki bileşenin güncellendiğini doğrulayın.

Artık bileşenlerinizde çok fazla tekrarlayan mantık yok. **Daha da önemlisi, içlerindeki kod, *ne yapmak istediklerini* (çevrimiçi durumunu kullanmak!) belirtirken, *bunu nasıl yapacaklarını* (tarayıcı olaylarına abone olarak) tanımlamaktadır.**

Mantığı özel Hook'lara çıkardığınızda, bazı dış sistemlerle veya bir tarayıcı API'si ile nasıl başa çıktığınızdaki karmaşık ayrıntıları gizleyebilirsiniz. Bileşenlerinizin kodu, niyetinizi ifade eder, uygulamayı değil.

### Hook İsimleri Her Zaman `use` ile Başlar {/*hook-names-always-start-with-use*/}

React uygulamaları bileşenlerden oluşur. Bileşenler ise, yerleşik veya özel, Hook'lardan yapılır. Sıklıkla başkaları tarafından oluşturulmuş özel Hook'ları kullanacağınızdan emin olabilirsiniz, ancak arada bir kendiniz de yazabilirsiniz!

Aşağıdaki adlandırma kurallarına uymalısınız:

1. **React bileşen adları büyük harfle başlamalıdır,** `StatusBar` ve `SaveButton` gibi. React bileşenleri, bir JSX parçası gibi React'ın ne şekilde gösterebileceği bir şey döndürmelidir.
2. **Hook adları `use` ile başlayıp bir büyük harfle devam etmelidir,** yerleşik olanlar gibi `useState` veya daha önce sayfada belirtilen `useOnlineStatus`. Hook'lar keyfi değerler döndürebilir.

Bu kural, bir bileşene baktığınızda her zaman nasıl bir durum, Etki ve diğer React özelliklerinin "gizlenebileceğini" bilmenizi garanti eder. Örneğin, bileşeninizin içinde `getColor()` fonksiyonunu gördüğünüzde, adının `use` ile başlamadığından, bunun içinde React durumunun olamayacak olduğundan emin olabilirsiniz. Ancak `useOnlineStatus()` gibi bir fonksiyon çağrısı, diğer Hook'ları içereceğini büyük olasılıkla gösterecektir!



Eğer linter'ınız `React için yapılandırılmışsa`, bu adlandırma kuralını zorlayacaktır. Yukarıdaki kumanda kutusuna geri dönüp `useOnlineStatus`'ı `getOnlineStatus` olarak yeniden adlandırın. Linter'ın artık içine `useState` veya `useEffect` çağrısı yapmanıza izin vermediğini fark edeceksiniz. Yalnızca Hook'lar ve bileşenler diğer Hook'ları çağırabilir!





#### Render sırasında çağrılan tüm fonksiyonlar `use` ile mi başlamalı? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

Hayır. Hook'ları *çağırmayan* fonksiyonların *Hook* olması gerekmez.

Fonksiyonunuz herhangi bir Hook çağrısı yapmıyorsa, `use` ön ekinden kaçının. Bunun yerine, onu `use` ön eki olmadan sıradan bir fonksiyon olarak yazın. Örneğin, aşağıdaki `useSorted` Hook çağrısı yapmadığı için `getSorted` olarak adlandırılmalıdır:

```js
// 🔴 Kaçının: Hook çağrısı yapmayan bir Hook
function useSorted(items) {
  return items.slice().sort();
}

// ✅ İyi: Hook çağrısı yapmayan sıradan bir fonksiyon
function getSorted(items) {
  return items.slice().sort();
}
```

Bu, kodunuzun bu sıradan fonksiyonu herhangi bir yerde, koşullar dahil içinde çağırabilmesini sağlar:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ getSorted()'i koşullu olarak çağırmakta sorun yok çünkü bu bir Hook değil
    displayedItems = getSorted(items);
  }
  // ...
}
```

Eğer bir fonksiyonu (ve dolayısıyla bir Hook) yapmak için en az bir Hook kullanıyorsa, ona `use` ön ekini vermelisiniz:

```js
// ✅ İyi: Diğer Hook'ları kullanan bir Hook
function useAuth() {
  return useContext(Auth);
}
```

Teknik olarak, bu React tarafından zorunlu kılınmaz. Prensip olarak, diğer Hook'ları çağırmayan bir Hook oluşturabilirsiniz. Bu genellikle kafa karıştırıcı ve sınırlayıcı olduğundan, bu desenlerden kaçınmak en iyisidir. Ancak, nadiren yararlı olabilecek durumlar olabilir. Örneğin, belki henüz hiçbir Hook kullanmayan bir fonksiyonunuz var ama gelecekte bazı Hook çağrıları eklemeyi planlıyorsunuz. O zaman, ona `use` ön ekini vermek mantıklıdır:

```js {3-4}
// ✅ İyi: Muhtemelen gelecekte diğer Hook'ları kullanacak bir Hook
function useAuth() {
  // TODO: Kimlik doğrulama uygulandığında bu satır ile değiştirin:
  // return useContext(Auth);
  return TEST_USER;
}
```

Böylece bileşenler koşullu olarak bunu çağırmaları mümkün olmaz. Gelecekte Hook çağrılarını içeri eklediğinizde, bu önemli hale gelecektir. Eğer içinde Hook'ları kullanmayı planlamıyorsanız (şimdi veya gelecekte), onu Hook yapmayın.



### Özel Hook'lar, durum mantığını paylaşmanıza olanak tanır, durumu değil {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

Önceki örnekte, ağı açıp kapattığınızda, her iki bileşen de birlikte güncellendi. Ancak, tek bir `isOnline` durum değişkeninin aralarında paylaşıldığını düşünmek yanlıştır. Bu koda bakın:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Bu, önce tekrar edişi çıkarmadan önceki duruma benzer şekilde çalışır:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

Bunlar tamamen bağımsız durum değişkenleri ve Etkileri! Aynı anda aynı değere sahip olmaları, onları aynı dış değerle (ağın ne durumda olduğu) senkronize ettikleri için mümkündür.

Bunu daha iyi açıklamak için farklı bir örneğe ihtiyacımız olacak. Bu `Form` bileşenini düşünün:



```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        Ad:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Soyad:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Günaydın, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```



Her form alanı için tekrar eden bazı mantıklar vardır:

1. Bir durum parçası vardır (`firstName` ve `lastName`).
2. Bir değişiklik işleyici vardır (`handleFirstNameChange` ve `handleLastNameChange`).
3. O `değer` ve `onChange` özelliklerini belirten bir JSX parçası vardır.

Bu tekrar eden mantığı, `useFormInput` özel Hook'una çıkartabilirsiniz:



```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        Ad:
        <input {...firstNameProps} />
      </label>
      <label>
        Soyad:
        <input {...lastNameProps} />
      </label>
      <p><b>Günaydın, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```



Sadece *bir* durum değişkeni olan `value`'yu tanımlar.

Ancak, `Form` bileşeni `useFormInput`'ı *iki kez* çağırır:

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

Bu yüzden iki ayrı durum değişkeni tanımlamak gibi çalışır!

**Özel Hook'lar, *durum mantığını* paylaşmanıza olanak tanır ama *durumu* değil.** Bir Hook'a yapılan her çağrı, aynı Hook'a yapılan her çağrıdan tamamen bağımsızdır. Bu yüzden yukarıdaki iki kumanda kutusu tamamen eşdeğerdir. İsterseniz, geri dönüp onları karşılaştırabilirsiniz. Bir özel Hook çıkarıldığındaki davranış, değişmez.

Birden fazla bileşen arasında durumu paylaşmanız gerekiyorsa, `yukarıya kaldırıp aşağıya geçirin` daha iyidir.