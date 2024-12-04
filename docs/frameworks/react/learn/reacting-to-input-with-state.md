---
title: Girdi ile Duruma Tepki Verme
seoTitle: Kullanıcı Girdisine Tepki Verme
sidebar_position: 1
description: React ile kullanıcı arayüzünü deklaratif bir şekilde yönetmeyi öğrenin. Bu kılavuz, bileşen durumlarının nasıl tanımlanacağını ve değiştireceğinizi gösterir.
tags: 
  - React
  - UI Geliştirme
  - Bileşenler
keywords: 
  - kullanıcı arayüzü
  - imperatif
  - deklaratif
  - React
---
React, kullanıcı arayüzünü (UI) manipüle etmenin deklaratif bir yolunu sağlar. UI'nın bireysel parçalarını doğrudan manipüle etmek yerine, bileşeninizin içinde bulunabileceği farklı durumları tanımlarsınız ve kullanıcı girdisine yanıt olarak bunlar arasında geçiş yaparsınız. Bu, tasarımcıların UI hakkında düşündüğü şeye benzerdir.





* Deklaratif UI programlamanın, imperatif UI programlamadan nasıl farklı olduğunu
* Bileşeninizin içinde bulunabileceği farklı görsel durumları nasıl sıralayacağınızı
* Farklı görsel durumlar arasındaki değişiklikleri koddan nasıl tetikleyeceğinizi



## Deklaratif UI'nın imperatif ile karşılaştırılması {/*how-declarative-ui-compares-to-imperative*/}

:::info
UI etkileşimlerini tasarlarken, muhtemelen UI'nın kullanıcı eylemlerine yanıt olarak nasıl *değiştiğini* düşünüyorsunuz. 
:::

Kullanıcının bir yanıt sunmasına izin veren bir formu düşünün:

* Formda bir şey yazdığınızda, "Gönder" düğmesi **etkinleştirilir.**
* "Gönder"e bastığınızda, hem form hem de düğme **devre dışı kalır** ve bir yüklenici **belirir.**
* Ağ isteği başarılı olursa, form **gizlenir** ve "Teşekkürler" mesajı **belirir.**
* Ağ isteği başarısız olursa, bir hata mesajı **belirir** ve form **yeniden etkinleştirilir.**

**Imperatif programlamada**, yukarıda bahsedilen durum, doğrudan etkileşimi nasıl uyguladığınıza karşılık gelir. Olmuş olanlara bağlı olarak UI'yı manipüle etmek için kesin talimatları yazmanız gerekir. Başka bir şekilde düşünün: Birisiyle bir arabadaysanız ve onlara nereden dönmeleri gerektiğini sırayla söylüyorsunuz.



Onların nereye gitmek istediğinizi bilmiyorlar, yalnızca komutlarınızı takip ediyorlar. (Ve talimatları yanlış verirseniz, yanlış yere gidersiniz!) Buna *imperatif* denir çünkü her bir elemanı, yükleniciden düğmeye kadar "komut vermeniz" gerekir; bilgisayara UI'yı *nasıl* güncelleyeceğinizi belirtirsiniz.

Bu imperatif UI programlama örneğinde, form React olmadan *inşa edilmiştir*. Sadece tarayıcıyı [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) kullanır:



```js src/index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Ağla bağlantı yapıyormuş gibi yapıyoruz.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('İyi bir tahmin ama yanlış bir cevap. Tekrar deneyin!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>Şehir bulmacası</h2>
  <p>
    Hangi şehir iki kıtada yer alıyor?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Gönder</button>
  <p id="loading" style="display: none">Yükleniyor...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">Doğru cevap!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```



Imperatif olarak UI'yı manipüle etmek, izole örnekler için yeterince iyi çalışır, ancak daha karmaşık sistemlerde yönetmek katlanarak daha zor hale gelir. Örneğin, bu şekilde farklı formlarla dolu bir sayfayı güncellemeyi hayal edin. Yeni bir UI öğesi veya yeni bir etkileşim eklemek, mevcut kodun tümünü dikkatlice kontrol etmeyi gerektirir; böylece bir hataya sebep olmadığınızdan emin olursunuz (örneğin, bir şeyi göstermeyi veya gizlemeyi unutarak).

React, bu problemi çözmek için inşa edilmiştir.

