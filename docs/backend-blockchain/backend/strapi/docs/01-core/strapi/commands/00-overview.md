---
title: Genel Bakış
description: CLI, `@strapi/strapi` paketine bağlı olarak çeşitli komutlar sunar. Bu doküman, CLI komut yapısını ve sağlanan bağlamı ele alarak geliştiricilere yardımcı olmayı amaçlamaktadır.
keywords: [CLI, komutlar, Strapi, logger, tsconfig]
---

CLI büyük ölçüde `@strapi/strapi` paketine bağlıdır, ancak bazı paketler kendi komutlarını enjekte edebilir:

- `@strapi/data-transfer`

## Komut Yapısı

CLI, `commander` ile oluşturulmuştur ve bu nedenle oluşturduğumuz her komut şu şekilde tanımlanabilir:

```ts
import { createCommand, Command } from 'commander';

type StrapiCommand = (params: { command: Command; argv: string[]; ctx: CLIContext }) => Command;

// kullanım

const myCommand: StrapiCommand = ({ argv, ctx }) => {
  // bir şey yap
  return createCommand('develop')
    .alias('dev')
    .option(
      '--no-build',
      '[kullanımdan kaldırıldı]: sunucu için bir ara yazılım mevcut, artık ayrı bir işlem değildir'
    )
    .action((options) => {
      // seçenekler ve ctx ile bir şey yap
    });
};
```

> **Not:** Bu eylemler daha sonra `@strapi/strapi` paketinde birleştirilir. Her komuta sağlanan bağlam birçok faydalı özellik sunar.  
> — Geliştirici Kılavuzu

### `logger`

```ts
interface Logger {
  warnings: number;
  errors: number;
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  log: (...args: unknown[]) => void;
  spinner: (text: string) => Pick<ora.Ora, 'succeed' | 'fail' | 'start' | 'text'>;
}
```

:::info
Paylaşılan logger, herhangi bir komutun CLI çıktısını kontrol etmek için `--debug` ve `--silent` bayraklarını kabul edebilmesini sağlar. `ora`'nın logger'a dahil edilmesi sayesinde uzun süreli görevler için bir spinner sağlayabiliriz, daha da önemlisi `--silent` geçirildiğinde bunları kolayca susturabiliriz.
:::

### `tsconfig`

Eğer `tsconfig` _tanımlı_ değilse, projenin TS projesi olmadığını sonuçlandırabiliriz. Ancak, tanımlıysa, tsconfig’in nerede bulunduğuna ve yapılandırmanın kendisine erişimimiz vardır.

```ts
interface TsConfig {
  config: ts.ParsedCommandLine;
  path: string;
}
```