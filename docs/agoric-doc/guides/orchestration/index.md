---
title: Agoric Orkestrasyonu Nedir?
---

# Agoric Orkestrasyonu Nedir?

Agoric'in Orkestrasyon yeteneği, geliştiricilerin mevcut uygulamalara kolayca çapraz zincir etkileşimleri entegre etmesini veya tamamen yeni çapraz zincir odaklı ürünler yaratmasını sağlar.

Agoric Orkestrasyon API'si, çok zincirli uygulamaların mümkün olmasını sağlayan üç ana unsuru sunan Agoric'in özgün VM'inin üstünde çalışır:

- **Uzaktan hesap kontrolü ve transferi**: Orkestrasyon API'lerini kullanarak uzaktaki zincirlerde hesaplar oluşturabilir, varlıkları transfer edebilir ve sözleşmeleri çağırabilirsiniz. Agoric sözleşmeniz tüm davranışları doğrudan orkestre eder.
- **`async` ve `await` ile çok bloklu yürütme**: Agoric uygulamaları asenkron olarak iletişim kurar ve yanıtları bekler, bu yanıtlar aynı blokta veya birçok blok (veya haftalar!) sonra gelebilir. Sözleşmeler, yanıt geldiğinde yürütmeye devam eder.
- **Zincir Üstü Zamanlayıcılar**: Sözleşmeler, düzenli yürütme için zamanlayıcılar ayarlayabilir; bu da abonelikler gibi yaygın faaliyetleri yürütmeyi kolaylaştırır.

Agoric'in Orkestrasyon API'leri, uzaktaki zincirlerde hesapları kontrol etmeyi, varlıkları taşımayı ve API'nin eriştiği herhangi bir zincirde yetenekleri kullanmayı basitleştirir.





## Orkestrasyon Genel Bakış

Agoric'in Orkestrasyon API'si, geliştiricilerin farklı etkileşimli zincirler ve hizmetler üzerinden sorunsuz uygulamalar oluşturmasına yardımcı olabilecek bir araçtır. Bu bileşenlilik, farklı blockchain ekosistemlerinin benzersiz güçlerinden yararlanan kullanıcı merkezli uygulamaların geliştirilmesine olanak tanır.

Agoric Orkestrasyon API'si, özellikle Cosmos içindeki  protokolünü kullanan birden fazla ağ arasındaki etkileşimleri basitleştirir. API, çok aşamalı süreçleri basitleştirerek bir soyutlama katmanı olarak işlev görür.

Orkestrasyon, mevcut Agoric bileşenleri (, Cosmos modülleri) ile entegre olur ve vat-orkestrasyonu tanıtır. Bu , Ara Zincir Hesap (ICA) kimliklerini ve ev sahibi zincirlere bağlantıları yönetir, böylece uygun işlem yetkilendirmesini sağlar.

Orkestrasyon API'si, birden fazla zinciri kapsayan karmaşık iş akışlarını ve asenkron görevleri yönetir. Bu, akıllı sözleşmeleri, transfer vatından gelen bildirimler ve IBC ara katman güncellemeleri tarafından kolaylaştırılan ara zincir stake etme ve çoklu atlama transferleri gibi eylemler için güçlendirir. Orkestrasyon, Agoric platformunda güvenli ve kullanıcı kontrolünde bir ortamda karmaşık çapraz zincir etkileşimlerini basitleştirir.

## Orkestrasyon API Akışına Giriş

Aşağıdaki dizilim diyagramı, Agoric platformundaki Orkestrasyon sürecinin kapsamlı bir genel görünümünü sağlamaktadır. Bu örnek, Orkestrasyon kütüphanesi (`OrchLib`) üzerinden çapraz zincir operasyonlarının nasıl kolaylaştırıldığını vurgulayarak çeşitli bileşenler arasındaki etkileşimi illüstre eder. Bu, Orkestrasyon API'sinin akışını anlamak için iyi bir ilk örnektir; çapraz zincir işlemlerini oluşturma ve yönetme adımlarını göstermektedir.



