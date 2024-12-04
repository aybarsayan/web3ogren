---
title: İlk Bileşenin
seoTitle: İlk Bileşenin - React Bileşenleri Hakkında Bilgi
sidebar_position: 1
description: Bu makalede, React bileşenlerinin temel kavramlarını keşfedecek ve ilk bileşeninizi nasıl yazacağınızı öğreneceksiniz. Bileşenler, kullanıcı arayüzlerini inşa etmenin temel yapı taşlarıdır.
tags: 
  - React
  - Bileşenler
  - JavaScript
  - UI Geliştirme
keywords: 
  - React
  - Bileşen
  - UI
  - Geliştirme
---
*Bileşenler*, React'in temel kavramlarından biridir. Kullanıcı arayüzlerini (UI) inşa etmek için dayanak oluştururlar, bu da onları React serüveninize başlamak için mükemmel bir yer haline getirir!





* Bir bileşenin ne olduğu
* Bileşenlerin bir React uygulamasındaki rolü
* İlk React bileşeninizi nasıl yazacağınız



## Bileşenler: UI İnşa Blokları {/*components-ui-building-blocks*/}

Web'de, HTML, `` ve `` gibi yerleşik etiket seti ile zengin yapılandırılmış belgeler oluşturmayı sağlar:

```html
<article>
  <h1>İlk Bileşenim</h1>
  <ol>
    <li>Bileşenler: UI İnşa Blokları</li>
    <li>Bir Bileşeni Tanımlama</li>
    <li>Bir Bileşeni Kullanma</li>
  </ol>
</article>
```

Bu işaretleme, bu makaleyi ``, başlığını `` ve (kısaltılmış) içerik tablosunu sıralı liste olarak `` temsil eder. Bu tür işaretleme, CSS ile stil ve JavaScript ile etkileşim sağlamak için bir araya gelir; her yan panel, avatar, modal, açılır menü - Web'de gördüğünüz her UI parçasının arkasındaki yapı budur.

React, işaretleme, CSS ve JavaScript'inizi özel "bileşenler" halinde birleştirmenizi sağlar, **uygulamanız için yeniden kullanılabilir UI öğeleri.** Yukarıda gördüğünüz içerik tablosu kodu, her sayfada oluşturabileceğiniz bir `` bileşenine dönüştürülebilir. Altında, hala ``, `` gibi aynı HTML etiketlerini kullanır.

HTML etiketleri ile olduğu gibi, bileşenleri bir araya getirip sıralayabilir ve iç içe kullanarak tam sayfaları tasarlayabilirsiniz. Örneğin, şu anda okuduğunuz dökümantasyon sayfası React bileşenlerinden oluşmaktadır:

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Belgeler</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

