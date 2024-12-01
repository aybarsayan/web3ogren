---
title: İşlem Çıkışı
description: Bu belge, ProcessOutput, ProcessOutputStream ve ProcessOutputBuffer hakkında bilgi sağlamaktadır. Günlükleme süreçlerini ve çıktıları nasıl yöneteceğinize dair detayları içerir.
keywords: [ProcessOutput, günlükleme, stdout, stderr, Listr, JavaScript, çıktı yönetimi]
order: 110
tag:
  - ileri
  - çıktı
category:
  - günlük
---



`ProcessOutput`, `ProcessOutputStream`, `ProcessOutputBuffer`, _ListrLogger_'ın konsola yazılan başka bir şey olmamasını sağlamak ve gerektiğinde `process.stdout` ve `process.stderr` erişimi için bir soyutlama oluşturmak için geçerli `stdout` ve `stderr`'yi kontrol etmek için kullanılır.





## Ele Geçirme

Güncellemeye ihtiyaç duyan _DefaultRenderer_ gibi render için `ProcessOutput`, geçerli `process.stdout` ve `process.stderr`'yi ele geçirme yeteneği sağlayarak, terminale yazmaya çalışan her şeyi depolamak için geçici bir tampon oluşturur, çünkü bu, _Listr_'ın çıktısını bozar. 

:::info 
Renderer terminal çıktısını ele geçirmeyi talep etmezse, `process.stdout` ve `process.stderr` doğrudan herhangi bir hile olmadan kullanılacaktır.
:::

## Serbest Bırakma

Renderer _ProcessOutput_'u serbest bıraktığında ve kullanıma hazır olarak işaretlediğinde, yakalanan akışlara gönderilmiş olan her şey dökülecektir. **Bu, yüzyıllar boyunca deposunda bir sorunun açılmasının en yaygın nedenini çözmeyi amaçlar; yani çıktının bozulduğunu söylemek ve terminale başka bir şeyin yazılmakta olduğunu fark etmemek.**

## İşlem Çıktısını Genişletme

Varsayılan _ProcessOutput_'u, beklediğiniz davranış ile sınıfı genişleterek geçersiz kılabilirsiniz (örn. bir günlük dosyasına yazmak) çünkü ele geçirme fonksiyonunu kullanan veya kullanmayan tüm render'lar, _ListrLogger_ aracılığıyla _ProcessOutput_'u kullanır. Çoğu durumda, `process.stdout` ve `process.stderr` için kendi `WriteStream`'inizi geçirerek `new ProcessOutput()` oluşturmak yeterli olacaktır.

### Davranışı Değiştirme



_Davranışı Değiştirme_ için logger'a enjekte ederek _ProcessOutput_'un davranışını değiştirebilirsiniz. Her render bir seviyede temel logger'ı kullandığı için, bu etkili bir şekilde ProcessOutput'un davranışını değiştirmek için kullanılabilir.

> Eğer _ProcessOutput_'un davranışını beğenmiyorsanız, her zaman kendi uygulamanızı bu arayüz aracılığıyla uygulayıp getirebilirsiniz.  
> — Kendi Yazılım Ekibiniz

::: details  Kod Örneği

<<< @../../examples/docs/renderer/process-output/change-behavior.ts

:::