React'ta, UI'yı doğrudan manipüle etmezsiniz—yani bileşenleri doğrudan etkinleştirmez, devre dışı bırakmaz, göstermez veya gizlemezsiniz. Bunun yerine, **göstermek istediğinizi bildirirsiniz** ve React, UI'yı nasıl güncelleyeceğinizi anlamaya çalışır. Bir taksiye binmek ve sürücüye nereye gitmek istediğinizi söylemek gibi düşünün, onları nereye döneceklerini kesin olarak belirtmek yerine. Sürücünün sizi oraya götürmesi onun işi ve belki de düşündüğünüzden bazı kestirme yolları bilir!



## UI'yı deklaratif olarak düşünmek {/*thinking-about-ui-declaratively*/}

Yukarıda bir formu imperatif olarak nasıl uygulayacağınızı gördünüz. React'ta düşünmeyi daha iyi anlamak için aşağıda bu UI'yı yeniden uygulayacaksınız:

1. **Farklı görsel durumlarınızı tanımlayın**
2. **Bu durum değişikliklerini tetikleyen nedenleri belirleyin**
3. **Durumu `useState` kullanarak bellek içinde temsil edin**
4. **Önemli olmayan durum değişkenlerini kaldırın**
5. **Olay işleyicilerini durumu ayarlamak için bağlayın**

### Adım 1: Bileşeninizin farklı görsel durumlarını tanımlayın {/*step-1-identify-your-components-different-visual-states*/}

Bilgisayar bilimlerinde, bir "durum makinesi"nin bir dizi “durum”da olduğunu duyabilirsiniz. Bir tasarımcı ile çalışıyorsanız, farklı "görsel durumlar" için maketler gördüğünüz olabilir. React, tasarım ve bilgisayar biliminin kesişiminde durur, bu nedenle her iki fikir de ilham kaynaklarıdır.

Öncelikle, kullanıcının görebileceği tüm farklı UI "durumlarını" görselleştirmeniz gerekir:

* **Boş**: Formun devre dışı kalmış "Gönder" düğmesi var.
* **Yazma**: Formun etkinleşmiş "Gönder" düğmesi var.
* **Gönderim**: Form tamamen devre dışı. Yüklenici gösteriliyor.
* **Başarılı**: Form yerine "Teşekkürler" mesajı gösteriliyor.
* **Hata**: Yazma durumuyla aynıdır, fakat ek bir hata mesajı ile.

Bir tasarımcı gibi, mantığı eklemeden önce farklı durumlar için "maket" oluşturmak isteyeceksiniz. Örneğin, işte formun sadece görsel tarafı için bir maket. Bu maket, varsayılan değeri `'empty'` olan `status` adlı bir prop ile kontrol edilmektedir:



```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>Doğru cevap!</h1>
  }
  return (
    <>
      <h2>Şehir bulmacası</h2>
      <p>
        Hangi şehirde havayı içilebilir suya dönüştüren bir reklam panosu var?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Gönder
        </button>
      </form>
    </>
  )
}
```



O prop'u istediğiniz gibi adlandırabilirsiniz, adlandırma önemli değildir. `status = 'empty'` değerini `status = 'success'` olarak değiştirerek başarı mesajının görünmesini sağlayın. Maket oluşturmak, mantığı bağlamadan önce UI üzerinde hızlı bir şekilde yineleme yapmanızı sağlar. Aşağıda, hala `status` prop'u ile "kontrol edilen" aynı bileşenin daha dolu bir prototipi bulunmaktadır:



```js
export default function Form({
  // 'submitting', 'error', 'success' deneyin:
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>Doğru cevap!</h1>
  }
  return (
    <>
      <h2>Şehir bulmacası</h2>
      <p>
        Hangi şehirde havayı içilebilir suya dönüştüren bir reklam panosu var?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Gönder
        </button>
        {status === 'error' &&
          <p className="Error">
            İyi bir tahmin ama yanlış bir cevap. Tekrar deneyin!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```





#### Aynı anda birçok görsel durumu göstermek {/*displaying-many-visual-states-at-once*/}

Bir bileşen birçok görsel duruma sahipse, hepsini tek bir sayfada göstermek kolay olabilir:



```js src/App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>Doğru cevap!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Gönder
      </button>
      {status === 'error' &&
        <p className="Error">
          İyi bir tahmin ama yanlış bir cevap. Tekrar deneyin!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```



Bu tür sayfalara genellikle "yaşayan stil rehberleri" veya "hikaye kitapları" denir.



### Adım 2: Durum değişikliklerini tetikleyen nedenleri belirleyin {/*step-2-determine-what-triggers-those-state-changes*/}

