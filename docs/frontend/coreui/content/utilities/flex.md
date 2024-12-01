---
description: Flexbox, ızgara sütunlarını ve bileşenleri hızlı bir şekilde yönetmenizi sağlar. Güçlü flex özellikleri ile daha karmaşık düzenler oluşturabilirsiniz.
keywords: [Flexbox, Responsive Design, CSS, Flex Utilities, Layouts]
---

# Flex davranışlarını etkinleştirin

Flexbox konteyneri oluşturmak ve **doğrudan çocuk öğeleri** flex öğelerine dönüştürmek için `display` yardımcı programlarını uygulayın. Flex konteynerleri ve öğeleri, ek flex özellikleri ile daha fazla değiştirilebilir.


Ben bir flexbox konteyneriyim!

Ben bir satır içi flexbox konteyneriyim!
`.d-flex` ve `.d-inline-flex` için de duyarlı varyasyonlar mevcuttur.



{{- range $.Site.Data.breakpoints }}
- `.d{{ .abbr }}-flex`
- `.d{{ .abbr }}-inline-flex`
{{- end -}}

## Yön

Bir flex konteynerindeki flex öğelerinin yönünü, yön yardımcı programları ile ayarlayın. Çoğu durumda, burada yatay sınıfı atlayabilirsiniz çünkü tarayıcı varsayılanı `row`'dur. Ancak, bu değeri açıkça ayarlamanız gereken durumlar da olabilir (duyarlı düzenler gibi).

:::tip
Yatay yönü ayarlamak için `.flex-row` kullanın.
:::

Yatay yönü karşıt taraftan başlatmak için `.flex-row-reverse` kullanın.

  Flex öğesi 1
  Flex öğesi 2
  Flex öğesi 3


  Flex öğesi 1
  Flex öğesi 2
  Flex öğesi 3

:::note
Dikey yönü ayarlamak için `.flex-column` kullanın veya dikey yönü karşıt taraftan başlatmak için `.flex-column-reverse` kullanın.
:::

  Flex öğesi 1
  Flex öğesi 2
  Flex öğesi 3


  Flex öğesi 1
  Flex öğesi 2
  Flex öğesi 3

`flex-direction` için de duyarlı varyasyonlar mevcuttur.



{{- range $.Site.Data.breakpoints }}
- `.flex{{ .abbr }}-row`
- `.flex{{ .abbr }}-row-reverse`
- `.flex{{ .abbr }}-column`
- `.flex{{ .abbr }}-column-reverse`
{{- end -}}

## İçeriği hizala

Flexbox konteynerlerinde `justify-content` yardımcı programlarını kullanarak, flex öğelerinin ana eksendeki hizalamasını değiştirebilirsiniz. `start`, `end`, `center`, `between`, `around` veya `evenly` seçeneklerinden birini seçin.

:::info
`justify-content` değerleri için duyarlı varyasyonlar mevcuttur.
:::


  
    Flex öğesi
    Flex öğesi
    Flex öğesi
  
  
    Flex öğesi
    Flex öğesi
    Flex öğesi
  
  
    Flex öğesi
    Flex öğesi
    Flex öğesi
  
  
    Flex öğesi
    Flex öğesi
    Flex öğesi
  
  
    Flex öğesi
    Flex öğesi
    Flex öğesi
  
  
    Flex öğesi
    Flex öğesi
    Flex öğesi
  


```html
<div class="d-flex justify-content-start">...</div>
<div class="d-flex justify-content-end">...</div>
<div class="d-flex justify-content-center">...</div>
<div class="d-flex justify-content-between">...</div>
<div class="d-flex justify-content-around">...</div>
<div class="d-flex justify-content-evenly">...</div>
```

`justify-content` için de duyarlı varyasyonlar mevcuttur.



