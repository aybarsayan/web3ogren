---
description: Komut doğrulama, kullanıcıların girdiği parametrelerde istenen biçimi sağlamak için Clipanion ve Typanion kütüphanesinin nasıl kullanılacağını açıklar.
keywords: [komut doğrulama, Clipanion, Typanion, parametre kontrolü, CLI]
---

# Doğrulama

Statik türler, istikrarlı CLI'ler için oldukça faydalı olsa da, kullanıcılarınızın komut satırınıza girdiği parametreler üzerinde daha sıkı bir kontrol sağlamak genellikle gereklidir. Bu nedenle, Clipanion, hem statik hem de çalışma zamanı giriş doğrulamaları ve dönüşümleri sağlayan bir kütüphane olan [Typanion](https://github.com/arcanis/typanion) ile otomatik (ve isteğe bağlı) bir entegrasyon sunar.

## Seçenekleri Doğrulama

`Option.String` açıklayıcısı, bir `validator` seçeneği kabul eder. Bunu, seçeneğiniz için belirli bir şekli zorunlu kılmak üzere Clipanion predikatları ile kullanabilirsiniz:

```ts twoslash
import {Command, Option} from 'clipanion';
// ---cut---
import * as t from 'typanion';

class PowerCommand extends Command {
    a = Option.String({validator: t.isNumber()});
    b = Option.String({validator: t.isNumber()});

    async execute() {
        this.context.stdout.write(`${this.a ** this.b}\n`);
    }
}
```

> Gördüğünüz gibi, **TypeScript**, hem `this.a` hem de `this.b`'nin sayılar olduğunu doğru bir şekilde çıkarıyor (bunları orijinal stringlerinden dönüştürüyor) ve çalışma zamanında başka bir şey geçmek, artık doğrulama hatalarını tetikleyecektir. 
> — **Tip Notu**

:::tip
Typanion predikatlarını kullanarak ek kurallar uygulayabilirsiniz; örneğin burada bir şeyin geçerli bir port olduğunu doğrulamak için:
:::

```ts twoslash
import {Command, Option} from 'clipanion';
// ---cut---
import * as t from 'typanion';

const isPort = t.applyCascade(t.isNumber(), [
    t.isInteger(),
    t.isInInclusiveRange(1, 65535),
]);

class ServeCommand extends Command {
    port = Option.String({validator: isPort});

    async execute() {
        this.context.stdout.write(`Dinleme ${this.port}\n`);
    }
}
```

---

## Komutları Doğrulama

Seçenek düzeyinde doğrulama genellikle yeterli olsa da, bazı durumlarda uygulamanızda nihai şekil hakkında kısıtlamalar uygulamanız gerekebilir. Örneğin, `--bar` kullanıldığında `--foo`'nun kullanılamayacağı bir komut hayal edin. Bu tür gereksinimler için `statik şema` bildiriminden yararlanabilirsiniz:

```ts twoslash
import {Command, Option} from 'clipanion';
// ---cut---
import * as t from 'typanion';

class MyCommand extends Command {
    foo = Option.Boolean(`--foo`, false);
    bar = Option.Boolean(`--bar`, false);

    static schema = [
        t.hasMutuallyExclusiveKeys([`foo`, `bar`]),
    ];

    async execute() {
        // ...
    }
}
```

:::info
Bu şema, komutun yürütülmesinden önce çalıştırılacak ve `foo` ve `bar`'dan herhangi biri true olduğunda, diğerinin mutlaka false olmasını garantileyecektir.
:::

Ancak, `schema` tür çıkarımına katkıda bulunmaz, bu nedenle bir değerin ayarlanıp ayarlanmadığını kontrol etmek, diğer değerler için türü sihirli bir şekilde belirginleştirmez.