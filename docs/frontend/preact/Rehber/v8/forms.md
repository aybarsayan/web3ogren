---
description: Preact'teki formlar, React formlarına benzer şekilde çalışır ancak bazı farklılıklar içerir. Bu rehber, kontrollü ve kontrolsüz bileşenler ile onay kutuları ve radyo düğmeleri hakkında önemli bilgileri sunar.
keywords: [Preact, formlar, kontrollü bileşenler, kontrolsüz bileşenler, onay kutuları, radyo düğmeleri, React]
---

# Formlar

Preact'teki formlar, React'teki formlar gibi çalışır, tek fark, "statik" (ilk değer) props/atribütleri için destek olmamasıdır.

**[React Form Belgesi](https://reactjs.org/docs/forms.html)**

---



---

## Kontrol Edilen ve Kontrol Edilmeyen Bileşenler

React'ın ["Kontrol Edilen" Bileşenler](https://reactjs.org/docs/forms.html#controlled-components) ve ["Kontrol Edilmeyen" Bileşenler](https://reactjs.org/docs/uncontrolled-components.html) üzerine belgeleri, çift yönlü veri akışına sahip HTML formlarını, genellikle tek yönlü veri akışına sahip Bir Bileşen Tabanlı Sanal DOM oluşturucusu bağlamında nasıl kullanacağınızı anlamak için son derece faydalıdır.

:::tip
Genel olarak, her zaman _Kontrol Edilen_ Bileşenleri kullanmaya çalışmalısınız. 
:::

Ancak, bağımsız Bileşenler oluştururken veya üçüncü taraf UI kütüphanelerini sarmalarken, bileşeninizi Preact işlevselliği olmayan bir montaj noktası olarak kullanmak da faydalı olabilir. Bu durumlarda, "Kontrol Edilmeyen" Bileşenler bu görev için oldukça uygundur.

## Onay Kutuları ve Radyo Düğmeleri

Onay kutuları ve radyo düğmeleri (``), kontrol edilen formlar oluştururken başlangıçta kafa karışıklığına neden olabilir. Bunun nedeni, kontrol edilmeyen bir ortamda genellikle tarayıcının bir onay kutusunu veya radyo düğmesini "değiştirmesine" veya "işaretlemesine" izin vermemizdir; bir değişim olayı dinleyip yeni değere tepki veririz. Ancak, bu teknik, UI'nın durum ve prop değişikliklerine otomatik olarak yanıt olarak her zaman güncellendiği bir dünya görüşüne iyi geçiş yapmaz.

> **Aşama Aşama:** 
> 
> Bir onay kutusunda kullanıcı tarafından işaretlendiğinde veya işaretlenmediğinde tetiklenen bir "değişiklik" olayını dinlediğimizi varsayalım. 
> Değişiklik olayı işleyicimizde, onay kutusundan alınan yeni değeri `state` içinde bir değere ayarlıyoruz. Bunu yaptığımızda, bileşenimizin yeniden oluşturulmasını tetikleyerek, onay kutusunun değerini durumdan aldığımız değere yeniden atarız. Bu gereksizdir, çünkü DOM'dan bir değeri istedik ama sonra istediğimiz değere sahip olacak şekilde tekrar oluşturması için ona söyledik.
> 
> — Geliştirici

Bu nedenle, bir `değişiklik` olayı dinlemek yerine, kullanıcı onay kutusuna _veya ilişkili bir ``_ üzerine her tıkladığında tetiklenen bir `tıklama` olayını dinlemeliyiz. Onay kutuları sadece Boolean `true` ve `false` arasında geçiş yapar; bu yüzden onay kutusuna veya etikete tıkladığımızda, durumumuzda sahip olduğumuz değeri tersine çeviririz ve bu bir yeniden oluşturma tetikler; onay kutusunun görüntülenen değeri istediğimiz değere ayarlanır.

### Onay Kutusu Örneği

```js
class MyForm extends Component {
    toggle = e => {
        let checked = !this.state.checked;
        this.setState({ checked });
    };
    render({ }, { checked }) {
        return (
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onClick={this.toggle} />
            </label>
        );
    }
}