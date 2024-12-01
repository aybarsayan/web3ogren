---
description: Yeniden Başlat, tek bir dosya içinde elemanlara özgü CSS değişikliklerinin bir koleksiyonu olup, Bootstrap için CoreUI'yi başlatmakta, şık, tutarlı ve basit bir temel sunmaktadır. Bu belgedeki içerikler, CSS değişkenleri, sayfa varsayılanları ve formlar hakkında bilgi sunmaktadır.
keywords: [Yeniden Başlat, CoreUI, CSS, Bootstrap, tasarım, kullanıcı arayüzü, stil]
---

# Yeniden Başlatma


## Yaklaşım

Yeniden Başlat, Normalize üzerine inşa edilmiştir ve birçok HTML öğesine yalnızca öğe seçicilerini kullanarak belirli bir stil vermektedir. Ek stillendirme yalnızca sınıflarla yapılmaktadır. Örneğin, bazı `` stillerini daha basit bir temel için yeniden başlatıyor ve daha sonra `.table`, `.table-bordered` gibi sınıflar sağlıyoruz.

:::tip
Daha ölçeklenebilir bileşen boşluğu kullanmak için varsayılan değerleri güncelleyin.
:::

Yeniden Başlat'ta neleri geçersiz kılacağımızla ilgili kılavuzlarımız ve nedenlerimiz şunlardır:

- Daha ölçeklenebilir bileşen boşluğu için bazı tarayıcı varsayılan değerlerini `em` yerine `rem` olarak güncelleyin.
- `margin-top` kullanmaktan kaçının. Dikey kenar boşlukları çökebilir ve beklenmedik sonuçlar verebilir. Daha önemlisi, tek bir yönlü `margin` daha basit bir zihinsel model sunar.
- Cihaz boyutları arasında daha kolay ölçeklenme için, blok öğeleri `margin`'leri için `rem` kullanmalıdır.
- `font` ile ilgili özelliklerin beyanını minimumda tutun, mümkün olduğunca `inherit` kullanın.

## CSS Değişkenleri

v4.1.0 ile birlikte, gereken `@import`'larımızı tüm CSS paketlerimizde (şunları içeren: `coreui.css`, `coreui-reboot.css` ve `coreui-grid.css`) `_root.scss`'i de dahil ederek standart hale getirdik. Bu, kullanılan paket sayısından bağımsız olarak tüm paketlere `:root` düzeyinde CSS değişkenleri ekler. Sonuç olarak, CoreUI zamanla daha fazla CSS değişkeni görmeye devam edecektir.

## Sayfa Varsayılanları

`` ve `` öğeleri, sayfa genelinde daha iyi varsayılanlar sağlamak için güncellenmiştir. Daha spesifik olarak:

- `box-sizing`, her öğede—`*::before` ve `*::after` dahil—`border-box` olarak küresel olarak ayarlanmıştır. Bu, öğenin beyan edilen genişliğinin, dolgu veya kenarlık nedeniyle aşılmamasını garanti eder.
  - `` üzerinde temel bir `font-size` beyan edilmemiştir, ancak `16px` varsayılan olarak kabul edilmiştir (tarayıcı varsayıtanı). Kullanıcı tercihlerine saygı gösterirken ve daha erişilebilir bir yaklaşım sağlarken, `` üzerinde `font-size: 1rem` uygulandı. Bu tarayıcı varsayıtı `$font-size-root` değişkenini değiştirerek geçersiz kılınabilir.
- `` ayrıca küresel bir `font-family`, `font-weight`, `line-height` ve `color` ayarlar. Bu daha sonra bazı form öğeleri tarafından yazı tipi tutarsızlıklarını önlemek için devralınır.
- Güvenlik için `` üzerinde belirtilmiş bir `background-color` vardır ve varsayılan olarak `#fff`'dir.

## Yerel Yazı Tipi Yığınları

