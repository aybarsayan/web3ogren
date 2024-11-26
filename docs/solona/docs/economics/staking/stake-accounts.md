---
sidebarLabel: Hisse Hesapları
title: Hisse Hesapları
---

Solana üzerindeki bir hisse hesabı, ağda doğrulayıcılara jetonları devretmek için kullanılabilir ve bunun sonucunda hisse hesabının sahibinin ödül kazanma potansiyeli vardır. Hisse hesapları, _sistem hesabı_ olarak bilinen geleneksel bir cüzdan adresinden farklı bir şekilde oluşturulur ve yönetilir. Bir sistem hesabı, yalnızca ağdaki diğer hesaplardan SOL alıp gönderebilirken, bir hisse hesabı, jetonların devrini yönetmek için gerekli daha karmaşık işlemleri destekler.

> **Not:** Solana üzerindeki hisse hesapları, aşina olabileceğiniz diğer Hisse İspatına (Proof-of-Stake) dayalı blok zinciri ağlarından da farklı çalışır. Bu belge, bir Solana hisse hesabının yüksek seviyeli yapısını ve işlevlerini tanımlar.

#### Hesap Adresi

Her hisse hesabının, komut satırında veya herhangi bir ağ gezgini aracı ile hesap bilgilerini araştırmak için kullanılabilecek benzersiz bir adresi vardır. Ancak, adresin anahtar çiftine sahip olanın cüzdanı kontrol ettiği bir cüzdan adresinin aksine, bir hisse hesabı adresi ile ilişkili anahtar çifti hesabı üzerinde herhangi bir kontrol sağlamayabilir. Aslında, bir hisse hesabının adresi için bir anahtar çifti veya özel anahtar bile olmayabilir.

