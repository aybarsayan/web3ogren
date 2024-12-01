---
name: React ile Farklılıklar
description: 'Preact ve React arasındaki farklar nelerdir. Bu belge ayrıntılı olarak açıklamaktadır. Preact, boyutu ve performansı ön planda tutarak React ile benzer özellikleri sunmayı hedefler ve farklılıkları anlamak geliştiriciler için önemlidir.'
keywords: [Preact, React, farklar, performans, uyumluluk]
---

# React ile Farklılıklar

Preact, React'ın yeniden uygulanması amacıyla tasarlanmamıştır. Farklılıklar vardır. Bu farklılıkların birçoğu önemsizdir veya [preact/compat] kullanarak tamamen ortadan kaldırılabilir; bu, Preact'ın üzerine koyulmuş, React ile %100 uyumluluğu sağlamaya çalışan ince bir katmandır.

Preact'ın, React'ın her bir özelliğini dahil etmeye çalışmamasının sebebi, **küçük** ve **odaklı** kalmaktır - aksi takdirde, zaten çok karmaşık ve iyi tasarlanmış bir kod tabanı olan React projesine optimizasyonlar göndermek daha mantıklı olurdu.

---



---

## Ana farklar

Preact ve React arasındaki ana fark, Preact'ın boyut ve performans nedenleriyle sentetik bir olay sistemi uygulamamış olmasıdır. Preact, olay işleyicilerini kaydetmek için tarayıcının standart `addEventListener` metodunu kullanır; bu, olay adlandırma ve davranışının Preact'te, düz JavaScript / DOM'da olduğu gibi çalıştığı anlamına gelir. DOM olay işleyicilerinin tam listesi için [MDN'nin Olay Referansı]na bakabilirsiniz.

Standart tarayıcı olayları, React'teki olayların nasıl çalıştığına oldukça benzer, birkaç küçük farkla. Preact'te:

- olaylar `` bileşenleri aracılığıyla yükselmez
- form girdileri için React'ın `onChange` yerine standart `onInput` kullanılmalıdır (**yalnızca `preact/compat` kullanılmıyorsa**)
- React'ın `onDoubleClick`'i yerine standart `onDblClick` kullanılmalıdır (**yalnızca `preact/compat` kullanılmıyorsa**)
- `onSearch`, `` için genel olarak kullanılmalıdır; çünkü temizleme "x" düğmesi IE11'de `onInput`'i tetiklemez

:::note
Başka bir dikkat çekici fark, Preact'ın DOM spesifikasyonuna daha yakın bir şekilde uyulmasıdır.
:::

## Versiyon Uyumluluğu

Hem preact hem de [preact/compat] için versiyon uyumluluğu, React'ın _mevcut_ ve _önceki_ ana sürümlerine karşı ölçülmektedir. React ekibi tarafından yeni özellikler duyurulduğunda, [Proje Hedefleri] dikkate alınarak gerekirse Preact'nın çekirdek yapısına eklenebilir. Bu, sürekli olarak açık bir şekilde yapılan tartışma ve alınan kararlar yoluyla evrilen oldukça demokratik bir süreçtir.

> Bu nedenle, web sitesi ve belgeler, uyumluluk veya kıyaslamalar yaparken React `15.x` ile `17.x`'i yansıtır.  
> — Preact Belgeleri

## Hata mesajları ve hatalar

Esnek mimarimiz, eklentilerin Preact deneyimini istedikleri şekilde geliştirmesine olanak tanır. Bu eklentilerden biri, `yararlı uyarılar ve hatalar` ekleyen `preact/debug`'dir ve kurulu ise [Preact Geliştirici Araçları](https://preactjs.github.io/preact-devtools/) tarayıcı uzantısını bağlar. Preact uygulamaları geliştirirken sizi yönlendirir ve olan biteni incelemeyi çok daha kolay hale getirir. Bunu etkinleştirmek için ilgili import ifadesini ekleyebilirsiniz:

```js
import "preact/debug"; // <-- Ana giriş dosyanızın en üstüne bu satırı ekleyin
```

Bu, React'ten farklıdır; çünkü React'ın hata mesajlarını derleme zamanında kaldırmak için `NODE_ENV != "production"` kontrol eden bir paketleyici gerektirir.

---

## Preact'e özgü özellikler

Preact, (P)React topluluğundaki çalışmalardan ilham alan birkaç kullanışlı özellik eklemektedir:

### ES Modülleri için yerel destek

Preact, başlangıçtan itibaren ES Modülleri düşünülerek inşa edilmiştir ve bunları destekleyen ilk frameworklerden biridir. Preact'ı tarayıcılarda doğrudan `import` anahtar kelimesi ile yükleyebilirsiniz; öncelikle bir paketleyici aracılığıyla geçiş yapmak zorunda kalmazsınız.

