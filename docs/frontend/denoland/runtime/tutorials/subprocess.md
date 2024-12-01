---
title: "Alt Süreç Oluşturma"
description: Deno ile alt süreç oluşturmanın temel yöntemlerini öğrenin. Bu döküman, alt süreçlerin nasıl başlatılacağı, iletişim kuracağı ve çıktılarının nasıl yönlendirileceği ile ilgili örnekler sunmaktadır.
keywords: [Deno, alt süreç, subprocess, stdout, stderr, izinler, komut satırı]
---

## Kavramlar

- Deno, [Deno.Command](https://docs.deno.com/api/deno/~/Deno.Command) aracılığıyla bir alt süreç başlatabilir.
- **Bir alt süreç başlatmak için** `--allow-run` **izni gereklidir.**
- Başlatılan alt süreçler güvenlik kumandasında çalışmaz.
- Alt süreçle, [stdin](https://docs.deno.com/api/deno/~/Deno.stdin), [stdout](https://docs.deno.com/api/deno/~/Deno.stdout) ve [stderr](https://docs.deno.com/api/deno/~/Deno.stderr) akışları aracılığıyla iletişim kurulur.

---

## Basit örnek

:::tip
Bu örnek, komut satırından `echo "Hello from Deno!"` çalıştırmanın eşdeğeridir.
:::

```ts title="subprocess_simple.ts"
// alt süreç oluşturmak için kullanılan komutu tanımla
const command = new Deno.Command("echo", {
  args: [
    "Hello from Deno!",
  ],
});

// alt süreci oluştur ve çıktıyı topla
const { code, stdout, stderr } = await command.output();

console.assert(code === 0);
console.log(new TextDecoder().decode(stdout));
console.log(new TextDecoder().decode(stderr));
```

Çalıştır:

```shell
$ deno run --allow-run=echo ./subprocess_simple.ts
Hello from Deno!
```

---

## Güvenlik

:::warning
Bir alt süreç oluşturmak için `--allow-run` izni gereklidir. Alt süreçlerin Deno kumandasında çalışmadığını ve dolayısıyla komutu komut satırından kendiniz çalıştırıyormuş gibi aynı izne sahip olduğunu unutmayın.
:::

---

## Alt süreçlerle iletişim

Varsayılan olarak `Deno.Command()` kullandığınızda alt süreç, ana sürecin `stdin`, `stdout` ve `stderr`'ı devralır. **Başlatılan bir alt süreçle iletişim kurmak istiyorsanız** `"piped"` **seçeneğini kullanmalısınız.**

---

## Dosyalara yönlendirme

:::info
Bu örnek, bash'de `yes &> ./process_output` çalıştırmanın eşdeğeridir.
:::

```ts title="subprocess_piping_to_files.ts"
import {
  mergeReadableStreams,
} from "jsr:@std/streams@1.0.0-rc.4/merge-readable-streams";

// süreci bağlamak için dosya oluştur
const file = await Deno.open("./process_output.txt", {
  read: true,
  write: true,
  create: true,
});

// süreci başlat
const command = new Deno.Command("yes", {
  stdout: "piped",
  stderr: "piped",
});

const process = command.spawn();

// dosyaya göndermenin yanı sıra stdout ve stderr'yi birleştirme örneği
const joined = mergeReadableStreams(
  process.stdout,
  process.stderr,
);

// süreç kapandığında/öldüğünde çözülen bir promis döner
joined.pipeTo(file.writable).then(() => console.log("pipe join done"));

// süreç "yes" manuel olarak durdurulmalı, kendi kendine sonlanmaz
setTimeout(() => {
  process.kill();
}, 100);
```

Çalıştır:

```shell
$ deno run --allow-run=yes --allow-read=. --allow-write=. ./subprocess_piping_to_file.ts
```