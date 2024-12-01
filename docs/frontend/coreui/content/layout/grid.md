---
description: CoreUI'nin Bootstrap için ızgara sistemi, içerikleri düzenleyip hizalamak için esnek bir yol sunar. Flexbox tabanlı bu sistem, 12 sütunlu yapı ve duyarlı tasarım kategorileri sayesinde esnek ve özelleştirilebilir düzenler oluşturmanıza olanak tanır.
keywords: [ızgara, flexbox, Bootstrap, duyarlılık, Sass]
---

## Örnek

CoreUI'nin Bootstrap için ızgara sistemi, içerikleri düzenleyip hizalamak için bir dizi konteyner, satır ve sütun kullanır. [Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) ile oluşturulmuştur ve tamamen duyarlıdır. Aşağıda ızgara sisteminin nasıl bir araya geldiğine dair bir örnek ve ayrıntılı açıklama bulunmaktadır.

:::info
**Flexbox'a yeni misiniz veya aşina değil misiniz?** Arka plan, terminoloji, yönergeler ve kod kesitleri için [bu CSS Tricks flexbox kılavuzunu okuyun](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#flexbox-background).
:::

  
    
      Sütun
    
    
      Sütun
    
    
      Sütun
    
  

Yukarıdaki örnek, önceden tanımlanmış ızgara sınıflarımızı kullanarak tüm cihazlar ve görünüm alanları boyunca üç eşit genişlikte sütun oluşturur. Bu sütunlar, üst düzey `.container` ile sayfada ortalanmıştır.

## Nasıl çalışır

Ayrıntılara girmeden, ızgara sisteminin nasıl bir araya geldiğine bakalım:

- **Izgaramız `altı duyarlı kesme noktalarını` destekler.** Kesme noktaları, `min-width` medya sorgularına dayanmaktadır, bu da kesme noktasının ve üzerindeki tüm kesme noktalarını etkilediği anlamına gelir. Örneğin, `.col-sm-4`, `sm`, `md`, `lg`, `xl` ve `xxl`'ye uygulanır. Bu, her bir kesme noktasına göre konteyner ve sütun boyutlandırmasını ve davranışını kontrol edebileceğiniz anlamına gelir.

- **Konteynerler içeriğinizi ortalar ve yatay olarak boşluk bırakır.** Tüm görünüm alanları ve cihazlar boyunca `width: 100%` için `.container` kullanın, ya da akışkan ve piksel genişliklerinin bir kombinasyonu için duyarlı bir konteyner kullanın (örneğin, `.container-md`).

- **Satırlar sütunlar için sarıcıdır.** Her sütun, sütunlar arasındaki boşluğu kontrol etmek için yatay `padding` içerir. (Bu boşluğa gutter denir). Bu `padding` daha sonra negatif kenar boşlukları ile satırlarda dengelenerek sütunlarınızdaki içeriğin soldan görsel olarak hizalanmasını sağlar. Satırlar ayrıca `sütun boyutlandırmasını uniform bir şekilde uygulamak` ve içeriğinizin boşluğunu değiştirmek için `gutter sınıflarını` destekleyen değiştirici sınıflara sahiptir.

- **Sütunlar son derece esnektir.** Her bir satırda mevcut 12 şablon sütun bulunmaktadır, böylece belirli bir sayıda sütun boyunca uzanan farklı bileşimler oluşturabilirsiniz. Sütun sınıfları hangi sayıda şablon sütununa yayılacağını belirtir (örneğin, `col-4`, dört sütuna yayılır). `width` değerleri yüzde cinsinden ayarlanır, bu nedenle her zaman aynı göreceli boyutlandırmayı elde edersiniz.

- **Gutterler de duyarlı ve özelleştirilebilir.** Duyarlı kesme noktalarının tamamında `Gutter sınıfları mevcuttur` ve hepsi `kenar boşluğu ve dolgu aralıklarımızla` aynı boyutlardadır. Yatay gutterları `.gx-*` sınıfları ile, dikey gutterları `.gy-*`, tüm gutterları ise `.g-*` sınıfları ile değiştirebilirsiniz. Gutterları kaldırmak için `.g-0` da mevcuttur.