### `Component.render()`'da argümanlar

Kolaylık açısından, sınıf bileşenlerindeki `render()` metoduna `this.props` ve `this.state` geçiyoruz. Bir prop ve bir state özelliği kullanan bu bileşene bir bakış atın.

```jsx
// Preact ve React'te çalışır
class Foo extends Component {
  state = { age: 1 };

  render() {
    return <div>İsim: {this.props.name}, Yaş: {this.state.age}</div>;
  }
}
```

Preact'te bu da şu şekilde yazılabilir:

```jsx
// Sadece Preact'te çalışır
class Foo extends Component {
  state = { age: 1 };

  render({ name }, { age }) {
    return <div>İsim: {name}, Yaş: {age}</div>;
  }
}
```

Her iki kod parçası da aynı şeyi render eder, render argümanları kolaylık sağlamak amacıyla sunulmuştur.

### Ham HTML nitelik/özellik adları

Preact, tüm büyük tarayıcılar tarafından desteklenen DOM spesifikasyonuna yakından uymayı hedeflemektedir. Bir öğeye `props` uygularken, Preact _her bir propun_ bir özellik veya HTML niteliği olarak ayarlanıp ayarlanmayacağını _tespit eder_. Bu, Özel Öğeler üzerinde karmaşık özellikler ayarlamayı mümkün kılar, ancak ayrıca JSX'te `class` gibi nitelik adlarını kullanmanıza da olanak tanır:

```jsx
// Bu:
<div class="foo" />

// ...şu ile aynıdır:
<div className="foo" />
```

Çoğu Preact geliştiricisi `class` kullanmayı tercih eder, çünkü yazması daha kısadır; ancak her ikisi de desteklenir.

### JSX içinde SVG

