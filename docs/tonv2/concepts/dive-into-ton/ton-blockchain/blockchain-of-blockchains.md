# Blockchain of Blockchains

:::tip
Belgelere göre '**akıllı sözleşme**', '**hesap**' ve '**aktör**' terimleri, bir blockchain varlığını tanımlamak için birbirinin yerine kullanılmaktadır.
:::

## Tek aktör

Bir akıllı sözleşmeyi ele alalım.

TON'da, `address`, `code`, `data`, `balance` ve diğerleri gibi özelliklere sahip bir _şey_ dir. Diğer bir deyişle, bazı _depolama_ ve _davranış_ alanlarına sahip bir nesnedir.  
Bu davranış aşağıdaki modeli takip eder:  
* bir şey olur (en yaygın durum, bir sözleşmenin bir mesaj almasıdır)  
* sözleşme, TON Sanal Makinesinde kendi `code`'unu çalıştırarak bu olayı kendi özelliklerine göre yönetir.  
* sözleşme, kendi özelliklerini (`code`, `data` ve diğerleri) değiştirir  
* sözleşme isteğe bağlı olarak giden mesajlar üretir  
* sözleşme bir sonraki olay gerçekleşene kadar bekleme moduna geçer  

Bu adımların kombinasyonuna **işlem** denir. Olayların birer birer yönetilmesi önemlidir, dolayısıyla _işlemler_ kesin bir sıraya sahiptir ve birbirini kesintiye uğratamazlar.

Bu davranış modeli iyi bilinir ve 'Aktör' olarak adlandırılır.

### En düşük seviye: Hesap Zinciri

Bir dizi _işlem_ `Tx1 -> Tx2 -> Tx3 -> ....` bir **zincir** olarak adlandırılabilir. Ve ele alınan durumda, bu, tek bir işlem hesabı zinciri olduğu için **Hesap Zinciri** olarak adlandırılır.

Şimdi, işlemleri işleyen düğümlerin zaman zaman akıllı sözleşmenin durumunu koordine etmesi gerektiği için (bir durum hakkında _uzlaşma_ sağlamak amacıyla) bu _işlemler_ paketlenmiştir:  
`[Tx1 -> Tx2] -> [Tx3 -> Tx4 -> Tx5] -> [] -> [Tx6]`.  
Paketleme sıralamaya müdahale etmez, her işlem hala yalnızca bir 'önceki işlem'e ve en fazla bir 'sonraki işlem'e sahiptir, ancak şimdi bu sıralama **bloklara** kesilir.

Gelen ve giden mesaj kuyruklarını _bloklara_ dahil etmek de uygundur. Bu durumda, bir _blok_ akıllı sözleşmenin o blokta neler yaşandığını belirleyen ve açıklayan tam bilgi setini içerecektir.

---

## Birçok Hesap Zinciri: Parçalar

Şimdi birçok hesabı göz önünde bulunduralım. Birkaç _Hesap Zinciri_ elde edebilir ve bunları yan yana depolayabiliriz, bu tür bir _Hesap Zinciri_ setine **Parça Zinciri** denir. Benzer şekilde, **Parça Zinciri**'ni bireysel _Hesap Bloğu_'nın bir toplanması olan **Parça Bloğu**'na kesebiliriz.

### Parça Zincirlerinin Dinamik Bölünmesi ve Birleştirilmesi

Bir _Parça Zinciri_'nin kolayca ayırt edilebilen _Hesap Zincirleri_ içerdiğini göz önünde bulundurarak, onu kolayca bölebiliriz. Yani, 1 milyon hesabın olduğu olayları tanımlayan 1 _Parça Zinciri_'ne sahip olduğumuzda ve bir düğümde işlenip depolanamayacak kadar fazla işlem olduğunda, bu zinciri iki daha küçük _Parça Zinciri_'ne bölüyoruz (veya **bölüyoruz**) ve her bir zincir yarım milyon hesabı kapsıyor, her bir zincir ayrı bir düğüm alt kümesinde işleniyor.

Benzer şekilde, bazı parçalar çok boş olduğunda, birleştirilerek daha büyük bir parça haline getirilebilirler.

Açıkça iki sınırlayıcı durum vardır: parça yalnızca bir hesabı içeriyorsa (ve dolayısıyla daha fazla bölünemez) ve parça tüm hesapları içeriyorsa.

:::warning
Hesaplar mesaj göndererek birbirleriyle etkileşimde bulunabilirler. Giden kuyruklardan gelen kuyruklara mesajları taşıyan özel bir yönlendirme mekanizması vardır ve 1) tüm mesajların iletileceğini 2) mesajların sıralı bir şekilde ulaşacağını garanti eder (daha önce gönderilen mesaj, hedefe daha önce ulaşır).
:::

:::info EK NOT
Bölme ve birleştirmeyi belirlenebilir hale getirmek için, Hesap Zincirlerinin parçalara toplanması, hesap adreslerinin bit temsiline dayanır. Örneğin, adres `(parça ön eki, adres)` şeklindedir. Bu şekilde, parça zincirindeki tüm hesaplar kesinlikle aynı ikili ön eki (örneğin, tüm adresler `0b00101` ile başlar) olacaktır.
:::

---

## Blockchain

Tüm parçaların bir araya gelmesi ve bir set kuralına göre hareket eden tüm hesapları içermesi bir **Blockchain** olarak adlandırılır.

TON'da birçok kural seti olabileceğinden, aynı anda birden fazla blockchain bulunabilir ve bunlar mesaj göndererek birbirleriyle etkileşimde bulunabilirler, tıpkı bir zincirin hesaplarıyla etkileşimde bulunmaları gibi.

### İş Zinciri: Kendi Kurallarınızla Blockchain

Eğer Parça zincirlerinin grup kurallarını özelleştirmek isterseniz, bir **İş Zinciri** oluşturabilirsiniz. İyi bir örnek, Solidity akıllı sözleşmelerini çalıştırmak için EVM temelinde çalışan bir iş zinciri oluşturmaktır.

> Teorik olarak, topluluktaki herkes kendi iş zincirini oluşturabilir. Ancak, onu inşa etmek oldukça karmaşık bir iştir; sonrasında onu oluşturmak için (pahalı) bir fiyat ödemek ve İş Zincirinizi onaylamak için validatorlerden 2/3 oy almak gereklidir.  
> — Blockchain Uzmanları

TON, her biri `2^60` parçaya ayrılabilen `2^32` iş zinciri oluşturulmasına izin verir.

Günümüzde, TON'da yalnızca 2 iş zinciri vardır: MasterChain ve BaseChain.

BaseChain, aktörler arasında günlük işlemler için kullanılır çünkü oldukça ucuzdur, oysa MasterChain TON için kritik bir işleve sahiptir, bu nedenle ne yaptığını ele alalım!

### Masterchain: Blockchain of Blockchains

Mesaj yönlendirme ve işlem yürütme senkronizasyonu ihtiyacı vardır. Diğer bir deyişle, ağdaki düğümlerin çoklu zincir durumunda belirli bir 'nokta' sabitlemesi ve bu durum hakkında uzlaşma sağlaması gerekir. TON'da, bu amaçla özel bir zincir olan **MasterChain** kullanılır. _Masterchain_ blokları, sistemdeki tüm diğer zincirler hakkında ek bilgi (en son blok hash'leri) içerir, dolayısıyla herhangi bir gözlemci, tek bir masterchain bloğunda tüm çok zincirli sistemlerin durumunu kesin olarak belirleyebilir.