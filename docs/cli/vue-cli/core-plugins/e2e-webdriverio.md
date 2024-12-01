---
description: Vue CLI için e2e-webdriverio eklentisi ile uçtan uca testlerin nasıl kurulacağını ve çalıştırılacağını öğrenin. Proje yapısını ve komutları keşfedin.
keywords: [Vue CLI, e2e, WebdriverIO, uçtan uca test, test otomasyonu, proje yapısı, CLI seçenekleri]
---

# @vue/cli-plugin-e2e-webdriverio

> vue-cli için e2e-webdriverio eklentisi

## Enjekte Edilen Komutlar

- **`vue-cli-service test:e2e`**

  [WebdriverIO](https://webdriver.io/) ile uçtan uca testleri çalıştırın.

  Seçenekler:

  ```
  --remote          Testleri SauceLabs üzerinde uzaktan çalıştırır

  Tüm WebdriverIO CLI seçenekleri de desteklenmektedir.
  ```

  Ayrıca, tüm [WebdriverIO CLI seçenekleri](https://webdriver.io/docs/clioptions.html) de desteklenmektedir. Örneğin: `--baseUrl`, `--bail` vb.

---

## Proje Yapısı

Bu eklentiyi yüklediğinizde aşağıdaki yapı oluşturulacaktır:

```
tests/e2e/
  ├── pageobjects/
  |   └── app.page.js
  ├── specs/
  |   ├── app.spec.js
  └── .eslintrc.js
```

Buna ek olarak, 3 yapılandırma dosyası oluşturulacaktır:

- `wdio.shared.conf.js`: tüm ortamlar için tanımlı tüm seçenekleri içeren paylaşılan bir yapılandırma
- `wdio.local.conf.js`: yerel testler için yerel bir yapılandırma
- `wdio.sauce.conf.js`: [Sauce Labs](https://saucelabs.com/) gibi bir bulut sağlayıcısında testler için uzaktan bir yapılandırma

---

Dizinler şunları içerir:

#### `pageobjects`
Bir sayfa nesnesi örneği içerir. WebdriverIO ile [Sayfa Nesneleri](https://webdriver.io/docs/pageobjects.html) kullanımı hakkında daha fazla bilgi edinin.

#### `specs`
Uçtan uca testleriniz.

---

## Zaten Oluşturulmuş Bir Projeye Yükleme

```bash
vue add e2e-webdriverio
```

Eski CLI sürümlerine sahip kullanıcılar için `vue add @vue/e2e-webdriverio` komutunu çalıştırmanız gerekebilir.

---

## Testleri Çalıştırma

Varsayılan olarak, `specs` klasörü içindeki tüm testler Chrome kullanılarak çalıştırılacaktır. Chrome (veya Firefox) üzerinde başsız modda uçtan uca testler çalıştırmak isterseniz, `--headless` argümanını geçmeniz yeterlidir. Testler bulutta çalıştırıldığında otomatik olarak paralel olarak çalıştırılacaktır.

```bash
$ vue-cli-service test:e2e
```

**Tek bir testi çalıştırma**

> Tek bir testi çalıştırmak için dosya adı yolunu belirtin. Örneğin:

```bash
$ vue-cli-service test:e2e --spec tests/e2e/specs/test.js
```

**Geliştirici sunucusunu otomatik başlatmayı atla**

:::tip
Geliştirme sunucusu zaten çalışıyorsa ve onu otomatik olarak başlatmayı atlamak istiyorsanız, `--url` argümanını geçin:
:::

```bash
$ vue-cli-service test:e2e --baseUrl=http://localhost:8080/