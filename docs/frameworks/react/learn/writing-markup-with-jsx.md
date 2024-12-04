---
title: JSX ile İşaretleme Yazma
seoTitle: JSX ile İşaretleme Yazma Reactte Etkileşimli İçerik Oluşturma
sidebar_position: 4
description: JSX, JavaScript dosyası içinde HTML benzeri işaretleme yazmanızı sağlayan bir sözdizimi uzantısıdır. Bu kılavuz, JSXi anlamanıza ve kullanmanıza yardımcı olacaktır.
tags: 
  - JSX
  - React
  - JavaScript
  - Web Geliştirme
keywords: 
  - JSX
  - React
  - HTML
  - JavaScript
  - Web Geliştirme
---
*JSX*, JavaScript dosyası içinde HTML benzeri işaretleme yazmanıza olanak tanıyan bir sözdizimi uzantısıdır. Bileşenleri yazmanın başka yolları olsa da, çoğu React geliştiricisi JSX'in kısalığını tercih eder ve çoğu kod tabanı bunu kullanır.





* Neden React işaretleme ile render mantığını karıştırır
* JSX'in HTML'den nasıl farklı olduğu
* JSX ile bilgiyi nasıl göstereceğiniz



## JSX: İşaretlemeyi JavaScript'e Koyma {/*jsx-putting-markup-into-javascript*/}

Web, HTML, CSS ve JavaScript üzerine inşa edilmiştir. Yıllar boyunca, web geliştiricileri içeriği HTML'de, tasarımı CSS'te ve mantığı JavaScript'te tutmuşlardır—genellikle ayrı dosyalarda! İçerikler HTML içinde işaretlenirken sayfanın mantığı JavaScript'te ayrı olarak yaşamıştır:





HTML





JavaScript





Ama Web daha etkileşimli hale geldikçe, mantık içeriği giderek daha çok belirlemeye başladı. JavaScript HTML'den sorumluydu! İşte bu yüzden **React'de, render mantığı ve işaretleme aynı yerde—bileşenlerde—birlikte yaşar.**





`Sidebar.js` React bileşeni





`Form.js` React bileşeni





Bir düğmenin render mantığını ve işaretlemesini bir arada tutmak, her düzenlemede senkron kalmalarını sağlar. Öte yandan, düğmenin işaretlemesi ile bir kenar çubuğunun işaretlemesi gibi alakasız ayrıntılar birbirinden izole edilir, böylece ikisinden birini kendi başına değiştirmek daha güvenli hale gelir.

Her React bileşeni, içeriğinde React'ın tarayıcıya render ettiği bazı işaretlemeleri barındırabilen bir JavaScript fonksiyonudur. React bileşenleri, o işaretlemeyi temsil etmek için JSX isimli bir sözdizimi uzantısını kullanır. JSX, HTML'ye çok benzer, ancak biraz daha katıdır ve dinamik bilgileri gösterebilir. Bunu anlamanın en iyi yolu, bazı HTML işaretlemelerini JSX işaretlemesine çevirmektir.



JSX ve React iki ayrı şeydir. Genellikle birlikte kullanılırlar, ancak birbirlerinden bağımsız olarak da *kullanabilirsiniz* [bağımsız olarak kullanma](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform). JSX, bir sözdizimi uzantısıdır; React ise bir JavaScript kütüphanesidir.



## HTML'den JSX'e Dönüştürme {/*converting-html-to-jsx*/}

Diyelim ki bazı (tamamen geçerli) HTML'iniz var:

```html
<h1>Hedy Lamarr'ın Yapılacaklar Listesi</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Yeni trafik ışıkları icat et
    <li>Bir film sahnesini prova et
    <li>Spektral teknolojiyi geliştirmek
</ul>
```

Ve bunu bileşeninize eklemek istiyorsunuz:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Eğer olduğu gibi kopyalayıp yapıştırırsanız, çalışmayacaktır:



```js
export default function TodoList() {
  return (
    // Bu pek çalışmıyor!
    <h1>Hedy Lamarr'ın Yapılacaklar Listesi</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
      <li>Yeni trafik ışıkları icat et
      <li>Bir film sahnesini prova et
      <li>Spektral teknolojiyi geliştirmek
    </ul>
  );
}
```

```css
img { height: 90px }
```



Bunun nedeni, JSX'in daha katı olması ve HTML'den biraz daha fazla kural içermesidir! Yukarıdaki hata mesajlarını okursanız, işaretlemeyi nasıl düzelteceğiniz konusunda yol gösterirler ya da aşağıdaki kılavuzu takip edebilirsiniz.



Çoğu zaman, React'ın ekran üzerindeki hata mesajları, sorunun nerede olduğunu bulmanıza yardımcı olacaktır. Eğer takılırsanız, okuyun!



## JSX Kuralları {/*the-rules-of-jsx*/}

### 1. Tek bir kök element döndürün {/*1-return-a-single-root-element*/}

Bir bileşenden birden fazla öğe döndürmek için, **bunları tek bir üst etiketle sarın.**

Örneğin, bir `` kullanabilirsiniz:

