---
title: Solana Üzerindeki Ücretler
sidebarSortOrder: 3
description:
  Solana'nın işlem ücretleri, önceliklendirme
  ücretleri ve kira maliyetleri dahil olmak üzere ücret yapısını öğrenin. Ücretlerin nasıl
  hesaplandığını, toplandığını ve dağıtıldığını anlayın.
keywords:
  - talimat ücreti
  - işleme ücreti
  - depolama
  - kira
  - gaz
  - gwei
altRoutes:
  - /docs/core/rent
  - /docs/intro/rent
  - /docs/intro/transaction_fees
  - /docs/intro/transaction-fees
  - /docs/core/runtime
---

Solana blok zinciri, izin gerektirmeyen ağı kullanmak için oluşan birkaç farklı ücret ve maliyetten oluşmaktadır. Bunlar birkaç
belirli türde gruplandırılabilir:

- **İşlem Ücretleri** - Geçerlilik sağlayıcılarının işlemleri/talimatları işlemesi için ödenen ücret
- **Önceliklendirme Ücretleri** - İşlemlerin işlenme sırasını artırmak amacıyla isteğe bağlı bir ücret
- **Kira** - Verilerin zincir üzerinde saklanmasını sağlamak için tutulan bakiye

---

## İşlem Ücretleri

Solana blok zincirinde bir zincir içi program içindeki mantığı (talimat) işlemek için ödenen küçük ücret "_işlem ücreti_" olarak bilinir.

Her `işlem` (bir veya daha fazla `talimat` içeren) ağ üzerinden gönderildiğinde, mevcut geçerlilik sağlayıcı lideri tarafından işlenir. Küresel bir durum işlemi olarak onaylandıktan sonra, bu _işlem ücreti_ ağ için ödenerek Solana blok zincirinin ekonomik tasarımını desteklemeye yardımcı olur.

> İşlem ücretleri, `kira` için hesap veri saklama depozito ücretinden farklıdır. İşlem ücretleri Solana ağında talimatların işlenmesi için ödenirken, kira depozitosu bir hesapta, verilerin blok zincirinde saklanması için tutulur ve geri alınabilir.  
> —Solana Teknik Dokümantasyonu

Halen, temel Solana işlem ücreti, her imza için 5k lamport değerinde statik bir değer olarak belirlenmiştir. Bu temel ücretin üzerine her türlü ek `önceliklendirme ücreti` eklenebilir.

### Neden işlem ücreti ödenir?

İşlem ücretleri, Solana'nın `ekonomik tasarımı` çerçevesinde birçok fayda sağlar, bunlar başlıca:

- İşlemleri işlemek için gerekli olan harcanan CPU/GPU hesaplama kaynakları için geçerlilik sağlayıcı ağına tazminat sağlar
- İşlemlere gerçek bir maliyet getirerek ağ spamını azaltır
- Her işlem için protokol tarafından yakalanan minimum ücret miktarı aracılığıyla ağın uzun vadeli ekonomik istikrarını sağlar

### Temel ekonomik tasarım

Birçok blok zincir ağı (Bitcoin ve Ethereum dahil), kısa vadede ağı güvenli hale getirmek için enflasyonist _protokol bazlı ödüller_ kullanmaktadır. Uzun vadede, bu ağlar güvenliği sürdürmek için giderek daha fazla _işlem ücretlerine_ bağımlı hale gelecektir.

Bu durum Solana için de geçerlidir. Özellikle:

