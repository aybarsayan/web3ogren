---
description: Bu içerik, `vue-cli-service build` komutunu kullanarak farklı yapı hedeflerinin nasıl belirleneceğini ve bu hedeflerin her birinin özelliklerini açıklar. Özellikle uygulama, kütüphane ve web bileşeni modları arasındaki farkları ele alarak yapılandırma seçeneklerini detaylandırır.
keywords: [vue, build targets, vue-cli, web components, libraries]
---

# Build Hedefleri

`vue-cli-service build` komutunu çalıştırdığınızda, farklı yapı hedeflerini `--target` seçeneği ile belirtebilirsiniz. Bu, aynı kod tabanını kullanarak farklı kullanım durumları için farklı yapılar üretmenizi sağlar.

## Uygulama

Uygulama varsayılan yapı hedefidir. Bu modda:

- varlık ve kaynak ipuçlarının enjekte edildiği `index.html`
- daha iyi önbellekleme için satıcı kütüphaneleri ayrı bir parçaya bölünmüştür
- 8KiB'den küçük statik varlıklar JavaScript içine yerleştirilir
- `public` içindeki statik varlıklar çıktı dizinine kopyalanır

---

## Kütüphane

::: tip Vue Bağımlılığı Hakkında Not
Lib modunda, Vue *dışarıda tutulmaktadır*. Bu, paketin Vue'yu paketlemeyeceği anlamına gelir, eğer kodunuz Vue'yu içe aktarıyorsa bile. Eğer kütüphane bir paketleyici aracılığıyla kullanılıyorsa, paketleyici üzerinden bağımlılık olarak Vue'yu yüklemeye çalışacaktır; aksi takdirde `global Vue` değişkenine geri döner.

Bu davranışı önlemek için, `build` komutuna `--inline-vue` bayrağını sağlayın.

```
vue-cli-service build --target lib --inline-vue
```
:::

Bir kütüphane olarak tek bir giriş oluşturmak için

```
vue-cli-service build --target lib --name myLib [entry]
```

```
Dosya                     Boyut                     Gziplenmiş

dist/myLib.umd.min.js    13.28 kb                 8.42 kb
dist/myLib.umd.js        20.95 kb                 10.22 kb
dist/myLib.common.js     20.57 kb                 10.09 kb
dist/myLib.css           0.33 kb                  0.23 kb
```

Giriş ya bir `.js` ya da bir `.vue` dosyası olabilir. Eğer giriş belirtilmezse, `src/App.vue` kullanılacaktır.

Bir kütüphane yapısı şunları üretir:

- `dist/myLib.common.js`: Paketleyiciler aracılığıyla tüketim için bir CommonJS paketi (ne yazık ki, webpack şu anda paketler için ES modülleri çıktı formatını desteklememektedir)

- `dist/myLib.umd.js`: Tarayıcılarda veya AMD yükleyicileri ile doğrudan tüketim için bir UMD paketi

- `dist/myLib.umd.min.js`: UMD yapısının minify edilmiş versiyonu.

- `dist/myLib.css`: Çıkarılmış CSS dosyası (gerekirse `vue.config.js` dosyasına `css: { extract: false }` belirterek inline hale getirilebilir)

::: warning
Eğer bir kütüphane geliştirmekte veya bir monorepo içindeyseniz, CSS içe aktarmalarının **yan etkiler** olduğunu bilmelisiniz. Lütfen `package.json` dosyasındaki `"sideEffects": false` ifadesini **kaldırın**, aksi takdirde CSS parçaları üretim yapılarında webpack tarafından atılacaktır.
:::

---

### Vue vs. JS/TS Giriş Dosyaları

Bir `.vue` dosyasını giriş olarak kullanıyorsanız, kütüphaneniz doğrudan Vue bileşenini açığa çıkarır, çünkü bileşen her zaman varsayılan ihracattır.

Ancak, bir `.js` veya `.ts` dosyasını giriş olarak kullanıyorsanız, bu dosya adlandırılmış ihracatlar içerebilir, bu nedenle kütüphaneniz bir Modül olarak açığa çıkar. Bu, kütüphanenizin varsayılan ihracatının UMD yapılarında `window.yourLib.default` olarak erişilmesi gerektiği, ya da CommonJS yapılarında `const myLib = require('mylib').default` olarak erişilmesi gerektiği anlamına gelir. Eğer adlandırılmış ihracatlarınız yoksa ve varsayılan ihracatı doğrudan açığa çıkarmak isterseniz, `vue.config.js` dosyasında aşağıdaki webpack yapılandırmasını kullanabilirsiniz:

``` js
module.exports = {
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  }
}
```

---

## Web Bileşeni

