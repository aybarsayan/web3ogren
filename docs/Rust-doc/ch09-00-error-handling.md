# Hata Yönetimi

Hatalar, yazılımın bir gerçeğidir; bu nedenle Rust, bir şeyler ters gittiğinde durumu yönetmek için bir dizi özelliğe sahiptir. Birçok durumda, Rust, hata olasılığını kabul etmenizi ve kodunuz derlenmeden önce bazı eylemler gerçekleştirmenizi gerektirir. Bu gereklilik, programınızı daha sağlam hale getirir ve hataları keşfetmenizi ve uygun şekilde yönetmenizi sağlar, böylece kodunuzu üretime almadan önce!

:::info
Rust, hataları iki ana kategoriye ayırır: **geri kazanılabilir** ve **geri kazanılamaz** hatalar.
:::

Bir **geri kazanıbilir** hata, örneğin bir **dosya bulunamadı** hatasıdır. Bu durumda, muhtemelen sadece sorunu kullanıcıya bildirmek ve işlemi yeniden denemek isteriz. Geri kazanılamaz hatalar ise her zaman bir hata belirtisidir; örneğin, bir dizinin sonunun ötesinde bir konuma erişmeye çalışmak ve bu nedenle programı hemen durdurmak isteriz.

:::warning
Çoğu dil, bu iki hata türü arasında ayrım yapmaz ve her ikisini de aynı şekilde, istisnalar gibi mekanizmalar kullanarak yönetir. Rust’ta istisnalar yoktur.
:::

Bunun yerine, geri kazanılabilir hatalar için `Result` türünü ve geri kazanılamaz bir hata meydana geldiğinde yürütmeyi durduran `panic!` makrosunu kullanır. 

---

Bu bölüm önce `panic!` çağrısını ele alır ve ardından `Result` değerlerinin döndürülmesini tartışır. Ayrıca, bir hatadan geri dönmeye çalışmak mı yoksa yürütmeyi durdurmak mı gerektiği konusunda dikkate alınması gereken hususları keşfedeceğiz.

### Geri Kazanılabilir Hatalar

:::tip
Geri kazanılabilir hatalar için `Result` türü, işlem sonucunu temsil eder.
:::

| Tür               | Açıklama                                           |
|-------------------|----------------------------------------------------|
| `Result`    | İşlem başarıyla tamamlandığında `Ok(T)` döner.   |
|                   | Hata meydana geldiğinde `Err(E)` döner.           |

:::note
Bir geri kazanılabilir hata durumunda, kullanıcıya hata mesajı göstermek ve işlemi yeniden denemek iyi bir uygulamadır.
:::

### Geri Kazanılamaz Hatalar

Geri kazanılamaz hatalar genellikle programın aniden sonlandırılmasına neden olur. Rust’ta bu tür hatalarla başa çıkmanın bir yolu, `panic!` makrosunu kullanmaktır.

:::danger
“Panic” durumları genellikle ciddi sorunları işaret eder; bu nedenle dikkatli olunmalıdır.
:::

**Önemli:**

> Rust, programın ne zaman durdurulması gerektiği konusunda kullanıcıya daha fazla kontrol sağlar.   
> — Rust Dökümantasyonu

 ile ilgili daha fazla detay var -->