- Her işlem ücretinin belirli bir oranı (ilk başta %50) _yakılır_ (imha edilir), geri kalanı ise işlemi gerçekleştiren mevcut `lider` tarafından alınır.
- Belirli bir küresel enflasyon oranı, [Solana Geçerlilik Sağlayıcıları](https://docs.solanalabs.com/operations) için dağıtılan
  [ödüllerin](https://docs.solanalabs.com/implemented-proposals/staking-rewards) kaynağını sağlar.

---

### Ücret toplama

İşlemlerin en az bir imza atan ve yazılabilir bir hesabı olması gerekmektedir. Bu _yazılabilir imza atan hesaplar_, ilk olarak hesaplar listesinde sıralanır ve bu hesapların ilki daima "_ücret ödeyici_" olarak kullanılır.

Herhangi bir işlem talimatı işlenmeden önce, ücret ödeyici hesabın [bakiyesi düşecektir](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/runtime/src/bank.rs#L4045-L4064) ve buna göre işlem ücretlerini ödeyecektir. 

:::warning
Eğer ücret ödeyici bakiyesi işlem ücretlerini karşılayacak kadar yeterli değilse, işlem işlenmesi duracak ve başarısız bir işlemle sonuçlanacaktır.
:::

Eğer bakiye yeterli ise, ücretler düşülecek ve işlemin talimatlarının yürütülmesine başlanacaktır. Herhangi bir talimat bir hata ile sonuçlanırsa, işlem işlenmesi duracak ve nihayetinde Solana defterinde başarısız bir işlem olarak kaydedilecektir. Bu başarısız işlemler için ücret hala çalışma zamanında tahsil edilmektedir.

Eğer herhangi bir talimat bir hata döner veya çalışma zamanı kısıtlamalarını ihlal ederse, tüm hesap değişiklikleri **_hariç_** işlem ücreti düşüm işlemi geri alınacaktır. Bunun nedeni, geçerlilik sağlayıcı ağın zaten işlemleri toplamak ve ilk işleme başlamak için hesaplama kaynaklarını harcamış olmasıdır.

### Ücret dağıtımı

İşlem ücretleri [kısmen yakılır](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/runtime/src/bank/fee_distribution.rs#L55-L64) ve kalan ücretler ilgili işlemlerin dahil olduğu bloğu üreten geçerlilik sağlayıcı tarafından toplanır. Özellikle, [yüzde 50'si yakılır](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/sdk/program/src/fee_calculator.rs#L79) ve [yüzde 50'si dağıtılır](https://github.com/anza-xyz/agave/blob/e621336acad4f5d6e5b860eaa1b074b01c99253c/runtime/src/bank/fee_distribution.rs#L58-L62) bloğu üreten geçerlilik sağlayıcıya.

### Neden bazı ücretler yakılır?

Yukarıda belirtildiği gibi, her işlem ücretinin belirli bir oranı _yakılır_ (imha edilir). Bu, SOL'un ekonomik değerini pekiştirmek ve böylece ağın güvenliğini sürdürebilmek amacıyla yapılmıştır. İşlem ücretlerinin tamamen yakıldığı bir düzenekten farklı olarak, liderlerin olabildiğince çok işlemi kendi blok zamanlarına dahil etmeleri için teşvik edilmektedir.

Yakılan ücretler, kötü niyetli geçerlilik sağlayıcıların işlemleri sansürlemesini önlemeye de yardımcı olabilir, çünkü bu durum `fork` seçiminde dikkate alınabilir.

#### Bir saldırı örneği:

Kötü niyetli veya sansürleyen bir liderin olduğu bir `Tarih Kanıtı (PoH)` fork durumunda:

- Sansür nedeniyle kaybedilen ücretler nedeniyle, toplam yakılan ücretlerin **_daha az olduğu_** beklenir.
- Sansürleyen lider kaybedilen protokol ücretlerini telafi etmek istiyorsa, kendisi yakılmış ücretleri kendi fork'ında yerine koymak zorunda kalacaktır.
- Böylece, başlangıçta sansürleme teşvikini azaltabilir.

---

### İşlem ücretlerini hesaplama

Belirli bir işlem için toplam ücret, iki ana bileşene dayanarak hesaplanır:

- İmza başına sabit olarak belirlenmiş temel bir ücret, ve
- İşlem sırasında kullanılan hesaplama kaynakları, "`_hesaplama birimleri_`" cinsinden ölçülen.

Her işlem farklı miktarda hesaplama kaynakları talep edebileceğinden, her bir işlem için bir _hesaplama bütçesi_ çerçevesinde maksimum bir _hesaplama birimi_ sayısı tahsis edilir.

## Hesaplama Bütçesi

Hesaplama kaynaklarının kötüye kullanılmasını önlemek için, her işlem için bir "_hesaplama bütçesi_" tahsis edilir. Bu bütçe, `hesaplama birimleri` hakkında ayrıntıları belirtir ve şunları içerir:

- İşlemin gerçekleştirebileceği farklı türdeki işlemlerle ilişkili hesaplama maliyetleri (işlem başına tüketilen hesaplama birimleri),
- Bir işlemin tüketebileceği maksimum hesaplama birimi sayısı (hesaplama birimi sınırı),
- Ve işlemin uyması gereken operasyonel sınırlar (hesap veri boyutu sınırlamaları gibi).

İşlem, tüm hesaplama bütçesini (hesaplama bütçesi yetersizliği) tükettiğinde veya [maksimum çağrı yığın derinliğini](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/program-runtime/src/compute_budget.rs#L138) aşan bir sınırı geçtiğinde, çalışma zamanı işlem işlenmesini durdurur ve bir hata döndürür. Bunun sonucunda başarısız bir işlem ve hiçbir durum değişikliği meydana gelmez (işlem ücretinin `tahsil edilmesi` dışında).

### Hesaplar veri boyutu sınırı

Bir işlem, yüklemesine izin verilen hesap veri boyutunu belirtmek için `SetLoadedAccountsDataSizeLimit` talimatını dahil edebilir (çalışma zamanının mutlak maksimumunu aşmamak kaydıyla). Hiçbir `SetLoadedAccountsDataSizeLimit` sağlanmazsa, işlem varsayılan olarak çalışma zamanının [`MAX_LOADED_ACCOUNTS_DATA_SIZE_BYTES`](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/program-runtime/src/compute_budget_processor.rs#L137-L139) değerini kullanır.

`ComputeBudgetInstruction::set_loaded_accounts_data_size_limit` işlevi bu talimatı oluşturmak için kullanılabilir:

```rust
let instruction = ComputeBudgetInstruction::set_loaded_accounts_data_size_limit(100_000);
```

### Hesaplama birimleri

Bir işlem sırasında zincir üstünde gerçekleştirilen tüm işlemler, geçerlilik sağlayıcılar tarafından işlenirken farklı miktarlarda hesaplama kaynaklarının harcanmasını gerektirir (hesaplama maliyeti). Bu kaynakların harcanmasının en küçük ölçüm birimine _"hesaplama birimi"_ denir.

Bir işlem işlendiğinde, hesaplama birimleri zincir üzerinde yürütülen her bir talimat tarafından kademeli olarak tüketilmektedir (bütçeyi tüketmektedir). Her talimat farklı bir mantığı (hesaplara yazma, cpi, syscalls gerçekleştirme vb.) yürüttüğünden, her biri [farklı bir miktar](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/program-runtime/src/compute_budget.rs#L133-L178) hesaplama birimi tüketebilir.

> Bir program, tahsis edilen hesaplama bütçesindeki ne kadar kaldığı da dahil olmak üzere hesaplama kullanımına ilişkin ayrıntıları kaydedebilir. Ayrıca, [hesaplama kullanımınızı optimize etme](https://docs.solanalabs.com/guides/advanced/how-to-optimize-compute) konusunda daha fazla bilgi bulabilirsiniz.  
> —Solana Geliştirme Kılavuzu

Her işlem, varsayılan sınırların veya açıkça daha yüksek bir sınır talep ederek `hesaplama birimi sınırı` belirlenmiştir. Bir işlem hesaplama birimi sınırını aştığında, işlemi durdurulacak ve sonuç olarak bir işlem hatası meydana gelecektir.

Aşağıda, bir hesaplama maliyeti isteyen bazı yaygın işlemler bulunmaktadır:

- Talimatları yürütmek
- Programlar arasında veri iletimi
- Syscalls gerçekleştirmek
- Sysvars kullanmak
- `msg!` makrosu ile günlüklere kaydetmek
- Pubkeys günlüğe kaydetmek
- Program adresleri (PDA'lar) oluşturmak
- Çapraz program çağrıları (CPI)
- Kriptografik işlemler

> `Çapraz program çağrıları` için, çağrılan talimat, ana talimatın hesaplama bütçesini ve sınırlarını devralır. Eğer çağrılan talimat, işlemin kalan bütçesini tüketirse veya bir sınırı aşarsa, tüm çağrılma zinciri ve üst düzey işlem işleme durdurulur.

Solana çalışma zamanındaki [hesaplama birimlerini](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/program-runtime/src/compute_budget.rs#L19-L123) keşfetmek için daha fazla ayrıntı bulabilirsiniz.

### Hesaplama birimi sınırı

Her işlemin tüketebileceği maksimum hesaplama birimi (CU) sayısına _"hesaplama birimi sınırı"_ denir. Her işlem için Solana çalışma zamanının bir mutlak maksimum hesaplama birimi sınırı [1.4 milyon CU](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/program-runtime/src/compute_budget_processor.rs#L19) olup, varsayılan olarak [her talimat için 200k CU](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/program-runtime/src/compute_budget_processor.rs#L18) talep edilmektedir.

Bir işlem, bir `SetComputeUnitLimit` talimatı ekleyerek daha spesifik ve optimal bir hesaplama birimi sınırı talep edebilir. Yüksek veya daha düşük bir sınır talep edebilir. Ancak her işlem için mutlak maksimum sınırdan daha yüksek bir talepte bulunamaz.

Bir işlemin varsayılan hesaplama birimi sınırı, basit işlemler için çoğu durumda yeterli olur, fakat genellikle optimal değildir (hem çalışma zamanı hem de kullanıcı için). Çok sayıda CPI gerçekleştiren programları çağırmak gibi daha karmaşık işlemler için, işlem için daha yüksek bir hesaplama birimi sınırı talep etmeniz gerekebilir.

:::tip
İşleminiz için optimal hesaplama birimi sınırlarını talep etmek, ödemenizi azaltmanıza ve işleminizi ağda daha iyi bir şekilde planlamanıza yardımcı olacaktır. Cüzdanlar, dApp'ler ve diğer hizmetlerin, kullanıcıları için mümkün olan en iyi deneyimi sağlamak için hesaplama birimi taleplerinin optimal olduğundan emin olması gerekmektedir.
:::

> Daha fazla ayrıntı ve en iyi uygulamalar için, [optimal hesaplama sınırlarını talep etme](https://content/guides/advanced/how-to-request-optimal-compute.md) konusunda bu kılavuzu okuyun.

### Hesaplama birimi ücreti

Bir işlem, işlenme önceliğini artırmak için daha yüksek bir ücret ödemek istediğinde, bir _"hesaplama birimi ücreti"_ ayarlayabilir. Bu ücret, `hesaplama birimi sınırı` ile birleştirilerek işlem önceliklendirme ücretini belirlemek için kullanılacaktır.

Varsayılan olarak, [hiçbir hesaplama birimi ücreti ayarlanmamıştır](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/program-runtime/src/compute_budget_processor.rs#L38) ve bu da ek bir önceliklendirme ücreti olmadığı anlamına gelir.

---

## Önceliklendirme Ücretleri

`Hesaplama Bütçesi` çerçevesinde, çalışma zamanı, işlemeye uğradığı sırada diğerlerine karşı nasıl önceliklendirildiğini artıran **isteğe bağlı** bir ücret olarak bilinen _"önceliklendirme ücreti"_ ödemeyi destekler. Bu ekstra ücreti ödemek, işlemin daha hızlı yürütme sürelerine sahip olmasına yardımcı olur.

### Önceliklendirme ücretinin hesaplanma şekli

Bir işlemin önceliklendirme ücreti, **_hesaplama birimi sınırı_** ile **_hesaplama birimi ücreti_** (mikro-lamport cinsinden ölçülen) çarpılarak hesaplanır. Bu değerler, aşağıdaki Hesaplama Bütçesi talimatlarını dahil ederek her işlem için bir kez ayarlanabilir:

- [`SetComputeUnitLimit`](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/sdk/src/compute_budget.rs#L47-L50) - işlemin tüketebileceği maksimum hesaplama birimi sayısını ayarlama
- [`SetComputeUnitPrice`](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/sdk/src/compute_budget.rs#L52-L55) - işlemin önceliklendirmeyi artırmak için ödemeye istekli olduğu ek ücreti ayarlama

Eğer `SetComputeUnitLimit` talimatı sağlanmazsa, `varsayılan hesaplama birimi sınırı` kullanılacaktır.

Eğer `SetComputeUnitPrice` talimatı sağlanmazsa, işlem ek bir yükseltilmiş ücret olmayacak ve en düşük öncelik (yani, önceliklendirme ücreti yok) ile sonuçlanacaktır.

### Önceliklendirme ücretini ayarlama

Bir işlemin önceliklendirme ücreti, bir `SetComputeUnitPrice` talimatı ve isteğe bağlı olarak bir `SetComputeUnitLimit` talimatı eklenerek ayarlanır. Çalışma zamanı, bu değerleri kullanarak önceliklendirme ücretini hesaplayacak ve işlemi blok içindeki önceliklendirmek için kullanacaktır.

Her bir talimat, Rust veya `@solana/web3.js` işlevleri aracılığıyla hazırlanabilir. Her talimat daha sonra işlemde eklenerek kümeye normal gibi gönderilebilir. Ayrıca aşağıdaki `en iyi uygulamalar` hakkında daha fazla bilgi bulunmaktadır.

Solana işleminde diğer talimatlardan farklı olarak, Hesaplama Bütçesi talimatlarının **hiçbirine** ihtiyaç yoktur. Birden fazla talimatı içeren bir işlem başarısız olacaktır.



İşlemler, her bir hesaplama bütçesi talimatından **bir tane** içerebilir. Yinelenen talimat türleri [`TransactionError::DuplicateInstruction`](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/sdk/src/transaction/error.rs#L143-L145) hatası alır ve sonunda işlem başarısız olur.



#### Rust

Rust `solana-sdk` paketi, _hesaplama birimi sınırını_ ve _hesaplama birimi fiyatını_ ayarlamak için talimatlar oluşturmak üzere [`ComputeBudgetInstruction`](https://docs.rs/solana-sdk/latest/solana_sdk/compute_budget/enum.ComputeBudgetInstruction.html) içinde işlevler içerir:

```rust
let instruction = ComputeBudgetInstruction::set_compute_unit_limit(300_000);
```

```rust
let instruction = ComputeBudgetInstruction::set_compute_unit_price(1);
```

#### Javascript

`@solana/web3.js` kütüphanesi, _hesaplama birimi sınırını_ ve _hesaplama birimi fiyatını_ ayarlamak için talimatlar oluşturmak üzere [`ComputeBudgetProgram`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/ComputeBudgetProgram.html) içinde işlevler içerir:

```js
const instruction = ComputeBudgetProgram.setComputeUnitLimit({
  units: 300_000,
});
```

```js
const instruction = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 1,
});
```

### Önceliklendirme ücreti en iyi uygulamaları

Aşağıda, önceliklendirme ücretleri ile ilgili en iyi uygulamalar hakkında genel bilgiler bulabilirsiniz. Ayrıca, bir işlemin tahmini hesaplama kullanımını belirlemek için işlemi simüle etme dahil olmak üzere [optimal hesaplama talep etme](https://content/guides/advanced/how-to-request-optimal-compute.md) üzerine aktarımlar içeren daha ayrıntılı bilgiler de mevcuttur.

#### Minimum hesaplama birimini talep edin

İşlemler, yürütme için gerekli minimum hesaplama birimi miktarını talep etmelidirler, böylece ücretler minimize edilir. Ayrıca, istenen hesaplama birimi sayısı, yürütülen işlem tarafından gerçekten tüketilen hesaplama birimi sayısını aştığında ücretlerin ayarlanmadığını unutmayın.

#### Son güncel önceliklendirme ücretlerini alın

Bir işlemi kümeye yollamadan önce, düğüm tarafından işlenen son bloklar içerisindeki son ödenen önceliklendirme ücretleri listesine erişmek için `getRecentPrioritizationFees` RPC yöntemini kullanabilirsiniz.

Verileri, işleminizin (a) kümeye daha iyi bir şekilde işlenmesini sağlamak ve (b) ödenen ücretleri minimize etmek için uygun bir önceliklendirme ücreti tahmin etmek amacıyla kullanabilirsiniz.

---

## Kira

Her `Solana Hesabı` için, ilişkili verilerin zincir üzerinde kullanılabilir kalmasını sağlamak için yatırılan ücrete "_kira_" denir. Bu ücret, her hesapta normal lamport bakiyesinde tutulur ve hesap kapatıldığında geri alınabilir.

> Kira, `işlem ücretlerinden` farklıdır. Kira, verilerin Solana blok zincirinde saklanması için bir hesapta "ödenir" (tutulur) ve geri alınabilir. Oysa işlem ücretleri, ağda `talimatları` işlemek için ödenir.  
> —Solana Teknik Dokümantasyonu

Tüm hesapların, `kira muafiyeti` elde edebilmek ve Solana blok zincirinde kalabilmek için yüksek bir lamport bakiyesi (tahsis edilmiş alana göre) koruması gereklidir. Bir hesapta kira muafiyeti için gereken minimum bakiyenin altına düşmeye çalışan herhangi bir işlem başarısız olacaktır (bir bakiyeyi tam olarak sıfıra indirene kadar).

Bir hesabın sahibi artık bu veriyi zincir üstünde tutmak istemediğinde ve küresel durumda kullanılabilir olmasını istemediğinde, hesap kapatılabilir ve kira depozitosu geri alınabilir.

Bu, hesabın tamamındaki lamport bakiyesinin başka bir hesaba (yani cüzdanınıza) çekilerek (aktararak) yapılır. Hesap bakiyesini tam olarak `0` değerine düşürdüğünde, çalışma zamanı, o sürede hesabı ve ilişkili verileri ağdan kaldırıp temizleme işlemine yönelik _"`çöp toplama`"_ sürecini başlatacaktır.

### Kira oranı

Solana kira oranı, esasen çalışma zamanının belirttiği "[lamport _başına_ bayt _başına_ yıl](https://github.com/anza-xyz/agave/blob/b7bbe36918f23d98e2e73502e3c4cba78d395ba9/sdk/program/src/rent.rs#L27-L34)" temel alınarak ağ genelinde belirlenir. Mevcut durumda, kira oranı, statik bir tutardır ve [Rent sysvar](https://docs.solanalabs.com/runtime/sysvars#rent) içinde saklanmaktadır.

Bu kira oranı, bir hesabın tahsis edilen alana bakıldığında, o alana konulması gereken tam kira tutarını hesaplamak için kullanılır (yani, hesapta saklanabilen veri miktarı). Bir hesap ne kadar fazla alan tahsis ederse, o kadar fazla tutulması gereken kira depozitosu olacaktır.

### Kiralama muafiyeti

Hesaplar, kendi verilerini zincir üzerinde saklamak için gereken minimumun üzerinde bir lamport bakiyesine sahip olmalıdır. Bu duruma "_kiralama muafiyeti_" denir ve bu bakiye "_kiralama muafiyeti için minimum bakiye_" olarak adlandırılır.

> Solana üzerindeki yeni hesaplar (ve programlar) **GEREK** olan lamportları alarak _kiralama muafiyeti_ durumuna geçmek için başlatılmalıdır. Bu her zaman böyle olmadı. Önceden, çalışma zamanı, her hesap için _kiralama muafiyeti için minimum bakiye_ altında olanlardan belirli aralıklarla otomatik olarak bir ücret toplardı. Sonuç olarak bu hesapların bakiyeleri sıfıra düşer ve küresel durumdan atılırdı (elle yeniden doldurulmadıkça).

Yeni bir hesap oluşturma sürecinde, bu minimum bakiyenin üzerinde kalabilmek için yeterince lamport yatırdığınızdan emin olmalısınız. Bu minimum eşik altında herhangi bir şey, başarısız bir işlemi sonuçlandırır.

Her seferinde bir hesabın bakiyesi azaltıldığında, çalışma zamanı, hesabın hala kiralama muafiyeti için bu minimum bakiye üzerinde olup olmadığını kontrol eder. Hesap bakiyesini tam olarak `0`'a düşürmedikçe (hesabı kapatmak), bir hesabın bakiyesinin kiralama muafiyeti eşiğin altına düşmesine neden olacak işlemler başarısız olacaktır.

**Bir hesabın kiralama muafiyeti kazanabilmesi için gereken özel minimum bakiye**, blok zincirinin mevcut `kira oranına` ve bir hesabın tahsis etmek istediği depolama alanı miktarına (hesap boyutu) bağlıdır. Bu nedenle, belirli bir hesap boyutu için özel bakiyeyi hesaplamak üzere 
`getMinimumBalanceForRentExemption` RPC uç noktasını kullanmanız önerilir.

Gerekli kira depozito tutarı aynı zamanda 
[`solana rent` CLI alt komutu](https://docs.solanalabs.com/cli/usage#solana-rent) aracılığıyla da tahmin edilebilir:

```shell
solana rent 15000

# çıktı
Bayt-yıl başına kira: 0.00000348 SOL
Epok başına kira: 0.000288276 SOL
Kira-muaf minimum: 0.10529088 SOL
```

---

### Çöp toplama

Sıfırdan büyük bir lamport bakiyesi bulundurmayan hesaplar, _çöp toplama_ olarak bilinen bir süreçte ağımdan çıkarılır. Bu süreç, artık kullanılmayan/bakım yapılmayan verilerin ağ genelindeki depolamasını azaltmaya yardımcı olmak için gerçekleştirilir.

Bir işlem, bir hesabın bakiyesini tam olarak `0`'a düşürdüğünde, çöp toplama otomatik olarak çalışma zamanı tarafından gerçekleşir. Minimum bakiye sınırının altında bakiyeyi düşürmeye çalışan herhangi bir işlem (tam olarak sıfır olmamak kaydıyla) başarısız olacaktır.

:::warning
Çöp toplamanın, **işlem** yürütme tamamlandıktan **sonra** gerçekleştiğini belirtmek önemlidir. Bir hesabın bakiyesini sıfıra düşürerek "kapatmak" için bir talimat varsa, aynı işlem içinde daha sonraki bir talimatla hesap "yeniden açılabilir". "Kapat" talimatında hesap durumu temizlenmemişse, sonraki "yeniden aç" talimatı aynı hesap durumunu koruyacaktır. Bu bir güvenlik endişesidir; bu yüzden çöp toplamanın etkili olduğu zamanlamayı bilmek faydalıdır.
:::

Bir hesap ağdan kaldırıldıktan sonra (çöp toplama yoluyla), hala adresiyle ilişkili işlemler (ya geçmişte ya da gelecekte) olabilir. Bir Solana blok gezgini "hesap bulunamadı" türünde bir mesaj gösterebilir, ancak bu hesapla ilişkili işlem geçmişini görmek mümkün olabilir.

Daha fazla bilgi için çöp toplaması hakkında validator'ün [uygulanan önerisini](https://docs.solanalabs.com/implemented-proposals/persistent-account-storage#garbage-collection) okuyabilirsiniz.