```js {1,11}
<div>
  <h1>Hedy Lamarr'ın Yapılacaklar Listesi</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


Daha fazla `` eklemek istemiyorsanız, bunun yerine `<>` ve `` yazabilirsiniz:

```js {1,11}
<>
  <h1>Hedy Lamarr'ın Yapılacaklar Listesi</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

Bu boş etiket bir *`Fragment.`* olarak adlandırılır. Fragment'ler, tarayıcı HTML ağacında herhangi bir iz bırakmadan şeyleri gruplamanıza olanak tanır.



#### Birden fazla JSX etiketinin neden sarılması gerektiği {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX, HTML gibi görünür, ancak arka planda düz JavaScript nesnelerine dönüştürülür. Bir işlevden iki nesne döndüremezsiniz, bunları bir dizi içine sarmadıkça. Bu, neden iki JSX etiketini başka bir etiketle veya Fragment ile sarmanız gerektiğini açıklar.



### 2. Tüm etiketleri kapatın {/*2-close-all-the-tags*/}

JSX, etiketlerin açıkça kapatılmasını gerektirir: kendinden kapanan etiketler gibi `<img>` `<img />` haline gelmelidir ve sarmalayıcı etiketler gibi `portakallar` `portakallar` olarak yazılmalıdır.

Hedy Lamarr'ın resmi ve liste öğeleri kapatıldığında şöyle görünür:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Yeni trafik ışıkları icat et</li>
    <li>Bir film sahnesini prova et</li>
    <li>Spektral teknolojiyi geliştirmek</li>
  </ul>
</>
```

### 3. camelCase her şeyi çoğu şeyi! {/*3-camelcase-salls-most-of-the-things*/}

JSX, JavaScript'e dönüşür ve JSX'te yazılan öznitelikler, JavaScript nesnelerinin anahtarları haline gelir. Kendi bileşenlerinizde, sıklıkla bu öznitelikleri değişkenlere okumak isteyeceksiniz. Ama JavaScript'in değişken isimleri üzerinde sınırlamaları vardır. Örneğin, isimler tire içeremez veya `class` gibi ayrılmış kelimeler olamaz.

Bu nedenle, React'de, birçok HTML ve SVG özniteliği camelCase şeklinde yazılır. Örneğin, `stroke-width` yerine `strokeWidth` kullanırsınız. `class` ayrılmış bir kelime olduğu için, React'te `className` olarak yazarsınız ki bu da [karşılık gelen DOM özelliği](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) ile isimlendirilmiştir:

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

Bu özniteliklerin tamamını [DOM bileşen özellikleri listesinde](https://reference/react-dom/components/common) bulabilirsiniz. Eğer birini yanlış yazarsanız, endişelenmeyin—React, [tarayıcı konsolunda](https://developer.mozilla.org/docs/Tools/Browser_Console) olası bir düzeltmeyle mesaj verecektir.



Tarihi nedenlerden ötürü, [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) ve [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) öznitelikleri HTML'deki gibi tire ile yazılır.



### Pro-ipucu: Bir JSX Dönüştürücü Kullanın {/*pro-tip-use-a-jsx-converter*/}

Mevcut işaretlemelerde bu öznitelikleri dönüştürmek zahmetli olabilir! Var olan HTML ve SVG'nizi JSX'e çevirmek için bir [dönüştürücü](https://transform.tools/html-to-jsx) kullanmanızı öneririz. Dönüştürücüler pratikte çok faydalıdır, ancak yine de JSX yazmayı rahatlıkla öğrenebilmeniz için neler olup bittiğini anlamak önemlidir.

İşte nihai sonucun:



```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr'ın Yapılacaklar Listesi</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="photo" 
      />
      <ul>
        <li>Yeni trafik ışıkları icat et</li>
        <li>Bir film sahnesini prova et</li>
        <li>Spektral teknolojiyi geliştirmek</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```





Artık JSX'in neden var olduğunu ve bileşenlerde nasıl kullanılacağını biliyorsunuz:

* React bileşenleri, mantığı işaretleme ile bir arada grupluyor çünkü bunlar ilişkilidir.
* JSX, bir dizi farkla HTML'ye benzer. Gerekirse bir [dönüştürücü](https://transform.tools/html-to-jsx) kullanabilirsiniz.
* Hata mesajları genellikle işaretlemenizi düzeltmek için doğru yönde sizi yönlendirir.





#### Bazı HTML'leri JSX'e Dönüştürün {/*convert-some-html-to-jsx*/}

Bu HTML bir bileşene yapıştırıldı, ancak geçerli bir JSX değil. Düzeltin:



```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Web siteme hoş geldiniz!</h1>
    </div>
    <p class="summary">
      Düşüncelerimi burada bulabilirsiniz.
      <br><br>
      <b>Ve <i>bilim insanlarının</b></i> resimleri!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```



İster elle, ister dönüştürücü kullanarak yapmanız size kalmış!





```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Web siteme hoş geldiniz!</h1>
      </div>
      <p className="summary">
        Düşüncelerimi burada bulabilirsiniz.
        <br /><br />
        <b>Ve <i>bilim insanlarının</i></b> resimleri!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```