---
description: 'Sinyaller otomatik render ile birleştirilebilir reaktif durum. Bu kılavuz, Preact halkasına entegre edilmiş sinyalleri kullanarak uygulama durumunu yönetmek için en iyi uygulamaları ve yöntemleri sunar.'
keywords: [sinyaller, reaktif durum, Preact, durum yönetimi, otomatik render]
---

# Sinyaller

Sinyaller, uygulama durumunu yönetmek için reaktif temel bileşenlerdir.

Sinyalleri benzersiz kılan, durum değişikliklerinin bileşenleri ve kullanıcı arayüzünü mümkün olan en verimli şekilde otomatik olarak güncellemeleridir. Otomatik durum bağlama ve bağımlılık izleme, sinyallerin *mükemmel ergonomi ve verimlilik* sağlamasını sağlarken, en yaygın durum yönetimi tuzaklarını ortadan kaldırır.

Sinyaller, herhangi bir boyuttaki uygulamalarda etkilidir; ergonomi, küçük uygulamaların gelişimini hızlandırırken, performans özellikleri, herhangi bir boyuttaki uygulamaların *varsayılan olarak hızlı* olmasını sağlar.

---

:::tip
**Önemli:** Bu kılavuz, Sinyalleri Preact'te kullanmayı inceleyecek ve her ne kadar bu, hem Core hem de React kütüphanelerine büyük ölçüde uygulanabilir olsa da, bazı kullanım farklılıkları olacaktır. Kullanımları için en iyi referanslar, ilgili belgelerindedir: [`@preact/signals-core`](https://github.com/preactjs/signals), [`@preact/signals-react`](https://github.com/preactjs/signals/tree/main/packages/react)
:::

---



---

## Giriş

JavaScript'teki durum yönetimi acısının büyük kısmı, bir değer için değişikliklere tepki vermekten kaynaklanır; çünkü değerler doğrudan gözlemlenemez. Çözümler genellikle bunu, değerleri bir değişkende depolayarak ve sürekli olarak değişip değişmediğini kontrol ederek aşar; bu da zahmetlidir ve performans açısından ideal değildir. İdeal olarak, değiştiğinde bize bildiren bir değer ifadesine sahip olmak isteriz. İşte sinyallerin yaptığı şey budur.

Temelde bir sinyal, bir değer tutan `.value` özelliğine sahip bir nesnedir. Bu önemli bir özelliğe sahiptir: bir sinyalin değeri değişebilir, ancak sinyalin kendisi her zaman aynı kalır:

```js
// --repl
import { signal } from "@preact/signals";

const count = signal(0);

// Bir sinyalin değerini .value ile okuyarak erişebilirsiniz:
console.log(count.value);   // 0

// Bir sinyalin değerini güncelleyin:
count.value += 1;

// Sinyalin değeri değişti:
console.log(count.value);  // 1
```

> **Anahtar Not:** Preact'te bir sinyal, bir ağaç boyunca props veya context olarak geçirildiğinde, yalnızca sinyale olan referansları geçiyoruz. Sinyal, bileşenlerin değerini değil, sinyali gördüğünden bileşenlerin yeniden render edilmeden güncellenebilir. Bu, tüm maliyetli render işlemlerini atlamamıza ve sinyalin `.value` özelliğine gerçekten erişen ağaçtaki bileşenlere hemen atlamamıza olanak tanır.

Sinyallerin ikinci önemli özelliği, değerlerinin ne zaman erişildiğini ve ne zaman güncellendiğini izlemeleridir. Preact'te, bir bileşenden bir sinyalin `.value` özelliğine erişmek, o sinyalin değeri değiştiğinde bileşeni otomatik olarak yeniden render eder.

```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal } from "@preact/signals";

// Abone olunabilecek bir sinyal oluşturun:
const count = signal(0);

function Counter() {
  // Bir bileşende .value'a erişmek, değiştiğinde otomatik olarak yeniden render eder:
  const value = count.value;

  const increment = () => {
    // Bir sinyal, `.value` özelliğine atama yapılarak güncellenir:
    count.value++;
  }

  return (
    <div>
      <p>Sayım: {value}</p>
      <button onClick={increment}>tıkla</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

Son olarak, Sinyaller, en iyi performans ve ergonomi sağlamak için Preact'e derinlemesine entegre edilmiştir. Yukarıdaki örnekte, `count.value`'a erişerek `count` sinyalinin mevcut değerini elde ettik; ancak bu gereksizdir. Bunun yerine, Preact'in tüm işi bizim yerimize yapmasına olanak tanıyarak JSX'te doğrudan `count` sinyalini kullanabiliriz:

```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal } from "@preact/signals";

