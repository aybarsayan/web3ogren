---
description: Clipanion ile komutlarınızı belgelemek ve yardım işlevselliği eklemek için kullanılan `usage` özelliğini keşfedin.
keywords: [Clipanion, komut, yardım, kullanım, özellikler]
---

# Yardım

Clipanion, belgeleri kolayca dokümante etmenizi ve bir yardım işlevselliği eklemenizi sağlayan araçlar içerir.

## `usage` özelliği

Komutlar, komutu belgelendirmek için kullanılacak bir `usage` statik özelliği tanımlayabilir. Tanımlanmışsa, aşağıdaki alanlardan herhangi biriyle bir nesne olmalıdır:

- `category`, komutları global yardım listesinde gruplamak için kullanılacaktır
- `description`, global yardım listesinde kullanılan bir satırlık açıklamadır
- `details`, komutunuzun uzun açıklamasıdır; paragraflar `\n\n` ile ayrılmıştır
- `examples`, `[açıklama, komut]` çiftlerinin bir dizisidir

Tüm komutların, `usage` özelliği tanımlanmadığı sürece varsayılan olarak global yardım listesinden gizli olduğunu unutmayın.

```ts twoslash
import {Cli, Command, Option} from 'clipanion';

export class HelloCommand extends Command {
  static paths = [
    [`my-command`],
  ];

  static usage = Command.Usage({
    category: `Benim kategorim`,
    description: `Komutun küçük bir açıklaması.`,
    details: `
      Komutun bazı \`markdown kodu\` ile daha uzun bir açıklaması.
      
      Birden fazla paragraf kullanmak mümkündür. Clipanion, içeriği yeniden girintilemek ve paragrafları gerektiği gibi sarmakla ilgilenecektir.
    `,
    examples: [[
      `Temel bir örnek`,
      `$0 my-command`,
    ], [
      `İkinci bir örnek`,
      `$0 my-command --with-parameter`,
    ]],
  });

  p = Option.Boolean(`--with-parameter`);

  async execute() {
    this.context.stdout.write(
      this.p ? `Parametre ile çağrıldı` : `Parametre olmadan çağrıldı`
    );
  }
}
```

```
$ my-app my-command -h
```

```
━━━ Kullanım ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$ my-app my-command [--with-parameter]

━━━ Ayrıntılar ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Komutun bazı \`markdown kodu\` ile daha uzun bir açıklaması.

Birden fazla paragraf kullanmak mümkündür. Clipanion, içeriği yeniden girintilemek ve paragrafları gerektiği gibi sarmakla ilgilenecektir.

━━━ Örnekler ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Temel bir örnek
  $ my-app my-command

İkinci bir örnek
  $ my-app my-command --with-parameter
```

:::tip
`usage` özelliği ile tanımlanan alanlar, kullanıcıların komutlarınızı daha iyi anlamalarına yardımcı olur.
:::

## `--help` bayrağı

Yerleşik `--help` bayrağı, mevcut komutların listesini yazdırır. Eklemek için, onu içe aktarın ve kaydedin:

```ts
import {Cli, Builtins} from "clipanion";

const cli = new Cli({
  binaryName: `my-app`,
  binaryLabel: `Uygulamam`,
  binaryVersion: `1.0.0`,
});

cli.register(Builtins.HelpCommand);
```

```
$ my-app --help
```

```
━━━ Uygulamam - 1.0.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$ my-app <komut>

━━━ Benim kategorim ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

my-app my-command [--with-parameter]
  Komutun küçük bir açıklaması.
```