---
title: Enquirer's Prompts
description: Bu bölüm, Enquirer's prompt'larının neye benzediği, nasıl çalıştığı, nasıl çalıştırılacağı, mevcut seçenekleri ve prompt'ları özelleştirme veya kendi prompt kavramınızı oluşturma hakkında bilgi vermektedir.
keywords: [Enquirer, prompt, kullanıcı girişi, özelleştirme, arayüz]
---

# Enquirer's Prompts

Bu bölüm, Enquirer's prompt'larının neye benzediği, nasıl çalıştığı, nasıl çalıştırılacağı, mevcut seçenekleri ve prompt'ları özelleştirme veya kendi prompt kavramınızı oluşturma hakkında bilgi vermektedir.

**Enquirer's prompt'larına başlamak**

- `Prompt` - Diğer prompt'lar tarafından kullanılan temel `Prompt` sınıfı
  - `Prompt Seçenekleri`
- `Yerleşik prompt'lar`
- `Prompt Türleri` - Diğer prompt'lar tarafından kullanılan temel `Prompt` sınıfı
- `Özel prompt'lar` - Enquirer 2.0, özel prompt'ların oluşturulmasını ve kullanılmasını daha kolay hale getirmek amacıyla "tip" kavramını tanıttı.

## Prompt

Temel `Prompt` sınıfı, tüm diğer prompt'ları oluşturmak için kullanılır.

```js
const { Prompt } = require('enquirer');
class MyCustomPrompt extends Prompt {}
```

Bunun nasıl çalıştığını öğrenmek için `özel prompt' oluşturma` belgelerine göz atın.

### Prompt Seçenekleri

Her prompt, aşağıdaki arayüzü uygulayan bir seçenek nesnesi (veya "soru" nesnesi) alır:

```js
{
  // zorunlu
  type: string | function,
  name: string | function,
  message: string | function | async function,

  // isteğe bağlı
  skip: boolean | function | async function,
  initial: string | function | async function,
  format: function | async function,
  result: function | async function,
  validate: function | async function,
}
```

:::tip
Seçenek nesnesinin her bir özelliği aşağıda açıklanmaktadır:
:::

| **Özellik** | **Zorunlu mi?** | **Tür** | **Açıklama** |
| --- | --- | --- | --- |
| `type` | evet | `string|function` | Enquirer, bu değeri uygulayacak prompt türünü belirlemek için kullanır, ancak prompt'lar doğrudan çalıştırıldığında isteğe bağlıdır. |
| `name` | evet | `string|function` | Döndürülen değerler (yanıtlar) nesnesindeki cevabı almak için anahtar olarak kullanılır. |
| `message` | evet | `string|function` | Prompt terminalde görüntülendiğinde gösterilecek mesajdır. |
| `skip` | hayır | `boolean|function` | `true` ise o prompt sorulmayacaktır. |
| `initial` | hayır | `string|function` | Kullanıcı bir değer sağlamazsa döndürülecek varsayılan değerdir. |
| `format` | hayır | `function` | Kullanıcı girişini terminalde formatlamak için fonksiyon. |
| `result` | hayır | `function` | Nihai gönderilen değeri geri dönmeden önce formatlamak için fonksiyon. |
| `validate` | hayır | `function` | Gönderilen değeri geri dönmeden önce doğrulamak için fonksiyon. Bu fonksiyon bir boolean veya string döndürebilir. Bir string dönerse, doğrulama hata mesajı olarak kullanılacaktır. |

**Örnek kullanım**

```js
const { prompt } = require('enquirer');

const question = {
  type: 'input',
  name: 'username',
  message: 'Kullanıcı adınız nedir?'
};

prompt(question)
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);
```



## Yerleşik prompt'lar

- `AutoComplete Prompt`
- `BasicAuth Prompt`
- `Confirm Prompt`
- `Form Prompt`
- `Input Prompt`
- `Invisible Prompt`
- `List Prompt`
- `MultiSelect Prompt`
- `Numeral Prompt`
- `Password Prompt`
- `Quiz Prompt`
- `Survey Prompt`
- `Scale Prompt`
- `Select Prompt`
- `Sort Prompt`
- `Snippet Prompt`
- `Toggle Prompt`

## AutoComplete Prompt

Kullanıcı yazdıkça otomatik olarak tamamlanan ve seçilen değeri string olarak döndüren prompt.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/autocomplete-prompt.gif)


**Örnek Kullanım**

