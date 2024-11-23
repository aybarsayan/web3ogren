# Kütüphane Hücreleri

## Giriş
TON'un hücrelerde verileri nasıl depoladığına dair yerel özelliklerden biri olan deduplike etme: depolamada mesajlar, bloklar, işlemler vb. gibi kopya hücreler yalnızca bir kez saklanır. Bu, seri hale getirilmiş verilerin boyutunu büyük ölçüde azaltır ve adım adım güncellenen verilerin verimli depolanmasına olanak tanır.

Aynı nedenle TON'daki birçok yapı aynı anda zengin, kullanışlı ve verimlidir: blok yapısı, her mesajın birden fazla yerde aynı kopyasını içerir: Mesaj kuyruğunda, İşlem listesinin içinde, Merkle güncellemelerinde vb. :::note 
Çoğaltmanın ek bir yükü olmadığı için, verileri ihtiyaç duyduğumuz yerlerde birden fazla kez saklayabiliriz, verimlilik endişesi duymadan.
:::

Kütüphane hücreleri, bu teknolojiyi özel akıllı sözleşmelere entegre etme olanağı sağlayan bir deduplike etme mekanizması kullanır.
:::info
Örneğin jetton-cüzdan kodunu kütüphane hücresi olarak saklarsanız (1 hücre ve 256+8 bit, yaklaşık 20 hücre ve 6000 bit yerine), `init_code` içeren bir mesaj için iletim ücretleri 0.011'den 0.003 TON'a düşecektir.
:::

## Genel Bilgiler

