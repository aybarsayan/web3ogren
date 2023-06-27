---
sidebar_label: Actor Model
sidebar_position: 6
---
# Aktör Modeli (Actor Model)

Gear Protokolü'nün temel ve ayırt edici özelliklerinden biri, **Aktör Modeli**'dir. Bu model, mesaj iletişimi ve paralel hesaplama sağlayarak elde edilebilecek hızı önemli ölçüde artırır ve daha karmaşık dApp'lerin daha kolay bir şekilde oluşturulmasına olanak tanır. Gear Protokolü üzerinde yazılan asenkron dApp'ler, varsayılan olarak zincirler arası uyumluluk sağlar.

Eş zamanlı bilgi işlem sistemlerinde, "mesaj iletişimi" programların mesaj alışverişi yaparak iletişim kurması anlamına gelir. Bu, "paylaşılan bellek iletişimi"ne göre avantaj sağlar çünkü mesaj iletişimi, paylaşılan bellek eşzamanlılığından daha anlaşılır, daha sağlam ve daha iyi performans özelliklerine sahiptir.

Aktör modeli yaklaşımının temel prensibi, programların hiçbir zaman durum paylaşmaması ve yalnızca mesaj alışverişi yapmasıdır. Aktör modeli ile bir sistem, birbirleriyle sadece mesajlaşma yoluyla iletişim kuran aynı anda çalışan nesnelerden oluşur.

Normal bir Aktör modeli mesaj sıralamasını garanti etmezken, Gear Protokolü, iki belirli program arasındaki mesaj sırasını koruma garantisi sunar.

Aktörler birbirinden izole edilmişlerdir ve belleği paylaşmazlar. Her bir aktörün bir durumu vardır ve bu durumu değiştirmenin tek yolu bir mesaj almasıdır.

Aktör modeli, yüksek ölçeklenebilirlik ve yüksek hata toleransı garantisi sağlar. Web3'te uygulamalar zamanla daha hesaplama yoğun hale geldikçe, Aktör modeli, bu sürekli ölçeklenmeyi desteklemek için CPU teknolojilerindeki ilerlemelere olanak tanıyacaktır.

## Aktör

Aktör modelindeki bir Aktör, mesaj gönderip alabilen bir atomik hesaplama birimidir. Gear ile Gear Protokolü'ndeki her örnek bir Aktördür - bir program (akıllı sözleşme) veya bir programa mesaj gönderen bir kullanıcı. Her Aktörün içsel özel bir durumu vardır ve kullanıcıların bir posta kutusu bulunur. İletişim asenkron olarak gerçekleşir, mesajlar posta kutusundan alınır ve mesaj işleme akışlarında döngüler halinde işlenir.

Bir aktör bir mesaj alır ve işlerken cevap aşağıdakilerden biri olabilir:
- Başka bir aktöre mesaj gönderme
- Başka bir aktör oluşturma
- Kendi iç durumunu değiştirme



Aktörler bağımsızdır, hiçbir zaman durum paylaşmazlar ve sadece birbirleriyle mesaj alışverişi yaparlar.

Aktör modeli yaklaşımı, akıllı sözleşme mantığı içinde Aktör tabanlı eş zamanlılığı uygulamanın bir yolunu sunar. Asenkron programlama için çeşitli dil yapısını kullanabilir (Rust'ta Futures ve async-await).

## Async/await desteği

Sınıfların aksine, Aktörler yalnızca bir görevin aynı anda değiştirilebilir durumlarına erişmesine izin verir, bu da birden çok görevdeki kodun aynı aktör örneğiyle etkileşime geçmesini güvenli hale getirir.

Asenkron işlevler, eş zamanlı yönetimi önemli ölçüde kolaylaştırır, ancak kilitlenmelerin veya durum bozulmalarının olasılığıyla başa çıkmaz. Kilitlenmelerin veya durum bozulmalarının önlenmesi için, asenkron işlevler kendi iş parçacıklarını engelleyebilecek işlevleri çağırmaktan kaçınmalıdır. Bunun sağlanması için await ifadesi kullanılır.

Mevcut durumda, tipik akıllı sözleşme kodunda async/await desenlerinin normal destek eksikliği, akıllı sözleşme geliştiricileri için birçok sorun ortaya çıkarır. Aslında, akıllı sözleşme program akışında daha iyi kontrol elde etmek, el yapımı işlevler ekleyerek (Solidity akıllı sözleşmelerinde olduğu gibi) daha fazla veya daha az mümkündür. Ancak bir kontratta birçok işlev olduğunda, hangi işlevin kontratın yaşam döngüsünde hangi aşamada çağrılabileceği kolayca karıştırılabilir. Bu, alan uzmanı dillerini kullanarak akıllı sözleşmeler yazan geliştiriciler için gereksiz karmaşıklık getirir.

Gear, herhangi bir programa karşı keyfi async/await sözdizimini doğal olarak sağlar. Bu, geliştirme ve test sürecini büyük ölçüde basitleştirir, akıllı sözleşme geliştirme aşamasında hataların olasılığını azaltır. Gear Protokolü'nün API'sı, programın mantığına bağlı olarak await ifadeleri kullanmadığında senkron mesajları da destekler.