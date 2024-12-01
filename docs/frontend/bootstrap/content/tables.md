---
description: Bootstrap ile tabloların katılım stiline dair belgeler ve örnekler. İçinde yer alan bağlamsal sınıflar ve stiller hakkında bilgi sunar.
keywords: [Bootstrap, tablolar, CSS, kullanıcı arayüzü, responsive]
---

# Tablolar

## Genel Bakış

Üçüncü parti bileşenlerde, takvimler ve tarih seçim araçları gibi, `` öğelerinin yaygın kullanımı nedeniyle Bootstrap’ın tabloları **katılımcıdır**. Herhangi bir `` öğesine temel sınıfı `.table` ekleyin, ardından isteğe bağlı modifikasyon sınıflarımız veya özel stillerle genişletin. Bootstrap’ta tüm tablo stilleri miras alınmaz, bu da yerleşik tabloların ebeveyninden bağımsız olarak stillendirilebileceği anlamına gelir.

> **Not:** En temel tablo işaretleme ile, işte `.table` tabanlı tabloların Bootstrap içinde nasıl göründüğü.

## Varyantlar

Tabloları, tablo satırlarını veya bireysel hücreleri renklendirmek için bağlamsal sınıfları kullanın.


  
    
      
        Sınıf
        Başlık
        Başlık
      
    
    
      
        Varsayılan
        Hücre
        Hücre
      
      
      {{- range (index $.Site.Data "theme-colors") }}
        
          {{ .name | title }}
          Hücre
          Hücre
        
      {{- end -}}
      
    
  


:::tip
Tablolar üzerinde farklı temalar ve varyantlar kullanarak görsel tasarımı geliştirmenizi öneriyoruz.
:::



{{- range (index $.Site.Data "theme-colors") }}
...
{{- end -}}

{{- range (index $.Site.Data "theme-colors") }}
...
{{- end -}}


{{- range (index $.Site.Data "theme-colors") }}
  ...
{{- end -}}


## Vurgu yapılmış tablolar

### Çizgili satırlar

`` içinde herhangi bir tablo satırına zebra şeritleri eklemek için `.table-striped` kullanın.

### Çizgili sütunlar

Herhangi bir tablo sütununa zebra şeritleri eklemek için `.table-striped-columns` kullanın.

Bu sınıflar tablo varyantlarına da eklenebilir:

### Üzerine gelindiğinde duyarlı satırlar

`` içinde tablo satırlarına üzerine gelindiğinde duyarlı bir durum sağlamak için `.table-hover` ekleyin.

Bu üzerine gelindiğinde duyarlı satırlar çizgili satır varyantlarıyla da birleştirilebilir:

### Aktif tablolar

Bir tablo satırını veya hücresini vurgulamak için `.table-active` sınıfını ekleyin.


  
    
      
        #
        İlk
        Son
        Kullanıcı Adı
      
    
    
      
        1
        Mark
        Otto
        @mdo
      
      
        2
        Jacob
        Thornton
        @fat
      
      
        3
        Larry the Bird
        @twitter
      
    
  


```html
<table class="table">
  <thead>
    ...
  </thead>
  <tbody>
    <tr class="table-active">
      ...
    </tr>
    <tr>
      ...
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2" class="table-active">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
```


  
    
      
        #
        İlk
        Son
        Kullanıcı Adı
      
    
    
      
        1
        Mark
        Otto
        @mdo
      
      
        2
        Jacob
        Thornton
        @fat
      
      
        3
        Larry the Bird
        @twitter
      
    
  


```html
<table class="table table-dark">
  <thead>
    ...
  </thead>
  <tbody>
    <tr class="table-active">
      ...
    </tr>
    <tr>
      ...
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2" class="table-active">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
```

## Varyantlar ve vurgu yapılmış tablolar nasıl çalışır?

Vurgu yapılmış tablolar için (`çizgili satırlar`, `çizgili sütunlar`, `üzerine gelindiğinde duyarlı satırlar` ve `aktif tablolar`), bu efektlerin tüm tablo varyantlarıyla çalışması için bazı teknikler kullandık:

