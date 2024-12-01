---
title: Dağıtımlar
description: Paketin en uygun dağıtımını seçin. Bu içerik, kütüphanenin farklı dağıtım seçeneklerini ve hangi durumlarda hangi dağıtımın kullanılmasının gerektiğini açıklamaktadır.
keywords: ['stream', 'transform', 'distributions', 'esm', 'cjs', 'ECMAScript', 'modules', 'CommonJS', 'IIFE']
sort: 2
---

# Mevcut dağıtımlar

Kütüphane, Node.js sürümünüze, tarayıcı ortamınıza ve ECMAScript modülleri (ESM), CommonJS veya daha eski tarayıcıları destekleyen vanilla JavaScript kullanıp kullanmadığınıza bağlı olarak **birden fazla dağıtımda paketlenmiştir**.

:::tip
Hangi dağıtımın sizin için en uygun olduğunu belirlemek için projenizin gereksinimlerini dikkate alın.
:::

* `Node.js ECMAScript modülleri (ESM)`
* `Node.js CommonJS (CJS)`
* `Yeni tarayıcılar için ECMAScript modülleri (ESM)`
* `Eski tarayıcılar için Vanilla JavaScript (IIFE)`

---

!!! **Anahtar Not:**
Kütüphanenin desteklediği dağıtımları doğru bir şekilde seçmek **performans** ve **uyumluluk** açısından kritik öneme sahiptir. 

:::info
Aşağıdaki dağıtımlar, çeşitli ortamlar için optimize edilmiştir; bu nedenle, projenizin ihtiyaçlarına uygun olanı seçtiğinizden emin olun.
:::