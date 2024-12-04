---
title: Tek Dosya Bileşenlerinde setup İşlevi
seoTitle: Tek Dosya Bileşenlerinde setup İşlevi
sidebar_position: 1
description: Tek dosya bileşenlerinde  yapısının nasıl kullanılacağını açıklayan bir rehberdir. Bu yapı ile birlikte Composition APInin avantajları sunulmaktadır.
tags: 
  - Vue
  - Komponent
  - API
  - JavaScript
keywords: 
  - Vue
  - Script Setup
  - Component
  - Composition API
---

`` Tek Dosya Bileşenleri (SFC'ler) içinde Composition API kullanmak için derleme zamanında sentaks şekli sağlayan bir yapıdır. SFC'ler ve Composition API kullanıyorsanız önerilen sentakstır. Normal `` sentaksına göre birçok avantaj sunar:

- Daha az boilerplate ile daha özlü kod
- Saf TypeScript kullanarak props ve yayılan olayları tanımlama yeteneği
- Daha iyi çalıştırma performansı (şablon aynı kapsamda bir render işlevine derlenir, ara bir proxy olmadan)
- Daha iyi IDE tip çıkarım performansı (dil sunucusunun koddan türler çıkarması için daha az iş)