- Bir tablo hücresinin arka planını `--cui-table-bg` özel özelliği ile ayarlayarak başlıyoruz. Tüm tablo varyantları, tablo hücrelerini renklendirmek için bu özel özelliği ayarlar. Bu şekilde, yarı saydam renkler tablo arka planı olarak kullanıldığında sorun yaşamayız.
- Ardından, herhangi bir belirtilmiş `background-color` üzerine katmanlama yapmak için `background-image: linear-gradient(var(--cui-table-accent-bg), var(--cui-table-accent-bg));` ile tablo hücrelerinde bir gradyan ekliyoruz. `--cui-table-accent-bg` varsayılan olarak saydam olduğundan, başlangıçta görünmez bir saydam lineer gradyanımız bulunmaktadır.
- `.table-striped`, `.table-hover` veya `.table-active` sınıflarından biri eklendiğinde, belirli bir rengi renklendirmek için `--cui-table-accent-bg` yarı saydam bir renge ayarlanır.
- Her tablo varyantı için, o renge bağlı olarak en yüksek kontrastta bir `--cui-table-accent-bg` rengi üretiyoruz. Örneğin, `.table-primary` için vurgu rengi daha koyuyken, `.table-dark` daha açık bir vurgu rengine sahiptir.
- Metin ve kenar renkleri aynı şekilde üretilir ve bunların renkleri varsayılan olarak miras alınır.

Arka planda bu şekilde görünür:

## Tablo kenarları

### Kenarları olan tablolar

Tablo ve hücrelerin tüm kenarlarına kenarlar eklemek için `.table-bordered` ekleyin.

`Border color utilities` kullanarak renkleri değiştirebilirsiniz:

### Kenarsız tablolar

Kenarları olmayan bir tablo için `.table-borderless` ekleyin.

## Küçük tablolar

Herhangi bir `.table` sınıfını daha kompakt yapmak için `.table-sm` ekleyin, böylece tüm hücrelerin `padding` değeri yarıya indirilmiş olur.

## Tablo grup ayırıcıları

Tablo grupları arasında daha kalın, daha koyu bir kenar eklemek için — ``, ``, ve `` — `.table-group-divider` kullanın. Rengi değiştirmek için `border-top-color`'ı değiştirerek özelleştirin (bu durumda mevcut durumda bir yardımcı sınıf sağlanmamaktadır).

  
    
      #
      İlk
      Son
      Kullanıcı Adı
    
  
  
    
      1
      Mark
      Otto
      @mdo
    
    
      2
      Jacob
      Thornton
      @fat
    
    
      3
      Larry the Bird
      @twitter
    
  

## Dikey hizalama

``’deki tablo hücreleri her zaman aşağıya hizalanır. ``'deki tablo hücreleri hizalanmalarını ``'dan alır ve varsayılan olarak yukarıya hizalanır. Gerekli yerlerde yeniden hizalanmak için `dikey hizalama` sınıflarını kullanın.


  
    
      
        
          Başlık 1
          Başlık 2
          Başlık 3
          Başlık 4
        
      
      
        
          <td>Bu hücre vertical-align: middle; stilini tablodan miras alır
          <td>Bu hücre vertical-align: middle; stilini tablodan miras alır
          <td>Bu hücre vertical-align: middle; stilini tablodan miras alır
          Bu alan, dikey alanın yukarıdaki hücrelerde nasıl çalıştığını göstermek için oldukça fazla dikey alan kaplayacak şekilde tasarlanmış bir yer tutucu metin.
        
        
          <td>Bu hücre vertical-align: bottom; stilini tablodan miras alır
          <td>Bu hücre vertical-align: bottom; stilini tablodan miras alır
          <td>Bu hücre vertical-align: bottom; stilini tablodan miras alır
          Bu alan, dikey alanın yukarıdaki hücrelerde nasıl çalıştığını göstermek için oldukça fazla dikey alan kaplayacak şekilde tasarlanmış bir yer tutucu metin.
        
        
          <td>Bu hücre vertical-align: middle; stilini tablodan miras alır
          <td>Bu hücre vertical-align: middle; stilini tablodan miras alır
          Bu hücre yukarı hizalanmıştır.
          Bu alan, dikey alanın yukarıdaki hücrelerde nasıl çalıştığını göstermek için oldukça fazla dikey alan kaplayacak şekilde tasarlanmış bir yer tutucu metin.
        
      
    
  


