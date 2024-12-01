---
title: "deno.json ve package.json"
description: Deno'yu yapılandırmak için kullanılan önemli dosyalar olan deno.json ve package.json hakkında bilgi. Bu içerik, kullanılan yapılandırma seçeneklerini ve hangi durumlarda bu dosyaların kullanılacağını açıklamaktadır.
keywords: [Deno, deno.json, package.json, yapılandırma, TypeScript]
---

Deno'yu `deno.json` dosyasıyla yapılandırabilirsiniz. Bu dosya, TypeScript derleyicisini, linter'ı, formatlayıcıyı ve diğer Deno araçlarını yapılandırmak için kullanılabilir.

Yapılandırma dosyası `.json` ve
[`.jsonc`](https://code.visualstudio.com/docs/languages/json#_json-with-comments)
uzantılarını destekler.

:::info
Deno, mevcut çalışma dizininizde veya üst dizinlerde `deno.json` veya `deno.jsonc` yapılandırma dosyasını otomatik olarak algılayacaktır. `--config` bayrağı farklı bir yapılandırma dosyasını belirtmek için kullanılabilir.
:::

## package.json desteği

Deno ayrıca Node.js projeleriyle uyumluluk için bir `package.json` dosyasını destekler. Eğer bir Node.js projeniz varsa, bir `deno.json` dosyası oluşturmanız gerekmez. Deno, projeyi yapılandırmak için `package.json` dosyasını kullanacaktır.

Eğer aynı dizinde hem `deno.json` hem de `package.json` dosyası mevcutsa, Deno, her iki dosyada belirtilen bağımlılıkları anlayacak ve Deno'ya özel yapılandırmalar için `deno.json` dosyasını kullanacaktır. Daha fazla bilgi için
`Deno'da Node uyumluluğunu` okuyun.

---

## Bağımlılıklar

`deno.json` dosyanızdaki `"imports"` alanı, projenizde kullanılan bağımlılıkları belirtmenizi sağlar. Bunu, çıplak belirleyicileri URL'lere veya dosya yollarına haritalamak için kullanabilirsiniz ve bu, bağımlılık yönetimini ve modül çözümlemeyi uygulamalarınızda daha kolay hale getirir.

> **Önemli:** Örneğin, projenizde standart kütüphaneden `assert` modülünü kullanmak istiyorsanız, bu import haritasını kullanabilirsiniz:

```json title="deno.json"
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.0",
    "chalk": "npm:chalk@5"
  }
}
```

Sonra script'iniz çıplak belirleyici `std/assert`'ı kullanabilir:

```js title="script.ts"
import { assertEquals } from "@std/assert";
import chalk from "chalk";

assertEquals(1, 2);
console.log(chalk.yellow("Merhaba dünya"));
```

Ayrıca `package.json` içerisinde bir `"dependencies"` alanı da kullanabilirsiniz:

```json title="package.json"
{
  "dependencies": {
    "express": "express@^1.0.0"
  }
}
```

```js title="script.ts"
import express from "express";

const app = express();
```

Unutmayın ki bu, `deno install` çalıştırmanızı gerektirecektir.

Daha fazla bilgi için `modül imports ve bağımlılıklar` okuyun.

---

### Özel yol haritaları

`deno.json` içindeki import haritası, belirleyicilerin daha genel yol haritalarını kullanmak için kullanılabilir. Tam belirleyicileri üçüncü taraf bir modüle veya doğrudan bir dosyaya haritalayabilir veya bir import belirleyicisinin bir kısmını bir dizine haritalayabilirsiniz.

```jsonc title="deno.jsonc"
{
  "imports": {
    // Tam bir dosyaya haritalama
    "foo": "./some/long/path/foo.ts",
    // Bir dizine haritalama, kullanım: "bar/file.ts"
    "bar/": "./some/folder/bar/"
  }
}
```

Kullanım:

```ts
import * as foo from "foo";
import * as bar from "bar/file.ts";
```

Import belirleyicilerinin yol haritaları, daha büyük kod tabanlarında kısalık için yaygın olarak kullanılır.

Proje kökünü mutlak imports için kullanmak isterseniz:

```json title="deno.json"
{
  "imports": {
    "/": "./",
    "./": "./"
  }
}
```

```ts title="main.ts"
import { MyUtil } from "/util.ts";
```

Bu, `/` ile başlayan import belirleyicilerinin import haritasının URL'sine veya dosya yoluna göre çözülmesine neden olur.

---

## Görevler

`deno.json` dosyanızdaki `tasks` alanı, `deno task` komutuyla çalıştırılabilen özel komutları tanımlamak için kullanılır ve projelerinizin belirli ihtiyaçlarına göre komutları ve izinleri özelleştirmenizi sağlar.

:::tip
Bu, ayrıca `package.json` dosyasında da bulunan `scripts` alanına benzer.
:::

```json title="deno.json"
{
  "tasks": {
    "start": "deno run --allow-net --watch=static/,routes/,data/ dev.ts",
    "test": "deno test --allow-net",
    "lint": "deno lint"
  }
}
```

```json title="package.json"
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build"
  }
}
```

Bir görevi çalıştırmak için, `deno task` komutunu görev adıyla birlikte kullanın. Örneğin:

```sh
deno task start
deno task test
deno task lint
deno task dev
deno task build
```

Daha fazla bilgi için `deno task` okuyun.

---

## Lintleme

`deno.json` dosyasındaki `lint` alanı, Deno'nun yerleşik linter'ının davranışını yapılandırmak için kullanılır. Bu, hangi dosyaların lint işlemine dahil edileceğini veya hariç tutulacağını belirtmenizi ve projenizin ihtiyaçlarına uygun lint kurallarını özelleştirmenizi sağlar.

Örneğin:

```json title="deno.json"
{
  "lint": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"],
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  }
}
```

Bu yapılandırma:

- yalnızca `src/` dizinindeki dosyaları lintler,
- `src/testdata/` dizinindeki dosyaları veya `src/fixtures/` dizinindeki herhangi bir TypeScript dosyasını lintlemez.
- tavsiye edilen lint kurallarının uygulanmasını belirtir,
- `ban-untagged-todo` kuralını ekler,
- `no-unused-vars` kuralını hariç tutar.

Mevcut lintleme kurallarının tam listesini [Deno lint belgesinde](https://lint.deno.land/) bulabilirsiniz.

Daha fazla bilgi için `Deno ile lintleme` okuyun.

---

## Biçimlendirme

`deno.json` dosyasındaki `fmt` alanı, Deno'nun yerleşik kod formatlayıcısının davranışını yapılandırmak için kullanılır. Bu, kodunuzun nasıl formatlanacağını özelleştirmenizi sağlayarak projeniz boyunca tutarlılığı artırır ve okunabilirliği kolaylaştırır. İşte yapılandırabileceğiniz anahtar seçenekler:

```json title="deno.json"
{
  "fmt": {
    "useTabs": true,
    "lineWidth": 80,
    "indentWidth": 4,
    "semiColons": true,
    "singleQuote": true,
    "proseWrap": "preserve",
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"]
  }
}
```

Bu yapılandırma:

- girinti için boşluk yerine sekmeleri kullanır,
- satırları 80 karakterle sınırlar,
- 4 boşluk uzunluğunda bir girinti genişliği kullanır,
- ifadelerin sonuna noktalı virgül ekler,
- stringler için tek tırnak kullanır,
- yazılı metin sarmalamayı korur,
- `src/` dizinindeki dosyaları formatlar,
- `src/testdata/` dizinindeki dosyaları ve `src/fixtures/` dizinindeki herhangi bir TypeScript dosyasını dışlar.

Daha fazla bilgi için `Deno ile kodunuzu biçimlendirme` okuyun.

---

## Kilit Dosyası

`deno.json` dosyasındaki `lock` alanı, Deno'nun
`bağımlılıklarınızın bütünlüğünü sağlamak için kullandığı kilit dosyasının yapılandırmasını` belirtmek için kullanılır. Bir kilit dosyası, projenizin bağımlı olduğu modüllerin kesin sürümlerini ve bütünlük hash'lerini kaydeder, böylece projenizi her çalıştırdığınızda aynı sürümlerin kullanıldığından emin olursunuz, bağımlılıklar güncellense veya uzaktan değiştirilebilse bile.

```json title="deno.json"
{
  "lock": {
    "path": "./deno.lock",
    "frozen": true
  }
}
```

Bu yapılandırma:

- kilit dosyasının yerini `./deno.lock` olarak belirtir (bu varsayılandır ve dışarıda bırakılabilir)
- herhangi bir bağımlılık değişirse hata almak istediğini Deno'ya söyler

Deno varsayılan olarak kilit dosyasını kullanır, bunu aşağıdaki yapılandırma ile devre dışı bırakabilirsiniz:

```json title="deno.json"
{
  "lock": false
}
```

---

## Node modülleri dizini

Varsayılan olarak Deno, proje dizininizde bir `package.json` dosyası varsa yerel bir `node_modules` dizini kullanır.

Bu davranışı `deno.json` dosyasındaki `nodeModulesDir` alanını kullanarak kontrol edebilirsiniz.

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

Bu alanı aşağıdaki değerlere ayarlayabilirsiniz:

| Değer      | Davranış                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `"none"`   | Yerel `node_modules` dizinini kullanmayın. Bunun yerine Deno tarafından otomatik olarak güncellenen global önbelleği kullanın.      |
| `"auto"`   | Yerel bir `node_modules` dizini kullanın. Dizin otomatik olarak oluşturulur ve Deno tarafından güncel tutulur.                       |
| `"manual"` | Yerel bir `node_modules` dizini kullanın. Kullanıcı bu dizini manuel olarak güncel tutmalıdır, örn. `deno install` veya `npm install` kullanarak. |

Bu ayarı belirtmek zorunlu değildir; aşağıdaki varsayılanlar uygulanır:

- Proje dizininizde bir `package.json` dosyası yoksa `"none"`
- Proje dizininizde bir `package.json` dosyası varsa `"manual"`

Çalışma alanlarını kullanırken, bu ayar yalnızca çalışma alanı kökünde kullanılabilir. Üye dizinlerinden birinde belirtmek uyarılara yol açacaktır. `manual` ayarı yalnızca çalışma alanı kökünde bir `package.json` dosyası varsa otomatik olarak uygulanacaktır.

---

## TypeScript derleyici seçenekleri

`deno.json` dosyasındaki `compilerOptions` alanı, Deno projeniz için
[TypeScript derleyici ayarlarını](https://www.typescriptlang.org/tsconfig) yapılandırmak için kullanılır. Bu, TypeScript kodunuzun nasıl derleneceğini özelleştirmenizi sağlar, böylece projenizin gereksinimleri ve kod standartlarıyla uyumlu hale gelir.

:::info
Deno, varsayılan TypeScript yapılandırmasını önerir. Bu, kod paylaşımında yardımcı olacaktır.
:::

Ayrıca `Deno'da TypeScript yapılandırma` okuyun.

---

## Kararsız özellikler

`deno.json` dosyasındaki `unstable` alanı, Deno projeniz için belirli kararsız özellikleri etkinleştirmek için kullanılır.

Bu özellikler hâlâ geliştirme aşamasındadır ve henüz kararlı API'nin bir parçası değildir. `unstable` dizisinde özellikler listeleyerek, bunları deneme ve resmi olarak yayınlanmadan önce kullanma imkânına sahip olursunuz.

```json title="deno.json"
{
  "unstable": ["cron", "kv", "webgpu"]
}
```

`Daha fazla bilgi edinin`.

---

## dahil et ve hariç tut

Birçok yapılandırma (örn. `lint`, `fmt`) dahil etmek için bir `include` ve hariç tutmak için `exclude` özelliğine sahiptir.

### dahil et

Burada belirtilen yollar veya kalıplar yalnızca dahil edilecektir.

```jsonc
{
  "lint": {
    // yalnızca src/ dizinini formatla
    "include": ["src/"]
  }
}
```

### hariç tut

Burada belirtilen yollar veya kalıplar hariç tutulacaktır.

```jsonc
{
  "lint": {
    // dist/ klasörünü lintleme
    "exclude": ["dist/"]
  }
}
```

Bu, `include`'dan daha YÜKSEK önceliğe sahiptir ve bir yol hem `include` hem `exclude` ile eşleşirse `include`'ı geçersiz kılacaktır.

Bir dizini hariç tutmak ama bir alt dizini dahil etmek isteyebilirsiniz. Deno 1.41.2+'de, genel hariç tutmanın altına daha spesifik bir yolu belirterek hariç tutulan bir yolu tekrar dahil edebilirsiniz:

```jsonc
{
  "fmt": {
    // "fixtures" dizinini hariç tut,
    // ancak "fixtures/scripts" dizinini formatla
    "exclude": [
      "fixtures",
      "!fixtures/scripts"
    ]
  }
}
```

---

### Üst seviye hariç tut

Asla Deno'nun fmt, lint, tip kontrolü, LSP'deki analizi vb. yapmak istemediğiniz bir dizin varsa, bunu üst seviye hariç tutma dizisine belirtin:

```jsonc
{
  "exclude": [
    // tüm alt komutlardan ve LSP'den dist klasörünü hariç tut
    "dist/"
  ]
}
```

Bazen, üst seviye hariç tutmada hariç tutulan bir yol veya kalıbı dahil etmek isteyebilirsiniz. Deno 1.41.2+'de, daha spesifik bir yapılandırmada, hariç tutulan bir yolu hariç tutmak için bir olumsuz glob belirtebilirsiniz:

```jsonc
{
  "fmt": {
    "exclude": [
      // dist klasörünü bile olsa formatla
      "!dist"
    ]
  },
  "exclude": [
    "dist/"
  ]
}
```

---

### Yayınla - .gitignore'ı geçersiz kıl

`.gitignore`, `deno publish` komutu için dikkate alınır. Deno 1.41.2+'de, _.gitignore_'da dışlanan dosyalardan çıkmak için olumsuz bir hariç glob kullanabilirsiniz:

```title=".gitignore"
dist/
.env
```

```jsonc title="deno.json"
{
  "publish": {
    "exclude": [
      // .gitignored dist klasörünü dahil et
      "!dist/"
    ]
  }
}
```

Alternatif olarak, `"include"` altında gitignore edilen yolları açıkça belirtmek de işe yarar:

```json
{
  "publish": {
    "include": [
      "dist/",
      "README.md",
      "deno.json"
    ]
  }
}
```

---

## Tam örnek

```json
{
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  },
  "lint": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"],
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  },
  "fmt": {
    "useTabs": true,
    "lineWidth": 80,
    "indentWidth": 4,
    "semiColons": false,
    "singleQuote": true,
    "proseWrap": "preserve",
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"]
  },
  "lock": false,
  "nodeModulesDir": "auto",
  "unstable": ["webgpu"],
  "test": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"]
  },
  "tasks": {
    "start": "deno run --allow-read main.ts"
  },
  "imports": {
    "oak": "jsr:@oak/oak"
  },
  "exclude": [
    "dist/"
  ]
}
```

---

## JSON şeması

Bir JSON şeması dosyası, editörlerin otomatik tamamlama sağlaması için mevcuttur. Dosya sürümlüdür ve şu adreste mevcuttur:
https://deno.land/x/deno/cli/schemas/config-file.v1.json

---

## Proxiler

Deno, modül indirmeleri ve fetch API'si için proxy'leri destekler. Proxy yapılandırması, 
[ortam değişkenlerinden](https://docs.deno.com/runtime/reference/env_variables/#special-environment-variables): HTTP_PROXY, HTTPS_PROXY ve NO_PROXY okunur.

Windows kullanıyorsanız - ortam değişkenleri bulunamazsa Deno, proxy'leri kayıt defterinden okumayı tercih eder.