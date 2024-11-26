---
sidebarLabel: Enflasyon Terminolojisi
title: Enflasyonla İlgili Terminoloji
---

Enflasyon ve ilgili bileşenler (örneğin, ödüller/getiri/faiz) hakkında tartışılırken birçok terim kullanılmaktadır; burada yaygın olarak kullanılan bazı kavramları tanımlamaya ve netleştirmeye çalışıyoruz:

### Toplam Mevcut Arz [SOL]

Üretilen (genesis blok veya protokol enflasyonu aracılığıyla) toplam token miktarı (kilitli veya kilitsiz) ile herhangi bir şekilde yakılan (işlem ücretleri veya diğer mekanizmalar aracılığıyla) veya slashed token miktarının çıkarılması. Ağın başlatılmasıyla birlikte, 500.000.000 SOL genesis blokta oluşturuldu. O zamandan beri, Toplam Mevcut Arz, işlem ücretlerinin yakılması ve planlı bir token azaltma olayı ile azaltılmıştır. Solana'nın _Toplam Mevcut Arz_ bilgisi şu adreste bulunabilir: [https://explorer.solana.com/supply](https://explorer.solana.com/supply)

### Enflasyon Oranı [%]

Solana protokolü, önceden belirlenmiş bir enflasyon programına göre otomatik olarak yeni tokenlar oluşturacaktır (aşağıda tartışılmıştır). _Enflasyon Oranı [%]_ herhangi bir zamanda _Toplam Mevcut Arz'ın_ yıllık büyüme oranıdır.

### Enflasyon Programı

:::info
Token arzının zaman içindeki deterministik bir tanımı. Solana Vakfı, deflasyonist bir _Enflasyon Programı_ önermektedir. Yani, enflasyon en yüksek değerinden başlar, oran zamanla azalır ve önceden belirlenmiş bir uzun vadeli enflasyon oranında stabil hale gelir (aşağıdaki tartışmaya bakınız).
:::

Bu program tamamen ve benzersiz bir şekilde üç sayı ile parametrelenmiştir:

- **Başlangıç Enflasyon Oranı [%]**: Enflasyonun ilk etkinleştirildiği zamanda başlayan _Enflasyon Oranı_. Token arzı oranı yalnızca bu noktadan itibaren azalabilir.
- **Deflasyon Oranı [%]**: _Enflasyon Oranı'nın_ azaltılma oranı.
- **Uzun Vadeli Enflasyon Oranı [%]**: Beklenen stabil, uzun vadeli _Enflasyon Oranı_.

### Etkili Enflasyon Oranı [%]

Diğer faktörler göz önünde bulundurulduğunda Solana ağında gerçekten gözlemlenen enflasyon oranı. _Enflasyon Programında_ açıklananların dışında tokenların oluşturulması mümkün değildir.

- _Enflasyon Programı_, protokollerin SOL talep şekilini belirlese de, bu, ekosistemdeki tokenların çeşitli faktörler nedeniyle eşzamanlı olarak ortadan kaldırılmasını göz ardı eder. Ana token yakma mekanizması, her işlem ücretinin bir kısmının yakılmasıdır. Her işlem ücretinin %50'si yanar, geri kalan ücret ise işlemi işleyen doğrulayıcı tarafından tutulur.
- Özel anahtarların kaybı ve slashing olayları gibi ek faktörler de _Etkili Enflasyon Oranı_ analizinde dikkate alınmalıdır. **Örneğin**, tüm BTC'lerin %10-20'sinin kaybolduğu ve kurtarılamaz halde olduğu tahmin edilmektedir — bu ağlar benzer yıllık kayıplar yaşayabilir; bu oran %1-2'dur.

### Stake Getirisi [%]

Ağda stake edilen SOL üzerinde kazanılan getiri oranı (diğer adıyla _faiz_). Genellikle yıllık bir oran olarak ifade edilir (örneğin, "ağın _stake getirisi_ şu anda yılda %10'dur").

- _Stake getirisi_, token dilüsyonu (aşağıda tartışılan) nedeniyle tokenlarını devretmek isteyen doğrulayıcılar ve token sahipleri için büyük ilgi görmektedir.
- Enflasyonist arzların %100'ü, stake edilen token sahiplerine, stake ettikleri SOL miktarına oranla ve kendilerine tahsis edilen SOL üzerinden komisyon alan doğrulayıcılara dağıtılacaktır.

:::note
Ekonomiye _Archiver'ların_ dahil edilmesiyle, enflasyonist arzların ek bir şekilde bölünmesi üzerine gelecekte bir değerlendirme yapılabilir. _Archiver'lar_, merkeziyetsiz bir depolama hizmeti sunan ağ katılımcılarıdır ve bu hizmet için enflasyon arzlarındaki token dağıtımı ile teşvik edilmelidir.
:::

- Benzer şekilde, erken tasarımlar, operasyonel giderler ve gelecekteki hibe için Vakıf hazineye dağıtılması gereken enflasyonist arzın sabit bir yüzdesini belirlemiştir. Ancak, enflasyon Vakf'a ayrılan bir pay olmadan başlayacaktır.
- _Stake getirisi_, _Enflasyon Programı_ ile birlikte, belirli bir zamanda stake edilen _Toplam Mevcut Arz_ oranından hesaplanabilir.

```markdown
$$
\begin{aligned}
\text{Stake Getirisi} =~&\text{Enflasyon Oranı}\times\text{Doğrulayıcı Uptime}~\times \\
&\left( 1 - \text{Doğrulayıcı Ücreti} \right) \times \left( \frac{1}{\%~\text{SOL Stake Edildi}} \right) \\
\text{nerede:}\\
\%~\text{SOL Stake Edildi} &= \frac{\text{Toplam SOL Stake Edildi}}{\text{Toplam Mevcut Arz}}
\end{aligned}
$$
```

### Token Dilüsyonu [%]

Dilüsyon, yeni tokenların eklenmesi nedeniyle daha büyük bir küme içindeki bir dizi tokenın orantılı temsilindeki değişiklik olarak tanımlanır. Pratik terimlerle, ağdaki enflasyon arzı dağıtımı nedeniyle stake edilen veya edilmeyen tokenların dilüsyonundan bahsediyoruz. Görüldüğü gibi, dilüsyon her token sahibi üzerinde etkili olurken, stake edilmeyen token sahipleri için _nispi_ dilüsyon, asıl endişe olmalıdır. **Burada önemli olan**;

- Stake edilen tokenlar, enflasyon arzının orantılı dağıtımından faydalanacakları için stake edilen token sahiplerinin dilüsyon endişelerini azaltmalıdır. 
- Yani, 'enflasyondan' gelen dilüsyon, stake edilen token sahiplerine yeni tokenların dağıtımı ile dengelenmektedir; bu grup için enflasyonun 'dilüsyon etkilerini' ortadan kaldırmaktadır.

### Ayarlanmış Stake Getirisi [%]

Stake edilen tokenlardan elde edilen kazanç potansiyelinin tam değerlendirilmesi, stake edilen _Token Dilüsyonu_ ve bunun _Stake Getirisi_ üzerindeki etkisini dikkate almalıdır. Bunun için, enflasyon arzının dağıtımı nedeniyle stake edilen tokenların sahiplik oranındaki değişikliği olan _Ayarlanmış Stake Getirisi_'ni tanımlıyoruz.

:::tip
Yani, enflasyonun olumlu dilüsyon etkileri.
:::