---
title: SP Ağı'na Katıl - BNB Greenfield SP
description: Bu kılavuz, SP Ağı'na katılmanıza yardımcı olacaktır, Mainnet ve Testnet. Adım adım işlemleri ve önemli bilgileri içermektedir.
keywords: [SP Ağı, BNB Greenfield, Mainnet, Testnet, Depolama Sağlayıcı]
---

Bu kılavuz, SP Ağı'na katılmanıza yardımcı olacaktır: Mainnet ve Testnet.

- `Mainnet SP Olmak için Ön Gereksinimler`
- `SP Ağı'na Nasıl Katılırım?`
  - `1. Teklif Gönderin`
    - `Sıcak Cüzdan Kılavuzu`
    - `Donanım Cüzdanı Kılavuzu`
    - `Parametreleri Anlama`
  - `2. Teklif için BNB Yatırın`
  - `3. Oylamayı Bekleyin ve Oylama Sonucunu Kontrol Edin`
  - `4. SP'yi Aktifleştir`
    - `Depolama Sağlayıcı Standart Testi`
    - `SP durumunu güncelleyin`
  - `5. SP adresine yatırma`
    - `Finansman Adresi`
    - `Operatör Adresi`
- `Depolama Sağlayıcı İşlemleri`
  - `EditStorageProvider`
  - `SP Fiyatını Güncelle`
  - `SP Kotayı Güncelle`
  - `SP Nesnelerini Kurtar`
  - `SP Gelirini Talep Et`
    - `Birincil SP'nin gelirini sorgulamak için`
    - `İkincil SP'nin gelirini sorgulamak için`
- `Araçlar`
- `Sorun Giderme`

---

## Mainnet SP Olmak için Ön Gereksinimler
Veri hizmetlerinin kararlı bir şekilde sağlanmasını sağlamak için Depolama Sağlayıcılarının mainnet'e katılmak için belirli kriterleri karşılamaları gerekmektedir.
- SP, testnet'te en az bir ay katılmalıdır.
- SP, testnet'te 100'den fazla kova içinde 1K'dan fazla dosya saklamalıdır.
- SP'nin geçtiğimiz hafta içinde herhangi bir kesinti olayı olmamalıdır.

---

## SP Ağı'na Nasıl Katılırım?

Greenfield Blockchain doğrulayıcıları, depolama sağlayıcılarını seçmekten sorumludur. Yeni bir depolama sağlayıcı eklemek için her on-chain teklif için, BNB yatırma süresi ve doğrulayıcıların oy vermesi için bir oylama süresi vardır. Teklif kabul edildiğinde, yeni SP ağa katılabilir.

