---
title: Listr
description: Listr, durum bilgisi olan bir görev listesi oluşturmak için kullanılan bir sınıf. Bu içerik, Listr sınıfının nasıl kullanılacağını ve görev listesinin nasıl çalıştırılacağını açıklar.
keywords: [Listr, görev listesi, sınıf, async, TypeScript]
order: 20
tag:
  - zorunlu
  - temel
category:
  - listr
---



`listr2`, durum bilgisi olan bir görev listesi olduğundan, sınıflara dayanır. Yeni bir görev listesi oluşturmak için önce `Listr` sınıfının bir örneğini oluşturmalısınız.

:::tip
Görev listelerinizi yönetmek için Listr sınıfını kullanın. Bu, projelerinizi düzenli tutmanıza yardımcı olacaktır.
:::



## Yeni Sınıf Oluştur

Prototipten yeni bir görev listesi içe aktarın ve oluşturun. Oluşturulan `Listr` sınıfını döndürecektir.

 **Unutmayın:** Yalnızca Listr sınıfının bir örneğini oluşturduktan sonra, görevlerinizi tanımlayıp çalıştırabilirsiniz.  
> — Başka bir kaynak

## Oluşturulan Görev Listesini Çalıştır

Sonra bu görev listesini bir `async` fonksiyonu olarak çalıştırabilirsiniz ve sonuç olarak, görevler aracılığıyla bağlamı döndürecektir.

<<< @../../examples/docs/listr/new-listr/creating-a-new-instance.ts#run{2}

:::info
Async fonksiyonlar, görev listesinin tamamlanmasını bekleyerek daha etkili bir şekilde çalışmanıza olanak tanır.
:::