CoreUI for Bootstrap, her cihaz ve işletim sistemi için optimum metin renderı sağlamak üzere "yerel yazı tipi yığını" veya "sistem yazı tipi yığını" kullanmaktadır. Bu sistem yazı tipleri, günümüz cihazları düşünülerek, ekranlarda iyileştirilmiş görüntüleme, değişken yazı tipi desteği ve daha fazlasıyla tasarlanmıştır. [Bu *Smashing Magazine* makalesinde](https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/) yerel yazı tipi yığınları hakkında daha fazla bilgi edinebilirsiniz.

```scss
$font-family-sans-serif:
  // Platformlar arası genel yazı tipi ailesi (varsayılan kullanıcı arayüzü yazı tipi)
  system-ui,
  // macOS ve iOS için Safari (San Francisco)
  -apple-system,
  // Windows
  "Segoe UI",
  // Android
  Roboto,
  // eski macOS ve iOS
  "Helvetica Neue",
  // Linux
  "Noto Sans",
  "Liberation Sans",
  // Temel web yedeği
  Arial,
  // Sans serif yedeği
  sans-serif,
  // Emoji yazı tipleri
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !default;
```

Yazı tipi yığını emoji yazı tiplerini içerdiğinden, birçok yaygın sembol/dingbat unicode karakteri çok renkte piktoğraflar olarak render edilir. Görünümü, tarayıcı/platformun yerel emoji yazı tipi stiline bağlı olarak değişir ve CSS `color` stillerinden etkilenmez.

> Bu `font-family`, ``'ye uygulanır ve Bootstrap genelinde otomatik olarak devralınır. Küresel `font-family` değiştirildiğinde, `$font-family-base` güncellenmeli ve Bootstrap yeniden derlenmelidir. — Yeniden Başlat Ekibi

## Başlıklar ve Paragraflar

Tüm başlık öğeleri—örneğin, ``—ve `` kenar boşluğu kaldırılarak sıfırlanır. Başlıklara `margin-bottom: .5rem` ve paragraflara `margin-bottom: 1rem` eklenerek kolay bir boşluk sağlanır.


| Başlık | Örnek |
| --- | --- |
| `` | h1. Bootstrap başlığı |
| `` | h2. Bootstrap başlığı |
| `` | h3. Bootstrap başlığı |
| `` | h4. Bootstrap başlığı |
| `` | h5. Bootstrap başlığı |
| `` | h6. Bootstrap başlığı |
## Yatay Kurallar

`` öğesi basitleştirilmiştir. Tarayıcı varsayıtlarına benzer şekilde, ``'ler `border-top` ile stillendirilir, varsayılan olarak `opacity: .25` olarak ayarlanır ve otomatik olarak kenar rengini `color` ile devralır, `color` ana tarafından ayarlandığında da dahil. Metin, kenar ve opasite yardımcı programları ile değiştirilebilir.



  




## Listeler

Tüm listeler—``, `` ve ``—`margin-top`'ları kaldırılır ve `margin-bottom: 1rem` olarak ayarlanır. İç içe geçmiş listelerin `margin-bottom`'u olmaz. `` ve `` öğelerinde `padding-left` da sıfırlanmıştır.



* Tüm listelerin üst kenar boşlukları kaldırılmıştır
* Alt kenar boşlukları normalleştirilmiştir
* İç içe geçmiş listeler alt kenar boşluğu olmaz
  * Bu şekilde daha dengeli bir görünüm elde edilir
  * Özellikle daha fazla liste maddesinden sonra
* Sol dolgu da sıfırlanmıştır

1. İşte sıralı bir liste
2. Birkaç liste maddesi
3. Aynı genel görünümü var
4. Önceki sırasız listeyle

Daha basit stillendirme, net hiyerarşi ve daha iyi boşluk için, açıklama listelerinin `margin`'leri güncellenmiştir. ``'lerin `margin-left`'ı `0` olarak sıfırlanır ve `margin-bottom: .5rem` eklenir. ``'ler **kalın** olarak ifade edilir.


  
    Açıklama listeleri
    Açıklama listesi terimleri tanımlamak için mükemmeldir.
    Terim
    Terim için tanım.
    Aynı terim için ikinci bir tanım.
    Diğer terim
    Bu diğer terim için tanım.
  


