---
description: Bu bölümde, Clipanion kütüphanesinde miras alma, mevcut komutlara seçenek ekleme ve tembel değerlendirme ile ilgili önemli noktalar ele alınmaktadır. Kod örnekleri ile bu kavramların nasıl uygulanabileceği açıklanmaktadır.
keywords: [Clipanion, miras alma, seçenek ekleme, tembel değerlendirme, komutlar, programlama]
---

# Öneriler

## Miras Alma

Sadece sıradan ES6 sınıfları oldukları için, komutlar birbirini kolayca genişletebilir ve seçenekleri miras alabilir:

```ts twoslash
import {Command, Option} from 'clipanion';
// ---cut---
abstract class BaseCommand extends Command {
    cwd = Option.String(`--cwd`, {hidden: true});

    abstract execute(): Promise<number | void>;
}

class FooCommand extends BaseCommand {
    foo = Option.String(`-f,--foo`);

    async execute() {
        this.context.stdout.write(`Hello from ${this.cwd ?? process.cwd()}!\n`);
        this.context.stdout.write(`This is foo: ${this.foo}.\n`);
    }
}
```

:::tip
Dikkat edilmesi gereken önemli bir nokta, genişletme sırasında süper sınıfın doğru şekilde yapılandırılmış olmasıdır.
:::

Pozisyoneller de miras alınabilir. Bu, süper sınıftan başlayarak sırayla tüketilecektir:

```ts twoslash
import {Command, Option} from 'clipanion';
// ---cut---
abstract class BaseCommand extends Command {
    foo = Option.String();

    abstract execute(): Promise<number | void>;
}

class FooCommand extends BaseCommand {
    bar = Option.String();

    async execute() {
        this.context.stdout.write(`This is foo: ${this.foo}.\n`);
        this.context.stdout.write(`This is bar: ${this.bar}.\n`);
    }
}
```

```
hello world
    => Command {"foo": "hello", "bar": "world"}
```

## Mevcut Komutlara Seçenek Eklemek

Mevcut komutlara seçenek eklemek, miras alma ve gerekli seçenekler aracılığıyla gerçekleştirilebilir:

```ts twoslash
import {Command, Option} from 'clipanion';
// ---cut---
class GreetCommand extends Command {
  static paths = [[`greet`]];

  name = Option.String();

  greeting = Option.String(`--greeting`, `Hello`);

  async execute(): Promise<number | void> {
    this.context.stdout.write(`${this.greeting} ${this.name}!\n`);
  }
}

class GreetWithReverseCommand extends GreetCommand {
  reverse = Option.Boolean(`--reverse`, {required: true});

  async execute() {
    return await this.cli.run([`greet`, this.reverse ? this.name.split(``).reverse().join(``) : this.name, `--greeting`, this.greeting]);
  }
}
```

```
greet john
    => "Hello john!\n"

greet john --greeting hey
    => "hey john!\n"

greet john --reverse
    => "Hello nhoj!\n"

greet john --greeting hey --reverse
    => "hey nhoj!\n"
```

:::danger
Mevcut bir komuta seçenek eklemek için, onun `Command` sınıfını bilmeniz gerekir. Bu, uygulamanızın kendi komutlarını kaydedebilen farklı eklentiler kullandığı durumlarda, 2 farklı komut kullanarak 2 seçenek eklemek istiyorsanız, `Command` sınıfından birinin diğerini ve temel olanı genişletmesi gerektiği anlamına gelir.
:::

## Tembel Değerlendirme

Birçok komut aşağıdaki formata sahiptir:

```ts twoslash
import {Command} from 'clipanion';
// ---cut---
import {uniqBy} from 'lodash';

class MyCommand extends Command {
    async execute() {
        // ...
    }
}
```

Bu, oldukça iyi çalışsa da, her biri kendi bağımlılık setlerine sahip birçok komutunuz varsa (burada `lodash`), genel başlangıç süresi olumsuz etkilenebilir. Bunun nedeni, `import` ifadelerinin, komut sonrasında yürütülüp yürütülmeyeceğine bakılmaksızın her zaman istekli bir şekilde değerlendirilmesidir.

:::info
Eğer birçok bağımlılığınız varsa, tembel değerlendirme yöntemlerini kullanmak başlangıç süresini iyileştirebilir.
:::

Bu sorunu çözmek için, `import` ifadelerinizi `execute` fonksiyonunun gövdesinin içine taşıyabilirsiniz - böylece yalnızca gerçekten gerekli olduğunda değerlendirileceğinden emin olabilirsiniz:

```ts twoslash
import {Command} from 'clipanion';
// ---cut---
class MyCommand extends Command {
    async execute() {
        const {uniqBy} = await import(`lodash`);
        // ...
    }
}
```

Bu strateji hafifçe daha zor okunur, bu nedenle her durumda gerekli olmayabilir. Kenarda yaşamayı seviyorsanız, [`babel-plugin-lazy-import`](https://github.com/arcanis/babel-plugin-lazy-import) eklentisi, bu tür bir dönüşümü otomatik olarak uygulamak için tasarlanmıştır - ancak kaynaklarınız üzerinde Babel çalıştırmanızı gerektirir.