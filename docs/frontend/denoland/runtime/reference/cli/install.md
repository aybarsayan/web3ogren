---
title: "`deno install`"
description: "Deno install komutu, bağımlılıkların yüklenmesi ve yönetilmesi için kullanılır. Bu içerik, deno install ile ilgili temel bilgileri ve örnekleri sunmaktadır."
keywords: [Deno, install, bağımlılıklar, npm, script]
---

## Örnekler

### deno install

Bu komutu `deno.json` ve/veya `package.json` içinde tanımlanan tüm bağımlılıkları yüklemek için kullanın. 

Bağımlılıklar genel önbelleğe yüklenecek, ancak projeniz bir `package.json` dosyasına sahipse, yerel bir `node_modules` dizini de kurulacaktır.

### deno install [PAKETLER]

Bu komutu belirli paketleri yüklemek ve bunları `deno.json` veya `package.json`'a eklemek için kullanın.

```shell
$ deno install jsr:@std/testing npm:express
```

:::tip
`deno add` komutunu da kullanabilirsiniz; bu, `deno install [PAKETLER]` için bir takma addır.
:::

Projenizde bir `package.json` dosyası varsa, npm'den gelen paketler `package.json` içindeki `dependencies`'e eklenecektir. Aksi halde tüm paketler `deno.json`'a eklenecektir.

### deno install --entrypoint [DOSYALAR]

Bu komutu sağlanan dosyalarda ve onların bağımlılıklarında kullanılan tüm bağımlılıkları yüklemek için kullanın. 

Bu, `jsr:`, `npm:`, `http:` veya `https:` belirticilerini kullandığınız kodda tüm bağımlılıkları projenizi dağıtmadan önce önbelleğe almak için özellikle yararlıdır.

```js title="main.js"
import * as colors from "jsr:@std/fmt/colors";
import express from "npm:express";
```

```shell
$ deno install -e main.js
Download jsr:@std/fmt
Download npm:express
```

:::tip
Yerel bir `node_modules` dizini oluşturmak istiyorsanız `--node-modules-dir=auto` bayrağını geçebilirsiniz.

Bazı bağımlılıklar, yerel bir `node_modules` dizini olmadan düzgün çalışmayabilir.
:::

### deno install --global [PAKET_VEYA_URL]

Bu komutu sağlanan paketi veya scripti sisteminizde genel olarak kullanılabilir bir ikili olarak yüklemek için kullanın. 

Bu komut, belirtilen CLI bayraklarını ve ana modülü kullanarak `deno`'yu çağıran ince bir çalıştırılabilir kabuk scripti oluşturur. Bu, kurulum kök dizininin `bin` dizininde yer alır.

Örnek:

```shell
$ deno install --global --allow-net --allow-read jsr:@std/http/file-server
Download jsr:@std/http/file-server...

✅ Başarıyla file-server yüklendi.
/Users/deno/.deno/bin/file-server
```

Çalıştırılabilir adını değiştirmek için `-n`/`--name` kullanın:

```shell
deno install -g -N -R -n serve jsr:@std/http/file-server
```

Varsayılan olarak çalıştırılabilir adı çıkarılır:

- URL yolunun dosya gövdesini almaya çalışır. Yukarıdaki örnek 'file-server' olur.
- Dosya gövdesi 'main', 'mod', 'index' veya 'cli' gibi genel bir şeyse ve yolın üstü yoksa, üst yolun dosya adını alır. Aksi takdirde, genel ad ile yerleşir.
- Sonuçlanan isim '@...' son eki varsa, bunu çıkarır.

Kurulum kökünü değiştirmek için `--root` kullanın:

```shell
deno install -g -N -R --root /usr/local jsr:@std/http/file-server
```

Kurulum kökü, öncelik sırasına göre belirlenir:

- `--root` seçeneği
- `DENO_INSTALL_ROOT` ortam değişkeni
- `$HOME/.deno`

Gerekirse bunları manuel olarak path'e eklemelisiniz.

```shell
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bashrc
```

Yükleme sırasında scripti çalıştırmak için kullanılacak izinleri belirtmelisiniz.

```shell
deno install -g -N -R jsr:@std/http/file-server -- -p 8080
```

Yukarıdaki komut, ağ ve okuma izinleri ile çalışan ve 8080 portuna bağlanan `file_server` adında bir çalıştırılabilir oluşturur.

:::info
İyi bir uygulama için, çalıştırılabilir bir scriptte giriş noktası belirtmek için `import.meta.main` biçimini kullanın.
:::

Örnek:

```ts
// https://example.com/awesome/cli.ts
async function myAwesomeCli(): Promise<void> {
  // -- kısaltılmış --
}

if (import.meta.main) {
  myAwesomeCli();
}
```

Bir çalıştırılabilir script oluşturduğunuzda, kullanıcıların bunu bildirmesi için depolarınıza bir örnek yükleme komutu ekleyin:

```shell
# deno install kullanarak yükleyin

$ deno install -n awesome_cli https://example.com/awesome/cli.ts
```

## Yerel Node.js eklentileri

[`npm:sqlite3`](https://www.npmjs.com/package/sqlite3) veya [`npm:duckdb`](https://www.npmjs.com/package/duckdb) gibi popüler npm paketlerinin çoğu 
["yaşam döngüsü scriptleri"](https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-scripts) kullanır; örn. `preinstall` veya `postinstall` scriptleri. Çoğu zaman, bu scriptlerin çalıştırılması, bir paketinin doğru şekilde çalışması için gereklidir.

:::warning
npm'den farklı olarak, Deno bu scriptleri varsayılan olarak çalıştırmaz, çünkü potansiyel bir güvenlik açığı oluşturabilirler.
:::

Yine de, `deno install` çalıştırırken `--allow-scripts=` bayrağını geçerek bu scriptleri çalıştırabilirsiniz:

```shell
deno install --allow-scripts=npm:sqlite3
```

_Tüm bağımlılıkları yükleyin ve `npm:sqlite3` paketinin yaşam döngüsü scriptlerini çalıştırmasına izin verin._

## Kaldır

Bağımlılıkları veya ikili scriptleri `deno uninstall` komutu ile kaldırabilirsiniz:

```shell
$ deno uninstall express
Removed express
```

```shell
$ deno uninstall -g file-server
deleted /Users/deno/.deno/bin/file-server
✅ Başarıyla file-server kaldırıldı
```

Daha fazla bilgi için `deno uninstall` sayfasına bakın`.