Yönetim parametrelerini [buradan](https://greenfield-chain.bnbchain.org/openapi#/Query/GovV1Params) sorgulayabilirsiniz.

### 1. Teklif Gönderin

SP, oylama onaylandıktan sonra otomatik olarak yürütülecek Msg bilgilerini belirten bir on-chain teklifi başlatmalıdır. Bu durumda Msg `MsgCreateStorageProvider`'dır. Yatırım tokenlarının, zincirde belirtilen minimum yatırım tokenlarından büyük olması gerektiğini belirtmekte fayda var.

=== "Mainnet"

    ```
    rpcAddr = "https://greenfield-chain.bnbchain.org:443"
    chainId = "greenfield_1017-1"
    ```

=== "Testnet"

    ```
    rpcAddr = "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org:443"
    chainId = "greenfield_5600-1"
    ```

#### Sıcak Cüzdan Kılavuzu

`gnfd` komutunu kullanarak doğrudan bir depolama sağlayıcı oluşturmak için işlemi gönderebilirsiniz. Bunun için, lütfen finansman hesabının özel anahtarını Keystore'a aktarın.

> **Not:** Mainnet için bir sıcak cüzdan kullanmak güvenli değildir. Bunun yerine, `Donanım Cüzdanı Kılavuzu` için donanım cüzdanı kullanma talimatlarına başvurmalısınız.

Depolama sağlayıcı oluşturma komutu:
```shell
./build/bin/gnfd tx sp create-storage-provider ./create_storage_provider.json --from {funding_address} --node ${rpcAddr} --chain-id ${chainId} --keyring-backend os
```

create_storage_provider.json için içerik, gerekli doğru değerlerle değiştirilmelidir:
```shell
cat ./create_storage_provider.json
{
  "messages":[
  {
    "@type":"/greenfield.sp.MsgCreateStorageProvider",
    "description":{
      "moniker":"{moniker}",
      "identity":"{identity}",
      "website":"{website}",
      "security_contact":"{security_contract}",
      "details":"{details}"
    },
    "sp_address":"{operator_address}",
    "funding_address":"{funding_address}",
    "seal_address":"{seal_address}",
    "approval_address":"{approval_address}",
    "gc_address":"{gc_address}",
    "maintenance_address":"{maintenance__address}",
    "endpoint":"https://{your_endpoint}",
    "deposit":{
      "denom":"BNB",
      # Mainnet: 500000000000000000000, Testnet: 1000000000000000000000
      "amount":"500000000000000000000"
    },
    "read_price":"0.1469890427",
    "store_price":"0.02183945725",
    "free_read_quota": 1073741824,
    "creator":"0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2",
    "bls_key":"{bls_pub_key}",
    "bls_proof":"{bls_proof}"
  }
],
  "metadata":"4pIMOgIGx1vZGU=",
  "title":"Create <name> Storage Provider",
  "summary":"create <name> Storage Provider",
  "deposit":"1000000000000000000BNB"
}
```

#### Donanım Cüzdanı Kılavuzu

Gnfd komutu donanım cüzdanıyla bağlantı kurmak için mevcut değildir, bu nedenle işlemleri göndermek için [gnfd-tx-sender](https://gnfd-tx-sender.nodereal.io/) kullanmalısınız. İşte adımlar:

1. İşlem verisini oluşturun.
```shell
./build/bin/gnfd tx sp create-storage-provider ./create_storage_provider.json --from {funding_address} --print-eip712-msg-type
```
2. [gnfd-tx-sender](https://gnfd-tx-sender.nodereal.io/) web sitesine gidin.
3. Donanım cüzdanınızı Metamask'a ekleyin ve cüzdanı bağlayın.
4. `Özel Tx` sayfasına gidin ve adım 1'de oluşturulan işlem verisini doldurun.
5. İşlemi göndermek için `Gönder` butonuna tıklayın.

![teklif gönderin](../../../images/bnb-chain/bnb-greenfield/static/asset/019-submit-proposal.jpg)

#### Parametreleri Anlama

!!! note
    Aşağıdaki komut ile hükümet modülü adresini alabilirsiniz
    
    ```shell
    curl -X GET "https://greenfield-chain-us.bnbchain.org/cosmos/auth/v1beta1/module_accounts/gov" -H  "accept: application/json"
    ```

- `endpoint`, geçidin URL'sidir
- `read_price` ve `store_price` birimi `wei/bytes/s`'dir
- `free_read_quota` birimi *Bytes*'dır
- `creator`, `gov module` adresidir
- `metadata` isteğe bağlıdır

### 2. Teklif için BNB Yatırın

!!! note
    Yukarıdaki komut ile teklif için minimum yatırımı alabilirsiniz. Teklifi sunarken başlangıç yatırımının `min_deposit`'ten büyük olduğundan emin olun.
    
    ```shell
    curl -X GET "https://greenfield-chain-us.bnbchain.org/cosmos/gov/v1/params/deposit" -H  "accept: application/json"
    ```

Teklif için gereken başlangıç yatırım tutarı, minimum yatırımı gerektiriyorsa bu adımı atlayabilirsiniz.

Her teklif, oylama aşamasına girmek için yeterince token yatırmak zorundadır.

```shell
./build/bin/gnfd tx gov deposit ${proposal_id} 1BNB --from ${funding_address} --keyring-backend os --node ${rpcAddr} --chain-id ${chainId}
```

### 3. Oylamayı Bekleyin ve Oylama Sonucunu Kontrol Edin

Teklif başarılı bir şekilde gönderildikten sonra, oylamanın tamamlanmasını ve teklifin onaylanmasını beklemelisiniz.
Mainnet'te **7 gün**, Testnet'te ise **1 gün** sürecektir. Geçtikten ve başarıyla yürürlüğe girdikten sonra, depolama sağlayıcısının katıldığını doğrulayabilirsiniz.

!!! warning
    Lütfen depolama sağlayıcı hizmetinin katılmadan önce çalıştığından emin olun.

SP'nin başarılı bir şekilde oluşturulup oluşturulmadığını doğrulamak için on-chain SP bilgilerini kontrol edebilirsiniz.

```shell
./build/bin/gnfd query sp storage-providers --node ${rpcAddr}
```

Alternatif olarak, teklifin yürütme durumu hakkında bilgi edinmek için teklifi kontrol edebilirsiniz.

```shell
./build/bin/gnfd query gov proposal ${proposal_id} --node ${rpcAddr}
```

### 4. SP'yi Aktifleştir

#### Depolama Sağlayıcı Standart Test

Teklif onaylandıktan sonra, SP'nin durumu `STATUS_IN_MAINTENANCE` olur. Fonksiyonel anormallikler nedeniyle kesinti yaşamamak için öncelikle bakım hesabı ile tam bir fonksiyonel test yapmalısınız.
[SP standart testi](https://github.com/bnb-chain/greenfield-sp-standard-test) için referans alabilirsiniz.

#### SP durumunu güncelleyin

Test tamamlandığında, SP'yi `STATUS_IN_SERVICE` olarak aktifleştirmek için bir işlem göndermelisiniz.

```shell
gnfd tx sp update-status [sp-address] STATUS_IN_SERVICE [flags]
```

Daha fazla bilgi için `Bakım Modu` bölümüne bakınız.

### 5. SP adresine yatırma

#### Finansman Adresi
Yeni bir SP olarak, finansman adresine minimum bir miktar BNB yatırmalısınız.
Başlangıç yatırımı gereksiniminin farklı ortamlarda değiştiğini lütfen unutmayın.
Greenfield testnet/mainnet'in genesis uç noktasından `sp.params.min_deposit` değerini kontrol edebilirsiniz.
Bu belge yazıldığı sırada,

- [https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org/genesis](https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org/genesis) adresine göre, testnet'teki SP'nin finansman adresinde minimum **1000BNB** yatırması gerekmektedir.
- [https://greenfield-chain.bnbchain.org/genesis](https://greenfield-chain.bnbchain.org/genesis) adresine göre, mainnet'teki SP'nin finansman adresinde minimum **500BNB** yatırması gerekmektedir.

Ayrıca, `Adım 2`'de ağa katılmak için, bir SP bir teklif başlatmalı ve oylama aşamasına girmek için 1 BNB stake etmelidir.
Oylama sonuçlandıktan sonra, 1 BNB orijinal hesaba geri iade edilecektir.
Bu nedenle, Finansman Adresinin bu maliyetleri karşılamak için ek olarak >1 BNB ayırması tavsiye edilir.

#### Operatör Adresi
SP operatör adresi, "Küresel Sanal Grubu Oluştur", "Depolama Sağlayıcıyı Düzenle", "Depolama Sağlayıcı Durumunu Güncelle" ve diğer işlemleri greenfield zincirine göndermek için kullanılacaktır.
Bu nedenle, işlem ücreti için bazı BNB yatırılması gerekmektedir.
**SP operatör adresinin en az 0.1 BNB bulundurması önerilir, ancak maksimum miktarda olması gerekmez.**

---

## Depolama Sağlayıcı İşlemleri

### EditStorageProvider

Bu komut, SP'nin bilgilerini, geçidi, açıklaması vb. düzenlemek için kullanılır.

Kullanım:
```shell
gnfd tx sp edit-storage-provider [sp-address] [flags]
```

Örneğin, geçidi düzenlemek:
```shell
./build/bin/gnfd tx sp edit-storage-provider ${operator_address} --endpoint ${new_endpoint} --from ${operator_address} --keyring-backend os --node ${rpcAddr} --chain-id ${chainId}
```

### SP Fiyatını Güncelle

Depolama sağlayıcısının okuma, saklama fiyatını ve serbest okuma kotasını güncelleyin, belirli bir değerde bir değişiklik yoksa mevcut değeri de sağlamalısınız.

Fiyat birimi, byte başına saniye başına wei BNB'yi gösteren bir ondalık sayıdır.
**Örneğin**, fiyat 0.02183945725 ise, yaklaşık olarak $0.018 / GB / Ay anlamına gelir.
`(0.02183945725 * (30 * 86400) * (1024 * 1024 * 1024) * 300 / 10 ** 18 ≈ 0.018, BNB fiyatının 300 USD olduğunu varsayın)`

Serbest okuma kotasının birimi bayt olup, 1GB serbest kotanın 1073741824 olması gerekir.

Kullanım:
```shell
gnfd tx sp update-price [sp-address] [read-price] [store-price] [free-read-quota] [flags]
```

Örnek:
```shell
./build/bin/gnfd tx sp update-price ${operator_address} 0.1469890427 0.02183945725 1073741824 --from ${operator_address} --keyring-backend os --node ${rpcAddr} --chain-id ${chainId}
```

### SP Kotayı Güncelle

Yukarıdaki `update-price` komutunun yanı sıra, SP için serbest okuma kotasını güncellemek için `gnfd-sp` komutunu da kullanabilirsiniz.
`update.quota` komutu, SP'nin serbest kotasını güncellemek için kullanılır, bu işlem, depolama fiyatı ve okuma fiyatını değiştirmeden blockchain'e gönderilecek bir işlem oluşturur.

Kullanım:
```shell
gnfd-sp update.quota [komut seçenekleri] [argümanlar...]
```

Örnek:
```shell
./build/bin/gnfd-sp update.quota --quota 1073741824 --config ./config.toml
```

### SP Nesnelerini Kurtar

Yukarıdaki komutların yanı sıra, `gnfd-sp` komutunu kullanarak SP için nesneleri kurtarabilirsiniz,
nesnenin birincil veya ikincil SP olup olmadığı önemli değildir.
`recover.object` komutu, bir nesneyi veya nesneleri kurtarmak için kullanılır, bu işlem, kurtarmak istediğiniz nesnelerin bir kopyasını almak için diğer SP'lere bir talep gönderir.

Kullanım:
```shell
gnfd-sp recover.object [komut seçenekleri] [argümanlar...]
```

Örnek:
```shell
./build/bin/gnfd-sp recover.object --config ./config.toml -b bucket_name -o single_object_name
./build/bin/gnfd-sp recover.object --config ./config.toml -b bucket_name -l object_name1//_object_name2//object_name3
```

### SP Gelirini Talep Et

Geliri talep etmek için, bir depolama sağlayıcısı küresel sanal grup aileleri veya küresel sanal gruplarda geliri düzenlemek için `settle` komutunu kullanabilir. Geliri düzenlemek için küresel sanal grup ailelerini veya küresel sanal grupları bulmak için, bir depolama sağlayıcısı `gnfd-sp` komutlarının `query.primary.sp.income` veya `query.secondary.sp.income` komutlarını kullanabilir.

#### Birincil SP'nin gelirini sorgulamak için
Kullanım:
```shell
# küresel sanal grup ailelerinde sp'nin gelirini sorgulama
gnfd-sp query.primary.sp.income --config config.toml --sp.id ${sp_id}
```

Yanıt örneği şu şekilde olacaktır:

```js
querying primary sp income details for sp  1
query timestamp 1698830787 2023-11-01 17:26:27 +0800 CST
query results: [{"vgf_id":2,"stream_record":{"account":"primary_sp_virtual_payment_account_address_1","crud_timestamp":1698631653,"netflow_rate":"4643666191","static_balance":"1093710972008743","buffer_balance":"0","lock_balance":"0","frozen_netflow_rate":"0"},"income":"2018422795287337"},{"vgf_id":13,"stream_record":{"account":"primary_sp_virtual_payment_account_address_2","crud_timestamp":1698745565,"netflow_rate":"5452639431","static_balance":"38607334626064242","buffer_balance":"0","lock_balance":"0","frozen_netflow_rate":"0"},"income":"39072019463652924"},{"vgf_id":15,"stream_record":{"account":"primary_sp_virtual_payment_account_address_3","crud_timestamp":1698573876,"netflow_rate":"1925652979","static_balance":"55285141693450020","buffer_balance":"0","lock_balance":"0","frozen_netflow_rate":"0"},"income":"55779863125937889"},{"vgf_id":23,"stream_record":{"account":"primary_sp_virtual_payment_account_address_4","crud_timestamp":1698745588,"netflow_rate":"5063874897","static_balance":"2339430126330703","buffer_balance":"0","lock_balance":"0","frozen_netflow_rate":"0"},"income":"2770867203680206"},{"vgf_id":246,"stream_record":{"account":"primary_sp_virtual_payment_account_address_5","crud_timestamp":1698667216,"netflow_rate":"59568181","static_balance":"19326420423320","buffer_balance":"0","lock_balance":"0","frozen_netflow_rate":"0"},"income":"29070047357671"}]
```

Hesaplanmamış gelirin birimi **wei BNB**'dir. Yukarıdaki sorgu sonuçları dizisindeki ilk eleman, sp 1'in vgf_id 2'de **2018422795287337** **wei BNB** kazandığını belirtmektedir.

#### İkincil SP'nin gelirini sorgulamak için

```shell
# küresel sanal gruplarda sp'nin gelirini sorgulama
gnfd-sp query.secondary.sp.income --config config.toml --sp.id ${sp_id}
```

Yanıt örneği şu şekilde olmalıdır:
```js
querying secondary sp income details for sp  1
query timestamp 1698830440 2023-11-01 17:20:40 +0800 CST
query results: [{"gvg_id":2531,"stream_record":{"account":"secondary_sp_virtual_payment_account_address_1","crud_timestamp":1695347375,"netflow_rate":"22256589564","static_balance":"917684637479280","buffer_balance":"0","lock_balance":"0","frozen_netflow_rate":"0"},"income":"13073138794535490"},{"gvg_id":8,"stream_record":{"account":"secondary_sp_virtual_payment_account_address_2","crud_timestamp":1696735440,"netflow_rate":"6698761332","static_balance":"24312367733445348","buffer_balance":"0","lock_balance":"0","frozen_netflow_rate":"0"},"income":"6391045453997558"},{"gvg_id":11,"stream_record":{"account":"secondary_sp_virtual_payment_account_address_3","crud_timestamp":1696072153,"netflow_rate":"6832159830","static_balance":"15803326565544654","buffer_balance":"0","lock_balance":"0","frozen_netflow_rate":"0"},"income":"5774730701092644"}
    ...
]
```
Hesaplanmamış gelirin birimi **wei BNB**'dir. Yukarıdaki sorgu sonuçları dizisindeki ilk eleman, sp 1'in gvg_id 2531'de **13073138794535490** **wei BNB** kazandığını belirtmektedir.


```shell
# küresel sanal grup ailesinde veya küresel sanal gruplarda geliri düzenle
gnfd tx virtualgroup settle [global-virtual-group-family-id] [global-virtual-group-ids] [flags]
```

Örnek:
```shell
# küresel sanal grup ailelerinde sp'nin gelirini sorgulama
gnfd-sp query.primary.sp.income --config config.toml --sp.id 1
```
```shell
# küresel sanal gruplarda sp'nin gelirini sorgulama
gnfd-sp query.secondary.sp.income --config config.toml --sp.id 2
```
```shell
# kimlik numarası 100 olan küresel sanal grup ailesinde geliri düzenleme
gnfd tx virtualgroup settle 100 0 [flags]

# kimlik numarası 2 veya 3 veya 4 olan küresel sanal gruplarda geliri düzenleme
gnfd tx virtualgroup settle 0 2,3,4 [flags]
```

---

## Araçlar

SP, işlevlerini doğrulamak için Greenfield Cmd veya DCellar'ı kullanabilir:

- Greenfield Cmd: [repo](https://github.com/bnb-chain/greenfield-cmd) üzerinden daha fazla detay alabilirsiniz.
- DCellar: [Mainnet](https://dcellar.io/), [Testnet](https://testnet.dcellar.io).

---

## Sorun Giderme

Sorunlarla karşılaşırsanız, lütfen `SP yaygın sorunları` bölümüne başvurun.