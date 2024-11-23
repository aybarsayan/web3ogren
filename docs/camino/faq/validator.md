---
sidebar_position: 1
description: Camino ve Columbus ağlarında doğrulama ile ilgili sıkça sorulan sorular.
---

# Doğrulayıcı SSS

### Camino doğrulayıcısı kim olabilir?

Seyahat endüstrisinde yer alan ve aşağıdaki kriterleri karşılayan herhangi bir katılımcı, Camino Mainnet'te doğrulayıcı olabilir:

- Cüzdanında minimum **100,000 Camino (CAM)** token bulunduruyor olmalıdır.
- Know-Your-Customer (KYC) ve Know-Your-Business (KYB) doğrulama süreçlerinden geçmiş ve başarıyla dönemlerini tamamlamış olmalıdır.
- Doğrulayıcı konsorsiyumu tarafından oylama yoluyla doğrulayıcı olarak seçilmiş olmalıdır.

:::note

Son gerekliliğin, ağın kuruluşundan itibaren güvenliğini sağlayacak doğrulayıcılar için geçerli olmadığını belirtmek önemlidir. Blok zincirinin genesisinde bulunan bu ilk doğrulayıcılar, zaten belirlenmiş durumdadır ve bir oylama sürecinden geçmeleri gerekmez. Ancak, daha sonraki tekliflere, örneğin konsorsiyumdan çıkarılma gibi, tabi olmaya devam ederler.

:::

### Camino Ağı'ndaki doğrulayıcılar için staking parametreleri nelerdir?

- Bir doğrulayıcının stake etmesi gereken tam miktar **100,000 CAM**’dir.
- Bir doğrulayıcı için fonları stake edebileceğiniz süre **2 hafta** (min) ile **1 yıl** (max) arasındadır.

:::note

Bir doğrulayıcı, Camino Mainnet'te doğrulama rolünü tamamladığında, stake ettiği Camino tokenleri geri alacaktır.

:::

### Staking süreci devam ederken doğrulayıcıma daha fazla Camino (CAM) token ekleyebilir miyim?

Hayır. Bir doğrulayıcıyı çalıştırmak için stake edilmesi gereken tam miktar 100,000 CAM'dır. Ancak, doğrulayıcı düğümünü yapılandırmak için cüzdanınıza ek CAM (depozito) kilitleyebilirsiniz. Bu işlem, doğrulayıcı ödüllerinizi artırmaz. Bunun yerine, eklenmiş olan Camino tokenleri, kilitli tokenler için belirlenen ödül yüzdesine tabi olacaktır.

### Kilitli (depolanmış) Camino (CAM) tokenlerimi doğrulayıcı düğümü olarak çalıştırabilir miyim?

Evet, kilitli (depolanmış) Camino (CAM) tokenlerini, bir doğrulayıcı düğümü oluşturmak için stake edebilme yeteneğiniz olacaktır.

### Birden fazla doğrulayıcı düğümü çalıştırabilir miyim?

Hayır. Camino'da, doğrulayıcılar ağı güvence altına alır ve Camino ekosistemini demokratik olarak yönetir. Bu nedenle, demokrasinin oylama sürecini tehlikeye atacağı için birden fazla doğrulayıcı çalıştırmak mümkün değildir.

### Doğrulayıcımda özel anahtarlarımı tutmam gerekiyor mu?

Hayır, özel anahtarlarınızı doğrulayıcınızda tutmanıza gerek yoktur (bunları tutmamanızı şiddetle tavsiye ederiz).

### Doğrulayıcı düğümümün çalışır durumda olması önemli mi?

Evet. Bir doğrulayıcı, doğrulama süresi boyunca %80'den fazla çevrimiçi kalır ve yanıt verirse stake ödülü alır. Doğrulayıcınızın her zaman çevrimiçi ve yanıt verir durumda olmasını hedeflemelisiniz.

### Doğrulayıcımın çalışır durumda olma yüzdesi neden daha düşük bir değerden başlayıp zamanla %100'e çıkıyor?

Ağda yeni bir doğrulayıcı eklediğinizde, API düğümünün onu keşfetmesi ve bağlanması bir süre alır. Keşif aracı tarafından gösterilen çalışma yüzdesi, doğrulayıcıya değil, API düğümünün ağ üzerindeki görünümüne dayanır. Bu nedenle, başlangıç döneminde, doğrulayıcınızın API düğümüne çevrimdışı görünmesi, çalışma yüzdesinin daha düşük bir değerden başlamasına sebep olur.

Ancak bu önemli bir sorun değildir, çünkü diğer doğrulayıcılar da akranlarının çevrimiçi olma sürelerini takip etmektedir. Ağdaki her düğüm, diğer düğümlerin çalışma sürelerini izler, bu nedenle API düğümü başlangıçta daha düşük bir çalışma yüzdesi raporlasa bile, doğrulayıcınızın düğümü eğer sağlıklı ve çevrimiçi ise %100 çalışma süresi gösterir.

### Doğrulayıcımı istediğim zaman durdurup staking’i sonlandırabilir miyim?

Hayır, stake’iniz önceden belirlenmiş staking süresi boyunca kilitlidir. Stake’iniz, süre sonunda otomatik olarak adresinize iade edilecektir.

### Burada cevaplanmamış başka bir sorum var mı?

Herhangi bir sorunuz varsa veya yardıma ihtiyacınız olursa,  sunucumuz üzerinden bizimle iletişime geçmekten çekinmeyin.