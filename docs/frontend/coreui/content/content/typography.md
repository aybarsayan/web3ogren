---
description: Bootstrap tipografisi için dökümantasyon ve örnekler, küresel ayarlar, başlıklar, gövde metni, listeler ve daha fazlasını içerir.
keywords: [Bootstrap, tipografi, HTML, stil, SASS]
---

# Tipografi

## Küresel ayarlar

CoreUI for Bootstrap, temel küresel görüntüleme, tipografi ve bağlantı stillerini ayarlar. Daha fazla kontrol gerektiğinde, `metin yardımcı sınıflarını` kontrol edin.

- Her işletim sistemi ve cihaz için en iyi `font-family`'yi seçen bir `yerel font yığını` kullanın.
- Daha kapsayıcı ve erişilebilir bir tipografi ölçeği için, ziyaretçilerin ihtiyaçlarına göre tarayıcı varsayılanlarını özelleştirebilmeleri için tarayıcının varsayılan kök `font-size`'ını (genellikle 16px) kullanıyoruz.
- ``'ye uygulanan tipografik temel olarak `$font-family-base`, `$font-size-base` ve `$line-height-base` özniteliklerini kullanın.
- Küresel bağlantı rengini `$link-color` ile ayarlayın.
- ``'de bir `background-color` ayarlamak için `$body-bg` kullanın (`varsayılan olarak #fff`).

Bu stiller `_reboot.scss` içinde bulunabilir ve küresel değişkenler `_variables.scss` dosyasında tanımlanmıştır. **$font-size-base**'i `rem` cinsinden ayarladığınızdan emin olun.

## Başlıklar

Tüm HTML başlıkları, ``'den ``'ya kadar mevcuttur.


| Başlık | Örnek |
| --- | --- |
| `` | h1. Bootstrap başlığı |
| `` | h2. Bootstrap başlığı |
| `` | h3. Bootstrap başlığı |
| `` | h4. Bootstrap başlığı |
| `` | h5. Bootstrap başlığı |
| `` | h6. Bootstrap başlığı |
```html
<h1>h1. CoreUI başlığı</h1>
<h2>h2. CoreUI başlığı</h2>
<h3>h3. CoreUI başlığı</h3>
<h4>h4. CoreUI başlığı</h4>
<h5>h5. CoreUI başlığı</h5>
<h6>h6. CoreUI başlığı</h6>
```

**.h1**'den **.h6**'ya kadar olan sınıflar da mevcuttur, bu nedenle bir başlığın yazı stilini eşleştirmek istediğinizde ama ilişkili HTML öğesini kullanamıyorsanız bu sınıfları kullanabilirsiniz.

:::info
Başlık sınıfları, dokümanın hiyerarşik yapısını yazılı olarak ifade eder.


h1. CoreUI başlığı
h2. CoreUI başlığı
h3. CoreUI başlığı
h4. CoreUI başlığı
h5. CoreUI başlığı
h6. CoreUI başlığı
### Başlıkları özelleştirme

CoreUI 3'teki küçük ikincil başlık metni yeniden oluşturmak için dahil edilen yardımcı sınıfları kullanın.

  Şık gösterim başlığı
  Faded ikincil metinle

## Gösterim başlıkları

Geleneksel başlık öğeleri, sayfanızın içeriğinde en iyi şekilde çalışacak şekilde tasarlanmıştır. Bir başlığın öne çıkması gerektiğinde, **gösterim başlığı** kullanmayı düşünün — daha büyük, biraz daha belirgin bir başlık stili.


  Gösterim 1
  Gösterim 2
  Gösterim 3
  Gösterim 4
  Gösterim 5
  Gösterim 6


```html
<h1 class="display-1">Gösterim 1</h1>
<h1 class="display-2">Gösterim 2</h1>
<h1 class="display-3">Gösterim 3</h1>
<h1 class="display-4">Gösterim 4</h1>
<h1 class="display-5">Gösterim 5</h1>
<h1 class="display-6">Gösterim 6</h1>
```

Gösterim başlıkları, `$display-font-sizes` Sass haritası ve iki değişken, `$display-font-weight` ve `$display-line-height` ile yapılandırılmıştır.

## Öncü

Bir paragrafı öne çıkarmak için **.lead** ekleyin.

  Bu bir öncü paragraftır. Normal paragraflardan ayrılır.

## Satır içi metin öğeleri

Yaygın satır içi HTML5 öğeleri için stil uygulaması.


Metni vurgulamak için mark etiketini kullanabilirsiniz.
Bu metin silinmiş metin olarak değerlendirilmektedir.
Bu metin artık geçerli olmadığı düşünülmektedir.
Bu metin belgede ek olarak değerlendirilmektedir.
Bu metin altı çizili olarak render edilecektir.
Bu metin küçük yazı olarak değerlendirilmiştir.
Bu metin kalın yazı olarak render edilmiştir.
Bu metin italik olarak render edilmiştir.
:::tip
Bu etiketlerin sözdizimsel amaçlarla kullanılmasını unutmayın: 
- ``, referans veya not amacıyla işaretlenmiş veya vurgulanmış metni temsil eder.
- ``, yan yorumları ve küçük yazıları, telif hakkı ve yasal metin gibi içerikleri temsil eder.

