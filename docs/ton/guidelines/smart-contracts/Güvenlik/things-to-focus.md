# TON Blockchain ile Çalışırken Üzerinde Durulması Gerekenler

Bu makalede, TON uygulamaları geliştirmek isteyenlerin dikkate alması gereken öğeleri gözden geçirecek ve tartışacağız.

## Kontrol Listesi

### 1. İsim Çakışmaları

Func değişkenleri ve fonksiyonları neredeyse her geçerli karakteri içerebilir. Yani `var++`, `~bits`, `foo-bar+baz` gibi virgüller de geçerli değişken ve fonksiyon adlarıdır.

Func kodu yazarken ve incelerken, Linter kullanılmalıdır.

- `IDE eklentileri`

### 2. Atılan Değerleri Kontrol Et

:::warning
Her seferinde TVM yürütmesi normal şekilde durursa, çıkış kodları `0` veya `1` ile durur. Otomatik olarak yapılsa da, TVM yürütmesi `throw(0)` veya `throw(1)` komutlarıyla doğrudan bu çıkış kodları atıldığında beklenmedik bir şekilde kesilebilir.
:::

- `Hatalarla nasıl başa çıkılır`
- `TVM çıkış kodları`

### 3. Func, Saklaması Gereken Tam Verileri İçeren Sıkı Bir Tip Dilidir

Kodun ne yaptığını ve ne döneceğini takip etmek çok önemlidir. Derleyicinin yalnızca kodla ve yalnızca başlangıç durumuyla ilgilendiğini unutmayın. Belirli işlemlerden sonra bazı değişkenlerin saklama değerleri değişebilir.

:::tip
Beklenmedik değişken değerlerini okumak ve bu değerlerin sahip olması beklenmeyen veri tipleri üzerinde yöntemler çağırmak (veya döndürülen değerlerin düzgün saklanmaması) hatalardır ve "uyarılar" veya "bildirimler" olarak atlanmaz, kodun erişilemez hale gelmesine neden olur.
:::

Beklenmedik bir değeri saklamak sorun olmayabilir, ancak okumak sorunlara yol açabilir; örneğin, beklenen aralıktan dışarıda bir tamsayı değeri için hata kodu `5` atılabilir.

### 4. Mesajların Modları Vardır

Mesaj modunu kontrol etmek, özellikle önceki gönderilen mesajlarla ve ücretlerle etkileşimi açısından önemlidir. Depolama masraflarını hesaba katmamak olası bir hatadır; bu durumda, sözleşmenin TON'dan tükenmesiyle sonuçlanabilir ve bu da çıkış mesajları gönderirken beklenmedik hatalara yol açabilir. Mesaj modlarını `buradan` görüntüleyebilirsiniz.

### 5. TON, Aktör Modelini Tamamen Uygulamaktadır

Bu, sözleşme kodunun değiştirilebileceği anlamına gelir. Ya `SETCODE` TVM yönergesini kullanarak kalıcı olarak değiştirilebilir ya da çalıştırma sırasında, TVM kodu kaydını yeni bir hücre değeriyle sonuna kadar ayarlayarak değiştirilebilir.

---

### 6. TON Blockchain Birkaç İşlem Aşamasına Sahiptir

Hesaplama aşaması, akıllı sözleşmelerin kodunu yürütür ve yalnızca ardından eylemler gerçekleştirilir (mesaj gönderme, kod modifikasyonu, kütüphane değiştirme vb.) Ethereum tabanlı blockchain'lerde olduğu gibi, gönderilen mesajın başarısız olacağını umuyorsanız, hesaplama aşaması çıkış kodunu göremezsiniz; çünkü bu, hesaplama aşamasında değil, eylem aşamasında gerçekleşmiştir.

- `İşlemler ve aşamalar`

### 7. TON Sözleşmeleri Özerktir

Blockchain'deki sözleşmeler ayrı parçacıklarda bulunabilir ve diğer doğrulayıcılar tarafından işlenebilir, bu da geliştiricinin talep üzerine diğer sözleşmelerden veri çekemeyeceği anlamına gelir. Dolayısıyla, her iletişim eşzamansızdır ve mesaj gönderilerek yapılır.

