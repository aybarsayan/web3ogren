---
description: Bootstrap uyarıları, kullanıcı işlemleri için bağlamsal geri bildirim sağlar. Çeşitli uyarı mesajları sunar ve kullanılabilirliği artırır.
keywords: [Bootstrap, uyarılar, kullanıcı deneyimi, JavaScript, HTML, özelleştirme]
---

## Örnekler

Bootstrap uyarısı, her uzunluktaki metne ve isteğe bağlı bir kapatma butonuna uygundur. Stil için, **gereken** bağlamsal sınıflardan birini kullanın (örneğin, `.alert-success`). Satır içi kapama için `alerts JavaScript eklentisini` kullanın.



{{- range (index $.Site.Data "theme-colors") }}

  Basit bir {{ .name }} uyarısı—kontrol et!
{{- end -}}

:::info
Uyarılar, kullanıcıya önemli bilgiler iletmek ve etkileşimi geliştirmek için sıkça kullanılır.
:::

### Canlı örnek

Aşağıdaki butona tıklayarak bir uyarı gösterin (başlangıçta satır içi stillerle gizlenmiş durumda), ardından yerleşik kapatma butonuyla kapatın.

Canlı uyarıyı göster
Canlı uyarı demomuzu tetiklemek için aşağıdaki JavaScript'i kullanıyoruz:

### Bağlantı rengi

Herhangi bir uyarı içinde eşleşen renkli bağlantılar vermek için `.alert-link` yardımcı sınıfını kullanın.



{{- range (index $.Site.Data "theme-colors") }}

  Bir örnek bağlantıya sahip basit bir {{ .name }} uyarısı örnek bağlantı. Eğer isterseniz ona tıklayın.
{{ end -}}

:::tip
Uyarı mesajlarında renk uyumu sağlamak, kullanıcı deneyimini artırabilir.
:::

### Ekstra içerik

Uyarı, başlık, paragraf ve ayırıcı gibi ek HTML elemanlarını da içerebilir.

  Aferin!
  Aww evet, bu önemli uyarı mesajını başarıyla okudunuz. Bu örnek metni biraz daha uzun tutacak ki, bu tür bir içerikle bir uyarının nasıl çalıştığını görebilesiniz.
  
  Ne zaman ihtiyaç duyarsanız, her şeyin düzgün ve düzenli kalması için margin yardımcılarını kullanmayı unutmayın.

### İkonlar

Benzer şekilde, `flexbox yardımcıları` ve `Bootstrap İkonları` kullanarak ikonlarla uyarılar oluşturabilirsiniz. İkonlarınıza ve içeriğinize bağlı olarak, daha fazla yardımcı veya özel stil eklemek isteyebilirsiniz.

  
    
  
  
    Bir simgeye sahip örnek uyarı
  

Uyarılarınız için birden fazla simgeye mi ihtiyacınız var? Bootstrap İkonlarını daha fazla kullanmayı ve aynı simgeleri tekrar tekrar kolayca referans almak için yerel bir SVG sprite oluşturmayı düşünün.

  
    
  
  
    
  
  
    
  



  
  
    Bir simgeye sahip örnek uyarı
  


  
  
    Bir simgeye sahip örnek başarı uyarısı
  


  
  
    Bir simgeye sahip örnek uyarı
  


  
  
    Bir simgeye sahip örnek tehlike uyarısı
  

### Kapatma

JavaScript eklentisini kullanarak, herhangi bir uyarıyı kaldırmak mümkündür.

- Bootstrap uyarı eklentisini veya derlenmiş CoreUI JavaScript'ini yüklediğinizden emin olun.
- Bir kapatma butonu ekleyin ve `.alert-dismissible` sınıfını ekleyin, bu, uyarı bileşeninin sağında ekstra bir dolgu ekler ve `.close` butonunu konumlandırır.
- Kapatma butonuna `data-coreui-dismiss="alert"` niteliğini ekleyin, bu, JavaScript işlevselliğini tetikler. Doğru davranış için `` öğesini kullanmanız gerekmektedir.
- Uyarıları kapatırken animasyon eklemek için `.fade` ve `.show` sınıflarını eklemeniz gerekir.