```html
<div class="table-responsive">
  <table class="table align-middle">
    <thead>
      <tr>
        ...
      </tr>
    </thead>
    <tbody>
      <tr>
        ...
      </tr>
      <tr class="align-bottom">
        ...
      </tr>
      <tr>
        <td>...</td>
        <td>...</td>
        <td class="align-top">Bu hücre yukarı hizalanmıştır.</td>
        <td>...</td>
      </tr>
    </tbody>
  </table>
</div>
```

## İç içe geçirme

Kenar stilleri, aktif stiller ve tablo varyantları iç içe tablolar tarafından miras alınmaz.



  
    
      #
      İlk
      Son
      Kullanıcı Adı
    
  
  
    
      1
      Mark
      Otto
      @mdo
    
    
      
        
          
            
              Başlık
              Başlık
              Başlık
            
          
          
            
              A
              İlk
              Son
            
            
              B
              İlk
              Son
            
            
              C
              İlk
              Son
            
          
        
      
    
    
      3
      Larry
      the Bird
      @twitter
    
  



```html
<table class="table table-striped">
  <thead>
    ...
  </thead>
  <tbody>
    ...
    <tr>
      <td colspan="4">
        <table class="table mb-0">
          ...
        </table>
      </td>
    </tr>
    ...
  </tbody>
</table>
```

## İç içe geçirme nasıl çalışır

İç içe tabloların herhangi bir stilin sızmasını önlemek için CSS'de çocuk kombinatör (`>`) seçicisini kullanıyoruz. `thead`, `tbody` ve `tfoot`'teki tüm `td` ve `th`'leri hedeflememiz gerektiğinden, seçicimiz bunun olmadan oldukça uzun görünebilir. Bu nedenle, `.table > :not(caption) > * > *` seçicisini, `.table`'ın tüm `td` ve `th`'lerini hedeflemek ancak herhangi bir potansiyel iç içe geçmiş tabloyu dışarıda bırakmak için kullanıyoruz.

Not edin ki bir `` eklediğinizde, bunlar varsayılan olarak bir `` içine sarılır, bu nedenle seçicilerimiz amaçlandığı gibi çalışır.

## Anatomisi

### Tablo başlığı

Tablolar ve koyu tablolar benzeri, ``'in açık veya koyu gri görünmesi için `.table-light` veya `.table-dark` modifikatör sınıflarını kullanın.



  
    
      #
      İlk
      Son
      Kullanıcı Adı
    
  
  
    
      1
      Mark
      Otto
      @mdo
    
    
      2
      Jacob
      Thornton
      @fat
    
    
      3
      Larry
      the Bird
      @twitter
    
  



```html
<table class="table">
  <thead class="table-light">
    ...
  </thead>
  <tbody>
    ...
  </tbody>
</table>
```



  
    
      #
      İlk
      Son
      Kullanıcı Adı
    
  
  
    
      1
      Mark
      Otto
      @mdo
    
    
      2
      Jacob
      Thornton
      @fat
    
    
      3
      Larry
      the Bird
      @twitter
    
  



```html
<table class="table">
  <thead class="table-dark">
    ...
  </thead>
  <tbody>
    ...
  </tbody>
</table>
```

### Tablo altı



  
    
      #
      İlk
      Son
      Kullanıcı Adı
    
  
  
    
      1
      Mark
      Otto
      @mdo
    
    
      2
      Jacob
      Thornton
      @fat
    
    
      3
      Larry
      the Bird
      @twitter
    
  
  
    
      Altbilgi
      Altbilgi
      Altbilgi
      Altbilgi
    
  



```html
<table class="table">
  <thead>
    ...
  </thead>
  <tbody>
    ...
  </tbody>
  <tfoot>
    ...
  </tfoot>
</table>
```

