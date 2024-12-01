---
title: Kimlik Doğrulama
description: Bu belge, Subhosting REST API'sinin kimlik doğrulama süreçlerini ve erişim tokeni oluşturma yöntemini açıklamaktadır. Geliştiricilerin projeleri ve kaynakları yönetmeleri için gerekli olan adımlar detaylandırılmıştır.
keywords: [Subhosting, REST API, kimlik doğrulama, erişim tokeni, Deno Deploy, organizasyon kimliği]
---

Geliştiriciler, Subhosting REST API'sini kullanarak projeleri, alanları, KV veritabanlarını ve diğer kaynakları sağlama yapabilirler.

## Uç Nokta ve Kimlik Doğrulama

Subhosting REST API v1 için temel URL aşağıdadır.

```console
https://api.deno.com/v1/
```

v1 API, [HTTP taşıyıcı token](https://swagger.io/docs/specification/authentication/bearer-authentication/) kimlik doğrulama yöntemini kullanır. API'yi kullanmak için bir erişim tokeni oluşturabilirsiniz, bunu kontrol panelinde [buradan](https://dash.deno.com/account#access-tokens) yapabilirsiniz. Çoğu API isteği, ayrıca organizasyon kimliğinizi de gerektirir. Organizasyonunuza ait Deno Deploy kontrol panelinden kendi kimliğinizi alabilirsiniz.

![Organizasyon kimliğinizi burada bulun](../../../images/cikti/denoland/subhosting/api/images/org-id.png)

:::tip
**Erişim Tokeni Oluşturma**: Kontrol panelinde erişim tokeni oluşturmayı unutmayın. Bu token, API ile bağlantı kurarken gereklidir.
:::

Organizasyon kimliğinizi ve erişim tokeninizi kullanarak, API erişiminizi test edebilir ve organizasyonunuzla ilişkili tüm projelerin listesini alabilirsiniz. Aşağıda bunu yapmanız için örnek bir Deno scripti verilmiştir.

```typescript
// Bunları kendi değerlerinizle değiştirin!
const organizationId = "a75a9caa-b8ac-47b3-a423-3f2077c58731";
const token = "ddo_u7mo08lBNHm8GMGLhtrEVfcgBsCuSp36dumX";

const res = await fetch(
  `https://api.deno.com/v1/organizations/${organizationId}/projects`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);

const response = await res.json();
console.log(response);
```
:::info
**API Erişim Testi**: Yukarıdaki script, organizasyon kimliğiniz ile API'ye bağlanarak projelerinizin listesini almanıza olanak tanır.
:::