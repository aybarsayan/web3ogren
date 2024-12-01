---
title: "Veri alma ve akıtma"
description: Deno ile veri alma ve akıtma süreçlerini öğrenin. Bu kılavuz, `fetch()` API'si ve `Streams API`'sinin nasıl kullanılacağını açıklayacaktır. 
keywords: [Deno, veri alma, akıtma, fetch API, Streams API, ağ, dosya yönetimi]
---

Deno, birçok tanıdık Web API'sini sunucu tarafı ortamına getiriyor. Eğer tarayıcılarla çalıştıysanız, ağ istekleri yapmak ve ağ üzerinden veri akışına erişmek için kullanılan `fetch()` yöntemini ve `streams` API'sini tanıyor olabilirsiniz. Deno, bu API'leri uygulayarak web'den veri almanıza ve akıtmanıza olanak tanır.

## Veri alma

Bir web uygulaması inşa ederken, geliştiricilerin sıkça web üzerindeki başka bir yerden kaynakları geri alması gerekecektir. Bunu `fetch` API'si ile yapabiliriz. Bir URL'den farklı veri şekillerini nasıl alacağımıza ve isteğin başarısız olması durumunda hatayı nasıl ele alacağımıza bakacağız.

:::tip
`fetch()` kullanılmadan önce, ağ erişiminiz için gerekli izinleri sağlamayı unutmayın.
:::

`fetch.js` adında yeni bir dosya oluşturun ve aşağıdaki kodu ekleyin:

```ts title="fetch.js"
// Çıktı: JSON Verisi
const jsonResponse = await fetch("https://api.github.com/users/denoland");
const jsonData = await jsonResponse.json();

console.log(jsonData, "\n");

// Çıktı: HTML Verisi
const textResponse = await fetch("https://deno.land/");
const textData = await textResponse.text();

console.log(textData, "\n");

// Çıktı: Hata Mesajı
try {
  await fetch("https://does.not.exist/");
} catch (error) {
  console.log(error);
}
```

Bu kodu `deno run` komutuyla çalıştırabilirsiniz. Ağ üzerinde veri almakta olduğu için `--allow-net` iznini vermeniz gerekmektedir:

```sh
deno run --allow-net fetch.js
```

Konsolda JSON verisi, metin olarak HTML verisi ve bir hata mesajı görmelisiniz.

## Veri akıtma

Bazen ağ üzerinde büyük dosyaları göndermek veya almak isteyebilirsiniz. **Bir dosyanın boyutunu önceden bilmediğinizde, akıtma veriyi ele almanın daha verimli bir yoludur.** İstemci akıştan "tamam" dediği zamana kadar okumaya devam edebilir.

Deno, verileri akıtmak için `Streams API`'sini sağlar. Bir dosyayı okunabilir veya yazılabilir bir akışa nasıl dönüştüreceğimizi ve akışları kullanarak dosyaları nasıl göndereceğimizi ve alacağımızı göreceğiz.


Akış Kullanımı Hakkında Daha Fazla Bilgi

1. **Akışların Avantajları**: Veriler parça parça işlenebilir, bu da belleği verimli kullanmak anlamına gelir.
2. **Dikkat Edilmesi Gerekenler**: Akış yönlendirmeleri sırasında veri bütünlüğünü sağlamak önemlidir.



`stream.js` adında yeni bir dosya oluşturun.

Bir dosyayı almak için `fetch` API'sini kullanacağız. Sonra `Deno.open` yöntemini kullanarak yazılabilir bir dosya oluşturup açacağız ve `pipeTo` yöntemini kullanarak oluşturulan dosyaya byte akışını göndereceğiz.

Sonra, bir `POST` isteğindeki `readable` özelliğini kullanarak dosyanın byte akışını bir sunucuya göndereceğiz.

```ts title="stream.js"
// Bir dosya alma
const fileResponse = await fetch("https://deno.land/logo.svg");

if (fileResponse.body) {
  const file = await Deno.open("./logo.svg", { write: true, create: true });

  await fileResponse.body.pipeTo(file.writable);
}

// Bir dosya gönderme
const file = await Deno.open("./logo.svg", { read: true });

await fetch("https://example.com/", {
  method: "POST",
  body: file.readable,
});
```

Bu kodu `deno run` komutuyla çalıştırabilirsiniz. Ağa bağlı olduğu için `--allow-net`, `--allow-write` ve `--allow-read` izinlerini vermeniz gerekmektedir:

```sh
deno run --allow-read --allow-write --allow-net stream.js
```

`logo.svg` dosyasının mevcut dizinde oluşturulmuş ve doldurulmuş olarak görünmesi gerekir ve eğer example.com'un sahibiyseniz, dosyanın sunucuya gönderildiğini göreceksiniz.

> **Artık bir ağ üzerinden veri almayı ve akıtmayı** öğrendiniz! İster statik dosyaları sunuyor olun, ister yüklemeleri işleyin, dinamik içerik oluşturun ya da büyük veri kümelerini akıtın, Deno’nun dosya işleme ve akıtma yetenekleri geliştirici araç kutunuzda harika araçlardır!