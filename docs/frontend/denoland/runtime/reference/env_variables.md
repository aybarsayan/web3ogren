---
title: "Ortam değişkenleri"
description: Deno ortam değişkenleri hakkında bilgi veren bu belge, yerleşik Deno.env, .env dosyaları ve özel ortam değişkenlerini ele alır. Ortam değişkenlerini yönetmek için kullanılan yöntemleri ve en iyi uygulamaları öğrenin.
keywords: [Deno, ortam değişkenleri, Deno.env, .env dosyası, standart kütüphane, özel ortam değişkenleri]
---

Deno'da ortam değişkenlerini kullanmanın birkaç yolu vardır:

## Yerleşik Deno.env

Deno çalışma zamanı, ortam değişkenleri için yerleşik destek sunar [`Deno.env`](https://docs.deno.com/api/deno/~/Deno.env) ile.

`Deno.env` getter ve setter metodlarına sahiptir. İşte örnek kullanım:

```ts
Deno.env.set("FIREBASE_API_KEY", "examplekey123");
Deno.env.set("FIREBASE_AUTH_DOMAIN", "firebasedomain.com");

console.log(Deno.env.get("FIREBASE_API_KEY")); // examplekey123
console.log(Deno.env.get("FIREBASE_AUTH_DOMAIN")); // firebasedomain.com
console.log(Deno.env.has("FIREBASE_AUTH_DOMAIN")); // true
```

## .env dosyası

Deno, `.env` dosyalarını destekler. Deno'nun `.env`'den ortam değişkenlerini okumasını sağlamak için `--env-file` bayrağını kullanabilirsiniz: `deno run --env-file `. Bu, varsayılan olarak `.env`'yi okuyacaktır; farklı bir dosyadan ortam değişkenlerini yüklemek istiyorsanız veya gerekiyorsa, bayrağa bu dosyayı bir parametre olarak belirtebilirsiniz. Ayrıca, birden fazla `.env` dosyasından değişkenler yüklemek için birden fazla `--env-file` bayrağı geçebilirsiniz (örneğin, `deno run --env-file=.env.one --env-file=.env.two --allow-env `).

:::note
Aynı ortam değişkeni için birden fazla beyan varsa, ilk bulunan uygulanır. Ancak, aynı değişken birden fazla `.env` dosyasında tanımlanmışsa (birden fazla `--env-file` argümanı kullanarak), belirtilen son dosyadaki değer önceliğe sahiptir. Bu, son `.env` dosyasında bulunan ilk örneğin uygulanacağı anlamına gelir.
:::

Alternatif olarak, standart kütüphanedeki `dotenv` paketi de `.env`'den ortam değişkenlerini yükleyecektir.

Diyelim ki aşağıdaki gibi bir `.env` dosyanız var:

```sh
GREETING="Hello, world."
```

`load` modülünü içe aktararak `.env` dosyasından ve işlem ortamına otomatik olarak içe aktarın.

```ts
import "jsr:@std/dotenv/load";

console.log(Deno.env.get("GREETING")); // "Hello, world."
```

>.env işlemleri için daha fazla belgeler [@std/dotenv](https://jsr.io/@std/dotenv/doc) belgelerinde bulunabilir.

## `std/cli`

Deno Standart Kütüphanesi, komut satırı argümanlarını ayrıştırmak için bir [`std/cli` modülü](https://jsr.io/@std/cli) sunar. Lütfen belge ve örnekler için bu modüle başvurun.

## Özel ortam değişkenleri

Deno çalışma zamanında bu özel ortam değişkenleri bulunmaktadır.

| ad                   | açıklama                                                                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DENO_AUTH_TOKENS     | Özel depo birimlerinden uzak modülleri almak için kullanılacak yarı noktalar ve ana bilgisayar adlarının ayrı nokta ile ayrılmış listesidir (örneğin, `abcde12345@deno.land;54321edcba@github.com`) |
| DENO_TLS_CA_STORE    | Sıralamaya bağlı sertifika depolarının virgülle ayrılmış listesi.Olası değerler: `system`, `mozilla`. Varsayılan değeri `mozilla`dır.                                 |
| DENO_CERT            | PEM kodlu dosyadan sertifika otoritesini yükle                                                                                                                               |
| DENO_DIR             | Önbellek dizinini ayarlayın                                                                                                                                                  |
| DENO_INSTALL_ROOT    | Deno kurulumunun çıktı dizinini ayarlayın (varsayılan olarak `$HOME/.deno/bin`)                                                                                              |
| DENO_REPL_HISTORY    | REPL geçmiş dosyası yolunu ayarlayın Geçmiş dosyası değeri boş olduğunda devre dışı bırakılır (varsayılan olarak `$DENO_DIR/deno_history.txt`)                         |
| DENO_NO_PACKAGE_JSON | `package.json` otomatik çözümlemesini devre dışı bırakır                                                                                                                    |
| DENO_NO_PROMPT       | Erişim izin istemlerini devre dışı bırakmak için ayarlayın(çağırma sırasında `--no-prompt` geçmenin alternatifidir)                                                     |
| DENO_NO_UPDATE_CHECK | Daha yeni bir Deno sürümünün mevcut olup olmadığını kontrol etmeyi devre dışı bırakmak için ayarlayın                                                                         |
| DENO_V8_FLAGS        | V8 komut satırı seçeneklerini ayarlayın                                                                                                                                       |
| DENO_JOBS            | Test alt komutuyla `--parallel` bayrağı için kullanılan paralel çalışan sayısı.Varsayılan olarak mevcut CPU sayısına eşittir.                                             |
| DENO_WEBGPU_TRACE    | WebGPU API'yi kullanırken bir [WGPU izini](https://github.com/gfx-rs/wgpu/pull/619) çıktılamak için bir dizin yolunu belirtin                                                               |
| DENO_WEBGPU_BACKEND  | WebGPU'nun kullanacağı arka ucu seçin veya tercih sırasına göre virgülle ayrılmış bir arka uç listesi. Olası değerler `vulkan`, `dx12`, `metal` veya `opengl`'dir.         |
| HTTP_PROXY           | HTTP istekleri için proxy adresi (modül indirmeleri, fetch)                                                                                                                 |
| HTTPS_PROXY          | HTTPS istekleri için proxy adresi (modül indirmeleri, fetch)                                                                                                                |
| NPM_CONFIG_REGISTRY  | npm kayıt defteri için kullanılacak URL.                                                                                                                                      |
| NO_COLOR             | Rengi devre dışı bırakmak için ayarlayın                                                                                                                                        |
| NO_PROXY             | Proxy kullanılmayan ana bilgisayarların virgülle ayrılmış listesi (modül indirmeleri, fetch)                                                                                  |