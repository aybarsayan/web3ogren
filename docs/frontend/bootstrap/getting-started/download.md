---
description: Derlenmiş CSS ve JavaScript almak için CoreUI for Bootstrap'ı indirin, kaynak kodunu edinin veya npm, RubyGems ve daha fazlası gibi en sevdiğiniz paket yöneticileriyle dahil edin. Bu belgeler, CoreUI'nın çeşitli entegrasyon yöntemlerini kapsamaktadır.
keywords: [CoreUI, Bootstrap, CSS, JavaScript, npm, kaynak kodu, paket yöneticisi]
---

# İndirme

## Derlenmiş CSS ve JS

Projenize kolayca entegre edebilmeniz için **CoreUI for Bootstrap v** için kullanıma hazır derlenmiş kodu indirin; bu, şunları içerir:

- Derlenmiş ve minify edilmiş CSS paketleri (bkz. `CSS dosyaları karşılaştırması`)
- Derlenmiş ve minify edilmiş JavaScript eklentileri (bkz. `JS dosyaları karşılaştırması`)

Bu, belgeleri, kaynak dosyaları veya Popper gibi isteğe bağlı JavaScript bağımlılıklarını içermez.

}}" class="btn btn-primary" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download Bootstrap');">İndir

## Kaynak dosyaları

Kendi varlık hattınızla CoreUI for Bootstrap'ı derlemek için kaynak Sass, JavaScript ve belgelerimizi indirerek kullanın. Bu seçenek, bazı ek araçlar gerektirir:

- CSS'inizi derlemek için **Sass derleyicisi** (Libsass veya Ruby Sass desteklenmektedir).
- CSS tedarikçi ön ekleme için [Autoprefixer](https://github.com/postcss/autoprefixer)

:::info
Eğer `derleme araçlarına` ihtiyacınız varsa, bunlar CoreUI for Bootstrap ve belgelerinin geliştirilmesi için dahil edilmiştir, ancak muhtemelen kendi ihtiyaçlarınız için uygun değildir.
:::

}}" class="btn btn-primary" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download source');">Kaynağı indir

## jsDelivr üzerinden CDN

Projenize CoreUI'nın derlenmiş CSS ve JS'in önbelleğe alınmış versiyonunu sağlamak için [jsDelivr](https://www.jsdelivr.com/) ile indirmeyi atlayın.

```html
<link href="{{< param "cdn.css" >}}" rel="stylesheet" integrity="{{< param "cdn.css_hash" >}}" crossorigin="anonymous">
<script src="{{< param "cdn.js_bundle" >}}" integrity="{{< param "cdn.js_bundle_hash" >}}" crossorigin="anonymous"></script>
```

Eğer derlenmiş JavaScript'ımızı kullanıyorsanız ve Popper'ı ayrı dahil etmeyi tercih ediyorsanız, Popper'ı JS'imizin önüne ekleyin; mümkünse bir CDN üzerinden.

```html
<script src="{{< param "cdn.popper" >}}" integrity="{{< param "cdn.popper_hash" >}}" crossorigin="anonymous"></script>
<script src="{{< param "cdn.js" >}}" integrity="{{< param "cdn.js_hash" >}}" crossorigin="anonymous"></script>
```

## Paket yöneticileri

CoreUI'nın **kaynak dosyalarını** en popüler paket yöneticilerinden bazılarıyla hemen hemen her projeye dahil edin. Paket yöneticisi ne olursa olsun, CoreUI for Bootstrap, resmi derlenmiş sürümlerimizle eşleşen bir kurulum için **bir Sass derleyicisi ve [Autoprefixer](https://github.com/postcss/autoprefixer)** gerektirecektir.

### npm

CoreUI for Bootstrap'ı Node.js destekli uygulamalarınıza [npm paketi](https://www.npmjs.com/package/@coreui/coreui) ile yükleyin:

```sh
npm install @coreui/coreui
```

> `const coreui = require('@coreui/coreui')` veya `import coreui from '@coreui/coreui'` CoreUI'nın tüm eklentilerini bir `coreui` nesnesine yükleyecektir. `coreui` modülü kendisi tüm eklentilerimizi dışa aktarır. CoreUI'nın eklentilerini bireysel olarak yüklemek için paketin üst düzey dizinindeki `/js/dist/*.js` dosyalarını yükleyebilirsiniz.

CoreUI'nın `package.json` dosyası, aşağıdaki anahtarlar altında bazı ek meta veriler içerir:

- `sass` - CoreUI'nın ana [Sass](https://sass-lang.com/) kaynak dosyasının yolu
- `style` - Varsayılan ayarlarla önceden derlenmiş CoreUI'nın minify edilmemiş CSS'sinin yolu (özelleştirme yok)

### yarn

CoreUI'yı Node.js destekli uygulamalarınıza [yarn paketi](https://yarnpkg.com/en/package/@coreui/coreui) ile yükleyin:

```sh
yarn add @coreui/coreui
```

### Composer

CoreUI'nın Sass ve JavaScript'ini [Composer](https://getcomposer.org/) ile de yükleyebilir ve yönetebilirsiniz:

```sh
composer require coreui/coreui:{{< param current_version >}}
```