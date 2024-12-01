---
description: Deno ile alt hostingin hızlı başlangıç kılavuzunu keşfedin. Bu içerik, Deno bulutuna kod dağıtımına dair adım adım talimatlar sunmaktadır.
keywords: [Deno, alt hosting, bulut, dağıtım, REST API, erişim jetonu, TypeScript]
title: Alt Hosting Hızlı Başlangıç
---

Deno'nun izole bulutuna kod dağıtımını gösteren en küçük örneği mi arıyorsunuz? Aşağıda size bu konuda yardımcı olduk, veya `daha ayrıntılı başlangıç kılavuzuna` geçebilirsiniz.

```ts
// 1.) API erişim bilgilerini hazırla
const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const orgId = Deno.env.get("DEPLOY_ORG_ID");
const API = "https://api.deno.com/v1";
const headers = {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
};

// 2.) Yeni bir proje oluştur
const pr = await fetch(`${API}/organizations/${orgId}/projects`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: null, // rastgele proje ismi oluşturur
  }),
});

const project = await pr.json();

// 3.) Yeni projeye "merhaba dünya" sunucusu dağıt
const dr = await fetch(`${API}/projects/${project.id}/deployments`, {
  method: "POST",
  headers,
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

const deployment = await dr.json();

console.log(dr.status);
console.log(
  "Siteye buradan ulaşabilirsiniz:",
  `https://${project.name}-${deployment.id}.deno.dev`,
);
```

## Alt hosting ile başlarken

Alt hosting’e başlamak için, [Deno Deploy kontrol panelinde](https://dash.deno.com/orgs/new) bir organizasyon oluşturmalısınız. Alt hosting için yeni bir organizasyon oluşturmak üzere ekrandaki talimatları takip edin.

Kayıt süreci boyunca muhtemelen bir **erişim jetonu** oluşturacaksınız; bu jetonu `REST API` erişimi için kullanacaksınız. Eğer bunu yapmadıysanız (ya da jetonunuz süresi dolduysa), [yeni bir tane buradan oluşturabilirsiniz](https://dash.deno.com/account#access-tokens).

:::caution
Jetonunuzu güvenli bir yerde saklayın.

Erişim jetonu oluşturduğunuzda, **bu jeton tekrar Deploy kontrol paneli arayüzünde görüntülenmeyecektir**. Bu jetonu güvenli bir yerde sakladığınızdan emin olun.
:::

## Test ortamı kurma

Aşağıdaki eğitim sayfalarında, Deploy REST API’si ile Deno betikleri (TypeScript kodu) aracılığıyla etkileşimde bulunduğunuzu varsayacağız ve API ile etkileşimde bulunma yolunda örnekler göstereceğiz. Ancak burada gösterilen teknikler, HTTP isteklerini gerçekleştirebilen başka herhangi bir ortamda da çalışacaktır.

Burada ve gelecekteki bölümlerde gösterilen örnek kodun, [Deno 1.38 veya daha yukarı](https://deno.com/blog/v1.38#deno-run---env) bir versiyonunun yüklü olduğunu varsayıyoruz.

REST API ile çalışırken, kimlik doğrulama bilgilerini [sistem ortamında](https://deno.com/blog/v1.38#deno-run---env) saklamak, yanlışlıkla version kontrolüne koymanızı önlemek için faydalıdır.

Bu eğitim için, ortam değişkenlerini yönetmek üzere `--env` bayrağını kullanacağız. Bilgisayarınızda, yönetim betiklerimizi saklamak için yeni bir dizin oluşturun ve üç dosya oluşturun:

- `.env` - API erişim bilgilerini saklamak için
- `.gitignore` - yanlışlıkla kaynak kontrolüne koymamak için `.env` dosyamızı göz ardı etmek üzere
- `create_project.ts` - REST API’sine ilk isteğimizi yapmak için kullanacağımız bir dosya

### Bir `.env` dosyası ve `.gitignore` dosyasını yapılandırma

Öncelikle, daha önce oluşturduğunuz `.env` dosyasında [erişim jetonunuzu](https://dash.deno.com/account#access-tokens) ve organizasyon kimliğinizi saklayın.

```bash title=".env"
DEPLOY_ACCESS_TOKEN=your_token_here
DEPLOY_ORG_ID=your_org_id_here
```

Dosyadaki değerleri kendi Deploy hesabınızdaki değerlerle değiştirin.

Sonra, yanlışlıkla `.env` dosyamızı kaynak kontrolüne koymamak için bir `.gitignore` dosyası oluşturun:

```bash title=".gitignore"
# Git'te bu dosyayı göz ardı et
.env

# İsteğe bağlı: mac OS'larda sıkça üretilen bu gereksiz dosyayı göz ardı et
.DS_Store
```

Artık kimlik bilgilerimizi ayarladığımıza göre, REST API’ye erişim sağlamak için bazı kodlar yazalım.

## İlk projemizi oluşturma

Alt hosting veya REST API ile ilginç bir şeyler yapmak için, [bir proje oluşturmalıyız](https://apidocs.deno.com/#get-/projects/-projectId-/deployments). Aşağıdaki kodu, `.env` ve `.gitignore` dosyanızın bulunduğu dizinde `create_project.ts` adlı bir dosyaya kopyalayın.

```ts title="create_project.ts"
const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const orgId = Deno.env.get("DEPLOY_ORG_ID");
const API = "https://api.deno.com/v1";

// Yeni bir proje oluştur
const res = await fetch(`${API}/organizations/${orgId}/projects`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: null, // rastgele proje ismi oluşturur
  }),
});

const project = await res.json();
console.log(project);
```

Bu kodu bir terminalde aşağıdaki komut ile yürütün:

```bash
deno run -A --env create_project.ts
```

Her şey yolunda giderse, çıktının aşağıdakine benzeyen bir şey olduğunu görmelisiniz:

```console
{
  id: "f084712a-b23b-4aba-accc-3c2de0bfa26a",
  name: "strong-fox-44",
  createdAt: "2023-11-07T01:01:14.078730Z",
  updatedAt: "2023-11-07T01:01:14.078730Z"
}
```

Bu yanıtta döndürülen projenin `id` değerine dikkat edin - bu, bir sonraki adımda kullanacağımız proje kimliğidir.

Artık REST API erişimini yapılandırdığımıza ve bir proje oluşturduğumuza göre, `ilk dağıtımımızı oluşturmaya` geçebiliriz.