```js
const { AutoComplete } = require('enquirer');

const prompt = new AutoComplete({
  name: 'flavor',
  message: 'Favori lezzetinizi seçin',
  limit: 10,
  initial: 2,
  choices: [
    'Badem',
    'Elma',
    'Muz',
    'Böğürtlen',
    'Yaban Mersini',
    'Kiraz',
    'Çikolata',
    'Tarçın',
    'Hindistan Cevizi',
    'Kızılcık',
    'Üzüm',
    'Şekerleme',
    'Portakal',
    'Armut',
    'Ananas',
    'Frambuaz',
    'Çilek',
    'Vanilya',
    'Karpuz',
    'Kış Yeşili'
  ]
});

prompt.run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);
```

**AutoComplete Seçenekleri**

| Seçenek | Tür | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `highlight` | `function` | `dim` sürümü birincil stilin | Kullanıcının girişine uyan karakterleri "vurgularken" kullanılacak renk. |
| `multiple` | `boolean` | `false` | Birden fazla seçim yapılmasına izin verir. |
| `suggest` | `function` | Hırslı eşleşme, `choice.message` içinde giriş stringi bulunan seçimleri döndürür. | Seçimleri filtreleyen fonksiyon. Kullanıcı girişini ve bir seçim dizisini alır ve eşleşen seçimlerin bir listesini döndürür. |
| `initial` | `number` | 0 | Seçim listesindeki önceden seçilmiş öğe. |
| `footer` | `function` | Yok | [footer metnini](https://github.com/enquirer/enquirer/blob/6c2819518a1e2ed284242a99a685655fbaabfa28/examples/autocomplete/option-footer.js#L10) gösteren fonksiyon. |

**İlgili prompt'lar**

- `Select`
- `MultiSelect`
- `Survey`

**↑ geri dön:** `Başlarken` · `Prompts`

***

## BasicAuth Prompt

Kullanıcıdan kimlik doğrulamak için kullanıcı adı ve şifre isteyen prompt. `BasicAuth` prompt'undaki `authenticate` fonksiyonunun varsayılan uygulaması, kullanıcı adı ve şifreyi prompt çalıştırılırken sağlanan değerlerle karşılaştırmaktır. Uygulayıcının, girilen kullanıcı adı ve şifreyi doğrulamak için bir API isteği yapma gibi özel bir mantıkla `authenticate` fonksiyonunu geçersiz kılması beklenmektedir.


  ![](https://user-images.githubusercontent.com/13731210/61570485-7ffd9c00-aaaa-11e9-857a-d47dc7008284.gif)


**Örnek Kullanım**

```js
const { BasicAuth } = require('enquirer');

 const prompt = new BasicAuth({
  name: 'password',
  message: 'Lütfen şifrenizi girin',
  username: 'rajat-sr',
  password: '123',
  showPassword: true
});

 prompt
  .run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);
```

**↑ geri dön:** `Başlarken` · `Prompts`

***

## Confirm Prompt

`true` veya `false` döndüren prompt.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/confirm-prompt.gif)


**Örnek Kullanım**

```js
const { Confirm } = require('enquirer');

const prompt = new Confirm({
  name: 'question',
  message: 'Cevap vermek ister misiniz?'
});

prompt.run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);
```

**İlgili prompt'lar**

- `Input`
- `Numeral`
- `Password`

**↑ geri dön:** `Başlarken` · `Prompts`

***

## Form Prompt

Kullanıcının tek bir terminal ekranında birden fazla değer girmesine ve göndermesine izin veren prompt.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/form-prompt.gif)


**Örnek Kullanım**

```js
const { Form } = require('enquirer');

const prompt = new Form({
  name: 'user',
  message: 'Lütfen aşağıdaki bilgileri sağlayın:',
  choices: [
    { name: 'firstname', message: 'Ad', initial: 'Jon' },
    { name: 'lastname', message: 'Soyad', initial: 'Schlinkert' },
    { name: 'username', message: 'GitHub kullanıcı adı', initial: 'jonschlinkert' }
  ]
});

prompt.run()
  .then(value => console.log('Cevap:', value))
  .catch(console.error);
```

**İlgili prompt'lar**

- `Input`
- `Survey`

**↑ geri dön:** `Başlarken` · `Prompts`

***

## Input Prompt

Kullanıcı girişini alan ve bir string döndüren prompt.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/input-prompt.gif)


**Örnek Kullanım**

```js
const { Input } = require('enquirer');
const prompt = new Input({
  message: 'Kullanıcı adınız nedir?',
  initial: 'jonschlinkert'
});

prompt.run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.log);
```

