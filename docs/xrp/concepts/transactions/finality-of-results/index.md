---
title: Sonuçların Kesinliği
seoTitle: İşlemlerin Sonuçlarının Kesinliği ve Geçici Sonuçlar
sidebar_position: 4
description: Bu rehber, işlemlerin geçici sonuçları ve kesin sonuçlar arasındaki farkları detaylı bir şekilde açıklar. İşlemlerin konsensüs süreci ile nasıl onaylandığını öğrenin.
tags: 
  - işlem sonucu
  - kesinlik
  - blok zinciri
  - konsensüs
  - işlem kodları
keywords: 
  - işlem sonucu
  - kesinlik
  - blok zinciri
  - konsensüs
  - işlem kodları
---

# Sonuçların Kesinliği

İşlemlerin konsensüs `defter` ile nasıl uygulandığı, bir defter kapatılana kadar ve tam işlem seti `konsensüs süreci` tarafından onaylanana kadar kesin değildir. **Başlangıçta başarılı olan bir işlem hala başarısız olabilir ve başlangıçta başarısız olan bir işlem hala başarılı olabilir.** Ayrıca, bir turda konsensüs süreci tarafından reddedilen bir işlem, daha sonraki bir turda konsensüs elde edebilir.

Onaylanmış bir defter, başarılı işlemleri (`tes` sonuç kodları) ve başarısız işlemleri (`tec` sonuç kodları) içerebilir. Diğer herhangi bir sonuç ile işlem deftere dahil edilmez.

:::info
Aşağıdaki tablo, bir işlemin sonucunun ne zaman kesin olduğunu, işlemin sunulan sonuç koduna göre özetlemektedir:
:::

| Sonuç Kodu      | Kesinlik                                                   |
|:----------------|:-----------------------------------------------------------|
| `tesSUCCESS`    | Onaylanmış bir defterde yer aldığında kesindir             |
| Herhangi bir `tec` kodu | Onaylanmış bir defterde yer aldığında kesindir             |
| Herhangi bir `tem` kodu | Protokolü geçerli kılacak bir değişiklik olmadıkça kesindir |
| `tefPAST_SEQ`   | Aynı sıra numarasına sahip başka bir işlemin onaylanmış bir deftere dahil olduğu zaman kesindir |
| `tefMAX_LEDGER` | Onaylanmış bir defterin, işlemin `LastLedgerSequence` alanından yüksek bir [defter indeksi][Ledger Index] olduğunda kesindir; ve onaylanmış bir defterde işlem yoksa |

Diğer herhangi bir işlem sonucu potansiyel olarak kesin değildir. Bu durumda, işlem daha sonra başarılı veya başarısız olabilir, **özellikle işlemin uygulanmasını engelleyen koşullar değişirse.** Örneğin, henüz mevcut olmayan bir hesaba XRP olmayan bir para göndermeye çalışmak başarısız olur, ancak başka bir işlem, hedef hesabı oluşturmak için yeterli XRP gönderirse başarılı olabilir. **Bir sunucu geçici olarak başarısız olmuş, imzalı bir işlemi depolayabilir ve daha sonra önceden onay almadan başarılı bir şekilde uygulayabilir.**

---

## Geçici Sonuçlar Nasıl Değişebilir?

Bir işlemi başlangıçta sunduğunuzda, `rippled` sunucusu bu işlemi mevcut açık defterine geçici olarak uygular ve ardından bunun sonucunda elde edilen geçici `işlem sonuçlarını` döner. Ancak, işlemin nihai sonucu, birkaç nedenle geçici sonuçlardan çok farklı olabilir:

