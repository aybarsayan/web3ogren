---
title: Alt Görevler
description: Alt görevler, Listr uygulamalarında katmanlı yapıların oluşturulmasına olanak tanır. Bu içerikte, alt görevlerin nasıl kullanılacağı ve varsayılan davranışların nasıl değiştirileceği hakkında bilgi bulabilirsiniz.
keywords: [alt görevler, Listr, görev, yazılım, örnekler]
order: 10
tag:
  - temel
  - akış
category:
  - görev
---



> `listr2`, alt görevleri kullanarak sonsuz derinlikte katmanlı hale getirilebilir; bu, tasarımın temel parçasıdır.  
> — Belgeler



Bir _Görev_, yeni bir _Listr_ döndürebilir. Ancak, ana görevin seçilen render'ına bağlı olarak tam otomatik tamamlama özelliklerini elde etmek için `new Listr` çağrısı yapmak yerine, uygulamanın çalışmasını sağlayan bileşenleri paylaştıkları için bunun _Görev_ üzerinden `task.newListr()` ile çağrılması zorunludur.

Alt görevler, terminal genişliği yeterli olduğu sürece sonsuz derinlikte katmanlı hale getirilebilir. Alt görevler, benzer görevleri gruplayarak, belirli bir görev seti için _Listr_'ın davranışını değiştirerek veya belirli görevler tamamlandığında render alanını temizleyerek avantaj sağlar.

## Kullanım

 Kod Örneği



Alt görevlerden ana görev sınıfına, `task.newListr`'ye `(parent) => Listr` işlev imzasını geçirerek erişebilirsiniz. Bu şekilde, ana görevin başlığını değiştirebilir veya onun işlevselliğine erişebilirsiniz.

::: details  Kod Örneği

<<< @../../examples/docs/task/subtasks/access-parent-task.ts{9,15}

:::

---