---
description: Bootstrap düğme bileşeni, tablolar, formlar, kartlar ve daha fazlasında eylemler için. CoreUI 4 for Bootstrap çeşitli stiller, durumlar ve boyutlar sağlar. Kullanıma hazır ve kolayca özelleştirilebilir.
keywords: [Bootstrap, düğme, CoreUI, UI bileşeni, web geliştirme, CSS]
---

## Temel sınıf

CoreUI, temel stilleri ayarlayan bir `.btn` sınıfına sahiptir; padding ve içerik hizalaması gibi. Varsayılan olarak, `.btn` kontrollerinin şeffaf bir kenarlığı ve arka plan rengi vardır ve herhangi bir açık odak ve üzerine gelme stilleri yoktur.


Temel sınıf
`.btn` sınıfı, düğme çeşitlerimizle birlikte kullanılmak üzere tasarlanmıştır veya kendi özel stillerinizin temeli olarak hizmet edebilir.

:::warning
Eğer `.btn` sınıfını tek başına kullanıyorsanız, en azından bazı açık `:focus` ve/veya `:focus-visible` stillerini tanımlamayı unutmayın.
:::

## Çeşitler

CoreUI, her biri kendi anlamsal amacını taşıyan önceden tanımlanmış birkaç Bootstrap düğmesi içerir. CoreUI ayrıca bazı benzersiz düğme stilleri sunar.

Düğmeler, kullanıcı tıkladığında veya dokunduğunda hangi eylemin gerçekleşeceğini gösterir. Bootstrap düğmeleri, hem deneyimin arka planında hem de ön planında işlemleri başlatmak için kullanılır.



{{- range (index $.Site.Data "theme-colors") }}
{{ .name | title }}
{{- end -}}
Bağlantı
:::info

:::

### İkonlarla

