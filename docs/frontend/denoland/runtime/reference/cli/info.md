---
title: "`deno info`, bağımlılık denetleyicisi"
description: "Bu belge, Deno'daki bilgi komutunu (`deno info`) kullanarak bağımlılık denetleyicisi hakkında detaylar sunar. Ayrıca, önbellek konumu ve modüller hakkında bilgi sağlar."
keywords: [Deno, bağımlılık denetleyicisi, deno info, modül, önbellek konumu, TypeScript, ES modülleri]
oldUrl:
 - /runtime/manual/tools/dependency_inspector/
 - /runtime/reference/cli/dependency_inspector/
command: info
---

## Örnek

```shell
$ deno info jsr:@std/http@1.0.0-rc.5/file-server
local: /home/lucacasonato/.cache/deno/deps/https/jsr.io/3a0e5ef03d2090c75c81daf771ed9a73009518adfe688c333dc11d8006dc3598
emit: /home/lucacasonato/.cache/deno/gen/https/jsr.io/3a0e5ef03d2090c75c81daf771ed9a73009518adfe688c333dc11d8006dc3598.js
type: TypeScript
dependencies: 40 benzersiz
size: 326.42KB
```

:::tip
`deno info` komutu, Deno'daki modüllerin her türlü bağımlılığını listelemek için son derece yararlıdır.
:::

```shell
https://jsr.io/@std/http/1.0.0-rc.5/file_server.ts (24.74KB)
├─┬ https://jsr.io/@std/path/1.0.1/posix/join.ts (862B)
│ ├── https://jsr.io/@std/path/1.0.1/_common/assert_path.ts (307B)
│ └─┬ https://jsr.io/@std/path/1.0.1/posix/normalize.ts (1.31KB)
│   ├─┬ https://jsr.io/@std/path/1.0.1/_common/normalize.ts (263B)
│   │ └── https://jsr.io/@std/path/1.0.1/_common/assert_path.ts *
│   ├─┬ https://jsr.io/@std/path/1.0.1/_common/normalize_string.ts (2.25KB)
│   │ └── https://jsr.io/@std/path/1.0.1/_common/constants.ts (1.97KB)
│   └─┬ https://jsr.io/@std/path/1.0.1/posix/_util.ts (391B)
│     └── https://jsr.io/@std/path/1.0.1/_common/constants.ts *
...
```

Bağımlılık denetleyicisi, yerel veya uzaktan **ES modülleri** ile çalışır.

---

## Önbellek konumu

`deno info`, önbellek konumu hakkında bilgi görüntülemek için kullanılabilir:

```shell
deno info
DENO_DIR konumu: "/Users/deno/Library/Caches/deno"
Uzak modüller önbelleği: "/Users/deno/Library/Caches/deno/deps"
TypeScript derleyici önbelleği: "/Users/deno/Library/Caches/deno/gen"
```

:::info
Deno, tüm modülleri bir önbellek dizininde depolar; bu nedenle `deno info` aracılığıyla önbellek konumunu kolayca öğrenebilirsiniz.
:::