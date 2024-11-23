---
title: Teklif Güvenliği
---

# Teklif Güvenliği



**Tanım**: _Teklif güvenliği_, kullanıcının ya istediğini alacağını ya da yaptığı teklifin tamamının geri ödeneceğini garanti etmesi anlamına gelir.

Zoe'nin teklif güvenliğini sağlaması için, kullanıcı Zoe'ye bir `teklif` vermelidir. Bu, kullanıcının ne istediğinin ve ne sunduğunun yanı sıra, kontratın ne zaman ve nasıl sona erebileceğini açıklayan bir tanımdır. Zoe, bunu ödeme sürekliliğini sağlamak için kullanır. Çıkış şartı isteğe bağlıdır ve varsayılan olarak `OnDemand` olarak belirlenmiştir; bu da kullanıcının kontrat örneğinden istediği zaman çıkabileceği anlamına gelir.

Örneğin, bir etkinlik bileti satın almak istiyorum ve bunun için $100 sunuyorum. Zoe'de, benim `teklif`im şu şekildedir:

```js
{
  give: { Price: dollars100 },
  want: { Asset: ticket1 },
}
```

`Asset` ve `Price`, bir kontratın `anahtar kelimeleri`dir. Anahtar kelimeler, kontrat kullanıcılarının teklifin bölümlerine, Zoe ile tutulan ödemelere ve Zoe'den alınan ödemelere kolayca ve tutarlı bir şekilde atıfta bulunmalarını sağlar.

Örneğin, kullanıcı Zoe ile ödemeleri anahtar kelimeleri kullanarak takip ettirir. Bu örnekte, Zoe'ye $100'lık bir ödeme göndererek teklifimi tutmaya alırım, çünkü Zoe hemen `give:` ile belirtilen ödemeyi tutar.

Kullanıcı ödemeyi tuttuktan sonra, Zoe'den bir ödeme sözü alır. Bu, teklif güvenliğinin sağlandığı ödemedir. Ödeme _ya_ kullanıcının istediği (yukarıdaki örnekte bir etkinlik bileti) _ya da_ koyduğu şeyin (%100'ü) tam geri ödenmesidir ($100 bu örnekte).

Teklif güvenliğini sağlayabiliyoruz çünkü Zoe ödemeyi kontrol ediyor. Örnekte, eğer Zoe'de akıllı bir kontrat kullanarak etkinlik biletimi satın almaya çalışırsam, kontrat Zoe'ye defter kaydını güncellemesini söyleyebilir. Ancak, Zoe yalnızca kaydını güncelleyip bana bir etkinlik bileti ödemesi yapar, bu güncellemenin teklif güvenliğine uygun ve toplam arzı koruduğu durumda.

Teklif güvenliğini sağlama kodu  dosyasındadır. Testler, kenar durumları da dahil olmak üzere,  dosyasında bulunmaktadır.

## Uygulama Soruları

**Teklif güvenliği altında tam geri ödeme _ve_ istediğimi alabilir miyim?**

Evet, tam geri ödeme _ve_ istediğinizi alabilirsiniz. Teklif güvenliği en az birinin doğru olmasını garanti eder. İkisi de doğru olabilir.

**`give` altında hiç kural yoksa ne olur?**

Eğer hiç kural yoksa ya da `give` atlanmışsa, o zaman koyduğunuz şeyin tam geri ödemesini alırsınız; bu, teklif güvenliğini yerine getirir. Sadece bir şey koymamış olursunuz, bu yüzden geri aldığınız da hiçbir şey olmaz. Ancak, bu durumda, istediğinizi de alabilirsiniz; bu, koyduğunuz hiçbir şeyin karşılığında teklifinizin kabul edilip edilmediğine bağlıdır.

**`want` altında hiç kural yoksa ne olur?**

Eğer hiç kural yoksa ya da `want` atlanmışsa, o zaman istediğinizi alırsınız; bu durumda hiç bir şey. Bu, teklif güvenliğini sağlamaktadır.