---
title: Örnekler
order: 15
description: Bu içerik, `listr2` uygulamasının kullanımına dair birçok örneği ve testleri içermektedir. Belgelerin yetersiz kaldığı durumlarda kullanıcıların başvurabileceği önemli kaynakları sunmaktadır.
keywords: [listr2, örnekler, testler, kullanım, belgeler]
---



`listr2`, uygulamanın kullanımına dair daha fazla bilgi edinebileceğiniz birçok örneği depoda barındırır; bu, belgelerin ileri düzey durumlar için yetersiz kaldığı durumlarda geçerlidir.

:::info
Örneklerin bulunabileceği klasörler ve bu örneklerin çalıştırılma yöntemleri aşağıda detaylandırılmıştır.
:::

## Örnekler

Örnekler [`./examples/`](https://github.com/listr2/listr2/tree/master/examples) klasöründe yer almakta olup, hepsi çalışır durumdaki örnekler olduğu için **kendi ortamınızda** çalıştırılabilir.

Belgeler ayrıca birçok örnek içermektedir; bu örnekler de [`./examples/docs/`](https://github.com/listr2/listr2/tree/master/examples/docs) klasöründe çalıştırılabilir/incelemek için kullanılabilir.

Eğer depoyu klonlamaya karar verirseniz, yeni şeyler öğrenmek veya denemek için `ts-node` ile tüm örnekleri yerel ortamınızda çalıştırabilirsiniz.

```bash
# depoyu klonla
git clone git@github.com:cenk1cenk2/listr2.git

# bağımlılıkları yükle
pnpm install

# herhangi bir örneği çalıştır, script'e deponun görece yolunu vererek
pnpm run --filter example start renderer-default.example.ts
```

## `jsdoc`

Her bir açık alternatif, örneklerde eksikse kısa bir açıklama içermektedir. 

:::tip
Örnekle ilgili kısa açıklamalar ile birlikte, seçeneklerin anlamı ve kullanımı hakkında bilgi paylaşılmaktadır.
:::

## Testler

Örneklerin yetersiz kaldığı durumlarda, [`./tests/`](https://github.com/listr2/listr2/tree/master/tests) klasöründe yer alan **testler** klasörüne daha derinlemesine dalabilirsiniz. 

Bu uygulama, **kenar koşulları** için genellikle iyi bir şekilde test edilmiştir; ancak esasen bir terminal uygulaması olduğundan sınırlıdır. Ne yazık ki testler sırasında terminal taklit edildiği için değişikliklerinizi doğrudan testler üzerinde göremezsiniz, ancak orada verilen örneklerde **daha fazla derinlemesine inceleme** yapabilirsiniz.