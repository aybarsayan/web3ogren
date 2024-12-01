---
title: "@vue/cli-plugin-e2e-nightwatch"
description: Vue CLI için e2e-nightwatch eklentisi ile uçtan uca testlerin nasıl yapılacağını keşfedin. Nightwatch.js ile testlerinizi daha verimli hale getirin ve kolay yapılandırma seçeneklerini kullanın.
keywords: [vue, e2e, nightwatch, test, yapılandırma]
---

> vue-cli için e2e-nightwatch eklentisi

## Enjekte Edilen Komutlar

- **`vue-cli-service test:e2e`**

  [Nightwatch.js](https://nightwatchjs.org) ile uçtan uca testleri çalıştırın.

  Seçenekler:

  ```
  --url                 oturum açma sunucusunu otomatik başlatmak yerine verilen url üzerinden testleri çalıştır
  --config              özel nightwatch yapılandırma dosyası kullan (iç yapılandırmaları geçersiz kılar)
  --headless            başsız modda chrome veya firefox kullan
  --parallel            test işçileri aracılığıyla paralel modu etkinleştir (sadece chromedriver'da mevcuttur)
  --use-selenium        chromedriver veya geckodriver yerine Selenium bağımsız sunucusunu kullan
  -e, --env             çalıştırılacak tarayıcı ortamlarını virgülle belirt (varsayılan: chrome)
  -t, --test            çalıştırılacak testin adını belirt
  -f, --filter          dosya adına göre testleri filtrelemek için glob
  ```

  :::tip
  Ayrıca, tüm [Nightwatch CLI seçenekleri](https://nightwatchjs.org/guide/running-tests/#command-line-options) de desteklenmektedir. Örneğin: `--verbose`, `--retries` vb.
  :::

---

## Proje Yapısı

Bu eklentiyi yüklediğinizde aşağıdaki yapı oluşturulacaktır. Nightwatch'ta en yaygın test kavramları için örnekler mevcuttur.

```
tests/e2e/
  ├── custom-assertions/
  |   └── elementCount.js
  ├── custom-commands/
  |   ├── customExecute.js
  |   ├── openHomepage.js
  |   └── openHomepageClass.js
  ├── page-objects/
  |   └── homepage.js
  ├── specs/
  |   ├── test.js
  |   └── test-with-pageobjects.js
  └── globals.js
```

> **Not:** Testlerinizi düzenlemek için bu yapı düzenli bir yol sağlar.

#### `specs`
Testlerin bulunduğu ana konum. `--group` argümanını kullanarak çalıştırma sırasında hedeflenebilecek alt klasörler içerebilir. [Daha fazla bilgi](https://nightwatchjs.org/guide/running-tests/#test-groups).

#### `custom-assertions`
Burada yer alan dosyalar Nightwatch tarafından otomatik olarak yüklenir ve `.assert` ve `.verify` api ad alanlarına yerleştirilir, böylece Nightwatch'ın yerleşik doğrulamalarını genişletir. Daha fazla bilgi için [özel doğrulamalar yazma](https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-assertions) sayfasını inceleyin.

#### `custom-commands`
Burada yer alan dosyalar Nightwatch tarafından otomatik olarak yüklenir ve ana `browser` api nesnesine yerleştirilir, böylece Nightwatch'ın yerleşik komutlarını genişletir. Daha fazla bilgi için [özel komutlar yazma](https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-commands) sayfasını inceleyin.

#### `page objects`
Sayfa nesneleri ile çalışmak, uçtan uca UI testlerinde popüler bir yöntemdir. Bu klasöre yerleştirilen dosyalar otomatik olarak `.page` api ad alanına yüklenir; dosyanın adı, sayfa nesnesinin adını oluşturur. Daha fazla bilgi için [sayfa nesneleri ile çalışma](https://nightwatchjs.org/guide/working-with-page-objects/) bölümüne bakın.

#### `globals.js`
Küresel özellikler veya kancalar tutabilen dış globals dosyası. Daha fazla bilgi için [test globals](https://nightwatchjs.org/gettingstarted/configuration/#test-globals) bölümünü inceleyin.

---

## Zaten Oluşturulmuş Bir Projeye Yükleme

```bash
vue add e2e-nightwatch
```

## Yapılandırma

Nightwatch'ı varsayılan olarak Chrome ile çalışacak şekilde önceden yapılandırdık. Firefox, `--env firefox` ile de kullanılabilir. Eğer uçtan uca testleri ek tarayıcılarda (örneğin Safari, Microsoft Edge) çalıştırmak istiyorsanız, proje kökünüze ek tarayıcıları yapılandırmak için bir `nightwatch.conf.js` veya `nightwatch.json` dosyası eklemeniz gerekecektir. Yapılandırma, [iç Nightwatch yapılandırması](https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-e2e-nightwatch/nightwatch.config.js) ile birleştirilecektir.

Alternatif olarak, iç yapılandırmayı özel bir yapılandırma dosyası ile `--config` seçeneğini kullanarak tamamen değiştirebilirsiniz.

Yapılandırma seçenekleri için Nightwatch belgelerini ve [tarayıcı sürücülerini ayarlama](http://nightwatchjs.org/gettingstarted#browser-drivers-setup) ile ilgili bilgileri inceleyin.

---

## Testleri Çalıştırma

Varsayılan olarak, `specs` klasörü içindeki tüm testler Chrome ile çalıştırılacaktır. Chrome (veya Firefox) üzerinde başsız modda uçtan uca testleri çalıştırmak istiyorsanız, sadece `--headless` argümanını geçmeniz yeterlidir.

```bash
$ vue-cli-service test:e2e
```

**Tek bir testi çalıştırma**

Tek bir testi çalıştırmak için dosya adı yolunu sağlayın. Örneğin:

```bash
$ vue-cli-service test:e2e tests/e2e/specs/test.js
```

**Geliştirici sunucusunu otomatik başlatmayı atla**

Geliştirme sunucusu zaten çalışıyorsa ve onu otomatik başlatmayı atlamak istiyorsanız, `--url` argümanını geçin:

```bash
$ vue-cli-service test:e2e --url http://localhost:8080/
```

**Firefox'ta çalıştırma**

Testleri Firefox'ta çalıştırma desteği de varsayılan olarak mevcuttur. Aşağıdaki komutu çalıştırın (isteğe bağlı olarak `--headless` ekleyerek Firefox'u başsız modda çalıştırabilirsiniz):

```bash
$ vue-cli-service test:e2e --env firefox [--headless]
```

**Firefox ve Chrome'u aynı anda çalıştırma**

Testleri her iki tarayıcıda aynı anda çalıştırmak için her iki test ortamını da virgülle ayrılmış olarak sağlamak yeterlidir ("," ile) - boşluk bırakmadan.

```bash
$ vue-cli-service test:e2e --env firefox,chrome [--headless]
```

:::warning
Testleri Paralel Çalıştırma: Birden fazla test paketi olduğunda, test çalıştırmalarını önemli ölçüde daha hızlı hale getirmek için paralel test çalıştırmayı etkinleştirebilirsiniz. Eşzamanlılık dosya düzeyinde gerçekleştirilir ve mevcut her CPU çekirdeğine otomatik olarak dağıtılır. Şu anda bu yalnızca Chromedriver'da mevcut. Nightwatch belgelerinde [paralel çalıştırma](https://nightwatchjs.org/guide/running-tests/#parallel-running) hakkında daha fazla bilgi edinin.
:::

```bash
$ vue-cli-service test:e2e --parallel
```

**Selenium ile çalıştırma**

`v4` itibarıyla, bu eklentide Selenium bağımsız sunucu artık dahil değildir ve çoğu durumda Nightwatch v1.0 ile Selenium ile çalıştırma gereksizdir.

Yine de Selenium sunucusunu kullanmak mümkündür, bu adımları takip ederek:

__1.__ `selenium-server` NPM paketini yükleyin:

```bash
$ npm install selenium-server --save-dev
```

__2.__ `--use-selenium` cli argümanı ile çalıştırın:

```bash
$ vue-cli-service test:e2e --use-selenium
```