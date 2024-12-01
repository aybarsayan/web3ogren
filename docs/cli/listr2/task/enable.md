---
description: Bu sayfa, Listr'de koşullu etkinleştirme ile görevlerin programatik olarak nasıl oluşturulabileceği hakkında bilgiler sunmaktadır.
keywords: [Koşullu Etkinleştirme, Listr, Görev, Programatik, Değişkenler]
---



_Görev_ programatik olarak değişkenlere bağlı olarak etkinleştirilebilir. Bu, bağlama veya dış koşullara bağlı görevlerin oluşturulmasını sağlar.



::: warning
_Görev_ koşullu etkinleştirmesi, belirli bir _Görev_ veya _Alt görev_ için sınıfı oluşturduğunuzda Listr'ın başlangıç çalıştırması sırasında belirlenir, bu nedenle dahili bağlam değişkenlerini kullanırken dikkatli olun.

İlk değerlendirmeden sonra belirli bir _Görev_ için icra zamanına geldiğinde yeniden değerlendirilecektir.
:::

::: info
İlgili örnekleri [burada](https://github.com/listr2/listr2/tree/master/examples/task-enable.example.ts) bulabilirsiniz.
:::

## Kullanım

<<< @../../examples/docs/task/enable/basic.ts{18}

## Gösterici

Devre dışı görevler gösterilmeyecek.