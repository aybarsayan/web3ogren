---
description: Bu kılavuzda form istemlerine varsayılan değerler ekleme yöntemlerini öğrenin. Alanların nasıl önceden doldurulacağına dair önemli bilgiler ve örneklerle doludur.
keywords: [form istemleri, varsayılan değerler, başlangıç değeri, onChoice, Enquirer]
---

# Form istemlerine varsayılan değerler nasıl eklenir



- `Beklentiler`
- `Bir `istek` tanımlayın`
- `başlangıç` değerini ayarlayın.`
- `onChoice` ile daha önce girilen değerleri kullanın`
- `Sonraki adımlar`
- `İlgili`



## Beklentiler

Artık bir form istemi oluşturmayı zaten biliyor olmalısınız. Bu kılavuzda
ilk/varsayılan değerleri tanımlamanın farklı yöntemlerini inceleyeceğiz.

:::tip
Bu kılavuzda alanları nasıl önceden dolduracağınızı göstereceğiz.
:::

Biz …

* … `başlangıç` özelliğini ayarlayacağız.
* … önceki alan değerlerini kullanmak için `onChoice` yöntemini kullanacağız.

## Örnek

[Varsayılan değerler örneği][default-values-example]
![Varsayılan değerler asciicast][default-values-rec]

## `başlangıç` değerini ayarlayın.

Önceki kılavuzun son adımında ([Başlarken][getting-started]) `choices: string[] | Choice[]` alanını üç alanla doldurduk.

Varsayılan değerleri tanımlamanın en kolay yolu, alanlarımıza `başlangıç: string` 
özelliğini eklemektir.

```js
const { prompt } = require("enquirer");

const results = prompt({
  choices: [
    {
      başlangıç: "Jon",
      message: "İsim",
      name: "firstname"
    },
    // ...
  ],
  // ...
});
```

## `onChoice` ile daha önce girilen değerleri kullanın

Bir alanımızda daha önce girilen bilgileri yeniden kullanmak isteyebiliriz.

Kullanıcı adını varsayalım: `(firstname + lastname).toLowerCase()`. Daha önce girilen değerleri 
almak ve bunları önerimiz için kullanmak için `onChoice(s: State, c: Choice, i: number)` metodunu kullanabiliriz.

```js
const { prompt } = require("enquirer");

const results = prompt({
  choices: [
    // ...
    {
      message: "GitHub kullanıcı adı",
      name: "username",
      onChoice(state, choice, i) {
        const { firstname, lastname } = this.values;
        choice.initial = `${firstname}${lastname}`.toLowerCase();
      }
    }
  ],
  // ...
});
```

> Formunuz şimdi böyle görünmelidir.
> — Yazar

```js
const { prompt } = require("enquirer");

const results = prompt({
  choices: [
    {
      başlangıç: "Jon",
      message: "İsim",
      name: "firstname"
    },
    {
      başlangıç: "Schlinkert",
      message: "Soyisim",
      name: "lastname"
    },
    {
      message: "GitHub kullanıcı adı",
      name: "username",
      onChoice(state, choice, i) {
        const { firstname, lastname } = this.values;
        choice.initial = `${firstname}${lastname}`.toLowerCase();
      }
    }
  ],
  message: "Lütfen aşağıdaki bilgileri sağlayın:",
  name: "user",
  type: "form"
});
```

## Sonraki adımlar

Artık başlangıç değerleri ile rahat olmalısınız. Sonraki adımlarda formunuza biraz 
renk katmak için bazı seçeneklere göz atacağız.

* ... belirlenecek.

## İlgili

* [Başlarken][getting-started]

[getting-started]: https://github.com/enquirer/enquirer/tree/master/docs/form/getting-started.md
[default-values-rec]: https://uploads.codesandbox.io/uploads/user/d4803626-4dbe-4304-b684-7d790aa169f0/RfvF-form_default_values_001.svg
[default-values-example]: https://github.com/enquirer/enquirer/tree/master/guide/lib/prompts/form/default-values.js