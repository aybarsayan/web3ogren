# İletişim Ücretleri

Genel olarak, eğer bir akıllı sözleşme başka bir akıllı sözleşmeye sorgu göndermek istiyorsa, hedef akıllı sözleşmeye iç mesaj göndermesi için (mesaj yönlendirme ücretleri), bu mesajın hedefte işlenmesi için (gaz ücretleri) ve gerekirse yanıtı geri göndermesi için ödeme yapması gerekmektedir (mesaj yönlendirme ücretleri).

:::note
Çoğu durumda, gönderen, iç mesaja küçük bir miktar Toncoin (örneğin, **bir Toncoin**) ekleyecek (bu mesajın işlenmesi için yeterli) ve "bounce" bayrağını ayarlayacaktır (yani, yönlendirilmesi mümkün olan bir iç mesaj göndermek); alıcı, yanıt ile birlikte alınan değerin kullanılmayan kısmını geri gönderecektir (bundan mesaj yönlendirme ücretlerini düşerek). Bu, genellikle `SENDRAWMSG`'yi `mode = 64` ile çağırarak gerçekleştirilir (bkz. TON VM belgelerinin Ek A'sı).
:::

Eğer alıcı, alınan mesajı ayrıştıramazsa ve sıfırdan farklı bir çıkış kodu ile sona ererse (örneğin, işlenmemiş bir hücre serileştirme hatası nedeniyle), mesaj otomatik olarak gönderenine "bounce" yapılarak geri gönderilecektir; "bounce" bayrağı temizlenecek ve "bounced" bayrağı ayarlanacaktır. **Bounce'lanan mesajın gövdesi**, 32 bit `0xffffffff`'ı ve ardından orijinal mesajdan gelen 256 bit veriyi içerecektir. 

> **Önemli:** Akıllı sözleşmede `op` alanını ayrıştırmadan ve ilgili sorguyu işlemeye geçmeden önce, gelen iç mesajların "bounced" bayrağını kontrol etmek önemlidir (aksi takdirde, bounce'lanan bir mesajdaki sorgunun, orijinal göndereni tarafından yeni bir ayrı sorgu olarak işlenme riski vardır). 
> — Akıllı Sözleşme Geliştirici

"Bounced" bayrağı ayarlandığında, özel bir kod hangi sorgunun başarısız olduğunu belirleyebilir (örneğin, `op` ve `query_id`'yi bounce'lanan mesajdan serileştirerek) ve uygun bir işlem yapabilir. Daha basit bir akıllı sözleşme, tüm bounce'lanan mesajları görmezden gelmeyi tercih edebilir (eğer "bounced" bayrağı ayarlandıysa sıfır çıkış kodu ile sona ermek). 

:::warning
"Bounced" bayrağının gönderim sırasında yeniden yazıldığını unutmayın; bu nedenle, sahte bir bayrak oluşturulamaz. Eğer mesaj "bounced" bayrağı ile geldiyse, bu, alıcıdan gönderilen bir mesajın sıçramasının sonucudur.
:::

Öte yandan, alıcı gelen sorguyu başarıyla ayrıştırabilir ve istenen `op` metodunun desteklenmediğini veya başka bir hata durumunun oluştuğunu görebilir. Bu durumda `op` değeri `0xffffffff` veya başka bir uygun değer ile birlikte bir yanıt gönderilmelidir; yukarıda bahsedildiği gibi `SENDRAWMSG` kullanılarak `mode = 64` ile gönderilmelidir.

Bazı durumlarda, gönderen hem alıcıya bir değer transfer etmek hem de ya bir onay ya da bir hata mesajı almak isteyebilir. Örneğin, doğrulayıcı seçimleri akıllı sözleşmesi, stake ile birlikte bir seçim katılım talebi alır. Bu gibi durumlarda, istenen değere bir ek Toncoin eklemek mantıklıdır. 

:::tip
Bir hata oluşursa (örneğin, stake herhangi bir nedenle kabul edilmeyebilir), alınan toplam miktar (işlem ücretleri düşüldükten sonra) alıcıya geri gönderilmeli ve bir hata mesajı ile birlikte verilmelidir (örneğin, daha önce açıklandığı gibi `SENDRAWMSG` ile `mode = 64` kullanarak).
:::

Başarı durumunda, onay mesajı oluşturulur ve tam olarak **bir Toncoin** geri gönderilir (bu değerden mesaj transfer ücretleri düşüldüğünde; bu, `SENDRAWMSG`'nin `mode = 1`'dir).