Kullanıcının döngü yapabileceği [girdi geçmişi](https://github.com/enquirer/enquirer/blob/master/examples/input/option-history.js) saklamak için [data-store](https://github.com/jonschlinkert/data-store) kullanabilirsiniz (bkz. [kaynak](https://github.com/enquirer/enquirer/blob/8407dc3579123df5e6e20215078e33bb605b0c37/lib/prompts/input.js)).

**İlgili prompt'lar**

- `Confirm`
- `Numeral`
- `Password`

**↑ geri dön:** `Başlarken` · `Prompts`

***

## Invisible Prompt

Kullanıcı girişini alan, terminalden gizleyen ve bir string döndüren prompt.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/invisible-prompt.gif)


**Örnek Kullanım**

```js
const { Invisible } = require('enquirer');
const prompt = new Invisible({
  name: 'secret',
  message: 'Sırrınız nedir?'
});

prompt.run()
  .then(answer => console.log('Cevap:', { secret: answer }))
  .catch(console.error);
```

**İlgili prompt'lar**

- `Password`
- `Input`

**↑ geri dön:** `Başlarken` · `Prompts`

***

## List Prompt

Kullanıcı girişini bir liste değerine dönüştüren prompt. Varsayılan ayırıcı karakter `,` ile isteğe bağlı son boşluktur.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/list-prompt.gif)


**Örnek Kullanım**

```js
const { List } = require('enquirer');
const prompt = new List({
  name: 'keywords',
  message: 'Virgülle ayrılmış anahtar kelimeleri yazın'
});

prompt.run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);
```

**İlgili prompt'lar**

- `Sort`
- `Select`

**↑ geri dön:** `Başlarken` · `Prompts`

***

## MultiSelect Prompt

Kullanıcının bir dizi seçenekten birden fazla öğe seçmesine izin veren prompt.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/multiselect-prompt.gif)


**Örnek Kullanım**

```js
const { MultiSelect } = require('enquirer');

const prompt = new MultiSelect({
  name: 'value',
  message: 'Favori renklerinizi seçin',
  limit: 7,
  choices: [
    { name: 'aqua', value: '#00ffff' },
    { name: 'black', value: '#000000' },
    { name: 'blue', value: '#0000ff' },
    { name: 'fuchsia', value: '#ff00ff' },
    { name: 'gray', value: '#808080' },
    { name: 'green', value: '#008000' },
    { name: 'lime', value: '#00ff00' },
    { name: 'maroon', value: '#800000' },
    { name: 'navy', value: '#000080' },
    { name: 'olive', value: '#808000' },
    { name: 'purple', value: '#800080' },
    { name: 'red', value: '#ff0000' },
    { name: 'silver', value: '#c0c0c0' },
    { name: 'teal', value: '#008080' },
    { name: 'white', value: '#ffffff' },
    { name: 'yellow', value: '#ffff00' }
  ]
});

prompt.run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);

// Cevap: ['aqua', 'blue', 'fuchsia']
```

**Örnek anahtar-değer çiftleri**

İsteğe bağlı olarak, bir `result` fonksiyonu geçebilir ve seçilen isimlerin ve değerlerin bir nesnesini döndürmek için `.map` yöntemini kullanabilirsiniz: `örnek`

```js
const { MultiSelect } = require('enquirer');

const prompt = new MultiSelect({
  name: 'value',
  message: 'Favori renklerinizi seçin',
  limit: 7,
  choices: [
    { name: 'aqua', value: '#00ffff' },
    { name: 'black', value: '#000000' },
    { name: 'blue', value: '#0000ff' },
    { name: 'fuchsia', value: '#ff00ff' },
    { name: 'gray', value: '#808080' },
    { name: 'green', value: '#008000' },
    { name: 'lime', value: '#00ff00' },
    { name: 'maroon', value: '#800000' },
    { name: 'navy', value: '#000080' },
    { name: 'olive', value: '#808000' },
    { name: 'purple', value: '#800080' },
    { name: 'red', value: '#ff0000' },
    { name: 'silver', value: '#c0c0c0' },
    { name: 'teal', value: '#008080' },
    { name: 'white', value: '#ffffff' },
    { name: 'yellow', value: '#ffff00' }
  ],
  result(names) {
   return this.map(names);
  }
});

prompt.run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);

// Cevap: { aqua: '#00ffff', blue: '#0000ff', fuchsia: '#ff00ff' }
```

**Örnek alternatif etiketler**

