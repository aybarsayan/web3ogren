---
title: Uygulamanızı Planlama
description: Bu sayfa, Deno Deploy kullanarak bir SaaS CRM platformu için uygulama planlaması hakkında bilgi verir. Müşteri hesapları ile projeleri ilişkilendirerek, son kullanıcı kodu ile entegrasyonu kolaylaştırma yöntemleri açıklanmaktadır.
keywords: [Deno Deploy, SaaS, CRM, projeler, dağıtım, JavaScript, veri yönetimi]
---

Örneğin, Salesforce gibi bir SaaS CRM platformu kurduğunuzu varsayalım. Müşterilerinize, yeni bir lead yakalandığında çalışacak JavaScript kodu yazma yetkisi vermek istiyorsunuz.

:::info
Bu özellik, Deno Deploy kullanarak uygulamayı düşündüğünüzde, nasıl inşa edeceğinize dair önemli fikirler sunmaktadır.
:::

Bu özelliği düşünerek, aşağıdaki adımları takip edebilirsiniz:

- Bir **proje** oluşturun ve bu projeyi veritabanınızdaki bir müşteri hesabıyla ilişkilendirin. Bu, her müşteri tarafından yapılacak kullanımı takip etmenizi sağlar ve bu kullanım için analitik bilgileri kullanarak onlara fatura kesmeyi potansiyel olarak mümkün kılar.
- Yeni bir lead oluşturulduğunda çalıştırılacak, son kullanıcı tarafından sağlanan kodu içeren bir **dağıtım** oluşturun.
- Aynı projedeki birden fazla dağıtım kullanarak "staging" veya "production" versiyonlarını uygulayabilirsiniz.
- CRM yazılımınız, bir dağıtıma HTTP isteği göndererek ve yanıt bekleyerek son kullanıcı kodunuzla iletişim kuracaktır.
- Gelecekte, CRM'inizde yeni bir ileti oluşturmak veya her gece otomatik raporlar göndermek gibi diğer olaylar için kod yazmayı desteklemek isterseniz, bu olaylar için her biri için bir proje oluşturabilir ve yukarıda tarif edilen akışı her biri için kullanabilirsiniz.

Bu durumu gerçekleştirmek için gerekli API uç noktasına bir örnek bakalım.

## Bir proje için dağıtım oluşturma

`Önceki bölümde`, yeni bir proje oluşturdunuz ve `id` özelliğini not ettiniz. Önceki bölümdeki örnekte ID şöyleydi:

```console
f084712a-b23b-4aba-accc-3c2de0bfa26a
```

Bu proje için [bir dağıtım oluşturmak](https://apidocs.deno.com/#get-/projects/-projectId-/deployments) için bir proje tanımlayıcısı kullanabilirsiniz. `create_deployment.ts` adında yeni bir dosya oluşturun ve projeniz için yeni bir "merhaba dünya" dağıtımı oluşturmak için aşağıdaki kodu ekleyin.

```ts title="create_deployment.ts"
const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const API = "https://api.deno.com/v1";

// İstediğiniz proje ID'si ile değiştirin
const projectId = "your-project-id-here";

// Yeni bir dağıtım oluşturun
const res = await fetch(`${API}/projects/${projectId}/deployments`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    entryPointUrl: "main.ts",
    assets: {
      "main.ts": {
        "kind": "file",
        "content":
          `export default { async fetch(req) { return new Response("Hello, World!"); } }`,
        "encoding": "utf-8",
      },
    },
    envVars: {},
  }),
});

const deployment = await res.json();

console.log(res.status);
console.log(
  "Siteyi buradan ziyaret edin:",
  `https://${project.name}-${deployment.id}.deno.dev`,
);
```

Bu betiği şu komut ile çalıştırırsanız:

```bash
deno run -A --env create_deployment.ts
```

Hızla kamuya açık bir URL üzerinde basit bir "Merhaba Dünya!" sunucusuna sahip olmalısınız, bu Deno Deploy kontrol panelinizden görülebilir.

## Bir dağıtımın parçaları

Yukarıdaki örnek, çok basit bir dağıtımın örneğini gösterdi. Daha karmaşık bir dağıtım bu bileşenlerden bazılarını veya tümünü içerebilir; bunlar API belgelerinde [burada](https://apidocs.deno.com/#get-/projects/-projectId-/deployments) ayrıntılı bir şekilde tanımlanmıştır.

:::note
Aşağıdaki bileşenleri göz önünde bulundurarak daha karmaşık dağıtımlar oluşturabilirsiniz.
:::

- **Varlıklar:** TypeScript veya JavaScript kaynak dosyaları, görseller, JSON belgeleri - dağıtımınızı çalıştırmak için gerekli kod ve statik dosyalar. Bu dosyalar, sunucuya yüklenecek JSON'da `utf-8` (düz kaynak dosyaları için) veya görseller ve diğer metin dosyaları için `base64` biçiminde kodlanabilir. Gerçek dosyaların yanı sıra, diğer dosyalar için sembolik bağlantılar da ekleyebilirsiniz.
- **Giriş noktası URL'si:** Dağıtımınızda sunucuyu başlatmak için çalıştırılacak, yukarıdaki koleksiyondan bir varlık (TypeScript veya JavaScript dosyası) için dosya yolu.
- **Çevresel değişkenler:** `Deno.env.get` tarafından alınacak sistem ortamında var olması gereken değerleri belirtebilirsiniz.
- **Veritabanı ID'si:** Bu dağıtıma erişilebilir kılınması gereken bir Deno KV veritabanı için tanımlayıcı.
- **Derleyici seçenekleri:** TypeScript kodunu yorumlamak için kullanılacak bir dizi seçenek.

## Özel alan adları

Bir dağıtım oluşturulduğunda, ona üretilmiş bir URL atanır. Bu bazı senaryolar için yeterli olabilir, ancak genellikle dağıtımlarınıza özel bir alan adı da ilişkilendirmek istersiniz. 

:::tip
[Alan adı için API referansına göz atın](https://apidocs.deno.com/#get-/organizations/-organizationId-/domains) ve nasıl özel alan adları ekleyebileceğinizi öğrenin.
:::