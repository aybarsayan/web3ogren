---
description: Bu belge, Yeoman üretici çalışma bağlamının temel kavramlarını ve yöntemlerin nasıl çalıştığını açıklamaktadır. Geliştiriciler için asenkron görevlerin yönetimi ve öncelik sıralaması hakkında bilgiler sunulmaktadır.
keywords: [Yeoman, üretici, çalışma bağlamı, asenkron görevler, öncelik sıralaması]
---

# Üretici Çalışma Bağlamı

Bir Üretici yazarken kavraması gereken en önemli kavramlardan biri, yöntemlerin nasıl çalıştığı ve hangi bağlamda bulunduğudur.

## Prototip yöntemleri eylem olarak

Bir Üretici prototipine doğrudan bağlı her yöntem, bir görev olarak kabul edilir. Her görev, Yeoman ortamı çalıştırma döngüsü tarafından sırayla çalıştırılır.

> **Not:** Diğer bir deyişle, `Object.getPrototypeOf(Generator)` ile döndürülen nesnedeki her fonksiyon otomatik olarak çalıştırılacaktır.

### Yardımcı ve özel yöntemler

Prototip yöntemlerinin bir görev olarak kabul edildiğini bildiğinize göre, otomatik olarak çağrılmayacak yardımcı veya özel yöntemleri nasıl tanımlayacağınızı merak edebilirsiniz. Bunu başarmanın üç farklı yolu vardır.

1. Yöntem adını bir alt çizgi ile öne alın (örneğin, `_private_method`).

    ```js
      class extends Generator {
        method1() {
          console.log('hey 1');
        }

        _private_method() {
          console.log('özel hey');
        }
      }
    ```
   
2. Örnek yöntemlerini kullanın:

    ```js
      class extends Generator {
        constructor(args, opts) {
          // Süper yapıcıyı çağırmak, üreticimizin doğru şekilde ayarlandığından emin olmak için önemlidir
          super(args, opts)

          this.helperMethod = function () {
            console.log('otomatik olarak çağrılmayacak');
          };
        }
      }
    ```

3. Bir üst üreticiyi genişletin:

    ```js
      class MyBase extends Generator {
        helper() {
          console.log('üst üreticideki yöntemler otomatik olarak çağrılmayacak');
        }
      }

      module.exports = class extends MyBase {
        exec() {
          this.helper();
        }
      };
    ```

## Çalışma döngüsü

Görevleri sırayla çalıştırmak, tek bir üretici için uygundur. Ancak, üreticileri birlikte birleştirmeye başladığınızda yeterli değildir.

:::info
Bu nedenle Yeoman bir **çalışma döngüsü** kullanır. Çalışma döngüsü, öncelik desteği olan bir kuyruk sistemidir. Çalışma döngüsünü yönetmek için [Grouped-queue](https://github.com/SBoudrias/grouped-queue) modülünü kullanıyoruz.
:::

Öncelikler, kodunuzda özel prototip yöntemi adları olarak tanımlanır. Bir yöntem adı bir öncelik adıyla aynı olduğunda, çalışma döngüsü bu yöntemi özel kuyruğa ekler. Eğer yöntem adı bir öncelikle eşleşmiyorsa, `default` grubuna eklenir.

Kodda bu şekilde görünecektir:

```js
class extends Generator {
  priorityName() {}
}
```

Ayrıca, bir hash kullanarak bir kuyruğa birlikte çalıştırılacak birden fazla yöntemi gruplayabilirsiniz:

```js
Generator.extend({
  priorityName: {
    method() {},
    method2() {}
  }
});
```

(Bu son teknik, JS `class` tanımıyla pek iyi çalışmaz)

Mevcut öncelikler (çalıştırma sırasına göre) şunlardır:

1. `initializing` - Başlatma yöntemleriniz (mevcut proje durumunu kontrol etme, yapılandırmaları alma, vb.)
2. `prompting` - Kullanıcılardan seçenekler için ipucu verdiğiniz yer (burada `this.prompt()` çağırırsınız)
3. `configuring` - Yapılandırmaları kaydetme ve projeyi yapılandırma (`.editorconfig` dosyaları ve diğer meta veri dosyaları yaratma)
4. `default` - Yöntem adı bir öncelikle eşleşmiyorsa, bu gruba eklenir.
5. `writing` - Üreticiye özgü dosyaları yazdığınız yer (yollar, kontrolörler, vb.)
6. `conflicts` - Çatışmaların yönetildiği yer (içsel olarak kullanılır)
7. `install` - Kurulumların yapıldığı yer (npm, bower)
8. `end` - Son çağrıldığında, temizlik, hoşçakal demek, vb.

:::tip
Bu öncelikler kılavuzlarına uyun ve üreticiniz diğerleriyle uyumlu çalışacaktır.
:::

---

## Asenkron görevler

Bir görevin asenkron olarak tamamlanmasını beklemek için çalışma döngüsünü durdurmanın birçok yolu vardır.

En kolay yol **bir promise döndürmektir**. Promise çözüldüğünde döngü devam eder veya bir istisna yükselterek durur eğer başarısız olursa.

Kullandığınız asenkron API promise'leri desteklemiyorsa, o zaman eski `this.async()` yoluna güvenebilirsiniz. `this.async()` çağırmak, görev tamamlandığında çağrılması gereken bir fonksiyon döndürür. Örneğin:

```js
asyncTask() {
  var done = this.async();

  getUserEmail(function (err, name) {
    done(err);
  });
}
```

`done` fonksiyonu bir hata parametresi ile çağrıldığında, çalışma döngüsü durur ve bir istisna yükseltilir.

## Buradan nereye?

Artık yeoman'ın çalışma bağlamı hakkında biraz daha fazla şey bildiğinize göre, `kullanıcı etkileşimleri` konusunu okumaya devam edebilirsiniz.