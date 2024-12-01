````markdown
---
title: Kurulum
description: Bu belge, uygulama örneğimizi nasıl oluşturduğumuzu, e2e testlerini nasıl çalıştırdığımızı ve hangi teknolojiyi kullandığımızı açıklar. Ayrıca test yazma ile ilgili kısa bir bölüm de içerir.
keywords: [kurulum, e2e test, playwright, Strapi, otomatik test]
---

## Genel Bakış

Bu belge, uygulama örneğimizi nasıl oluşturduğumuzu, e2e testlerini nasıl çalıştırdığımızı ve e2e testleri için hangi teknolojiyi kullandığımızı yüksek düzeyde açıklar. Ayrıca test yazma ile ilgili küçük bir bölüm de vardır.

## Başlarken

E2E testlerini çalıştırmak için öncelikle playwright tarayıcılarını kurmalısınız.

```shell
npx playwright install
```

E2E testlerimize karşı doğrulamak için "temiz" bir örneğe ihtiyaç duyduğumuzdan, bu test senaryosuna dahil edilmiştir; dolayısıyla çalıştırmanız gereken tek şey:

```shell
yarn test:e2e
```

Bu, varsayılan olarak bir test alanı (örneğin, içerik yöneticisi) için `test-apps` dizininde bir Strapi örneği başlatır ve bireysel `playwright.config` örneği başlatılıp testler çalıştırılır. `test-apps`'in monorepo'nun bir parçası olarak kabul edilmemesi nedeniyle, bağımlılıkları otomatik olarak örneğin monorepo'suyla ilişkilendiririz; bu da en son Strapi sürümünü (yayınlanmış veya gelişim) kullanmak istediğimiz anlamına gelir; dolayısıyla en son kod değişikliklerimizin test edilmesi mümkündür.

:::tip
Eğer test-apps dizinini temizlemeniz gerekirse çünkü beklenildiği gibi çalışmıyorlarsa, `yarn test:e2e clean` komutunu çalıştırabilirsiniz.
:::

### Belirli testleri çalıştırma

Yalnızca bir alanı çalıştırmak için, e2e/tests dizininde "admin" veya "content-manager" gibi bir üst düzey dizin kullanarak `--domains` seçeneğini kullanın.

```shell
yarn test:e2e --domains=admin
npm run test:e2e --domains=admin
```

Belirli bir dosyayı çalıştırmak için, `--` ile test:e2e seçenekleri ile playwright seçenekleri arasında argümanlar ve seçenekler geçirebilirsiniz, örneğin:

```shell
# yalnızca admin alanındaki login.spec.ts dosyasını çalıştırmak için
yarn test:e2e --domains=admin -- login.spec.ts
npm run test:e2e --domains=admin -- login.spec.ts
```

**Bir alan belirtmeyi unutmayın; aksi takdirde playwright, her alanı o dosya adına göre filtreleyerek çalıştırmaya çalışacak ve o dosya adını içermeyen alanlar "test bulunamadı" hatasıyla başarısız olacaktır.**

### Belirli tarayıcıları çalıştırma

Yalnızca belirli bir tarayıcıyı çalıştırmak (örneğin, test geliştirmeyi hızlandırmak için) için playwright'a `--project` ile `chromium`, `firefox` veya `webkit` değerlerini geçirebilirsiniz.

```shell
yarn test:e2e --domains=admin -- login.spec.ts --project=chromium
npm run test:e2e --domains=admin -- login.spec.ts --project=chromium
```

Testlerinizi bir tarayıcı örneği ve playwright hata ayıklayıcı ile hata ayıklamak için `--debug` seçeneğini şu şekilde geçirebilirsiniz:

```shell
yarn test:e2e --domains admin -- --debug
yarn test:e2e --domains admin -- login.spec.ts --debug
```

### Eşzamanlılık / Paralelleştirme

Varsayılan olarak, her alan kendi test uygulamasıyla diğer alanlarla paralel olarak çalıştırılır. Bir alandaki testler, birer birer sıralı olarak çalıştırılır.

Çıktıyı görüntülemeniz için daha kolay bir yol arıyorsanız veya sisteminizde aynı anda birden fazla uygulama çalıştırmakta sorun yaşıyorsanız, `-c` seçeneğini kullanabilirsiniz.

