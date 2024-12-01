---
layout: docs
title: Tarayıcılar ve cihazlar
description: Modernden eskiye Bootstrap tarafından desteklenen tarayıcılar ve cihazlar hakkında bilgi edinin. Her biri için bilinen hatalar ve gariplikler içermektedir. 
keywords: [Bootstrap, tarayıcılar, mobil cihazlar, destek, CoreUI]
---

## Desteklenen tarayıcılar

CoreUI for Bootstrap, tüm büyük tarayıcı ve platformların **en son, stabil sürümlerini** desteklemektedir.

:::info
WebKit, Blink veya Gecko’nun en son sürümünü kullanan alternatif tarayıcılar, doğrudan ya da platformun web görünümü API'si aracılığıyla, açıkça desteklenmemektedir. Ancak, CoreUI for Bootstrap bu tarayıcılarda (çoğu durumda) doğru bir şekilde görüntülenmeli ve işlev görmelidir.
:::info

Desteklenen tarayıcı aralığımızı ve sürümlerini `.browserslistrc dosyamızda` bulabilirsiniz:

```text
{{< rf.inline >}}
{{- readFile ".browserslistrc" | chomp | htmlEscape -}}
{{< /rf.inline >}}
```

:::tip
Planlanan tarayıcı desteğini yönetmek için CSS önekleri aracılığıyla [Autoprefixer](https://github.com/postcss/autoprefixer) kullanıyoruz. Bu araç, bu tarayıcı sürümlerini yönetmek için [Browserslist](https://github.com/browserslist/browserslist) kullanmaktadır.
:::

### Mobil cihazlar

Genel olarak, CoreUI for Bootstrap, her ana platformun varsayılan tarayıcılarının en son sürümlerini desteklemektedir. **Proxy tarayıcıların** (Opera Mini, Opera Mobile'ın Turbo modu, UC Browser Mini, Amazon Silk gibi) desteklenmediğini unutmayın.


| | Chrome | Firefox | Safari | Android Tarayıcı &amp; WebView |
| --- | --- | --- | --- | --- |
| **Android** | Destekleniyor | Destekleniyor | &mdash; | v6.0+ |
| **iOS** | Destekleniyor | Destekleniyor | Destekleniyor | &mdash; |
### Masaüstü tarayıcılar

Benzer şekilde, çoğu masaüstü tarayıcının en son sürümleri desteklenmektedir.


| | Chrome | Firefox | Microsoft Edge | Opera | Safari |
| --- | --- | --- | --- | --- | --- |
| **Mac** | Destekleniyor | Destekleniyor | Destekleniyor | Destekleniyor | Destekleniyor |
| **Windows** | Destekleniyor | Destekleniyor | Destekleniyor | Destekleniyor | &mdash; |
:::note
Firefox için, en son normal stabil sürümün yanı sıra, en son [Uzun Süreli Destek Sürümünü (ESR)](https://www.mozilla.org/en-US/firefox/enterprise/) de destekliyoruz.
:::

Resmi olmayan olarak, CoreUI for Bootstrap, Linux için Chromium ve Chrome'da, ayrıca Linux için Firefox'ta iyi görünmeli ve davranmalıdır, ancak bunlar resmi olarak desteklenmemektedir.

## Internet Explorer

Internet Explorer desteklenmemektedir. 

> **Eğer Internet Explorer desteğine ihtiyacınız varsa, lütfen CoreUI v3 kullanın.**  
— CoreUI Belgelendirme

## Mobilde Modallar ve Aşağı Açılır Menüler

### Taşma ve Kaydırma

`overflow: hidden;` özelliği için `` öğesindeki destek, iOS ve Android'de oldukça sınırlıdır. Bu nedenle, bu cihazların tarayıcılarında bir modalin üstünden veya altından kaydırdığınızda, `` içeriği kaydırılmaya başlayacaktır.

:::warning
Daha fazla bilgi için [Chrome hatası #175502](https://bugs.chromium.org/p/chromium/issues/detail?id=175502) (Chrome v40'ta düzeltildi) ve [WebKit hatası #153852](https://bugs.webkit.org/show_bug.cgi?id=153852) gözden geçirilebilir.
:::

### iOS Metin Alanları ve Kaydırma

iOS 9.2 itibarıyla, bir modal açıkken, bir kaydırma hareketinin ilk dokunuşu bir yazılı `` veya `` sınırları içindeyse, modalin altındaki `` içeriği kaydırılacak, modalin kendisi değil. Daha fazla bilgi için [WebKit hatası #153856](https://bugs.webkit.org/show_bug.cgi?id=153856) kontrol edilebilir.

### Navbar Aşağı Açılır Menüler

`.dropdown-backdrop` öğesi, z-index'leme karmaşıklığı nedeniyle nav'da iOS'ta kullanılmamaktadır. Bu nedenle, navbars'da aşağı açılır menüleri kapatmak için doğrudan aşağı açılır menü öğesine tıklamanız gerekir (ya da [iOS'ta bir tıklama olayı tetikleyecek herhangi bir başka öğeye](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event#Safari_Mobile) tıklamanız gerekir).

## Tarayıcı Yakınlaştırma

Sayfanın yakınlaştırılması, CoreUI for Bootstrap ve internetin diğer bölümlerinde bazı bileşenlerde rendering (görüntüleme) hatalarına neden olabilir. 

> Sorunun türüne bağlı olarak, bunu düzeltmek mümkün olabilir (önce araştırın, ardından gerekirse bir sorun açın). Ancak, genellikle bu tür sorunları göz ardı ederiz çünkü doğrudan bir çözümü yoktur.
— CoreUI Belgelendirme

## Doğrulayıcılar

Eski ve hatalı tarayıcılara en iyi deneyimi sağlamak amacıyla, CoreUI for Bootstrap, birkaç yerde CSS'nin belirli tarayıcı sürümlerine hedeflenmesi için [CSS tarayıcı hack'leri](http://browserhacks.com/) kullanmaktadır. 

:::danger
Bu hack'ler, elbette ki CSS doğrulayıcılarının geçersiz olduğuna dair şikayet etmesine yol açar. Bazı durumlarda, tam olarak standart hale gelmemiş, en son CSS özelliklerini de kullanıyoruz ancak bunlar sadece ilerici iyileştirme için kullanılmaktadır.
:::

Bu doğrulama uyarıları pratikte önemli değildir çünkü CSS'imizin hack içermeyen kısmı tam olarak doğrulanmakta ve hack içeren kısımlar, hack içermeyen bölümün düzgün çalışmasını engellememektedir. Bu nedenle, özellikle bu uyarılara dikkat etmemek için kasıtlıyız.

HTML belgelerimiz, [belli bir Firefox hatası için](https://bugzilla.mozilla.org/show_bug.cgi?id=654072) bir geçici çözüm eklememiz nedeniyle bazı önemsiz ve önemsiz HTML doğrulama uyarıları içermektedir.