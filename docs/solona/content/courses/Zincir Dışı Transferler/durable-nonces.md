---
title: Kalıcı Noncalar
objectives:
  - Kalıcı işlemler ve normal işlemler arasındaki farkları açıklayabilmek.
  - Kalıcı işlemler oluşturmak ve göndermek.
  - Kalıcı işlemler ile ilgili ortaya çıkabilecek kenar durumlarını yönetmek.
description: "İşlemleri önceden imzalamak için kalıcı noncalar kullanın."
---

## Özet

- Kalıcı işlemlerin, 150 blok (~80-90 saniye) son kullanma tarihi olmayan mevcut işlemlerden farklıdır.
- Bir kalıcı işlemi imzaladıktan sonra onu bir veritabanında ya da dosyada saklayabilir veya başka bir cihaza gönderebilir, daha sonra gönderebilirsiniz.
- Kalıcı bir işlem, bir nonce hesabı kullanarak oluşturulur. Bir nonce hesabı, bir yetki ve son blok hash değerini değiştirmek için gereken nonce değerini saklar.
- Kalıcı işlemler `advanceNonce` talimatı ile başlamalıdır ve nonce yetkilisi işlemin imzacıları arasında olmalıdır.
- Eğer işlem, `advanceNonce` talimatı dışındaki bir sebepten dolayı başarısız olursa, nonce yine de ileri alınacaktır; diğer tüm talimatlar geri alınacaktır.

---

## Genel Bakış

Kalıcı Noncalar, normal işlemlerin son kullanım tarihini aşmanın bir yoludur. Bunu anlamak için, önce normal işlemlerle ilgili kavramları inceleyeceğiz.

Solana'da işlemlerin üç ana parçası vardır:

1. **Talimatlar**: Talimatlar, blockchain üzerinde gerçekleştirmek istediğiniz işlemlerdir, örneğin token transferi, hesap oluşturma veya bir programı çağırma gibi. Bunlar sıralı olarak gerçekleştirilir.

2. **İmzalar**: İmzalar, işlemin imzacı kişinin özel anahtarı ile yapıldığını kanıtlar - genellikle imzacı kişi kendisidir. Örneğin, cüzdanınızdan bir başkasına SOL transfer ediyorsanız, işlemi imzalamanız gerekir, böylece ağın işlemin geçerli olduğunu doğrulayabilir.

3. **Son Blok Hash'ı**: Son blok hash'ı, her işlemin benzersiz tanımlayıcısıdır. Tekrar saldırılarını önlemek için kullanılır; burada bir saldırgan bir işlemi kaydeder ve sonra tekrar göndermeye çalışır. Son blok hash'ı, her işlemin benzersiz olduğunu ve yalnızca bir kez gönderilebileceğini garanti eder. Son blok hash'ı yalnızca 150 blok boyunca geçerlidir.

Kalıcı işlemlerde, ilk iki kavram aynı kalır. Kalıcı işlemler, son blok hash'larıyla oynanarak mümkün hale gelir.

---

> **Önemli Not:** Son blok hash'ı daha iyi anlamak için, çözmeye çalıştığı [ikili harcama](https://solana.com/developers/guides/advanced/introduction-to-durable-nonces#double-spend) problemine bakalım. — Bu önemli bilgi, kalıcı noncaların arkasındaki mantığı anlamaya yardımcı olacaktır.

Hayal edin ki MagicEden veya Tensor'da bir NFT satın alıyorsunuz. Pazar yeri programının cüzdanınızdan bir miktar SOL çekmesine izin veren bir işlemi imzalamanız gerekir. İşlemi imzaladıktan sonra, pazar yeri bunu ağa gönderecektir. Eğer pazar yeri, kontrol etmeden aynı işlemi tekrar gönderirse, iki kez ücretlendirilebilirsiniz.

Bu durum, blok zincirleri, Solana gibi, tarafından çözülmesi gereken ikili harcama sorunu olarak bilinir. Naif bir çözüm, geçmişte yapılan tüm işlemleri çapraz kontrol etmek ve kopya işlem imzası bulup bulmadığımıza bakmaktır. Bu pratikte mümkün değildir, çünkü Solana defterinin boyutu >80 TB'tır. Bu yüzden Solana, son blok hash'ları kullanır.

Son blok hash'ı, geçerli bir bloğun son [giriş kimliği](https://solana.com/docs/terminology#blockhash) üzerine 32 baytlık bir SHA-256 hash'ıdır ve son 150 blok içinde geçerlidir. Bu son blok hash'ı, imzalanmadan önce işlemin bir parçası olduğu için, imzacının son 150 blok içinde bunu imzaladığını garanti edebiliriz. 150 bloğu kontrol etmek, tüm defteri kontrol etmekten çok daha makuldür.

---

İşlem gönderildiğinde, Solana doğrulayıcıları şu adımları gerçekleştirecektir:

1. İşlemin imzasının son 150 blok içinde gönderilip gönderilmediğini kontrol eder - eğer kopya bir imza varsa, kopya işlem başarısız olacaktır.
2. İşlem imzası bulunmuyorsa, son blok hash'ını kontrol edip son 150 blok içinde var olup olmadığını kontrol eder - eğer yoksa, "Blockhash bulunamadı" hatası döner. Eğer varsa, işlem yürütme kontrollerine geçecektir.

Bu çözüm çoğu kullanım durumu için harika olsa da bazı sınırlamaları vardır. Öncelikle, işlemin 150 blok içinde veya yaklaşık ~80-90 saniye içinde imzalanıp ağa gönderilmesi gerekmektedir. Ancak, işlemin gönderilmesi için 90 saniyeden fazla süreye ihtiyaç duyduğumuz bazı kullanım durumları vardır.

---

