---
title: Efektlerle Senkronizasyon
seoTitle: Senkronizasyon İçin React Efektleri Kullanma
sidebar_position: 4
description: React bileşenlerinin dış sistemlerle nasıl senkronize olabileceğini ve efektlerin bu süreçte nasıl kullanılacağını öğrenin. Efektleri kullanmanın temel ilkelerini ve en iyi uygulamalarını keşfedin.
tags: 
  - React
  - Ekstrem Yazılım Geliştirme
  - Efektler
  - Bileşen Yönetimi
keywords: 
  - React
  - Efektler
  - Senkronizasyon
  - Yazılım Geliştirici
---
Bazı bileşenlerin dış sistemlerle senkronize olması gerekir. Örneğin, React durumuna bağlı olarak bir React dışı bileşeni kontrol etmek, bir sunucu bağlantısı kurmak veya bir bileşen ekranda göründüğünde bir analiz günlüğü göndermek isteyebilirsiniz. *Efektler*, render edildikten sonra bazı kodları çalıştırmanıza izin verir, böylece bileşeninizi React dışındaki bir sistemle senkronize edebilirsiniz.





- Efektlerin ne olduğu
- Efektlerin olaylardan nasıl farklı olduğu
- Bileşeninizde bir Efektin nasıl bildirileceği
- Gereksiz yere bir Efektin yeniden çalıştırılmasının nasıl atlanacağı
- Efektlerin geliştirmede neden iki kez çalıştığı ve bunun nasıl düzeltileceği



## Efektler nedir ve olaylardan nasıl farklıdır? {/*what-are-effects-and-how-are-they-different-from-events*/}

Efektlere geçmeden önce, React bileşenleri içinde iki tür mantıkla tanışmanız gerekir:

- **Render kodu** (bknz. `Kullanıcı Arayüzünü Tanımlama`), bileşeninizin en üst seviyesinde bulunur. Burada props ve durumu alır, bunları dönüştürür ve ekranda görmek istediğiniz JSX'i döndürürsünüz. `Render kodu saf olmalıdır.` Bir matematik formülü gibi, yalnızca sonucu _hesaplamalıdır_, başka hiç bir şey yapmamalıdır.

- **Olay işleyicileri** (bknz. `Etkileşim Ekleme`), bileşenlerinizin içinde yer alan ve yalnızca hesaplamakla kalmayıp bir şeyler yapan iç içe geçmiş fonksiyonlardır. Bir olay işleyicisi, bir giriş alanını güncelleyebilir, bir ürünü satın almak için bir HTTP POST isteği gönderebilir veya kullanıcıyı başka bir ekrana yönlendirebilir. Olay işleyicileri, belirli bir kullanıcı eylemi (örneğin, bir düğmeye tıklama veya yazma) sonucu programın durumunu değiştiren ["yan etkiler"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) içerir.

Bazen bu yeterli değildir. Ekranda görünürken bir `ChatRoom` bileşeninin sohbet sunucusuna bağlanması gerektiğini düşünün. Bir sunucuya bağlanmak, saf bir hesaplama değildir (bir yan etkidir), bu nedenle render sırasında gerçekleşemez. Ancak `ChatRoom`'un görüntülenmesine neden olan tek bir belirli olay yoktur.

***Efektler*, render edilmesiyle tetiklenen yan etkileri belirtmenizi sağlar, belirli bir olay tarafından değil.** Sohbette bir mesaj göndermek bir *olaydır*, çünkü bu, kullanıcının belirli bir düğmeye tıklamasıyla doğrudan ilgilidir. Ancak, bir sunucu bağlantısı kurmak bir *Epektir* çünkü bileşenin görünmesi için hangi etkileşimin tetiklenmiş olduğuna bakılmaksızın gerçekleşmelidir. Efektler, ekran güncellendikten sonra bir `taahhüt` sonunda çalışır. Bu, React bileşenlerinizi dış bir sistemle (örneğin, ağ veya üçüncü taraf bir kütüphane) senkronize etmek için iyi bir zamandır.



Burada ve metnin ilerleyen bölümlerinde, büyük "Efekt" kelimesi, yukarıdaki React'e özgü tanıma atıfta bulunur, yani render ile tetiklenen bir yan etki. Daha geniş programlama kavramını belirtmek için "yan etki" ifadesini kullanacağız.




## Bir Epekte ihtiyacınız olmayabilir {/*you-might-not-need-an-effect*/}

