# Rust Programlama Dili

`Rust Programlama Dili`  
`Önsöz`  
`Giriş`

## Başlarken

- `Başlarken`  
    - `Kurulum`  
    - `Merhaba, Dünya!`  
    - `Merhaba, Cargo!`  

- `Bir Tahmin Oyunu Programlama`  

- `Yaygın Programlama Kavramları`  
    - `Değişkenler ve Değiştirilebilirlik`  
    - `Veri Türleri`  
    - `Fonksiyonlar`  
    - `Yorumlar`  
    - `Kontrol Akışı`  

- `Sahipliği Anlamak`  
    - `Sahiplik Nedir?`  
    - `Referanslar ve Borç Alma`  
    - `Dilimi Türü`  

- `İlişkili Verileri Yapılandırmada Struct Kullanımı`  
    - `Struct Tanımlama ve Oluşturma`  
    - `Struct Kullanan Örnek Program`  
    - `Metot Söz Dizimi`  

- `Enum'lar ve Desen Eşleştirme`  
    - `Bir Enum Tanımlama`  
    - `match` Kontrol Akışı Yapısı`  
    - `if let` ile Özlü Kontrol Akışı`  

## Temel Rust Okuryazarlığı

- `Paketler, Kütüphaneler ve Modüller ile Büyüyen Projeleri Yönetme`  
    - `Paketler ve Kütüphaneler`  
    - `Kapsamı ve Gizliliği Kontrol Etmek için Modüller Tanımlama`  
    - `Modül Ağaçlarında Bir Öğeye Atıfta Bulunma İçin Yollar`  
    - `use` Anahtar Kelimesi ile Yolları Kapsama Alma`  
    - `Modülleri Farklı Dosyalara Ayırma`  

- `Yaygın Koleksiyonlar`  
    - `Vektörler ile Değer Listelerini Saklama`  
    - `Dize ile UTF-8 Kodlu Metin Saklama`  
    - `Hash Haritalarında İlişkili Değerlerde Anahtarlar Saklama`  

- `Hata İşleme`  
    - `panic!` ile İyileştirilemeyen Hatalar`  
    - `Result` ile İyileştirilebilir Hatalar`  
    - `panic!` Yapmak mı, Yapmamak mı`  

- `Generic Türler, Trait'ler ve Ömürler`  
    - `Generic Veri Türleri`  
    - `Trait'ler: Paylaşılan Davranışları Tanımlama`  
    - `Ömürlerle Referansları Doğrulama`  

- `Otomatik Test Yazma`  
    - `Test Nasıl Yazılır`  
    - `Testlerin Nasıl Çalıştırıldığını Kontrol Etme`  
    - `Test Organizasyonu`  

- `Bir G/Ç Projesi: Komut Satırı Programı Oluşturma`  
    - `Komut Satırı Argümanlarını Alma`  
    - `Bir Dosyayı Okuma`  
    - `Modülerliği ve Hata İşlemesini Geliştirmek İçin Refaktoring`  
    - `Test Odaklı Geliştirme ile Kütüphanenin İşlevselliğini Geliştirme`  
    - `Ortam Değişkenleri ile Çalışma`  
    - `Hata Mesajlarını Standart Çıktı Yerine Standart Hata'ya Yazma`  

## Rust'ta Düşünme

- `Fonksiyonel Dil Özellikleri: İteratörler ve Kapatmalar`  
    - `Kapatmalar: Ortamlarını Yakalamak İçin Anonim Fonksiyonlar`  
    - `İteratörlerle Bir Dizi Öğeyi İşleme`  
    - `G/Ç Projemizi Geliştirme`  
    - `Performansı Karşılaştırma: Döngüler vs. İteratörler`  

- `Cargo ve Crates.io Hakkında Daha Fazla Bilgi`  
    - `Sürüm Profilleri ile Derlemeleri Özelleştirme`  
    - `Crates.io'ya Kütüphane Yayınlama`  
    - `Cargo Çalışma Alanları`  
    - `Crates.io'dan Binaries Yükleme için `cargo install`  
    - `Özel Komutlarla Cargo'yu Genişletme`  

- `Akıllı Göstergeler`  
    - `Box` Kullanarak Heap Üzerindeki Verilere İşaret Etme`  
    - `Akıllı Göstergeleri `Deref` Trait'i ile Normal Referanslar Gibi İşleme`  
    - `Temizlikte Kod Çalıştırma ile `Drop` Trait'i`  
    - `Rc`, Referans Sayımlı Akıllı Göstergeler`  
    - `RefCell` ve İçsel Değişkenlik Deseni`  
    - `Referans Döngüleri Bellek Sızdırabilir`  

- `Korkusuz Eşzamanlılık`  
    - `Kodları Aynı Anda Çalıştırmak İçin İş Parçacıklarını Kullanma`  
    - `İş Parçacıkları Arasında Veri Aktarmak İçin Mesajlaşma Kullanma`  
    - `Paylaşılan Durum Eşzamanlılığı`  
    - `Sync` ve `Send` Trait'leri ile Genişletilebilir Eşzamanlılık`  

- `Asenkron ve Bekleme`  
    - `Gelecekler ve Asenkron Söz Dizimi`  
    - `Asenkron ile Eşzamanlılık`  
    - `Herhangi Bir Sayıda Gelecek ile Çalışma`  
    - `Akışlar`  
    - `Asenkron için Trait'leri İnceleme`  
    - `Gelecekler, Görevler ve İş Parçacıkları`  

- `Rust'ın Nesne Yönelimli Programlama Özellikleri`  
    - `Nesne Yönelimli Dillerin Özellikleri`  
    - `Farklı Türdeki Değerlere İzin Veren Trait Nesnelerini Kullanma`  
    - `Nesne Yönelimli Bir Tasarım Deseni Uygulama`  

## İleri Düzey Konular

- `Desenler ve Eşleştirme`  
    - `Desenlerin Kullanılabileceği Tüm Yerler`  
    - `Çelişme: Bir Desenin Eşleşmeyi Başarısız Etme Olasılığı`  
    - `Desen Söz Dizimi`  

- `İleri Düzey Özellikler`  
    - `Güvensiz Rust`  
    - `İleri Düzey Trait'ler`  
    - `İleri Düzey Türler`  
    - `İleri Düzey Fonksiyonlar ve Kapatmalar`  
    - `Makrolar`  

- `Son Proje: Çok İş Parçacıklı Bir Web Sunucusu İnşa Etme`  
    - `Tek İş Parçacıklı Bir Web Sunucusu İnşa Etme`  
    - `Tek İş Parçacıklı Sunucumuzu Çok İş Parçacıklı Hale Getirme`  
    - `Nazik Kapatma ve Temizlik`  

- `Ek`  
    - `A - Anahtar Kelimeler`  
    - `B - Operatörler ve Semboller`  
    - `C - Türetilen Trait'ler`  
    - `D - Kullanışlı Geliştirme Araçları`  
    - `E - Baskılar`  
    - `F - Kitap Çevirileri`  
    - `G - Rust Nasıl Yapılır ve “Gece Rust”`  

---

:::info
Başlangıçta Rust ile ilgili en önemli konulara odaklanarak temel bilgilerinizi güçlendirin.
:::

---

> "Nesne Yönelimli Dillerin Özellikleri"  
— Rust Dili Kılavuzu

---


Önemli Notlar

- Rust, bellek güvenliğini sağlamak için sahiplik modeli kullanır.
- Rust programlamada bellek yönetimi ve eşzamanlılık konularında dikkatli olmalısınız.

  

---