```js
const { MultiSelect } = require('enquirer');

const prompt = new MultiSelect({
  name: 'color',
  message: 'Bir lezzet seçin',
  choices: [
    { message: 'Negatif Kırmızı', name: 'cyan', value: '#00ffff' },
    { message: 'Işıklar Kapalı', name: 'black', value: '#000000' },
    { message: 'Okyanus', name: 'blue', value: '#0000ff' },
  ]
});

prompt.run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);
```

**İlgili prompt'lar**

- `AutoComplete`
- `Select`
- `Survey`

**↑ geri dön:** `Başlarken` · `Prompts`

***

## Numeral Prompt

Bir sayı olarak giriş alan prompt.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/numeral-prompt.gif)


**Örnek Kullanım**

```js
const { NumberPrompt } = require('enquirer');

const prompt = new NumberPrompt({
  name: 'number',
  message: 'Lütfen bir sayı girin'
});

prompt.run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);
```

**İlgili prompt'lar**

- `Input`
- `Confirm`

**↑ geri dön:** `Başlarken` · `Prompts`

***

## Password Prompt

Kullanıcı girişini alır ve terminalde gizler. Ayrıca `gizli prompt` için de bakabilirsiniz.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/password-prompt.gif)


**Örnek Kullanım**

```js
const { Password } = require('enquirer');

const prompt = new Password({
  name: 'password',
  message: 'Şifreniz nedir?'
});

prompt.run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);
```

**İlgili prompt'lar**

- `Input`
- `Invisible`

**↑ geri dön:** `Başlarken` · `Prompts`

***

## Quiz Prompt

Kullanıcının çoktan seçmeli quiz sorularını oynamasına izin veren prompt.


  ![](https://user-images.githubusercontent.com/13731210/61567561-891d4780-aa6f-11e9-9b09-3d504abd24ed.gif)


**Örnek Kullanım**

```js
const { Quiz } = require('enquirer');

 const prompt = new Quiz({
  name: 'countries',
  message: 'Dünyada kaç ülke var?',
  choices: ['165', '175', '185', '195', '205'],
  correctChoice: 3
});

 prompt
  .run()
  .then(answer => {
    if (answer.correct) {
      console.log('Doğru!');
    } else {
      console.log(`Yanlış! Doğru cevap ${answer.correctAnswer}`);
    }
  })
  .catch(console.error);
```

**Quiz Seçenekleri**

| Seçenek | Tür | Zorunlu | Açıklama |
| -------------- | ------------- | ------------- | --- |
| `choices` | `array` | Evet | Quiz sorusuna olası cevapların listesi. |
| `correctChoice`| `number` | Evet | `choices` dizisindeki doğru seçim indeksidir. |

**↑ geri dön:** `Başlarken` · `Prompts`

***

## Survey Prompt

Kullanıcının bir dizi soru için geri bildirimde bulunmasına izin veren prompt.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/survey-prompt.gif)


**Örnek Kullanım**

```js
const { Survey } = require('enquirer');

const prompt = new Survey({
  name: 'experience',
  message: 'Lütfen deneyiminizi değerlendirin',
   scale: [
    { name: '1', message: 'Kesinlikle Katılmıyorum' },
    { name: '2', message: 'Katılmıyorum' },
    { name: '3', message: 'Tarafsızım' },
    { name: '4', message: 'Katılıyorum' },
    { name: '5', message: 'Kesinlikle Katılıyorum' }
  ],
  margin: [0, 0, 2, 1],
  choices: [
    {
      name: 'interface',
      message: 'Web sitesinin kullanıcı dostu bir arayüzü var.'
    },
    {
      name: 'navigation',
      message: 'Web sitesi kolaylıkla gezilebilir.'
    },
    {
      name: 'images',
      message: 'Web sitesi genellikle iyi görüntülere sahiptir.'
    },
    {
      name: 'upload',
      message: 'Web sitesi, resim yüklemeyi kolaylaştırıyor.'
    },
    {
      name: 'colors',
      message: 'Web sitesinin hoş bir renk paleti var.'
    }
  ]
});

prompt.run()
  .then(value => console.log('Cevaplar:', value))
  .catch(console.error);
```

**İlgili prompt'lar**

- `Scale`
- `Snippet`
- `Select`

***

## Scale Prompt