Durum güncellemelerini iki tür girdi ile tetikleyebilirsiniz:

* **İnsan girdileri,** bir düğmeye tıklama, bir alana yazma, bir bağlantıyı takip etme gibi.
* **Bilgisayar girdileri,** bir ağ yanıtının gelmesi, bir zaman aşımının tamamlanması, bir resmin yüklenmesi gibi.


  
  


Her iki durumda da, **UI'yı güncellemek için `durum değişkenlerini` ayarlamanız gerekir.** Geliştirdiğiniz form için, birkaç farklı girdi ile yanıt olarak durumu değiştirmeniz gerekecek:

* **Metin girişini değiştirme** (insan) *Boş* durumundan *Yazma* durumuna veya geri geçiş yapmalıdır, metin kutusu boş olup olmadığına bağlı olarak.
* **Gönder düğmesine tıklama** (insan) onu *Gönderim* durumuna geçirmelidir.
* **Başarılı ağ yanıtı** (bilgisayar) onu *Başarı* durumuna geçirmelidir.
* **Başarısız ağ yanıtı** (bilgisayar) onu eşleşen hata mesajı ile *Hata* durumuna geçirmelidir.



İnsan girdilerinin çoğu, `olay işleyicileri` gerektirir!



Bu akışı görselleştirmek için, her durumu kağıda etiketli bir daire olarak çizmeyi deneyin, aradaki her durumu ise ok ile gösterin. Bu şekilde çok sayıda akış çizebilir ve uygulamadan çok önce hataları ayıklayabilirsiniz.





Form durumları





### Adım 3: Durumu bellek içinde `useState` ile temsil edin {/*step-3-represent-the-state-in-memory-with-usestate*/}

Sonraki adımda, bileşeninizin görsel durumlarını `useState` ile bellekte temsil etmeniz gerekecek. Sadelik önemlidir: her bir durum bir "hareket eden parça"dır ve **olabildiğince az "hareket eden parça" istemelisiniz.** Daha fazla karmaşıklık, daha fazla hataya yol açar!

Şimdi, *kesinlikle olması gereken* durumu ile başlayın. Örneğin, giriş için `cevap` ve son hatayı depolamak için `hata` gibi:

```js
const [cevap, setCevap] = useState('');
const [hata, setHata] = useState(null);
```

Sonra, ekranda göstermek istediğiniz hangi görsel durumun temsil edildiğini gösteren bir durum değişkenine ihtiyacınız olacak. Bellekte bunu temsil etmenin genellikle birden fazla yolu vardır, bu nedenle bununla deneme yapmanız gerekecek.

Hemen en iyi yolu düşünmekte zorlanıyorsanız, tüm olası görsel durumların kapsandığından emin olmak için yeterince durum ekleyin:

```js
const [boş, setBoş] = useState(true);
const [yazma, setYazma] = useState(false);
const [gönderim, setGönderim] = useState(false);
const [başarı, setBaşarı] = useState(false);
const [hata, setHata] = useState(false);
```

İlk fikriniz muhtemelen en iyi olmayacaktır, ama bu sorun değil—durumu yeniden düzenlemek sürecin bir parçasıdır!

### Adım 4: Önemli olmayan durum değişkenlerini kaldırın {/*step-4-remove-any-non-essential-state-variables*/}

Durum içeriğinde kopyalama yapmaktan kaçınmak istersiniz, bu nedenle yalnızca gerekli olanı takip ettiğinizden emin olursunuz. Durum yapınızı yeniden düzenlemeye biraz zaman ayırmak, bileşenlerinizi daha kolay anlamanızı sağlar, kopyalamayı azaltır ve istenmeyen anlamların ortaya çıkmasını engeller. Hedefiniz, **bellekteki durumun, kullanıcıya göstermek istemediğiniz geçerli bir UI temsil etmediği durumları önlemektir.** (Örneğin, bir hata mesajı gösterip girişi aynı anda devre dışı bırakmak istemezsiniz—aksi takdirde kullanıcı hatayı düzeltemez!)

Durum değişkenleriniz hakkında sorabileceğiniz bazı sorular şunlardır:

