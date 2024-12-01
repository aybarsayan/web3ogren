---
layout: docs
title: Yer Tutucu
description: Yer tutucular, uygulamanızın deneyimini geliştirmek için kullanılır ve yalnızca HTML ve CSS ile oluşturulabilir. Bu kılavuz, yer tutucuların nasıl kullanılacağını ve özelleştirileceğini açıklar.
keywords: [yer tutucu, bileşen, HTML, CSS, yükleme, animasyon]
---

## Hakkında

Yer tutucular, uygulamanızın deneyimini geliştirmek için kullanılabilir. Sadece HTML ve CSS ile oluşturulmuşlardır, bu nedenle bunları oluşturmak için hiçbir JavaScript'e ihtiyacınız yoktur. Ancak, görünürlüklerini değiştirmek için bazı özel JavaScript'e ihtiyacınız olacak. **Görünüm, renk ve boyutları**, yardımcı sınıflarımızla kolayca özelleştirilebilir.

## Örnek

Aşağıdaki örnekte, tipik bir kart bileşenini alıyor ve yer tutucularla "yükleme kartı" oluşturmak için yeniden oluşturuyoruz. Boyut ve oranlar her iki bileşen için aynıdır.



  
  
    Kart başlığı
    Kart başlığını oluşturmak ve kartın içeriğini oluşturan bazı hızlı örnek metinler.
    Bir yere git
  



  
  
    
      
    
    
      
      
      
      
      
    
    
  



```html
<div class="card">
  <img src="..." class="card-img-top" alt="...">

  <div class="card-body">
    <h5 class="card-title">Kart başlığı</h5>
    <p class="card-text">Kart başlığını oluşturmak ve kartın içeriğini oluşturan bazı hızlı örnek metinler.</p>
    <a href="#" class="btn btn-primary">Bir yere git</a>
  </div>
</div>

<div class="card" aria-hidden="true">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title placeholder-glow">
      <span class="placeholder col-6"></span>
    </h5>
    <p class="card-text placeholder-glow">
      <span class="placeholder col-7"></span>
      <span class="placeholder col-4"></span>
      <span class="placeholder col-4"></span>
      <span class="placeholder col-6"></span>
      <span class="placeholder col-8"></span>
    </p>
    <a class="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
  </div>
</div>
```

:::info
Yer tutucular, içerik yüklenirken kullanıcıların bekleme süresini hissettirmemek için etkili bir yöntemdir.
:::

## Nasıl çalışır

Yer tutucuları, `width`'i ayarlamak için `.placeholder` sınıfını ve bir grid kolon sınıfını (örneğin, `.col-6`) kullanarak oluşturun. Bir öğeden içindeki metni değiştirebilir veya mevcut bir bileşene modifiye sınıfı olarak ekleyebilirsiniz.

`.btn`'lere `::before` ile ek stil uyguluyoruz, böylece `height` saygı gösterilir. Bu kalıbı ihtiyaç duyduğunuz diğer durumlar için genişletebilir veya gerçek metin yerleştirildiğinde yüksekliği yansıtmak için öğe içine bir `&nbsp;` ekleyebilirsiniz.

  




`aria-hidden="true"` kullanımı, yalnızca öğenin ekran okuyucular için gizli olmasını sağlar. Yer tutucunun *yükleme* davranışı, yazarların yer tutucu stillerini nasıl kullanacağına, güncellemeyi nasıl planladıklarına vb. bağlıdır. **Yer tutucunun durumunu değiştirmek** ve AT kullanıcılarını güncelleme hakkında bilgilendirmek için bazı JavaScript kodları gerekebilir.
### Genişlik

`width`'i grid kolon sınıfları, genişlik yardımcı sınıfları veya satır içi stiller aracılığıyla değiştirebilirsiniz.



### Renk

Varsayılan olarak, `placeholder` `currentColor` kullanır. Bu, özel bir renk veya yardımcı sınıf ile geçersiz kılınabilir.


{{- range (index $.Site.Data "theme-colors") }}

{{- end -}}

### Boyutlandırma

`.placeholder`'ların boyutu, üst öğenin tipografik stiline dayanmaktadır. Bunları boyutlandırma modifiyerlarıyla özelleştirin: `.placeholder-lg`, `.placeholder-sm`, veya `.placeholder-xs`.




### Animasyon

Yer tutucuları, bir şeyin _aktif olarak_ yüklendiğini daha iyi iletmek için `.placeholder-glow` veya `.placeholder-wave` ile animasyon yapın.

  



  

## Özelleştirme

### SASS değişkenleri