**Bileşenlerinize Efekt eklemek için acele etmeyin.** Efektlerin genellikle React kodunuzdan "dışarı adım atmak" ve bir *dış* sistemle senkronize olmak için kullanıldığını unutmayın. Bu, tarayıcı API’leri, üçüncü taraf widget'lar, ağ gibi durumları içerir. Eğer Efektiniz sadece diğer bir duruma dayanarak bazı durumu ayarlıyorsa, `belki de bir Epekte ihtiyaç duymuyorsunuzdur.`

## Bir Efekt nasıl yazılır {/*how-to-write-an-effect*/}

Bir Efekt yazmak için üç adımı izleyin:

1. **Bir Efekt bildirin.** Varsayılan olarak, Efektiniz her `taahhütten` sonra çalışacaktır.
2. **Efekt bağımlılıklarını belirtin.** Çoğu Efekt yalnızca gerektiğinde yeniden çalışmalıdır, her renderdan sonra değil. Örneğin, bir fade-in animasyonu yalnızca bir bileşen göründüğünde tetiklenmelidir. Bir sohbet odasına bağlanma ve bağlanmama yalnızca bileşen göründüğünde ve kaybolduğunda veya sohbet odası değiştiğinde gerçekleşmelidir. Bunu sağlamak için *bağımlılıkları* belirteceksiniz.
3. **Gerekirse temizlik ekleyin.** Bazı Efektler, yaptıkları şeyleri durdurmanın, geri almanın veya temizlemenin nasıl belirleneceğini belirtmelidir. Örneğin, "bağlan" işlemi "bağlantıyı kesmeyi" gerektirir, "abonelik" "aboneliği iptal etmeyi" gerektirir ve "fetch" ise "iptal" veya "göz ardı" etmemiz gerekir. Bunu bir *temizlik fonksiyonu* döndürerek nasıl yapacağınızı öğreneceksiniz.

Bu adımlardan her birini ayrıntılı olarak inceleyelim.

### Adım 1: Bir Efekt bildirin {/*step-1-declare-an-effect*/}

Bileşeninizde bir Efekt bildirmek için, React'ten `useEffect` Hook'unu` içe aktarın:

```js
import { useEffect } from 'react';
```

Daha sonra, bileşeninizin en üst seviyesinde çağırın ve Efektinizin içine bazı kodlar koyun:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Buradaki kod *her* renderdan sonra çalışacak
  });
  return <div />;
}
```

Bileşeniniz her render olduktan sonra, React ekranı güncelleyecek *ve ardından* `useEffect` içindeki kodu çalıştıracaktır. Diğer bir deyişle, **`useEffect`, bir kod parçasının çalıştırılmasını, o render'ın ekranda yansıtılmasını bekleterek "erteler".**

Bir Efekti dış sisteme senkronize etmek için nasıl kullanabileceğinizi görelim. Düşünün ki bir `` React bileşeniniz var. Oynatılıp oynatılmadığını kontrol etmek için `isPlaying` propunu geçmek iyi bir fikir olacaktır:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

