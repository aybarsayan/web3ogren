---
title: cURL ve Diğer İstemciler
seoTitle: cURL and Other Clients
sidebar_position: 4
description: Bu sayfa, Connect Protokolü ile cURL ve Fetch API kullanarak RPC çağrıları yapma yöntemlerini açıklamaktadır. Ayrıca Buf Studioya dair bilgilere de ulaşabilirsiniz.
tags: 
  - Connect Protokolü
  - cURL
  - Fetch API
  - RPC
keywords: 
  - Connect
  - RPC
  - HTTP
  - cURL
  - API
---
Her istemcinin üretilmiş kod ve tam bir RPC çerçevesine erişimi yoktur: belki
yalın bir ortamda hata ayıklıyorsunuz ya da belki istemcileriniz iyi RPC bağlamaları
olmayan bir dil veya çerçeve kullanıyor. Connect bu durumlarda öne çıkar: `Connect protokolünü` 
basit HTTP/1.1 istemcileriyle bile çalışabilen tekil RPC'ler gerçekleştirmek üzere 
tasarladık. (Elbette, herhangi bir gRPC veya gRPC-Web istemcisi kullanarak Connect API'lerini çağırabilirsiniz.)

## cURL

Connect işleyicileri otomatik olarak JSON'u destekler. Çünkü Connect protokolü 
aynı zamanda tekil RPC'ler için standart HTTP başlıklarını kullanır, API'nizi çağırmak 
cURL ile tek satırlık bir komuttur:

```bash
$ curl --header "Content-Type: application/json" \
    --data '{"sentence": "I feel happy."}' \
    https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Say
```

Yanıt şöyledir:

```
{"sentence": "Feeling happy? Tell me more."}
```

Demo servisi canlıdır &mdash; bu komutu denemekten çekinmeyin! Ayrıca bütün yanıt başlıklarını görmek 
için `--verbose` ile veya HTTP/2'ye yükselmeyi önlemek için `--http1.1` ile de 
deneyebilirsiniz.

Aynı çağrıyı HTTP GET ile yapabilirsiniz; burada istek mesajı bir sorgu parametresinde kodlanır:

```bash
$ curl --get --data-urlencode 'encoding=json' \
    --data-urlencode 'message={"sentence": "I feel happy."}' \
    https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Say
```

Ayrıca [bu URL'yi ziyaret edebilirsiniz](https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Say?encoding=json&message=%7b%22sentence%22%3a+%22I+feel+happy.%22%7d)
tarayıcınızda. Tekil RPC'ler bir seçenekle HTTP GET desteğine dahil olabilir.
Ayrıntılar için, özelliği tanıtan [blog yazısına](https://buf.build/blog/introducing-connect-cacheable-rpcs) 
ve `protokol spesifikasyonuna` 
göz atın.

## fetch API

`@connectrpc/connect-web` kullanmanızı öneririz, böylece derleyici 
kodunuzu tür kontrolünden geçirebilir, ancak tarayıcılar sadece fetch API ile 
Connect API'lerine kolayca tekil çağrılar yapabilirler. Geliştirici araçlarınızda hemen bunu deneyin:

```javascript
fetch("https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Say", {
  "method": "POST",
  "headers": {"Content-Type": "application/json"},
  "body": JSON.stringify({"sentence": "I feel happy."})
})
  .then(response => { return response.json() })
  .then(data => { console.log(data) })
```

HTTP GET ile aynı çağrı:

```javascript
const url = new URL("https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Say");
url.searchParams.set("encoding", "json");
url.searchParams.set("message", JSON.stringify({"sentence": "I feel happy."}));
fetch(url)
  .then(response => { return response.json() })
  .then(data => { console.log(data) })
```

## Buf Studio

Bir API'yi keşfetmek için görsel bir arayüz tercih ediyorsanız, [Buf Studio'ya](https://buf.build/studio/connectrpc/eliza/connectrpc.eliza.v1.ElizaService/Say?target=https%3A%2F%2Fdemo.connectrpc.com&demo=true&share=s1Ks5lJQUCpOzStJzUtOVbJSUPJUSEtNzVHISCwoqNRT4qoFAA) 
bir göz atın. Buf Studio, [Buf Şema Kaydı](https://buf.build/product/bsr/) 
üzerinde saklanan tüm Protobuf hizmetleriniz için etkileşimli bir web UI'dır.

:::tip
Bu metotları kullanarak Connect API'leriyle etkileşimde bulunurken cURL ve Fetch API arasında seçim yapabilirsiniz.
:::