Bir hisse hesabının adresinde bir anahtar çifti dosyası yalnızca
[komut satırı araçlarını kullanarak bir hisse hesabı oluşturulduğunda](https://docs.solanalabs.com/cli/examples/delegate-stake#create-a-stake-account) vardır. **Hisse hesabının adresinin yeni ve eşsiz olduğunu garanti etmek için önce yeni bir anahtar çifti dosyası oluşturulur.**

#### Hesap Yetkililerini Anlamak

Belirli türdeki hesaplar, belirli bir hesapla ilişkili bir veya daha fazla _imza yetkilisi_ bulundurabilir. Bir hesap yetkisi, kontrol ettiği hesap için belirli işlemleri imzalamak için kullanılır. Bu, hesap adresi ile ilişkili anahtar çiftine sahip olanın hesabın tüm etkinliğini kontrol ettiği bazı diğer blok zinciri ağlarından farklıdır.

> **Tip:** Her hisse hesabı, hisse hesabı üzerinde belirli işlemleri gerçekleştirmek için yetkilendirilmiş, kendi adresleri tarafından belirtilen iki imza yetkisine sahiptir.

_İmza yetkisi_, aşağıdaki işlemler için işlemleri imzalamak için kullanılır:

- Hisse devretmek
- Hisse delegasyonunu devre dışı bırakmak
- Hisse hesabını bölmek ve ilk hesapta bulunan fonlardan bir kısmını içeren yeni bir hisse hesabı oluşturmak
- İki hisse hesabını birleştirmek
- Yeni bir hisse yetkisi belirlemek

_Çekilme yetkisi_, aşağıdakiler için işlemleri imzalar:

- Delegasyon yapılmamış hisseyi bir cüzdan adresine çekmek
- Yeni bir çekilme yetkisi belirlemek
- Yeni bir hisse yetkisi belirlemek

Hisse yetkisi ve çekilme yetkisi, hisse hesabı oluşturulurken belirlenir ve bunlar, yeni bir imza adresini yetkilendirmek için her zaman değiştirilebilir. **Hisse ve çekilme yetkisi aynı adres ya da iki farklı adres olabilir.**

Çekilme yetkisi anahtar çifti, hisse hesabındaki jetonları likit hale getirmek için gerekli olduğundan, hesap üzerinde daha fazla kontrol sağlar ve hisse yetkisi anahtar çifti kaybolursa veya tehlikeye girerse hisse yetkisini sıfırlamak için kullanılabilir.

> **Uyarı:** Çekilme yetkisinin kaybolma veya çalınma durumuna karşı korunması, bir hisse hesabını yönetirken son derece önemlidir.

#### Birden Fazla Delegasyon

Her hisse hesabı yalnızca bir doğrulayıcıya aynı anda devredilebilir. **Hesap içindeki tüm jetonlar ya devredilmiş ya da devredilmemiştir ya da devredilme veya devredilmeme sürecindedir.** Jetonlarınızın bir kısmını bir doğrulayıcıya devretmek veya birden fazla doğrulayıcıya devretmek isterseniz, birden fazla hisse hesabı oluşturmanız gerekir.

Bu, bazı jetonlar içeren bir cüzdan adresinden birden fazla hisse hesabı oluşturarak veya tek bir büyük hisse hesabı oluşturup, hisse yetkisini kullanarak hesabı istediğiniz jeton bakiyeleri ile birden fazla hesaba bölerken gerçekleştirilebilir.

> **Tip:** Aynı hisse ve çekilme yetkileri birden fazla hisse hesabına atanabilir.

#### Hisse Hesaplarını Birleştirme

Aynı yetkiler ve kilitli süreye sahip iki hisse hesabı, tek bir sonuç hisse hesabına birleştirilebilir. Aşağıdaki durumlarda iki hisse hesabı arasında birleştirme mümkündür:

- iki devre dışı bırakılmış hisse
- inaktif bir hisseden, etkinleşme döneminde bir etkin hisseye

Aşağıdaki durumlar için, oylayıcı pubkey ve gözlemlenen oy kredileri eşleşmelidir:

- iki etkin hisse
- etkinleşme dönemini paylaşan iki etkinleşme hesabı, etkinleşme dönemi sırasında

**Hisse durumlarının diğer tüm kombinasyonları, etkinleşme veya devre dışı bırakma sürecinde olan tüm "geçici" durumlar da dahil olmak üzere, birleşme işlemini başarısız kılar.**

#### Delegasyon Isınma ve Soğuma

Bir hisse hesabı devredildiğinde veya bir delegasyon devre dışı bırakıldığında, işlem hemen etkili olmaz.

Bir delegasyon veya devre dışı bırakma işlemleri, işlemlerin küme için gönderilen talimatları içeren işlem yapıldığında her dönem sonunda bir kısmı aktif hale gelir veya pasifleşir ve tamamlanması birkaç [dönem](https://docs.solanalabs.com/terminology.md#epoch) alır.

Ayrıca, ağın genelinde büyük ani hisse değişimlerini önlemek için tek bir dönemde devredilmiş veya devre dışı bırakılmış toplam hisse miktarı üzerinde bir sınır vardır. **Isınma ve soğuma, diğer ağ katılımcılarının davranışlarına bağlı olduğundan, kesin süresi tahmin edilmesi zordur.** Isınma ve soğuma zamanlaması hakkında daha fazla bilgi [burada](https://docs.solanalabs.com/consensus/stake-delegation-and-rewards#stake-warmup-cooldown-withdrawal) bulunabilir.

#### Kilitleme

Hisse hesapları, belirli bir tarih veya dönem (epoch) ulaşılmadan fonların çekilmesini engelleyen bir kilitleme süresine sahip olabilir. Kilitli iken, hisse hesabı hala devredilebilir, devre dışı bırakılabilir veya bölünebilir ve hisse yetkisi normal olarak değiştirilebilir. **Sadece başka bir cüzdana transfer veya çekilme yetkisinin güncellenmesi yasaktır.**

Bir kilitleme, yalnızca hisse hesabı ilk oluşturulduğunda eklenebilir, ancak daha sonra _kilitleme yetkisi_ veya _muhafız_ tarafından değiştirilebilir; bu adres de hesap oluşturulurken belirlenir.

#### Hisse Hesabını Yok Etme

Solana ağındaki diğer hesap türleri gibi, 0 SOL bakiyesi olan bir hisse hesabı artık takip edilmez. Bir hisse hesabı devredilmemişse ve içindeki tüm jetonlar bir cüzdan adresine çekilmişse, o adresteki hesap etkili bir şekilde yok olur ve adresin yeniden kullanılabilmesi için manuel olarak yeniden oluşturulması gerekir.

#### Hisse Hesaplarını Görüntüleme

Hisse hesabı detayları, bir hesap adresini arama çubuğuna kopyalayıp yapıştırarak 
[Solana Explorer](http://explorer.solana.com/accounts) üzerinden görüntülenebilir.