::: tip Uyumluluk Hakkında Not
Web bileşeni modu, IE11 ve altı sürümleri desteklememektedir. [Daha fazla detay](https://github.com/vuejs/vue-web-component-wrapper#compatibility)
:::

::: tip Vue Bağımlılığı Hakkında Not
Web bileşeni modunda, Vue *dışarıda tutulmaktadır.* Bu, paketin Vue'yu paketlemeyeceği anlamına gelir, eğer kodunuz Vue'yu içe aktarıyorsa. Paket, `Vue`'nun ana sayfada global bir değişken olarak mevcut olduğunu varsayacaktır.

Bu davranışı önlemek için, `build` komutuna `--inline-vue` bayrağını sağlayın.

```
vue-cli-service build --target wc --inline-vue
```
:::

Tek bir girişi web bileşeni olarak oluşturmak için

```
vue-cli-service build --target wc --name my-element [entry]
```

Girişin bir `*.vue` dosyası olması gerektiğini unutmayın. Vue CLI, bileşeni otomatik olarak bir Web Bileşeni olarak sarmanızı ve kaydetmenizi sağlar, ayrıca bunu `main.js` içinde kendiniz yapmanıza gerek yoktur. `main.js` dosyasını sadece geliştirme amaçlı bir demo uygulaması olarak kullanabilirsiniz.

Yapı, her şeyi inline olarak içeren tek bir JavaScript dosyası (ve minify edilmiş versiyonu) üretecektir. Bir sayfada dahil edildiğinde, `` özel bileşenini kaydeder ve hedef Vue bileşenini `@vue/web-component-wrapper` kullanarak sarar. Sarıcı, özellikleri, öznitelikleri, olayları ve slotları otomatik olarak proxy'ler. [@vue/web-component-wrapper](https://github.com/vuejs/vue-web-component-wrapper) için daha fazla detaylara bakın.

**Not: Paket, `Vue`'nun sayfada global olarak mevcut olmasına dayanır.**

Bu mod, bileşeninizin kullanıcılarının Vue bileşenini normal bir DOM elementi olarak kullanmasına olanak tanır:

``` html
<script src="https://unpkg.com/vue"></script>
<script src="path/to/my-element.js"></script>

<!-- sade HTML'de veya başka herhangi bir framework'te kullanabilirsiniz -->
<my-element></my-element>
```

---

### Birden Fazla Web Bileşeni Kayıt Eden Paket

Bir web bileşeni paketi oluştururken, giriş olarak bir glob kullanarak birden fazla bileşeni hedefleyebilirsiniz:

```
vue-cli-service build --target wc --name foo 'src/components/*.vue'
```

Birden fazla web bileşeni oluşturduğunuzda, `--name` bir ön ek olarak kullanılacaktır ve özel element adı bileşen dosya adı üzerinden çıkarılacaktır. Örneğin, `--name foo` ile `HelloWorld.vue` adında bir bileşen ile, sonuçta oluşan özel element `` olarak kaydedilecektir.

---

### Asenkron Web Bileşeni

Birden fazla web bileşeni hedeflendiğinde, paket oldukça büyük hale gelebilir ve kullanıcı paketinizin kaydettiği bileşenlerden yalnızca birkaçını kullanabilir. Asenkron web bileşeni modu, tüm bileşenler arasında paylaşılan çalışma zamanını sağlayan küçük bir giriş dosyası ile kod bölünmüş bir paket üretir ve tüm özel elementleri baştan kaydeder. Bir bileşenin gerçek uygulanması, yalnızca ilgili özel elementin sayfada kullanıldığında ihtiyaç duyulduğunda alınır:

```
vue-cli-service build --target wc-async --name foo 'src/components/*.vue'
```

```
Dosya                Boyut                        Gziplenmiş

dist/foo.0.min.js    12.80 kb                    8.09 kb
dist/foo.min.js      7.45 kb                     3.17 kb
dist/foo.1.min.js    2.91 kb                     1.02 kb
dist/foo.js          22.51 kb                    6.67 kb
dist/foo.0.js        17.27 kb                    8.83 kb
dist/foo.1.js        5.24 kb                     1.64 kb
```

Artık sayfada, kullanıcı yalnızca Vue ve giriş dosyasını dahil etmelidir:

``` html
<script src="https://unpkg.com/vue"></script>
<script src="path/to/foo.min.js"></script>

<!-- foo-one'in uygulama parçası kullanıldığında otomatik olarak alınır -->
<foo-one></foo-one>
```

---

## Yapılarda vuex Kullanımı

`Web bileşeni` veya `Kütüphane` oluşturduğunuzda, giriş noktası `main.js` değil, burada oluşturulan `entry-wc.js` dosyasıdır: [https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/commands/build/resolveWcEntry.js](https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/commands/build/resolveWcEntry.js)

Bu nedenle, web bileşeni hedefinde vuex kullanmak için, store'u `App.vue` dosyasında başlatmanız gerekir:

``` js
import store from './store'

// ...

export default {
  store,
  name: 'App',
  // ...
}
```