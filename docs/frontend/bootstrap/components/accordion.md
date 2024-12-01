---
layout: docs
title: Akordeon
description: Çökme JavaScript eklentimizle birlikte dikey olarak çökme akordeonları oluşturun. Bu içerikte, akordeon bileşeninin nasıl yapılandırılacağına dair bilgiler bulacaksınız.
keywords: [akordeon, çökme, bileşen, erişilebilirlik, CSS değişkenleri]
---

## Nasıl Çalışır

Akordeon, çökme işlevselliği sağlamak için içsel olarak `collapse` kullanır.

:::info
Bu içerikte akordeon özellikleri hakkında önemli bilgiler bulacaksınız.
:::

Aşağıdaki akordeonlara tıklayarak akordeon içeriğini genişletebilir veya daraltabilirsiniz.

Varsayılan olarak genişletilmiş bir akordeon oluşturmak için:
- `.accordion-collapse` öğesine `.show` sınıfını ekleyin.
- `.accordion-button` öğesinden `.collapsed` sınıfını çıkarın ve `aria-expanded` niteliğini `true` olarak ayarlayın.

:::tip
Görselliği artırmak ve kullanıcı deneyimini iyileştirmek için akordeon bileşeni ile ilgili en iyi uygulamaları takip edin.
:::

  
    
      
        Akordeon Öğesi #1
      
    
    
      
        Bu, birinci öğenin akordeon gövdesidir. Varsayılan olarak gösterilir, ta ki çökme eklentisi her öğeyi stillendirmek için kullandığımız uygun sınıfları ekleyene kadar. Bu sınıflar genel görünümü kontrol eder ve CSS geçişleri aracılığıyla gösterim ve saklama işlevini sağlar. "Bunun herhangi bir kısmını özel CSS ile veya varsayılan değişkenlerimizi geçersiz kılmak suretiyle değiştirebilirsiniz." — Akordeon Bileşeni
      
    
  
  
    
      
        Akordeon Öğesi #2
      
    
    
      
        Bu, ikinci öğenin akordeon gövdesidir. Varsayılan olarak gizlidir, ta ki çökme eklentisi her öğeyi stillendirmek için kullandığımız uygun sınıfları ekleyene kadar. Bu sınıflar genel görünümü kontrol eder ve CSS geçişleri aracılığıyla gösterim ve saklama işlevini sağlar.
      
    
  
  
    
      
        Akordeon Öğesi #3
      
    
    
      
        Bu, üçüncü öğenin akordeon gövdesidir. Varsayılan olarak gizlidir, ta ki çökme eklentisi her öğeyi stillendirmek için kullandığımız uygun sınıfları ekleyene kadar. Bu sınıflar genel görünümü kontrol eder ve CSS geçişleri aracılığıyla gösterim ve saklama işlevini sağlar.
      
    
  

### Flush

Varsayılan `background-color`, bazı kenar boşluklarını ve bazı yuvarlak köşeleri kaldırmak için `.accordion-flush` ekleyin, bu sayede akordeonlar ebeveyn konteynerleriyle kenar kenara yapılır.

:::note
Bu özelliği kullanarak akordeonlarınızın daha sade ve minimalist görünmesini sağlayabilirsiniz.
:::

  
    
      
        Akordeon Öğesi #1
      
    
    
      <div class="accordion-body">Bu akordeonun yer tutucu içeriği, .accordion-flush sınıfını sergilemek için tasarlandı. Bu, birinci öğenin akordeon gövdesidir.
    
  
  
    
      
        Akordeon Öğesi #2
      
    
    
      <div class="accordion-body">Bu akordeonun yer tutucu içeriği, .accordion-flush sınıfını sergilemek için tasarlandı. Bu, ikinci öğenin akordeon gövdesidir. Bunu bazı gerçek içeriklerle doldurduğumuzu düşünelim.
    
  
  
    
      
        Akordeon Öğesi #3
      
    
    
      <div class="accordion-body">Bu akordeonun yer tutucu içeriği, .accordion-flush sınıfını sergilemek için tasarlandı. Bu, üçüncü öğenin akordeon gövdesidir. İçerik açısından burada daha heyecan verici bir şey yok ama sadece alanı doldurmak için burada, en azından ilk bakışta, gerçek bir uygulamada nasıl görüneceğini biraz daha temsil edebilir.
    
  

### Her Zaman Açık

Her bir `.accordion-collapse` üzerinde `data-coreui-parent` niteliğini atlayarak akordeon öğelerinin başka bir öğe açıldığında açık kalmasını sağlayabilirsiniz.

  
    
      
        Akordeon Öğesi #1
      
    
    
      
        <strong>Bu, birinci öğenin akordeon gövdesidir.</strong> Varsayılan olarak gösterilir, ta ki çökme eklentisi her öğeyi stillendirmek için kullandığımız uygun sınıfları ekleyene kadar. Bunun herhangi bir kısmını özel CSS ile veya varsayılan değişkenlerimizi geçersiz kılmak suretiyle değiştirebilirsiniz. Ayrıca, .accordion-body içinde neredeyse her türlü HTML'nin kullanılabileceğini not etmek gerekir; ancak geçişler taşmayı sınırlar.
      
    
  
  
    
      
        Akordeon Öğesi #2
      
    
    
      
        <strong>Bu, ikinci öğenin akordeon gövdesidir.</strong> Varsayılan olarak gizlidir, ta ki çökme eklentisi her öğeyi stillendirmek için kullandığımız uygun sınıfları ekleyene kadar. Bunun herhangi bir kısmını özel CSS ile veya varsayılan değişkenlerimizi geçersiz kılmak suretiyle değiştirebilirsiniz. Ayrıca, .accordion-body içinde neredeyse her türlü HTML'nin kullanılabileceğini not etmek gerekir; ancak geçişler taşmayı sınırlar.
      
    
  
  
    
      
        Akordeon Öğesi #3
      
    
    
      
        <strong>Bu, üçüncü öğenin akordeon gövdesidir.</strong> Varsayılan olarak gizlidir, ta ki çökme eklentisi her öğeyi stillendirmek için kullandığımız uygun sınıfları ekleyene kadar. Bunun herhangi bir kısmını özel CSS ile veya varsayılan değişkenlerimizi geçersiz kılmak suretiyle değiştirebilirsiniz. Ayrıca, .accordion-body içinde neredeyse her türlü HTML'nin kullanılabileceğini not etmek gerekir; ancak geçişler taşmayı sınırlar.
      
    
  

## Erişilebilirlik

Daha fazla bilgi için lütfen `collapse erişilebilirlik bölümünü` okuyun.

## Özelleştirme

### CSS değişkenleri

Akordeonlar, geliştirilmiş gerçek zamanlı özelleştirme için .accordion üzerinde yerel CSS değişkenleri kullanır. CSS değişkenlerinin değerleri Sass aracılığıyla ayarlanır, bu nedenle Sass özelleştirmesi de hala desteklenir.

### SASS değişkenleri
