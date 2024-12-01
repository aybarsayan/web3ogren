---
title: "TCP soketleri ve TLS"
description: Deno Deploy, outbound TCP ve TLS bağlantılarını destekler ve bu API'ler, veritabanlarıyla bağlantı kurmanıza olanak tanır. Bu doküman, `Deno.connect` ve `Deno.connectTls` fonksiyonlarının kullanımını örnekler ile açıklar.
keywords: [Deno, TCP, TLS, socket, connection, APIs, database]
---

Deno Deploy, outbound TCP ve TLS bağlantılarını destekler. Bu API'ler, Deploy ile PostgreSQL, SQLite, MongoDB gibi veritabanlarını kullanmanıza olanak tanır.

## `Deno.connect`

Outbound TCP bağlantıları oluşturur.

:::info
Fonksiyon tanımı, `transport` seçeneğinin yalnızca `tcp` olabileceği ve `hostname` değerinin localhost veya boş olamayacağı kısıtlaması ile birlikte, [Deno](https://docs.deno.com/api/deno/~/Deno.connect) ile aynıdır.
:::

```ts
function Deno.connect(options: ConnectOptions): Promise<Conn>
```

### Örnek

```js
async function handler(_req) {
  // example.com adresine TCP bağlantısı oluşturun.
  const connection = await Deno.connect({
    port: 80,
    hostname: "example.com",
  });

  // Ham HTTP GET isteğini gönderin.
  const request = new TextEncoder().encode(
    "GET / HTTP/1.1\nHost: example.com\r\n\r\n",
  );
  const _bytesWritten = await connection.write(request);

  // Bağlantıdan 15 bayt okuyun.
  const buffer = new Uint8Array(15);
  await connection.read(buffer);
  connection.close();

  // Baytları düz metin olarak döndürün.
  return new Response(buffer, {
    headers: {
      "content-type": "text/plain;charset=utf-8",
    },
  });
}

Deno.serve(handler);
```

## `Deno.connectTls`

Outbound TLS bağlantıları oluşturur.

:::info
Fonksiyon tanımı, `hostname` değerinin localhost veya boş olamayacağı kısıtlaması ile birlikte, [Deno](https://docs.deno.com/api/deno/~/Deno.connectTls) ile aynıdır.
:::

```ts
function Deno.connectTls(options: ConnectTlsOptions): Promise<Conn>
```

### Örnek

```js
async function handler(_req) {
  // example.com adresine TLS bağlantısı oluşturun.
  const connection = await Deno.connectTls({
    port: 443,
    hostname: "example.com",
  });

  // Ham HTTP GET isteğini gönderin.
  const request = new TextEncoder().encode(
    "GET / HTTP/1.1\nHost: example.com\r\n\r\n",
  );
  const _bytesWritten = await connection.write(request);

  // Bağlantıdan 15 bayt okuyun.
  const buffer = new Uint8Array(15);
  await connection.read(buffer);
  connection.close();

  // Baytları düz metin olarak döndürün.
  return new Response(buffer, {
    headers: {
      "content-type": "text/plain;charset=utf-8",
    },
  });
}

Deno.serve(handler);
```