const count = signal(0);

function Counter() {
  return (
    <div>
      <p>Sayım: {count}</p>
      <button onClick={() => count.value++}>tıkla</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

---

## Kurulum

Sinyalleri, projenize `@preact/signals` paketini ekleyerek kurabilirsiniz:

```sh
npm install @preact/signals
```

Bir paket yöneticisi aracılığıyla kurulduğunda, uygulamanızda bunu içe aktarmaya hazırsınız.

---

## Kullanım Örneği

Gerçek bir senaryoda sinyalleri kullanalım. Bir todo listesi uygulaması oluşturacağız; burada bir listeye öğe ekleyebilir ve öğeleri çıkarabilirsiniz. Öncelikle durumu modellemeye başlayacağız. Öncelikle bir todo listesini tutacak bir sinyal oluşturmamız gerekecek; bunu bir `Array` ile temsil edebiliriz:

```jsx
import { signal } from "@preact/signals";

const todos = signal([
  { text: "Market alışverişi yap" },
  { text: "Köpeği gezdir" },
]);
```

Kullanıcının yeni bir todo öğesi için metin girmesine izin vermek üzere, kısa zamanda bir `` öğesine bağlayacağımız bir sinyal daha gerekecek. Şimdilik, bu sinyali, todo listemize bir öğe ekleyen bir fonksiyon oluşturmak için zaten kullanabiliriz. Unutmayın, bir sinyalin değerini `.value` özelliğine atama yaparak güncelleyebiliriz:

```jsx
// Bunu ileride girişimiz için kullanacağız
const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = ""; // Eklemeden önce giriş değerini temizle
}
```

> :bulb: İpucu: Bir sinyal yalnızca yeni bir değer atandığında güncellenir. Bir sinyale atadığınız değer, mevcut değerine eşitse, güncellenmez.
>
> ```js
> const count = signal(0);
>
> count.value = 0; // hiçbir şey yapmaz - değer zaten 0
>
> count.value = 1; // günceller - değer farklı
> ```

Şu ana kadar mantığımızın doğru olup olmadığını kontrol edelim. `text` sinyalini güncellediğimizde ve `addTodo()` fonksiyonunu çağırdığımızda, `todos` sinyaline yeni bir öğe eklenmesi gerektiğini görmeliyiz. Kullanıcı arayüzüne ihtiyaç duymadan bu senaryoyu doğrudan bu fonksiyonları çağırarak simüle edebiliriz!

```jsx
// --repl
import { signal } from "@preact/signals";

const todos = signal([
  { text: "Market alışverişi yap" },
  { text: "Köpeği gezdir" },
]);

const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = ""; // Eklemeden önce giriş değerini sıfırla
}

// Mantığımızın çalışıp çalışmadığını kontrol et
console.log(todos.value);
// Loglar: [{text: "Market alışverişi yap"}, {text: "Köpeği gezdir"}]

// Yeni bir todo eklemeyi simüle et
text.value = "Ortamı temizle";
addTodo();

// Yeni öğenin eklendiğini ve `text` sinyalinin temizlendiğini kontrol et:
console.log(todos.value);
// Loglar: [{text: "Market alışverişi yap"}, {text: "Köpeği gezdir"}, {text: "Ortamı temizle"}]

console.log(text.value);  // Loglar: ""
```

Listeden bir todo öğesini çıkarma yeteneği eklemek istediğimiz son özellik. Bunun için, todo dizisinden belirli bir öğeyi silen bir fonksiyon ekleyeceğiz:

```jsx
function removeTodo(todo) {
  todos.value = todos.value.filter(t => t !== todo);
}
```

---

## Arayüzü Oluşturma

Artık uygulamamızın durumunu modellediğimize göre, kullanıcıların etkileşimde bulunabileceği güzel bir UI ile bunu bağlama zamanı.

```jsx
function TodoList() {
  const onInput = event => (text.value = event.currentTarget.value);

  return (
    <>
      <input value={text.value} onInput={onInput} />
      <button onClick={addTodo}>Ekle</button>
      <ul>
        {todos.value.map(todo => (
          <li>
            {todo.text}{' '}
            <button onClick={() => removeTodo(todo)}>❌</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

Ve bu şekilde tamamen çalışan bir todo uygulamamız var! Tam uygulamayı `buradan` deneyebilirsiniz :tada:

---

## Hesaplanmış sinyaller aracılığıyla durumu türetme

Todo uygulamamıza bir özellik daha ekleyelim: her todo öğesi tamamlandığında işaretlenebilir ve kullanıcıya tamamlanan öğelerin sayısını göstereceğiz. Bunu yapmak için, diğer sinyallerin değerlerine dayalı olarak yeni bir sinyal oluşturmayı sağlayan `computed(fn)` fonksiyonunu içe aktaracağız. Döndürülen hesaplanan sinyal yalnızca okunabilir ve geri çağırma fonksiyonundan erişilen herhangi bir sinyal değiştiğinde otomatik olarak güncellenir.

```jsx
// --repl
import { signal, computed } from "@preact/signals";

const todos = signal([
  { text: "Market alışverişi yap", completed: true },
  { text: "Köpeği gezdir", completed: false },
]);

// Diğer sinyallerden türetilen bir sinyal oluştur
const completed = computed(() => {
  // `todos` değiştiğinde bu otomatik olarak yeniden çalışır:
  return todos.value.filter(todo => todo.completed).length;
});

// Loglar: 1, çünkü bir todo tamamlanmış olarak işaretlenmiştir
console.log(completed.value);
```

Basit todo listesi uygulamamızın çok fazla hesaplanan sinyal gerektirmediği doğrudur; ancak daha karmaşık uygulamalar genellikle birden fazla yerde durumu kopyalamamak için `computed()`'a dayanır.

> :bulb: İpucu: Mümkün olduğunca fazla durumu türetmek, durumunuzun her zaman tek bir gerçek kaynak bulundurmasını sağlar. Bu, uygulama mantığında daha sonra bir hata oluştuğunda hata ayıklamayı oldukça kolaylaştırır; çünkü endişelenmeniz gereken daha az yer vardır.

---

## Küresel uygulama durumunu yönetme

Şu ana kadar sinyalleri bileşen ağacının dışında oluşturduk. Bu, bir todo listesi gibi küçük bir uygulama için yeterli, ancak daha büyük ve daha karmaşık uygulamalar için test etmeyi zorlaştırabilir. Testler genellikle bazı senaryoları yeniden üretmek için uygulama durumundaki değerleri değiştirmeyi içerir; ardından bu durumu bileşenlere geçirir ve render edilmiş HTML üzerinde doğrulama yaparız. Bunu yapmak için, todo listesi durumumuzu bir fonksiyona çıkarabiliriz:

```jsx
function createAppState() {
  const todos = signal([]);

  const completed = computed(() => {
    return todos.value.filter(todo => todo.completed).length
  });

  return { todos, completed }
}
```

> :bulb: İpucu: Burada `addTodo()` ve `removeTodo(todo)` fonksiyonlarını bilinçli olarak dahil etmediğimize dikkat edin. Verileri, onu değiştiren fonksiyonlardan ayırmak, uygulama mimarisini düzenlemeye yardımcı olabilir. Daha fazla ayrıntı için [veri odaklı tasarımı](https://en.wikipedia.org/wiki/Data-oriented_design) inceleyebilirsiniz.

Artık todo uygulama durumumuzu render ederken bir prop olarak geçirebiliriz:

```jsx
const state = createAppState();

// ...daha sonra:
<TodoList state={state} />
```

Bu, todo listesi uygulamamızda işe yarar çünkü durum küreseldir, ancak daha büyük uygulamalar genellikle aynı durum parçalarına erişmesi gereken birden fazla bileşenle sonuçlanır. Bu, genellikle "durumu yukarı kaldırmayı" gerektirir; yani durumu ortak bir üst bileşene taşımak. Her bileşen aracılığıyla durumu manuel olarak geçirmek yerine, durum `Context` içine yerleştirilebilir; böylece ağacın içindeki herhangi bir bileşen buna erişebilir. İşte bunun tipik bir örneği:

```jsx
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { createAppState } from "./my-app-state";

const AppState = createContext();

render(
  <AppState.Provider value={createAppState()}>
    <App />
  </AppState.Provider>
);

// ...daha sonra uygulama durumunuza erişmeniz gerektiğinde
function App() {
  const state = useContext(AppState);
  return <p>{state.completed}</p>;
}
```

Context'in nasıl çalıştığını daha fazla öğrenmek isterseniz, `Context belgelerine` göz atın.

---

## Sinyallerle yerel durum

Uygulama durumunun çoğu, genellikle props ve context aracılığıyla geçilmektedir. Ancak, bileşenlerin yalnızca o bileşene özel kendi iç durumlarına sahip olduğu birçok senaryo vardır. Bu durumun uygulamanın küresel iş mantığının bir parçası olarak yaşaması gerekmemektedir; bunun yerine yalnızca ihtiyaç duyan bileşene özgü olmalıdır. Bu senaryolarda, bileşenler içinde `useSignal()` ve `useComputed()` hook'larını kullanarak sinyaller ve hesaplanan sinyaller oluşturabiliriz:

```jsx
import { useSignal, useComputed } from "@preact/signals";

function Counter() {
  const count = useSignal(0);
  const double = useComputed(() => count.value * 2);

  return (
    <div>
      <p>{count} x 2 = {double}</p>
      <button onClick={() => count.value++}>tıkla</button>
    </div>
  );
}
```

Bu iki hook, bir bileşen ilk çalıştığında bir sinyal oluşturmak için `signal()` ve `computed()` etrafında ince bir sarmalayıcıdır; ve sonraki render işlemlerinde yalnızca o sinyal kullanılmaktadır.

> :bulb: Arka planda, bu uygulama:
>
> ```js
> function useSignal(value) {
>  return useMemo(() => signal(value), []);
> }
> ```

---

## Gelişmiş sinyal kullanımı

Şu ana kadar ele aldığımız konular, başlamanız için ihtiyaç duyduğunuz her şeyi kapsamaktadır. Aşağıdaki bölüm, uygulama durumunuzu tamamen sinyaller kullanarak modellemek isteyen okuyucular içindir.

### Bileşenlerin dışında sinyallere tepki verme

Sinyaller ile bileşen ağacının dışında çalışırken, hesaplanan sinyallerin değeri, aktif olarak okunmadıkça yeniden hesaplanmadığını fark etmiş olabilirsiniz. Bunun nedeni, sinyallerin varsayılan olarak tembel olmasıdır: sadece değerleri erişildiğinde yeni değerler hesaplar.

```js
const count = signal(0);
const double = computed(() => count.value * 2);

// `double` sinyalinin bağlı olduğu `count` sinyalini güncellemesine rağmen,
// `double` henüz güncellenmez; çünkü değeri kullanılmamıştır.
count.value = 1;

// `double` değerinin okunması, yeniden hesaplanmasını tetikler:
console.log(double.value); // Loglar: 2
```

Bu, bir soru doğurur: bileşen ağacının dışında sinyallere nasıl abone olabiliriz? Belki de bir sinyalin değeri değiştiğinde konsola bir şeyler kaydetmek veya durumu [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) ile kalıcı hale getirmek istiyoruz.

Sinyal değişikliklerine yanıt olarak rastgele kod çalıştırmak için `effect(fn)` kullanabiliriz. Hesaplanan sinyallerle benzer şekilde, etkiler hangi sinyallerin erişildiğini izler ve o sinyaller değiştiğinde geri dönüş fonksiyonunu yeniden çalıştırır. Hesaplanan sinyallerin aksine, `effect()` bir sinyal döndürmez - değişimlerin bir dizisinin sonudur.

```js
import { signal, computed, effect } from "@preact/signals";

const name = signal("Jane");
const surname = signal("Doe");
const fullName = computed(() => `${name.value} ${surname.value}`);

// Her değiştiğinde adı kaydeder:
effect(() => console.log(fullName.value));
// Loglar: "Jane Doe"

// `name` güncellenmesi `fullName`'i güncelleyerek etkinliği tekrar tetikler:
name.value = "John";
// Loglar: "John Doe"
```

Geri dönüş fonksiyonunuzdan bir temizlik işlevi döndürerek, bir güncelleme gerçekleşmeden önce yan etkiyi "temizleyebilir" ve sonraki geri dönüş tetiklendiğinde herhangi bir durumu sıfırlayabilirsiniz.

```js
effect(() => {
  Chat.connect(username.value)

  return () => Chat.disconnect(username.value)
})
```

Etkide kullanılan tüm sinyallere abone olmayı iptal etmek ve etkisini yok etmek için geri dönüş fonksiyonunu çağırabilirsiniz.

```js
import { signal, effect } from "@preact/signals";

const name = signal("Jane");
const surname = signal("Doe");
const fullName = computed(() => name.value + " " + surname.value);

const dispose = effect(() => console.log(fullName.value));
// Loglar: "Jane Doe"

// Etkiyi ve abonelikleri yok et:
dispose();

// `name` güncellenmesi, etkisini tetiklemez; çünkü iptal edilmiştir.
// Ayrıca, artık bunun gözlemlenmemesi nedeniyle `fullName`i de yeniden hesaplanmaz.
name.value = "John";
```

> :bulb: İpucu: Eğer bunları yoğun bir şekilde kullanıyorsanız, etkileri temizlemeyi unutmayın. Aksi takdirde, uygulamanız gerektiğinden daha fazla bellek tüketebilir.

---

## Sinyalleri abone olmadan okuma

Nadir okullarda, `effect(fn)` içinde bir sinyali yazmanız gerektiğinde, ancak o sinyal değiştiğinde etkinliğin yeniden çalışmasını istemiyorsanız, sinyalin mevcut değerini abone olmadan almak için `.peek()` kullanabilirsiniz.

```js
const delta = signal(0);
const count = signal(0);

effect(() => {
  // `count`'u, `count`'a abone olmadan güncelle:
  count.value = count.peek() + delta.value;
});

// `delta` ayarlamanız etkinliği yeniden çalıştırır:
delta.value = 1;

// Bu, `count`'ın `.value`'ına erişmekten kaçındığı için etkili bir şekilde etkinliği yeniden çalıştırmaz:
count.value = 10;
```

> :bulb: Bir sinyale abone olmak istemediğiniz senaryolar nadirdir. Çoğu durumda, etkilerinizin tüm sinyallere abone olmasını istemelisiniz. Yalnızca gerçekten ihtiyaç duyduğunuzda `.peek()`'i kullanın.

---

## Birden fazla güncellemeyi birleştirme

Önceki todo uygulamamızda kullandığımız `addTodo()` fonksiyonunu hatırlayın. İşte neye benzediğinin bir hatırlatıcısı:

```js
const todos = signal([]);
const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = "";
}
```

Fonksiyonun iki ayrı güncellemeyi tetiklediğini fark edin: biri `todos.value` ayarlanırken, diğeri `text`'in değerini ayarlarken. Bu bazen istenir olmayabilir ve performans ya da başka nedenlerle iki güncellemeyi birbiriyle birleştirmek isteyebiliriz. `batch(fn)` fonksiyonu, geri dönüş fonksiyonunun sonunda bir "taahhüt" olarak birden fazla değer güncellemeyi birleştirmenizi sağlar:

```js
function addTodo() {
  batch(() => {
    todos.value = [...todos.value, { text: text.value }];
    text.value = "";
  });
}
```

Bir batch içinde değiştirilmiş bir sinyali erişmek, güncellenmiş değerini yansıtır. Bir batch içinde başka bir sinyal tarafından geçersiz kılınan hesaplanan bir sinyali erişmek, yalnızca güncel bir değer döndürmek için gerekli bağımlılıkları yeniden hesaplayacaktır. Diğer geçersiz kılınmış sinyaller ise etkilenmez ve yalnızca batch geri dönüşü tamamlana kadar güncellenmez.

```js
// --repl
import { signal, computed, effect, batch } from "@preact/signals";

const count = signal(0);
const double = computed(() => count.value * 2);
const triple = computed(() => count.value * 3);

effect(() => console.log(double.value, triple.value));

batch(() => {
  // `count` ayarlayıp `double` ve `triple`'ı geçersiz kılar:
  count.value = 1;

  // Gruplandığı halde, `double` yeni hesaplanan değeri yansıtır.
  // Ancak, `triple` yalnızca geri dönüş tamamlandığında güncellenecektir.
  console.log(double.value); // Loglar: 2
});
```

> :bulb: İpucu: Gruplar da iç içe olabilir, bu durumda gruplanmış güncellemeler yalnızca en dışta bulunan grup geri dönüş fonksiyonu tamamlandığında boşaltılır.

---

### Render optimizasyonları

Sinyaller ile sanal DOM render'ını atlayabilir ve sinyal değişikliklerini doğrudan DOM değişimlerine bağlayabiliriz. JSX içinde bir sinyali metin konumuna eklerseniz, metin olarak render edilir ve otomatik olarak yerinde güncellenir; sanal DOM farklılıklarına gerek kalmadan:

```jsx
const count = signal(0);

function Unoptimized() {
  // `count` değiştiğinde bileşeni yeniden render eder:
  return <p>{count.value}</p>;
}

function Optimized() {
  // Metin otomatik olarak yeniden render olmadan güncellenir:
  return <p>{count}</p>;
}
```

Bu optimizasyonu etkinleştirmek için, sinyali `.value` özelliğine erişmek yerine doğrudan JSX'e geçirin.

DOM bileşenlerinde prop olarak sinyalleri geçirirken de benzer bir render optimizasyonu desteklenmektedir.

---

## API

Bu bölüm, sinyaller API'sinin bir genel görünümüdür. Sinalleri nasıl kullanacağını bilenler için hızlı bir referans olması hedeflenmiştir.

### signal(initialValue)

Verilen argümanı başlangıç değer olarak alarak yeni bir sinyal oluşturur:

```js
const count = signal(0);
```

Bileşen içinde sinyalleri yaratırken, hook versiyonu olan `useSignal(initialValue)`'yu kullanın.

Döndürülen sinyalin bir `.value` özelliği vardır; bu özellik, değerini okumak ve yazmak için alınabilir veya ayarlanabilir. Bir sinyaldan abone olmadan okumak için `signal.peek()` kullanın.

### computed(fn)

Diğer sinyallerin değerlerine dayalı olarak hesaplanan yeni bir sinyal oluşturur. Döndürülen hesaplanan sinyal yalnızca okunabilir ve geri çağırma fonksiyonundan erişilen herhangi bir sinyal değiştiğinde otomatik olarak güncellenir.

```js
const name = signal("Jane");
const surname = signal("Doe");

const fullName = computed(() => `${name.value} ${surname.value}`);
```

Bileşen içinde hesaplanan sinyalleri oluştururken, hook versiyonu olan `useComputed(fn)`'yi kullanın.

---
title: Effect and Batch Functions
description: In this document, we explore the usage of `effect(fn)` and `batch(fn)` functions for responding to signal changes in programming. These functions help in managing updates efficiently, ensuring that multiple value updates can be handled smoothly.
keywords: [effect, batch, signal, programming, value updates]
---

### effect(fn)

Sinyal değişikliklerine yanıt olarak rastgele kod çalıştırmak için `effect(fn)` kullanabiliriz. Hesaplanan sinyallere benzer şekilde, etkiler hangi sinyallere erişildiğini takip eder ve bu sinyaller değiştiğinde geri çağırmalarını yeniden çalıştırır. 

:::info
Eğer geri çağırma bir işlev dönerse, bu işlev bir sonraki değer güncellemesinden önce çalıştırılır. Hesaplanan sinyallerin aksine, `effect()` bir sinyal döndürmez - bu bir değişim dizisinin sonudur.
:::

```js
const name = signal("Jane");

// `name` değiştiğinde konsola yazdır:
effect(() => console.log('Merhaba', name.value));
// Yazdırır: "Merhaba Jane"

name.value = "John";
// Yazdırır: "Merhaba John"
```

Bir bileşen içinde sinyal değişikliklerine yanıt verirken, **kanca varyantını** kullanın: `useSignalEffect(fn)`.

---

### batch(fn)

`batch(fn)` işlevi, belirtilen geri çağırmanın sonunda bir "taahhüt" olarak birden fazla değer güncellemesini birleştirmek için kullanılabilir. Gruplar iç içe geçirilebilir ve değişiklikler yalnızca en dıştaki grup geri çağırması tamamlandığında boşaltılır. 

:::tip
Bir grup içinde değiştirilmiş bir sinyale erişmek, güncellenmiş değerini yansıtır.
:::

```js
const name = signal("Jane");
const surname = signal("Doe");

// İki yazmayı tek bir güncellemede birleştir
batch(() => {
  name.value = "John";
  surname.value = "Smith";
});
```