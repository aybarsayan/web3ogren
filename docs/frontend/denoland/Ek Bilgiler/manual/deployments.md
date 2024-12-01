---
title: "Dağıtımlar"
description: Dağıtımlar, bir uygulamanın çalışması için gerekli kod ve ortam değişkenlerinin anlık görüntüleridir. Bu sayfa, dağıtım oluşturma, yönetme ve yükseltme işlemleri hakkında bilgi sağlar.
keywords: [dağıtım, deployctl, önizleme, üretim, özel alan adları, Deno Deploy]
---

Bir dağıtım, bir uygulamayı çalıştırmak için gereken kodun ve ortam değişkenlerinin bir anlık görüntüsüdür. Yeni bir dağıtım, 
`deployctl` aracılığıyla` veya yapılandırılmışsa Deploy'un Github entegrasyonu aracılığıyla otomatik olarak oluşturulabilir.

Dağıtımlar oluşturulduktan sonra **değiştirilemez.** Bir uygulama için kodun yeni bir versiyonunu dağıtmak için, yeni bir dağıtım oluşturulmalıdır. Oluşturulduktan sonra, dağıtımlar erişilebilir durumda kalır.

Tüm mevcut dağıtımlar, projeniz sayfasında `Dağıtımlar` sekmesi altında listelenir, aşağıda gösterilmiştir. Eski dağıtımlar 
`deployctl` aracılığıyla` ve 
[API aracılığıyla](https://apidocs.deno.com/#delete-/deployments/-deploymentId-) silinebilir.

![proje kontrol panelinde dağıtımlar sekmesini gösteriyor](../../../images/cikti/denoland/deploy/manual/images/project_deployments.png)

## Özel alan adları

Bir dağıtıma işaret edebilecek başka URL'ler de olabilir, örneğin 
`özel alan adları`.

## Dal alan adları

`.deno.dev` da desteklenmektedir.

## Üretim ve önizleme dağıtımları

Tüm dağıtımların bu spesifik dağıtımı görüntülemek için kullanılabilecek bir önizleme URL'si vardır. Önizleme URL'leri şu formatta olur: 
`{project_name}-{deployment_id}.deno.dev`.

![görsel](../../../images/cikti/denoland/deploy/docs-images/preview_deployment.png)

***"Bir dağıtım ya üretim ya da önizleme dağıtımı olabilir."***  
— Deno Deploy Belgeleri

Bu dağıtımların çalışma zamanı işlevselliğinde herhangi bir fark yoktur. Tek ayırt edici faktör, bir projenin üretim dağıtımının proje URL'sinden (örn. `myproject.deno.dev`) ve önizleme URL'sine ek olarak özel alan adlarından trafik alacak olmasıdır.

## Önizleme dağıtımlarının Deno Deploy UI aracılığıyla üretim dağıtımlarına yükseltilmesi

Önizleme dağıtımları, Deno Deploy UI aracılığıyla "yükseltilebilir":

1. Proje sayfasına gidin.
2. **Dağıtımlar** sekmesine tıklayın.
3. Üretime yükseltmek istediğiniz dağıtımın yanındaki üç noktaya tıklayın ve **Üretime Yükselt** seçeneğini seçin.
   ![üretime_yükselt](../../../images/cikti/denoland/deploy/docs-images/promote_to_production.png)

:::warning 
Dağıtımları üretime yükseltmek, zaten üretim KV veritabanını kullanan dağıtımlarla sınırlıdır. Bu, önizleme ve üretim dağıtımları için farklı bir veritabanı kullanan GitHub dağıtımları için özellikle geçerlidir.
:::

Dağıtımlar (önizleme KV veritabanını kullananlar bile) her zaman
`deployctl deployments redeploy` komutunu` kullanarak üretime yeniden dağıtılabilir.

## `deployctl` aracılığıyla üretim dağıtımları oluşturma

Eğer Deno kodunuzu `deployctl` ile dağıtıyorsanız, `--prod` bayrağı ile doğrudan üretime dağıtım yapabilirsiniz:

```sh
deployctl deploy --prod --project=helloworld main.ts
```