---
sidebarSortOrder: 4
title: Durum Sıkıştırma
description:
  'Durum Sıkıştırma, pahalı hesaplar yerine, Solana defterinde
  "parmak izlerini" ucuz ve güvenli bir şekilde depolama yöntemidir.'
---

Solana'da, `Durum Sıkıştırma`, offchain verilerin bir "parmak izi" (veya hash) oluşturulması ve bu parmak izinin güvenli doğrulama için on-chain olarak depolanması yöntemidir. Offchain verileri güvenli bir şekilde doğrulamak için Solana defterinin güvenliğinden etkili bir şekilde yararlanarak verilerin değiştirilmediğini doğrular.

Bu "sıkıştırma" yöntemi, Solana programlarının ve dApp'lerin verileri güvenli bir şekilde depolamak için daha pahalı `hesap` alanı yerine ucuz blockchain `defter` alanı kullanmalarına olanak tanır.

Bu, her bir veri parçasının (bir `leaf` olarak adlandırılır) hash'ini yaratmak için bilinen bir `eşzamanlı merkle ağacı` olarak bilinen özel bir ikili ağaç yapısını kullanarak, bunları bir araya getirip, yalnızca bu nihai hash'i on-chain olarak depolamak suretiyle gerçekleştirilir.

## Durum Sıkıştırma Nedir?

Basit terimlerle, durum sıkıştırma, offchain verileri kriptografik olarak bir arada hashlemek için "**_ağaç_**" yapılarını deterministik bir şekilde kullanarak, on-chain depolanan tek bir nihai hash hesaplamak için kullanılır.

Bu _ağaçlar_, bu "_deterministik_" süreç aracılığıyla şöyle oluşturulur:

- herhangi bir veri parçasını almak
- bu verinin hash'ini oluşturmak
- bu hash'i ağacın alt kısmına `leaf` olarak depolamak
- her `leaf` çiftinin ardından birlikte hash'lenmesi, bir `branch` oluşturmak
- her `branch`'ın ardından birlikte hash'lenmesi
- sürekli olarak ağacın tepesine doğru tırmanmak ve komşu branch'ları birlikte hash'lemek
- ağacın tepe noktasına ulaştığında, nihai bir `root hash` üretmek

Bu `root hash`, ardından kaydedilen verilerin **_kanıt_** olarak on-chain depolanır. Böylece herhangi biri, ağacın içinde bulunan tüm offchain verileri kriptografik olarak doğrulayabilirken, yalnızca **minimal** bir veri miktarını on-chain olarak depolamaktadır. Dolayısıyla, bu "durum sıkıştırması" nedeniyle büyük veri miktarlarını depolama/kanıtlama maliyetini önemli ölçüde azaltmaktadır.

:::info
Durum sıkıştırma süreci, verilerin yüksek doğrulama güvenliğini sağlarken maliyetleri de düşürmeyi hedefler.
:::

## Merkle Ağaçları ve Eşzamanlı Merkle Ağaçları

Solana'nın durum sıkıştırması, herhangi bir ağaçta birden fazla değişikliğin gerçekleşmesine olanak tanıyan özel bir tür `merkle ağacı` kullanmaktadır, bu sayede ağacın bütünlüğü ve geçerliliği korunur.

Bu özel ağaç, "`eşzamanlı merkle ağacı`" olarak bilinir ve etkin bir şekilde ağacın on-chain kayıtlı "değişiklik günlüğünü" tutar. Aynı ağaçta (örneğin, aynı blokta) birden fazla hızlı değişikliğe olanak tanır ki bu, bir kanıtın geçerliliğinin hala devam etmesine ve geçersiz hale gelmemesine olanak tanır.

### Merkle Ağacı Nedir?

