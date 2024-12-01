---
title: Hata Yönetimi
order: 5
description: Bu belge, Listr kullanarak hata yönetimi süreçlerini kapsamaktadır. Hata fırlatma, davranış değiştirme ve hata toplama gibi önem arz eden konulara değinilmektedir. 
keywords: [hata yönetimi, Listr, hata fırlatma, görev yönetimi, hata toplama]
---



_Başlık_ sırasında meydana gelen istisnalar _Listr_ aracılığıyla dahili olarak işlenecektir. Görevlerden hataları fırlatabilir ve bunların başarısız olduğunu gösterebilir veya çalışmayı durdurabilirsiniz. Bu, _Listr_, _Alt Görev_ veya _Görev_ seviyesinde daha fazla özelleştirilebilir.

> Hatalar, mevcut renderere göre terminalde görsel çıktı üretecek ve yapılandırmaya göre başarısız olan _Görev_ ile de ilgilenecektir. 
> — Daha fazla bilgi için aşağıdaki paragrafa bakabilirsiniz.

Eğer bir uygulama erken sona ermesi gerekiyorsa ve belirli bir görevi başarısız olarak işaretlemesi gerekiyorsa, sadece `Error` örneğini fırlatmalısınız.

Varsayılan davranış, herhangi bir görevin başarısız olması durumunda kendini başarısız olarak kabul etmesi ve çıkış yapmasıdır. Bu davranış `exitOnError` seçeneğiyle değiştirilebilir. Eğer `exitOnError` değeri `true` ise, karşılaşılan ilk hata fırlatılır ve bu hata _Görev_ 'den başlayarak dışa yayılarak iletilir.



::: warning

Bir `Error` her zaman JavaScript/Typescript `Error` sınıfından genişletilmiş gerçek bir `Error` türü olmalıdır.

:::

::: info Örnek

İlgili örnekleri [burada](https://github.com/listr2/listr2/tree/master/examples/error-handling.example.ts) bulabilirsiniz.

:::

## Hata Fırlatma

Bir hata fırlatmak, mevcut _Görev_ 'den herhangi bir sonraki işlemi durdurur ve _Listr_ 'e dışa yayılır ve `exitOnError` yapılandırmasına bağlı olarak, gelecek veya eş zamanlı görevler için yürütme yavaşça durdurulacaktır.

::: info

Hataları açıkça yakalayıp toplamanıza gerek yoktur, çünkü bunlar her zaman _Listr_ tarafından toplanacaktır.

:::

::: warning

Hatanın fırlatılmasından sonra yürütmenin duracağına dikkat edin. Bu, herhangi bir eşzamanlı işlemi erken sona erdirebilir.

:::



:::

## Toplanan Hatalar

_Hata_ 'ların, `tasks.error` dizisi içerisinde ana _Listr_ görev listesinde toplandığını belirtir, burada `tasks` _Listr_ sınıfıdır. **Bu seçenek, v6.0.0 itibarıyla isteğe bağlıdır.**

`exitOnError` gibi bazı hataları göz ardı etme seçenekleri veya belirli görevi `task.retry` ile yeniden deneme yeteneğine sahip olduğundan, karşılaşılan hatalar yürütme sırasında yutulabilir. Bu yutulan hataları ele almak için, yürütmeyi durdurmamasına rağmen karşılaşılan tüm hatalar bu özellik aracılığıyla toplanır.

### Modlar



Hata toplama için seçilebilecek üç mod vardır: `false`, `minimal` ve `full`. Bu, anahtar `collectErrors` ile _Listr_ seçeneklerinde her _Görev_ için ayarlanabilir. Varsayılan mod `false` 'dır çünkü bunun en az kullanılan işlevsellik olduğunu düşünüyorum ve bu nedenle bazı bellek tasarrufu sağlaması için en azından isteğe bağlı olmalıdır.

`ListrError` oluşturma sürecinden kaynaklanan potansiyel bellek sızıntıları nedeniyle, önerilen mod `minimal`dır; bu, yalnızca hatanın nerede meydana geldiği, ne zaman karşılaşıldığı ve `error.message` 'in ne olduğu bilgilerini toplayacaktır.

Tam hata bilgilerini ayrıntılı incelemek istiyorsanız, modu `full` olarak ayarlayabilirsiniz. Bu aynı zamanda mevcut bağlamı ve görevi `ListrError` 'a klonlayacaktır.

Hata toplama işlemini tamamen devre dışı bırakmak için bunu `false` olarak ayarlayabilirsiniz.

### ListrError

`ListrError` sınıfı varsayılan `Error`'ı genişletir ve hatanın kaynağını ve nereden geldiği gibi bazı ek bilgileri barındırır; ayrıca yürütme sırasında sorunu daha fazla çözmek için donmuş bir bağlamı içerir.

### ListrErrorTypes

Bir listr hatası, birçok sebepten kaynaklanabilir; bu nedenle, belirli bir hatanın neden meydana geldiğine dair daha iyi bir açıklama sağlamak için `ListrError` içinde `type` özelliği, enum biçiminde `ListrErrorTypes` olarak bulunur.

### Metodoloji

`tasks.error` dizisinin sırası, karşılaşılan hataların sırasını temsil eder.

Hata toplama mekanizmasını basit ve öngörülebilir tutmak için, alt görevlerden gelen hataları da işlemeyi gerektirebilir.

Örneğin, aşağıdaki örnek belirli bir zihniyetle ilgili bazı şeyleri açıklığa kavuşturacaktır.

::: details Kod

<<< @../../examples/docs/task/error-handling/collection.ts

:::

::: details Çıktı

<<< @../../examples/docs/task/error-handling/collection.output.txt{bash}

:::

::: details Akış

- İlk hata, ilk görevden fırlatılacaktır. `exitOnError`, o bağlamda `false` olduğu için, `ListrError` `tasks.errors` tarafından toplanır ve değer `{ message: '1', type: ListrErrorTypes.HAS_FAILED_WITHOUT_ERROR }` olacaktır.
- Ardından, iki alt görevi olan ikinci göreve geri dönecektir.
- Alt görevlerin ilk görevi başarısız olacağından ve o bağlamda `exitOnError` `true` olarak ayarlandığı için, o alt görev başarısız olacak ve fırlatılacaktır. `ListrError`, `tasks.errors` 'a eklenecek ve değeri `{ message: '3', type: ListrErrorTypes.HAS_FAILED }` olacaktır.
- Alt görev çöktüğü için, alt görevlerde gelecek görevleri yerine getirmeyecektir.
- Ana görev listesine geri döner ve listeden 3. görevi yerine getirecektir. İlk görev ile aynı davranışı göstererek, `ListrError` değeri `{ message: '2', type: ListrErrorTypes.HAS_FAILED_WITHOUT_ERROR }` olacaktır.

:::