Projeniz büyüdükçe, tasarımlarınızın çoğunun önceden yazdığınız bileşenleri yeniden kullanarak oluşturulabileceğini fark edeceksiniz; bu da geliştirme sürecinizi hızlandırıyor. Yukarıdaki içerik tablosunu `` ile herhangi bir ekrana ekleyebilirsiniz! Ayrıca, [Chakra UI](https://chakra-ui.com/) ve [Material UI](https://material-ui.com/) gibi React açık kaynak topluluğu tarafından paylaşılan binlerce bileşen ile projenizi başlatabilirsiniz.

## Bir bileşeni tanımlama {/*defining-a-component*/}

Web sayfaları oluştururken, web geliştiricileri genellikle içeriklerini işaretledi ve ardından bazı JavaScript'ler ekleyerek etkileşim sağladı. Bu, etkileşimin hoş bir ek olduğu durumlarda harika çalışıyordu. Artık birçok site ve tüm uygulamalar için beklenen bir durumdur. React etkileşimi önceliklendirirken, aynı teknolojiyi kullanmaya devam eder: **bir React bileşeni, _işaretleme ile serpiştirebileceğiniz bir JavaScript fonksiyonudur_.** İşte bu, aşağıda bulunan örneğin nasıl göründüğü:



```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```



Ve işte bir bileşen oluşturmanın yolu:

### Adım 1: Bileşeni dışa aktar {/*step-1-export-the-component*/}

`export default` öneki, [standart bir JavaScript sözdizimidir](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (React'a özgü değildir). Bu, bir dosyadaki ana fonksiyonu işaretlemenizi sağlar, böylece daha sonra diğer dosyalardan kullanabilirsiniz. (Dışa aktarmak hakkında daha fazla bilgi için `Bileşenleri Dışa Aktarma ve İçe Aktarma` konusuna bakın!)

### Adım 2: Fonksiyonu tanımlama {/*step-2-define-the-function*/}

`function Profile() { }` ifadesi ile `Profile` adı verilen bir JavaScript fonksiyonu tanımlarsınız.

:::warning
React bileşenleri, normal JavaScript fonksiyonlarıdır, ancak **adları büyük harfle başlamalıdır** yoksa çalışmazlar!
:::

### Adım 3: İşaretleme ekleme {/*step-3-add-markup*/}

Bileşen, `src` ve `alt` nitelikleri ile bir `<img />` etiketi döndürür. `<img />` etiketi HTML gibi yazılmıştır, ancak aslında altında JavaScript'tir! Bu sözdizimi `JSX` olarak adlandırılır ve JavaScript içine işaretleme gömmenizi sağlar.

Dönüş ifadeleri tek bir satırda yazılabilir, bu bileşende olduğu gibi:

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

Ancak, işaretlemeniz `return` anahtar kelimesi ile aynı satırda değilse, çift parantez içine almanız gerekir:

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

:::warning
Parantez olmadan, `return` sonrası satırlardaki herhangi bir kod [göz ardı edilir](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!
:::

## Bir bileşeni kullanma {/*using-a-component*/}

Artık `Profile` bileşeninizi tanımladığınıza göre, diğer bileşenlerin içinde yerleştirebilirsiniz. Örneğin, birden fazla `Profile` bileşeni kullanan bir `Gallery` bileşeni dışa aktarabilirsiniz:



```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Harika bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```



### Tarayıcının gördükleri {/*what-the-browser-sees*/}

Küçük harf ile yazılmış tüm ifadelere dikkat edin:

* `` küçük harfle yazılmıştır, böylece React bunun bir HTML etiketi olduğunu bilir.
* `` büyük `P` ile başlayarak React'in, `Profile` adında bir bileşeni kullanmak istediğinizi anlamasını sağlar.

Ve `Profile` daha fazla HTML içerir: `<img />`. Sonunda, tarayıcının gördüğü budur:

```html
<section>
  <h1>Harika bilim insanları</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### Bileşenleri iç içe yerleştirme ve düzenleme {/*nesting-and-organizing-components*/}

Bileşenler düzenli JavaScript fonksiyonlarıdır, bu nedenle aynı dosyada birden fazla bileşeni tutabilirsiniz. Bu, bileşenler oldukça küçük veya birbirleriyle sıkı bir şekilde ilişkili olduğunda kullanışlıdır. Eğer bu dosya kalabalık hale gelirse, `Profile`'ı ayrı bir dosyaya taşıyabilirsiniz. Bunu `içe aktarma sayfasında` öğrenirsiniz.

`Profile` bileşenleri, `Gallery`'nin içinde - hatta birkaç kez! - render edildiği için, `Gallery` bir **ebeveyn bileşen** olarak düşünülebilir ve her `Profile`'ı "çocuk" olarak render eder. Bu React'in sihirlerinden biridir: Bir bileşeni bir kez tanımlayabilir ve istediğiniz kadar yerde ve istediğiniz kadar kullanabilirsiniz.

:::warning
Bileşenler diğer bileşenleri render edebilir, ancak **her zaman tanımlarını iç içe yerleştirmemelisiniz:**
```js {2-5}
export default function Gallery() {
  // 🔴 Asla bir bileşeni başka bir bileşenin içinde tanımlamayın!
  function Profile() {
    // ...
  }
  // ...
}
```
Yukarıdaki kod örneği `çok yavaş ve hatalara neden olur.` Bunun yerine, her bileşeni en üst düzeyde tanımlayın:
```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Bileşenleri en üst düzeyde tanımlayın
function Profile() {
  // ...
}
```
Bir çocuk bileşenin ebeveyninden bazı verilere ihtiyacı olduğunda, [props ile geçmeniz](https://reactjs.org/docs/components-and-props.html) yani iç içe tanımlama yapmaktansa bunu yapabilirsiniz.
:::



#### Bileşenler tamamen aşağıda {/*components-all-the-way-down*/}

React uygulamanız bir "kök" bileşen ile başlar. Genellikle, yeni bir projeye başladığınızda otomatik olarak oluşturulur. Örneğin, [CodeSandbox](https://codesandbox.io/) kullanıyorsanız veya [Next.js](https://nextjs.org/) çerçevesini kullanıyorsanız, kök bileşeni `pages/index.js` içinde tanımlanır. Bu örneklerde, kök bileşenleri dışa aktarıyorsunuz.

Çoğu React uygulaması tamamen aşağıdaki bileşenleri kullanır. Bu, yalnızca yeniden kullanılabilir parçalar için değil, aynı zamanda yan paneller, listeler ve nihayetinde tamamlanmış sayfalar gibi daha büyük parçalar için bileşenler kullanacağınız anlamına gelir! Bileşenler, UI kodunu ve işaretlemesini organize etmenin kullanışlı bir yoludur, bazıları sadece bir kez kullanılsa bile.

`React tabanlı çerçeveler` bunu bir adım ileri götürüyor. Boş bir HTML dosyası kullanmak ve React'in sayfayı JavaScript ile yönetmesine izin vermek yerine, *aynı zamanda* HTML'yi React bileşenlerinizden otomatik olarak üretiyorlar. Bu, uygulamanızın JavaScript kodu yüklenmeden önce bazı içerikler göstermesine olanak tanır.

Yine de, birçok web sitesi yalnızca mevcut HTML sayfalarına etkileşim eklemek için React kullanıyor. Bunlar, tüm sayfa yerine birden fazla kök bileşene sahiptir. Gerekirse ne kadar - ya da ne kadar az - React kullanabileceğinizi seçebilirsiniz.





React'i ilk deneyimlediniz! İşte bazı ana noktaları hatırlayalım.

* React, bileşenler oluşturmanıza olanak tanır, **uygulamanız için yeniden kullanılabilir UI öğeleri.**
* Bir React uygulamasında, UI'nin her parçası bir bileşendir.
* React bileşenleri, normal JavaScript fonksiyonlarıdır, ancak:

  1. Adları her zaman büyük harfle başlar.
  2. JSX işaretlemesi döndürür.





#### Bileşeni dışa aktar {/*export-the-component*/}

Bu kum havuzu çalışmıyor çünkü kök bileşen dışa aktarılmamış:



```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```



Çözümü görmeden önce kendiniz düzeltmeye çalışın!



Fonksiyon tanımının önüne `export default` ekleyin:



```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```



Neden sadece `export` yazarak bu örneği düzeltmenin yeterli olmayacağını merak ediyor olabilirsiniz. `export` ile `export default` arasındaki farkı `Bileşenleri Dışa Aktarma ve İçe Aktarma` konusunda öğrenebilirsiniz.



#### Dönüş ifadesini düzelt {/*fix-the-return-statement*/}

Bu `return` ifadesinde bir sorun var. Bunu düzeltebilir misin?



Düzeltmeye çalışırken "Beklenmeyen token" hatası alabilirsiniz. Bu durumda, noktalı virgülün *kapatma parantezinin* arkasında yer aldığını kontrol edin. `return ( )` içinde bir noktalı virgül bırakmak bir hata meydana getirecektir.






```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```





Bileşeni aşağıdaki gibi dönüş ifadesini tek satıra alarak düzeltebilir veya:



```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```



Ya da döndürülen JSX işaretlemesini `return` anahtar kelimesinin hemen ardından açılan parantez içinde sararak düzeltebilirsiniz:



```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Katsuko Saruhashi" 
    />
  );
}
```

```css
img { height: 180px; }
```





#### Hataları belirleme {/*spot-the-mistake*/}

`Profile` bileşeninin tanımlanması ve kullanılmasıyla ilgili bir sorun var. Hatanın ne olduğunu bulabilir misiniz? (React'in bileşenleri normal HTML etiketlerinden nasıl ayırdığını hatırlamaya çalışın!)



```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Harika bilim insanları</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```





React bileşenlerinin adları büyük harfle başlamalıdır.

`function profile()` ifadesini `function Profile()` olarak değiştirin ve her `` ifadesini `` olarak değiştirin:



```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Harika bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```





#### Kendi bileşeninizi yazın {/*your-own-component*/}

Sıfırdan bir bileşen yazın. Herhangi bir geçerli ismi verebilir ve herhangi bir işaretleme döndürebilirsiniz. Fikir bulamıyorsanız, `İyi iş!` gösteren bir `Congratulations` bileşeni yazabilirsiniz. Dışa aktarmayı da unutmayın!



```js
// Aşağıda bileşeninizi yazın!

```







```js
export default function Congratulations() {
  return (
    <h1>İyi iş!</h1>
  );
}
```