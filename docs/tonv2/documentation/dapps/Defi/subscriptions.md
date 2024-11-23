# İçerik Abonelikleri

TON Blockchain üzerindeki işlemlerin hızlı ve ağ ücretlerinin düşük olması nedeniyle, akıllı sözleşmeler aracılığıyla zincir üstünde tekrarlayan ödemeleri işleme alabilirsiniz.

Örneğin, kullanıcılar dijital içeriğe (veya başka bir şeye) abone olabilir ve aylık 1 TON ücret alabilirler.

:::tip
Bu içerik v4 sürümündeki cüzdanlar için özel olarak tasarlanmıştır; daha eski cüzdanlarda bu işlevsellik yoktur; gelecekteki sürümlerde değişiklik gösterme hakkına sahiptir.
:::

:::warning
Abonelik sözleşmesi, yalnızca kurulum sırasında bir kez yetkilendirme gerektirir; ardından istediği gibi TON çekebilir. Bilinmeyen abonelikler eklemeden önce kendi araştırmanızı yapın.

Öte yandan, kullanıcı bilgisi olmadan abonelik yükleyemez.
:::

## Örnek akış

- Kullanıcılar v4 cüzdanı kullanır. Bu, işlevselliğini genişletmek için eklenti adı verilen ek akıllı sözleşmelerin kullanılmasına olanak tanır.

   İşlevselliklerinden emin olduktan sonra, kullanıcı güvenilir akıllı sözleşmelerin (eklentilerin) cüzdanının adreslerini onaylayabilir. Ardından, güvenilir akıllı sözleşmeler cüzdandan Toncoin çekebilir. Bu, bazı diğer blok zincirlerinde "Sonsuz Onay" ile benzer bir durumdur.

- Her kullanıcı ve hizmet arasında bir cüzdan eklentisi olarak aracı bir abonelik akıllı sözleşmesi kullanılır.

   Bu akıllı sözleşme, belirli bir miktar Toncoin’in, kullanıcının cüzdanından belirli bir süre içinde en fazla bir kez çekileceğini garanti eder.

- Hizmetin arka ucu, abonelik akıllı sözleşmelerine dış bir mesaj göndererek düzenli olarak ödemeleri başlatır.

- Ya kullanıcı ya da hizmet, artık bir aboneliğe ihtiyaç duymadığına karar verebilir ve aboneliği sonlandırabilir.

## Akıllı Sözleşme Örnekleri

* [Cüzdan v4 akıllı sözleşme kaynak kodu](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc)
* [Abonelik akıllı sözleşme kaynak kodu](https://github.com/ton-blockchain/wallet-contract/blob/main/func/simple-subscription-plugin.fc)

## Uygulama

İyi bir uygulama örneği, [@donate](https://t.me/donate) botu ve [Tonkeeper cüzdanı](https://tonkeeper.com) tarafından Telegram'daki özel kanallar için Toncoin üzerinde merkeziyetsiz aboneliklerdir.

:::note
Bu abonelikler, kullanıcıların içerik üreticilerine doğrudan destek olmasını sağlar. 
:::

--- 

> **Anahtar Not:** TON Blockchain, düşük işlem ücretleri ve hızlı işlem süreleri ile dikkat çekmektedir.
> — TON Blockchain Takımı

--- 


Ek Bilgi

Abonelik sistemlerinin avantajları arasında, kullanıcıların sürekli içerik akışı alması ve içerik üreticilerinin gelirlerini güvence altına alması yer almaktadır. 