Özel `VideoPlayer` bileşeniniz yerleşik tarayıcı [``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) etiketini render eder:

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: isPlaying ile bir şey yapın
  return <video src={src} />;
}
```

Ancak, tarayıcı `` etiketinin `isPlaying` prop'u yoktur. Tek kontrol yöntemi, DOM öğesi üzerinde [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) ve [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) yöntemlerini manuel olarak çağırmaktır. **Video şu anda oynatılmalıdır bilgisini veren `isPlaying` prop'unun değerini `play()` ve `pause()` gibi çağrılarla senkronize etmelisiniz.**

Öncelikle `` DOM düğmesine bir `referans` almak zorundayız.

Render sırasında `play()` veya `pause()` çağırma isteği taşırken, bu doğru değildir:



```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Render sırasında bunu çağırmak yasaktır.
  } else {
    ref.current.pause(); // Ayrıca bu çökmesine neden olur.
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Duraklat' : 'Oynat'}
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



Bu kodun doğru olmama sebebi, render sırasında DOM düğmesiyle bir şey yapmaya çalışmanızdır. React'te `render işlemi, JSX'in saf bir hesaplaması olmalıdır` ve DOM'u değiştirmek gibi yan etkiler içermemelidir.

Ayrıca, `VideoPlayer` ilk kez çağrıldığında, DOM'u henüz mevcut değildir! `play()` veya `pause()` çağırılacak bir DOM düğmesi yoktur; çünkü React, döndürülen JSX'e kadar hangi DOM'un oluşturulması gerektiğini bilmez.

Burada çözüm, **yan etkiyi `useEffect` ile sarmak, render hesaplamasından çıkarmaktır:**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

DOM güncellemesini bir Effektin içine sararak, önce React'in ekranı güncellemesine izin vermiş olursunuz. Daha sonra ise Efektiniz çalışır.

`VideoPlayer` bileşeniniz render edildiğinde (ya ilk kez ya da yeniden render edildiğinde) bazı şeyler gerçekleşecektir. İlk olarak, React ekranı güncelleyerek `` etiketinin doğru prop'larla DOM'da olduğundan emin olacaktır. Daha sonra React, Efektinizi çalıştıracaktır. Son olarak, Efektiniz `isPlaying` değerine bağlı olarak `play()` veya `pause()` çağıracaktır.

Oynat/Duraklat butonuna birkaç kez basın ve video oynatıcının `isPlaying` değerine nasıl senkronize olduğunu görün:



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
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Duraklat' : 'Oynat'}
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



Bu örnekte, senkronize ettiğiniz "dış sistem", tarayıcının medya API'siydi. Benzer bir yaklaşımı eski React dışı kodları (örneğin jQuery eklentileri) deklaratif React bileşenlerine sarmak için de kullanabilirsiniz.

Bir video oynatıcıyı kontrol etmenin pratikte çok daha karmaşık olduğunu unutmayın. `play()` çağrınız başarısız olabilir, kullanıcı yerleşik tarayıcı kontrollerini kullanarak oynatma veya duraklatma yapabilir ve başka birçok durum söz konusu olabilir. Bu örnek oldukça basitleştirilmiş ve eksiktir.



Varsayılan olarak, Efektler *her* renderdan sonra çalışır. Bu nedenle şu kod **sonsuz bir döngü üretir:**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Efektler renderin bir *sonucu* olarak çalışır. Durumun ayarlanması *render'ı tetikler*. Bir Efekt içinde hemen durumu ayarlamak, bir güç kaynağını kendi içine takmak gibidir. Efekt çalışır, durumu ayarlar, bu bir yeniden render'a neden olur, bu da Efektin tekrar çalışmasına neden olur, durumu tekrar ayarlamada ve bu başka bir yeniden render daha doğurur vb.

Efektler genellikle bileşenlerinizi bir *dış* sistemle senkronize etmelidir. Eğer hiçbir dış sistem yoksa ve sadece diğer bir duruma dayanarak bazı durumları ayarlamak istiyorsanız, `belki de bir Epekte ihtiyaç duymuyorsunuzdur.`



### Adım 2: Efekt bağımlılıklarını belirtin {/*step-2-specify-the-effect-dependencies*/}

Varsayılan olarak, Efektler *her* renderdan sonra çalışır. Çoğu zaman bu, **istediğiniz şey değildir:**

- Bazen yavaştır. Dış bir sistemle senkronize olmak her zaman anlık değildir, bu nedenle gerekli olmadıkça bunu atlayabilirsiniz. Örneğin, her tuş vuruşunda sohbet sunucusuna yeniden bağlanmak istemezsiniz.
- Bazen yanlıştır. Örneğin, bir bileşen görünmeye başladığında her tuş vuruşunda bir bileşen fade-in animasyonunu tetiklemek istemezsiniz. Animasyon yalnızca bileşen ilk kez göründüğünde bir kez oynatılmalıdır.

Sorunu göstermek için, önceki örneği birkaç `console.log` çağrısı ve üst bileşenin durumunu güncelleyen bir metin girişi ile görebilirsiniz. Yazdığınızda, Efektin yeniden çalıştığını fark edin:



```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('video.play() çağrılıyor');
      ref.current.play();
    } else {
      console.log('video.pause() çağrılıyor');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Duraklat' : 'Oynat'}
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```



React'e **Efektin gereksiz yere yeniden çalıştırılmasını atlatmak** için, `useEffect` çağrısının ikinci argümanı olarak bir *bağımlılıklar* dizisi belirtirsiniz. Yukarıdaki örnekte, 14. satırda boş bir `[]` dizisi ekleyerek başlamalısınız:

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

Bir hata alacaksınız, `React Hook useEffect has a missing dependency: 'isPlaying'`:



```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('video.play() çağrılıyor');
      ref.current.play();
    } else {
      console.log('video.pause() çağrılıyor');
      ref.current.pause();
    }
  }, []); // Bu bir hataya neden olur

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Duraklat' : 'Oynat'}
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```



Sorunun kaynağı, Efekt içindeki kodun _yapacakları için_ `isPlaying` prop'una bağımlı olmasıdır, ancak bu bağımlılık açık bir şekilde bildirilmemiştir. Bu sorunu gidermek için, `isPlaying`'i bağımlılıklar dizisine ekleyin:

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // Burada kullanılıyor...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...o nedenle burada belirtilmelidir!
```

