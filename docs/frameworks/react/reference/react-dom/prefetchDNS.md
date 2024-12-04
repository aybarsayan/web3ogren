---
title: prefetchDNS
seoTitle: Prefetch DNS in React
sidebar_position: 4
description: The prefetchDNS function allows you to eagerly resolve the IP of a server from which resources will be loaded. This document explains its usage and parameters.
tags: 
  - React
  - prefetchDNS
  - performance
  - DNS
  - resource loading
keywords: 
  - React
  - prefetchDNS
  - performance
  - DNS
  - resource loading
---
`prefetchDNS` fonksiyonu şu anda yalnızca React'in Canary ve deneysel kanallarında mevcuttur. Daha fazla bilgi için `React'in sürüm kanalları hakkında burada okuyun`.





`prefetchDNS`, kaynakların yükleneceğini beklediğiniz bir sunucunun IP'sini hevesle araştırmanıza olanak tanır.

```js
prefetchDNS("https://example.com");
```