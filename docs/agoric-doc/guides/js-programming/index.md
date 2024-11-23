# Güvenli Dağıtık Hesaplama için JavaScript Çerçevesi

Agoric akıllı sözleşme platformu, güvenli dağıtık hesaplama için bir JavaScript çerçevesi ile başlamaktadır.

::: tip İzleyin: Dağıtık Programlama için Merkeziyetsiz Bir Dünya (Ağustos 2019)
Bu 15 dakikalık genel bakış, aşağıdaki bölümlerdeki materyallerle önemli ölçüde örtüşen
 ilkidir.





:::

## Vats: Eşzamanlılık Birimi

Agoric çerçevesi, web tarayıcıları ve Node.js ile aynı  kullanır.
Her olay döngüsünün bir mesaj kuyruğu, çerçevelerin bir çağrı yığında ve nesnelerin bir yığını vardır:



Bu olay döngüsünün, mesaj kuyruğu, yığın ve yığınla birleşimine _vat_ diyoruz.

Vats, eşzamanlılık birimidir. Sadece aynı vat içinde sıradan eşzamanlı
fonksiyon çağrılarını kullanabiliriz. Ancak, aynı vat içinde veya
vats arasında (bakınız ) asenkron fonksiyon çağrılarını kullanabiliriz.
Vats, blok zincirleri gibi büyük ölçüde çoğaltılan makineler de dahil olmak üzere uzaktaki makinelerde olabilir.

## Çerçevenin Bileşenleri

Çerçeve, aşağıdakileri içerir:

- ****

  - Sertleştirilmiş JavaScript, size tamamen güvenmediğiniz kodla etkileşime girebilen nesneler oluşturma platformu sağlar.
     ile bunları nasıl kullanacağımızı
    ve  uygulamayı tanıtıyoruz.

- ****

  - `E()` sarmalayıcı fonksiyonu,
    sizlere vats içinde veya vats arasında yöntemleri çağırma imkânı tanır.
    Uzak bir nesne için yerel bir temsilci (bir _varlık_) verildiğinde,
    bu, varlığın kökenine mesajlar gönderir.
    `E(obj).myMethod(...args)` ifadesi, `obj.myMethod(...args)` ifadesinin asenkron bir şeklidir.

- ****

  - Vats arasında kullanılan nesnelere _uzaklaştırılabilirler_ denir.
    Bir nesneyi bir vat'tan dışa aktarmak için, `Far()` fonksiyonunu kullanın.

- ****

  - Bildirimciler ve Abonelikler, durum değişikliğini
    günceller. İkisi de, yayın-abone sistemine benzer şekilde, abonelerin 
    listelerinin açık bir şekilde yönetilmesini gerektirmeden asenkron bir mesaj akışı sunar. Bildirimciler,
    nihai olmayan değerlerin kayıplı iletimini sağlarken, abonelikler kayıpsız değer taşıyıcılardır.
