---
title: "Dosya sistemi API'leri"
description: Deno Deploy'un sunduğu dosya sistemi API'leri, dağıtımlarınızdan statik dosyalara erişimi kolaylaştırır. Bu kılavuzda, mevcut API'lerin kullanımı ve örnekleri hakkında bilgi bulabilirsiniz.
keywords: [Deno, dosya sistemi, API, Deno Deploy, statik dosyalar, Deno.readDir, Deno.readFile]
---

Deno Deploy, Deno'da bulunan sınırlı bir dosya sistemi API setini desteklemektedir. Bu dosya sistemi API'leri, dağıtımlarınızdan statik dosyalara erişim sağlar. Statik dosyalar örneğin:

- GitHub entegrasyonu ile dağıtırsanız, GitHub depo dosyaları.
- Bir oyun alanı dağıtımındaki giriş noktası dosyası.

Mevcut olan API'ler şunlardır:

- `Deno.cwd`
- `Deno.readDir`
- `Deno.readFile`
- `Deno.readTextFile`
- `Deno.open`
- `Deno.stat`
- `Deno.lstat`
- `Deno.realPath`
- `Deno.readLink`

## Deno.cwd

`Deno.cwd()` dağıtımınızın mevcut çalışma dizinini döndürür. Bu, dağıtımınızın kök dizininin kökünde yer alır. Örneğin, GitHub entegrasyonu ile dağıtırsanız, mevcut çalışma dizini GitHub deponuzun köküdür.

## Deno.readDir

`Deno.readDir()` bir dizinin içeriğini listelemenizi sağlar.

Bu işlev tamamen uyumludur
[Deno](https://docs.deno.com/api/deno/~/Deno.readDir).

```ts
function Deno.readDir(path: string | URL): AsyncIterable<DirEntry>
```

Path, bir relative veya absolute yolda olabilir. Ayrıca bir `file:` URL'si de olabilir.

### Örnek

Bu örnek, bir dizinin içeriğini listeler ve bu listeyi yanıt gövdesinde JSON nesnesi olarak döner.

```js
async function handler(_req) {
  // Depo kökünde bulunan `blog` dizinindeki gönderileri listeleyin.
  const posts = [];
  for await (const post of Deno.readDir(`./blog`)) {
    posts.push(post);
  }

  // JSON olarak döndürün.
  return new Response(JSON.stringify(posts, null, 2), {
    headers: {
      "content-type": "application/json",
    },
  });
}

Deno.serve(handler);
```

## Deno.readFile

`Deno.readFile()` bir dosyayı tamamen belleğe okumanızı sağlar.

İşlev tanımı
[Deno](https://docs.deno.com/api/deno/~/Deno.readFile) ile benzerdir, ancak şu anda [`ReadFileOptions`](https://docs.deno.com/api/deno/~/Deno.ReadFileOptions) desteklememektedir. Destek gelecekte eklenecektir.

```ts
function Deno.readFile(path: string | URL): Promise<Uint8Array>
```

Path, bir relative veya absolute yolda olabilir. Ayrıca bir `file:` URL'si de olabilir.

### Örnek

Bu örnek, bir dosyanın içeriğini belleğe bir byte dizisi olarak okur ve ardından yanıt gövdesi olarak döndürür.

```js
async function handler(_req) {
  // Mevcut yöntemleri keşfetmek için depo kökünde bulunan README.md dosyasını okuyalım.

  // Relative yollar, depo köküne göredir
  const readmeRelative = await Deno.readFile("./README.md");
  // Absolute yollar.
  // Depo içeriği Deno.cwd() altında mevcuttur.
  const readmeAbsolute = await Deno.readFile(`${Deno.cwd()}/README.md`);
  // Dosya URL'leri de desteklenmektedir.
  const readmeFileUrl = await Deno.readFile(
    new URL(`file://${Deno.cwd()}/README.md`),
  );

  // Uint8Array'ı string olarak çözümleyin.
  const readme = new TextDecoder().decode(readmeRelative);
  return new Response(readme);
}

