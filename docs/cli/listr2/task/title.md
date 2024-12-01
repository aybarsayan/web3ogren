---
description: Bu belge, 'Görev' bileşeninin başlık kullanımını ve başlıksız görevlerin nasıl işleneceğini açıklar. Başlıklar, kullanıcı deneyimini artırmak ve görev ilerlemesini görsel olarak ifade etmek için kritik öneme sahiptir.
keywords: [görev, başlık, render, kullanıcı deneyimi, programlama, görsel, bileşen]
---



_Görev_ kalabalığın içinden sıyrılmak ve kullanıcının neyin çalıştığını görsel olarak anlamasına yardımcı olmak için bir başlığa sahip olabilir.



## Kullanım

_Görev_'in başlığı, görev oluşturulurken başlatılabilir ve çalışma zamanı sırasında enjekte edilen `task` nesnesi aracılığıyla doğrudan manipüle edilebilir.

:::info
Bu, kullanıcının başlığı, görev boyunca kaydedilen ilerlemeye göre değiştirmesine veya kullanıcının görevin tamamlandığını bildirmesine olanak tanır; bu nedenle, dilbilgisi açısından her şey doğru görünecektir.
:::

 Kod Örneği

<<< @../../examples/docs/task/title/task-title-pop.ts{8,12,19,23}

:::