## Satır İçi Kod

Satır içi kod parçacıklarını `` ile sarmalayın. HTML açılış ve kapanış köşeli parantezlerini kaçırmayı unutmayın.


Örneğin, &lt;section&gt; satır içi olarak sarılmalıdır.
## Kod Blokları

Birden fazla kod satırı için `` kullanın. Doğru bir şekilde görüntülenmesi için kodda herhangi bir açılış ve kapanış köşeli parantezini kaçırmayı unutmayın. `` öğesi, `margin-top`'unu kaldırmak ve `margin-bottom`'u `rem` birimleri olarak ayarlamak için sıfırlanır.


&lt;p&gt;Örnek metin burada...&lt;/p&gt;
&lt;p&gt;Ve burada başka bir örnek metin...&lt;/p&gt;

## Değişkenler

Değişkenleri belirtmek için `` etiketini kullanın.


y = mx + b
## Kullanıcı Girişi

Klavye ile genellikle girilen girişi belirtmek için `` kullanın.


Dizini değiştirmek için cd yazın, ardından dizinin adını yazın.
Ayarları düzenlemek için ctrl + , tuşlarına basın.
## Örnek Çıktı

Bir programdan örnek çıkışı belirtmek için `` etiketini kullanın.


Bu metin, bir bilgisayar programından örnek çıktı olarak ele alınmalıdır.
## Tablolar

