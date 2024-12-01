# UI API

cli-ui, proje konfigürasyonlarını ve görevlerini artırmayı sağlar, ayrıca veri paylaşımı ve diğer süreçlerle iletişim kurma amacıyla bir API sunar.

![UI Eklenti mimarisi](../../images/cikti/vue-cli/public/ru/vue-cli-ui-schema.png)

## UI dosyaları

Yüklenen her vue-cli eklentisinin içinde, cli-ui, eklentinin kök klasöründe isteğe bağlı bir `ui.js` dosyasını yüklemeye çalışacaktır. Ayrıca klasörleri de kullanabilirsiniz (örneğin `ui/index.js`).

Dosya, API nesnesini argüman olarak alan bir işlevi dışa aktarmalıdır:

```js
module.exports = api => {
  // API'yi burada kullanın...
}
```

**⚠️ Dosyalar, 'Proje eklentileri' görünümünde eklenti listesini alırken yeniden yüklenecektir. Değişiklikleri uygulamak için, UI'daki sol taraftaki navigasyon kenar çubuğundaki 'Proje eklentileri' düğmesine tıklayın.**

Aşağıda, UI API'sini kullanan bir vue-cli eklentisi için örnek bir klasör yapısı verilmiştir:

```
- vue-cli-plugin-test
  - package.json
  - index.js
  - generator.js
  - prompts.js
  - ui.js
  - logo.png
```

:::tip
Her dosya, eklenti API'sini ilk argüman olarak alan bir işlevi dışa aktarmalıdır.
:::

## Geliştirici modu

Eklentiniz üzerinde çalışırken, cli-ui'yi Geliştirici modunda çalıştırmak isteyebilirsiniz; böylece size yararlı günlükler sunar:

```
vue ui --dev
```

Ya da:

```
vue ui -D
```

## Proje konfigürasyonları

![Yapılandırma ui](../../images/cikti/vue-cli/public/config-ui.png)

`api.describeConfig` yöntemiyle bir proje yapılandırması ekleyebilirsiniz.

Öncelikle bazı bilgileri geçmelisiniz:

```js
api.describeConfig({
  // Yapılandırma için benzersiz kimlik
  id: 'org.vue.eslintrc',
  // Görünen ad
  name: 'ESLint yapılandırması',
  // Adın altında gösterilen
  description: 'Hata kontrolü & Kod kalitesi',
  // "Daha fazla bilgi" bağlantısı
  link: 'https://eslint.org'
})
```

:::danger
Kimliği doğru bir şekilde ad alanı ile belirtilmesine dikkat edin, çünkü bu tüm eklentiler arasında benzersiz olmalıdır. [ters alan adı notasyonu](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) kullanmanız önerilir.
:::

### Yapılandırma simgesi

