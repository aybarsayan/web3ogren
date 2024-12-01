---
title: "Modüller ve Bağımlılıklar"
description: Deno, ECMAScript modüllerini kullanarak modern JavaScript standartlarına uyum sağlar. Bu kılavuz, Deno'da modüllerin nasıl içe aktarılacağı, yönetileceği ve yayımlanacağı hakkında kapsamlı bilgiler sunar.
keywords: [Deno, ECMAScript modülleri, modül yönetimi, bağımlılık yönetimi, yazılım geliştirme]
oldUrl:
  - /runtime/manual/basics/modules/
  - /runtime/manual/basics/modules/integrity_checking/
  - /runtime/manual/basics/modules/module_metadata/
  - /runtime/manual/basics/modules/publishing_modules/
  - /runtime/manual/basics/modules/reloading_modules/
  - /runtime/manual/basics/vendoring/
  - /runtime/manual/advanced/http_imports/
  - /runtime/manual/advanced/publishing/dnt/
  - /runtime/manual/advanced/publishing/
  - /runtime/manual/examples/manage_dependencies
  - /runtime/manual/node/cdns.md
  - /runtime/manual/linking_to_external_code
  - /runtime/manual/linking_to_external_code/reloading_modules
  - /runtime/fundamentals/esm.sh
  - /runtime/manual/basics/import_maps/
  - /runtime/manual/advanced/private_repositories/
  - /runtime/reference/private_repositories/
---

Deno, modern JavaScript standartlarına uyum sağlamak ve daha etkin ve tutarlı bir geliştirme deneyimini teşvik etmek için varsayılan modül sistemi olarak
[ECMAScript modüllerini](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) kullanmaktadır. Bu, JavaScript modülleri için resmi standarttır, daha iyi ağaç sarsma (tree-shaking), iyileştirilmiş araç entegrasyonu ve farklı ortamlar arasında yerel destek sağlar.

:::info
Deno'nun ECMAScript modüllerini benimsemesi, sürekli gelişen JavaScript ekosistemi ile uyumluluğunu garanti eder.
:::

Geliştiriciler için bu, karmaşık eski modül formatları (CommonJS gibi) ile ilişkili karmaşıklıklardan kaçınarak akıcı ve öngörülebilir bir modül sistemi anlamına gelir.

## Modül İçe Aktarma

Bu örnek, `add` fonksiyonunu yerel bir `calc.ts` modülünden içe aktarmaktadır.

```ts title="calc.ts"
export function add(a: number, b: number): number {
  return a + b;
}
```

```ts title="main.ts"
// Bu dosyanın yanındaki `calc.ts` modülünü içe aktarır
import { add } from "./calc.ts";

console.log(add(1, 2)); // 3
```

Bu örneği `main.ts` ve `calc.ts` dosyalarının bulunduğu dizinde `deno run main.ts` çağrısı yaparak çalıştırabilirsiniz.

:::warning
ECMAScript modülleri ile yerel içe aktarma belirleyicileri her zaman tam dosya uzantısını içermelidir. Atlanamaz.
:::

```ts title="example.ts"
// YANLIŞ: dosya uzantısı atlanmış
import { add } from "./calc";

// DOĞRU: dosya uzantısını içerir
import { add } from "./calc.ts";
```

## Üçüncü Taraf Modülleri ve Kütüphaneleri İçe Aktarma

Deno'da üçüncü taraf modülleri ile çalışırken, yerel kod için kullandığınız aynı `import` sözdizimini kullanın. Üçüncü taraf modülleri genellikle uzak bir registriden içe aktarılır ve `jsr:`, `npm:` veya `https://` ile başlar.

```ts title="main.ts"
import { camelCase } from "jsr:@luca/cases@1.0.0";
import { say } from "npm:cowsay@1.6.0";
import { pascalCase } from "https://deno.land/x/case/mod.ts";
```

