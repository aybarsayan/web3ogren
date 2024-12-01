---
description: 'React uygulamalarını Preact ile değiştirmek isteyenler için gerekli bilgiler ve rehberlik.'
keywords: [Preact, React, geçiş, bileşen, performans, uyumluluk]
---

# Preact'e Geçiş (React'tan)

`preact/compat`, Preact ile birlikte birçok React ekosistemini kullanmanızı sağlayan uyumluluk katmanımızdır. Eğer mevcut bir React uygulamanız varsa Preact'i denemek için önerilen yoldur.

Bu, kod akışınızda veya kod tabanınızda herhangi bir değişiklik olmadan React/ReactDOM kodu yazmaya devam etmenizi sağlar. `preact/compat`, paket boyutunu yaklaşık 2kb artırır, ancak npm'de bulabileceğiniz mevcut React modüllerinin büyük çoğunluğunu destekleme avantajına sahiptir. `preact/compat` paketi, Preact'ın temelinin üzerine `react` ve `react-dom` ile çalışmasını sağlamak için gerekli tüm ince ayarları tek bir modül içinde sunar.

---



---

## compat'i Ayarlama

`preact/compat`'i ayarlamak için `react` ve `react-dom`'u `preact/compat` olarak takma adlandırmanız gerekir. `Başlarken` sayfası, farklı yapı yığınlarında nasıl takma adlandırma yapılandırılacağını detaylandırmaktadır.

## PureComponent

`PureComponent` sınıfı, `Component` ile benzer şekilde çalışır. Fark, `PureComponent`'in yeni prop'lar eski prop'larla eşit olduğunda render etmeyi atlamasıdır. Bunu yapmak için, her bir prop özelliği için referans eşitliğini kontrol ettiğimiz yüzeysel bir karşılaştırma yoluyla eski ve yeni prop'ları karşılaştırırız. Bu, gereksiz yeniden render'ları önleyerek uygulamaları hızlandırabilir. Varsayılan bir `shouldComponentUpdate` yaşam döngüsü kancası ekleyerek çalışır.

```jsx
import { render } from 'preact';
import { PureComponent } from 'preact/compat';

class Foo extends PureComponent {
  render(props) {
    console.log("render")
    return <div />
  }
}

const dom = document.getElementById('root');
render(<Foo value="3" />, dom);
// Logs: "render"

// İkinci kez render et, hiçbir şey loglamaz
render(<Foo value="3" />, dom);
```

> **Önemli Not:** `PureComponent`'in avantajının yalnızca render işleminin maliyetli olduğu durumlarda ortaya çıktığını unutmayın. Basit çocuk ağaçları için prop'ları karşılaştırmanın getirdiği yükün yanında sadece `render` yapmak daha hızlı olabilir.

## memo

`memo`, fonksiyonel bileşenler için `PureComponent`'e eşdeğerdir. Aynı karşılaştırma fonksiyonunu kullanır ancak kendi özel fonksiyonunuzu belirlemenize olanak tanır.

```jsx
import { memo } from 'preact/compat';

function MyComponent(props) {
  return <div>Merhaba {props.name}</div>
}

// Varsayılan karşılaştırma fonksiyonu ile kullanım
const Memoed = memo(MyComponent);

// Özel karşılaştırma fonksiyonu ile kullanım
const Memoed2 = memo(MyComponent, (prevProps, nextProps) => {
  // Sadece `name` değiştiğinde yeniden render et
  return prevProps.name === nextProps.name;
});
```

> **Dikkat:** Karşılaştırma fonksiyonu, iki props nesnesinin **eşit** olup olmadığını kontrol eder; oysa `shouldComponentUpdate` bunların farklı olup olmadığını kontrol eder.

## forwardRef

Bazen bir bileşen yazarken kullanıcının ağaçta daha aşağıda belirli bir referansa ulaşmasına izin vermek istediğinizde `forwardRef` ile `ref` özelliğini "aktarmak" mümkündür:

```jsx
import { createRef, render } from 'preact';
import { forwardRef } from 'preact/compat';

const MyComponent = forwardRef((props, ref) => {
  return <div ref={ref}>Merhaba dünya</div>;
})

// Kullanım: `ref`, içteki `div`'in referansını tutacak
const ref = createRef();
render(<MyComponent ref={ref} />, dom);
```

Bu bileşen, kütüphane yazarları için en kullanışlı olanıdır.

## Portallar

Nadir durumlarda, farklı bir DOM düğümüne render etmeye devam etmek isteyebilirsiniz. Hedef DOM düğümü **şu anda** render etmeye çalışmadan önce mevcut olmalıdır.

```html
<html>
  <body>
    <!-- Uygulama burada render edilecek -->
    <div id="app"></div>
    <!-- Modallar burada render edilmelidir -->
    <div id="modals"></div>
  </body>
</html>
```

```jsx
import { createPortal } from 'preact/compat';
import MyModal from './MyModal';

function App() {
  const container = document.getElementById('modals');
  return (
    <div>
      Ben uygulama
      {createPortal(<MyModal />, container)}
    </div>
  );
}
```

> **Uyarı:** Preact'ın tarayıcının olay sistemini yeniden kullanması nedeniyle, olayların Portal konteyneri aracılığıyla diğer ağaçta yukarı doğru kabarcıklanmayacağını unutmayın.

## Suspense

`Suspense`'in ana fikri, UI'nızın bazı bölümlerinin hala yüklenen bileşenler için bir tür yer tutucu içerik gösterebilmesini sağlamaktır. Bu durumun yaygın bir kullanım durumu, bir bileşeni render edebilmek için ağdan yüklemeniz gereken kod parçacığıdır.

```jsx
import { Suspense, lazy } from 'preact/compat';

const SomeComponent = lazy(() => import('./SomeComponent'));

// Kullanım
<Suspense fallback={<div>yükleniyor...</div>}>
  <Foo>
    <SomeComponent />
  </Foo>
</Suspense>
```

Bu örnekte, UI `SomeComponent` yüklenene ve Promise çözümlenene kadar `yükleniyor...` metnini gösterecektir.

> **Bilgilendirme:** Hem React hem de Preact'deki `Suspense`, henüz tam olarak tamamlanmamış ya da kesinleşmemiştir. React ekibi, doğrudan veri almak için doğrudan kullanıcıların etkileşimde bulunmasını hala aktif olarak teşvik etmezken, bazı Preact kullanıcıları son birkaç yılda bunu memnuniyetle kullanmaktadır. Güncel referans için lütfen [izleyicimizi](https://github.com/preactjs/preact/issues?q=is%3Aissue+is%3Aopen+suspense) kontrol edin; ancak genelde üretimde kullanılabilir olduğu kabul edilmektedir.
>
> **Not:** Bu site, gördüğünüz tüm içeriği yüklemek için suspense tabanlı bir veri alma stratejisi kullanılarak inşa edilmiştir.