Artık tüm bağımlılıklar bildirildiği için hata alınmayacaktır. `[isPlaying]`'i bağımlılık dizisi olarak belirtmek, React'e `isPlaying` önceki renderda olduğu gibi aynı olup olmadığını kontrol etmesini söyler, böylece Efektin yeniden çalıştırılmasını atlayabilsin. Bu değişiklikten sonra, input'a yazmak Efektin yeniden çalıştırılmasına neden olmaz, ancak Oynat/Duraklat düğmesine basmak bunu sağlar:



```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('video.play() çağrılıyor');
      ref.current.play();
    } else {
      console.log('video.pause() çağrılıyor');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Duraklat' : 'Oynat'}
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```



Bağımlılık dizisi birden fazla bağımlılığı içerebilir. React yalnızca, görüntülenen herhangi bir bağımlılıkların, önceki renderda sahip olduğu değerlerle tam olarak aynı olması durumunda Efekti yeniden çalıştırmayı atlayacaktır. React, bağımlılık değerlerini [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırmasıyla karşılaştırır. Daha fazla bilgi için `useEffect` referansına` bakabilirsiniz.

**Unutmayın ki bağımlılıklarınızı "seçemezsiniz".** Eğer belirtilen bağımlılıklar, Efekt içindeki kod temelinde React'in beklentileriyle eşleşmiyorsa, bir linter hatası alırsınız. Bu, kodunuzda birçok hatayı yakalamaya yardımcı olur. Bazı kodların yeniden çalışmasını istemiyorsanız, `*bağımlılığı "ihtiyaç duymayan" Efekt kodunu düzenleyin*`



Bağımlılık dizisi olmadan davranışlar ile *boş* `[]` bağımlılık dizisine sahip olmanın farklılıkları vardır:

```js {3,7,11}
useEffect(() => {
  // Bu, her renderdan sonra çalışır
});

useEffect(() => {
  // Bu yalnızca montajda (bileşen göründüğünde) çalışır
}, []);

useEffect(() => {
  // Bu montajda *ve aynı zamanda* ya a ya b'nin önceki renderdan bu yana değişmesi durumunda çalışır
}, [a, b]);
```

Montajın tam olarak ne anlama geldiğine bir sonraki adımda yakından bakacağız.





#### Neden referans bağımlılık dizisinden çıkarıldı? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

Bu Efekt, _her ikisini de_ `ref` ve `isPlaying` olarak kullanmaktadır, ancak yalnızca `isPlaying` bağımlılık olarak bildirilmiştir:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

Bunun sebebi, `ref` nesnesinin *kararlı bir kimliğe* sahip olmasıdır: React, `her renderda aynı nesneyi alacağınızı garanti eder`. Asla değişmez, bu nedenle yalnızca bulunup bulunmadığı önemli değildir. Dahası, dahil etmek de sorun yoktur:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

`set` fonksiyonları` da kararlı bir kimliğe sahip olduğundan, bunlar da genellikle bağımlılıklardan çıkarılır. Linter, hatalar olmadan bağımlılığı çıkarmanıza izin veriyorsa, güvenlidir.

Daima kararlı bağımlılıkları atlamak yalnızca linter'in objenin kararlı olduğunu "görmesi" durumunda geçerli olur. Örneğin, `ref` bir üst bileşenden geçerse, bağımlılık dizisine belirtmek zorundasınız. Fakat bu iyi bir durumdur çünkü üst bileşenin her zaman aynı referansı geçirip geçirmediğini veya birkaç referansta koşullu olarak birini geçip geçirmediğini bilemezsiniz. Bu nedenle, Efektiniz hangi referansın geçildiğine bağımlı olur.