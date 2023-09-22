# Attestation 📜

Bu kısımda Attester rolündeki bireyimiz 🕵️‍♂️ `Credential`'ı işleyecek ve şu işlemleri yapacaktır:

- Attest et 🖋️ veya reddet ❌
- Zincir üzerinde attestation bilgisini depola 📦

:::info Attestation neydi hatırlayalım 🤔

- Merkezi olmayan bir mimaride, daha az güven ile geçerlilik sağlayabiliriz. 🌐 Azalan güven ile geçerliliği sağlamak için bir doğrulama sistemi gereklidir. KILT'te, bunu Tastik Etmeler (Attestations) aracılığıyla gerçekleştiriyoruz. ✅

- Tastik Etmeler, genellikle güvenilir bir onaylayıcı (attester) tarafından gerçekleştirilen, bir iddianın (claim) içindeki verilerin geçerliliğini kanıtlama veya onaylama eylemini içerir. 🔍👍
:::

## Credential Attest Etme 🖊️

`attestCredential` fonksiyonu `Attester`'ın DID'sini kendi içerisine almaktadır. 📌 Tüm belgeler hazır olduğunda `Claimer`'dan elde ettiğimiz `credential`'ı attest edebiliriz. 📝 Bu `credential` zincire eklendiğinden `revoke` edilene kadar geçerli sayılmaktadır. 🔗🔒

:::info Nedir bu Revoke?
KILT SDK, halka açık kimlik bilgileriyle ilgili bazı süper işlevlere sahip. 🚀

- **Kimlik Bilgilerini İptal Etme ve Kaldırma 🚫📜**: Kimlik bilgisi tanımlayıcısı, halka açık kimlik bilgileri üzerinde birçok işlem yapmak için kahramanımız! 🦸‍♂️ Bazı durumlarda, bir kimlik bilgisini iptal ederken zincirde bırakmak isteyebiliriz. Ancak bazen de, "Hadi bu kimlik bilgisini hem iptal edelim hem de kaldıralım!" diyebiliriz. İlk durumda, depozito geri gelmez çünkü kimlik bilgisi hâlâ zincirde. Ama ikincisinde, tüm bilgi silinir ve depozito geri döner! 💸

- **Bir Kimlik Bilgisini İptal Etmeme 🔄**: Eğer bir kimlik bilgisini iptal ettik ama zincirden kaldırmadıysak, onu tekrar canlandırabiliriz! 🌱 Örneğin, bir sürücü belgesi bir süreliğine "askıya alındı" olarak işaretlenebilir ama sonra tekrar aktif hale getirilebilir. 🚗💨

- **Depozitoyu Geri Almak 💰**: Şimdi, bu kısım ilginç! 🤓 Tüm bu işlemler için genellikle kimlik bilgisi onaylayıcısına ihtiyaç duyarız. Ancak, bir kimlik bilgisini kaldırmak ve depozitoyu geri almak için bu kuralı bir kenara bırakabiliriz. Bu işlemde sadece depozitoyu ödeyen kişiye ihtiyaç vardır. 🎉
:::

### İçe Aktarılan Modüller ve Fonksiyonlar

```typescript title="attestCredential.ts"
import { config as envConfig } from 'dotenv'
import * as Kilt from '@kiltprotocol/sdk-js'
import { generateAccount } from './generateAccount'
import { generateCredential } from '../claimer/generateCredential'
import { generateKeypairs } from './generateKeypairs'
import { generateLightDid } from '../claimer/generateLightDid'
```

İlk olarak paketlerimiz içeri ekleyerek başlarız. Bu paketler daha öncesinde de kullandığımız paketler olmaktadır. Sırasıyla incelenecek olunursa:

- `dotenv`: Ortam değişkenlerini yüklemek için kullanılır.
- `Kilt`: KILT protokolü SDK'sı.
- Diğer fonksiyonlar: Daha önce tanımlanmış yardımcı fonksiyonlar.
### `attestCredential` Fonksiyonu

Bu fonksiyon, bir kimlik bilgisini (credential) onaylamak için kullanılır. Onaylama işlemi, kimlik bilgisinin doğruluğunu blockchain'e yazarak gerçekleştirilir.