:::warning
**Flexbox ile ilgili sınırlamaların ve [hataların farkında olun](https://github.com/philipwalton/flexbugs)**; bazı HTML öğelerini esnek konteynerler olarak kullanamama gibi [sorunların olduğunu](https://github.com/philipwalton/flexbugs#flexbug-9) unutmayın.
:::

## Izgara seçenekleri

CoreUI'nin Bootstrap için ızgara sistemi, tüm altı varsayılan kesme noktasında ve özelleştirdiğiniz herhangi bir kesme noktasında uyum sağlayabilir. Altı varsayılan ızgara katmanları şöyle:

- Ekstra küçük (xs)
- Küçük (sm)
- Orta (md)
- Büyük (lg)
- Ekstra büyük (xl)
- Ekstra ekstra büyük (xxl)

Yukarıda belirtildiği gibi, bu kesme noktalarının her birinin kendi konteyneri, benzersiz sınıf ön eki ve değiştiricileri vardır. İşte ızgaranın bu kesme noktalarında nasıl değiştiği:


  
    
      
        
        
          xs
          &lt;576px
        
        
          sm
          &ge;576px
        
        
          md
          &ge;768px
        
        
          lg
          &ge;992px
        
        
          xl
          &ge;1200px
        
        
          xxl
          &ge;1400px
        
      
    
    
      
        <th class="text-nowrap" scope="row">Konteyner <code class="fw-normal">max-width
        Yok (otomatik)
        540px
        720px
        960px
        1140px
        1320px
      
      
        Sınıf ön eki
        <td>.col-
        <td>.col-sm-
        <td>.col-md-
        <td>.col-lg-
        <td>.col-xl-
        <td>.col-xxl-
      
      
        Sütun sayısı
        12
      
      
        Gutter genişliği
        1.5rem (solda ve sağda .75rem)
      
      
        Özelleştirilmiş gutter'lar
        }}">Evet
      
      
        İç içe geçme
        Evet
      
      
        Sütun sıralaması
        }}">Evet
      
    
  


## Otomatik düzen sütunları

Hesaplanmış kesme noktasına özgü sütun sınıflarını kullanarak, .col-sm-6 gibi açık bir numaralı sınıf olmadan kolay sütun boyutlandırması yapabilirsiniz.

### Eşit genişlik

Örneğin, işte `xs`'den `xxl`'ye kadar her cihaz ve görünüm alanına uygulanacak iki ızgara düzeni. İhtiyacınız olan her kesme noktası için herhangi bir sayıda birim içermeyen sınıf ekleyin ve her sütun aynı genişlikte olacaktır.

  
    
      1'den 2'ye
    
    
      2'den 2'ye
    
  
  
    
      1'den 3'e
    
    
      2'den 3'e
    
    
      3'ten 3'e
    
  

### Bir sütun genişliğini ayarlama

Flexbox ızgara sütunları için otomatik düzen, bir sütunun genişliğini ayarlayabileceğiniz ve akran sütunların otomatik olarak etrafında yeniden boyutlandırılabileceği anlamına gelir. Aşağıda gösterilene ek olarak, önceden tanımlanmış ızgara sınıflarını, ızgara karışımlarını veya satır içi genişlikleri kullanabilirsiniz. Diğer sütunlar, merkezi sütunun genişliğinden bağımsız olarak yeniden boyutlandırılacaktır.

  
    
      1'den 3'e
    
    
      2'den 3'e (daha geniş)
    
    
      3'ten 3'e
    
  
  
    
      1'den 3'e
    
    
      2'den 3'e (daha geniş)
    
    
      3'ten 3'e
    
  

### Değişken genişlikte içerik

Sütunları içeriklerinin doğal genişliğine dayalı olarak boyutlandırmak için `col-{breakpoint}-auto` sınıflarını kullanın.

  
    
      1'den 3'e
    
    
      Değişken genişlikte içerik
    
    
      3'ten 3'e
    
  
  
    
      1'den 3'e
    
    
      Değişken genişlikte içerik
    
    
      3'ten 3'e
    
  

## Duyarlı sınıflar

