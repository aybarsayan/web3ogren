---
title: Neden OP Stack - opBNB Temel Kavramları
description: Bu doküman, OpBNB'nin işleyişi ve maliyet yapılandırması hakkında detaylı bilgi sağlamaktadır. Kullanıcılar için gaz ücretleri ve katman 2 işlemlerinin maliyeti gibi önemli konular ele alınmaktadır.
keywords: [OpBNB, gaz ücretleri, işlem maliyeti, BNB Akıllı Zinciri, veri sıkıştırma, katman 2, blok zinciri]
---

# Gaz ve Ücretler

OpBNB, BNB Akıllı Zinciri üzerindeki işlemler için daha yüksek verim ve daha düşük maliyet sağlamak amacıyla geliştirilmiş bir Katman 2 ölçeklendirme çözümüdür. OpBNB işlemlerinin maliyeti iki bileşenden oluşur: Katman 2 gaz ücreti ve Katman 1 gaz ücreti. Katman 2 gaz ücreti, işlemin hesaplama karmaşıklığını yansıtır. Katman 1 gaz ücreti, işlemlerin onaylanması ve kesinlik için BSC'ye gönderilmesinin maliyetini karşılar.

**Gaz fiyatı = temel fiyat + öncelik fiyatı**

**Katman 2 işlem maliyeti = Katman 2 gaz fiyatı x Katman 2 tüketilen gaz + Katman 1 gaz fiyatı x Katman 1 tüketilen gaz.**

## Mevcut yapılandırma

| İsim          | Taban Temel Fiyat | Minimum Öncelik Fiyatı |
| ------------- | ---------------- | ----------------------- |
| opBNB Testnet | 8 wei (dinamik)  | 1001 wei               |
| opBNB Mainnet | 8 wei (dinamik)  | 1001 wei               |
| BSC Testnet   | 0                | 3                       |
| BSC Mainnet   | 0                | 3                       |

## Bunun anlamı nedir

Lütfen taban temel fiyatın opBNB'nin ayarlayabileceği minimum temel fiyat olduğunu ve kullanım durumuna bağlı olarak taban fiyatın dalgalanabileceğini unutmayın. Örneğin, mevcut yapılandırmaya göre, bir bloğun kullanımı 100M gazın %50'sine ulaştığında, taban fiyat %12,5 artacaktır.

:::info
Minimum öncelik fiyatı önceden yapılandırılmıştır ve kullanıcılar bu sayıdan daha yüksek herhangi bir öncelik fiyatı verebilir. Genellikle, kullanıcılar "gaz fiyatı tahmini" API'sini çağırarak tahmini gaz fiyatını alırlar. Bu, tarihsel blokların mevcut ortalama gaz fiyatına göre önerilen bir gaz fiyatıdır.
:::

BNB Zinciri, işlem maliyetini kitlesel benimsemeyi sağlayacak seviyeye düşürmeyi hedeflemektedir; opBNB için transfer işlemlerinin hedefi $0.001'in altındadır.

## OpBNB, L2 işlemlerinin maliyetini nasıl azaltmaya devam ediyor

1. **Geliştirilmiş Veri Sıkıştırması**: L2 işlem verilerinin boyutunu azaltmak için daha ileri düzey veri sıkıştırma algoritmaları uygulanmaktadır.

2. **Verimli İşlem Gruplama**: İşlemlerin bir araya nasıl gruplandığını optimize ederek alan verimliliğini en üst düzeye çıkarma ve işlem başına maliyetleri azaltma.

3. **Veri Erişilebilirliği Çözümleri**: Ana zincirden bazı veri depolama yükünü hafifletmek için BNB Greenfield'deki çözümler gibi çözümler kullanılmaktadır.

4. **Sıfır Bilgi Kanıtları**: Tam işlem verisini ifşa etmeden işlemleri doğrulamak için sıfır bilgi kanıtlarının kullanılması, böylece L1 veri yükünü en aza indirmektedir.

5. **Protokol Düzeyinde Optimizasyonlar**: L2'de işlem işleme yükünü azaltmak için protokol düzeyinde iyileştirmeler yapılmaktadır.