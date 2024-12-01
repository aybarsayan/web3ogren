---
description: Sunucu Tarafı Render (SSR) ile Preact uygulamanızın içeriklerini hızlı bir şekilde sunucuda gösterebilir, performansınızı artırabilirsiniz.
keywords: [Sunucu Tarafı Render, SSR, Preact, içerik gösterimi, asenkron render]
---

# Sunucu Tarafı Render

Sunucu Tarafı Render (genellikle "SSR" olarak kısaltılır), uygulamanızı HTML dizesine render etmenize olanak tanır ve bu, yükleme süresini iyileştirmek için istemciye gönderilebilir. Bunun dışında, SSR'nin gerçekten faydalı olduğu diğer senaryolar, örneğin test etme gibi durumlar vardır.

---



---

## Kurulum

Preact için sunucu tarafı render edici, [kendi repository'sinde](https://github.com/preactjs/preact-render-to-string/) yer almaktadır ve tercih ettiğiniz paketleyici aracılığıyla kurulabilir:

```sh
npm install -S preact-render-to-string
```

Yukarıdaki komut tamamlandıktan sonra, hemen kullanmaya başlayabiliriz.

## Temel Kullanım

Temel işlevselliği en iyi şekilde basit bir kod parçasıyla açıklayabiliriz:

```jsx
import render from 'preact-render-to-string';
import { h } from 'preact';

const name = 'Preact Kullanıcısı!'
const App = <div class="foo">Merhaba {name}</div>;

console.log(render(App));
// <div class="foo">Merhaba Preact Kullanıcısı!</div>
```

:::tip
Temel kullanımı anlamak için bu örnek kodu gözden geçirin ve ardından kendi uygulamanıza uyarlayın.
:::

## `Suspense` ve `lazy` ile Asenkron Render

Dinamik olarak yüklenen bileşenleri render etmeniz gerektiğini görebilirsiniz, örneğin `Suspense` ve `lazy` kullanarak kod bölme işlemi yapmak için (diğer bazı kullanım durumlarıyla birlikte). Asenkron render edici, vaatlerin çözülmesini bekleyecek ve HTML dizesini tamamen oluşturmanızı sağlayacaktır:

```jsx
// page/home.js
export default () => {
    return <h1>Anasayfa</h1>;
};
```

```jsx
// main.js
import { Suspense, lazy } from 'preact/compat';

// Lazy bileşenin oluşturulması
const HomePage = lazy(() => import('./pages/home'));

const Main = () => {
    return (
        <Suspense fallback={<p>Yükleniyor</p>}>
            <HomePage />
        </Suspense>
    );
};
```

Yukarıdaki, sunucu tarafı render'dan faydalanmak için herhangi bir değişiklik gerektirmeyen, kod bölme kullanan tipik bir Preact uygulama kurulumu için geçerlidir. 

:::info
Asenkron render işlemleriniz sırasında hata yönetimini unutmayın!
:::

Bunu render etmek için, temel kullanım örneğinden biraz sapacağız ve uygulamamızı render etmek için `renderToStringAsync` ihracını kullanacağız:

```jsx
import { renderToStringAsync } from 'preact-render-to-string';
import { Main } from './main';

const main = async () => {
    // Lazy bileşenlerin render edilmesi
    const html = await renderToStringAsync(<Main />);

    console.log(html);
    // <h1>Anasayfa</h1>
};

// Çalıştırma & hata yönetimi
main().catch((error) => {
    console.error(error);
});
```

## Yüzeysel Rendering

Bazı amaçlar için, tüm ağaç yerine yalnızca bir seviyeyi render etmenin genellikle daha iyi olduğunu görebilirsiniz. Bu amaçla, döndürdükleri değer yerine çocuk bileşenleri ismine göre yazdıran bir yüzeysel render ediciye sahibiz.

```jsx
import { shallow } from 'preact-render-to-string';
import { h } from 'preact';

const Foo = () => <div>foo</div>;
const App = <div class="foo"><Foo /></div>;

console.log(shallow(App));
// <div class="foo"><Foo /></div>
```

## Güzel Mod

Elde edilen çıktıyı daha insan dostu bir şekilde almak istiyorsanız, sizi düşündük! `pretty` seçeneğini geçerek, beklenildiği gibi boşlukları koruyacak ve çıktıyı girintileyeceğiz.

```jsx
import render from 'preact-render-to-string/jsx';
import { h } from 'preact';

const Foo = () => <div>foo</div>;
const App = <div class="foo"><Foo /></div>;

console.log(render(App, {}, { pretty: true }));
// Loglar:
// <div class="foo">
//   <div>foo</div>
// </div>
```

## JSX Mod

JSX render modu, herhangi bir tür anlık görüntü testi yapıyorsanız oldukça kullanışlıdır. Çıktıyı sanki JSX'de yazılmış gibi render eder.

```jsx
import render from 'preact-render-to-string/jsx';
import { h } from 'preact';

const App = <div data-foo={true} />;

console.log(render(App));
// Loglar: <div data-foo={true} />
```