```typescript title="attestCredential.ts"
export async function attestCredential(
  attesterAccount: Kilt.KiltKeyringPair,
  attesterDid: Kilt.DidUri,
  credential: Kilt.ICredential,
  signCallback: Kilt.SignExtrinsicCallback
): Promise<void> {
  // ...
}
```

Paketlerimizi eklediğimize göre Attestation işlemini gerçekleştireceğimiz fonksiyonları tanımlayabiliriz. Bunlardan ilki `attestCredential()` fonksiyonu olacaktır. Bu fonksiyon içerisine 4 adet parametre alacak ve bir `Promise` döndürecektir. İçerisine aldığı parametrelere teker teker bakılacak olunursa:

- `attesterAccount`: Attester'ın hesap anahtar çifti (secret, public)
- `attesterDid`: Attester'ın DID'si.
- `credential`: Onaylanacak credential.
- `signCallback`: İşlemi imzalamak için kullanılacak geri çağırım fonksiyonu.

#### API Bağlantısı

```typescript title="attestCredential.ts"
const api = Kilt.ConfigService.get('api')
```

Fonksiyonun içerisine girdiğimizde ilk olarak `api` bağlantısı yaparak KILT-SDK'yi kodumuza bağlamamız gerekmektedir. 

#### CType ve Root Hash Alma

```typescript title="attestCredential.ts"
const { cTypeHash, claimHash } = Kilt.Attestation.fromCredentialAndDid(
  credential,
  attesterDid
)
```

Attestation işlemini artık `Attestation.fromCredentialAndDid()` fonksiyonu ile gerçekleştirebiliriz. Bu fonksiyon içerisine attest etmek istediğimiz `credential`'ı ve `attesterDid`'sini almaktadır. Çıktı olarak zincire kaydetmek için ihtiyacımız olan Hash değerlerini bize sağlamaktadır.

#### İşlem Oluşturma ve Yetkilendirme

```typescript title="attestCredential.ts"
const tx = api.tx.attestation.add(claimHash, cTypeHash, null)
const extrinsic = await Kilt.Did.authorizeTx(
  attesterDid,
  tx,
  signCallback,
  attesterAccount.address
)
```

Blokzincirde neredeyse her işlemi gerçekleştirmek için o işlemin transferini gerçekleştirmek gerekmektedir. `attestation` işlemi de istisna değildir. Yaptığımız `attestation` işlemini kaydetmek ve zincire yazmak için transfer formatına çevirmemiz gerekmektedir. Bu işlem için sırasıyla:
- `api.tx.attestation.add(...)`: Yeni bir onaylama işlemi oluşturur. İçerisine bir önceki satırda oluşturduğumuz attestation hash değerlerini alır.
- `Kilt.Did.authorizeTx(...)`: Oluşturulan işlemi yetkilendirir. Bu yetkilendirmeyi `attesterDid` sayesinde yapar.

#### İşlemi Blockchain'e Gönderme

```typescript title="attestCredential.ts"
console.log('Attester -> create attestation...')
await Kilt.Blockchain.signAndSubmitTx(extrinsic, attesterAccount)
```

Son olarak yetkilendirilmiş işlemi `attester` hesabı imzalar ve blokzincire gönderir.

Bu şekilde `attestCredential` fonksiyonu kimlik bilgisini onaylar ve bu onayı blockchain'e yazar.

### `attestingFlow` Fonksiyonu

Bu fonksiyon, kimlik bilgisi oluşturma ve onaylama işlemlerini bir araya getirir. İşte fonksiyonun ana hatları:

```typescript title="attestCredential.ts"
export async function attestingFlow(
  claimerDid: Kilt.DidUri,
  attesterAccount: Kilt.KiltKeyringPair,
  attesterDid: Kilt.DidUri,
  signCallback: Kilt.SignExtrinsicCallback
): Promise<Kilt.ICredential> {
  // ...
}
```

Yukarıda da görüldüğü üzere `attestCredential` fonksiyonuna benzer bir yapı sunulmuştur. Bu asenkron fonksiyon, `attestCredential` fonksiyonunu kullanarak bir kimlik bilgisini onaylar ve onaylanmış kimlik bilgisini döndürür.

- `claimerDid`: İddia sahibinin (claimer) DID'si.
- `attesterAccount` ve `attesterDid`: Onaylayıcının hesap ve DID bilgileri.
- `signCallback`: İşlemi imzalamak için kullanılacak geri çağırım fonksiyonu.

