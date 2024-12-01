---
title: "Çalışma Alanları ve Monorepos"
description: Deno, birden fazla ilgili ve bağımlı paketi yöneten monorepos olarak bilinen çalışma alanlarını destekler. Bu belge, çalışma alanları ile ilgili yapılandırma ve kullanım detaylarını içermektedir.
keywords: [Deno, monorepo, çalışma alanları, deno.json, npm]
---

Deno, birden fazla ilgili ve bağımlı paketi aynı anda yönetmenizi sağlayan "monorepos" olarak da bilinen çalışma alanlarını destekler.

Bir "çalışma alanı", `deno.json` veya `package.json` yapılandırma dosyalarını içeren klasörlerin bir topluluğudur. Kök `deno.json` dosyası çalışma alanını tanımlar:

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"]
}
```

Bu, `add` ve `subtract` üyeleriyle bir çalışma alanı yapılandırmasını sağlar; bu üyelerin `deno.json(c)` ve/veya `package.json` dosyalarına sahip olması beklenir.

:::info
**İsimlendirme:** Deno, çoklu üye ile tekil bir çalışma alanını temsil etmek için npm'in `workspaces` yerine `workspace` terimini kullanır.
:::

## Örnek

`deno.json` çalışma alanı örneğini genişletelim ve işlevselliğine bakalım. Dosya hiyerarşisi şöyle görünmektedir:

```sh
/
├── deno.json
├── main.ts
├── add/
│     ├── deno.json
│     └── mod.ts
└── subtract/
      ├── deno.json
      └── mod.ts
```

İki çalışma alanı üyesi (add ve subtract) vardır; her birinin `mod.ts` dosyası bulunmaktadır. Ayrıca kök `deno.json` ve bir `main.ts` dosyası da bulunmaktadır.

En üst düzey `deno.json` yapılandırma dosyası, çalışma alanını ve tüm üyelere uygulanacak en üst düzey bir import haritasını tanımlar:

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"],
  "imports": {
    "chalk": "npm:chalk@5"
  }
}
```

Kök `main.ts` dosyası, import haritasından `chalk` geçersiz belirleyicisini kullanır ve `add` ile `subtract` işlevlerini çalışma alanı üyelerinden içe aktarır. Bu işlevlerin, uygun URL'ler olmamasına ve import haritasında yer almamasına rağmen `@scope/add` ve `@scope/subtract` kullanılarak içe aktarıldığını unutmayın. Peki bunlar nasıl çözümlenir?

```ts title="main.ts"
import chalk from "chalk";
import { add } from "@scope/add";
import { subtract } from "@scope/subtract";

console.log("1 + 2 =", chalk.green(add(1, 2)));
console.log("2 - 4 =", chalk.red(subtract(2, 4)));
```

`add/` alt dizininde, çalışma alanı üyesine atıfta bulunmak için önemli bir `"name"` alanı içeren bir `deno.json` dosyası tanımlıyoruz. `deno.json` dosyası ayrıca `deno fmt` kullanırken noktalı virgüllerin kapatılması gibi örnek yapılandırmalar da içerir.

```json title="add/deno.json"
{
  "name": "@scope/add",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "fmt": {
    "semiColons": false
  }
}
```

```ts title="add/mod.ts"
export function add(a: number, b: number): number {
  return a + b;
}
```

`subtract/` alt dizini benzer şekilde olup aynı `deno fmt` yapılandırmasına sahip değildir.

```json title="subtract/deno.json"
{
  "name": "@scope/subtract",
  "version": "0.3.0",
  "exports": "./mod.ts"
}
```

```ts title="subtract/mod.ts"
import { add } from "@scope/add";

export function subtract(a: number, b: number): number {
  return add(a, b * -1);
}
```

Şimdi çalıştıralım:

```sh
> deno run main.ts
1 + 2 = 3
2 - 4 = -2
```

Burada Deno çalışma alanı özelliklerini sergileyen birçok şey var:

1. **Bu monorepo,** `./add` ve `./subtract` dizinlerine yerleştirilmiş iki paketten oluşuyor.
2. Üyelerin `deno.json` dosyalarındaki `name` ve `version` seçeneklerini kullanarak, tüm çalışma alanı genelinde "geçersiz belirleyiciler" kullanarak atıfta bulunmak mümkündür. Bu durumda, paketler `@scope/add` ve `@scope/subtract` olarak adlandırılmıştır; burada `scope`, seçebileceğiniz "scope" adıdır. Bu iki seçenek ile import ifadelerinde uzun ve göreli dosya yolları kullanmak zorunda kalmazsınız.
3. `npm:chalk@5` paketi, tüm çalışma alanında paylaşılan bir bağımlılıktır. Çalışma alanı üyeleri, çalışma alanının kök `imports`'ını "kaldırarak" tek bir bağımlılık sürümünü kod tabanı genelinde kolayca yönetmek için olanak tanır.
4. `add` alt dizini, `deno fmt`'in kodu biçimlendirirken noktalı virgül uygulamamasını belirten bir bilgi içerir. Bu, mevcut projeler için çok daha sorunsuz bir geçiş sağlar; yüzlerce dosyayı bir seferde değiştirmek gerekmiyor.

