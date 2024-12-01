---
description: vue-cli için unit-mocha eklentisinin detaylarını ve kullanımını öğrenin. Birim testleri nasıl çalıştırılır ve seçenekler nelerdir? 
keywords: [vue, cli, unit, mocha, testing]
---

# @vue/cli-plugin-unit-mocha

> vue-cli için unit-mocha eklentisi

## Enjekte Edilen Komutlar

- **`vue-cli-service test:unit`**

  [mochapack](https://github.com/sysgears/mochapack) + [chai](http://chaijs.com/) ile birim testlerini çalıştırın.

  :::info
  **Testlerin Node.js içinde, JSDOM ile simüle edilmiş bir tarayıcı ortamında çalıştırıldığını unutmayın.**
  :::

  ```
  Kullanım: vue-cli-service test:unit [seçenekler] [...dosyalar]

  Seçenekler:

    --watch, -w   izleme modunda çalıştır
    --grep, -g    yalnızca <deseni> eşleşen testleri çalıştır
    --slow, -s    milisaniye cinsinden "yavaş" test eşiği
    --timeout, -t milisaniye cinsinden zaman aşımı eşiği
    --bail, -b    ilk test hatasından sonra çık
    --require, -r testleri çalıştırmadan önce verilen modülü gerektir
    --include     verilen modülü test paketine dahil et
    --inspect-brk testleri hata ayıklamak için denetleyiciyi etkinleştir
  ```

  Varsayılan dosya eşleşmeleri, `tests/unit` dizinindeki `.spec.(ts|js)` ile biten dosyalardır.

  :::tip
  Tüm [mochapack komut satırı seçenekleri](https://sysgears.github.io/mochapack/docs/installation/cli-usage.html) de desteklenmektedir.
  :::

## Zaten Oluşturulmuş Bir Projeye Kurulum

```bash
vue add unit-mocha
```