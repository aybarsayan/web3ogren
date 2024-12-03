---
title: İade Ödemeleri
seoTitle: İade Ödemeleri - Rehberiniz
sidebar_position: 4
description: Bir ödemenin amacı belirsiz olduğunda, onu gönderenine iade edin. Bu kılavuz, iade ödemeleri yaparken dikkat edilmesi gerekenleri açıklamaktadır.
tags: 
  - iade ödemeleri
  - ödeme türleri
  - XRP Ledger
  - kısmi ödemeler
  - müşteri memnuniyeti
  - otomatik işlem
  - ödeme politikaları
keywords: 
  - iade ödemeleri
  - ödeme türleri
  - XRP Ledger
  - kısmi ödemeler
  - müşteri memnuniyeti
  - otomatik işlem
  - ödeme politikaları
---

# İade Ödemeleri

Adreslerinizden biri belirsiz bir amaca sahip bir ödeme aldığında, parayı gönderenine geri iade etmeyi öneriyoruz. Bu, parayı cebinize atmak yerine daha fazla iş olsa da, **müşterilere karşı iyi niyet gösterir**.

:::tip
Bir operatörü manuel olarak ödemeleri iade etmeye yönlendirebilir veya bunu otomatik olarak yapacak bir sistem oluşturabilirsiniz.
:::

### Önemli Gereklilikler

İade ödemeleri için birincil gereklilik, `gelen ödemeleri sağlam bir şekilde izlemektir`.

> "Müşterinize gönderdiğinden fazla bir geri ödeme yapmayı istemezsiniz!"  
> — Önemli bir not

Bu, iade süreciniz otomatikse özellikle önemlidir. Kötü niyetli kullanıcılar, `kısmi ödemeler` göndererek naif bir entegrasyonu istismar edebilir.

### Kısmi Ödemeler

İkincisi, **iade edilen ödemeleri Kısmi Ödemeler olarak göndermelisiniz**. Üçüncü taraflar adresler arasındaki yolların maliyetini manipüle edebildiğinden, Kısmi Ödemeler, XRP Ledger'daki döviz kurları konusunda endişelenmeden tam tutardan feragat etmenizi sağlar.

:::info
İade ödemeleri politikalarınızı kullanım şartlarınızın bir parçası olarak duyurmalısınız.
:::

İade edilen ödemeyi ya bir operasyonel adres ya da bir yedek adres üzerinden gönderin.

### Kısmi Ödeme Göndermek

Bir Kısmi Ödeme göndermek için, işleminizde `tfPartialPayment` bayrağını etkinleştirin.

1. `Amount` alanını aldığınız tutar olarak ayarlayın.
2. `SendMax` alanını atlayın.
3. İade ödemesi için `DestinationTag` değeri olarak gelen ödemenin `SourceTag` değerini kullanmalısınız.

:::warning
İki sistemin ödemeleri sürekli olarak birbirine iade etmesini önlemek için, çıkan iade ödeme için yeni bir Kaynak Etiketi ayarlayabilirsiniz.
:::

Eğer beklenmedik bir ödeme alırsanız ve bu ödemenin Hedef Etiketi, gönderdiğiniz bir iade ile eşleşiyorsa, o zaman bunu tekrar iade etmeyin.