---
title: Dağıtımlar
description: Paketin en uygun dağıtımını seçin. Bu sayfa, `csv` projesinin farklı dağıtım seçeneklerini ve her birinin hangi koşullarda kullanılacağını açıklar.
keywords: [csv, dağıtımlar, esm, cjs, ECMAScript, modüller, CommonJS, IIFE]
sort: 4
---

# Mevcut dağıtımlar

`csv` projesinin her paketi, Node.js sürümünüze, tarayıcı ortamınıza ve ECMAScript modüllerini (ESM), CommonJS veya daha eski tarayıcıları destekleyen vanilla JavaScript kullanıp kullanmadığınıza bağlı olarak birden fazla dağıtıma paketlenmiştir.

:::info
Her bir dağıtımın hangi durumlarda kullanılacağı ile ilgili daha fazla bilgi bulabileceğiniz bölümler aşağıda yer almaktadır.
:::

* `Node.js ECMAScript modülleri (ESM)`
* `Node.js CommonJS (CJS)`
* `Yeni tarayıcılar için ECMAScript modülleri (ESM)`
* `Eski tarayıcılar için Vanilla JavaScript (IIFE)`

:::tip
Kullanım senaryonuza en uygun dağıtımı seçerken, projenizin hedef ortamını dikkate almayı unutmayın.
:::

--- 

::details
### Ek Bilgi
Her dağıtımın avantajları ve dezavantajları bulunmaktadır. Aşağıda her bir dağıtım için kısa bir özet verilmiştir:

- **ESM**: Modern tarayıcılarda ve Node.js'te yerel olarak desteklenir.
- **CJS**: Yaygın olarak kullanılan ve geniş bir ekosisteme sahip bir modül şeklidir.
- **IIFE**: Eski tarayıcılar için en iyi seçenektir; ancak daha modern çözüm yolları tercih edilmelidir.
::details

> "Dağıtım seçimi, projelerin ileriki aşamalarında uyumluluk ve performans açısından kritik bir öneme sahiptir."  
> — Proje Temsilcisi