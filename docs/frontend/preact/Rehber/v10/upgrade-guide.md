---
description: Preact 8.x uygulamanızı Preact X'e yükseltmek için gerekli adımları ayrıntılı bir şekilde açıklayan bir kılavuz.
keywords: [Preact, Yükseltme, Preact X, Uygulama, Geliştirme, Compat, Kütüphaneler]
---

# Preact 8.x'ten Yükseltme

Bu belge, mevcut bir Preact 8.x uygulamasını Preact X'e yükseltmek için sizi yönlendirmeyi amaçlamaktadır ve 3 ana bölüme ayrılmıştır.

Preact X, `Fragments`, `hooks` gibi birçok yeni ve heyecan verici özellik getiriyor ve React ekosistemi ile uyumluluğu önemli ölçüde geliştirilmiştir. Herhangi bir kesme değişikliğini mümkün olan en azda tutmaya çalıştık, ancak tümünü tamamen ortadan kaldırmak, özellik setimizden feragat etmeden mümkün olmadı.

---



---

## Bağımlılıkların Yükseltilmesi

:::info
_Bu kılavuz boyunca `npm` istemcisini kullanacağız ve komutlar diğer paket yöneticileri olan `yarn` gibi rahatça uygulanabilir olacaktır._
:::

Başlayalım! İlk olarak Preact X'i kurun:

```bash
npm install preact
```

Compat artık çekirdek kütüphaneye taşındığı için `preact-compat`'a ihtiyacınız yok. Bunu kaldırmak için:

```bash
npm remove preact-compat
```

### Preact ile ilgili kütüphaneleri güncelleme

Kullanıcılarımız (özellikle kurumsal kullanıcılarımız) için kararlı bir ekosistem sağlamak amacıyla Preact X ile ilgili kütüphanelere büyük sürüm güncellemeleri yayınladık. `preact-render-to-string` kullanıyorsanız, bunu X ile uyumlu bir sürüme güncellemeniz gerekmektedir.

| Kütüphane                   | Preact 8.x | Preact X |
| --------------------------- | ---------- | -------- |
| `preact-render-to-string`   | 4.x        | 5.x      |
| `preact-router`             | 2.x        | 3.x      |
| `preact-jsx-chai`           | 2.x        | 3.x      |
| `preact-markup`             | 1.x        | 2.x      |

### Compat çekirdeğe taşındı

