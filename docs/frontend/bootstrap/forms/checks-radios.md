---
description: Tamamen yeniden yazılmış kontroller bileşenimizle tutarlı, tarayıcılar arası ve cihazlar arası onay kutuları ve radyo butonları oluşturan bir çözüm sunar.
keywords: [kontroller, onay kutuları, radyo butonları, Bootstrap, form işleme]
---

# Check Radio'lar

## Yaklaşım

Tarayıcıların varsayılan onay kutuları ve radyo butonları, HTML öğelerinin yerleşimini ve davranışını geliştiren `.form-check` sınıflar serisi yardımıyla değiştirilir. Bu, daha büyük özelleştirme ve tarayıcılar arası tutarlılık sağlar. **Onay kutuları**, bir liste içinde bir veya birkaç seçeneği seçmek için kullanılırken, **radyo butonları** birçok seçenek arasından birini seçmek içindir.

Yapısal olarak, ``lerimiz ve ``lerimiz kardeş öğelerdir; aksine bir `` içinde bir `` yer almaz. Bu, `id` ve `for` özniteliklerini belirtmenizi gerektirdiği için biraz daha ayrıntılıdır. Tüm `` durumlarımız için kardeş seçici (`~`) kullanırız. Örneğin `:checked` veya `:disabled`. `.form-check-label` sınıfı ile birleştirildiğinde, her öğenin metnini `` durumuna göre kolayca stillendirebiliriz.

Kontrollerimiz, onaylı veya belirsiz durumları belirtmek için özel Bootstrap simgeleri kullanır.

## Kontroller

  
  
    Varsayılan onay kutusu
  


  
  
    Onaylı onay kutusu
  

### Belirsiz

:::tip
Onay kutuları, manuel olarak JavaScript ile ayarlandığında `:indeterminate` sahte sınıfını kullanabilir (bunu belirten herhangi bir HTML özniteliği yoktur).
:::

  
  
    Belirsiz onay kutusu
  

### Devre Dışı

`disabled` özniteliğini ekleyin ve ilgili ``ler otomatik olarak daha açık bir renkte stillenir, bu da girişin durumunu belirtmeye yardımcı olur.

  
  
    Devre dışı onay kutusu
  


  
  
    Devre dışı onaylı onay kutusu
  

## Radyo Butonları

  
  
    Varsayılan radyo butonu
  


  
  
    Varsayılan onaylı radyo butonu
  

### Devre Dışı

`disabled` özniteliğini ekleyin ve ilgili ``ler otomatik olarak daha açık bir renkte stillenir; bu da girişin durumunu belirtmeye yardımcı olur.

  
  
    Devre dışı radyo butonu
  


  
  
    Devre dışı onaylı radyo butonu
  

## Anahtarlar

Bir anahtar, özelleştirilmiş bir onay kutusunun işaretleme işaretidir ancak bir geçiş anahtarı oluşturmak için `.form-switch` sınıfını kullanır. Bu rolü destekleyen yardımcı teknolojilere, kontrolün doğasını daha doğru bir şekilde iletmek için `role="switch"` kullanmayı düşünün. **Eski yardımcı teknolojilerde**, bir geri dönüş olarak normal bir onay kutusu olarak duyurulacaktır. Anahtarlar ayrıca `disabled` özniteliğini de destekler.

  
  Varsayılan anahtar onay kutusu girişi


  
  Onaylı anahtar onay kutusu girişi


  
  Devre dışı anahtar onay kutusu girişi


  
  Devre dışı onaylı anahtar onay kutusu girişi

### Boyutlar

  
  Varsayılan anahtar onay kutusu girişi


  
  Büyük anahtar onay kutusu girişi


  
  Ekstra büyük anahtar onay kutusu girişi

## Varsayılan (yığılmış)

Varsayılan olarak, her türlü onay kutusu ve radyo butonu, hemen yan yana olan öğeler olacak şekilde dikey olarak üst üste yerleştirilecek ve uygun bir boşluk ile düzenlenecektir.

  
  
    Varsayılan onay kutusu
  


  
  
    Devre dışı onay kutusu
  

  
  
    Varsayılan radyo butonu
  


  
  
    İkinci varsayılan radyo butonu
  


  
  
    Devre dışı radyo butonu
  

## Satır içi

Onay kutularını veya radyo butonlarını, herhangi bir `.form-check`'e `.form-check-inline` ekleyerek aynı yatay sıraya gruplandırın.

  
  1


  
  2


  
  3 (devre dışı)

  
  1


  
  2


  
  3 (devre dışı)

## Ters

Onay kutularınızı, radyo butonlarınızı ve anahtarlarınızı, `.form-check-reverse` değiştirici sınıfı ile karşı tarafta yerleştirin.

  
  
    Ters onay kutusu
  


  
  
    Devre dışı ters onay kutusu
  



  
  Ters anahtar onay kutusu girişi

## Etiket olmadan

Etiket metni olmayan onay kutuları ve radyo butonları için saran `.form-check`i hariç tutun. Yardımcı teknolojiler için, erişilebilir bir isim sağlamayı unutmayın (örneğin, `aria-label` kullanarak). Detaylar için `formlar genel bakış erişilebilirlik` bölümüne bakın.

  



  

## Geçiş Butonları

`.btn` stillerini `` öğeleri üzerinde `.form-check-label` yerine kullanarak, buton benzeri onay kutuları ve radyo butonları oluşturun. Bu geçiş butonları, gerekiyorsa `buton grubu` içinde daha fazla gruplanabilir.

### Onay Kutusu Geçiş Butonları

Tek gezi


Onaylı


Devre dışı
Tek gezi


Onaylı


Devre dışı

Görsel olarak, bu onay kutusu geçiş butonları, `buton eklentileri geçiş butonları` ile aynıdır. Ancak, yardımcı teknolojiler tarafından farklı iletilir: onay kutusu geçişleri ekran okuyucular tarafından "onaylı"/"onaylı değil" olarak duyurulacaktır (çünkü, görünümüne rağmen, temelde hala onay kutularıdır), oysa buton eklentisi geçiş butonları "buton"/"buton basıldı" olarak duyurulacaktır. Bu iki yaklaşım arasındaki seçim, hangi tür geçiş oluşturduğunuza ve geçişin, onay kutusu veya gerçek bir buton olarak duyurulduğunda kullanıcılar için anlamlı olup olmadığını belirleyecektir.
### Radyo Geçiş Butonları

Onaylı


Radyo


Devre dışı


Radyo
Onaylı


Radyo


Devre dışı


Radyo
### Çizgili stiller

Çeşitli çizgili stiller gibi farklı `.btn` varyantları desteklenmektedir.

Tek gezi


Onaylı


Onaylı başarılı radyo


Tehlikeli radyo
## Özelleştirme

### SASS değişkenleri

Kontroller için değişkenler:

Anahtarlar için değişkenler:

