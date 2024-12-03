---
title: Açık, Kapalı ve Onaylı Defterler
seoTitle: Açık, Kapalı ve Onaylı Defterler - XRP
sidebar_position: 4
description: Ledger nesneleri, açık, kapalı veya onaylı olmak üzere üç duruma sahiptir. Bu dokümanda, her bir defter türünün özellikleri ve işleyişi hakkında detaylı bilgiler sunulmaktadır.
tags: 
  - defter
  - XRP
  - açık defter
  - kapalı defter
  - onaylı defter
keywords: 
  - defter
  - XRP
  - açık defter
  - kapalı defter
  - onaylı defter
---

# Açık, Kapalı ve Onaylı Defterler

`rippled` sunucusu, defter versiyonları arasında _açık_, _kapalı_ ve _onaylı_ olanlarla ayrım yapar. Bir sunucunun bir açık defteri, herhangi sayıda kapalı ancak onaylanmamış defteri ve onaylı defterlerin değişmez bir geçmişi vardır. Aşağıdaki tablo farkı özetlemektedir:

| Defter Türü:                    | Açık                       | Kapalı                                    | Onaylı |
|:--------------------------------|:---------------------------|:------------------------------------------|:--|
| **Amaç:**                       | Geçici çalışma alanı      | Önerilen bir sonraki durum                | Onaylı önceki durum |
| **Kullanılan sayı:**           | 1                          | Herhangi bir sayı, ancak genellikle 0 veya 1 | Defter dizininden her biri, zamanla artarak |
| **İçerikler değişebilir mi?**   | Evet                       | Hayır, ancak tüm defter değiştirilebilir   | Asla |
| **İşlemler şurada uygulanır:**   | Geldikleri sırayla        | Kesin sırada                              | Kesin sırada |

:::info
Anlaşılması zor bir şekilde, XRP Defteri hiçbir zaman bir açık defteri kapatarak kapalı bir deftere dönüştürmez. Bunun yerine, sunucu açık defteri atar, önceki kapalı defterin üzerine işlemler uygulayarak yeni bir kapalı defter oluşturur ve ardından en son kapalı defteri temel alarak yeni bir açık defter oluşturur.
:::

Bu, `konsensüsün çift harcama sorununu nasıl çözdüğü` ile sonuçlanan bir durumdur.

Açık bir defter için, sunucular işlemleri, bu işlemlerin göründüğü sırayla uygular, ancak farklı sunucular işlemleri farklı sıralarda görebilir. Gerçekten hangi işlemin önce gönderildiğini belirleyecek merkezi bir zaman tutucu olmadığı için, sunucular aynı zamanda gönderilen işlemlerin tam sırası konusunda farklı görüşlere sahip olabilirler. Bu nedenle, `onaylama` için uygun bir kapalı defter versiyonu hesaplama süreci, önerilen işlemlerden gelen açık bir defter oluşturma sürecinden farklıdır. "Kapalı" bir defter oluşturmak için, her XRP Defteri sunucusu, bir dizi işlem ve önceki veya "ebeveyn" defter versiyonu ile başlar. Sunucu, işlemleri kesin bir sıraya koyar ve ardından bu sırayla önceki deftere uygular. Kesin sıra, belirleyici ve verimli olacak şekilde tasarlanmıştır, ancak yanıltması zor olması için, `dağıtık borsa` tekliflerinde öne geçme zorluğunu artırır.

:::tip
Bu süreçleri anlamak, XRP Defteri'nin işleyişini kavramanın yanı sıra, işlemlerle ilgili potansiyel hataları azaltmak için büyük önem taşır.
:::

Bu nedenle, açık bir defter her zaman geçici bir çalışma alanı olarak kullanılır, bu da işlemlerin `geçici sonuçlarının nihai sonuçlarından farklı olmasının` başlıca nedenlerinden biridir.