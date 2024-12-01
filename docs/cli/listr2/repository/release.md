---
title: Sürüm
description: Bu kütüphane otomatik sürümleme ve bağımlılık güncellemeleri sağlamaktadır. Anlamsal sürümleme ve güncellemeler için detaylar sunulmaktadır.
keywords: [sürümleme, bağımlılık güncellemeleri, anlamsal sürümleme, renovate, commitizen]
order: 20
next: false
---



Bu kütüphane [semantic-release](https://github.com/semantic-release/semantic-release) kullanarak otomatik sürümleme ve [renovate](https://github.com/renovatebot/renovate) kullanarak bağımlılık güncellemeleri sağlamaktadır.



## Anlamsal Sürümleme

`listr2` sıkı yayımlama yönergelerine [anlamsal sürümleme](https://semver.org/) ile uymaktadır.

:::info
Bu, [commitizen](https://github.com/commitizen/cz-cli) ve [Angular geleneksel commitleri](https://www.conventionalcommits.org/) aracılığıyla zorunlu kılınmaktadır.
:::

Yeni bir sürüm yayımlamak için varsayılan ön ayarı kullanıyoruz. Bir katkıda bulunmak istediğinizde, uygun bir sürümün yayımlandığından emin olmak için buna uymalısınız, ama endişelenmeyin, genellikle bunu kontrol ederim.

> **Bir küçük sürümde kırılma değişikliği yayımlanmayacağından emin olabilirsiniz, ancak bir şey olarak tasarlandığı gibi çalışmıyorsa, küçük kırılma değişiklikleri ile bir yamanın olabileceği anlamına gelir.**  
> — Sürümleme Rehberi

Commitler genellikle yapılan değişikliklere göre kapsamlandırılmıştır, bu yüzden büyük bir değişiklik olsa bile akışı göstermek için daha küçük parçalar halinde yapılabilir.

## Güncellemeler

`listr2`, tüm bağımlılıkların otomatik güncellemelerini [renovate](https://github.com/renovatebot/renovate) kullanarak sağlamaktadır.

:::note
`ts-node`, `jest`, `ts-jest`'i `esm`'ye geçirdikten sonra, burada daha fazla ileri gitmemizi engelleyen hiçbir şey kalmamıştır.
:::

- Bir üretim bağımlılığı güncellendiğinde yeni bir sürüm yayımlanacaktır.
- Temel bağımlılıklar, pull request'lerin manuel olarak kabul edilmesini gerektirir.
- Bu repository'nin kullandığı her CI kuralı, herhangi bir bağımlılığı güncellemeden önce çalışacaktır. Dolayısıyla, bir şey testleri geçmezse, bu dahil edilmeyecektir. Şimdiye kadar bu metodoloji ile yayımlanan işe yaramaz/çöp kod hiç olmamıştır, bu yüzden büyük bir endişe değil.
- Bu benim Gitlab instance'ımda çalışıyor, bu nedenle değişiklikleri/istekleri doğrudan Github'da göremezsiniz. Sadece halkalardaki boru hatları veya olay günlüğü üzerinden daha sonra incelenebilir.

## Kancalar

Tutarlılığı sağlamak için bir dizi `git-hooks` mevcuttur.

- `lint-staged`, her commit için kodun stilinin tutarlı olmasını sağlamak için lintleme yapılandırması ile çalışır.
- `commitizen`, her commit için geleneksel commit formatında olmalarını sağlamak üzere `@cenk1cenk2/cz-cc` preset'i ile çalışır.
- `pnpm run test`, repository'ye geri itmeden önce çalışır.