Deno.serve(handler);
```

> Not: Bu özelliği kullanmak için, projenizi bir GitHub deposuna bağlamanız gerekir.

:::info
Deno Deploy, dosya sisteminden statik varlıkları okumak için `Deno.readFile` API'sini destekler. Bu, resimler, stil dosyaları ve JavaScript dosyaları gibi statik varlıkları sunmak için yararlıdır.
:::

Bir GitHub deposundaki dosya yapısını düşünün:

```console
├── mod.ts
└── style.css
```

`mod.ts` içeriği:

```ts
async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  // Sunucunun çalışma şekli:
  // 1. Belirli bir varlık için bir istek gelir.
  // 2. Varlığı dosya sisteminden okuruz.
  // 3. Varlığı istemciye geri göndeririz.

  // İsteğin style.css için olup olmadığını kontrol edin.
  if (pathname.startsWith("/style.css")) {
    // style.css dosyasını dosya sisteminden okuyun.
    const file = await Deno.readFile("./style.css");
    // İsteğe style.css dosyası ile yanıt verin.
    return new Response(file, {
      headers: {
        "content-type": "text/css",
      },
    });
  }

  return new Response(
    `<html>
      <head>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <h1>Örnek</h1>
      </body>
    </html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}

Deno.serve(handleRequest);
```

[`Deno.readFile`](https://docs.deno.com/api/deno/~/Deno.readFile) API'sine sağlanan yol, depo köküne göredir. Ayrıca, `Deno.cwd` içinde bulunuyorlarsa absolute yolları da belirtebilirsiniz.

## Deno.readTextFile

Bu işlev, dosya içeriğini UTF-8 string olarak çözen `Deno.readFile` ile benzerdir.

```ts
function Deno.readTextFile(path: string | URL): Promise<string>
```

### Örnek

Bu örnek, bir metin dosyasını belleğe okur ve içeriği yanıt gövdesi olarak döner.

```js
async function handler(_req) {
  const readme = await Deno.readTextFile("./README.md");
  return new Response(readme);
}

Deno.serve(handler);
```

## Deno.open

`Deno.open()` bir dosyayı açmanıza ve bir dosya tanıtıcısı döndürmenize olanak tanır. Bu dosya tanıtıcısı, dosyanın içeriğini okumak için kullanılabilir. Dosya tanıtıcısı hakkında daha fazla bilgi için `Deno.File` bölümüne bakın.

İşlev tanımı, 
[Deno](https://docs.deno.com/api/deno/~/Deno.open) ile benzerdir, ancak şu anda [`OpenOptions`](https://docs.deno.com/api/deno/~/Deno.OpenOptions) desteklememektedir. Destek gelecekte eklenecektir.

```ts
function Deno.open(path: string | URL): Promise<Deno.File>
```

Path, bir relative veya absolute yolda olabilir. Ayrıca bir `file:` URL'si de olabilir.

### Örnek

Bu örnek bir dosyayı açar ve ardından içeriği yanıt gövdesi olarak akıtır.

```js
async function handler(_req) {
  // Depo kökünde bulunan README.md dosyasını açın.
  const file = await Deno.open("./README.md");

  // `readable` özelliğini kullanın, bu bir `ReadableStream`'dir. Bu, yanıt gönderimi tamamlandığında otomatik olarak dosya tanıtıcısını kapatacaktır.
  return new Response(file.readable);
}

Deno.serve(handler);
```

:::note
Aşağıda gösterildiği gibi bir dosya akışı üzerinde döngü kurduğunuzda, dosya tanıtıcısı döngünün sonunda otomatik olarak kapatılır. Dosya tanıtıcısını manuel olarak kapatmanıza gerek yoktur: `const iterator = fd.readable[Symbol.asyncIterator]();`
:::

## Deno.File

`Deno.File`, `Deno.open()` ile döndürülen bir dosya tanıtıcısıdır. `read()` metodu kullanılarak dosyanın parçalarını okumak için kullanılabilir. Dosya tanıtıcısını `close()` metodu ile kapatabilirsiniz.

Arayüz, [Deno](https://docs.deno.com/api/deno/~/Deno.File) ile benzerdir, ancak dosyaya yazma veya arama desteği yoktur. İkincisi için destek gelecekte eklenecektir.

```ts
class File {
  readonly rid: number;

  close(): void;
  read(p: Uint8Array): Promise<number | null>;
}
```

Path, bir relative veya absolute yolda olabilir. Ayrıca bir `file:` URL'si de olabilir.

## Deno.File#read()

Read metodu, bir dosyanın bir parçasını okumak için kullanılır. Okunacak verilerin bir tampon olarak geçilmesi gerekir. Okunan byte sayısını döndürür veya dosya sonuna ulaşıldığında `null` döner.

```ts
function read(p: Uint8Array): Promise<number | null>;
```

### Deno.File#close()

Close metodu, dosya tanıtıcısını kapatmak için kullanılır. Tanıtıcının kapatılması, devam eden tüm okumaları kesintiye uğratır.

```ts
function close(): void;
```

## Deno.stat

`Deno.stat()` bir dosya sistemi girişinin meta verilerini okur. Bir `Deno.FileInfo` nesnesi döndürür. Sembolik bağlantılar izlenir.

İşlev tanımı, 
[Deno](https://docs.deno.com/api/deno/~/Deno.stat) ile aynıdır. Değişiklik zamanı, erişim zamanı veya oluşturma zamanı değerlerini döndürmez.

```ts
function Deno.stat(path: string | URL): Promise<Deno.FileInfo>
```

Path, bir relative veya absolute yolda olabilir. Ayrıca bir `file:` URL'si de olabilir.

### Örnek

Bu örnek, bir dosyanın boyutunu alır ve sonucu yanıt gövdesi olarak döner.

```js
async function handler(_req) {
  // Depo kökündeki README.md dosyasının dosya bilgilerini alın.
  const info = await Deno.stat("./README.md");

  // Dosyanın byte cinsinden boyutunu alın.
  const size = info.size;

  return new Response(`README.md dosyasının boyutu ${size} byte`);
}

Deno.serve(handler);
```

## Deno.lstat

`Deno.lstat()` `Deno.stat()` ile benzerdir, ancak sembolik bağlantıları takip etmektedir.

İşlev tanımı, 
[Deno](https://docs.deno.com/api/deno/~/Deno.lstat) ile aynıdır. Değişiklik zamanı, erişim zamanı veya oluşturma zamanı değerlerini döndürmez.

```ts
function Deno.lstat(path: string | URL): Promise<Deno.FileInfo>
```

Path, bir relative veya absolute yolda olabilir. Ayrıca bir `file:` URL'si de olabilir.

## Deno.FileInfo

`Deno.FileInfo` arayüzü, bir dosya sistemi girişinin meta verilerini temsil etmek için kullanılır. `Deno.stat()` ve `Deno.lstat()` işlevleri tarafından döndürülür. Bir dosyayı, dizini veya sembolik bağlantıyı temsil edebilir.

Deno Deploy'de yalnızca dosya türü ve boyut özellikleri mevcuttur. Boyut özelliği, Linux'ta olduğu gibi davranır.

```ts
interface FileInfo {
  isDirectory: boolean;
  isFile: boolean;
  isSymlink: boolean;
  size: number;
}
```

## Deno.realPath

`Deno.realPath()` sembolik bağlantıları izledikten sonra bir dosyanın çözülmüş absolute yolunu döndürür.

İşlev tanımı, 
[Deno](https://docs.deno.com/api/deno/~/Deno.realPath) ile aynıdır.

```ts
function Deno.realPath(path: string | URL): Promise<string>
```

Path, bir relative veya absolute yolda olabilir. Ayrıca bir `file:` URL'si de olabilir.

### Örnek

Bu örnek `Deno.realPath()` çağrısı ile depo kökündeki bir dosyanın absolute yolunu alır. Sonuç yanıt gövdesi olarak döndürülür.

```js
async function handler(_req) {
  const path = await Deno.realPath("./README.md");

  return new Response(`./README.md için tam olarak çözülmüş yol ${path}`);
}

Deno.serve(handler);
```

## Deno.readLink

`Deno.readLink()` bir sembolik bağlantının hedef yolunu döndürür.

İşlev tanımı, 
[Deno](https://docs.deno.com/api/deno/~/Deno.readLink) ile aynıdır.

```ts
function Deno.readLink(path: string | URL): Promise<string>
```

Path, bir relative veya absolute yolda olabilir. Ayrıca bir `file:` URL'si de olabilir.

### Örnek

Bu örnek `Deno.readLink()` çağrısı ile depo kökündeki bir dosyanın absolute yolunu alır. Sonuç yanıt gövdesi olarak döndürülür.

```js
async function handler(_req) {
  const path = await Deno.readLink("./my_symlink");

  return new Response(`./my_symlink için hedef yol ${path}`);
}

Deno.serve(handler);
```