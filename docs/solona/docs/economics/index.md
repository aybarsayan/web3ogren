---
sidebarLabel: Ekonomi
title: Solana Ekonomisi Genel Görünümü
altRoutes:
  - /docs/intro/economics
sidebarSortOrder: 5
---

**Değişikliklere tabi.**

Solana'nın kripto-ekonomik sistemi, sağlıklı, uzun vadeli ve kendine yeterli bir ekonomi teşvik etmek için tasarlanmıştır; burada katılımcı teşvikleri ağın güvenliği ve merkeziyetsizliği ile uyumlu hale getirilmiştir. Bu ekonominin ana katılımcıları doğrulayıcı istemcileridir. Ağa katkıları, durum doğrulama ve gerekli teşvik mekanizmaları aşağıda tartışılmıştır.

Katılımcı havalelerinin ana kanalları, protokol tabanlı ödüller ve işlem ücretleri olarak adlandırılmaktadır. Protokol tabanlı ödüller, protokol tarafından tanımlanan enflasyon takviminden gelen enflasyonist ihraçlardan türetilir. Bu ödüller, doğrulayıcı istemcilere sunulan toplam protokol tabanlı ödülü oluşturacak ve kalan kısım işlem ücretlerinden sağlanacaktır. 

:::tip
Ağın ilk günlerinde, önceden belirlenmiş ihraç takvimine dayalı olarak dağıtılan protokol tabanlı ödüllerin, katılımcıları ağa katılmaları için teşvik etmede büyük ölçüde etkili olması muhtemeldir.
:::

Bu protokol tabanlı ödüller, her dönem için hesaplanır ve aktif atanan pay ve doğrulayıcı seti (her doğrulayıcı komisyonu başına) arasında dağıtılır. Aşağıda daha fazla tartışılacağı üzere, yıllık enflasyon oranı önceden belirlenmiş bir disinflasyon takvimine dayanmaktadır. Bu, ağa arz öngörülebilirliği sağlar ve uzun vadeli ekonomik istikrarı ve güvenliği destekler.

İşlem ücretleri, ağ etkileşimleri sırasında bir önerilen işlemin dahil edilmesi ve gerçekleştirilmesi için bir motivasyon ve tazminat olarak katılımcılar arası transferlerdir. 

:::warning
Uzun vadeli ekonomik istikrar ve her işlem ücretinin kısmi olarak yakılması yoluyla fork koruması için bir mekanizma aşağıda tartışılmaktadır.
:::

Öncelikle enflasyon tasarımının bir genel görünümü sunulmaktadır. Bu bölüm, aşağıda enflasyon ve ilgili bileşenlerin tartışılmasında yaygın olarak kullanılan `Terminoloji` tanımlayarak ve netleştirerek başlamaktadır. Ardından, Solana'nın önerilen `Enflasyon Takvimi` yani, protokol tarafından yönlendirilen enflasyonist ihraçları zaman içinde özel olarak tanımlayan belirli parametreleri özetliyoruz. 

Sonraki bölümde, `Düzeltilmiş Stake Getirisi` ve token seyreltmesinin staking davranışını nasıl etkileyebileceğine dair kısa bir bölüme yer verilmektedir.

:::note
Solana'daki `İşlem Ücretleri` ile ilgili bir genel görünüm, `Depolama Kirası Ekonomisi` tartışması ile devam etmektedir; burada defterin aktif durumunu sürdürmenin dışsal maliyetlerini hesaba katmak için bir depolama kirası uygulamasını açıklamaktayız.
:::

---