> **Kalıcı Nonce kılavuzundan**:
> 1. **Planlı İşlemler**: Kalıcı Noncaların en belirgin uygulamalarından biri, işlemleri planlama yeteneğidir. Kullanıcılar, bir işlemi önceden imzalayıp, daha sonra belirli bir tarihte gönderebilirler; bu da planlı transferler, sözleşme etkileşimleri veya belirli yatırım stratejilerinin uygulanmasını sağlar.
> 2. **Çok İmzalı Cüzdanlar**: Kalıcı Noncalar, bir partinin bir işlemi imzaladığı ve diğerlerinin daha sonra bunu onaylayabileceği çok imzalı cüzdanlar için çok faydalıdır. Bu özellik, güvenilmez bir sistem içinde bir işlemin önerilmesi, gözden geçirilmesi ve daha sonra yürütülmesini sağlar.
> 3. **Gelecek Etkileşim Gerektiren Programlar**: Eğer Solana'daki bir program gelecekte bir etkileşim gerektiriyorsa (örneğin, bir vesting sözleşmesi ya da bir fonun zamanlama ile serbest bırakılması), işlem, Kalıcı Nonce kullanılarak önceden imzalanabilir. Bu, sözleşme etkileşiminin doğru zamanda gerçekleşmesini garanti eder.
> 4. **Çapraz Zincir Etkileşimleri**: Başka bir blok zinciri ile etkileşime geçmeniz gerektiğinde ve bu, onay beklemeyi gerektiriyorsa, işlemi Kalıcı Nonce ile imzalayabilir ve gereken onaylar alındıktan sonra yürütmek için uygulayabilirsiniz.
> 5. **Merkeziyetsiz Türev Pazarları**: Merkeziyetsiz bir türev platformunda, karmaşık işlemler belirli tetikleyicilere dayanarak yürütülmesi gerekebilir. Kalıcı Noncalar ile, bu işlemler önceden imzalanabilir ve tetikleme koşulu sağlandığında yürütülebilir.

---

### Dikkate Alınacaklar

Kalıcı işlemler dikkatle ele alınmalıdır, bu nedenle kullanıcılar her zaman imzaladıkları işlemlere güvenmelidir.

Geliştiriciler olarak, kullanıcıları kalıcı nonce işlemlerinin cüzdanlar tarafından işaretlenebileceği konusunda bilgilendirmek önemlidir. Kalıcı noncalar sıklıkla kötü niyetli işlemler için kullanılır ve bu risklerin anlaşılması, kullanıcıların bilinçli kararlar almalarına yardımcı olabilir.

- **Warning:** Örneğin, bir kullanıcının kötü niyetli bir kalıcı işlemi körlemesine imzaladığını hayal edin. Bu işlem, 500 SOL'u bir saldırgana imzalamış ve nonce yetkisini de saldırgana değiştirmiş olabilir. Kullanıcı bu miktara sahip olmasa bile, saldırgan bu çekin hesabı kullanılarak, kullanıcının bakiyesi 500 SOL'u aştığında hemen parayı çekmeyi bekleyebilir. Kullanıcı neye tıkladığını hatırlamayacak ve işlem günler, haftalar ya da yıllar boyunca pasif kalabilir.

Bu riskleri azaltmak için, geliştiriciler kullanıcıları aşağıdaki noktalar hakkında eğitmelidir:

1. **Kaynağa Güvenin**: Kullanıcılar yalnızca güvendiği kaynaklardan gelen işlemleri imzalamalıdır. Kullanıcıları, imzalayacakları işlemin kaynağını doğrulamaya teşvik edin.
2. **Açık Cüzdanları Dikkatli Kullanın**: Kullanıcılar yalnızca kaybetmeye razı oldukları miktarları açık cüzdanlarında tutmalıdır. Açık cüzdanlar daha fazla saldırıya maruz kalır; bu nedenle, içinde saklanan fon miktarını sınırlamak akıllıcadır.
3. **Soğuk Cüzdanları Koruyun**: Kullanıcılar, gerektiği takdirde, soğuk cüzdanları ile işlem imzalamaktan kaçınmalıdır. Soğuk cüzdanlar daha güvenlidir ve daha büyük fon miktarlarını saklamak için kullanılmalıdır.
4. **İşlemleri İzleyin**: Kullanıcıları düzenli olarak işlem geçmişlerini ve hesap bakiyelerini izlemeye teşvik edin. Herhangi bir şüpheli aktiviteyi zamanında bildirmek, potansiyel kayıpları azaltmaya yardımcı olabilir.

Bu bilgiyi sağlayarak, geliştiriciler kullanıcıların kalıcı nonce işlemlerinin potansiyel tehlikelerini anlamalarına ve uygun önlemleri almalarına yardımcı olabilir. Bu, paniğe neden olmaktan ziyade, mümkün olanı göstermeyi ve kalıcı işlemleri yönetmekte güvenliğin önemini vurgulamayı amaçlamaktadır.

---

### Kalıcı Noncalar Kullanarak Normal İşlemlerin Kısa Süreli Olmasını Aşma

Kalıcı noncalar, işlemleri zincir dışında imzalayıp, ağ üzerinde gönderilmeye hazır olana kadar depolamak için bir yoldur. Bu, bize kalıcı işlemler oluşturma imkanı tanır.

Genellikle 32 bayt boyutunda (genellikle base58 kodlu dizeler olarak temsil edilen) kalıcı noncalar, her işlemin benzersiz olmasını sağlamak (ikili harcamayı önlemek için) ve yürütülmemiş işlemlerin son kullanım tarihini kaldırmak amacıyla, son blok hash'larının yerine kullanılmaktadır.

Nonce'lar son blok hash'larının yerine kullanıldığında, işlemin ilk talimatı `nonceAdvance` talimatı olmalıdır; bu, nonce'u değiştirir veya ilerletir. Bu, nonce'un son blok hash'ı olarak kullanılarak imzalanan her işlemin benzersiz olmasını sağlar.

