---
description: Clipanion ile komut yolları oluşturma ve yönetme üzerine detaylar.
keywords: [Clipanion, komut yolları, CLI, execute, Command.Default, yol çakışmaları, argümanlar]
---

# Dosya Yolları

Varsayılan olarak, Clipanion tüm komutları en üst seviyede monte eder, yani bunlar komut satırındaki ilk token'dan itibaren yürütme için seçilir. Bu, `cp` veya `curl` gibi bir Posix tarzı araç oluşturuyorsanız genellikle istediğiniz şeydir, ancak `yarn` veya `react-native` gibi bir CLI uygulaması oluştururken durum böyle değildir.

Bununla yardımcı olmak için, Clipanion her komuta bir veya daha fazla *yol* vermeyi destekler. Bir yol, komutun yürütme adayı olarak seçilmesi için bulunması gereken sabit stringlerin listesidir. Yollar, her komut sınıfından statik `paths` özelliği kullanılarak bildirilir:

```ts twoslash
import {Command} from 'clipanion';
// ---cut---
class InstallCommand extends Command {
    static paths = [[`install`], [`i`]];
    async execute() {
        // ...
    }
}
```

Yukarıdaki örnekte, iki yolun herhangi birini kabul eden bir komut bildirdik: `install` veya `i`. Komutun ayrıca *hiç* yol ayarlandığında (varsayılan davranış gibi) tetiklenmesini istiyorsak, `Command.Default` özel yolunu kullanırız:

```ts
import {Command} from 'clipanion';
// ---cut---
class InstallCommand extends Command {
    static paths = [[`install`], [`i`], Command.Default];
    async execute() {
        // ...
    }
}
```

:::tip
`Command.Default` yardımcı simgesi yerine boş bir dizi de kullanabilirsiniz, ancak sağlanan sembolü kullanmak, bir komutun aynı zamanda bir giriş noktası olduğunu okuyucuya açıkça belirtmenin iyi bir yoludur.
:::

## Yol Çakışmaları

Bir yol, diğer bir yol ile çakışabilir, yeter ki tam olarak aynı olmasınlar:

```ts
import {Command} from 'clipanion';
// ---cut---
class FooCommand extends Command {
    static paths = [[`foo`]];
    async execute() {
        // ...
    }
}

class FooBarCommand extends Command {
    static paths = [[`foo`, `bar`]];
    async execute() {
        // ...
    }
}
```

Clipanion, `foo bar` çalıştırıldığında `FooBarCommand`'ı ve sadece `foo` çalıştırıldığında `FooCommand`'ı doğru şekilde yürütür. İsterseniz `FooCommand` üzerinde konumsal argümanlar da bildirebilirsiniz, bu argümanlar `bar` ile eşleşmediği sürece alınacaktır!

:::tip
Aynı yollara sahip ancak farklı seçenekleri olan birden fazla komut da oluşturabilirsiniz; yeter ki kullanıcı, komutu tetiklerken bunlardan birine özgü bir seçeneği belirtirse (veya eğer seçenek gereklisiyse belirtmezse)! Tek dikkat edilmesi gereken nokta, kullanıcı belirtmezse Clipanion hangi versiyonu kullanacağını bilemeyecek ve `AmbiguousSyntaxError` hatası verecektir.
:::