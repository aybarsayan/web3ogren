# Cüzdan Sözleşmesi Türleri

TON Blockchain üzerinde farklı versiyonlarda cüzdanlar hakkında duymuş olabilirsiniz. Ancak bu versiyonlar ne anlama geliyor ve birbirlerinden nasıl farklılar?

Bu makalede, TON cüzdanlarının çeşitli versiyonlarını ve değişikliklerini keşfedeceğiz.

:::info
Başlamadan önce, makaleyi tam olarak anlamak için aşina olmanız gereken bazı terimler ve kavramlar var:
 - `Mesaj yönetimi`, çünkü bu cüzdanların ana işlevselliğidir.
 - `FunC dili`, çünkü bu dili kullanarak yapılan implementasyonlara büyük ölçüde dayanacağız.
:::

## Ortak Kavram

Gerginliği azaltmak için, cüzdanların TON ekosisteminde belirli bir varlık olmadığını anlamalıyız. Onlar hâlâ kod ve verilerden oluşan akıllı sözleşmelerdir ve bu anlamda TON'daki diğer aktörlerle (yani, akıllı sözleşme) eşittirler.

Kendi özel akıllı sözleşmeniz veya herhangi bir başkası gibi, cüzdanlar da harici ve dahili mesajlar alabilir, dahili mesajlar ve günlükler gönderebilir ve "get" yöntemleri sağlayabilir. Dolayısıyla, soru şudur: ne tür bir işlevsellik sağlarlar ve versiyonlar arasında nasıl farklılık gösterirler?

Her cüzdan versiyonunu, standart bir harici arayüz sağlayan, cüzdanlarla etkileşime geçmek için farklı harici istemcilerin aynı şekilde etkileşimde bulunmasına olanak tanıyan bir akıllı sözleşme implementasyonu olarak düşünebilirsiniz. Bu implementasyonları ana TON monorepo'da FunC ve Fift dillerinde bulabilirsiniz:

 * [ton/crypto/smartcont/](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/) 

## Temel Cüzdanlar

### Cüzdan V1

Bu en basit olanıdır. Sadece aynı anda dört işlem göndermenize izin verir ve imzanız ve seqno dışında hiçbir şeyi kontrol etmez.

Cüzdan kaynak kodu:
 * [ton/crypto/smartcont/wallet-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet.fif) 

Bu versiyon, bazı ciddi sorunları olduğu için normal uygulamalarda bile kullanılmaz:
 - Sözleşmeden `seqno` ve halka açık anahtarı almak için kolay bir yol yoktur.
 - `valid_until` kontrolü yoktur, bu nedenle işlemin çok geç onaylanmayacağından emin olamazsınız.

İlk sorun `V1R2` ve `V1R3`'te düzeltildi. `R`, "revizyon" anlamına gelir. Genellikle, revizyonlar yalnızca `get` yöntemleri ekleyen küçük güncellemelerdir; bunların hepsini `new-wallet.fif`'in değişiklik geçmişinde bulabilirsiniz. Buradan sonra yalnızca en son revizyonlara odaklanacağız.

Yine de, her bir sonraki versiyon öncekinin işlevselliğini devraldığı için, bunu değiştirmemek önemli olacaktır; bu, sonraki versiyonlar için bize yardımcı olacaktır.

#### Kalıcı Bellek Düzeni
 - **seqno**: 32-bit uzunlukta sıra numarası.
 - **public-key**: 256-bit uzunlukta halka açık anahtar.

#### Harici Mesaj Gövde Düzeni
1. Veri:
    - **signature**: 512-bit uzunlukta ed25519 imzası.
    - **msg-seqno**: 32-bit uzunlukta sıra numarası.
    - **(0-4)mode**: her bir mesaj için gönderme modunu tanımlayan en fazla dört 8-bit uzunlukta tamsayı.
2. Mesajları içeren hücrelere kadar 4 referans.

Gördüğünüz gibi, cüzdanın ana işlevi TON blockchain ile dış dünyadan güvenli bir şekilde iletişim sağlamaktır. `seqno` mekanizması yeniden oynama saldırılarına karşı koruma sağlar ve `Ed25519 imzası`, cüzdan işlevselliğine yetkili erişim sağlar. Bu mekanizmalardan her birinin detaylarına girmeyeceğiz, çünkü bunlar `harici mesaj` belgelerinde ayrıntılı olarak açıklanmıştır ve harici mesaj alan akıllı sözleşmeler arasında oldukça yaygındır. Yük veri, hücrelere kadar 4 referans ve bunlarla ilişkili mod sayısını içermektedir ve bu doğrudan `send_raw_message(cell msg, int mode)` yöntemine aktarılacaktır.

