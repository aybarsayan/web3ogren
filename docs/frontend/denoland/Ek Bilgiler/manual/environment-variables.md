---
title: "Çevre Değişkenleri"
description: Çevre değişkenleri, web hizmetlerinin erişim belirteçleri gibi değerleri depolamak için kullanılır. Her dağıtım, oluşturma anında tanımlanan çevre değişkenlerine sahiptir ve bu içerik bu değişkenleri nasıl yöneteceğinizi açıklar.
keywords: [çevre değişkenleri, dağıtım, proje, Deno, deployctl, ayarlar]
---

Çevre değişkenleri, web hizmetlerinin erişim belirteçleri gibi değerleri depolamak için kullanışlıdır. Her dağıtım, oluşturma anında tanımlanan ve koddan `Deno.env` API'si aracılığıyla erişilebilen bir dizi çevre değişkenine sahiptir. Bir dağıtımın çevre değişkenlerini tanımlamanın 2 yolu vardır:

## Proje Çevre Değişkenleri

Çevre değişkenlerini proje düzeyinde tanımlayabilirsiniz. Bir dağıtım oluşturduğunuzda, proje tarafından _o belirli anda_ tanımlanan çevre değişkenleri setini alır.

:::tip
Çevre değişkenlerini her zaman yönetirken dikkatli olun. Proje ayarlarında yaptığınız değişikliklerin dağıtımlar üzerinde nasıl etki ettiğini anlamak önemlidir.
:::

Kolaylık sağlamak için, bir projenin çevre değişkenlerini değiştirdiğinizde, mevcut üretim dağıtımı _yeniden dağıtılır_, yeni set çevre değişkenleri ile yeni bir üretim dağıtımı oluşturur.

:::note
Dağıtımlar değiştirilemez, çevre değişkenleri de dahil. Bir projenin çevre değişkenlerini değiştirmek, mevcut dağıtımların çevre değişkenlerini değiştirmez.
:::

Projenize bir çevre değişkeni eklemek için, proje sayfasındaki **Ayarlar** butonuna tıklayın ve ardından yan taraftaki **Çevre Değişkenleri** seçeneğine tıklayın. Anahtar/değer alanlarını doldurun ve bir çevre değişkeni eklemek için "Ekle" butonuna tıklayın.

![environment_variable](../../../images/cikti/denoland/deploy/docs-images/fauna2.png)

Mevcut bir çevre değişkenini güncellemek de aynı şekilde çalışır. "Değişken Ekle" butonuna tıklayın, güncellemek istediğiniz çevre değişkeninin aynı adını girin ve yeni değeri ekleyin. Güncellemeyi tamamlamak için "Kaydet" butonuna tıklayın.

## Dağıtım Çevre Değişkenleri

`deployctl` kullanarak dağıtım yaparken, `zaten proje için tanımlanan çevre değişkenlerini tamamlamak üzere `--env` veya `--env-file` bayraklarıyla` çevre değişkenlerini belirtebilirsiniz. Ayrıca, birden fazla `--env-file` argümanı (örneğin, `--env-file=.env.bir --env-file=.env.iki`) ile birden fazla dosyadan değişkenleri dahil edebilirsiniz.

:::note
Tek bir `.env` dosyasında aynı çevre değişkeni için birden fazla deklare varsa, ilk bulgu geçerlidir. Ancak aynı değişken birden fazla `.env` dosyası arasında tanımlanmışsa (birden fazla `--env-file` argümanı kullanarak), belirtilen son dosyadaki değer öncelik kazanır. Bu, en son listelenen `.env` dosyasında bulunan ilk bulgunun uygulanacağı anlamına gelir.
:::

Bu çevre değişkenleri oluşturulan dağıtım için spesifik olacaktır.

### Varsayılan Çevre Değişkenleri

Her dağıtımın, kodunuzdan erişebileceğiniz aşağıdaki önceden ayarlanmış çevre değişkenleri vardır.

1. `DENO_REGION`
   
   Dağıtımın çalıştığı bölgenin bölge kodunu içerir. Bu değişkeni, bölgeye özgü içerik sunmak için kullanabilirsiniz.

   > Bölge koduna `bölge sayfasından` ulaşabilirsiniz.
   — Bilgi Kaynağı

2. `DENO_DEPLOYMENT_ID`
   
   Dağıtımın kimlik numarasını içerir.