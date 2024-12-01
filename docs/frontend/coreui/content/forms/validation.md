---
description: HTML5 form doğrulaması ile kullanıcılarınıza değerli, eyleme geçirilebilir geri bildirim sağlayın; tarayıcı varsayılan davranışları veya özel stiller ve JavaScript aracılığıyla.
keywords: [form doğrulama, HTML5, kullanıcı geri bildirimi, Bootstrap, CoreUI, JavaScript, web formları]
title: Doğrulama
---

:::warning
Şu anda istemci tarafı özel doğrulama stillerinin ve ipuçlarının erişilebilir olmadığını biliyoruz; çünkü bunlar yardımcı teknolojilere açılmamıştır. Bir çözüm üzerinde çalışırken, sunucu tarafı seçeneğini veya varsayılan tarayıcı doğrulama yöntemini kullanmanızı öneririz.
:::

## Nasıl Çalışır

Bootstrap ile form doğrulamanın nasıl çalıştığı:

- HTML form doğrulaması CSS'nin iki pseudo-sınıfı `:invalid` ve `:valid` aracılığıyla uygulanır. Bu, ``, `` ve `` elemanlarına uygulanır.
- CoreUI for Bootstrap, `:invalid` ve `:valid` stillerini genellikle `` üzerine uygulanan ana sınıf `.was-validated` kapsamına alır. Aksi halde, değeri olmayan herhangi bir zorunlu alan sayfa yüklendiğinde geçersiz görünür. Bu şekilde, bunları ne zaman etkinleştireceğinizi seçebilirsiniz (genellikle form gönderim girişimi yapıldıktan sonra).
- Formun görünümünü sıfırlamak için (örneğin, AJAX kullanarak dinamik form gönderimleri durumunda), gönderimden sonra ``'dan tekrar `.was-validated` sınıfını kaldırın.
- Yedek olarak, `.is-invalid` ve `.is-valid` sınıfları `sunucu tarafı doğrulama` için pseudo-sınıflar yerine kullanılabilir. Bu sınıflar, bir `.was-validated` ana sınıfına ihtiyaç duymaz.
- CSS'nin çalışma şekli olan kısıtlamalar nedeniyle, özel JavaScript yardımı olmadan DOM'da form kontrolünden önce gelen bir `` üzerine stiller uygulayamıyoruz.
- Tüm modern tarayıcılar, form kontrollerini doğrulamak için JavaScript yöntemleri içeren [kısıtlama doğrulama API'sini](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#the-constraint-validation-api) destekler.
- Geri bildirim mesajları `tarayıcı varsayılanlarını` (her tarayıcı için farklı ve CSS ile stil verilemeyen) veya ek HTML ve CSS ile özel geri bildirim stillerimizi kullanabilir.
- JavaScript'te `setCustomValidity` ile özel geçerlilik mesajları sağlayabilirsiniz.

> Özel form doğrulama stillerimiz, isteğe bağlı sunucu tarafı sınıfları ve tarayıcı varsayıtlara yönelik aşağıdaki örnekleri inceleyin.
> — Docusaurus Markdown Formatting

## Özel stiller

Özel CoreUI for Bootstrap form doğrulama mesajları için, ``'unuza `novalidate` boolean niteliğini eklemeniz gerekir. Bu, tarayıcının varsayılan geri bildirim ipuçlarını devre dışı bırakır, ancak yine de JavaScript'te form doğrulama API'lerine erişim sağlar. Aşağıdaki formu göndermeyi deneyin; JavaScript'imiz gönderim düğmesini engelleyecek ve geri bildirimi size iletecektir. Gönderim yapmaya çalıştığınızda, form kontrollerinize `:invalid` ve `:valid` stillerinin uygulandığını göreceksiniz.

Özel geri bildirim stilleri, geri bildirimi daha iyi iletmek için özel renkler, kenarlıklar, odak stilleri ve arka plan simgeleri uygular. ``'ler için arka plan simgeleri yalnızca `.form-select` ile mevcut olup, `.form-control` ile mevcut değildir.

  
    İsim
    
    
      İyi görünüyor!
    
  
  
    Soyisim
    
    
      İyi görünüyor!
    
  
  
    Kullanıcı adı
    
      @
      
      
        Lütfen bir kullanıcı adı seçin.
      
    
  
  
    Şehir
    
    
      Lütfen geçerli bir şehir girin.
    
  
  
    Eyalet
    
      Seçin...
      ...
    
    
      Lütfen geçerli bir eyalet seçin.
    
  
  
    Posta Kodu
    
    
      Lütfen geçerli bir posta kodu girin.
    
  
  
    
      
      
        Şartlar ve koşulları kabul ediyorum
      
      
        Göndermeden önce kabul etmelisiniz.
      
    
  
  
    Formu Gönder
  



{{- readFile (path.Join "docs/static/assets/js/validate-forms.js") -}}

## Tarayıcı varsayılanları

Özel doğrulama geri bildirim mesajlarıyla ilgilenmiyor veya form davranışlarını değiştirmek için JavaScript yazmak istemiyor musunuz? Sorun değil, tarayıcı varsayılanlarını kullanabilirsiniz. Aşağıdaki formu göndermeyi deneyin. Tarayıcınıza ve işletim sisteminize bağlı olarak, biraz farklı bir geri bildirim stilini göreceksiniz.

Bu geri bildirim stilleri CSS ile stillenemezken, geri bildirim metnini JavaScript aracılığıyla özelleştirebilirsiniz.

  
    İsim
    
  
  
    Soyisim
    
  
  
    Kullanıcı adı
    
      @
      
    
  
  
    Şehir
    
  
  
    Eyalet
    
      Seçin...
      ...
    
  
  
    Posta Kodu
    
  
  
    
      
      
        Şartlar ve koşulları kabul ediyorum
      
    
  
  
    Formu Gönder
  

## Sunucu tarafı

İstemci tarafı doğrulamasını kullanmanızı öneririz, ancak sunucu tarafı doğrulamasına ihtiyacınız varsa, geçersiz ve geçerli form alanlarını `.is-invalid` ve `.is-valid` ile belirtebilirsiniz. Geçersiz alanlar için, geçersiz geri bildirim/hata mesajının ilgili form alanıyla `aria-describedby` aracılığıyla ilişkilendirildiğinden emin olun (bu niteliğin, alan daha önce ek form metnine işaret ediyorsa birden fazla `id`'nin belirtilmesine izin verdiğini unutmayın).

> Kenar yarı çapı ile ilgili sorunları düzeltmek için, giriş grupları ek bir `.has-validation` sınıfına ihtiyaç duyar.
> — Docusaurus Markdown Formatting

  
    İsim
    
    
      İyi görünüyor!
    
  
  
    Soyisim
    
    
      İyi görünüyor!
    
  
  
    Kullanıcı adı
    
      @
      
      
        Lütfen bir kullanıcı adı seçin.
      
    
  
  
    Şehir
    
    
      Lütfen geçerli bir şehir girin.
    
  
  
    Eyalet
    
      Seçin...
      ...
    
    
      Lütfen geçerli bir eyalet seçin.
    
  
  
    Posta Kodu
    
    
      Lütfen geçerli bir posta kodu girin.
    
  
  
    
      
      
        Şartlar ve koşulları kabul ediyorum
      
      
        Göndermeden önce kabul etmelisiniz.
      
    
  
  
    Formu Gönder
  

## Desteklenen unsurlar

Doğrulama stilleri aşağıdaki form kontrolleri ve bileşenleri için mevcuttur:

- `.form-control` ile ``'lar ve ``'lar (giriş gruplarında bir adede kadar `.form-control`)
- `.form-select` ile ``'ler
- `.form-check`'ler

  
    Textarea
    
    
      Lütfen textarea'ya bir mesaj girin.
    
  

  
    
    Bu onay kutusunu işaretleyin
    Örnek geçersiz geri bildirim metni
  

  
    
    Bu radyoyu geçin
  
  
    
    Ya da bu diğer radyoyu geçin
    Daha fazla örnek geçersiz geri bildirim metni
  

  
    
      Bu seçim menüsünü açın
      Bir
      İki
      Üç
    
    Örnek geçersiz seçim geri bildirimi
  

  
    
    Örnek geçersiz form dosyası geri bildirimi
  

  
    Formu Gönder
  

## İpuçları

Form düzeniniz bunu destekliyorsa, doğrulama geri bildirimini stillenmiş ipucu olarak görüntülemek için `.{valid|invalid}-feedback` sınıflarını `.{valid|invalid}-tooltip` sınıflarıyla değiştirebilirsiniz. İpucu konumlandırması için üzerinde `position: relative` olan bir üst öğeye sahip olduğunuzdan emin olun. Aşağıdaki örnekte, sütun sınıflarımız buna zaten sahiptir, ancak projenizin alternatif bir yapılandırmaya ihtiyacı olabilir.

  
    İsim
    
    
      İyi görünüyor!
    
  
  
    Soyisim
    
    
      İyi görünüyor!
    
  
  
    Kullanıcı adı
    
      @
      
      
        Lütfen benzersiz ve geçerli bir kullanıcı adı seçin.
      
    
  
  
    Şehir
    
    
      Lütfen geçerli bir şehir girin.
    
  
  
    Eyalet
    
      Seçin...
      ...
    
    
      Lütfen geçerli bir eyalet seçin.
    
  
  
    Posta Kodu
    
    
      Lütfen geçerli bir posta kodu girin.
    
  
  
    Formu Gönder
  

## Sass

### Değişkenler

### Mixins

İki mixin, form doğrulama geri bildirim stillerimizi oluşturmak için `döngümüz` aracılığıyla bir araya getirilmiştir.

### Harita

Bu, `_variables.scss` içindeki doğrulama Sass haritasıdır. Farklı veya ek durumlar oluşturmak için bunu geçersiz kılabilir veya genişletebilirsiniz.

`$form-validation-states` haritaları, ipuçlarını ve odak stillerini geçersiz kılmak için üç isteğe bağlı parametre içerebilir.

### Döngü

Doğrulama stillerimizi oluşturmak için `$form-validation-states` harita değerlerinde yinelemeler (iterasyon) yapmak için kullanılır. Yukarıdaki Sass haritasında yapılan herhangi bir değişiklik, derlenmiş CSS'inizde bu döngü aracılığıyla yansıtılacaktır.

### Özelleştirme

Doğrulama durumları, `$form-validation-states` haritası ile Sass aracılığıyla özelleştirilebilir. `_variables.scss` dosyamızda bulunan bu Sass haritası, varsayılan `geçerli`/`geçersiz` doğrulama durumlarını oluşturmada kullanılır. Her durumun rengini, simgesini, ipucu rengini ve odak gölgesini özelleştirmek için iç içe bir harita içerir. Tarayıcılar tarafından desteklenen başka durum olmasa da, özel stiller kullananlar daha karmaşık form geri bildirimleri eklemek için kolayca daha fazlasını ekleyebilirler.