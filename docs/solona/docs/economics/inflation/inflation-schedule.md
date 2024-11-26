---
sidebarLabel: Önerilen Enflasyon Takvimi
title: Önerilen Enflasyon Takvimi
altRoutes:
  - /docs/economics/inflation/inflation_schedule
  - /docs/intro/economics
---

Yukarıda belirtildiği gibi, ağın _Enflasyon Takvimi_ üç parametre ile benzersiz bir şekilde tanımlanmaktadır: _Başlangıç Enflasyon Oranı_, _Deflasyon Oranı_ ve _Uzun Dönem Enflasyon Oranı_. Bu sayıları değerlendirirken dikkate alınması gereken birçok faktör vardır:

- Enflasyon yoluyla çıkarılan SOL'un büyük bir kısmı, sahip oldukları SOL oranında paydaşlara dağıtılacaktır. 
- _Enflasyon Takvimi_ tasarımının, SOL delegesi yapan token sahipleri ve doğrulama hizmeti sağlayıcıları (._Staking Yields_'den kesilen komisyonlar aracılığıyla) için makul _Stake Getirileri_ sağlamasını istiyoruz.

:::tip
**Not:** _Stake Getirisi_'nin birincil belirleyicisi, stake edilmiş SOL miktarının toplam stake edilmiş SOL'a (% toplam stake edilmiş SOL) bölünmesidir.
:::

- Bu nedenle, tokenların doğrulayıcılar arasında dağıtımı ve delege edilmesi, başlangıç ​​enflasyon parametrelerini belirlerken anlaşılarak dikkate alınması gereken önemli faktörlerdir.
- Getiri kısıtlaması, _stake getirileri_ üzerinde etki edecek bir araştırma alanıdır. Bu konu burada veya aşağıdaki modellemede dikkate alınmamıştır.

---

- Genel token ihraç oranı - yani, **10 yıl** veya **20 yıl** içinde mevcut toplam arzın ne olmasını bekliyoruz?
- Uzun vadeli, dengede kalma enflasyonu, yalnızca doğrulayıcı ekosisteminin sürdürülebilir desteği için değil, aynı zamanda Solana Vakfı hibe programları için de önemli bir husustur ve zamanla beklenen token kayıpları ve yakma ile dikkate alınarak ayarlanmalıdır.
  
:::info
**Unutmayın:** Ağ kullanımının büyümesini beklediğimiz oran, deflasyon oranını göz önünde bulundurarak planlanmalıdır.
:::

Zamanla, enflasyonun düşmesini planlıyoruz ve kullanımın büyümesini bekliyoruz.

Bu hususlar ve başlangıç tasarımının ardından yapılan topluluk tartışmalarına dayanarak, Solana Vakfı aşağıdaki Enflasyon Takvimi parametrelerini önermektedir:

- **Başlangıç Enflasyon Oranı:** %8
- **Deflasyon Oranı:** -%15
- **Uzun Dönem Enflasyon Oranı:** %1.5

Bu parametreler önerilen _Enflasyon Takvimi_'ni tanımlar. Aşağıda bu parametrelerin sonuçlarını gösteriyoruz. Bu grafikte yalnızca yukarıda parametrik olarak tanımlanan Enflasyon Takvimi'ne bağlı enflasyon ihraçlarının etkisi gösterilmektedir. Diğer faktörlerin toplam arz üzerinde etkisini göz önünde bulundurmamaktadır, örneğin ücret/kira yakma, cezalandırma veya diğer öngörülemeyen gelecekteki token yok etme olayları. Dolayısıyla, burada sunulan, enflasyon yoluyla çıkarılan SOL miktarı için **üst limit**'tir.

![Örnek önerilen enflasyon takvimi grafiği](../../../images/solana/public/assets/docs/economics/proposed_inflation_schedule.png)

Yukarıdaki grafikte, belirtilen enflasyon parametrelerine göre zaman içinde yıllık enflasyon oranı yüzdesini görmekteyiz.

![Örnek önerilen toplam arz grafiği](../../../images/solana/public/assets/docs/economics/proposed_total_supply.png)

Benzer şekilde, burada zaman içinde SOL'un _Toplam Mevcut Arzı_ [MM]'yi görmekteyiz. Bu örnekte başlangıç _Toplam Mevcut Arz_ olarak `488,587,349 SOL` (yani, bu örnek için `2020-01-25` tarihli mevcut toplam arzı alarak ve o günden itibaren enflasyonu simüle ederek) alıyoruz.

> _Doğrulayıcı çalışma süresi ve komisyonları bir kenara bıraktığımızda, beklenen Stake Getiri ve Düzeltilmiş Stake Getiri metrikleri esasen ağdaki toplam stake edilmiş SOL'un yüzdesinin bir fonksiyonudur._  
> — Solana Vakfı

Bu nedenle, _Stake Getirisi_ modelleyebilmek için bir ek parametre tanıtalım: _Stake Edilen SOL Yüzdesi_:



Bu parametre, token sahiplerini ve stake teşviklerini dinamik bir özellik olduğu için tahmin edilmelidir. Burada sunulan _Stake Edilen SOL Yüzdesi_ değerleri %60 - %90 arasında değişmektedir; bu, yatırımcı ve doğrulayıcı topluluklardan alınan geri bildirimler ile karşılaştırılabilir Proof-of-Stake protokollerinde gözlemlenenlerle dikkate alınarak, beklediğimiz muhtemel aralıkları kapsamaktadır.

![Örnek stake getirileri grafiği](../../../images/solana/public/assets/docs/economics/example_staked_yields.png)

Yine, yukarıdaki grafik, belirtilen _Enflasyon Takvimi_ ile Solana ağında zaman içinde bir staker'ın bekleyebileceği örnek _Stake Getirisi_'ni göstermektedir. 

:::warning
**Not:** Bu, idealize edilmiş bir _Stake Getirisi_'dir çünkü ödüller üzerindeki doğrulayıcı çalışma süresi etkisini, doğrulayıcı komisyonlarını, potansiyel getiri kısıtlamalarını ve potansiyel ceza olaylarını dikkate almaz.
:::

Bunun yaninda, _Stake Edilen SOL Yüzdesi_'nin tasarım gereği dinamik olduğunu da göz ardı eder - bu _Enflasyon Takvimi'nin_ kurduğu ekonomik teşvikler, **Düzeltilmiş Stake Getiri** bölümünde (aşağıda) dikkate alındığında daha açık bir şekilde görülür.