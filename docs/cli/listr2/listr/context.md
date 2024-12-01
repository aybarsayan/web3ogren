---
description: Bu belge, `listr2` görev listeleri ile ilgili bağlam kavramını ve bağlam değişkeninin nasıl kullanılacağını açıklamaktadır. Kullanımını ve ekleme yöntemlerini ayrıntılı bir şekilde ele alır.
keywords: [listr2, bağlam, görev listesi, ListrContext, değişken yönetimi, programlama, yazılım geliştirme]
---



Bir `listr2` görev listesi çalıştırırken, çalışmakta olan görevler arasında paylaşılan bir değişken olan `ctx` mevcut. Bu, diğer programlama dillerindeki paylaşılan bağlamlarla aynı temel fikre sahiptir.



## Bağlam Değişkeni

Bağlam, görev listesi boyunca paylaşılan bir nesnedir. Dış değişkenler aynı işlemi gerçekleştirmek için kullanılabilse de, bağlam, iç görevleri işlemek için kendine yeterli bir yol sağlar.

> **Bağlam, varsayılan olarak `any` türünde olan `ListrContext` türünü karşılayan herhangi bir şey olabilir; ancak, görev boyunca değiştirilebilir bir yapı olarak kullanılma niyeti nedeniyle bir nesne olması önerilir.**  
> — Listr Belgelendirmesi

Bağlam türü, görev boyunca hangi türün kullanıldığını sınırlamak ve tür güvenliğini sağlamak için Listr sınıfına bir tür parametresi olarak eklenebilir.

- Başarılı bir görev, daha ileri işlemler için bağlamı döndürür.
- Bağlam, görev listesini oluştururken veya görev listesini çalıştırırken dışarıdan eklenebilir.
- Bir hata ile karşılaşıldığında, o andaki bağlam, sorunu daha iyi anlamayı sağlamak için dondurulmuş bir nesne olarak kaydedilir.

::: info İpucu

Tüm görevler aynı görev listesinde bulunuyorsa, bağlam otomatik olarak tüm alt görevlere eklenir.

:::

## Bağlam Ekleme

### Bağlamı Seçenek Olarak Eklemek

Bağlam, _Listr_ için bir seçenek olarak eklenebilir.



Bu, alt görevlere farklı bir bağlam eklemek için de kullanılabilir. Örneğin, yalnızca alt görev bağlamında kullanmak istediğiniz bir dizi değişkeniniz olduğunu varsayalım; o zaman bunu seçenek aracılığıyla geçirebilirsiniz. Bu değişken, alt görevler tamamlandığında otomatik olarak bellekten silinecektir. Dolayısıyla, bazı değerleri sonsuza kadar kaybolmadan önce döndürmek istiyorsanız, bunları ana bağlama atayabilirsiniz çünkü erişilebilir.

::: details  Kod Örneği

<<< @../../examples/docs/listr/context/multiple-contexts.ts

:::

### Çalışma Zamanında Bağlam Ekleme

<<< @../../examples/docs/listr/context/at-runtime.ts{8}

## Bağlamı Alma

### Görev Dönüş Değeri Olarak

Başarılı bir görev, her zaman görevin sonunda bağlamı döndürür.

<<< @../../examples/docs/listr/context/retrieve-return.ts{11,13}

### Görev Listesinin Özelliği Olarak

Kök _Listr_ sınıfı kendisi, bağlam değerini kamuya açık bir özellik olarak tutar.

<<< @../../examples/docs/listr/context/retrieve-property.ts{6,13}