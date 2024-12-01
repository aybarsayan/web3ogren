---
description: CSS Grid üzerine inşa edilmiş alternatif düzen sistemimizi etkinleştirmeyi, kullanmayı ve özelleştirmeyi öğrenin; örnekler ve kod parçacıklarıyla. Bu doküman, CSS Grid'in temellerini, yapılandırma seçeneklerini ve uygulama örneklerini kapsamaktadır.
keywords: [CSS Grid, layout, responsive design, CoreUI, Bootstrap, CSS, grid-template]
---

CoreUI'nin Bootstrap için varsayılan ızgara sistemi, on yılı aşkın **CSS düzen tekniklerinin** birikimini temsil eder; milyonlarca kişi tarafından test edilmiştir. Ancak, modern CSS özellikleri ve teknikleri, yeni CSS Grid gibi tarayıcılarda gördüğümüz pek çok özelliği içermez.

:::warning
**Dikkat—CSS Grid sistemimiz v4.1.0 itibarıyla deneysel ve isteğe bağlıdır!** Bunu belgelerimizin CSS'ine dahil ettik, size göstermesi için, ancak varsayılan olarak devre dışıdır. Projelerinizde bunu nasıl etkinleştireceğinizi öğrenmek için okumaya devam edin.
:::

## Nasıl çalışır

CoreUI 4 ile CSS Grid üzerine inşa edilmiş ayrı bir ızgara sistemi etkinleştirme seçeneği ekledik; ancak CoreUI özelliği ile. Hala duyarlı düzenler oluşturmak için uygulayabileceğiniz sınıflar alırsınız, ancak altta yatan farklı bir yaklaşım ile.

- **CSS Grid isteğe bağlıdır.** Varsayılan ızgara sistemini devre dışı bırakmak için `$enable-grid-classes: false` ayarlayın ve CSS Grid'i etkinleştirmek için `$enable-cssgrid: true` ayarlayın. Ardından, Sass'ınızı yeniden derleyin.

- **`.row` örneklerini `.grid` ile değiştirin.** `.grid` sınıfı `display: grid` ayarlar ve HTML’nizde oluşturacağınız bir `grid-template` oluşturur.

- **`.col-*` sınıflarını `.g-col-*` sınıflarıyla değiştirin.** Bunun nedeni, CSS Grid sütunlarımızın `width` yerine `grid-column` özelliğini kullanmasıdır.

- **Sütun ve boşluk boyutları CSS değişkenleri ile ayarlanır.** Bunu üstteki `.grid` üzerinde ayarlayın ve isterseniz, çevrimiçi veya bir stil sayfasında, `--cui-columns` ve `--cui-gap` ile özelleştirin.

Gelecekte, Bootstrap büyük ihtimalle `gap` özelliği için neredeyse tam tarayıcı desteği sağlandıkça hibrit bir çözüme geçecektir.

---

## Temel farklılıklar

Varsayılan ızgara sistemi ile karşılaştırıldığında:

- Flex yardımcıları CSS Grid sütunlarını aynı şekilde etkilemez.
  
- Boşluklar, olukları değiştirir. `gap` özelliği, varsayılan ızgara sistemimizdeki yatay `padding` değerini değiştirir ve daha çok `margin` gibi çalışır.

> .**Bu nedenle, `.row`'lardan farklı olarak, `.grid`'lerin negatif marginleri yoktur** ve boşlukları değiştirmek için margin yardımcıları kullanılamaz. Izgara boşlukları varsayılan olarak yatay ve dikey olarak uygulanır. Daha fazla ayrıntı için `özelleştirme bölümüne` bakın.

- Çevrimiçi ve özel stiller, modifikasyon sınıflarının yerini alacak şekilde görülmelidir (örneğin, `style="--cui-columns: 3;"` vs `class="row-cols-3"`).

- İç içe geçiş benzer şekilde çalışır, ancak her iç içe geçmiş `.grid` örneği için sütun sayılarınızı sıfırlamanız gerekebilir. Ayrıntılar için `iç içe geçiş bölümüne` bakın.

## Örnekler

### Üç sütun

Tüm görünüm alanları ve cihazlar boyunca üç eşit genişliğinde sütun oluşturmak için `.g-col-4` sınıflarını kullanın. Görünüm boyutuna göre düzeni değiştirmek için `duyarlı sınıflar` ekleyin.

:::note
Sütunlar, CSS Grid ile kolaylıkla oluşturulabilir ve değiştirilebilir.
:::

  .g-col-4
  .g-col-4
  .g-col-4

### Duyarlı

Düzeninizi görünüm alanları arasında ayarlamak için duyarlı sınıfları kullanın. Burada en dar görünüm alanlarında iki sütun ile başlayacağız, ardından orta görünüm alanlarında ve yukarısında üç sütuna doğru büyüyeceğiz.

  .g-col-6 .g-col-md-4
  .g-col-6 .g-col-md-4
  .g-col-6 .g-col-md-4

Bunu her görünüm alanında iki sütun düzeni ile karşılaştırın.

  .g-col-6
  .g-col-6

---

## Sarma

Izgara öğeleri yatayda daha fazla alan kalmadığında otomatik olarak bir sonraki satıra sarılır. `gap` özelliğinin izgara öğeleri arasındaki yatay ve dikey boşluklara uygulandığını unutmayın.

  .g-col-6
  .g-col-6

  .g-col-6
  .g-col-6

## Başlangıç

