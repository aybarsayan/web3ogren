---
title: Değişiklikler
seoTitle: XRP Defteri Değişiklikleri ve Oylama Süreci
sidebar_position: 4
description: Değişiklikler, işlem işleme ile ilgili yeni özellikleri temsil eder. Uzlaşı yolu ile XRP Defterinde uygulanır. Her değişiklik, %80 destek alırsa geçerlilik kazanır.
tags: 
  - Değişiklikler
  - XRP
  - Blockchain
  - Uzlaşma
  - Yükseltmeler
  - Veri Doğrulama
keywords: 
  - Değişiklikler
  - XRP
  - Blockchain
  - Uzlaşma
  - Yükseltmeler
  - Veri Doğrulama
---

## Değişiklikler

Değişiklikler, işlem işleme ile ilgili yeni özellikleri veya diğer değişiklikleri temsil eder.

Değişiklik sistemi, XRP Defteri'ndeki işlem işlemeyi etkileyen değişiklikleri onaylamak için uzlaşı sürecini kullanır. **Tam işlevsel işlem süreci değişiklikleri, değişiklikler olarak sunulur; doğrulayıcılar ardından bu değişiklikler üzerinde oylama yapar.** Eğer bir değişiklik, iki hafta boyunca %80'den fazla destek alırsa, değişiklik geçer ve değişiklik kalıcı olarak tüm sonraki defter sürümlerine uygulanır. Geçmiş bir değişikliği devre dışı bırakmak için yeni bir değişikliğe ihtiyaç vardır.

:::tip
**İşlem süreçlerini değiştiren hata düzeltmeleri de değişiklikler gerektirir.**
:::

## Değişiklik Süreci

`XRP Defteri'ne Kod Katkısı` başlıklı konu, bir fikrden XRP Defteri'nde etkinleştirmeye kadar bir değişiklik geliştirme akışını anlatmaktadır.

Bir değişikliğin kodu bir yazılım sürümüne dahil edildikten sonra, **etkinleştirilme süreci** XRP Defteri ağı içinde gerçekleşir ve her _flag_ defterinin (genellikle yaklaşık 15 dakikada bir) değişikliklerin durumunu kontrol eder.

Her 256. defter, **flag** defteri olarak adlandırılır. Flag defteri özel içeriklere sahip değildir, ancak değişiklik süreci etrafında gerçekleşir.

1. **Flag Defteri -1:** `rippled` doğrulayıcıları, doğrulama mesajları gönderirken aynı zamanda değişiklik oylarını da sunar.
2. **Flag Defteri:** Sunucular güvenilir doğrulayıcılardan gelen oyları yorumlar.
3. **Flag Defteri +1:** Sunucular, ne olduğunu düşündüklerine dayanarak bir `EnableAmendment` sahte işlem ve bayrak ekler:
    * `tfGotMajority` bayrağı, değişikliğin %80'den fazla destek aldığını gösterir.
    * `tfLostMajority` bayrağı, değişiklik için desteğin %80 veya daha aza düştüğünü gösterir.
    * Hiçbir bayrak, değişikliğin etkinleştirildiği anlamına gelir.

    :::info
    **Bir değişikliğin, etkinleştirilmesi için gereken iki haftalık süreye ulaşırken aynı defterde %80 destek kaybetmesi mümkündür. Bu durumlarda, her iki senaryo için bir `EnableAmendment` sahte işlemi eklenir, ancak değişiklik nihayetinde etkinleştirilir.**
    :::

4. **Flag Defteri +2:** Etkinleşen değişiklikler, bu defterden itibaren işlemlere uygulanır.

---

## Değişiklik Oylaması

Her `rippled` sürümü, `bilinen değişiklikler` listesi ile derlenir ve bu değişiklikleri uygulayan kod da mevcuttur. `rippled` doğrulayıcılarının operatörleri, sunucularını her değişiklik üzerinde oy verecek şekilde yapılandırır ve bunu istedikleri zaman değiştirebilirler. Eğer operatör bir oy seçmezse, sunucu kaynak kodu tarafından tanımlanan bir varsayılan oyu kullanır.

:::note
**Varsayılan oy, yazılım sürümleri arasında değişebilir.** badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1Güncellendi: rippled 1.8.1/badge %}
:::

