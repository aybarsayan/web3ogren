---
title: Bileşenler ve Kancalar Saf Olmalıdır
seoTitle: Bileşenler ve Kancalar Saf Olmanın Önemi
sidebar_position: 1
description: Bu doküman, saf bileşenlerin ve kancaların React içindeki önemini, yan etkilerin nasıl yönetileceğini, ve immutability prensiplerini keşfeder.
tags: 
  - React
  - Bileşenler
  - Kancalar
  - Saflık
keywords: 
  - React
  - Bileşenler
  - Kancalar
  - Saflık
  - İmmutability
---
Saf fonksiyonlar yalnızca bir hesaplama yapar ve başka bir şey yapmaz. Bu, kodunuzu anlamayı, hata ayıklamayı kolaylaştırır ve React'ın bileşenlerinizi ve Kancalarınızı otomatik olarak doğru bir şekilde optimize etmesine olanak tanır.



Bu referans sayfası ileri düzey konuları kapsar ve `Bileşenleri Saf Tutma` sayfasında ele alınan kavramlara aşina olmanızı gerektirir.




### Saflık neden önemlidir? {/*why-does-purity-matter*/}

React'ı _React_ yapan temel kavramlardan biri _saflıktır_. Saf bir bileşen veya kanca, aşağıdakileri sağlar:

* **İdempotent** – Aynı girişlerle her seferinde `her zaman aynı sonucu alırsınız` – bileşen girişleri için props, state, context; kanca girişleri için ise argümanlar.
* **Render sırasında yan etkisi yoktur** – Yan etkileri olan kod `**rendering'den ayrı**` çalışmalıdır. Örneğin, bir `olay işleyici` olarak – kullanıcının UI ile etkileşimde bulunduğu ve bu etkileşimi güncellediği yer; veya bir `Etkileşim` olarak – render sonrası çalışan bir kod.
* **Yerel olmayan değerleri değiştirmez**: Bileşenler ve Kancalar, render sırasında `yerel olarak oluşturulmamış değerleri asla değiştirmemelidir`.

Render saf tutulduğunda, React, güncellemelerin hangilerinin kullanıcının öncelikle görmesi gerekenler olduğunu anlamaya yardımcı olabilir. Bu, render saflığı sayesinde mümkündür: bileşenlerin render sırasında yan etkileri olmadığı için `render içinde`, React, güncellenmesi o kadar önemli olmayan bileşenlerin render işlemini durdurabilir ve yalnızca gerektiğinde onlara dönebilir.

Somut olarak, bu, renderleme mantığının birden fazla kez çalışabileceği anlamına gelir ve böylece React, kullanıcıya hoş bir deneyim sunabilir. Ancak bileşeninizin - gibi bir yan etkisi varsa, bir global değişkenin `render sırasında` değerini değiştirmek gibi - React, renderleme kodunuzu tekrar çalıştırdığında, yan etkileriniz isteneni karşılamayacak şekilde tetiklenecektir. Bu, genellikle kullanıcıların uygulamanızı deneyimleme şeklini kötüleştiren beklenmeyen hatalara yol açar. Bunun bir `örneğini Bileşenleri Saf Tutma sayfasında` görebilirsiniz.

#### React kodunuzu nasıl çalıştırır? {/*how-does-react-run-your-code*/}

React deklaratif bir yapıdadır: React'a _ne_ render edeceğinizi söylersiniz ve React, bunu kullanıcılarınıza _nasıl_ en iyi şekilde göstereceğini bulur. Bunu yapmak için, React'ın kodunuzu çalıştırdığı birkaç aşama vardır. React'ı iyi kullanmak için bu aşamaların hepsini bilmeniz gerekmez. Ancak, yüksek düzeyde, _render_ içinde ve dışında hangi kodun çalıştığı hakkında bilgi sahibi olmalısınız.

_Renderleme_, UI'nizin bir sonraki versiyonunun nasıl görüneceğini hesaplamayı ifade eder. Render sonrası, `Etkiler` _tamamlanır_ (bu, hiç kalmadıklarında çalıştıkları anlamına gelir) ve etkilerin yerleşim üzerinde etkisi varsa hesaplamayı güncelleyebilir. React, bu yeni hesaplamayı alır ve önceki UI sürümünü oluşturmak için kullanılan hesaplama ile karşılaştırır, ardından yalnızca [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) (kullanıcınızın gerçekten gördüğü şey) için en az gerekli değişiklikleri _taahhüt eder_.



#### Kodun render sırasında çalıştığını nasıl anlarız? {/*how-to-tell-if-code-runs-in-render*/}

Kodun render sırasında çalışıp çalışmadığını hızlıca belirlemenin bir yolu, nerede yazıldığına bakmaktır: eğer aşağıdaki örnekteki gibi üst düzeyde yazıyorsa, muhtemelen render sırasında çalışıyordur.

```js {2}
function Dropdown() {
  const selectedItems = new Set(); // render sırasında oluşturuldu
  // ...
}
```

Olay işleyicileri ve Etkiler render'de çalışmaz:

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  const onSelect = (item) => {
    // bu kod bir olay işleyicisinde, bu yüzden sadece kullanıcı bunu tetiklemeden çalışmaz
    selectedItems.add(item);
  }
}
```

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  useEffect(() => {
    // bu kod bir Efektin içinde, bu yüzden sadece render sonrası çalışır
    logForAnalytics(selectedItems);
  }, [selectedItems]);
}
```