- **İşlem, daha sonraki bir defter versiyonuna ertelenebilir** veya onaylanmış bir deftere dahil edilmeyebilir. Genel olarak, XRP Defteri, tüm geçerli işlemlerin mümkün olan en kısa sürede işlenmesi gerektiği ilkesini takip eder. Ancak, bazı istisnalar vardır, bunlar arasında:

    - Önerilen bir işlem, bir `konsensüs turu` başladığında çoğunluğa aktarıldıysa, kalan doğrulayıcıların işlemi alması ve geçerli olduğunu doğrulaması için zaman sağlamak amacıyla, sonraki defter versiyonuna ertelenebilir.

    - Bir adres, **aynı sıra numarasını kullanarak** iki farklı işlem gönderirse, bu işlemlerden en fazla biri onaylanabilir. Bu işlemler ağ üzerinden farklı yollarla aktarılıyorsa, bazı sunucular tarafından önce görülen geçici olarak başarılı bir işlem, diğer çelişkili işlem çoğunluğa ulaşırsa başarısız olabilir.

    - Ağa spam saldırılarını önlemek için, tüm işlemler, XRP'nin `işlem maliyetini` yok etmelidir; böylece XRP Defteri arasındaki eşler-arası ağda iletilir. Eğer eşler-arası ağ üzerindeki yoğunluk işlem maliyetini artırırsa, geçici olarak başarılı olan bir işlem, yeterli sunucuya iletilmemiş olabilir veya daha sonra iletilmek üzere `kuyruklanabilir`.

    - **Geçici internet kesintileri veya gecikmeleri**, önerilen bir işlemin, işlemin istenen süresinin dolmasından önce başarılı bir şekilde iletilmesini engelleyebilir; bu da `LastLedgerSequence` alanı tarafından belirlenir. (Eğer işlemin bir süresi yoksa, geçerliliğini korur ve daha sonraki herhangi bir zamanda başarılı olabilir; bu da kendi başına istenmeyen bir durum oluşturabilir. Detaylar için `Güvenilir İşlem Gönderimi` sayfasına bakın.)

    - Bu faktörlerden iki veya daha fazlasının kombinasyonları da olabilir.

:::warning
Kapatılmış bir defterde işlemlerin uygulanma `sırası` genellikle o işlemlerin geçici olarak mevcut açık deftere uygulandığı sıradan farklıdır; bu durum, **ilgili işlemlere bağlı olarak, geçici olarak başarılı olan bir işlemin başarısız olmasına veya geçici olarak başarısız olan bir işlemin başarılı olmasına neden olabilir.**
:::

Bazı örnekler:

- Eğer iki işlem `dağıtılmış borsa`'da aynı teklifin tamamını tüketiyorsa, hangisi önce gelirse o başarılı olur ve diğeri başarısız olur. Bu işlemlerin uygulanma sırası değişebileceğinden, başarılı olan işlem başarısız olabilir ve başarısız olan işlem başarılı olabilir. Teklifler kısmen de yerine getirilebilir, dolayısıyla hala başarılı olabilirler, ancak daha fazla veya daha az ölçekte.

- Eğer bir `çapraz para transferi`, dağıtılmış borsa üzerindeki bir teklifi tüketerek başarılı olursa, ancak farklı bir işlem aynı sipariş kitabında teklifler tüketir veya oluşturursa, çapraz para transferi, işlemin geçici olarak uygulandığı zamandaki döviz kurundan daha farklı bir döviz kuru ile başarılı olabilir. Eğer bu bir `kısmi ödeme` ise, farklı bir miktar da sunabilir.

- Gönderenin yeterli fonu olmadığı için **geçici olarak başarısız olan bir [Ödeme işlemi][]** daha sonra, gerekli fonları sağlayan başka bir işlemin kanonik sıralamada önce gelmesi nedeniyle başarılı olabilir. **Tersinin de olması mümkündür:** geçici olarak başarılı olan bir işlem, gerekli fonları sağlayan bir işlem kanonik sıraya konmadan önce gelmiyorsa başarısız olabilir.

:::tip
Bu nedenle, XRP Defteri üzerinde testler yaparken, **birden fazla hesabın aynı verilere etki ettiği durumlarda işlemler arasında bir defter kapanması için beklemeyi unutmayın.** Eğer [bağımsız modda][] bir sunucu ile test yapıyorsanız, bu tür durumlarda defteri `manuel olarak kapatmalısınız`.
:::

---

## Ayrıca Bakınız

- `İşlem Sonuçlarını Ara`
- `İşlem Sonuçları Referansı`

