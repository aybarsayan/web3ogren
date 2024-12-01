---
description: Metin temelli form kontrollerini, özel stiller, boyutlandırma, fokus durumları ve daha fazlasıyla güncelleyin. Bu doküman, form kontrolleri ile ilgili detaylı bilgi ve örnekler sunarak kullanıcı deneyimini geliştirmeye yardımcı olur.
keywords: [form kontrolleri, stil, boyutlandırma, odak durumu, SASS değişkenleri, dosya girişi, veri listeleri]
layout: docs
title: Form kontrolleri
group: formlar
toc: true
bootstrap: true
other_frameworks: input, textarea
---

## Örnek

  E-posta adresi
  


  Örnek metin alanı
  

## Boyutlandırma

Yüksekliği `.form-control-lg` ve `.form-control-sm` gibi sınıflar kullanarak ayarlayın.



## Form metni

Blok seviyeli veya satır içi form metni `.form-text` kullanılarak oluşturulabilir.


Form metni, ilgilendiği form kontrolü ile `aria-describedby` niteliği kullanılarak açıkça ilişkilendirilmelidir. Bu, yardımcı teknolojilerin -örneğin ekran okuyucuların- kullanıcı kontrolüne odaklandığında veya girdiğinde bu form metnini duyurmasını sağlar.
Girişlerin altındaki form metni `.form-text` ile stilize edilebilir. Eğer blok seviyeli bir öğe kullanılacaksa, üstteki girişlerden kolayca boşluk bırakmak için bir üst marjin eklenir.


Şifre


  Şifreniz 8-20 karakter uzunluğunda olmalı, harfler ve sayılar içermeli ve boşluk, özel karakter veya emojiden oluşmamalıdır.

Satır içi metin, sadece `.form-text` sınıfıyla birlikte herhangi bir tipik satır içi HTML öğesi (örneğin ``, `` veya başka bir şey) kullanabilir.

  
    Şifre
  
  
    
  
  
    
      8-20 karakter uzunluğunda olmalıdır.
    
  

## Devre Dışı

Bir girdi üzerinde `disabled` mantıksal niteliğini ekleyin, böylece gri bir görünüm kazanır, işaretçi olaylarını kaldırır ve odaklanmayı engeller.


## Yalnızca Okunabilir

Bir girdinin değerinin değiştirilmesini engellemek için `readonly` mantıksal niteliğini ekleyin. `readonly` girdiler hala odaklanabilir ve seçilebilirken, `disabled` girdiler odaklanamaz.

## Yalnızca Okunabilir Düz Metin

Formunuzda `` öğelerini düz metin olarak stilize etmek istiyorsanız, varsayılan form alanı stilini kaldırmak ve doğru `margin` ile `padding`'i korumak için `.form-control` ile `.form-control-plaintext` arasında değiştirme yapın.

  E-posta
  
    
  


  Şifre
  
    
  

  
    E-posta
    
  
  
    Şifre
    
  
  
    Kimliği Onayla
  

## Dosya Girişi

  Varsayılan dosya girişi örneği
  


  Birden fazla dosya girişi örneği
  


  Devre dışı dosya girişi örneği
  


  Küçük dosya girişi örneği
  


  Büyük dosya girişi örneği
  

## Renk

`type="color"` ayarını yapın ve ``'e `.form-control-color` ekleyin. Sabit `height`'leri ayarlamak ve tarayıcılar arasındaki bazı tutarsızlıkları geçersiz kılmak için modifikatör sınıfını kullanıyoruz.


Renk seçici

## Veri Listeleri

Veri listeleri, bir grup `` oluşturmanıza olanak tanır ve bunlar bir `` içinde erişilebilir (ve otomatik doldurulabilir). Bunlar, bazı menü stil sınırlamaları ve farklılıkları ile birlikte `` öğelerine benzer. Çoğu tarayıcı ve işletim sistemi `` öğeleri için bazı destek sağlasa da, stilleri en iyi ihtimalle tutarsızdır.

[Datalist öğeleri için destek hakkında daha fazla bilgi edinin](https://caniuse.com/datalist).


Datalist örneği


  
  
  
  
  

## Özelleştirme

### SASS değişkenleri

`$input-*` çoğu form kontrolümüz (ve butonlar dışında) için paylaşılmaktadır.

`$form-label-*` ve `$form-text-*` bizim `` ve `.form-text` bileşenimiz içindir.

`$form-file-*` dosya girişi için kullanılır.

