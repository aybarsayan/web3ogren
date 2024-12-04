---
title: 3.xten 4.0a Geçiş
seoTitle: Geçiş Rehberi Socket.IO 3.xten 4.0a
sidebar_position: 2
description: Socket.IO 4.0.0 sürümüne geçişin detayları ve uyumsuzluklar hakkında bilgi. Önemli değişiklikler ve yeni özellikler hakkında derinlemesine bir inceleme.
tags: 
  - Socket.IO
  - yükseltme
  - uyumsuzluk
  - yapılandırma
keywords: 
  - Socket.IO 4.x
  - JavaScript
  - Node.js
  - API
---
4.0.0 sürümü, `aşağıda` ayrıntılı olarak belirtilen birçok yeni özellik eklerken, birkaç API uyumsuz değişikliği de içermektedir (bu nedenle büyük bir yükseltme yapılmıştır).

:::info
Lütfen, bu uyumsuz değişikliklerin yalnızca sunucu tarafındaki API'yi etkilediğini unutmayın. Socket.IO protokolü kendisi güncellenmedi, dolayısıyla v3 istemcisi **v4 sunucusuna** ve tam tersine erişebilecektir.
:::

Ayrıca, Socket.IO v2 istemcisi ile Socket.IO v4 sunucusu arasında uyumluluk modu (`allowEIO3: true`) hala mevcuttur.