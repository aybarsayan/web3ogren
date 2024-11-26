---
sidebarLabel: Stake etme
title: Solana'da Stake Etme
---

**_OKUYUCULARA NOT:_** Değer artışlarına yapılan tüm referanslar, SOL bakiyesi ile ilgili olarak mutlak terimlerle belirtilmiştir. Bu belge, herhangi bir zamanda SOL'un parasal değeri hakkında hiçbir öneride bulunmamaktadır.

SOL token'larınızı stake ederek, ağı güvence altına alır ve [ödüller kazanırsınız](https://docs.solanalabs.com/implemented-proposals/staking-rewards) bunu yaparken.

Token'larınızı işlemleri işleyen ve ağı çalıştıran doğrulayıcılara yetkilendirerek stake edebilirsiniz.

:::note
Stake'i yetkilendirmek, uzun süre boyunca yetkilendirilmiş token sahiplerine getiriler sağlayabilecek paylaşılan risk ve paylaşılan ödül finansal modelidir. Bu, token sahiplerinin (yetkilendirenler) ve yetkilendirdikleri doğrulayıcıların finansal teşviklerini eşleştirerek sağlanır.
:::

- Bir doğrulayıcıya yetkilendirilen stake ne kadar fazla olursa, bu doğrulayıcı yeni işlemleri deftere yazmak için o kadar sık seçilir.
- Doğrulayıcı daha fazla işlem yazdıkça, doğrulayıcı ve onun yetkilendirenleri daha fazla ödül kazanır.
- Sistemlerini daha fazla işlem işleyebilecek şekilde yapılandıran doğrulayıcılar, orantılı olarak daha fazla ödül kazanır ve ağın mümkün olduğunca hızlı ve sorunsuz çalışmasını sağlar.

Doğrulayıcılar sistemlerini çalıştırmak ve sürdürmek için maliyetler üstlenirler ve bu, kazanılan ödüllerin bir yüzdesi olarak toplanan bir ücret şeklinde yetkilendirenlere yansıtılır. Bu ücret _komisyon_ olarak bilinir. **Doğrulayıcılar**, kendilerine ne kadar fazla stake yetkilendirilirse o kadar fazla ödül kazanır, bu nedenle hizmetleri için en düşük komisyonu sunmak amacıyla birbirleriyle rekabet edebilirler.

:::warning
Bu, Solana protokolünde bugün uygulanmasa da, gelecekte, yetkilendirenler _slashing_ olarak bilinen bir süreç aracılığıyla stake ederken token kaybetme riski ile karşılaşabilirler.
:::

Slashing, geçersiz işlemler oluşturma veya belirli türden işlemleri veya ağ katılımcılarını sansürleme gibi kasıtsal kötü niyetli davraşlara karşı bir doğrulayıcının SOL miktarının bir kısmının çıkarılması ve yok edilmesini içerir. 

Şu anda slashing'in protokol içinde bir uygulaması yoktur. Slashing hakkında daha fazla bilgi için [slashing yol haritasını](https://docs.solanalabs.com/proposals/optimistic-confirmation-and-slashing#slashing-roadmap) inceleyin.

## SOL token'larımı nasıl stake ederim?

SOL'u stake etmek için token'larınızı stake etmeyi destekleyen bir cüzdana taşıyabilirsiniz. Cüzdan, bir stake hesabı oluşturma ve yetkilendirme için adımları sağlar.

### Desteklenen Cüzdanlar

Birçok web ve mobil cüzdan, Solana stake işlemlerini desteklemektedir. Lütfen en sevdiğiniz cüzdanın bakımcılarına durum hakkında danışın.

### Solana komut satırı araçları

- Solana komut satırı araçları, bir CLI tarafından oluşturulan anahtar çift dosyası cüzdanı, bir kağıt cüzdan veya bir bağlı Ledger Nano ile birlikte tüm stake işlemlerini gerçekleştirebilir. [Solana Komut Satırı Araçları ile Stake Komutları](https://docs.solanalabs.com/cli/examples/delegate-stake).

### Stake Hesabı Oluşturma

Stake hesabı oluşturmak için cüzdanın talimatlarını izleyin. Bu hesap, sadece token göndermek ve almak için kullanılan hesaptan farklı bir türde olacaktır.

### Doğrulayıcı Seçimi

Doğrulayıcı seçimi için cüzdanın talimatlarını izleyin. Aşağıdaki bağlantılardan olası performanslı doğrulayıcılar hakkında bilgi alabilirsiniz. **Solana Vakfı**, herhangi bir özel doğrulayıcıyı tavsiye etmemektedir.

solanabeach.io sitesi, doğrulayıcılarımızdan biri olan Staking Facilities tarafından oluşturulmuş ve bakımı yapılmaktadır. Ağa genel olarak bazı yüksek düzeyde grafik bilgiler sağlar ve her doğrulayıcı ve bunların her biri hakkında bazı güncel performans istatistiklerini listeleyilir.

- https://solanabeach.io

Blok üretim istatistiklerini görüntülemek için Solana komut satırı araçlarını kullanın:

- `solana validators`
- `solana block-production`

Solana ekibi, bu bilgiyi nasıl yorumlayacağınıza dair önerilerde bulunmamaktadır. **Kendi araştırmanızı yapın.**

### Stake'inizi Yetkilendirin

Seçtiğiniz doğrulayıcıya stake'inizi yetkilendirmek için cüzdanın talimatlarını izleyin.

## Stake Hesabı Detayları

:::info
Stake hesabıyla ilişkili işlemler ve izinler hakkında daha fazla bilgi için lütfen `Stake Hesapları` sayfasını kontrol edin.
:::