#### Kimlik Bilgisi Oluşturma

Fonksiyonun içerisine girildiğinde hem credential oluşturabilir hemde bu Credential'ı onaylamak için `attestCredential` fonksiyonu çağırabiliriz.

```typescript title="attestCredential.ts"
const credential = generateCredential(claimerDid, {
  age: 19,
  name: 'Göktuğ Ayan'
})
```

İlk olarak, `generateCredential` fonksiyonu ile bir kimlik bilgisi oluşturulur. Bu kimlik bilgisi, iddia sahibinin DID'ini (`claimerDid`) ve iddia içeriğini (`age: 19, name: 'Göktuğ Ayan'`) alır.
#### Kimlik Bilgisini Onaylama

```typescript title="attestCredential.ts"
await attestCredential(attesterAccount, attesterDid, credential, signCallback)
```

`attestCredential` fonksiyonu çağrılır ve kimlik bilgisi onaylanır. Bu adımda, onaylayıcının hesap bilgileri ve DID'ini, oluşturulan kimlik bilgisi ve imza callback fonksiyonu parametre olarak verilir.

#### Kimlik Bilgisini Döndürme

```typescript title="attestCredential.ts"
return credential
```

Onaylanmış kimlik bilgisi döndürülür.

Bu fonksiyon, bir kimlik bilgisinin nasıl oluşturulacağını ve onaylanacağını adım adım gösterir. Genellikle, bir kullanıcı arayüzü veya API üzerinden bu tür işlemler tetiklenir.

:::info İki Fonksiyon Neden Yazdık Ya?

**`attestCredential` Fonksiyonu**

Bu fonksiyon, bir kimlik bilgisini (credential) onaylamak için kullanılır. Yani, bu fonksiyon bir kimlik bilgisini alır ve onu blockchain'e yazarak onaylar. Bu, kimlik bilgisinin doğruluğunu kesinleştirmek için gereklidir. Bu fonksiyon genellikle bir onaylayıcı (attester) tarafından çağrılır.

 **`attestingFlow` Fonksiyonu**

Bu fonksiyon, kimlik bilgisinin onaylanması için gereken tüm adımları içerir. İlk olarak, bir kimlik bilgisi oluşturur (`generateCredential` fonksiyonu ile). Daha sonra, bu kimlik bilgisini `attestCredential` fonksiyonu ile onaylar. Bu, genellikle bir uygulama akışı içinde, örneğin bir kullanıcı arayüzü üzerinden, gerçekleşir.

![alternative text](../../static/img/kilt/spiderman.png "Welcome")

**Neden İkisine de İhtiyaç Duyuyoruz?**

1. **Modülerlik ve Yeniden Kullanılabilirlik**: `attestCredential` fonksiyonu, sadece kimlik bilgilerini onaylamak için kullanılır. Bu, farklı senaryolarda veya farklı uygulama akışlarında yeniden kullanılabilir. Örneğin, farklı türdeki kimlik bilgilerini onaylamak için kullanılabilir.

2. **İş Akışı Yönetimi**: `attestingFlow` fonksiyonu, bir kimlik bilgisinin oluşturulmasından onaylanmasına kadar olan tüm süreci yönetir. Bu, uygulamanın daha karmaşık iş akışlarını kolayca yönetebilmesini sağlar.

3. **Esneklik**: Her iki fonksiyon da farklı ihtiyaçlar için tasarlanmıştır. `attestCredential` daha düşük seviyeli bir işlevsellik sağlarken, `attestingFlow` daha yüksek seviyeli bir iş akışı sağlar. Bu sayede, geliştiriciler ihtiyaca göre daha esnek bir şekilde kod yazabilirler.

4. **Okunabilirlik ve Bakım**: Kodun parçalara ayrılması, kodun daha okunabilir ve bakımının daha kolay olmasını sağlar. Örneğin, kimlik bilgilerini onaylama ile ilgili bir sorun olduğunda, bu sorunu çözmek için sadece `attestCredential` fonksiyonuna odaklanabiliriz.

Bu nedenlerle, her iki fonksiyona da ihtiyaç duyulmaktadır.
:::

### Ana Kod Bloğu

```typescript title="attestCredential.ts"
if (require.main === module) {
  ;(async () => {
    // ...
  })()
}
```

