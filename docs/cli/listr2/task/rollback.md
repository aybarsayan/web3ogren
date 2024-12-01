---
title: Geri Alma
description: Bu belge, Listr'da görevlerin geri alma işlemi hakkında bilgi vermektedir. Rollback özelliği, başarısız olan görevlerin etkilerini geri almayı sağlar ve kullanımıyla ilgili örnekler sunar.
keywords: [Listr, rollback, görev yönetimi, hata yönetimi, yazılım geliştirme]
---



_Task_ kendisi başarısız olduğunda veya alt görevleri başarısız olduğunda, `rollback` tamamlanmamış o eylem tarafından geri alınması gereken her şeyi geri alır. Rollback yalnızca görev kendisi başarısız olarak işaretlendiğinde çalışır ve bir görevin `rollback` özelliği olarak tanımlanabilir.

> Yeni bir _Listr_ döndüğünüzde alt görev listesi olarak, başarısızlık durumunda bir şey yapmak en kolay ve en uygun değil, her alt görev ayrı ayrı ele alınmalıdır. Ancak bu, görevin tamamlanmadığı durumlarda bazı eylemlerin geri alınması gereken tekil görevler için hala kullanılabilir.
> — Listr Belgeleri





::: info Örnek

İlgili örnekleri [burada](https://github.com/listr2/listr2/tree/master/examples/task-rollback.example.ts) bulabilirsiniz.

:::

## Kullanım

### _Alt Görev İçin_

<<< @../../examples/docs/task/rollback/for-subtasks.ts{26-36}

## Seçenekler

Rollback, varsayılan olarak başarısız olduğunda bir istisna fırlatır ve sonraki görevlerin yürütülmesini durdurur. Ancak bu `{ exitAfterRollback: false }` seçeneği ile geçersiz kılınabilir. Bu, `exitOnError`'dan bağımsız olarak hareket eden ana Listr seçeneğidir çünkü rollback'in başarısız olması daha kötü sonuçlara yol açabilir.

::: tip İpuçları

Rollback işlemlerinin dikkatli bir şekilde planlanması, görev yönetimini daha verimli hale getirebilir. 

:::

## Renderer

### _Varsayılan Renderer_

Rollback etkinleştirildiğinde varsayılan render, döngü renklerini parlak kırmızıya değiştirecektir; eğer rollback başarıyla tamamlanırsa kırmızı bir geri ok olacaktır, aksi takdirde normal bir hata gibi rollback eyleminden gelen hatayı gösterecektir.