- `Akıllı sözleşmeden mesaj gönderme`
- `DApp'den mesaj gönderme`

### 8. Diğer Blockchain'lerin Aksine, TON Geri Dönüş Mesajları İçermez

:::info
TON akıllı sözleşmenizi programlamaya başlamadan önce, kod akışı için çıkış kodları yol haritasını düşünmek (ve bunu belgelerle belgelendirmek) yararlıdır.
:::

### 9. method_id Tanımlayıcılarına Sahip Func Fonksiyonları Metod Kimliklerine Sahiptir

Bunlar ya açıkça `"method_id(5)"` olarak ayarlanabilir veya bir Func derleyicisi tarafından örtük olarak atanabilir. Bu durumda, .fift montaj dosyasındaki yöntem beyanları arasında bulunabilirler. İkisi önceden tanımlıdır: blockchain içinde mesaj almak için `(0)`, genellikle `recv_internal` olarak adlandırılır ve dışarıdan mesaj almak için `(-1)`, `recv_external`.

---

### 10. TON Kripto Adresi Herhangi Bir Para veya Kod Taşımaz

TON blockchain'indeki akıllı sözleşme adresleri deterministiktir ve önceden hesaplanabilir. Adreslerle ilişkili Ton Hesapları, kod içermeyebilir; bu da, hiç dağıtılmamışlarsa, başlatılmamış veya özel bayraklarla gönderilen bir mesajla depolama ücretleri tükendiğinde dondurulmuş olabileceği anlamına gelir.

### 11. TON Adreslerinin Üç Temsili Olabilir

TON adreslerinin üç temsili vardır. Tam bir temsil "ham" (`workchain:address`) veya "kullanıcı dostu" olabilir. Sonuncusu, kullanıcıların en sık karşılaştığı temsildir. `bounceable` veya `not bounceable` olup olmadığını belirten bir etiket baytı ve bir iş parçacığı kimliği baytı içerir. Bu bilgi not edilmelidir.

- `Ham ve Kullanıcı Dostu Adresler`

### 12. Kod Yürütme Hatalarını Takip Edin

Solidity'de yöntem görünürlüğünü belirlemek size bağlıyken, Func durumunda görünürlük daha karmaşık bir şekilde sınırlıdır ya hata göstererek ya da `if` ifadeleriyle.

### 13. Geri Dönmüş Mesajları Göndermeden Önce Gazı İzleyin

Akıllı sözleşme, kullanıcı tarafından sağlanan değerle geri dönmüş mesajlar gönderdiğinde, geri dönen tutardan karşılık gelen gaz masraflarının düşüldüğünden emin olun; aksi takdirde taşma meydana gelebilir.

### 14. Geri Çağırmaları ve Hataları İzleyin

TON blockchain'i eşzamansızdır. Bu, mesajların ardışık olarak gelmesi gerekmediği anlamına gelir. Örneğin, bir eylemin başarısızlık bildirimleri geldiğinde, bu düzgün bir şekilde ele alınmalıdır.

### 15. İç Mesajları Alırken Geri Dönme Bayrağının Gönderilip Gönderilmediğini Kontrol Edin

Geri dönmüş mesajlar (hata bildirimleri) alabilirsiniz; bunların ele alınması gerekir.

- `Standart Yanıt Mesajlarının Ele Alınması`

### 16. Dış Mesajlar için Yeniden Oynatma Koruması Yazın

Cüzdanlar (kullanıcıları paralarını saklayan akıllı sözleşmeler) için iki özel çözüm vardır: `seqno-tabaneli` (mesajı iki kez işleme almamak için sayacı kontrol et) ve `yüksek-yük` (işlem tanımlayıcılarını ve süresini saklamak).

- `Seqno-tabanlı cüzdanlar`
- `Yüksek-yük cüzdanları`

## Referanslar

Orijinal olarak 0xguard tarafından yazılmıştır

- [Orijinal makale](https://0xguard.com/things_to_focus_on_while_working_with_ton_blockchain)