Metninizi stillendirmek istiyorsanız, aşağıdaki sınıfları kullanmalısınız:
- **.mark**: `` ile aynı stilleri uygular.
- **.small**: `` ile aynı stilleri uygular.
- **.text-decoration-underline**: `` ile aynı stilleri uygular.
- **.text-decoration-line-through**: `` ile aynı stilleri uygular.
{{` öğesinin stilize edilmiş uygulanması, fare ile üzerine gelindiğinde genişletilmiş versiyonu göstermektedir. Kısaltmalar varsayılan olarak altı çizili olup, üzerine gelindiğinde ek bağlam sağlamak için yardım imleci kazanır ve yardımcı teknolojilerden yararlanan kullanıcılara destek sunar.

Bir kısaltmaya biraz daha küçük bir font boyutu için **.initialism** ekleyin.


attr
HTML
## Alıntılar

Belgenizde başka bir kaynaktan içerik alıntılamak için. Herhangi bir HTML etrafına `` sarın.

  İyi bilinen bir alıntı, bir blockquote öğesi içinde yer almaktadır.

### Kaynağı adlandırma

HTML spesifikasyonu, alıntı atıflarının `` dışında yer almasını gerektirir. Atıf sağlarken, ``'nizi bir `` içine sarın ve `.blockquote-footer` sınıfını içeren bir `` veya blok seviyesi öğe (örn. ``) kullanın. Kaynak eserinin adını da `` etiketine sarın.

  
    İyi bilinen bir alıntı, bir blockquote öğesi içinde yer almaktadır.
  
  
    Ünlü bir kişi Kaynak Başlığı içinde
  

### Hizalama

Gerekirse blockquote'unuzun hizalamasını değiştirmek için metin yardımcılarını kullanın.

  
    İyi bilinen bir alıntı, bir blockquote öğesi içinde yer almaktadır.
  
  
    Ünlü bir kişi Kaynak Başlığı içinde
  

  
    İyi bilinen bir alıntı, bir blockquote öğesi içinde yer almaktadır.
  
  
    Ünlü bir kişi Kaynak Başlığı içinde
  

## Listeler

### Stilize edilmemiş

Liste öğelerinin varsayılan `list-style`'ını ve sol kenar boşluğunu kaldırın (sadece doğrudan çocuklar için). **Bu yalnızca doğrudan çocuk liste öğeleri için geçerlidir**, yani iç içe listeler için de sınıf eklemeniz gerekecektir.

  Bu bir listedir.
  Tamamen stilize edilmemiş görünmektedir.
  Yapısal olarak, bu hala bir listedir.
  Ancak, bu stil yalnızca doğrudan çocuk öğeleri için geçerlidir.
  İç içe listeler:
    
      bu stil tarafından etkilenmez
      yine de bir mermi gösterecektir
      ve uygun sol kenar boşluğuna sahip olacaktır
    
  
  Bu bazı durumlarda hala faydalı olabilir.

### Satır içi

Bir listenin mermilerini kaldırın ve iki sınıfın kombinasyonu olan **.list-inline** ve **.list-inline-item** ile hafif bir `margin` uygulayın.

  Bu bir liste öğesidir.
  Ve bir diğeri.
  Ama bunlar satır içi olarak görüntülenmiştir.

### Açıklama listesi hizalaması

Terimleri ve açıklamaları yatay olarak hizalamak için grid sistemimizin önceden tanımlanmış sınıflarını (veya anlamlı mixin'leri) kullanın. Daha uzun terimler için, metni üç nokta ile kısaltmak için isteğe bağlı olarak bir **.text-truncate** sınıfı ekleyebilirsiniz.

  Açıklama listeleri
  Açıklama listeleri terimleri tanımlamak için mükemmeldir.

  Terim
  
    Terimin tanımı.
    Ve biraz daha yer tutucu tanım metni.
  

  Başka bir terim
  Bu tanım kısa olduğu için ek paragraflara veya başka bir şeye gerek yok.

  Kısaltılmış terim kısaltılmıştır
  Bu dar alanlarda faydalı olabilir. Sonuna üç nokta ekler.

  İç içe geçme
  
    
      İç içe tanım listesi
      Tanım listelerini sevdiğinizi duydum. Tanım listelerini tanım listenizin içine koyalım.
    
  

## Duyarlı font boyutları

CoreUI 4 for Bootstrap'ta, metnin cihaz ve görünüm boyutları arasında daha doğal bir şekilde ölçeklenmesini sağlamak için duyarlı font boyutları varsayılan olarak etkinleştirildi. Bunun nasıl çalıştığını öğrenmek için `RFS sayfasına` göz atın.

## Özelleştirme

### SASS değişkenleri

Başlıkların boyutlandırma ve boşluk için bazı özel değişkenleri vardır.

Çeşitli tipografi öğeleri burada ve `Reboot` içinde de özel değişkenlere sahiptir.

### SASS Mixins

Tipografi için özel mixin'ler yoktur, ancak Bootstrap `Duyarlı Font Boyutlandırmasını (RFS)` kullanmaktadır.