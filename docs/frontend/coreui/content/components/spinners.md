---
description: Bootstrap spinnerları ile bir bileşenin veya sayfanın yüklenme durumunu gösterin. Bu içerik, spinnerların nasıl kullanılacağı ve özelleştirileceği hakkında kapsamlı bilgi sunmaktadır. 
keywords: [spinner, Bootstrap, yüklenme durumu, CSS, özelleştirme]
---

## Hakkında

Bootstrap "spinnerları", projelerinizde yüklenme durumunu göstermek için kullanılabilir. Sadece HTML ve CSS ile inşa edilmiştir, bu nedenle bunları oluşturmak için herhangi bir JavaScript'e ihtiyacınız yoktur. Ancak, görünürlüklerini değiştirmek için bazı özel JavaScript'lere ihtiyacınız olacak. Görünümü, hizalaması ve boyutu, harika yardımcı sınıflarımızla kolayca özelleştirilebilir.

Erişilebilirlik amacıyla, burada her yükleyici `role="status"` ve iç içe bir `Yükleniyor...` içerir.

:::info
Bootstrap spinnerları, web uygulamalarında kullanıcı deneyimini artırmak için yükleme sürelerinde görünür geri bildirim sağlar.
:::

---

## Kenar spinnerı

Hafif bir yükleme göstergesi için kenar spinnerlarını kullanın.

  Yükleniyor...

### Renkler

Kenar spinnerı, `border-color` için `currentColor` kullanır; bu, rengi [metin rengi yardımcıları][color] ile özelleştirebileceğiniz anlamına gelir. Standart spinner üzerinde herhangi bir metin rengi yardımcılarını kullanabilirsiniz.



{{- range (index $.Site.Data "theme-colors") }}

  Yükleniyor...

{{- end -}}

:::tip
**`border-color` yardımcılarını neden kullanmıyorsunuz?** Her kenar spinnerı, en az bir kenar için `transparent` bir kenar belirtir, bu nedenle `.border-{color}` yardımcıları bunu geçersiz kılacaktır.
:::

---

## Büyüyen spinner

Eğer bir kenar spinnerını tercih etmiyorsanız, büyüyen spinnera geçin. Teknik olarak dönmese de, sürekli olarak büyür!

  Yükleniyor...

Bir kez daha, bu spinner `currentColor` ile inşa edilmiştir, bu nedenle görünümünü [metin rengi yardımcıları][color] ile kolayca değiştirebilirsiniz. İşte burada mavi olarak ve desteklenen varyantlarla birlikte.



{{- range (index $.Site.Data "theme-colors") }}

  Yükleniyor...

{{- end -}}

---

## Hizalama

Bootstrap'taki spinnerlar `rem`, `currentColor` ve `display: inline-flex` kullanılarak inşa edilmiştir. Bu, boyutlarının kolayca değiştirilmesi, renklerinin değiştirilmesi ve hızlı bir şekilde hizalanması anlamına gelir.

### Kenar Boşluğu

Kolay boşluk için [.m-5][margin] gibi kenar boşluğu yardımcılarını kullanın.

  Yükleniyor...

### Yerleşim

Spinnerları, herhangi bir durumda ihtiyaç duyduğunuz tam yere yerleştirmek için [flexbox yardımcıları][flex], [float yardımcıları][float] veya [metin hizalama][text] yardımcılarını kullanın.

#### Flex

  
    Yükleniyor...
  

  Yükleniyor...
  

#### Floats

  
    Yükleniyor...
  

#### Metin hizalaması

  
    Yükleniyor...
  

---

## Boyut

Daha küçük bir spinner yapmak için .spinner-border-sm ve .spinner-grow-sm ekleyin; bu, diğer bileşenler içinde hızlıca kullanılabilir.

  Yükleniyor...


  Yükleniyor...

Ya da boyutları gerektiği gibi değiştirmek için özel CSS veya inline stiller kullanın.

  Yükleniyor...


  Yükleniyor...

---

## Düğmeler

Bir eylemin mevcut olarak işlenmekte olduğunu belirtmek için spinnerları düğmeler içinde kullanın. Ayrıca, spinner öğesinin metnini değiştirebilir ve ihtiyaç duyduğunuz gibi düğme metnini kullanabilirsiniz.

  
  Yükleniyor...


  
  Yükleniyor...

  
  Yükleniyor...


  
  Yükleniyor...

---

## Özelleştirme

### CSS değişkenleri

Spinnerlar, gerçek zamanlı özelleştirme için `.spinner-border` ve `.spinner-grow` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenlerinin değerleri Sass aracılığıyla ayarlanır, bu nedenle Sass özelleştirmesi de hala desteklenmektedir.

Kenar spinnerı değişkenleri:

Büyüyen spinner değişkenleri:

Her iki spinner için, bu CSS değişkenlerinin değerlerini gerektiği gibi güncellemek için küçük spinner modifiye sınıfları kullanılır. Örneğin, `.spinner-border-sm` sınıfı şöyle çalışır:

### SASS değişkenleri

### Anahtar kareler

Spinnerlar için CSS animasyonları oluşturmak için kullanılır. `scss/_spinners.scss` içinde bulunmaktadır.

[color]:   
[display]: 
[flex]:    
[float]:   
[margin]:  
[sizing]:  
[text]:    