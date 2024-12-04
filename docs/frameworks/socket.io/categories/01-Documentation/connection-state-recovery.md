---
title: Bağlantı Durumu Kurtarma
seoTitle: Bağlantı Durumu Kurtarma - Socket.IO
sidebar_position: 4
description: Bağlantı durumu kurtarma, istemcinin kesintiden sonraki durumunu geri yükler. Bu özellik, kaçırılan paketleri içerir ve gereksinimleri açıklar.
tags: 
  - bağlantı durumu kurtarma
  - socket.io
  - istemci
  - sunucu
  - kesinti
keywords: 
  - bağlantı durumu kurtarma
  - socket.io
  - istemci
  - sunucu
  - kesinti
---
Bağlantı durumu kurtarma, istemcinin geçici bir kesintiden sonra durumunu geri yüklemeyi sağlayan bir özelliktir; bu, kaçırılan paketleri de içerir.

:::info
Bu özellik, Şubat 2023'te yayınlanan `4.6.0` sürümünde eklendi.  
Sürüm notlarına `buradan` ulaşabilirsiniz.
:::

## Feragatname

Gerçek koşullarda, bir Socket.IO istemcisi, bağlantının kalitesine bakılmaksızın kaçınılmaz olarak geçici kesintiler yaşayacaktır.

Bu özellik, bu tür kesintilerle başa çıkmanıza yardımcı olacaktır, ancak paketleri ve oturumları sonsuza dek saklamak istemiyorsanız (`maxDisconnectionDuration` değerini `Infinity` olarak ayarlarsanız), kurtarmanın her zaman başarılı olacağından emin olamazsınız.

Bu nedenle, istemci ve sunucunun durumlarının senkronize edilmesi gereken durumu yine de ele almanız gerekecektir.