* **Bu durum bir paradoks oluşturur mu?** Örneğin, `yazma` ve `gönderim` aynı anda `true` olamaz. Bir paradoks genellikle durumun yeterince kısıtlanmadığı anlamına gelir. İki boolean'ın dört olası kombinasyonu vardır, ancak yalnızca üçü geçerli durumlarla eşleşir. "Mümkün değil" durumunu ortadan kaldırmak için bunları `durum` olarak birleştirebilirsiniz ve bu, üç değerden biri olmalıdır: `'yazma'`, `'gönderim'` veya `'başarı'`.
* **Aynı bilgi başka bir durum değişkeninde zaten mevcut mu?** Başka bir paradoks: `boş` ve `yazma` aynı anda `true` olamaz. Ayrı durum değişkenleri olarak yapmak, senkronizasyon sorunlarına yol açabilir ve hataya sebep olabilir. Neyse ki, `boş` durumu kaldırabilir ve bunun yerine `cevap.length === 0` kontrol edebilirsiniz.
* **Başka bir durum değişkeninin tersinden aynı bilgiyi alabilir misiniz?** `hata` gerekli değildir çünkü `hata !== null` kontrol edebilirsiniz.

Bu temizlemeden sonra, 3 (7'den az!) *temel* durum değişkeni ile kalırsınız:

```js
const [cevap, setCevap] = useState('');
const [hata, setHata] = useState(null);
const [durum, setDurum] = useState('yazma'); // 'yazma', 'gönderim' veya 'başarı'
```

Onların temel olduğunu biliyorsunuz çünkü herhangi birini kaldırırsanız işlevselliği bozarsınız.



#### "Mümkün değil" durumları bir azaltıcı ile ortadan kaldırma {/*eliminating-impossible-states-with-a-reducer*/}

Bu üç değişken, bu formun durumunu yeterince iyi temsil eder. Ancak, hala tam anlamıyla mantıklı olmayan bazı ara durumlar vardır. Örneğin, `durum` `'başarı'` olduğunda bir `hata`'nın var olması mantıklı değildir. Durumu daha keskin bir şekilde modellemek için, durumu `bir azaltıcıya` çıkarabilirsiniz. Azaltıcılar, birden fazla durum değişkenini tek bir nesneye birleştirmenizi ve ilgili tüm mantığı konsolide etmenizi sağlar!



### Adım 5: Olay işleyicilerini durumu ayarlamak için bağlayın {/*step-5-connect-the-event-handlers-to-set-state*/}

Son olarak, durumu güncelleyen olay işleyicileri oluşturun. Aşağıda, tüm olay işleyicilerinin bağlandığı son form yer almaktadır:



```js
import { useState } from 'react';

export default function Form() {
  const [cevap, setCevap] = useState('');
  const [hata, setHata] = useState(null);
  const [durum, setDurum] = useState('yazma');

  if (durum === 'başarı') {
    return <h1>Doğru cevap!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setDurum('gönderim');
    try {
      await submitForm(cevap);
      setDurum('başarı');
    } catch (err) {
      setDurum('yazma');
      setHata(err);
    }
  }

  function handleTextareaChange(e) {
    setCevap(e.target.value);
  }

  return (
    <>
      <h2>Şehir bulmacası</h2>
      <p>
        Hangi şehirde havayı içilebilir suya dönüştüren bir reklam panosu var?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={cevap}
          onChange={handleTextareaChange}
          disabled={durum === 'gönderim'}
        />
        <br />
        <button disabled={
          cevap.length === 0 ||
          durum === 'gönderim'
        }>
          Gönder
        </button>
        {hata !== null &&
          <p className="Error">
            {hata.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(cevap) {
  // Ağla bağlantı yapıyormuş gibi yapıyoruz.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = cevap.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('İyi bir tahmin ama yanlış bir cevap. Tekrar deneyin!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```



Bu kod, orijinal imperatif örnekten daha uzun olsa da, çok daha az kırılgandır. Tüm etkileşimleri durum değişiklikleri olarak ifade etmek, daha sonra mevcut olanlarla bozma olmadan yeni görsel durumlar eklemeyi sağlar. Ayrıca, yalnızca etkileşimin mantığını değiştirmeden her durumda neyin görüntüleneceğini değiştirme imkanı sunar.



* Deklaratif programlama, UI'yı her görsel durum için tanımlamayı ifade eder, UI'yı mikro yönetmekten (imperatif) ziyade.
* Bir bileşen geliştirirken:
  1. Tüm görsel durumlarını tanımlayın.
  2. Durum değişiklikleri için insan ve bilgisayar tetikleyicilerini belirleyin.
  3. Durumu `useState` ile modelleyin.
  4. Hatayı ve paradoksları önlemek için önemli olmayan durumu kaldırın.
  5. Olay işleyicilerini durumu ayarlamak için bağlayın.