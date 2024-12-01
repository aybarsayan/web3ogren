---
title: Çıktı
description: Bu belge, kullanıcıya görev çıktısını nasıl yönetebileceği ve farklı renderer seçenekleri ile çıktıların nasıl gösterileceği hakkında bilgiler sunmaktadır. Detaylı örneklerle, Observable ve Stream kullanımı, görev aracılığıyla çıktı gösterimi gibi konular ele alınmaktadır.
keywords: [çıkış, görev, renderer, Observable, Stream, Listr]
order: 30
tag:
  - temel
  - görsel
category:
  - görev
---



_Görev_, kullanıcıya neler olduğunu bildirmek amacıyla veya programatik olarak bir temel görev hakkında daha fazla bilgi vermek için çalışma sırasında çıktı sağlayabilir.



::: info Örnek

İlgili örnekleri [burada](https://github.com/listr2/listr2/tree/master/examples/task-output.example.ts) bulabilirsiniz.

:::

## Kullanım

Seçilen renderere bağlı olarak, çıktının formatı değişecektir. _DefaultRenderer_ için her şey, görevden hemen sonra küçük bir çubuk içinde render edilirken, _SimpleRenderer_, _VerboseRenderer_ veya _TestRenderer_ için daha çok bir günlük gibi olacaktır. _Görev_ `output` davranışına ilişkin bireysel özellikler bir sonraki bölümde bulunmaktadır.

### Görev Aracılığıyla Çıktıyı Gösterme

Bu, yalnızca görevden alınan son çıktıyı gösteren küçük bir çubukta çıktıyı gösterecektir.

 Kod Örneği — Stream

 Kod Örneği — Observable



`process.stdout` ve `process.stderr`, seçilen renderere bağlı olarak _ProcessOutput_ kullanımına göre müdahale edilebilir. Bu nedenle, görev çalışırken çıktıyı boşaltmak için bir `WritableStream` gerektiren her şey, geçici bir `WritableStream` oluşturarak _Listr_ aracılığıyla gerçekleştirilmelidir.

## Bir Komutun Çıktısını Render Etme



Görev çıktısı, `process.output`'a yazan bir şey çalıştırırken doğrudan `task.stdout()`'a yönlendirilebilir, çünkü bu bir `WritableStream`'dir. Bu genellikle komutların çıktısını göstermekte kullanılabilir.

::: details  Kod Örneği

 Kod Örneği



_DefaultRenderer_ için, görev bir başlığa sahipse, çıktının son satırı varsayılan olarak görev başlığının altında render edilir.

Çıktı çubuğunda gösterilmek istenen öğe sayısı, `outputBar` render seçenekleri aracılığıyla ayarlanabilir ve bu her görev için geçerlidir.

- `true` yalnızca son satırı korur.
- `Infinity` tüm satırları korur.
- `number` tanımlanan miktardaki satırları korur.
- `false` bu yöntemle çıktıyı render etmez.

::: details  Kod Örneği

 Kod Örneği

 Kod Örneği

<<< @../../examples/docs/task/output/renderer-default-persistent.ts

:::