---

Deno çalışma alanları esnektir ve Node paketleri ile çalışabilir. Mevcut Node.js projeleri için geçişi kolaylaştırmak amacıyla, tek bir çalışma alanında hem Deno-first hem de Node-first paketlere sahip olabilirsiniz.

### `npm` çalışma alanlarından geçiş

Deno çalışma alanları, mevcut bir npm paketinden bir Deno-first paketi kullanmayı destekler. Bu örnekte, birkaç yıl önce geliştirdiğimiz `@deno/log` adlı bir Node.js kütüphanesi ile `@deno/hi` adlı bir Deno kütüphanesini bir araya getiriyoruz.

Kökte bir `deno.json` yapılandırma dosyası eklememiz gerekecek:

```json title="deno.json"
{
  "workspace": {
    "members": ["hi"]
  }
}
```

Mevcut `package.json` çalışma alanımızın yanına:

```json title="package.json"
{
  "workspaces": ["log"]
}
```

Çalışma alanında şu anda bir `log` npm paketi bulunmaktadır:

```json title="log/package.json"
{
  "name": "@deno/log",
  "version": "0.5.0",
  "type": "module",
  "main": "index.js"
}
```

```js title="log/index.js"
export function log(output) {
  console.log(output);
}
```

Şimdi, `@deno/log`'u içe aktaran bir `@deno/hi` Deno-first paketi oluşturalım:

```json title="hi/deno.json"
{
  "name": "@deno/hi",
  "version": "0.2.0",
  "exports": "./mod.ts",
  "imports": {
    "log": "npm:@deno/log@^0.5"
  }
}
```

```ts title="hi/mod.ts"
import { log } from "log";

export function sayHiTo(name: string) {
  log(`Merhaba, ${name}!`);
}
```

Artık `hi`'yi içe aktararak çağıran bir `main.ts` dosyası yazabiliriz:

```ts title="main.ts"
import { sayHiTo } from "@deno/hi";

sayHiTo("arkadaş");
```

```sh
$ deno run main.ts
Merhaba, arkadaş!
```

Mevcut Node.js paketlerinde hem `deno.json` hem de `package.json` dosyalarına sahip olabilirsiniz. Ayrıca, kökteki `package.json` dosyasını kaldırabilir ve npm paketini `deno.json` çalışma alanı üyeleri olarak belirtebilirsiniz. Bu, Deno'ya geçişi yavaşça yapmanıza olanak tanır ve önceden büyük bir çalışma yapmanıza gerek kalmaz.

Örneğin, Deno'nun linter ve formatter'ını ayarlamak için `log/deno.json` dosyasını ekleyebilirsiniz:

```jsonc
{
  "fmt": {
    "semiColons": false
  },
  "lint": {
    "rules": {
      "exclude": ["no-unused-vars"]
    }
  }
}
```

Çalışma alanında `deno fmt` çalıştırarak, `log` paketinin noktasız biçimlendirilmesini sağlayacak ve `deno lint`, kaynak dosyalardaki kullanılmayan bir değişken bıraktığınızda sorun çıkarmayacaktır.

---
description: Deno yapılandırma seçeneklerinin detayları hakkında bilgi veren bu sayfa, çalışma alanı kökünde ve üyelerde mevcut olan ayarları sunmaktadır. İşte Deno'nun yapılandırma dosyalarında bulunan çeşitli seçeneklerin kapsamlı bir incelemesi.
keywords: [Deno, yapılandırma, deno.json, çalışma alanı, seçenekler]
---

## Yerleşik Deno Araçlarını Yapılandırma

Bazı yapılandırma seçenekleri yalnızca çalışma alanının kökünde anlam kazanır. Örneğin, `nodeModuleDir` seçeneğini üyelere belirtmek mümkün değildir ve Deno, bir seçeneğin çalışma alanı kökünde uygulanması gerektiği konusunda uyarıda bulunur.

:::info
**Not:** Aşağıda, çalışma alanı kökünde ve üyelerinde mevcut farklı `deno.json` seçeneklerinin tam bir matrisi yer almaktadır.
:::

