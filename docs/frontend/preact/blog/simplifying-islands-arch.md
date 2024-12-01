---
title: Adaları Basitleştirme Mimarisi
date: 2024-10-27
authors:
  - reaper
description: Bu kılavuz, ada mimarisinin nasıl çalıştığını anlamanızı sağlamak ve çevrenizdeki araçları kullanarak kendi sisteminizi kurabilmeniz için bir geçiş sunmaktadır. Adalar mimarisi ile sunucu tarafı render'ı ve istemci hidrasyonunu basit bir şekilde uygulayabilirsiniz.
keywords: [ada mimarisi, sunucu render, ön uç teknolojisi, preact, hidrasyon]
---

> Bu, https://barelyhuman.github.io/preact-islands-diy adresindeki orijinal yazının biraz değiştirilmiş bir versiyonudur.

# Adalar

## Giriş

Bu kılavuz, ada mimarisinin nasıl çalıştığını anlamak ve etrafınızdaki araçları kullanarak kendi sisteminizi kurabilmek için basit bir geçiştir.

Öncelikle, adalar nedir? Kaynağı hakkında daha fazla bilgi edinebilirsiniz:

[Adalar Mimarisi - Jason Miller &rarr;](https://jasonformat.com/islands-architecture/)

## Neden?

:::info
Sunucu render'ı ile bir süre çalışan birçok geliştirici için, frontend teknolojisinin bir noktada sunucu render'ına doğru bir yön almasını bekliyorduk çünkü veri alma ve işleme işlemi, veriye daha yakın olduğunuz sunucuda neredeyse her zaman daha hızlıdır.
:::

Bu, birçok nedenden biridir; ancak webin tartıştığı başka nedenler de var, bu yüzden bunu akıllı insanlara bırakalım.

Konsepti uygulamaya geçelim.

# Başlarken

## Temel Uygulama

Temel uygulama, çoğu SSR + İstemci Hidrasyonu uygulaması için genelleştirilebilir.

İşte bir genel bakış:

1. Görünümü başlangıçta sunucuda statik bir sayfa olarak render edin.
2. İstemcide uygulamayı hidrate edin.

Her birinin detaylarına girelim.

### Başlangıç Sunucu Render'ı

Bu aşamada, kullandığınız UI kütüphanesi ile bileşen ağacını inşa edersiniz, Vue, React, Preact, Solid, vb. Ve sonra bileşen ağacını sadece statik ve hemen hesaplanabilir verilerle düzleştirirsiniz. **Bu durumda, yan etkiler ve durum yönetimi ile ilgili kod çalıştırılmaz**.

> Çıktı, istemciye gönderebileceğiniz statik bir HTML belgesidir. — Preact Takımı

Bu kılavuz [preact](https://preactjs.com/) ile ilgili olduğu için, bunu başarmamıza yardımcı olan preact takımından bir kütüphane kullanacağız.

İşte sunucuda bir bileşeni render etmenin çok temel bir uygulamasının nasıl görüneceği.

`express.js` burada çoğu yeni başlayan için ilk tercih olduğu için bir örnek olarak kullanılıyor; süreç, seçtiğiniz başka bir web sunucu motoru için çoğunlukla aynıdır. Hapi, Koa, Fastify, vb.

```js
// server.js
import { h } from 'preact'
import preactRenderToString from 'preact-render-to-string'

// ...kalan express.js ayarları

const HomePage = () => {
  return h('h1', {}, 'merhaba')
}

app.get('/', async (req, res) => {
  res.send(preactRenderToString(h(HomePage, {})))
})
```

Burada çoğu işi `preactRenderToString` hallediyor, ve bizim yaptığımız sadece bileşenler yazmak. Biraz paketleme sihri ile JSX yazarak işi daha dostça hale getirebiliriz.

### Hidrasyon

Tamam, çevrimiçi olarak akıllı insanların sıkça kullandığı bir terim.

- Kısmi Hidrasyon
- İlerici Hidrasyon
- daha fazlasını buldukça ekleyin vb.

:::tip
Basit bir şekilde tarif etmek gerekirse, bu, etkileşimi _mevcut_ durum/etkiler/olaylar olan bir DOM elemanına bağlamak anlamına gelir.
:::

Bu _mevcut_ durum/etkiler/olaylar sunucudan gönderilebilir, ancak kendi başına yönetebilen bir bileşen ile çalışıyorsanız ve mantık içerisinde iyi bir şekilde izole edilmişse, sadece gerekli bağlamalarla bileşeni DOM'a monte edersiniz.

Bir örnek olarak, bu biraz şöyle görünebilir:

```js
// client.js
import { hydrate } from 'preact'
import Counter from './Counter'

const main = () => {
  // sunucunun da bileşeni bu ID ile render ettiğini varsayıyoruz.
  const container = document.getElementById('counter')
  hydrate(h(Counter, {}), container)
}

main()
```

Sunucu render aşamasına benzer şekilde, bir bileşeni hidrat etmeye yardımcı olması için `preact`'den bir yardımcı fonksiyon kullanıyoruz. `render` kullanabilirsiniz, ama o zaman gerçek element zaten sunucu tarafından render edilmiş bir şeydir, onu tekrar render etmek mantıksız olur, bu yüzden sadece preact'ı ihtiyaç duyulan olay ve durum verilerini eklemeye çalışması için yönlendiriyoruz.

Yukarıda açıkladığım şey, Kısmi Hidrasyon olarak adlandırılır; çünkü tüm uygulamayı hidrate etmiyorsunuz, sadece belirli kısımlarını hidrat ediyorsunuz.

## Derinlemesine

Ada tabanlı bir uygulama oluşturmak için bilmeniz gereken başka bir şey yok; ama şimdi bunu uygulamaya geçelim.

# Kod

Kodu seviye mimarisi, çoğu SSR modeline çok benzer ve Vite, kendi SSR'nizi nasıl yazacağınız konusunda iyi bir açıklama sunar.

[&rarr; Vite Kılavuzları - Sunucu Tarafı Render'ı](https://vitejs.dev/guide/ssr.html)

Bunun yerine, açıklamayı biraz daha ayrıntılı hale getirmek için webpack kullandık.

> Not: Referans verilen kodu [barelyhuman/preact-islands-diy](http://github.com/barelyhuman/preact-islands-diy/) adresinden alabilirsiniz.

## `server/app.js`

`server/app.js` dosyasıyla başlıyoruz. Eğer kod tabanını yerel olarak açtıysanız, bu yazarken faydalı olacaktır.

Aşağıdaki kod parçası yalnızca gerekli alanları vurgulamaktadır.

```js
import preactRenderToString from 'preact-render-to-string'
import HomePage from '../pages/HomePage.js'
import { h } from 'preact'
import { withManifestBundles } from '../lib/html.js'

const app = express()

app.get('/', async (req, res) => {
  res.send(
    withManifestBundles({
      body: preactRenderToString(h(HomePage, {})),
    })
  )
})
```

İçeriğe baktığımızda, `Başlarken` bölümünde bahsedilenlerle aynı içeriği görüyoruz ve çok fazla değişiklik olmamıştır.

Burada tek ekleme, konuşacağımız `withManifestBundles` yardımcı fonksiyonudur.

## `lib/html.js`

HTML yardımı, şablonun farklı varyantlarında farklıdır ama biz sadece `ana` dalındaki `webpack` versiyonunu inceleyeceğiz.

Yardımcının temel kullanım durumu, webpack tarafından paketlenen dosyaların neler olduğunu ve üretimde kullanıldığında bunların hashed yollarını listeleyen bir manifest jsonunu incelemektir.

:::warning
Bu gereklidir çünkü hash'i bilemeyeceğiz ve bunu anlamanın programatik bir yoluna ihtiyacımız var.
:::

Bu manifest, birazdan bakacağımız webpack'in istemci yapılandırması tarafından oluşturulmaktadır.

```js
// istemci çıktısından manifesti al
import manifest from '../../dist/js/manifest.json'

export const withManifestBundles = ({ styles, body }) => {
  // manifestin her bir anahtarında dolaşarak
  // her biri için bir script etiketi oluştur.
  const bundledScripts = Object.keys(manifest).map(key => {
    const scriptPath = `/public/js/${manifest[key]}`
    return `<script src=${scriptPath}></script>`
  })

  return `<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style id="_goober">
        ${styles}
      </style>
    </head>

    <body>
      ${body}
    </body>
    ${bundledScripts.join('')}
  </html>`
}
```

Yorumlarda açıklandığı gibi, ihtiyaç duyduğumuz tüm dosyaları manifestten alıp son HTML'e script etiketleri olarak enjeksiyon yapıyoruz.

Bunu mümkün kılan yapılandırma ile ilerleyelim.

## `webpack.config.*.js`

Webpack yapılandırmasını insanları korkutmamak için mümkün olduğunca minimumda tutmaya çalıştım; bu yüzden yapılandırmayı gözden geçirelim.

```js
// webpack.config.server.js
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: process.env.NODE_ENV != 'production' ? 'development' : 'production',
  target: 'node',
  entry: path.resolve(__dirname, './src/server/app.js'),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, './dist'),
  },
  stats: 'errors-warnings',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [{ test: /\.jsx?$/, loader: 'babel-loader' }],
  },
  externals: [nodeExternals()],
}
```

Çoğu bölümün açıklamaya ihtiyacı yoktur; ve yerleşik tek yükleyicimiz `babel-loader` çünkü bir CSS-IN-JS çözümü kullanıyoruz.

Burada sihirli bir şey yok; sadece `server/app.js`'nin giriş noktasını veriyoruz ve kendisini istemci çıktısının aynı klasörüne inşa etmesine izin veriyoruz.

İstemci tarafı yapılandırmasına geçelim, burada sadece bir giriş sağlamak ve bir çıktı almak dışında birkaç şey daha ekliyoruz.

Bu bölüm, ilgili kısımları açıklamak için kısaltılmıştır.

```js
// webpack.config.client.js

const entryPoints = glob
  .sync(path.resolve(__dirname, './src/client') + '/**/*.js', {
    absolute: true,
  })
  .reduce((acc, path) => {
    const entry = path.match(/[^\/]+\.jsx?$/gm)[0].replace(/.jsx?$/, '')
    acc[entry] = path
    return acc
  }, {})
```

Yani ilk bölüm, `src/client` içinde tüm dosyaları bulmak ve webpack için bir giriş nesnesi oluşturmak.

Örnek: Eğer `src/client/app.client.js` bir dosya ise, yukarıdaki çıktısı:

```json
{
  "app.client": "./src/client/app.client.js"
}
```

Bu özel bir şey değil; webpack'in girişlerin nasıl tanımlanmasını beklediğidir.

Diğer her şey, sunucu tarafında bulunan genel yapılandırmalardır.

```js
{
  plugins: [
    new WebpackManifestPlugin({
      publicPath: '',
      basePath: '',
      filter: file => {
        return /\.mount\.js$/.test(file.name)
      },
    }),
  ]
}
```

Ardından, adında `mount` ifadesi geçen dosyaları kontrol eden manifest eklentisi var; bu, yalnızca giriş dosyalarının yükleneceğinden emin olmak içindir ve bunu dosya için belirli bir uzantı türü belirterek gerçekleştiriyoruz.

Bazı çerçeveler, adaları giriş dosyalarından ayırmak için bir `islands` klasörü kullanıyor. Biz bunun yerine giriş dosyalarını adalardan ayırıyor ve kullanıcının hangi parçaların ada olduğunu ve hangilerinin olmadığını seçmesine izin veriyoruz.

Yukarıdaki `WebpackManifestPlugin`, `lib/html.js` dosyasında kullandığımız paketlenmiş dosya adlarını içeren `manifest.json` dosyasını `dist/public/js` içinde oluşturur.

## `.babelrc`

Bu, yapılandırmanın son kısmıdır; burada babel'den JSX çalıştırma zamanının Preact'ten geldiğinden emin olmasını istiyorsunuz, React'ten değil.

Açıklaması kolaydır; ancak seçeneğin ayrıntıları hakkında bilgi almak isterseniz, lütfen [babel](https://babeljs.io/) belgelerine ve [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) üzerinden göz atın.

```json
// .babelrc
{
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      { "runtime": "automatic", "importSource": "preact" }
    ]
  ]
}
```

## Klasörler

Artık her klasörün önemine geçebiliriz.

> **Not**: İhtiyacınız olduğunda klasörleri karıştırıp eşleştirebileceğinizi unutmayın; sadece yaptığınız değişiklikleri yönetmek için yapılandırmaların düzenlendiğinden emin olun. Aksi takdirde, mevcut yapı çoğu uygulama için yeterlidir.

## `client`

Bu `ana` dalındaki `src/client`, render edilen html ile gönderilen `mount` noktasını yazmak için kullanılır.

Seçici montajlar ekleyebilir, kullanmak istediğiniz sayfalar ve seçiciler temelinde yapabilirsiniz; bu, birden fazla JS dosyasını alacak olsa da, bu dosyaların yalnızca montaj koduna sahip olması gerekir. Adalarınız kendi kendine hizmet etmeli ve bağımsız olmalıdır. Bununla birlikte, sunucudan `data-*` özniteliği olarak bir başlangıç verisi gönderebilirsiniz, ancak bu seri hale getirilebilir veri olmalı veya kaybolacaktır.

Ayrıca, adayı manuel olarak oluşturmak için etrafına bir sarıcı ekleyebilirsiniz, ancak web bileşenleri geniş çapta desteklenmediği için, eski düzeyde destek sağlayan bir sistem için, yukarıda bahsedildiği gibi manuel montaj yapmanız daha iyi olur.

Örnek:

```js
// src/client/index.mount.js

import { h, hydrate } from 'preact'

// goober'ı ayarlayın
import { setup } from 'goober'
setup(h)

// bir yardımcı dosyaya taşınabilir ve oradan kullanılabilir,
// burada yalnızca bir örnek olması açısından bu dosyada.
const mount = async (Component, elm) => {
  if (elm?.dataset?.props) {
    const props = JSON.parse(elm.dataset.props)
    delete elm.dataset.props
    hydrate(<Component {...props} />, elm)
  }
}

const main = async () => {
  // gerekirse, bileşeni istemci tarafı bileşeni olarak tembel bir şekilde yükleyin ve tekrar monte edin.
  // Daha iyi bir yol, bileşeni yüklemeden önce `counter` elemanının DOM'da var olup olmadığını kontrol etmektir,
  // gereksiz JS indirmelerinden kaçınmak için.

  const Counter = (await import('../components/Counter.js')).default
  mount(Counter, document.getElementById('counter'))
}

main()
```

## bileşenler

Adı oldukça açıktır; burada hangi öğelerin ada olduğunu veya olmadığını ayırmadığımız için, tüm bileşenlerinizi burada düzenli bir şekilde toplayabilirsiniz.

## düzenler

Bunlar, bileşenlerden uzak tutmak için ayrılmıştır; çünkü bazen render koşullarından daha fazlasını içerebilirler. Bu özel durumda, çoğu durumda düzenlerinizi sunucuda ve istemcide değil çalıştırıyor olacağınız için bu ihtiyaç yoktur.

## lib

Hem istemci hem de sunucu için ortak yardımcı işlevler içerir, çünkü her iki taraf da ayrı ayrı paketlenir ve bağımlılıklar gerektiği gibi içe alınır.

## sayfalar

Bu klasör, şablonlar için bir depolama alanı olarak işlev görür. Sunucunun bir sayfa olarak render edeceği herhangi bir şeyi buraya koymalısınız. Düzenleri ve normal bir preact uygulamasında olduğu gibi diğer bileşenleri kullanma yeteneği, bileşenlerin ayrı tutulmasında daha kolaydır ama gene de bunun ayrılması daha iyidir.

## kamu

Express tarafından statik olarak teslim edilmesi gereken şeyler buraya konur; webpack, tümünü nihai klasöre kopyalamaktan sorumludur.

## sunucu

Açıklaması kendi kendine yeter; sunucu tarafı dosyaları, çoğu durumda yönlendirmeleri ayrı bir dosyaya taşımak ve belki de preact bileşenlerini sizin için render eden bir yardımcı işlev eklemek istersiniz.

Bunun gibi bir şey kesinlikle sunucunun bir parçasıdır ve istemci tarafında olmayacak, bu yüzden bunu bu klasörde tutun.

Örnek:

```js
app.use((req, res, next) => {
  res.render = (comp, data) => {
    return res.write(preactRenderToString(h(comp, { ...data })))
  }
})

// ve uygulamanın başka bir yerinde

const handler = (req, res) => {
  return res.status(200).render(Homepage, { username: 'reaper' })
}
```

Aslında bu, kendi kısmi hidratasyon/adaya benzeyen hidratasyonu nodejs ile kurmanıza katkıda bulunacak tüm kod. 

Bunun çoğu, hemen hemen tüm paketleyicilerle ve yapılandırmaların nasıl oluşturulduğuna biraz daha değişiklik ile benzer bir DX elde etmenize yardımcı olabilir; ancak, yapılandırmaları yönetme konusunda pek hevesli değilseniz, astro kullanmanız daha iyi olur.