Blok 1'000'000'dan blok 1'000'001'e temel zincir adımını göz önünde bulunduralım. Her blok küçük bir veri miktarı (genellikle 1000 işlemden daha az) içerirken, tüm Temel zincir durumu milyonlarca hesap içerir ve blokzincirin verilerin bütünlüğünü koruması gerektiği için (özellikle tüm durumun Merkle kök hash'ini bloğa taahhüt etmek) durumun tüm ağacının güncellenmesi gerekmektedir.

Önceki nesil blok zincirleri için bu, genellikle yalnızca yakın durumları takip ettiğiniz anlamına gelir çünkü her blok için ayrı zincir durumlarını depolamak çok fazla alan gerektirecektir. Ancak TON Blok Zinciri'nde deduplike etme sayesinde, her blok için yalnızca yeni hücreler eklenir. Bu, işleme süresini hızlandırmakla kalmaz, aynı zamanda geçmişle verimli bir şekilde çalışma olanağı da tanır: :::tip 
Bakiyeleri kontrol edebilir, durumları inceleyebilir ve geçmişteki herhangi bir noktada get yöntemlerini çalıştırabilirsiniz.
:::

Benzer sözleşmelerin bir ailesi (örneğin jetton-cüzdanlar) durumunda, düğüm, çoğaltılan verileri (her jetton-cüzdanın aynı kodunu) yalnızca bir kez saklar. Kütüphane Hücreleri, böyle sözleşmeler için depolamayı ve iletim ücretlerini azaltmak amacıyla deduplike etme mekanizmasından faydalanmayı sağlar.

:::info Yüksek Seviye Analoji
Kütüphane hücresini C++ işaretçisi olarak düşünebilirsiniz: birçok referansa sahip (belki de) daha büyük bir Hücreyi işaret eden bir küçük hücre. Referans verilen hücre (kütüphane hücresinin işaret ettiği hücre) mevcut olmalı ve genel bağlamda (_"yayınlanmış"_) olarak kaydedilmiş olmalıdır.
:::

## Kütüphane Hücrelerinin Yapısı

Kütüphane hücresi, başka bir statik hücreye referans içeren `egzotik hücre`dir. Özellikle, referans verilen hücrenin 256 bit'lik hash'ini içerir.

TVM için, kütüphane hücreleri şöyle çalışır: TVM, bir hücreyi dilime açma komutu aldığında (TVM Talimatı: `CTOS`, funC metodu: `.begin_parse()`), kütüphane hücresinden karşılık gelen hash ile hücreyi Masterchain kütüphane bağlamında arar. Bulduğunda, referans verilen hücreyi açar ve dilimini döndürür.

Kütüphane hücresini açmak, sıradan bir hücreyi açmakla aynı maliyete sahiptir, bu nedenle, çok daha az yer kaplayan statik hücreler için şeffaf bir alternatif olarak kullanılabilir (ve dolayısıyla depolama ve gönderim için daha düşük ücretler söz konusu olur).

Referans verilen hücrenin hash'ini içerdiği için, Kütüphane Hücresinin önemli bir özelliği, nihayetinde bazı statik verilere referans olmasıdır. Bu kütüphane hücresine referans verilen veriyi değiştiremezsiniz.

Masterchain kütüphane bağlamında bulunabilmek ve dolayısıyla bir Kütüphane Hücresince referans alınabilmek için, kaynak Hücrenin Masterchain'de yayınlanması gerekir. Bu, Masterchain'de mevcut bir akıllı sözleşmenin bu hücreyi `public=true` bayrağı ile durumuna eklemesi gerektiği anlamına gelir. Bu, `SETLIBCODE` opcode'u kullanılarak gerçekleştirilebilir.

## Akıllı Sözleşmelerde Kullanım

Kütüphane hücresi, ücret hesaplaması dışındaki tüm bağlamlarda bir sıradan hücre gibi davrandığı için, statik verilerle ilişkilendirilmiş herhangi bir hücre yerine kullanılabilir. Örneğin, jetton-cüzdan kodunu kütüphane hücresi olarak saklayabilirsiniz (böylece 1 hücre ve 256+8 bit, genellikle ~20 hücre ve 6000 bit yerine) bu durum, depolama ve iletim ücretlerinde belirgin bir düşüşü sağlayacaktır. Özellikle, `init_code` içeren `internal_transfer` mesajı için iletim ücretleri 0.011'den 0.003 TON'a düşecektir.

### Kütüphane Hücresinde Veri Saklama
Öncelikle, iletim ücretlerini azaltmak amacıyla jetton-cüzdan kodunu kütüphane hücresi olarak saklama örneğini göz önünde bulunduralım. İlk olarak, jetton-cüzdanı içeren sıradan bir hücreye derlememiz gerekiyor.

Sonra, sıradan hücreye referans içeren bir kütüphane hücresi oluşturmalısınız. Kütüphane hücresi, 256 bit referans verilen hücre hash'inin ardından gelen 8 bitlik kütüphane etiketi `0x02` içerir.

### Fift'de Kullanım
Temelde etiketi ve hash'i yapıcıya koymanız ve ardından "yapıcıyı egzotik hücre olarak kapatmanız" gerekir.

Bu, Fift-asm yapısında [şu şekilde](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/auto/order_code.func) yapılabilir; bazı sözleşmeleri doğrudan kütüphane hücresine derleme örneğini ise [burada](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/wrappers/Order.compile.ts) bulabilirsiniz.

```fift
;; https://docs.ton.org/tvm.pdf, sayfa 30
;; Kütüphane referans hücresi - Daima seviye 0'a sahiptir ve 8+256 veri biti içerir, 
;; bunun içinde 2 sayısının 8 bitlik türü ve referans aldığı kütüphane hücresinin hash'inin temsili Hash(c) vardır. 
;; Yüklendiğinde, bir kütüphane referans hücresi, eğer mevcut kütüphane bağlamında bulunursa, referans aldığı hücre ile şeffaf bir şekilde değiştirilir.

cell order_code() asm "<b 2 8 u, 0x6305a8061c856c2ccf05dcb0df5815c71475870567cab5f049e340bcf59251f3 256 u, b>spec PUSHREF";
```
### @ton/ton'da Kullanım
Alternatif olarak, `@ton/ton` kütüphanesi ile Blueprint'te kütüphane hücresini tamamen ts seviyesinde oluşturabilirsiniz:

```ts
import { Cell, beginCell } from '@ton/core';

let lib_prep = beginCell().storeUint(2,8).storeBuffer(jwallet_code_raw.hash()).endCell();
jwallet_code = new Cell({ exotic:true, bits: lib_prep.bits, refs:lib_prep.refs});
```

* Kaynağı [buradan](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L104C1-L105C90) öğrenebilirsiniz.

### Sıradan Hücreyi Masterchain Kütüphane Bağlamında Yayınlama
Pratik bir örnek [burada](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/helper/librarian.func) mevcuttur. Bu sözleşmenin temeli `set_lib_code(lib_to_publish, 2);` - yayınlanması gereken sıradan hücreyi ve bayrak=2 (yani herkesin kullanabileceği) kabul eder.

Hücre yayınlayan sözleşmenin depolama masraflarını ödediğini unutmayın ve Masterchain'deki depolama, Temel zincirdekinin 1000 katıdır. Bu nedenle, kütüphane hücresi kullanımı yalnızca binlerce kullanıcı tarafından kullanılan sözleşmeler için etkilidir.

### Blueprint'te Test Etme

Kütüphane Hücreleri kullanan bir sözleşmenin Blueprint'te nasıl çalıştığını test etmek için, referans hücrelerini manuel olarak Blueprint emülatörünün kütüphane bağlamına eklemeniz gerekir. Bunu şu şekilde yapabilirsiniz:
1) İlgili Hücrenin hash'inin `uint256->Cell` şeklinde bir kütüphane bağlamı sözlüğü (Hashmap) oluşturmalısınız.
2) Kütüphane bağlamını emülatör ayarlarına kurmalısınız.