Bu kod bloğu, bu dosya doğrudan çalıştırıldığında yürütülecek kodu içerir. Ortam değişkenlerini yükler, KILT ile bağlantı kurar ve `attestingFlow` fonksiyonunu çağırır.

:::note Her şey bir arada
Ehliyet kemerlerinizi bağlayın DID'leri oluşturmaktan Credential attest etmeye birçok işlem yapacağız. Bu işlemlerin kodlarını zaten yazmıştık şimdi çalıştırmak kaldı!
:::

#### Ortam Değişkenlerini Yükleme

```typescript title="attestCredential.ts"
envConfig()
```

Bu satır, `.env` dosyasındaki ortam değişkenlerini yükler.

#### Try Catch Yapısı Kurma

```typescript title="attestCredential.ts"
    try {
		.
		.
		.
    } catch (e) {
      console.log('Error while going throw attesting workflow')
      throw e
    }
```

Tüm işlemleri fonksiyonlar içerisinde hata olmasına karşın `try` `catch` yapısı içinde oluşturacağız. Yazacağımız kodlar `try` kısımı içerisinde yer alacak herhangi bir hata `catch` fonksiyonuna takılıp hata verecektir. 

#### KILT'a Bağlanma

```typescript title="attestCredential.ts"
await Kilt.connect(process.env.WSS_ADDRESS as string)
```

Bu satır, KILT protokolüne bağlanır. Bağlantı adresi `.env` dosyasından alınır. KILT'in test ağına bağlanacağız.

#### Attester Hesabını Oluşturma

```typescript title="attestCredential.ts"
const attesterAccountMnemonic = process.env.ATTESTER_ACCOUNT_MNEMONIC as string
const { account: attesterAccount } = generateAccount(attesterAccountMnemonic)
```
Bu satırlar, ortam değişkenlerinden alınan bir mnemonik kullanarak bir Attester hesabı oluşturur. `generateAccount` fonksiyonunu daha önce birlikte yazmıştık.

#### Attester DID Oluşturma

```typescript title="attestCredential.ts"
const attesterDidMnemonic = process.env.ATTESTER_DID_MNEMONIC as string
const { authentication, assertionMethod } = generateKeypairs(attesterDidMnemonic)
const attesterDidUri = Kilt.Did.getFullDidUriFromKey(authentication)
```

Bu satırlar, bir Attester DID oluşturmak için kullanılır. Aynı şekilde `generateKeypairs`'ı da DID oluştururken yazmıştık. 

#### Claimer DID Oluşturma

```typescript title="attestCredential.ts"
const claimerDidMnemonic = process.env.CLAIMER_DID_MNEMONIC as string
const claimerDid = await generateLightDid(claimerDidMnemonic)
```

Bu satırlar, bir Claimer DID oluşturmak için kullanılır. Bu sefer Light DID kullanacağız.

#### Kimlik Bilgisi Oluşturma ve Onaylama

```typescript title="attestCredential.ts"
const credential = await attestingFlow(
  claimerDid.uri,
  attesterAccount,
  attesterDidUri,
  async ({ data }) => ({
    signature: assertionMethod.sign(data),
    keyType: assertionMethod.type
  })
)
```

Bu satır kimlik bilgisi oluşturma ve onaylama iş akışını başlatır. Kullandığı fonksiyon bir önceki tanımladığımız fonksiyon olan `attestingFlow` fonksiyonudur.

#### Sonuçları Yazdırma

```typescript title="attestCredential.ts"
console.log('The claimer build their credential and now has to store it.')
console.log('Add the following to your .env file. ')
console.log(`CLAIMER_CREDENTIAL='${JSON.stringify(credential)}'`)
```

Bu satırlar, oluşturulan kimlik bilgisini yazdırır ve kullanıcının bu bilgiyi `.env` dosyasına eklemesi gerektiğini belirtir.

:::info Genel bir bakış ve fonksiyonların işlevi
Hadi Koda genel bir bakış yaparak ne işe yaradığını çözmeye çalışalım.