Tablolar, `` stillerini ayarlamak, kenarları birleştirmek ve tutarlı `text-align` sağlamak için hafifçe ayarlanmıştır. Kenarlar, doldurmalar ve daha fazlası için ek değişiklikler `.table` sınıfı` ile gelir.

  
    Bu bir örnek tablodur ve içerikleri açıklamak için başlığıdır.
  
  
    
      Tablo başlığı
      Tablo başlığı
      Tablo başlığı
      Tablo başlığı
    
  
  
    
      Tablo hücresi
      Tablo hücresi
      Tablo hücresi
      Tablo hücresi
    
    
      Tablo hücresi
      Tablo hücresi
      Tablo hücresi
      Tablo hücresi
    
    
      Tablo hücresi
      Tablo hücresi
      Tablo hücresi
      Tablo hücresi
    
  

## Formlar

Çeşitli form öğeleri, daha basit temel stiller için yeniden başlatılmıştır. İşte en dikkate değer değişikliklerden bazıları:

- ``'lerin kenarları, dolguları veya kenar boşlukları yoktur, bu yüzden bireysel girdiler veya girdiler grupları için rahatlıkla sarmalar olarak kullanılabilirler.
- ``'ler, alan setleri gibi, belirli bir türde başlık olarak gösterilecek şekilde de yeniden stillendirilmiştir.
- ``'ler `margin` uygulanabilmesi için `display: inline-block` olarak ayarlanmıştır.
- ``ler, ``ler, ``lar ve ``ler çoğunlukla Normalize tarafından ele alınmaktadır, ancak Yeniden Başlat, `margin`'lerini kaldırır ve `line-height: inherit` ayarlamasını da gerçekleştirir.
- ``lar yalnızca dikey olarak yeniden boyutlandırılacak şekilde değiştirilmiştir, çünkü yatay yeniden boyutlandırma genellikle sayfa tasarımını "bozuyor".
- `` ve `` buton öğeleri, `:not(:disabled)` durumunda `cursor: pointer` olarak ayarlanmıştır.

:::info
Bu değişiklikler ve daha fazlası aşağıda gösterilmektedir.
:::


  
    Örnek başlık
    
      Örnek giriş
      
    
    
      Örnek e-posta
      
    
    
      Örnek telefon
      
    
    
      Örnek url
      
    
    
      Örnek sayı
      
    
    
      Örnek arama
      
    
    
      Örnek aralık
      
    
    
      Örnek dosya girişi
      
    
    
      Örnek seçim
      
        Seçiniz...
        
          Seçenek 1
          Seçenek 2
          Seçenek 3
        
        
          Seçenek 4
          Seçenek 5
          Seçenek 6
        
      
    
    
      
        
        Bu onay kutusunu işaretleyin
      
    
    
      
        
        Seçenek bir budur
      
      
        
        Seçenek iki başka bir şeydir, bunun yanı sıra form kontrolleriyle ilgili düzeni gösterir.
      
      
        
        Seçenek üç devre dışı bırakılmıştır
      
    
    
      Örnek metin alanı
      
    
    
      Örnek tarih
      
    
    
      Örnek saat
      
    
    
      Örnek parolası
      
    
    
      Örnek tarih-saat
      
    
    
      Örnek hafta
      
    
    
      Örnek ay
      
    
    
      Örnek renk
      
    
    
      Örnek çıktı
      100
    
    
      Buton gönder
      
      
      
    
    
      Buton gönder
      
      
      
    
  


:::warning
Yeniden Başlat, `role="button"` için varsayılan imleci `pointer` olarak değiştirmek için bir geliştirme içerir. Bu öğelere bu niteliği ekleyerek, öğelerin etkileşimli olduğunu belirtmeye yardım edin. Bu rol, kendisine özel `cursor` değişikliği olan `` öğeleri için gerekli değildir.
:::


Buton olmayan bir öğe
## Çeşitli Öğeler

### Adres

`` öğesi, tarayıcı varsayıtan `font-style`'ını `italic`'ten `normal`'e sıfırlamak için güncellenmiştir. `line-height` artık devralınmaktadır ve `margin-bottom: 1rem` eklenmiştir. ``'ler, en yakın ataya (veya bir tüm eser bütünü) ait iletişim bilgilerini sunmak için kullanılır. Satır sonlarını `` ile bitirerek biçimlendirmeyi koruyun.


  
    Twitter, Inc.
    1355 Market St, Suite 900
    San Francisco, CA 94103
    P: (123) 456-7890
  

  
    Tam İsim
    first.last@example.com
  


### Alıntı

Alıntıların varsayılan `margin`'ı `1em 40px` olduğu için, bunu `0 0 1rem` olacak şekilde resetledik ki diğer öğelerle daha uyumlu bir görünüm sağlasın.


  
    İyi bilinen bir alıntı, bir alıntı öğesi içinde yer almaktadır.
  
  Ünlü bir kişinin Kaynak Başlığı


### Satır İçi Öğeler

`` öğesi, paragraflar arasında öne çıkması için temel stil kazanır.


  Nulla attr vitae elit libero, a pharetra augue.


### Özet

Özet üzerinde varsayılan `cursor` `text` olarak ayarlandığından, bunu `pointer` olarak sıfırlıyoruz ki bu öğenin üzerine tıklayarak etkileşimde bulunulabileceğini vurgulasın.


  
    Bazı detaylar
    Detaylar hakkında daha fazla bilgi.
  

  
    Daha fazla detay
    Detaylar hakkında çok daha fazla bilgi burada.
  


## HTML5 `[hidden]` Niteliği

HTML5, [yeni bir küresel niteliği olan `[hidden]`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) ekler. Bu varsayılan olarak `display: none` şeklinde stillendirilir. [PureCSS](https://purecss.io/) fikrinden esinlenerek, `[hidden] { display: none !important; }` yaparak, görüntüleme nin yanlışlıkla geçersiz kılınmasını önlemek için varsayılanı iyileştiriyoruz.

```html
<input type="text" hidden>
```

:::warning
##### jQuery uyumsuzluğu

`[hidden]`, jQuery'nin `$(...).hide()` ve `$(...).show()` yöntemleriyle uyumlu değildir. Bu nedenle, mevcut durumda `[hidden]`'i diğer teknikler üzerinde özellikle öneriyoruz.
:::

Bir öğenin görünürlüğünü yalnızca geçici olarak değiştirmek için, anlamına geliyor ki `display` değiştirilmez ve öğe belgenin akışını hala etkileyebilir, bunun yerine `.invisible` sınıfını` kullanın.