---
title: "Dosya sistemi olayları"
description: "Bu doküman, Deno kullanarak dosya sistemi olaylarını nasıl izleyebileceğinizi ve işletim sistemleri arasındaki farklılıkları keşfetmenizi sağlar. Örneklerle pratik bilgi sunar."
keywords: [Deno, dosya sistemi, izleme, olaylar, programlama]
---

## Kavramlar

- [Deno.watchFs](https://docs.deno.com/api/deno/~/Deno.watchFs) kullanarak dosya sistemi olaylarını izleyin.
- Sonuçlar işletim sistemlerine göre değişiklik gösterebilir.

## Örnek

Geçerli dizinde dosya sistemi olaylarını kontrol etmek için:

```ts title="watcher.ts"
const watcher = Deno.watchFs(".");
for await (const event of watcher) {
  console.log(">>>> event", event);
  // Örnek olay: { kind: "create", paths: [ "/home/alice/deno/foo.txt" ] }
}
```

:::tip
Dosya sisteminde olayları izlemek için yukarıdaki kodu kullanarak temel bir watcher oluşturabilirsiniz.
:::

Şu şekilde çalıştırın:

```shell
deno run --allow-read watcher.ts
```

Artık `watcher.ts` ile aynı dizinde dosya eklemeyi, kaldırmayı ve değiştirmeyi deneyin.

Olayların tam sıralamasının işletim sistemleri arasında değişebileceğini unutmayın. Bu özellik, platforma bağlı olarak farklı sistem çağrılarını kullanır:

- Linux: [inotify](https://man7.org/linux/man-pages/man7/inotify.7.html)
- macOS: [FSEvents](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/FSEvents_ProgGuide/Introduction/Introduction.html)
- Windows: [ReadDirectoryChangesW](https://docs.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-readdirectorychangesw)

:::warning
Olay sıralaması, kullanılan işletim sisteminin ayarlarına bağlı olarak değişiklik gösterebilir. Bu, uygulamanızın performansını etkileyebilir.
:::

> "Olayların tam sıralaması işletim sistemleri arasında değişebilir."  
> — Duyurular


Ek Bilgi

Deno'da dosya sistemi olaylarını izlemek için ek seçenekler bulunmaktadır. Örneğin, belirli dosya türlerini izlemek veya sadece belirli dizinlerdeki olaylara tepki vermek için filtreler uygulayabilirsiniz.

