---
title: Kurulum
description: Bu belge, Vue CLI'nin kurulum sürecini ve güncellemelerini açıklamaktadır. Node.js sürüm gereksinimleri ve global paketlerin nasıl güncelleneceği hakkında bilgi verir.
keywords: [Vue CLI, Node.js, kurulum, güncelleme, proje bağımlılıkları]
---

# Kurulum

::: tip Node Sürüm Gereksinimi
Vue CLI 4.x, [Node.js](https://nodejs.org/) sürüm 8.9 veya üzerini (v10+ tavsiye edilir) gerektirir. Aynı makinede birden fazla Node sürümünü [n](https://github.com/tj/n), [nvm](https://github.com/creationix/nvm) veya [nvm-windows](https://github.com/coreybutler/nvm-windows) ile yönetebilirsiniz.
:::

Yeni paketi kurmak için aşağıdaki komutlardan birini kullanın. Bunları çalıştırmak için yönetici haklarına ihtiyacınız var, eğer npm sisteminizde bir Node.js sürüm yöneticisi (örneğin n veya nvm) aracılığıyla kurulu değilse.

```bash
npm install -g @vue/cli
# VEYA
yarn global add @vue/cli
```

Kurulumdan sonra, komut satırında `vue` ikili dosyasına erişiminiz olacak. Doğru bir şekilde kurulduğunu doğrulamak için basitçe `vue` komutunu çalıştırabilirsiniz; bu, mevcut tüm komutları listeleyen bir yardım mesajı sunar.

> Doğru versiyona sahip olup olmadığınızı kontrol etmek için bu komutu kullanabilirsiniz:
>
> ```bash
> vue --version
> ```
> — Vue CLI Kullanım Kılavuzu

---

### Güncelleme

Küresel Vue CLI paketini güncellemek için şu komutu çalıştırmalısınız:

```bash
npm update -g @vue/cli

# VEYA
yarn global upgrade --latest @vue/cli
```

#### Proje Bağımlılıkları

Yukarıda gösterilen güncelleme komutları küresel Vue CLI kurulumuna uygulanır. Projeniz içinde `@vue/cli` ile ilgili bir veya daha fazla paketi (örneğin `@vue/cli-plugin-` veya `vue-cli-plugin-` ile başlayan paketler) güncellemek için proje dizininde `vue upgrade` komutunu çalıştırın:

```
Kullanım: upgrade [opsiyonlar] [plugin-ismi]

(deneysel) vue cli servis / eklentileri güncelle

Opsiyonlar:
  -t, --to <sürüm>    <plugin-ismi> için en son sürüm olmayan bir sürüme güncelle
  -f, --from <sürüm>  Yüklenmiş eklentiyi sorgulamayı atla, belirtilen sürümden güncellendiğini varsay
  -r, --registry <url>  Bağımlılıkları kurarken belirtilen npm kayıt defterini kullan
  --all                 Tüm eklentileri güncelle
  --next                Güncellemeler sırasında alpha / beta / rc sürümlerini de kontrol et
  -h, --help            kullanım bilgisi çıktısı
``` 