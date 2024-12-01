---
description: Bu içerik, Vue CLI projelerinde modlar ve ortam değişkenlerinin nasıl kullanıldığını kapsar. Modların belirlenmesi ve `NODE_ENV` değişkeninin etkileri üzerine bilgiler sunar.
keywords: [Vue CLI, modlar, ortam değişkenleri, NODE_ENV, geliştirme, üretim, test]
---

# Modlar ve Ortam Değişkenleri

## Modlar

**Mod**, Vue CLI projelerinde önemli bir kavramdır. Varsayılan olarak üç mod vardır:

- `development`, `vue-cli-service serve` tarafından kullanılır
- `test`, `vue-cli-service test:unit` tarafından kullanılır
- `production`, `vue-cli-service build` ve `vue-cli-service test:e2e` tarafından kullanılır

Bir komut için varsayılan modun üzerine yazmak için `--mode` seçenek bayrağını geçebilirsiniz. Örneğin, build komutunda geliştirme değişkenlerini kullanmak istiyorsanız:

```
vue-cli-service build --mode development
```

`vue-cli-service` çalıştırılırken, ortam değişkenleri tüm `ilişkin dosyalardan` yüklenir. Eğer `NODE_ENV` değişkenini içermezlerse, bu durumda uygun şekilde ayarlanır. 

> Örneğin, `NODE_ENV` üretim modunda `"production"`, test modunda `"test"` ve diğer durumlarda varsayılan olarak `"development"` olarak ayarlanacaktır. — Vue CLI Dokümantasyonu

Sonrasında `NODE_ENV`, uygulamanızın hangi ana modda çalıştığını belirleyecektir - geliştirme, üretim veya test - ve sonuç olarak hangi tür webpack yapılandırmasının oluşturulacağını belirler.

Örneğin, `NODE_ENV` "test" olarak ayarlandığında, Vue CLI, birim testlere yönelik kullanılmak ve optimize edilmek için tasarlanmış bir webpack yapılandırması oluşturur. 

Benzer şekilde, `NODE_ENV=development`, hızlı yeniden oluşturmalara olanak tanımak için HMR'yi etkinleştiren ve varlıkları hash'lemeyen veya tedarikçi paketleri oluşturmayan bir webpack yapılandırması oluşturur.

`vue-cli-service build` çalıştırdığınızda, `NODE_ENV` her zaman "production" olarak ayarlanmalıdır, böylece dağıtıma hazır bir uygulama elde edilir, dağıtım yaptığınız ortamdan bağımsız olarak.

::: warning NODE_ENV
Ortamınızda varsayılan bir `NODE_ENV` varsa, bunu kaldırmalı veya `vue-cli-service` komutlarını çalıştırırken açıkça `NODE_ENV` ayarlamalısınız.
:::

## Ortam Değişkenleri

Ortam değişkenlerini proje kökünüze aşağıdaki dosyaları yerleştirerek belirtebilirsiniz:

```bash
.env                # her durumda yüklenir
.env.local          # her durumda yüklenir, git tarafından göz ardı edilir
.env.[mode]         # yalnızca belirtilen modda yüklenir
.env.[mode].local   # yalnızca belirtilen modda yüklenir, git tarafından göz ardı edilir
```

Bir env dosyası, ortam değişkenlerinin anahtar=değer çiftlerini içerir:

```
FOO=bar
VUE_APP_NOT_SECRET_CODE=some_value
```

::: warning
Uygulamanızda herhangi bir gizli bilgi (örneğin özel API anahtarları) saklamayın!

Ortam değişkenleri, yapı içine gömülmüştür; bu, herkesin uygulamanızın dosyalarını inceleyerek bunları görebileceği anlamına gelir.
:::

Sadece `NODE_ENV`, `BASE_URL` ve `VUE_APP_` ile başlayan değişkenlerin, `webpack.DefinePlugin` ile *istemci paketi* içine statik olarak gömüleceğini unutmayın. Bu, aynı isimde olabilecek özel bir anahtarın makinelerde kazara açığa çıkmasını önlemek içindir.

