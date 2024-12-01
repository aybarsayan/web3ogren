---
id: errors
title: Hata Yönetimi
description: Bu belgede Clipanion ile hata yönetimi hakkında bilgi bulacaksınız. Nasıl hata fırlatma, yığın izini yönetme ve özel hata yakalama yöntemlerini kullanacağınızı öğrenin.
keywords: [Clipanion, hata yönetimi, UsageError, Error, komut uygulamaları, hata yakalama, yığın izleri]
---

Clipanion, varsayılan olarak uygulamanız tarafından fırlatılan tüm hataları yakalar ve bunların yığın izini (stack trace) yazdırır. Yığın izinin yazdırılmasını önlemek isterseniz, tipik `Error` yerine bir `UsageError` örneği fırlatın. Clipanion, yalnızca sağlanan mesajı ve komut kullanım satırını görüntüler.

:::tip
Bir hata (veya `UsageError`) fırlatmanın çıkış kodunu 1 olarak ayarladığını unutmayın; ancak bunun yalnızca 1 olarak döndürmekten farklı olduğunu aklınızda bulundurun.
:::

Sonuncu durumda, Clipanion, yalnızca kendinizin yazdırdığı şeyleri göstermez. 

Bir kural olarak:
- Beklenmedik iç hatalar (örneğin başarısız doğrulamalar) için bir `Error` fırlatın.
- Geçersiz seçenekler / ortamlar nedeniyle oluşan hatalar için bir `UsageError` fırlatın.
- Komut düzgün bir şekilde çalıştırılmışsa ancak çağırana bir şey bildirilmesi gerekiyorsa (örneğin, `grep` eşleşme bulunamadığında hata döndürüyor veya bir dosyayı kontrol ederken hata keşfedildiğinde bir lint komutu), 1 döndürün.

## Özel Hata Yönetimi

Bazı durumlarda, bir komut fırlatıldığında Clipanion'un ne yapacağını kontrol etmek isteyebilirsiniz. Bu durumda, komutunuzu tanımlarken `catch` yöntemini geçersiz kılın:

```ts twoslash
import {Command} from 'clipanion';

export class HelloCommand extends Command {
  async execute() {
    throw new Error(`Merhaba dünya`);
  }
  
  async catch(error: unknown) {
    // Burada istediğinizi yapabilirsiniz, orijinal hatayı yeniden fırlatmak gibi
    throw error;
  }
}
```