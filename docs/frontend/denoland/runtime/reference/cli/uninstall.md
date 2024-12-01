---
title: "deno uninstall"
description: "Deno uninstall command allows the removal of specified dependencies from project configuration files. Learn how to uninstall packages and manage your project's dependencies effectively."
keywords: [deno, uninstall, command, dependencies, package management, project configuration]
---

## `deno uninstall [PAKETLER]`

`deno.json` veya `package.json` dosyasında belirtilen bağımlılıkları kaldırın:

```shell
$ deno add npm:express
Add npm:express@5.0.0

$ cat deno.json
{
  "imports": {
    "express": "npm:express@5.0.0"
  }
}
```

```shell
$ deno uninstall express
Removed express

$ cat deno.json
{
  "imports": {}
}
```

:::tip
Ayrıca `deno remove` komutunu da kullanabilirsiniz; bu, `deno uninstall [PAKETLER]` için bir takma addır.
:::

Birden fazla bağımlılığı aynı anda kaldırabilirsiniz:

```shell
$ deno add npm:express jsr:@std/http
Added npm:express@5.0.0
Added jsr:@std/http@1.0.7

$ cat deno.json
{
  "imports": {
    "@std/http": "jsr:@std/http@^1.0.7",
    "express": "npm:express@^5.0.0",
  }
}
```

```shell
$ deno remove express @std/http
Removed express
Removed @std/http

$ cat deno.json
{
  "imports": {}
}
```

:::info
`deno.json` ve `package.json` dosyalarından bağımlılıklar kaldırılmasına rağmen, yine de gelecekteki kullanım için global önbellekte kalır.
:::

Projenizde `package.json` varsa, `deno uninstall` bununla da çalışabilir:

```shell
$ cat package.json
{
  "dependencies": {
    "express": "^5.0.0"
  }
}

$ deno remove express
Removed express

$ cat package.json
{
  "dependencies": {}
}
```

## `deno uninstall --global [SCRIPT_ADI]`

`serve` kaldırın

```bash
deno uninstall --global serve
```

Belirli bir kurulum kökünden `serve` kaldırın

```bash
deno uninstall -g --root /usr/local serve
```