Deno, üçüncü taraf modülleri için modern JavaScript registrisi olan [JSR](https://jsr.io)'yi önermektedir. Burada projeleriniz için iyi belgelenmiş birçok ES modülü bulacaksınız, bunlar arasında
`Deno Standart Kütüphanesi` bulunmaktadır.

Daha fazla bilgi için
`Deno'nun npm paketlerini desteklemesi hakkında burada okuyabilirsiniz`.

## Üçüncü Taraf Modülleri ve Kütüphanelerinin Yönetimi

Modül adını tam sürüm belirleyicisiyle yazmak, birden fazla dosyada bunları içe aktarırken zahmetli hale gelebilir. Uzak modüllerin yönetimini `deno.json` dosyanızda `imports` alanı ile merkezileştirebilirsiniz. Bu `imports` alanına **import haritası** diyoruz ve bu, 
[Import Maps Standardı](https://github.com/WICG/import-maps)'na dayanmaktadır.

```json title="deno.json"
{
  "imports": {
    "@luca/cases": "jsr:@luca/cases@^1.0.0",
    "cowsay": "npm:cowsay@^1.6.0",
    "cases": "https://deno.land/x/case/mod.ts"
  }
}
```

Yeniden haritalanmış belirleyiciler ile kod daha temiz görünür:

```ts title="main.ts"
import { camelCase } from "@luca/cases";
import { say } from "cowsay";
import { pascalCase } from "cases";
```

Yeniden haritalanan isim, geçerli bir belirleyici olabilir. Deno'da her şeyi yeniden haritalamak için çok güçlü bir özelliktir. Import haritasının ne yapabileceği hakkında daha fazla bilgi edinmek için 
`buradan` okuyabilirsiniz.

## `deno add` ile Bağımlılık Ekleme

Kurulum süreci `deno add` alt komutu ile kolaylaştırılmıştır. İstediğiniz paketin en son sürümünü `deno.json` dosyasındaki `imports` bölümüne otomatik olarak ekleyecektir.

```sh
# deno.json dosyasına modülün en son sürümünü ekle
$ deno add jsr:@luca/cases
Add @luca/cases - jsr:@luca/cases@1.0.0
```

```json title="deno.json"
{
  "imports": {
    "@luca/cases": "jsr:@luca/cases@^1.0.0"
  }
}
```

Ayrıca, belirli bir sürüm de belirtebilirsiniz:

```sh
# Belirli bir sürüm belirtme
$ deno add jsr:@luca/cases@1.0.0
Add @luca/cases - jsr:@luca/cases@1.0.0
```

Daha fazla bilgi için `deno add` referansına` bakabilirsiniz.

Ayrıca `deno remove` ile bağımlılıkları kaldırabilirsiniz:

```sh
$ deno remove @luca/cases
Remove @luca/cases
```

```json title="deno.json"
{
  "imports": {}
}
```

Daha fazla bilgi için `deno remove` referansına` bakabilirsiniz.

## Paket Sürümleri

İçeri aktardığınız paket için bir sürüm aralığını belirtmek mümkündür. Bu işlem `@` sembolü ile başlar ve ardından bir sürüm aralığı belirleyicisi gelir; bu, [semver](https://semver.org/) sürümleme düzenine uyar.

Örneğin:

```bash
@scopename/mypackage           # en yüksek sürüm
@scopename/mypackage@16.1.0    # kesin sürüm
@scopename/mypackage@16        # 16.x sürümünden yüksek >= 16.0.0
@scopename/mypackage@^16.1.0   # 16.x sürümünden yüksek >= 16.1.0
@scopename/mypackage@~16.1.0   # 16.1.x sürümünden yüksek >= 16.1.0
```

:::note
Bir sürümü veya aralığı belirtmenin tüm yollarının bir özeti:
:::

| Sembol    | Açıklama                                                                                                                                                         | Örnek    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `1.2.3`   | Kesin bir sürüm. Sadece bu spesifik sürüm kullanılacaktır.                                                                                                          | `1.2.3`  |
| `^1.2.3`  | Sürüm 1.2.3 ile uyumlu. Soldaki en yüksek sıfır olmayan rakamı değiştirmeyen güncellemelerine izin verir. Örneğin, `1.2.4` ve `1.3.0` izinlidir, ancak `2.0.0` değildir. | `^1.2.3` |
| `~1.2.3`  | Sürüm 1.2.3'e yaklaşık eşdeğer. Yamanın sürümüne güncelleme yapılmasına izin verir.  Örneğin, `1.2.4` izinlidir, ancak `1.3.0` değildir.                           | `~1.2.3` |
| `>=1.2.3` | Sürüm 1.2.3 ve üzeri. Herhangi bir `1.2.3` veya daha yüksek sürüm izinlidir.                                                                                       | `>=1.2.3`|
| `1.2.3`  | Sürüm 1.2.3'ten yüksek. Sadece `1.2.3`'ten yüksek olan sürümler izinlidir.                                                                                          | `>1.2.3` |
| ` Geliştirici ayarları -> Kişisel erişim tokenları_ alanına gidin:

![Personal access tokens settings on GitHub](../../../images/cikti/denoland/runtime/fundamentals/images/private-pat.png)

Sonra _Yeni token oluştur_ seçeneğini seçin ve tokenınıza açıklama verin ve `repo` kapsamına uygun erişim tanıyın. `repo` kapsamı, dosya içeriklerini okumayı etkinleştirecektir (daha fazla bilgi için
[GitHub belgelerindeki kapsamlar](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes) bölümüne bakabilirsiniz):

![Creating a new personal access token on GitHub](../../../images/cikti/denoland/runtime/fundamentals/images/private-github-new-token.png)

Ve oluşturulduktan sonra, GitHub yeni token'ı yalnızca bir kez görüntüleyecek ve bu değeri çevresel değişkeninizde kullanmak isteyeceksiniz:

![Display of newly created token on GitHub](../../../images/cikti/denoland/runtime/fundamentals/images/private-github-token-display.png)

GitHub'daki bir özel depoda bulunan modüllere erişmek için, oluşturulan tokenı `DENO_AUTH_TOKENS` çevresel değişkeninde `raw.githubusercontent.com` ana bilgisayar adına yönelik kullanmak isteyeceksiniz. Örneğin:

```sh
DENO_AUTH_TOKENS=a1b2c3d4e5f6@raw.githubusercontent.com
```

Bu, tokenın çıkarıldığı kullanıcıya ait modüllere Deno'nun erişime olanak tanımalıdır.

Token yanlış olduğunda veya kullanıcının modüle erişimi yoksa, GitHub `404 Not Found` durumu dönecektir ve bir yetkisiz durumu döndürmeyecektir. Bu nedenle, komut satırında erişmeye çalıştığınız modüllerin bulunmadığına dair hatalar alıyorsanız, çevresel değişken ayarlarını ve kişisel erişim tokenı ayarlarını kontrol edin.

Ayrıca, `deno run -L debug` komutu, çevresel değişkenlerden ayrıştırılan token sayısı hakkında bir hata mesajı yazdırmalıdır. Tokenların hatalı olduğunu düşünüyorsa bir hata mesajı basar ama güvenlik nedeniyle tokenlar hakkında herhangi bir ayrıntı yazdırmaz.