Bunu canlı bir demo ile görebilirsiniz:

  Kutsal avokado! Aşağıdaki alanlardan bazılarına dikkat etmelisiniz.
  

:::warning
Bir uyarı kapatıldığında, öge sayfa yapısından tamamen kaldırılır. Eğer bir klavye kullanıcısı kapatma butonunu kullanarak uyarıyı kapatırsa, dikkatlerini kaybedecekler ve tarayıcıya bağlı olarak, sayfanın/dokümanın başlangıcına sıfırlanacaktır.
:::

## JavaScript davranışı

### Başlatma

Elemanları uyarılar olarak başlatma

```js
const alertList = document.querySelectorAll('.alert')
const alerts = [...alertList].map(element => new coreui.Alert(element))
```

:::info
Bir uyarıyı kapatmak için, bileşeni manuel olarak JS API aracılığıyla başlatmanıza gerek yoktur. `data-coreui-dismiss="alert"` kullanarak, bileşen otomatik olarak başlatılacak ve düzgün bir şekilde kapatılacaktır.
:::

### Tetikleyiciler

{{% js-dismiss "alert" %}}

**Bir uyarıyı kapatmanın, onu DOM'dan kaldıracağını unutmayın.**

### Yöntemler

Uyarı oluşturucusu ile bir uyarı örneği oluşturabilirsiniz, örneğin:

```js
const cAlert = new coreui.Alert('#myAlert')
```

Bu, uyarıyı `data-coreui-dismiss="alert"` niteliğine sahip alt elemanlar üzerindeki tıklama olaylarını dinleyecek şekilde ayarlar. (Otomatik başlatma kullanıldığında gerekli değildir.)


| Yöntem | Açıklama |
| --- | --- |
| `close` | Uyarıyı DOM'dan kaldırarak kapatır. Eğer elemanda `.fade` ve `.show` sınıfları varsa, uyarı kaldırılmadan önce belirsizleşecektir. |
| `dispose` | Bir elemanın uyarısını yok eder. (DOM elemanındaki saklanan verileri kaldırır) |
| `getInstance` | Bir DOM elemanına bağlı uyarı örneğini almanızı sağlayan statik yöntem. Örneğin: `coreui.Alert.getInstance(alert)`. |
| `getOrCreateInstance` | Bir DOM elemanına bağlı uyarı örneğini döndüren veya başlatılmamışsa yeni bir tane oluşturan statik yöntem. Bunu böyle kullanabilirsiniz: `coreui.Alert.getOrCreateInstance(element)`. |
Temel kullanım:

```js
const alert = coreui.Alert.getOrCreateInstance('#myAlert')
alert.close()
```

### Olaylar

CoreUI Bootstrap'ın uyarı eklentisi, uyarı işlevselliğine bağlanmak için birkaç olayı açığa çıkarır.


| Olay | Açıklama |
| --- | --- |
| `close.coreui.alert` | `close` örnek yönteminin çağrıldığında hemen tetiklenir. |
| `closed.coreui.alert` | Uyarı kapatıldığında ve CSS geçişleri tamamlandığında tetiklenir. |
```js
const myAlert = document.getElementById('myAlert')
myAlert.addEventListener('closed.coreui.alert', event => {
  // bir şey yap, örneğin, en uygun öğeye odağı programlı olarak taşımak,
  // böylece kaybolmaz/sıfırlanmaz
  // document.getElementById('...').focus()
})
```

## Özelleştirme

### CSS değişkenleri

Uyarılar, gerçek zamanlı özelleştirmeyi artırmak için `.alert` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenleri için değerler Sass aracılığıyla ayarlanır, bu nedenle Sass özelleştirmesi hala desteklenmektedir.

### SASS değişkenleri

### SASS karışımı

Uyarılarımız için bağlamsal modifiye sınıflarını oluşturmak üzere `$alert-variants` ile birlikte kullanılır.

### SASS döngüsü

`alert-variant()` karışımını kullanarak modifiye sınıflarını üreten döngü.

