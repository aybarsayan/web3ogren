---
title: "Kabul Edilebilir Kullanım Politikası"
description: Deno Deploy hizmetinin Kabul Edilebilir Kullanım politikası, kullanıcıların hizmetten nasıl yararlanması gerektiği hakkında bilgiler sunmaktadır. Bu politika, kaynakların uygun ve etkili şekilde kullanılmasını sağlamayı amaçlamaktadır.
keywords: [Kabul Edilebilir Kullanım, Deno Deploy, hizmet kullanımı, kaynak yönetimi, web uygulamaları]
---

Deno Deploy hizmeti, bu Kabul Edilebilir Kullanım politikasına tabi olan kaynakları (CPU süresi, istek sayıları) içermektedir. Bu belge, "Kabul Edilebilir Kullanım" olarak düşündüğümüz şeylere ve düşündüğümüz şeylere kaba bir tahmin verebilir.

### Kabul Edilebilir Kullanım Örnekleri

- ✅ Sunucu tarafında render edilen web siteleri
- ✅ Jamstack siteleri ve uygulamaları
- ✅ Tek sayfa uygulamaları
- ✅ DB veya dış API sorgulayan API'ler
- ✅ Kişisel bir blog
- ✅ Bir şirket web sitesi
- ✅ E-ticaret sitesi
- ✅ Ters proxy

:::tip
Bu örnekler, Deno Deploy hizmetindeki en iyi uygulamaların anlaşılmasına yardımcı olur. Gerekirse kendi kullanım senaryonuzu da oluşturabilirsiniz.
:::

### Kabul Edilemez Kullanım

- ❌ Kripto para madenciliği
- ❌ Yüksek CPU tüketen yük (örneğin, makine öğrenmesi)
- ❌ Dış siteler için medya barındırma
- ❌ Tarayıcılar
- ❌ İleri proxy
- ❌ VPN

:::warning
Bu kullanım örnekleri, Deno Deploy hizmetinin sürdürülebilirliği için önemlidir. Kabul edilemez kullanım durumlarının proje performansını olumsuz etkileyebileceğini unutmayın.
:::

## Yönergeler

Çoğu projenin kullanım sınırları içinde kalmasını bekliyoruz. Projenizin kullanımı normdan önemli ölçüde saparsa sizi bilgilendireceğiz. Altyapımız üzerinde aşırı yük oluşturacak herhangi bir durumu ele almadan önce mümkün olduğunda sizinle iletişime geçeceğiz.

> **Not:** Proje sahipleri, Deno Deploy hizmetini kullanmayı planlarken bu politikayı dikkate almalıdır. Bu sayede sorun yaşamaktan kaçınırlar.  
> — Deno Deploy Ekibi