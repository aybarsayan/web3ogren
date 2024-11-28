---
title: Veri Bütünlüğü ve Erişilebilirlik - BNB Greenfield Veri Depolama
description: Bu belge, veri yönetiminin üç temel yönünü ve BNB Greenfield ile veri bütünlüğü ve erişilebilirliğinin nasıl sağlandığını ele almaktadır. Ayrıca, Challenge Kanıtı yaklaşımının önemine dair bilgiler sunmaktadır.
keywords: [veri bütünlüğü, erişilebilirlik, yedeklilik, BNB Greenfield, Challenge Kanıtı]
order: 6
---

# Veri Bütünlüğü ve Erişilebilirlik

Veri yönetiminin üç temel yönü vardır: **bütünlük**, **erişilebilirlik** ve **yedeklilik**.

Aşağıda her bir yönün sağlanmasını garanti altına almak için bazı temel noktalar bulunmaktadır:

- Birincil depolama sağlayıcısı, kullanıcının yüklediği nesneyi doğru bir şekilde saklamalıdır.
- Hem birincil hem de ikincil depolama sağlayıcılarındaki atanan veri segmentleri, herhangi bir kayıp, bozulum veya sahte veriden arındırılmalıdır.
- İkincil sağlayıcılardaki silme kodlama parçaları, birincil depolama sağlayıcısındaki orijinal verinin kurtarılmasını sağlamalıdır.

Veri bütünlüğü ve yedekliliği sağlamak için, nesneler için kontrol toplamı ve yedeklilik ayarları kurulmalıdır. Bu ayarlar, nesnelerin **meta verilerinin** bir parçasını oluşturur ve nesneler oluşturulduğunda depolama sağlayıcıları ve kullanıcılar tarafından doğrulanmalıdır. Meta veriler, Greenfield blok zincirinde saklanacaktır.

---

Greenfield ile depolama sağlayıcıları arasındaki işbirliği, veri bütünlüğü ve erişilebilirliğini sağlamak açısından kritik öneme sahiptir, özellikle veri segmentlerinin birincil ve ikincil depolama sağlayıcılarına atanmasında. Kullanıcıların verilerinin vaat edildiği gibi saklandığına dair güvenini artırmak için, Greenfield ["Challenge Kanıtı"](https://github.com/bnb-chain/greenfield/blob/master/docs/modules/data-availability-challenge.md) yaklaşımını tanıtmıştır.

:::info
 "Challenge Kanıtı" önerisi, varsayımlar üzerine kuruludur: **Greenfield, kendi kendine yeterli, hizmet odaklı bir ekosistemdir.**
:::

Paydaşlar, kullanıcılar veya Greenfield blok zincirindeki rastgele olaylar aracılığıyla çeşitli şekillerde zorlukları tetikleyebilir. Bir zorluğun ardından, `Zorluk Doğrulayıcı`, depolama sağlayıcılarından zorluk çıkarılan verinin **off-chain denetimini** gerçekleştirmelidir. Doğrulayıcı Konsorsiyumu, zorluk sonuçları üzerinde oy kullanacak ve başarısız sonuçlar, ilgili depolama sağlayıcılarının stake edilmiş BNB'sini azaltacaktır. Zorluğu sunan katılımcılar ve doğrulayıcı, bu süreçteki katılımları için ödüller alacaklardır.

> "Bir zorluğu geçemeyen veriler, depolama sağlayıcılarının verileri geri yüklemeleri için belirli bir süre boyunca başka bir zorlukla karşılaşmayacaktır." — 

[Veri zorlama modülü](https://github.com/bnb-chain/greenfield/blob/doc-refactor/docs/modules/data-availability-challenge.md), veri erişilebilirliği ile ilişkili zorluklar üzerinde daha fazla ayrıntı verecektir.