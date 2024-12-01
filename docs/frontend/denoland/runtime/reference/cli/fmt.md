---
title: "`deno fmt`, kod biçimlendirme"
description: Deno, birçok dosya türünü otomatik olarak biçimlendiren yerleşik bir kod biçimlendirici sunar. Bu içerik, desteklenen dosya türleri ve biçimlendirmeyi göz ardı etme yöntemleri hakkında bilgi vermektedir.
keywords: [deno, kod biçimlendirme, dosya türleri, javascript, typescript, markdown, formatter]
oldUrl:
 - /runtime/tools/formatter/
 - /runtime/manual/tools/formatter/
 - /runtime/reference/cli/formatter/
command: fmt
---

## Desteklenen Dosya Türleri

Deno, aşağıdaki dosyaları otomatik biçimlendirecek yerleşik bir kod biçimlendirici ile birlikte gelir:

| Dosya Türü  | Uzantı          | Notlar                                                                                  |
| ----------- | ---------------- | -------------------------------------------------------------------------------------- |
| JavaScript  | `.js`            |                                                                                        |
| TypeScript  | `.ts`            |                                                                                        |
| JSX         | `.jsx`           |                                                                                        |
| TSX         | `.tsx`           |                                                                                        |
| Markdown     | `.md`, `.markdown` |                                                                                        |
| JSON        | `.json`         |                                                                                        |
| JSONC       | `.jsonc`        |                                                                                        |
| CSS         | `.css`           |                                                                                        |
| HTML        | `.html`          |                                                                                        |
| YAML        | `.yml`, `.yaml`  |                                                                                        |
| Sass        | `.sass`          |                                                                                        |
| SCSS        | `.scss`          |                                                                                        |
| LESS        | `.less`          |                                                                                        |
| Astro       | `.astro`         | `--unstable-component` bayrağı veya `"unstable": ["fmt-component"]` yapılandırma seçeneği gerektirir. |
| Svelte      | `.svelte`        | `--unstable-component` bayrağı veya `"unstable": ["fmt-component"]` yapılandırma seçeneği gerektirir. |
| Vue         | `.vue`           | `--unstable-component` bayrağı veya `"unstable": ["fmt-component"]` yapılandırma seçeneği gerektirir. |

:::note
**`deno fmt`, Markdown dosyalarındaki kod parçalarını biçimlendirebilir.** Parçalar, üçlü ters tırnak içinde olmalı ve bir dil niteliği taşımalıdır.
:::

## Kod Görmezden Gelme

### JavaScript / TypeScript / JSONC

Biçimlendirmeyi görmezden gelmek için, kodun başına `// deno-fmt-ignore` yorumu ekleyin:

```ts
// deno-fmt-ignore
export const identity = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
];
```

Tam bir dosyayı görmezden gelmek için, dosyanın en üstüne `// deno-fmt-ignore-file` yorumunu ekleyin.

### Markdown / HTML / CSS

Sonraki öğeyi biçimlendirmeyi görmezden gelmek için, başına `` yorumunu ekleyin:

```html
<html>
  <body>
    <p>
      Merhaba
      <!-- deno-fmt-ignore -->
    </p>
  </body>
</html>
```

Bir kod bölümünü görmezden gelmek için, kodu `` ve `` yorumlarıyla çevreleyin.

Tam bir dosyayı görmezden gelmek için, dosyanın en üstüne `` yorumunu ekleyin.

### YAML

Sonraki öğeyi biçimlendirmeyi görmezden gelmek için, başına `# deno-fmt-ignore` yorumunu ekleyin:

```yaml
# deno-fmt-ignore aaaaaa: bbbbbbb
```