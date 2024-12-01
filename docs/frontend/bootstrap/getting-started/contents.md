---
layout: docs
title: İçindekiler
description: CoreUI'da nelerin bulunduğunu keşfedin, önceden derlenmiş ve kaynak kodu çeşitlerimizi dahil. Bu doküman, sunduğumuz CSS ve JS dosyalarının kapsamını göstermekte olup, hem geliştiricilere hem de tasarımcılara faydalı bilgiler sağlamaktadır.
keywords: [CoreUI, CSS, JavaScript, dağıtım, kaynak kodu]
---

## Önceden Derlenmiş CoreUI

İndirildikten sonra, sıkıştırılmış klasörü açın ve aşağıdaki gibi bir şey göreceksiniz:

> **Not:** Bu bilgi, README'de kasıtlı olarak tekrarlanmıştır. Burada yapılan değişiklikleri README'ye de kopyalayın, ancak `dist` klasörünü eklemeyi unutmayın.  
> — CoreUI Ekibi

```text
coreui/
├── css/
│   ├── coreui-grid.css
│   ├── coreui-grid.css.map
│   ├── coreui-grid.min.css
│   ├── coreui-grid.min.css.map
│   ├── coreui-grid.rtl.css
│   ├── coreui-grid.rtl.css.map
│   ├── coreui-grid.rtl.min.css
│   ├── coreui-grid.rtl.min.css.map
│   ├── coreui-reboot.css
│   ├── coreui-reboot.css.map
│   ├── coreui-reboot.min.css
│   ├── coreui-reboot.min.css.map
│   ├── coreui-reboot.rtl.css
│   ├── coreui-reboot.rtl.css.map
│   ├── coreui-reboot.rtl.min.css
│   ├── coreui-reboot.rtl.min.css.map
│   ├── coreui-utilities.css
│   ├── coreui-utilities.css.map
│   ├── coreui-utilities.min.css
│   ├── coreui-utilities.min.css.map
│   ├── coreui-utilities.rtl.css
│   ├── coreui-utilities.rtl.css.map
│   ├── coreui-utilities.rtl.min.css
│   ├── coreui-utilities.rtl.min.css.map
│   ├── coreui.css
│   ├── coreui.css.map
│   ├── coreui.min.css
│   ├── coreui.min.css.map
│   ├── coreui.rtl.css
│   ├── coreui.rtl.css.map
│   ├── coreui.rtl.min.css
│   └── coreui.rtl.min.css.map
└── js/
    ├── coreui.bundle.js
    ├── coreui.bundle.js.map
    ├── coreui.bundle.min.js
    ├── coreui.bundle.min.js.map
    ├── coreui.esm.js
    ├── coreui.esm.js.map
    ├── coreui.esm.min.js
    ├── coreui.esm.min.js.map
    ├── coreui.js
    ├── coreui.js.map
    ├── coreui.min.js
    └── coreui.min.js.map
```

Bu, CoreUI'nın en temel biçimidir: neredeyse her web projesinde hızlıca kullanılabilen önceden derlenmiş dosyalar. Derlenmiş CSS ve JS (`coreui.*`), ayrıca derlenmiş ve küçültülmüş CSS ve JS (`coreui.min.*`) sunuyoruz. [kaynak haritaları](https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps) (`coreui.*.map`) belirli tarayıcıların geliştirici araçlarıyla kullanılmak üzere mevcuttur. Paketlenmiş JS dosyaları (`coreui.bundle.js` ve küçültülmüş `coreui.bundle.min.js`), [Popper](https://popper.js.org/) içerir.

## CSS dosyaları

Bootstrap için CoreUI, derlenmiş CSS'imizin bazılarının veya tümünün dahil edilmesi için birkaç seçenek sunmaktadır.

:::info Daha fazla bilgi için, CSS dosyalarının içeriğini detaylı bir biçimde inceleyebilirsiniz.


  
    
      CSS dosyaları
      Düzen
      İçerik
      Bileşenler
      Araçlar
    
  
  
    
      
        <div><code class="fw-normal text-nowrap">coreui.css
        <div><code class="fw-normal text-nowrap">coreui.rtl.css
        <div><code class="fw-normal text-nowrap">coreui.min.css
        <div><code class="fw-normal text-nowrap">coreui.rtl.min.css
      
      Dahil
      Dahil
      Dahil
      Dahil
    
    
      
        <div><code class="fw-normal text-nowrap">coreui-grid.css
        <div><code class="fw-normal text-nowrap">coreui-grid.rtl.css
        <div><code class="fw-normal text-nowrap">coreui-grid.min.css
        <div><code class="fw-normal text-nowrap">coreui-grid.rtl.min.css
      
      }}">Sadece grid sistemi
      &mdash;
      &mdash;
      }}">Sadece flex araçları
    
    
      
        <div><code class="fw-normal text-nowrap">coreui-utilities.css
        <div><code class="fw-normal text-nowrap">coreui-utilities.rtl.css
        <div><code class="fw-normal text-nowrap">coreui-utilities.min.css
        <div><code class="fw-normal text-nowrap">coreui-utilities.rtl.min.css
      
      &mdash;
      &mdash;
      &mdash;
      Dahil
    
    
      
        <div><code class="fw-normal text-nowrap">coreui-reboot.css
        <div><code class="fw-normal text-nowrap">coreui-reboot.rtl.css
        <div><code class="fw-normal text-nowrap">coreui-reboot.min.css
        <div><code class="fw-normal text-nowrap">coreui-reboot.rtl.min.css
      
      &mdash;
      }}">Sadece Reboot
      &mdash;
      &mdash;
    
  


## JS dosyaları

Benzer şekilde, derlenmiş JavaScript'imizin bazılarının veya tümünün dahil edilmesi için seçeneklerimiz mevcuttur.

:::tip JavaScript dosyalarının kullanımı hakkında ipuçları edinmek için lütfen dokümantasyonu kontrol edin.


  
    
      JS dosyaları
      Popper
    
  
  
    
      
        <div><code class="fw-normal text-nowrap">coreui.bundle.js
        <div><code class="fw-normal text-nowrap">coreui.bundle.min.js
      
      Dahil
    
    
      
        <div><code class="fw-normal text-nowrap">coreui.js
        <div><code class="fw-normal text-nowrap">coreui.min.js
      
      &mdash;
    
  


## CoreUI kaynak kodu

Bootstrap için CoreUI kaynak kodu indirme, önceden derlenmiş CSS ve JavaScript varlıklarının yanı sıra kaynak Sass, JavaScript ve belgeleri içerir. Daha spesifik olarak, aşağıdakileri ve daha fazlasını içerir:

```text
coreui/
├── dist/
│   ├── css/
│   └── js/
├── docs/
│   └──content/
├── js/
└── scss/
```

`scss/` ve `js/` CSS ve JavaScript'imizin kaynak kodudur. `dist/` klasörü, yukarıda belirtilen önceden derlenmiş indirme bölümünde listelenen her şeyi içerir. `docs/` klasörü, belgelerimiz için kaynak kodunu içerir. Bunun ötesinde, dahil edilen herhangi bir dosya, paketler, lisans bilgileri ve geliştirme desteği sağlar.