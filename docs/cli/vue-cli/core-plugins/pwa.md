---
description: Vue CLI için PWA (Progressive Web App) eklentisi hakkında bilgi ve yapılandırma seçenekleri. Bu kılavuz, servis çalıştırıcısının etkinleştirilmesi, yapılandırma ayarları ve örnek kodlar sunar.
keywords: [vue-cli, PWA, servis çalıştırıcısı, yapılandırma, workbox]
---

# @vue/cli-plugin-pwa

> Vue CLI için PWA eklentisi

Bu eklenti ile eklenen servis çalıştırıcısı yalnızca üretim ortamında etkinleştirilmiştir (örneğin, sadece `npm run build` veya `yarn build` komutunu çalıştırdığınızda). Geliştirme modunda servis çalıştırıcısını etkinleştirmek önerilmez, çünkü daha önce önbelleğe alınmış varlıkların kullanılmasına ve en son yerel değişikliklerin dahil edilmemesine neden olabilir.

:::info
**Geliştirme Modu Notu:**  
Bunun yerine, geliştirme modunda `noopServiceWorker.js` dahil edilmiştir. Bu servis çalıştırıcı dosyası, aynı host:port kombinasyonu için kayıtlı olan herhangi bir önceki servis çalıştırıcısını sıfırlayan etkili bir 'işlem yapmayan (no-op)' dosyadır.
:::

Eğer servis çalıştırıcısını yerel olarak test etmeniz gerekiyorsa, uygulamayı oluşturun ve oluşturma dizininizden basit bir HTTP sunucusu çalıştırın. Tarayıcı önbellek sorunlarıyla karşılaşmamak için bir tarayıcı gizli penceresi kullanmanız önerilir.

## Yapılandırma

Yapılandırma, `vue.config.js` dosyasının `pwa` özelliği veya `package.json` içindeki `"vue"` alanı aracılığıyla yapılır.

- **pwa.workboxPluginMode**

  Bu, altındaki [`workbox-webpack-plugin`](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin) tarafından desteklenen iki mod arasında seçim yapmanızı sağlar.

  - `'GenerateSW'` (varsayılan), her seferinde web uygulamanızı yeniden oluşturduğunuzda yeni bir servis çalıştırıcı dosyası oluşturacaktır.

  - `'InjectManifest'`, mevcut bir servis çalıştırıcı dosyasıyla başlamanıza olanak tanır ve o dosyanın bir "önbellek manifestosu" ile içe aktarılmış bir kopyasını oluşturur.

  "Hangi Eklentiyi Kullanmalısınız?" kılavuzu, iki mod arasında seçim yapmanıza yardımcı olabilir.

- **pwa.workboxOptions**

  Bu seçenekler, altındaki `workbox-webpack-plugin` aracılığıyla iletilir.

:::tip
**Dikkat:**  
Hangi değerlerin desteklendiği hakkında daha fazla bilgi için lütfen [`GenerateSW`](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_generatesw_config) veya [`InjectManifest`](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_injectmanifest_config) kılavuzuna bakın.
:::

- **pwa.name**

  - Varsayılan: `package.json` içindeki "name" alanı

    Oluşturulan HTML'deki `apple-mobile-web-app-title` meta etiketinin değeri olarak kullanılır. Bunun için `public/manifest.json` dosyasını düzenlemeniz gerektiğini unutmayın.

- **pwa.themeColor**

  - Varsayılan: `'#4DBA87'`

- **pwa.msTileColor**

  - Varsayılan: `'#000000'`

- **pwa.appleMobileWebAppCapable**

  - Varsayılan: `'hayır'`

    Bu, iOS 11.3'ten önce PWA desteği olmadığı için `'hayır'` olarak varsayılan olarak ayarlanmıştır. Daha fazla bilgi için [bu makaleye](https://medium.com/@firt/dont-use-ios-web-app-meta-tag-irresponsibly-in-your-progressive-web-apps-85d70f4438cb) bakabilirsiniz.

- **pwa.appleMobileWebAppStatusBarStyle**

  - Varsayılan: `'varsayılan'`

- **pwa.assetsVersion**

  - Varsayılan: `''`

    Bu seçenek, simgelerinize ve manifestonuza bir sürüm eklemeniz gerekiyorsa kullanılır ve URL'lere `?v=` eklenir.

- **pwa.manifestPath**

  - Varsayılan: `'manifest.json'`

    Uygulamanın manifestosunun yolu. Eğer yol bir URL ise, eklenti build sırasında dist dizininde manifest.json oluşturmayacaktır.

- **pwa.manifestOptions**

  - Varsayılan: `{}`

    Bu nesne, `manifest.json` oluşturmak için kullanılacaktır.

    Eğer nesnede aşağıdaki nitelikler tanımlanmamışsa, `pwa` seçenekleri veya varsayılan seçenekler kullanılacaktır.
      - name: `pwa.name`
      - short_name: `pwa.name`
      - start_url: `'.'`
      - display: `'standalone'`
      - theme_color: `pwa.themeColor`

- **pwa.manifestCrossorigin**

  - Varsayılan: `tanımsız`

    Oluşturulan HTML'deki manifest bağlantı etiketindeki `crossorigin` niteliği için değer. Eğer PWA'nız doğrulanmış bir proxy arkasındaysa bunu ayarlamanız gerekebilir. Daha fazla bilgi için [cross-origin değerlerine](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-crossorigin) bakabilirsiniz.

- **pwa.iconPaths**

  - Varsayılanlar:

    ```js
    {
      faviconSVG: 'img/icons/favicon.svg',
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    }
    ```

    Bu değerleri simgeleriniz için farklı yollar kullanacak şekilde değiştirin. v4.3.0 itibarıyla, bir değeri `null` olarak kullanarak o simgenin dahil edilmesini engelleyebilirsiniz.

### Örnek Yapılandırma

```js
// Inside vue.config.js
module.exports = {
  // ...diğer vue-cli eklenti seçenekleri...
  pwa: {
    name: 'My App',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // workbox eklentisini yapılandırın
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // InjectManifest modunda swSrc gereklidir.
      swSrc: 'dev/sw.js',
      // ...diğer Workbox seçenekleri...
    }
  }
}
```

## Zaten Oluşturulmuş Bir Projeye Kurulum

```bash
vue add pwa
```

## Enjekte Edilen webpack-chain Kuralları

- `config.plugin('workbox')`