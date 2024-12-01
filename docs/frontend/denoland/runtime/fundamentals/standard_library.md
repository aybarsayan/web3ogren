---
title: "Standart Kütüphane"
description: Deno, TypeScript ile yazılmış bir standart kütüphane sağlar. Bu kütüphane, uygulama mantığınıza odaklanmanızı sağlar ve yaygın görevlerde tekrar kullanım için standart modüller sunar.
keywords: [Deno, TypeScript, standart kütüphane, modüller, yazılım geliştirme]
---

Deno, TypeScript ile yazılmış bir standart kütüphane sağlar. Bu, tekrar kullanılabilir standart modüllerden oluşan bir settir ve uygulama mantığınıza odaklanmanızı sağlar; yaygın görevler için "tekerleği yeniden icat etmek" zorunda kalmazsınız. Deno Standart Kütüphanesindeki tüm modüller, çekirdek ekip tarafından denetlenmiştir ve Deno ile çalışması garanti edilmiştir; bu da tutarlılık ve güvenilirlik sağlar.

Tüm paketleri
görmek için



:::info
Deno Standart Kütüphanesindeki birçok paket, Node.js, Cloudflare Workers ve diğer JavaScript ortamları ile de uyumludur. Bu, kodunuzu modifikasyon olmadan birden fazla ortamda çalıştırmanıza olanak tanır.
:::

Standart kütüphane JSR'de barındırılmaktadır ve şu adreste mevcuttur: 
[https://jsr.io/@std](https://jsr.io/@std). Paketler belgelenmiştir, test edilmiştir ve kullanım örnekleri içermektedir. JSR'de standart kütüphane paketlerinin tam listesini gözden geçirebilirsiniz, ancak burada birkaç örnek bulunmaktadır:

- [@std/path](https://jsr.io/@std/path): Node.js'in `path` modülüne benzer yol manipülasyon yardımcı programları.
- [@std/jsonc](https://jsr.io/@std/jsonc): Yorumlarla JSON'un (de)serileştirilmesi
- [@std/encoding](https://jsr.io/@std/encoding): Hex, base64 ve varyant gibi yaygın formatları kodlama ve çözme için yardımcı programlar

## Sürümleme ve stabilite

Standart kütüphanenin her paketi bağımsız olarak sürümlendirilir. Paketler, 
[semanik sürümleme kurallarını](https://jsr.io/@std/semver) takip eder. 
Büyük sürümlerin kodunuzu etkilemesini önlemek için `sürüm sabitleme veya sürüm aralıkları` kullanabilirsiniz.

## Standart kütüphane modüllerini içe aktarma

Deno Standart Kütüphanesinden paketleri kurmak için, `deno add` alt komutunu kullanarak paketi `deno.json` içe aktarma haritanıza ekleyebilirsiniz.

```sh
deno add jsr:@std/fs jsr:@std/path
```

`deno.json` dosyasındaki `imports` alanı, bu içe aktarmaları içerecek şekilde güncellenecektir:

```json
{
  "imports": {
    "@std/fs": "jsr:@std/fs@^1.0.2",
    "@std/path": "jsr:@std/path@^1.0.3"
  }
}
```

Ardından, bu paketleri kaynak kodunuzda şu şekilde içe aktarabilirsiniz:

```ts
import { copy } from "@std/fs";
import { join } from "@std/path";

await copy("foo.txt", join("dist", "foo.txt"));
```

:::tip
Alternatif olarak, modülleri doğrudan `jsr:` belirteci ile içe aktarabilirsiniz:
:::

```js
import { copy } from "jsr:@std/fs@^1.0.2";
import { join } from "jsr:@std/path@^1.0.3";

await copy("foo.txt", join("dist", "foo.txt"));
```

## Node.js uyumluluğu

Deno Standart Kütüphanesi, Node.js, Cloudflare Workers ve diğer JavaScript ortamları ile uyumlu olacak şekilde tasarlanmıştır. Standart kütüphane TypeScript ile yazılmıştır ve JavaScript'e derlenmiştir, böylece herhangi bir JavaScript ortamında kullanılabilir.

```sh
npx jsr add @std/fs @std/path
```

Bu komutu çalıştırmak, bu paketleri `package.json` dosyanıza ekleyecektir:

```json
{
  "dependencies": {
    "@std/fs": "npm:@jsr/std__fs@^1.0.2",
    "@std/path": "npm:@jsr/std__path@^1.0.3"
  }
}
```

Ardından, bunları kaynak kodunuzda, diğer Node.js paketleriyle olduğu gibi içe aktarabilirsiniz. TypeScript, bu paketlerin tür tanımlarını otomatik olarak bulacaktır.

```ts
import { copy } from "@std/fs";
import { join } from "@std/path";

await copy("foo.txt", join("dist", "foo.txt"));
```