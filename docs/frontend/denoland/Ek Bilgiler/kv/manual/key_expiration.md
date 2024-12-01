---
title: "Anahtar Süresi (Anahtarlar için TTL)"
description: Deno KV sisteminde anahtarların yaşam süresini kontrol etmek için kullanılan TTL (Time-To-Live) mekanizmasını tanımlamaktadır. Bu özellik, geliştiricilerin anahtarların ne zaman silineceğini belirlemelerini sağlar.
keywords: [Deno, KV, TTL, anahtar süresi, veritabanı, otomatik silme, geliştirici]
oldUrl:
  - /kv/manual/key_expiration/
---



1.36.2 sürümünden itibaren, Deno KV anahtar süresini desteklemektedir; bu, geliştiricilerin
KV veritabanındaki anahtarlar için yaşam süresini (TTL) kontrol etmelerini sağlar. **Bu**, 
bir anahtara bir sona erme zaman damgası ilişkilendirilmesine imkan tanır, bu zamandan sonra 
anahtar veritabanından otomatik olarak silinecektir:

```ts
const kv = await Deno.openKv();

// `expireIn` anahtarın sona ereceği milisaniye sayısını belirtir.
function addSession(session: Session, expireIn: number) {
  await kv.set(["sessions", session.id], session, { expireIn });
}
```

Anahtar süresi, hem Deno CLI hem de Deno Deploy'da desteklenmektedir.

## Birden Fazla Anahtarın Atomik Süresi

Eğer aynı atomik işlemde birden fazla anahtar ayarlanmışsa ve aynı
`expireIn` değerine sahipse, bu anahtarların süresi atomik olacaktır. Örneğin:

```ts
const kv = await Deno.openKv();

function addUnverifiedUser(
  user: User,
  verificationToken: string,
  expireIn: number,
) {
  await kv.atomic()
    .set(["users", user.id], user, { expireIn })
    .set(["verificationTokens", verificationToken], user.id, { expireIn })
    .commit();
}
```

## Dikkat Edilmesi Gerekenler

:::warning
Sona erme zaman damgası, anahtarın veritabanından silinebilmesi için _en erken_ zamanı belirtir. 
Bir uygulama, belirtilen zaman damgasından sonra herhangi bir zamanda bir anahtarı sona erdirmeye
izin verilir, ancak bundan önce değil. Eğer bir sona erme zamanını (örneğin, güvenlik amacıyla)
kesin olarak uygulamak gerekiyorsa, lütfen bunu değerinizin bir alanı olarak da ekleyin ve
veritabanından değeri çektikten sonra bir kontrol yapın.
:::