Üçüncü taraf React kütüphanelerinin Preact ile çalışmasını sağlamak için `preact/compat` aracılığıyla içe aktarılabilen bir **uyumluluk** katmanı sunuyoruz. Önceden ayrı bir paket olarak mevcutken, koordinasyonu daha kolay hale getirmek için bunu çekirdek deposuna taşıdık. Bu yüzden mevcut içe aktarma veya takma ad bildirimlerinizi `preact-compat`'tan `preact/compat`'a (slash'a dikkat edin) değiştirmeniz gerekecek.

:::warning
Burada yazım hatası yapmamaya dikkat edin. Yaygın bir hata, `compat` yerine `compact` yazmaktır. Bununla ilgili sorun yaşıyorsanız, `compat`'ı React için `uyumluluk` katmanı olarak düşünün. İsim buradan geliyor.
:::

### Üçüncü taraf kütüphaneler

Kesme değişikliklerinin doğası gereği, bazı mevcut kütüphaneler X ile çalışmayı durdurabilir. Çoğu zaten beta takvimimizi takip ederek güncellenmiştir, ancak bu durumun geçerli olmadığı bir kütüphane ile karşılaşmanız da mümkündür.

#### preact-redux

`preact-redux`, henüz güncellenmeyen kütüphanelerden biridir. İyi haber şu ki, `preact/compat` çok daha React uyumlu ve `react-redux` adı verilen React bağlamalarıyla kutudan çıkar çıkmaz çalışmaktadır. Buna geçmek durumu çözecektir. Bağlayıcınızda `react` ve `react-dom`'u `preact/compat`'a takma ad verdiğinizden emin olun.

1. `preact-redux`'u kaldırın
2. `react-redux`'u yükleyin

#### mobx-preact

React ekosistemi ile uyumluluğumuzun artması nedeniyle bu paket artık gerekli değil. Bunun yerine `mobx-react` kullanın.

1. `mobx-preact`'ı kaldırın
2. `mobx-react`'ı yükleyin

#### styled-components

Preact 8.x, yalnızca `styled-components@3.x` sürümüyle çalıştı. Preact X ile bu engel ortadan kalktı ve en son `styled-components` sürümüyle çalışıyoruz. `react`'i `preact` ile doğru bir şekilde `takma ad verdiğinizden` emin olun.

#### preact-portal

`Portal` bileşeni artık `preact/compat`'ın bir parçasıdır.

1. `preact-portal`'ı kaldırın
2. `createPortal`'ı `preact/compat`'dan içe aktarın

---

## Kodunuzu Hazırlama

### İsimli dışa aktarımlar kullanma

Ağaç sarsıntısını daha iyi desteklemek için artık preact çekirdeğinde bir `default` dışa aktarımı ile gelmiyoruz. Bu yaklaşımın avantajı, yalnızca ihtiyaç duyduğunuz kodun paketinizde dahil edilmesidir.

```js
// Preact 8.x
import Preact from "preact";

// Preact X
import * as preact from "preact";

// Tercih edilen: İsimli dışa aktarımlar (8.x ve Preact X'te çalışır)
import { h, Component } from "preact";
```

:::note
_Bu değişiklik `preact/compat`'ı etkilemez. Hala hem isimli hem de bir default dışa aktarıma sahip olarak React ile uyumlu kalmıştır._
:::

### `render()` her zaman mevcut çocukları karşılaştırır

Preact 8.x'te, `render()` çağrıları her zaman öğeleri konteynıra eklerdi.

```jsx
// Mevcut markup:
<body>
  <div>merhaba</div>
</body>

render(<p>foo</p>, document.body);
render(<p>bar</p>, document.body);

// Preact 8.x çıktısı:
<body>
  <div>merhaba</div>
  <p>foo</p>
  <p>bar</p>
</body>
```

Preact 8'de mevcut çocukları karşılaştırmak için mevcut bir DOM düğümü sağlanması gerekiyordu.

```jsx
// Mevcut markup:
<body>
  <div>merhaba</div>
</body>

let element;
element = render(<p>foo</p>, document.body);
element = render(<p>bar</p>, document.body, element);

// Preact 8.x çıktısı:
<body>
  <div>merhaba</div>
  <p>bar</p>
</body>
```

Preact X'te, `render()` her zaman konteynır içindeki DOM çocuklarını karşılaştırır. Bu nedenle, konteynırınız Preact tarafından render edilmemiş DOM içeriyorsa, Preact bunu geçirdiğiniz öğelerle karşılaştırmaya çalışacaktır. Bu yeni davranış, diğer VDOM kütüphanelerinin davranışına daha yakın bir şekilde eşleşmektedir.

```jsx
// Mevcut markup:
<body>
  <div>merhaba</div>
</body>

render(<p>foo</p>, document.body);
render(<p>bar</p>, document.body);

// Preact X çıktısı:
<body>
  <p>bar</p>
  <div>merhaba</div>
</body>
```

:::tip
React'in `render` yönteminin tam olarak nasıl çalıştığını arıyorsanız, `preact/compat` tarafından dışa aktarılan `render` yöntemini kullanın.
:::

### `props.children` her zaman bir `dizi` değildir

Preact X'te artık `props.children`'in her zaman `dizi` tipi olmasını garanti edemiyoruz. Bu değişiklik, `Fragments` ve `dizi` döndüren bileşenlerle ilgili ayrıştırma belirsizliklerini çözmek için gerekliydi. Çoğu durumda bunu bile fark etmeyebilirsiniz. Ancak, `props.children` üzerinde dizi yöntemleri kullanacağınız yerlerde `toChildArray` ile sarmalanması gerekir. Bu işlev her zaman bir dizi döndürecektir.

```jsx
// Preact 8.x
function Foo(props) {
  // `.length` bir dizi yöntemidir. Preact X'te `props.children` bir
  // dizi değilse, bu satır bir istisna oluşturacaktır
  const count = props.children.length;
  return <div>{count} tane çocuğum var </div>;
}

// Preact X
import { toChildArray } from "preact";

function Foo(props) {
  const count = toChildArray(props.children).length;
  return <div>{count} tane çocuğum var </div>;
}
```

### `this.state`'e senkronize bir şekilde erişmeyin

Preact X'te bir bileşenin durumu artık senkronize bir şekilde değiştirilmez. Bu, `setState` çağrısından hemen sonra `this.state`'den okumak, önceki değerleri döndürecektir. Bunun yerine, bir önceki değerlere bağlı durumu değiştirmek için bir geri çağırma işlevi kullanmalısınız.

```jsx
this.state = { counter: 0 };

// Preact 8.x
this.setState({ counter: this.state.counter + 1 });

// Preact X
this.setState(prevState => {
  // Alternatif olarak buraya `null` döndürerek durum güncellemesini durdurabilirsiniz
  return { counter: prevState.counter + 1 };
});
```

### `dangerouslySetInnerHTML` çocukların karşılaştırılmasını atlayacaktır

Bir `vnode` 'nin `dangerouslySetInnerHTML` özelliği ayarlandığında Preact `vnode`'nin çocuklarını karşılaştırmaktan kaçınır.

```jsx
<div dangerouslySetInnerHTML="foo">
  <span>Atlanacağım</span>
  <p>Ben de</p>
</div>
```

---

## Kütüphane yazarları için notlar

Bu bölüm, Preact X ile kullanılabilecek paketleri sürdüren kütüphane yazarları içindir. Bir tane yazmıyorsanız bu bölümü atlayabilirsiniz.

### `VNode` şekli değişti

Aşağıdaki özellikleri yeniden adlandırdık/taşındık:

- `attributes` -> `props`
- `nodeName` -> `type`
- `children` -> `props.children`

Çok çaba göstermemize rağmen, her zaman React için yazılmış üçüncü taraf kütüphanelerle kenar durumlarıyla karşılaştık. Bu değişiklik, `vnode` şeklimizde birçok zor tespit edilebilecek hatayı ortadan kaldırdı ve `compat` kodumuzu çok daha temiz hale getirdi.

### Yüksek bir metin düğümüne artık katılmıyor

Preact 8.x'te bitişik metin notlarını bir optimizasyon olarak birleştirdiğimiz bir özellik vardı. Bu, X için artık geçerli değil çünkü DOM'a doğrudan karşılaştırma yapmıyoruz. Aslında, bunun X'teki performansı etkilediğini fark ettik, bu yüzden kaldırdık. Aşağıdaki örneğe bakın:

```jsx
// Preact 8.x
console.log(<div>foo{"bar"}</div>);
// Aşağıdakine benzer bir yapıyı kaydeder:
//   div
//     metin

// Preact X
console.log(<div>foo{"bar"}</div>);
// Aşağıdakine benzer bir yapıyı kaydeder:
//   div
//     metin
//     metin
```