Kalıcı noncaların düzgün çalışabilmesi için, [Solana içinde benzersiz mekanizmalara](https://docs.solanalabs.com/implemented-proposals/durable-tx-nonces) ihtiyaç duyduğunu not etmek önemlidir; bu nedenle, normalde geçerli olmayan bazı özel kuralları vardır. Teknik detaylara dalarak bunu göreceğiz.

---

### Kalıcı Noncaların Derinlemesine İncelenmesi

Kalıcı işlemler, normal işlemlerden şu şekillerde farklılık gösterir:

1. Kalıcı Noncalar, son blok hash'ını bir nonce ile değiştirir. Bu nonce, nonce hesabında saklanır ve yalnızca bir işlemde bir kez kullanılacaktır. Nonce, benzersiz bir blok hash'ıdır.
2. Her kalıcı işlem, nonce hesabındaki nonce'u değiştirecek olan `nonceAdvance` talimatı ile başlamalıdır. Bu, nonce'un benzersiz olmasını ve başka bir işlemde tekrar kullanılmamasını sağlar.

Nonce hesabı, aşağıdaki değerleri saklayan bir hesaptır:

1. nonce değeri: işlemlerde kullanılacak nonce değeri.
2. yetki: nonce değerini değiştirebilecek genel anahtar.
3. ücret hesaplayıcı: işlemin ücret hesaplayıcısı.

Tekrar, her kalıcı işlem `nonceAdvance` talimatı ile başlamalıdır ve `authority` bir imzacı olmalıdır.

Son olarak, özel bir kural vardır - eğer kalıcı bir işlem, `nonceAdvance` talimatı dışındaki herhangi bir talimat sebebiyle başarısız olursa, nonce yine de ilerleyecektir; geri kalan işlem silinecektir. Bu davranış sadece kalıcı noncalar için benzersizdir.

---

### Kalıcı Nonce İşlemleri

Kalıcı noncaların `@solana/web3.js` paketinde birkaç yardımcı ve sabit değeri vardır:

1. `SystemProgram.nonceInitialize`: Bu talimat yeni bir nonce hesabı oluşturur.
2. `SystemProgram.nonceAdvance`: Bu talimat, nonce hesabındaki nonce'u değiştirir.
3. `SystemProgram.nonceWithdraw`: Bu talimat, nonce hesabından fon çeker. Nonce hesabını silmek için, içindeki tüm fonları çekin.
4. `SystemProgram.nonceAuthorize`: Bu talimat, nonce hesabının yetkisini değiştirir.
5. `NONCE_ACCOUNT_LENGTH`: Nonce hesabı verilerinin uzunluğunu temsil eden bir sabit.
6. `NonceAccount`: Nonce hesabını temsil eden bir sınıf. Bu, nonce hesabı verilerini alıp bir nonce hesabı nesnesi döndüren statik bir fonksiyona sahiptir.

Yardımcı fonksiyonlardan her birine ayrıntılı olarak bakalım.

#### `nonceInitialize`

`nonceInitialize` talimatı, yeni bir nonce hesabı oluşturmak için kullanılır. İki parametre alır:

1. `noncePubkey`: nonce hesabının genel anahtarı.
2. `authorizedPubkey`: nonce hesabının yetkisinin genel anahtarı.

İşte bunun için bir kod örneği:

```typescript
// 1. nonce hesabı ve yetkisi için bir anahtar çifti oluşturun/edinin.
const [nonceKeypair, nonceAuthority] = makeKeypairs(2); // '@solana-developers/helpers' paketinden
// Kiralama muafiyeti için gereken minimum bakiyeyi hesaplayın
const rentExemptBalance =
  await connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH);

const tx = new Transaction().add(
  // 2. Hesabı tahsis edin ve ona fon aktarın (kira muafiyeti bakiyesi)
  SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: nonceKeypair.publicKey,
    lamports: rentExemptBalance,
    space: NONCE_ACCOUNT_LENGTH,
    programId: SystemProgram.programId,
  }),
  // 3. `SystemProgram.nonceInitialize` talimatını kullanarak nonce hesabını başlatın.
  SystemProgram.nonceInitialize({
    noncePubkey: nonceKeypair.publicKey,
    authorizedPubkey: nonceAuthority.publicKey,
  }),
);

// İşlemi gönder
await sendAndConfirmTransaction(connection, tx, [payer, nonceKeypair]);
```

Sistem programı, nonce hesabı içinde nonce değerini ayarlamakla ilgilenir.

#### `nonceAdvance`

Bu talimat, nonce hesabındaki nonce değerini değiştirmek için kullanılır ve iki parametre alır:

1. `noncePubkey`: nonce hesabının genel anahtarı.
2. `authorizedPubkey`: nonce hesabının yetkisinin genel anahtarı.

İşte bunun için bir kod örneği:

```typescript
const instruction = SystemProgram.nonceAdvance({
  authorizedPubkey: nonceAuthority.publicKey,
  noncePubkey: nonceKeypair.publicKey,
});
```

Bu talimatı, herhangi bir kalıcı işlemin ilk talimatı olarak göreceksiniz. Ancak bu, yalnızca bir kalıcı işlemin ilk talimatı olarak kullanmanız gerektiği anlamına gelmez. Bu fonksiyonu her zaman çağırabilirsiniz ve otomatik olarak önceki nonce değerine bağlı tüm kalıcı işlemleri geçersiz kılacaktır.

#### `nonceWithdraw`

Bu talimat, nonce hesabından fonları çekmek için kullanılır ve dört parametre alır:

1. `noncePubkey`: nonce hesabının genel anahtarı.
2. `toPubkey`: fonları alacak hesabın genel anahtarı.
3. `lamports`: çekilecek lamport miktarı.
4. `authorizedPubkey`: nonce hesabının yetkisinin genel anahtarı.

İşte bunun için bir kod örneği:

```typescript
const instruction = SystemProgram.nonceWithdraw({
  noncePubkey: nonceKeypair.publicKey,
  toPubkey: payer.publicKey,
  lamports: amount,
  authorizedPubkey: nonceAuthority.publicKey,
});
```

Bu talimatı hesabı kapatmak için de kullanabilirsiniz. Bunun için tüm fonları çekmeniz yeterlidir.

#### `nonceAuthorize`

Bu talimat, nonce hesabının yetkisini değiştirmek için kullanılır ve üç parametre alır:

1. `noncePubkey`: nonce hesabının genel anahtarı.
2. `authorizedPubkey`: nonce hesabının mevcut yetkisinin genel anahtarı.
3. `newAuthorizedPubkey`: nonce hesabının yeni yetkisinin genel anahtarı.

İşte bunun için bir kod örneği:

```typescript
const instruction = SystemProgram.nonceAuthorize({
  noncePubkey: nonceKeypair.publicKey,
  authorizedPubkey: nonceAuthority.publicKey,
  newAuthorizedPubkey: newAuthority.publicKey,
});
```

---

### Kalıcı Noncaların Kullanımı

Nonce hesabı ve farklı işlemleri hakkında öğrendiğimize göre, şimdi nasıl kullanılacağını tartışalım.

Şunları tartışacağız:

1. Nonce hesabını alma
2. İşlemde nonce kullanarak kalıcı bir işlem oluşturma
3. Kalıcı bir işlemi gönderme

#### Nonce Hesabını Alma

Nonce değerini almak için nonce hesabını alabilir ve seri hale getirebiliriz:

```typescript
const nonceAccount = await connection.getAccountInfo(nonceKeypair.publicKey);

const nonce = NonceAccount.fromAccountData(nonceAccount.data);
```

#### Kalıcı İşlem Oluşturmak için Nonce'u Kullanma

Tam işlevsel bir kalıcı işlem oluşturmak için şunlara ihtiyacımız var:

1. Son blok hash'ının yerini almak için nonce değerini kullanmak.
2. İşlemin ilk talimatı olarak nonceAdvance talimatını eklemek.
3. İşlemi, nonce hesabının yetkisi ile imzalamak.

İşlemi oluşturduktan ve imzaladıktan sonra, onu seri hale getirebilir ve bir base58 dizisine kodlayabiliriz, daha sonra bu diziyi saklayabilir ve daha sonra gönderebiliriz.

```typescript
// Kalıcı işlemi toplayın
const durableTx = new Transaction();
durableTx.feePayer = payer.publicKey;

// nonce hesabının saklanan nonce'unu son blok hash'ı olarak kullanın
durableTx.recentBlockhash = nonceAccount.nonce;

// Bir nonce advance talimatı oluşturun
durableTx.add(
  SystemProgram.nonceAdvance({
    authorizedPubkey: nonceAuthority.publicKey,
    noncePubkey: nonceKeypair.publicKey,
  }),
);

// İşlemde yapmak istediğiniz talimatları ekleyin, bu durumda sadece bir transfer yapıyoruz
durableTx.add(
  SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: recipient.publicKey,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  }),
);

// nonce yetkilisinin anahtar çifti ile işlemi imzala
durableTx.sign(payer, nonceAuthority);

// İmzalanmış işlemi aldıktan sonra, onu seri hale getirebilir ve bir veritabanında saklayabilir veya başka bir cihaza gönderebilirsiniz.
// Daha sonra gönderebilirsiniz.
const serializedTx = base58.encode(
  durableTx.serialize({ requireAllSignatures: false }),
);
```

#### Kalıcı İşlemi Gönderme

Artık elimizde bir base58 ile kodlanmış işlem olduğuna göre, onu çözebilir ve gönderebiliriz:

```typescript
const tx = base58.decode(serializedTx);
const sig = await sendAndConfirmRawTransaction(connection, tx as Buffer);
```

---

### Bazı Önemli Kenar Durumları

Kalıcı işlemlerle uğraşırken dikkate almanız gereken birkaç şey vardır:

1. Eğer işlem, nonce advance talimatından başka bir talimat nedeniyle başarısız olursa.
2. Eğer işlem, nonce advance talimatı nedeniyle başarısız olursa.

#### Eğer İşlem, Nonce Advance Talimatından Başka Bir Talimat Nedeniyle Başarısız Olursa

Başarısız işlemlerin normal durumunda, bilinen davranış, işlemin tüm talimatlarının orijinal duruma geri alınacağıdır. Ancak kalıcı bir işlem durumunda, eğer herhangi bir talimat, nonce advance talimatı dışındaki bir nedenden dolayı başarısız olursa, nonce yine de ilerleyecek ve diğer tüm talimatlar geri alınacaktır. Bu özellik güvenlik amacıyla tasarlanmıştır; bir kullanıcı bir işlemi imzaladığında, eğer başarısız olursa, bir daha kullanılamayacağı garanti altına alınır.

> **Danger:** Önceden imzalanmış, geçmeyen kalıcı işlemler, imzalanmış maaş çekleri gibidir. Doğru senaryolarında tehlikeli olabilirler. Bu ek güvenlik özelliği, yanlış şekilde işlenirse maaş çekini etkili bir şekilde "iptal eder".

#### Eğer İşlem, Nonce Advance Talimatı Nedeniyle Başarısız Olursa

Eğer bir işlem advance talimatı nedeniyle başarısız olursa, tüm işlem geri alınır; bu da nonce'un ilerlemediği anlamına gelir.

---

## Laboratuvar

Bu laboratuvarla, bir kalıcı işlem oluşturmayı öğreneceğiz. Ne yapabileceğimize ve ne yapamayacağımıza odaklanacağız. Ayrıca bazı kenar durumlarını tartışacak ve bunları nasıl ele alacağımızı konuşacağız.

### 0. Başlarken

Hadi başlayalım ve başlangıç kodumuzu klonlayalım.

```bash
git clone https://github.com/Unboxed-Software/solana-lab-durable-nonces
cd Solana-lab-durable-nonces
git checkout starter
npm install
```

Başlangıç kodunda, `test/index.ts` içinde bir dosya bulacaksınız; burada bir test iskeleti var, tüm kodumuzu burada yazacağız.

Bu laboratuvar için yerel doğrulayıcıyı kullanacağız. Ancak, dilerseniz devnet'i de kullanabilirsiniz. (Devnet'te airdrop ile ilgili sorun yaşıyorsanız, [Solana'nın Musluk](https://faucet.solana.com/) sayfasına bakın)

Yerel doğrulayıcıyı çalıştırmak için onu yüklemiş olmanız gerekir; değilseniz, `Solana CLI nasıl yüklenir` sayfasına başvurabilirsiniz. CLI yüklendikten sonra `solana-test-validator` komutuna erişiminiz olacaktır.

Ayrı bir terminalde çalıştırın:

```bash
solana-test-validator
```

`test/index.ts` içinde beş test göreceksiniz; bunlar kalıcı noncaları daha iyi anlamamıza yardımcı olacak.

Her bir test durumunu derinlemesine tartışacağız.

### 1. nonce hesabı oluşturun

Herhangi bir test yazmadan önce, `describe` bloğunun üstünde `createNonceAccount` adında bir yardımcı fonksiyon oluşturalım.

:::info
Bu fonksiyon aşağıdaki parametreleri alacak:
:::

- **`Connection`**: Kullanılacak bağlantı
- **`payer`**: Ödeme yapan
- **`nonceKeypair`**: nonce anahtar çifti
- **`authority`**: nonce üzerindeki yetki

Fonksiyon şu işlemleri yapacak:

1. Şu işlemleri gerçekleştirecek bir işlem hazırlayıp gönderecek:
   1. nonce hesabı olacak hesabı ayıracak.
   2. `SystemProgram.nonceInitialize` talimatını kullanarak nonce hesabını başlatacak.
2. nonce hesabını alacak.
3. nonce hesabı verilerini dizileştirecek ve geri döndürecek.

Aşağıdaki kodu `describe` bloğunun üstüne bir yere yapıştırın.

```typescript
async function createNonceAccount(
  connection: Connection,
  payer: Keypair,
  nonceKeypair: Keypair,
  authority: PublicKey,
) {
  const rentExemptBalance =
    await connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH);
  // 2. Şu işlemleri gerçekleştirecek bir işlem hazırlayıp gönderecek:
  const tx = new Transaction().add(
    // 2.1. nonce hesabı olacak olan hesabı ayıracak.
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: nonceKeypair.publicKey,
      lamports: rentExemptBalance,
      space: NONCE_ACCOUNT_LENGTH,
      programId: SystemProgram.programId,
    }),
    // 2.2. `SystemProgram.nonceInitialize` talimatını kullanarak nonce hesabını başlatacak.
    SystemProgram.nonceInitialize({
      noncePubkey: nonceKeypair.publicKey,
      authorizedPubkey: authority,
    }),
  );

  const sig = await sendAndConfirmTransaction(connection, tx, [
    payer,
    nonceKeypair,
  ]);
  console.log("Nonce TX oluşturuluyor:", getExplorerLink("tx", sig, "localnet"));

  // 3. nonce hesabını alacak.
  const accountInfo = await connection.getAccountInfo(nonceKeypair.publicKey);
  // 4. nonce hesabı verilerini dizileştirip geri döndürecek.
  return NonceAccount.fromAccountData(accountInfo!.data);
}
```

### 2. Test: Kalıcı bir işlemi oluşturun ve gönderin

Kalıcı bir işlemi oluşturmak ve göndermek için bu adımları izlemeliyiz:

1. Kalıcı bir İşlem oluşturun.
2. nonce hesabını oluşturun.
3. Yeni bir işlem oluşturun.
4. `recentBlockhash`'ı nonce değeri olarak ayarlayın.
5. İşlemin ilk talimatı olarak `nonceAdvance` talimatını ekleyin.
6. Transfer talimatını ekleyin (burada istediğiniz herhangi bir talimatı ekleyebilirsiniz).
7. İmza atılması gereken anahtar çiftleri ile işlemi imzalayın ve nonce yetkisini bir imza olarak eklemeyi unutmayın.
8. İşlemi dizileştirin ve kodlayın.
9. Bu noktada, kalıcı bir işleminiz var, bunu bir veritabanında veya bir dosyada saklayabilir veya başka bir yere gönderebilirsiniz, vb.
10. Kalıcı işlemi gönderin.
11. Dizileştirilen işlemi çözüp çözümleyin.
12. `sendAndConfirmRawTransaction` fonksiyonunu kullanarak gönderin.

Bütün bunları ilk testimizde bir araya getirebiliriz:

```typescript
it("Kalıcı bir işlem oluşturur ve gönderir", async () => {
  // Adım 1: Ödeme yapanı başlat
  const payer = await initializeKeypair(connection, {
    airdropAmount: AIRDROP_AMOUNT,
    minimumBalance: MINIMUM_BALANCE,
  });

  // Adım 1.1: nonce hesabı ve alıcı için anahtar çiftleri oluşturun
  const [nonceKeypair, recipient] = makeKeypairs(2);

  // Adım 1.2: nonce hesabını oluşturun
  const nonceAccount = await createNonceAccount(
    connection,
    payer,
    nonceKeypair,
    payer.publicKey,
  );

  // Adım 1.3: Yeni bir işlem oluşturun
  const durableTx = new Transaction();
  durableTx.feePayer = payer.publicKey;

  // Adım 1.4: nonce hesabındaki nonce değerine `recentBlockhash`'ı ayarlayın
  durableTx.recentBlockhash = nonceAccount.nonce;

  // Adım 1.5: İlk talimat olarak `nonceAdvance` talimatını ekleyin
  durableTx.add(
    SystemProgram.nonceAdvance({
      authorizedPubkey: payer.publicKey,
      noncePubkey: nonceKeypair.publicKey,
    }),
  );

  // Adım 1.6: Transfer talimatını ekleyin
  durableTx.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: recipient.publicKey,
      lamports: TRANSFER_AMOUNT,
    }),
  );

  // Adım 1.7: İşlemi ödemenin anahtar çifti ile imzalayın
  await durableTx.partialSign(payer);

  // Adım 1.8: İşlemi dizileştirin (daha kolay kullanım için base64 kodlaması)
  const serializedTx = durableTx
    .serialize({ requireAllSignatures: false })
    .toString("base64");

  // Adım 1.9: Bu noktada kalıcı işlemi gelecekte kullanılmak üzere saklayabilirsiniz.
  // ------------------------------------------------------------------

  // Adım 2: Kalıcı işlemi gönderin

  // Adım 2.1: Dizileştirilen işlemi çözümleyin
  const tx = Buffer.from(serializedTx, "base64");

  // Adım 2.2: `sendAndConfirmRawTransaction` kullanarak işlemi gönderin
  const sig = await sendAndConfirmRawTransaction(connection, tx, {
    skipPreflight: true,
  });

  // Adım 2.3: `getExplorerLink` kullanarak gezgin bağlantısını oluşturun ve günlüğe kaydedin
  console.log("İşlem İmzası:", getExplorerLink("tx", sig, "localnet"));
});
```

### 3. Test: nonce gelişirse işlem başarısız olur

Nonce'i son blok hash'i yerine kullandığımız için, sistem sağladığımız nonce'in `nonce_account` içindeki nonce ile eşleşip eşleşmediğini kontrol edecektir. Ayrıca, her işlemle birlikte ilk talimat olarak `nonceAdvance` talimatını eklemeliyiz. Bu, işlem geçtiğinde nonce'in değişmesini ve kimsenin bunu iki kez gönderememesini sağlar.

Test edeceğimiz şeyler şunlardır:

1. Önceki adımda olduğu gibi kalıcı bir işlem oluşturun.
2. nonce'i ilerletin.
3. İşlemi göndermeye çalışın ve başarısız olması gerekir.

```typescript
it("Nonce gelişirse başarısız olur", async () => {
  try {
    const payer = await initializeKeypair(connection, {
      airdropAmount: AIRDROP_AMOUNT,
      minimumBalance: MINIMUM_BALANCE,
    });

    const [nonceKeypair, nonceAuthority, recipient] = makeKeypairs(3);

    // Adım 1: Kalıcı bir işlem oluşturun
    const nonceAccount = await createNonceAccount(
      connection,
      payer,
      nonceKeypair,
      nonceAuthority.publicKey,
    );

    const durableTransaction = new Transaction();
    durableTransaction.feePayer = payer.publicKey;
    durableTransaction.recentBlockhash = nonceAccount.nonce;

    // nonce'i ilerletme talimatını ekleyin
    durableTransaction.add(
      SystemProgram.nonceAdvance({
        authorizedPubkey: nonceAuthority.publicKey,
        noncePubkey: nonceKeypair.publicKey,
      }),
    );

    // Transfer talimatını ekleyin
    durableTransaction.add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient.publicKey,
        lamports: TRANSFER_AMOUNT,
      }),
    );

    // İşlemi ödemenin ve nonce yetkilisinin anahtar çiftleri ile imzalayın
    await durableTransaction.partialSign(payer, nonceAuthority);

    // İşlemi dizileştirin (basitlik için base64 formatında)
    const serializedTransaction = durableTransaction
      .serialize({ requireAllSignatures: false })
      .toString("base64");

    // Adım 2: nonce'i ilerletin
    const nonceAdvanceSignature = await sendAndConfirmTransaction(
      connection,
      new Transaction().add(
        SystemProgram.nonceAdvance({
          noncePubkey: nonceKeypair.publicKey,
          authorizedPubkey: nonceAuthority.publicKey,
        }),
      ),
      [payer, nonceAuthority],
    );

    // solana-helpers'tan getExplorerLink kullanımı
    console.log(
      "Nonce Gelişme İmzası:",
      getExplorerLink("tx", nonceAdvanceSignature, "localnet"),
    );

    // İşlemi çözün
    const deserializedTransaction = Buffer.from(
      serializedTransaction,
      "base64",
    );

    // Adım 3: İşlemi göndermeyi deneyin, nonce gelişimi nedeniyle başarısız olmasını bekleyin
    await assert.rejects(
      sendAndConfirmRawTransaction(connection, deserializedTransaction),
    );
  } catch (error) {
    console.error("Test başarısız oldu:", error);
    throw error;
  }
});
```

### 4. Test: İşlem başarısız olsa bile nonce hesabı ilerler

Herhangi bir nedenle bir işlem başarısız olursa, fakat nonce ilerleme talimatından dolayı olmuyorsa, nonce yine de ilerleyecektir. Bu özellik güvenlik amaçları için tasarlanmıştır ve kullanıcı bir işlemi imzalayıp başarısız olduğunda, o kalıcı işlem tekrar kullanılamaz.

Aşağıdaki kod bu kullanım durumunu göstermektedir. 50 SOL'yi ödeyenden alıcıya aktarmak için bir kalıcı işlem oluşturmaya çalışacağız. Ancak, ödeyenin transfer için yeterli SOL'u yok, bu nedenle işlem başarısız olacaktır, ancak nonce yine de ilerleyecektir.

```typescript
it("İşlem başarısız olsa bile nonce hesabı ilerler", async () => {
  const TRANSFER_AMOUNT = 50;
  const payer = await initializeKeypair(connection, {
    airdropAmount: 3 * LAMPORTS_PER_SOL,
    minimumBalance: 1 * LAMPORTS_PER_SOL,
  });

  // nonce hesabı, nonce yetkisi ve alıcı için anahtar çiftleri oluşturun
  const [nonceKeypair, nonceAuthority, recipient] = makeKeypairs(3);

  // Adım 1: nonce hesabını oluşturun
  const nonceAccount = await createNonceAccount(
    connection,
    payer,
    nonceKeypair,
    nonceAuthority.publicKey,
  );
  const nonceBeforeAdvancing = nonceAccount.nonce;

  console.log("İlerlemeden önceki Nonce:", nonceBeforeAdvancing);

  // Adım 2: Ödeyenin bakiyesini kontrol edin, yeterince transfer için yeterli olmadığına emin olun
  const balance = await connection.getBalance(payer.publicKey);

  // Bakiyenin transfer miktarından (50 SOL) daha az olduğunu kontrol edin
  assert(
    balance < TRANSFER_AMOUNT * LAMPORTS_PER_SOL,
    `Bakiye çok yüksek! 'TRANSFER_AMOUNT' değerini, mevcut bakiyeden daha yüksek olması için ${balance / LAMPORTS_PER_SOL} SOL. olarak ayarlayın.`,
  );

  // Adım 3: Başarısız olacak bir kalıcı işlem oluşturun
  const durableTx = new Transaction();
  durableTx.feePayer = payer.publicKey;

  // nonce hesabındaki nonce değerine recent blockhash'ı ayarlayın
  durableTx.recentBlockhash = nonceAccount.nonce;

  // Adım 4: nonce ilerletme talimatını ilk talimat olarak ekleyin
  durableTx.add(
    SystemProgram.nonceAdvance({
      authorizedPubkey: nonceAuthority.publicKey,
      noncePubkey: nonceKeypair.publicKey,
    }),
  );

  // Adım 5: Yetersiz fonlar nedeniyle başarısız olacak bir transfer talimatı ekleyin
  durableTx.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: recipient.publicKey,
      lamports: TRANSFER_AMOUNT * LAMPORTS_PER_SOL,
    }),
  );

  // Adım 6: İşlemi hem ödeyen hem de nonce yetkisi ile imzalayın
  durableTx.sign(payer, nonceAuthority);

  // İşlemi dizileştirip saklayın veya gönderin (gerekirse)
  const serializedTx = base58.encode(
    durableTx.serialize({ requireAllSignatures: false }),
  );

  const tx = base58.decode(serializedTx);

  // Adım 7: İşlemi gönderin ve başarılı olmasını bekleyin (yetersiz fonlar nedeniyle)
  await assert.rejects(
    sendAndConfirmRawTransaction(connection, tx as Buffer, {
      skipPreflight: true, // İşlemin ağ üzerinde yola çıkmasını sağlamak için beklenmedik başarısızlıklara rağmen
    }),
  );

  // Adım 8: Başarısız işlemden sonra nonce hesabını tekrar kontrol edin
  const nonceAccountAfterAdvancing = await connection.getAccountInfo(
    nonceKeypair.publicKey,
  );
  const nonceAfterAdvancing = NonceAccount.fromAccountData(
    nonceAccountAfterAdvancing!.data,
  ).nonce;

  // Adım 9: İşlemin başarısız olmasına rağmen nonce'in ilerlediğini doğrulayın
  assert.notEqual(nonceBeforeAdvancing, nonceAfterAdvancing);
});
```

Görsel olarak `sendAndConfirmRawTransaction` fonksiyonunda `skipPreflight: true` ayarını yapıyoruz. Bu adım kritik bir öneme sahiptir, çünkü aksi halde işlem hiç ağa ulaşmaz. Bunun yerine kütüphane itiraz eder ve bir hata meydana getirir, bu da nonce'in ilerlememesiyle sonuçlanır.

Ancak, bu tüm hikaye değil. Sonraki test durumunda, bir işlemin başarısız olduğu bir senaryo ortaya çıkacak; nonce ilerlemeyecek.

### 5. Test: İşlem nonce ilerletme talimatından dolayı başarısız olursa nonce hesabı ilerlemez

Nonce'in ilerlemesi için `advanceNonce` talimatının başarılı olması gerekmektedir. Bu nedenle, işlem bu talimattan dolayı herhangi bir sebeple başarısız olursa, nonce ilerlemeyecektir.

İyi bir biçimlendirilmiş `nonceAdvance` talimatı yalnızca nonce yetkilisi işlemi imzalamadığı durumlarda başarısız olur.

Bunu eylemde görelim.

```typescript
it("İşlem nonce ilerletme talimatı başarısız olursa nonce hesabı ilerlemez", async () => {
  // Adım 1: Ödeme yapanı SOL airdrop ile başlat
  const payer = await initializeKeypair(connection, {
    airdropAmount: 3 * LAMPORTS_PER_SOL,
    minimumBalance: 1 * LAMPORTS_PER_SOL,
  });

  // Adım 2: nonce hesabı, nonce yetkisi ve alıcı için anahtar çiftleri oluşturun
  const [nonceKeypair, nonceAuthority, recipient] = makeKeypairs(3);

  // Adım 3: nonce hesabını oluşturun
  const nonceAccount = await createNonceAccount(
    connection,
    payer,
    nonceKeypair,
    nonceAuthority.publicKey,
  );
  const nonceBeforeAdvancing = nonceAccount.nonce;

  console.log("Göndermeden önceki nonce:", nonceBeforeAdvancing);

  // Adım 4: eksik nonce yetkisi imzası nedeniyle başarısız olacak bir kalıcı işlemden oluşuyor
  const durableTx = new Transaction();
  durableTx.feePayer = payer.publicKey;

  // nonce hesabının depolanan nonce'unu son blok hash'i olarak kullanın
  durableTx.recentBlockhash = nonceAccount.nonce;

  // nonce ilerletme talimatını ekleyin
  durableTx.add(
    SystemProgram.nonceAdvance({
      authorizedPubkey: nonceAuthority.publicKey,
      noncePubkey: nonceKeypair.publicKey,
    }),
  );

  // Aktarma talimatı ekleyin
  durableTx.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: recipient.publicKey,
      lamports: 0.1 * LAMPORTS_PER_SOL,
    }),
  );

  // İşlemi yalnızca ödeyen ile imzalayın, nonce yetkisi imzasını gizleyin (bu başarısızlığa neden olacak)
  durableTx.sign(payer);

  // Adım 5: İşlemi dizileştirip saklayın
  const serializedTx = base58.encode(
    durableTx.serialize({ requireAllSignatures: false }),
  );

  // Dizileştirilen işlemi çözümleyin
  const tx = base58.decode(serializedTx);

  // Adım 6: İşlemi gönderin ve eksik nonce yetkisi imzası nedeniyle başarısız olacağını bekleyin
  await assert.rejects(
    sendAndConfirmRawTransaction(connection, tx as Buffer, {
      skipPreflight: true, // Beklenmedik başarısızlıklara rağmen işlem ağ üzerinde ulaşmasını sağlamak
    }),
  );

  // Adım 7: Başarısız işlemden sonra nonce hesabını tekrar kontrol edin
  const nonceAccountAfterAdvancing = await connection.getAccountInfo(
    nonceKeypair.publicKey,
  );
  const nonceAfterAdvancing = NonceAccount.fromAccountData(
    nonceAccountAfterAdvancing!.data,
  ).nonce;

  // Adım 8: Başarısızlığın nonce ilerletme talimatından kaynaklandığını doğrulayın ve nonce'in ilerlemediğini doğrulayın
  assert.equal(nonceBeforeAdvancing, nonceAfterAdvancing);
});
```

### 6. Test: İşlemi imzala ve ardından nonce yetkisini değiştir

Üzerinden geçeceğimiz son test durumu kalıcı bir işlem oluşturmaktır. Yanlış nonce yetkisi ile göndermeyi deneyin (başarısız olacak). Sonrasında nonce yetkisini değiştirin ve bu kez doğru olanla gönderin ve başarılı olsun.

```typescript
it("Zaten imzalanmış bir adres için nonce yetkisini değiştirdikten sonra gönderir", async () => {
  try {
    // Adım 1: SOL airdrop ile ödemeyi başlat
    const payer = await initializeKeypair(connection, {
      airdropAmount: AIRDROP_AMOUNT,
      minimumBalance: MINIMUM_BALANCE,
    });

    // Adım 2: nonce hesabı, nonce yetkisi ve alıcı için anahtar çiftleri oluşturun
    const [nonceKeypair, nonceAuthority, recipient] = makeKeypairs(3);

    // Adım 3: nonce hesabını oluşturun
    const nonceAccount = await createNonceAccount(
      connection,
      payer,
      nonceKeypair,
      nonceAuthority.publicKey,
    );
    const nonceBeforeAdvancing = nonceAccount.nonce;

    console.log("Göndermeden önceki nonce:", nonceBeforeAdvancing);

    // Adım 4: Başlangıçta başarısız olacak kalıcı bir işlem oluşturun
    const durableTransaction = new Transaction();
    durableTransaction.feePayer = payer.publicKey;

    // nonceAccount'ın saklanan nonce'unu son blokhash olarak kullanın
    durableTransaction.recentBlockhash = nonceAccount.nonce;

    // nonce ilerletme talimatını ekleyin
    durableTransaction.add(
      SystemProgram.nonceAdvance({
        authorizedPubkey: payer.publicKey, // nonce authority olmalı, başarısız olacak
        noncePubkey: nonceKeypair.publicKey,
      }),
    );

    // Bir transfer talimatı ekleyin
    durableTransaction.add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient.publicKey,
        lamports: TRANSACTION_LAMPORTS,
      }),
    );

    // İşlemi sadece ödeyici ile imzalayın
    durableTransaction.sign(payer);

    // Adım 5: İşlemi dizileştirip saklayın
    const serializedTransaction = base58.encode(
      durableTransaction.serialize({ requireAllSignatures: false }),
    );

    const deserializedTx = base58.decode(serializedTransaction);

    // Adım 6: İşlemi göndermeyi deneyin, yanlış yetki nedeniyle başarısız olmasını bekleyin
    await assert.rejects(
      sendAndConfirmRawTransaction(connection, deserializedTx, {
        skipPreflight: true, // Başarısızlık olmasına rağmen, işlemin ağı geçmesini sağlar
      }),
    );

    // Adım 7: Failden sonra nonce'in ilerlemediğini doğrulayın
    const nonceAccountAfterAdvancing = await connection.getAccountInfo(
      nonceKeypair.publicKey,
    );
    const nonceAfterAdvancing = NonceAccount.fromAccountData(
      nonceAccountAfterAdvancing!.data,
    ).nonce;
    assert.equal(nonceBeforeAdvancing, nonceAfterAdvancing);

    // Adım 8: nonce yetkisini ödeyene değiştirin
    const nonceAuthSignature = await sendAndConfirmTransaction(
      connection,
      new Transaction().add(
        SystemProgram.nonceAuthorize({
          noncePubkey: nonceKeypair.publicKey,
          authorizedPubkey: nonceAuthority.publicKey,
          newAuthorizedPubkey: payer.publicKey, // yetkiyi ödeyen olarak değiştiriyor
        }),
      ),
      [payer, nonceAuthority],
    );

    console.log(
      "Nonce Yetki İmzası:",
      getExplorerLink("tx", nonceAuthSignature, "localnet"),
    );

    // Adım 9: İşlemi tekrar gönderin, bu sefer başarılı olmalıdır
    const transactionSignature = await sendAndConfirmRawTransaction(
      connection,
      deserializedTx as Buffer,
      {
        skipPreflight: true, // Ön uç kontrolü olmadan gönderimi sağlar
      },
    );

    console.log(
      "İşlem İmzası:",
      getExplorerLink("tx", transactionSignature, "localnet"),
    );
  } catch (error) {
    console.error("Test başarısız oldu:", error);
    throw error;
  }
});
```

### 8. Testleri Çalıştır

Son olarak, testleri çalıştıralım:

```bash
npm start
```

Tüm testlerin başarıyla geçtiğinden emin olun.

Referansınız için, testlerin başarılı bir şekilde yürütülmesini gösteren bir ekran görüntüsü:

![image](https://github.com/user-attachments/assets/03b2396a-f146-49e2-872b-6a657a209cd4)

Bu sonucu görüyorsanız, kalıcı nonce uygulamanız doğrudur!

Tebrikler! Artık kalıcı nonce'ların nasıl çalıştığını biliyorsunuz!

## Meydan Okuma

Bir kalıcı işlem oluşturan ve bunu bir dosyaya kaydeden bir program yazın, ardından kalıcı işlem dosyasını okuyup bunu ağa gönderen ayrı bir program oluşturun.