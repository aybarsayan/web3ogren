---
title: Genel Bakış - BSC Slashing
description: Bu belge, BSC slashing mekanizmasını ve farklı slashing durumlarını ele almaktadır. Slashing, kötü niyetli eylemleri cezalandırarak, doğrulayıcıların performansını artırmaya yardımcı olur. 
keywords: [BSC, slashing, doğrulayıcı, kötü niyetli eylem, Proof of Staked Authority, staking ödülleri, blok üretimi]
---

# BSC Slashing Genel Bakışı
Slashing, kötü niyetli veya olumsuz eylemleri cezalandıran bir zincir içi yönetişim bileşenidir. Herkes, BSC üzerinde bir slashing işlemi gönderebilir; bu, delil sağlamak ve ücret ödemeyi içerir. Başarılı gönderimler önemli ödüller getirir. Şu anda üç tür slashing durumu bulunmaktadır.

## Çift İmza
Bir doğrulayıcının aynı yükseklikte ve ana blokta birden fazla blok imzaladığı durumlarda oldukça ciddi bir hata oluşur ve bu muhtemelen kasıtlı bir suçtur. Referans protokol uygulamasının bunu önlemek için zaten bir mantığı olmalıdır; bu nedenle yalnızca kötü niyetli bir kod bunu tetikleyebilir. **Çift imza gerçekleştiğinde, doğrulayıcı hemen Validator Set'ten çıkarılmalıdır.**

:::tip
Herkes, BSC Slash Sözleşmesi'ne çift imza delili ile bir slashing işlemi sunabilir; bu, aynı yükseklikte ve ana blokta olan iki blok başlığını içermelidir ve saldırgan doğrulayıcı tarafından mühürlenmelidir.
:::

Delili aldığında, sözleşme onun geçerliliğini doğrulayacaktır.

> "Doğrulayıcı, doğrulayıcı setinden çıkarılacak, belirlenmiş bir miktar BNB, doğrulayıcının kendi kendine delegelenmiş BNB'sinden kesilecektir." — 

Hem doğrulayıcı hem de onun delegeleri staking ödüllerini almayacaklardır. Kesilen BNB'nin bir kısmı, gönderici adresine tahsis edilecektir; bu, bir ödül olup, slashing talep işlemi için harcanan maliyetten daha büyüktür. Kesilen BNB'nin geri kalanı, diğer doğrulayıcıların kredi adreslerine tahsis edilecek ve tüm delegelere bloke ödülüyle aynı şekilde dağıtılacaktır.

## Kötü Niyetli Hızlı Nihai Oylama
Bir doğrulayıcının aynı hedef yüksekliği için iki hızlı nihai oylama imzaladığı veya bir oylamanın aralığına diğer oylamanın aralığını dahil ettiği durumlarda oldukça ciddi bir hata oluşur ve bu muhtemelen kasıtlı bir suçtur. Referans protokol uygulamasının bunu önlemek için zaten bir mantığı olmalıdır; bu nedenle yalnızca kötü niyetli bir kod bunu tetikleyebilir. 

:::warning
Kötü niyetli oylama gerçekleştiğinde, doğrulayıcı hemen Validator Set'ten çıkarılmalıdır.
:::

Herkes, BSC Slash Sözleşmesi'ne kötü niyetli oylama delili ile bir slashing işlemi sunabilir. Kötü niyetli oylama delili sağlanmalı; bu, iki çelişkili oylama ve imza için kullanılan oylama anahtarını içermelidir. Delili aldığında, sözleşme onun geçerliliğini doğrulayacaktır.

> "Doğrulayıcı, mevcut doğrulayıcı setinden çıkarılacak ve gönderici, sistem sözleşmesinden ödül alacaktır." — 

Kendi kendine delegelenmiş BNB'den belirlenmiş bir miktar BNB kesilecektir. Hem doğrulayıcı hem de onun delegeleri staking ödüllerini almayacaklardır. Kesilen BNB, diğer doğrulayıcıların kredi adreslerine tahsis edilecek ve tüm delegelere bloke ödülüyle aynı şekilde dağıtılacaktır.

## Kullanılamama
BSC'nin canlılığı, Proof of Staked Authority doğrulayıcı setindeki herkesin, sırası geldiğinde blokları zamanında üretebilmesine dayanır. Doğrulayıcılar, özellikle donanım, yazılım, yapılandırma veya ağ sorunları gibi herhangi bir nedenle sıralarını kaçırabilirler. İşlemin bu istikrarsızlığı, performansı etkileyerek sisteme daha fazla belirsizlik katacaktır.

Her bir doğrulayıcının kaçırılan bloklama metriklerini kaydeden bir iç akıllı sözleşme bulunmaktadır. Eğer metrikler belirlenen eşiği aşarsa, doğrulayıcıya bloke ödülü verilmez, ancak daha iyi performans gösteren diğer doğrulayıcılarla paylaşılır. Bu süreç, düşük performans gösteren doğrulayıcıları setten yavaş yavaş çıkarmayı hedeflemekte ve onların delegeleri için ödülleri azaltmaktadır.


Detaylı Bilgi
Eğer metrikler daha yüksek bir eşikte kalırsa, doğrulayıcı rotasyondan çıkarılacak ve kendi kendine delegelenmiş BNB'sinden belirli bir miktar BNB kesilecektir. Bu işlem, hem doğrulayıcıların hem de delegelerin staking ödüllerini almasını engelleyecektir.
