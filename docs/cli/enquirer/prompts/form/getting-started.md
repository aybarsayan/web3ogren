---
description: Bu kılavuz, form istemlerinin temel kullanımını ve kullanıcının gerektiği bilgileri toplamak için nasıl yapılandırılacağını gösterir.
keywords: [form istemleri, CLI araçları, enquirer, JavaScript, kullanıcı giriş]
---

# Form istemlerine başlangıç



- `Beklentiler`
- `Örnek`
- `prompt` tanımlama`
- `İstemi Form'a dönüştürme`
- `Alan ekleme`
- `Sonraki adımlar`
- `İlgili`



## Beklentiler

Form istemleri, bir CLI aracı oluştururken çok yararlı olabilir. Bir form, kullanıcının alanlar arasında geçiş yapmasını sağlar ve birkaç yardımcı seçenek sunar.

**Bu kılavuzda, bir form isteminin temel kullanımını göstereceğiz.**

Biz …

* … basit bir istem oluşturacağız.
* … istemi bir forma dönüştüreceğiz.
* … formumuza alanlar ekleyeceğiz.

:::tip
Form istemleri oluştururken kullanıcıların doğru bilgi girmesini sağlamak için açıklayıcı mesajlar kullanın.
:::

## Örnek

[Başlarken örneği][getting-started-example]  
![Başlarken asciicast][getting-started-rec]

## `prompt` tanımlama

Form istemini kullanmak için `{prompt}`'u `"enquirer"`'dan dahil etmemiz gerekiyor.  
Sonra alışıldık şekilde bir istem tanımlayabiliriz. Ad bilgisi ile başlayacağız.

```js
const { prompt } = require("enquirer");

const results = prompt({
  message: "İsim:",
  name: "firstname",
  type: "input"
});
```

## İstemi Form'a dönüştürme

Bir form oluşturmak için `type: "form"` ve  
`choices: string[] | Choice[]` özelliklerini istem yapılandırmamıza eklememiz gerekiyor. 

Alanımızı ilk seçenek olarak ekleyelim, `message: string` değerini tüm formu tanımlayacak şekilde değiştirelim ve formumuza benzersiz bir `name: string` verelim.

```js
const { prompt } = require("enquirer");

const results = prompt({
  choices: [{
    message: "İsim",
    name: "firstname"
  }],
  message: "Lütfen aşağıdaki bilgileri sağlayın:",
  name: "user",
  type: "form"
});
```

:::info
Kullanıcılara formları doldururken yardımcı olmak için form alanlarının ne tür bilgiler beklediğini açıklayan mesajlar eklemek faydalıdır.
:::

## Alan ekleme

Artık formumuza alanlar eklemeye devam etme vakti.

> Formunuz şimdi şöyle görünmelidir:
> 
> ```js
> const { prompt } = require("enquirer");
> 
> const results = prompt({
>   choices: [
>     {
>       message: "İsim",
>       name: "firstname"
>     },
>     {
>       message: "Soyisim",
>       name: "lastname"
>     },
>     {
>       message: "GitHub kullanıcı adı",
>       name: "username"
>     }
>   ],
>   message: "Lütfen aşağıdaki bilgileri sağlayın:",
>   name: "user",
>   type: "form"
> });
> ```

## Sonraki adımlar

Artık temel form istemleri ile rahat olmalısınız. Sonraki adımlarda formumuza bazı özellikler eklemenin yollarına bakacağız.

* [Varsayılan değerler][default-values]

:::warning
Form görünümünü ve kullanımını iyileştirmek için kullanıcıdan alınacak bilgilerin doğru şekilde alanlara yerleştirildiğinden emin olun. Yanlış bilgiler, kullanıcı deneyimini olumsuz etkileyebilir.
:::

## İlgili

* [Varsayılan değerler][default-values]

[default-values]: https://github.com/enquirer/enquirer/tree/master/docs/form/default-values.md  
[getting-started-rec]: https://uploads.codesandbox.io/uploads/user/d4803626-4dbe-4304-b684-7d790aa169f0/eKw4-form_getting-started_001.svg  
[getting-started-example]: https://github.com/enquirer/enquirer/tree/master/guide/lib/prompts/form/getting-started.js  