Bu, ya bir [Material simgesi](https://material.io/tools/icons) kodu ya da özel bir görüntü olabilir (bkz. `Halka açık statik dosyalar`):

```js
api.describeConfig({
  /* ... */
  // Yapılandırma simgesi
  icon: 'application_settings'
})
```

Eğer bir simge belirtmezseniz, varsa eklenti logosu görüntülenecektir (bkz. `Logo`).

### Yapılandırma dosyaları

Varsayılan olarak, bir yapılandırma UI'sı bir veya daha fazla yapılandırma dosyasını okuyabilir ve yazabilir; bu dosyalar arasında `.eslintrc.js` ve `vue.config.js` bulunabilir.

Kullanıcı projesinde algılanması gereken olası dosyaları sağlayabilirsiniz:

```js
api.describeConfig({
  /* ... */
  // Bu yapılandırma için olasılığı bulunan dosyalar
  files: {
    // eslintrc.js
    eslint: {
      js: ['.eslintrc.js'],
      json: ['.eslintrc', '.eslintrc.json'],
      // `package.json` dosyasından okuma yapılacaktır
      package: 'eslintConfig'
    },
    // vue.config.js
    vue: {
      js: ['vue.config.js']
    }
  },
})
```

Desteklenen türler: `json`, `yaml`, `js`, `package`. Sıralama önemlidir: listede ilk dosya adı, yapılandırma dosyası yoksa oluşturmak için kullanılacaktır.

### Yapılandırma istemlerini görüntüleme

Yapılandırma için görüntülenecek istemlerin bir listesini döndürmek üzere `onRead` kancasını kullanın:

```js
api.describeConfig({
  /* ... */
  onRead: ({ data, cwd }) => ({
    prompts: [
      // İstem nesneleri
    ]
  })
})
```

Bu istemler, yapılandırma ayrıntı panosunda görüntülenecektir.

Daha fazla bilgi için bkz. `İstemler`.

`data` nesnesi, her yapılandırma dosyasının içeriğinin JSON sonucunu içerir.

Örneğin, kullanıcının projesinde aşağıdaki `vue.config.js` dosyası olduğunu varsayalım:

```js
module.exports = {
  lintOnSave: false
}
```

Yapılandırma dosyasını eklentimizde bu şekilde tanımlarız:

```js
api.describeConfig({
  /* ... */
  // Bu yapılandırma için olasılığı bulunan dosyalar
  files: {
    // vue.config.js
    vue: {
      js: ['vue.config.js']
    }
  },
})
```

Sonrasında `data` nesnesi şöyle olacaktır:

```js
{
  // Dosya
  vue: {
    // Dosya verisi
    lintOnSave: false
  }
}
```

Çoklu dosya örneği: Kullanıcı projesine aşağıdaki `eslintrc.js` dosyasını eklersek:

```js
module.exports = {
  root: true,
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
```

Ve eklentimizdeki `files` seçeneğini şöyle değiştirirsek:

```js
api.describeConfig({
  /* ... */
  // Bu yapılandırma için olasılığı bulunan dosyalar
  files: {
    // eslintrc.js
    eslint: {
      js: ['.eslintrc.js'],
      json: ['.eslintrc', '.eslintrc.json'],
      // `package.json` dosyasından okuma yapılacaktır
      package: 'eslintConfig'
    },
    // vue.config.js
    vue: {
      js: ['vue.config.js']
    }
  },
})
```

Sonrasında `data` nesnesi aşağıdaki gibi olacaktır:

```js
{
  eslint: {
    root: true,
    extends: [
      'plugin:vue/essential',
      '@vue/standard'
    ]
  },
  vue: {
    lintOnSave: false
  }
}
```

### Yapılandırma sekmeleri

İstemleri birkaç sekmeye organize edebilirsiniz:

```js
api.describeConfig({
  /* ... */
  onRead: ({ data, cwd }) => ({
    tabs: [
      {
        id: 'tab1',
        label: 'Benim sekmem',
        // İsteğe bağlı
        icon: 'application_settings',
        prompts: [
          // İstem nesneleri
        ]
      },
      {
        id: 'tab2',
        label: 'Diğer sekmem',
        prompts: [
          // İstem nesneleri
        ]
      }
    ]
  })
})
```

### Yapılandırma değişikliklerini kaydetme

Verileri yapılandırma dosyasına yazmak (veya herhangi bir nodejs kodunu çalıştırmak) için `onWrite` kancasını kullanın:

```js
api.describeConfig({
  /* ... */
  onWrite: ({ prompts, answers, data, files, cwd, api }) => {
    // ...
  }
})
```

Argümanlar:

- `prompts`: mevcut istem çalışma zamanı nesneleri (aşağıya bakın)
- `answers`: kullanıcı girdilerinden alınan cevap verileri
- `data`: yapılandırma dosyalarından okunan salt okunur başlangıç verileri
- `files`: tespit edilen dosyaların tanımlayıcıları (`{ type: 'json', path: '...' }`)
- `cwd`: mevcut çalışma dizini
- `api`: `onWrite API` (aşağıya bakın)

İstem çalışma zamanı nesneleri:

```js
{
  id: data.name,
  type: data.type,
  name: data.short || null,
  message: data.message,
  group: data.group || null,
  description: data.description || null,
  link: data.link || null,
  choices: null,
  visible: true,
  enabled: true,
  // Geçerli değer (filtrelenmemiş)
  value: null,
  // Kullanıcı tarafından değiştirildiyse true
  valueChanged: false,
  error: null,
  tabId: null,
  // Orijinal inquirer istem nesnesi
  raw: data
}
```

`onWrite` API:

- `assignData(fileId, newData)`: yazmadan önce yapılandırma verilerini güncellemek için `Object.assign` kullanın.
- `setData(fileId, newData)`: `newData`'nın her anahtarı, yazmadan önce yapılandırma verilerine derinlemesine ayarlanacaktır (ya da `undefined` değeri varsa kaldırılacaktır).
- `async getAnswer(id, mapper)`: belirli bir istem kimliği için cevabı almak ve verilense `mapper` işlevi aracılığıyla haritalamak (örneğin `JSON.parse`).

Örnek (ESLint eklentisinden):

```js
api.describeConfig({
  // ...

  onWrite: async ({ api, prompts }) => {
    // ESLint kurallarını güncelle
    const result = {}
    for (const prompt of prompts) {
      result[`rules.${prompt.id}`] = await api.getAnswer(prompt.id, JSON.parse)
    }
    api.setData('eslint', result)
  }
})
```

## Proje görevleri

![Görevler ui](../../images/cikti/vue-cli/public/tasks-ui.png)

Görevler, proje `package.json` dosyasındaki `scripts` alanından oluşturulur. 

`api.describeTask` yöntemi sayesinde bu görevleri ek bilgi ve kancalarla 'artırabilirsiniz':

```js
api.describeTask({
  // Burada hangi görevin tanımlanacağını seçmek için script komutları üzerinde yürütülen RegExp
  match: /vue-cli-service serve/,
  description: 'Geliştirme için derleme ve sıcak yeniden yükleme',
  // "Daha fazla bilgi" bağlantısı
  link: 'https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#serve'
})
```

`match` için bir işlev de kullanabilirsiniz:

```js
api.describeTask({
  match: (command) => /vue-cli-service serve/.test(command),
})
```

### Görev simgesi

Bu, ya bir [Material simgesi](https://material.io/tools/icons) kodu ya da özel bir görüntü olabilir (bkz. `Halka açık statik dosyalar`):

```js
api.describeTask({
  /* ... */
  // Görev simgesi
  icon: 'application_settings'
})
```

Eğer bir simge belirtmezseniz, varsa eklenti logosu görüntülenecektir (bkz. `Logo`).

### Görev parametreleri

Komut argümanlarını değiştirmek için istemler ekleyebilirsiniz. Bunlar 'Parametreler' penceresinde görüntülenecektir.

Örnek:

```js
api.describeTask({
  // ...

  // İsteğe bağlı parametreler (inquirer istemleri)
  prompts: [
    {
      name: 'open',
      type: 'confirm',
      default: false,
      description: 'Sunucu başlatıldığında tarayıcıyı aç'
    },
    {
      name: 'mode',
      type: 'list',
      default: 'development',
      choices: [
        {
          name: 'geliştirme',
          value: 'development'
        },
        {
          name: 'üretim',
          value: 'production'
        },
        {
          name: 'test',
          value: 'test'
        }
      ],
      description: 'Belirtilen çevre modunu seçin'
    }
  ]
})
```

Daha fazla bilgi için bkz. `İstemler`.

### Görev kancaları

Birden fazla kanca mevcuttur:

- `onBeforeRun`
- `onRun`
- `onExit`

Örneğin, yukarıda görülen istemlerin cevaplarını kullanarak komuta yeni argümanlar ekleyebilirsiniz:

```js
api.describeTask({
  // ...

  // Kancalar
  // Argümanları burada değiştirin
  onBeforeRun: async ({ answers, args }) => {
    // Argümanlar
    if (answers.open) args.push('--open')
    if (answers.mode) args.push('--mode', answers.mode)
    args.push('--dashboard')
  },
  // Görev çalıştırıldıktan hemen sonra
  onRun: async ({ args, child, cwd }) => {
    // child: node çocuk süreci
    // cwd: süreç çalışma dizini
  },
  onExit: async ({ args, child, cwd, code, signal }) => {
    // code: çıkış kodu
    // signal: varsa kullanılan öldürme sinyali
  }
})
```

### Görev görünümü

Görev detayları panelinde özel görünümler göstermek için `ClientAddon` API'sini kullanabilirsiniz:

```js
api.describeTask({
  // ...

  // Ek görünümler (örneğin webpack panosu)
  // Varsayılan olarak, terminal çıktısını gösteren 'output' görünümü vardır
  views: [
    {
      // Benzersiz kimlik
      id: 'vue-webpack-dashboard-client-addon',
      // Düğme etiketi
      label: 'Gösterge paneli',
      // Düğme simgesi
      icon: 'dashboard',
      // Yüklenmesi gereken dinamik bileşen (aşağıdaki 'Client addon' bölümüne bakın)
      component: 'vue-webpack-dashboard'
    }
  ],
  // Görev detaylarını görüntülediğinizde varsayılan olarak seçilen görünüm (varsayılan olarak çıkıştır)
  defaultView: 'vue-webpack-dashboard-client-addon'
})
```

Daha fazla bilgi için bkz. `Client addon`.

### Yeni görevler ekleme

`api.describeTask` yerine `api.addTask` ile `package.json` scriptlerinde yer almayan tamamen yeni görevler de ekleyebilirsiniz. Bu görevler yalnızca cli UI'da görünecektir.

**`match` yerine bir `command` seçeneği sağlamanız gerekiyor.**

Örnek:

```js
api.addTask({
  // Gereklidir
  name: 'inspect',
  command: 'vue-cli-service inspect',
  // İsteğe bağlı
  // Geri kalan `describeTask` gibi, `match` seçeneği hariç
  description: '...',
  link: 'https://github.com/vuejs/vue-cli/...',
  prompts: [ /* ... */ ],
  onBeforeRun: () => {},
  onRun: () => {},
  onExit: () => {},
  views: [ /* ... */ ],
  defaultView: '...'
})
```

**⚠️ `command`, bir node bağlamında çalışacaktır. Bu, `package.json` scriptlerinde normalde yaptığınız gibi node bin komutlarını çağırabileceğiniz anlamına gelir.**

## İstemler

İstem nesneleri geçerli [inquirer](https://github.com/SBoudrias/Inquirer.js) nesneleri olmalıdır.

Ancak, UI tarafından kullanılan şu ek alanları (isteğe bağlıdır) ekleyebilirsiniz:

```js
{
  /* ... */
  // İstemleri bölümlere gruplamak için kullanılır
  group: 'Kesinlikle tavsiye edilen',
  // Ek açıklama
  description: 'Şablondaki niteliği adlandırma stilini zorla (`my-prop` veya `myProp`)',
  // "Daha fazla bilgi" bağlantısı
  link: 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/attribute-hyphenation.md',
}
```

Desteklenen inquirer türleri: `checkbox`, `confirm`, `input`, `password`, `list`, `rawlist`, `editor`.

Bunlara ek olarak, UI yalnızca onunla çalışan özel türleri destekler:

- `color`: bir renk seçici görüntüler.

### Anahtarı örneği

```js
{
  name: 'open',
  type: 'confirm',
  default: false,
  description: 'Uygulamayı tarayıcıda aç'
}
```

### Seçim örneği

```js
{
  name: 'mode',
  type: 'list',
  default: 'development',
  choices: [
    {
      name: 'Geliştirme modu',
      value: 'development'
    },
    {
      name: 'Üretim modu',
      value: 'production'
    },
    {
      name: 'Test modu',
      value: 'test'
    }
  ],
  description: 'Derleme modu',
  link: 'https://link-to-docs'
}
```

### Girdi örneği

```js
{
  name: 'host',
  type: 'input',
  default: '0.0.0.0',
  description: 'Geliştirme sunucusu için ana bilgisayar'
}
```

### Checkbox örneği

Birden fazla anahtarı görüntüler.

```js
{
  name: 'lintOn',
  message: 'Ek lint özelliklerini seçin:',
  when: answers => answers.features.includes('linter'),
  type: 'checkbox',
  choices: [
    {
      name: 'Kaydetme sırasında lint',
      value: 'save',
      checked: true
    },
    {
      name: 'Taahhütte lint ve düzelt' + (hasGit() ? '' : chalk.red(' (Git gerektirir)')),
      value: 'commit'
    }
  ]
}
```

### Renk seçici örneği

```js
{
  name: 'themeColor',
  type: 'color',
  message: 'Tema rengi',
  description: 'Bu, uygulama etrafındaki sistem UI rengini değiştirmek için kullanılır',
  default: '#4DBA87'
}
```

### Çağrı için istemler

Vue-cli eklentinizde, eklentiyi yüklerken kullanıcıya birkaç soru soran bir `prompts.js` dosyanız olabilir (CLI veya UI ile). Ek maliyetli alanları (bkz. yukarıdaki) o istem nesnelerine de ekleyebilirsiniz, böylece kullanıcı UI kullanıyorsa daha fazla bilgi sağlar.

**⚠️ Şu anda desteklenmeyen inquirer türleri (bkz. yukarıda) UI'da düzgün çalışmaz.**

## Client addon

Client addon, cli-ui'ye dinamik olarak yüklenen bir JS paketidir. Özel bileşenleri ve yolları yüklemek için kullanışlıdır.

### Client addon oluşturma

Client addon oluşturmanın önerilen yolu, vue cli kullanarak yeni bir proje oluşturmaktır. Bunu eklentinizin alt klasöründe veya farklı bir npm paketinde yapabilirsiniz.

Geliştirme bağımlılığı olarak `@vue/cli-ui` yükleyin.

Ardından, aşağıdaki içeriğe sahip bir `vue.config.js` dosyası ekleyin:

```js
const { clientAddonConfig } = require('@vue/cli-ui')

module.exports = {
  ...clientAddonConfig({
    id: 'org.vue.webpack.client-addon',
    // Geliştirme bağlantı noktası (varsayılan 8042)
    port: 8042
  })
}
```

`clientAddonConfig` yöntemi gerekli vue-cli yapılandırmasını oluşturur. Diğer şeylerin yanı sıra, CSS çıkarımını devre dışı bırakır ve kodu client addon klasöründe `./dist/index.js` olarak çıktı verir.

:::danger
Kimliği doğru bir şekilde ad alanı ile belirtilmesine dikkat edin, çünkü bu tüm eklentiler arasında benzersiz olmalıdır. [ters alan adı notasyonu](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) kullanmanız önerilir.
:::

Sonrasında, izin verilen küresel nesneleri eklemek için `.eslintrc.json` dosyasını değiştirin:

```json
{
  // ...
  "globals": {
    "ClientAddonApi": false,
    "mapSharedData": false,
    "Vue": false
  }
}
```

Artık geliştirme aşamasında `serve` betiğini çalıştırabilir ve eklentinizi yayınlamak için hazır olduğunuzda `build` betiğini kullanabilirsiniz.

### ClientAddonApi

Client addon kaynaklarındaki `main.js` dosyasını açın ve tüm kodu kaldırın.

**⚠️ Client addon kaynaklarında Vue'u içe aktarmayın, yerine tarayıcı `window`'dan küresel `Vue` nesnesini kullanın.**

İşte `main.js` için örnek bir kod:

```js
import VueProgress from 'vue-progress-path'
import WebpackDashboard from './components/WebpackDashboard.vue'
import TestView from './components/TestView.vue'

// Küresel 'Vue' değişkenini kullanarak ek Vue eklentileri yükleyebilirsiniz.
Vue.use(VueProgress, {
  defaultShape: 'circle'
})

// Özel bir bileşeni kaydedin
// ('Vue.component' gibi çalışır)
ClientAddonApi.component('org.vue.webpack.components.dashboard', WebpackDashboard)

// Vue-router altında bir /addon/<id> ana yolu ekleyin.
// Örneğin, addRoutes('foo', [ { path: '' }, { path: 'bar' } ])
// /addon/foo/ ve /addon/foo/bar yollarını vue-router'a ekleyecektir.
// Burada 'test-webpack-route' adı ile yeni bir '/addon/vue-webpack/' yolu oluşturuyoruz
ClientAddonApi.addRoutes('org.vue.webpack', [
  { path: '', name: 'org.vue.webpack.routes.test', component: TestView }
])

// Eklenti bileşenlerinizi çevirin
// Yerelleştirme dosyalarını yükleyin (vue-i18n kullanır)
const locales = require.context('./locales', true, /[a-z0-9]+\.json$/i)
locales.keys().forEach(key => {
  const locale = key.match(/([a-z0-9]+)\./i)[1]
  ClientAddonApi.addLocalization(locale, locales(key))
})
```

:::danger
Kimlikleri doğru bir şekilde ad alanı ile belirtmeye özen gösterin, çünkü bunlar tüm eklentiler arasında benzersiz olmalıdır. [ters alan adı notasyonu](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) kullanmanız önerilir.
:::

cli-ui, `Vue` ve `ClientAddonApi`'yi `window` kapsamındaki küresel değişkenler olarak kaydeder.

Bileşenlerinizde, [@vue/ui](https://github.com/vuejs/ui) ve [@vue/cli-ui](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-ui/src/components) bileşenlerinin tümünü ve CSS sınıflarını kullanarak tutarlı bir görünüm ve hissiyat oluşturabilirsiniz. Ayrıca, çevrimiçi çeviri stringlerini [vue-i18n](https://github.com/kazupon/vue-i18n) ile çevirebilirsiniz; bu, included olan bir kütüphanedir.

### Client addon'ı kaydetme

`ui.js` dosyasına geri dönün ve `api.addClientAddon` yöntemini, oluşturulan klasöre bir require sorgusu ile kullanın:

```js
api.addClientAddon({
  id: 'org.vue.webpack.client-addon',
  // Oluşturulan JS dosyalarının dizini
  path: '@vue/cli-ui-addon-webpack/dist'
})
```

Bu, nodejs `require.resolve` API'sini kullanarak klasörü bulur ve client addon'dan oluşturulan `index.js` dosyasını sunar.

Veya geliştirme aşamasında bir URL belirtin (ideali, bunu test vue projenizdeki `vue-cli-ui.js` dosyasında yapmak):

```js
// Geliştirme için yararlıdır
// Bir eklentide zaten tanımlıysa yolu geçersiz kılacak
api.addClientAddon({
  id: 'org.vue.webpack.client-addon',
  // Daha önce yapılandırdığınız bağlantı noktasıyla aynı
  url: 'http://localhost:8042/index.js'
})
```

### Client addon'ı kullanma

Artık görümlerde client addon'ı kullanabilirsiniz. Örneğin, tanımlı bir görevde bir görünüm belirtebilirsiniz:

```js
api.describeTask({
  /* ... */
  // Ek görünümler (örneğin webpack panosu)
  // Varsayılan olarak, terminal çıktısını gösteren 'output' görünümü vardır
  views: [
    {
      // Benzersiz kimlik
      id: 'org.vue.webpack.views.dashboard',
      // Düğme etiketi
      label: 'Gösterge paneli',
      // Düğme simgesi (material-simgeleri)
      icon: 'dashboard',
      // ClientAddonApi kullanarak kaydedilmiş dinamik bileşen
      component: 'org.vue.webpack.components.dashboard'
    }
  ],
  // Görev detaylarını görüntülediğinizde varsayılan olarak seçilen görünüm (varsayılan olarak çıkıştır)
  defaultView: 'org.vue.webpack.views.dashboard'
})
```

İşte `'org.vue.webpack.components.dashboard'` bileşenini kaydeden client addon kodu (daha önce gördüğümüz gibi):

```js
/* `main.js` içinde */
// Bileşeni içe aktarın
import WebpackDashboard from './components/WebpackDashboard.vue'
// Özel bir bileşeni kaydedin
// ('Vue.component' gibi çalışır)
ClientAddonApi.component('org.vue.webpack.components.dashboard', WebpackDashboard)
```

![Görev görüntüsü örneği](../../images/cikti/vue-cli/public/task-view.png)

---
title: Özel Görünümler
description: Bu bölümde, özel görünümler eklemek ve paylaşılan verileri kullanmak için API metodları açıklanmaktadır. Ayrıca, eklenti eylemleri ve IPC ile yerel depolama gibi önemli konulara da değinilmektedir.
keywords: [özel görünümler, API, paylaşılan veriler, eklenti eylemleri, işlem arası iletişim]
---

## Özel Görünümler

`api.addView` yöntemiyle standart 'Proje eklentileri', 'Proje yapılandırması' ve 'Proje görevleri' öğelerinin altına yeni bir görünüm ekleyebilirsiniz:

```js
api.addView({
  // Eşsiz id
  id: 'org.vue.webpack.views.test',

  // Route adı (vue-router'dan)
  // 'ClientAddonApi.addRoutes' yöntemiyle kullanılan aynı adı kullanın (Client eklentisi bölümünde yukarıda bakınız)
  name: 'org.vue.webpack.routes.test',

  // Buton ikonu (material-icons)
  icon: 'pets',
  // Ayrıca özel bir resim belirtebilirsiniz (aşağıdaki Kamu statik dosyaları bölümüne bakınız):
  // icon: 'http://localhost:4000/_plugin/%40vue%2Fcli-service/webpack-icon.svg',

  // Buton ipucu
  tooltip: 'Webpack eklentisinden test görünümü'
})
```

Burada daha önce gördüğümüz `'org.vue.webpack.routes.test'`i kaydeden client eklentisindeki kod:

```js
/* In `main.js` */
// Bileşeni içe aktar
import TestView from './components/TestView.vue'
// vue-router altında bir /addon/<id> üst route'a rotalar ekleyin.
// Örneğin, addRoutes('foo', [ { path: '' }, { path: 'bar' } ])
// /addon/foo/ ve /addon/foo/bar rotalarını vue-router'a ekleyecektir.
// Burada 'test-webpack-route' adıyla yeni bir '/addon/vue-webpack/' rotası oluşturuyoruz
ClientAddonApi.addRoutes('org.vue.webpack', [
  { path: '', name: 'org.vue.webpack.routes.test', component: TestView }
])
```

![Özel görünüm örneği](../../images/cikti/vue-cli/public/custom-view.png)

::: tip
Bu yöntemle özelleştirilmiş görünüm bileşenlerinizi projenizin ihtiyaçlarına göre özelleştirebilirsiniz.
:::

## Paylaşılan Veriler

Özel bileşenlerle bilgi iletişimi için Paylaşılan verileri kullanın.

> Örneğin, Webpack panosu, bu API'yi kullanarak UI istemcisi ile UI sunucusu arasında derleme istatistiklerini paylaşır.

Eklentideki `ui.js` (nodejs):

```js
// Ayarla veya güncelle
api.setSharedData('com.my-name.my-variable', 'some-data')

// Al
const sharedData = api.getSharedData('com.my-name.my-variable')
if (sharedData) {
  console.log(sharedData.value)
}

// Kaldır
api.removeSharedData('com.my-name.my-variable')

// Değişiklikleri izle
const watcher = (value, id) => {
  console.log(value, id)
}
api.watchSharedData('com.my-name.my-variable', watcher)
// İzlemeyi kaldır
api.unwatchSharedData('com.my-name.my-variable', watcher)

// İsim alanı sürümleri
const {
  setSharedData,
  getSharedData,
  removeSharedData,
  watchSharedData,
  unwatchSharedData
} = api.namespace('com.my-name.')
```

::: danger
Id'leri doğru bir şekilde isim alanına almayı unutmayın, çünkü tüm eklentiler arasında eşsiz olmalıdır. [ters alan adı notasyonu](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) kullanmanız önerilir.
:::

Özel bileşende:

```js
// Vue bileşeni
export default {
  // Paylaşılan verileri senkronize et
  sharedData () {
    return {
      // Şablonda `myVariable` kullanabilirsiniz
      myVariable: 'com.my-name.my-variable'
      // İsim alanlı Paylaşılan verileri de eşleyebilirsiniz
      ...mapSharedData('com.my-name.', {
        myVariable2: 'my-variable2'
      })
    }
  },

  // Manuel yöntemler
  async created () {
    const value = await this.$getSharedData('com.my-name.my-variable')

    this.$watchSharedData(`com.my-name.my-variable`, value => {
      console.log(value)
    })

    await this.$setSharedData('com.my-name.my-variable', 'new-value')
  }
}
```

::: info
`sharedData` seçeneğini kullanıyorsanız, paylaşılan veri, karşılık gelen özelliğe yeni bir değer atayarak güncellenebilir.
:::

```html
<template>
  <VueInput v-model="message"/>
</template>

<script>
export default {
  sharedData: {
    // Sunucuda 'my-message' paylaşılan verisini senkronize edecektir
    message: 'com.my-name.my-message'
  }
}
</script>
```

Örneğin bir ayar bileşeni oluşturduğunuzda bu çok kullanışlıdır.

---

## Eklenti Eylemleri

Eklenti eylemleri, cli-ui (tarayıcı) ile eklentiler (nodejs) arasında gönderilen çağrılardır.

> Örneğin, bir özel bileşende (bkz. `Client addon`) bir düğme olabilir ve bu düğme bu API'yi kullanarak sunucudaki bazı nodejs kodunu çağırabilir.

Eklentideki `ui.js` dosyasında, `PluginApi`'den iki yöntem kullanabilirsiniz:

```js
// Bir eylemi çağır
api.callAction('com.my-name.other-action', { foo: 'bar' }).then(results => {
  console.log(results)
}).catch(errors => {
  console.error(errors)
})
```

```js
// Bir eylemi dinle
api.onAction('com.my-name.test-action', params => {
  console.log('test-action çağrıldı', params)
})
```

::: danger
Id'leri doğru bir şekilde isim alanına almayı unutmayın, çünkü tüm eklentiler arasında eşsiz olmalıdır. [ters alan adı notasyonu](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) kullanmanız önerilir.
:::

`api.namespace` ile isim alanlı sürümleri kullanabilirsiniz (Paylaşılan verilere benzer):

```js
const { onAction, callAction } = api.namespace('com.my-name.')
```

İstemci eklenti bileşenlerinde (tarayıcı), `$onPluginActionCalled`, `$onPluginActionResolved` ve `$callPluginAction`'a erişiminiz vardır:

```js
// Vue bileşeni
export default {
  created () {
    this.$onPluginActionCalled(action => {
      // Eylem çağrıldığında
      // çalıştırılmadan önce
      console.log('çağrıldı', action)
    })
    this.$onPluginActionResolved(action => {
      // Eylem çalıştırıldıktan ve tamamlandıktan sonra
      console.log('tamamlandı', action)
    })
  },

  methods: {
    testPluginAction () {
      // Bir eklenti eylemini çağır
      this.$callPluginAction('com.my-name.test-action', {
        meow: 'meow'
      })
    }
  }
}
```

---

## İşlem Arası İletişim (IPC)

IPC, İşlem Arası İletişim anlamına gelir. Bu sistem, çocuk işlemlerden (örneğin, görevlerden!) kolayca mesaj göndermenizi sağlar. Ve oldukça hızlı ve hafiftir.

> Webpack panosundaki verileri görüntülemek için, `--dashboard` argümanı verildiğinde `@vue/cli-service`'in `serve` ve `build` komutları cli-ui nodejs sunucusuna IPC mesajları gönderir.

Süreç kodunuzda (bu bir Webpack eklentisi veya bir nodejs görev betiği olabilir), `@vue/cli-shared-utils`'dan `IpcMessenger` sınıfını kullanabilirsiniz:

```js
const { IpcMessenger } = require('@vue/cli-shared-utils')

// Yeni bir IpcMessenger örneği oluştur
const ipc = new IpcMessenger()

function sendMessage (data) {
  // cli-ui sunucusuna bir mesaj gönder
  ipc.send({
    'com.my-name.some-data': {
      type: 'build',
      value: data
    }
  })
}

function messageHandler (data) {
  console.log(data)
}

// Mesajı dinle
ipc.on(messageHandler)

// Artık dinleme
ipc.off(messageHandler)

function cleanup () {
  // IPC ağından ayrıl
  ipc.disconnect()
}
```

Manuel bağlantı:

```js
const ipc = new IpcMessenger({
  autoConnect: false
})

// Bu mesaj sıraya alınacaktır
ipc.send({ ... })

ipc.connect()
```

Boşta otomatik bağlantıyı kesme (herhangi bir mesaj göndermeden belli bir süre sonra):

```js
const ipc = new IpcMessenger({
  disconnectOnIdle: true,
  idleTimeout: 3000 // Varsayılan
})

ipc.send({ ... })

setTimeout(() => {
  console.log(ipc.connected) // false
}, 3000)
```

Başka bir IPC ağına bağlanma:

```js
const ipc = new IpcMessenger({
  networkId: 'com.my-name.my-ipc-network'
})
```

Bir vue-cli eklentisi `ui.js` dosyasında, `ipcOn`, `ipcOff` ve `ipcSend` yöntemlerini kullanabilirsiniz:

```js
function onWebpackMessage ({ data: message }) {
  if (message['com.my-name.some-data']) {
    console.log(message['com.my-name.some-data'])
  }
}

// Herhangi bir IPC mesajı için dinle
api.ipcOn(onWebpackMessage)

// Artık dinleme
api.ipcOff(onWebpackMessage)

// Tüm bağlı IpcMessenger örneklerine bir mesaj gönder
api.ipcSend({
  webpackDashboardMessage: {
    foo: 'bar'
  }
})
```

---

## Yerel Depolama

Bir eklenti, ui sunucusu tarafından kullanılan yerel [lowdb](https://github.com/typicode/lowdb) veritabanından veri kaydedebilir ve yükleyebilir.

```js
// Yerel DB'ye bir değer kaydet
api.storageSet('com.my-name.an-id', { some: 'value' })

// Yerel DB'den bir değeri al
console.log(api.storageGet('com.my-name.an-id'))

// Tam lowdb örneği
api.db.get('posts')
  .find({ title: 'low!' })
  .assign({ title: 'hi!'})
  .write()

// İsim alanı yardımcıları
const { storageGet, storageSet } = api.namespace('my-plugin.')
```

::: danger
Id'leri doğru bir şekilde isim alanına almayı unutmayın, çünkü tüm eklentiler arasında eşsiz olmalıdır. [ters alan adı notasyonu](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) kullanmanız önerilir.
:::

---

## Bildirim

Kullanıcı işletim sistemi bildirim sistemini kullanarak bildirim görüntüleyebilirsiniz:

```js
api.notify({
  title: 'Bir başlık',
  message: 'Bir mesaj',
  icon: 'path-to-icon.png'
})
```

Bazı yerleşik ikonlar:

- `'done'`
- `'error'`

---

## İlerleme Ekranı

Bir metin ve ilerleme çubuğu ile bir ilerleme ekranı görüntüleyebilirsiniz:

```js
api.setProgress({
  status: 'Yükseltiliyor...',
  error: null,
  info: 'Adım 2/4',
  progress: 0.4 // 0 ile 1 arasında, -1 ilerleme çubuğunu gizler
})
```

İlerleme ekranını kaldır:

```js
api.removeProgress()
```

---

## Kancalar

Kancalar, belirli cli-ui olaylarına tepki vermeyi sağlar.

### onProjectOpen

Eklenti, mevcut proje için ilk kez yüklendiğinde çağrılır.

```js
api.onProjectOpen((project, previousProject) => {
  // Verileri sıfırla
})
```

### onPluginReload

Eklenti yeniden yüklendiğinde çağrılır.

```js
api.onPluginReload((project) => {
  console.log('eklenti yeniden yüklendi')
})
```

### onConfigRead

Bir yapılandırma ekranı açıldığında veya yenilendiğinde çağrılır.

```js
api.onConfigRead(({ config, data, onReadData, tabs, cwd }) => {
  console.log(config.id)
})
```

### onConfigWrite

Kullanıcı bir yapılandırma ekranında kaydettiğinde çağrılır.

```js
api.onConfigWrite(({ config, data, changedFields, cwd }) => {
  // ...
})
```

### onTaskOpen

Kullanıcı bir görev detay penceresi açtığında çağrılır.

```js
api.onTaskOpen(({ task, cwd }) => {
  console.log(task.id)
})
```

### onTaskRun

Kullanıcı bir görevi çalıştırdığında çağrılır.

```js
api.onTaskRun(({ task, args, child, cwd }) => {
  // ...
})
```

### onTaskExit

Bir görev çıktığında çağrılır. Hem başarı hem de hata durumunda çağrılabilir.

```js
api.onTaskExit(({ task, args, child, signal, code, cwd }) => {
  // ...
})
```

### onViewOpen

Kullanıcı bir görünüm açtığında (örneğin 'Eklentiler', 'Yapılandırmalar' veya 'Görevler') çağrılır.

```js
api.onViewOpen(({ view, cwd }) => {
  console.log(view.id)
})
```

---

## Öneriler

Öneriler, kullanıcıya bir eylem önermeyi amaçlayan butonlardır. Üst çubukta görüntülenirler. Örneğin, uygulamada paket algılanmadığında vue-router'ı yüklemeyi önerebilecek bir düğmemiz olabilir.

```js
api.addSuggestion({
  id: 'com.my-name.my-suggestion',
  type: 'action', // Gerekli (gelecekte daha fazla tür)
  label: 'vue-router ekle',
  // Bu, bir detay modalında görüntülenecek
  message: 'Modal için daha uzun bir mesaj',
  link: 'http://link-to-docs-in-the-modal',
  // İsteğe bağlı resim
  image: '/_plugin/my-package/screenshot.png',
  // Kullanıcı öneriyi etkinleştirdiğinde çağrılan işlev
  async handler () {
    // ...
    return {
      // Varsayılan olarak düğmeyi kaldırır
      keep: false
    }
  }
})
```

::: danger
Id'yi doğru bir şekilde isim alanına almayı unutmayın, çünkü tüm eklentiler arasında eşsiz olmalıdır. [ters alan adı notasyonu](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) kullanmanız önerilir.
:::

![UI Önerisi](../../images/cikti/vue-cli/public/suggestion.png)

Sonra öneriyi kaldırabilirsiniz:

```js
api.removeSuggestion('com.my-name.my-suggestion')
```

Öneriyi kullanıcı etkinleştirdiğinde `actionLink` ile bir sayfa da açabilirsiniz:

```js
api.addSuggestion({
  id: 'com.my-name.my-suggestion',
  type: 'action', // Gereklidir
  label: 'vue-router ekle',
  // Yeni bir sekme aç
  actionLink: 'https://vuejs.org/'
})
```

Genellikle öneriyi doğru bağlamda görüntülemek için kancaları kullanırsınız:

```js
const ROUTER = 'vue-router-add'

api.onViewOpen(({ view }) => {
  if (view.id === 'vue-project-plugins') {
    if (!api.hasPlugin('router')) {
      api.addSuggestion({
        id: ROUTER,
        type: 'action',
        label: 'org.vue.cli-service.suggestions.vue-router-add.label',
        message: 'org.vue.cli-service.suggestions.vue-router-add.message',
        link: 'https://router.vuejs.org/',
        async handler () {
          await install(api, 'router')
        }
      })
    }
  } else {
    api.removeSuggestion(ROUTER)
  }
})
```

Bu örnekte, vue-router önerisini yalnızca eklentiler görünümünde ve proje daha önce vue-router yüklenmemişse görüntülüyoruz.

Not: `addSuggestion` ve `removeSuggestion` bir isim alanı ile `api.namespace()` ile kullanabilir.

---

## Widget'lar

Eklenti ui dosyanızda proje panosu için bir widget kaydedebilirsiniz:

```js
registerWidget({
  // Eşsiz ID
  id: 'org.vue.widgets.news',
  // Temel bilgileri
  title: 'org.vue.widgets.news.title',
  description: 'org.vue.widgets.news.description',
  icon: 'rss_feed',
  // Widget'ı oluşturmak için kullanılan ana bileşen
  component: 'org.vue.widgets.components.news',
  // (İsteğe bağlı) Widget'ın 'tam ekran' görünümü için ikincil bileşen
  detailsComponent: 'org.vue.widgets.components.news',
  // Boyut
  minWidth: 2,
  minHeight: 1,
  maxWidth: 6,
  maxHeight: 6,
  defaultWidth: 2,
  defaultHeight: 3,
  // (İsteğe bağlı) Dashboard’daki bu widget'ın maksimum sayısını sınırlayın
  maxCount: 1,
  // (İsteğe bağlı) Widget başlığında 'tam ekran' butonunu ekleyin
  openDetailsButton: true,
  // (İsteğe bağlı) Widget için varsayılan yapılandırma
  defaultConfig: () => ({
    url: 'https://vuenews.fireside.fm/rss'
  }),
  // (İsteğe bağlı) Eklenirken kullanıcıdan widget'ı yapılandırması istenir
  // Bunu kullanmamalısınız `defaultConfig` ile
  needsUserConfig: true,
  // (İsteğe bağlı) Widget'ı yapılandırmak için talimatları görüntüleyin
  onConfigOpen: async ({ context }) => {
    return {
      prompts: [
        {
          name: 'url',
          type: 'input',
          message: 'org.vue.widgets.news.prompts.url',
          validate: input => !!input // Gereklidir
        }
      ]
    }
  }
})
```

Not: `registerWidget` bir isim alanı ile `api.namespace()` ile kullanılabilir.

---

## Diğer Yöntemler

### hasPlugin

Projenin eklentiyi kullanması durumunda `true` döner.

```js
api.hasPlugin('eslint')
api.hasPlugin('apollo')
api.hasPlugin('vue-cli-plugin-apollo')
```

### getCwd

Mevcut çalışma dizinini alır.

```js
api.getCwd()
```

### resolve

Mevcut proje içindeki bir dosyayı çözer.

```js
api.resolve('src/main.js')
```

### getProject

Şu anda açık olan projeyi alır.

```js
api.getProject()
```

### requestRoute

Kullanıcıyı web istemcisindeki belirli bir rotaya yönlendirin.

```js
api.requestRoute({
  name: 'foo',
  params: {
    id: 'bar'
  }
})

api.requestRoute('/foobar')
```

---

## Kamu Statik Dosyaları

Bazı statik dosyaları cli-ui yerleşik HTTP sunucusu üzerinden paylaşmanız gerekebilir (tipik olarak özel bir görünüm için bir ikon belirtmek isterseniz).

Eklenti paket klasörünün kökünde isteğe bağlı bir `ui-public` klasöründeki herhangi bir dosya `/_plugin/:id/*` HTTP rotasına sunulacaktır.

Örneğin, `my-logo.png` dosyasını `vue-cli-plugin-hello/ui-public/` klasörüne yerleştirirseniz, cli-ui eklentiyi yüklediğinde `/_plugin/vue-cli-plugin-hello/my-logo.png` URL'si ile erişilebilir olacaktır.

```js
api.describeConfig({
  /* ... */
  // Özel resim
  icon: '/_plugin/vue-cli-plugin-hello/my-logo.png'
})