### Başlıklar

Bir `` tablo için başlık görevi görür. Ekran okuyucuları kullanan kullanıcıların bir tabloyu bulmasına ve ne hakkında olduğunu anlamasına yardımcı olur ve okumak isteyip istemediğine karar vermesine yardımcı olur.


  
    Kullanıcılar Listesi
    
  


```html
<table class="table table-sm">
  <caption>Kullanıcılar Listesi</caption>
  <thead>
    ...
  </thead>
  <tbody>
    ...
  </tbody>
</table>
```

Ayrıca ``'u tablonun üstüne `.caption-top` ile koyabilirsiniz.

  Kullanıcılar Listesi
  
    
      #
      İlk
      Son
      Kullanıcı Adı
    
  
  
    
      1
      Mark
      Otto
      @mdo
    
    
      2
      Jacob
      Thornton
      @fat
    
    
      3
      Larry
      the Bird
      @twitter
    
  

## Duyarlı tablolar

Duyarlı tablolar, tabloların yatay olarak kolayca kaydırılmasını sağlar. Herhangi bir tabloyu `.table`'ı `.table-responsive` ile sararak tüm görünüm boyutları boyunca duyarlı hale getirin. Alternatif olarak, duyarlı bir tabloya sahip olmak istediğiniz maksimum kesim noktasını `.table-responsive{-sm|-md|-lg|-xl|-xxl}` kullanarak seçebilirsiniz.

:::warning
##### Dikey kesme/kısıtlama

Duyarlı tablolar `overflow-y: hidden` kullanır; bu da tablonun alt veya üst kenarlarının ötesine geçen içeriği keser. Özellikle bu, açılır menüleri ve diğer üçüncü parti bileşenleri kesebilir.
:::

### Her zaman duyarlı

Her kesim noktasında, yatay kaydırma tabloları için `.table-responsive` kullanın.


  
    
      
        
          #
          Başlık
          Başlık
          Başlık
          Başlık
          Başlık
          Başlık
          Başlık
          Başlık
          Başlık
        
      
      
        
          1
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
        
        
          2
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
        
        
          3
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
        
      
    
  


```html
<div class="table-responsive">
  <table class="table">
    ...
  </table>
</div>
```

---
title: Kesme Noktasına Özgü
description: Bu içerik, belirli duyarlı tablolarda kesme noktalarına özgü stil uygulamalarını açıklamaktadır. Tablo responsive özellikleri ve SASS değişkenleri hakkında detaylar içermektedir. 
keywords: [duyarlı tablolar, kesme noktası, SASS, stil, tasarım]
---

### Kesme Noktasına Özgü

Gerektiğinde belirli bir kesme noktasına kadar duyarlı tablolar oluşturmak için `.table-responsive{-sm|-md|-lg|-xl|-xxl}` kullanın. O kesme noktasından itibaren, tablo normal şekilde davranacak ve yatay olarak kaydırılmayacaktır.

:::tip
**Bu tablolar, duyarlı stillerinin belirli görünüm genişliklerinde uygulanana kadar bozuk görünebilir.**
:::


{{ range $.Site.Data.breakpoints }}
{{ if not (eq . "xs") }}

  
    
      
        
          #
          Başlık
          Başlık
          Başlık
          Başlık
          Başlık
          Başlık
          Başlık
          Başlık
        
      
      
        
          1
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
        
        
          2
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
        
        
          3
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
          Hücre
        
      
    
  

{{ end -}}
{{- end -}}


{{- range $.Site.Data.breakpoints -}}
{{- if not (eq . "xs") }}

  
    ...
  

{{ end -}}
{{- end -}}

---

## Özelleştirme

### SASS değişkenleri

### SASS döngüsü

### Özelleştirme

- Faktör değişkenleri (`$table-striped-bg-factor`, `$table-active-bg-factor` & `$table-hover-bg-factor`), tablo varyasyonlarındaki kontrastı belirlemek için kullanılır.
- Açık ve koyu tablo varyasyonlarının yanı sıra, tema renkleri `$table-bg-scale` değişkeni ile açılmaktadır.