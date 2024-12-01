---
description: Form kontrol stilleri, düzen seçenekleri ve özel bileşenler hakkında bilgi sağlayan belgeler ve örnekler içermektedir.
keywords: [form kontrolleri, Bootstrap, erişilebilirlik, varlık yönetimi, özelleştirme]
---

# Genel Bakış

CoreUI for Bootstrap'ın form kontrolleri, `yeniden başlatılan form stillerimizi` sınıflarla genişletir. Daha tutarlı bir tarayıcı ve cihazlar arası renderlama için bu sınıfları kullanarak **özelleştirilmiş** görünümlerine geçiş yapın.

:::tip
Yeni giriş kontrollerinden (örneğin, e-posta doğrulama, sayı seçimi vb.) yararlanmak için tüm girdilerde uygun bir `type` niteliği kullanmaya dikkat edin (örneğin, e-posta adresi için `email` veya sayısal bilgi için `number`).
:::

CoreUI for Bootstrap'ın form stillerini göstermek için hızlı bir örnek aşağıda. Gerekli sınıflar, form düzeni ve daha fazlası hakkında belgeleri okumaya devam edin.

  
    E-posta adresi
    
    E-posta adresinizi asla kimseyle paylaşmayacağız.
  
  
    Şifre
    
  
  
    
    Beni kontrol et
  
  Gönder

---

## Form metni

Blok seviyesinde veya çevrimiçi form metni, `.form-text` kullanılarak **oluşturulabilir**.

:::warning
##### Form metninin form kontrolleri ile ilişkilendirilmesi

Form metni, ilgili olduğu form kontrolü ile açıkça ilişkilendirilmelidir; bu, `aria-describedby` niteliği kullanılarak yapılmalıdır. Bu, yardımcı teknolojilerin—örneğin ekran okuyucuların—kullanıcı kontrolü odaklandığında veya girdiğinde bu form metnini bildirmesini sağlar.
:::

Girdilerin altındaki form metni `.form-text` ile stillendirilebilir. Blok seviyesinde bir öğe kullanılacaksa, yukarıdaki girdilerle kolay mesafe bırakarak üst marj eklenir.


Şifre


  Şifreniz 8-20 karakter uzunluğunda olmalı, harfler ve sayılar içermeli ve boşluk, özel karakter veya emojiler içermemelidir.

Çevrimiçi metin, herhangi bir tipik çevrimiçi HTML öğesi (bir ``, `` veya başka bir şey olsun) ile sadece `.form-text` sınıfı ile **kullanılabilir**.

  
    Şifre
  
  
    
  
  
    
      8-20 karakter uzunluğunda olmalıdır.
    
  

---

## Devre dışı formlar

Kullanıcı etkileşimlerini önlemek ve daha açık görünmesini sağlamak için bir giriş elemanına `disabled` boole niteliği ekleyin.

```html
<input class="form-control" id="disabledInput" type="text" placeholder="Burada devre dışı giriş... " disabled>
```

Tüm kontrolleri devre dışı bırakmak için bir `` öğesine `disabled` niteliği ekleyin. Tarayıcılar, bir `` içindeki tüm yerel form kontrollerini (``, `` ve `` öğeleri) devre dışı olarak kabul eder ve bunlara klavye ve fare etkileşimlerini engeller.

:::info
Ancak, formunuz ayrıca `...` gibi özel düğme benzeri öğeleri içeriyorsa, bunlara sadece `pointer-events: none` stili uygulanır, bu da bunların hala odaklanabilir ve klavye ile kullanılabilir olduğu anlamına gelir. Bu durumda, bu kontrollerin odaklanmasını önlemek için `tabindex="-1"` eklemeli ve yardımcı teknolojilere durumlarını iletmek için `aria-disabled="disabled"` eklemelisiniz.
:::

  
    Devre dışı alan örneği
    
      Devre dışı giriş
      
    
    
      Devre dışı seçim menüsü
      
        Devre dışı seçim
      
    
    
      
        
        
          Bunu kontrol edemezsiniz
        
      
    
    Gönder
  

---

## Erişilebilirlik

Tüm form kontrollerinin uygun bir erişilebilir adı olduğundan emin olun, **böylece amaçları** yardımcı teknolojilerin kullanıcılarına iletilebilir. Bunu sağlamanın en basit yolu, bir `` öğesi kullanmak veya düğmeler için `...` içeriğinin yeterince açıklayıcı bir metin içermesidir.

:::note
Görünür bir `` veya uygun metin içeriği eklemenin mümkün olmadığı durumlar için, hala erişilebilir bir ad sağlamak için alternatif yollar vardır:
- `.visually-hidden` sınıfı kullanılarak gizlenmiş `` öğeleri
- `aria-labelledby` kullanarak bir etiket işlevi görebilecek mevcut bir öğeye atıfta bulunmak
- `title` niteliği sağlamak
- Bir öğedeki erişilebilir adı açıkça ayarlamak için `aria-label` kullanmak
:::

Bunlardan hiçbiri mevcut değilse, yardımcı teknolojiler `placeholder` niteliğini, `` ve `` öğeleri üzerindeki erişilebilir ad olarak yedek olarak kullanabilir. Bu bölümdeki örnekler, birkaç önerilen, duruma özgü yöntem sunar.

Görünür mü yoksa gizli içerik kullanmak (`.visually-hidden`, `aria-label` ve hatta içerik boşaldığında kaybolan `placeholder` içeriği), yardımcı teknoloji kullanıcılarına fayda sağlasa da, görünür etiket metninin olmaması bazı kullanıcılar için sorun olabilir. Genel olarak, belirli bir görünür etiketin olması, erişilebilirlik ve kullanılabilirlik açısından en iyi yaklaşımdır.

---

## Sass

Birçok form değişkeni, bireysel form bileşenleri tarafından yeniden kullanılmak ve genişletilmek üzere genel düzeyde ayarlanmıştır. Bunları en sık `$input-btn-*` ve `$input-*` değişkenleri olarak göreceksiniz.

### Değişkenler

`$input-btn-*` değişkenleri, `düğmelerimiz` ve form bileşenlerimiz arasında paylaşılan küresel değişkenlerdir. Bunlar genellikle diğer bileşenlere özgü değişkenlere değer olarak yeniden atanmıştır.