{{- range $.Site.Data.breakpoints }}
- `.justify-content{{ .abbr }}-start`
- `.justify-content{{ .abbr }}-end`
- `.justify-content{{ .abbr }}-center`
- `.justify-content{{ .abbr }}-between`
- `.justify-content{{ .abbr }}-around`
- `.justify-content{{ .abbr }}-evenly`
{{- end -}}

## Öğeleri hizala

Flexbox konteynerlerinde `align-items` yardımcı programlarını kullanarak, flex öğelerinin çapraz eksendeki hizalamasını değiştirebilirsiniz. `start`, `end`, `center`, `baseline` veya `stretch` (tarayıcı varsayılanı) seçeneklerini tercih edin.

:::warning
Flexbox düzenlemesi yapılırken, öğe hizalamasına dikkat edilmelidir.
:::


  
    Flex öğesi
    Flex öğesi
    Flex öğesi
  
  
    Flex öğesi
    Flex öğesi
    Flex öğesi
  
  
    Flex öğesi
    Flex öğesi
    Flex öğesi
  
  
    Flex öğesi
    Flex öğesi
    Flex öğesi
  
  
    Flex öğesi
    Flex öğesi
    Flex öğesi
  


```html
<div class="d-flex align-items-start">...</div>
<div class="d-flex align-items-end">...</div>
<div class="d-flex align-items-center">...</div>
<div class="d-flex align-items-baseline">...</div>
<div class="d-flex align-items-stretch">...</div>
```

`align-items` için de duyarlı varyasyonlar mevcuttur.



{{- range $.Site.Data.breakpoints }}
- `.align-items{{ .abbr }}-start`
- `.align-items{{ .abbr }}-end`
- `.align-items{{ .abbr }}-center`
- `.align-items{{ .abbr }}-baseline`
- `.align-items{{ .abbr }}-stretch`
{{- end -}}

## Kendini hizala

Flexbox öğeleri üzerinde `align-self` yardımcı programlarını kullanarak, bireysel olarak çapraz eksendeki hizalamalarını değiştirebilirsiniz. `align-items` ile aynı seçenekleri seçin: `start`, `end`, `center`, `baseline` veya `stretch` (tarayıcı varsayılanı).

:::info
`align-self` özellikleri, belirli öğelerin hizalamasını özelleştirmek için kullanılır.
:::


  
    Flex öğesi
    Hizalanmış flex öğesi
    Flex öğesi
  
  
    Flex öğesi
    Hizalanmış flex öğesi
    Flex öğesi
  
  
    Flex öğesi
    Hizalanmış flex öğesi
    Flex öğesi
  
  
    Flex öğesi
    Hizalanmış flex öğesi
    Flex öğesi
  
  
    Flex öğesi
    Hizalanmış flex öğesi
    Flex öğesi
  


```html
<div class="align-self-start">Hizalanmış flex öğesi</div>
<div class="align-self-end">Hizalanmış flex öğesi</div>
<div class="align-self-center">Hizalanmış flex öğesi</div>
<div class="align-self-baseline">Hizalanmış flex öğesi</div>
<div class="align-self-stretch">Hizalanmış flex öğesi</div>
```

`align-self` için de duyarlı varyasyonlar mevcuttur.



{{- range $.Site.Data.breakpoints }}
- `.align-self{{ .abbr }}-start`
- `.align-self{{ .abbr }}-end`
- `.align-self{{ .abbr }}-center`
- `.align-self{{ .abbr }}-baseline`
- `.align-self{{ .abbr }}-stretch`
{{- end -}}

## Doldur

Bir dizi kardeş öğeye `.flex-fill` sınıfını kullanarak, onları içeriklerine eşit genişlikler almak için zorlayarak, mevcut yatay alanı tamamen doldurabilirsiniz.

:::warning
Boş alan bırakıldığında `.flex-fill` doğru çalışmayabilir.
:::

  Bol içeriğe sahip flex öğesi
  Flex öğesi
  Flex öğesi

`flex-fill` için de duyarlı varyasyonlar mevcuttur.