`Survey prompt` için daha kompakt bir versiyon olarak, Scale prompt kullanıcının hızlı bir şekilde [Likert Skalasını](https://en.wikipedia.org/wiki/Likert_scale) kullanarak geri bildirimde bulunmasına olanak tanır.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/scale-prompt.gif)


**Örnek Kullanım**

```js
const { Scale } = require('enquirer');
const prompt = new Scale({
  name: 'experience',
  message: 'Lütfen deneyiminizi değerlendirin',
  scale: [
    { name: '1', message: 'Kesinlikle Katılmıyorum' },
    { name: '2', message: 'Katılmıyorum' },
    { name: '3', message: 'Tarafsızım' },
    { name: '4', message: 'Katılıyorum' },
    { name: '5', message: 'Kesinlikle Katılıyorum' }
  ],
  margin: [0, 0, 2, 1],
  choices: [
    {
      name: 'interface',
      message: 'Web sitesinin kullanıcı dostu bir arayüzü var.',
      initial: 2
    },
    {
      name: 'navigation',
      message: 'Web sitesi kolaylıkla gezilebilir.',
      initial: 2
    },
    {
      name: 'images',
      message: 'Web sitesi genellikle iyi görüntülere sahiptir.',
      initial: 2
    },
    {
      name: 'upload',
      message: 'Web sitesi, resim yüklemeyi kolaylaştırıyor.',
      initial: 2
    },
    {
      name: 'colors',
      message: 'Web sitesinin hoş bir renk paleti var.',
      initial: 2
    }
  ]
});

prompt.run()
  .then(value => console.log('Cevaplar:', value))
  .catch(console.error);
```

**İlgili prompt'lar**

- `AutoComplete`
- `Select`
- `Survey`

**↑ geri dön:** `Başlarken` · `Prompts`

***

---
title: Seçim İstemi
description: Seçim istemleri, kullanıcının çeşitli seçeneklerden seçim yapmasını sağlayan fonksiyonlar sunar. Bu belgede, kullanım örnekleri ve detaylar verilmiştir.
keywords: [seçim, istem, Enquirer, örnek, kullanıcı etkileşimi]
---

## Seçim İstemi

Kullanıcının bir seçenekler listesinden seçim yapmasına olanak tanır.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/select-prompt.gif)


**Örnek Kullanım**

```js
const { Select } = require('enquirer');

const prompt = new Select({
  name: 'color',
  message: 'Bir tat seçin',
  choices: ['elma', 'üzüm', 'karpuz', 'vişne', 'portakal']
});

prompt.run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);
```

:::tip
Kullanıcıdan seçim almak için `Select` sınıfını kullanabilirsiniz. Bu, konsol tabanlı uygulamalar için etkileşimli bir yöntemdir.
:::

**Örnek anahtar-değer çiftleri**

```js
const { Select } = require('enquirer');

const prompt = new Select({
  name: 'color',
  message: 'Bir renk seçin',
  choices: [
    { name: 'cyan', value: '#00ffff' },
    { name: 'black', value: '#000000' },
    { name: 'blue', value: '#0000ff' },
  ]
});

prompt.run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);
```

**Örnek alternatif etiketler**

```js
const { Select } = require('enquirer');

const prompt = new Select({

  name: 'color',  message: 'Bir renk seçin',
  choices: [
    { message: 'Negatif Kırmızı', name: 'cyan', value: '#00ffff' },
    { message: 'Işıklar Kapalı', name: 'black', value: '#000000' },
    { message: 'Okyanus', name: 'blue', value: '#0000ff' },
  ]
});

prompt.run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);
```

:::info
Bu örneklerde, her seçeneğe alternatif etiketler eklenmiştir. Bu, kullanıcı deneyimini artırır.
:::

**İlgili istemler**

- `Otomatik Tamamla`
- `Çoklu Seçim`

**↑ geri dön:** `Başlarken` · `İstemler`

***

## Sıralama İstemi

Kullanıcının bir listedeki öğeleri sıralamasına olanak tanır.

**Örnek**

Bu [örnekte](https://github.com/enquirer/enquirer/raw/master/examples/sort/prompt.js), döndürülen değerlere özel stil uygulaması yaparak olan biteni daha kolay görmeyi sağlar.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/sort-prompt.gif)


**Örnek Kullanım**

```js
const colors = require('ansi-colors');
const { Sort } = require('enquirer');
const prompt = new Sort({
  name: 'colors',
  message: 'Renkleri tercihe göre sırala',
  hint: 'En üst en iyisi, en alt en kötüsü',
  numbered: true,
  choices: ['red', 'white', 'green', 'cyan', 'yellow'].map(n => ({
    name: n,
    message: colors`n`
  }))
});

prompt.run()
  .then(function(answer = []) {
    console.log(answer);
    console.log('Tercih ettiğiniz renk sırası:');
    console.log(answer.map(key => colors`key`).join('\n'));
  })
  .catch(console.error);
```

:::warning
Sıralama istemi, kullanıcıların tercihlerine göre öğeleri sıralamalarına olanak tanır. Kullanıcıdan doğru girdileri almak için talimatların net olması önemlidir.
:::

**İlgili istemler**

- `Liste`
- `Seçim`

**↑ geri dön:** `Başlarken` · `İstemler`

***

## Parça İstemi

Kullanıcının kod veya metinde yer tutucuları değiştirmesine olanak tanır.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/snippet-prompt.gif)


