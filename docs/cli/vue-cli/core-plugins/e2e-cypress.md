---
description: Bu belge, Vue CLI için end-to-end (E2E) test desteği ekleyen @vue/cli-plugin-e2e-cypress eklentisini tanıtır. Cypress'in sunduğu olanaklar, yapılandırma seçenekleri ve ortam değişkenleri hakkında bilgi verir.
keywords: [Vue CLI, E2E test, Cypress, JavaScript, test otomasyonu, yazılım geliştirme, test aracı]
---

# @vue/cli-plugin-e2e-cypress

> e2e-cypress eklentisi vue-cli için

Bu, [Cypress](https://www.cypress.io/) kullanarak E2E test desteği ekler.

Cypress, E2E testlerini Firefox ve Chromium tabanlı tarayıcılarda (Chrome, MS Edge, Brave, Electron) çalıştırmak için zengin interaktif bir arayüz sunar. Tarayıcılar arası testler hakkında daha fazla bilgi edinmek için [Cypress Tarayıcılar Arası Test Kılavuzu](https://on.cypress.io/cross-browser-testing) sayfasını ziyaret edin.

> **Not:** Eğer IE veya Safari'de E2E testi ile ilgili katı bir gereksiniminiz varsa, Selenium tabanlı [@vue/cli-plugin-e2e-nightwatch](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-e2e-nightwatch) kullanmayı düşünün.

## Enjekte Edilen Komutlar

- **`vue-cli-service test:e2e`**

  `cypress run` ile e2e testlerini çalıştırın.

  Varsayılan olarak, etkileşimli modda GUI ile Cypress'i başlatır ( `cypress open` aracılığıyla). Testleri arka planda çalıştırmak istiyorsanız (ör. CI için), `--headless` seçeneği ile bunu yapabilirsiniz.

  Komut, e2e testlerini çalıştırmak için üretim modunda bir sunucu başlatır. Sunucuyu her seferinde yeniden başlatmadan testleri birden fazla kez çalıştırmak istiyorsanız, bir terminalde `vue-cli-service serve --mode production` ile sunucuyu başlatabilir ve ardından o sunucuya karşı `--url` seçeneğiyle e2e testlerini çalıştırabilirsiniz.

  Seçenekler:

  ```
  --headless GUI olmadan başsız modda çalıştırır
  --mode     geliştirme sunucusunun çalışacağı modu belirtir. (varsayılan: üretim)
  --url      otomatik olarak geliştirme sunucusu başlatmak yerine verilen URL'ye karşı e2e testlerini çalıştırır
  -s, --spec (sadece başsız) belirli bir spesifikasyon dosyasını çalıştırır. varsayılan "tümü"
  ```

  Ayrıca:

  - GUI modunda, [`cypress open` için tüm Cypress CLI seçenekleri de desteklenmektedir](https://docs.cypress.io/guides/guides/command-line.html#cypress-open);
  - `--headless` modunda, [`cypress run` için tüm Cypress CLI seçenekleri de desteklenmektedir](https://docs.cypress.io/guides/guides/command-line.html#cypress-run).

  Örnekler:
  - Belirli bir dosya için başsız modda Cypress'i çalıştırın: `vue-cli-service test:e2e --headless --spec tests/e2e/specs/actions.spec.js`

---

## Yapılandırma

Cypress'i, çoğu e2e testine ilişkin dosyaları `/tests/e2e` altına yerleştirecek şekilde önceden yapılandırdık. Ayrıca [Cypress'i `cypress.json` ile nasıl yapılandıracağınızı](https://docs.cypress.io/guides/references/configuration.html#Options) kontrol edebilirsiniz.

---

## Ortam Değişkenleri

Cypress, `.env` dosyalarını test dosyalarınız için `vue-cli`'nin [uygulama kodu](https://cli.vuejs.org/guide/mode-and-env.html#using-env-variables-in-client-side-code) için yaptığı gibi yüklemez. Cypress, [env değişkenlerini tanımlamanın](https://docs.cypress.io/guides/guides/environment-variables.html#) birkaç yolunu destekler ancak en kolay yolu ortam değişkenlerini tanımlamak için .json dosyaları (ya `cypress.json` ya da `cypress.env.json`) kullanmaktır. Bu değişkenlerin, normal `process.env` nesnesi yerine `Cypress.env` fonksiyonu aracılığıyla erişilebilir olduğunu aklınızda bulundurun.

---

## Zaten Oluşturulmuş Bir Projede Kurulum

```bash
vue add e2e-cypress
```