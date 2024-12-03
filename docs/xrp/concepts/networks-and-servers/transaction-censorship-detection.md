---
title: İşlem Sansür Tespiti
seoTitle: XRP Ledger İşlem Sansür Tespiti
sidebar_position: 4
description: XRP Ledger, tüm rippled sunucularında mevcut olan otomatik bir işlem sansür dedektörü sunar. Bu sistem, işlemlerin sansürle ile ilgili durumunu izleyerek katılımcılara ağ üzerindeki etkileri gözlemleme fırsatı tanır.
tags: 
  - XRP Ledger
  - işlem sansürü
  - rippled
  - dedektör
  - blockchain
  - güvenlik
  - ağ izleme
keywords: 
  - XRP Ledger
  - işlem sansürü
  - rippled
  - dedektör
  - blockchain
  - güvenlik
  - ağ izleme
---
# İşlem Sansür Tespiti

badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.0Yeni: rippled 1.2.0/badge %}

XRP Ledger, sansüre dayanıklı olacak şekilde tasarlanmıştır. Bu tasarımı desteklemek amacıyla, XRP Ledger, tüm `rippled` sunucularında mevcut olan **otomatik bir işlem sansür dedektörü** sunarak, tüm katılımcıların sansürün ağ üzerindeki etkilerini görebilmesine olanak tanır.

:::info
Dedektör, ağ ile senkronize olduğunda, son konsensüs **konusu** çerçevesinde ve son doğrulanmış defterde kabul edilmiş tüm işlemleri takip eder.
:::

Bir `rippled` sunucusu, ağ ile senkronize olduğunda, dedektör, son konsensüs **konusu** çerçevesinde ve son doğrulanmış defterde kabul edilmiş tüm işlemleri takip eder. Dedektör, birkaç konsensüs turundan sonra doğrulanmış bir deftere dahil edilmemiş işlemleri gördüğünde, giderek artan ciddiyetle günlük mesajları yayınlar.

---

## Nasıl Çalışır

Yüksek seviyede, işlem sansür dedektörünün çalışma şekli şu şekildedir:

1. Dedektör, sunucunun ilk konsensüs önerisindeki tüm işlemleri takipçiye ekler.
2. Konsensüs turunun kapanışında, dedektör, sonuçlanan doğrulanmış deftere dahil edilen tüm işlemleri takipçiden çıkarır.
3. Dedektör, 15 defter boyunca takipçide kalan herhangi bir işlem için günlük kaydında bir **uyarı mesajı** yayınlar ve bunu potansiyel olarak sansürlenmiş bir işlem olarak ortaya koyar.

:::tip
Bu aşamada, işlemin takipçide varlığı, 15 konsensüs turundan sonra doğrulanmış bir deftere dahil edilmediği anlamına gelir.
:::

İşlem, diğer 15 defter boyunca takipçide kalmaya devam ederse, dedektör, günlük kaydında başka bir uyarı mesajı yayınlar.

İşlem, takipçide kaldığı sürece, dedektör her 15 defterde bir günlükte bir uyarı mesajı yayınlamaya devam eder ve en fazla beş uyarı mesajı verir. Beşinci uyarı mesajından sonra dedektör, günlük kaydında bir son **hata mesajı** yayınlar ve ardından uyarı ve hata mesajları yayınlamayı durdurur.

> Eğer bu mesajları `rippled` sunucu kaydınızda görüyorsanız, diğer sunucuların işlemi neden dahil etmediğini araştırmalısınız; başlangıçta bunun nedeninin kötü niyetli sansürden ziyade bir **yanlış pozitif** (masum hata) olma olasılığı daha yüksektir.  
> — XRP Ledger Takım

---

## Örnek Uyarı Mesajı

Bu, işlem sansür dedektörünün, işlem **E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7**'nin 15 defter boyunca takipçide kalması sebebiyle yayınladığı bir uyarı mesajıdır; bu süre defter 18851530'dan defter 18851545'e kadar uzanmıştır.

```text
LedgerConsensus:WRN Potansiyel Sansür: İzlediğimiz uygun işlem E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, defter 18851530'dan bu yana, defter 18851545 itibarıyla dahil edilmemiştir.
```

---

## Örnek Hata Mesajı

Bu, işlem sansür dedektörünün, işlem **E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7**'nin 75 defter boyunca (15'lik toplamda 5 set) takipçide kalması sebebiyle yayınladığı bir hata mesajıdır; bu süre defter 18851530'dan 18851605'e kadar uzanmıştır.

```text
LedgerConsensus:ERR Potansiyel Sansür: İzlediğimiz uygun işlem E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, defter 18851530'dan bu yana, defter 18851605 itibarıyla dahil edilmemiştir. Ek uyarılar bastırıldı.
```

---

## Potansiyel Yanlış Pozitifler

:::warning
İşlem sansür dedektörü belirli senaryolar altında yanlış pozitifler yayınlayabilir. Bu durumda, yanlış pozitif, dedektörün 15 defter veya daha fazla süreyle takipçide kalan ancak masum nedenlerden dolayı bir işlemi işaretlediği anlamına gelir.
:::

İşte dedektörün yanlış pozitif mesajlar yayınlamasına neden olabilecek bazı senaryolar:

- Sunucunuzda, ağın geri kalanından farklı bir kodla çalışan bir versiyon var. Bu, sunucunuzun işlemleri farklı bir şekilde uygulamasına neden olabilir ve yanlış pozitifler oluşturabilir. Bu tür bir yanlış pozitif olasılığı düşük olsa da, genel olarak, XRP Ledger sunucusunun uyumlu bir sürümünü çalıştırmak kritik öneme sahiptir.
- Sunucunuz ağ ile senkronize değildir ve henüz bunu fark etmemiştir.
- Ağdaki diğer sunucular, muhtemelen kendi sunucunuz dahil, işlemleri diğer sunuculara tutarsız bir şekilde ileten bir hata barındırmaktadır.

    Şu anda, bu beklenmedik davranışa neden olan bilinen bir hata yoktur. Ancak, bir hata etkisini gördüğünüzde, bunu [Ripple Hata Ödül Programı](https://ripple.com/bug-bounty/) aracılığıyla rapor etmeyi düşünebilirsiniz.

## Ayrıntılı Bilgiler

**Kavramlar**
- `Konsensüs İlkeleri ve Kuralları`
- `İşlem Kuyruğu`

**Eğitimler**
- `Güvenilir İşlem Gönderimi`
- `Günlük Mesajlarını Anlama`

**Referanslar**
- `İşlem Sonuçları`

