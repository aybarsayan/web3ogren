---
title: "`deno run`, bir dosya çalıştır"
description: Deno, JavaScript/TypeScript uygulamalarını çalıştırmak için kullanılan bir çalışma zamanı ortamıdır. Bu sayfa, dosyaları Deno ile çalıştırma ve yönetme yöntemlerini açıklamaktadır. Ayrıca, gerekli izinlerin nasıl verileceği ve izleme işlemleri hakkında bilgi sağlamaktadır.
keywords: [Deno, run, çalışma zamanı, izinler, izleme, JavaScript, TypeScript]
---

## Kullanım

[https://docs.deno.com/examples/hello-world.ts](https://docs.deno.com/examples/hello-world.ts) adresindeki dosyayı çalıştırmak için:

```console
deno run https://docs.deno.com/examples/hello-world.ts
```

Ayrıca dosyaları yerel olarak çalıştırabilirsiniz. Doğru dizinde bulunduğunuzdan emin olun ve:

```console
deno run hello-world.ts
```

Deno varsayılan olarak programları disk, ağ veya alt süreçler oluşturma erişimi olmadan bir kumanda alanında çalıştırır. Bu, Deno çalışma zamanının
`varsayılan olarak güvenli` olmasındandır. Gerekli izinleri vermek veya reddetmek için
`--allow-*` ve `--deny-*` bayraklarını` kullanabilirsiniz.

### İzin örnekleri

:::tip
Deno ile dosya erişim izinlerini doğru bir şekilde ayarlamak önemlidir. Gerekmediği sürece tüm izinleri vermekten kaçının.
:::

Diskten okuma ve ağa dinleme izni verin:

```console
deno run --allow-read --allow-net server.ts
```

Diskten izin verilen dosyaları okuma izni verin:

```console
deno run --allow-read=/etc server.ts
```

Tüm izinleri verin _bu önerilmez ve yalnızca test amacıyla kullanılmalıdır_:

```console
deno run -A server.ts
```

Projeniz birden fazla güvenlik bayrağı gerektiriyorsa, bunları yürütmek için
`deno task` kullanmayı düşünmelisiniz.

---

## İzleme

Dosya değişikliklerini izlemek ve süreçleri otomatik olarak yeniden başlatmak için `--watch` bayrağını kullanın. Deno'nun yerleşik uygulama izleyicisi, dosyalar değiştiğinde uygulamanızı hemen yeniden başlatacaktır.

_Bayrağı dosya adından önce koymayı unutmayın_ örneğin:

```console
deno run --allow-net --watch server.ts
```

Deno'nun izleyicisi, konsolda değişiklikler hakkında sizi bilgilendirecek ve çalışırken hatalar varsa konsolda uyaracaktır.

---

## package.json betiği çalıştırma

`package.json` betikleri, `deno task` komutuyla yürütülebilir.

---

## stdin'den kod çalıştırma

stdin'den kod gönderebilir ve hemen çalıştırabilirsiniz:

```console
curl https://docs.deno.com/examples/hello-world.ts | deno run -
```

## Çalışmayı durdurma

Çalışma komutunu durdurmak için `ctrl + c` tuşlarına basın.