**Örnek Kullanım**

```js
const semver = require('semver');
const { Snippet } = require('enquirer');
const prompt = new Snippet({
  name: 'username',
  message: 'package.json dosyasındaki alanları doldurun',
  required: true,
  fields: [
    {
      name: 'author_name',
      message: 'Yazar Adı'
    },
    {
      name: 'version',
      validate(value, state, item, index) {
        if (item && item.name === 'version' && !semver.valid(value)) {
          return prompt.styles.danger('sürüm geçerli bir semver değeri olmalıdır');
        }
        return true;
      }
    }
  ],
  template: `{
  "name": "\${name}",
  "description": "\${description}",
  "version": "\${version}",
  "homepage": "https://github.com/\${username}/\${name}",
  "author": "\${author_name} (https://github.com/\${username})",
  "repository": "\${username}/\${name}",
  "license": "\${license:ISC}"
}
`
});

prompt.run()
  .then(answer => console.log('Cevap:', answer.result))
  .catch(console.error);
```

**İlgili istemler**

- `Anket`
- `Otomatik Tamamla`

**↑ geri dön:** `Başlarken` · `İstemler`

***

## Anahtar İstemi

Kullanıcının iki değer arasında geçiş yapmasına olanak tanır ve `true` veya `false` döndürür.


  ![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/toggle-prompt.gif)


**Örnek Kullanım**

```js
const { Toggle } = require('enquirer');

const prompt = new Toggle({
  message: 'Cevap vermek ister misiniz?',
  enabled: 'Evet',
  disabled: 'Hayır'
});

prompt.run()
  .then(answer => console.log('Cevap:', answer))
  .catch(console.error);
```

**İlgili istemler**

- `Onayla`
- `Girdi`
- `Sıralama`

**↑ geri dön:** `Başlarken` · `İstemler`

***

## İstem Türleri
5 (yakında 6 olacak!) tür sınıfı vardır:
* `Dizi İstemi`
    - `Seçenekler`
    - `Özellikler`
    - `Metodlar`
    - `Seçenekler`
    - `Seçenekleri tanımlama`
    - `Seçenek özellikleri`
    - `İlgili istemler`
* `Kimlik Doğrulama İstemi`
* `Boolean İstemi`
* Tarih İstemi (Yakında!)
* `Sayı İstemi`
* `Dize İstemi`

Her bir tür, daha üst düzey istemler oluşturma konusunda bir başlangıç noktası olarak kullanılabilecek düşük seviyeli bir sınıftır. Nasıl yapılacağını öğrenmek için okumaya devam edin.

## Dizi İstemi

`ArrayPrompt` sınıfı, terminalde bir seçim listesi görüntülemek için kullanılan bir istem oluşturmada kullanılır. Örneğin, Enquirer bu sınıfı `Seçim` ve `Anket` istemleri için temel olarak kullanır.

### Seçenekler

Tüm istemlere (options) ek olarak, Dizi istemleri de aşağıdaki seçenekleri destekler.

| **Seçenek** | **Gerekli mi?** | **Tür** | **Açıklama** |
| --- | --- | --- | --- |
| `autofocus` | `hayır` | `string|number` | İstemin yüklendiğinde odaklanması gereken seçimlerin indeksi veya adı. Aynı anda yalnızca bir seçim odaklanabilir. | |
| `stdin` | `hayır` | `stream` | Tuş vuruşu olaylarını yayımlamak için kullanılacak giriş akışı. Varsayılan olarak `process.stdin`'dir. |
| `stdout` | `hayır` | `stream` | İstemi terminale yazmak için kullanılacak çıkış akışı. Varsayılan olarak `process.stdout`'dır. |
| |

### Özellikler

Dizi istemlerinin aşağıdaki örnek özellikleri ve alıcıları vardır.