SVG, özelliklerinin ve niteliklerinin adları açısından oldukça ilginçtir. SVG nesnelerindeki bazı özellikler (ve bunların nitelikleri) camelCase şeklindedir (örneğin, [clipPathUnits bir clipPath öğesinde](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath#Attributes)), bazı nitelikler kebab-case şeklindedir (örneğin, [clip-path birçok SVG öğesinde](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)), ve diğer nitelikler (genellikle DOM'dan miras alınanlar, örneğin `oninput`) tamamen küçük harfle yazılır.

Preact, SVG niteliklerini olduğu gibi uygulamaktadır. Bu, özelleştirilmemiş SVG parçalarını doğrudan kodunuza kopyalayıp yapıştırmanıza ve bunların kutudan çıktığı gibi çalışmasına olanak tanır. Bu, tasarımcıların ikonlar veya SVG illüstrasyonları oluşturmak için kullanma eğiliminde olduğu araçlarla daha fazla birlikte çalışabilirlik sağlar.

```jsx
// React
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <circle fill="none" strokeWidth="2" strokeLinejoin="round" cx="24" cy="24" r="20" />
</svg>
// Preact (not stroke-width ve stroke-linejoin)
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <circle fill="none" stroke-width="2" stroke-linejoin="round" cx="24" cy="24" r="20" />
</svg>
```

React'ten geliyorsanız, tüm nitelikleri camelCase olarak belirlemeye alışkın olabilirsiniz. [preact/compat] projenize ekleyerek her zaman camelCase SVG nitelik adlarını kullanmaya devam edebilirsiniz; bu, React API'sini yansıtır ve bu nitelikleri normalize eder.

### `onInput` yerine `onChange` kullanın

Başlıca tarihsel nedenlerden dolayı, React'ın `onChange` olayının anlamı, her yerde desteklenen tarayıcıların sağladığı `onInput` olayının anlamıyla aynıdır. `input` olayı, bir form kontrolü değiştirildiğinde tepki vermek istediğiniz durumların çoğunda en uygun olaydır. Preact çekirdeğinde, `onChange`, bir öğenin değerinin kullanıcı tarafından _taahhüt_ edildiğinde tetiklenen standart [DOM değişiklik olayı](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)'dır.

```jsx
// React
<input onChange={e => console.log(e.currentTarget.value)} />

// Preact
<input onInput={e => console.log(e.currentTarget.value)} />
```

Eğer [preact/compat] kullanıyorsanız, çoğu `onChange` olayı, React'ın davranışını taklit etmek için `onInput`'e içsel olarak dönüştürülür. Bu, React ekosistemiyle maksimum uyumluluk sağlamak için kullandığımız numaralardan biridir.

### JSX Yapıcısı

JSX, iç içe geçmiş fonksiyon çağrılarına dönüştürülen JavaScript için bir sözdizim uzantısıdır. Ağaç yapıları inşa etmek için bu iç içe geçmiş çağrıları kullanma fikri JSX'ten çok daha önce gelir ve daha önce JavaScript'te [hyperscript] projesi tarafından popüler hale getirilmiştir. Bu yaklaşım, React ekosisteminin kapsamından çok daha öte bir değere sahiptir; bu nedenle Preact, orijinal genel topluluk standardını teşvik etmektedir. JSX ve Hyperscript arasındaki ilişki hakkında daha derin bir tartışma için, [JSX'nin nasıl çalıştığını](https://jasonformat.com/wtf-is-jsx) okumak için bu makaleyi inceleyin.

**Kaynak:** (JSX)

```jsx
<a href="/">
  <span>Anasayfa</span>
</a>
```

**Çıktı:**

```js
// Preact:
h(
  'a',
  { href:'/' },
  h('span', null, 'Anasayfa')
);

// React:
React.createElement(
  'a',
  { href:'/' },
  React.createElement('span', null, 'Anasayfa')
);
```

Sonuçta, bir Preact uygulaması için üretilmiş çıktı koduna bakıyorsanız, daha kısa bir isimlendirmeye sahip "JSX pragma"nın hem okunmasının daha kolay olduğu hem de minifikasyon gibi optimizasyonlar için daha uygun olduğu açıktır. Çoğu Preact uygulamasında `h()` ile karşılaşacaksınız; ama hangi adı kullandığınız önemli değil, çünkü bir `createElement` takma adının da sağlandığı dikkate alınmalıdır.

### No contextTypes needed

Geçmişteki `Context` API'si, bileşenlerin bu değerleri almak için React'ın `contextTypes` veya `childContextTypes` kullanarak belirli özellikleri bildirmesini gerektirir. Preact bu gerekliliğe sahip değildir: Tüm Bileşenler, varsayılan olarak `getChildContext()` tarafından üretilen tüm `context` özelliklerini alır.

## Sadece `preact/compat` için özellikler

`preact/compat`, React kodunu Preact'a çeviren **uyumluluk** katmanımızdır. Mevcut React kullanıcıları için, herhangi bir kodunuzu değiştirmeden Preact denemek için kolay bir yol olabilir; bunu, paketleyici yapılandırmanızda `birkaç alias ayarlayarak` yapabilirsiniz.

### Children API

`Children` API'si, `props.children` değerleriyle çalışmak için özel bir yöntem setidir. Preact için bu genellikle gereksizdir ve bunun yerine yerleşik dizi yöntemlerini kullanmayı öneririz. Preact'te `props.children`, ya bir Sanal DOM düğümü, ya `null` gibi boş bir değer ya da bir Sanal DOM düğümleri dizisidir. İlk iki durum en basit ve en yaygın olanlardır; çünkü `children`'ı olduğu gibi kullanabilir veya döndürebilirsiniz:

```jsx
// React:
function App(props) {
  return <Modal content={Children.only(props.children)} />
}

// Preact: doğrudan props.children kullanın:
function App(props) {
  return <Modal content={props.children} />
}
```

Bileşene geçirilen çocuklar üzerinde yinelemek için özel durumlar için, Preact, herhangi bir `props.children` değerini kabul eden ve düzleştirip normalize bir Sanal DOM düğümleri dizisi döndüren `toChildArray()` metodunu sağlar.

```jsx
// React
function App(props) {
  const cols = Children.count(props.children);
  return <div data-columns={cols}>{props.children}</div>
}

// Preact
function App(props) {
  const cols = toChildArray(props.children).length;
  return <div data-columns={cols}>{props.children}</div>
}
```

Bir React uyumlu `Children` API'si, mevcut bileşen kütüpleriyle sorunsuz entegrasyonu sağlamak için `preact/compat`'dan mevcuttur.

### Özel Bileşenler

[preact/compat] her uygulama için gerekli olmayan özel bileşenlerle birlikte gelir. Bunlar arasında:

- `PureComponent`: Sadece `props` veya `state` değiştiğinde güncellenir
- `memo`: `PureComponent` ile benzer bir ruhla ama özelleştirilmiş bir karşılaştırma fonksiyonu kullanmaya olanak tanır
- `forwardRef`: Belirtilen bir çocuk bileşene bir `ref` sağlamanıza olanak tanır.
- `Portals`: Mevcut ağaç yapısını farklı bir DOM konteynırına devam ettirilerek render eder
- `Suspense`: **deneysel** Ağaç hazır olmadığında yedek içerik görüntülemeye olanak tanır
- `lazy`: **deneysel** Asenkron kodu tembel yükleme ve bir ağacı hazır/değil olarak işaretleme.

[Proje Hedefleri]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[preact/compat]: /guide/v10/switching-to-preact
[MDN'nin Olay Referansı]: https://developer.mozilla.org/en-US/docs/Web/Events