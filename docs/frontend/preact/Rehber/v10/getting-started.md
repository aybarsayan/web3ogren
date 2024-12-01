---
name: Başlarken
description: "Preact ile nasıl başlanır. Araçları (varsa) nasıl kuracağınızı öğreneceğiz ve bir uygulama yazmaya başlayacağız."
keywords: [Preact, başlangıç, uygulama geliştirme, JSX, Vite]
---

# Başlarken

Preact'e yeni misiniz? Sanal DOM'a yeni misiniz? `öğreticiye` göz atın.

Bu rehber, 3 popüler seçeneği kullanarak Preact uygulamaları geliştirmeye başlamanız için size yardımcı olur. Preact'e yeniyseniz, `Vite` ile başlamanızı öneririz.

---



---

## Yapı aracı kullanmayan yol

Preact, doğrudan tarayıcıda kullanılmak üzere paketlenmiştir ve herhangi bir yapı ya da araca ihtiyaç duymaz:

```html
<script type="module">
  import { h, render } from 'https://esm.sh/preact';

  // Uygulamanızı oluşturun
  const app = h('h1', null, 'Merhaba Dünya!');

  render(app, document.body);
</script>
```

[🔨 Glitch'te düzenle](https://glitch.com/~preact-no-build-tools)

> **Uyarı:** Bu şekilde geliştirmenin en büyük dezavantajı, bir yapı adımı gerektiren JSX'in yokluğudur. JSX'e ergonomik ve performanslı bir alternatif, bir sonraki bölümde belgelenmiştir.

### JSX için alternatifler

Ham `h` veya `createElement` çağrılarını yazmak sıkıcı olabilir. JSX, HTML'e benzer görünme avantajına sahiptir ve bu, deneyimlerimize göre birçok geliştirici için daha anlaşılır hale getirir. Ancak JSX bir yapı adımı gerektirir; bu nedenle [HTM][htm] adlı bir alternatifi öneriyoruz.

[HTM][htm], standart JavaScript'te çalışan bir JSX benzeri sözdizimidir. Bir yapı adımı gerektirmek yerine, JavaScript'in kendi [Tagged Templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates) sözdizimini kullanır; bu, 2015 yılında eklenmiştir ve [tüm modern tarayıcılarda](https://caniuse.com/#feat=template-literals) desteklenmektedir. Bu, daha az hareketli parça olduğu için, Preact uygulamaları yazmanın giderek popüler bir yolu haline gelmiştir.

```html
<script type="module">
  import { h, render } from 'https://esm.sh/preact';
  import htm from 'https://esm.sh/htm';

  // htm'i Preact ile başlat
  const html = htm.bind(h);

  function App (props) {
    return html`<h1>Merhaba ${props.name}!</h1>`;
  }

  render(html`<${App} name="Dünya" />`, document.body);
</script>
```

[🔨 Glitch'te düzenle](https://glitch.com/~preact-with-htm)

> **İpucu:** HTM ayrıca tek bir içe aktarma ile Preact sürümünü sunar:
>
> `import { html, render } from 'https://esm.sh/htm/preact/standalone'`

Daha ölçeklenebilir bir çözüm için `Import Maps -- Temel Kullanım` kısmına bakın ve HTM hakkında daha fazla bilgi için [belgesine][htm] göz atın.

[htm]: https://github.com/developit/htm

## Vite Destekli Preact Uygulaması Oluşturma

[Vite](https://vitejs.dev), son birkaç yılda birçok framework ile uygulama geliştirmek için son derece popüler bir araç haline geldi ve Preact bunun bir istisnası değil. ES modülleri, Rollup ve ESBuild gibi popüler araçlar üzerine inşa edilmiştir. Vite, başlatıcımız veya kendi Preact şablonları aracılığıyla, hemen başlamak için hiçbir yapılandırma ya da ön bilgi gerektirmiyor ve bu basitlik Preact'ı kullanmanın çok popüler bir yolu haline getiriyor.

> **Not:** Vite ile hızlı bir şekilde çalışmaya başlamak için `create-preact` başlatıcımızı kullanabilirsiniz. Bu, terminalinizde çalıştırılabilen etkileşimli bir komut satırı arayüzü (CLI) uygulamasıdır.

Bu, yeni bir uygulama oluşturmanıza yardımcı olacak ve size TypeScript, yönlendirme ( `preact-iso` aracılığıyla) ve ESLint desteği gibi bazı seçenekler sunacaktır.

```bash
npm init preact
```

> **İpucu:** Bu kararların hiçbiri kesin olmak zorunda değil, fikrinizi değiştirdiğinizde projenizden bunları her zaman ekleyebilir veya çıkarabilirsiniz.

### Geliştirmeye Hazırlanmak

Artık uygulamamızı oluşturmak için hazırız. Bir geliştirme sunucusunu başlatmak için, yeni oluşturduğunuz proje klasörünün içine şu komutu çalıştırın:

```bash
# Oluşturulan proje klasörüne girin
cd my-preact-app

# Bir geliştirme sunucusunu başlatın
npm run dev
```

Sunucu başladıktan sonra, tarayıcınızda açmak için bir yerel geliştirme URL'si yazdıracaktır. Şimdi uygulamanızı kodlamaya başlamaya hazırsınız!

### Üretim Binası Yapma

Uygulamanızı bir yere dağıtmanız gereken bir zaman gelir. Vite, yüksek optimize edilmiş bir üretim binası üreten kullanışlı bir `build` komutu ile birlikte gelir.

```bash
npm run build
```

Tamamlandığında, doğrudan bir sunucuya dağıtılabilecek yeni bir `dist/` klasörünüz olacak.

> Tüm mevcut komutlar ve seçenekleri için, [Vite CLI Belgesi](https://vitejs.dev/guide/cli.html)'ne göz atın.

## Mevcut Bir Süreçle Entegre Etme

Zaten mevcut bir araç yolunu ayarladıysanız, bunun bir paketleyici içerme olasılığı yüksektir. En popüler seçimler [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org) veya [parcel](https://parceljs.org/) dir. Preact, hemen hemen tüm bunlarla kutudan çıktığı gibi çalışır, büyük değişiklikler gerektirmez!

### JSX Ayarları

JSX'i dönüştürmek için, onu geçerli JavaScript koduna dönüştüren bir Babel eklentisine ihtiyacınız vardır. Hepimizin kullandığı eklenti [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) dir. Yükledikten sonra, kullanılacak JSX işlevini belirtmelisiniz:

```json
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "h",
      "pragmaFrag": "Fragment",
    }]
  ]
}
```

> **İpucu:** [Babel](https://babeljs.io/) bazı en iyi belgelere sahiptir. Babel ile ilgili sorularınız ve nasıl ayarlanacağı için kontrol etmenizi öneririz.

### React'i Preact ile Aliaslama

Bir süre sonra, muhtemelen geniş React ekosisteminden yararlanmak isteyeceksiniz. React için ilk olarak yazılmış kütüphaneler ve bileşenler, uyumluluk katmanımızla sorunsuz bir şekilde çalışır. Bunun için tüm `react` ve `react-dom` ithalatlarını Preact'e yönlendirmemiz gerekiyor. Bu adım, _aliaslama_ olarak adlandırılır.

> **Not:** Eğer Vite kullanıyorsanız (`@preact/preset-vite` aracılığıyla), Preact CLI veya WMR, bu aliaslar varsayılan olarak sizin için otomatik olarak yönetilir.

#### Webpack'te Aliaslama

Webpack'te herhangi bir paketi aliaslamak için, yapılandırmanıza `resolve.alias` bölümünü eklemeniz gerekir. Kullandığınız yapılandırmaya bağlı olarak, bu bölüm zaten mevcut olabilir, ancak Preact için aliaslardan yoksun olabilir.

```js
const config = {
  //...snip
  "resolve": {
    "alias": {
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",     // Test-utils'tan sonra olmalıdır
      "react/jsx-runtime": "preact/jsx-runtime"
    },
  }
}
```

#### Node'da Aliaslama

Node üzerinde çalışırken, paketleyici aliasları (Webpack, Rollup vb.) çalışmayacak; bunu NextJS'de görebilirsiniz. Bunu düzeltmek için, `package.json` dosyamızda aliasları doğrudan kullanabiliriz:

```json
{
  "dependencies": {
    "react": "npm:@preact/compat",
    "react-dom": "npm:@preact/compat",
  }
}
```

#### Parcel'de Aliaslama

Parcel, standart `package.json` dosyasını, `alias` anahtarı altında yapılandırma seçeneklerini okumak için kullanır.

```json
{
  "alias": {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat",
    "react/jsx-runtime": "preact/jsx-runtime"
  },
}
```

#### Rollup'da Aliaslama

Rollup içinde aliaslamak için, [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias) yüklemeniz gerekecek. Bu eklenti, [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) öncesinde konumlandırılmalıdır.

```js
import alias from '@rollup/plugin-alias';

module.exports = {
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' }
      ]
    })
  ]
};
```

#### Jest'te Aliaslama

[Jest](https://jestjs.io/) modül yollarını paketleyicilerle benzer şekilde yeniden yazmaya izin verir. Bu yeniden yazmalar Jest yapılandırmanızda düzenli ifadeler kullanılarak yapılandırılır:

```json
{
  "moduleNameMapper": {
    "^react$": "preact/compat",
    "^react-dom/test-utils$": "preact/test-utils",
    "^react-dom$": "preact/compat",
    "^react/jsx-runtime$": "preact/jsx-runtime"
  }
}
```

#### TypeScript'te Aliaslama

TypeScript, bir paketleyici ile birlikte kullanıldığında bile kendi türlerini çözme sürecine sahiptir. Preact'in türlerinin React'in yerinde kullanıldığından emin olmak için, `tsconfig.json` (veya `jsconfig.json`) belgenize aşağıdaki yapılandırmayı eklemek isteyeceksiniz:

```json
{
  "compilerOptions": {
    ...
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react/jsx-runtime": ["./node_modules/preact/jsx-runtime"],
      "react-dom": ["./node_modules/preact/compat/"],
      "react-dom/*": ["./node_modules/preact/compat/*"]
    }
  }
}
```

Ayrıca, yukarıdaki örnekte olduğu gibi `skipLibCheck`'i etkinleştirmek isteyebilirsiniz. Bazı React kütüphaneleri, `preact/compat` ile sağlanmayabilecek türleri kullanır (bunu düzeltmek için elimizden geleni yapıyoruz) ve bu nedenle bu kütüphaneler TypeScript derleme hatalarının kaynağı olabilir. `skipLibCheck` ayarlayarak, TS'ye tüm `.d.ts` dosyalarının tam kontrolünün gerekli olmadığını söyleyebilirsiniz (genellikle bunlar `node_modules` içindeki kütüphanelerle sınırlıdır) bu da bu hataları düzeltir.

#### İthalat Haritaları ile Aliaslama

```html
<script type="importmap">
  {
    "imports": {
      "preact": "https://esm.sh/preact@10.23.1",
      "preact/": "https://esm.sh/preact@10.23.1/",
      "react": "https://esm.sh/preact@10.23.1/compat",
      "react/": "https://esm.sh/preact@10.23.1/compat/",
      "react-dom": "https://esm.sh/preact@10.23.1/compat"
    }
  }
</script>
```

Daha fazlası için, `Import Maps -- Tarifler ve Yaygın Şablonlar` kısmına bakın.