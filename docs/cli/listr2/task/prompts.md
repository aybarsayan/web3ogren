---
description: Bu belge, Promtlar ve adaptörleri ile ilgili önemli bilgiler sunmaktadır. Kullanıcı etkileşimlerini kolaylaştırmak için gerekli adımlar detaylandırılmıştır.
keywords: [promtlar, adaptörler, kullanıcı etkileşimi, enquirer, inquirer]
title: Promtlar
order: 60
tag:
  - ileri
  - arayüz
category:
  - görev
---



Promtlar, kullanıcı ile etkileşim sağlamak için adaptörler ve isteğe bağlı eş bağımlılıklar kullanır. **Bu uygulama ile yaşadığımız sorun**, tek bir konsol güncelleyici kullanmamızdır, bu nedenle doğrudan `process.stdout`'a yazamayız. Bu davranış, `task.stdout`'a yazmak ve satır temizleme için ANSI kaçış dizilerini kontrol etmek amacıyla araya bir adaptör yerleştirilmesini gerektirir, çünkü konsol güncelleyici aracılığıyla `vt100` uyumlu bir arayüzümüz yoktur.



 itibarıyla, birden fazla prompt sağlayıcısını desteklemek için `task.prompt` fonksiyonunun imzası değişti ve öncelikle bir adaptör gerektiriyor.

## Adaptörler

### `enquirer`

Girdi adaptörü, güzel ve pek iyi bakılmayan (xD) [`enquirer`](https://www.npmjs.com/package/enquirer) kullanır.

::: danger
`enquirer`, isteğe bağlı bir eş bağımlılıktır. Lütfen önce bunu yükleyin.
:::

::: code-group
```bash [npm]
npm i @listr2/prompt-adapter-enquirer enquirer
```

```bash [yarn]
yarn add @listr2/prompt-adapter-enquirer enquirer
```

```bash [pnpm]
pnpm i @listr2/prompt-adapter-enquirer enquirer
```
:::

Bir _Görev_ içinde, `task.prompt` fonksiyonu size herhangi bir [`enquirer`](https://www.npmjs.com/package/enquirer) varsayılan istemine erişim sağlar ve özel bir `enquirer` istemini kullanmak için altındaki örneği değiştirme yeteneği sunar.



Kullanıcıdan girdi almak için göreve bir yeni istem atayabilir ve yanıtı bağlama yazabilirsiniz.

::: warning
Eş zamanlı görevlerde promtların çalıştırılması önerilmez çünkü birden fazla prompt çakışacak ve birbirinin konsol çıktılarını yazacaktır ve klavye hareketlerinizi yaparken bu, ikisine de uygulanır.

Bu bazı render'larda devre dışı bırakılmıştır, ancak hala bazı render'larla bunu yapabilirsiniz.
:::

::: info Örnek
İlgili örnekleri [burada](https://github.com/listr2/listr2/tree/master/examples/task-prompt.example.ts) bulabilirsiniz.
:::

#### Kullanım

Promtları erişmek için `task.prompt` jumper fonksiyonunu kullanarak [`enquirer`](https://www.npmjs.com/package/enquirer) promtlarınızı argüman olarak geçebilirsiniz.

::: info
Lütfen `enquirer` türlerini yeniden yazdığımı ve bunları bu uygulama ile paketlediğimi unutmayın.

Bu nedenle, onların tümünü genellikle kullanmadığım için bazı hatalar içermesi muhtemeldir. `enquirer` bunları düzeltirken orijinal türleri  ile birleştireceğim, bu sorun açılabilir, büyük olasılıkla asla olmayacaktır!
:::

##### Tek Prompt

::: danger
Burada küçük bir numara yaptım, eğer yalnızca bir promta sahipseniz, o zaman promtunuzu `enquirer` gibi adlandırmanıza gerek yoktur, otomatik olarak adlandırılacak ve geri dönecektir.
:::

(
  [
    {
      title: 'Özel prompt',
      task: async (ctx, task): Promise => {
        ctx.testInput = await task.prompt(ListrEnquirerPromptAdapter).run(
          {
            type: 'editor',
            message: 'Bu enquirer özel isteminde bir şeyler yazın.',
            initial: 'Yazmaya başlayın!',
            validate: (response): boolean | string => {
              return true
            }
          },
          { enquirer }
        )
      }
    }
  ],
  { concurrent: false }
)

const ctx = await tasks.run()

console.log(ctx)
```

#### Bir Promtu İptal Etme



_Görev_, etkin promptu takip eder ve bu adaptör bir `cancel` metodu sunduğundan, aktifken bir promtu iptal edebilirsiniz.



::: danger
`inquirer`, isteğe bağlı bir eş bağımlılıktır. Lütfen önce bunu yükleyin.

Bu kütüphane, miras alınan uygulama `inquirer` yerine `@inquirer/prompts` kullanır.

Bir `inquirer` promtundan yararlanmak için gerekli olan prompt paketini de eklemeyi unutmayın, bunun hakkında daha fazla bilgiyi [belgelendirmelerinde](https://github.com/SBoudrias/Inquirer.js/blob/master/packages/prompts/README.md) bulabilirsiniz.
:::

::: code-group
```bash [npm]
npm i @listr2/prompt-adapter-inquirer @inquirer/prompts
```

```bash [yarn]
yarn add @listr2/prompt-adapter-inquirer @inquirer/prompts
```

```bash [pnpm]
pnpm i @listr2/prompt-adapter-inquirer @inquirer/prompts
```
:::

##### Tek Prompt

<<< @../../examples/docs/task/prompts/inquirer-single.ts{12}

#### Bir Promtu İptal Etme

_Görev_, etkin promptu takip eder ve bu adaptör bir `cancel` metodu sunduğundan, aktifken bir promtu iptal edebilirsiniz.

::: warning
`inquirer`, promptu iptal etme sırasında biraz farklı davranır, çünkü bu, `CancellablePromise` biçiminde uygulanır ve submit'i dışarıya açmaz, her zaman durumda promise iptal edildiğinde bir hata fırlatır.
:::

<<< @../../examples/docs/task/prompts/inquirer-cancel.ts{17}

## Renderer

Promtlar, çıktılarını dahili bir `WritableStream` üzerinden `process.stdout`'ya geçirdiğinden, TTY olmayan render'larda birden fazla kez render edilecektir. Her ne olursa olsun çalışacaktır, ancak harika görünmeyebilir. Promtlar, TTY olmayan terminaller için tasarlanmadığından, bu bir yenilik olarak değerlendirilir.

### _DefaultRenderer_

Promtlar bir başlığa sahip olabilir ya da olmayabilir, ancak her zaman mevcut konsol çıktısının sonunda render edilecektir.