CoreUI'nın Bootstrap için ızgarası, karmaşık duyarlı düzenler oluşturmak için altı aşamalı önceden tanımlanmış sınıflar içerir. Ekstra küçük, küçük, orta, büyük veya ekstra büyük cihazlar üzerinde sütunlarınızın boyutunu istediğiniz gibi özelleştirin.

### Tüm kesme noktaları

En küçük cihazlardan en büyüğüne kadar aynı olan ızgaralar için `.col` ve `.col-*` sınıflarını kullanın. Özellikle boyutlandırılmış bir sütuna ihtiyaç duyduğunuzda numaralı bir sınıf belirtin; aksi takdirde, .col ile devam edebilirsiniz.

  
    col
    col
    col
    col
  
  
    col-8
    col-4
  

### Yığılmıştan yatay

Tek bir `.col-sm-*` sınıfı seti kullanarak, başlangıçta yığılmış ve küçük kesme noktasında (`sm`) yatay hale gelen temel bir ızgara sistemi oluşturabilirsiniz.

  
    col-sm-8
    col-sm-4
  
  
    col-sm
    col-sm
    col-sm
  

### Karıştır ve eşleştir

Sütunlarınızın bazı ızgara katmanlarında sadece yığılmasını istemiyorsanız, her bir katman için gerekli olduğu gibi farklı sınıfların bir kombinasyonunu kullanın. Aşağıdaki örneği inceleyerek nasıl çalıştığı hakkında daha iyi bir fikir edinebilirsiniz.

  
  
    .col-md-8
    .col-6 .col-md-4
  

  
  
    .col-6 .col-md-4
    .col-6 .col-md-4
    .col-6 .col-md-4
  

  
  
    .col-6
    .col-6
  

### Satır sütunları

Hızla içeriğinizi ve düzeninizi en iyi şekilde sunan sütun sayısını ayarlamak için duyarlı `.row-cols-*` sınıflarını kullanın. Normal `.col-*` sınıfları bireysel sütunlara uygulanırken (örneğin, `.col-md-4`), satır sütun sınıfları üst düzey `.row` üzerinde bir kısayol olarak ayarlanır. `.row-cols-auto` ile sütunlara doğal genişliklerini verebilirsiniz.

Bu satır sütun sınıflarını kullanarak temel ızgara düzenleri oluşturun veya kart düzenlerinizi kontrol edin.

  
    Sütun
    Sütun
    Sütun
    Sütun
  

  
    Sütun
    Sütun
    Sütun
    Sütun
  

  
    Sütun
    Sütun
    Sütun
    Sütun
  

  
    Sütun
    Sütun
    Sütun
    Sütun
  

  
    Sütun
    Sütun
    Sütun
    Sütun
  

  
    Sütun
    Sütun
    Sütun
    Sütun
  

Ayrıca eşlik eden Sass karışımını `row-cols()` kullanarak da kullanabilirsiniz:

```scss
.element {
  // Üç sütun ile başlar
  @include row-cols(3);

  // Orta kesme noktasından itibaren beş sütun
  @include media-breakpoint-up(md) {
    @include row-cols(5);
  }
}
```

## İç içe geçme

Varsayılan ızgarayla iç içe geçmek için, mevcut bir `.col-sm-*` sütunun içinde yeni bir `.row` ve bir dizi `.col-sm-*` sütun ekleyin. İç içe geçmiş satırların toplamı 12 veya daha az sütun eklemesi gerekir (tüm 12 mevcut sütunun kullanılması gerekmez).

  
    
      Seviye 1: .col-sm-3
    
    
      
        
          Seviye 2: .col-8 .col-sm-6
        
        
          Seviye 2: .col-4 .col-sm-6
        
      
    
  

## Sass

CoreUI'nın Bootstrap için kaynak Sass dosyalarını kullanırken, özel, anlamlı ve duyarlı sayfa düzenleri oluşturmak için Sass değişkenlerini ve karışımlarını kullanma seçeneğiniz vardır. Önceden tanımlanmış ızgara sınıflarımız, hızlı duyarlı düzenler için kullanılabilir durumda olan bir dizi sınıf sağlamak için bu değişkenleri ve karışımları kullanır.

### Değişkenler

Değişkenler ve haritalar sütun sayısını, gutter genişliğini ve sütunları yüzen olarak başlatmak için medya sorgusu noktasını belirler. Bunları, yukarıda belgelenmiş olan önceden tanımlanmış ızgara sınıflarını oluşturmak için ve aşağıda listelenen özel karışımlar için kullanıyoruz.

```scss
$grid-columns:      12;
$grid-gutter-width: 1.5rem;
```

### Karışımlar

Karışımlar, her bir ızgara sütunu için anlamlı CSS oluşturmak üzere ızgara değişkenleri ile birlikte kullanılır.

```scss
// Bir dizi sütun için bir sarıcı oluşturur
@include make-row();

// Elemanı ızgara için hazır hale getirir (genişlik hariç her şeyi uygulayarak)
@include make-col-ready();

// İsteğe bağlı boyut değerleri olmadan, karışım eşit sütunlar üretecektir (şu şekilde kullanmakla benzer: .col)
@include make-col();
@include make-col($size, $columns: $grid-columns);

// Kenar boşlukları ile offset
@include make-col-offset($size, $columns: $grid-columns);
```

### Örnek kullanım

Değişkenleri kendi özel değerlerinize uyarlayabilirsiniz veya sadece varsayılan değerleri ile karışımları kullanabilirsiniz. İşte arada boşluk bırakmaları olan iki sütun düzeni oluşturmayı gösteren varsayılan ayarları kullanmanın bir örneği.

```scss
.example-container {
  @include make-container();
  // Bu genişliği karışımından sonra tanımladığınızdan emin olun
  // `width: 100%`'yi geçici olarak ayarlamak için
  width: 800px;
}

.example-row {
  @include make-row();
}

.example-content-main {
  @include make-col-ready();

  @include media-breakpoint-up(sm) {
    @include make-col(6);
  }
  @include media-breakpoint-up(lg) {
    @include make-col(8);
  }
}

.example-content-secondary {
  @include make-col-ready();

  @include media-breakpoint-up(sm) {
    @include make-col(6);
  }
  @include media-breakpoint-up(lg) {
    @include make-col(4);
  }
}
```

  
    Ana içerik
    İkincil içerik
  

## Izgarayı özelleştirme

Kendi özelleştirilmiş değişkenlerinizi oluşturmak ve yeniden derlemek için yerleşik ızgara Sass değişkenlerini ve haritalarını kullanarak önceden tanımlanmış ızgara sınıflarını tamamen özelleştirmeniz mümkündür. Katman sayısını, medya sorgusu boyutlarını ve konteyner genişliklerini değiştirebilirsiniz.

### Sütunlar ve gutterlar

Izgara sütunlarının sayısı Sass değişkenleri aracılığıyla değiştirilebilir. `$grid-columns`, her bir bireysel sütunun genişliklerini (yüzde cinsinden) oluşturmak için kullanılırken, `$grid-gutter-width` sütun gutterlarının genişliğini ayarlar.

```scss
$grid-columns: 12 !default;
$grid-gutter-width: 1.5rem !default;
```

### Izgara katmanları

Sütunların yanı sıra, ızgara katmanlarının sayısını da özelleştirebilirsiniz. Sadece dört ızgara katmanı istiyorsanız, `$grid-breakpoints` ve `$container-max-widths`'ı şöyle güncellemeniz yeterlidir:

```scss
$grid-breakpoints: (
  xs: 0,
  sm: 480px,
  md: 768px,
  lg: 1024px
);

$container-max-widths: (
  sm: 420px,
  md: 720px,
  lg: 960px
);
```

Sass değişkenleri veya haritalarında herhangi bir değişiklik yaptığınızda, değişikliklerinizi kaydetmeniz ve yeniden derlemeniz gerekecektir. Bunu yapmak, sütun genişlikleri, offsetler ve sıralama için yeni bir dizi önceden tanımlanmış ızgara sınıfları üretir. Duyarlı görünürlük yardımcı programları da özelleştirilmiş kesme noktalarını kullanacak şekilde güncellenecektir. Izgara değerlerini `px` cinsinden ayarladığınızdan emin olun ( `rem`, `em` veya `%` cinsinden değil).