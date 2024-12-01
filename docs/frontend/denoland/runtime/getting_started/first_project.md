---
title: Deno projesi oluşturma
description: Deno ile yeni bir proje oluşturmanın adımlarını keşfedin. Deno'nun sunduğu gömülü araçlarla projelerinizi hızlıca başlatabilir ve geliştirebilirsiniz.
keywords: [Deno, TypeScript, proje oluşturma, geliştirici araçları, test koşamcısı]
---

Deno, geliştirme deneyiminizi mümkün olduğunca sorunsuz hale getirmek için birçok `gömülü araç` sunar. Bu araçlardan biri, temel dosya yapısı ve yapılandırmasıyla yeni bir Deno projesi oluşturan `proje başlatıcısı`'dır.

:::info
JavaScript kullanmaya teşvik edilseniz de, Deno'nun ayrıca [TypeScript](https://www.typescriptlang.org/) için yerleşik desteği vardır; bu nedenle bu kılavuzda TypeScript kullanacağız. JavaScript kullanmayı tercih ederseniz, dosyaların adını `.js` olarak değiştirebilir ve tür açıklamalarını kaldırabilirsiniz.
:::

## Yeni bir proje başlatma

Yeni bir Deno projesi başlatmak için, terminalinizde aşağıdaki komutu çalıştırın:

```bash
deno init my_project
```

Bu, aşağıdaki yapıya sahip `my_project` adında yeni bir dizin oluşturacaktır:

```plaintext
my_project
├── deno.json
├── main_test.ts
└── main.ts
```

Bir `deno.json` dosyası oluşturulur ve `projenizi yapılandırmak için` kullanılır ve iki TypeScript dosyası oluşturulur; `main.ts` ve `main_test.ts`. `main.ts` dosyası, uygulama kodunuzu yazacağınız yerdir. Başlangıçta iki sayıyı toplamak için basit bir program içerecektir. `main_test.ts` dosyası, testlerinizi yazabileceğiniz yerdir, başlangıçta toplama programınız için bir test içerecektir.

## Projenizi çalıştırma

Bu programı aşağıdaki komut ile çalıştırabilirsiniz:

```bash
$ deno main.ts
2 + 3 = 5 ekle
```

:::tip
Bu aşamada, kodunuzun doğru çalıştığından emin olun. Projenizin her aşamasında testleri çalıştırmak en iyi uygulamadır.
:::

## Testlerinizi çalıştırma

Deno'nun `gömülü bir test koşamcısı` vardır. Kodunuz için testler yazabilir ve bunları `deno test` komutuyla çalıştırabilirsiniz. Yeni projenizde testleri çalıştırmak için:

```bash
$ deno test
running 1 test from ./main_test.ts     
addTest ... ok (1ms)

ok | 1 passed | 0 failed (3ms)
```

:::note
Artık temel bir proje oluşturduğunuza göre, uygulamanızı geliştirmeye başlayabilirsiniz. Deno ile yapabileceğiniz şeyler hakkında daha fazla fikir için `kılavuzlarımıza` ve `örneklerimize` göz atabilirsiniz.
:::

Deno'da TypeScript kullanmayı `buradan daha fazla öğrenebilirsiniz`.