Başlangıç sınıfları varsayılan ızgaramızın offset sınıflarının yerini almayı amaçlar, ancak tamamen aynı değillerdir. CSS Grid, tarayıcılara "bu sütunda başla" ve "bu sütunda sona er" şeklinde stiller aracılığıyla bir ızgara şablonu oluşturur. Bu özellikler `grid-column-start` ve `grid-column-end`’dir. Başlangıç sınıfları ilkinin kısayoludur. Sütun sınıfları ile eşleştirerek sütunlarınızı ihtiyacınıza göre boyutlandırabilir ve hizalayabilirsiniz. Başlangıç sınıfları `1`'den başlar çünkü `0` bu özellikler için geçerli bir değer değildir.

  .g-col-3 .g-start-2
  .g-col-4 .g-start-6

## Otomatik sütunlar

Izgara öğeleri üzerinde (bir `.grid`'in doğrudan çocukları) sınıf yoksa, her ızgara öğesi otomatik olarak bir sütuna sığacak şekilde boyutlandırılır.

  1
  1
  1
  1
  1
  1
  1
  1
  1
  1
  1
  1

Bu davranış, ızgara sütun sınıfları ile karıştırılabilir.

  .g-col-6
  1
  1
  1
  1
  1
  1

## İç içe geçiş

Varsayılan ızgara sistemimize benzer şekilde, CSS Grid'imiz, `.grid`'lerin kolayca iç içe geçirilmesine izin verir. Ancak, varsayılandan farklı olarak, bu ızgara satırlarda, sütunlarda ve boşluklarda yapılan değişiklikleri devralır. Aşağıdaki örneğe göz atın:

- Varsayılan sütun sayısını yerel bir CSS değişkeni ile geçersiz kılıyoruz: `--cui-columns: 3`.
- İlk otomatik sütunda, sütun sayısı devralınır ve her sütun mevcut genişliğin üçte biri kadardır.
- İkinci otomatik sütunda, iç içe geçmiş `.grid` üzerindeki sütun sayısını 12 (varsayılan) olarak sıfırladık.
- Üçüncü otomatik sütunun içeriği yoktur.

Pratikte, bu, varsayılan ızgara sistemimize kıyasla daha karmaşık ve özel düzenler oluşturmaya olanak tanır.

  
    İlk otomatik sütun
    
      Otomatik sütun
      Otomatik sütun
    
  
  
    İkinci otomatik sütun
    
      6/12
      4/12
      2/12
    
  
  Üçüncü otomatik sütun

## Özelleştirme

Sütun sayısını, satır sayısını ve boşluk genişliğini yerel CSS değişkenleri ile özelleştirin.


| Değişken | Yedek değer | Açıklama |
| --- | --- | --- |
| `--cui-rows` | `1` | Izgara şablonunuzdaki satır sayısı |
| `--cui-columns` | `12` | Izgara şablonunuzdaki sütun sayısı |
| `--cui-gap` | `1.5rem` | Sütunlar arasındaki boşluk boyutu (dikey ve yatay) |
Bu CSS değişkenlerinin varsayılan bir değeri yoktur; bunun yerine, yerel bir örnek sağlanana kadar kullanılan yedek değerler uygulayacaklardır. Örneğin, CSS Grid satırlarımız için `var(--cui-rows, 1)` kullanıyoruz ki bu, `--cui-rows` henüz herhangi bir yerde ayarlanmadığı için göz ardı edilir. Ayarlanana kadar, `.grid` örneği, yedek değeri olan `1` kullanacaktır.

### Izgara sınıfı yok

`.grid`'in doğrudan çocukları ızgara öğeleridir, bu nedenle onları açıkça bir `.g-col` sınıfı eklemeden boyutlandıracaklardır.

  Otomatik sütun
  Otomatik sütun
  Otomatik sütun

### Sütunlar ve boşluklar

Sütun sayısını ve boşluğu ayarlayın.

  .g-col-2
  .g-col-2

  .g-col-6
  .g-col-4

### Satır ekleme

Daha fazla satır ekleyin ve sütunların yerleşimini değiştirin:

  Otomatik sütun
  Otomatik sütun
  Otomatik sütun

### Boşluklar

Yalnızca dikey boşlukları `row-gap`’ı değiştirerek değiştirin. `.grid`'lerde `gap` kullanıyoruz, ancak `row-gap` ve `column-gap` gerektiği gibi değiştirilebilir.

  .g-col-6
  .g-col-6

  .g-col-6
  .g-col-6

Bunun sonucunda, farklı dikey ve yatay `gap`'lere sahip olabilirsiniz; bu tek bir değer (tüm kenarlar) veya bir çift değer (dikey ve yatay) alabilir. Bu, `gap` için çevrimiçi bir stil ile veya `--cui-gap` CSS değişkenimizle uygulanabilir.

  .g-col-6
  .g-col-6

  .g-col-6
  .g-col-6

## Sass

CSS Grid'in bir sınırlaması, varsayılan sınıflarımızın hala iki Sass değişkeni, `$grid-columns` ve `$grid-gutter-width` tarafından oluşturulmasıdır. Bu, derlenmiş CSS'mizde üretilen sınıfların sayısını önceden belirlemiş olur. Burada iki seçeneğiniz vardır:

- Bu varsayılan Sass değişkenlerini değiştirin ve CSS'nizi yeniden derleyin.
- Sağlanan sınıfları artırmak için çevrimiçi veya özel stiller kullanın.

Örneğin, sütun sayısını artırabilir ve boşluk boyutunu değiştirebilir ve ardından "sütunlarınızı" çevrimiçi stil ve önceden tanımlı CSS Grid sütun sınıflarının (örneğin, `.g-col-4`) karışımı ile boyutlandırabilirsiniz.

  14 sütun
  .g-col-4

