---
description: React'tan Preact'a geçiş yapmak için iki ana yaklaşımı inceleyin preact-compat` kullanarak geçiş veya doğrudan Preact'a geçiş. Her iki yöntem de uygulama boyutunu küçültür ve performansı artırır.
keywords: [React, Preact, geçiş, preact-compat, uygulama boyutu, performans, yapılandırma]
---

# Preact'a Geçiş (React'tan)

React'tan Preact'a geçmek için iki farklı yaklaşım vardır:

1. `preact-compat` takma adını yüklemek
2. İthallerinizi `preact` olarak değiştirmek ve uyumsuz kodu kaldırmak

---



---

## Kolay: `preact-compat` Takma Adı

Preact'a geçiş, `react` ve `react-dom` için `preact-compat` yüklemek ve takma adlamak kadar kolay olabilir. Bu, kod tabanınızda veya iş akışınızda hiçbir değişiklik olmadan React/ReactDOM kodu yazmaya devam etmenizi sağlar. `preact-compat`, paket boyutunu yaklaşık 2kb kadar artırır, ancak npm'de bulabileceğiniz mevcut React modüllerinin büyük çoğunluğunu destekleme avantajına sahiptir. `preact-compat` paketi, Preact'ın temelindekileri alarak `react` ve `react-dom` gibi çalışması için gereken tüm ayarlamaları tek bir modülde sağlar.

Yükleme işlemi iki adımdan oluşur. Öncelikle, `preact` ve `preact-compat`'ı yüklemeniz gerekir (bunlar ayrı paketlerdir):

```sh
npm i -S preact preact-compat
```

Bu bağımlılıkları yükledikten sonra, yapı sisteminizi React ithallerini Preact'a yönlendirecek şekilde yapılandırın.

### preact-compat'ı Takma Adlama

Bağımlılıkları yüklediğinize göre, yapı sisteminizi `react` veya `react-dom` arayan her ithali `preact-compat` ile yönlendirecek şekilde yapılandırmanız gerekecek.

#### Webpack ile Takma Adlama

:::tip
Webpack yapılandırmasını güncellemeyi unutmayın!
:::

Aşağıdaki [resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealias) yapılandırmasını `webpack.config.js` dosyanıza ekleyin:

```json
{
  "resolve": {
    "alias": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```

#### Parcel ile Takma Adlama

Parcel, `"aliases"` anahtarı altında `package.json` içinde modül takma adları tanımlamayı destekler:

```json
{
  "alias": {
    "react": "preact-compat",
    "react-dom": "preact-compat"
  }
}
```

#### Browserify ile Takma Adlama

Browserify kullanıyorsanız, takma adlar [aliasify](https://www.npmjs.com/package/aliasify) dönüşümünü ekleyerek tanımlanabilir.

Öncelikle, dönüşümü yükleyin:  `npm i -D aliasify`

Sonrasında, `package.json` dosyanızda aliasify'a react ithallerini preact-compat'a yönlendirmesini söyleyin:

```json
{
  "aliasify": {
    "aliases": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```

Preact-compat için yaygın bir kullanım durumu, React uyumlu üçüncü taraf modüllerini desteklemektir. Browserify kullanıyorsanız, [Aliasify](https://www.npmjs.com/package/aliasify) dönüşümünü **global** olacak şekilde `--global-transform` [Browserify seçeneği](https://github.com/browserify/browserify) ile yapılandırmayı unutmayın.

#### Manuel Olarak Takma Adlama

:::warning
Bir yapı sistemi kullanmıyorsanız, dikkatli olun!
:::

Bir yapı sistemi kullanmıyorsanız veya `preact-compat`'a kalıcı olarak geçmek istiyorsanız, kod tabanınızdaki tüm ithalleri/bulmaları bulup değiştirebilirsiniz:

> **bul:**    `(['"])react(-dom)?\1`
>
> **değiştir:** `$1preact-compat$1`

Bu durumda, doğrudan `preact`'a geçmeyi tercih edebilirsiniz, çünkü Preact'ın temel özellikleri oldukça kapsamlıdır ve birçok geleneksel React kod tabanı az çaba ile doğrudan `preact`'a geçirilebilir. Bu yaklaşım bir sonraki bölümde ele alınmaktadır.

#### Node'da modül-alias kullanarak Takma Adlama

SSR amaçları için, sunucu tarafı kodunuzu inşa etmek için webpack gibi bir paketleyici kullanmıyorsanız, `react`'ı `preact` ile değiştirmek için [module-alias](https://www.npmjs.com/package/module-alias) paketini kullanabilirsiniz.

```sh
npm i -S module-alias
```

`patchPreact.js`:

```js
var path = require('path')
var moduleAlias = require('module-alias')

moduleAlias.addAliases({
  'react': 'preact-compat/dist/preact-compat.min',
  'react-dom': 'preact-compat/dist/preact-compat.min',
  'create-react-class': path.resolve(__dirname, './create-preact-class')
})
```

`create-preact-class.js`:

```js
import { createClass } from 'preact-compat/dist/preact-compat.min'
export default createClass
```

Eğer Babel ile sunucunuzda yeni `import` sözdizimini kullanıyorsanız, yukarıdaki satırları diğer ithallerinizden önce yazmak çalışmayacaktır çünkü Babel, tüm ithalleri bir modülün en üstüne taşır. Bu durumda, yukarıdaki kodu `patchPreact.js` olarak kaydedin ve ardından dosyanızın en üstünde (`import './patchPreact'`) içe aktarın. `module-alias` kullanımını [buradan](https://www.npmjs.com/package/module-alias) daha fazla okuyabilirsiniz.

`module-alias` paketi olmadan doğrudan node'da takma adlama yapmak da mümkündür. Bu, Node'un modül sisteminin dahili özelliklerine dayanır, bu yüzden dikkatli ilerleyin. Manuel olarak takma adlama yapmak için:

```js
// patchPreact.js
var React = require('react')
var ReactDOM = require('react-dom')
var ReactDOMServer = require('react-dom/server')
var CreateReactClass = require('create-react-class')
var Preact = require('preact-compat/dist/preact-compat.min')
var Module = module.constructor
Module._cache[require.resolve('react')].exports = Preact
Module._cache[require.resolve('react-dom')].exports = Preact
Module._cache[require.resolve('create-react-class')].exports.default = Preact.createClass
```

### Yapılandırma ve Test

**İşiniz bitti!**
Artık yapınızı çalıştırdığınızda, tüm React ithalleriniz `preact-compat` ithal etmeye başlayacak ve paketiniz çok daha küçük olacaktır. Test kümenizi çalıştırmak ve elbette uygulamanızı yüklemek her zaman iyi bir fikir.

---

## Optimal: Preact'a Geçiş

Kendi kod tabanınızda `preact-compat` kullanmanız gerekli değildir ki React'tan Preact'a geçiş yapasınız. Preact'ın API'si React'ın neredeyse aynısıdır ve birçok React kod tabanı çok az veya hiç değişiklik yapmadan geçirilebilir.

Genellikle, Preact'a geçiş süreci birkaç adımdan oluşur:

### 1. Preact'ı Yükleyin

Bu basit: onu kullanmak için kütüphaneyi yüklemeniz gerekir!

```sh
npm install --save preact  # veya: npm i -S preact
```

### 2. JSX Pragma: `h()` olarak dönüştürme

> **Arka Plan:** [JSX] dil uzantısı React'tan bağımsızdır, ancak popüler
> derleyiciler (transpiler) [Babel] ve [Bublé], JSX'i varsayılan olarak `React.createElement()` çağrılarına dönüştürmektedir.
> Bunun tarihsel sebepleri vardır, fakat JSX'in dönüştürdüğü fonksiyon çağrılarının aslında [Hyperscript] adı verilen mevcut bir teknoloji olduğunu anlamak önemlidir. Preact, buraya duyduğu saygıyı gösterir ve JSX'in basitliğini `h()` fonksiyonu olarak kullanarak daha iyi anlamayı teşvik eder.
>
> **Kısaca:** `React.createElement()`'ı preact'ın `h()` ile değiştirmemiz gerekiyor.

JSX'de "pragma", her bir elementi oluşturan bir fonksiyonun adıdır:

> `` `h('div')`'e dönüştürülür
>
> `` `h(Foo)`'ya dönüştürülür
>
> `Merhaba` `h('a', { href:'/' }, 'Merhaba')`'ya dönüşür

Yukarıdaki her örnekte, `h`, JSX Pragma olarak belirlediğimiz fonksiyon adıdır.

#### Babel ile

Eğer Babel kullanıyorsanız, JSX Pragma'sını `.babelrc` veya `package.json` (hangi tercih ederseniz) dosyanızda ayarlayabilirsiniz:

```json
{
  "plugins": [
    ["transform-react-jsx", { "pragma": "h" }]
  ]
}
```

#### Yorumlar ile

Eğer Babel ile desteklenen bir çevrimiçi editörde çalışıyorsanız (JSFiddle veya Codepen gibi), JSX Pragma'sını kodunuzun üst kısmında bir yorum tanımlayarak ayarlayabilirsiniz:

`/** @jsx h */`

#### Bublé ile

[Bublé], varsayılan olarak JSX desteği ile birlikte gelir. Sadece `jsx` seçeneğini ayarlayın:

`buble({ jsx: 'h' })`

### 3. Herhangi Bir Eski Kodu Güncelleyin

Preact, React ile API uyumluluğunu sağlamaya çalışsa da, arayüzün bazı bölümleri kasıtlı olarak dahil edilmemiştir. En dikkat çekici olanı `createClass()` işlevidir. Sınıflar ve OOP konusundaki görüşler oldukça farklılık gösterir, ancak JavaScript sınıflarının VDOM kütüphanelerinde bileşen türlerini temsil etmek için içsel olarak kullanıldığını anlamak önemlidir; bu, bileşen yaşam döngülerini yönetmenin incelikleriyle ilgilidir.

Kod tabanınız `createClass()`'a çok bağımlıysa, hala mükemmel bir seçeneğiniz var: Laurence Dorman, Preact ile doğrudan çalışan [bağımsız `createClass()` uygulaması](https://github.com/ld0rman/preact-classless-component) sunmaktadır ve bu sadece birkaç yüz bayttır. Alternatif olarak, `createClass()` çağrılarınızı [preact-codemod](https://github.com/vutran/preact-codemod) kullanarak ES Sınıflarına otomatik olarak dönüştürebilirsiniz.

Dikkate değer başka bir fark ise, Preact'ın varsayılan olarak yalnızca İşlevsel Referansları desteklemesidir. Dize referansları React'ta çıkarılmıştır ve kısa süre içinde kaldırılacaktır, çünkü karmaşıklık getirirlerken bile pek fazla kazanım sağlamazlar. Dize referanslarını kullanmaya devam etmek istiyorsanız, [bu küçük linkedRef fonksiyonu](https://gist.github.com/developit/63e7a81a507c368f7fc0898076f64d8d), Dize Referanslarının yaptığı gibi `this.refs.$$`'yi dolduran gelecek uyumlu bir sürüm sunar. İşlevsel Referanslar etrafındaki bu küçük sarmalayıcının basitliği, neden İşlevsel Referansların ileriye doğru tercih edilen seçim olduğunu gösterir.

### 4. Kök Render'ı Basitleştirin

> **Not:** React 0.13'ten itibaren, `render()` `react-dom` modülü tarafından sağlanmıştır. Preact, DOM render'ı için ayrı bir modül kullanmaz, çünkü yalnızca harika bir DOM render'ı olmayı hedefler. Bu nedenle, kod tabanınızı Preact'a geçirmenin son adımı `ReactDOM.render()`'ı preact'ın `render()`'ına değiştirmektir:

```diff
- ReactDOM.render(<App />, document.getElementById('app'));
+ render(<App />, document.body);
```

Preact'ın `render()`'ının yıkıcı olmadığını belirtmek de önemlidir, bu nedenle `` içine render yapmak tamamen kabul edilebilir (hatta teşvik edilir). Bu, Preact'ın size verdiğiniz kök elemanı kontrol etmediği anlamına gelir. `render()`'ın ikinci argümanı aslında `parent`'dır - yani içerisine render yapacağınız bir DOM elemanıdır. Eğer kökten yeniden render yapmak (belki de Sıcak Modül Değiştirme için) isterseniz, `render()` üçüncü argüman olarak değiştirilmek üzere bir elemanı kabul eder:

```js
// ilk render:
render(<App />, document.body);

// yerinde güncelleme:
render(<App />, document.body, document.body.lastElementChild);
```

Yukarıdaki örnekte, daha önceden render edilen kökün son çocuğunu kullandığımızı görüyoruz. Bu çoğu durumda (jsfiddles, codepens, vb.) işe yarasa da, daha fazla kontrol sahibi olmak en iyisidir. İşte bu yüzden `render()` kök elementi döndürür: yerinde yeniden render yapmak için üçüncü argüman olarak geçersiniz. Aşağıdaki örnek, Webpack'in Sıcak Modül Değişikliği güncellemelerine yanıt olarak nasıl yeniden render yapacağınızı göstermektedir:

```js
// kök, uygulamanızın kök DOM Elemanını tutuyor:
let root;

function init() {
  root = render(<App />, document.body, root);
}
init();

// örnek: Webpack HMR güncellemesinde yeniden render yap:
if (module.hot) module.hot.accept('./app', init);
```

Tüm teknik, [preact-boilerplate](https://github.com/developit/preact-boilerplate/blob/master/src/index.js#L6-L18) içinde görülebilir.

[babel]: https://babeljs.io
[bublé]: https://buble.surge.sh
[JSX]: https://facebook.github.io/jsx/
[JSX Pragma]: http://www.jasonformat.com/wtf-is-jsx/
[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript