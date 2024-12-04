---
title: Uzun Dönem Destek
seoTitle: Fastify Uzun Dönem Destek
sidebar_position: 4
description: Fastifynin uzun dönem desteği ile ilgili bilgi ve destek süreleri. Belirli sürümler için geçerlilik tarihleri ve Node.js desteği hakkında detaylar.
tags: 
  - Fastify
  - LTS
  - Node.js
  - Yazılım Geliştirme
  - Güvenlik
keywords: 
  - Fastify
  - LTS
  - Node.js
  - Yazılım Geliştirme
  - Güvenlik
---
Fastify

## Uzun Dönem Destek

``

Fastify'nin Uzun Dönem Desteği (LTS) bu belgede belirtilen takvime göre sağlanmaktadır:

1. Ana sürümler, "X" sürümü [semantic versioning][semver] X.Y.Z sürüm versiyonları, sürüm tarihinden itibaren en az altı ay süreyle desteklenmektedir. Belirli bir sürümün sürüm tarihi [https://github.com/fastify/fastify/releases](https://github.com/fastify/fastify/releases) adresinde bulunabilir.
2. Ana sürümler, bir sonraki ana sürümün çıkışından itibaren ek altı ay boyunca güvenlik güncellemeleri alacaktır. Bu süre zarfında, topluluk tarafından sağlanması koşuluyla ve diğer kısıtlamaları ihlal etmediği sürece, güvenlik düzeltmeleri gözden geçirecek ve yayımlayacağız. Örneğin, minimum desteklenen Node.js sürümü gibi.
3. Ana sürümler, o belirli Fastify sürüm çizgisi için LTS döneminde [Node.js LTS politikası](https://github.com/nodejs/Release) tarafından desteklenen tüm Node.js sürüm hatlarına karşı test edilecek ve doğrulanacaktır. Bu, yalnızca belirli bir hattaki en son Node.js sürümünün desteklendiği anlamına gelir.
4. Node.js çalışma zamanına ek olarak, Fastify'nın ana sürümleri Node.js ile uyumlu alternatif çalışma zamanlarıyla da test edilecek ve doğrulanacaktır. Bu alternatif çalışma zamanlarının bakım ekipleri, bu testlerin düzgün çalışmasını sağlamakla yükümlüdür.
    1. [N|Solid](https://docs.nodesource.com/nsolid), NodeSource tarafından yönetilen, her Fastify ana sürümünü Fastify sürümünün çıkış anında mevcut N|Solid LTS sürümlerine karşı test etmek ve doğrulamak için taahhütte bulunur. NodeSource, Fastify'nın N|Solid ile uyumlu olacak ve doğru çalışacağına dair garanti verir; bu, Fastify sürümü çıkış anında mevcut olan N|Solid LTS sürümleri desteği ve uyumluluk kapsamıyla uyumludur. Bu, N|Solid kullanıcılarının Fastify'ı güvenle kullanmalarını sağlar.

Bir "ay", 30 ardışık gün olarak tanımlanır.

> ## Güvenlik Sürümleri ve Semver
>
> Uzun vadeli destek sağlama sonucunda, belirli durumlarda _küçük_ sürüm güncellemesi olarak kırıcı değişiklikler yayımlamamız gerektiğinde, böyle değişiklikler _her zaman_ [sürüm notlarında](https://github.com/fastify/fastify/releases) belirtilir.
>
> Kırıcı güvenlik güncellemelerini otomatik olarak almaktan kaçınmak için tilde (`~`) aralık niteliklendiricisini kullanmak mümkündür. Örneğin, 3.15 sürümü için yamanın alınmasını ve otomatik olarak 3.16 sürümüne güncellenmemesini sağlamak için bağımlılığı `"fastify": "~3.15.x"` olarak belirtin. Bu uygulamanızı savunmasız bırakabilir, bu yüzden dikkatli kullanın.

### LTS Dışındaki Güvenlik Desteği

Fastify'nın ortağı HeroDevs, EOL olan Fastify sürümleri için OpenJS Ekosistem Sürdürülebilirlik Programı aracılığıyla ticari güvenlik desteği sağlar. Daha fazla bilgi için lütfen [Sonsuz Destek][hd-link] hizmetlerine bakın.

### Takvim

``

| Sürüm  | Sürüm Tarihi  | LTS Son Tarihi  | Node.js           | Nsolid(Node)   |
| :----- | :------------ | :-------------- | :---------------- | :------------- |
| 1.0.0  | 2018-03-06    | 2019-09-01      | 6, 8, 9, 10, 11   |                |
| 2.0.0  | 2019-02-25    | 2021-01-31      | 6, 8, 10, 12, 14  |                |
| 3.0.0  | 2020-07-07    | 2023-06-30      | 10, 12, 14, 16, 18| v5(18)         |
| 4.0.0  | 2022-06-08    | 2025-06-30      | 14, 16, 18, 20, 22| v5(18), v5(20) |
| 5.0.0  | 2024-09-17    | TBD             | 20, 22            | v5(20)         |

### CI test edilen işletim sistemleri

``

Fastify, CI testi için GitHub Actions kullanır, lütfen [GitHub'ın iş akışlarıyla ilgili belgelerine](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources) başvurun, aşağıdaki YAML iş akışı etiketleriyle ilgili en son sanal ortamın ne olduğunu öğrenmek için:

| OS      | YAML İş Akışı Etiketi | Paket Yöneticisi | Node.js     | Nsolid(Node)  |
| ------- | ---------------------- | ---------------- | ----------- | ------------- |
| Linux   | `ubuntu-latest`        | npm              | 20          | v5(20)        |
| Linux   | `ubuntu-latest`        | yarn,pnpm        | 20          | v5(20)        |
| Windows | `windows-latest`       | npm              | 20          | v5(20)        |
| MacOS   | `macos-latest`         | npm              | 20          | v5(20)        |

[yarn](https://yarnpkg.com/) kullanmak, `--ignore-engines` bayrağını geçmenizi gerektirebilir.

[semver]: https://semver.org/

[hd-link]: https://www.herodevs.com/support/fastify-nes?utm_source=fastify&utm_medium=link&utm_campaign=eol_support_fastify