| Seçenek            | Çalışma Alanı | Paket  | Notlar                                                                                                                                                                                                                                                                                                  |
| ------------------ | ---------     | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| derleyiciSeçenekleri| ✅            | ❌      | "Şu anda her çalışma alanı için yalnızca bir set derleyiciSeçeneği'ne izin veriyoruz. Bu, birden fazla set için hem deno_graph hem de TSC entegrasyonunda değişiklikler gerektirdiği içindir." — Deno Geliştirici                                                                                                                                                                      |
| içeAktarmaHaritası | ✅            | ❌      | "İçe aktarma ve kapsam için yapılandırma dosyasına özel."                                                                                                                                                                                                                                                              |
| içeAktarımlar      | ✅            | ✅      | İçe aktarma haritasına özel.                                                                                                                                                                                                                                                              |
| kapsam             | ✅            | ❌      | İçe aktarma haritasına özel.                                                                                                                                                                                                                                                              |
| hariçTut          | ✅            | ✅      |                                                                                                                                                                                                                                                                                                        |
| lint.dahil         | ✅            | ✅      |                                                                                                                                                                                                                                                                                                        |
| lint.hariç        | ✅            | ✅      |                                                                                                                                                                                                                                                                                                        |
| lint.dosyaları     | ⚠️            | ❌      | "Kullanımdan kaldırıldı."                                                                                                                                                                                                                                                                                             |
| lint.kurallar.etiketleri| ✅        | ✅      | "Etiketler, paket çalışma alanı listesine eklenerek birleştirilir.” — Deno Geliştirici                                                                                                                                                                                                                        |
| lint.kurallar.dahil |           |         |                                                                                                                                                                                                                                                                                                        |
| lint.kurallar.hariç | ✅            | ✅      | "Kurallar, paket başına birleştirilir; paket çalışma alanına öncelik verir."                                                                                                                                                                        |
| lint.rapor         | ✅            | ❌      | "Aynı anda yalnızca bir raporlayıcı etkin olabilir, bu nedenle birden fazla paketi kapsayan dosyaları lint’lendiğinde çalışma alanı başına farklı raporlayıcıların izin verilmesi çalışmaz."                                                                                                                                   |
| fmt.dahil          | ✅            | ✅      |                                                                                                                                                                                                                                                                                                        |
| fmt.hariç         | ✅            | ✅      |                                                                                                                                                                                                                                                                                                        |
| fmt.dosyaları      | ⚠️            | ❌      | "Kullanımdan kaldırıldı."                                                                                                                                                                                                                                                                                             |
| fmt.tablolar       | ✅            | ✅      | "Paket, çalışma alanına önceliklidir."                                                                                                                                                                                                                                                                 |
| fmt.açıklıkGenişliği| ✅            | ✅      | "Paket, çalışma alanına önceliklidir."                                                                                                                                                                                                                                                                 |
| fmt.tekAlıntı      | ✅            | ✅      | "Paket, çalışma alanına önceliklidir."                                                                                                                                                                                                                                                                 |
| fmt.metinSarımı    | ✅            | ✅      | "Paket, çalışma alanına önceliklidir."                                                                                                                                                                                                                                                                 |
| fmt.noktalıVirgül  | ✅            | ✅      | "Paket, çalışma alanına önceliklidir."                                                                                                                                                                                                                                                                 |
| fmt.seçenekleri.*  | ⚠️            | ❌      | "Kullanımdan kaldırıldı."                                                                                                                                                                                                                                                                                             |
| nodeModüllerDizini | ✅            | ❌      | "Çözümleme davranışı çalışma alanının tamamında aynı olmalıdır."                                                                                                                                                                                                                                         |
| satıcı             | ✅            | ❌      | "Çözümleme davranışı çalışma alanının tamamında aynı olmalıdır."                                                                                                                                                                                                                                         |
| görevler           | ✅            | ✅      | "Paket görevleri, çalışma alanına önceliklidir."                                                                                                                                                                                        |

:::tip
**İpuçları:** "Yalnızca bir set yapılandırma seçeneği kullanmak, Deno uygulamanızın tutarlılığını artıracaktır."
:::

| test.dahil         | ✅            | ✅      |                                                                                                                                                                                                                                                                                                        |
| test.hariç        | ✅            | ✅      |                                                                                                                                                                                                                                                                                                        |
| test.dosyaları     | ⚠️            | ❌      | "Kullanımdan kaldırıldı."                                                                                                                                                                                                                                                                                             |
| yayımla.dahil      | ✅            | ✅      |                                                                                                                                                                                                                                                                                                        |
| yayımla.hariç     | ✅            | ✅      |                                                                                                                                                                                                                                                                                                        |
| bench.dahil        | ✅            | ✅      |                                                                                                                                                                                                                                                                                                        |
| bench.hariç       | ✅            | ✅      |                                                                                                                                                                                                                                                                                                        |
| bench.dosyaları     | ⚠️            | ❌      | "Kullanımdan kaldırıldı."                                                                                                                                                                                                                                                                                             |
| kilit              | ✅            | ❌      | "Her çözücü için yalnızca tek bir kilit dosyası bulunabilir."                                                                                                                                                                                                                                     |
| kararsız           | ✅            | ❌      | "Basitlik açısından, kararsız bayraklara izin vermiyoruz."                                                                                                                                                                                                                         |
| ad                 | ❌            | ✅      |                                                                                                                                                                                                                                                                                                        |
| versiyon           | ❌            | ✅      |                                                                                                                                                                                                                                                                                                        |
| dışaAktarma        | ❌            | ✅      |                                                                                                                                                                                                                                                                                                        |

| çalışma alanı      | ✅            | ❌      | "İç içe çalışma alanları desteklenmiyor."                                                                                                                                                                                                                                                                   |