Bunun nasıl yapılacağını [şu şekilde](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L100C9-L103C32) görebilirsiniz.

:::info
Mevcut blueprint sürümünün (`@ton/blueprint:0.19.0`) bazı sözleşmeler emülasyon sırasında yeni bir kütüphane yayınladığında otomatik olarak kütüphane bağlamını güncellemeyeceğini unutmayın; bunu manuel olarak yapmanız gerekir.
04.2024 için geçerlidir ve yakında iyileştirilmesi beklenmektedir.
:::

### Kütüphane Hücre Temelli Sözleşmeler İçin Get Yöntemleri

Jetton-cüzdanınız var ve kodu bir kütüphane hücresinde saklı ve bakiyeyi kontrol etmek istiyorsunuz.

Bakiyesini kontrol etmek için, kod içinde bir get metodunu çalıştırmanız gerekir. Bu, şu işlemleri içerir:
- kütüphane hücresine erişmek
- referans verilen hücrenin hash'ini almak
- masterchain'in kütüphane koleksiyonunda o hash ile hücreyi bulmak
- oradan kodu çalıştırmak.

Katmanlı Çözümler (LS) kullanırken, tüm bu süreçler arka planda kullanıcı spesifik kod depolama yönteminden haberdar olmadan gerçekleşir.

Ancak, yerel çalışmalarda durum farklıdır. Örneğin, bir gezgin veya cüzdan kullanıyorsanız, bir hesap durumunu alabilir ve türünü belirlemeye çalışabilirsiniz - bunun bir NFT, cüzdan, token veya açık artırma olup olmadığını.

Sıradan sözleşmeler için mevcut get yöntemlerini, yani arayüzü göz önünde bulundurarak anlayabilirsiniz. Ya da bir hesap durumunu alıp yerel sahte ağımda yöntemleri orada çalıştırabilirsiniz.

Ancak bir kütüphane hücresi için bu mümkün değildir çünkü kendi başına veri içermez. Gerekli hücreleri bağlamdan manuel olarak algılamanız ve almanız gerekir. Bu, LS aracılığıyla yapılabilir (ancak bağlılıklar henüz bunu desteklememektedir) veya DTon aracılığıyla.

#### Liteserver ile Kütüphane Hücresini Alma
Liteserver, get yöntemleri çalıştırıldığında otomatik olarak doğru kütüphane bağlamı set eder. Eğer get yöntemleri ile sözleşme türünü tespit etmek veya yerel olarak get yöntemlerini çalıştırmak istiyorsanız, ilgili hücreleri LS yöntemiyle [liteServer.getLibraries](https://github.com/ton-blockchain/ton/blob/4cfe1d1a96acf956e28e2bbc696a143489e23631/tl/generate/scheme/lite_api.tl#L96) üzerinden indirmeniz gerekir.

#### DTon ile Kütüphane Hücresini Alma
Ayrıca kütüphaneyi [dton.io/graphql](https://dton.io/graphql) üzerinden alabilirsiniz:
```
{
  get_lib(
    lib_hash: "<HASH>"
  )
}
```
belirli bir masterchain bloğu için kütüphaneler listesi:
```
{
  blocks{
    libs_publishers
    libs_hash
  }
}
```

## Ayrıca Bakınız

* `Egzotik Hücreler`
* `TVM Talimatları`