```shell
# yalnızca bir alanı aynı anda çalıştır
yarn test:e2e -c 1
```

### Test Konfigürasyonunu Kontrol Etmek için Çevre Değişkenleri

Playwright yapılandırmanızı kendi sisteminizde değiştirmenizi sağlayacak bazı yardımcı araçlar eklendi; bu, test çalıştırıcısı tarafından kullanılan playwright yapılandırma dosyasını değiştirmeden yapılabilir.

| env var                      | Açıklama                                     | Varsayılan         |
| ---------------------------- | -------------------------------------------- | ------------------ |
| PLAYWRIGHT_WEBSERVER_TIMEOUT | Strapi sunucusunun başlatılması için zaman aşımı | 16000 (160s)       |
| PLAYWRIGHT_ACTION_TIMEOUT    | playwright eylem zaman aşımı (örneğin, tıkla()) | 15000 (15s)        |
| PLAYWRIGHT_EXPECT_TIMEOUT    | playwright expect waitFor zaman aşımı       | 10000 (10s)        |
| PLAYWRIGHT_TIMEOUT           | her bir bireysel test için playwright zaman aşımı | 30000 (30s)        |
| PLAYWRIGHT_OUTPUT_DIR        | trace dosyaları gibi playwright çıktı dizini | '../test-results/' |
| PLAYWRIGHT_VIDEO             | başarısız testlerde videoları kaydetmek için 'true' olarak ayarlayın | false              |

## Strapi Şablonları

Oluşturduğunuz test-app, bu dizinde `e2e/app-template` altında bulunan bir [şablonu](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/installation/templates.html) kullanır; burada önceden oluşturulmuş içerik şemalarını ve diğer eklentiler / özel alanlar / uç noktalar gibi ihtiyaç duyabileceğimiz özelleştirmeleri depolayabiliriz.

:::note
Şablona bir şey eklediyseniz, bu bilgiyi `belgelere` eklemeyi unutmayın.
:::

## Ortam değişkenleri ile test çalıştırma (EE testlerini çalıştırmak için gereklidir)

Testleriniz için belirli ortam değişkenlerini ayarlamak üzere, e2e klasörünün kökünde bir `.env` dosyası oluşturulabilir. Bu, bir Strapi lisansı ile testleri çalıştırmanız veya gelecekteki bayrakları ayarlamanız gerektiğinde faydalı olabilir.

## Gelecekteki bayraklarla test çalıştırma

Kararsız bir gelecekteki özellik için test yazıyorsanız, `app-template/config/features.js` dosyasını eklemelisiniz. Şu anda uygulama şablonu oluşturulması yapılandırma klasörünü dikkate almamaktadır. Ancak, run-e2e-tests betiği, oluşturulan uygulamaya özellik yapılandırmasını uygulayacaktır. [features.js](https://docs.strapi.io/dev-docs/configurations/features#enabling-a-future-flag) için belgeleri kontrol edin.

## Playwright Nedir?

Playwright, modern web uygulamaları için güvenilir uçtan uca testler sağlamaktadır. Tarayıcılar arası, platformlar arası ve diller arasıdır. Strapi'de JavaScript otomatik testi için kullanıyoruz.

Daha fazla bilgi için [belgelerine](https://playwright.dev/docs/intro) göz atın. Eğer API'leriyle ilgili sorun yaşıyorsanız, o zaman belirli [API belgelerine](https://playwright.dev/docs/api/class-playwright) göz atın.

## İyi bir uçtan uca test nedir?

Bu milyar dolarlık soru. E2E testleri genellikle birden fazla uygulama noktasını kapsayan tam kullanıcı akışlarını test eder, süreç içinde neler olduğunu değil, yalnızca kullanıcı bakış açısını ve son sonuçları merak ederiz. Onları yazmayı hikayenizi düşünerek değerlendirmenizi öneririz. Örneğin: "Bir kullanıcı olarak yeni bir varlık oluşturmak, bu varlığı yayımlamak ve ardından içerik API'sinden verilerini alabilmek isterim."

E2E test paketimiz, ürünün ana iş akışlarını _en düşük düzeyde_ kapsamalıdır ve bu, QA tarafından tanımlanan bir sete dayanır. Emin değilseniz QA ekibinizle danışın.
````