Düğmenizi, [CoreUI İkonları](https://icons.coreui.io/) ile birleştirebilirsiniz.



{{- range (index $.Site.Data "theme-colors") }}
 {{ .name | title }}
{{- end -}}
Bağlantı
## Metin sarmalamayı devre dışı bırakma

Düğme metninin sarmalanmasını istemiyorsanız, düğmeye `.text-nowrap` sınıfını ekleyebilirsiniz. Sass'ta, her düğme için metin sarmalamayı devre dışı bırakmak üzere `$btn-white-space: nowrap` ayarlayabilirsiniz.

## Düğme etiketleri

`.btn` sınıfları, ``, `` veya `` öğeleri için tasarlanmıştır (bazı tarayıcılar farklı bir biçimlendirme uygulayabilir).

Eğer `` öğelerinde işlevselliği tetiklemek için kullanılan `.btn` sınıflarını kullanıyorsanız, bu bağlantılara `role="button"` verilmeli, böylece ekran okuyucular gibi yardımcı teknolojilere anlamlarını uygun bir şekilde iletebilir.


Bağlantı
Düğme



## Kontur düğmeleri

Bir düğmeye ihtiyaç duyuyorsanız ancak güçlü arka plan renkleri istemiyorsanız, varsayılan modifier sınıflarını `.btn-outline-*` olanlarla değiştirerek `.btn` sınıfına sahip herhangi bir öğede tüm arka plan renklerini kaldırın.



{{- range (index $.Site.Data "theme-colors") }}
{{ .name | title }}
{{- end -}}

:::info
Bazı düğme stilleri, nispeten açık bir ön plan rengi kullanır ve yeterli kontrast elde etmek için yalnızca karanlık bir arka planda kullanılmalıdır.
:::

## Hayalet düğmeleri

Hayalet düğmeler için `.btn-ghost-*` sınıfını kullanın.



{{- range (index $.Site.Data "theme-colors") }}
{{ .name | title }}
{{- end -}}

## Boyutlar

Büyütülmüş veya küçültülmüş düğmeler mi? Ek boyutlar için `.btn-lg` veya `.btn-sm` ekleyin.


Büyük düğme
Büyük düğme

Küçük düğme
Küçük düğme
CSS değişkenleri ile kendi özel boyutlandırmanızı bile oluşturabilirsiniz:

  Özel düğme

## Şekiller

### Yastık düğmeleri



{{- range (index $.Site.Data "theme-colors") }}
{{ .name | title }}
{{- end -}}



### Kare düğmeler



{{- range (index $.Site.Data "theme-colors") }}
{{ .name | title }}
{{- end -}}

## Devre dışı durum

Herhangi bir `` öğesine `disabled` boolean niteliğini ekleyerek düğmeleri etkin görünmemesi için ayarlayabilirsiniz. Devre dışı bırakılmış düğmelere `pointer-events: none` uygulanır, bu da üzerine gelme ve etkin durumların tetiklenmesini engeller.


Temel düğme
Düğme
`` ile devre dışı bırakılan düğmeler biraz farklı davranır:

`` etiketleri `disabled` niteliğini desteklemez, bu nedenle düğmeleri etkin görünmemesi için `.disabled` sınıfını eklemeniz gerekir. Devre dışı bırakılmış bootstrap düğmesinin, yardımcı teknolojilere elementin durumunu gösterebilmek için `aria-disabled="true"` niteliğine sahip olması gerekir.


Temel bağlantı
Bağlantı
### Bağlantı işlevselliği uyarısı

Devre dışı bir bağlantıda `href` niteliğini korumanız gerektiği durumları kapsamak için, `.disabled` sınıfı `` etiketlerinin bağlantı işlevselliğini devre dışı bırakmaya çalışmak için `pointer-events: none` kullanır. Bu CSS özelliğinin HTML için henüz standartlaşmadığını fakat tüm modern tarayıcıların bunu desteklediğini unutmayın. Ayrıca, `pointer-events: none` destekleyen tarayıcılarda bile, klavye navigasyonu etkilenmez; bu da gören klavye kullanıcılarının ve yardımcı teknolojilerin bu bağlantıları hâlâ etkinleştirebileceği anlamına gelir. Bu nedenle, `aria-disabled="true"` eklemenin yanı sıra, bu bağlantılarda anahtar odak almasını engellemek için `tabindex="-1"` niteliğini de eklemek ve işlevselliğini tamamen devre dışı bırakmak için özel JavaScript kullanmanız önerilir.


Temel bağlantı
Bağlantı
## Blok düğmeleri

Tam genişliğe yayılacak düğmeler oluşturun—kullanım talimatlarıyla.

  Düğme
  Düğme

Burada, `md` kırılma noktasında `.d-md-block` sınıfının `.d-grid` sınıfını değiştirdiği, böylece `gap-2` yardımcı sınıfını etkisiz hale getirdiği, dikey olarak üst üste yığılmış düğmelerden başlayarak yanıt veren bir varyasyon oluşturuyoruz. Tarayıcınızı yeniden boyutlandırarak değişiklikleri görebilirsiniz.

  Düğme
  Düğme

Düğmeleri yatay konumda ayarlamak için ek yardımcı sınıflar kullanılabilir. Daha önceki yanıt veren örneğimizi aldık ve düğmeleri artık yığılmadıklarında sağa hizalamak için bazı esnek yardımcı sınıflar ve bir marj yardımcı sınıfı ekledik.

  Düğme
  Düğme

## Düğme eklentisi

Düğme eklentisi, basit açma/kapama düğmeleri oluşturmanıza olanak tanır.

:::info
Görsel olarak, bu açma/kapama düğmeleri, `onay kutusu açma düğmeleri` ile aynıdır. Ancak, yardımcı teknolojiler tarafından farklı bir şekilde iletilir: onay kutuları "işaretli"/"işaretli değil" olarak ekran okuyucular tarafından duyurulurken (görünümüne rağmen, temelde hala onay kutularıdır), bu açma/kapama düğmeleri "düğme"/"düğmeye basıldı" olarak duyurulacaktır. Bu iki yaklaşım arasındaki seçim, oluşturduğunuz açma/kapama türüne ve açma/kapamanın ekran okuyucusu olarak onay kutusu ya da gerçek bir düğme olarak duyurulmasının mantıklı olup olmayacağına bağlıdır.
:::

### Açma kapama durumları

Bir düğmenin `aktif` durumunu açıp kapatmak için `data-coreui-toggle="button"` ekleyin. Eğer bir düğmeyi önceden açıyorsanız, `.active` sınıfını **ve** `` etiketine `aria-pressed="true"` eklemeniz gerekir.

  Açma/kapama düğmesi
  Aktif açma/kapama düğmesi
  Devre dışı bırakılmış açma/kapama düğmesi


  Açma/kapama düğmesi
  Aktif açma/kapama düğmesi
  Devre dışı bırakılmış açma/kapama düğmesi

  Açma/kapama bağlantısı
  Aktif açma/kapama bağlantısı
  Devre dışı bırakılmış açma/kapama bağlantısı


  Açma/kapama bağlantısı
  Aktif açma/kapama bağlantısı
  Devre dışı bırakılmış açma/kapama bağlantısı

### Yöntemler

Düğme oluşturucusu ile bir düğme örneği oluşturabilirsiniz, örneğin:

```js
const bsButton = new coreui.Button('#myButton')
```


| Yöntem | Açıklama |
| --- | --- |
| `toggle` | Basma durumunu açar/kapatır. Düğmenin aktif olmuş gibi görünmesini sağlar. |
| `dispose` | Bir elementin düğmesini yok eder. (DOM elementindeki saklanmış verileri kaldırır) |
| `getInstance` | Bir DOM elementi ile ilişkili düğme örneğini almanızı sağlayan statik bir yöntemdir. Bunu şöyle kullanabilirsiniz: `coreui.Button.getInstance(element)` |
| `getOrCreateInstance` | Bir DOM elementi ile ilişkili bir düğme örneği döndüren ya da önceden başlatılmamışsa yeni bir tane oluşturan statik bir yöntemdir. Bunu şöyle kullanabilirsiniz: `coreui.Button.getOrCreateInstance(element)` |
Örneğin, tüm düğmeleri açıp kapatmak için

```js
document.querySelectorAll('.btn').forEach(buttonElement => {
  const button = coreui.Button.getOrCreateInstance(buttonElement)
  button.toggle()
})
```

## Özelleştirme

### CSS değişkenleri

Düğmeler, anlık özelleştirme için `.btn` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenlerinin değerleri Sass aracılığıyla ayarlanır, dolayısıyla Sass özelleştirmesi de hala desteklenmektedir.

Her `.btn-*` modifier sınıfı, ek CSS kurallarını en aza indirmek için ilgili CSS değişkenlerini günceller ve `button-variant()`, `button-outline-variant()` ve `button-size()` mixin'lerimizle birlikte gelir.

CoreUI'nin belgeleri için benzersiz olan düğmelerin CSS değişkenlerini yeniden atayarak, kendi `.btn-*` modifier sınıfınızı oluşturmak için bir örnek:


  Özel düğme


### SASS değişkenleri

### SASS çeşitleri

CoreUI, varyant renklerini iki şekilde tanımlamanıza olanak tanır.

#### Manuel

Her rengi manuel olarak tanımlayabilir ve bileşenin görünümünde tam kontrol sahibi olabilirsiniz.


$button-variants: (
  "primary": (
    "background": $your-bg-color,
    "border": $your-border-color,
    "color": $your-color,
    "hover-background": $your-bg-hover-color,
    "hover-border": $your-hover-border-color,
    "hover-color": $your-hover-color,
    "active-background": $your-bg-active-color,
    "active-border": $your-active-border-color,
    "active-color": $your-active-color,
    "disabled-background": $your-bg-disabled-color,
    "disabled-border": $your-disabled-border-color,
    "disabled-color": $your-disabled-color,
    "shadow": $your-shadow
  )
  ...
);
#### Renk fonksiyonu

Renk seti, `button-color-map` fonksiyonu sayesinde otomatik olarak oluşturulabilir.


$button-variants: (
  "primary": btn-color-map($primary),
  ...
);
### SASS mixin'leri

CoreUI'nin düğme bileşeni, bir temel-modifier sınıf yaklaşımı ile inşa edilmiştir. Bu, stilin çoğunun bir temel `.btn` sınıfına ait olduğu, stil varyasyonlarının modifier sınıflarına (örn. `.btn-danger`) sıkıştırıldığı anlamına gelir. Bu modifier sınıfları, `$button-variants` haritasından oluşturularak özelleştirilebilir sınıf sayısını ve adını ayarlamak için kullanılır.

Düğmeler için üç mixin vardır: düğme ve düğme dışı çeşit mixin'leri ile birlikte bir düğme boyut mixin'i.

### SASS döngüleri

Düğme çeşitleri (normal ve dış çizgili düğmeler) ilgili mixin'leri ile birlikte `$theme-colors` haritasını kullanarak `scss/_buttons.scss`'de modifier sınıflarını oluşturur.