Bir [merkle ağacı](https://en.wikipedia.org/wiki/merkle_tree), bazen "hash ağacı" olarak adlandırılan, her `leaf` düğümünün iç verilerinin kriptografik hash'i olarak temsil edildiği hash tabanlı bir ikili ağaç yapısıdır. Ve `leaf` olmayan her düğüm, `branch` olarak adlandırılır ve bu, çocuk leaf hash'lerinin hash'i olarak temsil edilir.

Her branch, ardından ağaçta yukarı doğru hash'lenir, nihayetinde tek bir hash kalır. Bu nihai hash, `root hash` veya "root" olarak adlandırılır ve ardından, bir "kanıt yolu" ile herhangi bir `leaf` düğümüne depolanan veriyi doğrulamak için kullanılabilir.

Nihai bir `root hash` hesaplandıktan sonra, herhangi bir `leaf` düğümünde depolanan veri, belirli bir leaf'in verisini tekrar hash'leyerek ve ağacın yukarısında bulunan her komşu branch'ın hash etiketini (bu, `proof` veya "kanıt yolu" olarak bilinir) tekrar hash'leyerek doğrulanabilir. Bu "rehash", `root hash` ile karşılaştırıldığında, altındaki leaf verisinin doğrulamasını temsil eder. Eğer eşleşirlerse, veriler doğru olduğu doğrulanmış olur. Eğer eşleşmezlerse, leaf verisi değiştirilmiştir.

> Leaf verisini değiştirme ve yeni bir root hash hesaplama süreci, merkle ağaçlarını kullanırken **çok yaygın** bir durum olabilir! Bu, ağacın tasarım noktalarından biri olsa da, en belirgin dezavantajlardan birine yol açabilir: hızlı değişiklikler.

### Eşzamanlı Merkle Ağacı Nedir?

Yüksek işlem hacmine sahip uygulamalarda, `Solana runtime` içinde, bir on-chain _geleneksel merkle ağacında_ değişiklik talepleri, doğrulayıcılar tarafından birbirini takip eden hızlı bir şekilde alınabilir (örneğin, aynı slot içinde). Her leaf veri değişikliği hâlâ sırayla gerçekleştirilmelidir. Bu, her bir ardışık değişiklik talebinin, slot içindeki önceki değişiklik talebi nedeniyle root hash ve kanıtın geçersiz hale gelmesi nedeniyle başarısız olmasına yol açar.

Burada, Eşzamanlı merkle ağaçları devreye giriyor.

Bir **Eşzamanlı merkle ağacı**, en son değişikliklerin, onların root hash'inin ve bunu türetmek için kanıtın **güvenli bir değişiklik günlüğünü** depolar. Bu değişiklik günlüğü "tampon" on-chain'de her ağaç için belirli bir hesapta depolanır ve belirli bir maksimum değişiklik günlüğü "kaydı" sayısıyla (alias `maxBufferSize`) sınırlıdır.

:::note
Eşzamanlı merkle ağaçları, yüksek işlem hacmini desteklemek için geliştirilmiştir.
:::

Aynı slot içinde doğrulayıcılar tarafından birden fazla leaf veri değişiklik talebi alındığında, on-chain _eşzamanlı merkle ağacı_ bu "değişiklik günlüğü tamponunu" daha kabul edilebilir kanıtlar için bir gerçeklik kaynağı olarak kullanabilir. Bu, aynı slot içinde aynı ağaç için `maxBufferSize` kadar değişikliğe olanak tanır. İşlem hacmini önemli ölçüde artırır.

## Eşzamanlı Merkle Ağaç Boyutu Belirleme

Bu on-chain ağaçlardan birini oluştururken, ağacınızın boyutunu, ağaç oluşturma maliyetini ve ağacınızdaki eşzamanlı değişiklik sayısını belirleyecek 3 değere sahipsiniz:

1. maksimum derinlik
2. maksimum tampon boyutu
3. canopy derinliği

### Maksimum Derinlik

Bir ağacın "maksimum derinliği," herhangi bir veri `leaf`'inden ağacın `root`'una ulaşmak için gereken **maksimum adım sayısı**dır.

Merkle ağaçları ikili ağaçlar olduğundan, her leaf yalnızca **bir** diğer leaf ile bağlanır; bir `leaf çifti` olarak mevcut bulunur.

Bu nedenle, bir ağacın `maxDepth`'i, ağacın içinde depolanacak maksimum düğüm sayısını (aka veri parçaları veya `leafs`) belirlemek için kullanılır ve bu basit hesaplama ile gerçekleştirilir:

```text
nodes_count = 2 ^ maxDepth
```

Bir ağacın derinliği, ağaç oluşturma aşamasında ayarlanması gerektiğinden, ağacınızın ne kadar veri depolamak istediğinize karar vermelisiniz. Ardından yukarıdaki basit hesaplama ile, verilerinizi depolamak için gereken en düşük `maxDepth`'i belirleyebilirsiniz.

#### Örnek 1: 100 NFT Mintlemek

Eğer 100 sıkıştırılmış NFT depolamak için bir ağaç oluşturmak istiyorsanız, en az "100 leaf" veya "100 düğüm" gerekecektir.

```text
// maxDepth=6 -> 64 düğüm
2^6 = 64

// maxDepth=7 -> 128 düğüm
2^7 = 128
```

Tüm verilerimizi depolayabilmek için `maxDepth` değerini `7` kullanmak zorundayız.

#### Örnek 2: 15000 NFT Mintlemek

Eğer 15000 sıkıştırılmış NFT depolamak için bir ağaç oluşturmak istiyorsanız, en az "15000 leaf" veya "15000 düğüm" gerekecektir.

```text
// maxDepth=13 -> 8192 düğüm
2^13 = 8192

// maxDepth=14 -> 16384 düğüm
2^14 = 16384
```

Tüm verilerimizi depolayabilmek için `maxDepth` değerini `14` kullanmak zorundayız.

:::warning
Maksimum derinlik arttıkça maliyet de artar. `maxDepth` değeri, bir ağacı oluştururken maliyetin ana belirleyicilerinden biri olacaktır.
:::

### Maksimum Tampon Boyutu

"Maksimum tampon boyutu", bir ağaçtaki değişikliklerin hâlâ geçerli `root hash` ile gerçekleşebileceği maksimum değişiklik sayısını ifade eder.

Root hash, etkin bir şekilde tüm leaf verilerin tek bir hash'i olduğundan, herhangi bir leaf'i değiştirmek, bir düzenli ağacın tüm ardışık değişiklik talepleri için gereken kanıtı geçersiz kılacaktır.

Ancak bir `eşzamanlı ağaç` ile, bu kanıtlar için güncellemelerin bir değişiklik günlüğü vardır. Bu değişiklik günlüğü tamponu, ağaç oluşturma aşamasında `maxBufferSize` değeri ile boyutlandırılır ve ayarlanır.

### Canopy Derinliği

"Canopy derinliği," aynı zamanda canopy boyutu olarak da bilinir, belirli bir kanıt yolu için on-chain depolanan veya önbelleğe alınan kanıt düğüm seviyelerinin sayısını ifade eder.

Bir `leaf` üzerinde, mülkiyet transferi (örneğin bir sıkıştırılmış NFT'nin satışı gibi) gibi bir güncelleme eylemi gerçekleştirirken, **tam** kanıt yolu, leaf'in orijinal mülkiyetini doğrulamak ve bu nedenle güncelleme eylemine izin vermek için kullanılmalıdır. Bu doğrulama, geçerli `root hash`'i (veya on-chain'deki "eşzamanlı tampon" aracılığıyla herhangi bir önbelleğe alınmış `root hash`) doğru bir şekilde hesaplamak için **tam** kanıt yolunu kullanarak gerçekleştirilir.

Birikmiş bir ağacın maksimum derinliği ne kadar fazla olursa, bu doğrulamayı gerçekleştirirken o kadar çok kanıt düğümüne ihtiyaç duyulur. Örneğin, maksimum derinliğiniz `14` ise, doğrulamak için `14` toplam kanıt düğümü gerekir. Bir ağaç büyüdükçe, tam kanıt yolu da büyür.

Normalde, bu kanıt düğümlerinin her biri, her ağaç güncelleme işlemine dahil edilmesi gerekir. Çünkü her kanıt düğümü değeri, bir işlemde `32 byte` yer kaplar (bir public key sağlamaya benzer) ve daha büyük ağaçlar çok hızlı bir şekilde maksimum işlem boyutu sınırını aşabilir.

Burada canopy devreye giriyor. Canopy, belirli bir kanıt yolu için belirli sayıda kanıt düğümünü on-chain'de depolamayı mümkün kılar. Her güncelleme işleminde daha az kanıt düğümünün dahil edilmesini sağladığından, genel işlem boyutunu sınırın altında tutar.

![Maksimum derinliği 3 olan Bir Eşzamanlı Merkle Ağacında 1'lik Canopy Derinliği](../../images/solana/public/assets/docs/compression/canopy-depth-1.png)

Başka bir örnek olarak, bu sefer maksimum derinliği `3` olan bir ağaçla düşünelim. Eğer ağacın `R4`'üne bir eylem uygulamak istersek, `L4` ve `R2` için kanıt sunmamız gerekir. Ancak, `R1`'i hariç tutabiliriz, çünkü, canopy derinliğimiz `1` olması sayesinde zaten on-chain'de önbellekleme/depolama yapılmıştır. Bu durum, toplamda 2 gerekli kanıtla sonuçlanır.

Dolayısıyla, bir leaf'i güncellemek için gereken kanıt sayısı, maksimum derinlikten canopy derinliğini çıkardığınızda eşit olur. Bu örnekte, `3 - 1 = 2`.

:::danger
Canopy derinliği arttıkça maliyet de artmaktadır. Küçük canopy, bileşenleri sınırlar.
:::

## Ağaç Oluşturma Maliyeti

Bir eşzamanlı merkle ağacının oluşturma maliyeti, ağacın boyut parametreleri olan `maxDepth`, `maxBufferSize` ve `canopyDepth`'ye dayanmaktadır. Bu değerlerin tamamı, bir ağacın on-chain'de var olması için gereken depolama alanını (byte cinsinden) hesaplamak amacıyla kullanılır.

Gerekli alan (byte cinsinden) hesaplandıktan sonra, `getMinimumBalanceForRentExemption` RPC yöntemini kullanarak, bu miktarda byte'ı on-chain'de tahsis etmenin maliyetini (lamport cinsinden) talep edebilirsiniz.

### JavaScript ile Ağaç Maliyetini Hesaplama

[`@solana/spl-account-compression`](https://www.npmjs.com/package/@solana/spl-account-compression) paketinin içinde, geliştiriciler
[`getConcurrentMerkleTreeAccountSize`](https://solana-labs.github.io/solana-program-library/account-compression/sdk/docs/modules/index.html#getConcurrentMerkleTreeAccountSize) fonksiyonunu kullanarak, verilen ağaç boyut parametreleri için gereken alanı hesaplayabilirler.

Sonrasında, gerekli alanı on-chain'de tahsis etmenin nihai maliyetini (lamport cinsinden) elde etmek için [`getMinimumBalanceForRentExemption`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html#getMinimumBalanceForRentExemption) fonksiyonunu kullanabilirler.

Son olarak, bu boyutta bir hesabın kiracı muaf olması için gereken maliyeti belirleyin, normalde herhangi bir hesap oluşturma işlemi gibi.

```ts
// ağaç için gereken alanı hesapla
const requiredSpace = getConcurrentMerkleTreeAccountSize(
  maxDepth,
  maxBufferSize,
  canopyDepth,
);

// ağacı on-chain'de depolamanın maliyetini (lamport cinsinden) al
const storageCost =
  await connection.getMinimumBalanceForRentExemption(requiredSpace);
```

### Örnek Maliyetler

Aşağıda, farklı ağaç boyutları için birkaç örnek maliyet listelenmiştir ve her biri için kaç tane leaf düğümü mümkün olduğu belirtilmiştir:

**Örnek #1: 16,384 düğüm, maliyeti 0.222 SOL**

- `14` maksimum derinliği ve `64` maksimum tampon boyutu
- maksimum leaf düğümü sayısı: `16,384`
- `0` canopy derinliği ile oluşturulması yaklaşık `0.222 SOL` maliyetlidir

**Örnek #2: 16,384 düğüm, maliyeti 1.134 SOL**

- `14` maksimum derinliği ve `64` maksimum tampon boyutu
- maksimum leaf düğümü sayısı: `16,384`
- `11` canopy derinliği ile oluşturulması yaklaşık `1.134 SOL` maliyetlidir

**Örnek #3: 1,048,576 düğüm, maliyeti 1.673 SOL**

- `20` maksimum derinliği ve `256` maksimum tampon boyutu
- maksimum leaf düğümü sayısı: `1,048,576`
- `10` canopy derinliği ile oluşturulması yaklaşık `1.673 SOL` maliyetlidir

**Örnek #4: 1,048,576 düğüm, maliyeti 15.814 SOL**

- `20` maksimum derinliği ve `256` maksimum tampon boyutu
- maksimum leaf düğümü sayısı: `1,048,576`
- `15` canopy derinliği ile oluşturulması yaklaşık `15.814 SOL` maliyetlidir

## Sıkıştırılmış NFT'ler

Sıkıştırılmış NFT'ler, Solana'da Durum Sıkıştırma'nın en popüler kullanım durumlarından biridir. Sıkıştırma ile, bir milyon NFT koleksiyonu yaklaşık `~50 SOL`, karşılaştırıldığında  `~12,000 SOL`'ye mal olmadan mint edilebilir.

Eğer sıkıştırılmış NFT'leri kendiniz oluşturmakla ilgileniyorsanız, `sıkıştırılmış NFT'leri mintlemek ve aktarmak` için geliştirici kılavuzumuzu okuyun.