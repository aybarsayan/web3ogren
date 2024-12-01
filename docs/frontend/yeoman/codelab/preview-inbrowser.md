---
description: Bu kılavuzda, yerel web sunucusu kurmadan uygulamanızı tarayıcıda nasıl önizleyeceğinizi ve canlı yeniden yükleme ile geliştirme sürecinizi nasıl hızlandıracağınızı öğrenin.
keywords: [web tarayıcısı, yerel web sunucusu, canlı yeniden yükleme, npm, Browsersync]
---

# Website İçi Preview

Favori web tarayıcınızda web uygulamanızı önizlemek için bilgisayarınızda yerel bir web sunucusu kurmanız gerekmez; bu Yeoman'ın bir parçasıdır.

## Sunucuyu başlat

Aşağıdaki komutu yazarak [localhost:3000](http://localhost:3000) (ya da bazı yapılandırmalar için [127.0.0.1:3000](http://127.0.0.1:3000)) üzerinde yerel, Node tabanlı bir http sunucusu oluşturmak için bir npm betiği çalıştırın:

```sh
npm run serve
```

Web tarayıcınızda [localhost:3000](http://localhost:3000) adresinde yeni bir sekme açın:

![](../../images/cikti/yeoman/assets/img/codelab/05_run_preview.png)

## Sunucuyu durdur

Eğer sunucuyu durdurmanız gerekirse, mevcut CLI işleminizi sonlandırmak için Ctrl+C klavye kısayolunu kullanın.

:::warning
Not: Aynı portta (varsayılan 3000) birden fazla http sunucusu çalıştıramazsınız.
:::

## Dosyalarınızı izleyin

Favori metin editörünüzü açın ve değişiklik yapmaya başlayın. Her kaydetme, hemen bir tarayıcı yenilemesi ile sonucu gösterecektir, bu nedenle bunu kendiniz yapmanıza gerek yoktur. Buna *canlı yeniden yükleme* denir ve uygulamanızın durumunu gerçek zamanlı olarak görmenin güzel bir yoludur.

> Canlı yeniden yükleme, `gulpfile.js` dosyasında yapılandırılmış bir dizi Gulp görevi ve `gulp_tasks/browsersync.js` dosyasında yapılandırılmış [Browsersync](https://www.browsersync.io/) aracılığıyla uygulamanıza sunulur; bu, dosyalarınızı izler ve bir değişiklik algıladığında otomatik olarak yeniden yükler.  
> — Geliştirme İpuçları

Aşağıda, *src/app/components* dizininde *Header.js* dosyasını düzenledik. Canlı yeniden yükleme sayesinde bu durumdan şu duruma geçtik:

![](../../images/cikti/yeoman/assets/img/codelab/05_before_live_reload.png)

Anında şu duruma:

![](../../images/cikti/yeoman/assets/img/codelab/05_after_live_reload.png)



  Test etmeyi unutmayın!

  Bir TodoMVC uygulamanız var, test edilmiş ve başlık kısmını değiştiriyorsunuz. `mytodo/src/app/components/Header.spec.js` dosyasında testi düzenlemeli **veya** canlı yeniden yüklemeyi göstermek için değişikliği geri almanız gerekir.




 Genel bakıma dön
  veya
  Sonraki adıma geç 
