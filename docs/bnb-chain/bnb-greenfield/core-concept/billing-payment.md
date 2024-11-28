---
title: Fatura ve Ödeme - BNB Greenfield Temel Kavramlar
description: Bu belge, BNB Greenfield'de fatura ve ödeme süreçlerini detaylandırmakta; depolama hizmeti ücretleri, ödeme hesapları ve gaz ücretleri hakkında bilgi sunmaktadır.
keywords: [fatura, ödeme, BNB Greenfield, depolama ücreti, gaz ücretleri, blok zinciri, Superfluid]
order: 4
---

# Fatura ve Ödeme

Greenfield'de, kullanıcıların iki farklı türde ücret ödemesi gerekmektedir:

- Öncelikle, her işlem için, Greenfield doğrulayıcısına, zincir üzerinde meta veriyi yazmak için gaz ücreti ödenmesi gerekmektedir. Bu durum `Gaz ve Ücretler` bölümünde açıklanmıştır.
- İkinci olarak, Depolama Sağlayıcıları (SP'ler) kullanıcılar için depolama hizmeti ücreti talep etmektedir. Bu tür bir ödeme de Greenfield üzerinde gerçekleşmektedir.

Depolama hizmeti ücreti, [Superfluid](https://docs.superfluid.finance/superfluid/protocol-overview/in-depth-overview/super-agreements/constant-flow-agreement-cfa) gibi bir akış ödeme tarzında tahsil edilmektedir.

## Depolama Hizmeti Ücreti

Greenfield'de iki tür depolama hizmeti ücreti vardır: **nesne depolama ücreti** ve **veri paketi ücreti**.

Depolama için, Greenfield üzerinde saklanan her nesne, boyut, kopya sayıları, temel fiyat oranı ve diğer parametreler kullanılarak hesaplanan fiyatla ücretlendirilmektedir. Nesne depolandıktan sonra, depolama toplam ücreti esasen yalnızca zaman ve temel fiyatla ilişkilidir.

### Depolama ücreti hesaplaması:

```math
Depolama Ücreti = sum(ÜcretlendirilenBoyut) * (BirincilDepolamaFiyati + İkincilDepolamaFiyati*İkincilSPSayisi) * (1+Doğrulayıcı Vergi Oranı) * RezervZaman
```

Kullanıcılara, her bir kova, sahip oldukları nesnelerin bir setine karşılık gelecek şekilde veri indirmek için zaman bazlı ücretsiz bir kota verilmektedir. Kota aşıldığında, kullanıcılar ek bir kota elde etmek için veri paketlerini yükseltebilirler. **Her veri paketinin fiyatı, belirli bir süre için sabittir** (okuma fiyatı değişmedikçe ve kullanıcılar fiyat değişikliğini yansıtacak bazı işlemler yapmadıkça). Bu süre boyunca kullanıcılar yalnızca indirme süresine ve paket fiyatına göre ücretlendirilir. Bu ücretlendirme şeması, kullanıcı veri paketi ayarlarını değiştirene kadar geçerlilikte kalır.

### İndirme kota ücreti hesaplaması:

```math
İndirme Kota Ücreti = ÜcretlendirilenOkumaKota * OkumaFiyati * (1 + Doğrulayıcı Vergi Oranı) * RezervZaman
```

---

### Küresel Sanal Grup Ailesi & Küresel Sanal Grup

Depolama ücretleri, doğrudan depolama sağlayıcılara akıtılmayacaktır. Aşağıdaki adreslere aktarılacaktır:

- **veri paketi ücreti** ve birincil sp'nin **nesne depolama ücreti** için Küresel Sanal Grup Ailesi'nin sanal fonlama adresi
- Tüm ikincil sp'lerin **nesne depolama ücreti** için Küresel Sanal Grup'un sanal fonlama adresi
- Ek vergi (örneğin %1) için Doğrulayıcı vergi havuzu, bu da veri kullanılabilirlik mücadelesi bildirenleri ödüllendirmek için kullanılacaktır.

Depolama sağlayıcıları, gelirlerini çekmek istediklerinde, bağlı oldukları Küresel Sanal Grup Ailesi'nden ve Küresel Sanal Grup'tan çekim yapabilirler. **Doğrulayıcı vergi havuzu herhangi bir özel anahtar ile kontrol edilemez ve mükafat için kullanılmaktadır.**

---

### Ödeme Hesabı

Varsayılan olarak, nesne sahibinin adresi, sahip olduğu nesneler için ödeme yapmak üzere kullanılacaktır. Ancak kullanıcılar "ödem hesapları" oluşturabilir ve nesneleri farklı ödeme hesaplarına ilişkilendirerek depolama ve bant genişliği için ödeme yapabilirler.

```note
Ödeme hesabının adres formatı, normal hesaplarla aynıdır. Kullanıcı adresinin ve ödeme hesabı indeksinin hash'ine dayanarak türetilmektedir. Ancak, ödeme hesapları yalnızca mantıksaldır ve yalnızca depolama ödeme modülünde var olmaktadır.
```

Kullanıcılar, Greenfield blockchain üzerinde ödeme hesaplarına para yatırabilir, çekebilir ve bakiye sorgulayabilir ancak kullanıcılar ödeme hesaplarını staking veya diğer zincir içi işlemler yapmak için kullanamazlar. Ödeme hesapları "geri ödemesiz" olarak ayarlanabilir. Kullanıcılar, bu tür ödeme hesaplarından fon çekemezler.

:::tip
Kullanıcıların dikkat etmesi gereken bir diğer nokta da, ödeme yaparken hangi hesabın kullanıldığını kontrol etmektir.
:::

---

### Ödeme Yöneticisi

Sahip olanın adresini veya ödeme hesaplarını kullanarak depolama ve bant genişliği için ödeme yapmanın yanı sıra, kullanıcılar, kova için ödeme hesabı ayarlayıp diğerlerinin adreslerini veya ödeme hesaplarını da kullanabilirler. Ödeme hesabının sahibi, kova kullanılmadan önce akış hızı sınırını ayarlamak zorundadır. 

> Bu, kullanıcıların Greenfield'ı kullanma engelini düşürecektir çünkü depolama ve bant genişliği için ödeme yapmak üzere BNB'ye sahip olmalarına gerek kalmayacak ve Greenfield'ın oldukça karmaşık olan ücretlendirme mekanizmasını anlamalarına gerek kalmayacaktır.  
> — Kullanım kolaylığı

:::info
Bu durum, projelerin kullanıcıları için depolama ve bant genişliğini destekleme olanağını da sağlayacaktır.
:::

Daha fazla ayrıntı için [ödeme yöneticisinin BEP'sine](https://github.com/bnb-chain/BEPs/pull/362) başvurabilirsiniz.

### Zorunlu Uzlaştırma, Dondurma ve Yeniden Başlatma

Bir kullanıcı uzun bir süre boyunca para yatırmazsa, önceki yatırımı, depolanan nesneler için tamamıyla kullanılabilir. Greenfield, ek hizmet ücretleri için yeterli fonların güvence altına alınmasını sağlamak üzere **zorunlu bir uzlaştırma mekanizmasına** sahiptir.

İki yapılandırma vardır: `RezervZaman` ve `ZorunluUzlaşmaZamanı`.

Rezerv zamanı 7 gün ve zorunlu uzlaşma zamanı 1 gün olan bir örneği ele alalım. Bir kullanıcı, yaklaşık olarak aylık $0.1 ($0.00000004/saniye) fiyatla bir nesne depolamak istiyorsa, tampon bakiyesinde 7 gün için ücretleri rezerv etmesi gerekmektedir; bu, `$0.00000004 * 7 * 86400 = $0.024192` olur. Kullanıcının başlangıçta yatırdığı miktar $1 ise, akış ödeme kaydı aşağıdaki gibi olacaktır:

- **CRUD Zaman Damgası**: 100;
- **Statik Bakiye**: $0.975808;
- **Net Akış Hızı**: -$0.00000004/sn;
- **Tampon Bakiye**: $0.024192.

10.000 saniye sonra, kullanıcının dinamik bakiyesi `0.975808 - 10000 * 0.00000004 = 0.975408` olacaktır.

24.395.200 saniye (yaklaşık 282 gün) sonra kullanıcının dinamik bakiyesi negatif hale gelecektir. Kullanıcıların zamanında daha fazla fon sağlamak için kendilerini uyaran bazı alarm sistemlerine sahip olmaları gerekmektedir.

:::warning
Daha fazla fon sağlanmazsa ve dinamik bakiye ile tampon bakiyenin toplamı zorunlu uzlaşma eşiğinin altına düşerse, hesap zorla uzlaştırılacaktır. Hesabın tüm ödeme akışları kapatılacak ve hesap dondurulacaktır. Hesapla ilişkilendirilmiş tüm nesnelerin indirme hızı düşürülecektir.
:::

Eğer biri dondurulmuş bir ödeme hesabına BNB token yatırırsa ve statik bakiye ayırt edilen ücretler için yeterliyse, hesap otomatik olarak yeniden başlatılacaktır (yatırımın ödendiği yatırımlar olduğunu belirtmek önemlidir, genel transferler değildir). Genellikle, ödeme hesabı "aktif" hale hızlı bir şekilde geçecektir. Ancak, ödeme hesabıyla ilişkilendirilmiş birçok fon çıkışı varsa, ödeme hesabı yeniden başlatma için sıraya alınacak ve sonraki bloklarda işlenecektir.

---

### Düşürülmüş hizmet

Ödeme hesapları BNB'yi tükendiğinde, bu ödeme hesaplarıyla ilişkili nesnelerin indirme hizmetinde kısıtlama olacak, yani indirme hızı ve bağlantı sayıları sınırlı olacaktır. Fon ödeme hesaplarına aktarıldığında, hizmet kalitesi hemen yeniden sağlanabilir. Eğer hizmet uzun süre yeniden sağlanmazsa, SP'lerin verileri temizleme kararı, belli nesnelerin hizmetlerini durdurma biçiminde olacaktır. Böyle bir durumda, verilerin Greenfield'den tamamen silinme olasılığı vardır.

!!! uyarı
    Kullanıcılar, aboneliklerini zamanında yenilemezlerse, **depolanan verilerin kalıcı olarak silinmesi riski bulunmaktadır.** 

---

### Güven veya Değişim

Greenfield'de, kullanıcılar ile SP'ler arasında veri indirmek için bir güven ilişkisi bulunmaktadır.

İndirme bant genişliği ek ücretler gerektirdiğinden ve indirme kayıtlarının tamamen Greenfield blockchain üzerinde saklanmadığından, SP'ler kullanıcılara indirme faturası için ayrıntılı kayıtları ve indiricilerin imzalarını **erişim sağlamak amacıyla bir uç nokta arayüzü** sunmaktadır. Eğer kullanıcılar ve SP'ler fatura üzerinde anlaşamazlarsa, kullanıcılar başka bir Birincil SP'yi seçebilirler.

Daha fazla teknik detay için [akış ödeme modülü tasarımına](https://github.com/bnb-chain/greenfield/blob/doc-refactor/docs/modules/billing-and-payment.md) başvurabilirsiniz.

## Gaz ve Ücretler

Bu belge, Greenfield'in farklı işlem türlerine nasıl ücret tahsil ettiğini ve BNB Greenfield'ın token ekonomisini açıklamaktadır.

### `Gaz` ve `Ücretler`e Giriş

Cosmos SDK'de, `gaz` birimi, yürütme sırasında kaynak tüketimini izlemek için tasarlanmıştır.

Greenfield gibi uygulamaya özel blockchain'lerde, depolamanın hesaplama maliyeti, işlem ücretlerini belirleme konusunda artık ana faktör değildir, daha ziyade Greenfield'ın teşvik mekanizmasıdır. Örneğin, bir depolama nesnesi oluşturmak ve silmek benzer G/Ç ve hesaplama kaynaklarını kullanır, ancak Greenfield, kullanıcıları kullanılmayan depolama nesnelerini silmeye teşvik ederek depolama alanını optimize etmektedir; bu durum da **daha düşük işlem ücretlerine yol açmaktadır.**

**Greenfield Blockchain, Cosmos SDK'deki gaz ölçer tasarımından farklı bir yaklaşım benimsemiştir. Bunun yerine, gaz tüketimini işlem türüne ve içeriğine dayalı olarak hesaplamak için gashub modülünü yeniden tasarlamıştır, yalnızca depolama ve hesaplama kaynaklarının tüketimine dayalı değildir.**

---

Ethereum gibi ağların aksine, Greenfield işlemleri gaz fiyatı alanı içermez. Bunun yerine, bir ücret ve istenen gaz alanı içerir. Gaz fiyatı, işlem ön yürütme sürecinde ücret/gaz istenen oranı ile çıkarılır ve işlemler gaz fiyatına göre sıralanır, bunun yanında gaz fiyatı Greenfield'daki minimum gaz fiyatından daha az olmamalıdır: 5 gwei.

!!! uyarı
    Bu, Greenfield'ın işlem gönderenine fazladan gaz ücretleri iade etmediği anlamına gelir. Bu nedenle, işlemleri oluştururken, ücretlerin belirtilmesi konusunda dikkatli olunması önemlidir.
    
### GazHub

Tüm işlem türleri, gaz hesaplama mantıklarını gashub'a kaydetmek zorundadır. Şu anda, dört tür hesaplama mantığı desteklenmektedir:

**MsgGazParams_SabitTür**:
```go
type MsgGasParams_FixedType struct {
	FixedType *MsgGasParams_FixedGasParams 
}
```

**MsgGazParams_TahsisTür**:
```go
type MsgGasParams_GrantType struct {
	GrantType *MsgGasParams_DynamicGasParams 
}
```

**MsgGazParams_MultiGönderimTür**:
```go
type MsgGasParams_MultiSendType struct {
	MultiSendType *MsgGasParams_DynamicGasParams 
}
```

**MsgGazParams_TahsisİzniniVermeTür**:
```go
type MsgGasParams_GrantAllowanceType struct {
	GrantAllowanceType *MsgGasParams_DynamicGasParams 
}
```

#### Blok Gaz Ölçer

`ctx.BlockGasMeter()` her blokta gaz tüketimini izlemek ve kısıtlamak için tasarlanmış gaz ölçerdir.

Ancak, belirli türdeki işlemler Greenfield'de yüksek maliyetler gerektirebilir ve bu da önemli gaz tüketimine yol açmaktadır. Bu nedenle, Greenfield, asal blok başına gaz kullanım kısıtlaması koymamaktadır. Bunun yerine, Greenfield, blokların 1 MB'yi aşmasını önlemek için bir blok boyut sınırı belirler ve aşırı büyük bloklar riskini azaltır.

!!! bilgi
Greenfield Blockchain'de bir blok için gaz sınırlaması yoktur.

---
description: Bu belge, gaz ücretlerinin güncellenmesi ve mevcut ücret tablosunu içermektedir. Kullandığınız gaz türüne göre beklenen ücretleri detaylandırmaktadır.
keywords: [gaz, ücret tablosu, Cosmos, güncelleme, BNB]
---

### Ücret Tablosu

Lütfen gaz ücretinin yönetim aracılığıyla güncellenebileceğini ve bunun belgelerde hemen yansımayabileceğini unutmayın. 

:::tip
Gaz ücretlerini güncellerken dikkatli olun; güncellemelerin belgelerde anında yansıdığını unutmayın.
:::

| Mesaj Tipi                                  | Kullanılan Gaz      | Gaz Fiyatı | Beklenen Ücret (BNB $200 varsayarak) |
|---------------------------------------------|--------------------|------------|-------------------------------------|
| /cosmos.auth.v1beta1.MsgUpdateParams        | 0                  | 5 gwei     | $0.00000000                         |
| /cosmos.bank.v1beta1.MsgUpdateParams        | 0                  | 5 gwei     | $0.00000000                         |
| /cosmos.consensus.v1.MsgUpdateParams        | 0                  | 5 gwei     | $0.00000000                         |
| /cosmos.crisis.v1.MsgUpdateParams           | 0                  | 5 gwei     | $0.00000000                         |
| /cosmos.crosschain.v1.MsgUpdateParams       | 0                  | 5 gwei     | $0.00000000                         |
| /cosmos.crosschain.v1.MsgUpdateChannelPermissions | 0                  | 5 gwei     | $0.00000000                         |
| /cosmos.distribution.v1beta1.MsgUpdateParams | 0                  | 5 gwei     | $0.00000000                         |
| /cosmos.gashub.v1beta1.MsgUpdateParams      | 0                  | 5 gwei     | $0.00000000                         |
| /cosmos.gov.v1.MsgUpdateParams              | 0                  | 5 gwei     | $0.00000000                         |
| /cosmos.mint.v1beta1.MsgUpdateParams        | 0                  | 5 gwei     | $0.00000000                         |
| /cosmos.oracle.v1.MsgUpdateParams           | 0                  | 5 gwei     | $0.00000000                         |
| /cosmos.slashing.v1beta1.MsgUpdateParams    | 0                  | 5 gwei     | $0.00000000                         |
| /cosmos.staking.v1beta1.MsgUpdateParams     | 0                  | 5 gwei     | $0.00000000                         |
| /greenfield.bridge.MsgUpdateParams          | 0                  | 5 gwei     | $0.00000000                         |
| /greenfield.sp.MsgUpdateParams              | 0                  | 5 gwei     | $0.00000000                         |
| /greenfield.storage.MsgUpdateParams         | 0                  | 5 gwei     | $0.00000000                         |
| /greenfield.payment.MsgUpdateParams         | 0                  | 5 gwei     | $0.00000000                         |
| /greenfield.challenge.MsgUpdateParams       | 0                  | 5 gwei     | $0.00000000                         |
| /greenfield.permission.MsgUpdateParams      | 0                  | 5 gwei     | $0.00000000                         |

:::note
Aşağıdaki mesaj türleri için beklenen ücretler, gaz limitine ve beklenen gaz fiyatına dayanmaktadır.
:::

> **Not:** Gaz fiyatları ve ücretler mevcut koşullara bağlı olarak değişiklik gösterebilir.  
> — Greenfield Geliştirme Ekibi

| Mesaj Tipi                                  | Kullanılan Gaz      | Gaz Fiyatı | Beklenen Ücret (BNB $200 varsayarak) |
|---------------------------------------------|--------------------|------------|-------------------------------------|
| /cosmos.authz.v1beta1.MsgExec               | 1200               | 5 gwei     | $0.00120000                         |
| /cosmos.authz.v1beta1.MsgRevoke             | 1200               | 5 gwei     | $0.00120000                         |
| /cosmos.bank.v1beta1.MsgSend                | 1200               | 5 gwei     | $0.00120000                         |
| /cosmos.distribution.v1beta1.MsgSetWithdrawAddress | 1200               | 5 gwei     | $0.00120000                         |
| /cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward | 1200               | 5 gwei     | $0.00120000                         |

:::warning
Gaz fiyatlarının artışı, beklenen ücretleri doğrudan etkileyebilir, bu nedenle işlem öncesinde fiyatları kontrol etmek önemlidir.
:::

Daha fazla detay için [Greenfield Gaz Parametreleri](https://greenfield-chain.bnbchain.org/cosmos/gashub/v1beta1/msg_gas_params) bağlantısını inceleyebilirsiniz.