```typescript title="attestCredential.ts"
import { config as envConfig } from 'dotenv'

import * as Kilt from '@kiltprotocol/sdk-js'

import { generateAccount } from './generateAccount'
import { generateCredential } from '../claimer/generateCredential'
import { generateKeypairs } from './generateKeypairs'
import { generateLightDid } from '../claimer/generateLightDid'

export async function attestCredential(
  attesterAccount: Kilt.KiltKeyringPair,
  attesterDid: Kilt.DidUri,
  credential: Kilt.ICredential,
  signCallback: Kilt.SignExtrinsicCallback
): Promise<void> {
  const api = Kilt.ConfigService.get('api')

  // Get CType and root hash from the provided credential.
  const { cTypeHash, claimHash } = Kilt.Attestation.fromCredentialAndDid(
    credential,
    attesterDid
  )

  // Create the tx and authorize it.
  const tx = api.tx.attestation.add(claimHash, cTypeHash, null)
  const extrinsic = await Kilt.Did.authorizeTx(
    attesterDid,
    tx,
    signCallback,
    attesterAccount.address
  )

  // Submit the tx to write the attestation to the chain.
  console.log('Attester -> create attestation...')
  await Kilt.Blockchain.signAndSubmitTx(extrinsic, attesterAccount)
}

export async function attestingFlow(
  claimerDid: Kilt.DidUri,
  attesterAccount: Kilt.KiltKeyringPair,
  attesterDid: Kilt.DidUri,
  signCallback: Kilt.SignExtrinsicCallback
): Promise<Kilt.ICredential> {
  // First the claimer.
  const credential = generateCredential(claimerDid, {
    age: 27,
    name: 'Mia Musterfrau'
  })

  // ... send the request to the attester

  // The attester checks the attributes and attests the provided credential.
  await attestCredential(attesterAccount, attesterDid, credential, signCallback)

  // Return the generated credential.
  return credential
}

// Don't execute if this is imported by another file.
if (require.main === module) {
  ;(async () => {
    envConfig()

    try {
      await Kilt.connect(process.env.WSS_ADDRESS as string)

      const attesterAccountMnemonic = process.env
        .ATTESTER_ACCOUNT_MNEMONIC as string
      const { account: attesterAccount } = generateAccount(
        attesterAccountMnemonic
      )

      const attesterDidMnemonic = process.env.ATTESTER_DID_MNEMONIC as string
      const { authentication, assertionMethod } =
        generateKeypairs(attesterDidMnemonic)
      const attesterDidUri = Kilt.Did.getFullDidUriFromKey(authentication)

      const claimerDidMnemonic = process.env.CLAIMER_DID_MNEMONIC as string
      const claimerDid = await generateLightDid(claimerDidMnemonic)

      const credential = await attestingFlow(
        claimerDid.uri,
        attesterAccount,
        attesterDidUri,
        async ({ data }) => ({
          signature: assertionMethod.sign(data),
          keyType: assertionMethod.type
        })
      )
      console.log('The claimer build their credential and now has to store it.')
      console.log('Add the following to your .env file. ')
      console.log(`CLAIMER_CREDENTIAL='${JSON.stringify(credential)}'`)
    } catch (e) {
      console.log('Error while going throw attesting workflow')
      throw e
    }
  })()
}
```

Bu kod içerisindeki `attestingFlow` fonksiyonu tüm işleyişi baştan sona bizlere göstermektedir. 

- İlk olarak `Claimer` bir `credential` oluşturur ve `Attester`'a gönderir. 
- Attester bu `credential` içerisindeki bilgilerin doğruluğunu kontrol eder. 
- Doğruluğunu kontrol ettikten sonra red eder veya onaylar. Eğer onaylarsa zincire yazar.
- Zincire yazdıktan sonra `Claimer` artık tüm belgeleri istediği zaman `verifier` ile paylaşabilir.
:::


## Kodu Çalıştıralım!

Kodu çalıştırmak için terminalde `kilt-rocks` klasöründe bulunduğumuza  emin olduktan sonra alt kısımdaki kodu çalıştırabiliriz:

```terminal
yarn ts-node attester/attestCredential.ts
```

:::tip
Artık oluşan `Credential`'ı kopyalayıp `Verifier`'lar ile paylaşmak için kullanabilirsin
:::

:::info Helal Olsun be 
`Attester` olarak yapman gereken işlemler tamamlandı. Başarılı bir şekilde `credential` oluşturdun ve bu `attestation` hash değerini zincire yazdın. 

Artık `Verifier` ile devam etmeye hazırsın.
:::