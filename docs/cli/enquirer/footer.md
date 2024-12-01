---
title: Sürüm Geçmişi
description: Bu belgede yazılımın sürüm geçmişi, performans detayları, katkıda bulunma rehberi ve daha fazlası hakkında bilgi bulunmaktadır. Okuyucular, modülün özelliklerini ve sürüm geliştirmelerini daha iyi anlayabilirler.
keywords: [sürüm geçmişi, performans, katkıda bulunma, testler, belgeler]
---

## ❯ Sürüm Geçmişi

Lütfen `CHANGELOG.md` dosyasına bakın.

## ❯ Performans

### Sistem spesifikasyonları

MacBook Pro, Intel Core i7, 2.5 GHz, 16 GB.

### Yükleme süresi

Modülün ilk yüklenmesi için geçen süre (3 denemenin ortalaması):

> enquirer: 4.013ms  
> inquirer: 286.717ms  
> — Performans Değerleri



## ❯ Hakkında


Katkıda Bulunma

:::note
Pull talepleri ve yıldızlar her zaman memnuniyetle karşılanır. Hatalar ve özellik istekleri için, `lütfen bir sorun oluşturun`.
:::

### Yapılacaklar

{%= format(include('docs/todo.md')) %}



Testleri Çalıştırma

Birim testlerini çalıştırmak ve incelemek, bir kütüphaneye ve API'sine aşina olmanın iyi bir yoludur. Aşağıdaki komut ile bağımlılıkları yükleyebilir ve testleri çalıştırabilirsiniz:

```sh
npm install && npm test
```

```sh
yarn && yarn test
```

:::tip
Unit testlerini çalıştırmadan önce, sisteminizde gerekli node.js sürümünün kurulu olduğundan emin olun.
:::



Belgeleri Oluşturma

_(Bu projenin readme.md dosyası [verb](https://github.com/verbose/verb-generate-readme) tarafından oluşturulmaktadır, lütfen readme'yi doğrudan düzenlemeyin. Readme'ye yapılacak her türlü değişiklik `.verb.md` readme şablonunda yapılmalıdır.)_

Readme'yi oluşturmak için aşağıdaki komutu çalıştırın:

```sh
npm install -g verbose/verb#dev verb-generate-readme && verb
```



#### Katkıda Bulunanlar
{%= ghContributors() %}

#### Yazar

**Jon Schlinkert**

* [GitHub Profili](https://github.com/jonschlinkert)
* [Twitter Profili](https://twitter.com/jonschlinkert)
* [LinkedIn Profili](https://linkedin.com/in/jonschlinkert)

#### Teşekkür

:::info  
[derhuerst](https://github.com/derhuerst)'e, [prompt-skeleton](https://github.com/derhuerst/prompt-skeleton) gibi prompt kütüphanelerinin yaratıcısına, kullandığımız bazı kavramları etkilediği için teşekkürler.
:::

#### Lisans

Telif Hakkı © 2018-günümüz, [Jon Schlinkert](https://github.com/jonschlinkert).  
`MIT Lisansı` altında yayımlanmıştır.

[issue]: https://github.com/enquirer/enquirer/issues/new
[pulls]: https://github.com/enquirer/enquirer/pulls
[jon]: https://github.com/jonschlinkert
[brian]: https://github.com/doowb