---
title: Proje Hedefleri
description: "Preact'ın proje hedefleri hakkında daha fazla bilgi edinin. Projenin performansı, boyutu, verimliliği vb. konularını keşfedin."
keywords: [Preact, proje hedefleri, performans, boyut, uyumluluk]
---

# Preact'ın Hedefleri

## Hedefler

Preact birkaç temel hedefe ulaşmayı amaçlamaktadır:

- **Performans:** Hızlı ve verimli bir şekilde render edin
- **Boyut:** Küçük boyut, hafif _(yaklaşık 3.5 kB)_
- **Verimlilik:** Etkili bellek kullanımı _(GC thrash kaçınma)_
- **Anlaşılabilirlik:** Kod tabanını anlamak birkaç saatten fazla sürmemelidir
- **Uyumluluk:** Preact, React API'si ile _genellikle uyumlu_ olmayı hedeflemektedir. [preact/compat] mümkün olduğunca React ile uyumluluk sağlamayı amaçlamaktadır.

## Olmayan Hedefler

:::warning
Bazı React özellikleri, yukarıda listelenen temel proje hedeflerine ulaşırken elde edilemeyecekleri veya Preact'ın temel işlevsellik kapsamına uymadığı için Preact'tan kasıtlı olarak çıkarılmıştır.
:::

`React ile Farklar` altındaki kasıtlı maddeler:

- `PropTypes`, ayrı bir kütüphane olarak kolayca kullanılabilir
- `Children`, yerel dizilerle değiştirilebilir
- `Süsyntetik Olaylar`, çünkü Preact, IE8 gibi eski tarayıcılardaki sorunları çözmeyi hedeflememekte

:::tip
Bu hedefler, Preact'ın hedeflediği performans ve verimlilik seviyelerine ulaşmasını sağlamaktadır. Kullanıcı deneyimini geliştirmek için önerilen en iyi uygulamaları göz önünde bulundurun.
:::

[preact/compat]: /guide/v10/switching-to-preact