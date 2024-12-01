---
description: Yığılmış çubuklar, animasyonlu arka planlar ve metin etiketleri desteği ile Bootstrap özel ilerleme çubukları kullanımı için belgeler ve örnekler.
keywords: [Bootstrap, ilerleme çubuğu, CSS, animasyon, yardımcı sınıflar]
---

## Nasıl çalışır

İlerleme bileşenleri, genişliği ayarlamak için bazı CSS ve birkaç öznitelikle iki HTML öğesi ile oluşturulmuştur. [HTML5 `` öğesini](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) kullanmıyoruz, böylece ilerleme çubuklarını sıkıştırabilir, animasyonlayabilir ve üzerine metin etiketleri yerleştirebilirsiniz.

- İlerleme çubuğunun maksimum değerini belirtmek için `.progress` sarmalayıcıyı kullanıyoruz.
- Şu ana kadar olan ilerlemeyi belirtmek için içteki `.progress-bar`'ı kullanıyoruz.
- `.progress-bar`, genişliğini ayarlamak için bir satır içi stil, yardımcı sınıf veya özel CSS gerektirir.
- `.progress-bar`, erişilebilir hale getirmek için bazı `role` ve `aria` özniteliklerine de ihtiyaç duyar.

:::tip
**İpucu:** İlerleme çubuklarının görünümünü geliştirmek için CSS değişiklikleri yapabilirsiniz.
:::

Tüm bunları bir araya getirince aşağıdaki örnekleri elde edersiniz.

  


  


  


  


  

Bootstrap, `genişliği ayarlamak için bir dizi yardımcı sınıflar` sunar. İhtiyaçlarınıza bağlı olarak, bunlar ilerlemeyi hızlı bir şekilde yapılandırmanıza yardımcı olabilir.

:::info
**Not:** Bootstrap yardımcı sınıflarını kullanarak ilerleme çubuklarınızı hızlıca özelleştirebilirsiniz.
:::

  

## Etiketler

İlerleme çubuklarınıza metin yerleştirerek etiket ekleyin.

  25%

## Yükseklik

Yalnızca `.progress` üzerinde bir `height` değeri ayarlıyoruz, bu nedenle bu değeri değiştirirseniz içteki `.progress-bar` otomatik olarak uygun şekilde boyutlanır.

  


  

## Arka planlar

Bireysel ilerleme çubuklarının görünümünü değiştirmek için arka plan yardımcı sınıflarını kullanın.

  


  


  


  

## Birden fazla çubuk

İhtiyacınız varsa bir ilerleme bileşeninde birden fazla ilerleme çubuğu ekleyin.

  
  
  

## Çizgili

Herhangi bir `.progress-bar`'a `.progress-bar-striped` ekleyerek ilerleme çubuğunun arka plan rengine CSS gradyanı ile çizgi ekleyin.

  


  


  


  


  

## Animasyonlu çizgiler

Çizgili gradyanı da animasyonlu hale getirebilirsiniz. `.progress-bar`'a animasyon, çizgileri sağa sola hareket ettirmek için `.progress-bar-animated` ekleyin.

  

## İlerleme grubu

  
    
      Başlık
    
  
  
    
      
    
    
      
    
  


  
    
      Başlık
    
  
  
    
      
    
    
      
    
    
      
    
  


  
    
      Başlık
    
  
  
    
      
    
    
      
    
    
      
    
    
      
    
  

  
    
    Erkek
    43%
  
  
    
      
    
  

  
    
    Organik Arama
    191.235
    (56%)
  
  
    
      
    
  

## Özelleştirme

### CSS değişkenleri

İlerleme çubukları, geliştirilmiş gerçek zamanlı özelleştirme için `.progress` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenleri için değerler SASS aracılığıyla ayarlanır, bu nedenle Sass özelleştirmeleri de desteklenmektedir.

### SASS değişkenleri

### Anahtar çerçeveler

`.progress-bar-animated` için CSS animasyonlarını oluşturmak için kullanılır. `scss/_progress-bar.scss` içinde yer alır.

