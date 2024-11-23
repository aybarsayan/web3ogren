---
title: Vault Sözleşmesi
---



#####  (Son güncelleme: 15 Ağustos 2022)

##### 

Vault, `IST` (Agoric sabit değerli para birimi) kullanıcılara sunmanın ana mekanizmasıdır. Bunu, desteklenen teminat türlerine karşı kredi vererek gerçekleştirir. Sözleşmenin yaratıcısı, yeni teminat türleri ekleyebilir. (Bu, sözleşme başlatıldığında başlangıç para birimleri tanımlandıktan sonra zincir üstü yönetişim kontrolünde olması beklenmektedir.)

## Borç Alanlar

Borç alanlar, kamu API'sinde `makeVaultInvitation()` çağrısı yaparak bir davetiye alarak bir **vault** açarlar. Teklifleri, tanınmış bir teminat türü verdiklerini ve karşılığında ne kadar `IST` almak istediklerini belirtir. Sözleşme, her para birimi için bir teminatlandırma oranı ile parametrelenmiştir ve borç alanlar bu orana kadar para çekebilirler. Diğer parametreler faiz oranını kontrol eder. (Faiz, otomatik olarak vault'un borcuna eklenecektir.) Sözleşme ayrıca, teminatın piyasa değerini izleyen bir oracle olan bir priceAuthority'ye erişim sağlar. Eğer bir borç alanın teminatının değeri en düşük oranın altına düşerse, vault tasfiye edilir. Tasfiye yaklaşımı değiştirilebilir ve yönetişim kontrolünde modifiye edilebilir.

Borç alanlar, bir davetiye kullanarak teminat yatırdıklarında, kendilerine bir `Vault` nesnesi ve teklif sonuçlarından cüzdanları için faydalı bazı araçlar alırlar. `Vault` şunları içeren yöntemlere sahiptir: `{ makeAdjustBalancesInvitation, makeCloseInvitation, getCollateralAmount, getDebtAmount, getLiquidationSeat, getLiquidationPromise }`.

Bir `AdjustBalancesInvitation`, borç alanın teminat eklemesine veya çıkarmasına ya da kredi bakiyesini artırmasına veya azaltmasına olanak tanır. `CloseInvitation`, borç alanın kredilerini kapatmasına ve kalan teminatı geri çekmesine olanak tanır. `liquidationPromise`, borç alanın kredisinin ne zaman tasfiye olduğunu öğrenmesine izin verir. `liquidationSeat`'in `getPayoff()` veya `getPayoffs()` yöntemleri, borç alanın borcu ödemek için gerekli olandan fazlasını almasını sağlar. `getCollateralAmount()` ve `getDebtAmount()` yalnızca adlandırılmış bakiyeleri gösterir.

### adjustBalances

Borç alan, `Collateral` ve `IST` miktarını belirten bir teklif ile `AdjustBalancesInvitation` kullanarak teminat ve borç seviyelerini ayarlayabilir. Sonuçta oluşan bakiyeler gereken oranları ihlal etmediği ve çekim işlemleri kredinin mevcut bakiyesi içinde olduğu sürece, ayarlamalar yapılacaktır. Eğer borç bakiyesi artarsa, artış miktarının `loanFee` ile çarpımı borç bakiyesine eklenecektir.

### closeInvitation

Borç alan, bir `closeInvitation` kullanarak kredilerini kapatabilir. Borç alan, krediyi kapatmak ve teminatını geri almak için mevcut `debtAmount`'ın en azından kadarını vermelidir. Herhangi bir fazla miktar geri döneceğinden, fiyat değişikliklerini kapsamak için fazla ödemek güvenlidir.

### Faiz ve Tasfiye

Her bir teminat türüne özgü olan ve yönetişim altında belirlenen parametreler, faiz oranını ve gerekli teminatlandırma oranını ayarlar.

`liquidationMargin`, bir vault açmak ve onu açık tutmak için gereken `collateralizationRatio`'dur. Teminatın mevcut değerinin (şu anda AMM tarafından yönlendirilen `priceAuthority`ya göre) borcun toplamına oranı `liquidationMargin`'ın altına düşerse, teminat satılacak, borç geri ödenecek ve kalan miktar borç alana iade edilecektir. Bu nedenle, borç alanların fiyat dalgalanmaları ve faiz ücretlerinin hızlı bir şekilde kredilerini temerrüde düşürmemesi için aşırı teminat sağlamak akıllıca bir yaklaşımdır.

`loanFee` (baz puan cinsinden), kredi açıldığında veya kredi miktarı artırıldığında verilen `IST` miktarına uygulanır. `interestRate`, yıllık bir orandır.

`ChargingPeriod` ve `recordingPeriod`, Vault'un tüm kredilere uygulanan parametreleridir. Faizlerin ne sıklıkla biriktiğini ve ne sıklıkla compounding (bileşiklik) yapıldığını değiştirmek için yönetişim tarafından ayarlanabilir.

#### UI Desteği

Aşağıdakiler, kullanıcının  için `openLoan` çağrısı yapıldığında `offerResults` içinde döner:

     uiNotifier,
     invitationMakers: { AdjustBalances, CloseVault }

## Teminat Türleri Ekleme

creatorFacet'in `addVaultType()` adında bir metodu vardır; bu metot yeni teminat türleri eklemeye ve bunların kredileri için parametreleri belirlemeye olanak sağlar.

## Uygulama Detayları

### Vats

Şu anda VaultFactory, tüm `vaults`'ı tek bir vat içinde çalıştırmaktadır. Daha iyi bir izolasyon sağlamak için `vaults`'ı ayrı ayrı vatlara bölmeyi amaçlıyoruz. Tasfiye yaklaşımının modifiye edilebilir ve yönetişim tarafından görünür ve değiştirilebilir olması için, tasfiye işlemi ayrı bir vat içinde gerçekleştirilecektir.

### Davetiyeler

#### makeLoan

Vault'un kamu API'si, `makeVaultInvitation()`, `getCollaterals()`, `getAMM()` ve `getRunIssuer()`'ı içerir. `getCollaterals()`, kabul edilen teminat türlerinin bir listesini döndürür. `getAmm()` AMM'nin kamu yüzeyini döndürür. `getRunIssuer()`, `IST`'nin ihracına erişim sağlayarak herkesin IST'yi tutmasına, harcamasına ve tanımasına olanak sağlar. `makeVaultInvitation()`, yukarıda  altında açıklanmıştır.