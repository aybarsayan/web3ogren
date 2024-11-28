---
description: Token bağlama, BC ve BSC arasında daha fazla esneklik sağlamak için geliştirilmiştir. Bu süreç, kullanıcıların bağlı varlıklarını geri kazanmasını ve gelecekteki varlık göçlerini düzenlemelerini kolaylaştırır.
keywords: [token bağlama, BC, BSC, çapraz zincir, varlık yönetimi, token kurtarma, BEP20]
---

# Token Bağlama

Token bağlama, bir token'ın hem BC hem de BSC'de onaylanmış toplam arz ile dolaşımda olabilmesini sağlamak için tanıtılmıştır.

- Eğer bir token bağlandıysa, farklı kullanım durumları için BC ve BSC arasında transfer edilebilir.
  
  > "Son gün batımı hardfork'u sonrası BC ve BSC arasındaki çapraz zincir kapanacaktır." — Proje Geliştirici

  Ancak, kullanıcılar bağlı varlıkları BSC üzerinde geri kazanmak için token kurtarma aracını kullanabilirler (ama bu, çapraz zincir transferine kıyasla çok daha karmaşıktır).

- Eğer bir token bağlanmadıysa, son gün batımı hardfork'u sonrasında varlıklar artık geri kazanılamaz. 

 :::tip
 Token sahipleri veya ihraç edenleri, değerli token'larını bağlamak için harekete geçmelidir.
 :::

***NOT: BC Fusion programı Nisan 2024'te uygulanması planlanmaktadır. Varlık göçü için dikkatli planlama yapmayı ve fonları güvenli tutmayı unutmayın.***

Lütfen token'ın çapraz zincir transferlerine izin verip vermediğini doğrulamak için `**Varlıkların Çapraz Zincir Transferlerini Destekleyip Desteklemediğini Onaylayın**` adlı eğitimi kontrol edin. Eğer cevap olumluysa, tebrikler! Hiçbir şey yapmanıza gerek yok. Aksi takdirde, [Token Bağlama Aracı](https://github.com/bnb-chain/token-bind-tool) kullanarak BSC üzerinde bir BEP20 token'ı dağıtmanız ve çapraz zincir işlevselliğini etkinleştirmeniz şiddetle tavsiye edilir.

---

Zaman kısıtlamaları nedeniyle, Token İhraç edeninin bir an önce harekete geçmesi gerekmektedir. Token İhraç edeninin, varlık sahiplerini mümkün olan en kısa sürede göç etmeleri için zamanında bilgilendirmek üzere birden fazla kanal kullanması önerilmektedir. 

:::warning
**Not:** Çapraz zincir işlevselliğini desteklemeyen BEP2/BEP8 varlıkları, BC Fusion'dan sonra kalıcı olarak kaybolacaktır. Kullanıcılar bu varlıkları asla geri kazanamayacaklardır.
:::