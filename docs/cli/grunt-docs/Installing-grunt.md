---
description: This document provides guidance on installing specific versions of Grunt and Grunt plugins, ensuring proper management of project dependencies.
keywords: [Grunt, npm, installation, plugins, versions]
---

# Grunt Kurulumu

## Genel Bakış
Grunt ve Grunt eklentileri, projenizin [package.json](https://docs.npmjs.com/files/package.json) dosyasında [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies) olarak tanımlanmalıdır. Bu, projenizin tüm bağımlılıklarını tek bir komutla kurmanıza olanak tanır: `npm install`. Grunt'ın mevcut kararlı ve geliştirme sürümleri, her zaman wiki'nin [ana sayfasında](https://github.com/gruntjs/grunt/wiki/) listelenmektedir.

## Belirli bir sürümün yüklenmesi
Eğer belirli bir Grunt veya Grunt eklentisi sürümüne ihtiyacınız varsa, `npm install grunt@VERSION --save-dev` komutunu çalıştırmalısınız; burada `VERSION`, ihtiyaç duyduğunuz sürümdür. Bu, belirtilen sürümü kuracak ve `package.json` dosyanızın devDependencies kısmına ekleyecektir.

:::warning
Dikkat edin ki, `--save-dev` bayrağını `npm install` komutuna eklediğinizde [tilde sürüm aralığı] `package.json` dosyanızda kullanılacaktır. Bu genellikle iyidir, çünkü belirtilen sürümün yeni yamanmaları, geliştirme devam ettikçe otomatik olarak yükselecektir; bu da [semver] kurallarına uygundur.
:::

[tilde sürüm aralığı]: https://docs.npmjs.com/cli/v6/using-npm/semver#ranges  
[semver]: http://semver.org

## Yayınlanmış bir geliştirme sürümünün yüklenmesi
Yeni özellikler geliştirilirken, Grunt derlemeleri npm'ye yayınlanabilir. Bu derlemeler, açıkça bir sürüm numarası belirtilmeden _asla_ kurulamaz ve genellikle bir derleme numarası veya alfa/beta/sürüm adayı tanımı taşır.

> Belirli bir Grunt sürümünü yüklerken olduğu gibi, `npm install grunt@VERSION --save-dev` komutunu çalıştırmalısınız; burada `VERSION`, ihtiyaç duyduğunuz sürümdür ve npm, projelerinizde o Grunt sürümünü kuracaktır ve bunu `package.json` devDependencies kısmına ekleyecektir.  
> — Grunt Installation Guide

:::warning
Dikkat edin ki, hangi sürümü belirtirseniz belirtin, `package.json` dosyanızda bir [tilde sürüm aralığı][] belirtilecektir. **Bu çok kötüdür**, çünkü yeni, muhtemelen uyumsuz, belirtilen geliştirme sürümünün yamaları npm tarafından kurulabilir, bu da inşaatınızı bozabilir.
:::

_Bu durumda, `package.json` dosyanızı manuel olarak düzenlemek ve sürüm numarasından ~ (tilde) işaretini kaldırmak **çok önemlidir**. Bu, belirttiğiniz kesin geliştirme sürümünü kilitleyecektir._

Aynı süreç, bir Grunt eklentisinin yayınlanmış bir geliştirme sürümünü yüklemek için de kullanılabilir.

## GitHub'dan doğrudan yükleme
Eğer Grunt veya Grunt eklentisinin son derece güncel, yayınlanmamış bir sürümünü yüklemek istiyorsanız, [git URL'sini bağımlılık olarak belirtme](https://docs.npmjs.com/files/package.json#git-urls-as-dependencies) talimatlarını izlemeli ve `commit-ish` olarak gerçek bir commit SHA'sı (bir dal adı değil) belirtmelisiniz. Bu, projenizin her zaman o kesin Grunt sürümünü kullanmasını garantileyecektir.

:::info
Belirtilen git URL'si resmi Grunt deposu veya bir fork olabilir.
:::