{{- range $.Site.Data.breakpoints }}
- `.flex{{ .abbr }}-fill`
{{- end -}}

## Büyüt ve küçült

Bir flex öğesinin mevcut alanı doldurma yeteneğini açıp kapatmak için `.flex-grow-*` yardımcı programlarını kullanın. Aşağıdaki örnekte, `.flex-grow-1` öğeleri, kalan iki flex öğesine gerekli alanı bırakırken alabileceği tüm mevcut alanı kullanır.

:::note
`.flex-grow` kullanımı ile öğelerin genişliği artırılabilir.
:::

  Flex öğesi
  Flex öğesi
  Üçüncü flex öğesi

Gerekirse bir flex öğesinin küçülme yeteneğini açıp kapatmak için `.flex-shrink-*` yardımcı programlarını kullanın. Aşağıdaki örnekte, `.flex-shrink-1`'e sahip ikinci flex öğesi, önceki flex öğesi ile daha fazla alan sağlamak amacıyla içeriğini yeni bir satıra sarmaya zorlanır.

:::info
`.flex-shrink` öğelerin boyutunu azaltmak için kullanılır.
:::

  Flex öğesi
  Flex öğesi

`flex-grow` ve `flex-shrink` için de duyarlı varyasyonlar mevcuttur.



{{- range $.Site.Data.breakpoints }}
- `.flex{{ .abbr }}-{grow|shrink}-0`
- `.flex{{ .abbr }}-{grow|shrink}-1`
{{- end -}}

## Otomatik kenar boşlukları

Flexbox, otomatik kenar boşluklarıyla birlikte flex hizalamalarını birbirine karıştırdığınızda oldukça harika şeyler yapabilir. Aşağıda, otomatik kenar boşluklarıyla flex öğelerini kontrol etmenin üç örneği gösterilmiştir: varsayılan (otomatik kenar boşluğu yok), iki öğeyi sağa itme (`.me-auto`) ve iki öğeyi sola itme (`.ms-auto`).

  Flex öğesi
  Flex öğesi
  Flex öğesi



  Flex öğesi
  Flex öğesi
  Flex öğesi



  Flex öğesi
  Flex öğesi
  Flex öğesi

### Align-items ile

Bir flex öğesini bir konteynerin üstüne veya altına dikey olarak kaldırmak için `align-items`, `flex-direction: column` ve `margin-top: auto` veya `margin-bottom: auto` karıştırarak kullanın.

  Flex öğesi
  Flex öğesi
  Flex öğesi



  Flex öğesi
  Flex öğesi
  Flex öğesi

## Sarma

Bir flex konteynerindeki flex öğelerinin nasıl sarılacağını değiştirin. Hiçbir sarma yok (tarayıcı varsayılanı) olan `.flex-nowrap`, sarma olan `.flex-wrap` veya ters sarma olan `.flex-wrap-reverse` seçeneklerinden birini seçin.


  
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
  


```html
<div class="d-flex flex-nowrap">
  ...
</div>
```


  
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
  


```html
<div class="d-flex flex-wrap">
  ...
</div>
```


  
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
  


```html
<div class="d-flex flex-wrap-reverse">
  ...
</div>
```

`flex-wrap` için de duyarlı varyasyonlar mevcuttur.



{{- range $.Site.Data.breakpoints }}
- `.flex{{ .abbr }}-nowrap`
- `.flex{{ .abbr }}-wrap`
- `.flex{{ .abbr }}-wrap-reverse`
{{- end -}}

## Sıra

Belirli flex öğelerinin _görsel_ sırasını, bir dizi `order` yardımcı programı ile değiştirin. Bir öğeyi birinci veya sonuncu yapmak için yalnızca seçenekler sağlıyoruz; ayrıca DOM sırasını kullanmak için bir sıfırlama sağlıyoruz. `order`, 0'dan 5'e kadar herhangi bir tam sayı değeri alabileceği için, gerekli olan ek değerler için özel CSS ekleyin.

