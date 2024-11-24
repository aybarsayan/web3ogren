## Genişletilebilir Eşzamanlılık ile `Sync` ve `Send` Özellikleri

İlginç bir şekilde, Rust dilinin *çok* az eşzamanlılık özelliği vardır. Bu bölümde şimdiye kadar bahsettiğimiz hemen hemen her eşzamanlılık özelliği standart kütüphanenin bir parçası olmuştur, dilin değil. Eşzamanlılıkla başa çıkma seçenekleriniz yalnızca dil veya standart kütüphane ile sınırlı değildir; kendi eşzamanlılık özelliklerinizi yazabilir veya başkaları tarafından yazılmış olanları kullanabilirsiniz.

:::info
Rust dilinin eşzamanlılık özellikleri hakkında daha fazla bilgi için, [belgelere](https://doc.rust-lang.org/book/ch16-00-concurrency.html) başvurabilirsiniz.
:::

Ancak, dilin içine gömülü iki eşzamanlılık kavramı vardır: `std::marker` özellikleri `Sync` ve `Send`.

---

### `Send` ile İki İş Parçacığı Arasında Sahiplik Devri Sağlama

`Send` işaretçi özelliği, `Send` uygulayan bir türün değerlerinin sahipliğinin iş parçacıkları arasında aktarılabileceğini belirtir. **Neredeyse her Rust türü `Send`dir**, ancak `Rc` gibi bazı istisnalar vardır:

> Bir `Rc` değerini kopyalayıp klonun sahipliğini başka bir iş parçacığına devretmeye çalışırsanız, her iki iş parçacığı da referans sayısını aynı anda güncelleyebilir — bu, hata yapma olasılığını artırır.

Bu nedenle, `Rc` yalnızca tek iş parçacıklı durumlarda kullanılmak üzere uygulanmıştır ve güvenli değildir.

:::warning
Rust'ın tür sistemi ve özellik sınırları, bir `Rc` değerini iş parçacıkları arasında kazara güvensiz bir şekilde gönderemeyeceğinizden emin olur. 
:::

16-14 numaralı Listede bunu yapmaya çalıştığımızda, `trait Send için Rc> uygulanmamıştır` hatası aldık. `Send` olan `Arc`'ye geçiş yaptığımızda, kod derlendi.

Tamamen `Send` türlerinden oluşan her tür, otomatik olarak `Send` olarak işaretlenir. **Çıplak işaretçiler haricinde, neredeyse tüm ilkel türler `Send`dir**; bunları Bölüm 20'de tartışacağız.

---

### `Sync` ile Birden Fazla İş Parçacığından Erişim Sağlama

`Sync` işaretçi özelliği, `Sync` uygulayan türün birden fazla iş parçacığı tarafından referans alınmasının güvenli olduğunu belirtir. **Diğer bir deyişle, her tür `T`, `&T` (bir `T` nesnesine sabit bir referans) `Send` ise `Sync`dir;** yani referans güvenli bir şekilde başka bir iş parçacığına gönderilebilir.

**Akıllı işaretçi `Rc`, aynı nedenlerden dolayı `Send` olmadığı gibi `Sync` de değildir.** `RefCell` türü (Bölüm 15'te bahsettiğimiz) ve ilgili `Cell` türleri `Sync` değildir. 

:::note
`RefCell`'nin çalışma zamanında yaptığı ödünç alma kontrollerinin uygulanması iş parçacığı güvenli değildir. 
:::

Akıllı işaretçi `Mutex` `Sync`dir ve siz bunu [“Birden Fazla İş Parçacığı Arasında `Mutex` Paylaşma”][sharing-a-mutext-between-multiple-threads] bölümünde gördüğünüz gibi birden fazla iş parçacığıyla erişimi paylaşmak için kullanılabilir.

---

### `Send` ve `Sync`'yi Manuel Olarak Uygulamak Güvensizdir

`Send` ve `Sync` özelliklerinden oluşan türler otomatik olarak `Send` ve `Sync` olduğundan, bu özellikleri manuel olarak uygulamamız gerekmez. 

:::tip
Hiçbir yöntem uygulamamıza gerek yoktur; bu nedenle, **eşzamanlılıkla ilgili tüm geçerlilikleri zorunlu kılmak için yalnızca kullanışlıdırlar.**
:::

Bu özellikleri manuel olarak uygulamak, güvensiz Rust kodu uygulamayı içerir. Güvensiz Rust kodunun kullanımı hakkında Bölüm 20'de konuşacağız; şimdilik, `Send` ve `Sync` parçalardan oluşmayan yeni eşzamanlı türler oluşturmanın güvenlik garantilerini üstlenmek için dikkatli düşünmeyi gerektirdiği önemli bir bilgidir. 

:::danger
[Rustonomicon][nomicon] bu garantiler hakkında daha fazla bilgi ve bunları nasıl yerine getireceğiniz hakkında bilgi sağlamaktadır.
:::

---

## Özet

Bu kitapta eşzamanlılıkla ilgili son gördükleriniz değil: bir sonraki bölüm tamamen async programlamaya odaklanmaktadır ve Bölüm 21'deki proje, burada tartışılan küçük örneklerden daha gerçekçi bir durumda bu bölümdeki kavramları kullanacaktır.

Daha önce belirtildiği gibi, Rust'ın eşzamanlılığı nasıl ele aldığına dair çok az şey dilin bir parçasıdır; birçok eşzamanlılık çözümü, crate olarak uygulanmıştır. **Bunlar standart kütüphaneden daha hızlı gelişir**; bu nedenle çok iş parçacıklı durumlarda kullanılacak güncel, en iyi durum crate'leri aramayı unutmayın.

Rust standart kütüphanesi mesaj gönderimi için kanallar ve `Mutex` ve `Arc` gibi eşzamanlı bağlamlarda kullanılabilecek akıllı işaretçi türlerini sağlar. **Tür sistemi ve ödünç alma kontrolü**, bu çözümleri kullanan kodların veri yarışları veya geçersiz referanslar ile sonuçlanmayacağını garanti eder. 

Kodunuzu derlemeyi başardığınızda, bunun birden fazla iş parçacığında mutlulukla çalışacağından emin olabilirsiniz; ayrıca bu, diğer dillerde yaygın olan zor takip edilebilen hatalarla sonuçlanmaz. 

:::tip
Eşzamanlı programlama artık korkulacak bir kavram değil: cesurca programlarınızı eşzamanlı hale getirin!
:::