Değişikliklerin etkinleştirilmesi için güvenilir doğrulayıcıların %80'den fazla desteğini iki hafta boyunca koruması gerekir. Destek %80'in altına düşerse, değişiklik geçici olarak reddedilir ve iki haftalık dönem yeniden başlar. **Değişiklikler, kalıcı olarak etkin hâle gelmeden önce istediği kadar çoğunluk kazanabilir ve kaybedebilir.**

Kaynağı kaldırılmış ve etkinleştirilmemiş değişiklikler, ağ tarafından **Veto Edilmiş** olarak kabul edilir.

---

## Değişiklik Engellenmiş Sunucular

Değişiklik engelleme, XRP Defteri verilerinin doğruluğunu korumak için bir güvenlik özelliğidir. **Bir değişiklik etkinleştirildiğinde, değişikliğin kaynak koduna sahip olmayan daha eski `rippled` sürümlerini çalıştıran sunucular, ağın kurallarını artık anlamazlar.** Bu sunucuların defter verilerini tahmin etmeleri ve yanlış yorumlamaları yerine, **değişiklik engellenmiş** hale gelir ve şunları yapamazlar:

* Bir defterin geçerliliğini belirlemek.
* İşlem göndermek veya işlemek.
* Uzlaşma sürecine katılmak.
* Gelecek değişiklikler üzerinde oy kullanmak.

**Bir `rippled` sunucusunun oylama yapılandırması, değişiklik engellenmiş hale gelme üzerinde hiçbir etkiye sahip değildir.** Bir `rippled` sunucusu, ağın geri kalanının etkinleştirdiği değişiklikleri her zaman takip eder, bu nedenle engellenmeler yalnızca kural değişikliklerini anlamak için kod bulundurmaya dayalıdır. Bu, sunucunuzu farklı değiştirilmiş değişikliklerle etkinleştirilmiş bir paralel ağa bağlarsanız da değişiklik engellenmiş olabileceğiniz anlamına gelir. Örneğin, XRP Defteri Geliştirici Ağı, genellikle deneysel değişiklikler etkinleştirilmiş olarak bulunur. En son üretim sürümünü kullanıyorsanız, sunucunuz muhtemelen bu deneysel değişiklikler için kod bulundurmayacaktır.

**Değişiklik engellenmiş sunucuları, en yeni `rippled` sürümüne yükselterek engelini kaldırabilirsiniz.**

---

### Değişiklik Engellenmiş Clio Sunucuları

Clio sunucusu, defter verilerini yüklerken bilinmeyen bir alan türü ile karşılaşırsa değişiklik engellenmiş hale gelebilir. **Bu durum, alan, Clio'yu oluştururken kullanılan `libxrpl` bağımlılığından daha yeni olduğunda gerçekleşir.** Clio sunucunuzu engelini kaldırmak için, uyumlu bir `libxrpl` ile oluşturulmuş daha yeni bir Clio sürümüne yükseltin.

## Değişikliklerin Emekliye Ayrılması

**Değişiklikler etkinleştirildiğinde, önceden değişiklik davranışlarının kaynak kodu `rippled` içinde kalır.** Eski kodun saklanması gibi kullanım alanları olsa da, defter sonuçlarının doğrulanması için yeniden yapılandırma, değişikliklerin ve eski kodların izlenmesi zamanla karışıklığı artırır.

[XRP Defteri Standart 11d](https://github.com/XRPLF/XRPL-Standards/discussions/19) eski değişikliklerin ve ilgili ön değişiklik kodunun emekliye ayrılması için bir süreç tanımlar. **Bir değişiklik, Mainnet'te iki yıl boyunca etkinleştirildiğinde emekliye ayrılabilir.** Bir değişikliğin emekliye ayrılması, onu koşulsuz olarak ana protokolün bir parçası yapmakta; artık izlenmez veya değişiklik olarak muamele edilmez ve tüm ön değişiklik kodu kaldırılır.

## Ayrıca Bakınız

- **Kavramlar:**
    - `Uzlaşma`
- **Eğitimler:**
    - `rippled'i Doğrulayıcı Olarak Çalıştır`
    - `Değişiklik Oylamasını Yapılandır`
    - `XRP Defteri'ne Kod Katkısı`
- **Referanslar:**
    - `Bilinen Değişiklikler`