:::tip
`order` ile öğelerin görsel sırasını değiştirmek mümkündür.
:::

  Birinci flex öğesi
  İkinci flex öğesi
  Üçüncü flex öğesi

`order` için de duyarlı varyasyonlar mevcuttur.



{{- range $bp := $.Site.Data.breakpoints -}}
{{- range (seq 0 5) }}
- `.order{{ $bp.abbr }}-{{ . }}`
{{- end -}}
{{- end -}}

Ek olarak, bir öğenin sırasını `order: -1` ve `order: 6` uygulayarak değiştiren duyarlı `.order-first` ve `.order-last` sınıfları da mevcuttur.



{{- range $bp := $.Site.Data.breakpoints -}}
{{- range (slice "first" "last") }}
- `.order{{ $bp.abbr }}-{{ . }}`
{{- end -}}
{{- end -}}

---
description: Flexbox konteynerlerinde hizalama seçeneklerini kullanarak öğeleri çapraz eksende nasıl hizalayacağınızı keşfedin. Responsive varyasyonlarla birlikte farklı hizalama stillerini uygulamak için ipuçları içerir.
keywords: [flexbox, align-content, responsive, Bootstrap, yardımcı sınıflar]
---

## İçeriği Hizala

Flexbox konteynerlerinde `align-content` yardımcı sınıflarını kullanarak flex öğeleri *birlikte* çapraz eksende hizalayın. `start` (tarayıcı varsayılanı), `end`, `center`, `between`, `around` veya `stretch` seçeneklerinden birini seçin. Bu yardımcıları göstermek için `flex-wrap: wrap` uyguladık ve flex öğe sayısını artırdık.

> **Dikkat!** Bu özelliğin tek satırlık flex öğeleri üzerinde hiçbir etkisi yoktur.  
> — "Flexbox Kullanım Kılavuzu"

---


  
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
  


```html
<div class="d-flex align-content-start flex-wrap">
  ...
</div>
```

---


  
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
  


```html
<div class="d-flex align-content-end flex-wrap">...</div>
```

---


  
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi

    Flex öğesi    
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
  


```html
<div class="d-flex align-content-center flex-wrap">...</div>
```

---


  
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
  


```html
<div class="d-flex align-content-between flex-wrap">...</div>
```

---


  
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
  


```html
<div class="d-flex align-content-around flex-wrap">...</div>
```

---


  
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
    Flex öğesi
  


```html
<div class="d-flex align-content-stretch flex-wrap">...</div>
```

Responsive varyasyonlar da `align-content` için mevcuttur.


Responsive Özellikler
  
- `.align-content{{ .abbr }}-start`
- `.align-content{{ .abbr }}-end`
- `.align-content{{ .abbr }}-center`
- `.align-content{{ .abbr }}-around`
- `.align-content{{ .abbr }}-stretch`
  


## Medya nesnesi

Bootstrap 4'teki [medya nesnesi bileşenini](https://getbootstrap.com/docs/4.6/components/media-object/) yeniden oluşturmak mı istiyorsunuz? Bunu birkaç flex yardımcı sınıfı ile hızlıca yeniden oluşturabilirsiniz; bu sayede daha fazla esneklik ve özelleştirme sağlanır.

  
    
  
  
    Bu bir medya bileşeninden gelen içeriktir. Bunu istediğiniz içerikle değiştirebilir ve gerektiği gibi ayarlayabilirsiniz.
  

Ve içeriği görselin yanında dikey olarak ortalamak istiyorsanız:

  
    
  
  
    Bu bir medya bileşeninden gelen içeriktir. Bunu istediğiniz içerikle değiştirebilir ve gerektiği gibi ayarlayabilirsiniz.
  

## SASS

### Yardımcı Sınıflar API

Flexbox yardımcı sınıfları `scss/_utilities.scss` dosyasında tanımlanmıştır. `Yardımcı sınıflar API'sini nasıl kullanacağınızı öğrenin.`