:::warning
Cüzdanın gönderdiğiniz dahili mesajlar için herhangi bir doğrulama sağlamadığını unutmayın. Veriyi [dahili mesaj düzenine](http://localhost:3000/v3/documentation/smart-contracts/message-management/sending-messages#message-layout) göre seri hale getirmek programcının (yani, harici istemcinin) sorumluluğundadır.
:::

#### Çıkış Kodları
| Çıkış Kodu    | Açıklama                                                          |
|---------------|--------------------------------------------------------------------|
| 0x21          | `seqno` kontrolü başarısız oldu, yanıt koruması gerçekleşti         |
| 0x22          | `Ed25519 imzası` kontrolü başarısız oldu                           |
| 0x0           | Standart başarılı yürütme çıkış kodu.                             |

:::info
Not edin ki `TVM` `standart çıkış kodlarına` sahip olup (`0x0` bunlardan biridir), örneğin, [gas](https://docs.ton.org/develop/smart-contracts/fees) bittiğinde `0xD` kodunu alabilirsiniz.
:::

#### Get Yöntemleri
1. `int seqno()` mevcut saklanan `seqno`'yu döner.
2. `int get_public_key()` mevcut saklanan halka açık anahtarı döner.

### Cüzdan V2

Cüzdan kaynak kodu:
 
 * [ton/crypto/smartcont/wallet-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-code.fc)

Bu versiyon, işlemin çok geç onaylanmasını istemiyorsanız, bir işlem için bir zaman sınırı belirlemek için kullanılan `valid_until` parametresini tanıtır. Bu versiyon ayrıca, `V2R2`'de eklenen halka açık anahtar için bir `get`-yöntemi de yoktur.

Önceki versiyonla karşılaştırıldığında tüm farklılıklar, `valid_until` işlevselliğinin eklenmesinin bir sonucudur. `valid_until` kontrolünün başarısızlığını belirten yeni bir çıkış kodu eklendi: `0x23`. Ayrıca, harici mesaj gövde düzenine yeni bir UNIX zaman alanı eklendi; bu, işlemin zaman sınırlamasını ayarlamaktadır. Tüm `get` metodları aynı kalır.

#### Harici Mesaj Gövde Düzeni
1. Veri:
    - **signature**: 512-bit uzunlukta ed25519 imzası.
    - **msg-seqno**: 32-bit uzunlukta sıra numarası.
    - **valid-until**: 32-bit uzunlukta Unix-zaman tamsayısı.
    - **(0-4)mode**: her bir mesaj için gönderme modunu tanımlayan en fazla dört 8-bit uzunlukta tamsayı.
2. Mesajları içeren hücrelere kadar 4 referans.

### Cüzdan V3

Bu versiyon, aynı halka açık anahtarı kullanarak birden fazla cüzdan oluşturmanıza olanak tanıyan `subwallet_id` parametresini tanıtır (yani, yalnızca bir seed ifadesine sahip olabilirsiniz ve birden fazla cüzdanınız olabilir). Daha önce olduğu gibi, `V3R2` sadece halka açık anahtar için bir `get`-yöntemi ekler.

Cüzdan kaynak kodu:
 * [ton/crypto/smartcont/wallet3-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)

Esasen, `subwallet_id` sadece sözleşme dağıtıldığında sözleşme durumuna eklenen bir numaradır. TON'daki cüzdan adresi, durumunun ve kodunun bir hash'idir, dolayısıyla cüzdan adresi farklı bir `subwallet_id` ile değişecektir. Bu versiyon şu anda en yaygın olarak kullanılan versiyondur. Çoğu kullanım durumunu kapsar ve temiz, basit ve büyük ölçüde önceki versiyonlarla aynıdır. Tüm `get` yöntemleri aynı kalır.

#### Kalıcı Bellek Düzeni
- **seqno**: 32-bit uzunlukta sıra numarası.
- **subwallet**: 32-bit uzunlukta subwallet kimliği.
- **public-key**: 256-bit uzunlukta halka açık anahtar.

#### Harici Mesaj Düzeni
1. Veri:
    - **signature**: 512-bit uzunlukta ed25519 imzası.
    - **subwallet-id**: 32-bit uzunlukta subwallet kimliği.
    - **msg-seqno**: 32-bit uzunlukta sıra numarası.
    - **valid-until**: 32-bit UNIX zaman tamsayısı.
    - **(0-4)mode**: her bir mesaj için gönderme modunu tanımlayan en fazla dört 8-bit tamsayı.
2. Mesajları içeren hücrelere kadar 4 referans.

#### Çıkış Kodları
| Çıkış Kodu    | Açıklama                                                             |
|---------------|----------------------------------------------------------------------|
| 0x23          | `valid_until` kontrolü başarısız oldu; işlem onaylama süresi çok geç  |
| 0x23          | `Ed25519 imzası` kontrolü başarısız oldu                              |
| 0x21          | `seqno` kontrolü başarısız oldu; yanıt koruması etkinleştirildi      |
| 0x22          | `subwallet-id` saklananla eşleşmiyor                                  |
| 0x0           | Standart başarılı yürütme çıkış kodu.                                |

### Cüzdan V4

Bu versiyon, önceki versiyonların tüm işlevselliğini korurken, ayrıca çok güçlü bir şey de getirir: **eklentiler**.

Cüzdan kaynak kodu:
 * [ton-blockchain/wallet-contract](https://github.com/ton-blockchain/wallet-contract)

Bu özellik, geliştiricilerin bir kullanıcının cüzdanıyla birlikte çalışan karmaşık mantıklar gerçekleştirmesine olanak tanır. Örneğin, bir DApp'in belirli özellikleri kullanmak için her gün kullanıcıdan küçük bir miktar jeton ödemesi talep edebileceği bir durum söz konusu olabilir. Bu durumda, kullanıcı işlemi imzalayarak eklentiyi cüzdanına yüklemelidir. Eklenti, talep edildiğinde her gün belirlenen adrese jeton gönderecektir.

#### Eklentiler

Eklentiler, geliştiricilerin dilediği gibi uygulayabileceği diğer akıllı sözleşmelerdir. Cüzdan ile ilgili olarak, bunlar, cüzdanın kalıcı belleğinde bir `sözlükte` depolanan akıllı sözleşme adresleridir. Bu eklentiler, fon talep etme ve cüzdanın "izinli liste" sinden kendilerini çıkarma izinlerine sahiptir.

#### Kalıcı Bellek Düzeni
 - **seqno**: 32-bit uzunlukta sıra numarası.
 - **subwallet-id**: 32-bit uzunlukta subwallet-id.
 - **public-key**: 256-bit uzunlukta halka açık anahtar.
 - **plugins**: eklentileri içeren sözlük (boş olabilir).

#### Dahili Mesajları Alma

Önceki cüzdan versiyonlarının hepsi, dahili mesajları alma konusunda basit bir implementasyona sahipti. Sadece herhangi bir gönderenin gelen fonlarını kabul ettiler ve iç mesaj gövdesini dikkate almadılar; diğer bir deyişle, boş bir `recv_internal` yöntemleri vardı. Ancak, daha önce belirtildiği üzere, cüzdanın dördüncü versiyonu, iki yeni mevcut işlemi tanıtmaktadır. Dahili mesaj gövde düzenine bakalım:

- **op-code?**: 32-bit uzunlukta işlem kodu. Bu isteğe bağlı bir alan; mesaj gövdesinde 32 bit'ten az içeren, yanlış bir op-kodu içeren veya tanımlı bir eklenti olarak kaydedilmemiş bir gönderen adresinin bulunduğu herhangi bir mesaj, önceki cüzdan versiyonlarına benzer şekilde basit transfer olarak değerlendirilecektir.
- **query-id**: 64-bit uzunlukta tamsayı. Bu alanın akıllı sözleşmenin davranışı üzerinde bir etkisi yoktur; sözleşmeler arasındaki mesaj zincirlerini takip etmek için kullanılır.
1. op-code = 0x706c7567, fon talebi işlem kodu.
    - **toncoins**: VARUINT16 miktarında talep edilen toncoinler.
    - **extra_currencies**: Talep edilen ek para birimlerinin miktarını içeren sözlük (boş olabilir).
2. op-code = 0x64737472, izinli listeden eklenti-gönderenin kaldırılması talebi.

#### Harici Mesaj Gövde Düzeni

 - **signature**: 512-bit uzunlukta ed25519 imzası.
 - **subwallet-id**: 32-bit uzunlukta subwallet kimliği.
 - **valid-until**: 32-bit uzunlukta Unix-zaman tamsayısı.
 - **msg-seqno**: 32-bit uzunlukta sıra tamsayısı.
 - **op-code**: 32-bit uzunlukta işlem kodu.
1. op-code = 0x0, basit gönderim.
    - **(0-4)mode**: her bir mesaj için gönderim modunu tanımlayan en fazla dört 8-bit uzunlukta tamsayı.
    - **(0-4)messages**: Mesajları içeren hücrelere kadar dört referans.
2. op-code = 0x1, eklenti dağıtma ve yükleme. 
    - **workchain**: 8-bit uzunlukta tamsayı.
    - **balance**: VARUINT16 toncoin miktarında başlangıç bakiyesi.
    - **state-init**: Eklentinin başlangıç durumunu içeren hücre referansı.
    - **body**: İçerik olan hücre referansı.
3. op-code = 0x2/0x3, eklenti yükleme / eklentiyi kaldırma.
    - **wc_n_address**: 8-bit uzunlukta workchain_id + 256-bit uzunlukta eklenti adresi.
    - **balance**: VARUINT16 toncoin miktarında başlangıç bakiyesi.
    - **query-id**: 64-bit uzunlukta tamsayı.

Gördüğünüz gibi, dördüncü versiyon, önceki versiyonlara benzer şekilde `0x0` işlem kodu aracılığıyla standart işlevselliği sunmaya devam etmektedir. `0x2` ve `0x3` işlemleri eklentiler sözlüğünün manipülasyonuna olanak tanır. `0x2` durumunda, bu adresle eklentiyi kendiniz dağıtmanız gerektiğini unutmayın. Buna karşın, `0x1` işlem kodu, durum_init alanı ile dağıtım işlemini de yönetir.

:::tip
`state_init` adı itibarıyla pek anlamlı değilse, aşağıdaki referanslara göz atın:
 * `ton-blokzincirindeki-adresler`
 * `dağıtım mesajı gönderme`
 * `dahili mesaj düzeni`
:::

#### Çıkış Kodları
| Çıkış Kodu    | Açıklama                                                                  |
|---------------|---------------------------------------------------------------------------|
| 0x24          | `valid_until` kontrolü başarısız oldu, işlem onaylama süresi çok geç     |
| 0x23          | `Ed25519 imzası` kontrolü başarısız oldu                                  |
| 0x21          | `seqno` kontrolü başarısız oldu, yanıt koruması etkinleştirildi          |
| 0x22          | `subwallet-id` saklananla eşleşmiyor                                      |
| 0x27          | Eklentiler sözlüğü manipülasyonu başarısız oldu (0x1-0x3 `recv_external` op-kodları) |
| 0x50          | Fon talebi için yeterli bakiye yok                                          |
| 0x0           | Standart başarılı yürütme çıkış kodu.                                     |

#### Get Yöntemleri
1. `int seqno()` mevcut saklanan `seqno`'yu döner.
2. `int get_public_key()` mevcut saklanan halka açık anahtarı döner.
3. `int get_subwallet_id()` mevcut subwallet ID'yi döner.
4. `int is_plugin_installed(int wc, int addr_hash)` tanımlanan workchain ID ve adres hash'ine sahip eklentinin kurulu olup olmadığını kontrol eder.
5. `tuple get_plugin_list()` eklentilerin listesini döner.

### Cüzdan V5

Şu anda en modern cüzdan versiyonudur ve Tonkeeper ekibi tarafından geliştirilen, V4'ün yerini almayı ve rastgele uzantılar sağlamayı amaçlamaktadır.

V5 cüzdan standardı, kullanıcılar ve tüccarlar için deneyimi iyileştiren birçok fayda sunar. V5, gaz ücretsiz işlemleri, hesap devri ve kurtarma, tokenler ve Toncoin ile abonelik ödemelerini ve düşük maliyetli çoklu transferleri destekler. Önceki işlevselliği (V4) korumanın yanı sıra, yeni sözleşme aynı anda 255 mesaja kadar gönderim yapmanıza olanak tanır.

Cüzdan kaynak kodu:
 * [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

TL-B şeması:
 * [ton-blockchain/wallet-contract-v5/types.tlb](https://github.com/ton-blockchain/wallet-contract-v5/blob/main/types.tlb)

:::warning
Önceki cüzdan versiyonu spesifikasyonlarının aksine, `TL-B` şemasına dayanacağız, çünkü bu cüzdan versiyonunun arayüz implementasyonu görece karmaşıktır. Bunun için her biri için bazı açıklamalar sağlayacağız. Yine de, temel bir anlayış gereklidir; cüzdan kaynak kodu ile birlikte bu yeterli olmalıdır.
:::

#### Kalıcı Bellek Düzeni

```
contract_state$_ 
    is_signature_allowed:(## 1) 
    seqno:# 
    wallet_id:(## 32) 
    public_key:(## 256) 
    extensions_dict:(HashmapE 256 int1) = ContractState;
```

Gördüğünüz gibi, `ContractState`, önceki versiyonlarla karşılaştırıldığında büyük değişiklikler geçirmemiştir. Ana fark, imzayı ve saklanan halka açık anahtarı sınırlayan veya izin veren yeni **is_signature_allowed** 1-bit bayraktır. Bu değişikliğin önemini daha sonraki konularda açıklayacağız.

#### Kimlik Doğrulama Süreci

```
signed_request$_             // 32 (opcode from outer)
  wallet_id:    #            // 32
  valid_until:  #            // 32
  msg_seqno:    #            // 32
  inner:        InnerRequest //
  signature:    bits512      // 512
= SignedRequest;             // Toplam: 688 .. 976 + ^Cell

internal_signed#73696e74 signed:SignedRequest = InternalMsgBody;

internal_extension#6578746e 
    query_id:(## 64) 
    inner:InnerRequest = InternalMsgBody;

external_signed#7369676e signed:SignedRequest = ExternalMsgBody;
```

Mesajlarımızın gerçek yükü olan `InnerRequest`'e geçmeden önce, versiyon 5'in kimlik doğrulama sürecindeki önceki versiyonlardan nasıl farklı olduğuna bakalım. `InternalMsgBody` kombinatori, dahili mesajlar aracılığıyla cüzdan işlemlerine erişimin iki yolunu tanımlar. İlk yöntem, daha önceki sürümden zaten aşina olduğumuz yöntemdir: `extensions_dict` içinde saklanan, daha önce kaydedilmiş bir eklenti olarak kimlik doğrulama. İkinci yöntem ise, harici isteklerle benzer şekilde, saklanan halka açık anahtar ve imza aracılığıyla kimlik doğrulamasıdır.

İlk bakışta, bu gereksiz bir özellik gibi görünebilir, ancak aslında bu, cüzdanınızın eklenti altyapısının bir parçası olmayan harici hizmetler (akıllı sözleşmeler) aracılığıyla taleplerin işlenmesini sağlamaktadır; bu, V5'in ana özelliklerinden biridir. Gaz ücretsiz işlemler, bu işlevselliğe dayanmaktadır.

Not edin ki, fon kabul etmek hâlâ bir seçenektir. Pratikte, kimlik doğrulama sürecini geçemeyen herhangi bir alınan dahili mesaj, transfer olarak kabul edilecektir.

#### İşlemler

Öncelikle, kimlik doğrulama sürecinde daha önce gördüğümüz `InnerRequest`'i belirtmeliyiz. Önceki versiyonun aksine, hem harici hem de dahili mesajlar aynı işlevselliğe erişebilir, yalnızca imza modunu değiştirme (yani, `is_signature_allowed` bayrağı) dışındadır.

```
out_list_empty$_ = OutList 0;
out_list$_ {n:#} 
    prev:^(OutList n) 
    action:OutAction = OutList (n + 1);

action_send_msg#0ec3c86d mode:(## 8) out_msg:^(MessageRelaxed Any) = OutAction;

// V5'teki genişletilmiş işlemler:
action_list_basic$_ {n:#} actions:^(OutList n) = ActionList n 0;
action_list_extended$_ {m:#} {n:#} action:ExtendedAction prev:^(ActionList n m) = ActionList n (m+1);

action_add_ext#02 addr:MsgAddressInt = ExtendedAction;
action_delete_ext#03 addr:MsgAddressInt = ExtendedAction;
action_set_signature_auth_allowed#04 allowed:(## 1) = ExtendedAction;

actions$_ out_actions:(Maybe OutList) has_other_actions:(## 1) {m:#} {n:#} other_actions:(ActionList n m) = InnerRequest;
```

`InnerRequest`'i iki işlem listesi olarak düşünebiliriz: ilki, `OutList`, bir mesaj gönderim talebi içeren hücre referanslarının isteğe bağlı bir zinciridir, her biri mesaj moduna göre yönlendirilmiştir. İkincisi, bir-bit bayrağı `has_other_actions` ile yönetilen `ActionList` zinciridir; bu, eklentili işlemler varlığını işaret eder. İlk iki eklenti eylemi, `action_add_ext` ve `action_delete_ext`, ekleme veya silme istediğimiz dahili adresle birlikte takip edilir. Üçüncüsü, `action_set_signature_auth_allowed`, halka açık anahtar aracılığıyla kimlik doğrulamasını kısıtlar veya izin verir ve cüzdanla etkileşimde bulunmanın tek yolunu eklentiler aracılığıyla bırakır. Bu işlevsellik, kaybolan veya tehlikedeki özel anahtar durumunda son derece önemli olabilir.

:::info
Maksimum işlem sayısının 255 olduğunu not edin; bu, `c5` TVM kaydedicisinde gerçekleştirilmesinin sonucudur. Teknik olarak, boş `OutAction` ve `ExtendedAction` ile bir talep gönderebilirsiniz, ancak bu durumda, sadece fon kabul etmekle benzer bir durum olacaktır.
:::

#### Çıkış Kodları

| Çıkış Kodu     | Açıklama                                                                          |
|----------------|----------------------------------------------------------------------------------|
| 0x84           | İmza kullanarak kimlik doğrulama denemesi, bu devre dışı bırakıldığında         |
| 0x85           | `seqno` kontrolü başarısız, yanıt koruması gerçekleşti                           |
| 0x86           | `wallet-id` saklanan ile eşleşmiyor                                               |

| 0x87           | `Ed25519 imza` kontrolü başarısız                                                  || 0x88           | `valid-until` kontrolü başarısız                                                    |
| 0x89           | Dış mesaj için `send_mode` +2 bit (hataları göz ardı et) ayarını zorunlu kılın.  |
| 0x8A           | `external-signed` ön eki alınan ile eşleşmiyor                                    |
| 0x8B           | Uzantı ekleme işlemi başarısız oldu                                               |
| 0x8C           | Uzantı kaldırma işlemi başarısız oldu                                             |
| 0x8D           | Desteklenmeyen genişletilmiş mesaj ön eki                                        |
| 0x8E           | Uzantı sözlüğü boşken imza ile kimlik doğrulamayı devre dışı bırakmaya çalıştı    |
| 0x8F           | Önceden ayarlanmış bir duruma imza ayarlama denemesi                               |
| 0x90           | İmza devre dışı bırakıldığında son uzantıyı kaldırma denemesi                     |
| 0x91           | Uzantının yanlış çalışma zinciri var                                              |
| 0x92           | Dış mesaj aracılığıyla imza modunu değiştirmeye çalıştı                           |
| 0x93           | Geçersiz `c5`, `action_send_msg` doğrulaması başarısız oldu                      |
| 0x0            | Standart başarılı yürütme çıkış kodu.                                            |

:::danger
`0x8E`, `0x90` ve `0x92` cüzdan çıkış kodlarının amacı, cüzdan işlevine erişiminizi kaybetmenizi engellemektir. Bununla birlikte, cüzdanın saklanan uzantı adreslerinin gerçekten TON'da mevcut olup olmadığını kontrol etmediğini unutmamalısınız. Ayrıca, başlangıç verileri olarak boş bir uzantılar sözlüğü ve kısıtlı imza modu ile bir cüzdan dağıtabilirsiniz. Bu durumda, ilk uzantınızı ekleyene kadar cüzdana açık anahtar aracılığıyla erişmeye devam edebileceksiniz. Bu nedenle, bu senaryolar konusunda dikkatli olun.
:::

#### Get yöntemleri
1. **int is_signature_allowed()**: saklanan `is_signature_allowed` bayrağını döndürür.
2. **int seqno()**: mevcut saklanan seqno'yu döndürür.
3. **int get_subwallet_id()**: mevcut alt cüzdan kimliğini döndürür.
4. **int get_public_key()**: mevcut saklanan açık anahtarı döndürür.
5. **cell get_extensions()**: uzantılar sözlüğünü döndürür.

#### Gazsız İşlemler İçin Hazırlık

v5 cüzdan akıllı sözleşmesinin, sahibi tarafından imzalanmış içsel mesajların işlenmesine izin verdiği daha önce söylenmiştir. Bu, örneğin, USDt'yi kendisinde transfer ederken ağ ücretlerinin ödenmesi gibi gazsız işlemler yapmanıza da olanak tanır. Genel şema şöyle görünmektedir:

![image](../../../../images/ton/static/img/gasless.jpg)

:::tip
Sonuç olarak, [Tonkeeper'ın Battery](https://blog.ton.org/tonkeeper-releases-huge-update#tonkeeper-battery) gibi bu işlevselliği sağlayan hizmetler olacaktır: kullanıcı adına TON'lar cinsinden işlem ücretlerini ödeyecek, ancak token cinsinden bir ücret talep edeceklerdir.
:::

#### Akış

1. Kullanıcı USDt gönderirken, iki dış USDt transferi içeren bir mesajı imzalar:
    1. Alıcının adresine USDt transferi.
    2. Hizmet lehine küçük bir USDt miktarının transferi.
2. Bu imzalı mesaj, HTTPS aracılığıyla Hizmet arka ucu tarafından zincir dışı gönderilir. Hizmet arka ucu, bunu TON blockchain'ine gönderir ve ağ ücretleri için Toncoin öder.

Gazsız arka uç API'nin beta sürümü [tonapi.io/api-v2](https://tonapi.io/api-v2) adresinde mevcuttur. Herhangi bir cüzdan uygulaması geliştiriyorsanız ve bu yöntemlerle ilgili geribildiriminiz varsa lütfen [@tonapitech](https://t.me/tonapitech) sohbetinde paylaşın.

Cüzdan kaynak kodu:
 * [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

## Özel cüzdanlar

Bazen temel cüzdanların işlevselliği yeterli olmaz. Bu nedenle, `yüksek yük`, `kilitli` ve `kısıtlı` olmak üzere birkaç özel cüzdan türü vardır.

Bunlara bir bakış atalım.

### Yüksek Yük Cüzdanları

Kısa bir süre içinde birçok mesajla çalışırken, Yüksek Yük Cüzdanı adı verilen özel bir cüzdan ihtiyacı vardır. Daha fazla bilgi için `makaleyi` okuyun.

### Kilitli cüzdan

Herhangi bir nedenle, belirli bir süre para çekme imkanı olmadan bir cüzdanda paraları kilitlemeniz gerekiyorsa, kilitli cüzdanına bir göz atın.

Bu, cüzdandan herhangi bir şey çekemeyeceğiniz zamanı ayarlamanıza olanak tanır. Ayrıca, bu ayarlara göre belirli dönemlerde bazı paraları harcayabilmenizi sağlayacak şekilde kilidi açma sürelerini de özelleştirebilirsiniz.

> **Örnek**: 10 yıl toplam vesting süresi ile 1 milyon parayı tutacak bir cüzdan oluşturabilirsiniz. İlk yıl boyunca fonlar kilitlenmesi için vade süresini bir yıl olarak ayarlayın. Ardından, `1'000'000 TON / 120 ay = ~8333 TON` her ay kilidi açılacak şekilde açma süresini bir ay olarak ayarlayabilirsiniz.

Cüzdan kaynak kodu:
 * [ton-blockchain/lockup-wallet-contract](https://github.com/ton-blockchain/lockup-wallet-contract)

### Kısıtlı cüzdan

Bu cüzdanın işlevi, normal bir cüzdan gibi hareket etmek, ancak transferleri yalnızca bir önceden belirlenmiş varış adresine sınırlandırmaktır. Bu cüzdanı oluşturduğunuzda varış adresini ayarlayabilir ve ardından yalnızca bu adrese fon transferi yapabilirsiniz. Ancak, bu cüzdanla bir doğrulayıcı çalıştırmak için hâlâ doğrulama sözleşmelerine fon transferi yapabileceğinizi unutmayın.

Cüzdan kaynak kodu:
 * [EmelyanenkoK/nomination-contract/restricted-wallet](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)

## Bilinen op kodları

:::info
Ayrıca op-kodu, op::kod ve işletim kodu olarak bilinir.
:::

| Sözleşme türü   | Hex kod        | OP::Kod                     |
|-----------------|-----------------|----------------------------|
| Küresel         | 0x00000000      | Metin Yorum                |
| Küresel         | 0xffffffff      | Atlama                     |
| Küresel         | 0x2167da4b      | `Şifreli Yorum` |
| Küresel         | 0xd53276db      | Aşırılıklar                |
| Elektrik         | 0x4e73744b      | Yeni Hisse                 |
| Elektrik         | 0xf374484c      | Yeni Hisse Onayı           |
| Elektrik         | 0x47657424      | Hisse Kurtarma Talebi      |
| Elektrik         | 0x47657424      | Hisse Kurtarma Yanıtı      |
| Cüzdan          | 0x0f8a7ea5      | Jetton Transfer            |
| Cüzdan          | 0x235caf52      | [Jetton Çağrı](https://testnet.tonviewer.com/transaction/1567b14ad43be6416e37de56af198ced5b1201bb652f02bc302911174e826ef7) |
| Jetton          | 0x178d4519      | Jetton İç Transfer         |
| Jetton          | 0x7362d09c      | Jetton Bildir              |
| Jetton          | 0x595f07bc      | Jetton Yak                 |
| Jetton          | 0x7bdd97de      | Jetton Yakma Bildirimi      |
| Jetton          | 0xeed236d3      | Jetton Durumunu Ayarla      |
| Jetton-Minter   | 0x642b7d07      | Jetton Mint                |
| Jetton-Minter   | 0x6501f354      | Jetton Yönetici Değiştir   |
| Jetton-Minter   | 0xfb88e119      | Jetton Yönetici Talep       |
| Jetton-Minter   | 0x7431f221      | Jetton Yönetici Bırak       |
| Jetton-Minter   | 0xcb862902      | Jetton Meta Verisini Değiştir |
| Jetton-Minter   | 0x2508d66a      | Jetton Güncelle             |
| Vade             | 0xd372158c      | [Yükleme](https://github.com/ton-blockchain/liquid-staking-contract/blob/be2ee6d1e746bd2bb0f13f7b21537fb30ef0bc3b/PoolConstants.ts#L28) |
| Vade             | 0x7258a69b      | Beyaz Liste Ekle            |
| Vade             | 0xf258a69b      | Beyaz Liste Ekle Yanıtı     |
| Vade             | 0xa7733acd      | Gönder                     |
| Vade             | 0xf7733acd      | Gönder Yanıtı              |
| Dedust          | 0x9c610de3      | Dedust Swap ExtOut         |
| Dedust          | 0xe3a0d482      | Dedust Swap Jetton         |
| Dedust          | 0xea06185d      | Dedust Swap İçsel         |
| Dedust          | 0x61ee542d      | Dışarı Takas              |
| Dedust          | 0x72aca8aa      | Eş Takas                  |
| Dedust          | 0xd55e4686      | Likidite Deposu İçsel     |
| Dedust          | 0x40e108d6      | Likidite Deposu Jetton     |
| Dedust          | 0xb56b9598      | Likidite Deposu tüm        |
| Dedust          | 0xad4eb6f5      | Havuzdan Ödeme             |
| Dedust          | 0x474а86са      | Ödeme                     |
| Dedust          | 0xb544f4a4      | Depo                       |
| Dedust          | 0x3aa870a6      | Para Çekme                |
| Dedust          | 0x21cfe02b      | Hazine Oluşturun          |
| Dedust          | 0x97d51f2f      | Volatil Havuz Oluştur      |
| Dedust          | 0x166cedee      | Depoyu İptal Et           |
| StonFi          | 0x25938561      | İç Takas                  |
| StonFi          | 0xf93bb43f      | Ödeme Talebi              |
| StonFi          | 0xfcf9e58f      | Likidite Sağla            |
| StonFi          | 0xc64370e5      | Takas Başarılı            |
| StonFi          | 0x45078540      | Takas Başarılı referansı   |

:::info
[DeDust belgeleri](https://docs.dedust.io/docs/swaps)

[StonFi belgeleri](https://docs.ston.fi/docs/developer-section/architecture#calls-descriptions)
:::

## Sonuç

Gördüğünüz gibi, TON'da birçok farklı cüzdan versiyonu vardır. Ancak çoğu durumda, sadece `V3R2` veya `V4R2`'ye ihtiyacınız vardır. Periyodik olarak fonların kilidini açma gibi ek işlevselliğe sahip olmak istiyorsanız, özel cüzdanlardan birini de kullanabilirsiniz.

## Ayrıca Bakın
 - `Cüzdan Akıllı Sözleşmeleri ile Çalışmak`
 - [Temel cüzdanların kaynakları](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)
 - [Versiyonların daha teknik açıklaması](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md)
 - [Cüzdan V4 kaynakları ve detaylı açıklama](https://github.com/ton-blockchain/wallet-contract)
 - [Kilitli cüzdan kaynakları ve detaylı açıklama](https://github.com/ton-blockchain/lockup-wallet-contract)
 - [Kısıtlı cüzdan kaynakları](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)
 - [TON'da Gazsız işlemler](https://medium.com/@buidlingmachine/gasless-transactions-on-ton-75469259eff2)