| **Özellik Adı** | **Tür** | **Açıklama** |
| --- | --- | --- |
| `choices` | `array` | İstem seçenekleriyle geçirilen seçimlerden normalize edilmiş seçimlerin dizisi. |
| `cursor` | `number` | _Kullanıcı girişi (string)_ karşısındaki imlecin pozisyonu. |
| `enabled` | `array` | Etkin seçimlerin bir dizisini döndürür. |
| `focused` | `array` | Görünür seçimler listesindeki şu anda seçili seçimi döndürür. Bu, HTML ve CSS'deki odak kavramına benzer. Odaklı seçimler her zaman görünürdir (ekranda). Seçimler listesi görünür seçimlerden daha uzunsa ve ekran dışındaki bir seçim odaklanmışsa, liste odaklanmış seçime kaydırılır ve yeniden oluşturulur. |
| `focused` | Şu anda seçili olan seçimi alır. `prompt.choices[prompt.index]` ile eşdeğerdir. |
| `index` | `number` | _Görünür seçimler listesindeki_ gösterici pozisyonudur. |
| `limit` | `number` | Ekranda görüntülenecek seçenek sayısı. |
| `selected` | `array` | Ya etkin seçimlerin listesi (seçeneklerin çoklu olduğu durumlarda) ya da şu anda odaklanmış seçimdir. |
| `visible` | `string` | |

### Metodlar

| **Metod** | **Açıklama** |
| --- | --- |
| `pointer()` | Şu anda odaklanmış olan seçimi tanımlamak için kullanılacak görsel sembolü döndürür. Genellikle `❯` sembolü kullanılır. Gösterici her zaman görünür değildir, `otomatik tamamla` isteminde olduğu gibi. |
| `indicator()` | Bir seçimin işaretlenip işaretlenmediğini gösteren görsel sembolü döndürür. |
| `focus()` | Bir seçime odaklanmayı ayarlar, eğer odaklanabiliyorsa. |

### Seçenekler

Dizi istemleri, terminalde görüntülendiğinde kullanıcıların seçebileceği seçimler dizisini temsil eden `choices` seçeneğini destekler.

**Tür**: `string|object`

**Örnek**

```js
const { prompt } = require('enquirer');

const questions = [{
  type: 'select',
  name: 'color',
  message: 'Favori renk?',
  initial: 1,
  choices: [
    { name: 'red',   message: 'Kırmızı',   value: '#ff0000' }, //<= seçim nesnesi
    { name: 'green', message: 'Yeşil', value: '#00ff00' }, //<= seçim nesnesi
    { name: 'blue',  message: 'Mavi',  value: '#0000ff' }  //<= seçim nesnesi
  ]
}];

const answers = await prompt(questions);
console.log('Cevap:', answers.color);
```

### Seçenekleri Tanımlama

Bir dizi ya da nesne olarak tanımlansalar da, seçenekler şu arayüze normalize edilir:

```js
{
  name: string;
  message: string | undefined;
  value: string | undefined;
  hint: string | undefined;
  disabled: boolean | string | undefined;
}
```

**Örnek**

```js
const question = {
  name: 'fruit',
  message: 'Favori meyve?',
  choices: ['Elma', 'Portakal', 'Ahududu']
};
```

İstem çalıştırıldığında şu şekilde normalize edilir:

```js
const question = {
  name: 'fruit',
  message: 'Favori meyve?',
  choices: [
    { name: 'Elma', message: 'Elma', value: 'Elma' },
    { name: 'Portakal', message: 'Portakal', value: 'Portakal' },
    { name: 'Ahududu', message: 'Ahududu', value: 'Ahududu' }
  ]
};
```

### Seçenek Özellikleri

`choice` nesnelerinde aşağıdaki özellikler desteklenir.

| **Seçenek** | **Tür** | **Açıklama** |
| --- | --- | --- |
| `name` | `string` | Bir seçimi tanımlamak için benzersiz anahtar |
| `message` | `string` | Terminalde görüntülenmesi gereken mesaj. Bu tanımlayıcı undefined olduğunda `name` kullanılır. |
| `value` | `string` | Seçim ile ilişkilendirilecek değer. Kullanıcı seçimlerinden anahtar-değer çiftleri oluşturma için kullanışlıdır. Bu tanımlayıcı undefined olduğunda `name` kullanılır. |
| `choices` | `array` | "Çocuk" seçimlerin dizisi. |
| `hint` | `string` | Bir seçimin yanında görüntülenmesi gereken yardım mesajı. |
| `role` | `string` | Seçimin nasıl görüntüleneceğini belirler. Mevcut olan tek rol `separator`dır. Gelecekte ek roller (başlık vb.) eklenebilir. Lütfen [özellik isteği] oluşturun. |
| `enabled` | `boolean` | Bir seçimin varsayılan olarak etkinleştirilmesi. Bu yalnızca `options.multiple` true olduğunda veya `Çoklu Seçim` gibi birden fazla seçim destekleyen istemlerde desteklenir. |
| `disabled` | `boolean|string` | Seçimi seçilemez hale getirir. Bu değer ya `true`, `false` ya da görüntülenmesi gereken bir mesaj olabilir. |
| `indicator` | `string|function` | Bir seçimin işlemeyi görüntülemek için özelleştirilmiş göstergedir (bir kontrol veya radyo düğmesi gibi). |