Daha ayrıntılı env ayrıştırma kuralları için lütfen [dotenv belgelerine](https://github.com/motdotla/dotenv#rules) başvurun. Ayrıca, değişken genişletme için [dotenv-expand](https://github.com/motdotla/dotenv-expand) kullanıyoruz (Vue CLI 3.5+ sürümünde mevcuttur). Örneğin:

```bash
FOO=foo
BAR=bar

CONCAT=$FOO$BAR # CONCAT=foobar
```

Yüklenmiş değişkenler, tüm `vue-cli-service` komutlarına, eklentilere ve bağımlılıklara sunulacaktır.

::: tip Env Yükleme Öncelikleri
Belirli bir mod için bir env dosyası (örneğin, `.env.production`), genel bir dosyadan (örneğin, `.env`) daha yüksek önceliğe sahiptir.

Ayrıca, Vue CLI çalıştırıldığında zaten mevcut olan ortam değişkenleri en yüksek önceliğe sahip olacaktır ve `.env` dosyaları ile üst üste binmeyecektir.

`.env` dosyaları, `vue-cli-service` başlangıcında yüklenir. Değişiklik yaptıktan sonra hizmeti yeniden başlatın.
:::

### Örnek: Staging Modu

Aşağıdaki `.env` dosyasına sahip bir uygulamamız olduğunu varsayalım:

```
VUE_APP_TITLE=My App
```

Ve aşağıdaki `.env.staging` dosyasına:

```
NODE_ENV=production
VUE_APP_TITLE=My Staging App
```

- `vue-cli-service build`, `.env`, `.env.production` ve varsa `.env.production.local` dosyalarını yükleyerek üretim uygulamasını derler;

- `vue-cli-service build --mode staging`, .env`, `.env.staging` ve varsa `.env.staging.local` dosyalarını kullanarak, staging modunda bir üretim uygulaması derler.

Her iki durumda da, `NODE_ENV` nedeniyle uygulama üretim uygulaması olarak derlenir, ancak staging sürümünde, `process.env.VUE_APP_TITLE` farklı bir değer ile üzerine yazılır.

### İstemci Tarafı Kodunda Env Değişkenlerini Kullanma

Uygulama kodunuzda env değişkenlerine erişebilirsiniz:

``` js
console.log(process.env.VUE_APP_NOT_SECRET_CODE)
```

Derleme sırasında, `process.env.VUE_APP_NOT_SECRET_CODE` karşılık gelen değer ile değiştirilir. `VUE_APP_NOT_SECRET_CODE=some_value` durumunda, `"some_value"` ile değiştirilir.

`VUE_APP_*` değişkenlerine ek olarak, her zaman uygulama kodunuzda bulunacak iki özel değişken vardır:

- `NODE_ENV` - bu, uygulamanın çalıştığı `moda` bağlı olarak `"development"`, `"production"` veya `"test"` değerlerinden biri olacaktır.
- `BASE_URL` - bu, `vue.config.js` dosyasındaki `publicPath` seçeneği ile bağlantılıdır ve uygulamanızın dağıtıldığı temel yoldur.

Çözümleme yapılan tüm env değişkenleri, `HTML - Araya Girme` bölümünde tartışıldığı gibi `public/index.html` içinde kullanılabilir olacaktır.

::: tip
`vue.config.js` dosyanızda hesaplanmış env değişkenlerine sahip olabilirsiniz. Yine de `VUE_APP_` ile ön eklenmeleri gerekir. Bu, sürüm bilgileri için kullanışlıdır.

```js
process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  // config
}
```
:::

### Sadece Yerel Değişkenler

Bazen kod tabanına dahil edilmemesi gereken env değişkenlerine sahip olabilirsiniz, özellikle projeniz genel bir depoda barındırılıyorsa. Bu durumda, bunun yerine bir `.env.local` dosyası kullanmalısınız. Yerel env dosyaları varsayılan olarak `.gitignore` dosyasında göz ardı edilir.

`.local`, mod spesifik env dosyalarına da eklenebilir, örneğin `.env.development.local` geliştirme sırasında yüklenir ve git tarafından göz ardı edilir.