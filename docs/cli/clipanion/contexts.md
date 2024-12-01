---
description: Bu belge, Clipanion'daki bağlamların nasıl çalıştığını ve nasıl özelleştirileceğini açıklamaktadır. Bağlamların özelleştirilmesi, CLI uygulamalarının daha esnek ve güçlü şekillerde kullanılmasını sağlar.
keywords: [Clipanion, bağlam, komut, CLI, yapılandırma, akış, özelleştirme]
---

# İçerikler

Clipanion komutlarında neyi *bağlam* olarak adlandırıyoruz. Bu şatafatlı kelimenin altında, tüm komutlara `this.context` üzerinden sağladığımız basit bir nesne yatıyor. Varsayılan bağlam oldukça basittir:

```ts twoslash
import type {Readable, Writable} from 'stream';

interface BaseContext {
    env: Record<string, string | undefined>;
    stdin: Readable;
    stdout: Writable;
    stderr: Writable;
    colorDepth: number;
}
```

Kendi bağlamlarınızı tanımlayabilirsiniz (varsayılan olanı genişletecek şekilde) `cwd`, kullanıcı kimlik doğrulama token'ı ya da yapılandırma gibi daha karmaşık ortam seçenekleri geçirebilmek için ...

:::info
Bağlamda akışları neden tuttuğumuzu merak ediyor olabilirsiniz; bunun nedeni, komutların diğer komutların çıktısını kolayca kesip alabilmesidir (örneğin, sonuçlarını bir tampon içinde yakalamak için), bu da daha iyi bir birleşim sağlar.
:::

:::tip
Eğer `console.log` ailesine olan tüm yazma işlemlerinin yakalanıp doğru akışlara yönlendirilmesi için Clipanion'un bunu otomatik olarak yönetmesini tercih ederseniz, CLI yapılandırmanıza `enableCapture: true` ekleyin. Bu, aynı anda birden fazla komut çalıştığında uygun yönlendirmeyi bile destekler!
:::

## Bağlam Değişimleri

`this.cli` API'sini çağırırken, `run` fonksiyonu *kısmi* bir bağlam nesnesi alır - sıradan `cli.run` ve `cli.runExit` fonksiyonlarının aksine, bu fonksiyonlar tam bir bağlam gerektirir. Bu kısmi bağlam, mevcut bağlamın üzerine uygulanır, bu nedenle yönlendirilmiş komutlar geçmediğiniz bağlamı otomatik olarak miras alır.

```ts twoslash
import {Command} from 'clipanion';
// ---cut---
import {PassThrough} from 'stream';

class BufferCommand extends Command {
    async execute() {
        const passThrough = new PassThrough();

        await this.cli.run([`other-command`], {
            stdout: passThrough,
        });
    }
}
```