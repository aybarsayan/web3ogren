---
title: Görev
description: Bu belgede Listr kütüphanesinde görevlerin nasıl oluşturulacağı ve yönetileceği hakkında bilgi verilmektedir. Görevlerin temel özellikleri ve alt görevlerin oluşturulması detaylı bir şekilde açıklanmaktadır.
keywords: [Listr, görev, alt görev, Promise, Stream, Observable]
order: 1
tag:
  - zorunlu
  - temel
category:
  - görev
---



`listr2`, tek bir örnek içinde yer alan bir görevler kümesidir. Bu nedenle `Görev`, görev listenizin en küçük yapı taşıdır.



## Görev

Tek bir görev, `verilen özellikler` ile bir nesnedir; burada `task`, istenen işlevin yürütüldüğü ana çekim noktasıdır.

:::tip
Görev tanımlarken dikkat edilmesi gereken en önemli unsurlardan biri, verilen özelliklerin doğru bir şekilde sağlanmasıdır.
:::

Bir görev, aşağıdaki biçimlerde olabilir ve bu türler typings ile sağlanır:

- `Function`/`Promise`
- _Listr_ [^subtasks]
- `Stream`
- `Observable`

[^subtasks]: Bir alt görevi oluşturmak için `task.newListr` yardımcı fonksiyonu aracılığıyla yapılması gerekir; çünkü bir alt görev oluşturulurken ebeveyn görevinin tekil örneklerinin enjekte edilmesi gerçekleştirilir. Lütfen `ilişkili bölümü` kontrol edin.

## İlk Görevinizi Oluşturma

<<< @../../examples/docs/task/task/basic.ts{9-14}

:::info
İlk görevinizi oluştururken, yukarıdaki örnek kodu göz önünde bulundurmanız faydalı olacaktır. Bu, temel yapı taşlarınızı hızlıca oluşturmanıza yardımcı olabilir.
:::

## Mevcut _Listr_'e Ekle

<<< @../../examples/docs/task/task/append.ts{7-9,11-18}

:::note
Mevcut bir _Listr_ örneğine ekleme yapmak, projenizin gelişimini hızlandırır. Görevler arasında geçişler sağlamak için mevcut yeteneklerinizi genişletebilirsiniz.
:::