### İlgili İstemler

- `Otomatik Tamamla`
- `Form`
- `Çoklu Seçim`
- `Seçim`
- `Anket`

***

## Kimlik Doğrulama İstemi

`AuthPrompt`, kullanıcıyı herhangi bir kimlik doğrulama yöntemiyle giriş yapmak için istemler oluşturmak için kullanılır. Örneğin, Enquirer bu sınıfı `BasicAuth İstemi` için temel olarak kullanır. Ayrıca kimlik doğrulamayı zaman tabanlı OTP kullanarak ya da OAuth tabanlı kimlik doğrulama istemi oluşturan `AuthPrompt`'u kullanan istem örneklerini `examples/auth/` klasöründe bulabilirsiniz.

`AuthPrompt`, `AuthPrompt` sınıfının bir örneğini oluşturan bir fabrika fonksiyonuna sahiptir ve bir `authenticate` fonksiyonu alır; bu, `AuthPrompt` sınıfının `authenticate` fonksiyonunu geçersiz kılmak için bir argümandır.

### Metodlar

| **Metod** | **Açıklama** |
| ---------------- | --- |
| `authenticate()` | Tüm kimlik doğrulama mantığını içerir. Bu fonksiyon, özel kimlik doğrulama mantığı uygulamak için geçersiz kılınmalıdır. Varsayılan `authenticate` fonksiyonu, başka bir fonksiyon sağlanmadığında hata fırlatır. |

### Seçenekler

Kimlik doğrulama istemi, `Form İstemi` ile kullanılan seçeneklere benzer şekilde `choices` seçeneğini destekler.

**Örnek**

```js
const { AuthPrompt } = require('enquirer');

function authenticate(value, state) {
  if (value.username === this.options.username && value.password === this.options.password) {
    return true;
  }
  return false;
}

const CustomAuthPrompt = AuthPrompt.create(authenticate);

const prompt = new CustomAuthPrompt({
  name: 'password',
  message: 'Lütfen şifrenizi girin',
  username: 'rajat-sr',
  password: '1234567',
  choices: [
    { name: 'username', message: 'kullanıcı adı' },
    { name: 'password', message: 'şifre' }
  ]
});

prompt
  .run()
  .then(answer => console.log('Kimlik doğrulandı mı?', answer))
  .catch(console.error);
```

### İlgili İstemler

- `BasicAuth İstemi`

***

## Boolean İstemi

`BooleanPrompt` sınıfı, görüntüleyen ve boolean değeri döndüren istemler oluşturmak için kullanılır.

```js
const { BooleanPrompt } = require('enquirer');

const  prompt = new  BooleanPrompt({
  header:  '========================',
  message:  'Enquirer\'ı seviyor musunuz?',
  footer:  '========================',
});

prompt.run()
  .then(answer  =>  console.log('Seçildi:', answer))
  .catch(console.error);
```

**Dönüş:** `boolean`

***

## Sayı İstemi

`NumberPrompt` sınıfı, görüntüleyen ve sayısal değeri döndüren istemler oluşturmak için kullanılır.

```js
const { NumberPrompt } = require('enquirer');

const  prompt = new  NumberPrompt({
  header:  '************************',
  message:  'Sayılari girin:',
  footer:  '************************',
});

prompt.run()
  .then(answer  =>  console.log('Sayilar:', answer))
  .catch(console.error);
```

**Dönüş:** `string|number` (sayı veya sayı biçiminde dize)

***

## Dize İstemi

`StringPrompt` sınıfı, görüntüleyen ve dize değeri döndüren istemler oluşturmak için kullanılır.

```js
const { StringPrompt } = require('enquirer');

const prompt = new StringPrompt({
  header: '************************',
  message: 'Diziyi girin:',
  footer: '************************'
});

prompt.run()
  .then(answer => console.log('Dizi:', answer))
  .catch(console.error);
```

**Dönüş:** `string`



# ❯ Özel istemler
{%= format(include('docs/custom-prompts.md')) %}  